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
            mentionObj = new Mention({ dataSource: datasource2 });
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
            mentionObj = new Mention({ dataSource: datasource2 });
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
            mentionObj = new Mention({ dataSource: datasource2 });
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
            mentionObj = new Mention({ dataSource: data });
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
            mentionObj = new Mention({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
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
            mentionObj = new Mention({ dataSource: [] });
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
            mentionObj = new Mention({ dataSource: [] });
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
            mentionObj = new Mention({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
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
            mentionObj = new Mention({ dataSource: datasource2, cssClass: 'sample' });
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
            mentionObj = new Mention({ dataSource: datasource2, cssClass: 'sample highlight' });
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
            mentionObj = new Mention({ dataSource: datasource2, cssClass: 'test highlight' });
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
            mentionObj = new Mention({ dataSource: datasource2, cssClass: 'test highlight' });
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
            mentionObj = new Mention({ fields: { text: 'text', value: 'id' } });
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

    describe('Show popup onKeyup and inserting texts', () => {
        let mentionObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputMention' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@', showMentionChar: true });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: empList, mentionChar: '@', displayTemplate: '${text}' });
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
                dataSource: data
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@', showMentionChar: true });
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
            expect(mentionObj.element.innerHTML).toBe('<span contenteditable="false" class="e-mention-chip">@PERL</span>');
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
            mentionObj = new Mention({ dataSource: datasource2, change: changeAction, mentionChar: '@' });
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
            mentionObj.onMouseClick(mouseEventArgs);
            expect(mentionObj.element.innerHTML).toBe('<p><span contenteditable="false" class="e-mention-chip">@PERL</span></p>');
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
            mentionObj = new Mention({ dataSource: datasource2 });
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
            mentionObj = new Mention({ dataSource: datasource2, change: changeAction, mentionChar: '@' });
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
            expect(mentionObj.element.innerHTML).toBe('<p><span contenteditable="false" class="e-mention-chip">PERL</span></p>');
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
            mentionObj = new Mention({ dataSource: datasource2, popupWidth: '50%', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, popupHeight: 'auto', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#divMention', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#inputMention', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#textareaMention', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#divMention', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: empList, fields: { text: 'country', value: 'id' } });
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
            mentionObj = new Mention({ dataSource: empList, fields: { text: 'id', value: 'country' } });
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
            mentionObj = new Mention({ dataSource: datasource2, mentionChar: '@', allowSpaces: true });
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
            mentionObj = new Mention({ dataSource: [], locale: 'fr-BE', showMentionChar: true });
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
            mentionObj = new Mention({ dataSource: [], locale: 'es', showMentionChar: true });
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
            mentionObj = new Mention({ dataSource: datasource2, showMentionChar: true });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#divMention', cssClass: 'sample', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#inputMention', cssClass: 'sample', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#inputMention', cssClass: 'sample', mentionChar: '@' });
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
            mentionObj = new Mention({ dataSource: datasource2, target: '#textareaMention', cssClass: 'sample', mentionChar: '@' });
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
});
