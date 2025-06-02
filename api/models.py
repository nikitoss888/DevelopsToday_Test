from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.dialects.sqlite import TEXT
import httpx

# SpyCat database model
class SpyCat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str                = Field(index=True)
    years_of_experience: int = Field(default=0)
    breed: str               = Field()
    salary: float            = Field(default=0.0)

    missions: list["Mission"] = Relationship(back_populates="cat")

# Pydantic model for cat input validation
class SpyCatModel(BaseModel):
    id: Optional[int] = None
    name: str
    years_of_experience: int = 0
    breed: str
    salary: float = 0.0

class SpyCatModelRead(SpyCatModel):
    missions: Optional[list["MissionModel"]] = None

async def breed_validate(breed: str) -> bool:
    async with httpx.AsyncClient() as client:
        res = await client.get("https://api.thecatapi.com/v1/breeds")
        
        if res.status_code != 200:
            return False
        
        return any(b["name"].lower() == breed.lower() for b in res.json())

def spycat_validate(cat: SpyCat) -> bool:
    if not cat.name or not cat.breed:
        return False
    if cat.years_of_experience < 0 or cat.salary < 0:
        return False
    return True


# Mission database model
class Mission(SQLModel, table=True):
    id: Optional[int]     = Field(default=None, primary_key=True)
    cat_id: Optional[int] = Field(default=None, foreign_key="spycat.id")
    is_complete: bool     = Field(default=False)

    cat: Optional[SpyCat]   = Relationship(back_populates="missions")
    targets: list["Target"] = Relationship(back_populates="mission", cascade_delete=True)

# Pydantic model for mission input validation
class MissionModel(BaseModel):
    id: Optional[int] = None
    cat_id: Optional[int] = None
    is_complete: bool = False

class MissionModelCreate(MissionModel):
    targets: Optional[list["TargetModel"]] = None

class MissionModelRead(MissionModelCreate):
    cat: Optional[SpyCatModel] = None


# Target database model
class Target(SQLModel, table=True):
    id: Optional[int]         = Field(default=None, primary_key=True)
    mission_id: Optional[int] = Field(default=None, foreign_key="mission.id", ondelete="CASCADE")
    name: str                 = Field(index=True)
    country: str              = Field()
    is_complete: bool         = Field(default=False)

    mission: Optional[Mission] = Relationship(back_populates="targets")
    notes: list["Note"]        = Relationship(back_populates="target", cascade_delete=True)

# Pydantic model for target input validation
class TargetModel(BaseModel):
    id: Optional[int] = None
    name: str
    country: str
    is_complete: bool = False

class TargetModelCreate(TargetModel):
    notes: Optional[list["NoteModel"]] = None

class TargetModelRead(TargetModelCreate):
    mission: Optional[MissionModel] = None

def target_validate(target: Target) -> bool:
    if not target.name or not target.country:
        return False
    return True

# Note database model
class Note(SQLModel, table=True):
    id: Optional[int]        = Field(default=None, primary_key=True)
    target_id: Optional[int] = Field(default=None, foreign_key="target.id", ondelete="CASCADE")
    content: str             = Field(sa_column=TEXT)

    target: Optional[Target] = Relationship(back_populates="notes")

# Pydantic model for note input validation
class NoteModel(BaseModel):
    id: Optional[int] = None
    content: str

class NoteModelRead(NoteModel):
    target: Optional[TargetModel] = None

def note_validate(note: Note) -> bool:
    if not note.content:
        return False
    return True
