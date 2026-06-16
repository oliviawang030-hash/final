// 新增評論
function addReview(){
    let star = document.querySelector('input[name="rating"]:checked');
    let comment = document.getElementById("comment").value;

    if(star == null || comment==""){
        alert("請完成評價");
        return;
    }

    // 檢查是否有會員登入
    let savedUser = localStorage.getItem('loggedInUser');
    if (!savedUser) {
        alert("請先登入會員才能發表評論！");
        return;
    }
    let userObj = JSON.parse(savedUser);

    // 1. 撈出網頁上的商品名稱
    let pName = document.getElementById("productName") ? document.getElementById("productName").innerText : "經典原木質感衣架(10入)";
    
    //這裡我們強制確保 star.value 為數字
    let starValue = Number(star.value);
    
    // 2. 打包要傳到的會員中心的reviewData(評論)
    let reviewData = {
        productName: pName,
        rating: starValue, 
        comment: comment
    };

    // 3. 用目前登入會員專屬的電話號碼當作 Key 名稱
    let reviewKey = 'userReviews_' + userObj.phone;
    let currentReviews = JSON.parse(localStorage.getItem(reviewKey)) || [];
    currentReviews.push(reviewData);
    localStorage.setItem(reviewKey, JSON.stringify(currentReviews));

    // 4. 網頁畫面上即時顯示
    let name = userObj.name || "王小美"; 
    let date = new Date().toLocaleDateString();
    
    //使用 starValue 繪製
    let review = document.createElement("div");
    review.className="review";
    review.innerHTML=`
        <div class="review-star">
            ${"★".repeat(starValue)}
        </div>
        <div class="review-info">
            <div class="review-name">${name}</div>
            <div class="review-date">${date}</div>
        </div>
        <p>${comment}</p>
    `;

    document.getElementById("reviewList").appendChild(review);
    document.getElementById("comment").value="";
}