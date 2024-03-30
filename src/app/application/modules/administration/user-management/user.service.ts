import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiBaseUrls, UserModouleApiEndpoints } from "src/app/application/common/api.endpoints";
import { MessageResponse } from "src/app/application/common/shared-models/shared.model";

@Injectable()
export class UserService {
    private showNotificationSubject = new BehaviorSubject<string>('');
    showNotificationObservable: Observable<string> = this.showNotificationSubject.asObservable();
    public setEditExtractDialogClose(response: string) {
      this.showNotificationSubject.next(response);
    }

    constructor(protected http: HttpClient) {}
    public getAllUser(request: any) {
        return this.http.post<MessageResponse>(
            `${ApiBaseUrls.userbaseUrl}${UserModouleApiEndpoints.GetAllUsers}`,
            request
        );
    }
    public getUserById(request: any) {
        return this.http.post<MessageResponse>(
            `${ApiBaseUrls.userbaseUrl}${UserModouleApiEndpoints.GetUserById}`,
            request
        );
    }
    public saveUser(request: any) {
        return this.http.post<MessageResponse>(
            `${ApiBaseUrls.userbaseUrl}${UserModouleApiEndpoints.SaveUser}`,
            request
        );
    }
    public deleteUsers(request : any){
        return this.http.post<MessageResponse>(
            `${ApiBaseUrls.userbaseUrl}${UserModouleApiEndpoints.DeleteUser}`,
            request
        );
    }
}
