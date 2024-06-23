const url = 'https://uk-supermarkets-product-pricing.p.rapidapi.com/product_prices_stores?barcode=5449000130389';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '2e49aa69famsh9cdb61f3637fdffp170c5ejsnfa8d6289ab6c',
        'x-rapidapi-host': 'uk-supermarkets-product-pricing.p.rapidapi.com'
    }
};

async function obtenerPreciosDesdeAPI() {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function compararPreciosDesdeAPI(producto) {
    const datosAPI = await obtenerPreciosDesdeAPI();
    if (!datosAPI) {
        mostrarError();
        return;
    }

    const precios = {};

    datosAPI.stores.forEach(store => {
        precios[store.store_name] = parseFloat(store.price);
    });

    const resultado = encontrarPrecioMasBajoDesdeAPI(producto, precios);
    mostrarResultado(resultado, producto);
}

function encontrarPrecioMasBajoDesdeAPI(producto, precios) {
    let supermercadoMasBarato = "";
    let precioMasBajo = Infinity;
    const preciosArray = [];

    for (const supermercado in precios) {
        const precio = precios[supermercado];
        preciosArray.push({ supermercado, precio });
        if (precio < precioMasBajo) {
            supermercadoMasBarato = supermercado;
            precioMasBajo = precio;
        }
    }

    return {
        supermercadoMasBarato,
        precioMasBajo,
        precios: preciosArray
    };
}

function mostrarResultado(resultado, producto) {
    const mensajeDiv = document.getElementById("mensaje");
    let mensaje = "";

    if (resultado.supermercadoMasBarato) {
        mensaje += `El precio más bajo para ${producto} se encuentra en ${resultado.supermercadoMasBarato} y es de £${resultado.precioMasBajo.toFixed(2)}.\n\nComparación de precios:\n`;
        resultado.precios.forEach(precio => {
            mensaje += `${precio.supermercado}: £${precio.precio.toFixed(2)}\n`;
        });
    } else {
        mensaje += `Lo siento, no se encontró información para ${producto} en ningún supermercado.`;
    }

    mensajeDiv.textContent = mensaje;
    document.getElementById("resultado").style.display = "block";
}

document.getElementById("compararButton").addEventListener("click", function() {
    let producto = document.getElementById("productoInput").value.trim();
    if (!producto) {
        document.getElementById("mensaje").textContent = "No ingresaste ningún producto.";
        document.getElementById("resultado").style.display = "block";
        return;
    }

    compararPreciosDesdeAPI(producto);
});

document.getElementById("productoInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.getElementById("compararButton").click();
    }
});