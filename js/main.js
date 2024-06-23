const API_KEY = '2e49aa69famsh9cdb61f3637fdffp170c5ejsnfa8d6289ab6c';
const API_HOST = 'uk-supermarkets-product-pricing.p.rapidapi.com';

const productos = {
    "aceite": "5449000130389",
    "fideos": "1234567890123",
    "arroz": "7891011121314",
    "harina": "1617181920212",
    "avena": "2324252627283",
    "atún": "3456789012345",
    "sal": "4567890123456",
    "gelatina": "5678901234567",
    "miel": "6789012345678",
    "té": "7890123456789",
    "café": "8901234567890",
    "azúcar": "9012345678901",
    "cereales": "1234567890111",
    "chocolate": "2345678901222",
    "vino": "3456789012333",
    "gin": "4567890123444",
    "pan": "5678901234555",
    "leche": "6789012345666",
    "yogur": "7890123456777",
    "huevos": "8901234567888",
    "queso": "9012345678999",
    "manzanas": "1123456789000",
    "papas": "2234567890111",
    "tomates": "3345678901222",
    "zanahorias": "4456789012333",
    "pollo": "5567890123444"
};

async function obtenerDatosProducto(barcode) {
    const url = `https://${API_HOST}/product_prices_stores?barcode=${barcode}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (data && data.length > 0) {
            return data;
        } else {
            throw new Error('No se encontraron datos para el código de barras proporcionado.');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        return null;
    }
}

function normalizarProducto(producto) {
    producto = producto.toLowerCase();
    if (producto.endsWith('s')) {
        producto = producto.slice(0, -1);
    }
    return producto;
}

function encontrarPrecioMasBajo(datos) {
    let supermercadoMasBarato = "";
    let precioMasBajo = Infinity;
    const precios = [];

    datos.forEach(item => {
        const { store, price } = item;
        const precio = parseFloat(price);
        precios.push({ supermercado: store, precio });
        if (precio < precioMasBajo) {
            supermercadoMasBarato = store;
            precioMasBajo = precio;
        }
    });

    return {
        supermercadoMasBarato,
        precioMasBajo,
        precios
    };
}

function mostrarResultado(resultado, producto) {
    const mensajeDiv = document.getElementById("mensaje");
    let mensaje = "";

    if (resultado.supermercadoMasBarato) {
        mensaje += `El precio más bajo para ${producto} se encuentra en ${resultado.supermercadoMasBarato} y es de $${resultado.precioMasBajo.toFixed(2)}.\n\nComparación de precios:\n`;
        resultado.precios.forEach(precio => {
            mensaje += `${precio.supermercado}: $${precio.precio.toFixed(2)}\n`;
        });
    } else {
        mensaje += `Lo siento, no se encontró información para ${producto} en ningún supermercado.`;
    }

    mensajeDiv.textContent = mensaje;
    document.getElementById("resultado").style.display = "block";
}

document.getElementById("compararButton").addEventListener("click", async function() {
    let producto = document.getElementById("productoInput").value;
    if (!producto) {
        document.getElementById("mensaje").textContent = "No ingresaste ningún producto.";
        document.getElementById("resultado").style.display = "block";
        return;
    }

    producto = normalizarProducto(producto);
    const barcode = productos[producto];
    if (!barcode) {
        document.getElementById("mensaje").textContent = "Producto no encontrado.";
        document.getElementById("resultado").style.display = "block";
        return;
    }

    const datosProducto = await obtenerDatosProducto(barcode);
    if (datosProducto) {
        const resultado = encontrarPrecioMasBajo(datosProducto);
        mostrarResultado(resultado, producto);
        localStorage.setItem('ultimaComparacion', JSON.stringify({ producto, resultado }));
    } else {
        document.getElementById("mensaje").textContent = "Error al obtener los datos del producto.";
        document.getElementById("resultado").style.display = "block";
    }
});

document.getElementById("productoInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.getElementById("compararButton").click();
    }
});

window.addEventListener("load", function() {
    const ultimaComparacion = JSON.parse(localStorage.getItem('ultimaComparacion'));
    if (ultimaComparacion) {
        const { producto, resultado } = ultimaComparacion;
        mostrarResultado(resultado, producto);
    }
});