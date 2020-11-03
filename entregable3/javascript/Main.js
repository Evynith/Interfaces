/************************************************************************************************************************************************************************************************************/
/************************************************************************************GENERAL*****************************************************************************************************************/

//__________________________________________________________________________________________________________________________HAMBURGUESA/NAV

// let checkbox = document.querySelector(".check");
// checkbox.addEventListener( 'change', function() {
// if(this.checked === true) {
//     let nav = document.querySelector("nav");
//     nav.style.display = "block";
//     nav.classList.add("mostrar");
// } 
// console.log(this.checked);
// if(this.checked === false) {
//     nav.style.display = "none";
// }
// });

let iconHamb = document.querySelector(".icono-hamburguer");
let nav = document.querySelector("nav");

if (iconHamb)
    // iconHamb.onclick = () =>{
    iconHamb.onmouseover = () => {
        //estilo
        document.querySelector("#icon1").classList.add("animIc1");
        document.querySelector("#icon2").classList.add("animIc2");
        //menu
        nav.style.display = "block";
        nav.classList.add("mostrar");

        // if(nav.classList.contains("mostrar")){
        //     nav.style.display = "none";
        //     nav.classList.remove("mostrar");
        // } else {
        //     nav.style.display = "block";
        //     nav.classList.add("mostrar");
        // }
    }

if (nav)
    nav.onmouseleave = () => {
        document.querySelector("#icon1").classList.remove("animIc1");
        document.querySelector("#icon2").classList.remove("animIc2");
        nav.style.display = "none";
        nav.classList.remove("mostrar");
    }



// iconHamb.onmouseover = () => { //TODO:
//     document.querySelector("#icon1").classList.add("aclarar");
//     document.querySelector("#icon2").classList.add("aclarar");
// }
// iconHamb.onmouseout = () => {
//     document.querySelector("#icon1").classList.remove("aclarar");
//     document.querySelector("#icon2").classList.remove("aclarar");
// }

//_______________________________________________________________________________________________________________________________________________________LOAD

let loadMouse = document.querySelector(".contenedor-mouse");
let pantallaCarga = document.querySelector(".pantalla-carga");
let divCarga = document.querySelector("#loader-div");

if (divCarga) {
    document.querySelector("body").style.overflowY = "hidden";
}

function ocultarLoad() {
    divCarga.classList.add("invisible");
    // if (document.querySelector(".fondo")) {
    document.querySelector("body").style.overflowY = "scroll";
    // }
    document.querySelector(".sticky-nav").classList.remove("invisible");

    let menucito = document.querySelector(".menu-scroll"); 
    if(menucito) {menucito.classList.remove("invisible");}
}

pantallaCarga.onmouseover = () => {
    loadMouse.style.display = "block";
    loadMouse.style.top = `300px`;
    seguir();
}

pantallaCarga.onmouseout = () => {
    loadMouse.style.display = "none";
}

function seguir() {
    pantallaCarga.onmousemove = (e) => {
        loadMouse.style.top = `${parseInt(e.clientY)}px`;
        loadMouse.style.left = `${parseInt(e.clientX)}px`;
    }

}

let loadPika = setInterval(aumentarProgreso, 500);

function aumentarProgreso() {
    // pikaLoad.style.animation = "pika-carga 0.5s ease-out 1 both";
    let pikaLoad = document.querySelector(".load");
    let barraProgreso = document.querySelector("#carga");
    barraProgreso.value = barraProgreso.value % barraProgreso.max + 15;//cuenta para 3 segundos
    let pos = pikaLoad.getBoundingClientRect().left;
    let contenedor = document.querySelector(".progreso");
    let pos2 = Math.round(((contenedor.getBoundingClientRect().width * Math.round(barraProgreso.value)) / 100) + contenedor.getBoundingClientRect().left);

    if (barraProgreso.value == 100) {
        ocultarLoad();
        clearInterval(loadPika);
    }
    let pikaLoadAnimate = pikaLoad.animate([
        // keyframes
        { left: `${pos}px`, },
        { left: `${pos2 - pikaLoad.getBoundingClientRect().width}px` }
    ], {
        // timing options
        duration: 1000,
        iterations: 1,
        fill: 'forwards'
    });
}

//___________________________________________________________________________________________________________________________________________________COUNTDOWN
let fechaEstreno = new Date("May 3, 2021 00:00:00").getTime();

// let fechaEstreno = new Date("November 3, 2020 00:08:00").getTime();

let countReloj = document.querySelector(".countdown-reloj");
let dia = -1;
let hora = -1;
let minuto = -1;
let segundo = -1;
let animacionCount = false;

if (countReloj) {
    let x = setInterval(function () { //por cada segundo que pasa cambia el reloj..
        document.querySelector("#pelicula").classList.add("invisible");
        let fechaActual = new Date().getTime();
        let distancia = fechaEstreno - fechaActual;

        let dia2 = Math.floor(distancia / (1000 * 60 * 60 * 24)); //floor para que no se repita valor
        let hora2 = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minuto2 = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        let segundo2 = Math.floor((distancia % (1000 * 60)) / 1000);

        if (dia != dia2) {
            dia = dia2;
            cambiarSector(dia2, document.querySelector(".countdown-reloj-dia"));
        }
        if (hora != hora2) {
            hora = hora2;
            cambiarSector(hora2, document.querySelector(".countdown-reloj-hora"));
        }
        if (minuto != minuto2) {
            minuto = minuto2;
            cambiarSector(minuto2, document.querySelector(".countdown-reloj-minuto"));
        }
        if (segundo != segundo2) {
            segundo = segundo2;
            cambiarSector(segundo2, document.querySelector(".countdown-reloj-segundo"));
        }
        // countReloj.innerHTML = `${dia}d ${hora}h ${minuto}m ${segundo}s `;

        if ((distancia < 14000) && (distancia > 0)) { //si llega a esa fecha, comienzo animacion
            if (animacionCount == false) {
                crearContador();
                animacionCount = true;
            }
        }
        if (distancia < 0) { //si llega a 0, dejo de correr el contador
            clearInterval(x);
            countReloj.remove();
            document.querySelector("#pelicula").classList.remove("invisible");
        }
    }, 1000);

    function cambiarSector(nvoNro, sector) {
        // sector.style.animate = "count 0.5s linear 1";
        // sector.innerHTML = `${nvoNro}`;
        // sector.style.animate = "count 0.5s linear 1 reverse";

        let animacion = [
            // keyframes
            { opacity: " 1 " },
            { opacity: " 0 " }
        ];
        sector.animate(animacion, {
            // timing options
            duration: 200,
            iterations: 1,
            delay: 300
        });

        setTimeout(function () { sector.innerHTML = `${nvoNro}`; }, 500);

        sector.animate(animacion, {
            // timing options
            duration: 500,
            iterations: 1,
            direction: "reverse",
            delay: 500
        });
    }

    function crearContador() {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("id", "countdown");

        for (let i = 10; i >= 1; i--) {
            let newDiv2 = document.createElement("div");
            newDiv2.innerHTML = `${i}`;
            newDiv.appendChild(newDiv2);
        }
        let newDiv3 = document.createElement("div");
        newDiv3.innerHTML = "Feliz estreno!!!";
        newDiv.appendChild(newDiv3);
        document.querySelector(".sticky-nav").appendChild(newDiv);
    }
}

/*************************************************************************************************************************************************************************************************************/
/**************************************************************************************HOME*******************************************************************************************************************/

let card = document.querySelector("#card");
let coordXa = 0;
let coordXb = 0;
let pika = document.querySelector(".pikachu");
let corriendo = false; //controla que no quiera animarse si ya hay un pikachu corriendo en ese mismo div
let porcentajeScroll = 0;

//______________________________________________________________________________________________________________________________________________ANIMACION PIKACHU HOME
function pDerecha(actual, posicion) {
    corriendo = true;
    pika.classList.remove("GizquierdaF");
    pika.classList.remove("Cizquierda");
    pika.classList.remove("GderechaF");
    pika.classList.add("Gderecha");
    setTimeout(function () {

        let pikaCorreDerecha = pika.animate([
            // keyframes
            { left: `${actual}px` },
            { left: `${posicion}px` }
        ], {
            // timing options
            duration: 1000,
            iterations: 1,
            fill: 'forwards'
        });
        pika.classList.remove("Gderecha");
        pika.classList.add("Cderecha");
        pikaCorreDerecha.finished.then(() => {
            pika.classList.remove("Cderecha");
            pika.classList.add("GderechaF");
            setTimeout(function () { corriendo = false; }, 1000); //porque los girando duran 1s
        });
    }, 1000);
}
function pIzquierda(actual, posicion) {
    corriendo = true;
    pika.classList.remove("GderechaF");
    pika.classList.remove("Cderecha");
    pika.classList.remove("GizquierdaF");
    pika.classList.add("Gizquierda");
    setTimeout(function () {
        pika.classList.remove("Gizquierda");
        pika.classList.add("Cizquierda");
        let pikaCorreDerecha = pika.animate([
            // keyframes
            { left: `${actual}px`, },
            { left: `${posicion}px` }
        ], {
            // timing options
            duration: 1000,
            iterations: 1,
            fill: 'forwards'
        });

        pikaCorreDerecha.finished.then(() => {
            pika.classList.remove("Cizquierda");
            pika.classList.add("GizquierdaF");
            setTimeout(function () { corriendo = false; }, 1000); //porque los girando duran 1s
        });
    }, 1000);
}

//______________________________________________________________________________________________________________________________________________________ANIMACION CARD CENTRAL
if (card)
    card.onmouseover = () => {
        document.onmousemove = (e) => {

            // //fondo
            // let coordX = window.innerWidth/2;
            let mouseX = e.clientX;
            // let movCapa = `${((mouseX - coordX) * 0.008) +35}%`; // + = casi sigue al mouse, - = lado contrario... 25 del lugar de inicio
            // console.log(movCapa);
            // document.querySelector(".edificios-medio").style.left = movCapa;

            if ((mouseX > (screen.width / 2 + 50))) {
                document.querySelector(".edificios-derecha").style.transform = `rotateY(${-38}deg) `;
                document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-0.7}deg) `;
                document.querySelector(".edificios-medio").style.animation = "derEd 0.9s linear 1 forwards";
                if ((corriendo == false) && (Math.round(pika.getBoundingClientRect().left) < (screen.width / 2))) {
                    // if(Math.round(pika.getBoundingClientRect().left) != 0){
                    pDerecha(pika.getBoundingClientRect().left, screen.width - 300);
                    // }
                    // pDerecha(0 , screen.width - 200);
                };
                //FIXME: pikachu hace un pequeño salto cuando se mueve, seguro porque le sobran px a la imagen alos lados
            } else if ((mouseX < (screen.width / 2 - 50))) {
                document.querySelector(".edificios-derecha").style.transform = `rotateY(${-0.7}deg) `;
                document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-38}deg) `;
                document.querySelector(".edificios-medio").style.animation = "izqEd 0.9s linear 1 forwards";
                if ((corriendo == false) && (Math.round(pika.getBoundingClientRect().left) > (screen.width / 2))) {
                    // if(Math.round(pika.getBoundingClientRect().left) != screen.width){
                    pIzquierda(pika.getBoundingClientRect().left, 0);
                    // }
                    // pIzquierda(screen.width - 200 , 0);
                }
            }

        }
    }

// document.querySelectorAll(".cartel").onmouseover = () => {
//     document.querySelector(".cartel").style.textShadow = "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 25px #ff00de";
// }

//_______________________________________________________________________________________________________________________________________________________________CARROUSEL
let carrusel = document.querySelector(".carrousel");

if (carrusel)
    myCarrousel();
function myCarrousel() {
    let imagenes = ["./images/escenas/1.png", "./images/escenas/2.png", "./images/escenas/3.png", "./images/escenas/4.png", "./images/escenas/5.png"];
    let contador = 0;
    adelantar();
    let cont = setInterval(function () { adelantar(); }, 9000);

    function correDiv(img) {
        img.style.animation = "carrouselElemA 3s linear 1 forwards";
        setTimeout(function () {
            img.style.left = "0%";
            img.style.animation = "carrouselElemB 3s linear 6s 1";
            setTimeout(function () {
                img.style.left = "-100%";
                img.remove();
            }, 9000) //espera a primera mas segunda
        }, 3000) //espera a primera animacion

        //FIXME: medio que vibra??

        //se borraban todos los div
        // img.addEventListener("animationend", function () {
        //     // console.log("terminada");
        //     img.remove();
        // })
    }

    function adelantar() {
        if (contador + 1 == imagenes.length) {
            contador = 0;
        } else {
            contador = contador + 1;
        }
        let elem = nuevoDiv(imagenes[contador]);
        correDiv(elem);
    }

    function nuevoDiv(imgUrl) {
        let newDiv = document.createElement("div");
        newDiv.style.background = `url(${imgUrl})`; //ya es un string
        newDiv.style.backgroundSize = "cover"; //contain
        newDiv.style.backgroundRepeat = "no-repeat";
        // añade el elemento creado y su contenido al DOM 
        carrusel.appendChild(newDiv);
        return newDiv;
    }
}

//___________________________________________________________________________________________________________________________________________________________PERSONAJES
let personaje = document.querySelectorAll('.personaje');
let tarjeta = document.querySelectorAll('.tarjeta');

if (tarjeta)
    tarjeta.forEach(elem => {
        elem.parentNode.onmouseover = () => {
            if (!(elem.classList.contains('clase2'))) {
                elem.classList.add('is-flipped');
            }
        }

        elem.parentNode.onmouseleave = () => {
            elem.classList.remove('is-flipped');
        }
    })


//____________________________________________________________________________________________________________________________________________________________PARALLAX

window.addEventListener("scroll", () => {
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    porcentajeScroll = scrollTop / (docHeight - winHeight);

    let porcentajeScrollRound = Math.round(porcentajeScroll * 100);
    // document.title = `${porcentajeScrollRound}`;
    //46% aprox seccion 2 --franja de 10? 40 - 56
    //90% aprox seccion 3 -- 85 - 96

    //sube card home
    document.querySelector("#card").style.transform = `translateY(${-scrollTop}px)`;
    //baja imagen trasera
    document.querySelector(".fondo-parallax").style.transform = `translateY(${scrollTop}px)`;
    //el resto de la pagina va apareciendo
    document.querySelector(".resto-pagina").style.transform = `translateY(${-scrollTop}px)`;

    //TODO: hacer que avance hasta lasiguiente pantalla asi no se queda a mitad de camino, con animacion asi no es un golpe brusco

    if ((porcentajeScrollRound >= 75)) {//&& (porcentajeScrollRound <= 96)){
        personaje.forEach(elem => {
            elem.style.visibility = "visible";
            elem.style.height = "260px";
            // elem.classList.add("aparece");
        })
    } else {
        personaje.forEach(elem => {
            elem.style.height = "0px";
            elem.style.visibility = "hidden";
            // elem.classList.remove("aparece");
        })
    }
    if ((porcentajeScrollRound >= 40) && (porcentajeScrollRound <= 56)) {
        document.querySelector(".carrousel").style.transform = `rotateX(${0}deg) `;
    } else {
        document.querySelector(".carrousel").style.transform = `rotateX(${90}deg) `;
    }

});
//________________________________________________________________________________________________________________________________________________________________SCROLL

// function scrollMove(x, y) {
//     // let x = window.scrollX;
//     // let y = window.scrollY;
//     window.onscroll = function () { window.scroll(x, y) };
// }

// let buttons = document.querySelectorAll(".section-btn");
// buttons.forEach((button) => {
//     button.onclick = (e) => {
//         e.preventDefault();
//         let target = e.currentTarget.getAttribute("href");

//         // console.log(document.querySelector(target));
//         // // document.querySelector(target).scrollIntoView({
//         //     behavior: 'smooth'
//         // });

//         let posY = document.querySelector(target).getBoundingClientRect().y + window.scrollY;
//         console.log(posY);

//         window.scroll({
//             top: 1000,
//             behavior: 'smooth'
//           });
//     };
// });

//_________________________________________________
let menuScroll = document.querySelector(".menu-scroll");

if (menuScroll) {
    document.querySelector(".section-btn1").onclick = (e) => {
        e.preventDefault();
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let coordX = 0 / 100 * (docHeight - winHeight);
        window.scroll({
            top: coordX,
            behavior: 'smooth'
        });

    }
    document.querySelector(".section-btn2").onclick = (e) => {
        e.preventDefault();
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let coordX = 46 / 100 * (docHeight - winHeight);
        window.scroll({
            top: coordX,
            behavior: 'smooth'
        });
    }
    document.querySelector(".section-btn3").onclick = (e) => {
        e.preventDefault();
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let coordX = 90 / 100 * (docHeight - winHeight);
        window.scroll({
            top: coordX,
            behavior: 'smooth'
        });
    }
}

/************************************************************************************************************************************************************************************************************/
/************************************************************************************SALUDOS*****************************************************************************************************************/

//____________________________________________________________________________________________________________________________________________________FORMULARIO

// let form = document.querySelector(".saludos");

// tarjeta.onclick = () => {
//     form.classList.remove("invisible");
//     document.querySelector(".fondo-transparente").classList.remove("invisible");
//     form.style.animation = "aparicion-form 3s ease-out 1";

// }

// if(form){
//     form.addEventListener("submit", function(e) {
//         e.preventDefault();
//         let nombre = document.querySelector("#nombre").value;
//         let mail = document.querySelector("#mail").value;
//         let texto = document.querySelector("#texto").value;

//         form.classList.add("invisible");
//         document.querySelector(".fondo-transparente").classList.add("invisible");
//     })
// }

//ya no porque lo pase a una pagina aparte

let formulario =  document.querySelector("form");
if(formulario){
    let labels = document.querySelectorAll("label");
    let btnForm = document.querySelector("button");

    labels.forEach( elem => {
        elem.style.animation = "aparicion-form 3s linear 3s 1 forwards";
    })
    btnForm.style.animation = "aparicion-form 3s linear 3s 1 forwards";
}



/************************************************************************************************************************************************************************************************************/
/************************************************************************************CALENDARIO**************************************************************************************************************/

let details = document.querySelectorAll("details");

if (details)
    details.forEach(elem => {
        elem.onclick = (e) => {
            details.forEach(elem2 => {
                if ((elem2.hasAttribute("open")) && (elem != elem2)) {
                    elem2.removeAttribute("open");
                }
            })
        }
    })

let cardCalend = document.querySelectorAll(".card-calendario");
if (cardCalend)
    cardCalend.forEach(elem => {
        elem.onmouseover = () => {
            document.onmousemove = (e) => {
                let coordX = (window.innerWidth / 2 - e.screenX) / 40; //pasos chiquitos para que no se deforme tanto 
                let coordY = (window.innerHeight / 2 - e.screenY) / 20;
                elem.style.transform = `rotateY(${coordX}deg) rotateX(${coordY}deg)`; /* `skew(${coordX}deg,${coordY}deg)`; */
            }
        }
        elem.onclick = () => {
            let link = elem.getAttribute("href");
            window.location.href = link;
        }
    })

