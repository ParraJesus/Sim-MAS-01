const updateDataButton = document.getElementById("updateDataButton");
const startAnimButton = document.getElementById("startAnimButton");
let isAnimationPlaying = false;

//  inicializa los sliders a conveniencia, recibe el id del range y del texto mostrado en pantalla, además de un máximo y un mínimo para los valores iniciales
function initializeSlider(sliderId, inputId, textId, min, max, initialValue, step) 
{
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);

    slider.min = min;
    slider.max = max;
    slider.value = initialValue;
    slider.step = step;
    input.min = min;
    input.max = max;
    input.value = initialValue;
    input.step = step;

    text.textContent = slider.value;

    slider.addEventListener("input", function() {
        input.value = slider.value;
        text.textContent = slider.value;
        updateDataButton.style.backgroundColor = "#e09363";
    });

    input.addEventListener("input", function() {
        if (input.value < min) input.value = min;
        if (input.value > max) input.value = max;
        slider.value = input.value;
        text.textContent = input.value;
        updateDataButton.style.backgroundColor = "#e09363";
    });
}

//  almacena en una variable la información de los input range
function getSliderData() {
    const data = {
        masa: document.getElementById("mass_input_value").value,
        l: document.getElementById("length_input_value").value,
        k: document.getElementById("k_input_value").value,
        phi: document.getElementById("phase_input_value").value,
        inclinacionInicial: document.getElementById("initialInclination_input_value").value
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
initializeSlider("mass_range_value", "mass_input_value", "mass_range_text", 0, 50, 5, 1);
initializeSlider("length_range_value", "length_input_value", "length_range_text", 1, 20, 20, 1);
initializeSlider("k_range_value", "k_input_value", "k_range_text", 0, 1000, 10, 1);
initializeSlider("phase_range_value", "phase_input_value", "phase_range_text", 0, 6.28319, 0, 0.01);
initializeSlider("initialInclination_range_value", "initialInclination_input_value", "initialInclination_range_text", 0, 0.4, 0, 0.01);
updateDataButton.addEventListener("click", getSliderData);
startAnimButton.addEventListener("click", startAnim);