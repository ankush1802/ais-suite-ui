import { HttpStatusCode } from "@angular/common/http";

export interface MessageRequest {
    authToken: string;
    caller: string;
    msg: any;
    parameters: any;
  }
  export interface MessageResponse {
    result: any;
    errorMessage: string;
    statusCode: HttpStatusCode;
  }
  export interface NotificationModel{
    title: string;
    message: string;
    type: string;
  }
