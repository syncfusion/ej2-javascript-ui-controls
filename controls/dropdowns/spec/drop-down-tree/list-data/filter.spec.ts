import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree, DdtFilteringEventArgs } from '../../../src/drop-down-tree/drop-down-tree';
import { listData, filteredlistData } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('filter list data testing', () => {
    describe('filter basic testing ', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let originalTimeout: any;
        let ele: HTMLInputElement;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            ele = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
                ddtreeObj = undefined
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('filter element initial', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
        });
        it('filter element set property', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.allowFiltering = true;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            ddtreeObj.allowFiltering = false;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(0);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(0);
        });
        it('filter contains', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                filterBarPlaceholder : "Search",
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.filterBarPlaceholder = "filter";
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("China");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('11');
                ddtreeObj.showPopup();
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('11');
                    done();
                }, 350);
            }, 350);
        });
        it('filter StartsWith', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'StartsWith',
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'p';
            filterObj.value = 'p';
            let eventArgs: any = { value: 'p', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(6);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("Brazil");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('7');
                ddtreeObj.showPopup();
                setTimeout(function () {
                    filterEle = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
                    expect(filterEle.value).toBe('');
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("Brazil");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('7');
                    done();
                }, 350);
            }, 350);
        });
        it('filter EndsWith', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'EndsWith',
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'u';
            filterObj.value = 'u';
            let eventArgs: any = { value: 'u', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(5);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("China");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('11');
                ddtreeObj.showPopup();
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('11');
                    done();
                }, 350);
            }, 350);
        });
        it('filter EndsWith to StartWidth', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'EndsWith',
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'u';
            filterObj.value = 'u';
            let eventArgs: any = { value: 'u', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(5);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("China");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('11');
                ddtreeObj.filterType = 'StartsWith';
                ddtreeObj.showPopup();
                filterEle.value = 'p';
                filterObj.value = 'p';
                eventArgs = { value: 'p', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(6);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(0);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(0);
                    done();
                }, 350);
            }, 350);
        });
        it('filter CaseSentivity', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                ignoreCase: false,
                treeSettings: { loadOnDemand: true },
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'C';
            filterObj.value = 'C';
            let eventArgs: any = { value: 'C', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(3);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("Brazil");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('7');
                ddtreeObj.ignoreCase = true;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                filterEle.value = 'c';
                filterObj.value = 'c';
                eventArgs = { value: 'c', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(7);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("Brazil");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('7');
                    done();
                }, 350);
            }, 350);
        });
        it('filter Accent', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'EndsWith',
                ignoreAccent: true,
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'a';
            filterObj.value = 'a';
            let eventArgs: any = { value: 'a', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("Australia");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('1');
                ddtreeObj.ignoreAccent = false;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                filterEle.value = 'a';
                filterObj.value = 'a';
                eventArgs = { value: 'a', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(6);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('1');
                    done();
                }, 350);
            }, 350);
        });
        it('filter with prevent default action', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                filtering : (args:DdtFilteringEventArgs)=>{
                    args.preventDefaultAction = true;
                    args.fields.dataSource = filteredlistData;
                },
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(5);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.element.value).toBe("India");
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('21');
                ddtreeObj.showPopup();
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelector('li.e-list-item.e-active').querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.selectedNodes[0]).toBe('21');
                    done();
                }, 350);
            }, 350);
        });
    });
    describe('filter (multi-selection) testing ', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let originalTimeout: any;
        let ele: HTMLInputElement;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            ele = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
                ddtreeObj = undefined
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('filter with multiselect', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('21') !== -1).toBe(true);
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(2);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("India");
                    done();
                },350);
            },350);
        });
        it('filter with selected item (multiselect)', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
            expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(1);
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(3);
                    expect(ddtreeObj.value.length).toBe(3);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(3);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[2].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('1') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('21') !== -1).toBe(true);
                    done();
                },350);
            },350);
        });
        it('closing selected chip on filter', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
            expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(1);
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(3);
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("China");
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("India");
                let checkEle: Element = document.querySelectorAll('.e-chips-wrapper .e-chips-close')[1];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(2);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("India");
                    filterEle.value = '';
                    filterObj.value = '';
                    eventArgs = { value: '', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(function () {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                        expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                        expect(ddtreeObj.value.length).toBe(2);
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                        expect(ddtreeObj.treeObj.selectedNodes.indexOf('1') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.selectedNodes.indexOf('21') !== -1).toBe(true);
                        done();
                    },350);
                }, 100);
            },350);
        });
        it('closing pre-selected chip on filter', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
            expect(ddtreeObj.treeObj.selectedNodes.length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(1);
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("Australia");
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(3);
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("China");
                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("India");
                let checkEle: Element = document.querySelectorAll('.e-chips-wrapper .e-chips-close')[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.dispatchEvent(e);
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(2);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("India");
                    filterEle.value = '';
                    filterObj.value = '';
                    eventArgs = { value: '', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(function () {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                        expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                        expect(ddtreeObj.value.length).toBe(2);
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                        expect(ddtreeObj.treeObj.selectedNodes.indexOf('11') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.selectedNodes.indexOf('21') !== -1).toBe(true);
                        done();
                    },350);
                }, 100);
            },350);
        });
    });

    describe('filter (checkbox) testing ', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let originalTimeout: any;
        let ele: HTMLInputElement;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            ele = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
                ddtreeObj = undefined
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('filter with tree autocheck - property value checking', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                filterType: 'Contains'
            }, '#ddtree');
            expect(ddtreeObj.treeSettings.autoCheck).toBe(false);
            ddtreeObj.treeSettings.autoCheck = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.treeSettings.autoCheck).toBe(true);
            ddtreeObj.allowFiltering = false;
            ddtreeObj.dataBind();
            ddtreeObj.treeSettings.autoCheck = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.treeSettings.autoCheck).toBe(true);
        });
        it('filter with checkbox', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0].querySelector('.e-checkbox-wrapper');
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2].querySelector('.e-checkbox-wrapper');
                e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(2);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[1].parentElement.parentElement as HTMLElement).innerText).toBe("India");
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(2);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('21') !== -1).toBe(true);
                    done();
                },350);
            },350);
        });
        it('filter with checkbox (uncheck)', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                ddtreeObj.filterBarPlaceholder="filter";
                ddtreeObj.dataBind();
                expect(filterObj.element.getAttribute('aria-label')).toBe("filter");
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0].querySelector('.e-checkbox-wrapper');
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2].querySelector('.e-checkbox-wrapper');
                e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                checkEle = li[2].querySelector('.e-checkbox-wrapper');
                e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('false');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(1);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement as HTMLElement).innerText).toBe("China");
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(1);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    done();
                },350);
            },350);
        });
        it('filter with selectall', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                showSelectAll: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    done();
                },350);
            },350);
        });
        it('filter with selectall and preventDefault', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                showSelectAll: true,
                filtering : (args:DdtFilteringEventArgs)=>{
                    args.preventDefaultAction = true;
                    args.fields.dataSource = filteredlistData;
                },
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(5);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    done();
                },350);
            },350);
        });
        it('filter with selectall and cancel', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                showSelectAll: true,
                filtering : (args:DdtFilteringEventArgs)=>{
                    args.cancel = true;
                },
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    done();
                },350);
            },350);
        });
        it('filter with checked item (checkbox)', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            let checkEle: Element = li[0].querySelector('.e-checkbox-wrapper');
            let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle.getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0].querySelector('.e-checkbox-wrapper');
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2].querySelector('.e-checkbox-wrapper');
                e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(3);
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(3);
                    expect(ddtreeObj.value.length).toBe(3);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(3);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Australia");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[1].parentElement.parentElement as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[2].parentElement.parentElement as HTMLElement).innerText).toBe("India");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('1') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('21') !== -1).toBe(true);
                    done();
                },350);
            },350);
        });
    });
});
