const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const statusDiv = document.getElementById('status');
let isDrawing = false;
let startX, startY, radius;
let circles = [];
let redoStack = [];

const gradients = [
    ['hsla(217, 100%, 50%, 1)', 'hsla(186, 100%, 69%, 1)'],
    ['hsla(197, 100%, 63%, 1)', 'hsla(294, 100%, 55%, 1)'],
    ['hsla(333, 100%, 53%, 1)', 'hsla(33, 94%, 57%, 1)'],
    ['hsla(152, 100%, 50%, 1)', 'hsla(186, 100%, 69%, 1)'],
    ['hsla(94, 100%, 70%, 1)', 'hsla(0, 100%, 77%, 1)'],
    ['hsla(175, 79%, 63%, 1)', 'hsla(82, 96%, 57%, 1)']
];

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        radius = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);
        draw();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        isDrawing = false;
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];
        circles.push({ x: startX, y: startY, radius, gradient });
        redoStack = []; // Clear the redo stack whenever a new circle is drawn
    }
});

canvas.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    let hit = false;

    for (const circle of circles) {
        const distance = Math.sqrt((circle.x - clickX) ** 2 + (circle.y - clickY) ** 2);
        if (distance <= circle.radius) {
            hit = true;
            break;
        }
    }

    statusDiv.textContent = hit ? 'Hit' : 'Miss';
});

canvas.addEventListener('dblclick', (e) => {
    const clickX = e.offsetX;
    const clickY = e.offsetY;

    circles = circles.filter(circle => {
        const distance = Math.sqrt((circle.x - clickX) ** 2 + (circle.y - clickY) ** 2);
        return distance > circle.radius;
    });

    redraw();
});

resetButton.addEventListener('click', () => {
    circles = [];
    redoStack = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusDiv.textContent = '';
});

undoButton.addEventListener('click', () => {
    if (circles.length > 0) {
        const lastCircle = circles.pop();
        redoStack.push(lastCircle);
        redraw();
    }
});

redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const lastRedoCircle = redoStack.pop();
        circles.push(lastRedoCircle);
        redraw();
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const circle of circles) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        const gradient = ctx.createLinearGradient(circle.x - circle.radius, circle.y - circle.radius, circle.x + circle.radius, circle.y + circle.radius);
        gradient.addColorStop(0, circle.gradient[0]);
        gradient.addColorStop(1, circle.gradient[1]);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    if (isDrawing) {
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const circle of circles) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        const gradient = ctx.createLinearGradient(circle.x - circle.radius, circle.y - circle.radius, circle.x + circle.radius, circle.y + circle.radius);
        gradient.addColorStop(0, circle.gradient[0]);
        gradient.addColorStop(1, circle.gradient[1]);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }
}
