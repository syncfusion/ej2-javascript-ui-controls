import * as events from '../base/constant';
import { IRichTextEditor, NotifyArgs, IRenderer } from '../base/interface';
import { Dialog } from '@syncfusion/ej2-popups';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { isNullOrUndefined as isNOU, L10n, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT } from '../base/classes';
import { CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL, CLS_RTE_DIALOG_MIN_HEIGHT } from '../base/classes';
import { pasteCleanupGroupingTags } from '../../common/config';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from './../../common/constant';
import { ServiceLocator } from '../services/service-locator';
import { RenderType } from '../base/enum';

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
  private inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
  constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
    this.parent = parent;
    this.locator = serviceLocator;
    this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
    this.i10n = serviceLocator.getService<L10n>('rteLocale');
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
    let args: Object = {
      requestType: 'Paste',
      editorMode: this.parent.editorMode,
      event: e
    };
    let value: string = null;
    if (e.args && !isNOU((e.args as ClipboardEvent).clipboardData)) {
      value = (e.args as ClipboardEvent).clipboardData.getData('text/html');
    }
    if (e.args && value !== null && this.parent.editorMode === 'HTML') {
      let regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
      if (value.length === 0 || value.match(regex)) {
        value = (e.args as ClipboardEvent).clipboardData.getData('text/plain');
        let file: File = e && (e.args as ClipboardEvent).clipboardData &&
          (e.args as ClipboardEvent).clipboardData.items.length > 0 ?
          (e.args as ClipboardEvent).clipboardData.items[0].getAsFile() : null;
        this.parent.notify(events.paste, { file: file, args: e.args, text: value });
      } else if (value.length > 0) {
        this.parent.formatter.editorManager.observer.notify(EVENTS.MS_WORD_CLEANUP, {
          args: e.args,
          text: e.text,
          callBack: (a: string) => {
            value = a;
          }
        });
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let currentDocument: Document = this.contentRenderer.getDocument();
        let range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        if (this.parent.pasteCleanupSettings.prompt) {
          (e.args as ClipboardEvent).preventDefault();
          this.pasteDialog(value);
        } else if (this.parent.pasteCleanupSettings.plainText) {
          (e.args as ClipboardEvent).preventDefault();
          this.plainFormatting(value);
        } else if (this.parent.pasteCleanupSettings.keepFormat) {
          (e.args as ClipboardEvent).preventDefault();
          this.formatting(value, false);
        } else {
          (e.args as ClipboardEvent).preventDefault();
          this.formatting(value, true);
        }
      }
    }
    setTimeout(() => { this.parent.formatter.onSuccess(this.parent, args); }, 0);
  }

  private radioRender(): void {
    let keepRadioButton: RadioButton = new RadioButton({ label: 'Keep', name: 'pasteOption', checked: true });
    let keepFormatElement: HTMLElement = this.parent.element.querySelector('#keepFormating');
    keepRadioButton.appendTo(keepFormatElement);
    let cleanRadioButton: RadioButton = new RadioButton({ label: 'Clean', name: 'pasteOption' });
    let cleanFormatElement: HTMLElement = this.parent.element.querySelector('#cleanFormat');
    cleanRadioButton.appendTo(cleanFormatElement);
    let plainTextRadioButton: RadioButton = new RadioButton({ label: 'Plain Text', name: 'pasteOption' });
    let plainTextElement: HTMLElement = this.parent.element.querySelector('#plainTextFormat');
    plainTextRadioButton.appendTo(plainTextElement);
  }

  private selectFormatting(value: string): void {
    let keepFormatElement: HTMLInputElement = this.parent.element.querySelector('#keepFormating');
    let cleanFormatElement: HTMLInputElement = this.parent.element.querySelector('#cleanFormat');
    if (keepFormatElement.checked) {
      this.formatting(value, false);
    } else if (cleanFormatElement.checked) {
      this.formatting(value, true);
    } else {
      this.plainFormatting(value);
    }
  }
  private pasteDialog(value: string): void {
    let dialog: Dialog = new Dialog({
      buttons: [
        {
          click: () => {
            if (!dialog.isDestroyed) {
              this.selectFormatting(value);
              dialog.hide();
              dialog.destroy();
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
    });
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

  private formatting(value: string, clean: boolean): void {
    let clipBoardElem: HTMLElement = this.parent.createElement('span') as HTMLElement;
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
    this.parent.executeCommand('insertHTML', clipBoardElem);
    this.parent.notify(events.toolbarRefresh, {});
  }

  //Plain Formatting
  private plainFormatting(value: string): void {
    let clipBoardElem: HTMLElement = this.parent.createElement('div') as HTMLElement;
    clipBoardElem.innerHTML = value;
    this.detachInlineElements(clipBoardElem);
    let text: string = this.getTextContent(clipBoardElem);
    let resultElement: HTMLElement = this.parent.createElement('span') as HTMLElement;
    resultElement.innerHTML = text;
    this.saveSelection.restore();
    this.parent.executeCommand('insertHTML', resultElement);
  }
  private detachInlineElements(element: HTMLElement): void {
    while (!isNullOrUndefined(element)) {
      let isInlineElement: boolean = false;
      for (let j: number = 0; j < this.inlineNode.length && !isInlineElement; j++) {
        if (element.tagName.toLocaleLowerCase() === this.inlineNode[j]) {
          let node: HTMLElement = (element.nextElementSibling as HTMLElement) ?
          (element.nextElementSibling as HTMLElement) : (element.parentElement.nextElementSibling as HTMLElement);
          if (!isNullOrUndefined(element.childNodes[0]) && element.childNodes[0].textContent !== '') {
            element.parentElement.insertBefore(this.getTextNode(element), element);
          }
          detach(element);
          element = node;
          isInlineElement = true;
        }
      }
      if (!isNullOrUndefined(element)) {
        if (isInlineElement) {
          element = element;
        } else if (element.firstElementChild) {
          element = element.firstElementChild as HTMLElement;
        } else if (element.nextElementSibling) {
          element = element.nextElementSibling as HTMLElement;
        } else if (element.parentElement.nextElementSibling) {
          element = element.parentElement.nextElementSibling as HTMLElement;
        } else {
          element = null;
        }
      } else {
        element = null;
      }
    }
  }
  private getTextNode(element: Node): Node {
    let rootElement: HTMLElement = this.parent.createElement('span');
    rootElement.innerHTML = element.textContent;
    return rootElement.childNodes[0];
  }

  private insertAfter(newNode: Element, referenceNode: Element): void {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  private getTextContent(element: Element): string {
    let result: string;
    let text: string;
    result = '';
    let brElement: NodeListOf<HTMLBRElement> = element.nodeType === 1 ? element.querySelectorAll('br') : null;
    if (brElement) {
      for (let i: number = 0; i < brElement.length; i++) {
        if (!isNullOrUndefined(brElement[i].previousSibling)) {
          let resultElement: HTMLElement = this.parent.createElement('div') as HTMLElement;
          resultElement.innerHTML = brElement[i].previousSibling.textContent;
          detach(brElement[i].previousSibling);
          brElement[i].parentElement.insertBefore(resultElement, brElement[i]);
        }
        if (i + 1 === brElement.length && !isNullOrUndefined(brElement[i].nextSibling)) {
          let divNextElement: HTMLElement = this.parent.createElement('div') as HTMLElement;
          divNextElement.innerHTML = brElement[i].nextSibling.textContent;
          detach(brElement[i].nextSibling);
          this.insertAfter(divNextElement, brElement[i]);
        }
        detach(brElement[i]);
      }
    }
    if (element.children.length === 0 && element.textContent.trim() !== '') {
      text = '<p>' + element.textContent + '</p>';
      result += text;
    } else {
      for (let i: number = 0; i < element.children.length; i++) {
        if (!isNullOrUndefined(element.children[i])) {
          text = this.getTextContent(element.children[i] as Element);
        } else {
          text = '<p>' + element.children[i].textContent + '</p>';
        }
        result += text;
      }
    }
    return result;
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
      for (let k: number = 0; k < allowedStyleProps.length; k++) {
        for (let j: number = 0; j < styleValue.length; j++) {
          if (!styleElement[i].getAttribute('style').split(';')[j]
            .trim().indexOf(allowedStyleProps[k] + ':')) {
            allowedStyleValueArray.push(styleElement[i].getAttribute('style').split(';')[j]);
            k++;
          }
        }
      }
      styleElement[i].removeAttribute('style');
      allowedStyleValue = allowedStyleValueArray.join(';');
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
