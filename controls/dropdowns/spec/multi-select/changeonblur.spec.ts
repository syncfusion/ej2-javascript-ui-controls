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
describe('MultiSelect - changeonblur', () => {
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
                changeOnBlur: false,
                value: ['JAVA'],
                change: () => {
                    isNotLocalChange = false;
                    changeCount = changeCount + 1;
                }
            });
            setTimeout(() => {
            multiObj.appendTo('#newlist');
            expect(isNotLocalChange).toBe(true);
            expect(changeCount).toBe(0);
            multiObj.value = null;
            multiObj.dataBind();
            expect(isNotLocalChange).toBe(false);
            expect(changeCount).toBe(1);
            multiObj.destroy();
            }, 100)
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
                changeOnBlur: false,
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
                changeOnBlur: false, debounceDelay: 0,
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
                changeOnBlur: false,
                mode: 'CheckBox',
                showSelectAll: true,
                change: (): void => {
                    if (popup) {
                        expect(popup.querySelectorAll('.e-check').length).toBe(0);
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
                changeOnBlur: false,
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

    // describe('mulitselect chip remove change event', () => {
    //     let ele: HTMLElement = document.createElement('input');
    //     ele.id = 'newlist';
    //     let multiObj: any;
    //     let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
    //     { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
    //     { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
    //     { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
    //     beforeAll(() => {
    //         document.body.appendChild(ele);
    //         multiObj = new MultiSelect({
    //             hideSelectedItem: false,
    //             dataSource: data, fields: { text: 'text', value: 'text' },
    //             popupHeight: '100px',
    //             changeOnBlur: false,
    //             value: ['JAVA', 'C#', 'C++'],
    //             mode: 'Box',
    //             change: function (e: any) {
    //                 expect(e.name === "change").toBe(true);
    //                 expect(e.element).not.toBe(null);
    //             }
    //         });
    //         multiObj.appendTo('#newlist');
    //     });
    //     afterAll(() => {
    //         if (ele) {
    //             ele.remove();
    //         }
    //     })
    //     it('change event trigger', () => {
    //         let which: any = null;
    //         let button: any = null;
    //         multiObj.onBlurHandler(mouseEventArgs);
    //         let elem: HTMLElement = (<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
    //         (<any>multiObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
    //         expect(elem.parentElement).toBe(null);
    //         multiObj.onBlurHandler(mouseEventArgs);
    //     });
    // });
    describe('EJ2-13148 - Multiselect key navigation is not working with Home , Endkeys', () => {
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

        it('Check End key Navigation', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                changeOnBlur: false,
                fields: { text: "text", value: "id" },
                popupHeight: 50,
                change: (): void => {
                    (<any>listObj).onKeyDown({ keyCode: 35, preventDefault: function () { }});
                    let ele: HTMLElement = listObj.ulElement.querySelector('.e-item-focus');
                    expect(ele.innerText).toBe('F#');
                    (<any>listObj).onKeyDown({ keyCode: 36, preventDefault: function () { }});
                    ele = listObj.ulElement.querySelector('.e-item-focus');
                    expect(ele.innerText).toBe('JAVA');
                    done();
                },
                open: (): void => {
                    listObj.text = 'GO';
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
            listObj.showPopup();
        });
    });
    // describe('Validation for events.', () => {
    //     let listObj: MultiSelect;
    //     let popupObj: any;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
    //     beforeAll(() => {
    //         document.body.innerHTML = '';
    //         document.body.appendChild(element);
    //     });
    //     afterAll(() => {
    //         if (element) {
    //             element.remove();
    //         }
    //     }); 
    //     it('change Event', () => {
    //         let checker: boolean = false;
    //         listObj = new MultiSelect({
    //             hideSelectedItem: false, changeOnBlur: false, dataSource: datasource2, change: function () {
    //                 checker = true;
    //             }
    //         });
    //         listObj.appendTo(element);
    //         listObj.value = ["JAVA"];
    //         listObj.dataBind();
    //         expect(checker).toBe(true);//66
    //         listObj.destroy();
    //     });   
    // });
    describe('selectAll', () => {
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
        it('change Event', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, changeOnBlur: false, dataSource: datasource2, change: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.selectAll(true);
            expect(checker).toBe(true);
            checker = false;
            listObj.selectAll(false);
            expect(checker).toBe(true);
            listObj.destroy();
        });   
    });
    describe('change event when clear the item', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                value: ['Java'],
                changeOnBlur: false,
                allowFiltering: true, debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and clear the value using icon ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            expect(ischanged).toBe(true);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            mouseEventArgs.type = 'mouseup';
            dropDowns.clearAll(mouseEventArgs);
            expect(ischanged).toBe(true);
        });
    });
    describe('change event when clear the item box mode', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                changeOnBlur: false,
                allowFiltering: true, debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and clear the value using icon ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            expect(ischanged).toBe(true);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            mouseEventArgs.type = 'mouseup';
            dropDowns.clearAll(mouseEventArgs);
            expect(ischanged).toBe(true);
        });
    });

    describe('select all item click', () => {
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
            let checkChange: boolean = false;
            beforeAll(() => {
                document.body.appendChild(element);
                listObj = new MultiSelect({
                    dataSource: datasource,
                    fields: { text: "text", value: "id" },
                    placeholder: 'My placeholder 12345566789',
                    width: 100,
                    mode: 'CheckBox',
                    changeOnBlur: false,
                    showSelectAll: true,
                    showDropDownIcon: true,
                    change: function(e) {
                        checkChange = true;
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
            it('change event fire', () => {
                listObj.showPopup();
                mouseEventArgs.type = "mousedown";
                mouseEventArgs.target = document.getElementsByClassName('e-all-text')[0];
                mouseEventArgs.currentTarget = document.getElementsByClassName('e-selectall-parent')[0];
                (<any>listObj).checkBoxSelectionModule.clickHandler(mouseEventArgs);
                expect(checkChange).toBe(true);           
                listObj.destroy();
            });
        });
    
});
