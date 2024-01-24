import { EntityService } from "./entity.service";

export interface Entity{
  id? : number;
  title?: string;
  uid? : string;
  parent_id? : number;
  sub_title?:string;
  description?:string;
  address?:string;
  city?:string;
  state?:string;
  country?:string;
  zipcode?:string;
  phone_1?:string;
  phone_2?:string;
  phone_3?:string;
  email_1?:string;
  email_2?:string;
  email_3?:string;
  website?:string;
  active?:boolean;
}
export interface IManageEntityDialogData {
  service: EntityService;
  entityId: number;
}


export interface EntityList {
    id?: string;
    title?: string;
    active?: boolean;
    publishby? : string;
    publishon? : string;
}
