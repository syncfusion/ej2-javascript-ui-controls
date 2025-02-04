import { RichTextEditor } from "../../../src";
import { BASIC_MOUSE_EVENT_INIT, INSRT_LINK_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE } from "../../rich-text-editor/render.spec";

describe('Link testing', ()=>{
    describe('911799: Two anchor elements are created when inserting a link for two selected notes in the Rich Text Editor.', ()=>{
        let editor: RichTextEditor;
        beforeEach((done: DoneFn)=> {
            editor =  renderRTE({
                value: '<p>A content with <strong>bold</strong> format</p>'
            });
            done();
        });
        afterEach((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it ('CASE 1: Should apply one link to the common to the text node and inline node.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            range.selectNode(editor.inputElement.firstElementChild);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                done();
            }, 50);
        });
        it ('CASE 2: Should apply link with splitting the node properly..', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const start = editor.inputElement.querySelector('p');
            const end  = editor.inputElement.querySelector('strong');
            range.setStart(start.firstChild, 0);
            range.setEnd(end.firstChild, 2);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                const expectedElem: string = `<p><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">A content with <strong>bo</strong></a><strong>ld</strong> format</p>`;
                expect(editor.inputElement.innerHTML === expectedElem);
                done();
            }, 50);
        });
    });

    describe('Apply link to text node with no format', ()=>{
        let editor: RichTextEditor
        beforeEach((done: DoneFn)=> {
            editor =  renderRTE({
                value: '<p>A content with no format</p>'
            });
            done();
        });
        afterEach((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it ('Should apply link to the text node.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            range.selectNode(editor.inputElement.firstElementChild);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                done();
            }, 50);
        });
        it ('Should apply link to the text node in current selection.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstElementChild.firstChild, 2);
            range.setEnd(editor.inputElement.firstElementChild.firstChild, 9);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.innerHTML === '<p>A <a href="https://www.google.com/">content</a> with no format</p>');
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('A');
                expect(currentRange.endContainer.nodeName).toBe('A');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                done();
            }, 50);
        });
    });

    describe('Apply link to the text node and multiple unnormalized text nodes.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({});
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should apply only one link to the text node and three text nodes should be normalized to one text node.', (done: DoneFn)=>{
            editor.focusIn();
            editor.inputElement.firstElementChild.appendChild(document.createTextNode('First text node'));
            editor.inputElement.firstElementChild.appendChild(document.createTextNode('Second text node'));
            editor.inputElement.firstElementChild.appendChild(document.createTextNode('Third text node'));
            expect(editor.inputElement.firstElementChild.childNodes.length === 4);
            const range: Range = new Range();
            range.selectNode(editor.inputElement.firstElementChild);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                expect(editor.inputElement.firstElementChild.nodeName === 'P');
                done();
            }, 50);
        });
    });

    describe('Apply link to the inline node.', ()=>{
        let editor: RichTextEditor;
        const value: string = '<p>A content with <strong>bold</strong> format.</p>';
        beforeEach(()=> {
            editor = renderRTE({
                value: value
            });
        });
        afterEach(()=> {
            destroy(editor);
        });
        it ('CASE 1: Should apply link inside the strong node.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelector('strong').firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelector('strong').firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(startNode.parentElement.nodeName).toBe('STRONG');
                expect(editor.inputElement.innerHTML === '<p>A content with <strong><a href="https://www.google.com/">bold</a></strong> format.</p>');
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('STRONG');
                expect(currentRange.endContainer.nodeName).toBe('STRONG');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                done();
            }, 50);
        });
        it ('CASE 2: Should split and then apply link inside the strong node in selection.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelector('strong').firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelector('strong').firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, 2);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(startNode.parentElement.nodeName).toBe('STRONG');
                expect(editor.inputElement.innerHTML === '<p>A content with <strong><a href="https://www.google.com/">bold</a></strong> format.</p>');
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('STRONG');
                expect(currentRange.endContainer.nodeName).toBe('STRONG');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                done();
            }, 50);
        });
    });

    describe('Apply link to the block node with an anchor node.', ()=>{
        let editor: RichTextEditor;
        const value: string = `<p><a class="e-rte-anchor" href="https://github.com/" title="https://github.com/" target="_blank" aria-label="Open in new window">A</a> <a class="e-rte-anchor" href="https://www.office.com/" title="https://www.office.com/" target="_blank" aria-label="Open in new window">simple</a> <a class="e-rte-anchor" href="https://docs.google.com/" title="https://docs.google.com/" target="_blank" aria-label="Open in new window">text</a> <a class="e-rte-anchor" href="https://www.syncfusion.com/" title="https://www.syncfusion.com/" target="_blank" aria-label="Open in new window">content</a>.</p><p>Another text content.</p><p>A content with <strong>bold</strong> format.</p>`;
        beforeAll(()=> {
            editor = renderRTE({
                value: value
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should remove exsisting link and then apply link common to all content of block node.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelectorAll('p')[0].firstChild.firstChild; // Text node
            const endNode: Node =  editor.inputElement.querySelectorAll('p')[2].childNodes[2]; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            expect(editor.inputElement.querySelectorAll('p')[0].querySelectorAll('a').length === 4);
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('p')[0].querySelectorAll('a').length === 1);
                expect(editor.inputElement.querySelectorAll('a').length === 3);
                done();
            }, 50);
        });
    });

    describe('Apply link to the text node with font color node.', ()=>{
        let editor: RichTextEditor;
        const value: string = `<p><span style="font-size: 14pt;"><span style="font-family: Georgia, serif;"><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A ultra formatted node.</span></span></em></strong></span></span></span></span></p>`;
        beforeAll(()=> {
            editor = renderRTE({
                value: value
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 1: Should apply link to the text node with proper order.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startText: Text = editor.inputElement.querySelectorAll('span')[5].firstChild as Text;
            const endText: Text = editor.inputElement.querySelectorAll('span')[5].firstChild as Text;
            range.setStart(startText, 0);
            range.setEnd(endText, endText.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<p><span style="font-size: 14pt;"><span style="font-family: Georgia, serif;"><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A ultra formatted node.</span></span></em></strong></a></span></span></span></span></p>`;
                expect(editor.inputElement.querySelector('a').parentElement.style.color).toBe('rgb(255, 0, 0)');
                expect(editor.inputElement.innerHTML === expectedElem).toBe(true);
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('SPAN');
                expect(currentRange.endContainer.nodeName).toBe('SPAN');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                done();
            }, 50);
        });
        it ('CASE 2: Should apply link to the text node with proper order Selecting all elements.', (done: DoneFn)=>{
            const value: string = `<p>A simple text content.</p><p>Another text content.</p><p>A content with <strong>bold</strong> format</p><p><span style="font-size: 14pt;"><span style="font-family: Georgia, serif;"><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A ultra formatted node.</span></span></em></strong></span></span></span></span></p>`;
            editor.inputElement.innerHTML = value;
            editor.focusIn();
            const range: Range = new Range();
            const startText: Text = editor.inputElement.querySelectorAll('p')[0].firstChild as Text;
            const endText: Text = editor.inputElement.querySelectorAll('span')[5].firstChild as Text;
            range.setStart(startText, 0);
            range.setEnd(endText, endText.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<p><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">A simple text content.</a></p><p><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Another text content.</a></p><p><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">A content with <strong>bold</strong> format</a></p><p><span style="font-size: 14pt;"><span style="font-family: Georgia, serif;"><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A ultra formatted node.</span></span></em></strong></a></span></span></span></span></p>`;
                expect(editor.inputElement.innerHTML === expectedElem).toBe(true);
                expect(editor.inputElement.querySelectorAll('a').length === 4);
                expect(editor.inputElement.querySelectorAll('a')[3].parentElement.style.color).toBe('rgb(255, 0, 0)');
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('#text');
                expect(currentRange.endContainer.nodeName).toBe('#text');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(endText.textContent.length);
                done();
            }, 50);
        });
    });

    describe('Apply link to already applied anchor node.', ()=>{
        let editor: RichTextEditor;
        const value: string = `<p><a class="e-rte-anchor" href="http://google.com" title="http://google.com" target="_blank" aria-label="Open in new window">A</a> simple text content.</p><p>Another text content.</p>`;
        beforeAll(()=> {
            editor = renderRTE({
                value: value
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should unwrap anchor node, normalise the node and then apply anchor to the node.', (done : DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelector('a').firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelectorAll('p')[1].firstChild; // Second paragraph  text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('a').length === 2);
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('#text');
                expect(currentRange.endContainer.nodeName).toBe('#text');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(endNode.textContent.length);
                done();
            }, 50);
        });
    });

    describe('Apply link to the partial selection of the inline nodes.', () =>{
        let editor: RichTextEditor;
        const firstContent: string = `<p><span style="font-size: 12pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A text node with various formats such as Bold, Italic, Underline, Strikethrough.</span></span></em></strong></span></p>`;
        beforeEach((done: DoneFn)=> {
            editor = renderRTE({
                value: firstContent
            });
            done();
        });
        afterEach((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it ('CASE 1: Partial selection at start', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelectorAll('span')[2].firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelectorAll('span')[2].firstChild; // Text node
            range.setStart(startNode, 33);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<p><span style="font-size: 12pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A text node with various formats </span></span></em></strong></span><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window"><span style="font-size: 12pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">such as Bold, Italic, Underline, Strikethrough.</span></span></em></strong></span></a></p>`;
                expect(editor.inputElement.innerHTML === expectedElem).toBe(true);
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('SPAN');
                expect(currentRange.endContainer.nodeName).toBe('SPAN');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                expect(currentRange.toString().length).toBe(47);
                done();
            }, 50);
        });
        it ('CASE 2: Partial selection at end', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelectorAll('span')[2].firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelectorAll('span')[2].firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, 33);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<p><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window"><span style="font-size: 12pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">A text node with various formats </span></span></em></strong></span></a><span style="font-size: 12pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">such as Bold, Italic, Underline, Strikethrough.</span></span></em></strong></span></p>`;
                expect(editor.inputElement.innerHTML === expectedElem).toBe(true);
                expect(editor.inputElement.querySelectorAll('a').length === 1);
                const currentRange: Range = editor.inputElement.ownerDocument.getSelection().getRangeAt(0);
                expect(currentRange.startContainer.nodeName).toBe('SPAN');
                expect(currentRange.endContainer.nodeName).toBe('SPAN');
                expect(currentRange.startOffset).toBe(0);
                expect(currentRange.endOffset).toBe(1);
                expect(currentRange.toString().length).toBe(33);
                done();
            }, 50);
        });
    });

    describe('925817 - Enter Key BR Formatting removed when Links are applied to the content.',  () => {
        let editor: RichTextEditor;
        const firstContent: string = `First Line<br>Second Line<br>Third Line<h2>First Heading</h2><h3>Second Heading</h3><ol><li>First List&nbsp;</li><li>Second List</li><li>Third List</li></ol>Last Line`;
        beforeEach((done: DoneFn)=> {
            editor = renderRTE({
                value: firstContent,
                enterKey: 'BR'
            });
            done();
        });
        afterEach((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it ('CASE 1: Applying Link to One Line.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.firstChild; // Text node
            const endNode: Node = editor.inputElement.firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Line</a><br>Second Line<br>Third Line<h2>First Heading</h2><h3>Second Heading</h3><ol><li>First List&nbsp;</li><li>Second List</li><li>Third List</li></ol>Last Line`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
        it ('CASE 2: Applying Link to Multiple Lines.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelector('h2').firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Line</a><br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second Line</a><br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third Line</a><h2><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Heading</a></h2><h3>Second Heading</h3><ol><li>First List&nbsp;</li><li>Second List</li><li>Third List</li></ol>Last Line`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
        it ('CASE 3: Applying Link to List items.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelectorAll('li')[0].firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelectorAll('li')[2].firstChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `First Line<br>Second Line<br>Third Line<h2>First Heading</h2><h3>Second Heading</h3><ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First List&nbsp;</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second List</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third List</a></li></ol>Last Line`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
        it ('CASE 4: Applying Link to Text and partial List items.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.childNodes[2]; // Text node
            const endNode: Node = editor.inputElement.lastChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, 2);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `First Line<br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second Line</a><br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third Line</a><h2><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Heading</a></h2><h3><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second Heading</a></h3><ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First List&nbsp;</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second List</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third List</a></li></ol><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">La</a>st Line`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
        it ('CASE 5: Applying Links to Last line.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.lastChild; // Text node
            const endNode: Node = editor.inputElement.lastChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `First Line<br>Second Line<br>Third Line<h2>First Heading</h2><h3>Second Heading</h3><ol><li>First List&nbsp;</li><li>Second List</li><li>Third List</li></ol><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Last Line</a>`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
        it ('CASE 6: Applying Links to all the content inside the editor.', (done: DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.firstChild // Text node
            const endNode: Node = editor.inputElement.lastChild; // Text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Line</a><br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second Line</a><br><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third Line</a><h2><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First Heading</a></h2><h3><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second Heading</a></h3><ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">First List&nbsp;</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Second List</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Third List</a></li></ol><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Last Line</a>`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
    });

    describe('Apply link to nested list nodes.', ()=>{
        let editor: RichTextEditor;
        const value: string = `<ol><li>List 1<ol><li>Sub List 1<ol><li>List 1</li></ol></li><li>Sub List 2</li><li>Sub List 3</li></ol></li><li>List 2&nbsp;</li><li>List 3</li><li>List 4</li></ol>`;
        beforeAll(()=> {
            editor = renderRTE({
                value: value
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should not change the structure of the content.', (done : DoneFn)=>{
            editor.focusIn();
            const range: Range = new Range();
            const startNode: Node = editor.inputElement.querySelectorAll('li')[0].firstChild; // Text node
            const endNode: Node = editor.inputElement.querySelectorAll('li')[6].firstChild; // Second paragraph  text node
            range.setStart(startNode, 0);
            range.setEnd(endNode, endNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            editor.showDialog('InsertLink' as any);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            setTimeout(() => {
                const expectedElem: string = `<ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">List 1</a><ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Sub List 1</a><ol><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">List 1</a></li></ol></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Sub List 2</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">Sub List 3</a></li></ol></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">List 2&nbsp;</a></li><li><a class="e-rte-anchor" href="https://www.google.com/" title="https://www.google.com/" target="_blank" aria-label="Open in new window">List 3</a></li><li>List 4</li></ol>`;
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 50);
        });
    });

    describe('927184 - Link Selection Persists Improperly After Removing Link Using Quick Toolbar', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>A content with no format</p>'
            })
        });
        afterAll(()=> {
            destroy(editor)
        });
        it ('Should have proper selection after the removal of link.', (done: DoneFn)=> {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            const range = new Range();
            const textNode: Text = editor.inputElement.querySelector('p').firstChild as Text;
            range.setStart(textNode , 0);
            range.setStart(textNode , textNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const insertLinkKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', INSRT_LINK_EVENT_INIT);
            editor.inputElement.dispatchEvent(insertLinkKeyDownEvent);
            const insertLinkKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', INSRT_LINK_EVENT_INIT);
            editor.inputElement.dispatchEvent(insertLinkKeyUpEvent);
            setTimeout(() => {
                const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
                urlInput.value = 'https://www.google.com/';
                const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
                insertBtn.click();
                setTimeout(() => {
                    const linkQuikToolbar: HTMLElement = document.querySelectorAll('.e-popup-open')[0] as HTMLElement;
                    const removeBtn: HTMLButtonElement = linkQuikToolbar.querySelector('.e-remove-link');
                    removeBtn.click();
                    setTimeout(() => {
                        const currentRange = document.getSelection().getRangeAt(0);
                        expect(currentRange.startContainer.nodeName === '#text').toBe(true);
                        expect(currentRange.endContainer.nodeName === '#text').toBe(true);
                        expect(currentRange.startOffset).toBe(0);
                        expect(currentRange.endOffset).toBe(textNode.textContent.length -1);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('924343 - Link Selection not restored properly after removing the link', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>The Rich Text Editor (RTE) control is an easy to render in client side</p>'
            })
        });
        afterAll(()=> {
            destroy(editor)
        });
        it ('Selection has restored properly after removing the link using Quick Toolbar.', (done: DoneFn)=> {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            let range = new Range();
            let textNode: Text = editor.inputElement.querySelector('p').firstChild as Text;
            range.setStart(textNode , 0);
            range.setStart(textNode , textNode.textContent.length);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const insertLinkKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', INSRT_LINK_EVENT_INIT);
            editor.inputElement.dispatchEvent(insertLinkKeyDownEvent);
            const insertLinkKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', INSRT_LINK_EVENT_INIT);
            editor.inputElement.dispatchEvent(insertLinkKeyUpEvent);
            const urlInput: HTMLInputElement = editor.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
            urlInput.value = 'https://www.google.com/';
            const insertBtn: HTMLElement = editor.element.querySelector('.e-rte-link-dialog .e-insertLink');
            insertBtn.click();
            range = new Range();
            textNode = editor.inputElement.querySelector('p').firstChild as Text;
            range.setStart(textNode , 10);
            range.setEnd(textNode, 30);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const linkQuikToolbar: HTMLElement = document.querySelectorAll('.e-rte-quick-toolbar')[0] as HTMLElement;
            const removeBtn: HTMLButtonElement = linkQuikToolbar.querySelector('.e-remove-link');
            removeBtn.click();
            const currentRange = document.getSelection().getRangeAt(0);
            expect(currentRange.startContainer.nodeName === '#text').toBe(true);
            expect(currentRange.endContainer.nodeName === '#text').toBe(true);
            expect(currentRange.startOffset).toBe(10);
            expect(currentRange.endOffset).toBe(30);
            done();
        });
    });
});