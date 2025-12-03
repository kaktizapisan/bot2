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
    
    if (tg && tg.expand) tg.expand();
    if (tg && tg.enableClosingConfirmation) tg.enableClosingConfirmation();
    
    // Устанавливаем цветовую схему
    setGreenTheme();
    
    // Устанавливаем имя пользователя
    setUserName();
    
    // Генерируем рандомные просмотры
    generateRandomViews();
    
    // Запускаем обновление просмотров каждые 15 секунд
    setInterval(updateRandomView, 15000);
    
    // Инициализируем счетчик просмотров
    initViewCounter();
    
    // Добавляем эффект параллакса для фона
    initParallax();
}

// Установка зеленой темы
function setGreenTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', 'var(--dark-bg)');
    document.documentElement.style.setProperty('--tg-theme-text-color', 'var(--text-primary)');
    document.documentElement.style.setProperty('--tg-theme-button-color', 'var(--accent-primary)');
}

// Функция для установки имени пользователя
function setUserName() {
    let userName = 'Пользователь';
    
    try {
        if (tg && tg.initDataUnsafe?.user) {
            const user = tg.initDataUnsafe.user;
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
    
    document.getElementById('userName').textContent = userName;
}

// Инициализация счетчика просмотров
function initViewCounter() {
    const viewCountElement = document.getElementById('viewCount');
    let viewCount = parseInt(viewCountElement.textContent);
    
    // Увеличиваем счетчик каждые 2-5 секунд
    setInterval(() => {
        const increment = Math.floor(Math.random() * 3) + 1; // 1-3 просмотра
        viewCount += increment;
        viewCountElement.textContent = viewCount;
        
        // Анимация изменения
        viewCountElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            viewCountElement.style.transform = 'scale(1)';
        }, 200);
    }, Math.random() * 3000 + 2000); // 2-5 секунд
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
        oldestView.style.animation = 'slideOut 0.4s ease-out forwards';
        
        setTimeout(() => {
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
        }, 400);
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
                timeElement.style.color = '#00b874';
                break;
            case '1 мин назад':
                timeElement.textContent = '2 мин назад';
                timeElement.style.color = '#00a86b';
                break;
            case '2 мин назад':
                timeElement.textContent = '3 мин назад';
                timeElement.style.color = '#008f5c';
                break;
            case '3 мин назад':
                // Просмотр старше 3 минут удаляется в следующем цикле
                break;
        }
    }
}

// Показать контакты с анимацией
function revealContacts() {
    const buttonContainer = document.getElementById('buttonContainer');
    const contactsContainer = document.getElementById('contactsContainer');
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Скрываем основную кнопку
    buttonContainer.style.opacity = '0';
    buttonContainer.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        buttonContainer.style.display = 'none';
        
        // Показываем контакты
        contactsContainer.style.display = 'block';
        
        // Анимация появления контейнера
        setTimeout(() => {
            contactsContainer.style.opacity = '1';
            contactsContainer.style.transform = 'translateY(0)';
            
            // Поочередная анимация появления контактов
            contactItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = 'contactReveal 0.5s ease-out forwards';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 10);
    }, 300);
    
    // Увеличиваем счетчик просмотров
    const viewCountElement = document.getElementById('viewCount');
    let viewCount = parseInt(viewCountElement.textContent);
    viewCount += Math.floor(Math.random() * 5) + 3;
    viewCountElement.textContent = viewCount;
}

// Скрыть контакты с анимацией
function hideContacts() {
    const buttonContainer = document.getElementById('buttonContainer');
    const contactsContainer = document.getElementById('contactsContainer');
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Анимация скрытия контактов
    contactItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        }, index * 50);
    });
    
    // Скрываем контейнер контактов
    setTimeout(() => {
        contactsContainer.style.opacity = '0';
        contactsContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contactsContainer.style.display = 'none';
            
            // Показываем основную кнопку
            buttonContainer.style.display = 'flex';
            
            setTimeout(() => {
                buttonContainer.style.opacity = '1';
                buttonContainer.style.transform = 'translateY(0)';
            }, 10);
        }, 300);
    }, 400);
}

// Инициализация параллакс эффекта
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const floatingElements = document.querySelector('.floating-elements');
        if (!floatingElements) return;
        
        const x = (e.clientX / window.innerWidth) * 20;
        const y = (e.clientY / window.innerHeight) * 20;
        
        floatingElements.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', init);

// Добавляем CSS для анимации скрытия
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
