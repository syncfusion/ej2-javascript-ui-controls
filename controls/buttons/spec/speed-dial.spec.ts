/* eslint-disable @typescript-eslint/no-explicit-any */

import { append, createElement, enableRipple, EventHandler, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { FabPosition } from "../src/floating-action-button/index";
import { SpeedDial, SpeedDialItemModel, SpeedDialAnimationSettingsModel } from "../src/speed-dial/index";
import { SpeedDialItemEventArgs, SpeedDialBeforeOpenCloseEventArgs,SpeedDialOpenCloseEventArgs  } from "../src/speed-dial/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";

describe('Floating Action Button', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    const data: SpeedDialItemModel[] = [
        {
            text: 'Autosum',
            iconCss: 'e-icons e-people',
        },
        {
            text: 'Average',
            iconCss: 'e-icons e-signature'
        },
        {
            text: 'Count numbers',
            disabled: true,
            iconCss: 'e-icons e-print-2'
        },
        {
            text: 'Min',
            iconCss: 'e-icons e-location'
        },
        {
            text: 'Max',
            iconCss: 'e-icons e-cut'
        }
    ];
    const NoAnimation: SpeedDialAnimationSettingsModel = { effect: 'None' };

    describe('SpeedDial button DOM', () => {
        function getCenterPos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientWidth - btnEle.offsetWidth) / 2 + "px";
        }
        function getMiddlePos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientHeight - btnEle.offsetHeight) / 2 + "px";
        }
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });

        it('default classes without target', () => {
            speedDial = new SpeedDial({ enablePersistence: true });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-speed-dial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-speeddial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(true);
        });

        it('default classes with target', () => {
            speedDial = new SpeedDial({ target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-speed-dial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-speeddial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(false);
        });

        it('default classes with target as element', () => {
            speedDial = new SpeedDial({ target: tarEle });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-speed-dial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-speeddial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(false);
            expect(tarEle.querySelector(".e-speeddial") !== null).toEqual(true);
        });

        it('default classes with target as wrong selector', () => {
            speedDial = new SpeedDial({ target: "tarEle" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-speed-dial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-speeddial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(true);
            expect(tarEle.querySelector(".e-speeddial") === null).toEqual(true);
        });

        it('default classes with dynamic target', () => {
            speedDial = new SpeedDial();
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(true);
            speedDial.target = "#speedDialtarget";
            speedDial.dataBind();
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(false);
            speedDial.target = "";
            speedDial.dataBind();
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(true);
        });
        it('content property', () => {
            speedDial = new SpeedDial({ content: "test content" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.innerText.toLowerCase()).toEqual("test content");
            speedDial.content = "speeddialtarget";
            speedDial.dataBind();
            expect(speedDialEle.innerText.toLowerCase()).toEqual("speeddialtarget");
            speedDial.content = "";
            speedDial.dataBind();
            expect(speedDialEle.innerText).toEqual("");
        });
        it('openicon + closeicon', () => {
            speedDial = new SpeedDial({ openIconCss: "open-icon", closeIconCss: "close-icon" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.querySelector(".open-icon") !== null).toBe(true);
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
            speedDial.openIconCss = "";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-icon")).toBeNull;
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
            speedDial.openIconCss = "open-new-icon";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-new-icon")).toBeNull;
        });
        it('only closeicon', () => {
            speedDial = new SpeedDial({ closeIconCss: "close-icon" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
            speedDial.openIconCss = "open-icon";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-icon")).toBeNull;
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
        });
        it('iconPosition', () => {
            speedDial = new SpeedDial({ content: "test", openIconCss: "test-icon", iconPosition: "Left" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.querySelector(".e-icon-right")).toBeNull;
            expect(speedDialEle.querySelector(".e-icon-left") !== null).toBe(true);
            speedDial.iconPosition = "Right";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".e-icon-left")).toBeNull;
            expect(speedDialEle.querySelector(".e-icon-right") !== null).toBe(true);
        });
        it('cssClass', () => {
            speedDial = new SpeedDial({ cssClass: "testClass" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList).toContain("testClass");
            speedDial.cssClass = "newClass";
            speedDial.dataBind();
            expect(speedDialEle.classList).toContain("newClass");
            expect(speedDialEle.classList.contains("testClass")).toBe(false);
        });
        it('visibility', () => {
            speedDial = new SpeedDial({ visible: false });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList).toContain("e-fab-hidden");
            speedDial.visible = true;
            speedDial.dataBind();
            expect(speedDialEle.classList.contains("e-fab-hidden")).toBe(false);
            speedDial.visible = false;
            speedDial.dataBind();
            expect(speedDialEle.classList.contains("e-fab-hidden")).toBe(true);
        });
        it('disabled', () => {
            speedDial = new SpeedDial({ disabled: true });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined(speedDialEle.getAttribute("disabled"))).toBe(false);
            speedDial.disabled = false;
            speedDial.dataBind();
            expect(isNullOrUndefined(speedDialEle.getAttribute("disabled"))).toBe(true);
            speedDial.disabled = true;
            speedDial.dataBind();
            expect(isNullOrUndefined(speedDialEle.getAttribute("disabled"))).toBe(false);
        });
        it('Generic ID generation', () => {
            speedDial = new SpeedDial();
            let speedDialEle1 = createElement('button', {});
            document.body.appendChild(speedDialEle1);
            speedDial.appendTo(speedDialEle1);
            expect(isNullOrUndefined(speedDialEle.id)).toBe(false);
            speedDial.destroy();
            speedDial = undefined;
            remove(speedDialEle1);
        });
        it('default position values remove test TopLeft + BottomRight', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft" });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "BottomRight";
            speedDial.dataBind()
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.destroy();
            speedDial = undefined;
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('RTL Class testing', () => {
            speedDial = new SpeedDial({ target: "#fabtarget", enableRtl: true });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-rtl')).toBe(true);
            speedDial.enableRtl = false;
            speedDial.dataBind();
            expect(speedDialEle.classList.contains('e-rtl')).toBe(false);
        });
        it('default position values RTL test TopLeft + BottomRight', () => {
            speedDial = new SpeedDial({ position: "TopLeft", enableRtl: true });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "BottomRight";
            speedDial.dataBind()
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.enableRtl = false;
            speedDial.dataBind()
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.enableRtl = true;
            speedDial.dataBind()
            speedDial.position = "TopLeft";
            speedDial.dataBind()
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('MiddleCenter + resize', () => {
            speedDial = new SpeedDial({ position: "MiddleCenter", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let leftPos = getCenterPos(speedDialEle, tarEle);
            let middlePos = getMiddlePos(speedDialEle, tarEle);
            expect(speedDialEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(speedDialEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            tarEle.style.width = "600px"
            tarEle.style.height = "600px"
            leftPos = getCenterPos(speedDialEle, tarEle);
            middlePos = getMiddlePos(speedDialEle, tarEle);
            expect(speedDialEle.style.getPropertyValue("--fabHorzDist") !== leftPos).toBe(true);
            expect(speedDialEle.style.getPropertyValue("--fabVertDist") !== middlePos).toBe(true);
            speedDial.refreshPosition();
            expect(speedDialEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(speedDialEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
        });
    });
    describe('SpeedDial DOM', () => {
        function getCenterPos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientWidth - btnEle.offsetWidth) / 2 + "px";
        }
        function getBottom(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return tarEle.clientHeight - btnEle.offsetTop + "px";
        }
        function getRight(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return tarEle.clientWidth - btnEle.offsetLeft - btnEle.offsetWidth + "px"
        }
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });

        it('default classes with target as wrong selector', () => {
            speedDial = new SpeedDial({ target: "tarEle", items: data });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.classList.contains('e-speed-dial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-speeddial')).toEqual(true);
            expect(speedDialEle.classList.contains('e-fab-fixed')).toEqual(true);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-fixed")).toBe(true);
            expect(tarEle.querySelector(".e-speeddial") === null).toEqual(true);
            expect(tarEle.querySelector(".e-speeddial-popup") === null).toEqual(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
        });

        it('speeddial when no item', () => {
            speedDial = new SpeedDial();
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(true);
        });

        it('speeddial with item', () => {
            speedDial = new SpeedDial({ items: data });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
        });

        it('speeddial with popup template', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ popupTemplate: template });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(document.querySelector(".tempContent") === null).toEqual(false);
            let tempContent = '<div class="e-speeddial-template-container">'+ template +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent);            
        });
        it('template as HTMLElement ', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            let tempContent = createElement("div", { id: "fabTemp", className: "tempContent", innerHTML: template });
            document.body.appendChild(tempContent);
            speedDial = new SpeedDial({ popupTemplate: "#fabTemp" });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(document.querySelector(".tempContent") === null).toEqual(false);
            let tempContent1 = '<div class="e-speeddial-template-container">'+ tempContent.outerHTML +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent1); 
            speedDial.popupTemplate = "#fabtemp1";
            speedDial.dataBind();
            let tempContent2 = '<div class="e-speeddial-template-container">'+ '#fabtemp1' +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent2); 
            remove(tempContent);
        });
        it('template as js renderer ', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            let renderer = createElement("script", { id: "fabTemp", innerHTML: template });
            renderer.setAttribute("type", "text/x-jsrender");
            document.body.appendChild(renderer);
            speedDial = new SpeedDial({ popupTemplate: "#fabTemp" });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(document.querySelector(".tempContent") === null).toEqual(false);
            let tempContent = '<div class="e-speeddial-template-container">'+ template +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent); 
            remove(renderer);
        });

        it('speeddial with aria-attributes', () => {
            speedDial = new SpeedDial({ items: data, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") !== null).toEqual(true);
            expect(((speedDial as any).popupEle.querySelector(".e-speeddial-ul") as HTMLElement).getAttribute("role")).toBe("menu");
            expect(speedDialEle.getAttribute("aria-haspopup")).toBe("true")
            expect(speedDialEle.getAttribute("aria-expanded")).toBe("false")
            expect(speedDialEle.getAttribute("aria-controls")).toBe((speedDial as any).popupEle.id)
            expect(((speedDial as any).popupEle.querySelector(".e-speeddial-li") as HTMLElement).getAttribute("role")).toBe("menuitem");
            expect(((speedDial as any).popupEle.querySelector(".e-speeddial-li") as HTMLElement).getAttribute("aria-label")).toBe(data[0].text);
            speedDialEle.click();
            expect(speedDialEle.getAttribute("aria-expanded")).toBe("true")
            speedDialEle.click();
            expect(speedDialEle.getAttribute("aria-expanded")).toBe("false")
            speedDial.destroy();
            expect(isNullOrUndefined(speedDialEle.getAttribute("aria-haspopup"))).toBe(true);
            expect(isNullOrUndefined(speedDialEle.getAttribute("aria-expanded"))).toBe(true);
            expect(isNullOrUndefined(speedDialEle.getAttribute("aria-controls"))).toBe(true);
            speedDial = new SpeedDial({ items: data, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
        });

        it('speeddial with item props', () => {
            let customData: SpeedDialItemModel[] = [
                { text: 'Autosum', iconCss: 'e-icons e-people', },
                { iconCss: 'e-icons e-signature' },
                { text: 'Count numbers', disabled: true, iconCss: 'e-icons e-print-2' },
                { text: 'Min' },
                { text: 'Max', iconCss: 'e-icons e-cut', title: "test-title", id: "id2" }
            ];
            speedDial = new SpeedDial({ items: customData, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[1] as HTMLElement).getAttribute("aria-label")).toBe(null);
            expect(((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[4] as HTMLElement).getAttribute("title")).toBe("test-title");
            expect(((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[4] as HTMLElement).id).toBe("id2");
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[1].querySelector(".e-speeddial-li-text") === null).toBe(true);
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[1].querySelector(".e-speeddial-li-icon") === null).toBe(false);
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[3].querySelector(".e-speeddial-li-text") === null).toBe(false);
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[3].querySelector(".e-speeddial-li-icon") === null).toBe(true);
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-text-li")).toBe(true);
            expect(((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[2] as HTMLElement).classList.contains("e-disabled")).toBe(true);
            expect(((speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[2] as HTMLElement).getAttribute("aria-disabled") !== null).toBe(true);
        });

        it('speeddial with text only items', () => {
            let customData: SpeedDialItemModel[] = [
                { text: 'Autosum' },
                { text: 'Signature' },
                { text: 'Count numbers', disabled: true },
                { text: 'Min' },
                { text: 'Max'}
            ];
            speedDial = new SpeedDial({ items: customData, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect((speedDial as any).popupEle.querySelectorAll(".e-speeddial-text-li").length).toBe(5);
        });

        it('speeddial with itemTemplate', () => {
            let template = '<div class="tempContent">' +
                ' <div class="empimg"> <span class="icon' + ' ' + ' ${iconCss}"> </span> </div>' +
                ' <span class="text">${text}</span></div>'
            speedDial = new SpeedDial({ items: data, itemTemplate: template });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            speedDialEle.click();
            expect((speedDial as any).popupEle.querySelector(".e-speeddial-li-text") === null).toBe(true);
            expect((speedDial as any).popupEle.querySelector(".e-speeddial-li-icon") === null).toBe(true);
            expect((speedDial as any).popupEle.querySelectorAll(".empimg").length).toBe(5);
            expect((speedDial as any).popupEle.querySelectorAll("span.text").length).toBe(5);
        });

        it('default classes without target', () => {
            speedDial = new SpeedDial({ items: data, modal: true });
            speedDial.appendTo('#speedDial');
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-fixed')).toEqual(true);
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-popup')).toEqual(true);
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-hidden')).toEqual(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(document.querySelector(".e-speeddial-overlay") === null).toEqual(false);
            expect(tarEle.querySelector(".e-speeddial-popup") === null).toEqual(true);
            expect(tarEle.querySelector(".e-speeddial-overlay") === null).toEqual(true);
        });

        it('default classes with target', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", modal: true });
            speedDial.appendTo('#speedDial');
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-fixed')).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-popup')).toEqual(true);
            expect((speedDial as any).popupEle.classList.contains('e-speeddial-hidden')).toEqual(true);
            expect(tarEle.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(tarEle.querySelector(".e-speeddial-overlay") === null).toEqual(false);
        });

        it('default classes on different modes + template + opensonhover', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", modal: true, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains('e-speeddial-fixed')).toEqual(false);
            expect(popupEle.classList.contains('e-speeddial-popup')).toEqual(true);
            expect(popupEle.classList.contains('e-speeddial-hidden')).toEqual(true);
            expect(popupEle.classList.contains('e-speeddial-hover-open')).toEqual(true);
            expect(popupEle.classList.contains('e-speeddial-linear')).toEqual(true);
            expect(popupEle.classList.contains('e-speeddial-radial')).toEqual(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toEqual(false);
            speedDial.mode = "Radial";
            speedDial.dataBind();
            expect(popupEle.classList.contains('e-speeddial-linear')).toEqual(false);
            expect(popupEle.classList.contains('e-speeddial-radial')).toEqual(true);
            expect(popupEle.classList.contains("e-speeddial-template")).toEqual(false);
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial.popupTemplate = template;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-template")).toEqual(true);
            expect(popupEle.classList.contains("e-speeddial-radial")).toEqual(false);
            expect(popupEle.classList.contains("e-speeddial-linear")).toEqual(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains('e-speeddial-hover-open')).toEqual(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains('e-speeddial-hover-open')).toEqual(true);
        });

        it('cssClass', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", cssClass: "testClass", modal: true });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("testClass");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("testClass");
            speedDial.cssClass = "NewClass";
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("NewClass");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("NewClass");
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("testClass")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("testClass")).toBe(false);
            speedDial.cssClass = "";
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("NewClass")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("NewClass")).toBe(false);
            speedDial.modal = false;
            speedDial.dataBind();
            speedDial.cssClass = "TestClass";
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("TestClass")).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-overlay")).toBe(null);
        });

        it('openicon + closeicon with speedial', () => {
            speedDial = new SpeedDial({ items: data, openIconCss: "open-icon", target: "#speedDialtarget", closeIconCss: "close-icon", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(speedDialEle.querySelector(".open-icon") !== null).toBe(true);
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
            /**open */
            speedDialEle.click();
            expect(speedDialEle.querySelector(".close-icon") !== null).toBe(true);
            expect(speedDialEle.querySelector(".open-icon")).toBeNull;
            /**close */
            speedDialEle.click();
            speedDial.openIconCss = "";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-icon")).toBeNull;
            expect(speedDialEle.querySelector(".close-icon")).toBeNull;
            speedDial.closeIconCss = "close-icon-1";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-icon")).toBeNull;
            expect(speedDialEle.querySelector(".close-icon-1")).toBeNull;
            /**open */
            speedDialEle.click();
            expect(speedDialEle.querySelector(".close-icon-1") !== null).toBe(true);
            speedDial.closeIconCss = "close-new-icon";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".close-new-icon") !== null).toBe(true);
            speedDial.openIconCss = "open-new-icon";
            speedDial.dataBind();
            expect(speedDialEle.querySelector(".open-new-icon")).toBeNull;
        });
        it('open action without overlay', () => {
            speedDial = new SpeedDial({ items: data, cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay")).toBeNull;
            speedDialEle.click();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay")).toBeNull;
            speedDial.modal = true;
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-overlay") !== null).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            speedDialEle.click();
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(true);
        });
        it('open action with overlay', () => {
            speedDial = new SpeedDial({ items: data, cssClass: "testClass", target: "#speedDialtarget", modal: true, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            speedDialEle.click();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
            speedDial.modal = false;
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-overlay")).toBeNull;
        });

        it('default position values remove test TopLeft + BottomRight for Speedial', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.position = "BottomRight";
            speedDial.dataBind()
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('RTL Class testing', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", modal: true, enableRtl: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains('e-rtl')).toBe(true);
            expect(speedDialEle.classList.contains('e-rtl')).toBe(true);
            speedDial.enableRtl = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains('e-rtl')).toBe(false);
            expect(speedDialEle.classList.contains('e-rtl')).toBe(false);
        });
        it('default position values RTL test TopLeft + BottomRight  for Speedial', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", enableRtl: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.position = "BottomRight";
            speedDial.dataBind()
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.enableRtl = false;
            speedDial.dataBind()
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.enableRtl = true;
            speedDial.dataBind()
            speedDial.position = "TopLeft";
            speedDial.dataBind()
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
        });

        it('target Change without overlay', () => {
            speedDial = new SpeedDial({ items: data });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup") === null).toBe(true);
            expect(document.querySelector(".e-speeddial-popup") !== null).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-overlay") === null).toBe(true);
            speedDial.target = "#speedDialtarget";
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup") !== null).toBe(true);
        });

        it('target Change with overlay', () => {
            speedDial = new SpeedDial({ items: data, modal: true });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-overlay") === null).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-popup") === null).toBe(true);
            expect(document.querySelector(".e-speeddial-popup") !== null).toBe(true);
            expect(document.querySelector(".e-speeddial-overlay") !== null).toBe(true);
            speedDial.target = "#speedDialtarget";
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup") !== null).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-overlay") !== null).toBe(true);
        });
        it('dynamic data', () => {
            speedDial = new SpeedDial({ cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup")).toBeNull;
            speedDial.modal = true;
            speedDial.dataBind();
            speedDial.items = [{ text: "test" }];
            speedDial.dataBind();
            expect(tarEle.querySelector(".e-speeddial-popup") !== null).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            speedDial.show();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelectorAll(".e-speeddial-li").length).toBe(1);
            speedDial.items = data;
            speedDial.dataBind();
            expect(tarEle.querySelectorAll(".e-speeddial-li").length).toBe(5);
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
        });

        it('speeddial with popup template and dyanmic properties', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ target: "#speedDialtarget", popupTemplate: template, position: "BottomCenter" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(isNullOrUndefined(popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect(document.querySelector(".tempContent") === null).toEqual(false);
            let tempContent = '<div class="e-speeddial-template-container">'+ template +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent); 
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            let HorzDist = getCenterPos(popupEle, tarEle)
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            speedDial.direction = "Left";
            speedDial.itemTemplate = '<span class="tempContent">Hello World! ${text} </span>';
            speedDial.popupTemplate = '<span class="tempContent">Hello Syncfusion!</span>';
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            HorzDist = getCenterPos(popupEle, tarEle)
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            let tempContent1 = '<div class="e-speeddial-template-container">'+ '<span class="tempContent">Hello Syncfusion!</span>' +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent1); 
            speedDial.enableRtl = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            HorzDist = getCenterPos(popupEle, tarEle)
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
        });

        it('speeddial with dyanmic popup Template', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ target: "#speedDialtarget", items: data });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-linear")).toBe(true);
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            let HorzDist = getRight(speedDialEle, tarEle)
            let vertDist = getBottom(speedDialEle, tarEle)
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.querySelectorAll(".e-speeddial-li").length).toBe(5);
            speedDial.popupTemplate = template;
            speedDial.dataBind();
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(popupEle.querySelectorAll(".e-speeddial-li").length).toBe(0);
            HorzDist = speedDialEle.style.getPropertyValue("--fabHorzDist")
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            let tempContent = '<div class="e-speeddial-template-container">'+ template +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent); 
            speedDial.popupTemplate = '';
            speedDial.dataBind();
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-linear")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            HorzDist = getRight(speedDialEle, tarEle)
            vertDist = getBottom(speedDialEle, tarEle)
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.querySelectorAll(".e-speeddial-li").length).toBe(5);
        });

        it('Empty speeddial dyanmic data', () => {
            speedDial = new SpeedDial({ target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(true);
            speedDial.items = data;
            speedDial.dataBind();
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-linear")).toBe(true);
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            let HorzDist = getRight(speedDialEle, tarEle)
            let vertDist = getBottom(speedDialEle, tarEle)
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.querySelectorAll(".e-speeddial-li").length).toBe(5);
        });

        it('Empty speeddial dyanmic template', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(true);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(true);
            speedDial.popupTemplate = template;
            speedDial.dataBind();
            expect(isNullOrUndefined((speedDial as any).popupEle)).toEqual(false);
            expect(document.querySelector(".e-speeddial-popup") === null).toEqual(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect((speedDial as any).popupEle.classList.contains("e-speeddial-template")).toBe(true);
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            let HorzDist = speedDialEle.style.getPropertyValue("--fabHorzDist")
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            let tempContent = '<div class="e-speeddial-template-container">'+ template +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent); 
        });
    });
    describe('Methods and Events', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
        });
        afterAll(() => {
            remove(speedDialEle);
            remove(tarEle);
        })
        it('open/hide with method', () => {
            speedDial = new SpeedDial({ items: data, cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            speedDial.show();
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            speedDial.hide();
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
        });
        it('open/hide with method with popuptemplate', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ popupTemplate: template, cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList).toContain("e-speeddial-hidden");
            expect(speedDialEle.classList.contains("e-fab-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            speedDial.show();
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe('1');
            expect(speedDialEle.classList).toContain("e-fab-hidden");
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            speedDial.hide();
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(speedDialEle.classList.contains("e-fab-hidden")).toBe(false);
        });
        it('close on overlay click', () => {
            speedDial = new SpeedDial({ items: data, cssClass: "testClass", target: "#speedDialtarget", modal: true, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            speedDialEle.click();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
            (tarEle.querySelector(".e-speeddial-overlay") as HTMLElement).click();
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
        });
        it('close on click outside', () => {
            speedDial = new SpeedDial({ items: data, cssClass: "testClass", target: "#speedDialtarget", modal: true, animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            speedDialEle.click();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
            let testEle:HTMLElement = createElement('button', { id: 'testEle' });
            document.body.appendChild(testEle);
            let event: Event = new MouseEvent("click",{cancelable:true, view: window, bubbles:true});          
            testEle.dispatchEvent(event);
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            remove(testEle);
        });
        it('open/hide method without popup', () => {
            speedDial = new SpeedDial({ cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            /* Error Should not br thrown on calling this method, by default, throwing will break the test case and hence to expect statement added here*/
            speedDial.show();
            speedDial.hide();
            speedDial.items = data;
            speedDial.dataBind()
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            speedDial.show();
            expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
            speedDial.hide();
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
        });
        it('All events', () => {
            let isbeforeOpenCalled = false;
            let isbeforecloseCalled = false;
            let isOpenCalled = false;
            let iscloseCalled = false;
            let iscreatedCalled = false;
            let itemRenderCount = 0;
            let selectCount = 0;
            let isselectcalled = false;
            speedDial = new SpeedDial({
                items: data,
                beforeOpen: () => { isbeforeOpenCalled = true; },
                created: () => { iscreatedCalled = true; },
                beforeClose: () => { isbeforecloseCalled = true; },
                beforeItemRender: () => { itemRenderCount++; },
                onOpen: () => { isOpenCalled = true; },
                onClose: () => { iscloseCalled = true; },
                clicked: () => { isselectcalled = true; selectCount++ },
                animation: NoAnimation
            });
            speedDial.appendTo('#speedDial');
            speedDialEle.click();
            (speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[0].click();
            (speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[1].click();
            (speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[2].click();
            (speedDial as any).popupEle.querySelectorAll(".e-speeddial-li")[3].click();
            speedDialEle.click();
            expect(iscreatedCalled).toBe(true);
            expect(isbeforeOpenCalled).toBe(true);
            expect(isbeforecloseCalled).toBe(true);
            expect(itemRenderCount).toBe(5);
            expect(isOpenCalled).toBe(true);
            expect(iscloseCalled).toBe(true);
            expect(isselectcalled).toBe(true);
            expect(selectCount).toBe(3);
        });
        it('beforeItemRender Properties', () => {
            let itemRenderCount = 0
            speedDial = new SpeedDial({
                items: data, target: "#speedDialtarget", animation: NoAnimation,
                beforeItemRender: (e: SpeedDialItemEventArgs) => {
                    expect(e.item.text).toBe(data[itemRenderCount].text);
                    e.element.classList.add("changedLI");
                    itemRenderCount++;
                },
            });
            speedDial.appendTo('#speedDial');
            speedDialEle.click();
            expect(itemRenderCount).toBe(5);
            expect(document.querySelectorAll(".changedLI").length).toBe(5);
        });
        it('select Properties', () => {
            let isClicked = false;
            speedDial = new SpeedDial({
                items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation,
                clicked: (e: SpeedDialItemEventArgs) => {
                    isClicked = true;
                    expect(e.item.text).toBe(data[0].text);
                }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            speedDialEle.click();
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            popupEle.querySelector(".e-speeddial-li").click();
            expect(isClicked).toBe(true);
        });
        it('beforeOpen and open Properties', () => {
            let isCancel = true;
            let isbeforeOpenCalled = false;
            let isOpenCalled = false;
            speedDial = new SpeedDial({
                items: data, target: "#speedDialtarget",
                beforeOpen: (e: SpeedDialBeforeOpenCloseEventArgs) => {
                    isbeforeOpenCalled = true;
                    e.cancel = isCancel;
                    if (isCancel) return;
                    e.element.classList.add("changedInEvent")
                },
                onOpen: (e: SpeedDialOpenCloseEventArgs) => {
                    isOpenCalled = true;
                    expect(document.querySelectorAll(".changedInEvent").length).toBe(1);
                    expect(e.element.classList.contains("changedInEvent")).toBe(true);
                    expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
                },
                animation: NoAnimation
            });
            speedDial.appendTo('#speedDial');
            speedDialEle.click();
            let popupEle = (speedDial as any).popupEle;
            expect(isbeforeOpenCalled).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            isCancel = false;
            speedDialEle.click();
            expect(isOpenCalled).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
        });
        it('beforeClose and close Properties', () => {
            let isCancel = true;
            let isbeforeCloseCalled = false;
            let isCloseCalled = false;
            speedDial = new SpeedDial({
                items: data, target: "#speedDialtarget",
                beforeClose: (e: SpeedDialBeforeOpenCloseEventArgs) => {
                    isbeforeCloseCalled = true;
                    e.cancel = isCancel;
                    if (isCancel) return;
                    expect(document.querySelectorAll(".changedInEvent").length).toBe(1);
                    e.element.classList.remove("changedInEvent")
                },
                beforeOpen: (e: SpeedDialBeforeOpenCloseEventArgs) => {
                    e.element.classList.add("changedInEvent")
                },
                onClose: (e: SpeedDialOpenCloseEventArgs) => {
                    isCloseCalled = true;
                    expect(document.querySelectorAll(".changedInEvent").length).toBe(0);
                    expect(e.element.classList.contains("changedInEvent")).toBe(false);
                    expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
                },
                animation: NoAnimation
            });
            speedDial.appendTo('#speedDial');
            speedDialEle.click();
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            speedDialEle.click();
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            expect(isbeforeCloseCalled).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            isCancel = false;
            speedDialEle.click();
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            expect(isCloseCalled).toBe(true);
        });
    });
    describe('mouse events Navigation', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let mouseEventArs: any;

        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);

            mouseEventArs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
            };
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
        });
        afterAll(() => {
            remove(speedDialEle);
            remove(tarEle);
        });
        it('Mouse Click', () => {
            let isClicked = false;
            speedDial = new SpeedDial({
                items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation,
                clicked: (e: SpeedDialItemEventArgs) => {
                    isClicked = true;
                    expect(e.item.text).toBe(data[0].text);
                }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            EventHandler.trigger(speedDialEle, "click");
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            let li = popupEle.querySelector(".e-speeddial-li");
            mouseEventArs.target = li;
            EventHandler.trigger(li, "click", mouseEventArs);
            expect(isClicked).toBe(true);
        });
        it('open on hover', () => {
            let isClicked = false;
            speedDial = new SpeedDial({
                items: data, position: "TopLeft", openIconCss: "open-icon", modal: true, opensOnHover: true, target: "#speedDialtarget", animation: NoAnimation,
                clicked: (e: SpeedDialItemEventArgs) => {
                    isClicked = true;
                    expect(e.item.text).toBe(data[0].text);
                }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            mouseEventArs.target = speedDialEle;
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            let li = popupEle.querySelector(".e-speeddial-li");
            mouseEventArs.relatedTarget = popupEle;
            EventHandler.trigger(speedDialEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = speedDialEle;
            EventHandler.trigger(popupEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = speedDialEle.querySelector(".open-icon");
            EventHandler.trigger(popupEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = li;
            EventHandler.trigger(speedDialEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.target = li;
            EventHandler.trigger(li, "click", mouseEventArs);
            expect(isClicked).toBe(true);
            mouseEventArs.relatedTarget = (speedDial as any).overlayEle;
            EventHandler.trigger(speedDialEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            mouseEventArs.target = speedDialEle;
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = (speedDial as any).overlayEle;
            EventHandler.trigger(speedDialEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
        });
        it('open on hover dynamic', () => {
            speedDial = new SpeedDial({
                items: data, position: "TopLeft", modal: true, target: "#speedDialtarget", animation: NoAnimation
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            mouseEventArs.target = speedDialEle;
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = (speedDial as any).overlayEle;
            EventHandler.trigger(speedDialEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            mouseEventArs.target = speedDialEle;
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            mouseEventArs.relatedTarget = (speedDial as any).overlayEle;
            EventHandler.trigger(popupEle, "mouseleave", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            mouseEventArs.target = speedDialEle;
            EventHandler.trigger(speedDialEle, "mouseover", mouseEventArs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
        });
    });
    describe('Keyboard Actions', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let keyboardEventArgs: any;

        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);

            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: speedDialEle,
                stopImmediatePropagation: (): void => { },
            };
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
        });
        afterAll(() => {
            remove(speedDialEle);
            remove(tarEle);
        });
        it('Enter Key', () => {
            let isClicked = false;
            speedDial = new SpeedDial({
                items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation,
                clicked: (e: SpeedDialItemEventArgs) => {
                    isClicked = true;
                    expect(e.item.text).toBe(data[0].text);
                }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(isClicked).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
        });
        it('esc Key', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'esc';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
        });
        it('esc Key with popuptemplate', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ popupTemplate: template, cssClass: "testClass", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe('1');
            keyboardEventArgs.action = 'esc';
            (speedDial as any).popupKeyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            expect(tarEle.querySelector(".e-speeddial-popup").getAttribute('tabindex')).toBe(null);
        });

        it('home,end,arrows + popuptemplate', () => {
            let template = '<span class="tempContent">Hello World!</span>';
            speedDial = new SpeedDial({ popupTemplate: template, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelector(".e-speeddial-li-active")).toBe(null);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'moveUp';
            expect(popupEle.querySelector(".e-speeddial-li-active")).toBe(null);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'moveDown';
            expect(popupEle.querySelector(".e-speeddial-li-active")).toBe(null);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'moveLeft';
            expect(popupEle.querySelector(".e-speeddial-li-active")).toBe(null);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelector(".e-speeddial-li-active")).toBe(null);
        });
        it('end + home keys', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the last li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            speedDial.hide();
            let disabledData: SpeedDialItemModel[] = [
                { text: 'Autosum', iconCss: 'e-icons e-people', disabled: true, },
                { text: 'Average', iconCss: 'e-icons e-signature' },
                { text: 'Count numbers', disabled: true, iconCss: 'e-icons e-print-2' },
                { text: 'Min', iconCss: 'e-icons e-location' },
                { text: 'Max', disabled: true, iconCss: 'e-icons e-cut' }
            ];
            speedDial.items = disabledData;
            speedDial.dataBind();
            speedDial.show();
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            speedDial.hide();
            let AlldisabledData: SpeedDialItemModel[] = [
                { text: 'Autosum', iconCss: 'e-icons e-people', disabled: true, },
                { text: 'Average', iconCss: 'e-icons e-signature', disabled: true },
                { text: 'Count numbers', disabled: true, iconCss: 'e-icons e-print-2' },
                { text: 'Min', iconCss: 'e-icons e-location', disabled: true },
                { text: 'Max', disabled: true, iconCss: 'e-icons e-cut' }
            ];
            speedDial.items = AlldisabledData;
            speedDial.dataBind();
            speedDial.show();
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length === 0).toBe(true);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length === 0).toBe(true);
        });
    });
    describe('Keyboard Navigation + Linear', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let keyboardEventArgs: any;

        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);

            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: speedDialEle,
                stopImmediatePropagation: (): void => { },
            };
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
        });
        afterAll(() => {
            remove(speedDialEle);
            remove(tarEle);
        });

        it('uparrow key + topLeft', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the last li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
        });
        it('uparrow key + bottomright', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('rightarrow key + TopCenter + right', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter", direction: "Right", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('rightarrow key + TopCenter + left', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter", direction: "Left", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the last li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
        });
        it('downarrow key + topLeft', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('downarrow key + bottomright', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the last li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
        });
        it('left key + TopCenter + right', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter", direction: "Right", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'end';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the last li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
        });
        it('leftArrow key + TopCenter + left', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter", direction: "Left", target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            /*skipping the disabled element */
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[3].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[4].classList.contains("e-speeddial-li-active")).toBe(true);
        });

        it('keyboard navigation test for blinking effect + bottomright', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", animation: NoAnimation });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'home';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            /*checking the first li element */
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
       });
    });
    describe('Keyboard Navigation + Radial', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let keyboardEventArgs: any;
        const radData: SpeedDialItemModel[] = [
            {
                text: 'Autosum',
                iconCss: 'e-icons e-people',
            },
            {
                text: 'Average',
                iconCss: 'e-icons e-signature'
            },
            {
                text: 'Count numbers',
                iconCss: 'e-icons e-print-2'
            },
            {
                text: 'Min',
                iconCss: 'e-icons e-location'
            },
            {
                text: 'Max',
                iconCss: 'e-icons e-cut'
            }
        ];

        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);

            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: speedDialEle,
                stopImmediatePropagation: (): void => { },
            };
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
        });
        afterAll(() => {
            remove(speedDialEle);
            remove(tarEle);
        });
        it('TopLeft + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopLeft + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopLeft + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopCenter + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopCenter + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopCenter + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopRight + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopRight + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('TopRight + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "TopRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleLeft + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleLeft + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleLeft + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleCenter + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleCenter + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleCenter + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleRight + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleRight + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('MiddleRight + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "MiddleRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomLeft + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomLeft + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomLeft + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomLeft", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomCenter + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomCenter + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomCenter + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomCenter", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomRight + Clockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Clockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomRight + AntiClockwise', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "AntiClockwise" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
        it('BottomRight + Auto', () => {
            speedDial = new SpeedDial({
                items: radData, position: "BottomRight", mode: "Radial", target: "#speedDialtarget",
                animation: NoAnimation, radialSettings: { direction: "Auto" }
            });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle;
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(true);
            keyboardEventArgs.action = 'enter';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.classList.contains("e-speeddial-hidden")).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(false);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll("e-speeddial-li-active").length).toBe(0);
            keyboardEventArgs.action = 'moveRight';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[0].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[2].classList.contains("e-speeddial-li-active")).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            (speedDial as any).keyActionHandler(keyboardEventArgs);
            expect(popupEle.querySelectorAll(".e-speeddial-li")[1].classList.contains("e-speeddial-li-active")).toBe(true);
        });
    });

    describe('position and direction', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement

        function getTop(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return btnEle.offsetTop + (isVertical ? btnEle.offsetHeight : 0) + "px";
        }
        function getBottom(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return tarEle.clientHeight - btnEle.offsetTop - (isVertical ? 0 : btnEle.offsetHeight) + "px";
        }
        function getLeft(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return btnEle.offsetLeft + (isVertical ? 0 : btnEle.offsetWidth) + "px";
        }
        function getRight(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return tarEle.clientWidth - btnEle.offsetLeft - (isVertical ? btnEle.offsetWidth : 0) + "px"
        }
        function getWinTop(btnEle: HTMLElement, isVertical: boolean = true): string {
            return btnEle.offsetTop + (isVertical ? btnEle.offsetHeight : 0) + "px";
        }
        function getWinBottom(btnEle: HTMLElement, isVertical: boolean = true): string {
            return window.innerHeight - btnEle.offsetTop - (isVertical ? 0 : btnEle.offsetHeight) + "px";
        }
        function getWinLeft(btnEle: HTMLElement, isVertical: boolean = true): string {
            return btnEle.offsetLeft + (isVertical ? 0 : btnEle.offsetWidth) + "px";
        }
        function getWinRight(btnEle: HTMLElement, isVertical: boolean = true): string {
            return window.innerWidth - btnEle.offsetLeft - (isVertical ? btnEle.offsetWidth : 0) + "px"
        }
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })


        it('MiddleCenter + resize', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleCenter", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let leftPos = getLeft(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(leftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            tarEle.style.width = "600px"
            tarEle.style.height = "600px"
            speedDial.refreshPosition();
            leftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(leftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
        });

        it('default Direction + position', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(speedDial.position).toEqual("BottomRight");
            expect(speedDial.direction).toEqual("Auto");
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });

        it('All Direction + TopLeft', () => {
            speedDial = new SpeedDial({ items: data, position: "TopLeft", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("TopLeft");
            expect(speedDial.direction).toEqual("Auto");
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.classList.contains("e-speeddial-horz-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-horz-top")).toBe(true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.classList.contains("e-speeddial-horz-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-horz-left")).toBe(false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
        });
        it('All Direction + TopCenter', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(speedDial.position).toEqual("TopCenter");
            expect(speedDial.direction).toEqual("Auto");
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);;
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
        });
        it('All Direction + TopCenter without target', () => {
            speedDial = new SpeedDial({ items: data, position: "TopCenter" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getWinLeft(speedDialEle, true);
            let TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, false);
            TopPos = getWinTop(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getWinRight(speedDialEle, false);
            TopPos = getWinTop(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
        });

        it('All Direction + TopRight', () => {
            speedDial = new SpeedDial({ items: data, position: "TopRight", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("TopRight");
            expect(speedDial.direction).toEqual("Auto");
            let RightPos = getRight(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-vert-right")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Down";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.classList.contains("e-speeddial-vert-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-horz-top")).toBe(false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.classList.contains("e-speeddial-vert-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-horz-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-horz-top")).toBe(true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Up";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.classList.contains("e-speeddial-horz-right")).toBe(false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
        });
        it('All Direction + MiddleLeft', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleLeft", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("MiddleLeft");
            expect(speedDial.direction).toEqual("Auto");
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            let TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('All Direction + MiddleLeft without target', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getWinLeft(speedDialEle, true);
            let BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, false);
            let TopPos = getWinTop(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Left";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
        });
        it('All Direction + MiddleCenter', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleCenter", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(speedDial.position).toEqual("MiddleCenter");
            expect(speedDial.direction).toEqual("Auto");
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            let TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('All Direction + MiddleCenter without target', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleCenter" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getWinLeft(speedDialEle, true);
            let BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, false);
            let TopPos = getWinTop(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getWinRight(speedDialEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Up";
            speedDial.dataBind();
            TopPos = getWinTop(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
        });
        it('All Direction + MiddleRight', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleRight", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("MiddleRight");
            expect(speedDial.direction).toEqual("Auto");
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Down";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Left";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.direction = "Up";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('All Direction + MiddleRight without Target', () => {
            speedDial = new SpeedDial({ items: data, position: "MiddleRight" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let RightPos = getWinRight(speedDialEle, true);
            let BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Right";
            speedDial.dataBind();
            RightPos = getWinRight(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Down";
            speedDial.dataBind();
            RightPos = getWinRight(speedDialEle, true);
            let TopPos = getWinTop(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Left";
            speedDial.dataBind();
            RightPos = getWinRight(speedDialEle, false);
            TopPos = getWinTop(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            speedDial.direction = "Up";
            speedDial.dataBind();
            RightPos = getWinRight(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
        });

        it('All Direction + BottomLeft', () => {
            speedDial = new SpeedDial({ items: data, position: "BottomLeft", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("BottomLeft");
            expect(speedDial.direction).toEqual("Auto");
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            BottomPos = getBottom(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Left";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('All Direction + BottomCenter', () => {
            speedDial = new SpeedDial({ items: data, position: "BottomCenter", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            expect(speedDial.position).toEqual("BottomCenter");
            expect(speedDial.direction).toEqual("Auto");
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            BottomPos = getBottom(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, false);
            BottomPos = getBottom(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('All Direction + BottomCenter without target', () => {
            speedDial = new SpeedDial({ items: data, position: "BottomCenter" });
            speedDial.appendTo('#speedDial');
            expect(speedDial.position).toEqual("BottomCenter");
            expect(speedDial.direction).toEqual("Auto");
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getWinLeft(speedDialEle, true);
            let BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Right";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, false);
            BottomPos = getWinBottom(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Down";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Left";
            speedDial.dataBind();
            let RightPos = getWinRight(speedDialEle, false);
            BottomPos = getWinBottom(speedDialEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            speedDial.direction = "Up";
            speedDial.dataBind();
            LeftPos = getWinLeft(speedDialEle, true);
            BottomPos = getWinBottom(speedDialEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
        });

        it('All Direction + BottomRight', () => {
            speedDial = new SpeedDial({ items: data, position: "BottomRight", target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("BottomRight");
            expect(speedDial.direction).toEqual("Auto");
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-vert-bottom")).toBe(true);
            speedDial.direction = "Right";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-vert-bottom")).toBe(true);
            speedDial.direction = "Down";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-vert-bottom")).toBe(true);
            speedDial.direction = "Left";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, false);
            BottomPos = getBottom(speedDialEle, tarEle, false);
            expect(popupEle.classList.contains("e-speeddial-vert-bottom")).toBe(false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.direction = "Up";
            speedDial.dataBind();
            RightPos = getRight(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.classList.contains("e-speeddial-vert-bottom")).toBe(true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('position Change Bottom ', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual("BottomRight");
            expect(speedDial.direction).toEqual("Auto");
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomCenter";
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomLeft";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('position Change Middle', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position: "BottomLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            speedDial.position = "MiddleRight";
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleCenter";
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleLeft";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('position Change Default + Top', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position: "MiddleLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            speedDial.position = "TopRight";
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopCenter";
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopLeft";
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('position Change Bottom with position as enum', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position:FabPosition.BottomRight });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(speedDial.position).toEqual(FabPosition.BottomRight);
            expect(speedDial.direction).toEqual("Auto");
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = FabPosition.BottomCenter;
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = FabPosition.BottomLeft;
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('position Change Middle', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position: FabPosition.BottomLeft });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            speedDial.position = FabPosition.MiddleRight;
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, true);
            let BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.MiddleCenter;
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.MiddleLeft;
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            BottomPos = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(BottomPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('position Change Default + Top', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position: FabPosition.MiddleLeft });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            speedDial.position = FabPosition.TopRight;
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, true);
            let TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.TopCenter;
            speedDial.dataBind();
            let LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.TopLeft;
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, true);
            TopPos = getTop(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('position Values with RTL', () => {
            speedDial = new SpeedDial({ items: data, target: "#speedDialtarget", position: "TopCenter", direction: "Right" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let LeftPos = getLeft(speedDialEle, tarEle, false);
            let TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.enableRtl = true;
            speedDial.dataBind();
            let RightPos = getRight(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(RightPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            speedDial.enableRtl = false;
            speedDial.dataBind();
            LeftPos = getLeft(speedDialEle, tarEle, false);
            TopPos = getTop(speedDialEle, tarEle, false);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(LeftPos);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(TopPos);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
        });
    });

    describe('PopupTemplate position', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tempEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement

        function getCenterPos(ele: HTMLElement): string {
            return (window.innerWidth - ele.offsetWidth) / 2 + "px";
        }
        function getMiddlePos(ele: HTMLElement): string {
            return (window.innerHeight - ele.offsetHeight) / 2 + "px";
        }
        function getTarCenterPos(tarEle: HTMLElement, ele: HTMLElement): string {
            return (tarEle.clientWidth - ele.offsetWidth) / 2 + "px";
        }
        function getTarMiddlePos(tarEle: HTMLElement, ele: HTMLElement): string {
            return (tarEle.clientHeight - ele.offsetHeight) / 2 + "px";
        }
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;} .tempClass{display:none;} .e-speeddial-popup .tempClass{display:block;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tempEle = createElement('div', {
                id: 'speedDialPopupTemp', className: "tempClass",
                styles: "border:2px solid greenYellow; height:200px; width:150px",
                innerHTML: "<span styles='font-size:20px; text-align:center;'>Hello <br/> World!!</span>"
            });
            document.body.appendChild(tempEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tempEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })

        it('popupTemplate + Top', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "TopLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('popupTemplate + Top with position as enum', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: FabPosition.TopLeft });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.TopCenter;
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.TopRight;
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });


        it('popupTemplate + Top +Target', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "TopLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('popupTemplate + Middle', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "MiddleLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle)
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('popupTemplate + Middle with position as enum', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: FabPosition.MiddleLeft });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.MiddleCenter;
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle)
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = FabPosition.MiddleRight;
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('popupTemplate + Middle +Target', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "MiddleLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle)
            vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('popupTemplate + Bottom', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "BottomLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });
        it('popupTemplate + Bottom with position as enum', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: FabPosition.BottomLeft });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = FabPosition.BottomCenter;
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = FabPosition.BottomRight;
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('popupTemplate + Bottom +Target', () => {
            speedDial = new SpeedDial({ popupTemplate: "#speedDialPopupTemp", position: "BottomLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });
    });
    describe('Radial Mode Popup position', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement

        function getCenterPos(ele: HTMLElement): string {
            return (window.innerWidth - ele.offsetWidth) / 2 + "px";
        }
        function getMiddlePos(ele: HTMLElement): string {
            return (window.innerHeight - ele.offsetHeight) / 2 + "px";
        }
        function getTarCenterPos(tarEle: HTMLElement, ele: HTMLElement): string {
            return (tarEle.clientWidth - ele.offsetWidth) / 2 + "px";
        }
        function getTarMiddlePos(tarEle: HTMLElement, ele: HTMLElement): string {
            return (tarEle.clientHeight - ele.offsetHeight) / 2 + "px";
        }
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })

        it('RadialMode + Top', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "TopLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('RadialMode + Top +Target', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "TopLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "TopRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('RadialMode + Middle', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle)
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = getMiddlePos(popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('RadialMode + Middle +Target', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle)
            vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
            speedDial.position = "MiddleRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = getTarMiddlePos(tarEle, popupEle);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('RadialMode + Bottom', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "BottomLeft" });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomCenter";
            speedDial.dataBind();
            horzDist = getCenterPos(popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('RadialMode + Bottom +Target', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "BottomLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            let horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            let vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomCenter";
            speedDial.dataBind();
            horzDist = getTarCenterPos(tarEle, popupEle);
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
            speedDial.position = "BottomRight";
            speedDial.dataBind();
            horzDist = speedDialEle.style.getPropertyValue("--fabHorzDist");
            vertDist = speedDialEle.style.getPropertyValue("--fabVertDist")
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(horzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(vertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-left")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-top")).toBe(false);
            expect(speedDialEle.classList.contains("e-fab-right")).toBe(true);
            expect(speedDialEle.classList.contains("e-fab-bottom")).toBe(true);
        });
    });
    describe('Radial Mode items position', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement
        const data1: SpeedDialItemModel[] = [
            {
                text: 'Autosum',
                iconCss: 'e-icons e-people',
            },
            {
                text: 'Average',
                iconCss: 'e-icons e-signature'
            },
            {
                text: 'Min',
                iconCss: 'e-icons e-location'
            },
            {
                text: 'Max',
                iconCss: 'e-icons e-cut'
            }
        ];

        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })

        it('RadialMode + TopLeft', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "TopLeft", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 - (30 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
        });

        it('RadialMode + TopLeft + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "TopLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            speedDial.radialSettings = { startAngle: 30, endAngle: 60, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(60 - (10 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(30 + (10 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: 270, endAngle: 130, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: 90, endAngle: 360, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 - (30 * index) + "deg");
            }
        });

        it('RadialMode + TopCenter', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "TopCenter", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 - (45 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
        });

        it('RadialMode + TopCenter + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "TopCenter", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            speedDial.radialSettings = { startAngle: 50, endAngle: 150, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(150 - (25 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(50 + (25 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (45 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: 270, endAngle: 190, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (45 * index) + "deg");
            }
        });

        it('RadialMode + TopRight', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "TopRight", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
        });
        it('RadialMode + TopRight + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "TopRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            speedDial.radialSettings = { startAngle: 120, endAngle: 150, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(150 - (10 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(120 + (10 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: 270, endAngle: 30, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (30 * index) + "deg");
            }
        });

        it('RadialMode + MiddleLeft', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleLeft", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(true);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(((450 - (45 * index)) % 360) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("270deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
        });
        it('RadialMode + MiddleLeft + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            speedDial.radialSettings = { startAngle: 60, endAngle: 300, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((420 - (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 60, endAngle: 300, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((300 + (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 300, endAngle: 60, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((420 - (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 300, endAngle: 60, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((300 + (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((270 + (45 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 100, endAngle: 260, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((270 + (45 * index)) % 360 + "deg");
            }
        });

        it('RadialMode + MiddleCenter', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "MiddleCenter", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(true);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (90 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
        });

        it('RadialMode + MiddleCenter + dyanmic values', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "MiddleCenter", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            speedDial.radialSettings = { startAngle: 270, endAngle: 270 };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(((270 + (90 * index)) % 360) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(((630 - (90 * index)) % 360) + "deg");
            }
            speedDial.radialSettings = { startAngle: -270, endAngle: 720, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(0 + (90 * index) + "deg");
            }
        });

        it('RadialMode + MiddleRight', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleRight", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (45 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("270deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("90deg");
        });
        it('RadialMode + MiddleRight + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "MiddleRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            speedDial.radialSettings = { startAngle: 120, endAngle: 240, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(240 - (30 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(120 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (45 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: 80, endAngle: 30, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(90 + (45 * index) + "deg");
            }
        });

        it('RadialMode + BottomLeft', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "BottomLeft", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(true);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((360 - (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("270deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
        });

        it('RadialMode + BottomLeft + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "BottomLeft", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            speedDial.radialSettings = { startAngle: 300, endAngle: 330, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(330 - (10 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(300 + (10 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((270 + (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 170, endAngle: 130, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((270 + (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 0, endAngle: 270, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((360 - (30 * index)) % 360 + "deg");
            }
        });

        it('RadialMode + BottomCenter', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "BottomCenter", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(true);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((180 + (45 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("0deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
        });

        it('RadialMode + BottomCenter + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data, mode: "Radial", position: "BottomCenter", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(5);
            speedDial.radialSettings = { startAngle: 210, endAngle: 330, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(330 - (30 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(210 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((180 + (45 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 170, endAngle: 130, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((180 + (45 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 0, endAngle: 240, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((360 - (30 * index)) % 360 + "deg");
            }
        });

        it('RadialMode + BottomRight', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "BottomRight", target: tarEle, opensOnHover: true });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-top-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top-right")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-bottom-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom-left")).toBe(false);
            speedDial.opensOnHover = false;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "AntiClockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("270deg");
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
            speedDial.radialSettings = { direction: "Auto" };
            speedDial.dataBind();
            expect((li[0] as HTMLElement).style.getPropertyValue("--speeddialRadialAngle")).toBe("180deg");
        });
        it('RadialMode + BottomRight + dynamic Values', () => {
            speedDial = new SpeedDial({ items: data1, mode: "Radial", position: "BottomRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(false);
            speedDial.opensOnHover = true;
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-hover-open")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            speedDial.radialSettings = { startAngle: 200, endAngle: 230, direction: "AntiClockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(230 - (10 * index) + "deg");
            }
            speedDial.radialSettings = { direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(200 + (10 * index) + "deg");
            }
            speedDial.radialSettings = { startAngle: -70, endAngle: 440, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((180 + (30 * index)) % 360 + "deg");
            }
            speedDial.radialSettings = { startAngle: 170, endAngle: 130, direction: "Clockwise" };
            speedDial.dataBind();
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe((180 + (30 * index)) % 360 + "deg");
            }
        });
    });
    describe('Radial Mode props +  Combination test', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement
        const data1: SpeedDialItemModel[] = [
            {
                text: 'Autosum',
                iconCss: 'e-icons e-people',
            },
            {
                text: 'Average',
                iconCss: 'e-icons e-signature'
            },
            {
                text: 'Min',
                iconCss: 'e-icons e-location'
            },
            {
                text: 'Max',
                iconCss: 'e-icons e-cut'
            }
        ];
        const iconData: SpeedDialItemModel[] = [
            {
                iconCss: 'e-icons e-people',
            },
            {
                iconCss: 'e-icons e-signature'
            },
            {
                iconCss: 'e-icons e-location'
            },
            {
                iconCss: 'e-icons e-cut'
            }
        ];

        function getBottom(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return tarEle.clientHeight - btnEle.offsetTop - (isVertical ? 0 : btnEle.offsetHeight) + "px";
        }
        function getRight(btnEle: HTMLElement, tarEle: HTMLElement, isVertical: boolean = true): string {
            return tarEle.clientWidth - btnEle.offsetLeft - (isVertical ? btnEle.offsetWidth : 0) + "px"
        }
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })
        it('RadialMode props + icon data', () => {
            speedDial = new SpeedDial({ items: iconData, mode: "Radial", position: "BottomRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            let height = (li[0] as HTMLElement).offsetHeight + "px";
            let width = (li[0] as HTMLElement).offsetWidth + "px";
            expect(popupEle.style.getPropertyValue("--speeddialRadialMinHeight")).toBe(height);
            expect(popupEle.style.getPropertyValue("--speeddialRadialMinWidth")).toBe(width);
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            speedDial.radialSettings.offset = "200px";
            speedDial.dataBind();
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("200px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            speedDial.items = data1;
            speedDial.dataBind();
            li = popupEle.querySelectorAll(".e-speeddial-li");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.classList.contains("e-speeddial-text-li")).toBe(false);
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
                let text = (element.querySelector(".e-speeddial-li-text") as HTMLElement);
                expect(text === null).toBe(false);
            }
        });
        it('RadialMode + only icons', () => {
            speedDial = new SpeedDial({ items: iconData, mode: "Radial", position: "BottomRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(li.length).toBe(4);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            speedDial.radialSettings.offset = "200px";
            speedDial.dataBind();
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("200px");
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
        });
        it('RadialMode to linear mode', () => {
            speedDial = new SpeedDial({ items: iconData, mode: "Radial", position: "BottomRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            expect(li.length).toBe(4);
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.mode = "Linear";
            speedDial.dataBind();
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("");
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(false);
            let HorzDist = getRight(speedDialEle, tarEle, true);
            let VertDist = getBottom(speedDialEle, tarEle, true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe(HorzDist);
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe(VertDist);
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.mode = "Radial";
            speedDial.radialSettings.offset = "200px";
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(false);
            li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("200px");
            expect(li.length).toBe(4);
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
        });
        it('RadialMode to popupTemplate', () => {
            speedDial = new SpeedDial({ items: iconData, mode: "Radial", position: "BottomRight", target: tarEle });
            speedDial.appendTo('#speedDial');
            let popupEle = (speedDial as any).popupEle as HTMLElement;
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(false);
            let li = popupEle.querySelectorAll(".e-speeddial-li");
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("100px");
            expect(li.length).toBe(4);
            for (let index = 0; index < li.length; index++) {
                const element = li[index] as HTMLElement;
                expect(element.style.getPropertyValue("--speeddialRadialAngle")).toBe(180 + (30 * index) + "deg");
            }
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.popupTemplate = '<span class="tempContent">Hello Syncfusion!</span>';
            speedDial.dataBind();
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("");
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe('');
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe('');
            let tempContent = '<div class="e-speeddial-template-container">'+ '<span class="tempContent">Hello Syncfusion!</span>' +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent); 
            expect(popupEle.classList.contains("e-speeddial-left")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-top")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-right")).toBe(true);
            expect(popupEle.classList.contains("e-speeddial-bottom")).toBe(true);
            speedDial.mode = "Linear";
            speedDial.radialSettings.offset = "200px";
            speedDial.dataBind();
            expect(popupEle.style.getPropertyValue("--speeddialRadialOffset")).toBe("");
            expect(popupEle.classList.contains("e-speeddial-radial")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-linear")).toBe(false);
            expect(popupEle.classList.contains("e-speeddial-template")).toBe(true);
            expect(popupEle.style.getPropertyValue("--speeddialHorzDist")).toBe('');
            expect(popupEle.style.getPropertyValue("--speeddialVertDist")).toBe('');
            let tempContent1 = '<div class="e-speeddial-template-container">'+ '<span class="tempContent">Hello Syncfusion!</span>' +'</div>';
            expect(document.querySelector(".e-speeddial-popup").innerHTML).toBe(tempContent1); 
        });
    });
    describe('Annimation Test', () => {
        let speedDial: SpeedDial;
        let speedDialEle: HTMLElement
        let tarEle: HTMLElement
        let originalTimeout: any;
        beforeAll(() => {
            SpeedDial.Inject(SpeedDial);
            enableRipple(true);
        });
        beforeEach(() => {
            speedDialEle = createElement('button', { id: 'speedDial' });
            document.body.appendChild(speedDialEle);
            tarEle = createElement('div', { id: 'speedDialtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        })
        afterEach(() => {
            if (speedDial) {
                speedDial.destroy();
                speedDial = undefined;
            }
            remove(speedDialEle);
            remove(tarEle);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('open action with overlay', (done) => {
            let isCalled: boolean = false;
            speedDial = new SpeedDial({
                items: data, cssClass: "testClass", target: "#speedDialtarget", modal: true,
                onOpen: () => {
                    expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
                    expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
                    isCalled = true;
                },
                onClose: () => {
                    expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(true);
                    expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(true);
                    isCalled = true;
                }
            });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            speedDialEle.click();
            setTimeout(() => {
                expect(isCalled).toBe(true);
                isCalled = false;
                speedDialEle.click();
                setTimeout(() => {
                    expect(isCalled).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('open action with overlay and popuptemplate', (done) => {
            let isCalled: boolean = false;
            let template:string = '<span class="tempContent">Hello Syncfusion!</span>';
            speedDial = new SpeedDial({
                popupTemplate: template, cssClass: "testClass", target: "#speedDialtarget", modal: true,
                onOpen: () => {
                    expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(false);
                    expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(false);
                    isCalled = true;
                },
                onClose: () => {
                    expect(tarEle.querySelector(".e-speeddial-popup").classList.contains("e-speeddial-hidden")).toBe(true);
                    expect(tarEle.querySelector(".e-speeddial-overlay").classList.contains("e-speeddial-hidden")).toBe(true);
                    isCalled = true;
                }
            });
            speedDial.appendTo('#speedDial');
            expect(tarEle.querySelector(".e-speeddial-popup").classList).toContain("e-speeddial-hidden");
            expect(tarEle.querySelector(".e-speeddial-overlay").classList).toContain("e-speeddial-hidden");
            speedDialEle.click();
            setTimeout(() => {
                expect(isCalled).toBe(true);
                isCalled = false;
                speedDialEle.click();
                setTimeout(() => {
                    expect(isCalled).toBe(true);
                    done();
                }, 2000);
            }, 2000);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
