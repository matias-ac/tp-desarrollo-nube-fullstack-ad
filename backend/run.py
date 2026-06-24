from app import create_app

app = create_app()

if __name__ == "__main__":
    # Iniciamos el servidor en el puerto configurado, escuchando en todas las interfaces
    app.run(host="0.0.0.0", port=app.config["PORT"], debug=True)
