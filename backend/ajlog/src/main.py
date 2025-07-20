from contextlib import asynccontextmanager
from typing import Annotated, Sequence

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select

from .models import ScrumTeam

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    pass


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/scrum_teams/")
def read_scrum_teams(session: SessionDep) -> Sequence[ScrumTeam]:
    """Read Scrum Teams."""
    scrum_teams = session.exec(select(ScrumTeam)).all()
    return scrum_teams


@app.get("/test/")
def create_scrum_team_test(session: SessionDep) -> ScrumTeam:
    """Test."""
    scrum_team = ScrumTeam(name="Test Team")
    session.add(scrum_team)
    session.commit()
    session.refresh(scrum_team)
    return scrum_team


@app.post("/scrum_team/")
def create_scrum_team(scrum_team: ScrumTeam, session: SessionDep) -> ScrumTeam:
    """Create a new Scrum Team."""
    session.add(scrum_team)
    session.commit()
    session.refresh(scrum_team)
    return scrum_team
