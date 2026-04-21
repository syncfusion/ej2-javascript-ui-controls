/**
 * Spec for Dom
 */
import * as Dom from '../src/dom';
import { EventHandler } from '../src/event-handler';
import { updateCSSText } from '../src/dom';

let ele: HTMLElement;
let eleAr: HTMLElement[] = [];
let ele1: HTMLElement[] = [];

ele = Dom.createElement('div', { id: 'singleEle', styles: 'height:100px;width:100px;' });
let value: string = '<p id="create">' +
    'old text' +
    '</p>' +
    '<script>' +
    'document.getElementById("create").innerHTML = "new text"' +
    '</script>' +
    '<script>' +
    'window.value = 1000' +
    '</script>'
ele1.push(Dom.createElement('div', { innerHTML: value }));

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
    let elem4: Element = Dom.createElement('div', { id: '1-element', className: 'ele' });

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
        
        it('For element as object', () => {
            let vid: HTMLElement = Dom.createElement('div', { id: 'ele-level-0', className: 'check' });
            let obj: Object = {}
            for(var p in vid) {
                obj[p] = vid[p];
            }
            (eleAr as any).push(obj);
            Dom.addClass(eleAr, ['class1']);
            expect((eleAr[6].attributes as any).className).toBe('class1');
            eleAr.pop();
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

        it('get id starts with number element', () => {
            expect(Dom.select('#1-element', elem4));
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
        it('call eval method', () => {
            document.body.appendChild(Dom.createElement('div', { id: 'eleScript' }));
            Dom.append(ele1, <HTMLElement>document.querySelector('#eleScript'), true);
            expect(document.getElementById("create").innerHTML).toEqual('new text')
            Dom.prepend(ele1, <HTMLElement>document.querySelector('#eleScript'), true);
            expect((window as any).value).toEqual(1000)
        })
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

        it('should handle null and undefined element gracefully', () => {
            expect(() => { Dom.detach(null as any); }).not.toThrow();
            expect(() => { Dom.detach(undefined as any); }).not.toThrow();
        });

        it('should return undefined for orphaned element (no parentNode) and not throw', () => {
            const orphan = Dom.createElement('div', { id: 'detach-orphan' });
            expect(orphan.parentNode).toBeNull();
            const res = Dom.detach(orphan as any);
            expect(res).toBeUndefined();
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
         it('should handle null element gracefully', () => {
            expect(() => {
                Dom.remove(null as any);
            }).not.toThrow();
        });

        it('should handle undefined element gracefully', () => {
            expect(() => {
                Dom.remove(undefined as any);
            }).not.toThrow();
        });

        it('should handle element with null parentNode gracefully', () => {
            let orphanedElem: HTMLElement = Dom.createElement('div', { id: 'orphaned-elem' });
            // Element not appended to DOM, so parentNode is null
            expect(orphanedElem.parentNode).toBeNull();
            expect(() => {
                Dom.remove(orphanedElem);
            }).not.toThrow();
        });

        it('should handle already removed element without throwing error', () => {
            let container: HTMLElement = Dom.createElement('div', { id: 'container-remove-test' });
            let child: HTMLElement = Dom.createElement('div', { id: 'child-remove-test' });
            document.body.appendChild(container);
            container.appendChild(child);
            Dom.remove(child);
            expect(!!document.querySelector('#child-remove-test')).toBe(false);
            expect(() => {
                Dom.remove(child);
            }).not.toThrow();
            document.body.removeChild(container);
        });
        it('should remove element from nested structure', () => {
            let root: HTMLElement = Dom.createElement('div', { id: 'root-nested' });
            let level1: HTMLElement = Dom.createElement('div', { id: 'level-1-nested' });
            let level2: HTMLElement = Dom.createElement('div', { id: 'level-2-nested' });
            let target: HTMLElement = Dom.createElement('span', { id: 'target-nested' });
            document.body.appendChild(root);
            root.appendChild(level1);
            level1.appendChild(level2);
            level2.appendChild(target);
            expect(!!document.querySelector('#target-nested')).toBe(true);
            expect(root.contains(target)).toBe(true);
            Dom.remove(target);
            expect(!!document.querySelector('#target-nested')).toBe(false);
            expect(!!document.querySelector('#root-nested')).toBe(true);
            expect(!!document.querySelector('#level-2-nested')).toBe(true);
            document.body.removeChild(root);
        });

        it('should clear events and remove multiple elements', () => {
            let container: HTMLElement = Dom.createElement('div', { id: 'multi-remove-container' });
            document.body.appendChild(container);
            const elements: HTMLElement[] = [];
            const spies: any[] = [];
            for (let i = 0; i < 3; i++) {
                let elem = Dom.createElement('div', { id: `multi-elem-${i}` });
                container.appendChild(elem);
                elements.push(elem);
                let clickFn = jasmine.createSpy(`clickEvent-${i}`);
                EventHandler.add(elem, 'click', clickFn);
                spies.push(clickFn);
            }
            expect(container.children.length).toBe(3);
            elements.forEach(el => {
                Dom.remove(el);
            });
            expect(container.children.length).toBe(0);
            document.body.removeChild(container);
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
            matchelement.matches = (matchelement as any).msMatchesSelector = matchelement.webkitMatchesSelector = null;
            result = Dom.matches(matchelement, '#match');
            expect(result).toBe(true);
        });
        afterEach(() => {
            matchelement.remove();
        });

    });
    describe('updateCSSText', () => {
        let element: HTMLElement;

        beforeEach(() => {
            element = document.createElement('div');
        });

        it('should add new styles to an element with no existing styles', () => {
            updateCSSText(element, 'display: block; visibility: hidden;');
            expect(element.style.cssText).toBe('display: block; visibility: hidden;');
        });

        it('should merge new styles with existing styles', () => {
            element.style.cssText = 'color: red; font-size: 14px;';
            updateCSSText(element, 'display: block; visibility: hidden;');
            expect(element.style.cssText).toBe('color: red; font-size: 14px; display: block; visibility: hidden;');
        });

        it('should overwrite existing styles with new styles', () => {
            element.style.cssText = 'color: red; font-size: 14px;';
            updateCSSText(element, 'color: blue; display: block;');
            expect(element.style.cssText).toBe('color: blue; font-size: 14px; display: block;');
        });

        it('should handle empty new styles', () => {
            element.style.cssText = 'color: red; font-size: 14px;';
            updateCSSText(element, '');
            expect(element.style.cssText).toBe('color: red; font-size: 14px;');
        });

        it('should handle empty existing styles', () => {
            updateCSSText(element, 'color: blue; display: block;');
            expect(element.style.cssText).toBe('color: blue; display: block;');
        });
    });
    describe('siblings - parentNode null handling', () => {
        it('should return empty array for null input', () => {
            // calling with null should not throw and should return an empty array
            const res = Dom.siblings(null as any);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });

        it('should return empty array when element has no parentNode (orphaned element)', () => {
            // Create element but don't add to DOM (parentNode is null)
            const orphaned = Dom.createElement('div', { id: 'orphaned-element' });
            expect(orphaned.parentNode).toBeNull();
            
            // Should not throw error and return empty array
            const result = Dom.siblings(orphaned);
            expect(result.length).toBe(0);
        });

        it('should return siblings when element has parentNode', () => {
            const container = Dom.createElement('div', { id: 'sibling-container' });
            const child1 = Dom.createElement('div', { id: 'child1' });
            const child2 = Dom.createElement('div', { id: 'child2' });
            const child3 = Dom.createElement('div', { id: 'child3' });

            container.appendChild(child1);
            container.appendChild(child2);
            container.appendChild(child3);
            document.body.appendChild(container);

            // Get siblings of child2
            const siblings = Dom.siblings(child2);
            
            expect(siblings.length).toBe(2);
            expect(siblings[0]).toBe(child1);
            expect(siblings[1]).toBe(child3);

            // Cleanup
            document.body.removeChild(container);
        });

        it('should ignore non-element sibling nodes (text/comment)', () => {
            const container = Dom.createElement('div', { id: 'sibling-container-2' });
            const elA = Dom.createElement('div', { id: 'a' });
            const elB = Dom.createElement('div', { id: 'b' });

            container.appendChild(elA);
            container.appendChild(document.createTextNode('text node'));
            container.appendChild(elB); // target
            container.appendChild(document.createComment('comment'));
            document.body.appendChild(container);

            const siblings = Dom.siblings(elB);
            // only element siblings should be returned (elA)
            expect(siblings.length).toBe(1);
            expect(siblings[0]).toBe(elA);

            // cleanup
            document.body.removeChild(container);
        });

        it('should handle already detached element gracefully', () => {
            const container = Dom.createElement('div');
            const child = Dom.createElement('div', { id: 'detached-child' });

            container.appendChild(child);
            document.body.appendChild(container);

            // First remove the child from DOM
            Dom.remove(child);
            expect(child.parentNode).toBeNull();

            // siblings() should not throw error
            const result = Dom.siblings(child);
            expect(result.length).toBe(0);

            // Cleanup
            if (container.parentNode) {
                document.body.removeChild(container);
            }
        });
    });

    describe('closest - parentNode null handling', () => {
        it('should return null when element has no parentNode (orphaned element)', () => {
            // Create element but don't add to DOM (parentNode is null)
            const orphaned = Dom.createElement('div', { id: 'orphaned-div', className: 'test-class' });
            expect(orphaned.parentNode).toBeNull();
            
            // Should not throw error and return null
            const result = Dom.closest(orphaned, '.test-class');
            expect(result).toBeNull();
        });

        it('should find closest parent with matching selector', () => {
            const parent = Dom.createElement('div', { id: 'parent', className: 'target-class' });
            const child = Dom.createElement('div', { id: 'child' });
            const grandchild = Dom.createElement('div', { id: 'grandchild' });

            parent.appendChild(child);
            child.appendChild(grandchild);
            document.body.appendChild(parent);

            // Find closest parent with target-class
            const result = Dom.closest(grandchild, '.target-class');
            expect(result).toBe(parent);

            // Cleanup
            document.body.removeChild(parent);
        });

        it('should return null when no matching parent found', () => {
            const parent = Dom.createElement('div', { id: 'parent2' });
            const child = Dom.createElement('div', { id: 'child2' });
            const grandchild = Dom.createElement('div', { id: 'grandchild2', className: 'child-class' });

            parent.appendChild(child);
            child.appendChild(grandchild);
            document.body.appendChild(parent);

            // Try to find non-existent class
            const result = Dom.closest(grandchild, '.non-existent-class');
            expect(result).toBeNull();

            // Cleanup
            document.body.removeChild(parent);
        });

        it('should handle already detached element gracefully', () => {
            const container = Dom.createElement('div', { className: 'container' });
            const child = Dom.createElement('div', { id: 'detached-child2' });

            container.appendChild(child);
            document.body.appendChild(container);

            // Remove child from DOM
            Dom.remove(child);
            expect(child.parentNode).toBeNull();

            // closest() should not throw error
            const result = Dom.closest(child, '.container');
            expect(result).toBeNull();

            // Cleanup
            if (container.parentNode) {
                document.body.removeChild(container);
            }
        });
    });
});
