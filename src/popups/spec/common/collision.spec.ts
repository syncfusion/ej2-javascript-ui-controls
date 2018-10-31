
/**
 * Collision module testing specifications.
 */
import { calculatePosition, OffsetPosition } from '../../src/common/position';
import * as collision  from '../../src/common/collision';


function getPop(popupContent: string, container: Node = null): Node {
    let elem: HTMLDivElement = document.createElement('div');
    let elemP: Node;
    elem.innerHTML = '<div class="popup" style="position: absolute;height: 25px;width: 75px;' +
    'border-color: #1b98a0;border-style: solid;border-width: 1px;padding: 30px;"></div>';
    (<HTMLElement>elem.firstChild).innerText = popupContent;
    elemP = elem.firstChild;
    if (container) {
        container.appendChild(elemP);
        document.body.insertBefore(container, document.body.firstChild);
    } else {
        document.body.insertBefore(elemP, document.body.firstChild);
    }
    return elemP;
}
function getTargetElement(): Element {
        return document.body.querySelector('#targetElement');
}
let posT: OffsetPosition;
let posP: OffsetPosition;
function appendTarget(styleContent: string): void {
    let elem: HTMLDivElement = document.createElement('div');
    if (getTargetElement() !== null) {
        getTargetElement().remove();
    }
    if (getElem('#drop')) {
        getElem('#drop').remove();
    }
    elem.innerHTML = '<div id="targetElement" style="height: 30px;width: 100px;border-color: green;' +
        styleContent + ';border-style: solid;border-width: 1px;padding: 30px;">Am a target</div>';
    document.body.insertBefore(elem.firstChild, document.body.firstChild);
}
function removeTarget(): void {
    let elem : Element = getElem('#targetElement');
    if (elem) {
        elem.remove();
    }
}
function removePopup(): void {
    let elem: NodeListOf<Element> = document.querySelectorAll('.popup');
    for (let ind: number = 0; ind < elem.length; ind++) {
        elem[ind].remove();
    }
}
function getElem(selector: string): Element {
    return document.querySelector(selector);
}
describe('Collision Module Specs', () => {
    beforeAll(() => {
        removePopup();
        removeTarget();
    });
    afterAll(() => {
        removePopup();
        removeTarget();
    });
    describe('(Without Collision)-Element positioning.', () => {
            it('Validation Element position - Top', () => {
                appendTarget('margin: 250px;');
                let elem: Node = getPop('Am a Top Element');
                collision.flip(
                    <HTMLElement>elem,
                    <HTMLElement>getElem('#targetElement'),
                    0,
                    -(<HTMLElement>elem).clientHeight - 2,
                    'left',
                    'top');
                //Expected - target element Position and manupulate the top value with the popup element height.
                //ToEqual - pop element Position lef top.
                expect(calculatePosition(getElem('#targetElement'), 'left', 'top', )).
                    toEqual(calculatePosition(getElem('.popup'), 'left', 'bottom'));
            });
            it('Validation Element position - Right', () => {
                removePopup();
                let elem: Element =<Element>getPop('Am a Right Element');
                collision.flip(<HTMLElement>elem, <HTMLElement>getElem('#targetElement'), 0, 0, 'Right', 'top');
                //Expected - target element position right top.
                //ToEqual - popup Element position left top.
                let elementRect = elem.getBoundingClientRect()
                expect(calculatePosition(getElem('#targetElement'), 'right', 'top', false, elementRect))
                    .toEqual(calculatePosition(getElem('.popup'), 'left', 'top', false, elementRect));
            });
            it('Validation Element position - both element starts in same position.', () => {
                removePopup();
                let elem: Node = getPop('Am a Element');
                collision.flip(
                    <HTMLElement>elem,
                    <HTMLElement>getElem('#targetElement'),
                    0,
                    0,
                    'left',
                    'top');
                //Expected - target element Position and manupulate the top value with the popup element height.
                //ToEqual - pop element Position lef top.
                expect(calculatePosition(getElem('#targetElement'), 'left', 'top', )).
                    toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
            });
            it('Validation Element position - Bottom', () => {
                removePopup();
                //posP = calculatePosition(getElem('#targetElement'), 'Top', 'Left');
                //let elem:Node=getPop('Am a Bottom Element');
                collision.flip(<HTMLElement>getPop('Am a Bottom Element'), <HTMLElement>getElem('#targetElement'), 0, 0, 'left', 'bottom');
                expect(calculatePosition(getElem('#targetElement'), 'left', 'Bottom')).
                    toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
                 //Expected - target element position left bottom.
                //ToEqual - popup Element position left top.
            });
            it('Validation Element position - Left', () => {
                removePopup();
                let elem: Node = getPop('Am a Left Element');
                collision.flip(
                    <HTMLElement>elem,
                    <HTMLElement>getElem('#targetElement'),
                    - ((<Element>elem).clientWidth + 2),
                    0,
                    'left',
                    'top');
                let tempP: OffsetPosition = calculatePosition(getElem('#targetElement'), 'left', 'top');
                tempP.left = tempP.left - getElem('.popup').clientWidth;
                 //Expected - popup Element position left top with manupulated left value.
                //ToEqual - popup Element position left top.
                expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                 toEqual(calculatePosition(getElem('.popup'), 'right', 'top'));
            }
            );
        });
    describe('(With Collision)-Element positioning.', () => {
        beforeAll(() => {
            removePopup();
            removeTarget();
        });
        afterAll(() => {
            removePopup();
            removeTarget();
        });

        it('Element position -Left', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let popElem: Node = getPop('Am a Left Element');
            collision.flip(
                <HTMLElement>popElem,
                <HTMLElement>getElem('#targetElement'),
                -(<Element>popElem).getBoundingClientRect().width,
                0,
                'left',
                'top');
            //Expected - target Element position right top.
            //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'Right', 'top', )).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -left with X Axis', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let popElem: Node = getPop('Am a Left Element');
            collision.flip(
                <HTMLElement>popElem,
                <HTMLElement>getElem('#targetElement'),
                -(<Element>popElem).getBoundingClientRect().width,
                0,
                'left',
                'top',
                null,
                {X:true,Y:false});
            //Expected - target Element position right top.
            //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'Right', 'top', )).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -Right', () => {
            removeTarget();
            removePopup();
            let popupElement: HTMLElement = <HTMLElement>getPop('Am a Right Element');
            if (getViewPortWidth() > 400 ) {
                appendTarget('margin: 40px ' + (getViewPortWidth() - 300) + 'px;');
            } else {
                let elem: HTMLDivElement = document.createElement('div');
                if (getTargetElement()) {
                    (getTargetElement().remove());
                }
                if (getElem('#drop')) {
                     getElem('#drop').remove();
                }
                elem.innerHTML = '<div id="targetElement" style="height: 30px;width:' +
                ' 130px;border-color: green;margin-right: 20px;margin-top: 40px; margin-left:' +
                (getViewPortWidth() - 240) + 'px;' + ';border-style: solid;border-width: 1px;padding: 39px;">Am a target</div>';
                document.body.appendChild(elem.firstChild);
                popupElement.style.width = '80px';
            }
            let element1Rect = popupElement.getBoundingClientRect();
            collision.flip(popupElement, <HTMLElement>getElem('#targetElement'), 0, 0, 'right', 'top');
            //Expected - target Element position left top.
            //ToEqual - popup Element position right top
            let value = calculatePosition(getElem('#targetElement'), 'left', 'top');
            value.left += parseInt((<HTMLElement>getElem('.popup')).style.height, 10);
            expect(value).toEqual(calculatePosition(getElem('.popup'), 'right', 'top', false, element1Rect));
        });
        it('Element position -Top', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 40px 240px;');
            let eleme: Node = getPop('Am a Top Element');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                0,
                -(<Element>eleme).getBoundingClientRect().height,
                'left',
                'top');
            //Expected - target Element position left bottom.
            //ToEqual - popup Element position left top
            expect(calculatePosition(getElem('#targetElement'), 'left', 'Bottom')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -Top with Y Axis', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 40px 240px;');
            let eleme: Node = getPop('Am a Top Element');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                0,
                -(<Element>eleme).getBoundingClientRect().height,
                'left',
                'top',
                null,
                {X:false,Y:true});
            //Expected - target Element position left bottom.
            //ToEqual - popup Element position left top
            expect(calculatePosition(getElem('#targetElement'), 'left', 'Bottom')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -Bottom', () => {
            removeTarget();
            removePopup();
            let popupElement: HTMLElement = <HTMLElement>getPop('Am a Bottom Element');
            if (getViewPortHeight() > 400) {
                appendTarget('margin: ' + (getViewPortHeight() - 150) + 'px 40px;');
            } else {
                let elem: HTMLDivElement = document.createElement('div');
                if (getTargetElement()) {
                    (getTargetElement().remove());
                }
                if (getElem('#drop')) {
                    getElem('#drop').remove();
                }
                elem.innerHTML = '<div id="targetElement" style="height: 150px;width: 130px;' +
                    'border-color: green;margin-bottom:10px;margin-right: 20px;margin-top: '
                    + (getViewPortHeight() - 150)
                    + 'px; margin-left:40px;border-style: solid;border-width: 1px;padding: 39px;">Am a target</div>';
                document.body.appendChild(elem.firstChild);
            }
            collision.flip(popupElement, <HTMLElement>getElem('#targetElement'), 0, 0, 'left', 'bottom');
            //Expected - target Element position left top.
            //ToEqual - popup Element position left bottom.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'bottom'));
        });
        it('Element position -(View port LeftTop (i)) top', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 85px -70px;');
            let eleme: Node = getPop('Am a Top Element');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                0,
                -(<Element>eleme).getBoundingClientRect().height,
                'left',
                'top');
            //Expected - target Element position left bottom.
            //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'bottom')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));

        });
        it('Element position -(View port LeftTop (ii)) left', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: -55px 500px 300px 98px;');
            let eleme: Node = getPop('Am a Left Element');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                -(<Element>eleme).getBoundingClientRect().width,
                0,
                'left',
                'top');
            //Expected - target Element position left top.
            //ToEqual - popup Element position right top.
            expect(calculatePosition(getElem('#targetElement'), 'right', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -(View port RightTop (ii)) top', () => {
            removeTarget();
            removePopup();
            let popElem: Node = getPop('Am a top Element');
            
            appendTarget(
                'margin-top: 60px;margin-left:' +
                (getViewPortWidth() > 400 ? (getViewPortWidth() - 100) : (getViewPortWidth() - 75))
                 + 'px;margin-bottom: 900px;');
            (<HTMLElement>popElem).style.width = '200px';
            (<HTMLElement>popElem).style.width = '100px';
            
            collision.flip(
                <HTMLElement>popElem,
                <HTMLElement>getElem('#targetElement'),
                0,
                -(<Element>popElem).getBoundingClientRect().height,
                'left',
                'top');
            //Expected - target Element position left top.
            //ToEqual - popup Element position left bottom.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'bottom')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
                
        });
        it('Element position -(View port RightTop (ii)) Right', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: -60px 50px 100px ' + (getViewPortWidth() - 200) + 'px;');
            let popupEle = <HTMLElement>getPop('Am a Right Element');
            collision.flip(
                popupEle,
                <HTMLElement>getElem('#targetElement'),
                0,
                0,
                'right',
                'top');
            let eleRect = popupEle.getBoundingClientRect();
            let value = calculatePosition(getElem('#targetElement'), 'left', 'top');
            value.left += parseInt((<HTMLElement>getElem('.popup')).style.height, 10);
            //Expected - target Element position right top.
            //ToEqual - popup Element position left top.
            expect(value).toEqual(calculatePosition(getElem('.popup'), 'right', 'top', false, eleRect));
        });
        it('Element position -(View port RightBottom (i)) Right', () => {

            removeTarget();
            removePopup();            
            appendTarget('margin: -60px 50px 100px ' + (getViewPortWidth() - 200) + 'px;');
            let popupEle = <HTMLElement>getPop('Am a Right Element');
            collision.flip(popupEle, <HTMLElement>getElem('#targetElement'), 0, 0, 'right', 'top');
            let eleRect = popupEle.getBoundingClientRect();
            let value = calculatePosition(getElem('#targetElement'), 'left', 'top');
            value.left += parseInt((<HTMLElement>getElem('.popup')).style.height, 10);
              //Expected - target Element position right top.
            //ToEqual - popup Element position left top.
            expect(value).toEqual(calculatePosition(getElem('.popup'), 'right', 'top', false, eleRect));
        });
        it('Element position -(View port RightBottom (ii)) Bottom', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: ' + (getViewPortHeight() - 150) + 'px 50px 50px ' + (getViewPortWidth() - 45) + 'px;');
            collision.flip(<HTMLElement>getPop('Am a Bottom Element'), <HTMLElement>getElem('#targetElement'), 0, 0, 'left', 'bottom');
            //Expected - target Element position left bottom.
            //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'bottom'));

        });
        it('Element position -(View port LeftBottom (i)) left', () => {
            removeTarget();
            removePopup();
            let eleme: Node = getPop('Am a Top Element');
            appendTarget('margin: ' + (getViewPortHeight() - 150) + 'px  -35px;');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                -(<Element>eleme).getBoundingClientRect().width,
                0,
                'left',
                'top');
          //Expected - target Element position left top.
            //ToEqual - popup Element position right top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'right', 'top'));
        });
        it('Element position -(View port LeftBottom (ii)) top', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: ' + (getViewPortHeight() ? (getViewPortHeight() - 150) : 150) + 'px -58px;');
            let eleme: Node = getPop('Am a Bottom Element');
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                0,
                -((<HTMLElement>eleme).clientHeight + 2),
                'left',
                'top');
            //Expected - target Element position left bottom.
            //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'bottom'));
        });
    });
    describe('(With Collision,without flip.)-Element positioning.', () => {
        beforeAll(() => {
            removePopup();
            removeTarget();
        });
        afterAll(() => {
            removePopup();
            removeTarget();
        });
        it('Element position -Top with large height', () => {
            removeTarget();
            removePopup();
            appendTarget('margin-top:340px;margin-left:130px;');
            let eleme: Node = getPop('Am a Top Element');
            (<HTMLElement>eleme).style.height = getViewPortHeight() + 100 + 'px';
            (<HTMLElement>eleme).style.width = '400px';
            collision.flip(
                <HTMLElement>eleme,
                <HTMLElement>getElem('#targetElement'),
                0,
                -(<Element>eleme).getBoundingClientRect().height,
                'left',
                'top');
           //Expected - target Element position left top.
            //ToEqual - popup Element position left bottom.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'Bottom'));
        });
        it('Element position -Bottom with large height', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: ' + (getViewPortHeight() - 150) + 'px 40px;');
            let popElem: Node = getPop('Am a Bottom Element');
            (<HTMLElement>popElem).style.height = '1400px';
            collision.flip(<HTMLElement>popElem, <HTMLElement>getElem('#targetElement'), 0, 0, 'left', 'bottom');
                //Expected -target Element position left bottom.
                //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'bottom')).
                toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -Left large width', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let popElem: Node = getPop('Am a Left Element');
            (<HTMLElement>popElem).style.width = '1400px';
            collision.flip(
                <HTMLElement>popElem,
                <HTMLElement>getElem('#targetElement'),
                -(<Element>popElem).getBoundingClientRect().width,
                0,
                'left',
                'top');
                //Expected -target Element position left top.
                //ToEqual - popup Element position right top.
            expect(calculatePosition(getElem('#targetElement'), 'left', 'top')).
                toEqual(calculatePosition(getElem('.popup'), 'right', 'top'));
        });
        it('Element position -right large width', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let popElem: Node = getPop('Am a Left Element');
            (<HTMLElement>popElem).style.width = '1400px';
            collision.flip(<HTMLElement>popElem, <HTMLElement>getElem('#targetElement'), 0, 0, 'right', 'top');
                //Expected -target Element position right top.
                //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'right', 'top')).
            toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('Element position -right large popup with relative parent ', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let container: HTMLElement = document.createElement('div');
            container.style.position = 'relative';
            container.style.left = '200px';
            container.style.top = '300px';
            let popElem: Node = getPop('Am a Left Element', container);
            (<HTMLElement>popElem).style.width = '1400px';
            collision.flip(<HTMLElement>popElem, <HTMLElement>getElem('#targetElement'), 0, 0, 'right', 'top');
                //Expected -target Element position right top.
                //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'right', 'top')).
            toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
            container.remove();
        });
        it('Element position -right large popup with absolute parent ', () => {
            removeTarget();
            removePopup();
            appendTarget('margin: 240px 50px;');
            let container: HTMLElement = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '200px';
            container.style.top = '300px';
            let popElem: Node = getPop('Am a Left Element', container);
            (<HTMLElement>popElem).style.width = '1400px';
            collision.flip(<HTMLElement>popElem, <HTMLElement>getElem('#targetElement'), 0, 0, 'right', 'top');
                //Expected -target Element position right top.
                //ToEqual - popup Element position left top.
            expect(calculatePosition(getElem('#targetElement'), 'right', 'top')).
            toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
            container.remove();
        });
    });
    describe('improper function Params scenario-', () => {
        beforeAll(() => {
            removePopup();
            removeTarget();
        });
        afterAll(() => {
            removePopup();
            removeTarget();
        });
        it('API Call with null target element', () => {
                removePopup();
                let elem: Node = getPop('Am a Right Element');
                let pos: OffsetPosition = calculatePosition(getElem('.popup'), 'left', 'top');
                collision.flip(<HTMLElement>elem, null, 0, 0, 'Right', 'top');
                //No Position Changes with the popup Element
                //Expected - popup element position lef top.
                //ToEqual - popup Element position left top.
                expect(pos)
                    .toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('API Call with null popup element', () => {
                removePopup();
                let elem: Node = getPop('Am a Right Element');
                let pos: OffsetPosition = calculatePosition(getElem('.popup'), 'left', 'top');
                collision.flip(<HTMLElement>elem, null, 0, 0, 'Right', 'top');
                //No Position Changes with the popup Element
                //Expected - target element position right top.
                //ToEqual - popup Element position left top.
                expect(pos)
                    .toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
        it('API Call with null Position', () => {
                removePopup();
                let elem: Node = getPop('Am a Right Element');
                let pos: OffsetPosition = calculatePosition(getElem('.popup'), 'left', 'top');
                collision.flip(<HTMLElement>elem,  <HTMLElement>getElem('#targetElement'), 0, 0, null, null);
                //No Position Changes with the popup Element
                //Expected - target element position lef top.
                //ToEqual - popup Element position left top.
                expect(pos)
                    .toEqual(calculatePosition(getElem('.popup'), 'left', 'top'));
        });
    });
    describe('flip function scenario - with container', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
         it('without collide Element position - Top', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,-100,"left","top",targetContainer);
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"left","bottom"));
            removeContainerContent();
         });
         it('without collide Element position - Right', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,0,"right","top",targetContainer);
             let elementRect = target.getBoundingClientRect();
             expect(calculatePosition(target,"right","top", false, elementRect)).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Right-Target not in viewport scenario', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin = '141px 141px 141px 438px';
             collision.flip(element,target,0,0,"right","top",targetContainer);
             expect(calculatePosition(target,"right","top",false,target.getBoundingClientRect())).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Bottom', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,0,"left","bottom",targetContainer);
             expect(calculatePosition(target,"left","bottom")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Bottom-Target not in viewport scenario', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin = '416px 141px 141px 141px';
             collision.flip(element,target,0,0,"left","bottom",targetContainer);
             expect(calculatePosition(target,"left","bottom")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Left', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,-100,0,"left","top",targetContainer);
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"right","top"));
            removeContainerContent();
         });
         it('collide Element position - Top', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             
             element.style.height="150px";
             collision.flip(element,target,0,-150,"left","top",targetContainer);
             expect(calculatePosition(target,"left","bottom")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('collide Element position - Right', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin="210px";
             element.style.width="150px";
             collision.flip(element,target,0,0,"right","top",targetContainer);
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"right","top", false, target.getBoundingClientRect()));
            removeContainerContent();
         });
         it('collide Element position - Bottom', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin="210px";
             element.style.height="150px";
             collision.flip(element,target,0,0,"left","bottom",targetContainer);
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"left","bottom"));
            removeContainerContent();
         });
         it('collide Element position - Left', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             element.style.width="150px";
             collision.flip(element,target,-150,0,"left","top",targetContainer);
             expect(calculatePosition(target,"right","top")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
    });
    describe('flip function scenario - with Window', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
         it('without collide Element position - Top', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target = <HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,-100,"left","top");
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"left","bottom"));
            removeContainerContent();
         });
         it('without collide Element position - Right', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,0,"right","top");
             expect(calculatePosition(target,"right","top", false, target.getBoundingClientRect())).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Bottom', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'), targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,0,0,"left","bottom");
             expect(calculatePosition(target,"left","bottom")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('without collide Element position - Left', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             collision.flip(element,target,-100,0,"left","top");
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"right","top"));
            removeContainerContent();
         });
         it('collide Element position - Top', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin = "-70px";
             element.style.height = "150px";
             collision.flip(element,target,0,-150,"left","top");
             expect(calculatePosition(target,"left","bottom")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
         it('collide Element position - Right', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin = "290px "+(window.innerWidth-350)+"px"
             element.style.width = "150px";
             collision.flip(element,target,0,0,"right","top");
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"right","top",false,target.getBoundingClientRect()));
            removeContainerContent();
         });
         it('collide Element position - Bottom', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),target=<HTMLElement>getElem('#target'),targetContainer=<HTMLElement>getElem('#targetContainer');
             target.style.margin = (window.innerHeight-250)+"px 290px ";
             element.style.height="150px";
             collision.flip(element,target,0,0,"left","bottom");
             expect(calculatePosition(target,"left","top")).
                    toEqual(calculatePosition(element,"left","bottom"));
            removeContainerContent();
         });
         it('collide Element position - Left', () => {
             appendContainerContent();
             let element:HTMLElement = <HTMLElement>getElem('#popup'),
             target = <HTMLElement>getElem('#target'), targetContainer = <HTMLElement>getElem('#targetContainer');
             target.style.margin = "-70px -148px"
             element.style.width = "150px";
             collision.flip(element,target,-150,0,"left","top");
             expect(calculatePosition(target,"right","top")).
                    toEqual(calculatePosition(element,"left","top"));
            removeContainerContent();
         });
        });
    describe('isCollide function scenario-Container', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
         it('collide Element position - Top', () => {
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 140px;top: -35px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['top']);
         });
         it('collide Element position - Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 330px;top: 30px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['right']);
         });
         it('collide Element position - bottom', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 150px;top: 325px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['bottom']);
         });
         it('collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: -48px;top: 142px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['left']);
         });
         it('without-collide Element position - Top', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 410px; top: 148px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 432px; top: 248px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - bottom', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 410px; top: 348px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 310px; top: 248px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });

         it('Relative scrolable parent-collide Element position - Top', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 127px;top: -55px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['top']);
         });
         it('Relative scrolable parent-collide Element position - Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 313px;top: 138px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['right']);
         });
         it('Relative scrolable parent-collide Element position - bottom', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 142px;top: 316px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['bottom']);
         });
         it('Relative scrolable parent-collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: -36px;top: 144px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual(['left']);
         });
         it('Relative scrolable parent-without-collide Element position - Top', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 140px; top: 40px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('Relative scrolable parent-without-collide Element position - Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 240px; top: 140px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('Relative scrolable parent-without-collide Element position - bottom', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 140px; top: 240px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
         });
         it('Relative scrolable parent- without-collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 40px; top: 140px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'),<HTMLElement>getElem('#targetContainer'));
             expect(collideData).
                    toEqual([]);
            removeContainerContent();
         });
         it('collide Element position - Top and left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: -35px;top: -35px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'));
             expect(collideData).toEqual(['top', 'left']);
         });
         it('collide Element position - Top and Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 330px;top: -30px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'));
             expect(collideData).toEqual(['top', 'right']);
         });
         it('collide Element position - Bottom and Left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: -40px;top: 325px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'));
             expect(collideData).toEqual(['left', 'bottom']);
         });
         it('collide Element position - Bottom and Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 330px;top: 325px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'));
             expect(collideData).toEqual(['right', 'bottom']);
         });
    });
    describe('isCollide function with x and y coordinates', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
        it('collide Element X position - Left', () => {
            removeContainerContent();
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 30px;top: 25px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'), -30);
            expect(collideData).toEqual(['left']);
        });
        it('collide Element Y position - Top', () => {
            removeContainerContent();
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 30px;top: 25px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'), null, -30);
            expect(collideData).toEqual(['top']);
        });
        it('collide Element X and Y position - Top and Right', () => {
            removeContainerContent();
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 30px;top: 25px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let collideData: string[] = collision.isCollide(<HTMLElement>getElem('#popup'), <HTMLElement>getElem('#targetContainer'), 500, 50);
            expect(collideData).toEqual(['top', 'right']);
        });
    });
    describe('isCollide function scenario-Window', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
         it('collide Element position - Top', () => {
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 313px;top: -25px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual(['top']);
         });
         it('collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: -31px;top: 138px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual(['left']);
         });
         it('without-collide Element position - Top', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 410px; top: 148px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - Right', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 432px; top: 248px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - bottom', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 410px; top: 348px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual([]);
         });
         it('without-collide Element position - left', () => {
             removeContainerContent();
             let elem: HTMLDivElement = document.createElement('div');
             elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 420px; width: 400px; background: rgb(78, 105, 156); margin: 100px 0px 50px 165px; float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 310px; top: 248px;"></div></div>';
             document.body.appendChild(elem.firstChild);
             let collideData:string[]=collision.isCollide(<HTMLElement>getElem('#popup'));
             expect(collideData).
                    toEqual([]);
         });
     });
     describe('fit function scenario test cases', () => {
        beforeAll(() => {
            removeContainerContent();
        });
        afterAll(() => {
            removeContainerContent();
        });
        it('without collide Element position - Left - with container', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 200px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer, {X:true,Y:false},pos);
            expect(fitpos.left).toEqual(pos.left);
            removeContainerContent();
        });
        it('collide Element position - Left - without element position', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 100px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:false});
            expect(fitpos.left).toEqual(173);
            removeContainerContent();
        });
        it('collide Element position - Left - without container,fit relative to window', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: -50px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup');
            let fitpos: OffsetPosition = collision.fit(element,null,{X:true,Y:false});
            expect(fitpos.left).toEqual(0);
            removeContainerContent();
        });
        it('collide Element position - Right - with container', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 500px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer, {X:true,Y:false}, pos);
            expect(fitpos.left).toEqual(473);
            removeContainerContent();
        });
        it('collide Element position - Left - with container', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 100px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:false} ,pos);
            expect(fitpos.left).toEqual(173);
            removeContainerContent();
        });
        it('Element width greater than container width, position - Right - with container test cases', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 500px; background: rgb(88, 82, 82); position: absolute; left: 500px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:false} ,pos);
            expect(fitpos.left).toEqual(173);
            removeContainerContent();
        });
        it('Element width greater than container width, position - Left - with container test cases', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 500px; background: rgb(88, 82, 82); position: absolute; left: 0px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer, {X:true,Y:false}, pos);
            expect(fitpos.left).toEqual(73);
            removeContainerContent();
        });
        it('Element width greater than container width, position - Left and Right - with container test cases', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 500px; background: rgb(88, 82, 82); position: absolute; left: 100px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:false}, pos);
            expect(fitpos.left).toEqual(73);
            removeContainerContent();
        });
        it('Element width greater than container width, position - Left and Right - with container test cases', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 500px; background: rgb(88, 82, 82); position: absolute; left: 130px; top: 248px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let pos: OffsetPosition = calculatePosition(element);
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:false},pos);
            expect(fitpos.left).toEqual(173);
            removeContainerContent();
        });

        //Top Fit
        
        it('collide Element position - Top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            expect(targetContainer.getBoundingClientRect().top).toEqual(fitpos.top);
            removeContainerContent();
        });

        it('collide Element position - bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: rgb(88, 82, 82);position: absolute;left: 313px;top: 451px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let targetRect=targetContainer.getBoundingClientRect();
            let elementRect=element.getBoundingClientRect();
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            expect((
                targetRect.top + 
                targetRect.height -
                elementRect.height))
            .toEqual(fitpos.top);
            removeContainerContent();
        });
        it('collide Element position - Top large', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 500px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 313px;top: -284px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            let targetRect=targetContainer.getBoundingClientRect();
            let elementRect=element.getBoundingClientRect();
            expect((
                targetRect.top + 
                targetRect.height -
                elementRect.height)).toEqual(fitpos.top);
            removeContainerContent();
        });

        it('collide Element position - bottom large', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 500px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 313px;top: 451px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');            
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            expect(targetContainer.getBoundingClientRect().top)
            .toEqual(fitpos.top);
            removeContainerContent();
        });

        it('collide Element position - top large and larger than container. ', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 500px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 313px;top: 30px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            let targetRect=targetContainer.getBoundingClientRect();
            let elementRect=element.getBoundingClientRect();
            expect((
                targetRect.top + 
                targetRect.height -
                elementRect.height))
            .toEqual(fitpos.top);
            removeContainerContent();
        });

        it('collide Element position - bottom large and larger than container.', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 500px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 313px;top: 92px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:false,Y:true});
            expect(targetContainer.getBoundingClientRect().top).toEqual(fitpos.top);
            removeContainerContent();
        });
        //both X and Y axis.

        it('collide Element position - Top left', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 101px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 138px;top: 80px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:true});
            
            expect(fitpos).toEqual(calculatePosition(targetContainer));
            removeContainerContent();
        });
        it('collide Element position - Top right', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 101px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 510px;top: 80px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:true});
            let targetPos:OffsetPosition = calculatePosition(targetContainer,'right','top')
            let elementRect=element.getBoundingClientRect();
            expect(fitpos).toEqual({top:targetPos.top,left:(targetPos.left-elementRect.width)});
            removeContainerContent();
        });
        it('collide Element position - Bottom left', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 101px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 135px;top: 444px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:true});
            let targetPos:OffsetPosition = calculatePosition(targetContainer,'left','bottom')
            let elementRect=element.getBoundingClientRect();
            expect(fitpos).toEqual({top:(targetPos.top-elementRect.height),left:targetPos.left});            
            removeContainerContent();
        });
        it('collide Element position - Bottom right', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 101px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: 510px;top: 450px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element, targetContainer,{X:true,Y:true});
            let targetPos:OffsetPosition = calculatePosition(targetContainer,'right','bottom')
            let elementRect = element.getBoundingClientRect();
            expect(fitpos).toEqual({top:(targetPos.top-elementRect.height),left:(targetPos.left-elementRect.width)});
            removeContainerContent();
        });

        // Invalid parametter check.
        it('With out passing valid parametters', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px; width: 100px; background: rgb(88, 82, 82); position: absolute; left: 315px;top: 85px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element);
            expect({left:0,top:0}).toEqual(fitpos);
            removeContainerContent();
        });
        it('Element positioning with window- Top left', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 101px;width: 101px;background: rgb(88, 82, 82);position: absolute;left: -30px;top: -30px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element,null,{X:true,Y:true});
            expect({left:0,top:0}).toEqual(fitpos);
            removeContainerContent();
        });
        it('Element positioning with window- Top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: rgb(88, 82, 82);position: absolute;left: 315px;top: -53px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element,null,{X:true,Y:true});
            expect(0).toEqual(fitpos.top);
            removeContainerContent();
        });
        it('Element positioning with window- bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 200px;width: 100px;background: rgb(88, 82, 82);position: absolute;left: 315px;top: '+(getViewPortHeight()-150)+'px;"></div></div>';
            document.body.appendChild(elem.firstChild);
            let element: HTMLElement = <HTMLElement>getElem('#popup'), targetContainer = <HTMLElement>getElem('#targetContainer');
            let fitpos: OffsetPosition = collision.fit(element,null,{X:true,Y:true});
            let elementRect=element.getBoundingClientRect();
            expect(getViewPortHeight()-elementRect.height).toEqual(fitpos.top);
            removeContainerContent();
        });
        

        });
});
function appendContainerContent(){
     let elem: HTMLDivElement = document.createElement('div');
     elem.innerHTML='<div id="targetContainer" class="flex-item" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;margin: 140px;"></div><div id="popup" style="height: 100px;width: 100px;background: #585252;position: absolute;left: 313px;top: 138px;"></div></div>';
    document.body.appendChild(elem.firstChild)
}
function removeContainerContent(){
    if (getElem('#targetContainer')) {
        getElem('#targetContainer').remove();
    }
}

function getViewPortHeight(): number {
    return window.innerHeight;
}
function getViewPortWidth(): number {
    return window.innerWidth;
}