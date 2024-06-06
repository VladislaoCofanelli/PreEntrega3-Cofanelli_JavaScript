const preciosSupermercados = {
    "Carrefour": {
        aceite: 1649,
        fideos: 1350,
        arroz: 1370,
        harina: 805,
        avena: 2895,
        atun: 1791,
        sal: 885,
        gelatina: 535,
        miel: 2861.80,
        te: 1299,
        cafe: 2700,
        azucar: 940,
        cereales: 3085,
        chocolate: 1235,
        vino: 3219.33,
        gin: 9500,
        pan: 480,
        leche: 1300,
        yogurt: 890,
        huevos: 3400,
        queso: 2150,
        manzanas: 700,
        papas: 500,
        tomates: 900,
        zanahorias: 600,
        pollo: 1500
    },
    "Walmart": {
        aceite: 1856,
        fideos: 741,
        arroz: 1999,
        harina: 1389,
        avena: 3409.52,
        atun: 1972,
        sal: 593,
        gelatina: 399,
        miel: 5189.18,
        te: 1499.25,
        cafe: 2123.23,
        azucar: 1149,
        cereales: 1021,
        chocolate: 3207,
        vino: 3600,
        gin: 7124.25,
        pan: 420,
        leche: 1350,
        yogurt: 870,
        huevos: 3200,
        queso: 2100,
        manzanas: 750,
        papas: 550,
        tomates: 950,
        zanahorias: 620,
        pollo: 1550
    },
    "Disco": {
        aceite: 2752,
        fideos: 1367,
        arroz: 1600,
        harina: 840,
        avena: 3150,
        atun: 3689,
        sal: 1025,
        gelatina: 786,
        miel: 5600,
        te: 1344,
        cafe: 4600,
        azucar: 1337,
        cereales: 1050,
        chocolate: 2105.35,
        vino: 4200,
        gin: 29050,
        pan: 550,
        leche: 1400,
        yogurt: 920,
        huevos: 3500,
        queso: 2250,
        manzanas: 720,
        papas: 520,
        tomates: 930,
        zanahorias: 630,
        pollo: 1520
    }
};

function normalizarProducto(producto) {
    producto = producto.toLowerCase();
    if (producto.endsWith('s')) {
        producto = producto.slice(0, -1);
    }
    return producto;
}

function encontrarPrecioMasBajo(producto) {
    let supermercadoMasBarato = "";
    let precioMasBajo = Infinity;
    const precios = [];

    for (const supermercado in preciosSupermercados) {
        const precio = preciosSupermercados[supermercado][producto];
        if (precio !== undefined) {
            precios.push({ supermercado, precio });
            if (precio < precioMasBajo) {
                supermercadoMasBarato = supermercado;
                precioMasBajo = precio;
            }
        }
    }

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

document.getElementById("compararButton").addEventListener("click", function() {
    let producto = document.getElementById("productoInput").value;
    if (!producto) {
        document.getElementById("mensaje").textContent = "No ingresaste ningún producto.";
        document.getElementById("resultado").style.display = "block";
        return;
    }

    producto = normalizarProducto(producto);
    const resultado = encontrarPrecioMasBajo(producto);
    mostrarResultado(resultado, producto);

    localStorage.setItem('ultimaComparacion', JSON.stringify({ producto, resultado }));
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