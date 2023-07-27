import { L10n, Browser, detach, closest, isNullOrUndefined as isNOU, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { ButtonPropsModel, Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { ContextMenu, DetailsView, FileManager as EJ2FileManager } from '@syncfusion/ej2-filemanager';
import { FileSelectEventArgs, NavigationPane, Toolbar } from '@syncfusion/ej2-filemanager';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { dispatchEvent } from '../base/util';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { IImageCommandsArgs, IRichTextEditor, IRenderer, IImageNotifyArgs, ICssClassArgs } from '../base/interface';

/**
 * `FileManager` module is used to display the directories and images inside the editor.
 */
export class FileManager {
    private i10n: L10n;
    public dialogObj: Dialog;
    private fileWrap: HTMLElement;
    private fileObj: EJ2FileManager;
    private contentModule: IRenderer;
    protected parent: IRichTextEditor;
    private inputUrl: HTMLInputElement;
    private selectObj: IImageNotifyArgs;
    private dlgButtons: ButtonPropsModel[];
    private dialogRenderObj: DialogRenderer;
    private rendererFactory: RendererFactory;

    private constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        EJ2FileManager.Inject(ContextMenu, DetailsView, NavigationPane, Toolbar);
        this.parent = parent;
        this.i10n = locator.getService<L10n>('rteLocale');
        this.dialogRenderObj = locator.getService<DialogRenderer>('dialogRenderObject');
        this.rendererFactory = locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private initialize(): void {
        this.parent.fileManagerModule = this;
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
    }

    private render(e: IImageNotifyArgs): void {
        let dlgInsert: string;
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
            dlgInsert = this.parent.localeObj.getConstant('dialogUpdate');
        } else {
            dlgInsert = this.i10n.getConstant('dialogInsert');
        }
        const dlgHeader: string = this.parent.localeObj.getConstant('fileDialogHeader');
        const dlgCancel: string = this.i10n.getConstant('dialogCancel');
        this.dlgButtons = [{
            click: this.insertImageUrl.bind(this),
            buttonModel: { content: dlgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
        },
        {
            // eslint-disable-next-line
            click: (e: MouseEvent) => {
                this.cancelDialog();
            },
            buttonModel: { cssClass: 'e-flat e-cancel', content: dlgCancel }
        }];
        this.dlgButtons[0].buttonModel.disabled = true;
        this.selectObj = { selection: e.selection, args: e.args, selectParent: e.selectParent };
        const dlgTarget: HTMLElement = this.parent.createElement('div', {
            className: 'e-rte-file-manager-dialog', id: this.parent.getID() + '_file-manager-dialog',
            attrs: { 'aria-owns': this.parent.getID() }
        });
        document.body.appendChild(dlgTarget);
        this.fileWrap = this.parent.createElement('div', {
            id: this.parent.getID() + '_rte-file-manager', className: 'e-img-file-wrap'
        });
        dlgTarget.appendChild(this.fileWrap);
        dlgTarget.appendChild(this.getInputUrlElement());
        const dialogModel: DialogModel = {
            visible: false,
            isModal: true, header: dlgHeader,
            target: document.body, locale: this.parent.locale,
            enableRtl: this.parent.enableRtl, cssClass: classes.CLS_RTE_ELEMENTS,
            animationSettings: { effect: 'None' },
            showCloseIcon: true, closeOnEscape: true, width: '720px', height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: this.dlgButtons,
            created: this.renderFileManager.bind(this),
            close: (e: { [key: string]: object }) => {
                this.parent.isBlur = false;
                if (e && (e.event as { [key: string]: string }).returnValue) {
                    this.selectObj.selection.restore();
                }
                this.destroyComponents();
                this.dialogRenderObj.close(e);
            }
        };
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(dlgTarget);
        this.dialogObj.show(Browser.isDevice ? true : false);
        this.setCssClass({cssClass: this.parent.cssClass});
    }

    // eslint-disable-next-line @typescript-eslint/tslint/config
    private setCssClass(e: ICssClassArgs) {
        if (this.dialogObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                this.dialogObj.setProperties({ cssClass: (this.dialogObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                this.dialogObj.setProperties({ cssClass: (this.dialogObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private renderFileManager(): void {
        // eslint-disable-next-line
        const proxy: FileManager = this;
        this.fileObj = new EJ2FileManager({
            allowMultiSelection: false,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            path: this.parent.fileManagerSettings.path,
            view: this.parent.fileManagerSettings.view,
            enablePersistence: this.parent.enablePersistence,
            cssClass: this.parent.fileManagerSettings.cssClass,
            sortOrder: this.parent.fileManagerSettings.sortOrder,
            ajaxSettings: this.parent.fileManagerSettings.ajaxSettings,
            showThumbnail: this.parent.fileManagerSettings.showThumbnail,
            rootAliasName: this.parent.fileManagerSettings.rootAliasName,
            uploadSettings: this.parent.fileManagerSettings.uploadSettings,
            searchSettings: this.parent.fileManagerSettings.searchSettings,
            toolbarSettings: this.parent.fileManagerSettings.toolbarSettings,
            showHiddenItems: this.parent.fileManagerSettings.showHiddenItems,
            allowDragAndDrop: this.parent.fileManagerSettings.allowDragAndDrop,
            showFileExtension: this.parent.fileManagerSettings.showFileExtension,
            detailsViewSettings: this.parent.fileManagerSettings.detailsViewSettings,
            contextMenuSettings: this.parent.fileManagerSettings.contextMenuSettings,
            navigationPaneSettings: this.parent.fileManagerSettings.navigationPaneSettings,
            beforeSend: this.parent.fileManagerSettings.beforeSend,
            fileSelect: (e: FileSelectEventArgs) => {
                const selectedFile: { [key: string]: string } = e.fileDetails as { [key: string]: string };
                if (selectedFile.isFile && proxy.parent.insertImageSettings.allowedTypes.indexOf(selectedFile.type) > -1) {
                    proxy.inputUrl.value = proxy.parent.fileManagerSettings.ajaxSettings.getImageUrl + '?path=' +
                    (selectedFile.filterPath && selectedFile.filterPath.replace(/\\/g, '/')) + selectedFile.name;
                    this.dlgButtons[0].buttonModel.disabled = false;
                } else {
                    proxy.inputUrl.value = '';
                    this.dlgButtons[0].buttonModel.disabled = true;
                }
                this.dialogObj.buttons = this.dlgButtons;
            },
            created: () => {
                this.inputUrl.removeAttribute('disabled');
            },
            success: () => {
                this.fileObj.refreshLayout();
            }
        });
        if (Browser.isDevice) {
            this.fileObj.height = '85%';
        }
        this.fileObj.appendTo(this.fileWrap);
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
    }

    private getInputUrlElement(): HTMLElement {
        const imgUrl: HTMLElement = this.parent.createElement('div', { className: 'imgUrl' });
        const urlLabel: HTMLElement = this.parent.createElement('div', { className: 'e-rte-label' });
        urlLabel.innerHTML = '<label for="rteSample_img_url">' + this.i10n.getConstant('linkWebUrl') + '</label>';
        imgUrl.appendChild(urlLabel);
        const placeUrl: string = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false', disabled: 'true' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    }

    // eslint-disable-next-line
    private insertImageUrl(e: MouseEvent): void {
        const url: string = (this.inputUrl as HTMLInputElement).value;
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (url !== '') {
            if (this.parent.editorMode === 'HTML' &&
                isNOU(closest(this.selectObj.selection.range.startContainer.parentNode, '#' + this.contentModule.getPanel().id))) {
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.selectObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                this.selectObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const regex: RegExp = /[\w-]+.(jpg|png|jpeg|gif)/g;
            const matchUrl: string = (!isNOU(url.match(regex)) && this.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            const value: IImageCommandsArgs = {
                cssClass: (this.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: this.selectObj.selection, altText: matchUrl, selectParent: this.selectObj.selectParent,
                width: {
                    width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                    maxWidth: this.parent.getInsertImgMaxWidth()
                },
                height: {
                    height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                    maxHeight: this.parent.insertImageSettings.maxHeight
                }
            };
            this.parent.formatter.process(this.parent, this.selectObj.args, (this.selectObj.args as ClickEventArgs).originalEvent, value);
            this.dialogObj.hide({ returnValue: false } as Event);
        }
    }

    private cancelDialog(): void {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true } as Event);
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        const prevEle: Element = target.nodeName !== '#document' && !isNOU(target.previousElementSibling) && target.previousElementSibling;
        if (!isNOU(this.dialogObj) &&
            (!closest(target, '#' + this.parent.getID() + '_file-manager-dialog') &&
            !closest(target, '#' + this.parent.getID() + '_rte-file-manager_tb_sortby-popup') &&
            !closest(target, '#' + this.parent.getID() + '_rte-file-manager_tb_view-popup') &&
            !closest(target, '#' + this.parent.getID() + '_rte-file-manager_contextmenu') &&
            (!(!isNOU(closest(target, '.e-contextmenu-wrapper')) &&
            closest(target, '.e-contextmenu-wrapper').querySelector('#' + this.parent.getID() + '_rte-file-manager_contextmenu'))) &&
            (!isNOU(prevEle) && !prevEle.classList.contains('e-rte-file-manager-dialog')) &&
            (!isNOU(prevEle) && prevEle.id !== this.parent.getID() + '_rte-file-manager_contextmenu'))
        ) {
            this.dialogObj.hide({ returnValue: true } as Event);
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        } else {
            this.parent.isRTE = true;
        }
    }

    private addEventListener(): void {
        this.parent.on(events.initialEnd, this.initialize, this);
        this.parent.on(events.renderFileManager, this.render, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
        this.parent.off(events.initialEnd, this.initialize);
        this.parent.off(events.renderFileManager, this.render);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.destroy, this.destroy);
    }

    private destroyComponents(): void {
        if (this.fileObj) {
            this.fileObj.destroy();
            this.fileObj = null;
        }
        if (this.dialogObj) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    }

    private destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.destroyComponents();
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     * @hidden
     */
    private getModuleName(): string {
        return 'fileManager';
    }
}
