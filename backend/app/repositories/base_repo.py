from typing import Generic, Type, TypeVar, List, Optional
from sqlalchemy import select, desc, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get(self, id: int) -> Optional[ModelType]:
        query = select(self.model).where(self.model.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_multi(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        query = select(self.model).order_by(desc(self.model.id)).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, obj_in_data: dict) -> ModelType:
        db_obj = self.model(**obj_in_data)
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj

    async def delete_all(self) -> None:
        """Exclui todos os registros (Limpar Histórico)"""
        query = delete(self.model)
        await self.db.execute(query)
        await self.db.flush()
