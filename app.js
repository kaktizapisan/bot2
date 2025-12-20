// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Данные для рандомных юзернеймов
const russianNames = [
    'anya', 'sasha', 'masha', 'darya', 'elena', 'olya', 'irina', 'nastyshka', 'yiliya', 'ekaterina',
    'vikusha', 'svetik', 'tanushka', 'lizokk', 'polinochka', 'alinchik', 'margoritochks', 'veraaa',
    'dima', 'sergey', 'andrey', 'misha', 'vova', 'pasha', 'kirill', 'artem', 'egor',
    'nikitos', 'stsik', 'roman', 'lesha', 'maxim', 'vladusha', 'ilyazab', 'konstant','makarchik','bogdanchik','matvey',
    'nadya', 'jenya', 'fedor', 'pavel', 'rsuhechka',
];

const actions = [
    'посмотрел как записан',
    'посмотрела как записана', 
    'проверил запись',
    'проверила запись',
    'узнал как записан',
    'узнала как записана'
];

const timeOptions = [
    'только что',
    '1 мин назад',
    '2 мин назад', 
    '3 мин назад',
];

// Основная функция инициализации
function init() {
    console.log('Initializing Telegram Web App...');
    console.log('Telegram WebApp available:', !!tg);
    console.log('openLink method available:', !!tg.openLink);
    
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Устанавливаем тёмную цветовую схему
    setPurpleTheme();
    
    // Устанавливаем имя пользователя
    setUserName();
    
    // Генерируем рандомные просмотры
    generateRandomViews();
    
    // Запускаем дополнительные анимации после загрузки
    setTimeout(startAdditionalAnimations, 1000);
    
    // Запускаем обновление просмотров каждые 15 секунд
    setInterval(updateRandomView, 15000);
}

// Функция для установки имени пользователя с улучшенной анимацией
function setUserName() {
    const user = tg.initDataUnsafe?.user;
    let userName = 'Пользователь';
    
    try {
        if (user) {
            if (user.first_name) {
                userName = user.first_name;
            } else if (user.username) {
                userName = user.username;
            }
            
            // Сохраняем имя в localStorage на будущее
            localStorage.setItem('telegramUserName', userName);
        } else {
            // Пробуем получить сохраненное имя
            const savedName = localStorage.getItem('telegramUserName');
            if (savedName) {
                userName = savedName;
            }
        }
    } catch (error) {
        console.log('Ошибка при получении имени пользователя:', error);
    }
    
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userName;
    
    // Добавляем анимацию для имени
    setTimeout(() => {
        userNameElement.style.animation = 'nameGlow 3s ease-in-out infinite';
    }, 1000);
}

// Дополнительные анимации после загрузки
function startAdditionalAnimations() {
    const button = document.querySelector('.reveal-btn');
    const greeting = document.querySelector('.greeting');
    
    // Периодическая пульсация кнопки
    setInterval(() => {
        button.style.animation = 'buttonPulse 2s ease-in-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 2000);
    }, 10000); // Каждые 10 секунд
    
    // Легкое мерцание приветствия
    setInterval(() => {
        greeting.style.transform = 'scale(1.02)';
        setTimeout(() => {
            greeting.style.transform = 'scale(1)';
        }, 300);
    }, 15000); // Каждые 15 секунд
}

// Подтверждение действия - открытие ссылки в Telegram
function confirmAction() {
    console.log('Opening bot with start parameter...');
    closeModal();
    
    const botLink = 'https://t.me/LpOHMxkFBot?start=kkasfas;
    
    console.log('Bot link:', botLink);
    
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        console.log('Telegram WebApp detected');
        console.log('openTelegramLink available:', !!tg.openTelegramLink);
        console.log('openLink available:', !!tg.openLink);
        
        // Пробуем все доступные методы
        if (tg.openTelegramLink) {
            console.log('Using openTelegramLink method');
            tg.openTelegramLink(botLink);
        } else if (tg.openLink) {
            console.log('Using openLink method');
            tg.openLink(botLink);
        } else {
            console.log('Using deep link fallback');
            // Используем глубокую ссылку как последний вариант
            window.location.href = `tg://resolve?domain=LpOHMxkFBot&start=kkasfas`;
            setTimeout(() => {
                window.open(botLink, '_blank');
            }, 500);
        }
    } else {
        console.log('Not in Telegram, using browser fallback');
        // Не в Telegram - обычная ссылка
        window.open(botLink, '_blank');
    }
}

// Комбинированный метод для открытия ссылок
function openWithDeepLink(deepLink, fallback) {
    // Пытаемся открыть deep link (работает в мобильном Telegram)
    window.location.href = deepLink;
    
    // Fallback на обычную ссылку через 500ms
    setTimeout(function() {
        window.open(fallback, '_blank');
    }, 500);
}

// Альтернативный метод - открытие через iframe (обходит некоторые ограничения)
function openTelegramViaIframe(username) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `tg://resolve?domain=${username}`;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
        // Fallback если deep link не сработал
        if (document.contains(iframe)) {
            document.body.removeChild(iframe);
            window.open(`https://t.me/${username}`, '_blank');
        }
    }, 1000);
}

// Установка тёмной темы
function setPurpleTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', 'var(--dark-bg)');
    document.documentElement.style.setProperty('--tg-theme-text-color', 'var(--text-primary)');
    document.documentElement.style.setProperty('--tg-theme-button-color', 'var(--accent-blue)');
}

// Генерация рандомного юзернейма
function generateRandomUsername() {
    const name = russianNames[Math.floor(Math.random() * russianNames.length)];
    const numbers = Math.floor(Math.random() * 90) + 10; // от 10 до 99
    return `@${name}${numbers}`;
}

// Генерация рандомного просмотра
function generateRandomView() {
    const username = generateRandomUsername();
    const action = actions[Math.floor(Math.random() * actions.length)];
    const time = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    const firstLetter = username.charAt(1).toUpperCase();
    
    return {
        username,
        action,
        time,
        firstLetter
    };
}

// Функция для получения числового значения времени для сортировки
function getTimeValue(time) {
    switch(time) {
        case 'только что': return 0;
        case '1 мин назад': return 1;
        case '2 мин назад': return 2;
        case '3 мин назад': return 3;
        default: return 4;
    }
}

// Генерация списка просмотров с правильной сортировкой
function generateRandomViews() {
    const viewsList = document.getElementById('viewsList');
    viewsList.innerHTML = '';
    
    // Создаем массив просмотров
    const views = [];
    
    // Генерируем 6 рандомных просмотров
    for (let i = 0; i < 6; i++) {
        const view = generateRandomView();
        views.push(view);
    }
    
    // Сортируем просмотры по времени (от самого свежего к самому старому)
    views.sort((a, b) => getTimeValue(a.time) - getTimeValue(b.time));
    
    // Добавляем отсортированные просмотры в DOM
    views.forEach((view, index) => {
        const viewItem = document.createElement('div');
        viewItem.className = 'view-item';
        viewItem.style.animationDelay = `${index * 0.1}s`;
        viewItem.innerHTML = `
            <div class="viewer-avatar">${view.firstLetter}</div>
            <div class="viewer-info">
                <div class="viewer-name">${view.username}</div>
                <div class="view-action">${view.action}</div>
            </div>
            <div class="view-time">${view.time}</div>
        `;
        viewsList.appendChild(viewItem);
    });
}

// Обновление одного просмотра (для анимации) с правильной сортировкой
function updateRandomView() {
    const viewsList = document.getElementById('viewsList');
    const viewItems = viewsList.getElementsByClassName('view-item');
    
    if (viewItems.length > 0) {
        // Удаляем самый старый просмотр (последний в списке)
        const oldestView = viewItems[viewItems.length - 1];
        viewsList.removeChild(oldestView);
        
        // Создаем новый просмотр со статусом "только что"
        const newView = generateRandomView();
        newView.time = 'только что'; // Всегда новый просмотр - "только что"
        
        const viewItem = document.createElement('div');
        viewItem.className = 'view-item';
        viewItem.style.opacity = '0';
        viewItem.style.transform = 'translateY(20px)';
        
        viewItem.innerHTML = `
            <div class="viewer-avatar">${newView.firstLetter}</div>
            <div class="viewer-info">
                <div class="viewer-name">${newView.username}</div>
                <div class="view-action">${newView.action}</div>
            </div>
            <div class="view-time">${newView.time}</div>
        `;
        
        // Добавляем новый просмотр в начало списка
        viewsList.insertBefore(viewItem, viewsList.firstChild);
        
        // Анимация появления
        setTimeout(() => {
            viewItem.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            viewItem.style.opacity = '1';
            viewItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Обновляем время у существующих просмотров
        updateExistingViewTimes();
    }
}

// Функция для обновления времени у существующих просмотров
function updateExistingViewTimes() {
    const viewsList = document.getElementById('viewsList');
    const viewItems = viewsList.getElementsByClassName('view-item');
    
    // Проходим по всем просмотрам кроме первого (он только что добавлен)
    for (let i = 1; i < viewItems.length; i++) {
        const timeElement = viewItems[i].querySelector('.view-time');
        const currentTime = timeElement.textContent;
        
        // Обновляем время в зависимости от текущего статуса
        switch(currentTime) {
            case 'только что':
                timeElement.textContent = '1 мин назад';
                break;
            case '1 мин назад':
                timeElement.textContent = '2 мин назад';
                break;
            case '2 мин назад':
                timeElement.textContent = '3 мин назад';
                break;
            case '3 мин назад':
                // Просмотр старше 3 минут удаляется в следующем цикле
                break;
        }
    }
}

// Показать модальное окно с плавной анимацией
function showModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    
    // Сначала показываем оверлей
    modalOverlay.style.display = 'flex';
    
    // Анимация появления оверлея
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
    }, 10);
    
    // Анимация появления модального окна с задержкой
    setTimeout(() => {
        modal.style.transform = 'scale(1) translateY(0)';
        modal.style.opacity = '1';
    }, 100);
    
    // Блокируем скролл фона
    document.body.style.overflow = 'hidden';
}

// Закрыть модальное окно с плавной анимацией
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    
    // Анимация скрытия модального окна
    modal.style.transform = 'scale(0.8) translateY(20px)';
    modal.style.opacity = '0';
    
    // Анимация скрытия оверлея с задержкой
    setTimeout(() => {
        modalOverlay.style.opacity = '0';
        
        // Полностью скрываем оверлей после анимации
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            
            // Разблокируем скролл фона
            document.body.style.overflow = '';
        }, 400);
    }, 200);
}

// Добавляем эффект параллакса для фона
document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelector('.floating-elements');
    const x = (e.clientX / window.innerWidth) * 20;
    const y = (e.clientY / window.innerHeight) * 20;
    
    floatingElements.style.transform = `translate(${x}px, ${y}px)`;
});

// Закрытие модального окна по клику на оверлей
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', init);



