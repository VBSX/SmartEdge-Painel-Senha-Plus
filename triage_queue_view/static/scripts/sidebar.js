document.addEventListener('DOMContentLoaded', function() {
    var menuButton = document.getElementById('menu-button');
    var closeButton = document.getElementById('close-button'); // Seleciona o botão de fechamento
    var sidebar = document.querySelector('.sidebar');

    menuButton.addEventListener('click', function() {
        sidebar.classList.add('open');
    });

    closeButton.addEventListener('click', function() { // Adiciona o evento de clique no botão de fechamento
        sidebar.classList.remove('open');
    });
    // unit-dropdown

    document.getElementById("unit-dropdown").addEventListener("change", function() {
        var selectedUnit = this.value;
    
        // Criar um objeto FormData para enviar os dados
        var formData = new FormData();
        formData.append('new_unity', selectedUnit);
        formData.append('update_button', true);
    
        // Enviar uma requisição POST para o servidor
        fetch('/', {
            method: 'POST',
            body: formData
        }).then(function(response) {
            // Atualizar a página após a atualização
            window.location.reload();
            console.log(response);
        });
    });


    var actualUnity = "{{ actual_unity }}";
    var nameActualUnity = "{{ name_actual_unity }}";

    var dropdown = document.getElementById("unit-dropdown");
    for (var i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value == actualUnity) {
            dropdown.selectedIndex = i;
            console.log("Unidade atual selecionada:", nameActualUnity);
            console.log("Unidade ID:", actualUnity);
            console.log("Nome da Unidade:", nameActualUnity);
            break;
        }
    }
});