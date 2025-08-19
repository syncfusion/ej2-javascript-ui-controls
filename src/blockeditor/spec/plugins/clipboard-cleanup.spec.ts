import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, ContentType } from '../../src/index';
import { ClipboardCleanupModule } from '../../src/blockeditor/plugins/index';
import { createEditor } from '../common/util.spec';

describe('Clipboard Cleanup Module', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let cleanupModule: ClipboardCleanupModule;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        
        editor = createEditor({
            blocks: [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'content1', type: ContentType.Text, content: 'Test content' }
                    ]
                }
            ]
        });
        
        editor.appendTo('#editor');
        cleanupModule = new ClipboardCleanupModule(editor);
    });

    afterEach(() => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(editorElement);
        cleanupModule = null;
    });

    describe('cleanupPaste method', () => {
        it('should handle plain text formatting when isPlainText is true', () => {
            const plainText = 'Line 1\nLine 2\nLine 3';
            editor.pasteSettings.plainText = true;
            const result = cleanupModule.cleanupPaste({
                plainText: plainText
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('Line 1')).toBeGreaterThan(-1);
            expect(result.indexOf('Line 2')).toBeGreaterThan(-1);
            expect(result.indexOf('Line 3')).toBeGreaterThan(-1);
        });

        it('should detect MS Word content and clean it', () => {
            const msWordHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="Generator" content="Microsoft Word 15"><style>p.MsoNormal, li.MsoNormal, div.MsoNormal{margin:0in;font-size:11.0pt;font-family:"Calibri",sans-serif;}h1{margin-top:12.0pt;margin-right:0in;margin-bottom:0in;margin-left:0in;font-size:16.0pt;font-family:"Calibri Light",sans-serif;color:#2F5496;font-weight:normal;}a:link, span.MsoHyperlink{color:#0563C1;text-decoration:underline;}span.Heading1Char{font-family:"Calibri Light",sans-serif;color:#2F5496;}.MsoChpDefault{font-family:"Calibri",sans-serif;}</style></head><body><h1>Test Heading</h1><p class="MsoNormal">This is some <b>bold</b> text and <i>italic</i> text from Word.</p><p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item 1</p><p class="MsoListParagraphCxSpMiddle" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item 2</p></body></html>';

            const result = cleanupModule.cleanupPaste({
                html: msWordHtml
            });

            expect(result).toBeDefined();
            expect(result.indexOf('MsoNormal')).toBe(-1); // Should remove MS Word classes
            expect(result).toContain('Test Heading');
            expect(result.indexOf('<!--[if !supportLists]-->')).toBe(-1); // Should remove comments
            expect(result.indexOf('<b>bold</b>')).toBeGreaterThan(-1); // Should preserve formatting
            expect(result.indexOf('<i>italic</i>')).toBeGreaterThan(-1);
            expect(result.indexOf('<li')).toBeGreaterThan(-1); // Should convert lists
        });

        it('should clean up regular HTML content', () => {
            const html = '<div style="color:red; font-size:14px; background-color:#f5f5f5;"><p>This is a <strong>test</strong> paragraph with <span style="text-decoration:underline;">styling</span>.</p><script>alert("test");</script><style>.test{color:red;}</style></div>';
            
            const result = cleanupModule.cleanupPaste({
                html: html,
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<script>')).toBe(-1); // Should remove script tags
            expect(result.indexOf('<style>')).toBe(-1); // Should remove style tags
            expect(result.indexOf('<strong>')).toBeGreaterThan(-1); // Should preserve basic formatting
        });
        
        it('should strip all formatting when keepFormat is false', () => {
            const html = '<div style="color:red; font-size:14px;"><p>This is a <strong>test</strong> paragraph with <span style="text-decoration:underline;">styling</span>.</p></div>';
            editor.pasteSettings.keepFormat = false;
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('style=')).toBe(-1); // Should remove all style attributes
            expect(result.indexOf('class=')).toBe(-1); // Should remove all class attributes
        });
    });

    describe('MS Word content cleaning', () => {

        it('should convert MS Word lists to HTML lists', () => {
            const msWordLists = '<p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1.<span style="font:7.0pt">&nbsp;</span></span>Item 1</p><p class="MsoListParagraphCxSpMiddle" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">2.<span style="font:7.0pt">&nbsp;</span></span>Item 2</p><p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">3.<span style="font:7.0pt">&nbsp;</span></span>Item 3</p>';
            
            const result = cleanupModule.cleanupPaste({
                html: msWordLists
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<ol')).toBeGreaterThan(-1); // Should convert to ordered list
            expect(result.indexOf('<li')).toBeGreaterThan(-1); // Should have list items
            expect(result.indexOf('Item 1')).toBeGreaterThan(-1);
            expect(result.indexOf('Item 2')).toBeGreaterThan(-1);
            expect(result.indexOf('Item 3')).toBeGreaterThan(-1);
            expect(result.indexOf('MsoListParagraph')).toBe(-1); // Should remove MS classes
        });

        it('should handle MS Word nested lists correctly', () => {
            const msWordNestedLists = '<p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1.</span>Item 1</p><p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level2 lfo1"><span style="mso-list:Ignore">a.</span>Subitem 1.1</p><p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level2 lfo1"><span style="mso-list:Ignore">b.</span>Subitem 1.2</p><p class="MsoListParagraphCxSpLast" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">2.</span>Item 2</p>';
            
            const result = cleanupModule.cleanupPaste({
                html: msWordNestedLists
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<ol')).toBeGreaterThan(-1);
            expect(result.indexOf('<li')).toBeGreaterThan(-1);
            
            // Create a temporary div to check structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Check if there are nested lists
            const nestedLists = tempDiv.querySelectorAll('li ol, li ul');
            expect(nestedLists.length).toBeGreaterThan(0);
            
            // Check content
            expect(tempDiv.textContent).toContain('Item 1');
            expect(tempDiv.textContent).toContain('Subitem 1.1');
            expect(tempDiv.textContent).toContain('Subitem 1.2');
            expect(tempDiv.textContent).toContain('Item 2');
        });

        it('should handle different MS Word list types correctly', () => {
            // Test with bullet list (ul)
            const msWordBulletList = '<p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">•</span>Bullet 1</p><p class="MsoListParagraphCxSpLast" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">•</span>Bullet 2</p>';
            
            const bulletResult = cleanupModule.cleanupPaste({
                html: msWordBulletList
            });
            
            expect(bulletResult).toBeDefined();
            expect(bulletResult.indexOf('<ul')).toBeGreaterThan(-1); // Should be unordered list
            expect(bulletResult.indexOf('Bullet 1')).toBeGreaterThan(-1);
            
            // Test with numbered list (ol)
            const msWordNumberedList = '<p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1.</span>Number 1</p><p class="MsoListParagraphCxSpLast" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">2.</span>Number 2</p>';
            
            const numberedResult = cleanupModule.cleanupPaste({
                html: msWordNumberedList
            });
            
            expect(numberedResult).toBeDefined();
            expect(numberedResult.indexOf('<ol')).toBeGreaterThan(-1); // Should be ordered list
            expect(numberedResult.indexOf('Number 1')).toBeGreaterThan(-1);
        });

        it('should clean MS Word table formatting', () => {
            const msWordTable = '<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-layout-alt:fixed;border:none;mso-border-alt:solid windowtext .5pt;mso-padding-alt:0in 5.4pt 0in 5.4pt"><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes"><td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt"><p class="MsoNormal">Cell 1</p></td><td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt"><p class="MsoNormal">Cell 2</p></td></tr><tr style="mso-yfti-irow:1;mso-yfti-lastrow:yes"><td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt"><p class="MsoNormal">Cell 3</p></td><td width="307" valign="top" style="width:230.5pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt"><p class="MsoNormal">Cell 4</p></td></tr></table>';
            
            const result = cleanupModule.cleanupPaste({
                html: msWordTable
            });
            
            expect(result).toBeDefined();
            
            // Create a temporary div to check structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Verify table is preserved but MS Word specific attributes are removed
            const table = tempDiv.querySelector('table');
            expect(table).not.toBeNull();
            expect(table.classList.contains('e-blockeditor-table')).toBe(true);
            expect(table.hasAttribute('border')).toBe(false);
            expect(table.hasAttribute('cellspacing')).toBe(false);
            expect(table.hasAttribute('cellpadding')).toBe(false);
            expect(table.classList.contains('MsoNormalTable')).toBe(false);
            
            // Check cells content is preserved
            const cells = tempDiv.querySelectorAll('td');
            expect(cells.length).toBe(4);
            expect(cells[0].textContent).toContain('Cell 1');
            expect(cells[1].textContent).toContain('Cell 2');
            expect(cells[2].textContent).toContain('Cell 3');
            expect(cells[3].textContent).toContain('Cell 4');
        });
    });

    describe('MS Word content detection', () => {
        it('should detect MS Word content from various patterns', () => {
            // Classic MS Word pattern
            expect(cleanupModule.isFromMsWord('<p class="MsoNormal">Test</p>')).toBe(true);
            
            // Style-based pattern
            expect(cleanupModule.isFromMsWord('<p style="mso-list:l0 level1 lfo1">Test</p>')).toBe(true);
            
            // Office 365 patterns
            expect(cleanupModule.isFromMsWord('<div class="OutlineElement">Test</div>')).toBe(true);
            expect(cleanupModule.isFromMsWord('<div class="SCXW218690740">Test</div>')).toBe(true);
            expect(cleanupModule.isFromMsWord('<div class="BCX0">Test</div>')).toBe(true);
            expect(cleanupModule.isFromMsWord('<div class="TextRun">Test</div>')).toBe(true);
            expect(cleanupModule.isFromMsWord('<div data-ccp-props="{&quot;201341983&quot;:0}">Test</div>')).toBe(true);
            
            // Non-Word content
            expect(cleanupModule.isFromMsWord('<p>Regular HTML</p>')).toBe(false);
            expect(cleanupModule.isFromMsWord('<div class="google-docs">Google Doc</div>')).toBe(false);
        });
    });

    describe('MS Word List Processing', () => {
        it('should add list classes to elements with mso-list style', () => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = '<p style="mso-list:l0 level1 lfo1">Test</p><div style="mso-list:l1 level2 lfo2">Another</div><h1 style="mso-list:l2 level1 lfo3">No class for heading</h1><li style="mso-list:l3 level1 lfo4">Already a list item</li>';
            
            // Call addListClass method
            (cleanupModule as any).addListClass(tempDiv);
            
            // Check that appropriate elements got the class
            expect(tempDiv.querySelector('p').classList.contains('msolistparagraph')).toBe(true);
            expect(tempDiv.querySelector('div').classList.contains('msolistparagraph')).toBe(true);
            expect(tempDiv.querySelector('h1').classList.contains('msolistparagraph')).toBe(false); // Headings shouldn't get class
            expect(tempDiv.querySelector('li').classList.contains('msolistparagraph')).toBe(false); // List items shouldn't get class
        });
        
        it('should properly identify list style types', () => {
            // Test decimal list style type
            expect((cleanupModule as any).getlistStyleType('1.', 'ol')).toBe('decimal');
            expect((cleanupModule as any).getlistStyleType('10.', 'ol')).toBe('decimal');
            
            // Test decimal-leading-zero list style type
            expect((cleanupModule as any).getlistStyleType('01.', 'ol')).toBe('decimal-leading-zero');
            
            // Test upper-alpha list style type
            expect((cleanupModule as any).getlistStyleType('A.', 'ol')).toBe('upper-alpha');
            expect((cleanupModule as any).getlistStyleType('Z.', 'ol')).toBe('upper-alpha');
            
            // Test lower-alpha list style type
            expect((cleanupModule as any).getlistStyleType('a.', 'ol')).toBe('lower-alpha');
            expect((cleanupModule as any).getlistStyleType('z.', 'ol')).toBe('lower-alpha');
            
            // Test upper-roman list style type
            expect((cleanupModule as any).getlistStyleType('I.', 'ol')).toBe('upper-roman');
            expect((cleanupModule as any).getlistStyleType('V.', 'ol')).toBe('upper-roman');
            expect((cleanupModule as any).getlistStyleType('X.', 'ol')).toBe('upper-roman');
            
            // Test lower-roman list style type
            expect((cleanupModule as any).getlistStyleType('i.', 'ol')).toBe('lower-roman');
            expect((cleanupModule as any).getlistStyleType('v.', 'ol')).toBe('lower-roman');
            expect((cleanupModule as any).getlistStyleType('x.', 'ol')).toBe('lower-roman');
            
            // Test lower-greek list style type
            expect((cleanupModule as any).getlistStyleType('α.', 'ol')).toBe('lower-greek');
            expect((cleanupModule as any).getlistStyleType('β.', 'ol')).toBe('lower-greek');
            
            // Test unordered list style types
            expect((cleanupModule as any).getlistStyleType('•', 'ul')).toBe('disc');
            expect((cleanupModule as any).getlistStyleType('o', 'ul')).toBe('circle');
            expect((cleanupModule as any).getlistStyleType('§', 'ul')).toBe('square');
        });

        it('should extract list content from complex list elements', () => {
            // Create a list item element
            const listElem = document.createElement('p');
            listElem.className = 'MsoListParagraphCxSpFirst';
            listElem.innerHTML = '<span style="mso-list:Ignore">1.<span style="font:7.0pt Times New Roman">&nbsp;&nbsp;</span></span>List item text';
            
            // Reset listContents array
            (cleanupModule as any).listContents = [];
            
            // Call getListContent method
            (cleanupModule as any).getListContent(listElem);
            
            // Check the extracted content
            expect((cleanupModule as any).listContents.length).toBe(2);
            expect((cleanupModule as any).listContents[0]).toBe('1.');
            expect((cleanupModule as any).listContents[1]).toContain('List item text');
        });
        
        it('should handle list items without explicit mso-list marker', () => {
            // Create a list item without mso-list:Ignore style
            const listElem = document.createElement('p');
            listElem.className = 'MsoListParagraphCxSpFirst';
            listElem.innerHTML = '<span> 1. List item without explicit marker span </span>';
            
            // Reset listContents array
            (cleanupModule as any).listContents = [];
            
            // Call getListContent method
            (cleanupModule as any).getListContent(listElem);
            
            // Check that the pattern still matched and extracted
            expect((cleanupModule as any).listContents.length).toBe(2);
            expect((cleanupModule as any).listContents[0]).toBe('1.');
        });

        it('should convert Word list paragraphs to HTML lists', () => {
            const msWordListParagraphs = `
                <p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1.</span>Item 1</p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">2.</span>Item 2</p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">3.</span>Item 3</p>
            `;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = msWordListParagraphs;
            
            // Call convertWordListParagraphs method
            (cleanupModule as any).convertWordListParagraphs(tempDiv);
            
            // Check that paragraphs were converted to a list
            const list = tempDiv.querySelector('ol');
            expect(list).not.toBeNull();
            
            const items = list.querySelectorAll('li');
            expect(items.length).toBe(3);
            expect(items[0].textContent).toBe('1.Item 1');
            expect(items[1].textContent).toBe('2.Item 2');
            expect(items[2].textContent).toBe('3.Item 3');
            
            // Original paragraphs should be gone
            expect(tempDiv.querySelectorAll('p.MsoListParagraph').length).toBe(0);
        });
    });

    describe('MS Word list conversion', () => {
        it('should convert simple numbered lists', () => {
            const msWordLists = `
                <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">1.<span style="font:7.0pt">&nbsp;</span></span>Item 1
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="text-indent:-.25in;mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">2.<span style="font:7.0pt">&nbsp;</span></span>Item 2
                </p>
                <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">3.<span style="font:7.0pt">&nbsp;</span></span>Item 3
                </p>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordLists
            });
            
            // Create a DOM element to test the structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Should have an ordered list
            const list = tempDiv.querySelector('ol');
            expect(list).not.toBeNull();
            
            // Should have 3 list items
            const items = list.querySelectorAll('li');
            expect(items.length).toBe(3);
            expect(items[0].textContent).toContain('Item 1');
            expect(items[1].textContent).toContain('Item 2');
            expect(items[2].textContent).toContain('Item 3');
        });

        it('should convert bullet lists', () => {
            const msWordBulletList = `
                <p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">•</span>Bullet 1
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">•</span>Bullet 2
                </p>
                <p class="MsoListParagraphCxSpLast" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">•</span>Bullet 3
                </p>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordBulletList
            });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Should have an unordered list
            const list = tempDiv.querySelector('ul');
            expect(list).not.toBeNull();
            
            // Should have 3 list items
            const items = list.querySelectorAll('li');
            expect(items.length).toBe(3);
            expect(items[0].textContent).toContain('Bullet 1');
            expect(items[1].textContent).toContain('Bullet 2');
            expect(items[2].textContent).toContain('Bullet 3');
        });

        it('should handle nested lists with different levels', () => {
            const msWordNestedList = `
                <p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">1.</span>First level item 1
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level2 lfo1">
                    <span style="mso-list:Ignore">a.</span>Second level item 1.1
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level2 lfo1">
                    <span style="mso-list:Ignore">b.</span>Second level item 1.2
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">2.</span>First level item 2
                </p>
                <p class="MsoListParagraphCxSpLast" style="mso-list:l0 level2 lfo1">
                    <span style="mso-list:Ignore">a.</span>Second level item 2.1
                </p>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordNestedList
            });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Check the overall structure
            const topLevelLists = tempDiv.children;
            expect(topLevelLists.length).toBeGreaterThan(0);
            
            // Find the nested lists
            const nestedLists = tempDiv.querySelectorAll('li ul, li ol');
            expect(nestedLists.length).toBeGreaterThan(0);
            
            // Check content - should have first and second level items
            expect(tempDiv.textContent).toContain('First level item 1');
            expect(tempDiv.textContent).toContain('Second level item 1.1');
            expect(tempDiv.textContent).toContain('Second level item 1.2');
            expect(tempDiv.textContent).toContain('First level item 2');
            expect(tempDiv.textContent).toContain('Second level item 2.1');
        });

        it('should handle lists with different numbering styles', () => {
            const msWordMixedList = `
                <p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">I.</span>Roman numeral 1
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">II.</span>Roman numeral 2
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l1 level1 lfo2">
                    <span style="mso-list:Ignore">A.</span>Alpha item A
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l1 level1 lfo2">
                    <span style="mso-list:Ignore">B.</span>Alpha item B
                </p>
                <p class="MsoListParagraphCxSpLast" style="mso-list:l2 level1 lfo3">
                    <span style="mso-list:Ignore">i.</span>Lower roman i
                </p>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordMixedList
            });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Should have multiple lists with different styles
            const lists = tempDiv.querySelectorAll('ol');
            expect(lists.length).toBeGreaterThan(1); // Should have separate lists
            
            // Check content is preserved
            expect(tempDiv.textContent).toContain('Roman numeral 1');
            expect(tempDiv.textContent).toContain('Roman numeral 2');
            expect(tempDiv.textContent).toContain('Alpha item A');
            expect(tempDiv.textContent).toContain('Alpha item B');
            expect(tempDiv.textContent).toContain('Lower roman i');
        });

        it('should handle lists with custom start attribute', () => {
            const msWordListWithStart = `
                <p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">5.</span>Item starting at 5
                </p>
                <p class="MsoListParagraphCxSpMiddle" style="mso-list:l0 level1 lfo1">
                    <span style="mso-list:Ignore">6.</span>Item 6
                </p>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordListWithStart
            });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Should have an ordered list
            const list = tempDiv.querySelector('ol');
            expect(list).not.toBeNull();
            
            // Should have start attribute set (or equivalent style)
            const hasStartAttr = list.hasAttribute('start') || 
                (list.hasAttribute('style') && list.getAttribute('style').includes('counter-reset:'));
                
            expect(hasStartAttr).toBe(true);
            
            // If start attribute is present, check its value
            if (list.hasAttribute('start')) {
                expect(list.getAttribute('start')).toBe('5');
            }
        });
    });

    describe('Word table processing', () => {
        it('should clean up complex MS Word tables', () => {
            const msWordTable = `
                <table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-layout-alt:fixed;border:none;mso-border-alt:solid windowtext .5pt;mso-padding-alt:0in 5.4pt 0in 5.4pt">
                    <tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes">
                        <td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
                            <p class="MsoNormal">Cell 1</p>
                        </td>
                        <td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
                            <p class="MsoNormal">Cell 2</p>
                        </td>
                    </tr>
                    <tr style="mso-yfti-irow:1;mso-yfti-lastrow:yes">
                        <td width="307" valign="top" style="width:230.5pt;border:solid windowtext 1.0pt;border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
                            <p class="MsoNormal">Cell 3</p>
                        </td>
                        <td width="307" valign="top" style="width:230.5pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
                            <p class="MsoNormal"></p>
                        </td>
                    </tr>
                </table>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordTable
            });
            
            // Create a temporary div to check structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Check that Word-specific attributes are removed
            const table = tempDiv.querySelector('table');
            expect(table).not.toBeNull();
            expect(table.classList.contains('e-blockeditor-table')).toBe(true);
            expect(table.hasAttribute('border')).toBe(false);
            expect(table.hasAttribute('cellspacing')).toBe(false);
            expect(table.hasAttribute('cellpadding')).toBe(false);
            expect(table.classList.contains('MsoNormalTable')).toBe(false);
            
            // Check cells content and empty cell handling
            const cells = tempDiv.querySelectorAll('td');
            expect(cells.length).toBe(4);
            expect(cells[0].textContent).toContain('Cell 1');
            expect(cells[1].textContent).toContain('Cell 2');
            expect(cells[2].textContent).toContain('Cell 3');
            expect(cells[3].textContent).toBe('\u00a0'); // Empty cell should have &nbsp;
        });

        it('should clean complex MS Word table attributes', () => {
            const msWordTableWithAttributes = `
                <table class="MsoNormalTable" border="1" cellspacing="5" cellpadding="10"
                       style="mso-table-lspace: 5.0pt; mso-table-rspace: 10pt; mso-table-anchor-vertical:paragraph; mso-table-anchor-horizontal:margin; mso-table-left:center; mso-table-right:left">
                    <tr height="40" style="mso-row-margin-left:10.0pt;mso-row-margin-right:10.0pt">
                        <td width="50%" height="30" style="mso-cell-special:placeholder;border:dotted 1.0pt">
                            <p class="MsoNormal">Test</p>
                        </td>
                    </tr>
                </table>
            `;
            
            const result = cleanupModule.cleanupPaste({
                html: msWordTableWithAttributes
            });
            
            // Create a temporary div to check structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // Check that Word-specific attributes are removed
            const table = tempDiv.querySelector('table');
            expect(table).not.toBeNull();
            
            // Word-specific attributes should be removed
            expect(table.hasAttribute('border')).toBe(false);
            expect(table.hasAttribute('cellspacing')).toBe(false);
            expect(table.hasAttribute('cellpadding')).toBe(false);
            
            // Cells should preserve content
            const tdContent = tempDiv.querySelector('td').textContent;
            expect(tdContent).toContain('Test');
        });
    });

    describe('makeConversion method', () => {
        it('should convert first level lists with MsoListParagraphCxSpFirst class', () => {
            const collection: any = [{
                listType: 'ol',
                content: ['Item 1'],
                nestedLevel: 1,
                listFormatOverride: 1,
                class: 'MsoListParagraphCxSpFirst',
                listStyle: 'color:red',
                listStyleTypeName: 'decimal',
                start: 1,
                styleMarginLeft: '20px'
            }];
            
            const result = (cleanupModule as any).makeConversion(collection);
            
            expect(result.tagName).toBe('DIV');
            const list = result.querySelector('ol');
            expect(list).not.toBeNull();
            expect(list.getAttribute('level')).toBe('1');
            expect(list.style.marginLeft).toBe('20px');
            expect(list.style.listStyleType).toBe('decimal');
            
            const item = list.querySelector('li');
            expect(item).not.toBeNull();
            expect(item.hasAttribute('class')).toBe(true);
            expect(item.getAttribute('class')).toBe('MsoListParagraphCxSpFirst');
            expect(item.getAttribute('style')).toBe('color:red');
            expect(item.textContent).toBe('Item 1');
        });
        
        it('should handle regular msolistparagraph class lists', () => {
            const collection: any = [{
                listType: 'ol',
                content: ['Item 1'],
                nestedLevel: 1,
                listFormatOverride: 1,
                class: 'msolistparagraph',
                listStyle: '',
                listStyleTypeName: 'decimal',
                start: 1,
                styleMarginLeft: '20px'
            }];
            
            const result = (cleanupModule as any).makeConversion(collection);
            const list = result.querySelector('ol');
            
            expect(list.classList.contains('marginLeftIgnore')).toBe(true);
        });
        
        it('should handle multiple items at same level and format', () => {
            const collection: any = [
                {
                    listType: 'ol',
                    content: ['Item 1'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: 'MsoListParagraphCxSpFirst',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: 1,
                    styleMarginLeft: ''
                },
                {
                    listType: 'ol',
                    content: ['Item 2'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: 'MsoListParagraphCxSpMiddle',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: null,
                    styleMarginLeft: ''
                }
            ];
            
            const result = (cleanupModule as any).makeConversion(collection);
            const list = result.querySelector('ol');
            const items = list.querySelectorAll('li');
            
            expect(items.length).toBe(2);
            expect(items[0].textContent).toBe('Item 1');
            expect(items[1].textContent).toBe('Item 2');
        });
        
        it('should handle nested levels properly', () => {
            const collection: any = [
                {
                    listType: 'ol',
                    content: ['Item 1'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: null,
                    styleMarginLeft: ''
                },
                {
                    listType: 'ul',
                    content: ['Subitem 1.1'],
                    nestedLevel: 2,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'disc',
                    start: null,
                    styleMarginLeft: ''
                }
            ];
            
            const result = (cleanupModule as any).makeConversion(collection);
            
            // Check overall structure
            const topLevelList = result.querySelector('ol');
            expect(topLevelList).not.toBeNull();
            
            // Check nested list
            const nestedList = topLevelList.querySelector('li > ul');
            expect(nestedList).not.toBeNull();
            expect(nestedList.getAttribute('level')).toBe('2');
            expect(nestedList.style.listStyleType).toBe('disc');
            
            // Check content
            const topLevelItem = topLevelList.querySelector('li');
            const nestedItem = nestedList.querySelector('li');
            expect(topLevelItem.textContent).toContain('Item 1');
            expect(nestedItem.textContent).toBe('Subitem 1.1');
        });
        
        it('should handle multiple nesting levels', () => {
            const collection: any = [
                {
                    listType: 'ol',
                    content: ['Item 1'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: null,
                    styleMarginLeft: ''
                },
                {
                    listType: 'ul',
                    content: ['Subitem 1.1'],
                    nestedLevel: 3, // Skip level 2 to test multiple nesting creation
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'disc',
                    start: null,
                    styleMarginLeft: ''
                }
            ];
            
            const result = (cleanupModule as any).makeConversion(collection);
            
            // Should create intermediate levels
            const topLevelItem = result.querySelector('ol > li');
            const level2List = topLevelItem.querySelector('ul');
            expect(level2List).not.toBeNull();
            
            // Level 2 list item should have list-style-type: none
            const level2Item = level2List.querySelector('li');
            expect(level2Item.style.listStyleType).toBe('none');
            
            // Level 3 list
            const level3List = level2Item.querySelector('ul');
            expect(level3List).not.toBeNull();
            expect(level3List.getAttribute('level')).toBe('3');
        });
        
        it('should handle mixed list types', () => {
            const collection: any = [
                {
                    listType: 'ol',
                    content: ['Item 1'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: null,
                    styleMarginLeft: ''
                },
                {
                    listType: 'ul', // Different list type
                    content: ['Item 2'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'disc',
                    start: null,
                    styleMarginLeft: ''
                }
            ];
            
            const result = (cleanupModule as any).makeConversion(collection);
            
            // Should create separate lists
            const lists = result.querySelectorAll('ol, ul');
            expect(lists.length).toBe(2);
            expect(lists[0].tagName).toBe('OL');
            expect(lists[1].tagName).toBe('UL');
        });
        
        it('should handle different list format overrides', () => {
            const collection: any = [
                {
                    listType: 'ol',
                    content: ['Item 1'],
                    nestedLevel: 1,
                    listFormatOverride: 1,
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'decimal',
                    start: null,
                    styleMarginLeft: ''
                },
                {
                    listType: 'ol',
                    content: ['Item A'], 
                    nestedLevel: 1,
                    listFormatOverride: 2, // Different override
                    class: '',
                    listStyle: '',
                    listStyleTypeName: 'upper-alpha',
                    start: null,
                    styleMarginLeft: ''
                }
            ];
            
            const result = (cleanupModule as any).makeConversion(collection);
            
            // Should create separate lists
            const lists = result.querySelectorAll('ol');
            expect(lists.length).toBe(2);
            expect(lists[0].style.listStyleType).toBe('decimal');
            expect(lists[1].style.listStyleType).toBe('upper-alpha');
        });
        
        it('should handle list start attribute when specified', () => {
            const collection: any = [{
                listType: 'ol',
                content: ['Item 5'],
                nestedLevel: 1,
                listFormatOverride: 1,
                class: '',
                listStyle: '',
                listStyleTypeName: 'decimal',
                start: 5, // Start at 5
                styleMarginLeft: ''
            }];
            
            const result = (cleanupModule as any).makeConversion(collection);
            const list = result.querySelector('ol');
            
            expect(list.getAttribute('start')).toBe('5');
        });
    });

    describe('listConverter method', () => {
        it('should convert list nodes to HTML lists', () => {
            // Create list nodes to test
            const node1 = document.createElement('p');
            node1.className = 'MsoListParagraphCxSpFirst';
            node1.setAttribute('style', 'mso-list:l0 level1 lfo1');
            node1.innerHTML = '<span style="mso-list:Ignore">1.</span>Item 1';
            
            const node2 = document.createElement('p');
            node2.className = 'MsoListParagraphCxSpMiddle';
            node2.setAttribute('style', 'mso-list:l0 level1 lfo1');
            node2.innerHTML = '<span style="mso-list:Ignore">2.</span>Item 2';
            
            const listNodes = [node1, node2, null]; // null marks end of list
            
            // Create parent container
            const container = document.createElement('div');
            container.appendChild(node1);
            container.appendChild(node2);
            
            // Reset list contents
            (cleanupModule as any).listContents = [];
            
            // Call listConverter
            (cleanupModule as any).listConverter(listNodes);
            
            // Check results - nodes should be replaced with a list
            expect(container.querySelector('ol')).not.toBeNull();
            const items = container.querySelectorAll('li');
            expect(items.length).toBe(2);
        });
    });

    describe('splitBreakLine method', () => {
        it('should convert line breaks to HTML paragraphs', () => {
            const text = 'Line 1\n\nLine 2\n\nLine 3';
            const result = (cleanupModule as any).splitBreakLine(text);
            
            // First line should not be wrapped in paragraph
            expect(result.indexOf('Line 1')).toBe(0);
            expect(result.indexOf('<p>Line 2</p>')).toBeGreaterThan(0);
            expect(result.indexOf('<p>Line 3</p>')).toBeGreaterThan(0);
            expect(result.match(/<p>/g).length).toBe(2); // Should have 2 paragraphs
        });
        
        it('should convert single line breaks to <br> tags', () => {
            const text = 'Line 1\nMore text\nAnother line';
            const result = (cleanupModule as any).splitBreakLine(text);
            
            expect(result.indexOf('<br>')).toBeGreaterThan(0);
            expect(result.match(/<br>/g).length).toBe(2); // Should have 2 <br> tags
        });
        
        it('should ignore empty lines', () => {
            const text = 'Line 1\n\n\n\nLine 2';
            const result = (cleanupModule as any).splitBreakLine(text);
            
            expect(result.indexOf('Line 1')).toBe(0);
            expect(result.indexOf('<p>Line 2</p>')).toBeGreaterThan(0);
            expect(result.indexOf('<p></p>')).toBe(-1); // No empty paragraphs
        });
    });

    describe('getTextContent method', () => {
        it('should convert block elements to paragraphs', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <h1>Heading</h1>
                <div>Div content</div>
                <blockquote>Quote</blockquote>
            `;
            
            (cleanupModule as any).getTextContent(container);
            
            // All block elements should be converted to paragraphs
            expect(container.querySelectorAll('p').length).toBe(3);
            expect(container.querySelectorAll('h1, div, blockquote').length).toBe(0);
            
            // Content should be preserved
            expect(container.textContent).toContain('Heading');
            expect(container.textContent).toContain('Div content');
            expect(container.textContent).toContain('Quote');
        });
        
        it('should strip all attributes from elements', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <p style="color:red;" class="test" data-custom="value">Text</p>
                <span id="span1" title="tooltip">Span content</span>
            `;
            
            (cleanupModule as any).getTextContent(container);
            
            // All attributes should be removed
            const elements = container.querySelectorAll('*');
            let hasAttributes = false;
            
            elements.forEach(el => {
                if (el.attributes.length > 0) hasAttributes = true;
            });
            
            expect(hasAttributes).toBe(false);
        });
    });

    describe('cleanupCssPatterns method', () => {
        it('should remove CSS patterns in text nodes', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <p>Normal text</p>
                <p>ol { list-style-type: decimal; }</p>
                <p>ul { margin-left: 20px; }</p>
                <p>More normal text</p>
            `;
            
            (cleanupModule as any).cleanupCssPatterns(container);
            
            // CSS pattern text nodes should be removed
            expect(container.textContent).not.toContain('ol {');
            expect(container.textContent).not.toContain('ul {');
            expect(container.textContent).toContain('Normal text');
            expect(container.textContent).toContain('More normal text');
        });
    });

    describe('findClosestListElem method', () => {
        it('should find the closest list element', () => {
            // Create a nested list structure
            const container = document.createElement('div');
            container.innerHTML = `
                <ul id="ul1">
                    <li>Item 1
                        <ol id="ol1">
                            <li>Subitem 1.1
                                <ul id="ul2">
                                    <li>Subsubitem 1.1.1</li>
                                </ul>
                            </li>
                        </ol>
                    </li>
                </ul>
            `;
            
            // Test finding from innermost element
            const innerDiv = document.createElement('div');
            container.querySelector('#ul2 li').appendChild(innerDiv);
            
            const result1 = (cleanupModule as any).findClosestListElem(innerDiv);
            expect(result1.id).toBe('ul1');
            
            // Test finding from middle element
            const middleDiv = document.createElement('div');
            container.querySelector('#ol1 > li').insertBefore(middleDiv, container.querySelector('#ul2'));
            
            const result2 = (cleanupModule as any).findClosestListElem(middleDiv);
            expect(result2.id).toBe('ul1');
        });
        
        it('should return undefined if no list element is found', () => {
            const container = document.createElement('div');
            container.innerHTML = `<p>No list here</p>`;
            
            const result = (cleanupModule as any).findClosestListElem(container.querySelector('p'));
            expect(result).toBeUndefined();
        });
    });

    describe('cleanList method', () => {
        it('should clean up divs inside lists', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <ul>
                    <li>Item 1</li>
                    <div>This div should be moved</div>
                    <li>Item 2</li>
                </ul>
            `;
            
            (cleanupModule as any).cleanList(container, 'UL');
            
            // The div should be moved outside the list
            expect(container.querySelector('ul > div')).toBeNull();
            expect(container.querySelector('div')).not.toBeNull();
        });
        
        it('should preserve content from divs inside lists', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <ol>
                    <li>Item 1</li>
                    <div>Content to preserve <span>with formatting</span></div>
                    <li>Item 2</li>
                </ol>
            `;
            
            (cleanupModule as any).cleanList(container, 'OL');
            
            // Content should still be in the document
            expect(container.textContent).toContain('Content to preserve');
            expect(container.textContent).toContain('with formatting');
            expect(container.querySelector('span')).not.toBeNull();
        });
    });

    describe('findDetachEmptyElem method', () => {
        it('should find the deepest empty element to detach', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <div id="outer">
                    <div id="middle">
                        <span id="inner">nbsp;</span>
                    </div>
                </div>
            `;
            
            const innerElem = container.querySelector('#inner');
            const result = (cleanupModule as any).findDetachEmptyElem(innerElem);
            
            // Should return the innermost element (span)
            expect(result.id).toBe('inner');
        });
        
        it('should not include parents with non-empty content', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <div id="outer">
                    <div id="middle">Text
                        <span id="inner"></span>
                    </div>
                </div>
            `;
            
            const innerElem = container.querySelector('#inner');
            const result = (cleanupModule as any).findDetachEmptyElem(innerElem);
            
            // Should not include parent with text
            expect(result.id).toBe('inner');
        });
        
        it('should handle non-breaking spaces correctly', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <div id="outer">
                    <div id="middle">&nbsp;
                        <span id="inner"></span>
                    </div>
                </div>
            `;
            
            const innerElem = container.querySelector('#inner');
            const result = (cleanupModule as any).findDetachEmptyElem(innerElem);
            
            // Should not include parent with &nbsp;
            expect(result.id).toBe('inner');
        });
        
        it('should handle elements with images', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <div id="outer">
                    <div id="middle">
                        <img src="test.jpg">
                        <span id="inner"></span>
                    </div>
                </div>
            `;
            
            const innerElem = container.querySelector('#inner');
            const result = (cleanupModule as any).findDetachEmptyElem(innerElem);
            
            // Should not include parent with image
            expect(result.id).toBe('inner');
        });
    });

    describe('removeUnwantedElements method', () => {
        it('should call removeStyleElements', () => {
            const container = document.createElement('div');
            container.innerHTML = `<style>.test { color: red; }</style><p>Content</p>`;
            
            spyOn(cleanupModule as any, 'removeStyleElements').and.callThrough();
            (cleanupModule as any).removeUnwantedElements(container);
            
            expect((cleanupModule as any).removeStyleElements).toHaveBeenCalledWith(container);
            expect(container.querySelector('style')).toBeNull();
        });
    });

    describe('HTML cleanup functionality', () => {
        it('should remove unwanted elements', () => {
            const html = '<div>Content with <script>alert("test");</script><style>.test{color:red;}</style><meta name="test" content="test"><link rel="stylesheet" href="test.css"></div>';
            
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<script>')).toBe(-1);
            expect(result.indexOf('<style>')).toBe(-1);
            expect(result.indexOf('<meta')).toBe(-1);
            expect(result.indexOf('<link')).toBe(-1);
        });

        it('should remove HTML comments', () => {
            const html = '<div>Content <!-- This is a comment --> with comments</div>';
            
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<!-- This is a comment -->')).toBe(-1);
        });

        it('should remove empty elements', () => {
            const html = '<div>Content <span></span><p></p><div></div> with empty elements <strong>not empty</strong></div>';
            
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<span></span>')).toBe(-1);
            expect(result.indexOf('<p></p>')).toBe(-1);
            expect(result.indexOf('<div></div>')).toBe(-1);
            expect(result.indexOf('<strong>not empty</strong>')).toBeGreaterThan(-1);
        });

        it('should process images correctly', () => {
            const html = '<div>Content with <img src="test.jpg"> image</div>';
            
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('e-blockeditor-pasted-img')).toBeGreaterThan(-1);
            expect(result.indexOf('alt="Pasted image"')).toBeGreaterThan(-1);
        });

        it('should handle denied tags', () => {
            const html = '<div>Content with <font color="red">colored</font> text and <marquee>scrolling</marquee> text</div>';
            editor.pasteSettings.deniedTags = ['font', 'marquee'];
            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<font')).toBe(-1);
            expect(result.indexOf('<marquee')).toBe(-1);
        });

        it('should handle denied attributes', () => {
            const html = '<div>Content with <span style="color:red; data-custom="value">styled</span> text and <a href="http://example.com" target="_blank">link</a></div>';
            editor.pasteSettings.deniedTags = ['data-custom', 'target'];
            
            const result = cleanupModule.cleanupPaste({
                html: html
            });

            expect(result).toBeDefined();
            expect(result.indexOf('data-custom')).toBe(-1);
            expect(result.indexOf('target')).toBe(-1);
        });

        it('should handle allowed styles', () => {
            const html = '<div style="color:red; font-size:14px; background-color:#f5f5f5;">Styled content</div>';
            editor.pasteSettings.allowedStyles = ['color', 'background-color'];

            const result = cleanupModule.cleanupPaste({
                html: html
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('color:red')).toBeGreaterThan(-1);
            expect(result.indexOf('background-color')).toBeGreaterThan(-1);
            expect(result.indexOf('font-size:14px')).toBe(-1);
        });
    });

    describe('Plain text formatting', () => {
        it('should convert line breaks properly', () => {
            const plainText = 'Line 1\n\nLine 2\n\nLine 3';
            editor.pasteSettings.plainText = true;
            const result = cleanupModule.cleanupPaste({
                plainText: plainText
            });
            
            expect(result).toBeDefined();
            
            // Create a temporary div to check structure
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            expect(tempDiv.textContent).toContain('Line 1');
            expect(tempDiv.textContent).toContain('Line 2');
            expect(tempDiv.textContent).toContain('Line 3');
        });

        it('should strip all HTML from plain text', () => {
            const plainText = 'Line with <b>bold</b> and <i>italic</i> tags';
            editor.pasteSettings.plainText = true;
            
            const result = cleanupModule.cleanupPaste({
                plainText: plainText
            });
            
            expect(result).toBeDefined();
            expect(result.indexOf('<b>')).toBe(-1);
            expect(result.indexOf('<i>')).toBe(-1);
        });
    });

    describe('MS word Complex list conversion types method', function () {
        it('MSWord List Conversion Type 1', (done) => {
        /*
        •	One Node-1
        •	Two Node-1
        •	Three Node-1
        */
        let localElem = `
        <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-1<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-1<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-1<o:p></o:p></p>`;

        const result = cleanupModule.cleanupPaste({
            html: localElem
        });
        let expectedElem = `<ul level="1"><li style=""><p>One Node-1</p></li><li style=""><p>Two Node-1</p></li><li style=""><p>Three Node-1</p></li></ul>`;
        expect(result.trim()).toContain(expectedElem);
        done();
        });
        it('MSWord List Conversion Type 2', (done) => {
        /*
        <ol>
        1. One Node-1
        2. Two Node-1
        3. Three Node-1
        </ol>
        */
        let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-1<o:p></o:p></p>
        
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-1<o:p></o:p></p>
        
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>3.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-1<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ol level="1"><li style=""><p>One Node-1</p></li><li style=""><p>Two Node-1</p></li><li style=""><p>Three Node-1</p></li></ol>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 3', (done) => {
            /*
            •	One Node-3
                o	Two Node-3
            •	Three Node-3
            •	Four Node-3
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
            Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->One Node-3<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Two Node-3<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
            Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Three Node-3<o:p></o:p></p>
            <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
            Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Four Node-3<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>One Node-3</p><ul level="2"><li><p>Two Node-3</p><ul><li><ul level="4"><li><p>Three Node-3</p></li></ul></li></ul></li></ul></li><li style=""><p>Four Node-3</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 4', (done) => {
            /*
            1.	One Node-4
                o	Two Node-4
                o	Three Node-4
            2.	Four Node-4
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->One Node-4<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Two Node-4<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Three Node-4<o:p></o:p></p>
            <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Four Node-4<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ol level="1"><li style=""><p>One Node-4</p><ul level="2"><li><p>Two Node-4</p></li><li><p>Three Node-4</p></li></ul></li><li style=""><p>Four Node-4</p></li></ol>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 5', (done) => {
            /*
                1.	One Type-5
                a.	Two Type-5
                    i.	Three Type-5
                b.	Four Type-5
                2.	Five Type-5
                3.	Six Type-5
                a.	Seven Type-5

                1.	Eight Separate Type-5
                2.	Nine Separate Type-5
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->One Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>a.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Two Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.5in;mso-add-space:
            auto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l1 level3 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'><span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>i.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Three Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
            auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>b.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Four Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Five Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>3.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Six Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpLast' style='margin-left:1.0in;mso-add-space:auto;
            text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>a.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Seven Type-5<o:p></o:p></p>
            <p class='MsoNormal'><o:p>&nbsp;</o:p></p>
            <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Eight Separate Type-5<o:p></o:p></p>
            <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span><!--[endif]-->Nine Separate Type-5<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            const expectedElem = '<ol level="1"><li style=""><p>One Type-5</p><ol level="2"><li><p>Two Type-5</p><ol level="3"><li><p>Three Type-5</p></li></ol></li><li><p>Four Type-5</p></li></ol></li><li style=""><p>Five Type-5</p></li><li style=""><p>Six Type-5</p><ol level="2"><li><p>Seven Type-5</p></li></ol></li></ol>\n            <p>&nbsp;</p>\n            \n            <ol level="1"><li style=""><p>Eight Separate Type-5</p></li><li style=""><p>Nine Separate Type-5</p></li></ol>';
            const pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });
        it('MSWord List Conversion Type 6', (done) => {
            /*
            1.	One Node-6
            •	Two Node-6
            •	Three Node-6
            2.	Four Node-6
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-6<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:.75in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-6<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:.75in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-6<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Four Node-6<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ol level="1"><li style=""><p>One Node-6</p></li></ol><ul level="1"><li><p>Two Node-6</p></li><li><p>Three Node-6</p></li></ul><ol level="1"><li style=""><p>Four Node-6</p></li></ol>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 7', (done) => {
            /*
            •	One Node-7
            •	Two Node-7
                    o	Three Node-7
                        •	Four Node-7
                o	Five Node-7
            •	Six Node-7
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-7<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-7<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:2.5in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level5 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-7<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:3.5in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level7 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Four Node-7<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l1 level2 lfo2'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Five Node-7<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Six Node-7<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>One Node-7</p></li><li style=""><p>Two Node-7</p><ul><li><ul><li><ul><li><ul level="5"><li><p>Three Node-7</p><ul><li><ul level="7"><li><p>Four Node-7</p></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li><ul level="2"><li><p>Five Node-7</p></li></ul></ul><ul level="1"><li style=""><p>Six Node-7</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 8', (done) => {
            /*
            •	One Node-8
            •	Two Node-8
                    •	Three Node-8
                    o	Four Node -8
                    •	Five Node-8
            •	Six Node-8
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-8<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-8<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-8<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:2.5in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level5 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Four Node -8<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Five Node-8<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Six Node-8<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>One Node-8</p></li><li style=""><p>Two Node-8</p><ul><li><ul><li><ul level="4"><li><p>Three Node-8</p><ul level="5"><li><p>Four Node -8</p></li></ul></li><li><p>Five Node-8</p></li></ul></li></ul></li></ul></li><li style=""><p>Six Node-8</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 9', (done) => {
            /*
            1.	One Node-9
                1.	Two Node-9
                2.	Three Node-9
            •	Four Node-9
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-9<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-9<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
        auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-9<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Four Node-9<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ol level="1"><li style=""><p>One Node-9</p><ol level="2"><li><p>Two Node-9</p></li><li><p>Three Node-9</p></li></ol></li></ol><ul level="1"><li style=""><p>Four Node-9</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 10', (done) => {
            /*
            •	One Node-10
            •	Two Node-10
            •	Three Node-10
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-10<o:p></o:p></p>
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-10<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-10<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>One Node-10</p></li><li style=""><p>Two Node-10</p></li><li style=""><p>Three Node-10</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 11', (done) => {
            /*
            •	One Node-10
            •	Two Node-10
            •	Three Node-10
            */
            let localElem = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->One Node-10<o:p></o:p></p>
        <h2></h2>
        <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Two Node-10<o:p></o:p></p>
        <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
        Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><!--[endif]-->Three Node-10<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>One Node-10</p></li><li style=""><p>Two Node-10</p></li><li style=""><p>Three Node-10</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 12', (done) => {
            /*
            •	One Node-10
            •	Two Node-10
            •	Three Node-10
            */
            let localElem = `<ul level="1" style="list-style: disc;"><li>One Node-10</li></ul><h2></h2><ul level="1" style="list-style: disc;"><li>Two Node-10</li><li>Three Node-10</li></ul>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li>One Node-10</li></ul><ul level="1"><li>Two Node-10</li><li>Three Node-10</li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('MSWord List Conversion Type 13', (done) => {
        let localElem = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">
        <head>
        <meta http-equiv=Content-Type content="text/html; charset=utf-8">
        <style>
        <!--
        /* Font Definitions */
        @font-face
        {font-family:Batang;
        panose-1:2 3 6 0 0 1 1 1 1 1;
        mso-font-alt:바탕;
        mso-font-charset:129;
        mso-generic-font-family:roman;
        mso-font-pitch:variable;
        mso-font-signature:-1342176593 1775729915 48 0 524447 0;}
        @font-face
        {font-family:"Cambria Math";
        panose-1:2 4 5 3 5 4 6 3 2 4;
        mso-font-charset:0;
        mso-generic-font-family:roman;
        mso-font-pitch:variable;
        mso-font-signature:-536869121 1107305727 33554432 0 415 0;}
        @font-face
        {font-family:Calibri;
        panose-1:2 15 5 2 2 2 4 3 2 4;
        mso-font-charset:0;
        mso-generic-font-family:swiss;
        mso-font-pitch:variable;
        mso-font-signature:-536858881 -1073732485 9 0 511 0;}
        @font-face
        {font-family:AlembaVar;
        mso-font-alt:"Times New Roman";
        mso-font-charset:0;
        mso-generic-font-family:auto;
        mso-font-pitch:variable;
        mso-font-signature:-2147483473 1073750090 0 0 155 0;}
        @font-face
        {font-family:"\@Batang";
        panose-1:2 3 6 0 0 1 1 1 1 1;
        mso-font-charset:129;
        mso-generic-font-family:roman;
        mso-font-pitch:variable;
        mso-font-signature:-1342176593 1775729915 48 0 524447 0;}
        /* Style Definitions */
        p.MsoNormal, li.MsoNormal, div.MsoNormal
        {mso-style-name:"Normal\,Alemba body text";
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-parent:"";
        margin-top:0in;
        margin-right:0in;
        margin-bottom:8.0pt;
        margin-left:0in;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:12.0pt;
        mso-bidi-font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-ansi-language:EN-GB;}
        h1
        {mso-style-name:"Heading 1\,Alemba Heading 1\,Alemba Section Heading";
        mso-style-update:auto;
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-parent:"";
        mso-style-link:"Heading 1 Char\,Alemba Heading 1 Char\,Alemba Section Heading Char";
        mso-style-next:"Normal\,Alemba body text";
        margin-top:.25in;
        margin-right:0in;
        margin-bottom:6.0pt;
        margin-left:35.7pt;
        text-indent:-17.85pt;
        page-break-before:always;
        mso-pagination:widow-orphan;
        page-break-after:avoid;
        mso-outline-level:1;
        mso-list:l0 level1 lfo1;
        font-size:16.0pt;
        font-family:AlembaVar;
        mso-fareast-font-family:Batang;
        mso-bidi-font-family:Arial;
        color:black;
        mso-font-kerning:14.0pt;
        mso-ansi-language:EN-GB;
        font-weight:normal;
        mso-bidi-font-style:italic;}
        p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
        {mso-style-priority:34;
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-link:"List Paragraph Char";
        margin-top:0in;
        margin-right:0in;
        margin-bottom:8.0pt;
        margin-left:.5in;
        mso-add-space:auto;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:12.0pt;
        mso-bidi-font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-ansi-language:EN-GB;}
        p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
        {mso-style-priority:34;
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-link:"List Paragraph Char";
        mso-style-type:export-only;
        margin-top:0in;
        margin-right:0in;
        margin-bottom:0in;
        margin-left:.5in;
        margin-bottom:.0001pt;
        mso-add-space:auto;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:12.0pt;
        mso-bidi-font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-ansi-language:EN-GB;}
        p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
        {mso-style-priority:34;
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-link:"List Paragraph Char";
        mso-style-type:export-only;
        margin-top:0in;
        margin-right:0in;
        margin-bottom:0in;
        margin-left:.5in;
        margin-bottom:.0001pt;
        mso-add-space:auto;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:12.0pt;
        mso-bidi-font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-ansi-language:EN-GB;}
        p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
        {mso-style-priority:34;
        mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-link:"List Paragraph Char";
        mso-style-type:export-only;
        margin-top:0in;
        margin-right:0in;
        margin-bottom:8.0pt;
        margin-left:.5in;
        mso-add-space:auto;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:12.0pt;
        mso-bidi-font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-ansi-language:EN-GB;}
        span.Heading1Char
        {mso-style-name:"Heading 1 Char\,Alemba Heading 1 Char\,Alemba Section Heading Char";
        mso-style-unhide:no;
        mso-style-locked:yes;
        mso-style-link:"Heading 1\,Alemba Heading 1\,Alemba Section Heading";
        mso-ansi-font-size:16.0pt;
        mso-bidi-font-size:16.0pt;
        font-family:AlembaVar;
        mso-ascii-font-family:AlembaVar;
        mso-fareast-font-family:Batang;
        mso-hansi-font-family:AlembaVar;
        mso-bidi-font-family:Arial;
        color:black;
        mso-font-kerning:14.0pt;
        mso-ansi-language:EN-GB;
        mso-fareast-language:EN-US;
        mso-bidi-font-style:italic;}
        span.ListParagraphChar
        {mso-style-name:"List Paragraph Char";
        mso-style-priority:34;
        mso-style-unhide:no;
        mso-style-locked:yes;
        mso-style-link:"List Paragraph";
        mso-ansi-font-size:12.0pt;
        font-family:"Batang",serif;
        mso-fareast-font-family:Batang;
        mso-ansi-language:EN-GB;
        mso-fareast-language:EN-US;}
        .MsoChpDefault
        {mso-style-type:export-only;
        mso-default-props:yes;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:DengXian;
        mso-fareast-theme-font:minor-fareast;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-fareast-language:ZH-CN;}
        .MsoPapDefault
        {mso-style-type:export-only;
        margin-bottom:8.0pt;
        line-height:107%;}
        @page WordSection1
        {size:8.5in 11.0in;
        margin:1.0in 1.0in 1.0in 1.0in;
        mso-header-margin:.5in;
        mso-footer-margin:.5in;
        mso-paper-source:0;}
        div.WordSection1
        {page:WordSection1;}
        /* List Definitions */
        @list l0
        {mso-list-id:1566911212;
        mso-list-template-ids:229287532;}
        @list l0:level1
        {mso-level-style-link:"Heading 1";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        text-indent:-.25in;}
        @list l0:level2
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:.75in;
        text-indent:-.5in;
        text-decoration:none;
        text-line-through:none;}
        @list l0:level3
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:.75in;
        text-indent:-.5in;}
        @list l0:level4
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.0in;
        text-indent:-.75in;}
        @list l0:level5
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4\.%5";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.0in;
        text-indent:-.75in;}
        @list l0:level6
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4\.%5\.%6";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.25in;
        text-indent:-1.0in;}
        @list l0:level7
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4\.%5\.%6\.%7";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.25in;
        text-indent:-1.0in;}
        @list l0:level8
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4\.%5\.%6\.%7\.%8";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.5in;
        text-indent:-1.25in;}
        @list l0:level9
        {mso-level-legal-format:yes;
        mso-level-text:"%1\.%2\.%3\.%4\.%5\.%6\.%7\.%8\.%9";
        mso-level-tab-stop:none;
        mso-level-number-position:left;
        margin-left:1.5in;
        text-indent:-1.25in;}
        ol
        {margin-bottom:0in;}
        ul
        {margin-bottom:0in;}
        -->
        </style>
        <!--[if gte mso 10]>
        <style>
        /* Style Definitions */
        table.MsoNormalTable
        {mso-style-name:"Table Normal";
        mso-tstyle-rowband-size:0;
        mso-tstyle-colband-size:0;
        mso-style-noshow:yes;
        mso-style-priority:99;
        mso-style-parent:"";
        mso-padding-alt:0in 5.4pt 0in 5.4pt;
        mso-para-margin-top:0in;
        mso-para-margin-right:0in;
        mso-para-margin-bottom:8.0pt;
        mso-para-margin-left:0in;
        line-height:107%;
        mso-pagination:widow-orphan;
        font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-ascii-font-family:Calibri;
        mso-ascii-theme-font:minor-latin;
        mso-hansi-font-family:Calibri;
        mso-hansi-theme-font:minor-latin;
        mso-bidi-font-family:"Times New Roman";
        mso-bidi-theme-font:minor-bidi;
        mso-fareast-language:ZH-CN;}
        </style>
        <![endif]-->
        </head>
        <body lang=EN-US style='tab-interval:.5in'>
        <!--StartFragment-->
        <h1 style='mso-list:l0 level1 lfo1'><a name="_Toc513533907"><![if !supportLists]><span
        lang=EN-GB style='mso-fareast-font-family:AlembaVar;mso-bidi-font-family:AlembaVar'><span
        style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;
        </span></span></span><![endif]><span lang=EN-GB>Explorer</span></a><span
        lang=EN-GB><o:p></o:p></span></h1>
        <p class=MsoNormal><span lang=EN-GB>The following controls – Explorer, Tree,
        Federated CMDB Tree and List – are closely related, and their design should be
        planned jointly.<o:p></o:p></span></p>
        <p class=MsoListParagraph style='margin-top:12.0pt;margin-right:0in;margin-bottom:
        6.0pt;margin-left:.75in;text-indent:-.5in;mso-list:l0 level2 lfo1'><![if !supportLists]><span
        lang=EN-GB style='mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
        mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span
        style='mso-list:Ignore'>1.1<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span></span></span><![endif]><span lang=EN-GB>Overview<o:p></o:p></span></p>
        <span lang=EN-GB style='font-size:12.0pt;mso-bidi-font-size:11.0pt;line-height:
        107%;font-family:"Calibri",sans-serif;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:Batang;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:
        "Times New Roman";mso-bidi-theme-font:minor-bidi;mso-ansi-language:EN-GB;
        mso-fareast-language:EN-US;mso-bidi-language:AR-SA'>The purpose of the explorer</span><!--EndFragment--></body></html>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = '<h1><a name="_Toc513533907"><span lang="EN-GB"><span>1.<span>&nbsp;&nbsp;\n        </span></span></span><span lang="EN-GB">Explorer</span></a></h1>\n        <p><span lang="EN-GB">The following controls – Explorer, Tree,\n        Federated CMDB Tree and List – are closely related, and their design should be\n        planned jointly.</span></p>\n        <ol><li><ol level="2"><li><p><span lang="EN-GB">Overview</span></p></li></ol></li></ol>\n        <span lang="EN-GB">The purpose of the explorer</span>';
            const pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });
        it('MSWord List Conversion Type 14 - Rare type', (done) => {
            let localElem = `<html><head><style id="dynCom" type="text/css"><!-- --></style><style>
            <!--
            /* Font Definitions */
            @font-face
            {font-family:"Cambria Math";
            panose-1:2 4 5 3 5 4 6 3 2 4;
            mso-font-charset:0;
            mso-generic-font-family:roman;
            mso-font-pitch:variable;
            mso-font-signature:3 0 0 0 1 0;}
            @font-face
            {font-family:Calibri;
            panose-1:2 15 5 2 2 2 4 3 2 4;
            mso-font-charset:0;
            mso-generic-font-family:swiss;
            mso-font-pitch:variable;
            mso-font-signature:-469750017 -1073732485 9 0 511 0;}
            @font-face
            {font-family:Cambria;
            panose-1:2 4 5 3 5 4 6 3 2 4;
            mso-font-charset:0;
            mso-generic-font-family:roman;
            mso-font-pitch:variable;
            mso-font-signature:-536869121 1107305727 33554432 0 415 0;}
            /* Style Definitions */
            p.MsoNormal, li.MsoNormal, div.MsoNormal
            {mso-style-unhide:no;
            mso-style-qformat:yes;
            mso-style-parent:"";
            margin-top:0in;
            margin-right:0in;
            margin-bottom:10.0pt;
            margin-left:0in;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoHeader, li.MsoHeader, div.MsoHeader
            {mso-style-priority:99;
            mso-style-link:"Header Char";
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            tab-stops:center 212.6pt right 425.2pt;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoFooter, li.MsoFooter, div.MsoFooter
            {mso-style-priority:99;
            mso-style-link:"Footer Char";
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            tab-stops:center 212.6pt right 425.2pt;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
            {mso-style-priority:34;
            mso-style-unhide:no;
            mso-style-qformat:yes;
            margin-top:0in;
            margin-right:0in;
            margin-bottom:10.0pt;
            margin-left:.5in;
            mso-add-space:auto;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
            {mso-style-priority:34;
            mso-style-unhide:no;
            mso-style-qformat:yes;
            mso-style-type:export-only;
            margin-top:0in;
            margin-right:0in;
            margin-bottom:0in;
            margin-left:.5in;
            margin-bottom:.0001pt;
            mso-add-space:auto;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
            {mso-style-priority:34;
            mso-style-unhide:no;
            mso-style-qformat:yes;
            mso-style-type:export-only;
            margin-top:0in;
            margin-right:0in;
            margin-bottom:0in;
            margin-left:.5in;
            margin-bottom:.0001pt;
            mso-add-space:auto;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
            {mso-style-priority:34;
            mso-style-unhide:no;
            mso-style-qformat:yes;
            mso-style-type:export-only;
            margin-top:0in;
            margin-right:0in;
            margin-bottom:10.0pt;
            margin-left:.5in;
            mso-add-space:auto;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            span.HeaderChar
            {mso-style-name:"Header Char";
            mso-style-priority:99;
            mso-style-unhide:no;
            mso-style-locked:yes;
            mso-style-link:Header;}
            span.FooterChar
            {mso-style-name:"Footer Char";
            mso-style-priority:99;
            mso-style-unhide:no;
            mso-style-locked:yes;
            mso-style-link:Footer;}
            .MsoChpDefault
            {mso-style-type:export-only;
            mso-default-props:yes;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            .MsoPapDefault
            {mso-style-type:export-only;
            margin-bottom:10.0pt;
            line-height:115%;}
            @page WordSection1
            {size:595.3pt 841.9pt;
            margin:70.85pt 85.05pt 70.85pt 85.05pt;
            mso-header-margin:35.4pt;
            mso-footer-margin:35.4pt;
            mso-paper-source:0;}
            div.WordSection1
            {page:WordSection1;}
            /* List Definitions */
            @list l0
            {mso-list-id:415592100;
            mso-list-type:hybrid;
            mso-list-template-ids:-368527292 -1571935822 68550681 68550683 68550671 68550681 68550683 68550671 68550681 68550683;}
            @list l0:level1
            {mso-level-text:%1-;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level2
            {mso-level-number-format:alpha-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level3
            {mso-level-number-format:roman-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:right;
            text-indent:-9.0pt;}
            @list l0:level4
            {mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level5
            {mso-level-number-format:alpha-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level6
            {mso-level-number-format:roman-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:right;
            text-indent:-9.0pt;}
            @list l0:level7
            {mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level8
            {mso-level-number-format:alpha-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;}
            @list l0:level9
            {mso-level-number-format:roman-lower;
            mso-level-tab-stop:none;
            mso-level-number-position:right;
            text-indent:-9.0pt;}
            ol
            {margin-bottom:0in;}
            ul
            {margin-bottom:0in;}
            -->
            </style>
            <!--[if gte mso 10]>
            <style>
            /* Style Definitions */
            table.MsoNormalTable
            {mso-style-name:"Table Normal";
            mso-tstyle-rowband-size:0;
            mso-tstyle-colband-size:0;
            mso-style-noshow:yes;
            mso-style-priority:99;
            mso-style-parent:"";
            mso-padding-alt:0in 5.4pt 0in 5.4pt;
            mso-para-margin-top:0in;
            mso-para-margin-right:0in;
            mso-para-margin-bottom:10.0pt;
            mso-para-margin-left:0in;
            line-height:115%;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            mso-ansi-language:PT-BR;}
            </style><![endif]--></head><body lang=EN-US style='tab-interval:.5in'><!--StartFragment--><p class=MsoNormal><span lang=PT-BR style='font-size:12.0pt;line-height:115%;
            font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;mso-hansi-theme-font:
            major-latin'><o:p>&nbsp;</o:p></span></p><p class=MsoListParagraphCxSpFirst style='margin-bottom:7.5pt;mso-add-space:
            auto;text-indent:-.25in;line-height:normal;mso-list:l0 level1 lfo1'><![if !supportLists]><span
            lang=PT-BR style='font-size:12.0pt;font-family:"Cambria",serif;mso-ascii-theme-font:
            major-latin;mso-fareast-font-family:Cambria;mso-fareast-theme-font:major-latin;
            mso-hansi-theme-font:major-latin;mso-bidi-font-family:Cambria;mso-bidi-theme-font:
            major-latin;color:black;mso-fareast-language:PT-BR'><span style='mso-list:Ignore'>1-<span
            style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span
            lang=PT-BR style='font-size:12.0pt;font-family:"Cambria",serif;mso-ascii-theme-font:
            major-latin;mso-fareast-font-family:"Times New Roman";mso-hansi-theme-font:
            major-latin;mso-bidi-font-family:"Times New Roman";color:black;mso-fareast-language:
            PT-BR'>RELORA ------------ 100MG<o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle style='margin-bottom:7.5pt;mso-add-space:
            auto;line-height:normal'><span lang=PT-BR style='font-size:12.0pt;font-family:
            "Cambria",serif;mso-ascii-theme-font:major-latin;mso-fareast-font-family:"Times New Roman";
            mso-hansi-theme-font:major-latin;mso-bidi-font-family:"Times New Roman";
            color:black;mso-fareast-language:PT-BR'>5HTP ----------------- 100MG<o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle style='margin-bottom:7.5pt;mso-add-space:
            auto;line-height:normal'><span lang=PT-BR style='font-size:12.0pt;font-family:
            "Cambria",serif;mso-ascii-theme-font:major-latin;mso-fareast-font-family:"Times New Roman";
            mso-hansi-theme-font:major-latin;mso-bidi-font-family:"Times New Roman";
            color:black;mso-fareast-language:PT-BR'>METILFOLATO ----- 500MCG<o:p></o:p></span></p><p class=MsoListParagraphCxSpLast style='margin-bottom:7.5pt;mso-add-space:
            auto;line-height:normal'><span lang=PT-BR style='font-size:12.0pt;font-family:
            "Cambria",serif;mso-ascii-theme-font:major-latin;mso-fareast-font-family:"Times New Roman";
            mso-hansi-theme-font:major-latin;mso-bidi-font-family:"Times New Roman";
            color:black;mso-fareast-language:PT-BR'>. 2 DOSES AO DIA. <o:p></o:p></span></p><p class=MsoNormal><span lang=PT-BR style='font-size:12.0pt;line-height:115%;
            font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;mso-hansi-theme-font:
            major-latin'><o:p>&nbsp;</o:p></span></p><p class=MsoListParagraphCxSpFirst style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
            lang=PT-BR style='font-size:12.0pt;line-height:115%;font-family:"Cambria",serif;
            mso-ascii-theme-font:major-latin;mso-fareast-font-family:Cambria;mso-fareast-theme-font:
            major-latin;mso-hansi-theme-font:major-latin;mso-bidi-font-family:Cambria;
            mso-bidi-theme-font:major-latin'><span style='mso-list:Ignore'>2-<span
            style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span
            lang=PT-BR style='font-size:12.0pt;line-height:115%;font-family:"Cambria",serif;
            mso-ascii-theme-font:major-latin;mso-hansi-theme-font:major-latin'>Melissa (2%
            ácidos romarínicos) ------------<span style='mso-spacerun:yes'></span>100mg <o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle><span lang=PT-BR style='font-size:12.0pt;
            line-height:115%;font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;
            mso-hansi-theme-font:major-latin'>Passiflora (0,5% vitexina)
            ------------------------ 200mg <o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle><span lang=PT-BR style='font-size:12.0pt;
            line-height:115%;font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;
            mso-hansi-theme-font:major-latin'>Valeriana (0,5% Ácido valerênico)
            ----------------- 100mg <o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle><span lang=PT-BR style='font-size:12.0pt;
            line-height:115%;font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;
            mso-hansi-theme-font:major-latin'>Mulungu (0,07% flavonoides)
            -------------------- 200mg <o:p></o:p></span></p><p class=MsoListParagraphCxSpMiddle><span lang=PT-BR style='font-size:12.0pt;
            line-height:115%;font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;
            mso-hansi-theme-font:major-latin'>Melatonina --------------------------------------------
            1mg<o:p></o:p></span></p><p class=MsoListParagraphCxSpLast><span lang=PT-BR style='font-size:12.0pt;
            line-height:115%;font-family:"Cambria",serif;mso-ascii-theme-font:major-latin;
            mso-hansi-theme-font:major-latin'>Tomar 1 dose 1<span
            style='mso-spacerun:yes'>  </span>hora antes de deitar.<o:p></o:p></span></p><!--EndFragment--></body></html>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = '<p><span lang="PT-BR">&nbsp;</span></p><ol level="1"><li><p><span lang="PT-BR">RELORA ------------ 100MG</span></p></li></ol><p><span lang="PT-BR">5HTP ----------------- 100MG</span></p><p><span lang="PT-BR">METILFOLATO ----- 500MCG</span></p><p><span lang="PT-BR">. 2 DOSES AO DIA. </span></p><p><span lang="PT-BR">&nbsp;</span></p><ol level="1" start="2"><li style=""><p><span lang="PT-BR">Melissa (2%\n            ácidos romarínicos) ------------100mg </span></p></li></ol><p><span lang="PT-BR">Passiflora (0,5% vitexina)\n            ------------------------ 200mg </span></p><p><span lang="PT-BR">Valeriana (0,5% Ácido valerênico)\n            ----------------- 100mg </span></p><p><span lang="PT-BR">Mulungu (0,07% flavonoides)\n            -------------------- 200mg </span></p><p><span lang="PT-BR">Melatonina --------------------------------------------\n            1mg</span></p><p><span lang="PT-BR">Tomar 1 dose 1<span>&nbsp; </span>hora antes de deitar.</span></p>';
            var pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });
        it('Order list with all supported list style types', (done) => {
        let localElem = `<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<\!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n<\!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]--><\!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n<\!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:2066636537;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1839751626 67698709 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l0:level1\r\n\t{mso-level-number-format:alpha-upper;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n<\!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>\r\n<\!--StartFragment-->\r\n\r\n<p class=MsoListParagraphCxSpFirst style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span\r\nstyle='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span\r\nstyle='mso-list:Ignore'>A.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 1<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:1.0in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1'><![if !supportLists]><span\r\nstyle='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span\r\nstyle='mso-list:Ignore'>a.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 2<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:1.5in;mso-add-space:\r\nauto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l0 level3 lfo1'><![if !supportLists]><span\r\nstyle='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span\r\nstyle='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>i.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 3<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:2.0in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level4 lfo1'><![if !supportLists]><span\r\nstyle='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span\r\nstyle='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 4<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpLast style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span\r\nstyle='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span\r\nstyle='mso-list:Ignore'>B.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 5<o:p></o:p></p>\r\n\r\n<\!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ol level="1"><li style=""><p>List content 1</p><ol level="2"><li><p>List content 2</p><ol level="3"><li><p>List content 3</p><ol level="4"><li><p>List content 4</p></li></ol></li></ol></li></ol></li><li style=""><p>List content 5</p></li></ol>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('Unordered list with all supported list style types', (done) => {
        let localElem = `<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<\!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n<\!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]--><\!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n<\!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:Wingdings;\r\n\tpanose-1:5 0 0 0 0 0 0 0 0 0;\r\n\tmso-font-charset:2;\r\n\tmso-generic-font-family:auto;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:0 268435456 0 0 -2147483648 0;}\r\n@font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:263536607;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1048195150 67698689 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\r\n@list l0:level1\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l0:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l0:level4\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l0:level5\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level6\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l0:level7\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l0:level8\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level9\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n<\!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>\r\n<\!--StartFragment-->\r\n\r\n<p class=MsoListParagraphCxSpFirst style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span\r\nstyle='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:\r\nSymbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 1<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:1.0in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1'><![if !supportLists]><span\r\nstyle='font-family:"Courier New";mso-fareast-font-family:"Courier New"'><span\r\nstyle='mso-list:Ignore'>o<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 2<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:1.5in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level3 lfo1'><![if !supportLists]><span\r\nstyle='font-family:Wingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:\r\nWingdings'><span style='mso-list:Ignore'>§<span style='font:7.0pt "Times New Roman"'>&nbsp;\r\n</span></span></span><![endif]>List content 3<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style='margin-left:2.0in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level4 lfo1'><![if !supportLists]><span\r\nstyle='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:\r\nSymbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 4<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpLast style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span\r\nstyle='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:\r\nSymbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List content 5<o:p></o:p></p>\r\n\r\n<\!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n`

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            let expectedElem = `<ul level="1"><li style=""><p>List content 1</p><ul level="2"><li><p>List content 2</p><ul level="3"><li><p>List content 3</p><ul level="4"><li><p>List content 4</p></li></ul></li></ul></li></ul></li><li style=""><p>List content 5</p></li></ul>`;
            expect(result.trim()).toContain(expectedElem);
            done();
        });
        it('Outlook list testing', (done) => {
            let localElem = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">
        <style>
        <!--
        /* Font Definitions */
        @font-face
            {font-family:Wingdings;
            panose-1:5 0 0 0 0 0 0 0 0 0;
            mso-font-charset:2;
            mso-generic-font-family:auto;
            mso-font-pitch:variable;
            mso-font-signature:0 268435456 0 0 -2147483648 0;}
        @font-face
            {font-family:"Cambria Math";
            panose-1:2 4 5 3 5 4 6 3 2 4;
            mso-font-charset:0;
            mso-generic-font-family:roman;
            mso-font-pitch:variable;
            mso-font-signature:3 0 0 0 1 0;}
        @font-face
            {font-family:Calibri;
            panose-1:2 15 5 2 2 2 4 3 2 4;
            mso-font-charset:0;
            mso-generic-font-family:swiss;
            mso-font-pitch:variable;
            mso-font-signature:-536858881 -1073732485 9 0 511 0;}
        /* Style Definitions */
        p.MsoNormal, li.MsoNormal, div.MsoNormal
            {mso-style-unhide:no;
            mso-style-qformat:yes;
            mso-style-parent:"";
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;}
        p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
            {mso-style-priority:34;
            mso-style-unhide:no;
            mso-style-qformat:yes;
            margin-top:0in;
            margin-right:0in;
            margin-bottom:0in;
            margin-left:.5in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;}
        span.EmailStyle15
            {mso-style-type:personal;
            mso-style-noshow:yes;
            mso-style-unhide:no;
            mso-ansi-font-size:11.0pt;
            mso-bidi-font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;
            color:windowtext;}
        .MsoChpDefault
            {mso-style-type:export-only;
            mso-default-props:yes;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-fareast-font-family:Calibri;
            mso-fareast-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;}
        @page WordSection1
            {size:8.5in 11.0in;
            margin:1.0in 1.0in 1.0in 1.0in;
            mso-header-margin:.5in;
            mso-footer-margin:.5in;
            mso-paper-source:0;}
        div.WordSection1
            {page:WordSection1;}
        /* List Definitions */
        @list l0
            {mso-list-id:1146896413;
            mso-list-type:hybrid;
            mso-list-template-ids:-1355781350 67698689 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}
        @list l0:level1
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Symbol;}
        @list l0:level2
            {mso-level-number-format:bullet;
            mso-level-text:o;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:"Courier New";}
        @list l0:level3
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Wingdings;}
        @list l0:level4
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Symbol;}
        @list l0:level5
            {mso-level-number-format:bullet;
            mso-level-text:o;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:"Courier New";}
        @list l0:level6
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Wingdings;}
        @list l0:level7
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Symbol;}
        @list l0:level8
            {mso-level-number-format:bullet;
            mso-level-text:o;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:"Courier New";}
        @list l0:level9
            {mso-level-number-format:bullet;
            mso-level-text:;
            mso-level-tab-stop:none;
            mso-level-number-position:left;
            text-indent:-.25in;
            font-family:Wingdings;}
        ol
            {margin-bottom:0in;}
        ul
            {margin-bottom:0in;}
        -->
        </style>
        <!--[if gte mso 10]>
        <style>
        /* Style Definitions */
        table.MsoNormalTable
            {mso-style-name:"Table Normal";
            mso-tstyle-rowband-size:0;
            mso-tstyle-colband-size:0;
            mso-style-noshow:yes;
            mso-style-priority:99;
            mso-style-parent:"";
            mso-padding-alt:0in 5.4pt 0in 5.4pt;
            mso-para-margin:0in;
            mso-para-margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:11.0pt;
            font-family:"Calibri",sans-serif;
            mso-ascii-font-family:Calibri;
            mso-ascii-theme-font:minor-latin;
            mso-hansi-font-family:Calibri;
            mso-hansi-theme-font:minor-latin;
            mso-bidi-font-family:"Times New Roman";
            mso-bidi-theme-font:minor-bidi;}
        </style>
        <![endif]-->
        </head>
        <body lang=EN-US style='tab-interval:.5in'>
        <!--StartFragment-->
        <p class=MsoNormal>List Sample Content<o:p></o:p></p>
        <p class=MsoNormal><o:p>&nbsp;</o:p></p>
        <ul style='margin-top:0in' type=disc><li class=MsoListParagraph style='margin-left:0in;mso-list:l0 level1 lfo1'>List1<o:p></o:p></li><li class=MsoListParagraph style='margin-left:0in;mso-list:l0 level1 lfo1'>List2<o:p></o:p></li><li class=MsoListParagraph style='margin-left:0in;mso-list:l0 level1 lfo1'>List3<o:p></o:p></li></ul>
        <!--EndFragment--></body></html>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            const expectedElem = '<p>List Sample Content</p>\n        <p>&nbsp;</p>\n        <ul type="disc"><li>List1</li><li>List2</li><li>List3</li></ul>';
            var pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Decimal List with Custom Start', (done) => {
            /*
            5. Item starting at 5
            6. Item 6
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">5.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting at 5<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">6.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item 6<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="5"><li style=""><p>Item starting at 5</p></li><li style=""><p>Item 6</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Decimal-Leading-Zero List', (done) => {
            /*
            01. Item with leading zero
            02. Second item with leading zero
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">01.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item with leading zero<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">02.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Second item with leading zero<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1"><li style=""><p>Item with leading zero</p></li><li style=""><p>Second item with leading zero</p></li></ol>';
            done();
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
        });

        it('MSWord Upper-Alpha List with Custom Start', (done) => {
            /*
            C. Item starting with C
            D. Item D
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">C.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting with C<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">D.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item D<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="3"><li style=""><p>Item starting with C</p></li><li style=""><p>Item D</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Lower-Alpha List with Custom Start', (done) => {
            /*
            f. Item starting with f
            g. Item g
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">f.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting with f<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">g.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item g<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="6"><li style=""><p>Item starting with f</p></li><li style=""><p>Item g</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Upper-Roman List with Custom Start', (done) => {
            /*
            III. Item starting with III
            IV. Item IV
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">III.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting with III<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">IV.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item IV<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="3"><li style=""><p><span>III.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item starting with III</p></li><li style=""><p><span>IV.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item IV</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Lower-Roman List with Custom Start', (done) => {
            /*
            iii. Item starting with iii
            iv. Item iv
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">iii.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting with iii<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">iv.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item iv<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="3"><li style=""><p><span>iii.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item starting with iii</p></li><li style=""><p><span>iv.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item iv</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });

        it('MSWord Lower-Greek List with Custom Start', (done) => {
            /*
            β. Item starting with beta
            γ. Item gamma
            */
            let localElem = `
            <p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">β.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item starting with beta<o:p></o:p></p>
            <p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-list:Ignore">γ.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]-->Item gamma<o:p></o:p></p>`;

            const result = cleanupModule.cleanupPaste({
                html: localElem
            });
            
            let expectedElem = '<ol level="1" start="2"><li style=""><p><span>β.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item starting with beta</p></li><li style=""><p><span>γ.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>Item gamma</p></li></ol>';
            let pastedElem = document.createElement('div');
            pastedElem.innerHTML = result;
            expect(pastedElem.innerHTML.trim()).toContain(expectedElem.trim());
            done();
        });
    });
});
