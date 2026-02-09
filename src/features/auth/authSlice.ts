import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';
import type { Profile } from '../../types/database';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean; // We'll handle this carefully
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed to false initially to prevent login screen flickering
  error: null,
};

// --- THE MESSENGERS (THUNKS) ---

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, fullName }: any, { rejectWithValue }) => {
    try {
      // Step A: Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed - no user returned");

      // Step B: Create Database Profile
      // We use .upsert() instead of .insert() to be safer against race conditions
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert([{ 
          id: authData.user.id, 
          email, 
          full_name: fullName, 
          role: 'user' 
        }])
        .select()
        .single();

      if (profileError) throw profileError;
      return profile;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return profile as Profile;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      supabase.auth.signOut();
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerUser.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; // Clear old errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;