// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Данные для рандомных юзернеймов
const russianNames = [
    'anya', 'sasha', 'masha', 'darya', 'elena', 'olya', 'irina', 'nastyshka', 'yiliya', 'ekaterina',
    'vikusha', 'svetik', 'tanushka', 'lizokk', 'polinochka', 'alinchik', 'margoritochks', 'veraaa',
    'dima', 'sergey', 'andrey', 'misha', 'vova', 'pasha', 'kirill', 'artem', 'egor',
    'nikitos', 'stsik', 'roman', 'lesha', 'maxim', 'vladusha', 'ilyazab', 'konstant'
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
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Устанавливаем тёмную цветовую схему
    setPurpleTheme();
    
    // Инициализируем счетчик просмотров
    initializeViewCounter();
    
    // Генерируем рандомные просмотры
    generateRandomViews();
    
    // Скрываем кнопку скрыть изначально
    const hideButtonContainer = document.getElementById('hideButtonContainer');
    hideButtonContainer.classList.add('hidden');
    
    // Запускаем обновление просмотров каждые 30 секунд
    setInterval(updateRandomView, 15000);
}

// Установка тёмной темы
function setPurpleTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', 'var(--dark-bg)');
    document.documentElement.style.setProperty('--tg-theme-text-color', 'var(--text-primary)');
    document.documentElement.style.setProperty('--tg-theme-button-color', 'var(--accent-blue)');
}

// Инициализация счетчика просмотров
function initializeViewCounter() {
    let views = localStorage.getItem('contactViews') || 247;
    views = parseInt(views) + 1;
    localStorage.setItem('contactViews', views);
    document.getElementById('viewCount').textContent = views;
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

// Показать контакты с анимацией
function revealContacts() {
    const container = document.getElementById('contactsContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const hideButtonContainer = document.getElementById('hideButtonContainer');
    
    // Плавно скрываем основную кнопку
    buttonContainer.classList.remove('visible');
    buttonContainer.classList.add('hidden');
    
    // Показываем контакты с задержкой
    setTimeout(() => {
        container.classList.add('show');
        
        // Показываем кнопку скрыть после появления контактов
        setTimeout(() => {
            hideButtonContainer.classList.remove('hidden');
            hideButtonContainer.classList.add('visible');
            
            // УБРАН АВТОМАТИЧЕСКИЙ СКРОЛЛ
            // Пользователь сам решает, скроллить ли к концу списка
        }, 600);
    }, 400);
}

// Скрыть контакты
function hideContacts() {
    const container = document.getElementById('contactsContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const hideButtonContainer = document.getElementById('hideButtonContainer');
    
    // Плавно скрываем кнопку скрыть
    hideButtonContainer.classList.remove('visible');
    hideButtonContainer.classList.add('hidden');
    
    // Добавляем класс для анимации скрытия контактов
    container.classList.add('hiding');
    container.classList.remove('show');
    
    // Показываем основную кнопку после скрытия контактов
    setTimeout(() => {
        buttonContainer.classList.remove('hidden');
        buttonContainer.classList.add('visible');
        
        // Убираем класс hiding после завершения анимации
        setTimeout(() => {
            container.classList.remove('hiding');
        }, 700);
    }, 500);
}

// Добавляем эффект параллакса для фона
document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelector('.floating-elements');
    const x = (e.clientX / window.innerWidth) * 20;
    const y = (e.clientY / window.innerHeight) * 20;
    
    floatingElements.style.transform = `translate(${x}px, ${y}px)`;
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', init);