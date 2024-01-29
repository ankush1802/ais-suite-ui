
export enum ApiBaseUrls {
    authbaseUrl = 'https://localhost:8000/',
    entitybaseUrl = 'http://localhost/entity-management/',
    rolebaseUrl = 'https://localhost:7216/',
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
    GetRoleById = 'api/Role/GetRoleById',
    SaveRole='api/Role/SaveRole',
    DeleteRole='api/Role/DeleteRole',
    GetAllPermissions='api/Permission/GetAllPermissions'
  }
