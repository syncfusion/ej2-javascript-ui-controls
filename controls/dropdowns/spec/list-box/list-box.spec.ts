/**
 * 
 */
import { createElement } from '@syncfusion/ej2-base';
import { ListBox } from '../../src/index';
import { cssClass } from '@syncfusion/ej2-lists';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

ListBox.Inject(CheckBoxSelection);

let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

describe('ListBox', () => {
    let listObj: any;
    let li: any;

    describe('Selection', () => {
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('Normal', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            li = listObj.element.parentElement.getElementsByClassName(cssClass.li);
            li[0].click();
            expect(li[0].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');

            li[1].click();
            expect(li[0].classList).not.toContain(cssClass.selected);
            expect(li[1].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C#');
        });


        it('Ctrl', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            li = listObj.element.parentElement.getElementsByClassName(cssClass.li);
            li[2].click();
            listObj.clickHandler({ target: li[3], ctrlKey: true });
            expect(li[2].classList).toContain(cssClass.selected);
            expect(li[3].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C++');
            expect(listObj.value[1]).toEqual('.NET');

            listObj.clickHandler({ target: li[4], ctrlKey: true });
            expect(li[4].classList).toContain(cssClass.selected);
            expect(listObj.value[2]).toEqual('Oracle');

            listObj.clickHandler({ target: li[3], ctrlKey: true });
            expect(li[3].classList).not.toContain(cssClass.selected);

            listObj.selectionSettings.mode = 'Single';
            listObj.clickHandler({ target: li[0], ctrlKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.value.length).toEqual(1);
            listObj.selectionSettings.mode = 'Multiple';
        });

        it('Shift', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            li = listObj.element.parentElement.getElementsByClassName(cssClass.li);
            li[2].click();
            listObj.clickHandler({ target: li[0], shiftKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[1].classList).toContain(cssClass.selected);
            expect(li[2].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.value[1]).toEqual('C#');
            expect(listObj.value[2]).toEqual('C++');

            listObj.clickHandler({ target: li[4], shiftKey: true });
            expect(li[0].classList).not.toContain(cssClass.selected);
            expect(li[1].classList).not.toContain(cssClass.selected);
            expect(li[2].classList).toContain(cssClass.selected);
            expect(li[3].classList).toContain(cssClass.selected);
            expect(li[4].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C++');
            expect(listObj.value[2]).toEqual('Oracle');

            listObj.selectionSettings.mode = 'Single';
            listObj.clickHandler({ target: li[0], shiftKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.value.length).toEqual(1);
            listObj.selectionSettings.mode = 'Multiple';
        });

        it('Checkbox', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true } }, elem);
            let liEle: any = listObj.element.parentElement.getElementsByClassName(cssClass.li);
            liEle[2].click();
            expect(liEle[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C++');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            liEle[4].click();
            expect(listObj.value[1]).toEqual('Oracle');
            expect(liEle[4].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            liEle[2].click();
            expect(listObj.value[0]).not.toEqual('C++');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
        });

        it('Selected Options', () => {
            listObj = new ListBox({ dataSource: data, value: ['C#', 'C++'] }, elem);
            let liEle: any = listObj.element.parentElement.getElementsByClassName(cssClass.li);
            expect(liEle[1].classList).toContain(cssClass.selected);
            expect(liEle[2].classList).toContain(cssClass.selected);
        });
    });

    describe('Property', () => {
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        it('cssClass', () => {
            let listObj: any = new ListBox({ dataSource: data, cssClass: 'e-custom' }, elem);
            expect(listObj.element.parentElement.classList).toContain('e-custom');
            listObj.cssClass = 'e-custom2';
            listObj.dataBind();
            expect(listObj.element.parentElement.classList).toContain('e-custom2');
        });

        it('Rtl', () => {
            let listObj: any = new ListBox({ dataSource: data, enableRtl: true }, elem);
            expect(listObj.element.parentElement.classList).toContain('e-rtl');
            listObj.enableRtl = false;
            listObj.dataBind();
            expect(listObj.element.parentElement.classList).not.toContain('e-rtl');
        });
    });


});