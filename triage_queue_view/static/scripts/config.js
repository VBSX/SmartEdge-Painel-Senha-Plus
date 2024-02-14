

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs_menus li');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('id');
            // Lógica para exibir o conteúdo correspondente ao clicar na aba
            if(tabId == 'sistema'){
                console.log('sistema')
                aba_sistema();
            }
            else if(tabId == 'unidades'){
                console.log('unidades')
                aba_unidades();
            }
            else if(tabId == 'departamentos'){
                console.log('departamentos')
                aba_departamentos();
            }
            else if(tabId == 'servicos'){
                console.log('servicos')
                aba_servicos();
            }

            else if(tabId == 'prioridades'){
                console.log('prioridades')
                aba_prioridades();
            }

            else if(tabId == 'locais'){
                console.log('locais')
                aba_locais();
            }
            else if(tabId == 'perfis'){
                console.log('perfis')
                aba_perfis();
            } 
            else if(tabId == 'usuarios'){
                console.log('usuarios')
                aba_usuarios();
            } 
        });
    });
    function aba_sistema() {
        const htmlContent = `
            <h2>Sistema</h2>
            <p>Conteúdo da aba de Sistema...</p>
        `;
        put_html_on_content_div(htmlContent)

    }
    function aba_unidades() {
        const htmlContent = `
            <h2>Unidades</h2>
            <p>Conteúdo da aba de Unidades...</p>
        `;
        put_html_on_content_div(htmlContent)

    }
    function aba_departamentos() {
        const htmlContent = `
            <h2>Departamentos</h2>
            <p>Conteúdo da aba de Departamentos...</p>
        `;
        put_html_on_content_div(htmlContent)

    }
    function aba_servicos() {
        const htmlContent = `
            <h2>Serviços</h2>
            <p>Conteúdo da aba de Serviços...</p>
        `;
        put_html_on_content_div(htmlContent)

    }
    function aba_prioridades() {
        const htmlContent= `
            <h2>Prioridades</h2>
            <p>Conteúdo da aba de Prioridades...</p>
            `;
            put_html_on_content_div(htmlContent)
    }

    function aba_locais(){
        const htmlContent= `
            <h2>Locais</h2>
            <p>Conteúdo da aba de Locais...</p>
            `;
            put_html_on_content_div(htmlContent)
    }
    function aba_perfis(){
        const htmlContent= `
            <h2>Perfis</h2>
            <p>Conteúdo da aba de Perfis...</p>
            `;
            put_html_on_content_div(htmlContent)
    }
    function aba_usuarios(){
        const htmlContent= `
            <h2>Usuários</h2>
            <p>Conteúdo da aba de Usuários...</p>
            `;
            put_html_on_content_div(htmlContent)
    }

    function put_html_on_content_div(htmlContent){
        // Ou, se você estiver usando uma classe e deseja selecionar o primeiro elemento da coleção:
        const contentDiv = document.getElementsByClassName('content')[0];
    
        // Verifica se a div de conteúdo foi encontrada
        if (contentDiv) {
            // Define o HTML da div de conteúdo para o HTML desejado
            contentDiv.innerHTML = htmlContent;
        } else {
            console.error('Div de conteúdo não encontrada');
        }
    }

});

