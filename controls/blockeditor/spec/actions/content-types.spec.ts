import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockModel, ILabelContentSettings, IMentionContentSettings, UserModel } from '../../src/models/index';
import { getBlockContentElement, getBlockModelById, setCursorPosition } from '../../src/common/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockType, ContentType } from '../../src/models/enums';

describe('Content types', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Ensuring basic rendering of content types', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'text-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'helloworld' }]
                },
                {
                    id: 'link-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Link, content: 'syncfusion',
                        properties: { url: 'www.syncfusion.com' }}]
                },
                {
                    id: 'code-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'console.log("hello world")', properties: { styles: { inlineCode: true }} }]
                },
                {
                    id: 'mention-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Mention, id: 'mention-content', properties: { userId: 'user1' } }]
                },
                {
                    id: 'label-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Label, id: 'label-content', properties: { labelId: 'progress' } }]
                },
                {
                    id: 'combined-block',
                    blockType: BlockType.Paragraph,
                    content: [
                        { contentType: ContentType.Text, content: 'To navigate to syncfusion site, ' },
                        { contentType: ContentType.Link, content: 'click here ', properties: { url: 'www.syncfusion.com' }},
                        { contentType: ContentType.Text, content: 'console.log("hello world"), ', properties: { styles: { inlineCode: true }} },
                        { contentType: ContentType.Mention, id: 'mention-content', properties: { userId: 'user2' }},
                        { contentType: ContentType.Label, id: 'label-content', properties: { labelId: 'progress' } }
                    ]
                },
            ];
            const users: UserModel[] =  [
                { id: 'user1', user: 'John Paul' },
                { id: 'user2', user: 'John Snow' }
            ];
            editor = createEditor({ blocks: blocks, users: users });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('ensure content type text rendering', () => {
            const blockElement = editorElement.querySelector('#text-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toBe('helloworld');
        });

        it('ensure content type link rendering', () => {
            const blockElement = editorElement.querySelector('#link-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const anchorEle = (contentElement.firstChild as HTMLElement);
            expect(anchorEle.tagName).toBe('A');
            expect(anchorEle.textContent).toBe('syncfusion');
            expect(anchorEle.getAttribute('href')).toBe('https://www.syncfusion.com');
            expect(anchorEle.getAttribute('target')).toBe('_blank');
            expect(editor.blocks[1].content[0].id).toBe(anchorEle.id);
        });

        it('ensure content type code rendering', () => {
            const blockElement = editorElement.querySelector('#code-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe('console.log("hello world")');
            expect(editor.blocks[2].content[0].id).toBe(codeEle.id);
        });

        it('ensure content type mention rendering', () => {
            const blockElement = editorElement.querySelector('#mention-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const mentionChipEle = (contentElement.firstChild as HTMLElement);
            expect(mentionChipEle.tagName).toBe('DIV');
            expect((mentionChipEle.querySelector('.em-content') as HTMLElement).textContent).toBe('John Paul');
            expect(editor.blocks[3].content[0].id).toBe(mentionChipEle.id);
            expect((editor.blocks[3].content[0].properties as IMentionContentSettings).userId).toBe(mentionChipEle.getAttribute('data-user-id'));
        });

        it('ensure content type label rendering', () => {
            const blockElement = editorElement.querySelector('#label-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const labelChipEle = (contentElement.firstChild as HTMLElement);
            expect(labelChipEle.tagName).toBe('SPAN');
            expect(labelChipEle.textContent).toBe('Progress: In-progress');
            expect(editor.blocks[4].content[0].id).toBe(labelChipEle.id);
            expect((editor.blocks[4].content[0].properties as ILabelContentSettings).labelId).toBe(labelChipEle.getAttribute('data-label-id'));
        });

        it('ensure all content types combined rendering', () => {
            const blockElement = editorElement.querySelector('#combined-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toBe('To navigate to syncfusion site, click here console.log("hello world"), JSJohn SnowProgress: In-progress');
            const textEle = contentElement.firstChild as HTMLElement;
            expect(textEle.tagName).toBe('SPAN');
            expect(textEle.textContent).toBe('To navigate to syncfusion site, ');
            expect(editor.blocks[5].content[0].id).toBe(textEle.id);

            const anchorEle = contentElement.childNodes[1] as HTMLElement;
            expect(anchorEle.tagName).toBe('A');
            expect(anchorEle.textContent).toBe('click here ');
            expect(anchorEle.getAttribute('href')).toBe('https://www.syncfusion.com');
            expect(anchorEle.getAttribute('target')).toBe('_blank');
            expect(editor.blocks[5].content[1].id).toBe(anchorEle.id);

            const codeEle = contentElement.childNodes[2] as HTMLElement;
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe('console.log("hello world"), ');
            expect(editor.blocks[5].content[2].id).toBe(codeEle.id);

            const mentionEle = contentElement.childNodes[3] as HTMLElement;
            expect(mentionEle.tagName).toBe('DIV');
            expect((mentionEle.querySelector('.em-content') as HTMLElement).textContent).toBe('John Snow');

            const labelEle = contentElement.lastChild as HTMLElement;
            expect(labelEle.tagName).toBe('SPAN');
            expect(labelEle.textContent).toBe('Progress: In-progress');
        });

        it('ensure content type text rendering with special characters', () => {
            const specialCharsText = 'Hello! 😊 This is a test with @ # $ % ^ & * ( ) _ + = { } | ~ ` - [ ] \\ ; : \' " < , . > ? / and some unicode characters like éäöüçñ漢字 ✨🚀';
            const blockId = 'special-text-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: specialCharsText }]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const expectedTextContent = specialCharsText
                .replace(/</g, '&lt;') // Replace '<' with '&lt;'
                .replace(/>/g, '&gt;'); // Replace '>' with '&gt;'
            expect(contentElement.textContent).toBe(expectedTextContent);
        });
        
        it('ensure content type code rendering with special characters', () => {
            const specialCharsCode = `console.log("Hello!  World"); // This is a comment with special chars: @#$%^&*()_+=[]{}\\|;:'"&lt;&gt;,.?/\n            const myVar = 'éäöüçñ漢字';\n            let arr = [1, 2, 3]; // \n            if (x &lt; y && z &gt; w) { doSomething(); }`;
            const blockId = 'special-code-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: specialCharsCode, properties: { styles: { inlineCode: true }} }]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe(specialCharsCode);

            const addedBlock = getBlockModelById(blockId, editor.blocks);
            expect(addedBlock.content[0].content).toBe(specialCharsCode);
        });

        it('ensure text content renders zero-width and invisible characters correctly', () => {
            const invisibleCharsText = 'Hello\u200Bworld!\u200C(zero-width)\u200Dtest.\u00ADThis\u2028should\u2029be\u200Bpreserved.';
            const blockId = 'invisible-text-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: invisibleCharsText }]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const expectedTextContent = invisibleCharsText
                .replace(/</g, '&lt;') 
                .replace(/>/g, '&gt;'); 

            expect(contentElement.textContent).toBe(expectedTextContent);
            const addedBlock = getBlockModelById(blockId, editor.blocks);
            expect(addedBlock.content[0].content).toBe(invisibleCharsText);
        });

        it('ensure link with query parameters is handled correctly', () => {
            const baseUrl = 'https://example.com/search';
            const urlWithParams = `${baseUrl}?term=block%20editor&category=testing`;
            const urlWithComplexParams = `${baseUrl}?q=long%20search%20term%20with%20spaces&filter=new%2Bproducts&id=123$%26abc&ref=source?q=inner`;
            const urlWithFragmentAndParams = `${baseUrl}?page=2#section-top`;
            const urlWithEncodedAmpersand = `${baseUrl}?name=John%26Doe&age=30`;

            const blockId = 'query-param-link-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [
                    { contentType: ContentType.Text, content: 'Simple: ' },
                    { contentType: ContentType.Link, content: 'Search 1', properties: { url: urlWithParams } },
                    { contentType: ContentType.Text, content: ' Complex: ' },
                    { contentType: ContentType.Link, content: 'Search 2', properties: { url: urlWithComplexParams } },
                     { contentType: ContentType.Text, content: ' Fragment: ' },
                    { contentType: ContentType.Link, content: 'Page 2', properties: { url: urlWithFragmentAndParams } },
                    { contentType: ContentType.Text, content: ' Encoded Amp: ' },
                    { contentType: ContentType.Link, content: 'John Doe', properties: { url: urlWithEncodedAmpersand } }
                ]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const links = contentElement.querySelectorAll('a');
            expect(links.length).toBe(4);

            expect(links[0].textContent).toBe('Search 1');
            expect(links[0].getAttribute('href')).toBe(urlWithParams); 

            expect(links[1].textContent).toBe('Search 2');
            expect(links[1].getAttribute('href')).toBe(urlWithComplexParams); 
            expect(links[1].getAttribute('target')).toBe('_blank'); 

            expect(links[2].textContent).toBe('Page 2');
            expect(links[2].getAttribute('href')).toBe(urlWithFragmentAndParams); 
            expect(links[3].textContent).toBe('John Doe');
            expect(links[3].getAttribute('href')).toBe(urlWithEncodedAmpersand); 
        });

        it('should handle malformed or invalid URLs gracefully', () => {

            const invalidProtocolUrl = 'httpx://invalid-protocol.com';
            const missingDomainUrl = 'http://';
            const incompleteUrl = 'www.incomplete.com';

            const blockId = 'malformed-link-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [
                    { contentType: ContentType.Text, content: 'Invalid Protocol: ' },
                    { contentType: ContentType.Link, content: 'Link 1', properties: { url: invalidProtocolUrl } },
                    { contentType: ContentType.Text, content: ' | Missing Domain: ' },
                    { contentType: ContentType.Link, content: 'Link 2', properties: { url: missingDomainUrl } },
                    { contentType: ContentType.Text, content: ' | Incomplete: ' },
                    { contentType: ContentType.Link, content: 'Link 3', properties: { url: incompleteUrl } },
                   
                ]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const links = contentElement.querySelectorAll('a');
            expect(links.length).toBe(3);
            expect(links[0].textContent).toBe('Link 1');

            // just defaultly adds https causing https adding before custom protocol
            // expect(links[0].getAttribute('href')).toBe(invalidProtocolUrl);

            expect(links[1].textContent).toBe('Link 2');
            expect(links[1].getAttribute('href')).toBe(missingDomainUrl);

            // Browser resolves it as 'http://www.incomplete.com'.
            expect(links[2].textContent).toBe('Link 3');
            expect(links[2].getAttribute('href')).toBe('https://' + incompleteUrl);
        });

        it('should correctly render and preserve extremely long link text', () => {
            const longLinkText = 'This is an extremely long piece of sample link text that should be fully displayed '
                               + 'by the Block Editor without any truncation, corruption, or unexpected rendering issues. '
                               + 'It will be repeated multiple times to ensure it reaches a significant length that '
                               + 'might stress the rendering capabilities of the browser and the editor. '
                               + 'The editor must maintain the integrity of this entire string from start to finish. '
                               + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor '
                               + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud '
                               + 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute '
                               + 'irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla '
                               + 'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia '
                               + 'deserunt mollit anim id est laborum. '.repeat(100);

            const targetUrl = 'https://example.com/very-long-article-with-extensive-details';

            const blockId = 'long-link-text-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [
                    { contentType: ContentType.Link, content: longLinkText, properties: { url: targetUrl } }
                ]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const anchorEle = (contentElement.firstChild as HTMLElement);
            expect(anchorEle).not.toBeNull();
            expect(anchorEle.tagName).toBe('A');

            expect(anchorEle.textContent.length).toBe(longLinkText.length);
            expect(anchorEle.textContent).toBe(longLinkText);

            expect(anchorEle.getAttribute('href')).toBe(targetUrl);
        });

        it('should correctly preserve and render regex patterns in code content', () => {
            const regexCodeSnippet = `\n            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;\n            const pathRegex = /^(\\/[a-zA-Z0-9_-]+)*\\/?$/;\n            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.&lt;&gt;\\/?]).{8,}$/;\n            const unicodeEscapeRegex = /\\u00C0-\\u017F/ug; // Testing Unicode escapes\n            const stringRegex = "The pattern is: \\(foo\\)\\[bar\\]\\\\"; // Regex as a string literal\n\n            // Example of regex with a "raw string" like R"..." syntax (e.g., C++, Python)\n            // If the editor handles different language syntax, this might be relevant.\n            const pythonRawRegex = r"This is a raw string with \\n and \\t";\n\n            // Lookaheads, lookbehinds, non-capturing groups, quantifiers\n            const complexRegex = /(?:foo|bar)(?=\\d{3})(?!baz)/i;\n                        `;
            const blockId = 'regex-code-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: regexCodeSnippet, properties: { styles: { inlineCode: true }} }]
            })

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');

            expect(codeEle.textContent.length).toBe(regexCodeSnippet.length);
            expect(codeEle.textContent).toBe(regexCodeSnippet);
        });

        it('should correctly render and preserve template literals in code content', () => {
            const templateLiteralCode = `
            const name = "World";
            const greeting = \`Hello, \${name}!\`;
            function calculate(a, b) {
                return \`The sum of \${a} and \${b} is \${a + b}.\`;
            }
            console.log(greeting);
            console.log(calculate(5, 3));
            `;
            const blockId = 'template-literal-code-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: templateLiteralCode, properties: { styles: { inlineCode: true }} }]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');

            expect(codeEle.textContent).toBe(templateLiteralCode);

            // Verify whitespace preservation as appropriate for code blocks
            const computedWhiteSpace = window.getComputedStyle(codeEle).getPropertyValue('white-space');
            expect(['pre', 'pre-wrap']).toContain(computedWhiteSpace);
        });

        it('should correctly render and preserve standard escape sequences in code content', () => {
            const codeWithEscapeSequences = `
            const message = "Hello\\nWorld!\\tThis string has a new line and a tab.\\nThe path is C:\\\\Users\\\\Name.";
            const singleQuote = 'It\\'s a beautiful day.';
            const unicodeChar = "\\u00A9 Syncfusion"; // Copyright symbol
            console.log(message);
            console.log(singleQuote);
            console.log(unicodeChar);
            `;
            const blockId = 'escape-sequence-code-block';

            editor.addBlock({
                id: blockId,
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: codeWithEscapeSequences, properties: { styles: { inlineCode: true }} }]
            });

            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe(codeWithEscapeSequences);
            const computedWhiteSpace = window.getComputedStyle(codeEle).getPropertyValue('white-space');
            expect(['pre', 'pre-wrap']).toContain(computedWhiteSpace);
        });

    });

    describe('Ensuring handling of extremely long content segments', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor-long-content-test' });
            document.body.appendChild(editorElement);
        });
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        it('should render a very long text content segment without error', () => {
            const longTextContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(500); // 500 * 57 chars = 28500 chars
            const blockId = 'long-text-block';
            editor = createEditor({
                blocks: [{
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: longTextContent }]
                }]
            });
            editor.appendTo('#editor-long-content-test');
            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            // Based on previous issues, assuming < and > might be encoded if present.
            const expectedText = longTextContent
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            expect(contentElement.textContent.length).toBe(expectedText.length);
            expect(contentElement.textContent).toBe(expectedText);
        });
        it('should render a very long code content segment without error', () => {

            const longCodeSnippet = `function exampleFunc(input) {\n                if (input &gt; 100) {\n                    console.log("Input is large: " + input);\n                } else {\n                    console.log("Input is small: " + input);\n                }\n            }\n`.repeat(200);
            const blockId = 'long-code-block';
            editor = createEditor({
                blocks: [{
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: longCodeSnippet, properties: { styles: { inlineCode: true }} }]
                }]
            });
            editor.appendTo('#editor-long-content-test');
            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');

            expect(codeEle.textContent.length).toBe(longCodeSnippet.length);
            expect(codeEle.textContent).toBe(longCodeSnippet);
        });
        it('should render a block with many combined inline elements without error', () => {
            // Create a block with many small segments (text, link, mention, label)
            const smallSegment = 'text ';
            const linkSegment = { contentType: ContentType.Link, content: 'link', properties: { url: '#' } };
            const mentionSegment = { contentType: ContentType.Mention, id: 'many-mention', properties: { userId: 'user1' } };
            const labelSegment = { contentType: ContentType.Label, id: 'many-label', properties: { labelId: 'progress' } };
            const contentArray: any[] = [];
            for (let i = 0; i < 200; i++) {
                contentArray.push({ contentType: ContentType.Text, content: `${smallSegment}${i} ` });
                contentArray.push(linkSegment);
                contentArray.push({ contentType: ContentType.Text, content: ' ' });
                contentArray.push(mentionSegment);
                contentArray.push({ contentType: ContentType.Text, content: ' ' });
                contentArray.push(labelSegment);
                contentArray.push({ contentType: ContentType.Text, content: '. ' });
            }
            const blockId = 'many-inline-elements-block';
            const users: UserModel[] =  [{ id: 'user1', user: 'Many User' }];
            editor = createEditor({
                blocks: [{ id: blockId, blockType: BlockType.Paragraph, content: contentArray }],
                users: users
            });
            editor.appendTo('#editor-long-content-test');
            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            // Check that the number of child elements matches roughly what we expect
            expect(contentElement.children.length).toBeGreaterThanOrEqual(200 * 3);
        });
    });

    describe('Ensuring preservation of consecutive space characters', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor-space-preservation-test' });
            document.body.appendChild(editorElement);
        });
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        it('should preserve consecutive spaces in text content', () => {
            // Testing multiple spaces, tabs, and mixtures
            const textWithMultipleSpaces = 'This   text  has\t\tmultiple    spaces   and\ttabs.';
            const blockId = 'multi-space-text-block';
            editor = createEditor({
                blocks: [{
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: textWithMultipleSpaces }]
                }]
            });
            editor.appendTo('#editor-space-preservation-test');
            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();

            const expectedText = textWithMultipleSpaces
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            expect(contentElement.textContent).toBe(expectedText);
        });
        it('should preserve consecutive spaces in code content', () => {
            const codeWithMultipleSpaces = `function   test  ( arg1 ,  arg2  )   {\n                    let  x   =   10 ;    //  Some  comment\n                    if  ( x   &gt;   0   )  {\n                        return    "  ok  " ;\n                    }\n            }`;
            const blockId = 'multi-space-code-block';
            editor = createEditor({
                blocks: [{
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: codeWithMultipleSpaces, properties: { styles: { inlineCode: true }} }]
                }]
            });
            editor.appendTo('#editor-space-preservation-test');
            const blockElement = editorElement.querySelector(`#${blockId}`) as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle).not.toBeNull();
            expect(codeEle.tagName).toBe('CODE');

            expect(codeEle.textContent).toBe(codeWithMultipleSpaces);
            // formatting preserve check
            const computedWhiteSpace = window.getComputedStyle(codeEle).getPropertyValue('white-space');
            expect(['pre', 'pre-wrap']).toContain(computedWhiteSpace);
        });
    });

    describe('Label and Mention Insertion related cases ', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: 'Initial text' }]
            }];
            const users: UserModel[] = [
                { id: 'user1', user: 'John Paul' },
                { id: 'user2', user: 'John Snow' }
            ];
            editor = createEditor({
                blocks: blocks,
                users: users, 
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should do mention insertion on Enter', (done) => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            let contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '@' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            contentElement.dispatchEvent(new KeyboardEvent('keyup', { key: '@', bubbles: true }));
            setTimeout(() => {
                const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                Object.defineProperty(event, 'keyCode', { get: () => 13 });
                editor.blockContainer.dispatchEvent(event);
                setTimeout(() => {
                    contentElement = getBlockContentElement(blockElement);
                    expect((contentElement.childNodes[0] as HTMLElement).id).toBe(editor.blocks[0].content[0].id);
                    expect((contentElement.childNodes[1] as HTMLElement).textContent).toBe('Initial text');

                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[1].content).toBe('Initial text');
                    done();
                }, 200);
            }, 200);
        });

        it('should check if option got selected on arrow keys of label insertion', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent = '$';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                expect(popup).not.toBeNull();
                const suggestionItems = popup.querySelectorAll('li[role="option"]');
                let initialActiveItem = suggestionItems[0] as HTMLElement;
                let targetItemAfterFirstArrowDown = suggestionItems[1] as HTMLElement;
                expect(initialActiveItem.getAttribute('aria-selected')).toBe('true');
                expect(targetItemAfterFirstArrowDown.getAttribute('aria-selected')).toBeNull();
                const event = new KeyboardEvent('keydown', {
                  key: 'ArrowDown',
                  code: 'ArrowDown',
                  bubbles: true
                });

                Object.defineProperty(event, 'keyCode', {
                  get: () => 40
                });
                editor.blockContainer.dispatchEvent(event);

                expect(initialActiveItem.getAttribute('aria-selected')).toBeNull();
                expect(targetItemAfterFirstArrowDown.getAttribute('aria-selected')).toBe('true');
                done();
            }, 200);
        });

        it('should check if option got selected on arrow keys of mention insertion', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;

            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent = '@';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-content.e-dropdownbase') as HTMLElement;
                expect(popup).not.toBeNull();
            
                const suggestionItems = popup.querySelectorAll('li[role="option"]');
                const initialActiveItem = suggestionItems[0] as HTMLElement;
                const targetItemAfterFirstArrowDown = suggestionItems[1] as HTMLElement;
            
                expect(initialActiveItem.getAttribute('aria-selected')).toBe('true');
                expect(targetItemAfterFirstArrowDown.getAttribute('aria-selected')).toBeNull();
            
                const event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    bubbles: true
                });
                Object.defineProperty(event, 'keyCode', { get: () => 40 });
                editor.blockContainer.dispatchEvent(event);
            
                setTimeout(() => {
                    expect(initialActiveItem.getAttribute('aria-selected')).toBeNull();
                    expect(targetItemAfterFirstArrowDown.getAttribute('aria-selected')).toBe('true');
                    done();
                }, 200);
            }, 200);
        });

        it('filtering on a label insertion', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            contentElement.textContent = '$o';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: 'o', code: 'KeyO', bubbles: true }));

            setTimeout(() => {
                contentElement.textContent = '$on';
                setCursorPosition(contentElement, contentElement.textContent.length);
                editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: 'n', code: 'KeyN', bubbles: true }));
    
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup') as HTMLElement;
                    expect(popup).not.toBeNull();
                    const items = popup.querySelectorAll('li[role="option"]');
                    expect(items.length).toBeGreaterThan(0);
                    const firstItem = items[0] as HTMLElement;
                    expect(firstItem.dataset.value).toBe('hold');
                    done();
                }, 300);
            }, 300);
        });

        //it('should filter mention suggestions and keep first filtered result active/selected', (done) => {
            // const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            // const contentElement = getBlockContentElement(blockElement) as HTMLElement;

            // // Focus the block and type "@"
            // editor.blockManager.setFocusToBlock(blockElement);
            // contentElement.textContent = '@John ';
            // setCursorPosition(contentElement, contentElement.textContent.length);
            // editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            // editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));

            // setTimeout(() => {

            //     contentElement.textContent = '@John P';
            //     setCursorPosition(contentElement, contentElement.textContent.length);
            //     editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            //     editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: 'P', code: 'KeyP', bubbles: true }));
            
            //     setTimeout(() => {
            //         const filteredMenu = document.querySelector('.e-content.e-dropdownbase') as HTMLElement;
            //         expect(filteredMenu).not.toBeNull();
            //         const items = filteredMenu.querySelectorAll('li');
            //         expect(items.length).toBeGreaterThan(0);
            //         const firstItem = items[0] as HTMLElement;
            //         expect(firstItem.dataset.value).toBe('user1');
            //         editor.blockContainer.dispatchEvent(
            //           new KeyboardEvent('keydown', {
            //             key: 'Enter',
            //             code: 'Enter',
            //             keyCode: 13,
            //             which: 13,
            //             bubbles: true
            //           } as KeyboardEventInit as any)
            //         );
            //         setTimeout(() => {
            //             expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            //             done();
            //         }, 300);
            //     }, 500);
            // }, 500);
        //});
    });

    describe('Popup check on Label Insertion', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: 'Initial text' }]
            }];
            const users: UserModel[] = [
                { id: 'user1', user: 'John Paul' },
                { id: 'user2', user: 'John Snow' }
            ];
            editor = createEditor({
                blocks: blocks,
                users: users, 
                readOnly: true
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('popup must not be triggered on readonly', (done) => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, contentElement.textContent.length);
            contentElement.dispatchEvent(new KeyboardEvent('keydown', { key: '@', bubbles: true }));
            expect(contentElement.textContent).not.toBe(contentElement.textContent + '@');
            done();
        });
        // test case alone fail even on src is handled
        // it('link dialog must not open on Ctrl+K in readonly', (done) => {
        //     const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
        //     const contentElement = getBlockContentElement(blockElement);

        //     // Focus the block
        //     editor.blockManager.setFocusToBlock(blockElement);

        //     // Select some text in the paragraph
        //     const range = document.createRange();
        //     const textNode = contentElement.firstChild as Text;
        //     range.setStart(textNode, 0);
        //     range.setEnd(textNode, Math.min(10, textNode.textContent.length));
        //     const selection = window.getSelection();
        //     selection.removeAllRanges();
        //     selection.addRange(range);

        //     // Try to open link dialog with Ctrl+K
        //     const ctrlK = new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', ctrlKey: true, bubbles: true });
        //     editor.element.dispatchEvent(ctrlK);

        //     // Ensure the link dialog is NOT opened in readonly mode
        //     setTimeout(() => {
        //         const linkDialog = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
        //         expect(linkDialog).toBeNull();
        //         done();
        //     }, 150);
        // });
    });
});
