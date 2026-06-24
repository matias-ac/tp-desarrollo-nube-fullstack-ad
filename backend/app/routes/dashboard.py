from datetime import datetime, timedelta

from app.services.storage import get_db
from app.utils.decorators import jwt_required
from flask import Blueprint, jsonify

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard/summary", methods=["GET"])
@jwt_required
def summary():
    db = get_db()
    productos = db["productos"]
    movimientos = db["movimientos"]

    total_productos = len(productos)
    bajo_stock = sum(1 for p in productos if p["stock_actual"] < p["stock_minimo"])

    hoy = datetime.now().strftime("%Y-%m-%d")
    movimientos_hoy = sum(1 for m in movimientos if m["created_at"].startswith(hoy))

    valor_estimado = sum(p["stock_actual"] * p["precio_unitario"] for p in productos)

    return (
        jsonify(
            {
                "total_productos": total_productos,
                "bajo_stock": bajo_stock,
                "movimientos_hoy": movimientos_hoy,
                "valor_estimado": round(valor_estimado, 2),
            }
        ),
        200,
    )


@dashboard_bp.route("/api/dashboard/top-products", methods=["GET"])
@jwt_required
def top_products():
    db = get_db()
    movimientos = db["movimientos"]
    productos = db["productos"]

    # Contar egresos por producto
    egresos = {}
    for m in movimientos:
        if m["tipo"] == "egreso":
            pid = m["producto_id"]
            egresos[pid] = egresos.get(pid, 0) + m["cantidad"]

    # Mapear a nombres y ordenar
    result = []
    for pid, cantidad in sorted(egresos.items(), key=lambda x: x[1], reverse=True)[:5]:
        prod = next((p for p in productos if p["id"] == pid), None)
        if prod:
            result.append({"name": prod["nombre"], "ventas": cantidad})

    return jsonify(result), 200


@dashboard_bp.route("/api/dashboard/movements-weekly", methods=["GET"])
@jwt_required
def movements_weekly():
    db = get_db()
    movimientos = db["movimientos"]

    hoy = datetime.now()
    days_labels = []
    for i in range(6, -1, -1):
        d = hoy - timedelta(days=i)
        days_labels.append(d.strftime("%a"))

    result = []
    for i in range(7):
        day_date = (hoy - timedelta(days=6 - i)).strftime("%Y-%m-%d")
        entradas = sum(
            m["cantidad"]
            for m in movimientos
            if m["tipo"] == "ingreso" and m["created_at"].startswith(day_date)
        )
        salidas = sum(
            m["cantidad"]
            for m in movimientos
            if m["tipo"] == "egreso" and m["created_at"].startswith(day_date)
        )
        result.append(
            {
                "day": days_labels[i],
                "entradas": entradas,
                "salidas": salidas,
            }
        )

    return jsonify(result), 200


@dashboard_bp.route("/api/dashboard/category-distribution", methods=["GET"])
@jwt_required
def category_distribution():
    db = get_db()
    productos = db["productos"]
    categorias = {c["id"]: c["nombre"] for c in db["categorias"]}

    distribucion = {}
    for p in productos:
        cat_name = categorias.get(p["categoria_id"], "Sin categoría")
        distribucion[cat_name] = distribucion.get(cat_name, 0) + p["stock_actual"]

    result = [{"name": name, "value": value} for name, value in distribucion.items()]
    return jsonify(result), 200
