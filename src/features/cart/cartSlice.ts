import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

// 1. Load data from LocalStorage on initialization
const savedCart = localStorage.getItem('cartItems');
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

const initialState: CartState = {
  items: initialItems,
  totalAmount: initialItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // UPDATED: Now accepts the specific quantity sent from Home page
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Add the new quantity to the existing quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      // Recalculate total and sync with localStorage
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    // NEW: Correctly placed outside of addToCart
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    }
  }
});



export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;