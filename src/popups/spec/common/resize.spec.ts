import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createResize, ResizeArgs, removeResize, setMaxWidth, setMaxHeight } from '../../src/common/resize';

describe('Resize Plugin', () => {
    let dialog: any;
    beforeAll(() => {
        let resizeTarget = createElement('div', { id: 'resizetarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '300px';
        resizeTarget.style.height = '300px';
        let argument: ResizeArgs = {
            element: '#resizetarget',
            direction: 'south-east south-west north-east north-west north south east west',
            minHeight: 140,
            maxHeight: 500,
            minWidth: 150,
            maxWidth: 500,
            resizeBegin: OnresizeStart,
            resizeComplete: OnresizeEnd,
            resizing: Onresizing,
            proxy: dialog
        }
        createResize(argument)
        function OnresizeStart() {    }

        function OnresizeEnd() {   }

        function Onresizing() {    }

    });

    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Checking handlers', () => {
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-south-west'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-east'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-north-east'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-north-west'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-west'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-south'))).toBe(true);
        expect(!isNullOrUndefined(document.querySelector('.e-north'))).toBe(true);
    });

    it('Removing resize', () => {
        removeResize();
        expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-south-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-south'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north'))).toBe(true);
    })
});

describe('Resize Plugin', () => {
    let dialog: any;
    
    beforeAll(() => {
        let resizeTarget = createElement('div', { id: 'resizetarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '300px';
        resizeTarget.style.height = '300px';
        let argument: ResizeArgs = {
            element: document.querySelector('#resizetarget') as HTMLElement,
            direction: 'south-east',
            minHeight: 140,
            maxHeight: 500,
            minWidth: 150,
            maxWidth: 500,
            resizeBegin: OnresizeStart,
            resizeComplete: OnresizeEnd,
            resizing: Onresizing,
            proxy: dialog
        }
        createResize(argument)
        function OnresizeStart() {    }

        function OnresizeEnd() {   }

        function Onresizing() {    }

    });

    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Checking handlers', () => {
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-south-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north-east'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-south'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-north'))).toBe(true);
    });

    it('setMaxWidth method test', () => {
        setMaxWidth(300);
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });

    it('setMaxHeight method test', () => {
        setMaxHeight(600);
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });

    it('Removing resize', () => {
        removeResize();
        expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });
});