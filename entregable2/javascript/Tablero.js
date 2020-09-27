import Casilla from '../javascript/Casilla.js';

export default class Tablero {

    #tablero;
    #posicion;
    #altoCasilla;
    #anchoCasilla;
    #filas;
    #columnas;

    constructor(area, filas, columnas) {
        this.#filas = filas;
        this.#columnas = columnas;
        this.#posicion = area;
        this.#altoCasilla = this.height /filas;
        this.#anchoCasilla = this.width /columnas;
        this.#tablero = new Array();
        
        for (let i = 0, y = this.posY; i < filas; i++, y += this.#altoCasilla) { //FIXME: si lo hago al reves da error
            this.#tablero.push(new Array());
            for (let j = 0, x = this.posX; j < columnas; j++, x += this.#anchoCasilla) {
                this.#tablero[i].push(new Casilla(x, y, this.#altoCasilla,this.#anchoCasilla, i , j));
            }
        }
        console.table(this.#tablero);

    }

    get tablero() { return this.#tablero; }
    get posX() { return this.#posicion.x; }
    get posY() { return this.#posicion.y; }
    get width() { return this.#posicion.xFinal - this.posX; }
    get height() { return this.#posicion.yFinal - this.posY; }
    get espacios(){ return (this.#filas * this.#columnas); }

    addFicha(x, y, ficha) {//posicion que cae
        let posX = this.sectorCorrespondienteX(x);//sector
        let casillaY = this.sectorCorrespondienteY(posX);
        if(casillaY != null){
            let posY = casillaY.fila;//casilla.sector
            this.#tablero[posY][posX].ficha = ficha;//primero filas despues columnas
            return true;
        } else {
            return false;
        }
    }

    sectorCorrespondienteX(x){
        let ubicacion = 0;
        for (let i = this.#posicion.x, j = i+this.#anchoCasilla, k = 0; k <= this.#columnas; i+= this.#anchoCasilla, j+= this.#anchoCasilla, k++ ) {
            //i -> pos inicio casilla actual en x
            //j -> pos fin casilla actual en x
            //k -> pos en arreglo de la casilla en x
            if((x >= i) && (x <= j)){
                ubicacion = k;
                break;
            }
        }
        return ubicacion;
    }

    sectorCorrespondienteY(x){
        for (const casilla of this.iteradorColumna(x)) {
            if (casilla.esVacia()) {
                return casilla;// lugar para insertar
            }
        }
        return null; //no hay casilla libre
    }

    /**
     * Iterador de las casillas de la columna x, en orden inverso (de la ultima (la mas abajo) a la primera)
     * en js un iterador se hace con una funcion con antes un *, para devolver un elemento se usa la palabra clave 'yield'
     */
    * iteradorColumna(x) {
        for (let i = this.#filas -1; i >= 0; i--) { // recorro filas al reve
            yield this.#tablero[i][x] // devuelvo la casilla en la columna 'x' de la fila actual
        }
    }

    revisarGanador(){ //cuando ingreso ficha
        //empiezo en 1 (yo)
        let cont = 1;
        //--izquierda derecha
        //mientras haya un tipo igual sumar hacia izquierda (-1 en x)
        //mientras haya un tipo igual sumar hacia derecha (+1 en x)
        //si llego a 4 retornar y terminar
        cont = 1;
        //--arriba abajo
        //mientras haya un tipo igual sumar hacia arriba (+1 en y)
        //mientras haya un tipo igual sumar hacia abajo (-1 en y)
        cont = 1;
        //diagonal decreciente 
        //izq (+1 de y, -1 de x)
        //der (-1 de y, +1 de x)

        cont = 1;
        //diagomnal creciente
        //izq (+1 de y, +1 de x)
        //der (-1 de y, -1 de x)
    }

    dibujar(context) {
        for (const fila of this.#tablero) {
            for (const casilla of fila) {
                casilla.dibujar(context);
            }
        }
    }
}
