// Auto-generated types file

export interface Input1 { price:number; updatedAt:string; 'id': string; }

export type Input2 = {'user-id': string}&{ updatedAt:string; createdAt:string; } & { name:string; count:number; }

export interface Input3 { name:string; status:string; email:string; 'user-id': string; }

export interface Input4 { isActive:boolean; title:string; }

export interface Input5 { email:string; isActive:boolean; 'user-id': string; }

export interface Input6 { price:number; age:number; createdAt:string; }

export interface Input7 { email:string; name:string; 'user-id': string; 'category-id': string; }

export interface Input9 { title:string; email:string; 'user-id': string; }

export interface Input8 { status:string; createdAt:string; updatedAt:string; 'user-id': string; }

export type Input10 = {'user-id': string,'category-id': string}&{ updatedAt:string; createdAt:string; } & { isActive:boolean; count:number; }

export interface Input12 { email:string; count:number; age:number; 'user-id': string; 'vid': string; 'name': string; }

export type Input11 = {'uid': string}&{ updatedAt:string; name:string; title:string; } | { count:number; isActive:boolean; }

export interface Input13 { count:number; createdAt:string; 'pid': string; }

export interface Input14 { count:number; email:string; createdAt:string; 'user-id': string; 'category-id': string; 'pid': string; }

export type Input15 = {'id': string,'variant-id': string}&Omit<{ email:string; status:string; updatedAt:string; title:string; }, 'email'> & Partial<{ age:number; }>

export interface Input17 { email:string; title:string; price:number; 'user-id': string; 'vid': string; }

export interface Input16 { isActive:boolean; createdAt:string; 'post-id': string; 'name': string; }

export type Input18 = Omit<{ title:string; status:string; count:number; age:number; email:string; price:number; name:string; }, 'status'> & Partial<{ updatedAt:string; price:number; }>

export interface Input19 { price:number; updatedAt:string; 'user-id': string; 'category-id': string; }

export type Input20 = {'user-id': string,'category-id': string,'pid': string,'uid': string,'slug': string}&{ updatedAt:string; price:number; } | { email:string; count:number; }

export interface Input21 { isActive:boolean; updatedAt:string; 'user-id': string; 'pid': string; }

export type Input22 = {'user-id': string,'category-id': string,'pid': string}&Omit<{ age:number; count:number; updatedAt:string; status:string; isActive:boolean; }, 'status'> & Partial<{ title:string; }>

export interface Input23 { email:string; updatedAt:string; 'category-id': string; }

export type Input24 = Omit<{ price:number; email:string; count:number; createdAt:string; isActive:boolean; }, 'email'> & Partial<{ email:string; name:string; }>

export interface Input25 { title:string; price:number; 'user-id': string; }

