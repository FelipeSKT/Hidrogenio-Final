document.addEventListener('DOMContentLoaded', () => {
    const modoNoturnoIcon = document.getElementById('modo-noturno');
    const overlay = document.getElementById('overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const centralButton = document.querySelector('.central-button');
    const interactiveObjectsContainer = document.getElementById('interactive-objects');

    let interactiveObjects = [];
    let surroundingObjects = [];
    let vortexActive = false;

    const lightParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#000000' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: true, color: '#000000' },
            move: { enable: true, speed: 0.6 }
        }
    };

    const darkParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: true, color: '#ffffff' },
            move: { enable: true, speed: 0.6 }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: false,
                    mode: 'push'
                }
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        }
    };

    const leafParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#00ff00' },
            shape: { type: 'image', image: { src: 'folha.png', width: 100, height: 100 } },
            opacity: { value: 1, random: true },
            size: { value: 15, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 1.5, direction: 'bottom' }
        }
    };

    const starParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#ffffff' },
            shape: { type: 'image', image: { src: 'star.png', width: 100, height: 100 } },
            opacity: { value: 0.7, random: true },
            size: { value: 6, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 0.2 }
        }
    };

    const loadParticlesConfig = (isNightMode) => {
        const config = isNightMode ? darkParticlesConfig : lightParticlesConfig;
        particlesJS('particles-js', config);
    };

    const loadMainParticlesConfig = (isNightMode) => {
        const config = isNightMode ? starParticlesConfig : leafParticlesConfig;
        particlesJS('particles-main', config);
    };

    const createInteractiveObject = (id, src, x, y, link, isCentral = false) => {
        const obj = document.createElement('div');
        obj.classList.add('interactive-object');
        if (isCentral) {
            obj.classList.add('central-object');
        }
        obj.style.left = `${x}px`;
        obj.style.top = `${y}px`;

        const img = document.createElement('img');
        img.src = src;
        img.alt = `object-${id}`;

        obj.appendChild(img);
        interactiveObjectsContainer.appendChild(obj);

        if (!isCentral) {
            obj.addEventListener('click', () => {
                anime({
                    targets: obj,
                    scale: 1.5,
                    opacity: 0.6,
                    easing: 'easeInOutQuad',
                    duration: 200,
                    direction: 'alternate'
                });
                window.open(link, '_blank');
                scrollToElementIfNeeded(obj);
            });

            obj.addEventListener('mouseenter', () => {
                anime({
                    targets: obj,
                    scale: 1.2,
                    opacity: 0.8,
                    easing: 'easeInOutQuad',
                    duration: 300
                });
            });

            obj.addEventListener('mouseleave', () => {
                anime({
                    targets: obj,
                    scale: 1,
                    opacity: 1,
                    easing: 'easeInOutQuad',
                    duration: 300
                });
            });
        }

        return obj;
    };

    const initializeInteractiveObjects = () => {
        const centralPosition = getCentralPosition();
        const surroundingPositions = [
            { angle: 45, distance: 90 },
            { angle: 90, distance: 90 },
            { angle: 135, distance: 90 },
            { angle: 180, distance: 90 },
            { angle: 225, distance: 90 },
            { angle: 270, distance: 90 },
            { angle: 315, distance: 90 },
            { angle: 360, distance: 90 },
        ];
        const srcs = [
            'botao/atomic.png',
            'botao/usina.png',
            'botao/arvore.png',
            'botao/agua.png',
            'botao/carro.png',
            'botao/company.png',
            'botao/economia.png',
            'botao/industrial.png',
            'botao/sol.png'
        ];
        const infoLinks = [
            'https://www.iberdrola.com/sustentabilidade/hidrogenio-verde',
            'https://www.complexodopecem.com.br/estudo-de-impacto-ambiental-do-hub-de-hidrogenio-verde-no-pecem-e-apresentado-em-audiencia-publica/',
            'https://propeq.com/hidrogenio-verde-producao/',
            'https://petrosolgas.com.br/estudantes-brasileiros-criam-carro-movido-a-partir-da-celula-de-hidrogenio-e-o-resultado-e-surreal/',
            'https://press.siemens.com/global/en/pressrelease/siemens-commissions-one-germanys-largest-green-hydrogen-generation-plants',
            'https://br.boell.org/sites/default/files/2021-05/Relatorio_Hidrogenio_Verde_Boll_FINAL.pdf',
            'https://revistapesquisa.fapesp.br/na-rota-do-hidrogenio-sustentavel/',
            'https://braziljournal.com/eua-avancam-na-fusao-nuclear-abrindo-caminho-para-energia-limpa-e-infinita/',
        ];

        const centralObject = createInteractiveObject(0, srcs[0], centralPosition.x, centralPosition.y, null, true);
        interactiveObjects.push(centralObject);

        surroundingPositions.forEach((pos, index) => {
            const angleInRadians = pos.angle * (Math.PI / 180);
            const x = centralPosition.x + pos.distance * Math.cos(angleInRadians) - 25;
            const y = centralPosition.y + pos.distance * Math.sin(angleInRadians) - 25;
            const obj = createInteractiveObject(index + 1, srcs[index + 1], x, y, infoLinks[index]);
            surroundingObjects.push(obj);
        });
    };

    const updateObjectPositions = () => {
        const centralPosition = getCentralPosition();
        const centralObject = interactiveObjects[0];
        centralObject.style.left = `${centralPosition.x - 25}px`;
        centralObject.style.top = `${centralPosition.y - 25}px`;

        surroundingObjects.forEach((obj, index) => {
            const angleInRadians = (index * 45) * (Math.PI / 180);
            obj.style.left = `${centralPosition.x + 0 * Math.cos(angleInRadians) - 25}px`;
            obj.style.top = `${centralPosition.y + 0 * Math.sin(angleInRadians) - 25}px`;
        });
    };

    const toggleVortexAnimation = () => {
        if (window.innerWidth <= 768) {
            if (vortexActive) {
                anime({
                    targets: surroundingObjects,
                    opacity: 0,
                    translateX: 0,
                    translateY: 0,
                    scale: 0,
                    easing: 'easeInExpo',
                    duration: 500,
                    delay: anime.stagger(100)
                });
            } else {
                anime({
                    targets: surroundingObjects,
                    opacity: 1,
                    translateX: 0,
                    translateY: (el, i) => (i + 1) * 60,
                    scale: 1,
                    easing: 'easeOutExpo',
                    duration: 500,
                    delay: anime.stagger(100)
                });
            }
        } else {
            if (vortexActive) {
                anime({
                    targets: surroundingObjects,
                    opacity: 0,
                    translateX: 0,
                    translateY: 0,
                    scale: 0,
                    easing: 'easeInExpo',
                    duration: 1000,
                    delay: anime.stagger(100, { start: 300 })
                });
            } else {
                anime({
                    targets: surroundingObjects,
                    opacity: 1,
                    translateX: (el, i) => {
                        const angleInRadians = (i * 45) * (Math.PI / 180);
                        return 150 * Math.cos(angleInRadians);
                    },
                    translateY: (el, i) => {
                        const angleInRadians = (i * 45) * (Math.PI / 180);
                        return 150 * Math.sin(angleInRadians);
                    },
                    scale: 1,
                    easing: 'easeOutExpo',
                    duration: 1000,
                    delay: anime.stagger(100, { start: 300 })
                });
            }
        }
        vortexActive = !vortexActive;

        if (window.innerWidth <= 768) {
            surroundingObjects.forEach((obj, i) => {
                setTimeout(() => {
                    scrollToElementIfNeeded(obj);
                }, i * 500);
            });
        }
    };

    const resetOverlayElements = () => {
        vortexActive = false;
        surroundingObjects.forEach(obj => {
            obj.style.opacity = '0';
            obj.style.transform = 'translateX(0) translateY(0) scale(0)';
        });
    };

    const resetOverlay = () => {
        overlay.style.display = 'none';

        interactiveObjectsContainer.innerHTML = '';
        interactiveObjects = [];
        surroundingObjects = [];
        initializeInteractiveObjects();
        updateObjectPositions();
        resetOverlayElements();
    };

    closeOverlay.addEventListener('click', function() {
        resetOverlay();
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            resetOverlay();
        }
    });

    overlay.style.display = 'none';

    const resetSite = () => {
        interactiveObjectsContainer.innerHTML = '';
        interactiveObjects = [];
        surroundingObjects = [];
        initializeInteractiveObjects();
        updateObjectPositions();
    };

    modoNoturnoIcon.addEventListener('click', function() {
        const isNightMode = document.body.classList.toggle('modo-noturno');
        modoNoturnoIcon.src = isNightMode ? 'icone_sol.png' : 'icone_lua.png';
        loadParticlesConfig(isNightMode);
        loadMainParticlesConfig(isNightMode);
        resetSite();
        if (isNightMode) {
            document.body.classList.add('modo-noturno');
        } else {
            document.body.classList.remove('modo-noturno');
        }
    });

    centralButton.addEventListener('click', function() {
        anime({
            targets: centralButton,
            scale: [1, 1.2, 1],
            rotate: '1turn',
            easing: 'easeInOutQuad',
            duration: 600,
        });

        overlay.style.display = 'flex';

        loadParticlesConfig(document.body.classList.contains('modo-noturno'));
        const centralObject = interactiveObjects[0];
        anime({
            targets: centralObject,
            opacity: 1,
            scale: 1,
            easing: 'easeOutExpo',
            duration: 1000
        });

        centralObject.addEventListener('click', function() {
            toggleVortexAnimation();
        });
    });

    closeOverlay.addEventListener('click', function() {
        overlay.style.display = 'none';

        vortexActive = false;
        surroundingObjects.forEach(obj => {
            obj.style.opacity = '0';
            obj.style.transform = 'translateX(0) translateY(0) scale(0)';
        });
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';

            vortexActive = false;
            surroundingObjects.forEach(obj => {
                obj.style.opacity = '0';
                obj.style.transform = 'translateX(0) translateY(0) scale(0)';
            });
        }
    });

    window.addEventListener('scroll', function() {
        const footer = document.querySelector('footer');
        footer.style.bottom = (window.scrollY + window.innerHeight >= document.body.offsetHeight) ? '0' : '-150px';
    });

    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    window.addEventListener('resize', updateObjectPositions);

    initializeInteractiveObjects();
    loadMainParticlesConfig(document.body.classList.contains('modo-noturno'));
    updateObjectPositions();
});

const getCentralPosition = () => {
    const isMobile = window.innerWidth <= 768;
    const centerX = window.innerWidth / 2;
    const centerY = isMobile ? 100 : window.innerHeight / 2;
    return { x: centerX, y: centerY };
};

const adjustOverlayForMobile = () => {
    if (window.innerWidth <= 768) {
        overlay.style.overflowY = 'auto';
    } else {
        overlay.style.overflowY = 'hidden';
    }
};

const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const scrollToElementIfNeeded = (el) => {
    if (!isElementInViewport(el)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.addEventListener('resize', adjustOverlayForMobile);
adjustOverlayForMobile();
