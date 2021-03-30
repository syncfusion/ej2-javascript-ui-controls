/* eslint-disable */
/**
 * @private
 */
export class XmlHttpRequestHandler {

    /**
     * Specifies the URL to which request to be sent.
     *
     * @default null
     */
    public url: string;
    /**
     * @private
     */
    public contentType: string;
    /**
     * Specifies the responseType to which request response.
     *
     * @default null
     */
    public responseType: XMLHttpRequestResponseType;
    /**
     * A boolean value indicating whether the request should be sent asynchronous or not.
     *
     * @default true
     */
    public mode: boolean = true;

    private xmlHttpRequest: XMLHttpRequest;
    /**
     * @private
     */
    public customHeaders: Object[];

    /**
     * Send the request to server
     *
     * @param  {object} jsonObject - To send to service
     */
    public send(jsonObject: object): void {
        this.xmlHttpRequest = new XMLHttpRequest();
        this.xmlHttpRequest.onreadystatechange = () => {
            this.stateChange(this);
        };
        this.xmlHttpRequest.onerror = () => {
            this.error(this);
        };
        if (!this.mode) {
            setTimeout(() => {
                this.sendRequest(jsonObject);
            });
        } else {
            this.sendRequest(jsonObject);
        }
    }

    private sendRequest(jsonObj: object): void {
        this.xmlHttpRequest.open('POST', this.url, true);
        if (this.contentType) {
            this.xmlHttpRequest.setRequestHeader('Content-Type', this.contentType);
        }
        this.setCustomAjaxHeaders();
        if (this.responseType) {
            this.xmlHttpRequest.responseType = this.responseType;
        }
        const data: FormData | string = jsonObj instanceof FormData ? jsonObj : JSON.stringify(jsonObj);
        this.xmlHttpRequest.send(data); // jshint ignore:line
    }

    private stateChange(proxyReq: XmlHttpRequestHandler): void {
        if (proxyReq.xmlHttpRequest.readyState === 4 && proxyReq.xmlHttpRequest.status === 200) {
            let data: any;
            if (this.responseType) {
                data = proxyReq.xmlHttpRequest.response;
            } else {
                data = proxyReq.xmlHttpRequest.responseText;
            }
            let result: any = {
                name: 'onSuccess',
                data: data,
                readyState: proxyReq.xmlHttpRequest.readyState,
                status: proxyReq.xmlHttpRequest.status
            };
            proxyReq.successHandler(result);
        } else if (proxyReq.xmlHttpRequest.readyState === 4 && !(proxyReq.xmlHttpRequest.status === 200)) { // jshint ignore:line)
            let result: any = {
                name: 'onFailure',
                status: proxyReq.xmlHttpRequest.status,
                statusText: proxyReq.xmlHttpRequest.statusText,
                url: proxyReq.url
            };
            proxyReq.failureHandler(result);
        }
    }

    private error(proxyReq: XmlHttpRequestHandler): void {
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
     *
     * @event
     */
    public onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed.
     * The callback will contain server response as the parameter.
     *
     * @event
     */
    public onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error.
     * The callback will contain server response as the parameter.
     *
     * @event
     */
    public onError: Function;

    private successHandler(response: any) {
        if (this.onSuccess) {
            this.onSuccess(response);
        }
        return response;
    }

    private failureHandler(response: any) {
        if (this.onFailure) {
            this.onFailure(response);
        }
        return response;
    }

    private errorHandler(response: any) {
        if (this.onError) {
            this.onError(response);
        }
        return response;
    }

    private setCustomAjaxHeaders(): void {
        for (let i: number = 0; i < this.customHeaders.length; i++) {
            const header: Object = this.customHeaders[i];
            for (const key of Object.keys(header)) {
                this.xmlHttpRequest.setRequestHeader(key, header[key]);
            }
        }
    }

}
