/**
 * Browser Spec
 */
import { Browser } from '../src/browser';


let iPhoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
    'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

let windowsPhoneUa: string = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; ' +
    'Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)';

let chromeDesktopUa: string = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';

let firefoxUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0';

let edgeUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';

let ieUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
    'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';

let safariUa: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.5.24 (KHTML, like Gecko)' +
    ' Version/9.1.4 Safari/601.5.24';

let operaUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36 OPR/34.0.2036.50';

let panthomUa: string = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1';

let iosChromeUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) ' +
    'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

let iosWebViewUa: string = 'User-Agent: Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) ' +
    'AppleWebKit/533.17.9 (KHTML, like Gecko) Mobile';

let winRTUa: string = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Trident/6.0)';
// For Code Cover

let curBrowser: Browser = new Browser();

describe('Browser', (): void => {
    describe('Android uA', (): void => {
        Browser.userAgent = androidPhoneUa;
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('chrome');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('30.0.1599.92');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(true);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(true);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('IOS uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = iPhoneUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('safari');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('9.0');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(true);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(true);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('Windows uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = windowsPhoneUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('msie');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('10.0');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(true);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(true);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(true);
        });
    });

    describe('Chrome uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = chromeDesktopUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('chrome');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('50.0.2661.102');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('Opera uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = operaUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('opera');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('34.0.2036.50');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('Firefox uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = firefoxUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('mozilla');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('44.0');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('Edge browser uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = edgeUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('edge');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('12.10240');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(true);
        });
    });

    describe('IOS mobile chrome uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = iosChromeUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('chrome');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('56.0.2924.75');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(true);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(true);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('IOS webview uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = iosWebViewUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('webkit');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('533.17.9');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(true);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(true);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });
    });

    describe('IE browser uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = ieUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('msie');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('11.0');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(true);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(true);
        });
    });

    describe('panthomJS browser uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = panthomUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('phantomjs');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('2.1.1');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });

        it('webview', (): void => {
            expect(Browser.isWebView).toBe(false);
        });
    });

    describe('Safari browser uA', (): void => {
        beforeAll(() => {
            Browser.userAgent = safariUa;
        });
        it('browser name', (): void => {
            expect(Browser.info.name).toBe('safari');
        });
        it('browser version', (): void => {
            expect(Browser.info.version).toBe('9.1.4');
        });
        it('browser culture language', (): void => {
            expect(Browser.info.culture.language).toBe(navigator.language);
        });
        it('isAndroid', (): void => {
            expect(Browser.isAndroid).toBe(false);
        });
        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isIos', (): void => {
            expect(Browser.isIos).toBe(false);
        });
        it('isIos7', (): void => {
            expect(Browser.isIos7).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('isWindows', (): void => {
            expect(Browser.isWindows).toBe(false);
        });

        it('webview', (): void => {
            expect(Browser.isWebView).toBe(false);
        });
    });

    describe('browser without resetting userAgent', (): void => {

        it('browser name', (): void => {
            expect(Browser.info.name).toBe('safari');
        });

        it('isDevice', (): void => {
            expect(Browser.isDevice).toBe(false);
        });
        it('isIE', (): void => {
            expect(Browser.isIE).toBe(false);
        });
        it('isMSPointer', (): void => {
            expect(Browser.isMSPointer).toBe(false);
        });
        it('isPointer', (): void => {
            expect(Browser.isPointer).toBe(false);
        });
        it('isTouch', (): void => {
            expect(Browser.isTouch).toBe('ontouchstart' in window);
        });
        it('browser name', (): void => {
            expect(Browser.touchStartEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchMoveEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchEndEvent).not.toBe('');
        });
    });

    describe('touch event name', (): void => {

        it('browser name', (): void => {
            expect(Browser.touchStartEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchMoveEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchEndEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchCancelEvent).not.toBe('');
        });

    });

    describe('touch event name', (): void => {

        it('browser name', (): void => {
            expect(Browser.touchStartEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchMoveEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchEndEvent).not.toBe('');
        });

        it('browser name', (): void => {
            expect(Browser.touchCancelEvent).not.toBe('');
        });

    });

    describe('webview', (): void => {

        it('false webview', (): void => {
            expect(Browser.isWebView).toBe(false);
        });

        it('simulated webview', (): void => {
            let win: any = window;
            win.browserDetails = {};
            win.phonegap = true;
            expect(Browser.isWebView).toBe(true);
        });

    });
});