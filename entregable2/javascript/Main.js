import Tablero from './Tablero.js';
import Ficha from './Ficha.js';
//import Canvas from './Canvas.js';
import Jugador from './Jugador.js';

//_______________________________________________________________


const canvas = document.querySelector("#myCanvas");
canvas.width = window.innerWidth -20;
canvas.height = window.innerHeight -20;

const width = canvas.width;
const height = canvas.height;

const context = canvas.getContext("2d");
const clear = () => context.clearRect(0, 0, width, height);

const areaTablero = {
    x : ((width * 20) /100),
    xFinal : width - ((width * 20) /100),
    y : ((height * 10 )/100),
    yFinal : height - ((height * 10 )/100)
};

const areaHuecos = {
    x : areaTablero.x,
    xFinal : areaTablero.xFinal,
    y : 0,
    yFinal : areaTablero.y
}

const areaJ1 = {
    x : (0),
    xFinal : areaTablero.x,
    y : (0),
    yFinal : areaTablero.yFinal
}

const areaJ2 = {
    x : areaTablero.xFinal,
    xFinal : width,
    y : 0,
    yFinal : areaTablero.yFinal 
}

//const divCanvas = document.querySelector("#myCanvas");
//const canvas = new Canvas (divCanvas);

const tamOriginal = [7,6];
const tamGrande = [10,7];
const tamEnorme = [13,8];

const texturaMadera1 = "./images/textura-madera1.jpg";
const texturaMadera2 = "./images/textura-madera2.jpg";
const texturaMadera3 = "./images/textura-madera3.jpg";

const t = new Tablero(areaTablero, tamOriginal[1], tamOriginal[0],setBackgroundImage(texturaMadera3));

function setBackgroundImage(source) {
    let img = new Image();
    img.src = source;
    img.onload = () => {
        // let pattern = context.createPattern(img, repe);
        // return pattern;
        
        //context.fillStyle = pattern;
    }
    return img;
}


//const jugador1 = new Jugador("g1", "rgb(255,255,0)", t, areaJ1);
//const jugador2 = new Jugador("g2", "rgb(255,0,255)", t, areaJ2);

const jugador1 = new Jugador("g1",  setBackgroundImage(texturaMadera1), t, areaJ1);
const jugador2 = new Jugador("g2",  setBackgroundImage(texturaMadera2), t, areaJ2);

jugador1.inicializoFichas(context);
jugador2.inicializoFichas(context);
t.dibujar(context);

//______________________________________________________________________________MOVIMIENTO DE FICHAS

const init = {//posicion inicial del mouse antes de mover ficha
    x : null,
    y : null
};

const offset = {//para correccion de lugar en figura mientras muevo
    x : null,
    y : null
};
let turno = jugador1;
function siguienteTurno(){
    if (turno == jugador1) {
        turno = jugador2;
    } else {
        turno = jugador1;
    }
}

function jugadorSegunTurno(){
    switch(turno){
        case jugador1: return jugador1;
        case jugador2: return jugador2;
        default: return null;
    }
}

let figuraArrastrada = null;
canvas.onclick = (e) => { //FIXME: problemas con click?
    const [ x, y ] = [ e.layerX, e.layerY ];
    let jugador = jugadorSegunTurno();
    if(jugador){
        mover(jugador);
    }
}

function dibujarElementos(){
    clear();
    t.dibujar(context);
    jugador1.dibujoFichas(context);
    jugador2.dibujoFichas(context);
}

function moverYDibujar(x,y){
    figuraArrastrada.mover(x, y);
    dibujarElementos();
}

function mover(jugador){

    canvas.onmousedown = (e) => {
        const [ x, y ] = [ e.layerX, e.layerY ];
        figuraArrastrada = jugador.fichaSeleccionada(x,y);
       
        if (figuraArrastrada) {
            offset.x = figuraArrastrada.posX - x;
            offset.y = figuraArrastrada.posY - y;
            init.x = x;
            init.y = y;
        }
    }
    
    canvas.onmousemove = (e) => {
        if (figuraArrastrada) {
            let nuevoX = e.layerX + offset.x; 
            let nuevoY = e.layerY + offset.y;
            moverYDibujar(nuevoX, nuevoY);
        }
    }
    
    canvas.onmouseup = (e) => {
        if (figuraArrastrada) {
            let nuevoX = e.layerX + offset.x;
            let nuevoY = e.layerY + offset.y;
            if((nuevoX >= areaTablero.x) && (nuevoX <= areaTablero.xFinal) && (nuevoY >= areaTablero.y)){ //area tablero
                moverYDibujar(init.x, init.y);
            } else if((nuevoX >= areaTablero.x) && (nuevoX <= areaTablero.xFinal) && (nuevoY < areaTablero.y)){ //area huecos
                figuraArrastrada.mover(nuevoX, nuevoY);
                let metido = jugador.addFicha(figuraArrastrada);
                if (metido){
                    dibujarElementos();
                    siguienteTurno();
                } else {
                    moverYDibujar(init.x, init.y);
                }
            } else {
                moverYDibujar(init.x, init.y);
            }
            figuraArrastrada = null;
        }
    }
}
//______________________________________________________________________________________________________________

