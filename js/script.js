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
// ĐIỂM THU GOM RÁC TÁI CHẾ HÀ NỘI
// =============================

// Tổ 1 Phú Diễn
L.marker([21.0495, 105.7608], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>📍 Tổ 1 Phú Diễn</b><br>
Địa chỉ: Đối diện số 277, ngõ 68 đường Phú Diễn, Bắc Từ Liêm<br>
♻️ Thu gom rác tái chế<br>
🕗 Thời gian: Sáng Thứ 7 (08:30)
`);

// Cánh Sen Hồng
L.marker([20.9885, 105.8368], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>🌸 Điểm Cánh Sen Hồng</b><br>
42 Trần Điền, Hoàng Mai<br>
♻️ Nhận: Vỏ hộp sữa, pin cũ<br>
🕗 Thứ 2: 14:00 - 18:30<br>
🕗 Thứ 3 - Thứ 7: 08:00 - 18:30
`);

// Balala
L.marker([21.0232, 105.9015], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>♻️ Trạm thu gom Balala</b><br>
20/202/12 Cổ Linh, Long Biên<br>
📦 Nhận: Quần áo, điện tử, pin cũ, rác khó tái chế<br>
📞 0987 570 455
`);

// URENCO Hoàn Kiếm
L.marker([21.0205, 105.8576], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>🚛 URENCO - Hoàn Kiếm</b><br>
Số 8 Phan Huy Chú<br>
🎁 Đổi rác lấy quà<br>
🕗 Sáng Thứ 7
`);

// URENCO Ba Đình
L.marker([21.0318, 105.8185], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>🚛 URENCO - Ba Đình</b><br>
282 Kim Mã<br>
🎁 Đổi rác lấy quà
`);

// URENCO Đống Đa
L.marker([21.0132, 105.8235], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>🚛 URENCO - Đống Đa</b><br>
59C Hoàng Cầu<br>
🎁 Đổi rác lấy quà
`);

// URENCO Hai Bà Trưng
L.marker([21.0110, 105.8620], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>🚛 URENCO - Hai Bà Trưng</b><br>
Điểm truyền tải Vân Đồn<br>
(Gần cây xăng Lương Yên)
`);

// Lagom MRF
L.marker([21.1424, 105.8669], { icon: recycleIcon })
.addTo(map)
.bindPopup(`
<b>♻️ Lagom MRF</b><br>
277 Đào Cam Mộc<br>
Việt Hùng, Đông Anh
`);