fetch('header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header_place').innerHTML = data);

fetch('nav.html')
    .then(response => response.text())
    .then(data => document.getElementById('nav_place').innerHTML = data);

// 用 document.getElementById() ，把 HTML 的區塊抓到 JS 變數中保存
const mainContainer = document.getElementById('mainContainer');
const authBlock = document.getElementById('authBlock');
const memberBlock = document.getElementById('memberBlock');

const viewLogin = document.getElementById('viewLogin');
const viewRegister = document.getElementById('viewRegister');
const viewProfile = document.getElementById('viewProfile');

const subViewInfo = document.getElementById('subViewInfo');
const subViewOrders = document.getElementById('subViewOrders');
const subViewReviews = document.getElementById('subViewReviews');

// 用來記錄目前使用者到底登入了沒，預設為 false (還沒登入)
let userIsLoggedIn = false;

// 點擊右上方頭像圖示 👤 ───
document.getElementById('navAvatar').addEventListener('click', function() {
    
    // 如果目前主畫面是隱藏的（none），點擊就讓它顯示（block）；反之如果本來就是打開的，就隱藏它。
    if (mainContainer.style.display === 'none') {
        mainContainer.style.display = 'block'; 
        
        // 打開後，再用一個 if...else 判斷目前使用者的狀態，決定顯示 登入註冊表單還是 會員中心
        if (userIsLoggedIn) {
            authBlock.style.display = 'none';
            memberBlock.style.display = 'block';
            changeSubView('info'); // 預設顯示個人資料
        } else {
            authBlock.style.display = 'block';
            // 【修改標記：修正原本寫成 style.none 的錯字，改為 display】
            memberBlock.style.display = 'none';
            showLoginTab(); // 預設顯示登入小畫面
        }
    } else {
        // 如果主畫面原本就是打開的，再點一次頭像就把它收回去（隱藏）
        mainContainer.style.display = 'none';
    }
});

// 會員登入分頁 
const btnTabLogin = document.getElementById('btnTabLogin');
const btnTabRegister = document.getElementById('btnTabRegister');

function showLoginTab() {
    // 利用 className 幫按鈕更換外觀
    btnTabLogin.className = 'tab-button active-tab';
    btnTabRegister.className = 'tab-button';
    
    // 顯示登入畫面，把註冊流程的第一步、第二步畫面全部藏起來
    viewLogin.style.display = 'block';
    viewRegister.style.display = 'none';
    viewProfile.style.display = 'none';
}

// 當點擊「會員登入」標籤時
btnTabLogin.addEventListener('click', showLoginTab);

// 當點擊「加入會員」標籤時
btnTabRegister.addEventListener('click', function() {
    btnTabRegister.className = 'tab-button active-tab';
    btnTabLogin.className = 'tab-button';
    // 顯示註冊第一步，隱藏登入畫面
    viewLogin.style.display = 'none';
    viewRegister.style.display = 'block';
    viewProfile.style.display = 'none';
});

// 註冊第一步：點擊「下一步」
document.getElementById('btnNextStep').addEventListener('click', function() {
    // 隱藏手機/密碼欄位，換成顯示姓名/生日欄位
    viewRegister.style.display = 'none';
    viewProfile.style.display = 'block';
});

// ─── 點擊「登入」按鈕送出 (模擬快速登入機制) ───
document.getElementById('btnLoginSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; // 將狀態改為已登入
    
    // 【修改標記：打包登入資料並放入 LocalStorage 中儲存，以便商品頁讀取】
    let loginUserData = {
        name: "測試會員",
        phone: "0912345678",
        dob: "1998 / 05 / 20",
        password: "******"
    };
    localStorage.setItem('loggedInUser', JSON.stringify(loginUserData));

    // 直接改寫預設展示資料
    document.getElementById('showName').innerText = loginUserData.name;
    document.getElementById('showPhone').innerText = loginUserData.phone;
    document.getElementById('showDob').innerText = loginUserData.dob;
    document.getElementById('showPassword').innerText = loginUserData.password;

    // 直接幫使用者換到會員中心畫面
    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
});

// 點擊完成註冊並送出
document.getElementById('btnRegisterSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; // 將狀態改為已登入

    // 【修改標記：打包註冊資料並放入 LocalStorage 中儲存，以便商品頁讀取】
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

    // 完成資料複製後，關閉表單，開啟會員中心
    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
});

// 會員中心內部：純文字的小分頁切換控制
const menuInfo = document.getElementById('menuInfo');
const menuOrders = document.getElementById('menuOrders');
const menuReviews = document.getElementById('menuReviews');

//點擊不同的會員中心選單時，動態切換畫面上顯示的內容
function changeSubView(target) {
    // 第一步：先把三個小畫面全部隱藏，避免畫面重疊
    subViewInfo.style.display = 'none';
    subViewOrders.style.display = 'none';
    subViewReviews.style.display = 'none';
    menuInfo.className = '';
    menuOrders.className = '';
    menuReviews.className = '';

    // 第二步：看點選的 target 是誰，就單獨把那個畫面改成 block (顯示)，並加上底線
    if (target === 'info') {
        subViewInfo.style.display = 'block';      // 顯示個人資料
        menuInfo.className = 'active-menu';       // 幫個人資料文字加底線
    } else if (target === 'orders') {
        subViewOrders.style.display = 'block';    // 顯示消費紀錄
        menuOrders.className = 'active-menu';     // 幫消費紀錄文字加底線
    } else if (target === 'reviews') {
        subViewReviews.style.display = 'block';   // 顯示評論記錄
        menuReviews.className = 'active-menu';    // 幫評論記錄文字加底線
    }
}

// 設定三個文字分頁標題，滑鼠點擊就會轉移到對應頁面
menuInfo.addEventListener('click', function() { changeSubView('info'); });
menuOrders.addEventListener('click', function() { changeSubView('orders'); });
menuReviews.addEventListener('click', function() { changeSubView('reviews'); });


// ==========================================================
//整合部分
// ==========================================================

// 接收「消費紀錄」的專用功能
//自動從置物櫃讀取組員傳過來的評論紀錄
// 網頁一載入完成，就會自動執行以下動作(currienr review新評論)
//localStorage置物櫃，資料存取的地方
window.addEventListener('DOMContentLoaded', function() {
    
    // 【修改標記：網頁重新載入時，自動從置物櫃撈出會員資料，保持登入狀態】
    let savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        userIsLoggedIn = true;
        let userObj = JSON.parse(savedUser);
        document.getElementById('showName').innerText = userObj.name;
        document.getElementById('showPhone').innerText = userObj.phone;
        document.getElementById('showDob').innerText = userObj.dob;
        document.getElementById('showPassword').innerText = userObj.password;
    }

    // 1. 去置物櫃檢查有沒有名為 'userReviews' 的東西
    let savedReviews = localStorage.getItem('userReviews');

    // 2. 如果置物櫃裡有東西
    if (savedReviews) {
        // 將資料從文字格式轉換回 JS 陣列
        let reviewsArray = JSON.parse(savedReviews);

        // 3. 用迴圈把每一筆評論都撈出來，並呼叫寫好的 addReviewData 功能
        //把點到的資料，塞進會員專區的評論紀錄
        reviewsArray.forEach(function(item) {
            addReviewData(item.productName, item.rating, item.comment);
        });
    }
});       

// 【修改標記：新增原本缺漏的 addReviewData 函式，用來動態生成評論 HTML 並塞到會員中心】
function addReviewData(productName, rating, comment) {
    const subViewReviews = document.getElementById('subViewReviews');
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