function get_users(){
    return fetch('/config/users', {
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

function generate_html_for_user(list_of_users,all_roles){
    var htmlContent = `
        <h2>Usuários</h2>
        <button onclick="create_new_user()" class="btn btn-outline-secondary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Adicionar Novo Usuário</button>
        <table id="user-table">
            <tr>
                <th>Id do Usuário</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Username</th>
                <th>Cargo</th>
                <th>Data do Cadastro</th>
                <th>Ações</th>
            </tr>
    `;
    for (var i = 0; i < list_of_users.length; i++) {
        var unit = list_of_users[i];

        var id_user = unit[0];
        var name_of_user = unit[1];
        var last_name_user = unit[2];
        var username = unit[3];
        var user_role = unit[4];
        var date_creation_of_user = unit[5];

        htmlContent += `
            <tr>
                <td>${id_user}</td>
                <td contenteditable="true">${name_of_user}</td>
                <td contenteditable="true">${last_name_user}</td>
                <td>${username}</td>
                <td>
                    <select>
                `;

        console.log('all_roles:', all_roles);
        for (var j = 0; j < all_roles.length; j++) {
            var role = all_roles[j];
            var role_id = role[0];
            var role_name = role[1];

            if (role_id != user_role) {
                htmlContent += `<option value="${role_id}">${role_name}</option>`;
            }
            else{
                htmlContent += `<option value="${role_id}" selected>${role_name}</option>`;
            }
        }

        htmlContent += `
                </select>
                </td>
                <td>${date_creation_of_user}</td>
                <td>
                    <button type="button" onclick="edit_user(${id_user})" class="btn btn-outline-primary btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Editar</button>
                    <button type="button" onclick="delete_user(${id_user})" class="btn btn-outline-danger btn-rounded" data-mdb-ripple-init  data-mdb-ripple-color="dark">Deletar</button>
                </td>
            </tr>
        `;
    }
    htmlContent += `
        </table>    
    `;
    return htmlContent;
}


function edit_user(id){
    console.log('edit_user:', id);
    // vai pegar as informações editadas da tabela e do dropdown para dar um post na rota config/user

    var table = document.getElementById('user-table');
    var rows = table.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
        var id_user = cells[0].innerText;
        
        if (id_user == id) {
            var name_user = cells[1].innerText;
            var lastname_user = cells[2].innerText;
            var role_user = cells[4].querySelector('select').value;

            console.log('ID do usuário:', id_user);
            console.log('nome do usuário:', name_user);
            console.log('sobrenome do usuário:', lastname_user);
            console.log('cargo do usuário', role_user);
            update_user(id_user, name_user, lastname_user, role_user);
            break;
        }
    }
}

async function update_user(id, name, lastname, role_id){
    await popup_warning(`Certeza que deseja continuar a atualizar as informações do usuário: ${name} ?`).then(async (usuario_aceitou) => {
    console.log(id, name,lastname, role_id )
    if (usuario_aceitou) {
        var formData = new FormData();

        formData.append('id', id);
        formData.append('name', name);
        formData.append('last_name', lastname);
        formData.append('role', role_id);
        formData.append('type_post', 'update_user');

        console.log('formulario',formData);

        fetch('/config/users', {
            method: 'POST',
            body: formData
        }).then(async response => {
            if (response.ok) {
                console.log('Usuário atualizado com sucesso!');
                await popup_sucess('Usuário atualizado com sucesso!').then(() => {
                    console.log('unidade att');
                    aba_usuarios();
                });
            } else {
                var message_error = await response.text();
                console.error('Erro ao atualizar o usuário.');
                popup_error(`Erro ao atualizar o usuário: ${message_error}`);
            }
        });
    }
    })
}


function delete_user(id){

    popup_warning(`Certeza que deseja deletar o usuário ${id} ?`).then(async (usuario_aceitou) => {
        if (usuario_aceitou){
            var formData = new FormData();
            formData.append('id_user', id);

            fetch('/config/users', {
                method: 'DELETE',
                body: formData
            }).then(async response => {
                if (response.ok) {
                    console.log('Usuário deletado com sucesso!');
                    popup_sucess('Usuário deletado com sucesso!');
                } else {
                    var message_error = await response.text();
                    console.error('Erro ao deletar o usuário');
                    popup_error(`Erro ao deletar o usuário: ${message_error}`);
                }
            });
        }
    });
}

function create_new_user() {
    // Lista de opções de cargos disponíveis
    const roles = [
        'Administrador',
        'Atendente',
        'Gerente',
        'Supervisor'
        // Adicione mais opções conforme necessário
    ];


    // Transforma a lista de opções em um formato HTML de opções de um select
    const rolesOptions = roles.map(role => `<option value="${role}">${role}</option>`).join('');
    

    Swal.fire({
        title: '<strong>Cadastro de Usuário</strong>',
        html: `
            <label for="inputName">Nome do Usuário:</label>
            <input type="text" id="inputName" class="swal2-input" required>

            <label for="inputSobrenome">Sobrenome:</label>
            <input type="text" id="inputSobrenome" class="swal2-input" required>

            <label for="inputSenha">Senha do Usuário:</label>
            <input type="password" id="inputSenha" class="swal2-input" required>

            <label for="DropboxCargo">Cargo:</label>
            <select id="DropboxCargo" class="swal2-input" required>
                <option value="">Selecione o cargo</option>
                ${rolesOptions}
            </select>

            <label for="selectUnidades">Unidades:</label>
            <select id="selectUnidades" multiple>
                <option value="Unidade 1">Unidade 1</option>
                <option value="Unidade 2">Unidade 2</option>
                <!-- Adicione mais opções conforme necessário -->
            </select>
            <script>
                $(document).ready(function() {
                    $('#selectUnidades').multiselect({
                        enableFiltering: true, // Habilita a filtragem das opções
                        maxHeight: 300 // Define a altura máxima do dropdown
                    });
                });
            </script>
        `,
        focusConfirm: false,
        showCloseButton: true,
        confirmButtonText: 'Criar Usuário',
        preConfirm: () => {
            const inputName = Swal.getPopup().querySelector('#inputName').value;
            const inputSobrenome = Swal.getPopup().querySelector('#inputSobrenome').value;
            const inputSenha = Swal.getPopup().querySelector('#inputSenha').value;
            const DropboxCargo = Swal.getPopup().querySelector('#DropboxCargo').value;
            const selectUnidades = document.multiselect('#selectUnidades');
            const unidadesSelecionadas = selectUnidades.value;

            if (!inputName || !inputSobrenome || !inputSenha || !DropboxCargo || !unidadesSelecionadas) {
                Swal.showValidationMessage(`Preencha todos os campos`);
            } else {
                post_new_user(inputName, inputSobrenome, inputSenha, DropboxCargo, unidadesSelecionadas);
                aba_usuarios();
            }
        }
    });
}

function post_new_user(){

}