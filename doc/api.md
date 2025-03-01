# MAGMA2D API Reference

## Core Classes

### MAGMA2D
Main game engine class that handles canvas initialization and game loop.

#### Constructor
```javascript
new MAGMA2D(canvasId, width, height)
```
- `canvasId` (string): ID of the canvas element
- `width` (number): Canvas width in pixels
- `height` (number): Canvas height in pixels

#### Methods
- `start()`: Initiates the game loop
- `addObject(obj)`: Adds a game object to the scene
- `removeObject(obj)`: Removes a game object from the scene
- `clear()`: Clears all objects and event listeners
- `keyboardListener(key, fx)`: Adds a keyboard event listener

### GameObject
Base class for all game objects.

#### Constructor
```javascript
new GameObject(x, y, width = 0, height = 0)
```
- `x` (number): Horizontal position
- `y` (number): Vertical position
- `width` (number): Object width
- `height` (number): Object height

### Sprite
Class for handling image-based game objects.

#### Constructor
```javascript
new Sprite(x, y, imageSrc, width, height, preloader = null)
```
- `imageSrc` (string): Path to the image file
- `preloader` (ImagePreloader): Optional image preloader instance

### Shape
Utility class for creating basic geometric shapes.

#### Methods
- `Rect({x, y, width, height, color})`: Creates a rectangle
- `Circle({x, y, color, size})`: Creates a circle
- `Triangle({x, y, color, size})`: Creates a triangle

### TextObject
Class for rendering text on the canvas.

#### Constructor
```javascript
new TextObject(x, y, text, font = '16px sans-serif', fillStyle = 'black', textAlign = 'start')
```

### Sound
Class for handling audio in games.

#### Constructor
```javascript
new Sound(src)
```

#### Methods
- `play()`: Plays the sound
- `stop()`: Stops the sound

### ImagePreloader
Utility class for preloading game images.

#### Methods
- `preload(imageSrcs)`: Preloads an array of image URLs
- `get(src)`: Retrieves a preloaded image

## Utility Functions

### checkCollision(a, b)
Checks collision between two game objects.
- `a` (GameObject): First object
- `b` (GameObject): Second object
- Returns: boolean