// 抓取 HTML 區塊節點
const mainContainer = document.getElementById('mainContainer');
const authBlock = document.getElementById('authBlock');
const memberBlock = document.getElementById('memberBlock');

const viewLogin = document.getElementById('viewLogin');
const viewRegister = document.getElementById('viewRegister');
const viewProfile = document.getElementById('viewProfile');

const subViewInfo = document.getElementById('subViewInfo');
const subViewOrders = document.getElementById('subViewOrders');
const subViewReviews = document.getElementById('subViewReviews');

let userIsLoggedIn = false;

// 登入 / 註冊頁籤切換
const btnTabLogin = document.getElementById('btnTabLogin');
const btnTabRegister = document.getElementById('btnTabRegister');

function showLoginTab() {
    btnTabLogin.className = 'tab-button active-tab';
    btnTabRegister.className = 'tab-button';
    viewLogin.style.display = 'block';
    viewRegister.style.display = 'none';
    viewProfile.style.display = 'none';
}

btnTabLogin.addEventListener('click', showLoginTab);

btnTabRegister.addEventListener('click', function() {
    btnTabRegister.className = 'tab-button active-tab';
    btnTabLogin.className = 'tab-button';
    viewLogin.style.display = 'none';
    viewRegister.style.display = 'block';
    viewProfile.style.display = 'none';
});

// 註冊第一步點擊「下一步」
document.getElementById('btnNextStep').addEventListener('click', function() {
    viewRegister.style.display = 'none';
    viewProfile.style.display = 'block';
});

// ─── 點擊「登入」按鈕 ───
document.getElementById('btnLoginSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; 
    
    let loginUserData = {
        name: "測試會員",
        phone: document.getElementById('inputLogPhone').value || "0912345678",
        dob: "1998 / 05 / 20",
        password: "******"
    };
    localStorage.setItem('loggedInUser', JSON.stringify(loginUserData));

    // 更新個人資料畫面
    document.getElementById('showName').innerText = loginUserData.name;
    document.getElementById('showPhone').innerText = loginUserData.phone;
    document.getElementById('showDob').innerText = loginUserData.dob;
    document.getElementById('showPassword').innerText = loginUserData.password;

    // 切換至會員中心介面
    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
    
    // 撈取評論資料
    loadReviewsFromStorage();
});

// ─── 點擊「完成註冊並送出」按鈕 ───
document.getElementById('btnRegisterSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; 

    let regUserData = {
        phone: document.getElementById('inputRegPhone').value || "未填寫",
        password: document.getElementById('inputRegPassword').value || "未設定",
        name: document.getElementById('inputRegName').value || "未填寫",
        dob: document.getElementById('inputRegDob').value || "未填寫"
    };
    localStorage.setItem('loggedInUser', JSON.stringify(regUserData));

    document.getElementById('showPhone').innerText = regUserData.phone;
    document.getElementById('showPassword').innerText = regUserData.password;
    document.getElementById('showName').innerText = regUserData.name;
    document.getElementById('showDob').innerText = regUserData.dob;

    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
    
    loadReviewsFromStorage();
});

// ─── 點擊「登出帳號」按鈕 ───
document.getElementById('btnLogout').addEventListener('click', function() {
    forceLogoutReset();
});

// 會員中心小選單分頁控制
const menuInfo = document.getElementById('menuInfo');
const menuOrders = document.getElementById('menuOrders');
const menuReviews = document.getElementById('menuReviews');

function changeSubView(target) {
    subViewInfo.style.display = 'none';
    subViewOrders.style.display = 'none';
    subViewReviews.style.display = 'none';
    menuInfo.className = '';
    menuOrders.className = '';
    menuReviews.className = '';

    if (target === 'info') {
        subViewInfo.style.display = 'block';      
        menuInfo.className = 'active-menu';       
    } else if (target === 'orders') {
        subViewOrders.style.display = 'block';    
        menuOrders.className = 'active-menu';     
    } else if (target === 'reviews') {
        subViewReviews.style.display = 'block';   
        menuReviews.className = 'active-menu';    
    }
}

menuInfo.addEventListener('click', function() { changeSubView('info'); });
menuOrders.addEventListener('click', function() { changeSubView('orders'); });
menuReviews.addEventListener('click', function() { changeSubView('reviews'); });


// ==========================================================
// 整合優化：初始化重製與評論撈取（防重複）
// ==========================================================

// ─── 新增：點擊導覽列頭像開關會員區 ───
// 使用事件代理，點擊 document 時尋找是否有 #navAvatar，確保 fetch 進來的 HTML 也能被點擊
document.addEventListener('click', function(e) {
    const avatarBtn = e.target.closest('#navAvatar');
    if (avatarBtn) {
        e.preventDefault(); // 阻止 <a> 標籤在 membership 頁面重複跳轉重新整理
        
        // 切換主容器顯示/隱藏
        if (mainContainer.style.display === 'none') {
            mainContainer.style.display = 'block';
        } else {
            mainContainer.style.display = 'none';
        }
    }
});

// 網頁一載入，強制執行登出重製（如要求所述：每次開啟皆為原始狀態）
window.addEventListener('DOMContentLoaded', function() {
    forceLogoutReset();
});      

// 執行強制登出並還原最原始畫面
function forceLogoutReset() {
    localStorage.removeItem('loggedInUser'); // 移除登入狀態紀錄
    userIsLoggedIn = false;                  
    
    // 文字還原
    document.getElementById('showName').innerText = "未填寫";
    document.getElementById('showPhone').innerText = "未填寫";
    document.getElementById('showDob').innerText = "未填寫";
    document.getElementById('showPassword').innerText = "未填寫";
    
    // 清空輸入框
    document.getElementById('inputLogPhone').value = "";
    document.getElementById('inputLogPassword').value = "";
    
    // 徹底清空舊評論，防範任何疊加情況
    subViewReviews.innerHTML = "";

    // 介面回歸
    authBlock.style.display = 'block';
    memberBlock.style.display = 'none';
    showLoginTab(); 
}

// 讀取 LocalStorage 中的評論紀錄
function loadReviewsFromStorage() {
    // 【關鍵機制】：重新繪製前清空黑板，這是解決重複出現評論的最核心代碼
    subViewReviews.innerHTML = "";

    let savedReviews = localStorage.getItem('userReviews');

    if (savedReviews) {
        let reviewsArray = JSON.parse(savedReviews);
        // 循環遍歷陣列資料
        reviewsArray.forEach(function(item) {
            addReviewData(item.productName, item.rating, item.comment);
        });
    } else {
        subViewReviews.innerHTML = '<div class="info-item">暫無評論紀錄</div>';
    }
}

// 將單筆評論資料格式化為 HTML 元素並推入頁面
function addReviewData(productName, rating, comment) {
    let reviewItem = document.createElement("div");
    reviewItem.className = "info-item";
    reviewItem.style.borderBottom = "1px solid #A9B4C2";
    reviewItem.style.paddingBottom = "10px";
    reviewItem.style.marginTop = "10px";
   
    let starString = "★".repeat(Number(rating)) + "☆".repeat(5 - Number(rating));
   
    reviewItem.innerHTML = `
        <div><strong>商品名稱：</strong> ${productName}</div>
        <div><strong>評價星等：</strong> <span style="color: #7D98A1;">${starString}</span></div>
        <div><strong>評論內容：</strong> ${comment}</div>
    `;
    subViewReviews.appendChild(reviewItem);
}