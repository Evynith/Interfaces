import Ficha from './Ficha.js';
import Tablero from './Tablero.js';

export default class Jugador {

    nombre;
    tipoFicha;
    fichas;
    tablero;
    area;
    ganadas;

    constructor(nombre, tipoFicha, tablero,area) { 
        this.nombre = nombre;
        this.tipoFicha = tipoFicha;
        this.tablero = tablero;
        this.area = area;
        this.ganadas = 0;
    }

    get nombre(){ return this.nombre; }
    get fichas() { return this.fichas.length; }
    get ganadas() { return this.ganadas; }

    crearFichas(){
        this.fichas = [];
        for(let i = 0; i < this.tablero.espacios/2 ; i++){ // cantidadFichas: tablero.espacios/2
            this.fichas.push(new Ficha(this, this.tipoFicha, this.tablero.radio));
        }
    }
    sumarPunto(){
        this.ganadas += 1;
    }

    fichaSeleccionada(x,y){
        let ficha = null;
        this.fichas.forEach(e => {
            if(e.dentro(x,y)) { //si esta dentro de esta figura
                ficha = e;
            }
        }) 
        return ficha;
    }

    esFicha(x,y){
        let result = false;
        this.fichas.forEach(e => {
            if(e.dentro(x,y)){
                result = true;
            }
        }) 
        return result;
    }

    addFicha(ficha){
        let metida = this.tablero.addFicha(ficha);
        if (metida) { this.quitarFichaDeBatea(ficha); }
        return metida;
    }

    quitarFichaDeBatea(ficha){
        let i = this.fichas.indexOf(ficha);
        this.fichas.splice(i,1);
    }
    
    moverFicha(xMouse,yMouse, x,y){ 
        let ficha = this.fichaSeleccionada(xMouse,yMouse);
        ficha.mover(x,y);
    }

    getRandomArbitrary(min, max) { // Retorna un número aleatorio entre min (incluido) y max (excluido)
        return Math.round(Math.random() * (max - min) + min);
    }

    randomXBatea(){
        return this.getRandomArbitrary(this.area.x + this.tablero.radio, this.area.xFinal - this.tablero.radio);//menos el radio para que no queden en los bordes
    }
    randomYBatea(){
        return this.getRandomArbitrary(this.area.y + this.tablero.radio, this.area.yFinal - this.tablero.radio);
    }

    inicializoFichas(context){
        this.crearFichas();
        this.fichas.forEach(e => {
            e.posX = this.randomXBatea();
            e.posY = this.randomYBatea();
        })
        this.dibujoFichas(context);
    }

    dibujoFichas(context){ 
        this.fichas.forEach(e => {
            e.dibujar(context);
        })
    }

}