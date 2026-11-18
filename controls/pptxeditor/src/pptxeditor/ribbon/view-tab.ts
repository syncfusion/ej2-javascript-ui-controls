/**
 * View tab model builders for the editor ribbon.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon/view-tab
 */

import {
    RibbonItemModel,
    RibbonGroupModel,
    RibbonTabModel,
    RibbonItemType,
    RibbonItemSize
} from '@syncfusion/ej2-ribbon';
import {
    RibbonGroupId,
    RibbonItemId,
    RibbonTabId,
    RibbonHost
} from './types';
import { localize } from '../localization/localization';

/**
 * ROADMAP zoom percentage presets for the View Zoom ComboBox.
 */
export const VIEW_ZOOM_PRESETS: number[] = [
    25, 50, 75, 100, 125, 150, 200, 400
];

/**
 * Formats a zoom percentage for ComboBox display.
 *
 * @param {number} percent - Zoom percentage
 * @returns {string} Label such as `100%`
 */
export function formatZoomPercentLabel(percent: number): string {
    return String(percent) + '%';
}

/**
 * Parses a zoom percentage from ComboBox value or text input.
 *
 * @param {unknown} raw - ComboBox value or typed text
 * @returns {number|null} Parsed number, or null when empty/invalid
 */
export function parseZoomPercentInput(raw: unknown): number | null {
    if (typeof raw === 'number') {
        if (!Number.isFinite(raw)) {
            return null;
        }
        return raw;
    }
    if (typeof raw !== 'string') {
        return null;
    }
    const trimmed: string = raw.trim();
    if (trimmed.length === 0) {
        return null;
    }
    const withoutPercent: string =
    trimmed.charAt(trimmed.length - 1) === '%'
        ? trimmed.slice(0, trimmed.length - 1).trim()
        : trimmed;
    if (withoutPercent.length === 0) {
        return null;
    }
    const parsed: number = Number(withoutPercent);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    return parsed;
}

/**
 * Builds a View button item with label, icon, tooltip, and host click.
 *
 * @param {string} id - Stable item id
 * @param {string} content - Button label
 * @param {string} iconCss - Icon classes
 * @param {string} tooltip - Tooltip text
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Initial disabled state
 * @returns {RibbonItemModel} Ribbon item model
 */
function viewButtonItem(
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

/** Zoom drop-down entry ids (stable for tests / customization). */
export const ZOOM_MENU_ID: { Dialog: string; FitWindow: string; FitWidth: string; } = {
    Dialog: 'pptx-ribbon-zoom-menu-dialog',
    FitWindow: 'pptx-ribbon-zoom-menu-fit-window',
    FitWidth: 'pptx-ribbon-zoom-menu-fit-width'
};

/**
 * Builds the Show group: Notes and Thumbnails toggles.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonGroupModel} Group model
 */
export function buildShowGroup(host: RibbonHost): RibbonGroupModel {
    const thumbsVisible: boolean =
    typeof host.isThumbnailPanelVisible === 'function'
        ? host.isThumbnailPanelVisible() === true
        : true;
    const notesVisible: boolean = host.notesPaneVisible === true;
    const toggle: (id: string, text: string, icon: string, tip: string, on: boolean, run: () => void) => RibbonItemModel =
        (id: string, text: string, icon: string, tip: string, on: boolean, run: () => void): RibbonItemModel => {
            const item: RibbonItemModel = viewButtonItem(id, text, icon, tip, run, false);
            if (item.buttonSettings) {
                item.buttonSettings.isToggle = true;
                item.buttonSettings.cssClass = on ? 'e-active' : '';
            }
            return item;
        };
    return {
        id: RibbonGroupId.Show,
        header: localize(host.locale, 'Show'),
        isCollapsible: true,
        collections: [
            {
                items: [
                    toggle(
                        RibbonItemId.ShowNotes,
                        localize(host.locale, 'Notes'),
                        'e-icons e-ribbon-icon-pptx pptx-icon-notes',
                        localize(host.locale, notesVisible ? 'HideNotes' : 'ShowNotes'),
                        notesVisible,
                        (): void => {
                            if (typeof host.toggleNotesPane === 'function') {
                                host.toggleNotesPane();
                            }
                        }
                    )
                ]
            },
            {
                items: [
                    toggle(
                        RibbonItemId.ShowThumbnails,
                        localize(host.locale, 'Thumbnails'),
                        'e-icons e-ribbon-icon-pptx pptx-icon-thumbnails',
                        localize(host.locale, thumbsVisible ? 'HideThumbnails' : 'ShowThumbnails'),
                        thumbsVisible,
                        (): void => {
                            const visible: boolean =
                                typeof host.isThumbnailPanelVisible === 'function'
                                    ? host.isThumbnailPanelVisible() === true
                                    : true;
                            if (typeof host.setThumbnailPanelVisible === 'function') {
                                host.setThumbnailPanelVisible(!visible);
                            } else if (typeof host.announce === 'function') {
                                host.announce(localize(host.locale, 'ThumbnailPanelUnavailable'));
                            }
                        }
                    )
                ]
            }
        ]
    };
}

/**
 * Builds the Zoom group: a Zoom drop-down (presets + dialog) and Fit to Window.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonGroupModel} Group model
 */
export function buildZoomGroup(host: RibbonHost): RibbonGroupModel {
    const items: { id: string; text: string; }[] = [
        { id: ZOOM_MENU_ID.FitWindow, text: localize(host.locale, 'FitToWindow') },
        { id: ZOOM_MENU_ID.FitWidth, text: localize(host.locale, 'FitToWidth') },
        { id: 'pptx-ribbon-zoom-menu-200', text: '200%' },
        { id: 'pptx-ribbon-zoom-menu-150', text: '150%' },
        { id: 'pptx-ribbon-zoom-menu-100', text: '100%' },
        { id: 'pptx-ribbon-zoom-menu-75', text: '75%' },
        { id: 'pptx-ribbon-zoom-menu-50', text: '50%' },
        { id: ZOOM_MENU_ID.Dialog, text: localize(host.locale, 'ZoomEllipsis') }
    ];
    // Slides load in fit-to-window mode, so the button starts in the pressed state.
    const fitWindowItem: RibbonItemModel = viewButtonItem(
        RibbonItemId.FitWindow,
        localize(host.locale, 'FitToWindowTitle'),
        'e-icons e-ribbon-icon-pptx pptx-icon-fit-window',
        localize(host.locale, 'FitToWindowTitle'),
        (): void => {
            host.fitToWindow();
        },
        false
    );
    if (fitWindowItem.buttonSettings && host.isFitToWindowActive !== false) {
        fitWindowItem.buttonSettings.cssClass = 'e-active';
    }
    return {
        id: RibbonGroupId.Zoom,
        header: localize(host.locale, 'Zoom'),
        isCollapsible: true,
        collections: [
            {
                items: [
                    {
                        id: RibbonItemId.ZoomDropdown,
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
                        dropDownSettings: {
                            content: localize(host.locale, 'Zoom'),
                            iconCss: 'e-icons e-ribbon-icon-pptx pptx-icon-zoom',
                            items,
                            select: (args: { item?: { id?: string; text?: string; } }): void => {
                                const id: string = args && args.item && args.item.id ? args.item.id : '';
                                const text: string = args && args.item && args.item.text ? args.item.text : '';
                                if (id === ZOOM_MENU_ID.Dialog) {
                                    if (typeof host.openZoomDialog === 'function') {
                                        host.openZoomDialog();
                                    }
                                } else if (id === ZOOM_MENU_ID.FitWindow) {
                                    host.fitToWindow();
                                } else if (id === ZOOM_MENU_ID.FitWidth) {
                                    host.fitWidth();
                                } else {
                                    const parsed: number | null = parseZoomPercentInput(text);
                                    if (parsed !== null) {
                                        host.setZoom(parsed);
                                    }
                                }
                            }
                        },
                        ribbonTooltipSettings: { title: localize(host.locale, 'Zoom') }
                    }
                ]
            },
            {
                items: [
                    fitWindowItem
                ]
            }
        ]
    };
}

/**
 * Builds the complete View tab (Show, Zoom).
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonTabModel} Tab model
 */
export function buildViewTab(host: RibbonHost): RibbonTabModel {
    return {
        id: RibbonTabId.View,
        header: localize(host.locale, 'View'),
        groups: [
            buildShowGroup(host),
            buildZoomGroup(host)
        ]
    };
}
