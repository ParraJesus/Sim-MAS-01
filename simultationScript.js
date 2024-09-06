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

let grafica;


document.addEventListener('slidersDataUpdated', function(e) {
    const sliderData = e.detail;
    console.log('Datos recibidos:', sliderData);
    m = parseFloat(sliderData.masa);
    l = parseFloat(sliderData.l) * 10; // ajustar a tamaño final en pixeles
    k = parseFloat(sliderData.k);
    phi = parseFloat(sliderData.phi);
    inclinacionInicial = parseFloat(sliderData.inclinacionInicial);

    frecuenciaVibracion = Math.sqrt(3 * k / m - 6 * g / l);
    actualizarGrafica();
    actualizarVariables();
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
    background("#DBDFEA");
    
    // Dibuja el techo
    fill("#000");
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

function generarDatosGrafica(duracion, pasos) {
    let datos = {
        angulo: [],
        velocidad: [],
        aceleracion: []
    };
    for (let i = 0; i <= pasos; i++) {
        let tiempo = (i / pasos) * duracion;
        let angulo = inclinacionInicial * Math.cos(frecuenciaVibracion * tiempo + phi);
        let velocidad = -inclinacionInicial * frecuenciaVibracion * Math.sin(frecuenciaVibracion * tiempo + phi);
        let aceleracion = -inclinacionInicial * Math.pow(frecuenciaVibracion, 2) * Math.cos(frecuenciaVibracion * tiempo + phi);
        
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
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }, {
                label: 'Velocidad',
                data: generarDatosGrafica(10, 1000),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }, {
                label: 'Aceleración',
                data: generarDatosGrafica(10, 1000),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
        Math.abs(inclinacionInicial),
        Math.abs(inclinacionInicial * frecuenciaVibracion),
        Math.abs(inclinacionInicial * Math.pow(frecuenciaVibracion, 2))
    );
    
    grafica.options.scales.y.min = -maxValor * 1.1;
    grafica.options.scales.y.max = maxValor * 1.1;
    
    grafica.update();
}


function actualizarVariables() {
    let periodo = 2 * Math.PI / frecuenciaVibracion;
    let amplitud = inclinacionInicial;
    let energiaTotal = 0.5 * k * Math.pow(amplitud, 2);
    let energiaCinetica = 0.5 * m * Math.pow(velocidadActual, 2);
    let energiaPotencial = energiaTotal - energiaCinetica;

    document.getElementById('periodo').textContent = periodo.toFixed(3) + ' s';
    document.getElementById('frecuenciaAngular').textContent = frecuenciaVibracion.toFixed(3) + ' rad/s';
    document.getElementById('amplitud').textContent = amplitud.toFixed(3) + ' rad';
    document.getElementById('energiaTotal').textContent = energiaTotal.toFixed(3) + ' J';
    document.getElementById('energiaCinetica').textContent = energiaCinetica.toFixed(3) + ' J';
    document.getElementById('energiaPotencial').textContent = energiaPotencial.toFixed(3) + ' J';
}
