let searchform=document.querySelector('.search-form');
document.querySelector('#search-btn').onclick = () =>{
    searchform.classList.toggle('active');
}
let loginform=document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () =>{
    loginform.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () => {
    loginform.classList.remove('active');
}

window.onscroll = () =>{
    searchform.classList.remove('active');
    if(window.scrollY>80){
        document.querySelector('.header,.header-2').classList.add('active');
    }
    else{
        document.querySelector('.header,.header-2').classList.remove('active');
    }
}

window.onload = () =>{
    if(window.scrollY>80){
        document.querySelector('.header,.header-2').classList.add('active');
    }
    else{
        document.querySelector('.header,.header-2').classList.remove('active');
    }
}

//cart open close
let cartIcon=document.querySelector('#cart-icon');
let cartform=document.querySelector('.cart');
let closeCart=document.querySelector("#close-cart");

document.querySelector('#cart-icon').onclick = () =>{
  cartform.classList.toggle('active');
}

document.querySelector('#close-cart').onclick = () => {
  cartform.classList.remove('active');
}

//Making add to cart
//cart Working JS
if(document.readyState == "loading"){
  document.addEventListener("DOMContentLoaded" , ready);
}
else{
  ready();
}

//Making Function
function ready(){
  //Remove item from cart
  var removeCartButtons=document.getElementsByClassName('cart-remove')
  for(var i=0;i<removeCartButtons.length;i++){
    var button = removeCartButtons[i];
     button.addEventListener("click", removeCartItem);
  }

  //Quantity change
  var quantityInputs=document.getElementsByClassName("cart-quantity");
  for(var i=0;i<quantityInputs.length;i++){
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  //Add to cart
  var addCart = document.getElementsByClassName("add-cart");
  for(var i=0;i< addCart.length;i++){
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }

 localCartItems();
}
//Remove cart item
function removeCartItem(event){
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updatetotal();
  saveCartItems();
  updateCartIcon ();
}

//Quantity Change
function quantityChanged(event){
  var input = event.target;
  if(isNaN(input.value) || input.value <=0){
    input.value=1;
  }
  updatetotal();
  saveCartItems();
  updateCartIcon ();
}

//Add cart function
function addCartClicked (event){
  var button = event.target;
  var shopProducts = button.parentElement;
  var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
 var price = shopProducts.getElementsByClassName('price')[0].innerText;
 
//  var price = shopProducts.getElementsByClassName('price')[0].innerText;
 
 
 addProductToCart(price,productImg);
 updatetotal();
 saveCartItems();
 updateCartIcon ();
}

function addProductToCart(price,productImg){
  var cartShopBox = document.createElement('div');
  cartShopBox.classList.add('cart-box');
  var cartItems = document.getElementsByClassName('cart-content')[0];
  var cartBoxContent= `<img src="${productImg}" alt="" class="cart-img"/>
  <div class="detail-box">
      <div class="cart-product-title">Product BOOK</div>
      <div class="cart-price">${price}</div>
      <input type="number" name="" id="" value="1" class="cart-quantity"/>
  </div>
  
  <div id="trash" class="fas fa-solid fa-trash cart-remove"></div>`;
  cartShopBox.innerHTML=cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
  .getElementsByClassName('cart-remove')[0]
  .addEventListener('click',removeCartItem);
  cartShopBox
  .getElementsByClassName('cart-quantity')[0]
  .addEventListener('change',quantityChanged)
  saveCartItems();
  updateCartIcon ();
}

//update price
function updatetotal(){
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total=0;
  for(var i=0;i<cartBoxes.length;i++){
    var cartBox= cartBoxes[i];
    var priceElement =cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$",""));
    var quantity = quantityElement.value;
    total+= price * quantity;
  }
  total = Math.round(total*100)/100;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
  // save total to local storage
  localStorage.setItem("cartTotal",total);
}

//keep Item in cart when page refersh with Local storage
function saveCartItems () {
  var cartContent = document.getElementsByClassName('cart-content')[0];
  var cartBoxes = cartContent.getElementsByClassName('cart-box');
  var cartItems  = [];
  for(var i=0;i<cartBoxes.length;i++){
    var cartBox=cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
      var priceElement = cartBox.getElementsByClassName('cart-price')[0];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      var productImg =cartBox.getElementsByClassName('cart-img')[0].src;
      var item = {
        title: titleElement.innerText,
        price:priceElement.innerText,
        quantity:quantityElement.value,
        productImg:productImg,
      };
      cartItems.push(item);
    }
    localStorage.setItem('cartItems' ,JSON.stringify(cartItems));
}
//load in cart
function localCartItems () {
  var cartItems = localStorage.getItem('cartItems');
  if(cartItems){
    cartItems = JSON.parse(cartItems);

    for(var i=0;i<cartItems.length;i++){
      var item = cartItems[i];
      addProductToCart(item.price,item.productImg);

      var cartBoxes = document.getElementsByClassName("cart-box");
      var cartBox = cartBoxes[cartBoxes.length -1];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      quantityElement.value = item.quantity;
    }
  }

  var cartTotal = localStorage.getItem('cartTotal');
  if(cartTotal){
    document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
 
  
  }
  updateCartIcon ();
}

//quantity in cart icon
function updateCartIcon () {
  var cartBoxes = document.getElementsByClassName('cart-box');
  var quantity =0;
  for(var i=0;i<cartBoxes.length;i++){
    var cartBox = cartBoxes[i];
    var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
    quantity +=parseInt(quantityElement.value);
  }

  var cartIcon =document.querySelector("#cart-icon");
  cartIcon.setAttribute("data-quantity",quantity);
}


//clear cart item after successful payment
function clearCart(){
  var cartContent = document.getElementsByClassName('cart-content')[0];
  cartContent.innerHTML="";
  updatetotal();
  localStorage.removeItem("cartItems");
}
var swiper = new Swiper(".books-slider", {
    loop:true,
    centeredSlides: true,
    auotplay: {
        delay:0,
        disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 2,
      },
    },
  });

  var swiper = new Swiper(".featured-slider", {
    spaceBetween: 10,
    loop:true,
    centeredSlides: true,
    auotplay: {
        delay:0,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      450: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });

  var swiper = new Swiper(".arrivals-slider", {
    spaceBetween: 10,
    loop:true,
    centeredSlides: true,
    auotplay: {
        delay:0,
        disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
     
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  var swiper = new Swiper(".arrival-slider", {
    spaceBetween: 10,
    loop:true,
    centeredSlides: true,
    auotplay: {
        delay:0,
        disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      450: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });


  