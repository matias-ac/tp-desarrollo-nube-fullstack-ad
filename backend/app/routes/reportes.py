import csv
from io import StringIO

from app.services.storage import get_db
from app.utils.decorators import jwt_required, require_role
from flask import Blueprint, Response, jsonify, request

reportes_bp = Blueprint("reportes", __name__)


@reportes_bp.route("/api/reportes/export", methods=["GET"])
@jwt_required
@require_role("Admin")
def exportar():
    tipo = request.args.get("tipo")
    if tipo not in ("inventario", "movimientos"):
        return jsonify({"error": "Tipo debe ser: inventario o movimientos"}), 400

    db = get_db()
    output = StringIO()
    writer = csv.writer(output)

    if tipo == "inventario":
        categorias = {c["id"]: c["nombre"] for c in db["categorias"]}
        writer.writerow(
            [
                "nombre",
                "categoria",
                "stock_actual",
                "stock_minimo",
                "precio_unitario",
                "valor_total",
            ]
        )
        for p in db["productos"]:
            writer.writerow(
                [
                    p["nombre"],
                    categorias.get(p["categoria_id"], "Sin categoría"),
                    p["stock_actual"],
                    p["stock_minimo"],
                    p["precio_unitario"],
                    round(p["stock_actual"] * p["precio_unitario"], 2),
                ]
            )
        filename = "inventario.csv"

    else:  # movimientos
        productos = {p["id"]: p["nombre"] for p in db["productos"]}
        writer.writerow(
            ["fecha", "producto", "tipo", "cantidad", "usuario", "observacion"]
        )
        for m in db["movimientos"]:
            writer.writerow(
                [
                    m["created_at"],
                    productos.get(m["producto_id"], "Producto eliminado"),
                    m["tipo"],
                    m["cantidad"],
                    m["usuario_id"],
                    m.get("observacion", ""),
                ]
            )
        filename = "movimientos.csv"

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
