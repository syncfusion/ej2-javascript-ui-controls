/**
 * Slideshow tab model builders for the editor ribbon.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon/slideshow-tab
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
import { applyMobileIconOnly } from './home-tab';

/**
 * Builds a Slideshow button item with label, icon, tooltip (incl. shortcut), and host click.
 *
 * @param {string} id - Stable item id
 * @param {string} content - Button label
 * @param {string} iconCss - Icon classes
 * @param {string} tooltip - Tooltip including keyboard shortcut hint
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Initial disabled state
 * @returns {RibbonItemModel} Ribbon item model
 */
function slideshowButtonItem(
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
 * Builds the "Start Slide Show" group (From Beginning, From Current Slide).
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonGroupModel} Group model
 */
export function buildStartSlideShowGroup(host: RibbonHost): RibbonGroupModel {
    const startDisabled: boolean = host.canStartSlideShow !== true;
    return {
        id: RibbonGroupId.StartSlideShow,
        header: localize(host.locale, 'StartSlideShowGroup'),
        isCollapsible: true,
        collections: [
            {
                items: [
                    slideshowButtonItem(
                        RibbonItemId.StartFromBeginning,
                        localize(host.locale, 'FromBeginning'),
                        'e-icons e-ribbon-icon-pptx pptx-icon-play',
                        localize(host.locale, 'StartFromBeginningTooltip'),
                        (): void => {
                            host.startSlideShowFromBeginning();
                        },
                        startDisabled
                    )
                ]
            },
            {
                items: [
                    slideshowButtonItem(
                        RibbonItemId.StartFromCurrent,
                        localize(host.locale, 'FromCurrentSlide'),
                        'e-icons e-ribbon-icon-pptx pptx-icon-play-current',
                        localize(host.locale, 'FromCurrentSlideTooltip'),
                        (): void => {
                            host.startSlideShowFromCurrent();
                        },
                        startDisabled
                    )
                ]
            }
        ]
    };
}

/**
 * Builds the "Presenter" group (Presenter View).
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonGroupModel} Group model
 */
export function buildPresenterGroup(host: RibbonHost): RibbonGroupModel {
    return {
        id: RibbonGroupId.Presenter,
        header: localize(host.locale, 'Presenter'),
        isCollapsible: true,
        collections: [
            {
                items: [
                    slideshowButtonItem(
                        RibbonItemId.PresenterView,
                        localize(host.locale, 'PresenterView'),
                        'e-icons e-ribbon-icon-pptx pptx-icon-presenter',
                        localize(host.locale, 'PresenterView'),
                        (): void => {
                            host.startPresenterView();
                        },
                        false
                    )
                ]
            }
        ]
    };
}

/**
 * Builds the complete Slide Show tab with all groups.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {RibbonTabModel} Tab model
 */
export function buildSlideshowTab(host: RibbonHost): RibbonTabModel {
    return applyMobileIconOnly({
        id: RibbonTabId.SlideShow,
        header: localize(host.locale, 'SlideShow'),
        groups: [buildStartSlideShowGroup(host), buildPresenterGroup(host)]
    }, host);
}
