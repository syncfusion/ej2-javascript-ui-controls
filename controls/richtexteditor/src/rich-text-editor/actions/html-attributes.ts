/**
 * Used to set the HTML Attributes for RTE container
 */
import { IRichTextEditor } from '../base/interface';

export function setAttributes(htmlAttributes: { [key: string]: string }, rte: IRichTextEditor, isFrame: boolean): void {
    let target: HTMLElement;
    if (isFrame) {
        let iFrame: HTMLDocument = rte.contentModule.getDocument();
        target = iFrame.querySelector('body');
    } else {
        target = rte.element;
    }
    if (Object.keys(htmlAttributes).length) {
        for (let htmlAttr of Object.keys(htmlAttributes)) {
            if (htmlAttr === 'class') {
                target.classList.add(htmlAttributes[htmlAttr]);
            } else if (htmlAttr === 'disabled' && htmlAttributes[htmlAttr] === 'disabled') {
                rte.enabled = false;
                rte.setEnable();
            } else if (htmlAttr === 'readonly' && htmlAttributes[htmlAttr] === 'readonly') {
                rte.readonly = true;
                rte.setReadOnly();
            } else if (htmlAttr === 'style') {
                target.setAttribute('style', htmlAttributes[htmlAttr]);
            } else if (htmlAttr === 'placeholder') {
                rte.placeholder = htmlAttributes[htmlAttr];
                rte.setPlaceHolder();
            } else {
                let validateAttr: string[] = ['name', 'required'];
                if (validateAttr.indexOf(htmlAttr) > -1) {
                    rte.valueContainer.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                } else {
                    target.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                }
            }
        }
    }
}
