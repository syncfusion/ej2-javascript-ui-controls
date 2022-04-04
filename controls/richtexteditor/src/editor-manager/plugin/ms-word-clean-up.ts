import { EditorManager } from '../base/editor-manager';
import * as EVENTS from '../../common/constant';
import { NotifyArgs } from '../../rich-text-editor/base/interface';
import { createElement, isNullOrUndefined as isNOU, detach } from '@syncfusion/ej2-base';
/**
 * PasteCleanup for MsWord content
 *
 * @hidden
 * @deprecated
 */
export class MsWordPaste {
    private parent: EditorManager;
    public constructor(parent?: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }

    private olData: string[] = [
        'decimal',
        'lower-alpha',
        'lower-roman',
        'upper-alpha',
        'upper-roman',
        'lower-greek'
    ];
    private ulData: string[] = [
        'disc',
        'square',
        'circle',
        'disc',
        'square',
        'circle'
    ];
    private ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    private blockNode: string[] = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    private borderStyle: string[] = ['border-top', 'border-right', 'border-bottom', 'border-left'];
    private removableElements: string[] = ['o:p', 'style'];
    private listContents: string[] = [];
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
    }

    private wordCleanup(e: NotifyArgs): void {
        const wordPasteStyleConfig: string[] = !isNOU(e.allowedStylePropertiesArray) ? e.allowedStylePropertiesArray : [];
        let listNodes: Element[] = [];
        let tempHTMLContent: string = (e.args as ClipboardEvent).clipboardData.getData('text/HTML');
        const rtfData: string = (e.args as ClipboardEvent).clipboardData.getData('text/rtf');
        const elm: HTMLElement = createElement('p') as HTMLElement;
        elm.setAttribute('id', 'MSWord-Content');
        elm.innerHTML = tempHTMLContent;
        const patern: RegExp = /class='?Mso|style='[^ ]*\bmso-/i;
        const patern2: RegExp = /class="?Mso|style="[^ ]*\bmso-/i;
        const patern3: RegExp =
        /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi;
        const pattern4: RegExp = /style='mso-width-source:/i;
        if (patern.test(tempHTMLContent) || patern2.test(tempHTMLContent) || patern3.test(tempHTMLContent) ||
        pattern4.test(tempHTMLContent)) {
            this.imageConversion(elm, rtfData);
            tempHTMLContent = tempHTMLContent.replace(/<img[^>]+>/i, '');
            this.addListClass(elm);
            listNodes = this.cleanUp(elm, listNodes);
            if (!isNOU(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
            listNodes[0].parentElement.tagName !== 'OL') {
                this.listConverter(listNodes);
            }
            this.styleCorrection(elm, wordPasteStyleConfig);
            this.removingComments(elm);
            this.removeUnwantedElements(elm);
            this.removeEmptyElements(elm);
            this.breakLineAddition(elm);
            this.removeClassName(elm);
            if (pattern4.test(tempHTMLContent)) {
                this.addTableBorderClass(elm);
            }
            e.callBack(elm.innerHTML);
        } else {
            e.callBack(elm.innerHTML);
        }
    }
    private addListClass(elm: HTMLElement): void {
        const allNodes: NodeListOf<Element> = elm.querySelectorAll('*');
        for (let index: number = 0; index < allNodes.length; index++) {
            if (!isNOU(allNodes[index].getAttribute('style')) && allNodes[index].getAttribute('style').replace(/ /g, '').replace('\n', '').indexOf('mso-list:l') >= 0 &&
            (allNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') === -1 && allNodes[index].tagName.charAt(0) !== 'H') {
                allNodes[index].classList.add('msolistparagraph');
            }
        }
    }

    private addTableBorderClass(elm: HTMLElement): void {
        const allTableElm: NodeListOf<HTMLElement> = elm.querySelectorAll('table');
        let hasTableBorder: boolean = false;
        for (let i: number = 0; i < allTableElm.length; i++) {
            for (let j: number = 0; j < this.borderStyle.length; j++) {
                if (allTableElm[i].innerHTML.indexOf(this.borderStyle[j]) >= 0) {
                    hasTableBorder = true;
                    break;
                }
            }
            if (hasTableBorder) {
                allTableElm[i].classList.add('e-rte-table-border');
                hasTableBorder = false;
            }
        }
    }

    private imageConversion(elm: HTMLElement, rtfData: string): void {
        this.checkVShape(elm);
        const imgElem: NodeListOf<HTMLImageElement> = elm.querySelectorAll('img');
        const imgSrc: string[] = [];
        const base64Src: string[] = [];
        const imgName: string[] = [];
        // eslint-disable-next-line
        const linkRegex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (imgElem.length > 0) {
            for (let i: number = 0; i < imgElem.length; i++) {
                imgSrc.push(imgElem[i].getAttribute('src'));
                imgName.push(imgElem[i].getAttribute('src').split('/')[imgElem[i].getAttribute('src').split('/').length - 1].split('.')[0]);
            }
            const hexValue: { [key: string]: string }[] = this.hexConversion(rtfData);
            for (let i: number = 0; i < hexValue.length; i++) {
                base64Src.push(this.convertToBase64(hexValue[i]));
            }
            for (let i: number = 0; i < imgElem.length; i++) {
                if (imgSrc[i].match(linkRegex)) {
                    imgElem[i].setAttribute('src', imgSrc[i]);
                } else {
                    imgElem[i].setAttribute('src', base64Src[i]);
                }
                imgElem[i].setAttribute('id', 'msWordImg-' + imgName[i]);
            }
        }
    }

    private checkVShape(elm: HTMLElement): void {
        const allNodes: NodeListOf<Element> = elm.querySelectorAll('*');
        for (let i: number = 0; i < allNodes.length; i++) {
            switch (allNodes[i].nodeName) {
            case 'V:SHAPETYPE':
                detach(allNodes[i]);
                break;
            case 'V:SHAPE':
                if (allNodes[i].firstElementChild.nodeName === 'V:IMAGEDATA') {
                    const src: string = (allNodes[i].firstElementChild as HTMLElement).getAttribute('src');
                    const imgElement: HTMLElement = createElement('img') as HTMLElement;
                    imgElement.setAttribute('src', src);
                    allNodes[i].parentElement.insertBefore(imgElement, allNodes[i]);
                    detach(allNodes[i]);
                }
                break;
            }
        }
    }

    private convertToBase64(hexValue: { [key: string]: string }): string {
        const byteArr: number[] = this.conHexStringToBytes(hexValue.hex);
        const base64String: string = this.conBytesToBase64(byteArr);
        const base64: string = hexValue.type ? 'data:' + hexValue.type + ';base64,' + base64String : null;
        return base64;
    }

    private conBytesToBase64(byteArr: number[]): string {
        let base64Str: string = '';
        const base64Char: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const byteArrLen: number = byteArr.length;
        for (let i: number = 0; i < byteArrLen; i += 3 ) {
            const array3: number[] = byteArr.slice( i, i + 3 );
            const array3length: number = array3.length;
            const array4: number[] = [];
            if ( array3length < 3 ) {
                for (let j: number = array3length; j < 3; j++ ) {
                    array3[ j ] = 0;
                }
            }
            array4[0] = (array3[0] & 0xFC) >> 2;
            array4[1] = ((array3[0] & 0x03) << 4) | (array3[1] >> 4 );
            array4[2] = ((array3[1] & 0x0F) << 2) | ((array3[2] & 0xC0 ) >> 6 );
            array4[3] = array3[2] & 0x3F;
            for (let j: number = 0; j < 4; j++ ) {
                if (j <= array3length) {
                    base64Str += base64Char.charAt(array4[j]);
                } else {
                    base64Str += '=';
                }
            }
        }
        return base64Str;
    }

    private conHexStringToBytes(hex: string): number[] {
        const byteArr: number[] = [];
        const byteArrLen: number = hex.length / 2;
        for (let i: number = 0; i < byteArrLen; i++) {
            byteArr.push( parseInt( hex.substr( i * 2, 2 ), 16 ) );
        }
        return byteArr;
    }

    private hexConversion(rtfData: string): { [key: string]: string }[] {
        // eslint-disable-next-line
        const picHead: RegExp = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/;
        const pic: RegExp = new RegExp( '(?:(' + picHead.source + '))([\\da-fA-F\\s]+)\\}', 'g' );
        const fullImg: RegExpMatchArray = rtfData.match(pic);
        let imgType: string;
        const result: { [key: string]: string }[] = [];
        if (!isNOU(fullImg)) {
            for (let i: number = 0; i < fullImg.length; i++) {
                if (picHead.test(fullImg[i])) {
                    if (fullImg[i].indexOf( '\\pngblip' ) !== -1 ) {
                        imgType = 'image/png';
                    } else if (fullImg[i].indexOf( '\\jpegblip' ) !== -1 ) {
                        imgType = 'image/jpeg';
                    } else {
                        continue;
                    }
                    result.push({
                        hex: imgType ? fullImg[i].replace(picHead, '').replace(/[^\da-fA-F]/g, '') : null,
                        type: imgType
                    });
                }
            }
        }
        return result;
    }

    private removeClassName(elm: HTMLElement): void {
        const elmWithClass: NodeListOf<Element> = elm.querySelectorAll('*[class]');
        for (let i: number = 0; i < elmWithClass.length; i++) {
            elmWithClass[i].removeAttribute('class');
        }
    }

    private breakLineAddition(elm: HTMLElement): void {
        const allElements: NodeListOf<Element> = elm.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            if (allElements[i].children.length === 0 && allElements[i].innerHTML === '&nbsp;' &&
            (allElements[i].innerHTML === '&nbsp;' && !allElements[i].closest('li')) &&
            !allElements[i].closest('td')) {
                const detachableElement: HTMLElement = this.findDetachElem(allElements[i]);
                const brElement: HTMLElement = createElement('br') as HTMLElement;
                if (!isNOU(detachableElement.parentElement)) {
                    detachableElement.parentElement.insertBefore(brElement, detachableElement);
                    detach(detachableElement);
                }
            }
        }
    }
    private findDetachElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement) &&
        element.parentElement.textContent.trim() === '' && element.parentElement.tagName !== 'TD' &&
        isNOU(element.parentElement.querySelector('img'))) {
            removableElement = this.findDetachElem(element.parentElement);
        } else {
            removableElement = element as HTMLElement;
        }
        return removableElement;
    }

    private removeUnwantedElements(elm: HTMLElement): void {
        let innerElement: string = elm.innerHTML;
        for (let i: number = 0; i < this.removableElements.length; i++) {
            const regExpStartElem: RegExp = new RegExp('<' + this.removableElements[i] + '>', 'g');
            const regExpEndElem: RegExp = new RegExp('</' + this.removableElements[i] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        elm.innerHTML = innerElement;
        elm.querySelectorAll(':empty');
    }


    private findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
            element.parentElement.getAttribute('id') !== 'MSWord-Content' &&
            isNOU(element.parentElement.querySelector('img'))) {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            } else {
                removableElement = element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }
    private removeEmptyElements(element: HTMLElement): void {
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            if (!isNOU(emptyElements[i].closest('td')) &&
            !isNOU(emptyElements[i].closest('td').querySelector('.MsoNormal'))) {
                emptyElements[i].innerHTML = '-';
            }
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR' &&
            emptyElements[i].tagName !== 'IFRAME' && emptyElements[i].tagName !== 'TD' &&
            emptyElements[i].tagName !== 'HR') {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }

    private styleCorrection(elm: HTMLElement, wordPasteStyleConfig: string[]): void {
        const styleElement: NodeListOf<HTMLStyleElement> = elm.querySelectorAll('style');
        if (styleElement.length > 0) {
            const styles: string[] = styleElement[0].innerHTML.match(/[\S ]+\s+{[\s\S]+?}/gi);
            const styleClassObject: { [key: string]: string } = !isNOU(styles) ? this.findStyleObject(styles) : null;
            const keys: string[] = Object.keys(styleClassObject);
            let values: string[] = keys.map((key: string) => {
                return styleClassObject[key];
            });
            values = this.removeUnwantedStyle(values, wordPasteStyleConfig);
            this.filterStyles(elm, wordPasteStyleConfig);
            let resultElem: HTMLCollectionOf<Element> | NodeListOf<Element>;
            let fromClass: boolean = false;
            for (let i: number = 0; i < keys.length; i++) {
                if (keys[i].split('.')[0] === '') {
                    resultElem = elm.getElementsByClassName(keys[i].split('.')[1]);
                    fromClass = true;
                } else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') >= 0) {
                    continue;
                } else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') < 0) {
                    resultElem = elm.getElementsByTagName(keys[i]);
                } else {
                    resultElem = elm.querySelectorAll(keys[i]);
                }
                for (let j: number = 0; j < resultElem.length; j++) {
                    const styleProperty: string = resultElem[j].getAttribute('style');
                    if (!isNOU(styleProperty) && styleProperty.trim() !== '') {
                        const valueSplit: string[] = values[i].split(';');
                        if (!fromClass) {
                            for (let k: number = 0; k < valueSplit.length; k++) {
                                if (styleProperty.indexOf(valueSplit[k].split(':')[0]) >= 0) {
                                    valueSplit.splice(k, 1);
                                    k--;
                                }
                            }
                        }
                        values[i] = valueSplit.join(';') + ';';
                        const changedValue: string = styleProperty + values[i];
                        resultElem[j].setAttribute('style', changedValue);
                    } else {
                        values[i] = values[i].replace(/text-indent:-(.*?)(?=;|$)/gm, '');
                        resultElem[j].setAttribute('style', values[i]);
                    }
                }
                fromClass = false;
            }
        }
    }

    private filterStyles(elm: HTMLElement, wordPasteStyleConfig: string[]): void {
        const elmWithStyles:  NodeListOf<Element> = elm.querySelectorAll('*[style]');
        for (let i: number = 0; i < elmWithStyles.length; i++) {
            const elemStyleProperty: string[] = elmWithStyles[i].getAttribute('style').split(';');
            let styleValue: string = '';
            for (let j: number = 0; j < elemStyleProperty.length; j++) {
                if (wordPasteStyleConfig.indexOf(elemStyleProperty[j].split(':')[0].trim()) >= 0 ) {
                    styleValue += elemStyleProperty[j] + ';';
                }
            }
            elmWithStyles[i].setAttribute('style', styleValue);
        }
    }

    private removeUnwantedStyle(values: string[], wordPasteStyleConfig: string[]): string[] {
        for (let i: number = 0; i < values.length; i++) {
            const styleValues: string[] = values[i].split(';');
            values[i] = '';
            for (let j: number = 0; j < styleValues.length; j++) {
                if (wordPasteStyleConfig.indexOf(styleValues[j].split(':')[0]) >= 0) {
                    values[i] += styleValues[j] + ';';
                }
            }
        }
        return values;
    }

    private findStyleObject(styles: string[]): { [key: string]: string } {
        const styleClassObject: { [key: string]: string } = {};
        for (let i: number = 0; i < styles.length; i++) {
            const tempStyle: string = styles[i];
            let classNameCollection: string = tempStyle.replace(/([\S ]+\s+){[\s\S]+?}/gi, '$1');
            let stylesCollection: string = tempStyle.replace(/[\S ]+\s+{([\s\S]+?)}/gi, '$1');
            classNameCollection = classNameCollection.replace(/^[\s]|[\s]$/gm, '');
            stylesCollection = stylesCollection.replace(/^[\s]|[\s]$/gm, '');
            classNameCollection = classNameCollection.replace(/\n|\r|\n\r/g, '');
            stylesCollection = stylesCollection.replace(/\n|\r|\n\r/g, '');
            for (let classNames: string[] = classNameCollection.split(', '), j: number = 0; j < classNames.length; j++) {
                styleClassObject[classNames[j]] = stylesCollection;
            }
        }
        return styleClassObject;
    }

    private removingComments(elm: HTMLElement): void {
        let innerElement: string = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    }

    private cleanUp(node: HTMLElement, listNodes: Element[]): Element[] {
        // eslint-disable-next-line
        const temp: string = '';
        const tempCleaner: Element[] = [];
        let prevflagState: boolean;
        const allNodes: NodeListOf<Element> = node.querySelectorAll('*');
        for (let index: number = 0; index < allNodes.length; index++) {
            if (this.ignorableNodes.indexOf(allNodes[index].nodeName) === -1 ||
                (allNodes[index].nodeType === 3 && allNodes[index].textContent.trim() === '')) {
                tempCleaner.push(allNodes[index] as Element);
                continue;
            } else if ((allNodes[index] as Element).className &&
                (allNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 &&
                (allNodes[index] as Element).childElementCount !== 1 && !isNOU(allNodes[index].getAttribute('style')) &&
                allNodes[index].getAttribute('style').indexOf('mso-list:') >= 0) {
                if (allNodes[index].className.indexOf('MsoListParagraphCxSpFirst') >= 0 && listNodes.length > 0 &&
                listNodes[listNodes.length - 1] !== null) {
                    listNodes.push(null);
                }
                listNodes.push(allNodes[index] as Element);
            }
            if (prevflagState && (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) &&
                !((allNodes[index] as Element).className &&
                    (allNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 && !isNOU(allNodes[index].getAttribute('style')) &&
                    allNodes[index].getAttribute('style').indexOf('mso-list:') >= 0)) {
                listNodes.push(null);
            }
            if (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) {
                if ((allNodes[index] as Element).className &&
                    (allNodes[index] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 && !isNOU(allNodes[index].getAttribute('style')) &&
                    allNodes[index].getAttribute('style').indexOf('mso-list:') >= 0) {
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

    private listConverter(listNodes: Element[]): void {
        let level: number;
        const data: { content: HTMLElement; node: Element }[] = [];
        let collection: { listType: string; content: string[]; nestedLevel: number; class: string, listStyle: string, listStyleTypeName: string }[] = [];
        let content: string = '';
        let stNode: Element;
        let currentListStyle: string = '';
        for (let i: number = 0; i < listNodes.length; i++) {
            if (listNodes[i] === null) {
                data.push({ content: this.makeConversion(collection), node: listNodes[i - 1] });
                collection = [];
                continue;
            }
            if (listNodes[i].getAttribute('style') && listNodes[i].getAttribute('style').indexOf('mso-outline-level') !== -1) {
                listNodes[i].setAttribute('style', listNodes[i].getAttribute('style').replace('mso-outline-level', 'mso-outline'));
            }
            content = listNodes[i].getAttribute('style');
            if (content && content.indexOf('level') !== -1) {
                // eslint-disable-next-line
                level = parseInt(content.charAt(content.indexOf('level') + 5), null);
            } else {
                level = 1;
            }
            this.listContents = [];
            this.getListContent(listNodes[i]);
            let type: string;
            let listStyleType: string;
            if (!isNOU(this.listContents[0])) {
                type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
                listStyleType = this.getlistStyleType(this.listContents[0], type);
                const tempNode: string[] = [];
                for (let j: number = 1; j < this.listContents.length; j++) {
                    tempNode.push(this.listContents[j]);
                }
                let currentClassName: string;
                if (!isNOU(listNodes[i].className)) {
                    currentClassName = listNodes[i].className;
                }
                if (!isNOU(listNodes[i].getAttribute('style'))) {
                    listNodes[i].setAttribute('style', listNodes[i].getAttribute('style').replace('text-align:start;', ''));
                    if ((listNodes[i] as HTMLElement).style.textAlign !== '') {
                        listNodes[i].setAttribute('style', 'text-align:' + (listNodes[i] as HTMLElement).style.textAlign);
                        currentListStyle = listNodes[i].getAttribute('style');
                    }
                }
                collection.push({ listType: type, content: tempNode, nestedLevel: level, class: currentClassName,
                    listStyle: currentListStyle, listStyleTypeName: listStyleType });
            }
        }
        stNode = listNodes.shift();
        while (stNode) {
            const elemColl: Element[] = [];
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

    private getlistStyleType(listContent: string, type: string): string {
        let currentListClass: string;
        if (type === 'ol') {
            switch(listContent.split('.')[0]) {
                case "A":
                    currentListClass = "upper-alpha";
                    break;
                case "a":
                    currentListClass = "lower-alpha";
                    break;
                case "I":
                    currentListClass = "upper-roman";
                    break;
                case "i":
                    currentListClass = "lower-roman";
                    break;
                case "α":
                    currentListClass = "lower-greek";
                    break;
                default:
                    currentListClass = "decimal";
                    break;
            }
        } else {
            switch(listContent.split('.')[0]) {
                case "o":
                    currentListClass = "circle";
                    break;
                case "§":
                    currentListClass = "square";
                    break;
                default:
                    currentListClass = "disc";
                    break;
            }
        }
        return currentListClass;
    }

    private makeConversion(
        collection: { listType: string; content: string[]; nestedLevel: number; class: string, listStyle: string, listStyleTypeName: string }[]): HTMLElement {
        const root: HTMLElement = createElement('div');
        let temp: HTMLElement;
        let pLevel: number = 1;
        let prevList: HTMLElement;
        let listCount: number = 0;
        let elem: HTMLElement;
        for (let index: number = 0; index < collection.length; index++) {
            const pElement: Element = createElement('p');
            pElement.innerHTML = collection[index].content.join(' ');
            if ((collection[index].nestedLevel === 1) && listCount === 0 && collection[index].content) {
                root.appendChild(temp = createElement(collection[index].listType));
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyleType = collection[index].listStyleTypeName;
            } else if (collection[index].nestedLevel === pLevel) {
                if (prevList.parentElement.tagName.toLowerCase() === collection[index].listType) {
                    prevList.parentElement.appendChild(prevList = createElement('li'));
                    prevList.appendChild(pElement);
                } else {
                    temp = createElement(collection[index].listType);
                    temp.style.listStyleType = collection[index].listStyleTypeName;
                    prevList.parentElement.parentElement.appendChild(temp);
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                }
            } else if (collection[index].nestedLevel > pLevel) {
                if (!isNOU(prevList)) {
                    for (let j: number = 0; j < collection[index].nestedLevel - pLevel; j++) {
                        prevList.appendChild(temp = createElement(collection[index].listType));
                        prevList = createElement('li');
                        if (j != collection[index].nestedLevel - pLevel - 1 && collection[index].nestedLevel - pLevel > 1) {
                            prevList.style.listStyleType = "none";
                        }
                        temp.appendChild(prevList);
                    }
                    prevList.appendChild(pElement);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                    temp.style.listStyleType = collection[index].listStyleTypeName;
                } else {
                    root.appendChild(temp = createElement(collection[index].listType));
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                    temp.style.listStyleType = collection[index].listStyleTypeName;
                }
            } else if (collection[index].nestedLevel === 1) {
                if ((root.lastChild as HTMLElement).tagName.toLowerCase() === collection[index].listType) {
                    temp = root.lastChild as HTMLElement;
                } else {
                    root.appendChild(temp = createElement(collection[index].listType));
                    temp.style.listStyleType = collection[index].listStyleTypeName;
                }
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
            } else {
                elem = prevList;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                    if (elem.attributes.getNamedItem('level')) {
                        // eslint-disable-next-line
                        if (parseInt(elem.attributes.getNamedItem('level').textContent, null) === collection[index].nestedLevel) {
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            elem.appendChild(prevList);
                            break;
                        // eslint-disable-next-line
                        } else if (collection[index].nestedLevel > parseInt(elem.attributes.getNamedItem('level').textContent, null)) {
                            elem.appendChild(temp = createElement(collection[index].listType));
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            temp.appendChild(prevList);
                            temp.setAttribute('level', collection[index].nestedLevel.toString());
                            temp.style.listStyleType = collection[index].listStyleTypeName;
                            break;
                        }
                    }
                    continue;
                }
            }
            prevList.setAttribute('class', collection[index].class);
            const currentStyle: string = prevList.getAttribute('style');
            prevList.setAttribute('style', (!isNOU(currentStyle) ? currentStyle : ''));
            pLevel = collection[index].nestedLevel;
            listCount++;
        }
        return root;
    }

    private getListContent(elem: Element): void {
        let pushContent: string = '';
        const firstChild: Element = elem.firstElementChild;
        if (firstChild.textContent.trim() === '' && !isNOU(firstChild.firstElementChild) &&
            firstChild.firstElementChild.nodeName === 'IMG') {
            pushContent = elem.innerHTML.trim();
            this.listContents.push('');
            this.listContents.push(pushContent);
        } else {
            const styleNodes: string[] = ['b', 'em'];
            if (firstChild.childNodes.length > 0 && (firstChild.querySelectorAll('b').length > 0
                || firstChild.querySelectorAll('em').length > 0)) {
                for (let i: number = 0; i < firstChild.childNodes.length; i++) {
                    const nodeName: string = firstChild.childNodes[i].nodeName.toLowerCase();
                    if (firstChild.childNodes[i].textContent.trim().length > 1 && styleNodes.indexOf(nodeName) !== -1) {
                        pushContent = '<' + nodeName + '>' + firstChild.childNodes[i].textContent + '</' + nodeName + '>';
                        this.listContents.push(pushContent);
                    } else if (firstChild.childNodes[i].textContent.trim().length === 1) {
                        this.listContents.push(firstChild.childNodes[i].textContent.trim());
                    }
                }
            } else {
                pushContent = firstChild.textContent.trim();
                this.listContents.push(pushContent);
            }
        }
        detach(firstChild);
        this.listContents.push(elem.innerHTML);
    }
}
