import { Mention } from "@syncfusion/ej2-dropdowns";
import { RichTextEditor } from "../../src";
import { destroy, renderRTE, setCursorPoint } from "../rich-text-editor/render.spec";
import { AT_CHARACTER_KEY_EVENT_INIT, ENTERKEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from "../constant.spec";

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
}

describe('Mention integration tests', () => {
    beforeEach(() => {
        const divElement = document.createElement('div');
        divElement.id = 'mention';
        document.body.appendChild(divElement);
    });
    afterEach(() => {
        const divElement = document.getElementById('mention');
        if (divElement) {
            divElement.remove();
        }
    });
    describe('Mouse action testing ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
            done();
        });
        afterEach((done: DoneFn) => {
            destroyMention();
            destroy(editor);
            done();
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
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
            done();
        });
        afterEach((done: DoneFn) => {
            destroyMention();
            destroy(editor);
            done();
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
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: '@',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
            done();
        });
        afterEach((done: DoneFn) => {
            destroyMention();
            destroy(editor);
            done();
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
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: '<p><strong>​@</strong></p>',
                actionBegin: (e: any) => {
                    if (e.requestType === 'EnterAction' && mention.element.classList.contains('e-popup-open')) {
                        e.cancel = true;
                    }
                }
            });
            setupMention(editor, false);
            done();
        });
        afterEach((done: DoneFn) => {
            destroyMention();
            destroy(editor);
            done();
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
                setTimeout(() => {
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
            }, 200);
        });
    });

    describe('907712: When the Enable tab key setting is configured to true, the mention list popup will insert four spaces. ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
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
            done();
        });
        afterEach((done: DoneFn) => {
            destroyMention();
            destroy(editor);
            done();
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
});