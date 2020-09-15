/* 
*   Siempre estara activo lapiz o goma para modificar sobre el area de trabajo
*   Cuando se seleccione un filtro se implementara automaticamente 
*/
function myPaint(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");

    let width = canvas.width;
    let height = canvas.height;

    let imageData = context.createImageData(width, height);
    let input = document.querySelector(".input1");

    let valorRGBlienzo = [255,255,255];
    let valorRGBtrazo = [0,0,0];
    let valorTamanioTrazoDefecto = 1;
    setearDisplay(valorRGBtrazo[0],valorRGBtrazo[1], valorRGBtrazo[2]);
    let vectorRestauracion = new Array();

    document.querySelector(".js-nuevoEspacio").onclick = function () {nuevoEspacio(width,height,valorRGBlienzo);};

    document.querySelector(".js-cargarImagen").onclick = function () {input.click();};
    
    function nuevoEspacio(width,height,valorRGBlienzo){
        context.fillStyle = `rgb(${valorRGBlienzo[0]},${valorRGBlienzo[0]},${valorRGBlienzo[0]})`;
        context.fillRect(0,0,width,height);
    };

    function copiaCanvasActual(){
        let copia = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        return copia;
    };

    function save(){
        vectorRestauracion.push(copiaCanvasActual());
    };

    function restore(){
        let restore = vectorRestauracion.pop();
        context.putImageData(restore,0,0);
    };

    function setearDisplay(r,g,b){
        let display = document.querySelector("#display");
        display.style.background = `rgb(${r},${g},${b})`;
    };

    document.querySelector(".js-guardar").onclick = function () {
        let dataURL = canvas.toDataURL("image/png;base64");
        this.href = dataURL;
    };

    document.querySelector(".js-restaurarImagen").onclick = () => { restore();};

    input.onclick = () => { //permite que se pueda subir una imagen que se ha subido con anterioridad
        if(input.value != "") {
            input.value = "";
        };
    };

    input.onchange = (e) => { 
        let file = e.target.files[0]; //dir de donde esta el archivo
        let reader = new FileReader();//interpreta el archivo

        reader.readAsDataURL(file);//se lo guarda como tipo data url

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;//imagen en un protocolo aceptado
            let img = new Image();
            img.src = content;

            img.onload = function () { 
                save();
                context.clearRect(0, 0, width, height);
                let imageAspectRatio = Math.min(width / this.width, height/this.height);
                let imageScaleWidth = this.width * imageAspectRatio;
                let imageScaleHeight = this.height * imageAspectRatio;
                //calcula el tamaño de la imagen
                

                context.drawImage(img, 0, 0,imageScaleWidth,imageScaleHeight);
                imageData = context.getImageData(0,0,imageScaleWidth,imageScaleHeight);
                context.putImageData(imageData,0,0);
            };
        };
    };
    
    document.querySelector(".filtros").onclick = function (e) {
        let filtroPresionado = e.target.parentNode.id;
        save();
        let copia = copiaCanvasActual();
        switch(filtroPresionado){
            case "blur":
                copia = filterBlur(copia,3);//TODO: setear por usuario
            break;
            case "suavizado":
                copia = filterSuavizado(copia);  
            break;
            case "saturacion":
                copia = filterSaturacion(copia,3);//TODO: setear por usuario
            break;
            case "brillo":
                copia = filterBrillo(copia,50);//TODO: setear por usuario
            break;
            case "bordes":
                copia = filterBordes(copia);
            break;
            case "binarizacion":
                copia = filterBinarizacion(copia,1);//TODO: setear por usuario
            break;
            case "sepia":
                copia = filterSepia(copia);
            break;
            case "negativo":
                copia = filterNegativo(copia);
            break;
            case "grises":
                copia = filterGrey(copia);
            break;
        };
        context.putImageData(copia,0,0);
    };

    document.querySelector("#js-lapiz").onclick = () => {
        menuLapiz();
        trazarCanvas(valorRGBtrazo[0],valorRGBtrazo[1],valorRGBtrazo[2],valorTamanioTrazoDefecto);

        let piker = document.querySelectorAll(".color, #tamanio-lapiz");
        for(let i = 0; i < piker.length; i++) {
            piker[i].addEventListener("input", function() {
                let nvsValores = traerValoresLapiz();
                setearDisplay(nvsValores[0],nvsValores[1], nvsValores[2]);
                trazarCanvas(nvsValores[0],nvsValores[1], nvsValores[2], nvsValores[3]);
            });
        }; 
    };

    document.querySelector("#js-goma").onclick = () => {
        menuGoma();
        let r = valorRGBlienzo[0];
        let g = valorRGBlienzo[1];
        let b = valorRGBlienzo[2];
        trazarCanvas(r,g,b,valorTamanioTrazoDefecto);

        document.querySelector("#tamanio-goma").addEventListener("input", function(){
            tam = document.querySelector("#tamanio-goma").value;
            trazarCanvas(r,g,b,tam);
        });
    };

    function traerValoresLapiz(){
        let r = document.querySelector("#red").value;
        let g = document.querySelector("#green").value;
        let b = document.querySelector("#blue").value;
        let tamanio = document.querySelector("#tamanio-lapiz").value;

        return [r,g,b,tamanio];
    }
      
    function trazarCanvas(r,g,b,tam){ 
        let dibujar = false; 
        canvas.onmousedown = () => {
            //inicia dibujo
            dibujar = true; 
            context.lineWidth = tam;
            context.strokeStyle = `rgb(${r},${g},${b})`;
            context.lineCap="round";
            context.lineJoin="round";
            context.beginPath();
        };

        canvas.onmousemove = (event) => {
            let espacioNav = document.querySelector("nav").offsetHeight;
            let espacioMenuDerecha = document.querySelector(".js-menu-herramientas").offsetWidth;
            let cX = event.clientX - espacioMenuDerecha;
            let cY = event.clientY - espacioNav;
            setPixelCoord(cX,cY,dibujar);
            
        };

        canvas.onmouseup = () => {
            //para dibujo
            dibujar = false; 
            context.closePath();
            save();
        };
    };

    function setPixelCoord(cX,cY,dibujar){ 
        //dibujo
        if (!dibujar) return; 
        context.lineTo(cX,cY);
        context.stroke();
    };

    function setPixel(image, x, y, r, g, b , a) {
        let index = (x + y * image.width) * 4; 
        image.data[index + 0] = r;
        image.data[index + 1] = g;
        image.data[index + 2] = b;
        image.data[index + 3] = a;
    };

    function getR(image, x, y){
        let index = ((x + y * image.width) * 4);
        return image.data[index + 0];

    };
    function getG(image, x, y){
        let index = ((x + y * image.width) * 4);
        return image.data[index + 1];
    };
    function getB(image, x, y){
        let index = ((x + y * image.width) * 4);
        return image.data[index + 2];
    };
    function getGrey(image, x,y){
        return getR(image, x, y) + getG(image, x, y) + getB(image, x, y) / 3;
    };

    function filterGrey(img){ //gris, donde los 3 valores de colores son iguales.. estandar es el valor promedio
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let grey = getGrey(img, x,y);

                setPixel(img, x, y, grey, grey, grey , 255);
            };
        };
        return img;
    };

    function filterNegativo(img){
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                r = (255 - r); 
                g = (255 - g);
                b = (255 - b); 

                setPixel(img, x, y, r, g, b , 255);
            };
        };
        return img;
    };

    function filterBrillo(img, f){
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                r = r + f; 
                g = g + f;
                b = b + f; 

                setPixel(img, x, y, r,g,b , f);
            };
        };
        return img;
    }

    function filterBinarizacion(img,index){ //0: color, 1: byn
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){

                if(index == 1){
                    let grey = getGrey(img, x,y);
                    let greyBinarizado = colorBinarizado(grey);

                    r = greyBinarizado;
                    g = greyBinarizado;
                    b = greyBinarizado;
                }else{
                    let r = getR(img,x,y);
                    let g = getG(img,x,y);
                    let b = getB(img,x,y);

                    r = colorBinarizado(r);
                    g = colorBinarizado(g);
                    b = colorBinarizado(b);
                };
                setPixel(img, x, y, r,g,b , 255);
            };
        };
        return img;
    };

    function colorBinarizado(color){
        let umbral = (255 /2);
        if(color > umbral){
            return 0;
        } else {
            return 255;
        };
    };

    function filterSepia(img){ 
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                r = Math.round((r * 0.393) + (r* 0.769) + (r* 0.189));
                g = Math.round((g * 0.349) + (g* 0.686) + (g* 0.168));
                b = Math.round((b * 0.272) + (b* 0.534) + (b* 0.131)); 
                
                setPixel(img, x, y, r,g,b , 255);
            };
        };
        return img;
    };

    function filterSaturacion(img,f){//luz extra
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                let grey =(r+g+b)/3;

                r = r + (r-grey)*f;
                g = g + (g-grey)*f;
                b = b + (b-grey)*f; 
                
                setPixel(img, x, y, r,g,b , 255);
            };
        }; 
        return img; 
    };

    function filterBlur(img, px){//de alto (radio)
        let cont=0;
        while(cont < width*height){
            for(let x = 0; x < width ; x ++) {
                for(let y = 0; y < height; y ++){
                    cont ++;
                    let promedio = 1/(Math.pow((px + px + 1),2));
                    let promedios = promedioRGB(img, px,x,y,promedio);    

                    setPixel(img, x, y, promedios[0],promedios[1],promedios[2] , 255);
                };
            };
        };
        return img;
    };

    function promedioRGB(img, px,x,y,promedio){
        let promedioR = 0;
        let promedioG = 0;
        let promedioB = 0;
        for(let x2 = (x-px); x2 <= (x+px); x2++) {
            if(x2 >= 0 && x2 < width){
                for(let y2 = (y-px); y2 <= (y+px); y2++){
                    if(y2 >=0 && y2 < height){

                        r = getR(img,x2,y2);
                        g = getG(img,x2,y2);
                        b = getB(img,x2,y2);

                        promedioR += r * promedio;
                        promedioG += g * promedio;
                        promedioB += b * promedio;   
                    }; 
                };
            };
        };
        return [promedioR, promedioG,promedioB];
    };

    function filterSuavizado(img){ 
        let kernel = [
            [1*(1/16),2*(1/16),1*(1/16)],
            [2*(1/16),4*(1/16),2*(1/16)], 
            [1*(1/16),2*(1/16),1*(1/16)]
        ]; //gauss
        //f1[c1,c2,c3]
        //let kernel = [[0,-1,0],[-1,5,-1],[0,-1,0]]; //enfocar

        filtroGenerico(img,kernel);
        return img;
    };

function filterBordes(img){
    let getGrey = (img, x, y) => (getR(img, x, y) + getG(img, x, y) + getB(img, x, y)) / 3;
    let cont = 0;
    let Gx = [
        [1,0,-1],
        [2,0,-2],
        [1,0,-1]
    ];
    let Gy = [
        [1,2,1],
        [0,0,0],
        [-1,-2,-1]
    ]; 
    //f1[c1,c2,c3]

    let imgCopia =  copiaCanvasActual();

    while(cont < width*height){
        for(let x = 0; x < width ; x ++) {
            for(let y = 0; y < height; y ++){
                cont ++;
                let rgbGx = mezclaMatriz(x, y, Gx, imgCopia, getGrey);
                let rgbGy = mezclaMatriz(x, y, Gy, imgCopia, getGrey);

                let result = Math.sqrt(Math.pow(rgbGx,2) + Math.pow(rgbGy,2));
                if(result > 255) {result = 255};
                if(result < 0) {result = 0}; 

                setPixel(img, x, y, result, result, result, 255);
            };
        };
    };
    return img;
};

function filtroGenerico(img,kernel){
    let cont=0;
    while(cont < width*height){
        for(let x = 0; x < width ; x ++) {
            for(let y = 0; y < height; y ++){
                cont ++;
                let r = mezclaMatriz(x, y, kernel, img, getR);
                let g = mezclaMatriz(x, y, kernel, img, getG);
                let b = mezclaMatriz(x, y, kernel, img, getB);   

                setPixel(img, x, y, r,g,b , 255);
            };
        };
    };
    return img;
};

function mezclaMatriz(x,y,kernel, copiaImg,color){ // entonces si color es una funcion que devuelve el color, tiene que recibir (img, x, y)
    let  pixel = (
        (kernel[0][0] * color(copiaImg, x-1, y-1  )) +
        (kernel[0][1] * color(copiaImg, x,   y-1  )) +
        (kernel[0][2] * color(copiaImg, x+1, y-1  )) +
        (kernel[1][0] * color(copiaImg, x-1, y    )) +
        (kernel[1][1] * color(copiaImg, x,   y    )) +
        (kernel[1][2] * color(copiaImg, x+1, y    )) +
        (kernel[2][0] * color(copiaImg, x-1, y+1  )) +
        (kernel[2][1] * color(copiaImg, x,   y+1  )) +
        (kernel[2][2] * color(copiaImg, x+1, y+1  ))
    );
    return pixel;
};

//_______________________manejo de ventanas___________________________________________
function ocultarMenuHerramientas(){
    let btnHerr = document.querySelector("#prop-trazo").childNodes;
    for (let key in btnHerr){
        let elem = btnHerr[key];
        if ((elem.classList !== undefined) && (elem.classList != "filtros" || elem.classList != "p-filtro")) elem.classList.add("oculto");
    };
};

function menuLapiz(){
    ocultarMenuHerramientas();
    document.querySelector("#prop-color").classList.remove("oculto");
    document.querySelector("#prop-trazo-lapiz").classList.remove("oculto");
};

function menuGoma(){
    ocultarMenuHerramientas();
    document.querySelector("#prop-trazo-goma").classList.remove("oculto");
};
//____________________________________________________________________________________

};

myPaint();