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

        if (category === 'panini') {
            itemElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg">${item.name}</h4>
                    <span class="font-bold text-[#fcd401]">€${item.price}</span>
                </div>
                <p class="text-gray-600 mb-2">${item.description || ''}</p>
                <p class="text-sm text-gray-500"><strong>Ingredienti:</strong> ${item.ingredients || ''}</p>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="flex justify-between">
                    <span>${item.name}</span>
                    <span class="font-bold text-[#fcd401]">€${item.price}</span>
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

// Initialize all
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenuData();
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
