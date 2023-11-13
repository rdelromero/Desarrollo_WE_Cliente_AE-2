window.onload = function() {
    //No vale poner but1.onclick = enviarPeticionAsincrona();
    but1.onclick = enviarPeticionAsincrona;
    but2.onclick = datosTodosTamanos;
    but3.onclick = function() {
        datosTamano(stringDelLabelDelRadioSeleccionado());
    };
    but4.onclick = calcularPrecio;
    //Una vez está visible una ventana modal, pinchar sobre ella para que desaparezca
    divModal1.onclick = function() {
        divModal1.style.display = "none";
    }
    divModal2.onclick = function() {
        divModal2.style.display = "none";
    }
}

//------------------------Funciones relacionadas solo con el código <body> del .html----------------------------------
//Devuelve un String que se corresponde con el contenido del texto de la label asociado con el radiobutton seleccionado
//En caso de no marcar ningún checkbox no devuelve nada
function stringDelLabelDelRadioSeleccionado() {
    let tamanoSeleccionado = document.querySelector('input[name="tamano"]:checked');
    if (tamanoSeleccionado) {
        return document.querySelector('label[for="'+tamanoSeleccionado.id+'"]').textContent;
    }
}

//Devuelve un array de Strings que se corresponden con el contenido del texto de las label asociadas con los checkbox seleccionados
function arrayDeStringDeLosLabelDeLosCheckboxSeleccionados() {
    let extrasSeleccionados = document.querySelectorAll('input[name="ingredientesExtras"]:checked');
    let arrayDeStringDeExtrasSeleccionados = [];
    for (let i = 0; i < extrasSeleccionados.length; i++) {
        arrayDeStringDeExtrasSeleccionados[i] = document.querySelector('label[for="' + extrasSeleccionados[i].id + '"]').textContent;
    }
    return arrayDeStringDeExtrasSeleccionados;
}

//------------------------------------Funciones que involucra a .json------------------------------------------

//Estableciendo la conexión con el servidor virtual
function enviarPeticionAsincrona() {
    let htr1 = new XMLHttpRequest()
    htr1.open('GET', 'archivojson.json', true)
    htr1.send(null)
    htr1.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                procesarRespuesta(this.responseText); // Obtener el valor en XML
            }
            else {
                alert("ZASCA!");
            }
        }
    }
}

//Obtención del array del tamaño de pizza y del array de los ingredientes extra presentes en el .json
//Se imprime mensaje si efectivamente la conexión se ha establecido con éxito
var arrayTamanos;
function procesarRespuesta(jsonDoc) {
    var objetoJson = JSON.parse(jsonDoc);
    //Si ponenos var arrayNovelas = ... no funcionará
    arrayTamanos = objetoJson.PIZZA.TAMANO;
    arrayExtras = objetoJson.PIZZA.EXTRAS;
    div1.innerHTML = "Conexión establecida";

    //Cogemos del .json cada tamaño de pizza y su precio
    var labelDeRadioTamano =[]; var tdTextContent = [];
    for (i=0; i<3;  i++) {
        let radioId ="radioTamano"+i;
        labelDeRadioTamano[i] = document.querySelector('label[for="'+document.getElementById(radioId).id+'"]');
        labelDeRadioTamano[i].textContent = arrayTamanos[i]["@id"];
        let tdId ="tdPrecioTamano"+i;
        tdTextContent[i] = document.getElementById(tdId);
        tdTextContent[i].textContent=arrayTamanos[i].PRECIO_BASE+" €";
    }
    //Cogemos del .json cada ingrediente extra y su precio
    var labelDeCheckboxExtra =[]; var tdTextContent = [];
    for (i=0; i<4;  i++) {
        let radioId ="checkboxExtra"+i;
        labelDeCheckboxExtra[i] = document.querySelector('label[for="'+document.getElementById(radioId).id+'"]');
        labelDeCheckboxExtra[i].textContent = arrayExtras[i]["@id"];
        let tdId ="tdPrecioExtra"+i;
        tdTextContent[i] = document.getElementById(tdId);
        tdTextContent[i].textContent="+ "+arrayExtras[i].PRECIO+" €";
    }
    //Y los hacemos visibles en el navegador
    fieldsetCaracteristicas.style.display = "inline-block";
    fieldsetCantidad.style.display = "inline-block";
    divProcesarPedido.style.display = "block";
}

//Función que hace visible una ventana modal con los datos de todos los tamaños de pizza
function datosTodosTamanos() {
    //Hacemos que aparezca la ventana modal
    divModal1.style.display = "block";
    var tabla1 = "<table><tr><th>Nombre</th><th>Precio (€)</th><th>Diámetro (cm)</th></tr>";
    for (let tamano of arrayTamanos) {
        tabla1 += "<tr><td>"+tamano["@id"]+"</td>"+
        "<td>"+tamano.PRECIO_BASE+"</td>"+
        "<td>"+tamano.DIAMETRO + "</td>"+ 
        "</tr>";
    }
    tabla1 += "</table>"
    //Insertamos en su hijo divModalContent1 la tabla
    divModalContent1.innerHTML = tabla1;
}

//Función que hace visible una ventana modal con los datos del tamaño de pizza seleccionado
function datosTamano(nombretamano) {
    divModal2.style.display = "block";
    let tabla1 = "<table><tr><th>Nombre</th><th>Precio (€)</th><th>Diámetro (cm)</th></tr>";
    if (nombretamano) {}
    for (let tamano of arrayTamanos) {
        if (tamano["@id"] == nombretamano) {
            tabla1 += "<tr>"+
            "<td>"+tamano["@id"]+"</td>"+
            "<td>"+tamano.PRECIO_BASE+"</td>"+
            "<td>"+tamano.DIAMETRO + "</td>"+ 
            "</tr>";
            tabla1 += "</table>"
            //return div3.innerHTML = tabla1;
            return divModalContent2.innerHTML = tabla1;
        }
    }
    divModalContent2.innerHTML = "No ha seleccionado ningún tamaño.";
}

//Función que calcula el precio de la pizza, teniendo en cuenta tamaño, ingredientes extra y número de pizzas iguales pedidas
function calcularPrecio() {
    const stringDelTamanoSeleccionado = stringDelLabelDelRadioSeleccionado();
    const arrayDeStringDeExtrasSeleccionados = arrayDeStringDeLosLabelDeLosCheckboxSeleccionados();

    //Si no se ha seleccionado ningún tamaño sale una alerta y no deja procesar pedido
    if (!stringDelTamanoSeleccionado) {
        alert('Debe seleccionar un tamaño de pizza.');
        return;
    }

    //Si no se ha seleccionado ningún ingrediente extra sale una alerta y no deja procesar pedido
    if (arrayDeStringDeExtrasSeleccionados.length === 0) {
        alert('Debe seleccionar al menos un ingrediente extra.');
        return;
    }
    
    //Calcular el precio base de la pizza (solo influye el tamaño)
    let precioBase=0;
    for (let tamano of arrayTamanos) {
        if (tamano["@id"]==stringDelTamanoSeleccionado)
            precioBase = tamano.PRECIO_BASE;
    }

    //Calcular el precio de los ingredientes extras
    let precioExtras = 0;
    for (extra of arrayExtras) {
        for (extraSeleccionado of arrayDeStringDeExtrasSeleccionados) {
            if (extra["@id"]==extraSeleccionado)
            precioExtras += extra.PRECIO;
        }
    }

    //Calcular el precio total, precio pizza * cantidad de pizzas iguales
    let precioTotal = (precioBase + precioExtras)*inputnumber1.value;
    //Precio redondeado a la centésima
    let precioTotalRedondeado = Math.round(precioTotal*100)/100;;
    let precioTotalRedondeadoEntera = Math.floor(precioTotalRedondeado);
    let precioTotalRedondeadoDecimal = Math.round((precioTotalRedondeado-precioTotalRedondeadoEntera)*100);
    
    //Mostrar el precio total en formato anglosajón
    //document.getElementById('precio').textContent = precioTotalRedondeado;
    //Mostrar el precio total en la página en formato español
    parrafoprecio.textContent = precioTotalRedondeadoEntera+","+precioTotalRedondeadoDecimal+' €';
    //Hacemos aparecer el divImporte que originalmente estaba oculto;
    divImporte.style.display = 'block';
}
