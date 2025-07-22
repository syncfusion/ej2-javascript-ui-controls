import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockModel, BlockType, ContentType } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { NodeSelection } from '../../src/blockeditor/plugins/index';

describe('Selection Plugin', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let selectionManager: NodeSelection;
    let blockElement: HTMLElement;
    let contentElement: HTMLElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);

        // Create editor with paragraph that has multiple formatted content blocks
        editor = createEditor({
            blocks: [
                {
                    id: 'testBlock',
                    type: BlockType.Paragraph,
                    content: [
                        {
                            id: 'plainText',
                            type: ContentType.Text,
                            content: 'Plain text'
                        },
                        {
                            id: 'boldText',
                            type: ContentType.Text,
                            content: 'Bold text',
                            styles: { bold: true }
                        },
                        {
                            id: 'italicText',
                            type: ContentType.Text,
                            content: 'Italic text',
                            styles: { italic: true }
                        },
                        {
                            id: 'styledText',
                            type: ContentType.Text,
                            content: 'Mixed styles',
                            styles: { bold: true, underline: true }
                        }
                    ]
                }
            ]
        });

        editor.appendTo('#editor');

        // Access selection manager
        selectionManager = editor.nodeSelection;

        // Get block element for testing
        blockElement = editorElement.querySelector('#testBlock') as HTMLElement;
        contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
    });

    afterEach(() => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(editorElement);
        selectionManager = null;
        blockElement = null;
        contentElement = null;
    });

    describe('Save and Restore Selection', () => {
        it('should save and restore cursor position', () => {
            // Find the plain text node
            const element = contentElement.firstChild.firstChild;

            // Create a range at position 3 in plain text
            const range = document.createRange();
            range.setStart(element, 3);
            range.setEnd(element, 3);

            // Apply the selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Save the selection
            selectionManager.saveSelection(contentElement);

            // Modify the content
            contentElement.textContent = contentElement.textContent;

            // Restore the selection
            selectionManager.restoreSelection(contentElement);

            const newSelection = window.getSelection();
            const newRange = newSelection.getRangeAt(0);

            expect(newRange.startContainer.nodeType).toBe(Node.TEXT_NODE);
            expect(newRange.startOffset).toBe(3);
            expect(newRange.collapsed).toBe(true);

        });

        it('should save and restore text selection across formatted content', () => {
            // Access the nodes for selection
            const boldTextNode = contentElement.querySelector('strong').firstChild;
            const italicTextNode = contentElement.querySelector('em').firstChild;

            // Create a range from bold text to italic text
            const range = document.createRange();
            range.setStart(boldTextNode, 2); // Start after "Bo"
            range.setEnd(italicTextNode, 3);  // End after "Ita"

            // Apply the selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Save the selection
            selectionManager.saveSelection(contentElement);

            // Clear selection
            selection.removeAllRanges();

            // Restore the selection
            selectionManager.restoreSelection(contentElement);
            const newSelection = window.getSelection();
            const selectedText = newSelection.toString();

            // The selection should include part of bold text and part of italic text
            expect(selectedText).toContain('ld text');
            expect(selectedText).toContain('Ita');
            expect(newSelection.isCollapsed).toBe(false);
        });
    });

    describe('Selection Information', () => {
        it('should correctly identify if selection is collapsed', () => {
            // Set cursor at start of content
            const range = document.createRange();
            range.setStart(contentElement.firstChild.firstChild, 0);
            range.setEnd(contentElement.firstChild.firstChild, 0);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            expect(selectionManager.isCollapsed()).toBe(true);

            // Create a non-collapsed selection
            range.setEnd(contentElement.firstChild.firstChild, 5);
            selection.removeAllRanges();
            selection.addRange(range);

            expect(selectionManager.isCollapsed()).toBe(false);
        });

        it('should get selected text correctly', () => {
            // Select "Plain" in the first content block
            const plainTextNode = contentElement.firstChild.firstChild;
            const range = document.createRange();
            range.setStart(plainTextNode, 0);
            range.setEnd(plainTextNode, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            expect(selectionManager.getSelectedText()).toBe('Plain');

            // Select across formats
            const boldTextNode = contentElement.querySelector('strong').firstChild;
            range.setStart(plainTextNode, 0);
            range.setEnd(boldTextNode, 4);

            selection.removeAllRanges();
            selection.addRange(range);

            expect(selectionManager.getSelectedText()).toContain('Plain text');
            expect(selectionManager.getSelectedText()).toContain('Bold');
        });

        it('should get selection position', () => {
            // Create a selection
            const plainTextNode = contentElement.firstChild.firstChild;
            const range = document.createRange();
            range.setStart(plainTextNode, 0);
            range.setEnd(plainTextNode, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const position = selectionManager.getSelectionPosition();

            expect(position).toBeDefined();
            expect(typeof position.x).toBe('number');
            expect(typeof position.y).toBe('number');
        });
    });

    describe('Node Type Selection', () => {
        it('should detect if selection contains specific node type', () => {
            // Select inside bold text
            const boldTextNode = contentElement.querySelector('strong').firstChild;
            const range = document.createRange();
            range.setStart(boldTextNode, 0);
            range.setEnd(boldTextNode, 4);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Check if selection contains strong tag
            expect(selectionManager.selectionContainsNodeType('strong', contentElement)).toBe(true);

            // Check if selection contains em tag (it shouldn't)
            expect(selectionManager.selectionContainsNodeType('em', contentElement)).toBe(false);

            // Now select across bold and italic
            const italicTextNode = contentElement.querySelector('em').firstChild;
            range.setEnd(italicTextNode, 4);

            selection.removeAllRanges();
            selection.addRange(range);

            // Now it should detect both
            expect(selectionManager.selectionContainsNodeType('strong', contentElement)).toBe(true);
            expect(selectionManager.selectionContainsNodeType('em', contentElement)).toBe(true);
        });

        it('should get node from selection', () => {
            // Select inside bold text
            const boldTextNode = contentElement.querySelector('strong').firstChild;
            const range = document.createRange();
            range.setStart(boldTextNode, 0);
            range.setEnd(boldTextNode, 4);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Get strong node from selection
            const strongNode = selectionManager.getNodeFromSelection('strong');
            expect(strongNode).not.toBeNull();
            expect(strongNode.tagName.toLowerCase()).toBe('strong');
            expect(strongNode.textContent).toBe('Bold text');

            // Should not find em node
            const emNode = selectionManager.getNodeFromSelection('em');
            expect(emNode).toBeNull();

            // Select across formats to span element
            const italicTextNode = contentElement.querySelector('em').firstChild;
            range.setEnd(italicTextNode, 4);

            selection.removeAllRanges();
            selection.addRange(range);

            // Should still find strong because it contains the start
            const strongNodeAgain = selectionManager.getNodeFromSelection('strong');
            expect(strongNodeAgain).not.toBeNull();
            expect(strongNodeAgain.tagName.toLowerCase()).toBe('strong');
        });
    });

    describe('Range Management', () => {
        it('should store and retrieve current range', () => {
            // Create a selection
            const plainTextNode = contentElement.firstChild.firstChild;
            const range = document.createRange();
            range.setStart(plainTextNode, 2);
            range.setEnd(plainTextNode, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Store the range
            selectionManager.storeCurrentRange();

            // Get stored range
            const storedRange = selectionManager.getStoredRange();

            expect(storedRange).not.toBeNull();
            expect(storedRange.startContainer).toBe(plainTextNode);
            expect(storedRange.startOffset).toBe(2);
            expect(storedRange.endContainer).toBe(plainTextNode);
            expect(storedRange.endOffset).toBe(5);
        });

        it('should store and retrieve backup range', () => {
            // Create a selection
            const plainTextNode = contentElement.firstChild.firstChild;
            const range = document.createRange();
            range.setStart(plainTextNode, 2);
            range.setEnd(plainTextNode, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Store the range
            selectionManager.storeCurrentRange();

            // Get stored backup range
            const backupRange = selectionManager.getStoredBackupRange();

            expect(backupRange).not.toBeNull();
            expect(backupRange.startContainer).toBe(plainTextNode);
            expect(backupRange.startOffset).toBe(2);
            expect(backupRange.endContainer).toBe(plainTextNode);
            expect(backupRange.endOffset).toBe(5);
            expect(backupRange.parentElement).toBe(plainTextNode.parentElement);
        });
    });

    // describe('User Model Updates', () => {
    //     it('should update user model with selection range', () => {
    //         editor.users = [
    //             { id: 'user1', user: 'User 1' },
    //             { id: 'user2', user: 'User 2' }
    //         ];
    //         editor.currentUserId = 'user1';
    //         // Create a selection
    //         const plainTextNode = contentElement.firstChild.firstChild;
    //         const range = document.createRange();
    //         range.setStart(plainTextNode, 2);
    //         range.setEnd(plainTextNode, 5);

    //         const selection = window.getSelection();
    //         selection.removeAllRanges();
    //         selection.addRange(range);

    //         // Update user model
    //         selectionManager.updateSelectionRangeOnUserModel();

    //         // Verify user model was updated
    //         const currentUser = editor.users.find(user => user.id === editor.currentUserId);
    //         expect(currentUser).toBeDefined();
    //         expect(currentUser.selectionRange).toEqual([2, 5]);
    //     });
    // });

    describe('Complex Selections', () => {
        it('should handle selection spanning multiple formatted elements', () => {
            // Select from plain text through bold text to italic text
            const plainTextNode = contentElement.firstChild.firstChild;
            const italicTextNode = contentElement.querySelector('em').firstChild;

            const range = document.createRange();
            range.setStart(plainTextNode, 3); // Start in plain text
            range.setEnd(italicTextNode, 4);  // End in italic text

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Save and restore selection
            selectionManager.saveSelection(contentElement);
            selectionManager.restoreSelection(contentElement);
            const restoredSelection = window.getSelection();
            const selectedText = restoredSelection.toString();

            expect(selectedText).toContain('in text');     // End of plain text
            expect(selectedText).toContain('Bold text');   // All of bold text
            expect(selectedText).toContain('Ital');        // Start of italic text

            // Verify we can get the strong node from this mixed selection
            const strongNode = selectionManager.getNodeFromSelection('strong');
            expect(strongNode).not.toBeNull();
            expect(strongNode.tagName.toLowerCase()).toBe('strong');
        });

        it('should handle document changes during selection restoration', () => {
            // Select some text
            const plainTextNode = contentElement.firstChild.firstChild;
            const range = document.createRange();
            range.setStart(plainTextNode, 2);
            range.setEnd(plainTextNode, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Save selection
            selectionManager.saveSelection(contentElement);

            // Modify content - add text at beginning
            const originalText = contentElement.innerHTML;
            contentElement.innerHTML = 'NEW ' + originalText;

            // Restore selection
            selectionManager.restoreSelection(contentElement);
            const newSelection = window.getSelection();
            // Selection position will be adjusted to account for added text
            // The exact position depends on how the DOM was rebuilt
            expect(newSelection.rangeCount).toBe(1);
            expect(newSelection.isCollapsed).toBe(false);

            // Get the selected text
            const selectedText = newSelection.toString();
            expect(selectedText.length).toBeGreaterThan(0);
        });
    });

    describe('Other actions testing', () => {
        it('should handle edge cases properly', () => {
            // Spy on getRange method and return null
            spyOn(selectionManager, 'getRange').and.returnValue(null);
            selectionManager.saveSelection(contentElement);
            // expect(selectionManager.getStoredRange()).toBeNull();

            expect((editor as any).checkIsEntireEditorSelected()).toBe(false);

            contentElement.textContent = null;
            selectionManager.restoreSelection(contentElement);

            const range = (selectionManager as any).createRangeFromTextPositions(contentElement, 100, 100);
            expect(range.startContainer).toBe(contentElement);
            expect(range.startOffset).toBe(0);
            expect(range.endContainer).toBe(contentElement);
            expect(range.endOffset).toBe(0);
        });

        it('getNodeFromSelection should return nodes properly', () => {
            selectionManager.createRangeWithOffsets(contentElement, contentElement, 0, 0);
            expect(selectionManager.getNodeFromSelection('P')).toBe(contentElement);

            // Test with a node that is present on start container
            const element = document.createElement('div');
            element.innerHTML = '<p> <b>Bold text </b> </p>';
            document.body.appendChild(element);
            const boldElement = element.querySelector('b');
            selectionManager.createRangeWithOffsets(boldElement, element, 0, 0);
            expect(selectionManager.getNodeFromSelection('p')).toBe(element.querySelector('p'));

            // Test with a node that is present on end container
            element.innerHTML = '<span> <b>Bold text </b> <p> <i> Italic text </i> </p> </span>';
            const boldElement1 = element.querySelector('b');
            const italicElement = element.querySelector('i');
            selectionManager.createRangeWithOffsets(boldElement1, italicElement, 0, 0);
            expect(selectionManager.getNodeFromSelection('p')).toBe(element.querySelector('p'));
            document.body.removeChild(element);
        });

        it('should handle values when there is no selection', () => {
            // Make window.selection null
            const originalGetSelection = window.getSelection;
            window.getSelection = () => null;

            expect(selectionManager.getRange()).toBeNull();

            expect(selectionManager.getSelectedText()).toBe('');

            expect(selectionManager.selectionContainsNodeType('P', contentElement)).toBe(false);

            expect(selectionManager.getNodeFromSelection ('P')).toBeNull();

            expect((editor as any).checkIsEntireEditorSelected()).toBe(false);

            const position = selectionManager.getSelectionPosition();
            expect(position.x).toBe(0);
            expect(position.y).toBe(0);

            window.getSelection = originalGetSelection;
        });

        it('checkEntireEditorSelected should handle child blocks properly', (done) => {
            editor.setFocusToBlock(blockElement);
            const block: BlockModel = {
                id: 'callout-block',
                type: 'Callout',
                children: [
                    {
                        id: 'first-child',
                        type: 'Paragraph',
                        content: [ { type: ContentType.Text, content: '' } ]
                    },
                    {
                        id: 'second-child',
                        type: 'Paragraph',
                        content: [ { type: ContentType.Text, content: 'Second child' } ]
                    }
                ],
            }
            editor.addBlock(block);
            editor.removeBlock(blockElement.id);
            const newBlockElement = editorElement.querySelector('#callout-block') as HTMLElement;
            editor.setFocusToBlock(newBlockElement);

            const firstChildContent = editorElement.querySelector('#first-child').querySelector('.e-block-content');
            const secondChildContent = editorElement.querySelector('#second-child').querySelector('.e-block-content');

            selectionManager.createRangeWithOffsets(
                firstChildContent,
                secondChildContent.firstChild,
                0, 12
            );

            setTimeout(() => {
                expect((editor as any).checkIsEntireEditorSelected()).toBe(true);
                done();
            }, 200);
        });

    });
});
