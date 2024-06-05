$(document).ready(function() {
    $('#selectionForm').on('submit', function(event) {
        event.preventDefault();
        var selectedType = $('#personalType').val();
        
        if (selectedType === "Alumnos") {
            window.location.href = "indexalumnos.html";
        } else if (selectedType === "Maestros") {
            window.location.href = "indexprofesores.html";
        } else {
            alert("Por favor, seleccione un tipo de personal.");
        }
    });
});
