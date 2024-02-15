
function editUnit(id) {
    var table = document.getElementById('unit-table');
    var rows = table.getElementsByTagName('tr');
    // Iterating over the rows (starting from the second row to ignore the header)
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];

        // Retrieving cells of the row
        var cells = row.getElementsByTagName('td');
        
        // Retrieving values from cells
        var id_unit = cells[0].innerText;
        
        if (id_unit == id) {
            var name_unit = cells[1].innerText;
            var address_unit = cells[2].innerText;
            var phone_unit = cells[3].innerText;
            var email_unit = cells[4].innerText;
            console.log('ID da unidade:', id_unit);
            console.log('Nome da unidade:', name_unit);
            console.log('Endereço:', address_unit);
            console.log('Número de telefone:', phone_unit);
            console.log('Email:', email_unit);
            update_unit(id_unit, name_unit, address_unit, phone_unit, email_unit);
            break;
        }
    }
}
async function update_unit(id_unit, name_unit, unity_address, unity_phone, unity_email) {
    var usuario_aceitou = await popup_warning(`Certeza que deseja continuar a atualizar as informações da unidade ${name_unit} ?`);
    
    if (usuario_aceitou) {
        console.log('usuario aceitou');
        var formData = new FormData();
        formData.append('unity_id', id_unit);
        formData.append('unity_name', name_unit);
        formData.append('unity_address', unity_address);
        formData.append('unity_phone', unity_phone);
        formData.append('unity_email', unity_email);
        formData.append('type_post', 'update_unit')
        
        fetch('/config/unit', {
            method: 'POST',
            body: formData
        }).then(async response => {
            event.preventDefault();
            if (response.ok) {
                
                console.log('Unidade atualizada com sucesso!');
                popup_sucess('Unidade atualizada com sucesso!');
            } else {
                // Read the text from the response
                
                var message_error = await response.text();
                console.error('Erro ao atualizar a unidade.');
                popup_error(`Erro ao atualizar a unidade: ${message_error}`);
            }
        });
    }
}

async function createNewUnit(){
    Swal.fire({
        title: '<strong>Custom HTML content</strong>',
        html: `
          <label for="inputName">Nome da unidade:</label>
          <input type="text" id="inputName" class="swal2-input" required>

          <label for="inputEndereco">Endereço:</label>
          <input type="adress" id="inputEndereco" class="swal2-input" required>

          <label for="inputNumeroTelefone">Numero de Telefone:</label>
          <input type="phone" id="inputNumeroTelefone" class="swal2-input" required>

          <label for="inputemail">Email:</label>
          <input type="email" id="inputemail" class="swal2-input" required>
        `,
        focusConfirm: false,
        showCloseButton: true,
        confirmButtonText: 'Salvar',
        preConfirm: () => {
          const inputName = Swal.getPopup().querySelector('#inputName').value
          const inputEndereco = Swal.getPopup().querySelector('#inputEndereco').value
          const inputNumeroTelefone = Swal.getPopup().querySelector('#inputNumeroTelefone').value
          const inputEmail = Swal.getPopup().querySelector('#inputemail').value
          console.log(inputName, inputEndereco, inputNumeroTelefone, inputEmail)
          if (!inputName || !inputEmail || !inputEndereco || !inputNumeroTelefone) {
            Swal.showValidationMessage(`Preencha todos os campos`)
          }
          else{          
            post_new_unit(inputName,inputEndereco, inputNumeroTelefone, inputEmail)
          }
        }
      })
    }

async function post_new_unit(name,endereco, numeroTelefone,email){
    var formData = new FormData();
    formData.append('unity_name', name);
    formData.append('unity_address', endereco);
    formData.append('unity_phone', numeroTelefone);
    formData.append('unity_email', email);
    formData.append('type_post', 'new_unit');

    fetch('/config/unit', { 
        method: 'POST',
        body: formData
    }).then(async response => {
        if (response.ok) {
            console.log('Unidade adicionada com sucesso!');
            popup_sucess('Unidade adicionada com sucesso!');
        } else {
            // Read the text from the response
            var message_error = await response.text();
            console.error('Erro ao adicionar a unidade.');
            popup_error(`Erro ao adicionar a unidade: ${message_error}`);
        }
    });
}

async function popup_warning(text_warning) {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Atenção',
            text: text_warning,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function popup_sucess(text_sucess) {
    Swal.fire({
        title: 'Sucesso',
        text: text_sucess,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}

function popup_error(text_error) {
    Swal.fire({
        title: 'Erro',
        text: text_error,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(response);
        }
    });
}

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
        get_units().then(data => {
            put_html_on_content_div(generate_html_for_unit(data));
        });
    }
    
    function generate_html_for_unit(list_units){
        var htmlContent = `
            <h2>Unidades</h2>
            <button onclick="createNewUnit()" class="btn btn-outline-secondary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Nova Unidade</button>
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
                    <td><button type="button" onclick="editUnit(${id_unit})" class="btn btn-outline-primary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Editar</button></td>
                </tr>
            `;
        }
        htmlContent += `
            </table>    
        `;
        return htmlContent;
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

