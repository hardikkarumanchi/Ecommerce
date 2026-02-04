export type UserRole = 'user' | 'admin'; 

export interface Profile {
    id: string; 
    email: string; 
    full_name?: string; 
    role: UserRole; 
}

export interface Product {
    id: string; 
    name: string; 
    description: string; 
    price: number; 
    image_url: string; 
    created_at?: string; 
}

export interface cartItem{
    product_id:string; 
    user_id: string; 
    quantity: number; 
    product: Product; 
}
