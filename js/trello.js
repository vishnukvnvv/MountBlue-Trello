const apiKey = '5942846fd6f9e669e79610ef2fd10d84';
const token = 'a404c83a3c508a1c70fba3172a20dc3d9ab9366b3c1ea2ac2b045d84111f82a5';
const access = `key=${apiKey}&token=${token}`;
const link = 'https://api.trello.com/1/';
let url;

// get function
function get(url) {
    return fetch(url).then(res => res.json()).then(data => data);
}

// put function
function put(url) {
    return fetch(url, {
        method: 'PUT'
    }).then(res => res.json()).then(data => data);
}

// post function
function post(url) {
    return fetch(url, {
        method: 'POST'
    }).then(res => res.json()).then(data => data);
}

// dlete function
function deleteReq(url) {
    return fetch(url, {
        method: 'DELETE'
    }).then(res => res.json()).then(data => data);
}

// board functions
function getAllBoards() {
    url = `${link}members/kvnagavishnuvardhan/boards?${access}`;
    return get(url);
}

function createBoardApiRequest(name) {
    url = `${link}boards/?name=${name}&defaultLists=false&${access}`;
    return post(url);
}

function updateBoardApiRequest(id, name) {
    url = `${link}boards/${id}?name=${name}&${access}`;
    return put(url);
}

function deleteBoardApiRequest(id) {
    url = `${link}boards/${id}?${access}`;
    return deleteReq(url);
}

//List functions
function getBoardLists(id) {
    url = `${link}boards/${id}/lists?fields=all&${access}`;
    return get(url);
}

function updateListApiRequest(id, name) {
    url = `${link}lists/${id}/?name=${name}&${access}`;
    return put(url);
}

function createListApiRequest(name) {
    const idBoard = JSON.parse(localStorage.getItem('boardId'));
    url = `${link}lists/?name=${name}&idBoard=${idBoard}&${access}`;
    return post(url);
}

// card functions
function getAllCardsInList(id) {
    url = `${link}lists/${id}/cards?${access}`;
    return get(url);
}

function createCardApiRequest(name, listId) {
    url = `${link}cards?name=${name}&idList=${listId}&${access}`
    return post(url);
}

function updateCardApiRequest(id, name) {
    url = `${link}cards/${id}?name=${name}&${access}`;
    return put(url);
}

function deleteCardApiRequest(id) {
    url = `${link}cards/${id}?${access}`;
    return deleteReq(url);
}
// ------------------------------------------------------------------------------
const header = document.getElementById('header');
const container = document.getElementById('container');
const popUp = document.getElementById('popUp');
const title = document.getElementById('title');
title.style.fontWeight = 'bold';

document.getElementById('header').addEventListener('click', goToHomePage);

refreshDOM();

function refreshDOM() {
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    if (!JSON.parse(localStorage.getItem('home'))) {
        title.innerText = 'Boards';
        header.style.background = 'blue';
        title.style.background = 'white';
        title.style.color = 'black';
        container.style.background = 'white';
        getAllBoards().then(boards => {
            for (let board of boards) {
                const boardUpdate = document.createElement('button');
                boardUpdate.className = 'boardUpdate';
                boardUpdate.innerText = 'Update';
                boardUpdate.addEventListener('click', updateBoardRequest);

                const boardDelete = document.createElement('button');
                boardDelete.className = 'boardUpdate boardDelete';
                boardDelete.innerText = 'Delete';
                boardDelete.addEventListener('click', deleteBoardRequest);

                const boardBtns = document.createElement('div');
                boardBtns.className = 'boardBtns';
                boardBtns.appendChild(boardUpdate);
                boardBtns.appendChild(boardDelete);

                const boardName = document.createElement('div');
                boardName.className = 'board_title';
                boardName.innerText = board.name;
                boardName.addEventListener('click', openBoard);

                const newBoard = document.createElement('div');
                newBoard.className = 'board';
                newBoard.setAttribute('boardId', board.id);
                newBoard.appendChild(boardName);
                newBoard.appendChild(boardBtns);

                container.appendChild(newBoard);
            }

            const createBoard = document.createElement('div');
            createBoard.className = 'board createBoard';
            createBoard.innerText = 'create Board';
            createBoard.addEventListener('click', createBoardRequest);
            container.append(createBoard);
        }).catch(error => {
            console.log(error);
        })
    } else {
        title.innerText = JSON.parse(localStorage.getItem('boardName'));
        title.style.color = 'white';
        header.style.background = 'darkgreen';
        title.style.background = 'green';
        container.style.background = 'green';
        getBoardLists(JSON.parse(localStorage.getItem('boardId'))).then(lists => {
            for (let list of lists) {
                const listUpdate = document.createElement('button');
                listUpdate.className = 'listUpdate';
                listUpdate.innerText = 'U'
                listUpdate.addEventListener('click', listUpdateRequest);

                const listBtns = document.createElement('div');
                listBtns.className = 'listbtns';
                listBtns.appendChild(listUpdate);

                const listText = document.createElement('div');
                listText.className = 'title';
                listText.style.fontWeight = 'bold';
                listText.innerText = list.name;

                const listTitle = document.createElement('div');
                listTitle.className = 'listHeader';
                listTitle.appendChild(listText);
                listTitle.appendChild(listBtns);

                const listContainer = document.createElement('div');
                listContainer.className = 'listContainer';
                listContainer.setAttribute('listId', list.id);
                listContainer.appendChild(listTitle);

                getAllCardsInList(list.id).then(cards => {
                    const cardContainer = document.createElement('div');
                    cardContainer.className = 'cardContainer';

                    for (let card of cards) {
                        const cardTitle = document.createElement('div');
                        cardTitle.className = 'cardTitle';
                        cardTitle.innerText = card.name;
                        cardTitle.addEventListener('click', openChecklistRequest);

                        const cardUpdate = document.createElement('button');
                        cardUpdate.innerText = 'U';
                        cardUpdate.className = 'listUpdate';
                        cardUpdate.addEventListener('click', updateCardRequest);

                        const cardDelete = document.createElement('button');
                        cardDelete.innerText = 'D';
                        cardDelete.className = 'listUpdate boardDelete';
                        cardDelete.addEventListener('click', deleteCardRequest);

                        const cardBtns = document.createElement('div');
                        cardBtns.className = 'cardBtns';
                        cardBtns.appendChild(cardUpdate);
                        cardBtns.appendChild(cardDelete);

                        const newCard = document.createElement('div');
                        newCard.className = 'cards';
                        newCard.setAttribute('cardId', card.id);
                        newCard.appendChild(cardTitle);
                        newCard.appendChild(cardBtns);

                        cardContainer.appendChild(newCard);
                    }

                    listContainer.appendChild(cardContainer);

                    const createCard = document.createElement('button');
                    createCard.className = 'addCard';
                    createCard.innerText = 'Add Card';
                    createCard.addEventListener('click', createCardRequest);

                    listContainer.appendChild(createCard);

                }).catch(error => {
                    console.log(error);
                })

                container.appendChild(listContainer);
            }
            const addList = document.createElement('div');
            addList.className = 'addList';
            addList.innerText = 'Add List';
            addList.addEventListener('click', addListRequest);

            container.append(addList);

        }).catch(error => {
            console.log(error);
        });

        const checklistDetails = JSON.parse(localStorage.getItem('checklist'));
        if(checklistDetails.status){
            const checklistName = document.createElement('div');
            checklistName.className = 'checklistName';
            checklistName.innerText = checklistDetails.name;

            const checklistClose = document.createElement('button');
            checklistClose.className = 'checklistClose';
            checklistClose.innerText = 'close';
            checklistClose.addEventListener('click', closeChecklistRequest);

            const checklistTitle = document.createElement('div');
            checklistTitle.className = 'checklistTitle';
            checklistTitle.appendChild(checklistName);
            checklistTitle.appendChild(checklistClose);

            const cardDetails = document.createElement('div');
            cardDetails.className = 'cardDetails';
            cardDetails.appendChild(checklistTitle);

            popUp.appendChild(cardDetails);

            document.body.append(popUp);
        }else{

        }

    }
}

async function openBoard() {
    localStorage.setItem('home', JSON.stringify(true));
    const boardId = event.srcElement.parentElement.getAttribute('boardId');
    localStorage.setItem('boardId', JSON.stringify(boardId));
    const boardName = event.srcElement.innerText;
    localStorage.setItem('boardName', JSON.stringify(boardName));
    refreshDOM();
}

function goToHomePage() {
    localStorage.setItem('home', JSON.stringify(false));
    localStorage.setItem('checklist', JSON.stringify({ name: '', status: false }));
    refreshDOM();
}

// board functions
async function createBoardRequest() {
    const name = prompt('Name of the board');
    if (name) {
        await createBoardApiRequest(name).then((data) => {
            console.log(data);
            alert('created a board');
        }).catch((error) => {
            console.log(error);
            alert('failed to create')
        });
        refreshDOM();
    } else {
        alert('failed to create')
    }
}

async function updateBoardRequest() {
    const id = event.srcElement.parentElement.parentElement.getAttribute('boardId');
    const name = prompt('New Title');
    if (name) {
        await updateBoardApiRequest(id, name).then(data => {
            console.log(data);
            alert('board Updated');
        }).catch(error => {
            console.log(error);
            alert('failed to Update');
        });
        refreshDOM();
    } else {
        alert('failed to Update');
    }
}

async function deleteBoardRequest() {
    const id = event.srcElement.parentElement.parentElement.getAttribute('boardId');
    const deleteConfirm = confirm('Are you sure?');
    if (deleteConfirm) {
        await deleteBoardApiRequest(id).then(data => {
            console.log(data);
            alert('board Deleted');
        }).catch(error => {
            console.log(error);
            alert('failed to delete');
        });
        refreshDOM();
    } else {
        alert('failed to delete');
    }
}

// list functions 
async function listUpdateRequest() {
    const id = event.srcElement.parentElement.parentElement.parentElement.getAttribute('listId');
    const name = prompt('New List Title');
    if (name) {
        await updateListApiRequest(id, name).then(data => {
            console.log(data);
            alert('List title updated');
        }).catch(error => {
            console.log(error);
            alert('Failed to update list title');
        })
        refreshDOM();
    } else {
        alert('Failed to update list title');
    }
}

async function addListRequest() {
    console.log('list Request');
    const name = prompt('List Title');
    if (name) {
        await createListApiRequest(name).then(data => {
            console.log(data);
            alert('List added to the board');
        }).catch(error => {
            console.log(error);
            alert('Failed to add list');
        })
        refreshDOM();
    } else {
        alert('falied to add list');
    }
}

// card Functions 
async function createCardRequest() {
    const listId = event.srcElement.parentElement.getAttribute('listId');
    const name = prompt('Card Title');
    if (name) {
        await createCardApiRequest(name, listId).then(data => {
            console.log(data);
            alert('card added to list');
        }).catch(error => {
            console.log(error);
            alert('failed to add card');
        });
        refreshDOM();
    } else {
        alert('failed to add card');
    }
}

async function updateCardRequest() {
    const id = event.srcElement.parentElement.parentElement.getAttribute('cardId');
    const name = prompt('New Title');
    if (name) {
        await updateCardApiRequest(id, name).then(data => {
            console.log(data);
            alert('Card updated');
        }).catch(error => {
            console.log(error);
            alert('Failed to update card');
        });
        refreshDOM();
    } else {
        alert('Failed to update card');
    }
}

async function deleteCardRequest() {
    console.log('delete Card Request')
    const id = event.srcElement.parentElement.parentElement.getAttribute('cardId');
    const deleteConfirm = confirm('Are you sure?')
    if (deleteConfirm) {
        await deleteCardApiRequest(id).then(data => {
            console.log(data);
            alert('Card deleted');
        }).catch(error => {
            console.log(error);
            alert('Failed to delete card');
        });
        refreshDOM();
    } else {
        alert('Failed to delete card');
    }
}

// checklists function
function openChecklistRequest() {
    console.log('open Checklist Request');
    const checklistName = event.srcElement.innerText;
    localStorage.setItem('checklist', JSON.stringify({ name: checklistName, status: true }));
    refreshDOM();
}

function closeChecklistRequest() {
    console.log('close Checklist Request');
    localStorage.setItem('checklist', JSON.stringify({ name: '', status: false }));
    refreshDOM();
}