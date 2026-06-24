from app.services.auth_service import create_token, decode_token
from app.services.ldap_service import authenticate_user, check_access_hours, map_role
from app.utils.decorators import jwt_required
from flask import Blueprint, g, jsonify, request

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Se requiere cuerpo JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Usuario y contraseña son requeridos"}), 400

    # 1. Validar horario de acceso
    try:
        check_access_hours()
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    # 2. Autenticar contra AD
    try:
        user_data = authenticate_user(username, password)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503

    if user_data is None:
        return jsonify({"error": "Credenciales inválidas"}), 401

    # 3. Mapear rol según grupos
    role = map_role(user_data["groups"])
    if role is None:
        return jsonify({"error": "Usuario sin grupo autorizado"}), 403

    # 4. Generar token
    token = create_token(
        {
            "username": user_data["username"],
            "role": role,
            "name": user_data["name"],
        }
    )

    return (
        jsonify(
            {
                "token": token,
                "user": {
                    "id": user_data["username"],
                    "name": user_data["name"],
                    "role": role,
                },
            }
        ),
        200,
    )


@auth_bp.route("/api/auth/me", methods=["GET"])
@jwt_required
def me():
    return (
        jsonify(
            {
                "id": g.current_user["sub"],
                "name": g.current_user["name"],
                "role": g.current_user["role"],
            }
        ),
        200,
    )


@auth_bp.route("/api/auth/logout", methods=["POST"])
@jwt_required
def logout():
    return jsonify({"message": "Sesión cerrada correctamente"}), 200
