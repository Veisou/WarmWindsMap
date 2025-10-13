/**
 * Warm Winds Interactive Map
 * Карта мира Тепловетрия с интерактивными провинциями и метками
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

// Основные изображения карты
var image1 = L.imageOverlay('TeploMapVer.png', [[2000, 0], [4000, 3940]]).addTo(map);
var image2 = L.imageOverlay('TeploMapNiz.png', [[0, 0], [2001, 3940]]).addTo(map);

// Слои провинций
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

// Данные провинций
var provincesData = [
    {
        id: 'pr1',
        name: 'Река',
        image: image101,
        bounds: [[0, 0], [3940, 4000]],
        description: 'Великая речная долина с плодородными землями',
        color: '#4682B4'
    },
    {
        id: 'pr2',
        name: 'Реканиз',
        image: image102,
        bounds: [[0, 0], [3940, 4000]],
        description: 'Нижнее течение реки с болотистыми берегами',
        color: '#5F9EA0'
    },
    {
        id: 'pr3',
        name: 'Реколев',
        image: image103,
        bounds: [[0, 0], [3940, 4000]],
        description: 'Лесистые берега верхнего течения',
        color: '#2E8B57'
    },
    {
        id: 'pr4',
        name: 'Левисл',
        image: image104,
        bounds: [[0, 0], [3940, 4000]],
        description: 'Левый берег реки с горными склонами',
        color: '#D2691E'
    },
    {
        id: 'pr5',
        name: 'Прависл',
        image: image105,
        bounds: [[0, 0], [3940, 4000]],
        description: 'Правый берег с равнинными территориями',
        color: '#CD853F'
    }
];

/**
 * Создает интерактивные полигоны для провинций
 */
function createInteractiveProvinces() {
    provincesData.forEach(function(province) {
        var polygon = L.rectangle(province.bounds, {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: 0,
            weight: 0,
            interactive: true,
            className: 'province-polygon'
        });

        // Обработчики событий
        polygon.on('click', function(e) {
            showProvinceInfo(province);
            highlightProvince(polygon);
        });

        polygon.on('mouseover', function(e) {
            if (!polygon.isHighlighted) {
                polygon.setStyle({
                    fillColor: province.color,
                    fillOpacity: 0.15,
                    weight: 2,
                    color: province.color
                });
            }
        });

        polygon.on('mouseout', function(e) {
            if (!polygon.isHighlighted) {
                polygon.setStyle({
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    weight: 0,
                    color: 'transparent'
                });
            }
        });

        polygon.provinceData = province;
        polygon.addTo(provincesLayer);
    });
}

/**
 * Подсвечивает выбранную провинцию
 */
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
        fillColor: polygon.provinceData.color,
        fillOpacity: 0.3,
        weight: 3,
        color: polygon.provinceData.color
    });
    polygon.isHighlighted = true;
    currentHighlightedProvince = polygon;
}

/**
 * Показывает информацию о провинции во всплывающем окне
 */
function showProvinceInfo(province) {
    var additionalData = findProvinceInData(province.name);
    
    var popupContent = `
        <div class="province-popup">
            <div class="popup-header">
                <i class="material-icons" style="vertical-align: middle; margin-right: 8px;">terrain</i>
                ${province.name}
            </div>
            
            <div class="popup-content">
                <div class="description-section">
                    <i class="material-icons" style="font-size: 16px; margin-right: 5px;">description</i>
                    <strong>Описание:</strong>
                    <p>${additionalData ? additionalData.description : province.description}</p>
                </div>
                
                ${additionalData ? `
                <div class="info-grid">
                    <div class="info-item">
                        <i class="material-icons" style="font-size: 16px;">category</i>
                        <span><strong>Тип:</strong> ${additionalData.type || 'Провинция'}</span>
                    </div>
                    <div class="info-item">
                        <i class="material-icons" style="font-size: 16px;">place</i>
                        <span><strong>Координаты:</strong> ${additionalData.coordinates}</span>
                    </div>
                </div>
                
                ${additionalData.special ? `
                <div class="special-feature">
                    <i class="material-icons" style="font-size: 16px;">auto_awesome</i>
                    <strong>Особенности:</strong> ${additionalData.special}
                </div>
                ` : ''}
                ` : ''}
            </div>
            
            <div class="popup-footer">
                Кликните на другую провинцию для просмотра информации
            </div>
        </div>
    `;

    var center = [
        (province.bounds[0][0] + province.bounds[1][0]) / 2,
        (province.bounds[0][1] + province.bounds[1][1]) / 2
    ];

    L.popup()
        .setLatLng(center)
        .setContent(popupContent)
        .openOn(map);
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

/**
 * Ищет дополнительную информацию о провинции в загруженных данных
 */
function findProvinceInData(provinceName) {
    if (window.sheetData && window.sheetData.values) {
        for (let i = 1; i < window.sheetData.values.length; i++) {
            const row = window.sheetData.values[i];
            if (row[0] && row[0].toLowerCase().includes(provinceName.toLowerCase())) {
                return {
                    name: row[0],
                    description: row[1],
                    coordinates: `${row[2]}, ${row[3]}`,
                    type: row[4],
                    special: row[5] || ''
                };
            }
        }
    }
    return null;
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

/**
 * Управляет видимостью элементов при изменении зума
 */
function setupZoomHideSpecificPanes(map, layersToHide, minZoomToHide) {
    // Реализация скрытия элементов при необходимости
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

// ==================== ИНИЦИАЛИЗАЦИЯ КАРТЫ ====================

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

/**
 * Инициализирует карту и все компоненты
 */
function initializeMap() {
    // Настройка границ
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    
    // Создание интерактивных провинций
    createInteractiveProvinces();
    
    // Загрузка данных
    loadMapData();
    
    // Добавление контролов слоев - ОСНОВНОЙ КОНТРОЛ
    var layersControl = L.control.layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: true
    }).addTo(map);
    
    // Добавление подписи автора
    signatureControl.addTo(map);
    
    // Обработчики событий
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    
    map.on('zoomend', function() {
        RenderingChanger();
    });
    
    // Первоначальная настройка рендеринга
    RenderingChanger();
    
    console.log("🗺️ Карта Тепловетрия успешно инициализирована");
}

// ==================== СТИЛИ CSS ====================

var style = document.createElement('style');
style.textContent = `
    /* Исправляем фон карты */
    .leaflet-container {
        background: #f5f5f5 !important;
        font-family: 'Georgia', serif;
    }
    
    /* Стили для контрола слоев - УБИРАЕМ СКРЫТИЕ */
    .leaflet-control-layers {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        background: rgba(245, 245, 220, 0.95) !important;
        border: 2px solid #8B4513 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    }
    
    .leaflet-control-layers-toggle {
        background-color: #DEB887 !important;
        border: 1px solid #8B4513 !important;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238B4513"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>') !important;
    }
    
    .leaflet-control-layers-expanded {
        background: linear-gradient(135deg, #F5F5DC, #DEB887) !important;
        padding: 10px 15px !important;
        border-radius: 8px !important;
        font-size: 14px !important;
        color: #2F1B0A !important;
    }
    
    .leaflet-control-layers label {
        font-family: 'Georgia', serif !important;
        color: #2F1B0A !important;
        margin-bottom: 8px !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 5px 0 !important;
        cursor: pointer !important;
    }
    
    .leaflet-control-layers-separator {
        border-top: 2px solid #8B4513 !important;
        margin: 10px 0 !important;
    }
    
    .leaflet-control-layers-list {
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Стили для подписи автора - УБИРАЕМ СКРЫТИЕ */
    .developer-signature {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        font-family: Arial, sans-serif;
        pointer-events: auto !important;
    }
    
    .signature-container {
        background: rgba(255, 255, 255, 0.9) !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        border: 1px solid rgba(139, 69, 19, 0.3) !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        backdrop-filter: blur(2px);
    }
    
    .signature-text {
        color: #666 !important;
        font-size: 0.9em !important;
        margin-right: 6px !important;
    }
    
    .signature-link {
        color: #8B0000 !important;
        text-decoration: none !important;
        font-weight: bold !important;
        font-size: 0.95em !important;
    }
    
    .signature-link:hover {
        text-decoration: underline !important;
        color: #CD853F !important;
    }
    
    /* Стили для всплывающих окон */
    .province-popup {
        font-family: 'Georgia', serif;
        min-width: 280px;
        max-width: 350px;
    }
    
    .popup-header {
        background: linear-gradient(135deg, #8B0000, #CD853F);
        color: white;
        padding: 12px 15px;
        margin: -15px -15px 15px -15px;
        border-radius: 5px 5px 0 0;
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
    }
    
    .popup-content {
        padding: 0 5px;
    }
    
    .description-section {
        background: rgba(245, 245, 220, 0.3);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        border-left: 3px solid #CD853F;
    }
    
    .description-section p {
        margin: 8px 0 0 0;
        font-style: italic;
        color: #555;
    }
    
    .info-grid {
        display: grid;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px;
        background: rgba(205, 133, 63, 0.1);
        border-radius: 3px;
    }
    
    .special-feature {
        background: rgba(255, 215, 0, 0.15);
        padding: 10px;
        border-radius: 5px;
        border-left: 3px solid #FFD700;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .popup-footer {
        text-align: center;
        font-size: 0.8em;
        color: #888;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #DDD;
    }
    
    .leaflet-popup-content-wrapper {
        background: linear-gradient(135deg, #F5F5DC, #DEB887);
        border: 2px solid #8B4513;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    .leaflet-popup-tip {
        background: #DEB887;
    }
    
    .marker-popup h3 {
        color: #8B0000;
        margin: 0 0 10px 0;
        border-bottom: 2px solid #CD853F;
        padding-bottom: 5px;
    }
    
    .marker-tooltip {
        background: rgba(139, 0, 0, 0.9);
        color: white;
        border: 1px solid #2F1B0A;
        border-radius: 3px;
        font-weight: bold;
        font-family: 'Georgia', serif;
    }
    
    .capital-popup h3 {
        color: #8B0000;
        margin: 0 0 8px 0;
    }
    
    /* Анимации для провинций */
    .province-polygon {
        transition: all 0.3s ease;
        cursor: pointer;
    }
`;

// Добавляем стили в документ
document.head.appendChild(style);

// ==================== ЗАПУСК КАРТЫ ====================

/**
 * Запускает инициализацию карты после загрузки DOM
 */
function startMap() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMap);
    } else {
        initializeMap();
    }
}

// Запускаем карту
startMap();

// Принудительное отображение контролов через секунду (на всякий случай)
setTimeout(function() {
    // Проверяем и показываем контрол слоев
    var layersControl = document.querySelector('.leaflet-control-layers');
    if (layersControl) {
        layersControl.style.display = 'block';
        layersControl.style.visibility = 'visible';
        layersControl.style.opacity = '1';
    }
    
    // Проверяем и показываем подпись автора
    var signature = document.querySelector('.developer-signature');
    if (signature) {
        signature.style.display = 'block';
        signature.style.visibility = 'visible';
        signature.style.opacity = '1';
    }
}, 1000);
