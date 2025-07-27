from datetime import datetime

from sqlmodel import Field, SQLModel


class ScrumTeam(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)


class ScrumTeamOrder(SQLModel, table=True):
    scrum_team_id: int | None = Field(
        default=None, primary_key=True, foreign_key="scrumteam.id"
    )
    order: int | None = Field(default=None)


class Sprint(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    start_date: datetime = Field(default_factory=datetime.now)
    end_date: datetime = Field(default_factory=datetime.now)
    scrum_team_id: int | None = Field(default=None, foreign_key="scrumteam.id")


class ProductBacklogItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str | None = None
    priority: int = Field(default=0)
    status: str = Field(default="To Do")
    scrum_team_id: int | None = Field(default=None, foreign_key="scrumteam.id")
    sprint_id: int | None = Field(default=None, foreign_key="sprint.id")


class SprintBacklogItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str | None = None
    priority: int = Field(default=0)
    status: str = Field(default="To Do")
    product_backlog_item_id: int | None = Field(
        default=None, foreign_key="productbacklogitem.id"
    )
