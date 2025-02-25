/**
 * Base RTE spec
 */
import { createElement, L10n, isNullOrUndefined, Browser, getUniqueID, detach } from '@syncfusion/ej2-base';
import { RichTextEditor, HTMLFormatter, MarkdownFormatter, IRenderer, QuickToolbar, dispatchEvent, ITableCommandsArgs, DialogType, ToolbarType, PasteCleanup, HtmlEditor, Toolbar } from '../../../src/rich-text-editor/index';
import { NodeSelection } from '../../../src/selection/index';
import { setEditFrameFocus } from '../../../src/common/util';
import { renderRTE, destroy, dispatchKeyEvent, setCursorPoint as setCursor, clickImage, clickVideo } from './../render.spec';
import { ESCAPE_KEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from '../../constant.spec';

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}
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
    code: 22,
    action: '',
    type: 'keydown'
};
L10n.load({
    'de-DE': {
        'richtexteditor': {
            alignments: 'Alignments',
            justifyLeft: 'Ausrichten von Text links',
            justifyCenter: "Text-Zentrum",
            justifyRight: "Ausrichten von Text rechts",
            justifyFull: "rechtfertigen",
            fontName: "Wählen Sie Schriftfamilie",
            fontSize: "Wählen Sie Schriftgröße",
            fontColor: "Wählen Sie die Farbe",
            backgroundColor: "Hintergrundfarbe",
            bold: "fett",
            italic: "kursiv",
            underline: "unterstreichen",
            strikethrough: "Durchgestrichen",
            clearAll: "Alles",
            clearFormat: "Klar Format",
            cut: "schneiden",
            copy: "Kopieren",
            paste: "Paste",
            unorderedList: "Legen Sie ungeordnete Liste",
            orderedList: "Geordnete Liste einfügen",
            indent: "Einzug",
            outdent: "Einzug verkleinern",
            undo: "lösen",
            redo: "Wiederherstellen",
            superscript: "Überschrift",
            subscript: "index",
            createLink: "Einfügen / Hyperlink Bearbeiten",
            removeLink: "fjern Hyperlink",
            openLink: "Open link",
            editLink: "Edit link",
            image: "Bild einfügen",
            replace: 'ersetzen',
            align: 'ausrichten',
            caption: 'Bildbeschriftung',
            formats: 'Formats',
            remove: 'Löschen',
            insertLink: 'Link einfügen',
            display: 'Anzeige',
            alttext: 'alternativer Text',
            dimension: 'Größe',
            fullscreen: 'Vollbild',
            maximize: 'Maximieren',
            minimize: 'minimieren',
            zoomIn: 'hineinzoomen',
            zoomOut: 'Rauszoomen',
            upperCase: "Großbuchstaben",
            lowerCase: "Kleinbuchstaben",
            print: 'Drucken',
            sourcecode: 'Quellcode',
            preview: 'Vorschau',
            viewside: 'Seite anzeigen',
            insertcode: 'Code eingeben',
            linkText: 'Displaytekst',
            linkTooltipLabel: 'tooltip',
            linkWebUrl: 'Webadres',
            linkOpenInNewWindow: 'Open de link in een nieuw venster',
            linkHeader: 'Link invoegen',
            dialogInsert: 'invoegen',
            dialogCancel: 'Annuleer',
            dialogUpdate: 'Bijwerken',
            imageHeader: 'Voeg afbeelding in',
            imageLinkHeader: 'U kunt ook een link van internet opgeven',
            imageUploadMessage: 'Zet hier een afbeelding neer of klik om te uploaden',
            imageDeviceUploadMessage: 'Klik hier om te uploaden',
            imageAlternateText: 'Alternatieve tekst',
            alternateHeader: 'Alternatieve tekst',
            browse: 'Blader',
            imageUrl: 'URL',
            imageCaption: 'onderschrift',
            imageSizeHeader: 'Afbeeldingsgrootte',
            imageHeight: 'Hoogte',
            imageWidth: 'Breedte'
        }
    }
});

describe('RTE Base module ',() => {

describe('EJ2-60422: Removed nested bullet list when press ctrl+B on two times', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'b', stopPropagation: () => { }, shiftKey: false, which: 66 };
    it('pressing the ctrl+b on the parent list with nested list', (done: Function) => {
        rteObj = renderRTE({
            value: `<ul><li><strong class="focusNode">List parent</strong><ul><li>Nested List</li><li>Nested List﻿﻿<br></li></ul></li></ul>`,
        });
        let node: any = rteObj.inputElement.childNodes[1];
        let startNode = rteObj.inputElement.querySelector('.focusNode');
        let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], startNode.childNodes[0], 0, 11);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 66;
        keyBoardEvent.code = 'b';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML === `<ul><li><strong class="focusNode">List parent</strong><ul><li>Nested List</li><li>Nested List﻿﻿<br></li></ul></li></ul>`).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('831600: When using the mention with the Rich Text Editor, the backspace is not working properly.', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('contenteditable div false element before the backspace key press', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>sdvdsvsdv</p><p>sdvsdv <span contenteditable="false" class="e-mention-chip"><a title="maria@gmail.com">@Maria</a></span>&nbsp;sdvsdvdsv</p>`,
        });
        let node: any = rteObj.inputElement.querySelector('.e-mention-chip').nextSibling;
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe(`<p>sdvdsvsdv</p><p>sdvsdv <span contenteditable="false" class="e-mention-chip"><a title="maria@gmail.com">@Maria</a></span>&nbsp;sdvsdvdsv</p>`);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

    describe('Bug 935992: Backspace Behavior in Vue RichTextEditor Removes Enclosing <div> Tags in Chrome and Edge (Not Firefox)', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        it(' Pressing backspace in second line starting', (done: Function) => {
            rteObj = renderRTE({
                value: `<div><div><p>line 1</p><p class="focusNode">line 2</p></div></div>`,
            });
            let node: any = rteObj.inputElement.querySelector('.focusNode');
            setCursorPoint(document, node, 0);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML).toBe(`<div><div><p>line 1line 2</p></div></div>`);
                done();
            }, 100);
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

describe('832431: Entire line gets removed while pressing enter key after pressing backspace issue', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking after pressing backspace key', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>
            The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid
            <a href="https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor">HTML markup</a> or
            <a href="https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor">markdown</a> of the content
        </p><p><b class="focusNode">Toolbar</b></p>`,
        });
        let node: any = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[0], 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe(`<p>\n            The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid\n            <a href="https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor">HTML markup</a> or\n            <a href="https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor">markdown</a> of the content\n        <b class="focusNode">Toolbar</b></p>`);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('870158: Pressing backspace inside the list', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
    it('Pressing backspace key after pressing the shift enter inside the list with styles', (done: Function) => {
        rteObj = renderRTE({
            value: `<ol><li>List node content</li><li>List node <span style="background-color: rgb(255, 255, 0);">content</span><br></li><li><span style="background-color: transparent;">List node content<br></span><span class="focusNode" style="background-color: transparent;">Shift enter pressed</span></li></ol>`,
        });
        let node: any = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[0], 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe(`<ol><li>List node content</li><li>List node <span style="background-color: rgb(255, 255, 0);">content</span><br></li><li><span style="background-color: transparent;">List node content<br></span><span class="focusNode" style="background-color: transparent;">Shift enter pressed</span></li></ol>`);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('840133: Backspace key not working properly when placed cursor in the element with br inside the 2 text nodes', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('The backspace not working properly on the line break text', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>This is the first line</p><p>This is the secod line</p><p class='focusNode'>This is the thirdline<br>This is also the third line</p>`,
        });
        let node: any = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[2], 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe(`<p>This is the first line</p><p>This is the secod line</p><p class="focusNode">This is the thirdline<br>This is also the third line</p>`);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the backspacekey between two nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Testing 1<br></p><p>Testing 2</p>`,
        });
        let node: any = rteObj.inputElement.childNodes[1];
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.childNodes[0].innerHTML).toBe('Testing 1Testing 2');
            expect((rteObj as any).inputElement.childNodes[0].parentElement.hasAttribute('style')).toBe(false);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the li element skipping for nested LI', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>TextContent</p><ul><li>Testing 1</li><li>Testing 2﻿﻿<br></li></ul>`,
        });
        let node: any = rteObj.inputElement.childNodes[1].childNodes[1];
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.childNodes[1].childNodes[1].innerHTML === "Testing 2﻿﻿<br>").toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the keyboard enter inside the table', (done: Function) => {
        rteObj = renderRTE({
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;" class="">Testing1</td>
            <td style="width: 50%;">Testing2</td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`,
        });
        let node: any = (rteObj as any).element.querySelector('table').querySelector('tr').firstElementChild.firstChild;
        setCursorPoint(document, node, 8);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((node as any).textContent.length).toBe(8);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the keyboard enter inside the nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Testing 1<br></p><p>Testing 2</p>`,
        });
        let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
        setCursorPoint(document, node, 9);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((node as any).textContent.length).toBe(9);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('827539: Random spaces got removed while pressing backspace key in RichTextEditor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the randowm node being removed in the editor', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>
            <font size="2" face="Arial,Helvetica,sans-serif" color="000000">###Begrüßung### <br></font>
          </p><p>
            <font size="2" face="Arial,Helvetica,sans-serif" color="000000">wir hatten Sie zu einem Online-Einstellungstest der
              <font size="2" face="Arial,Helvetica,sans-serif" color="000000">###ProjektFirma###</font>
              eingeladen. <br>
            </font>
          </p><p>
            <font size="2" face="Arial,Helvetica,sans-serif" color="000000">Da Sie unsere Einladung ohne Angabe von Gründen nicht
              wahrgenommen haben, gehen wir davon aus, dass Sie sich
              zwischenzeitlich für einen anderen Ausbildungsplatz
              entschieden haben und werden Sie somit im
              Bewerberauswahlverfahren nicht weiter berücksichtigen.<br><br>

              Für Ihre weitere Suche nach einem Ausbildungsplatz wünschen
              wir Ihnen viel Erfolg.</font>
          </p><p><font size="2" face="Arial,Helvetica,sans-serif" color="000000">###Signatur###<br></font>
          </p><p>
            <font size="2" face="Arial,Helvetica,sans-serif" color="000000"><br></font>
          </p><p>
            <font size="2" face="Arial,Helvetica,sans-serif" color="000000">
            </font>
          </p>`,
        });
        let node: any = (rteObj.inputElement.childNodes[3] as HTMLElement).firstElementChild.firstChild;
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(((rteObj as any).inputElement.childNodes[2] as HTMLElement).firstElementChild.querySelectorAll('BR').length === 2).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-69674 - Deleting bullet list using backspace key doesnt delete the list issue testing', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the keyboard enter inside the nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p style="text-align:center; margin-bottom: 15px; ">
            <span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p><ol><li><span style="font-size: 14pt; "><span style="font-size: 14pt;"><span style="font-family: Calibri; " id="firstli">Tes﻿t 1</span></span></span></li><li><span style="font-size: 14pt; "><span style="font-size: 14pt;"><span style="font-family: Calibri; ">Test 2</span></span></span></li><li><span style="font-size: 14pt; "><span style="font-size: 14pt;"><span style="font-family: Calibri; " id="lastli">Test 3﻿<br></span></span></span>
          </li></ol>`,
        });
        let startNode: any = (rteObj as any).inputElement.querySelector('#firstli');
        let endNode: any = (rteObj as any).inputElement.querySelector('#lastli');
        let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 7);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.querySelectorAll('li').length).toBe(0);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-69674 - Pressing enter key after deleting the list using backspace key', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Pressing enter key after ', (done: Function) => {
        rteObj = renderRTE({
            value: `<p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br></p><p style="text-align:center; margin-bottom: 5px; "><font face="Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></font><br></p><p style="text-align: center; margin-bottom: 2px; "><font face="Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></font></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p>`,
        });
        let node: any = (rteObj as any).inputElement;
        setCursorPoint(document, node, 5);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        expect(window.getSelection().anchorOffset !== (rteObj as any).inputElement).toBe(true);
        expect((rteObj as any).inputElement.innerHTML === `<p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br></p><p style="text-align:center; margin-bottom: 5px; "><span style="font-family:Calibri;"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></span><br></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-family:Calibri;"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></span></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-size: 14pt;"><span style="font-family: Calibri; "><br></span></span></span></p>`).toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('BLAZ-21232: Rich Text Editor content is removed when pressing the backspace key -', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it(' if the placeHolder is configured', (done: Function) => {
        rteObj = renderRTE({
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p>RTE content</p>`,
            placeholder: 'testing'
        });
        let node: any = rteObj.inputElement;
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        expect((rteObj as any).inputElement.childElementCount).toBe(2);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-57147: Change width property', () => {
    let rteObj: RichTextEditor;
    it('Changing the width property when RTE is in inline mode', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Testing 1<br></p><p>Testing 2</p>`,
            readonly: true,
            inlineMode: {
                enable: true,
                onSelection: true,
            }
        });
        rteObj.readonly = false;
        rteObj.dataBind();
        rteObj.width = "500";
        expect(rteObj.width).toBe('500');
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-65467: Backspace key press inbetween 2 inline nodes seperated by BR', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Backspace key press inbetween 2 inline nodes seperated by BR', (done: Function) => {
        rteObj = renderRTE({
            value: `<p style="margin-bottom:7.5pt;line-height:normal;background:
            white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><u><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">Lower abdomen</span></u></b><b><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">:</span></b></p><p style="margin-bottom:7.5pt;line-height:normal;background:
            white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">Axial</span><br><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;" class="focusNode">-</span><br><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">T2FS, T1</span></p>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.focusNode').childNodes[0];
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        expect((rteObj as any).inputElement.innerHTML === `<p style="margin-bottom:7.5pt;line-height:normal;background:\n            white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><u><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">Lower abdomen</span></u></b><b><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">:</span></b></p><p style="margin-bottom:7.5pt;line-height:normal;background:\n            white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">Axial</span><br><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;" class="focusNode">-</span><br><span lang="EN-IN" style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333;">T2FS, T1</span></p>`).toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the LI element with blocknodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p><b>Functional\n            Specifications/Requirements:</b></p><ol><li><p>Provide\n            the tool bar support, it\u2019s also customizable.</p></li><li><p>Options\n            to get the HTML elements with styles.</p></li><li><p>Support\n            to insert image from a defined path.</p></li></ol></p>`,
        });
        let node: any = (rteObj as any).inputElement.childNodes[1].childNodes[1].lastElementChild.firstChild;
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        expect((rteObj as any).inputElement.childNodes[1].childElementCount).toBe(2);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-44314: Improvement with backSpaceKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the LI element with text nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p><b>Functional
            Specifications/Requirements:</b></p><ol><li><p>Provide
            the tool bar support, it’s also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li>Support
            to insert image from a defined path.</li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol><p></p>`,
        });
        let node: any = (rteObj as any).inputElement.childNodes[1].childNodes[2].firstChild;
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.childNodes[1].childElementCount).toBe(4);
            expect((rteObj as any).inputElement.innerHTML === `<p><b>Functional\n            Specifications/Requirements:</b></p><ol><li><p>Provide\n            the tool bar support, it’s also customizable.</p></li><li><p>Options\n            to get the HTML elements with styles.</p></li><li>Support\n            to insert image from a defined path.</li><li><p>Footer\n            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol><p><br></p>`).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-56125: backSpaceKey action at start of list with previous list empty issue', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the LI element with text nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<ul><li>List Content 1</li><li><br></li><li class="focusNode">List Content 3</li></ul>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.focusNode').childNodes[0];
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.textContent).toBe('List Content 1List Content 3');
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-50975: Improvement with deleteKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    it('Checking the deletekey between two nodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Testing 1<br></p><p>Testing 2</p>`,
        });
        let node: any = rteObj.inputElement.childNodes[0];
        setCursorPoint(document, node, 1);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.childNodes[0].innerHTML).toBe('Testing 1Testing 2');
            expect((rteObj as any).inputElement.childNodes[0].parentElement.hasAttribute('style')).toBe(false);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-61099: Link in the list reverted when press ctrl+C', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'c', stopPropagation: () => { }, shiftKey: false, which: 67 };
    it('clearing all list maintains the list element', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Rich Text Editor is a WYSIWYG editing control that will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.</p><p><b>Paste Cleanup properties:</b></p><ul>
            <li><p>prompt - specifies whether to enable the prompt when pasting in Rich Text Editor.</p></li>
            <li>
                <p><a class="e-rte-anchor" href="http://dummylink" title="http://dummylink" target="_blank">plainText - specifies whether to paste as plain text or not in Rich Text Editor.</a></p>
            </li>
            <li>
                <p>keepFormat- specifies whether to keep or remove the format when pasting in Rich Text Editor.</p>
            </li>
            <li>
                <p>deniedTags - specifies the tags to restrict when pasting in Rich Text Editor.</p>
            </li>
            <li>
                <p>deniedAttributes - specifies the attributes to restrict when pasting in Rich Text Editor.</p>
            </li>
            <li>
                <p>allowedStyleProperties - specifies the allowed style properties when pasting in Rich Text Editor.</p>
            </li>
        </ul>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.e-rte-anchor').childNodes[0];
        let sel = new NodeSelection().setSelectionText(document, node, node, 0, 80);
        keyBoardEvent.keyCode = 67;
        keyBoardEvent.code = 'C';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.querySelectorAll('a').length).toBe(1);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-57616: clearing all list maintains the list element', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('clearing all list maintains the list element', (done: Function) => {
        rteObj = renderRTE({
            value: `<p class="focusNodefirst">Rich Text Editor is a WYSIWYG editing control that will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.</p>
            <p><b>Paste Cleanup properties:</b></p>
            <ul>
                <li>
                    <p>prompt - specifies whether to enable the prompt when pasting in Rich Text Editor.</p>
                </li>
                <li>
                    <p>plainText - specifies whether to paste as plain text or not in Rich Text Editor.</p>
                </li>
                <li>
                    <p>keepFormat- specifies whether to keep or remove the format when pasting in Rich Text Editor.</p>
                </li>
                <li>
                    <p>deniedTags - specifies the tags to restrict when pasting in Rich Text Editor.</p>
                </li>
                <li>
                    <p>deniedAttributes - specifies the attributes to restrict when pasting in Rich Text Editor.</p>
                </li>
                <li>
                    <p class="focusNodelast">allowedStyleProperties - specifies the allowed style properties when pasting in Rich Text Editor.</p>
                </li>
            </ul>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.focusNodefirst').childNodes[0];
        let node2: any = (rteObj as any).inputElement.querySelector('.focusNodelast').childNodes[0];
        let sel = new NodeSelection().setSelectionText(document, node, node2, 0, node2.textContent.length);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        expect(rteObj.inputElement.textContent.length).toBe(1049);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.textContent.length).toBe(1011);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-56125: backSpaceKey action at start of list with previous list empty issue', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the LI element with text nodes and last element have BR element', (done: Function) => {
        rteObj = renderRTE({
            value: `<ul><li>List Content 3</li><li><br></li><li class="focusNode">List Content 4<br></li></ul>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.focusNode').childNodes[0];
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.textContent).toBe('List Content 3List Content 4');
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-50975: Improvement with deleteKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    it('Checking the delete key between two LI nodes with no childNodes', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>TextContent</p><ul><li>Testing 1</li><li>Testing 2\uFEFF\uFEFF<br></li></ul>`,
        });
        let node: any = rteObj.inputElement.childNodes[1].childNodes[0];
        setCursorPoint(document, node, 1);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.childNodes[1].childNodes[0].textContent === "Testing 1").toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-50975: Improvement with deleteKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    it('Checking the deletekey between two nodes with child elements', (done: Function) => {
        rteObj = renderRTE({
            value: `<p><b>Functional\nSpecifications/Requirements:</b></p><ol><li><p>Provide\nthe tool bar support, it\u2019s also customizable.</p></li><li><p>Options\nto get the HTML elements with styles.</p></li><li><p>Support\nto insert image from a defined path.</p></li></ol></p>`,
        });
        let node: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0].firstChild;
        setCursorPoint(document, node, rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0].textContent.length);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.childNodes[1].childNodes[0].textContent === "Provide\nthe tool bar support, it’s also customizable.Options\nto get the HTML elements with styles.").toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-50975: Improvement with deleteKey action in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    it('Checking the deletekey between two nodes one with child elements and other with no child', (done: Function) => {
        rteObj = renderRTE({
            value: `<p><b>Functional\nSpecifications/Requirements:</b></p><ol><li><p>Provide\nthe tool bar support, it\u2019s also customizable.</p></li><li><p>Options\nto get the HTML elements with styles.</p></li><li>Support\nto insert image from a defined path.</li><li><p>Footer\nelements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol><p></p>`,
        });
        let node: any = rteObj.inputElement.childNodes[1].childNodes[1].firstChild;
        setCursorPoint(document, node.firstChild, node.firstChild.textContent.length);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.childNodes[1].childNodes[1].textContent === "Options\nto get the HTML elements with styles.Support\nto insert image from a defined path.").toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-57112: Delete Key not working when image is focused and deleted', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    it('Delete Key not working when image is focused and deleted', (done: Function) => {
        rteObj = renderRTE({
            value: `<ol><li><p>image</p></li></ol><p class="focusNode"><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" style="width: 300px;"></p><p>Content</p>`,
        });
        let node: any = rteObj.inputElement.querySelector('.focusNode');
        let sel = new NodeSelection().setSelectionText(document, node, node, 0, 1);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML === `<ol><li><p>image</p></li></ol><p class="focusNode"><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" style="width: 300px;"></p><p>Content</p>`).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('RTE base module', () => {

    beforeAll(() => {
        let css: string = ".e-richtexteditor { margin-top: 100px; height: 200px }" +
            ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
            ".e-toolbar-items { display: inline-block; height: 1px; width: inherit; }" +
            ".e-popup-open { display:block } .e-popup-close { display: none }" +
            ".e-toolbar-item { display: inline-block; }";
        let style: HTMLStyleElement = document.createElement('style');
        style.type = "text/css";
        style.id = "toolbar-style15017";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });

    afterAll(() => {
        document.head.getElementsByClassName('toolbar-style15017')[0].remove();
    });

    describe('RTE without iframe', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({ value: "<p>RTE</p>" });
            done();
        });

        it('check content div element', () => {
            expect(rteObj.element.querySelector('.e-rte-content')).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        it('Width setting', () => {
            rteObj.width = 'auto';
            rteObj.dataBind();
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        it('getPersistData public method', () => {
            rteObj.refresh();
            let stringItems: any = rteObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
        it('selectAll public method', () => {
            rteObj.selectAll();
            expect(rteObj.getSelection() === 'RTE').toBe(true);
        });
        it('selectRange public method', () => {
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(rteObj.contentModule.getEditPanel(), 0);
            range.setEnd(rteObj.contentModule.getEditPanel(), rteObj.contentModule.getEditPanel().childNodes.length);
            rteObj.selectRange(range);
            let selection: Selection = rteObj.formatter.editorManager.nodeSelection.get(rteObj.contentModule.getDocument());
            expect(selection.anchorNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.focusNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.anchorOffset).toBe(0);
            expect(selection.focusOffset).toBe(rteObj.contentModule.getEditPanel().childNodes.length);
        });
        it('getSelection public method', () => {
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(rteObj.contentModule.getEditPanel(), 0);
            range.setEnd(rteObj.contentModule.getEditPanel(), rteObj.contentModule.getEditPanel().childNodes.length);
            rteObj.selectRange(range);
            let str = rteObj.getSelection();
            expect(range.toString()).toBe(str);
        });
        it('getSelectedHtml public method', () => {
            rteObj.value = '<p>RTE</p><p>This is a sample content used in the RTE test cases</p><ol><li>list samples</li></ol>'
            rteObj.dataBind();
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(rteObj.contentModule.getEditPanel(), 0);
            range.setEnd(rteObj.contentModule.getEditPanel(), rteObj.contentModule.getEditPanel().childNodes.length);
            rteObj.selectRange(range);
            let str = rteObj.getSelectedHtml();
            expect(rteObj.value === str).toBe(true);
        });
        it('show inline quick toolbar public method', () => {
            rteObj.value = '<p>RTE sample content</p><p id="p2">This is a sample content used in the RTE test cases</p><ol><li>list samples</li></ol>';
            rteObj.inlineMode.enable = true;
            rteObj.dataBind();
            let start = rteObj.inputElement.querySelector('#p2');
            setCursorPoint(document, start.childNodes[0] as Element, 5);
            rteObj.showInlineToolbar();
            expect(document.querySelector('.e-rte-inline-popup')).not.toBe(null);
            rteObj.hideInlineToolbar();
        });
        /*it('executeCommand', () => {
            rteObj.focus();
            var img = document.createElement('img');
            img.src = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            img.width = 250;
            img.height = 250;
            img.id ='myImg';
            rteObj.execCommand("Image", img);
            let ele: Element = rteObj.getContent();
            expect(ele.querySelector('#myImg')).not.toBe(null);
        })*/
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('RTE getcontent method for blazor in iframe mode', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({ value: "<p>RTE</p>" });
            done();
        });
        it('getContent public method', () => {
            let blazor: boolean = true;
            rteObj.iframeSettings.enable = true;
            rteObj.dataBind();
            if (blazor && rteObj.iframeSettings.enable) {
                expect((rteObj as any).inputElement.innerText).toBe("RTE");
            }
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe("DIV - RTE value property testing", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                enableHtmlEncode: true,
                focus: () => { },
                blur: () => { }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('check value Html Encode property', () => {
            expect(rteObj.value !== rteObj.contentModule.getEditPanel().innerHTML).toBe(true);
        });
        it('check value Html Encode property', () => {
            expect(rteObj.value).toBe('&lt;p&gt;Sample&lt;/p&gt;');
        });
        it('disable Html Encode property', () => {
            rteObj.setProperties({ enableHtmlEncode: false });
            expect(rteObj.value === rteObj.contentModule.getEditPanel().innerHTML).toBe(true);
        });
    });

    describe("Inline mode fontFamily and fontSize testing -", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                inlineMode: {
                    enable: true, onSelection: true
                },
                toolbarSettings: {
                    items: ['FontName', 'FontSize']
                },
                fontFamily: {
                    default: 'Verdana',
                    width: '65px',
                    items: [
                        { text: 'Segoe UI', value: 'Segoe UI' },
                        { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
                        { text: 'Courier New', value: 'Courier New,Courier,monospace' },
                        { text: 'Georgia', value: 'Georgia,serif' },
                        { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
                        { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
                        { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
                        { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
                        { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
                        { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
                    ]
                },
                fontSize: {
                    default: "8pt",
                    width: "35px",
                    items: [
                        { text: "8", value: "8pt" },
                        { text: "10", value: "10pt" },
                        { text: "12", value: "12pt" },
                        { text: "14", value: "14pt" },
                        { text: "18", value: "18pt" },
                        { text: "24", value: "24pt" },
                        { text: "36", value: "36pt" }
                    ]
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Default mode RTE in initial render', () => {
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).style.fontFamily === 'Verdana').toBe(true);
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).style.fontSize === '8pt').toBe(true);
        });
    });

    describe("Inline mode fontFamily and fontSize testing -", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                inlineMode: {
                    enable: true, onSelection: true
                },
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['FontName', 'FontSize']
                },
                fontFamily: {
                    default: 'Verdana',
                    width: '65px',
                    items: [
                        { text: 'Segoe UI', value: 'Segoe UI' },
                        { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
                        { text: 'Courier New', value: 'Courier New,Courier,monospace' },
                        { text: 'Georgia', value: 'Georgia,serif' },
                        { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
                        { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
                        { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
                        { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
                        { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
                        { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
                    ]
                },
                fontSize: {
                    default: "8pt",
                    width: "35px",
                    items: [
                        { text: "8", value: "8pt" },
                        { text: "10", value: "10pt" },
                        { text: "12", value: "12pt" },
                        { text: "14", value: "14pt" },
                        { text: "18", value: "18pt" },
                        { text: "24", value: "24pt" },
                        { text: "36", value: "36pt" }
                    ]
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Iframe mode RTE in initial render', () => {
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).style.fontFamily === 'Verdana').toBe(true);
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).style.fontSize === '8pt').toBe(true);
        });
    });

    describe("Default RTE fontFamily and fontSize testing -", () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let EnterkeyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 13,
            keyCode: 13,
            which: 13,
            code: 'Enter',
            action: 'enter',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Testing</p>',
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                fontFamily: {
                    default: 'Verdana',
                    width: '65px',
                    items: [
                        { text: 'Segoe UI', value: 'Segoe UI' },
                        { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
                        { text: 'Courier New', value: 'Courier New,Courier,monospace' },
                        { text: 'Georgia', value: 'Georgia,serif' },
                        { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
                        { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
                        { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
                        { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
                        { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
                        { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
                    ]
                },
                fontSize: {
                    default: "8pt",
                    width: "35px",
                    items: [
                        { text: "8", value: "8pt" },
                        { text: "10", value: "10pt" },
                        { text: "12", value: "12pt" },
                        { text: "14", value: "14pt" },
                        { text: "18", value: "18pt" },
                        { text: "24", value: "24pt" },
                        { text: "36", value: "36pt" }
                    ]
                }
            });
            elem = rteObj.element;
        });

        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('Default mode RTE testing fontfamily', (done: Function) => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p>Testing</p>';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0].firstChild;
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            (<any>rteObj).keyDown(EnterkeyboardEventArgs);
            ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            ((document.querySelector('.e-font-name-tbar-btn ul') as HTMLElement).childNodes[0] as HTMLElement).click();
            expect((((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild as HTMLElement).style.fontFamily === '"Segoe UI"').toBe(true);
            nodetext = ((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild.firstChild;
            setCursorPoint(document, nodetext, nodetext.textContent.length);
            (<any>rteObj).keyDown(EnterkeyboardEventArgs);
            ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            ((document.querySelector('.e-font-name-tbar-btn ul') as HTMLElement).childNodes[3] as HTMLElement).click();
            expect((((rteObj.contentModule.getEditPanel() as HTMLElement).childNodes[2] as HTMLElement).firstElementChild as HTMLElement).style.fontFamily === 'Georgia, serif').toBe(true);
            done();
        });
        it('Default mode RTE testing fontSize', (done: Function) => {
            rteObj.value = "<p>Testing</p>";
            rteObj.contentModule.getEditPanel().innerHTML = "<p>Testing</p>";
            rteObj.dataBind();
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0].firstChild;
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            (<any>rteObj).keyDown(EnterkeyboardEventArgs);
            ((elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            ((document.querySelector('.e-font-size-tbar-btn ul') as HTMLElement).childNodes[2] as HTMLElement).click();
            expect((((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild as HTMLElement).style.fontSize === '12pt').toBe(true);
            nodetext = ((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild.firstChild;
            setCursorPoint(document, nodetext, nodetext.textContent.length);
            (<any>rteObj).keyDown(EnterkeyboardEventArgs);
            ((elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            ((document.querySelector('.e-font-size-tbar-btn ul') as HTMLElement).childNodes[5] as HTMLElement).click();
            expect((((rteObj.contentModule.getEditPanel() as HTMLElement).childNodes[2] as HTMLElement).firstElementChild as HTMLElement).style.fontSize === '24pt').toBe(true);
            done();
        });
    });

    describe("DIV - RTE content focus and blur event handler testing", () => {
        let rteObj: RichTextEditor;
        let focusIn: boolean = false;
        let focusOut: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                focus: () => {
                    focusIn = true;
                },
                blur: () => {
                    focusOut = true;
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('focus event trigger while click on edit area', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on edit area', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
        it('focus event trigger while click on target element', () => {
            (rteObj.element as HTMLElement).focus();
            dispatchEvent(rteObj.element, 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on target element', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.element, 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
    });


    describe("EJ2-62642 - Blur called when @amp; is on the RTE content", () => {
        let rteObj: RichTextEditor;
        let focusIn: boolean = false;
        let focusOut: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>The custom command "insert special character" is configured as the last item of the too&amp;lbar. Click on the command and choo😒se the special character you want to include from the popup.</p>',
                focus: () => {
                    focusIn = true;
                },
                blur: () => {
                    focusOut = true;
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Blur called when @amp; is on the RTE content with individual text nodes', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
            expect(rteObj.inputElement.innerHTML === '<p>The custom command "insert special character" is configured as the last item of the too&amp;lbar. Click on the command and choo😒se the special character you want to include from the popup.</p>').toBe(true);
            expect(rteObj.inputElement.textContent === 'The custom command "insert special character" is configured as the last item of the too&lbar. Click on the command and choo😒se the special character you want to include from the popup.').toBe(true);
        });
    });

    describe("Iframe - RTE content focus and blur event handler testing", () => {
        let rteObj: RichTextEditor;
        let focusIn: boolean = false;
        let focusOut: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                iframeSettings: {
                    enable: true
                },
                focus: () => {
                    focusIn = true;
                },
                blur: () => {
                    focusOut = true;
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('focus event trigger while click on edit area', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;

        });
        it('blur event trigger while click on edit area', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
        it('focus event trigger while click on target element', () => {
            (rteObj.element as HTMLElement).focus();
            dispatchEvent(rteObj.element, 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on target element', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.element, 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
    });

    describe('RTE iframe', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            done();
        });

        it('check content iframe element', () => {
            expect(rteObj.element.querySelector('iframe')).not.toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE toolbar', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });

        it('ensure the module', () => {
            expect(rteObj.ensureModuleInjected(rteObj.getInjectedModules()[0] as any)).toBe(true);
        });

        it('ensure the module', () => {
            expect(rteObj.ensureModuleInjected(rteObj.getInjectedModules()[0] as any)).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('setContentHeight method testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let style: HTMLStyleElement;
        let actionBegin: boolean = false;
        let actionComplete: boolean = false;

        beforeAll((done: Function) => {
            let css: string = ".e-richtexteditor { height: 200px }" +
                ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
                ".e-toolbar-item { display: inline-block; }";
            style = document.createElement('style');
            style.type = "text/css";
            style.id = "scroll";
            style.appendChild(document.createTextNode(css));
            document.body.appendChild(style);
            rteObj = renderRTE({
                height: '200px',
                value: '<p>data</p><ol><li>manager</li></ol>',
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo']
                },
                actionBegin: () => {
                    actionBegin = true;
                },
                actionComplete: () => {
                    actionComplete = true;
                }

            });
            elem = rteObj.element;
            done();
        });

        it('Content element height testing', (done) => {
            //height is default is auto, so the content wrapper holds without content height is 18px whether toolbar enabled or not
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).clientHeight).toBe(52);
            rteObj.toolbarSettings.enable = false;
            rteObj.dataBind();
            expect(rteObj.element.querySelector('.e-toolbar-items')).toBe(null);
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).clientHeight).toBe(52);
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).clientHeight).toBe(52);
            let node = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 2);
            let parentNodes = new NodeSelection().getParentNodeCollection(new NodeSelection().getRange(document));
            expect(parentNodes[0]).toEqual(node);
            (elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            (elem.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).click();
            expect(parentNodes[0]).toEqual(node);
            (elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (<any>rteObj).onPaste();
            setTimeout(() => {
                expect(parentNodes[0]).toEqual(node);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 67;
                keyboardEventArgs.action = 'copy';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 86;
                keyboardEventArgs.action = 'paste';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 88;
                keyboardEventArgs.action = 'cut';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 86;
                keyboardEventArgs.action = 'paste';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.action = 'toolbar-focus';
                (<any>rteObj).keyDown(keyboardEventArgs);
                let focusEle: HTMLElement = rteObj.toolbarModule.baseToolbar.toolbarObj.element.querySelector('button');
                expect(document.activeElement === focusEle).toBe(true);
                rteObj.toolbarSettings.enable = false;
                rteObj.dataBind();
                (<any>rteObj).keyDown(keyboardEventArgs);
                done();
            }, 100);
        });
        it('tab key', () => {
            let node = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 2);
            let parentNodes = new NodeSelection().getParentNodeCollection(new NodeSelection().getRange(document));
            expect(parentNodes[0]).toEqual(node);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.action = 'tab';
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(true);
            actionBegin = false;
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.shiftKey = true,
                (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
            keyboardEventArgs.shiftKey = false,
                keyboardEventArgs.keyCode = 9;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });
        it('Enter key', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.keyCode = 13;
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
            expect(rteObj.contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            var node = rteObj.contentModule.getEditPanel().innerHTML = 'data';
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.keyCode = 13;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });
        it('Enter key quicktoolbar hide testing', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.keyCode = 13;
            (<any>rteObj).keyDown(keyboardEventArgs);
            let popupElement: HTMLCollectionOf<Element> = document.getElementsByClassName('e-rte-quick-popup');
            expect(popupElement.length === 0).toBe(true);
        });
        it('space key', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
            expect(rteObj.contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            var node = rteObj.contentModule.getEditPanel().innerHTML = 'data';
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });
        it('space key with content', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.comlinkis created';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, 34, 34);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
            expect(rteObj.contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            var node = rteObj.contentModule.getEditPanel().innerHTML = 'data';
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });
        it('Link Spacing', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj).keyDown(keyboardEventArgs);
            let expectedElement: string = `datamanager <a class="e-rte-anchor" href="https://www.google.com" title="https://www.google.com" target="_blank">https://www.google.com</a>`;
            let expectedString: string = `datamanager https://www.google.com`;
            expect(rteObj.contentModule.getEditPanel().innerHTML === expectedElement).toBe(true);
            expect(rteObj.contentModule.getEditPanel().textContent === expectedString).toBe(true);
        });
        it('Link Spacing', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj).keyDown(keyboardEventArgs);
            let expectedElement: string = `datamanager <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a>`;
            let expectedString: string = `datamanager www.google.com`;
            expect(rteObj.contentModule.getEditPanel().innerHTML === expectedElement).toBe(true);
            expect(rteObj.contentModule.getEditPanel().textContent === expectedString).toBe(true);
        });
        it('space key', function () {
            destroy(rteObj);
            rteObj = undefined;
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    enableFloating: true,
                }
            });
            expect(rteObj.toolbarModule.getToolbarElement()).not.toBe(null);
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            detach(style);
            done();
        });
    });

    describe('rte Iframe mode', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('focus method testing', () => {
            rteObj.focusIn();
            expect(document.activeElement === rteObj.contentModule.getPanel()).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-49452- Disable toolbar when quicktoolbar is opened', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
        let trg: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', {
                        tooltipText: 'Custom tool',
                        command: 'Custom',
                        template:
                            '<button class="e-tbar-btn e-btn" id="custom_tbar" style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div>custom tool</button>'
                    }, 'FontColor', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase'
                    ]
                },
                value: '<p><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" class="e-resize e-rte-image e-imginline"></p>'
            });
            trg = (rteObj as any).element.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
        });

        it('When the custom command is configured', () => {
            expect((rteObj as any).element.querySelectorAll('.e-template')[0].classList.contains('e-overlay')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-49452- Disable toolbar when quicktoolbar is opened', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
        let trg: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', {
                        tooltipText: 'Custom tool',
                        template:
                            '<button class="e-tbar-btn e-btn" id="custom_tbar" style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div>custom tool</button>'
                    }, 'FontColor', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase'
                    ]
                },
                value: '<p><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" class="e-resize e-rte-image e-imginline"></p>'
            });
            trg = (rteObj as any).element.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
        });

        it('When the custom command is not configured', () => {
            expect((rteObj as any).element.querySelectorAll('.e-template')[0].classList.contains('e-overlay')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-49452- Disable multiple toolbar when quicktoolbar is opened', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
        let trg: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', {
                        tooltipText: 'Custom tool 1',
                        command: 'Custom',
                        template:
                            '<button class="e-tbar-btn e-btn" id="custom_tbar" style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div>custom tool</button>'
                    }, 'FontColor', 'BackgroundColor', '|',
                        'SubScript', {
                            tooltipText: 'Custom tool 2',
                            command: 'Custom',
                            template:
                                '<button class="e-tbar-btn e-btn" id="custom_tbar" style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div>custom tool</button>'
                        }, 'SuperScript', '|',
                        'LowerCase', {
                            tooltipText: 'Custom tool 3',
                            command: 'Custom',
                            template:
                                '<button class="e-tbar-btn e-btn" id="custom_tbar" style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div>custom tool</button>'
                        }, 'UpperCase'
                    ]
                },
                value: '<p><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" class="e-resize e-rte-image e-imginline"></p>'
            });
            trg = (rteObj as any).element.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
        });

        it('When the custom command is configured for multiple toolbars', () => {
            expect((rteObj as any).element.querySelectorAll('.e-template')[0].classList.contains('e-overlay')).toBe(true);
            expect((rteObj as any).element.querySelectorAll('.e-template')[3].classList.contains('e-overlay')).toBe(true);
            expect((rteObj as any).element.querySelectorAll('.e-template')[4].classList.contains('e-overlay')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE Events', () => {
        let rteObj: RichTextEditor;
        let actionBeginTiggered: boolean = false;
        let actionCompleteTiggered: boolean = false;
        let afterImageDeleteTiggered: boolean = false;
        let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeAll(() => {
            rteObj = renderRTE({
                value: '',
                actionBegin: onActionBeginfun,
                actionComplete: onActionCompletefun,
                afterImageDelete: afterImageDeletefun
            });
            function onActionBeginfun(): void {
                actionBeginTiggered = true;
            }
            function onActionCompletefun(): void {
                actionCompleteTiggered = true;
            }
            function afterImageDeletefun(args: any): void {
                afterImageDeleteTiggered = true;
            }
        });

        it('backspace key press while empty content in editable element', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while empty content in editable element', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('backspace key press inside the pre tag', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<pre id="p1"><br>Paragraph 4<br>Paragraph 5<br>Para&#8203;<br><br></pre>';
            let start: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('#p1');
            expect(start.childNodes[5].textContent.length === 5).toBe(true);
            setCursorPoint(document, start.childNodes[5] as Element, 5);
            keyBoardEvent.which = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(start.childNodes[5].textContent.length === 4).toBe(true);
        });

        it('backspace key press while <BR> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<br/>';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while <BR> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<br/>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('delete key press while <p> with text content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p>test</p>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>test</p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('backspace key press while <P> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p></p>';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><br></p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while <P> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p></p>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><br></p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('delete key press while <p> with text content and image elemnt in editable element - Firefox', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test</p><img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250"><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[2].childNodes[0], 0, 2);
            keyBoardEvent.which = 46;
            keyBoardEvent.action = 'delete';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(actionBeginTiggered).toBe(true);
            expect(actionCompleteTiggered).toBe(true);
        });

        it('delete key press for the image element by selecting all', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test</p><img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250"><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            rteObj.selectAll();
            keyBoardEvent.which = 46;
            keyBoardEvent.action = 'delete';
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(true);
        });

        it('delete key press for the image element by selecting all', () => {
            afterImageDeleteTiggered = false;
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250"></p><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (selectNode.childNodes[0].childNodes[0] as Element), 4);
            keyBoardEvent.which = 46;
            keyBoardEvent.action = 'delete';
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(true);
        });

        it('Backspace key press for the image element by selecting all', () => {
            afterImageDeleteTiggered = false;
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'Backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">test</p><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (selectNode.childNodes[0].childNodes[2] as Element), 0);
            keyBoardEvent.which = 8;
            keyBoardEvent.code = 'Backspace';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(true);
        });

        it('pressing some other key when image element is selected', () => {
            afterImageDeleteTiggered = false;
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'KeyA', stopPropagation: () => { }, shiftKey: false, which: 65 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">test</p><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            rteObj.selectAll();
            keyBoardEvent.which = 65;
            keyBoardEvent.code = 'KeyA';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(true);
        });

        it('pressing F12 key when image element is selected and shouldnt trigger event', () => {
            afterImageDeleteTiggered = false;
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'F12', stopPropagation: () => { }, shiftKey: false, which: 123 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">test</p><p>test2</p></div>`;
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('.actiondiv');
            let curDocument: Document = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            rteObj.selectAll();
            keyBoardEvent.which = 123;
            keyBoardEvent.code = 'F12';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-60047 - typing by selecting 3 empty p tag elements which is prefix of other element with content in firefox', () => {
        let rteObj: RichTextEditor;
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                value: `<p class="startNode"></br></p><p></br></p><p class="endNode"></br></p><div>
                <h2>sssssssss</h2>
                <div>
                <h5>
                aaaaaaaaaaaaaaaaaaaaaaaaaa
                </h5>
                </div>
                </div><p></p>`
            });
        });

        it('EJ2-60047 - typing by selecting 3 empty p tag elements which is prefix of other element with content in firefox', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, key: 'KeyA', stopPropagation: () => { }, shiftKey: false, which: 65 };
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            keyBoardEvent.which = 65;
            keyBoardEvent.code = 'KeyA';
            keyBoardEvent.type = 'keydown';
            rteObj.contentModule.getEditPanel().innerHTML = `a<div><h2>sssssssss</h2><div><h5>aaaaaaaaaaaaaaaaaaaaaaaaaa</h5></div></div><p></p>`;
            let sel1 = new NodeSelection().setSelectionText(document, editNode.childNodes[0], editNode.childNodes[0], 1, 1);
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect((editNode.childNodes[0] as HTMLElement).outerHTML === `<p>a</p>`).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });

    describe('826826 - Placing cursor at the and entering the space key', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p class='focusNode'>Your order nr. <span contenteditable="false" class="pds-content-variable" id="847c7ece-b25a-4467-a0e8-394c1607f8af" data-id="6661" data-format-id="0" data-strict="true">orderNo</span> has been passed to the​​<span class="pds-conditional-text" id="41b565d9-dc61-4d76-842f-44d7b6ec15be" data-visible="true" data-condition="f4aa50d8-f8c4-4573-b3bd-8bdf9f6675d2">courier 1</span>​<span class="pds-conditional-text" id="125a73b2-fe16-4966-bd0c-fc05a10d3b95" data-visible="true" data-condition="0b4f1f5b-e998-496d-8625-1df7914f4e4d">courier 2</span>​<span class="pds-conditional-text" id="40231106-eb29-490c-a60a-822c9e0a60ad" data-visible="true" data-condition="8b342740-6ada-4781-a0df-9ecf8ad38303">courier 3</span>​<span class="pds-conditional-text" id="9dad2442-8c88-4f4c-b19d-bb29d81a9362" data-visible="true" data-condition="2574340a-7373-463b-a954-68bb274e6e8f">courier 4</span>​<span class="pds-conditional-text" id="68fa59d5-6cc0-46f0-a8e6-d89238b5ff29" data-visible="true" data-condition="c2373318-e19b-46bd-8ff6-35987648646a">courier 5</span>​<span class="pds-conditional-text" id="dc2ed81f-ff45-4bca-818e-c6c17fbafa87" data-visible="true" data-condition="056d33f8-7c44-485d-9728-6cf69af0993a">courier 6</span>​<span class="pds-conditional-text" id="e3c25d06-35d1-4510-8724-878ba1b70225" data-visible="true" data-condition="da0e33e1-33ca-431d-8cb0-805d4f82c557">courier 7</span>&ZeroWidthSpace;<span class="pds-conditional-text" id="6725b011-d01a-4489-a1e7-53e533267783" data-visible="true" data-condition="b065c7d4-f486-4ec0-9f42-50442af4120e">technician</span>&ZeroWidthSpace;&ZeroWidthSpace;.&ZeroWidthSpace;&ZeroWidthSpace; &ZeroWidthSpace;<span class="pds-conditional-text" id="28ef3e2d-9197-4455-9e45-6fc11f7cdd23" data-visible="true" data-condition="0ac52b7e-9634-4cf8-9a81-06a983c5b645">You can now track it yourself under the number <span contenteditable="false" class="pds-content-variable" id="d5ad50eb-0cad-4861-84a9-edb87855db5f" data-id="1517" data-format-id="0" data-strict="true">ID</span> at <span contenteditable="false" class="pds-content-variable" id="d2a761c1-59bb-4c10-9b63-bb1de454ec34" data-id="1451" data-format-id="0" data-strict="true">courierID</span> .</span>&ZeroWidthSpace;&ZeroWidthSpace;&ZeroWidthSpace;&nbsp;</p>`
            });
        });

        it('826826 - Placing cursor at the and entering the space key', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, key: ' ', stopPropagation: () => { }, shiftKey: false, which: 32 };
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            keyBoardEvent.which = 32;
            keyBoardEvent.code = 'Space';
            keyBoardEvent.type = 'keydown';
            rteObj.contentModule.getEditPanel().innerHTML = `<p class='focusNode'>Your order nr. <span contenteditable="false" class="pds-content-variable" id="847c7ece-b25a-4467-a0e8-394c1607f8af" data-id="6661" data-format-id="0" data-strict="true">orderNo</span> has been passed to the​​<span class="pds-conditional-text" id="41b565d9-dc61-4d76-842f-44d7b6ec15be" data-visible="true" data-condition="f4aa50d8-f8c4-4573-b3bd-8bdf9f6675d2">courier 1</span>​<span class="pds-conditional-text" id="125a73b2-fe16-4966-bd0c-fc05a10d3b95" data-visible="true" data-condition="0b4f1f5b-e998-496d-8625-1df7914f4e4d">courier 2</span>​<span class="pds-conditional-text" id="40231106-eb29-490c-a60a-822c9e0a60ad" data-visible="true" data-condition="8b342740-6ada-4781-a0df-9ecf8ad38303">courier 3</span>​<span class="pds-conditional-text" id="9dad2442-8c88-4f4c-b19d-bb29d81a9362" data-visible="true" data-condition="2574340a-7373-463b-a954-68bb274e6e8f">courier 4</span>​<span class="pds-conditional-text" id="68fa59d5-6cc0-46f0-a8e6-d89238b5ff29" data-visible="true" data-condition="c2373318-e19b-46bd-8ff6-35987648646a">courier 5</span>​<span class="pds-conditional-text" id="dc2ed81f-ff45-4bca-818e-c6c17fbafa87" data-visible="true" data-condition="056d33f8-7c44-485d-9728-6cf69af0993a">courier 6</span>​<span class="pds-conditional-text" id="e3c25d06-35d1-4510-8724-878ba1b70225" data-visible="true" data-condition="da0e33e1-33ca-431d-8cb0-805d4f82c557">courier 7</span>&ZeroWidthSpace;<span class="pds-conditional-text" id="6725b011-d01a-4489-a1e7-53e533267783" data-visible="true" data-condition="b065c7d4-f486-4ec0-9f42-50442af4120e">technician</span>&ZeroWidthSpace;&ZeroWidthSpace;.&ZeroWidthSpace;&ZeroWidthSpace; &ZeroWidthSpace;<span class="pds-conditional-text" id="28ef3e2d-9197-4455-9e45-6fc11f7cdd23" data-visible="true" data-condition="0ac52b7e-9634-4cf8-9a81-06a983c5b645">You can now track it yourself under the number <span contenteditable="false" class="pds-content-variable" id="d5ad50eb-0cad-4861-84a9-edb87855db5f" data-id="1517" data-format-id="0" data-strict="true">ID</span> at <span contenteditable="false" class="pds-content-variable" id="d2a761c1-59bb-4c10-9b63-bb1de454ec34" data-id="1451" data-format-id="0" data-strict="true">courierID</span> .</span>&ZeroWidthSpace;&ZeroWidthSpace;&ZeroWidthSpace;&nbsp;</p>`;
            let focusNode: HTMLElement = editNode.querySelector('.focusNode')
            let sel1 = new NodeSelection().setSelectionText(document, focusNode.lastChild, focusNode.lastChild, 4, 4);
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === `<p class="focusNode">Your order nr. <span contenteditable="false" class="pds-content-variable" id="847c7ece-b25a-4467-a0e8-394c1607f8af" data-id="6661" data-format-id="0" data-strict="true">orderNo</span> has been passed to the<span class="pds-conditional-text" id="41b565d9-dc61-4d76-842f-44d7b6ec15be" data-visible="true" data-condition="f4aa50d8-f8c4-4573-b3bd-8bdf9f6675d2">courier 1</span><span class="pds-conditional-text" id="125a73b2-fe16-4966-bd0c-fc05a10d3b95" data-visible="true" data-condition="0b4f1f5b-e998-496d-8625-1df7914f4e4d">courier 2</span><span class="pds-conditional-text" id="40231106-eb29-490c-a60a-822c9e0a60ad" data-visible="true" data-condition="8b342740-6ada-4781-a0df-9ecf8ad38303">courier 3</span><span class="pds-conditional-text" id="9dad2442-8c88-4f4c-b19d-bb29d81a9362" data-visible="true" data-condition="2574340a-7373-463b-a954-68bb274e6e8f">courier 4</span><span class="pds-conditional-text" id="68fa59d5-6cc0-46f0-a8e6-d89238b5ff29" data-visible="true" data-condition="c2373318-e19b-46bd-8ff6-35987648646a">courier 5</span><span class="pds-conditional-text" id="dc2ed81f-ff45-4bca-818e-c6c17fbafa87" data-visible="true" data-condition="056d33f8-7c44-485d-9728-6cf69af0993a">courier 6</span><span class="pds-conditional-text" id="e3c25d06-35d1-4510-8724-878ba1b70225" data-visible="true" data-condition="da0e33e1-33ca-431d-8cb0-805d4f82c557">courier 7</span><span class="pds-conditional-text" id="6725b011-d01a-4489-a1e7-53e533267783" data-visible="true" data-condition="b065c7d4-f486-4ec0-9f42-50442af4120e">technician</span>. <span class="pds-conditional-text" id="28ef3e2d-9197-4455-9e45-6fc11f7cdd23" data-visible="true" data-condition="0ac52b7e-9634-4cf8-9a81-06a983c5b645">You can now track it yourself under the number <span contenteditable="false" class="pds-content-variable" id="d5ad50eb-0cad-4861-84a9-edb87855db5f" data-id="1517" data-format-id="0" data-strict="true">ID</span> at <span contenteditable="false" class="pds-content-variable" id="d2a761c1-59bb-4c10-9b63-bb1de454ec34" data-id="1451" data-format-id="0" data-strict="true">courierID</span> .</span>&nbsp;</p>`).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('826826 - Placing cursor at the and entering the space key', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p class='focusNode'>&ZeroWidthSpace;&ZeroWidthSpace;&ZeroWidthSpace;&nbsp;</p>`
            });
        });

        it('826826 - Placing cursor at the start and entering the space key with non width space cotent', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, key: ' ', stopPropagation: () => { }, shiftKey: false, which: 32 };
            let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            keyBoardEvent.which = 32;
            keyBoardEvent.code = 'Space';
            keyBoardEvent.type = 'keydown';
            rteObj.contentModule.getEditPanel().innerHTML = `<p class='focusNode'>&ZeroWidthSpace;&ZeroWidthSpace;&ZeroWidthSpace;&nbsp;</p>`;
            let focusNode: HTMLElement = editNode.querySelector('.focusNode')
            let sel1 = new NodeSelection().setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 0, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === `<p class="focusNode">&nbsp;</p>`).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Removing Image with delete and backspace key', () => {
        let rteObj: RichTextEditor;
        let afterImageDeleteTiggered: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '',
                afterImageDelete: (() => {
                    afterImageDeleteTiggered++;
                })
            });
        });

        it('delete image with Delete key', () => {
            let keyBoardEvent: any = { preventDefault: () => { }, action: 'delete', key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">test</p><p>test2</p></div>`;
            let editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('#img1');
            let curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.which = 46;
            keyBoardEvent.code = 'Delete';
            selectNode.remove();
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj.imageModule as any).deletedImg.push(selectNode);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(1);
        });

        it('delete image with Backspace key', () => {
            afterImageDeleteTiggered = 0;
            let keyBoardEvent: any = { preventDefault: () => { }, action: 'backspace', key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            rteObj.contentModule.getEditPanel().innerHTML = `<div class='actiondiv'><p>test<img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">test</p><p>test2</p></div>`;
            let editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.focus();
            let selectNode: Element = editNode.querySelector('#img1');
            let curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.which = 8;
            keyBoardEvent.code = 'Backspace';
            selectNode.remove();
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj.imageModule as any).deletedImg.push(selectNode);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(afterImageDeleteTiggered).toBe(1);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Toolbar - Print Module', () => {
        describe('Print rendering testing', () => {
            let beforeCount: number = 0;
            let bool: boolean;
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;

            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'Underline', 'Print']
                    },
                    actionComplete: (() => { }),
                    actionBegin: ((args: any) => {
                        bool = args.cancel;
                        beforeCount++;
                    })
                });
                rteEle = rteObj.element;
            });

            it('with cancel is false', () => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[3].getAttribute("title")).toBe("Print");
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                trgEle.click();
                expect(beforeCount).toBe(1);
                expect(bool).toBe(false);
                expect(beforeCount).toBe(1);
            });

            afterAll(() => {
                destroy(rteObj);
            });
        });

        describe('Print rendering testing', () => {
            let beforeCount: number = 0;
            let afterCount: number = 0;
            let bool: boolean;
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;

            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'Underline', 'Print']
                    },
                    actionComplete: (() => {
                        afterCount++;
                    }),
                    actionBegin: ((args) => {
                        args.cancel = true;
                        bool = args.cancel;
                        beforeCount++;
                    })
                });
                rteEle = rteObj.element;
            });

            it('with cancel value as true', () => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[3].getAttribute("title")).toBe("Print");
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                trgEle.click();
                expect(beforeCount).toBe(1);
                expect(bool).toBe(true);
                expect(afterCount).toBe(0);
            });

            afterAll(() => {
                destroy(rteObj);
            });
        });
    });

    describe('actionBegin and actionComplete testing', () => {
        let beforeCount: boolean = false;
        let afterCount: boolean = false;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let selectNode: Element;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'Print']
                },
                value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
                actionComplete: ((args) => {
                    afterCount = true;
                }),
                actionBegin: ((args: any) => {
                    if (args.originalEvent && args.originalEvent.action == 'paste' && args.originalEvent.pastePrevent) {
                        args.cancel = true;
                    }
                    beforeCount = true;
                })
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
        });

        it(' does not trigger the actionBegin and actionComplete while type the character', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.which = 64;
            keyBoardEvent.keyCode = 64;
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(false);
            expect(afterCount).toBe(false);
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in unordered-list', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "unordered-list";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in ordered-list', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "ordered-list";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in undo', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "undo";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in redo', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "redo";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in copy', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "copy";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in cut', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "cut";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in paste', (done) => {
            keyBoardEvent.clipboardData = {
                getData: (e: any) => {
                    if (e === "text/plain") {
                        return 'Hi syncfusion website https://ej2.syncfusion.com is here with another URL https://ej2.syncfusion.com text after second URL';
                    } else {
                        return '';
                    }
                },
                items: []
            };
            rteObj.pasteCleanupSettings.prompt = false;
            rteObj.pasteCleanupSettings.plainText = false;
            rteObj.pasteCleanupSettings.keepFormat = true;
            rteObj.dataBind();
            (rteObj as any).inputElement.focus();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            rteObj.onPaste(keyBoardEvent);
            setTimeout(() => {
                let allElem: any = (rteObj as any).inputElement.firstElementChild;
                expect(allElem.children[0].childNodes[0].childNodes[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
                expect(allElem.children[0].childNodes[0].childNodes[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
                let expected: boolean = false;
                let expectedElem: string = `<ol><li class="first-p"><span>Hi syncfusion website <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target="_blank" aria-label="Open in new window">https://ej2.syncfusion.com </a>is here with another URL <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target="_blank" aria-label="Open in new window">https://ej2.syncfusion.com </a>text after second URL</span>First p node-0</li></ol><p class="second-p">First p node-1</p>`;
                if (allElem.innerHTML === expectedElem) {
                    expected = true;
                }
                expect(expected).toBe(true);
                expect(beforeCount).toBe(true);
                expect(afterCount).toBe(true);
                afterCount = false;
                beforeCount = false;
                done();
            }, 100);
        });

        it(' trigger the actionBegin and args.cancel for actionComplete while pressing the action key in paste', (done) => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "paste";
            keyBoardEvent.pastePrevent = true;
            (rteObj as any).onPaste(keyBoardEvent); // Change the event from keydown to paste 
            setTimeout(() => {
                expect(beforeCount).toBe(true);
                expect(afterCount).toBe(false);
                afterCount = false;
                beforeCount = false;
                done();
            }, 10);
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in bold', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.action = "bold";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in italic', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "italic";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in underline', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "underline";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in strikethrough', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "strikethrough";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in uppercase', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "uppercase";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in lowercase', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "lowercase";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in superscript', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "superscript";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in subscript', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "subscript";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in indents', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "indents";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });


        it(' trigger the actionBegin and actionComplete while pressing the action key in outdents', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "outdents";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in html-source', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "html-source";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in full-screen', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "full-screen";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-center', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-center";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-full', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-full";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-left', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-left";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-right', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-right";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in cut', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "cut";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in copy', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "copy";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in paste', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "paste";
            (rteObj as any).onPaste(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(false);
            afterCount = false;
            beforeCount = false;
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('OrderedListAction actionBegin and actionComplete testing', () => {
        let beforeCount: boolean = false;
        let afterCount: boolean = false;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let selectNode: any;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>1.</p>`,
                actionComplete: ((args) => {
                    afterCount = true;
                }),
                actionBegin: ((args: any) => {
                    beforeCount = true;
                })
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
        });

        it(' List creation with number 1. and space action', () => {
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 2);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
        });
        it(' List creation with number a. and space action', () => {
            rteObj.value = 'a.';
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 2);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
        });
        it(' List creation with number i. and space action', () => {
            rteObj.value = 'i.';
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 2);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('UnOrderedListAction actionBegin and actionComplete testing', () => {
        let beforeCount: boolean = false;
        let afterCount: boolean = false;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let selectNode: any;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>*</p>`,
                actionComplete: ((args) => {
                    afterCount = true;
                }),
                actionBegin: ((args: any) => {
                    beforeCount = true;
                })
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
        });

        it(' List creation with number * and space action', () => {
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 1);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
        });
        it(' List creation with number - and space action', () => {
            rteObj.value = '-';
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 1);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Ordered and undorderedList Action prevention', () => {
        let beforeCount: boolean = false;
        let afterCount: boolean = false;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let selectNode: any;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>1.</p>`,
                actionComplete: ((args) => {
                    afterCount = true;
                }),
                actionBegin: ((args: any) => {
                    args.cancel = true;
                    beforeCount = true;
                    afterCount = false;
                })
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
        });

        it(' List creation with number 1. and action prevented', () => {
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 2);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(false);
        });
        it(' List creation with * and action prevented', () => {
            rteObj.value = '*';
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.children[0].firstChild;
            setCursorPoint(curDocument, selectNode, 1);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(false);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('div with inner element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`
            });
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        it('check name attribute in textarea', () => {
            expect((rteObj as any).inputElement.getAttribute('name') === 'RTEName').not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE text area', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            elem = document.createElement('textarea');
            elem.innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`;
            elem.id = 'textAreaRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({});
            rteObj.appendTo("#textAreaRTE");
        });

        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.classList.contains('e-rte-hidden')).toBe(true);
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(elem);
        });
    });
    describe('RTE text area - value property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('textarea');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                value: ` <p><b>Description:</b></p>
                    <p>The Rich Text Editor (RTE) control is an easy to render in
                    client side. Customer easy to edit the contents and get the HTML content for
                    the displayed content. A rich text editor control provides users with a toolbar
                    that helps them to apply rich text formats to the text entered in the text
                    area. </p>
                    <p><b>Functional
                    Specifications/Requirements:</b></p>
                    <ol><li><p>Provide
                    the tool bar support, it’s also customizable.</p></li><li><p>Options
                    to get the HTML elements with styles.</p></li><li><p>Support
                    to insert image from a defined path.</p></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                    the editor support.</p></li><li><p>Provide
                    efficient public methods and client side events.</p></li><li><p>Keyboard
                    navigation support.</p></li></ol>`,
                created: function (args: any) {
                    done();
                }
            });
            rteObj.appendTo("#defaultRTE");
        });

        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.classList.contains('e-rte-hidden')).toBe(true);
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(elem);
        });
    });
    describe('RTE without iframe - value property', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                    <p>The Rich Text Editor (RTE) control is an easy to render in
                    client side. Customer easy to edit the contents and get the HTML content for
                    the displayed content. A rich text editor control provides users with a toolbar
                    that helps them to apply rich text formats to the text entered in the text
                    area. </p>
                    <p><b>Functional
                    Specifications/Requirements:</b></p>
                    <ol><li><p>Provide
                    the tool bar support, it’s also customizable.</p></li><li><p>Options
                    to get the HTML elements with styles.</p></li><li><p>Support
                    to insert image from a defined path.</p></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                    the editor support.</p></li><li><p>Provide
                    efficient public methods and client side events.</p></li><li><p>Keyboard
                    navigation support.</p></li></ol>`,
            });
            done();
        });
        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.classList.contains('e-rte-hidden')).toBe(true);
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE iframe - value property', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                    <p>The Rich Text Editor (RTE) control is an easy to render in
                    client side. Customer easy to edit the contents and get the HTML content for
                    the displayed content. A rich text editor control provides users with a toolbar
                    that helps them to apply rich text formats to the text entered in the text
                    area. </p>
                    <p><b>Functional
                    Specifications/Requirements:</b></p>
                    <ol><li><p>Provide
                    the tool bar support, it’s also customizable.</p></li><li><p>Options
                    to get the HTML elements with styles.</p></li><li><p>Support
                    to insert image from a defined path.</p></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                    the editor support.</p></li><li><p>Provide
                    efficient public methods and client side events.</p></li><li><p>Keyboard
                    navigation support.</p></li></ol>`,
                iframeSettings: {
                    enable: true
                }
            });
            done();
        });
        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.classList.contains('e-rte-hidden')).toBe(true);
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE - Public Methods', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: '<p> adsafasdfsd <span> fdsfds </span></p>'
            });
            done();
        });
        it('focus method', () => {
            rteObj.focusIn();
            expect(document.activeElement.classList.contains('e-content')).toBe(true);
            rteObj.focusOut();
        });
        it('focus method in disable state', () => {
            rteObj.enabled = false;
            rteObj.dataBind();
            rteObj.focusIn();
            expect(document.activeElement.classList.contains('e-content')).toBe(false);
            rteObj.enabled = true;
            rteObj.dataBind();
            rteObj.focusIn();
        });

        it('blur method', () => {
            rteObj.focusOut();
            expect(document.activeElement.classList.contains('e-content')).toBe(false);
        });
        it('getHtml method', () => {
            expect(rteObj.getHtml()).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        it('refresh method', () => {
            rteObj.refresh();
            expect(rteObj.value).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        it('showFullScreen method', () => {
            rteObj.showFullScreen();
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
        });
        it('showSourceCode method', () => {
            rteObj.showSourceCode();
            let ele: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(ele.value).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE - getXHTML Public Methods', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                enableXhtml: true,
                value: `<head><base href="https://www.w3schools.com/" target="_blank"></head><p><b>Description: with space</b></p><br><p>hello</p><hr><p>hey</p><br/><p>Are you fine</p><img src="workplace.jpg" alt="Workplace" usemap="#workmap" width="400" height="379"><area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm"><base href="https://www.w3schools.com/" target="_blank"><embed type="image/jpg" src="pic_trulli.jpg" width="300" height="200"><input type="submit" value="Submit"><link rel="stylesheet" href="styles.css"><object title = "Test Object." classid = "java.class"><param name = "audio" value = "music.wav" /><param name = "width" value = "600" /><param name = "height" value = "400" /></object><video width="320" height="240" controls><source src="forrest_gump.mp4" type="video/mp4"><source src="forrest_gump.ogg" type="video/ogg"><track src="fgsubtitles_en.vtt" kind="subtitles" srclang="en" label="English"><track src="fgsubtitles_no.vtt" kind="subtitles" srclang="no" label="Norwegian"></video><p>This is a veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryvery<wbr>longwordthatwillbreakatspecific<wbr>placeswhenthebrowserwindowisresized.</p><table><colgroup><col span="2" style="background-color:red"><col style="background-color:yellow"></colgroup><tr><th>ISBN</th><th>Title</th><th>Price</th></tr><tr><td>3476896</td><td>My first HTML</td><td>$53</td></tr></table>`
            });
            done();
        });
        it('getHtml method', () => {
            expect(rteObj.getXhtml()).toBe(`<base href="https://www.w3schools.com/" /><p><b>Description: with space</b></p><p><br/></p><p>hello</p><hr/><p>hey</p><p><br/></p><p>Are you fine</p><p><img src="workplace.jpg" alt="Workplace" usemap="#workmap" width="400" height="379" class="e-rte-image e-imginline" /></p><area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm" /><base href="https://www.w3schools.com/" /><p><embed type="image/jpg" src="pic_trulli.jpg" width="300" height="200" /><input type="submit" value="Submit" /></p><link rel="stylesheet" href="styles.css" /><p><object title="Test Object." classid="java.class"><param name="audio" value="music.wav" /><param name="width" value="600" /><param name="height" value="400" /></object><video width="320" height="240" controls=""><source src="forrest_gump.mp4" type="video/mp4" /><source src="forrest_gump.ogg" type="video/ogg" /><track src="fgsubtitles_en.vtt" kind="subtitles" srclang="en" label="English" /><track src="fgsubtitles_no.vtt" kind="subtitles" srclang="no" label="Norwegian" /></video></p><p>This is a veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryvery<wbr />longwordthatwillbreakatspecific<wbr />placeswhenthebrowserwindowisresized.</p><table><colgroup><col span="2" style="background-color:red" /><col style="background-color:yellow" /></colgroup><tbody><tr><th>ISBN</th><th>Title</th><th>Price</th></tr><tr><td>3476896</td><td>My first HTML</td><td>$53</td></tr></tbody></table>`);
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('RTE - xhtml enabled and attribute - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                enableXhtml: true,
                value: `<p>ik ben een verhaal tje over <span contenteditable="false" class="e-mention-chip"><a id="19062C5E" title="Bruin">@Mila  Hendriksma</a></span>  en dat lijkt tot nu toe prima te gaan . <span contenteditable="false" class="e-mention-chip"><a id="09340DCE" title="Groen">@Shirley  Andela</a></span>  kwam ook nog even langs. <br/></p><p><br/></p>`
            });
            done();
        });
        it('checking when being added in the editor', () => {
            let expectedValue: string = `<p>ik ben een verhaal tje over <span contenteditable="false" class="e-mention-chip"><a id="19062C5E" title="Bruin">@Mila  Hendriksma</a></span>  en dat lijkt tot nu toe prima te gaan . <span contenteditable="false" class="e-mention-chip"><a id="09340DCE" title="Groen">@Shirley  Andela</a></span>  kwam ook nog even langs. <br/></p><p><br/></p>`;
            expect(rteObj.value === expectedValue).toBe(true);
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('RTE - getHtml Public Methods', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                enableXhtml: true
            });
            done();
        });
        it('getHtml method when xhtml is enabled and RTE is empty', () => {
            expect(rteObj.getHtml()).toBe(null);
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe("enable/disable ToolbarItem public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            rteObj.enableToolbarItem(["Italic", "Bold"]);
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Single item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
        });

        it("Array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
        });

        it("Different order of array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem(["Italic", "Bold"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem(["Italic", "Bold"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
        });
    });

    describe("removeToolbarItem public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Single item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.removeToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Underline") > 0).toBe(true);
        });

        it("Array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            rteObj.removeToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).not.toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild).toBe(null);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Underline") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-separator")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[3].firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
        });

        it("Different order with array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            rteObj.removeToolbarItem(["Undo", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].classList.contains("e-separator")).toBe(true);
        });
    });

    describe("Toolbar module addTBarItem private method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("addTBarItem method testing with text as empty string", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.toolbarModule.addTBarItem({ updateItem: 'Undo', targetItem: 'Undo', baseToolbar: rteObj.getBaseToolbarObject() }, 0);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-tbar-btn-text").length).toBe(0);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
        });
    });

    describe('EJ2-59865 - CSS class property', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                cssClass: 'myClass',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|',
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                }
            });
            done();
        });
        it('Ensure cssClass property for dropdownpopup', () => {
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            for (let i: number = 0; i < allDropDownPopups.length; i++) {
                //expect(allDropDownPopups[i].classList.contains('myClass')).toBe(true);
            }
        });
        it('change cssClass property dropdownpopup', () => {
            rteObj.cssClass = 'textClass';
            rteObj.dataBind();
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            for (let i: number = 0; i < allDropDownPopups.length; i++) {
                // expect(allDropDownPopups[i].classList.contains('textClass')).toBe(true);
                // expect(allDropDownPopups[i].classList.contains('myClass')).toBe(false);
            }
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('EJ2-59865 - CSS class property in Inline toolbar', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                cssClass: 'myClass',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|',
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                },
                inlineMode: {
                    enable: true,
                    onSelection: true
                }
            });
            done();
        });
        it('Ensure cssClass property in inline toolbar', (done) => {
            rteObj.value = '<p>RTE sample content</p><p id="p2">This is a sample content used in the RTE test cases</p><ol><li>list samples</li></ol>';
            rteObj.inlineMode.enable = true;
            rteObj.dataBind();
            let start = rteObj.inputElement.querySelector('#p2');
            setCursorPoint(document, start.childNodes[0] as Element, 5);
            rteObj.showInlineToolbar();
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
            expect(document.querySelector('.e-rte-quick-toolbar').classList.contains('myClass')).toBe(true);
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            for (let i: number = 0; i < allDropDownPopups.length; i++) {
                setTimeout(() => {
                    expect(allDropDownPopups[i].classList.contains('myClass')).toBe(true);
                    done();
                }, 100);
            }
            rteObj.hideInlineToolbar();
        });
        it('through onproperty change cssClass property in inline toolbar', (done) => {
            rteObj.hideInlineToolbar();
            rteObj.cssClass = 'textClass';
            rteObj.value = '<p>RTE sample content</p><p id="p2">This is a sample content used in the RTE test cases</p><ol><li>list samples</li></ol>';
            rteObj.inlineMode.enable = true;
            rteObj.dataBind();
            let start = rteObj.inputElement.querySelector('#p2');
            setCursorPoint(document, start.childNodes[0] as Element, 5);
            rteObj.showInlineToolbar();
            expect(document.querySelector('.e-rte-quick-toolbar').classList.contains('textClass')).toBe(true);
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            for (let i: number = 0; i < allDropDownPopups.length; i++) {
                setTimeout(() => {
                    expect(allDropDownPopups[i].classList.contains('textClass')).toBe(true);
                    expect(allDropDownPopups[i].classList.contains('myClass')).toBe(false);
                    done();
                }, 100);
            }
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe('RTE Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let toolWrap: HTMLElement;
        let view: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE'
            });
            elem = rteObj.element;
            toolWrap = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_wrapper');
            view = rteObj.element.querySelector('#' + rteObj.element.id + 'rte-view');
            done();
        });
        it('Ensure Width property', () => {
            expect(rteObj.element.style.width).toBe('400px');
        });
        it('Ensure height property', () => {
            expect(rteObj.element.style.height).toBe('200px');
        });
        it('through onproperty change widht property', () => {
            rteObj.width = '600px';
            rteObj.dataBind();
            expect(rteObj.element.style.width).toBe('600px');
        });
        it('through onproperty change height property', () => {
            rteObj.height = '600px';
            rteObj.dataBind();
            expect(rteObj.element.style.height).toBe('600px');
            let currentToolWrap: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_wrapper');
            let currentView: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + 'rte-view');
            expect(toolWrap.style.height === currentToolWrap.style.height).toBe(true);
            expect(view.style.height === currentView.style.height).toBe(true);
        });
        it('Ensure readonly property', () => {
            let contentEle: HTMLElement = rteObj.element.querySelector(".e-content");
            expect(contentEle.getAttribute('contenteditable')).toBe('false');
            expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(true);
        });
        it('through onproperty change readOnly property', () => {
            rteObj.readonly = false;
            rteObj.dataBind();
            let contentEle: HTMLElement = rteObj.element.querySelector(".e-content");
            expect(contentEle.getAttribute('contenteditable')).toBe('true');
        });
        it('Ensure cssClass property', () => {
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
        });
        it('Ensure placeholderClassName', () => {
            expect(rteObj.element.getElementsByClassName("e-rte-placeholder").length > 0).toBe(true);
        });
        it('through onproperty change cssClass property', () => {
            rteObj.cssClass = 'textClass';
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('textClass')).toBe(true);
            expect(rteObj.element.classList.contains('myClass')).toBe(false);
        });
        it('Ensure enabled property', () => {
            expect(rteObj.element.classList.contains('e-disabled')).toBe(false);
        });
        it('through onproperty change enabled property', () => {
            rteObj.enabled = false;
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-disabled')).toBe(true);
            expect(rteObj.element.classList.contains('e-rte-readonly')).not.toBe(true);
        });
        it('Ensure enableRTL property', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(true);
        });
        it('ensure through onproperty change - enableRTL', () => {
            rteObj.enableRtl = false;
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-rtl')).toBe(false);
        });
        it('Ensure Locale property', () => {
            let rteEle: HTMLElement = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("fett");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("kursiv");
        });
        it('ensure through onproperty change - Locale property', () => {
            rteObj.locale = 'en-US';
            rteObj.dataBind();
            let rteEle: HTMLElement = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Italic (Ctrl+I)");
        });
        it('Ensure placeholder property', () => {
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
        });
        it('ensure placeholder when backspace key is pressed(with exact enter key content added)', () => {
            rteObj.placeholder = 'write content';
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('write content');
            rteObj.value = '<p><br></p>';
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
        });
        it('ensure placeholder when enter key is pressed', () => {
            rteObj.placeholder = 'write content';
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('write content');
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.keyCode = 13;
            (rteObj as any).keyUp(keyboardEventArgs);
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
        });
        it('ensure through onproperty change - placeholder', () => {
            rteObj.placeholder = 'changed';
            rteObj.value = '<p> jadskfasfese <p>';
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(false);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - value', () => {
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - value', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE',
                value: '<p>test</p>'
            });
            elem = rteObj.element;
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(false);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - valueTemplate', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE',
                valueTemplate: '<p>test</p>'
            });
            elem = rteObj.element;
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(false);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure placeholder on execute command', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                placeholder: 'type something'
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(true);
            rteObj.executeCommand('insertHTML', 'inserted an html');
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(false);
        });
        it('929762 - Placeholder is shown when extra spaces are still available in the Rich Text Editor', () => {
            rteObj.placeholder = 'Enter something';
            rteObj.dataBind();
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('Enter something');
            rteObj.value = '<p><br><br></p>';
            rteObj.dataBind();
            expect(((rteObj as any).placeHolderWrapper as HTMLElement).classList.contains('enabled')).toBe(false);
        });
        it('ensure insert image on execute command', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            let el = document.createElement("img");
            el.src = "https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png";
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand("insertImage", el);
            expect((rteObj as any).inputElement.querySelector('img').src).toBe('https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png');
        });

        it('ensure insert video using execute command', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            let el = document.createElement("video");
            el.innerHTML = `<source src = "https://www.w3schools.com/html/movie.mp4"> <source src="https://www.w3schools.com/html/movie.ogg" type="video/ogg">Your browser does not support the video tag.`;
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand("insertVideo", el);
            expect((rteObj as any).inputElement.querySelectorAll('video').length).toBe(1);
        });

        it('ensure insert audio using execute command', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            let el = document.createElement("video");
            el.innerHTML = `<source src="horse.ogg" type="audio/ogg"><source src="horse.mp3" type="audio/mpeg">Your browser does not support the audio tag.`;
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand("insertAudio", el);
            expect((rteObj as any).inputElement.querySelectorAll('audio').length).toBe(1);
        });

        it('EJ2-59978 - Insert image after Max char count - Execute Command Module', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: '<p class="focusNode">RTE Content with RTE</p>',
                maxLength: 20,
                showCharCount: true
            });

            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(curDocument, focusNode, focusNode, 0, 0);
            let el = document.createElement("img");
            el.src = "https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png";
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand("insertImage", el);
            expect(rteObj.inputElement.querySelectorAll('img').length === 0).toBe(true);
        });


        it('ensure insert image on execute command with arguments', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand('insertImage', {
                url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png',
                cssClass: 'testingClass',
                width: { minWidth: '200px', maxWidth: '200px', width: 180 },
                height: { minHeight: '200px', maxHeight: '600px', height: 500 },
                altText: 'testing image'
            });
            let imgElem: HTMLElement = (rteObj as any).inputElement.querySelector('img');
            expect(imgElem.getAttribute('src')).toBe('https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png');
            expect(imgElem.classList.contains('testingClass')).toBe(true);
            expect(imgElem.getAttribute('alt') === 'testing image').toBe(true);
            expect(imgElem.getAttribute('width') === '180px').toBe(true);
            expect(imgElem.getAttribute('height') === '500px').toBe(true);
            expect(imgElem.getAttribute('style')).toBe('min-width: 200px; max-width: 200px; min-height: 200px; max-height: 600px;');
        });

        it('ensure edit image on execute command with arguments', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: `<p>This is a image <p><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image testingClass" alt="testing image" width="180px" height="500px" style="min-width: 200px; max-width: 200px; min-height: 200px; max-height: 600px;">`
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            (rteObj as any).inputElement.focus();
            let editImg: HTMLElement = rteObj.inputElement.querySelector('img');
            expect(editImg.getAttribute('src')).toBe('https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png');
            expect(editImg.classList.contains('testingClass')).toBe(true);
            expect(editImg.getAttribute('alt') === 'testing image').toBe(true);
            expect(editImg.getAttribute('width') === '180px').toBe(true);
            expect(editImg.getAttribute('height') === '500px').toBe(true);
            expect(editImg.getAttribute('style')).toBe('min-width: 200px; max-width: 200px; min-height: 200px; max-height: 600px;');
            rteObj.executeCommand('editImage', {
                cssClass: 'editClass',
                width: { minWidth: '100px', maxWidth: '300px', width: 250 },
                height: { minHeight: '100px', maxHeight: '700px', height: 400 },
                altText: 'editing alt image',
                selectParent: [editImg]
            });
            let imgElem: HTMLElement = (rteObj as any).inputElement.querySelector('img');
            expect(imgElem.getAttribute('src')).toBe('https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png');
            expect(imgElem.classList.contains('editClass')).toBe(true);
            expect(imgElem.getAttribute('alt') === 'editing alt image').toBe(true);
            expect(imgElem.getAttribute('width') === '250px').toBe(true);
            expect(imgElem.getAttribute('height') === '400px').toBe(true);
            expect(imgElem.getAttribute('style')).toBe('min-width: 100px; max-width: 300px; min-height: 100px; max-height: 700px;');
        });

        it('ensure insert table on execute command with all the arguments', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            rteObj.executeCommand('insertTable', {
                rows: 2,
                columns: 5,
                width: { minWidth: '20px', maxWidth: '100px', width: 40 },
                selection: saveSelection
            } as ITableCommandsArgs);
            expect((rteObj as any).inputElement.querySelector('table')).not.toBe(null);
            expect((rteObj as any).inputElement.querySelectorAll('tr').length).toBe(2);
            expect((rteObj as any).inputElement.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(5);
            expect((rteObj as any).inputElement.querySelector('table').getAttribute('style')).toBe('width: 40px; min-width: 20px; max-width: 100px;');
        });

        it('EJ2-59978 - Insert table after Max char count - Execute Command Module', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: '<p class="focusNode">RTE Content with RTE</p>',
                maxLength: 20,
                showCharCount: true
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(curDocument, focusNode, focusNode, 0, 0);
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            rteObj.executeCommand('insertTable', {
                rows: 2,
                columns: 5,
                width: { minWidth: '20px', maxWidth: '100px', width: 40 },
                selection: saveSelection
            } as ITableCommandsArgs);
            expect((rteObj as any).inputElement.querySelector('table')).toBe(null);
        });

        it('ensure create link on execute command with all the arguments', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            rteObj.executeCommand('createLink', {
                url: 'https://www.facebook.com',
                title: 'facebook',
                selection: saveSelection,
                text: 'hello this is facebook link',
                target: '_self'
            });
            let linkElm: HTMLElement = rteObj.inputElement.querySelector('a');
            expect(linkElm).not.toBe(null);
            expect(linkElm.getAttribute('href')).toBe('https://www.facebook.com');
            expect(linkElm.getAttribute('title')).toBe('facebook');
            expect(linkElm.getAttribute('target')).toBe('_self');
            expect(linkElm.innerText).toBe('hello this is facebook link');
        });

        it('853715 - White Spaces are not included in display text while inserting link in RichTextEditor', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
            (rteObj as any).inputElement.focus();
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            rteObj.executeCommand('createLink', {
                url: 'https://www.facebook.com',
                title: 'facebook',
                selection: saveSelection,
                text: 'text text   text   ',
                target: '_self'
            });
            let linkElm: HTMLElement = rteObj.inputElement.querySelector('a');
            expect(linkElm).not.toBe(null);
            expect(linkElm.getAttribute('href')).toBe('https://www.facebook.com');
            expect(linkElm.getAttribute('title')).toBe('facebook');
            expect(linkElm.getAttribute('target')).toBe('_self');
            expect(linkElm.innerHTML).toBe('text text&nbsp;&nbsp;&nbsp;text&nbsp;&nbsp;&nbsp;');
        });

        it('EJ2-59978 - Insert link after Max char count - Execute Command Module', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: '<p class="focusNode">RTE Content with RTE</p>',
                maxLength: 20,
                showCharCount: true
            });
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(curDocument, focusNode, focusNode, 0, 0);
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            rteObj.executeCommand('createLink', {
                url: 'https://www.facebook.com',
                title: 'facebook',
                selection: saveSelection,
                text: 'hello this is facebook link',
                target: '_self'
            });
            let linkElm: HTMLElement = rteObj.inputElement.querySelector('a');
            expect(linkElm).toBe(null);
        });

        it('ensure edit link on execute command with all the arguments', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: `<p>This is link <a class="e-rte-anchor" href="https://www.facebook.com" title="facebook" target="_self">hello this is facebook link</a></p>`
            });
            (rteObj as any).inputElement.focus();
            let selection: NodeSelection = new NodeSelection();
            let range: Range;
            let saveSelection: NodeSelection;
            range = selection.getRange(document);
            saveSelection = selection.save(range, document);
            let linkElm: HTMLElement = rteObj.inputElement.querySelector('a');
            expect(linkElm).not.toBe(null);
            expect(linkElm.getAttribute('href')).toBe('https://www.facebook.com');
            expect(linkElm.getAttribute('title')).toBe('facebook');
            expect(linkElm.getAttribute('target')).toBe('_self');
            expect(linkElm.innerText).toBe('hello this is facebook link');
            rteObj.executeCommand('editLink', {
                url: 'https://www.google.com',
                title: 'google',
                selection: saveSelection,
                text: 'hello this is google link',
                selectParent: [linkElm]
            });
            let editElm: HTMLElement = rteObj.inputElement.querySelector('a');
            expect(editElm).not.toBe(null);
            expect(editElm.getAttribute('href')).toBe('https://www.google.com');
            expect(editElm.getAttribute('title')).toBe('google');
            expect(editElm.getAttribute('target')).toBe(null);
            expect(editElm.innerText).toBe('hello this is google link');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Inserting image after the Inline node testing for RTE elements', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let toolWrap: HTMLElement;
        let view: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
            elem = rteObj.element;
            toolWrap = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_wrapper');
            view = rteObj.element.querySelector('#' + rteObj.element.id + 'rte-view');
            done();
        });
        it('Inserting image after hr tags', () => {
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand("insertHTML", "<hr>");
            rteObj.executeCommand('insertImage', {
                url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png',
                cssClass: 'testingClass',
                width: { minWidth: '200px', maxWidth: '200px', width: 180 },
                height: { minHeight: '200px', maxHeight: '600px', height: 500 },
                altText: 'testing image'
            });
            expect((rteObj.contentModule.getEditPanel() as any).childNodes[0].tagName).toBe('HR');
            expect((rteObj.contentModule.getEditPanel() as any).childNodes[1].firstElementChild.tagName).toBe('IMG');
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe('RTE enablePersistence Properties', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                    <p>The Rich Text Editor (RTE) control is an easy to render in
                    client side. Customer easy to edit the contents and get the HTML content for
                    the displayed content. A rich text editor control provides users with a toolbar
                    that helps them to apply rich text formats to the text entered in the text
                    area. </p>
                    <p><b>Functional
                    Specifications/Requirements:</b></p>
                    <ol><li><p>Provide
                    the tool bar support, it’s also customizable.</p></li><li><p>Options
                    to get the HTML elements with styles.</p></li><li><p>Support
                    to insert image from a defined path.</p></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                    the editor support.</p></li><li><p>Provide
                    efficient public methods and client side events.</p></li><li><p>Keyboard
                    navigation support.</p></li></ol>`,
            });
            done();
        });
        it('Ensure enablePersistence property', () => {
            rteObj.refresh();
            expect(rteObj.value).not.toBe(null);
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('RTE enablePersistence Properties in textarea mode', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement;
        beforeAll((done: Function) => {
            element = createElement('div', {
                id: "Wrapper", innerHTML: `<textarea id="defaultRTE_28695"></textarea>`
            });
            document.body.appendChild(element);
            done();
        });
        it('Ensure enablePersistence property', () => {
            rteObj = new RichTextEditor({
                placeholder: 'Type something',
                enablePersistence: true,
                value: "<p>Richtexteditor</p>"
            });
            rteObj.appendTo('#defaultRTE_28695');
            window.localStorage.setItem("value", "<p>Richtexteditor</p>");
            expect(rteObj.value).toBe(window.localStorage.getItem("value"));
            window.localStorage.removeItem("value");
            rteObj.value = "<p>Richtexteditor value updated</p>";
            rteObj.dataBind();
            window.localStorage.setItem("value", "<p>Richtexteditor value updated</p>");
            expect(rteObj.value).toBe(window.localStorage.getItem("value"));
            window.localStorage.removeItem("value");
            rteObj.enablePersistence = false;
            rteObj.dataBind();
        });
        afterAll((done) => {
            destroy(rteObj);
            detach(element);
            done();
        });
    });

    describe('RTE htmlAttributes Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                width: 'auto',
                value: ` <p><b>Description:</b></p>
                    <p>The Rich Text Editor (RTE) control is an easy to render in
                    client side. Customer easy to edit the contents and get the HTML content for
                    the displayed content. A rich text editor control provides users with a toolbar
                    that helps them to apply rich text formats to the text entered in the text
                    area. </p>
                    <p><b>Functional
                    Specifications/Requirements:</b></p>
                    <ol><li><p>Provide
                    the tool bar support, it’s also customizable.</p></li><li><p>Options
                    to get the HTML elements with styles.</p></li><li><p>Support
                    to insert image from a defined path.</p></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                    the editor support.</p></li><li><p>Provide
                    efficient public methods and client side events.</p></li><li><p>Keyboard
                    navigation support.</p></li></ol>`,
                created: function (args: any) {
                    done();
                },
                htmlAttributes: {
                    class: 'myClass', title: 'RTE', disabled: 'disabled',
                    placeholder: 'typesomething', readonly: 'readonly', style: 'width:200px', name: 'rte-sample'
                },
            });
            rteObj.appendTo("#defaultRTE");
        });
        it('Ensure htmlAttributes property', () => {
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
            expect(rteObj.element.title).toBe('RTE');
        });
        it('ensure through onproperty change - htmlAttributes', () => {
            rteObj.htmlAttributes = { class: 'e-testing' };
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-testing')).toBe(true);
            expect(rteObj.element.title).toBe('RTE');
        });
        afterAll((done) => {
            destroy(rteObj);
            detach(elem);
            done();
        });
    });
    describe('RTE IFRame htmlAttributes Properties', () => {
        let rteObj: RichTextEditor;
        let iframe: HTMLDocument;
        let iframeHeader: HTMLHeadElement;
        let iframeBody: HTMLBodyElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    attributes: {
                        class: 'myClass', title: 'RTE', disabled: 'disabled',
                        placeholder: 'typesomething', readonly: 'readonly', style: 'width:200px', name: 'rte-sample'
                    },
                    resources: {
                        scripts: ['../mytext.js'],
                        styles: ['../myText.css']
                    }
                }
            });
            done();
        });
        it('Ensure IFrame htmlAttributes property', () => {
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeBody = iframe.querySelector('body');
            expect(iframeBody.classList.contains('myClass')).toBe(true);
            expect(iframeBody.title).toBe('RTE');
        });
        it('Iframe resource', () => {
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeHeader = iframe.querySelector('head');
            let scriptSheet: HTMLScriptElement = iframeHeader.querySelector('script');
            expect(scriptSheet.src.search('mytext.js')).not.toBe(-1);
            let styleSheet: HTMLLinkElement = iframeHeader.querySelector('link');
            expect(styleSheet.href.search('myText.css')).not.toBe(-1);

        });
        it('Iframe resource - onproperty change', () => {
            rteObj.iframeSettings = {
                attributes: {
                    class: 'myClass2'
                },
                resources: {
                    scripts: ['../mytext1.js'],
                    styles: ['../myText2.css']
                }
            };
            rteObj.dataBind();
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeHeader = iframe.querySelector('head');
            let scriptSheet: HTMLScriptElement = iframeHeader.querySelector('script');
            expect(scriptSheet.src.search('mytext1.js')).not.toBe(-1);
            iframeBody = iframe.querySelector('body');
            expect(iframeBody.classList.contains('myClass2')).toBe(true);

        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('RTE shortcut key - HTML', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: Element;
        let editNode: HTMLElement;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({ height: 200 });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('insert-image: ctrl+shift+i', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-image';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).toBeNull();
        });
        it('insert-link: ctrl+k', () => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-link';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).not.toBeNull();
            (document.querySelector('.e-rte-linkurl') as any).value = 'http://data';
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).toBeNull();
        });

        it('insert-link: ctrl+k', () => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            let sel = new NodeSelection().setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 1, 5);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.code = 'KeyK';
            keyBoardEvent.action = 'insert-link';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).toBeNull();
        });

        it('indents: ctrl+]', () => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'indents';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.marginLeft === '20px').toBe(true);
        });

        it('outdents: ctrl+[', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'outdents';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.marginLeft === '0px').toBe(true);
        });

        it('full-screen: ctrl+shift+f', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'full-screen';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(true);
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(false);
        });

        it('justify-center: ctrl+e', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-center';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'center').toBe(true);
        });

        it('justify-full: ctrl+j', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-full';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'justify').toBe(true);
        });

        it('justify-left: ctrl+l', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-left';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'left').toBe(true);
        });
        it('justify-right: ctrl+r', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-right';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'right').toBe(true);
        });
        it('clear-format: ctrl+shift+r', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 0, 4); keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect(!isNullOrUndefined(selectNode.querySelector('strong'))).toBe(true);
            selectNode = editNode.querySelector('.first-p');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[1], 0, 4);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'clear-format';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect(isNullOrUndefined(selectNode.querySelector('strong'))).toBe(true);
        });

        it('ordered-list: ctrl+shift+o', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'ordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect((selectNode as HTMLElement).parentElement.tagName === 'OL').toBe(true);
        });

        it('unordered-list: ctrl+alt+o', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'unordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect((selectNode as HTMLElement).parentElement.tagName === 'UL').toBe(true);
        });

        it('html-source: ctrl+shift+h - Preview mode', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'html-source';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-content'))).toBe(true);
        });

        it('html-source: ctrl+shift+h - Normal', () => {
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'html-source';
            (rteObj.sourceCodeModule as any).previewKeyDown(keyBoardEvent);
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-content'))).toBe(true);
        });

        it('insert-table: ctrl+shift+e', (done: Function) => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-table';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                let dialog: HTMLElement = document.getElementById(elem.id + '_tabledialog');
                expect(!isNullOrUndefined(dialog)).toBe(true);
                done();
            }, 200);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE shortcut key - Markdown', () => {
        let rteObj: RichTextEditor;
        let editNode: HTMLTextAreaElement;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `# Lists are a piece of cake
            They even auto continue as you type
            A double enter will end them
            Tabs and shift-tabs work too`;
        beforeAll(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                formatter: new MarkdownFormatter({
                    listTags: { 'OL': '1. ', 'UL': '- ' }, formatTags: {
                        'h1': '# ',
                        'h2': '## ',
                        'h3': '### ',
                        'h4': '#### ',
                        'h5': '##### ',
                        'h6': '###### ',
                        'blockquote': '> ',
                        'pre': '```\n',
                        'p': ''
                    }
                })
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.value = innerHTML;
        });

        it('insert-image: ctrl+shift+i', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-image';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).toBeNull();
        });

        it('insert-link: ctrl+k', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'insert-link';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).toBeNull();
        });

        it('bold: ctrl+b', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\*\*)/gim.test(line)).toBe(true);
        });

        it('italic: ctrl+i', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'italic';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\*)/gim.test(line)).toBe(true);
        });
        it('strikethrough: ctrl+shift+s', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'strikethrough';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\~\~)/gim.test(line)).toBe(true);
        });

        it('uppercase: ctrl+shift+u', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let prev = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'uppercase';
            (rteObj as any).keyDown(keyBoardEvent);
            let current = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            expect(prev !== current).toBe(true);
        });
        it('lowercase: ctrl+shift+l', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let prev = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'lowercase';
            (rteObj as any).keyDown(keyBoardEvent);
            let current = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            expect(prev !== current).toBe(true);
        });

        it('full-screen: ctrl+shift+f', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'full-screen';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(true);
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(false);
        });

        it('ordered-list: ctrl+shift+o', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'ordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(1. )', 'gim').test(line)).toBe(true);
        });
        it('unordered-list: ctrl+alt+o', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'unordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(- )/gim.test(line)).toBe(true);
        });
        it('superscript: ctrl+shift+=', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'superscript';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(<sup>)/gim.test(line)).toBe(true);
        });
        it('subscript: ctrl+=', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'subscript';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(<sub>)/gim.test(line)).toBe(true);
        });
        it('selectAll & getSelection public method', () => {
            editNode.value = innerHTML;
            rteObj.selectAll();
            let selection: string = rteObj.getSelection();
            expect(selection.length).toBe((rteObj.contentModule.getEditPanel() as HTMLTextAreaElement).value.length);
        });
        it('insert-table: ctrl+shift+e', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-table';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(|Heading 1|Heading 2|)/gim.test(line)).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE Change Events', () => {
        let rteObj: RichTextEditor;
        let change: boolean = false;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p>testing</p>',
                change: function (args: any) {
                    change = true;
                    expect(change).toBe(true);
                    expect(rteObj.value).toBe('<p>testing</p>');
                }
            });
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('Ensure Width property', () => {
            expect(rteObj.value).toBe('<p>testing</p>');
            rteObj.value = '<p>changed</p>';
            rteObj.dataBind();
        });
    });

    describe('RTE Change Events with table', () => {
        let rteObj: RichTextEditor;
        let change: boolean = false;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p>testing</p>',
                change: function (args: any) {
                    change = true;
                    expect(change).toBe(true);
                    expect(args.value).toBe('<table class="main_color e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td height="25"></td></tr><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="30" valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="15" height="32" bgcolor="#555a5d"></td><td width="15"></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 24px; line-height: 26px; color: #00468b;" class=""><span style="color: #00468b;"><b>{{RecipientTemplateModel.CampaignName}}sdfsdfasdf</b></span></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="line-height: 1px; font-size: 1px;" height="14" class="e-cell-select">&nbsp;</td></tr></tbody></table></td></tr><tr><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="30" class="">&nbsp;</td><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 20px; line-height: 22px; color: #555a5d;" class="title_color"></td></tr><tr><td style="line-height: 1px; font-size: 1px;" height="10">&nbsp;</td></tr><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 14px; line-height: 20px; color: #000000;" class=""><div></div><p>Welcome to the <u>October2020 Broker Report</u> (link: <a href="https://blog.crmls.org/brokers/crmls-broker-report-october-2020">https://blog.crmls.org/brokers/crmls-broker-report-october-2020</a><u>)</u>.This information is available for you to share with your agents and officestaff. Resources for you and your agents on any modifications to how you dobusiness are available on our webpage: CRMLSCOVID-19 Resources (link: <a href="https://go.crmls.org/crmls-coronavirus-covid-19-updates/">https://go.crmls.org/crmls-coronavirus-covid-19-updates/</a>). Please make sure to look out foremails from CRMLS and your local association as they become available.</p><p><br></p><p><b>ComplianceCorner</b></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Trending Topicsfor Compliance: October 2020 (link to: <a href="https://blog.crmls.org/updates/trending-topics-october-2020/">https://blog.crmls.org/updates/trending-topics-october-2020/</a>)</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paragon usersonly! The last Top Violation Overview webinar is this Thursday, October 29 beforeenforcement ramps up (link to: <a href="https://crmls.zoom.us/webinar/register/WN_BF1j2carRv2Pu221Y0SXEA">https://crmls.zoom.us/webinar/register/WN_BF1j2carRv2Pu221Y0SXEA</a>)</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Palm Springsusers only! The last Top Violation Overview webinar is tomorrow, October 28 at2pm before enforcement ramps up (link to: <a href="https://crmls.zoom.us/webinar/register/WN_0jNqnfLTR0-du8-KBuPK_A">https://crmls.zoom.us/webinar/register/WN_0jNqnfLTR0-du8-KBuPK_A</a></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pasadena-Foothills&amp; Ventura users only! The last Top Violation Overview webinars beforeenforcement ramps up are today at 10am &amp; 1pm. Register here (link to:&nbsp; <a href="https://crmls.zoom.us/webinar/register/WN_E5IUI8BrR7y0lSMB5EASCw">https://crmls.zoom.us/webinar/register/WN_E5IUI8BrR7y0lSMB5EASCw</a></p></td></tr><tr><td></td></tr></tbody></table></td><td width="30"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>');
                }
            });
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('Change event checking when table with resize element', () => {
            expect(rteObj.value).toBe('<p>testing</p>');
            rteObj.value = '<table class="main_color e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td height="25"></td></tr><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="30" valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="15" height="32" bgcolor="#555a5d"></td><td width="15"></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 24px; line-height: 26px; color: #00468b;" class=""><span style="color: #00468b;"><b>{{RecipientTemplateModel.CampaignName}}sdfsdfasdf</b></span></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="line-height: 1px; font-size: 1px;" height="14" class="e-cell-select">&nbsp;</td></tr></tbody></table></td></tr><tr><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td width="30" class="">&nbsp;</td><td valign="top"><table class="e-rte-table" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 20px; line-height: 22px; color: #555a5d;" class="title_color"></td></tr><tr><td style="line-height: 1px; font-size: 1px;" height="10">&nbsp;</td></tr><tr><td style="font-family: Helvetica, Arial, Helvetica, sans-serif; font-size: 14px; line-height: 20px; color: #000000;" class=""><div></div><p>Welcome to the <u>October2020 Broker Report</u> (link: <a href="https://blog.crmls.org/brokers/crmls-broker-report-october-2020">https://blog.crmls.org/brokers/crmls-broker-report-october-2020</a><u>)</u>.This information is available for you to share with your agents and officestaff. Resources for you and your agents on any modifications to how you dobusiness are available on our webpage: CRMLSCOVID-19 Resources (link: <a href="https://go.crmls.org/crmls-coronavirus-covid-19-updates/">https://go.crmls.org/crmls-coronavirus-covid-19-updates/</a>). Please make sure to look out foremails from CRMLS and your local association as they become available.</p><p><br></p><p><b>ComplianceCorner</b></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Trending Topicsfor Compliance: October 2020 (link to: <a href="https://blog.crmls.org/updates/trending-topics-october-2020/">https://blog.crmls.org/updates/trending-topics-october-2020/</a>)</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paragon usersonly! The last Top Violation Overview webinar is this Thursday, October 29 beforeenforcement ramps up (link to: <a href="https://crmls.zoom.us/webinar/register/WN_BF1j2carRv2Pu221Y0SXEA">https://crmls.zoom.us/webinar/register/WN_BF1j2carRv2Pu221Y0SXEA</a>)</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Palm Springsusers only! The last Top Violation Overview webinar is tomorrow, October 28 at2pm before enforcement ramps up (link to: <a href="https://crmls.zoom.us/webinar/register/WN_0jNqnfLTR0-du8-KBuPK_A">https://crmls.zoom.us/webinar/register/WN_0jNqnfLTR0-du8-KBuPK_A</a></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pasadena-Foothills&amp; Ventura users only! The last Top Violation Overview webinars beforeenforcement ramps up are today at 10am &amp; 1pm. Register here (link to:&nbsp; <a href="https://crmls.zoom.us/webinar/register/WN_E5IUI8BrR7y0lSMB5EASCw">https://crmls.zoom.us/webinar/register/WN_E5IUI8BrR7y0lSMB5EASCw</a></p></td></tr><tr><td></td></tr></tbody></table></td><td width="30"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><span data-row="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1081px; height: 4px; top: 91px; left: 74.6667px;"></span><span data-row="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1081px; height: 4px; top: 115.667px; left: 74.6667px;"></span><span data-row="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1081px; height: 4px; top: 420.333px; left: 74.6667px;"></span><span data-row="3" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1081px; height: 4px; top: 445px; left: 74.6667px;"></span><span class="e-table-box" data-col="0" unselectable="on" contenteditable="false" style="top: 443px; left: 1151.67px;"></span>';
            rteObj.dataBind();
        });
    });

    describe(' valueTemplate property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            let innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`;
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                valueTemplate: innerHTML
            });
            rteObj.appendTo("#defaultRTE");
            done();
        });
        it(' check value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        afterAll((done) => {
            destroy(rteObj);
            detach(elem);
            done();
        });
    });

    describe(' Markdown properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                editorMode: 'Markdown',
                value: 'Test'
            });
            rteObj.appendTo("#defaultRTE");
            done();
        });
        it(' check value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        it(' change the value property', () => {
            rteObj.value = "Updated";
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === 'Updated').toBe(true);
        });
        it(' change the value property as null', () => {
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === '').toBe(true);
        });

        afterAll((done) => {
            destroy(rteObj);
            detach(elem);
            done();
        });
    });
});

describe('EJ2-52200-Rich Text Editor character count increased when bold, italic, underline format applied in empty content and accessing using getCharCount -', () => {
    let rteObj: RichTextEditor;

    beforeAll(() => {
        rteObj = renderRTE({
            showCharCount: true,
            value: '<p><strong>&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;</span></em></strong></p>'
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('default count value with no text - bold, italic and underline enabled', () => {
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 0).toBe(true);
    });
    it('character value alone', () => {
        (<any>rteObj).value = "<p>Test</p>";
        (<any>rteObj).dataBind();
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
    it('character value with bold enabled', () => {
        (<any>rteObj).value = "<p><strong>&ZeroWidthSpace;Test</strong></p>";
        (<any>rteObj).dataBind();
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
    it('character value with italic enabled', () => {
        (<any>rteObj).value = "<p><em>&ZeroWidthSpace;Test</em></p>";
        (<any>rteObj).dataBind();
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
    it('character value with underline enabled', () => {
        (<any>rteObj).value = "<p><span style='text-decoration: underline;'>&ZeroWidthSpace;Test</span></p>";
        (<any>rteObj).dataBind();
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
    it('character value with strikethrough enabled', () => {
        (<any>rteObj).value = "<span style='text-decoration: line-through;'>&ZeroWidthSpace;Test</span>";
        (<any>rteObj).dataBind();
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
});

describe('EJ2-52200-Rich Text Editor character count, using getCharCount in markdownMode -', () => {
    let rteObj: RichTextEditor;

    beforeAll(() => {
        rteObj = renderRTE({
            showCharCount: true,
            editorMode: 'Markdown',
            value: 'Test'
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('default count value with text', () => {
        (<any>rteObj).getCharCount();
        let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
        expect(parseInt(charLen) === 4).toBe(true);
    });
});

describe(' Image selection prevent - msie ', () => {
    let rteObj: RichTextEditor;
    let editNode: Element;
    let selectNode: HTMLElement;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

        <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

        <p class='second-p-node'><label class='second-label'>label node</label></p>
        <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
        <img id="rteimg" width="10" height="10" src=" ">`;

    beforeAll(() => {
        Browser.info.name = 'msie';
        rteObj = renderRTE({});
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
    });
    it("Image element resize prevent in msie", () => {
        selectNode = editNode.querySelector('#rteimg') as HTMLElement;
        selectNode.click();
        expect(selectNode.nodeName.toLocaleLowerCase()).toBe('img');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe(' Image selection prevent - mozilla ', () => {
    let rteObj: RichTextEditor;
    let editNode: Element;
    let selectNode: HTMLElement;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

        <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

        <p class='second-p-node'><label class='second-label'>label node</label></p>
        <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
        <img id="rteimg" width="10" height="10" src=" ">`;

    beforeAll(() => {
        Browser.userAgent = 'mozilla/5.0 (windows nt 10.0; win64; x64; rv:60.0) gecko/20100101 firefox/60.0';
        rteObj = renderRTE({});
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
    });
    it("Image element resize prevent in mozilla", () => {
        selectNode = editNode.querySelector('#rteimg') as HTMLElement;
        selectNode.click();
        expect(selectNode.nodeName.toLocaleLowerCase()).toBe('img');
        expect(Browser.info.name).toBe('mozilla');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe("RTE ExecuteCommand public method testing", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p id="pnode1">Sample</p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode2">Sample</p>' +
                '<p id="pnode3">Sample</p>' +
                '<p id="createLink">CreateLinkSample</p>'
        });
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check bold Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode1");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('bold');
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('strong');
    });
    it('check insertHtml Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode2");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let span: HTMLElement = document.createElement('span');
        span.id = "spannode1";
        span.innerHTML = "ABC";
        rteObj.executeCommand('insertHTML', span);
        expect(node.childNodes[1].nodeName.toLocaleLowerCase()).toBe('span');
    });
    it('check OL Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode3");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('insertOrderedList');
        expect(document.getElementById("pnode2").nextSibling.nodeName.toLocaleLowerCase()).toBe('ol');
        expect((document.getElementById("pnode2").nextSibling as HTMLElement).querySelectorAll('li').length === 1).toBe(true);
    });
    it('check Font color Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode4");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('fontColor', 'rgb(102, 102, 0)');
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('span');
        expect((node.childNodes[0] as HTMLElement).style.color).toBe('rgb(102, 102, 0)');
    });
    it(' EJ2-19209: insertText cursor point Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode4");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('insertText', 'RichTextEditor');
        expect(node.textContent === 'SampleRichTextEditor').toBe(true);
    });

    it(' EJ2-19209: insertText selection points Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodes: any = (rteObj as any).inputElement.querySelectorAll("p");
        nodeSelection.setSelectionText(document, nodes[1].childNodes[0], nodes[2].childNodes[0], 1, 1);
        rteObj.executeCommand('insertText', 'RichTextEditor');
        expect(nodes[1].textContent === 'SampleRichTextEditor').toBe(true);
    });

    it(' EJ2-27469: createLink using executeCommand not working propery issue', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("createLink");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 10);
        let range = nodeSelection.getRange(rteObj.contentModule.getDocument());
        let save: NodeSelection = nodeSelection.save(range, rteObj.contentModule.getDocument());
        rteObj.executeCommand('createLink', { url: 'www.google.com', text: '', selection: nodeSelection });
        expect(node.firstElementChild.tagName.toLocaleLowerCase() === 'a').toBe(true);
        expect(node.firstElementChild.textContent === 'www.google.com').toBe(true);
    });

    it('Insert video using InsertHTML', () => {
        rteObj.value = `<div><video><source src = "https://www.w3schools.com/html/movie.mp4"> <source src="https://www.w3schools.com/html/movie.ogg" type="video/ogg">Your browser does not support the video tag.</video><br><p id="lastNode">Last node</p></div>`;
        rteObj.dataBind();
        let videosrc = '<video><source src = "https://www.w3schools.com/html/movie.mp4"> <source src="https://www.w3schools.com/html/movie.ogg" type="video/ogg">Your browser does not support the video tag.</video><br />';
        let cuspoint = document.getElementById('lastNode');
        setCursorPoint(document, cuspoint.childNodes[0] as Element, 7);
        expect(rteObj.inputElement.querySelectorAll('video').length).toBe(1);
        rteObj.executeCommand("insertHTML", videosrc);
        expect(rteObj.inputElement.querySelectorAll('video').length).toBe(2);
    });

    it('Insert HR tag using InsertHTML', () => {
        rteObj.value = `<div><p id="lastPNode">Last node</p></div>`;
        rteObj.dataBind();
        let cuspoint = document.getElementById('lastPNode');
        setCursorPoint(document, cuspoint.childNodes[0] as Element, 7);
        rteObj.executeCommand("insertHTML", '<div><hr></div>');
        expect(rteObj.inputElement.querySelectorAll('hr').length === 1).toBe(true);
    });

    it('Insert HR tag using InsertHorizontalRule', () => {
        rteObj.value = `<div><p id="lastNode">Last node</p></div>`;
        rteObj.dataBind();
        let cuspoint = document.getElementById('lastNode');
        setCursorPoint(document, cuspoint.childNodes[0] as Element, 7);
        rteObj.executeCommand("insertHorizontalRule");
        expect(rteObj.inputElement.querySelectorAll('hr').length === 1).toBe(true);
    });
    it('Insert HR tag using InsertHorizontalRule', () => {
        rteObj.value = `<p><br /></p>`;
        rteObj.dataBind();
        rteObj.executeCommand("insertHorizontalRule");
        expect(rteObj.inputElement.querySelectorAll('hr').length === 1).toBe(true);
        rteObj.executeCommand("insertHorizontalRule");
        expect(rteObj.inputElement.querySelectorAll('hr').length === 2).toBe(true);
        rteObj.executeCommand("insertHorizontalRule");
        expect(rteObj.inputElement.querySelectorAll('hr').length === 3).toBe(true);
        rteObj.executeCommand("insertHorizontalRule");
        expect(rteObj.inputElement.querySelectorAll('hr').length === 4).toBe(true);
    });
});

describe("EJ2-58355 - RTE insert HTML", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p id="pnode1">Sample</p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode2">Sample</p>' +
                '<p id="pnode3">Sample</p>' +
                '<p id="createLink">CreateLinkSample</p>'
        });
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check insertHtml with input element', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode1");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('insertHTML', `<div>inserted</div><p><input type="checkbox" id="lname" name="lname"></p>`);
        expect(rteObj.inputElement.querySelectorAll('input').length === 1).toBe(true);
    });
});

describe("EJ2-59978 - Insert HTML and Text after Max char count - Execute Command", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p class="focusNode">RTE Content with RTE</p>',
            toolbarSettings: {
                items: ['CreateTable']
            },
            maxLength: 20,
            showCharCount: true
        });
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('Insert HTML after Max char count - Execute Command', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
        rteObj.executeCommand('insertHTML', `<div>inserted</div>`);
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode">RTE Content with RTE</p>`).toBe(true);
    });

    it('Insert Text & insert horizontal ruler and insert BR after Max char count - Execute Command', () => {
        destroy(rteObj);
        rteObj = renderRTE({
            value: '<p class="focusNode">RTE Content with RTE</p>',
            toolbarSettings: {
                items: ['CreateTable']
            },
            maxLength: 20,
            showCharCount: true
        });
        let nodeSelection: NodeSelection = new NodeSelection();
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
        rteObj.executeCommand('insertText', `Hello`);
        expect(rteObj.inputElement.textContent === `RTE Content with RTE`).toBe(true);
    });

    it('insert horizontal ruler and insert BR after Max char count - Execute Command', () => {
        destroy(rteObj);
        rteObj = renderRTE({
            value: '<p class="focusNode">RTE Content with RTE</p>',
            toolbarSettings: {
                items: ['CreateTable']
            },
            maxLength: 20,
            showCharCount: true
        });
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
        rteObj.executeCommand('insertHorizontalRule');
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode">RTE Content with RTE</p>`).toBe(true);

        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        focusNode = rteObj.inputElement.childNodes[0].childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
        rteObj.executeCommand('insertBrOnReturn');
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode">RTE Content with RTE</p>`).toBe(true);
    });
});

describe("RTE content remove issue", () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p id="pnode1"><br></p>' +
                '<p id="pnode2"><br></p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode3">Sample</p>'
        });
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check empty content issue', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode4");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
        (rteObj as any).keyUp(keyBoardEvent);
        expect(rteObj.contentModule.getEditPanel().textContent !== '').toBe(true);
    });
});

describe('RTE Form reset', () => {
    let rteObj: RichTextEditor;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('form', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                    <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                    </textarea>
                    <div id="dateError"></div>
                </div>
                <div class="row">
                    <div style="width: 320px;margin:0px auto;height: 100px;padding-top: 25px;">
                        <div style="display: inline-block;">
                            <button id="validateSubmit" class="samplebtn e-control e-btn e-primary" type="submit" style="height:40px;width: 150px;" data-ripple="true">Submit</button>
                        </div>
                        <div style="float: right;">
                            <button id="resetbtn" class="samplebtn e-control e-btn" type="reset" style="height:40px;width: 150px;" data-ripple="true">Clear</button>
                        </div>
                    </div>
                </div>` });
        document.body.appendChild(element);
        rteObj = new RichTextEditor({
            value: `<div><p>First p node-0</p></div>`,
            placeholder: 'Type something'
        });
        rteObj.appendTo('#defaultRTE');
    });
    it(" Check the value property while click on reset button", () => {
        expect(rteObj.value !== null).toBe(true);
        document.getElementById('resetbtn').click();
        expect(rteObj.value === '<div><p>First p node-0</p></div>').toBe(true);
        expect((rteObj as any).inputElement.innerHTML).toEqual('<div><p>First p node-0</p></div>');
    });
    afterAll(() => {
        destroy(rteObj);
        detach(element);
    });
});

describe('EJ2-13507: RTE ng feature matrix - Markdown two way binding is not working', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `Markdown content`;
    beforeAll(() => {
        rteObj = renderRTE({ editorMode: 'Markdown', value: innerHTML });
    });

    it(' update the value through onPropertyChange', () => {
        expect((rteObj as any).inputElement.value === innerHTML).toBe(true);
        rteObj.value = 'Markdown content updated';
        rteObj.dataBind();
        expect((rteObj as any).inputElement.value !== innerHTML).toBe(true);
        expect((rteObj as any).inputElement.value === 'Markdown content updated').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-14075: getText public method html mode', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `<p><b>Description:</b></p>`;
    beforeAll(() => {
        rteObj = renderRTE({ value: innerHTML });
    });

    it(' check getText', () => {
        expect(rteObj.getText() === 'Description:').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-14075: getText public method html mode with iframe', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `<p><b>Description:</b></p>`;
    beforeAll(() => {
        rteObj = renderRTE({ iframeSettings: { enable: true }, value: innerHTML });
    });

    it(' check getText', () => {
        expect(rteObj.getText() === 'Description:').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-14075: getText public method markdown mode', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `Markdown content`;
    beforeAll(() => {
        rteObj = renderRTE({ editorMode: 'Markdown', value: innerHTML });
    });

    it(' check getText', () => {
        expect(rteObj.getText() === innerHTML).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-13504 - Key board action RequestType ', () => {
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab' };
    let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

<p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

<p class='second-p-node'><label class='second-label'>label node</label></p>
<p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
<ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;
    let actionBegin: string;
    let actionComplete: string;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                    'FontName']
            },
            value: innerHTMLStr,
            actionComplete: (e): void => {
                actionComplete = e.requestType;
            },
            actionBegin: (e): void => {
                actionBegin = e.requestType;
            }
        });
        editNode = rteObj.contentModule.getEditPanel();
        curDocument = rteObj.contentModule.getDocument();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it(' tab key navigation from second li start point', () => {
        selectNode = editNode.querySelector('.ul-third-node');
        expect(selectNode.querySelector('ul')).toBeNull();
        setCursorPoint(curDocument, selectNode.childNodes[2] as Element, 0);
        (rteObj as any).keyDown(keyBoardEvent);
        expect(actionComplete === 'UL').toBe(true);
        expect(actionBegin === 'TabKey').toBe(true);
    });
});

describe('EJ2-15017 - refresh editor', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    let toolWrap: HTMLElement;
    beforeAll(() => {
        elem = document.createElement('div');
        elem.innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>`;
        elem.id = 'defaultRTE';
        elem.style.display = 'none';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            width: 200,
        });
        rteObj.appendTo("#defaultRTE");
    });
    it(' Set the display block to component and refresh the editor', () => {
        toolWrap = rteObj.element.querySelector('#defaultRTE_toolbar_wrapper');
        rteObj.element.style.display = 'block';
        rteObj.refreshUI();
        let currentToolWrap: HTMLElement = rteObj.element.querySelector('#defaultRTE_toolbar_wrapper');
        expect(toolWrap.style.height).toBe(currentToolWrap.style.height);
    });
    afterAll(() => {
        destroy(rteObj);
        detach(elem);
    });
});

describe('EJ2-12731 - RTE -  IFrame heights are not auto adjusted based content', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll((done: Function) => {
        elem = document.createElement('div');
        elem.innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. 
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                </p>`;
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            iframeSettings: { enable: true },
            width: 200,
        });
        rteObj.appendTo("#defaultRTE");
        done();
    });
    it(' test the iframe content height', (done) => {
        setTimeout(() => {
            let iframe: HTMLElement = rteObj.element.querySelector('#defaultRTE_rte-view');
            expect(iframe.style.height !== 'auto').toBe(true);
            done();
        }, 110);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('IFrame heights are not auto adjusted when image content is loaded', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll((done: Function) => {
        elem = document.createElement('div');
        elem.innerHTML = `<p>The rich text editor is WYSIWYG ("what you see is what you get") editor useful to create and edit content, and return the valid
        <a href="https://ej2.syncfusion.com/home/" target="_blank">HTML markup</a> 
       or <a href="https://ej2.syncfusion.com/home/" target="_blank">markdown</a> 
       of the content</p><p><b>Image.</b></p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAAulBMVEX///8rNXv2kh4eKnaMkLIpM3r29voaKHcSIXPv8PUHG3EjLngnMXne3+fDxdcWJXVASYgAGXDm5+9wdaFqcJ2ytcuSlbVGTor2jAB7f6ieob2IjLD5v4kvOn+tr8j/+/XP0d/71K7X2eT3nz5TWpC+wNP1iQAAAGqZnbthZ5j+9+8ADG2lqMK4us+AhaxSWZD82rz6y5/96db5t3n4pVD2mCz4rmT+7+D84sn3okgAC275vYM3QIMAE27ZBJ98AAAJAUlEQVR4nO2cC5uaOBeA4yB3FEHFW4dSV2e0o2P3+9rt7qz+/7+15IRLElCRmZFOPe/T56nGQA6vkJwktoQgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIL83nz61nQEH5FvDw9/Nh3Dx+N/D3d3D/9vOoqPxtfxXcz4++emA/lY/LgDxj++Nh3JR+L7+C5h/HfTsXwc/s2sxR3cl6ajaRitK6DJBWZa8c+HO46HT00G3TydR4PjsUNMsWCZ1PsmWIuf078aDbtpOlaLw4i1uSpf0GXVfo7vJMZ/NBt4s1TT9lWWFj+mNz1fqKbty0PB2m3PFio+pH9LD+n432bDbpqK2sjPO17c+HujQTdPVW3k8z+ct5seDiiVtRHyV+7t5mdXF2gjn5KBYfyzsXB/FS7Rlgyot516MC7SBgPqjacejMu0xQPqw42nHowLtZHPaI3SebQ4YCovFCzPn+ImMQUKBVrT8SG/E5pAWcFnkVOHp4e8Y6DvdPYL6TzqHC9x33bgC57ivu3HmCcfEjrTQc9RdAnXfocoo0nPhrNbz7WO79vx8OYM3i6gjqXmsJG0xZXQkfQPYekjXQ33F55ux4fwtYH7twsuJXxSkoaUmtoUeuybajubgJRqiw52q5R30KblIdXVRoO1m9fmG3ytd9YWsRhV1zUOk1pneJW27qaYhdXU1lcSSY6tSDj1gjtB6NKmnN5muVxGtc7Qd23b1mtp89ddfz7wpdJ62jSLVVL0xWQmU+vCTjHVaVv6KwbR9ppSK7IFGa67RDZeT1vXYNb6ZklDbw5oc0bXaKrAPCCbaEa2c7G4nrYVPKNq7zqhbxrU1g1JaGgkisTietqeQZsyPd7c8ySmn3UJE3gL92abI5gu5/KRZncbbhKm9DzPC4e2dg+nDInZp39nIyp7O8mP3gR8CzPozqdQZ5U3Ml8NRvt9bzHjevvljDtuFbIfJJgDsmkPSSA9Vq/R5p6Y5+/p6PDUSd5pFrylFjWDHz9017LbfKc13XuGm6XOFrmngwyLhdY3non/Ql+0Mk/w1tASh/HRwgBlBbR8QAvdrINa9uKc03FU1VEMN0hL2xZ/oGt4O7r8M9t2yDZqS5f3Km3D49p69FqtTJtOT2rRr0yT8z1VV7KbMrKF1lsK2YuJTpy3+TTiPM0xPVrOpia+osh5kQK3mJiADCyHq+E6ESsOFOlY50Dv6dVgxt+nr9HGWrDXb6EtDi91sPUc8ZNYW1zCBXRa26h47qI2bSTpUb1uubY44g00Uby8etqWbCTVJ0dH0nPa2Fw2ef6MEGrND6nH9BG24ofdth2IKE4Rbds9pS1Ji22X++3PUyBrWzM7Cv2U3ZyqNefuBdY/JJ/oRy6v8+hy0GXKJ77gRZ7KszVx00vyNne0W2T028PscTujTZmGlGAHmay9gFp7kKi6yuI5CFaUgK57kCm9HnXE1kBOaGsr7LvcdqMcX9IWsm/cmkSmOZ/aEI3Ty7TZgyENbPNswxUaUbk2MxxyhCbRxIK41S8C7IeUk3SWoDo5tuJai3klbUZ6myaXSl9u4YIcO5TzWjFvO65tAXLKpl+cNriN1HSx34Q4W8Yw1aak3ZhJlynyt2+DqUu9UIp9YOPEOW3pbemDK/hkB6fU5XlMdW0jegJlUxJuro11L26YHc4mbjsia2PDXs2lg6N0dL3cW8sDV1W1aXC3WX56/WVfb1Vt4N1ZlESba2Mrb9xyA8vcaWiSNkiy7f6Ry2/1OO59Yt4LBfHNvOAL9ulptbZr6XF/nZGOJEr/Em3kXk0qsgmb0SEFqmpbs25ztAoZ+Ywo1wb9p8LNTjus2W5BGywgHNXmcSuMThy+aThcidWlwzpXoHOJ33wz6w8G64SRlfR3MOe+XBt8u2qLFKmgzcnq0XEY8uV4QLOUQNLGlu7cLXd26OxoCnqRtvMJyIjvxhQ5X84xn1nYMJxfrg2eFqdsmltVm+/JHYbq7k1Bm5ndWxkQgD5tTFvaqRvL+tpKVweqaiObg12YJSx+fW3TfM5V4yGlYar7itqyerw2Eg2cPNNlfYYXkTMPKcQcNqiNLcMybamNytogNVCNYv5R/W6DjztzRrftZgHnQwI0pwT5yf16Q8JbamODOXtIwUY6lFXRxnqmPKM6rS1fAZG0yeHkaQe8GtBXfFcAI1HLKyYg19PGZkcgC7q57GGooo0912qruPYtajNBm5tWO6EtojcSrDfk2oZu9s0yYKEATn4NbcXN+M62x2bpkIBAjp2vyFbRxmaL9q7gTVoUh2rZc3ZCG3S1cOG5Ng2OVrO5yIA9IOF1tC2fCrvxhsvqsZaGzMF+Nt1M4z/g6ow29rJlO6tuN52Ml2mD56yl7wI4NRuAWQIy54kCPZtVcnPSFZv5uhsaTLQDaw4MMNfQZsib8elRqgcdmsk2Uh0FVojYoHZOW8QWjlQlHQstt0xbl4Wc/I6C7WqAtuCFWzGyklWhw1zUli7K6e6+ZxtszQVG2+toa5WjWkm7QbHGOW1kI+WryXgp71ztCuuJKj9LELDFvI1+oS3mLf+mPTYMNahN8bJmxaXnStri7k0wckSb1jOkUzNtkPlJ1lxxlgDeRsJPCmwjWdu/SNsLv+/wFGvz+IJDrK2n81saibaDvBlPdy0sZcLNxIc9y0gPVXNtsAVzyLTBrv5Lepg/cS1uD4Wtda/o3ojOzx+m95a406LAhRaCskasnQFt1MjW8Ke6AevKqmq7XrbjDlswVpbShVSEcWQn358J22M+0cSCuGcQN9BYTjEXaiV7ZPIeLPGX0+Sz+2wkJXDkLFtNT9vNmG9X+TmhpAuHBMKpO3ytpGIkB7WKUgX0kxm3Erec9BTLM+7Xm7xl2PDLdwAj+ZgGgH7Eu8oefmV+lZ8YHmcOE6f3+MHg74wPE4BT+4MIY8t+YwCsWSJcNt1ERFZGvlye7HO+5pdWt8JKTknVA/7LkPNI2mzXQGsVCB69nIOyLuwZI2Vc4x94IAiCIAiCIAiCIAiCIAiCIEjz3Pz/+IkgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCILU5T8hs9sPXRlPegAAAABJRU5ErkJggg==">`;
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            iframeSettings: { enable: true },
            width: 200,
        });
        rteObj.appendTo("#defaultRTE");
        done();
    });
    it(' test the iframe content height with image', (done) => {
        setTimeout(() => {
            let iframe: HTMLElement = rteObj.element.querySelector('#defaultRTE_rte-view');
            expect(iframe.style.height !== 'auto').toBe(true);
            done();
        }, 110);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-12731 - RTE -  Textarea heights are not auto adjusted based content', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll(() => {
        elem = document.createElement('div');
        elem.innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. 
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                </p>`;
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            editorMode: 'Markdown',
            width: 200,
        });
        rteObj.appendTo("#defaultRTE");
    });
    it(' test the textarea content height', () => {
        let textarea: HTMLElement = (rteObj as any).inputElement;
        expect(textarea.style.height !== '').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-18684 - RTE - Focus event not raised in readonly mode', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    let argsName: string = '';
    function onFocus(args: { [key: string]: string }): void {
        argsName = args.name;
    }
    beforeAll(() => {
        elem = document.createElement('div');
        elem.innerHTML = ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. 
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                </p>`;
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            readonly: true,
            width: 200,
            focus: onFocus
        });
        rteObj.appendTo("#defaultRTE");
    });
    it('check focus event trigger', () => {
        rteObj.focusIn();
        expect(argsName).toBe('focus');
    });
    afterAll(() => {
        destroy(rteObj);
        detach(elem);
    });
});

describe('RTE textarea with innerText', () => {
    let rteObj: RichTextEditor;
    let element: HTMLElement;
    beforeAll((done: Function) => {
        element = createElement('div', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                    <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                    <p class='first-p'>First p node-0</p>
                    </textarea>
                </div>` });
        document.body.appendChild(element);
        rteObj = new RichTextEditor({
            placeholder: 'Type something'
        });
        rteObj.appendTo('#defaultRTE');
        done();
    });
    it(" Set the value decoded text", () => {
        expect((rteObj as any).inputElement.innerHTML).toEqual('<p class="first-p">First p node-0</p>');
    });
    afterAll((done) => {
        destroy(rteObj);
        detach(element);
        done();
    });
});

describe(' Paste url', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
    let curDocument: Document;
    let selectNode: Element;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<div><p class='first-p'>First p node-0</p></div>`,
            placeholder: 'Type something'
        });
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it(" paste the url with create a anchor tag", (done) => {
        selectNode = (rteObj as any).inputElement.querySelector('.first-p');
        setCursorPoint(curDocument, selectNode, 0);
        keyBoardEvent.clipboardData = {
            getData: (e: any) => {
                if (e === "text/plain") {
                    return 'https://ej2.syncfusion.com';
                } else {
                    return '';
                }
            },
            items: []
        };
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            selectNode = (rteObj as any).inputElement.querySelector('a');
            expect(!isNullOrUndefined(selectNode)).toBe(true);
            expect(selectNode.getAttribute('title') === 'https://ej2.syncfusion.com').toBe(true);
            done();
        }, 10);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-49170 - Class name "MsoNormal" when pasting content with link from outlook', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
    let curDocument: Document;
    var pasteContent = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\nxmlns:w=\"urn:schemas-microsoft-com:office:word\"\r\nxmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\"\r\nxmlns=\"http://www.w3.org/TR/REC-html40\">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content=\"Microsoft Word 15\">\r\n<meta name=Originator content=\"Microsoft Word 15\">\r\n<link rel=File-List\r\nhref=\"file:///C:/Users/SYNCFU~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml\">\r\n<!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref=\"file:///C:/Users/SYNCFU~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx\">\r\n<link rel=colorSchemeMapping\r\nhref=\"file:///C:/Users/SYNCFU~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml\">\r\n<!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>\r\n  <m:mathPr>\r\n   <m:mathFont m:val=\"Cambria Math\"/>\r\n   <m:brkBin m:val=\"before\"/>\r\n   <m:brkBinSub m:val=\"&#45;-\"/>\r\n   <m:smallFrac m:val=\"off\"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val=\"0\"/>\r\n   <m:rMargin m:val=\"0\"/>\r\n   <m:defJc m:val=\"centerGroup\"/>\r\n   <m:wrapIndent m:val=\"1440\"/>\r\n   <m:intLim m:val=\"subSup\"/>\r\n   <m:naryLim m:val=\"undOvr\"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]--><!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState=\"false\" DefUnhideWhenUsed=\"false\"\r\n  DefSemiHidden=\"false\" DefQFormat=\"false\" DefPriority=\"99\"\r\n  LatentStyleCount=\"376\">\r\n  <w:LsdException Locked=\"false\" Priority=\"0\" QFormat=\"true\" Name=\"Normal\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" QFormat=\"true\" Name=\"heading 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 7\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 8\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 9\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 9\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 7\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 8\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 9\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footnote text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"header\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footer\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index heading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"35\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"caption\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"table of figures\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"envelope address\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"envelope return\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footnote reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"line number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"page number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"endnote reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"endnote text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"table of authorities\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"macro\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"toa heading\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"10\" QFormat=\"true\" Name=\"Title\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Closing\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Signature\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"1\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"Default Paragraph Font\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Message Header\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"11\" QFormat=\"true\" Name=\"Subtitle\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Salutation\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Date\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text First Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text First Indent 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Note Heading\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Block Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Hyperlink\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"FollowedHyperlink\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"22\" QFormat=\"true\" Name=\"Strong\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"20\" QFormat=\"true\" Name=\"Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Document Map\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Plain Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"E-mail Signature\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Top of Form\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Bottom of Form\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal (Web)\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Acronym\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Address\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Cite\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Code\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Definition\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Keyboard\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Preformatted\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Sample\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Typewriter\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Variable\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal Table\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation subject\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"No List\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Contemporary\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Elegant\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Professional\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Subtle 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Subtle 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Balloon Text\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" Name=\"Table Grid\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Theme\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" Name=\"Placeholder Text\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"1\" QFormat=\"true\" Name=\"No Spacing\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" Name=\"Revision\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"34\" QFormat=\"true\"\r\n   Name=\"List Paragraph\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"29\" QFormat=\"true\" Name=\"Quote\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"30\" QFormat=\"true\"\r\n   Name=\"Intense Quote\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"19\" QFormat=\"true\"\r\n   Name=\"Subtle Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"21\" QFormat=\"true\"\r\n   Name=\"Intense Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"31\" QFormat=\"true\"\r\n   Name=\"Subtle Reference\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"32\" QFormat=\"true\"\r\n   Name=\"Intense Reference\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"33\" QFormat=\"true\" Name=\"Book Title\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"37\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"Bibliography\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"TOC Heading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"41\" Name=\"Plain Table 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"42\" Name=\"Plain Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"43\" Name=\"Plain Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"44\" Name=\"Plain Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"45\" Name=\"Plain Table 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"40\" Name=\"Grid Table Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\" Name=\"Grid Table 1 Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\" Name=\"Grid Table 6 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\" Name=\"Grid Table 7 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\" Name=\"List Table 6 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\" Name=\"List Table 7 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Mention\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Smart Hyperlink\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Hashtag\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Unresolved Mention\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Smart Link\"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n<!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:\"Cambria Math\";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:\"\";\r\n\tmargin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\na:link, span.MsoHyperlink\r\n\t{mso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tcolor:#0563C1;\r\n\tmso-themecolor:hyperlink;\r\n\ttext-decoration:underline;\r\n\ttext-underline:single;}\r\na:visited, span.MsoHyperlinkFollowed\r\n\t{mso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tcolor:#954F72;\r\n\tmso-themecolor:followedhyperlink;\r\n\ttext-decoration:underline;\r\n\ttext-underline:single;}\r\nspan.EmailStyle16\r\n\t{mso-style-type:personal;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-unhide:no;\r\n\tmso-ansi-font-size:11.0pt;\r\n\tmso-bidi-font-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tcolor:windowtext;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-size:10.0pt;\r\n\tmso-ansi-font-size:10.0pt;\r\n\tmso-bidi-font-size:10.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n-->\r\n</style>\r\n<!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:\"Table Normal\";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:\"\";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:10.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US link=\"#0563C1\" vlink=\"#954F72\" style='tab-interval:.5in;\r\nword-wrap:break-word'>\r\n<!--StartFragment-->\r\n\r\n<p class=MsoNormal style='background:white'><span style='font-size:10.5pt;\r\nfont-family:\"Arial\",sans-serif;color:red;letter-spacing:.2pt'>Please click this\r\nlink to download a calendar reminder for this date and time</span><span\r\nstyle='font-size:10.5pt;font-family:\"Arial\",sans-serif;color:#111111;\r\nletter-spacing:.2pt'>&nbsp;<o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='background:white'><span style='font-size:10.5pt;\r\nfont-family:\"Arial\",sans-serif;color:red;letter-spacing:.2pt'><a\r\nhref=\"https://nam02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.grouptechedge.com%2FReminders%2FTechEdgeServiceMaintenanceWindow521.ics&amp;data=04%7C01%7Cse%40syncfusion.com%7C8f9a0e95a0024193b48b08d913b2fc63%7C77f1fe12b04949198c509fb41e5bb63b%7C0%7C0%7C637562481730044352%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=jwWksH%2BrRq%2FG8aHeEgmMLBR51w6Ayv9kQs%2Fn5Z8kGAQ%3D&amp;reserved=0\"\r\ntitle=\"https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics\"><span\r\nstyle='color:red;text-decoration:none;text-underline:none'>https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics&nbsp;</span></a></span><span\r\nstyle='font-size:10.5pt;font-family:\"Arial\",sans-serif;color:#111111;\r\nletter-spacing:.2pt'>&nbsp;<o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='background:white'><span style='font-size:10.5pt;\r\nfont-family:\"Arial\",sans-serif;color:#111111;letter-spacing:.2pt'>&nbsp;<o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='background:white'><span style='font-size:10.5pt;\r\nfont-family:\"Arial\",sans-serif;color:red;letter-spacing:.2pt'>This will affect\r\nboth the US and DK production site.</span><span style='font-size:10.5pt;\r\nfont-family:\"Arial\",sans-serif;color:#111111;letter-spacing:.2pt'>&nbsp;<o:p></o:p></span></p>\r\n\r\n<!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n";
    let selectNode: Element;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: "<p class='first-p'>Please click this link to download a calendar reminder for this date and time \r\nhttps://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics  \r\n \r\nThis will affect both the US and DK production site. \r\n</p>",
            placeholder: 'Type something'
        });
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it("Checking the pasted element in the editor", (done) => {
        selectNode = (rteObj as any).inputElement.querySelector('.first-p');
        setCursorPoint(curDocument, selectNode, 0);
        keyBoardEvent.clipboardData = {
            getData: (e: any) => {
                if (e === "text/plain") {
                    return 'Please click this link to download a calendar reminder for this date and time \r\nhttps://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics  \r\n \r\nThis will affect both the US and DK production site. \r\n';
                }
                else {
                    return pasteContent;
                }
            },
            items: []
        };
        (rteObj as any).pasteCleanupModule = null;
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            selectNode = (rteObj as any).inputElement.querySelector('p');
            expect(!isNullOrUndefined(selectNode)).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe(' Paste action events', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
    let curDocument: Document;
    let selectNode: Element;
    let actionBegin: boolean = false;
    let actionComplete: boolean = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<div><p class='first-p'>First p node-0</p></div>`,
            placeholder: 'Type something',
            actionBegin: (e: any) => {
                actionBegin = true;
            },
            actionComplete: (e: any) => {
                actionComplete = true;
            }
        });
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it(" clipboard action in actionBegin and actionComplete", (done) => {
        selectNode = (rteObj as any).inputElement.querySelector('.first-p');
        setCursorPoint(curDocument, selectNode, 0);
        (rteObj as any).inputElement.dispatchEvent(new ClipboardEvent('paste', keyBoardEvent));
        setTimeout(() => {
            expect(actionBegin).toBe(true);
            //The actioncomplete won't be triggered unless a data is pasted.
            expect(actionComplete).toBe(false);
            done();
        }, 10);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-52326 - Cannot cancel fullscreen event in Maximize', () => {
    let rteObj: RichTextEditor;
    let actionBegin: boolean = false;
    let actionComplete: boolean = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p>Fullscreen mode testing</p>`,
            toolbarSettings: {
                items: ['FullScreen']
            },
            actionBegin: (e: any) => {
                actionBegin = true;
                e.cancel = true;
            },
            actionComplete: (e: any) => {
                actionComplete = true;
            }
        });
        done();
    });
    it(" Preventing the fullscreen mode with args.cancel as true", (done) => {
        (rteObj as any).inputElement.focus();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(actionBegin).toBe(true);
        expect((rteObj as any).element.classList.contains("e-rte-full-screen")).toBe(false);
        expect(actionComplete).toBe(false);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-52870-Pasting the text content for the second time after clearing the value, hangs the editor', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
    let curDocument: Document;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p><strong>​<em>​<span style="text-decoration: underline;">​</span></em></strong></p><div style=" font-family: &quot;Segoe UI&quot;, system-ui, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal;">Testing content</div>`,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            }
        });
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it("Pasting the content for the second time", (done) => {
        rteObj.value = '';
        rteObj.pasteCleanupSettings.prompt = false;
        rteObj.pasteCleanupSettings.plainText = false;
        rteObj.pasteCleanupSettings.keepFormat = true;
        rteObj.dataBind();
        keyBoardEvent.clipboardData = {
            getData: (e: any) => {
                if (e === "text/plain") {
                    return 'Pasted Testing content';
                } else {
                    return '';
                }
            },
            items: []
        };
        (rteObj as any).inputElement.focus();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).click();
        setCursorPoint(curDocument, (rteObj as any).inputElement.lastElementChild.lastElementChild.lastElementChild.lastElementChild.firstChild, 1);
        rteObj.onPaste(keyBoardEvent);
        expect((rteObj as any).inputElement.childElementCount).toBe(1);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-52326 - Cannot cancel fullscreen event in Maximize', () => {
    let rteObj: RichTextEditor;
    let actionBegin: boolean = false;
    let actionComplete: boolean = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p>Fullscreen mode testing</p>`,
            toolbarSettings: {
                items: ['FullScreen']
            },
            actionBegin: (e: any) => {
                actionBegin = true;
                e.cancel = false;
            },
            actionComplete: (e: any) => {
                actionComplete = true;
            }
        });
        done();
    });
    it(" Allowing the fullscreen mode with args.cancel as false", (done) => {
        (rteObj as any).inputElement.focus();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(actionBegin).toBe(true);
        expect((rteObj as any).element.classList.contains("e-rte-full-screen")).toBe(true);
        expect(actionComplete).toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-23205 Revert the headings and blockquotes format while applying the inline code in Markdown editor', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    let editNode: HTMLTextAreaElement;
    let innerHTML: string = `Lists are a piece of cake
        They even auto continue as you type
        A double enter will end them
        Tabs and shift-tabs work too`;
    let controlId: string;
    beforeAll(() => {
        rteObj = renderRTE({
            editorMode: 'Markdown', value: innerHTML, toolbarSettings: {
                items: ['Formats', 'UnorderedList', 'ClearFormat']
            }
        });
        elem = rteObj.element;
        controlId = elem.id;
        editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
    });

    it(' Remove the all applied format synatx', () => {
        rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
        rteObj.formatter.editorManager.markdownSelection.restore(editNode);
        let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
        item.click();
        let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
        dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
        item = <HTMLElement>popup.querySelectorAll('.e-item')[3];
        item.click();
        item = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList');
        item.click();
        item = rteObj.element.querySelector('#' + controlId + '_toolbar_ClearFormat');
        item.click();
        let lines: string[] = editNode.value.split('\n');
        expect(new RegExp('^(#)|^(>)', 'gim').test(lines[1])).toBe(false);
    });
    afterAll(() => {
        destroy(rteObj);
    });

    describe('EJ2-23858 Iframe angular destroy issue', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let innerHTML: string = `Lists are a piece of cake
            They even auto continue as you type
            A double enter will end them
            Tabs and shift-tabs work too`;
        let controlId: string;
        let isDestroyed: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: { enable: true },
                value: innerHTML, toolbarSettings: {
                    items: ['Formats', 'UnorderedList', 'ClearFormat']
                },
                destroyed: () => {
                    isDestroyed = true;
                }
            });
            elem = rteObj.element;
            controlId = elem.id;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
        });

        it(' Check the destroyed event after remove the element from DOM ', () => {
            rteObj.element.remove();
            rteObj.destroy();
            expect(isDestroyed).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});

describe('EJ2-24017 - Enable the submit button while pressing the tab key - RTE reactive form ', () => {
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', action: 'tab' };
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                    'FontName']
            }
        });
        editNode = rteObj.contentModule.getEditPanel();
        curDocument = rteObj.contentModule.getDocument();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it(' tab key navigation from RTE content without text', () => {
        selectNode = editNode.querySelector('br');
        setCursorPoint(curDocument, selectNode, 0);
        (rteObj as any).keyDown(keyBoardEvent);
        expect(editNode.textContent.length === 0).toBe(true);
    });
});

describe('Tab key navigation with empty RTE content and enableTabKey is set true', () => {
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', keyCode: 9, target: document.body };
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                    'FontName']
            },
            enableTabKey: true
        });
        editNode = rteObj.contentModule.getEditPanel();
        curDocument = rteObj.contentModule.getDocument();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it(' tab key navigation from RTE with empty content', () => {
        selectNode = editNode.querySelector('p');
        setCursorPoint(curDocument, selectNode, 0);
        (rteObj as any).keyDown(keyBoardEvent);
        let expectedInnerHTML: string = `&nbsp;&nbsp;&nbsp;&nbsp;`;
        expect(selectNode.innerHTML === expectedInnerHTML).toBe(true);
    });
});

describe('EJ2-24065 - Unwanted content show while changing the locale property in  RichTextEditor ', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeEach((done: Function) => {
        elem = document.createElement('div');
        elem.innerHTML = `<p class="p-node"><b>Description:</b></p>`;
        elem.id = 'EJ2-24065-defaultRTE';
        elem.setAttribute('name', 'RTEName');
        document.body.appendChild(elem);
        done();
    });
    it(' Change the locale dynamically and check the content', () => {
        rteObj = new RichTextEditor();
        rteObj.appendTo("#EJ2-24065-defaultRTE");
        rteObj.locale = 'de-DE';
        rteObj.dataBind();
        let pNodes: any = rteObj.element.querySelectorAll('.p-node');
        expect(pNodes.length === 1).toBe(true);
    });
    it(' Value poperty should be set as high priority ', () => {
        rteObj = new RichTextEditor({ value: '<p>RTE</p>' });
        rteObj.appendTo("#EJ2-24065-defaultRTE");
        rteObj.locale = 'de-DE';
        rteObj.dataBind();
        let pNodes: any = rteObj.element.querySelectorAll('.p-node');
        expect(pNodes.length === 0).toBe(true);
    });
    afterEach((done) => {
        destroy(rteObj);
        detach(elem);
        done();
    });
});

describe('EJ2-23854 - Redo action occurs for keyboard shortcuts copy command with text selection & no text selection ', () => {
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab' };
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let editNode: Element;
    let rteEle: Element;
    let selectNode: Element;
    let controlId: string;
    beforeAll(() => {
        rteObj = renderRTE({

        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        curDocument = rteObj.contentModule.getDocument();
        controlId = rteEle.id;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it(' check the undo and redo button when copy action', () => {
        selectNode = editNode.querySelector('br');
        setCursorPoint(curDocument, selectNode, 0);
        keyBoardEvent.action = 'copy';
        (rteObj as any).keyDown(keyBoardEvent);
        let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
        expect(item.parentElement.classList.contains("e-overlay")).toBe(true);
        item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
        expect(item.parentElement.classList.contains("e-overlay")).toBe(true);
    });
});

describe('EJ2-26042 - ExecuteCommand method performs wrongly to insert the bold command while focusing the outside of RTE. ', () => {
    let rteObj: RichTextEditor;
    it(' apply bold command through executeCommand - EditorMode as HTML ', () => {
        rteObj = renderRTE({});
        rteObj.executeCommand('bold');
        let strong: any = rteObj.inputElement.querySelectorAll('strong');
        expect(strong.length === 1).toBe(true);
    });
    it(' apply bold command through executeCommand - EditorMode as markdown ', () => {
        rteObj = renderRTE({
            editorMode: 'Markdown'
        });
        rteObj.executeCommand('bold');
        expect((rteObj.inputElement as HTMLTextAreaElement).value === '****').toBe(true);
    });
    it(' apply bold command through executeCommand - EditorMode as HTML and  Iframe ', () => {
        rteObj = renderRTE({
            iframeSettings: {
                enable: true
            }
        });
        rteObj.executeCommand('bold');
        let strong: any = rteObj.inputElement.querySelectorAll('strong');
        expect(strong.length === 1).toBe(true);
    });
    afterEach((done) => {
        destroy(rteObj);
        done();
    });
});

describe("keyConfig property testing", () => {
    let rteObj: RichTextEditor;
    var keyboardEventArgs = {
        preventDefault: function () { },
        ctrlKey: true,
        charCode: 71,
        keyCode: 71,
        which: 71,
        code: 71,
        action: 'bold',
        type: 'keydown'
    };
    beforeAll(() => {
        rteObj = renderRTE({
            keyConfig: { 'bold': 'ctrl+g' },
            value: '<p id="pnode1">Sample</p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode2">Sample</p>' +
                '<p id="pnode3">Sample</p>'
        });
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check bold using ctrl+q shortcut key', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode1");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('strong');
    });
});

// describe('EJ2-26359 Clear Format is not working after applied selection and parent based tags', () => {
//     let innerHtml: string = `<p>The rich text editor is WYSIWYG ("what you see is what you get") editor useful to create and edit content, and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank">markdown</a> of the content</p><p><strong>Table</strong></p><p>Inserts the manages table.</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;" class=""><p>column 1<br></p><p>column 2</p></td><td style="width: 50%;"><p><br></p></td></tr></tbody></table><p><b>Toolbar</b></p><p>Toolbar contains commands to align the text, insert link, insert image, insert list, undo/redo operations, HTML view, etc </p><ol><li><p>Toolbar is fully customizable</p></li></ol><p><b>Image.</b></p><p><span>Allows you to insert images from an online source as well as the local computer</span></p><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;">`;
//     let rteObj: RichTextEditor;
//     let controlId: string;
//     let rteElement: HTMLElement;
//     beforeAll((done: Function) => {
//         rteObj = renderRTE({
//             value: innerHtml,
//             toolbarSettings: {
//                 items: ['ClearFormat']
//             }
//         });
//         controlId = rteObj.element.id;
//         rteElement = rteObj.element;
//         done();
//     });

//     it(' Clear the inline and block nodes ', (done) => {
//         rteObj.selectAll();
//         let item: HTMLElement = rteElement.querySelector("#" + controlId + '_toolbar_ClearFormat');
//         dispatchEvent(item, 'mousedown');
//         item.click();
//         setTimeout(() => {
//             let expectedHTML: string = `<p>The rich text editor is WYSIWYG ("what you see is what you get") editor useful to create and edit content, and return the valid HTML markup or markdown of the content</p><p>Table</p><p>Inserts the manages table.</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;" class=""><p>column 1<br></p><p>column 2</p></td><td style="width: 50%;"><p><br></p></td></tr></tbody></table><p>Toolbar</p><p>Toolbar contains commands to align the text, insert link, insert image, insert list, undo/redo operations, HTML view, etc </p><p>Toolbar is fully customizable</p><p>Image.</p><p>Allows you to insert images from an online source as well as the local computer</p><p><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"></p>`;
//             expect(expectedHTML === rteObj.inputElement.innerHTML).toBe(true);
//             done();
//         });
//     });
//     afterAll(() => {
//         destroy(rteObj);
//     });
// });

describe('EJ2-26545 Empty P tag create while give the value with empty space in RichTextEditor', () => {
    let innerHtml: string = `<p class="e-one-paragraph">EJ2 RichTextEditor with HtmlEditor</p>
    <p class="e-one-paragraph">EJ2 RichTextEditor with Markdown</p>
     <p class="e-two-paragraph">EJ2 RichTextEditor with IframeEditor</p>ss`;
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innerHtml
        });
        done();
    });

    it("don't create the p tag to empty text node ", (done) => {
        let emptyNode: NodeListOf<Element> = <NodeListOf<Element>>rteObj.inputElement.querySelectorAll("p:empty");
        setTimeout(() => {
            expect(emptyNode.length === 0).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('To change the keyconfig API property', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'Print']
            }
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it(' To trigger onproperty change method in HTMLEditor', () => {
        expect(rteObj.formatter.keyConfig.bold === 'ctrl+b').toBe(true);
        rteObj.formatter = new HTMLFormatter({ keyConfig: { 'bold': 'ctrl+q' } });
        expect(rteObj.formatter.keyConfig.bold === 'ctrl+q').toBe(true);
    });
});

describe('EJ2-29801 Tab and shift+tab key combination should have same behavior', () => {
    let innerHtml: string = `<p class="e-one-paragraph">EJ2 RichTextEditor with HtmlEditor</p>
    <p class="e-one-paragraph">EJ2 RichTextEditor with Markdown</p>
     <p class="e-two-paragraph">EJ2 RichTextEditor with IframeEditor</p>ss`;
    let rteObj: RichTextEditor;
    let inpEle: HTMLElement;
    let evt: any;
    beforeAll((done: Function) => {
        inpEle = createElement('input', { id: 'testinput' });
        document.body.appendChild(inpEle);
        rteObj = renderRTE({
            value: innerHtml
        });
        done();
    });
    it("check tab press on toolbar behavior", function () {
        (<any>rteObj).getToolbarElement().focus();
        evt = new Event("focus");
        evt.relatedTarget = inpEle;
        (<any>rteObj).focusHandler(evt);
        expect(document.activeElement != rteObj.getToolbarElement()).toBe(true);
    });
    afterAll((done) => {
        destroy(rteObj);
        detach(inpEle);
        done();
    });
});

describe('EJ2-29801 Tab and shift+tab key combination should have same behavior', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test'), attrs: { tabindex: "1" } });
        document.body.appendChild(element);
        rteObj = new RichTextEditor();
        rteObj.appendTo(element);
        done();
    });
    it("check whether the provided tabindex in the element is added to editable input", function () {
        expect(rteObj.htmlAttributes.tabindex === rteObj.inputElement.getAttribute("tabindex")).toBe(true);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('Value property when xhtml is enabled', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enableXhtml: true,
            value: `<!-- sit amet --><div><!-- sit amet --><p>ad<br/><hr/>asd</p></div>`
        });
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it("value property checking when xhtml is enabled", function () {
        expect(rteObj.value).toBe('<div><p>ad<br/></p><hr/>asd<p><br/></p></div>');
        rteObj.value = '<p>value changeded <br/></p>';
        rteObj.dataBind();
        expect(rteObj.value).toBe("<p>value changeded <br/></p>");
    });
});

describe('XHTML validation', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({ enableXhtml: true });
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it("clean", function () {
        rteObj.value = "<!-- sit amet --><div><!-- sit amet --><p>adasd</p></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe("<div><p>adasd</p></div>");
    });
    it("AddRootElement", function () {
        rteObj.value = "<div><p>adasd</p></div><div><p>adasd</p></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe("<div><p>adasd</p></div><div><p>adasd</p></div>");
    });
    it("ImageTags", function () {
        rteObj.value = ' <img src="image.jpg"><p> dfg<img src="image.jpg"> ds</p> ';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p> <img src="image.jpg" class="e-rte-image e-imginline" alt=""></p><p> dfg<img src="image.jpg" class="e-rte-image e-imginline" alt=""> ds</p><p> </p>');
    });
    it("removeTags", function () {
        rteObj.value = "<ul> <li>Coffee</li> <br>   <li>Tea</li> <br>   <li>Milk</li> <br>  </ul> <ol>   <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>  </ol>   ";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<ul> <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>   </ul><p> </p><ol>   <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>  </ol><p>   </p>');
        rteObj.value = "<span><p>dfsddfsdf</p> <table></table></span>   <span><p>asdasdsd </p></span>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p><span></span></p><p>dfsddfsdf</p> <table class="e-rte-table"></table>   <span></span><p></p>');
        rteObj.value = '<div><div contenteditable="true"><p contenteditable="true">text</p><div><p>text</p></div></div></div>';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<div><div><p>text</p><div><p>text</p></div></div></div>');
    });
    it("RemoveUnsupported", function () {
        rteObj.value = "<div contenteditable='true'><table contenteditable='true'> </table></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<div><table contenteditable="true" class="e-rte-table"> </table></div>');
    });
    it("Underline tag", function () {
        rteObj.value = "<p>Rich <u>Text</u> Editor</p><p>Sync<u>fusion</u></p>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>Rich <span style="text-decoration: underline;">Text</span> Editor</p><p>Sync<span style="text-decoration: underline;">fusion</span></p>');
    });
    it("Underline tag", function () {
        rteObj.value = "<p>Rich<strong>Text</strong> Editor</p><p>Sync<strong>fusion</srong></p>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>Rich<b>Text</b> Editor</p><p>Sync<b>fusion</b></p>');
    });
    it("v:image", function () {
        rteObj.value = '<p>sync<v:image src="zip.gif"></v:image>sync</p><v:image src="zip.gif"></v:image>';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>syncsync</p>');
    });
});

describe('XHTML validation -iframe', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enableXhtml: true,
            iframeSettings: { enable: true }
        });
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it("EJ2-43894 - When value property not set throws console error issue test case", function () {
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
    });
    it("clean", function () {
        rteObj.value = "<!-- sit amet --><div><!-- sit amet --><p>adasd</p></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe("<div><p>adasd</p></div>");
    });
    it("AddRootElement", function () {
        rteObj.value = "<div><p>adasd</p></div><div><p>adasd</p></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe("<div><p>adasd</p></div><div><p>adasd</p></div>");
    });
    it("ImageTags", function () {
        rteObj.value = ' <img src="image.jpg"><p> dfg<img src="image.jpg"> ds</p> ';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p> <img src="image.jpg" class="e-rte-image e-imginline" alt=""></p><p> dfg<img src="image.jpg" class="e-rte-image e-imginline" alt=""> ds</p><p> </p>');
    });
    it("removeTags", function () {
        rteObj.value = "<ul> <li>Coffee</li> <br>   <li>Tea</li> <br>   <li>Milk</li> <br>  </ul> <ol>   <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>  </ol>   ";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<ul> <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>   </ul><p> </p><ol>   <li>Coffee</li>    <li>Tea</li>    <li>Milk</li>  </ol><p>   </p>');
        rteObj.value = "<span><p>dfsddfsdf</p> <table></table></span>   <span><p>asdasdsd </p></span>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p><span></span></p><p>dfsddfsdf</p> <table class="e-rte-table"></table>   <span></span><p></p>');
        rteObj.value = '<div><div contenteditable="true"><p contenteditable="true">text</p><div><p>text</p></div></div></div>';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<div><div><p>text</p><div><p>text</p></div></div></div>');
    });
    it("RemoveUnsupported", function () {
        rteObj.value = "<div contenteditable='true'><table contenteditable='true'> </table></div>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<div><table contenteditable="true" class="e-rte-table"> </table></div>');
    });
    it("Underline tag", function () {
        rteObj.value = "<p>Rich <u>Text</u> Editor</p><p>Sync<u>fusion</u></p>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>Rich <span style="text-decoration: underline;">Text</span> Editor</p><p>Sync<span style="text-decoration: underline;">fusion</span></p>');
    });
    it("Underline tag", function () {
        rteObj.value = "<p>Rich<strong>Text</strong> Editor</p><p>Sync<strong>fusion</srong></p>";
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>Rich<b>Text</b> Editor</p><p>Sync<b>fusion</b></p>');
    });
    it("v:image", function () {
        rteObj.value = '<p>sync<v:image src="zip.gif"></v:image>sync</p><v:image src="zip.gif"></v:image>';
        rteObj.enableXhtml = false;
        rteObj.enableXhtml = true;
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p>syncsync</p>');
    });

    it("EJ2-43894 - Empty value throws console error issue test case", function () {
        rteObj.value = '';
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
    });
});

describe('IFrame - Util - setEditFrameFocus method testing', function () {
    let rteObj: RichTextEditor;
    beforeAll(function (done) {
        rteObj = renderRTE({
            iframeSettings: { enable: true }
        });
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it("Set focus with active element testing", function (done) {
        setEditFrameFocus(rteObj.inputElement, 'iframe');
        setTimeout(() => {
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentWindow.document.activeElement.tagName).toEqual('BODY');
            done();
        }, 10);
    });
});

describe('Check undo in execCommand', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: "<p>RTE</p>",
            toolbarSettings: {
                items: ['Undo', 'Redo']
            }
        });
        done();
    });
    it('Image insert execCommand method', () => {
        (rteObj as any).inputElement.focus();
        let curDocument: Document;
        curDocument = rteObj.contentModule.getDocument();
        setCursorPoint(curDocument, (rteObj as any).inputElement, 0);
        let el = document.createElement("img");
        el.src = "https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png";
        (rteObj as any).inputElement.focus();
        rteObj.executeCommand("insertImage", el, { undo: true });
        expect((rteObj as any).inputElement.querySelector('img').src).toBe('https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png');
        expect(rteObj.element.querySelector('[title="Undo (Ctrl+Z)"]').classList.contains('e-overlay')).toBe(false);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('Check destroy method', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: "<p>RTE</p>"
        });
        done();
    });
    it('Check rte element', () => {
        rteObj.destroy();
        expect(document.querySelector('e-richtexteditor')).toBe(null);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('RTE content element height check-Pixel', function () {
    let rteObj: any;
    let elem: any;
    beforeAll(function (done) {
        elem = document.createElement('div');
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        document.getElementById('defaultRTE').style.display = 'none';
        rteObj = new RichTextEditor({
            height: '100px',
            toolbarSettings: {
                enable: false
            }
        });
        rteObj.appendTo("#defaultRTE");
        done();
    });
    it('Check pixel', function (done) {
        document.getElementById('defaultRTE').style.display = 'block';
        setTimeout(() => {
            expect(rteObj.contentModule.getPanel().offsetHeight).toBe(18);
            done();
        }, 100);

    });
    afterAll(function (done) {
        destroy(rteObj);
        detach(elem);
        done();
    });
});

describe('RTE content element height check-percentage', function () {
    let rteObj: any;
    let elem: any;
    beforeAll(function (done) {
        elem = document.createElement('div');
        elem.id = 'defaultRTE';
        document.body.appendChild(elem);
        (document.getElementById('defaultRTE') as HTMLElement).style.display = 'none';
        rteObj = new RichTextEditor({
            height: '50%',
            toolbarSettings: {
                enable: false
            }
        });
        rteObj.appendTo("#defaultRTE");
        done();
    });
    it('check pecentage', function (done) {
        document.getElementById('defaultRTE').style.display = 'block';
        setTimeout(() => {
            expect(rteObj.contentModule.getPanel().offsetHeight).toBe(18);
            done();
        }, 100);

    });
    afterAll(function (done) {
        destroy(rteObj);
        detach(elem);
        done();
    });
});

describe('RTE - Edited changes are not reflect using value after typed value', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['SourceCode']
            },
            value: `<div><p>First p node-0</p></div>`,
            placeholder: 'Type something',
            autoSaveOnIdle: true
        });
        rteObj.saveInterval = 10;
        rteObj.dataBind();
        done();
    });
    it("AutoSave the value in interval time", (done) => {
        rteObj.focusIn();
        (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
        expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
        keyboardEventArgs.ctrlKey = false;
        keyboardEventArgs.shiftKey = false;
        keyboardEventArgs.action = 'enter';
        keyboardEventArgs.which = 13;
        (rteObj as any).keyUp(keyboardEventArgs);
        setTimeout(() => {
            expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(true);
            (rteObj as any).inputElement.innerHTML = `<div><p>First p node-2</p></div>`;
            expect(rteObj.value !== '<div><p>First p node-2</p></div>').toBe(true);
            (rteObj as any).keyUp(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.value === '<div><p>First p node-2</p></div>').toBe(true);
                done();
            }, 400);
        }, 400);
    });
    it(" Clear the setInterval at component blur", (done) => {
        rteObj.focusOut();
        (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
        expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
        setTimeout(() => {
            expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(false);
            done();
        }, 110);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('BLAZ-5899: getText public method with new line test', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `<p>Test</p><p><br></p><p>Multiline</p><p><br></p><p>More lines</p>`;
    beforeEach(() => {
    });
    it(' DIV', () => {
        rteObj = renderRTE({ value: innerHTML });
        expect(rteObj.getText() === 'Test\n\n\n\n\nMultiline\n\n\n\n\nMore lines').toBe(true);
    });
    it(' IFrame', () => {
        rteObj = renderRTE({ iframeSettings: { enable: true }, value: innerHTML });
        expect(rteObj.getText() === 'Test\n\n\n\n\nMultiline\n\n\n\n\nMore lines').toBe(true);
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('EJ2-46060: EJ2CORE-606: 8203 character not removed after start typing', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => { });
    it(' DIV', () => {
        rteObj = renderRTE({});
        rteObj.focusIn();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        rteObj.value = `<p><strong id='focusNode'>​r</strong></p>`;
        rteObj.dataBind();
        expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText.search(/\u200B/g) === 0).toBe(true);
        let focusNode = document.getElementById('focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 1, 1);
        dispatchKeyEvent(rteObj.element.querySelector('.e-content'), 'keypress', { 'key': 'a', 'keyCode': 65 });
        keyboardEventArgs.key = 'a';
        keyboardEventArgs.which = 65;
        keyboardEventArgs.keyCode = 65;
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).keyUp(keyboardEventArgs);
        expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText.search(/\u200B/g) === -1).toBe(true);
        expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText === 'a').toBe(false);
        expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerHTML).toBe(`<p><strong id="focusNode">r</strong></p>`);
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('EJ2-47075: Applying heading to the content in the Rich Text Editor applies heading to the next element', () => {
    let rteObj: RichTextEditor;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => { });
    it('Checking the heading format applied for element.', (done: Function) => {
        rteObj = renderRTE({
            value: `<h3 id="node1"><span>Plan voor training en bewustzijn</span></h3><p>Om bij het personeel van Spectator bewustzijn met betrekking tot
            informatiebeveiliging te creëren worden verschillende activiteiten georganiseerd. <br /> </p>
          <p /><p>In de bijlage van het ISMS is een aanwezigheidsregistratie opgenomen waarin per activiteit aangegeven staat welke
            medewerkers hierbij aanwezig geweest zijn, daarnaast is er een bijlage beschikbaar met een overzicht van de trainingen en details hierover.</p>`,
        });
        let node: Node = document.getElementById('node1');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, node.childNodes[0].childNodes[0], (node as any).nextElementSibling, 0, 0);
        (rteObj as any).mouseUp({ target: node.childNodes[0], detail: 3 });
        rteObj.executeCommand('justifyRight');
        expect((rteObj.inputElement.querySelector('#node1') as any).style.textAlign).toBe('right');
        done();
    });
    afterEach(() => {
        destroy(rteObj);
    });
    describe('EJ2-61402 - script error occurs when press ctrl button in list', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'c', stopPropagation: () => { }, shiftKey: false, which: 67 };
        it('check the list element', (done: Function) => {
            rteObj = renderRTE({
                value: `<ul><li>vhbj</li><li>bnm<ul><li>bjnkl</li><li class="focusNode">njkml<br></li></ul></li></ul>`,
            });
            let node: any = (rteObj as any).inputElement.querySelector('.focusNode').childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, node, node, 0, 0);
            keyBoardEvent.keyCode = 67;
            keyBoardEvent.code = 'C';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(window.getSelection().focusOffset === 0).toBe(true);
            expect(window.getSelection().anchorOffset === 0).toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
});

describe('Initial audio and video loading', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<p><audio controls><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"/></audio></p>
            <p><video controls><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4" /></video></p>`,
        });
    });
    it('audio and video with BR tags and wrapper loaded', (done: Function) => {
        expect(rteObj.inputElement.querySelector('.e-audio-wrap') !== null).toBe(true);
        expect(rteObj.inputElement.querySelector('.e-audio-wrap').nextElementSibling.outerHTML === '<br>').toBe(true);
        expect(rteObj.inputElement.querySelector('.e-video-wrap') !== null).toBe(true);
        expect(rteObj.inputElement.querySelector('.e-video-wrap').nextElementSibling.outerHTML === '<br>').toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('Dialog textbox aria-lable checking', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => {
        rteObj = renderRTE({
            value: '<p>Sample</p>',
            toolbarSettings: {
                items: ['Image', 'CreateLink', 'Audio', 'Video']
            }
        });
    });
    it('Dialog textbox aria-lable checking for image, link, audio, video', (done: Function) => {
        (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-img-url').getAttribute('aria-label')).toBe('You can also provide a link from the web');
        rteObj.closeDialog(DialogType.InsertImage);
        (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-rte-linkurl').getAttribute('aria-label')).toBe('Web address');
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-rte-linkText').getAttribute('aria-label')).toBe('Display text');
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-rte-linkTitle').getAttribute('aria-label')).toBe('Enter a title');
        rteObj.closeDialog(DialogType.InsertLink);
        (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).click();
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-audio-url').getAttribute('aria-label')).toBe('You can also provide a link from the web');
        rteObj.closeDialog(DialogType.InsertAudio);
        (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[3] as HTMLElement).click();
        expect(rteObj.element.querySelector('.e-dialog').querySelector('.e-embed-video-url').getAttribute('aria-label')).toBe('Media Embed URL');
        rteObj.closeDialog(DialogType.InsertVideo);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe("fontfamily testing after default value set -", () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    let EnterkeyboardEventArgs = {
        preventDefault: function () { },
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        char: '',
        key: '',
        charCode: 13,
        keyCode: 13,
        which: 13,
        code: 'Enter',
        action: 'enter',
        type: 'keydown'
    };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['FontName']
            },
            fontFamily: {
                default: 'Arial',
                items: [
                    {
                        text: 'Arial',
                        value: 'Arial,Helvetica,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Book Antiqua',
                        value:
                            '"Book Antiqua", Palatino, "Palatino Linotype", "Palatino LT STD", Georgia, serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Calibri',
                        value: 'Calibri, "Open Sans", Arial,Helvetica,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Comic Sans MS',
                        value:
                            '"Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Courier New',
                        value: 'Courier New,Courier,monospace,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Georgia',
                        value: 'Georgia, "Times New Roman", Times, serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Gill Sans MT',
                        value:
                            '"Gill Sans MT", "Myriad Pro", Myriad, Helvetica, Arial, sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Great vibes',
                        value: 'Great Vibes,cursive',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Helvetica',
                        value: 'Helvetica,Arial,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Roboto',
                        value: 'Roboto, "Segoe UI",Arial,Helvetica,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Segoe UI',
                        value: '"Segoe UI", "Open Sans",Arial,Helvetica,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Shizuru',
                        value: 'Shizuru, cursive',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Symbol',
                        value: 'Symbol',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Tahoma',
                        value: 'Tahoma,Geneva,sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Terminal',
                        value: 'Terminal',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Times New Roman',
                        value: 'Times New Roman,Times,serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Trebuchet MS',
                        value:
                            'trebuchet ms, "Myriad Pro", Myriad, Helvetica, Arial, sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                    {
                        text: 'Verdana',
                        value: 'verdana, "Myriad Pro", Myriad, Helvetica,Arial, sans-serif',
                        command: 'Font',
                        subCommand: 'FontName',
                    },
                ],
            }
        });
        elem = rteObj.element;
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Dynamic mode RTE testing fontfamily', (done: Function) => {
        rteObj.focusIn();
        rteObj.contentModule.getEditPanel().innerHTML = '<p>Testing</p>';
        let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0].firstChild;
        let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
        (<any>rteObj).keyDown(EnterkeyboardEventArgs);
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        ((document.querySelector('.e-font-name-tbar-btn ul') as HTMLElement).childNodes[0] as HTMLElement).click();
        expect((((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild as HTMLElement).style.fontFamily === 'Arial, Helvetica, sans-serif').toBe(true);
        nodetext = ((<any>rteObj).contentModule.getEditPanel().childNodes[1] as HTMLElement).firstElementChild.firstChild;
        setCursorPoint(document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(EnterkeyboardEventArgs);
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        ((document.querySelector('.e-font-name-tbar-btn ul') as HTMLElement).childNodes[17] as HTMLElement).click();
        expect((((rteObj.contentModule.getEditPanel() as HTMLElement).childNodes[2] as HTMLElement).firstElementChild as HTMLElement).style.fontFamily === 'verdana, "Myriad Pro", Myriad, Helvetica, Arial, sans-serif').toBe(true);
        done();
    });
});

describe("Toobar item focus testing -", () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br></p><p style="text-align:center; margin-bottom: 5px; "><span style="font-family:Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></span><br></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-family:Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></span></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p>
            </div><div id="defaultRTE2"><p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br></p><p style="text-align:center; margin-bottom: 5px; "><span style="font-family:Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></span><br></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-family:Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></span></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p></div><div id="defaultRTE3"><p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br></p><p style="text-align:center; margin-bottom: 5px; "><span style="font-family:Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></span><br></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-family:Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></span></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p>`
        });
        elem = rteObj.element;
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('checking the toolbar item is in active state', (done: Function) => {
        rteObj.focusIn();
        rteObj.selectAll();
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        expect(((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).parentElement.classList.contains('e-active')).toBe(true);
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        expect(((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).parentElement.classList.contains('e-active')).toBe(false);
        ((elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        expect(((elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).querySelector('button') as HTMLButtonElement).parentElement.classList.contains('e-active')).toBe(true);
        ((elem.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        expect(((elem.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).querySelector('button') as HTMLButtonElement).parentElement.classList.contains('e-active')).toBe(true);
        done();
    });
});

describe('EJ2-69171 - RichTextEditor text area value has missing close tag when enableXhtml is true', function () {
    let rteObj: any;
    let keyBoardEvent = { type: 'keydown', preventDefault: function () { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: function () { }, shiftKey: false, which: 8 };
    beforeAll(function (done) {
        rteObj = renderRTE({
            enableXhtml: true,
            value: `<div><p></p></div>`
        });
        done();
    });
    it("close tag checking when enableXhtml is true", function (done) {
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        (rteObj as any).keyUp(keyboardEventArgs);
        setTimeout(() => {
            expect(rteObj.value === `<div><p><br/></p></div>`).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-71449 - The placeholder and enter text values have merged', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['SourceCode']
            },
            placeholder: 'Type something',
        });
        done();
    });
    it("The placeholder needs to be removed when entering the value", function (done) {
        expect((rteObj as any).value).toBe(null);
        expect((rteObj as any).placeholder).toBe("Type something");
        let rteEle = rteObj.element;
        let SourceCodePicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        SourceCodePicker.click();
        rteObj.focusOut();
        rteObj.focusIn();
        setTimeout(() => {
            expect((rteObj as any).element.querySelector("rte-placeholder")).toBe(null);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('EJ2-71306 - PlaceHolder is not working with Iframe mode in RichTextEditor', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            iframeSettings: {
                enable: true
            },
            placeholder: 'Type something',
        });
        done();
    });
    it("PlaceHolder should show properly with Iframe mode in RichTextEditor.", function (done) {
        expect((rteObj as any).value).toBe(null);
        setTimeout(() => {
            expect((rteObj as any).placeholder).toBe('Type something');
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('836937 - Rich Text Editor Table Module', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enableXhtml: true,
            value: `<table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td class="tdElement"></td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
          </table><div id="elementCursorPosition">Rich Text Editor</div>`
        });
        done();
    });
    it("Table selection", function (done) {
        rteObj.focusIn();
        let element: Element = rteObj.contentModule.getDocument().getElementById("elementCursorPosition");
        let selectioncursor: NodeSelection = new NodeSelection();
        let range: Range = document.createRange();
        range.setStart(element, 1);
        selectioncursor.setRange(document, range);
        var keyBoardEvent = { type: 'keyup', preventDefault: function () { }, key: 'ArrowRight', keyCode: 39, stopPropagation: function () { }, shiftKey: false, which: 39 };
        rteObj.keyUp(keyBoardEvent);
        setTimeout(() => {
            expect((window.getSelection().anchorNode as any).closest("td") == null).toBe(true);
            done();
        }, 100);
    });
    it("Remove the selection from the previous table", function (done) {
        rteObj.focusIn();
        var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("tdElement");
        let selectioncursor: NodeSelection = new NodeSelection();
        let range: Range = document.createRange();
        range.setStart(tdElement[0], 1);
        selectioncursor.setRange(document, range);
        var keyBoardEvent = { type: 'keyup', preventDefault: function () { }, key: 'ArrowRight', keyCode: 39, stopPropagation: function () { }, shiftKey: false, which: 39 };
        rteObj.mouseDownHandler({ target: rteObj.element.querySelectorAll('.tdElement')[0], isTrusted: true });
        rteObj.keyDown(keyBoardEvent);
        rteObj.keyUp(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.element.querySelectorAll('.tdElement')[0].classList.contains("e-cell-select") == false).toBe(true);
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('845077 - The Enter key action is not working properly while setting enableXhtml to true', function () {
    let rteObj: any;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enableXhtml: true,
            value: null,
            placeholder: 'Type something',
        });
        done();
    });
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8 };
    it("Enter key action should not add zerowidthspace with null value", function () {
        expect((rteObj as any).value).toBe('<p><br/></p>');
        let node: any = (rteObj as any).inputElement;
        setCursorPoint(document, node, 0);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
        expect((rteObj as any).inputElement.innerHTML).toBe('<p><br></p><p><br></p>');
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('842745 - Space Keypress causes the console error and the cursor position is removed', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p>Object2</p><p class="focusNode">rrr,&nbsp;</p><p style="font-family: &quot;Open Sans&quot;; border: none; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-stretch: inherit; line-height: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; padding: 0px; vertical-align: baseline;"><span style="border: none; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 8pt; margin: 0px; padding: 0px; vertical-align: baseline;">Hello GIVENNAME,FAMILYNAME&ZeroWidthSpace;</span></p>`
        });
    });

    it('826826 - Space Keypress causes the console error and the cursor position is removed', () => {
        let keyBoardEvent: any = { preventDefault: () => { }, key: ' ', stopPropagation: () => { }, shiftKey: false, which: 32 };
        let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
        editNode.focus();
        keyBoardEvent.which = 32;
        keyBoardEvent.code = 'Space';
        let focusNode: any = editNode.querySelector('.focusNode')
        let sel1 = new NodeSelection().setSelectionText(document, focusNode.firstChild, focusNode.firstChild, 5, 5);
        rteObj.executeCommand('insertHTML', 'object2');
        setCursorPoint(document, focusNode.childNodes[1], focusNode.childNodes[1].textContent.length);
        keyBoardEvent.type = 'keyup';
        (rteObj as any).keyUp(keyBoardEvent);
        expect(rteObj.inputElement === document.activeElement).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('846696 - Ctrl+Z undo doesn’t works in smart suggestion sample', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 65, key: '' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Bold']
            },
        });
    });
    it('Undo with keyboard action initial status', () => {
        rteObj.value = "Rich Text Editor";
        keyBoardEvent.which = 65;
        keyBoardEvent.keyCode = 65;
        rteObj.keyDown(keyBoardEvent);
        rteObj.dataBind()
        expect(rteObj.formatter.editorManager.undoRedoManager.undoRedoStack[0] != null).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('820213 - Text get deleted while applying bold', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p class='focusNode'>Rich Text Editor</p>`
        });
    });
    it('apply the bold to the text', () => {
        let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
        editNode.focus();
        let focusNode: any = editNode.querySelector('.focusNode')
        let sel1 = new NodeSelection().setSelectionText(document, focusNode.firstChild, focusNode.firstChild, 8, 8);
        let boldEle: HTMLElement = document.querySelector('[title="Bold (Ctrl+B)"]');
        boldEle.click();
        boldEle = document.querySelector('[title="Bold (Ctrl+B)"]');
        boldEle.click();
        expect(rteObj.inputElement.innerHTML === '<p class="focusNode">Rich Text Editor</p>').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe("852045 - Not able to resize the table when having saveInterval as 1.", function () {
    var rteObj: RichTextEditor;
    beforeAll(function () {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CreateTable']
            },
            saveInterval: 1,
            value: `<table class=\"e-rte-table\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"\" style=\"width: 14.687%;\"><br></td><td style=\"width: 51.9262%;\"><br></td><td style=\"width: 33.3333%;\"><br></td></tr><tr><td style=\"width: 14.687%;\"><br></td><td style=\"width: 51.9262%;\"><br></td><td style=\"width: 33.3333%;\"><br></td></tr></tbody></table><p>RTE</p><div class=\"e-table-rhelper null e-column-helper\" style=\"height: 50px; top: 16px; left: 198px;\"></div>`
        });
        rteObj.saveInterval = 10;
        rteObj.dataBind();
    });
    afterAll(function (done) {
        destroy(rteObj);
        done();
    });
    it("Table resize gripper element", function (done) {
        let table: any = (rteObj.tableModule as any).contentModule.getEditPanel().querySelector('table');
        (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
        expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box') !== null).toBe(true);
        rteObj.focusIn();
        setTimeout(function () {
            var resizeElement = document.createElement("div");
            resizeElement.innerHTML = rteObj.value;
            expect(resizeElement.querySelectorAll(".e-table-box").length == 0).toBe(true);
            done();
        }, 400);
    });
    it("Table resize gripper element in getHtml method", function (done) {
        let table: any = (rteObj.tableModule as any).contentModule.getEditPanel().querySelector('table');
        (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
        var resizeElement = document.createElement("div");
        resizeElement.innerHTML = rteObj.getHtml();
        expect(resizeElement.querySelectorAll(".e-table-box").length == 0).toBe(true);
        done();
    });
});

describe('849092 - Triple click a word doesnt select the whole paragraph (block node) in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<h3>
            <span>Plan voor training en bewustzijn</span>
            </h3>
            <p>
                Om bij het personeel van Spectator bewustzijn met betrekking tot
                informatiebeveiliging te creëren worden verschillende
                activiteiten georganiseerd. <br />
            </p>
            <p />
            <p>
                In de bijlage van het ISMS is een aanwezigheidsregistratie
                opgenomen waarin per activiteit aangegeven staat welke
                medewerkers hierbij aanwezig geweest zijn, daarnaast is er een
                bijlage beschikbaar met een overzicht van de trainingen en
                details hierover.
            </p>`
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Should render the paragraph with br tag', () => {
        expect(rteObj.element.querySelectorAll('p')[1].innerHTML).toBe('<br>');
    });
});

describe('69081 - When user paste the table in insert media option, It doesn’t paste properly ', () => {
    let editor: RichTextEditor;
    let editorElem: HTMLElement;
    beforeAll(() => {
        editorElem = createElement('div', { id: '69081_RTE' });
        document.body.appendChild(editorElem);
        RichTextEditor.Inject(HtmlEditor, Toolbar, QuickToolbar, PasteCleanup);
        editor = new RichTextEditor({});
        editor.appendTo('#69081_RTE');
    });
    afterAll(() => {
        editor.destroy();
        detach(editorElem);
    });
    it('Paste the table copied to the editor should remove resize elements when paste cleanup injected', (done: DoneFn) => {
        editor.focusIn();
        editor.pasteCleanupSettings.allowedStyleProps = null;
        editor.pasteCleanupSettings.allowedStyleProps = undefined;
        const clipBoardData: string = `<!--StartFragment--><table class="e-rte-table" style="box-sizing: border-box; border-spacing: 0px; border-collapse: collapse; background-color: rgb(255, 255, 255); empty-cells: show; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: 1503px; min-width: 0px;"><tbody style="box-sizing: border-box;"><tr style="box-sizing: border-box;"><td class="" style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.688px;"><br style="box-sizing: border-box;"></td></tr><tr style="box-sizing: border-box; height: 25px;"><td class="e-cell-select" style="box-sizing: border-box; padding: 2px 5px; border: 1px double rgb(4, 120, 215); height: 24.67px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td class="" style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.688px;"><br style="box-sizing: border-box;"></td></tr><tr style="box-sizing: border-box;"><td class="" style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.656px;"><br style="box-sizing: border-box;"></td><td class="" style="box-sizing: border-box; padding: 2px 5px; border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; vertical-align: middle; width: 500.688px;"><br style="box-sizing: border-box;"></td></tr></tbody></table><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><br style="box-sizing: border-box;"></p><span data-col="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: col-resize; height: 76px; overflow: visible; position: absolute; width: 4px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 16px; left: 16px;"></span><span data-col="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: col-resize; height: 76px; overflow: visible; position: absolute; width: 4px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 16px; left: 517px;"></span><span data-col="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: col-resize; height: 76px; overflow: visible; position: absolute; width: 4px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 16px; left: 1017px;"></span><span data-col="3" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: col-resize; height: 76px; overflow: visible; position: absolute; width: 4px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 16px; left: 1518px;"></span><span data-row="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: row-resize; height: 4px; overflow: visible; position: absolute; width: 1503px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 39px; left: 16px;"></span><span data-row="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: row-resize; height: 4px; overflow: visible; position: absolute; width: 1503px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 64px; left: 16px;"></span><span data-row="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="box-sizing: border-box; background-color: rgb(255, 255, 255); background-repeat: repeat; bottom: 0px; cursor: row-resize; height: 4px; overflow: visible; position: absolute; width: 1503px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; top: 89px; left: 16px;"></span><br class="Apple-interchange-newline"><!--EndFragment-->`;
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect(editor.contentModule.getEditPanel().querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box, .e-table-rhelper, .e-img-resize').length).toBe(0);
            done();
        }, 100);
    });
});

describe('872399 - Close the table popup using esc key, the focus does not move table icon ', () => {
    let editor: RichTextEditor;
    beforeAll(() => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['CreateTable', 'OrderedList', 'UnorderedList']
            }
        });
    });
    afterAll(() => {
        destroy(editor);
    });
    it('Should focus on the toolbar element instead of the Editor content.', (done: DoneFn) => {
        editor.focusIn();
        const tableButton: HTMLElement = editor.element.querySelector('.e-rte-toolbar .e-toolbar-item button');
        tableButton.click();
        setTimeout(() => {
            const escapekeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT);
            document.activeElement.closest('.e-rte-table-popup').dispatchEvent(escapekeyDownEvent);
            setTimeout(() => {
                //expect(document.activeElement === tableButton).toBe(true);
                done();
            }, 100);
        }, 100);
    });
});

describe('865660 -  Table cell select class is not removed after pasting the table', () => {
    let editor: RichTextEditor;
    function dispatchEnterAction() {
        const keyDownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, view: window, key: 'a', ctrlKey: true });
        editor.inputElement.dispatchEvent(keyDownEvent);
        const keyUpEvent = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, view: window, key: 'a', ctrlKey: true });
        editor.inputElement.dispatchEvent(keyUpEvent);
    }
    beforeEach(() => {
        editor = renderRTE({
            value: `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
            <p><b>Toolbar</b></p>
            <ol>
                <li>
                    <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
                </li>
                <li>
                    <p>The Toolbar is fully customizable </p>
                </li>
            </ol>
            <p><b>Links</b></p>
            <ol>
                <li>
                    <p>You can insert a hyperlink with its corresponding dialog </p>
                </li>
                <li>
                    <p>Attach a hyperlink to the displayed text. </p>
                </li>
                <li>
                    <p>Customize the quick toolbar based on the hyperlink </p>
                </li>
            </ol>
            <p><b>Image.</b></p>
            <ol>
                <li>
                    <p>Allows you to insert images from an online source as well as the local computer </p>
                </li>
                <li>
                    <p>You can upload an image </p>
                </li>
                <li>
                    <p>Provides an option to customize the quick toolbar for an image </p>
                </li>
            </ol>
            <img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;"/>
            <table class="e-rte-table" style="width: 54.7572%; min-width: 0px; height: 109px;">
                <thead>
                    <tr>
                        <th class="">SNo<br></th>
                        <th class="">Task<br></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 23.7179%;" class="">1</td>
                        <td style="width: 75.641%;" class="">Ensuring the Accessibility for the Rich Text Editor.</td>
                    </tr>
                    <tr>
                        <td style="width: 23.7179%;" class="">2</td>
                        <td style="width: 75.641%;" class="">Ensuring the Accessibility for the Kanban.<br></td>
                    </tr>
                </tbody>
            </table>
            <p>
                <video controls>
                    <source
                        src="https://www.w3schools.com/tags/movie.mp4"
                        type="video/mp4" />
                </video>
            </p>
            <p><b>Get started with Quick Toolbar to click on an audio</b></p>
            <p>Using the quick toolbar, users can replace, display, and delete the selected audio.</p>
            <p>
                <audio controls>
                    <source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3" />
                </audio>
            </p>`
        });
    });
    afterEach(() => {
        destroy(editor);
    });
    it('Should remove the cell select class after the CTRL + A selection', () => {
        editor.focusIn();
        const tdELem = editor.inputElement.querySelector('td');
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseoverEvent);
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseUpEvent);
        dispatchEnterAction();
        expect(editor.inputElement.querySelector('.e-cell-select')).toBe(null);
    });
    it('Should remove the e-img-focus class after the CTRL + A selection', () => {
        editor.focusIn();
        const imgELem = editor.inputElement.querySelector('img');
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
        imgELem.dispatchEvent(mouseoverEvent);
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        imgELem.dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        imgELem.dispatchEvent(mouseUpEvent);
        dispatchEnterAction();
        expect(editor.inputElement.querySelector('.e-img-focus')).toBe(null);
    });
    it('Should remove the e-audio-focus class after the CTRL + A selection', () => {
        editor.focusIn();
        const audioELem = editor.inputElement.querySelector('audio');
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
        audioELem.dispatchEvent(mouseoverEvent);
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        audioELem.dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        audioELem.dispatchEvent(mouseUpEvent);
        dispatchEnterAction();
        expect(editor.inputElement.querySelector('.e-audio-focus')).toBe(null);
    });
    it('Should remove the e-video-focus class after the CTRL + A selection', () => {
        editor.focusIn();
        const videoELem = editor.inputElement.querySelector('video');
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
        videoELem.dispatchEvent(mouseoverEvent);
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        videoELem.dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        videoELem.dispatchEvent(mouseUpEvent);
        dispatchEnterAction();
        expect(editor.inputElement.querySelector('.e-video-focus')).toBe(null);
    });
    it('Should remove the cell select when focused out of the editor.', () => {
        editor.focusIn();
        const tdELem = editor.inputElement.querySelector('td');
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseoverEvent);
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        tdELem.dispatchEvent(mouseUpEvent);
        editor.focusOut();
        expect(editor.inputElement.querySelector('.e-cell-select')).toBe(null);
    });
});

describe('852939 - Undo redo is enabled by default in the quick format toolbar sample issue', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            quickToolbarSettings: {
                text: ['FormatPainter', 'Bold', 'Italic', 'Underline', 'Formats', '-', 'Alignments', 'OrderedList', 'UnorderedList', 'CreateLink', 'Image']
            },
            toolbarSettings: {
                type: ToolbarType.MultiRow,
                enableFloating: false,
            },
            value: '<p>data</p>'
        });
        elem = rteObj.element;
        done();
    });
    it('Checking the undo and rendo is in the disable state when the toolbar type is multi-row.', () => {
        expect(elem.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
        expect(elem.querySelectorAll(".e-toolbar-item")[14].classList.contains("e-overlay")).toBe(true);
        expect(elem.querySelectorAll(".e-toolbar-item")[15].classList.contains("e-overlay")).toBe(true);
    });
    it('Checking the undo and rendo is in the disable state when the toolbar type is Scrollable', () => {
        rteObj.toolbarSettings.type = ToolbarType.Scrollable;
        expect(elem.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
        expect(elem.querySelectorAll(".e-toolbar-item")[14].classList.contains("e-overlay")).toBe(true);
        expect(elem.querySelectorAll(".e-toolbar-item")[15].classList.contains("e-overlay")).toBe(true);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('849074 - List not cleared properly after selection of the whole list and then pressing empty space', () => {
    let rteObj: RichTextEditor;
    let startNode: HTMLElement;
    let endNode: HTMLElement;
    let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 32 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<ol id="content-edit" contenteditable="true">
            <li class="startNode">
                <p id="firstli">The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
            </li>
            <li class="endNode">
                <p id="secondli">The Toolbar is fully customizable </p>
            </li>
        </ol>`
        });
    });

    it('Checking that the list is cleared properly when pressing the empty space', () => {
        let keyBoardEvent: any = { preventDefault: () => { }, key: ' ', stopPropagation: () => { }, shiftKey: false, which: 32 };
        let editNode: HTMLElement = rteObj.contentModule.getEditPanel() as HTMLElement;
        startNode = editNode.querySelector('#firstli');
        endNode = editNode.querySelector('#secondli');
        let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
        rteObj.focusIn();
        keyBoardEvent.which = 32;
        keyBoardEvent.code = 'Space';
        keyBoardEvent.type = 'keydown';
        (rteObj as any).keyDown(keyBoardEvent);
        keyBoardEvent.type = 'keyup';
        (rteObj as any).keyUp(keyBoardEvent);
        expect(!isNullOrUndefined(startNode)).toBe(true);
        expect(startNode.childNodes.length === 1).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('865021 - in smart suggestions Tab key press on the list is not working properly.', () => {
    let elem: string = "<div class=\"e-content e-lib e-keyboard e-mention\" id=\"smartSuggestionRTE_rte-edit-view\" contenteditable=\"true\" tabindex=\"0\" role=\"textbox\" aria-label=\"mention\"><ol><li>Testing 1</li><li>Testing 2</li><li>Testing 3</li></ol></div>";
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            value: elem,
        });
        rteEle = rteObj.element;
    });
    it(' in smart suggestions Tab key press on the list is not working properly', () => {
        let contentEditableDiv: HTMLElement = document.getElementById('smartSuggestionRTE_rte-edit-view');
        let range = document.createRange();
        let selection = window.getSelection();
        range.setStart((contentEditableDiv as HTMLElement).firstChild.firstChild, 0);
        selection.removeAllRanges();
        selection.addRange(range);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: function () { }, key: 'Tab', keyCode: 9, stopPropagation: function () { }, shiftKey: false, which: 9 };
        (rteObj as RichTextEditor).keyDown(keyBoardEvent);
        expect(contentEditableDiv.outerHTML === '<div class="e-content e-lib e-keyboard e-mention" id="smartSuggestionRTE_rte-edit-view" contenteditable="true" tabindex="0" role="textbox" aria-label="mention"><ol><li style="list-style-type: none;"><ol><li>Testing 1</li></ol></li><li>Testing 2</li><li>Testing 3</li></ol></div>').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('86573 - Mention list not inserts in the cursor position into the RichTextEditor', () => {
    let rteObj: RichTextEditor;
    let blurSpy: jasmine.Spy = jasmine.createSpy('onBlur');
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            iframeSettings: {
                enable: true
            },
            saveInterval: 0,
            change: blurSpy
        });
        done();
    });
    it('checking range before and after when & is typed', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = "<p>&</p>";
        rteObj.dataBind();
        expect(rteObj.element.classList.contains('e-focused')).toBe(true);
        let node = (rteObj as any).inputElement.querySelector('p');
        rteObj.focusIn();
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        let e: EventListenerOrEventListenerObject;
        (rteObj as any).blurHandler({} as FocusEvent);
        expect(blurSpy).toHaveBeenCalled();
        const range2 = document.createRange();
        range2.selectNodeContents(node);
        const selection2 = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range2);
        expect(selection === selection2).toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('850064 -  Quotation format not changed while changing the format', () => {
    let rteObj: RichTextEditor;
    beforeEach((done) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Formats', 'OrderedList', 'UnorderedList']
            },
            format: {
                types: [
                    { text: 'Paragraph', value: 'P' },
                    { text: 'Code', value: 'Pre'},
                    { text: 'Quotation', value: 'BlockQuote', cssClass: 'e-quote'},
                    { text: 'Heading 1', value: 'H1' },
                    { text: 'Heading 2', value: 'H2' },
                    { text: 'Heading 3', value: 'H3' },
                    { text: 'Heading 4', value: 'H4' }
                ]
            },
            value: `<ol><li>The Rich Text Editor (RTE) control is an easy to render in the
            client side.</li></ol>`
        });
        done();
    });
    it('toggle option to list for blockquotes', (done: Function) => {
        setCursorPoint(document, rteObj.inputElement.querySelector("li").childNodes[0] as Element, 0,);
        let formatsDropDown: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Formats');
        formatsDropDown.click();
        (document.querySelector('#' + rteObj.element.id + '_toolbar_Formats-popup').querySelector(".e-item.e-quote") as HTMLElement).click();
        expect(rteObj.inputElement.querySelector("li").parentElement.parentElement.nodeName.toLowerCase() === 'blockquote').toBe(true);
        formatsDropDown.click();
        (document.querySelector('#' + rteObj.element.id + '_toolbar_Formats-popup').querySelector(".e-item.e-quote") as HTMLElement).click();
        expect(rteObj.inputElement.querySelector("li").parentElement.parentElement.nodeName.toLowerCase() === 'blockquote').toBe(false);
        done();
    });
    it('toggle option to paragraph for blockquotes', (done: Function) => {
        rteObj.value = `<blockquote>The Rich Text Editor (RTE) control is an easy to render in the
        client side.</blockquote>`;
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("blockquote").childNodes[0] as Element, 0,);
        let formatsDropDown: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Formats');
        formatsDropDown.click();
        (document.querySelector('#' + rteObj.element.id + '_toolbar_Formats-popup').querySelector(".e-item.e-quote") as HTMLElement).click();
        expect(isNullOrUndefined(rteObj.inputElement.querySelector("blockquote"))).toBe(true);
        done();
    });
    it('toggle option to paragraph for blockquotes', (done: Function) => {
        rteObj.value = `<blockquote>The Rich Text Editor (RTE) control is an easy to render in the
        client side.</blockquote>`;
        rteObj.enterKey = 'DIV';
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("blockquote").childNodes[0] as Element, 0,);
        let formatsDropDown: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Formats');
        formatsDropDown.click();
        (document.querySelector('#' + rteObj.element.id + '_toolbar_Formats-popup').querySelector(".e-item.e-quote") as HTMLElement).click();
        expect(isNullOrUndefined(rteObj.inputElement.querySelector("blockquote"))).toBe(true);
        done();
    });
    it('revert from blockquotes while pressing enter key', (done: Function) => {
        rteObj.value = `<blockquote><ol><li>The Rich Text Editor (RTE) control is an easy to render in the
            client side.</li></ol><p><br></p><p><br></p></blockquote>`;
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("ol").nextSibling.nextSibling.childNodes[0] as Element, 0,);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(false);
        (rteObj as any).keyDown(keyBoardEvent);
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(true);
        done();
    });
    it('revert from blockquotes while pressing enter key while configuring zerowidthspace', (done: Function) => {
        rteObj.value = `<blockquote><ol><li>testing</li></ol><p>&#8203;</p><p>&#8203;</p></blockquote>`;
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("ol").nextSibling.nextSibling.childNodes[0] as Element, 0);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(false);
        (rteObj as any).keyDown(keyBoardEvent);
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(true);
        expect(rteObj.inputElement.innerHTML === `<blockquote><ol><li>testing</li></ol><p>​</p></blockquote><p><br></p>`).toBe(true);
        done();
    });
    it('dont revert from blockquotes while pressing enter key while configuring zerowidthspace', (done: Function) => {
        rteObj.value = `<blockquote><ol><li>testing</li></ol><p>testing</p><p>testing</p></blockquote>`;
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("ol").nextSibling.nextSibling.childNodes[0] as Element, 0,);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(false);
        done();
    });
    it('revert from blockquotes while pressing enter key while configuring zerowidthspace', (done: Function) => {
        rteObj.value = `<blockquote><ol><li>testing</li></ol><p>testing</p><p><br></p></blockquote>`;
        rteObj.dataBind();
        setCursorPoint(document, rteObj.inputElement.querySelector("ol").nextSibling.nextSibling.childNodes[0] as Element, 0,);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (rteObj as any).keyDown(keyBoardEvent);
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector("blockquote").nextSibling) ).toBe(true);
        expect(rteObj.inputElement.innerHTML === `<blockquote><ol><li>testing</li></ol><p>testing</p></blockquote><p><br></p>`).toBe(true);
        done();
    });
    afterEach((done) => {
        destroy(rteObj);
        done();
    });
});

describe('876818 - The action Begin and action Complete events not triggered while clicking the image dialogue from toolbar in Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let selectNode: Element;
    let actionBeginEvent: boolean = true;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
    let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
    beforeEach((done) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Audio', 'Video', 'Image', 'CreateTable']
            },
            value: innerHTML,
            actionBegin:function(){
                actionBeginEvent = false;
            }
        });
        done();
    });
    it('insert-image: ctrl+shift+i', function () {
        (rteObj as any).focusIn();
        selectNode = rteObj.element.querySelector('.first-p');
        let sel = new NodeSelection().setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 1, 5);
        keyBoardEvent.ctrlKey = true;
        keyBoardEvent.shiftKey = true;
        keyBoardEvent.code = 'KeyI';
        keyBoardEvent.action = 'insert-image';
        (rteObj as any).keyDown(keyBoardEvent);
        expect(actionBeginEvent).toBe(true);
    });
    it('Insert table: ctrl+shift+e', function () {
        (rteObj as any).focusIn();
        selectNode = rteObj.element.querySelector('.first-p');
        let sel = new NodeSelection().setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 1, 5);
        keyBoardEvent.ctrlKey = true;
        keyBoardEvent.shiftKey = true;
        keyBoardEvent.code = 'KeyE';
        keyBoardEvent.action = 'insert-table';
        (rteObj as any).keyDown(keyBoardEvent);
        expect(actionBeginEvent).toBe(true);
    });
    it('insert-audio: ctrl+shift+a', function () {
        (rteObj as any).focusIn();
        selectNode = rteObj.element.querySelector('.first-p');
        let sel = new NodeSelection().setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 1, 5);
        keyBoardEvent.ctrlKey = true;
        keyBoardEvent.shiftKey = true;
        keyBoardEvent.code = 'KeyA';
        keyBoardEvent.action = 'insert-audio';
        (rteObj as any).keyDown(keyBoardEvent);
        expect(actionBeginEvent).toBe(true);
    });
    it('insert-video: ctrl+alt+v', function () {
        (rteObj as any).focusIn();
        selectNode = rteObj.element.querySelector('.first-p');
        let sel = new NodeSelection().setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 1, 5);
        keyBoardEvent.ctrlKey = true;
        keyBoardEvent.shiftKey = false;
        keyBoardEvent.altKey = true;
        keyBoardEvent.code = 'KeyV';
        keyBoardEvent.action = 'insert-video';
        (rteObj as any).keyDown(keyBoardEvent);
        expect(actionBeginEvent).toBe(true);
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('876271 - Checking the tooltip is notshown when the dropdown is in open state', () => {
    let rteObj: RichTextEditor;
    beforeAll((done) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList']
            },
            value: "Rich Text Editor"
        });
        done();
    });
    it('Checking the tooltip is notshown when the dropdown is in open state', (done: Function) => {
        const dropButton: NodeList = document.body.querySelectorAll('.e-dropdown-btn');
        (dropButton[0] as HTMLElement).click();
        event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        dropButton[0].dispatchEvent(event);
        expect((dropButton[0] as HTMLElement).getAttribute('data-content')).toBe(null);
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
});
describe('881576 - The tooltips are not destroyed when the dialog with the editor is closed by a keyboard action.', () => {
    let rteObj: RichTextEditor;
    beforeAll((done)=> {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Bold', 'FullScreen'],
             type: ToolbarType.Expand ,
            },
            value : "Rich Text Editor"
        });
        done();
    });
    it('Tooltip hide while Esc key is pressed', (done: Function) => {
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        toolbarItems[0].dispatchEvent(event);
        let toolTipContent = document.querySelector('.e-tip-content');
        expect(toolTipContent).not.toBe(null);
        rteObj.destroy();
        setTimeout(function () {
            expect(document.body.contains(toolTipContent)).toBe(false);
            done();
        }, 100)
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});  
describe("Null or undefined value testing", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        const ele = createElement('div', { id: 'rteTarget' });
        document.body.appendChild(ele);
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("autoSaveOnIdle", () => {
        rteObj = new RichTextEditor({ autoSaveOnIdle: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.autoSaveOnIdle).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ autoSaveOnIdle: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.autoSaveOnIdle).toBe(false);
        rteObj.destroy();
    });
    it("backgroundColor", () => {
        rteObj = new RichTextEditor({ backgroundColor: {
            columns: null
        } });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.backgroundColor.columns).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ backgroundColor: {
            columns: undefined
        } });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.backgroundColor.columns).toBe(10);
        rteObj.destroy();

        rteObj = new RichTextEditor({ backgroundColor: {
            colorCode: null
        } });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.backgroundColor.colorCode).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ backgroundColor: {
            colorCode: undefined
        } });
        rteObj.appendTo('#rteTarget');
        let result = true;
        const defaultValue: string[] = ['', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633','#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccff', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9','#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080ff', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f','#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53','#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999','#000099', '#b30000', '#000066', '#660066', '#86592d','#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26']
        rteObj.backgroundColor.colorCode.Custom.forEach((item,index) => {
            if(item !== defaultValue[index]){
                result = false;
            }
        })
        expect(result).toBe(true);
        rteObj.destroy();
    });
    it("bulletFormatList", () => {
        rteObj = new RichTextEditor({ bulletFormatList: {types: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.bulletFormatList.types).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ bulletFormatList: {types: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.bulletFormatList.types.length === 4).toBe(true);
        rteObj.destroy();
    });
    it("cssClass", () => {
        rteObj = new RichTextEditor({ cssClass: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.cssClass).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ cssClass: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.cssClass).toBe(null);
        rteObj.destroy();
    });
    it("editorMode", () => {
        rteObj = new RichTextEditor({ editorMode: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.editorMode).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ editorMode: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.editorMode).toBe('HTML');
        rteObj.destroy();
    });
    it("emojiPickerSettings", () => {
        rteObj = new RichTextEditor({ emojiPickerSettings: {iconsSet : null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.emojiPickerSettings.iconsSet).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ emojiPickerSettings: {iconsSet: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.emojiPickerSettings.iconsSet.length === 7).toBe(true);
        rteObj.destroy();
        rteObj = new RichTextEditor({ emojiPickerSettings: {showSearchBox : null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.emojiPickerSettings.showSearchBox).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ emojiPickerSettings: {showSearchBox: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.emojiPickerSettings.showSearchBox).toBe(true);
        rteObj.destroy();
    });
    it("enableAutoUrl", () => {
        rteObj = new RichTextEditor({ enableAutoUrl: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableAutoUrl).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableAutoUrl: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableAutoUrl).toBe(false);
        rteObj.destroy();
    });
    it("enableHtmlEncode", () => {
        rteObj = new RichTextEditor({ enableHtmlEncode: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableHtmlEncode).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableHtmlEncode: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableHtmlEncode).toBe(false);
        rteObj.destroy();
    });
    it("enableHtmlSanitizer", () => {
        rteObj = new RichTextEditor({ enableHtmlSanitizer: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableHtmlSanitizer).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableHtmlSanitizer: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableHtmlSanitizer).toBe(true);
        rteObj.destroy();
    });
    it("enablePersistence", () => {
        rteObj = new RichTextEditor({ enablePersistence: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enablePersistence).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enablePersistence: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enablePersistence).toBe(false);
        rteObj.destroy();
    });
    it("enableResize", () => {
        rteObj = new RichTextEditor({ enableResize: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableResize).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableResize: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableResize).toBe(false);
        rteObj.destroy();
    });
    it("enableRtl", () => {
        rteObj = new RichTextEditor({ enableRtl: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableRtl).toBe(false);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableRtl: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableRtl).toBe(false);
        rteObj.destroy();
    });
    it("enableTabKey", () => {
        rteObj = new RichTextEditor({ enableTabKey: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableTabKey).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableTabKey: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableTabKey).toBe(false);
        rteObj.destroy();
    });
    it("enableXhtml", () => {
        rteObj = new RichTextEditor({ enableXhtml: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableXhtml).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enableXhtml: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enableXhtml).toBe(false);
        rteObj.destroy();
    });
    it("enabled", () => {
        rteObj = new RichTextEditor({ enabled: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enabled).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enabled: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enabled).toBe(true);
        rteObj.destroy();
    });
    it("enterKey", () => {
        rteObj = new RichTextEditor({ enterKey: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enterKey).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ enterKey: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.enterKey).toBe('P');
        rteObj.destroy();
    });
    it("fileManagerSettings", () => {
        //rteObj.fileManagerSettings.enable
        rteObj = new RichTextEditor({ fileManagerSettings: {enable:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.enable).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {enable:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.enable).toBe(false);
        rteObj.destroy();
        //rteObj.fileManagerSettings.path
        rteObj = new RichTextEditor({ fileManagerSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.path).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {path:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.path).toBe('/');
        rteObj.destroy();
        //rteObj.fileManagerSettings.path
        rteObj = new RichTextEditor({ fileManagerSettings: {ajaxSettings:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.ajaxSettings).not.toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {ajaxSettings:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.ajaxSettings).not.toBe(null);
        rteObj.destroy();
        //rteObj.fileManagerSettings.contextMenuSettings
        rteObj = new RichTextEditor({ fileManagerSettings: {contextMenuSettings:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.contextMenuSettings).not.toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {contextMenuSettings:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.contextMenuSettings).not.toBe(null);
        rteObj.destroy();
        //rteObj.fileManagerSettings.navigationPaneSettings
        rteObj = new RichTextEditor({ fileManagerSettings: {navigationPaneSettings:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.navigationPaneSettings).not.toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {navigationPaneSettings:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.navigationPaneSettings).not.toBe(null);
        rteObj.destroy();
        //rteObj.fileManagerSettings.toolbarSettings
        rteObj = new RichTextEditor({ fileManagerSettings: {toolbarSettings:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.toolbarSettings).not.toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {toolbarSettings:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.toolbarSettings).not.toBe(null);
        rteObj.destroy();
        //rteObj.fileManagerSettings.uploadSettings
        rteObj = new RichTextEditor({ fileManagerSettings: {uploadSettings:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.uploadSettings).not.toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: {uploadSettings:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fileManagerSettings.uploadSettings).not.toBe(null);
        rteObj.destroy();
    });
    it("floatingToolbarOffset", () => {
        rteObj = new RichTextEditor({ floatingToolbarOffset: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.floatingToolbarOffset).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fileManagerSettings: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.floatingToolbarOffset).toBe(0);
        rteObj.destroy();
    });
    it("fontColor", () => {
        //fontColor.columns
        rteObj = new RichTextEditor({ fontColor: {columns: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontColor.columns).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontColor: {columns: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontColor.columns).toBe(10);
        rteObj.destroy();
        //fontColor.colorCode
        rteObj = new RichTextEditor({ fontColor: {colorCode: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontColor.colorCode).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontColor: {colorCode: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontColor.colorCode.Custom.length === 60).toBe(true);
        rteObj.destroy();
    });
    it("fontFamily", () => {
        //fontFamily.default
        rteObj = new RichTextEditor({ fontFamily: {default: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.default).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontFamily: {default: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.default).toBe(null);
        rteObj.destroy();
        //fontFamily.width
        rteObj = new RichTextEditor({ fontFamily: {width: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontFamily: {width: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.width).toBe('72px');
        rteObj.destroy();
        //fontFamily.items
        rteObj = new RichTextEditor({ fontFamily: {items: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.items).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontFamily: {items: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontFamily.items.length === 8).toBe(true);
        rteObj.destroy();
    });
    it("fontSize", () => {
        //fontSize.default
        rteObj = new RichTextEditor({ fontSize: {default: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontSize.default).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontSize: {default: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontSize.default).toBe(null);
        rteObj.destroy();
        //fontSize.width
        rteObj = new RichTextEditor({ fontSize: {width: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontSize.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ fontSize: {width: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontSize.width ).toBe('60px');
        rteObj.destroy();
        //fontSize.items
        rteObj = new RichTextEditor({ fontSize: {items: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.fontSize.items).toBe(null);
        rteObj.destroy();
    });
    it("format", () => {
        //format.default
        rteObj = new RichTextEditor({ format: {default: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.default).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ format: {default: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.default).toBe(null);
        rteObj.destroy();
        //format.width
        rteObj = new RichTextEditor({ format: {width: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ format: {width: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.width).toBe('65px');
        rteObj.destroy();
        //format.types
        rteObj = new RichTextEditor({ format: {types: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.types).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ format: {types: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.format.types.length === 6).toBe(true);
        rteObj.destroy();
    });
    it("formatPainterSettings", () => {
        // formatPainterSettings.allowedFormats
        rteObj = new RichTextEditor({ formatPainterSettings: {allowedFormats: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatPainterSettings.allowedFormats).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ formatPainterSettings: {allowedFormats: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatPainterSettings.allowedFormats).toBe('b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;');
        rteObj.destroy();
        // formatPainterSettings.deniedFormats
        rteObj = new RichTextEditor({ formatPainterSettings: {deniedFormats: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatPainterSettings.deniedFormats).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ formatPainterSettings: {deniedFormats: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatPainterSettings.deniedFormats).toBe(null);
        rteObj.destroy();
    });
    it("formatter", () => {
        rteObj = new RichTextEditor({ formatter: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatter).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ formatter: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.formatter).toBe(null);
        rteObj.destroy();
    });
    it("height", () => {
        rteObj = new RichTextEditor({ height: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.height).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ height: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.height).toBe('auto');
        rteObj.destroy();
    });
    it("htmlAttributes", () => {
        rteObj = new RichTextEditor({ htmlAttributes: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.htmlAttributes).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ htmlAttributes: undefined });
        rteObj.appendTo('#rteTarget');
        expect(Object.keys(rteObj.htmlAttributes).length === 0 ).toBe(true);
        rteObj.destroy();
    });
    it("iframeSettings", () => {
        // iframeSettings.enable
        rteObj = new RichTextEditor({ iframeSettings: { enable:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.iframeSettings.enable).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ iframeSettings: { enable:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.iframeSettings.enable).toBe(false);
        rteObj.destroy();
        // iframeSettings.enable
        rteObj = new RichTextEditor({ iframeSettings: { attributes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.iframeSettings.attributes).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ iframeSettings: { attributes:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.iframeSettings.attributes).toBe(null);
        rteObj.destroy();
        // iframeSettings.resources
        rteObj = new RichTextEditor({ iframeSettings: { resources:null} });
        rteObj.appendTo('#rteTarget');
        // expect(rteObj.iframeSettings.resources).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ iframeSettings: { resources:undefined} });
        rteObj.appendTo('#rteTarget');
        // expect(rteObj.iframeSettings.resources).toBe(null);
        rteObj.destroy();
    });
    it("inlineMode", () => {
        // iframeSettings.enable
        rteObj = new RichTextEditor({ inlineMode: { enable:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.inlineMode.enable).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ inlineMode: { enable:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.inlineMode.enable).toBe(false);
        rteObj.destroy();
        // iframeSettings.onSelection
        rteObj = new RichTextEditor({ inlineMode: { onSelection:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.inlineMode.onSelection).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ inlineMode: { onSelection:undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.inlineMode.onSelection).toBe(true);
        rteObj.destroy();
    });
    it("insertAudioSettings", () => {
        // insertAudioSettings.allowedTypes
        rteObj = new RichTextEditor({ insertAudioSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertAudioSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        // insertAudioSettings.layoutOption
        rteObj = new RichTextEditor({ insertAudioSettings: {layoutOption:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.layoutOption).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertAudioSettings: {layoutOption:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.layoutOption).toBe(null);
        rteObj.destroy();
        // insertAudioSettings.saveFormat
        rteObj = new RichTextEditor({ insertAudioSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.saveFormat).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertAudioSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.saveFormat).toBe(null);
        rteObj.destroy();
        // insertAudioSettings.saveUrl
        rteObj = new RichTextEditor({ insertAudioSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.saveUrl).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertAudioSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.saveUrl).toBe(null);
        rteObj.destroy();
        // insertAudioSettings.path
        rteObj = new RichTextEditor({ insertAudioSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.path).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertAudioSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertAudioSettings.path).toBe(null);
        rteObj.destroy();
    });
    it("insertImageSettings", () => {
        // insertImageSettings.allowedTypes
        rteObj = new RichTextEditor({ insertImageSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        // insertImageSettings.display
        rteObj = new RichTextEditor({ insertImageSettings: {display:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.display).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {display:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.display).toBe(null);
        rteObj.destroy();
        // insertImageSettings.width
        rteObj = new RichTextEditor({ insertImageSettings: {width:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {width:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.width).toBe(null);
        rteObj.destroy();
        // insertImageSettings.height
        rteObj = new RichTextEditor({ insertImageSettings: {height:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.height).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {height:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.height).toBe(null);
        rteObj.destroy();
        // insertImageSettings.saveFormat
        rteObj = new RichTextEditor({ insertImageSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.saveFormat).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.saveFormat).toBe(null);
        rteObj.destroy();
        // insertImageSettings.saveUrl
        rteObj = new RichTextEditor({ insertImageSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.saveUrl).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.saveUrl).toBe(null);
        rteObj.destroy();
        // insertImageSettings.path
        rteObj = new RichTextEditor({ insertImageSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.path).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertImageSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertImageSettings.path).toBe(null);
        rteObj.destroy();
    });
    it("insertVideoSettings", () => {
        // insertVideoSettings.allowedTypes
        rteObj = new RichTextEditor({ insertVideoSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {allowedTypes:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.allowedTypes).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.layoutOption
        rteObj = new RichTextEditor({ insertVideoSettings: {layoutOption:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.layoutOption).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {layoutOption:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.layoutOption).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.width
        rteObj = new RichTextEditor({ insertVideoSettings: {width:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {width:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.width).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.height
        rteObj = new RichTextEditor({ insertVideoSettings: {height:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.height).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {height:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.height).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.saveFormat
        rteObj = new RichTextEditor({ insertVideoSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.saveFormat).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {saveFormat:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.saveFormat).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.saveUrl
        rteObj = new RichTextEditor({ insertVideoSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.saveUrl).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {saveUrl:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.saveUrl).toBe(null);
        rteObj.destroy();
        // insertVideoSettings.path
        rteObj = new RichTextEditor({ insertVideoSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.path).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ insertVideoSettings: {path:null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.insertVideoSettings.path).toBe(null);
        rteObj.destroy();
    });
    it("keyConfig", () => {
        rteObj = new RichTextEditor({ keyConfig: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.keyConfig).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ keyConfig: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.keyConfig).toBe(null);
        rteObj.destroy();
    });
    it("locale", () => {
        rteObj = new RichTextEditor({ locale: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.locale).toBe('en-US');
        rteObj.destroy();
        rteObj = new RichTextEditor({ locale: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.locale).toBe('en-US');
        rteObj.destroy();
    });
    it("maxLength", () => {
        rteObj = new RichTextEditor({ maxLength: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.maxLength).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ maxLength: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.maxLength).toBe(-1);
        rteObj.destroy();
    });
    it("numberFormatList", () => {
        rteObj = new RichTextEditor({ numberFormatList: {types: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.numberFormatList.types).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ numberFormatList: {types: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.numberFormatList.types.length === 7).toBe(true);
        rteObj.destroy();
    });
    it("placeholder", () => {
        rteObj = new RichTextEditor({ placeholder: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.placeholder).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ placeholder: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.placeholder).toBe(null);
        rteObj.destroy();
    });
    it("quickToolbarSettings", () => {
        //quickToolbarSettings.enable
        rteObj = new RichTextEditor({ quickToolbarSettings: {enable: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.quickToolbarSettings.enable).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ quickToolbarSettings: {enable: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.quickToolbarSettings.enable).toBe(true);
        rteObj.destroy();
        //quickToolbarSettings.actionOnScroll
        rteObj = new RichTextEditor({ quickToolbarSettings: {actionOnScroll: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.quickToolbarSettings.actionOnScroll).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ quickToolbarSettings: {actionOnScroll: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.quickToolbarSettings.actionOnScroll).toBe('hide');
        rteObj.destroy();
         //quickToolbarSettings.link
         rteObj = new RichTextEditor({ quickToolbarSettings: {link: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.link).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {link: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.link.length === 3).toBe(true);
         rteObj.destroy();
         //quickToolbarSettings.image
         rteObj = new RichTextEditor({ quickToolbarSettings: {image: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.image).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {image: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.image.length === 12).toBe(true);
         rteObj.destroy();
         //quickToolbarSettings.text
         rteObj = new RichTextEditor({ quickToolbarSettings: {text: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.text).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {text: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.text).toBe(null);
         rteObj.destroy();
         //quickToolbarSettings.table
         rteObj = new RichTextEditor({ quickToolbarSettings: {table: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.table).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {table: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.table.length === 9).toBe(true);
         rteObj.destroy();
         //quickToolbarSettings.audio
         rteObj = new RichTextEditor({ quickToolbarSettings: {audio: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.audio).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {audio: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.audio.length === 3).toBe(true);
         rteObj.destroy();
         //quickToolbarSettings.video
         rteObj = new RichTextEditor({ quickToolbarSettings: {video: null} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.video).toBe(null);
         rteObj.destroy();
         rteObj = new RichTextEditor({ quickToolbarSettings: {video: undefined} });
         rteObj.appendTo('#rteTarget');
         expect(rteObj.quickToolbarSettings.video.length === 5).toBe(true);
         rteObj.destroy();
    });
    it("readonly", () => {
        rteObj = new RichTextEditor({ readonly: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.readonly).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ readonly: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.readonly).toBe(false);
        rteObj.destroy();
    });
    it("saveInterval", () => {
        rteObj = new RichTextEditor({ saveInterval: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.saveInterval).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ saveInterval: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.saveInterval).toBe(10000);
        rteObj.destroy();
    });
    it("shiftEnterKey", () => {
        rteObj = new RichTextEditor({ shiftEnterKey: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.shiftEnterKey).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ shiftEnterKey: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.shiftEnterKey).toBe('BR');
        rteObj.destroy();
    })
    it("showCharCount", () => {
        rteObj = new RichTextEditor({ showCharCount: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.showCharCount).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ showCharCount: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.showCharCount).toBe(false);
        rteObj.destroy();
    });
    it("showTooltip", () => {
        rteObj = new RichTextEditor({ showTooltip: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.showTooltip).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ showTooltip: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.showTooltip).toBe(true);
        rteObj.destroy();
    });
    it("tableSettings", () => {
        //tableSettings.width
        rteObj = new RichTextEditor({ tableSettings: {width: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ tableSettings: {width: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.width).toBe('100%');
        rteObj.destroy();
        //tableSettings.styles
        rteObj = new RichTextEditor({ tableSettings: {styles: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.styles).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ tableSettings: {styles: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.styles.length === 2).toBe(true);
        rteObj.destroy();
        //tableSettings.resize
        rteObj = new RichTextEditor({ tableSettings: {resize: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.resize).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ tableSettings: {resize: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.resize).toBe(true);
        rteObj.destroy();
        //tableSettings.minWidth
        rteObj = new RichTextEditor({ tableSettings: {minWidth: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.minWidth).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ tableSettings: {minWidth: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.minWidth).toBe(0);
        rteObj.destroy();
        //tableSettings.maxWidth
        rteObj = new RichTextEditor({ tableSettings: {maxWidth: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.maxWidth).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ tableSettings: {maxWidth: undefined} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.tableSettings.maxWidth).toBe(null);
        rteObj.destroy();
    });
    it("toolbarSettings", () => {
        //toolbarSettings.enable
        rteObj = new RichTextEditor({ toolbarSettings: {enable: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.enable).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ toolbarSettings: {enable: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.enable).toBe(null);
        rteObj.destroy();
        //toolbarSettings.enableFloating
        rteObj = new RichTextEditor({ toolbarSettings: {enableFloating: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.enableFloating).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ toolbarSettings: {enableFloating: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.enableFloating).toBe(null);
        rteObj.destroy();
        //toolbarSettings.type
        rteObj = new RichTextEditor({ toolbarSettings: {type: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.type).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ toolbarSettings: {type: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.type).toBe(null);
        rteObj.destroy();
        //toolbarSettings.items
        rteObj = new RichTextEditor({ toolbarSettings: {items: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.items).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ toolbarSettings: {items: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.items).toBe(null);
        rteObj.destroy();
        //toolbarSettings.items
        rteObj = new RichTextEditor({ toolbarSettings: {itemConfigs: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.itemConfigs).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ toolbarSettings: {itemConfigs: null} });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.toolbarSettings.itemConfigs).toBe(null);
        rteObj.destroy();
    });
    it("undoRedoSteps", () => {
        rteObj = new RichTextEditor({ undoRedoSteps: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.undoRedoSteps).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ undoRedoSteps: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.undoRedoSteps).toBe(30);
        rteObj.destroy();
    });
    it("undoRedoTimer", () => {
        rteObj = new RichTextEditor({ undoRedoTimer: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.undoRedoTimer).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ undoRedoTimer: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.undoRedoTimer).toBe(300);
        rteObj.destroy();
    });
    it("value", () => {
        rteObj = new RichTextEditor({ value: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.value).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ value: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.value).toBe(null);
        rteObj.destroy();
    });
    it("width", () => {
        rteObj = new RichTextEditor({ width: null });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.width).toBe(null);
        rteObj.destroy();
        rteObj = new RichTextEditor({ width: undefined });
        rteObj.appendTo('#rteTarget');
        expect(rteObj.width).toBe('100%');
        rteObj.destroy();
    });
});

describe('286578: Dialog element not removed when destroying RTE instance in mobile mode', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
    let defaultUA: string = navigator.userAgent;
    beforeAll((done: Function) => {
        Browser.userAgent = mobileUA;
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Audio', 'Video', 'Image', 'CreateTable']
            }
        });
        rteEle = rteObj.element;
        done();
    });
    afterAll((done: Function) => {
        Browser.userAgent = defaultUA;
        destroy(rteObj);
        done();
    });
    it('Checking the dialog element in mobile mode', (done: Function) => {
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        (trgEle.firstElementChild as HTMLElement).click();
        (<any>rteObj).destroy();
        expect(document.querySelector('.e-dialog.e-rte-elements')).toBe(null);
        done();
    });
});

describe('Bug 908240: Number and Bullet list dropdowns are not applied on selecting it', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    let selectNode: HTMLElement;
    let editNode: HTMLElement;
    let curDocument: Document;
    let innerHTML: string = `<div><p class='first-p'>description</p><p>NumberFormatList</p></div>`;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Undo', 'Redo', 'NumberFormatList', 'BulletFormatList']
            }
        });
        elem = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
        curDocument = rteObj.contentModule.getDocument();
        editNode.innerHTML = innerHTML;
    });

    it('NumberFormatList dropdown action in mac', () => {
        rteObj.focusIn()
        selectNode = (editNode.querySelector('.first-p') as HTMLElement).firstChild as HTMLElement
        setCursor(selectNode, 1);
        let trg = document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0].childNodes[0] as HTMLElement
        let event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        trg.dispatchEvent(event);
        (document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0] as HTMLElement).click();
        (document.querySelector('.e-dropdown-popup').childNodes[0].childNodes[3] as HTMLElement).click();
        expect((editNode.querySelector('.first-p') as HTMLElement).innerHTML == `<li>description</li>`).toBe(true)
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe("Toobar list item focus testing -", () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<ul><li><br></li></ul>'
        });
        elem = rteObj.element;
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('checking the toolbar item is in active state', (done: Function) => {
        rteObj.focusIn();
        rteObj.selectAll();
       (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        expect(((elem.querySelectorAll(".e-toolbar-item.e-tbtn-align")[5] as HTMLElement).classList.contains('e-active'))).toBe(true);
        done();
    });
});

describe('904056: Count exceeds the maximum limit when copy paste content ', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
    let curDocument: Document;
    let selectNode: any;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<div><p class='first-p'>First p node-0</p></div>`,
            placeholder: 'Type something',
            maxLength: 100,
            editorMode: 'Markdown'
        });
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it('Preventing paste the content exceeds the maximum limit', (done) => {
        selectNode = document.querySelector('.e-content.e-lib.e-keyboard');
        setCursorPoint(curDocument, selectNode, 0);
        keyBoardEvent.clipboardData = {
            getData: (e: any) => {
                if (e === "text/plain") {
                    return 'Hi syncfusion website https://ej2.syncfusion.com is here with another URL https://ej2.syncfusion.com text after second URL';
                } else {
                    return '';
                }
            },
            items: []
        };
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            expect(!isNullOrUndefined(selectNode)).toBe(true);
            expect(selectNode.value.length === 48).toBe(true);
            done();
        }, 10);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('908836: When press the delete key remove the BR tag.', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p class="focusNode">1 Vem, poderoso Rei,<br>Teu nome cantarei;<br>Faz-me louvar;<br>Pai, glorioso és,<br>Tens tudo aos Teus pés,<br>Vem, reina sobre nós,<br>Eterno Deus.</p><p><br></p><p>2 Vem, ó Palavra de Deus,</p>`,
        });
        done();
    });
    it('Checking the the start container', (done: Function) => {
        let node: HTMLElement = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[0] as Element, node.childNodes[0].textContent.length);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe('<p class="focusNode">1 Vem, poderoso Rei,<br>Teu nome cantarei;<br>Faz-me louvar;<br>Pai, glorioso és,<br>Tens tudo aos Teus pés,<br>Vem, reina sobre nós,<br>Eterno Deus.</p><p><br></p><p>2 Vem, ó Palavra de Deus,</p>');
            done();
        }, 100);
    });

    it('Checking the the middle container', (done: Function) => {
        let node: HTMLElement = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[4] as Element, node.childNodes[4].textContent.length);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe('<p class="focusNode">1 Vem, poderoso Rei,<br>Teu nome cantarei;<br>Faz-me louvar;<br>Pai, glorioso és,<br>Tens tudo aos Teus pés,<br>Vem, reina sobre nós,<br>Eterno Deus.</p><p><br></p><p>2 Vem, ó Palavra de Deus,</p>');
            done();
        }, 100);
    });

    it('Checking the the end container', (done: Function) => {
        let node: HTMLElement = rteObj.inputElement.querySelector('.focusNode');
        setCursorPoint(document, node.childNodes[12] as Element, node.childNodes[12].textContent.length);
        (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe('<p class="focusNode">1 Vem, poderoso Rei,<br>Teu nome cantarei;<br>Faz-me louvar;<br>Pai, glorioso és,<br>Tens tudo aos Teus pés,<br>Vem, reina sobre nós,<br>Eterno Deus.<br></p><p>2 Vem, ó Palavra de Deus,</p>');
            done();
        }, 100);
    });
    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    });
});

describe('916913: After inserting a video into the table, the main toolbar is still enabled.', () => {
    let rteObj: RichTextEditor;
    let QTBarModule: IRenderer;
    let trg: HTMLElement;
    let id:string;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: `<table class=\"e-rte-table\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td style=\"width: 50%;\"><span class="e-audio-wrap" style="width:300px; margin:0 auto;" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br> <br></td><td style=\"width: 50%;\"><br></td></tr><tr><td style=\"width: 50%;\" class=\"e-cell-select\"><br></td><td style=\"width: 50%;\"><br></td></tr></tbody></table><p><br></p>`,
            toolbarSettings: {
                items: ['Undo', 'Redo', '|','Bold','Italic','Audio','Video']
            },
            quickToolbarSettings: {
                showOnRightClick: true
            }  
        });
        trg = rteObj.element.querySelector('.e-clickelem');
        let clickEvent: MouseEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("mousedown", true, true);
        trg.dispatchEvent(clickEvent);
        QTBarModule = getQTBarModule(rteObj);
        QTBarModule.audioQTBar.showPopup(0, 0, trg);
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the main toolbar is enabled when audio is right clicked', (done: Function) => {
        id = rteObj.getID();
        const elem = (rteObj as any).element.querySelector('#'+id+'_toolbar_Bold');
        expect(elem.parentElement.classList.contains('e-overlay')).toBe(true);
        done();
    })
});

describe('916913: After inserting a video into the table, the main toolbar is still enabled.', () => {
    let rteObj: RichTextEditor;
    let QTBarModule: IRenderer;
    let trg: HTMLElement;
    let id:string;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: `<table class=\"e-rte-table\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td style=\"width: 50%;\"><span class=\"e-video-wrap\" contenteditable=\"false\" title=\"mov_bbb.mp4\"><video class=\"e-rte-video e-videoinline\" controls=\"\"><source src=\"https://www.w3schools.com/html/mov_bbb.mp4\" type=\"video/mp4\"></video></span><br></td></tr><tr><td style=\"width: 50%;\" class=\"e-cell-select\"><br></td><td style=\"width: 50%;\"><br></td></tr></tbody></table><p><br></p>`,
            toolbarSettings: {
                items: ['Undo', 'Redo', '|','Bold','Italic','Audio','Video']
            },
            quickToolbarSettings: {
                showOnRightClick: true
            }  
        });
        trg = rteObj.element.querySelector('.e-rte-video');
        let clickEvent: MouseEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("mousedown", true, true);
        trg.dispatchEvent(clickEvent);
        QTBarModule = getQTBarModule(rteObj);
        QTBarModule.videoQTBar.showPopup(0, 0, trg);
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the main toolbar is enabled when video is right clicked', (done: Function) => {
        id = rteObj.getID();
        const elem = (rteObj as any).element.querySelector('#'+id+'_toolbar_Bold');
        expect(elem.parentElement.classList.contains('e-overlay')).toBe(true);
        done();
    })
});

describe('924586: cursor placed in the Zero width space and typed, cursor is misplaced', () => {
    let rteObj: RichTextEditor;
    let trg: HTMLElement;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: `&#8203; TestAmount:  <strong>&#8203;</strong><ul><li> item1 ≥ 38.3°C or  ≥ 38°C for 1 hour or more</li><li>  item1 ≥ 37.8°C or ≥ 37.5°C for 1 hour or more</li></ul></br>TestAmount2: </br><ul><li>  item1 < 0.5 x 109/L or expected to fall below 0.5 x 109/L within next 48 hours</li></ul>`
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the cursor position', (done: Function) => {
        setCursorPoint(document, rteObj.inputElement.children[0].firstChild as HTMLElement, 0);
        let keyDownEvent = { preventDefault: function () { }, key: 'A', stopPropagation: function () { }, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, which: 65 };
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', keyDownEvent));
        let keyUpEvent = { preventDefault: function () { }, key: 'A', stopPropagation: function () { }, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, which: 65 };
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', keyUpEvent));
        expect(rteObj.inputElement.children[0].textContent === ' TestAmount:  ')
        done();
    });
});
  
describe('872314: Image selection resize icon not removed while pressing the tab key.', ()=>{
    let editor: RichTextEditor;
    beforeAll(()=>{
        editor = renderRTE({
            enableTabKey: true,
            value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></p>`
        })
    });
    afterAll(()=>{
        destroy(editor);
    });
    it('Should cancel the resize action.',(done: DoneFn)=>{
        editor.focusIn();
        const image = editor.inputElement.querySelector('img');
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('p'), 0);
        range.setEnd(editor.inputElement.querySelector('p'), 1);
        editor.inputElement.ownerDocument.getSelection().removeAllRanges();
        editor.inputElement.ownerDocument.getSelection().addRange(range);
        clickImage(image);
        setTimeout(() => {
            const tabKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(tabKeyDownEvent);
            const tabKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(tabKeyUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('.e-img-resize').length).toBe(0);
                done();
            }, 100);
        }, 100);
    });
});

describe('872314: Image selection resize icon not removed while pressing the tab key.', ()=>{
    let editor: RichTextEditor;
    beforeAll(()=>{
        editor = renderRTE({
            enableTabKey: true,
            value: `<p><video controls style="width: 30%;"><sourcesrc="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4" /></video></p>`
        })
    });
    afterAll(()=>{
        destroy(editor);
    });
    it('Should cancel the video resize action.',(done: DoneFn)=>{
        editor.focusIn();
        const video = editor.inputElement.querySelector('video');
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('p'), 0);
        range.setEnd(editor.inputElement.querySelector('p'), 1);
        editor.inputElement.ownerDocument.getSelection().removeAllRanges();
        editor.inputElement.ownerDocument.getSelection().addRange(range);
        clickVideo(video);
        setTimeout(() => {
            const tabKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(tabKeyDownEvent);
            const tabKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(tabKeyUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('.e-vid-resize').length).toBe(0);
                done();
            }, 100);
        }, 100);
    });
});  

describe('923382: Apply background color to the table in iframe', () => {
    var rteObj: RichTextEditor;
        beforeEach(function (done: Function) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                iframeSettings: {
                    enable: true
                },
                value: "<table class=\"e-rte-table e-dashed-borders\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"tdElement\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\" class=\"e-cell-select\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table>"
            });
            done();
        });
        afterEach(function (done: Function) {
            destroy(rteObj);
            done();
        });
    it('Apply background color to selected td element', (done: Function) => {
        rteObj.focusIn();
            var tdElement :any = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).tableModule.setBGColor({
                "item": {
                    "command": "Font",
                    "subCommand": "BackgroundColor",
                    "value": "rgb(255, 255, 0)"
                },
                "name": "tableColorPickerChanged"
            });
            expect(tdElement.style.backgroundColor != '' ).toBe(true);
            done();
    });
});

describe('924321: Script Error Occurs When Closing Font Name Dropdown by Clicking Inside the RTE Editor.', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll( ()=> {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['FontName', 'FontSize', 'FontColor', 'BackgroundColor']
            },
            iframeSettings: {
                enable: true
            },
            value: "<p>Testing</p>"
            
        });
        elem = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Open dropdown and click on the editor to close the drop down', (done: Function) => {
        rteObj.focusIn();
        ((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
        let target = rteObj.inputElement.querySelector("p")
        let clickEvent: MouseEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("mousedown", true, true);
        target.dispatchEvent(clickEvent);
        expect(((elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).classList.contains('e-active')).toBe(false)
        done();
    });

});

describe('936378 - Content Repetition Issue While Pressing Backspace in List.', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<ul><li><span data-teams="true"><p><a aria-label="Open in new window" id="menur27s" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/924349" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/924349">924349</a><span style="font-size: inherit;">: Background Color,
    Dashed Styles, and Alternate Rows Styles Events Not Triggered in Events Sample.<strong> ( IN Review )</strong></span></p><p><span style="font-size: inherit;"><strong>PR: </strong></span><a aria-label="Open in new window" id="menur27u" href="https://github.com/essential-studio/ej2-richtexteditor-component/pull/3490" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://github.com/essential-studio/ej2-richtexteditor-component/pull/3490">https://github.com/essential-studio/ej2-richtexteditor-component/pull/3490</a></p></span><br></li><li><p><span data-teams="true"><a aria-label="Open in new window" id="menur282" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/916903" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/916903">916903</a> : After inserting a embedded code video, video
    quick toolbar doesn't open after clicking the inserted video.<span style="font-size: inherit;"><strong>( IN Review )</strong></span></span><br></p></li><li style="font-weight: normal;"><p style="margin-left: 0px;"><a aria-label="Open in new window" id="menur27h" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/925494" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/925494">Bug 925494
   </a>-The code view tooltip is not visible, preventing users from easily examining code snippets﻿﻿</p></li><li style="font-weight: normal;"><p style="margin-left: 0px;"><a aria-label="Open in new window" id="menur27j" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/926553" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/926553" style="text-decoration: none; color: rgb(46, 46, 241);">926553<span>&nbsp;</span></a>: Image Overlaps the List After Changing Alignment to Left (In review)<br></p></li><li style="font-weight: normal;"><p><a aria-label="Open in new window" id="menur2fs" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/923080" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/923080">923080</a>: Error on Empty fontFamily and fontSize Items
    in Syncfusion Rich Text Editor</p><p>PR: <a aria-label="Open in new window" id="menur2fu" href="https://github.com/essential-studio/ej2-blazor-source/pull/19965" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://github.com/essential-studio/ej2-blazor-source/pull/19965">
   https://github.com/essential-studio/ej2-blazor-source/pull/19965</a></p><p class="last_element"><a aria-label="Open in new window" id="menur2g0" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/923266" rel="noreferrer noopener" target="_blank" class="fui-Link ___1q1shib f2hkw1w f3rmtva f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1s184ao f1mk8lai fnbmjn9 f1o700av f13mvf36 f1cmlufx f9n3di6 f1ids18y f1tx3yz7 f1deo86v f1eh06m1 f1iescvh fhgqx19 f1olyrje f1p93eir f1nev41a f1h8hb77 f1lqvz6u f10aw75t fsle3fq f17ae5zn" title="https://dev.azure.com/essentialstudio/ej2-web/_workitems/edit/923266">923266</a>: Unable to Export to word/pdf in RTE component</p><br></li></ul>`,
        });
    });
    it('should merge content when pressing backspace at the beginning of a list item', (done: Function) => {
        let node: Element = (rteObj as any).inputElement.querySelector('.last_element');
        setCursorPoint(document, (node.childNodes[0].childNodes[0] as Element), 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        let element: string = node.textContent;
        let previousNode: Element = node.previousElementSibling;
        (rteObj as any).keyDown(keyBoardEvent);
        let previousNodeText: string = previousNode.textContent;
        expect(previousNodeText.includes(element)).toBe(true);
        rteObj.value = `<p><strong><em><span style="text-decoration: underline;">RichTextEditor</span></em></strong></p><p class="cursor-elem">Kanban</p>`;
        rteObj.dataBind();
        let startNode = rteObj.inputElement.querySelector('.cursor-elem');
        setCursorPoint(document, (startNode.childNodes[0] as Element), 0);
        element = startNode.textContent;
        previousNode = startNode.previousElementSibling;
        rteObj.keyDown(keyBoardEvent);
        let elemTextContent = previousNode.textContent;
        expect(elemTextContent.includes(element)).toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('942128 - Backspace not working properly.', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p>This is  a paragraph content.</p><ul><li>This is a first list content</li></ul><p class='last_element'>This is a second list content.</p>`,
        });
    });
    it('should merge content when pressing backspace key', (done: Function) => {
        debugger
        let node: Element = (rteObj as any).inputElement.querySelector('.last_element');
        setCursorPoint(document, (node.childNodes[0] as Element), 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        expect((rteObj as any).inputElement.querySelector("UL li").textContent.indexOf("This is a second list content.") > -1).toBe(true);
        rteObj.value = `<p>This is  a paragraph content.</p><ul><li><p>This is a first list <em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><strong>content</strong></span></span></em></p></li></ul><p class='last_element'>This is a second list content.</p>`;
        rteObj.dataBind();
        let startNode = (rteObj as any).inputElement.querySelector('.last_element');
        setCursorPoint(document, (startNode.childNodes[0] as Element), 0);
        rteObj.keyDown(keyBoardEvent);
        expect((rteObj as any).inputElement.querySelector("UL li p").textContent.indexOf("This is a second list content.") > -1).toBe(true);
        expect((rteObj as any).inputElement.querySelector("UL li p").lastChild.textContent === 'This is a second list content.').toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('927297: When the Backspace key is pressed at the beginning of a line, it incorrectly merges all the lines into one.', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    it('Checking the BR tag', (done: Function) => {
        rteObj = renderRTE({
            value: `<p>Rich<br>Text</p><p class="focusNode">Editor</p>`,
        });
        let node: any = (rteObj as any).inputElement.querySelector('.focusNode');
        setCursorPoint(document, node, 0);
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect((rteObj as any).inputElement.innerHTML).toBe('<p>Rich<br>TextEditor</p>');
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('938174: MAC: Cursor Not Positioned Properly After Clearing Editor Content Using Control + A and Delete', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keyup', preventDefault: () => { }, ctrlKey: true, key: 'Delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p>RichText</p><p class="focusNode">Editor</p>`,
        });
    });
    it('Checking the cursor at the BR tag when selecting all the content and deleting in the editor', (done: Function) => {
        let node: any = (rteObj as any).inputElement;
        let sel = new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[1], 0, 1);
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        rteObj.keyDown(keyBoardEvent);
        (rteObj as any).keyUp(keyBoardEvent);
        setTimeout(() => {
            expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'BR').toBe(true);
            expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
            done();
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('921865 - undo not tirggerd, after performing copy and pasting content from outlook', () => {
    let rteObject: RichTextEditor;
    let innerHTML: string = `<span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</span>`;
    let keyBoardEvent: any = {
        preventDefault: () => { },
        type: 'keydown',
        stopPropagation: () => { },
        ctrlKey: false,
        shiftKey: false,
        action: null,
        which: 86,
        key: '',
        keyCode: 13
    };
    beforeEach(() => {
        rteObject = renderRTE({
            pasteCleanupSettings: {
                prompt: false
            },
            value: '',
            toolbarSettings: {
                items: ['Undo', 'Redo']
            }
        });
    });
    afterEach((done: DoneFn) => {
        destroy(rteObject);
        done();
    });
    it('Pasting content to test if Undo is enabled on the toolbar.', (done: Function) => {
        rteObject.dataBind();
        keyBoardEvent.clipboardData = {
            getData: () => {
                return innerHTML;
            },
            items: []
        };
        setCursorPoint(document, (rteObject as any).inputElement.firstElementChild, 0);
        (rteObject as any).keyDown(keyBoardEvent);
        rteObject.onPaste(keyBoardEvent);
        setTimeout(function () {
            let element = rteObject.element.querySelectorAll("#" + rteObject.getID() + "_toolbar.e-toolbar .e-toolbar-item");
            expect(element[0].classList.contains("e-overlay")).toBe(false);
            expect(element[1].classList.contains("e-overlay")).toBe(true);
            done();
        }, 100);
    });
    it('Save the data during the mouseup event to ensure that the Undo action is enabled after pasting', (done: Function) => {
        rteObject.dataBind();
        keyBoardEvent.clipboardData = {
            getData: function () {
                return innerHTML;
            },
            items: []
        };
        setCursorPoint(document, rteObject.inputElement.firstElementChild, 0);
        (rteObject as any).mouseUp({ target: rteObject.inputElement });
        setTimeout(function () {
            let stack = rteObject.formatter.editorManager.undoRedoManager.undoRedoStack.length;
            expect(stack === 1).toBe(true);
            done();
        }, 100);
    });
});
});
