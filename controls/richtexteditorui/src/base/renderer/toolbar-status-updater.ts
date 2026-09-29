/**
 * Syncs toolbar UI with the current editor formatting state.
 * Uses the public HeadlessEditor API to read marks and block formatting.
 */

import { EditorCore } from '../../core/base/editor-core';
import { ToolbarRenderer } from './toolbar-renderer';
import { DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { BuiltInToolbarItem } from '../../richtexteditor-ui/model';

/**
 * Queries the current formatting state from the editor's selection and
 * updates the toolbar UI to reflect it.
 */
export class ToolbarStatusUpdater {
    private editorCore: EditorCore;
    private renderer: ToolbarRenderer;

    /** Most recently computed formatting state; null until first update. */
    private currentState: FormattingState | null;

    constructor(editorCore: EditorCore, renderer: ToolbarRenderer) {
        this.editorCore = editorCore;
        this.renderer = renderer;
        this.currentState = null;
    }

    /**
     * Returns the formatting state captured during the most recent
     * `updateToolbarStatus()` call. Returns `null` if no update has occurred.
     *
     * @returns {FormattingState | null} - Returns the current Formatting state.
     */
    public getCurrentState(): FormattingState | null {
        return this.currentState;
    }

    /**
     * Resolve the toolbar item root element for a built-in name.
     *
     * Looks the element up dynamically using the renderer's live DOM query,
     * so caller never needs to know about prefixes / wrapping.
     *
     * @param {string} itemName - The built-in name (e.g. 'Bold')
     * @returns {HTMLElement | null} The toolbar item element, or null
     * @private
     */
    private resolveItem(itemName: string): HTMLElement | null {
        const el: HTMLElement | null = this.renderer.getItemElement(itemName);
        return el;
    }

    /**
     * Apply formatting state to the toolbar UI.
     * Called by modules when formattingStateUpdated event fires.
     *
     * @param {FormattingState} state - The formatting state to apply
     * @returns {void}
     */
    public applyFormattingState(state: FormattingState): void {
        this.currentState = state;
        this.applyStateToToolbar(state);
    }

    /**
     * Legacy entry point for backwards compatibility.
     * No longer queries state internally; delegates to applyFormattingState.
     *
     * @deprecated Use applyFormattingState(state) instead
     * @returns {void}
     */
    public updateToolbarStatus(): void {
        if (this.currentState) {
            this.applyFormattingState(this.currentState);
        }
    }

    /**
     * Apply the formatting state to the toolbar UI.
     * Updates button active states, dropdown values, and color picker values.
     *
     * @param {FormattingState} state - The current formatting state
     * @returns {void}
     * @private
     */
    private applyStateToToolbar(state: FormattingState): void {
        // Inline format buttons
        this.updateButtonActivation('Bold', state.bold);
        this.updateButtonActivation('Italic', state.italic);
        this.updateButtonActivation('Underline', state.underline);
        this.updateButtonActivation('Strikethrough', state.strikethrough);
        this.updateButtonActivation('Superscript', state.superscript);
        this.updateButtonActivation('Subscript', state.subscript);
        this.updateButtonActivation('InlineCode', state.inlineCode);

        // List buttons
        this.updateButtonActivation('BulletList', state.bulletList);
        this.updateButtonActivation('NumberedList', state.orderedList);

        // Block format buttons
        this.updateButtonActivation('Quote', state.blockQuote);
        this.updateButtonActivation('CodeBlock', state.codeBlock);
        this.updateButtonActivation('Heading 1', state.heading === 'Heading 1');
        this.updateButtonActivation('Heading 2', state.heading === 'Heading 2');
        this.updateButtonActivation('Heading 3', state.heading === 'Heading 3');
        this.updateButtonActivation('Heading 4', state.heading === 'Heading 4');
        this.updateButtonActivation('Paragraph', state.paragraph);

        // Alignment buttons (mutually exclusive)
        this.updateButtonActivation('AlignLeft', state.alignLeft);
        this.updateButtonActivation('AlignCenter', state.alignCenter);
        this.updateButtonActivation('AlignRight', state.alignRight);
        this.updateButtonActivation('AlignJustify', state.alignJustify);

        // Undo/Redo buttons (enable/disable with overlay class)
        this.updateUndoRedoButtons(state.uno, state.redo);

        // Dropdown values
        this.updateFormatsDropdown(state.heading, state.paragraph);
        this.updateFontNameDropdown(state.fontFamily);
        this.updateFontSizeDropdown(state.fontSize);

        // Color picker values
        this.updateFontColorPicker(state.fontColor);
        this.updateBackgroundColorPicker(state.backgroundColor);
    }

    /**
     * Updates a toolbar button's active state.
     *
     * {@link ToolbarActionHandler.handleSelect} at the moment of selection.
     *
     * @param {BuiltInToolbarItem | string} itemName - The built-in toolbar item name (e.g. 'Bold')
     * @param {boolean} activation - Whether the format is active
     * @returns {void}
     * @private
     */
    private updateButtonActivation(itemName: BuiltInToolbarItem | string, activation: boolean): void {
        const el: HTMLElement | null = this.resolveItem(itemName);
        if (!el) {
            return;
        }
        if (activation) {
            el.classList.add(ACTIVE_CLASS);
        } else {
            el.classList.remove(ACTIVE_CLASS);
        }
    }

    /**
     * Updates the undo and redo button states by adding/removing the overlay class.
     * Buttons are disabled (overlay class added) when the corresponding action is unavailable.
     *
     * @param {boolean} canUndo - Whether undo is available
     * @param {boolean} canRedo - Whether redo is available
     * @returns {void}
     * @private
     */
    private updateUndoRedoButtons(canUndo: boolean, canRedo: boolean): void {
        this.updateButtonOverlay('Undo', canUndo);
        this.updateButtonOverlay('Redo', canRedo);
    }

    /**
     * Updates a toolbar button's enabled/disabled state using the overlay class.
     * Adds the overlay class to disable the button, removes it to enable.
     *
     * @param {string} itemName - The built-in toolbar item name (e.g. 'Undo', 'Redo')
     * @param {boolean} enabled - Whether the button should be enabled
     * @returns {void}
     * @private
     */
    private updateButtonOverlay(itemName: string, enabled: boolean): void {
        const el: HTMLElement | null = this.resolveItem(itemName);
        if (!el) {
            return;
        }
        if (enabled) {
            el.classList.remove(OVERLAY_CLASS);
        } else {
            el.classList.add(OVERLAY_CLASS);
        }
    }

    /**
     * Updates the Formats dropdown with the current block format.
     *
     * @param {string | null} heading - The current heading label, or null
     * @param {boolean} paragraph - Whether the current block is a paragraph
     * @returns {void}
     * @private
     */
    private updateFormatsDropdown(heading: string | null, paragraph: boolean): void {
        let display: string;
        if (heading) {
            display = heading;
        } else if (paragraph) {
            display = 'Paragraph';
        } else {
            return; // No format to display
        }
        this.setDropdownContent('Formats', display);
    }

    /**
     * Update the Font Name dropdown to show the current font family.
     *
     * @param {string | null} family - The current font family, or null
     * @returns {void}
     * @private
     */
    private updateFontNameDropdown(family: string | null): void {
        if (!family) {
            return;
        }
        this.setDropdownContent('FontName', family);
    }

    /**
     * Update the Font Size dropdown to show the current font size.
     *
     * @param {string | null} size - The current font size, or null
     * @returns {void}
     * @private
     */
    private updateFontSizeDropdown(size: string | null): void {
        if (!size) {
            return;
        }
        this.setDropdownContent('FontSize', size);
    }

    /**
     * Updates the displayed text of a dropdown toolbar item.
     *
     * For FontSize dropdowns, strips the trailing 'px' unit from the content
     * to display only the numeric value (e.g., '14' instead of '14px').
     *
     * @param {string} itemName - The built-in toolbar item name (e.g. 'Formats', 'FontName', 'FontSize')
     * @param {string} content - The text to display on the dropdown button
     * @returns {void}
     * @private
     */
    private setDropdownContent(itemName: string, content: string): void {
        const ddb: DropDownButton | null = this.renderer.getDropDown(itemName);
        if (ddb) {
            // For FontSize, strip trailing 'px' unit to show only numeric value
            let displayContent: string = content;
            if (itemName === 'FontSize' && content) {
                displayContent = content.replace(/px$/i, '').trim();
            }
            ddb.content = '<span class="e-rte-ui-dropdown-btn-text-wrapper"' + ((itemName === 'FontName') ? 'style="width: ' + this.renderer.getFontNameDropdownWidth() + '"' : '') + '>' +
                '<span class="e-rte-ui-dropdown-btn-text">' + displayContent + '</span></span>';
            ddb.dataBind();
        }
    }

    /**
     * Update the Font Color picker to show the current font color.
     *
     * @param {string | null} color - The current font color (e.g. '#ff0000ff'), or null
     * @returns {void}
     * @private
     */
    private updateFontColorPicker(color: string | null): void {
        if (!color) {
            return;
        }
        this.setColorPickerValue('FontColor', color);
    }

    /**
     * Update the Background Color picker to show the current background color.
     *
     * @param {string | null} color - The current background color (e.g. '#ffff00ff'), or null
     * @returns {void}
     * @private
     */
    private updateBackgroundColorPicker(color: string | null): void {
        if (!color) {
            return;
        }
        this.setColorPickerValue('BackgroundColor', color);
    }

    /**
     * Set the value of a ColorPicker toolbar item.
     *
     * @param {string} itemName - The built-in toolbar item name (e.g. 'FontColor', 'BackgroundColor')
     * @param {string} color - The color value (e.g. '#ff0000ff')
     * @returns {void}
     * @private
     */
    private setColorPickerValue(itemName: string, color: string): void {
        const cp: ColorPicker | null = this.renderer.getColorPicker(itemName);
        if (cp) {
            const colorPickerValue: string = cp.getValue(color);
            const dropdownBtnText: HTMLElement|null|undefined = cp.element?.parentElement?.querySelector('.e-selected-color .e-split-preview');
            if (dropdownBtnText) {
                dropdownBtnText.style.backgroundColor = color;
            }
            cp.setProperties({ value: colorPickerValue + 'ff' }, true);
            cp.dataBind();
        }
    }

    /**
     * Updates dropdown popup selection before it opens.
     * Uses the cached formatting state (set by applyFormattingState).
     *
     * @param {string} kind  - Dropdown type.
     * @param {HTMLElement} popupElement - Popup root element.
     *
     * @returns {void}
     */
    public onDropdownBeforeOpen(kind: string, popupElement?: HTMLElement | null): void {
        const state: FormattingState | null = this.currentState;
        const popup: HTMLElement | null = popupElement ? popupElement : this.findDropdownPopup(kind);
        if (!popup) {
            return;
        }
        const items: NodeListOf<HTMLElement> = popup.querySelectorAll('li.e-item');
        const matchId: string | null = state ? this.resolveActiveDropdownItemId(kind, state) : null;
        for (let i: number = 0; i < items.length; i++) {
            const li: HTMLElement = items[i as number];
            const liRecord: Record<string, unknown> = li as unknown as Record<string, unknown>;
            const liId: string | null = typeof liRecord['id'] === 'string'
                ? (liRecord['id'] as string).replace(/^_/, '')
                : null;
            if (matchId !== null && liId === matchId) {
                li.classList.add(ACTIVE_CLASS);
            } else {
                li.classList.remove(ACTIVE_CLASS);
            }
        }
    }

    /**
     * Resolves the active popup item id from the current formatting state.
     *
     * @param {string} kind - Dropdown type.
     * @param {FormattingState} state - Current formatting state.
     * @returns {string | null} Matching item id, or `null` if none.
     * @private
     */
    private resolveActiveDropdownItemId(kind: string, state: FormattingState): string | null {
        switch (kind) {
        case 'Formats':
            if (state.heading) {
                return state.heading;
            }
            if (state.paragraph) {
                return 'Paragraph';
            }
            return null;
        case 'FontName':
            return state.fontFamily;
        case 'FontSize': {
            // The popup items use ids like '14' (matching the font size value).
            // Convert '14px' -> '14' to align with the configured sub-item id.
            const size: string | null = state.fontSize;
            if (!size) {
                return null;
            }
            const trimmed: string = size.replace(/px$/i, '').trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        case 'Alignment':
            if (state.alignLeft) {
                return 'AlignLeft';
            }
            if (state.alignCenter) {
                return 'AlignCenter';
            }
            if (state.alignRight) {
                return 'AlignRight';
            }
            if (state.alignJustify) {
                return 'AlignJustify';
            }
            return null;
        case 'NumberFormatList':
            return state.orderedListType;
        case 'BulletFormatList':
            return state.bulletListType;
        default:
            return null;
        }
    }

    /**
     * Returns the popup element for the specified dropdown.
     *
     * @param {string} kind - Toolbar item kind
     * @returns {HTMLElement | null} The popup root, or null
     * @private
     */
    private findDropdownPopup(kind: string): HTMLElement | null {
        let inst: DropDownButton | SplitButton | null = this.renderer.getDropDown(kind);
        if (!inst) {
            inst = this.renderer.getSplitButton(kind);
        }
        if (!inst || typeof (inst as { element?: HTMLElement }).element === 'undefined') {
            return null;
        }
        const anchor: HTMLElement | null = ((inst as { element: HTMLElement | null })?.element) || null;
        if (!anchor) {
            return null;
        }
        // EJ2 attaches the popup as a sibling of the dropdown wrapper, with a
        // stable class `.e-dropdown-popup` (DropDownButton) or `.e-menu-wrap`
        // (SplitButton). Look for both.
        const root: HTMLElement | null = anchor.parentElement;
        if (!root) {
            return null;
        }
        return root.querySelector('.e-dropdown-popup, .e-menu-wrap, .e-dropdown-menu') as HTMLElement | null;
    }
}

/**
 * Toolbar items that may host a popup which needs to sync its active item
 * with the editor's current state. Used by
 * {@link ToolbarStatusUpdater.onDropdownBeforeOpen}.
 */
export type ToolbarItemKind =
    | 'Formats'
    | 'FontName'
    | 'FontSize'
    | 'Alignment'
    | 'NumberFormatList'
    | 'BulletFormatList';

/**
 * CSS class applied to a toolbar item button when its format is active
 * at the current selection. Mirrors EJ2's standard toolbar active style.
 */
const ACTIVE_CLASS: string = 'e-active';

/**
 * CSS class applied to a toolbar item button when it is disabled (action unavailable).
 * Used for undo/redo buttons to indicate they cannot be clicked.
 */
const OVERLAY_CLASS: string = 'e-overlay';

/**
 * Snapshot of formatting state at the current selection.
 * Used internally to drive toolbar UI updates; also surfaced via
 * {@link ToolbarStatusUpdater.getCurrentState} so consumers (such as the
 * `updatedToolbarStatus` event) can read the latest snapshot.
 */
export interface FormattingState {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    superscript: boolean;
    subscript: boolean;
    inlineCode: boolean;
    fontColor: string | null;
    backgroundColor: string | null;
    fontSize: string | null;
    fontFamily: string | null;
    heading: string | null;
    paragraph: boolean;
    codeBlock: boolean;
    blockQuote: boolean;
    orderedList: boolean;
    bulletList: boolean;
    alignLeft: boolean;
    alignCenter: boolean;
    alignRight: boolean;
    alignJustify: boolean;
    uno: boolean;
    redo: boolean;
    orderedListType: string | null;
    bulletListType: string | null;
}
