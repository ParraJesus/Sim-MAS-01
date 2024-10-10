/* Variables generales */

let g = 9.8; // gravedad
let t = 0; // tiempo
let dt = 0.02; // incremento de tiempo

/* Variables de entrada de usuario */
let m = 5; // masa del resorte
let l = 20*10; // longitud de la barra
let k = 10; // constante elástica
let posicionInicial = 1; //Condición inicial del sistema
let velocidadInicial = 1; //Condición inicial del sistema

/* variables de Cálculos */

let frecuenciaVibracion = Math.sqrt(3 * k / m); //Fórmula de la frecuencia de vibración
let phi = 0; // fase inicial que se halla a partir de las condiciones iniciales
let amplitud = 0; // amplitud del sistema que se halla a partir de las condiciones iniciales

/*Variables de la Animación*/
let posicionActual; //  ángulo de inclinación de la barra
let velocidadActual; // velocidad de la barra
let aceleracionActual; //   aceleración de la barra

let grafica;


document.addEventListener('slidersDataUpdated', function(e) {
    const sliderData = e.detail;
    console.log('Datos recibidos:', sliderData);
    m = parseFloat(sliderData.masa);
    l = parseFloat(sliderData.l) * 10; // ajustar a tamaño final en pixeles
    k = parseFloat(sliderData.k);
    posicionInicial = parseFloat(sliderData.posicionInicial);
    velocidadInicial = parseFloat(sliderData.velocidadInicial);
    frecuenciaVibracion = calcularFrecuenciaVibracion();
    phi = calcularPhi();
    amplitud = calcularAmplitud();

    actualizarGrafica();
    actualizarVariables();
    actualizarEcuaciones();
});

document.addEventListener('startAnimation', function(e) {
    pauseAnimation();
});

function setup() {
    let canvasDiv = document.getElementById('sim_container');
    let canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
    canvas.parent('sim_container');
    windowResized(); // Llamamos a esta función para asegurar que el canvas se ajuste correctamente
    noLoop();
    crearGrafica();
    actualizarVariables();
}

function windowResized() {
    let canvasDiv = document.getElementById('sim_container');
    resizeCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
}

function draw() {
    background("#f0f0f0");
    
    // Dibuja el techo
    fill("#686898");
    rect(20, 20, 600, 10);
    
    // Calcula el ángulo de la barra en función del tiempo
    posicionActual = calcularPosicion();
    velocidadActual = calcularVelocidad();
    aceleracionActual = calcularAceleracion();
    
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
    
    actualizarVariables();
}

// Función para dibujar el resorte
function drawSpring(x1, y1, x2, y2) 
{
    //line(x1, y1, x2, y2);
    let numCoils = 50;
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

/*Funciones para evaluar las fórmulas*/

function calcularFrecuenciaVibracion()
{
    //Fórmula w0
    return Math.sqrt(3 * k / m);
}

function calcularPhi()
{
    let phiAux = 0;
    if(posicionInicial > 0 || posicionInicial < 0)
    {
        phiAux = Math.atan2(-velocidadInicial, (frecuenciaVibracion * posicionInicial));
    }
    else
    {
        if(velocidadInicial > 0)
        {
            phiAux = (3 * Math.PI)/2
        }
        else
        {
            phiAux = (Math.PI)/2
        }
    }
    return phiAux;
}

function calcularAmplitud()
{
    let amplitudAux;

    amplitudAux = posicionInicial/Math.cos(phi);
    return amplitudAux;
}

function calcularPosicion()
{
    //  fórmula de la posición
    return amplitud * cos(frecuenciaVibracion * t + phi);
}

function calcularVelocidad()
{
    //  fórmula de la velocidad
    return -amplitud * frecuenciaVibracion * sin(frecuenciaVibracion * t + phi);
}

function calcularAceleracion()
{
    //  fórmula de la aceleración
    return -amplitud * frecuenciaVibracion**2 * cos(frecuenciaVibracion * t + phi);
}

function generarDatosGrafica(duracion, pasos) {
    let datos = {
        angulo: [],
        velocidad: [],
        aceleracion: []
    };
    for (let i = 0; i <= pasos; i++) {
        let tiempo = (i / pasos) * duracion;
        let angulo = amplitud * Math.cos(frecuenciaVibracion * tiempo + phi);
        let velocidad = -amplitud * frecuenciaVibracion * Math.sin(frecuenciaVibracion * tiempo + phi);
        let aceleracion = -amplitud * Math.pow(frecuenciaVibracion, 2) * Math.cos(frecuenciaVibracion * tiempo + phi);
        datos.angulo.push({x: tiempo, y: angulo});
        datos.velocidad.push({x: tiempo, y: velocidad});
        datos.aceleracion.push({x: tiempo, y: aceleracion});
    }
    return datos;
}

function crearGrafica() {
    let ctx = document.getElementById('grafica').getContext('2d');
    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Ángulo',
                data: generarDatosGrafica(10, 1000),  // Aumentamos a 1000 puntos
                borderColor: '#a8f808',
                backgroundColor: '#a8f80844',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }, {
                label: 'Velocidad',
                data: generarDatosGrafica(10, 1000),
                borderColor: '#8080f8',
                backgroundColor: '#8080f844',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }, {
                label: 'Aceleración',
                data: generarDatosGrafica(10, 1000),
                borderColor: '#b808f8',
                backgroundColor: '#b808f844',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Ángulo, Velocidad y Aceleración vs Tiempo',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Tiempo (s)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function actualizarGrafica() {
    let datos = generarDatosGrafica(10, 1000);
    grafica.data.datasets[0].data = datos.angulo;
    grafica.data.datasets[1].data = datos.velocidad;
    grafica.data.datasets[2].data = datos.aceleracion;
    
    let maxValor = Math.max(
        Math.abs(calcularAmplitud()),
        Math.abs(calcularFrecuenciaVibracion()),
        Math.abs(calcularFrecuenciaVibracion())
    );

    grafica.options.scales.y.min = -maxValor * 1.1;
    grafica.options.scales.y.max = maxValor * 1.1;
    
    grafica.update();
}

function actualizarVariables() {
    let periodo = 2 * Math.PI / frecuenciaVibracion;
    let energiaTotal = 0.5 * k * Math.pow(amplitud, 2);
    let energiaCinetica = 0.5 * m * Math.pow(velocidadActual, 2);
    let energiaPotencial = energiaTotal - energiaCinetica;

    document.getElementById('faseInicial').textContent = calcularPhi().toFixed(3) + ' rad';
    document.getElementById('amplitud').textContent = calcularAmplitud().toFixed(3) + ' rad';
    document.getElementById('frecuenciaVibracion').textContent = frecuenciaVibracion.toFixed(3) + ' rad/s';

    document.getElementById('periodo').textContent = periodo.toFixed(3) + ' s';
    document.getElementById('energiaTotal').textContent = energiaTotal.toFixed(3) + ' J';
    document.getElementById('energiaCinetica').textContent = energiaCinetica.toFixed(3) + ' J';
    document.getElementById('energiaPotencial').textContent = energiaPotencial.toFixed(3) + ' J';
}

function actualizarEcuaciones() {
    // Ecuación diferencial
    document.getElementById('ecuacionDiferencial').innerHTML = 
        `θ'' + (${calcularFrecuenciaVibracion().toFixed(3)}²)θ = 0`;

    // Solución completa
    document.getElementById('solucionCompleta').innerHTML = 
        `θ(t) = (${calcularAmplitud().toFixed(3)}) * cos((${calcularFrecuenciaVibracion().toFixed(3)}) * t + (${calcularPhi().toFixed(3)}))`;
}
