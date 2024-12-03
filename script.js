// script.js

// Leer y procesar el archivo de colores
fetch("colornames.txt")
    .then(res => res.text())
    .then(text => {
        const colors = text.split("\n").map(line => {
            const elements = line.split(",");
            return { name: elements[0], color: elements[1] };
        });

        const nameColors = colors.map(c => ({ title: c.name }));

        // Configurar el buscador
        $('.ui.search').search({
            source: nameColors,
            onSelect: result => showElement(result, colors),
            onSearchQuery: query => {
                createElements(colors.slice(0, 20));
            }
        });

        // Crear los elementos iniciales
        createElements(colors.slice(0, 20));

        // Random color
        $("#randomBtn").on("click", () => {
            const numeroElegido = elegirNumeroAlAzar(colors);
            elegirNumeroAlAzar(colors);
            showElement(numeroElegido, colors);
            showModal(numeroElegido);
        })
        // Configurar el scroll infinito
        let maxElements = 20;
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                maxElements += 20;
                createElements(colors.slice(0, maxElements));
            }
        });
    })
    .catch(error => console.error("Error loading color data:", error));

// Crear elementos en la tabla
function createElements(elements) {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    elements.forEach(element => {
        const tr = document.createElement("tr");
        tr.classList.add("trs");
        tr.style.backgroundColor = element.color;

        const tdName = document.createElement("td");
        tdName.textContent = element.name;
        tdName.classList.add("color-modal");

        const tdColor = document.createElement("td");
        tdColor.textContent = element.color;
        tdColor.classList.add("color-value");

        tr.appendChild(tdName);
        tr.appendChild(tdColor);
        tbody.appendChild(tr);

        tr.addEventListener("click", () => showModal(element));
    });
}

// Mostrar un elemento seleccionado
function showElement(result, colors) {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    const element = colors.find(color => color.name === result.title);
    if (element) {
        const tr = document.createElement("tr");
        tr.classList.add("trs");
        tr.style.backgroundColor = element.color;

        const tdName = document.createElement("td");
        tdName.textContent = element.name;
        tdName.classList.add("color-modal");

        const tdColor = document.createElement("td");
        tdColor.textContent = element.color;
        tdColor.classList.add("color-value");

        tr.appendChild(tdName);
        tr.appendChild(tdColor);
        tbody.appendChild(tr);

        tr.addEventListener("click", () => showModal(element));
    }
}

// Mostrar el modal con detalles del color
function showModal(element) {
    $('.ui.basic.modal').modal('show');
    $('.ui.basic.modal').css("backgroundColor", element.color);
    $("#heading").text(element.name);
    $("#hex").text("Hex:  " + element.color);
    $("body").css("backgroundColor", element.color);
    const elementColor = element.color;
    $(".copy.icon").on("click", () => {
        copiarAlPortapapeles(elementColor);
    });
    $("#copied").text("Copiar");
}

function elegirNumeroAlAzar(array) {
    const indiceAleatorio = Math.floor(Math.random() * array.length);
    return array[indiceAleatorio];
}

function copiarAlPortapapeles(texto) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(texto)
            .then(() => {
                $("#copied").text("Copiado!");
            })
            .catch(err => {
                console.error('Error al copiar al portapapeles: ', err);
            });
    }
}

