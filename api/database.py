from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./sca.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)

def create_db_and_tables():
    """Create the database and tables if they do not exist."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session
