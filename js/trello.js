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
function getcheklistByIdApiRequest(id) {
    url = `${link}checklists/${id}?fields=name&cards=all&card_fields=name&${access}`
    return get(url);
}

function addItemApiRequest(id, name) {
    url = `${link}checklists/${id}/checkItems?name=${name}&${access}`;
    return post(url);
}

function deleteItemApiRequest(checklistId, itemId) {
    url = `${link}checklists/${checklistId}/checkItems/${itemId}?${access}`;
    return deleteReq(url);
}
// ------------------------------------------------------------------------------
const header = document.getElementById('header');
const container = document.getElementById('container');
const title = document.getElementById('title');
title.style.fontWeight = 'bold';

document.getElementById('header').addEventListener('click', goToHomePage);

boardRefresh();

function boardRefresh() {
    // removes previous elements from DOM
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    // creates home page if true
    if (JSON.parse(localStorage.getItem('home'))) {
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
        title.style.background = 'green';
        header.style.background = 'darkgreen';
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
    }
}

function listRefresh(element) {
    const listId = element.getAttribute('listId');
    const newConatiner = element.firstChild.nextSibling;
    const button = element.lastChild;
    while (newConatiner.children.length) {
        newConatiner.children[0].remove();
    }
    getAllCardsInList(listId).then(cards => {
        for (let card of cards) {
            // newConatiner.appendChild(document.createTextNode('Hello'));

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

            newConatiner.appendChild(newCard);
        }
    }).catch(error => {
        console.log(error);
    })
}

function popUpRefresh() {
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
                const cehcklistText = document.createElement('div');
                cehcklistText.innerText = checklist.name;

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
                checklistBox.addEventListener('click', stop);
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
        cardDetails.addEventListener('click', stop)

        const popUp = document.createElement('div');
        popUp.className = 'popUp';
        popUp.addEventListener('click', closeChecklistRequest);

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

function checklistRefresh(element) {
    const container = element.firstChild.nextSibling;
    const id = element.getAttribute('checklistId');
    const button = element.lastChild;
    while (container.children.length) {
        container.children[0].remove();
    }
    button.innerHtml = '';
    button.innerText = 'Add an Item';
    getcheklistByIdApiRequest(id).then(checkItems => {
        for (let toDo of checkItems.checkItems) {
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

            container.appendChild(listItemBox);
        }
    }).catch(error => {
        console.log(error);
    })
}

function openBoard() {
    localStorage.setItem('home', JSON.stringify(false));
    const boardId = event.srcElement.parentElement.getAttribute('boardId');
    localStorage.setItem('boardId', JSON.stringify(boardId));
    const boardName = event.srcElement.innerText;
    localStorage.setItem('boardName', JSON.stringify(boardName));
    boardRefresh();
}

function goToHomePage() {
    localStorage.setItem('home', JSON.stringify(true));
    localStorage.setItem('checklist', JSON.stringify({ id: 0, name: '', status: false }));
    boardRefresh();
}

// board functions
async function createBoardRequest() {
    let name;
    await getIput(event.srcElement).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await createBoardApiRequest(name).then((data) => {
            console.log(data);
            boardRefresh();
        }).catch((error) => {
            console.log(error);
        });
    }
}

async function updateBoardRequest() {
    const id = event.srcElement.parentElement.parentElement.getAttribute('boardId');
    let name;
    await updateInput(event.srcElement.parentElement.parentElement.firstChild).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    })
    if (name) {
        await updateBoardApiRequest(id, name).then(data => {
            console.log(data);
            boardRefresh();
        }).catch(error => {
            console.log(error);
        });
    }
}

async function deleteBoardRequest() {
    const id = event.srcElement.parentElement.parentElement.getAttribute('boardId');
    await deleteBoardApiRequest(id).then(data => {
        console.log(data);
        boardRefresh();
    }).catch(error => {
        console.log(error);
    });
}

// list functions 
async function listUpdateRequest() {
    const id = event.srcElement.parentElement.parentElement.parentElement.getAttribute('listId');
    let name;
    await updateInput(event.srcElement.parentElement.parentElement.firstChild).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await updateListApiRequest(id, name).then(data => {
            console.log(data);
            boardRefresh();
        }).catch(error => {
            console.log(error);
        })
    }
}

async function addListRequest() {
    event.stopPropagation();
    let name;
    await getIput(event.srcElement).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await createListApiRequest(name).then(data => {
            console.log(data);
            boardRefresh();
        }).catch(error => {
            console.log(error);
        })
    }
}

// card Functions 
async function createCardRequest() {
    event.preventDefault();
    const listContainer = event.srcElement.parentElement;
    const listId = event.srcElement.parentElement.getAttribute('listId');
    let name;
    await getIput(event.srcElement).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await createCardApiRequest(name, listId).then(data => {
            console.log(data);
            listRefresh(listContainer);
        }).catch(error => {
            console.log(error);
        });
    }
}

async function updateCardRequest() {
    const listContainer = event.srcElement.parentElement.parentElement.parentElement.parentElement;
    const id = event.srcElement.parentElement.parentElement.getAttribute('cardId');
    let name;
    await updateInput(event.srcElement.parentElement.parentElement.firstChild).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    })
    if (name) {
        await updateCardApiRequest(id, name).then(data => {
            console.log(data);
            listRefresh(listContainer);
        }).catch(error => {
            console.log(error);
        });
    }
}

async function deleteCardRequest() {
    const listContainer = event.srcElement.parentElement.parentElement.parentElement.parentElement;
    const id = event.srcElement.parentElement.parentElement.getAttribute('cardId');
    await deleteCardApiRequest(id).then(data => {
        console.log(data);
        listRefresh(listContainer);
    }).catch(error => {
        console.log(error);
    });
}

// checklists function
function openChecklistRequest() {
    const cardName = event.srcElement.innerText;
    const cardId = event.srcElement.parentElement.getAttribute('cardId');
    localStorage.setItem('checklist', JSON.stringify({ id: cardId, name: cardName, status: true }));
    popUpRefresh();
}

function closeChecklistRequest() {
    localStorage.setItem('checklist', JSON.stringify({ id: 0, name: '', status: false }));
    popUpRefresh();
}

async function addChecklistRequest() {
    event.stopPropagation();
    const cardId = event.srcElement.getAttribute('CardId');
    let name;
    await getIput(event.srcElement).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await addChecklistApiRequest(cardId, name).then(data => {
            console.log(data);
            popUpRefresh();
        }).catch(error => {
            console.log(error);
        });
    }
}

async function updateChecklistRequest() {
    event.stopPropagation();
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    let name;
    await updateInput(event.srcElement.parentElement.parentElement.firstChild).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    })
    // console.log(name);
    if (name) {
        await updateChecklistApiRequest(checklistId, name).then(data => {
            console.log(data);
            popUpRefresh();
        }).catch(error => {
            console.log(error);
        });
    }
}

async function deleteChecklistRequest() {
    event.stopPropagation();
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    await deleteChecklistApiRequest(checklistId).then(data => {
        console.log(data);
        popUpRefresh();
    }).catch(error => {
        console.log(error);
    });
}

// checklist item functions
async function addItemRequest() {
    event.preventDefault();
    event.stopPropagation();
    const checklistContainer = event.srcElement.parentElement;
    const checklistId = event.srcElement.parentElement.getAttribute('checklistId');
    let name;
    await getIput(event.srcElement).then(data => {
        name = data;
    }).catch(error => {
        console.log(error);
    });
    if (name) {
        await addItemApiRequest(checklistId, name).then(data => {
            console.log(data);
            checklistRefresh(checklistContainer);
        }).catch(error => {
            console.log(error);
        });
    }
}

async function deleteItemRequest() {
    event.stopPropagation();
    const checklistContainer = event.srcElement.parentElement.parentElement.parentElement;
    const checklistId = event.srcElement.parentElement.parentElement.parentElement.getAttribute('checklistId');
    const itemId = event.srcElement.parentElement.getAttribute('itemsId');
    await deleteItemApiRequest(checklistId, itemId).then(data => {
        console.log(data);
        checklistRefresh(checklistContainer);
    }).catch(error => {
        console.log(error);
    })
}

// get input function 
let inputText;
function getIput(element) {
    if(element.innerText)
    inputText = element.innerText;
    element.innerText = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.style.border = '1px solid';
    input.style.borderRadius = '5px';
    input.style.width = 'inherit';
    element.appendChild(input);
    input.focus();
    input.addEventListener('blur', getInputBack);
    return new Promise((resolve, reject) => {
        input.addEventListener('keypress', () => {
            if (event.keyCode === 13){
                input.blur();
                resolve((event.target.value).trim());
            }
        });
    });
}

// update input function
let preName;
function updateInput(element) {
    preName = element.innerText;
    element.innerText = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.style.border = '1px solid';
    input.style.borderRadius = '5px';
    input.style.width = 'inherit';
    input.value = preName;
    element.appendChild(input);
    input.focus();
    input.addEventListener('blur', getUpdateBack);
    return new Promise((resolve, reject) => {
        input.addEventListener('keypress', () => {
            event.stopPropagation();
            if (event.keyCode === 13) {
                if ((event.target.value).trim() === preName) {
                    element.innerHtml = '';
                    element.innerText = preName;
                    resolve('');
                } else {
                    resolve((event.target.value).trim());
                }
            }
        });
    });
}

function stop() {
    event.stopPropagation();
}

function getInputBack() {
    const element = event.srcElement.parentElement;
    element.innerHtml = '';
    element.innerText = inputText;
}

function getUpdateBack() {
    const element = event.srcElement.parentElement;
    element.innerHtml = '';
    element.innerText = preName;
}