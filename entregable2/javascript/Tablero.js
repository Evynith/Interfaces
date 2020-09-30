import Casilla from '../javascript/Casilla.js';

export default class Tablero {

    #tablero;
    #posicion;
    #altoCasilla;
    #anchoCasilla;
    #filas;
    #columnas;
    #image;
    #ganador;

    constructor(area, filas, columnas, image) {
        this.#image = image;
        this.#filas = filas;
        this.#columnas = columnas;
        this.#posicion = area;
        this.#altoCasilla = this.height /filas;
        this.#anchoCasilla = this.width /columnas;
        
        this.vaciar();
    }

    get tablero() { return this.#tablero; }
    get posX() { return this.#posicion.x; }
    get posXfinal() { return this.#posicion.xFinal; }
    get posY() { return this.#posicion.y; }
    get width() { return this.#posicion.xFinal - this.posX; }
    get height() { return this.#posicion.yFinal - this.posY; }
    get columnas() { return this.#columnas; }
    get filas() { return this.#filas; }
    get espacios(){ return (this.#filas * this.#columnas); }
    get radio() { return this.#tablero[1][1].radio; } //una casilla cualquiera,la primera
    get ganador() { return this.#ganador; }

    vaciar(){
        this.#ganador = null;
        this.#tablero = new Array();
        for (let i = 0, y = this.posY; i < this.filas; i++, y += this.#altoCasilla) { 
            this.#tablero.push(new Array());
            for (let j = 0, x = this.posX; j < this.columnas; j++, x += this.#anchoCasilla) {
                this.#tablero[i].push(new Casilla(x, y, this.#altoCasilla,this.#anchoCasilla, i , j));
            }
        }
    }

    addFicha(ficha) {
        let x = ficha.posX, y = ficha.posY; //posicion que cae
        let posX = this.sectorCorrespondienteX(x);//sector
        let casillaY = this.sectorCorrespondienteY(posX);
        if(casillaY != null){
            let posY = casillaY.fila;//casilla.sector
            this.#tablero[posY][posX].ficha = ficha;//primero filas despues columnas
            if(this.hayGanador(posX, posY, ficha) ) {
                this.#ganador = ficha.jugador;
            }
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
            if (casilla.ficha == null) {
                return casilla;// lugar para insertar
            }
        }
        return null; //no hay casilla libre
    }

    * iteradorColumna(x) {
        for (let i = this.#filas -1; i >= 0; i--) { 
            yield this.#tablero[i][x]; 
        }
    }

    getFicha(x, y) {
        if ((x < this.#columnas) && (y < this.#filas) && (x >= 0) && (y >= 0)){
            return this.#tablero[y][x].ficha;
        }
        return null;
    }
    hayGanador(x, y, ficha) {
        // console.log('x: ', x, 'y: ', y);
        let jugador = ficha.jugador;

        const controlVertical = () => {
            let contador = 1;
            for (let y1 = y+1, f1 = this.getFicha(x, y1); f1 && f1.jugador == jugador; ) {
                contador++;
                y1++;
                f1 = this.getFicha(x, y1);
            }
            return contador >= 4;
        }
        const controlHorizontal = () => {
            let contador = 1;
            for (let x1 = x-1, f1 = this.getFicha(x1, y); f1 && f1.jugador == jugador; ) {
                contador++;
                x1--;
                f1 = this.getFicha(x1, y);
            }
            for (let x1 = x+1, f1 = this.getFicha(x1, y); f1 && f1.jugador == jugador; ) {
                contador++;
                x1++;
                f1 = this.getFicha(x1, y);
            }
            return contador >= 4;
        }
        const controlDiagonalCreciente = () => {// baja: y++ x-- sube: y-- x++
            let contador = 1;
            for (let x1 = x-1, y1 = y+1, f1 = this.getFicha(x1, y1); f1 && f1.jugador == jugador; ) {
                contador++;
                x1--;
                y1++;
                f1 = this.getFicha(x1, y1);
            }
            for (let x1 = x+1, y1 = y-1, f1 = this.getFicha(x1, y1); f1 && f1.jugador == jugador; ) {
                contador++;
                x1++;
                y1--;
                f1 = this.getFicha(x1, y1);
            }
            return contador >= 4;
        }
        const controlDiagonalDecreciente = () => {// baja: y++ x++ sube: y-- x--
            let contador = 1;
            for (let x1 = x-1, y1 = y-1, f1 = this.getFicha(x1, y1); f1 && f1.jugador == jugador; ) {
                contador++;
                x1--;
                y1--;
                f1 = this.getFicha(x1, y1);
            }
            for (let x1 = x+1, y1 = y+1, f1 = this.getFicha(x1, y1); f1 && f1.jugador == jugador; ) {
                contador++;
                x1++;
                y1++;
                f1 = this.getFicha(x1, y1);
            }
            return contador >= 4;
        }
        return controlVertical() || controlHorizontal() || controlDiagonalCreciente() || controlDiagonalDecreciente();
    }

    dibujar(context) {
        this.fondo(context);
        for (const fila of this.#tablero) {
            for (const casilla of fila) {
                casilla.dibujar(context);
            }
        }
    }

    fondo(context){
        context.fillStyle = context.createPattern(this.#image , "repeat");
        context.beginPath();
        this.roundedRect(context,this.posX - this.radio,this.posY - this.radio,this.width + this.radio*2 ,this.height + this.radio*2,90);
        context.fill();
        context.closePath();
    }

    roundedRect(ctx,x,y,width,height,radius){
        ctx.beginPath();
        ctx.moveTo(x,y+radius);
        ctx.lineTo(x,y+height-radius);
        ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
        ctx.lineTo(x+width-radius,y+height);
        ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
        ctx.lineTo(x+width,y+radius);
        ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
        ctx.lineTo(x+radius,y);
        ctx.quadraticCurveTo(x,y,x,y+radius);
        ctx.strokeStyle = "#1E1E1E"; 
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}
