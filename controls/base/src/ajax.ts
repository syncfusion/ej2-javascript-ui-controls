import { isNullOrUndefined, merge } from './util';
const headerRegex: RegExp = /^(.*?):[ \t]*([^\r\n]*)$/gm;
const defaultType: string = 'GET';

/**
 * Ajax class provides ability to make asynchronous HTTP request to the server
 * ```typescript
 *   var ajax = new Ajax("index.html", "GET", true);
 *   ajax.send().then(
 *               function (value) {
 *                   console.log(value);
 *               },
 *               function (reason) {
 *                   console.log(reason);
 *               });
 * ```
 */
export class Ajax {
    /**		
     * Specifies the URL to which request to be sent.
     * @default null		
     */
    public url: string;
    /**		
     * Specifies which HTTP request method to be used. For ex., GET, POST
     * @default GET
     */
    public type: string;
    /**		
     * Specifies the data to be sent.
     * @default null		
     */
    public data: string | Object;
    /**		 
     * A boolean value indicating whether the request should be sent asynchronous or not.
     * @default true
     */
    public mode: boolean = true;
    /**		 
     * Specifies the callback for creating the XMLHttpRequest object.
     * @default null
     */
    public httpRequest: XMLHttpRequest;
    /**		 
     * A boolean value indicating whether to ignore the promise reject.
     * @private
     * @default true
     */
    public emitError: boolean = true;

    private options: Object = {};

    public onLoad: (this: XMLHttpRequest, ev: Event) => Object;
    public onProgress: (this: XMLHttpRequest, ev: Event) => Object;
    public onError: (this: XMLHttpRequest, ev: Event) => Object;
    public onAbort: (this: XMLHttpRequest, ev: Event) => Object;

    public onUploadProgress: (this: XMLHttpRequest, ev: Event) => Object;

    private contentType: string;
    private dataType: string;
    /**
     * Constructor for Ajax class
     * @param  {string|Object} options?
     * @param  {string} type?
     * @param  {boolean} async?
     * @returns defaultType
     */
    constructor(options?: string | Object, type?: string, async?: boolean, contentType?: string) {
        if (typeof options === 'string') {
            this.url = options;
            this.type = type ? type.toUpperCase() : defaultType;
            this.mode = !isNullOrUndefined(async) ? async : true;
        } else if (typeof options === 'object') {
            this.options = options;
            merge(this, this.options);
        }
        this.type = this.type ? this.type.toUpperCase() : defaultType;
        this.contentType = (this.contentType !== undefined) ? this.contentType : contentType;
    }
    /**
     * Send the request to server.
     * @param {any} data - To send the user data
     * @return {Promise}
     */
    public send(data?: string | Object): Promise<Ajax> {
        this.data = isNullOrUndefined(data) ? this.data : data;
        let eventArgs: BeforeSendEventArgs = {
            cancel: false,
            httpRequest: null
        };
        let promise: Promise<Ajax> = new Promise((resolve: Function, reject: Function) => {
            this.httpRequest = new XMLHttpRequest();
            this.httpRequest.onreadystatechange = () => { this.stateChange(resolve, reject); };
            if (!isNullOrUndefined(this.onLoad)) {
                this.httpRequest.onload = this.onLoad;
            }
            if (!isNullOrUndefined(this.onProgress)) {
                this.httpRequest.onprogress = this.onProgress;
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onAbort)) {
                this.httpRequest.onabort = this.onAbort;
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onError)) {
                this.httpRequest.onerror = this.onError;
            }
            //** Upload Events **/
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onUploadProgress)) {
                this.httpRequest.upload.onprogress = this.onUploadProgress;
            }
            this.httpRequest.open(this.type, this.url, this.mode);
            // Set default headers
            if (!isNullOrUndefined(this.data) && this.contentType !== null) {
                this.httpRequest.setRequestHeader('Content-Type', this.contentType || 'application/json; charset=utf-8');
            }
            if (this.beforeSend) {
                eventArgs.httpRequest = this.httpRequest;
                this.beforeSend(eventArgs);
            }
            if (!eventArgs.cancel) {
                this.httpRequest.send(!isNullOrUndefined(this.data) ? this.data as Document : null);
            }
        });
        return promise;
    }
    /**
     * Specifies the callback function to be triggered before sending request to sever. 
     * This can be used to modify the XMLHttpRequest object before it is sent.
     * @event 
     */
    public beforeSend: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded. 
     * The callback will contain server response as the parameter.
     * @event
     */
    public onSuccess: Function;
    /**
     * Triggers when XmlHttpRequest is failed.
     * @event
     */
    public onFailure: Function;
    private successHandler(data: string): string {
        if (this.onSuccess) {
            this.onSuccess(data, this);
        }
        return data;
    }
    private failureHandler(reason: string): string {
        if (this.onFailure) {
            this.onFailure(this.httpRequest);
        }
        return reason;
    }
    private stateChange(resolve: Function, reject: Function): void {
        let data: string = this.httpRequest.responseText;
        if (this.dataType && this.dataType.toLowerCase() === 'json') {
            if (data === '') {
                data = undefined;
            } else {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    // no exception handle
                }
            }
        }
        if (this.httpRequest.readyState === 4) {
            //success range should be 200 to 299
            if ((this.httpRequest.status >= 200 && this.httpRequest.status <= 299) || this.httpRequest.status === 304) {
                resolve(this.successHandler(data));
            } else {
                if (this.emitError) {
                    reject(new Error(this.failureHandler(this.httpRequest.statusText)));
                } else {
                    resolve();
                }
            }
        }
    }
    /**
     * To get the response header from XMLHttpRequest 
     * @param  {string} key Key to search in the response header 
     * @returns {string}
     */
    public getResponseHeader(key: string): string {
        let responseHeaders: { [key: string]: string };
        let header: string;
        responseHeaders = {};
        let headers: string[] = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
        while (headers) {
            responseHeaders[headers[1].toLowerCase()] = headers[2];
            headers = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
        }
        header = responseHeaders[key.toLowerCase()];
        return isNullOrUndefined(header) ? null : header;
    }
}

export interface HeaderOptions {
    readyState?: number;
    getResponseHeader?: Function;
    setRequestHeader?: Function;
    overrideMimeType?: Function;
}

/**
 * Specifies the ajax beforeSend event arguments 
 * @event
 */
export interface BeforeSendEventArgs {

    /** To cancel the ajax request in beforeSend */
    cancel?: boolean;

    /** Returns the request sent from the client end */
    httpRequest?: XMLHttpRequest;
}