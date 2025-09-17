// src/document-editor-container/helper/borders-helper.ts
import { DocumentEditor, BorderSettings, BorderType, LineStyle } from '../../document-editor/index';
import { L10n, createElement } from '@syncfusion/ej2-base';

/**
 * Helper class for border operations in Document Editor
 * @private
 */
export class BordersHelper {
    /**
     * Get border settings based on border type and properties
     * @param {BorderType} borderType - The type of border to apply
     * @param {string} borderColor - The color of the border
     * @param {string | number} borderWidth - The width of the border
     * @returns {BorderSettings} BorderSettings object for the specified border type
     */
    public static getBorderSettings(borderType: BorderType, borderColor: string, borderWidth: string | number): BorderSettings {
        const lineWidth: number = typeof borderWidth === 'string' ?
            ((borderWidth === 'No Border' || borderWidth === '0') ? 0 : parseFloat(borderWidth)) :
            borderWidth;

        const lineStyle: LineStyle = (lineWidth === 0) ? 'Cleared' : 'Single';

        const borderSettings: BorderSettings = {
            type: borderType,
            borderColor: borderColor,
            lineWidth: lineWidth,
            borderStyle: lineStyle
        };

        return borderSettings;
    }

    /**
     * Apply border to the document
     * @param {DocumentEditor} documentEditor - Document editor instance
     * @param {BorderType} borderType - The type of border to apply
     * @param {string} borderColor - The color of the border
     * @param {string | number} borderWidth - The width of the border
     * @returns {void}
     */
    public static applyBorder(documentEditor: DocumentEditor, borderType: BorderType,
                              borderColor: string, borderWidth: string | number): void {
        const borderSettings: BorderSettings = BordersHelper.getBorderSettings(borderType, borderColor, borderWidth);
        documentEditor.editorModule.applyBorders(borderSettings);
    }

    /**
     * Gets the border type based on the localized text
     * @param {string} text The localized text of the border type
     * @param {L10n} localObj The localization object
     * @returns {BorderType} The border type
     */
    public static getBorderType(text: string, localObj: L10n): BorderType {
        switch (text) {
        case localObj.getConstant('All Borders'):
            return 'AllBorders';
        case localObj.getConstant('No Border'):
            return 'NoBorder';
        case localObj.getConstant('Outside Borders'):
            return 'OutsideBorders';
        case localObj.getConstant('Inside Borders'):
            return 'InsideBorders';
        case localObj.getConstant('Top Border'):
            return 'TopBorder';
        case localObj.getConstant('Bottom Border'):
            return 'BottomBorder';
        case localObj.getConstant('Left Border'):
            return 'LeftBorder';
        case localObj.getConstant('Right Border'):
            return 'RightBorder';
        case localObj.getConstant('Inside Horizontal Border'):
            return 'InsideHorizontalBorder';
        case localObj.getConstant('Inside Vertical Border'):
            return 'InsideVerticalBorder';
        default:
            return 'NoBorder';
        }
    }

    /**
     * Creates a dropdown option for border width
     * @param {HTMLElement} ulTag - The ul element to append the option to
     * @param {string} text - The text for the option
     * @param {L10n} localObj - Localization object
     * @returns {HTMLElement} The created li element
     */
    public static createBorderWidthOption(ulTag: HTMLElement, text: string, localObj: L10n): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items e-de-list-item-size'
        });
        ulTag.appendChild(liTag);

        let innerHTML: string;
        if (text === localObj.getConstant('No Border')) {
            innerHTML = '<div>' + text + '</div>';
        } else if (text === '1.5px') {
            innerHTML = '<div>' + text + '<span class="e-de-list-line e-de-border-width" style="margin-left:10px;border-bottom-width:' +
                text + ';"></span></div>';
        } else {
            innerHTML = '<div>' + text + '<span class="e-de-list-line e-de-border-width" style="margin-left:20px;border-bottom-width:' +
                text + ';"></span></div>';
        }

        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);

        return liTag;
    }

    /**
     * Get border width items
     * @param {L10n} localObj - Localization object
     * @returns {string[]} Array of border width items
     */
    public static getBorderWidthItems(localObj: L10n): string[] {
        const pixel: string = localObj.getConstant('px');
        return [
            localObj.getConstant('No Border'),
            '.25' + pixel,
            '.5' + pixel,
            '.75' + pixel,
            '1' + pixel,
            '1.5' + pixel,
            '2' + pixel,
            '3' + pixel,
            '4' + pixel,
            '5' + pixel,
            '6' + pixel
        ];
    }

    /**
     * Get border dropdown items
     * @param {L10n} localObj - Localization object
     * @param {commonId} commonId - Common ID for dropdown items}
     * @returns {Array<{text: string, id: string, iconCss: string}>} Array of border dropdown items
     */
    public static getBorderDropdownItems(localObj: L10n, commonId: string): Array<{ text: string, id: string, iconCss: string }> {
        return [
            { text: localObj.getConstant('No Border'), id: commonId + '_no_border', iconCss: 'e-icons e-de-ctnr-border-none' },
            { text: localObj.getConstant('All Borders'), id: commonId + '_all_borders', iconCss: 'e-icons e-de-ctnr-allborders' },
            { text: localObj.getConstant('Outside Borders'), id: commonId + '_outside_borders', iconCss: 'e-icons e-de-ctnr-outsideborder' },
            { text: localObj.getConstant('Inside Borders'), id: commonId + '_inside_borders', iconCss: 'e-icons e-de-ctnr-insideborders' },
            { text: localObj.getConstant('Top Border'), id: commonId + '_top_border', iconCss: 'e-icons e-de-ctnr-topborder' },
            { text: localObj.getConstant('Bottom Border'), id: commonId + '_bottom_border', iconCss: 'e-icons e-de-ctnr-bottomborder' },
            { text: localObj.getConstant('Left Border'), id: commonId + '_left_border', iconCss: 'e-icons e-de-ctnr-leftborders' },
            { text: localObj.getConstant('Right Border'), id: commonId + '_right_border', iconCss: 'e-icons e-de-ctnr-rightborder' },
            { text: localObj.getConstant('Inside Horizontal Border'), id: commonId + '_inside_horizontal_border', iconCss: 'e-icons e-de-ctnr-insidehorizondalborder' },
            { text: localObj.getConstant('Inside Vertical Border'), id: commonId + '_inside_vertical_border', iconCss: 'e-icons e-de-ctnr-insideverticalborder' }
        ];
    }
}
