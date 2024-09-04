/* Variables generales */

let g = 9.8; // gravedad
let t = 0; // tiempo
let dt = 0.02; // incremento de tiempo

/* Variables de entrada de usuario */

let m = 5; // masa del resorte
let l = 20*10; // longitud de la barra

let k = 10; // constante elástica
let phi = 0; // fase inicial

let inclinacionInicial = 0; // ángulo inicial para perturbar el sistema

/* variables de Cálculos */

let frecuenciaVibracion = Math.sqrt(3 * k / m - 6 * g / l); //Fórmula de la frecuencia de vibración
let posicionActual; //  ángulo de inclinación de la barra
let velocidadActual; // velocidad de la barra
let aceleracionActual; //   aceleración de la barra

document.addEventListener('slidersDataUpdated', function(e) {
    const sliderData = e.detail;
    console.log('Datos recibidos:', sliderData);
    m = parseFloat(sliderData.masa);
    l = parseFloat(sliderData.l); // ajustar a tamaño final en pixeles
    l = l*10;
    k = parseFloat(sliderData.k);
    phi = parseFloat(sliderData.phi);
    inclinacionInicial = parseFloat(sliderData.inclinacionInicial);
});

document.addEventListener('startAnimation', function(e)
{
    pauseAnimation();
})

function setup() {
    let canvasDiv = document.getElementById('sim_container');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sim_container'); // Asocia el canvas con el div
    noLoop();
}

function draw() {
    background("#DBDFEA");
    
    // Dibuja el techo
    fill("#000");
    rect(20, 20, 600, 10);
    
    // Calcula el ángulo de la barra en función del tiempo
    let posicionActual = calcularPosicion();
    
    // Traslada el sistema de coordenadas
    translate(240 + (l / 2) - 20, 200 + 5);
    // Dibuja el resorte 
    drawSpring(-l/2, -180, (-l/2)+posicionActual*4, -posicionActual*(l/2));

    // Rota el sistema de coordenadas
    rotate(posicionActual);
    
    // Dibuja la barra
    fill("#6EAA78");
    rect((-l / 2), -5, l, 10);
    
    // Dibuja el eje de rotación
    fill("#48e");
    circle(0, 0, 10);
    
    // Incrementa el tiempo
    t += dt;
}

// Función para dibujar el resorte
function drawSpring(x1, y1, x2, y2) 
{
    //line(x1, y1, x2, y2);
    let numCoils = 10;
    let springLength = dist(x1, y1, x2, y2);
    let coilSpacing = springLength / numCoils;
    
    stroke(0);
    noFill();
    
    beginShape();
    for (let i = 0; i <= numCoils; i++) {
        let t = i / numCoils;
        let x = lerp(x1, x2, t);
        let y = lerp(y1, y2, t);
        if (i % 2 === 0) {
            vertex(x + 5, y);
        } else {
            vertex(x - 5, y);
        }
    }
    endShape();
}

function pauseAnimation()
{
    if(isLooping())
    {
        noLoop();
    }
    else
    {
        loop();
    }
}

function calcularPosicion()
{
    //  fórmula de la posición
    return inclinacionInicial * cos(frecuenciaVibracion * t + phi);
}

function calcularVelocidad()
{
    //  fórmula de la velocidad
    return -inclinacionInicial * frecuenciaVibracion * sin(frecuenciaVibracion * t + phi);
}

function calcularAceleracion()
{
    //  fórmula de la aceleración
    return -inclinacionInicial * frecuenciaVibracion**2 * cos(frecuenciaVibracion * t + phi);
}

