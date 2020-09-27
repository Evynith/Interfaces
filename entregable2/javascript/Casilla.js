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

    get posXcentro() { return this.#posicion.x + (this.radio + this.#borde *2); } //verdadero lugar
    get posYcentro() { return this.#posicion.y + (this.radio + this.#borde *2); }

    get posX() { return this.#posicion.x; }
    get posY() { return this.#posicion.y; }

    get fila() {return this.#ubicacion.fila}
    get columna() {return this.#ubicacion.columna}

    get radio() {
        return (this.#width / 2) - (this.#borde * 2);
    }
    get borde(){
        return this.#borde;
    }
    set ficha(f) {
        console.log("insertada");
        // actualizar la posicion de la ficha a la de la casilla en la que se insertó
        this.#ficha = f; //TODO: poner aca la ficha cuando se ubique, hacer el context general¿? una clase canvas de la que accedo de todos lados?
    }
    get ficha() {
        return this.#ficha;
    }

    esVacia() { 
        if(this.#ficha == null){
            return true;
        } else {
            return false;
        }
    }
//TODO: separar las figuras de la clase casilla
    dibujarFondo(context){
        context.beginPath();
        context.rect(this.posX, this.posY, this.#width, this.#height);
        context.fillStyle = "#0000CC";
        context.fill();
        context.closePath();
    }
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

    dibujar(context) {
        this.dibujarFondo(context);
        this.dibujarHueco(context);
        if (!this.esVacia()) {
            this.ficha.dibujar(context, this.posXcentro, this.posYcentro, this.radio); //TODO: que no tenga que ´pasarle el radio
        }
    }
}