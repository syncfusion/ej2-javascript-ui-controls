/**
 * Toolbar renderer spec
 */
import { Browser } from "@syncfusion/ej2-base";
import { renderRTE,dispatchEvent, destroy } from './../render.spec';

describe('Toolbar - Renderer', () => {

    describe('div content ', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'Alignments']
                }
            });
            rteEle = rteObj.element;
        });

        it(' Open the DropDownButton with modal', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            expect(document.querySelector(".e-popup-overlay")).not.toBe(null);
            (document.querySelector(".e-popup-overlay") as HTMLElement).click();
            expect(document.querySelector(".e-popup-overlay")).toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });

    describe('Iframe content ', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Formats', 'Alignments']
                }
            });
            rteEle = rteObj.element;
        });

        it(' Open the DropDownButton with modal', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            expect(document.querySelector(".e-popup-overlay")).not.toBe(null);
            (document.querySelector(".e-popup-overlay") as HTMLElement).click();
            expect(document.querySelector(".e-popup-overlay")).toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });
    describe('Open dropdown button two times', function () {
        let rteObj : any;
        let rteEle : any;
        let mobileUA = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA = navigator.userAgent;
        beforeAll(function () {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'FontColor']
                }
            });
            rteEle = rteObj.element;
        });
        it('Open fontColor dropdown button', function () {
            debugger;
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.firstElementChild as HTMLElement).click();
            dispatchEvent(trgEle.firstElementChild, 'mousedown');
            (document.querySelectorAll('.e-rte-square-palette')[1] as HTMLElement).click();
            expect(document.querySelector(".e-dropdown-popup.e-control.e-popup-close.e-popup-modal")).toBe(null);
        });
        afterAll(function () {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });
});