function toggleReview(title) {
    const content = title.nextElementSibling;
    const arrow = title.querySelector(".arrow");

    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.innerHTML = ">";
    } else {
        content.style.display = "block";
        arrow.innerHTML = "˅";
    }
}


//新增評論
function addReview(){
    let star = document.querySelector('input[name="rating"]:checked');

    let comment = document.getElementById("comment").value;

    if(star == null || comment==""){
        alert("請完成評價");
        return;
    }


    // 新增：資料傳輸至置物櫃 LocalStorage
    // 1. 撈出網頁上的商品名稱
    // 檢查畫面上到底有沒有 id 叫 "productName" 的標籤：
    // -> 如果「有」，就抓取它裡面的 innerText (文字)；
    // -> 如果「沒有」，就自動用 "經典原木質感衣架(10入)" 當作預設商品名。
    let pName = document.getElementById("productName") ? document.getElementById("productName").innerText : "經典原木質感衣架(10入)";
    
    // 2. 打包要傳到的會員中心的reviewData(評論)
    // 把這一筆評論需要的所有資訊，集中包裝成一個方便傳輸的 JavaScript 物件。
    let reviewData = {
        productName: pName,
        rating: star.value, // 傳送使用者點選的星等數字 (1~5)
        comment: comment    // 傳送評論文字內容
    };

    // 3. 取出目前的舊評論陣列，如果沒東西，就給一個新陣列 []
    // LocalStorage 類似共享資料庫，用 getItem('userReviews') 去拿貼有這個標籤的箱子。
    // 資料庫只能存純文字，必須用 JSON.parse() 還原成 JavaScript 看得懂的「陣列 []」。
    let currentReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

    // 4. 把這筆新發表的評論資料塞進陣列中
    // 使用 push() 指令，把剛剛在第 2 步打包好資料 (reviewData)，塞進剛才拿出來的舊評論大陣列裡面。
    // #push() 會把新評論排在最後面
    currentReviews.push(reviewData);

    // 5. 重新裝箱放回資料庫
    // 所以在塞回去之前，必須用 JSON.stringify() 把整組陣列重新黏成「JSON 純文字字串」，
    // 最後用 setItem 塞回 'userReviews' 的櫃位裡，這樣才算大功告成！
    localStorage.setItem('userReviews', JSON.stringify(currentReviews));
    // ==========================================


    // 去 LocalStorage 檢查有沒有會員登入資料，有的話就抓名字，沒有才用預設名稱
    let savedUser = localStorage.getItem('loggedInUser');
    let name = "王小美"; // 預設名稱
    if (savedUser) {
        let userObj = JSON.parse(savedUser);
        name = userObj.name; // 成功拿到 membership.html 傳過來的會員姓名
    }

    let date = new Date().toLocaleDateString();
    
    // 改回點選幾星就秀幾顆星
    let number = Number(star.value);
    let review = document.createElement("div");

    review.className="review";

    review.innerHTML=`

        <div class="review-star">
            ${"★".repeat(number)}
        </div>

        <div class="review-info">

            <div class="review-name">
                ${name}
            </div>

            <div class="review-date">
                ${date}
            </div>

        </div>

        <p>
            ${comment}
        </p>

    `;

    document
    .getElementById("reviewList")
    .appendChild(review);

    document
    .getElementById("comment")
    .value="";
}


//數量鍵//
let num = 1;

function plus(){
    num++;
    document.getElementById("num").innerHTML=num;

}

function minus(){

    if(num > 1){
        num--;
    }
    document.getElementById("num").innerHTML=num;

}


function cartClick() {
    alert("已加入購物車！");

}

function buyClick() {
    alert("前往結帳頁面");
}

function initTopButton() {
    //回到頂部//
    const topBtn = document.getElementById("topBtn");

    // 顯示/隱藏
    window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 50 ? "block" : "none";
    });

    // 回到最上面
    topBtn.addEventListener("click", () => {
    window.scrollTo(0, 0);
    });
}

initTopButton();


//推薦商品//
let recIdx = 1;
let recAutoPlay;

function changeRecSlide(ctrl){
    showRecSlides(recIdx + ctrl);
}

function showRecSlides(idx){
    recIdx = idx;
    let slides =document.getElementsByClassName("rec-slide");

    let dots =document.getElementsByClassName("rec-dot");

    if(recIdx > slides.length){
        recIdx = 1;
    }else if(recIdx == 0){
        recIdx = slides.length;
    }

    for(let i=0;i<slides.length;i++){

        slides[i].className =slides[i].className.replace(" rec-show","");

        dots[i].className =dots[i].className.replace(" rec-active","");
    }

    slides[recIdx-1].className += " rec-show";

    dots[recIdx-1].className += " rec-active";

    setRecAutoPlay();
}

function setRecAutoPlay(){

    if(recAutoPlay != undefined)

        clearInterval(recAutoPlay);

    recAutoPlay = setInterval(function(){

        changeRecSlide(1);

    },2500);
}

showRecSlides(recIdx);