import Casilla from '../javascript/Casilla.js';

export default class Tablero {

    #tablero;
    #posicion;
    #altoCasilla;
    #anchoCasilla;
    #filas;
    #columnas;
    #image;

    constructor(area, filas, columnas, image) {
        this.#image = image;
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
    }

    get tablero() { return this.#tablero; }
    get posX() { return this.#posicion.x; }
    get posY() { return this.#posicion.y; }
    get width() { return this.#posicion.xFinal - this.posX; }
    get height() { return this.#posicion.yFinal - this.posY; }
    get espacios(){ return (this.#filas * this.#columnas); }

    addFicha(ficha) {
        let x = ficha.posX, y = ficha.posY; //posicion que cae
        let posX = this.sectorCorrespondienteX(x);//sector
        let casillaY = this.sectorCorrespondienteY(posX);
        if(casillaY != null){
            let posY = casillaY.fila;//casilla.sector
            this.#tablero[posY][posX].ficha = ficha;//primero filas despues columnas
            if (this.revisarGanador(posX,posY, ficha)) {//le paso posicion en el tablero de la ultima ficha
                console.log("ganador : ", ficha.jugador); //TODO: observer??
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
            if (casilla.esVacia()) {
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
    
    * iteradorRevisionColumna(x){
        for(let i = x; i < this.#filas; i++){ //desde mi posicion hacia abajo, porque voy a ser la ultima posicion de la ficha ingresada 
            yield this.#tablero[i][x];
        }
    }
    * iteradorRevisionfilaDerecha(y){
        for(let i = y; i < this.#columnas; i++){ //desde mi posicion hacia derecha
            yield this.#tablero[y][i];
        }
    }
    * iteradorRevisionfilaIzquierda(y){
        for(let i = y; i >= 0; i--){ //desde mi posicion hacia izquierda
            yield this.#tablero[y][i];
        }
    }

    * iteradorRevisionDiagonalCrecienteSup(x,y){
        for(let i = x, j = y; i < this.#filas -1, j >= 0; i++, j--){ //desde mi posicion hacia arriba diagonal derecha
            yield this.#tablero[j][i]  //y,x -> alto, ancho
        }
    }
    * iteradorRevisionDiagonalCrecienteInf(x,y){
        for(let i = x, j = y; i >= 0 , j < this.#filas -1; i--, j++){ //desde mi posicion hacia abajo diagonal derecha
            yield this.#tablero[j][i] 
        }
    }
    * iteradorRevisionDiagonalDecrecienteInf(x,y){
        for(let i = x, j = y ; i < this.#filas -1, j < this.#columnas -1; i++, j++){ //desde mi posicion hacia abajo diagonal derecha
            yield this.#tablero[j][i] 
        }
    }
    * iteradorRevisionDiagonalDecrecienteSup(x,y){
        for(let i = x , j = y ; i >= 0, j >= 0; i--, j--){ //desde mi posicion hacia arriba diagonal izquierda
            yield this.#tablero[j][i] 
        }
    }

    contadorGenerico(x,y,jugador,iterador){
        let contador = 0; 
        for (const casilla of  iterador(x,y)) {
            if ((casilla != null) && (!casilla.esVacia())) {
                if(casilla.ficha.jugador == jugador){
                    contador ++;
                }
            }
        }
        return contador;
    }

    contadorDiagonalCreciente(x,y,jugador){
        let diagCrecienteSup = () => this.iteradorRevisionDiagonalCrecienteSup(x,y);
        let diagCrecienteInf = () => this.iteradorRevisionDiagonalCrecienteInf(x,y);
        let valor1 = 0, valor2 = 0;
        valor1 = this.contadorGenerico(x,y,jugador,diagCrecienteSup);
        valor2 = this.contadorGenerico(x,y,jugador,diagCrecienteInf);

        return valor1 + valor2;
    }

    contadorDiagonalDecreciente(x,y,jugador){
        let diagDecrecienteSup = () => this.iteradorRevisionDiagonalDecrecienteSup(x,y);
        let diagDecrecienteInf = () => this.iteradorRevisionDiagonalDecrecienteInf(x,y);
        let valor1 = 0, valor2 = 0;
        valor1 = this.contadorGenerico(x,y,jugador,diagDecrecienteSup);
        valor2 = this.contadorGenerico(x,y,jugador,diagDecrecienteInf);
        
        return valor1 + valor2;
    }

    contadorHorizontal(x,y,jugador){
        let horizontalDer = () => this.iteradorRevisionfilaDerecha(y);
        let horizontalIzq = () => this.iteradorRevisionfilaIzquierda(y);
        
        let valor1 = this.contadorGenerico(x,y,jugador,horizontalDer);
        let valor2 = this.contadorGenerico(x,y,jugador,horizontalIzq);
        return valor1 + valor2;
    }

    contadorVertical(x,y,jugador){
        let fila = () => this.iteradorRevisionColumna(x);
        let valor = this.contadorGenerico(x,y,jugador,fila);
        return valor;
    }

    revisarGanador(x,y,ficha){ //cuando ingreso ficha, a partir de su posicion, retorno si es ficha de ganador
        let jugador = ficha.jugador;
        if( ( this.contadorDiagonalCreciente(x,y,jugador) >= 4) ||  (this.contadorDiagonalDecreciente(x,y,jugador) >= 4) ||  (this.contadorHorizontal(x,y,jugador) >= 4) || (this.contadorVertical(x,y,jugador) >=4)){
            return true;
        } else{
            return false;
        }
    }

    dibujar(context) {
        this.borde(context);
        for (const fila of this.#tablero) {
            for (const casilla of fila) {
                casilla.dibujar(context, this.#image);
            }
        }
    }

    borde(context){
        context.fillStyle = context.createPattern(this.#image , "repeat");
        context.beginPath();
        this.roundedRect(context,this.posX - 20,this.posY -20,this.width +40,this.height +40,90);
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
        //ctx.stroke();
    }
}
