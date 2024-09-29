const updateDataButton = document.getElementById("updateDataButton");
const startAnimButton = document.getElementById("startAnimButton");
let isAnimationPlaying = false;

//  inicializa los sliders a conveniencia, recibe el id del range y del texto mostrado en pantalla, además de un máximo y un mínimo para los valores iniciales
function initializeSlider(sliderId, textId, min, max, initialValue, step) 
{
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(textId);

    slider.min = min;
    slider.max = max;
    slider.step= step;
    slider.value = initialValue;

    text.textContent = slider.value;

    slider.addEventListener("input", function() { text.textContent = slider.value;
        updateDataButton.style.backgroundColor = "#e09363";
    });
}

//  almacena en una variable la información de los input range
function getSliderData() {
    const data = {
        masa: document.getElementById("mass_range_value").value,
        l: document.getElementById("length_range_value").value,
        k: document.getElementById("k_range_value").value,
        posicionInicial: document.getElementById("initialPos_range_value").value,
        velocidadInicial: document.getElementById("initialVel_range_value").value,
        b: document.getElementById("b_range_value").value
    };
    //  pasar esta información al otro script
    const onSlidersDataUpdated = new CustomEvent('slidersDataUpdated', {
        detail: data
    });

    updateDataButton.style.backgroundColor = "#7898a8";

    // dispara el evento
    document.dispatchEvent(onSlidersDataUpdated);
}

function startAnim()
{
    const onStartAnimation = new CustomEvent('startAnimation');

    if(isAnimationPlaying) {
        startAnimButton.innerHTML = "Reanudar Animación";
        isAnimationPlaying = false;
    }
    else {
        startAnimButton.innerHTML = "Pausar Animación";
        isAnimationPlaying = true;
    }

    document.dispatchEvent(onStartAnimation);
}

//  se inicializan los ranges con su min, max y valor inicial
initializeSlider("mass_range_value", "mass_range_text", 1, 50, 5, 1); 
initializeSlider("length_range_value", "length_range_text", 1, 20, 20, 1);
initializeSlider("k_range_value", "k_range_text", 0, 100, 10, 1);
initializeSlider("initialPos_range_value", "initialPos_range_text", parseFloat(-(Math.PI / 12).toFixed(2)), parseFloat((Math.PI / 12).toFixed(2)), 0.00, 0.01);
initializeSlider("initialVel_range_value", "initialVel_range_text", parseFloat(-(Math.PI / 12).toFixed(2)), parseFloat((Math.PI / 12).toFixed(2)), 0.00, 0.01);
initializeSlider("b_range_value", "b_range_text", 0, 50, 5, 0.01); 

updateDataButton.addEventListener("click", getSliderData);
startAnimButton.addEventListener("click", startAnim);