export interface UserEntity {
    id?: number;
    email?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    entityId: number;
    active?: boolean;
    description?: string;
    createdBy?: number;
    roles?: number[];
}
export interface UserList {
    id?: number;
    title?: string;
    entity?: string;
    publishby?: string;
    publishon?: string;
}
