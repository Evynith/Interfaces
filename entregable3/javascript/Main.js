let card = document.querySelector("#card");
let coordXa = 0;
let coordXb = 0;
let pika =  document.querySelector(".pikachu");
let corriendo = false; //controla que no quiera animarse si ya hay uno corriendo en ese mismo div

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

document.querySelectorAll(".cartel").onmouseover = () => {
    document.querySelector(".cartel").style.textShadow = "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 25px #ff00de";
}