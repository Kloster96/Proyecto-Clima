const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);

});

function buscarClima(e) {
    e.preventDefault();


    // Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        //Hubo un eror
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    // Consultar a la API
    consultarAPI(ciudad, pais);

}

function mostrarError(message) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        // Crear Alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3',
        'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${message}</span>
        `;
        container.appendChild(alerta);

        // Se elimine esa alerta despujes de 5 seg
        setTimeout(() => {
            alerta.remove();
        },5000);
    }
}

function consultarAPI(ciudad, pais){
    const appId = 'afe18903621181e909fd0d8604250637';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    Spinner(); // Muesta el spinner
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datos => {

            console.log(datos)

            limpiarHTML(); // Limpiar el HTML previo
            console.log(datos);
            if(datos.cod === "404"){
                mostrarError('Ciudad no encontrada');
                return;
            }
            // Imprimir la respuesta en el HTML
            mostrarClima(datos);
        } )    
}
function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min  } } = datos;

    const  centigrados = kevilAcentigrados(temp);
    const min = kevilAcentigrados(temp_min);
    const max = kevilAcentigrados(temp_max);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl')

    const tempMax = document.createElement("p");
    tempMax.innerHTML = `Temp Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement("p");
    tempMin.innerHTML = `Temp Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    

    resultado.appendChild(resultadoDiv);
}

const kevilAcentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-folding-cube');

    divSpinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(divSpinner);
}