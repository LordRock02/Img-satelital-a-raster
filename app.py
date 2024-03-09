from PIL import Image
import os
from flask import Flask, render_template, request, redirect, url_for, jsonify
from io import BytesIO
from img_to_raster import imgToRaster
from img_to_raster import generarImgRaster


app = Flask(__name__) 

UPLOAD_FOLDER = 'static/uploads' 

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        foto = request.files.get('foto')
        if foto:
            filename = foto.filename
            path = os.path.join(UPLOAD_FOLDER, filename)
            foto.save(path)
        return jsonify({'filename': foto.filename})
    
@app.route('/generate-raster', methods=['POST'])
def generateRaster():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        color = request.form.get('color')
        name = generarImgRaster(nombre, color)
        return jsonify({'name' : name})

if __name__ == '__main__':
    app.run(debug=True)