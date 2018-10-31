import { isUndefined, getValue } from './util';
const REGX_MOBILE: RegExp = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
const REGX_IE: RegExp = /msie|trident/i;
const REGX_IE11: RegExp = /Trident\/7\./;
const REGX_IOS: RegExp = /(ipad|iphone|ipod touch)/i;
const REGX_IOS7: RegExp = /(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i;
const REGX_ANDROID: RegExp = /android/i;
const REGX_WINDOWS: RegExp = /trident|windows phone|edge/i;
const REGX_VERSION: RegExp = /(version)[ \/]([\w.]+)/i;
const REGX_BROWSER: { [key: string]: RegExp } = {
    OPERA: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i,
    EDGE: /(edge)(?:.*version|)[ \/]([\w.]+)/i,
    CHROME: /(chrome|crios)[ \/]([\w.]+)/i,
    PANTHOMEJS: /(phantomjs)[ \/]([\w.]+)/i,
    SAFARI: /(safari)[ \/]([\w.]+)/i,
    WEBKIT: /(webkit)[ \/]([\w.]+)/i,
    MSIE: /(msie|trident) ([\w.]+)/i,
    MOZILLA: /(mozilla)(?:.*? rv:([\w.]+)|)/i
};

// 
interface MyWindow extends Window {
    browserDetails: BrowserDetails;
    cordova: Object;
    PhoneGap: Object;
    phonegap: Object;
    forge: Object;
}
declare let window: MyWindow;

/* istanbul ignore else  */
if (typeof window !== 'undefined') {
    window.browserDetails = window.browserDetails || {};
}


/**
 * Get configuration details for Browser
 * @private
 */
export class Browser {

    /* istanbul ignore next */
    private static uA: string = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    private static extractBrowserDetail(): BrowserInfo {
        let browserInfo: BrowserInfo = { culture: {} };
        let keys: string[] = Object.keys(REGX_BROWSER);
        let clientInfo: string[] = [];
        for (let key of keys) {
            clientInfo = Browser.userAgent.match(REGX_BROWSER[key]);
            if (clientInfo) {
                browserInfo.name = (clientInfo[1].toLowerCase() === 'opr' ? 'opera' : clientInfo[1].toLowerCase());
                browserInfo.name = (clientInfo[1].toLowerCase() === 'crios' ? 'chrome' : browserInfo.name);
                browserInfo.version = clientInfo[2];
                browserInfo.culture.name = browserInfo.culture.language = navigator.language;
                if (!!Browser.userAgent.match(REGX_IE11)) {
                    browserInfo.name = 'msie';
                    break;
                }
                let version: RegExpMatchArray = Browser.userAgent.match(REGX_VERSION);
                if (browserInfo.name === 'safari' && version) {
                    browserInfo.version = version[2];
                }
                break;
            }
        }
        return browserInfo;
    }

    /**
     * To get events from the browser
     * @param {string} event - type of event triggered.
     * @returns {Boolean}
     */

    private static getEvent(event: string): string {
        // tslint:disable-next-line:no-any
        let events: { [key: string]: any } = {
            start: {
                isPointer: 'pointerdown', isTouch: 'touchstart', isDevice: 'mousedown'
            },
            move: {
                isPointer: 'pointermove', isTouch: 'touchmove', isDevice: 'mousemove'
            },
            end: {
                isPointer: 'pointerup', isTouch: 'touchend', isDevice: 'mouseup'
            },
            cancel: {
                isPointer: 'pointercancel', isTouch: 'touchcancel', isDevice: 'mouseleave'
            }
        };
        return (Browser.isPointer ? events[event].isPointer :
            (Browser.isTouch ? events[event].isTouch + (!Browser.isDevice ? ' ' + events[event].isDevice : '')
                : events[event].isDevice));
    }

    /**
     * To get the Touch start event from browser
     * @returns {string}
     */

    private static getTouchStartEvent(): string {
        return Browser.getEvent('start');
    }

    /**
     * To get the Touch end event from browser
     * @returns {string}
     */

    private static getTouchEndEvent(): string {
        return Browser.getEvent('end');
    }

    /**
     * To get the Touch move event from browser
     * @returns {string}
     */

    private static getTouchMoveEvent(): string {
        return Browser.getEvent('move');
    }

    /**
     * To cancel the touch event from browser
     * @returns {string}
     */

    private static getTouchCancelEvent(): string {
        return Browser.getEvent('cancel');
    }

    /**
     * To get the value based on provided key and regX
     * @param {string} key 
     * @param {RegExp} regX 
     * @returns {Object}
     */

    private static getValue(key: string, regX: RegExp): Object {
        let browserDetails: {} = window.browserDetails;
        if ('undefined' === typeof (<{ [key: string]: Object }>browserDetails)[key]) {
            return (<{ [key: string]: Object }>browserDetails)[key] = regX.test(Browser.userAgent);
        }
        return (<{ [key: string]: Object }>browserDetails)[key];
    }

    //Properties 

    /**
     * Property specifies the userAgent of the browser. Default userAgent value is based on the browser. 
     * Also we can set our own userAgent.
     */
    static set userAgent(uA: string) {
        Browser.uA = uA;
        window.browserDetails = {};
    }
    static get userAgent(): string {
        return Browser.uA;

    }

    //Read Only Properties

    /**
     * Property is to get the browser information like Name, Version and Language
     * @returns BrowserInfo
     */
    static get info(): BrowserInfo {
        if (isUndefined(window.browserDetails.info)) {
            return window.browserDetails.info = Browser.extractBrowserDetail();
        }
        return window.browserDetails.info;
    }

    /**
     * Property is to get whether the userAgent is based IE.
     */
    static get isIE(): Boolean {
        return <Boolean>Browser.getValue('isIE', REGX_IE);
    }

    /**
     * Property is to get whether the browser has touch support.
     */
    static get isTouch(): Boolean {
        if (isUndefined(window.browserDetails.isTouch)) {
            return window.browserDetails.isTouch = ('ontouchstart' in window);
        }
        return window.browserDetails.isTouch;
    }

    /**
     * Property is to get whether the browser has Pointer support.
     */
    static get isPointer(): Boolean {
        if (isUndefined(window.browserDetails.isPointer)) {
            return window.browserDetails.isPointer = ('pointerEnabled' in window.navigator);
        }
        return window.browserDetails.isPointer;
    }

    /**
     * Property is to get whether the browser has MSPointer support.
     */
    static get isMSPointer(): Boolean {
        if (isUndefined(window.browserDetails.isMSPointer)) {
            return window.browserDetails.isMSPointer = ('msPointerEnabled' in window.navigator);
        }
        return window.browserDetails.isMSPointer;
    }

    /**
     * Property is to get whether the userAgent is device based.
     */
    static get isDevice(): Boolean {
        return <Boolean>Browser.getValue('isDevice', REGX_MOBILE);
    }

    /**
     * Property is to get whether the userAgent is IOS.
     */
    static get isIos(): Boolean {
        return <Boolean>Browser.getValue('isIos', REGX_IOS);
    }

    /**
     * Property is to get whether the userAgent is Ios7.
     */
    static get isIos7(): Boolean {
        return <Boolean>Browser.getValue('isIos7', REGX_IOS7);
    }

    /**
     * Property is to get whether the userAgent is Android.
     */
    static get isAndroid(): Boolean {
        return <Boolean>Browser.getValue('isAndroid', REGX_ANDROID);
    }


    /**
     * Property is to identify whether application ran in web view.
     */
    static get isWebView(): Boolean {
        if (isUndefined(window.browserDetails.isWebView)) {
            window.browserDetails.isWebView = !(isUndefined(window.cordova) && isUndefined(window.PhoneGap)
                && isUndefined(window.phonegap) && window.forge !== 'object');
            return window.browserDetails.isWebView;
        }
        return window.browserDetails.isWebView;
    }


    /**
     * Property is to get whether the userAgent is Windows.
     */
    static get isWindows(): Boolean {
        return <Boolean>Browser.getValue('isWindows', REGX_WINDOWS);
    }

    /**
     * Property is to get the touch start event. It returns event name based on browser.
     */
    static get touchStartEvent(): string {
        if (isUndefined(window.browserDetails.touchStartEvent)) {
            return window.browserDetails.touchStartEvent = Browser.getTouchStartEvent();
        }
        return window.browserDetails.touchStartEvent;
    }

    /**
     * Property is to get the touch move event. It returns event name based on browser.
     */
    static get touchMoveEvent(): string {
        if (isUndefined(window.browserDetails.touchMoveEvent)) {
            return window.browserDetails.touchMoveEvent = Browser.getTouchMoveEvent();
        }
        return window.browserDetails.touchMoveEvent;
    }

    /**
     * Property is to get the touch end event. It returns event name based on browser.
     */
    static get touchEndEvent(): string {
        if (isUndefined(window.browserDetails.touchEndEvent)) {
            return window.browserDetails.touchEndEvent = Browser.getTouchEndEvent();
        }
        return window.browserDetails.touchEndEvent;
    }

    /**
     * Property is to cancel the touch end event.
     */
    static get touchCancelEvent(): string {
        if (isUndefined(window.browserDetails.touchCancelEvent)) {
            return window.browserDetails.touchCancelEvent = Browser.getTouchCancelEvent();
        }
        return window.browserDetails.touchCancelEvent;
    }

}

export interface BrowserDetails {
    isAndroid?: Boolean;
    isDevice?: Boolean;
    isIE?: Boolean;
    isIos?: Boolean;
    isIos7?: Boolean;
    isMSPointer?: Boolean;
    isPointer?: Boolean;
    isTouch?: Boolean;
    isWebView?: Boolean;
    isWindows?: Boolean;
    info?: BrowserInfo;
    touchStartEvent?: string;
    touchMoveEvent?: string;
    touchEndEvent?: string;
    touchCancelEvent?: string;
}

export interface BrowserInfo {
    name?: string;
    version?: string;
    culture?: { name?: string, language?: string };
}