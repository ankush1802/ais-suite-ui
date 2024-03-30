import { EntityService } from "./entity.service";

export interface Entity{
  id? : number;
  title?: string;
  uid? : string;
  parent_id? : number;
  subtitle?:string;
  description?:string;
  address?:string;
  city?:string;
  state?:string;
  country?:string;
  zipcode?:string;
  phone1?:string;
  phone2?:string;
  phone3?:string;
  email1?:string;
  email2?:string;
  email3?:string;
  website?:string;
  active?:boolean;
  createdBy?: number;
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
