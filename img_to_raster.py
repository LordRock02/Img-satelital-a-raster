import numpy as np
import matplotlib.pyplot as plt
from PIL import Image  
import rasterio
from rasterio.plot import show


def imgToRaster(img:Image):
    imagen = img

    imagen_matriz = np.asarray(imagen)

    print(imagen_matriz)
    plt.imshow(imagen_matriz)
    

def generarImgRaster(name, color):
    imagen = rasterio.open(f'static/uploads/{name}')

    fig, ax = plt.subplots(figsize=(10, 10))

    _color = color

    show((imagen), cmap = color, ax=ax)
    
    _name = f'{_color}.png'

    plt.savefig(f'static/uploads/{_name}')

    return _name