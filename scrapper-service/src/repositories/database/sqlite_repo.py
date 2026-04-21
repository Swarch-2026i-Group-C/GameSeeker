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
        """Check if a specific discount has already been notified. 
        Uses a 7-day cooldown unless the price drops by another 5% to ignore currency fluctuations."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT price_cents FROM notified_discounts 
                    WHERE name = ? AND store = ? AND timestamp >= datetime('now', '-7 days')
                    ORDER BY timestamp DESC
                    LIMIT 1
                """, (name, store))
                row = cursor.fetchone()
                
                if row:
                    last_price = row[0]
                    # If the current price is roughly the same or higher (ignoring <5% currency drift), suppress notification
                    if price_cents >= last_price * 0.95:
                        return True
                        
                return False
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
