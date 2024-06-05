const urlParams = new URLSearchParams(window.location.search);
const idMatricula = urlParams.get('idMatricula');

const form = document.getElementById('materiasForm');
const materiasSelect = document.getElementById('materiasSelect');
const materiasSeleccionadas = document.getElementById('materiasSeleccionadas');

// Firestore
const colMaterias = firestore.collection('Materias');

// aqui le podemos añadir las materias que se deseen, por ejemplo yo puse estas 
function cargarMaterias() {
    const materias = [
        { id: 'matematicasComputacion1', nombre: 'Matemáticas para la computación' },
        { id: 'BasesDatos1', nombre: 'Bases de datos' },
        { id: 'Programacion1', nombre: 'Programación' },
        { id: 'fundamentosredes1', nombre: 'Fundamentos de redes' },
        { id: 'fundamentostelecomunicacion1', nombre: 'Fundamentos de telecomunicaciones' },
        { id: 'programacionSistemas1', nombre: 'Programación de sistemas' },
        { id: 'ciberseguridad1', nombre: 'Ciberseguridad' },
        { id: 'tecnologiasdelainformacion1', nombre: 'Tecnologías de la información' }
    ];

  
    materiasSelect.innerHTML = '';

    // agregar materias al select
    materias.forEach(materia => {
        materiasSelect.innerHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
    });
}

cargarMaterias();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedOptions = Array.from(materiasSelect.selectedOptions).map(option => option.value);
    guardarMateriasSeleccionadas(selectedOptions);
});

function guardarMateriasSeleccionadas(materias) {
    const colCargaMaterias = firestore.collection('Universidad').doc('Personal').collection('Maestros').doc(idMatricula).collection('Materias');

    const batch = firestore.batch();
    materias.forEach((materiaId) => {
        const docRef = colCargaMaterias.doc(materiaId);
        batch.set(docRef, {});
    });

    batch.commit().then(() => {
        alert('Materias seleccionadas guardadas correctamente.');
        cargarMateriasSeleccionadas(); 
    }).catch(error => {
        console.error("Error al guardar las materias: ", error);
    });
}

function cargarMateriasSeleccionadas() {
    materiasSeleccionadas.innerHTML = ''; 

    const colCargaMaterias = firestore.collection('Universidad').doc('Personal').collection('Maestros').doc(idMatricula).collection('Materias');
//funcion para obtener las materias y las pueda mostrar en una nueva tabla despues de que le demos al boton guardar
    colCargaMaterias.get().then(snapshot => {
        snapshot.forEach(doc => {
            const materiaId = doc.id;
            const materiaNombre = obtenerNombreMateriaPorId(materiaId); 
            const fila = `<tr>
                            <td>${materiaNombre}</td>
                            <td><button class="btn btn-danger" onclick="eliminarMateria('${materiaId}')">Eliminar</button></td>
                         </tr>`;
            materiasSeleccionadas.innerHTML += fila;
        });
    }).catch(error => {
        console.error("Error al cargar las materias seleccionadas: ", error);
    });
}

function obtenerNombreMateriaPorId(materiaId) {
    const materias = [
        { id: 'matematicasComputacion1', nombre: 'Matemáticas para la computación' },
        { id: 'BasesDatos1', nombre: 'Bases de datos' },
        { id: 'Programacion1', nombre: 'Programación' },
        { id: 'fundamentosredes1', nombre: 'Fundamentos de redes' },
        { id: 'fundamentostelecomunicacion1', nombre: 'Fundamentos de telecomunicaciones' },
        { id: 'programacionSistemas1', nombre: 'Programación de sistemas' },
        { id: 'ciberseguridad1', nombre: 'Ciberseguridad' },
        { id: 'tecnologiasdelainformacion1', nombre: 'Tecnologías de la información' }
    ];

    const materia = materias.find(materia => materia.id === materiaId);
    return materia ? materia.nombre : "Materia desconocida";
}

function eliminarMateria(materiaId) {
    const colCargaMaterias = firestore.collection('Universidad').doc('Personal').collection('Maestros').doc(idMatricula).collection('Materias');
    colCargaMaterias.doc(materiaId).delete().then(() => {
        alert('Materia eliminada correctamente.');
        cargarMateriasSeleccionadas(); 
    }).catch(error => {
        console.error("Error al eliminar la materia: ", error);
    });
}

// Este es para cargar las funcion materias
cargarMateriasSeleccionadas();
