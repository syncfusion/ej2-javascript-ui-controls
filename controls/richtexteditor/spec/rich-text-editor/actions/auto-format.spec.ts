import { destroy, renderRTE, setCursorPoint } from '../render.spec';
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { ASTERISK_EVENT_INIT, BACKTICK_EVENT_INIT, SPACE_EVENT_INIT, TILDE_EVENT_INIT, UNDERSCORE_EVENT_INIT } from '../../constant.spec';
describe('Mark Auto format', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true,
            value: '<p>**Testing**</p>'
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the auto format for bold', (done: Function) => {
        rteObj.focusIn();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><strong>Testing</strong>​</p>').toBe(true);
        done();
    });
    it ('Checking the auto format for italics', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>*Testing*</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><em>Testing</em>​</p>').toBe(true);
        done();
    });
    it ('Checking the auto format for strike through', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>~~Testing~~</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TILDE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TILDE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><span style="text-decoration: line-through;">Testing</span>​</p>').toBe(true);
        done();
    });
    it ('Checking the auto format for bold italic combination', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>***Testing***</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><em><strong>Testing</strong></em>​</p>').toBe(true);
        done();
    });
    it ('Checking the auto format for the code', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>`Testing`</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKTICK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', BACKTICK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><code>Testing</code>​</p>').toBe(true);
        done();
    });
    it ('Checking th auto format should not work for wrong format', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>**Testing*</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>**Testing*</p>').toBe(true);
        done();
    });
    it ('Autoformat with the Br element', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>apple<br>**cat**</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').lastChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>apple<br><strong>cat</strong>​</p>').toBe(true);
        done();
    });
    it ('Autoformat for partial selection', (done: Function) => {
        rteObj.value = '<p>*a<strong>pple*</strong></p>';
        rteObj.dataBind();
        let content = rteObj.inputElement.querySelector('p').childNodes[1].firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent1: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent1);
        const spaceUpEvent1: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent1);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><em>a</em><strong><em>pple</em>​</strong></p>').toBe(true);
        done();
    });
    it ('reverting the auto format for already formated content', (done: Function) => {
        rteObj.value = '<p><strong>**Testing**</strong></p>';
        rteObj.dataBind();
        let content = rteObj.inputElement.querySelector('p').firstChild.firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent2: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent2);
        const spaceUpEvent2: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent2);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>Testing</p>').toBe(true);
        done();
    });
    it ('Autoformat for partial selection', (done: Function) => {
        rteObj.value = '<p>**Testing**RTE</p>';
        rteObj.dataBind();
        let content = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 11);
        const spaceDownEvent3: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent3);
        const spaceUpEvent3: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent3);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><strong>Testing</strong>​RTE</p>').toBe(true);
        done();
    });
});

describe('996016 - Auto Format revert issues for inline elements', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true,
            codeBlockSettings: {
                defaultLanguage: 'javascript'
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it ('Should revert the auto format for already formated content', (done: Function) => {
        rteObj.inputElement.innerHTML = '<p>RTE `<code>inlinecode`</code></p>';
        let content = rteObj.inputElement.querySelector('p').childNodes[1].firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent2: KeyboardEvent = new KeyboardEvent('keydown', TILDE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent2);
        const spaceUpEvent2: KeyboardEvent = new KeyboardEvent('keyup', TILDE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent2);
        expect(rteObj.inputElement.querySelectorAll('code').length === 0).toBe(true);
        done();
    });
    it ('Should revert the auto format for already formated content in blockquote', (done: Function) => {
        rteObj.inputElement.innerHTML = '<blockquote><p><em>Easily **<strong>access Audio**</strong>, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote>';
        let content = rteObj.inputElement.querySelector('p').firstChild.childNodes[1].firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent2: KeyboardEvent = new KeyboardEvent('keydown', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent2);
        const spaceUpEvent2: KeyboardEvent = new KeyboardEvent('keyup', ASTERISK_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent2);
        expect(rteObj.inputElement.querySelectorAll('strong').length === 0).toBe(true);
        done();
    });
});
describe('Mark Auto format for bold, italics, codeblock', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true,
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the auto format for bold with __', (done: Function) => {
        rteObj.inputElement.innerHTML = '<p>__Testing__</p>'
        rteObj.focusIn();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><strong>Testing</strong>​</p>').toBe(true);
        done();
    });
    it('Checking the auto format for italics with _', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<p>_Testing_</p>';
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><em>Testing</em>​</p>').toBe(true);
        done();
    });
    it('Checking the auto format for bold and italics combined with __', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<p>___Testing___</p>';
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', UNDERSCORE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><em><strong>Testing</strong></em>​</p>').toBe(true);
        done();
    });
    it('Should Apply codeblock', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<p>``` </p>';
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 4);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>').toBe(true);
            done();
        }, 50);
    });
    it('Should not Apply block formats inside codeblock', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"># </code></pre>';
        let content: HTMLElement = rteObj.inputElement.querySelector('code').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"># </code></pre>').toBe(true);
            done();
        }, 50);
    });
    it('Should not Apply any inline formats inside codeblock', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">_Testing_ </code></pre>';
        let content: HTMLElement = rteObj.inputElement.querySelector('code').firstChild as HTMLElement;
        setCursorPoint(content, content.textContent.length);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        expect(rteObj.contentModule.getEditPanel().innerHTML === '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">_Testing_ </code></pre>').toBe(true);
        done();
    });
});

describe('Auto format internals coverage', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => {
         rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true
        });
    });

    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });

    it('findAutoFormatCommandInRange - null range with text fallback', () => {
        expect((<any>rteObj).autoFormatModule.autoFormatObj.findAutoFormatCommandInRange(null, 'hello*')).toBe(true);
        expect((<any>rteObj).autoFormatModule.autoFormatObj.findAutoFormatCommandInRange(null, 'hello')).toBe(false);
    });
    it('findAutoFormatCommandInRange - non-text node and cursor at 0', () => {
        const div: HTMLElement = document.createElement('div');
        div.textContent = '**X';
        document.body.appendChild(div);
        const r1: Range = document.createRange();
        r1.setStart(div, 0);
        r1.collapse(true);
        expect((<any>rteObj).autoFormatModule.autoFormatObj.findAutoFormatCommandInRange(r1)).toBe(false);

        const textNode: Text = document.createTextNode('ab*');
        div.appendChild(textNode);
        const r2: Range = document.createRange();
        r2.setStart(textNode, 0); // cursor at 0
        r2.collapse(true);
        expect((<any>rteObj).autoFormatModule.autoFormatObj.findAutoFormatCommandInRange(r2)).toBe(false);
    });
    it('findMarkdownStartEndNodes + deleteMarkerFromNodes single node', () => {
        const textNode: Text = document.createTextNode('**Test**');
        const matchInfo = (<any>rteObj).autoFormatModule.autoFormatObj['findMarkdownMatch']('**Test**');
        const rangeInfo = (<any>rteObj).autoFormatModule.autoFormatObj['findMarkdownStartEndNodes']([textNode], matchInfo);
        expect(rangeInfo.startNodeIndex).toBe(0);
        expect(rangeInfo.endNodeIndex).toBe(0);
        // markers are deleted from the node as part of computation
        expect(textNode.textContent).toBe('Test');
    });
    it('deleteMarkerFromNodes spanning across nodes', () => {
        const t1: Text = document.createTextNode('*');
        const t2: Text = document.createTextNode('*Hello');
        const container: HTMLElement = document.createElement('span');
        container.appendChild(t1);
        container.appendChild(t2);
        const ret: number = (<any>rteObj).autoFormatModule.autoFormatObj['deleteMarkerFromNodes']([t1, t2], 0, 0, 2, '*');
        expect(ret).toBe(1); // remaining length consumed from next node
        expect(t1.textContent).toBe('');
        expect(t2.textContent).toBe('Hello');
        const outOfBounds: number = (<any>rteObj).autoFormatModule.autoFormatObj['deleteMarkerFromNodes']([t2], 0, 99, 2, '*');
        expect(outOfBounds).toBe(0);
    });
    it('should return early if range is null or not collapsed', function () {
        spyOn((<any>rteObj).formatter.editorManager.nodeSelection, 'getRange').and.returnValue(null);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'keyCode', { value: 32 });
        (<any>rteObj).autoFormatModule.autoFormatObj.autoFormat({ event });
    });
    it('should return early if inline parent is not found', function () {
        spyOn((<any>rteObj).autoFormatModule.autoFormatObj, 'findFirstBlockParent').and.returnValue(null);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'keyCode', { value: 32 });
        (<any>rteObj).autoFormatModule.autoFormatObj.autoFormat({ event });
    });
    it('should return early if text is empty', function () {
        spyOn((<any>rteObj).autoFormatModule.autoFormatObj, 'getLineTextAndNodes').and.returnValue({ text: '', nodes: [] });
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'keyCode', { value: 32 });
        (<any>rteObj).autoFormatModule.autoFormatObj.autoFormat({ event });
    });
    it('should return early if matched range is not found', function () {
        spyOn((<any>rteObj).autoFormatModule.autoFormatObj, 'getLineTextAndNodes').and.returnValue({ text: '*RTE* ', nodes: [] });
        spyOn((<any>rteObj).autoFormatModule.autoFormatObj, 'findMarkdownStartEndNodes').and.returnValue(null);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'keyCode', { value: 32 });
        (<any>rteObj).autoFormatModule.autoFormatObj.autoFormat({ event });
    });
    it('should return null when match positions are out of bounds', function () {
        const textNode = document.createTextNode('Hello World');
        const matchInfo = {
            match: ['**Hello**', 'Hello'],
            tag: 'strong',
            syntax: '**'
        };
        // Simulate a match index that is out of bounds
        (matchInfo.match as any).index = 100; // deliberately invalid
        const result = (<any>rteObj).autoFormatModule.autoFormatObj.findMarkdownStartEndNodes([textNode], matchInfo);
        expect(result).toBeNull();
    });
});

describe('Auto Format for BlockElement', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true,
            value: '<p># Testing</p>'
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('Checking the auto format for h1', (done: Function) => {
        rteObj.focusIn();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<h1>Testing</h1>').toBe(true);
            done();
        }, 50);
    });
    it('Checking the auto format for blockquote', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>> Testing</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<blockquote><p>Testing</p></blockquote>').toBe(true);
            done();
        }, 50);
    });
    it('Checking the auto format for horizontal line', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p>--- Testing</p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 4);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<hr><p>Testing</p>').toBe(true);
            done();
        }, 50);
    });
    it('Should revert the format for already applied headings', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<h1># Testing</h1>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('h1').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<p>Testing</p>').toBe(true);
            done();
        }, 50);
    });
    it('Blockquotes must be toggled for alreaddy applied blockquotes', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = `<blockquote><p>> Testing</p></blockquote>`;
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<p>Testing</p>').toBe(true);
            done();
        }, 50);
    });
    it('Should create headings with br when space is pressed', (done: Function) => {
        rteObj.focusIn();
        rteObj.value = '<p># </p>';
        rteObj.dataBind();
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML === '<h1><br></h1>').toBe(true);
            done();
        }, 50);
    });
});

describe('Auto Format not formatted for horizontal line, blockquote, code block', () => {
    let rteObj: RichTextEditor;
    beforeEach(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                    items: ['SourceCode']
                },
            enableMarkdownAutoFormat: true,
            codeBlockSettings: {
                defaultLanguage: 'javascript'
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Auto format should format with the proper default language', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<p>``` </p>';
        let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
        setCursorPoint(content, 4);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
           expect(rteObj.inputElement.querySelector('pre').getAttribute('data-language') === 'JavaScript').toBe(true);
            done();
        }, 50);
    });
     it('Auto format should format horizontal line in list items', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = '<ul><li>one</li><li>two</li><li>--- </li><li>three</li></ul>';
        let content: HTMLElement = rteObj.inputElement.querySelector('ul') as HTMLElement;
        setCursorPoint(content.childNodes[2].childNodes[0], 4);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.querySelectorAll('hr').length === 1).toBe(true);
            expect(rteObj.inputElement.querySelector('hr').parentElement.tagName === 'LI').toBe(true);
            done();
        }, 50);
    });
    it('Auto format should format blockquote in table', (done: Function) => {
        rteObj.focusIn();
        rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%" class="select">Selma Rose<br>&gt;&nbsp;</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table>`;
        let content: HTMLElement = rteObj.inputElement.querySelector('.select').childNodes[2] as HTMLElement;
        setCursorPoint(content, 2);
        const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceDownEvent);
        const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(spaceUpEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.querySelectorAll('blockquote').length === 1).toBe(true);
            expect(rteObj.inputElement.querySelector('blockquote').parentElement.tagName === 'TD').toBe(true);
            done();
        }, 50);
    });
});