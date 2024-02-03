export interface UserEntity {
    id?: number;
    email?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    entityId : number;
    active?: string;
    publishby? : string;
    publishon? : string;
}
export interface UserList{
    id? : number;
    title?: string;
    description?:string;
    entity?: string;
   // permissions?:Permission[];
    createdBy? : number;
  }
