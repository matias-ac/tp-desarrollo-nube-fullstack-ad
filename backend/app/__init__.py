from app.config import Config
from app.routes.auth import auth_bp
from app.routes.dashboard import dashboard_bp
from app.routes.movimientos import movimientos_bp
from app.routes.productos import productos_bp
from app.routes.reportes import reportes_bp
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

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(productos_bp)
    app.register_blueprint(movimientos_bp)
    app.register_blueprint(reportes_bp)

    return app
