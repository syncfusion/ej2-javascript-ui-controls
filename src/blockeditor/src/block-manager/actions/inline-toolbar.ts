import { detach, updateCSSText } from '@syncfusion/ej2-base';
import { ClickEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { Popup } from '@syncfusion/ej2-popups';
import { BlockType, CommandName } from '../../models/enums';
import { detectFormatsForTextNode, extractStylesFromElement, getBlockContentElement, getBlockSpecificRange, getNormalizedKey, getParentBlock, getSelectedRange, hasActiveTableSelection } from '../../common/utils/index';
import { BlockModel, StyleModel, Styles } from '../../models/index';
import { events } from '../../common/constant';
import { findClosestParent, getNodesInRange } from '../../common/utils/dom';
import * as constants from '../../common/constant';
import { BlockManager } from '../base/block-manager';
import { FormattingHelper } from '../../common/utils/isformatted';

/**
 * InlineToolbarModule class is used to render the inline toolbar for the block editor.
 *
 * @hidden
 */
export class InlineToolbarModule {

    private parent: BlockManager;
    public popupObj: Popup;
    public toolbarObj: Toolbar;
    private toolbarEle: HTMLElement;
    private popupElement: HTMLElement;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick, this);
        this.parent.observer.on('toolbarCreated', this.handleToolbarCreated, this);
        this.parent.observer.on('handleColorpickerChange', this.handleColorChange, this);
        this.parent.observer.on('popupWidthChanged', this.handlePopupWidthChanges, this);
        this.parent.observer.on(events.formattingPerformed, this.toggleToolbarActiveState, this);
        this.parent.observer.on(events.keydown, this.onKeydown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick);
        this.parent.observer.off('toolbarCreated', this.handleToolbarCreated);
        this.parent.observer.off('handleColorpickerChange', this.handleColorChange);
        this.parent.observer.off('popupWidthChanged', this.handlePopupWidthChanges);
        this.parent.observer.off(events.formattingPerformed, this.toggleToolbarActiveState);
        this.parent.observer.off(events.keydown, this.onKeydown);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleToolbarCreated(): void {
        this.toolbarEle = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.BLOCKEDITOR_INLINETBAR_ID);
        this.init();
    }

    private init(): void {
        this.popupElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.INLINE_TBAR_POPUP_ID);

        this.popupObj = this.parent.popupRenderer.renderPopup({
            element: this.popupElement,
            content: this.toolbarEle
        });
        this.popupObj.actionOnScroll = 'none';
    }

    private onKeydown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }

        const command: string = this.parent.keyCommandMap.get(normalizedKey);
        const allowedCommands: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'inlineCode'];
        const tableBlk: HTMLElement = this.parent.currentFocusedBlock &&
            this.parent.currentFocusedBlock.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;

        if (allowedCommands.indexOf(command) !== -1) {
            e.preventDefault();
            if (window.getSelection().isCollapsed && !(tableBlk && hasActiveTableSelection(tableBlk))) {
                this.parent.formattingAction.toggleActiveFormats(command as keyof StyleModel);
            }
            else {
                this.parent.execCommand({ command: 'FormattingAction', state: { command: (command as keyof StyleModel) } });
            }
        }
    }

    private isSelectionInTableHeader(range: Range): boolean {
        // Resolve a reliable HTMLElement anchor from the range
        const startEl: HTMLElement = (range.startContainer.nodeType === Node.ELEMENT_NODE
            ? (range.startContainer as HTMLElement)
            : (range.startContainer.parentElement as HTMLElement));

        if (!startEl) { return false; }

        // Nearest header cell: either an actual <th> or an element marked as column header
        const headerCell: HTMLElement = startEl.closest('th,[role="columnheader"]') as HTMLElement | null;
        if (!headerCell) { return false; }

        // Ensure it's within a THEAD to qualify as header, not body cells styled as header
        const inThead: HTMLElement = headerCell.closest('thead') as HTMLElement | null;
        return !!inThead;
    }

    /**
     * Shows the inline toolbar at the current selection
     *
     * @param {Range} range - Selection range where the toolbar should appear
     * @param {Event} event - Optional event that triggered the toolbar
     * @returns {void}
     * @hidden
     */
    public showInlineToolbar(range: Range, event?: Event): void {
        const notAllowedTypes: string[] = [BlockType.Code];
        const blockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const blockType: string = blockElement.getAttribute('data-block-type');
        if (!this.parent.inlineToolbarSettings.enable || (notAllowedTypes.indexOf(blockType) !== -1)) { return; }
        if (this.isSelectionInTableHeader(range)) { return; }
        this.toggleToolbarActiveState();
        this.parent.popupRenderer.adjustPopupPositionRelativeToTarget(range, this.popupObj);
        this.popupObj.show();
    }

    /**
     * Hides the inline toolbar
     *
     * @param {Event} e - Optional event that triggered hiding the toolbar
     * @returns {void}
     */
    public hideInlineToolbar(e?: Event): void {
        if (this.popupElement && !this.popupElement.classList.contains('e-popup-open')) {
            return;
        }

        this.popupObj.hide();
    }

    private handleInlineToolbarItemClick(args: ClickEventArgs): void {
        const selectedItem: string = args.item.id;
        if (selectedItem === 'color' || selectedItem === 'bgColor') {
            // Do not proceed further for color and background color commands. It will be handled by the color picker.
            return;
        }
        if (selectedItem === 'link') {
            // Show link popup when link item is clicked in inline toolbar
            this.parent.linkModule.showLinkPopup(args.originalEvent as KeyboardEvent);
            return;
        }
        this.parent.execCommand({ command: 'FormattingAction', state: { command: selectedItem } });
    }

    /**
     * Updates active state of toolbar buttons based on current selection formatting.
     *
     * @returns {void}
     * @hidden
     */
    public toggleToolbarActiveState(): void {
        const range: Range = getSelectedRange();
        if (!range) { return; }

        const toolbarItems: NodeListOf<HTMLElement> = this.popupElement.querySelectorAll('.e-toolbar-item');
        toolbarItems.forEach((item: HTMLElement) => item.classList.remove('e-active'));

        const blockElements: HTMLElement[] = this.getBlocksInRange(range);

        // Enable/Disable only the 'link' item based on multi-block selection
        const distinctBlocks: HTMLElement[] = blockElements.filter((b: HTMLElement) => b.hasAttribute('data-block-type'));
        const enableLink: boolean = distinctBlocks.length <= 1;
        if (this.parent && this.parent.editorMethods) {
            this.parent.editorMethods.enableDisableToolbarItems('link', enableLink);
        }

        const detectedFormats: Styles = this.detectFormatsFromSelection(range);
        if (!detectedFormats || Object.keys(detectedFormats).length === 0) { return; }

        for (const item of Array.from(toolbarItems)) {
            const command: CommandName = item.getAttribute('data-command') as CommandName;
            this.toggleActiveState(item, command, detectedFormats);
        }
    }

    /**
     * Detects active formats from selected text nodes in DOM.
     *
     * @param {Range} range - The selection range
     * @returns {Styles} - Common styles across selection
     * @hidden
     */
    public detectFormatsFromSelection(range: Range): Styles {
        const nodesInSelection: Node[] = [];

        const selectedBlockModels: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        selectedBlockModels.forEach((block: BlockModel) => {
            const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
            const blockRange: Range = getBlockSpecificRange(range, blockElement);
            nodesInSelection.push(...getNodesInRange(blockRange));
        });

        if (nodesInSelection.length === 0) { return {}; }

        const formatsByNode: Styles[] = nodesInSelection.map((textNode: Node) => {
            return detectFormatsForTextNode(textNode);
        });

        return this.getCommonFormatsAcrossNodes(formatsByNode);
    }

    /**
     * Finds common formats across multiple text nodes.
     * A format is "active" if ALL selected text nodes have it.
     *
     * @param {Styles[]} formatsByNode - Format styles for each text node
     * @returns {Styles} - Only formats that all nodes share
     */
    private getCommonFormatsAcrossNodes(formatsByNode: Styles[]): Styles {
        if (!formatsByNode.length) { return {}; }
        if (formatsByNode.length === 1) { return formatsByNode[0]; }

        const commonFormats: Styles = {};
        const firstNodeFormats: Styles = formatsByNode[0];

        for (const format of Object.keys(firstNodeFormats)) {
            const firstValue: string | boolean = firstNodeFormats[format as keyof StyleModel];
            const isCommon: boolean = formatsByNode.every((nodeFormats: Styles) => {
                const value: string | boolean = nodeFormats[format as keyof StyleModel];
                return value === firstValue;
            });

            if (isCommon) {
                commonFormats[format as keyof StyleModel] = firstValue;
            }
        }

        return commonFormats;
    }

    private getBlocksInRange(range: Range): HTMLElement[] {
        const blocks: HTMLElement[] = [];
        const startBlock: HTMLElement = getParentBlock(range.startContainer);
        const endBlock: HTMLElement = getParentBlock(range.endContainer);

        if (!startBlock) { return blocks; }

        // Single block case
        if (startBlock === endBlock) {
            blocks.push(startBlock);
            return blocks;
        }

        // Multi-block case
        let current: HTMLElement | null = startBlock;
        while (current && current !== endBlock) {
            blocks.push(current);
            current = current.nextElementSibling as HTMLElement;
        }
        if (endBlock) {
            blocks.push(endBlock);
        }

        return blocks.filter((block: HTMLElement) => block.hasAttribute('data-block-type'));
    }

    private toggleActiveState(item: HTMLElement, command: CommandName, styles: Styles): void {
        let isActive: boolean = false;
        switch (command) {
        case 'Bold': isActive = styles.bold === true; break;
        case 'Italic': isActive = styles.italic === true; break;
        case 'Underline': isActive = styles.underline === true; break;
        case 'Strikethrough': isActive = styles.strikethrough === true; break;
        case 'Superscript': isActive = styles.superscript === true; break;
        case 'Subscript': isActive = styles.subscript === true; break;
        case 'Uppercase': isActive = styles.uppercase === true; break;
        case 'Lowercase': isActive = styles.lowercase === true; break;
        case 'InlineCode': isActive = styles.inlineCode === true; break;
        case 'Color': this.setColors('color', (styles.color as string)); break;
        case 'BackgroundColor': this.setColors('bgColor', (styles.backgroundColor as string)); break;
        }
        item.classList.toggle('e-active', isActive);
    }

    private setColors(type: 'color' | 'bgColor', value?: string ): void {
        const colorBtn: HTMLSpanElement = (this.toolbarEle.querySelector('#toolbar-color-dropdown') as HTMLSpanElement);
        const bgColorBtn: HTMLSpanElement = (this.toolbarEle.querySelector('#toolbar-bgcolor-dropdown') as HTMLSpanElement);
        const currentColor: string = value ? value : '#000000';
        if (currentColor) {
            const button: HTMLElement = type === 'color' ?
                colorBtn.querySelector('.e-inline-color-icon') :
                bgColorBtn.querySelector('.e-inline-bgColor-icon');
            if (button) {
                updateCSSText(button, `border-bottom-color: ${currentColor};`);
            }
        }
    }

    private handleColorChange(args: { type: 'color' | 'bgColor', value: string }): void {
        const command: keyof StyleModel = args.type === 'bgColor' ? 'backgroundColor' : args.type;
        this.parent.formattingAction.execCommand({
            command: command,
            value: args.value
        });
        this.setColors(args.type, args.value);
    }

    private handlePopupWidthChanges(data: { value: number }): void {
        this.popupObj.width = this.parent.inlineToolbarSettings.popupWidth = data.value;
    }

    /**
     * Checks whether the slash command popup is opened or not.
     *
     * @returns {boolean} - Returns true if the slash command popup is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        const inlineTlbrPopupElement: HTMLElement = document.querySelector('.e-popup.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        return (inlineTlbrPopupElement.classList.contains('e-popup-open'));
    }

    /**
     * Destroys the inline toolbar module and cleans up resources
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupElement);
            this.popupObj = null;
        }
    }
}
