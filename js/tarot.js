document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('card-container');
    const content = document.querySelector('.content');
    const initialCard = document.getElementById('initial-card');
    const cardCount = 78;
    const startAngle = -(Math.PI / 15);
    const maxEndAngle = 3.25 * Math.PI / 3; // 최대 270도
    const visibleAngleRange = maxEndAngle - startAngle;
    const delayBetweenCards = 30; // milliseconds
    let isCardsFanned = false;
    let radius; // 반지름 변수 추가
    let initialCardX, initialCardY; // 초기 카드 좌표 저장

    function resizeHandler() {
        const cardWidth = container.offsetWidth * 0.1; // 10% of container's width
        const cardHeight = container.offsetHeight * 0.2; // 20% of container's height
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        // 반지름 값을 조정하여 카드가 .content 클래스로 제한된 영역 내에 위치하도록 함
        radius = Math.min(contentWidth, contentHeight) * 0.4;

        // 초기 카드 이미지를 정확히 가운데에 위치시킴
        initialCardX = (contentWidth - cardWidth) / 2;
        initialCardY = (contentHeight - cardHeight) / 2;
        initialCard.style.left = `${initialCardX}px`+10;
        initialCard.style.top = `${initialCardY}px`;
        initialCard.style.width = `${cardWidth}px`;
        initialCard.style.height = `${cardHeight}px`;

        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            const angle = (index / cardCount) * visibleAngleRange + startAngle;
            const x = initialCardX + radius * Math.cos(angle) - cardWidth / 2 + 20;
            const y = initialCardY + radius * Math.sin(angle) - cardHeight / 2 + 20;
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
        });
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('load', resizeHandler); // 초기 로드 시에도 실행
    resizeHandler();
    initialCard.addEventListener('click', fanCards);

    function fanCards() {
        if (isCardsFanned) return;
        isCardsFanned = true;
        const cardWidth = container.offsetWidth * 0.1;
        const cardHeight = container.offsetHeight * 0.2;
        for (let i = 0; i < cardCount; i++) {
            setTimeout(() => {
                const angle = (i / cardCount) * visibleAngleRange + startAngle;
                const x = initialCardX + radius * Math.cos(angle) - cardWidth / 2 + 60;
                const y = initialCardY + radius * Math.sin(angle) - cardHeight / 2 + 60;
                const card = document.createElement('div');
                card.className = 'card';
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardHeight}px`;
                card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                card.style.opacity = 1;
                container.appendChild(card);
            }, i * delayBetweenCards);
        }
        resizeHandler();
    }
});

