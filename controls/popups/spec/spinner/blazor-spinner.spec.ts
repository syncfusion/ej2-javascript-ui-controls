/**
 * spinner blazor spec document
 */

import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile} from './common.spec';
import { Spinner } from '../../src/spinner/spinner';
import '../../node_modules/es6-promise/dist/es6-promise';

describe('Spinner Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    let target: HTMLElement;
    let target_01: HTMLElement;
    let target_02: HTMLElement;
    describe('Blazor Spinner public methods', () => {
        beforeEach((): void => {
            target = createElement('div', { id: 'spinner-01', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target);
            target_01 = createElement('div', { id: 'spinner-02', className: 'spinner-demo', styles: 'width: 400px;height: 400px;border: 1px solid red; display: block;position: relative;' });
            document.body.appendChild(target_01);
        });
        afterEach((): void => {
            target.remove();
            target_01.remove();
        });
        it('Ensure show and hide spinner testing', () => {
            let spinObject = Spinner("Create", { 
                target: '#spinner-01',
                    width: 50,
                    label:"Loading..."
            }, null, 'Material');
            let spinObject_01 = Spinner("Create", { 
                target: '#spinner-02',
                    width: 50,
                    label:"Loading..."
            }, null, 'Material');
            let container = document.getElementById('spinner-01');
            let container1 = document.getElementById('spinner-02');
            Spinner('Show', null, '#spinner-01', null);
            Spinner('Show', null, '#spinner-02', null);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-show')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-show')).toEqual(true);
            Spinner('Hide', null, '#spinner-01', null);
            expect((container.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-hide')).toEqual(true);
            expect((container1.querySelector('.e-spinner-pane') as HTMLElement).classList.contains('e-spin-hide')).toEqual(false);
            Spinner('Show', null, '#spinner-01', null);
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});