import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add security and compression friendly headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    # Render provides PORT in the environment (defaults to 10000 or 8080)
    port = int(os.environ.get("PORT", 10000))
    server_address = ('0.0.0.0', port)
    
    # Change working directory to the directory where app.py is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    httpd = HTTPServer(server_address, CustomHandler)
    print(f"R.S. Constructions 3D Web Server running on port {port}...", flush=True)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...", flush=True)
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run()
