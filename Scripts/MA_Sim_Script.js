/* Variables generales */

let g = 9.8; // gravedad
let t = 0; // tiempo
let dt = 0.02; // incremento de tiempo

/* Variables de entrada de usuario */

let m = 5; // masa del resorte
let l = 20; // longitud de la barra
let k = 10; // constante elástica
let posicionInicial = 0; //Condición inicial del sistema
let velocidadInicial = 0; //Condición inicial del sistema
let b = 0; //amortiguamiento

/* variables de Cálculos */

let frecuenciaVibracion = Math.sqrt(3 * k / m); //Fórmula de la frecuencia de vibración
let coeficienteAmortiguamiento = (6*b)/(m * (l/10)**2);

/*Variables de la Animación*/

let posicionActual = 0; //  ángulo de inclinación de la barra
let velocidadActual = 0; // velocidad de la barra
let aceleracionActual = 0; //   aceleración de la barra

let grafica;

document.addEventListener('slidersDataUpdated', function(e) {
    const sliderData = e.detail;
    console.log('Datos recibidos:', sliderData);
    m = parseFloat(sliderData.masa);
    l = parseFloat(sliderData.l); // ajustar a tamaño final en pixeles
    k = parseFloat(sliderData.k);
    posicionInicial = parseFloat(sliderData.posicionInicial);
    velocidadInicial = parseFloat(sliderData.velocidadInicial);
    b = parseFloat(sliderData.b);

    frecuenciaVibracion = calcularFrecuenciaVibracion();
    coeficienteAmortiguamiento = calcularCoeficienteAmortiguamiento();
    console.log("frecuencia: " + frecuenciaVibracion);
    console.log("Coeficiente: " + coeficienteAmortiguamiento);

    t = 0;
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
    background("#f0f0f0");
    
    // Dibuja el techo
    fill("#686898");
    rect(20, 20, 600, 10);
    
    //Añadir la lógica para determinar la posición, velocidad y aceleración
    //Según el tipo de amortiguamiento del sistema
    caAux = calcularCoeficienteAmortiguamiento();
    fvAux = calcularFrecuenciaVibracion();
    if(Math.pow(caAux, 2) < Math.pow(fvAux, 2)){
        posicionActual = calcularSubAmortiguado(t)[0];
        velocidadActual = calcularSubAmortiguado(t)[1];
        aceleracionActual = calcularSubAmortiguado(t)[2];
        console.log("Subamortiguado");
    }
    else if(Math.pow(caAux, 2) > Math.pow(fvAux, 2)){
        posicionActual = calcularSobreAmortiguado(t)[0];
        velocidadActual = calcularSobreAmortiguado(t)[1];
        aceleracionActual = calcularSobreAmortiguado(t)[2];
        console.log("SobreAmortiguado");
    }
    else{
        posicionActual = calcularCritAmortiguado(t)[0];
        velocidadActual = calcularCritAmortiguado(t)[1];
        aceleracionActual = calcularCritAmortiguado(t)[2];
        console.log("CriticamenteAmortiguado");
    }

    console.log("x, v y a: " + posicionActual + ", " + velocidadActual + ", " + aceleracionActual);

    // Traslada el sistema de coordenadas
    translate(240 + (l*10 / 2) - 20, 200 + 5);
    // Dibuja el resorte 
    drawSpring(-l*10/2, -180, (-l*10/2)+posicionActual*4, -posicionActual*(l*10/2));

    // Rota el sistema de coordenadas
    rotate(posicionActual);
    
    // Dibuja la barra
    fill("#6EAA78");
    rect((-l*10 / 2), -5, l*10, 10);
    
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
    //Fórmula
    return Math.sqrt(3 * k / m).toFixed(3);
}

function calcularCoeficienteAmortiguamiento()
{
    //Fórmula
    return (6*b)/(m * (l)**2);
}

function calcularPhi(){
    let w = calcularFrecuenciaVibracion();
    let gamma = calcularCoeficienteAmortiguamiento();
    let omega_d = Math.sqrt(w** 2 - gamma ** 2);

    let phi = Math.atan2(-velocidadInicial-gamma*posicionInicial, (posicionInicial*omega_d));
    return Math.abs(phi);
}



function calcularSubAmortiguado(time1)
{
    let gamma = calcularCoeficienteAmortiguamiento();
    let w = calcularFrecuenciaVibracion();

    let omega_d = Math.sqrt(w** 2 - gamma ** 2);

    let phi = calcularPhi();

    let amplitud_C = (posicionInicial/Math.cos(phi));



    //Fórmulas de posición, velocidad y aceleracióng
    let posicionAux = amplitud_C*Math.exp(-gamma*time1)*Math.cos(omega_d*time1+phi);
    let velocidadAux = -amplitud_C*gamma*Math.exp(-gamma*time1)*Math.cos(omega_d*time1 + phi) -amplitud_C*Math.exp(-gamma*time1)*omega_d*Math.sin(omega_d*time1 + phi)
    let aceleracionAux = amplitud_C*(gamma** 2)*Math.exp(-gamma*time1)*Math.cos(omega_d*time1 + phi) + amplitud_C*(gamma** 2)*Math.exp(-gamma*time1)*Math.sin(omega_d*time1 + phi) 
    + amplitud_C*gamma*Math.exp(-gamma*time1)*omega_d*Math.sin(omega_d*time1 + phi) - amplitud_C*Math.exp(-gamma*time1)*(omega_d** 2)*Math.cos(omega_d*time1 + phi); 

    let movimientosSubAmortiguado = [posicionAux, velocidadAux, aceleracionAux];

    return movimientosSubAmortiguado;
}

function calcularSobreAmortiguado(time1)
{
    let caAux = calcularCoeficienteAmortiguamiento(); // Coeficiente de amortiguamiento
    let fvAux = calcularFrecuenciaVibracion();       // Frecuencia de vibración
    
    // Cálculo de las raíces (r1 y r2) de la ecuación característica
    let r1 = -(caAux) + Math.sqrt(caAux**2 - fvAux**2);
    let r2 = -(caAux) - Math.sqrt(caAux**2 - fvAux**2);

    // Cálculo de C1 y C2 utilizando las condiciones iniciales
    let C1 = (velocidadInicial - posicionInicial * r2) / (r1 - r2);
    let C2 = posicionInicial - C1;

    // Cálculo de la posición, velocidad y aceleración en el tiempo t = time1
    let posicionAux = C1 * Math.exp(r1 * time1) + C2 * Math.exp(r2 * time1);
    let velocidadAux = C1 * r1 * Math.exp(r1 * time1) + C2 * r2 * Math.exp(r2 * time1);
    let aceleracionAux = C1 * r1**2 * Math.exp(r1 * time1) + C2 * r2**2 * Math.exp(r2 * time1);

    // Retornar un arreglo con posición, velocidad y aceleración
    let movimientosSobreAmortiguado = [posicionAux, velocidadAux, aceleracionAux];
    return movimientosSobreAmortiguado;
}

function calcularCritAmortiguado(time)
{
    let caAux = calcularCoeficienteAmortiguamiento(); // Coeficiente de amortiguamiento crítico
    let fvAux = calcularFrecuenciaVibracion();       // Frecuencia de vibración natural
    let r = -caAux;                                  // Raíz doble (r1 = r2 = -caAux)

    // Cálculo de C1 y C2 usando las condiciones iniciales
    let C1 = posicionInicial;
    let C2 = velocidadInicial + caAux * posicionInicial;

    // Cálculo de la posición, velocidad y aceleración en el tiempo t
    let posicionAux = (C1 + C2 * time) * Math.exp(r * time);
    let velocidadAux = (C2 + C1 * r + C2 * r * time) * Math.exp(r * time);
    let aceleracionAux = (C2 * r * r + 2 * C2 * r * time + C1 * r * r) * Math.exp(r * time);

    // Retornar un arreglo con posición, velocidad y aceleración
    let movimientosCritAmortiguado = [posicionAux, velocidadAux, aceleracionAux];
    return movimientosCritAmortiguado;
}

/*Funciones para generar la gráfica */
function generarDatosGrafica(duracion, pasos) {
    let datos = {
        angulo: [],
        velocidad: [],
        aceleracion: []
    };
    for (let i = 0; i <= pasos; i++) {
        let tiempo = (i / pasos) * duracion;
        let angulo = 0;
        let velocidad = 0;
        let aceleracion = 0;
        //Graficar el tipo de amortiguamiento correcto
        caAux = calcularCoeficienteAmortiguamiento();
        fvAux = calcularFrecuenciaVibracion();
        if(Math.pow(caAux, 2) < Math.pow(fvAux, 2)){
            angulo = calcularSubAmortiguado(tiempo)[0];
            velocidad = calcularSubAmortiguado(tiempo)[1];
            aceleracion = calcularSubAmortiguado(tiempo)[2];
            console.log("Graficando Sub");
        }
        else if(Math.pow(caAux, 2) > Math.pow(fvAux, 2)){
            angulo = calcularSobreAmortiguado(tiempo)[0];
                velocidad = calcularSobreAmortiguado(tiempo)[1];
                aceleracion = calcularSobreAmortiguado(tiempo)[2];
                console.log("Graficando Sobre");
        }
        else{
            angulo = calcularCritAmortiguado(tiempo)[0];
                velocidad = calcularCritAmortiguado(tiempo)[1];
                aceleracion = calcularCritAmortiguado(tiempo)[2];
                console.log("Graficando Criti");
        }
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
    let datos = generarDatosGrafica(100, 1000);
    grafica.data.datasets[0].data = datos.angulo;
    grafica.data.datasets[1].data = datos.velocidad;
    grafica.data.datasets[2].data = datos.aceleracion;
    
    let maxValor = Math.max(
        Math.abs(calcularCoeficienteAmortiguamiento()),
        Math.abs(calcularFrecuenciaVibracion()),
        Math.abs(calcularFrecuenciaVibracion())
    );

    grafica.options.scales.y.min = -maxValor * 1.1;
    grafica.options.scales.y.max = maxValor * 1.1;

    grafica.options.scales.x.min = 0;
    grafica.options.scales.x.max = 100;
    
    grafica.update();
}

function calcularAmplitud(time1){

    let phi = calcularPhi();
    let constante = (posicionInicial/Math.cos(phi));
    let gamma = calcularCoeficienteAmortiguamiento();

    let amplitud = constante*Math.exp(-gamma*time1);

    return amplitud;
}

/*Funciones para manejar las variables */
function actualizarVariables() {
    
    let periodo = 2 * Math.PI / frecuenciaVibracion;
    /*let energiaTotal = 0.5 * k * Math.pow(amplitud, 2);
    let energiaCinetica = 0.5 * m * Math.pow(velocidadActual, 2);
    let energiaPotencial = energiaTotal - energiaCinetica;

    
    document.getElementById('energiaTotal').textContent = energiaTotal.toFixed(3) + ' J';
    document.getElementById('energiaCinetica').textContent = energiaCinetica.toFixed(3) + ' J';
    document.getElementById('energiaPotencial').textContent = energiaPotencial.toFixed(3) + ' J';
*/
    document.getElementById('faseInicial').textContent = calcularPhi().toFixed(3) + ' rad';
    document.getElementById('amplitud').textContent = calcularAmplitud(t).toFixed(3) + ' rad';
    document.getElementById('frecuenciaVibracion').textContent = frecuenciaVibracion + ' rad/s';

    document.getElementById('periodo').textContent = periodo.toFixed(3) + ' s';
}
