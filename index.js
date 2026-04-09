//constants
const WHITE = [255, 255, 255, 255];
const BLACK = [0, 0, 0, 255];
const EMPTY = [0, 0, 0, 0];
const BLUE = [0, 7, 100, 255];
const GRAY = [237, 255, 255, 255];
const YELLOW = [255, 170, 0, 255];


/* main code */
const canvas = document.getElementById('mandelbrotCanvas');
const ctx = canvas.getContext('2d');
let offset = [-0.5, 0];
let zoom = [1, 1];
let iterations = 20;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const SCREENFACTOR = canvas.width / canvas.height;

const imageData = ctx.createImageData(canvas.width, canvas.height);
const data = imageData.data;

queueMicrotask(draw);

// document.getElementById("buttonOffset").addEventListener("click", () =>{
//     canvas.addEventListener("click", (e) =>{
//         offset[0] = columnToPlaneX(e.offsetX);
//         offset[1] = rowToPlaneY(e.offsetY);
//         draw();
//     }, {once: true});
// });

canvas.addEventListener("click", (e) =>{
    offset[0] = columnToPlaneX(e.offsetX);
    offset[1] = rowToPlaneY(e.offsetY);
    draw();
});

canvas.addEventListener("wheel", (e) =>{
    e.preventDefault();
    if(e.deltaY < 0){
        zoom[0] *= 5;
        zoom[1] *= 5;
    } else{
        zoom[0] /= 5;
        zoom[1] /= 5;
    }
    draw();
}, { passive: false });

let sliderIterations = document.getElementById("sliderIterations");
sliderIterations.addEventListener("click", () =>{
    iterations = sliderIterations.value;
    draw();
})

/* definitions */
function draw(){
    for(let r = 0; r < canvas.height; r++){
        for(let c = 0; c < canvas.width; c++){
            setPixelColor(r, c);
        }
        //ctx.putImageData(imageData, 0, 0);
    }
    ctx.putImageData(imageData, 0, 0);
}

function setPixelColor(r, c){
    let pixel = WHITE;
    const x = columnToPlaneX(c);
    const y = rowToPlaneY(r);
    
    //main algo
    let real = x, imaginary = y, factorReal = x, factorImg = y;
    for(let i = 0; i <= iterations; i++){
        let temp = real;
        real = real ** 2 - imaginary ** 2 + factorReal;
        imaginary = 2 * temp * imaginary + factorImg;
    }
    
    //map to color
    if(real <= 1) pixel = BLACK;

    //set pixel's rgba
    let dataIdx = 4 * (r * canvas.width + c); // each pixel is 4 unsigned bytes in order: r g b a
    [pr, pg, pb ,pa] = pixel;
    data[dataIdx] = pr;
    data[dataIdx + 1] = pg;
    data[dataIdx + 2] = pb;
    data[dataIdx + 3] = pa;
}

function columnToPlaneX(c){
    return (2 * (c / canvas.width) - 1)  * SCREENFACTOR / zoom[0] + offset[0];
}

function rowToPlaneY(r){
    return (1 - 2 * (r / canvas.height)) / zoom[1] + offset[1];
}