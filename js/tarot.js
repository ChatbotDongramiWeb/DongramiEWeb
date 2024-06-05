document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('card-container');
    container.style.transformStyle = 'preserve-3d'; // 3D 공간에서 렌더링
    const content = document.querySelector('.content');
    const initialCard = document.getElementById('initial-card');
    const owlImage = document.getElementById('owl-image');
    const cardCount = 22;
    const startAngle = -(Math.PI / 15); // 시작 각도를 조정하여 간격 넓힘
    const maxEndAngle = 3.4 * Math.PI / 3; // 끝 각도를 조정하여 간격 넓힘
    const visibleAngleRange = maxEndAngle - startAngle;
    const delayBetweenCards = 30;
    let isCardsFanned = false;
    let radius = 1.0;
    let initialCardX, initialCardY;
    let owlCenterX, owlCenterY;
    let selectedCard = null;
    let selectedCardStartTime = null;
    const maxScaleRatio = 1.1; // 최대 배율
    const maxTranslateX = -50; // 최대 X축 이동 거리
    const pastDiv = document.getElementById('card_past').getBoundingClientRect();
    const presentDiv = document.getElementById('card_present').getBoundingClientRect();
    const futureDiv = document.getElementById('card_future').getBoundingClientRect;

    function updateOwlCenter() {
        const owlRect = owlImage.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        owlCenterX = owlRect.left + owlRect.width / 2 - contentRect.left;
        owlCenterY = owlRect.top + owlRect.height / 2 - contentRect.top;
    }

    function resizeHandler() {
        const cardWidth = container.offsetWidth * 0.1;
        const cardHeight = container.offsetHeight * 0.2;
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        radius = Math.min(contentWidth, contentHeight) * 0.3;

        initialCardX = (contentWidth - cardWidth) / 2 + 30;
        initialCardY = (contentHeight - cardHeight) / 2;
        initialCard.style.left = `${initialCardX}px`;
        initialCard.style.top = `${initialCardY}px`;
        initialCard.style.width = `${cardWidth}px`;
        initialCard.style.height = `${cardHeight}px`;
        initialCard.style.position = 'absolute';
        initialCard.style.zIndex = '1';

        if (isCardsFanned) {
            updateOwlCenter();
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                const angle = (index / cardCount) * visibleAngleRange + startAngle;
                const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
                const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardHeight}px`;
                card.style.transition = 'transform 0s';
                card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
            });
        }
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('load', function() {
        updateOwlCenter();
        resizeHandler();
    });
    resizeHandler();
    initialCard.addEventListener('click', fanCards);

    owlImage.addEventListener('load', updateOwlCenter);

    function fanCards() {
        if (isCardsFanned) return;
        isCardsFanned = true;
        initialCard.style.display = 'none';
        const cardWidth = container.offsetWidth * 0.1;
        const cardHeight = container.offsetHeight * 0.2;
        updateOwlCenter();

        const cards = [];

        for (let i = 0; i < cardCount; i++) {
            setTimeout(() => {
                const angle = (i / cardCount) * visibleAngleRange + startAngle;
                const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
                const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                const card = document.createElement('div');
                card.className = 'card';
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardHeight}px`;
                card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                card.style.opacity = 1;
                container.appendChild(card);
                cards.push(card);

                card.addEventListener('mouseover', function(e) {
                    e.preventDefault();

                    // 다른 카드가 이미 선택되어 있다면 해제
                    if (selectedCard !== null && selectedCard !== this) {
                        const previousIndex = Array.from(cards).indexOf(selectedCard);
                        const previousAngle = (previousIndex / cardCount) * visibleAngleRange + startAngle;
                        const previousX = owlCenterX + radius * Math.cos(previousAngle) - cardWidth / 2;
                        const previousY = owlCenterY + radius * Math.sin(previousAngle) - cardHeight / 2;
                        selectedCard.style.transform = `translate(${previousX}px, ${previousY}px) rotate(${previousAngle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }

                    // 현재 카드 선택
                    selectedCard = this;
                    selectedCardStartTime = Date.now();
                    this.style.transformOrigin = 'center center';
                    this.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad) scale(${maxScaleRatio})`;
                });

                card.addEventListener('mouseout', function() {
                    if (selectedCard === this) {
                        this.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }
                });

                card.addEventListener('click', function(){
                    currentCard = selectedCard.getBoundingClientRect();
                    console.log(currentCard);

                    // const offsetX = pastDiv.left - currentCard.left;
                    // const offsetY = pastDiv.top - currentCard.top;

                    // selectedCard.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
            }, i * delayBetweenCards);
        }
    }
});
