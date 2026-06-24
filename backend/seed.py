from app import create_app
from app.services.storage import save_db

# Datos iniciales para pruebas
SEED_DATA = {
    "categorias": [
        {"id": 1, "nombre": "Electrónica"},
        {"id": 2, "nombre": "Accesorios"},
        {"id": 3, "nombre": "Repuestos"},
        {"id": 4, "nombre": "Insumos"},
    ],
    "productos": [
        {
            "id": 1,
            "nombre": "Laptop Gamer",
            "categoria_id": 1,
            "stock_actual": 15,
            "stock_minimo": 5,
            "precio_unitario": 1200.00,
        },
        {
            "id": 2,
            "nombre": 'Monitor 24"',
            "categoria_id": 1,
            "stock_actual": 8,
            "stock_minimo": 10,
            "precio_unitario": 350.00,
        },
        {
            "id": 3,
            "nombre": "Teclado Mecánico",
            "categoria_id": 2,
            "stock_actual": 25,
            "stock_minimo": 10,
            "precio_unitario": 85.00,
        },
        {
            "id": 4,
            "nombre": "Mouse Inalámbrico",
            "categoria_id": 2,
            "stock_actual": 30,
            "stock_minimo": 15,
            "precio_unitario": 45.00,
        },
        {
            "id": 5,
            "nombre": "Cable HDMI 2m",
            "categoria_id": 4,
            "stock_actual": 50,
            "stock_minimo": 20,
            "precio_unitario": 12.00,
        },
        {
            "id": 6,
            "nombre": "Webcam HD",
            "categoria_id": 1,
            "stock_actual": 12,
            "stock_minimo": 8,
            "precio_unitario": 65.00,
        },
        {
            "id": 7,
            "nombre": "Hub USB 4 puertos",
            "categoria_id": 2,
            "stock_actual": 20,
            "stock_minimo": 10,
            "precio_unitario": 25.00,
        },
        {
            "id": 8,
            "nombre": "Disco SSD 512GB",
            "categoria_id": 1,
            "stock_actual": 3,
            "stock_minimo": 10,
            "precio_unitario": 89.00,
        },
        {
            "id": 9,
            "nombre": "Funda para Notebook",
            "categoria_id": 2,
            "stock_actual": 18,
            "stock_minimo": 10,
            "precio_unitario": 35.00,
        },
        {
            "id": 10,
            "nombre": "Cartucho Tóner",
            "categoria_id": 4,
            "stock_actual": 6,
            "stock_minimo": 15,
            "precio_unitario": 55.00,
        },
    ],
    "movimientos": [
        {
            "id": 1,
            "producto_id": 1,
            "tipo": "ingreso",
            "cantidad": 15,
            "usuario_id": "admin",
            "observacion": "Stock inicial",
            "created_at": "2026-06-20T10:00:00",
        },
        {
            "id": 2,
            "producto_id": 8,
            "tipo": "egreso",
            "cantidad": 2,
            "usuario_id": "operador1",
            "observacion": "Venta directa",
            "created_at": "2026-06-21T14:30:00",
        },
        {
            "id": 3,
            "producto_id": 3,
            "tipo": "ajuste",
            "cantidad": 5,
            "usuario_id": "admin",
            "observacion": "Recuento físico",
            "created_at": "2026-06-22T09:15:00",
        },
    ],
}


def run_seed():
    app = create_app()
    # Usamos el contexto de la aplicación para que storage pueda leer app.config['DB_PATH']
    with app.app_context():
        save_db(SEED_DATA)
        print("Base de datos JSON poblada con datos semilla correctamente.")


if __name__ == "__main__":
    run_seed()
