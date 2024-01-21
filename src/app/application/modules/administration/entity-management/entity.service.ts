import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiBaseUrls, EntityModouleApiEndpoints } from "src/app/application/common/api.endpoints";
import { Entity } from "./entity.model";
import { MessageResponse } from "src/app/application/common/shared-models/shared.model";

@Injectable()
export class EntityService {
    public manageEntityDialogOpen: boolean = false;
  constructor(protected http: HttpClient) {}

  /**
   * Fetch the entities list
   * @param request - request message for retriving all entities
   */
  public getAllEntities(request: any) {
    return this.http.post<MessageResponse>(
      `${ApiBaseUrls.entitybaseUrl}${EntityModouleApiEndpoints.GetAllEntities}`,
      request
    );
  }
  public saveEntity(request: Entity) {
    return this.http.post<MessageResponse>(
      `${ApiBaseUrls.entitybaseUrl}${EntityModouleApiEndpoints.SaveEntity}`,
      request
    );
  }
}
