//* URL Base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/"
//* Mostrar y ocultar carrito.
const carToggle = document.querySelector('.car__toggle');
const carBlock = document.querySelector('.car__block');
//* Dibujar productos en la web.
const productsList = document.querySelector('#products-container')
//* Carrito de Compras
const car = document.querySelector('#car')
const carList = document.querySelector('#car__list')
//*Vaciar el carrito
const emptyCarButton = document.querySelector('#empty__cart')
//? Necesito tener un array que reciba los elementos que debo introducir en el carrito de compras
let carProducts = []

//* Lógica para mostrar y ocultar el carrito.
carToggle.addEventListener('click', () => {
  carBlock.classList.toggle("nav__car__visible")
  //* Cuando NO tiene la clase nav__car__visible, la agrega. Si se le da click nuevamente y detecta la clase, la retira.
})

//! Vamos a crear una función que contenga y que ejecute todos los listeners al inico de la carga del código.
eventListenersLoader()

function eventListenersLoader(){
  //* Cuando se presione el botón "Add to car"
  productsList.addEventListener('click', addProduct)

  //* Cuando se presione el botón "Delete"
  car.addEventListener('click', deleteProduct)

  //* Cuando se presione el botón "Empty cart"
  emptyCarButton.addEventListener('click', emptyCar)

  //* Se ejecuta cuando se carga la página
  document.addEventListener('DOMContentLoaded', () => {
    carProducts = JSON.parse(localStorage.getItem('cart')) || [];
    carElementsHTML()
  })
}

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
        <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to cart</button>
        <button class="product__details">View Details</button>
      </div>
    </div>
    `
  }
  productsList.innerHTML = html
}

//* Agregar productos al carrito.

//* 1. Capturar la información del producto al que se le dé click.
function addProduct(event){
  if(event.target.classList.contains('add__to__car')){
    //.contains valida si el elemtno existe dentro de la clase.
    const product = event.target.parentElement.parentElement
    //parentElement nos ayuda a acceder al padre inmediatamente superior del elemento.
    console.log(product)
    carProductsElements(product)
  }
}

//* 2. Debo transformar la información HMTL a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del carrito. Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product){
  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
    // textContent me permite pedir el texto que contiene el elemento
    quantity: 1
  }

  //* Agregar un contador
  //* Si dentro de carProducts existe un ID igual al que tengo previamente alojado en infoProduct, entonces le sumo 1 a la cantidad.

    //.some, valida si existe algún elemento dentro del array que cumpla la condición.
    if(carProducts.some(product => product.id === infoProduct.id)){
      // Si el producto al que le doy click en infoProduct ya existe en carProduct, entonces:
      const product = carProducts.map(product => {
        //Como tengo un producto que ya existe dentro de carProducts, entonces debo mapearlo y sumarle una unidad a la cantidad del elemento igual.
        if(product.id === infoProduct.id){
          product.quantity++;
          return product;
        } else {
          return product;
        }
      })
      carProducts = [...product]
    } else {
      carProducts = [...carProducts, infoProduct]
    }
    console.log(carProducts)
    carElementsHTML()
}
//* 3. Debo imprimir, pintar, dibujar o mostrar en pantalla los productos dentro del carrito.

function carElementsHTML(){

  //! Como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el contenedor carList con innerHTML vacío. Esto borra todo lo que peuda estar repetido y vuelve a iterar los elementos actualizados en el array carProducts
  carList.innerHTML = "",
  
  carProducts.forEach(product => {
    const div = document.createElement('div');
    //createElement, permite crear etiquetas desde el DOM
    div.innerHTML = `
      <div class="car__product">
        <div class="car__product__image">
          <img src="${product.image}">
        </div>
        <div class="car__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="car__product__button">
          <button class="delete__product" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>  
    `;
    carList.appendChild(div)
  })
  productsStorage()
}
//* LocalStorage
function productsStorage(){
  localStorage.setItem('cart', JSON.stringify(carProducts))
}

//* Eliminar productos del carrito
function deleteProduct(event){
  if(event.target.classList.contains('delete__product')){
    const productId = event.target.getAttribute('data-id')
    carProducts = carProducts.filter(product => product.id !== productId)
    carElementsHTML()
  }
}
//* Vaciar el carrito completo
function emptyCar() {
  carProducts = [];
  carElementsHTML()
}

//* Ventana Modal



//* Local Storage

// Guardar información el local storage
// localStorage.setItem("apellido", "Aranda")

// // console.log(localStorage.getItem("apellido"))

// const usuario = {
//   name: 'Aaron',
//   age: 25
// }
// localStorage.setItem('usuario', JSON.stringify(usuario))

// const usuarioLocal = localStorage.getItem('usuario')
// console.log(JSON.parse(usuarioLocal))