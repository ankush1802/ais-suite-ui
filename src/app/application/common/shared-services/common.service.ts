import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { NotificationModel } from "../shared-models/shared.model";

@Injectable()
export class CommonService {
    private showNotificationSubject = new BehaviorSubject<NotificationModel>(null);
    showNotificationObservable: Observable<NotificationModel> = this.showNotificationSubject.asObservable();
    public setNotification(response: NotificationModel) {
      this.showNotificationSubject.next(response);
    }

    constructor() {}

}
