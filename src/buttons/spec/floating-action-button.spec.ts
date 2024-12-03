/* eslint-disable @typescript-eslint/no-explicit-any */

import { append, createElement, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { Fab, FabPosition } from "../src/floating-action-button/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";
import { IconPosition } from "../src/button/index";

describe('Floating Action Button', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
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
    describe('Null or Undefined value', () => {  
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

        it('in Content', () => {
            fab = new Fab({ content: null });
            fab.appendTo('#fab');
            expect(fab.content).toBe(null);
            fab.destroy();
            fab = new Fab({ content: undefined });
            fab.appendTo('#fab');
            expect(fab.content).toBe('');
        });

        it('in CSS Class', () => {
            fab = new Fab({ cssClass: null });
            fab.appendTo('#fab');
            expect(fab.cssClass).toBe(null);
            fab.destroy();
            fab = new Fab({ cssClass: undefined });
            fab.appendTo('#fab');
            expect(fab.cssClass).toBe('');
        });

        it('in Disabled', () => {
            fab = new Fab({ disabled: null });
            fab.appendTo('#fab');
            expect(fab.disabled).toBe(null);
            fab.destroy();
            fab = new Fab({ disabled: undefined });
            fab.appendTo('#fab');
            expect(fab.disabled).toBe(false);
        });

        it('in Enable HTML Sanitizer', () => {
            fab = new Fab({ enableHtmlSanitizer: null });
            fab.appendTo('#fab');
            expect(fab.enableHtmlSanitizer).toBe(null);
            fab.destroy();
            fab = new Fab({ enableHtmlSanitizer: undefined });
            fab.appendTo('#fab');
            expect(fab.enableHtmlSanitizer).toBe(true);
        });

        it('in Enable Persistence', () => {
            fab = new Fab({ enablePersistence: null });
            fab.appendTo('#fab');
            expect(fab.enablePersistence).toBe(null);
            fab.destroy();
            fab = new Fab({ enablePersistence: undefined });
            fab.appendTo('#fab');
            expect(fab.enablePersistence).toBe(false);
        });

        it('in Enable RTL', () => {
            fab = new Fab({ enableRtl: null });
            fab.appendTo('#fab');
            expect(fab.enableRtl).toBe(false);
            fab.destroy();
            fab = new Fab({ enableRtl: undefined });
            fab.appendTo('#fab');
            expect(fab.enableRtl).toBe(false);
        });

        it('in Icon CSS', () => {
            fab = new Fab({ iconCss: null });
            fab.appendTo('#fab');
            expect(fab.iconCss).toBe(null);
            fab.destroy();
            fab = new Fab({ iconCss: undefined });
            fab.appendTo('#fab');
            expect(fab.iconCss).toBe('');
        });

        it('in Icon Position', () => {
            fab = new Fab({ iconPosition: null });
            fab.appendTo('#fab');
            expect(fab.iconPosition).toBe(null);
            fab.destroy();
            fab = new Fab({ iconPosition: undefined });
            fab.appendTo('#fab');
            expect(fab.iconPosition).toBe(IconPosition.Left);
        });

        it('in Is Primary', () => {
            fab = new Fab({ isPrimary: null });
            fab.appendTo('#fab');
            expect(fab.isPrimary).toBe(null);
            fab.destroy();
            fab = new Fab({ isPrimary: undefined });
            fab.appendTo('#fab');
            expect(fab.isPrimary).toBe(true);
        });

        it('in Is Toggle', () => {
            fab = new Fab({ isToggle: null });
            fab.appendTo('#fab');
            expect(fab.isToggle).toBe(null);
            fab.destroy();
            fab = new Fab({ isToggle: undefined });
            fab.appendTo('#fab');
            expect(fab.isToggle).toBe(false);
        });

        it('in Position', () => {
            fab = new Fab({ position: null });
            fab.appendTo('#fab');
            expect(fab.position).toBe(null);
            fab.destroy();
            fab = new Fab({ position: undefined });
            fab.appendTo('#fab');
            expect(fab.position).toBe(FabPosition.BottomRight);
        });

        it('in Target', () => {
            fab = new Fab({ target: null });
            fab.appendTo('#fab');
            expect(fab.target).toBe(null);
            fab.destroy();
            fab = new Fab({ target: undefined });
            fab.appendTo('#fab');
            expect(fab.target).toBe('');
        });

        it('in Visible', () => {
            fab = new Fab({ visible: null });
            fab.appendTo('#fab');
            expect(fab.visible).toBe(null);
            fab.destroy();
            fab = new Fab({ visible: undefined });
            fab.appendTo('#fab');
            expect(fab.visible).toBe(true);
        });
    });
    describe('Methods and Events', () => {      
        let fab: Fab;
        let fabEle: HTMLElement
        let tarEle: HTMLElement

        function getTargetPosition(tarEle: HTMLElement, direction: string): string {
            return tarEle[direction=='Top' ? 'clientHeight' : 'clientWidth']/2 + 'px';
        }

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
            expect(fab.position).toEqual("MiddleCenter");   
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            tarEle.style.width = "600px";
            tarEle.style.height = "600px";
            fab.refreshPosition();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
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

        function getTargetPosition(tarEle: HTMLElement, direction: string): string {
            return tarEle[direction=='Top' ? 'clientHeight' : 'clientWidth']/2 + 'px';
        }
        function getPosition(direction: string): string {
            return Math.floor(window[direction=='Top' ? 'innerHeight' : 'innerWidth']/2) + 'px';
        }
        function getRoundedValue(value: string): string {
            return Math.floor(parseFloat(value)) + 'px';
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
            const fabStyles = getComputedStyle(fabEle);
            expect(fab.position).toEqual("BottomRight");
            expect(fabStyles.bottom).toBe('16px');
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('TopLeft', () => {
            fab = new Fab({  position: "TopLeft", target: "#fabtarget" });
            fab.appendTo('#fab');
            const fabStyles = getComputedStyle(fabEle);
            expect(fab.position).toEqual("TopLeft");
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('TopCenter', () => {
            fab = new Fab({  position: "TopCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("TopCenter");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('TopCenter without target', () => {
            fab = new Fab({  position: "TopCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("TopCenter");
            const fabStyles = getComputedStyle(fabEle);
            //In without target case fabStyles.left gives the floating point values as a result of dynamic changes to the window's innerWidth.
            // We get decimal values from window.innerwidth/2.
            //So we are evaluating the rounded-down values.
            const fabLeft = getRoundedValue(fabStyles.left);
            expect(fabStyles.top).toBe('16px');
            expect(fabLeft).toBe(getPosition('Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('TopRight', () => {
            fab = new Fab({  position: "TopRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("TopRight");
            const fabStyles = getComputedStyle(fabEle);
            expect(fab.position).toEqual("TopRight");
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleLeft', () => {
            fab = new Fab({  position: "MiddleLeft", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("MiddleLeft");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleLeft without target', () => {
            fab = new Fab({  position: "MiddleLeft" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleLeft");
            const fabStyles = getComputedStyle(fabEle);
            const fabTop = getRoundedValue(fabStyles.top);
            expect(fabTop).toBe(getPosition('Top'));
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleCenter', () => {
            fab = new Fab({  position: "MiddleCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleCenter");   
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleCenter', () => {
            fab = new Fab({  position: "MiddleCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleCenter");
            const fabStyles = getComputedStyle(fabEle);
            const fabTop = getRoundedValue(fabStyles.top);
            const fabLeft = getRoundedValue(fabStyles.left);
            expect(fabTop).toBe(getPosition('Top'));
            expect(fabLeft).toBe(getPosition('Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleRight', () => {
            fab = new Fab({  position: "MiddleRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("MiddleRight");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('MiddleRight without target', () => {
            fab = new Fab({  position: "MiddleRight" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("MiddleRight");
            const fabStyles = getComputedStyle(fabEle);
            const fabTop = getRoundedValue(fabStyles.top);
            expect(fabTop).toBe(getPosition('Top'));
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('BottomLeft', () => {
            fab = new Fab({  position: "BottomLeft", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("BottomLeft");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.left).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });
        it('BottomCenter', () => {
            fab = new Fab({  position: "BottomCenter", target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomCenter");   
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('BottomCenter', () => {
            fab = new Fab({  position: "BottomCenter" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomCenter");
            const fabStyles = getComputedStyle(fabEle);
            const fabLeft = getRoundedValue(fabStyles.left);
            expect(fabLeft).toBe(getPosition('Left'));
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });

        it('BottomRight', () => {
            fab = new Fab({  position: "BottomRight", target: "#fabtarget" });
            fab.appendTo('#fab');            
            expect(fab.position).toEqual("BottomRight");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.right).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
        });
        it('position Change', () => {
            fab = new Fab({  target: "#fabtarget" });
            fab.appendTo('#fab');
            expect(fab.position).toEqual("BottomRight");
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.right).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "BottomCenter";
            fab.dataBind();
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "BottomLeft";
            fab.dataBind();
            expect(fabStyles.left).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = "MiddleRight";
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "MiddleCenter";
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "MiddleLeft";
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopRight";
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopCenter";
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = "TopLeft";
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });
        it('position Change with position as enum', () => {
            fab = new Fab({  target: "#fabtarget", position: FabPosition.BottomRight });
            fab.appendTo('#fab');
            expect(fab.position).toEqual(FabPosition.BottomRight);
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.right).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.BottomCenter;
            fab.dataBind();
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.BottomLeft;
            fab.dataBind();
            expect(fabStyles.left).toBe('16px');
            expect(fabStyles.bottom).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(false);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(true);
            fab.position = FabPosition.MiddleRight;
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.MiddleCenter;
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.MiddleLeft;
            fab.dataBind();
            expect(fabStyles.top).toBe(getTargetPosition(tarEle,'Top'));
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopRight;
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.right).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopCenter;
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.position = FabPosition.TopLeft;
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe('16px');
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
        });

        it('position Values with RTL', () => {
            fab = new Fab({  target: "#fabtarget", position: "TopCenter" });
            fab.appendTo('#fab');
            const fabStyles = getComputedStyle(fabEle);
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(true);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(false);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.enableRtl = true;
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.right).toBe(getTargetPosition(tarEle,'Left'));
            expect(fabEle.classList.contains("e-fab-left")).toBe(false);
            expect(fabEle.classList.contains("e-fab-top")).toBe(true);
            expect(fabEle.classList.contains("e-fab-right")).toBe(true);
            expect(fabEle.classList.contains("e-fab-bottom")).toBe(false);
            fab.enableRtl = false;
            fab.dataBind();
            expect(fabStyles.top).toBe('16px');
            expect(fabStyles.left).toBe(getTargetPosition(tarEle,'Left'));
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
