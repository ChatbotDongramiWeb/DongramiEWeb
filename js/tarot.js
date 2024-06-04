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

        initialCardX = (contentWidth - cardWidth) / 2 + 20;
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
                card.style.transform = `translate(${x - maxTranslateX * 0.5}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
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
        initialCard.style.display='none';
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
                card.style.transform = `translate(${x - maxTranslateX * 0.5}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                card.style.opacity = 1;
                container.appendChild(card);
                cards.push(card);

                card.addEventListener('mouseover', function(e) {
                    e.preventDefault();

                    // 다른 카드가 이미 선택되어 있다면 해제
                    if (selectedCard !== null && selectedCard !== this) {
                        selectedCard.style.transform = `translate(${x - maxTranslateX * 0.5}px, ${y}px) rotate(${angle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }

                    // 현재 카드 선택
                    selectedCard = this;
                    selectedCardStartTime = Date.now();
                    this.style.transformOrigin = 'center center';
                    this.style.transform = `translate(${x - maxTranslateX * 0.7}px, ${y}px) rotate(${angle + Math.PI / 2}rad) scale(${maxScaleRatio})`;
                });

                card.addEventListener('mouseout', function() {
                    if (selectedCard === this) {
                        this.style.transform = `translate(${x - maxTranslateX * 0.5}px, ${y}px) rotate(${angle + Math.PI / 2}rad) scale(1)`;
                        selectedCardStartTime = null;
                        selectedCard = null;
                    }
                });
            }, i * delayBetweenCards);
        }
    }
});

// document.addEventListener("DOMContentLoaded", function() {
//     const container = document.getElementById('card-container');
//     const content = document.querySelector('.content');
//     const initialCard = document.getElementById('initial-card');
//     const owlImage = document.getElementById('owl-image'); // 부엉이 이미지
//     const cardCount = 78;
//     const startAngle = -(Math.PI / 15);
//     const maxEndAngle = 3.25 * Math.PI / 3; // 최대 270도
//     const visibleAngleRange = maxEndAngle - startAngle;
//     const delayBetweenCards = 30; // milliseconds
//     let isCardsFanned = false;
//     let radius = 0.3; // 반지름 변수 추가, 0.3으로 설정
//     let initialCardX, initialCardY; // 초기 카드 좌표 저장
//     let owlCenterX, owlCenterY;

//     function updateOwlCenter() {
//         const owlRect = owlImage.getBoundingClientRect();
//         const contentRect = content.getBoundingClientRect();
//         owlCenterX = owlRect.left + owlRect.width / 2 - contentRect.left;
//         owlCenterY = owlRect.top + owlRect.height / 2 - contentRect.top;
//     }

//     function resizeHandler() {
//         const cardWidth = container.offsetWidth * 0.1; // 10% of container's width
//         const cardHeight = container.offsetHeight * 0.2; // 20% of container's height
//         const contentWidth = content.offsetWidth;
//         const contentHeight = content.offsetHeight;

//         // 반지름 값을 조정하여 카드가 .content 클래스로 제한된 영역 내에 위치하도록 함
//         radius = Math.min(contentWidth, contentHeight) * 0.3; // 반지름을 0.3으로 설정

//         // 초기 카드 이미지를 정확히 가운데에 위치시킴, 오른쪽으로 약간 이동
//         initialCardX = (contentWidth - cardWidth) / 2 + 20; // 오른쪽으로 20px 이동
//         initialCardY = (contentHeight - cardHeight) / 2;
//         initialCard.style.left = `${initialCardX}px`;
//         initialCard.style.top = `${initialCardY}px`;
//         initialCard.style.width = `${cardWidth}px`;
//         initialCard.style.height = `${cardHeight}px`;
//         initialCard.style.position = 'absolute'; // 초기 카드 이미지의 position 속성을 absolute로 설정
//         initialCard.style.zIndex = '1'; // 초기 카드 이미지가 다른 요소 위에 표시되도록 z-index 설정

//         if (isCardsFanned) {
//             updateOwlCenter(); // 부엉이 중심 업데이트
//             const cards = document.querySelectorAll('.card');
//             cards.forEach((card, index) => {
//                 const angle = (index / cardCount) * visibleAngleRange + startAngle;
//                 const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
//                 const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
//                 card.style.width = `${cardWidth}px`;
//                 card.style.height = `${cardHeight}px`;
//                 card.style.transition = 'transform 0s'; // 이동 시 시간차를 없앰
//                 card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
//             });
//         }
//     }

//     window.addEventListener('resize', resizeHandler);
//     window.addEventListener('load', function() {
//         updateOwlCenter();
//         resizeHandler();
//     }); // 초기 로드 시에도 실행
//     resizeHandler();
//     initialCard.addEventListener('click', fanCards);

//     owlImage.addEventListener('load', updateOwlCenter); // 부엉이 이미지 로드 후 중심 좌표 업데이트

//     function fanCards() {
//         if (isCardsFanned) return;
//         isCardsFanned = true;
//         initialCard.style.display = 'none'; // 초기 카드 이미지 숨기기 (주석 처리)
//         const cardWidth = container.offsetWidth * 0.1;
//         const cardHeight = container.offsetHeight * 0.2;
//         updateOwlCenter(); // 부엉이 중심 업데이트

//         const cards = []; // 카드 요소를 저장할 배열

//         for (let i = 0; i < cardCount; i++) {
//             setTimeout(() => {
//                 const angle = (i / cardCount) * visibleAngleRange + startAngle;
//                 const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
//                 const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
//                 const card = document.createElement('div');
//                 card.className = 'card';
//                 card.style.width = `${cardWidth}px`;
//                 card.style.height = `${cardHeight}px`;
//                 card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
//                 card.style.opacity = 1;
//                 container.appendChild(card);
//                 cards.push(card); // 생성된 카드 요소를 배열에 추가

//                 // 호버 이벤트 추가
//                 card.addEventListener('mouseover', function(e) {
//                     e.preventDefault(); // 기본 동작 방지
//                     this.style.zIndex = '1'; // 호버된 카드가 앞으로 오도록 z-index 설정  
//                 });

//                 card.addEventListener('mouseout', function() {
//                     this.style.zIndex = '0'; // 원래 z-index 값으로 되돌리기
//                 });
//             }, i * delayBetweenCards);
//         }
//     }
// });