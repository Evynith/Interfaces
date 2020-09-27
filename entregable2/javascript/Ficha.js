import Casilla from '../javascript/Casilla.js';

export default class Ficha {

    #jugador;
    #imagen;
    #radio;
    #posX;
    #posY;

    constructor(jugador, imagen) {//TODO: radio por aca!!!
        this.#jugador = jugador;
        this.#imagen = imagen;
    }

    get imagen() { return this.#imagen; }
    get jugador(){ return this.#jugador; }
    get radio(){ return this.#radio; }
    get posX(){ return this.#posX; }
    get posY(){ return this.#posY; }
    set radio(r){ this.#radio = r; }
    set posX(x){ this.#posX = x; }
    set posY(y){ this.#posY = y; }
    

    dibujar(context, x, y, radio) {
        this.#radio = radio;//TODO:
        this.#posX = x;
        this.#posY = y;
        context.beginPath();
        context.arc(this.posX, this.posY, this.#radio, 0, 2*Math.PI);
        context.fillStyle = this.imagen;
        context.fill();
        context.closePath();
    }

    redibujar(context){ //TODO: sacar 
        this.dibujar(context, this.#posX, this.#posY, this.#radio);
    }
    
    mover(x,y){  
        this.#posX = x;
        this.#posY = y;
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