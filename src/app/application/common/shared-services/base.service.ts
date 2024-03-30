import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpStatusCode,
} from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { MessageRequest, MessageResponse } from '../shared-models/shared.model';
import { MessageService } from 'primeng/api';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'auth-token',
    }),
};

export class BaseService {
    constructor(protected http: HttpClient, protected baseUrl: string,private messageService: MessageService) {}
    /**
     * Centralized post method for requests.
     * The first type variable "ReqMsg" is the type of message to send, while "RespMsg" is the expected response.
     * @param request The request message sent to the COM.
     * @param method (optional) The Controller method to invoke. Exclude this argument to call PostRequest.
     * @param parameters (optional) Additional data to be manually deserialized in the optional Controller method
     * @returns The response message from the COM.
     */
    public postRequest(
        request: any,
        requestUrl: string,
        parameters: any = {}
    ): Observable<MessageResponse> {
        const msgReq: MessageRequest = {
            authToken: '', //this.*userInfo.authToken || '',
            caller: '', //this.userInfo.securityId || '',
            msg: request,
            parameters: parameters,
        };

        //let api = `api/${this.controllerName}/${method}`;
        //let msgString = JSON.stringify(msgReq, this.dateStringifyReplacer);

        return this.http
            .post<MessageResponse>(requestUrl, msgReq, httpOptions)
            .pipe(
                catchError(this.handleError),
                map(this.logErrorMessage)
            ) as Observable<MessageResponse>;
    }

    /**
     * Create a error from the HTTPErrorResponse.
     * @param error The response returned from the HTTP Post request
     * @returns An observable to be piped to the next operator
     */
    public handleError(error: HttpErrorResponse): Observable<MessageResponse> {
        const response = {} as MessageResponse;
        response.errorMessage = error.message;
        response.statusCode = HttpStatusCode.InternalServerError;
        response.result = null;
        return of(response);
    }
    /**
     * Log error if a failed ErrorMsg was returned.
     * @param response The observable returned from the server
     * @returns An observable to be piped to the next operator
     */
    private logErrorMessage<RespMsg extends MessageResponse>(msg: RespMsg): RespMsg {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msg.errorMessage,
            life: 3000,
        });
        return msg;
    }
}
