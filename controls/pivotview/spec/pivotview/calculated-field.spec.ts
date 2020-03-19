import { IDataSet, IAxisSet, ICalculatedFields } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EventHandler, getInstance } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { CalculatedFieldCreateEventArgs } from '../../src/common/base/interface';

describe('Calculated Field', () => {
    let originalTimeout: number;
    let pivotGridObj: PivotView;
    let cf: any;
    let mouseEvent: any;
    let tapEvent: any;
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:600px; width:100%' });
    PivotView.Inject(CalculatedField, GroupingBar, FieldList);
    beforeAll(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
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
                calculatedFieldCreate: (args: CalculatedFieldCreateEventArgs)=>{
                   expect(args.calculatedField).toBeTruthy;
                   expect(args.cancel).toBe(false);
                   console.log('CreateCalcaltedFieldName: ' + args.calculatedField.name);
                }
            });
        pivotGridObj.appendTo('#PivotGrid');
    });
    it('Create Dialog', (done: Function) => {
        cf = new CalculatedField(pivotGridObj);
        cf.createCalculatedFieldDialog(pivotGridObj);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
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
        let mousedown: any =
            util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any =
            util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
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
        let mousedown: any =
            util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any =
            util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
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
        let mousedown: any =
            util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any =
            util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
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
        let mousedown: any =
            util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any =
            util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
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
    it('nodeCollapsing event is triggered', (done: Function) => {
        let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
        mouseEventArgs.target = li[0].querySelector('.e-icons');
        tapEvent.originalEvent = mouseEventArgs;
        cf.treeObj.touchClickObj.tap(tapEvent);
        setTimeout(function () {
            cf.treeObj.touchClickObj.tap(tapEvent);
            expect(true).toEqual(true);
            done();
        }, 1000);
    });
    it('OK Button Click', () => {
        cf.inputObj.value = 'New';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        formatString.setProperties({ value: 'C0' });
        formatString.refresh();
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        cf.dialog.buttons[0].click();
    });
    it('Open Dialog', (done: Function) => {
        setTimeout(() => {
            expect((pivotGridObj.pivotValues[2][4] as IAxisSet).formattedText).toBe('$10');
            cf.createCalculatedFieldDialog(pivotGridObj);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('treeview click', () => {
        // (document.querySelectorAll('.e-pivot-treeview-outer .e-fullrow')[1] as HTMLElement).click();
        let treeObj: any = cf.treeObj;
        // let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
        // let e: any = {
        //     target: li[1].querySelector('.e-fullrow')
        // };
        // cf.fieldClickHandler(e as MouseEvent);
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        mouseEvent.target = li[1].querySelector('.e-format');
        tapEvent.originalEvent = mouseEvent;
        treeObj.touchClickObj.tap(tapEvent);
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    });
    // it('treeview click', () => {
    //     let treeObj: any = cf.treeObj;
    //     let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
    //     let e: any = {
    //         target: li[0].querySelector('.e-fullrow')
    //     };
    //     cf.fieldClickHandler(e as MouseEvent);
    //     // (document.querySelector('.e-pivot-treeview-outer .e-fullrow') as HTMLElement).click();
    //     expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
    // });
    it('Context menu click', () => {
        // let contextmenu: any = util.getEventObject('MouseEvents', 'contextmenu');
        // EventHandler.trigger(document.querySelector('#' + cf.parentID + 'contextmenu'), 'contextmenu', contextmenu);

        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        // setTimeout(() => {
        //     mouseEventArgs.target = document.querySelector('#' + cf.parentID + 'contextmenu li');
        //     mouseEventArgs.type = 'click';
        //     cf.menuObj.clickHandler(mouseEventArgs);
        //     done();
        // }, 1000); 
        let menuObj: any = cf.menuObj;
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
        let menu: any = {
            element: li[0]
        };
        menuObj.element.style.display = 'none';
        cf.selectContextMenu(menu as MenuEventArgs);
        expect(true).toBeTruthy();
    });
    it('check context menu click', () => {
        expect(document.querySelector('#' + cf.parentID + 'contextmenu')).toBeTruthy;
        // expect((document.querySelector('#' + cf.parentID + 'contextmenu') as HTMLElement).style.display).toBe('none');
    });
    it('treeview click', function () {
        var treeObj = cf.treeObj;
        // var li = treeObj.element.querySelectorAll('li');
        // var e = {
        //     target: li[13].querySelector('.e-edit')
        // };
        // cf.fieldClickHandler(e);
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
    it('Edit Formula', function (done) {
        cf.inputObj.value = 'Price';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Price';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100/100';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        expect(formatString.value).toBe('C0');
        formatString.setProperties({ value: 'P1' });
        formatString.refresh();
        setTimeout(function () {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            cf.dialog.buttons[0].click();
            done();
        }, 1000);
    });
    it('Open Dialog', function (done) {
        setTimeout(function () {
            expect((pivotGridObj.pivotValues[2][4] as IAxisSet).formattedText).toBe('100.0%');
            cf.createCalculatedFieldDialog(pivotGridObj);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('Open Dialog', (done: Function) => {
        cf.inputObj.value = 'price';
        (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price';
        (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
        let formatString: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        expect(formatString).toBeTruthy;
        formatString.setProperties({ value: 'C2' });
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            cf.dialog.buttons[0].click();
            done();
        }, 1000);
    });
    it('OK Button Click', (done: Function) => {
        setTimeout(() => {
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('Open Dialog', (done: Function) => {
        expect((pivotGridObj.pivotValues[2][3] as IAxisSet).formattedText).toBe('$10.00');
        cf.createCalculatedFieldDialog(pivotGridObj);
        setTimeout(() => {
            cf.inputObj.value = 'price1';
            (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
            (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('OK Button Click', (done: Function) => {
        // cf.dialog.buttons[0].click();                
        let calcInfo: ICalculatedFields = { name: 'price1', formula: '10', formatString: '' };
        cf.replaceFormula(calcInfo);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('Open Dialog', (done: Function) => {
        cf.createCalculatedFieldDialog(pivotGridObj);
        setTimeout(() => {
            cf.inputObj.value = 'price1';
            (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
            (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100/*-78';
            done();
        }, 1000);
    });
    it('OK Button Click', (done: Function) => {
        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        cf.dialog.buttons[0].click();
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('Open Dialog', (done: Function) => {
        (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
        // document.querySelector('.e-pivot-error-dialog').remove();
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            cf.dialog.buttons[1].click();
            done();
        }, 1000);
    });
    it('Cancel Button Click', (done: Function) => {
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            (document.querySelector('.e-toggle-field-list') as HTMLElement).click();
            done();
        }, 1000);
    });
    it('check field list icon', (done: Function) => {
        (document.querySelector('.e-calculated-field') as HTMLElement).click();
        setTimeout(() => {
            (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).inputObj.value = 'Pric';
            (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Pric';
            (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = 'balance*100';
            (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).dialog.buttons[0].click();
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
    });
    it('check calculated field button for edit option', (done: Function) => {
        let rightAxisPanel: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(6);
        expect(pivotButtons[4].id).toBe('New');
        (pivotButtons[4].querySelector('.e-edit') as HTMLElement).click();
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('Price');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('100/100');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('P1');
            (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).inputObj.value = 'New-1';
            done();
        }, 1000);
    });
    it('Update and close calculated field dialog', (done: Function) => {
        (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).dialog.buttons[0].click();
        setTimeout(() => {
            let rightAxisPanel: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toEqual(6);
            expect(pivotButtons[4].id).toBe('New');
            expect(pivotButtons[4].textContent).toBe('New-1');
            done();
        }, 1000);
    });
    it('close field list popup', (done: Function) => {
        expect(document.getElementsByClassName('e-dialog').length === 1).toBeTruthy();
        (document.getElementsByClassName('e-cancel-btn')[0] as any).click();
        setTimeout(() => {
            expect((document.getElementsByClassName('e-dialog')[0] as any).classList.contains('e-popup-open')).toBe(false);
            done();
        }, 1000);
    });
    it('check calculated field button for edit option in grouping bar', (done: Function) => {
        let leftAxisPanel: HTMLElement = pivotGridObj.element.querySelector('.e-left-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toEqual(5);
        expect(pivotButtons[4].id).toBe('Pric');
        (pivotButtons[4].querySelector('.e-edit') as HTMLElement).click();
        setTimeout(() => {
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('Pric');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('balance*100');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
            cf.inputObj.value = 'Price-1';
            done();
        }, 1000);
    });
    it('Update and close calculated field dialog', (done: Function) => {
        cf.dialog.buttons[0].click();
        setTimeout(() => {
            let leftAxisPanel: HTMLElement = pivotGridObj.element.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toEqual(5);
            expect(pivotButtons[4].id).toBe('Pric');
            expect(pivotButtons[4].textContent).toBe('Price-1');
            done();
        }, 1000);
    });
    it('Open Dialog', (done: Function) => {
        setTimeout(() => {
            pivotGridObj.setProperties({ enableRtl: true }, true);
            pivotGridObj.enableRtl = true;
            cf.createCalculatedFieldDialog(pivotGridObj);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            done();
        }, 1000);
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
        let menuObj: any = cf.menuObj;
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
        let menu: any = {
            element: li[0]
        };
        menuObj.element.style.display = 'none';
        cf.selectContextMenu(menu as MenuEventArgs);
        expect(true).toBeTruthy();
    });
    it('check context menu click', () => {
        expect(document.querySelector('#' + cf.parentID + 'contextmenu')).toBeTruthy;
        cf.dialog.buttons[1].click();
        // remove(document.querySelector('.e-dialog'));
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
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