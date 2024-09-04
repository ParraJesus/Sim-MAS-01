//  inicializa los sliders a conveniencia, recibe el id del range y del texto mostrado en pantalla, además de un máximo y un mínimo para los valores iniciales
function initializeSlider(sliderId, textId, min, max, initialValue, step) 
{
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(textId);

    slider.min = min;
    slider.max = max;
    slider.value = initialValue;
    slider.step= step;

    text.textContent = slider.value;

    slider.addEventListener("input", function() { text.textContent = slider.value; });
}

//  almacena en una variable la información de los input range
function getSliderData() {
    const data = {
        masa: document.getElementById("mass_range_value").value,
        l: document.getElementById("length_range_value").value,
        k: document.getElementById("k_range_value").value,
        phi: document.getElementById("phase_range_value").value,
        inclinacionInicial: document.getElementById("initialInclination_range_value").value
    };

    //  pasar esta información al otro script
    const onSlidersDataUpdated = new CustomEvent('slidersDataUpdated', {
        detail: data
    });

    // dispara el evento
    document.dispatchEvent(onSlidersDataUpdated);
}

function startAnim()
{
    const onStartAnimation = new CustomEvent('startAnimation');
    document.dispatchEvent(onStartAnimation);
}

//  se inicializan los ranges con su min, max y valor inicial
initializeSlider("mass_range_value", "mass_range_text", 0, 50, 5, 1); 
initializeSlider("length_range_value", "length_range_text", 1, 20, 20, 1);
initializeSlider("k_range_value", "k_range_text", 0, 20, 10, 1);
initializeSlider("phase_range_value", "phase_range_text", 0, 6.28319, 0, 0.01);
initializeSlider("initialInclination_range_value", "initialInclination_range_text", 0, 0.4, 0, 0.01);

document.getElementById("updateDataButton").addEventListener("click", getSliderData);
document.getElementById("startAnimButton").addEventListener("click", startAnim);