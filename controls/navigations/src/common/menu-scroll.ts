import { select, detach } from '@syncfusion/ej2-base';
import { VScroll } from './v-scroll';
import { HScroll } from './h-scroll';

/**
 * Used to add scroll in menu.
 *
 * @param {createElementType} createElement - Specifies the create element model
 * @param {HTMLElement} container - Specifies the element container
 * @param {HTMLElement} content - Specifies the content element
 * @param {string} scrollType - Specifies the scroll type
 * @param {boolean} enableRtl - Specifies the enable RTL property
 * @param {boolean} offset - Specifies the offset value
 * @returns {HTMLElement} - Element
 * @hidden
 */
export function addScrolling(
    createElement: createElementType, container: HTMLElement, content: HTMLElement, scrollType: string, enableRtl: boolean,
    offset?: number): HTMLElement {
    let containerOffset: number; let contentOffset: number;
    const parentElem: Element = container.parentElement;
    if (scrollType === 'vscroll') {
        containerOffset = offset || container.getBoundingClientRect().height; contentOffset = content.getBoundingClientRect().height;
    } else {
        containerOffset = container.getBoundingClientRect().width; contentOffset = content.getBoundingClientRect().width;
    }
    if (containerOffset < contentOffset) {
        return createScrollbar(createElement, container, content, scrollType, enableRtl, offset);
    } else if (parentElem) {
        const width: number = parentElem.getBoundingClientRect().width;
        if (width < containerOffset && scrollType === 'hscroll') {
            contentOffset = width;
            container.style.maxWidth = width + 'px';
            return createScrollbar(createElement, container, content, scrollType, enableRtl, offset);
        }
        return content;
    } else {
        return content;
    }
}

/**
 * Used to create scroll bar in menu.
 *
 * @param {createElementType} createElement - Specifies the create element model
 * @param {HTMLElement} container - Specifies the element container
 * @param {HTMLElement} content - Specifies the content element
 * @param {string} scrollType - Specifies the scroll type
 * @param {boolean} enableRtl - Specifies the enable RTL property
 * @param {boolean} offset - Specifies the offset value
 * @returns {HTMLElement} - Element
 * @hidden
 */
function createScrollbar (createElement: createElementType, container: HTMLElement, content: HTMLElement, scrollType: string,
                          enableRtl: boolean, offset?: number): HTMLElement {
    const scrollEle: HTMLElement = createElement('div', { className: 'e-menu-' + scrollType });
    container.appendChild(scrollEle);
    scrollEle.appendChild(content);
    if (offset) {
        scrollEle.style.overflow = 'hidden';
        scrollEle.style.height = offset + 'px';
    } else {
        scrollEle.style.maxHeight = container.style.maxHeight;
        container.style.overflow = 'hidden';
    }
    let scrollObj: VScroll | HScroll;
    if (scrollType === 'vscroll') {
        scrollObj = new VScroll({ enableRtl: enableRtl }, scrollEle);
        scrollObj.scrollStep = (select('.e-' + scrollType + '-bar', container) as HTMLElement).offsetHeight / 2;
    } else {
        scrollObj = new HScroll({ enableRtl: enableRtl }, scrollEle);
        scrollObj.scrollStep = (select('.e-' + scrollType + '-bar', container) as HTMLElement).offsetWidth;
    }
    return scrollEle;
}

/**
 * Used to destroy the scroll option.
 *
 * @param {VScroll | HScroll} scrollObj - Specifies the scroller object
 * @param {Element} element - Specifies the element
 * @param {HTMLElement} skipEle - Specifies the skip  element
 * @returns {void}
 * @hidden
 */
export function destroyScroll(scrollObj: VScroll | HScroll, element: Element, skipEle?: HTMLElement): void {
    if (scrollObj) {
        const menu: Element = select('.e-menu-parent', element);
        if (menu) {
            if (!skipEle || skipEle === menu) {
                scrollObj.destroy();
                element.parentElement.appendChild(menu);
                detach(element);
            }
        } else {
            scrollObj.destroy();
            detach(element);
        }
    }
}

type createElementType = (
    tag: string,
    prop?: { className?: string }
) => HTMLElement;
