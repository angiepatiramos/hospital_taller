
var url = "http://localhost:8080/api/v1/ingreso/";


function listaIngreso() {

    var capturarFiltro = document.getElementById("Search").value;
    var urlIngreso=url;
    if (capturarFiltro!=""){
        urlIngreso+="busquedafiltro/"+capturarFiltro;
  }
    $.ajax({
        url: urlIngreso,
        type: "GET",
        success: function (result) {
            console.log(result);

            var listaIngreso = document.getElementById("listaIngreso");

            listaIngreso.innerHTML = "";

            for (var i = 0; i < result.length; i++) {
                let trRegistro = document.createElement("tr");
                let celdaID = document.createElement("td");
                let celdaHabitacion = document.createElement("td");
                let celdaCama = document.createElement("td");
                let celdaMedico = document.createElement("td");
                let celdaPaciente = document.createElement("td");
                let celdaFechaIngreso = document.createElement("td");
                let celdaFechaSalida = document.createElement("td");
                let celdaEstado = document.createElement("td");
                let celdaEliminar = document.createElement("td");

                celdaID.innerText = result[i]["id"];
                celdaHabitacion.innerText = result[i]["habitacion"];
                celdaCama.innerText = result[i]["cama"];
                var medico=result[i]["medico"]
                celdaMedico.innerText = medico["primer_name"]+ " " + medico["segundo_name"] || "";
                var paciente=result[i]["paciente"]
                celdaPaciente.innerText = paciente["primer_name"]+" "+ paciente["segundo_name"] || "";
                celdaFechaIngreso.innerText = result[i]["fecha_ingreso"] || "";
                celdaFechaSalida.innerText = result[i]["fecha_salida"] || "";
                celdaEstado.innerText = result[i]["estado"] || "";

              

                let botonEliminar = document.createElement("button");
                botonEliminar.className = "boton-eliminar";
                botonEliminar.textContent = "Eliminar";

    
                celdaEliminar.appendChild(botonEliminar);


                trRegistro.appendChild(celdaID);
                trRegistro.appendChild(celdaHabitacion);
                trRegistro.appendChild(celdaCama);
                trRegistro.appendChild(celdaMedico);
                trRegistro.appendChild(celdaPaciente);
                trRegistro.appendChild(celdaFechaIngreso);
                trRegistro.appendChild(celdaFechaSalida);
                trRegistro.appendChild(celdaEstado);
                trRegistro.appendChild(celdaEliminar);

                listaIngreso.appendChild(trRegistro);
            }
        },
        error: function (error) {
            console.error("Error en la petición: " + error);
        }
    });
}




function guardarCambiosIngreso(idIngreso) {
    let formData = {
        "habitacion": document.getElementById("habitacion").value,
        "cama": document.getElementById("cama").value,
        "medico": document.getElementById("medicoSelectModal").value,
        "paciente": document.getElementById("pacienteSelectModal").value,
        "fecha_ingreso": document.getElementById("fecha_ingreso").value,
        "fecha_salida": document.getElementById("fecha_salida").value,
        "estado": document.getElementById("estado").value
    };

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url + idIngreso,
                type: "PUT",
                data: formData,
                success: function (result) {
                    console.log("Datos del Ingreso actualizados:", result);
                    let modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();


                    swalWithBootstrapButtons.fire({
                        title: "Cambios guardados",
                        text: "Los cambios se guardaron correctamente.",
                        icon: "success"
                    }).then(() => {
                        listaIngreso();
                    });
                },
                error: function (error) {
                    console.error("Error al actualizar datos del médico:", error);
                }
            });
        } else if (
           
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "No se realizaron cambios.",
                icon: "error"
            });
        }
    });
}

function eliminarIngreso(idIngreso) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url + idIngreso,
                type: "DELETE",
                success: function (result) {
                  
                    listaIngreso();
                    Swal.fire({
                        icon: 'success',
                        title: 'Ingreso eliminado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error: function (error) {
                    console.error("Error al eliminar ingreso:", error);
                }
            });
        }
    });
}






function registrarIngreso() {
    let formData = {
        "paciente": document.getElementById("pacienteSelect").value,
        "medico": document.getElementById("medicoSelect").value,
        "habitacion": document.getElementById("habitacion").value,
        "cama": document.getElementById("cama").value,
        "fecha_ingreso": document.getElementById("fecha_ingreso").value,
        "fecha_salida": document.getElementById("fecha_salida").value,
        "estado": document.getElementById("estado").value
    };


    let pacienteEnIngreso = verificarPacienteEnIngreso(formData.paciente);
    
    let otroPacienteEnCama = verificarOtroPacienteEnCama(formData.cama);

    if (pacienteEnIngreso) {

        Swal.fire({
            title: "Error",
            text: "El paciente ya está registrado en un ingreso.",
            icon: "error"
        });
    } else if (otroPacienteEnCama) {

        Swal.fire({
            title: "Error",
            text: "Ya hay otro paciente registrado en la misma cama.",
            icon: "error"
        });
    } else {

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: function (result) {
                alert("Se guardó correctamente");

            },
            error: function (error) {
                console.error("Error en la petición: " + error);
            }
        });
    }
}


function verificarPacienteEnIngreso(idPaciente) {
    let pacienteEnIngreso = false;

    $.ajax({
        url: url,
        type: "GET",
        async: false, 
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].paciente.id === idPaciente) {
                    pacienteEnIngreso = true;
                    break;
                }
            }
        },
        error: function (error) {
            console.error("Error al obtener la lista de ingresos: " + error);
        }
    });

    return pacienteEnIngreso;
}


function verificarOtroPacienteEnCama(cama) {
    let otroPacienteEnCama = false;

    $.ajax({
        url: url,
        type: "GET",
        async: false, 
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].cama === cama) {
                    otroPacienteEnCama = true;
                    break;
                }
            }
        },
        error: function (error) {
            console.error("Error al obtener la lista de ingresos: " + error);
        }
    });

    return otroPacienteEnCama;
}


function validarCampos() {
    var habitacion = document.getElementById("habitacion");
    return validarNumeroCama(habitacion);
}


function validarNumeroCama(cuadroCama) {
    var valor = cuadroCama.value;
    var valido = true;

    if (valor.length < 1 || valor.length > 11) {
        valido = false;
    }

    if (valido) {
        cuadroCama.className = "form-control is-valid";
    } else {
        cuadroCama.className = "form-control is-invalid";
    }
    return valido;
}


