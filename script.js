document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('card-container');
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const cardBackImage = new Image();
    cardBackImage.src = 'card.jpg'; // 카드 뒷면 이미지 파일 경로

    const cardWidth = 350; // 카드 너비
    const cardHeight = 600; // 카드 높이
    const cardCount = 22; // 카드 개수
    const radius = 1200; // 원의 반지름
    const startAngle = Math.PI / 2; // 시작 각도 (90도)
    const endAngle = 2 * Math.PI / 2; // 끝 각도 (180도)

    let currentAngle = 0;
    let isDragging = false;

    cardBackImage.onload = function() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawCards();
    }

    function drawCards() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < cardCount; i++) {
            const angle = startAngle + (i / cardCount) * (endAngle - startAngle) + currentAngle;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const rotation = angle + Math.PI / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.drawImage(cardBackImage, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
            ctx.restore();
        }
        requestAnimationFrame(drawCards);
    }

    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mouseleave', stopDrag);

    function startDrag(e) {
        isDragging = true;
        lastMouseX = e.clientX;
    }

    function drag(e) {
        if (!isDragging) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const angle = Math.atan2(mouseY, mouseX);
        currentAngle = angle - startAngle;
    }

    function stopDrag() {
        isDragging = false;
    }
});