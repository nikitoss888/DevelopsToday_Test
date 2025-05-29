from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from .database import create_db_and_tables, get_session
from .models import SpyCat, SpyCatModel, Mission, MissionModel, MissionModelCreate, \
    Target, TargetModel, TargetModelCreate, Note, NoteModel, \
        breed_validate, spycat_validate, target_validate, note_validate
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the database and tables at startup."""
    create_db_and_tables()
    
    yield

app = FastAPI(lifespan=lifespan)

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

@app.get("/spycat/{spycat_id}", response_model=SpyCat)
async def read_spycat(spycat_id: int, session: Session = Depends(get_session)):
    """Read a spy cat by ID."""
    spycat = session.get(SpyCat, spycat_id)
    if not spycat:
        raise HTTPException(status_code=404, detail="Spy Cat not found")
    
    return spycat

@app.get("/spycat/", response_model=list[SpyCat])
async def read_spycats(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """Read all spy cats with pagination."""
    statement = select(SpyCat).offset(skip).limit(limit)
    spycats = session.exec(statement).all()
    
    return spycats

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

@app.get("/mission/{mission_id}", response_model=Mission)
async def read_mission(mission_id: int, session: Session = Depends(get_session)):
    """Read a mission by ID."""
    mission = session.get(Mission, mission_id)
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    return mission

@app.get("/mission/", response_model=list[Mission])
async def read_missions(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """Read all missions with pagination."""
    statement = select(Mission).offset(skip).limit(limit)
    missions = session.exec(statement).all()
    
    return missions

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

@app.get("/mission/{mission_id}/target/{target_id}", response_model=Target)
async def read_target(mission_id: int, target_id: int, session: Session = Depends(get_session)):
    """Read a target by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    return target

@app.get("/mission/{mission_id}/target/", response_model=list[Target])
async def read_targets(mission_id: int, skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """Read all targets for a mission with pagination."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    return mission.targets[skip:skip + limit]

@app.put("/mission/{mission_id}/target/{target_id}", response_model=Target)
async def update_target(mission_id: int, target_id: int, target: TargetModel, session: Session = Depends(get_session)):
    """Update a target by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    existing_target = session.get(Target, target_id)
    if not existing_target or existing_target not in mission.targets:
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

@app.delete("/mission/{mission_id}/target/{target_id}", response_model=Target)
async def delete_target(mission_id: int, target_id: int, session: Session = Depends(get_session)):
    """Delete a target by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    session.delete(target)
    session.commit()

    return target


@app.post("/mission/{mission_id}/target/{target_id}/note/", response_model=Note)
async def create_note(
    mission_id: int, target_id: int, note: NoteModel, session: Session = Depends(get_session)
):
    """Create a new note for a target."""
    if not note.content:
        raise HTTPException(status_code=400, detail="Note content is required")

    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")
    
    if mission.is_complete:
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

@app.get("/mission/{mission_id}/target/{target_id}/note/{note_id}", response_model=Note)
async def read_note(
    mission_id: int, target_id: int, note_id: int, session: Session = Depends(get_session)
):
    """Read a note by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    note = session.get(Note, note_id)
    if not note or note not in target.notes:
        raise HTTPException(status_code=404, detail="Note not found")

    return note

@app.get("/mission/{mission_id}/target/{target_id}/note/", response_model=list[Note])
async def read_notes(
    mission_id: int, target_id: int, skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    """Read all notes for a target with pagination."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    return target.notes[skip:skip + limit]

@app.put("/mission/{mission_id}/target/{target_id}/note/{note_id}", response_model=Note)
async def update_note(
    mission_id: int, target_id: int, note_id: int, note: NoteModel, session: Session = Depends(get_session)
):
    """Update a note by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    existing_note = session.get(Note, note_id)
    if not existing_note or existing_note not in target.notes:
        raise HTTPException(status_code=404, detail="Note not found")

    if not note.content:
        raise HTTPException(status_code=400, detail="Note content is required")
    
    if mission.is_complete:
        raise HTTPException(status_code=400, detail="Cannot update note for a completed mission")
    
    if target.is_complete:
        raise HTTPException(status_code=400, detail="Cannot update note for a completed target")

    existing_note.content = note.content

    if not note_validate(existing_note):
        raise HTTPException(status_code=400, detail="Invalid Note data")

    session.add(existing_note)
    session.commit()
    session.refresh(existing_note)

    return existing_note

@app.delete("/mission/{mission_id}/target/{target_id}/note/{note_id}", response_model=Note)
async def delete_note(
    mission_id: int, target_id: int, note_id: int, session: Session = Depends(get_session)
):
    """Delete a note by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    target = session.get(Target, target_id)
    if not target or target not in mission.targets:
        raise HTTPException(status_code=404, detail="Target not found")

    note = session.get(Note, note_id)
    if not note or note not in target.notes:
        raise HTTPException(status_code=404, detail="Note not found")

    session.delete(note)
    session.commit()

    return note
