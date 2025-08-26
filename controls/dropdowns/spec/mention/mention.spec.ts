import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { Mention } from '../../src/mention/mention';
import { DataManager, ODataV4Adaptor, Query, WebApiAdaptor } from '@syncfusion/ej2-data';
import { isCollide } from '@syncfusion/ej2-popups';

L10n.load({
    'fr-BE': {
        'mention': {
            'noRecordsTemplate': "Aucun enregistrement trouvé"
        }
    },
    'es': {
        'mention': {
            'noRecordsTemplate': "Pas de"
        }
    }
});
let languageData: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];

let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Phython' }, { id: 'list5', text: 'Oracle' }];

const empList: { [key: string]: Object }[] = [
    { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA'  },
    { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
    { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
    { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
    { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' }
];

const keyDownEventArgs: any = {
    preventDefault: (): void => { /** NO Code */ },
    action: 'down',
    keyCode: 40,
    key: 'ArrowDown'
};

const keyMentionEventArgs: any = {
    preventDefault: function () { },
    code: 'Digit2',
    keyCode: 50,
    key: '@'
};

function setCursorPoint(element: Element, point: number) {
    let range: Range = document.createRange();
    let sel: Selection = document.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
describe('Mention', () => {
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
    document.getElementsByTagName('head')[0].appendChild(style);
    //Local data bindng with default values
    describe('Local data binding with default values for input', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            expect(mentionObj.element.classList.contains('e-mention')).not.toBe(0);
        });
        /**
         * document click before open popup
         */
        it('document click before open popup', (done) => {

            mentionObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            mentionObj.onDocumentClick(mouseEventArgs);
            expect(document.body.contains(mentionObj.popupObj.element)).toBe(false);
            setTimeout(() => {
                expect(isNullOrUndefined(mentionObj.isPopupOpen)).toBe(false);
                done();
            }, 500);
        });
        it('Popup height & width', () => {
            mentionObj.showPopup();
            popupObj = document.getElementById('popupWrapper');
            expect(mentionObj.popupWidth).toEqual('auto');
            expect(mentionObj.popupHeight).toEqual('300px');
            mentionObj.hidePopup();
        });
    });
    describe('Local data binding with default values for textarea', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            expect(mentionObj.element.classList.contains('e-mention')).not.toBe(0);
        });
        /**
         * document click before open popup
         */
        it('document click before open popup', (done) => {
            mentionObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            mentionObj.onDocumentClick(mouseEventArgs);
            expect(document.body.contains(mentionObj.popupObj.element)).toBe(false);
            setTimeout(() => {
                expect(isNullOrUndefined(mentionObj.isPopupOpen)).toBe(false);
                done();
            }, 500);
        });
        it('Popup height & width', () => {
            mentionObj.showPopup();
            popupObj = document.getElementById('popupWrapper');
            expect(mentionObj.popupWidth).toEqual('auto');
            expect(mentionObj.popupHeight).toEqual('300px');
            mentionObj.hidePopup();
        });
    });
    describe('Local data binding with default values div', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' } );
        beforeAll(() => {
            element.innerHTML ="<p><br></p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            expect(mentionObj.element.classList.contains('e-mention')).not.toBe(0);
        });
        /**
         * document click before open popup
         */
        it('document click before open popup', (done) => {
            setCursorPoint(mentionObj.inputElement.firstChild, 0);
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            mentionObj.onDocumentClick(mouseEventArgs);
            expect(document.body.contains(mentionObj.popupObj.element)).toBe(false);
            setTimeout(() => {
                expect(isNullOrUndefined(mentionObj.isPopupOpen)).toBe(false);
                done();
            }, 500);
        });
        it('Popup height & width', () => {
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.showPopup();
            popupObj = document.getElementById('popupWrapper');
            expect(mentionObj.popupWidth).toEqual('auto');
            expect(mentionObj.popupHeight).toEqual('300px');
            mentionObj.hidePopup();
        });
    });
    // collision
    describe('mention collision checking', () => {
        let mentionObj: any;
        let parentElement: HTMLElement = document.createElement('div');
        parentElement.style.marginTop = '500px';
        let data: string[] = ['Cricket', '', 'Tennis', 'VolleyBall', 'Badminton', 'Basketball', 'Footballs', 'Rugby', 'Bags', 'Tenni', 'Sweet', 'Hot'];
        beforeEach(() => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
            parentElement.appendChild(element)
            document.body.appendChild(parentElement);
            mentionObj = new Mention({ dataSource: data, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        /**
         * set the search key value in text
         */
        it('Collision at bottom', () => {
            mentionObj.showPopup();
            expect(isCollide(mentionObj.popupObj.element)[0]).toBe("bottom");
        });
        afterEach(() => {
            if (parentElement) {
                parentElement.remove();
                document.body.innerHTML = '';
            }
        });
    });

    describe('actionFailure event', () => {
        let mentionObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('no data text when ajax failure', (done) => {
            mentionObj = new Mention({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' }, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup()
            setTimeout(() => {
                expect(mentionObj.list.classList.contains('e-nodata')).toBe(true);
                done();
            }, 800);
        });
        it('mouse click on noRecords template', () => {
            mouseEventArgs.target = mentionObj.list;
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.beforePopupOpen).toBe(true);
        });
    });
    describe('noRecords template while empty dataSource', () => {
        let mentionObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeEach(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: [], debounceDelay: 0 });
            mentionObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('popup open state - press down key in records template ', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'down',
                type: 'keydown'
            };
            mentionObj.keyActionHandler(keyEventArgs);
            expect(mentionObj.inputElement.value === '').toBe(true);
        });

        it('close the noRecords template popup by escape key ', (done) => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'escape',
                type: 'keydown'
            };
            mentionObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(mentionObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
    });

    describe('noRecords template while empty dataSource in mobile layout', () => {
        let mentionObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeEach(() => {
            document.body.appendChild(element);
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            mentionObj = new Mention({ dataSource: [], debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('show noRecord template', (done) => {
            mentionObj.showPopup();
            setTimeout(() => {
                expect(mentionObj.isPopupOpen).toBe(true);
                expect(mentionObj.list.classList.contains('e-nodata')).toBe(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 450);
        });
    });
    describe('Remote data binding', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let remoteData: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * remoteData binding with value
         */
        it('Mention at initialize time ', (done) => {
            mentionObj = new Mention({ dataSource: remoteData, query: new Query().take(9), debounceDelay: 0, fields: { value: 'EmployeeID', text: 'FirstName' } });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            setTimeout(() => {
                expect(isNullOrUndefined(mentionObj.popupObj)).toBe(true);
                done();
            }, 800);
        });

    });

    //Multiple cssClass
    describe('Add multiple cssClass', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Dynamically change multiple cssClass', () => {
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, cssClass: 'sample' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup();
            expect(mentionObj.popupObj.element.classList.contains('sample')).toEqual(true);
            mentionObj.cssClass = 'test highlight';
            mentionObj.dataBind();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(true);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(true);
        });
        it('Initially render multiple cssClass', () => {
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, cssClass: 'sample highlight' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup();
            expect(mentionObj.popupObj.element.classList.contains('sample')).toEqual(true);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(true);
            mentionObj.cssClass = 'test';
            mentionObj.dataBind();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(true);
        });
        it('Dynamically change cssClass as null', () => {
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, cssClass: 'test highlight' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(true);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(true);
            mentionObj.cssClass = null;
            mentionObj.dataBind();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(false);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(false);
        });
        it('Dynamically change cssClass as empty', () => {
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, cssClass: 'test highlight' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(true);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(true);
            mentionObj.cssClass = '';
            mentionObj.dataBind();
            expect(mentionObj.popupObj.element.classList.contains('test')).toEqual(false);
            expect(mentionObj.popupObj.element.classList.contains('highlight')).toEqual(false);
        });
    });

    // // Method testing
    describe('Mention method"s testing ', () => {
        let mentionObj: any;
        let element: HTMLInputElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 700;
            element = <HTMLInputElement>createElement('input', { id: 'inputMention' });
            document.body.appendChild(element);
            mentionObj = new Mention({ fields: { text: 'text', value: 'id' }, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) { element.remove(); };
            document.body.innerHTML = '';
        });
        /**
         * show popup method
         */
        it('show popup method', (done) => {
            mentionObj.showPopup();
            setTimeout(function () {
                expect(mentionObj.isPopupOpen).toEqual(true);
                expect(mentionObj.element.classList.contains('e-mention')).toEqual(true);
                mentionObj.showPopup();
                expect(mentionObj.isPopupOpen).toEqual(true);
                done();
            }, 450);
        });
        /**
         * hide popup method
         */
        it('Hide popup method', (done) => {
            mentionObj.hidePopup();
            setTimeout(function () {
                expect(mentionObj.isPopupOpen).toEqual(false);
                mentionObj.hidePopup();
                expect(mentionObj.isPopupOpen).toEqual(false);
                done();
            }, 450);

        });
        /**
         * search method
         */
        it('search method ', (done) => {
            (element as HTMLInputElement).value ='snooker';
            mentionObj.search((element as HTMLInputElement).value, 146, 106);
            setTimeout(function () {
                expect(mentionObj.isPopupOpen).toEqual(true);
                done();
            }, 450);
        });
        /**
         * getModuleName
         */
        it('getModuleName method', () => {
            let name: string = mentionObj.getModuleName();
            expect(name).toEqual('mention');
        });
        /**
         * getNgDirectiveName
         */
         it('getNgDirectiveName method', () => {
            let name: string = mentionObj.getNgDirective ();
            expect(name).toEqual('EJS-MENTION');
        });
        it('destroy method ', function () {
            mentionObj.destroy();
            expect(!!mentionObj.element.classList.contains('e-mention')).toBe(false);
            document.body.innerHTML = '';
        });
    });

     describe('Mention search method testing ', () => {
        let mentionObj: any;
        let element: HTMLDivElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 700;
            element = <HTMLDivElement>createElement('div', { id: 'inputMention' });
            document.body.appendChild(element);
            mentionObj = new Mention({ fields: { text: 'text', value: 'id' }, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) { element.remove(); };
            document.body.innerHTML = '';
        });
        it('search method with hide popup checking', (done) => {
            mentionObj.showPopup();
            mentionObj.isPopupOpen = true;
            mentionObj.search("snooker ", 146, 106);
            setTimeout(function () {
                expect(mentionObj.isPopupOpen).toEqual(false);
                done();
            }, 450);
        });
    });

    describe('Show popup onKeyup and inserting texts', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@', debounceDelay: 0, showMentionChar: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.value).toBe('@PERL');
        });
    });

    describe('Show popup onKeyup and navigating lists', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value and navigations between the lists', () => {
            element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'down',
                keyCode: 40,
                key: 'ArrowDown'
            };
            mentionObj.onKeyUp(keyEventArgs);
            mentionObj.keyActionHandler(keyEventArgs);
            expect(mentionObj.list.childNodes[0].childNodes[1].classList.contains('e-active')).toBe(true);
        });
    });

    describe('Show popup onKeyup and and closing using escape', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('key when popup is open', () => {
            element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'escape',
                type: 'keydown'
            };
            mentionObj.onKeyUp(keyEventArgs);
            mentionObj.keyActionHandler(keyEventArgs);
            expect(mentionObj.isPopupOpen).toBe(false);
        });
    });

    describe('Show popup onKeyup and inserting listitem using tab key', () => {
        let mentionObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value and navigations between the lists', (done) => {
            element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'tab',
                keyCode: 9,
                key: 'Tab'
            };
            mentionObj.onKeyUp(keyMentionEventArgs);
            setTimeout(() => {
                mentionObj.keyActionHandler(keyEventArgs);
                expect(mentionObj.element.value === 'PHP').toBe(true);
                done();
            }, 450);
        });
    });

    describe('Show popup onKeyup with mentionChar changed dynamically', () => {
        let mentionObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ mention mentionChar changed dynamically', () => {
            mentionObj.mentionChar = '#';
            mentionObj.dataBind();
            mentionObj.element.value = '#';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                code: 'Digit3',
                keyCode: 51,
                key: '#'
            };
            mentionObj.onKeyUp(keyEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
        });
    });

    describe('Show popup onKeyup with allowSpaces changed dynamically', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ mention allowSpaces changed dynamically', (done) => {
            mentionObj.allowSpaces = true;
            mentionObj.dataBind();
            mentionObj.element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'enter',
                keyCode: 13,
                key: 'Enter'
            };
            mentionObj.onKeyUp(keyMentionEventArgs);
            setTimeout(() => {
                mentionObj.keyActionHandler(keyDownEventArgs);
                mentionObj.keyActionHandler(keyEventArgs);
                expect(mentionObj.element.value).toBe('HTML');
                done();
            }, 450);
        });
    });

    describe('Show popup onKeyup with suffixText changed dynamically', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ mention suffixText changed dynamically', (done) => {
            mentionObj.suffixText = ' ';
            mentionObj.dataBind();
            mentionObj.element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'enter',
                keyCode: 13,
                key: 'Enter'
            };
            mentionObj.onKeyUp(keyMentionEventArgs);
            setTimeout(() => {
                mentionObj.keyActionHandler(keyDownEventArgs);
                mentionObj.keyActionHandler(keyEventArgs);
                expect(mentionObj.element.value.indexOf(' ') !== -1).toBe(true);
                mentionObj.minLength = 7;
                mentionObj.dataBind();
                expect(mentionObj.minLength).toBe(7);
                done();
            }, 450);
        });
    });

    describe('Show popup set and remove mouse hover', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('for the LI element using mouse and methods', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.setHover(mentionObj.list.childNodes[0].childNodes[0]);
            expect(mentionObj.list.childNodes[0].childNodes[0].classList.contains('e-hover')).toBe(true);
            mentionObj.removeHover();
            expect(mentionObj.list.childNodes[0].childNodes[0].classList.contains('e-hover')).toBe(false);
            let li: Element[] = mentionObj.popupObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            mentionObj.onMouseOver(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });
    });

    describe('Display template testing', () => {
        let mentionObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: empList, mentionChar: '@', debounceDelay: 0, displayTemplate: '${text}' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('for the input mode', (done) => {
            element.value = '@';
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'enter',
                keyCode: 13,
                key: 'Enter'
            };
            mentionObj.onKeyUp(keyMentionEventArgs);
            setTimeout(() => {
                mentionObj.keyActionHandler(keyEventArgs);
                expect(mentionObj.element.value).toBe('Mona Sak');
                done();
            }, 450);
        });
    });

    describe('Grouping in MentionList', () => {
        let mentions: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            mentions.destroy();
            element.remove();
        });

        it('Render the Meniton list with grouping and sortOrder:None', (done) => {
            let groupData = [
                { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
                { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
                { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
                { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
                { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
            ];
            mentions = new Mention({
                dataSource: groupData,
                debounceDelay: 0,
                mentionChar: '@',
                fields: { groupBy: 'category', text: 'vegetable' }
            });
            mentions.appendTo(element);
            mentions.initValue();
            mentions.opened = function(args: any){
                let groupElemenet: HTMLElement = mentions.list.querySelector(".e-list-group-item");
                let groupText: string = groupElemenet.innerText;
                expect(groupText).toEqual('Leafy and Salad');
                mentions.opened = null;
                mentions.hidePopup();
                mentions.destroy();
                done();
            };
            mentions.initValue();
            mentions.showPopup();
        });
        it('Render the Metion list with grouping and sortOrder:Ascending', (done) => {
            let groupData = [
                { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
                { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
                { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
                { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
                { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
            ];
            mentions = new Mention({
                dataSource: groupData,
                debounceDelay: 0,
                fields: { groupBy: 'category', text: 'vegetable' },
                mentionChar: '@',
                sortOrder: 'Ascending'
            });
            mentions.appendTo(element);
            mentions.initValue();
            mentions.opened = function(args: any){
                let groupElemenet: HTMLElement = mentions.list.querySelector(".e-list-group-item");
                let groupText: string = groupElemenet.innerText;
                expect(groupText).toEqual('Beans');
                mentions.opened = null;
                mentions.hidePopup();
                mentions.destroy();
                done();
            };
            mentions.initValue();
            mentions.showPopup();
        });
    });

    describe('GetItems Checking', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let mention1: Mention;
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'inputMention1' });
            document.body.appendChild(element);
            element1 = <HTMLInputElement>createElement('input', { id: 'inputMention2' });
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            let mention2: any = new Mention({
                dataSource: data,
                debounceDelay: 0
            });
            mention2.appendTo(element);
            mention2.initValue();
            expect(mention2.getItems().length).toBe(2);
        });
    });

    describe('filtering', () => {
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let mentionObj: any;
        let element: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            code: 'KeyO',
            keyCode: 79,
            key: 'p'
        };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'inputMention' });
            document.body.appendChild(element);
            mentionObj = new Mention({
                dataSource: datasource2,
                fields: { text: "text", value: "id" },
                popupHeight: "200px",
                debounceDelay: 0,
                filterType: 'Contains',
                highlight: true,
                showMentionChar: true
            });
            mentionObj.appendTo(element);
            mentionObj.initValue();
            mentionObj.showPopup();
        });

        it('using filter method', (done) => {
            setTimeout(() => {
                element.value = element.value + "p";
                mentionObj.queryString = 'p';
                mentionObj.searchLists(keyEventArgs);
                mentionObj.keyActionHandler(keyEvent);
                mouseEventArgs.target = mentionObj.list;
                mentionObj.onMouseClick(mouseEventArgs);
                mentionObj.hidePopup();
                setTimeout(() => {
                    expect(mentionObj.element.value === '@PERL').toBe(true);
                    done();
                }, 250)
            }, 500)
        });
    });

    describe('Highlight Testing', () => {
        let mentionObj: any;
        let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'Mention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({
                dataSource: languageData,
                debounceDelay: 0,
                fields: { value: 'text' },
                highlight: true
            });
            mentionObj.appendTo(element);
        });
        afterAll(() => {
            mentionObj.destroy();
            element.remove();
        });
        it('highlight by StartsWith', (done) => {
            mentionObj.filterType = 'StartsWith';
            mentionObj.dataBind()
            e.keyCode = 76;
            mentionObj.inputElement.value = '@p';
            mentionObj.onKeyUp(e);
            setTimeout(() => {
                let highlight: HTMLElement[] = mentionObj.liCollections[0].querySelectorAll('.e-highlight');
                expect(highlight.length === 1).toBe(true);
                done();
            }, 450);
        });
        it('highlight by EndsWith', (done) => {
            mentionObj.hidePopup();
            setTimeout(() => {
                mentionObj.filterType = 'EndsWith';
                mentionObj.dataBind();
                e.keyCode = 76;
                mentionObj.inputElement.value = '@p';
                mentionObj.onKeyUp(e);
                setTimeout(() => {
                    let highlight: HTMLElement[] = mentionObj.liCollections[0].querySelectorAll('.e-highlight');
                    expect(highlight.length === 1).toBe(true);
                    mentionObj.filterType = 'Contains';
                    mentionObj.dataBind()
                    done();
                }, 450);
            }, 450)
        });
        it('fill second item text in input', function () {
            e.type = 'keydown';
            e.action = 'down';
            mentionObj.keyActionHandler(e);
            expect(mentionObj.inputElement.value === 'PHP').toBe(true);
            e.type = null;
        });
        it('check highlight value in popup list', () => {
            e.keyCode = 76;
            mentionObj.inputElement.value = '@p';
            let highlight: HTMLElement = mentionObj.list.querySelector('.e-highlight');
            expect(highlight.textContent === 'P').toBe(true);
        });

        it('not fill when delete or backspace key press', () => {
            mentionObj.inputElement.value = 'PER';
            e.keyCode = 8;
            mentionObj.onKeyUp(e);
            expect(mentionObj.inputElement.value === 'PER').toBe(true);
        });
        it('select fill value when press enter key', (done) => {
            e.type = 'keydown';
            e.action = 'down';
            mentionObj.keyActionHandler(e);
            e.action = 'enter';
            mentionObj.keyActionHandler(e);
            setTimeout(() => {
                expect(mentionObj.inputElement.value === 'PHP').toBe(true);
                done();
            }, 450)
        });
    });

    describe('Show popup onKeyUp and inserting texts in div', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p><br></p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@', showMentionChar: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.innerHTML = '@';
            let range:Range = document.createRange();
            range.setStart(mentionObj.element.firstChild, 1);
            range.setEnd(mentionObj.element.firstChild, 1);
            let selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<span contenteditable="false" class="e-mention-chip">@PERL</span>​');
        });
    });

    describe('Dynamically enable the showMentionChar ', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let changeAction: EmitType<Object> = jasmine.createSpy('Change');
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, change: changeAction, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with # as value and inserting using mentioned char', () => {
            mentionObj.showMentionChar = true;
            mentionObj.dataBind();
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
        });
        it('insert the list item using mouseclick and check change event being triggered', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            (<any>mentionObj).mentionChar = '#';
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<p>@<span contenteditable="false" class="e-mention-chip">#PERL</span>​</p>');
            expect(changeAction).toHaveBeenCalled();
        });
    });

    describe('Dynamically enable the suffixtext ', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0 });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('ShowPopup and inserting the text with suffix text configured', () => {
            mentionObj.suffixText = '&nbsp;';
            mentionObj.dataBind();
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<p><span contenteditable="false" class="e-mention-chip">PERL</span>&nbsp;</p>');
        });
    });

    describe('Dynamically disable the showMentionChar ', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let changeAction: EmitType<Object> = jasmine.createSpy('Change');
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, change: changeAction, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with # as value and inserting using mentioned char', () => {
            mentionObj.showMentionChar = false;
            mentionObj.dataBind();
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
        });
        it('insert the list item using mouseclick and check change event being triggered', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<p><span contenteditable="false" class="e-mention-chip">PERL</span>​</p>');
            expect(changeAction).toHaveBeenCalled();
        });
    });

    describe('Show popup onKeyUp and check popup width', function () {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(function () {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, popupWidth: '50%', mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(function () {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('ShowPopup with @ as value', function (done) {
            mentionObj.inputElement.firstChild.firstChild;
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.showPopup();
            expect(mentionObj.popupObj.width).toBe(mentionObj.popupObj.width);
            done();
        });
    });

    describe('Show popup onKeyUp and check popup width', function () {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(function () {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, popupHeight: 'auto', mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(function () {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('ShowPopup with @ as value', function (done) {
            mentionObj.inputElement.firstChild.firstChild;
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.showPopup();
            expect(mentionObj.popupObj.height).toBe('auto');
            done();
        });
    });

    describe('RemoteData loading', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let mention: any;
        let remoteData: DataManager = new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'inputMention' });
            document.body.appendChild(element);
            mention = new Mention({
                mentionChar: '@',
                dataSource: remoteData,
                debounceDelay: 0,
                query: new Query().from('Customers').select('ContactName').take(7),
                fields: { text: 'ContactName' }
            });
            mention.appendTo(element);
            mention.initValue();
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('check spinner show and hidden', (done) => {
            element.value = '@';
            mention.onKeyUp(keyMentionEventArgs);
            setTimeout(() => {
                mention.keyActionHandler(keyDownEventArgs);
                expect(document.querySelectorAll('.e-spinner-inner').length > 0).toBe(true);
                done();
            }, 450);
        });
    });

    describe('RemoteData loading', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let mention: any;
        let remoteData: DataManager = new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'inputMention' });
            document.body.appendChild(element);
            mention = new Mention({
                mentionChar: '@',
                dataSource: remoteData,
                debounceDelay: 0,
                query: new Query().from('Customers').select('ContactName').take(7),
                fields: { text: 'ContactName' },
                spinnerTemplate: '<div class="loader"></div>'
            });
            mention.appendTo(element);
            mention.initValue();
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('spinnerElement with spinner Template visible and hidden', (done) => {
            element.value = '@';
            mention.onKeyUp(keyMentionEventArgs);
            mention.keyActionHandler(keyDownEventArgs);
            expect(document.querySelectorAll('.loader').length > 0).toBe(true);
            mention.hideWaitingSpinner();
            expect(document.querySelectorAll('.loader').length === 0).toBe(true);
            done();
        });
    });

    describe('Show popup onKeyup and inserting texts with target property set for div', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        divElement.contentEditable = 'true';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#divMention', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
            expect((document.querySelector('.e-mention.e-popup') as any).querySelector('li').classList.contains('e-active')).toBe(true);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(document.querySelector('.e-mention-chip')).not.toBe(null);
        });
    });

    describe('Show popup onKeyup and inserting texts with target property set for input', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            
            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#inputMention', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.inputElement.value).toBe('PERL');
        });
    });

    describe('Show popup onKeyup and inserting texts with target property set for textarea', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'textareaMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            
            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#textareaMention', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.inputElement.value).toBe('PERL');
        });
    });

    describe('Checking contenteditable and class added for target element', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#divMention', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Check attribute and class added for the element', () => {
            expect(element.hasAttribute('contenteditable')).toBe(true);
            expect(element.classList.contains('e-editable-element')).toBe(false);
        });
    });

    describe('Checking contenteditable and class added for non target element', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@' });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Check attribute and class added for the element', () => {
            expect(element.hasAttribute('contenteditable')).toBe(true);
            expect(element.classList.contains('e-editable-element')).toBe(true);
        });
    });

    describe('Checking different dataSource binding', () => {
        let mentionObj: any;
        const empList: { [key: string]: Object }[] = [
            { id: 1, country: 'American Football' }, { id: 2, country: 'Badminton' },
            { id: 2, country: 'Basketball' },
            { id: 3, country: 'Football' },
            { id: 4, country: 'Hockey' },
            { id: 5, country: 'Snooker' },
        ];
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        beforeAll(() => {
            element.innerHTML ="<p>@a</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: empList, debounceDelay: 0, fields: { text: 'country', value: 'id' } });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Check if popup open or not for text as word', () => {
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup li').length > 0).toBe(true);
        });
    });

    describe('Checking different dataSource binding', () => {
        let mentionObj: any;
        const empList: { [key: string]: Object }[] = [
            { id: 1, country: 'American Football' }, { id: 2, country: 'Badminton' },
            { id: 2, country: 'Basketball' },
            { id: 3, country: 'Football' },
            { id: 4, country: 'Hockey' },
            { id: 5, country: 'Snooker' },
        ];
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        beforeAll(() => {
            element.innerHTML ="<p>@a</p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: empList, debounceDelay: 0, fields: { text: 'id', value: 'country' } });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Check if popup open or not for text as ID', () => {
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup li').length > 0).toBe(true);
        });
    });

    describe('Initial space to close the popup', () => {
        let mentionObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: '@', allowSpaces: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('with allowSpace enabled', () => {
            element.value = '@ ';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length === 0).toBe(true);
        });
    });

    describe('Locale testing for norecordstemplate', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: [], locale: 'fr-BE', debounceDelay: 0, showMentionChar: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('ShowPopup with norecordstemplate locale value', (done) => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect((document.querySelector('.e-nodata') as HTMLElement).innerText).toEqual('Aucun enregistrement trouvé');
            done();
        });
    });

    describe('Locale testing for norecordstemplate', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: [], locale: 'es', debounceDelay: 0, showMentionChar: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('ShowPopup with norecordstemplate using setCulture', (done) => {
            setCulture('es');
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect((document.querySelector('.e-nodata') as HTMLElement).innerText).toEqual('Pas de');
            done();
        });
    });

    describe('Accessibility testing', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, showMentionChar: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Attributes checking for the mention and the popup elements', (done) => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect((mentionObj.popupObj.element.querySelector('ul') as HTMLElement).hasAttribute('id')).toBe(true);
            expect((mentionObj.popupObj.element.querySelector('ul') as HTMLElement).hasAttribute('role')).toBe(true);
            expect((mentionObj.inputElement as HTMLElement).hasAttribute('aria-owns')).toBe(true);
            expect((mentionObj.inputElement as HTMLElement).hasAttribute('aria-activedescendant')).toBe(true);
            done();
        });
    });
    
    describe('Show popup with CSS and target property set for div', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        divElement.contentEditable = 'true';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p>@</p>";
            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#divMention', cssClass: 'sample', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            setCursorPoint(mentionObj.inputElement.firstChild.firstChild, 1);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
            expect(mentionObj.popupObj.element.classList.contains('sample')).toEqual(true);
        });
    });

    describe('868160 - Check the Keyboard event', () => {
        let mentionObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        beforeAll(() => {

            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#inputMention', cssClass: 'sample', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            let keyEventArgs: any = {
                preventDefault: function () { },
                keyCode: 13,
                altKey: false,
                shiftKey: false
            };
            mentionObj.keyDownHandler(keyEventArgs);
            expect(keyEventArgs.action).toEqual('enter');
            expect(mentionObj.isRTE).toBe(false);
            expect(mentionObj.keyEventName).toEqual('mousedown');
            keyEventArgs.altKey = true;
            keyEventArgs.keyCode = 40;
            mentionObj.keyDownHandler(keyEventArgs);
            expect(keyEventArgs.action).toEqual('open');
            keyEventArgs.altKey = false;
            keyEventArgs.keyCode = 9;
            mentionObj.keyDownHandler(keyEventArgs);
            expect(keyEventArgs.action).toEqual('tab');
            keyEventArgs.shiftKey = true;
            keyEventArgs.keyCode = 9;
            mentionObj.keyDownHandler(keyEventArgs);
            expect(keyEventArgs.action).toEqual('close');
        });
    });

    describe('Show popup with CSS and target property set for input', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {

            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#inputMention', cssClass: 'sample', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
            expect(mentionObj.popupObj.element.classList.contains('sample')).toEqual(true);
        });
    });

    describe('Show popup with CSS and target property set for textarea', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'textareaMention' });
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {

            document.body.appendChild(element);
            document.body.appendChild(divElement);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, target: '#textareaMention', cssClass: 'sample', mentionChar: '@' });
            mentionObj.appendTo(divElement);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with @ as value', () => {
            element.value = '@';
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelector('.e-mention.e-popup')).not.toBe(null);
            expect(mentionObj.popupObj.element.classList.contains('sample')).toEqual(true);
        });
    });

    describe('Disable items', () => {       
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mention' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 

        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new Mention({
                dataSource: sportsData,
                debounceDelay: 0,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('checked with disableItem method', (done) => {      
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem("Game4");
                expect(listObj.liCollections[3].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[3].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[3].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.liCollections[6].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[6].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[6].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem({ "State": true, "Game": "Hockey", "Id" : 'Game7' });
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem(0);
                expect(listObj.liCollections[0].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[0].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[0].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(7);
                listObj.disableItem("Game8");
                expect(listObj.liCollections[7].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[7].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[7].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(6);
                listObj.disableItem({ "State": false, "Game": "Tennis", "Id": 'Game10' });
                expect(listObj.liCollections[9].classList.contains('e-disabled')).toBe(true);
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem(0);
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem("Game8");
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem({ "State": false, "Game": "Tennis", "Id": 'Game10' });
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem(listObj.liCollections[8]);
                expect(listObj.liCollections[8].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[8].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[8].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(4);
                done();
            }, 450);
        });
    });

    describe('keyboard interaction with disabled items', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', code: 'ArrowDown', keyCode: 40, key: 'ArrowDown' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mention' });
        let listObj: any;
        const empList: { [key: string]: Object }[] = [ 
            { id: 'level1', country: 'American Football', State: true }, 
            { id: 'level2', country: 'Badminton', State: false },
            { id: 'level3', country: 'Basketball', State: true },
            { id: 'level4', country: 'Cricket', State: true },
            { id: 'level5', country: 'Football', State: false },
            { id: 'level6', country: 'Golf', State: true }       
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('up and down action', (done) => {
            element.value = '@';
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Badminton").toBe(true);
                listObj.onKeyUp(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Football").toBe(true);
                listObj.onKeyUp(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Badminton").toBe(true);
                listObj.onKeyUp(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Football").toBe(true);
                listObj.onKeyUp(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Badminton").toBe(true);
                done();
            }, 450);
        });
    });

    describe('keyboard interaction in disabled items', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'up', code: 'ArrowUp' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mention' });
        let listObj: any;
        let emplist: { [key: string]: Object }[] = [ 
            { id: 'level1', country: 'American Football', State: true }, 
            { id: 'level2', country: 'Badminton', State: false },
            { id: 'level3', country: 'Basketball', State: true },
            { id: 'level4', country: 'Cricket', State: true },
            { id: 'level5', country: 'Football', State: false },
            { id: 'level6', country: 'Golf', State: true }       
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('with all disabled items', (done) => {
            element.value = '@';
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'up';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'up';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                done();
            }, 450);
        });
    });
    describe('Null or undefined value testing', () => {
        let listObj: Mention;
        beforeEach(() => {
            listObj = undefined;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'list' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
        it('cssClass', () => {
            listObj = new Mention({ 
                dataSource: datasource2,
                debounceDelay: 0,
                fields: { value: "id", text: "text" },
                cssClass: null
            }, '#list');
            expect(listObj.cssClass).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                cssClass: undefined
            }, '#list');
            expect(listObj.cssClass).toBe(null);
            listObj.destroy();
        });
        it('highlight', () => {
            listObj = new Mention({  
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                highlight: null
            }, '#list');
            expect(listObj.highlight).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                highlight: undefined
            }, '#list');
            expect(listObj.highlight).toBe(false);
            listObj.destroy();
        });
        it('ignoreCase', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                ignoreCase: null
            }, '#list');
            expect(listObj.ignoreCase).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                ignoreCase: undefined
            }, '#list');
            expect(listObj.ignoreCase).toBe(true);
            listObj.destroy();
        });
        it('displayTemplate', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                displayTemplate: null
            }, '#list');
            expect(listObj.displayTemplate).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                displayTemplate: undefined
            }, '#list');
            expect(listObj.displayTemplate).toBe(null);
            listObj.destroy();
        });
        it('itemTemplate', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                itemTemplate: null
            }, '#list');
            expect(listObj.itemTemplate).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                itemTemplate: undefined
            }, '#list');
            expect(listObj.itemTemplate).toBe(null);
            listObj.destroy();
        });
        it('noRecordsTemplate', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                noRecordsTemplate: null
            }, '#list');
            expect(listObj.noRecordsTemplate).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                noRecordsTemplate: undefined
            }, '#list');
            expect(listObj.noRecordsTemplate).toBe('No records found');
            listObj.destroy();
        });
        it('mentionChar', () => {
            listObj = new Mention({  
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                mentionChar: null
            }, '#list');
            expect(listObj.mentionChar).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                mentionChar: undefined
            }, '#list');
            expect(listObj.mentionChar).toBe('@');
            listObj.destroy();
        });
        it('minLength', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                minLength: null
            }, '#list');
            expect(listObj.minLength).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                minLength: undefined
            }, '#list');
            expect(listObj.minLength).toBe(0);
            listObj.destroy();
        });
        it('popupHeight', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                popupHeight: null
            }, '#list');
            expect(listObj.popupHeight).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                popupHeight: undefined
            }, '#list');
            expect(listObj.popupHeight).toBe('300px');
            listObj.destroy();
        });
        it('popupWidth', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                popupWidth: null
            }, '#list');
            expect(listObj.popupWidth).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2,
                fields: { value: "id", text: "text" }, debounceDelay: 0,
                popupWidth: undefined
            }, '#list');
            expect(listObj.popupWidth).toBe('auto');
            listObj.destroy();
        });
        it('showMentionChar', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                showMentionChar: null
            }, '#list');
            expect(listObj.showMentionChar).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                showMentionChar: undefined
            }, '#list');
            expect(listObj.showMentionChar).toBe(false);
            listObj.destroy();
        });
        it('spinnerTemplate', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                spinnerTemplate: null
            }, '#list');
            expect(listObj.spinnerTemplate).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                spinnerTemplate: undefined
            }, '#list');
            expect(listObj.spinnerTemplate).toBe(null);
            listObj.destroy();
        });
        it('suffixText', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                suffixText: null
            }, '#list');
            expect(listObj.suffixText).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                suffixText: undefined
            }, '#list');
            expect(listObj.suffixText).toBe(null);
            listObj.destroy();
        });
        it('suggestionCount', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                suggestionCount: null
            }, '#list');
            expect(listObj.suggestionCount).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                suggestionCount: undefined
            }, '#list');
            expect(listObj.suggestionCount).toBe(25);
            listObj.destroy();
        });
        it('target', () => {
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                target: null
            }, '#list');
            expect(listObj.target).toBe(null);
            listObj.destroy();
            listObj = new Mention({ 
                dataSource: datasource2, debounceDelay: 0,
                fields: { value: "id", text: "text" },
                target: undefined
            }, '#list');
            expect(listObj.target).toBe(undefined);
            listObj.destroy();
        });
    });

    describe('Coverage improvements for mention component ', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'up', code: 'ArrowUp' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mention' });
        let listObj: any;
        let originalTimeout: number;
        let emplist: { [key: string]: Object }[] = [ 
            { id: 'level1', country: 'American Football', State: true }, 
            { id: 'level2', country: 'Badminton', State: false },
            { id: 'level3', country: 'Basketball', State: true },
            { id: 'level4', country: 'Cricket', State: true },
            { id: 'level5', country: 'Football', State: false },
            { id: 'level6', country: 'Golf', State: true }       
        ]; 
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            document.body.appendChild(element);
           
        });
        afterAll((done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('- checkAndUpdateInternalComponent', () => {
            const divElement = document.createElement('div');
            divElement.classList.add('e-rte-content');
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            divElement.appendChild(textAreaelement);
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).isVue = false;
            textAreaelement.classList.add('e-richtexteditor');
            (<any>listObj).checkAndUpdateInternalComponent(textAreaelement);
            (<any>listObj).isVue = true;
            textAreaelement.classList.add('e-rte-hidden');
            divElement.classList.add('e-richtexteditor');
            (<any>listObj).checkAndUpdateInternalComponent(textAreaelement);
            (<any>listObj).isVue = false;
            textAreaelement.classList.remove('e-richtexteditor');
            divElement.classList.add('e-content');
            (<any>listObj).checkAndUpdateInternalComponent(textAreaelement);
            (<any>listObj).highlight = true;
            (<any>listObj).fields.itemCreated = empList[0];
            (<any>listObj).listOption(empList, listObj.fields);
            (<any>listObj).suggestionCount = 24;
            (<any>listObj).getQuery(new Query());
        });
        it('- keydownhandler', () => {
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
            });
            listObj.appendTo(element);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'up', code: 'ArrowUp', keyCode: 40, key: 'ArrowUp' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'up', code: 'ArrowUp', keyCode: 38, key: 'ArrowUp',altKey:true };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'up', code: 'ArrowUp', keyCode: 38, key: 'ArrowUp',altKey:false };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'down', code: 'ArrowDown', keyCode: 40, key: 'ArrowDown' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'pageUp', code: 'PageUp', keyCode: 33, key: 'PageUp' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'home', code: 'Home', keyCode: 36, key: 'Home' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'end', code: 'End', keyCode: 35, key: 'End' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'space', code: 'Space', keyCode: 32, key: ' ' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'pageDown', code: 'PageDown', keyCode: 34, key: 'PageDown' };
            (<any>listObj).keyDownHandler(keyEventArgs);
            listObj.showPopup();
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'escape', code: 'escape', keyCode: 13, key: 'escape' };
            (<any>listObj).keyDownHandler(keyEventArgs);
        });
        it('- renderhighlightSearch', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).showPopup();
            (<any>listObj).ulElement.querySelector('li').classList.add('e-active');
            (<any>listObj).renderHightSearch();
            (<any>listObj).highlight = false;
            (<any>listObj).renderHightSearch();
            (<any>listObj).highlight = true;
            (<any>listObj).listOption(listObj.dataSource,listObj.fields);
            (<any>listObj).listOption(listObj.dataSource,listObj.fields);

        });
        it('- onDocumentClick ', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            listObj.showPopup();
            //(<any>listObj).popupObj = null;
            let mouseEventArgs: any = { preventDefault: function () { }, target: document.body };
            (<any>listObj).onDocumentClick(mouseEventArgs);
        });
        it('- PropertyChanges ', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).popupObj = null;
            (<any>listObj).updateCssClass(null,null);
            (<any>listObj).setCssClass(null,null,null);
            (<any>listObj).showWaitingSpinner();
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'pageDown', code: 'PageDown', keyCode: 229, key: 'PageDown' };
            (<any>listObj).isPopupOpen = true;
            (<any>listObj).isUpDownKey = true;
            (<any>listObj).onKeyUp(keyEventArgs)
        });
        it('- PropertyChanges ', () => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).unBindCommonEvent();
            Browser.userAgent = navigator.userAgent;
            
        });
        it('- onmouseclick', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).showPopup();
            (<any>listObj).isRTE = true;
            let mouseEventArgs: any = { preventDefault: function () { }, target: (<any>listObj).popupObj.element.querySelector('li') };
            (<any>listObj).isSelectCancel = true;
            (<any>listObj).onMouseClick(mouseEventArgs);
        });
        it('- setscrollposition', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).showPopup();
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, action: 'pageDown', code: 'PageDown', keyCode: 34, key: 'PageDown' };
            (<any>listObj).setScrollPosition(keyEventArgs);
            (<any>listObj).setScrollPosition(null);
            (<any>listObj).selectedLI = null;
            (<any>listObj).scrollTop();
            (<any>listObj).list = null;
            (<any>listObj).removeHover();
            let liElement: HTMLElement = document.createElement('li');
            liElement.className = 'e-list-item e-hover';
            (<any>listObj).setHover(liElement);
        });
        it('- updateUpDownAction', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
                highlight: true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).fields.isDisabled = 'State';
            // Create ul element with required class
            const ulElement = document.createElement('ul');
            ulElement.classList.add('e-list');
            const liElement1 = document.createElement('li');
            liElement1.classList.add('e-list-item', 'e-disabled');
            liElement1.textContent = 'Item 1 (Disabled)';
            const liElement2 = document.createElement('li');
            liElement2.classList.add('e-list-item','e-disabled');
            liElement2.textContent = 'Item 2';
            const liElement3 = document.createElement('li');
            liElement3.classList.add('e-list-item', 'e-disabled');
            liElement3.textContent = 'Item 3 (Disabled)';
            ulElement.appendChild(liElement1);
            ulElement.appendChild(liElement2);
            ulElement.appendChild(liElement3);
            (<any>listObj).list = ulElement;
            (<any>listObj).updateUpDownAction();
        });
        it('- searchlist', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea'});
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
                filtering(event: any) {
                    event.preventDefaultAction = true;
                    event.cancel = true;
                    let query = new Query();
                    event.updateData(empList, query);
                }
            });
            listObj.appendTo(textAreaelement);
            textAreaelement.value = 'text';
            textAreaelement.focus();
            (<any>listObj).showPopup();
            keyEventArgs = { preventDefault: (): void => { /** NO Code */ }, type:'keyboard', action: 'up', code: 'ArrowUp', keyCode: 40, key: 'ArrowUp' };
            (<any>listObj).searchLists(keyEventArgs);
        });
        it('- filteringaction', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea'});
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                filtering(event: any) {
                    event.preventDefaultAction = true;
                    event.cancel = true;
                    let query = new Query();
                    event.updateData(empList, query);
                },
                minLength: 5
            });
            listObj.appendTo(textAreaelement);
            textAreaelement.value = 'text';
            textAreaelement.focus();
            (<any>listObj).showPopup();
            (<any>listObj).queryString = 'text';
            (<any>listObj).filterAction(empList)
        });
        it('- getQuery', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea' });
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country', disabled: 'State' },
                highlight:true
            });
            listObj.appendTo(textAreaelement);
            (<any>listObj).showPopup();
            (<any>listObj).isFiltered = true;
            (<any>listObj).getQuery(new Query());
            (<any>listObj).isFiltered = false;
            listObj.suggestionCount = 36;
            (<any>listObj).getQuery(new Query());
        });
        it('- actioncomplete with isactive as true', () => {
            let textAreaelement: HTMLInputElement = <HTMLInputElement>createElement('textarea', { id: 'mentiontextarea'});
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                fields: { text: 'country' },
                debounceDelay: 0,
                filtering(event: any) {
                    event.preventDefaultAction = true;
                    event.cancel = true;
                    let query = new Query();
                    event.updateData(empList, query);
                },
                minLength: 5
            });
            listObj.appendTo(textAreaelement);
            textAreaelement.value = 'text';
            textAreaelement.focus();
            (<any>listObj).showPopup();
            (<any>listObj).onActionComplete((<any>listObj).ulElement,(<any>listObj).list,keyEventArgs,true);
        });
        it('- renderHightSearch  without active ul element', (done) => {
            listObj.showPopup();
            listObj.highlight = true;
            setTimeout(function () {
                expect(listObj.isPopupOpen).toEqual(true);
                expect(listObj.element.classList.contains('e-mention')).toEqual(true);
                var activeElement = (<any>listObj).ulElement.querySelector('.e-active');
                if (activeElement) {
                    activeElement.classList.remove('e-active');
                }
                (<any>listObj).renderHightSearch();
                done();
            }, 450);
        });
        it('- Closepopup prevention', (done) => {
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country'},
                closed(event: any) {
                    event.cancel = true;
                },
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(function () {
                expect(listObj.isPopupOpen).toEqual(true);
                expect(listObj.element.classList.contains('e-mention')).toEqual(true);
                let mouseeventargs = { preventDefault: function () { }, target: document.body };
                (<any>listObj).closePopup(100,mouseeventargs);
                done();
            }, 450);
        });
        it('- beforeOpen prevention', () => {
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country'},
                beforeOpen(event: any) {
                    event.cancel = true;
                },
            });
            listObj.appendTo(element);
            listObj.showPopup();
        });
        it('- keyActionHandler with escape key', (done) => {
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country'},
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(function () {
                (<any>listObj).isPopupOpen = true;
                let keyEventArgs: any = {
                    preventDefault: (): void => { /** NO Code */ },
                    action: 'escape',
                    keyCode: 27,
                    key: 'Escape'
                };
                listObj.onKeyUp(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                done();
            }, 450);
        });
        it('- before open event prevention', () => {
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country'},
                beforeOpen(event: any) {
                    event.cancel = true;
                },
            });
            listObj.appendTo(element);
            listObj.showPopup();
        });
        it('with all disabled items 1', (done) => {
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country'},
                highlight: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                listObj.list.querySelectorAll('.e-list-item')[0].classList.add('e-item-focus');
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                (<any>listObj).updateValues();
                done();
            }, 450);
        });
        it('- getTextRange', () => {
            (<any>listObj).range = null;
            (<any>listObj).getTextRange();
        });
        it('with all disabled items 2', () => {
            listObj = new Mention({
                mentionChar: '@',
                dataSource: empList,
                debounceDelay: 0,
                fields: { text: 'country'},
                highlight: true,
                displayTemplate: '<div>selected</div>',
                spinnerTemplate: '<div>spinner</div>'
            });
            listObj.appendTo(element);
            (<any>listObj).isReact = true;
            let liElement: HTMLElement = document.createElement('li');
            liElement.className = 'e-list-item e-hover';
            (<any>listObj).item = liElement;
            (<any>listObj).inputElement.value = 'Build Status: INPROGRESS';
            (<any>listObj).setDisplayTemplate(keyDownEventArgs);
            listObj.showPopup();
            (<any>listObj).setSpinnerTemplate(keyDownEventArgs);
            (<any>listObj).isReact = false;
            let mouseEvent = { preventDefault: function () { }, target: document.body };
            (<any>listObj).onMouseLeave();
            (<any>listObj).isReact = false;
        });
    });

    describe('Showpopup with mention character as "a"', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element.innerHTML ="<p><br></p>";
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, debounceDelay: 0, mentionChar: 'a', showMentionChar: true, allowSpaces: true });
            mentionObj.appendTo(element);
            mentionObj.initValue();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('ShowPopup with "a" as value', () => {
            element.innerHTML = 'a';
            let range:Range = document.createRange();
            range.setStart(mentionObj.element.firstChild, 1);
            range.setEnd(mentionObj.element.firstChild, 1);
            let selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            mentionObj.onKeyUp(keyMentionEventArgs);
            expect(document.querySelectorAll('.e-mention.e-popup').length > 0).toBe(true);
        });
        it('insert the list item using mouseclick', () => {
            mouseEventArgs.target = mentionObj.list.childNodes[0].childNodes[2];
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<span contenteditable="false" class="e-mention-chip">aPERL</span>​');
            element.innerHTML = '<span contenteditable="false" class="e-mention-chip">aPERL</span>a';
            let textNode = mentionObj.element.childNodes[1]; // Get the text node containing 'a'
            let range: Range = document.createRange();
            range.setStart(textNode, 1); // Set cursor after 'a'
            range.setEnd(textNode, 1); // Set cursor after 'a'
            let selection: Selection = window.getSelection();
            mentionObj.showPopup();
            mentionObj.isPopupOpen = true;
            selection.removeAllRanges();
            selection.addRange(range);
            selection.removeAllRanges();
            selection.addRange(range);
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.showPopup();
            element.innerHTML = '<span contenteditable="false" class="e-mention-chip">aPERL</span>aa';
            textNode = mentionObj.element.childNodes[1]; // Get the text node containing 'aa'
            range = document.createRange();
            range.setStart(textNode, 2); // Set cursor after the last 'a'
            range.setEnd(textNode, 2); // Set cursor after the last 'a'
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range); // This line is enough to set the range, no need to repeat
            mentionObj.onKeyUp(keyMentionEventArgs);
            mentionObj.isPopupOpen = false;
        });
    });
    describe('coverage', function () {
        let keyEventArgs: any = { preventDefault: function () { }, action: 'up', code: 'ArrowUp' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('div', { id: 'divMention' });
        let listObj: any;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(function () {
            document.body.appendChild(element);
            listObj = new Mention({
                mentionChar: '@',
                debounceDelay: 0,
                dataSource: empList,
                fields: { text: 'country', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll(function (done) {
            listObj.hidePopup();
            setTimeout(function () {
                listObj.destroy();
                element.remove();
                done();
            }, 450);
        });
        it('with all disabled items', function (done) {
            var query = new Query();
            var fields =  { text: 'country', disabled: 'State' };
            element.value = '@';
            listObj.showPopup();
            (<any>listObj).searchLists(keyEventArgs);
            (<any>listObj).isPopupOpen = true;
            (<any>listObj).minLength = 1;
            (<any>listObj).filterAction(empList, query, fields);
            (<any>listObj).isReact = true;
            (<any>listObj).setValue(mouseEventArgs);
            done();
        });
        it('with all disabled items', function (done) {
            element.value = '@';
            listObj.showPopup();
            (<any>listObj).isReact = true;
            (<any>listObj).displayTemplate = "Template";
            (<any>listObj).setValue(mouseEventArgs);
            done();
        });
    });
  
    describe('EJ2-902235 Mention styles affect the Slash menu popup.', ()=>{
        let mention: Mention;
        let editor: HTMLDivElement;
        let slashMenuRoot: HTMLElement;
        beforeAll(()=>{
            mention = new Mention({ 
                dataSource: datasource2,
                fields: { value: "id", text: "text" },
                mentionChar: '/',
                debounceDelay: 0,
                target: '#defaultRTE_rte-edit-view',
                cssClass: 'e-slash-menu'
            });
            editor = mention.createElement('div', {id: 'defaultRTE_rte-edit-view' , attrs: { contenteditable: 'true' } });
            const editorWrapper = mention.createElement('div', { className: 'e-rte-content' });
            document.body.appendChild(editorWrapper);
            editorWrapper.appendChild(editor);
            const slashMenuRoot: HTMLElement = document.createElement('div');
            slashMenuRoot.id = 'slashMenu';
            document.body.appendChild(slashMenuRoot);
            mention.appendTo(slashMenuRoot);
        });
        afterAll((done: DoneFn)=>{
            mention.destroy();
            document.querySelector('.e-rte-content').remove();
            slashMenuRoot.remove();
            done();
        });
        it('Should have the input element id have slash menu', (done: DoneFn)=>{
            editor.innerHTML = '<p><br></p>';
            setCursorPoint((mention as any).inputElement.firstChild, 0);
            (mention as any).onKeyUp(keyMentionEventArgs);
            mention.showPopup();
            setTimeout(()=>{
                expect(((mention as any).popupObj.element as HTMLElement).id).toBe('defaultRTE_rte-edit-view_slash_menu_popup');
                expect(((mention as any).popupObj.element as HTMLElement).querySelector('ul').id).toBe('defaultRTE_rte-edit-view_slash_menu_options');
                done();
            }, 300);
        });
    });
});
