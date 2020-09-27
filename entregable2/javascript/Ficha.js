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
        this.#posX = 0;//no
        this.#posY = 0;//no
        this.#radio = 30;//no
    }

    get imagen() {
        return this.#imagen;
    }
    get jugador(){
        return this.#jugador;
    }
    get radio(){
        return this.#radio;
    }
    set radio(r){
        this.#radio = r;
    }
    set posX(x){
        this.#posX = x;
    }
    set posY(y){
        this.#posY = y;
    }
    get posX(){
        return this.#posX;
    }
    get posY(){
        return this.#posY;
    }

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
    
    mover(x,y){      //(context,x,y){
        this.#posX = x;
        this.#posY = y;
        //console.log("movida");
        //this.dibujar(context,x,y,this.#radio)
    }
}