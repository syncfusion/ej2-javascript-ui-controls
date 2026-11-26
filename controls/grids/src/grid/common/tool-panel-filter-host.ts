import { EventHandler } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';

/**
 * @hidden
 */
export interface ToolPanelFilterButton {
    content: string;
    cssClass?: string;
    isPrimary?: boolean;
    click: (e: MouseEvent) => void;
}

/**
 * Renders the footer buttons of a filter UI that is hosted directly in a tool panel accordion item.
 *
 * @param {HTMLElement} host - accordion item content element
 * @param {ToolPanelFilterButton[]} buttons - footer buttons
 * @returns {Button[]} the rendered buttons
 * @hidden
 */
export function renderToolPanelFooter(host: HTMLElement, buttons: ToolPanelFilterButton[]): Button[] {
    const btnObj: Button[] = [];
    if (!buttons.length) { return btnObj; }
    const footer: HTMLElement = document.createElement('div');
    footer.className = 'e-footer-content';
    buttons.forEach((b: ToolPanelFilterButton) => {
        const el: HTMLButtonElement = document.createElement('button');
        footer.appendChild(el);
        btnObj.push(new Button({ content: b.content, cssClass: b.cssClass, isPrimary: b.isPrimary }, el));
        EventHandler.add(el, 'click', b.click);
    });
    host.appendChild(footer);
    return btnObj;
}

/**
 * Destroys the buttons and empties the host element of a tool panel filter UI.
 *
 * @param {HTMLElement} host - accordion item content element
 * @param {Button[]} btnObj - buttons returned by `renderToolPanelFooter`
 * @param {string[]} classes - classes added to the host while rendering
 * @returns {void}
 * @hidden
 */
export function resetToolPanelHost(host: HTMLElement, btnObj: Button[], classes: string[]): void {
    btnObj.forEach((btn: Button) => { if (!btn.isDestroyed) { btn.destroy(); } });
    host.classList.remove(...classes.concat(['e-excelfilter', 'e-rtl']));
    ['id', 'aria-label', 'data-uid'].forEach((attr: string) => host.removeAttribute(attr));
    host.innerHTML = '';
}
