document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs_menus li');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('id');
            // Lógica para exibir o conteúdo correspondente ao clicar na aba
            console.log('Clicou na aba:', tabId);
        });
    });

    
});