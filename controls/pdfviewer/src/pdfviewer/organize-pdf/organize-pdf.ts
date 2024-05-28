/* eslint-disable */
import { PdfViewer, PdfViewerBase, AjaxHandler, ISize } from '../index';
import { createElement, Browser, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs, Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Toolbar, ClickEventArgs, ContextMenu, MenuItemModel, BeforeOpenCloseMenuEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { getComponent } from '@syncfusion/ej2-base';

/**
 * The `PageOrganizer` module is used to handle page organize operations of PDF viewer.
 */
export class PageOrganizer {

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private rotateRightButton: HTMLButtonElement;
    private rotateLeftButton: HTMLButtonElement;
    private insertRightButton: HTMLButtonElement;
    private insertLeftButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;
    private toolbar: Toolbar;
    /**
     * @private
     */
    public dataDetails: any[] = [];
    private thumbnail: HTMLElement;
    private imageContainer: HTMLElement;
    private organizeDialog: Dialog;
    private tileAreaDiv: HTMLElement;
    private thumbnailImage: HTMLImageElement;
    private pageLink: HTMLElement;
    private previewRequestHandler: AjaxHandler;
    private contextMenuObj: ContextMenu;
    private mobileContextMenu: MenuItemModel[] = [];
    /**
     * @private
     */
    public organizePagesCollection: OrganizeDetails[] = [];
    private tempOrganizePagesCollection: OrganizeDetails[] = [];
    private isSkipRevert: boolean = false;
    private isAllImagesReceived: boolean = false;
    private selectAllCheckBox: CheckBox;
    private totalCheckedCount: number;

    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     */
    public createOrganizeWindow(isReConstruct?: boolean): void {
        const elementID: string = this.pdfViewer.element.id;
        // eslint-disable-next-line max-len
        if(!isNullOrUndefined(document.getElementById(elementID + '_organize_window')) && !isNullOrUndefined(this.organizeDialog)){
            this.organizeDialog.show(true);
            return;
        }
        // eslint-disable-next-line max-len
        const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_organize_window', className: 'e-pv-organize-window' });
        const contentRegion: HTMLElement = this.createContentArea();
        this.pdfViewerBase.mainContainer.appendChild(dialogDiv);
        this.organizeDialog = new Dialog({
            showCloseIcon: true,
            closeOnEscape: true,
            isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Organize Pages'),
            target: this.pdfViewerBase.mainContainer,
            content: contentRegion,
            visible: false,
            close: (args) => {
                if(!this.isSkipRevert){
                    this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
                    this.destroyDialogWindow();
                    this.createOrganizeWindow(true);
                }
                else{
                    this.isSkipRevert = false;
                }
            }
        });
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const pagecount = this.pdfViewerBase.pageCount;
            this.organizeDialog.buttons = [
                // eslint-disable-next-line max-len
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save As'), isPrimary: true }, click: this.onSaveasClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Total') + ' ' + pagecount.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages') , cssClass: 'e-pv-organize-total-page-button', disabled: true } }
            ];
        }
        // Listen to window resize events to update the dialog size dynamically
        window.addEventListener('resize', () => {
            this.updateOrganizeDialogSize();
        });
        if (this.pdfViewer.enableRtl) {
            this.organizeDialog.enableRtl = true;
        }
        this.organizeDialog.appendTo(dialogDiv);
        if(!isReConstruct){
            this.organizeDialog.show(true);
        }
        this.disableTileDeleteButton();
    }

    /**
     * @private
     */
    public createOrganizeWindowForMobile(): void {
        const elementID: string = this.pdfViewer.element.id;
        // eslint-disable-next-line max-len
        if(!isNullOrUndefined(document.getElementById(elementID + '_organize_window')) && !isNullOrUndefined(this.organizeDialog)){
            this.organizeDialog.show(true);
            return;
        }
        // eslint-disable-next-line max-len
        const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_organize_window', className: 'e-pv-organize-window' });
        const contentRegion: HTMLElement = this.createContentArea();
        this.pdfViewerBase.mainContainer.appendChild(dialogDiv);
        this.organizeDialog = new Dialog({
            showCloseIcon: true,
            closeOnEscape: true,
            isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Organize PDF'),
            target: this.pdfViewerBase.mainContainer,
            content: contentRegion,
            visible: false,
            close: () => {
                if (!this.isSkipRevert) {
                    this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
                    this.destroyDialogWindow();
                    this.createOrganizeWindow(true);
                    
                }
                else{
                    this.isSkipRevert = false;
                }
            }
        });
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const pagecount = this.pdfViewerBase.pageCount;
            this.organizeDialog.buttons = [
                // eslint-disable-next-line max-len
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save As'), isPrimary: true }, click: this.onSaveasClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Total') + ' ' + pagecount.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages'), cssClass: 'e-pv-organize-total-page-button', disabled: true } }
            ];
        }
        // Listen to window resize events to update the dialog size dynamically
        window.addEventListener('resize', () => {
            this.updateOrganizeDialogSize();
        });
        if (this.pdfViewer.enableRtl) {
            this.organizeDialog.enableRtl = true;
        }
        this.organizeDialog.appendTo(dialogDiv);
        this.organizeDialog.show(true);
        this.createMobileContextMenu();
        this.disableTileDeleteButton();
    }

    private updateOrganizeDialogSize() {
        // Update the dialog size based on the viewer container size
        const dialogWidth = this.pdfViewer.element.getBoundingClientRect().width;
        const dialogHeight = this.pdfViewer.element.getBoundingClientRect().height;
        if(!isNullOrUndefined(this.organizeDialog)){
            this.organizeDialog.width = `${dialogWidth}px`;
            this.organizeDialog.height = `${dialogHeight}px`;
        }
    }

    private createContentArea(): any {
        const elementID: string = this.pdfViewer.element.id;
        const contentDiv: HTMLElement = createElement('div', { id: elementID + '_content_appearance',  className: 'e-pv-organize-content-apperance'  });
        const toolbarDiv: HTMLElement = createElement('div', { id: elementID + '_toolbar_appearance', className: 'e-pv-organize-toolbar-apperance' });
        this.tileAreaDiv = createElement('div', { id: this.pdfViewer.element.id + '_organize_tile_view', className: 'e-pv-organize-tile-view e-pv-thumbnail-row' });
        contentDiv.style.width = '100%';
        contentDiv.style.height = '100%';
        toolbarDiv.style.height = '48px';
        this.tileAreaDiv.style.height = 'calc(100% - 48px)';
        this.selectAllCheckBox = new CheckBox(
            { label: Browser.isDevice && !this.pdfViewer.enableDesktopMode ? '' : this.pdfViewer.localeObj.getConstant('Select All'), cssClass: 'e-pv-organize-select-all', checked: false, change: this.onSelectAllClick.bind(this) })
        let toolbarItems: ItemModel[] = [
            { type: 'Input', template:  this.selectAllCheckBox, id:'selectAllCheckbox', align: 'Left'},
            { type: "Separator", align: 'Left'},
            { prefixIcon: 'e-pv-rotate-left-icon e-pv-icon', visible: true, disabled: true, cssClass:'e-pv-toolbar-rotate-left', id: this.pdfViewer.element.id + '_rotate_page_left', align: 'Center', click: (args: ClickEventArgs) => {
                this.onToolbarLeftButtonClick();
            }},
            { prefixIcon: 'e-pv-rotate-right-icon e-pv-icon', visible: true, disabled: true, cssClass:'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_rotate_page_right', align: 'Center', click: (args: ClickEventArgs) => {
                this.onToolbarRightButtonClick();
            }},
            { prefixIcon: 'e-pv-delete-icon e-pv-icon', visible: true, disabled: true, cssClass:'e-pv-delete-selected', id: this.pdfViewer.element.id + '_delete_selected', align: 'Center', click: (args: ClickEventArgs) => {
                this.onToolbarDeleteButtonClick();
            }}
        ];
        if(Browser.isDevice && !this.pdfViewer.enableDesktopMode){
            toolbarItems.push({ type: "Separator", align: 'Left'});
            toolbarItems.push({ prefixIcon: 'e-pv-more-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_organize_more_button', align: 'Right',
            click: this.openContextMenu.bind(this)
         });
        }
        this.toolbar = new Toolbar({
            items: toolbarItems
        });
        this.toolbar.cssClass = "e-pv-organize-toolbar";
        this.toolbar.height = '48px';
        this.toolbar.width = 'auto';
        this.toolbar.appendTo(toolbarDiv);
        contentDiv.appendChild(toolbarDiv);
        this.renderThumbnailImage();
        contentDiv.appendChild(this.tileAreaDiv);
        const rotateRightToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_rotate_page_right');
        if(!isNullOrUndefined(rotateRightToolbarButton)){
            this.createTooltip(rotateRightToolbarButton, this.pdfViewer.localeObj.getConstant('Rotate Right'));
        }
        const rotateLeftToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_rotate_page_left');
        if(!isNullOrUndefined(rotateLeftToolbarButton)){
            this.createTooltip(rotateLeftToolbarButton, this.pdfViewer.localeObj.getConstant('Rotate Left'));
        }
        const deleteToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_delete_selected');
        if(!isNullOrUndefined(deleteToolbarButton)){
            this.createTooltip(deleteToolbarButton, this.pdfViewer.localeObj.getConstant('Delete Pages'));
        }

        return contentDiv;
    }

    private createMobileContextMenu(): void {
        // eslint-disable-next-line max-len
        this.mobileContextMenu = [
            { text: this.pdfViewer.localeObj.getConstant('Save') ,iconCss: 'e-save-as' },
            { text: this.pdfViewer.localeObj.getConstant('Save As') ,iconCss: 'e-save-as' }
        ];
        let contextMenuElement = createElement('ul', { id: this.pdfViewer.element.id + '_organize_context_menu' });
        this.pdfViewer.element.appendChild(contextMenuElement);
        this.contextMenuObj = new ContextMenu({
            target: '#' + this.pdfViewer.element.id + '_organize_more_button', items: this.mobileContextMenu,
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            select: this.contextMenuItemSelect.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.contextMenuObj.enableRtl = true;
        }
        this.contextMenuObj.appendTo(contextMenuElement);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.contextMenuObj.animationSettings.effect = 'ZoomIn';
        }
        else {
            this.contextMenuObj.animationSettings.effect = 'SlideDown';
        }
    };

    private contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        this.contextMenuObj.enableItems(['Save', 'Save As'], true);
    }

    private contextMenuItemSelect(args: any): void {
        switch (args.item.text) {
            case 'Save':
                this.onSaveClicked();
                break;
            case 'Save As':
                this.onSaveasClicked();
                break;
            default:
                break;
        }
    }


    /**
     * @private
     */
    public createRequestForPreview(){
        const proxy: PageOrganizer = this;
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
        // eslint-disable-next-line
        return new Promise<any>(
            // eslint-disable-next-line
            function (renderPreviewImage: any, reject: any): any {
                    proxy.requestPreviewCreation(proxy);
                });
        } else {
            this.requestPreviewCreation(proxy);
            return null;
        }
    }

    private requestPreviewCreation(proxy: PageOrganizer): void {
        // Removed the condition to skip multiple request for thumbnail image.
        let startIndex: number = 0;
        // eslint-disable-next-line max-len
        let previewLimit: number = proxy.pdfViewer.pageCount;
        let digitalSignaturePresent: boolean = false;
        for (var i= startIndex; i < previewLimit; i++)
        {
           if (proxy.pdfViewerBase.digitalSignaturePresent(i))
           {
              digitalSignaturePresent = true;
           }
        }
        let digitalSignatureList: string = "";
        if (digitalSignaturePresent)
        {
            digitalSignatureList = proxy.pdfViewerBase.digitalSignaturePages.toString();
        }
        // eslint-disable-next-line max-len
        const jsonObject: object = { startPage: startIndex.toString(), endPage: previewLimit.toString(), sizeX: "99.7", sizeY: "141", hashId: proxy.pdfViewerBase.hashId, action: 'RenderThumbnailImages', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId, digitalSignaturePresent: digitalSignaturePresent, digitalSignaturePageList: digitalSignatureList };
        if (this.pdfViewerBase.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        if (!this.pdfViewerBase.clientSideRendering) {
            this.previewRequestHandler = new AjaxHandler(this.pdfViewer);
            this.previewRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail;
            this.previewRequestHandler.responseType = 'json';
            if(previewLimit > 0 && !isNullOrUndefined(proxy.pdfViewerBase.hashId)){
                this.previewRequestHandler.send(jsonObject);
            }
            // eslint-disable-next-line
            this.previewRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                let redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
                    proxy.updatePreviewCollection(data)
                }
            };
            // eslint-disable-next-line
            this.previewRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
            // eslint-disable-next-line
            this.previewRequestHandler.onError = function (result: any) {
                proxy.pdfViewerBase.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
        } else {
            for (let pageIndex = startIndex; pageIndex < previewLimit; pageIndex++) {
                this.pdfViewerBase.pdfViewerRunner.postMessage({
                    startIndex: startIndex,
                    endIndex: previewLimit,
                    pageIndex: pageIndex,
                    message: 'renderPreviewTileImage'
                });
            }
        }
    }

    /**
   * @param jsonData
   * @private
   */
    public updatePreviewCollection(data: any): void {
        if (data) {
            const proxy: PageOrganizer = this;
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    proxy.pdfViewerBase.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderThumbnail);
                    data = null;
                }
            }
            if (data && data.uniqueId === proxy.pdfViewerBase.documentId) {
                proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderThumbnail, data); 
                this.getData(data, proxy.pdfViewerBase.clientSideRendering);
            }
        }
    }

    /**
     * @private
     */
    public previewOnMessage(event: any): void {
        if (event.data.message === 'renderPreviewTileImage') {
            let canvas: HTMLCanvasElement = document.createElement('canvas');
            let { value, width, height, pageIndex, startIndex, endIndex } = event.data;
            canvas.width = width;
            canvas.height = height;
            const canvasContext = canvas.getContext('2d');
            const imageData = canvasContext.createImageData(width, height);
            imageData.data.set(value);
            canvasContext.putImageData(imageData, 0, 0);
            let imageUrl: string = canvas.toDataURL();
            this.pdfViewerBase.releaseCanvas(canvas);
            let data = ({
                thumbnailImage: imageUrl,
                startPage: startIndex,
                endPage: endIndex,
                uniqueId: this.pdfViewerBase.documentId,
                pageIndex: pageIndex
            });
            this.updatePreviewCollection(data);
        }
    }


    /**
     * @private
     */
    public getData(data: any, isClientRender: boolean): void {
        if (!this.dataDetails) {
            this.dataDetails = [];
        }
        if(isClientRender){
            this.dataDetails.push({ pageId: data.pageIndex, image: data.thumbnailImage});
        } 
        else {
            const startPage: number = data.startPage;
            const endPage: number = data.endPage;
            for (let i: number = startPage; i < endPage; i++) {
                const thumbnailImage = data.thumbnailImage[parseInt(i.toString(), 10)];
                let pageId = i;
                this.dataDetails.push({ pageId: pageId, image: thumbnailImage});
            }
        }
        if(this.dataDetails.length === this.pdfViewer.pageCount){
            if(!isNullOrUndefined(this.pdfViewerBase.navigationPane)){
                this.pdfViewerBase.navigationPane.enableOrganizeButton(true);
            }
            if(!isNullOrUndefined(this.pdfViewer.toolbar)){
                this.pdfViewer.toolbar.enableToolbarItem(['OrganizePagesTool'], true);
            }
            if(this.pdfViewer.isPageOrganizerOpen){
                this.createOrganizeWindow();
            }
            this.isAllImagesReceived = true;
        }
    }

    private renderThumbnailImage(): void {
        for (let i: number = 0; i < this.pdfViewer.pageCount; i++) {
            this.tileImageRender(i);
            this.organizePagesCollection.push(new OrganizeDetails(i, i, null, false, false, false, false, false,this.getRotatedAngle(this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].rotation.toString()), this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)]));
        }
        this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
    }

    /**
     * @private
     */
    public tileImageRender(pageIndex: number, subIndex?:number, pageOrder?:number, targetElement?: HTMLElement, isNewPage?:boolean, isBefore?: boolean, isEmptyPage?:boolean): void {
        // eslint-disable-next-line max-len
        this.pageLink = createElement('div', { id: 'anchor_page_' + pageIndex, className: 'e-pv-organize-anchor-node' }) as HTMLElement;
        if(isNewPage){
            this.pageLink.id = this.pageLink.id + '_' + subIndex;
            this.pageLink.setAttribute('data-page-order' , pageOrder.toString());
        }   
        else{
            this.pageLink.setAttribute('data-page-order' , pageIndex.toString());
        }
        // eslint-disable-next-line max-len
        this.thumbnail = createElement('div', { id: this.pdfViewer.element.id + '_organize_page_' + pageIndex, className: 'e-pv-organize-tile e-pv-thumbnail-column' });
        if(isNewPage){
            this.thumbnail.id = this.thumbnail.id + '_' + subIndex;
        }
        this.imageContainer = createElement('div', { id: this.pdfViewer.element.id + '_container_image_' + pageIndex, className: 'e-pv-image-container' });
        if(isNewPage){
            this.imageContainer.id = this.imageContainer.id + '_' + subIndex;
        }
        let pageSize: ISize;
        if(!isNewPage && !isEmptyPage){
            pageSize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        }
        else{
            pageSize = this.tempOrganizePagesCollection.find( (item: OrganizeDetails) => {return item.currentPageIndex === pageOrder}).pageSize;
            if(isBefore && pageOrder - 1 >= 0){
                pageSize = this.tempOrganizePagesCollection.find(function (item) { return item.currentPageIndex === pageOrder - 1; }).pageSize;
            }
        }
        // eslint-disable-next-line max-len
        this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_organize_image_' + pageIndex, className: 'e-pv-organize-image' }) as HTMLImageElement;
        if(isNewPage){
            this.thumbnailImage.id = this.thumbnailImage.id + '_' + subIndex;
        }
        let width: number;
        let height: number;
        if (pageSize.height > pageSize.width) {
            width = 100 * pageSize.width / pageSize.height;
            height = 100;
        }
        else {
            width = 100;
            height = 100 * pageSize.height / pageSize.width;
        }
        this.thumbnailImage.style.width = width + '%';
        this.thumbnailImage.style.height = height + '%';
        // eslint-disable-next-line max-len
        if(isEmptyPage){
            this.thumbnailImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWP4DwQACfsD/Qy7W+cAAAAASUVORK5CYII=";
        }
        else{
            this.thumbnailImage.src = this.dataDetails[parseInt(pageIndex.toString(), 10)].image;
        }
        this.thumbnailImage.alt = this.pdfViewer.element.id + '_organize_page_' + pageIndex;
        if(isNewPage){
            this.thumbnailImage.alt = this.pdfViewer.element.id + '_organize_page_' + pageOrder;
        }
        this.imageContainer.appendChild(this.thumbnailImage);
        let rotateAngle: number = 0;
        if(isNewPage && isEmptyPage && !isNullOrUndefined(this.tempOrganizePagesCollection.find(function (item) { return item.currentPageIndex === pageOrder; }))) {
            rotateAngle = this.tempOrganizePagesCollection.find(function (item) { return item.currentPageIndex === pageOrder; }).rotateAngle;
            this.imageContainer.style.transform = "rotate(" + rotateAngle + "deg)";
        }
        this.thumbnail.appendChild(this.imageContainer);
        const thumbnailPageNumber: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_tile_pagenumber_' + pageIndex, className: 'e-pv-tile-number' });
        if(isNewPage){
            thumbnailPageNumber.id = thumbnailPageNumber.id + '_' + subIndex;
        }
        thumbnailPageNumber.textContent = (pageIndex + 1).toString();
        if(isNewPage){
            thumbnailPageNumber.textContent = (pageOrder + 1).toString();
        }
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'e-pv-organize-tile-checkbox';
        input.id = 'checkboxdiv_page_' + pageIndex;
        if(isNewPage){
            input.id = input.id + '_' + subIndex;
        }
        this.thumbnail.appendChild(input);
        let checkBoxObj: CheckBox = new CheckBox({ disabled: false, checked: false, change: this.onSelectClick.bind(this)});
        checkBoxObj.appendTo(input);
        input.parentElement.style.height = '100%';
        input.parentElement.style.width = '100%';
        input.parentElement.style.display = "none";
        var buttondiv = createElement('div', { id: this.pdfViewer.element.id + '_organize_buttondiv_' + pageIndex, className: 'e-pv-organize-buttondiv' });
        if(isNewPage){
            buttondiv.id = buttondiv.id + '_' + subIndex;
        }
        this.deleteButton = createElement('button', { id: this.pdfViewer.element.id + '_delete_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Delete Page') , 'tabindex': '-1'} }) as HTMLButtonElement;
        if(isNewPage){
            this.deleteButton.id = this.deleteButton.id + '_' + subIndex;
        }
        this.deleteButton.className = 'e-pv-tbar-btn e-pv-delete-button e-btn e-pv-organize-pdf-tile-btn';
        this.deleteButton.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const deleteButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_delete' + '_icon', className: 'e-pv-delete-icon e-pv-icon' });
        this.deleteButton.appendChild(deleteButtonSpan);
        // eslint-disable-next-line max-len
        const deleteButtonTooltip: Tooltip = new Tooltip({
            content: initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Delete Page'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
        });
        deleteButtonTooltip.appendTo(this.deleteButton);
        this.rotateRightButton = createElement('button', { id: this.pdfViewer.element.id + '_rotate_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Rotate Right'), 'tabindex': '-1'} }) as HTMLButtonElement;
        if(isNewPage){
            this.rotateRightButton.id = this.rotateRightButton.id + '_' + subIndex;
        }
        this.rotateRightButton.className = 'e-pv-tbar-btn e-pv-rotate-right-button e-btn e-pv-organize-pdf-tile-btn';
        this.rotateRightButton.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const rotateButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_rotate-right' + '_icon', className: 'e-pv-rotate-right-icon e-pv-icon' });
        this.rotateRightButton.appendChild(rotateButtonSpan);
        // eslint-disable-next-line max-len
        const rotateButtonTooltip: Tooltip = new Tooltip({
            content: initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Rotate Right'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
        });
        rotateButtonTooltip.appendTo(this.rotateRightButton);
        this.rotateLeftButton = createElement('button', { id: this.pdfViewer.element.id + '_rotate_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Rotate Left'), 'tabindex': '-1' } }) as HTMLButtonElement;
        if(isNewPage){
            this.rotateLeftButton.id = this.rotateLeftButton.id + '_' + subIndex;
        }
        this.rotateLeftButton.className = 'e-pv-tbar-btn e-pv-rotate-left-button e-btn e-pv-organize-pdf-tile-btn';
        this.rotateLeftButton.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const rotateLeftButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_rotate_left' + '_icon', className: 'e-pv-rotate-left-icon e-pv-icon' });
        this.rotateLeftButton.appendChild(rotateLeftButtonSpan);
        // eslint-disable-next-line max-len
        const rotateLeftButtonTooltip: Tooltip = new Tooltip({
            content: initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Rotate Left'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
        });
        rotateLeftButtonTooltip.appendTo(this.rotateLeftButton);

        
        this.insertRightButton = createElement('button', { id: this.pdfViewer.element.id + '_insert_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Insert Right'), 'tabindex': '-1', } }) as HTMLButtonElement;
        if(isNewPage){
            this.insertRightButton.id = this.insertRightButton.id + '_' + subIndex;
        }
        this.insertRightButton.className = 'e-pv-tbar-btn e-pv-insert-right-button e-btn e-pv-organize-pdf-tile-btn';
        this.insertRightButton.setAttribute('type', 'button');
        var insertRightButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_insert_right' + '_icon', className: 'e-icons e-plus' });
        this.insertRightButton.appendChild(insertRightButtonSpan);
        var insertRightButtonTooltip = new Tooltip({
            content: initializeCSPTemplate(function () { return this.pdfViewer.localeObj.getConstant('Insert Right'); }, this), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
        });
        insertRightButtonTooltip.appendTo(this.insertRightButton);

        this.insertLeftButton = createElement('button', { id: this.pdfViewer.element.id + '_insert_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Insert Left'), 'tabindex': '-1', } }) as HTMLButtonElement;
        if(isNewPage){
            this.insertLeftButton.id = this.insertLeftButton.id + '_' + subIndex;
        }
        this.insertLeftButton.className = 'e-pv-tbar-btn e-pv-insert-left-button e-btn e-pv-organize-pdf-tile-btn';
        this.insertLeftButton.setAttribute('type', 'button');
        var insertLeftButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_insert_left' + '_icon', className: 'e-icons e-plus' });
        this.insertLeftButton.appendChild(insertLeftButtonSpan);
        var insertLeftButtonTooltip = new Tooltip({
            content: initializeCSPTemplate(function () { return this.pdfViewer.localeObj.getConstant('Insert Left'); }, this), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
        });
        insertLeftButtonTooltip.appendTo(this.insertLeftButton);
        if(!this.pdfViewer.pageOrganizerSettings.canInsert){
            this.insertLeftButton.setAttribute('disabled', 'disabled');
            this.insertLeftButton.firstElementChild.classList.add('e-disabled');
            this.insertRightButton.setAttribute('disabled', 'disabled');
            this.insertRightButton.firstElementChild.classList.add('e-disabled');
        }
        if(!this.pdfViewer.pageOrganizerSettings.canRotate){
            this.rotateLeftButton.setAttribute('disabled', 'disabled');
            this.rotateLeftButton.firstElementChild.classList.add('e-disabled');
            this.rotateRightButton.setAttribute('disabled', 'disabled');
            this.rotateRightButton.firstElementChild.classList.add('e-disabled');
        }
        if(!this.pdfViewer.pageOrganizerSettings.canDelete){
            this.deleteButton.setAttribute('disabled', 'disabled');
            this.deleteButton.firstElementChild.classList.add('e-disabled');
        }
        buttondiv.appendChild(this.insertLeftButton);
        buttondiv.appendChild(this.rotateLeftButton);
        buttondiv.appendChild(this.rotateRightButton);
        buttondiv.appendChild(this.deleteButton);
        buttondiv.appendChild(this.insertRightButton);

        this.thumbnail.appendChild(buttondiv);
        buttondiv.style.display = "none";
        this.pageLink.appendChild(this.thumbnail);
        this.tileAreaDiv.appendChild(this.pageLink);
        this.pageLink.appendChild(thumbnailPageNumber);
        this.rotateRightButton.addEventListener('click', this.rotateButtonClick);
        this.rotateLeftButton.addEventListener('click', this.rotateLeftButtonClick);
        this.insertRightButton.addEventListener('click', this.insertRightButtonClick);
        this.insertLeftButton.addEventListener('click', this.insertLeftButtonClick);
        this.deleteButton.addEventListener('click', this.deleteButtonClick);
        this.pageLink.addEventListener('mouseover', this.thumbnailMouseOver);
        this.pageLink.addEventListener('mouseleave', this.thumbnailMouseLeave);

        if(isNewPage){
            if(isBefore){
                this.tileAreaDiv.insertBefore(this.pageLink, targetElement);
            }
            else{
                this.tileAreaDiv.insertBefore(this.pageLink, targetElement.nextSibling);
            }
        }
    }
    
    /**
     * @param event
     * @private
     */
     public thumbnailMouseOver = (event: MouseEvent): void => {
        const proxy: PageOrganizer = this;
        if (event.currentTarget instanceof HTMLElement) {
            // Convert HTMLCollection to an array
            const childrenArray = Array.from(event.currentTarget.children);
            // Iterate over the array
            for (const subchild of childrenArray) {
                const childArray = Array.from(subchild.children);
                for (const child of childArray){
                // Exclude the image by checking its type
                if (!(child.classList.contains('e-pv-image-container'))) {
                    // Set the display style property to "none" for other children
                    (child as HTMLElement).style.display = 'flex';
                    if (child.classList.contains('e-checkbox-wrapper')) {
                        (child.children[0] as HTMLElement).style.display = 'block';
                    }
                    else if (child.classList.contains('e-pv-organize-buttondiv') && child.childElementCount > 0) {
                        const childelementArray = Array.from(child.children);
                        for (const childelement of childelementArray) {
                            if (proxy.totalCheckedCount > 1) {
                                if(childelement.id.split("_")[1] == "insert") {
                                    (childelement as HTMLElement).style.display = 'flex';
                                }
                                else {
                                    (childelement as HTMLElement).style.display = 'none';
                                }
                            }else {
                                (childelement as HTMLElement).style.display = 'flex';
                            }
                        }
                    }
                }
                }
            }
        }
    };

    /**
     * @param event
     * @private
     */
     public thumbnailMouseLeave = (event: MouseEvent): void => {
        if (event.currentTarget instanceof HTMLElement) {
            // Convert HTMLCollection to an array
            const childrenArray = Array.from(event.currentTarget.children);
            // Iterate over the array
            for (const subchild of childrenArray) {
                const childArray = Array.from(subchild.children);
                for (const child of childArray){
                // Exclude the image by checking its type
                if (!(child.classList.contains('e-pv-image-container'))) {
                    if(event.currentTarget.classList.contains('e-pv-organize-node-selection-ring')){
                        if(child.classList.contains('e-checkbox-wrapper'))
                        {
                            (child as HTMLElement).style.display = 'block';
                        }
                        else{
                            (child as HTMLElement).style.display = 'none';
                        }
                    } else{
                        // Set the display style property to "none" for other children
                        (child as HTMLElement).style.display = 'none';
                    }
                    
                }
            }
        }
        }
    };

    private onSelectAllClick(): void {
        const proxy: PageOrganizer = this;
        for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
            const childNode = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)];
            // Type assertion to HTMLElement
            if (childNode instanceof HTMLElement) {
                this.setSelectionRingStyle(this.selectAllCheckBox.element, childNode);
                const checkboxWrapper = childNode.querySelector('.e-checkbox-wrapper') as HTMLInputElement;
                if (checkboxWrapper) {
                    // Set the display style property to "none" for other children
                    checkboxWrapper.checked = !this.selectAllCheckBox.checked;
                }
            }
        }
        this.enableDisableToolbarItems();
        if(!this.selectAllCheckBox.checked) {
            this.totalCheckedCount = 0;
        }
        else {
            this.totalCheckedCount = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring').length;
        }
    }

    private enableDisableToolbarItems(): void {
        this.toolbar.items.forEach((item: ItemModel) => {
            if(item.id === this.pdfViewer.element.id + '_rotate_page_left'){
                item.disabled = !((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate) && this.pdfViewer.pageOrganizerSettings.canRotate);
            }
            else if(item.id === this.pdfViewer.element.id + '_rotate_page_right' ){
                item.disabled = !((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate) && this.pdfViewer.pageOrganizerSettings.canRotate);
            }
            else if( item.id === this.pdfViewer.element.id + '_delete_selected'){
                item.disabled = !(this.selectAllCheckBox.indeterminate && this.pdfViewer.pageOrganizerSettings.canDelete);
            }
        });
    }
    private disableTileDeleteButton(): void {
        if(this.tileAreaDiv.childElementCount === 1){
            let mainTileElement = this.tileAreaDiv.querySelector('.e-pv-organize-anchor-node') as HTMLElement;
            let deleteButton = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
            if(!isNullOrUndefined(deleteButton)){
                deleteButton.setAttribute('disabled', 'disabled');
                deleteButton.firstElementChild.classList.add('e-disabled');
            }
        }
        else{
            for (let i: number = 0; i < this.tileAreaDiv.childElementCount; i++) {
                let mainTileElement: HTMLElement;
                if((this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement).classList.contains('e-pv-organize-anchor-node')) {
                    mainTileElement = this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
                }
                else{
                    mainTileElement = (this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement).querySelector('.e-pv-organize-anchor-node') as HTMLElement;
                }
                let deleteButton = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
                if(!isNullOrUndefined(deleteButton) && this.pdfViewer.pageOrganizerSettings.canDelete){
                    deleteButton.removeAttribute('disabled');
                    deleteButton.firstElementChild.classList.remove('e-disabled');
                }
            }
        }
    }

    private onSelectClick = (args: any): void => {
        // eslint-disable-next-line max-len
        const checkboxElement = (event.currentTarget as HTMLElement).querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
        const pageElement = checkboxElement.closest('.e-pv-organize-anchor-node') as HTMLElement;
        if (!isNullOrUndefined(checkboxElement) && !isNullOrUndefined(pageElement)) {
            if (pageElement) {
                this.setSelectionRingStyle(checkboxElement, pageElement);
            }
        }
        this.updateSelectAllCheckbox();
        this.enableDisableToolbarItems();
        if (this.totalCheckedCount > 1) {
            for (let i: number = 0; i < pageElement.querySelector(".e-pv-organize-buttondiv").childElementCount; i++) {
                let id: string = pageElement.querySelector(".e-pv-organize-buttondiv").children[i].id;
                if (id.split("_")[1] == "insert") {
                    (pageElement.querySelector(".e-pv-organize-buttondiv").children[i] as HTMLElement).style.display = 'flex';
                }
                else {
                    (pageElement.querySelector(".e-pv-organize-buttondiv").children[i] as HTMLElement).style.display = 'none';
                }
            }
        }
    }

    private updateSelectAllCheckbox(): void {
        const totalCheckboxCount = this.tileAreaDiv.childElementCount;
        this.totalCheckedCount = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring').length;
        if (this.selectAllCheckBox) {
            if (this.totalCheckedCount === 0) {
                this.selectAllCheckBox.indeterminate = false;
                this.selectAllCheckBox.checked = false;
            }
            else if (totalCheckboxCount === this.totalCheckedCount) {
                this.selectAllCheckBox.indeterminate = false;
                this.selectAllCheckBox.checked = true;
            }
            else {
                this.selectAllCheckBox.indeterminate = true;
            }
        }
    }

    private setSelectionRingStyle(checkbox: HTMLInputElement, anchornode: HTMLElement): void {
        if (!checkbox.checked) {
            anchornode.classList.remove('e-pv-organize-node-selection-ring');
        } else {
            anchornode.classList.add('e-pv-organize-node-selection-ring');
        }
        const childrenArray = Array.from(anchornode.children);
        for (const child of childrenArray) {
            const childArray = Array.from(child.children);
            for (const subchild of childArray) {
                if (subchild.classList.contains('e-checkbox-wrapper')) {
                    var id = ((subchild.getElementsByClassName("e-control e-checkbox e-lib")[0] as HTMLInputElement)).id;
                    var cbObj = getComponent(document.getElementById(id),'checkbox');
                    if (checkbox.checked) {
                        (subchild as HTMLElement).style.display = 'block';
                        ((subchild as HTMLElement).children[0] as HTMLElement).style.display = 'block';
                        (cbObj as CheckBox).checked = true;
                    }
                    else {
                        (subchild as HTMLElement).style.display = 'none';
                        ((subchild as HTMLElement).children[0] as HTMLElement).style.display = 'none';
                        (cbObj as CheckBox).checked = false;
                        // eslint-disable-next-line max-len
                        if(!isNullOrUndefined((subchild as HTMLElement).parentElement) && !isNullOrUndefined((subchild as HTMLElement).parentElement.lastElementChild) && (subchild as HTMLElement).parentElement.lastElementChild.classList.contains('e-pv-organize-buttondiv')){
                            ((subchild as HTMLElement).parentElement.lastElementChild as HTMLElement).style.display = 'none';
                        }
                    }
                }
            }
        }
    }  
        
    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    }

    private rotateButtonClick = (event: MouseEvent): void => {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            const rotateButton = event.currentTarget as HTMLElement;
            const mainTileElement = rotateButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
            const imageContainer = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
            const pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            if (imageContainer) {
                // Get the current rotation angle of the image container (if any)
                let currentRotation = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                // Calculate the new rotation angle (add 90 degrees)
                currentRotation += 90;
                // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                if (currentRotation >= 360) {
                    currentRotation = 0;
                }
                // Apply the rotation to the image container
                imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                // Update the rotation value in the pageDetails collection
                this.updateTempRotationDetail(pageOrder, 90);
            }
        }
    };

    
    private openContextMenu(event: any) {
        let contextMenu = document.getElementById(this.pdfViewer.element.id + '_organize_context_menu');
        if (!isNullOrUndefined(contextMenu) && contextMenu.style.display !== 'block') {
            this.contextMenuObj.open(event.originalEvent.clientY, event.originalEvent.clientX, event.originalEvent.currentTarget);
        }
    }

    private rotateLeftButtonClick = (event: MouseEvent): void => {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            const rotateButton = event.currentTarget as HTMLElement;
            const mainTileElement = rotateButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
            const imageContainer = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
            const pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            if (imageContainer) {
                // Get the current rotation angle of the image container (if any)
                let currentRotation = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                // Calculate the new rotation angle (add 90 degrees)
                currentRotation -= 90;
                // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                if (currentRotation >= 360) {
                    currentRotation = 0;
                }
                if (currentRotation == -90) {
                    currentRotation = 270;
                }
                // Apply the rotation to the image container
                imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                // Update the rotation value in the pageDetails collection
                this.updateTempRotationDetail(pageOrder, -90);
            }
        }
    };

    private onToolbarRightButtonClick = (): void => {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            const proxy: PageOrganizer = this;
            for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
                const mainTileElement = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)];
                // Type assertion to HTMLElement
                if (mainTileElement instanceof HTMLElement && mainTileElement.classList.contains('e-pv-organize-node-selection-ring')) {
                    const imageContainer = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
                    const pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
                    if (imageContainer) {
                        // Get the current rotation angle of the image container (if any)
                        let currentRotation = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                        // Calculate the new rotation angle (add 90 degrees)
                        currentRotation += 90;
                        // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                        if (currentRotation >= 360) {
                            currentRotation = 0;
                        }
                        // Apply the rotation to the image container
                        imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                        // Update the rotation value in the pageDetails collection
                        this.updateTempRotationDetail(pageOrder, 90);
                    }
                }
            }
        }
    };

    private onToolbarLeftButtonClick = (): void => {
        const proxy: PageOrganizer = this;
        for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
            const mainTileElement = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)];
            // Type assertion to HTMLElement
            if (mainTileElement instanceof HTMLElement && mainTileElement.classList.contains('e-pv-organize-node-selection-ring')) {
                const imageContainer = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
                const pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
                if (imageContainer) {
                    // Get the current rotation angle of the image container (if any)
                    let currentRotation = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                    // Calculate the new rotation angle (add 90 degrees)
                    currentRotation -= 90;
                    // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                    if (currentRotation >= 360) {
                        currentRotation = 0;
                    }
                    if (currentRotation == -90) {
                        currentRotation = 270;
                    }
                    // Apply the rotation to the image container
                    imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                    // Update the rotation value in the pageDetails collection
                    this.updateTempRotationDetail(pageOrder, -90);
                }
            }
        }
    };

    private onToolbarDeleteButtonClick = (): void => {
        if(this.pdfViewer.pageOrganizerSettings.canDelete){
            const proxy: PageOrganizer = this;
            let selectedNodes: NodeListOf<Element> = proxy.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
            selectedNodes.forEach((selectedElement: HTMLElement) => {
                let mainTileElement = selectedElement.closest('.e-pv-organize-anchor-node') as HTMLElement;
                proxy.deletePageElement(mainTileElement);
            });
        }
        this.enableDisableToolbarItems();
    };

    private updateTempRotationDetail(currentPageIndex: number, currentRotation: number): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            const tempIndex: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
            if (tempIndex !== -1) {
                let rotateAngle = this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle + currentRotation;
                if (rotateAngle == -90) {
                    rotateAngle = 0;
                }
                // If the pageIndex is found in the array
                this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle = Math.abs((this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle + currentRotation + 360) % 360);
            }
        }
    }

    private getRotatedAngle(rotate: string): number {
        switch (rotate.trim()) {
            case '0':
                return 0;
            case '90':
            case  '1':
                return 90;
            case '180':
            case '2':
                return 180;
            case '270':
            case '3':
                return 270;
            case '360':
            case '4':
                return 0;
            default:
                return 0;
        }
    }

    private getRotation(rotateAngle: string): number {
        switch (rotateAngle.trim()) {
            case '0':
                return 0;
            case '90':
                return 1;
            case '180':
                return 2;
            case '270':
                return 3;
            case '360':
                return 0;
            default:
                return 0;
        }
    }

    private updateRotationDetailCollection(): void {
        for (let i: number = 0; i < this.tempOrganizePagesCollection.length; i++) {
            const tempPageDetail = this.tempOrganizePagesCollection[parseInt(i.toString(), 10)];
            if(tempPageDetail.pageIndex !== -1){
                const pageDetails = this.pdfViewerBase.pageSize[parseInt(tempPageDetail.pageIndex.toString(), 10)];
                if (Math.abs(this.getRotation(pageDetails.rotation.toString()) - tempPageDetail.rotateAngle) % 180 === 90) {
                    this.updatePageSize(tempPageDetail.pageIndex, pageDetails.height, pageDetails.width);
                }
            }
        }
    }

    private updatePageSize(pageIndex: number, pageWidth: number, pageHeight: number): void {
        if (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)]) {
            this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width = pageWidth;
            this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height = pageHeight;
            if(this.pdfViewerBase.highestWidth < pageWidth){
                this.pdfViewerBase.highestWidth = pageWidth;
            }
            this.pdfViewerBase.isMixedSizeDocument = true;
        }
        for (let i: number = pageIndex; i < this.pdfViewerBase.pageSize.length; i++) {
            if(!this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)] && i - 1 < 0){
                this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].top = this.pdfViewerBase.pageGap;
            }
            else{
                this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].top = this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)].top + this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)].height + this.pdfViewerBase.pageGap;
            }

        }
    };

    private onSaveClicked(): void {
        this.isSkipRevert = true;
        this.organizeDialog.hide();
        if(JSON.stringify(this.tempOrganizePagesCollection) !== JSON.stringify(this.organizePagesCollection)){
            this.updateOrganizePageCollection();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
            let pdfBlob: Blob;
            this.pdfViewer.saveAsBlob().then((blob: Blob) => {
                pdfBlob = blob;
                this.blobToBase64(pdfBlob).then((base64: string) => {
                    if(!isNullOrUndefined(base64) && base64 !== ''){
                        let fileName = this.pdfViewer.fileName;
                        let downloadFileName = this.pdfViewer.downloadFileName;
                        let jsonDocumentId = this.pdfViewerBase.jsonDocumentId;
                        this.pdfViewer.load(base64, null);
                        this.pdfViewer.fileName = fileName;
                        if(!isNullOrUndefined(downloadFileName)){
                            this.pdfViewer.downloadFileName = downloadFileName;
                        }
                        else{
                            this.pdfViewer.downloadFileName = fileName;
                        }
                        this.pdfViewerBase.jsonDocumentId = jsonDocumentId;
                    }
                });
            });
        }
    }

    private blobToBase64(blob: Blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    private updateOrganizePageDetailsInViewer(): void {
        for (const pageDetail of this.organizePagesCollection) {
            const pageIndex = pageDetail.pageIndex;
            const rotateAngle = pageDetail.rotateAngle;
            let pageSizeDetails;
            let pageWidth;
            let pageHeight;
            if (pageIndex !== -1) {
                pageSizeDetails = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
            }
            else{
                pageSizeDetails = this.pdfViewerBase.pageSize[parseInt(pageDetail.copiedPageIndex.toString(), 10)];
            }
            pageWidth = pageSizeDetails.width * this.pdfViewerBase.getZoomFactor();
            pageHeight = pageSizeDetails.height * this.pdfViewerBase.getZoomFactor();
            const pageTop = pageSizeDetails.top * this.pdfViewerBase.getZoomFactor();
            // Find the corresponding pageDiv using pageIndex
            const pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
            const pageCanvas: HTMLImageElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
            if (pageDiv && pageCanvas) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(pageIndex) + 'px';
                }
                pageDiv.style.top = pageTop + 'px';
                this.pdfViewerBase.pageContainer.style.width = (this.pdfViewerBase.isMixedSizeDocument && (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) > this.pdfViewerBase.viewerContainer.clientWidth) ? (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) + 'px' : this.pdfViewerBase.viewerContainer.clientWidth + 'px';
                // Update the width and height for div
                if (rotateAngle === 90 || rotateAngle === 270) {
                    let swapWidth = pageDiv.style.width;
                    pageDiv.style.width = pageDiv.style.height;
                    pageDiv.style.height = swapWidth;
                } else {
                    pageDiv.style.width = '';
                    pageDiv.style.height = '';
                }
                pageDiv.style.left = (this.pdfViewerBase.viewerContainer.clientWidth - (parseInt(pageDiv.style.width) * this.pdfViewerBase.getZoomFactor())) / 2 + 'px';

                // Apply rotation to the canvas
                pageCanvas.style.transform = `rotate(${rotateAngle}deg)`;
                if (rotateAngle === 90 || rotateAngle === 270) {
                    let swap = pageCanvas.width;
                    pageCanvas.style.width = `${pageCanvas.height}px`;
                    pageCanvas.width = pageCanvas.height;
                    pageCanvas.style.height = `${swap}px`;
                    pageCanvas.height = swap;
                    pageCanvas.style.margin = '0px';
                    // Adjust margins to center the rotated canvas
                    pageCanvas.style.marginLeft = `${(pageCanvas.height - pageCanvas.width) / 2}px`;
                    pageCanvas.style.marginTop = `${(pageCanvas.width - pageCanvas.height) / 2}px`;
                }
                else{
                    // Reset margins if not rotated by 90 or 270 degrees
                    pageCanvas.style.margin = '0px';
                }
                this.applyElementStyles(pageCanvas, pageIndex);
            }
        }
    }

    private getNextSubIndex(parentElement: HTMLElement, parentPageIndex: number): number {
        const elementsWithAnchorId = parentElement.querySelectorAll(`[id^='anchor_page_${parentPageIndex}']`);
     
        // Find the largest subindex among the existing elements
        let maxSubIndex = -1;
        elementsWithAnchorId.forEach((element) => {
            const [pageIndex, subIndex] = element.id.split('_').slice(2);
            if (Number(subIndex) > maxSubIndex) {
                maxSubIndex = Number(subIndex);
            }
        });
     
        return maxSubIndex + 1;
    }

    private insertRightButtonClick = (event: MouseEvent): void => {
        if(this.pdfViewer.pageOrganizerSettings.canInsert)
        {
            let insertRightButton = event.currentTarget as HTMLElement;
            let buttonId = insertRightButton.id.split('_insert_page_')[insertRightButton.id.split('_insert_page_').length - 1];
            let mainTileElement = insertRightButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
            let pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            let buttonIdlist = buttonId.split('_');
            let subIndex = 0;
            let buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 1).toString(), 10)], 10);
            if(buttonIdlist.length > 1){
                buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 2).toString(), 10)], 10);
            }
            subIndex = this.getNextSubIndex(mainTileElement.parentElement, buttonIndex);
            this.insertTempPage(pageOrder, false, mainTileElement);
            this.tileImageRender(buttonIndex, subIndex, pageOrder + 1, mainTileElement, true, false, true);
            this.updateTotalPageCount();
            this.updatePageNumber();
            this.disableTileDeleteButton();
            this.updateSelectAllCheckbox();
            this.enableDisableToolbarItems();
        }
    }

    private insertLeftButtonClick = (event: MouseEvent): void => {
        if(this.pdfViewer.pageOrganizerSettings.canInsert)
        {
            let insetLeftButton = event.currentTarget as HTMLElement;
            let buttonId = insetLeftButton.id.split('_insert_page_')[insetLeftButton.id.split('_insert_page_').length - 1];
            let mainTileElement = insetLeftButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
            let pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            let buttonIdlist = buttonId.split('_');
            let subIndex = 0;
            let buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 1).toString(), 10)], 10);
            if(buttonIdlist.length > 1){
                buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 2).toString(), 10)], 10);
            }
            subIndex = this.getNextSubIndex(mainTileElement.parentElement, buttonIndex);
            this.insertTempPage(pageOrder, true, mainTileElement);
            this.tileImageRender(buttonIndex, subIndex, pageOrder, mainTileElement , true, true, true);
            this.updateTotalPageCount();
            this.updatePageNumber();
            this.disableTileDeleteButton();
            this.updateSelectAllCheckbox();
            this.enableDisableToolbarItems();
        }
    }

    private deleteButtonClick = (event: MouseEvent): void => {
        if(this.pdfViewer.pageOrganizerSettings.canDelete){
            let deleteButton = event.currentTarget as HTMLElement;
            let mainTileElement = deleteButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
            this.deletePageElement(mainTileElement);
        }
        this.updateSelectAllCheckbox();
        this.enableDisableToolbarItems();
    }

    private deletePageElement(mainTileElement: HTMLElement): void {
        if(this.pdfViewer.pageOrganizerSettings.canDelete && this.tileAreaDiv.childElementCount > 1){
            let pageOrder = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            this.deleteTempPage(pageOrder, mainTileElement);
            let deleteButton = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
            if (!isNullOrUndefined(deleteButton) && !isNullOrUndefined((deleteButton as any).ej2_instances) && (deleteButton as any).ej2_instances.length > 0) {
                // We are destroying the button component to remove tooltip
                (deleteButton as any).ej2_instances[0].destroy();
            }
            this.tileAreaDiv.removeChild(mainTileElement);
            this.updateTotalPageCount();
            this.updatePageNumber();
            this.updateSelectAllCheckbox();
            this.disableTileDeleteButton();
        }
    }

    private deleteTempPage(currentPageIndex: number, tileDiv: HTMLElement): void {
        if(this.pdfViewer.pageOrganizerSettings.canDelete && (this.tempOrganizePagesCollection.filter((item: OrganizeDetails) => item.isDeleted === false).length > 0)){
            let index: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
            if (index !== -1) {
                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isDeleted = true;
                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].currentPageIndex = null;
            }
            this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                if (mapIndex > index && !item.isDeleted) {
                    item.currentPageIndex = item.currentPageIndex - 1
                };
                return item;
            });
            while(!isNullOrUndefined(tileDiv.nextElementSibling)){
                let nextTileDiv = tileDiv.nextElementSibling as HTMLElement;
                let nextTileIndex = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
                nextTileIndex = nextTileIndex - 1;
                nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
                tileDiv = nextTileDiv;
            }
        }
    }

    private updateTotalPageCount(): void {
        let totalPages = document.querySelectorAll('.e-pv-organize-anchor-node').length;
        let totalPageNumberElement = document.querySelector('.e-pv-organize-total-page-button');
        if(!isNullOrUndefined(totalPageNumberElement)){
            (totalPageNumberElement as HTMLElement).textContent = this.pdfViewer.localeObj.getConstant('Total') + ' ' + totalPages.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages');
        }
    }

    private updatePageNumber(): void {
        let totalPages = document.querySelectorAll('.e-pv-organize-anchor-node');
        totalPages.forEach(element => {
            let pageOrder = parseInt(element.getAttribute('data-page-order'), 10);
            let thumbnailPageNumber = element.querySelector('.e-pv-tile-number') as HTMLElement;
            if(thumbnailPageNumber){
                thumbnailPageNumber.textContent = (pageOrder + 1).toString();
            }
        });
    }

    private insertTempPage(currentPageIndex: number, isBefore: boolean, tileDiv: HTMLElement): void {
        if(this.pdfViewer.pageOrganizerSettings.canInsert){
            let index: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
            let beforeIndex: number;
            if(currentPageIndex !== 0){
                beforeIndex = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex - 1);
            }
            else{
                beforeIndex = index;
            }
            let pageIndex: number;
            let pageSize;
            if (isBefore) {
                pageIndex = this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].pageIndex;
                if (index - 1 >= 0 && !this.tempOrganizePagesCollection[parseInt((index - 1).toString(), 10)].isInserted) {
                    this.tempOrganizePagesCollection[parseInt((index - 1).toString(), 10)].hasEmptyPageAfter = true;
                }
                if (index <= this.tempOrganizePagesCollection.length - 1 && !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isInserted) {
                    this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].hasEmptyPageBefore = true;
                }
                pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].pageSize));
                if(pageIndex !== -1 ){
                    if(!isNullOrUndefined(pageSize.rotation) && (this.getRotatedAngle(pageSize.rotation.toString()) == 90 || this.getRotatedAngle(pageSize.rotation.toString()) == 270)){
                        let swapWidth = pageSize.width;
                        pageSize.width = pageSize.height;
                        pageSize.height = swapWidth;
                    }
                }
                this.tempOrganizePagesCollection = [...this.tempOrganizePagesCollection.slice(0, index), new OrganizeDetails(currentPageIndex, -1, this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex, true, false, false, false, false, this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].rotateAngle, pageSize), ...this.tempOrganizePagesCollection.slice(index)];
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                    if(mapIndex > index){
                        item.currentPageIndex = item.currentPageIndex + 1
                    }; 
                    return item;
                });
                tileDiv.setAttribute('data-page-order', (currentPageIndex + 1).toString());
            }
            else {
                pageIndex = this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex;
                if (index >= 0 && !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isInserted) {
                    this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].hasEmptyPageAfter = true;
                }
                if (index + 1 <= this.tempOrganizePagesCollection.length-1 && !this.tempOrganizePagesCollection[parseInt((index + 1).toString(), 10)].isInserted) {
                    this.tempOrganizePagesCollection[parseInt((index + 1).toString(), 10)].hasEmptyPageBefore = true;
                }
                pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageSize));
                if(pageIndex !== -1 ){
                    if(!isNullOrUndefined(pageSize.rotation) && (this.getRotatedAngle(pageSize.rotation.toString()) == 90 || this.getRotatedAngle(pageSize.rotation.toString()) == 270)){
                        let swapWidth = pageSize.width;
                        pageSize.width = pageSize.height;
                        pageSize.height = swapWidth;
                    }
                }
                this.tempOrganizePagesCollection = [...this.tempOrganizePagesCollection.slice(0, index + 1), new OrganizeDetails(currentPageIndex + 1, -1, this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex, true, false, false, false, false, this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].rotateAngle, pageSize), ...this.tempOrganizePagesCollection.slice(index + 1)];
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                    if(mapIndex > index + 1){
                        item.currentPageIndex = item.currentPageIndex + 1
                    }; 
                    return item;
                });
            }
            while(!isNullOrUndefined(tileDiv.nextElementSibling)){
                let nextTileDiv = tileDiv.nextElementSibling as HTMLElement;
                let nextTileIndex = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
                nextTileIndex = nextTileIndex + 1;
                nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
                tileDiv = nextTileDiv;
            }
        }
    }

    private updateOrganizePageCollection(): void {
        this.organizePagesCollection = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection));
    }

    /**
     * 
     * @param pageCanvas 
     * @param pageNumber 
     * @private
     */
    public applyElementStyles(pageCanvas: any, pageNumber: number): void {
        if (pageCanvas) {
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
            const oldCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);

            if (canvasElement && canvasElement.offsetLeft > 0) {
                // Update marginLeft, marginRight, and top positions
                const offsetLeft = canvasElement.offsetLeft;
                const offsetTop = canvasElement.offsetTop;

                pageCanvas.style.marginLeft = offsetLeft + 'px';
                pageCanvas.style.marginRight = offsetLeft + 'px';
                pageCanvas.style.top = offsetTop + 'px';
            } else if (oldCanvas && oldCanvas.offsetLeft > 0) {
                // Update marginLeft, marginRight, and top positions using oldCanvas
                const offsetLeft = oldCanvas.offsetLeft;
                const offsetTop = oldCanvas.offsetTop;

                pageCanvas.style.marginLeft = offsetLeft + 'px';
                pageCanvas.style.marginRight = offsetLeft + 'px';
                pageCanvas.style.top = offsetTop + 'px';
            } else {
                // Reset the positions
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
                pageCanvas.style.top = 'auto';
            }
        }
    }

    private onSaveasClicked(): void {
        let temp = JSON.parse(JSON.stringify(this.organizePagesCollection));
        this.updateOrganizePageCollection();
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let fileName = this.pdfViewer.fileName;
        let pdfBlob: Blob;
        let canDownload: boolean = false;
        this.pdfViewer.saveAsBlob().then((blob: Blob) => {
            pdfBlob = blob;
            this.blobToBase64(pdfBlob).then((base64: string) => {
                if(!isNullOrUndefined(base64) && base64 !== ''){
                    canDownload = this.pdfViewer.firePageOrganizerSaveAsEventArgs(fileName, base64);
                    if(canDownload){
                        this.pdfViewerBase.download();
                        this.organizePagesCollection = JSON.parse(JSON.stringify(temp));
                    }
                }
            });
        });
    }

    /**
     * 
     * Rotates all pages in the PDF Viewer by the specified angle.
     * @param pageRotateAngle - The angle by which to rotate the pages (PdfPageRotateAngle).
     *                          The rotation can be 0, 90, 180, or 270 degrees.
     * @returns void
     * @private
     */
    public rotateAllPages(pageRotateAngle: PdfPageRotateAngle): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            const rotateAngle = pageRotateAngle as PdfPageRotateAngle;
            // Get the total page count
            const totalPages = this.pdfViewer.pageCount;
            // Generate an array of page indexes
            const pageIndexes = Array.from({ length: totalPages }, (_, index) => index);
            this.processRotation(pageIndexes, rotateAngle);
        }
    }

    /**
     * Rotates the specified pages in the PDF Viewer by the specified angle.
     * @param pageIndexes - The array of page indexes to rotate.
     * @param pageRotateAngle - The angle by which to rotate the pages (PdfPageRotateAngle).
     *                          The rotation can be 0, 90, 180, or 270 degrees.
     * @returns void
     * @private
     */
    public rotatePages(pageIndexes: number[], pageRotateAngle: PdfPageRotateAngle): void;
    
    /**
     * @private
     */
    public rotatePages(pageStartIndex: number, pageEndIndex: number, pageRotateAngle: PdfPageRotateAngle): void;
    /**
     * @private
     */
    public rotatePages(pageRotations: PageRotation[]): void;
    /**
     * @private
     */
    public rotatePages(arg1: number | number[] | PageRotation[], arg2?: number | PdfPageRotateAngle): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            if (Array.isArray(arg1)) {
                // Check if the second argument is provided and is of type PdfPageRotateAngle
                if (arg2 !== undefined && typeof arg2 === 'number') {
                    const pageIndexes = arg1 as number[];
                    const rotateAngle = arg2 as PdfPageRotateAngle;
                    this.processRotation(pageIndexes, rotateAngle);
                } else {
                    // Handle case: RotatePages(pageRotations: PageRotation[])
                    const pageRotations = arg1 as PageRotation[];
                    for (const pageRotation of pageRotations) {
                        this.processRotation([pageRotation.pageIndex], pageRotation.rotationAngle);
                    }
                }
            }
            else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
                // Handle case: RotatePages(pageStartIndex, pageEndIndex, PdfPageRotateAngle.RotateAngle90)
                const pageStartIndex = arg1 as number;
                const pageEndIndex = arg2 as number;
                const rotateAngle = arguments[2] as PdfPageRotateAngle;
                this.processRotation(this.generateRange(pageStartIndex, pageEndIndex), rotateAngle);
            }
        }
    }

    private processRotation(pageIndexes: number[], pageRotateAngle: PdfPageRotateAngle): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            // Iterate through the provided page numbers
            for (const pageIndex of pageIndexes) {
                const rotateAngle = this.pdfRotateAngle(pageRotateAngle);
    
                // Find the index of the page in the rotationDetail array
                const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
    
                // Check if the page is already in the rotationDetail array
                if (index !== -1) {
                    // If the pageIndex is found in the array, update the rotation angle
                    this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle = (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle + rotateAngle + 360) % 360;
                }
            }
        }
    }

    private generateRange(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    private pdfRotateAngle(rotateAngle: PdfPageRotateAngle): number {
        var angle: number = 0;
        if (rotateAngle == PdfPageRotateAngle.RotateAngle0) {
            angle = 0;
        }
        else if (rotateAngle == PdfPageRotateAngle.RotateAngle90) {
            angle = 90;
        }
        else if (rotateAngle == PdfPageRotateAngle.RotateAngle180) {
            angle = 180;
        }
        else if (rotateAngle == PdfPageRotateAngle.RotateAngle270) {
            angle = 270;
        }
        else if (rotateAngle == PdfPageRotateAngle.RotateAngle360) {
            angle = 0;
        }
        return angle;
    }

    private createTooltip(toolbarItem: HTMLElement, tooltipText: string): void {
        if (tooltipText !== null) {
            // eslint-disable-next-line
            let tooltip: Tooltip = new Tooltip({ content: initializeCSPTemplate(
                function (): string { return tooltipText; }
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
    }

    /**
     * Rotates the specified pages clockwise by 90 degrees.
     * @param pageNumbers - Array of page numbers to rotate.
     * @private
     */
    public rotateClockwise(pageNumbers: number[]): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            // Iterate through the provided page numbers
            for (const pageIndex of pageNumbers) {
                // Find the index of the page in the rotationDetail array
                const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
    
                // Check if the page is already in the rotationDetail array
                if (index !== -1) {
                    // If the pageIndex is found in the array, update the rotation angle
                    this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle = (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle + 90 + 360) % 360;
                }
            }
        }
    }

    /**
     * Rotates the specified pages counterclockwise by 90 degrees.
     * @param pageNumbers - Array of page numbers to rotate.
     * @private
     */
    public rotateCounterclockwise(pageNumbers: number[]): void {
        if(this.pdfViewer.pageOrganizerSettings.canRotate){
            // Iterate through the provided page numbers
            for (const pageIndex of pageNumbers) {
                // Find the index of the page in the rotationDetail array
                const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
    
                // Check if the page is already in the rotationDetail array
                if (index !== -1) {
                    // If the pageIndex is found in the array, update the rotation angle
                    this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle = (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle - 90 + 360) % 360;
                }
            }
        }
    }

    /**
     * Opens the page organizer dialog within the Pdf Viewer, allowing for management of PDF pages.
     * 
     * ```html
     * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
     * ```
     * ```ts
     * let viewer: PdfViewer = new PdfViewer();
     * viewer.appendTo("#pdfViewer");
     * viewer.documentLoad = () => {
     *      viewer.pageOrganizer.openPageOrganizer();
     * }
     * ```
     *
     * @returns void
     */
    public openPageOrganizer(): void {
        if(!isNullOrUndefined(this.pdfViewer.pageOrganizer)){
            if(this.isAllImagesReceived){
                if(!Browser.isDevice || this.pdfViewer.enableDesktopMode){
                    this.createOrganizeWindow();
                }
                else{
                    this.createOrganizeWindowForMobile();
                }
            }
        }
        else{
            this.pdfViewerBase.getModuleWarningMessage('PageOrganizer');
        }
    }

    /**
     * Closes the currently open page organizer dialog within the PDF Viewer, if present.
     * 
     * ```html
     * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
     * ```
     * ```ts
     * let viewer: PdfViewer = new PdfViewer();
     * viewer.appendTo("#pdfViewer");
     * viewer.documentLoad = () => {
     *      viewer.pageOrganizer.closePageOrganizer();
     * }
     * ```
     *
     * @returns void
     */
    public closePageOrganizer(): void {
        if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
            if(!isNullOrUndefined(this.organizeDialog)){
                this.organizeDialog.hide();
            }
        }
        else{
            this.pdfViewerBase.getModuleWarningMessage('PageOrganizer');
        }
    };

    /**
     * @private
     */
    public switchPageOrganizer(): void {
        if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
            if (!isNullOrUndefined(this.organizeDialog) && this.organizeDialog.visible) {
                this.closePageOrganizer();
            } else {
                this.openPageOrganizer();
            }
        }
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'PageOrganizer';
    }

    private destroyDialogWindow(): void {
        if (!isNullOrUndefined(this.organizeDialog)) {
            this.organizeDialog.destroy();
            this.organizeDialog = null;
        }
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_organize_window');
        if (!isNullOrUndefined(dialogElement)) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    /**
     * @private
     */
    public clear(): void {
        if(!isNullOrUndefined( this.pdfViewerBase.navigationPane)){
            this.pdfViewerBase.navigationPane.enableOrganizeButton(false);
        }
        if(!isNullOrUndefined(this.pdfViewer.toolbar)){
            this.pdfViewer.toolbar.enableToolbarItem(['OrganizePagesTool'], false);
        }
        this.destroyDialogWindow();
        this.organizePagesCollection = [];
        this.tempOrganizePagesCollection = [];
        this.mobileContextMenu = [];
        this.dataDetails = [];
    }

    /**
     * @private
     */
    public destroy(): boolean {
        return true;
    }

}

/**
* Enum for PdfPageRotateAngle
*/
export enum PdfPageRotateAngle {
    RotateAngle0 = 1,
    RotateAngle90 = 2,
    RotateAngle180 = 3,
    RotateAngle270 = 4,
    RotateAngle360 = 1
}

export class PageRotation {
    constructor(public pageIndex: number, public rotationAngle: PdfPageRotateAngle) { }
}

/**
 * Interface representing details about a page, including rotation angle and page index.
 * 
 * @hidden
 */
export interface PageDetails {
    rotateAngle: number;
    pageIndex: number;
}

/**
 * Interface representing details about organizing pages, including page ID, current page index, rotate angle, and status of insertion and deletion.
 */
export class OrganizeDetails {
    currentPageIndex: number;
    pageIndex: number;

    copiedPageIndex: number;

    isInserted: boolean;
    isDeleted: boolean;
    isCopied: boolean;

    hasEmptyPageAfter: boolean;
    hasEmptyPageBefore: boolean;

    rotateAngle: number;
    pageSize: ISize;

    constructor(currentPageIndex: number, pageIndex: number, copiedPageIndex:number,  isInserted: boolean, isDeleted: boolean, isCopied: boolean,  hasEmptyPageAfter: boolean, hasEmptyPageBefore: boolean, rotateAngle: number, pageSize: ISize) {
        this.currentPageIndex = currentPageIndex;
        this.pageIndex = pageIndex;
        this.copiedPageIndex = copiedPageIndex;
        this.isInserted = isInserted;
        this.isDeleted = isDeleted;
        this.isCopied = isCopied;
        this.hasEmptyPageAfter = hasEmptyPageAfter;
        this.hasEmptyPageBefore = hasEmptyPageBefore;
        this.rotateAngle = rotateAngle;
        this.pageSize = pageSize
    }
}
