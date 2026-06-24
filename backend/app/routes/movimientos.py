from datetime import datetime

from app.services.storage import get_db, get_next_id, save_db
from app.utils.decorators import jwt_required, require_role
from flask import Blueprint, g, jsonify, request

movimientos_bp = Blueprint("movimientos", __name__)


@movimientos_bp.route("/api/movimientos", methods=["GET"])
@jwt_required
def listar_movimientos():
    db = get_db()
    movimientos = db["movimientos"]
    productos = {p["id"]: p["nombre"] for p in db["productos"]}

    # Filtros opcionales
    tipo = request.args.get("tipo")
    producto_id = request.args.get("producto_id", type=int)
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")

    if tipo:
        movimientos = [m for m in movimientos if m["tipo"] == tipo]
    if producto_id:
        movimientos = [m for m in movimientos if m["producto_id"] == producto_id]
    if desde:
        movimientos = [m for m in movimientos if m["created_at"] >= desde]
    if hasta:
        movimientos = [m for m in movimientos if m["created_at"] <= hasta]

    # Ordenar por fecha descendente
    movimientos.sort(key=lambda m: m["created_at"], reverse=True)

    result = []
    for m in movimientos:
        result.append(
            {
                **m,
                "producto_nombre": productos.get(
                    m["producto_id"], "Producto eliminado"
                ),
            }
        )

    return jsonify({"movimientos": result, "total": len(result)}), 200


@movimientos_bp.route("/api/movimientos", methods=["POST"])
@jwt_required
@require_role("Admin", "Operador")
def registrar_movimiento():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Se requiere cuerpo JSON"}), 400

    producto_id = data.get("producto_id")
    tipo = data.get("tipo")
    cantidad = data.get("cantidad")
    observacion = data.get("observacion", "")

    if not producto_id or not tipo or not cantidad:
        return jsonify({"error": "Campos requeridos: producto_id, tipo, cantidad"}), 400

    if tipo not in ("ingreso", "egreso", "ajuste"):
        return jsonify({"error": "Tipo debe ser: ingreso, egreso o ajuste"}), 400

    if cantidad <= 0:
        return jsonify({"error": "La cantidad debe ser mayor a 0"}), 400

    db = get_db()
    producto = next((p for p in db["productos"] if p["id"] == producto_id), None)

    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    if tipo == "egreso" and producto["stock_actual"] < cantidad:
        return jsonify({"error": "Stock insuficiente para realizar el egreso"}), 400

    # Actualizar stock
    if tipo == "ingreso":
        producto["stock_actual"] += cantidad
    elif tipo == "egreso":
        producto["stock_actual"] -= cantidad
    elif tipo == "ajuste":
        producto["stock_actual"] = cantidad

    nuevo = {
        "id": get_next_id("movimientos"),
        "producto_id": producto_id,
        "tipo": tipo,
        "cantidad": cantidad,
        "usuario_id": g.current_user["sub"],
        "observacion": observacion,
        "created_at": datetime.now().isoformat(),
    }

    db["movimientos"].append(nuevo)
    save_db(db)

    return jsonify(nuevo), 201
