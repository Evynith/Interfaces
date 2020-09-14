
function myPaint(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");

    let width = canvas.width;
    let height = canvas.height;//TODO: permitir al usuario elegir????

    let imageData = context.createImageData(width, height);
    let input = document.querySelector(".input1");

    document.querySelector(".js-nuevoEspacio").onclick = function () {nuevoEspacio(width,height);};

    document.querySelector(".js-cargarImagen").onclick = function () {input.click();};
    
    function nuevoEspacio(width,height){
        context.fillStyle = "rgb(0,0,0)";//TODO: pasar color por parametro
        context.fillRect(0,0,width,height);
    };

    function copiaCanvasActual(){
        let copia = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        return copia;
    };

    input.onchange = e => {
        nuevoEspacio(width,height);//limpio el canvas(cuadrado vacio)
        let file = e.target.files[0]; //dir de donde esta el archivo
        let reader = new FileReader();//interpreta el archivo

        reader.readAsDataURL(file);//se lo guarda como tipo data url

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;//imagen en un protocolo aceptado
            let img = new Image();
            img.src = content;

            img.onload = function () { //TODO: reescala imagen
                let imageAspectRatio = 0;
                let imageScaleWidth = 0;
                let imageScaleHeight = 0;
                //calcula el tamaño de la imagen
                if(width > height) { //si es mas ancha que alta
                    imageAspectRatio = ( 1.0 * this.height) / this.width;
                    imageScaleWidth = width;
                    imageScaleHeight = width * imageAspectRatio;
                
                }else {// si es mas alta que ancha
                    imageAspectRatio = ( 1.0 * this.width) / this.height;
                    imageScaleWidth = height * imageAspectRatio;
                    imageScaleHeight = height;
                };

                context.drawImage(img, 0, 0,imageScaleWidth,imageScaleHeight);
                imageData = context.getImageData(0,0,imageScaleWidth,imageScaleHeight);
                context.putImageData(imageData,0,0);
            };
        };
    };
    
    document.querySelector(".js-filtro1").onclick = function () {
        //TODO: hacer que sea visible la seccion filtro y se oculte la de colores
    };

    document.querySelector(".filtros").onclick = function (e) {
        let filtroPresionado = e.target.parentNode.id;
        let copia = copiaCanvasActual();
        switch(filtroPresionado){
            case "blur":
                copia = filterBlur(copia);
            break;
            case "suavizado":
                filterSuavizado(copia);       //TODO:
            break;
            case "saturacion":
                copia = filterSaturacion(copia);
            break;
            case "brillo":
                copia = filterBrillo(copia);
            break;
            case "bordes":
                copia = filterBordes(copia);
            break;
            case "binarizacion":
                copia = filterBinarizacion(copia);
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

    document.querySelector(".js-guardar").onclick = function () {
        let dataURL = canvas.toDataURL("image/png;base64");
        this.href = dataURL;
    };

    let dibujar = false; 
    document.querySelector(".js-lapiz").onclick = function() {
        let r = 100;
        let g = 100;
        let b = 100;
        
        dibujarCanvas(r,g,b);
    };
    
    function dibujarCanvas(r,g,b){
        
        canvas.addEventListener("mousedown", function () {
            //inicia dibujo
            dibujar = true; 
            context.lineWidth = 14; //TODO: por usuario
            context.strokeStyle = `rgb(${r},${g},${b})`;
            //context.lineCap="butt|round|square";
            context.lineCap="round";
            //context.lineJoin="bevel|round|miter";
            context.lineJoin="round";
            context.beginPath();
        });

        canvas.addEventListener("mousemove", function (event) {
            let espacioNav = document.querySelector("nav").offsetHeight;
            let espacioMenuDerecha = document.querySelector(".js-menu-herramientas").offsetWidth;
            let cX = event.clientX - espacioMenuDerecha;
            let cY = event.clientY - espacioNav;
            setPixelCoord(cX,cY);
            
        });

        canvas.addEventListener("mouseup", function () {
            //para dibujo
            dibujar = false; 
            context.closePath();
        });
    };

    function setPixelCoord(cX,cY){ //TODO: pasar color
        //dibujo
        if (!dibujar) return; 
        let a = 255;
        
        context.lineTo(cX,cY);
        context.stroke();
    };

    document.querySelector(".js-goma").onclick = function() {//TODO:
        let r = 255;
        let g = 255;
        let b = 255;
        dibujarCanvas(r,g,b);
    };
  
    function setPixel(imageData, x, y, r, g, b , a) {
        let index = (x + y * imageData.width) * 4; 
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    };

    function RGBpromedio(img,x,y){ //saca el gris con el promedio de r, g y b
        r = getR(img,x,y);
        g = getG(img,x,y);
        b = getB(img,x,y);

        let promedio = (r+g+b)/3;
        return promedio;
    };

    function getR(imageData, x, y){
        let index = ((x + y * imageData.width) * 4);
        return imageData.data[index + 0];

    };
    function getG(imageData, x, y){
        let index = ((x + y * imageData.width) * 4);
        return imageData.data[index + 1];
    };
    function getB(imageData, x, y){
        let index = ((x + y * imageData.width) * 4);
        return imageData.data[index + 2];
    };

    function filterGrey(img){ //gris, donde los 3 valores de colores son iguales.. estandar es el valor promedio
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let grey = RGBpromedio(img, x,y);

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

    function filterBrillo(img){
        let f = 125; // TODO: slider 
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                r = r+f; 
                g = g+f;
                b = b+f; 

                setPixel(img, x, y, r,g,b , f);
            };
        };
        return img;
    }

    function filterBinarizacion(img){ //TODO: si a color o blancoo y negro
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let grey = RGBpromedio(img, x,y);
                let greyBinarizado = colorBinarizado(grey);

                r = greyBinarizado;
                g = greyBinarizado;
                b = greyBinarizado;

                /*
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                r = colorBinarizado(r);
                g = colorBinarizado(g);
                b = colorBinarizado(b); 
                */

                setPixel(img, x, y, r,g,b , 255);
            };
        };
        return img;
    };

    function colorBinarizado(color){
        let umbral = (255 /2); // TODO: elegido por el usuario (todos con slider)
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

    function filterSaturacion(img){
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getR(img,x,y);
                let g = getG(img,x,y);
                let b = getB(img,x,y);

                let grey =(r+g+b)/3;
                let f = 4; //TODO: usuario

                r = r + (r-grey)*f;
                g = g + (g-grey)*f;
                b = b + (b-grey)*f; 
                
                setPixel(img, x, y, r,g,b , 255);
            };
        }; 
        return img; 
    };

    function filterBlur(img){
        let px = 3; //de alto (radio) TODO: usuario
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

    function filterBordes(img){
        //let px = 2; //de alto (radio) TODO: usuario
        let cont = 0;
        let Gx = [[1,0,-1], [2,0,-2], [1,0,-1]];
        let Gy = [[1,2,1],[0,0,0], [-1,-2,-1]]; 
        //f1[c1,c2,c3]

        let imgCopia =  copiaCanvasActual();
 
        while(cont < width*height){
            for(let x = 0; x < width ; x ++) {
                for(let y = 0; y < height; y ++){
                    cont ++;
                    let rgbGx = kernelPromedio(x,y,Gx, imgCopia);
                    let rgbGy = kernelPromedio(x,y,Gy, imgCopia);

                    let coso = Math.sqrt(Math.pow(rgbGx,2) + Math.pow(rgbGy,2));
                    if(coso > 255) {coso = 255};
                    if(coso < 0) {coso = 0}; 

                    setPixel(img, x, y, coso, coso, coso, 255);
                };
            };
        };
        return img;
    };

    function kernelPromedio(x,y,kernel, copiaImg){
        let  pixel = (
            (kernel[0][0] * RGBpromedio(copiaImg,x - 1, y - 1)) +
            (kernel[0][1] * RGBpromedio(copiaImg,x, y - 1)) +
            (kernel[0][2] * RGBpromedio(copiaImg,x + 1, y - 1)) +
            (kernel[1][0] * RGBpromedio(copiaImg,x - 1, y)) +
            (kernel[1][1] * RGBpromedio(copiaImg,x, y)) +
            (kernel[1][2] * RGBpromedio(copiaImg,x + 1, y)) +
            (kernel[2][0] * RGBpromedio(copiaImg,x - 1, y + 1)) +
            (kernel[2][1] * RGBpromedio(copiaImg,x, y + 1)) +
            (kernel[2][2] * RGBpromedio(copiaImg,x + 1, y + 1))
        );
        return pixel;
    };

    function filterSuavizado(img){ 
        let kernel = [[1*(1/16),2*(1/16),1*(1/16)],[2*(1/16),4*(1/16),2*(1/16)], [1*(1/16),2*(1/16),1*(1/16)]]; //gauss
        //f1[c1,c2,c3]
        //let kernel = [[0,-1,0],[-1,5,-1],[0,-1,0]]; //enfocar

        recorreImg(img,kernel);
        return img;
    };


    function recorreImg(img,kernel){
        let cont=0;
        while(cont < width*height){
            for(let x = 0; x < width ; x ++) {
                for(let y = 0; y < height; y ++){
                    cont ++;
                    let r = kernelPromedio(x,y,kernel,img,"r");
                    let g = kernelPromedio(x,y,kernel,img,"g");
                    let b = kernelPromedio(x,y,kernel,img,"b");   

                    setPixel(img, x, y, r,g,b , 255);
                };
            };
        };
        return img;
    };

    function kernelPromedio(x,y,kernel, copiaImg,color){
        let  pixel = (
            (kernel[0][0] * getC(copiaImg,x - 1, y - 1,color)) +
            (kernel[0][1] * getC(copiaImg,x, y - 1,color)) +
            (kernel[0][2] * getC(copiaImg,x + 1, y - 1,color)) +
            (kernel[1][0] * getC(copiaImg,x - 1, y,color)) +
            (kernel[1][1] * getC(copiaImg,x, y,color)) +
            (kernel[1][2] * getC(copiaImg,x + 1, y,color)) +
            (kernel[2][0] * getC(copiaImg,x - 1, y + 1,color)) +
            (kernel[2][1] * getC(copiaImg,x, y + 1,color)) +
            (kernel[2][2] * getC(copiaImg,x + 1, y + 1,color))
        );
        return pixel;
    };

    function getC(img,x,y, color){ 
        r = getR(img,x,y);
        g = getG(img,x,y);
        b = getB(img,x,y);

        if(color == "r"){
            let index = ((x + y * imageData.width) * 4);
            return imageData.data[index + 0];
        }else if (color == "g"){
            let index = ((x + y * imageData.width) * 4);
            return imageData.data[index + 1];
        }else if (color == "b"){
            let index = ((x + y * imageData.width) * 4);
            return imageData.data[index + 2];
        };
    };

};

myPaint();