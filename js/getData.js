const fetch = require('node-fetch');

const apiKey = 'apikey';
const token = 'token';
const access = `key=${apiKey}&token=${token}`;
const link = 'https://api.trello.com/1/';
let url;

function updateListApiRequest(id, name) {
    url = `${link}lists/${id}/?name=${name}&${access}`;
    return fetch(url, {
        method: 'PUT'
    }).then(res => res.json()).then(data => data);
}


updateListApiRequest('5dff0405fa9e730bcc7c1414', 'name').then(data => {
    console.log(data);
    // alert('List title updated');
}).catch(error => {
    console.log(error);
    // alert('Failed to update list title');
})

// https://api.trello.com/1/lists?name=name&idBoard=5dfcd8752ab3fe823cf65d84&key=5942846fd6f9e669e79610ef2fd10d84&token=a404c83a3c508a1c70fba3172a20dc3d9ab9366b3c1ea2ac2b045d84111f82a5