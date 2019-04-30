import { createElement, Browser } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, Toolbar } from '../index';
import { DropDownButton, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider, ColorPickerEventArgs, ChangeEventArgs } from '@syncfusion/ej2-inputs';

/**
 * @hidden
 */
export class AnnotationToolbar {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private primaryToolbar: Toolbar;
    /**
     * @private
     */
    public toolbarElement: HTMLElement;
    private highlightItem: HTMLElement;
    private underlineItem: HTMLElement;
    private strikethroughItem: HTMLElement;
    private deleteItem: HTMLElement;
    /**
     * @private
     */
    public colorDropDownElement: HTMLElement;
    private opacityDropDownElement: HTMLElement;
    private colorDropDown: DropDownButton;
    private opacityDropDown: DropDownButton;
    private closeItem: HTMLElement;
    private opacityIndicator: HTMLElement;
    private toolbar: Tool;
    private colorPalette: ColorPicker;
    private opacitySlider: Slider;
    private toolbarBorderHeight: number = 1;
    /**
     * @private
     */
    public isToolbarHidden: boolean = false;
    /**
     * @private
     */
    public isMobileAnnotEnabled: boolean = false;
    private isHighlightEnabled: boolean = false;
    private isUnderlineEnabled: boolean = false;
    private isStrikethroughEnabled: boolean = false;
    private isHighlightBtnVisible: boolean = true;
    private isUnderlineBtnVisible: boolean = true;
    private isStrikethroughBtnVisible: boolean = true;
    private isColorToolVisible: boolean = true;
    private isOpacityToolVisible: boolean = true;
    private isDeleteAnnotationToolVisible: boolean = true;
    private isCurrentAnnotationOpacitySet: boolean = false;
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase, toolbar: Toolbar) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }

    /**
     * @private
     */
    public initializeAnnotationToolbar(): void {
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.toolbar = new Tool({
            width: '', height: '', overflowMode: 'Popup',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
            created: () => {
                this.createDropDowns();
            }
        });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        this.afterToolbarCreation();
        this.showAnnotationToolbar(null);
        this.applyAnnotationToolbarSettings();
        this.updateToolbarItems();
    }
    public createMobileAnnotationToolbar(isEnable: boolean): void {
        if (Browser.isDevice) {
            if (this.toolbarElement == null && isEnable) {
                this.isMobileAnnotEnabled = true;
                // tslint:disable-next-line:max-line-length
                this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
                this.toolbar = new Tool({
                    width: '', height: '', overflowMode: 'Popup',
                    items: this.createMobileToolbarItems(), clicked: this.onToolbarClicked.bind(this),
                    created: () => {
                        this.createDropDowns();
                    }
                });
                if (this.pdfViewer.enableRtl) {
                    this.toolbar.enableRtl = true;
                }
                this.pdfViewerBase.navigationPane.goBackToToolbar();
                this.pdfViewer.toolbarModule.showToolbar(false);
                this.toolbar.appendTo(this.toolbarElement);
                this.deleteItem = this.pdfViewerBase.getElement('_annotation_delete');
                this.deleteItem.firstElementChild.id = this.pdfViewer.element.id + '_annotation_delete';
            } else if (this.toolbarElement != null) {
                if (isEnable) {
                    this.isMobileAnnotEnabled = true;
                    this.pdfViewerBase.navigationPane.goBackToToolbar();
                    this.pdfViewer.toolbarModule.showToolbar(false);
                    this.toolbarElement.style.display = 'block';
                } else if (!isEnable) {
                    this.isMobileAnnotEnabled = false;
                    this.pdfViewer.toolbarModule.showToolbar(true);
                    this.hideMobileAnnotationToolbar();
                }
            }
        } else {
            this.isMobileAnnotEnabled = true;
        }
    }
    public hideMobileAnnotationToolbar(): void {
        if (this.toolbarElement != null) {
            this.toolbarElement.style.display = 'none';
        }
    }
    // tslint:disable-next-line
    private createMobileToolbarItems(): any[] {
        let colorTemplate: string = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        let opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        let items: any[] = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ template: colorTemplate, align: 'right' });
        items.push({ template: opacityTemplate, align: 'right' });
        items.push({ type: 'Separator', align: 'right' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'right' });
        return items;
    }
    private goBackToToolbar(): void {
        this.isMobileAnnotEnabled = false;
        this.hideMobileAnnotationToolbar();
        this.pdfViewer.toolbarModule.showToolbar(true);
        let page: number = this.pdfViewerBase.getSelectTextMarkupCurrentPage();
        if (page) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(page);
        }
    }
    // tslint:disable-next-line
    private createToolbarItems(): any[] {
        let colorTemplate: string = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        let opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        let items: any[] = [];
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-highlight-icon e-pv-icon', className: 'e-pv-highlight-container', id: this.pdfViewer.element.id + '_highlight', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-underline-icon e-pv-icon', className: 'e-pv-underline-container', id: this.pdfViewer.element.id + '_underline', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-strikethrough-icon e-pv-icon', className: 'e-pv-strikethrough-container', id: this.pdfViewer.element.id + '_strikethrough', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: colorTemplate, align: 'Left' });
        items.push({ template: opacityTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_annotation_close', align: 'Right' });
        return items;
    }

    private getTemplate(elementName: string, id: string, className: string): string {
        let element: HTMLElement = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    }

    private createDropDowns(): void {
        this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
        this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
        this.colorDropDown.open = this.colorDropDownOpen.bind(this);
        this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
        this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
        let sliderContainer: HTMLElement = this.createSlider(this.opacityDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
        this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
        this.opacitySlider.change = this.opacityChange.bind(this);
        this.opacitySlider.changed = this.opacityChange.bind(this);
        this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
    }

    private opacityDropDownOpen(): void {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            let opacityElement: HTMLElement = this.pdfViewerBase.getElement('_annotation_opacity-popup');
            opacityElement.style.left = '0px';
        }
    }

    private onColorPickerCancelClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('e-cancel')) {
            this.colorDropDown.toggle();
        }
    }

    private colorDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.colorPalette.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color;
            } else {
                this.setCurrentColorInPicker();
            }
        }
        this.colorPalette.refresh();
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    }

    /**
     * @private
     */
    public setCurrentColorInPicker(): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                case 'Highlight':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor }, true);
                    break;
                case 'Underline':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor }, true);
                    break;
                case 'Strikethrough':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor }, true);
                    break;
            }
        }
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    }

    private colorDropDownOpen(): void {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
           this.pdfViewerBase.getElement('_annotation_color-popup').style.left = '0px';
        }
        this.colorPalette.refresh();
    }

    private opacityChange(args: ChangeEventArgs): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                if (this.isCurrentAnnotationOpacitySet && args.name === 'changed') {
                    this.isCurrentAnnotationOpacitySet = false;
                } else {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(args);
                }
            } else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity = args.value / 100;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity = args.value / 100;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity = args.value / 100;
                        break;
                }
            }
        }
        this.updateOpacityIndicator();
    }

    private opacityDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.isCurrentAnnotationOpacitySet = true;
                // tslint:disable-next-line:max-line-length
                this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.opacity * 100;
            } else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity * 100;
                        break;
                    case 'Underline':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity * 100;
                        break;
                    case 'Strikethrough':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity * 100;
                        break;
                }
            }
        }
        this.updateOpacityIndicator();
    }

    private createDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement, tooltipText: string): DropDownButton {
        // tslint:disable-next-line:max-line-length
        let dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        return dropDownButton;
    }

    private createColorPicker(idString: string): ColorPicker {
        let inputElement: HTMLElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        let colorPicker: ColorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            change: this.onColorPickerChange.bind(this), value: '#000000', showButtons: false,
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }

    private onColorPickerChange(args: ColorPickerEventArgs): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(args.currentValue.hex);
            } else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor = args.currentValue.hex;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor = args.currentValue.hex;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor = args.currentValue.hex;
                        break;
                }
            }
        }
        this.updateColorInIcon(this.colorDropDownElement, args.currentValue.hex);
        this.colorDropDown.toggle();
    }

    /**
     * @private
     */
    public updateColorInIcon(element: HTMLElement, color: string): void {
        (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
    }

    private updateOpacityIndicator(): void {
        this.opacityIndicator.textContent = this.opacitySlider.value + '%';
    }

    private createSlider(idString: string): HTMLElement {
        let outerContainer: HTMLElement = createElement('div', { className: 'e-pv-annotation-opacity-popup-container' });
        document.body.appendChild(outerContainer);
        let label: HTMLElement = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-opacity-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Opacity');
        let sliderElement: HTMLElement = createElement('div', { id: idString + '_slider' });
        this.opacitySlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-opacity-slider', max: 100, min: 0 });
        // tslint:disable-next-line:max-line-length
        this.opacityIndicator = createElement('div', { id: idString + '_opacity_indicator', className: 'e-pv-annotation-opacity-indicator' });
        this.opacityIndicator.textContent = '100%';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(this.opacityIndicator);
        } else {
            outerContainer.appendChild(this.opacityIndicator);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.enableRtl = true;
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(label);
        }
        return outerContainer;
    }

    private afterToolbarCreation(): void {
        // tslint:disable-next-line:max-line-length
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        // tslint:disable-next-line:max-line-length
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_annotation_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_annotation_close', 'e-pv-annotation-tools-close', null);
        this.selectAnnotationDeleteItem(false);
        this.enableAnnotationPropertiesTools(false);
    }

    private onToolbarClicked(args: ClickEventArgs): void {
        switch ((args.originalEvent.target as HTMLElement).id) {
            case this.pdfViewer.element.id + '_highlight':
            case this.pdfViewer.element.id + '_highlightIcon':
                this.handleHighlight();
                break;
            case this.pdfViewer.element.id + '_underline':
            case this.pdfViewer.element.id + '_underlineIcon':
                this.handleUnderline();
                break;
            case this.pdfViewer.element.id + '_strikethrough':
            case this.pdfViewer.element.id + '_strikethroughIcon':
                this.handleStrikethrough();
                break;
            case this.pdfViewer.element.id + '_annotation_delete':
            case this.pdfViewer.element.id + '_annotation_deleteIcon':
                this.pdfViewer.annotationModule.deleteAnnotation();
                break;
            case this.pdfViewer.element.id + '_annotation_close':
            case this.pdfViewer.element.id + '_annotation_closeIcon':
                this.showAnnotationToolbar(this.primaryToolbar.annotationItem);
                break;
        }
    }

    /**
     * @private
     */
    public showAnnotationToolbar(element: HTMLElement): void {
        if (!this.isToolbarHidden) {
            // tslint:disable-next-line
            let annotationModule: any = this.pdfViewer.annotationModule;
            if (element) {
                this.adjustViewer(false);
                this.primaryToolbar.deSelectItem(element);
            }
            // tslint:disable-next-line:max-line-length           
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.enablePropertiesTool(annotationModule);
            } else {
                this.deselectAllItems();
            }
            this.toolbarElement.style.display = 'none';
            this.primaryToolbar.updateInteractionTools(true);
        } else {
            let toolBarInitialStatus: string = this.toolbarElement.style.display;
            this.toolbarElement.style.display = 'block';
            if (element) {
                this.primaryToolbar.selectItem(element);
                if (toolBarInitialStatus === 'none') {
                    this.primaryToolbar.DisableInteractionTools();
                    this.adjustViewer(true);
                }
            }
        }
        // tslint:disable-next-line:max-line-length           
        if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
            this.pdfViewer.magnification.fitToPage();
        }
        if (this.pdfViewerBase.isPanMode) {
            this.enableAnnotationAddTools(false);
        } else {
            this.enableAnnotationAddTools(true);
        }
        this.isToolbarHidden = !this.isToolbarHidden;
    }
    // tslint:disable-next-line
    private enablePropertiesTool(annotationModule: any): void {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.enableAnnotationPropertiesTools(true);
        // tslint:disable-next-line:max-line-length  
        this.updateColorInIcon(this.colorDropDownElement, annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color);
        this.selectAnnotationDeleteItem(true);
    }
    private applyAnnotationToolbarSettings(): void {
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('HighlightTool') !== -1) {
            this.showHighlightTool(true);
        } else {
            this.showHighlightTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('UnderlineTool') !== -1) {
            this.showUnderlineTool(true);
        } else {
            this.showUnderlineTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('StrikethroughTool') !== -1) {
            this.showStrikethroughTool(true);
        } else {
            this.showStrikethroughTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('ColorEditTool') !== -1) {
            this.showColorEditTool(true);
        } else {
            this.showColorEditTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('OpacityEditTool') !== -1) {
            this.showOpacityEditTool(true);
        } else {
            this.showOpacityEditTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('AnnotationDeleteTool') !== -1) {
            this.showAnnotationDeleteTool(true);
        } else {
            this.showAnnotationDeleteTool(false);
        }
        this.showSeparator();
    }

    private showSeparator(): void {
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)
            || (!this.isColorToolVisible && !this.isOpacityToolVisible)) {
            this.applyHideToToolbar(false, 3, 3);
        }
        if ((!this.isColorToolVisible && !this.isOpacityToolVisible) && (!this.isHighlightBtnVisible &&
            !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible) || !this.isDeleteAnnotationToolVisible) {
            this.applyHideToToolbar(false, 6, 6);
        }
    }

    private showHighlightTool(isShow: boolean): void {
        this.isHighlightBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    }

    private showUnderlineTool(isShow: boolean): void {
        this.isUnderlineBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 1, 1);
    }

    private showStrikethroughTool(isShow: boolean): void {
        this.isStrikethroughBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 2, 2);
    }

    private showColorEditTool(isShow: boolean): void {
        this.isColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 4, 4);
    }

    private showOpacityEditTool(isShow: boolean): void {
        this.isOpacityToolVisible = isShow;
        this.applyHideToToolbar(isShow, 5, 5);
    }

    private showAnnotationDeleteTool(isShow: boolean): void {
        this.isDeleteAnnotationToolVisible = isShow;
        this.applyHideToToolbar(isShow, 7, 7);
    }

    private applyHideToToolbar(show: boolean, startIndex: number, endIndex: number): void {
        let isHide: boolean = !show;
        for (let index: number = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    }

    private adjustViewer(isAdjust: boolean): void {
        let splitterElement: HTMLElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        let toolbarContainer: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer');
        let toolbarHeight: number = this.getToolbarHeight(toolbarContainer);
        let annotationToolbarHeight: number = this.getToolbarHeight(this.toolbarElement);
        let sideBarToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
        let sideBarContentContainer: HTMLElement = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        if (isAdjust) {
            if (this.pdfViewer.enableToolbar) {
                sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            } else {
                sideBarToolbar.style.top = (annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (annotationToolbarHeight) + 'px';
                splitterElement.style.top = (annotationToolbarHeight) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight)) + 'px';
            sideBarToolbar.style.height = sideBarToolbar.getBoundingClientRect().height - annotationToolbarHeight + 'px';
            splitterElement.style.height = splitterElement.getBoundingClientRect().height - annotationToolbarHeight + 'px';
        } else {
            if (this.pdfViewer.enableToolbar) {
                // tslint:disable-next-line:max-line-length
                sideBarToolbar.style.top = toolbarHeight + 'px';
                sideBarContentContainer.style.top = toolbarHeight + 'px';
                splitterElement.style.top = toolbarHeight + 'px';
            } else {
                sideBarToolbar.style.top = 1 + 'px';
                sideBarToolbar.style.height = '100%';
                sideBarContentContainer.style.top = 1 + 'px';
                sideBarContentContainer.style.height =  '100%';
                splitterElement.style.top = 1 + 'px';
                splitterElement.style.height = '100%';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            sideBarToolbar.style.height = this.getHeight(sideBarToolbar, annotationToolbarHeight);
            splitterElement.style.height = this.getHeight(splitterElement, annotationToolbarHeight);
        }
        this.updateContentContainerHeight(isAdjust);
    }

    private updateContentContainerHeight(isAdjust: boolean): void {
        let annotationToolbarHeight: number = this.getToolbarHeight(this.toolbarElement);
        let sideBarClientRect: ClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
        if (sideBarClientRect.height !== 0) {
            if (isAdjust) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height - annotationToolbarHeight + 'px';
            } else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height + annotationToolbarHeight + 'px';
            }
        }
    }

    private getToolbarHeight(element: HTMLElement): number {
        let toolbarHeight: number = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            // getComputedStyle gets the value from style and toolbar border height is added to it.
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
        }
        return toolbarHeight;
    }

    private getHeight(element: HTMLElement, toolbarHeight: number): string {
        let height: number = element.getBoundingClientRect().height;
        return (height !== 0) ? height + toolbarHeight + 'px' : '';
    }

    private handleHighlight(): void {
        if (!this.isHighlightEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
            this.primaryToolbar.selectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.enableAnnotationPropertiesTools(true);
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor);
            this.isHighlightEnabled = true;
            this.isUnderlineEnabled = false;
            this.isStrikethroughEnabled = false;
        } else {
            this.deselectAllItems();
        }
    }

    private handleUnderline(): void {
        if (!this.isUnderlineEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
            this.primaryToolbar.selectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.enableAnnotationPropertiesTools(true);
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor);
            this.isUnderlineEnabled = true;
            this.isHighlightEnabled = false;
            this.isStrikethroughEnabled = false;
        } else {
            this.deselectAllItems();
        }
    }

    private handleStrikethrough(): void {
        if (!this.isStrikethroughEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
            this.primaryToolbar.selectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.enableAnnotationPropertiesTools(true);
            // tslint:disable-next-line:max-line-length
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
            this.isStrikethroughEnabled = true;
            this.isHighlightEnabled = false;
            this.isUnderlineEnabled = false;
        } else {
            this.deselectAllItems();
        }
    }

    private deselectAllItems(): void {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.enableAnnotationPropertiesTools(false);
        this.updateColorInIcon(this.colorDropDownElement, '#000000');
        this.selectAnnotationDeleteItem(false);
    }

    /**
     * @private
     */
    public selectAnnotationDeleteItem(isEnable: boolean): void {
        this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
    }

    /**
     * @private
     */
    public enableAnnotationPropertiesTools(isEnable: boolean): void {
        this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
        this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
    }

    /**
     * @private
     */
    public enableAnnotationAddTools(isEnable: boolean): void {
        this.toolbar.enableItems(this.highlightItem.parentElement, isEnable);
        this.toolbar.enableItems(this.underlineItem.parentElement, isEnable);
        this.toolbar.enableItems(this.strikethroughItem.parentElement, isEnable);
    }

    /**
     * @private
     */
    public isAnnotationButtonsEnabled(): boolean {
        let isButtonsEnabled: boolean = false;
        if (this.isHighlightEnabled || this.isUnderlineEnabled || this.isStrikethroughEnabled) {
            isButtonsEnabled = true;
        }
        return isButtonsEnabled;
    }

    private updateToolbarItems(): void {
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.enableAnnotationAddTools(true);
        } else {
            this.enableAnnotationAddTools(false);
        }
    }

    /**
     * @private
     */
    public resetToolbar(): void {
        this.adjustViewer(false);
        this.updateToolbarItems();
        this.toolbarElement.style.display = 'none';
        this.isToolbarHidden = true;
    }

    /**
     * @private
     */
    public clear(): void {
        this.deselectAllItems();
    }

    /**
     * @private
     */
    public destroy(): void {
        this.colorDropDown.destroy();
        this.opacityDropDown.destroy();
        this.toolbar.destroy();
    }

    private getElementHeight(element: HTMLElement): number {
        return element.getBoundingClientRect().height;
    }

    private updateViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return viewerHeight - toolbarHeight;
    }

    private resetViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return viewerHeight + toolbarHeight;
    }
}