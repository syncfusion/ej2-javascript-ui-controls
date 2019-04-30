
/**
 * Position module testing specifications.
 */
import { calculatePosition, OffsetPosition,calculateRelativeBasedPosition } from '../../src/common/position';
import {createElement} from '@syncfusion/ej2-base';

describe('Position Module Specs', () => {
    let element: HTMLElement;
    let offset: OffsetPosition = { left: 228, top: 220 };
    function updateoffset(): void {
        offset = { left: getTargetElement().getBoundingClientRect().left, top: getTargetElement().getBoundingClientRect().top };
    }
    beforeAll(() => {
        //document.body.appendChild()
        if (getTargetElement()) {
            getTargetElement().remove();
        }
        element = createElement('div', { id: 'dialogSample' });
        element.innerHTML = '<div id="block"><div style="margin: 220px;"><button id="targetElement">TargetElement</button>  </div></div>';
        document.body.appendChild(element);
        updateoffset();

    });
    

    describe('Position calculation', () => {
        it('Params -left,bottom', () => {
            //Expected -Get the Element Position ~ Left--Bottom
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height with top
            expect(calculatePosition(getTargetElement(), 'left', 'bottom'))
            .toEqual({ left: offset.left, top: offset.top + (getTargetElement().getBoundingClientRect().height) });
        });
        it('Params -center,bottom', () => {
            //Expected -Get the Element Position ~ center--Bottom
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height with top and add width/2 with the left.
            expect(calculatePosition(getTargetElement(), 'center', 'bottom'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width / 2),
                top: offset.top + (getTargetElement().getBoundingClientRect().height) });
        });
        it('Params -right,bottom', () => {
            //Expected -Get the Element Position ~ right--Bottom
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height with top and add width with the left.
            expect(calculatePosition(getTargetElement(), 'right', 'bottom'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width),
                top: offset.top + (getTargetElement().getBoundingClientRect().height) });
        });

        it('Params -left,center', () => {
            //Expected -Get the Element Position ~ left--center
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height/2 with top.
            expect(calculatePosition(getTargetElement(), 'left', 'center'))
            .toEqual({ left: offset.left, top: offset.top + (getTargetElement().getBoundingClientRect().height / 2) });
        });
        it('Params -right,center', () => {
            //Expected -Get the Element Position ~ right--center
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height/2 with top and add the width with left.
            expect(calculatePosition(getTargetElement(), 'right', 'center'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width),
                top: offset.top + (getTargetElement().getBoundingClientRect().height / 2) });
        });
        it('Params -center,center', () => {
            //Expected - Get the Element Position ~ center--center
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left and add the height/2 with top and add width/2 with left.
            expect(calculatePosition(getTargetElement(), 'center', 'center'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width / 2),
                top: offset.top + (getTargetElement().getBoundingClientRect().height / 2) });
        });
        it('Params -left,top', () => {
            //Expected - Get the Element Position ~ left--top.
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left .
            expect(calculatePosition(getTargetElement(), 'left', 'top')).toEqual(offset);
        });
        it('Params -center,top', () => {
            //Expected -Get the Element Position ~ center--top.
            //ToEqual -Get the Element getBoundingClientRect ~ Top--Left and add height/2.
            expect(calculatePosition(getTargetElement(), 'center', 'top'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width / 2), top: offset.top });
        });
        it('Params -right,top', () => {
            //Expected -Get the Element Position ~ right--center
            //ToEqual -Get the Element getBoundingClientRect ~ Top--Left and add width.
            expect(calculatePosition(getTargetElement(), 'right', 'top'))
            .toEqual({ left: offset.left + (getTargetElement().getBoundingClientRect().width), top: offset.top });
        });

    });

    describe('with different Position css Values', () => {

        it('With Abosolute Element.', () => {
            (getTargetElement() as HTMLElement).style.position = 'absolute';
            (getTargetElement() as HTMLElement).style.left = '10px';
            (getTargetElement() as HTMLElement).style.top = '10px';
            updateoffset();
            //Expected - Get the Element Position ~ left--top with absolute parent.
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left
            expect(calculatePosition(getTargetElement(), 'left', 'top')).toEqual({ left: offset.left , top: offset.top });
        });
        it('With relative body element.', () => {

            document.body.style.position = 'relative';
            updateoffset();
            //Expected - Get the Element Position ~ left--top with relative parent.
            //ToEqual -Get the Element getBoundingClientRect ~ Top--Left
            expect(calculatePosition(getTargetElement(), 'left', 'top')).toEqual({ left: offset.left , top: offset.top  });
        });
        it('With relative parent with abosolute child.', () => {
            document.body.style.position = '';
            getTargetElement().parentElement.style.position = 'relative';
            (getTargetElement() as HTMLElement).style.position = 'abosolute';
            (getTargetElement() as HTMLElement).style.left = '10px';
            (getTargetElement() as HTMLElement).style.top = '10px';
            //Expected - Get the Element Position ~ left--top with relative parent element and element position abosolute.
            //ToEqual -Get the Element getBoundingClientRect ~ Top--Left
            updateoffset();
            expect(calculatePosition(getTargetElement(), 'left', 'top')).toEqual({ left: offset.left, top: offset.top });
        });
        it('inside the scroller content', () => {
            getTargetElement().parentElement.style.position = 'relative';
            (getTargetElement() as HTMLElement).style.position = 'abosolute';
            (document.body.querySelector('#block') as HTMLElement).style.height = '150px';
            (document.body.querySelector('#block') as HTMLElement).style.overflow = 'scroll';
            updateoffset();
            //Expected - Get the Element Position ~ left--top with relative parent element, element position abosolute with content parent.
            //ToEqual - Get the Element getBoundingClientRect ~ Top -- Left
            expect(calculatePosition(getTargetElement(), 'left', 'top')).toEqual({ left: offset.left , top: offset.top });
        });
    });
    describe('improper function Params scenario-', () => {
        it('API Call with null parameter', () => {
            // API CheckUps with null element
            //Expected - left:0,top:0.
            //ToEqual - left:0,top:0
            expect(calculatePosition(null, 'left', 'top')).toEqual({ left: 0 , top: 0 });
        });
        it('API Call with un attached element', () => {
            // API CheckUps with un attached document element.
            //Expected - left:0,top:0.
            //ToEqual - left:0,top:0
            expect(calculatePosition(createElement('div', { id: 'sample' }), 'left', 'top')).toEqual({ left: 0 , top: 0 });
        });
        it('API Call with with improper positionX, positionY', () => {
            //API CheckUps with improper positionX, positionY.
            //Expected - Get the Element Position ~ left--top.
            //ToEqual - Get the Element getBoundingClientRect ~ Top--Left .
             expect(calculatePosition(getTargetElement(), null, undefined))
            .toEqual({ left: offset.left, top: offset.top});
        });
    });

    

    afterAll(() => {
        element.remove();
    });
});
describe('Position calculation - calculateRelativeBasedPosition -', () => {
    let element: HTMLElement;
    let offset: OffsetPosition;
    let popup: HTMLElement;
    function updateoffset(): void {
        offset = { left: getTargetElement().getBoundingClientRect().left, top: getTargetElement().getBoundingClientRect().top };
    }
    beforeAll(() => {
        //document.body.appendChild()
        if (getTargetElement()) {
            getTargetElement().remove();
        }
        element = createElement('div', { id: 'dialogSample', styles:'position:absolute; margin:100px' });
        element.innerHTML = '<div id="block" style="position: absolute;margin: 203px;"><div style="margin: 220px;overflow: scroll;height: 77px;width: 182px;position: absolute;"><button id="targetElement" style="margin: 48px;">TargetElement</button>  </div></div>';
        document.body.appendChild(element);
        element.appendChild(createElement('div', { id: 'sampleElement',innerHTML:'Related Element', styles:'margin:"100px"'}));
        updateoffset();

    });
        it('Position Calculation with the different offset parent.', () => {
            //Expected - Relative Element Positions check ups.
            //ToEqual - {left: 471, top: 471}
            expect(calculateRelativeBasedPosition(<HTMLElement>getTargetElement(),<HTMLElement>document.querySelector("#sampleElement"))
            ).toEqual({left: 471, top: 471});
        });
        it('Invalid parametter checkups', () => {
            //Expected - Relative Element Positions check ups.
            //ToEqual - {left: 471, top: 471}
            expect(calculateRelativeBasedPosition(null,null)
            ).toEqual({left: 0, top: 0});
        });
});
function getTargetElement(): Element {
    return document.body.querySelector('#targetElement');
}