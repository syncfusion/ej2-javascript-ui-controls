/**
 * MultiSelect spec document
 */
import { MultiSelect, TaggingEventArgs, MultiSelectChangeEventArgs, ISelectAllEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { dropDownBaseClasses, PopupEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';

MultiSelect.Inject(CheckBoxSelection);

L10n.load({
    'fr-BE': {
        'dropdowns': {
            'noRecordsTemplate': "Aucun enregistrement trouvé",
            'actionFailureTemplate': "Modèle d'échec d'action",
            'selectAllText': 'Check & UnCheck All',
        }
    }
});
let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Python' }, { id: 'list5', text: 'Oracle' }];

let datasource3: { [key: string]: Object }[] = [{ id: 'id1', text: 'java' }];

let multiSelectData: multiSelectStyles = {
    container: "e-multi-select-wrapper",
    selectedListContainer: "e-chips-collection",
    delimViewContainer: "e-delim-view e-delim-values",
    delimContainer: "e-delim-values",
    listContainer: "e-content e-dropdownbase",
    chips: "e-chips",
    chipSelection: "e-chip-selected",
    chipsClose: "e-chips-close",
    individualListClose: "",
    closeiconhide: 'e-close-icon-hide',
    inputContainer: "e-searcher e-zero-size",
    inputElement: "e-dropdownbase",
    inputFocus: "e-focus",
    overAllClose: "e-chips-close e-close-hooker",
    popupListWrapper: "e-ddl e-popup e-multi-select-list-wrapper e-control e-popup-open",
    overAllList: "e-list-parent e-ul",
    listItem: "e-list-item e-active e-item-focus",
    ListItemSelected: "e-active",
    ListItemHighlighted: "e-item-focus",
    containerChildlength: 5,
    defaultChildlength: 5,
    inputARIA: ['aria-expanded', 'role', 'aria-activedescendant', 'aria-haspopup', 'aria-owns', 'aria-disabled'],
    listARIA: ['aria-hidden', 'role'],
    mobileChip: 'e-mob-chip'
}
interface multiSelectStyles {
    container: string;
    mobileChip: string,
    selectedListContainer: string;
    delimContainer: string;
    chips: string,
    chipSelection: string;
    chipsClose: string,
    individualListClose: string;
    inputContainer: string;
    inputElement: string;
    delimViewContainer: string;
    inputFocus: string;
    overAllClose: string;
    popupListWrapper: string;
    listContainer: string;
    overAllList: string;
    listItem: string;
    ListItemSelected: string;
    ListItemHighlighted: string;
    containerChildlength: number;
    defaultChildlength: number;
    inputARIA: Array<string>;
    listARIA: Array<string>;
    closeiconhide: string;
}
let mouseEventArgs: any = { preventDefault: function () { }, target: null };
let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22
};
describe('MultiSelect', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    describe('rendering validation', () => {
        let listObj: any;
        let popupObj: any;
        let checkObj: any
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        // it('multiselect- enableCheckBoxSelection', () => {
        //     listObj = new MultiSelect({ dataSource: datasource, mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"] });
        //     listObj.appendTo(element);
        //     let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
        //     //wrapper structure validation. 
        //     expect((<any>listObj).inputElement.getAttribute('readonly') === 'true').toBe(true);
        //     expect(wrapper.nodeName).toEqual("DIV");//1
        //     expect(wrapper.classList.toString()).toEqual(multiSelectData.container);
        //     //expect(wrapper.childNodes.length).toEqual(multiSelectData.containerChildlength);
        //     if (wrapper.firstChild) {
        //         //expect(wrapper.firstChild.nodeName).toEqual("SPAN");
        //         expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.delimContainer);
        //         expect(wrapper.firstElementChild.textContent.split(',').length).toEqual(2);
        //         if (wrapper.firstChild.nextSibling) {
        //             //Input Wrapper structure validation.
        //             expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");
        //             expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.delimViewContainer);//7
        //             if (wrapper.firstChild.nextSibling.nextSibling) {
        //                 //wrapper element validation.
        //                 expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
        //                 expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//9
        //                 if (wrapper.firstChild.nextSibling.nextSibling.nextSibling) {
        //                     //Close element validation.
        //                     expect(wrapper.firstChild.nextSibling.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
        //                     expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9
        //                 } else {
        //                     expect(true).toBe(false);
        //                 }
        //             } else {
        //                 expect(true).toBe(false);
        //             }
        //         } else {
        //             expect(true).toBe(false);
        //         }
        //     } else {
        //         expect(true).toBe(false);
        //     }
        //     //Input element validation.
        //     expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
        //     expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
        //     for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
        //         expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
        //     }
        //     expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
        //     listObj.showPopup();
        //     expect((<any>listObj).checkBoxSelectionModule.checkWrapper.classList.contains('e-checkbox-wrapper')).toBe(true);
        //     expect(document.getElementsByClassName("e-checkbox-wrapper").length === (<any>listObj).list.querySelectorAll('li').length).toBe(true);
        //     expect((<any>listObj).mainListCollection[0].lastElementChild.getAttribute('aria-checked') === 'true').toBe(true);
        //     expect((<any>listObj).mainListCollection[0].classList.contains('e-active')).toBe(true);
        //     (<any>listObj).focusIn();
        //     listObj.hidePopup();
        //     listObj.destroy();
        // });
        it('enable selectall', () => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"]
            });
            listObj.appendTo(element);
            listObj.showSelectAll = true;
            listObj.dataBind();
            listObj.showPopup();
            expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
        });
        it('disable selectall', () => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"], showSelectAll: true
            });
            listObj.appendTo(element);
            listObj.showSelectAll = false;
            listObj.dataBind();
            expect(listObj.showSelectAll).toBe(false);
        });
        it('change selectallText', () => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"], showSelectAll: true
            });
            listObj.appendTo(element);
            listObj.selectAllText = 'check All';
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.checkBoxSelectionModule.selectAllSpan.innerText === 'check All').toBe(true);
            listObj.destroy();
        });
    });
    describe('showSelectAll', () => {
        let listObj: any;
        let popupObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        it('wrapper element - Delim Mode', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource, showSelectAll: true, mode: 'CheckBox',
                fields: { text: "text", value: "text" }, value: ["JAVA"]
            });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            setTimeout(() => {
            listObj.showPopup();
            }, 100);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length === 0).toBe(true);
                listObj.selectAll(true);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                listObj.selectAll(false);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length === 0).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent.firstElementChild.lastElementChild, "mousedown");
                listObj.checkBoxSelectionModule.clickHandler({
                    preventDefault: () => { }, currentTarget: listObj.checkBoxSelectionModule.checkAllParent.firstElementChild.lastElementChild
                });
                listObj.checkBoxSelectionModule.onBlurHandler(mouseEventArgs);
                listObj.showPopup();
                listObj.checkBoxSelectionModule.onBlurHandler({
                    mouseEventArgs, relatedTarget: listObj.checkBoxSelectionModule.filterInput
                });
                done();
        });
        it('document click', () => {
            listObj = new MultiSelect({
                dataSource: datasource, mode: 'CheckBox',
                fields: { text: "text", value: "text" }, value: ["JAVA"]
            });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            listObj.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(document.body.contains(listObj.popupObj.element)).toBe(false);
        });
    });
    describe('checkbox with searchbox', () => {
        let listObj: any;
        let popupObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('filtering basic coverage', () => {
            let checker: boolean = false
            listObj = new MultiSelect({
                dataSource: datasource2,
                showSelectAll: true, mode: 'CheckBox',
                fields: { value: 'text', text: 'text' }, allowFiltering: true,
                selectAllText: 'Check & UnCheck All',
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA"
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA";
            //open action validation
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyUp(keyboardEventArgs);
            let coll = (<any>listObj).liCollections;
            (<any>listObj).liCollections = undefined;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).liCollections = coll;
            expect(checker).toBe(true);
            listObj.destroy();

        });
        it('filtering no data', () => {
            let checker: boolean = false
            listObj = new MultiSelect({
                dataSource: datasource2,
                showSelectAll: true, mode: 'CheckBox',
                fields: { value: 'text', text: 'text' }, allowFiltering: true,
                selectAllText: 'Check & UnCheck All',
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVAT"
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(checker).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
        it('IE 11 browser validation', () => {
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            listObj = new MultiSelect({
                dataSource: datasource2,
                showSelectAll: true, mode: 'CheckBox',
                fields: { value: 'text', text: 'text' }, allowFiltering: true,
                selectAllText: 'Check & UnCheck All',

            });
            listObj.appendTo(element);
            //open action validation
            let mouseEvenArg: any = { preventDefault: function () { }, target: listObj.overAllWrapper };
            listObj.wrapperClick(mouseEvenArg);
            expect(document.querySelectorAll('.e-ddl.e-popup')).not.toBe(null);
            mouseEventArgs.target = document.getElementById('header');
            listObj.checkBoxSelectionModule.onBlurHandler(mouseEventArgs);
            let mouseEven: any = { preventDefault: function () { }, target: null };
            mouseEven.target = document.body;
            listObj.checkBoxSelectionModule.onDocumentClick(mouseEven);
            expect(listObj.overAllWrapper === document.activeElement).toBe(false);
            listObj.destroy();
        });
    });
    describe('Add item using addItem method in existing group item', () => {
        let listObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Beans", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('Adding item in the existing group', () => {
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
            });
            listObj.appendTo('#multiselect');
            listObj.showPopup();
            expect(listObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
            listObj.addItem(item);
            expect(listObj.ulElement.querySelectorAll('li').length === 11).toBe(true);
        });
    });
    describe('Add item using addItem method in new group item', () => {
        let listObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Potato", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
            });
            listObj.appendTo('#multiselect');
            listObj.showPopup();
            expect(listObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
            listObj.addItem(item);
            expect(listObj.ulElement.querySelectorAll('li').length === 12).toBe(true);
        });
    });
    describe('Add item using addItem method with show select all', () => {
        let listObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Potato", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('Select all item', (done) => {
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                showSelectAll: true,
                fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
            });
            listObj.appendTo('#multiselect');
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                expect(listObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === data.length).toBe(true);
                listObj.addItem(item);
                expect(listObj.ulElement.querySelectorAll('li').length === 12).toBe(true);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === data.length).toBe(true);
                listObj.destroy();
                done();
            }, 600);
        });
    });
    describe('Select all item with enable group checkbox mode', () => {
        let listObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Beans", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('Select all item with enable group checkbox mode', (done) => {
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                enableGroupCheckBox: true,
                showSelectAll: true,
                fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
            });
            listObj.appendTo('#multiselect');
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                expect(listObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === data.concat(item).length + 1).toBe(true);
                listObj.addItem(item);
                expect(listObj.ulElement.querySelectorAll('li').length === 11).toBe(true);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === data.concat(item).length + 1).toBe(true);
                listObj.destroy();
                done();
            }, 450);
        });
    });
    describe('Allowfiltering support in mobile', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let checkObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                dataSource: datasource2, showSelectAll: true, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
            Browser.userAgent = navigator.userAgent;
        })
        it('EJ2-22343 - Selected value not cleared bootstrap modal only in mobile', (done) => {
            listObj.open = (): void => {
                setTimeout((): void => {
                    listObj.checkBoxSelectionModule.clickOnBackIcon();
                    setTimeout((): void => {
                        expect(document.activeElement).toBe(listObj.inputElement);
                        listObj.open = null;
                        done();
                    }, 200);
                }, 100);
            };
            listObj.showPopup();
        })
        it('allowFiltering enabled', () => {
            listObj.showPopup();
            expect(listObj.popupObj.element.style.maxHeight).toBe('100%');
        })
        it('clear text & search icon in search textbox', () => {
            (<any>listObj).checkBoxSelectionModule.filterInput.value = 'a';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).checkBoxSelectionModule.clickOnBackIcon();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = 'a';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).checkBoxSelectionModule.clearIconElement.style.visibility).toBe('visible');
            listObj.checkBoxSelectionModule.clearText(mouseEventArgs);
            listObj.checkBoxSelectionModule.removeEventListener();
        })
        it('mobile backstate hide popup', (done) => {
            (<any>window).onpopstate();
            setTimeout((): void => {
                expect(listObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
                done();
            }, 500);
        })
        it('active state change on scrolling', () => {
            (<any>listObj).checkBoxSelectionModule.filterInput.value = 'a';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            listObj.list.scrollTop = 100;
            expect(document.activeElement !== listObj.filterInput).toBe(true);
            listObj.checkBoxSelectionModule.clickOnBackIcon();
            expect(listObj.overAllWrapper.classList.contains('e-input-group')).toBe(true);
            (<any>listObj).showPopup();
            listObj.checkBoxSelectionModule.clickOnBackIcon();
            (<any>listObj).hidePopup();
            listObj.checkBoxSelectionModule.removeEventListener();
            listObj.destroy();
        });
    });
    describe('templating with checkbox', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        it('Validation for the group template', (done) => {
            let checkObj: CheckBoxSelection;
            let listObj: MultiSelect;
            listObj = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                headerTemplate: '<div class="head">Photo<span style="padding-left:42px">Contact Info</span></div>',
                itemTemplate: '<div><img class="eimg" src="https://ej2.syncfusion.com/demos/src/drop-down-list/Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="https://ej2.syncfusion.com/demos/src/drop-down-list/Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',

                showSelectAll: true,
                mode: 'CheckBox',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                expect('<div class="head">Photo<span style="padding-left:42px">Contact Info</span></div>').toBe((<any>listObj).header.innerHTML);
                expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                (<any>listObj).dispatchEvent((<any>listObj).checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(document.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                (<any>listObj).dispatchEvent((<any>listObj).checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(document.getElementsByClassName('e-check').length === 0).toBe(true);
                listObj.selectAll(true);
                expect(document.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                listObj.selectAll(false);
                expect(document.getElementsByClassName('e-check').length === 0).toBe(true);
                mouseEventArgs.target = (<any>listObj).ulElement.querySelector("li.e-list-item");
                mouseEventArgs.type = 'click';
                (<any>listObj).onMouseClick(mouseEventArgs);
                expect(listObj.value[0] === "Mona Sak").toBe(true);
                mouseEventArgs.target = (<any>listObj).popupWrapper.querySelector(".head");
                (<any>listObj).onMouseClick(mouseEventArgs);
                listObj.hidePopup();
                listObj.destroy();
                done();
            }, 2000);
        });
        it('disable selectall with template', (done) => {
            let checkObj: CheckBoxSelection;
            let listObj: MultiSelect;
            listObj = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                headerTemplate: '<div class="head">Photo<span style="padding-left:42px">Contact Info</span></div>',
                itemTemplate: '<div><img class="eimg" src="https://ej2.syncfusion.com/demos/src/drop-down-list/Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="https://ej2.syncfusion.com/demos/src/drop-down-list/Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                mode: 'CheckBox',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                showSelectAll: true,
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(function () {
                expect('<div class="head">Photo<span style="padding-left:42px">Contact Info</span></div>').toBe((<any>listObj).header.innerHTML);
                expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).isPopupOpen()).toBe(true);
                listObj.hidePopup();
                listObj.destroy();
                done();
            }, 2000);
        });
    });

    describe('openOnClick property in mulitselect with checkbox mode', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('openOnClick property', (done) => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, openOnClick: false, mode: 'CheckBox', fields: { value: 'text', text: 'text' }
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            setTimeout(function () {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = (<any>multiObj).overAllWrapper;
                (<any>multiObj).wrapperClick(mouseEventArgs);
                expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
                keyboardEventArgs.keyCode = 70;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).keyUp(keyboardEventArgs);
                expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(true);
                done();
            }, 500);
        });
    });

    // multiselect all property with checkbox.

    describe('Property validation on initial render', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let checkObj: CheckBoxSelection;

        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        /**
         * API validation.
         */
        it('validate dimention APIs', () => {
            let datasource33: { [key: string]: Object }[] = datasource2.slice();
            datasource33.push({ id: 'list6', text: 'Oracle_Java_C#_Python_Flask_DJango' })
            L10n.load({
                'fr-BE': {
                    'dropdowns': {
                        'noRecordsTemplate': "Aucun enregistrement trouvé",
                        'actionFailureTemplate': "Modèle d'échec d'action",
                        "overflowCountTemplate": "More +${count} items",
                        'selectAllText': 'Check & UnCheck All',
                    }

                }
            });
            listObj = new MultiSelect({
                dataSource: datasource33,
                mode: 'CheckBox',
                showSelectAll: true,
                fields: { value: 'id', text: 'text' },
                width: "300px",
                popupHeight: "100px",
                popupWidth: "250px",
                locale: 'fr-BE'
            });
            listObj.appendTo(element);
            (<any>listObj).viewWrapper.setAttribute('style', "white-space: nowrap;");
            listObj.value = ['list6', 'list5', 'list4', 'list3'];
            listObj.dataBind();
            expect((<HTMLElement>(<any>listObj).viewWrapper).childElementCount).toBe(1);
            listObj.destroy();

        });
        /**
         * API validation.
         */
        it('validate dimention APIs', () => {
            listObj = new MultiSelect({
                mode: 'CheckBox',
                dataSource: datasource2,
                width: "300px",
                popupHeight: "100px",

                popupWidth: "250px"
            });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper) {
                expect(wrapper.getBoundingClientRect().width).toBe(300);//31
            } else {
                expect(true).toBe(false);
            }
            listObj.showPopup();
            let listWarapper: HTMLElement = <HTMLElement>document.querySelector("#multiselect_popup");
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                //expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }
            listObj.width = "200px";
            listObj.dataBind();
            if (wrapper) {
                expect(wrapper.getBoundingClientRect().width).toBe(200);//31
            } else {
                expect(true).toBe(false);
            }
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                //expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }

            listObj.destroy();


        });
        it('Validating the Delimeter Cahr', () => {
            listObj = new MultiSelect({
                mode: 'CheckBox',
                dataSource: datasource2,
                fields: { text: "text", value: "text" },
                value: ["PHP", "JAVA"],
            });
            listObj.appendTo(element);
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).not.toBe("");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP, JAVA");
            listObj.setProperties({ delimiterChar: ';' })
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).toBe("PHP; JAVA;");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP; JAVA");
            listObj.destroy();

        });
        it('validate item selection on render API-Value', () => {
            listObj = new MultiSelect({
                mode: 'CheckBox',
                dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["PHP", "JAVA"]
            });
            listObj.appendTo(element);
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild)
                expect(wrapper.firstElementChild.childNodes.length).toEqual(1);
            else
                expect(true).toBe(false);
            listObj.destroy();

        });
        it('validate item selection on render API-Text', () => {
            listObj = new MultiSelect({ mode: 'CheckBox', dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
            expect(listObj.value.toString()).toEqual("PHP,JAVA");//34
            listObj.destroy();

        });
        it('validate item selection on render API-Value', () => {
            listObj = new MultiSelect({ dataSource: ['JAVA', 'PHP', 'PYTHON'] });
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild)
                expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//34
            else
                expect(true).toBe(false);
            listObj.destroy();

        });
        it('validate datasource binding without init value selection.', () => {
            listObj = new MultiSelect({ mode: 'CheckBox', fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.dataBind();
            expect(listObj.value).toEqual(null);
            listObj.destroy();

            //listObj.query = new Query().take(4);
        });
        it('down && up key press after scroll by manually', (done) => {
            //
            let list: any = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox',
                fields: { text: "text", value: "text" }
            });
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            list.appendTo(element);
            list.showPopup();
            setTimeout(() => {
                expect(list.isPopupOpen()).toBe(true);
                list.list.style.overflow = 'auto';
                list.list.style.height = '48px';
                list.list.style.display = 'block';
                keyboardEventArgs.keyCode = 40;
                list.list.scrollTop = 90;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 113;
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 90).toBe(true);
                keyboardEventArgs.keyCode = 38;
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 0).toBe(true);
                list.list.scrollTop = 0;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 40;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 33;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 34;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.destroy();
                done()
            }, 450);
        });
        it('down && up key press after scroll by manually', (done) => {
            //
            let list: any = new MultiSelect({ mode: 'CheckBox', });
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            list.appendTo(element);
            list.showPopup();
            setTimeout(() => {
                expect(list.isPopupOpen()).toBe(true);
                list.list.style.overflow = 'auto';
                list.list.style.height = '48px';
                list.list.style.display = 'block';
                keyboardEventArgs.keyCode = 40;
                list.list.scrollTop = 90;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 90).toBe(true);
                keyboardEventArgs.keyCode = 38;
                list.onKeyDown(keyboardEventArgs);
                list.list.scrollTop = 0;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 40;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 33;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 34;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.destroy();
                done()
            }, 450);
        });
        it('validate datasource binding Keyup.', () => {
            keyboardEventArgs.keyCode = 71;
            listObj = new MultiSelect({ mode: 'CheckBox', fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);

            let wrapper: HTMLElement = (<any>listObj).chipCollectionWrapper;
            expect((<any>listObj).liCollections.length).toEqual(0);//34
            listObj.destroy();

            //listObj.query = new Query().take(4);
        });
        it('validate datasource binding with Query property.', () => {
            listObj = new MultiSelect({ fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.query = new Query().take(4);
            listObj.value = ['Python'];
            listObj.dataBind();
            expect((<any>listObj).list.querySelectorAll("li").length).toEqual(4);//34
            listObj.destroy();

        });
        it('validate datasource binding with-out data value set with clear all', () => {
            let listObj: any;
            listObj = new MultiSelect({ mode: 'CheckBox', fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.value = ['Python'];
            listObj.dataBind();
            listObj.showPopup();
            listObj.selectAll(true);
            expect((<any>listObj).list).not.toEqual(null);//34
            listObj.showOverAllClear();
            listObj.clearAll(mouseEventArgs);
            listObj.destroy();

        });
        it('validate  on render API-placeholder', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', placeholder: "Select your choice" });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).not.toBe(null)//35
            }
            else
                expect(true).toBe(false);

            listObj.placeholder = 'Sample Check';
            listObj.dataBind();

            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Sample Check')//35
            } else {
                expect(true).toBe(false);
            }
            listObj.destroy();

        });
        /**
         * cssClass  property.
         */
        it('cssClass ', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', cssClass: 'closeState' });
            listObj.appendTo(element);
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('closeState')).toEqual(true);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('closeState')).toBe(true);//37
            listObj.cssClass = 'CloseSet';
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('closeState')).toEqual(false);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('closeState')).toBe(false);//37
            expect((<any>listObj).overAllWrapper.classList.contains('CloseSet')).toEqual(true);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('CloseSet')).toBe(true);//37

            listObj.destroy();


        });
        /**
         * htmlAttributes
         */
        it('htmlAttributes', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).overAllWrapper;
            listObj.htmlAttributes = { title: 'sample', name: 'dropdown', class: 'e-ddl-list', disabled: 'disabled', readonly: 'readonly', style: 'margin: 0', role: 'listbox', placeholder: 'new text' };
            listObj.dataBind();
            expect((<any>listObj).hiddenElement.getAttribute('name')).toBe('dropdown');//Need tp add it to the select element/
            expect(wrapper.classList.contains('e-ddl-list')).toBe(true);//38
            expect(wrapper.classList.contains('e-disabled')).toBe(true);
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('new text');
            expect(wrapper.getAttribute('role')).toBe('listbox');////39
            expect(wrapper.getAttribute('style')).toBe('margin: 0');
            expect(wrapper.getAttribute('style')).toBe('margin: 0');
            expect((<any>listObj).element).not.toBe(null);
            listObj.destroy();

        });
        /**
         * enableRtl
         */
        it('enableRtl ', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).overAllWrapper;
            listObj.showPopup();
            listObj.enableRtl = true;
            listObj.dataBind();
            let listWarapper = <HTMLElement>document.querySelector("#multiselect_popup");
            expect(wrapper.classList.contains('e-rtl')).toEqual(true);//40
            if (listWarapper)
                expect(listWarapper.classList.contains('e-rtl')).toBe(true);//41
            else
                expect(true).toBe(false);
            listObj.hidePopup();
            listObj.enableRtl = false;
            listObj.dataBind();
            listObj.showPopup();
            expect(wrapper.classList.contains('e-rtl')).toEqual(false);//42
            if (listWarapper)
                expect(listWarapper.classList.contains('e-rtl')).toBe(false);//43
            else
                expect(true).toBe(false);
            listObj.destroy();

        });
        /**
         * showClearButton
         */
        it('showClearButton false', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', showClearButton: false, value: ['PHP'], fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.showClearButton = false;
            listObj.dataBind();
            expect((<any>listObj).componentWrapper.classList.contains(multiSelectData.closeiconhide)).toBe(true);
            listObj.destroy();

        })
        /**
         * List Click Action
         */
        it('Lit Click action with hide selected item and select event checkup.', () => {
            let status: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, select: function () {
                    status = true;
                }, hideSelectedItem: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            expect(list[0].classList.contains('e-hide-listitem')).toBe(false);
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(list[0].classList.contains('e-hide-listitem')).toBe(false);
            expect(status).toBe(true);
            listObj.destroy();

        });
        /**
         * maximumSelectionLength.
         */
        it('maximumSelectionLength.', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" },
                showSelectAll: true,
                maximumSelectionLength: 7
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[1];
            (<any>listObj).onMouseClick(mouseEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//48
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[3];
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[4];
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[5];
            (<any>listObj).onMouseClick(mouseEventArgs);
            (<any>listObj).onBlurHandler(mouseEventArgs);
            listObj.dataBind();
            expect(listObj.value.length).toEqual(6);//49
            listObj.enabled = false;
            listObj.dataBind();
            listObj.showPopup();
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.selectAll(false);
            listObj.selectAll(true);
            listObj.destroy();

        });
        it('maximumSelectionLength disabled items.', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" },
                showSelectAll: true,
                maximumSelectionLength: 3
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[1];
            (<any>listObj).onMouseClick(mouseEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//48
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).liCollections.length === (<any>listObj).list.querySelectorAll('.e-disable').length + (<any>listObj).maximumSelectionLength).toBe(true);
            listObj.hidePopup();
            listObj.destroy();

        });
        /**
         * enabled property
         */
        it('enabled ', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', showDropDownIcon: true });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.enabled = false;
            listObj.dataBind();
            listObj.value = ['JAVA'];
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(true);//55
            expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('true');
            expect((<any>listObj).inputElement.getAttribute('disabled')).not.toBe(null);
            listObj.enabled = true;
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(false);//55
            expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('false');
            expect((<any>listObj).inputElement.getAttribute('disabled')).toBe(null);
            (<any>listObj).showDropDownIcon = false;
            (<any>listObj).dataBind();
            listObj.destroy();

        });
        /**
         * Interaction automation.
         */
        it('Hover event validation', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'hover';
            (<any>listObj).onMouseOver(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(true);
            (<any>listObj).onMouseLeave();
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(false);
            listObj.enabled = false;
            (<any>listObj).onMouseOver(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.hover)).not.toBe(true);
            listObj.destroy();

        });
        // onMouseClick(e:MouseEvent)
        /**
         * Interaction automation.
         */
        it('select event validation', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, width: "10px" });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(true);
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            let elements: HTMLElement[] = (<any>listObj).list.querySelectorAll('li[data-value]');
            for (let index: number = 0; index < elements.length; index++) {
                mouseEventArgs.target = elements[index];
                (<any>listObj).onMouseClick(mouseEventArgs);
            }
            (<any>listObj).onBlurHandler(mouseEventArgs);
            (<any>listObj).windowResize();
            (<any>listObj).removeFocus();
            (<any>listObj).selectListByKey();
            (<any>listObj).enableSelectionOrder = false;
            (<any>listObj).dataBind();
            listObj.destroy();

        });
        /**
         * Interaction automation. mouseClick for filtering
         */
        it('select event validation with mouse', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(true);
            element1 = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            listObj.destroy();

        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('filtering inbuild support coverage', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA!";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.focus);
            expect(elem.length).toBe(0);
            listObj.destroy();

        });
        /*
         */
        /**
         * Interaction automation. mouseClick for filtering
         */
        // it('select event validation with keyboard interaction', () => {
        //     listObj = new MultiSelect({
        //         dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, allowFiltering: true,
        //         filtering: function (e) {
        //             let query: Query = new Query().select(['text', 'id']);
        //             query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
        //             e.updateData(datasource, query);
        //         }
        //     });
        //     (<any>listObj).windowResize();
        //     listObj.appendTo(element);
        //     //open action validation
        //     listObj.showPopup();
        //     let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
        //     expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(false);
        //     keyboardEventArgs.altKey = false;
        //     keyboardEventArgs.keyCode = 40;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     keyboardEventArgs.keyCode = 32;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(true);
        //     listObj.maximumSelectionLength = 0;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     listObj.destroy();

        // });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', (done) => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'] });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[3];
                mouseEventArgs.type = 'click';
                (<any>listObj).tempValues = listObj.value.slice();
                (<any>listObj).onMouseClick(mouseEventArgs);
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                expect(listObj.value.length).toBe(3);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value.length).toBe(3);
                listObj.destroy();
                done();
            }, 200);
        });
        it('select event validation with keyboard interaction-Esc key-Box', (done) => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[3];
                mouseEventArgs.type = 'click';
                (<any>listObj).tempValues = listObj.value.slice();
                (<any>listObj).onMouseClick(mouseEventArgs);
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                expect(listObj.value.length).toBe(3);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value.length).toBe(3);
                listObj.destroy();
                done();
            }, 200);

        });
        it('select event validation with keyboard interaction-Esc key-Box no value interaction.', (done) => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value).toBe(null);
                listObj.destroy();
                done();
            }, 200);

        });
        it('select event validation with keyboard interaction-Esc key-Delim', (done) => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[3];
                mouseEventArgs.type = 'click';
                (<any>listObj).tempValues = listObj.value.slice();
                (<any>listObj).onMouseClick(mouseEventArgs);
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                expect(listObj.value.length).toBe(3);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value.length).toBe(3);
                listObj.destroy();
                done();
            }, 200);

        });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', (done) => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[0];
                mouseEventArgs.type = 'click';
                (<any>listObj).tempValues = listObj.value;
                (<any>listObj).onMouseClick(mouseEventArgs);
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                expect(listObj.value.length).toBe(1);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value.length).toBe(1);

                listObj.destroy();
                done();
            }, 200);

        });
        it('select event validation with keyboard interaction-Esc key-Box', (done) => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' }, });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            setTimeout((): void => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[0];
                mouseEventArgs.type = 'click';
                (<any>listObj).tempValues = listObj.value;
                (<any>listObj).onMouseClick(mouseEventArgs);
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 27;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                expect(listObj.value.length).toBe(1);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(listObj.value.length).toBe(1);
                listObj.destroy();
                done();
            }, 200);

        });
        it('select event validation with keyboard interaction-Esc key-Delim', () => {
            listObj = new MultiSelect({ closePopupOnSelect: false, mode: 'CheckBox', dataSource: datasource2, fields: { value: 'text', text: 'text' }, });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value;
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(1);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(1);
            expect((<any>listObj).delimiterWrapper.style.display).toBe('none');
            listObj.destroy();

        });
        /**
         * Interaction automation.
         */
        it('List click event validation', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, closePopupOnSelect: true });
            listObj.appendTo(element);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            (<any>listObj).inputFocus = true;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            (<MultiSelect>listObj).setProperties({ readonly: true });
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            listObj.destroy();

        });
        //expect((<any>listObj).overAllClear.style.display).not.toEqual(null);//46
        /**
         * Interaction automation.
         */
        it('List hover event validation', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ["JAVA"] });
            listObj.appendTo(element);
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('');
            (<any>listObj).mouseOut();
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('');
            (<any>listObj).inputFocus = true;
            (<any>listObj).mouseOut();
            expect((<any>listObj).overAllClear.style.display).not.toBe('none');
            (<any>listObj).overAllWrapper.style.width = "400px";
            (<any>listObj).showPopup();
            (<any>listObj).windowResize();
            listObj.value = <string[]>[];
            listObj.dataBind();
            (<any>listObj).inputElement.value = '';
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            listObj.enabled = false;
            listObj.dataBind();
            listObj.value = ['JAVA'];
            listObj.dataBind();
            (<any>listObj).windowResize();
            listObj.destroy();

        });

        /**
         * Keyboard Interaction automation for delim mode.
         */
        it('Multiselect-Chip interaction validation with delim mode', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            //validate the back-space key with out content.
            expect((<any>listObj).delimiterWrapper.innerHTML).not.toBe('');
            (<any>listObj).removeChipSelection();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).checkBoxSelectionModule.filterInput.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).viewWrapper.innerHTML).not.toBe('');
            (<any>listObj).addValue("content", "212");
            listObj.value = <string[]>[];
            listObj.dataBind();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();

        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-popup interaction validation', () => {
            listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            //open action validation
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
            //close action validation
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 32;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA1";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 32;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            (<any>listObj).showPopup();
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            listObj.destroy();

        });
        it('Multiselect-popup interaction validation', () => {
            let selectStatus: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox',
                select: function () {
                    selectStatus = true;
                },
                fields: { text: "text", value: "text" }, value: ['HTML', 'PHP']
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = <HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="PHP"]');
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 32;
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="JAVA"]')).classList[0] === 'e-list-item').toBe(true);

            listObj.destroy();

        });
        /**
         * Keyboard Interaction automation.
         */
        // it('Multiselect-List interaction validation', () => {
        //     listObj = new MultiSelect({ dataSource: datasource2, mode: 'CheckBox', fields: { text: "text", value: "text" }, closePopupOnSelect: false });
        //     listObj.appendTo(element);
        //     //open action validation
        //     keyboardEventArgs.altKey = false;
        //     keyboardEventArgs.keyCode = 40;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
        //     let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[1]);
        //     keyboardEventArgs.keyCode = 38;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).list.querySelector(
        //         'li.' + dropDownBaseClasses.focus).getAttribute('data-value')).toBe(elem[0].getAttribute('data-value'));
        //     keyboardEventArgs.keyCode = 32;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect(listObj.value.length).toBe(1);
        //     keyboardEventArgs.keyCode = 35;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).list.querySelector(
        //         'li.' + dropDownBaseClasses.focus).getAttribute('data-value')).toBe(elem[elem.length - 1].getAttribute('data-value'));
        //     keyboardEventArgs.keyCode = 36;
        //     (<any>listObj).onKeyDown(keyboardEventArgs);
        //     expect((<any>listObj).list.querySelector(
        //         'li.' + dropDownBaseClasses.focus).getAttribute('data-value')).toBe(elem[0].getAttribute('data-value'));
        //     listObj.destroy();

        // });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect input interaction validation', () => {
            listObj = new MultiSelect({
                dataSource: datasource2,
                mode: 'CheckBox',
                fields: { text: "text", value: "text" }, closePopupOnSelect: false,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource2, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelectorAll('li[data-value="JAVA"]').length === 1).toBe(true);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "Python";
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelectorAll('li[data-value="Python"]').length === 1).toBe(true);
            listObj.destroy();

        });
        it('filtering Event - with Key interactions', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2,
                mode: 'CheckBox', value: ["JAVA"], placeholder: 'Select Dropdown', allowFiltering: true,
                showDropDownIcon: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA";
            //open action validation
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyUp(keyboardEventArgs);
            let coll = (<any>listObj).liCollections;
            (<any>listObj).liCollections = undefined;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).liCollections = coll;
            expect(checker).toBe(true);
            listObj.destroy();

        });
    });
    // describe('Remote data binding', () => {
    //     let listObj: MultiSelect;
    //     let popupObj: any;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
    //     let remoteData: DataManager = new DataManager({ 
    //         url: 'https://services.syncfusion.com/js/production/api/Employees',
    //         adaptor: new WebApiAdaptor,
    //         crossDomain: true 
    //     });
    //     beforeAll(() => {
    //         document.body.innerHTML = '';
    //         document.body.appendChild(element);
    //     });
    //     afterAll(() => {
    //         if (element) {
    //             element.remove();
    //         }
    //     });
    //     /**
    //      * remoteData binding with selectAll method
    //      */
    //     it('remoteData binding with selectAll method ', (done) => {
    //         listObj = new MultiSelect({
    //             hideSelectedItem: false,
    //             mode: 'CheckBox',
    //             showSelectAll: true,
    //             dataSource: remoteData, query: new Query().take(4), fields: { value: 'EmployeeID', text: 'FirstName' }
    //         });
    //         listObj.appendTo(element);
    //         listObj.selectAll(true);
    //         setTimeout(() => {
    //             (<any>listObj).moveByList(1);
    //             expect(listObj.value.length).toBe(9);
    //             listObj.destroy();
    //             done();
    //         }, 800);
    //     });
    // });
    // describe('EJ2-19524 - UI breaking when use lengthy place holder', () => {
    //     let listObj: MultiSelect;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    //     let datasource: { [key: string]: Object }[] =  [
    //             { id: 'list1', text: 'JAVA' },
    //             { id: 'list2', text: 'C#' },
    //             { id: 'list3', text: 'C++' },
    //             { id: 'list4', text: '.NET' },
    //             { id: 'list5', text: 'Oracle' },
    //             { id: 'list6', text: 'GO' },
    //             { id: 'list7', text: 'Haskell' },
    //             { id: 'list8', text: 'Racket' },
    //             { id: 'list8', text: 'F#' }];
    //         beforeAll(() => {
    //             document.body.appendChild(element);
    //             listObj = new MultiSelect({
    //                 dataSource: datasource,
    //                 fields: { text: "text", value: "id" },
    //                 placeholder: 'My placeholder 12345566789',
    //                 width: 100,
    //                 showDropDownIcon: true
    //             });
    //             listObj.appendTo(element);
    //         });
    //         afterAll(() => {
    //             if (element) {
    //                 listObj.destroy();
    //                 element.remove();
    //             }
    //         });
    //         it('Select all in check box mode', () => {
    //             listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
    //                 placeholder: "select counties" ,showDropDownIcon: true , width: 300, mode : 'CheckBox' , filterBarPlaceholder:"Select value" , showSelectAll: true });
    //             listObj.appendTo(element);
    //             listObj.showPopup();
    //             mouseEventArgs.type = "mousedown";
    //             mouseEventArgs.target = document.getElementsByClassName('e-all-text')[0];
    //             mouseEventArgs.currentTarget = document.getElementsByClassName('e-selectall-parent')[0];
    //             (<any>listObj).checkBoxSelectionModule.clickHandler(mouseEventArgs);
    //             let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
    //             if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
    //                 expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(true);
    //             }
    //             else
    //                 expect(true).toBe(false);            
    //             listObj.destroy();
    //         });
    //     });
    describe('mulitselect checkbox IE blur event', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('IE blur event', () => {
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' },
                mode: 'CheckBox',
            });
            multiObj.appendTo('#newlist');
            //open action validation
            (<any>multiObj).value = ['JAVA'];
            (<any>multiObj).dataBind();
            expect((<any>multiObj.value.length)).toBe(1);
            (<any>multiObj).onBlurHandler(mouseEventArgs);
            Browser.userAgent = navigator.userAgent;
            multiObj.destroy();
        });
    });
    describe('itemCreated fields event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' set disable to first item', (done) => {
            let count: number = 0;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox',
                fields: <Object>{
                    value: 'text', itemCreated: (e: any) => {
                        if (count === 0) {
                            e.item.classList.add('e-disabled');
                        }
                    }
                }
            });
            dropDowns.appendTo(element);
            dropDowns.renderPopup();
            dropDowns.inputElement.value = 'a';
            e.keyCode = 72;
            dropDowns.onInput(e);;
            dropDowns.keyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                done();
            }, 500);
        });

    });
    describe('mulitselect null value set dynamically', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('value set null', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' },
                mode: 'CheckBox',
                value: ['JAVA'],
                showSelectAll: true,
            });
            multiObj.appendTo('#newlist');
            (<any>multiObj).value = null;
            (<any>multiObj).dataBind();
            expect((<any>multiObj.value)).toBe(null);
            multiObj.destroy();
        });
        it('focus & blur Event.', (done) => {
            let checker: boolean = false;
            let listObj: any;
            listObj = new MultiSelect({
                mode: 'CheckBox', dataSource: datasource2, focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo('#newlist');
            listObj.renderPopup();
            setTimeout(function () {
                (<any>listObj).escapeAction();
                listObj.value = ['Java'];
                listObj.dataBind();
                (<any>listObj).focusAtLastListItem(null);
                (<any>listObj).focus();
                expect(checker).toBe(true);//64
                checker = false;
                (<any>listObj).onBlurHandler();
                (<any>listObj).focusAtLastListItem('null');
                expect(checker).toBe(true);//65
                (<any>listObj).onListMouseDown({ preventDefault: function () { } });
                (<any>listObj).checkBoxSelectionModule.onBlurHandler({ preventDefault: function () { } });
                expect((<any>listObj).scrollFocusStatus).toBe(false);
                listObj.destroy();
                done();
            }, 500);
        });
    });

    describe(' bug(EJ2-8937): Change event at initial rendering ', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let isNotLocalChange: boolean = true;
        let isNotRemoteChange: boolean = true;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' change event not trigger in local data', () => {
            let changeCount: number = 0;
            let multiObj = new MultiSelect({
                dataSource: datasource2,
                fields: { value: 'text', text: 'text' },
                mode: 'CheckBox',
                value: ['JAVA'],
                change: () => {
                    isNotLocalChange = false;
                    changeCount = changeCount + 1;
                }
            });
            multiObj.appendTo('#newlist');
            expect(isNotLocalChange).toBe(true);
            expect(changeCount).toBe(0);
            multiObj.value = null;
            multiObj.dataBind();
            expect(isNotLocalChange).toBe(false);
            expect(changeCount).toBe(1);
            multiObj.destroy();
        });

        it(' change event not trigger in remote data', (done) => {
            let changeCount: number = 0;
            let remoteData: DataManager = new DataManager({ 
                url: 'https://services.syncfusion.com/js/production/api/Employees',
                adaptor: new WebApiAdaptor,
                crossDomain: true 
            });
            let multiObj = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                mode: 'CheckBox',
                value: [5],
                change: () => {
                    isNotRemoteChange = false;
                    changeCount = changeCount + 1;
                }
            });
            multiObj.appendTo('#newlist');
            setTimeout(() => {
                expect(isNotRemoteChange).toBe(true);
                multiObj.value = null;
                multiObj.dataBind();
                expect(isNotRemoteChange).toBe(false);
                expect(changeCount).toBe(1);
                multiObj.destroy();
                done();
            }, 800)
        });
    });

    describe(' bug(EJ2-8828): Filterbar placeholder is not working while change through onPropertyChange', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let isNotLocalChange: boolean = true;
        let isNotRemoteChange: boolean = true;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' change the filterBarPlaceholder through onPropertyChange', (done) => {
            let changeCount: number = 0;
            let multiObj: any = new MultiSelect({
                dataSource: datasource2,
                fields: { value: 'text', text: 'text' },
                mode: 'CheckBox',
                filterBarPlaceholder: "Select a value"

            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            setTimeout(() => {
                expect(multiObj.checkBoxSelectionModule.filterInput.getAttribute('placeholder') === "Select a value").toBe(true);
                multiObj.filterBarPlaceholder = 'Search here';
                multiObj.dataBind();
                expect(multiObj.checkBoxSelectionModule.filterInput.getAttribute('placeholder') === "Search here").toBe(true);
                multiObj.destroy();
                done();
            }, 450);
        });
    });
    describe('text property', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('get selected text', (done) => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            setTimeout(() => {
                expect((<any>multiObj).text === "PHP,HTML").toBe(true);
                (<any>multiObj).destroy();
                done();
            }, 450);
        });
        it('focus the wrapper click', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            let mouseEvenArg: any = { preventDefault: function () { }, target: (<any>multiObj).overAllWrapper };
            (<any>multiObj).wrapperClick(mouseEvenArg);
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            (<any>multiObj).wrapperClick(mouseEvenArg);
            expect((<any>multiObj).isPopupOpen()).toBe(false);
            expect((<any>multiObj).overAllWrapper.classList.contains('e-input-focus')).toBe(true);
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            (<any>multiObj).checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
        });
        it('focus the input and click the document', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            let mouseEvenArg: any = { preventDefault: function () { }, target: (<any>multiObj).overAllWrapper };
            (<any>multiObj).wrapperClick(mouseEvenArg);
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            (<any>multiObj).wrapperClick(mouseEvenArg);
            expect((<any>multiObj).isPopupOpen()).toBe(false);
            expect((<any>multiObj).overAllWrapper.classList.contains('e-input-focus')).toBe(true);
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            (<any>multiObj).checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect((<any>multiObj).overAllWrapper.classList.contains('e-input-focus')).toBe(false);
        });
        it('reordering the selected value', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            let list: Array<HTMLElement> = (<any>multiObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>multiObj).onMouseClick(mouseEventArgs);
            expect((<any>multiObj).value.length).toBe(3);
            keyboardEventArgs.keyCode = 8;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onKeyDown(keyboardEventArgs);
            (<any>multiObj).keyUp(keyboardEventArgs);
            expect((<any>multiObj).mainList.querySelectorAll('li')[2].getAttribute('data-value') === list[2].getAttribute('data-value')).toBe(true);
        });
    });
    describe('Dynamically set datasource', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('enable selectall popup hight changed', () => {
            let multiObj = new MultiSelect({
                dataSource: [], mode: 'CheckBox', fields: { value: 'text', text: 'text' }, showSelectAll: true,
            });
            multiObj.appendTo('#newlist');
            multiObj.dataSource = datasource2;
            multiObj.dataBind();
            multiObj.showPopup();
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            let filterHeight: any = document.getElementsByClassName('e-filter-parent')[0];
            filterHeight = filterHeight.offsetHeight;
            let selectHeight: any = document.getElementsByClassName('e-selectall-parent')[0];
            selectHeight = selectHeight.offsetHeight;
            let popupHeight: any = parseInt((<any>multiObj).popupWrapper.style.maxHeight);
            let listHeight: any = parseInt((<any>multiObj).list.style.maxHeight);
            let total = popupHeight - (filterHeight + selectHeight);
            // check if listHeight and total are nearly equal
            const epsilon = 0.001;
            const areNearlyEqual = (listHeight : any, total : any) => {
                return (listHeight - total) <= epsilon;
            };
            expect(areNearlyEqual(listHeight, total)).toBe(true);
            (<any>multiObj).destroy();
        });
    });
    describe('mulitselect openOnClick with checkbox validation', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('openOnClick', (done) => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, openOnClick: false, mode: 'CheckBox', fields: { value: 'text', text: 'text' }
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            setTimeout(function () {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = (<any>multiObj).overAllWrapper;
                (<any>multiObj).wrapperClick(mouseEventArgs);
                expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
                (<any>multiObj).inputElement.value = "JAVA";
                //open action validation
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 70;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).keyUp(keyboardEventArgs);
                expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(true);
                let element1: HTMLElement = (<any>multiObj).list.querySelector('li[data-value="JAVA"]');
                expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
                multiObj.destroy();
                done();
            }, 500);
        });
    });
    describe('Popup close while click on outside of filterbar', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('click outside of filterbar', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'CheckBox', fields: { value: 'text', text: 'text' }
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: (<any>multiObj).filterParent };
            (<any>multiObj).checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            multiObj.destroy();
        });
    });

    describe(' bug(EJ2-8836): MultiSelect checkbox not focusout while double click on header and then click on document', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            element.remove();
        });

        it(' Close the popup while click on document', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            let dropDowns: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true,
                mode: 'CheckBox'
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
                dropDowns.checkBoxSelectionModule.onBlurHandler(mouseEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(false);
                    dropDowns.destroy();
                    done();
                }, 450);
            }, 450);
        });
        it(' Close the popup while click on inner element', (done) => {
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            let dropDowns: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true,
                mode: 'CheckBox',
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = dropDowns.list;
                dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
                dropDowns.checkBoxSelectionModule.onBlurHandler(mouseEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(true);
                    dropDowns.destroy();
                    Browser.userAgent = navigator.userAgent;
                    done();
                }, 450)
            }, 450);
        });
    });

    describe(' EJ2-15642:  Selection reordering issues', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                allowFiltering: true,
                mode: 'CheckBox'
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' create the new ul element for reordering selected items ', (done) => {
            dropDowns.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
                mouseEventArgs.target = list[0];
                mouseEventArgs.type = 'click';
                (<any>dropDowns).onMouseClick(mouseEventArgs);
                mouseEventArgs.target = document.body;
                dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
                dropDowns.showPopup();
                setTimeout(() => {
                    expect(dropDowns.list.querySelectorAll('ul').length === 2).toBe(true);
                    done();
                }, 450);
            }, 450);
        });

        it(' select the second item and move it into reordering list ', (done) => {
            dropDowns.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
                mouseEventArgs.target = list[1];
                mouseEventArgs.type = 'click';
                (<any>dropDowns).onMouseClick(mouseEventArgs);
                mouseEventArgs.target = document.body;
                dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
                dropDowns.showPopup();
                setTimeout(() => {
                    expect(dropDowns.list.querySelectorAll('ul').length === 2).toBe(true);
                    expect(dropDowns.list.querySelectorAll('ul')[0].childNodes.length === 2).toBe(true);
                    done();
                }, 450);
            }, 450);
        });

        it(' deselect the item from reordering list ', (done) => {
            dropDowns.showPopup();
            setTimeout(() => {
                let ulChild: any = dropDowns.ulElement.querySelectorAll('li');
                let length = ulChild.length;
                let list: Array<HTMLElement> = (<any>dropDowns).list.querySelectorAll('li');
                mouseEventArgs.target = list[1];
                mouseEventArgs.type = 'click';
                (<any>dropDowns).onMouseClick(mouseEventArgs);
                mouseEventArgs.target = document.body;
                dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
                dropDowns.showPopup();
                setTimeout(() => {
                    expect(dropDowns.list.querySelectorAll('ul').length === 2).toBe(true);
                    expect(dropDowns.list.querySelectorAll('ul')[0].childNodes.length === 1).toBe(true);
                    expect(dropDowns.ulElement.querySelectorAll('li').length === length + 1).toBe(true);
                    done();
                }, 450);
            }, 450);
        });

        it(' selection maintain while filtering the lists ', (done) => {
            dropDowns.va
            dropDowns.showPopup();
            setTimeout(() => {
                dropDowns.checkBoxSelectionModule.filterInput.value = "Java Script";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 70;
                dropDowns.keyDownStatus = true;
                dropDowns.onInput(keyboardEventArgs);;
                dropDowns.keyUp(keyboardEventArgs);
                let selectAll: HTMLElement = dropDowns.popupObj.element.querySelector('.e-selectall-parent .e-all-text');
                expect(selectAll.textContent === 'Unselect All').toBe(true);
                done();
            }, 450);
        });
    });

    describe(' checkbox width additem', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let mulObj: any;
        beforeAll(() => {
            document.body.appendChild(element);
            mulObj = new MultiSelect({
                dataSource: datasource2,
                fields: { value: 'text', text: 'text' },
                allowFiltering: true,
                mode: 'CheckBox'
            });
            mulObj.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' addItem method ', () => {
            let item: any = { text: 'msoffice', value: 'ms' }
            expect(mulObj.dataSource.length === 6).toBe(true);
            mulObj.addItem(item);
            mulObj.showPopup();
            expect(mulObj.ulElement.querySelectorAll('li').length === 7).toBe(true);
            let list: HTMLElement = (<any>mulObj).ulElement.querySelector('li[data-value="msoffice"]');
            expect(list.firstElementChild.classList.contains('e-checkbox-wrapper')).toBe(true);
        });
    });

    describe(' dynamically change clear button', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let mulObj: any;
        beforeAll(() => {
            document.body.appendChild(element);
            mulObj = new MultiSelect({
                dataSource: datasource2,
                fields: { value: 'text', text: 'text' },
                allowFiltering: true,
                value: ['JAVA'],
                mode: 'CheckBox'
            });
            mulObj.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' default value changes ', () => {
            mulObj.dispatchEvent(mulObj.componentWrapper, "mouseover");
            expect(mulObj.overAllClear.style.display === '').toBe(true);
            mulObj.showClearButton = false;
            mulObj.dispatchEvent(mulObj.componentWrapper, "mouseover");
            expect(mulObj.overAllClear.style.display === 'none').toBe(true);
        });
    });

    describe('dynamically changed show select all', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                allowFiltering: true,
                mode: 'CheckBox'
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it('change property', () => {
            dropDowns.showPopup();
            expect(dropDowns.filterParent.querySelector('.e-selectall-parent')).toBe(null);
            dropDowns.showSelectAll = false;
            dropDowns.dataBind();
            dropDowns.showSelectAll = true;
            dropDowns.dataBind();
            dropDowns.showPopup();
            expect(dropDowns.filterParent.querySelector('.e-selectall-parent')).toBe(null);
        });
    });
    describe('check search box value', () => {
        let listObj: any;
        let popupObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            Browser.userAgent = navigator.userAgent;
            checkObj.destroy();
        });
        it('input value', () => {
            listObj = new MultiSelect({
                dataSource: datasource2,
                showSelectAll: true, mode: 'CheckBox',
                fields: { value: 'text', text: 'text' }, allowFiltering: true,
                selectAllText: 'Check & UnCheck All'
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "JAVA"
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput(keyboardEventArgs);;
            (<any>listObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            listObj.hidePopup();
            listObj.showPopup();
            expect((<any>listObj).checkBoxSelectionModule.filterInput.value === '').toBe(true);
            listObj.destroy();
        });
    });

    describe('CR issue - EJ2-17555 - validation issue', () => {
        let listObj: MultiSelect;
        let checkObj: any
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textChild', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            if(ele) {
                ele.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });

        it('ensure change event', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"],
                showSelectAll: true,
                showDropDownIcon: true,
                allowFiltering: true,
                open: () => {
                    var mouseEventArgs = {preventDefault: function(){}, currentTarget: (<any>listObj).checkBoxSelectionModule.checkAllParent };
                    (<any>listObj).checkBoxSelectionModule.clickHandler(mouseEventArgs);
                    (<any>listObj).onBlurHandler();
                },
                change: () => {
                    expect(true).toBe(true);
                    done();
                }
            });
            listObj.appendTo(element);
            listObj.showSelectAll = true;
            listObj.dataBind();
            listObj.showPopup();
        });

    });
    describe('EJ2-13211 - remote selection not maintain', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let checkObj: any
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textChild', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
            document.body.appendChild(element);
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'CheckBox',
                fields: { text: "sports", value: "id" },
                text: 'Tennis',
                showSelectAll: true,
                showDropDownIcon: true,
                enableSelectionOrder: false,
                popupHeight: 100
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
            if(ele) {
                ele.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });

        it('ensure text property -  Initial assignment', () => {
            listObj.showPopup();
            expect(listObj.value.length).toBeGreaterThan(0);
        });
        it('ensure list scroll', () => {
            expect((<any>listObj).list.querySelector('.e-active').innerText).toBe('Tennis');
        });
        it('ensure text property - Dynamic assignment', (done) => {
            listObj.change = (args: MultiSelectChangeEventArgs): void => {
                expect(args.value.length).toBeGreaterThan(0);
                expect(args.value[0]).toBe('level9');
                done();
            }
            listObj.text = 'Snooker';
        });
    });
    describe('EJ2-20084 - Multiselect select all and un select all not working properly', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] =  [
                { id: 'list1', text: 'JAVA' },
                { id: 'list2', text: 'C#' },
                { id: 'list3', text: 'C++' },
                { id: 'list4', text: '.NET' },
                { id: 'list5', text: 'Oracle' },
                { id: 'list6', text: 'GO' },
                { id: 'list7', text: 'Haskell' },
                { id: 'list8', text: 'Racket' },
                { id: 'list8', text: 'F#' }];
        let popup: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check select all', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true,
                change: (): void => {
                    if (popup) {
                        setTimeout(() => {
                            expect(popup.querySelectorAll('.e-check').length).toBe(0);
                        }, 0);
                        done();
                    }                  
                },
                open: (args: PopupEventArgs): void => {
                    popup = args.popup.element;
                    listObj.value = [];
                }
            });
            listObj.appendTo(element);
            listObj.selectAll(true);
            listObj.dataBind();
            listObj.showPopup();
        });
        it('check select all without open', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true,
                open: (): void => {
                    expect((<any>listObj).list.querySelectorAll('.e-check').length).toBe(0);
                    done();               
                }
            });
            listObj.appendTo(element);
            listObj.selectAll(true);
            listObj.dataBind();
            listObj.value = [];
            listObj.dataBind();
            listObj.showPopup();
        });
    });

    describe('EJ2-20148 - MultiSelect Dropdown value does not update', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] =  [
            {
             label: 'ACTIVITY_FEED__ACTIVITY_FEED_PAGE_INCOMING_TAB__FACEBOOK_ACTIVITY',
             value: '1',
             iconClass: 'fb',
           }
       ];
        let popup: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check select all', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                placeholder: 'ACTIVITY_FEED__ACTIVITY_FEED_PAGE_INCOMING_TAB__SHOW_ACTIVITY_FROM_PLACEHOLDER',
                fields: { text: 'label', value: 'value', iconCss: 'iconClass' },
                popupHeight: 50,
                mode: 'CheckBox',
                showClearButton: true,
                open: (): void => {
                    expect(isNullOrUndefined((<any>listObj).checkWrapper)).toBe(true);
                    done();               
                }
            });
            listObj.appendTo(element);
            listObj.value = ['1'];
            listObj.dataBind();
            listObj.showPopup();
        });
    });

    describe('EJ2-20390 - Checking SelectAll option in MultiSelect select items in reverse order', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check select all', (done) => {
            listObj.selectedAll = (args: ISelectAllEventArgs): void => {
                expect((args.itemData[0] as { [key: string]: Object }).Name).toBe('Australia');
                expect(listObj.value[0]).toBe('Australia');
                done();
            };
            listObj.selectAll(true);
        });
    });
	    describe('EJ2-21529 - Need to provide support for without filtering in mutliselect checkbox mode - false', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true,
                allowFiltering: false
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check filtering element', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(args.popup.element.querySelectorAll('.e-input-filter').length).toBe(0);
                done();
            };
            listObj.showPopup();
        });
    });

    describe('EJ2-21529 - Need to provide support for without filtering in mutliselect checkbox mode - true', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true,
                allowFiltering: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check filtering element', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(args.popup.element.querySelectorAll('.e-input-filter').length).toBe(1);
                done();
            };
            listObj.showPopup();
        });
    });

    describe('EJ2-21529 - Need to provide support for without filtering in mutliselect checkbox mode - null', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check filtering element', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(args.popup.element.querySelectorAll('.e-input-filter').length).toBe(1);
                done();
            };
            listObj.showPopup();
        });
    });
    describe('EJ2-21529 - Need to provide support for without filtering in mutliselect checkbox mode - Dynamic assignment to false', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true
            });
            listObj.appendTo(element);
            listObj.allowFiltering = false;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check filtering element', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(args.popup.element.querySelectorAll('.e-input-filter').length).toBe(0);
                done();
            };
            listObj.showPopup();
        });
    });
    describe('EJ2-21529 - Need to provide support for without filtering in mutliselect checkbox mode - Dynamic assignment to true', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name' },
                popupHeight: 50,
                mode: 'CheckBox',
                showSelectAll: true,
                allowFiltering: false
            });
            listObj.appendTo(element);
            listObj.allowFiltering = true;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check filtering element', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(args.popup.element.querySelectorAll('.e-input-filter').length).toBe(1);
                done();
            };
            listObj.showPopup();
        });
    });
    describe('EJ2-22723 - SelectAll performance improvement', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let items: string[] = [];
        for (let i: number = 0 ; i < 200; i++) {
            items.push('Items' + i);
        };
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Value selection', (done) => {
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: items,
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                filterBarPlaceholder: 'Search countries',
                popupHeight: '350px',
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(listObj.value.length).toBe(199);
                    done();
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
            listObj.selectAll(true);
        });
    });
    describe('EJ2-23849 - Multiselect total count template width specification', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
        ];
        let originalTimeout: number;
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'Name', value: 'Code' },
                popupHeight: 50,
                width: 50,
                showDropDownIcon: true,
                mode: 'CheckBox',
                value: ['AU']
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('check total count width', () => {
            expect(!isNullOrUndefined((<any>listObj).viewWrapper.style.width)).toBe(true);
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
describe('EJ2-39990 MultiSelect component in mobile mode with initial value page not scrolled', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
    ];
    let originalTimeout: number;
    beforeAll(() => {
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;
        document.body.appendChild(element);
    });
    afterAll(() => {
        if (element) {
            listObj.destroy();
            element.remove();
        }
        Browser.userAgent = navigator.userAgent;
    });
    it('check with checkbox', () => {
        listObj = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name', value: 'Code' },
            popupHeight: 50,
            mode: 'CheckBox',
            value: ['AU']
        });
        listObj.appendTo(element);
        expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
        (<any>listObj).renderPopup();
        listObj.showPopup();
        expect((<any>listObj).isPopupOpen()).toBe(true);
        expect(document.body.classList.contains('e-popup-full-page')).toBe(true);
        listObj.hidePopup();
        listObj.destroy();
    });
});
describe('EJ2-39868 Some items in the dropdown hides when using the header template in the mobile mode', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
    ];
    let originalTimeout: number;
    beforeAll(() => {
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;
        document.body.appendChild(element);
    });
    afterAll(() => {
        if (element) {
            listObj.destroy();
            element.remove();
        }
        Browser.userAgent = navigator.userAgent;
    });
    it('check without showselectAll', () => {
        listObj = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name', value: 'Code' },
            popupHeight: 50,
            mode: 'CheckBox',
            value: ['AU'],
        });
        listObj.appendTo(element);
        (<any>listObj).renderPopup();
        listObj.showPopup();
        expect((<any>listObj).isPopupOpen()).toBe(true);
        expect((<any>listObj).checkBoxSelectionModule.checkAllParent).toBeUndefined;
        expect(document.getElementsByClassName('e-selectall-parent')[0]).toBeUndefined;
        listObj.hidePopup();
        listObj.destroy();
    });
    it('check with showSelectAll', () => {
        listObj = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name', value: 'Code' },
            popupHeight: 50,
            mode: 'CheckBox',
            value: ['AU'],
            showSelectAll: true,
        });
        listObj.appendTo(element);
        (<any>listObj).renderPopup();
        listObj.showPopup();
        expect((<any>listObj).isPopupOpen()).toBe(true);
        expect(isNullOrUndefined((<any>listObj).checkBoxSelectionModule.checkAllParent)).toBe(false);
        expect(isNullOrUndefined(document.getElementsByClassName('e-selectall-parent')[0])).toBe(false);
        listObj.hidePopup();
        listObj.destroy();
    });
});
describe('EJ2-44277', () => {
    let listObj: MultiSelect;
    let count: number = 0;
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
    ];
    let originalTimeout: number;
    beforeAll(() => {
        document.body.appendChild(element);
        listObj = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name', value: 'Code' },
            showDropDownIcon: true,
            allowFiltering: true,
            mode: 'CheckBox',
            filtering: function(e) {
                count++;
            }
        });
        listObj.appendTo(element);
    });
    afterAll(() => {
        if (element) {
            listObj.destroy();
            element.remove();
        }
    });
    it('filter event triggering on clear icon click after entering value', () => {
        mouseEventArgs.type = 'click';
        mouseEventArgs.target = (<any>listObj).overAllWrapper;
        (<any>listObj).wrapperClick(mouseEventArgs);
        (<any>listObj).checkBoxSelectionModule.filterInput.value = "A";
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 65;
        (<any>listObj).keyDownStatus = true;
        (<any>listObj).onInput(keyboardEventArgs);
        (<any>listObj).keyUp(keyboardEventArgs);
        expect(count).toBe(1);
        (<any>listObj).checkBoxSelectionModule.clearText(mouseEventArgs);
        expect(count).toBe(2);
    });
});

describe('EJ2-44211- The focus class maintained after move the focus to another component in multiselect', () => {
    let listObj1: MultiSelect;
    let listObj2: MultiSelect;
    let element1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect1', attrs: { type: "text" } });
    let element2: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect2', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
    ];
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
    beforeEach(() => {
        document.body.appendChild(element1);
        document.body.appendChild(element2);
        listObj1 = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name' },
            mode: 'CheckBox',
        });
        listObj1.appendTo(element1);
        listObj2 = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name' },
            popupHeight: 50,
            mode: 'CheckBox',
        });
        listObj2.appendTo(element2);
    });
    afterEach(() => {
        if (element1) {
            listObj1.destroy();
            element1.remove();
        }
        if (element2) {
            listObj2.destroy();
            element2.remove();
        }
    });

    it('remove focus class on focusing out the control', (done) => {
        mouseEventArgs.type = 'click';
        mouseEventArgs.target = (<any>listObj1).viewWrapper;
        setTimeout(()=>{
            (<any>listObj1).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = document.body;
            (<any>listObj1).checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect((<any>listObj1).isPopupOpen()).toBe(false);
            expect((<any>listObj1).overAllWrapper.classList.contains('e-input-focus')).toBe(false);
        done();
        }, 800);
    });
    it('remove focus from current control while focusing other control', (done) => {
        mouseEventArgs.type = 'click';
        mouseEventArgs.target = (<any>listObj1).overAllWrapper;
        setTimeout(()=>{
            (<any>listObj1).wrapperClick(mouseEventArgs);
            expect((<any>listObj1).isPopupOpen()).toBe(true);
            mouseEventArgs.target = (<any>listObj1).overAllWrapper;
            (<any>listObj1).wrapperClick(mouseEventArgs);
            expect((<any>listObj1).overAllWrapper.classList.contains('e-input-focus')).toBe(true);
            mouseEventArgs.target = (<any>listObj2).overAllWrapper;
            (<any>listObj2).wrapperClick(mouseEventArgs);
            expect((<any>listObj1).overAllWrapper.classList.contains('e-input-focus')).toBe(false);
            mouseEventArgs.target = (<any>listObj2).overAllWrapper;
            (<any>listObj2).wrapperClick(mouseEventArgs);
            expect((<any>listObj2).overAllWrapper.classList.contains('e-input-focus')).toBe(true);
            mouseEventArgs.target = document.body;
            (<any>listObj2).checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect((<any>listObj2).isPopupOpen()).toBe(false);
            expect((<any>listObj2).overAllWrapper.classList.contains('e-input-focus')).toBe(false);
        done();
        }, 800);
    });
});
describe('875197', () => {
    let listObj: MultiSelect;
    let count: number = 0;
    let mouseEventArgs: any = { preventDefault: function () { }, target: null, stopPropagation: function () {} };
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
        { Name: 'Germany', Code: 'DE' },
        { Name: 'Greenland', Code: 'GL' },
        { Name: 'Hong Kong', Code: 'HK' },
        { Name: 'India', Code: 'IN' },
        { Name: 'Italy', Code: 'IT' },
        { Name: 'Japan', Code: 'JP' },
    ];
    let originalTimeout: number;
    beforeAll(() => {
        for (let i = 0; i < 27; i++) {
            const brElement = document.createElement('br');
            document.body.appendChild(brElement);
        }
        document.body.appendChild(element);
        listObj = new MultiSelect({
            dataSource: datasource,
            fields: { text: 'Name', value: 'Code' },
            showDropDownIcon: true,
            showSelectAll: true,
            allowFiltering: true,
            mode: 'CheckBox',
        });
        listObj.appendTo(element);
    });
    afterAll(() => {
        for (let i = 0; i < 27; i++) {
            const brElement = document.querySelector('br');
            if (brElement) {
                brElement.remove();
            }
        }
        if (element) {
            listObj.destroy();
            element.remove();
        }
    });
    it('when click the serach text to prevent the list selection', () => {
        mouseEventArgs.type = 'mousedown';
        mouseEventArgs.target = (<any>listObj).overAllWrapper;
        (<any>listObj).wrapperClick(mouseEventArgs);
        (<any>listObj).checkBoxSelectionModule.filterInput.value = "g";
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 71;
        (<any>listObj).keyDownStatus = true;
        (<any>listObj).onInput(keyboardEventArgs);
        (<any>listObj).keyUp(keyboardEventArgs);
        (<any>listObj).checkBoxSelectionModule.clearText(mouseEventArgs);
        mouseEventArgs.type = 'mouseup';
        mouseEventArgs.target = (<any>listObj).popupWrapper;
        (<any>listObj).checkBoxSelectionModule.preventListSelection(mouseEventArgs);
        (<any>listObj).onMouseClick(mouseEventArgs);
        expect((<any>listObj).list.querySelectorAll('.e-active').length).toBe(0);
    });
});
describe('EJ2-54401- Select all checkbox is not displayed properly while selecting an item from the list ', () => {
    let listObj: any;
    let checkObj: any;
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    beforeAll(() => {
        document.body.innerHTML = '';
        document.body.appendChild(element);
    });
    afterAll(() => {
        if (element) {
            listObj.destroy();
            element.remove();
        }
        checkObj = new CheckBoxSelection();
        checkObj.destroy();
    });
    it('Initially load datasoure with number of items', (done) => {
        listObj = new MultiSelect({
            dataSource: datasource, showSelectAll: true, mode: 'CheckBox',
            fields: { text: "text", value: "id" }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        setTimeout(() => {
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
            listObj.value = ["list1"];
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: block;');
            listObj.showOverAllClear();
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: block;');
            listObj.destroy();
            done();
        }, 450);
    });
    it('Initially load datasoure with only one item', (done) => {
        listObj = new MultiSelect({
            dataSource: datasource3, showSelectAll: true, mode: 'CheckBox',
            fields: { text: "text", value: "id" }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        setTimeout(() => {
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.value = ["id1"];
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.showOverAllClear();
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.destroy();
            done();
        }, 450);
    });
    it('Dynamically load datasoure with number of items', (done) => {
        listObj = new MultiSelect({
            dataSource: [], showSelectAll: true, mode: 'CheckBox',
            fields: { text: "text", value: "id" }
        });
        listObj.appendTo(element);
        listObj.dataSource = datasource;
        listObj.dataBind();
        listObj.showPopup();
        setTimeout(() => {
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
            listObj.value = ["list1"];
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: block;');
            listObj.showOverAllClear();
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: block;');
            listObj.destroy();
            done();
        }, 450);
    });
    it('Dynamically load datasoure with only one item', (done) => {
        listObj = new MultiSelect({
            dataSource: [], showSelectAll: true, mode: 'CheckBox',
            fields: { text: "text", value: "id" }
        });
        listObj.appendTo(element);
        listObj.dataSource = datasource3;
        listObj.dataBind();
        listObj.showPopup();
        setTimeout(() => {
            expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.value = ["id1"];
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.showOverAllClear();
            expect(listObj.checkBoxSelectionModule.checkAllParent.getAttribute('style')).toBe('display: none;');
            listObj.destroy();
            done();
        }, 450);
    });
});