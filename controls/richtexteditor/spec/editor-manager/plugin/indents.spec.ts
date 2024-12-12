/**
 * Indents plugin spec
 */
import { createElement, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';

describe('Indents plugin', () => {

    describe(' apply Indents testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label>First label Node</label>
           </p>
           <p class='last-p-node'>
             <label>Last Label Node</label>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' increase indents format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);
            start.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            expect(end.style.marginLeft === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);
            expect(end.style.marginLeft === '40px').toBe(true);
            start.style.marginLeft = '';
            end.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);
        });

        it(' Outdent format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '0px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '').toBe(true);

            start.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            expect(end.style.marginLeft === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '0px').toBe(true);
            expect(end.style.marginLeft === '0px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);

            start.style.marginLeft = '';
            end.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' RTL - apply Indents testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner e-rtl">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label>First label Node</label>
           </p>
           <p class='last-p-node'>
             <label>Last Label Node</label>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' increase indents format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '40px').toBe(true);
            start.style.marginRight = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '20px').toBe(true);
            expect(end.style.marginRight === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '40px').toBe(true);
            expect(end.style.marginRight === '40px').toBe(true);
            start.style.marginRight = '';
            end.style.marginRight = '';
            editorObj.nodeSelection.Clear(document);
        });

        it(' Outdent format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '40px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginRight === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginRight === '0px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginRight === '').toBe(true);

            start.style.marginRight = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '20px').toBe(true);
            expect(end.style.marginRight === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginRight === '0px').toBe(true);
            expect(end.style.marginRight === '0px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginRight === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);

            start.style.marginRight = '';
            end.style.marginRight = '';
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' apply Indents to List element testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
            <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
            <ul class='ul-first-node'><li><p class='first-p-node'>one-node</p></li><li><p class='second-p-node'>two-node</p></li><li><p class='third-p-node'>third-node</p></li><li>fifth-node</li></ul><p class='fourth-p-node'>fourth node</p>
         </div>
            ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' increase indents format to list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('.second-p-node');
            let end: HTMLElement = elem.querySelector('.fourth-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 3);
            editorObj.execCommand("Indents", 'Indent', null);
            let ulList: HTMLElement = elem.querySelector('ul');
            expect(!isNullOrUndefined(ulList.querySelector('ul'))).toBe(true);
            let lastNode: HTMLElement = elem.querySelector('.fourth-p-node');
            expect(lastNode.style.marginLeft === '20px').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' Outdent format to list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('.second-p-node');
            let end: HTMLElement = start;
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 0);
            start = elem.querySelector('.second-p-node');
            expect(!isNullOrUndefined(start.parentElement.querySelector('ul'))).toBe(false);
            editorObj.execCommand("Indents", 'Outdent', null);
            start = elem.querySelector('.second-p-node');
            expect(!isNullOrUndefined(start.parentElement.querySelector('ul'))).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('Bug 922927: The decrease indent moved the content outside of the editor (adding a negative left margin)', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
            <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
            <p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;line-height:150%;\nmso-list:l0 level1 lfo1">\x3C!--[if !supportLists]--><span lang="ro" style="font-size:\n10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;mso-fareast-font-family:\n&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;">●<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span>\x3C!--[endif]--><span lang="ro" style="font-size:10.0pt;\nline-height:150%">Prewarming in der Einleitung</span><span lang="ro" style="font-size:10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;\nmso-fareast-font-family:&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;"><o:p></o:p></span></p><p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;line-height:150%;\nmso-list:l0 level1 lfo1">\x3C!--[if !supportLists]--><span lang="ro" style="font-size:\n10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;mso-fareast-font-family:\n&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;">●<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span>\x3C!--[endif]--><span lang="ro" style="font-size:10.0pt;\nline-height:150%">Atemweg: LMA oder ETT (Magill)</span><span lang="ro" style="font-size:10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;\nmso-fareast-font-family:&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;"><o:p></o:p></span></p><p class="MsoNormal" style="margin-left:.5in;line-height:150%"><span lang="ro" style="font-size:10.0pt;line-height:150%">Schonende Einleitung mit Sufentanil\nund Propofol<o:p></o:p></span></p><p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;line-height:150%;\nmso-list:l0 level1 lfo1">\x3C!--[if !supportLists]--><span lang="ro" style="font-size:\n10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;mso-fareast-font-family:\n&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;">●<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span>\x3C!--[endif]--><span lang="ro" style="font-size:10.0pt;\nline-height:150%">Narkoseaufrechterhaltung als TIVA mit Propofol 2% und\nRemifentanil</span><span lang="ro" style="font-size:10.0pt;line-height:150%;\nfont-family:&quot;Noto Sans Symbols&quot;;mso-fareast-font-family:&quot;Noto Sans Symbols&quot;;\nmso-bidi-font-family:&quot;Noto Sans Symbols&quot;"><o:p></o:p></span></p><p class="MsoNormal" style="margin-left:.5in;line-height:150%"><span lang="ro" style="font-size:10.0pt;line-height:150%">Titration der TIVA über\nEntropiemessung, druckunterstützte Beatmung, frühe Spontanisierung der Atmung\nanstreben<o:p></o:p></span></p><p><br></p><p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;line-height:150%;\nmso-list:l0 level1 lfo1">\x3C!--[if !supportLists]--><span lang="ro" style="font-size:\n10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;mso-fareast-font-family:\n&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;">●<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span>\x3C!--[endif]--><span lang="ro" style="font-size:10.0pt;\nline-height:150%">Ggf. Anlage invasiven Blutdruckmessung am kontralateralen Arm</span><span lang="ro" style="font-size:10.0pt;line-height:150%;font-family:&quot;Noto Sans Symbols&quot;;\nmso-fareast-font-family:&quot;Noto Sans Symbols&quot;;mso-bidi-font-family:&quot;Noto Sans Symbols&quot;"><o:p></o:p></span></p>
         </div>
            ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });
        it('Testing whether negative margin is applied', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: Node = elem.firstChild;
            let end: Node = elem.lastChild;
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, end.textContent.length);
            editorObj.execCommand("Indents", 'Outdent', null);
            const paragraphs: NodeList = elem.querySelectorAll('p');
            paragraphs.forEach(paragraph => {
                const marginLeft = parseFloat((paragraph as HTMLElement).style.marginLeft || '0');
                expect(marginLeft).toBeGreaterThanOrEqual(0);
            });
            editorObj.execCommand("Indents", 'Outdent', null);
            paragraphs.forEach(paragraph => {
                const marginLeft = parseFloat((paragraph as HTMLElement).style.marginLeft || '0');
                expect(marginLeft).toBeGreaterThanOrEqual(0);
            });
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('RTL - apply Indents testing for RTL Mode', () => {
        let editorObj: EditorManager;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner e-rtl">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label>First label Node</label>
           </p>
           <p class='last-p-node'>
             <label>Last Label Node</label>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('increase indents for RTL Mode', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginRight === '20px').toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('873565 - Indent not working when enter key is configured as BR', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true">Content 1&nbsp;<strong>line</strong><br><strong class="startFocus">Content 2 line</strong><br><strong class="endFocus">Content 3&nbsp;</strong>line<br>Content 4&nbsp;<strong>line</strong></div>`
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        it('Checking the indent when BR configured', () => {
            startNode = editNode.querySelector('.startFocus');
            endNode = editNode.querySelector('.endFocus').nextSibling as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode, 3, 3);
            editorObj.execCommand("Indents", 'Indent', null, null, null, null, null, 'BR');
            expect(editNode.innerHTML === `Content 1&nbsp;<strong>line</strong><br><div style="margin-left: 20px;"><strong class="startFocus">Content 2 line</strong></div><div style="margin-left: 20px;"><strong class="endFocus">Content 3&nbsp;</strong>line</div>Content 4&nbsp;<strong>line</strong>`).toBe(true);
        });

        it('Checking the indent with bold in the content ', () => {
            editNode.innerHTML = `Content 1 line<br>Content 2&nbsp;<strong class="startFocus">line&nbsp;</strong>extended<br>Content 3 line<br class="endFocus">Content 4 line`;
            startNode = editNode.querySelector('.startFocus').nextSibling as HTMLElement;
            endNode = editNode.querySelector('.endFocus').nextSibling as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 3, 3);
            editorObj.execCommand("Indents", 'Indent', null, null, null, null, null, 'BR');
            expect(editNode.innerHTML === `Content 1 line<br><div style="margin-left: 20px;">Content 2&nbsp;<strong class="startFocus">line&nbsp;</strong>extended</div><div style="margin-left: 20px;">Content 3 line</div><div style="margin-left: 20px;">Content 4 line</div>`).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });
});