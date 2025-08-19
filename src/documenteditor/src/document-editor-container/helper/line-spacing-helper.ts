import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor/index';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';

/**
 * Helper class for line spacing operations in Document Editor
 * @private
 */
export class LineSpacingHelper {
    /**
     * Get line spacing items for dropdown
     *
     * @param {L10n} localObj - Localization object
     * @returns {ItemModel[]} Array of line spacing items
     */
    public static getLineSpacingItems(localObj: L10n): ItemModel[] {
        return [
            { text: localObj.getConstant('Single') },
            { text: '1.15' },
            { text: '1.5' },
            { text: localObj.getConstant('Double') }
        ];
    }

    /**
     * Apply line spacing to the document
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {string} text - Selected line spacing text
     * @param {Object} appliedLineSpacing - Reference to store the applied line spacing
     * @param {string} appliedLineSpacing.value - The value to store the applied line spacing
     * @param {L10n} localObj - Localization object
     * @returns {void}
     */
    public static applyLineSpacing(documentEditor: DocumentEditor, text: string,
                                   appliedLineSpacing: { value: string }, localObj: L10n): void {
        if (!documentEditor.isReadOnly && documentEditor.selection) {
            let lineSpacing: number = 0;

            switch (text) {
            case localObj.getConstant('Single'):
                lineSpacing = 1;
                appliedLineSpacing.value = localObj.getConstant('Single');
                break;
            case '1.15':
                lineSpacing = 1.15;
                appliedLineSpacing.value = '1.15';
                break;
            case '1.5':
                lineSpacing = 1.5;
                appliedLineSpacing.value = '1.5';
                break;
            case localObj.getConstant('Double'):
                lineSpacing = 2;
                appliedLineSpacing.value = localObj.getConstant('Double');
                break;
            }

            if (lineSpacing > 0) {
                documentEditor.selection.paragraphFormat.lineSpacing = lineSpacing;
            }

            setTimeout((): void => {
                documentEditor.focusIn();
            }, 30);
        }
    }

    /**
     * Get the current line spacing value from document
     *
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {L10n} localObj - Localization object
     * @returns {string} The current line spacing text
     */
    public static getCurrentLineSpacing(documentEditor: DocumentEditor, localObj: L10n): string {
        const lineSpacing: number = documentEditor.selection.paragraphFormat.lineSpacing;

        if (lineSpacing === 1) {
            return localObj.getConstant('Single');
        } else if (lineSpacing === 1.15) {
            return '1.15';
        } else if (lineSpacing === 1.5) {
            return '1.5';
        } else if (lineSpacing === 2) {
            return localObj.getConstant('Double');
        } else {
            return '';
        }
    }

    /**
     * Customize the line spacing dropdown item rendering
     *
     * @param {MenuEventArgs} args - Menu event arguments
     * @param {string} appliedLineSpacing - Currently applied line spacing
     * @returns {void}
     */
    public static customizeLineSpacingItem(args: MenuEventArgs, appliedLineSpacing: string): void {
        args.element.innerHTML = '<span></span>' + args.item.text;
        const span: HTMLElement = args.element.children[0] as HTMLElement;

        if (args.item.text === appliedLineSpacing) {
            span.style.marginRight = '10px';
            span.setAttribute('class', 'e-de-selected-item e-icons e-de-linespacing');
        } else {
            span.style.marginRight = '25px';
            span.classList.remove('e-de-selected-item');
        }
    }
}
