document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    const detailPageTitle = document.getElementById('detail-page-title');
    const timelineContent = document.getElementById('timeline-content');

    if (!theme) {
        detailPageTitle.textContent = "未指定主題";
        timelineContent.innerHTML = "<p style='text-align: center; margin-top: 2rem;'>請從首頁選擇一個主題來瀏覽。</p>";
        return;
    }

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
                detailPageTitle.textContent = `${theme}｜主題詳細頁`;
                timelineContent.innerHTML = '';

                themeData.forEach((entry, index) => {
                    const entryId = `entry-${theme}-${index}`;
                    const timelineEntryDiv = document.createElement('div');
                    timelineEntryDiv.className = 'timeline-entry fade-in';

                    let mainImageHTML = '';
                    let officialDocsHTML = '';
                    const allImages = [];

                    // 將所有 image 相關欄位（image, image2, image3...）都收集起來
                    let imageKeyIndex = 1;
                    while (entry.hasOwnProperty(`image${imageKeyIndex > 1 ? imageKeyIndex : ''}`)) {
                        allImages.push(entry[`image${imageKeyIndex > 1 ? imageKeyIndex : ''}`]);
                        imageKeyIndex++;
                    }

                    if (allImages.length > 0) {
                        mainImageHTML = `<img src="${allImages[0]}" alt="校史圖像 ${entry.year}" class="main-image">`;

                        // 如果有額外的照片（image2, image3...），則建立公文區塊
                        if (allImages.length > 1) {
                            const docsImages = allImages.slice(1).map(docPath =>
                                `<img src="${docPath}" alt="公文照片">`
                            ).join('');

                            officialDocsHTML = `
                                <div class="official-docs-toggle" onclick="toggleOfficialDocs('${entryId}-docs')">
                                    <span class="docs-toggle-text">相關公文查閱</span>
                                    <span class="docs-toggle-icon">▼</span>
                                </div>
                                <div class="official-docs-content" id="${entryId}-docs">
                                    ${docsImages}
                                </div>
                            `;
                        }
                    }

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
                            ${mainImageHTML}
                            ${officialDocsHTML}
                        </div>
                    `;
                    timelineContent.appendChild(timelineEntryDiv);
                });
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

function toggleOfficialDocs(id) {
    const el = document.getElementById(id);
    const toggleIcon = el.previousElementSibling.querySelector('.docs-toggle-icon');
    if (el && toggleIcon) {
        const willShow = !el.classList.contains('show');
        el.classList.toggle('show');

        // 檢查是否是展開
        if (willShow) {
            toggleIcon.textContent = '▲';
            // 延遲滾動，讓動畫有時間完成
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500); // 這裡的延遲時間與 CSS 過渡時間一致
        } else {
            toggleIcon.textContent = '▼';
        }
    }
}