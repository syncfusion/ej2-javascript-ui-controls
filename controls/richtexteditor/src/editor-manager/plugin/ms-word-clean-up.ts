import { EditorManager } from '../base/editor-manager';
import * as EVENTS from '../../common/constant';
import { NotifyArgs } from '../../rich-text-editor/base/interface';
import { createElement } from '@syncfusion/ej2-base';

/**
 * PasteCleanup for MsWord content
 * @hidden
 */
export class MsWordPaste {
    public parent: EditorManager;
    constructor(parent?: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }

    public olData: string[] = [
        'decimal',
        'lower-alpha',
        'lower-roman',
        'upper-alpha',
        'upper-roman',
        'lower-greek'
    ];
    public ulData: string[] = [
        'disc',
        'square',
        'circle',
        'disc',
        'square',
        'circle'
    ];
    public ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    public blockNode: string[] = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    public listContents: string[] = [];
    public addEventListener(): void {
        this.parent.observer.on(EVENTS.MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
    }

    public wordCleanup(e: NotifyArgs): void {
        let listNodes: Element[] = [];
        let tempHTMLContent: string = (e.args as ClipboardEvent).clipboardData.getData('text/HTML');
        let elm: HTMLElement = createElement('p') as HTMLElement;
        elm.innerHTML = tempHTMLContent;
        let patern: RegExp = /class='?Mso|style='[^ ]*\bmso-/i;
        if (patern.test(tempHTMLContent)) {
            tempHTMLContent = tempHTMLContent.replace(/<img[^>]+>/i, '');
            listNodes = this.cleanUp(elm, listNodes);
            this.listConverter(listNodes);
            e.callBack(elm.innerHTML);
        } else {
            e.callBack(elm.innerHTML);
        }

    }

    public cleanUp(node: HTMLElement, listNodes: Element[]): Element[] {
        let temp: string = '';
        let tempCleaner: Element[] = [];
        let prevflagState: boolean;
        for (let index: number = 0; index < node.childNodes.length; index++) {
            if (this.ignorableNodes.indexOf(node.childNodes[index].nodeName) === -1 ||
                (node.childNodes[index].nodeType === 3 && node.childNodes[index].textContent.trim() === '')) {
                tempCleaner.push(node.childNodes[index] as Element);
                continue;
            } else if ((node.childNodes[index] as Element).className &&
                (node.childNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1) {
                listNodes.push(node.childNodes[index] as Element);
            }
            if (prevflagState && (this.blockNode.indexOf(node.childNodes[index].nodeName.toLowerCase()) !== -1) &&
                !((node.childNodes[index] as Element).className &&
                    (node.childNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1)) {
                listNodes.push(null);
            }
            if (this.blockNode.indexOf(node.childNodes[index].nodeName.toLowerCase()) !== -1) {
                if ((node.childNodes[index] as Element).className &&
                    (node.childNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1) {
                    prevflagState = true;
                } else {
                    prevflagState = false;
                }
            }
        }
        if (listNodes.length && (listNodes[listNodes.length - 1] !== null)) {
            listNodes.push(null);
        }
        return listNodes;
    }

    public listConverter(listNodes: Element[]): void {
        let level: number;
        let data: { content: HTMLElement, node: Element }[] = [];
        let collection: { listType: string, content: string[], nestedLevel: number }[] = [];
        let content: string = '';
        let stNode: Element;
        for (let i: number = 0; i < listNodes.length; i++) {
            if (listNodes[i] === null) {
                data.push({ content: this.makeConversion(collection), node: listNodes[i - 1] });
                collection = [];
                continue;
            }
            content = listNodes[i].getAttribute('style');
            if (content && content.indexOf('level') !== -1) {
                level = parseInt(content.charAt(content.indexOf('level') + 5), null);
            } else {
                level = 1;
            }
            this.listContents = [];
            this.getListContent(listNodes[i]);
            let type: string;
            type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
            let tempNode: string[] = [];
            for (let j: number = 1; j < this.listContents.length; j++) {
                tempNode.push(this.listContents[j]);
            }
            collection.push({ listType: type, content: tempNode, nestedLevel: level });
        }
        stNode = listNodes.shift();
        while (stNode) {
            let elemColl: Element[] = [];
            for (let temp1: number = 0; temp1 < data.length; temp1++) {
                if (data[temp1].node === stNode) {
                    for (let index: number = 0; index < data[temp1].content.childNodes.length; index++) {
                        elemColl.push(data[temp1].content.childNodes[index] as HTMLElement);
                    }
                    for (let index: number = 0; index < elemColl.length; index++) {
                        stNode.parentElement.insertBefore(elemColl[index], stNode);
                    }
                    break;
                }
            }
            stNode.remove();
            stNode = listNodes.shift();
            if (!stNode) {
                stNode = listNodes.shift();
            }
        }
    }

    public makeConversion(collection: { listType: string, content: string[], nestedLevel: number }[]): HTMLElement {
        let root: HTMLElement = createElement('div');
        let temp: HTMLElement;
        let pLevel: number = 1;
        let prevList: HTMLElement;
        let listCount: number = 0;
        let elem: HTMLElement;
        for (let index: number = 0; index < collection.length; index++) {
            let pElement: Element = createElement('p');
            for (let i: number = 0; i < collection[index].content.length; i++) {
                let imgPattern: RegExp = /<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/i;
                if (imgPattern.test(collection[index].content[i])) {
                    let imgSpanElement: Element = createElement('span');
                    imgSpanElement.innerHTML = collection[index].content[i];
                    pElement.appendChild(imgSpanElement);
                } else {
                    pElement.appendChild(document.createTextNode(collection[index].content[i].trim()));
                }
            }
            if ((collection[index].nestedLevel === 1) && listCount === 0 && collection[index].content) {
                root.appendChild(temp = createElement(collection[index].listType));
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            } else if (collection[index].nestedLevel === pLevel) {
                if (prevList.parentElement.tagName.toLowerCase() === collection[index].listType) {
                    prevList.parentElement.appendChild(prevList = createElement('li'));
                    prevList.appendChild(pElement);
                } else {
                    temp = createElement(collection[index].listType);
                    prevList.parentElement.parentElement.appendChild(temp);
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                }
            } else if (collection[index].nestedLevel > pLevel) {
                for (let j: number = 0; j < collection[index].nestedLevel - pLevel; j++) {
                    prevList.appendChild(temp = createElement(collection[index].listType));
                    prevList = createElement('li', { styles: 'list-style-type: none;' });
                    temp.appendChild(prevList);
                }
                prevList.appendChild(pElement);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                (temp.childNodes[0] as HTMLElement).style.listStyle =
                    this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            } else if (collection[index].nestedLevel === 1) {
                if ((root.lastChild as HTMLElement).tagName.toLowerCase() === collection[index].listType) {
                    temp = root.lastChild as HTMLElement;
                } else {
                    root.appendChild(temp = createElement(collection[index].listType));
                }
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            } else {
                elem = prevList;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                    if (elem.attributes.getNamedItem('level')) {
                        if (parseInt(elem.attributes.getNamedItem('level').textContent, null) === collection[index].nestedLevel) {
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            elem.appendChild(prevList);
                            break;
                        } else if (collection[index].nestedLevel > parseInt(elem.attributes.getNamedItem('level').textContent, null)) {
                            elem.appendChild(temp = createElement(collection[index].listType));
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            temp.appendChild(prevList);
                            temp.setAttribute('level', collection[index].nestedLevel.toString());
                            temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                            break;
                        }
                    }
                    continue;
                }
            }
            pLevel = collection[index].nestedLevel;
            listCount++;
        }
        return root;
    }

    public getListStyle(listType: string, nestedLevel: number): string {
        nestedLevel = (nestedLevel > 0) ? nestedLevel - 1 : nestedLevel;
        if (listType === 'ol') {
            return (nestedLevel < this.olData.length ? this.olData[nestedLevel] : this.olData[0]);
        } else {
            return (nestedLevel < this.ulData.length ? this.ulData[nestedLevel] : this.ulData[0]);
        }
    }

    public getListContent(elem: Element): void {
        if (elem.nodeType === 3 && elem.textContent.trim().length > 0) {
            this.listContents.push(elem.textContent.trim());
        } else if (elem.tagName === 'IMG') {
            let tempElem: HTMLElement = createElement('div');
            tempElem.appendChild(elem);
            this.listContents.push(tempElem.innerHTML);
        }
        if (elem.firstChild) {
            elem = elem.firstChild as Element;
            do {
                this.getListContent(elem);
                elem = elem.nextSibling as Element;
            } while (elem);
        }
    }
}
