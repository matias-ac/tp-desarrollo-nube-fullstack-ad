from app import create_app

app = create_app()

if __name__ == "__main__":
    # Iniciamos el servidor en el puerto configurado, solo en localhost
    app.run(host="127.0.0.1", port=app.config["PORT"], debug=True)
