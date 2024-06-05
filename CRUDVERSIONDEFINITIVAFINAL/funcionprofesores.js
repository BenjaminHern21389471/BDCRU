$(document).ready(function() {
    // Bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    var colMaestros = firestore.collection('Universidad').doc('Personal').collection('Maestros');

    function generarIdMatricula() {
        const prefix = 'CDN';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${randomNum}`;
    }

    //Firestore
    async function addData(addNombre, addCorreo) {
        const idMatricula = generarIdMatricula();
        await colMaestros.doc(idMatricula).set({
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
        $("#addMaestroModal").modal('toggle');
    });

    //actualizar 
    async function updateMaestro(idMatricula, newNombre, newCorreo) {
        await colMaestros.doc(idMatricula).update({
            Nombre: newNombre,
            Correo: newCorreo
        });
    }

    // editar
    $(".updateMaestro").on("click", (event) => {
        event.preventDefault();
        var idMatricula = $(".editIdMatricula").val();
        var newNombre = $(".editNombre").val();
        var newCorreo = $(".editCorreo").val();
        updateMaestro(idMatricula, newNombre, newCorreo);
        $("#editMaestroModal").modal('toggle');
    });

    // eliminar
    async function deleteMaestro(idMatricula) {
        await colMaestros.doc(idMatricula).delete();
    }

    // borrar
    $(".deleteMaestro").on("click", (event) => {
        event.preventDefault();
        var idMatricula = $(".deleteIdMatricula").val();
        deleteMaestro(idMatricula);
        $("#deleteMaestroModal").modal('toggle');
    });

    // mostrar
    function mostrarMaestros(snapshot) {
        $("tbody").html("");
        snapshot.forEach((doc) => {
            let maestro = doc.data();
            $("tbody").append(`
                <tr data-id="${maestro.IdMatricula}">
                    <td>${maestro.Nombre}</td>
                    <td>${maestro.Correo}</td>
                    <td>${maestro.IdMatricula}</td>
                    <td>
                        <a href="#editMaestroModal" class="edit" data-toggle="modal" data-id="${maestro.IdMatricula}" data-n
                        data-nombre="${maestro.Nombre}" data-correo="${maestro.Correo}"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteMaestroModal" class="delete" data-toggle="modal" data-id="${maestro.IdMatricula}"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                        <button class="btn btn-primary cargar-materias" data-id="${maestro.IdMatricula}">Asignar Materias</button>
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

        $(".cargar-materias").on("click", function() {
            var idMatricula = $(this).data("id");
           
            window.location.href = "seleccionmatprofes.html?idMatricula=" + idMatricula;
    
        });
    }

    // buscar
    function buscarMaestro(query) {
        colMaestros.where("Nombre", "==", query).get().then((snapshot) => {
            if (snapshot.empty) {
                colMaestros.where("IdMatricula", "==", query).get().then((snapshot) => {
                    if (!snapshot.empty) {
                        mostrarMaestros(snapshot);
                    } else {
                        $("tbody").html("<tr><td colspan='4'>No se encontraron resultados</td></tr>");
                    }
                });
            } else {
                mostrarMaestros(snapshot);
            }
        });
    }

    // busqueda en el campo de texto
    $("#searchField").on("input", function() {
        var query = $(this).val().trim();
        if (query) {
            buscarMaestro(query);
        } else {
            //en caso de estar vacio mostrar a los maestros
            colMaestros.get().then(mostrarMaestros);
        }
    });

    // mostrar a todos
    colMaestros.onSnapshot(mostrarMaestros);
});
