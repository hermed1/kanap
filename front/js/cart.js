let itemsArray = JSON.parse(localStorage.getItem('elementAdded'));
//object avec id, quantity, color
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
                <p>Qté : ${itemsArray[i].quantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="1">
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
}

displayCart();
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
    });
    console.log(itemsArray);
  }
}
