//constants
const WHITE = [255, 255, 255, 255]; // r g b a
const BLACK = [0, 0, 0, 255];

/*main worker code*/
self.onmessage = ({data: {width, height, params}}) =>{
    //console.log("message received: ", width, height, params);
    const buffer = new Uint8ClampedArray(width * height * 4);

    for (let r = 0; r < height; r++){
        for (let c = 0; c < width; c++){
            let color = getColorOnMandelbrotSet(r, c, params);
            let i = (r * width + c) * 4; // each pixel is 4 unsigned bytes in order: r g b a
            buffer[i] = color[0];
            buffer[i + 1] = color[1];
            buffer[i + 2] = color[2];
            buffer[i + 3] = color[3];
        }
    }

    self.postMessage({buffer, width, height}, [buffer.buffer]);
    
    /* definitions */
    function getColorOnMandelbrotSet(r, c, params){
        let pixel = BLACK; //inside set
        const screenFactor = width / height;
        const x = (2 * (c / width) - 1)  * screenFactor / params.zoom[0] + params.offset[0];
        const y = (1 - 2 * (r / height)) / params.zoom[1] + params.offset[1];
        
        //main algo
        let real = x, imaginary = y;
        for(let i = 0; i < params.iterations; i++){
            let temp = real;
            real = real * real - imaginary * imaginary + x;
            imaginary = 2 * temp * imaginary + y;

            //early escape
            if(real * real + imaginary * imaginary > 4){
                pixel = WHITE;
                break;
            }
        }

        return pixel;
    }
};