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

const t = new Tablero(areaTablero, tamOriginal[1], tamOriginal[0]);

const texturaMadera = "./images/textura-madera.jpg";
const circuloTransparente = "./images/circle.png";
const repetition = "repeat";

function setBackgroundImage(source, repe) {
    let img = new Image();
    img.src = source;
    img.onload = () => {
        let pattern = context.createPattern(img, repe);
        return pattern;
        //context.fillStyle = pattern;
    }
}


const jugador1 = new Jugador("g1", "rgb(255,255,0)", t, areaJ1);
//const jugador1 = new Jugador("g1",  setBackgroundImage(texturaMadera, repetition ), t, areaJ1);
const jugador2 = new Jugador("g2", "rgb(255,0,255)", t, areaJ2);

jugador1.inicializoFichas(context);
jugador2.inicializoFichas(context);

//_____________________________________________________________________________
t.dibujar(context);

const init = {
    x : null,
    y : null
};
const offset = {//para correccion de lugar en figura
    x : null,
    y : null
};
function jugadorSegunArea(x,y){
    if((x < areaJ1.xFinal) && (y < areaJ1.yFinal)){
        return jugador1;
    } else if ((x > areaJ2.x)  && (y < areaJ2.yFinal)){
        return jugador2;
    } else {
        return null;
    }
}
let figuraArrastrada = null;
canvas.onclick = (e) => {
    const [ x, y ] = [ e.layerX, e.layerY ];
    //miro cual seccion es, dependiendo se de que jugador es
    let jugador = jugadorSegunArea(x,y);
    if(jugador){
        mover(jugador);//TODO: todo esto solo si es su turno
    }
}
function mover(jugador){

    canvas.onmousedown = (e) => {
        const [ x, y ] = [ e.layerX, e.layerY ];
        figuraArrastrada = jugador.fichaSeleccionada(x,y);
       
        if (figuraArrastrada) {
            offset.x = figuraArrastrada.posX - x;//FIXME: posX y posY
            offset.y = figuraArrastrada.posY - y;
            init.x = x;
            init.y = y;
        }
    }
    
    canvas.onmousemove = (e) => {
        if (figuraArrastrada) {
            let nuevoX = e.layerX + offset.x;
            let nuevoY = e.layerY + offset.y;
            clear();
            figuraArrastrada.mover(nuevoX, nuevoY);
            t.dibujar(context);
            jugador1.dibujoFichas(context);
            jugador2.dibujoFichas(context);
        }
    }
    
    canvas.onmouseup = (e) => {
        if (figuraArrastrada) {
            let nuevoX = e.layerX + offset.x;
            let nuevoY = e.layerY + offset.y;
            if((nuevoX >= areaTablero.x) && (nuevoX <= areaTablero.xFinal) &&
                (nuevoY >= areaTablero.y)){
                clear();
                figuraArrastrada.mover(init.x, init.y);
                t.dibujar(context);
                jugador1.dibujoFichas(context);//si cae en tablaro ponerla en posicion inicial
                jugador2.dibujoFichas(context);
            } else if((nuevoX >= areaTablero.x) && (nuevoX <= areaTablero.xFinal) &&
            (nuevoY < areaTablero.y)){ //area huecos
                clear();
                let metido = jugador.addFicha(nuevoX, nuevoY, figuraArrastrada);
                if (metido){
                    t.dibujar(context);
                    jugador1.dibujoFichas(context);
                    jugador2.dibujoFichas(context); //TODO: sacar el codigo repetido
                } else {
                    clear();
                    figuraArrastrada.mover(init.x, init.y);
                    t.dibujar(context);
                    jugador1.dibujoFichas(context);
                    jugador2.dibujoFichas(context);
                }
            } else {
                clear();
                figuraArrastrada.mover(init.x, init.y);
                t.dibujar(context);
                jugador1.dibujoFichas(context);
                jugador2.dibujoFichas(context);
            }
            figuraArrastrada = null;
        }
    }
}

//borra context, inicializo tablero, inicializo fichas TODO: podria solo borrar area jugador

