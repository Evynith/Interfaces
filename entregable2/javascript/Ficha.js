import Casilla from '../javascript/Casilla.js';

export default class Ficha {

    #jugador;
    #imagen;
    #radio;
    #posX;
    #posY;

    constructor(jugador, imagen, radio) {
        this.#radio = radio;
        this.#jugador = jugador;
        this.#imagen = imagen;
    }

    get imagen() { return this.#imagen; }
    get jugador(){ return this.#jugador; }
    get radio(){ return this.#radio; }
    get posX(){ return this.#posX; }
    get posY(){ return this.#posY; }

    set posX(x){ this.#posX = x; }
    set posY(y){ this.#posY = y; }
    

    dibujar(context) {
        context.beginPath();
        context.fillStyle = context.createPattern(this.#imagen , "no-repeat");
        context.save();
        context.translate(this.posX - this.radio, this.posY- this.radio);
        context.arc(0 + this.radio, 0 + this.radio, this.#radio, 0, 2*Math.PI);
        context.fill();
        context.restore();
        context.closePath();
    }
    
    mover(x,y){  
        this.posX = x;
        this.posY = y;
    }

    distanciaEntrePuntos(x1, y1) {
        let c1 = x1 - this.posX; 
        let c2 = y1 - this.posY; 
        let distancia = Math.hypot(c1, c2);
        return distancia;
    }

    dentro(x,y){
        return (this.distanciaEntrePuntos(x,y) <= this.radio)//si esta dentro de esta figura
    }
}