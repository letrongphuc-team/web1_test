#!/usr/bin/env python3
"""Chạy: python3 call_external_api/serve_giavang.py — không cần cài thư viện."""

import argparse
import json
import socket
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


API_URL = "https://gw.vnexpress.net/cr/?name=tygia_vangv202206"
DIRECTORY = Path(__file__).resolve().parent


class GoldHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/":
            self.send_response(302)
            self.send_header("Location", "/giavang.html")
            self.end_headers()
        elif path == "/api/gold":
            self.send_gold()
        elif path in ("/giavang.html", "/favicon.ico"):
            super().do_GET()
        else:
            self.send_error(404, "Khong tim thay duong dan")

    def send_gold(self):
        # URL cố định: chỉ chuyển tiếp API này, không nhận URL tùy ý từ trình duyệt.
        request = urllib.request.Request(API_URL, headers={"Accept": "application/json", "User-Agent": "NhipVang-Learning/1.0"})
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                body = response.read(2_000_001)
            if len(body) > 2_000_000:
                raise ValueError("Phan hoi API qua lon")
            payload = json.loads(body)
            if payload.get("code") != 200 or not isinstance(payload.get("data", {}).get("data", {}).get("gold", {}).get("new"), dict):
                raise ValueError("Du lieu API khong hop le")
        except (urllib.error.URLError, TimeoutError, socket.timeout, ValueError, OSError, AttributeError) as error:
            print(f"Khong tai duoc API: {error}", flush=True)
            self.send_json(502, json.dumps({"code": 502, "error": "Không thể kết nối API VnExpress. Hãy kiểm tra kết nối mạng rồi thử lại."}, ensure_ascii=False).encode("utf-8"))
            return
        self.send_json(200, body)

    def send_json(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description="Mở trang giá vàng và chuyển tiếp API VnExpress.")
    parser.add_argument("--port", type=int, default=8000, help="Cổng máy chủ (mặc định: 8000)")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("Cổng phải nằm trong khoảng 1–65535")
    handler = partial(GoldHandler, directory=str(DIRECTORY))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        parser.exit(1, f"Không mở được cổng {args.port}: {error}. Thử thêm --port 8001.\n")
    print(f"Mở http://localhost:{args.port}/giavang.html — Nhấn Ctrl+C để dừng.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nĐã dừng máy chủ.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
