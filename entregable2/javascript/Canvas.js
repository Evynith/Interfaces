export default class Canvas {
    #context;
    #areaTablero;
    #areaJ1;
    #areaJ2;
    #patternCasilla;

    constructor(canvas) {
        this.#context = canvas.getContext("2d");
        canvas.width = window.innerWidth -20;
        canvas.height = window.innerHeight -20;
        this.#width = canvas.width;
        this.#height = canvas.height;

        this.#areaTablero = {
            x : ((width * 20) /100),
            xFinal : width - ((width * 20) /100),
            y : ((height * 10 )/100),
            yFinal : height - ((height * 10 )/100)
        }

        this.#areaJ1 = {
            x : (0),
            xFinal : this.areaTablero.x,
            y : (0),
            yFinal : this.areaTablero.yFinal
        }

        this.#areaJ2 = {
            x : this.areaTablero.xFinal,
            xFinal : width,
            y : 0,
            yFinal : this.areaTablero.yFinal 
        }
    }

    set imageCasilla(pattern){
        this.#patternCasilla = pattern;
    }

    clear = () => this.#context.clearRect(0, 0, width, height);

}