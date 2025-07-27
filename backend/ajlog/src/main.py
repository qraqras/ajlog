from contextlib import asynccontextmanager
from typing import Annotated, Sequence

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, col, create_engine, select

from .models import ScrumTeam, ScrumTeamOrder

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


@app.get("/scrum_teams/{scrum_team_id}")
def read_scrum_team(scrum_team_id: int, session: SessionDep) -> ScrumTeam:
    """Read a Scrum Team."""
    scrum_team = session.get(ScrumTeam, scrum_team_id)
    if not scrum_team:
        raise HTTPException(status_code=404, detail="Scrum Team not found")
    return scrum_team


@app.post("/scrum_teams/")
def create_scrum_team(scrum_team: ScrumTeam, session: SessionDep) -> ScrumTeam:
    """Create a Scrum Team."""
    session.add(scrum_team)
    session.commit()
    session.refresh(scrum_team)
    return scrum_team


@app.delete("/scrum_teams/{scrum_team_id}")
def delete_scrum_team(scrum_team_id: int, session: SessionDep) -> dict[str, bool]:
    """Delete a Scrum Team."""
    scrum_team = session.get(ScrumTeam, scrum_team_id)
    if not scrum_team:
        raise HTTPException(status_code=404, detail="Scrum Team not found")
    session.delete(scrum_team)
    session.commit()
    return {"ok": True}


@app.get("/scrum_teams/order/")
def read_scrum_team_order(session: SessionDep) -> Sequence[ScrumTeam]:
    """Read Scrum Teams with order."""
    result = session.exec(
        select(ScrumTeam, ScrumTeamOrder)
        .join(ScrumTeamOrder, isouter=True)
        .order_by(col(ScrumTeamOrder.order))
    )
    return [record[0] for record in result]


@app.put("/scrum_teams/order/")
def update_scrum_team_order(
    scrum_team_orders: Sequence[ScrumTeamOrder], session: SessionDep
) -> Sequence[ScrumTeamOrder]:
    """Update the order of Scrum Teams."""
    for order in scrum_team_orders:
        existing_order = session.get(ScrumTeamOrder, order.scrum_team_id)
        if existing_order:
            existing_order.order = order.order
        else:
            session.add(order)
    session.commit()
    return scrum_team_orders
