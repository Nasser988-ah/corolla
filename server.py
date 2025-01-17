# -*- coding: utf-8 -*-
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css')
        SimpleHTTPRequestHandler.end_headers(self)

port = 8000
print(f"Starting server on port {port}...")
httpd = HTTPServer(('0.0.0.0', port), CORSRequestHandler)
print(f"Server running at http://localhost:{port}")
httpd.serve_forever()
