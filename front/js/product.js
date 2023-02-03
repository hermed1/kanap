// const storage = localStorage.getItem("elementAdded");
// //
// //regarder si clé existe, si oui, stocker sa valeur, si non, définir tableau vide
// // vérifions si la valeur de la clé est vide,

const str = window.location.href;
const url = new URL(str);
const id = url.searchParams.get('id');
async function displayProduct() {
  const reponse = await fetch(`http://localhost:3000/api/products/${id}`);
  const canap = await reponse.json();
  const content = `
    <article>
      <div class="item__img">
        <img src= ${canap.imageUrl} alt= ${canap.altTxt}>
      </div>
      <div class="item__content">

        <div class="item__content__titlePrice">
          <h1 id="title">${canap.name}</h1>
          <p>Prix : <span id="price">${canap.price}</span>€</p>
        </div>

        <div class="item__content__description">
          <p class="item__content__description__title">Description :</p>
          <p id="description">${canap.description}</p>
        </div>

        <div class="item__content__settings">
          <div class="item__content__settings__color">
            <label for="color-select">Choisir une couleur :</label>
            <select name="color-select" id="colors">
             <option value="">--SVP, choisissez une couleur --</option>

            </select>
          </div>

          <div class="item__content__settings__quantity">
            <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
            <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
          </div>
        </div>

        <div class="item__content__addButton">
          <button id="addToCart">Ajouter au panier</button>
        </div>

      </div>
    </article>
`;
  const section = document.querySelector('.item');
  section.innerHTML = content;
  for (let i = 0; i < canap.colors.length; i++) {
    const parent = document.getElementById('colors');
    const option = document.createElement('option');
    option.innerText = canap.colors[i];
    option.value = canap.colors[i];
    parent.appendChild(option);
  }

  const btnAdd = document.getElementById('addToCart');
  btnAdd.addEventListener('click', fillStorage);
}

displayProduct();

// const storage = localStorage.getItem("elementAdded");
// if(typeof storage === "undefined"){
//   let itemsArray = [];
// } else itemsArray.push(item);
// function fillStorage(){

//   const quantity = document.getElementById("quantity").value;
//   const color = document.getElementById("colors").value;
//   const item = {id:id, quantity: quantity, color: color};
//   const storage = localStorage.getItem("elementAdded");
//   for(let i = 0; i < itemsArray.length; i++){
//   if(item.id === itemsArray[i].id && item.color === itemsArray[i].color){
//         itemsArray[i].quantity += 1;
//   } else{
//     itemsArray.push(item);
//   }
//     }
//   localStorage.setItem("elementAdded", JSON.stringify(itemsArray));
// }

let itemsArray = [];
const storage = localStorage.getItem('elementAdded');
if (storage) {
  itemsArray = JSON.parse(storage);
}
function fillStorage() {
  const quantity = parseInt(document.getElementById('quantity').value);
  const color = document.getElementById('colors').value;
  const item = { id: id, quantity: quantity, color: color };

  let itemExists = false;
  for (let i = 0; i < itemsArray.length; i++) {
    if (item.id === itemsArray[i].id && item.color === itemsArray[i].color) {
      itemsArray[i].quantity += quantity;
      itemExists = true;
      break;
    }
  }
  if (!itemExists) {
    itemsArray.push(item);
  }
  localStorage.setItem('elementAdded', JSON.stringify(itemsArray));
}

//regarder si clé existe, si oui, stocker sa valeur, si non, définir tableau vide
// vérifions si la valeur de la clé est vide,
