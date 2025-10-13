/**
 * Warm Winds Interactive Map
 * Карта мира Тепловетрия с интерактивными провинциями и метками
 * Инструмент ручной разметки провинций
 */

// Конфигурация карты
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
});

// Глобальные переменные
let curZoom = map.getZoom();
var bounds = [[0, 0], [3940, 4000]];
var currentHighlightedProvince = null;

// ==================== РЕЖИМ РАЗМЕТКИ ПРОВИНЦИЙ ====================

window.editMode = false;
let currentPolygon = null;
let currentPoints = [];
let currentProvinceName = '';
let editControls = null;

/**
 * Включает/выключает режим редактирования провинций
 */
function toggleEditMode() {
    window.editMode = !window.editMode;
    
    if (window.editMode) {
        startProvinceEditing();
        showEditControls();
        alert('🔧 РЕЖИМ РАЗМЕТКИ ВКЛЮЧЕН\n\n' +
              '❶ Введите название провинции\n' +
              '❷ Кликайте по карте чтобы добавить точки\n' + 
              '❸ Нажмите "Завершить" когда закончите\n' +
              '❹ Или "Отмена" для отмены');
    } else {
        stopProvinceEditing();
        hideEditControls();
        alert('📋 РЕЖИМ РАЗМЕТКИ ВЫКЛЮЧЕН');
    }
    
    updateEditModeDisplay();
}

/**
 * Начинает процесс разметки новой провинции
 */
function startProvinceEditing() {
    // Запрашиваем название провинции
    currentProvinceName = prompt('Введите название провинции:');
    
    if (!currentProvinceName) {
        window.editMode = false;
        updateEditModeDisplay();
        return;
    }
    
    // Сбрасываем текущие точки
    currentPoints = [];
    
    // Обработчик кликов по карте
    map.on('click', handleMapClick);
    
    // Показываем инструкцию
    showInstruction('Кликайте по углам провинции "' + currentProvinceName + '"');
}

/**
 * Обрабатывает клики по карте в режиме редактирования
 */
function handleMapClick(e) {
    if (!window.editMode) return;
    
    const point = [e.latlng.lat, e.latlng.lng];
    currentPoints.push(point);
    
    // Обновляем полигон
    updateCurrentPolygon();
    
    // Показываем информацию о точках
    showPointInfo(currentPoints.length);
    
    console.log(`Точка ${currentPoints.length}:`, point);
}

/**
 * Обновляет отображаемый полигон
 */
function updateCurrentPolygon() {
    // Удаляем старый полигон
    if (currentPolygon) {
        map.removeLayer(currentPolygon);
    }
    
    // Создаем новый полигон если есть достаточно точек
    if (currentPoints.length >= 3) {
        currentPolygon = L.polygon(currentPoints, {
            color: '#FF0000',
            weight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.2,
            className: 'editing-polygon'
        }).addTo(map);
    } else if (currentPoints.length === 2) {
        // Показываем линию для 2 точек
        currentPolygon = L.polyline(currentPoints, {
            color: '#FF0000',
            weight: 2,
            dashArray: '5, 5'
        }).addTo(map);
    } else if (currentPoints.length === 1) {
        // Показываем точку
        currentPolygon = L.circleMarker(currentPoints[0], {
            color: '#FF0000',
            radius: 6
        }).addTo(map);
    }
}

/**
 * Завершает разметку текущей провинции
 */
function finishProvince() {
    if (currentPoints.length < 3) {
        alert('❌ Нужно как минимум 3 точки для создания провинции!');
        return;
    }
    
    // Сохраняем провинцию
    saveProvince(currentProvinceName, currentPoints);
    
    // Сбрасываем состояние
    resetEditing();
    
    alert('✅ Провинция "' + currentProvinceName + '" сохранена!\n' +
          'Точек: ' + currentPoints.length + '\n' +
          'Данные в консоли (F12)');
}

/**
 * Отменяет текущую разметку
 */
function cancelEditing() {
    if (confirm('Отменить разметку провинции "' + currentProvinceName + '"?')) {
        resetEditing();
        alert('Разметка отменена');
    }
}

/**
 * Сбрасывает состояние редактирования
 */
function resetEditing() {
    if (currentPolygon) {
        map.removeLayer(currentPolygon);
        currentPolygon = null;
    }
    
    currentPoints = [];
    currentProvinceName = '';
    map.off('click', handleMapClick);
    
    hideInstruction();
    hidePointInfo();
}

/**
 * Сохраняет провинцию в localStorage и выводит в консоль
 */
function saveProvince(name, points) {
    const provinceData = {
        name: name,
        points: points,
        bounds: getBoundsFromPoints(points),
        timestamp: new Date().toISOString(),
        pointCount: points.length
    };
    
    // Сохраняем в localStorage
    localStorage.setItem(`province_${name}`, JSON.stringify(provinceData));
    
    // Выводим в консоль для копирования
    console.log('=== ДАННЫЕ ПРОВИНЦИИ ===');
    console.log('Название:', name);
    console.log('Количество точек:', points.length);
    console.log('Координаты:');
    console.log(JSON.stringify(provinceData, null, 2));
    console.log('=== КОД ДЛЯ ВСТАВКИ ===');
    console.log(generateProvinceCode(name, points));
    
    // Сразу создаем интерактивную провинцию
    createInteractiveProvince(provinceData);
}

/**
 * Создает интерактивную провинцию из сохраненных данных
 */
function createInteractiveProvince(provinceData) {
    const polygon = L.polygon(provinceData.points, {
        color: 'transparent',
        fillColor: getRandomColor(),
        fillOpacity: 0,
        weight: 0,
        interactive: true,
        className: 'province-polygon'
    }).addTo(provincesLayer);
    
    polygon.on('click', function(e) {
        showProvinceInfo(provinceData);
        highlightProvince(polygon);
    });
    
    polygon.on('mouseover', function(e) {
        if (!polygon.isHighlighted) {
            polygon.setStyle({
                fillOpacity: 0.2,
                weight: 2,
                color: polygon.options.fillColor
            });
        }
    });
    
    polygon.on('mouseout', function(e) {
        if (!polygon.isHighlighted) {
            polygon.setStyle({
                fillOpacity: 0,
                weight: 0,
                color: 'transparent'
            });
        }
    });
    
    polygon.provinceData = provinceData;
}

/**
 * Загружает все сохраненные провинции
 */
function loadAllProvinces() {
    const provinces = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('province_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                provinces.push(data);
                createInteractiveProvince(data);
            } catch (e) {
                console.error('Ошибка загрузки провинции:', key, e);
            }
        }
    }
    
    console.log(`Загружено провинций: ${provinces.length}`);
    return provinces;
}

/**
 * Очищает все сохраненные провинции
 */
function clearAllProvinces() {
    if (confirm('❌ УДАЛИТЬ ВСЕ СОХРАНЕННЫЕ ПРОВИНЦИИ?\nЭто действие нельзя отменить!')) {
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('province_')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Очищаем слой провинций
        provincesLayer.clearLayers();
        
        alert(`Удалено провинций: ${keysToRemove.length}`);
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function getBoundsFromPoints(points) {
    let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
    
    points.forEach(point => {
        minLat = Math.min(minLat, point[0]);
        minLng = Math.min(minLng, point[1]);
        maxLat = Math.max(maxLat, point[0]);
        maxLng = Math.max(maxLng, point[1]);
    });
    
    return [[minLat, minLng], [maxLat, maxLng]];
}

function getRandomColor() {
    const colors = ['#4682B4', '#5F9EA0', '#2E8B57', '#D2691E', '#CD853F', '#8B4513', '#A0522D'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateProvinceCode(name, points) {
    return `
{
    name: '${name}',
    points: ${JSON.stringify(points)},
    color: '${getRandomColor()}',
    description: 'Описание провинции ${name}'
}`;
}

// ==================== ИНТЕРФЕЙС РЕДАКТИРОВАНИЯ ====================

function showEditControls() {
    if (editControls) return;
    
    editControls = L.control({ position: 'topright' });
    
    editControls.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'edit-controls');
        div.innerHTML = `
            <div class="edit-panel">
                <div class="edit-header">
                    <strong>🎯 Режим разметки</strong>
                    <span id="editStatus" style="color: green;">● ВКЛ</span>
                </div>
                <div class="edit-info" id="editInfo">
                    Введите название провинции
                </div>
                <div class="edit-buttons">
                    <button onclick="finishProvince()" class="edit-btn finish-btn">✅ Завершить</button>
                    <button onclick="cancelEditing()" class="edit-btn cancel-btn">❌ Отмена</button>
                    <button onclick="toggleEditMode()" class="edit-btn exit-btn">🚪 Выйти</button>
                </div>
                <div class="point-info" id="pointInfo"></div>
            </div>
        `;
        return div;
    };
    
    editControls.addTo(map);
}

function hideEditControls() {
    if (editControls) {
        map.removeControl(editControls);
        editControls = null;
    }
}

function updateEditModeDisplay() {
    const statusElement = document.getElementById('editStatus');
    const infoElement = document.getElementById('editInfo');
    
    if (statusElement) {
        statusElement.textContent = window.editMode ? '● ВКЛ' : '○ ВЫКЛ';
        statusElement.style.color = window.editMode ? 'green' : 'red';
    }
    
    if (infoElement) {
        if (window.editMode && currentProvinceName) {
            infoElement.innerHTML = `Провинция: <strong>${currentProvinceName}</strong>`;
        } else if (window.editMode) {
            infoElement.textContent = 'Введите название провинции';
        } else {
            infoElement.textContent = 'Режим выключен';
        }
    }
}

function showInstruction(text) {
    let instruction = document.getElementById('mapInstruction');
    if (!instruction) {
        instruction = L.DomUtil.create('div', 'map-instruction');
        instruction.id = 'mapInstruction';
        instruction.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 1000;
            text-align: center;
            font-size: 18px;
        `;
        map.getContainer().appendChild(instruction);
    }
    instruction.textContent = text;
    instruction.style.display = 'block';
}

function hideInstruction() {
    const instruction = document.getElementById('mapInstruction');
    if (instruction) {
        instruction.style.display = 'none';
    }
}

function showPointInfo(count) {
    const pointInfo = document.getElementById('pointInfo');
    if (pointInfo) {
        pointInfo.innerHTML = `📌 Точек: <strong>${count}</strong>`;
        pointInfo.style.display = 'block';
    }
}

function hidePointInfo() {
    const pointInfo = document.getElementById('pointInfo');
    if (pointInfo) {
        pointInfo.style.display = 'none';
    }
}

// ==================== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ====================

// Слои карты
var image1 = L.imageOverlay('TeploMapVer.png', [[2000, 0], [4000, 3940]]).addTo(map);
var image2 = L.imageOverlay('TeploMapNiz.png', [[0, 0], [2001, 3940]]).addTo(map);

// Слой для интерактивных провинций
var provincesLayer = L.layerGroup().addTo(map);

// Кнопка управления режимом редактирования
var editModeControl = L.control({ position: 'topleft' });
editModeControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'edit-mode-control');
    div.innerHTML = `
        <button onclick="toggleEditMode()" class="edit-toggle-btn">
            🎯 Разметка провинций
        </button>
        <button onclick="loadAllProvinces()" class="load-btn">
            📥 Загрузить все
        </button>
        <button onclick="clearAllProvinces()" class="clear-btn">
            🗑️ Очистить все
        </button>
    `;
    return div;
};
editModeControl.addTo(map);

// Инициализация карты
function initializeMap() {
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    
    // Загружаем сохраненные провинции
    loadAllProvinces();
    
    // Горячие клавиши
    document.addEventListener('keydown', function(e) {
        if (e.key === 'e' || e.key === 'у') { // E или У (русская раскладка)
            toggleEditMode();
        }
        if (e.key === 'Enter' && window.editMode) {
            finishProvince();
        }
        if (e.key === 'Escape' && window.editMode) {
            cancelEditing();
        }
    });
    
    console.log('🗺️ Карта инициализирована');
    console.log('Горячие клавиши:');
    console.log('E - Включить/выключить режим разметки');
    console.log('Enter - Завершить провинцию');
    console.log('Escape - Отменить разметку');
}

// Запуск
initializeMap();
