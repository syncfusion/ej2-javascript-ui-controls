import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, getBlockModelById, getSelectionRange, MentionRenderer, PopupRenderer, ToolbarRenderer, TooltipRenderer } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Renderer-Common Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Renderer', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let popupRenderer: PopupRenderer;
        let toolbarRenderer: ToolbarRenderer;
        let tooltipRenderer: TooltipRenderer;
        let mentionRenderer: MentionRenderer;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({});
            editor.appendTo('#editor');
            popupRenderer = new PopupRenderer(editor);
            toolbarRenderer = new ToolbarRenderer(editor);
            tooltipRenderer = new TooltipRenderer(editor);
            mentionRenderer = new MentionRenderer(editor);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
        });

        it('should render popup with element selector string', () => {
            const popupContainer = createElement('div', { id: 'test-popup' });
            document.body.appendChild(popupContainer);

            const content = createElement('div', { 
                innerHTML: 'Popup content',
                className: 'popup-content'
            });

            const popup = popupRenderer.renderPopup({
                element: '#test-popup',
                content: content
            });

            expect(popup).not.toBeNull();
            expect(popup.element.id).toBe('test-popup');
            expect(popup.content).toBe(content);
            
            popupRenderer.destroyPopup(popup);
        });

        it('should adjust popup position relative to target', () => {
            // Create a target element
            const targetElement = createElement('div', {
                id: 'popup-target',
                styles: 'width: 100px; height: 30px; position: absolute; top: 50px; left: 50px;'
            });
            document.body.appendChild(targetElement);

            // Create a popup
            const popupElement = createElement('div', { id: 'popup-to-adjust' });
            document.body.appendChild(popupElement);

            const content = createElement('div', { 
                innerHTML: 'Adjustable Content',
                className: 'popup-content'
            });

            const popup = popupRenderer.renderPopup({
                element: '#popup-to-adjust',
                content: content
            });

            // Mock getBoundingClientRect for target
            const originalTargetGetRect = targetElement.getBoundingClientRect;
            targetElement.getBoundingClientRect = (): DOMRect => {
                return {
                    top: 50,
                    left: 50,
                    right: 150,
                    bottom: 80,
                    width: 100,
                    height: 30
                } as DOMRect;
            };

            // Mock getBoundingClientRect for popup
            const originalPopupGetRect = popupElement.getBoundingClientRect;
            popupElement.getBoundingClientRect = (): DOMRect => {
                return {
                    top: -10,  // Will be adjusted to 0
                    left: -20, // Will be adjusted to 0
                    right: 980,
                    bottom: 490,
                    width: 300,
                    height: 200
                } as DOMRect;
            };

            // Mock window dimensions
            const originalInnerWidth = window.innerWidth;
            const originalInnerHeight = window.innerHeight;
            Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

            // Before adjustment
            expect(popup.position.X).toBe('left');
            expect(popup.position.Y).toBe('top');

            // Add class for testing inline toolbar specific adjustment
            popupElement.classList.add('e-blockeditor-inline-toolbar-popup');

            // Call the adjust method
            popupRenderer.adjustPopupPositionRelativeToTarget(targetElement, popup);

            // After adjustment
            expect(popup.position.X).not.toBe(0); // Adjusted from negative
            expect(popup.position.Y).toBe(0); // Adjusted from negative to 0

            // Test with different bounds - popup off the right edge
            popupElement.getBoundingClientRect = (): DOMRect => {
                return {
                    top: 50,
                    left: 600,
                    right: 1000, // Off the edge (800px window width)
                    bottom: 250,
                    width: 400,
                    height: 200
                } as DOMRect;
            };

            popupRenderer.adjustPopupPositionRelativeToTarget(targetElement, popup);
            expect(popup.position.X).toBe(400); // 800 - 400 = 400
            
            // Test with different bounds - popup off the bottom edge
            popupElement.getBoundingClientRect = (): DOMRect => {
                return {
                    top: 500,
                    left: 200,
                    right: 400,
                    bottom: 700, // Off the edge (600px window height)
                    width: 200,
                    height: 200
                } as DOMRect;
            };

            popupRenderer.adjustPopupPositionRelativeToTarget(targetElement, popup);
            expect(popup.position.Y).toBe(400); // 600 - 200 = 400

            // Restore original methods and properties
            targetElement.getBoundingClientRect = originalTargetGetRect;
            popupElement.getBoundingClientRect = originalPopupGetRect;
            Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
            Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
            
            // Clean up
            popupRenderer.destroyPopup(popup);
            document.body.removeChild(targetElement);
        });

        it('should render toolbar with element selector string', () => {
            const toolbarContainer = createElement('div', { 
                id: 'test-toolbar',
                className: 'e-toolbar-container' 
            });
            editorElement.appendChild(toolbarContainer);

            const items = [
                { text: 'Item 1', id: 'item1' },
                { text: 'Item 2', id: 'item2' }
            ];

            const toolbar = toolbarRenderer.renderToolbar({
                element: '#test-toolbar',
                items: items,
                width: '300px',
                overflowMode: 'Popup'
            });

            expect(toolbar).not.toBeNull();
            expect(toolbar.element.id).toBe('test-toolbar');
            expect(toolbar.items.length).toBe(2);
            expect(toolbar.width).toBe('300px');
            expect(toolbar.overflowMode).toBe('Popup');
            
            toolbar.destroy();
            editorElement.removeChild(toolbarContainer);
        });

        it('should render tooltip with element selector string', () => {
            const tooltipContainer = createElement('div', { 
                id: 'test-tooltip',
                className: 'e-tooltip-container' 
            });
            editorElement.appendChild(tooltipContainer);
            
            const target = createElement('button', { 
                id: 'tooltip-target',
                innerHTML: 'Hover me'
            });
            tooltipContainer.appendChild(target);
            
            const tooltip = tooltipRenderer.renderTooltip({
                element: '#test-tooltip',
                target: '#tooltip-target',
                content: 'Tooltip content',
                position: 'RightCenter',
                showTipPointer: true,
                windowCollision: true,
                cssClass: 'test-tooltip-class'
            });
            
            expect(tooltip).not.toBeNull();
            expect(tooltip.element.id).toBe('test-tooltip');
            expect(tooltip.content).toBe('Tooltip content');
            expect(tooltip.position).toBe(editor.enableRtl ? 'LeftCenter' : 'RightCenter');
            expect(tooltip.showTipPointer).toBe(true);
            expect(tooltip.cssClass).toBe('test-tooltip-class');
            
            // Test RTL mode switching
            editor.enableRtl = true;
            
            const rtlTooltip = tooltipRenderer.renderTooltip({
                element: '#test-tooltip',
                target: '#tooltip-target',
                content: 'RTL Tooltip content',
                position: 'RightCenter'
            });
            
            expect(rtlTooltip.position).toBe('LeftCenter');
            
            // Clean up
            tooltipRenderer.destroyTooltip(tooltip);
            tooltipRenderer.destroyTooltip(rtlTooltip);
            editorElement.removeChild(tooltipContainer);
        });

        it('should handle mention renderer functions correctly', (done) => {
            setTimeout( ()=> {

                // Test cleanMentionArtifacts with null range
                // Instead of spying on window, spy on the imported function
                const selectionModule = require('../../src/blockeditor/utils/selection');
                spyOn(selectionModule, 'getSelectionRange').and.returnValue(null);
                
                const testElement = document.createElement('div');
                
                // This should not throw error with null range
                mentionRenderer.cleanMentionArtifacts(testElement);
                
                // Test removeMentionQueryKeysFromModel with null rangePath
                spyOn(mentionRenderer.nodeSelection, 'getStoredBackupRange').and.returnValue(null);
                
                // This should not throw error with null rangePath
                mentionRenderer.removeMentionQueryKeysFromModel('@');
                
                // Set up a valid rangePath but null block
                const mockRangePath = {
                    startContainer: document.createTextNode('test'),
                    endContainer: document.createTextNode('test'),
                    startOffset: 0,
                    endOffset: 0,
                    parentElement: document.createElement('span')
                };
                
                (mentionRenderer.nodeSelection.getStoredBackupRange as jasmine.Spy).and.returnValue(mockRangePath);
                editor.currentFocusedBlock = document.createElement('div');
                editor.currentFocusedBlock.id = 'nonexistent-block';
                
                // Mock getBlockModelById correctly
                const blockModule = require('../../src/blockeditor/utils/block');
                spyOn(blockModule, 'getBlockModelById').and.returnValue(null);
                
                // This should not throw error with null block
                mentionRenderer.removeMentionQueryKeysFromModel('@');
                
                // Set up a block with no matching content
                const mockBlock = {
                    id: 'test-block',
                    content: [
                        { id: 'different-id', content: 'Content' }
                    ]
                };
                
                (blockModule.getBlockModelById as jasmine.Spy).and.returnValue(mockBlock);
                mockRangePath.parentElement.id = 'content-id'; // ID not matching any content
                
                // This should not throw error with no matching content
                mentionRenderer.removeMentionQueryKeysFromModel('@');
                
                // Clean up
                mentionRenderer.destroy();
                done();
            })
        });
    });
});
