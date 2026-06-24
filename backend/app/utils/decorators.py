from functools import wraps

from app.services.auth_service import decode_token
from flask import g, jsonify, request


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token de autenticación requerido"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = decode_token(token)
            g.current_user = payload
        except PermissionError as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)

    return decorated


def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if g.current_user.get("role") not in roles:
                return jsonify({"error": "No tiene permisos para esta acción"}), 403
            return f(*args, **kwargs)

        return decorated

    return decorator
