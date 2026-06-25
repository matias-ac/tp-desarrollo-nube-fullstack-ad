import json
import os

from flask import current_app


def get_db_path():
    return current_app.config["DB_PATH"]


def get_db():
    path = get_db_path()

    # Si el archivo no existe, inicializarlo con estructura vacía
    if not os.path.exists(path):
        default_db = {"categorias": [], "productos": [], "movimientos": []}
        save_db(default_db)
        return default_db

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        # En caso de error de lectura o JSON corrupto, devolver estructura vacía de seguridad
        return {"categorias": [], "productos": [], "movimientos": []}


def save_db(data):
    path = get_db_path()

    # Asegurar que la carpeta 'data/' exista
    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_next_id(coleccion):
    db = get_db()
    items = db.get(coleccion, [])
    if not items:
        return 1
    return max(item["id"] for item in items) + 1
