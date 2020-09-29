import Ficha from './Ficha.js';
import Tablero from './Tablero.js';
import Jugador from './Jugador.js';

export default class Bot extends Jugador {

    constructor(nombre, tipoFicha, tablero,area) { 
        super(nombre, tipoFicha, tablero,area);
    }

    randomXTablero(){
        return this.getRandomArbitrary(this.tablero.posX, this.tablero.posXfinal);
    }

    randomYTablero(){
        return this.getRandomArbitrary(0, this.tablero.posY);
    }

    jugar(){
        let ficha = this.fichas[0];
        let nvoX = this.randomXTablero();
        let nvoY = this.randomYTablero();
        ficha.mover(nvoX, nvoY);
        console.log(nvoX,nvoY);
        if (this.addFicha(ficha)){
            return true;
        } else {
            this.jugar();
        }
        return true;
    }
}