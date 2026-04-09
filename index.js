/* main code */
const canvas = document.getElementById('mandelbrotCanvas');
const ctx = canvas.getContext('2d');
let offset = [-0.5, 0];
let zoom = [1, 1];
let iterations = 20;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let screenFactor = canvas.width / canvas.height;

let worker = null;
drawWorker();

addEventListener("resize", () =>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    screenFactor = canvas.width / canvas.height;
    drawWorker();
})

canvas.addEventListener("click", (e) =>{
    //console.log("canvas clicked!")
    offset[0] = columnToPlaneX(e.offsetX);
    offset[1] = rowToPlaneY(e.offsetY);
    drawWorker();
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
    drawWorker();
}, { passive: false });

let sliderIterations = document.getElementById("sliderIterations");
sliderIterations.addEventListener("input", () =>{
    iterations = sliderIterations.value;
    drawWorker();
})


/* definitions */
function drawWorker(){
    if(worker) worker.terminate();
    worker = new Worker("drawWorker.js");
    worker.postMessage(
        {
            width: canvas.width, 
            height: canvas.height, 
            params: {offset, zoom, iterations}
        }
    );
    worker.addEventListener("message", ({data: {buffer, width, height}}) =>{
        //console.log("answer received: ", buffer, width, height);
        const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
        ctx.putImageData(imageData, 0, 0);
        console.timeEnd("render: ");
    }, {once: true});
}

function columnToPlaneX(c){
    return (2 * (c / canvas.width) - 1)  * screenFactor / zoom[0] + offset[0];
}

function rowToPlaneY(r){
    return (1 - 2 * (r / canvas.height)) / zoom[1] + offset[1];
}