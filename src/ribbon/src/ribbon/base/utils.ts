import { compile, getComponent, select, addClass } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { RibbonTabModel, RibbonGroupModel, RibbonCollectionModel, RibbonItemModel, RibbonTooltipModel } from '../models/index';
import { commonProperties, DisplayMode, EJ2Control, itemProps, RibbonLayout, ribbonTooltipData, RibbonItemType } from './interface';
import { Ribbon } from './ribbon';
import * as constants from './constant';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';


/**
 * Gets index value.
 *
 * @param {Array} arr - Gets the array to find index.
 * @param {boolean} condition - Defines whether index matches with the value.
 * @returns {number} - Gets the index value.
 * @hidden
 */
export function getIndex<T>(arr: Array<T>, condition: (value: T, index: number) => boolean): number {
    for (let i: number = 0; i < arr.length; i++) {
        if (condition(arr[parseInt(i.toString(), 10)
        ], i)) { return i; }
    }
    return -1;
}
/**
 * Gets template content based on the template property value.
 *
 * @param {string | HTMLElement| Function} template - Template property value.
 * @returns {Function} - Return template function.
 * @hidden
 */
export function getTemplateFunction(template: string | HTMLElement | Function): Function {
    if (typeof template === 'string') {
        let content: string = '';
        try {
            const tempEle: HTMLElement = select(template);
            if (tempEle) {
                //Return innerHTML incase of jsrenderer script else outerHTML
                content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
            } else {
                content = template;
            }
        } catch (e) {
            content = template;
        }
        return compile(content);
    } else {
        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        return compile(template as any);
    }
}

/**
 * Gets the ribbon item
 *
 * @param {RibbonTabModel} tabs - Gets the ribbon tab model.
 * @param {string} id - Gets the ID of the tab.
 * @param {RibbonItemType} type - Gets the type of the item.
 * @returns {itemProps} - Gets the ribbon item.
 * @hidden
 */
export function getItem(tabs: RibbonTabModel[], id: string, type?: RibbonItemType): itemProps {
    for (let i: number = 0; i < tabs.length; i++) {
        const tab: RibbonTabModel = tabs[parseInt(i.toString(), 10)];
        for (let j: number = 0; j < tab.groups.length; j++) {
            const group: RibbonGroupModel = tab.groups[parseInt(j.toString(), 10)];
            for (let k: number = 0; k < group.collections.length; k++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                for (let l: number = 0; l < collection.items.length; l++) {
                    const item: RibbonItemModel = collection.items[parseInt(l.toString(), 10)];
                    if ((id && item.id === id) || (type && item.type === type)) {
                        return {
                            item: item, collection: collection, group: group,
                            tabIndex: i, groupIndex: j, collectionIndex: k, itemIndex: l
                        };
                    }
                }
            }
        }
    }
    return null;
}

/**
 * Gets the ribbon collection.
 *
 * @param {RibbonTabModel} tabs - Gets the ribbon tab model.
 * @param {string} id - Gets the ID of the tab.
 * @returns {itemProps} - Gets the ribbon collection.
 * @hidden
 */
export function getCollection(tabs: RibbonTabModel[], id: string): itemProps {
    for (let i: number = 0; i < tabs.length; i++) {
        const tab: RibbonTabModel = tabs[parseInt(i.toString(), 10)];
        for (let j: number = 0; j < tab.groups.length; j++) {
            const group: RibbonGroupModel = tab.groups[parseInt(j.toString(), 10)];
            for (let k: number = 0; k < group.collections.length; k++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                if (collection.id === id) {
                    return {
                        collection: collection, group: group,
                        tabIndex: i, groupIndex: j, collectionIndex: k
                    };
                }
            }
        }
    }
    return null;
}

/**
 * Gets the ribbon group.
 *
 * @param {RibbonTabModel} tabs - Gets the ribbon tab model.
 * @param {string} id - Gets the ID of the tab.
 * @returns {itemProps} - Gets the ribbon group.
 * @hidden
 */
export function getGroup(tabs: RibbonTabModel[], id: string): itemProps {
    for (let i: number = 0; i < tabs.length; i++) {
        const tab: RibbonTabModel = tabs[parseInt(i.toString(), 10)];
        for (let j: number = 0; j < tab.groups.length; j++) {
            const group: RibbonGroupModel = tab.groups[parseInt(j.toString(), 10)];
            if (group.id === id) {
                return {
                    group: group, tabIndex: i, groupIndex: j
                };
            }
        }
    }
    return null;
}

/**
 * @param {HTMLElement} element - Gets the element to be destroyed.
 * @param {string} moduleName - Gets the module name.
 * @returns {void}
 * @hidden
 */
export function destroyControl(element: HTMLElement, moduleName: string): void {
    const control: EJ2Control = getComponent(element, moduleName);
    control.destroy();
}

/**
 * Updates common properties.
 *
 * @param {HTMLElement} element - Gets the element to be updated.
 * @param {string} moduleName - Gets the module name.
 * @param {commonProperties} commonProp - Gets the common properties to be updated.
 * @returns {void}
 * @hidden
 */
export function updateCommonProperty(element: HTMLElement, moduleName: string, commonProp: commonProperties): void {
    const control: EJ2Control = getComponent(element, moduleName);
    control.setProperties(commonProp);
}

/**
 * Updates disabled control.
 *
 * @param {HTMLElement} element - Gets the element to be disabled.
 * @param {string} moduleName - Gets the module name.
 * @param {boolean} disable - Defines whether the control to be disabled or not.
 * @returns {void}
 * @hidden
 */
export function updateControlDisabled(element: HTMLElement, moduleName: string, disable: boolean): void {
    const control: EJ2Control = getComponent(element, moduleName);
    control.setProperties(moduleName === 'combobox' ? { enabled: !disable } : { disabled: disable });
}

/**
 * Gets the ribbon item element.
 *
 * @param {Ribbon} parent - Gets the parent element.
 * @param {string} id - Gets the ID of the item.
 * @param {itemProps} itemProp - Gets the ribbon item.
 * @returns {HTMLElement} - Gets the ribbon item element.
 * @hidden
 */
export function getItemElement(parent: Ribbon, id: string, itemProp?: itemProps): HTMLElement {
    if (!itemProp) {
        itemProp = getItem(parent.tabs, id);
        if (!itemProp) { return null; }
    }
    let contentEle: HTMLElement = parent.tabObj.items[itemProp.tabIndex].content as HTMLElement;
    if (contentEle.innerHTML === '') { return null; }
    if (parent.activeLayout === RibbonLayout.Classic) {
        if (itemProp.item.displayOptions & DisplayMode.Classic) {
            contentEle = (itemProp.group.isCollapsed) ? parent.ribbonDropDownModule.getOverflowDropDownPopup(itemProp, contentEle)
                : contentEle;
            return contentEle.querySelector('#' + id);
        }
        else { return null; }
    } else {
        //Checks for Simplified and Auto options (Auto = classic + simplified + popup)
        let ele: HTMLElement = (itemProp.item.displayOptions & DisplayMode.Simplified) ?
            contentEle.querySelector('#' + itemProp.item.id) : null;
        // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
        if (!ele){
            const dropdown: DropDownButton = itemProp.group.enableGroupOverflow ?
                getComponent(contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) as HTMLElement, DropDownButton)
                : parent.overflowDDB;
            ele = (dropdown.target as HTMLElement).querySelector('#' + itemProp.item.id);
        }
        return ele;
    }
}

/**
 * @param {RibbonTooltipModel} tooltip - Gets the property of tooltip.
 * @returns {boolean} - Gets whether the tooltip is present or not.
 * @hidden
 */
export function isTooltipPresent(tooltip: RibbonTooltipModel): boolean {
    return (tooltip.content || tooltip.iconCss || tooltip.title || tooltip.id || tooltip.cssClass) ? true : false;
}

/**
 * Sets content for tooltip.
 *
 * @param {TooltipEventArgs} args - Gets the argument of tooltip.
 * @param {Tooltip} tooltip - Gets the tooltip to set the content.
 * @param {ribbonTooltipData} tooltipData - Gets the tooltip data.
 * @returns {void}
 * @hidden
 */
export function setToolTipContent(args: TooltipEventArgs, tooltip: Tooltip, tooltipData: ribbonTooltipData[]): void {
    const targetId: string = args.target.getAttribute('id');
    const dataObj: ribbonTooltipData = tooltipData.filter((e: ribbonTooltipData) => e.id === targetId)[0];
    const data: RibbonTooltipModel = dataObj.data;
    const content: HTMLElement = tooltip.createElement('div', {
        id: data.id ? constants.RIBBON_TOOLTIP_CONTAINER + '_' + data.id : constants.RIBBON_TOOLTIP_CONTAINER
    });
    tooltip.element.append(content);
    if (data.title) {
        const header: HTMLElement = tooltip.createElement('div', {
            innerHTML: data.title,
            className: constants.RIBBON_TOOLTIP_TITLE
        });
        content.appendChild(header);
    }
    const textContainer: HTMLElement = tooltip.createElement('div', {
        className: constants.RIBBON_TEXT_CONTAINER
    });
    content.appendChild(textContainer);
    if (data.iconCss) {
        const customCss: HTMLElement = tooltip.createElement('div', {
            className: data.iconCss + ' ' + constants.RIBBON_TOOLTIP_ICON
        });
        textContainer.appendChild(customCss);
    }
    if (data.content) {
        const tooltipContent: HTMLElement = tooltip.createElement('div', {
            innerHTML: data.content,
            className: constants.RIBBON_TOOLTIP_CONTENT
        });
        textContainer.appendChild(tooltipContent);
    }
    tooltip.setProperties({
        content: content,
        cssClass: data.cssClass ? data.cssClass + ' ' + constants.RIBBON_TOOLTIP : constants.RIBBON_TOOLTIP
    });
}
/**
 * Creates tooltip.
 *
 * @param {HTMLElement} element - Gets the element to add tooltip.
 * @param {Ribbon} ribbon - Gets the ribbon.
 * @returns {void}
 * @hidden
 */
export function createTooltip(element: HTMLElement, ribbon: Ribbon): void {
    const ribbonTooltip: Tooltip = new Tooltip({
        target: '.' + constants.RIBBON_TOOLTIP_TARGET,
        beforeRender: beforeTooltipRender.bind(this),
        windowCollision: true
    });
    ribbonTooltip.appendTo(element);
    /**
     * @param {TooltipEventArgs} args - Gets the tooltip argument.
     * @returns {void}
     * @hidden
     */
    function beforeTooltipRender(args: TooltipEventArgs): void {
        setToolTipContent(args, ribbonTooltip, ribbon.tooltipData);
    }
}

/**
 * Destroys tooltip
 *
 * @param {HTMLElement} element - Gets the element in which the tooltip needs to be destroyed.
 * @returns {void}
 * @hidden
 */
export function destroyTooltip(element: HTMLElement): void {
    const control: Tooltip = getComponent(element, Tooltip);
    control.destroy();
}

/**
 * Updates tooltip
 *
 * @param {HTMLElement} element - Gets the element in which the tooltip needs to be Updated.
 * @param {commonProperties} prop - Gets the property to be updated.
 * @returns {void}
 * @hidden
 */
export function updateTooltipProp(element: HTMLElement, prop: commonProperties): void {
    const control: Tooltip = getComponent(element, Tooltip);
    control.setProperties(prop);
}

/**
 * Sets the HTML attributes of an element
 *
 * @param {HTMLElement} element - The HTML element for which attributes are to be updated.
 * @param {commonProperties} attributes - An object containing key-value pairs of attributes to be updated.
 * @returns {void}
 * @hidden
 */
export function setCustomAttributes(element: HTMLElement, attributes: { [key: string]: string }): void {
    for (const key in attributes) {
        if (key === 'class') {
            const elementClass: string = attributes['class'].replace(/\s+/g, ' ').trim();
            if (elementClass) {
                addClass([element], elementClass.split(' '));
            }
        }
        else if (key === 'style') {
            const prevStyles: string = element.getAttribute('style') || '';
            const value: string = `${prevStyles}${attributes[`${key}`]}`;
            element.setAttribute(`${key}`, value);
        }
        else {
            element.setAttribute(key, attributes[`${key}`]);
        }
    }
}
