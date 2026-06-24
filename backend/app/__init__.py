import logging
import os

from app.config import Config
from app.routes.auth import auth_bp
from app.routes.categorias import categorias_bp
from app.routes.dashboard import dashboard_bp
from app.routes.movimientos import movimientos_bp
from app.routes.productos import productos_bp
from app.routes.reportes import reportes_bp
from flask import Flask, jsonify
from flask_cors import CORS


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Logging a archivo
    log_path = os.path.join(app.config["BASE_DIR"], "app.log")
    logging.basicConfig(
        filename=log_path,
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    app.logger.info("Servidor Flask iniciado")

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
    app.register_blueprint(categorias_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(productos_bp)
    app.register_blueprint(movimientos_bp)
    app.register_blueprint(reportes_bp)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Solicitud inválida", "code": 400}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "No autenticado", "code": 401}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Acceso denegado", "code": 403}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Recurso no encontrado", "code": 404}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Error interno del servidor", "code": 500}), 500

    return app
