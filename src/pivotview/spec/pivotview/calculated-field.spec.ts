import { IDataSet, IAxisSet, ICalculatedFields } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EventHandler, getInstance, EmitType, deleteObject } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { ContextMenu, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { CalculatedFieldCreateEventArgs } from '../../src/common/base/interface';
import { Dialog } from '@syncfusion/ej2-popups';

describe('Calculated Field', () => {
    let originalTimeout: number;
    let pivotGridObj: PivotView;
    let cf: any;
    let mouseEvent: any;
    let tapEvent: any;
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:600px; width:100%' });
    PivotView.Inject(CalculatedField, GroupingBar, FieldList);
    beforeAll((done: Function) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        let dataBound: EmitType<Object> = () => { done(); };
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        pivotGridObj = new PivotView(
            {
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'state', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    calculatedFieldSettings: [{ name: 'price', formula: '"Sum(balance)"+"Count(quantity)"' }],
                    filterSettings: [
                        {
                            name: 'state', type: 'Include',
                            items: ['Delhi', 'Tamilnadu', 'New Jercy']
                        }
                    ],
                    rows: [{ name: 'state' }, { name: 'product' }],
                    columns: [{ name: 'eyeColor' }],
                    values: [{ name: 'balance' }, { name: 'quantity' },
                    { name: 'price', type: 'CalculatedField' }]
                },
                allowCalculatedField: true,
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound,
                calculatedFieldCreate: (args: CalculatedFieldCreateEventArgs)=>{
                   expect(args.calculatedField).toBeTruthy;
                   expect(args.cancel).toBe(false);
                   console.log('CreateCalcaltedFieldName: ' + args.calculatedField.name);
                }
            });
        pivotGridObj.appendTo('#PivotGrid');
    });
    it('Create Dialog', (done: Function) => {
        setTimeout(() => {
            cf = new CalculatedField(pivotGridObj);
            done();
        }, 100);
    });
    it('Open Dialog1', () => {
        expect((pivotGridObj.pivotValues[2][4] as IAxisSet).formattedText).toBe('$43,242.53');
        cf.createCalculatedFieldDialog(pivotGridObj);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('nodeExpanding event is triggered', () => {
        mouseEvent = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        tapEvent = {
            originalEvent: mouseEvent,
            tapCount: 1
        };
        let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[2].querySelector('.e-icons');
        cf.treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('drag and drop node to drop field', () => {
        let treeObj: any = cf.treeObj;
        let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
        mousemove = util.setMouseCordinates(mousemove, 150, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
        (document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value = '';
    });
    it('drag and drop node to drop field', () => {
        let treeObj: any = cf.treeObj;
        let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
        mousemove = util.setMouseCordinates(mousemove, 150, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
    });
    it('drag and drop node to drop field', () => {
        let treeObj: any = cf.treeObj;
        let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
        mousemove = util.setMouseCordinates(mousemove, 150, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
    });
    it('drag and drop node to drop field', () => {
        let treeObj: any = cf.treeObj;
        let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
        mousemove = util.setMouseCordinates(mousemove, 150, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
    });
    it('drag and drop node to drop field', () => {
        let treeObj: any = cf.treeObj;
        let filterAxiscontent: HTMLElement = document.querySelector('.e-pivot-treeview-outer');
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        let mousedown: any =
            util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any =
            util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-drag'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
        mousemove = util.setMouseCordinates(mousemove, 150, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value === null).toBeTruthy;
    });
    it('nodeCollapsing event is triggered', () => {
        let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
        mouseEventArgs.target = li[0].querySelector('.e-icons');
        tapEvent.originalEvent = mouseEventArgs;
        cf.treeObj.touchClickObj.tap(tapEvent);
        cf.treeObj.touchClickObj.tap(tapEvent);
        expect(true).toEqual(true);
    });
    it('OK Button Click1', () => {
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'
        ), MaskedTextBox) as MaskedTextBox).value =  'New';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        formatString.setProperties({ value: 'C0' });
        formatString.refresh();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog
        calcField.buttons[0].click();
    });
    it('Open Dialog2', () => {
        expect((pivotGridObj.pivotValues[2][4] as IAxisSet).formattedText).toBe('10');
        cf.createCalculatedFieldDialog(pivotGridObj);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('treeview click', () => {
        let treeObj: any = cf.treeObj;
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[1].querySelector('.e-format');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Context menu click', () => {
        const element: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + 'CalcContextmenu');
        let menuObj: any = element ? getInstance(element, ContextMenu) : undefined;
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
        let menu: any = {
            element: li[0]
        };
        menuObj.element.style.display = 'none';
        cf.selectContextMenu(menu as MenuEventArgs);
        expect(true).toBeTruthy();
    });
    it('treeview click', function () {
        expect(document.querySelector('#' + cf.parentID + 'CalcContextmenu')).toBeTruthy;
        var treeObj = cf.treeObj;
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[13].querySelector('.e-edit');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Edit Click', function () {
        var treeObj = cf.treeObj;
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[13].querySelector('.e-edited');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Clear Click', function () {
        var treeObj = cf.treeObj;
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[13].querySelector('.e-edit');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Edit Formula', function () {
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'
        ), MaskedTextBox) as MaskedTextBox).value =  'Price';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Price';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100/100';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        expect(formatString.value).toBe(null);
        formatString.setProperties({ value: 'P1' });
        formatString.refresh();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog
        calcField.buttons[0].click();
    });
    it('Open Dialog3', function () {
        expect((pivotGridObj.pivotValues[2][4] as IAxisSet).formattedText).toBe('1');
        cf.createCalculatedFieldDialog(pivotGridObj);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Open Dialog4', () => {
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'
        ), MaskedTextBox) as MaskedTextBox).value =  'price';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        formatString.setProperties({ value: 'C2' });
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog
        calcField.buttons[0].click();
    });
    it('OK Button Click2', () => {
        (document.querySelector('.e-ok-btn') as HTMLElement).click();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Open Dialog5', () => {
        expect((pivotGridObj.pivotValues[2][3] as IAxisSet).formattedText).toBe('10');
        cf.createCalculatedFieldDialog(pivotGridObj);
        const calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'), MaskedTextBox) as MaskedTextBox).value =  'price1';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('OK Button Click3', () => {
        let calcInfo: ICalculatedFields = { name: 'price1', formula: '10', formatString: '' };
        cf.replaceFormula(calcInfo);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Open Dialog6', () => {
        cf.createCalculatedFieldDialog(pivotGridObj);
        const calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'
        ), MaskedTextBox) as MaskedTextBox).value =  'price1';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100/*-78';
    });
    it('OK Button Click4', () => {
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[0].click();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Open Dialog7', () => {
        (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[1].click();
    });
    it('Cancel Button Click', () => {
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        (document.querySelector('.e-toggle-field-list') as HTMLElement).click();
    });
    it('check field list icon - calc open', () => {
        (document.querySelector('.e-calculated-field') as HTMLElement).click();
    });
    it('check field list icon', () => {
        let calcField: any = document.querySelector('#' + (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).parentID + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).parentID + 'ddlelement'
        ), MaskedTextBox) as MaskedTextBox).value = 'Pric';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Pric';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = 'balance*100';
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[1].click();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('check calculated field button for edit option1', () => {
        let rightAxisPanel: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(5);
        expect(pivotButtons[4].id).toBe('PivotGrid_PivotFieldList_New');
        (pivotButtons[4].querySelector('.e-edit') as HTMLElement).click();
    });
    it('check calculated field button for edit option2', () => {
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('Price');
        expect((document.querySelector('.e-pivot-formula') as any).value).toBe('100/100');
        expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
        let calcField: any = document.querySelector('#' + (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).parentID + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).parentID + 'ddlelement'), MaskedTextBox) as MaskedTextBox).value = 'New-1';
    });
    it('Update and close calculated field dialog1', () => {
        let calcField: any = document.querySelector('#' + (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).parentID + 'calculateddialog');
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[0].click();
    });
    it('Update and close calculated field dialog2', () => {
        let rightAxisPanel: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(5);
        expect(pivotButtons[4].id).toBe('PivotGrid_PivotFieldList_New');
        expect(pivotButtons[4].textContent).toBe('New-1');
        expect(document.getElementsByClassName('e-dialog').length).toBe(1);
    });
    it('close field list popup', () => {
        (document.getElementsByClassName('e-cancel-btn')[0] as any).click();
        (document.getElementsByClassName('e-cancel-btn')[0] as any).click();
    });
    it('check calculated field button for edit option in grouping bar', () => {
        let leftAxisPanel: HTMLElement = pivotGridObj.element.querySelector('.e-left-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(4);
        expect(pivotButtons[2].id).toBe('PivotGrid_price');
        (pivotButtons[2].querySelector('.e-edit') as HTMLElement).click();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('price');
        expect((document.querySelector('.e-pivot-formula') as any).value).toBe('10');
        expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
        const calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'), MaskedTextBox) as MaskedTextBox).value =  'Price-1';
    });
    it('Update and close calculated field dialog', () => {
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[0].click();
        let leftAxisPanel: HTMLElement = pivotGridObj.element.querySelector('.e-left-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(4);
        expect(pivotButtons[2].id).toBe('PivotGrid_price');
        expect(pivotButtons[2].textContent).toBe('Price-1');
    });
    it('Open Dialog8', () => {
        pivotGridObj.setProperties({ enableRtl: true }, true);
        pivotGridObj.enableRtl = true;
        cf.createCalculatedFieldDialog(pivotGridObj);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('treeview click', () => {
        let treeObj: any = cf.treeObj;
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[1].querySelector('.e-format');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    it('Context menu click', () => {
        const element: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + 'CalcContextmenu');
        let menuObj: any = element ? getInstance(element, ContextMenu) : undefined;
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
        let menu: any = {
            element: li[0]
        };
        menuObj.element.style.display = 'none';
        cf.selectContextMenu(menu as MenuEventArgs);
        expect(true).toBeTruthy();
    });
    it('check context menu click', () => {
        expect(document.querySelector('#' + cf.parentID + 'CalcContextmenu')).toBeTruthy;
        let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
        calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
        calcField.buttons[1].click();
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
});

describe(' - Opening the calculated dialog dialog', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
    let pivotDatas: IDataSet[] = [
        {
            _id: "5a940692c2d185d9fde50e5e",
            index: 0,
            guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
            isActive: "false",
            balance: 2430.87,
            advance: 7658,
            quantity: 11,
            age: 21,
            eyeColor: "blue",
            name: "Skinner Ward",
            gender: "male",
            company: "GROK",
            email: "skinnerward@grok.com",
            phone: "+1 (931) 600-3042",
            date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
            product: "Flight",
            state: "New Jercy",
            pno: "FEDD2340",
        },
        {
            _id: "5a940692c5752f1ed81bbb3d",
            index: 1,
            guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
            isActive: "true",
            balance: 3192.7,
            advance: 6124,
            quantity: 15,

            age: 27,
            eyeColor: "brown",
            name: "Gwen Dixon",
            gender: "female",
            company: "ICOLOGY",
            email: "gwendixon@icology.com",
            phone: "+1 (951) 589-2187",
            date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "ERTS4512",
        },
        {
            _id: "5a9406924c0e7f4c98a82ca7",
            index: 2,
            guid: "50d2bf16-9092-4202-84f6-e892721fe5a5",
            isActive: "true",
            balance: 1663.84,
            advance: 7631,
            quantity: 14,

            age: 28,
            eyeColor: "green",
            name: "Deena Gillespie",
            gender: "female",
            company: "OVERPLEX",
            email: "deenagillespie@overplex.com",
            phone: "+1 (826) 588-3430",
            date: "Thu Mar 18 1993 17:07:48 GMT+0530 (India Standard Time)",
            product: "Car",
            state: "New Jercy",
            pno: "ERTS4512",
        },
        {
            _id: "5a940692dd9db638eee09828",
            index: 3,
            guid: "b8bdc65e-4338-440f-a731-810186ce0b3a",
            isActive: "true",
            balance: 1601.82,
            advance: 6519,
            quantity: 18,

            age: 33,
            eyeColor: "green",
            name: "Susanne Peterson",
            gender: "female",
            company: "KROG",
            email: "susannepeterson@krog.com",
            phone: "+1 (868) 499-3292",
            date: "Sat Feb 09 2002 04:28:45 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406926f9971a87eae51af",
            index: 4,
            guid: "3f4c79ec-a227-4210-940f-162ca0c293de",
            isActive: "false",
            balance: 1855.77,
            advance: 7333,
            quantity: 20,

            age: 33,
            eyeColor: "green",
            name: "Stokes Hicks",
            gender: "male",
            company: "SIGNITY",
            email: "stokeshicks@signity.com",
            phone: "+1 (927) 585-2980",
            date: "Fri Mar 12 2004 11:08:06 GMT+0530 (India Standard Time)",
            product: "Van",
            state: "Tamilnadu",
            pno: "MEWD9812",
        },
        {
            _id: "5a940692bcbbcdde08fcf7ec",
            index: 5,
            guid: "1d0ee387-14d4-403e-9a0c-3a8514a64281",
            isActive: "true",
            balance: 1372.23,
            advance: 5668,
            quantity: 16,

            age: 39,
            eyeColor: "green",
            name: "Sandoval Nicholson",
            gender: "male",
            company: "IDEALIS",
            email: "sandovalnicholson@idealis.com",
            phone: "+1 (951) 438-3539",
            date: "Sat Aug 30 1975 22:02:15 GMT+0530 (India Standard Time)",
            product: "Bike",
            state: "Tamilnadu",
            pno: "CCOP1239",
        },
        {
            _id: "5a940692ff31a6e1cdd10487",
            index: 6,
            guid: "58417d45-f279-4e21-ba61-16943d0f11c1",
            isActive: "false",
            balance: 2008.28,
            advance: 7107,
            quantity: 14,

            age: 20,
            eyeColor: "brown",
            name: "Blake Thornton",
            gender: "male",
            company: "IMMUNICS",
            email: "blakethornton@immunics.com",
            phone: "+1 (852) 462-3571",
            date: "Mon Oct 03 2005 05:16:53 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "New Jercy",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406928f2f2598c7ac7809",
            index: 7,
            guid: "d16299e3-e243-4e57-90fb-52446c4c0275",
            isActive: "false",
            balance: 2052.58,
            advance: 7431,
            quantity: 20,

            age: 22,
            eyeColor: "blue",
            name: "Dillard Sharpe",
            gender: "male",
            company: "INEAR",
            email: "dillardsharpe@inear.com",
            phone: "+1 (963) 473-2308",
            date: "Thu May 25 1978 04:57:00 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "Rajkot",
            pno: "ERTS4512",
        },
    ];
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        let dataBound: EmitType<Object> = () => { done(); };
        PivotView.Inject(CalculatedField);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivotDatas as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
            },
            height: 300,
            allowCalculatedField: true,
            dataBound: dataBound
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 100);
    });

    it('- Using the corresponding method', (done: Function) => {
        setTimeout(() => {
            pivotGridObj.createCalculatedFieldDialog();
            expect(document.querySelectorAll('.e-ddl-hidden')[0].textContent).toBe('None');
            (document.querySelectorAll('.e-dlg-closeicon-btn')[0] as HTMLElement).click();
            done();
        }, 1000);
    });
    it('- Using destroy method', (done: Function) => {
        setTimeout(() => {
            pivotGridObj.pivotCommon.errorDialog.removeErrorDialog();
            done();
        }, 1000);
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
        let element = document.querySelector('#' + pivotGridObj.element.id)
        while(element) {
            remove(elem);
            element = document.querySelector('#' + pivotGridObj.element.id)
        }
    });
});