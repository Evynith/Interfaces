import Tablero from './Tablero.js';
import Jugador from './Jugador.js';

export default class Juego {

    #context;
    #canvas;
    #tema = [];
    #tamanio = [];
    #tablero;
    #jugador1;
    #jugador2;
    #nombrej1;
    #nombrej2;
    #contrincante;

    #areaTablero = {};
    #areaHuecos  = {};
    #areaJ1  = {};
    #areaJ2  = {};
    #init  = {};
    #offset  = {};

    #figuraArrastrada;
    #ganador;
    #turno;

    constructor(canvas, tema, tamanio, contrincante, j1, j2) {
        this.#context = canvas.getContext("2d");
        this.#canvas = canvas;
        this.#tema = tema;
        this.#tamanio = tamanio;
        this.#nombrej1 = j1;
        this.#nombrej2 = j2;
        this.#contrincante = contrincante;
        this.#figuraArrastrada = null;
        this.#ganador = null;

        this.#areaTablero = {
            x : ((this.width * 20) /100),
            xFinal : this.width - ((this.width * 20) /100),
            y : ((this.height * 10 )/100),
            yFinal : this.height - ((this.height * 10 )/100)
        };
        
        this.#areaHuecos = {
            x : this.#areaTablero.x,
            xFinal : this.#areaTablero.xFinal,
            y : 0,
            yFinal : this.#areaTablero.y
        }
        
        this.#areaJ1 = {
            x : (0),
            xFinal : this.#areaTablero.x,
            y : (0),
            yFinal : this.#areaTablero.yFinal
        }
        
        this.#areaJ2 = {
            x : this.#areaTablero.xFinal,
            xFinal : this.width,
            y : 0,
            yFinal : this.#areaTablero.yFinal 
        }
        this.#init = {//posicion inicial del mouse antes de mover ficha
            x : null,
            y : null
        };
        
        this.#offset = {//para correccion de lugar en figura mientras muevo
            x : null,
            y : null
        };
        this.inicializar();

        this.#canvas.onclick = (e) => { //FIXME: problemas con click?
            const [ x, y ] = [ e.layerX, e.layerY ];
            let jugador = this.jugadorSegunTurno();
            if(jugador){
                this.mover(jugador);
            }
        }
    }

    get width(){ return this.#canvas.width; }
    get height(){ return this.#canvas.height; }

    clear = () => this.#context.clearRect(0, 0, this.width, this.height);

    setBackgroundImage(source) {
        let img = new Image();
        //let retornar = (elem) => {return elem};
        img.src = source;
        console.log(source);
        //img.onload = "cargada";
        img.onload = function () {
            // let pattern = context.createPattern(img, repe);
            // return pattern;

            //return this;
            //return img;
            //retornar(this);


            //context.fillStyle = pattern;
        }
        //if (img.complete) { return img }
        return img; //FIXME:
        
    }

    inicializar(){
        this.#tablero = new Tablero(this.#areaTablero, this.#tamanio[1], this.#tamanio[0],this.setBackgroundImage(this.#tema[0]));

        //TODO: ajustar tamaños para fichas de jugadores si toca casino??
        this.#jugador1 = new Jugador(this.#nombrej1,  this.setBackgroundImage(this.#tema[1]), this.#tablero, this.#areaJ1);
        if (this.#contrincante == 1){
            this.#jugador2 = new Jugador(this.#nombrej2,  this.setBackgroundImage(this.#tema[2]), this.#tablero, this.#areaJ2);
        } else {
            //this.#jugador2 = new Bot(j2,  this.setBackgroundImage(this.#tema[2]), this.#tablero, this.#areaJ2);
        }

        this.#turno = this.#jugador1;
        this.#jugador1.inicializoFichas(this.#context);
        this.#jugador2.inicializoFichas(this.#context);
        this.#tablero.dibujar(this.#context);
    }
    //______________________________________________________________________________MOVIMIENTO DE FICHAS
    siguienteTurno(){
        if (this.#turno == this.#jugador1) {
            this.#turno = this.#jugador2;
        } else if (this.#turno == this.#jugador2){
            this.#turno = this.#jugador1;
        }
    }

    jugadorSegunTurno(){ return this.#turno; }

    dibujarElementos(){
        this.clear();
        this.#tablero.dibujar(this.#context);
        this.#jugador1.dibujoFichas(this.#context);
        this.#jugador2.dibujoFichas(this.#context);
    }

    moverYDibujar(x,y){
        this.#figuraArrastrada.mover(x, y);
        this.dibujarElementos();
    }

    mover(jugador){

        this.#canvas.onmousedown = (e) => {
            const [ x, y ] = [ e.layerX, e.layerY ];
            this.#figuraArrastrada = jugador.fichaSeleccionada(x,y);
        
            if (this.#figuraArrastrada) {
                this.#offset.x = this.#figuraArrastrada.posX - x;
                this.#offset.y = this.#figuraArrastrada.posY - y;
                this.#init.x = x;
                this.#init.y = y;
            }
        }
        
        this.#canvas.onmousemove = (e) => {
            if (this.#figuraArrastrada) {
                let nuevoX = e.layerX + this.#offset.x; 
                let nuevoY = e.layerY + this.#offset.y;
                this.moverYDibujar(nuevoX, nuevoY);
            }
        }
        
        this.#canvas.onmouseup = (e) => {
            if (this.#figuraArrastrada) {
                let nuevoX = e.layerX + this.#offset.x;
                let nuevoY = e.layerY + this.#offset.y;
                if((nuevoX >= this.#areaTablero.x) && (nuevoX <= this.#areaTablero.xFinal) && (nuevoY >= this.#areaTablero.y)){ //area tablero
                    this.moverYDibujar(init.x, init.y);
                } else if((nuevoX >= this.#areaTablero.x) && (nuevoX <= this.#areaTablero.xFinal) && (nuevoY < this.#areaTablero.y)){ //area huecos
                    this.#figuraArrastrada.mover(nuevoX, nuevoY);
                    let metido = jugador.addFicha(this.#figuraArrastrada);
                    if (metido){
                        this.dibujarElementos();
                        this.corroborarGanador();
                    } else {
                        this.moverYDibujar(this.#init.x, this.#init.y);
                    }
                } else {
                    this.moverYDibujar(this.#init.x, this.#init.y);
                }
                this.#figuraArrastrada = null;
            }
        }
    }
    //______________________________________________________________________________________________GANADOR
    //si alguno de los jugadores se quedo sin fichas y no hay ganador = empate
    //cada vez que meto ficha corroboro si hay un ganador

    //un terminar partida que borre tablero y un reiniciar que refresque la pagina
    corroborarGanador(){
        if (this.#tablero.ganador == null){
            if ((this.#jugador1.fichas == 0) || (this.#jugador2.fichas == 0)){
                this.terminarJuego(null);
            } else {
                this.siguienteTurno();
            }
        } else {
            this.#ganador = this.#tablero.ganador;
            this.terminarJuego();
        }
    }

    //devuelvo que hay en la casilla ganador de tablero
    terminarJuego(){
        //TODO: observer
        this.#turno = null;
        if(ganador == null){
            console.log("empate");
        } else {
            console.log(ganador);
        }
    }


}