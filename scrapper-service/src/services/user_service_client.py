import logging
import requests
from config import Config
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class UserServiceClient:
    def __init__(self):
        self.base_url = Config.USER_SERVICE_URL

    def get_wishlist_games(self) -> List[str]:
        try:
            response = requests.get(f"{self.base_url}/wishlist/games", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get("data", [])
            else:
                logger.error(f"Failed to fetch wishlist games. Status: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error communicating with user-service for GET games: {e}")
            return []

    def update_game_prices(self, updates: List[Dict[str, Any]]):
        if not updates:
            return
            
        try:
            payload = { "updates": updates }
            response = requests.patch(f"{self.base_url}/wishlist/prices", json=payload, timeout=10)
            if response.status_code == 200:
                logger.info("Successfully updated game prices in Wishlist DB")
            else:
                logger.error(f"Failed to update wishlist prices. Status: {response.status_code}, Msg: {response.text}")
        except Exception as e:
            logger.error(f"Error communicating with user-service for PATCH prices: {e}")
