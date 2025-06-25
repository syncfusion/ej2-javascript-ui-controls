import { LauncherClickEventArgs, TabSelectedEventArgs } from '@syncfusion/ej2-ribbon';
import { Ribbon } from './../ribbon';
import { FONT_GROUP_ID } from './../home-tab/font-group';
import { PARAGRAPH_GROUP_ID } from './../home-tab/home-paragraph-group';
import { PAGE_SETUP_GROUP_ID } from './../layout-tab/page-setup-group';
import { BORDERS_SHADING_GROUP_ID } from './../table-design-tab/constants';
import { STYLES_GROUP_ID } from './../home-tab/styles-group';
import { RIBBON_ID } from './ribbon-constants';
import { DocumentEditorContainer } from '../../document-editor-container';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { LAYOUT_PARAGRAPH_GROUP } from '../layout-tab/layout-paragraph-group';

/**
 * Manages ribbon events
 * @private
 */
export class RibbonEventManager {
    /**
     * @private
     */
    private ribbon: Ribbon;
    private container: DocumentEditorContainer;

    /**
     * Constructor for RibbonEventManager
     * @param {Ribbon} ribbon - Ribbon instance
     * @param {DocumentEditorContainer} container - Document editor container instance
     */
    constructor(ribbon: Ribbon, container: DocumentEditorContainer) {
        this.ribbon = ribbon;
        this.container = container;
    }

    /**
     * Handle launcher icon click
     * @param {LauncherClickEventArgs} args - Event arguments
     * @returns {void}
     * @private
     */
    public onLauncherIconClicked(args: LauncherClickEventArgs): void {
        const id: string = this.ribbon.container.element.id + RIBBON_ID;
        switch (args.groupId) {
        case id + FONT_GROUP_ID:
            this.container.documentEditor.showDialog('Font');
            break;
        case id + PARAGRAPH_GROUP_ID:
        case id + LAYOUT_PARAGRAPH_GROUP:
            this.container.documentEditor.showDialog('Paragraph');
            break;
        case id + PAGE_SETUP_GROUP_ID:
            this.container.documentEditor.showDialog('PageSetup');
            break;
        case id + BORDERS_SHADING_GROUP_ID:
            this.container.documentEditor.showDialog('BordersAndShading');
            break;
        case id + STYLES_GROUP_ID:
            this.container.documentEditor.showDialog('Styles');
            break;
        }
    }

    /**
     * Handle file menu item selection
     * @param {MenuEventArgs} args - Event arguments
     * @returns {void}
     * @private
     */
    public onFileMenuItemSelect(args: MenuEventArgs): void {
        this.ribbon.tabManager.fileMenu.onFileMenuItemSelect(args);
    }


    /**
     * Handle tab selection
     * @param {TabSelectedEventArgs} args - Event arguments
     * @returns {void}
     * @private
     */
    public onTabSelected(args: TabSelectedEventArgs): void {
        this.updateNumericTextBox(this.ribbon.ribbon.tabs[args.selectedIndex].header);
        this.ribbon.tabManager.updateAllTabs();
        this.container.documentEditor.focusIn();
    }

    /**
     * Handle ribbon layout change
     * @returns {void}
     * @private
     */
    public onRibbonLayoutChange(): void {
        // Reset size group initialization state
        if (this.ribbon.tabManager.pictureFormatTab && this.ribbon.tabManager.pictureFormatTab.sizeGroup) {
            this.ribbon.tabManager.pictureFormatTab.sizeGroup.resetInitializationState();
        }

        if (this.ribbon.tabManager.layoutTab && this.ribbon.tabManager.layoutTab.layoutParagraphGroup) {
            this.ribbon.tabManager.layoutTab.layoutParagraphGroup.resetInitializationState();
        }

        this.updateNumericTextBox(this.ribbon.ribbon.tabs[this.ribbon.ribbon.selectedTab].header);
        this.resizeEditor(this.ribbon.container.editorContainer);
    }

    /**
     * Resize the editor container based on ribbon layout
     * @param {HTMLElement} editorContainer - The editor container element
     * @returns {void}
     * @private
     */
    private resizeEditor(editorContainer: HTMLElement): void {
        editorContainer.classList.remove(...['e-de-tool-ctnr-properties-pane', 'e-de-ribbon-simplified-ctnr-properties-pane', 'e-de-ribbon-classic-ctnr-properties-pane']);
        if (this.ribbon.ribbon.activeLayout === 'Simplified') {
            editorContainer.classList.add('e-de-ribbon-simplified-ctnr-properties-pane');
        } else {
            editorContainer.classList.add('e-de-ribbon-classic-ctnr-properties-pane');
        }
        this.container.documentEditor.resize();
    }

    /**
     * Update numeric text boxes based on selected tab
     * @param {string} header - The tab header text
     * @returns {void}
     * @private
     */
    private updateNumericTextBox(header: string): void {
        if (header === this.ribbon.localObj.getConstant('Layout')) {
            this.ribbon.tabManager.layoutTab.layoutParagraphGroup.initializeNumericTextBoxes();
            this.ribbon.tabManager.layoutTab.layoutParagraphGroup.updateSelection();
        } else if (header === this.ribbon.localObj.getConstant('Picture Format')) {
            this.ribbon.tabManager.pictureFormatTab.sizeGroup.initializeNumericTextBoxes();
            this.ribbon.tabManager.pictureFormatTab.sizeGroup.updateSizeProperties();
        } else if (header === this.ribbon.localObj.getConstant('Table Design')) {
            this.ribbon.tabManager.tableDesignTab.shadingGroup.showColorPicker();
        }
    }
}
