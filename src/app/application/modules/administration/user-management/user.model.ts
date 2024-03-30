export interface UserEntity {
    id?: number;
    email?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    entityId: number;
    active?: string;
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
