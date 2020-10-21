let card = document.querySelector("#card");
let coordXa = 0;
let coordXb = 0;
let pika =  document.querySelector(".pikachu");
let corriendo = false; //controla que no quiera animarse si ya hay uno corriendo en ese mismo div


//_____________________________________________________________________________________ANIMACION PIKACHU HOME
function pDerecha(actual, posicion){
    corriendo = true;
    pika.classList.remove("GizquierdaF");
    pika.classList.remove("Cizquierda");
    pika.classList.remove("GderechaF");
    pika.classList.add("Gderecha");
    setTimeout(function () {
        
        let pikaCorreDerecha = pika.animate([
            // keyframes
            {   left: `${actual}px`},
            {   left: `${posicion}px`}
            ], { 
            // timing options
                duration: 1000,
                iterations: 1,
                fill:'forwards' 
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
function pIzquierda(actual, posicion){
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
            {   left: `${actual}px`, }, 
            {   left: `${posicion}px`}
            ], { 
            // timing options
                duration: 1000,
                iterations: 1,
                fill:'forwards' 
        });
        
        pikaCorreDerecha.finished.then(() => { 
            pika.classList.remove("Cizquierda");
            pika.classList.add("GizquierdaF");
            setTimeout(function () { corriendo = false; }, 1000); //porque los girando duran 1s
        });
    }, 1000);
}

//__________________________________________________________________________________________________________ANIMACION CARD CENTRAL

card.onmouseover = () => {
    document.onmousemove = (e) => {

        // //fondo
        // let coordX = window.innerWidth/2;
        let mouseX = e.clientX;
        // let movCapa = `${((mouseX - coordX) * 0.008) +35}%`; // + = casi sigue al mouse, - = lado contrario... 25 del lugar de inicio
        // console.log(movCapa);
        // document.querySelector(".edificios-medio").style.left = movCapa;

        if (  (mouseX > (screen.width/2 +50)) )  { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-38}deg) `;
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-0.7}deg) `;
            document.querySelector(".edificios-medio").style.animation = "derEd 0.9s linear 1 forwards";
            if ((corriendo == false) && (Math.round(pika.getBoundingClientRect().left) != 1000)) {
                pDerecha(200, 1000);
            };
            //TODO: cuando comienza y mueve por primera vez vaya desde pos inicial al lado correspondiente, sino hace un salto
            //TODO: pasar a porcentaje por si se tiene otra resolucion
            //FIXME: si justo muevo hacia el otro lado y seguia caminando hacia el lado anterior se queda ahi hasta que muev el mouse otra vez
        } else if ( (mouseX < (screen.width/2 -50)) ) { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-0.7}deg) `; 
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-38}deg) `;
            document.querySelector(".edificios-medio").style.animation = "izqEd 0.9s linear 1 forwards";
            if ((corriendo == false) && (Math.round(pika.getBoundingClientRect().left) != 200)) {
                pIzquierda(1000, 200)};
        } 
        
    }
}

// document.querySelectorAll(".cartel").onmouseover = () => {
//     document.querySelector(".cartel").style.textShadow = "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 25px #ff00de";
// }

//___________________________________________________________________________________________________________________________PARALLAX

window.addEventListener("scroll", () => {
    let altoPagina = 300;
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    let porcentajeScroll = scrollTop / (docHeight - winHeight);
    let porcentajeScrollRound = Math.round(porcentajeScroll * 100);

    if(porcentajeScrollRound < altoPagina) {
        //sube card home
        document.querySelector("#card").style.transform = `translateY(${-scrollTop}px)`;
        //baja imagen trasera
        document.querySelector(".fondo").style.transform = `translateY(${scrollTop}px)`;
        //el resto de la pagina va apareciendo
        document.querySelector(".resto-pagina").style.transform = `translateY(${-scrollTop}px)`;
    }

    //TODO: hacer que avance hasta lasiguiente pantalla asi no se queda a mitad de camino, con animacion asi no es un golpe brusco
    
});

//_______________________________________________________________________________________________________________CARROUSEL

myCarrousel();
function myCarrousel(){
    let imagenes = ["./images/escenas/1.png", "./images/escenas/2.png", "./images/escenas/3.png"];
    let contador = 0;
    let cont = setInterval(function() {adelantar();}, 9000);
   
    function correDiv(img){
        img.style.animation = "carrouselElemA 3s linear 1 forwards";
        setTimeout(function() {
            img.style.left = "0%";//FIXME: forwards no funciona ¿?
            img.style.animation = "carrouselElemB 3s linear 6s 1";
            setTimeout(function() {
                img.style.left = "-100%";
                img.remove();
            }, 9000) //espera a primera mas segunda
        }, 3000) //espera a primera animacion
        
        //se borraban todos los div
        // img.addEventListener("animationend", function () {
        //     // console.log("terminada");
        //     img.remove();
        // })
    }

    function adelantar () {
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
        newDiv.style.backgroundSize = "contain";
        newDiv.style.backgroundRepeat = "no-repeat";
        // añade el elemento creado y su contenido al DOM 
        document.querySelector(".carrousel").appendChild(newDiv);  
        return newDiv;
    }
}
//________________________________________________________________________________________________COUNTDOWN
let fechaEstreno = new Date("May 5, 2021 00:00:00").getTime();

let x = setInterval(function() { //por cada segundo que pasa cambia el reloj..
  let fechaActual = new Date().getTime();
  let distancia = fechaEstreno - fechaActual;

  let dia = Math.floor(distancia / (1000 * 60 * 60 * 24)); //floor para que no se repita valor
  let hora = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minuto = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  let segundo = Math.floor((distancia % (1000 * 60)) / 1000);

  document.querySelector(".countdown-reloj").innerHTML = `${dia}d ${hora}h ${minuto}m ${segundo}s `;

  if (fechaActual == new Date("May 5, 2021 00:00:10").getTime()) { //si llega a 10, comienzo animacion
    crearContador();
  }
  if (distancia < 0) { //si llega a 0, dejo de correr el contador
    clearInterval(x);
  }
}, 1000);

function crearContador(){
    let newDiv = document.createElement("div");   
    newDiv.setAttribute("id", "countdown");

    for(let i= 1; i<= 10; i++){
        let newDiv2 = document.createElement("div");  
        newDiv2.innerHTML = `${i}`; 
        newDiv.appendChild(newDiv2);  
    }
    document.querySelector(".resto-pagina").appendChild(newDiv);  
}

//_________________________________________________________________________________PERSONAJES
let tarjeta = document.querySelector('.personaje');
// tarjeta.onmouseover = () => {
//     if(!(tarjeta.classList.contains( 'clase2' ))){
//         tarjeta.classList.add('is-flipped');
//     }
// }
// tarjeta.onmouseout = () => {
//     tarjeta.classList.remove('is-flipped');
//   }
//____________________________________________________________________________________FORMULARIO

let form = document.querySelector(".saludos");

tarjeta.onclick = () => {
    form.classList.remove("invisible");
    document.querySelector(".fondo-transparente").classList.remove("invisible");
    form.style.animation = "aparicion-form 3s ease-out 1";
}

if(form){
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        let nombre = document.querySelector("#nombre").value;
        let mail = document.querySelector("#mail").value;
        let texto = document.querySelector("#texto").value;

        form.classList.add("invisible");
        document.querySelector(".fondo-transparente").classList.add("invisible");
    })
}

//___________________________________________________________________________________________

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

document.querySelector(".btn-nav").onclick = () => {
    let nav = document.querySelector("nav");
    if(nav.classList.contains("mostrar")){
        nav.style.display = "none";
        nav.classList.remove("mostrar");
    } else {
        nav.style.display = "block";
        nav.classList.add("mostrar");
    }
    
}