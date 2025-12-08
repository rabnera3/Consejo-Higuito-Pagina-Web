import os
import re
import time
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

# URL inicial
START_URL = "https://www.consejohiguito.hn/"
OUTPUT_DIR = "imagenes_consejohiguito"

# Crear sesión HTTP con User-Agent decente
session = requests.Session()
session.headers.update({
    "User-Agent": "CIH-ImageScraper/1.0 (+https://www.consejohiguito.hn/)"
})

# Conjuntos para evitar repetir trabajo
visitadas = set()
imagenes_descargadas = set()

os.makedirs(OUTPUT_DIR, exist_ok=True)


def mismo_dominio(url):
    """Verifica que la URL pertenezca al mismo dominio que START_URL."""
    return urlparse(url).netloc == urlparse(START_URL).netloc


def normalizar_url(url, base):
    """Convierte URLs relativas en absolutas y quita el fragmento (#...)."""
    if not url:
        return None
    url = url.split("#")[0]
    return urljoin(base, url)


def carpeta_para_url(url):
    """
    Genera una carpeta basada en el path de la URL.
    Ejemplos:
      https://www.consejohiguito.hn/              -> root
      https://www.consejohiguito.hn/blog/         -> blog
      https://www.consejohiguito.hn/proyectos/abc -> proyectos_abc
    """
    parsed = urlparse(url)
    path = parsed.path.strip("/")

    if not path:
        path = "root"

    # Si hay query string, lo agregamos para diferenciar
    if parsed.query:
        path = f"{path}__{parsed.query}"

    # Limpiar caracteres raros para usarlo como nombre de carpeta
    safe = re.sub(r"[^a-zA-Z0-9_-]+", "_", path)

    carpeta = os.path.join(OUTPUT_DIR, safe)
    os.makedirs(carpeta, exist_ok=True)
    return carpeta


def descargar_imagen(img_url, carpeta_destino):
    """Descarga una imagen en la carpeta específica de la página."""
    if not img_url:
        return

    # Si no quieres evitar duplicados por URL, comenta estas dos líneas:
    if img_url in imagenes_descargadas:
        return

    # Ignorar data URLs o cosas raras
    if img_url.startswith("data:"):
        return

    try:
        resp = session.get(img_url, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f"[X] Error descargando {img_url}: {e}")
        return

    # Construir nombre de archivo
    ruta = urlparse(img_url).path
    nombre = os.path.basename(ruta) or "image"

    base, ext = os.path.splitext(nombre)
    if not ext:
        content_type = resp.headers.get("Content-Type", "").lower()
        if "png" in content_type:
            ext = ".png"
        elif "gif" in content_type:
            ext = ".gif"
        else:
            ext = ".jpg"
        nombre = base + ext

    # Evitar sobrescribir archivos dentro de la misma carpeta
    destino = os.path.join(carpeta_destino, nombre)
    contador = 1
    while os.path.exists(destino):
        destino = os.path.join(carpeta_destino, f"{base}_{contador}{ext}")
        contador += 1

    try:
        with open(destino, "wb") as f:
            f.write(resp.content)
        imagenes_descargadas.add(img_url)
        print(f"[✔] Imagen descargada: {img_url} → {destino}")
    except Exception as e:
        print(f"[X] Error guardando {destino}: {e}")


def crawl(url):
    """Función recursiva que recorre el sitio y descarga imágenes."""
    url = normalizar_url(url, START_URL)
    if not url:
        return

    if url in visitadas:
        return

    if not mismo_dominio(url):
        return

    visitadas.add(url)
    print(f"[→] Visitando: {url}")

    try:
        resp = session.get(url, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f"[X] Error al abrir {url}: {e}")
        return

    content_type = resp.headers.get("Content-Type", "")
    if "text/html" not in content_type:
        return

    soup = BeautifulSoup(resp.text, "html.parser")

    # Carpeta para ESTA página
    carpeta_pagina = carpeta_para_url(url)

    # 1) Descargamos imágenes de esta página en su propia carpeta
    for img in soup.find_all("img"):
        src = img.get("src")
        img_url = normalizar_url(src, url)
        if img_url and img_url.startswith("http"):
            descargar_imagen(img_url, carpeta_pagina)

    # 2) Seguimos los enlaces internos (recursivo)
    for a in soup.find_all("a"):
        href = a.get("href")
        next_url = normalizar_url(href, url)
        if not next_url:
            continue

        if next_url.startswith("mailto:") or next_url.startswith("tel:"):
            continue

        if mismo_dominio(next_url) and next_url not in visitadas:
            time.sleep(0.5)
            crawl(next_url)


if __name__ == "__main__":
    print("[*] Iniciando scrapper recursivo de imágenes del CIH...")
    crawl(START_URL)
    print(f"[*] Listo, amor. Se guardó todo en la carpeta base: {OUTPUT_DIR}")
