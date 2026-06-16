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

    // 模擬登入會員
    let name="王小美";
    let date = new Date().toLocaleDateString();
    let number = 6 - star.value;
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



/*已加入購物車*/

function cartClick(){

    let product = {

        name:document.getElementById("productName").innerText,

        price:Number(
            document
            .getElementById("productPrice")
            .innerText
            .replace(/[^0-9]/g,"")
        ),

        img:document.getElementById("productImg").src,

        num:num

    };


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.push(product);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


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