import { Mention } from "@syncfusion/ej2-dropdowns";
import { RichTextEditor } from "../../src";
import { destroy, renderRTE, setCursorPoint } from "../rich-text-editor/render.spec";
import { ARROW_DOWN_EVENT_INIT, AT_CHARACTER_KEY_EVENT_INIT, ENTERKEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from "../constant.spec";

export const email: Object[] = [
    { "Name": "Selma Rose", "Eimg": "3", "EmailId": "selma@gmail.com" }, 
    { "Name": "Russo Kay", "Eimg": "8", "EmailId": "russo@gmail.com" },
    { "Name": "Camden Kate", "Eimg": "9", "EmailId": "camden@gmail.com" },
    { "Name": "Mary Kate", "Eimg": "4", "EmailId": "marry@gmail.com" }, 
    { "Name": "Ursula Ann", "Eimg": "2", "EmailId": "ursula@gmail.com" },
    { "Name": "Margaret", "Eimg": "5", "EmailId": "margaret@gmail.com" }, 
    { "Name": "Laura Grace", "Eimg": "6", "EmailId": "laura@gmail.com" },
    { "Name": "Robert", "Eimg": "8", "EmailId": "robert@gmail.com" }, 
    { "Name": "Albert", "Eimg": "9", "EmailId": "albert@gmail.com" },
    { "Name": "Michale", "Eimg": "10", "EmailId": "michale@gmail.com" }, 
    { "Name": "Andrew James", "Eimg": "7", "EmailId": "james@gmail.com" },
    { "Name": "Rosalie", "Eimg": "4", "EmailId": "rosalie@gmail.com" }, 
    { "Name": "Stella Ruth", "Eimg": "2", "EmailId": "stella@gmail.com" },
    { "Name": "Richard Rose", "Eimg": "10", "EmailId": "richard@gmail.com" }, 
    { "Name": "Gabrielle", "Eimg": "3", "EmailId": "gabrielle@gmail.com" },
    { "Name": "Thomas", "Eimg": "7", "EmailId": "thomas@gmail.com" }, 
    { "Name": "Charles Danny", "Eimg": "8", "EmailId": "charles@gmail.com" },
    { "Name": "Daniel", "Eimg": "10", "EmailId": "daniel@gmail.com" }, 
    { "Name": "Matthew", "Eimg": "7", "EmailId": "matthew@gmail.com" },
    { "Name": "Donald Krish", "Eimg": "9", "EmailId": "donald@gmail.com" },
    { "Name": "Yohana", "Eimg": "1", "EmailId": "yohana@gmail.com" },
    { "Name": "Kevin Paul", "Eimg": "10", "EmailId": "kevin@gmail.com" }
];

let mention: Mention;
function setupMention(editor: RichTextEditor, showCharacter: boolean ) {
    const divElement = document.createElement('div');
    divElement.id = 'mention';
    document.body.appendChild(divElement);
    mention = new Mention({
        mentionChar: '@',
        showMentionChar: showCharacter,
        target: editor.inputElement,
        dataSource: email as any,
        fields: { text: 'Name' },
    })
    mention.appendTo('#mention');
}

function destroyMention() {
    mention.destroy();
    const divElement = document.getElementById('mention');
    if (divElement) {
        divElement.remove();
    }
}

describe('Mention integration tests', () => {
    describe('Mouse action testing ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Should open the popup and insert the item on click.', (done:DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstChild.firstChild as Element, 1);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-mention.e-popup').classList.contains('e-popup-open')).toBe(true);
                (document.querySelector('.e-mention.e-popup li') as HTMLElement).click();
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML === '<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>​</p>').toBe(true);
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('Keyboard action Enter action testing ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Should open the popup and insert the item using enter key.', (done:DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstChild.firstChild as Element, 1);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-mention.e-popup').classList.contains('e-popup-open')).toBe(true);
                const enterKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
                document.activeElement.dispatchEvent(enterKeyDownEvent);
                const enterKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);
                document.activeElement.dispatchEvent(enterKeyUpEvent);
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML === '<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>​</p>').toBe(true);
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('Keyboard action Tab action testing ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Should open the popup and insert the item using enter key.', (done:DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstChild.firstChild as Element, 1);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-mention.e-popup').classList.contains('e-popup-open')).toBe(true);
                const enterKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(enterKeyDownEvent);
                const enterKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(enterKeyUpEvent);
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML === '<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>​</p>').toBe(true);
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('905363: User list popup not open when pressing Shift with @ key.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '<p><strong>​@</strong></p>',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Should open the popup properly when the @ character is pressed inside strong with zero width space.', (done:DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstChild.firstChild.firstChild as Element, 2);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-mention.e-popup').classList.contains('e-popup-open')).toBe(true);
                const tabKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(tabKeyDownEvent);
                const tabKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(tabKeyUpEvent);
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('.e-mention-chip').length > 0).toBe(true);
                    expect(editor.inputElement.querySelectorAll('strong').length > 0).toBe(true);
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('907712: When the Enable tab key setting is configured to true, the mention list popup will insert four spaces. ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '@',
                enableTabKey: true,
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Inserted item should not contain four spaces.', (done:DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstChild.firstChild as Element, 1);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-mention.e-popup').classList.contains('e-popup-open')).toBe(true);
                const tabKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(tabKeyDownEvent);
                const tabKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT);
                document.activeElement.dispatchEvent(tabKeyUpEvent);
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML === '<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>​</p>').toBe(true);
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('924354: Mention Inserted at Unexpected Location Within Table.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30 @</td> <td style="width: 15.5807%" class="">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table>',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Should not do the table navigation when arrow keys are pressed with Mention popup open.', (done:DoneFn) => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            const td: HTMLTableCellElement = table.querySelectorAll('tr')[1].cells[2];
            setCursorPoint(td.firstChild as Element, 4);
            const atKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyDownEvent);
            const atKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', AT_CHARACTER_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(atKeyUpEvent);
            setTimeout(() => {
                const range: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                const startContainer: Node = range.startContainer;
                const arrowDownKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT);
                document.activeElement.dispatchEvent(arrowDownKeyDownEvent);
                const arrowDownKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ARROW_DOWN_EVENT_INIT);
                document.activeElement.dispatchEvent(arrowDownKeyUpEvent);
                expect(range.startContainer).toBe(startContainer);
                setTimeout(() => {
                    const arrowDownKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT);
                    document.activeElement.dispatchEvent(arrowDownKeyDownEvent);
                    const arrowDownKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ARROW_DOWN_EVENT_INIT);
                    document.activeElement.dispatchEvent(arrowDownKeyUpEvent);
                    expect(range.startContainer).toBe(startContainer);
                    done();
                }, 200);
            }, 200);
        });
    });
    
    describe('972844: Cursor gets stuck when pressing Home and End keys after inserting a mention in RichTextEditor.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '<p><span contenteditable="false" class="e-mention-chip"><a href="mailto:james@gmail.com" title="james@gmail.com">@Andrew James</a></span>​</p>'
            });
            setupMention(editor, false);
        });
        afterAll(() => {
            destroyMention();
            destroy(editor);
        });
        it ('Rich Text Editor works properly when pressing the Home and End keys after inserting a mention.', (done:DoneFn) => {
            editor.focusIn();
            const elem: HTMLElement = editor.inputElement.querySelector('p');
            setCursorPoint(elem, 0);
            var HOME_EVENT_INIT = {
                "key": "Home",
                "keyCode": 36,
                "which": 36,
                "code": "Home",
                "location": 0,
                "altKey": false,
                "ctrlKey": false,
                "metaKey": false,
                "shiftKey": true,
                "repeat": false
            };
            const homeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', HOME_EVENT_INIT);
            editor.inputElement.dispatchEvent(homeKeyDownEvent);
            const homwKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', HOME_EVENT_INIT);
            editor.inputElement.dispatchEvent(homwKeyUpEvent);
            const range: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
            expect((range.startContainer as Element).innerHTML).toBe(`<span contenteditable="false" class="e-mention-chip"><a href="mailto:james@gmail.com" title="james@gmail.com">@Andrew James</a></span>​`);
            done();
        });
    });
});