document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('card-container');
    container.style.transformStyle = 'preserve-3d'; // 3D 공간에서 렌더링
    const content = document.querySelector('.content');
    const initialCard = document.getElementById('initial-card');
    const owlImage = document.getElementById('owl-image');
    const cardCount = 22;
    const startAngle = -(Math.PI / 35); // 시작 각도를 조정하여 간격 넓힘
    const maxEndAngle = 3.25 * Math.PI / 3; // 끝 각도를 조정하여 간격 넓힘
    const visibleAngleRange = maxEndAngle - startAngle;
    const delayBetweenCards = 30;
    let isCardsFanned = false;
    let radius = 1.0;
    let owlCenterX, owlCenterY;
    let selectedCard = null;
    let selectedCardStartTime = null;
    const maxScaleRatio = 1.1; // 최대 배율
    const pastDiv = document.getElementById('card_past');
    const presentDiv = document.getElementById('card_present');
    const futureDiv = document.getElementById('card_future');

    const cards = [];
    let selectedCount = 0; // 선택된 카드 수를 추적하기 위한 변수

    function updateOwlCenter() {
        const owlRect = owlImage.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        
        owlCenterX = owlRect.left + owlRect.width / 2 - contentRect.left;
        owlCenterY = owlRect.top + owlRect.height / 2 - contentRect.top;
    }

    function resizeHandler() {
        const cardWidth = container.offsetWidth * 0.08;
        const cardHeight = container.offsetHeight * 0.18;
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;
    
        radius = Math.min(contentWidth, contentHeight) * 0.3;
    
        updateOwlCenter();
        initialCard.style.left = `${owlCenterX - cardWidth / 2}px`;
        initialCard.style.top = `${owlCenterY + 200}px`; // 부엉이 이미지 바로 아래로 배치
        initialCard.style.width = `${cardWidth}px`;
        initialCard.style.height = `${cardHeight}px`;
        initialCard.style.position = 'absolute';
        initialCard.style.zIndex = '1';
    
        if (isCardsFanned) {
            cards.forEach((cardObj, index) => {
                if (cardObj !== selectedCard && !cardObj.isMovedToDiv) {
                    const angle = (index / cardCount) * visibleAngleRange + startAngle;
                    const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2 - 20; // 중앙에서 왼쪽으로 20px 이동
                    const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                    cardObj.element.style.width = `${cardWidth}px`;
                    cardObj.element.style.height = `${cardHeight}px`;
                    cardObj.element.style.transition = 'transform 0s';
                    cardObj.element.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                    cardObj.x = x;
                    cardObj.y = y;
                    cardObj.angle = angle;
                }
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
        const cardWidth = container.offsetWidth * 0.08;
        const cardHeight = container.offsetHeight * 0.18;
        updateOwlCenter();

        for (let i = 0; i < cardCount; i++) {
            setTimeout(() => {
                const angle = (i / cardCount) * visibleAngleRange + startAngle;
                const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2 - 20; // 중앙에서 왼쪽으로 20px 이동
                const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                const card = document.createElement('div');
                card.className = 'card';
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardHeight}px`;
                card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                card.style.opacity = 1;
                card.style.position = 'absolute'; // 위치 고정을 위해 추가
                card.style.zIndex = '2'; // 초기 카드보다 위에 위치
                container.appendChild(card);

                const cardObj = {
                    element: card,
                    x: x,
                    y: y,
                    angle: angle,
                    isMovedToDiv: false, // 카드가 div로 이동되었는지 여부를 추적하기 위한 플래그
                };
                cards.push(cardObj);

                // 함수 참조를 변수에 저장하여 removeEventListener에서 사용 가능하게 함
                function onMouseOver(e) {
                    e.preventDefault();
                    if (selectedCard !== null && selectedCard !== cardObj) {
                        selectedCard.element.style.transform = `translate(${selectedCard.x}px, ${selectedCard.y}px) rotate(${selectedCard.angle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }
                    selectedCard = cardObj;
                    selectedCardStartTime = Date.now();
                    cardObj.element.style.transformOrigin = 'center center';
                    cardObj.element.style.transform = `translate(${cardObj.x}px, ${cardObj.y}px) rotate(${cardObj.angle + Math.PI / 2}rad) scale(${maxScaleRatio})`;
                }

                function onMouseOut() {
                    if (selectedCard === cardObj) {
                        cardObj.element.style.transform = `translate(${cardObj.x}px, ${cardObj.y}px) rotate(${cardObj.angle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }
                }

                card.addEventListener('mouseover', onMouseOver);
                card.addEventListener('mouseout', onMouseOut);

                card.addEventListener('click', function() {
                    if (selectedCard && selectedCount < 3) {
                        const destinationDiv = selectedCount === 0 ? pastDiv : selectedCount === 1 ? presentDiv : futureDiv;

                        destinationDiv.appendChild(selectedCard.element);
                        selectedCard.element.style.transform = '';
                        selectedCard.element.style.position = 'relative';
                        selectedCard.element.style.top = '0';
                        selectedCard.element.style.left = '0';
                        selectedCard.element.style.pointerEvents = 'none'; // 이동된 카드에 대한 이벤트 처리 방지
                        selectedCard.isMovedToDiv = true; // 카드가 div로 이동되었음을 표시
                        selectedCount++;
                        
                        // 이벤트 리스너 제거하여 다시 선택되지 않도록 설정
                        selectedCard.element.removeEventListener('mouseover', onMouseOver);
                        selectedCard.element.removeEventListener('mouseout', onMouseOut);

                        selectedCard = null;
                    } else if (selectedCount >= 3) {
                        console.log('You have already selected the maximum number of cards.');
                    } else {
                        console.error('No card selected');
                    }
                });
            }, i * delayBetweenCards);
        }

        // fanCards 함수가 모든 카드를 배치한 후 모달을 추가
        setTimeout(addModal, cardCount * delayBetweenCards);
    }

    function addModal() {
        const modalContent = `
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <!-- 모달의 본문 내용 -->
                            <p>과거 카드 뽑아줘~</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // 모달을 화면에 표시
        $('#myModal').modal('show');

        setTimeout(function() {
            $('#myModal').modal('hide');
        }, 1500);
    }
});
