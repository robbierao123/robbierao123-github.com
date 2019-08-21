// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.clos-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const  cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


//CART

let cart = [];
//buttons

let buttonsDOM = [];
//getting the product

class Products{

   async getProducts(){
       try{
       let result = await fetch('products.json')
       let data = await result.json();
       let products = data.items;
       products = products.map(item =>{
 
        const {title,price} = item.fields;
        const {id} = item.sys
        const image = item.fields.image.fields.file.url;
        return{title,price,id,image}

       })
       return products;
    }catch(error){
        // console.log(error);

    }
}

}

//display product

class UI{

    displayProducts(products){
        // console.log(products)

        let result = "";
        products.forEach(product => {
            result +=
            `
            <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                 <button class="bag-btn" data-id=${product.id}>
                   <i class="fas fa-shopping-cart">add to cart</i>
                 </button>
            </div>
            <h3>${product.title}</h3>
            <h4>${product.price}</h4>
        </article>
            `
            
        });
      
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        // console.log(buttons);
        buttonsDOM = buttons;
buttons.forEach(button =>{
    let id = button.dataset.id;
    // console.log(id);
    let inCart = cart.find(item => item.id === id);
    if(inCart){
        button.innerText = "In Cart";
        button.disabled = true;
    }
        button.addEventListener('click',(event)=>{
            // console.log(event);
            event.target.innerText="In Cart";
            event.target.disabled = true;
            
            //
            //get product from products
            let TheCartItem = {...Storage.getProduct(id),amount:1};
            cart = [...cart,TheCartItem];

             console.log(cart);

             Storage.saveCart(cart);
             // add to DOM
             this.setCartValues(cart);
             this.addCartItem(TheCartItem );
             this.showCart();

        })
    
})
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
          tempTotal += item.price * item.amount;
          itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
   
         cartItems.innerText = itemsTotal;
      }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML =`
        <img src=${item.image} alt="product" />
        <!-- item info -->
        <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <!-- item functionality -->
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">
            ${item.amount}
          </p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
      <!-- cart item -->
`;
        cartContent.appendChild(div);
         console.log(cartContent);

    }
     showCart(){
         cartOverlay.classList.add('transparentBcg');
         cartDOM.classList.add('showCart');

     
     }
}

//local storage

class Storage{

    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));

    }

    static getProduct(id){
        let product = JSON.parse(localStorage.getItem('products'));
        return product.find(product => product.id === id)
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }

}

document.addEventListener("DOMContentLoaded",()=>{

    const ui = new UI();
    const products = new Products();

    //get all product
    products.getProducts().then(products =>{
         ui.displayProducts(products);

    Storage.saveProducts(products);
}).then(()=>{

    ui.getBagButtons();
});
});
