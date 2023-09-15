// Função para ler um cookie específico pelo nome
function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}



function configurar_menu_unidade() {
    var unidadeMenu = document.getElementById("unidade-menu");

    var unidadeOption = document.createElement("li");
    unidadeOption.innerHTML = '<a href="#unidade-menu">Unidade</a>'
    

    // Adicione o menu Unidade à página
    unidadeMenu.appendChild(unidadeOption);

    // Faça a solicitação fetch para obter as unidades
    fetch("/display/painel/getunitys", {
        method: "get"
    })
    .then(response => {
        // Verifique se a resposta tem o status 200 OK
        if (response.status === 200) {
            return response.json(); // Converte a resposta para JSON
        } else {
            throw new Error("Erro ao buscar unidades");
        }
    })
    .then(data => {
        // Cria um combobox para selecionar a unidade
        var select = document.createElement("select");
        select.id = "unidade-select";
        select.name = "unidade-select-name";
        // Percorre os dados retornados e cria uma opção para cada unidade
        data.forEach(function (unidade) {
            var option = document.createElement("option");
            option.value = unidade.unity_id; // Alterado para unity_id
            option.textContent = unidade.unity_name; // Alterado para unity_name
            select.appendChild(option);
        });

        // Cria o botão salvar
        var salvarButton = document.createElement("input");
        salvarButton.type = "submit";
        salvarButton.value = "Salvar";
        salvarButton.onclick = salvar_unidade;

        // Adicione o combobox e o botão ao menu Unidade
        unidadeMenu.appendChild(select);
        unidadeMenu.appendChild(salvarButton);
    })
    .catch(error => {
        console.error(error);
    });
}

// Função para salvar a unidade
function salvar_unidade() {
    var selectedUnidade = document.getElementById("unidade-select").value;
    fetch("/display/painel/configunity", {
        method: "POST",
        body: {
            'unity_id': selectedUnidade,
            'unity_name': selectedUnidade,
            'client_id':clientIdCookie,
            'client_secret': clientSecretCookie,
        }
    }).then(response => {
        // Verifique se a resposta tem o status 200 OK
        if (response.status === 200) {
            return response.json(); // Converte a resposta para JSON
        } else {
            throw new Error("Erro ao buscar unidades");
        }
    })
    
}

function configurar_menu_servico() {
    var servicoMenu = document.getElementById("servico-menu");
    

    // Crie o menu Serviço (substitua com os valores reais)
    var servicoOption = document.createElement("li");
    servicoOption.innerHTML = '<a href="#servico-menu">Serviço</a>';
    servicoMenu.innerHTML = '';
    servicoMenu.appendChild(servicoOption);
};

// Função para mostrar os menus 'Unidade' e 'Serviço'
function mostrarMenus() {

    document.getElementById('unidade-menu').style.display = 'block';
    document.getElementById('servico-menu').style.display = 'block';

};

function autenticado(){
    // Verificar se o cliente está autenticado
    if (autenticadoCookie === 'True') {
        // configurar_menu_servico();
        // configurar_menu_unidade();
        mostrarMenus();
        document.getElementById('host').value = hostCookie || '';
        document.getElementById('usuario').value = usuarioCookie || '';
        document.getElementById('clientId').value = clientIdCookie || '';
        document.getElementById('clientSecret').value = clientSecretCookie || '';

    } else {
        // O cliente não está autenticado, ocultar os menus 'Unidade' e 'Serviço'
        document.getElementById('unidade-menu').style.display = 'none';
        document.getElementById('servico-menu').style.display = 'none';
    }

}

// Função para mostrar o contêiner flutuante quando o botão é clicado
document.getElementById("config-button").addEventListener("click", function () {
    autenticado()
    document.getElementById("config-container").style.display = "block";
});

// Função para alternar entre os menus
var menuLinks = document.querySelectorAll("#menu ul li a");
menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = this.getAttribute("href").substring(1);
        var menus = document.querySelectorAll(".menu-content");
        menus.forEach(function (menu) {
            menu.style.display = "none";
        });
        document.getElementById(targetId).style.display = "block";
    });
});

// Função para voltar ao menu principal
document.getElementById("voltar").addEventListener("click", function () {
    document.getElementById("config-container").style.display = "none";
});


// Função para enviar o formulário
document.getElementById("server-config-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtenha os dados do formulário
    var formData = new FormData(this);

    fetch("/display/painel/configserver", {
        method: "POST",
        body: formData
    })
    .then(function(response) {
        if (response.ok) {
            alert("Configurações do servidor salvas com sucesso!");

            // Se o servidor retornar 200, crie os menus "Unidade" e "Serviço" dinamicamente
            configurar_menu_unidade();

            // Crie o menu Serviço (substitua com os valores reais)
            configurar_menu_servico();

            // Você pode adicionar mais lógica para preencher os menus Unidade e Serviço aqui
        } else {
            alert("Erro ao salvar as configurações do servidor.");
        }
    })
    .catch(function(error) {
        console.error("Erro:", error);
    });
});

// Ler os cookies relevantes
var hostCookie = getCookie('host');
var usuarioCookie = getCookie('usuario');
var clientIdCookie = getCookie('clientId');
var clientSecretCookie = getCookie('clientSecret');
var autenticadoCookie = getCookie('autenticado');
var unidadeConfiguradaCookie = getCookie('unity_configured');
if (unidadeConfiguradaCookie !== 'True'){
configurar_menu_unidade();
}
autenticado();