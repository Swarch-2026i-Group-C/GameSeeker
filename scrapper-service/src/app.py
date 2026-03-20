import logging
from flask import Flask
from controllers.game_controller import game_bp


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory for the Scrapper Service."""

    app.register_blueprint(game_bp)
    
    logger.info("Scrapper Service initialized with Layered Architecture")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=False)
