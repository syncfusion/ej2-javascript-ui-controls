/**
 * Home tab model builders for the editor ribbon.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon/home-tab
 */

import {
    RibbonItemModel,
    RibbonGroupModel,
    RibbonTabModel,
    RibbonItemType,
    RibbonItemSize,
    ItemOrientation,
    DisplayMode
} from '@syncfusion/ej2-ribbon';
import {
    RibbonGroupId,
    RibbonItemId,
    RibbonTabId,
    RibbonHost
} from './types';
import { localize } from '../localization/localization';

/** Font families offered by the read-only Font group display. */
export const HOME_FONT_FAMILIES: string[] = [
    'Segoe UI', 'Arial', 'Calibri', 'Cambria', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'
];

/** Font sizes offered by the read-only Font group display. */
export const HOME_FONT_SIZES: string[] = [
    '8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '44', '54', '72'
];

/**
 * Builds a Home button item.
 *
 * @param {string} id - Stable item id
 * @param {string} content - Button label
 * @param {string} iconCss - Icon classes
 * @param {string} tooltip - Tooltip including keyboard shortcut hint
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Initial disabled state
 * @returns {RibbonItemModel} Ribbon item model
 */
function homeButtonItem(
    id: string,
    content: string,
    iconCss: string,
    tooltip: string,
    onClick: () => void,
    disabled: boolean = false
): RibbonItemModel {
    return {
        id,
        type: RibbonItemType.Button,
        allowedSizes: RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
        disabled,
        buttonSettings: {
            content,
            iconCss,
            clicked: (): void => {
                onClick();
            }
        },
        ribbonTooltipSettings: {
            title: tooltip
        }
    };
}

/**
 * Builds a read-only combo box that only displays the current font value.
 *
 * @param {string} id - Item id
 * @param {string[]} data - Offered values
 * @param {string} value - Displayed value
 * @param {string} width - CSS width
 * @param {string} label - Accessible label
 * @returns {RibbonItemModel} Ribbon item model
 */
function fontComboItem(
    id: string,
    data: string[],
    value: string,
    width: string,
    label: string
): RibbonItemModel {
    return {
        id,
        type: RibbonItemType.ComboBox,
        allowedSizes: RibbonItemSize.Medium,
        comboBoxSettings: {
            dataSource: data,
            value,
            width,
            allowFiltering: false,
            showClearButton: false,
            cssClass: 'ej2-pptx-ribbon-font-combo',
            // Status indicator only: never open the list or accept a change.
            beforeOpen: (args: { cancel?: boolean }): void => {
                args.cancel = true;
            },
            // `readonly` (not just aria) stops typing and the drop-down; the value is
            // driven only by the slide text selection (status indicator). `tabindex=-1`
            // keeps it out of the tab order so no text caret ever shows in it.
            htmlAttributes: { 'aria-label': label, 'aria-readonly': 'true', readonly: 'true', tabindex: '-1' }
        }
    };
}

/**
 * Builds a read-only character-format indicator button (B / I / U / S).
 *
 * @param {string} id - Item id
 * @param {string} content - Glyph label
 * @param {string} tooltip - Tooltip / aria label
 * @param {string} cssClass - Format modifier class
 * @param {boolean} pressed - Whether the format is shown as active
 * @returns {RibbonItemModel} Ribbon item model
 */
function fontFormatItem(
    id: string,
    content: string,
    tooltip: string,
    cssClass: string,
    pressed: boolean
): RibbonItemModel {
    return {
        id,
        type: RibbonItemType.Button,
        allowedSizes: RibbonItemSize.Small,
        buttonSettings: {
            content,
            cssClass: 'ej2-pptx-ribbon-format ' + cssClass + (pressed ? ' ej2-pptx-ribbon-format--on' : ''),
            htmlAttributes: {
                'aria-label': tooltip,
                'aria-pressed': pressed ? 'true' : 'false',
                'aria-readonly': 'true',
                tabindex: '-1'
            }
        },
        ribbonTooltipSettings: { title: tooltip }
    };
}

/**
 * Builds the Clipboard group (Copy).
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonGroupModel} Group model
 */
export function buildClipboardGroup(host: RibbonHost): RibbonGroupModel {
    const copyDisabled: boolean = host.enableCopy === false;
    return {
        id: RibbonGroupId.Clipboard,
        header: localize(host.locale, 'Clipboard'),
        isCollapsible: true,
        collections: [
            {
                items: [
                    homeButtonItem(
                        RibbonItemId.Copy,
                        localize(host.locale, 'Copy'),
                        'e-icons e-copy',
                        localize(host.locale, 'CopyTooltip'),
                        (): void => {
                            host.copySelection();
                        },
                        copyDisabled
                    )
                ]
            }
        ]
    };
}

/**
 * Builds the read-only Font group: family, size, B / I / U / S indicators and
 * the "Read-only" lock label (simplified layout only). The controls are status
 * indicators only; the ribbon fills them from the selected slide text.
 *
 * @param {RibbonHost} [host] - Editor ribbon host (supplies the locale)
 * @returns {RibbonGroupModel} Group model
 */
export function buildFontGroup(host?: RibbonHost): RibbonGroupModel {
    const locale: string | undefined = host ? host.locale : undefined;
    const readOnly: RibbonItemModel = {
        id: RibbonItemId.FontReadOnly,
        type: RibbonItemType.Button,
        allowedSizes: RibbonItemSize.Small,
        displayOptions: DisplayMode.Simplified,
        disabled: true,
        buttonSettings: { content: localize(locale, 'ReadOnly'), iconCss: 'e-icons e-lock' }
    };
    return {
        id: RibbonGroupId.Font,
        // Classic shows the group header (lock + label) under the rows; the header is HTML.
        header: '<span class="e-icons e-lock ej2-pptx-ribbon-group-lock" aria-hidden="true"></span>' +
            localize(locale, 'FontReadOnly'),
        isCollapsible: true,
        orientation: ItemOrientation.Row,
        collections: [
            {
                items: [
                    fontComboItem(RibbonItemId.FontFamily, HOME_FONT_FAMILIES, '', '150px', 'Font family'),
                    fontComboItem(RibbonItemId.FontSize, HOME_FONT_SIZES, '', '64px', 'Font size')
                ]
            },
            {
                items: [
                    fontFormatItem(RibbonItemId.FontBold, 'B', localize(locale, 'Bold'), 'ej2-pptx-ribbon-format--b', false),
                    fontFormatItem(RibbonItemId.FontItalic, 'I', localize(locale, 'Italic'), 'ej2-pptx-ribbon-format--i', false),
                    fontFormatItem(RibbonItemId.FontUnderline, 'U', localize(locale, 'Underline'), 'ej2-pptx-ribbon-format--u', false),
                    fontFormatItem(RibbonItemId.FontStrikethrough, 'S', localize(locale, 'Strikethrough'), 'ej2-pptx-ribbon-format--s', false),
                    readOnly
                ]
            }
        ]
    };
}

/**
 * Builds the complete Home tab model.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonTabModel} Tab model
 */
export function buildHomeTab(host: RibbonHost): RibbonTabModel {
    return {
        id: RibbonTabId.Home,
        header: localize(host.locale, 'Home'),
        groups: [
            buildClipboardGroup(host),
            buildFontGroup(host)
        ]
    };
}
