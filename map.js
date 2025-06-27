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

let curZoom = map.getZoom();
var bounds = [[0, 0], [6000, 10500]];

var image4 = L.imageOverlay('WWmap_s4_nl.png', [[0, 0], [3000, 3500]]).addTo(map);
var image5 = L.imageOverlay('WWmap_s5_nc.png', [[0, 3500], [3000, 7000]]).addTo(map);
var image6 = L.imageOverlay('WWmap_s6_np.png', [[0, 7000], [3000, 10500]]).addTo(map);
var image1 = L.imageOverlay('WWmap_s1_vl.png', [[3000, 0], [6000, 3500]]).addTo(map);
var image2 = L.imageOverlay('WWmap_s2_vc.png', [[3000, 3500], [6000, 7000]]).addTo(map);
var image3 = L.imageOverlay('WWmap_s3_vp.png', [[3000, 7000], [6000, 10500]]).addTo(map);
var image7 = L.imageOverlay('WWsetka01.png', [[0, 0], [0, 0]]).addTo(map);

var baseMaps = {
    "Политическая карта": image7,
    "Географическая карта": image5
};

L.control.layers(baseMaps).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);
map.on('drag', function() {
map.panInsideBounds(bounds, { animate: false });
});
// Иконки для разных типов меток
var iconTypes = {
    'Столица': L.IconMaterial.icon({
        icon: 'star', // Name of Material icon
        iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
        markerColor: '#B22222', // Marker fill color
        outlineColor: 'black', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [25, 34], // Width and height of the icon
        popupAnchor: [0, -34]
    }),
    'Город': L.IconMaterial.icon({
        icon: 'home', // Name of Material icon
        iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
        markerColor: 'Orange', // Marker fill color
        outlineColor: 'black', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [25, 34], // Width and height of the icon
        popupAnchor: [0, -34]
    }),
    'Крепость': L.IconMaterial.icon({
        icon: 'castle', // Name of Material icon
        iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
        markerColor: 'Gray', // Marker fill color
        outlineColor: 'black', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [25, 34], // Width and height of the icon
        popupAnchor: [0, -34]
    }),
    'Порт': L.IconMaterial.icon({
        icon: 'anchor', // Name of Material icon
        iconColor: 'white', // Material icon color (could be rgba, hex, html name...)
        markerColor: 'SteelBlue', // Marker fill color
        outlineColor: 'black', // Marker outline color
        outlineWidth: 2, // Marker outline width
        iconSize: [12, 16], // Width and height of the icon
        popupAnchor: [0, -16]
    })
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
var url = `https://sheets.googleapis.com/v4/spreadsheets/1JhCygdVpq-13xNVrUQVvGzFXhYETviRZKWYhDv-ky_k/values/Sheet1!A:E?key=AIzaSyBdhS5jcD7VLxHDWwy1cC8pZUM0p6_S4xU`;

// Загружаем данные с Google Sheets
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Логируем полученные данные для отладки
        console.log("Полученные данные из Google Sheets:", data);
        // Получаем строки значений из таблицы
        var rows = data.values;
        // Пропускаем первую строку, если это заголовки
        rows.slice(1).forEach(function(row) {
            // Важно убедиться, что все необходимые поля присутствуют
            if (row.length >= 5) {
                var name = row[0]; // Имя
                var description = row[1]; // Описание
                var lat = parseFloat(row[2]); // Широта
                var lng = parseFloat(row[3]); // Долгота
                var type = row[4]; // Тип метки
                // Проверяем корректность данных перед добавлением метки
                if (!isNaN(lat) && !isNaN(lng) && iconTypes[type]) {
                    // Создаем метку
                    var marker = L.marker([lat, lng], { icon: iconTypes[type] })
                        .bindPopup(`
                            <div class="popup-header">${name}</div>
                            <div class="popup-description">${description}</div>
                        `);

                    if (type !== 'Порт') {
                        marker.bindTooltip(name, { permanent: true, direction: 'right', offset: L.point(11, -15) });
                    }

                    // Добавляем метку в соответствующую группу
                    layers[type].addLayer(marker);
                }
            }
        });
    })
    .catch(error => {
        console.error("Ошибка загрузки данных с Google Sheets:", error);
    });

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
