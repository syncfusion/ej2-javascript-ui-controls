// src/document-editor-container/helper/font-helper.ts
import { DocumentEditor, HighlightColor } from '../../document-editor/index';
import { L10n } from '@syncfusion/ej2-base';
import { HighlightColorInfo } from './ribbon-interfaces';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';

/**
 * Helper class for font operations in Document Editor
 * @private
 */
export class FontHelper {
    /**
     * Get highlight color items
     * @param {L10n} localObj - Localization object
     * @param {string} id - ID for the highlight color items
     * @returns {HighlightColorInfo[]} Array of highlight color items
     */
    public static getHighlightColorItems(localObj: L10n, id: string): HighlightColorInfo[] {
        return [
            { id: id + '_yellow', text: localObj.getConstant('Yellow'), backgroundColor: 'rgb(255, 255, 0)' },
            { id: id + '_bright-green', text: localObj.getConstant('Bright Green'), backgroundColor: 'rgb(0, 255, 0)' },
            { id: id + '_turquoise', text: localObj.getConstant('Turquoise'), backgroundColor: 'rgb(0, 255, 255)' },
            { id: id + '_pink', text: localObj.getConstant('Pink'), backgroundColor: 'rgb(255, 0, 255)' },
            { id: id + '_blue', text: localObj.getConstant('Blue'), backgroundColor: 'rgb(0, 0, 255)' },
            { id: id + '_red', text: localObj.getConstant('Red'), backgroundColor: 'rgb(255, 0, 0)' },
            { id: id + '_dark-blue', text: localObj.getConstant('Dark Blue'), backgroundColor: 'rgb(0, 0, 128)' },
            { id: id + '_teal', text: localObj.getConstant('Teal'), backgroundColor: 'rgb(0, 128, 128)' },
            { id: id + '_green', text: localObj.getConstant('Green'), backgroundColor: 'rgb(0, 128, 0)' },
            { id: id + '_violet', text: localObj.getConstant('Violet'), backgroundColor: 'rgb(128, 0, 128)' },
            { id: id + '_dark-red', text: localObj.getConstant('Dark Red'), backgroundColor: 'rgb(128, 0, 0)' },
            { id: id + '_dark-yellow', text: localObj.getConstant('Dark Yellow'), backgroundColor: 'rgb(128, 128, 0)' },
            { id: id + '_gray-50', text: localObj.getConstant('Gray 50'), backgroundColor: 'rgb(128, 128, 128)' },
            { id: id + '_gray-25', text: localObj.getConstant('Gray 25'), backgroundColor: 'rgb(192, 192, 192)' },
            { id: id + '_black', text: localObj.getConstant('Black'), backgroundColor: 'rgb(0, 0, 0)' },
            { id: id + '_no-color', text: localObj.getConstant('No color'), backgroundColor: 'transparent' }
        ];
    }

    /**
     * Get HighlightColor enum value based on the color string
     * @param {string} color - Color string in rgb format
     * @returns {HighlightColor} HighlightColor enum value
     */
    public static getHighlightColor(color: string): HighlightColor {
        switch (color) {
        case 'rgb(255, 255, 0)':
            return 'Yellow';
        case 'rgb(0, 255, 0)':
            return 'BrightGreen';
        case 'rgb(0, 255, 255)':
            return 'Turquoise';
        case 'rgb(255, 0, 255)':
            return 'Pink';
        case 'rgb(0, 0, 255)':
            return 'Blue';
        case 'rgb(255, 0, 0)':
            return 'Red';
        case 'rgb(0, 0, 128)':
            return 'DarkBlue';
        case 'rgb(0, 128, 128)':
            return 'Teal';
        case 'rgb(0, 128, 0)':
            return 'Green';
        case 'rgb(128, 0, 128)':
            return 'Violet';
        case 'rgb(128, 0, 0)':
            return 'DarkRed';
        case 'rgb(128, 128, 0)':
            return 'DarkYellow';
        case 'rgb(128, 128, 128)':
            return 'Gray50';
        case 'rgb(192, 192, 192)':
            return 'Gray25';
        case 'rgb(0, 0, 0)':
            return 'Black';
        default:
            return 'NoColor';
        }
    }

    /**
     * Get background color from HighlightColor enum
     * @param {HighlightColor} highlightColor - HighlightColor enum value
     * @returns {string} Background color string in rgb format
     */
    public static getBackgroundColorFromHighlightColor(highlightColor: HighlightColor): string {
        switch (highlightColor) {
        case 'Yellow':
            return 'rgb(255, 255, 0)';
        case 'BrightGreen':
            return 'rgb(0, 255, 0)';
        case 'Turquoise':
            return 'rgb(0, 255, 255)';
        case 'Pink':
            return 'rgb(255, 0, 255)';
        case 'Blue':
            return 'rgb(0, 0, 255)';
        case 'Red':
            return 'rgb(255, 0, 0)';
        case 'DarkBlue':
            return 'rgb(0, 0, 128)';
        case 'Teal':
            return 'rgb(0, 128, 128)';
        case 'Green':
            return 'rgb(0, 128, 0)';
        case 'Violet':
            return 'rgb(128, 0, 128)';
        case 'DarkRed':
            return 'rgb(128, 0, 0)';
        case 'DarkYellow':
            return 'rgb(128, 128, 0)';
        case 'Gray50':
            return 'rgb(128, 128, 128)';
        case 'Gray25':
            return 'rgb(192, 192, 192)';
        case 'Black':
            return 'rgb(0, 0, 0)';
        default:
            return 'transparent'; // No color
        }
    }

    /**
     * Apply highlight color to selection
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} color - Color string in rgb format
     * @returns {string} Applied highlight color
     */
    public static applyHighlightColor(documentEditor: DocumentEditor, color: string): string {
        if (documentEditor.selectionModule && documentEditor.selectionModule.characterFormat) {
            const highlightColor: HighlightColor = FontHelper.getHighlightColor(color);
            documentEditor.selectionModule.characterFormat.highlightColor = highlightColor;
            documentEditor.focusIn();
        }
        return color;
    }

    /**
     * Apply font formatting action
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} action - Action to perform (bold, italic, etc.)
     * @returns {void}
     */
    public static applyFontFormatting(documentEditor: DocumentEditor, action: string): void {
        if (documentEditor.isReadOnly || !documentEditor.editorModule) {
            return;
        }

        switch (action) {
        case 'bold':
            documentEditor.editorModule.toggleBold();
            break;
        case 'italic':
            documentEditor.editorModule.toggleItalic();
            break;
        case 'underline':
            documentEditor.editorModule.toggleUnderline('Single');
            break;
        case 'strikethrough':
            documentEditor.editorModule.toggleStrikethrough();
            break;
        case 'superscript':
            documentEditor.selection.characterFormat.baselineAlignment =
                documentEditor.selection.characterFormat.baselineAlignment === 'Superscript' ? 'Normal' : 'Superscript';
            break;
        case 'subscript':
            documentEditor.selection.characterFormat.baselineAlignment =
                documentEditor.selection.characterFormat.baselineAlignment === 'Subscript' ? 'Normal' : 'Subscript';
            break;
        case 'clearFormat':
            documentEditor.editorModule.clearFormatting();
            break;
        }

        documentEditor.focusIn();
    }

    /**
     * Apply case change to selection
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {L10n} localObj  - Localization object
     * @param {string} caseType - Case type to apply
     * @returns {void}
     */
    public static applyChangeCase(documentEditor: DocumentEditor, localObj: L10n, caseType: string): void {
        if (documentEditor.isReadOnly || !documentEditor.editorModule) {
            return;
        }
        // Compare with localized text from the menu item
        switch (caseType) {
        case localObj.getConstant('SentenceCase'):
            documentEditor.editorModule.changeCase('SentenceCase');
            break;
        case localObj.getConstant('UPPERCASE'):
            documentEditor.editorModule.changeCase('Uppercase');
            break;
        case localObj.getConstant('Lowercase'):
            documentEditor.editorModule.changeCase('Lowercase');
            break;
        case localObj.getConstant('CapitalizeEachWord'):
            documentEditor.editorModule.changeCase('CapitalizeEachWord');
            break;
        case localObj.getConstant('ToggleCase'):
            documentEditor.editorModule.changeCase('ToggleCase');
            break;
        }
        documentEditor.focusIn();
    }

    /**
     * Change font family
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} fontFamily - Font family to apply
     * @returns {void}
     */
    public static changeFontFamily(documentEditor: DocumentEditor, fontFamily: string): void {
        if (!documentEditor.isReadOnly && documentEditor.selection) {
            documentEditor.selection.characterFormat.fontFamily = fontFamily;
        }
    }

    /**
     * Change font size
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string | number} fontSize - Font size to apply
     * @returns {void}
     */
    public static changeFontSize(documentEditor: DocumentEditor, fontSize: string | number): void {
        if (!documentEditor.isReadOnly && documentEditor.selection) {
            documentEditor.selection.characterFormat.fontSize = typeof fontSize === 'string' ?
                parseInt(fontSize, 10) : fontSize;
        }
    }

    /**
     * Change font color
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} color - Color to apply
     * @returns {void}
     */
    public static changeFontColor(documentEditor: DocumentEditor, color: string): void {
        if (!documentEditor.isReadOnly && documentEditor.selection) {
            documentEditor.selection.characterFormat.fontColor = color;
        }
    }
    /**
     * Update toggle button state
     * @param {HTMLElement} button - Button element
     * @param {boolean} isActive - Whether the button should be active
     * @returns {void}
     */
    public static updateToggleButtonState(button: HTMLElement, isActive: boolean): void {
        if (button) {
            if (isActive) {
                button.classList.add('e-active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('e-active');
                button.setAttribute('aria-pressed', 'false');
            }
        }
    }

    /**
     * Get font size items
     * @returns {string[]} Array of font size items
     */
    public static getFontSizeItems(): string[] {
        return ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'];
    }

    /**
     * Get change case items
     * @param {L10n} localObj - Localization object
     * @param {string} commonId - Common ID for localization
     * @returns {ItemModel[]} Array of change case items
     */
    public static getChangeCaseItems(localObj: L10n, commonId: string): ItemModel[] {
        return [
            { text: localObj.getConstant('SentenceCase'), id: commonId + '_sentencecase' },
            { text: localObj.getConstant('UPPERCASE'), id: commonId + '_uppercase' },
            { text: localObj.getConstant('Lowercase'), id: commonId + '_lowercase' },
            { text: localObj.getConstant('CapitalizeEachWord'), id: commonId + '_capitalizeEachWord' },
            { text: localObj.getConstant('ToggleCase'), id: commonId + '_togglecase' }
        ];
    }

    /**
     * Increase font size
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {void}
     */
    public static increaseFontSize(documentEditor: DocumentEditor): void {
        if (!documentEditor.isReadOnlyMode || documentEditor.selection.isInlineFormFillMode()) {
            documentEditor.editor.onApplyCharacterFormat('fontSize', 'increment', true);
        }
    }

    /**
     * Decrease font size
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @returns {void}
     */
    public static decreaseFontSize(documentEditor: DocumentEditor): void {
        if (!documentEditor.isReadOnlyMode || documentEditor.selection.isInlineFormFillMode()) {
            documentEditor.editor.onApplyCharacterFormat('fontSize', 'decrement', true);
        }
    }
}
