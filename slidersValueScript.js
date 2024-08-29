/* Inicializa los sliders a conveniencia, recibe el id del range y del texto mostrado en pantalla, además de un máximo y un mínimo para los valores iniciales */
function initializeSlider(sliderId, textId, min, max, initialValue) 
{
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(textId);

    slider.min = min;
    slider.max = max;
    slider.value = initialValue;

    text.textContent = slider.value;

    slider.addEventListener("input", function() { text.textContent = slider.value; });
}

/* Almacena en una variable la información de los input range */
function getSliderData() {
    const data = {
        slider1: document.getElementById("slider_data_1").value,
        slider2: document.getElementById("slider_data_2").value
    };

    alert("Datos almacenados:" + ", " + data["slider1"] + ", " + data["slider2"]);
}

initializeSlider("slider_data_1", "text_data_1", 0, 100, 1);
initializeSlider("slider_data_2", "text_data_2", 0, 100, 1);

document.getElementById("startButton").addEventListener("click", getSliderData);