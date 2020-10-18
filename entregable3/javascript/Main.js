let card = document.querySelector("#card");
let coordXa = 0;
let coordXb = 0;
let pika =  document.querySelector(".pikachu");


function pDerecha(actual, posicion){
    pika.classList.remove("GizquierdaF");
    pika.classList.remove("Cizquierda");
    pika.classList.remove("GderechaF");
    pika.classList.add("Gderecha");
    setTimeout(function () {
        
        let pikaCorreDerecha = pika.animate([
            // keyframes
            {   left: `${actual}px`, transform : /* "translate(0) */ "scaleX(-1)" }, //porque se sobreescribe el transform
            {   left: `${posicion}px`,  transform : /* `translate(${posicion}px) */ `scaleX(-1)` }
            ], { 
            // timing options
                duration: 1000,
                iterations: 1,
                // delay : 900,//por animacion inicial
                // easing: "linear",
                fill:'forwards' 
        });
        pika.classList.remove("Gderecha");
        pika.classList.add("Cderecha");
        pikaCorreDerecha.finished.then(() => { 
            // pika.style.left = pika.getBoundingClientRect().left + (posicion - pika.getBoundingClientRect().left);
            pika.classList.remove("Cderecha");
            pika.classList.add("GderechaF");
        });
    }, 1000);
}
function pIzquierda(actual, posicion){
    pika.classList.remove("GderechaF");
    pika.classList.remove("Cderecha");
    pika.classList.remove("GizquierdaF");
    pika.classList.add("Gizquierda");
    setTimeout(function () {
        pika.classList.remove("Gizquierda");
        pika.classList.add("Cizquierda");
        let pikaCorreDerecha = pika.animate([
            // keyframes
            {   left: `${actual}px`, /* transform : "translate(0)"  */}, 
            {   left: `${posicion}px`  /* transform : `translate(${posicion}px)` */ }
            ], { 
            // timing options
                duration: 1000,
                iterations: 1,
                // delay : 1000,//por animacion inicial
                // easing: "linear",
                fill:'forwards' 
        });
        
        pikaCorreDerecha.finished.then(() => { 
            // pika.style.left = pika.getBoundingClientRect().left + (posicion - pika.getBoundingClientRect().left);
            pika.classList.remove("Cizquierda");
            pika.classList.add("GizquierdaF");
        });
    }, 1000);
}

function limpiarAnimacionPika(){
    pika.getAnimations().forEach(
        animation => animation.pause() //para que no se sature la memoria
    );
}

card.onmouseover = () => {
    document.onmousemove = (e) => {
        
        let posActual = pika.getBoundingClientRect().left;
        console.log(posActual);
        if(coordXa == 0) {coordXa = e.screenX}
        coordXb = e.screenX;

        if(coordXa < coordXb){
            //animacion a la derecha
            pDerecha(posActual, posActual +100);
        }else if(coordXa >= coordXb){
            //animacion a la izquierda
            pIzquierda(posActual, posActual -100);
        }
        coordXa = coordXb;
        // limpiarAnimacionPika();

        if (  (e.screenX > (screen.width/2 +50)) )  { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-38}deg) `;
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-0.7}deg) `; 
        } else if ( (e.screenX < (screen.width/2 -50)) ) { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-0.7}deg) `; 
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-38}deg) `;
         } 
    }
}

document.querySelectorAll(".cartel").onmouseover = () => {
    document.querySelector(".cartel").style.textShadow = "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 25px #ff00de";
}