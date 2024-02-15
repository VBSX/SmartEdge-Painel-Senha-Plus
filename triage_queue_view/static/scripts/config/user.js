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
                        <option value="${user_role}">${user_role}</option>`;


        console.log('all_roles:', all_roles);
        for (var j = 0; j < all_roles.length; j++) {
            var role = all_roles[j];
            var role_id = role[0];
            var role_name = role[1];
            
            console.log(role_id, role_name);
            if (role_name != user_role) {
                htmlContent += `<option value="${role_id}">${role_name}</option>`;
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

async function update_user(id, name, lastname, role){
    await popup_warning(`Certeza que deseja continuar a atualizar as informações do usuário: ${name} ?`).then(async (usuario_aceitou) => {
    console.log(id, name,lastname, role )
    if (usuario_aceitou) {
        var formData = new FormData();

        formData.append('id', id);
        formData.append('name', name);
        formData.append('last_name', lastname);
        formData.append('role', role);
        formData.append('type_post', 'update_user');

        console.log('formulario',formData);

        fetch('/config/users', {
            method: 'POST',
            body: formData
        }).then(async response => {
            if (response.ok) {
                console.log('Usuário atualizado com sucesso!');
                await popup_sucess('Usuário atualizado com sucesso!').then(() => {
                    aba_usuarios();
                    console.log('unidade att');
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