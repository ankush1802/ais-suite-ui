import { HttpStatusCode } from "@angular/common/http";

export interface MessageRequest {
    authToken: string;
    caller: string;
    parameters: any;
  }
  export interface MessageResponse {
    response: any;
    responses: any[];
    errorMessage: string;
    statusCode: HttpStatusCode;
  }
