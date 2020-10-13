import { getUniqueID, Browser, detach, extend, addClass, createElement, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Uploader, MetaData, UploadingEventArgs, SelectedEventArgs, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import * as events from '../constant';
import * as classes from '../classes';
import { sanitizeHelper } from '../util';
import { MS_WORD_CLEANUP } from '../constant';
import { IHtmlFormatterCallBack } from '../../src/common';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../src/selection/selection';
import { pasteCleanupGroupingTags } from '../../src/common/config';
import { convertToBlob } from '../../src/rich-text-editor/base/util';
import { CLS_RTE_DIALOG_UPLOAD, CLS_POPUP_OPEN, CLS_RTE_UPLOAD_POPUP } from '../classes';
import { NotifyArgs, ImageUploadingEventArgs } from '../../src/rich-text-editor/base/interface';

/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
export class PasteCleanup {
    private currentArgs: Object;
    private rawFile: FileInfo[];
    private uploadObj: Uploader;
    private currentValue: string;
    private preRTEHeight: string;
    private newRTEHeight: string;
    private parent: SfRichTextEditor;
    private saveSelection: NodeSelection;
    private containsHtml: boolean = false;
    private isNotFromHtml: boolean = false;
    private nodeSelectionObj: NodeSelection;

    private inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    private blockNode: string[] = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.nodeSelectionObj = new NodeSelection();
        this.parent.observer.on(events.pasteClean, this.pasteClean, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.pasteClean, this.pasteClean);
        this.parent.observer.off(events.destroy, this.destroy);
    }
    private pasteClean(e?: NotifyArgs): void {
        let args: { [key: string]: string | NotifyArgs } = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        let value: string = null;
        let imageproperties: string | object;
        if (e.args && !isNOU((e.args as ClipboardEvent).clipboardData)) {
            value = (e.args as ClipboardEvent).clipboardData.getData('text/html');
        }
        if (e.args && value !== null && this.parent.editorMode === 'HTML') {
            if (value.length === 0) {
                let htmlRegex: RegExp = new RegExp(/<\/[a-z][\s\S]*>/i);
                value = (e.args as ClipboardEvent).clipboardData.getData('text/plain');
                this.isNotFromHtml = value !== '' ? true : false;
                value = value.replace(/</g, '&lt;');
                value = value.replace(/>/g, '&gt;');
                this.containsHtml = htmlRegex.test(value);
                let file: File = e && (e.args as ClipboardEvent).clipboardData &&
                    (e.args as ClipboardEvent).clipboardData.items.length > 0 ?
                    (e.args as ClipboardEvent).clipboardData.items[0].getAsFile() : null;
                this.parent.observer.notify(events.paste, {
                    file: file,
                    args: e.args,
                    text: value,
                    callBack: (b: string | object) => {
                        imageproperties = b;
                        if (typeof (imageproperties) === 'object') {
                            this.parent.formatter.editorManager.execCommand(
                                'Images',
                                'Image',
                                e.args,
                                this.imageFormatting.bind(this, args),
                                'pasteCleanup',
                                imageproperties,
                                'pasteCleanupModule');
                        } else {
                            value = imageproperties;
                        }
                    }
                });
                if (!htmlRegex.test(value)) {
                    let divElement: HTMLElement = createElement('div');
                    divElement.innerHTML = this.splitBreakLine(value);
                    value = divElement.innerHTML;
                }
            } else if (value.length > 0) {
                this.parent.formatter.editorManager.observer.notify(MS_WORD_CLEANUP, {
                    args: e.args,
                    text: e.text,
                    allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
                    callBack: (a: string) => {
                        value = a;
                    }
                });
            }
            let currentDocument: Document = document;
            let range: Range = this.nodeSelectionObj.getRange(currentDocument);
            this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
            if (this.parent.pasteCleanupSettings.prompt) {
                (e.args as ClipboardEvent).preventDefault();
                let tempDivElem: HTMLElement = createElement('div') as HTMLElement;
                tempDivElem.innerHTML = value;
                if (tempDivElem.textContent !== '' || !isNOU(tempDivElem.querySelector('img')) ||
                    !isNOU(tempDivElem.querySelector('table'))) {
                    this.pasteDialog(value, args);
                }
            } else if (this.parent.pasteCleanupSettings.plainText) {
                (e.args as ClipboardEvent).preventDefault();
                this.plainFormatting(value, args);
            } else if (this.parent.pasteCleanupSettings.keepFormat) {
                (e.args as ClipboardEvent).preventDefault();
                this.formatting(value, false, args);
            } else {
                (e.args as ClipboardEvent).preventDefault();
                this.formatting(value, true, args);
            }
        }
    }
    private splitBreakLine(value: string): string {
        let enterSplitText: string[] = value.split('\n');
        let contentInnerElem: string = '';
        for (let i: number = 0; i < enterSplitText.length; i++) {
            if (enterSplitText[i].trim() === '') {
                contentInnerElem += '<p><br></p>';
            } else {
                let contentWithSpace: string = this.makeSpace(enterSplitText[i]);
                contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
            }
        }
        return contentInnerElem;
    }
    private makeSpace(enterSplitText: string): string {
        let contentWithSpace: string = '';
        let spaceBetweenContent: boolean = true;
        let spaceSplit: string[] = enterSplitText.split(' ');
        for (let j: number = 0; j < spaceSplit.length; j++) {
            if (spaceSplit[j].trim() === '') {
                contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
            } else {
                spaceBetweenContent = false;
                contentWithSpace += spaceSplit[j] + ' ';
            }
        }
        return contentWithSpace;
    }
    private imgUploading(elm: HTMLElement): void {
        let allImgElm: NodeListOf<HTMLImageElement> =
            elm.querySelectorAll('.' + classes.CLS_PASTED_CONTENT_IMG);
        if (this.parent.insertImageSettings.saveUrl && allImgElm.length > 0) {
            let base64Src: string[] = [];
            let imgName: string[] = [];
            let uploadImg: Element[] = [];
            for (let i: number = 0; i < allImgElm.length; i++) {
                if (allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                    base64Src.push(allImgElm[i].getAttribute('src'));
                    imgName.push(getUniqueID('rte_image'));
                    uploadImg.push(allImgElm[i]);
                }
            }
            let fileList: File[] = [];
            for (let i: number = 0; i < base64Src.length; i++) {
                fileList.push(this.base64ToFile(base64Src[i], imgName[i]));
            }
            for (let i: number = 0; i < fileList.length; i++) {
                this.uploadMethod(fileList[i], uploadImg[i]);
            }
            if (isNOU(this.parent.insertImageSettings.path) &&
                this.parent.insertImageSettings.saveFormat === 'Blob') {
                this.getBlob(allImgElm);
            }
        } else if (this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.getBlob(allImgElm);
        }
        let allImgElmId: NodeListOf<Element> = elm.querySelectorAll('.' + classes.CLS_PASTED_CONTENT_IMG);
        for (let i: number = 0; i < allImgElmId.length; i++) {
            allImgElmId[i].classList.remove(classes.CLS_PASTED_CONTENT_IMG);
            if (allImgElmId[i].getAttribute('class').trim() === '') {
                allImgElm[i].removeAttribute('class');
            }
        }
    }
    private getBlob(allImgElm: NodeListOf<HTMLImageElement>): void {
        for (let i: number = 0; i < allImgElm.length; i++) {
            if (!isNOU(allImgElm[i].getAttribute('src')) &&
                allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                let blopUrl: string = URL.createObjectURL(convertToBlob(allImgElm[i].getAttribute('src')));
                allImgElm[i].setAttribute('src', blopUrl);
            }
        }
    }
    private uploadMethod(fileList: File, imgElem: Element): void {
        let uploadEle: HTMLInputElement | HTMLElement = document.createElement('div');
        document.body.appendChild(uploadEle);
        uploadEle.setAttribute('display', 'none');
        (imgElem as HTMLElement).style.opacity = '0.5';
        let popupEle: HTMLElement = createElement('div');
        this.parent.element.appendChild(popupEle);
        let contentEle: HTMLInputElement | HTMLElement = createElement('input', {
            id: this.parent.element.id + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        let offsetY: number = this.parent.iframeSettings.enable ? -50 : -90;
        let popupObj: Popup = new Popup(popupEle, {
            relateTo: imgElem as HTMLElement,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: contentEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                popupObj.destroy();
                detach(popupObj.element);
            }
        });
        popupObj.element.style.display = 'none';
        addClass([popupObj.element], [CLS_POPUP_OPEN, CLS_RTE_UPLOAD_POPUP]);
        let timeOut: number = fileList.size > 1000000 ? 300 : 100;
        setTimeout(() => { this.refreshPopup(imgElem as HTMLElement, popupObj); }, timeOut);
        let beforeUploadArgs: ImageUploadingEventArgs;
        this.rawFile = undefined;
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl
            },
            cssClass: CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.inputElement,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            success: (e: object) => {
                setTimeout(() => { this.popupClose(popupObj, imgElem, e); }, 900);
            },
            uploading: (e: UploadingEventArgs) => {
                this.parent.inputElement.contentEditable = 'false';
            },
            beforeUpload: (args: BeforeUploadEventArgs) => {
                beforeUploadArgs = JSON.parse(JSON.stringify(args));
                beforeUploadArgs.filesData = this.rawFile;
                // @ts-ignore-start
                this.parent.dotNetRef.invokeMethodAsync(events.beforeUpload, args).then((beforeUploadArgs: ImageUploadingEventArgs) => {
                    if (beforeUploadArgs.cancel) { return; }
                    /* tslint:disable */
                    (this.uploadObj as any).uploadFiles(this.rawFile, null);
                    /* tslint:enable */
                    // @ts-ignore-end
                });
            },
            failure: (e: Object) => {
                setTimeout(() => { this.uploadFailure(imgElem, popupObj, e); }, 900);
            },
            canceling: () => {
                this.parent.inputElement.contentEditable = 'true';
                if (imgElem.nextSibling.textContent === ' ') {
                    detach(imgElem.nextSibling);
                }
                detach(imgElem);
                popupObj.close();
            },
            selected: (e: SelectedEventArgs) => {
                e.cancel = true;
                this.rawFile = e.filesData;
            },
            removing: () => {
                this.parent.inputElement.contentEditable = 'true';
                if (imgElem.nextSibling.textContent === ' ') {
                    detach(imgElem.nextSibling);
                }
                detach(imgElem);
                popupObj.close();
            }
        });
        this.uploadObj.appendTo(popupObj.element.childNodes[0] as HTMLElement);
        /* tslint:disable */
        let fileData: any = [{
            name: fileList.name,
            rawFile: fileList,
            size: fileList.size,
            type: fileList.type,
            validationMessages: { minSize: '', maxSize: '' },
            statusCode: '1'
        }];
        (this.uploadObj as any).createFileList(fileData);
        (this.uploadObj as any).filesData.push(fileData[0]);
        /* tslint:enable */
        this.uploadObj.upload(fileData);
        (popupObj.element.getElementsByClassName(classes.CLS_FILE_SELECT_WRAP)[0] as HTMLElement).style.display = 'none';
        detach(popupObj.element.querySelector('.' + CLS_RTE_DIALOG_UPLOAD + ' .' + classes.CLS_FILE_SELECT_WRAP) as HTMLElement);
    }
    private uploadFailure(imgElem: Element, popupObj: Popup, e: Object): void {
        this.parent.inputElement.contentEditable = 'true';
        detach(imgElem);
        if (popupObj) {
            popupObj.close();
        }
        this.parent.dotNetRef.invokeMethodAsync(events.pasteImageUploadFailed, e);
        this.uploadObj.destroy();
        this.uploadObj = undefined;
    }
    private popupClose(popupObj: Popup, imgElem: Element, e: Object): void {
        this.parent.inputElement.contentEditable = 'true';
        // @ts-ignore-start
        this.parent.dotNetRef.invokeMethodAsync(events.pasteImageUploadSuccess, e).then((beforeUploadArgs: ImageUploadingEventArgs) => {
            // @ts-ignore-end
            if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                let url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name;
                (imgElem as HTMLImageElement).src = url;
                imgElem.setAttribute('alt', (e as MetaData).file.name);
            }
        });
        popupObj.close();
        (imgElem as HTMLElement).style.opacity = '1';
        this.uploadObj.destroy();
        this.uploadObj = undefined;
    }
    private refreshPopup(imageElement: HTMLElement, popupObj: Popup): void {
        let imgPosition: number = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        let rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            popupObj.relateTo = this.parent.inputElement;
            popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            popupObj.element.style.display = 'block';
        } else {
            if (popupObj) {
                popupObj.refreshPosition(imageElement);
                popupObj.element.style.display = 'block';
            }
        }
    }
    private base64ToFile(base64: string, filename: string): File {
        let baseStr: string[] = base64.split(',');
        let typeStr: string = baseStr[0].match(/:(.*?);/)[1];
        let extension: string = typeStr.split('/')[1];
        let decodeStr: string = atob(baseStr[1]);
        let strLen: number = decodeStr.length;
        let decodeArr: Uint8Array = new Uint8Array(strLen);
        while (strLen--) {
            decodeArr[strLen] = decodeStr.charCodeAt(strLen);
        }
        if (Browser.isIE || navigator.appVersion.indexOf('Edge') > -1) {
            let blob: Blob = new Blob([decodeArr], { type: extension });
            extend(blob, { name: filename + '.' + (!isNOU(extension) ? extension : '') });
            return blob as File;
        } else {
            return new File([decodeArr], filename + '.' + (!isNOU(extension) ? extension : ''), { type: extension });
        }
    }
    private imageFormatting(pasteArgs: Object, imgElement: { [key: string]: Element[] }): void {
        let imageElement: HTMLElement = createElement('span');
        imageElement.appendChild(imgElement.elements[0]);
        let imageValue: string = imageElement.innerHTML;
        let currentDocument: Document = document;
        let range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        if (this.parent.pasteCleanupSettings.prompt) {
            this.pasteDialog(imageValue, pasteArgs);
        } else if (this.parent.pasteCleanupSettings.plainText) {
            this.plainFormatting(imageValue, pasteArgs);
        } else if (this.parent.pasteCleanupSettings.keepFormat) {
            this.formatting(imageValue, false, pasteArgs);
        } else {
            this.formatting(imageValue, true, pasteArgs);
        }
    }
    public selectFormatting(option: string): void {
        if (this.newRTEHeight !== '') {
            (this.parent.element as HTMLElement).style.height = this.preRTEHeight;
        }
        if (option === 'KeepFormat') {
            this.formatting(this.currentValue, false, this.currentArgs);
        } else if (option === 'CleanFormat') {
            this.formatting(this.currentValue, true, this.currentArgs);
        } else if (option === 'PlainTextFormat') {
            this.plainFormatting(this.currentValue, this.currentArgs);
        }
    }
    private pasteDialog(value: string, args: Object): void {
        this.currentValue = value;
        this.currentArgs = args;
        this.preRTEHeight = this.parent.height.toString();
        this.newRTEHeight = '';
        if (this.parent.element.offsetHeight < 265) {
            this.newRTEHeight = (265 + 40).toString();
        }
        if (this.newRTEHeight !== '') {
            (this.parent.element as HTMLElement).style.height = this.newRTEHeight + 'px';
        }
        this.parent.openPasteDialog();
    }
    private formatting(value: string, clean: boolean, args: Object): void {
        let clipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }) as HTMLElement;
        if (this.isNotFromHtml && this.containsHtml) {
            value = this.splitBreakLine(value);
        }
        clipBoardElem.innerHTML = value;
        if (this.parent.pasteCleanupSettings.deniedTags !== null) {
            clipBoardElem = this.deniedTags(clipBoardElem);
        }
        if (clean) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        } else if (this.parent.pasteCleanupSettings.deniedAttrs !== null) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        if (this.parent.pasteCleanupSettings.allowedStyleProps !== null) {
            clipBoardElem = this.allowedStyle(clipBoardElem);
        }
        this.saveSelection.restore();
        clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
        let allImg: NodeListOf<HTMLImageElement> = clipBoardElem.querySelectorAll('img');
        for (let i: number = 0; i < allImg.length; i++) {
            allImg[i].classList.add(classes.CLS_PASTED_CONTENT_IMG);
        }
        this.addTempClass(clipBoardElem);
        if (clipBoardElem.textContent !== '' || !isNOU(clipBoardElem.querySelector('img')) ||
            !isNOU(clipBoardElem.querySelector('table'))) {
            this.parent.formatter.editorManager.execCommand(
                'inserthtml',
                'pasteCleanup',
                args,
                (returnArgs: IHtmlFormatterCallBack) => {
                    extend(args, { elements: returnArgs.elements, imageElements: returnArgs.imgElem }, true);
                    this.parent.formatter.onSuccess(this.parent, args);
                },
                clipBoardElem
            );
            this.removeTempClass();
            this.parent.observer.notify(events.toolbarRefresh, {});
            this.imgUploading(this.parent.inputElement);
        }
    }
    private addTempClass(clipBoardElem: HTMLElement): void {
        let allChild: HTMLCollection = clipBoardElem.children;
        for (let i: number = 0; i < allChild.length; i++) {
            allChild[i].classList.add(classes.CLS_RTE_PASTE_CONTENT);
        }
    }
    private removeTempClass(): void {
        let classElm: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.' + classes.CLS_RTE_PASTE_CONTENT);
        for (let i: number = 0; i < classElm.length; i++) {
            classElm[i].classList.remove(classes.CLS_RTE_PASTE_CONTENT);
            if (classElm[i].getAttribute('class') === '') {
                classElm[i].removeAttribute('class');
            }
        }
    }
    private sanitizeHelper(value: string): string {
        value = sanitizeHelper(value, this.parent);
        return value;
    }
    private plainFormatting(value: string, args: Object): void {
        let clipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }) as HTMLElement;
        clipBoardElem.innerHTML = value;
        this.detachInlineElements(clipBoardElem);
        this.getTextContent(clipBoardElem);
        if (clipBoardElem.textContent.trim() !== '') {
            if (!isNOU(clipBoardElem.firstElementChild) && clipBoardElem.firstElementChild.tagName !== 'BR') {
                let firstElm: Element | Node = clipBoardElem.firstElementChild;
                if (!isNOU(clipBoardElem.firstElementChild)) {
                    let spanElm: HTMLElement = createElement('span') as HTMLElement;
                    for (let i: number = 0, j: number = 0; i < firstElm.childNodes.length; i++, j++) {
                        if (firstElm.childNodes[i].nodeName === '#text') {
                            spanElm.appendChild(firstElm.childNodes[i]);
                            clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                            i--;
                        } else if (firstElm.childNodes[i].nodeName !== '#text' && j === 0) {
                            for (let k: number = 0; k < firstElm.childNodes[i].childNodes.length; k++) {
                                spanElm.appendChild(firstElm.childNodes[i].childNodes[k]);
                                clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                                k--;
                            }
                            i--;
                        } else {
                            break;
                        }
                    }
                    if (!firstElm.hasChildNodes()) {
                        detach(firstElm);
                    }
                }
            }
            this.removeEmptyElements(clipBoardElem);
            this.saveSelection.restore();
            clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
            this.addTempClass(clipBoardElem);
            this.parent.formatter.editorManager.execCommand(
                'inserthtml',
                'pasteCleanup',
                args,
                (returnArgs: IHtmlFormatterCallBack) => {
                    extend(args, { elements: returnArgs.elements, imageElements: returnArgs.imgElem }, true);
                    this.parent.formatter.onSuccess(this.parent, args);
                },
                clipBoardElem
            );
            this.removeTempClass();
        } else {
            this.saveSelection.restore();
            extend(args, { elements: [] }, true);
            this.parent.formatter.onSuccess(this.parent, args);
        }
    }
    private getTextContent(clipBoardElem: HTMLElement): void {
        for (let i: number = 0; i < this.blockNode.length; i++) {
            let inElem: NodeListOf<Element> = clipBoardElem.querySelectorAll(this.blockNode[i]);
            for (let j: number = 0; j < inElem.length; j++) {
                let parElem: HTMLElement;
                for (let k: number = 0, l: number = 0, preNode: string; k < inElem[j].childNodes.length; k++, l++) {
                    if (inElem[j].childNodes[k].nodeName === 'DIV' || inElem[j].childNodes[k].nodeName === 'P' ||
                        (inElem[j].childNodes[k].nodeName === '#text' &&
                        (inElem[j].childNodes[k].nodeValue.replace(/\u00a0/g, '&nbsp;') !== '&nbsp;') &&
                        inElem[j].childNodes[k].textContent.trim() === '')) {
                        parElem = inElem[j].childNodes[k].parentElement;
                        inElem[j].childNodes[k].parentElement.parentElement.insertBefore(
                            inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                        k--;
                    } else {
                        parElem = inElem[j].childNodes[k].parentElement;
                        if (preNode === 'text') {
                            let previousElem: Element = parElem.previousElementSibling;
                            previousElem.appendChild(inElem[j].childNodes[k]);
                        } else {
                            let divElement: HTMLElement = createElement('div', { id: 'newDiv' });
                            divElement.appendChild(inElem[j].childNodes[k]);
                            parElem.parentElement.insertBefore(divElement, parElem);
                        }
                        k--;
                        preNode = 'text';
                    }
                }
                if (!isNOU(parElem)) {
                    detach(parElem);
                }
            }
        }
        let allElems: NodeListOf<Element> = clipBoardElem.querySelectorAll('*');
        for (let i: number = 0; i < allElems.length; i++) {
            let allAtr: NamedNodeMap = allElems[i].attributes;
            for (let j: number = 0; j < allAtr.length; j++) {
                allElems[i].removeAttribute(allAtr[j].name);
                j--;
            }
        }
    }
    private detachInlineElements(clipBoardElem: HTMLElement): void {
        for (let i: number = 0; i < this.inlineNode.length; i++) {
            let inElem: NodeListOf<Element> = clipBoardElem.querySelectorAll(this.inlineNode[i]);
            for (let j: number = 0; j < inElem.length; j++) {
                let parElem: HTMLElement;
                for (let k: number = 0; k < inElem[j].childNodes.length; k++) {
                    parElem = inElem[j].childNodes[k].parentElement;
                    inElem[j].childNodes[k].parentElement.parentElement.insertBefore(
                        inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                    k--;
                }
                if (!isNOU(parElem)) {
                    detach(parElem);
                }
            }
        }
    }
    private findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
                element.parentElement.getAttribute('class') !== 'pasteContent') {
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
        let emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'BR') {
                let detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }
    private tagGrouping(deniedTags: string[]): string[] {
        let groupingTags: string[] = [...deniedTags];
        let keys: string[] = Object.keys(pasteCleanupGroupingTags);
        let values: string[][] = keys.map((key: string) => { return pasteCleanupGroupingTags[key]; });
        let addTags: string[] = [];
        for (let i: number = 0; i < groupingTags.length; i++) {
            //The value split using '[' because to reterive the tag name from the user given format which may contain tag with attributes
            if (groupingTags[i].split('[').length > 1) {
                groupingTags[i] = groupingTags[i].split('[')[0].trim();
            }
            if (keys.indexOf(groupingTags[i]) > -1) {
                for (let j: number = 0; j < values[keys.indexOf(groupingTags[i])].length; j++) {
                    if (groupingTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0 &&
                        addTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0) {
                        addTags.push(values[keys.indexOf(groupingTags[i])][j]);
                    }
                }
            }
        }
        return deniedTags = deniedTags.concat(addTags);
    }
    private attributesfilter(deniedTags: string[]): string[] {
        for (let i: number = 0; i < deniedTags.length; i++) {
            if (deniedTags[i].split('[').length > 1) {
                let userAttributes: string[] = deniedTags[i].split('[')[1].split(']')[0].split(',');
                let allowedAttributeArray: string[] = [];
                let deniedAttributeArray: string[] = [];
                for (let j: number = 0; j < userAttributes.length; j++) {
                    userAttributes[j].indexOf('!') < 0 ? allowedAttributeArray.push(userAttributes[j].trim())
                        : deniedAttributeArray.push(userAttributes[j].split('!')[1].trim());
                }
                let allowedAttribute: string = allowedAttributeArray.length > 1 ?
                    (allowedAttributeArray.join('][')) : (allowedAttributeArray.join());
                let deniedAttribute: string = deniedAttributeArray.length > 1 ?
                    deniedAttributeArray.join('][') : (deniedAttributeArray.join());
                if (deniedAttribute.length > 0) {
                    let select: string = allowedAttribute !== '' ? deniedTags[i].split('[')[0] +
                        '[' + allowedAttribute + ']' : deniedTags[i].split('[')[0];
                    deniedTags[i] = select + ':not([' + deniedAttribute + '])';
                } else {
                    deniedTags[i] = deniedTags[i].split('[')[0] + '[' + allowedAttribute + ']';
                }
            }
        }
        return deniedTags;
    }
    private deniedTags(clipBoardElem: HTMLElement): HTMLElement {
        let deniedTags: string[] = isNOU(this.parent.pasteCleanupSettings.deniedTags) ? [] :
            [...this.parent.pasteCleanupSettings.deniedTags];
        deniedTags = this.attributesfilter(deniedTags);
        deniedTags = this.tagGrouping(deniedTags);
        for (let i: number = 0; i < deniedTags.length; i++) {
            let removableElement: NodeListOf<Element> = clipBoardElem.querySelectorAll(
                deniedTags[i]
            );
            for (let j: number = removableElement.length - 1; j >= 0; j--) {
                let parentElem: Node = removableElement[j].parentNode;
                while (removableElement[j].firstChild) {
                    parentElem.insertBefore(removableElement[j].firstChild, removableElement[j]);
                }
                parentElem.removeChild(removableElement[j]);
            }
        }
        return clipBoardElem;
    }
    private deniedAttributes(clipBoardElem: HTMLElement, clean: boolean): HTMLElement {
        let deniedAttrs: string[] = isNOU(this.parent.pasteCleanupSettings.deniedAttrs) ? [] :
            [...this.parent.pasteCleanupSettings.deniedAttrs];
        if (clean) {
            deniedAttrs.push('style');
        }
        for (let i: number = 0; i < deniedAttrs.length; i++) {
            let removableAttrElement: NodeListOf<HTMLElement> = clipBoardElem.
                querySelectorAll('[' + deniedAttrs[i] + ']');
            for (let j: number = 0; j < removableAttrElement.length; j++) {
                removableAttrElement[j].removeAttribute(deniedAttrs[i]);
            }
        }
        return clipBoardElem;
    }
    private allowedStyle(clipBoardElem: HTMLElement): HTMLElement {
        let allowedStyleProps: string[] = isNOU(this.parent.pasteCleanupSettings.allowedStyleProps) ? [] :
            [...this.parent.pasteCleanupSettings.allowedStyleProps];
        allowedStyleProps.push('list-style-type', 'list-style');
        let styleElement: NodeListOf<HTMLElement> = clipBoardElem.querySelectorAll('[style]');
        for (let i: number = 0; i < styleElement.length; i++) {
            let allowedStyleValue: string = '';
            let allowedStyleValueArray: string[] = [];
            let styleValue: string[] = styleElement[i].getAttribute('style').split(';');
            for (let k: number = 0; k < styleValue.length; k++) {
                if (allowedStyleProps.indexOf(styleValue[k].split(':')[0].trim()) >= 0) {
                    allowedStyleValueArray.push(styleValue[k]);
                }
            }
            styleElement[i].removeAttribute('style');
            allowedStyleValue = allowedStyleValueArray.join(';').trim() === '' ?
                allowedStyleValueArray.join(';') : allowedStyleValueArray.join(';') + ';';
            if (allowedStyleValue) {
                styleElement[i].setAttribute('style', allowedStyleValue);
            }
        }
        return clipBoardElem;
    }
}