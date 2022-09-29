/* eslint-disable @typescript-eslint/no-explicit-any */

import { append, createElement, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { Fab, FabPosition } from "../src/floating-action-button/index";
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

    describe('Button DOM', () => {  
        let fab: Fab;
        let fabEle: HTMLElement
        let tarEle: HTMLElement
        beforeEach(() => {
            fabEle = createElement('button', { id: 'fab' });
            document.body.appendChild(fabEle);
            tarEle = createElement('div', { id: 'fabtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (fab) {
                fab.destroy();
                fab = undefined;
            }
            remove(fabEle);
            remove(tarEle);
        });
        it('check isPrimary default value', () => {
            fab = new Fab({enablePersistence:true});
            fab.appendTo('#fab');
            expect(fab.isPrimary).toEqual(true);
        });

        it('default classes without target', () => {
            fab = new Fab();
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-fab')).toEqual(true);
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(true);
        });

        it('default classes with target', () => {
            fab = new Fab({ target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-fab')).toEqual(true);
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(false);
        });

        it('default classes with target as element', () => {
            fab = new Fab({ target: tarEle });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-fab')).toEqual(true);
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(false);
            expect(tarEle.querySelector(".e-fab") !== null).toEqual(true);
        });

        it('default classes with target as wrong selector', () => {
            fab = new Fab({ target: "tarEle" });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-fab')).toEqual(true);
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(true);
            expect(tarEle.querySelector(".e-fab") === null).toEqual(true);
        });

        it('default classes with dynamic target', () => {
            fab = new Fab();
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(true);
            fab.target = "#fabtarget";
            fab.dataBind();
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(false);
            fab.target = "";
            fab.dataBind();
            expect(fabEle.classList.contains('e-fab-fixed')).toEqual(true);
        });
        it('content property', () => {
            fab = new Fab({ content: "test content" });
            fab.appendTo('#fab');
            expect(fabEle.innerText.toLowerCase()).toEqual("test content");
            fab.content = "fabtarget";
            fab.dataBind();
            expect(fabEle.innerText.toLowerCase()).toEqual("fabtarget");
            fab.content = "";
            fab.dataBind();
            expect(fabEle.innerText).toEqual("");
        });
        it('iconCss', () => {
            fab = new Fab({ iconCss: "open-icon" });
            fab.appendTo('#fab');
            expect(fabEle.querySelector(".open-icon") !== null).toBe(true);
            fab.iconCss = "";
            fab.dataBind();
            expect(fabEle.querySelector(".open-icon")).toBeNull;
        });
        it('cssClass', () => {
            fab = new Fab({ cssClass: "testClass" });
            fab.appendTo('#fab');
            expect(fabEle.classList).toContain("testClass");
            fab.cssClass = "newClass";
            fab.dataBind();
            expect(fabEle.classList.contains("testClass")).toBe(false);
            expect(fabEle.classList.contains("newClass")).toBe(true);
        });
        it('visibility', () => {
            fab = new Fab({ visible: false });
            fab.appendTo('#fab');
            expect(fabEle.classList).toContain("e-fab-hidden");
            fab.visible = true;
            fab.dataBind();
            expect(fabEle.classList.contains("e-fab-hidden")).toBe(false);
            fab.visible = false;
            fab.dataBind();
            expect(fabEle.classList.contains("e-fab-hidden")).toBe(true);
        });
        it('disabled', () => {
            fab = new Fab({ disabled: true });
            fab.appendTo('#fab');
            expect(isNullOrUndefined(fabEle.getAttribute("disabled"))).toBe(false);
            fab.disabled = false;
            fab.dataBind();
            expect(isNullOrUndefined(fabEle.getAttribute("disabled"))).toBe(true);
            fab.disabled = true;
            fab.dataBind();
            expect(isNullOrUndefined(fabEle.getAttribute("disabled"))).toBe(false);
        });
        it('iconPosition', () => {
            fab = new Fab({ content: "button", iconCss: "open-icon", iconPosition: "Left" });
            fab.appendTo('#fab');
            expect(fabEle.querySelector(".e-icon-left") !== null).toBe(true);
            fab.iconPosition = "Right";
            fab.dataBind();
            expect(fabEle.querySelector(".e-icon-right") !== null).toBe(true);
        });
        it('Generic ID generation', () => {
            fab = new Fab();
            let fabEle1 = createElement('button', {});
            document.body.appendChild(fabEle1);
            fab.appendTo(fabEle1);
            expect(isNullOrUndefined(fabEle.id)).toBe(false);
            fab.destroy();
            fab=undefined;
            remove(fabEle1);
        });
        it('default position classes remove test TopLeft + BottomRight', () => {
            fab = new Fab({ position: "TopLeft" });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "BottomRight";
            fab.dataBind()
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.destroy();
            fab = undefined;
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('RTL Class testing', () => {
            fab = new Fab({  target: "#fabtarget", enableRtl: true });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains('e-rtl')).toBe(true);
            fab.enableRtl = false;
            fab.dataBind();
            expect(fabEle.classList.contains('e-rtl')).toBe(false);
        });
        it('default position values RTL test TopLeft + BottomRight', () => {
            fab = new Fab({ position: "TopLeft", enableRtl: true });
            fab.appendTo('#fab');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "BottomRight";
            fab.dataBind()
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.destroy();
            fab = undefined;
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });   

        it('target Change without overlay', () => {
            fab = new Fab({ });
            fab.appendTo('#fab');
            expect(tarEle.querySelector(".e-fab") === null).toBe(true);
            expect(document.querySelector(".e-fab") !== null).toBe(true);
            fab.target = "#fabtarget";
            fab.dataBind();
            expect(tarEle.querySelector(".e-fab") !== null).toBe(true);
        });
    });
    describe('Methods and Events', () => {      
        function getCenterPos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientWidth - btnEle.offsetWidth) / 2 + "px";
        }
        function getMiddlePos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientHeight - btnEle.offsetHeight) / 2 + "px";
        }
        let fab: Fab;
        let fabEle: HTMLElement
        let tarEle: HTMLElement
        beforeAll(() => {
            fabEle = createElement('button', { id: 'fab' });
            document.body.appendChild(fabEle);
            tarEle = createElement('div', { id: 'fabtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (fab) {
                fab.destroy();
                fab = undefined;
            }
        });
        afterAll(() => {
            remove(fabEle);
            remove(tarEle);
        })
        it('Created event', () => {
            let iscreatedCalled = false;
            fab = new Fab({
                created: () => { iscreatedCalled = true; },
            });
            fab.appendTo('#fab');
            expect(iscreatedCalled).toBe(true);
        });

        it('refreshPosition Method', () => {
            fab = new Fab({ position: "MiddleCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            let leftPos = getCenterPos(fabEle, tarEle);
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            tarEle.style.width = "600px";
            tarEle.style.height = "600px";
            leftPos = getCenterPos(fabEle, tarEle);
            middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")===middlePos).toBe(false);
            expect(fabEle.style.getPropertyValue("--fabVertDist")===middlePos).toBe(false);
            fab.refreshPosition();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });   
    });
    describe('position Values', () => {
        let fab: Fab;
        let fabEle: HTMLElement
        let tarEle: HTMLElement
        let styleEle: HTMLElement

        function getCenterPos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientWidth - btnEle.offsetWidth) / 2 + "px";
        }
        function getMiddlePos(btnEle: HTMLElement, tarEle: HTMLElement): string {
            return (tarEle.clientHeight - btnEle.offsetHeight) / 2 + "px";
        }
        function getWinCenterPos(btnEle: HTMLElement): string {
            return (window.innerWidth - btnEle.offsetWidth) / 2 + "px";
        }
        function getWinMiddlePos(btnEle: HTMLElement): string {
            return (window.innerHeight - btnEle.offsetHeight) / 2 + "px";
        }
        beforeAll(() => {
            let styleEle: HTMLElement = createElement("style");
            styleEle.append("body{margin:0;}");
            append([styleEle], document.body);
        })
        beforeEach(() => {
            fabEle = createElement('button', { id: 'fab' });
            document.body.appendChild(fabEle);
            tarEle = createElement('div', { id: 'fabtarget', styles: "margin:10px;border:1px solid red; height:400px; width:400px; position: relative;" });
            document.body.appendChild(tarEle);
        })
        afterEach(() => {
            if (fab) {
                fab.destroy();
                fab = undefined;
            }
            remove(fabEle);
            remove(tarEle);
        });
        afterAll(() => {
            remove(styleEle);
        })

        it('default Direction', () => {
            fab = new Fab({  target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomRight");
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('TopLeft', () => {
            fab = new Fab({  position: "TopLeft", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("TopLeft");
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('TopCenter', () => {
            fab = new Fab({  position: "TopCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("TopCenter");
            let leftPos = getCenterPos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('TopCenter without targer', () => {
            fab = new Fab({  position: "TopCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("TopCenter");
            let leftPos = getWinCenterPos(fabEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('TopRight', () => {
            fab = new Fab({  position: "TopRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("TopRight");
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleLeft', () => {
            fab = new Fab({  position: "MiddleLeft", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("MiddleLeft");
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleLeft without target', () => {
            fab = new Fab({  position: "MiddleLeft" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleLeft");
            let middlePos = getWinMiddlePos(fabEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleCenter', () => {
            fab = new Fab({  position: "MiddleCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleCenter");   
            let leftPos = getCenterPos(fabEle, tarEle);
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleCenter', () => {
            fab = new Fab({  position: "MiddleCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleCenter");
            let leftPos = getWinCenterPos(fabEle);
            let middlePos = getWinMiddlePos(fabEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleRight', () => {
            fab = new Fab({  position: "MiddleRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("MiddleRight");
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleRight without target', () => {
            fab = new Fab({  position: "MiddleRight" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleRight");
            let middlePos = getWinMiddlePos(fabEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('BottomLeft', () => {
            fab = new Fab({  position: "BottomLeft", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("BottomLeft");
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });
        it('BottomCenter', () => {
            fab = new Fab({  position: "BottomCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomCenter");   
            let leftPos = getCenterPos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('BottomCenter', () => {
            fab = new Fab({  position: "BottomCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomCenter");
            let leftPos = getWinCenterPos(fabEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('BottomRight', () => {
            fab = new Fab({  position: "BottomRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("BottomRight");
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });
        it('position Change', () => {
            fab = new Fab({  target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomRight");
            let leftPos = getCenterPos(fabEle, tarEle);
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "BottomCenter";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "BottomLeft";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "MiddleRight";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "MiddleCenter";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "MiddleLeft";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopRight";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopCenter";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopLeft";
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('position Change with position as enum', () => {
            fab = new Fab({  target: "#fabtarget", position: FabPosition.BottomRight });
            fab.appendTo('#fab');
            expect(fab.position).toEqual(FabPosition.BottomRight);
            let leftPos = getCenterPos(fabEle, tarEle);
            let middlePos = getMiddlePos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.BottomCenter;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.BottomLeft;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.MiddleRight;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.MiddleCenter;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.MiddleLeft;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe(middlePos);
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopRight;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopCenter;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopLeft;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe("");
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('position Values with RTL', () => {
            fab = new Fab({  target: "#fabtarget", position: "TopCenter" });
            fab.appendTo('#fab');
            let style = getComputedStyle(fabEle)
            let leftPos = getCenterPos(fabEle, tarEle);
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.enableRtl = true;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.enableRtl = false;
            fab.dataBind();
            expect(fabEle.style.getPropertyValue("--fabHorzDist")).toBe(leftPos);
            expect(fabEle.style.getPropertyValue("--fabVertDist")).toBe("");
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
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