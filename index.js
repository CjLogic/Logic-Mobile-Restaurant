import { menuArray } from "./data.js";

const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const modal = document.getElementById("modal");
const creditCardForm = document.getElementById("creditCardForm");
const backdrop = document.getElementById("backdrop");
const ratingMessage = document.getElementById("rating-message");
const star1 = document.getElementById("star1");
const star2 = document.getElementById("star2");
const star3 = document.getElementById("star3");
const star4 = document.getElementById("star4");
const star5 = document.getElementById("star5");

function displayRatingMessage() {
  ratingMessage.style.display = "none";
  const rating =
    [star1, star2, star3, star4, star5].findIndex((star) => star.checked) + 1;
  if (rating > 0) {
    const successMessage = document.createElement("p");
    successMessage.classList.add("success-message");
    if (successMessage) {
      successMessage.textContent = `Thanks for your ${rating}-star feedback!`;
    }
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
    menu.appendChild(successMessage);
  }
}
document
  .getElementById("rating")
  .addEventListener("click", displayRatingMessage);

const displayMenu = (menuItems) => {
  displayRatingMessage();
  return menuItems
    .map(
      ({ emoji, name, ingredients, price, id }) => `
            <div class="menu-item">
                <img src="/images/${emoji}" class="item-emoji">
                <div class="item-details">
                    <h2 class="item_name">${name}</h2>
                    <p class="item-ingredients">
                        ${ingredients.join(", ")}
                    </p>
                    <p class="item-price">$${price}</p>
                </div>
                <button class="add-item-btn" data-add="${id}">+</button>
            </div>
        `
    )
    .join("");
};

menu.innerHTML = displayMenu(menuArray);

let cartItems = [];

if (cartItems.length <= 0) {
  cart.classList.add("hidden");
}

const displayCart = (cartItems) => {
  if (cartItems.length > 0) {
    cart.classList.remove("hidden");
    return cartItems
      .map(
        ({ name, id, count, price }) => `
                    <div class="cart-line-item">
                        <h3 class="item_name">${name}</h3>
                        <button class="remove-item-btn" data-remove="${id}">remove</button>
                        <p class="cart-item-price">${count} X $${price} = $${
          count * price
        }</p>
                    </div>`
      )
      .join("");
  } else {
    cart.classList.add("hidden");
    return "";
  }
};

const addToCart = (itemId) => {
  const targetMenuObj = menuArray.find((item) => item.id === Number(itemId));
  const cartItem = cartItems.find((item) => item.id === Number(itemId));

  if (cartItem) {
    cartItem.count += 1;
  } else {
    cartItems.push({ ...targetMenuObj, count: 1 });
  }

  cart.classList.remove("hidden");
  document.getElementById("cart-items").innerHTML = displayCart(cartItems);
  document.getElementById("total_item_price").textContent = `$${cartItems
    .reduce(
      (totalPrice, currentItem) =>
        totalPrice + currentItem.count * currentItem.price,
      0
    )
    .toFixed(2)}`;
};

const removeFromCart = (itemId) => {
  const targetMenuObj = menuArray.find((item) => item.id === Number(itemId));
  const existingItem = cartItems.find((item) => item.id === targetMenuObj.id);

  if (existingItem) {
    if (existingItem.count === 1) {
      cartItems = cartItems.filter((item) => item.id !== targetMenuObj.id);
    } else {
      existingItem.count -= 1;
    }
    if (cartItems.length <= 0) {
      cart.classList.add("hidden");
    }
    document.getElementById("cart-items").innerHTML = displayCart(cartItems);
    document.getElementById("total_item_price").textContent = `$${cartItems
      .reduce(
        (totalPrice, currentItem) =>
          totalPrice + currentItem.count * currentItem.price,
        0
      )
      .toFixed(2)}`;
  }
};

creditCardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber");
  if (cardNumber.value.length < 12) {
    alert("Please enter a valid card number");
    return;
  }

  modal.style.display = "none";
  backdrop.style.display = "none";

  cartItems = [];
  cart.classList.add("hidden");

  const creditCardFormData = new FormData(creditCardForm);
  const name = creditCardFormData.get("name");
  const successMessage = document.createElement("p");
  successMessage.classList.add("success-message");
  successMessage.textContent = `Thanks, ${name}! Your order is on its way! 🛍️`;
  if (successMessage) {
    applyDiscountBtn.style.display = "inline";
    setTimeout(() => {
      successMessage.remove();
      setTimeout(() => {
        ratingMessage.style.display = "inline";
        setTimeout(() => {
          ratingMessage.remove();
        }, 8000);
      }, 3000);
    }, 3100);
    creditCardForm.reset();
  }

  menu.appendChild(successMessage);
});

document.addEventListener("click", (e) => {
  if (e.target === document.getElementById("applyDiscountBtn")) {
    const totalPrice = document
      .getElementById("total_item_price")
      .textContent.replace("$", "");
    let discountCode = document
      .getElementById("discountInput")
      .value.trim()
      .toLowerCase();
    if (discountCode === "discount") {
      const successMessage = document.createElement("p");
      successMessage.classList.add("success-message");
      successMessage.textContent = "Discount applied!";
      const newTotalPrice = (Number(totalPrice) * 0.95).toFixed(2);
      document.getElementById(
        "total_item_price"
      ).textContent = `$${newTotalPrice}`;
      if (successMessage) {
        applyDiscountBtn.style.display = "none";
        discountPopup.style.display = "none";
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }
      discountCode = true;
      document.getElementById("discountInput").value = "";
      menu.appendChild(successMessage);
    } else {
      // You can add an error message or alert here if the discount code is incorrect
      alert("Invalid discount code");
    }
  } else {
    if (e.target.dataset.add) {
      addToCart(e.target.dataset.add);
    }

    if (e.target.dataset.remove) {
      removeFromCart(e.target.dataset.remove);
    }

    if (e.target === document.getElementById("complete-order-btn")) {
      modal.style.display = "block";
      backdrop.style.display = "block";
    }

    if (
      e.target === document.getElementById("modal-close-btn") ||
      e.target === backdrop
    ) {
      modal.style.display = "none";
      backdrop.style.display = "none";
    }

    if (e.target === document.getElementById("discountPopup")) {
      discountPopup.style.display = "block";
      backdrop.style.display = "none";
    }

    if (e.target === document.getElementById("closebtn")) {
      discountPopup.style.display = "none";
      backdrop.style.display = "none";
    }
  }
});

setTimeout(function () {
  const discountPopup = document.getElementById("discountPopup");
  discountPopup.style.display = "inline";
  backdrop.style.display = "inline";
}, 3000);
