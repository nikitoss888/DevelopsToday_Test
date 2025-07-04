from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session, select, func
from .database import create_db_and_tables, get_session
from .models import \
    SpyCat, SpyCatModel, SpyCatModelRead, SpyCatsCount, \
    Mission, MissionModel, MissionModelCreate, MissionModelRead, MissionCount, \
    Target, TargetModel, TargetModelCreate, TargetModelRead, \
    Note, NoteModel, NoteModelRead, \
    breed_validate, spycat_validate, target_validate, note_validate
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the database and tables at startup."""
    create_db_and_tables()
    
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Custom exception handler for HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "headers": exc.headers if exc.headers else {}
        }
    )


@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Welcome to the SpyCat API!"}

# SpyCat endpoints
@app.post("/spycat/", response_model=SpyCat)
async def create_spycat(spycat: SpyCat, session: Session = Depends(get_session)):
    """Create a new spy cat."""
    if not await breed_validate(spycat.breed):
        raise HTTPException(status_code=400, detail="Invalid breed")
    
    if not spycat_validate(spycat):
        raise HTTPException(status_code=400, detail="Invalid SpyCat data")
    
    session.add(spycat)
    session.commit()
    session.refresh(spycat)
    
    return spycat

@app.get("/spycat/{spycat_id}", response_model=SpyCatModelRead)
async def read_spycat(spycat_id: int, session: Session = Depends(get_session)):
    """Read a spy cat by ID."""
    spycat = session.get(SpyCat, spycat_id)
    if not spycat:
        raise HTTPException(status_code=404, detail="Spy Cat not found")

    return {
        **spycat.model_dump(),
        "missions": spycat.missions
    }

@app.get("/spycat/", response_model=SpyCatsCount)
async def read_spycats(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """Read all spy cats with pagination."""
    statement = select(SpyCat)

    if skip > 0:
        statement = statement.offset(skip)
    if limit > 0:
        statement = statement.limit(limit)
    
    spycats = session.exec(statement).all()

    all_count = session.exec(select(func.count(SpyCat.id))).one()
    
    return {
        "spycats": spycats,
        "all_count": all_count
    }

@app.put("/spycat/{spycat_id}", response_model=SpyCat)
async def update_spycat(spycat_id: int, spycat: SpyCatModel, session: Session = Depends(get_session)):
    """Update a spy cat by ID."""
    existing_spycat = session.get(SpyCat, spycat_id)

    if not existing_spycat:
        raise HTTPException(status_code=404, detail="Spy Cat not found")
    
    if not await breed_validate(spycat.breed):
        raise HTTPException(status_code=400, detail="Invalid breed")
    
    if not spycat_validate(spycat):
        raise HTTPException(status_code=400, detail="Invalid SpyCat data")
    
    existing_spycat.name = spycat.name
    existing_spycat.years_of_experience = spycat.years_of_experience
    existing_spycat.breed = spycat.breed
    existing_spycat.salary = spycat.salary
    
    session.add(existing_spycat)
    session.commit()
    session.refresh(existing_spycat)
    
    return existing_spycat

@app.delete("/spycat/{spycat_id}", response_model=SpyCat)
async def delete_spycat(spycat_id: int, session: Session = Depends(get_session)):
    """Delete a spy cat by ID."""
    spycat = session.get(SpyCat, spycat_id)
    
    if not spycat:
        raise HTTPException(status_code=404, detail="Spy Cat not found")
    
    session.delete(spycat)
    session.commit()
    
    return spycat

# Mission endpoints
@app.post("/mission/", response_model=Mission)
async def create_mission(mission: MissionModelCreate, session: Session = Depends(get_session)):
    """Create a new mission."""
    if mission.cat_id:
        cat = session.get(SpyCat, mission.cat_id)
        if not cat:
            raise HTTPException(status_code=404, detail="SpyCat not found")
    
    mission_data = {
        "cat_id": mission.cat_id,
        "is_complete": mission.is_complete
    }

    db_mission = Mission(**mission_data)

    if mission.targets:
        for i, target in enumerate(mission.targets):
            target_data = {
                "name": target.name,
                "country": target.country,
                "is_complete": target.is_complete
            }

            db_target = Target(**target_data)

            if not target_validate(target):
                raise HTTPException(status_code=400, detail=f"Invalid Target #{i + 1} data")
            
            db_mission.targets.append(db_target)

    session.add(db_mission)
    session.commit()
    session.refresh(db_mission)
    
    return db_mission

@app.get("/mission/{mission_id}", response_model=MissionModelRead)
async def read_mission(mission_id: int, session: Session = Depends(get_session)):
    """Read a mission by ID."""
    mission = session.get(Mission, mission_id)
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    return {
        **mission.model_dump(),
        "cat": mission.cat,
        "targets": mission.targets
    }

@app.get("/mission/", response_model=MissionCount)
async def read_missions(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """Read all missions with pagination."""
    statement = select(Mission)

    if skip > 0:
        statement = statement.offset(skip)
    if limit > 0:
        statement = statement.limit(limit)

    missions = session.exec(statement).all()

    all_count = session.exec(select(func.count(Mission.id))).one()

    return {
        "missions": [
            {
                **mission.model_dump(),
                "cat": mission.cat
            }
            for mission in missions
        ],
        "all_count": all_count
    }

@app.put("/mission/{mission_id}", response_model=Mission)
async def update_mission(mission_id: int, mission: MissionModel, session: Session = Depends(get_session)):
    """Update a mission by ID."""
    existing_mission = session.get(Mission, mission_id)

    if not existing_mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    existing_mission.is_complete = mission.is_complete
    
    if mission.cat_id:
        cat = session.get(SpyCat, mission.cat_id)
        if not cat:
            raise HTTPException(status_code=404, detail="Spy Cat not found")
        existing_mission.cat_id = mission.cat_id
    
    session.add(existing_mission)
    session.commit()
    session.refresh(existing_mission)
    
    return existing_mission

@app.delete("/mission/{mission_id}", response_model=Mission)
async def delete_mission(mission_id: int, session: Session = Depends(get_session)):
    """Delete a mission by ID."""

    mission = session.get(Mission, mission_id)
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    if mission.cat:
        raise HTTPException(status_code=400, detail="Cannot delete mission with assigned SpyCat")
    
    session.delete(mission)
    session.commit()
    
    return mission


# Target endpoints
@app.post("/mission/{mission_id}/target/", response_model=Target)
async def create_target(mission_id: int, target: TargetModelCreate, session: Session = Depends(get_session)):
    """Create a new target."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    db_target = Target(name=target.name, country=target.country, is_complete=target.is_complete)

    if not target_validate(db_target):
        raise HTTPException(status_code=400, detail="Invalid Target data")

    mission.targets.append(db_target)

    if target.notes:
        for i, note in enumerate(target.notes):
            note_data = {
                "content": note.content
            }
            db_note = Note(**note_data)

            if not note_validate(db_note):
                raise HTTPException(status_code=400, detail=f"Invalid Note #{i + 1} data")

            db_target.notes.append(db_note)

    session.add(db_target)
    session.commit()
    session.refresh(db_target)

    return db_target

@app.get("/mission/{mission_id}/target/", response_model=list[Target])
async def read_targets(mission_id: int, session: Session = Depends(get_session)):
    """Read all targets for a mission."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    return mission.targets

@app.get("/target/{target_id}", response_model=TargetModelRead)
async def read_target(target_id: int, session: Session = Depends(get_session)):
    """Read a target by ID."""
    target = session.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    return {
        **target.model_dump(),
        "mission": target.mission,
        "notes": target.notes
    }

@app.put("/target/{target_id}", response_model=Target)
async def update_target(target_id: int, target: TargetModel, session: Session = Depends(get_session)):
    """Update a target by ID."""
    existing_target = session.get(Target, target_id)
    if not existing_target:
        raise HTTPException(status_code=404, detail="Target not found")

    existing_target.name = target.name
    existing_target.country = target.country
    existing_target.is_complete = target.is_complete

    if not target_validate(existing_target):
        raise HTTPException(status_code=400, detail="Invalid Target data")

    session.add(existing_target)
    session.commit()
    session.refresh(existing_target)

    return existing_target

@app.delete("/target/{target_id}", response_model=Target)
async def delete_target(target_id: int, session: Session = Depends(get_session)):
    """Delete a target by ID."""
    target = session.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    session.delete(target)
    session.commit()

    return target


# Note endpoints
@app.post("/target/{target_id}/note/", response_model=Note)
async def create_note(target_id: int, note: NoteModel, session: Session = Depends(get_session)):
    """Create a new note for a target."""
    if not note.content:
        raise HTTPException(status_code=400, detail="Note content is required")

    target = session.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    if target.mission.is_complete:
        raise HTTPException(status_code=400, detail="Cannot add note to a completed mission")

    if target.is_complete:
        raise HTTPException(status_code=400, detail="Cannot add note to a completed target")

    db_note = Note(content=note.content)

    if not note_validate(db_note):
        raise HTTPException(status_code=400, detail="Invalid Note data")
    
    target.notes.append(db_note)

    session.add(db_note)
    session.commit()
    session.refresh(db_note)

    return db_note

@app.get("/target/{target_id}/note/", response_model=list[Note])
async def read_notes(
    target_id: int, session: Session = Depends(get_session)
):
    """Read all notes for a target."""
    target = session.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    return target.notes

@app.get("/note/{note_id}", response_model=NoteModelRead)
async def read_note(
    note_id: int, session: Session = Depends(get_session)
):
    """Read a note by ID."""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return {
        **note.model_dump(),
        "target": note.target,
        "mission": note.target.mission
    }

@app.put("/note/{note_id}", response_model=Note)
async def update_note(
    note_id: int, note: NoteModel, session: Session = Depends(get_session)
):
    """Update a note by ID."""
    existing_note = session.get(Note, note_id)
    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if existing_note.target.is_complete:
        raise HTTPException(status_code=400, detail="Cannot update note for a completed target")
    
    if existing_note.target.mission.is_complete:
        raise HTTPException(status_code=400, detail="Cannot update note for a completed mission")

    existing_note.content = note.content

    if not note_validate(existing_note):
        raise HTTPException(status_code=400, detail="Note content is required")

    session.add(existing_note)
    session.commit()
    session.refresh(existing_note)

    return existing_note

@app.delete("/note/{note_id}", response_model=Note)
async def delete_note(
    note_id: int, session: Session = Depends(get_session)
):
    """Delete a note by ID."""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    session.delete(note)
    session.commit()

    return note
