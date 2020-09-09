
function myPaint(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");

    let width = canvas.width;
    let height = canvas.height;//TODO: permitir al usuario elegir

    let imageData = context.createImageData(width, height);
    let input = document.querySelector(".input1");

    document.querySelector(".js-nuevoEspacio").onclick = function () {nuevoEspacio(width,height);};

    document.querySelector(".js-cargarImagen").onclick = function () {input.click();};
    
    function nuevoEspacio(width,height){
        context.fillStyle = "rgb(0,0,0)";//TODO: pasar color por parametro
        context.fillRect(0,0,width,height);
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

            img.onload = function () {
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

    function filterGrey(){
        //gris, donde los 3 valores de colores son iguales.. estandar es el valor promedio
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let r = getRed(imageData,x,y);
                let g = getGreen(imageData,x,y);
                let b = getBlue(imageData,x,y);

                let grey =(r+g+b)/3;

                setPixel(imageData, x, y, grey, grey, grey , 255);
            };
        };
    };
    
};
myPaint();