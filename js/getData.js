const fetch = require('node-fetch');

const apiKey = 'apiKey';
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
