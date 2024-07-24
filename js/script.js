document.addEventListener('DOMContentLoaded', () => {
    // Scroll section functionality
    const sections = document.querySelectorAll('.scroll-section');
    let currentSection = 0;

    const showSection = (index) => {
        if (index >= 0 && index < sections.length) {
            sections.forEach((section, i) => {
                if (i === index) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            currentSection = index;
        }
    };

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const scrollHandler = debounce((event) => {
        if (event.deltaY > 0) {
            // Scroll down
            showSection(currentSection + 1);
        } else {
            // Scroll up
            showSection(currentSection - 1);
        }
    }, 200);

    window.addEventListener('wheel', scrollHandler);

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
        const firstTouch = evt.touches[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal swipe (do nothing)
        } else {
            if (yDiff > 0) {
                // Swipe up
                showSection(currentSection + 1);
            } else {
                // Swipe down
                showSection(currentSection - 1);
            }
        }

        xDown = null;
        yDown = null;
    }

    document.querySelectorAll('.nav-menu button').forEach((button, index) => {
        button.addEventListener('click', () => {
            showSection(index);
            closeMenu(); // Close the menu on selection
        });
    });

    document.querySelector('.contact-us').addEventListener('click', contactUs);

    // Initially show the first section
    showSection(0);

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.fixed-nav')) {
            closeMenu();
        }
    });

    // Initialize carousels
    initializeCarousel('carousel1');
    initializeCarousel('carousel2');
    initializeCarousel('carousel3');
    initializeCarousel('carousel4');
    initializeCarousel('carousel5');
});

function contactUs() {
    alert('Booking a private demo...');
}

function toggleMenu() {
    const menuItems = document.querySelector('.menu-items');
    menuItems.classList.toggle('open');
}

function closeMenu() {
    const menuItems = document.querySelector('.menu-items');
    menuItems.classList.remove('open');
}

function showVideo(videoPath) {
    const videoModal = document.createElement('div');
    videoModal.classList.add('video-modal');
    videoModal.innerHTML = `
        <div class="video-container">
            <video controls autoplay>
                <source src="${videoPath}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button class="close-video" onclick="closeVideo()">Close</button>
        </div>
    `;
    document.body.appendChild(videoModal);
}

function closeVideo() {
    const videoModal = document.querySelector('.video-modal');
    if (videoModal) {
        document.body.removeChild(videoModal);
    }
}

function details(videoPath) {
    showVideo(videoPath);
}

function initializeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const carouselPanels = carousel.querySelectorAll('.carousel-panel');
    const loadingBars = carousel.querySelectorAll('.loading-bar');
    const dots = carousel.parentElement.querySelectorAll('.dot');
    let currentPanel = 0;
    let interval;
    let progress = 0;

    const showPanel = (index) => {
        carouselPanels.forEach((panel, i) => {
            if (i === index) {
                panel.classList.add('active');
                loadingBars[i].style.width = '0%';
                if (dots[i]) dots[i].classList.add('active');
                progress = 0;
            } else {
                panel.classList.remove('active');
                loadingBars[i].style.width = '0%';
                if (dots[i]) dots[i].classList.remove('active');
            }
        });
    };

    const updateLoadingBar = () => {
        if (progress < 100) {
            progress += 0.2;
            loadingBars[currentPanel].style.width = `${progress}%`;
        } else {
            nextPanel();
        }
    };

    const nextPanel = () => {
        clearInterval(interval);
        progress = 0;
        currentPanel = (currentPanel + 1) % carouselPanels.length;
        showPanel(currentPanel);
        interval = setInterval(updateLoadingBar, 30);
    };

    const prevPanel = () => {
        clearInterval(interval);
        progress = 0;
        currentPanel = (currentPanel - 1 + carouselPanels.length) % carouselPanels.length;
        showPanel(currentPanel);
        interval = setInterval(updateLoadingBar, 30);
    };

    const pauseCarousel = () => {
        clearInterval(interval);
    };

    const resumeCarousel = () => {
        interval = setInterval(updateLoadingBar, 30);
    };

    carousel.addEventListener('touchstart', pauseCarousel);
    carousel.addEventListener('touchend', resumeCarousel);
    carousel.addEventListener('mousedown', pauseCarousel);
    carousel.addEventListener('mouseup', resumeCarousel);

    interval = setInterval(updateLoadingBar, 30);

    // Swipe functionality for carousel
    let startX;
    const handleSwipe = (startX, endX) => {
        if (startX - endX > 50) {
            // Swipe left
            nextPanel();
        } else if (endX - startX > 50) {
            // Swipe right
            prevPanel();
        }
    };

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        handleSwipe(startX, endX);
    });

    // Functions for navigating panels with arrows
    carousel.parentElement.querySelector('.left-arrow').addEventListener('click', prevPanel);
    carousel.parentElement.querySelector('.right-arrow').addEventListener('click', nextPanel);
}
