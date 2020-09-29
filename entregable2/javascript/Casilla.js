export default class Casilla {

    #posicion;
    #ubicacion;
    #ficha;
    #height;
    #width;
    #borde;

    constructor(x, y, alto, ancho, fila,columna) {
        this.#posicion = { x, y };
        this.#ubicacion = { fila, columna };
        this.#ficha = null;
        this.#borde = parseInt(5);
        this.#height = alto;
        this.#width = ancho;
    }

    get posXcentro() { return this.#posicion.x + (this.#width/2); } //verdadero lugar
    get posYcentro() { return this.#posicion.y + (this.#height/2); }

    get posX() { return this.#posicion.x; }
    get posY() { return this.#posicion.y; }

    get fila() {return this.#ubicacion.fila}
    get columna() {return this.#ubicacion.columna}

    get radio() { 
        let menor = Math.min(this.#width,this.#height);
        return (menor / 2) - (this.#borde * 2); 
    }

    get borde(){ return this.#borde; }
    
    get ficha() { return this.#ficha; }
    set ficha(f) { this.#ficha = f; }

    dibujarHueco(context){
        context.beginPath();
        context.arc(this.posXcentro, this.posYcentro, this.radio, 0, 2*Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
        context.strokeStyle = "#804000"; 
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }

    dibujar(context){
        this.dibujarHueco(context);
        if (this.ficha != null) {
            this.ficha.mover(this.posXcentro, this.posYcentro);
            this.ficha.dibujar(context);
        }
    }
}