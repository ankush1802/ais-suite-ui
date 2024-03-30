
export enum ApiBaseUrls {
    authbaseUrl = 'https://localhost:8000/',
    entitybaseUrl = 'https://localhost:7185/',
    rolebaseUrl = 'https://localhost:7216/',
    userbaseUrl = 'https://localhost:7186/',
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
