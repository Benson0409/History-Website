document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme'); // 從 URL 獲取主題名稱

    const detailPageTitle = document.getElementById('detail-page-title');
    const timelineContent = document.getElementById('timeline-content');

    if (!theme) {
        detailPageTitle.textContent = "未指定主題";
        timelineContent.innerHTML = "<p style='text-align: center; margin-top: 2rem;'>請從首頁選擇一個主題來瀏覽。</p>";
        return;
    }

    // 載入 JSON 數據
    fetch('../Data/history_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const themeData = data[theme];

            if (themeData) {
                detailPageTitle.textContent = `${theme}｜主題詳細頁`; // 設定動態標題

                // 清空現有內容
                timelineContent.innerHTML = '';

                // 動態生成時間軸條目
                themeData.forEach((entry, index) => {
                    const entryId = `entry-${entry.year}-${index}`; // 為每個條目創建唯一ID
                    const timelineEntryDiv = document.createElement('div');
                    timelineEntryDiv.className = 'timeline-entry fade-in';

                    timelineEntryDiv.innerHTML = `
                        <div class="entry-toggle" onclick="toggleDetail('${entryId}')">
                            <div class="entry-header">
                                <span class="year-badge">${entry.year}</span>
                            </div>
                            <div class="entry-summary">
                                <h2>${entry.summary_title}</h2>
                                <p>${entry.summary_content}</p>
                            </div>
                        </div>
                        <div class="entry-detail" id="${entryId}">
                            <p>${entry.detail_content}</p>
                            <img src="${entry.image}" alt="校史圖像 ${entry.year}" style="width:100%;margin-top:1rem;border-radius:8px;">
                        </div>
                    `;
                    timelineContent.appendChild(timelineEntryDiv);
                });

                // 觸發滾動動畫（如果需要）
                // 這裡可以選擇性地在所有內容載入後觸發 fade-in 動畫
                // 如果你的 Detail.js 已經處理了滾動時的 fade-in，這裡可能不需要額外處理
                // document.querySelectorAll(".fade-in").forEach(el => {
                //   el.classList.add("visible");
                // });

            } else {
                detailPageTitle.textContent = "主題未找到";
                timelineContent.innerHTML = `<p style='text-align: center; margin-top: 2rem;'>抱歉，找不到「${theme}」主題的資料。</p>`;
            }
        })
        .catch(error => {
            console.error('載入歷史資料失敗:', error);
            detailPageTitle.textContent = "載入失敗";
            timelineContent.innerHTML = "<p style='text-align: center; margin-top: 2rem; color: red;'>載入歷史資料時發生錯誤，請稍後再試。</p>";
        });
});