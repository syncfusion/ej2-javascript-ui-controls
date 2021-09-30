/**
 * MultiSelect spec document
 */
import { MultiSelect, TaggingEventArgs, MultiSelectChangeEventArgs, ISelectAllEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { dropDownBaseClasses, PopupEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
                fields: { text: "text", value: "text" }, value: ["JAVA"]
            });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'true').toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(listObj.checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'false').toBe(true);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length === 0).toBe(true);
                listObj.selectAll(true);
                expect(listObj.popupObj.element.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'true').toBe(true);
                listObj.selectAll(false);
                expect(listObj.checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'false').toBe(true);
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
                listObj.destroy();
                done();
            }, 450);
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
            }, 450);
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
                element.remove();
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',

                showSelectAll: true,
                mode: 'CheckBox',
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
                expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                (<any>listObj).dispatchEvent((<any>listObj).checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(document.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'true').toBe(true);
                (<any>listObj).dispatchEvent((<any>listObj).checkBoxSelectionModule.checkAllParent, "mousedown");
                expect((<any>listObj).checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'false').toBe(true);
                expect(document.getElementsByClassName('e-check').length === 0).toBe(true);
                listObj.selectAll(true);
                expect(document.getElementsByClassName('e-check').length - 1 === listObj.value.length).toBe(true);
                expect((<any>listObj).checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'true').toBe(true);
                listObj.selectAll(false);
                expect((<any>listObj).checkBoxSelectionModule.checkWrapper.getAttribute('aria-checked') === 'false').toBe(true);
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
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                mode: 'CheckBox',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                showSelectAll: true,
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(function () {
                expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
                expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
                expect((<any>listObj).checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect((<any>listObj).isPopupOpen()).toBe(true);
                listObj.hidePopup();
                listObj.destroy();
                done();
            }, 2000);
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
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
    describe('SelectAll performance improvement', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let items: string[] = [];
        for (let i: number = 0 ; i < 1000; i++) {
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
                beforeSelectAll: function(e) { e.preventSelectEvent = true; },
                popupHeight: '350px',
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(listObj.value.length).toBe(1000);
                    done();
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
            listObj.selectAll(true);
        });
    });  
});
