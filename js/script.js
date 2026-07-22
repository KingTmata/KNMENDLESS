// =========================
// GREENMAP AI
// =========================

var map = L.map('map').setView([21.0285,105.8542],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{

    attribution:'© OpenStreetMap'

}).addTo(map);
var userIcon = new L.Icon({
    iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

    shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

var recycleIcon = new L.Icon({
    iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

    shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});
var electronicsIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

var unverifiedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position){

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        map.setView([lat,lng],15);

        L.marker([lat, lng], {icon: userIcon})
        .addTo(map)
        .bindPopup("📍 Bạn đang ở đây")
        .openPopup();

    });

}
// =============================
// Load locations from data/locations.json and render markers
// =============================

fetch('data/locations.json')
    .then(res => res.json())
    .then(locations => {
        locations.forEach(loc => {
            const lat = loc.lat || loc.latitude;
            const lng = loc.lng || loc.longitude;
            if (!lat || !lng) return;

            // choose icon
            let icon = recycleIcon;
            const items = (loc.items || '').toLowerCase();
            if (items.includes('pin') || items.includes('pin lithium') || items.includes('pin cũ')) {
                icon = electronicsIcon;
            } else if (items.includes('máy') || items.includes('điện tử') || items.includes('laptop') || items.includes('điện thoại')) {
                icon = electronicsIcon;
            } else if (loc.verified === false) {
                icon = unverifiedIcon;
            }

            const googleDir = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&hl=vi`;
            const popupHtml = `
                <b>${loc.verified === false ? '⚠️ ' : ''}${loc.name}</b><br>
                ${loc.address ? `Địa chỉ: ${loc.address}<br>` : ''}
                ${loc.items ? `Nhận: ${loc.items}<br>` : ''}
                ${loc.time ? `Thời gian: ${loc.time}<br>` : ''}
                ${loc.phone ? `SĐT: ${loc.phone}<br>` : ''}
                ${loc.verified === false ? '<i>Chưa xác minh (vui lòng kiểm tra)</i><br>' : ''}
                ${loc.source ? `<a href="${loc.source}" target="_blank">Nguồn</a><br>` : ''}
                <a href="#" onclick="routeTo(${lat}, ${lng}); return false;">Chỉ đường trực tiếp trên bản đồ</a>
                &nbsp;|&nbsp;
                <a href="${googleDir}" target="_blank">Mở Google Maps</a>
            `;

            const marker = L.marker([lat, lng], { icon: icon, draggable: false, keyboard: false, interactive: true, riseOnHover: true });
            marker.addTo(map).bindPopup(popupHtml);
            // Ensure marker cannot be dragged or moved
            if (marker.dragging) {
                try { marker.dragging.disable(); } catch (err) { /* ignore */ }
            }
            // Guard against accidental programmatic moves: reset to original coords if moved
            const originalLatLng = L.latLng(lat, lng);
            marker.on('move', function() {
                marker.setLatLng(originalLatLng);
            });
        });
    })
    .catch(err => console.error('Không thể tải data/locations.json', err));

// Routing control (initialized when user requests directions)
var routingControl = null;

window.routeTo = function(destLat, destLng) {
    if (!L.Routing) {
        alert('Chức năng chỉ đường chưa sẵn sàng.');
        return;
    }

    function createRoute(startLat, startLng) {
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(startLat, startLng),
                L.latLng(destLat, destLng)
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoute: true,
            addWaypoints: false,
            createMarker: function(i, wp, nWps) {
                return L.marker(wp.latLng, {
                    draggable: false,
                    keyboard: false,
                    interactive: false,
                    icon: new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34]
                    })
                });
            }
        }).addTo(map);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            createRoute(pos.coords.latitude, pos.coords.longitude);
        }, function(err) {
            // fallback: open Google Maps directions in new tab
            const googleDir = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&hl=vi`;
            if (confirm('Không thể lấy vị trí hiện tại. Mở Google Maps để chỉ đường ngoài trình duyệt?')) {
                window.open(googleDir, '_blank');
            }
        }, { enableHighAccuracy: true, timeout: 10000 });
    } else {
        const googleDir = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&hl=vi`;
        if (confirm('Trình duyệt không hỗ trợ định vị. Mở Google Maps để chỉ đường ngoài trình duyệt?')) {
            window.open(googleDir, '_blank');
        }
    }
};

window.clearRoute = function() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
};