import {createClient} from '@supabase/supabase-js'

const VITE_SUPABASE_URL = 'https://vdkeoxvmapiogxstcaka.supabase.co' ; 
const VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2VveHZtYXBpb2d4c3RjYWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDY4NDgsImV4cCI6MjA4NTY4Mjg0OH0.Xsu-MmiJBSgOsWY1K24JoMRG1vgA0ectYBIJVXpb5HM'; 

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY); 

export default supabase; 


