import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../lib/supabase";

// 1. Define what a Product looks like
interface Product {
  quantity: number;
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface ProductState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  isLoading: false,
  error: null,
};

// 2. Your Thunk (The Messenger)
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('products').select('*'); 
      if (error) throw error;
      return data as Product[]; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 3. The Slice (The Brain)
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {}, // We can add "deleteProduct" or "filterProducts" here later
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // Data from Supabase lands here
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;