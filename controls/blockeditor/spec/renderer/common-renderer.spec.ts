import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, MentionRenderer, ToolbarRenderer, TooltipRenderer } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { PopupRenderer } from '../../src/block-manager/renderer/common/popup-renderer';
import { MentionAction } from '../../src/block-manager/actions/mention';

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
        let mentionAction: MentionAction;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({});
            editor.appendTo('#editor');
            popupRenderer = new PopupRenderer(editor.blockManager);
            toolbarRenderer = new ToolbarRenderer(editor);
            tooltipRenderer = new TooltipRenderer(editor);
            mentionRenderer = new MentionRenderer(editor);
            mentionAction = new MentionAction(editor.blockManager);
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
                const selectionModule = require('../../src/common/utils/selection');
                spyOn(selectionModule, 'getSelectedRange').and.returnValue(null);
                
                const testElement = document.createElement('div');
                
                // This should not throw error with null range
                mentionAction.cleanMentionArtifacts(testElement);
                
                // Test removeMentionQueryKeysFromModel with null rangePath
                spyOn(editor.blockManager.nodeSelection, 'getStoredBackupRange').and.returnValue(null);
                
                // This should not throw error with null rangePath
                mentionAction.removeMentionQueryKeysFromModel('@');
                
                // Set up a valid rangePath but null block
                const mockRangePath = {
                    startContainer: document.createTextNode('test'),
                    endContainer: document.createTextNode('test'),
                    startOffset: 0,
                    endOffset: 0,
                    parentElement: document.createElement('span')
                };
                
                (editor.blockManager.nodeSelection.getStoredBackupRange as jasmine.Spy).and.returnValue(mockRangePath);
                editor.blockManager.currentFocusedBlock = document.createElement('div');
                editor.blockManager.currentFocusedBlock.id = 'nonexistent-block';
                
                // Mock getBlockModelById correctly
                const blockModule = require('../../src/common/utils/block');
                spyOn(blockModule, 'getBlockModelById').and.returnValue(null);
                
                // This should not throw error with null block
                mentionAction.removeMentionQueryKeysFromModel('@');
                
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
                mentionAction.removeMentionQueryKeysFromModel('@');
                done();
            })
        });
    });
});
