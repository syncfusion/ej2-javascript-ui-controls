/**
 * Spec for Dom
 */
import * as Dom from '../src/dom';
import { EventHandler } from '../src/event-handler';

let ele: HTMLElement;
let eleAr: HTMLElement[] = [];

ele = Dom.createElement('div', { id: 'singleEle', styles: 'height:100px;width:100px;' });

eleAr.push(Dom.createElement('div', { id: 'arrayEle0' }));
eleAr.push(Dom.createElement('div', { id: 'arrayEle1' }));
eleAr.push(Dom.createElement('div', { id: 'arrayEle2' }));
eleAr.push(Dom.createElement('div', { id: 'arrayEle3' }));
eleAr.push(Dom.createElement('div', { id: 'arrayEle4' }));
eleAr.push(Dom.createElement('div', { id: 'arrayEle5' }));
describe('Dom', () => {

    let elem: Element = Dom.createElement('div', { id: 'ele-level-0', className: 'ele prnt' });
    let elem1: Element = Dom.createElement('div', { id: 'ele-level-1', className: 'ele' });
    let elem2: Element = Dom.createElement('div', { id: 'ele-level-2', className: 'ele' });
    let elem3: Element = Dom.createElement('div', { id: 'ele-level-3', className: 'ele' });

    elem2.appendChild(elem3);
    elem1.appendChild(elem2);
    elem.appendChild(elem1);
    document.body.appendChild(elem);

    afterAll(() => {
        document.body.removeChild(elem);
    });

    describe('addClass', () => {
        it('add new class when empty class', () => {
            Dom.addClass(eleAr, 'eleClass');
            expect(eleAr[0].className).toBe('eleClass');
            expect(eleAr[5].className).toBe('eleClass');
        });
        it('add class with existing', () => {
            Dom.addClass(eleAr, 'newclass');
            expect(eleAr[0].className).toBe('eleClass newclass');
            expect(eleAr[5].className).toBe('eleClass newclass');
        });
        it('add same class when existing', () => {
            Dom.addClass(eleAr, 'newclass');
            expect(eleAr[0].className).toBe('eleClass newclass');
            expect(eleAr[5].className).toBe('eleClass newclass');
        });

        it('add multiple classes', () => {
            Dom.addClass(eleAr, ['class1', 'class2', 'class3']);
            expect(eleAr[0].className).toBe('eleClass newclass class1 class2 class3');
            expect(eleAr[5].className).toBe('eleClass newclass class1 class2 class3');
        });
    });

    describe('removeClass', () => {
        it('remove class', () => {
            Dom.removeClass(eleAr, 'class1');
            expect(eleAr[0].className).toBe('eleClass newclass class2 class3');
            expect(eleAr[5].className).toBe('eleClass newclass class2 class3');
        });
        it('remove multiple classes', () => {
            Dom.removeClass(eleAr, ['newclass', 'class2', 'class3', 'eleClass']);
            expect(eleAr[0].className).toBe('');
            expect(eleAr[5].className).toBe('');
        });
        it('remove class when element does not have single class', () => {
            Dom.removeClass(eleAr, 'newclass');
            expect(eleAr[0].className).toBe('');
            expect(eleAr[5].className).toBe('');
            Dom.addClass(eleAr, 'eleClass');
        });
    });

    describe('isVisible', () => {
        it('check visible element', () => {
            document.body.appendChild(ele);
            expect(Dom.isVisible(ele)).toBe(true);
        });
        it('check in visible element', () => {
            ele.setAttribute('style', 'display:none;');
            expect(Dom.isVisible(ele)).toBe(false);
        });
    });

    describe('select and selectAll', () => {
        it('get single element', () => {
            expect(Dom.select('#singleEle')).toBe(ele);
        });

        it('get single element context based', () => {
            expect(Dom.select('#ele-level-3', elem1)).toBe(elem3);
        });

        it('get multiple element', () => {
            Dom.append(eleAr, document.body);
            let eList: HTMLElement[] = Dom.selectAll('.eleClass');
            expect(eList.length).toBe(eleAr.length);

            eleAr.forEach((el: HTMLElement) => {
                document.body.removeChild(el);
            });
        });

        it('get multiple element contect based', () => {
            let eList: HTMLElement[] = Dom.selectAll('.ele', document.querySelector("#ele-level-1"));
            expect(eList.length).toBe(2);
        });

        it('get element if there is no element', () => {
            let eList: HTMLElement[] = Dom.selectAll('.eles', document.querySelector("#ele-level-1"));
            expect(eList.length).toBe(0);
        });
    });
    describe('create element', () => {
        it('createElement function', () => {
            let ele: HTMLElement = Dom.createElement('button', {
                id: 'tsButton',
                className: 'e-btn', innerHTML: 'Button', styles: 'width:200px;height:90px',
                attrs: { 'name': 'test', 'maping': 'testButton' }
            });
            expect(ele.tagName).toEqual('BUTTON');
            expect((<HTMLInputElement>ele).type).toEqual('submit');
            expect(ele.className).toEqual('e-btn');
            expect(ele.id).toEqual('tsButton');
            expect(ele.innerHTML).toEqual('Button');
            expect(ele.style.height).toEqual('90px');
            expect(ele.style.width).toEqual('200px');
            expect(ele.getAttribute('name')).toEqual('test');
            expect(ele.getAttribute('maping')).toEqual('testButton');
            ele = Dom.createElement('button', {
                className: 'tsbutton e-button',
                innerHTML: 'Button', styles: 'width:200px;height:90px', attrs: { 'name': 'test', 'maping': 'testButton' }
            });
            expect(ele.className).toEqual('tsbutton e-button');
        });
        it('createElement function', () => {
            let ele: HTMLElement = Dom.createElement('button');
            expect(ele.tagName).toEqual('BUTTON');
            expect(ele.attributes.length).toEqual(0);
        });

    });
    describe('append & prepend', () => {
        it('append array of element to an element', () => {
            document.body.appendChild(<Node>Dom.createElement('div', { id: 'eleArr' }));
            Dom.append(eleAr, <HTMLElement>document.querySelector('#eleArr'));
            expect(document.querySelector('#eleArr').childNodes.length).toBe(eleAr.length);
        });
        it('prepend array of element to an element', () => {
            let elList: HTMLElement[] = [];
            elList.push(Dom.createElement('div', { id: 'eleAr1' }));
            elList.push(Dom.createElement('div', { id: 'eleAr2' }));
            elList.push(Dom.createElement('div', { id: 'eleAr3' }));
            Dom.prepend(elList, <HTMLElement>document.querySelector('#eleArr'));
            expect(document.querySelector('#eleArr').childNodes.length).toBe(9);
        });
    });

    describe('siblings', () => {
        it('get siblings in dom', () => {
            let els: Element = document.querySelector('#eleAr2');
            expect(Dom.siblings(els).length).toBe(8);
        });
    });
    describe('closest', () => {
        it('get closest parent', () => {
            let el: Element = document.querySelector('#ele-level-2');
            expect(Dom.closest(el, '.prnt')).toBe(document.querySelector('#ele-level-0'));
        });
        it('get closest parent when not available', () => {
            let el: Element = document.querySelector('#ele-level-2');
            expect(Dom.closest(el, '.test')).toBeNull();
        });
        it('get self', () => {
            let el: Element = document.querySelector('#ele-level-2');
            expect(Dom.closest(el, '#ele-level-2')).toBe(el);
        });
        it('get immediate parent', () => {
            let el: Element = document.querySelector('#ele-level-1');
            expect(Dom.closest(el, '.prnt')).toBe(document.querySelector('#ele-level-0'));
        });
    });

    describe('detach', () => {
        it('detach element from dom', () => {
            expect(!!document.querySelector('#eleArr')).toBe(true);
            let removedEle: Element = Dom.detach(document.querySelector('#eleArr'));
            expect(!!document.querySelector('#eleArr')).toBe(false);
            expect(removedEle instanceof Node).toBe(true);
        });
    });

    describe('remove', () => {
        it('remove element from dom', () => {
            let elem: Element = Dom.createElement('div', { id: 'removee', className: "ele" });
            document.body.appendChild(elem);
            // click event bind
            let clickFn = jasmine.createSpy("clickEvent");
            EventHandler.add(elem, "click", clickFn);
            EventHandler.trigger(<HTMLElement>elem, "click");
            expect(!!document.querySelector('#removee')).toBe(true);
            expect(clickFn).toHaveBeenCalled();
            Dom.remove(document.querySelector('#removee'));
            EventHandler.trigger(<HTMLElement>elem, "click");
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(!!document.querySelector('#removee')).toBe(false);
        });
    });

    describe('attributes', () => {
        it('setting single attribute', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'ele1' });
            expect(!!elem.getAttribute('class')).toBe(false);
            Dom.attributes(elem, { class: 'class1 class2' });
            expect(elem.getAttribute('class')).toBe('class1 class2');
        });
        it('setting multiple attributes', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'ele1' });
            expect(!!elem.getAttribute('class')).toBe(false);
            expect(!!elem.getAttribute('style')).toBe(false);
            Dom.attributes(elem, { class: 'class1 class2', style: 'height:100px;' });
            expect(elem.getAttribute('class')).toBe('class1 class2');
            expect(elem.style.height).toBe('100px');
        });
    });

    describe('getAttributeOrDefault method', () => {
        it('setting existing atribute', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'ele1' });
            Dom.getAttributeOrDefault(elem, 'id', 'sample1');
            expect(elem.getAttribute('id')).toBe('ele1');
        });
        it('setting new attribute', () => {
            let elem: HTMLElement = Dom.createElement('div', { className: 'ele1' });
            Dom.getAttributeOrDefault(elem, 'id', 'sample1');
            expect(elem.getAttribute('id')).toBe('sample1');
        });
    });

    describe('setStyleAttribute method', () => {
        it('setting style attributes', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'ele1' });
            document.body.appendChild(elem);
            Dom.setStyleAttribute(elem, { color: 'red', height: '200px' });
            expect(window.getComputedStyle(document.getElementById('ele1')).getPropertyValue('height')).toBe('200px');
            expect(window.getComputedStyle(document.getElementById('ele1')).getPropertyValue('color')).toBe('rgb(255, 0, 0)');
        });
        it('setting style attributes', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'ele3' });
            document.body.appendChild(elem);
            Dom.setStyleAttribute(elem, undefined);
            expect(window.getComputedStyle(document.getElementById('ele3')).getPropertyValue('height')).toBe('0px');
        });
    });

    describe('classList method ', () => {
        it('addClass ', () => {
            let elem: HTMLElement = Dom.createElement('div', { id: 'elem' });
            document.body.appendChild(elem);
            Dom.classList(elem, ['class1', 'class2'], []);
            expect(elem.classList.contains('class1')).toBe(true);
            expect(elem.classList.contains('class3')).toBe(false);
        });

        it('removeClass', () => {
            let elem: HTMLElement = document.getElementById('elem');
            Dom.classList(elem, ['class3'], ['class2', 'class4']);
            expect(elem.classList.contains('class1')).toBe(true);
            expect(elem.classList.contains('class2')).toBe(false);
            expect(elem.classList.contains('class3')).toBe(true);
            expect(elem.classList.contains('class4')).toBe(false);
        });

        it('addClass and removeClass', () => {
            let elem: HTMLElement = document.getElementById('elem');
            Dom.classList(elem, ['class4'], ['class4']);
            expect(elem.classList.contains('class4')).toBe(false);
            elem.remove();
        });
    });
    describe('matchesSelector', () => {
        let result: boolean;
        let matchelement: HTMLElement;
        beforeEach(() => {
            matchelement = Dom.createElement('div', { id: 'match', className: 'matchclass' });
            document.body.appendChild(matchelement);
        });
        it('Match element using id selector', () => {
            result = Dom.matches(matchelement, '#match');
            expect(result).toBe(true);
        });
        it('Match element using class selector', () => {
            result = Dom.matches(matchelement, '.matchclass');
            expect(result).toBe(true);
        });
        it('Return false while element not matches selector', () => {
            result = Dom.matches(matchelement, '#invalid');
            expect(result).toBe(false);
        });
        it('Matches for the opera browser', () => {
            matchelement.matches = matchelement.msMatchesSelector = matchelement.webkitMatchesSelector = null;
            result = Dom.matches(matchelement, '#match');
            expect(result).toBe(true);
        });
        afterEach(() => {
            matchelement.remove();
        });

    });
});
