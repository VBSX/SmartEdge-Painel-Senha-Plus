function validarInput(input) {   
        validarInteiro(input) 
}
function validarInteiro(input) {
    input.setCustomValidity('');
    if (!input.validity.patternMismatch) {
        var valor = parseInt(input.value);
        if (isNaN(valor)) {
            input.setCustomValidity('Digite somente números inteiros.');
        }
    }
}

