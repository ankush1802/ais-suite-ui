export interface Role{
    id? : number;
    title?: string;
    description?:string;
    entityId : number;
  }

  export interface RolesList {
    id?: string;
    title?: string;
    publishby? : string;
    publishon? : string;
}

export interface PermissionGroup{
    groupid?: number;
    grouptitle?: string;
    permissions?:Permission[];
}
export interface Permission{
    permissionid? : number;
    permissiontitle?: string;
    permissionvalue?: boolean;
}
