/**
 * MultiSelect spec document
 */
import { MultiSelect, TaggingEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { dropDownBaseClasses, FilteringEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DataManager, ODataV4Adaptor, Query, ODataAdaptor } from '@syncfusion/ej2-data';
import { MultiSelectModel, ISelectAllEventArgs } from '../../src/index';


let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

let dataSource44: string[] = ['java', 'php', 'html', 'oracle', '.net', 'c++'];
let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Python' }, { id: 'list5', text: 'Oracle' }];
//e-searcher  
//e-chips-close e-icon e-close-hooker
//e-multi-select-wrapper
//e-chips-collection
//e-delim-values
//e-control e-dropdownbase
//e-chips
//e-chips-close
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
// aria-disabled': 'false',
//             'aria-owns': this.element.id + '_options',
//             'role': 'listbox',
//             'aria-haspopup': 'true',
//             'aria-expanded': 'false',
//             'aria-activedescendant': 'null'
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
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} .e-multi-select-wrapper .e-multi-hidden {border: 0;height: 0;visibility: hidden; width: 0;}";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    //Validation for element strcture and css class.
    describe('rendering validation', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * element structure validation.
         */
        it('wrapper element - Box Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            //wrapper structure validation.
            expect(wrapper.nodeName).toEqual("DIV");//1
            expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
            expect(wrapper.childNodes.length).toEqual(4);//4
            //Selected items list structure validation. 
            //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
            if (wrapper.firstChild) {
                expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.selectedListContainer);//5
                expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//14
                if (wrapper.firstElementChild.childNodes.length) {
                    expect(wrapper.firstElementChild.firstElementChild.nodeName).toEqual("SPAN");//15
                    expect(wrapper.firstElementChild.firstElementChild.classList.toString()).toEqual(multiSelectData.chips);//16
                    expect(wrapper.firstElementChild.firstElementChild.lastElementChild.nodeName).toEqual("SPAN");//17
                    expect(wrapper.firstElementChild.firstElementChild.lastElementChild.classList.toString()).toEqual(multiSelectData.chipsClose);//18
                }
                if (wrapper.firstChild.nextSibling) {
                    //Input Wrapper structure validation.
                    expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//6
                    expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//7
                    if (wrapper.firstChild.nextSibling.nextSibling) {
                        //wrapper element validation.
                        expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                        expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9

                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
            } else {
                expect(true).toBe(false);
            }
            //Input element validation.
            expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
            for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
            }
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
            (<any>listObj).updateDelimView();
            listObj.destroy();
        });
        it('wrapper element - Delim Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Delimiter', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            //wrapper structure validation.
            expect(wrapper.nodeName).toEqual("DIV");//1
            expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
            expect(wrapper.childNodes.length).toEqual(multiSelectData.containerChildlength);//3
            //Selected items list structure validation. 
            //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
            if (wrapper.firstChild) {
                expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.delimContainer);//5
                expect(wrapper.firstElementChild.textContent.split(',').length).toEqual(2);//14
                if (wrapper.firstChild.nextSibling) {
                    //Input Wrapper structure validation.
                    expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//6
                    expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.delimViewContainer);//7
                    if (wrapper.firstChild.nextSibling.nextSibling) {
                        //wrapper element validation.
                        expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                        expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//9
                        if (wrapper.firstChild.nextSibling.nextSibling.nextSibling) {
                            //Close element validation.
                            expect(wrapper.firstChild.nextSibling.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                            expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
            } else {
                expect(true).toBe(false);
            }
            //Input element validation.
            expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
            for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
            }
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
            (<any>listObj).focusIn();
            listObj.destroy();
        });
        it('wrapper element - Default Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            //wrapper structure validation.
            expect(wrapper.nodeName).toEqual("DIV");//1
            expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
            expect(wrapper.childNodes.length).toEqual(multiSelectData.defaultChildlength);//3
            //Selected items list structure validation. 
            //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
            if (wrapper.firstChild) {
                expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.selectedListContainer);//5
                expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//14
                if (wrapper.firstElementChild.childNodes.length) {
                    expect(wrapper.firstElementChild.firstElementChild.nodeName).toEqual("SPAN");//15
                    expect(wrapper.firstElementChild.firstElementChild.classList.toString()).toEqual(multiSelectData.chips);//16
                    expect(wrapper.firstElementChild.firstElementChild.lastElementChild.nodeName).toEqual("SPAN");//17
                    expect(wrapper.firstElementChild.firstElementChild.lastElementChild.classList.toString()).toEqual(multiSelectData.chipsClose);//18
                }
                expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//4
                expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.delimViewContainer);//5
                if (wrapper.firstChild.nextSibling) {
                    //Input Wrapper structure validation.
                    if (wrapper.firstChild.nextSibling.nextSibling) {
                        //Close element validation.
                        expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                        expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//9
                        if (wrapper.firstChild.nextSibling.nextSibling.nextSibling) {
                            //Close element validation.
                            expect(wrapper.firstChild.nextSibling.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                            expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
            } else {
                expect(true).toBe(false);
            }
            //Input element validation.
            expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
            for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
            }
            expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).mouseIn();
            (<any>listObj).focusIn();
            listObj.destroy();
        });
        it('List Popup Element Validation.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            listObj.showPopup();
            //expect((<any>listObj).overAllWrapper.classList.contains(multiSelectData.inputFocus)).toEqual(true);//27
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                expect(listWarapper.nodeName).toEqual("DIV");//18
                expect(listWarapper.parentElement).not.toEqual(null);//19                
                if (listWarapper.firstElementChild) {//list container validation.
                    expect(listWarapper.firstChild.nodeName).toEqual("DIV");//21
                    expect(listWarapper.firstElementChild.classList.toString()).toEqual(multiSelectData.listContainer);//22
                    if (listWarapper.firstElementChild.firstChild) {//list element validation.
                        expect(listWarapper.firstElementChild.firstChild.nodeName).toEqual("UL");//23
                        expect(listWarapper.firstElementChild.firstElementChild.classList.toString().trim()).toEqual(multiSelectData.overAllList);//24
                        for (let a = 0; a < multiSelectData.listARIA.length; a++) {
                            expect((<any>listObj).ulElement.getAttribute(multiSelectData.listARIA[a])).not.toBe(null);//20
                        }
                        if (listWarapper.firstElementChild.firstElementChild.firstElementChild) {
                            expect(listWarapper.firstElementChild.firstChild.firstChild.nodeName).toEqual("LI");//25
                            expect(listWarapper.firstElementChild.firstElementChild.firstElementChild.classList.toString().trim()).toEqual(multiSelectData.listItem);//26
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
            } else {
                expect(true).toBe(false);
            }
            listObj.destroy();
        });
        it('List Popup Element Validation step - 1.', () => {
            let listObj: any = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            (<any>listObj).inputElement.focus();
            listObj.showPopup();
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listElement.firstElementChild.classList.contains(multiSelectData.ListItemSelected)).toBe(true);//28
                expect(listElement.firstElementChild.classList.contains(multiSelectData.ListItemHighlighted)).toBe(true);//29
            } else {
                expect(true).toBe(false);
            }
            listObj.hidePopup();
            expect(document.body.contains(listObj.popupObj.element)).toBe(false);
            listObj.destroy();
        });
        it('Chip rendering for mobile scenarios:', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            expect(elem.classList.contains(multiSelectData.chipSelection)).toBe(true);
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusIn();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: with wrapper click', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusIn();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: with wrapper click', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            listObj.showPopup();
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem.lastElementChild;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.hidePopup();
            mouseEventArgs.target = elem.lastElementChild;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            (<any>listObj).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = (<any>listObj).overAllClear;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            listObj.destroy();
        });
        // 
        it('Chip rendering for mobile scenarios: with onblur click', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem;
            (<any>listObj).onBlur(mouseEventArgs);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusIn();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            (<any>listObj).showPopup();
            (<any>listObj).scrollFocusStatus = false;
            (<any>listObj).onBlur(mouseEventArgs);
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: readonly true', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"], readonly: true });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            expect(elem.classList.contains(multiSelectData.chipSelection)).toBe(false);
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect(elem.parentElement).not.toBe(null);
            listObj.destroy();
            Browser.userAgent = temp;
        });
    });
    describe('Angular tag testing ', () => {
        let listObj: any;
        let element: HTMLElement
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            element = createElement('EJS-MULTISELECT', { id: 'msd' });
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            element.remove();
        });
        it('Wrapper testing ', () => {
            expect(listObj.element.tagName).toEqual('EJS-MULTISELECT');
            expect((<HTMLElement>listObj.element).contains(listObj.overAllWrapper)).toBe(true);
            listObj.resetValueHandler();
        });
    });
    //Validation for element strcture and css class.
    describe('Property validation on initial render', () => {
        let listObj: MultiSelect;
        let popupObj: any;
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
        });
        /**
         * API validation.
         */
        it('validate dimention APIs', (done) => {
            let datasource33: { [key: string]: Object }[] = datasource2.slice();
            datasource33.push({ id: 'list6', text: 'Oracle_Java_C#_Python_Flask_DJango' })
            L10n.load({
                'fr-BE': {
                    'dropdowns': {
                        'noRecordsTemplate': "Aucun enregistrement trouvé",
                        'actionFailureTemplate': "Modèle d'échec d'action",
                        "overflowCountTemplate": "More +${count} items"
                    }

                }
            });
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource33, fields: { value: 'id', text: 'text' }, width: "300px", popupHeight: "100px", popupWidth: "250px", locale: 'fr-BE' });
            listObj.appendTo(element);
            (<any>listObj).viewWrapper.setAttribute('style', "white-space: nowrap;");
            listObj.change = function () {
                expect((<HTMLElement>(<any>listObj).viewWrapper).childElementCount).toBe(1);
                listObj.destroy();
                done();
            };
            listObj.value = ['list6', 'list5', 'list4', 'list3'];
            listObj.dataBind();
        });
        /**
         * API validation.
         */
        it('validate dimention APIs', () => {

            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, width: "300px", popupHeight: "100px", mode: 'Box', popupWidth: "250px" });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper)
                expect(wrapper.getBoundingClientRect().width).toBe(300);//31
            else
                expect(true).toBe(false);
            listObj.showPopup();
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }
            listObj.width = "200px";
            listObj.dataBind();
            if (wrapper)
                expect(wrapper.getBoundingClientRect().width).toBe(200);//31
            else
                expect(true).toBe(false);
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }

            listObj.destroy();

        });
        it('validate duplicated value APIs', () => {

            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, width: "300px", popupHeight: "100px", mode: 'Box', popupWidth: "250px", value: ["JAVA", "JAVA"] });
            listObj.appendTo(element);
            expect((<any>listObj).chipCollectionWrapper.childElementCount).toBe(1);
            listObj.showPopup();
            listObj.destroy();
        });
        it('Validating the Delimeter Cahr', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["PHP", "JAVA"], mode: 'Delimiter' });
            listObj.appendTo(element);
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).toBe("PHP, JAVA,");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP, JAVA");
            listObj.setProperties({ delimiterChar: ';' })
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).toBe("PHP; JAVA;");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP; JAVA");
            listObj.destroy();
        });
        it('validate item selection on render API-Value', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["PHP", "JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild)
                expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//34
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        it('validate item selection on render API-Text', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.change = function (){
                expect(listObj.text).toEqual(listObj.value.toString());//34
                listObj.destroy();
                done();
            };
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
        });
        it('validate item selection on render API-Value', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: ['JAVA', 'PHP', 'PYTHON'] });
            listObj.appendTo(element);
            listObj.change = function (){
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild)
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//34
                else
                    expect(true).toBe(false);
                listObj.destroy();
                done();
            };
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
        });
        it('validate datasource binding without init value selection.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).chipCollectionWrapper;
            expect(wrapper && (wrapper.childNodes.length == 0)).toEqual(true);//34
            listObj.destroy();
            //listObj.query = new Query().take(4);
        });
        it('down && up key press after scroll by manually', (done) => {
            //
            let list: any = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
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
            let list: any = new MultiSelect();
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            list.appendTo(element);
            list.value = ['java', 'php'];
            list.mainData = '';
            list.delimiterChar = ',';
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
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            let wrapper: HTMLElement = (<any>listObj).chipCollectionWrapper;
            expect(wrapper && (wrapper.childNodes.length == 0)).toEqual(true);//34
            listObj.destroy();
            //listObj.query = new Query().take(4);
        });
        it('validate datasource binding with Query property.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.query = new Query().take(4);
            listObj.value = ['Python'];
            listObj.dataBind();
            expect((<any>listObj).list.querySelectorAll("li").length).toEqual(4);//34
            listObj.destroy();
        });
        it('validate datasource binding with-out data value set', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.value = ['Python'];
            listObj.dataBind();
            listObj.showPopup();
            listObj.selectAll(true);
            expect((<any>listObj).list).not.toEqual(null);//34
            listObj.destroy();
        });
        it('validate  on render API-placeholder', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: "Select your choice" });
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
            }
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        /**
         * cssClass  property.
         */
        it('cssClass ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, cssClass: 'closeState' });
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
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
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
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).overAllWrapper;
            listObj.showPopup();
            listObj.enableRtl = true;
            listObj.dataBind();
            let listWarapper = (<any>listObj).popupObj.element;
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
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, showClearButton: false, value: ['PHP'], fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.showClearButton = false;
            listObj.dataBind();
            expect((<any>listObj).componentWrapper.classList.contains(multiSelectData.closeiconhide)).toBe(true);
            listObj.destroy();
        })
        it('showClearButton ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, showClearButton: false, value: ['PHP'], fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            //Close element validation.
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper) {
                expect(wrapper.querySelector('.' + multiSelectData.overAllClose.split(' ')[2])).toEqual(null);//44
            }
            else
                expect(true).toBe(false);
            if (wrapper) {
                expect(wrapper.querySelector('.' + multiSelectData.chipsClose.split(' ')[0])).toEqual(null);//45
            }
            else
                expect(true).toBe(false);
            listObj.showClearButton = true;
            listObj.value = ['JAVA']
            listObj.dataBind();
            if (wrapper) {
                expect(wrapper.querySelector('.' + multiSelectData.overAllClose.split(' ')[1])).not.toEqual(null);//46
            }
            else
                expect(true).toBe(false);
            if (wrapper) {
                expect(wrapper.querySelector('.' + multiSelectData.chipsClose.split(' ')[0])).not.toEqual(null);//45
            }
            else
                expect(true).toBe(false);
            listObj.showClearButton = false;
            listObj.dataBind();
            if (wrapper) {
                expect((<any>listObj).overAllClear.style.display).not.toEqual(null);//46
            }
            else
                expect(true).toBe(false);
            listObj.showClearButton = true;
            listObj.dataBind();
            if (wrapper) {
                expect((<any>listObj).overAllClear.style.display).toEqual('');//46
            }
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        /**
         * List Click Action
         */
        it('Lit Click action with hide selected item and select event checkup.', () => {
            let status: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2, fields: { text: "text", value: "text" }, select: function () {
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
            expect(list[0].classList.contains('e-hide-listitem')).toBe(true);
            expect(status).toBe(true);
            listObj.destroy();
        });
        /**
         * maximumSelectionLength.
         */
        it('maximumSelectionLength.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, maximumSelectionLength: 1 });
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
            listObj.maximumSelectionLength = 2;
            (<any>listObj).onMouseClick(mouseEventArgs);
            (<any>listObj).onBlur();
            listObj.dataBind();
            expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//49
            listObj.enabled = false;
            listObj.dataBind();
            listObj.showPopup();
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        /**
         * allowCustomValue.
        */

        it('allowCustomValue.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: 'text', value: 'text' }, allowCustomValue: true, value: ['PHP'] });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            expect((<any>listObj).value.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        it('allowCustomValue with empty datasource', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: [], allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        it('allowCustomValue with array datasource', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: ['test'], allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        /**
         * readonly.
         */
        it('readonly.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            listObj.readonly = true;
            listObj.dataBind();
            expect((<any>listObj).inputElement.hasAttribute('readonly')).not.toEqual(null);//52
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            listObj.readonly = false;
            listObj.dataBind();
            expect((<any>listObj).inputElement.getAttribute('readonly')).toEqual(null);//54
            listObj.destroy();
        });
        /**
         * enabled property
         */
        it('enabled ', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: null });
            expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(true);//55
            expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('true');
            expect((<any>listObj).inputElement.getAttribute('disabled')).not.toBe(null);
            listObj.value = ['JAVA'];
            listObj.dataBind();
            listObj.showPopup();
            setTimeout (function () {
                expect((<any>listObj).value[0]).toEqual('JAVA');
                listObj.enabled = true;
                listObj.dataBind();
                expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(false);//55
                expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('false');
                expect((<any>listObj).inputElement.getAttribute('disabled')).toBe(null);
                listObj.destroy();
                done();
            }, 500);
        });
        /**
         * Interaction automation.
         */
        it('Hover event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
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
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, width: "10px" });
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
            (<any>listObj).onBlur();
            (<any>listObj).windowResize();
            (<any>listObj).removeFocus();
            (<any>listObj).selectListByKey();
            listObj.destroy();
        });
        /**
         * Interaction automation. mouseClick for filtering
         */
        it('select event validation with mouse', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
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
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>listObj).inputElement.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('filtering with same selected value', () => {
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: datasource2,
                value: ['list1'],
                fields: { value: 'id', text: 'text' },
                allowFiltering: true
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.classList.contains(dropDownBaseClasses.noData)).toBe(true);
            listObj.destroy();
        });
        it('filtering with same selected value in Grouping', () => {
            let empList: { [key: string]: Object }[] = [
                { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
                { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
                { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
                { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
                { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
            ];
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: empList,
                value: ['2'],
                fields: { value: 'eimg', text: 'text', groupBy: "country" },
                allowFiltering: true
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "Kap";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.classList.contains(dropDownBaseClasses.noData)).toBe(true);
            (<any>listObj).inputElement.value = "";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            (<any>listObj).value = ['1', '2', '3', '4', '5'];
            (<any>listObj).dataBind();
            listObj.hidePopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(false);
            (<any>listObj).value = ['1'];
            (<any>listObj).dataBind();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.destroy();
        });
        it('with out filtering in Grouping hide', () => {
            let empList: { [key: string]: Object }[] = [
                { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
                { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
                { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
                { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
                { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
            ];
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: empList,
                value: ['2'],
                fields: { value: 'eimg', text: 'text', groupBy: "country" },
            });
            listObj.appendTo(element);
            //open action validation
            (<any>listObj).addValue('3', 'Erik Linden', mouseEventArgs);
            (<any>listObj).addValue('4', 'Kavi Tam', mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            (<any>listObj).removeValue('3', mouseEventArgs);
            (<any>listObj).removeValue('4', mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.destroy();
        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JAVA!";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.focus);
            expect(elem.length).toBe(0);
            listObj.destroy();
        });
        /*
         */
        /**
         * Interaction automation. mouseClick for filtering
         */
        it('select event validation with keyboard interaction', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            (<any>listObj).windowResize();
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
            expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(false);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(true);
            listObj.maximumSelectionLength = 0;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
        });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'] });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], mode: 'Box' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box no value interaction.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Box' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value).toBe(null);
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], mode: 'Delimiter' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).delimiterWrapper.style.display).toBe('');
            listObj.destroy();
        });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' } });
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
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Box' });
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
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Delimiter' });
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
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).delimiterWrapper.style.display).toBe('');
            listObj.destroy();
        });
        /**
         * Interaction automation.
         */
        it('clearALL event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'] });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        it('clearALL event validation-box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'], mode: 'Box' });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        //onChipRemove
        /**
         * Interaction automation.
         */
        it('clear event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { text: "text", value: "text" }, value: ['JAVA', 'JAVA1', 'PHP'] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.parentElement).not.toBe(null);
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);//
            listObj.value = ['JAVA', 'JAVA1', 'PHP'];
            listObj.dataBind();
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            elem = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="PHP"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);//
            expect((<any>listObj).isPopupOpen()).toBe(false);
            elem = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA1"]');
            expect(elem).toBe(null);
            listObj.destroy();
        });
        it('clearALL event validation-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'], mode: 'Delimiter' });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).ClearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        /**
         * Interaction automation.
         */
        it('List click event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true });
            listObj.appendTo(element);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            (<any>listObj).inputFocus = true;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
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
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ["JAVA"] });
            listObj.appendTo(element);
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            (<any>listObj).inputElement.value = 'a';
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
            expect((<any>listObj).popupWrapper.getBoundingClientRect().width).toBe(400);//32
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
         * Keyboard Interaction automation.
         */
        it('Multiselect-Chip interaction validation', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'],
                chipSelection: function (e: any) {
                    expect(e.name === "chipSelection").toBe(true);
                }
            });
            listObj.appendTo(element);
            let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
            //left Validation
            //with-out textbox has value validation
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 1].classList.contains(multiSelectData.chipSelection)).toBe(true);//1
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 2].classList.contains(multiSelectData.chipSelection)).toBe(true);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 3].classList.contains(multiSelectData.chipSelection)).toBe(true);//3
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 4].classList.contains(multiSelectData.chipSelection)).toBe(true);//4
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//5
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//6
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//7
            //right Validation
            keyboardEventArgs.keyCode = 39;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 4].classList.contains(multiSelectData.chipSelection)).toBe(true);//1
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 3].classList.contains(multiSelectData.chipSelection)).toBe(true);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 2].classList.contains(multiSelectData.chipSelection)).toBe(true);//3
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 1].classList.contains(multiSelectData.chipSelection)).toBe(true);//4
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(false);//5
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//7
            //with textbox has value validation
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).inputElement.value = "JAVA";
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            keyboardEventArgs.keyCode = 39;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            //validate the back-space key with content.
            keyboardEventArgs.keyCode = 8;
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            //validate the back-space key with out content.
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            listObj.value = ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'];
            listObj.dataBind();
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(1);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            keyboardEventArgs.keyCode = 46;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 46;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(1);//2
            (<any>listObj).inputElement.value = 'JAVA';
            listObj.value = <string[]>[];
            listObj.dataBind();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            mouseEventArgs.target = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chips);
            mouseEventArgs.type = 'click';
            (<any>listObj).chipClick(mouseEventArgs);
            let chipSelected = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chipSelection);
            expect(chipSelected).not.toEqual(null);
            listObj.setProperties({ enabled: false });
            (<any>listObj).chipClick(mouseEventArgs);
            chipSelected = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chipSelection);
            expect(chipSelected).not.toEqual(null);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation for delim mode.
         */
        it('Multiselect-Chip interaction validation with delim mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, mode: 'Delimiter', closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            //validate the back-space key with out content.
            expect((<any>listObj).delimiterWrapper.innerHTML).not.toBe('');
            (<any>listObj).removeChipSelection();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).delimiterWrapper.innerHTML).toBe('');
            (<any>listObj).addValue("content", "212");
            listObj.value = <string[]>[];
            listObj.dataBind();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
        });

        /**
         * Keyboard Interaction automation for box mode.
         */
        it('Multiselect-Chip interaction validation- box mode with filtering', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, mode: 'Box', allowFiltering: true, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            keyboardEventArgs.keyCode = 8;
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            //validate the back-space key with out content.
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-popup interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
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
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            (<any>listObj).inputElement.value = "JAVA1";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
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
                dataSource: datasource2,
                select: function () {
                    selectStatus = true;
                },
                fields: { text: "text", value: "text" }, hideSelectedItem: true, value: ['HTML', 'PHP']
            });
            listObj.appendTo(element);
            listObj.selectAll(true);
            listObj.showPopup();
            let element1: HTMLElement = <HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="PHP"]');
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="HTML"]')).classList.contains('e-hide-listitem')).toBe(true);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(element1.classList.contains('e-hide-listitem')).toBe(true);
            expect(selectStatus).toBe(true);
            listObj.setProperties({ value: ['Python'] });
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="Python"]')).classList.contains('e-hide-listitem')).toBe(true);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-List interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[1]);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[2]);
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(1);
            keyboardEventArgs.keyCode = 35;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
            keyboardEventArgs.keyCode = 36;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect input interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="JAVA"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            (<any>listObj).inputElement.value = "Python";
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="Python"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation for the filtering.
         */
        it('Multiselect input interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="JAVA"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            (<any>listObj).inputElement.value = "Python";
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="Python"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            listObj.destroy();
        });
        it('filtering Event - with Key interactions', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], placeholder: 'Select Dropdown', allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).KeyUp(keyboardEventArgs);
            let coll = (<any>listObj).liCollections;
            (<any>listObj).liCollections = undefined;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            (<any>listObj).liCollections = coll;
            expect(checker).toBe(true);
            listObj.destroy();
        });
    });
    describe('Remote data binding - selectAll method', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, query: new Query().take(4), fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
        * remoteData binding with selectAll method
        */
        it('remoteData binding with selectAll method ', (done) => {
            listObj.selectAll(true);
            setTimeout(() => {
                (<any>listObj).moveByList(1);
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(4);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - with-out initial Value', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with-out initial Value ', (done) => {
            setTimeout(() => {
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(0);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - with-out keyboard list selection', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({
                hideSelectedItem: true, dataSource: remoteData,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                closePopupOnSelect: true,
            });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with-out keyboard list selection with close popup on select ', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 13;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                (<any>listObj).inputElement.value = "100";
                setTimeout(() => {
                    let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                    expect(elem.length).toBe(1);
                    listObj.destroy();
                    done();
                }, 500)
            }, 500);
        });
    });
    describe('Remote data binding - action failure', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let remoteData1: DataManager = new DataManager({ url: '/api/dummy', adaptor: new ODataV4Adaptor });
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData1, value: [1004], fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('no data text when ajax failure', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect((<any>listObj).list.classList.contains('e-nodata')).toBe(true);
                listObj.dataSource = datasource;
                listObj.dataBind();
                expect((<any>listObj).list.classList.contains('e-nodata')).not.toBe(true);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Text', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "text", value: "text" }, value: [1004] });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Text delim', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).delimiterWrapper;
                if (wrapper && wrapper.textContent)
                    expect(wrapper.innerHTML).not.toEqual('');//34
                else
                    expect(true).toBe(false);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Value box', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { text: "FirstName", value: "EmployeeID" }, value: [1004], closePopupOnSelect: false });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Value box', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild)
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//34
                else
                    expect(true).toBe(false);
                (<any>listObj).removeChip("checkers");
                (<any>listObj).removeSelectedChip();
                (<any>listObj).removeValue("JAVA");
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Value', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "text", value: "text" }, value: [1004] });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Value delim', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).delimiterWrapper;
                if (wrapper && wrapper.textContent)
                    expect(wrapper.innerHTML).not.toEqual('');//34
                else
                    expect(true).toBe(false);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - allowCustomValue', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
           * allowCustomValue.
          */
        it('allowCustomValue.-remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' }, allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    expect((<any>listObj).value).toBe(null);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
        it('allowCustomValue.- remote data with filter', (done) => {
            let status: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: remoteData, popupHeight: "auto", mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' },
                filtering: function (e) {
                    var query = new Query().select(['FirstName', "EmployeeID"]);
                    query = (e.text !== '') ? query.where('FirstName', 'startswith', e.text, true) : query;
                    e.updateData(remoteData, query);
                }, customValueSelection: function () {
                    status = true;
                }, allowCustomValue: true, allowFiltering: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    expect((<any>listObj).value).toBe(null);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
                    listObj.destroy();
                    expect(status).toBe(true);
                    done();
                }, 2000);
            }, 800);
        });
        it('allowCustomValue.-remote data without filter', (done) => {
            let status: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: remoteData, popupHeight: "auto", mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' },
                customValueSelection: function () {
                    status = true;
                    this.remoteCustomValue = true;
                }, allowCustomValue: true
            });
            listObj.appendTo(element);
            (<any>listObj).remoteCustomValue = true;
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            setTimeout(() => {
                expect(status).toBe(false);
                done();
            }, 800);
        });
    });
    describe('Remote data binding', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
         * remoteData binding with index
         */
        it('with initial Value ', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' }, value: [1003] });
            listObj.appendTo(element);
            setTimeout(() => {
                (<any>listObj).moveByList(1);
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(1);
                listObj.destroy();
                done();
            }, 800);
        });

        it('in-built filter', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: dataSource44, allowFiltering: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(0);
            expect((<any>listObj).value).toBe(null);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            listObj.destroy();
        });

        it('value update with remote datasource.', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, value: [1004], fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            setTimeout(() => {
                listObj.value = ['JAVA'];
                expect(isNullOrUndefined((<any>listObj).list)).toBe(false);
                listObj.dataBind();
                listObj.destroy();
                done();
            }, 2000);
        });

    });
    //Validation for public methods.
    describe('Validation for public methods.', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        /**
         * getPersistData
         */
        it('getPersistData method ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let stringItems: any = listObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
        it('showPopup & hidePopup Method.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            (<any>listObj).getFormattedValue("samples");
            listObj.appendTo(element);
            let listWarapper: HTMLElement = <HTMLElement>document.querySelector("#multiselect_popup");
            listObj.hidePopup();
            expect((<any>listObj).popupWrapper.parentElement).toBeNull();//60
            listObj.showPopup();
            listWarapper = <HTMLElement>document.querySelector("#multiselect_popup");
            expect(listWarapper.parentElement).not.toBeNull();//59
            (<any>listObj).moveByTop(true);
            (<any>listObj).selectListByKey(null);
            listObj.hidePopup();
            expect(listWarapper.parentElement).toBeNull();//60
            listObj.hidePopup();
            expect(listWarapper.parentElement).toBeNull();//60
            listObj.destroy();
        });
        /**
         * destroy
         */
        it('destroy method ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            listObj.destroy();
            expect((<any>listObj).overAllWrapper.parentElement).toBe(null);//61
        });
        /**
         * selectAll
         */
        it('selectAll method ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.selectAll(true);//62
            expect(listObj.value.length).toBe(datasource2.length);
            listObj.selectAll(false);//63
            expect(listObj.value.length).toBe(0);
        });

    });
    describe('templating behavior validation', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Validation for the group template', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            expect('<div><img class="eimg" src="../Employees/1.png" alt="employee"><div class="ename"> Mona Sak </div><div class="temp"> USA </div></div>').toBe((<any>listObj).ulElement.querySelector("li.e-list-item").innerHTML);
            mouseEventArgs.target = (<any>listObj).ulElement.querySelector("li.e-list-item");
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector("span.e-chipcontent");
            expect('<span><img class="tempImg" src="../Employees/1.png" height="20px" width="20px" alt="employee"><span class="tempName"> Mona Sak </span></span>').toBe(elem.innerHTML);
            mouseEventArgs.target = (<any>listObj).popupWrapper.querySelector(".head");
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        it('Footer template applied dynamically', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                '<span class="tempName"> ${text} </span></span>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.headerTemplate = '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>';
            listObj.dataBind();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            listObj.footerTemplate = '<div class="Foot"> Total Items Count: 5 </div>';
            listObj.dataBind();
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            listObj.destroy();
        });
        it('Header template applied dynamically', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.headerTemplate = '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>';
            listObj.dataBind();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            listObj.footerTemplate = '<div class="Foot"> Total Items Count: 5 </div>';
            listObj.dataBind();
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            listObj.destroy();
           
        });
    });
    //Validation for events.
    describe('Validation for events.', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('open & close Event', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, close: function () {
                    checker = true;
                }, open: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(checker).toBe(true);
            checker = false;
            listObj.hidePopup();
            expect(checker).toBe(true);
            listObj.destroy();
        });
        it('focus & blur Event.', (done) => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).escapeAction();
            listObj.value = ['JAVA'];
            listObj.dataBind();
            listObj.showPopup();
            setTimeout( function() {
                (<any>listObj).focusAtLastListItem(null);
                (<any>listObj).focusIn();
                expect(checker).toBe(true);//64
                checker = false;
                (<any>listObj).onBlur();
                (<any>listObj).focusAtLastListItem(null);
                expect(checker).toBe(true);//65
                (<any>listObj).onListMouseDown({ preventDefault: function () { } });
                (<any>listObj).onBlur({ preventDefault: function () { } });
                expect((<any>listObj).scrollFocusStatus).toBe(false);
                listObj.destroy();
                done();
            }, 500);
        });
        it('focus & blur Event.', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Box', focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).focus();
            expect(checker).toBe(true);//64
            checker = false;
            (<any>listObj).onBlur();
            expect(checker).toBe(true);//65
            listObj.destroy();
        });
        it('blur Event on focus on popup elements.', (done) => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
                mode: 'Box',
            });
            listObj.appendTo(element);
            listObj.open = function (args) {
                let mouseEventArgs: any = { preventDefault: function () { }, target: null, relatedTarget: (<any>listObj).popupObj.element };
                (<any>listObj).onBlur(mouseEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                listObj.open = null;
                args.cancel = true;
                listObj.destroy();
                done();
            };
            listObj.showPopup();
        });
        it('focus & blur Event.', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Delimiter', focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).focusIn();
            expect(checker).toBe(true);//64
            checker = false;
            (<any>listObj).onBlur();
            expect(checker).toBe(true);//65
            listObj.destroy();
        });
        it('change Event', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, change: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.value = ["JAVA"];
            listObj.dataBind();
            expect(checker).toBe(true);//66
            listObj.destroy();
        });
        it('removed and removing Event', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"], removed: function () {
                    checker = true;
                }, removing: function () {
                    checker1 = true;
                }
            });
            listObj.appendTo(element);
            if ((<any>listObj).selectAll) {
                (<any>listObj).selectAll(false);
                expect(checker).toBe(true);//68
                expect(checker1).toBe(true);//67
            }
            else
                expect(false).toBe(true);
            listObj.destroy();
        });
        it('filtering Event - with default mode', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect(checker).toBe(true);//69
            (<any>listObj).keyDownStatus = false;
            (<any>listObj).onInput();
            expect((<any>listObj).isValidKey).toBe(false);
            listObj.destroy();
        });
        it('filtering Event - with default mode without content search.', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect(checker).toBe(true);//69
            listObj.destroy();
        });
    });
    describe('Floating label', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource2,
                placeholder: 'Select ...',
                floatLabelType: 'Auto'
             });
             listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('floating-Auto: check floating to bottom - initial rendering', () => {
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });
        it('floating-Auto: check floating to top by focusing', () => {
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            (listObj as any).focusIn();
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
        it('floating-Auto: check floating to bottom by focus out', () => {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            (listObj as any).onDocumentClick(mouseEventArgs);
            (listObj as any).onBlur(mouseEventArgs);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });

        it('floating-Always: check floating to top when document click', () => {
            listObj.floatLabelType = 'Always';
            listObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            (listObj as any).onBlur(mouseEventArgs);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null);//35
            }
            else
                expect(true).toBe(false);
        });

        it('floating-Never: check floating to top when document click', () => {
            listObj.floatLabelType = 'Never';
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Select ...');//35
            }
            else
                expect(true).toBe(false);

            listObj.placeholder = 'Sample Check';
            listObj.dataBind();

            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Sample Check')//35
            }
            else
                expect(true).toBe(false);
        });
        it('floating-Auto: checking value property', () => {
            listObj.floatLabelType = 'Auto';
            listObj.value = ['HTML'];
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            listObj.value = <string[]>[];
            listObj.dataBind();
            floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });
        it('floating-Always: checking value property', () => {
            listObj.floatLabelType = 'Always';
            listObj.value = ['HTML'];
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            listObj.value = <string[]>[];
            listObj.dataBind();
            floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
        describe('Floating label - Always', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Always: check floating to top - initial rendering', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Always'
                 });
                 listObj.appendTo(element);
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Always: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusIn();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                listObj.destroy();
            });
            it('floating-Always: check floating to top - with value property', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Always',
                    value: ['HTML']
                 });
                listObj.appendTo(element);
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Always: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusIn();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                listObj.destroy();
            });
            it('floating-Always: check floating to top by clearing the value', () => {
                listObj.value = <string[]>[];
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                listObj.destroy();
            });
        });
        describe('Floating label - Never', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Never', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Never'
                 });
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
                }
                else
                    expect(true).toBe(false);
            });
        });
        describe('Floating label - Never - checking with value', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Never', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Never',
                    value: ['HTML']
                 });
                listObj.appendTo(element);
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('')//35
                }
                else
                    expect(true).toBe(false);
    
                listObj.placeholder = 'Sample Check';
                listObj.dataBind();
    
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('')//35
                }
                else
                    expect(true).toBe(false);
                listObj.value = <string[]>[];
                listObj.dataBind();
            });
            it('floating-Always: check floating to top when document click', () => {
                listObj.floatLabelType = 'Always';
                listObj.dataBind();
                mouseEventArgs.target = document.body;
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).onBlur(mouseEventArgs);
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null);//35
                }
                else
                    expect(true).toBe(false);
            });
            it('floating-Always: check focus in', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusIn();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Auto: check floating to bottom', () => {
                listObj.floatLabelType = 'Auto';
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
            });
            it('floating-Auto: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusIn();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlur(mouseEventArgs);
            });
            it('floating-Auto: with value', () => {
                listObj.value = ['HTML'];
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Auto: with value focusIn', () => {
                (listObj as any).focusIn();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlur(mouseEventArgs);
            });
            it('floating-Auto: without value', () => {
                listObj.value = <string[]>[];
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
            });
            it('floating-Auto: without value focus', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                floatElement.classList.add('e-label-bottom');
                (listObj as any).focusIn();
                floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
            });
            it('floating-Auto: without value focusout', () => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                floatElement.classList.add('e-label-top');
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlur(mouseEventArgs);
                floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
                expect(floatElement.classList.contains('e-label-top')).toBe(false);
          });
            it('floating-Always: check focus in', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                listObj.placeholder = null;
                listObj.dataBind();
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null)//35
                }
                else
                    expect(true).toBe(false);
               
            });
        });
    });
    describe('Spinner support', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                value: ['list42'],
                filtering: function (e: any) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' - spinner show instead of clear icon at initial time', () => {
            listObj.showPopup();
            listObj.mouseIn();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect(isNullOrUndefined(listObj.overAllWrapper.querySelector('e-spinner-pane'))).toBe(true);
        })
    });

    describe('selectAll method', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                filtering: function (e: any) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' hidden element check', (done) => {
            listObj.open  = function () {
                listObj.selectAll(true);
                expect((<any>listObj).hiddenElement.querySelectorAll('option').length > 0).toBe(true);
                listObj.selectAll(false);
                expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 0).toBe(true);
                listObj.value = ['lit2'];
                listObj.dataBind();
                expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 1).toBe(true);
                listObj.hidePopup();
                listObj.open = null;
                done();

            };
            listObj.showPopup();
        });

        it(' select all item', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                listObj.selectAll(true);
                expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 11).toBe(true);
                done();
            }, 400);
        })
    });
    describe('allowcustomvalue with template', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('allowCustomValue text field not update', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text' },
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                allowCustomValue: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            expect('<div><img class="eimg" src="../Employees/1.png" alt="employee"><div class="ename"> Mona Sak </div><div class="temp"> USA </div></div>').toBe((<any>listObj).ulElement.querySelector("li.e-list-item").innerHTML);
            (<any>listObj).inputElement.value = "RUBY";
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect((<any>listObj).listData[0].text === "RUBY").toBe(true);            
        });
    });
    describe('chip coloring support', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        let isTagging: boolean;
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                tagging: function (e: TaggingEventArgs) {
                    isTagging = true;
                    e.setClass((e.itemData as any)[listObj.fields.value]);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' set value as class to chip element in default mode', (done) => {
            listObj.value = ['list1'];
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            expect(isTagging).toBe(true);
            let element: HTMLElement = wrapper.querySelector('.list1');
            expect(!isNullOrUndefined(element)).toBe(true);
            isTagging = false;
            listObj.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[2];
                mouseEventArgs.type = 'click';
                (<any>listObj).onMouseClick(mouseEventArgs);
                expect(isTagging).toBe(true);
                isTagging = false;
                let element: HTMLElement = wrapper.querySelector('.list3');
                expect(!isNullOrUndefined(element)).toBe(true);
                listObj.hidePopup();
                setTimeout(() => {
                    listObj.selectAll(false);
                    done();
                }, 400);
            }, 400);
        });

        it(' set value as class to chip element in box mode', (done) => {
            (listObj as MultiSelect).mode = 'Box';
            listObj.value = ['list1'];
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            expect(isTagging).toBe(true);
            let element: HTMLElement = wrapper.querySelector('.list1');
            expect(!isNullOrUndefined(element)).toBe(true);
            isTagging = false;
            listObj.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[2];
                mouseEventArgs.type = 'click';
                (<any>listObj).onMouseClick(mouseEventArgs);
                expect(isTagging).toBe(true);
                let element: HTMLElement = wrapper.querySelector('.list3');
                expect(!isNullOrUndefined(element)).toBe(true);
                isTagging = false;
                listObj.hidePopup();
                setTimeout(() => {
                    listObj.selectAll(false);
                    done();
                }, 400);
            }, 400);
        });
    });
    describe('nested data binding to fields', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let complexStringData: { [key: string]: Object; }[] = [
            {
                id: '01', list: { text: 'text1' }, iconCss: 'iconClass1',
                primaryKey: { code: '001' }
            },
            {
                id: '02', list: { text: 'text2' }, iconCss: undefined,
                primaryKey: { code: '002' }
            },
            {
                id: '03', list: { text: 'text3' }, iconCss: 'iconClass3',
                primaryKey: { code: '003' }
            },
        ];
        beforeAll(() => {
            ele = createElement('input', { id: 'MultiSelect' });
            document.body.appendChild(ele);
            list = new MultiSelect({
                hideSelectedItem: false,
                dataSource: complexStringData,
                fields: { text: 'list.text', value: 'primaryKey.code' },
                value: ['001']
            });
            list.appendTo(ele);
        });
        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });

        it('initially select the complex data of text and value fields', () => {
            expect(list.value[0] === '001').toBe(true);
            expect(list.text === 'text1').toBe(true);
        });
        it('select the complex data of text and value fields while click on popup list', (done) => {
            list.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = list.popupObj.element.querySelectorAll('li')[1];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                list.onMouseClick(mouseEventArgs);
                expect(list.value[1] === '002').toBe(true);
                expect(list.text === 'text1,text2').toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
        it('chipremove right click', () => {
            let listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { text: "text", value: "text" }, value: ['JAVA', 'JAVA1', 'PHP'] });
            listObj.appendTo(ele);
            let which: any = null;
            let button: any = null;
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            (<any>listObj).onChipRemove({ which: 3, button: 2, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).not.toBe(null);
            listObj.destroy();
        });
    });

    describe('mulitselect enable and refresh method', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                enabled: false
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('enabled the component', (done) => {
            multiObj.enabled = true,
                multiObj.showPopup();
            setTimeout(() => {
                expect(multiObj.list.getElementsByClassName('e-list-item e-active').length === 3).toBe(true);
                done();
            }, 400);
            multiObj.refresh();
        });
    });
    describe('mulitselect chip remove change event', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                mode: 'Box',
                change: function (e: any) {
                    expect(e.name === "change").toBe(true);
                    expect(e.element).not.toBe(null);
                }
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('change event trigger', () => {
            let which: any = null;
            let button: any = null;
            multiObj.onBlur(mouseEventArgs);
            let elem: HTMLElement = (<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            (<any>multiObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);
            multiObj.onBlur(mouseEventArgs);
        });
    });

    describe('add the zIndex property', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                zIndex: 1234
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('check zindex on popup open', (done) => {
            multiObj.showPopup();
            setTimeout(() => {
                expect(multiObj.popupObj.element.style.zIndex === '1234').toBe(true);
                multiObj.zIndex = 1333;
                multiObj.dataBind();
                expect(multiObj.popupObj.element.style.zIndex === '1333').toBe(true);
                done();
            }, 400);
        });
    });
    describe('mulitselect chip select event-EJ2-7802', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                mode: 'Box',
                chipSelection: function (e: any) {
                    expect(e.name === "chipSelection").toBe(true);
                }
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('chip select event trigger', () => {
            (<any>multiObj).dispatchEvent(multiObj.chipCollectionWrapper.firstElementChild, 'mousedown');
            expect(multiObj.value.length).toBe(3);
        });
    });
    describe('Validation for events args.cancel', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('removing Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"],
                mode: 'Box',
                removing: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).removeValue('JAVA', mouseEventArgs);
            listObj.destroy();
        });
        it('tagging Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"],
                mode: 'Box',
                tagging: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            listObj.destroy();
        });
        it('filtering Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e: any) {
                    checker = true;
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('customvalueselection args.cancel.', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: 'text', value: 'text' },
                allowCustomValue: true,
                customValueSelection: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }, value: ['PHP']
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            expect((<any>listObj).value.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        it('open event args.cancel', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, close: function () {
                    checker = true;
                }, open: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.destroy();
        });
        it('close event args.cancel', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
                close: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    checker = true;
                }, open: function (e) {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.hidePopup();
            listObj.destroy();
        });
        it('select event args.cancel', () => {
            let selectStatus: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2,
                select: function (e: any) {
                    selectStatus = true;
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                },
                fields: { text: "text", value: "text" }, hideSelectedItem: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = <HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="PHP"]');
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(element1.classList.contains('e-hide-listitem')).toBe(false);
            listObj.destroy();
        });
    });
    describe('ignoreAccent support', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let comboObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['Åland', ' à propos', 'abacá'];
        beforeAll(() => {
            document.body.appendChild(element);
            comboObj = new MultiSelect({
                dataSource: data,
                ignoreAccent: true,
                allowFiltering: true
            });
            comboObj.appendTo(element);
        });
        afterAll(() => {
            comboObj.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            comboObj.showPopup();
            comboObj.inputElement.value = 'ä';
            keyEventArgs.keyCode = 67;
            comboObj.onKeyDown(keyEventArgs);
            comboObj.onInput();
            comboObj.KeyUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = comboObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 2).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                comboObj.onMouseClick(mouseEventArgs);
                expect(comboObj.value[0] === 'Åland').toBe(true);
                expect(comboObj.text === 'Åland').toBe(true);
                comboObj.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });
    describe('mulitselect datasource load dynamically with allowcustom value-CR-issue', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: ['c'], fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                allowCustomValue: true,
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('CR-issue EJ2-7929', () => {
            expect(multiObj.dataSource.length).toBe(1);
            multiObj.dataSource = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
            multiObj.dataBind();
            expect(multiObj.dataSource.length).toBe(5);
            multiObj.destroy();
        });
    });
    describe('mulitselect value set null dynamically', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'], fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['Cricket', 'Golf'],
                allowCustomValue: true,
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('value set null', () => {
            expect(multiObj.value.length).toBe(2);
            multiObj.value = null;
            multiObj.dataBind();
            expect(multiObj.value).toBe(null);
            multiObj.destroy();
        });
    });
    describe('mulitselect openOnClick API validation', () => {
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
        it('openOnClick', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, openOnClick: false, mode: 'Box', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            multiObj.appendTo('#newlist');
            //open action validation
            let elem: HTMLElement = (<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = (<any>multiObj).overAllWrapper;
            (<any>multiObj).wrapperClick(mouseEventArgs);
            (<any>multiObj).renderPopup();
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
            (<any>multiObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).KeyUp(keyboardEventArgs);
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(true);
            let element1: HTMLElement = (<any>multiObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>multiObj).inputElement.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).KeyUp(keyboardEventArgs);
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
            multiObj.destroy();
        });
    });
    describe('Remote data binding value set dynamically', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('value set dyanamically', (done) => {
            listObj.value = [1004];
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.value.length).toBe(1);
                done();
            }, 800);
        });
    });
    describe('list items focus', () => {
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
        it('wrongly focused item', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }
            });
            multiObj.appendTo('#newlist');
            //open action validation
            (<any>multiObj).inputElement.value = 'data';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).KeyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>multiObj).list.querySelector('.e-list-item.e-item-focus');
            expect((<any>multiObj).list.querySelector('.e-list-item.e-item-focus')).toBe(null);
            (<any>multiObj).inputElement.focus();
            (<any>multiObj).inputElement.value = '';
            keyboardEventArgs.keyCode = 8;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onKeyDown(keyboardEventArgs);
            (<any>multiObj).KeyUp(keyboardEventArgs);
            multiObj.destroy();
        });
    });


    describe('dataBound event - no items selection in initial rendering', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('Should not trigger the dataBound event when no item is set in initial rendering- local bind', () => {
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
        });
        it('Should not trigger the dataBound event when no item is set in initial rendering- remote bind', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            setTimeout(() => {
                expect(isDataBound).toBe(false);
                done();
            }, 800);
        });
    });

    describe('dataBound event - items selection in initial rendering', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('trigger the dataBound event when item is set in initial rendering- local bind', () => {
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' },
                value: ['list1'],
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(true);
        });
        it('trigger the dataBound event when item is set in initial rendering- remote bind', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                value: ['Nancy'],
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(isDataBound).toBe(true);
                done();
            }, 800);
        });
    });

    describe('event args.cancel', () => {
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

        it(' filtering event', (done) => {
            dropDowns = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                fields: { value: 'id', text: 'text' },
                filtering: (e: FilteringEventArgs) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'JAVA';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.KeyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length > 0).toBe(true);
                done();
            }, 500);
        });
    });
    describe('remote data : actionBegin event args.cancel', () => {
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
        it(' actionBegin event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName' },
                actionBegin: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'Nancy';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.KeyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length).toBe(0);
                done();
            }, 800);
        });
    });

    describe('remote data :actionComplete event args.cancel', () => {
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


        it(' actionComplete event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName' },
                actionComplete: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'Nancy';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.KeyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length).toBe(0);
                done();
            }, 800);
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
                allowFiltering: true,
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
            dropDowns.inputElement.value = 'J';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.KeyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                done();
            }, 500);
        });

    });

    describe('created and destroy event', () => {
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

        it(' trigger create event after component rendering', () => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                created: () => {
                    isCreated = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isCreated).toBe(true);
        });
        it(' trigger destroyed event after component destroy', (done) => {
            let isDestroy: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                destroyed: () => {
                    isDestroy = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.destroy();
            setTimeout(() => {
                expect(isDestroy).toBe(true);
                done();
            }, 200);
        });

    });
    describe('popupHeight changed dynamically', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it('popupHeight changes', (done) => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                }
            });
            dropDowns.appendTo(element);
            dropDowns.popupHeight = '600px';
            dropDowns.dataBind();
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.popupWrapper.style.maxHeight === '600px').toBe(true);
                dropDowns.destroy();
                done();
            }, 200);
        });
    });


    describe(' bug(EJ2-9000): value with space issue in hidden element', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' check the selected value in hidden element', () => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script']
            });
            dropDowns.appendTo(element);
            expect(dropDowns.hiddenElement.value === 'Java Script').toBe(true);
            dropDowns.destroy();
        });
    });

    describe(' bug(EJ2-8805): htmlAttributes properties are set into disabled input element.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input');
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' set the attributes to corresponding element', () => {
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                htmlAttributes: { title: "Select Multiple value", id: 'dropdown', form: "formname" }
            });
            dropDowns.appendTo(element);
            expect(dropDowns.hiddenElement.getAttribute('form') === 'formname').toBe(true);
            expect(dropDowns.element.getAttribute('id') === 'dropdown').toBe(true);
            expect(dropDowns.overAllWrapper.getAttribute('title') === 'Select Multiple value').toBe(true);
            dropDowns.destroy();
        });
        it(' set the inbuilt validation attributes in input', () => {
            element.setAttribute('required', 'true');
            element.setAttribute('form', 'formName');
            element.setAttribute('aria-required', 'required');
            let dropDowns1: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC']
            });
            dropDowns1.appendTo(element);
            expect(dropDowns1.hiddenElement.getAttribute('required') === 'true').toBe(true);
            expect(dropDowns1.hiddenElement.getAttribute('form') === 'formName').toBe(true);
            expect(dropDowns1.hiddenElement.getAttribute('aria-required') === 'required').toBe(true);
            dropDowns1.destroy();
        });
    });
    describe('page up first list item focus', () => {
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
        it('first list item focus', (done) => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            setTimeout(() => {
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                keyboardEventArgs.keyCode = 34;
                (<any>multiObj).onKeyDown(keyboardEventArgs);
                expect(multiObj.ulElement.querySelectorAll('li.e-item-focus')[0].textContent === "Oracle").toBe(true);
                keyboardEventArgs.keyCode = 33;
                (<any>multiObj).onKeyDown(keyboardEventArgs);
                expect(multiObj.ulElement.querySelectorAll('li.e-item-focus')[0].textContent === "PERL").toBe(true);
                (<any>multiObj).destroy();
                done();
            }, 450);
        });
    });
    describe('cutom value', () => {
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
        it('custom value not added initial rendering box mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
        it('custom value not added initial rendering Delimiter mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Delimiter', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
        it('custom value not added initial rendering Default mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Default', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
    });
    describe('dynamic change sortorder', () => {
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
        it('sortorder changed', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'Delimiter', fields: { value: 'text', text: 'text' }, allowFiltering: true
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            multiObj.hidePopup();
            expect((<any>multiObj).isPopupOpen()).toBe(false);
            multiObj.sortOrder = 'Descending';
            multiObj.dataBind();
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelector('li').textContent === 'Python').toBe(true);
            multiObj.hidePopup();
            multiObj.sortOrder = 'Ascending';
            multiObj.dataBind();
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelector('li').textContent === 'HTML').toBe(true);
            (<any>multiObj).destroy();
        });
    });
    
    describe(' bug(EJ2-8830): Popup is not closed  while press the tab key.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' close the popup while press the tab key', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script']
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.isPopupOpen()).toBe(true);
                keyboardEventArgs.keyCode = 9;
                dropDowns.onKeyDown(keyboardEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(false);
                    dropDowns.destroy();
                    done();
                }, 450)
            }, 450);
        });
    });

    describe(' bug(EJ2-8802): No Records data is visible after clear the selected value.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
            document.body.innerHTML='';
        });

        it(' close the popup while press the tab key', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                dropDowns.inputElement.value = "C#";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 70;
                dropDowns.keyDownStatus = true;
                dropDowns.onInput();
                dropDowns.KeyUp(keyboardEventArgs);
                expect(dropDowns.list.classList.contains(dropDownBaseClasses.noData)).toBe(true);
                dropDowns.ClearAll(keyboardEventArgs);
                expect(dropDowns.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
                dropDowns.destroy();
                done();
            }, 450);

        });
    });

    describe(' bug(EJ2-8836): MultiSelect not focusout while double click on header and then click on document', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' Close the popup while click on document', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            let dropDowns: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                dropDowns.inputElement.focus();
                dropDowns.onDocumentClick(mouseEventArgs);
                dropDowns.onBlur(mouseEventArgs);
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

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = dropDowns.list;
                dropDowns.inputElement.focus();
                dropDowns.onDocumentClick(mouseEventArgs);
                dropDowns.onBlur(mouseEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(true);
                    dropDowns.destroy();
                    Browser.userAgent = navigator.userAgent;
                    done();
                }, 450)
            }, 450);
        });
    });
    describe('GetItems related bug', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: MultiSelect;
        let ddl1: MultiSelect;
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
            element1 = <HTMLInputElement>createElement('input', { id: 'multiSelect1' });
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new MultiSelect({
                dataSource: data
            });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toBe(2);
        });
    });
    describe('Boolean value support', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('select boolean value', () => {
            ddl = new MultiSelect({
                dataSource: data,
                value: [true]
            });
            ddl.appendTo(element);
            expect(ddl.value[0]).toBe(true);
            expect(ddl.text).toBe('true');
            expect(ddl.getDataByValue(true)).toBe(true);
        });
        it('set boolean value in dynamic way', () => {
            ddl = new MultiSelect({
                dataSource: data
            });
            ddl.appendTo(element);
            ddl.setProperties({value:[false]});
            expect(ddl.value[0]).toBe(false);
            expect(ddl.text).toBe('false');
            expect(ddl.getDataByValue(false)).toBe(false);
        });
        it('select boolean value', () => {
            ddl = new MultiSelect({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'},
                value: [true]
            });
            ddl.appendTo(element);
            expect(ddl.value[0]).toBe(true);
            expect(ddl.text).toBe('success');
            expect(ddl.getDataByValue(true).text).toBe('success');
        });
        it('set boolean value in dynamic way', () => {
            ddl= new MultiSelect({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'}
            });
            ddl.appendTo(element);
            ddl.setProperties({value:[false]});
            expect(ddl.value[0]).toBe(false);
            expect(ddl.text).toBe('failure');
            expect(ddl.getDataByValue(false).text).toBe('failure');
        });
    });
    describe('Check beforeopen event', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: MultiSelect;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new MultiSelect({
                dataSource: data,
                beforeOpen: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
        });
    });
    describe('Disabled with showpopup public method', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let isOpen: boolean = false;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('check popup open', () => {
            ddl = new MultiSelect({
                dataSource: data,
                value: [true],
                enabled: false,
                open: (): void => {
                    isOpen = true;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            expect(isOpen).toBe(false);
        });
    });
    describe('Check SelectedAll event', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' }, 
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let ddl: MultiSelect;
        let isSeleted: boolean = true;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiselect1' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check event raisedd for select and deselect', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "text" },
                showSelectAll: true,
                selectedAll: (args: ISelectAllEventArgs): void => {
                    if (args.isChecked) {
                        expect(isSeleted).toBe(true);
                    } else {
                        expect(isSeleted).toBe(false);
                    }
                }

            });
            ddl.appendTo(element);
            ddl.selectAll(true);
            isSeleted = false;
            ddl.selectAll(false);
            ddl.destroy();
        });
        it('Check the items count', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "text" },
                value: ['C#'],
                showSelectAll: true,
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(args.itemData.length).toBe(4);
                }

            });
            ddl.appendTo(element);
            ddl.selectAll(true);
            ddl.destroy();
        });
        it('filtering with same selected value', () => {
            ddl = new MultiSelect({
                dataSource: data,
                allowFiltering: true,
                showSelectAll: true,
                fields: { text: "text", value: "text" },
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(args.itemData.length).toBe(2);
                }

            });
            ddl.appendTo(element);
            //open action validation
            ddl.showPopup();
            (<any>ddl).inputElement.value = "C";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>ddl).keyDownStatus = true;
            (<any>ddl).onInput();
            (<any>ddl).KeyUp(keyboardEventArgs);
            ddl.selectAll(true);
        });
    });
    describe('Check end of Space value select', () => {
        let element: HTMLInputElement;
        let selectElement: HTMLDivElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' }, 
            { id: 'list2 ', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let ddl: MultiSelect;
        let isSeleted: boolean = true;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiselect1' });
            selectElement = <HTMLDivElement>createElement('div', { id: 'multiselect2' });
            selectElement.innerHTML = `<select id="list"> 
                <option value="0">American Football</option>
                <option value="1 ">Badminton</option>
                <option value="2">Basketball</option>
                <option value="3">Cricket</option>
                <option value="4">Football</option>
                <option value="5">Golf</option>
                <option value="6">Hockey</option>
                <option value="7">Rugby</option>
                <option value="8">Snooker</option>
                <option value="9">Tennis</option>
            </select>`;
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the JSON', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list2 ']

            });
            ddl.appendTo(element);
            expect((<any>ddl).viewWrapper.innerText).toBe('C#');
        });
        it('Check the select Element', () => {
            ddl = new MultiSelect({
                value: ['1 ']

            });
            ddl.appendTo(selectElement.querySelector('#list') as HTMLElement);
            expect((<any>ddl).viewWrapper.innerText).toBe('Badminton');
        });
    });

    describe('CR issue - EJ2-17970 - UI breaking', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datamanager: DataManager = new DataManager({
            url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Customers',
            adaptor: new ODataAdaptor,
            crossDomain: true
        });
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

        it('ensure change event', (done) => {
            listObj = new MultiSelect({
            dataSource: datamanager,
            query: new Query().select(['ContactName', 'CustomerID']).take(25),
            fields: { text: 'ContactName', value: 'CustomerID' },
            placeholder: 'Select customer',
            sortOrder: 'Ascending',
            allowFiltering: true,
            value: ['ANATR'],
            open: () => {
                if ( (<any>listObj).inputElement.value === 'c') {
                   let len: number = (<any>listObj).ulElement.querySelectorAll('li').length;
                    expect(len).toBeGreaterThan(1);
                    done();
                } else {
                    (<any>listObj).inputElement.value = 'c';
                keyboardEventArgs.keyCode = 8;
                (<any>listObj).onInput();
                (<any>listObj).onKeyUp(keyboardEventArgs);
                }
            }
            });
            listObj.appendTo(element);
            listObj.dataBind();
            (<any>listObj).inputElement.value = 'c;';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 186;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).KeyUp(keyboardEventArgs);
        });

    });

});