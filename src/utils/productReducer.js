import { PRODUCT_ACTIONS } from './constants';

// Initial state for product reducer
export const initialProductState = {
  products: [],
  loading: false,
  error: null,
  lastUpdated: null
};

// Product reducer function
export const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload || [],
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };

    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    default:
      return state;
  }
};

// Action creators for better type safety and reusability
export const productActions = {
  setLoading: (loading) => ({
    type: PRODUCT_ACTIONS.SET_LOADING,
    payload: loading
  }),

  setError: (error) => ({
    type: PRODUCT_ACTIONS.SET_ERROR,
    payload: error
  }),

  clearError: () => ({
    type: PRODUCT_ACTIONS.CLEAR_ERROR
  }),

  setProducts: (products) => ({
    type: PRODUCT_ACTIONS.SET_PRODUCTS,
    payload: products
  }),

  addProduct: (product) => ({
    type: PRODUCT_ACTIONS.ADD_PRODUCT,
    payload: product
  }),

  updateProduct: (product) => ({
    type: PRODUCT_ACTIONS.UPDATE_PRODUCT,
    payload: product
  }),

  deleteProduct: (productId) => ({
    type: PRODUCT_ACTIONS.DELETE_PRODUCT,
    payload: productId
  })
};