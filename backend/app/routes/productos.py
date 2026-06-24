from app.services.storage import get_db, get_next_id, save_db
from app.utils.decorators import jwt_required, require_role
from app.utils.helpers import sanitizar_input, validar_campo_numerico
from flask import Blueprint, jsonify, request

productos_bp = Blueprint("productos", __name__)


@productos_bp.route("/api/productos", methods=["GET"])
@jwt_required
def listar_productos():
    db = get_db()
    query = request.args.get("q", "").lower()
    categorias = {c["id"]: c["nombre"] for c in db["categorias"]}

    productos = db["productos"]
    if query:
        productos = [p for p in productos if query in p["nombre"].lower()]

    result = []
    for p in productos:
        result.append(
            {
                **p,
                "categoria_nombre": categorias.get(p["categoria_id"], "Sin categoría"),
            }
        )

    return jsonify({"productos": result, "total": len(result)}), 200


@productos_bp.route("/api/productos/<int:producto_id>", methods=["GET"])
@jwt_required
def obtener_producto(producto_id):
    db = get_db()
    categorias = {c["id"]: c["nombre"] for c in db["categorias"]}
    producto = next((p for p in db["productos"] if p["id"] == producto_id), None)

    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    return (
        jsonify(
            {
                **producto,
                "categoria_nombre": categorias.get(
                    producto["categoria_id"], "Sin categoría"
                ),
            }
        ),
        200,
    )


@productos_bp.route("/api/productos", methods=["POST"])
@jwt_required
@require_role("Admin")
def crear_producto():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Se requiere cuerpo JSON"}), 400

    nombre = sanitizar_input(data.get("nombre"))
    categoria_id = data.get("categoria_id")
    stock_actual = data.get("stock_actual", 0)
    stock_minimo = data.get("stock_minimo", 0)
    precio_unitario = data.get("precio_unitario")

    if not nombre or not categoria_id or precio_unitario is None:
        return (
            jsonify(
                {"error": "Campos requeridos: nombre, categoria_id, precio_unitario"}
            ),
            400,
        )

    if not validar_campo_numerico(precio_unitario, minimo=0.01):
        return jsonify({"error": "El precio unitario debe ser mayor a 0"}), 400

    if not validar_campo_numerico(stock_actual):
        return jsonify({"error": "El stock actual no puede ser negativo"}), 400

    db = get_db()
    categorias = {c["id"] for c in db["categorias"]}
    if categoria_id not in categorias:
        return jsonify({"error": "Categoría no válida"}), 400

    nuevo = {
        "id": get_next_id("productos"),
        "nombre": nombre,
        "categoria_id": categoria_id,
        "stock_actual": stock_actual,
        "stock_minimo": stock_minimo,
        "precio_unitario": precio_unitario,
    }

    db["productos"].append(nuevo)
    save_db(db)

    categorias = {c["id"]: c["nombre"] for c in db["categorias"]}
    return jsonify({**nuevo, "categoria_nombre": categorias.get(nuevo["categoria_id"], "Sin categoría")}), 201


@productos_bp.route("/api/productos/<int:producto_id>", methods=["PUT"])
@jwt_required
@require_role("Admin")
def actualizar_producto(producto_id):
    db = get_db()
    producto = next((p for p in db["productos"] if p["id"] == producto_id), None)

    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Se requiere cuerpo JSON"}), 400

    if "nombre" in data:
        producto["nombre"] = sanitizar_input(data["nombre"])
    if "categoria_id" in data:
        categorias = {c["id"] for c in db["categorias"]}
        if data["categoria_id"] not in categorias:
            return jsonify({"error": "Categoría no válida"}), 400
        producto["categoria_id"] = data["categoria_id"]
    if "stock_actual" in data:
        if not validar_campo_numerico(data["stock_actual"]):
            return jsonify({"error": "El stock actual no puede ser negativo"}), 400
        producto["stock_actual"] = data["stock_actual"]
    if "stock_minimo" in data:
        producto["stock_minimo"] = data["stock_minimo"]
    if "precio_unitario" in data:
        if not validar_campo_numerico(data["precio_unitario"], minimo=0.01):
            return jsonify({"error": "El precio unitario debe ser mayor a 0"}), 400
        producto["precio_unitario"] = data["precio_unitario"]

    save_db(db)

    categorias = {c["id"]: c["nombre"] for c in db["categorias"]}
    return jsonify({**producto, "categoria_nombre": categorias.get(producto["categoria_id"], "Sin categoría")}), 200


@productos_bp.route("/api/productos/<int:producto_id>", methods=["DELETE"])
@jwt_required
@require_role("Admin")
def eliminar_producto(producto_id):
    db = get_db()
    producto = next((p for p in db["productos"] if p["id"] == producto_id), None)

    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    db["productos"] = [p for p in db["productos"] if p["id"] != producto_id]
    save_db(db)

    return jsonify({"message": "Producto eliminado correctamente"}), 200
