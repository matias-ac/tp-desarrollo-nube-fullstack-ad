import re


def sanitizar_input(texto, max_length=100):
    if not isinstance(texto, str):
        return ""
    texto = texto.strip()
    texto = re.sub(r"[<>\"';]", "", texto)
    return texto[:max_length]


def validar_campo_numerico(valor, minimo=0.0, maximo=None):
    if not isinstance(valor, (int, float)):
        return False
    if valor < minimo:
        return False
    if maximo is not None and valor > maximo:
        return False
    return True
