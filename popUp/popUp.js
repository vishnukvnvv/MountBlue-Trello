document.getElementById('popUp').addEventListener('click', popUp);

function popUp() {
    console.log('popUp')
    const div = document.createElement('div');
    div.className = 'popUp';

    const innerDiv = document.createElement('div');
    innerDiv.className = 'popUpContent';

    div.appendChild(innerDiv);
    document.body.append(div);
}