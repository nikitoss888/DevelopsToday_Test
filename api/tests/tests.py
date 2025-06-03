import pytest
from fastapi.testclient import TestClient
from ..main import app
from sqlmodel import Session, create_engine, SQLModel
from ..database import get_session
import httpx


TEST_DATABASE_URL = "sqlite:///./test_sca.db"

TEST_ENGINE = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)

def get_test_session():
    """Get a test database session."""
    with Session(TEST_ENGINE) as session:
        yield session

app.dependency_overrides[get_session] = get_test_session

client = TestClient(app)

async def get_breeds():
    """Fetch cat breeds from the external API."""
    async with httpx.AsyncClient() as client:
        res = await client.get("https://api.thecatapi.com/v1/breeds")

        if res.status_code == 200:
            return [breed["name"] for breed in res.json()]

        return []

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Set up the test database before running tests."""
    SQLModel.metadata.create_all(TEST_ENGINE)
    
    yield

    SQLModel.metadata.drop_all(TEST_ENGINE)


def test_spycat_create():
    """Test creating a new spy cat."""
    obj_data = {
        "name": "Whiskers",
        "years_of_experience": 5,
        "breed": "Siamese",
        "salary": 50000.0
    }

    response = client.post("/spycat/", json=obj_data)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == obj_data["name"]
    assert data["years_of_experience"] == obj_data["years_of_experience"]
    assert data["breed"] == obj_data["breed"]
    assert data["salary"] == obj_data["salary"]

def test_spycat_read():
    """Test reading a spy cat by ID."""
    
    obj_data = {
        "name": "Whiskers",
        "years_of_experience": 5,
        "breed": "Siamese",
        "salary": 50000.0
    }
    
    response = client.post("/spycat/", json=obj_data)
    assert response.status_code == 200
    spycat_id = response.json()["id"]

    response = client.get(f"/spycat/{spycat_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == spycat_id
    assert data["name"] == obj_data["name"]
    assert data["years_of_experience"] == obj_data["years_of_experience"]
    assert data["breed"] == obj_data["breed"]
    assert data["salary"] == obj_data["salary"]

@pytest.mark.asyncio
async def test_spycat_read_all():
    """Test reading all spy cats with pagination."""
    num = 3

    breeds = await get_breeds()
    if not breeds:
        pytest.skip("No breeds available from the external API")
    if len(breeds) < num:
        pytest.skip("Not enough breeds available for testing")

    ids = []
    for i in range(num):
        obj_data = {
            "name": f"SpyCat{i}",
            "years_of_experience": 10+i,
            "breed": breeds[i],
            "salary": 111 * (i + 1)
        }
        response = client.post("/spycat/", json=obj_data)
        assert response.status_code == 200
        ids.append(response.json()["id"])

    response = client.get("/spycat/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["spycats"], list)
    assert len(data["spycats"]) >= num
    assert isinstance(data["all_count"], int)
    assert data["all_count"] >= num

    for cat in data["spycats"]:
        if cat["id"] in ids:
            assert cat["name"].startswith("SpyCat")
            assert cat["years_of_experience"] >= 10
            assert cat["breed"] in breeds
            assert cat["salary"] >= 111
            assert cat["salary"] % 111 == 0

def test_spycat_update():
    """Test updating a spy cat by ID."""
    
    obj_data = {
        "name": "Bing-Bing",
        "years_of_experience": 5,
        "breed": "Siamese",
        "salary": 50000.0
    }
    
    response = client.post("/spycat/", json=obj_data)
    assert response.status_code == 200
    spycat_id = response.json()["id"]

    updated_data = {
        "name": "Ming-Ming",
        "years_of_experience": 6,
        "breed": "Persian",
        "salary": 60000.0
    }
    
    response = client.put(f"/spycat/{spycat_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] == spycat_id
    assert data["name"] == updated_data["name"]
    assert data["name"] != obj_data["name"]
    assert data["years_of_experience"] == updated_data["years_of_experience"]
    assert data["years_of_experience"] != obj_data["years_of_experience"]
    assert data["breed"] == updated_data["breed"]
    assert data["breed"] != obj_data["breed"]
    assert data["salary"] == updated_data["salary"]
    assert data["salary"] != obj_data["salary"]

def test_spycat_delete():
    """Test deleting a spy cat by ID."""
    
    obj_data = {
        "name": "Ming-Ming",
        "years_of_experience": 6,
        "breed": "Persian",
        "salary": 60000.0
    }
    
    response = client.post("/spycat/", json=obj_data)
    assert response.status_code == 200
    spycat_id = response.json()["id"]

    response = client.delete(f"/spycat/{spycat_id}")
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] == spycat_id
    assert data["name"] == obj_data["name"]
    
    response = client.get(f"/spycat/{spycat_id}")
    assert response.status_code == 404

def test_spycat_invalid_breed():
    """Test creating a spy cat with an invalid breed."""
    
    obj_data = {
        "name": "InvalidCat",
        "years_of_experience": 1,
        "breed": "InvalidBreed",
        "salary": 10000.0
    }
    
    response = client.post("/spycat/", json=obj_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid breed"}


def test_mission_create():
    """Test creating a new mission."""
    
    obj_data = {
        "cat_id": 1,
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False},
            {"name": "Target2", "country": "Country2", "is_complete": False}
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["cat_id"] == obj_data["cat_id"]
    assert data["is_complete"] == obj_data["is_complete"]

def test_mission_read():
    """Test reading a mission by ID."""
    
    obj_data = {
        "cat_id": 1,
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False},
            {"name": "Target2", "country": "Country2", "is_complete": False}
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    response = client.get(f"/mission/{mission_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == mission_id
    assert data["cat_id"] == obj_data["cat_id"]
    assert data["is_complete"] == obj_data["is_complete"]
    assert "targets" in data
    assert isinstance(data["targets"], list)
    assert len(data["targets"]) == len(obj_data["targets"])
    assert "cat" in data
    assert data["cat"] is not None
    assert data["cat"]["id"] == obj_data["cat_id"]

def test_mission_read_all():
    """Test reading all missions with pagination."""
    num = 3

    obj_data = {
        "cat_id": 1,
        "is_complete": False
    }

    for _ in range(num):
        response = client.post("/mission/", json=obj_data)
        assert response.status_code == 200

    response = client.get("/mission/")
    assert response.status_code == 200
    data = response.json()
    
    assert isinstance(data["missions"], list)
    assert len(data["missions"]) >= num
    assert isinstance(data["all_count"], int)
    assert data["all_count"] >= num

    for mission in data["missions"]:
        assert "id" in mission
        assert "cat_id" in mission
        assert mission["cat_id"] == obj_data["cat_id"]
        assert "is_complete" in mission
        assert "cat" in mission
        assert mission["cat"] is not None
        assert mission["cat"]["id"] == obj_data["cat_id"]

def test_mission_update():
    """Test updating a mission by ID."""
    
    obj_data = {
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False},
            {"name": "Target2", "country": "Country2", "is_complete": False}
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    updated_data = {
        "cat_id": 1,
        "is_complete": True,
    }

    response = client.put(f"/mission/{mission_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == mission_id
    assert data["cat_id"] == updated_data["cat_id"]
    assert data["is_complete"] == updated_data["is_complete"]

def test_mission_delete():
    """Test deleting a mission by ID."""
    
    obj_data = {
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False},
            {"name": "Target2", "country": "Country2", "is_complete": False}
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    response = client.delete(f"/mission/{mission_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == mission_id

    response = client.get(f"/mission/{mission_id}")
    assert response.status_code == 404

def test_mission_invalid_cat():
    """Test creating a mission with an invalid cat ID."""
    
    obj_data = {
        "cat_id": 9999,  # Assuming this ID does not exist
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False}
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "SpyCat not found"}

def test_spycat_read_with_missions():
    """Test reading a spy cat with its missions."""
    
    cat_data = {
        "name": "Shadow",
        "years_of_experience": 10,
        "breed": "Maine Coon",
        "salary": 75000.0
    }

    response = client.post("/spycat/", json=cat_data)
    assert response.status_code == 200
    spycat_id = response.json()["id"]

    mission_data = {
        "cat_id": spycat_id,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission_data)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    response = client.get(f"/spycat/{spycat_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == spycat_id
    assert data["name"] == cat_data["name"]
    assert data["years_of_experience"] == cat_data["years_of_experience"]
    assert data["breed"] == cat_data["breed"]
    assert data["salary"] == cat_data["salary"]
    assert data["missions"] is not None
    assert data["missions"][0]["id"] == mission_id

def test_mission_invalid_target():
    """Test creating a mission with an invalid target."""
    
    obj_data = {
        "cat_id": 1,
        "is_complete": False,
        "targets": [
            {"name": "", "country": "Country1", "is_complete": False}  # Invalid target name
        ]
    }

    response = client.post("/mission/", json=obj_data)
    assert response.status_code == 400


def test_target_create():
    """Test creating a new target."""
    mission = {
        "cat_id": 1,
        "is_complete": False,
        "targets": [
            {"name": "Target1", "country": "Country1", "is_complete": False}
        ]
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]
    
    obj_data = {
        "name": "Target2",
        "country": "Country2",
        "is_complete": False,
        "notes": [
            {"content": "Note1"},
            {"content": "Note2"}
        ]
    }

    response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["name"] == obj_data["name"]
    assert data["country"] == obj_data["country"]
    assert data["is_complete"] == obj_data["is_complete"]

def test_target_read():
    """Test reading a target by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    obj_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False,
        "notes": [
            {"content": "Note1"},
            {"content": "Note2"}
        ]
    }

    response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    response = client.get(f"/target/{target_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == target_id
    assert data["name"] == obj_data["name"]
    assert data["country"] == obj_data["country"]
    assert data["is_complete"] == obj_data["is_complete"]
    assert "notes" in data
    assert isinstance(data["notes"], list)
    assert len(data["notes"]) == len(obj_data["notes"])
    assert "mission" in data
    assert data["mission"] is not None
    assert data["mission"]["id"] == mission_id

def test_target_read_all():
    """Test reading all targets for a mission."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    num_targets = 3
    for i in range(num_targets):
        obj_data = {
            "name": f"Target{i+1}",
            "country": f"Country{i+1}",
            "is_complete": False
        }
        response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
        assert response.status_code == 200

    response = client.get(f"/mission/{mission_id}/target/")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) >= num_targets
    for i, target in enumerate(data):
        assert target["name"] == f"Target{i+1}"
        assert target["country"] == f"Country{i+1}"
        assert target["is_complete"] == False

def test_target_update():
    """Test updating a target by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    obj_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    updated_data = {
        "name": "UpdatedTarget",
        "country": "UpdatedCountry",
        "is_complete": True
    }

    response = client.put(f"/target/{target_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == target_id
    assert data["name"] == updated_data["name"]
    assert data["country"] == updated_data["country"]
    assert data["is_complete"] == updated_data["is_complete"]

def test_target_delete():
    """Test deleting a target by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    obj_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    response = client.delete(f"/target/{target_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == target_id

    response = client.get(f"/mission/{mission_id}/target/{target_id}")
    assert response.status_code == 404

def test_target_cascade_delete():
    """Test cascading delete of targets when a mission is deleted."""
    
    mission = {
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    obj_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=obj_data)
    assert response.status_code == 200

    response = client.delete(f"/mission/{mission_id}")
    assert response.status_code == 200

    response = client.get(f"/mission/{mission_id}/target/")
    assert response.status_code == 404  # Targets should be deleted with the mission


def test_note_create():
    """Test creating a new note for a target."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200
    data = response.json()

    assert data["content"] == note_data["content"]

def test_note_read():
    """Test reading a note by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200
    note_id = response.json()["id"]

    response = client.get(f"/note/{note_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == note_id
    assert data["content"] == note_data["content"]

def test_note_read_all():
    """Test reading all notes for a target."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    num_notes = 3
    for i in range(num_notes):
        note_data = {
            "content": f"This is note {i+1}."
        }
        response = client.post(f"/target/{target_id}/note/", json=note_data)
        assert response.status_code == 200

    response = client.get(f"/target/{target_id}/note/")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) >= num_notes
    for i, note in enumerate(data):
        assert note["content"] == f"This is note {i+1}."

def test_note_update():
    """Test updating a note by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200
    note_id = response.json()["id"]

    updated_data = {
        "content": "This is an updated note."
    }

    response = client.put(f"/note/{note_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == note_id
    assert data["content"] == updated_data["content"]

def test_note_delete():
    """Test deleting a note by ID."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200
    note_id = response.json()["id"]

    response = client.delete(f"/note/{note_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == note_id

    response = client.get(f"/note/{note_id}")
    assert response.status_code == 404

def test_note_cascade_target_delete():
    """Test cascading delete of notes when a target is deleted."""
    
    mission = {
        "cat_id": 1,
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200

    response = client.delete(f"/target/{target_id}")
    assert response.status_code == 200

    response = client.get(f"/target/{target_id}/note/")
    assert response.status_code == 404  # Notes should be deleted with the target

def test_note_cascade_mission_delete():
    """Test cascading delete of notes when a mission is deleted."""
    
    mission = {
        "is_complete": False
    }
    response = client.post("/mission/", json=mission)
    assert response.status_code == 200
    mission_id = response.json()["id"]

    target_data = {
        "name": "Target1",
        "country": "Country1",
        "is_complete": False
    }

    response = client.post(f"/mission/{mission_id}/target/", json=target_data)
    assert response.status_code == 200
    target_id = response.json()["id"]

    note_data = {
        "content": "This is a test note."
    }

    response = client.post(f"/target/{target_id}/note/", json=note_data)
    assert response.status_code == 200

    response = client.delete(f"/mission/{mission_id}")
    assert response.status_code == 200

    response = client.get(f"/target/{target_id}/note/")
    assert response.status_code == 404  # Notes should be deleted with the mission
