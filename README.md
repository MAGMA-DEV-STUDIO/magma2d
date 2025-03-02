# magma2d

Una librería ligera para crear juegos 2D usando HTML Canvas. Diseñada para desarrollar juegos básicos con el mínimo de recursos y la menor cantidad de KB.

## Instalación

1. Descarga el archivo `magma2d.js` de la carpeta `lib`
2. Incluye el archivo en tu proyecto HTML:

```html
<script src="path/to/magma2d.js"></script>
```

## Uso Básico

```javascript
// Inicializar el motor de juego
const game = new MAGMA2D('gameCanvas', 800, 600);

// Crear objetos del juego
const player = new Rect(100, 100, 'blue', 50, 50);
const text = new TextObject(10, 30, 'Score: 0');

// Agregar objetos a la escena
game.addObject(player);
game.addObject(text);

// Manejar eventos del teclado
game.keyboardListener('ArrowRight', () => {
    player.x += 5;
});

// Iniciar el juego
game.start();
```

## Características

- Motor de juego ligero y eficiente
- Sistema de objetos de juego flexible
- Manejo de formas básicas (rectángulos, círculos, triángulos)
- Soporte para sprites e imágenes
- Sistema de detección de colisiones
- Manejo de eventos de teclado
- Soporte para texto y sonido
- Precarga de imágenes

## Documentación

Para una documentación detallada de la API, consulta el [Manual de Referencia](doc/api.md).

## Ejemplos

Puedes encontrar ejemplos prácticos en la carpeta `examples/`.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.