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

    get nombre(){
        return this.#nombre;
    }

    //hace todo esto cuando detecta que una ficha esta en posicion___________________
    distanciaEntrePuntos(x1, y1, x2, y2) {
        let c1 = x1 - x2; 
        let c2 = y1 - y2; 
        let distancia = Math.hypot(c1, c2);
        return distancia;
    }

    fichaSeleccionada(x,y){
        let ficha = null;
        this.#fichas.forEach(e => {
            if((this.distanciaEntrePuntos(x,y, e.posX, e.posY) <= e.radio)){//si esta dentro de esta figura
                console.log("devolvi ficha", e);
                ficha = e;
            }
        }) 
        return ficha;
    }

    esFicha(x,y){
        let result = false;
        this.#fichas.forEach(e => {
            if((this.distanciaEntrePuntos(x,y,e.posX,e.posY) <= e.radio)){//si esta dentro de esta figura
                console.log("devolvi true");
                result = true;
            }
        }) 
        return result;
    }

    addFicha(xMouse, yMouse, ficha){//FIXME: error si seteo antes la posicion de la ficha y tomo x e y de ahi
        this.#tablero.addFicha(xMouse, yMouse, ficha);
        this.quitarFichaDeBatea(ficha);
    }

    quitarFichaDeBatea(ficha){
        let i = this.#fichas.indexOf(ficha);
        this.#fichas.splice(i,1);
    }
    //__________________________________________________________________
    moverFicha(xMouse,yMouse, x,y){ //context
        //TODO: eliminara de donde estaba (en main?)
        let ficha = this.fichaSeleccionada(xMouse,yMouse);
        console.log("ficha encontrada", ficha);
        ficha.mover(x,y);
        //this.fichaSeleccionada(xMouse,yMouse).dibujar(context,x,y ,20); //FIXME: radio hardcodeado
    }

    // Retorna un número aleatorio entre min (incluido) y max (excluido)
    getRandomArbitrary(min, max) {
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

    dibujoFichas(context){ //TODO: sacarlo de aca, no es tarea del jugador
        this.#fichas.forEach(e => {
            e.redibujar(context);//FIXME: esta funcion no va
        })
    }

}