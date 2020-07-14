import * as events from '../base/constant';
import { IRichTextEditor } from '../base/interface';
import { detach } from '@syncfusion/ej2-base';

/**
 * XhtmlValidation module called when set enableXhtml as true
 */
export class XhtmlValidation {
    private parent: IRichTextEditor;
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.xhtmlValidation, this.enableXhtmlValidation, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.xhtmlValidation, this.enableXhtmlValidation);
        this.parent.off(events.destroy, this.removeEventListener);
    }

    private enableXhtmlValidation(): void {
        if (this.parent.enableXhtml) {
            this.clean(this.parent.inputElement);
            this.AddRootElement();
            this.ImageTags();
            this.removeTags();
            this.RemoveUnsupported();
            this.parent.setProperties({ value: this.parent.inputElement.innerHTML }, true);
        }
    }

    private AddRootElement(): void {
        if ((this.parent.inputElement.childNodes.length === 1 && this.parent.inputElement.firstChild.nodeName !== 'DIV') ||
            this.parent.inputElement.childNodes.length > 1) {
            let parentEle: HTMLElement = this.parent.createElement('div');

            while (this.parent.inputElement.childNodes.length > 0) {
                parentEle.appendChild(this.parent.inputElement.childNodes[0]);
            }
            this.parent.inputElement.appendChild(parentEle);
        }
    };

    private clean(node: HTMLElement): string {
        for (let n: number = 0; n < node.childNodes.length; n++) {
            let child: HTMLElement = node.childNodes[n] as HTMLElement;
            if (child.nodeType === 8 || child.nodeName === 'V:IMAGE') {
                node.removeChild(child);
                n--;
            } else if (child.nodeType === 1) {
                this.clean(child);
            }
        }
        return this.parent.inputElement.innerHTML;
    }

    private ImageTags(): void {
        let imgNodes: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('IMG');
        for (let i: number = imgNodes.length - 1; i >= 0; i--) {
            if (!imgNodes[i].hasAttribute('alt')) {
                let img: Element = imgNodes[i];
                img.setAttribute('alt', '');
            }
        }
    };

    private removeTags(): void {
        let removeAttribute: string[][] = [['br', 'ul'], ['br', 'ol'], ['table', 'span'], ['div', 'span'], ['p', 'span']];
        for (let i: number = 0; i < removeAttribute.length; i++) {
            this.RemoveElementNode(removeAttribute[i][0], removeAttribute[i][1]);
        }
    };

    private RemoveElementNode(rmvNode: string, parentNode: string): void {
        let parentArray: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll(parentNode);
        for (let i: number = 0; i < parentArray.length; i++) {
            let rmvArray: NodeListOf<HTMLElement> = parentArray[i].querySelectorAll(rmvNode);
            for (let j: number = rmvArray.length; j > 0; j--) {
                detach(rmvArray[j - 1]);
            }
        }
    };
    private RemoveUnsupported(): void {
        let underlineEle: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>this.parent.inputElement.querySelectorAll('u');
        for (let i: number = underlineEle.length - 1; i >= 0; i--) {
            let spanEle: HTMLElement = this.parent.createElement('span');
            spanEle.style.textDecoration = 'underline';
            spanEle.innerHTML = underlineEle[i].innerHTML;
            underlineEle[i].parentNode.insertBefore(spanEle, underlineEle[i]);
            detach(underlineEle[i]);
        }
        let strongEle: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('strong');
        for (let i: number = strongEle.length - 1; i >= 0; i--) {
            let boldEle: HTMLElement = this.parent.createElement('b');
            boldEle.innerHTML = strongEle[i].innerHTML;
            strongEle[i].parentNode.insertBefore(boldEle, strongEle[i]);
            detach(strongEle[i]);
        }
        let attrArray: string[] = ['language', 'role', 'target', 'contenteditable', 'cellspacing',
            'cellpadding', 'border', 'valign', 'colspan'];
        for (let i: number = 0; i <= attrArray.length; i++) {
            this.RemoveAttributeByName(attrArray[i]);
        }
    };
     private RemoveAttributeByName(attrName: string): void {
        if (this.parent.inputElement.firstChild !== null) {
            if (this.parent.inputElement.firstChild.nodeType !== 3) {
                for (let i: number = 0; i < this.parent.inputElement.childNodes.length; i++) {
                    let ele: Node = this.parent.inputElement.childNodes[i];
                    if (ele.nodeType !== 3 && ele.nodeName !== 'TABLE' && ele.nodeName !== 'TBODY' && ele.nodeName !== 'THEAD' &&
                        ele.nodeName !== 'TH' && ele.nodeName !== 'TR' && ele.nodeName !== 'TD') {
                        if ((ele as HTMLElement).hasAttribute(attrName)) {
                            (ele as HTMLElement).removeAttribute(attrName);
                        }
                        if (ele.hasChildNodes()) {
                            for (let j: number = 0; j < ele.childNodes.length; j++) {
                                let childEle: Node = ele.childNodes[j];
                                if (childEle.nodeType !== 3 && childEle.nodeName !== 'TABLE' && childEle.nodeName !== 'TBODY' &&
                                    childEle.nodeName !== 'THEAD' && childEle.nodeName !== 'TH' && childEle.nodeName !== 'TR' &&
                                    childEle.nodeName !== 'TD' && (childEle as HTMLElement).hasAttribute(attrName)) {
                                    (childEle as HTMLElement).removeAttribute(attrName);
                                }
                                if (childEle.hasChildNodes()) {
                                    for (let k: number = 0; k < childEle.childNodes.length; k++) {
                                        if (childEle.childNodes[k].nodeType !== 3 && childEle.childNodes[k].nodeName !== 'TABLE' &&
                                            childEle.childNodes[k].nodeName !== 'TBODY' && childEle.childNodes[k].nodeName !== 'THEAD' &&
                                            childEle.childNodes[k].nodeName !== 'TH' && childEle.childNodes[k].nodeName !== 'TR'
                                            && childEle.childNodes[k].nodeName !== 'TD'
                                            && (childEle.childNodes[k] as HTMLElement).hasAttribute(attrName)) {
                                            (childEle.childNodes[k] as HTMLElement).removeAttribute(attrName);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}