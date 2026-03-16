// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Проверяет, является ли устройство мобильным
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Копирует текст в буфер обмена
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Ошибка копирования:', err);
        return false;
    }
}

/**
 * Показывает уведомление
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// NAVIGATION
// ===================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

/**
 * Переключение мобильного меню
 */
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

/**
 * Закрытие меню при клике на ссылку
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/**
 * Закрытие меню при клике вне его
 */
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/**
 * Подсветка активного пункта меню при скролле
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

/**
 * Добавление тени хедеру при скролле
 */
function updateHeaderOnScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateHeaderOnScroll();
});

// ===================================
// PHONE NUMBER HANDLING
// ===================================

/**
 * Обработка кликов по номерам телефонов
 * На мобильных - звонок, на десктопе - копирование в буфер
 */
function setupPhoneHandlers() {
    const phoneLinks = document.querySelectorAll('.contact-phone');

    phoneLinks.forEach(link => {
        // На мобильных устройствах оставляем стандартное поведение tel:
        if (!isMobileDevice()) {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const phoneNumber = link.getAttribute('data-phone');
                const success = await copyToClipboard(phoneNumber);

                if (success) {
                    showNotification(`Номер ${phoneNumber} скопирован в буфер обмена`);
                } else {
                    showNotification('Не удалось скопировать номер', 'error');
                }
            });

            // Изменяем курсор для визуальной подсказки
            link.style.cursor = 'copy';
            link.title = 'Нажмите, чтобы скопировать номер';
        } else {
            link.title = 'Нажмите, чтобы позвонить';
        }
    });
}

// Инициализация обработчиков телефонов
setupPhoneHandlers();

// ===================================
// SCROLL ARROWS FOR GALLERY & REVIEWS
// ===================================

/**
 * Настройка стрелок прокрутки для галереи
 */
function setupScrollArrows() {
    // Галерея
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');

    if (galleryGrid && galleryPrev && galleryNext) {
        galleryPrev.addEventListener('click', () => {
            galleryGrid.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });

        galleryNext.addEventListener('click', () => {
            galleryGrid.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });

        // Обновление состояния кнопок
        galleryGrid.addEventListener('scroll', () => {
            updateScrollButtons(galleryGrid, galleryPrev, galleryNext);
        });

        // Начальное состояние
        updateScrollButtons(galleryGrid, galleryPrev, galleryNext);
    }

    // Отзывы
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewsPrev = document.getElementById('reviewsPrev');
    const reviewsNext = document.getElementById('reviewsNext');

    if (reviewsContainer && reviewsPrev && reviewsNext) {
        reviewsPrev.addEventListener('click', () => {
            reviewsContainer.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });

        reviewsNext.addEventListener('click', () => {
            reviewsContainer.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });

        // Обновление состояния кнопок
        reviewsContainer.addEventListener('scroll', () => {
            updateScrollButtons(reviewsContainer, reviewsPrev, reviewsNext);
        });

        // Начальное состояние
        updateScrollButtons(reviewsContainer, reviewsPrev, reviewsNext);
    }
}

/**
 * Обновление состояния кнопок прокрутки
 */
function updateScrollButtons(container, prevBtn, nextBtn) {
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
}

// Инициализация стрелок после загрузки DOM
document.addEventListener('DOMContentLoaded', setupScrollArrows);

// ===================================
// BRANDS PAGINATOR (MOBILE)
// ===================================

function setupBrandsPaginator() {
    const brandsGrid = document.querySelector('.brands-grid');
    if (!brandsGrid) return;

    const allCards = Array.from(brandsGrid.querySelectorAll('.brand-card'));
    const PER_PAGE = 12;
    let currentPage = 1;

    const paginator = document.createElement('div');
    paginator.className = 'brands-paginator';
    brandsGrid.insertAdjacentElement('afterend', paginator);

    function totalPages() {
        return Math.ceil(allCards.length / PER_PAGE);
    }

    function render() {
        const mobile = window.innerWidth < 768;

        if (!mobile) {
            allCards.forEach(c => { c.style.display = ''; });
            paginator.style.display = 'none';
            return;
        }

        // Блокируем высоту грида чтобы страница не прыгала при смене страницы
        const prevHeight = brandsGrid.offsetHeight;
        if (prevHeight > 0) brandsGrid.style.minHeight = prevHeight + 'px';

        const total = totalPages();
        if (currentPage > total) currentPage = total;
        const start = (currentPage - 1) * PER_PAGE;
        const end = start + PER_PAGE;

        allCards.forEach((card, i) => {
            card.style.display = (i >= start && i < end) ? '' : 'none';
        });

        paginator.style.display = 'flex';
        paginator.innerHTML = `
            <button class="brands-pag-btn" data-dir="prev" ${currentPage === 1 ? 'disabled' : ''}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <span class="brands-pag-info">${currentPage} / ${total}</span>
            <button class="brands-pag-btn" data-dir="next" ${currentPage === total ? 'disabled' : ''}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        paginator.querySelector('[data-dir="prev"]').addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; render(); }
        });
        paginator.querySelector('[data-dir="next"]').addEventListener('click', () => {
            if (currentPage < total) { currentPage++; render(); }
        });

        // Снимаем блокировку высоты после рендера
        requestAnimationFrame(() => { brandsGrid.style.minHeight = ''; });
    }

    render();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 150);
    });
}

document.addEventListener('DOMContentLoaded', setupBrandsPaginator);

// ===================================
// ALPHABET FILTER
// ===================================

const alphabetButtons = document.querySelectorAll('.alphabet-btn');
const productsList = document.getElementById('productsList');

alphabetButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс со всех кнопок
        alphabetButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс к нажатой кнопке
        button.classList.add('active');

        const letter = button.getAttribute('data-letter');

        // TODO: Здесь будет логика фильтрации товаров по букве
        // Когда будут добавлены реальные товары, можно будет фильтровать их:
        // const products = document.querySelectorAll('.product-item');
        // products.forEach(product => {
        //     if (letter === 'all' || product.getAttribute('data-letter') === letter) {
        //         product.style.display = 'block';
        //     } else {
        //         product.style.display = 'none';
        //     }
        // });

        console.log(`Фильтр по букве: ${letter}`);
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const scrollTopBtn = document.getElementById('scrollTop');

/**
 * Показ/скрытие кнопки "Наверх"
 */
function toggleScrollTopButton() {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

/**
 * Плавная прокрутка наверх
 */
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', toggleScrollTopButton);

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Пропускаем пустые якоря
        if (href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

/**
 * Добавление анимаций при появлении элементов в поле зрения
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Отключаем наблюдение после анимации
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за секциями и карточками
    const animatedElements = document.querySelectorAll(`
        .gallery-item,
        .catalog-card,
        .service-card,
        .brand-card,
        .partnership-card,
        .contact-card,
        .article-card,
        .review-card
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Запускаем анимации после загрузки страницы
window.addEventListener('load', setupScrollAnimations);

// ===================================
// ===================================
// GALLERY INTERACTION
// ===================================

/**
 * Обработка кликов по фотографиям галереи
 * TODO: Можно добавить лайтбокс для просмотра фото
 */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Клик по фото галереи');
        // TODO: Открыть лайтбокс с фото
        // openLightbox(item);
    });
});

// ===================================
// FORM VALIDATION & HANDLING
// ===================================

/**
 * Валидация форм (для будущих форм обратной связи, отзывов и т.д.)
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===================================
// LOCAL STORAGE UTILITIES
// ===================================

/**
 * Утилиты для работы с localStorage (для бонусной системы в будущем)
 */
const StorageHelper = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления из localStorage:', e);
            return false;
        }
    }
};

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

/**
 * Debounce функция для оптимизации обработчиков событий
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle функция для оптимизации обработчиков скролла
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Оптимизация обработчиков скролла
const optimizedScroll = throttle(() => {
    updateActiveNavLink();
    updateHeaderOnScroll();
    toggleScrollTopButton();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ===================================
// LAZY LOADING IMAGES
// ===================================

/**
 * Ленивая загрузка изображений для улучшения производительности
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Запускаем ленивую загрузку после загрузки DOM
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// ===================================
// KEYBOARD ACCESSIBILITY
// ===================================

/**
 * Улучшение доступности с клавиатуры
 */
document.addEventListener('keydown', (e) => {
    // ESC для закрытия мобильного меню
    if (e.key === 'Escape') {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Ctrl/Cmd + K для фокуса на поиске (если будет добавлен)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Фокус на поле поиска
        console.log('Поиск (будет добавлен позже)');
    }
});

// ===================================
// PRINT OPTIMIZATION
// ===================================

/**
 * Оптимизация для печати
 */
window.addEventListener('beforeprint', () => {
    console.log('Подготовка к печати...');
    // Можно добавить дополнительную логику перед печатью
});

window.addEventListener('afterprint', () => {
    console.log('Печать завершена');
});

// ===================================
// ERROR HANDLING
// ===================================

/**
 * Глобальная обработка ошибок
 */
window.addEventListener('error', (e) => {
    console.error('Ошибка:', e.error);
    // Можно добавить отправку ошибок на сервер для мониторинга
});

// ===================================
// CONSOLE INFO
// ===================================

console.log('%c🚗 Автозапчасти БЭЛЛА', 'font-size: 20px; font-weight: bold; color: #0066CC;');
console.log('%cСайт разработан с ❤️', 'font-size: 14px; color: #64748B;');
console.log('%cВерсия: 1.0.0', 'font-size: 12px; color: #94A3B8;');

// ===================================
// INITIALIZATION
// ===================================

/**
 * Инициализация всех компонентов после загрузки DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM загружен, инициализация компонентов...');

    // Проверка поддержки браузером всех необходимых API
    if ('IntersectionObserver' in window) {
        console.log('✅ IntersectionObserver поддерживается');
    } else {
        console.warn('⚠️ IntersectionObserver не поддерживается');
    }

    if ('clipboard' in navigator) {
        console.log('✅ Clipboard API поддерживается');
    } else {
        console.warn('⚠️ Clipboard API не поддерживается');
    }

    // Инициализируем начальное состояние
    updateActiveNavLink();
    updateHeaderOnScroll();
    toggleScrollTopButton();

    console.log('✅ Инициализация завершена');
});

// ===================================
// SERVICE WORKER (для будущего PWA)
// ===================================

/**
 * Регистрация Service Worker для оффлайн режима
 * TODO: Раскомментировать когда будет создан service-worker.js
 */
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration);
            })
            .catch(error => {
                console.error('❌ Ошибка регистрации Service Worker:', error);
            });
    });
}
*/

// ===================================
// DYNAMIC CONTENT LOADING
// ===================================

/**
 * Функции для динамической загрузки контента
 * Будут использоваться когда появится админ-панель
 */

// Загрузка статей
async function loadArticles() {
    try {
        // TODO: Запрос к API для получения статей
        // const response = await fetch('/api/articles');
        // const articles = await response.json();
        // renderArticles(articles);
        console.log('Загрузка статей (TODO)');
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
    }
}

// Загрузка отзывов
async function loadReviews() {
    try {
        // TODO: Запрос к API для получения отзывов
        // const response = await fetch('/api/reviews');
        // const reviews = await response.json();
        // renderReviews(reviews);
        console.log('Загрузка отзывов (TODO)');
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

// ===================================
// PRODUCTS MANAGEMENT
// ===================================

/**
 * Менеджер товаров с пагинацией и поиском
 */
class ProductsManager {
    constructor() {
        this.productsList = document.getElementById('productsList');
        this.productsStats = document.getElementById('productsStats');
        this.alphabetBtns = document.querySelectorAll('.alphabet-btn');
        this.searchInput = document.getElementById('productsSearch');
        this.searchClear = document.getElementById('searchClear');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.paginationFirst = document.getElementById('paginationFirst');
        this.paginationPrev = document.getElementById('paginationPrev');
        this.paginationNext = document.getElementById('paginationNext');
        this.paginationLast = document.getElementById('paginationLast');

        this.currentFilter = 'all';
        this.searchQuery = '';
        this.allProducts = [];
        this.filteredProducts = [];
        this.displayedProducts = [];
        this.isInitialized = false;

        // Настройки пагинации
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.totalPages = 1;
    }

    /**
     * Инициализация менеджера товаров
     */
    init() {
        if (this.isInitialized) return;

        // Проверяем наличие данных
        if (!window.productsData || !window.productsData.PRODUCTS_DATA) {
            this.showError('Данные о товарах не загружены');
            console.error('❌ productsData не найден в window');
            return;
        }

        this.allProducts = window.productsData.PRODUCTS_DATA;
        this.filteredProducts = [...this.allProducts];

        // Настраиваем фильтры
        this.setupFilters();

        // Настраиваем поиск
        this.setupSearch();

        // Настраиваем пагинацию
        this.setupPagination();

        // Активируем/деактивируем кнопки алфавита
        this.updateAlphabetButtons();

        // Применяем фильтры и отображаем первую страницу
        this.applyFilters();

        this.isInitialized = true;
        console.log(`✅ Загружено ${this.allProducts.length} товаров`);
    }

    /**
     * Обновление статистики
     */
    updateStats() {
        if (!this.productsStats) return;

        const total = this.allProducts.length;
        const filtered = this.filteredProducts.length;
        const letters = window.productsData.AVAILABLE_LETTERS.length;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, filtered);

        let statsHtml = '';

        if (this.searchQuery) {
            // Если активен поиск
            statsHtml = `
                <span class="stats-text">
                    Найдено: <span class="stats-highlight">${filtered}</span> ${this.getPluralForm(filtered)}
                    ${filtered > 0 ? `(показаны ${startIndex}-${endIndex})` : ''}
                </span>
            `;
        } else if (this.currentFilter === 'all') {
            // Показываем все товары
            statsHtml = `
                <span class="stats-text">
                    Всего в ассортименте: <span class="stats-highlight">${total}</span> ${this.getPluralForm(total)}
                    (показаны ${startIndex}-${endIndex})
                </span>
            `;
        } else {
            // Фильтр по букве
            statsHtml = `
                <span class="stats-text">
                    Буква "<span class="stats-highlight">${this.currentFilter}</span>": 
                    <span class="stats-highlight">${filtered}</span> ${this.getPluralForm(filtered)}
                    ${filtered > 0 ? `(показаны ${startIndex}-${endIndex})` : ''}
                </span>
            `;
        }

        this.productsStats.innerHTML = statsHtml;
    }

    /**
     * Склонение слова "позиция"
     */
    getPluralForm(count) {
        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ['категория', 'категории', 'категорий'];
        return titles[
            count % 100 > 4 && count % 100 < 20
                ? 2
                : cases[count % 10 < 5 ? count % 10 : 5]
        ];
    }

    /**
     * Создание элемента товара
     */
    createProductItem(productName) {
        const item = document.createElement('div');
        item.className = 'product-item';

        const firstLetter = productName[0].toUpperCase();
        item.setAttribute('data-letter', firstLetter);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'product-name';
        nameSpan.textContent = productName;

        // Адаптивный размер шрифта в зависимости от длины названия
        // короткие названия — крупнее, длинные — чуть мельче
        const len = productName.trim().length;
        const maxWord = productName.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
        let fontClass = 'product-name--normal';

        if (len <= 8) {
            fontClass = 'product-name--large';
        } else if (len <= 20) {
            fontClass = 'product-name--normal';
        } else if (len <= 36) {
            fontClass = 'product-name--small';
        } else {
            fontClass = 'product-name--xsmall';
        }

        // Если есть очень длинное слово — уменьшаем дополнительно
        if (maxWord > 20 && fontClass === 'product-name--small') {
            fontClass = 'product-name--xsmall';
        }

        nameSpan.classList.add(fontClass);
        // Всегда показываем полный текст в title
        nameSpan.title = productName;

        item.appendChild(nameSpan);

        return item;
    }

    /**
     * Настройка фильтров по алфавиту
     */
    setupFilters() {
        this.alphabetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const letter = btn.dataset.letter;
                this.filterByLetter(letter);

                // Обновляем активную кнопку
                this.alphabetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Фильтрация по букве
     */
    filterByLetter(letter) {
        this.currentFilter = letter;
        this.currentPage = 1;

        // Очищаем поиск при смене буквы
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
            if (this.searchClear) {
                this.searchClear.classList.remove('visible');
            }
        }

        this.applyFilters();

        // Плавно прокручиваем к секции товаров
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Настройка поиска
     */
    setupSearch() {
        if (!this.searchInput || !this.searchClear) return;

        // Поиск с debounce
        this.searchInput.addEventListener('input', debounce((e) => {
            this.searchQuery = e.target.value.trim();
            this.currentPage = 1;
            this.applyFilters();

            // Показываем/скрываем кнопку очистки
            this.searchClear.classList.toggle('visible', this.searchQuery.length > 0);
        }, 300));

        // Очистка поиска
        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.currentPage = 1;
            this.searchClear.classList.remove('visible');
            this.applyFilters();
            this.searchInput.focus();
        });
    }

    /**
     * Настройка пагинации
     */
    setupPagination() {
        if (!this.paginationFirst || !this.paginationPrev ||
            !this.paginationNext || !this.paginationLast) return;

        this.paginationFirst.addEventListener('click', () => this.goToPage(1));
        this.paginationPrev.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.paginationNext.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.paginationLast.addEventListener('click', () => this.goToPage(this.totalPages));
    }

    /**
     * Применение всех фильтров (алфавит + поиск)
     */
    applyFilters() {
        // Сначала фильтруем по букве
        let products = this.currentFilter === 'all'
            ? [...this.allProducts]
            : window.productsData.PRODUCTS_BY_LETTER[this.currentFilter] || [];

        // Затем применяем поиск
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            products = products.filter(product =>
                product.toLowerCase().includes(query)
            );
        }

        this.filteredProducts = products;
        this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;

        // Если текущая страница больше общего количества, возвращаемся на последнюю
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }

        this.updateStats();
        this.updatePagination();
        this.renderCurrentPage();
    }

    /**
     * Переход на страницу
     */
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;

        this.currentPage = page;
        this.updatePagination();
        this.renderCurrentPage();

        // Плавно прокручиваем к списку товаров
        this.productsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Обновление пагинации
     */
    updatePagination() {
        if (!this.paginationInfo) return;

        // Обновляем текст
        const currentSpan = this.paginationInfo.querySelector('.pagination-current');
        const totalSpan = this.paginationInfo.querySelector('.pagination-total');

        if (currentSpan) currentSpan.textContent = this.currentPage;
        if (totalSpan) totalSpan.textContent = this.totalPages;

        // Обновляем состояние кнопок
        if (this.paginationFirst) this.paginationFirst.disabled = this.currentPage === 1;
        if (this.paginationPrev) this.paginationPrev.disabled = this.currentPage === 1;
        if (this.paginationNext) this.paginationNext.disabled = this.currentPage === this.totalPages;
        if (this.paginationLast) this.paginationLast.disabled = this.currentPage === this.totalPages;
    }

    /**
     * Отрисовка текущей страницы
     */
    renderCurrentPage() {
        if (!this.productsList) return;

        // Очищаем контейнер
        this.productsList.innerHTML = '';

        // Если товаров нет - показываем пустое состояние
        if (this.filteredProducts.length === 0) {
            this.showEmpty();
            return;
        }

        // Вычисляем товары для текущей страницы
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredProducts.length);
        this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);

        // Создаём контейнер-сетку
        const grid = document.createElement('div');
        grid.className = 'products-grid';

        // Добавляем товары текущей страницы
        const fragment = document.createDocumentFragment();
        this.displayedProducts.forEach(product => {
            const item = this.createProductItem(product);
            fragment.appendChild(item);
        });

        grid.appendChild(fragment);
        this.productsList.appendChild(grid);
    }

    /**
     * Обновление состояния кнопок алфавита
     */
    updateAlphabetButtons() {
        this.alphabetBtns.forEach(btn => {
            const letter = btn.dataset.letter;

            if (letter === 'all') return;

            // Проверяем, есть ли товары на эту букву
            const hasProducts = window.productsData.AVAILABLE_LETTERS.includes(letter);

            if (!hasProducts) {
                btn.disabled = true;
                btn.title = `Нет товаров на букву ${letter}`;
            } else {
                const count = window.productsData.PRODUCTS_STATS.byLetter[letter] || 0;
                btn.title = `${letter}: ${count} ${this.getPluralForm(count)}`;
            }
        });
    }

    /**
     * Показать пустое состояние
     */
    showEmpty() {
        const message = this.searchQuery
            ? `Ничего не найдено по запросу "${this.searchQuery}"`
            : 'По выбранному фильтру товаров не найдено';

        this.productsList.innerHTML = `
            <div class="products-empty">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M32 8L8 20V44L32 56L56 44V20L32 8Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M32 32V56M32 32L8 20M32 32L56 20" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Показать ошибку
     */
    showError(message) {
        if (this.productsList) {
            this.productsList.innerHTML = `
                <div class="products-empty">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2"/>
                        <path d="M32 20V36M32 44V44.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>${message}</p>
                </div>
            `;
        }
        console.error(message);
    }
}

// Инициализация менеджера товаров при загрузке страницы
let productsManager;

document.addEventListener('DOMContentLoaded', () => {
    productsManager = new ProductsManager();
    productsManager.init();
    // Небольшой параллакс для логотипа в hero
    if (typeof setupHeroLogoParallax === 'function') {
        try {
            setupHeroLogoParallax();
        } catch (err) {
            console.error('Ошибка инициализации параллакса логотипа:', err);
        }
    }
});

/**
 * Подключает очень лёгкий параллакс для логотипа в hero по движению мыши
 * Движение минимальное (несколько пикселей), выключено на мобильных и при reduced-motion
 */
function setupHeroLogoParallax() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('.hero');
    const logoImg = document.querySelector('.hero-logo img');
    if (!hero || !logoImg) return;

    let rafId = null;
    let target = { x: 0, y: 0 };
    let enabled = window.innerWidth >= 768;

    const MAX_ANGLE = 6; // градусов — совсем чуть-чуть

    function onMove(e) {
        if (!enabled) return;
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const nx = (e.clientX - cx) / (rect.width / 2); // -1..1
        const ny = (e.clientY - cy) / (rect.height / 2);

        // Преобразуем в углы — небольшие повороты
        target.x = Math.max(-1, Math.min(1, nx)) * MAX_ANGLE; // по горизонтали => rotateY (инвертируем при применении)
        target.y = Math.max(-1, Math.min(1, ny)) * MAX_ANGLE; // по вертикали => rotateX

        if (!rafId) rafId = requestAnimationFrame(applyTransform);
    }

    function applyTransform() {
        // Небольшой 3D-поворот: rotateX по вертикали, rotateY по горизонтали (инвертируем X для логичной реакции)
        const angleY = -target.x; // инвертируем, чтобы кursor справа поворачивал логотип вправо
        const angleX = target.y;
        logoImg.style.transform = `perspective(900px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        rafId = null;
    }

    function onLeave() {
        target.x = 0; target.y = 0;
        if (!rafId) rafId = requestAnimationFrame(applyTransform);
    }

    function onResize() {
        enabled = window.innerWidth >= 768;
        if (!enabled) onLeave();
    }

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    // Включаем лёгкую плавность (на случай, если не задано CSS)
    if (!logoImg.style.transition) {
        logoImg.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
    }
}

// Экспорт функций для использования в других модулях (если понадобится)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        copyToClipboard,
        showNotification,
        validateEmail,
        validatePhone,
        StorageHelper,
        debounce,
        throttle,
        ProductsManager
    };
}