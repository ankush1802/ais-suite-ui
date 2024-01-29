
export enum ApiBaseUrls {
    authbaseUrl = 'https://localhost:8000/',
    entitybaseUrl = 'http://localhost/entity-management/',
    rolebaseUrl = 'http://localhost/role-management/',
  }

  export enum AuthModouleApiEndpoints {
    Auth = 'api/Auth/ValidateUser',
  }

  export enum EntityModouleApiEndpoints {
    GetAllEntities = 'api/Entity/GetAllEntities',
    GetEntityById = 'api/Entity/GetEntityById',
    GetEntityTree = 'api/Entity/GetEntityTree',
    SaveEntity='api/Entity/SaveEntity',
    DeleteEntities='api/Entity/DeleteEntities'
  }

  export enum RoleModouleApiEndpoints {
    GetAllRoles = 'api/Role/GetAllRoles',
    GetEntityById = 'api/Role/GetRoleById',
    SaveEntity='api/Role/SaveRole',
    DeleteEntities='api/Role/DeleteRole',
    GetAllPermissions='api/Permission/GetAllPermissions'
  }
