import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';
import type { Profile } from '../../types/database';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
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

      // Step B: Create Database Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user!.id, email, full_name: fullName, role: 'user' }])
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

// --- THE SLICE (THE BRAIN) ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      supabase.auth.signOut();
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Login

      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;