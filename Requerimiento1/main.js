window.onload = function() {
    btnajax.onclick = enviarPeticionAsincrona;
}

//------------------------------------Funciones que involucra a .json------------------------------------------
function enviarPeticionAsincrona() {
    let htr1 = new XMLHttpRequest()
    htr1.open('GET', 'datopizzas.json', true)
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

function procesarRespuesta(jsonDoc) {
    //Con esto ya se genera html al usar el boton
    //Se rellena con el bucle for, va a formar los botones radio
    var objetoJson = JSON.parse(jsonDoc);
    objetoCliente = objetoJson.PIZZA.CLIENTE;
    arrayTamanos = objetoJson.PIZZA.TAMANO;
    arrayExtras = objetoJson.PIZZA.EXTRAS;
    // Obtener todas los nombres (ojo NO sus valores) de CLIENTE

    var keysCliente = Object.keys(objetoCliente);
    var stringDatos = "<table>";
    for (i = 0; i < keysCliente.length; i++) {
        stringDatos += "<tr><td>"+keysCliente[i]+" :</td>"+"<td><input type=text placeholder='"+objetoCliente[keysCliente[i]]+"'></td>"+"</tr>"
    }
    stringDatos += "</table>";

    var stringTamaño = "<table>"; //Aquí se rellena el contenido de los botones
    for(i = 0;  i<arrayTamanos.length; i++) {
        stringTamaño += "<tr><td><input type=radio></td>"+"<td>"+arrayTamanos[i]["@id"]+"</td>"+"<td>("+arrayTamanos[i].PRECIO_BASE+" €)</td>"+"<tr>";
     }
     stringTamaño += "</table>";

    //Aqui se rellenan los checkboxes
    var stringIngr = "<table>";
    for(i=0; i <arrayExtras.length; i++) {
        stringIngr += "<tr><td><input type=checkbox></td>"+"<td>"+arrayExtras[i]["@id"]+"</td>"+"<td>+"+arrayExtras[i].PRECIO+" €</td><tr>" ;
    }
    stringIngr += "</table>"
    
    //BOTONES RESETEO
    var btnWipe = "<input type='reset' value='Resetear formulario'></input>";
    var textoDeLaPizza = `
        <fieldset id="fieldsetDatosDeEnvio">
            <legend>Introduzca sus datos: </legend>
               ` + stringDatos + `
        </fieldset>
        <br><br>
        <fieldset>
            <legend>Características de la pizza</legend>
            Tamaño
            <br>
            `+stringTamaño+`
            Extras (elegir al menos uno)
               <br>
               `+stringIngr+`
       </fieldset><br><br>
       `+ btnWipe;
       document.getElementById("formpizzapedido").innerHTML = textoDeLaPizza;
} 





















