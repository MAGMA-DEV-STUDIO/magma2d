class MAGMA2D {
  constructor(canvasId, width, height) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = width;
    this.canvas.height = height;
    this.objects = [];
    this.keys = {};
    this.keyEvents = [];
    this._bindEvents();
    this._bindClickEvents();
  }
  clear(){
    this.objects = [];
    this.keys = {};
    this.keyEvents = [];
    this._bindEvents();
  }
  // Método privado para manejar los eventos de teclado

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      const keyText = e.key === ' ' ? 'Space' : e.key;
      this.keys = {key: keyText, active: true}
    });
    window.addEventListener('keyup', (e) => {
      const keyText = e.key === ' ' ? 'Space' : e.key;
      this.keys = {key: keyText, active: false}
    });
  }

  _bindClickEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      this.objects.forEach(obj => {
        if (this._isPointInObject(point, obj)) {
          obj.onClick();
        }
      });
    });
  }

  gameLoop() {
    // Limpiar el canvas
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.objects.forEach(obj => { obj.draw(this.ctx) });
    this.keyEvents.forEach(ev=>{
      if(ev.key === this.keys.key && this.keys.active) ev.fx();
    });
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    requestAnimationFrame(() => this.gameLoop());
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  // Método para remover objetos del juego
  removeObject(obj) {
    this.objects = this.objects.filter(o => o !== obj);
  }
  keyboardListener(key,fx){
    this.keyEvents.push({key,fx});
  }

  _isPointInObject(point, obj) {
    if (obj instanceof Triangle) {
      // Puntos del triángulo
      const p1 = { x: obj.x, y: obj.y };
      const p2 = { x: obj.x - obj.width, y: obj.y + obj.height };
      const p3 = { x: obj.x + obj.width, y: obj.y + obj.height };
      
      // Función auxiliar para calcular el área
      const area = (p1, p2, p3) => {
        return Math.abs((p1.x * (p2.y - p3.y) + 
                        p2.x * (p3.y - p1.y) + 
                        p3.x * (p1.y - p2.y)) / 2);
      }
      
      // Área total del triángulo
      const A = area(p1, p2, p3);
      // Áreas de los tres triángulos formados con el punto
      const A1 = area(point, p2, p3);
      const A2 = area(p1, point, p3);
      const A3 = area(p1, p2, point);
      
      // El punto está dentro si la suma de las áreas es igual al área total
      return Math.abs(A - (A1 + A2 + A3)) < 0.1;
    }
    
    // Para otros objetos mantener la detección rectangular
    return point.x >= obj.x && 
           point.x <= obj.x + obj.width && 
           point.y >= obj.y && 
           point.y <= obj.y + obj.height;
  }
}
// Clase para precargar imágenes
class ImagePreloader {
  constructor() {
    this.cache = {};
  }

  /**
   * Recibe un array de URLs de imágenes y devuelve una promesa que se resuelve
   * cuando todas las imágenes se han cargado.
   * @param {string[]} imageSrcs 
   * @returns {Promise} 
   */
  preload(imageSrcs) {
    const promises = imageSrcs.map(src => {
      return new Promise((resolve, reject) => {
        if (this.cache[src]) {
          resolve(this.cache[src]);
          return;
        }
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.cache[src] = img;
          resolve(img);
        };
        img.onerror = () => {
          console.error(`Error cargando la imagen: ${src}`);
          reject(new Error(`Error cargando la imagen: ${src}`));
        };
      });
    });
    return Promise.all(promises);
  }

  /**
   * Devuelve la imagen precargada para el src indicado.
   * @param {string} src 
   * @returns {HTMLImageElement|null}
   */
  get(src) {
    return this.cache[src] || null;
  }
}
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
// Clase base para todos los objetos del juego
class GameObject {
  /**
   * 
   * @param {number} x Posición horizontal.
   * @param {number} y Posición vertical.
   * @param {number} [width=0] Ancho del objeto.
   * @param {number} [height=0] Alto del objeto.
   */
  constructor(x, y, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  onClick() {
    // This method can be overridden by child classes to handle click events
  }

  update(keys) {
    // Actualizar el estado del objeto (por ejemplo, movimiento)
  }

  draw(ctx) {
    // Dibujar el objeto en el canvas
  }
}

class Sprite extends GameObject {
  /**
   * 
   * @param {number} x Posición horizontal.
   * @param {number} y Posición vertical.
   * @param {string} imageSrc Ruta de la imagen.
   * @param {number} width Ancho del sprite.
   * @param {number} height Alto del sprite.
   * @param {ImagePreloader|null} preloader Si se proporciona, se usará la imagen precargada.
   */
  constructor(x, y, imageSrc, width, height, preloader = null) {
    super(x, y, width, height);
    // Si hay preloader y la imagen ya fue precargada, la usamos.
    if (preloader && preloader.get(imageSrc)) {
      this.image = preloader.get(imageSrc);
    } else {
      this.image = new Image();
      this.image.src = imageSrc;
    }
  }

  draw(ctx) {
    // Dibujar la imagen solo si está lista
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
class Rect extends GameObject{
    /**
   * 
   * @param {number} x Posición horizontal.
   * @param {number} y Posición vertical.
   * @param {string} color Color del rectángulo.
   * @param {number} width Ancho del rectángulo.
   * @param {number} height Alto del rectángulo.
   */
    constructor(x, y, color, width, height) {
      super(x, y, width, height);
      this.color = color;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Circle extends GameObject{
  /**
 * 
 * @param {number} x Posición horizontal.
 * @param {number} y Posición vertical.
 * @param {string} color Color del rectángulo.
 * @param {number} width Ancho del rectángulo.
 * @param {number} height Alto del rectángulo.
 */
  constructor(x, y, color, width, height) {
    super(x, y, width, height);
    this.color = color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.height, 0, 2 * Math.PI);
    ctx.fill();
  }
}
class Triangle extends GameObject {
  /**
   * 
   * @param {number} x Posición horizontal.
   * @param {number} y Posición vertical.
   * @param {string} color Color del rectángulo.
   * @param {number} width Ancho del rectángulo.
   * @param {number} height Alto del rectángulo.
   */
  constructor(x, y, color, width, height) {
    super(x, y, width, height);
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    const path=new Path2D();
    path.moveTo(this.x, this.y);
    path.lineTo(this.x-(this.width), this.y+(this.height));
    path.lineTo(this.x+(this.width), this.y+(this.height));
    ctx.fill(path);
  }
}
class Shape{
  Rect({x,y,width,height,color}){ return new Rect(x,y,color,width,height)}
  Circle({x,y,color,size}){ return new Circle(x,y,color,size,size)}
  Triangle({x,y,color,size}){ return new Triangle(x,y,color,size,size)}
}
// Clase para insertar texto en el canvas
class TextObject extends GameObject {
  /**
   * 
   * @param {number} x Posición horizontal.
   * @param {number} y Posición vertical.
   * @param {string} text Texto a mostrar.
   * @param {string} [font='16px sans-serif'] Fuente del texto.
   * @param {string} [fillStyle='black'] Color del texto.
   * @param {string} [textAlign='start'] Alineación del texto.
   */
  constructor({x, y, text, font = '16px sans-serif', fillStyle = 'black', textAlign = 'start'}) {
    // Para textos no es tan relevante el ancho y alto, pero los dejamos por si se requieren en el futuro.
    super(x, y);
    this.text = text;
    this.font = font;
    this.fillStyle = fillStyle;
    this.textAlign = textAlign;
  }

  update(keys) {
    // Actualizar el estado o posición del texto si es necesario
  }

  draw(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.fillStyle;
    ctx.textAlign = this.textAlign;
    ctx.fillText(this.text, this.x, this.y);
  }
}

class Sound {
  constructor(src) {
    this.loading = true;
    this.sound = new Audio(src);
    this.sound.addEventListener('canplaythrough', () => {
      this.loading = false;
    });
  }

  play() {
    this.sound.play();
  }

  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}