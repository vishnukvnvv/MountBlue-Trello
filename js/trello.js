const apiKey = 'apiKey';
const token = 'token';
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

// checklist functions 
function getChecklistApiRequest(id) {
    url = `${link}cards/${id}/checklists?${access}`;
    return get(url);
}

function addChecklistApiRequest(id, name) {
    url = `${link}checklists?name=${name}&idCard=${id}&${access}`;
    return post(url);
}

function updateChecklistApiRequest(id, name) {
    url = `${link}checklists/${id}?name=${name}&${access}`;
    return put(url);
}

function deleteChecklistApiRequest(id) {
    url = `${link}checklists/${id}?${access}`;
    return deleteReq(url);
}

// checklist item function
function addItemApiRequest(id, name) {
    url = `${link}checklists/${id}/checkItems?name=${name}&${access}`;
    return post(url);
}

function deleteItemApiRequest (checklistId, itemId) {
    url = `${link}checklists/${checklistId}/checkItems/${itemId}?${access}`;
    return deleteReq(url);
}
// ------------------------------------------------------------------------------
const header = document.getElementById('header');
const container = document.getElementById('container');
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
        if (checklistDetails.status) {
            const hasPopUp = document.getElementsByClassName('popUp');
            if (hasPopUp.length > 0) {
                document.body.lastElementChild.remove();
            }

            const cardName = document.createElement('div');
            cardName.className = 'cardName';
            cardName.innerText = checklistDetails.name;

            const cardClose = document.createElement('button');
            cardClose.className = 'cardClose';
            cardClose.innerText = 'close';
            cardClose.addEventListener('click', closeChecklistRequest);

            const checklistTitle = document.createElement('div');
            checklistTitle.className = 'checklistTitle';
            checklistTitle.appendChild(cardName);
            checklistTitle.appendChild(cardClose);

            const addChecklist = document.createElement('button');
            addChecklist.className = 'addChecklist';
            addChecklist.innerText = 'Add Checklist';
            addChecklist.setAttribute('cardId', checklistDetails.id);
            addChecklist.addEventListener('click', addChecklistRequest);

            const checklistContainer = document.createElement('div');
            checklistContainer.className = 'checklistContainer';

            getChecklistApiRequest(checklistDetails.id).then(checklists => {
                for (let checklist of checklists) {
                    const cehcklistText = document.createTextNode(checklist.name);

                    const checklistUpdate = document.createElement('button');
                    checklistUpdate.className = 'listUpdate';
                    checklistUpdate.innerText = 'U';
                    checklistUpdate.addEventListener('click', updateChecklistRequest);

                    const checklistDelete = document.createElement('button');
                    checklistDelete.className = 'listUpdate boardDelete';
                    checklistDelete.innerText = 'D';
                    checklistDelete.addEventListener('click', deleteChecklistRequest);

                    const checkListBtns = document.createElement('div');
                    checkListBtns.appendChild(checklistUpdate);
                    checkListBtns.appendChild(checklistDelete);

                    const checklistName = document.createElement('div');
                    checklistName.className = 'checklistName';
                    checklistName.appendChild(cehcklistText);
                    checklistName.appendChild(checkListBtns);

                    const checklistItems = document.createElement('div');
                    checklistItems.className = 'checklistItems';

                    for (let toDo of checklist.checkItems) {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';

                        const listItem = document.createTextNode(toDo.name);

                        const listItemContainer = document.createElement('div');
                        listItemContainer.appendChild(checkbox);
                        listItemContainer.appendChild(listItem);

                        const deleteItem = document.createElement('button');
                        deleteItem.innerText = 'D'
                        deleteItem.className = 'listUpdate boardDelete';
                        deleteItem.addEventListener('click', deleteItemRequest);

                        const listItemBox = document.createElement('div');
                        listItemBox.className = 'listItemBox';
                        listItemBox.setAttribute('itemsId', toDo.id);
                        listItemBox.appendChild(listItemContainer);
                        listItemBox.appendChild(deleteItem);

                        checklistItems.appendChild(listItemBox);
                    }

                    const addListItem = document.createElement('button');
                    addListItem.innerText = 'Add an Item';
                    addListItem.className = 'addChecklist';
                    addListItem.addEventListener('click', addItemRequest);

                    const checklistBox = document.createElement('div');
                    checklistBox.className = 'checklistBox';
                    checklistBox.setAttribute('checklistId', checklist.id);
                    checklistBox.appendChild(checklistName);
                    checklistBox.appendChild(checklistItems);
                    checklistBox.appendChild(addListItem);

                    checklistContainer.appendChild(checklistBox);
                }
            })

            const cardDetails = document.createElement('div');
            cardDetails.className = 'cardDetails';
            cardDetails.appendChild(checklistTitle);
            cardDetails.appendChild(addChecklist);
            cardDetails.appendChild(checklistContainer);

            const popUp = document.createElement('div');
            popUp.className = 'popUp';

            popUp.appendChild(cardDetails);

            document.body.append(popUp);
        } else {
            const popUp = document.getElementsByClassName('popUp');
            if (popUp.length > 0) {
                hasPopUp = false;
                document.body.lastElementChild.remove();
            }
        }
    }
}

function openBoard() {
    localStorage.setItem('home', JSON.stringify(true));
    const boardId = event.srcElement.parentElement.getAttribute('boardId');
    localStorage.setItem('boardId', JSON.stringify(boardId));
    const boardName = event.srcElement.innerText;
    localStorage.setItem('boardName', JSON.stringify(boardName));
    refreshDOM();
}

function goToHomePage() {
    localStorage.setItem('home', JSON.stringify(false));
    localStorage.setItem('checklist', JSON.stringify({ id: 0, name: '', status: false }));
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
    const cardName = event.srcElement.innerText;
    const cardId = event.srcElement.parentElement.getAttribute('cardId');
    localStorage.setItem('checklist', JSON.stringify({ id: cardId, name: cardName, status: true }));
    refreshDOM();
}

function closeChecklistRequest() {
    localStorage.setItem('checklist', JSON.stringify({ id: 0, name: '', status: false }));
    refreshDOM();
}

async function addChecklistRequest() {
    const cardId = event.srcElement.getAttribute('CardId');
    const name = prompt('New cheklist name?');
    if (name) {
        await addChecklistApiRequest(cardId, name).then(data => {
            console.log(data);
            alert('CheckList added');
        }).catch(error => {
            console.log(error);
            alert('Failed to add checkList');
        });
    } else {
        alert('Failed to add checkList');
    }
    refreshDOM();
}

async function updateChecklistRequest() {
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    const name = prompt('New Title');
    if (name) {
        await updateChecklistApiRequest(checklistId, name).then(data => {
            console.log(data);
            alert('checklist updated');
        }).catch(error => {
            console.log(error);
            alert('failed to upadte');
        });
    } else {
        alert('failed to upadte');
    }
    refreshDOM();
}

async function deleteChecklistRequest() {
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    console.log(checklistId);
    const deleteConfirm = confirm('Are you sure?');
    if (deleteConfirm) {
        await deleteChecklistApiRequest(checklistId).then(data => {
            console.log(data);
            alert('Checklist Deleted');
        }).catch(error => {
            console.log(error);
            alert('Failed to delete');
        });
    } else {
        alert('Failed to delete');
    }
    refreshDOM();
}

// checklist item functions
async function addItemRequest() {
    const checklistId = event.srcElement.parentElement.getAttribute('checklistId');
    const name = prompt('Add an Item');
    if (name) {
        await addItemApiRequest(checklistId, name).then(data => {
            console.log(data);
            alert('Item added');
        }).catch(error => {
            console.log(error);
            alert('Failed to add');
        });
    } else {
        alert('Failed to add');
    }
    refreshDOM();
}

async function deleteItemRequest() {
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    const itemId = event.srcElement.parentElement.getAttribute('itemsId');
    const deleteConfirm = confirm('Are you sure?');
    if(deleteConfirm){
        await deleteItemApiRequest(checklistId, itemId).then(data => {
            console.log(data);
            alert('Item Deleted');
        }).catch(error => {
            console.log(error);
            alert('Failed to Delete');
        })
    }else{
        alert('Failed to delete');
    }
    refreshDOM();
}