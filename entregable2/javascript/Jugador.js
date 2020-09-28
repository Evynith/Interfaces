import Ficha from './Ficha.js';
import Tablero from './Tablero.js';

export default class Jugador {

    #nombre;
    #tipoFicha;
    #fichas = [];
    #tablero;
    #area;

    constructor(nombre, tipoFicha, tablero,area) { 
        this.#nombre = nombre;
        this.#tipoFicha = tipoFicha;
        this.#tablero = tablero;
        this.#area = area;

        for(let i = 0; i < tablero.espacios/2 ; i++){ // cantidadFichas: tablero.espacios/2
            this.#fichas.push(new Ficha(this, this.#tipoFicha));
        }
    }

    get nombre(){ return this.#nombre; }

    fichaSeleccionada(x,y){
        let ficha = null;
        this.#fichas.forEach(e => {
            if(e.dentro(x,y)) { //si esta dentro de esta figura
                ficha = e;
            }
        }) 
        return ficha;
    }

    esFicha(x,y){
        let result = false;
        this.#fichas.forEach(e => {
            if(e.dentro(x,y)){
                result = true;
            }
        }) 
        return result;
    }

    addFicha(ficha){//FIXME: error si seteo antes la posicion de la ficha y tomo x e y de ahi
        let metida = this.#tablero.addFicha(ficha);
        if (metida) { this.quitarFichaDeBatea(ficha); }
        return metida;
    }

    quitarFichaDeBatea(ficha){
        let i = this.#fichas.indexOf(ficha);
        this.#fichas.splice(i,1);
    }
    
    moverFicha(xMouse,yMouse, x,y){ 
        let ficha = this.fichaSeleccionada(xMouse,yMouse);
        ficha.mover(x,y);
    }

    getRandomArbitrary(min, max) { // Retorna un número aleatorio entre min (incluido) y max (excluido)
        return Math.random() * (max - min) + min;
    }

    randomX(){
        return this.getRandomArbitrary(this.#area.x, this.#area.xFinal);//TODO: menos el radio para que no queden en los bordes
    }
    randomY(){
        return this.getRandomArbitrary(this.#area.y, this.#area.yFinal);
    }

    inicializoFichas(context){
        this.#fichas.forEach(e => {
            e.posX = this.randomX();
            e.posY = this.randomY();
            e.radio = 30;//FIXME: no hardcodeado
        })
        this.dibujoFichas(context);
    }

    dibujoFichas(context){ //TODO: sacarlo de aca, no es tarea del jugador??
        this.#fichas.forEach(e => {
            e.redibujar(context);//FIXME: esta funcion no va
        })
    }

}