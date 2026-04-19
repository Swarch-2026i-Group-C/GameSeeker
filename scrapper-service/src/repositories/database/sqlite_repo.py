import sqlite3
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SQLiteRepo:
    def __init__(self, db_path="discounts.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS notified_discounts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        store TEXT NOT NULL,
                        price_cents INTEGER NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_notification 
                    ON notified_discounts(name, store, price_cents)
                """)
                conn.commit()
        except sqlite3.Error as e:
            logger.error(f"Error initializing SQLite database: {e}")

    def has_been_notified(self, name: str, store: str, price_cents: int) -> bool:
        """Check if a specific discount has already been notified."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT 1 FROM notified_discounts 
                    WHERE name = ? AND store = ? AND price_cents = ?
                    LIMIT 1
                """, (name, store, price_cents))
                return cursor.fetchone() is not None
        except sqlite3.Error as e:
            logger.error(f"Error querying SQLite database: {e}")
            return False

    def save_notification(self, name: str, store: str, price_cents: int):
        """Save a notification record to prevent duplicate alerts."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO notified_discounts (name, store, price_cents, timestamp)
                    VALUES (?, ?, ?, ?)
                """, (name, store, price_cents, datetime.utcnow()))
                conn.commit()
        except sqlite3.Error as e:
            logger.error(f"Error inserting into SQLite database: {e}")
