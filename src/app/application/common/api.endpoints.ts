
export enum ApiBaseUrls {
    authbaseUrl = 'https://localhost:8000/',
    entitybaseUrl = 'http://localhost/entity-management/',
    rolebaseUrl = 'http://localhost/role-management/',
    userbaseUrl = 'https://localhost:7185/',
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
    GetAllRolesByEntity = 'api/Role/GetAllRolesByEntity',
    GetRoleById = 'api/Role/GetRoleById',
    SaveRole='api/Role/SaveRole',
    DeleteRole='api/Role/DeleteRole',
    GetAllPermissions='api/Permission/GetAllPermissions'
  }
  export enum UserModouleApiEndpoints {
    GetAllUsers = 'api/User/GetAllUsers',
    GetUserById = 'api/User/GetUserById',
    SaveUser='api/User/SaveUser',
    DeleteUser='api/User/DeleteUser'
  }
