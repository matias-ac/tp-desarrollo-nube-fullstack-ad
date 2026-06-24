from datetime import datetime, timedelta

import jwt
from flask import current_app


def create_token(user_data):
    secret_key = current_app.config["SECRET_KEY"]
    expiration_hours = current_app.config["JWT_EXPIRATION_HOURS"]

    payload = {
        "sub": user_data["username"],
        "role": user_data["role"],
        "name": user_data["name"],
        "iat": datetime.now(),
        "exp": datetime.now() + timedelta(hours=expiration_hours),
    }

    return jwt.encode(payload, secret_key, algorithm="HS256")


def decode_token(token):
    secret_key = current_app.config["SECRET_KEY"]

    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise PermissionError("Token expirado. Inicie sesión nuevamente.")
    except jwt.InvalidTokenError:
        raise PermissionError("Token inválido.")
