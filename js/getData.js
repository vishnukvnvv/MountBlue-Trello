
const apiKey = 'apiKey';
const token = 'token';
const access = `key=${apiKey}&token=${token}`;
const link = 'https://api.trello.com/1/';
let url;

function getChecklistApiRequest(id, name) {
    url = `${link}cards/${id}/checklists?${name}&${access}`;
    return fetch(url).then(res => res.json()).then(data => data);
}


updateListApiRequest('5dfe7190ed27730b0c3427f1').then(data => {
    console.log(data);
    // alert('List title updated');
}).catch(error => {
    console.log(error);
    // alert('Failed to update list title');
})