let database = [];

// Load dữ liệu từ file waste.json
async function loadWasteData() {
    try {
        const response = await fetch('data/waste.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu');
        database = await response.json();
    } catch (error) {
        console.error('Lỗi tải waste.json:', error);
        // Fallback data nếu không load được
        database = [
            {
                keywords: ["nhựa", "chai", "pet", "chai nhựa", "chai nước", "chai coca", "chai pepsi"],
                name: "🧴 Chai nhựa",
                type: "Nhựa PET",
                color: "🟡 Thùng vàng",
                recycle: "✅ Có thể tái chế",
                decomposeTime: "450 - 1.000 năm",
                fact: "Chai nhựa PET mất từ 450 đến 1.000 năm để phân hủy.",
                comparison: "🔍 So với thủy tinh: Nhựa nhẹ hơn, rẻ hơn nhưng khó phân hủy hơn.",
                tip: "Rửa sạch, ép dẹt trước khi bỏ.",
                harmful: "Phân rã thành vi nhựa, xâm nhập vào đất, nước và chuỗi thức ăn."
            }
        ];
    }
}

// Đợi DOM và data tải xong
document.addEventListener("DOMContentLoaded", async function(){
    await loadWasteData();
    showRandomFact();
    
    const input = document.getElementById("wasteInput");
    if(input){
        input.addEventListener("keydown", function(e){
            if(e.key === "Enter"){
                classifyWaste();
            }
        });
        input.addEventListener("focus", function(){
            showSuggestions();
        });
        input.addEventListener("input", function(){
            showSuggestions();
        });
        input.addEventListener("blur", function(){
            setTimeout(function(){
                document.getElementById("suggestions").innerHTML = "";
            }, 200);
        });
        document.querySelector(".search-btn").addEventListener("click", function(){
            document.getElementById("suggestions").innerHTML = "";
        });
    }
});

// Hiển thị 1 fact ngẫu nhiên từ database
function showRandomFact(){
    if(database.length === 0) return;
    const randomIndex = Math.floor(Math.random() * database.length);
    const item = database[randomIndex];
    const factContent = document.getElementById("factContent");
    if(factContent){
        const decomposeText = item.decomposeTime ? `⏳ Thời gian phân hủy: <strong>${item.decomposeTime}</strong><br><br>` : "";
        factContent.innerHTML = `
            <div class="fact-item">
                <span class="fact-name">${item.name}</span>
                <p class="fact-text">${item.fact}</p>
                ${decomposeText ? `<p class="fact-decompose">${decomposeText}</p>` : ""}
            </div>
        `;
    }
}

function classifyWaste(){
    let text = document
        .getElementById("wasteInput")
        .value
        .toLowerCase()
        .trim();

    let item = database.find(data =>
        data.keywords.some(word => text.includes(word))
    );

    let result = document.getElementById("result");
    result.style.display = "block";

    if(item){
        result.innerHTML = `
            <div class="result-header">
                <h2>${item.name}</h2>
                <span class="result-badge ${item.recycle.includes('✅') ? 'badge-recycle' : 'badge-norecycle'}">${item.recycle}</span>
            </div>

            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">📂 Loại</span>
                    <span class="result-value">${item.type}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">🗑️ Phân loại</span>
                    <span class="result-value">${item.color}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">⏳ Thời gian phân hủy</span>
                    <span class="result-value highlight-time">${item.decomposeTime}</span>
                </div>
            </div>

            <div class="result-detail-card card-fact">
                <div class="card-icon">💡</div>
                <div class="card-content">
                    <strong>Sự thật thú vị:</strong>
                    <p>${item.fact}</p>
                </div>
            </div>

            <div class="result-detail-card card-comparison">
                <div class="card-icon">⚖️</div>
                <div class="card-content">
                    <strong>So sánh:</strong>
                    <p>${item.comparison}</p>
                </div>
            </div>

            <div class="result-detail-card card-tip">
                <div class="card-icon">✅</div>
                <div class="card-content">
                    <strong>Mẹo xử lý:</strong>
                    <p>${item.tip}</p>
                </div>
            </div>

            <div class="result-detail-card card-harmful">
                <div class="card-icon">⚠️</div>
                <div class="card-content">
                    <strong>Tác hại đến môi trường:</strong>
                    <p>${item.harmful}</p>
                </div>
            </div>
        `;
    }
    else{
        result.innerHTML = `
            <div class="result-notfound">
                <h2>😢 Không tìm thấy</h2>
                <p>Hãy thử nhập tên khác như: <b>chai nhựa, chai thủy tinh, pin, hộp xốp, túi nilon, giấy, quần áo cũ...</b></p>
            </div>
        `;
    }

    document.getElementById("suggestions").innerHTML = "";
}

function showSuggestions(){
    let text = document
        .getElementById("wasteInput")
        .value
        .toLowerCase();

    let box = document.getElementById("suggestions");
    box.innerHTML = "";

    if(text == "") return;

    database.forEach(item => {
        item.keywords.forEach(word => {
            if(word.includes(text)){
                box.innerHTML += `
                    <div class="suggest-item"
                        onclick="selectItem('${word}')">
                        🔍 ${word}
                    </div>
                `;
            }
        });
    });
}

function selectItem(word){
    document.getElementById("wasteInput").value = word;
    document.getElementById("suggestions").innerHTML = "";
    classifyWaste();
}