import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';
import { FileMenuEventArgs } from '@syncfusion/ej2-ribbon';

describe('Ribbon Public API Testing', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;

    beforeAll(() => {
        element = createElement('div', { id: 'ribbon' });
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Ribbon);
        container = new DocumentEditorContainer({
            toolbarMode: 'Ribbon',
            enableRtl: false,
            height: '590px',
            enableToolbar: true
        });
        container.appendTo(element);
        try {
            jasmine.clock().install();
        } catch (e) {
            // Clock already installed, no need to install again
            console.log('Clock already installed');
        }
        jasmine.clock().tick(10);
    });

    afterAll(() => {
        if (container) {
            container.destroy();
        }
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }

        element = undefined;
        container = undefined;
        jasmine.clock().uninstall();
    });

    describe('Tab Management API', () => {
        it('should add a new tab using addTab() method', () => {
            // Get initial tab count
            const initialTabCount = container.ribbon.ribbon.tabs.length;

            // Add a new tab with a proper RibbonTabModel object
            container.ribbon.addTab({
                id: 'custom_tab',
                header: 'Custom Tab',
                groups: [{ id: 'custom_group', header: 'Custom Group', collections: [{ id: 'custom_collection', items: [{ type: 'Button', id: 'custom_button', buttonSettings: { content: 'Custom Button' } }] }] }]
            }, 'Home');

            // Get new tab count
            const newTabCount = container.ribbon.ribbon.tabs.length;

            // Verify tab was added
            expect(newTabCount).toBe(initialTabCount + 1);
        });

        it('should add a new tab at the end when insertBefore is not specified', () => {
            const initialTabCount = container.ribbon.ribbon.tabs.length;

            container.ribbon.addTab({
                id: 'end_tab',
                header: 'End Tab',
                groups: [{ id: 'end_group', header: 'End Group', collections: [{ id: 'end_collection', items: [{ type: 'Button', id: 'end_button', buttonSettings: { content: 'End Button' } }] }] }]
            });

            expect(container.ribbon.ribbon.tabs.length).toBe(initialTabCount + 1);
            expect(container.ribbon.ribbon.tabs[container.ribbon.ribbon.tabs.length - 1].id).toBe('end_tab');
        });

        it('should add a group in existing tab using addGroup() method', () => {
            const initialGroupCount = container.ribbon.ribbon.tabs[1].groups.length;
            // Add a group to the custom tab
            container.ribbon.addGroup('Home', { id: 'home_custom_group', header: 'Custom Group', collections: [{ id: 'custom_collection', items: [{ type: 'Button', buttonSettings: { content: 'Custom Button' } }] }] });
            expect(container.ribbon.ribbon.tabs[1].groups.length).toBe(initialGroupCount + 1);
        });

        it('should add a group in custom tab using addGroup() method', () => {
            const initialGroupCount = container.ribbon.ribbon.tabs[0].groups.length;
            // Add a group to the custom tab
            container.ribbon.addGroup('custom_tab', { id: 'custom_custom_group', header: 'Custom Group', collections: [{ id: 'custom_collection', items: [{ type: 'Button', buttonSettings: { content: 'Custom Button' } }] }] });
            expect(container.ribbon.ribbon.tabs[0].groups.length).toBe(initialGroupCount + 1);
        });

        it('should add a group before specified index using addGroup() method', () => {
            const initialGroupCount = container.ribbon.ribbon.tabs[0].groups.length;
            // Add a group to the custom tab at a specific position
            container.ribbon.addGroup('custom_tab', { id: 'custom_inserted_group', header: 'Inserted Group', collections: [{ id: 'insert_collection', items: [{ type: 'Button', buttonSettings: { content: 'Inserted Button' } }] }] }, 1);
            expect(container.ribbon.ribbon.tabs[0].groups.length).toBe(initialGroupCount + 1);
            expect(container.ribbon.ribbon.tabs[0].groups[1].id).toBe('custom_inserted_group');
        });

        it('should add an item to a tab using addItem() method', () => {
            container.ribbon.addItem({ tabId: 'Home', index: 0 }, { id: 'custom_item', type: 'Button', buttonSettings: { content: 'Custom Button' } });

            // Verify item was added
            const customButton = container.ribbon.ribbon.element.querySelector('#custom_item');
            expect(customButton).not.toBeNull();
        });

        it('should add an item before a specific item using addItem() with item ID', () => {
            const layoutTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_layout_tab"] div.e-tab-wrap[role="tab"]');
        // if (layoutTab) {
            layoutTab.click();
            const testButtonId = 'test_button_for_insertion';
            // First add a test button
            container.ribbon.addItem({ tabId: 'Layout', index: 0 }, { id: testButtonId, type: 'Button', buttonSettings: { content: 'Test Button' } });

            // Then add a new button before it
            container.ribbon.addItem(
                { tabId: 'Layout', index: 0 },
                { id: 'inserted_before_item', type: 'Button', buttonSettings: { content: 'Inserted Before' } },
                testButtonId
            );

            // Verify both buttons exist and are in the right order
            const collectionElement = document.querySelector(`#${testButtonId}`).closest('.e-ribbon-collection');
            const items = collectionElement.querySelectorAll('.e-ribbon-item');

            let foundInserted = false;
            let foundTest = false;
            let insertedIndex = -1;
            let testIndex = -1;

            for (let i = 0; i < items.length; i++) {
                if (items[i].querySelector('#inserted_before_item')) {
                    foundInserted = true;
                    insertedIndex = i;
                }
                if (items[i].querySelector(`#${testButtonId}`)) {
                    foundTest = true;
                    testIndex = i;
                }
            }

            expect(foundInserted).toBe(true);
            expect(foundTest).toBe(true);
            expect(insertedIndex).toBeLessThan(testIndex);
        });

        it('should add an item before a specific index using addItem() with numeric index', () => {
            const developerTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_developer_tab"] div.e-tab-wrap[role="tab"]');
        // if (layoutTab) {
            developerTab.click();
            // Add a button before the item at index 1
            container.ribbon.addItem(
                { tabId: 'Developer', index: 0 },
                { id: 'inserted_at_index', type: 'Button', buttonSettings: { content: 'Inserted At Index' } },
                1
            );

            // Verify the button exists
            expect(document.querySelector('#inserted_at_index')).not.toBeNull();
        });
    });

    describe('Visibility Control API', () => {
        it('should show/hide a tab using showTab() method', () => {
            // Hide the custom tab
            container.ribbon.showTab('custom_tab', false);

            expect(document.querySelector('[data-id="' + container.ribbon.ribbon.tabs[0].id + '"]').classList.contains('e-hidden')).toBe(true);

            // Show the custom tab again
            container.ribbon.showTab('custom_tab', true);

            expect(document.querySelector('[data-id="' + container.ribbon.ribbon.tabs[0].id + '"]').classList.contains('e-hidden')).toBe(false);
            container.ribbon.showTab('Insert', false);
            expect(document.querySelector('[data-id="' + container.ribbon.ribbon.tabs[2].id + '"]').classList.contains('e-hidden')).toBe(true);
        });

        it('should handle invalid tab ID gracefully in showTab() method', () => {
            // This should not throw an error
            container.ribbon.showTab('non_existent_tab', false);
            // No explicit assertion needed - we're just checking it doesn't throw an error
        });

        it('should show/hide a group in existing tab using showGroup() method', () => {
            const layoutTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_layout_tab"] div.e-tab-wrap[role="tab"]');
            if (layoutTab) {
                layoutTab.click();
            }
            jasmine.clock().tick(1000);
            // Hide the custom group
            container.ribbon.showGroup({ tabId: 'Layout', index: 0 }, false);
            jasmine.clock().tick(1000);
            expect(document.querySelector('#' + container.ribbon.ribbon.tabs[3].groups[0].id).classList.contains('e-hidden')).toBe(true);
            container.ribbon.showGroup({ tabId: 'Layout', index: 0 }, true);

            expect(document.querySelector('#' + container.ribbon.ribbon.tabs[3].groups[0].id).classList.contains('e-hidden')).toBe(false);
        });

        it('should show/hide in custom tab using showGroup() method', () => {
            // Hide the custom group
            container.ribbon.showGroup({ tabId: 'custom_tab', index: 1 }, false);

            expect(document.querySelector('#' + container.ribbon.ribbon.tabs[0].groups[1].id).classList.contains('e-hidden')).toBe(true);
            container.ribbon.showGroup({ tabId: 'custom_tab', index: 1 }, true);

            expect(document.querySelector('#' + container.ribbon.ribbon.tabs[0].groups[1].id).classList.contains('e-hidden')).toBe(false);
        });

        it('should handle invalid group ID gracefully in showGroup() method', () => {
            // This should not throw an error
            container.ribbon.showGroup({ tabId: 'non_existent_tab', index: 0 }, false);
            // No explicit assertion needed - we're just checking it doesn't throw an error
        });

        it('should show/hide an item in custom tab using showItems() method', () => {
            // Hide the custom button
            container.ribbon.showItems('custom_button', false);

            // Verify item is hidden
            expect(document.querySelector('#custom_button').parentElement.classList.contains('e-hidden')).toBeTruthy();

            // Show the custom button again
            container.ribbon.showItems('custom_button', true);

            // Verify item is visible
            expect(document.querySelector('#custom_button').parentElement.classList.contains('e-hidden')).toBeFalsy();
        });

        it('should show/hide multiple items using showItems() with RibbonItemInfo', () => {
            container.ribbon.showItems({ tabId: 'Home', groupIndex: 1, itemIndexes: [1, 2, 3] }, false);
            expect(document.querySelector('[aria-label="Copy"]').parentElement.classList.contains('e-hidden')).toBe(true);

            // Show items again
            container.ribbon.showItems({ tabId: 'Home', groupIndex: 1, itemIndexes: [1, 2, 3] }, true);
            expect(document.querySelector('[aria-label="Copy"]').parentElement.classList.contains('e-hidden')).toBe(false);
        });

        it('should enable/disable an item in custom tab using enableItems() method', () => {
            // Disable the custom button
            container.ribbon.enableItems('custom_button', false);

            // Verify item is disabled
            expect(document.querySelector('#custom_button').parentElement.classList.contains('e-disabled')).toBeTruthy();

            // Enable the custom button again
            container.ribbon.enableItems('custom_button', true);

            // Verify item is enabled
            expect(document.querySelector('#custom_button').parentElement.classList.contains('e-disabled')).toBeFalsy();
        });

        it('should enable/disable multiple items using enableItems() with RibbonItemInfo', () => {
            container.ribbon.enableItems({ tabId: 'Home', groupIndex: 1, itemIndexes: [1, 2, 3] }, false);
            expect(document.querySelector('[aria-label="Copy"]').parentElement.classList.contains('e-disabled')).toBe(true);

            // Enable items again
            container.ribbon.enableItems({ tabId: 'Home', groupIndex: 1, itemIndexes: [1, 2, 3] }, true);
            expect(document.querySelector('[aria-label="Copy"]').parentElement.classList.contains('e-disabled')).toBe(false);
        });
    });
});
describe('Ribbon Public API Testing - File menu', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;

    beforeAll(() => {
        element = createElement('div', { id: 'ribbon_file' });
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Ribbon);
        container = new DocumentEditorContainer({
            toolbarMode: 'Ribbon',
            enableRtl: false,
            height: '590px',
            enableToolbar: true,
            fileMenuItems: [{ text: 'New Document', id: 'new' }, "Print"],
            fileMenuItemClick: (args: FileMenuEventArgs) => {
                if (args.item.text == 'New Document') {
                    container.documentEditor.openBlank();
                }
            }
        });
        container.appendTo(element);
        try {
            jasmine.clock().install();
        } catch (e) {
            // Clock already installed, no need to install again
            console.log('Clock already installed');
        }
        const fileButton: HTMLElement = document.querySelector('[aria-label="File"]');
        fileButton.click();
        jasmine.clock().tick(10);
    });

    afterAll(() => {
        if (container) {
            container.destroy();
        }
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }

        element = undefined;
        container = undefined;
        jasmine.clock().uninstall();
    });

    describe('File Menu customization', () => {

        it('Menu list count validation', () => {
            expect(document.querySelector('.e-ribbon-menu ul').childNodes.length).toBe(2);
        });
        // customize file Manu
        it('File validation', () => {
            container.documentEditor.editor.insertText('sample');
            container.documentEditor.selection.selectAll();
            expect(container.documentEditor.selection.text.trim()).toBe('sample');
            (document.querySelector('[aria-label="New Document"]') as HTMLElement).click();
            container.documentEditor.selection.selectAll();
            expect(container.documentEditor.selection.text.trim()).toBe('');
        });
    });

    describe('Ribbon to toolbar switching and vice-versa', () => {
        it('should handle toolbarMode correctly', () => {
            container.toolbarMode = 'Toolbar';
            expect(container.toolbarModule).not.toBeDefined();
        });
    });
});