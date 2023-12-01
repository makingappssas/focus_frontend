export interface Tickets {
    category: string;
    id: number;
    user: {
        id?: number;
        type_user?: number;
        username: string;
    };
    name_pqrs: string;
    status:  string;
    status_noti?:boolean;
}
