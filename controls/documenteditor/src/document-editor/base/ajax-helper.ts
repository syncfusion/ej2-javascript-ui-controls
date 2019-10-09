/**
 * @private
 */
export class XmlHttpRequestHandler {

    /**
     * Specifies the URL to which request to be sent.

     */
    public url: string;
    /**
     * @private
     */
    public contentType: string;
    /**
     * Specifies the responseType to which request response.

     */
    public responseType: XMLHttpRequestResponseType;
    /**		 
     * A boolean value indicating whether the request should be sent asynchronous or not.

     */
    public mode: boolean = true;

    private xmlHttpRequest: XMLHttpRequest;
    /**
     * Send the request to server
     * @param  {object} jsonObject - To send to service
     */
    public send(jsonObject: object): void {
        this.xmlHttpRequest = new XMLHttpRequest();
        this.xmlHttpRequest.onreadystatechange = () => { this.stateChange(this); };
        this.xmlHttpRequest.onerror = () => { this.error(this); };
        if (!this.mode) {
            setTimeout(() => { this.sendRequest(jsonObject); });
        } else {
            this.sendRequest(jsonObject);
        }
    }

    private sendRequest(jsonObj: object): void {
        this.xmlHttpRequest.open('POST', this.url, true);
        if (this.contentType) {
            this.xmlHttpRequest.setRequestHeader('Content-Type', this.contentType);
        }
        if (this.responseType) {
            this.xmlHttpRequest.responseType = this.responseType;
        }
        let data: FormData | string = jsonObj instanceof FormData ? jsonObj : JSON.stringify(jsonObj);
        this.xmlHttpRequest.send(data); // jshint ignore:line
    }

    private stateChange(proxyReq: XmlHttpRequestHandler): void {
        if (proxyReq.xmlHttpRequest.readyState === 4 && proxyReq.xmlHttpRequest.status === 200) {
            // tslint:disable-next-line
            let data: any;
            if (this.responseType) {
                data = proxyReq.xmlHttpRequest.response;
            } else {
                data = proxyReq.xmlHttpRequest.responseText;
            }
            // tslint:disable-next-line
            let result: any = {
                name: 'onSuccess',
                data: data,
                readyState: proxyReq.xmlHttpRequest.readyState,
                status: proxyReq.xmlHttpRequest.status
            };
            proxyReq.successHandler(result);
        } else if (proxyReq.xmlHttpRequest.readyState === 4 && proxyReq.xmlHttpRequest.status === 400) { // jshint ignore:line)
            // tslint:disable-next-line
            let result: any = {
                name: 'onFailure',
                status: proxyReq.xmlHttpRequest.status,
                statusText: proxyReq.xmlHttpRequest.statusText
            };
            proxyReq.failureHandler(result);
        }
    }

    private error(proxyReq: XmlHttpRequestHandler): void {
        // tslint:disable-next-line
        let result: any = {
            name: 'onError',
            status: this.xmlHttpRequest.status,
            statusText: this.xmlHttpRequest.statusText
        };
        proxyReq.errorHandler(result);
    }

    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded. 
     * The callback will contain server response as the parameter.
     * @event
     */
    public onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed. 
     * The callback will contain server response as the parameter.
     * @event
     */
    public onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error. 
     * The callback will contain server response as the parameter.
     * @event
     */
    public onError: Function;

    // tslint:disable-next-line
    private successHandler(response: any) {
        if (this.onSuccess) {
            this.onSuccess(response);
        }
        return response;
    }

    // tslint:disable-next-line
    private failureHandler(response: any) {
        if (this.onFailure) {
            this.onFailure(response);
        }
        return response;
    }

    // tslint:disable-next-line
    private errorHandler(response: any) {
        if (this.onError) {
            this.onError(response);
        }
        return response;
    }
}