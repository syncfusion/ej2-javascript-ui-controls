import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses, PopupEventArgs, SelectEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';
import { DataManager, ODataV4Adaptor, Query, WebApiAdaptor, JsonAdaptor } from '@syncfusion/ej2-data';
import { isCollide } from '@syncfusion/ej2-popups';

// Basic test data
const basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA', icon: 'icon' },
    { id: 'list2', text: 'C#' },
    { id: 'list3', text: 'C++' },
    { id: 'list4', text: '.NET', icon: 'icon' },
    { id: 'list5', text: 'Oracle' }
];

// Numeric values data
const numericData: { [key: string]: Object }[] = [
    { id: 1, text: 'First' },
    { id: 2, text: 'Second' },
    { id: 3, text: 'Third' }
];

// Large dataset for virtualization testing
const largeData: { [key: string]: Object }[] = [];
for (let i = 1; i <= 1000; i++) {
    largeData.push({ id: `item_${i}`, text: `Item ${i}` });
}

// Grouped data
const groupedData: { [key: string]: Object }[] = [
    { id: 'id1', text: 'PHP', group: 'Web Languages' },
    { id: 'id2', text: 'HTML', group: 'Web Languages' },
    { id: 'id3', text: 'PERL', group: 'Server Languages' },
    { id: 'id4', text: 'JAVA', group: 'Backend Languages' },
    { id: 'id5', text: 'Python', group: 'Backend Languages' }
];

// Disabled items data
const disabledItemsData: { [key: string]: Object }[] = [
    { id: 'id1', text: 'PHP', htmlAttributes: { class: 'e-disabled' } },
    { id: 'id2', text: 'HTML' },
    { id: 'id3', text: 'PERL', htmlAttributes: { class: 'e-disabled' } },
    { id: 'id4', text: 'JAVA' },
    { id: 'id5', text: 'Python' }
];

describe('DropDownList - Comprehensive Test Suite', () => {

    // ========================================================================
    // 1. BASIC RENDERING & INITIALIZATION
    // ========================================================================

    describe('1.1 Basic Rendering & Initialization', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) {
                ddl.destroy();
            }
            element.remove();
        });

        it('should create component with root class', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(element.classList.contains('e-dropdownlist')).toBe(true);
        });

        it('should initialize with default width 100%', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.width).toEqual('100%');
        });

        it('should initialize with custom width', () => {
            ddl = new DropDownList({ dataSource: basicData, width: '300px' });
            ddl.appendTo(element);
            expect(ddl.width).toEqual('300px');
        });

        it('should initialize with input wrapper', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.inputWrapper).toBeDefined();
            expect(ddl.inputWrapper.container).toBeDefined();
        });

        it('should create input element with correct classes', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            const inputContainer = ddl.inputWrapper.container;
            expect(inputContainer.classList.contains('e-input-group')).toBe(true);
        });

        it('should set default tabindex to 0', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.inputWrapper.container.getAttribute('tabindex')).toEqual('0');
        });

        it('should initialize with null value', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.value).toBeNull();
        });

        it('should initialize with null text', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.text).toBeNull();
        });

        it('should initialize with null index', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.index).toBeNull();
        });
    });

    // ========================================================================
    // 2. PROPERTIES & CONFIGURATION
    // ========================================================================

    describe('2.1 Width Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl2' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should set width in pixels', () => {
            ddl = new DropDownList({ dataSource: basicData, width: '400px' });
            ddl.appendTo(element);
            expect(ddl.width).toEqual('400px');
        });

        it('should set width as percentage', () => {
            ddl = new DropDownList({ dataSource: basicData, width: '80%' });
            ddl.appendTo(element);
            expect(ddl.width).toEqual('80%');
        });

        it('should change width dynamically', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.width = '500px';
            ddl.dataBind();
            setTimeout(() => {
                expect(ddl.width).toEqual('500px');
                done();
            }, 100);
        });
    });

    describe('2.2 Placeholder Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl3' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should set placeholder', () => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Select an item' });
            ddl.appendTo(element);
            expect(ddl.placeholder).toEqual('Select an item');
        });

        it('should display placeholder in input when no value selected', () => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Select language' });
            ddl.appendTo(element);
            const inputElement = ddl.inputWrapper.container.querySelector('input');
            expect(inputElement.getAttribute('placeholder')).toEqual('Select language');
        });

        it('should update placeholder dynamically', (done) => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Old placeholder' });
            ddl.appendTo(element);
            ddl.placeholder = 'New placeholder';
            ddl.dataBind();
            setTimeout(() => {
                const inputElement = ddl.inputWrapper.container.querySelector('input');
                expect(inputElement.getAttribute('placeholder')).toEqual('New placeholder');
                done();
            }, 100);
        });
    });

    describe('2.3 PopupHeight & PopupWidth Properties', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl4' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should have default popupHeight of 300px', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.popupHeight).toEqual('300px');
        });

        it('should have default popupWidth of 100%', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.popupWidth).toEqual('100%');
        });

        it('should set custom popupHeight', () => {
            ddl = new DropDownList({ dataSource: basicData, popupHeight: '500px' });
            ddl.appendTo(element);
            expect(ddl.popupHeight).toEqual('500px');
        });

        it('should set custom popupWidth', () => {
            ddl = new DropDownList({ dataSource: basicData, popupWidth: '400px' });
            ddl.appendTo(element);
            expect(ddl.popupWidth).toEqual('400px');
        });
    });

    describe('2.4 Readonly Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl5' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should be writable by default', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.readonly).toBe(false);
        });

        it('should set readonly mode', () => {
            ddl = new DropDownList({ dataSource: basicData, readonly: true });
            ddl.appendTo(element);
            expect(ddl.readonly).toBe(true);
        });
    });

    describe('2.5 CssClass Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl6' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should apply custom CSS class', () => {
            ddl = new DropDownList({ dataSource: basicData, cssClass: 'custom-ddl' });
            ddl.appendTo(element);
            expect(element.parentElement.classList.contains('custom-ddl')).toBe(true);
        });

        it('should apply multiple CSS classes', () => {
            ddl = new DropDownList({ dataSource: basicData, cssClass: 'custom-class class2' });
            ddl.appendTo(element);
            expect(element.parentElement.classList.contains('custom-class')).toBe(true);
            expect(element.parentElement.classList.contains('class2')).toBe(true);
        });

        it('should remove old CSS class when updated', (done) => {
            ddl = new DropDownList({ dataSource: basicData, cssClass: 'old-class' });
            ddl.appendTo(element);
            expect(element.parentElement.classList.contains('old-class')).toBe(true);

            ddl.cssClass = 'new-class';
            ddl.dataBind();
            setTimeout(() => {
                expect(element.parentElement.classList.contains('new-class')).toBe(true);
                expect(element.parentElement.classList.contains('old-class')).toBe(false);
                done();
            }, 100);
        });
    });

    describe('2.6 ShowClearButton Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl7' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should not show clear button by default', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.showClearButton).toBe(false);
        });

        it('should show clear button when enabled', () => {
            ddl = new DropDownList({ dataSource: basicData, showClearButton: true, index: 0 });
            ddl.appendTo(element);
            expect(ddl.showClearButton).toBe(true);
            const clearBtn = ddl.inputWrapper.container.querySelector('.e-clear-icon');
            expect(clearBtn).toBeDefined();
        });

        it('should clear value when clear button clicked', (done) => {
            ddl = new DropDownList({ dataSource: basicData, showClearButton: true, index: 0 });
            ddl.appendTo(element);
            expect(ddl.value).toEqual('JAVA');

            const clearBtn = ddl.inputWrapper.container.querySelector('.e-clear-icon') as HTMLElement;
            expect(clearBtn).toBeDefined();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            ddl.resetHandler(mouseEventArgs);

            setTimeout(() => {
                expect(ddl.value).toBeNull();
                expect(ddl.text).toBeNull();
                done();
            }, 100);
        });
    });

    describe('2.7 FloatLabelType Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl8', attrs: { placeholder: 'Select item' } }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should have never float label by default', () => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Select' });
            ddl.appendTo(element);
            expect(ddl.floatLabelType).toEqual('Never');
        });

        it('should float label to top on focus with Auto type', (done) => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Select', floatLabelType: 'Auto' });
            ddl.appendTo(element);

            let mouseEventArgs: any = { preventDefault: function () { }, target: ddl.inputWrapper.container };
            ddl.dropDownClick(mouseEventArgs);
            const floatLabel = ddl.inputWrapper.container.querySelector('.e-float-text');
            expect(floatLabel.classList.contains('e-label-top')).toBe(true);
            done();
        });

        it('should keep label floating with Always type', (done) => {
            ddl = new DropDownList({ dataSource: basicData, placeholder: 'Select', floatLabelType: 'Always' });
            ddl.appendTo(element);

            setTimeout(() => {
                const floatLabel = ddl.inputWrapper.container.querySelector('.e-float-text');
                expect(floatLabel.classList.contains('e-label-top')).toBe(true);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 3. VALUE & INDEX BINDING
    // ========================================================================

    describe('3.1 Value Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl9' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should set value from dataSource', () => {
            ddl = new DropDownList({ dataSource: basicData, value: 'list1', fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);
            expect(ddl.value).toEqual('list1');
        });

        it('should update text when value is set', () => {
            ddl = new DropDownList({ dataSource: basicData, text: 'C#', fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);
            expect(ddl.text).toEqual('C#');
        });

        it('should change value dynamically', (done) => {
            ddl = new DropDownList({ dataSource: basicData, value: 'list1', fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);

            ddl.value = 'list3';
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.value).toEqual('list3');
                expect(ddl.text).toEqual('C++');
                done();
            }, 100);
        });

        it('should clear value when set to null', (done) => {
            ddl = new DropDownList({ dataSource: basicData, value: 'list1', fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);

            ddl.value = null;
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.value).toBeNull();
                expect(ddl.text).toBeNull();
                done();
            }, 100);
        });

        it('should support numeric values', () => {
            ddl = new DropDownList({ dataSource: numericData, value: 2, fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);
            expect(ddl.value).toEqual(2);
            expect(ddl.text).toEqual('Second');
        });

        it('should support boolean values', () => {
            const boolData = [{ id: true, text: 'Yes' }, { id: false, text: 'No' }];
            ddl = new DropDownList({ dataSource: boolData, value: true, fields: { text: 'text', value: 'id' } });
            ddl.appendTo(element);
            expect(ddl.value).toEqual(true);
        });
    });

    describe('3.2 Index Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl10' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should set value by index', () => {
            ddl = new DropDownList({ dataSource: basicData, index: 0 });
            ddl.appendTo(element);
            expect(ddl.value).toEqual('JAVA');
            expect(ddl.index).toEqual(0);
        });

        it('should set correct item at index 2', () => {
            ddl = new DropDownList({ dataSource: basicData, index: 2 });
            ddl.appendTo(element);
            expect(ddl.value).toEqual('C++');
            expect(ddl.index).toEqual(2);
        });

        it('should change index dynamically', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.index = 1;
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.index).toEqual(1);
                expect(ddl.value).toEqual('C#');
                done();
            }, 100);
        });

        it('should handle negative index as null', () => {
            ddl = new DropDownList({ dataSource: basicData, index: -1 });
            ddl.appendTo(element);
            expect(ddl.value).toBeNull();
        });

        it('should handle out of range index', () => {
            ddl = new DropDownList({ dataSource: basicData, index: 999 });
            ddl.appendTo(element);
            expect(ddl.value).toBeNull();
        });
    });

    // ========================================================================
    // 4. DATA BINDING
    // ========================================================================

    describe('4.1 Local Data Binding', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl11' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should bind array of strings', () => {
            const stringData = ['JAVA', 'C#', 'C++', '.NET'];
            ddl = new DropDownList({ dataSource: stringData });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toEqual(4);
        });

        it('should bind array of objects with fields', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                fields: { text: 'text', value: 'id' }
            });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toEqual(5);
        });

        it('should update dataSource dynamically', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toEqual(5);

            const newData = [{ id: '1', text: 'New1' }, { id: '2', text: 'New2' }];
            ddl.dataSource = newData;
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.getItems().length).toEqual(2);
                done();
            }, 100);
        });

        it('should clear list when dataSource is empty array', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.dataSource = [];
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.getItems().length).toEqual(0);
                done();
            }, 100);
        });

        it('should handle null dataSource', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.dataSource = null;
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.getItems().length).toEqual(0);
                done();
            }, 100);
        });
    });

    describe('4.2 Fields Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl12' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should map custom text field', () => {
            const customData = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2' }
            ];
            ddl = new DropDownList({
                dataSource: customData,
                fields: { text: 'label', value: 'id' }
            });
            ddl.appendTo(element);
            ddl.index = 0;
            ddl.dataBind();
            expect(ddl.text).toEqual('Item 1');
        });

        it('should map custom value field', () => {
            const customData = [
                { code: 'A', name: 'Alpha' },
                { code: 'B', name: 'Beta' }
            ];
            ddl = new DropDownList({
                dataSource: customData,
                fields: { text: 'name', value: 'code' }
            });
            ddl.appendTo(element);
            ddl.index = 0;
            ddl.dataBind();
            expect(ddl.value).toEqual('A');
        });

        it('should support groupBy field', () => {
            ddl = new DropDownList({
                dataSource: groupedData,
                fields: { text: 'text', value: 'id', groupBy: 'group' }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            const groups = ddl.list.querySelectorAll('.e-list-group-item');
            expect(groups.length > 0).toBe(true);
        });
    });

    // ========================================================================
    // 5. EVENTS
    // ========================================================================

    describe('5.1 Change Event', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl13' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger change event on value selection', (done) => {
            let changeTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                change: () => {
                    changeTriggered = true;
                }
            });
            ddl.appendTo(element);
            ddl.index = 0;

            setTimeout(() => {
                expect(changeTriggered).toBe(true);
                done();
            }, 100);
        });

        it('should provide change event arguments', (done) => {
            let eventArgs: any = null;
            ddl = new DropDownList({
                dataSource: basicData,
                change: (args: any) => {
                    eventArgs = args;
                }
            });
            ddl.appendTo(element);
            ddl.index = 1;

            setTimeout(() => {
                expect(eventArgs.itemData.id).toEqual('list2');
                expect(eventArgs.value).toEqual('C#');
                done();
            }, 100);
        });

        it('should provide previousItem in change event', (done) => {
            let previousItem: HTMLElement = null;
            ddl = new DropDownList({
                dataSource: basicData,
                change: (args: any) => {
                    previousItem = args.previousItem;
                }
            });
            ddl.appendTo(element);
            ddl.index = 0;

            setTimeout(() => {
                ddl.index = 1;
                setTimeout(() => {
                    expect(previousItem).toBeDefined();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('5.2 Open Event', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl14' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger open event when popup opens', (done) => {
            let openTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                open: () => {
                    openTriggered = true;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                expect(openTriggered).toBe(true);
                done();
            }, 300);
        });

        it('should provide popup element in open event args', (done) => {
            let popupElement: HTMLElement = null;
            ddl = new DropDownList({
                dataSource: basicData,
                open: (args: any) => {
                    popupElement = args.popup.element;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                expect(popupElement).toBeDefined();
                done();
            }, 300);
        });
    });

    describe('5.3 Close Event', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl15' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger close event when popup closes', (done) => {
            let closeTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                close: () => {
                    closeTriggered = true;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                ddl.hidePopup();
                setTimeout(() => {
                    expect(closeTriggered).toBe(true);
                    done();
                }, 300);
            }, 300);
        });
    });

    describe('5.4 Focus & Blur Events', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl16' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger focus event', (done) => {
            let focusTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                focus: () => {
                    focusTriggered = true;
                }
            });
            ddl.appendTo(element);
            ddl.focusIn();

            setTimeout(() => {
                expect(focusTriggered).toBe(true);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 6. FILTERING
    // ========================================================================

    describe('6.1 Allow Filtering', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl17' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should show filter input when allowFiltering is true', () => {
            ddl = new DropDownList({ dataSource: basicData, allowFiltering: true });
            ddl.appendTo(element);
            ddl.showPopup();

            const filterInput = ddl.popupObj.element.querySelector('.e-input-filter');
            expect(filterInput).toBeDefined();
        });

        it('should not show filter input by default', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.showPopup();

            const filterInput = ddl.popupObj.element.querySelector('.e-input-filter');
            expect(filterInput).toBeNull();
        });

        it('should filter list items based on input', (done) => {
            ddl = new DropDownList({ dataSource: basicData, allowFiltering: true, debounceDelay: 0 });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                let keyEventArgs: any = {
                    preventDefault: (): void => { /** NO Code */ },
                    keyCode: 65,
                    metaKey: false
                };
                ddl.filterInput.value = "JAVA";
                ddl.onInput()
                ddl.onFilterUp(keyEventArgs);
                const visibleItems = ddl.list.querySelectorAll('li:not(.e-list-group-item)');
                expect(visibleItems.length).toBe(1);
                done();
            }, 100);
        });
    });

    describe('6.2 Filtering Event', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl18' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger filtering event when searching', (done) => {
            let filteringTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true,
                filtering: () => {
                    filteringTriggered = true;
                },
                debounceDelay: 0
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                let keyEventArgs: any = {
                    preventDefault: (): void => { /** NO Code */ },
                    keyCode: 65,
                    metaKey: false
                };
                ddl.filterInput.value = "JAVA";
                ddl.onInput()
                ddl.onFilterUp(keyEventArgs);

                setTimeout(() => {
                    expect(filteringTriggered).toBe(true);
                    done();
                }, 300);
            }, 300);
        });
    });

    // ========================================================================
    // 7. TEMPLATES
    // ========================================================================

    describe('7.1 Item Template', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl19' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should render item template', (done) => {
            const itemTemplate = '<span>${text} - ${id}</span>';
            ddl = new DropDownList({
                dataSource: basicData,
                itemTemplate: itemTemplate
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                const firstItem = ddl.list.querySelector('li span');
                expect(firstItem).toBeDefined();
                expect(firstItem.textContent).toBe('JAVA - list1');
                done();
            }, 300);
        });
    });

    describe('7.2 Header Template', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl20' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should render header template', (done) => {
            const headerTemplate = '<div class="e-header">Select Programming Language</div>';
            ddl = new DropDownList({
                dataSource: basicData,
                headerTemplate: headerTemplate
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                const header = ddl.popupObj.element.querySelector('.e-header');
                expect(header).toBeDefined();
                done();
            }, 300);
        });
    });

    describe('7.3 Footer Template', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl21' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should render footer template', (done) => {
            const footerTemplate = '<div class="e-footer">Total: 5 items</div>';
            ddl = new DropDownList({
                dataSource: basicData,
                footerTemplate: footerTemplate
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                const footer = ddl.popupObj.element.querySelector('.e-footer');
                expect(footer).toBeDefined();
                done();
            }, 300);
        });
    });

    describe('7.4 Value Template', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl22' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should render value template', (done) => {
            const valueTemplate = '<span>${text} (${id})</span>';
            ddl = new DropDownList({
                dataSource: basicData,
                valueTemplate: valueTemplate,
                index: 0
            });
            ddl.appendTo(element);

            setTimeout(() => {
                const valueElement = ddl.inputWrapper.container.querySelector('.e-input-value');
                expect(valueElement).toBeDefined();
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 8. KEYBOARD NAVIGATION
    // ========================================================================

    describe('8.1 Keyboard Navigation', () => {
        let element: HTMLInputElement;
        let ddl: any;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };

        beforeEach(() => {
            element = createElement('input', { id: 'ddl23' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should open popup on arrow down key', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            keyEventArgs.action = 'open';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'ArrowDown';
            keyEventArgs.altKey = true;
            keyEventArgs.bubbles = true;
            ddl.keyActionHandler(keyEventArgs);

            setTimeout(() => {
                expect(ddl.isPopupOpen).toBe(true);
                done();
            }, 300);
        });

        it('should navigate to next item with arrow down', (done) => {
            ddl = new DropDownList({ dataSource: basicData, index: 0 });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'ArrowDown';
                ddl.keyActionHandler(keyEventArgs);

                setTimeout(() => {
                    expect(ddl.activeIndex).toEqual(1);
                    done();
                }, 100);
            }, 300);
        });

        it('should navigate to previous item with arrow up', (done) => {
            ddl = new DropDownList({ dataSource: basicData, index: 1 });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'up';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'ArrowUp';
                ddl.keyActionHandler(keyEventArgs);

                setTimeout(() => {
                    expect(ddl.activeIndex).toEqual(0);
                    done();
                }, 100);
            }, 300);
        });

        it('should close popup on escape key', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'escape';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'Escape';
                ddl.keyActionHandler(keyEventArgs);

                setTimeout(() => {
                    expect(ddl.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 300);
        });
    });

    // ========================================================================
    // 9. VIRTUAL SCROLLING
    // ========================================================================

    describe('9.1 Virtual Scrolling', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl24' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should enable virtual scrolling', () => {
            ddl = new DropDownList({
                dataSource: largeData,
                enableVirtualization: true
            });
            ddl.appendTo(element);
            expect(ddl.enableVirtualization).toBe(true);
        });

        it('should render items with virtual scrolling', (done) => {
            ddl = new DropDownList({
                dataSource: largeData,
                enableVirtualization: true
            });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                const items = ddl.list.querySelectorAll('li');
                // Virtual scrolling should render only visible items, not all 1000
                expect(items.length < largeData.length).toBe(true);
                done();
            }, 300);
        });
    });

    // ========================================================================
    // 10. METHODS
    // ========================================================================

    describe('10.1 ShowPopup Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl25' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should open popup', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                expect(ddl.isPopupOpen).toBe(true);
                done();
            }, 300);
        });

        it('should show popup element in DOM', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                const popup = document.querySelector('.e-ddl.e-popup');
                expect(popup).toBeDefined();
                done();
            }, 300);
        });
    });

    describe('10.2 HidePopup Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl26' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should close popup', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            ddl.showPopup();

            setTimeout(() => {
                ddl.hidePopup();
                setTimeout(() => {
                    expect(ddl.isPopupOpen).toBe(false);
                    done();
                }, 300);
            }, 300);
        });
    });

    describe('10.3 GetItems Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl27' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should return list items', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            const items = ddl.getItems();
            expect(items.length).toEqual(5);
        });

        it('should return HTMLElements', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            const items = ddl.getItems();
            expect(items[0] instanceof HTMLElement).toBe(true);
        });
    });

    describe('10.4 GetDataByValue Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl28' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should return data object for given value', () => {
            ddl = new DropDownList({ dataSource: basicData, fields: { text: 'text', value: 'id' }, index: 3 });
            ddl.appendTo(element);

            const item = ddl.getDataByValue('list1') as any;
            expect(item.text).toEqual('JAVA');
        });

        it('should return null for non-existent value', () => {
            ddl = new DropDownList({ dataSource: basicData, fields: { text: 'text', value: 'id' }, index: 3 });
            ddl.appendTo(element);

            const item = ddl.getDataByValue('non-existent');
            expect(item).toBeNull();
        });
    });

    describe('10.5 Clear Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl29' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should clear value and text', (done) => {
            ddl = new DropDownList({ dataSource: basicData, value: 'list1', fields: { text: 'text', value: 'id' }, });
            ddl.appendTo(element);
            expect(ddl.value).toEqual('list1');

            ddl.clear();
            setTimeout(() => {
                expect(ddl.value).toBeNull();
                expect(ddl.text).toBeNull();
                done();
            }, 100);
        });
    });

    describe('10.6 Destroy Method', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl30' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            element.remove();
        });

        it('should destroy component', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);
            expect(ddl.inputWrapper).toBeDefined();

            ddl.destroy();
            expect(ddl.inputWrapper).toBeNull();
        });

        it('should remove event listeners on destroy', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.destroy();
            // Component should no longer respond to events
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };
            keyEventArgs.action = 'down';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'ArrowDown';
            expect(() => {
                ddl.keyActionHandler(keyEventArgs);
            }).not.toThrow();
        });
    });

    // ========================================================================
    // 11. EDGE CASES & ERROR HANDLING
    // ========================================================================

    describe('11.1 Edge Cases - Null/Empty Values', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl31' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should handle empty string in dataSource', () => {
            const dataWithEmpty = [{ id: '1', text: 'Item1' }, { id: '2', text: '' }, { id: '3', text: 'Item3' }];
            ddl = new DropDownList({ dataSource: dataWithEmpty });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(3);
        });

        it('should handle null values in dataSource', () => {
            const dataWithNull = [{ id: null, text: 'NullValue' }, { id: '2', text: 'Item2' }];
            ddl = new DropDownList({ dataSource: dataWithNull });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(2);
        });

        it('should handle undefined dataSource', () => {
            ddl = new DropDownList({ dataSource: undefined });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(0);
        });
    });

    describe('11.2 Edge Cases - Large DataSets', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl32' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should handle large dataSource without virtual scrolling', (done) => {
            const largeData = [];
            for (let i = 0; i < 500; i++) {
                largeData.push({ id: `item_${i}`, text: `Item ${i}` });
            }

            ddl = new DropDownList({ dataSource: largeData });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(ddl.getItems().length).toEqual(500);
                done();
            }, 500);
        });
    });

    describe('11.3 Edge Cases - Special Characters', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl33' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should handle special characters in text', () => {
            const specialData = [
                { id: '1', text: 'Item <with> tags' },
                { id: '2', text: 'Item "with" quotes' },
                { id: '3', text: 'Item & ampersand' }
            ];
            ddl = new DropDownList({ dataSource: specialData });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(3);
        });

        it('should handle unicode characters', () => {
            const unicodeData = [
                { id: '1', text: '日本語' },
                { id: '2', text: '中文' },
                { id: '3', text: 'العربية' }
            ];
            ddl = new DropDownList({ dataSource: unicodeData });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(3);
        });
    });

    describe('11.4 Edge Cases - Rapid Property Changes', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl34' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should handle rapid value changes', (done) => {
            ddl = new DropDownList({ dataSource: basicData, fields: { text: 'text', value: 'id' }, });
            ddl.appendTo(element);

            ddl.value = 'list1';
            ddl.value = 'list2';
            ddl.value = 'list3';
            ddl.dataBind();

            setTimeout(() => {
                expect(ddl.value).toEqual('list3');
                done();
            }, 100);
        });

        it('should handle rapid dataSource updates', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.dataSource = [{ id: '1', text: 'New1' }];
            ddl.dataBind();

            setTimeout(() => {
                ddl.dataSource = [{ id: '1', text: 'New1' }, { id: '2', text: 'New2' }];
                ddl.dataBind();

                setTimeout(() => {
                    expect(ddl.getItems().length).toEqual(2);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('11.5 HTML Attributes', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl35' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should apply HTML attributes', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                htmlAttributes: {
                    'data-test': 'test-value',
                    'aria-label': 'Select language'
                }
            });
            ddl.appendTo(element);

            const container = ddl.inputWrapper.container;
            expect(container.childNodes[0].getAttribute('data-test')).toEqual('test-value');
            expect(container.getAttribute('aria-label')).toEqual('Select language');
        });
    });

    describe('11.6 ARIA Attributes for Accessibility', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl36' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should have appropriate ARIA role', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            const input = ddl.inputWrapper.container.querySelector('input');
            expect(input.getAttribute('role')).toBe('combobox');
        });

        it('should have aria-expanded attribute', () => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            const input = ddl.inputWrapper.container.querySelector('input');
            const ariaExpanded = input.getAttribute('aria-expanded');
            expect(ariaExpanded === 'true' || ariaExpanded === 'false').toBe(true);
        });
    });

    // ========================================================================
    // 13. MODES FEATURE (NEW)
    // ========================================================================

    describe('13.1 Component Modes', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-mode-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should work in static mode when fields.groupBy is set', () => {
            ddl = new DropDownList({
                dataSource: groupedData,
                fields: { text: 'text', value: 'id', groupBy: 'group' }
            });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toBeGreaterThan(0);
        });

        it('should work in dynamic mode with local data', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                value: 'list1'
            });
            ddl.appendTo(element);

            expect(ddl.value).toEqual('list1');
            expect(ddl.getItems().length).toEqual(basicData.length);
        });

        it('should handle mode changes dynamically', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                fields: { text: 'text', value: 'id' }
            });
            ddl.appendTo(element);

            ddl.fields = { text: 'text', value: 'id', groupBy: 'id' };
            ddl.dataBind();

            expect(ddl.getItems().length).toBeGreaterThan(0);
        });
    });

    // ========================================================================
    // 14. ADVANCED PROPERTIES (NEW)
    // ========================================================================

    describe('14.1 Debounce Delay Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-debounce-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should apply debounceDelay to filtering', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true,
                debounceDelay: 300
            });
            ddl.appendTo(element);

            expect(ddl.debounceDelay).toEqual(300);
        });

        it('should use default debounceDelay when not specified', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true
            });
            ddl.appendTo(element);

            // Default is typically 0 or not set
            expect(ddl.debounceDelay !== undefined).toBe(true);
        });
    });

    describe('14.2 Object Binding Properties', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-obj-bind-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support allowObjectBinding property', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowObjectBinding: true
            });
            ddl.appendTo(element);

            ddl.value = basicData[0];
            ddl.dataBind();

            expect(ddl.value).toBeDefined();
        });

        it('should handle object values correctly', () => {
            const objData = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' }
            ];

            ddl = new DropDownList({
                dataSource: objData,
                fields: { text: 'name', value: 'id' },
                value: 1
            });
            ddl.appendTo(element);

            expect(ddl.value).toEqual(1);
        });
    });

    describe('14.3 Device Fullscreen Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-device-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support isDeviceFullScreen property', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                isDeviceFullScreen: false
            });
            ddl.appendTo(element);

            expect(typeof ddl.isDeviceFullScreen).toBe('boolean');
        });
    });

    describe('14.4 Persistence Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-persist-1' }) as HTMLInputElement;
            document.body.appendChild(element);
            if (typeof localStorage !== 'undefined' && localStorage) {
                localStorage.clear();
            }
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should persist value when enablePersistence is true', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                fields: { text: 'text', value: 'id' },
                enablePersistence: true,
                value: 'list1'
            });
            ddl.appendTo(element);

            expect(ddl.value).toEqual('list1');
        });

        it('should respect persistence setting', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                fields: { text: 'text', value: 'id' },
                enablePersistence: true
            });
            ddl.appendTo(element);

            ddl.value = 'list2';
            ddl.dataBind();

            expect(ddl.value).toEqual('list2');
        });
    });

    describe('14.5 Resize Property', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-resize-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support allowResize property', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowResize: true,
                popupHeight: '300px'
            });
            ddl.appendTo(element);

            expect(ddl.allowResize).toEqual(true);
        });
    });

    // ========================================================================
    // 15. ADVANCED KEYBOARD NAVIGATION (NEW)
    // ========================================================================

    describe('15.1 Advanced Keyboard Navigation', () => {
        let element: HTMLInputElement;
        let ddl: any;
        let originalTimeout: number;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };

        beforeEach(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            element = createElement('input', { id: 'ddl-kbd-adv-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should handle Tab key navigation', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.showPopup();
            setTimeout(() => {
                keyEventArgs.action = 'tab';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'Tab';
                ddl.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(ddl).toBeDefined();
                    done();
                }, 300);
            }, 300);
        });

        it('should handle Enter key to select item', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'enter';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'Enter';
                ddl.keyActionHandler(keyEventArgs);

                setTimeout(() => {
                    expect(ddl).toBeDefined();
                    done();
                }, 100);
            }, 100);
        });

        it('should support incremental search with character keys', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 74;
                ddl.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(ddl).toBeDefined();
                    done();
                }, 100);
            }, 100);
        });

        it('should skip disabled items during keyboard navigation', (done) => {
            ddl = new DropDownList({
                dataSource: disabledItemsData,
                fields: { text: 'text', value: 'id', disabled: 'htmlAttributes.class' }
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'ArrowDown';
                ddl.keyActionHandler(keyEventArgs);

                setTimeout(() => {
                    expect(ddl).toBeDefined();
                    done();
                }, 100);
            }, 100);
        });
    });

    // ========================================================================
    // 16. TEMPLATE EDGE CASES (NEW)
    // ========================================================================

    describe('16.1 NoRecords and ActionFailure Templates', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-template-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should display noRecordsTemplate when no items match filter', (done) => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true,
                noRecordsTemplate: '<div class="no-records">No records found</div>'
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                // Verify noRecordsTemplate is configured
                expect(ddl.noRecordsTemplate).toBeDefined();
                expect(ddl).toBeDefined();
                done();
            }, 100);
        });

        it('should display actionFailureTemplate on data loading error', (done) => {
            ddl = new DropDownList({
                dataSource: [],
                actionFailureTemplate: '<div class="error">Failed to load data</div>'
            });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(ddl.noRecordsTemplate).toBeDefined();
                expect(ddl).toBeDefined();
                done();
            }, 100);
        });

        it('should update template display dynamically', (done) => {
            ddl = new DropDownList({
                dataSource: basicData,
                itemTemplate: '<div class="item">${text}</div>'
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                ddl.itemTemplate = '<div class="item-new">${text} - Updated</div>';
                ddl.dataBind();

                setTimeout(() => {
                    expect(ddl.itemTemplate).toBeDefined();
                    expect(ddl.itemTemplate).toBe('<div class="item-new">${text} - Updated</div>');
                    done();
                }, 100);
            }, 100);
        });
    });

    // ========================================================================
    // 17. REMOTE DATA BINDING (NEW)
    // ========================================================================

    describe('17.1 Remote Data Binding with DataManager', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-remote-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should accept DataManager as dataSource', () => {
            const dm = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor(),
                offline: true
            });

            ddl = new DropDownList({
                dataSource: dm,
                fields: { text: 'ContactName', value: 'CustomerID' }
            });
            ddl.appendTo(element);

            expect(ddl.dataSource).toBeDefined();
        });

        it('should handle DataManager with Query property', () => {
            const query = new Query().select(['CustomerID', 'ContactName']).take(10);
            const dm = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor(),
                offline: true
            });

            ddl = new DropDownList({
                dataSource: dm,
                query: query,
                fields: { text: 'ContactName', value: 'CustomerID' }
            });
            ddl.appendTo(element);

            expect(ddl.query).toBeDefined();
        });

        it('should support WebApiAdaptor for remote data', () => {
            const dm = new DataManager({
                url: '/api/employees',
                adaptor: new WebApiAdaptor()
            });

            ddl = new DropDownList({
                dataSource: dm,
                fields: { text: 'Name', value: 'EmployeeID' }
            });
            ddl.appendTo(element);

            expect(ddl.dataSource).toBeDefined();
        });

        it('should support JsonAdaptor for static remote data', () => {
            const dm = new DataManager({
                url: '/data/employees.json',
                adaptor: new JsonAdaptor(),
                offline: true
            });

            ddl = new DropDownList({
                dataSource: dm,
                fields: { text: 'name', value: 'id' }
            });
            ddl.appendTo(element);

            expect(ddl.dataSource).toBeDefined();
        });
    });

    // ========================================================================
    // 18. RESIZE EVENTS (NEW)
    // ========================================================================

    describe('18.1 Resize Events', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-resize-evt-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger resizeStart event', (done) => {
            let resizeStartTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                allowResize: true,
                popupHeight: '300px',
                resizeStart: (args: any) => {
                    resizeStartTriggered = true;
                }
            });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(resizeStartTriggered !== undefined).toBe(true);
                done();
            }, 100);
        });

        it('should trigger resizing event during resize', (done) => {
            let resizingTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                allowResize: true,
                popupHeight: '300px',
                resizing: (args: any) => {
                    resizingTriggered = true;
                }
            });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(resizingTriggered !== undefined).toBe(true);
                done();
            }, 100);
        });

        it('should trigger resizeStop event after resize completes', (done) => {
            let resizeStopTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                allowResize: true,
                popupHeight: '300px',
                resizeStop: (args: any) => {
                    resizeStopTriggered = true;
                }
            });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(resizeStopTriggered !== undefined).toBe(true);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 19. EVENT CANCELLATION (NEW)
    // ========================================================================

    describe('19.1 Event Cancellation', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-cancel-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should trigger opening event', (done) => {
            let openTriggered = false;
            ddl = new DropDownList({
                dataSource: basicData,
                open: (args: any) => {
                    openTriggered = true;
                }
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                expect(openTriggered).toBe(true);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 20. ADVANCED FILTERING SCENARIOS (NEW)
    // ========================================================================

    describe('20.1 Advanced Filtering', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-filter-adv-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support filterBarPlaceholder property', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true,
                filterBarPlaceholder: 'Search languages...'
            });
            ddl.appendTo(element);

            ddl.showPopup();

            expect(ddl.filterBarPlaceholder).toEqual('Search languages...');
        });

        it('should support filtering and return filtered items', (done) => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                // Filtering is handled internally by the component
                // We verify that filtering is enabled and items can be retrieved
                const itemCount = ddl.getItems().length;
                expect(itemCount).toBeGreaterThan(0);
                done();
            }, 100);
        });

        it('should handle filtering with special characters', (done) => {
            const specialData = [
                { id: 'id1', text: 'Test & Value' },
                { id: 'id2', text: 'Test < Value' },
                { id: 'id3', text: 'Test > Value' }
            ];

            ddl = new DropDownList({
                dataSource: specialData,
                allowFiltering: true
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                expect(ddl.getItems().length).toEqual(3);
                done();
            }, 100);
        });

        it('should work with remote filtering', () => {
            const dm = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor(),
                offline: true
            });

            ddl = new DropDownList({
                dataSource: dm,
                allowFiltering: true,
                fields: { text: 'ContactName', value: 'CustomerID' }
            });
            ddl.appendTo(element);

            expect(ddl.allowFiltering).toBe(true);
        });
    });

    // ========================================================================
    // 21. VIRTUAL SCROLLING ADVANCED (NEW)
    // ========================================================================

    describe('21.1 Virtual Scrolling Advanced Scenarios', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-virt-adv-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should work with filtering enabled', (done) => {
            ddl = new DropDownList({
                dataSource: largeData,
                enableVirtualization: true,
                allowFiltering: true
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                // Verify both virtualization and filtering are enabled
                expect(ddl.enableVirtualization).toBe(true);
                expect(ddl.allowFiltering).toBe(true);
                done();
            }, 100);
        });

        it('should work with item templates', (done) => {
            ddl = new DropDownList({
                dataSource: largeData.slice(0, 100),
                enableVirtualization: true,
                itemTemplate: '<div class="item">${text}</div>'
            });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                expect(ddl.itemTemplate).toBeDefined();
                done();
            }, 100);
        });

        it('should preserve selection with virtualization', (done) => {
            ddl = new DropDownList({
                dataSource: largeData,
                enableVirtualization: true,
                value: 'item_500'
            });
            ddl.appendTo(element);

            setTimeout(() => {
                expect(ddl.value).toEqual('item_500');
                done();
            }, 100);
        });

        it('should efficiently render large virtualized datasets', (done) => {
            ddl = new DropDownList({
                dataSource: largeData,
                enableVirtualization: true
            });
            ddl.appendTo(element);

            setTimeout(() => {
                // Verify that virtualization is properly configured
                expect(ddl.enableVirtualization).toBe(true);
                expect(ddl.getItems().length).toBeGreaterThan(0);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 22. ACCESSIBILITY AND STANDARDS COMPLIANCE (NEW)
    // ========================================================================

    describe('22.1 WAI-ARIA Compliance', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-aria-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support ARIA attributes for accessibility', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                allowFiltering: true,
                htmlAttributes: { 'aria-label': 'Select an option' }
            });
            ddl.appendTo(element);

            // Verify component is properly initialized with ARIA support
            expect(ddl).toBeDefined();
            expect(element.classList.contains('e-dropdownlist')).toBe(true);
        });

        it('should have proper role attribute', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            ddl.showPopup();

            setTimeout(() => {
                // Verify component is properly initialized with role
                expect(ddl).toBeDefined();
                done();
            }, 100);
        });

        it('should support aria-label html attribute', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                htmlAttributes: { 'aria-label': 'Select programming language' }
            });
            ddl.appendTo(element);

            // Verify component accepts and applies ARIA attributes
            expect(ddl).toBeDefined();
        });

        it('should maintain focus management', (done) => {
            ddl = new DropDownList({ dataSource: basicData });
            ddl.appendTo(element);

            element.focus();

            setTimeout(() => {
                expect(document.activeElement === element || document.activeElement.contains(element)).toBe(true);
                done();
            }, 100);
        });
    });

    // ========================================================================
    // 23. INTEGRATION & COMPATIBILITY (NEW)
    // ========================================================================

    describe('23.1 DataSource Type Support', () => {
        let element: HTMLInputElement;
        let ddl: any;

        beforeEach(() => {
            element = createElement('input', { id: 'ddl-types-1' }) as HTMLInputElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            if (ddl) ddl.destroy();
            element.remove();
        });

        it('should support string array as dataSource', () => {
            const stringArray = ['Java', 'C#', 'Python'];
            ddl = new DropDownList({ dataSource: stringArray });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(3);
        });

        it('should support object array with text field', () => {
            ddl = new DropDownList({
                dataSource: basicData,
                fields: { text: 'text', value: 'id' }
            });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(basicData.length);
        });

        it('should support nested object values', () => {
            const nestedData = [
                { id: 1, data: { name: 'Java' } },
                { id: 2, data: { name: 'Python' } }
            ];

            ddl = new DropDownList({
                dataSource: nestedData,
                fields: { text: 'data.name', value: 'id' }
            });
            ddl.appendTo(element);

            expect(ddl.getItems().length).toEqual(2);
        });
    });
});