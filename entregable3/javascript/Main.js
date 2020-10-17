let card = document.querySelector("#card");
let coordXa = 0;
let coordXb = 0;
let pika =  document.querySelector(".pikachu");

function pikaDerecha () {
    
let pikaGiraDerecha = pika.animate([
    // keyframes
    {   background : "url('./images/pikachu home/girando.png') left center",
        backgroundPosition : "0px",
        transform: "scaleX(-1)",
    //   transform: "translate(0px)"
    }, 
    {
        backgroundPosition : "-4800px", 
        transform: "scaleX(-1)"
    }
  ], { 
    // timing options
        duration: 1000, 
        iterations: 1,
        easing: 'steps(8)',//, jump-start)',
        fill:'forwards' //FIXME:

  }).finished.then(() => {

        let pikaCorreDerecha = pika.animate([
            // keyframes
            {   background : "url('./images/pikachu home/corriendo.png') left center",
                backgroundPosition : "0px", 
                transform : "scaleX(-1)",
            //   transform: `translate(${coordXb - coordXa}px)` 
            },
            {
                backgroundPosition : "-4200px",
                transform : "scaleX(-1)"
            }
        ], { 
            // timing options
            duration: 900, 
            iterations: 1, //Infinity,
            easing: 'steps(7)',//, jump-start)',
            //delay: pikaGiraDerecha.effect.getComputedTiming().duration,
            fill:'forwards' //FIXME:
        })
  });  
}

card.onmouseover = () => {
    document.onmousemove = (e) => {
 
        if(coordXa == 0) {coordXa = e.screenX}
        coordXb = e.screenX;

        if(coordXa < coordXb){
            //animacion a la derecha
            pikaDerecha();


        }else if(coordXa >= coordXb){
            //animacion a la izquierda

        }
        coordXa = coordXb;


        if (  (e.screenX > (screen.width/2 +50)) )  { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-38}deg) `;
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-0.7}deg) `; //TODO: revisar
        } else if ( (e.screenX < (screen.width/2 -50)) ) { 
            document.querySelector(".edificios-derecha").style.transform = `rotateY(${-0.7}deg) `; //TODO: revisar
            document.querySelector(".edificios-izquierda").style.transform = `rotateY(${-38}deg) `;
         }  // else {
        //     document.querySelector(".edificios-derecha").style.transform = `rotateY(${0}deg) `;
        //     document.querySelector(".edificios-izquierda").style.transform = `rotateY(${0}deg) `;
        // } 

       
        // if (e.screenX > (screen.width/2)){//izquierdo
        //     let distancia = (screen.width/2) - e.screenX;
        //     let porcentaje = (distancia *100)/ screen.width;
        //     let grados = (porcentaje/100) * 90; //de la mitad hacia X lado de la pantalla equivale al 90grados
        //     let antigrados = Math.cos((180 - grados) *(Math. PI / 180));
        //     console.log(grados,antigrados);
            
        //     document.querySelector(".edificios-derecha").style.transform = `rotateY(${grados}deg) `;
        //     document.querySelector(".edificios-izquierda").style.transform = `rotateY(${antigrados/(Math. PI / 180)}deg) `;
        // } else if (e.screenX < (screen.width/2)){ //derecho
        //     let distancia = e.screenX - (screen.width/2);
        //     let porcentaje = (distancia *100)/ screen.width;
        //     let grados = (porcentaje/100) * 90; //de la mitad hacia X lado de la pantalla equivale al 90grados
        //     let antigrados = Math.cos((180 - grados) *(Math. PI / 180));//convierto a radianes
            
        //     document.querySelector(".edificios-izquierda").style.transform = `rotateY(${grados}deg) `; 
        //     document.querySelector(".edificios-derecha").style.transform = `rotateY(${antigrados/(Math. PI / 180)}deg) `; //convierto a grados de nuevo
        // }

    }
}