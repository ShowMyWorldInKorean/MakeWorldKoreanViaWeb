from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

import logging
logger = logging.getLogger(__name__)

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(MONGO_URL)
        try:
            await cls.client.admin.command('ping')
            logger.info("✅ MongoDB Connection Established Successfully")
        except ConnectionFailure as e:
            logger.error(f"❌ Failed To Connect To MongoDB: {str(e)}")
    
    @classmethod
    async def close_db(cls):
        if cls.client:
            try:
                cls.client.close()
                logger.info("✅ MongoDB Connection Closed Successfully")
            except Exception as e:
                logger.error(f"❌ Failed To Close MongoDB Connection: {str(e)}")
    
    @classmethod
    def get_database(cls):
        return cls.client[DATABASE_NAME]

db = Database()