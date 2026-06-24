from app.services.storage import get_db
from app.utils.decorators import jwt_required
from flask import Blueprint, jsonify

categorias_bp = Blueprint("categorias", __name__)


@categorias_bp.route("/api/categorias", methods=["GET"])
@jwt_required
def listar_categorias():
    db = get_db()
    return jsonify({"categorias": db["categorias"]}), 200
