import { HttpStatusCode } from "@angular/common/http";

export interface MessageRequest {
    authToken: string;
    caller: string;
    parameters: any;
  }
  export interface MessageResponse {
    result: any;
    errorMessage: string;
    statusCode: HttpStatusCode;
  }
