"""
API katalog LerauWear — contoh penerapan Python di Vercel Functions.
Konsep: variabel, tipe data, list/dictionary, function, kondisi, looping, operasi,
serta algoritma validasi pesanan. Endpoint ini tidak menyimpan order secara permanen.
"""
import json
from http.server import BaseHTTPRequestHandler

PRODUCTS = [
    {
        "id": 1,
        "name": "Kaos Free Fire Size M",
        "category": "T-Shirt",
        "price": 89000,
        "tag": "BEST SELLER",
        "rating": "4.9",
        "image": "./assets/kaos_ff.jpg",
        "description": "Kaos Free Fire dengan desain gaming yang keren."
    },
    {
        "id": 2,
        "name": "Kaos Mobile Legend Size L",
        "category": "T-Shirt",
        "price": 149000,
        "tag": "NEW",
        "rating": "4.8",
        "image": "./assets/kaos_ml.jpg",
        "description": "Kaos Mobile Legends untuk penggemar game MOBA."
    },
    {
        "id": 3,
        "name": "Kaos Pubg Size M",
        "category": "T-Shirt",
        "price": 169000,
        "tag": "POPULAR",
        "rating": "4.9",
        "image": "./assets/kaos_pubg.jpg",
        "description": "Kaos PUBG dengan desain khas pecinta battle royale."
    },
    {
        "id": 4,
        "name": "Hoodie Wibu Size M",
        "category": "Hoodie",
        "price": 179000,
        "tag": "NEW",
        "rating": "4.8",
        "image": "./assets/hoodie_wibu.jpg",
        "description": "Hoodie bergaya anime untuk tampilan kasual."
    },
    {
        "id": 5,
        "name": "Jam Ben10 Limited Edition",
        "category": "Jam Tangan",
        "price": 119000,
        "tag": "LIMITED",
        "rating": "4.7",
        "image": "./assets/jam_ben10.jpg",
        "description": "Jam tangan Ben 10 dengan desain unik dan ikonik."
    },
    {
        "id": 6,
        "name": "Jam Power Ranger Asli",
        "category": "Jam Tangan",
        "price": 199000,
        "tag": "BEST SELLER",
        "rating": "4.9",
        "image": "./assets/jam_powerranger.jpg",
        "description": "Jam tangan Power Rangers untuk penggemar superhero."
    },
    {
        "id": 7,
        "name": "Sepatu Jordan Free Fire Uk 40",
        "category": "Sepatu",
        "price": 219000,
        "tag": "LIMITED",
        "rating": "4.8",
        "image": "./assets/sepatu_jordan.jpg",
        "description": "Sepatu bergaya sporty dengan tema Free Fire."
    },
    {
        "id": 8,
        "name": "Sepatu Mobile Legend Asli",
        "category": "Sepatu",
        "price": 79000,
        "tag": "EASY PICK",
        "rating": "4.7",
        "image": "./assets/sepatu_ml.jpg",
        "description": "Sepatu bertema Mobile Legends untuk gaya gaming."
    }
]


def json_response(handler, status_code, payload):
    """Function untuk mengirim respons JSON dengan header CORS."""
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status_code)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        json_response(self, 200, {"ok": True})

    def do_GET(self):
        # Kondisi logika menentukan endpoint yang diminta.
        if self.path.split("?")[0] not in ("/api", "/api/", "/api/products"):
            json_response(self, 404, {"ok": False, "message": "Endpoint tidak ditemukan."})
            return

        # List comprehension adalah pola iterasi untuk menyusun data katalog.
        available_products = [
            product for product in PRODUCTS
            if isinstance(product.get("price"), int) and product["price"] > 0
        ]
        json_response(self, 200, {
            "ok": True,
            "store": "LerauWear",
            "count": len(available_products),
            "products": available_products,
        })

    def do_POST(self):
        # Contoh algoritma validasi order sederhana; belum menyimpan transaksi.
        json_response(self, 405, {
            "ok": False,
            "message": "Checkout dilakukan via WhatsApp pada demo ini."
        })

    def log_message(self, format, *args):
        # Matikan log standar agar output function lebih bersih.
        return
