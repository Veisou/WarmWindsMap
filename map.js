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

// ==================== СЛОИ КАРТЫ ====================

// Основные изображения карты (ОСНОВНОЙ ФОН)
var image1 = L.imageOverlay('TeploMapVer.png', [[2000, 0], [4000, 3940]]).addTo(map);
var image2 = L.imageOverlay('TeploMapNiz.png', [[0, 0], [2001, 3940]]).addTo(map);

// Слои провинций (НАДСЛОЙ - только контуры провинций)
var image101 = L.imageOverlay('pr1 reka.png', [[0, 0], [3940, 4000]], { opacity: 0.5 });
var image102 = L.imageOverlay('pr2 rekaniz.png', [[0, 0], [3940, 4000]], { opacity: 0.5 });
var image103 = L.imageOverlay('pr3 rekalev.png', [[0, 0], [3940, 4000]], { opacity: 0.5 });
var image104 = L.imageOverlay('pr4 levisl1.png', [[0, 0], [3940, 4000]], { opacity: 0.5 });
var image105 = L.imageOverlay('pr5 pravisl1.png', [[0, 0], [3940, 4000]], { opacity: 0.5 });

var ProvMap = L.layerGroup([image101, image102, image103, image104, image105]);

// ==================== ИКОНКИ И СТИЛИ ====================

// Кастомные иконки в античном стиле
var iconTypes = {
    'Чудеса': L.IconMaterial.icon({
        icon: 'auto_awesome',
        iconColor: '#FFD700',
        markerColor: '#8B0000',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [25, 34],
        popupAnchor: [0, -34]
    }),
    'Руины': L.IconMaterial.icon({
        icon: 'landslide',
        iconColor: '#8B7355',
        markerColor: '#4A3520',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [20, 28],
        popupAnchor: [0, -28]
    }),
    'Поселения': L.IconMaterial.icon({
        icon: 'account_balance',
        iconColor: '#F5F5DC',
        markerColor: '#CD853F',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [25, 34],
        popupAnchor: [0, -34]
    }),
    'Столица': L.IconMaterial.icon({
        icon: 'location_city',
        iconColor: '#FFD700',
        markerColor: '#8B0000',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [25, 34],
        popupAnchor: [0, -34]
    }),
    'Город': L.IconMaterial.icon({
        icon: 'house',
        iconColor: '#F5F5DC',
        markerColor: '#CD853F',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [22, 30],
        popupAnchor: [0, -30]
    }),
    'Крепость': L.IconMaterial.icon({
        icon: 'fort',
        iconColor: '#D3D3D3',
        markerColor: '#696969',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [23, 32],
        popupAnchor: [0, -32]
    }),
    'Порт': L.IconMaterial.icon({
        icon: 'anchor',
        iconColor: '#F0E68C',
        markerColor: '#4682B4',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [18, 25],
        popupAnchor: [0, -25]
    })
};

// Группы слоев для разных типов меток
var layers = {
    'Столица': L.layerGroup(),
    'Город': L.layerGroup(),
    'Крепость': L.layerGroup(),
    'Порт': L.layerGroup(),
    'Чудеса': L.layerGroup(),
    'Руины': L.layerGroup()
};

// ==================== ИНТЕРАКТИВНЫЕ ПРОВИНЦИИ ====================

// Слой для интерактивных провинций
var provincesLayer = L.layerGroup();

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
    updateLayersControl();
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
        updateLayersControl();
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

function showProvinceInfo(provinceData) {
    var popupContent = `
        <div class="province-popup">
            <div class="popup-header">
                <i class="material-icons" style="vertical-align: middle; margin-right: 8px;">terrain</i>
                ${provinceData.name}
            </div>
            
            <div class="popup-content">
                <div class="description-section">
                    <i class="material-icons" style="font-size: 16px; margin-right: 5px;">description</i>
                    <strong>Провинция</strong>
                    <p>${provinceData.description || 'Описание провинции'}</p>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <i class="material-icons" style="font-size: 16px;">category</i>
                        <span><strong>Тип:</strong> Провинция</span>
                    </div>
                    <div class="info-item">
                        <i class="material-icons" style="font-size: 16px;">map</i>
                        <span><strong>Точек границы:</strong> ${provinceData.pointCount}</span>
                    </div>
                </div>
            </div>
            
            <div class="popup-footer">
                Кликните на другую провинцию для просмотра информации
            </div>
        </div>
    `;

    var center = [
        (provinceData.bounds[0][0] + provinceData.bounds[1][0]) / 2,
        (provinceData.bounds[0][1] + provinceData.bounds[1][1]) / 2
    ];

    L.popup()
        .setLatLng(center)
        .setContent(popupContent)
        .openOn(map);
}

function highlightProvince(polygon) {
    // Сбрасываем предыдущую подсветку
    if (currentHighlightedProvince && currentHighlightedProvince !== polygon) {
        currentHighlightedProvince.setStyle({
            fillColor: 'transparent',
            fillOpacity: 0,
            weight: 0,
            color: 'transparent'
        });
        currentHighlightedProvince.isHighlighted = false;
    }
    
    // Подсвечиваем новую провинцию
    polygon.setStyle({
        fillColor: polygon.options.fillColor,
        fillOpacity: 0.3,
        weight: 3,
        color: polygon.options.fillColor
    });
    polygon.isHighlighted = true;
    currentHighlightedProvince = polygon;
}

function stopProvinceEditing() {
    resetEditing();
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

// ==================== КОНТРОЛЫ КАРТЫ ====================

// Слой для отслеживания координат
var coordinateTrackingLayer = L.layerGroup();

// Маркер столицы
var capitalMarker = L.marker([2000, 2000], {
    icon: iconTypes['Столица'],
    draggable: true
}).addTo(coordinateTrackingLayer);

capitalMarker.bindPopup(`
    <div class="capital-popup">
        <h3>🏛️ Столица</h3>
        <p>Перетащите маркер для изменения положения</p>
        <small>Текущие координаты: ${capitalMarker.getLatLng().lat.toFixed(1)}, ${capitalMarker.getLatLng().lng.toFixed(1)}</small>
    </div>
`);

capitalMarker.on('dragend', function(event) {
    var marker = event.target;
    var position = marker.getLatLng();
    
    marker.setPopupContent(`
        <div class="capital-popup">
            <h3>🏛️ Столица</h3>
            <p>Новое местоположение</p>
            <small>Координаты: ${position.lat.toFixed(1)}, ${position.lng.toFixed(1)}</small>
        </div>
    `).openPopup();
    
    console.log(`📍 Новые координаты столицы: ${position.lat}, ${position.lng}`);
});

// Подпись автора
var signatureControl = L.control({ position: 'bottomright' });

signatureControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'developer-signature');
    div.innerHTML = `
        <div class="signature-container">
            <span class="signature-text">Создано</span>
            <a href="https://vk.com/vivmim" target="_blank" class="signature-link">
                Viv Mim
            </a>
        </div>
    `;
    return div;
};

// ==================== УПРАВЛЕНИЕ СЛОЯМИ ====================

var layersControl;

function updateLayersControl() {
    // Удаляем старый контрол если есть
    if (layersControl) {
        map.removeControl(layersControl);
    }
    
    // Базовые слои карты
    var baseMaps = {
        "🗺️ Карта провинций": L.layerGroup([ProvMap, provincesLayer]),
        "🏔️ Географическая карта": L.layerGroup([image1, image2])
    };

    // Слои с метками
    var overlayMaps = {
        '🏛️ Столицы': layers['Столица'],
        '🏘️ Города': layers['Город'],
        '🏰 Крепости': layers['Крепость'],
        '⚓ Порты': layers['Порт'],
        '✨ Чудеса': layers['Чудеса'],
        '🏚️ Руины': layers['Руины'],
        '📍 Отслеживание координат': coordinateTrackingLayer
    };

    // Создаем новый контрол
    layersControl = L.control.layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: true
    }).addTo(map);
}

// ==================== ЗАГРУЗКА ДАННЫХ ====================

/**
 * Загружает и обрабатывает данные из файла
 */
function loadMapData() {
    fetch('WarmWindsTextMap.txt')
        .then(response => {
            if (!response.ok) throw new Error("Ошибка загрузки файла");
            return response.json();
        })
        .then(data => {
            console.log("🗺️ Данные карты успешно загружены:", data);
            window.sheetData = data;
            processData(data.values);
        })
        .catch(error => {
            console.error("❌ Ошибка загрузки данных:", error);
            // Резервные данные
            const backupData = {
                values: [
                    [],
                    ["Меретон", "Столица Тепловетрия", 2000.0, 2000.0, "Столица"],
                    ["Пекло", "Дымящий вулкан, самый высокий и крупный из всех вулканов Тепловетрия", 2052.0, 4864.0, "Город"],
                    ["Древо", "Исполинское Древо, чья вершина теряется в облаках", 2304.0, 7664.0, "Чудеса"],
                    ["Небоносец", "Титан, носящий на своих плечах небесный свод", 1988.0, 6586.0, "Чудеса"]
                ]
            };
            processData(backupData.values);
        });
}

/**
 * Обрабатывает данные и создает метки на карте
 */
function processData(rows) {
    // Пропускаем первую строку (пустой массив или заголовки)
    var startIndex = rows[0] && rows[0].length === 0 ? 1 : 0;
    
    rows.slice(startIndex).forEach(row => {
        if (row.length >= 5) {
            const name = row[0];
            const description = row[1];
            const lat = parseFloat(row[2]);
            const lng = parseFloat(row[3]);
            const type = row[4];
            
            if (!isNaN(lat) && !isNaN(lng) && iconTypes[type]) {
                const marker = L.marker([lat, lng], { 
                    icon: iconTypes[type],
                    title: name
                }).bindPopup(`
                    <div class="marker-popup">
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <small>Координаты: ${lat.toFixed(1)}, ${lng.toFixed(1)}</small>
                    </div>
                `);
                
                if (type !== 'Порт') {
                    marker.bindTooltip(name, { 
                        permanent: true, 
                        direction: 'right', 
                        offset: L.point(11, -15),
                        className: 'marker-tooltip'
                    });
                }
                
                if (layers[type]) {
                    layers[type].addLayer(marker);
                }
            }
        }
    });
}

// ==================== ФУНКЦИОНАЛЬНОСТЬ КАРТЫ ====================

/**
 * Изменяет рендеринг карты при изменении зума
 */
function RenderingChanger() {
    curZoom = map.getZoom();
    let mapContainer = map.getContainer();
    let images = mapContainer.querySelectorAll('img');

    images.forEach(function(img) {
        if (curZoom >= 1) {
            img.style.imageRendering = "pixelated";
        } else {
            img.style.imageRendering = "auto";
        }
    });
}

// ==================== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ====================

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

/**
 * Инициализирует карту и все компоненты
 */
function initializeMap() {
    // Настройка границ
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    
    // Добавляем контролы
    editModeControl.addTo(map);
    signatureControl.addTo(map);
    
    // Загружаем данные
    loadMapData();
    
    // Загружаем сохраненные провинции
    loadAllProvinces();
    
    // Создаем контрол слоев
    updateLayersControl();
    
    // Обработчики событий
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    
    map.on('zoomend', function() {
        RenderingChanger();
    });
    
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
    
    // Первоначальная настройка рендеринга
    RenderingChanger();
    
    console.log('🗺️ Карта инициализирована');
    console.log('Горячие клавиши:');
    console.log('E - Включить/выключить режим разметки');
    console.log('Enter - Завершить провинцию');
    console.log('Escape - Отменить разметку');
}

// Запуск
initializeMap();
