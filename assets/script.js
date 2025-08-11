// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const menuOverlay = document.querySelector('.menu-overlay');
const header = document.querySelector('.header');
const backToTop = document.getElementById('back-to-top');
const menuModal = document.getElementById('menu-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const menuSection = document.getElementById('menu');
const menuGrid = menuSection.querySelector('.grid');

// Menu categories
const categories = [
    { name: 'caffetteria', icon: 'fa-coffee' },
    { name: 'bevande', icon: 'fa-glass-water' },
    { name: 'birre', icon: 'fa-beer' },
    { name: 'aperitivi', icon: 'fa-wine-glass' },
    { name: 'panini', icon: 'fa-burger' },
    { name: 'amari', icon: 'fa-glass-whiskey' },
    { name: 'cocktail', icon: 'fa-martini-glass-citrus' },
    { name: 'vini', icon: 'fa-wine-bottle' },
    { name: 'whiskey', icon: 'fa-whiskey-glass' },
    { name: 'distillati', icon: 'fa-bottle-droplet' }
];

let menuData = {};

// Load menu data from JSON file
async function loadMenuData() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error('Errore nel caricamento del menu');
        menuData = await response.json();
    } catch (error) {
        console.error('Errore durante il caricamento del menu:', error);
    }
}

// Initialize menu buttons
function initMenu() {
    menuGrid.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'menu-category-btn bg-white rounded-full p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300';
        button.innerHTML = `
            <i class="fas ${category.icon} text-3xl mb-2 text-[#fcd401]"></i>
            <span class="font-bold">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
        `;
        button.addEventListener('click', () => openMenuModal(category.name));
        menuGrid.appendChild(button);
    });
}

// Open menu modal with category items
function openMenuModal(category) {
    const items = menuData[category] || [];
    modalTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    modalContent.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'border-b border-gray-200 pb-4';

        if (category === 'panini' || category === 'cocktail') {
            itemElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg">${item.name}</h4>
                    <span class="font-black">€${item.price}</span>
                </div>
                <p class="text-gray-600 mb-2">${item.description || ''}</p>
                <p class="text-sm text-gray-500"><strong>Ingredienti:</strong> ${item.ingredients || ''}</p>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="flex justify-between">
                    <span>${item.name}</span>
                    <span class="font-black">€${item.price}</span>
                </div>
            `;
        }

        modalContent.appendChild(itemElement);
    });

    menuModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close menu modal
function closeMenuModal() {
    menuModal.classList.remove('open');
    document.body.style.overflow = '';
}

// Toggle menu overlay
function toggleMenu() {
    menuOverlay.classList.toggle('open');
    document.querySelector('#menu-toggle div span:nth-child(1)').classList.toggle('rotate-45');
    document.querySelector('#menu-toggle div span:nth-child(2)').classList.toggle('opacity-0');
    document.querySelector('#menu-toggle div span:nth-child(3)').classList.toggle('-rotate-45');
    document.querySelector('#menu-toggle div').classList.toggle('transform');
    document.querySelector('#menu-toggle div').classList.toggle('translate-y-1.5');

    document.body.style.overflow = menuOverlay.classList.contains('open') ? 'hidden' : '';
}

// Scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('hidden');
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
    } else if (currentScroll < lastScroll) {
        header.classList.remove('hidden');
    }
    lastScroll = currentScroll;

    backToTop.classList.toggle('visible', currentScroll > 300);
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (menuOverlay.classList.contains('open')) toggleMenu();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Close modal when clicking outside
menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        closeMenuModal();
    }
});

// Event listeners
menuToggle.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);
closeModal.addEventListener('click', closeMenuModal);

// Theme functions
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun text-xl"></i>';
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon text-xl"></i>';
    }
}

function autoThemeBasedOnTime() {
    const hours = new Date().getHours();
    const isNightTime = hours >= 18 || hours <= 6;
    setTheme(isNightTime ? 'dark' : 'light');
}

        // Gallery modal functions
        function openGalleryModal(src, alt) {
            const modal = document.getElementById('gallery-modal');
            const img = document.getElementById('gallery-modal-image');
            img.src = src;
            img.alt = alt;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeGalleryModal() {
            document.getElementById('gallery-modal').classList.remove('open');
            document.body.style.overflow = '';
        }


		// Carousel functionality with mobile/desktop pictures
function initCarousel() {
    const carouselContainer = document.getElementById('carousel-container');

    // Desktop Slide
    const desktopSlides = [
	"img/hero.jpg",
	"img/photo5.jpg",
	"img/photo6.jpg",
	"img/slide2.jpg",
	"img/slide5.jpg"
    ];

    // Mobile Slide
    const mobileSlides = [
	"img/slide3.jpg",
	"img/slide1.jpg",
	"img/slide4.jpg",
	"img/slide2.jpg",
	"img/slide5.jpg"
    ];

    const isMobile = window.innerWidth <= 768;
    const slidesToUse = isMobile ? mobileSlides : desktopSlides;

    // Create slide
    slidesToUse.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
        slide.innerHTML = `
            <div class="parallax-img-container">
                <img src="${src}" alt="Urban Cafè">
                <div class="absolute inset-0 bg-black opacity-40"></div>
            </div>
        `;
        carouselContainer.appendChild(slide);
    });

    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('opacity-100');
        slides[currentSlide].classList.add('opacity-0');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.remove('opacity-0');
        slides[currentSlide].classList.add('opacity-100');
    }

    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const carouselHeight = carouselContainer.offsetHeight;
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                const scrollPercent = (scrollPosition / carouselHeight) * 100;
                img.style.transform = `translateY(-${scrollPercent * 1.5}px)`;
            }
        });
    });

    setInterval(nextSlide, 5000);
}

// Initialize all
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenuData();
	
            initCarousel();
            // Hide splash screen after 3 seconds
            setTimeout(() => {
                const splashScreen = document.getElementById('splash-screen');
                splashScreen.style.opacity = '1';
                splashScreen.style.transition = 'opacity 0.5s ease-out';
                
                setTimeout(() => {
                    splashScreen.style.opacity = '0';
                    setTimeout(() => {
                        splashScreen.remove();
                    }, 500);
                }, 2500);
            }, 500);
            
            // Gallery modal event listeners
            document.getElementById('close-gallery-modal').addEventListener('click', closeGalleryModal);
            document.getElementById('gallery-modal').addEventListener('click', (e) => {
                if (e.target === document.getElementById('gallery-modal')) {
                    closeGalleryModal();
                }
            });
    initMenu();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        autoThemeBasedOnTime();
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    ScrollReveal().reveal('.menu-item', {
        delay: 200,
        distance: '20px',
        origin: 'right',
        interval: 100
    });

    ScrollReveal().reveal('.gallery-item', {
        delay: 200,
        distance: '20px',
        origin: 'bottom',
        interval: 100
    });
});







