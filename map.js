var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
    position: 'topleft',
    preferCanvas: true, // Использует canvas вместо HTML
    fadeAnimation: false, // Отключает анимацию
    zoomSnap: 0.5, // Уменьшает частоту перерисовок
    wheelPxPerZoomLevel: 120 // Ускоряет зум
    }
    
});

let curZoom = map.getZoom();
var bounds = [[0, 0], [3940, 4000]];
// // Добавьте эти параметры в карту
// // Создаем пул воркеров
// const workerPool = [];
// const MAX_WORKERS = 3; // Оптимально для 4-ядерного процессора

// // Очередь загрузки
// const loadQueue = [];

// // Функция для обработки очереди
// function processQueue() {
//   while (loadQueue.length > 0 && workerPool.length > 0) {
//     const worker = workerPool.pop();
//     const task = loadQueue.shift();
    
//     worker.postMessage({
//       url: task.url,
//       id: task.id
//     });
    
//     worker.onmessage = function(e) {
//       if (e.data.error) {
//         console.error(`Error loading ${task.url}:`, e.data.error);
//         workerPool.push(worker);
//         processQueue();
//         return;
//       }
      
//       // Создаем ImageOverlay после загрузки
//       const overlay = L.imageOverlay(e.data.imageBitmap, task.bounds, task.options);
      
//       // Добавляем на карту если нужно сразу
//       if (task.immediate) {
//         overlay.addTo(map);
//       }
      
//       // Сохраняем ссылку
//       task.resolve(overlay);
      
//       // Возвращаем воркер в пул
//       workerPool.push(worker);
//       processQueue();
//     };
//   }
// }

// // Инициализация воркеров
// for (let i = 0; i < MAX_WORKERS; i++) {
//   workerPool.push(new Worker('image-worker.js'));
// }

// // Функция для отложенной загрузки
// function lazyLoadImage(url, bounds, options = {}, immediate = false) {
//   return new Promise((resolve) => {
//     loadQueue.push({
//       id: `img_${performance.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       url,
//       bounds,
//       options,
//       immediate,
//       resolve
//     });
//     processQueue();
//   });
// }

//ggggggggggggggggggggggggggg

// var image1 = L.imageOverlay('WWmap_s1_vl.png', [[3000, 0], [6001, 3501]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);
// var image2 = L.imageOverlay('WWmap_s2_vc.png', [[3000, 3500], [6001, 7001]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);
// var image3 = L.imageOverlay('WWmap_s3_vp.png', [[3000, 7000], [6001, 10501]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);
// var image4 = L.imageOverlay('WWmap_s4_nl.png', [[0, 0], [3001, 3501]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);
// var image5 = L.imageOverlay('WWmap_s5_nc.png', [[0, 3500], [3001, 7001]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);
// var image6 = L.imageOverlay('WWmap_s6_np.png', [[0, 7000], [3001, 10501]], {
//   minZoom: -2,
//   maxZoom: 2,
//   bounds: [[0,0], [6000,10500]],
//   noWrap: true,
//   tms: true // если тайлы в формате TMS
// }).addTo(map);


// var image10 = L.imageOverlay('WWtile1(10500-500) s 0 do 500.jpg', [[0, 0], [500, 10500]]).addTo(map);

var image1 = L.imageOverlay('TeploMapVer.png', [[2000, 0], [4000, 3940]]).addTo(map);
var image2 = L.imageOverlay('TeploMapNiz.png', [[0, 0], [2001, 3940]]).addTo(map);
// var image4 = L.imageOverlay('WWmap_s4_nl.png', [[0, 0], [3001, 3501]]).addTo(map);
// var image5 = L.imageOverlay('WWmap_s5_nc.png', [[0, 3500], [3001, 7001]]).addTo(map);
// var image6 = L.imageOverlay('WWmap_s6_np.png', [[0, 7000], [3001, 10501]]).addTo(map);
// var image1 = L.imageOverlay('WWmap_s1_vl.png', [[3000, 0], [6001, 3501]]).addTo(map);
// var image2 = L.imageOverlay('WWmap_s2_vc.png', [[3000, 3500], [6001, 7001]]).addTo(map);
// var image3 = L.imageOverlay('WWmap_s3_vp.png', [[3000, 7000], [6001, 10501]]).addTo(map);
// var image7 = L.imageOverlay('WWmap_provs_zero.png', [[0, 0], [6000, 10500]], {opacity: 0.4});
// var image8 = L.imageOverlay('WWmap_regs_name.png', [[0, 0], [6000, 10500]]);
// var image9 = L.imageOverlay('WWmap_fer.png', [[0, 0], [6000, 10500]], {opacity: 0.7});
var image101 = L.imageOverlay('pr1 reka.png', [[0, 0], [3940, 4000]],  {opacity: 0.5});
var image102 = L.imageOverlay('pr2 rekaniz.png', [[0, 0], [3940, 4000]], {opacity: 0.5});
var image103 = L.imageOverlay('pr3 rekalev.png', [[0, 0], [3940, 4000]], {opacity: 0.5});
var image104 = L.imageOverlay('pr4 levisl1.png', [[0, 0], [3940, 4000]],  {opacity: 0.5});
var image105 = L.imageOverlay('pr5 pravisl1.png', [[0, 0], [3940, 4000]],  {opacity: 0.5});
var ProvMap = L.layerGroup([
    image101,
    image102,
    image103,
    image104,
    image105,
]);
var baseMaps = {
    "Карта провинций": ProvMap
    // "Индекс урожайности": image9,
    // "Чистая карта": emptyLayer
};
// Создаем слой для провинций
var provincesLayer = L.layerGroup();

// Данные провинций - каждая имеет свои уникальные границы
var provincesData = [
    {
        id: 'pr1',
        name: 'Река',
        image: image101,
        bounds: [[0, 0], [3940, 4000]], // Замените на реальные границы
        description: 'Великая речная долина с плодородными землями'
    },
    {
        id: 'pr2', 
        name: 'Реканиз',
        image: image102,
        bounds: [[0, 0], [3940, 4000]], // Замените на реальные границы
        description: 'Нижнее течение реки с болотистыми берегами'
    },
    {
        id: 'pr3',
        name: 'Реколев',
        image: image103,
        bounds: [[0, 0], [3940, 4000]], // Замените на реальные границы
        description: 'Лесистые берега верхнего течения'
    },
    {
        id: 'pr4',
        name: 'Левисл',
        image: image104,
        bounds: [[0, 0], [3940, 4000]], // Замените на реальные границы
        description: 'Левый берег реки с горными склонами'
    },
    {
        id: 'pr5',
        name: 'Прависл',
        image: image105,
        bounds: [[0, 0], [3940, 4000]], // Замените на реальные границы
        description: 'Правый берег с равнинными территориями'
    }
];

// Функция для создания интерактивных полигонов
function createInteractiveProvinces() {
    provincesData.forEach(function(province) {
        // Создаем полигон по точным границам провинции
        var polygon = L.rectangle(province.bounds, {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: 0,
            weight: 0,
            interactive: true
        });

        // Обработчики событий
        polygon.on('click', function(e) {
            showProvinceInfo(province);
            // Подсвечиваем выбранную провинцию
            highlightProvince(polygon);
        });

        polygon.on('mouseover', function(e) {
            if (!polygon.isHighlighted) {
                polygon.setStyle({
                    fillColor: '#FFD700',
                    fillOpacity: 0.2,
                    weight: 1,
                    color: '#FFD700'
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

        // Сохраняем данные провинции
        polygon.provinceData = province;
        polygon.addTo(provincesLayer);
    });
}

// Переменная для хранения текущей выделенной провинции
var currentHighlightedProvince = null;

// Функция для подсветки выбранной провинции
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
        fillColor: '#8B0000',
        fillOpacity: 0.3,
        weight: 2,
        color: '#8B0000'
    });
    polygon.isHighlighted = true;
    currentHighlightedProvince = polygon;
}

// Функция для показа информации о провинции
function showProvinceInfo(province) {
    // Ищем дополнительные данные в вашем файле
    var additionalData = findProvinceInData(province.name);
    
    var popupContent = `
        <div class="province-popup" style="min-width: 300px;">
            <h3 style="margin: 0 0 15px 0; color: #8B0000; border-bottom: 2px solid #CD853F; padding-bottom: 8px; text-align: center;">
                ${province.name}
            </h3>
            
            <div style="margin-bottom: 12px; padding: 8px; background: rgba(205, 133, 63, 0.1); border-radius: 4px;">
                <strong style="color: #8B4513;">📖 Описание:</strong><br>
                ${additionalData ? additionalData.description : province.description}
            </div>
            
            ${additionalData ? `
            <div style="margin-bottom: 10px;">
                <strong style="color: #8B4513;">🏛️ Тип:</strong> ${additionalData.type || 'Провинция'}
            </div>
            
            <div style="margin-bottom: 10px; font-size: 0.9em; color: #666;">
                <strong>📍 Координаты:</strong> ${additionalData.coordinates}
            </div>
            
            ${additionalData.special ? `
            <div style="margin-bottom: 10px; padding: 6px; background: rgba(255, 215, 0, 0.1); border-left: 3px solid #FFD700;">
                <strong style="color: #8B4513;">✨ Особенности:</strong> ${additionalData.special}
            </div>
            ` : ''}
            ` : ''}
            
            <div style="font-size: 0.8em; color: #999; text-align: center; margin-top: 15px; border-top: 1px solid #DDD; padding-top: 8px;">
                Кликните на другую провинцию для просмотра информации
            </div>
        </div>
    `;

    // Центр провинции для popup
    var center = [
        (province.bounds[0][0] + province.bounds[1][0]) / 2,
        (province.bounds[0][1] + province.bounds[1][1]) / 2
    ];

    L.popup()
        .setLatLng(center)
        .setContent(popupContent)
        .openOn(map);
}

// Функция для поиска дополнительной информации в ваших данных
function findProvinceInData(provinceName) {
    // Интегрируем с вашими данными из WarmWindsTextMap.txt
    // Пример поиска по имени провинции
    if (window.sheetData && window.sheetData.values) {
        for (let i = 1; i < window.sheetData.values.length; i++) {
            const row = window.sheetData.values[i];
            if (row[0] && row[0].toLowerCase().includes(provinceName.toLowerCase())) {
                return {
                    name: row[0],
                    description: row[1],
                    coordinates: `${row[2]}, ${row[3]}`,
                    type: row[4],
                    special: row[5] || '' // если есть дополнительные поля
                };
            }
        }
    }
    return null;
}

// Модифицируем вашу функцию загрузки данных для сохранения их в глобальной переменной
fetch('WarmWindsTextMap.txt')
    .then(response => {
        if (!response.ok) throw new Error("Ошибка загрузки файла");
        return response.json();
    })
    .then(data => {
        console.log("Данные успешно загружены из файла:", data);
        // Сохраняем данные в глобальной переменной для доступа из других функций
        window.sheetData = data;
        processData(data.values);
    })
    .catch(error => {
        console.error("Ошибка:", error);
    });

// Инициализируем интерактивные провинции
createInteractiveProvinces();

// Обновляем baseMaps
var baseMaps = {
    "Карта провинций": L.layerGroup([ProvMap, provincesLayer]),
    // Другие слои...
};

// Обновляем контрол слоев
L.control.layers(baseMaps, {
    'Столицы': layers['Столица'],
    'Города': layers['Город'],
    'Крепости': layers['Крепость'],
    'Порты': layers['Порт'],
    'Отслеживание координат': coordinateTrackingLayer,
    'Интерактивные провинции': provincesLayer
}).addTo(map);

// Добавляем CSS стили
var style = document.createElement('style');
style.textContent = `
    .province-popup {
        font-family: 'Georgia', serif;
        line-height: 1.4;
    }
    .leaflet-popup-content-wrapper {
        background: linear-gradient(135deg, #F5F5DC, #DEB887);
        border: 2px solid #8B4513;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .leaflet-popup-tip {
        background: #DEB887;
    }
`;
document.head.appendChild(style);
L.control.layers(baseMaps).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);
map.on('drag', function() {
map.panInsideBounds(bounds, { animate: false });
});
// Иконки для разных типов меток
var iconTypes = {
    'Чудеса': L.IconMaterial.icon({
        icon: 'star', // Name of Material icon
        iconColor: '#FFD700', // Material icon color (could be rgba, hex, html name...)
        markerColor: '#8B0000', // Marker fill color
        outlineColor: '#2F1B0A', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [25, 34], // Width and height of the icon
        popupAnchor: [0, -34]
    }),
    'Руины': L.IconMaterial.icon({
        icon: 'landslide', // Обвал/руины
        // или 'dangerous' - опасное место
        iconColor: '#8B7355',
        markerColor: '#4A3520',
        outlineColor: '#2F1B0A',
        outlineWidth: 2,
        iconSize: [20, 28],
        popupAnchor: [0, -28]
    }),
    'Поселения': L.IconMaterial.icon({
        icon: 'account_balance', // Name of Material icon
        iconColor: 'papyrus', // Material icon color (could be rgba, hex, html name...)
        markerColor: 'bronze', // Marker fill color
        outlineColor: 'sand', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [25, 34], // Width and height of the icon
        popupAnchor: [0, -34]
    }),
    // 'Крепость': L.IconMaterial.icon({
    //     icon: 'castle', // Name of Material icon
    //     iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
    //     markerColor: 'Gray', // Marker fill color
    //     outlineColor: 'black', // Marker outline color
    //     outlineWidth: 2, // Marker outline width
    //     iconSize: [25, 34], // Width and height of the icon
    //     popupAnchor: [0, -34]
    // }),
    // 'Порт': L.IconMaterial.icon({
    //     icon: 'anchor', // Name of Material icon
    //     iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
    //     markerColor: 'SteelBlue', // Marker fill color
    //     outlineColor: 'black', // Marker outline color
    //     outlineWidth: 2, // Marker outline width
    //     iconSize: [12, 16], // Width and height of the icon
    //     popupAnchor: [0, -16]
    // })
};

// Группы слоев для разных типов меток
var layers = {
    'Столица': L.layerGroup().addTo(map),
    'Город': L.layerGroup().addTo(map),
    'Крепость': L.layerGroup().addTo(map),
    'Порт': L.layerGroup().addTo(map)
};

// Создаем отдельный слой для маркера с координатами
var coordinateTrackingLayer = L.layerGroup();

// Добавляем перемещаемый маркер столицы в слой "Отслеживание координат"
var capitalMarker = L.marker([4500, 4500], {
    icon: iconTypes['Столица'],
    draggable: true // Маркер можно перемещать
}).addTo(coordinateTrackingLayer);

// Всплывающее окно с координатами
capitalMarker.bindPopup(`<b>Столица</b><br>Координаты: ${capitalMarker.getLatLng().lat}, ${capitalMarker.getLatLng().lng}`);

// Обновляем координаты при перемещении маркера
capitalMarker.on('dragend', function(event) {
    var marker = event.target;
    var position = marker.getLatLng(); // Получаем новые координаты
    
    marker.setPopupContent(`<b>Столица</b><br>Координаты: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`).openPopup();
    console.log(`Новые координаты: ${position.lat}, ${position.lng}`); // Лог координат
});

// ID Google Таблицы и API Key
// ID Google Таблицы и API Key
// ЗАМЕНА
// ID Google Таблицы и API Key
// ID Google Таблицы и API Key

// var url = `https://disk.yandex.ru/i/M-st3axses3psA`;

// Загружаем данные с Google Sheets

// fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         // Логируем полученные данные для отладки
//         console.log("Полученные данные из Google Sheets:", data);
//         // Получаем строки значений из таблицы
//         var rows = data.values;
//         // Пропускаем первую строку, если это заголовки
//         rows.slice(1).forEach(function(row) {
//             // Важно убедиться, что все необходимые поля присутствуют
//             if (row.length >= 5) {
//                 var name = row[0]; // Имя
//                 var description = row[1]; // Описание
//                 var lat = parseFloat(row[2]); // Широта
//                 var lng = parseFloat(row[3]); // Долгота
//                 var type = row[4]; // Тип метки
//                 // Проверяем корректность данных перед добавлением метки
//                 if (!isNaN(lat) && !isNaN(lng) && iconTypes[type]) {
//                     // Создаем метку
//                     var marker = L.marker([lat, lng], { icon: iconTypes[type] })
//                         .bindPopup(`
//                             <div class="popup-header">${name}</div>
//                             <div class="popup-description">${description}</div>
//                         `);

//                     if (type !== 'Порт') {
//                         marker.bindTooltip(name, { permanent: true, direction: 'right', offset: L.point(11, -15) });
//                     }

//                     // Добавляем метку в соответствующую группу
//                     layers[type].addLayer(marker);
//                 }
//             }
//         });
//     })
//     .catch(error => {
//         console.error("Ошибка загрузки данных с Google Sheets:", error);
//     });

// ЗАМЕНА НА СЛЕДУЮЩЕЕ

// Удаляем старый URL и заменяем на загрузку файла
fetch('WarmWindsTextMap.txt')
    .then(response => {
        if (!response.ok) throw new Error("Ошибка загрузки файла");
        return response.json();
    })
    .then(data => {
        console.log("Данные успешно загружены из файла:", data);
        processData(data.values);
    })
    .catch(error => {
        console.error("Ошибка:", error);
        // Фолбек на резервные данные при ошибке
        const backupData = {
            values: [
                ["Меретон", "Описание...", 4363.0, 4464.0, "Столица"]
            ]
        };
        processData(backupData.values);
    });

function processData(rows) {
    // Пропускаем первую строку (пустой массив)
    rows.slice(1).forEach(row => {
        if (row.length >= 5) {
            const name = row[0];
            const description = row[1];
            const lat = parseFloat(row[2]);
            const lng = parseFloat(row[3]);
            const type = row[4];
            
            if (!isNaN(lat) && !isNaN(lng) && iconTypes[type]) {
                const marker = L.marker([lat, lng], { icon: iconTypes[type] })
                    .bindPopup(`
                        <div class="popup-header">${name}</div>
                        <div class="popup-description">${description}</div>
                    `);
                
                if (type !== 'Порт') {
                    marker.bindTooltip(name, { 
                        permanent: true, 
                        direction: 'right', 
                        offset: L.point(11, -15) 
                    });
                }
                
                layers[type].addLayer(marker);
            }
        }
    });
}

// Добавляем контрол для включения/выключения групп меток
L.control.layers(null, {
    'Столицы': layers['Столица'],
    'Города': layers['Город'],
    'Крепости': layers['Крепость'],
    'Порты': layers['Порт'],
    'Отслеживание координат': coordinateTrackingLayer // Добавляем слой для маркера с координатами
}).addTo(map);

//Меняет рендер карты при близком приближении
function RenderingChanger(){
    curZoom = map.getZoom();
    let mapContainer = map.getContainer();

    // Выбираем все элементы img внутри контейнера карты
    let images = mapContainer.querySelectorAll('img');

    // Изменяем стили для каждого элемента img
    images.forEach(function(img) {
        if( curZoom >= 1){
            img.style.imageRendering = "pixelated";
        }
        else{
            img.style.imageRendering = "auto";
        }
    });
}
function setupZoomHideSpecificPanes(map, layersToHide, minZoomToHide) {
    // Проходим по всем слоям карты
    // map.eachLayer(function(layer) {
    //     // Проверяем, является ли слой одним из тех, которые нужно скрыть
    //     if (layersToHide.includes(layer)) {
    //         var pane = layer.getPane();
    //         if (pane) {
    //             if (curZoom >= minZoomToHide) {
    //                 pane.style.display = 'none';
    //             } else {
    //                 pane.style.display = 'block';
    //             }
    //         }
    //     }
    // });
    // let panes = document.getElementsByClassName("leaflet-tooltip");
    // panes.forEach(function(pane){
    //     if (curZoom >= minZoomToHide) {
    //         pane.style.display = 0.8;
    //     } else {
    //         pane.style.opacity = 0;
    //     }
    // });
    // L.control.layers.forEach(function(layer){
    //     if (layersToHide.includes(layer)) {
    //         var pane = layer.getPane();
    //         if (pane) {
    //             if (curZoom >= minZoomToHide) {
    //                 pane.style.display = 'none';
    //             } else {
    //                 pane.style.display = 'block';
    //             }
    //         }
    //     }
    // });
}

//вызывает функцию при изменении приближения карты
map.on('zoomend', function(){
    RenderingChanger();
    setupZoomHideSpecificPanes(map, [layers['Столица'], layers['Город']], 5);
});

// Подпись автора
var signatureControl = L.control({position: 'bottomright'});

signatureControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'developer-signature');
    div.innerHTML = 
        '<div style="display: flex; align-items: center; background-color: rgba(255, 255, 255, 0.5); padding: 0px; border-radius: 0px;">' +
            '<a href="https://vk.com/vivmim" target="_blank" style="margin-left: 3px; text-decoration: underline; color: blue; font-size: 1em;">' +
                'Viv Mim' +
            '</a>' +
        '</div>';
    return div;
};

signatureControl.addTo(map);
