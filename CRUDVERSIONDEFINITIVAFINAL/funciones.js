$(document).ready(function() {
    // Bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    var colAlumnos = firestore.collection('Universidad').doc('Personal').collection('Estudiantes');

    function generarIdMatricula() {
        const prefix = 'UAG';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${randomNum}`;
    }

    //Firestore
    async function addData(addNombre, addCorreo) {
        const idMatricula = generarIdMatricula();
        await colAlumnos.doc(idMatricula).set({
            Nombre: addNombre,
            Correo: addCorreo,
            IdMatricula: idMatricula  
        });
    }

    // agregar datos
    $(".addData").on("click", (event) => {
        event.preventDefault();
        var addNombre = $(".addNombre").val();
        var addCorreo = $(".addCorreo").val();
        $(".addNombre").val("");
        $(".addCorreo").val("");
        addData(addNombre, addCorreo);
        $("#addAlumnoModal").modal('toggle');
    });

    //actualizar 
    async function updateAlumno(idMatricula, newNombre, newCorreo) {
        await colAlumnos.doc(idMatricula).update({
            Nombre: newNombre,
            Correo: newCorreo
        });
    }

    // editar
    $(".updateAlumno").on("click", (event) => {
        event.preventDefault();
        var idMatricula = $(".editIdMatricula").val();
        var newNombre = $(".editNombre").val();
        var newCorreo = $(".editCorreo").val();
        updateAlumno(idMatricula, newNombre, newCorreo);
        $("#editAlumnoModal").modal('toggle');
    });

    // eliminar
    async function deleteAlumno(idMatricula) {
        await colAlumnos.doc(idMatricula).delete();
    }

    // borrar
    $(".deleteAlumno").on("click", (event) => {
        event.preventDefault();
        var idMatricula = $(".deleteIdMatricula").val();
        deleteAlumno(idMatricula);
        $("#deleteAlumnoModal").modal('toggle');
    });

    // mostrar
    function mostrarEstudiantes(snapshot) {
        $("tbody").html("");
        snapshot.forEach((doc) => {
            let estudiante = doc.data();
            $("tbody").append(`
                <tr data-id="${estudiante.IdMatricula}">
                    <td>${estudiante.Nombre}</td>
                    <td>${estudiante.Correo}</td>
                    <td>${estudiante.IdMatricula}</td>
                    <td>
                        <a href="#editAlumnoModal" class="edit" data-toggle="modal" data-id="${estudiante.IdMatricula}" data-n
                        data-nombre="${estudiante.Nombre}" data-correo="${estudiante.Correo}"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteAlumnoModal" class="delete" data-toggle="modal" data-id="${estudiante.IdMatricula}"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                        <button class="btn btn-primary cargar-materias" data-id="${estudiante.IdMatricula}">Cargar Materias</button>
                    </td>
                </tr>
            `);
        });

        // boton editar
        $(".edit").on("click", function() {
            var idMatricula = $(this).data("id");
            var nombre = $(this).data("nombre");
            var correo = $(this).data("correo");
            $(".editIdMatricula").val(idMatricula);
            $(".editNombre").val(nombre);
            $(".editCorreo").val(correo);
        });

        // boton borrar
        $(".delete").on("click", function() {
            var idMatricula = $(this).data("id");
            $(".deleteIdMatricula").val(idMatricula);
        });

        // boton cargar materias
        $(".cargar-materias").on("click", function() {
            var idMatricula = $(this).data("id");
            // Aquí puedes redirigir a la página de selección de materias, por ejemplo:
            window.location.href = "seleccion-materias.html?idMatricula=" + idMatricula;
            // Esta línea asume que tienes una página llamada seleccion-materias.html y pasas el idMatricula como parámetro.
        });
    }

    // buscar
    function buscarEstudiante(query) {
        colAlumnos.where("Nombre", "==", query).get().then((snapshot) => {
            if (snapshot.empty) {
                colAlumnos.where("IdMatricula", "==", query).get().then((snapshot) => {
                    if (!snapshot.empty) {
                        mostrarEstudiantes(snapshot);
                    } else {
                        $("tbody").html("<tr><td colspan='4'>No se encontraron resultados</td></tr>");
                    }
                });
            } else {
                mostrarEstudiantes(snapshot);
            }
        });
    }

    // busqueda en el campo de texto
    $("#searchField").on("input", function() {
        var query = $(this).val().trim();
        if (query) {
            buscarEstudiante(query);
        } else {
            //en caso de estar vacio mostrar a los estudiantes
            colAlumnos.get().then(mostrarEstudiantes);
        }
    });

    // mostrar a todos
    colAlumnos.onSnapshot(mostrarEstudiantes);
});
