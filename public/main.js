//* URL Base.
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/"

//* Mostrar y ocultar carrito.
const cartToggle = document.querySelector('.cart__toggle');
const cartBlock = document.querySelector('.cart__block');

//* Dibujar productos en la web.
const productsList = document.querySelector('#products-container')

//* Carrito de Compras.
const cart = document.querySelector('#cart')
const cartList = document.querySelector('#cart__list')

//* Vaciar el carrito.
const emptyCartButton = document.querySelector('#empty__cart')

//? Necesito tener un array que reciba los elementos que debo introducir en el carrito de compras.

let cartProducts = [];

//* Modal.

const modalContainer = document.querySelector('#modal-container')
const modalElement = document.querySelector('#modal')
let modalDetails = [];

//* Lógica para mostrar y ocultar el carrito.
cartToggle.addEventListener('click', () => {
  cartBlock.classList.toggle("nav__cart__visible")
  //* Cuando NO tiene la clase nav__cart__visible, la agrega. Si se le da click nuevamente y detecta la clase, la retira.
})

//! Vamos a crear una función que contenga y que ejecute todos los listeners al inicio de la carga del código.
eventListenersLoader()

function eventListenersLoader(){
  //* Cuando se presione el botón "Add to cart".
  productsList.addEventListener('click', addProduct)

  //* Cuando se presione el botón "Delete".
  cart.addEventListener('click', deleteProduct)

  //* Cuando se presione el botón "Empty cart".
  emptyCartButton.addEventListener('click', emptyCart)

  //* Se ejecuta cuando se carga la página.
  document.addEventListener('DOMContentLoaded', () => {
    cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    cartElementsHTML()
  })

  //* Cuando se presione el botón "View Details".
  productsList.addEventListener('click', modalProduct)

  //* Cuando se dé click al botón para cerrar Modal.
  modalContainer.addEventListener('click', closeModal)
}

//* Función para obtener los datos desde la api.
function getProducts() {
  axios.get(baseUrl)
    .then(function (response){
      const products = response.data
      printProducts(products)
    })
    .catch(function(error) {
      console.log(error)
    })
}
getProducts()

//* Función para dibujar los productos en la página.
function printProducts(products){
  let html = '';
  for(let i = 0; i < products.length; i++){
    html +=`
    <div class='product__container'>
      <div class='product__container__img'>
        <img src="${products[i].image}" alt="image">
      </div>
      <div class='product__container__name'>
        <p>${products[i].name}</p>
      </div>
      <div class='product__container__price'>
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class="product__container__button">
        <button class="cart__button add__to__cart" id="add__to__cart" data-id="${products[i].id}">Add to cart</button>
        <button class="product__details" data-id="${products[i].id}">View Details</button>
      </div>
    </div>
    `
  }
  productsList.innerHTML = html
}

//* AGREGAR PRODUCTOS AL CARRITO.

//* 1. Capturar la información del producto al que se le dé click.
function addProduct(event){
  if(event.target.classList.contains('add__to__cart')){
    //.contains valida si el elemento existe dentro de la clase.
    const product = event.target.parentElement.parentElement
    // .parentElement nos ayuda a acceder al padre inmediatamente superior del elemento.
    console.log(product)
    cartProductsElements(product)
  }
}

//* 2. Debo transformar la información HMTL a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del carrito. Si existe, le debo sumar una unidad para que no se repita.
function cartProductsElements(product){
  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
    // textContent me permite pedir el texto que contiene el elemento.
    quantity: 1
  }

  //* Agregar un contador.
  //* Si dentro de cartProducts existe un ID igual al que tengo previamente alojado en infoProduct, entonces le sumo 1 a la cantidad.

    //.some, valida si existe algún elemento dentro del array que cumpla la condición.
    if(cartProducts.some(product => product.id === infoProduct.id)){
      // Si el producto al que le doy click en infoProduct ya existe en carProduct, entonces:
      const product = cartProducts.map(product => {
        // Como tengo un producto que ya existe dentro de cartProducts, entonces debo mapearlo y sumarle una unidad a la cantidad del elemento igual.
        if(product.id === infoProduct.id){
          product.quantity++;
          return product;
        } else {
          return product;
        }
      })
      cartProducts = [...product]
    } else {
      cartProducts = [...cartProducts, infoProduct]
    }
    console.log(cartProducts)
    cartElementsHTML()
}

//* 3. Debo imprimir, pintar, dibujar o mostrar en pantalla los productos dentro del carrito.
function cartElementsHTML(){

  //! Como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el contenedor cartList con innerHTML vacío. Esto borra todo lo que peuda estar repetido y vuelve a iterar los elementos actualizados en el array cartProducts.
  cartList.innerHTML = "",
  
  cartProducts.forEach(product => {
    const div = document.createElement('div');
    // .createElement, permite crear etiquetas desde el DOM.
    div.innerHTML = `
      <div class="cart__product">
        <div class="cart__product__image">
          <img src="${product.image}">
        </div>
        <div class="cart__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="cart__product__button">
          <button class="delete__product" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>  
    `;
    cartList.appendChild(div)
  })
  productsStorage()
}

//* LocalStorage.
function productsStorage(){
  localStorage.setItem('cart', JSON.stringify(cartProducts))
}

//* Eliminar productos del carrito.
function deleteProduct(event){
  if(event.target.classList.contains('delete__product')){
    const productId = event.target.getAttribute('data-id')
    cartProducts = cartProducts.filter(product => product.id !== productId)
    cartElementsHTML()
  }
}

//* Vaciar el carrito completo.
function emptyCart() {
  cartProducts = [];
  cartElementsHTML()
}

//* Ventana Modal.
function modalProduct(event){
  if(event.target.classList.contains('product__details')){
    modalContainer.classList.add('show__modal')
    const product = event.target.parentElement.parentElement
    modalDetailsElement(product)
  }
}

function closeModal(event){
  if(event.target.classList.contains('icon__modal')){
    modalContainer.classList.remove('show__modal')
    modalElement.innerHTML = "";
    modalDetails = []
  }
}

function modalDetailsElement(product){
  const infoDetails = [{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
  }]
  modalDetails = [...infoDetails]
  modalHTML();
}

function modalHTML() {
  let modalDetailsHTML = "";
  for(let element of modalDetails){
    modalDetailsHTML = `
      <div class="principal__element">
        <div class="first__modal__section">
          <div class="first__modal__text">
            <p>${element.name}</p>
            <p>${element.price}</p>
          </div>
          <div class="first__modal__colors">
            <p>Colores</p>
            <div>
              <img src="${element.image}">
            </div>
          </div>
          <div class="first__modal__sizes__text">
            <div>
              <p>Tallas</p>
            </div>
          </div>
          <div class="first__modal__sizes">
            <div>
              <p>S</p>
            </div>
            <div>
              <p>M</p>
            </div>
            <div>
              <p>L</p>
            </div>
            <div>
              <p>XL</p>
            </div>
            <div>
              <p>2XL</p>
            </div>
          </div>
        </div>
        <div class="second__modal__section">
          <div class="modal__vector">
          <img src="${element.image}">
          </div>
        </div>
      </div>
    `;
  }
  modalElement.innerHTML = modalDetailsHTML;
}

//* Local Storage.

// Guardar información el local storage.
// localStorage.setItem("apellido", "Aranda")

// // console.log(localStorage.getItem("apellido"))

// const usuario = {
//   name: 'Aaron',
//   age: 25
// }
// localStorage.setItem('usuario', JSON.stringify(usuario))

// const usuarioLocal = localStorage.getItem('usuario')
// console.log(JSON.parse(usuarioLocal))