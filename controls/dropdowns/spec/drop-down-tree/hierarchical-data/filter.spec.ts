import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree, DdtFilteringEventArgs  } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3,filteredhierarchicalData3,hierarchicalData3filtering, filterData} from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Hierarchial data filter testing', () => {
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
        });
        it('filter element set property', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
        it('filter StartsWith (empty)', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'StartsWith',
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.popupDiv.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'z';
            filterObj.value = 'z';
            let eventArgs: any = { value: 'z', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.popupDiv.querySelectorAll('li.e-list-item').length).toBe(0);
                expect(ddtreeObj.popupDiv.classList.contains('e-no-data')).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                let eventArgs: any = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    filterEle = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
                    expect(filterEle.value).toBe('');
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(0);
                    done();
                }, 350);
            }, 350);
        });
        it('filter StartsWith (empty-2)', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3filtering, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                filterType: 'StartsWith',
                treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.popupDiv.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'z';
            filterObj.value = 'z';
            let eventArgs: any = { value: 'z', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.popupDiv.querySelectorAll('li.e-list-item').length).toBe(0);
                expect(ddtreeObj.popupDiv.classList.contains('e-no-data')).toBe(true);
                expect(ddtreeObj.popupDiv.querySelectorAll('.e-ddt-nodata').length).toBe(1);
                filterEle.value = '';
                filterObj.value = '';
                let eventArgs: any = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    filterEle = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
                    expect(filterEle.value).toBe('');
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(0);
                    filterEle.value = 'y';
                    filterObj.value = 'y';
                    let eventArgs: any = { value: 'y', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(function () {
                        expect(ddtreeObj.popupDiv.querySelectorAll('li.e-list-item').length).toBe(0);
                        expect(ddtreeObj.popupDiv.classList.contains('e-no-data')).toBe(true);
                        expect(ddtreeObj.popupDiv.querySelectorAll('.e-ddt-nodata').length).toBe(1);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('filter EndsWith', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                filtering : (args:DdtFilteringEventArgs)=>{
                    args.preventDefaultAction = true;
                    args.fields.dataSource = filteredhierarchicalData3;
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
        it('filter No Records Found testing', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: filterData, value: 'id', text: 'text', child: 'items' },
                allowFiltering: true,
                filterType: 'StartsWith'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(7);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'sub menu 4';
            filterObj.value = 'sub menu 4';
            let eventArgs: any = { value: 'sub menu 4', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect((ddtreeObj as any).popupObj.element.lastChild.classList.contains('e-no-data')).toBe(true);
                expect((ddtreeObj as any).popupObj.element.lastChild.innerText).toBe('No Records Found');
                filterEle.value = 'sub menu 3';
                filterObj.value = 'sub menu 3';
                let eventArgs: any = { value: 'sub menu 3', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    filterEle = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
                    expect(filterEle.value).toBe('sub menu 3');
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(3);
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
                ddtreeObj = undefined;
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('filter with multiselect', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
        it('Filter action with selecting multiple nodes then close and open the popup', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                showSelectAll: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
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
                ddtreeObj.hidePopup();
                setTimeout(function () {
                    ddtreeObj.showPopup();
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                ddtreeObj = undefined;
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('filter with tree autocheck - property value checking', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2];
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2];
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
                checkEle = li[2];
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
        it('filter with selectall, close and reopen popup', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                ddtreeObj.hidePopup(); 
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    done();
                },350);
            },350);
        });
        it('filter with selectall and preventDefault', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                showCheckBox: true,
                showSelectAll: true,
                filtering : (args:DdtFilteringEventArgs)=>{
                    args.preventDefaultAction = true;
                    args.fields.dataSource = filteredhierarchicalData3;
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
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
            let checkEle: Element = li[0];
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
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2];
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
        it('Perform filter and close and reopen dropdown to check the input field', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'Bei';
            filterObj.value = 'Bei';
            let eventArgs: any = { value: 'Bei', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                let parentNode: HTMLElement = ddtreeObj.treeObj.element.querySelectorAll('li')[0];
                let e: any = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                expect(parentNode.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('14') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('12') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('13') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('14') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('15') !== -1).toBe(true);
                    done();
                }, 350);
            }, 350);
        })
        it('Filter with Single Parent node Selection', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'vic';
            filterObj.value = 'vic';
            let eventArgs: any = { value: 'vic', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                let parentNode: HTMLElement = ddtreeObj.treeObj.element.querySelectorAll('li')[0];
                let e: any = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                parentNode.querySelector('.e-frame').dispatchEvent(e);
                expect(parentNode.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('3') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    ddtreeObj.treeObj.autoCheck = true;
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    expect(ddtreeObj.value.length).toBe(5);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(5);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("Australia");
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[1].parentElement.parentElement.innerText).toBe("New South Wales");
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[2].parentElement.parentElement.innerText).toBe("Victoria");
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[3].parentElement.parentElement.innerText).toBe("South Australia");
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[4].parentElement.parentElement.innerText).toBe("Western Australia");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("New South Wales");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Victoria");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("South Australia");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Western Australia");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('1') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('2') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('3') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('4') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('6') !== -1).toBe(true);
                    filterEle.value = 'vic';
                    filterObj.value = 'vic';
                    eventArgs = { value: 'vic', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2); 
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Australia");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("New South Wales");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Victoria");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("South Australia");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Western Australia");
                        expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                        expect(ddtreeObj.value.indexOf('3') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting with Multiple Parent node Selection', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'pa';
            filterObj.value = 'pa';
            let eventArgs = { value: 'pa', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                checkEle = li[2];
                e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(4);
                expect(ddtreeObj.value.indexOf('7') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('8') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('16') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('17') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(4);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(9);
                    expect(ddtreeObj.value.length).toBe(9);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("Brazil");
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[1].parentElement.parentElement.innerText).toBe("France");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Brazil");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Paraná");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Ceará");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Acre");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("France");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[5] as HTMLElement).innerText).toBe("Pays de la Loire");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[6] as HTMLElement).innerText).toBe("Aquitaine");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[7] as HTMLElement).innerText).toBe("Brittany");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[8] as HTMLElement).innerText).toBe("Lorraine");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('7') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('8') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('9') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('10') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('16') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('17') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('18') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('19') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('20') !== -1).toBe(true);
                    filterEle.value = 'pa';
                    filterObj.value = 'pa';
                    eventArgs = { value: 'pa', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Brazil");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Paraná");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Ceará");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Acre");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("France");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[5] as HTMLElement).innerText).toBe("Pays de la Loire");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[6] as HTMLElement).innerText).toBe("Aquitaine");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[7] as HTMLElement).innerText).toBe("Brittany");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[8] as HTMLElement).innerText).toBe("Lorraine");
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(4);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('7') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('8') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('16') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('17') !== -1).toBe(true);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting with Multiple Parent node and select single parent node', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'pa';
            filterObj.value = 'pa';
            let eventArgs = { value: 'pa', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[2];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('16') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('17') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    expect(ddtreeObj.value.length).toBe(5);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(1);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("France");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("France");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Pays de la Loire");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Aquitaine");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Brittany");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Lorraine");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('16') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('17') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('18') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('19') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('20') !== -1).toBe(true);
                    filterEle.value = 'pa';
                    filterObj.value = 'pa';
                    eventArgs = { value: 'pa', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("France");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Pays de la Loire");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Aquitaine");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Brittany");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Lorraine");
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('16') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('17') !== -1).toBe(true);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting and Search for Parent Node and Selection', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'ch';
            filterObj.value = 'ch';
            let eventArgs = { value: 'ch', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(1);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    expect(ddtreeObj.value.length).toBe(5);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(1);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('12') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('13') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('14') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('15') !== -1).toBe(true);
                    filterEle.value = 'ch';
                    filterObj.value = 'ch';
                    eventArgs = { value: 'ch', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(1);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("China");
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting and Search for Child Node and Selection', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'bi';
            filterObj.value = 'bi';
            let eventArgs = { value: 'bi', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[1];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('23') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                    expect(ddtreeObj.value.length).toBe(1);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Bihar");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('23') !== -1).toBe(true);
                    filterEle.value = 'bi';
                    filterObj.value = 'bi';
                    eventArgs = { value: 'bi', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Bihar");
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('23') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("Bihar");
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting and Search for Multiple Child Node and Selection', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'ce';
            filterObj.value = 'ce';
            let eventArgs = { value: 'ce', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(3);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[1];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('9') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                filterEle.value = 'bi';
                filterObj.value = 'bi';
                eventArgs = { value: 'bi', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(() => {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                    li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                    checkEle = li[1];
                    e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    expect(checkEle.getAttribute('aria-checked')).toBe('true');
                    expect(ddtreeObj.value.indexOf('23') !== -1).toBe(true);
                    expect(ddtreeObj.value.length).toBe(2);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                    filterEle.value = '';
                    filterObj.value = '';
                    eventArgs = { value: '', container: filterEle };
                    filterObj.input(eventArgs);
                    ddtreeObj.hidePopup();
                    setTimeout(() => {
                        ddtreeObj.showPopup();
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                        expect(ddtreeObj.value.length).toBe(2);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Ceará");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Bihar");
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('9') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('23') !== -1).toBe(true);
                        filterEle.value = 'bi';
                        filterObj.value = 'bi';
                        eventArgs = { value: 'bi', container: filterEle };
                        filterObj.input(eventArgs);
                        setTimeout(() => {
                            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                            expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Ceará");
                            expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Bihar");
                            expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                            expect(ddtreeObj.treeObj.checkedNodes.indexOf('23') !== -1).toBe(true);
                            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("Bihar");
                            filterEle.value = '';
                            filterObj.value = '';
                            eventArgs = { value: '', container: filterEle };
                            filterObj.input(eventArgs);
                            filterEle.value = 'ce';
                            filterObj.value = 'ce';
                            eventArgs = { value: 'ce', container: filterEle };
                            filterObj.input(eventArgs);
                            setTimeout(() => {
                                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(3);
                                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Ceará");
                                expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Bihar");
                                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                                expect(ddtreeObj.treeObj.checkedNodes.indexOf('9') !== -1).toBe(true);
                                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement.innerText).toBe("Ceará");
                                done();
                            }, 350);
                        }, 350);
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Parent and Child Combination: Filter and select one parent and one child', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'gua';
            filterObj.value = 'gua';
            let eventArgs = { value: 'gua', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('12') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                filterEle.value = 'bi';
                filterObj.value = 'bi';
                eventArgs = { value: 'bi', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(() => {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                    li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                    checkEle = li[1];
                    e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    checkEle.querySelector('.e-frame').dispatchEvent(e);
                    expect(checkEle.getAttribute('aria-checked')).toBe('true');
                    expect(ddtreeObj.value.indexOf('23') !== -1).toBe(true);
                    expect(ddtreeObj.value.length).toBe(3);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                    filterEle.value = '';
                    filterObj.value = '';
                    eventArgs = { value: '', container: filterEle };
                    filterObj.input(eventArgs);
                    ddtreeObj.hidePopup();
                    setTimeout(() => {
                        ddtreeObj.showPopup();
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(6);
                        expect(ddtreeObj.value.length).toBe(6);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[5] as HTMLElement).innerText).toBe("Bihar");
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('12') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('13') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('14') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('15') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('23') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(6);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Parent and Child Combination: Search for a parent node, select it, then close and reopen the dropdown and search the child node of the selected parent node.', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'ch';
            filterObj.value = 'ch';
            let eventArgs = { value: 'ch', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(1);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('12') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('13') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('14') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.indexOf('15') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    filterEle.value = 'gua';
                    filterObj.value = 'gua';
                    eventArgs = { value: 'gua', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                        expect(ddtreeObj.value.length).toBe(5);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("China");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[1] as HTMLElement).innerText).toBe("Guangzhou");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[2] as HTMLElement).innerText).toBe("Shanghai");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[3] as HTMLElement).innerText).toBe("Beijing");
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[4] as HTMLElement).innerText).toBe("Shantou");
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('12') !== -1).toBe(true);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
        it('Filterting With Default Expanded Node', function (done) {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { autoCheck: true, expandOn: 'Auto', loadOnDemand: true },
                showCheckBox: true,
                allowMultiSelection: true,
                filterType: 'Contains'
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'vic';
            filterObj.value = 'vic';
            let eventArgs = { value: 'vic', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(() => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0];
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('3') !== -1).toBe(true);
                expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                ddtreeObj.hidePopup();
                setTimeout(() => {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.checkedNodes.length).toBe(5);
                    filterEle.value = 'vic';
                    filterObj.value = 'vic';
                    eventArgs = { value: 'vic', container: filterEle };
                    filterObj.input(eventArgs);
                    setTimeout(() => {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                        expect(ddtreeObj.value.indexOf('1') !== -1).toBe(true);
                        expect(ddtreeObj.value.indexOf('3') !== -1).toBe(true);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(2);
                        done();
                    }, 350);
                }, 350);
            }, 350);
        });
    });
});

