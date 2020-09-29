import Tablero from './Tablero.js';
import Jugador from './Jugador.js';
import Bot from './Bot.js';

const canvas = document.querySelector("#myCanvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth -20;
canvas.height = window.innerHeight -20;
const clear = () => context.clearRect(0, 0, width, height);

const width = canvas.width;
const height = canvas.height;

const tamOriginal = [7,6];
const tamGrande = [10,7]; //FIXME: se buguea en otros tamaños
const tamEnorme = [13,8];

let tema0 = ["./images/textura-madera1.jpg","./images/textura-madera2.jpg","./images/textura-madera3.jpg"];
let tema1 = ["./images/textura-metal1.jpg","./images/textura-metal2.jpg","./images/textura-metal3.jpg"];
//let tema2 = ["./images/textura-casino1.jpg","./images/textura-casino2.jpg","./images/textura-casino3.jpg"];
let tema2 = tema1; //FIXME:

let contrincante = 0; //0 para bot | 1 para compañero
let turno = null;
let ganador = null;
let figuraArrastrada = null;
let tablero;
let jugador1;
let jugador2;

//______________________________________________________________________________JUEGO
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
const init = {//posicion inicial del mouse antes de mover ficha
    x : null,
    y : null
};

const offset = {//para correccion de lugar en figura mientras muevo
    x : null,
    y : null
};

function loadImage(source) {
    let img = new Image();
    img.src = source;
    return new Promise((resolve) => {
        img.onload = () => resolve(img);
    });
}

async function inicializar(j1,j2, tema,tamanio){
    let img1 = await loadImage(tema[0]);
    let img2 = await loadImage(tema[1]);
    let img3 = await loadImage(tema[2]);

    tablero = new Tablero(areaTablero, tamanio[1], tamanio[0], img1);
    
    jugador1 = new Jugador(j1, img2 ,tablero,areaJ1);  //TODO: ajustar tamaños para fichas de jugadores si toca casino??
    if (contrincante == 1){
        jugador2 = new Jugador(j2, img3 , tablero, areaJ2);
    } else {
        jugador2 = new Bot(j2, img3, tablero, areaJ2);
    }

    turno = jugador1;
    jugador1.inicializoFichas(context);
    jugador2.inicializoFichas(context);
    tablero.dibujar(context);
}

function reiniciar(){
    turno = jugador1;
    ganador = null;
    jugador1.inicializoFichas(context);
    jugador2.inicializoFichas(context);
    tablero.vaciar();
    tablero.dibujar(context);
}
//_____________________________________________________________________________SETEO DE OPCIONES
document.querySelector("#btn-1player").click();//TODO:
document.querySelector("#btn-1player").onclick = () =>{
    let j2 = document.querySelector("#jugador2");
    j2.classList.add("oculto");
    j2.setAttribute("value","Dummie bot");
    j2.removeAttribute("required");
    document.querySelector("#label-j2").classList.add("oculto");
    contrincante = 0;
}

document.querySelector("#btn-2player").onclick = () =>{
    let j2 = document.querySelector("#jugador2");
    j2.classList.remove("oculto");
    j2.setAttribute("value","");
    j2.setAttribute("required","required");
    document.querySelector("#label-j2").classList.remove("oculto");
    contrincante = 1;
}

document.querySelector(".temas").onclick = (e) =>{
    let value = e.target.dataset.tipo;
    document.querySelector("#tema").setAttribute("value",`${value}`);
}

document.querySelector("#form-inicial").onsubmit = (e) => {
    e.preventDefault();
    let tema = parseInt(document.querySelector("#tema").value);
    let j1 = document.querySelector("#jugador1").value;
    let j2 = document.querySelector("#jugador2").value;
    let tam = parseInt(document.querySelector("#js-tamanio").value);
    //TODO: ocultar este div
    crearJuego(j1,j2,tam,tema);
}

function crearJuego(j1,j2,tam,tema){
    let figuras;
    switch(tema) {
        case 0:
            figuras = tema0;
        break;
        case 1:
            figuras = tema1;
        break;
        case 2:
            figuras = tema2;
        break;
    }

    let tamanio = [];
    switch(tam){
        case 0:
            tamanio = tamOriginal;
        break;
        case 1:
            tamanio = tamGrande;
        break;
        case 2:
            tamanio = tamEnorme;
        break;
    }


    inicializar(j1,j2, figuras,tamanio);//TODO: cuando las img esten cargadaas
    document.querySelector("#menuInicial").classList.add("oculto");
    document.querySelector("#menuInicial").classList.remove("menu");
    document.querySelector("#form-inicial").classList.add("oculto");
    
}
//________________________________________________________________________MOVIMIENTO DE FICHAS Y TURNOS

canvas.onclick = (e) => { //FIXME: problemas con click?
    const [ x, y ] = [ e.layerX, e.layerY ];
    let jugador = jugadorSegunTurno();
    if(jugador){
        mover(jugador);
    }
}

function siguienteTurno(){
    if (turno == jugador1) {
        turno = jugador2;
        if(contrincante == 0){
            let metido = jugador2.jugar();
            if (metido){
                dibujarElementos();
                corroborarGanador();
            }         
        }
    } else if (turno == jugador2){
        turno = jugador1;
    }
}

function jugadorSegunTurno(){ return turno; }

function dibujarElementos(){
    clear();
    tablero.dibujar(context);
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
                    corroborarGanador();
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
//_______________________________________________________________________GANADOR
    function corroborarGanador(){
        if (tablero.ganador == null){
            if ((jugador1.fichas == 0) || (jugador2.fichas == 0)){
                terminarJuego(null);
            } else {
                siguienteTurno();
            }
        } else {
            ganador = tablero.ganador;
            terminarJuego();
        }
    }

    function terminarJuego(){
        turno = null;
        if(ganador == null){
            mostrarMenu("Empate")
        } else {
            console.log(ganador);
            ganador.sumarPunto();
            mostrarMenu(`Ha ganado ${ganador.nombre}`);
        }
    }

    let menu = document.querySelector("#menuIntermedio");
    function mostrarMenu(texto){
        menu.classList.add("menu");
        menu.classList.remove("oculto");
        menu.querySelector("h1").innerHTML = texto;
        menu.querySelector(".j1").innerHTML = `${jugador1.nombre} : partidas ganadas ${jugador1.ganadas}`;
        menu.querySelector(".j2").innerHTML = `${jugador2.nombre} : partidas ganadas ${jugador2.ganadas}`;
    }

    document.querySelector(".reiniciarJuego").onclick = () =>{
        menu.classList.remove("menu");
        menu.classList.add("oculto");
        document.location.reload();
    }

    document.querySelector(".terminarPartida").onclick = () =>{
        menu.classList.remove("menu");
        menu.classList.add("oculto");
        reiniciar();
    }

//al ganador sumarle un punto en el contador e iniciar de vuelta el juego con los mismo s valores 
//inicializar fichas en jugadores y vaciar tablero (o inicializarlo de 0) ->> inicilizar de juego!!