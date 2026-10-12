/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined as isNOU, isObject, merge } from './util';

/**
 * The Fetch class provides a way to make asynchronous network requests, typically to retrieve resources from a server.
 * ```typescript
 *   var fetchApi = new Fetch('index.html', 'GET');
 *   fetchApi.send()
 *      .then((value) => {
 *          console.log(value);
 *      }).catch((error) => {
 *          console.log(error);
 *      });
 * ```
 */
export class Fetch {
    /**
     * Specifies the URL to which the request is to be sent.
     *
     * @default null
     */
    public url: string;
    /**
     * Specifies which request method is to be used, such as GET, POST, etc.
     *
     * @default GET
     */
    public type: string = 'GET';
    /**
     * Specifies the content type of the request, which is used to indicate the original media type of the resource.
     *
     * @default null
     */
    public contentType: string;
    /**
     * Specifies the data that needs to be added to the request.
     *
     * @default null
     */
    public data: string | Object;
    /**
     * A boolean value indicating whether to reject the promise or not.
     *
     * @private
     * @default true
     */
    public emitError: boolean = true;
    /**
     * Specifies the request object that represents a resource request.
     *
     * @default null
     */
    public fetchRequest: Request;
    /**
     * Represents a response to a request.
     *
     * @private
     * @default null
     */
    private fetchResponse: Promise<Response>;
    /**
     * Specifies the callback function to be triggered before sending the request to the server.
     * This can be used to modify the fetchRequest object before it is sent.
     *
     * @event beforeSend
     */
    public beforeSend: Function;
    /**
     * Specifies the callback function to be triggered after the response is received.
     * This callback will be triggered even if the request is failed.
     *
     * @event onLoad
     */
    public onLoad: Function;
    /**
     * Specifies the callback function to be triggered after the request is successful.
     * The callback will contain the server response as a parameter.
     *
     * @event onSuccess
     */
    public onSuccess: Function;
    /**
     * Specifies the callback function to be triggered after the request is failed.
     *
     * @event onFailure
     */
    public onFailure: Function;

    /**
     * Constructor for Fetch class.
     *
     * @param {string|Object} options - Specifies the URL or Request object with URL to which the request is to be sent.
     * @param {string} type - Specifies which request method is to be used, such as GET, POST, etc.
     * @param {string} contentType - Specifies the content type of the request, which is used to indicate the original media type of the resource.
     */
    constructor(options?: string | Object, type?: string, contentType?: string) {
        if (typeof options === 'string') {
            this.url = options;
            this.type = !isNOU(type) ? type.toUpperCase() : this.type;
            this.contentType = contentType;
        }
        else if (isObject(options) && Object.keys(options).length > 0) {
            merge(this, options);
        }
        this.contentType = !isNOU(this.contentType) ? this.contentType : 'application/json; charset=utf-8';
    }

    /**
     * Send the request to server.
     *
     * @param {string|Object} data - Specifies the data that needs to be added to the request.
     * @returns {Promise<Response>} - Returns the response to a request.
     */
    public send(data?: string | Object): Promise<Response> {
        const contentTypes: Object = {
            'application/json': 'json',
            'multipart/form-data': 'formData',
            'application/octet-stream': 'blob',
            'application/x-www-form-urlencoded': 'formData'
        };
        try {
            if (isNOU(this.fetchRequest) && this.type === 'GET') {
                this.fetchRequest = new Request(this.url, { method: this.type });
            } else if (isNOU(this.fetchRequest)) {
                this.data = !isNOU(data) ? data : this.data;
                this.fetchRequest = new Request(this.url, {
                    method: this.type,
                    headers: { 'Content-Type': this.contentType },
                    body: this.data as BodyInit
                });
            }
            const eventArgs: BeforeSendFetchEventArgs = { cancel: false, fetchRequest: this.fetchRequest };
            this.triggerEvent(this['beforeSend'], eventArgs);
            if (eventArgs.cancel) { return null; }
            this.fetchResponse = fetch(this.fetchRequest);
            return this.fetchResponse.then((response: Response) => {
                this.triggerEvent(this['onLoad'], response);
                if (!response.ok) {
                    throw response;
                }
                let responseType: string = 'text';
                for (const key of Object.keys(contentTypes)) {
                    if (response.headers.get('Content-Type') && (response.headers.get('Content-Type') as string).indexOf(key) !== -1) {
                        responseType = contentTypes[key as string];
                    }
                }
                return response[responseType as string]();
            }).then((data: any) => {
                this.triggerEvent(this['onSuccess'], data, this);
                return data;
            }).catch((error: any) => {
                let returnVal: Object = {};
                if (this.emitError) {
                    this.triggerEvent(this['onFailure'], error);
                    returnVal = Promise.reject(error);
                }
                return returnVal;
            });
        } catch (error) {
            return error;
        }
    }

    private triggerEvent(callback: Function, data?: string | Object, instance?: Fetch): void {
        if (!isNOU(callback) && typeof callback === 'function') {
            callback(data, instance);
        }
    }
}

/**
 * Provides information about the beforeSend event.
 */
export interface BeforeSendFetchEventArgs {
    /**
     * A boolean value indicating whether to cancel the fetch request or not.
     */
    cancel?: boolean;
    /**
     * Returns the request object that represents a resource request.
     */
    fetchRequest: Request;
}
