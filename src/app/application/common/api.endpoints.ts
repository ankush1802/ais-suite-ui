
export enum ApiBaseUrls {
    authbaseUrl = 'https://localhost:8000/',
    entitybaseUrl = 'http://localhost/entity-management/',
  }

  export enum AuthModouleApiEndpoints {
    Auth = 'api/Auth/ValidateUser',
  }

  export enum EntityModouleApiEndpoints {
    GetAllEntities = 'api/Entity/GetAllEntities',
    GetEntityById = 'api/Entity/GetEntityById',
    SaveEntity='api/Entity/SaveEntity',
    DeleteEntities='api/Entity/DeleteEntities'
  }
