export interface  User{
    id : number | null;
    name : string;
    password : string;
    email : string;
    created_at: String;
    created_by: string;
    updated_at: String;
    updated_by: string;
    deleted: boolean;
}