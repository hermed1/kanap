let itemsArray = JSON.parse(localStorage.getItem('elementAdded'));
//object avec id, quantity, color
//génère la page panier avec les infos du local storage
async function displayCart() {
  for (let i = 0; i < itemsArray.length; i++) {
    const reponse = await fetch(
      `http://localhost:3000/api/products/${itemsArray[i].id}`
    );
    const canap = await reponse.json();
    const content = `<article class="cart__item" data-id=${itemsArray[i].id} data-color= ${itemsArray[i].color}>
          <div class="cart__item__img">
            <img src=${canap.imageUrl} alt= ${canap.altTxt}>
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${canap.name}</h2>
              <p>${itemsArray[i].color}</p>
              <p>${canap.price}€</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemsArray[i].quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article> `;
    const parent = document.getElementById('cart__items');
    parent.innerHTML += content;
  }
  deleteItem();
  changeQuantity();
  totalArticles();
}

displayCart();
//supprimer un article et mettre à jour le local storage
function deleteItem() {
  const btnDelete = document.querySelectorAll('.deleteItem');
  for (let i = 0; i < btnDelete.length; i++) {
    const article = btnDelete[i].closest('article');
    btnDelete[i].addEventListener('click', () => {
      itemsArray = itemsArray.filter((item) => {
        return (
          item.id !== article.dataset.id && item.color !== article.dataset.color
        );
      });
      localStorage.setItem('elementAdded', JSON.stringify(itemsArray));
      document.getElementById('cart__items').removeChild(article);
      // document.location.reload();
      // reload ou recalcul de prix
      totalArticles();
      totalPrice();
    });
  }
}
//changer la quantité et mettre à jour le local storage
function changeQuantity() {
  const changeInput = document.querySelectorAll('.itemQuantity');
  for (let i = 0; i < changeInput.length; i++) {
    // let quantity = itemsArray[i].quantity;
    changeInput[i].addEventListener('change', () => {
      let newQuantity = parseInt(changeInput[i].value);
      // itemsArray[i].quantity = quantity + newQuantity;
      itemsArray[i].quantity = newQuantity;
      localStorage.setItem('elementAdded', JSON.stringify(itemsArray));
      console.log(itemsArray[i].quantity);
      totalArticles();
      totalPrice();
    });
  }
}
//calculer et afficher le nombre total d'articles du panier
async function totalArticles() {
  const cartQuantity = document.getElementById('totalQuantity');
  let totalQuantity = 0;
  for (let item of itemsArray) {
    totalQuantity += parseInt(item.quantity);
  }
  cartQuantity.innerText = totalQuantity;
  //se met à jour après actualisation
}
//calculer et afficher le prix total du panier
async function totalPrice() {
  const cartPrice = document.getElementById('totalPrice');
  let totalPrice = 0;

  for (let item of itemsArray) {
    const reponse = await fetch(
      `http://localhost:3000/api/products/${item.id}`
    );
    const canap = await reponse.json();
    totalPrice += canap.price * parseInt(item.quantity);
  }
  cartPrice.innerText = totalPrice;
}
totalPrice();
//vérifie la validité du nom
function nameIsValid(value) {
  return !/\d/.test(value);
}
//vérifie la validité de l'email

function emailIsValid(email) {
  return /^[^@]+@[^\.]+\.[^\.]+$/.test(email);
}

//constitution de l'objet contenant les infos de l'utilisateur
//constitution de l'objet contenant l'objet précédent et le tableau d'ID
//global scope ?
const orderObjet = {};
const orderArrayObject = {};
function getUserInfos() {
  const btnOrder = document.getElementById('order');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const address = document.getElementById('address');
  const city = document.getElementById('city');
  const email = document.getElementById('email');

  btnOrder.addEventListener('click', () => {
    if (nameIsValid(firstName.value)) {
      orderObjet.firstName = firstName.value;
    } else {
      alert("Mauvaise valeur, veuillez n'entrer que des lettres");
    }
    if (nameIsValid(lastName.value)) {
      orderObjet.lastName = lastName.value;
    } else {
      alert("Mauvaise valeur, veuillez n'entrer que des lettres");
    }
    if (emailIsValid(email.value)) {
      orderObjet.email = email.value;
    } else {
      alert('Erreur, veuillez entrer un email correct');
    }
    orderObjet.city = city.value;
    orderObjet.address = address.value;
    console.log(orderObjet);
    getProductsId();
    const orderArrayObject = { contact: orderObjet, products: orderArray };
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(orderArrayObject),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    orderPopUp();
  });
}
getUserInfos();

// envoi du tableau de produits au backend
//reste à faire l'envoi post à l'api
//constitution du tableau contenant les ID de tous les articles
const orderArray = [];
function getProductsId() {
  for (let item of itemsArray) {
    orderArray.push(item.id);
  }
}
getProductsId();

// const orderArrayObject = { contact: orderObjet, products: orderArray };
//mettre dans fonction au clic sur commander

// dans cette fonction, mettre sendBackend et getUser + fetch
// après requête réponse = succès ou échec. Si échec = catch, si succès traiter la commande
//récupérer string que la requête retourne. récupérer l'id

// 2 arguments, url et objet

// Effectuer une requête POST à l'API pour confirmer la commande
fetch('http://localhost:3000/api/products/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Données de la commande à envoyer à l'API
    orderArrayObject,
  }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Erreur lors de la confirmation de la commande');
      // nouvelle erreur récupérée ligne 205
    }
    return response.json();
  })
  .then((data) => {
    // Récupérer l'identifiant de commande dans la réponse
    const orderId = data.id;
    // data.id = réponse du serveur: doc spécs

    // Rediriger l'utilisateur vers la page de confirmation en passant l'identifiant de commande dans l'URL
    window.location.href = `http://localhost:3000/api/confirmation.html?orderId=${orderId}`;
    //définit nouvel href à location
    //p-e remettre le début de l'adresse: lcoalhost...
  })
  .catch((error) => {
    console.error(error);
  });

//message de confirmation de commande et affichage de l'ID
function orderPopUp() {
  alert(`Merci pour votre commande n° ${orderId}`);
}
