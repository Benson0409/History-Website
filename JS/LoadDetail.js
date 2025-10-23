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
                detailPageTitle.textContent = `${theme}｜陳展內容`;
                timelineContent.innerHTML = '';

                themeData.forEach((entry, index) => {
                    const entryId = `entry-${theme}-${index}`;
                    const timelineEntryDiv = document.createElement('div');
                    timelineEntryDiv.className = 'timeline-entry fade-in';

                    let mainImagesHTML = '';
                    let officialDocsHTML = '';
                    const allCaptions = entry.image_caption || [];

                    // 1. 處理正文區圖片 (來自 image 陣列或單一字串)
                    let mainImages = [];
                    if (entry.image) {
                        if (Array.isArray(entry.image)) {
                            mainImages = entry.image;
                        } else {
                            mainImages.push(entry.image);
                        }
                    }

                    if (mainImages.length > 0) {
                        mainImagesHTML = mainImages.map((imgPath, i) => {
                            const captionText = allCaptions[i] || '';
                            const captionHTML = captionText ? `<p class="image-caption">${captionText}</p>` : '';
                            return `
                                <img src="${imgPath}" alt="校史圖像 ${entry.year}-${i+1}" class="main-image">
                                ${captionHTML}
                            `;
                        }).join('');
                    }

                    // 2. 處理補充區圖片 (來自 image2, image3... 欄位)
                    const officialDocs = [];
                    let imageKeyIndex = 2;
                    while (entry.hasOwnProperty(`image${imageKeyIndex}`)) {
                        officialDocs.push(entry[`image${imageKeyIndex}`]);
                        imageKeyIndex++;
                    }

                    if (officialDocs.length > 0) {
                        const docsImagesAndCaptions = officialDocs.map((docPath, i) => {
                            const captionIndex = mainImages.length + i;
                            const captionText = allCaptions[captionIndex] || '';
                            const captionHTML = captionText ? `<p class="image-caption">${captionText}</p>` : '';
                            return `
                                <div class="doc-item">
                                    <img src="${docPath}" alt="公文照片">
                                    ${captionHTML}
                                </div>
                            `;
                        }).join('');

                        officialDocsHTML = `
                            <div class="official-docs-toggle" onclick="toggleOfficialDocs('${entryId}-docs')">
                                <span class="docs-toggle-text">相關照片及公文查閱</span>
                                <span class="docs-toggle-icon">▼</span>
                            </div>
                            <div class="official-docs-content" id="${entryId}-docs">
                                ${docsImagesAndCaptions}
                            </div>
                        `;
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
                            ${mainImagesHTML}
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

// 最終修正後的 toggleDetail 函式 (無動畫版)
function toggleDetail(id) {
    const el = document.getElementById(id);
    const entry = el.closest(".timeline-entry");
    if (el && entry) {
      const willShow = !el.classList.contains("show");
      el.classList.toggle("show");
      entry.classList.toggle("active", willShow);
  
      if (willShow) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
}

// 最終修正後的 toggleOfficialDocs 函式 (無動畫版)
function toggleOfficialDocs(id) {
    const el = document.getElementById(id);
    const toggleButton = el.previousElementSibling;
    const toggleIcon = toggleButton.querySelector('.docs-toggle-icon');

    if (el && toggleIcon) {
        const isShowing = el.classList.contains('show');

        el.classList.toggle('show');
        toggleButton.classList.toggle('active', !isShowing);

        if (isShowing) {
            toggleIcon.textContent = '▼';
        } else {
            toggleIcon.textContent = '▲';
            toggleButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}