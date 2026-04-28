from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins='*', supports_credentials=False)

import lastfm
import spotify
import sync

app.register_blueprint(lastfm.bp)
app.register_blueprint(spotify.bp)
app.register_blueprint(sync.bp)


@app.route('/health')
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
