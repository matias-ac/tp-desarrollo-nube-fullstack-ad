from app.config import Config
from flask import Flask, jsonify
from flask_cors import CORS


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Habiltiar CORS para permitir llamadas del frontend (habitualmente puerto 5173 en Vite)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Ruta temporal para verificar la salud del servidor
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return (
            jsonify(
                {
                    "status": "healthy",
                    "message": "Servidor Flask inicializado correctamente",
                }
            ),
            200,
        )

    return app
