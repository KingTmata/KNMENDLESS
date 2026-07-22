//========================
// NẾU F5 (RELOAD) → XOÁ SẠCH CHAT
//========================

if (performance.getEntriesByType("navigation").length > 0) {
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav.type === "reload") {
        sessionStorage.clear();
    }
}

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const imageInput = document.getElementById("imageInput");
const cameraInput = document.getElementById("cameraInput");
const previewArea = document.getElementById("previewArea");
const previewThumb = document.getElementById("previewThumb");
const previewName = document.getElementById("previewName");
const attachPopup = document.getElementById("attachPopup");

const STORAGE_KEY = "greenmap_chatHTML";
const HISTORY_KEY = "greenmap_history";
const MAX_CONTEXT = 5;

let selectedImage = null;
let selectedFileName = "";
let messageHistory = [];

//========================
// DỮ LIỆU ĐIỂM THU GOM GREENMAP
//========================

const LOCATIONS = [
    { name:"Tổ 1 Phú Diễn", address:"Đối diện số 277, ngõ 68 đường Phú Diễn, Bắc Từ Liêm", time:"Sáng Thứ 7 (08:30)", items:"Rác tái chế" },
    { name:"Điểm Cánh Sen Hồng", address:"42 Trần Điền, Hoàng Mai", time:"Thứ 2: 14:00-18:30, Thứ 3-7: 08:00-18:30", items:"Vỏ hộp sữa, pin cũ" },
    { name:"Trạm thu gom Balala", address:"20/202/12 Cổ Linh, Long Biên", time:"Liên hệ 0987 570 455", items:"Quần áo, điện tử, pin cũ, rác khó tái chế" },
    { name:"URENCO - Hoàn Kiếm", address:"Số 8 Phan Huy Chú", time:"Sáng Thứ 7", items:"Đổi rác lấy quà" },
    { name:"URENCO - Ba Đình", address:"282 Kim Mã", time:"-", items:"Đổi rác lấy quà" },
    { name:"URENCO - Đống Đa", address:"59C Hoàng Cầu", time:"-", items:"Đổi rác lấy quà" },
    { name:"URENCO - Hai Bà Trưng", address:"Điểm truyền tải Vân Đồn (gần cây xăng Lương Yên)", time:"-", items:"Rác tái chế" },
    { name:"Lagom MRF", address:"277 Đào Cam Mộc, Việt Hùng, Đông Anh", time:"-", items:"Rác tái chế" },
    { name:"Việt Nam Tái Chế", address:"Hà Nội", time:"Liên hệ trước để xác nhận thời gian", items:"Máy tính, điện thoại, máy in, pin lithium, thiết bị công nghệ cũ" }
];

//========================
// LOAD / SAVE SESSION
//========================

function loadChat(){
    const savedHTML = sessionStorage.getItem(STORAGE_KEY);
    if(savedHTML){
        chatBox.innerHTML = savedHTML;
    }
    const savedHistory = sessionStorage.getItem(HISTORY_KEY);
    if(savedHistory){
        try{
            messageHistory = JSON.parse(savedHistory);
        }catch(e){
            messageHistory = [];
        }
    }
    scrollBottom();
}

function saveChat(){
    sessionStorage.setItem(STORAGE_KEY, chatBox.innerHTML);
    if(messageHistory.length > MAX_CONTEXT){
        messageHistory = messageHistory.slice(-MAX_CONTEXT);
    }
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messageHistory));
}

//========================
// ENTER ĐỂ GỬI
//========================

input.addEventListener("keydown", function(e){
    if(e.key==="Enter"){
        sendMessage();
    }
});

//========================
// ATTACH POPUP
//========================

function toggleAttachPopup(){
    const isVisible = attachPopup.style.display === "flex";
    // Ẩn tất cả popup khác
    document.querySelectorAll(".attach-popup").forEach(p => p.style.display = "none");
    attachPopup.style.display = isVisible ? "none" : "flex";
}

// Đóng popup khi click ra ngoài
document.addEventListener("click", function(e){
    if(!e.target.closest(".attach-wrapper")){
        attachPopup.style.display = "none";
    }
});

function selectUpload(){
    attachPopup.style.display = "none";
    imageInput.click();
}

function selectCamera(){
    attachPopup.style.display = "none";
    cameraInput.click();
}

//========================
// CHỌN ẢNH TỪ UPLOAD
//========================

imageInput.addEventListener("change", function(){
    const file = this.files[0];
    if(file) handleImage(file);
});

//========================
// CHỌN ẢNH TỪ CAMERA
//========================

cameraInput.addEventListener("change", function(){
    const file = this.files[0];
    if(file) handleImage(file);
});

//========================
// NÉN ẢNH + HIỆN PREVIEW
//========================

function compressImage(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e){
            const img = new Image();
            img.onload = function(){
                const canvas = document.createElement("canvas");
                const MAX = 1024;
                let w = img.width;
                let h = img.height;
                if(w > MAX || h > MAX){
                    if(w > h){
                        h = Math.round(h * MAX / w);
                        w = MAX;
                    } else {
                        w = Math.round(w * MAX / h);
                        h = MAX;
                    }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);
                const compressed = canvas.toDataURL("image/jpeg", 0.7);
                resolve(compressed);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleImage(file){
    if(!file) return;
    if(!file.type.startsWith("image/")){
        alert("Vui lòng chọn ảnh.");
        return;
    }

    selectedFileName = file.name;

    try {
        const compressed = await compressImage(file);
        selectedImage = compressed;

        // Hiện preview phía trên ô nhập
        previewThumb.src = compressed;
        previewName.textContent = file.name;
        previewArea.style.display = "block";
    } catch(e){
        alert("Không thể xử lý ảnh.");
    }
}

//========================
// XOÁ ẢNH PREVIEW
//========================

function removeImage(){
    selectedImage = null;
    selectedFileName = "";
    previewArea.style.display = "none";
    previewThumb.src = "";
    imageInput.value = "";
    cameraInput.value = "";
}

//========================
// GỬI TIN
//========================

async function sendMessage(){
    const text = input.value.trim();
    const currentImage = selectedImage;
    const currentFileName = selectedFileName;

    if(text === "" && !currentImage){
        return;
    }

    // Nếu có text thì hiện trong chat
    if(text !== ""){
        chatBox.innerHTML += `
        <div class="user-message">
            <div class="message">
                ${text}
            </div>
        </div>
        `;
    }

    // Nếu có ảnh preview thì hiện ảnh trong chat + xoá preview
    if(currentImage){
        chatBox.innerHTML += `
        <div class="user-message">
            <div class="message">
                <img src="${currentImage}" style="max-width:220px;border-radius:8px;margin-top:4px">
            </div>
        </div>
        `;
        // Xoá preview
        removeImage();
    }

    const userMsg = text || (currentImage ? `[Hình ảnh: ${currentFileName}]` : "");
    if(userMsg){
        messageHistory.push({ role:"user", text:userMsg });
    }

    input.value = "";

    saveChat();
    scrollBottom();
    showThinking();

    const answer = await askGemini(text, currentImage);

    removeThinking();

    addBotMessage(answer);

    selectedImage = null;
    selectedFileName = "";
    imageInput.value = "";
    cameraInput.value = "";
}

//========================
// BOT MESSAGE
//========================

function addBotMessage(text){
    chatBox.innerHTML += `
    <div class="bot-message">
        <img src="assets/images/chatbot.png">
        <div class="message">
            ${text}
        </div>
    </div>
    `;

    const plainText = text.replace(/<br>/g,"\n");
    messageHistory.push({ role:"model", text:plainText });

    saveChat();
    scrollBottom();
}

//========================
// THINKING
//========================

function showThinking(){
    chatBox.innerHTML += `
    <div class="bot-message" id="thinking">
        <img src="assets/images/chatbot.png">
        <div class="message">
            🤔 GreenBot đang phân tích...
        </div>
    </div>
    `;
    scrollBottom();
}

function removeThinking(){
    const think = document.getElementById("thinking");
    if(think) think.remove();
}

function scrollBottom(){
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getFallbackAnswer(question) {
    const q = (question || "").toLowerCase();

    if (q.includes("giấy") || q.includes("paper")) {
        return "📄 Giấy là rác tái chế. Hãy bỏ vào thùng giấy/tạp chí, tránh trộn với rác hữu cơ.";
    }

    if (q.includes("nhựa") || q.includes("chai") || q.includes("bình")) {
        return "🧴 Chai nhựa thường thuộc rác tái chế nếu đã rửa sạch và bỏ hết nước. Bỏ vào thùng nhựa hoặc điểm thu gom gần bạn.";
    }

    if (q.includes("pin")) {
        return "🔋 Pin cũ là rác nguy hại. Không vứt chung vào thùng rác thông thường, hãy mang đến điểm thu gom pin.";
    }

    if (q.includes("điểm") || q.includes("thu gom") || q.includes("địa chỉ")) {
        return "📍 Bạn có thể xem danh sách điểm thu gom trên GreenMap tại mục Điểm thu gom.";
    }

    return "🌿 Mình đang thử kết nối với GreenBot, nhưng dịch vụ AI hiện chưa phản hồi. Bạn có thể tiếp tục hỏi về phân loại rác hoặc điểm thu gom, mình sẽ hỗ trợ theo dữ liệu sẵn có.";
}

//========================
// GỌI BACKEND VERCEL (Cập nhật xử lý Ảnh + Text)
//========================

async function sendToGemini(userText, imageBase64) {
    try {
        // Tách bỏ phần "data:image/jpeg;base64," để API của Google đọc được
        let rawBase64 = null;
        if (imageBase64) {
            rawBase64 = imageBase64.split(",")[1]; 
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: userText,
                image: rawBase64 
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Lỗi backend /api/chat:", data);
            return null;
        }

        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        if (!replyText) return null; 

        return replyText;
    } catch (error) {
        console.error("Lỗi gửi tới /api/chat:", error);
        return null;
    }
}

//========================
// GỌI GEMINI (có context + địa điểm thật)
//========================

async function askGemini(question, imageBase64){

    const locationsText = LOCATIONS.map(l =>
        `- ${l.name}: ${l.address} | Giờ: ${l.time} | Nhận: ${l.items}`
    ).join("\n");

    const prompt=`
Bạn là GreenBot của GreenMap AI, chuyên hỗ trợ phân loại rác và tái chế.

Trả lời VỪA PHẢI, XÚC TÍCH, TRẢ LỜI TRÊN 2 CÂU , dễ đọc. Dùng icon phù hợp.

Luôn trả lời theo cấu trúc sau (chỉ thay nội dung, giữ nguyên các dấu hiệu):
- Dòng 1: 🍈 Tên vật phẩm
- Dòng 2: (trống)
- Dòng 3: 🟢 Loại: [loại rác]
- Dòng 4: ♻ Tái chế: [✔ Có / ✘ Không] + lưu ý ngắn
- Dòng 5: 🧺 Xử lý: [cách xử lý, ngắn gọn]
- Dòng 6: 📍 Bỏ vào: [thùng nào / điểm thu gom]
- Dòng 7: (trống)
- Dòng 8: 💡 Mẹo: [1 câu ngắn]

thêm giải thích NGẮN GỌN NẾU CẦN.
KHÔNG thêm số thứ tự, không dùng markdown ###.

Nếu người dùng gửi ảnh: xác định vật thể ngắn gọn rồi trả lời theo cấu trúc trên. Nếu ảnh mờ: "Không đủ cơ sở nhận diện."

trả lời đúng cấu trúc, không thêm gì khác.

Dựa vào lịch sử trò chuyện để hiểu ngữ cảnh.

DANH SÁCH ĐIỂM THU GOM CỦA GREENMAP (dùng để trả lời khi người dùng hỏi về địa điểm):
${locationsText}

Quy tắc về địa điểm:
- Khi người dùng hỏi về điểm thu gom, hãy trả lời DỰA VÀO danh sách trên.
- Nếu không có dữ liệu phù hợp, nói "Mình chưa có dữ liệu."
- KHÔNG tự bịa địa chỉ.
`;

    // Cho dù người dùng chỉ gửi ảnh (không gõ chữ), vẫn phải ép prompt vào để AI biết phải làm gì
    const currentText = question
        ? `${prompt}\n\nCâu hỏi của người dùng: ${question}`
        : `${prompt}\n\nNgười dùng đã gửi một bức ảnh, hãy phân tích nó.`;

    try{
        // Truyền đầy đủ Text và Ảnh vào hàm
        const responseText = await sendToGemini(currentText, imageBase64);
        if (responseText) {
            return responseText.replace(/\n/g, "<br>");
        }
        return getFallbackAnswer(question).replace(/\n/g, "<br>");
    }
    catch(e){
        console.log(e);
        return "❌ Lỗi hệ thống: Không kết nối được với Server.";
    }
}

//========================
// PASTE ẢNH
//========================

document.addEventListener("paste", function(e){

    const items = e.clipboardData.items;

    for(let item of items){
        if(item.type.startsWith("image/")){
            const file = item.getAsFile();
            handleImage(file);
            break;
        }
    }

});

//========================
// DRAG & DROP ẢNH
//========================

chatBox.addEventListener("dragover", function(e){
    e.preventDefault();
    chatBox.classList.add("dragging");
});

chatBox.addEventListener("dragleave", function(){
    chatBox.classList.remove("dragging");
});

chatBox.addEventListener("drop", function(e){
    e.preventDefault();
    chatBox.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    handleImage(file);
});

//========================
// INIT
//========================

loadChat();