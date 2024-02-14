

document.addEventListener('DOMContentLoaded', function() {

    function editUnit(id) {
        // Recuperar a tabela
        var table = document.getElementById('unit-table');
    
        // Recuperar as linhas da tabela
        var rows = table.getElementsByTagName('tr');
    
        // Iterar sobre as linhas (começando da segunda linha para ignorar o cabeçalho)
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
    
            // Recuperar as células da linha
            var cells = row.getElementsByTagName('td');
    
            // Recuperar os valores das células
            var id_unit = cells[0].innerText;
            var name_unit = cells[1].innerText;
            var address_unit = cells[2].innerText;
            var phone_unit = cells[3].innerText;
            var email_unit = cells[4].innerText;
    
            // Fazer algo com os valores recuperados
            console.log('ID da unidade:', id_unit);
            console.log('Nome da unidade:', name_unit);
            console.log('Endereço:', address_unit);
            console.log('Número de telefone:', phone_unit);
            console.log('Email:', email_unit);
        }
    }
    
    function createNewUnit() {
        // Implemente a lógica para criar uma nova unidade
        console.log("Criar nova unidade");
    }  
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
        get_units().then(data => {
            var list_units = data;
            var htmlContent = `
                <h2>Unidades</h2>
                <table id="unit-table">
                    <tr>
                        <th>Id da unidade</th>
                        <th>Nome da Unidade</th>
                        <th>Endereço</th>
                        <th>Número de Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
            `;
            for (var i = 0; i < list_units.length; i++) {
                var unit = list_units[i];
                var id_unit = unit[0];
                var name_unit = unit[1];
                var address_unit = unit[2];
                var phone_unit = unit[3];
                var email_unit = unit[4];
                htmlContent += `
                    <tr>
                        <td>${id_unit}</td>
                        <td contenteditable="true">${name_unit}</td>
                        <td contenteditable="true">${address_unit}</td>
                        <td contenteditable="true">${phone_unit}</td>
                        <td contenteditable="true">${email_unit}</td>
                        <td><button onclick="editUnit(${id_unit})">Editar</button></td>
                    </tr>
                `;
            }
            htmlContent += `
                </table>    
                <button onclick="createNewUnit()">Nova Unidade</button>
            `;
            put_html_on_content_div(htmlContent);
        });
    }
    
    function get_units(){
        return fetch('/config/unit', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
         return data;
        })
        .catch(error => {
         console.error(error);
        });
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

