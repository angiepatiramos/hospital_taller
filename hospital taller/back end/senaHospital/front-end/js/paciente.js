var url = "http://localhost:8080/api/v1/paciente/";

function listaPaciente() {

    var capturarFiltro = document.getElementById("Search").value;
    var urlPaciente=url;
    if (capturarFiltro!=""){
        urlPaciente+="busquedafiltro/"+capturarFiltro;
  }
    $.ajax({
        url: urlPaciente,
        type: "GET",
        success: function (result) {
            console.log(result);

            var listaPaciente = document.getElementById("listaPaciente");

            listaPaciente.innerHTML = "";

            for (var i = 0; i < result.length; i++) {
                let trRegistro = document.createElement("tr");
                let celdaID = document.createElement("td");
                let celdaTipo_Documento = document.createElement("td");
                let celdaNumero_Documento = document.createElement("td");
                let celdaPrimer_name = document.createElement("td");
                let celdaSegundo_name = document.createElement("td");
                let celdaPrimer_apellido = document.createElement("td");
                let celdaSegundo_apellido = document.createElement("td");
                let celdaCorreo = document.createElement("td");
                let celdaTelefono = document.createElement("td");
                let celdaNombre_contacto = document.createElement("td");
                let celdaTelefono_contacto = document.createElement("td");
                let celdaEstado = document.createElement("td");
                let celdaEditar = document.createElement("td");
                let celdaEliminar = document.createElement("td");

                celdaID.innerText = result[i]["id"];
                celdaTipo_Documento.innerText = result[i]["tipo_documento"];
                celdaNumero_Documento.innerText = result[i]["numero_documento"];
                celdaPrimer_name.innerText = result[i]["primer_name"] || "";
                celdaSegundo_name.innerText = result[i]["segundo_name"] || "";
                celdaPrimer_apellido.innerText = result[i]["primer_apellido"] || "";
                celdaSegundo_apellido.innerText = result[i]["segundo_apellido"] || "";
                celdaCorreo.innerText = result[i]["correo"];
                celdaTelefono.innerText = result[i]["telefono"];
                celdaNombre_contacto.innerText = result[i]["nombre_contacto"];
                celdaTelefono_contacto.innerText = result[i]["telefono_contacto"];
                celdaEstado.innerText = result[i]["estado"];

                // Agregar el botón "Eliminar"
                let botonEliminar = document.createElement("button");
                botonEliminar.className = "boton-eliminar";
                botonEliminar.textContent = "Eliminar";

                botonEliminar.onclick = (function (id) {
                    return function () {
                        eliminarPaciente(id);
                    };
                })(result[i]["id"]);

                celdaEliminar.appendChild(botonEliminar);

                trRegistro.appendChild(celdaID);
                trRegistro.appendChild(celdaTipo_Documento);
                trRegistro.appendChild(celdaNumero_Documento);
                trRegistro.appendChild(celdaPrimer_name);
                trRegistro.appendChild(celdaSegundo_name);
                trRegistro.appendChild(celdaPrimer_apellido);
                trRegistro.appendChild(celdaSegundo_apellido);
                trRegistro.appendChild(celdaCorreo);
                trRegistro.appendChild(celdaTelefono);
                trRegistro.appendChild(celdaNombre_contacto);
                trRegistro.appendChild(celdaTelefono_contacto);
                trRegistro.appendChild(celdaEstado);

                trRegistro.appendChild(celdaEliminar);

                listaPaciente.appendChild(trRegistro);
            }
        },
        error: function (error) {
            alert("Error en la petición " + error);
        }
    });
}



// Función para eliminar un paciente
function eliminarPaciente(idPaciente) {
    // Mostrar un cuadro de confirmación utilizando SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        // Si el usuario confirma la acción
        if (result.isConfirmed) {
            // Realizar una solicitud AJAX para eliminar el paciente
            $.ajax({
                url: url + idPaciente, // La URL puede depender de la configuración en el código
                type: "DELETE",
                success: function (result) {
                    // En caso de éxito, actualizar la lista de pacientes
                    listaPaciente();
                    // Mostrar un mensaje de éxito utilizando SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Paciente eliminado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error: function (error) {
                    // En caso de error, mostrar un mensaje de error personalizado
                    if (error.status === 400) {
                        // El código 400 puede indicar que el paciente está siendo utilizado
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se puede eliminar porque ya está siendo utilizado en un ingreso',
                            footer: '<a href="#">¿Por qué tengo este problema?</a>'
                        });
                    } else {
                        // En caso de otros errores, mostrar el mensaje de error genérico
                        console.error("Error al eliminar Paciente:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se puede eliminar porque ya está siendo utilizado en un ingreso',
                            footer: '<a href="./listaIngreso.html">ir a listado de ingresos</a>'
                        });
                    }
                }
            });
        }
    });
}

function registrarPaciente() {
    let formData = {
        "tipo_documento": document.getElementById("tipo_documento").value,
        "numero_documento": document.getElementById("numero_documento").value,
        "primer_name": document.getElementById("primer_name").value,
        "segundo_name": document.getElementById("segundo_name").value,
        "primer_apellido": document.getElementById("primer_apellido").value,
        "segundo_apellido": document.getElementById("segundo_apellido").value,
        "telefono": document.getElementById("telefono").value,
        "correo": document.getElementById("correo").value,
        "nombre_contacto": document.getElementById("nombre_contacto").value,
        "telefono_contacto": document.getElementById("telefono_contacto").value,
        "estado": document.getElementById("estado").value
    };
    if (validarCampos()) {

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: function (result) {
                alert("Se registro correctamente");
            },
            error: function (error) {
                alert("no se registro")
            }
        });
    } else {
        swal.fire({
            title: "ERROR",
            text: "Llene todos los campos correctamente",
            icon: "error"
        });
    }
}

function validarCampos() {
    var numero_documento = document.getElementById("numero_documento");
    return validarNumeroDocumento(numero_documento);
}

function validarNumeroDocumento(cuadroNumero) {

    var valor = cuadroNumero.value;
    var valido = true;
    if (valor.length < 5 || valor.length > 11) {
        valido = false;
    }

    if (valido) {

        cuadroNumero.className = "form-control is-valid";
    } else {

        cuadroNumero.className = "form-control is-invalid";
    }
    return valido;
}