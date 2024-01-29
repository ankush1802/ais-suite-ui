import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    ApiBaseUrls,
    RoleModouleApiEndpoints,
} from 'src/app/application/common/api.endpoints';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';

@Injectable()
export class RoleService {
    constructor(protected http: HttpClient) {}
    public getAllRoles(request: any) {
        return this.http.post<MessageResponse>(
            `${ApiBaseUrls.rolebaseUrl}${RoleModouleApiEndpoints.GetAllRoles}`,
            request
        );
    }
    public getAllPermissions() {
        return this.http.get<MessageResponse>(
            `${ApiBaseUrls.rolebaseUrl}${RoleModouleApiEndpoints.GetAllPermissions}`
        );
    }
}
