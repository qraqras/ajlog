from fastapi import FastAPI


from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Sample(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Hello World"}


# https://fastapi.tiangolo.com/tutorial/sql-databases/?h=sqlite#create-an-engine
@app.get("/sample1/")
def create_hero(session: SessionDep) -> Sample:
    sample = Sample(name="name")
    session.add(sample)
    session.commit()
    session.refresh(sample)
    return sample


@app.get("/sample2/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Sample]:
    heroes = session.exec(select(Sample).offset(offset).limit(limit)).all()
    return heroes
