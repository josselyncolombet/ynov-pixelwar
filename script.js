const canvas = document.getElementById('canvas');
let pageId
window.onload = () => {
    pageId = Math.floor(Math.random() * 100)
    console.log(pageId)
}
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = `${x},${y}`;
    const pixelData = { action: 'draw', data: { id, x, y, color: 'black' }, id: pageId };
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(pixelData));
    } else {
        console.error('WebSocket is not open: ', ws.readyState);
    }
});

ws.onmessage = (event) => {
    const {action, data} = JSON.parse(event.data);
    console.log(action, data)
    if(action == 'draw'){
        ctx.fillStyle = data.color;
        ctx.fillRect(data.x, data.y, 10, 10);  
    }
    else if (action == 'init'){
        Object.values(data).forEach(p => {
            console.log(p.color, p.x, p.y)
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 10, 10);  
        })
    }
   
};

ws.onclose = (event) => {
    console.log('WebSocket is closed: ', event.reason);
};

ws.onerror = (error) => {
    console.error('WebSocket error: ', error);
};
