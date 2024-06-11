import { PdfViewer } from '../index';

/**
 * @hidden
 */
export class AjaxHandler {
    /**
     * Specifies the URL to which request to be sent.
     *
     * @default null
     */
    public url: string;
    /**
     * Specifies the URL to which request to be sent.
     *
     * @default 'POST'
     */
    public type: string = 'POST';
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
     * @private
     */
    public mode: boolean = true;
    /**
     * Specifies the ContentType to which request to be sent
     *
     * @default null
     * @private
     */
    public contentType: string = 'application/json;charset=UTF-8';
    private httpRequest: XMLHttpRequest;
    private pdfViewer: PdfViewer;
    private retryCount: number;
    private retryStatusCodes : number[];
    private retryTimeout: number = 0;

    /**
     * Constructor for Ajax class
     *
     * @param  {PdfViewer} pdfviewer - The pdfviewer.
     * @private
     */
    constructor(pdfviewer: PdfViewer) {
        this.pdfViewer = pdfviewer;
        this.retryCount = pdfviewer.retryCount;
        this.retryStatusCodes = pdfviewer.retryStatusCodes;
        this.retryTimeout = 1000 * pdfviewer.retryTimeout;
    }

    /**
     * Send the request to server
     *
     * @param  {object} jsonObj - To send to service
     * @returns {void}
     * @private
     */
    public send(jsonObj: object): void {
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.timeout = this.retryTimeout;
        if (!this.mode) {
            setTimeout(() => {
                this.sendRequest(jsonObj);
            });
        } else {
            this.sendRequest(jsonObj);
        }
        this.httpRequest.onreadystatechange = () => {
            let isSkip: boolean = false;
            const viewerBase: any = this.pdfViewer.viewerBase;
            if (viewerBase && viewerBase.isPasswordAvailable && viewerBase.passwordData === '') {
                isSkip = true;
                this.retryCount = 0;
            }
            if (this.retryCount > 0) {
                isSkip = this.resendRequest(this, jsonObj, false);
            }
            if (!isSkip) {
                this.stateChange(this);
            }
        };
        this.httpRequest.ontimeout = () => {
            let isSkip: boolean = false;
            // tslint:disable-next-line
            const viewerBase: any = this.pdfViewer.viewerBase;
            if (viewerBase && viewerBase.isPasswordAvailable && viewerBase.passwordData === '') {
                isSkip = true;
                this.retryCount = 0;
            }
            if (this.retryCount > 0) {
                isSkip = this.resendRequest(this, jsonObj, true);
            }
            if (!isSkip) {
                this.stateChange(this);
            }
        };
        this.httpRequest.onerror = () => {
            this.error(this);
        };
    }

    /**
     * Clear the http request
     *
     * @returns {void}
     * @private
     */
    public clear(): void {
        if (this.httpRequest) {
            this.httpRequest.abort();
        }
        this.onSuccess = null;
        this.onFailure = null;
        this.onError = null;
    }

    private resendRequest(proxy: AjaxHandler, jsonObj: any, isTimeout: boolean): boolean {
        let isSkip: boolean = false;
        const status: number = proxy.httpRequest.status;
        const statusString : boolean = this.retryStatusCodes.indexOf(status) !== -1;
        if (proxy.httpRequest.readyState === 4 && status === 200) {
            let data: any;
            if (this.responseType !== null) {
                data = proxy.httpRequest.response;
            } else {
                data = proxy.httpRequest.responseText;
            }
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    } catch (error) {
                        if (data === 'Document stream does not exist in the cache' || data === 'Document Reference pointer does not exist in the cache') {
                            isSkip = true;
                        }
                    }
                }
            }
        }
        if (statusString || isSkip || isTimeout) {
            isSkip = true;
            this.retryCount--;
            proxy.pdfViewer.fireAjaxRequestFailed(status, proxy.httpRequest.statusText, jsonObj.action, true);
            proxy.send(jsonObj);
        }
        return isSkip;
    }

    private sendRequest(jsonObj: object): void {
        this.httpRequest.open(this.type, this.url, this.mode);
        this.httpRequest.withCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials;
        this.httpRequest.setRequestHeader('Content-Type', this.contentType);
        jsonObj = this.addExtraData(jsonObj);
        this.setCustomAjaxHeaders();
        if (this.responseType !== null) {
            this.httpRequest.responseType = this.responseType;
        }
        this.httpRequest.send(JSON.stringify(jsonObj)); // jshint ignore:line
    }

    private addExtraData(jsonObject: object): object {
        this.pdfViewer.viewerBase.ajaxData = '';
        this.pdfViewer.fireAjaxRequestInitiate(jsonObject);
        if (this.pdfViewer.viewerBase.ajaxData && this.pdfViewer.viewerBase.ajaxData !== '') {
            jsonObject = this.pdfViewer.viewerBase.ajaxData;
        }
        return jsonObject;
    }

    private stateChange(proxy: AjaxHandler): void {
        const status: number = proxy.httpRequest.status;
        const statusString: string = status.toString().split('')[0];
        if (proxy.httpRequest.readyState === 4 && status === 200) {
            let data: any;
            if (this.responseType !== null) {
                data = proxy.httpRequest.response;
            } else {
                data = proxy.httpRequest.responseText;
            }
            const result: any = {
                name: 'onSuccess',
                data: data,
                readyState: proxy.httpRequest.readyState,
                status: proxy.httpRequest.status
            };
            proxy.successHandler(result);
        } else if (proxy.httpRequest.readyState === 4 && (statusString === '4' || statusString === '5')) { // jshint ignore:line)
            // For handling 4xx and 5xx errors.
            const result: any = {
                name: 'onFailure',
                status: proxy.httpRequest.status,
                statusText: proxy.httpRequest.statusText
            };
            proxy.failureHandler(result);
        }
    }

    private error(proxy: AjaxHandler): void {
        const result: any = {
            name: 'onError',
            status: this.httpRequest.status,
            statusText: this.httpRequest.statusText
        };
        proxy.errorHandler(result);
    }

    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded.
     * The callback will contain server response as the parameter.
     *
     * @event onSuccess
     * @private
     */
    public onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed.
     * The callback will contain server response as the parameter.
     *
     * @event onFailure
     * @private
     */
    public onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error.
     * The callback will contain server response as the parameter.
     *
     * @event onError
     * @private
     */
    public onError: Function;

    private successHandler(response: any): any {
        if (this.onSuccess) {
            this.onSuccess(response);
        }
        return response;
    }

    private failureHandler(response: any): any {
        if (this.onFailure) {
            this.onFailure(response);
        }
        return response;
    }

    private errorHandler(response: any): any {
        if (this.onError) {
            this.onError(response);
        }
        return response;
    }

    private setCustomAjaxHeaders(): void {
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            this.httpRequest.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerName,
                                              this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerValue);
        }
    }
}
