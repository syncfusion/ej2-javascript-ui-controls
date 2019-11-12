import * as events from '../base/constant';
import { IRichTextEditor, NotifyArgs, IRenderer } from '../base/interface';
import { Dialog, DialogModel, Popup } from '@syncfusion/ej2-popups';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { isNullOrUndefined as isNOU, L10n, isNullOrUndefined, detach, isBlazor, extend, addClass } from '@syncfusion/ej2-base';
import { CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT } from '../base/classes';
import { CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL, CLS_RTE_DIALOG_MIN_HEIGHT } from '../base/classes';
import { pasteCleanupGroupingTags } from '../../common/config';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from './../../common/constant';
import { ServiceLocator } from '../services/service-locator';
import { RenderType } from '../base/enum';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { Uploader, MetaData } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import { IHtmlFormatterCallBack } from '../../common';
import { SanitizeHtmlHelper } from './sanitize-helper';
/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
export class PasteCleanup {
  private parent: IRichTextEditor;
  private renderFactory: RendererFactory;
  private locator: ServiceLocator;
  private contentRenderer: IRenderer;
  private i10n: L10n;
  private saveSelection: NodeSelection;
  private nodeSelectionObj: NodeSelection;
  private dialogRenderObj: DialogRenderer;
  private popupObj: Popup;
  private uploadObj: Uploader;
  private sanitize: SanitizeHtmlHelper;
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
  private isNotFromHtml: boolean = false;
  private containsHtml: boolean = false;
  constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
    this.parent = parent;
    this.locator = serviceLocator;
    this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
    this.i10n = serviceLocator.getService<L10n>('rteLocale');
    this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
    this.sanitize = new SanitizeHtmlHelper();
    this.addEventListener();
  }

  private addEventListener(): void {
    this.nodeSelectionObj = new NodeSelection();
    if (this.parent.isDestroyed) { return; }
    this.parent.on(events.pasteClean, this.pasteClean, this);
    this.parent.on(events.destroy, this.destroy, this);
  }

  private destroy(): void {
    this.removeEventListener();
  }
  private removeEventListener(): void {
    if (this.parent.isDestroyed) { return; }
    this.parent.off(events.pasteClean, this.pasteClean);
    this.parent.off(events.destroy, this.destroy);
  }

  private pasteClean(e?: NotifyArgs): void {
    let args: { [key: string]: string |NotifyArgs } = {
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
        this.parent.notify(events.paste, {
          file: file,
          args: e.args,
          text: value,
          callBack: (b: string | object) => {
            imageproperties = b;
            if (typeof(imageproperties) === 'object') {
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
          let divElement: HTMLElement = this.parent.createElement('div');
          divElement.innerHTML = this.splitBreakLine(value);
          value = divElement.innerHTML;
        }
      } else if (value.length > 0) {
        this.parent.formatter.editorManager.observer.notify(EVENTS.MS_WORD_CLEANUP, {
          args: e.args,
          text: e.text,
          allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
          callBack: (a: string) => {
            value = a;
          }
        });
      }
      this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
      let currentDocument: Document = this.contentRenderer.getDocument();
      let range: Range = this.nodeSelectionObj.getRange(currentDocument);
      this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
      if (this.parent.pasteCleanupSettings.prompt) {
        (e.args as ClipboardEvent).preventDefault();
        this.pasteDialog(value, args);
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
    let base64Src: string[] = [];
    let imgName: string[] = [];
    let imgElem: Element[] = [];
    let allImgElm: NodeListOf<HTMLImageElement> = elm.querySelectorAll('img');
    if (allImgElm.length > 0) {
      for (let i: number = 0; i < allImgElm.length; i++) {
        if (!isNOU(allImgElm[i].getAttribute('id')) && allImgElm[i].getAttribute('id').indexOf('msWordImg') >= 0) {
          imgElem.push(allImgElm[i]);
        }
      }
      if (imgElem.length > 0) {
        for (let i: number = 0; i < imgElem.length; i++) {
          base64Src.push(imgElem[i].getAttribute('src'));
          imgName.push(imgElem[i].getAttribute('id'));
        }
        let fileList: File[] = [];
        for (let i: number = 0; i < base64Src.length; i++) {
            fileList.push(this.base64ToFile(base64Src[i], imgName[i]));
        }
        for (let i: number = 0; i < fileList.length; i++) {
          this.uploadMethod(fileList[i], imgElem[i]);
          imgElem[i].removeAttribute('id');
        }

      }
    }
  }

  private uploadMethod(fileList: File, imgElem: Element): void {
      let uploadEle: HTMLInputElement | HTMLElement = document.createElement('div');
      document.body.appendChild(uploadEle);
      uploadEle.setAttribute('display', 'none');
      (imgElem as HTMLElement).style.opacity = '0.5';
      let popupEle: HTMLElement = this.parent.createElement('div');
      this.parent.element.appendChild(popupEle);
      let contentEle:  HTMLInputElement | HTMLElement = this.parent.createElement('input', {
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
      addClass([popupObj.element], [classes.CLS_POPUP_OPEN, classes.CLS_RTE_UPLOAD_POPUP]);
      let timeOut: number = fileList.size > 1000000 ? 300 : 100;
      setTimeout(() => { this.refreshPopup(imgElem as HTMLElement, popupObj); }, timeOut);

      let uploadObj: Uploader = new Uploader({
        asyncSettings: {
            saveUrl: this.parent.insertImageSettings.saveUrl
        },
        cssClass: classes.CLS_RTE_DIALOG_UPLOAD,
        dropArea: this.parent.inputElement,
        allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
        success: (e: object) => {
          setTimeout(() => { this.popupClose(popupObj, uploadObj, imgElem, e); }, 900); },
        failure: (e: Object) => {
          if (popupObj) {
            popupObj.close();
          }
          this.parent.trigger(events.imageUploadFailed, e);
        }
      });
      uploadObj.appendTo(popupObj.element.childNodes[0] as HTMLElement);

      /* tslint:disable */
      let fileData: any = [{
          name: fileList.name,
          rawFile: fileList,
          size: fileList.size,
          type: fileList.type,
          validationMessages: { minSize: "", maxSize: "" },
          statusCode: '1'
      }];
      (uploadObj as any).createFileList(fileData);
      (uploadObj as any).filesData.push(fileData[0]);
      /* tslint:enable */
      uploadObj.upload(fileData);
      (popupObj.element.getElementsByClassName('e-file-select-wrap')[0] as HTMLElement).style.display = 'none';
      detach(popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap') as HTMLElement);
  }
  private popupClose(popupObj: Popup, uploadObj: Uploader, imgElem: Element, e: Object): void {
    this.parent.trigger(events.imageUploadSuccess, e, (e: object) => {
      if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
          let url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name + '.' +
          (e as MetaData).file.type.split('image/')[1];
          (imgElem as HTMLImageElement).src = url;
          imgElem.setAttribute('alt', (e as MetaData).file.name);
      }
  });
    popupObj.close();
    (imgElem as HTMLElement).style.opacity = '1';
    uploadObj.destroy();
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
    let decodeStr: string = atob(baseStr[1]);
    let strLen: number = decodeStr.length;
    let decodeArr: Uint8Array = new Uint8Array(strLen);
    while (strLen--) {
        decodeArr[strLen] = decodeStr.charCodeAt(strLen);
    }
    return new File([decodeArr], filename, {type: typeStr});
  }
  /**
   * Method for image formatting when pasting
   * @hidden
   */
  private imageFormatting(pasteArgs: Object, imgElement: { [key: string]: Element[] }): void {
    let imageElement: HTMLElement = this.parent.createElement('span');
    imageElement.appendChild(imgElement.elements[0]);
    let imageValue: string = imageElement.innerHTML;
    this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
    let currentDocument: Document = this.contentRenderer.getDocument();
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

  private radioRender(): void {
    let keepRadioButton: RadioButton = new RadioButton({ label: this.i10n.getConstant('keepFormat'), name: 'pasteOption', checked: true });
    keepRadioButton.isStringTemplate = true;
    let keepFormatElement: HTMLElement = this.parent.element.querySelector('#keepFormating');
    keepRadioButton.appendTo(keepFormatElement);
    let cleanRadioButton: RadioButton = new RadioButton({ label: this.i10n.getConstant('cleanFormat'), name: 'pasteOption' });
    cleanRadioButton.isStringTemplate = true;
    let cleanFormatElement: HTMLElement = this.parent.element.querySelector('#cleanFormat');
    cleanRadioButton.appendTo(cleanFormatElement);
    let plainTextRadioButton: RadioButton = new RadioButton({ label: this.i10n.getConstant('plainText'), name: 'pasteOption' });
    plainTextRadioButton.isStringTemplate = true;
    let plainTextElement: HTMLElement = this.parent.element.querySelector('#plainTextFormat');
    plainTextRadioButton.appendTo(plainTextElement);
  }

  private selectFormatting(value: string, args: Object, keepChecked: boolean, cleanChecked: boolean): void {
    if (keepChecked) {
      this.formatting(value, false, args);
    } else if (cleanChecked) {
      this.formatting(value, true, args);
    } else {
      this.plainFormatting(value, args);
    }
  }
  private pasteDialog(value: string, args: Object): void {
    let dialogModel: DialogModel = {
      buttons: [
        {
          click: () => {
            if (!dialog.isDestroyed) {
              let keepChecked: boolean = (this.parent.element.querySelector('#keepFormating') as HTMLInputElement).checked;
              let cleanChecked: boolean = (this.parent.element.querySelector('#cleanFormat') as HTMLInputElement).checked;
              dialog.hide();
              let argument: Dialog = isBlazor() ? null : dialog;
              this.dialogRenderObj.close(argument);
              dialog.destroy();
              this.selectFormatting(value, args, keepChecked, cleanChecked);
            }
          },
          buttonModel: {
            isPrimary: true,
            cssClass: 'e-flat ' + CLS_RTE_PASTE_OK,
            content: this.i10n.getConstant('pasteDialogOk')
          }
        },
        {
          click: () => {
            if (!dialog.isDestroyed) {
              dialog.hide();
              let args: Dialog = isBlazor() ? null : dialog;
              this.dialogRenderObj.close(args);
              dialog.destroy();
            }
          },
          buttonModel: {
            cssClass: 'e-flat ' + CLS_RTE_PASTE_CANCEL,
            content: this.i10n.getConstant('pasteDialogCancel')
          }
        }
      ],
      header: this.i10n.getConstant('pasteFormat'),
      content: this.i10n.getConstant('pasteFormatContent') + '<br/><div><div style="padding-top:24px;">' +
        '<input type="radio" class="' + CLS_RTE_PASTE_KEEP_FORMAT + '" id="keepFormating"/>' +
        '</div><div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_REMOVE_FORMAT + '" id="cleanFormat"/></div>' +
        '<div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_PLAIN_FORMAT + '" id="plainTextFormat"/></div></div>',
      target: this.parent.element,
      width: '300px',
      height: '265px',
      cssClass: CLS_RTE_DIALOG_MIN_HEIGHT,
      isModal: true
    };
    let dialog: Dialog =  this.dialogRenderObj.render(dialogModel);
    let rteDialogWrapper: HTMLElement = this.parent.element.querySelector('#' + this.parent.getID()
      + '_pasteCleanupDialog');
    if (rteDialogWrapper !== null && rteDialogWrapper.innerHTML !== '') {
      this.destroyDialog(rteDialogWrapper);
    }
    if (rteDialogWrapper === null) {
      rteDialogWrapper = this.parent.createElement('div', {
        id: this.parent.getID() + '_pasteCleanupDialog'
      }) as HTMLElement;
      this.parent.element.appendChild(rteDialogWrapper);
    }
    dialog.appendTo(rteDialogWrapper);
    this.radioRender();
    dialog.show();
  }

  private destroyDialog(rteDialogWrapper: HTMLElement): void {
    let rteDialogContainer: HTMLElement = this.parent.element.querySelector('.e-dlg-container');
    detach(rteDialogContainer);
    let rteDialogWrapperChildLength: number = rteDialogWrapper.children.length;
    for (let i: number = 0; i < rteDialogWrapperChildLength; i++) {
      detach(rteDialogWrapper.children[0]);
    }
  }

  private formatting(value: string, clean: boolean, args: Object): void {
    let clipBoardElem: HTMLElement = this.parent.createElement(
      'div', { className: 'pasteContent', styles: 'display:inline;'}) as HTMLElement;
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
    this.parent.formatter.editorManager.execCommand(
      'inserthtml',
      'pasteCleanup',
      args,
      (returnArgs: IHtmlFormatterCallBack) => {
        extend(args, {elements: [returnArgs.elements]}, true);
        this.parent.formatter.onSuccess(this.parent, args);
      },
      clipBoardElem
    );
    this.parent.notify(events.toolbarRefresh, {});
    if (!isNOU(this.parent.insertImageSettings.saveUrl)) {
      this.imgUploading(this.parent.inputElement);
    }
  }

  private sanitizeHelper(value: string): string {
    value = this.sanitize.initialize(value, this.parent);
    return value;
  }

  //Plain Formatting
  private plainFormatting(value: string, args: Object): void {
    let clipBoardElem: HTMLElement = this.parent.createElement(
      'div', { className: 'pasteContent', styles: 'display:inline;'}) as HTMLElement;
    clipBoardElem.innerHTML = value;
    this.detachInlineElements(clipBoardElem);
    this.getTextContent(clipBoardElem);
    if (clipBoardElem.textContent.trim() !== '') {
      if (!isNOU(clipBoardElem.firstElementChild) && clipBoardElem.firstElementChild.tagName !== 'BR') {
        let firstElm: Element | Node = clipBoardElem.firstElementChild;
        if (!isNOU(clipBoardElem.firstElementChild)) {
          let spanElm: HTMLElement = this.parent.createElement('span') as HTMLElement;
          for (let i: number = 0, j: number = 0;  i < firstElm.childNodes.length; i++, j++) {
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
      this.parent.formatter.editorManager.execCommand(
        'inserthtml',
        'pasteCleanup',
        args,
        (returnArgs: IHtmlFormatterCallBack) => {
          extend(args, {elements: []}, true);
          this.parent.formatter.onSuccess(this.parent, args);
        },
        clipBoardElem
      );
    } else {
      this.saveSelection.restore();
      extend(args, {elements: []}, true);
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
          (inElem[j].childNodes[k].nodeName === '#text' && (inElem[j].childNodes[k].nodeValue.replace(/\u00a0/g, '&nbsp;') !== '&nbsp;') &&
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
              let divElement: HTMLElement = this.parent.createElement('div', { id: 'newDiv' } );
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

  //GroupingTags
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

  //Filter Attributes in Denied Tags
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
        let deniedAttribute: string = deniedAttributeArray.length > 1 ? deniedAttributeArray.join('][') : (deniedAttributeArray.join());
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

  //Denied Tags
  private deniedTags(clipBoardElem: HTMLElement): HTMLElement {
    let deniedTags: string[] = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedTags) ? [] :
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

  //Denied Attributes
  private deniedAttributes(clipBoardElem: HTMLElement, clean: boolean): HTMLElement {
    let deniedAttrs: string[] = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedAttrs) ? [] :
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

  //Allowed Style Properties
  private allowedStyle(clipBoardElem: HTMLElement): HTMLElement {
    let allowedStyleProps: string[] = isNullOrUndefined(this.parent.pasteCleanupSettings.allowedStyleProps) ? [] :
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

  /**
   * For internal use only - Get the module name.
   */
  private getModuleName(): string {
    return 'pasteCleanup';
  }
}
