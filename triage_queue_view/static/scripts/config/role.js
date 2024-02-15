function get_roles(){
    return fetch('/config/role', {
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