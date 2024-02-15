function editUnit(id) {
    var table = document.getElementById('unit-table');
    var rows = table.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
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
            aba_unidades();
            break;
        }
    }
}
async function update_unit(id_unit, name_unit, unity_address, unity_phone, unity_email) {
    var usuario_aceitou = await popup_warning(`Certeza que deseja continuar a atualizar as informações da unidade ${name_unit} ?`);
    // TODO: AJUSTAR O PROBLEMA DE ATUALIZAR A PAGINA APÓS ENVIAR O FORM 
    // event.preventDefault(); NÃO FUNCIONA
    if (usuario_aceitou) {
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
            if (response.ok) {
                console.log('Unidade atualizada com sucesso!');
                await popup_sucess('Unidade atualizada com sucesso!').then(() => {
                    aba_unidades();
                    console.log('unidade att');
                });
            } else {
                var message_error = await response.text();
                console.error('Erro ao atualizar a unidade.');
                popup_error(`Erro ao atualizar a unidade: ${message_error}`);
            }
        });
    }
}

async function createNewUnit(){
    Swal.fire({
        title: '<strong>Cadastro de Unidade</strong>',
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
            aba_unidades()
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
            var message_error = await response.text();
            console.error('Erro ao adicionar a unidade.');
            popup_error(`Erro ao adicionar a unidade: ${message_error}`);
        }
    });
}

function delete_unit(id) {
    popup_warning(`Certeza que deseja deletar a unidade ${id} ?`).then(async (usuario_aceitou) => {
        if (usuario_aceitou){
            var formData = new FormData();
            formData.append('unity_id', id);

            fetch('/config/unit', {
                method: 'DELETE',
                body: formData
            }).then(async response => {
                if (response.ok) {
                    console.log('Unidade deletada com sucesso!');
                    popup_sucess('Unidade deletada com sucesso!');
                } else {
                    var message_error = await response.text();
                    console.error('Erro ao deletar a unidade.');
                    popup_error(`Erro ao deletar a unidade: ${message_error}`);
                }
            });
        }
    });
}

function generate_html_for_unit(list_units){
    var htmlContent = `
        <h2>Unidades</h2>
        <button onclick="createNewUnit()" class="btn btn-outline-secondary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Adicionar Nova Unidade</button>
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
                <td><button type="button" onclick="editUnit(${id_unit})" class="btn btn-outline-primary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Editar</button>
                <button type="button" onclick="delete_unit(${id_unit})" class="btn btn-outline-danger btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Deletar</button>
                </td>
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