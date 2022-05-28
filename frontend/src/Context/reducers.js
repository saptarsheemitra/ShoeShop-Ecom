export const ADD_PRODUCT = "ADD_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const FETCH_PRODUCT = "FETCH_PRODUCT";
export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const INCREMENT_QUANT = "INCREMENT_QUANT";
export const DECREMENT_QUANT = "DECREMENT_QUANT";
export const REMOVE_ALL_CART = "REMOVE_ALL_CART";
export const FETCH_ADRESS = "FETCH_ADRESS";
export const SELECT_SIZE = "SELECT_SIZE";
export const REFRESH_CART = "REFRESH_CART";
export const GUEST_ADRESS = "GUEST_ADRESS";

////////////////////////////////
const addProduct = (dispatch, state) => {
  const newProduct = dispatch.product;
  const copyState = [...state.cart];
  const findIndex = copyState.findIndex((item) => item.id === newProduct.id);
  if (findIndex < 0) {
    copyState.push({
      ...newProduct,
      quantity: newProduct.quantity ? newProduct.quantity : 1,
    });
  } else {
    const update = { ...copyState[findIndex] };
    update.quantity = newProduct.quantity ? newProduct.quantity : 1;
    copyState[findIndex] = update;
  }

  localStorage.setItem("cart", JSON.stringify(copyState));

  return { ...state, cart: copyState };
}; //adds product to Cart
const removeProduct = (dispatch, state) => {
  const newProduct = dispatch.product;
  const copyState = [...state.cart];
  const findIndex = copyState.findIndex((item) => item.id === newProduct.id);

  copyState.splice(findIndex, 1);

  return { ...state, cart: copyState };
};

const fetchProduct = (dispatch, state) => {
  return { ...state, products: dispatch.product };
};

const userLogin = (dispatch, state) => {
  localStorage.setItem("UserToken", dispatch.token);

  return {
    ...state,
    token: dispatch.token,
    user: {
      name: dispatch.user.name,
      id: dispatch.user.id,
      adress: dispatch.user.adress,
    },
  };
};
const userLogout = (dispatch, state) => {
  localStorage.removeItem("UserToken");
  localStorage.removeItem("User");
  localStorage.removeItem("UserID");
  localStorage.removeItem("cart");

  if (window.location.pathname !== "/userprofile") {
    window.location.reload();
  }
  return {
    ...state,
    token: null,
    user: {
      name: null,
      id: null,
      adress: null,
    },
  };
};

const increment = (dispatch, state) => {
  const newProduct = dispatch.product;
  const copyState = [...state.cart];
  const findIndex = copyState.findIndex((item) => item.id === newProduct.id);

  const update = { ...copyState[findIndex] };
  update.quantity++;
  copyState[findIndex] = update;

  return { ...state, cart: copyState };
};
const decrement = (dispatch, state) => {
  const newProduct = dispatch.product;
  const copyState = [...state.cart];
  const findIndex = copyState.findIndex((item) => item.id === newProduct.id);

  const update = { ...copyState[findIndex] };
  if (update.quantity > 1) {
    update.quantity--;
  }

  copyState[findIndex] = update;

  return { ...state, cart: copyState };
};

const sizeSelect = (dispatch, state) => {
  const newProduct = dispatch.product;
  const copyState = [...state.cart];
  const findIndex = copyState.findIndex((item) => item.id === newProduct.id);

  const update = { ...copyState[findIndex] };

  update.selectedSize = newProduct.selectedSize ? newProduct.selectedSize : "";

  copyState[findIndex] = update;

  return { ...state, cart: copyState };
};

const clearCart = (dispatch, state) => {
  localStorage.removeItem("cart");
  return { ...state, cart: [] };
};
const adressUpdate = (dispatch, state) => {
  return { ...state, user: { ...state.user, adress: dispatch.adress } };
};

const cartRefresh = (dispatch, state) => {
  const cart = dispatch.cart;
  return { ...state, cart: cart ? cart : [] };
};

const guestAdress = (dispatch, state) => {
  return {
    ...state,
    token: null,
    user: {
      name: null,
      id: null,
      adress: dispatch.adress,
      guest: true,
    },
  };
};
//////////////////////
export const shopReducer = (state, action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      return addProduct(action, state);
    case REMOVE_PRODUCT:
      return removeProduct(action, state);
    case FETCH_PRODUCT:
      return fetchProduct(action, state);
    case USER_LOGIN:
      return userLogin(action, state);
    case USER_LOGOUT:
      return userLogout(action, state);
    case INCREMENT_QUANT:
      return increment(action, state);
    case DECREMENT_QUANT:
      return decrement(action, state);
    case REMOVE_ALL_CART:
      return clearCart(action, state);
    case FETCH_ADRESS:
      return adressUpdate(action, state);
    case SELECT_SIZE:
      return sizeSelect(action, state);
    case REFRESH_CART:
      return cartRefresh(action, state);
    case GUEST_ADRESS:
      return guestAdress(action, state);

    default:
      return state;
  }
};
