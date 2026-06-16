function carClick(){

    let name=document.querySelector("#name").value;
    let address=document.querySelector("#address").value;
    let phone=document.querySelector("#phone").value;
    let payment=document.querySelector("#payment").value;


    if(name=="" || address=="" || phone=="" || payment==""){

        alert("請填寫完整資料");

    }
    
    else{

        alert("已完成結帳！");

    }

}