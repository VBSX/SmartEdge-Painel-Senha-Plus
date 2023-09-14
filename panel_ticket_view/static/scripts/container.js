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

// Ler os cookies relevantes
var hostCookie = getCookie('host');
var usuarioCookie = getCookie('usuario');
var clientIdCookie = getCookie('clientId');
var clientSecretCookie = getCookie('clientSecret');
var autenticadoCookie = getCookie('autenticado');

// Verificar se o cliente está autenticado
if (autenticadoCookie === 'true') {
    // O cliente está autenticado, mostrar os menus 'Unidade' e 'Serviço'
    document.getElementById('unidade-menu').style.display = 'block';
    document.getElementById('servico-menu').style.display = 'block';

    // Coloque aqui o código para preencher os menus 'Unidade' e 'Serviço' com as opções apropriadas
    // Você pode adicionar aqui a lógica para criar e preencher os menus com base nos cookies
} else {
    // O cliente não está autenticado, ocultar os menus 'Unidade' e 'Serviço'
    document.getElementById('unidade-menu').style.display = 'none';
    document.getElementById('servico-menu').style.display = 'none';
}

// Função para mostrar os menus 'Unidade' e 'Serviço'
function mostrarMenus() {
    document.getElementById('unidade-menu').style.display = 'block';
    document.getElementById('servico-menu').style.display = 'block';
    // Coloque aqui o código para preencher os menus 'Unidade' e 'Serviço' com as opções apropriadas
}

// Verificar se o cliente está autenticado
if (autenticadoCookie === 'true') {
    mostrarMenus();
} else {
    // O cliente não está autenticado, ocultar os menus 'Unidade' e 'Serviço'
    document.getElementById('unidade-menu').style.display = 'none';
    document.getElementById('servico-menu').style.display = 'none';
}

// Função para mostrar o contêiner flutuante quando o botão é clicado
document.getElementById("config-button").addEventListener("click", function () {
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

    // Faça uma requisição POST para o endpoint desejado
    fetch("/display/painel/configserver", {
        method: "POST",
        body: formData
    })
    .then(function(response) {
        if (response.ok) {
            alert("Configurações do servidor salvas com sucesso!");

            // Se o servidor retornar 200, crie os menus "Unidade" e "Serviço" dinamicamente
            var unidadeMenu = document.getElementById("unidade-menu");
            var servicoMenu = document.getElementById("servico-menu");

            // Crie o menu Unidade (substitua com os valores reais)
            var unidadeOption = document.createElement("li");
            unidadeOption.innerHTML = '<a href="#unidade-menu">Unidade</a>';
            unidadeMenu.innerHTML = '';
            unidadeMenu.appendChild(unidadeOption);

            // Crie o menu Serviço (substitua com os valores reais)
            var servicoOption = document.createElement("li");
            servicoOption.innerHTML = '<a href="#servico-menu">Serviço</a>';
            servicoMenu.innerHTML = '';
            servicoMenu.appendChild(servicoOption);

            // Você pode adicionar mais lógica para preencher os menus Unidade e Serviço aqui
        } else {
            alert("Erro ao salvar as configurações do servidor.");
        }
    })
    .catch(function(error) {
        console.error("Erro:", error);
    });
});