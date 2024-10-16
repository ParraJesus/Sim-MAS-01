//Documento Movimiendo oscilatorio forzado amortiguado



/* Variables generales */

let g = 9.8;    // gravedad
let t = 0;      // tiempo
let dt = 0.02;  // incremento de tiempo

/* Variables de entrada de usuario */

let m = 5;                                  // masa del resorte
let l = 20;                                 // longitud de la barra
let k = 10;                                 // constante elástica
let posicionInicial = 0;                    //Condición inicial del sistema
let velocidadInicial = 0;                   //Condición inicial del sistema
let b = 0;                                  //amortiguamiento
let fuerzaExterna = 10;                     //Condición inicial del sistema
let frecuenciaFuerzaExterna = Math.PI;      //Condición inicial del sistema

/* variables de Cálculos */

let frecuenciaVibracion = Math.sqrt(3 * k / m);             //Fórmula de la frecuencia de vibración
let coeficienteAmortiguamiento = (6*b)/(m * (l/10)**2);     //Fórmula del coeficiente
let phi = 0;                                                // fase inicial que se halla a partir de las condiciones iniciales
let amplitud = 0;                                           // amplitud del sistema que se halla a partir de las condiciones iniciales

/*Variables de la Animación*/

let posicionActual = 0;     //ángulo de inclinación de la barra
let velocidadActual = 0;    //velocidad de la barra
let aceleracionActual = 0;  //aceleración de la barra

let grafica;

document.addEventListener('slidersDataUpdated', function(e) {
    const sliderData = e.detail;
    console.log('Datos recibidos:', sliderData);
    m = parseFloat(sliderData.masa);
    l = parseFloat(sliderData.l);
    k = parseFloat(sliderData.k);
    posicionInicial = parseFloat(sliderData.posicionInicial);
    velocidadInicial = parseFloat(sliderData.velocidadInicial);
    b = parseFloat(sliderData.b);
    fuerzaExterna =  parseFloat(sliderData.fuerzaExterna);
    frecuenciaFuerzaExterna = parseFloat(sliderData.frecuenciaFuerzaExterna);

    phi = calcularPhi();
    amplitud = calcularAmplitud();
    frecuenciaVibracion = calcularFrecuenciaVibracion();
    coeficienteAmortiguamiento = calcularCoeficienteAmortiguamiento();

    t = 0;
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

console.log("Valores iniciales:", m, l, k, posicionInicial, velocidadInicial, b, fuerzaExterna, frecuenciaFuerzaExterna);

function draw() {

    console.log("Frame:", frameCount, "Posición:", posicionActual);
    background("#f0f0f0");
    
    // Dibuja el techo
    fill("#686898");
    rect(20, 20, 600, 10);

    //Añadir la lógica para determinar la posición, velocidad y aceleración
    //Según si el sistema es amortiguado o no
    //caAux = calcularCoeficienteAmortiguamiento();
    let resultado = b === 0 ? calcularForzadoNoAmortiguado(t) : calcularForzadoAmortiguado(t);
    posicionActual = resultado[0];
    velocidadActual = resultado[1];
    aceleracionActual = resultado[2];
    fvAux = calcularFrecuenciaVibracion();
    if(b === 0) //no amortiguado
    {
        posicionActual = calcularForzadoNoAmortiguado(t)[0];
        velocidadActual = calcularForzadoNoAmortiguado(t)[1];
        aceleracionActual = calcularForzadoNoAmortiguado(t)[2];
        console.log("Forzado No Amortiguado");
    }
    else
    {
        console.log("Forzado Amortiguado");
        posicionActual = calcularForzadoAmortiguado(t)[0];
        velocidadActual = calcularForzadoAmortiguado(t)[1];
        aceleracionActual = calcularForzadoAmortiguado(t)[2];
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

// Función para dibujar el re sorte
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
    return Math.sqrt((3 * k) / m);
}

function calcularAmplitud() {
    // Para un sistema forzado, la amplitud depende de la fuerza externa y la frecuencia
    let w0 = calcularFrecuenciaVibracion();
    let gamma = calcularCoeficienteAmortiguamiento();
    let wf = frecuenciaFuerzaExterna;

    // Calculamos la amplitud usando la fórmula para un oscilador forzado amortiguado
    let numerador = (6 * fuerzaExterna) / (m * l);
    let denominador = Math.sqrt((w0**2 - wf**2)**2 + (2 * gamma * wf)**2);
    
    return numerador / denominador;
}

function calcularForzadoNoAmortiguado(time)
{
    let w0 = parseFloat(calcularFrecuenciaVibracion());
    let a = calcularAmplitud();
    let phi = calcularPhi();
    let posicionAux, velocidadAux, aceleracionAux;
    let wf = frecuenciaFuerzaExterna;

    //Hay dos casos
    if(wf < w0)
    {
        posicionAux = (a * Math.cos(w0 * time + phi)) + (((fuerzaExterna/m)/(w0**2 - frecuenciaFuerzaExterna**2)) * Math.cos(frecuenciaFuerzaExterna * time));
        velocidadAux = (-a * w0 * Math.sin(w0 * time + phi)) - ((fuerzaExterna * wf) / (m * l ** 2 * (w0 ** 2 - wf ** 2)) * Math.sin(wf * time));
        aceleracionAux = (-a * w0 ** 2 * Math.cos(w0 * time + phi)) - ((fuerzaExterna * wf ** 2) / (m * l ** 2 * (w0 ** 2 - wf ** 2)) * Math.cos(wf * time)); 
    }
    else
    {
        posicionAux = (a * Math.cos(w0 * time + phi)) + (((fuerzaExterna/m)/(wf**2 - w0**2)) * Math.cos(wf * time - Math.PI));
        velocidadAux = (-a * w0 * Math.sin(w0 * time + phi)) - ((fuerzaExterna * wf) / (m * l ** 2 * (wf ** 2 - w0 ** 2)) * Math.sin(wf * time - Math.PI));
        aceleracionAux = (-a * w0 ** 2 * Math.cos(w0 * time + phi)) - ((fuerzaExterna * wf ** 2) / (m * l ** 2 * (wf ** 2 - w0 ** 2)) * Math.cos(wf * time - Math.PI));
    }

    let movimientosSubAmortiguado = [posicionAux, velocidadAux, aceleracionAux];
    return movimientosSubAmortiguado;
}

function calcularForzadoAmortiguado(time) {
    let w0 = calcularFrecuenciaVibracion();
    let gamma = calcularCoeficienteAmortiguamiento();
    let wf = frecuenciaFuerzaExterna;

    // Solución homogénea
    let [thetaH, velocidadH, aceleracionH] = calcularSolucionHomogenea(time, w0, gamma);
    
    // Solución particular
    let [thetaP, velocidadP, aceleracionP] = calcularSolucionParticular(time, w0, wf);    
    // Suma de las soluciones
    let posicionAux = thetaH + thetaP;
    let velocidadAux = velocidadH + velocidadP;
    let aceleracionAux = aceleracionH + aceleracionP;

    return [posicionAux, velocidadAux, aceleracionAux];
}

function calcularSolucionHomogenea(time, w0, gamma) {
    let A = calcularAmplitud();
    let phi = calcularPhi();
    
    if (gamma < w0) {
        // Subamortiguado
        let wd = Math.sqrt(w0**2 - gamma**2);
        let theta = A * Math.exp(-gamma * time) * Math.cos(wd * time + phi);
        let velocidad = -A * Math.exp(-gamma * time) * (gamma * Math.cos(wd * time + phi) + wd * Math.sin(wd * time + phi));
        let aceleracion = A * Math.exp(-gamma * time) * ((gamma**2 - wd**2) * Math.cos(wd * time + phi) + 2 * gamma * wd * Math.sin(wd * time + phi));
        return [theta, velocidad, aceleracion];
    } else if (gamma > w0) {
        // Sobreamortiguado
        let r1 = -gamma + Math.sqrt(gamma**2 - w0**2);
        let r2 = -gamma - Math.sqrt(gamma**2 - w0**2);
        let C1 = (velocidadInicial - posicionInicial * r2) / (r1 - r2);
        let C2 = posicionInicial - C1;
        let theta = C1 * Math.exp(r1 * time) + C2 * Math.exp(r2 * time);
        let velocidad = C1 * r1 * Math.exp(r1 * time) + C2 * r2 * Math.exp(r2 * time);
        let aceleracion = C1 * r1**2 * Math.exp(r1 * time) + C2 * r2**2 * Math.exp(r2 * time);
        return [theta, velocidad, aceleracion];
    } else {
        // Críticamente amortiguado
        let theta = (A + A * gamma * time) * Math.exp(-gamma * time);
        let velocidad = A * gamma * (1 - gamma * time) * Math.exp(-gamma * time);
        let aceleracion = -A * gamma**2 * (2 - gamma * time) * Math.exp(-gamma * time);
        return [theta, velocidad, aceleracion];
    }
}

function calcularSolucionParticular(time, w0, wf) {
    let gamma = calcularCoeficienteAmortiguamiento(); // Añade esta línea
    let numerador = (6 * fuerzaExterna) / (m * l);
    let denominador = Math.sqrt((w0**2 - wf**2)**2 + (2 * gamma * wf)**2);
    let A = numerador / denominador;
    let delta = Math.atan2(2 * gamma * wf, w0**2 - wf**2);
    
    let theta = A * Math.cos(wf * time - delta);
    let velocidad = -A * wf * Math.sin(wf * time - delta);
    let aceleracion = -A * wf**2 * Math.cos(wf * time - delta);
    
    return [theta, velocidad, aceleracion];
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

    let phi = Math.atan(-velocidadInicial-gamma*posicionInicial);
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
    let factorEscalaAceleracion = 0.1; // Ajusta este valor según sea necesario
    for (let i = 0; i <= pasos; i++) {
        let tiempo = (i / pasos) * duracion;
        let resultado = b === 0 ? calcularForzadoNoAmortiguado(tiempo) : calcularForzadoAmortiguado(tiempo);
        datos.angulo.push({x: tiempo, y: resultado[0]});
        datos.velocidad.push({x: tiempo, y: resultado[1]});
        datos.aceleracion.push({x: tiempo, y: resultado[2] * factorEscalaAceleracion});
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
                data: generarDatosGrafica(10, 200),  // Reducimos a 10 segundos y 200 puntos
                borderColor: 'rgba(168, 248, 8, 0.8)',
                backgroundColor: 'rgba(168, 248, 8, 0.2)',
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
            }, {
                label: 'Velocidad',
                data: generarDatosGrafica(10, 200),
                borderColor: 'rgba(128, 128, 248, 0.8)',
                backgroundColor: 'rgba(128, 128, 248, 0.2)',
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
            }, {
                label: 'Aceleración',
                data: generarDatosGrafica(10, 200),
                borderColor: 'rgba(184, 8, 248, 0.8)',
                backgroundColor: 'rgba(184, 8, 248, 0.2)',
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
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
                    },
                    min: 0,
                    max: 10  // Limitamos el eje X a 10 segundos
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
                    },
                    suggestedMin: -2,
                    suggestedMax: 2,
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
        Math.abs(calcularAmplitud()),
        Math.abs(calcularFrecuenciaVibracion()),
        Math.abs(calcularFrecuenciaVibracion())
    );

    grafica.options.scales.y.min = -maxValor * 1.1;
    grafica.options.scales.y.max = maxValor * 1.1;

    grafica.options.scales.x.min = 0;
    grafica.options.scales.x.max = 100;
    
    grafica.update();
}

/*Analisis de resonancia:*/

function calcularFrecuenciaResonancia() {
    // Para un sistema amortiguado, la frecuencia de resonancia es ligeramente diferente de la frecuencia natural
    let w0 = Math.sqrt(3 * k / m); // Frecuencia natural
    let gamma = (6 * b) / (m * l**2); // Coeficiente de amortiguamiento
    return Math.sqrt(w0**2 - 2*gamma**2);
}

function detectarResonancia() {
    let frecResonancia = calcularFrecuenciaResonancia();
    let tolerancia = 0.05; // 5% de tolerancia

    if (Math.abs(frecuenciaFuerzaExterna - frecResonancia) / frecResonancia < tolerancia) {
        return {
            esResonancia: true,
            frecuenciaResonancia: frecResonancia,
            diferencia: Math.abs(frecuenciaFuerzaExterna - frecResonancia)
        };
    } else {
        return {
            esResonancia: false,
            frecuenciaResonancia: frecResonancia,
            diferencia: Math.abs(frecuenciaFuerzaExterna - frecResonancia)
        };
    }
}

function mostrarInfoResonancia() {
    let infoResonancia = detectarResonancia();
    let textoResonancia = "";

    if (infoResonancia.esResonancia) {
        textoResonancia = `¡RESONANCIA DETECTADA! <br>
            Frecuencia de resonancia: ${infoResonancia.frecuenciaResonancia.toFixed(3)} rad/s <br>
            Diferencia con la frecuencia externa: ${infoResonancia.diferencia.toFixed(3)} rad/s`;
    } else {
        textoResonancia = `Sistema fuera de resonancia <br>
            Frecuencia de resonancia: ${infoResonancia.frecuenciaResonancia.toFixed(3)} rad/s <br>
            Diferencia con la frecuencia externa: ${infoResonancia.diferencia.toFixed(3)} rad/s`;
    }

    document.getElementById('infoResonancia').innerHTML = textoResonancia;
}


/*Funciones para manejar las variables */
function calcularEnergias(posicion, velocidad) {
    let energiaCinetica = 0.5 * m * (l * velocidad)**2;
    let energiaPotencial = 0.5 * k * posicion**2;
    let energiaTotal = energiaCinetica + energiaPotencial;
    return {energiaCinetica, energiaPotencial, energiaTotal};
}

function actualizarVariables() {
    let periodo = 2 * Math.PI / frecuenciaVibracion;
    let energias = calcularEnergias(posicionActual, velocidadActual);
    let amplitud = calcularAmplitud();
    

    document.getElementById('faseInicial').textContent = calcularPhi().toFixed(3) + ' rad';
    document.getElementById('amplitud').textContent = calcularAmplitud().toFixed(3) + ' rad';
    document.getElementById('frecuenciaVibracion').textContent = calcularFrecuenciaVibracion().toFixed(3) + ' rad/s';
    document.getElementById('periodo').textContent = periodo.toFixed(3) + ' s';
    document.getElementById('energiaTotal').textContent = energias.energiaTotal.toFixed(3) + ' J';
    document.getElementById('energiaCinetica').textContent = energias.energiaCinetica.toFixed(3) + ' J';
    document.getElementById('energiaPotencial').textContent = energias.energiaPotencial.toFixed(3) + ' J';

    mostrarInfoResonancia();
}

function actualizarEcuaciones() {
    let w0 = Math.sqrt(3 * k / m);
    let gamma = (6 * b) / (m * l**2);
    let wf = frecuenciaFuerzaExterna;

    // Ecuación diferencial
    document.getElementById('ecuacionDiferencial').innerHTML = 
        `θ'' + ${gamma.toFixed(3)}θ' + ${w0.toFixed(3)}²θ = ${(6*fuerzaExterna/(m*l)).toFixed(3)}cos(${wf.toFixed(3)}t)`;

  
    // Solución homogénea (depende del tipo de amortiguamiento)
    let solucionHomogenea = "";
    if (gamma < w0) {
        let wd = Math.sqrt(w0**2 - gamma**2);
        solucionHomogenea = `A₁e<sup>-${gamma.toFixed(3)}t</sup>cos(${wd.toFixed(3)}t) + A₂e<sup>-${gamma.toFixed(3)}t</sup>sin(${wd.toFixed(3)}t)`;
    } else if (gamma > w0) {
        let r1 = -gamma + Math.sqrt(gamma**2 - w0**2);
        let r2 = -gamma - Math.sqrt(gamma**2 - w0**2);
        solucionHomogenea = `A₁e<sup>${r1.toFixed(3)}t</sup> + A₂e<sup>${r2.toFixed(3)}t</sup>`;
    } else {
        solucionHomogenea = `(A₁ + A₂t)e<sup>-${gamma.toFixed(3)}t</sup>`;
    }
    document.getElementById('solucionHomogenea').innerHTML = solucionHomogenea;
    
    // Solución particular
    if (wf<w0) {
        let numerador = (6 * fuerzaExterna) / (m * l);
        let denominador = Math.sqrt(( wf**2 -w0**2 )**2 + (2 * gamma * wf)**2);    
        let A = numerador / denominador;
        let delta = 0;
        document.getElementById('solucionParticular').innerHTML = 
        `${A.toFixed(3)}cos(${wf.toFixed(3)}t - ${delta.toFixed(3)})`;

    }else if (wf>w0) {
        let numerador = (6 * fuerzaExterna) / (m * l);
        let denominador = Math.sqrt(( w0**2 -wf**2 )**2 + (2 * gamma * wf)**2);
        
        let A = numerador/denominador;
        let delta = Math.PI;
        document.getElementById('solucionParticular').innerHTML = 
        `${A.toFixed(3)}cos(${wf.toFixed(3)}t - ${delta})`;


        
    }    
    let numerador = (6 * fuerzaExterna) / (m * l);
    let denominador = Math.sqrt(( wf**2 -w0**2 )**2 + (2 * gamma * wf)**2);


    let A = numerador / denominador;
    let delta = Math.atan2(2 * gamma * wf, w0**2 - wf**2);
    document.getElementById('solucionParticular').innerHTML = 
        `${A.toFixed(3)}cos(${wf.toFixed(3)}t - ${delta})`;

    // Solución completa
    document.getElementById('solucionCompleta').innerHTML = 
        `θ(t) = ${solucionHomogenea} + ${A.toFixed(3)}cos(${wf.toFixed(3)}t - ${delta.toFixed(3)})`;
}
