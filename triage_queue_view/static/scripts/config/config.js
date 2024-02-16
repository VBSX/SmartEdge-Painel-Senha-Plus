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

function aba_sistema() {
    const htmlContent = `
        <h2>Sistema</h2>
        <p>Conteúdo da aba de Sistema...</p>
    `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);
}
function aba_unidades() { 
    get_units().then(data => {
        put_html_on_content_div(generate_html_for_unit(data));
    });
    window.scrollTo(0, 0);
}

function aba_departamentos() {
    const htmlContent = `
        <h2>Departamentos</h2>
        <p>Conteúdo da aba de Departamentos...</p>
    `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);
}
function aba_servicos() {
    const htmlContent = `
        <h2>Serviços</h2>
        <p>Conteúdo da aba de Serviços...</p>
    `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);
}
function aba_prioridades() {
    const htmlContent= `
        <h2>Prioridades</h2>
        <p>Conteúdo da aba de Prioridades...</p>
        `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);
}

function aba_locais(){
    const htmlContent= `
        <h2>Locais</h2>
        <p>Conteúdo da aba de Locais...</p>
        `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);
}
function aba_perfis(){
    const htmlContent= `
        <h2>Perfis</h2>
        <p>Conteúdo da aba de Perfis...</p>
        `;
    put_html_on_content_div(htmlContent)
    window.scrollTo(0, 0);

}
function aba_usuarios(){
    get_users().then(data => {
        get_roles().then(roles => {put_html_on_content_div(generate_html_for_user(data, roles));})
        
    })
    window.scrollTo(0, 0);

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

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs_menus li');
    // mover para o topo da pagina
    window.scrollTo(0, 0);

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
});

