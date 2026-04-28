import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement, Browser } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA' },
    { id: 'list2', text: 'C#' },
    { id: 'list3', text: 'C++' },
    { id: 'list4', text: '.NET' },
    { id: 'list5', text: 'Oracle' }
];

describe('MultiSelect - Group 23: Responsive & Mobile Modes', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement;
    beforeEach((): void => {
        element = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        document.body.appendChild(element);
    });
    afterEach((): void => {
        if (listObj) {
            listObj.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test 2: Should render in delimiter mode
     * Validates delimiter mode rendering
     */
    it('should render in delimiter mode', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            mode: 'Delimiter',
            delimiterChar: ','
        });
        listObj.appendTo(element);
        listObj.value = ['list1', 'list2', 'list3'];
        listObj.dataBind();
        let delimDisplay = element.parentElement.parentElement.querySelectorAll('.e-delim-view.e-delim-values')[0].textContent;
        expect(delimDisplay).toContain(',');
        done();
    });
    /**
     * Test 3: Should handle chip removal on mobile
     * Validates mobile chip interaction
     */
    it('should handle chip removal on mobile', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            mode: 'Box'
        });
        listObj.appendTo(element);
        listObj.value = ['list1', 'list2'];
        listObj.dataBind();
        let closeELe: HTMLElement = document.querySelector('.e-chips .e-chips-close');
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        closeELe.dispatchEvent(clickEvent);
        expect(listObj.value.length).toBe(1);
        done();
    });
    /**
     * Test 4: Should handle mobile keyboard interactions
     * Validates mobile-specific keyboard handling
     */
    it('should handle mobile keyboard interactions', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(listObj.value.length).toBeGreaterThan(0);
        done();
    });
});
