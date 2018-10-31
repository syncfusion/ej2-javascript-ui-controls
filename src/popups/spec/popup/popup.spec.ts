import { createElement } from '@syncfusion/ej2-base';
import { AnimationModel } from '@syncfusion/ej2-base';
import { calculatePosition, OffsetPosition as eleOffset } from '../../src/common/position';
import { Popup, getMaxZindex } from '../../src/popup/popup';
import '../../node_modules/es6-promise/dist/es6-promise';
import { Browser } from '@syncfusion/ej2-base';

/**
 * popup test cases 
 */
describe('Popup # ', () => {
    let ele: HTMLElement = createElement('div', { id: 'tspopup' });
    document.body.appendChild(ele);
    let offset: eleOffset = {left: 228, top: 220};
    function getTargetElement(): Element {
        return document.body.querySelector( '#targetElement' );
    }
    let popup: Popup;
    // Default value testing
    describe ('default value testing ', () => {
        afterEach((): void => {
            if(popup) {
                popup.destroy();
                document.body.innerHTML = "";
                popup = null;
            }
        });
        /**
         * initialize the popup object.
         */
        it('initialize Popup object # ', () => {
            popup = new Popup(ele, { height: '200px', width: '250px'});
            expect(popup.element.classList.contains('e-popup')).toEqual(true);
        });
        /**
         * control class testing
         */
        it('control class testing ', () => {
            popup = new Popup(ele, { height: '200px', width: '250px'});
            expect(popup.element.classList.contains('e-control')).toEqual(true);
        });
        /**
         * height & width
         */
        it('height & width validation ', () => {
            popup = new Popup(ele, { height: '300px', width: '350px'});
            expect(popup.element.style.height).toEqual('300px');
            expect(popup.element.style.width).toEqual('350px');
        });
        /**
         * zIndex
         */
        it('zIndex default value ', () => {
            popup = new Popup(ele, { height: '300px', width: '350px'});
            expect(popup.element.style.zIndex).toEqual('');
            popup.zIndex = 2000;
            popup.dataBind();
            expect(popup.element.style.zIndex).toEqual('2000');
        });
        it('zIndex initial value change ', () => {
            popup = new Popup(ele, { height: '300px', width: '350px', zIndex:1500});
            expect(popup.element.style.zIndex).toEqual('1500');            
        });
        /**
         * enableRtl
         */
        it('enableRtl default value ', () => {
            popup = new Popup(ele, { height: '300px', width: '350px'});
            expect(popup.enableRtl).toBe(false);
        });
        /**
         * enableRtl class testing
         */
        it('enableRtl testing ', () => {
            popup = new Popup(ele, { height: '250px', enableRtl: true});
            expect(popup.element.classList.contains('e-rtl')).toEqual(true);
        });
        /**
         * content
         */
        it('content property check', () => {
            popup = new Popup(ele, { height: '300px', width: '350px', content: 'Nice works...!'});
            expect(popup.element.innerHTML).toBe(<string>popup.content);
        });
    });
    // Dynamically change the properties
    describe ('Dynamically change the properties ', () => {
        afterEach(() => {
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
        });
        /**
         * height and width
         */
        it('height and width property changes ', () => {
            popup = new Popup(ele, {});
            popup.height = '300px';
            popup.width = '350px';
            popup.dataBind();
            expect(popup.element.style.height).toEqual('300px');
            expect(popup.element.style.width).toEqual('350px');
        });
        /**
         * height and width
         */
        it('height and width property without px value ', () => {
            popup = new Popup(ele, {});
            popup.height = '300';
            popup.width = '350';
            popup.dataBind();
            expect(popup.element.style.height).toEqual('300px');
            expect(popup.element.style.width).toEqual('350px');
        });
        /**
         * zIndex
         */
        it('zIndex property changes ', () => {
            popup = new Popup(ele, {});
            popup.zIndex = 1001;
            popup.dataBind();
            expect(popup.element.style.zIndex).toEqual('1001');
        });
        /**
         * enableRtl
         */
        it('enableRtl property changes ', () => {
            popup = new Popup(ele, {});
            popup.enableRtl = true;
            popup.dataBind();
            expect(popup.element.classList.contains('e-rtl')).toBe(true);
        });
        /**
         * content
         */
        it('content property changes ', () => {
            popup = new Popup(ele, {});
            popup.content = 'Try your best..';
            popup.dataBind();
            expect(popup.element.innerHTML).toBe('Try your best..');
            let content: HTMLElement = createElement('div', {id: 'item', className: 'con', innerHTML: 'Inner'});
            popup.content = content;
            popup.dataBind();
            expect(popup.element.children[0].innerHTML).toBe('Inner');
            expect(popup.content).toBe(content);
        });
        /**
         * offsetX and offsetY
         */
        it('offsetX and offsetY properties changes', () => {
            popup = new Popup(ele, {});
            popup.offsetX = 100;
            popup.offsetY = 100;
            popup.dataBind();
            expect(popup.element.style.left).toBe('100px');
            expect(popup.element.style.top).toBe("100px");
        });
        /**
         * static position
         */
        it('position properties changes', () => {            
            let target: HTMLElement = createElement('div1', { id: 'blocks' });
            target.innerHTML = '<div id="par" style="position: relative"><div style="" id="targetElement1"></div></div>';
            document.body.appendChild(target);
            popup = new Popup(ele, {height: '200px', width: '150px'});
            document.getElementById('targetElement1').appendChild(ele);
            popup.position = {X: 'left', Y: 'top'};
            popup.dataBind();
            let left:number = parseInt(popup.element.style.left,10);
            let top:number = parseInt(popup.element.style.top, 10);
            popup.position = {X: '', Y: ''};
            popup.dataBind();
            expect(parseInt(popup.element.style.left,10)).toEqual(left);
            expect(parseInt(popup.element.style.top, 10)).toEqual(top);
        });
        /**
         * relative position
         */
        it('position properties changes', () => {
            let target: HTMLElement = createElement('div1', { id: 'blocks' });
            target.innerHTML = '<div id="par"><div id="targetElement1"></div></div>';
            document.body.appendChild(target);
            popup = new Popup(ele, {height: '200px', width: '150px'});
            document.getElementById('targetElement1').appendChild(ele);
            document.getElementById('targetElement1').style.position = 'relative';
            let offs : eleOffset = calculatePosition(ele, 'top', 'center');
            let paroffs : eleOffset = calculatePosition(ele, 'top', 'center');
            popup.position = {X: 'top', Y: 'center'};
            popup.dataBind();
            expect(popup.element.style.left).toEqual((paroffs.left - offs.left).toString() + 'px');
        });
    });
    // Public methods testing.
    describe ('Public methods ', () => {
        afterEach(() => {
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
        });
        /**
         * Show
         */
        it('show method testing ', () => {
            popup = new Popup(ele, { height: '250px'});
            popup.hide();
            popup.show();
            expect(popup.element.classList.contains("e-popup-open")).toEqual(true);
        });

        /**
         * Hide
         */
        it('hide method testing ', () => {
            popup = new Popup(ele, { height: '250px'});
            popup.hide();
            expect(popup.element.classList.contains("e-popup-close")).toEqual(true);
        });
        /**
         * getModuleName & getPersistData
         */
        it('cover the code since its not testing', () => {
            let items: any = new Popup(ele, { height: '250px'});
            items.getModuleName();
            let stringItems: any = items.getPersistData();
            expect(stringItems).toBe('{}');
            items.destroy();
            popup = new Popup(ele, { });
        });
    });
     describe("Animation show method test cases", function() {
        let originalTimeout:number;
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            let element: any;
            element = createElement('div', { id: 'popup1' });
            document.body.appendChild(element);
            popup = new Popup(element, { height: '250px'});
            popup.hide();
        });

        it("show method test case", function(done) {
            let options: AnimationModel = { name: 'FadeIn', duration: 400, delay: 10 };
            let flip: Function = (posLeft: number, posTop: number) => { return [posLeft, posTop]; };
            popup.show(options);
            setTimeout(function() {
                expect(popup.element.classList.contains("e-popup-open")).toEqual(true);
                done();
            }, 900);               
        });

        it("show method test case - without delay options", function(done) {
            let options: AnimationModel = { name: 'FadeIn', duration: 400};
            popup.show(options);
            setTimeout(function() {                
                expect(popup.element.classList.contains("e-popup-open")).toEqual(true);
                done();
            }, 900);               
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
        });
    });
    describe("Animation hide method test cases", function() {
        let originalTimeout:number;
        let popupHide: Popup;
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            let element: any;
            element = createElement('div', { id: 'popup1' });
            document.body.appendChild(element);
            popupHide = new Popup(element, { height: '250px'});           
        });

        it("hide method animation test", function(done) {
            let options: AnimationModel = { name: 'FadeIn', duration: 400, delay: 10 };
            let flip: Function = (posLeft: number, posTop: number) => { return [posLeft, posTop]; };
            popupHide.hide(options);
            setTimeout(function() {
                expect(popupHide.element.classList.contains("e-popup-close")).toEqual(true);
                done();
            }, 900);               
        });
        it("hide method animation test on a destroyed Popup object", function(done) {
            let options: AnimationModel = { name: 'FadeIn', duration: 400, delay: 10 };
            let flip: Function = (posLeft: number, posTop: number) => { return [posLeft, posTop]; };
            popupHide.destroy();
            popupHide.hide(options);
            setTimeout(function() {
                expect(popupHide.element.classList.contains("e-popup-close")).toEqual(false);
                done();
            }, 900);               
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (popupHide) {
                popupHide.destroy();
                document.body.innerHTML = '';
            }
        });
    });
    
    describe ('Animation as Null ', () => {
        let element: any;
        element = createElement('div', { id: 'popup1' });
        document.body.appendChild(element);
        beforeEach(() => {
            popup = new Popup(element, { height: '250px'});
            popup.hide();
            let options: AnimationModel = null;
            popup.show(options);
        });
        afterEach(() => {
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
        });
        /**
         * Show with animation & flip function
         */
        it('show method with animation & flip arguments ', () => {
            expect(popup.element.classList.contains("e-popup-open")).toEqual(true);
        });
    });
     describe ('Animation property with show/hide method ', () => {
        let element: any;
        element = createElement('div', { id: 'popup1' });
        document.body.appendChild(element);
        beforeEach(() => {
            popup = new Popup(element, {
                height: '250px',
                showAnimation : { name: 'FadeIn', duration: 400 },
                hideAnimation : { name: 'FadeOut', duration: 400 }
            });           
        });
        afterEach(() => {
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
        });
       
        it('show method with animation property', (done) => {
            popup.element.className += ' e-popup-close'
            popup.show();
            expect(popup.element.classList.contains("e-popup-open")).toEqual(false);
            setTimeout(function() {
                expect(popup.element.classList.contains("e-popup-open")).toEqual(true);
                done();
            }, 900); 
        });
        it('hide method with animation property', (done) => {
            popup.hide();
            expect(popup.element.classList.contains("e-popup-close")).toEqual(false);
            setTimeout(function() {
                expect(popup.element.classList.contains("e-popup-close")).toEqual(true);
                done();
            }, 900); 
        });
        
    });
    
    /**
     * destroy
     */
    describe ('Public method testing ', () => {
        it('destroy method ', () => {
            popup = new Popup(ele, {width: '300px'});
            popup.destroy();
            expect(popup.element.classList.contains('e-popup')).toEqual(false);
        });
    });
    /**
     * zIndex
     */
    describe ('Public MaxZindex testing ', () => {
        it('get MaxZindex method ', () => {
            let ele: HTMLElement = createElement('div');
            ele.innerHTML = '<div style="z-index: 200; position: absolute"></div>';
            document.body.appendChild(ele);
            let ele1: HTMLElement = createElement('div');
            ele1.innerHTML = '<div style="z-index: 800; position: absolute"></div>';
            document.body.appendChild(ele1);
            let ele2: HTMLElement = createElement('div');
            ele2.innerHTML = '<div style="z-index: 900; position: absolute"></div>';
            document.body.appendChild(ele2);
            let ele3: HTMLElement = createElement('div');
            ele3.innerHTML = '<div style="z-index: 300; position: absolute"></div>';
            document.body.appendChild(ele3);
            let maxzindex: number = getMaxZindex();
            expect(maxzindex).toBe(901);
        });
    });
    /**
     * zIndex
     */
    describe ('Public MaxZindex testing ', () => {
        it('get MaxZindex using tagname ', () => {
            let ele: HTMLElement = createElement('div');
            ele.innerHTML = '<div style="z-index: 200; position: absolute"></div>';
            document.body.appendChild(ele);
            let ele1: HTMLElement = createElement('div');
            ele1.innerHTML = '<div style="z-index: 800; position: absolute"></div>';
            document.body.appendChild(ele);
            let ele2: HTMLElement = createElement('div');
            ele2.innerHTML = '<div style="z-index: 900; position: absolute"></div>';
            document.body.appendChild(ele);
            let ele3: HTMLElement = createElement('div');
            ele3.innerHTML = '<div style="z-index: 300; position: absolute"></div>';
            document.body.appendChild(ele);
            let ele4 = document.createElement('span');
            ele4.innerHTML = '<span style="z-index: 100; position: absolute"></span>';
            document.body.appendChild(ele4);
            let ele5 = document.createElement('span');
            ele5.innerHTML = '<span style="z-index: 400; position: absolute"></span>';
            document.body.appendChild(ele5);
            let ele6 = document.createElement('span');
            ele6.innerHTML = '<span style="z-index: 200; position: absolute"></span>';
            document.body.appendChild(ele6);
            let ele7 = document.createElement('span');
            ele7.innerHTML = '<span style="z-index: 500; position: absolute"></span>';
            document.body.appendChild(ele7);
            let maxzindex: number = getMaxZindex(['div', 'span']);
            expect(maxzindex).toBe(901);
        });
    });
    // Position related testing.
    describe ('Position related testing ', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'tspopup' });
            let element: HTMLElement = createElement('div', { id: 'block' });
            element.innerHTML = '<div style="margin: 220px"><div style="position: static" id="targetElement"></div></div>';
            document.body.appendChild(element);
            let element1: HTMLElement = createElement('div1', { id: 'blocks' });
            element1.innerHTML = '<div id="par" style="position: relative"><div style="position: static" id="targetElement1"></div></div>';
            document.body.appendChild(element1);
        });
        afterEach(() => {
            if (popup) {
                popup.destroy();
                document.body.innerHTML = '';
            }
            document.body.innerHTML = '';
        });
        /**
         * Static parent position
         */
        it('parent static position ', () => {
            let target: HTMLElement = createElement('div1', { id: 'blocks' });
            target.innerHTML = '<div id="par" style="position: relative"><div style="position: static" id="targetElement1"></div></div>';
            document.body.appendChild(target);
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}});
            document.getElementById('targetElement1').appendChild(ele);
            let offs : eleOffset = calculatePosition(getTargetElement(), 'bottom', 'left');
            let offsw: eleOffset = {left: offset.left, top: offset.top + (getTargetElement().getBoundingClientRect().height)};
            expect(offs).toEqual(offsw);
            expect(ele.getBoundingClientRect().left).toEqual(calculatePosition(ele, 'bottom', 'left').left);
            expect(ele.getBoundingClientRect().top).toEqual(calculatePosition(ele, 'bottom', 'left').top);
        });
        /**
         * Static parent position with relateTo
         */
        it('parent static position with relateTo ', () => {
            let target: HTMLElement = document.body.querySelector('#targetElement') as HTMLElement;
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, relateTo: target});
            let offs : eleOffset = calculatePosition(getTargetElement(), 'bottom', 'left');
            let offsw: eleOffset = {left: offset.left, top: offset.top + (getTargetElement().getBoundingClientRect().height)};
            expect(offs).toEqual(offsw);
            let options: AnimationModel = { name: 'FadeIn', duration: 100 };
            let flip: Function = (posLeft: number, posTop: number) => { return [posLeft, posTop]; };
            popup.show(options);
            expect(popup.element.offsetLeft).toEqual(calculatePosition(ele, 'bottom', 'left').left);
            expect(popup.element.offsetTop).toEqual(calculatePosition(ele, 'bottom', 'left').top);
        });
        /**
         * Static parent position with relateTo string parameter.
         */
        it('parent static position with relateTo string parameter', () => {
            let target: HTMLElement = document.body.querySelector('#targetElement') as HTMLElement;
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, relateTo: '#targetElement'});
            let offs : eleOffset = calculatePosition(getTargetElement(), 'bottom', 'left');
            let offsw: eleOffset = {left: offset.left, top: offset.top + (getTargetElement().getBoundingClientRect().height)};
            expect(offs).toEqual(offsw);
            let options: AnimationModel = { name: 'FadeIn', duration: 100 };
            let flip: Function = (posLeft: number, posTop: number) => { return [posLeft, posTop]; };
            popup.show(options);
            expect(popup.element.offsetLeft).toEqual(calculatePosition(ele, 'bottom', 'left').left);
            expect(popup.element.offsetTop).toEqual(calculatePosition(ele, 'bottom', 'left').top);
        });
        /**
         * Relative parent position
         */
        it('parent relative position ', () => {
            let left : number; let top: number;
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}});
            left = calculatePosition(ele, 'bottom', 'left').left;
            expect(popup.element.style.left).toEqual(left.toString() + 'px');
            top = calculatePosition(ele, 'bottom', 'left').top;
            expect(popup.element.style.top).toEqual(top.toString() + 'px');
        });
        /**
         * Relative parent position with relateTo
         */
        it('parent relative position with relateTo property ', () => {
            let left : number; let top: number;
            let target: HTMLElement = document.body.querySelector('#targetElement1') as HTMLElement;
            document.body.appendChild(ele);
            ele.style.height ="200px";
            ele.style.width ="300px";
            target.style.width ="400px";
            target.style.height = "400px";
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, relateTo: target});
            left = ((<HTMLElement>popup.relateTo).offsetParent as HTMLElement).offsetLeft;
            expect(popup.element.style.left).toEqual(left.toString() + 'px');
            top = ((<HTMLElement>popup.relateTo).offsetParent as HTMLElement).offsetTop;
            expect(popup.element.style.top).toEqual(top.toString() + 'px');
        });
        /**
         * Positions with offsetX and offsetY 
         */
        it('parent relative position with relateTo property ', () => {
            let left : number; let top: number;
            document.body.appendChild(ele);
            ele.style.height ="200px";
            ele.style.width ="300px";           
            let target: HTMLElement = document.body.querySelector('#targetElement1') as HTMLElement;
            target.style.width ="400px";
            target.style.height = "400px";
            popup = new Popup ( ele, { width: '300px', relateTo: target, offsetX: 10, offsetY: 10});
            left = ((<HTMLElement>popup.relateTo).offsetParent as HTMLElement).offsetLeft + popup.offsetX;
            expect(popup.element.style.left).toEqual(left.toString() + 'px');
            top = ((<HTMLElement>popup.relateTo).offsetParent as HTMLElement).offsetTop + popup.offsetY;
            expect(popup.element.style.top).toEqual(top.toString() + 'px');
        });
        /**
         * relateTo
         */
        it('relateTo property changes ', () => {
            document.body.appendChild(ele);
            ele.style.height ="200px";
            ele.style.width ="300px";
            let target: HTMLElement = document.body.querySelector('#targetElement') as HTMLElement;
            target.style.width ="400px";
            target.style.height = "400px";
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, relateTo: null});            
            expect(popup.element.style.left).toBe('8px');
            expect(popup.element.style.top).toBe('220px');
            popup.relateTo = target;
            popup.dataBind();
            expect(popup.element.style.left).toBe(target.offsetLeft + "px");
            expect(popup.element.style.top).toBe(target.offsetTop +"px");
        });
        it ('get scrollable parents', () => {            
            let target: HTMLElement = createElement('div', { id: 'blocks' });
            target.innerHTML = '<div id="par" style="position: relative;overflow:scroll"><div style="position:absolute" id="targetElement1"></div></div>';
            document.body.innerHTML ='';
            document.body.appendChild(target);
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}});
            document.getElementById('targetElement1').appendChild(ele);
            let elements: HTMLElement[] = popup.getScrollableParent(document.getElementById('targetElement1'));
            expect( elements.length).toBe(2);
        });
        it ('find fixed parent', () => {            
            let target: HTMLElement = createElement('div', { id: 'blocks', styles: "height:500px; width: 500px" });
            target.innerHTML = '<div id="par" style="position: fixed;overflow:scroll"><div style="position:absolute" id="targetElement1"></div></div>';
            document.body.innerHTML ='';
            document.body.appendChild(target);
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, collision:{X:'none',Y:'flip'}});
            document.body.appendChild(ele);
            let elements: HTMLElement[] = popup.getScrollableParent(document.getElementById('targetElement1'));
            expect(elements.length).not.toBe(2);
            popup.refreshPosition(document.getElementById('targetElement1'));
            expect(ele.style.position).toBe('fixed');
        });        
        it ('find fixed parent inside tab components', () => {
            let target: HTMLElement = createElement('div', { id: 'blocks', styles: "height:500px; width: 500px" });
            target.innerHTML = '<div id="par" style="position: fixed;overflow:scroll"><div style="position:absolute" id="targetElement1"></div></div>';
            document.body.innerHTML ='';
            document.body.appendChild(target);
            let ele: HTMLElement = createElement('div', { id: 'tspopup' });
            document.body.appendChild(ele);
            let popup1: Popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}, collision:{X:'none',Y:'flip'}});
            document.getElementById('targetElement1').appendChild(ele);
            popup.refreshPosition(document.getElementById('targetElement1'));
            expect(ele.style.position).not.toBe('fixed');
        });
        it ('get scrollable parents with hidden parrents', () => {        
            document.body.innerHTML ='';
            let target: HTMLElement = createElement('div', { id: 'blocks' });
            target.innerHTML = '<div id="par" style="position: relative; overflow:visible;height: 100px;width: 100px;"><div style="position: static" id="targetElement1"></div></div>';
            document.body.appendChild(target);
            popup = new Popup ( ele, { width: '300px', position: {X: 'bottom', Y: 'left'}});
            document.getElementById('targetElement1').appendChild(ele);
            let elements: HTMLElement[] = popup.getScrollableParent(document.getElementById('targetElement1'));
            expect( elements.length).toBe(1);
            target.remove();
        });

        it('Position property with number type', () => {
            document.body.appendChild(ele);
            ele.style.height ="200px";
            popup = new Popup ( ele, { width: '300px', position: {X: 100, Y: 100}});            
            expect(popup.element.style.left).toBe(100 + "px");
            expect(popup.element.style.top).toBe(100 +"px");
            popup = new Popup(ele,{});
            popup.position = {X:200, Y: 200};
            popup.dataBind();
            expect(popup.element.style.left).toBe(200 + "px");
            expect(popup.element.style.top).toBe(200 +"px");            
        });

        it('Position property with enum type', () => {
            ele.style.height ="100px";
            ele.style.width ="100px";
            ele.style.display ="block";
            ele.style.position ="absolute";
            document.body.style.height ="500px";
            document.body.style.width ="500px";
            document.body.style.margin ="0px";
            document.body.appendChild(ele);
            popup = new Popup ( ele, {position: {X: 'right', Y: 100}});
            let eleRect = ele.getBoundingClientRect();
            expect(eleRect.left).toEqual(400);       
            expect(popup.element.style.top).toBe(100 + "px");
            popup = new Popup ( ele, {position: {X: 100, Y: 'top'}});
            let eleRect1 = ele.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();           
            expect(popup.element.style.left).toBe(100 + "px");
            expect(eleRect1.top).toEqual(bodyRect.top);
        });
        
        it('parent relative position for enum type with relateTo target', () => {
            let element1: HTMLElement = createElement('div1', { id: 'blocks' });
            element1.innerHTML = '<div id="targetElement1" style="position: relative"></div>';
            document.body.appendChild(element1);
            let target: HTMLElement = document.body.querySelector('#targetElement1') as HTMLElement;
            document.body.appendChild(ele);
            ele.style.height ="200px";
            ele.style.width ="300px";
            target.style.width ="400px";
            target.style.height = "400px";
            popup = new Popup ( ele, { width: '300px', position: {X: 'left', Y: 100}, relateTo: target});
            let eleRect = ele.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            expect(eleRect.left).toEqual(bodyRect.left);
            expect(popup.element.style.top).toEqual(100 + 'px');
        });

        it('parent relative position for enum type with relateTo body', () => {
            let target: HTMLElement = document.body;
            document.body.appendChild(ele);
            ele.style.height ="200px";
            ele.style.width ="300px";
            target.style.width ="400px";
            target.style.height = "400px";
            popup = new Popup ( ele, { width: '300px', position: {X: 400, Y: 'top'}, relateTo: target});
            let eleRect = ele.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            expect(eleRect.top).toEqual(bodyRect.top);
            expect(popup.element.style.left).toEqual(400 + 'px');
        });

    });

    describe("Popup position property test cases", function() {
        var popEle = createElement('div',{id:"posPopup"});
        var popObj:Popup;
        beforeEach(function() {            
            popEle.style.height ="100px";
            popEle.style.width ="100px";
            popEle.style.display ="block";
            popEle.style.position ="absolute";
            document.body.style.height ="500px";
            document.body.style.width ="500px";
            document.body.style.margin ="0px";
            document.body.appendChild(popEle);            
        });

        it("Position X - left", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'top'}});
            let eleRect = popEle.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            expect(eleRect.left).toEqual(bodyRect.left);
        });
        it("Position X - center", function() {
            popObj = new Popup(popEle,{position:{X:'center', Y:'top'}});
            let eleRect = popEle.getBoundingClientRect();
            expect(eleRect.left).toEqual(200);
        });
        it("Position X - right", function() {
            popObj = new Popup(popEle,{position:{X:'right', Y:'top'}});
            let eleRect = popEle.getBoundingClientRect();
            expect(eleRect.left).toEqual(400);
        });
        it("Position Y - top", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'top'}});
            let eleRect = popEle.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            expect(eleRect.top).toEqual(bodyRect.top);
        });
        it("Position Y - center", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'center'}});
            let eleRect = popEle.getBoundingClientRect();
            expect(eleRect.top).toEqual(200);
        });
        it("Position Y - bottom", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'bottom'}});
            let eleRect = popEle.getBoundingClientRect();
            expect(eleRect.top).toEqual(400);
        });

        afterEach(function() {
            if(popObj){
                popObj.destroy();
            }
            document.body.innerHTML = "";
            document.body.style.height ="";
            document.body.style.width ="";
            document.body.style.margin ="8px";
        });
    });
    describe("Popup component event test cases", function() {
        var popEle = createElement('div',{id:"posPopup"});
        var popObj:any;
        var eventStatus:boolean=false;
        let ua= Browser.userAgent;
        beforeEach(function() {
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidUserAgent;
            popEle.style.height ="100px";
            popEle.style.width ="100px";
            popEle.style.display ="block";
            popEle.style.position ="absolute";
            document.body.style.height ="500px";
            document.body.style.width ="500px";
            document.body.style.margin ="0px";
            document.body.appendChild(popEle);
        });

        it("orientationChange event Test Case ", function (done) {
            popObj = new Popup(popEle, { position: { X: 'left', Y: 'bottom' } });
            window.addEventListener("orientationchange", function() {
                eventStatus = true;
            });
            var event = new CustomEvent("orientationchange");
            window.dispatchEvent(event);
            expect(eventStatus).toEqual(true);
            eventStatus = false;
            setTimeout(function() {
                popObj.orientationOnChange();
                done();
            }, 400);    
        }); 
        it("open event Test Case ", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'bottom'},open:function(){
                eventStatus=true;
            }});
            popObj.open();
            expect(eventStatus).toEqual(true);
            eventStatus=false;
        });
        it("close event Test Case ", function() {
            popObj = new Popup(popEle,{position:{X:'left', Y:'bottom'},close:function(){
                eventStatus=true;
            }});
            popObj.close();
            expect(eventStatus).toEqual(true);
            eventStatus=false;
        });

        afterEach(function() {
            if(popObj){
                popObj.destroy();
            }
            document.body.innerHTML = "";
            document.body.style.height ="";
            document.body.style.width ="";
            document.body.style.margin ="8px";
            Browser.userAgent = ua;
        });
    });
    describe("isElementOnViewport method test", function() {
        var popObj:any, flexContainer:HTMLElement;
        beforeEach(function() {            
            flexContainer = document.createElement("div");
            flexContainer.style.overflow  = "scroll";
            flexContainer.style.display ="flex";
            flexContainer.style.height ="400px";
            flexContainer.innerHTML = "<div id='targetWrapper' style='overflow:scroll;height:1000px'>" +
            "<div id='targetContainer' style='height: 1000px; width: 400px; margin: 100px 0px 50px 165px; float: left;'>" +
                        "<button id='target'>Hide Popup</button> " +
                        "<div id='popup' style='position: absolute;background: rgba(201, 205, 206, 0.43); height: 200px; width: 150px;'>" +
                            "<div style='margin: 20px 25px 65px 30px;font-weight: 200;font-size: 12px;'>Popup Content</div>"+
                        "</div>"+
                    "</div></div>";
            document.body.appendChild(flexContainer);
            let popupEle = document.getElementById("popup");
            popObj = new Popup(popupEle,{actionOnScroll:"reposition", relateTo: document.getElementById("target")});
        });

        it(" nexted scroll actions - reposition ", function () {
            let targetContainer = document.getElementById('targetWrapper');
            targetContainer.scrollTop = 200;
            expect(popObj.isElementOnViewport(document.getElementById("target"))).toEqual(false);
            // targetContainer.scrollTop = 0;
            // expect(popObj.isElementOnViewport(document.getElementById("target"))).toEqual(true);
            targetContainer.scrollTop = 220;
            expect(popObj.isElementOnViewport(document.getElementById("target"))).toEqual(false);
            popObj.scrollRefresh({target: document.getElementById('target')});
        });
        it(" window scroll actions - hide ", function () {
            popObj.actionOnScroll = 'hide';
            popObj.dataBind();
            popObj.scrollRefresh({target: document.getElementById('target')});
            expect(popObj.element.classList.contains("e-popup-close")).toEqual(true);
        });
        it(" actionOnScroll - none ", function () {
            let top: number = popObj.element.style.top;
            let left: number = popObj.element.style.left;
            popObj.actionOnScroll = 'none';
            popObj.dataBind();
            let targetContainer = document.getElementById('targetWrapper');            
            targetContainer.scrollTop = 200;
            popObj.scrollRefresh({target: document.getElementById('target')});
            let topLater: number = popObj.element.style.top;
            let leftLater:number = popObj.element.style.left; 
            expect(left).toBe(leftLater);
            expect(top).toBe(topLater);
        });

        it(" internal scroll actions - reposition ", function () {
            flexContainer.scrollTop = 200;
            expect(popObj.isElementOnViewport(document.getElementById("target"))).toEqual(false);
            flexContainer.scrollTop = 0;
            let targetContainer = document.getElementById('targetWrapper');
            targetContainer.scrollTop = 0
            //expect(popObj.isElementOnViewport(document.getElementById("target"))).toEqual(true);
            popObj.targetInvisibleStatus = true;
            popObj.scrollRefresh({target: document.getElementById('target')});
        });
        it(" relateTo element with no dimension ", function () {
            let ele = document.createElement('span');
            ele.style.height = "0px";
            ele.style.width = '0px'
            document.body.appendChild(ele);
            expect(popObj.isElementOnViewport(ele)).toEqual(false);
        });

        afterEach(function() {
            if(popObj){
                popObj.destroy();
            }
            document.body.innerHTML = "";
            document.body.style.height ="";
            document.body.style.width ="";
            document.body.style.margin ="8px";
        });
    });
});

describe("actionOnScroll property - init", function() {
    var popObj:any, flexContainer:HTMLElement;
    beforeEach(function() {            
        flexContainer = document.createElement("div");
        flexContainer.style.overflow  = "scroll";
        flexContainer.style.display ="flex";
        flexContainer.style.height ="400px";
        flexContainer.innerHTML = "<div id='targetWrapper' style='overflow:scroll;height:1000px'>" +
        "<div id='targetContainer' style='height: 1000px; width: 400px; margin: 100px 0px 50px 165px; float: left;'>" +
                    "<button id='target'>Hide Popup</button> " +
                    "<div id='popup' style='position: absolute;background: rgba(201, 205, 206, 0.43); height: 200px; width: 150px;'>" +
                        "<div style='margin: 20px 25px 65px 30px;font-weight: 200;font-size: 12px;'>Popup Content</div>"+
                    "</div>"+
                "</div></div>";
        document.body.appendChild(flexContainer);        
    });

    it(" actionOnScroll - none ", function () {
        let popupEle = document.getElementById("popup");
        popObj = new Popup(popupEle,{actionOnScroll:"none", relateTo: document.getElementById("target")});
        let top: number = popObj.element.style.top;
        let left: number = popObj.element.style.left;
        let targetContainer = document.getElementById('targetWrapper');            
        targetContainer.scrollTop = 200;
        popObj.scrollRefresh({target: document.getElementById('target')});
        let topLater: number = popObj.element.style.top;
        let leftLater:number = popObj.element.style.left; 
        expect(left).toBe(leftLater);
        expect(top).toBe(topLater);
    });

    it(" actionOnScroll - reposition ", function () {
        let popupEle = document.getElementById("popup");
        popObj = new Popup(popupEle,{actionOnScroll:"reposition", relateTo: document.getElementById("target")});
        let top: number = popObj.element.getBoundingClientRect().top;
        let left: number = popObj.element.getBoundingClientRect().left;
        let targetContainer = document.getElementById('targetWrapper');            
        targetContainer.scrollTop = 200;
        popObj.scrollRefresh({target: document.getElementById('target')});
        let topLater: number = popObj.element.getBoundingClientRect().top;
        let leftLater:number = popObj.element.getBoundingClientRect().left;
        expect(left).toBeGreaterThanOrEqual(leftLater);
        expect(top).toBeGreaterThanOrEqual(topLater);
    });
    it(" actionOnScroll - hide ", function () {
        let popupEle = document.getElementById("popup");
        popObj = new Popup(popupEle,{actionOnScroll:"hide", relateTo: document.getElementById("target")});
        popObj.scrollRefresh({target: document.getElementById('target')});
        expect(popObj.element.classList.contains("e-popup-close")).toEqual(true);
    });

    afterEach(function() {
        if(popObj){
            popObj.destroy();
        }
        document.body.innerHTML = "";
        document.body.style.height ="";
        document.body.style.width ="";
        document.body.style.margin ="8px";
    });
});

describe('Popup # Custom Flip Checkup with element viewport # ', () => {
    it("Popup element Test Cases- top flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 65px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"left","bottom"));
        removeContainerContent();
    });
    it("Popup element Test Cases- top flip with string param", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 65px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo: '#target' , offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"left","bottom"));
        removeContainerContent();
    })
    it("Popup element Test Cases- no collide flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 150px 0px 0px 153px;"></div><div id="popup" style="height: 100px;width: 100px;background: rgb(88, 82, 82);position: absolute;left: 326px;top: 152px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(target,"left","top"));
        removeContainerContent();
    });
        it("Popup element Test Cases- no collide fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 150px 0px 0px 153px;"></div><div id="popup" style="height: 100px;width: 100px;background: rgb(88, 82, 82);position: absolute;left: 326px;top: 152px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'fit'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(target,"left","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- top center flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 65px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'center', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"center","bottom"));
        removeContainerContent();
    });
    it("Popup element Test Cases- left flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 53px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'none'},relateTo:target, offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"right","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- left center flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 53px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'center'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'none'},relateTo:target, offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"right","center"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 243px 0px 0px 138px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(target,"left","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom center flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 243px 0px 0px 138px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'center', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'flip'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(target,"center","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- right flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 253px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'none'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"right","top", false, target.getBoundingClientRect())).toEqual(calculatePosition(target,"left","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- right center flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 253px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'center'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'none'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"right","top", false, target.getBoundingClientRect())).toEqual(calculatePosition(target,"left","center"));
        removeContainerContent();
    });
    it("Popup element Test Cases- top left flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 16px 0px 0px 16px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'flip'},relateTo:target, offsetX:-100,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(target,"right","bottom", false, target.getBoundingClientRect()));
        removeContainerContent();
    });
    it("Popup element Test Cases- top right flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 16px 0px 0px 286px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'flip'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element,"right","top",false,target.getBoundingClientRect())).toEqual(calculatePosition(target,"left","bottom"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom  right flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 280px 0px 0px 286px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'flip'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"right","bottom",false,target.getBoundingClientRect())).toEqual(calculatePosition(target,"left","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom  left flip", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 280px 0px 0px 11px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'flip',Y:'flip'},relateTo:target, offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(target,"right","top",false,target.getBoundingClientRect()));
        removeContainerContent();
    });
    it("Popup element Test Cases- top fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;position: relative;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 65px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'fit'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element).top).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","top").top);
        removeContainerContent();
    });
    it("Popup element Test Cases- left fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 53px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'none'},relateTo:target, offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element).left).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","top").left);
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 243px 0px 0px 138px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'none',Y:'fit'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom").top).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","bottom").top);
        removeContainerContent();
    });
    it("Popup element Test Cases- right fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 105px 0px 0px 253px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'none'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"right","top").left).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"right","top").left);
        removeContainerContent();
    });
    it("Popup element Test Cases- top left fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;position:relative; width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 16px 0px 0px 16px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'fit'},relateTo:target, offsetX:-100,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element)).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- top right fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;position:relative; width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 16px 0px 0px 286px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'top'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'fit'},relateTo:target, offsetX:0,offsetY:-100});
        popObj.show();
        expect(calculatePosition(element,"right","top")).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"right","top"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom  right fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 280px 0px 0px 286px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'right', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'fit'},relateTo:target, offsetX:0,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"right","bottom")).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"right","bottom"));
        removeContainerContent();
    });
    it("Popup element Test Cases- bottom  left fit", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 280px 0px 0px 11px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'fit'},relateTo:target, offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","bottom"));
        removeContainerContent();
    });
    it("Popup element Test Cases- string relative imput", function () {
        var popObj:Popup;
        let elem: HTMLDivElement = document.createElement('div');
        elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 65px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 280px 0px 0px 11px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
        document.body.appendChild(elem.firstChild);
        let target: HTMLElement = <HTMLElement>getElem('#target'),element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
        popObj = new Popup(element,{position:{X:'left', Y:'bottom'},viewPortElement:<HTMLElement>getElem('#targetContainer'), targetType:'relative', collision:{X:'fit',Y:'fit'},relateTo:'#target', offsetX:-100,offsetY:0});
        popObj.show();
        expect(calculatePosition(element,"left","bottom")).toEqual(calculatePosition(<HTMLElement>getElem('#targetContainer'),"left","bottom"));
        removeContainerContent();
    });
});
function getElem(selector: string): Element {
    return document.querySelector(selector);
}
function removeContainerContent(){
    if (getElem('#targetContainer')) {
        getElem('#targetContainer').remove();
    }
}