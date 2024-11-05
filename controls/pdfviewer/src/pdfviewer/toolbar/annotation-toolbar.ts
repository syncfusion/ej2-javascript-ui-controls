import { createElement, Browser, isBlazor, isNullOrUndefined, closest, initializeCSPTemplate } from '@syncfusion/ej2-base';
import {
    Toolbar as Tool, ClickEventArgs, MenuItemModel, Menu, MenuModel,
    BeforeOpenCloseMenuEventArgs as Menuopen, MenuEventArgs
} from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, Toolbar, MeasureAnnotation, PolygonDrawingTool, MouseEventArgs } from '../index';

import { DropDownButton, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, ItemModel, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider, ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { PdfAnnotationBaseModel, PdfFontModel } from '../drawing/pdf-annotation-model';
import { Annotation, ShapeAnnotation } from '../annotation';
import { cloneObject } from '../drawing/drawing-util';
import { FreeTextAnnotation } from '../annotation/free-text-annotation';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DynamicStampItem, SignStampItem, StandardBusinessStampItem } from '../base/types';
/* eslint-disable valid-jsdoc */
/**
 * @param {string} args - args
 * @param {any} buttonElement - button element
 * @param {any} colorElement - color element
 * @returns {void}
 * @hidden
 */
export class AnnotationToolbar {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public primaryToolbar: Toolbar;
    /**
     * @private
     */
    public toolbarElement: HTMLElement;
    private highlightItem: HTMLElement;
    private underlineItem: HTMLElement;
    private strikethroughItem: HTMLElement;
    private fontStyleStrikethroughItem: HTMLElement;
    private fontStyleUnderlineItem: HTMLElement;
    private deleteItem: HTMLElement;
    private isSignatureIteam: boolean;
    /**
     * @private
     */
    public freeTextEditItem: HTMLElement;
    /**
     * @private
     */
    public colorDropDownElement: HTMLElement;
    /**
     * @private
     */
    public colorDropDownElementInBlazor: HTMLElement;
    /**
     * @private
     */
    public strokeDropDownElementInBlazor: HTMLElement;
    /**
     * @private
     */
    public fontColorElementInBlazor: HTMLElement;
    private strokeDropDownElement: HTMLElement;
    private thicknessElement: HTMLElement;
    private shapeElement: HTMLElement;
    private calibrateElement: HTMLElement;
    private stampElement: HTMLElement;
    private opacityDropDownElement: HTMLElement;
    private colorDropDown: DropDownButton;
    private opacityDropDown: DropDownButton;
    private strokeDropDown: DropDownButton;
    private thicknessDropDown: DropDownButton;
    private shapeDropDown: DropDownButton;
    private calibrateDropDown: DropDownButton;
    private commentItem: HTMLElement;
    private closeItem: HTMLElement;
    private opacityIndicator: HTMLElement;
    private thicknessIndicator: HTMLElement;
    private HighlightElement: any;
    private UnderlineElement: any;
    private StrikethroughElement: any;
    private InkAnnotationElement: any;
    private FreeTextElement: any;
    /**
     * @private
     */
    public toolbar: Tool;
    /**
     * @private
     */
    /**
     * @private
     */
    public propertyToolbar: Tool;
    /**
     * @private
     */
    public freeTextPropertyToolbar: Tool;
    /**
     * @private
     */
    public stampPropertyToolbar: Tool;
    public colorPalette: ColorPicker;
    private strokeColorPicker: ColorPicker;
    private opacitySlider: Slider;
    private thicknessSlider: Slider;
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
    private isMobileHighlightEnabled: boolean = false;
    private isUnderlineEnabled: boolean = false;
    private isMobileUnderlineEnabled: boolean = false;
    private isStrikethroughEnabled: boolean = false;
    private isMobileStrikethroughEnabled: boolean = false;
    private isHighlightBtnVisible: boolean = true;
    private isCommentBtnVisible: boolean = true;
    private isUnderlineBtnVisible: boolean = true;
    private isStrikethroughBtnVisible: boolean = true;
    private isColorToolVisible: boolean = true;
    private isOpacityToolVisible: boolean = true;
    private isDeleteAnnotationToolVisible: boolean = true;
    private isCurrentAnnotationOpacitySet: boolean = false;
    private isStampBtnVisible: boolean = false;
    private isShapeBtnVisible: boolean = false;
    private isSignatureBtnVisible: boolean = false;
    private isInkBtnVisible: boolean = false;
    private isFontFamilyToolVisible: boolean = false;
    private isFontSizeToolVisible: boolean = false;
    private isFontAlignToolVisible: boolean = false;
    private isFontColorToolVisible: boolean = false;
    private isFontStylesToolVisible: boolean = false;
    private isCommentPanelBtnVisible: boolean = false;
    private isFreeTextBtnVisible: boolean = false;
    private isCalibrateBtnVisible: boolean = false;
    private isStrokeColorToolVisible: boolean = false;
    private isThicknessToolVisible: boolean = false;
    private menuItems: any;
    private fontSize: ComboBox;
    private fontFamily: ComboBox;
    private stampMenu: MenuItemModel[] = [];
    private stampParentID: string = '';
    private fontColorPalette: ColorPicker;
    private fontFamilyElement: HTMLElement;
    private fontSizeElement: HTMLElement;
    private fontColorElement: HTMLElement;
    private textAlignElement: HTMLElement;
    private textPropElement: HTMLElement;
    private lineElement: HTMLElement;
    private arrowElement: HTMLElement;
    private rectangleElement: HTMLElement;
    private circleElement: HTMLElement;
    private polygonElement: HTMLElement;
    private calibrateDistance: HTMLElement;
    private calibratePerimeter: HTMLElement;
    private calibrateArea: HTMLElement;
    private calibrateRadius: HTMLElement;
    private calibrateVolume: HTMLElement;
    private alignLeftElement: HTMLElement;
    private alignRightElement: HTMLElement;
    private alignCenterElement: HTMLElement;
    private alignJustifyElement: HTMLElement;
    private boldElement: HTMLElement;
    private italicElement: HTMLElement;
    private alignmentToolbar: Tool;
    private propertiesToolbar: Tool;
    private fontColorDropDown: DropDownButton;
    private textAlignDropDown: DropDownButton;
    private textPropertiesDropDown: DropDownButton;
    /**
     * @private
     */
    public handWrittenSignatureItem: HTMLElement;
    /**
     * @private
     */
    public inkAnnotationItem: HTMLElement;
    /**
     * @private
     */
    public inkAnnotationSelected: boolean = false;
    /**
     * @private
     */
    public openSignaturePopup: boolean = false;
    private isSavedSignatureClicked: boolean = false;
    private saveSignatureCount: number = 0;
    private saveInitialCount: number = 0;
    private shapesItem: HTMLElement;
    private calibrateItem: HTMLElement;
    /**
     * @private
     */
    public toolbarCreated: boolean;
    /**
     * @private
     */
    public isToolbarCreated: boolean = false;
    /**
     * @private
     */
    public textMarkupToolbarElement: HTMLElement;
    /**
     * @private
     */
    public shapeToolbarElement: HTMLElement;
    private stampToolbarElement: HTMLElement;
    private calibrateToolbarElement: HTMLElement;
    private freetextToolbarElement: HTMLElement;
    private signatureInkToolbarElement: HTMLElement;
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase, toolbar: Toolbar) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }

    /**
     * @private
     * @returns {void}
     */
    public initializeAnnotationToolbar(): void {
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.toolbar = new Tool({
            width: '', height: '', overflowMode: 'Popup', cssClass: 'e-pv-toolbar-scroll',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
            created: () => {
                this.createDropDowns();
            }
        });
        this.toolbar.isStringTemplate = true;
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        this.afterToolbarCreation();
        this.createStampContainer();
        this.createSignContainer();
        this.applyAnnotationToolbarSettings();
        this.updateToolbarItems();
        this.showAnnotationToolbar(null, true);
        this.toolbarElement.setAttribute('aria-label', 'Annotation Toolbar');
    }

    public createMobileAnnotationToolbar(isEnable: boolean, isPath?: boolean): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            if (this.toolbarElement == null && isEnable) {
                this.isMobileAnnotEnabled = true;
                this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
                this.toolbar = new Tool({
                    width: '', height: '', overflowMode: 'Popup',
                    items: this.createMobileToolbarItems(isPath), clicked: this.onToolbarClicked.bind(this),
                    created: () => {
                        this.createDropDowns(isPath);
                    }
                });
                this.toolbar.isStringTemplate = true;
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
            if (this.pdfViewer.selectedItems.annotations.length > 0 ||
                (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
                if (this.propertyToolbar && this.propertyToolbar.element.children.length > 0) {
                    this.propertyToolbar.element.style.display = 'block';
                    this.toolbarCreated = true;
                }
            } else {
                if (this.toolbar.element.children.length > 0) {
                    this.toolbarCreated = true;
                } else {
                    this.toolbarCreated = false;
                }
                if (this.propertyToolbar && this.propertyToolbar.element.style.display !== 'none') {
                    this.propertyToolbar.element.style.display = 'none';
                    if (!this.toolbarCreated) {
                        const editIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationIcon');
                        if (editIcon && editIcon.parentElement.classList.contains('e-pv-select')) {
                            this.createAnnotationToolbarForMobile();
                        }
                    }
                }
            }
            if (this.toolbarElement.children.length > 0) {
                this.toolbarElement.style.display = 'block';
            }
            this.adjustMobileViewer();
        } else if (this.toolbarCreated && this.propertyToolbar && this.propertyToolbar.element.children.length > 0) {
            this.propertyToolbar.element.style.display = 'none';
            this.adjustMobileViewer();
            this.toolbarCreated = false;
        }
    }

    private FreeTextForMobile(): void {
        this.hideExistingTool();
        this.freetextToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_freeTextToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.freetextToolbarElement);
        const colorTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const strokeTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const fontFamilyTemplate: string = this.getTemplate('input', '_annotation_fontname', 'e-pv-annotation-fontname-container');
        const fontSizeTemplate: string = this.getTemplate('input', '_annotation_fontsize', 'e-pv-annotation-fontsize-container');
        const textColorTemplate: string = this.getTemplate('span', '_annotation_textcolor', 'e-pv-annotation-textcolor-container');
        const alignmentTemplate: string = this.getTemplate('span', '_annotation_textalign', 'e-pv-annotation-textalign-container');
        const textPropertiesTemplate: string = this.getTemplate('span', '_annotation_textproperties', 'e-pv-annotation-textprop-container');
        const items: any[] = [
            { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
            { type: 'Separator', align: 'Left', cssClass: 'e-pv-hightlight-separator-container' },
            { template: fontFamilyTemplate },
            { template: fontSizeTemplate },
            { template: textColorTemplate },
            { template: alignmentTemplate },
            { template: textPropertiesTemplate },
            { template: colorTemplate },
            { template: strokeTemplate },
            { template: thicknessTemplate },
            { template: opacityTemplate }
        ];
        this.toolbar = new Tool({
            items: items, width: '', height: '', overflowMode: 'Scrollable', created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker(this.pdfViewer.element.id + '_annotation_freeTextEdit');
            }
        });
        this.toolbar.appendTo(this.freetextToolbarElement);
        this.showFreeTextPropertiesTool();
    }

    /**
     * @param {string} shapeType - It describes about the shape type
     * @private
     * @returns {void}
     */
    public createPropertyTools(shapeType: string): void {
        if (shapeType !== '') {
            if (this.propertyToolbar) {
                this.propertyToolbar.destroy();
            }
            if (this.toolbar) {
                this.toolbar.destroy();
            }
            let shapeToolbarElement: HTMLElement;
            shapeToolbarElement = document.getElementById(this.pdfViewer.element.id + '_propertyToolbar');
            if (shapeToolbarElement) {
                shapeToolbarElement.parentElement.removeChild(shapeToolbarElement);
            }
            shapeToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_propertyToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
            this.pdfViewerBase.viewerMainContainer.appendChild(shapeToolbarElement);
            let id: string;
            const propertyToolbar: Tool = new Tool({
                items: this.createPropertyToolbarForMobile(shapeType), width: '', height: '', overflowMode: 'Scrollable',
                created: () => {
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        id = this.pdfViewer.element.id + '_underlineIcon';
                    }
                    else if (!isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0])) {
                        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                            id = this.pdfViewer.element.id + '_annotation_freeTextEdit';
                        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image') {
                            id = this.pdfViewer.element.id + '_annotation_stamp';
                        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText') {
                            id = this.pdfViewer.element.id + '_annotation_handwrittenSign';
                        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage') {
                            id = this.pdfViewer.element.id + '_annotation_handwrittenImage';
                        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Path') {
                            id = this.pdfViewer.element.id + '_annotation_inkIcon';
                        }
                        else if (shapeType === 'Highlight' || shapeType === 'Underline' || shapeType === 'Strikethrough') {
                            id = this.pdfViewer.element.id + '_highlightIcon';
                        } else {
                            id = this.pdfViewer.element.id + '_annotation_shapesIcon';
                        }
                    }
                    else if (shapeType === 'Highlight' || shapeType === 'Underline' || shapeType === 'Strikethrough') {
                        id = this.pdfViewer.element.id + '_highlightIcon';
                    } else {
                        id = this.pdfViewer.element.id + '_annotation_shapesIcon';
                    }
                    this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker(id);
                }
            });
            propertyToolbar.isStringTemplate = true;
            propertyToolbar.appendTo(shapeToolbarElement);
            if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
            !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                    this.enableItems(this.colorDropDownElement.parentElement, false);
                }
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                    const commentIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotation_commentPanel');
                    this.enableItems(commentIcon.parentElement, false);
                }
            }
            this.showPropertyTool(propertyToolbar, id);
        }
    }

    private showPropertyTool(existingTool: Tool, id: string): void {
        if (this.toolbar) {
            this.toolbar.destroy();
        }
        this.propertyToolbar = existingTool;
        this.applyProperiesToolSettings(id);
        //this.propertyToolbar.element.style.display = 'block';
        if (this.pdfViewer.selectedItems.annotations[0]) {
            const selectedAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
            if (selectedAnnotation.shapeAnnotationType !== 'SignatureText' && selectedAnnotation.shapeAnnotationType !== 'HandWrittenSignature' && selectedAnnotation.shapeAnnotationType !== 'Stamp' && selectedAnnotation.shapeAnnotationType !== 'Image' && selectedAnnotation.shapeAnnotationType !== 'Ink' && selectedAnnotation.shapeAnnotationType !== 'Path' && selectedAnnotation.shapeAnnotationType !== 'StickyNotes') {
                this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.selectedItems.annotations[0].fillColor);
                this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.selectedItems.annotations[0].strokeColor);
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    const fontFamily: any = this.fontFamilyElement;
                    fontFamily.ej2_instances[0].value = this.pdfViewer.selectedItems.annotations[0].fontFamily;
                    const fontColor: any = this.fontColorElement;
                    fontColor.children[0].style.borderBottomColor = this.pdfViewer.selectedItems.annotations[0].fontColor;
                    this.pdfViewer.annotation.modifyTextAlignment(this.pdfViewer.selectedItems.annotations[0].textAlign);
                    this.updateTextAlignInIcon(this.pdfViewer.selectedItems.annotations[0].textAlign);
                }
            } else {
                if (this.strokeDropDownElement) {
                    this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.selectedItems.annotations[0].strokeColor);
                }
            }
        }
        this.toolbarCreated = true;
        this.adjustMobileViewer();
    }

    private stampToolMobileForMobile(args: string): void {
        this.hideExistingTool();
        if (this.stampToolbarElement) {
            this.stampToolbarElement.parentElement.removeChild(this.stampToolbarElement);
        }
        this.stampToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_stampToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.stampToolbarElement);
        this.toolbar = new Tool({
            items: this.createStampToolbarItemsForMobile(), width: '', height: '', overflowMode: 'Scrollable', clicked: this.onShapeToolbarClicked.bind(this),
            created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker(args);
            }
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.stampToolbarElement);
        this.showStampPropertiesTool();
        //this.afterShapeToolbarCreationForMobile();
    }

    private shapeToolMobile(args: ClickEventArgs): void {
        this.hideExistingTool();
        if (this.shapeToolbarElement) {
            this.shapeToolbarElement.parentElement.removeChild(this.shapeToolbarElement);
        }
        this.shapeToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_shapeToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.shapeToolbarElement);
        this.toolbar = new Tool({
            items: this.createShapeToolbarItemsForMobile(), width: '', height: '', overflowMode: 'Scrollable', clicked: this.onShapeToolbarClicked.bind(this),
            created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker((args.originalEvent.target as HTMLElement).id);
            }
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.shapeToolbarElement);
        this.afterShapeToolbarCreationForMobile();
        this.showShapeTool();
    }

    private calibrateToolMobile(args: ClickEventArgs): void {
        this.hideExistingTool();
        if (this.calibrateToolbarElement) {
            this.calibrateToolbarElement.parentElement.removeChild(this.calibrateToolbarElement);
        }
        this.calibrateToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_calibrateToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.calibrateToolbarElement);
        this.toolbar = new Tool({
            items: this.createCalibrateToolbarItemsForMobile(), width: '', height: '', overflowMode: 'Scrollable', clicked: this.onCalibrateToolbarClicked.bind(this),
            created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker((args.originalEvent.target as HTMLElement).id);
            }
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.calibrateToolbarElement);
        this.afterCalibrateToolbarCreationForMobile();
        this.showShapeTool();
    }

    private textMarkupForMobile(args: ClickEventArgs): void {
        this.hideExistingTool();
        if (this.textMarkupToolbarElement) {
            this.textMarkupToolbarElement.parentElement.removeChild(this.textMarkupToolbarElement);
        }
        this.textMarkupToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_mobileAnnotationToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.textMarkupToolbarElement);
        const colorTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const items: any[] = [
            { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
            { type: 'Separator', align: 'Left', cssClass: 'e-pv-hightlight-separator-container' },
            { template: colorTemplate, align: 'left' },
            { template: opacityTemplate, align: 'left' }
        ];
        this.propertyToolbar = new Tool({
            items: items, width: '', height: '', overflowMode: 'Scrollable',
            created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker((args.originalEvent.target as HTMLElement).id);
            }
        });
        this.propertyToolbar.isStringTemplate = true;
        this.propertyToolbar.appendTo(this.textMarkupToolbarElement);
        this.showTextMarkupPropertiesTool();
    }

    private showShapeTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true, 7, 7);
            } else {
                this.showColorEditTool(false, 7, 7);
            }
            if (annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true, 8, 8);
            } else {
                this.showStrokeColorEditTool(false, 8, 8);
            }
            if (annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true, 9, 9);
            } else {
                this.showThicknessEditTool(false, 9, 9);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 10, 10);
            } else {
                this.showOpacityEditTool(false, 10, 10);
            }
        }
    }

    private signatureInkForMobile(): void {
        this.hideExistingTool();
        if (this.signatureInkToolbarElement) {
            this.signatureInkToolbarElement.parentElement.removeChild(this.signatureInkToolbarElement);
        }
        this.signatureInkToolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_mobileAnnotationToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.signatureInkToolbarElement);
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const strokeTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const items: any[] = [
            { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
            { template: opacityTemplate, align: 'left' },
            { template: strokeTemplate, aign: 'left' },
            { template: thicknessTemplate, align: 'left' }
        ];
        this.toolbar = new Tool({
            items: items, width: '', height: '', overflowMode: 'Scrollable',
            created: () => {
                this.pdfViewer.toolbarModule.annotationToolbarModule.mobileColorpicker(this.pdfViewer.element.id + '_annotation_inkIcon');
            }
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.signatureInkToolbarElement);
    }

    private hideExistingTool(): void {
        if (this.toolbar && !this.pdfViewer.enableDesktopMode) {
            this.toolbar.destroy();
        }
        if (this.propertyToolbar && !this.pdfViewer.enableDesktopMode) {
            this.propertyToolbar.destroy();
        }
        const mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_mobileAnnotationToolbar');
        if (mobileAnnotationToolbar) {
            mobileAnnotationToolbar.style.display = 'none';
        }
    }

    private applyProperiesToolSettings(type: string): void {
        switch (type) {
        case this.pdfViewer.element.id + '_underlineIcon':
        case this.pdfViewer.element.id + '_highlightIcon':
            this.showTextMarkupPropertiesTool();
            break;
        case this.pdfViewer.element.id + '_annotation_freeTextEdit':
            this.showFreeTextPropertiesTool();
            break;
        case this.pdfViewer.element.id + '_annotation_shapesIcon':
            this.shapePropertiesTool();
            break;
        case 'stampTool':
        case this.pdfViewer.element.id + '_annotation_stamp':
            this.showStampPropertiesTool();
            break;
        case this.pdfViewer.element.id + '_annotation_handwrittenSign':
        case this.pdfViewer.element.id + '_annotation_inkIcon':
            this.showInkPropertiesTool();
            break;
        case this.pdfViewer.element.id + '_annotation_handwrittenImage':
            this.showImagePropertyTool();
            break;
        }
    }

    private showImagePropertyTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 0, 0);
            }
            else {
                this.showOpacityEditTool(false, 0, 0);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 1, 1);
            }
            else {
                this.showCommentPanelTool(false, 1, 1);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 2, 2);
            }
            else {
                this.showAnnotationDeleteTool(false, 2, 2);
            }
        }
    }

    private showFreeTextPropertiesTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('FontFamilyAnnotationTool') !== -1) {
                this.showFontFamilyAnnotationTool(true, 2, 2);
            } else {
                this.showFontFamilyAnnotationTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('FontSizeAnnotationTool') !== -1) {
                this.showFontSizeAnnotationTool(true, 3, 3);
            } else {
                this.showFontSizeAnnotationTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('FontColorAnnotationTool') !== -1) {
                this.showFontColorAnnotationTool(true, 4, 4);
            } else {
                this.showFontColorAnnotationTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('FontAlignAnnotationTool') !== -1) {
                this.showFontAlignAnnotationTool(true, 5, 5);
            } else {
                this.showFontAlignAnnotationTool(false, 5, 5);
            }
            if (annotationToolbarItems.indexOf('FontStylesAnnotationTool') !== -1) {
                this.showFontStylesAnnotationTool(true, 6, 6);
            } else {
                this.showFontStylesAnnotationTool(false, 6, 6);
            }
            if (annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true, 7, 7);
            } else {
                this.showColorEditTool(false, 7, 7);
            }
            if (annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true, 8, 8);
            } else {
                this.showStrokeColorEditTool(false, 8, 8);
            }
            if (annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true, 9, 9);
            } else {
                this.showThicknessEditTool(false, 9, 9);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 10, 10);
            } else {
                this.showOpacityEditTool(false, 10, 10);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 11, 11);
            } else {
                this.showCommentPanelTool(false, 11, 11);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 12, 12);
            } else {
                this.showAnnotationDeleteTool(false, 12, 12);
            }
            if (annotationToolbarItems.indexOf('FreeTextAnnotationTool') !== -1) {
                this.showFreeTextAnnotationTool(true, 0, 0);
            } else {
                this.showFreeTextAnnotationTool(false, 0, 0);
                this.applyHideToToolbar(false, 1, 1);
            }
        }
    }

    private shapePropertiesTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true, 2, 2);
            } else {
                this.showColorEditTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true, 3, 3);
            } else {
                this.showStrokeColorEditTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true, 4, 4);
            } else {
                this.showThicknessEditTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 5, 5);
            } else {
                this.showOpacityEditTool(false, 5, 5);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 6, 6);
            } else {
                this.showCommentPanelTool(false, 6, 6);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 7, 7);
            } else {
                this.showAnnotationDeleteTool(false, 7, 7);
            }
            if (annotationToolbarItems.indexOf('ShapeTool') !== -1) {
                this.showShapeAnnotationTool(true, 0, 0);
            }
            else {
                this.showShapeAnnotationTool(false, 0, 0);
                this.applyHideToToolbar(false, 1, 1);
            }
        }
    }

    private showStampPropertiesTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 2, 2);
            } else {
                this.showOpacityEditTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 3, 3);
            } else {
                this.showCommentPanelTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 4, 4);
            } else {
                this.showAnnotationDeleteTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('StampAnnotationTool') !== -1) {
                this.showStampAnnotationTool(true, 0, 0);
            }
            else {
                this.showStampAnnotationTool(false, 0, 0);
                this.applyHideToToolbar(false, 1, 1);
            }
        }
    }

    private showTextMarkupPropertiesTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true, 2, 2);
            } else {
                this.showColorEditTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 3, 3);
            } else {
                this.showOpacityEditTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 4, 4);
            } else {
                this.showCommentPanelTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 5, 5);
            } else {
                this.showAnnotationDeleteTool(false, 5, 5);
            }
            if (annotationToolbarItems.includes('HighlightTool') || annotationToolbarItems.includes('UnderlineTool') || annotationToolbarItems.includes('StrikethroughTool')) {
                this.applyHideToToolbar(true, 0, 0);
            }
            else {
                this.applyHideToToolbar(false, 0, 0);
                this.applyHideToToolbar(false, 1, 1);
            }
        }
    }

    private showInkPropertiesTool(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true, 2, 2);
            } else {
                this.showStrokeColorEditTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true, 3, 3);
            } else {
                this.showThicknessEditTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 4, 4);
            } else {
                this.showOpacityEditTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 5, 5);
            } else {
                this.showCommentPanelTool(false, 5, 5);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 6, 6);
            } else {
                this.showAnnotationDeleteTool(false, 6, 6);
            }
            if (annotationToolbarItems.indexOf('HandWrittenSignatureTool') !== -1) {
                this.showSignatureTool(true, 0, 0);
            }
            else {
                this.showSignatureTool(false, 0, 0);
                this.applyHideToToolbar(false, 1, 1);
            }
        }
    }

    /**
     * @param {string} id - It describes about the id value
     * @private
     * @returns {any} - any
     */
    public createAnnotationToolbarForMobile(id?: string): any[] {
        let hideToolbar: boolean;
        if (id) {
            const editIcon: HTMLElement = document.getElementById(id);
            if (editIcon.parentElement.classList.contains('e-pv-select')) {
                hideToolbar = true;
                editIcon.parentElement.classList.remove('e-pv-select');
            } else {
                hideToolbar = false;
                this.pdfViewer.toolbarModule.selectItem(editIcon.parentElement);
            }
        }
        if (hideToolbar) {
            this.toolbarCreated = false;
            this.adjustMobileViewer();
            if (this.toolbar) {
                this.toolbar.destroy();
                this.deselectAllItemsForMobile();
            }
            if (this.propertyToolbar) {
                this.propertyToolbar.destroy();
            }
            const mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_mobileAnnotationToolbar');
            if (mobileAnnotationToolbar) {
                mobileAnnotationToolbar.style.display = 'none';
            }
            this.pdfViewer.isAnnotationToolbarVisible = !hideToolbar;
            return [];
        } else {
            this.isToolbarCreated = true;
            if (this.propertyToolbar) {
                this.propertyToolbar.destroy();
            }
            if (this.toolbarElement) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
            this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_mobileAnnotationToolbar', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left;' });
            //this.toolbarElement.append(this.pdfViewerBase.viewerContainer);
            this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
            const stampTemplate: string = this.getTemplate('span', '_annotation_stamp', 'e-pv-annotation-stamp-container');
            const signTemplate: string = this.getTemplate('span', '_annotation_signature', 'e-pv-annotation-handwritten-container');
            const items: any[] = [
                { prefixIcon: 'e-pv-comment-icon e-pv-icon', className: 'e-pv-comment-container', id: this.pdfViewer.element.id + '_comment' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-highlight-icon e-pv-icon', className: 'e-pv-highlight-container', id: this.pdfViewer.element.id + '_highlight' },
                { prefixIcon: 'e-pv-underline-icon e-pv-icon', className: 'e-pv-underline-container', id: this.pdfViewer.element.id + '_underline' },
                { prefixIcon: 'e-pv-strikethrough-icon e-pv-icon', className: 'e-pv-strikethrough-container', id: this.pdfViewer.element.id + '_strikethrough' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-annotation-shape-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_annotation_shapes' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-annotation-calibrate-icon e-pv-icon', className: 'e-pv-annotation-calibrate-container', id: this.pdfViewer.element.id + '_annotation_calibrate' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-freetext-icon e-pv-icon', className: 'e-pv-annotation-freetextedit-container', id: this.pdfViewer.element.id + '_annotation_freeTextEdit' },
                { type: 'Separator', align: 'Left' },
                { template: stampTemplate },
                { type: 'Separator', align: 'Left' },
                { template: signTemplate, align: 'Left' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-inkannotation-icon e-pv-icon', className: 'e-pv-annotation-ink-container', id: this.pdfViewer.element.id + '_annotation_ink', align: 'Left' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_annotation_commentPanel', align: 'Right' }
            ];
            if (this.toolbarCreated && this.toolbar) {
                this.toolbar.destroy();
                this.toolbarCreated = false;
                this.adjustMobileViewer();
            } else {
                this.toolbar = new Tool({ items: items, width: '', height: '', overflowMode: 'Scrollable', clicked: this.onToolbarClicked.bind(this) });
                if (this.pdfViewer.enableRtl) {
                    this.toolbar.enableRtl = true;
                }
                this.toolbar.isStringTemplate = true;
                this.toolbar.appendTo(this.toolbarElement);
                this.afterMobileToolbarCreation();
                this.createStampContainer();
                this.createSignContainer();
                this.applyMobileAnnotationToolbarSettings();
                this.toolbarCreated = true;
                this.adjustMobileViewer();
            }
            if (!this.pdfViewerBase.isTextSelectionDisabled) {
                if (this.isMobileHighlightEnabled) {
                    this.primaryToolbar.selectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
                else if (this.isMobileUnderlineEnabled) {
                    this.primaryToolbar.selectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
                else if (this.isMobileStrikethroughEnabled) {
                    this.primaryToolbar.selectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
            }
            this.pdfViewer.isAnnotationToolbarVisible = !hideToolbar;
            return items;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public adjustMobileViewer(): void {
        let toolbarHeight: number;
        if (this.toolbarElement) {
            toolbarHeight = this.toolbarElement.clientHeight;
        }
        let isPrimaryTool: boolean = false;
        if (this.toolbarElement && this.toolbarElement.children.length === 0 && this.propertyToolbar &&
            this.propertyToolbar.element.children.length > 0) {
            toolbarHeight = this.propertyToolbar.element.clientHeight;
            if (this.pdfViewer.toolbarModule.toolbarElement.style.display === 'none' && !(this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.isNavigationToolbarVisible)) {
                this.pdfViewer.toolbarModule.toolbarElement.style.display = 'block';
            }
        } else if (this.freetextToolbarElement && this.freetextToolbarElement.children.length > 0) {
            toolbarHeight = this.freetextToolbarElement.clientHeight;
        } else if (toolbarHeight === 0 && this.pdfViewer.toolbarModule.toolbar) {
            toolbarHeight = this.pdfViewer.toolbarModule.toolbarElement.clientHeight;
            isPrimaryTool = true;
        } else if (!toolbarHeight && this.propertyToolbar && this.propertyToolbar.element.children.length > 0) {
            toolbarHeight = this.propertyToolbar.element.clientHeight;
        }
        if (this.pdfViewer.enableToolbar && this.toolbarCreated) {
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (toolbarHeight + toolbarHeight)) + 'px';
        } else {
            if (!isPrimaryTool) {
                if (this.pdfViewerBase.viewerContainer.style.height.split('%').length > 1) {
                    this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (-toolbarHeight)) + 'px';
                } else {
                    this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (toolbarHeight)) + 'px';
                }
            }
        }
    }

    /**
     * Shows /hides the toolbar in the PdfViewer
     *
     * @param {boolean} enable - If set true , its show the Toolbar
     * @returns {void}
     */
    public showToolbar(enable: boolean): void {
        const toolbar: HTMLElement = this.toolbarElement;
        if (enable) {
            toolbar.style.display = 'block';
            if (Browser.isDevice && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
            }
        } else {
            toolbar.style.display = 'none';
        }
    }

    private createMobileToolbarItems(isPath: boolean): any[] {
        const colorTemplate: string = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        if (!isPath) {
            items.push({ template: colorTemplate, align: 'right' });
            items.push({ template: opacityTemplate, align: 'right' });
            items.push({ type: 'Separator', align: 'right' });
        }
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'right' });
        return items;
    }

    private goBackToToolbar(args: ClickEventArgs): void {
        this.isMobileAnnotEnabled = false;
        if (Browser.isDevice || !this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewerBase.action === 'Polygon') {
                (this.pdfViewerBase.tool as PolygonDrawingTool).mouseUp((args as MouseEventArgs), true, true);
            }
        }
        if (this.toolbarElement.children.length > 0) {
            this.toolbarElement.style.display = 'block';
        } else {
            this.toolbarCreated = false;
            this.toolbar.destroy();
            this.createAnnotationToolbarForMobile();
        }
        const page: number = this.pdfViewerBase.getSelectTextMarkupCurrentPage();
        if (page) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(page);
        }
    }

    private createToolbarItems(): any[] {
        const colorTemplate: string = this.getTemplate('button', '_annotation_color', 'e-pv-annotation-color-container');
        const strokeTemplate: string = this.getTemplate('button', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('button', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const opacityTemplate: string = this.getTemplate('button', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const shapesTemplate: string = this.getTemplate('button', '_annotation_shapes', 'e-pv-annotation-shapes-container');
        const calibrateTemplate: string = this.getTemplate('button', '_annotation_calibrate', 'e-pv-annotation-calibrate-container');
        const stampTemplate: string = this.getTemplate('span', '_annotation_stamp', 'e-pv-annotation-stamp-container');
        const fontFamilyTemplate: string = this.getTemplate('button', '_annotation_fontname', 'e-pv-annotation-fontname-container');
        const fontSizeTemplate: string = this.getTemplate('button', '_annotation_fontsize', 'e-pv-annotation-fontsize-container');
        const textColorTemplate: string = this.getTemplate('button', '_annotation_textcolor', 'e-pv-annotation-textcolor-container');
        const alignmentTemplate: string = this.getTemplate('button', '_annotation_textalign', 'e-pv-annotation-textalign-container');
        const textPropertiesTemplate: string = this.getTemplate('button', '_annotation_textproperties', 'e-pv-annotation-textprop-container');
        const signTemplate: string = this.getTemplate('button', '_annotation_signature', 'e-pv-annotation-handwritten-container');
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-highlight-icon e-pv-icon', className: 'e-pv-highlight-container', id: this.pdfViewer.element.id + '_highlight', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-underline-icon e-pv-icon', className: 'e-pv-underline-container', id: this.pdfViewer.element.id + '_underline', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-strikethrough-icon e-pv-icon', className: 'e-pv-strikethrough-container', id: this.pdfViewer.element.id + '_strikethrough', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-hightlight-separator-container' });
        items.push({ template: shapesTemplate, align: 'Left', cssClass: 'e-pv-shape-template-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-shape-separator-container' });
        items.push({ template: calibrateTemplate, align: 'Left', cssClass: 'e-pv-calibrate-template-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-calibrate-separator-container' });
        items.push({ prefixIcon: 'e-pv-freetext-icon e-pv-icon', className: 'e-pv-annotation-freetextedit-container', id: this.pdfViewer.element.id + '_annotation_freeTextEdit', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-freetext-separator-container' });
        items.push({ template: stampTemplate, align: 'Left', cssClass: 'e-pv-stamp-template-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-stamp-separator-container' });
        items.push({ template: signTemplate, align: 'Left', cssClass: 'e-pv-sign-template-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-sign-separator-container' });
        items.push({ prefixIcon: 'e-pv-inkannotation-icon e-pv-icon', className: 'e-pv-annotation-ink-container', id: this.pdfViewer.element.id + '_annotation_ink', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-ink-separator-container' });
        items.push({ template: fontFamilyTemplate, align: 'Left', cssClass: 'e-pv-fontfamily-container' });
        items.push({ template: fontSizeTemplate, align: 'Left', cssClass: 'e-pv-fontsize-container' });
        items.push({ template: textColorTemplate, align: 'Left', cssClass: 'e-pv-text-color-container' });
        items.push({ template: alignmentTemplate, align: 'Left', cssClass: 'e-pv-alignment-container' });
        items.push({ template: textPropertiesTemplate, align: 'Left', cssClass: 'e-pv-text-properties-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-text-separator-container' });
        items.push({ template: colorTemplate, align: 'Left', cssClass: 'e-pv-color-template-container' });
        items.push({ template: strokeTemplate, align: 'Left', cssClass: 'e-pv-stroke-template-container' });
        items.push({ template: thicknessTemplate, align: 'Left', cssClass: 'e-pv-thickness-template-container' });
        items.push({ template: opacityTemplate, align: 'Left', cssClass: 'e-pv-opacity-template-container' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-opacity-separator-container' });
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_annotation_commentPanel', align: 'Right' });
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_annotation_close', align: 'Right' });
        return items;
    }

    private createSignContainer(): void {
        this.handWrittenSignatureItem = this.pdfViewerBase.getElement('_annotation_signature');
        this.primaryToolbar.createTooltip(this.pdfViewerBase.getElement('_annotation_signature'), this.pdfViewer.localeObj.getConstant('SignatureFieldDialogHeaderText'));
        this.handWrittenSignatureItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('SignatureFieldDialogHeaderText'));
        // eslint-disable-next-line
        const proxy: any = this;
        let items: ItemModel[] = [];
        if (this.pdfViewer.handWrittenSignatureSettings ||
            this.pdfViewer.handWrittenSignatureSettings.signatureItem.length === 0 ||
            this.pdfViewer.handWrittenSignatureSettings.signatureItem.length === 2) {
            items = [
                {
                    text: 'ADD SIGNATURE'
                },
                {
                    separator: true
                },
                {
                    text: 'ADD INITIAL'
                }];
        } else {
            if (this.pdfViewer.handWrittenSignatureSettings.signatureItem[0] === 'Signature') {
                items = [
                    {
                        text: 'ADD SIGNATURE'
                    }];
            } else {
                items = [
                    {
                        text: 'ADD INITIAL'
                    }];
            }
        }

        const saveOptions: DropDownButtonModel = {
            items: items,
            iconCss: 'e-pv-handwritten-icon e-pv-icon',
            cssClass: 'e-pv-handwritten-popup',
            open: (args: OpenCloseMenuEventArgs): void => {
                proxy.openSignature();
            },
            beforeItemRender: (args: MenuEventArgs): void => {
                this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
                this.pdfViewer.annotation.triggerSignatureUnselectEvent();
                this.pdfViewer.clearSelection(this.pdfViewerBase.currentPageNumber - 1);
                if (args.element && args.element.className.indexOf('e-separator') !== -1) {
                    args.element.style.margin = '8px 0';
                    args.element.setAttribute('role', 'menuitem');
                    args.element.setAttribute('aria-label', 'separator');
                }
                if (args.item.text === 'ADD SIGNATURE') {
                    args.element.innerHTML = '';
                    this.saveSignatureCount = 0;
                    for (let collection: number = this.pdfViewerBase.signatureModule.signaturecollection.length;
                        collection > 0; collection--) {
                        if (this.saveSignatureCount < this.pdfViewerBase.signatureModule.
                            getSaveLimit(this.pdfViewer.handWrittenSignatureSettings.saveSignatureLimit)) {
                            args.element.style.display = 'block';
                            const signatureCollection: any = this.pdfViewerBase.signatureModule.signaturecollection[collection - 1];
                            const collectionKey: any = signatureCollection.image[0].imageData;
                            const signatureID: string = signatureCollection.image[0].id.split('_')[1];
                            if (!signatureCollection.isInitial && collectionKey !== '') {
                                const signatureContainer: HTMLElement = createElement('div');
                                signatureContainer.id = 's' + signatureID;
                                signatureContainer.style.display = 'block';
                                signatureContainer.style.paddingBottom = '10px';
                                const signatureSpan: HTMLElement = createElement('span');
                                signatureSpan.id = 'sign_border_' + signatureID;
                                signatureSpan.classList.add('e-pv-align-border');
                                let signatureImage: any;
                                if (signatureCollection.image[0].signatureType === 'SignatureText') {
                                    signatureImage = createElement('div');
                                    signatureImage.classList.add('e-pv-align-border-div');
                                    (signatureImage as HTMLElement).innerText = collectionKey;
                                    (signatureImage as HTMLElement).style.fontFamily = signatureCollection.image[0].fontFamily;
                                    (signatureImage as HTMLElement).style.fontSize = '15px';
                                    (signatureImage as HTMLElement).style.display = 'inline-flex';
                                    (signatureImage as HTMLElement).style.alignItems = 'center';
                                    (signatureImage as HTMLElement).style.position = 'relative';
                                    (signatureImage as HTMLElement).id = 'sign_' + signatureID;
                                    (signatureImage as HTMLElement).style.width = '80px';
                                    (signatureImage as HTMLElement).style.height = '53px';
                                    (signatureImage as HTMLElement).style.overflow = 'hidden';
                                    (signatureImage as HTMLElement).style.textOverflow = 'ellipsis';
                                    (signatureImage as HTMLElement).style.paddingLeft = '11px';
                                } else {
                                    signatureImage = createElement('img') as HTMLImageElement;
                                    signatureImage.id = 'sign_' + signatureID;
                                    signatureImage.src = collectionKey;
                                    signatureImage.width = 80;
                                    signatureImage.height = 32;
                                    signatureImage.classList.add('e-pv-signatureimage');
                                    (signatureImage as HTMLImageElement).style.paddingLeft = '20px';
                                    (signatureImage as HTMLImageElement).style.paddingRight = '18px';
                                    (signatureImage as HTMLImageElement).style.paddingTop = '12px';
                                    (signatureImage as HTMLImageElement).style.paddingBottom = '12px';
                                    (signatureImage as HTMLImageElement).style.boxSizing = 'content-box';
                                    signatureImage.setAttribute('alt', 'Saved Signature');
                                }
                                signatureImage.addEventListener('mouseover', this.hoverSignatureImage.bind(this));
                                signatureImage.addEventListener('mouseleave', this.leaveSignatureImage.bind(this));
                                const signatureDeleteSpan: HTMLElement = createElement('span');
                                signatureDeleteSpan.id = 'delete_' + signatureID;
                                signatureDeleteSpan.classList.add('e-pv-delete');
                                signatureDeleteSpan.classList.add('e-pv-align');
                                signatureSpan.append(signatureImage);
                                signatureSpan.append(signatureDeleteSpan);
                                signatureContainer.append(signatureSpan);
                                args.element.appendChild(signatureContainer);
                                args.element.style.pointerEvents = 'auto';
                                args.element.style.background = 'none';
                                this.pdfViewerBase.getElement('_annotation_signature-popup').style.width = '206px';
                                this.saveSignatureCount++;
                            }
                        }
                    }
                    const addInitialSpan: HTMLElement = createElement('button');
                    addInitialSpan.classList.add('e-control', 'e-btn', 'e-lib', 'e-outline', 'e-primary');
                    addInitialSpan.textContent = this.pdfViewer.localeObj.getConstant('HandwrittenSignatureDialogHeaderText');
                    if (this.pdfViewer.locale === 'en-US') {
                        addInitialSpan.style.minWidth = '130px';
                        addInitialSpan.style.width = 'auto';
                    } else {
                        addInitialSpan.style.width = 'auto';
                    }
                    addInitialSpan.style.height = '36px';
                    addInitialSpan.addEventListener('click', this.clickSignature.bind(this));
                    args.element.appendChild(addInitialSpan);
                    args.element.addEventListener('mouseover', this.hoverInitialBtn.bind(this));
                    args.element.style.minWidth = '206px';
                    args.element.style.width = 'auto';
                    args.element.style.display = 'flex';
                    args.element.style.flexDirection = 'column';
                    args.element.style.height = 'auto';
                    args.element.style.alignItems = 'center';
                    args.element.setAttribute('role', 'menuitem');
                }
                if (args.item.text === 'ADD INITIAL') {
                    this.saveInitialCount = 0;
                    args.element.innerHTML = '';
                    for (let collection: number = this.pdfViewerBase.signatureModule.signaturecollection.length;
                        collection > 0; collection--) {
                        if (this.saveInitialCount < this.pdfViewerBase.signatureModule.
                            getSaveLimit(this.pdfViewer.handWrittenSignatureSettings.saveInitialLimit)) {
                            const signatureCollection: any = this.pdfViewerBase.signatureModule.signaturecollection[collection - 1];
                            const collectionKey: any = signatureCollection.image[0].imageData;
                            const signatureID: string = signatureCollection.image[0].id.split('_')[1];
                            if (signatureCollection.isInitial && collectionKey !== '') {
                                const signatureContainer: HTMLElement = createElement('div');
                                signatureContainer.id = 's' + signatureID;
                                signatureContainer.style.display = 'block';
                                signatureContainer.style.paddingBottom = '10px';
                                const signatureSpan: HTMLElement = createElement('span');
                                signatureSpan.id = 'sign_border_' + signatureID;
                                signatureSpan.classList.add('e-pv-align-border');
                                let signatureImage: any;
                                if (signatureCollection.image[0].signatureType === 'SignatureText') {
                                    signatureImage = createElement('div');
                                    signatureImage.classList.add('e-pv-align-border-div');
                                    (signatureImage as HTMLElement).innerText = collectionKey;
                                    (signatureImage as HTMLElement).style.fontFamily = signatureCollection.image[0].fontFamily;
                                    (signatureImage as HTMLElement).style.fontSize = '15px';
                                    (signatureImage as HTMLElement).style.display = 'inline-flex';
                                    (signatureImage as HTMLElement).style.alignItems = 'center';
                                    (signatureImage as HTMLElement).style.position = 'relative';
                                    (signatureImage as HTMLElement).id = 'sign_' + signatureID;
                                    (signatureImage as HTMLElement).style.width = '80px';
                                    (signatureImage as HTMLElement).style.height = '53px';
                                    (signatureImage as HTMLElement).style.overflow = 'hidden';
                                    (signatureImage as HTMLElement).style.textOverflow = 'ellipsis';
                                    (signatureImage as HTMLElement).style.paddingLeft = '11px';
                                } else {
                                    signatureImage = createElement('img') as HTMLImageElement;
                                    signatureImage.id = 'sign_' + signatureID;
                                    signatureImage.src = collectionKey;
                                    signatureImage.width = 80;
                                    signatureImage.height = 32;
                                    signatureImage.classList.add('e-pv-signatureimage');
                                    (signatureImage as HTMLImageElement).style.paddingLeft = '20px';
                                    (signatureImage as HTMLImageElement).style.paddingRight = '18px';
                                    (signatureImage as HTMLImageElement).style.paddingTop = '12px';
                                    (signatureImage as HTMLImageElement).style.paddingBottom = '12px';
                                    (signatureImage as HTMLImageElement).style.boxSizing = 'content-box';
                                    signatureImage.setAttribute('alt', 'Saved Initial');
                                }
                                signatureImage.addEventListener('mouseover', this.hoverSignatureImage.bind(this));
                                signatureImage.addEventListener('mouseleave', this.leaveSignatureImage.bind(this));
                                signatureImage.width = 80;
                                signatureImage.height = 32;
                                const signatureDeleteSpan: HTMLElement = createElement('span');
                                signatureDeleteSpan.id = 'delete_' + signatureID;
                                signatureDeleteSpan.classList.add('e-pv-delete');
                                signatureDeleteSpan.classList.add('e-pv-align');
                                signatureSpan.append(signatureImage);
                                signatureSpan.append(signatureDeleteSpan);
                                signatureContainer.append(signatureSpan);
                                args.element.appendChild(signatureContainer);
                                args.element.style.pointerEvents = 'auto';
                                args.element.style.background = 'none';
                                this.pdfViewerBase.getElement('_annotation_signature-popup').style.width = '206px';
                                this.saveInitialCount++;
                            }
                        }
                    }
                    this.isSignatureIteam = false;
                    const addInitialSpan: HTMLElement = createElement('button');
                    addInitialSpan.classList.add('e-control', 'e-btn', 'e-lib', 'e-outline', 'e-primary');
                    addInitialSpan.textContent = this.pdfViewer.localeObj.getConstant('HandwrittenInitialDialogHeaderText');
                    if (this.pdfViewer.locale === 'en-US') {
                        addInitialSpan.style.minWidth = '130px';
                        addInitialSpan.style.width = 'auto';
                    } else {
                        addInitialSpan.style.width = 'auto';
                    }
                    addInitialSpan.style.height = '36px';
                    addInitialSpan.addEventListener('click', this.clickInitial.bind(this));
                    args.element.appendChild(addInitialSpan);
                    args.element.addEventListener('mouseover', this.hoverInitialBtn.bind(this));
                    args.element.style.minWidth = '206px';
                    args.element.style.width = 'auto';
                    args.element.style.display = 'flex';
                    args.element.style.flexDirection = 'column';
                    args.element.style.height = 'auto';
                    args.element.style.alignItems = 'center';
                    args.element.setAttribute('role', 'menuitem');
                }
            },
            select: (args: MenuEventArgs): void => {
                this.pdfViewer.clearSelection(this.pdfViewerBase.currentPageNumber - 1);

            }
        };
        const drpDownBtn: DropDownButton = new DropDownButton(saveOptions);
        if (this.pdfViewer.enableRtl) {
            drpDownBtn.enableRtl = this.pdfViewer.enableRtl;
        }
        drpDownBtn.appendTo(this.handWrittenSignatureItem);
    }

    private updateSignatureCount(): void {
        let count: number = 0;
        this.openSignaturePopup = false;
        const signatureCollection: any = this.pdfViewerBase.signatureModule.signaturecollection;
        for (let collection: number = 0; collection < signatureCollection.length; collection++) {
            const colletionList: any = signatureCollection[parseInt(collection.toString(), 10)];
            if (colletionList.image[0].imageData === '') {
                count++;
            }
        }
    }

    private openSignature(): void {
        this.saveInitialCount = 0;
        this.saveSignatureCount = 0;
        for (let collection: number = this.pdfViewerBase.signatureModule.signaturecollection.length; collection > 0; collection--) {
            if (this.saveSignatureCount < this.pdfViewerBase.signatureModule.
                getSaveLimit(this.pdfViewer.handWrittenSignatureSettings.saveSignatureLimit)) {
                const signatureCollection: any = this.pdfViewerBase.signatureModule.signaturecollection[collection - 1];
                if (signatureCollection.image[0].imageData !== '') {
                    if (!signatureCollection.isInitial) {
                        this.saveSignatureCount++;
                        const addedSignature: HTMLElement = document.getElementById('sign_border_' + signatureCollection.image[0].id.split('_')[1] + '');
                        const deleteSignature: HTMLElement = document.getElementById('delete_' + signatureCollection.image[0].id.split('_')[1] + '');
                        deleteSignature.style.backgroundClip = 'content-box';
                        addedSignature.addEventListener('click', this.renderAddedSignature.bind(this));
                        deleteSignature.addEventListener('click', this.deleteSavedSign.bind(this));
                        deleteSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                        deleteSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
                        addedSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                        addedSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
                    }
                }
            }
        }
        for (let collection: number = this.pdfViewerBase.signatureModule.signaturecollection.length; collection > 0; collection--) {
            if (this.saveInitialCount < this.pdfViewerBase.signatureModule.
                getSaveLimit(this.pdfViewer.handWrittenSignatureSettings.saveInitialLimit)) {
                const signatureCollection: any = this.pdfViewerBase.signatureModule.signaturecollection[collection - 1];
                if (signatureCollection.image[0].imageData !== '') {
                    if (signatureCollection.isInitial) {
                        this.saveInitialCount++;
                        const addedSignature: HTMLElement = document.getElementById('sign_border_' + signatureCollection.image[0].id.split('_')[1] + '');
                        const deleteSignature: HTMLElement = document.getElementById('delete_' + signatureCollection.image[0].id.split('_')[1] + '');
                        deleteSignature.style.backgroundClip = 'content-box';
                        addedSignature.addEventListener('click', this.renderAddedSignature.bind(this));
                        deleteSignature.addEventListener('click', this.deleteSavedSign.bind(this));
                        deleteSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                        deleteSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
                        addedSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                        addedSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
                    }
                }
            }
        }
    }

    private hoverSignatureDelete(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.id === 'sign_' + eventTarget.id.split('_')[1] || eventTarget.classList.contains('e-pv-delete')) {
            eventTarget.classList.add('e-pv-signaturehover');
            eventTarget.style.cursor = 'pointer';
        }
    }

    private hoverInitialBtn(event: any): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        let currentFieldID: string = '';
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            currentFieldID = eventTarget.id;
        } else {
            currentFieldID = isNullOrUndefined(event.path) ? event.composedPath()[0].id : event.path[0].id;
        }
        if (currentFieldID !== 'sign_' + currentFieldID.split('_')[1] && currentFieldID !== 'delete_' + currentFieldID.split('_')[1]) {
            let liElement: HTMLElement = document.getElementById(eventTarget.id);
            if (isNullOrUndefined(liElement)) {
                liElement = document.getElementById(eventTarget.parentElement.id);
            }
            if ((liElement as HTMLLIElement) != null && (eventTarget.id !== 'sign_' + eventTarget.id.split('_')[1] || eventTarget.id !== 'sign_border_' + eventTarget.id.split('_')[2])) {
                liElement.style.background = 'transparent';
                liElement.style.cursor = 'default';
            } else if ((liElement.parentElement as HTMLLIElement) != null && (eventTarget.id !== 'sign_' + eventTarget.id.split('_')[1] || eventTarget.id !== 'sign_border_' + eventTarget.id.split('_')[2])) {
                liElement.parentElement.style.background = 'transparent';
                liElement.parentElement.style.cursor = 'default';
            }
        }
    }

    private hoverSignatureImage(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.id === 'sign_' + eventTarget.id.split('_')[1] || eventTarget.classList.contains('e-pv-delete')) {
            eventTarget.classList.add('e-pv-signaturehover');
            eventTarget.classList.remove('e-pv-signatureimage');
            eventTarget.style.cursor = 'pointer';
        }
    }

    private leaveSignatureDelete(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.id === 'sign_' + eventTarget.id.split('_')[1] || eventTarget.classList.contains('e-pv-delete')) {
            eventTarget.classList.remove('e-pv-signaturehover');
            if (eventTarget.children[0] && eventTarget.children[0].tagName === 'IMG') {
                eventTarget.children[0].classList.remove('e-pv-signaturehover');
            }
            eventTarget.style.cursor = 'default';
        }
    }

    private clickSignature(): void {
        this.pdfViewerBase.isInitialField = false;
        this.addSignature();
    }

    private clickInitial(): void {
        this.pdfViewerBase.isInitialField = true;
        this.addSignature();
    }

    private leaveSignatureImage(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.id === 'sign_' + eventTarget.id.split('_')[1] || eventTarget.classList.contains('e-pv-delete')) {
            eventTarget.classList.remove('e-pv-signaturehover');
            if (eventTarget.tagName === 'IMG') { eventTarget.classList.add('e-pv-signatureimage'); }
            if (eventTarget.children[0] && eventTarget.children[0].tagName === 'IMG') {
                eventTarget.children[0].classList.remove('e-pv-signaturehover');
                eventTarget.children[0].classList.add('e-pv-signatureimage');
            }
            eventTarget.style.cursor = 'default';
        }
    }

    private addSignature(): void {
        this.deselectAllItems();
        this.deselectAllItemsForMobile();
        this.showSignaturepanel();
    }

    public renderAddedSignature(): void {
        this.pdfViewerBase.isAddedSignClicked = true;
        this.isSavedSignatureClicked = true;
        this.pdfViewerBase.signatureModule.RenderSavedSignature();
    }

    public deleteSavedSign(event: any): void {
        event.stopPropagation();
        const signaturecollection: any = this.pdfViewerBase.signatureModule.signaturecollection;
        for (let collection: number = signaturecollection.length; collection > 0; collection--) {
            if (event.target.parentElement.children[0].id === 'sign_' + signaturecollection[collection - 1].image[0].id.split('_')[1]) {
                const RemoveSignature: any = signaturecollection[collection - 1];
                RemoveSignature.image[0].imageData = '';
                this.pdfViewerBase.signatureModule.signaturecollection.splice(collection - 1, 1);
                break;
            }
        }
        event.target.parentElement.remove();
    }

    private getTemplate(elementName: string, id: string, className: string): string {
        const element: HTMLElement = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    }

    private createStampContainer(): HTMLElement {
        this.stampElement = this.pdfViewerBase.getElement('_annotation_stamp');
        this.primaryToolbar.createTooltip(this.pdfViewerBase.getElement('_annotation_stamp'), this.pdfViewer.localeObj.getConstant('Add Stamp'));
        this.stampElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Add Stamp'));
        this.stampElement.setAttribute('role', 'combobox');
        this.stampElement.setAttribute('aria-expanded', 'false');
        const contextMenuElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + 'contextMenuElement' });
        this.pdfViewerBase.getElement('_annotation_stamp').appendChild(contextMenuElement);
        const items: Object[] = [];
        if (this.pdfViewer.stampSettings.dynamicStamps && this.pdfViewer.stampSettings.dynamicStamps.length > 0) {
            const dynamicStamps: Object[] = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Dynamic'), label: 'Dynamic', items: dynamicStamps });
            this.pdfViewer.stampSettings.dynamicStamps.forEach((stampItem: DynamicStampItem, index: number) => {
                // eslint-disable-next-line
                let name: string = DynamicStampItem[stampItem];
                switch (name) {
                case 'NotApproved':
                    name = 'Not Approved';
                    break;
                }
                dynamicStamps.push({ text: this.pdfViewer.localeObj.getConstant(name), label: name });
            });
        }
        if (this.pdfViewer.stampSettings.signStamps && this.pdfViewer.stampSettings.signStamps.length > 0) {
            const signStamps: Object[] = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Sign Here'), label: 'Sign Here', items: signStamps });
            this.pdfViewer.stampSettings.signStamps.forEach((stampItem: SignStampItem, index: number) => {
                // eslint-disable-next-line
                let name: string = SignStampItem[stampItem];
                switch (name) {
                case 'InitialHere':
                    name = 'Initial Here';
                    break;
                case 'SignHere':
                    name = 'Sign Here';
                    break;
                }
                signStamps.push({ text: this.pdfViewer.localeObj.getConstant(name), label: name });
            });
        }
        if (this.pdfViewer.stampSettings.standardBusinessStamps && this.pdfViewer.stampSettings.standardBusinessStamps.length > 0) {
            const standardsBusinessStamps: Object[] = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Standard Business'), label: 'Standard Business', items: standardsBusinessStamps });
            this.pdfViewer.stampSettings.standardBusinessStamps.forEach((stampItem: StandardBusinessStampItem, index: number) => {
                // eslint-disable-next-line
                let name: string = StandardBusinessStampItem[stampItem];
                switch (name) {
                case 'NotApproved':
                    name = 'Not Approved';
                    break;
                case 'ForPublicRelease':
                    name = 'For Public Release';
                    break;
                case 'NotForPublicRelease':
                    name = 'Not For Public Release';
                    break;
                case 'ForComment':
                    name = 'For Comment';
                    break;
                case 'PreliminaryResults':
                    name = 'Preliminary Results';
                    break;
                case 'InformationOnly':
                    name = 'Information Only';
                    break;
                }
                standardsBusinessStamps.push({ text: this.pdfViewer.localeObj.getConstant(name), label: name });
            });
        }
        if (this.pdfViewer.customStampSettings.enableCustomStamp) {
            if (items.length > 0) {
                items.push({ separator: true });
            }
            items.push({ text: this.pdfViewer.localeObj.getConstant('Custom Stamp'), label: 'Custom Stamp', items: [] });
            this.pdfViewerBase.customStampCollection = this.pdfViewer.customStampSettings.customStamps as any ?
                this.pdfViewer.customStampSettings.customStamps as any : [];
        }
        this.stampMenu = [
            {
                iconCss: 'e-pv-stamp-icon e-pv-icon',
                items: items
            }
        ];
        const menuOptions: MenuModel = {
            items: this.stampMenu,
            cssClass: 'e-custom-scroll',
            showItemOnClick: true,
            enableScrolling: true,
            beforeOpen: (args: Menuopen): void => {
                this.resetFreeTextAnnot();
                if (args.parentItem.text === '' && this.pdfViewer.customStampSettings.isAddToMenu && args.items.length > 0) {
                    let currentElements: any = null;
                    for (let i: number = 0; i < args.items.length; i++) {
                        if (args.items[parseInt(i.toString(), 10)].text === this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                            args.items[parseInt(i.toString(), 10)].items = [];
                            currentElements = args.items[parseInt(i.toString(), 10)];
                            break;
                        }
                    }
                    const elements: any = this.pdfViewerBase.customStampCollection;
                    const stampElements: any = this.pdfViewer.customStampSettings.customStamps;
                    if (elements.length === 0 && stampElements && stampElements.length > 0) {
                        for (let n: number = 0; n < stampElements.length; n++) {
                            elements.push({ customStampName: stampElements[parseInt(n.toString(), 10)].customStampName,
                                customStampImageSource: stampElements[parseInt(n.toString(), 10)].customStampImageSource });
                        }
                    }
                    for (let m: number = 0; m < elements.length; m++) {
                        if (currentElements != null) {
                            currentElements.items.push({ text: elements[parseInt(m.toString(), 10)].customStampName });
                            for (let i: number = 0; i < args.items.length; i++) {
                                if (args.items[parseInt(i.toString(), 10)].text === this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                                    const liElem: HTMLElement = args.element.children[parseInt(i.toString(), 10)] as HTMLElement;
                                    if (liElem && !liElem.childElementCount) {
                                        const span: Element = document.createElement('span');
                                        span.className = 'e-icons e-caret e-menu-caret-icon';
                                        liElem.appendChild(span);
                                        liElem.setAttribute('aria-haspopup', 'true');
                                        liElem.setAttribute('aria-expanded', 'false');
                                    }
                                }
                            }
                        }
                    }
                }
                if (args.parentItem.text === this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                    const stampElements: any = this.pdfViewer.customStampSettings.customStamps;
                    if (stampElements && stampElements.length > 10) {
                        (closest(args.element, '.e-menu-wrapper') as HTMLElement).style.height = '350px';
                    }
                }
                this.stampParentID = args.parentItem.text;
                this.menuItems.showItemOnClick = false;
            },
            beforeClose: (args: Menuopen) => {
                if ((args.parentItem && args.parentItem.text !== this.pdfViewer.localeObj.getConstant('Custom Stamp') && args.parentItem.text !== 'Standard Business' && args.parentItem.text !== 'Dynamic' && args.parentItem.text !== 'Sign Here') || !args.parentItem) {
                    this.menuItems.showItemOnClick = true;
                }
            },
            select: (args: MenuEventArgs): void => {
                this.pdfViewerBase.isAlreadyAdded = false;
                if (args.item.text === this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                    this.updateInteractionTools();
                    this.checkStampAnnotations();
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    const stampImage: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_stampElement');
                    if (stampImage) {
                        stampImage.click();
                    }
                    this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
                    this.pdfViewer.annotation.triggerSignatureUnselectEvent();
                } else if (this.stampParentID === this.pdfViewer.localeObj.getConstant('Custom Stamp') && args.item.text !== '') {
                    const elements: any = this.pdfViewerBase.customStampCollection;
                    for (let n: number = 0; n < elements.length; n++) {
                        if (elements[parseInt(n.toString(), 10)].customStampName === args.item.text) {
                            this.pdfViewer.annotationModule.stampAnnotationModule.customStampName = args.item.text;
                            this.checkStampAnnotations();
                            this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                            this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                            this.pdfViewerBase.stampAdded = true;
                            this.pdfViewerBase.isAlreadyAdded = true;
                            this.pdfViewer.annotationModule.stampAnnotationModule.
                                createCustomStampAnnotation(elements[parseInt(n.toString(), 10)].customStampImageSource);
                            this.pdfViewerBase.stampAdded = false;
                        }
                    }
                } else if (args.item.text !== this.pdfViewer.localeObj.getConstant('Dynamic') && args.item.text !== '' && args.item.text !== 'Standard Business' && (this.stampParentID === 'Sign Here' || args.item.text !== 'Sign Here')) {
                    this.updateInteractionTools();
                    this.checkStampAnnotations();
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    this.pdfViewerBase.stampAdded = true;
                    this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
                    this.pdfViewer.annotation.triggerSignatureUnselectEvent();
                    if (this.stampParentID === this.pdfViewer.localeObj.getConstant('Dynamic')) {
                        this.pdfViewerBase.isDynamicStamp = true;
                        this.pdfViewer.annotationModule.stampAnnotationModule.retrieveDynamicStampAnnotation((args.item as any).label);
                    } else {
                        this.pdfViewerBase.isDynamicStamp = false;
                        this.pdfViewer.annotationModule.stampAnnotationModule.retrievestampAnnotation((args.item as any).label);
                    }
                    if (Browser.isDevice) {
                        this.stampToolMobileForMobile(this.pdfViewer.element.id + '_annotation_stamp');
                    }
                }
            }
        };
        this.menuItems = new Menu(menuOptions, '#' + this.pdfViewer.element.id + 'contextMenuElement');
        contextMenuElement.parentElement.classList.add('e-pv-stamp');
        if (this.pdfViewer.enableRtl) {
            this.menuItems.enableRtl = true;
        }
        return contextMenuElement;
    }

    /**
     * @private
     * @returns {void}
     */
    public createCustomStampElement(): void {
        const stampImage: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_stampElement', attrs: { 'type': 'file' } });
        stampImage.setAttribute('accept', '.jpg,.jpeg,.png');
        stampImage.style.position = 'absolute';
        stampImage.style.left = '0px';
        stampImage.style.top = '0px';
        stampImage.style.visibility = 'hidden';
        document.body.appendChild(stampImage);
        stampImage.addEventListener('change', this.addStampImage);
    }

    public addStampImage = (args: any): void => {
        // eslint-disable-next-line
        const proxy: any = this;
        const upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            this.pdfViewer.annotationModule.stampAnnotationModule.customStampName = uploadedFile.name.split('.')[0];
            if (uploadedFile.type.split('/')[0] === 'image') {
                const reader: FileReader = new FileReader();
                reader.onload = (e: any): void => {
                    const uploadedFileUrl: string = e.currentTarget.result;
                    proxy.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    proxy.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    proxy.pdfViewerBase.stampAdded = true;
                    this.pdfViewer.annotationModule.stampAnnotationModule.createCustomStampAnnotation(uploadedFileUrl);
                    proxy.pdfViewerBase.stampAdded = false;
                };
                reader.readAsDataURL(uploadedFile);
            }
        }
        args.target.value = '';
        args.currentTarget.value = '';
    };

    public checkStampAnnotations(): void {
        if (this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode && this.pdfViewer.selectedItems &&
            this.pdfViewer.selectedItems.annotations) {
            for (let i: number = 0; i < this.pdfViewer.selectedItems.annotations.length; i++) {
                const annotation: any = this.pdfViewer.selectedItems.annotations[parseInt(i.toString(), 10)];
                if (annotation && !annotation.annotName && !annotation.author && (annotation.shapeAnnotationType !== 'Shape' || annotation.shapeAnnotationType !== 'Image')) {
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.annotation.renderAnnotations(annotation.pageIndex, null, null, null);
                    this.pdfViewer.clearSelection(annotation.pageIndex);
                }
            }
        }
    }

    private createDropDowns(isPath?: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.shapeElement = this.pdfViewerBase.getElement('_annotation_shapes');
            const shapeToolbar: Tool = this.createShapeOptions(this.shapeElement.id, true);
            this.shapeDropDown = this.createDropDownButton(this.shapeElement, 'e-pv-annotation-shape-icon', shapeToolbar.element, this.pdfViewer.localeObj.getConstant('Add Shapes'));
            this.calibrateElement = this.pdfViewerBase.getElement('_annotation_calibrate');
            const calibrateToolbar: Tool = this.createShapeOptions(this.calibrateElement.id, false);
            this.calibrateDropDown = this.createDropDownButton(this.calibrateElement, 'e-pv-annotation-calibrate-icon', calibrateToolbar.element, this.pdfViewer.localeObj.getConstant('Calibrate'));
        }
        if (!isPath) {
            this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
            this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
            this.colorPalette.change = this.onColorPickerChange.bind(this);
            this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
            this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
            this.colorDropDown.open = this.colorDropDownOpen.bind(this);
            this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.strokeDropDownElement = this.pdfViewerBase.getElement('_annotation_stroke');
            this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id);
            this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
            this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement, this.pdfViewer.localeObj.getConstant('Stroke edit'));
            this.strokeDropDown.beforeOpen = this.strokeDropDownBeforeOpen.bind(this);
            this.strokeDropDown.open = this.strokeDropDownOpen.bind(this);
            this.pdfViewerBase.getElement('_annotation_stroke-popup').addEventListener('click', this.onStrokePickerCancelClick.bind(this));
            this.thicknessElement = this.pdfViewerBase.getElement('_annotation_thickness');
            const thicknessContainer: HTMLElement = this.createThicknessSlider(this.thicknessElement.id);
            this.thicknessDropDown = this.createDropDownButton(this.thicknessElement, 'e-pv-annotation-thickness-icon', thicknessContainer, this.pdfViewer.localeObj.getConstant('Change thickness'));
            this.thicknessDropDown.beforeOpen = this.thicknessDropDownBeforeOpen.bind(this);
            this.thicknessSlider.change = this.thicknessChange.bind(this);
            this.thicknessSlider.changed = this.thicknessChange.bind(this);
            if (!this.pdfViewer.enableRtl) {
                this.thicknessDropDown.open = this.thicknessDropDownOpen.bind(this);
            }
        }
        if (!isPath) {
            this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
            const sliderContainer: HTMLElement = this.createSlider(this.opacityDropDownElement.id);
            this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
            this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
            this.opacitySlider.change = this.opacityChange.bind(this);
            this.opacitySlider.changed = this.opacityChange.bind(this);
            if (!this.pdfViewer.enableRtl) {
                this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
            }
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.fontFamilyElement = this.pdfViewerBase.getElement('_annotation_fontname');
            this.createDropDownListForFamily(this.fontFamilyElement);
            //this.fontFamilyElement.style.textAlign = 'left';
            this.fontFamilyElement.addEventListener('change', (): void => {
                this.onFontFamilyChange.bind(this);
            });
            this.fontSizeElement = this.pdfViewerBase.getElement('_annotation_fontsize');
            this.createDropDownListForSize(this.fontSizeElement);
            this.fontColorElement = this.pdfViewerBase.getElement('_annotation_textcolor');
            this.fontColorPalette = this.createColorPicker(this.fontColorElement.id);
            this.fontColorPalette.change = this.onFontColorChange.bind(this);
            this.fontColorDropDown = this.createDropDownButton(this.fontColorElement, 'e-pv-annotation-textcolor-icon', this.fontColorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Font color'));
            this.textAlignElement = this.pdfViewerBase.getElement('_annotation_textalign');
            this.alignmentToolbar = this.createShapeOptions(this.textAlignElement.id, undefined, true);
            this.textAlignDropDown = this.createDropDownButton(this.textAlignElement, 'e-pv-annotation-textalign-icon', this.alignmentToolbar.element, this.pdfViewer.localeObj.getConstant('Text Align'));
            this.textAlignDropDown.beforeOpen = this.textAlignDropDownBeforeOpen.bind(this);
            this.textPropElement = this.pdfViewerBase.getElement('_annotation_textproperties');
            this.propertiesToolbar = this.createShapeOptions(this.textPropElement.id, undefined, false, true);
            this.textPropertiesDropDown = this.createPropDropDownButton(this.textPropElement, 'e-pv-annotation-textprop-icon', this.propertiesToolbar.element, this.pdfViewer.localeObj.getConstant('Text Properties'));
            this.textPropertiesDropDown.beforeOpen = this.textPropertiesDropDownBeforeOpen.bind(this);
        }
    }

    private mobileColorpicker(id: string): void {
        this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
        const sliderContainer: HTMLElement = this.createSlider(this.opacityDropDownElement.id);
        this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
        this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
        this.opacitySlider.change = this.opacityChange.bind(this);
        this.opacitySlider.changed = this.opacityChange.bind(this);
        if (!this.pdfViewer.enableRtl) {
            this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
        }
        if (id === this.pdfViewer.element.id + '_annotation_shapes') {
            id = this.pdfViewer.element.id + '_annotation_shapesIcon';
        } else if (id === this.pdfViewer.element.id + '_annotation_calibrate') {
            id = this.pdfViewer.element.id + '_annotation_calibrateIcon';
        } else if (id === this.pdfViewer.element.id + '_highlight') {
            id = this.pdfViewer.element.id + '_highlightIcon';
        } else if (id === this.pdfViewer.element.id + '_underline') {
            id = this.pdfViewer.element.id + '_underlineIcon';
        } else if (id === this.pdfViewer.element.id + '_strikethrough') {
            id = this.pdfViewer.element.id + '_strikethroughIcon';
        }
        if (id === this.pdfViewer.element.id + '_annotation_shapesIcon' || id === this.pdfViewer.element.id + '_annotation_calibrateIcon' || id === this.pdfViewer.element.id + '_annotation_freeTextEdit' ||
            id === this.pdfViewer.element.id + '_highlightIcon' || id === this.pdfViewer.element.id + '_underlineIcon' || id === this.pdfViewer.element.id + '_strikethroughIcon' || id === this.pdfViewer.element.id + '_annotation_inkIcon' || id === this.pdfViewer.element.id + '_annotation_handwrittenSign') {
            if (id !== this.pdfViewer.element.id + '_annotation_handwrittenSign' && id !== this.pdfViewer.element.id + '_annotation_inkIcon') {
                this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
                this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
                this.colorPalette.change = this.onColorPickerChange.bind(this);
                this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
                this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
                this.colorDropDown.open = this.colorDropDownOpen.bind(this);
                this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
            }
            if (id === this.pdfViewer.element.id + '_annotation_freeTextEdit') {
                this.fontFamilyElement = this.pdfViewerBase.getElement('_annotation_fontname');
                this.createDropDownListForFamily(this.fontFamilyElement);
                this.fontFamilyElement.style.textAlign = 'left';
                this.fontFamilyElement.addEventListener('change', (): void => { this.onFontFamilyChange.bind(this); });
                this.fontSizeElement = this.pdfViewerBase.getElement('_annotation_fontsize');
                this.createDropDownListForSize(this.fontSizeElement);
                this.fontColorElement = this.pdfViewerBase.getElement('_annotation_textcolor');
                this.fontColorPalette = this.createColorPicker(this.fontColorElement.id);
                this.fontColorPalette.change = this.onFontColorChange.bind(this);
                this.fontColorDropDown = this.createDropDownButton(this.fontColorElement, 'e-pv-annotation-textcolor-icon', this.fontColorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Font color'));
                this.textAlignElement = this.pdfViewerBase.getElement('_annotation_textalign');
                this.alignmentToolbar = this.createShapeOptions(this.textAlignElement.id, undefined, true);
                this.textAlignDropDown = this.createDropDownButton(this.textAlignElement, 'e-pv-annotation-textalign-icon', this.alignmentToolbar.element, this.pdfViewer.localeObj.getConstant('Text Align'));
                this.textAlignDropDown.beforeOpen = this.textAlignDropDownBeforeOpen.bind(this);
                this.textPropElement = this.pdfViewerBase.getElement('_annotation_textproperties');
                this.propertiesToolbar = this.createShapeOptions(this.textPropElement.id, undefined, false, true);
                this.textPropertiesDropDown = this.createPropDropDownButton(this.textPropElement, 'e-pv-annotation-textprop-icon', this.propertiesToolbar.element, this.pdfViewer.localeObj.getConstant('Text Properties'));
                this.textPropertiesDropDown.beforeOpen = this.textPropertiesDropDownBeforeOpen.bind(this);
            }
            if (id === this.pdfViewer.element.id + '_annotation_shapesIcon' || id === this.pdfViewer.element.id + '_annotation_calibrateIcon' || id === this.pdfViewer.element.id + '_annotation_freeTextEdit' ||
                id === this.pdfViewer.element.id + '_annotation_inkIcon' || id === this.pdfViewer.element.id + '_annotation_handwrittenSign') {
                this.thicknessElement = this.pdfViewerBase.getElement('_annotation_thickness');
                const thicknessContainer: HTMLElement = this.createThicknessSlider(this.thicknessElement.id);
                this.thicknessDropDown = this.createDropDownButton(this.thicknessElement, 'e-pv-annotation-thickness-icon', thicknessContainer, this.pdfViewer.localeObj.getConstant('Change thickness'));
                this.thicknessDropDown.beforeOpen = this.thicknessDropDownBeforeOpen.bind(this);
                this.thicknessSlider.change = this.thicknessChange.bind(this);
                this.thicknessSlider.changed = this.thicknessChange.bind(this);
                if (!this.pdfViewer.enableRtl) {
                    this.thicknessDropDown.open = this.thicknessDropDownOpen.bind(this);
                }
                this.strokeDropDownElement = this.pdfViewerBase.getElement('_annotation_stroke');
                this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id);
                this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
                this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement, this.pdfViewer.localeObj.getConstant('Stroke edit'));
                this.strokeDropDown.beforeOpen = this.strokeDropDownBeforeOpen.bind(this);
                this.strokeDropDown.open = this.strokeDropDownOpen.bind(this);
                this.pdfViewerBase.getElement('_annotation_stroke-popup').addEventListener('click', this.onStrokePickerCancelClick.bind(this));
            }
        }
    }

    private opacityDropDownOpen(args: OpenCloseMenuEventArgs): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.element.parentElement.style.left = '0px';
            args.element.parentElement.style.top = (this.pdfViewerBase.viewerContainer.clientHeight) + 'px';
        } else {
            this.calculateToolbarPosition(args);
        }
    }

    private onColorPickerCancelClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('e-cancel')) {
            this.colorDropDown.toggle();
        }
    }

    private onStrokePickerCancelClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('e-cancel')) {
            this.strokeDropDown.toggle();
        }
    }

    private colorDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        this.colorPalette.noColor = false;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.colorPalette.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color;
            } else {
                this.setCurrentColorInPicker();
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.colorPalette.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
            this.colorPalette.noColor = true;
        } else {
            this.setCurrentColorInPicker();
        }
        this.colorPalette.refresh();
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    }

    /**
     * @private
     * @returns {void}
     */
    public setCurrentColorInPicker(): void {
        if (!isBlazor()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                case 'Highlight':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor);
                    break;
                case 'Underline':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor);
                    break;
                case 'Strikethrough':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
                    break;
                }
            }
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotationModule.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.lineFillColor);
                    break;
                case 'Arrow':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.arrowFillColor);
                    break;
                case 'Rectangle':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.rectangleFillColor);
                    break;
                case 'Circle':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.circleFillColor);
                    break;
                case 'Polygon':
                    this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.polygonFillColor);
                    break;
                }
            }
            if (this.colorDropDownElement) {
                this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
            }
        }
    }

    private colorDropDownOpen(args: any): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.element.parentElement.style.top = (this.pdfViewerBase.viewerContainer.clientHeight / 2) + 'px';
        }
        this.popupPosition(args, this.colorDropDownElement);
        this.colorPalette.refresh();
    }

    private strokeDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        } else {
            this.setCurrentStrokeColorInPicker();
        }
        this.strokeColorPicker.refresh();
        this.updateColorInIcon(this.strokeDropDownElement, this.strokeColorPicker.value);
        this.updateInkannotationItems();
    }

    private setCurrentStrokeColorInPicker(): void {
        if (!isBlazor()) {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotationModule.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.lineStrokeColor);
                    break;
                case 'Arrow':
                    this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.arrowStrokeColor);
                    break;
                case 'Rectangle':
                    this.setColorInPicker(this.strokeColorPicker,
                                          this.pdfViewer.annotationModule.shapeAnnotationModule.rectangleStrokeColor);
                    break;
                case 'Circle':
                    this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.circleStrokeColor);
                    break;
                case 'Polygon':
                    this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.polygonStrokeColor);
                    break;
                }
            }
        }
    }

    private strokeDropDownOpen(args: any): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.element.parentElement.style.top = (this.pdfViewerBase.viewerContainer.clientHeight / 2) + 'px';
        }
        this.popupPosition(args, this.strokeDropDownElement);
        this.strokeColorPicker.refresh();
    }

    private popupPosition: any = function (colorElement: any, buttonElement: any): void {
        if (colorElement && colorElement.element) {
            const buttonBounds: any = buttonElement.getBoundingClientRect();
            const elements: any = colorElement.element.getElementsByClassName('e-container e-color-palette')[0].getElementsByClassName('e-palette')[0].getBoundingClientRect();
            const mainContainerBounds: any = this.pdfViewerBase.mainContainer.getBoundingClientRect();
            if (elements.left + elements.width > mainContainerBounds.width) {
                colorElement.element.parentElement.style.left = (elements.left - elements.width) + buttonBounds.width + 'px';
            }
        }
    };

    private onFontColorChange(args: any): void {
        let currentColor: any;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        } else {
            currentColor = args[0];
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.pdfViewer.annotation.modifyFontColor(currentColor);
        } else {
            this.pdfViewer.freeTextSettings.fontColor = currentColor;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
        if (isBlazor()) {
            this.fontColorElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-textcolor-container');
            this.updateColorInIcon(this.fontColorElementInBlazor, currentColor);
        } else {
            this.updateColorInIcon(this.fontColorElement, currentColor);
            this.fontColorDropDown.toggle();
        }
    }

    private onFontFamilyChange(args: any): void {
        let currentValue: string;
        if (!isBlazor()) {
            currentValue = (args && args.fontFamily && args.fontFamily.value) ? args.fontFamily.value : '';
        } else {
            currentValue = args;
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyFontFamily(currentValue);
        } else {
            this.pdfViewer.freeTextSettings.fontFamily = currentValue;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
    }

    private onFontSizeChange(args: any, isInteracted: boolean): void {
        let currentValue: string;
        if (!isBlazor()) {
            currentValue = (args && args.fontSize && args.fontSize.value) ? args.fontSize.value : '';
        } else {
            currentValue = args;
        }
        const fontSize: number = parseFloat(currentValue);
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyFontSize(fontSize, isInteracted);
        } else {
            this.pdfViewer.freeTextSettings.fontSize = fontSize;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
    }

    private textAlignDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.element.getElementsByTagName('button') && args.element.getElementsByTagName('button').length > 0) {
                const dropDownOptions: any = args.element.getElementsByTagName('button');
                const selectedAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                for (let n: number = 0; n < dropDownOptions.length; n++) {
                    if (dropDownOptions[parseInt(n.toString(), 10)]) {
                        dropDownOptions[parseInt(n.toString(), 10)].classList.remove('textprop-option-active');
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_left_align') && selectedAnnotation.textAlign === 'Left') {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_right_align') && selectedAnnotation.textAlign === 'Right') {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_center_align') && selectedAnnotation.textAlign === 'Center') {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_justify_align') && selectedAnnotation.textAlign === 'Justify') {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                    }
                }
            }
        }
    }

    private textPropertiesDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.element.getElementsByTagName('button') && args.element.getElementsByTagName('button').length > 0) {
                const dropDownOptions: any = args.element.getElementsByTagName('button');
                const selectedAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                for (let n: number = 0; n < dropDownOptions.length; n++) {
                    if (dropDownOptions[parseInt(n.toString(), 10)]) {
                        dropDownOptions[parseInt(n.toString(), 10)].classList.remove('textprop-option-active');
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_bold') && selectedAnnotation.font.isBold) {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_italic') && selectedAnnotation.font.isItalic) {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_strikeout') && selectedAnnotation.font.isStrikeout) {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[parseInt(n.toString(), 10)].id === (this.pdfViewer.element.id + '_underline_textinput') && selectedAnnotation.font.isUnderline) {
                            dropDownOptions[parseInt(n.toString(), 10)].classList.add('textprop-option-active');
                        }
                    }
                }
            }
        }
    }

    private onClickTextAlignment(args: any): void {
        let currentValue: string;
        if (isBlazor()) {
            currentValue = args[0];
        } else {
            currentValue = (args && args.item && args.item.value) ? args.item.value : '';
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyTextAlignment(currentValue);
        } else {
            this.pdfViewer.freeTextSettings.textAlignment = args.item.value;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
        this.updateTextAlignInIcon(currentValue);
    }

    private onClickTextProperties(args: any): void {
        let currentValue: string;
        if (isBlazor()) {
            currentValue = args[0];
        } else {
            currentValue = (args && args.item && args.item.value) ? args.item.value : '';
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            const fontInfo: PdfFontModel = { isBold: undefined, isItalic: undefined, isStrikeout: undefined, isUnderline: undefined };
            if (currentValue === 'bold') {
                fontInfo.isBold = !(this.pdfViewer.selectedItems.annotations[0].font.isBold);
            } else if (currentValue === 'italic') {
                fontInfo.isItalic = !(this.pdfViewer.selectedItems.annotations[0].font.isItalic);
            } else if (currentValue === 'underline') {
                fontInfo.isUnderline = !(this.pdfViewer.selectedItems.annotations[0].font.isUnderline);
            } else if (currentValue === 'strikeout') {
                fontInfo.isStrikeout = !(this.pdfViewer.selectedItems.annotations[0].font.isStrikeout);
            }
            this.pdfViewer.annotation.modifyTextProperties(fontInfo, currentValue);
        } else {
            if (currentValue === 'bold') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold = false;
                } else {
                    this.pdfViewer.freeTextSettings.fontStyle = 1;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            } else if (currentValue === 'italic') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic = false;
                } else {
                    this.pdfViewer.freeTextSettings.fontStyle = 2;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            } else if (currentValue === 'underline') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline = false;
                } else {
                    this.pdfViewer.freeTextSettings.fontStyle = 4;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough = false;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            } else if (currentValue === 'strikeout') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough = false;
                } else {
                    this.pdfViewer.freeTextSettings.fontStyle = 8;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline = false;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
        }
        this.updateTextPropertySelection(currentValue);
    }

    private opacityChange(args: any): void {
        let opacityValue: number = 1;
        if (args && args.length === 1) {
            opacityValue = (args[0] as number);
        } else {
            opacityValue = args.value;
        }
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                if (!isBlazor()) {
                    if (this.isCurrentAnnotationOpacitySet && args.name === 'changed') {
                        this.isCurrentAnnotationOpacitySet = false;
                    } else {
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(args);
                    }
                } else {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, opacityValue);
                }
            } else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                case 'Highlight':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity = opacityValue / 100;
                    break;
                case 'Underline':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity = opacityValue / 100;
                    break;
                case 'Strikethrough':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity = opacityValue / 100;
                    break;
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            const currentAnnotations: any = this.pdfViewer.selectedItems.annotations[0];
            if (currentAnnotations != null && (currentAnnotations.shapeAnnotationType === 'Stamp' || currentAnnotations.shapeAnnotationType === 'Image')) {
                const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotations);
                const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotations);
                redoClonedObject.opacity = opacityValue / 100;
                this.pdfViewer.nodePropertyChange(currentAnnotations, { opacity: opacityValue / 100 });
                this.pdfViewer.annotation.triggerAnnotationPropChange(currentAnnotations, false, false, false, true);
                this.pdfViewer.annotation.addAction(this.pdfViewer.selectedItems.annotations[0].pageIndex, null, this.pdfViewer.selectedItems.annotations[0], 'stampOpacity', '', clonedObject, redoClonedObject);
                this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(this.pdfViewer.selectedItems.annotations[0], null, 'opacity');
            } else {
                if (isBlazor()) {
                    this.pdfViewer.annotation.modifyOpacity(opacityValue, true);
                } else {
                    if (args.name === 'changed') {
                        if (args.value !== args.previousValue) {
                            this.pdfViewer.annotation.modifyOpacity(args);
                        }
                    }
                }
            }
        } else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.pdfViewer.annotation.shapeAnnotationModule.lineOpacity = opacityValue / 100;
                    break;
                case 'Arrow':
                    this.pdfViewer.annotation.shapeAnnotationModule.arrowOpacity = opacityValue / 100;
                    break;
                case 'Rectangle':
                    this.pdfViewer.annotation.shapeAnnotationModule.rectangleOpacity = opacityValue / 100;
                    break;
                case 'Circle':
                    this.pdfViewer.annotation.shapeAnnotationModule.circleOpacity = opacityValue / 100;
                    break;
                case 'Polygon':
                    this.pdfViewer.annotation.shapeAnnotationModule.polygonOpacity = opacityValue / 100;
                    break;
                }
            }
            const annotationModule: Annotation = this.pdfViewer.annotation;
            if (annotationModule && annotationModule.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.opacity = opacityValue / 100;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.opacity = opacityValue / 100;
                if (this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.annotation.freeTextAnnotationModule.opacity = opacityValue / 100;
                }
            }
        }
        if (!isBlazor()) {
            this.updateOpacityIndicator();
        }
    }

    private opacityDropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.isCurrentAnnotationOpacitySet = true;
                this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                    currentTextMarkupAnnotation.opacity * 100;
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
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.opacitySlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
        } else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.lineOpacity * 100;
                    break;
                case 'Arrow':
                    this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.arrowOpacity * 100;
                    break;
                case 'Rectangle':
                    this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.rectangleOpacity * 100;
                    break;
                case 'Circle':
                    this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.circleOpacity * 100;
                    break;
                case 'Polygon':
                    this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.polygonOpacity * 100;
                    break;
                }
            }
        }
        this.updateOpacityIndicator();
        this.updateInkannotationItems();
    }

    private thicknessDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.thicknessSlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
        } else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.lineThickness;
                    break;
                case 'Arrow':
                    this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.arrowThickness;
                    break;
                case 'Rectangle':
                    this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.rectangleThickness;
                    break;
                case 'Circle':
                    this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.circleThickness;
                    break;
                case 'Polygon':
                    this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.polygonThickness;
                    break;
                }
            }
        }
        this.updateThicknessIndicator();
        this.updateInkannotationItems();
    }

    private thicknessDropDownOpen(args: OpenCloseMenuEventArgs): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.element.parentElement.style.left = '0px';
            args.element.parentElement.style.top = (this.pdfViewerBase.viewerContainer.clientHeight) + 'px';
        } else {
            this.calculateToolbarPosition(args);
        }
    }

    private calculateToolbarPosition(args: OpenCloseMenuEventArgs): void {
        if (args.element && args.element.parentElement) {
            const leftValue: number = parseFloat(args.element.parentElement.style.left);
            const width: number = args.element.parentElement.offsetWidth;
            if ((leftValue + width) < (this.pdfViewer.element.offsetWidth + 10)) {
                args.element.parentElement.style.left = (leftValue - width) + 'px';
            }
        }
    }

    private thicknessChangeInBlazor(args: any): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.pdfViewer.annotation.modifyThickness(args[0] as number);
        } else {
            this.ShapeThickness(args[0]);
        }
    }

    private thicknessChange(args: ChangeEventArgs): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.name === 'changed') {
                this.pdfViewer.annotation.modifyThickness(args.value);
                if (!isBlazor()) {
                    this.updateThicknessIndicator();
                }
                const annotationModule: Annotation = this.pdfViewer.annotation;
                const selectedItems: any = this.pdfViewer.selectedItems.annotations[0];
                if (annotationModule && annotationModule.inkAnnotationModule && selectedItems && selectedItems.shapeAnnotationType === 'Ink') {
                    this.pdfViewer.inkAnnotationSettings.thickness = args.value;
                }
            }
        } else {
            this.ShapeThickness(args.value);
        }
    }

    private ShapeThickness(args: any): void {
        if (this.pdfViewer.annotation.shapeAnnotationModule) {
            switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
            case 'Line':
                this.pdfViewer.annotation.shapeAnnotationModule.lineThickness = args;
                break;
            case 'Arrow':
                this.pdfViewer.annotation.shapeAnnotationModule.arrowThickness = args;
                break;
            case 'Rectangle':
                this.pdfViewer.annotation.shapeAnnotationModule.rectangleThickness = args;
                break;
            case 'Circle':
                this.pdfViewer.annotation.shapeAnnotationModule.circleThickness = args;
                break;
            case 'Polygon':
                this.pdfViewer.annotation.shapeAnnotationModule.polygonThickness = args;
                break;
            }
            const annotationModule: Annotation = this.pdfViewer.annotation;
            if (annotationModule && annotationModule.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.thickness = args.value;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.thickness = args.value;
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                this.pdfViewer.annotation.freeTextAnnotationModule.borderWidth = args.value;
            }
        }
        const annotationModule: Annotation = this.pdfViewer.annotation;
        if (annotationModule && annotationModule.inkAnnotationModule) {
            this.pdfViewer.inkAnnotationSettings.thickness = args;
        }
        if (this.pdfViewer.drawingObject) {
            this.pdfViewer.drawingObject.thickness = args;
        }
        if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
            this.pdfViewer.annotation.freeTextAnnotationModule.borderWidth = args;
        }
        if (!isBlazor()) {
            this.updateThicknessIndicator();
        }
    }

    private createDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement, tooltipText: string): DropDownButton {
        const dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        element.setAttribute('aria-label', tooltipText);
        return dropDownButton;
    }

    private createShapeOptions(idString: string, isShape: boolean, isAlign?: boolean, isTextProp?: boolean): Tool {
        const toolbarElement: HTMLElement = createElement('div', { id: idString + '_target', className: 'e-pv-shapes-toolbar' });
        document.body.appendChild(toolbarElement);
        let toolbar: Tool;
        if (isAlign) {
            toolbar = new Tool({ items: this.textAlignmentToolbarItems(), overflowMode: 'MultiRow' }, toolbarElement);
            toolbar.isStringTemplate = true;
            this.afterAlignmentToolbarCreation();
        } else if (isTextProp) {
            toolbar = new Tool({ items: this.textPropertiesToolbarItems(), overflowMode: 'MultiRow' }, toolbarElement);
            toolbar.isStringTemplate = true;
            this.afterPropertiesToolbarCreation();
        } else {
            if (isShape) {
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    toolbar = new Tool({ items: this.createShapeToolbarItems(), overflowMode: 'MultiRow', clicked: this.onShapeToolbarClicked.bind(this) }, toolbarElement);
                    toolbar.isStringTemplate = true;
                    this.afterShapeToolbarCreation();
                } else {
                    this.toolbarElement = createElement('div', { id: idString + '_target', className: 'e-pv-mobile-annotation-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left' });
                    this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
                    toolbar = new Tool({ items: this.createShapeToolbarItemsForMobile(), overflowMode: 'Scrollable', clicked: this.onShapeToolbarClicked.bind(this) }, this.toolbarElement);
                    toolbar.isStringTemplate = true;
                    this.afterShapeToolbarCreationForMobile();
                }
            } else {
                toolbar = new Tool({ items: this.createCalibrateToolbarItems(), overflowMode: 'MultiRow', clicked: this.onCalibrateToolbarClicked.bind(this) }, toolbarElement);
                toolbar.isStringTemplate = true;
                this.afterCalibrateToolbarCreation();
            }
        }
        return toolbar;
    }

    private createPropertyToolbarForMobile(shapeType: any): any[] {
        const colorTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const strokeTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const fontFamilyTemplate: string = this.getTemplate('input', '_annotation_fontname', 'e-pv-annotation-fontname-container');
        const fontSizeTemplate: string = this.getTemplate('input', '_annotation_fontsize', 'e-pv-annotation-fontsize-container');
        const textColorTemplate: string = this.getTemplate('span', '_annotation_textcolor', 'e-pv-annotation-textcolor-container');
        const alignmentTemplate: string = this.getTemplate('span', '_annotation_textalign', 'e-pv-annotation-textalign-container');
        const textPropertiesTemplate: string = this.getTemplate('span', '_annotation_textproperties', 'e-pv-annotation-textprop-container');
        const items: any[] = [];
        if (shapeType === 'Polygon' || shapeType === 'Rectangle' || shapeType === 'Ellipse' || shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Distance' || shapeType === 'Perimeter' || shapeType === 'Radius' || shapeType === 'FreeText') {
            if (shapeType === 'FreeText') {
                items.push({ prefixIcon: 'e-pv-freetext-icon e-pv-icon', className: 'e-pv-annotation-freetextedit-container' });
                items.push({ type: 'Separator', align: 'Left' });
                items.push({ template: fontFamilyTemplate });
                items.push({ template: fontSizeTemplate });
                items.push({ template: textColorTemplate });
                items.push({ template: alignmentTemplate });
                items.push({ template: textPropertiesTemplate });
            }
            if (shapeType === 'Polygon') {
                if (this.pdfViewer.selectedItems.annotations[0].measureType === 'Area') {
                    items.push({ prefixIcon: 'e-pv-calibrate-area-icon e-pv-icon' });
                    items.push({ type: 'Separator', align: 'Left' });
                } else if (this.pdfViewer.selectedItems.annotations[0].measureType === 'Volume') {
                    items.push({ prefixIcon: 'e-pv-calibrate-volume-icon e-pv-icon' });
                    items.push({ type: 'Separator', align: 'Left' });
                } else {
                    items.push({ prefixIcon: 'e-pv-shape-pentagon-icon e-pv-icon' });
                    items.push({ type: 'Separator', align: 'Left' });
                }
            } else if (shapeType === 'Rectangle') {
                items.push({ prefixIcon: 'e-pv-shape-rectangle-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Ellipse') {
                items.push({ prefixIcon: 'e-pv-shape-circle-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Line') {
                if (this.pdfViewer.selectedItems.annotations[0].measureType === 'Perimeter') {
                    items.push({ prefixIcon: 'e-pv-calibrate-perimeter-icon e-pv-icon' });
                    items.push({ type: 'Separator', align: 'Left' });
                } else {
                    items.push({ prefixIcon: 'e-pv-shape-line-icon e-pv-icon' });
                    items.push({ type: 'Separator', align: 'Left' });
                }
            } else if (shapeType === 'LineWidthArrowHead') {
                items.push({ prefixIcon: 'e-pv-shape-arrow-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Distance') {
                items.push({ prefixIcon: 'e-pv-calibrate-distance-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Perimeter') {
                items.push({ prefixIcon: 'e-pv-calibrate-perimeter-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Radius') {
                items.push({ prefixIcon: 'e-pv-calibrate-radius-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            }
            items.push({ template: colorTemplate });
            items.push({ template: strokeTemplate });
            items.push({ template: thicknessTemplate });
        } else if (shapeType === 'Path' || shapeType === 'Ink' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText') {
            if (shapeType === 'Path' || shapeType === 'Ink') {
                items.push({ prefixIcon: 'e-pv-inkannotation-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText') {
                items.push({ prefixIcon: 'e-pv-handwritten-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            }
            items.push({ template: strokeTemplate });
            items.push({ template: thicknessTemplate });
        } else if (shapeType === 'Underline' || shapeType === 'Highlight' || shapeType === 'Strikethrough') {
            if (shapeType === 'Highlight') {
                items.push({ prefixIcon: 'e-pv-highlight-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Underline') {
                items.push({ prefixIcon: 'e-pv-underline-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            } else if (shapeType === 'Strikethrough') {
                items.push({ prefixIcon: 'e-pv-strikethrough-icon e-pv-icon' });
                items.push({ type: 'Separator', align: 'Left' });
            }
            items.push({ template: colorTemplate });
        } else if (shapeType === 'Stamp' || shapeType === 'Image') {
            items.push({ prefixIcon: 'e-pv-stamp-icon e-pv-icon' });
            items.push({ type: 'Separator', align: 'Left' });
        } else if (shapeType === 'StickyNotes') {
            items.push({ prefixIcon: 'e-pv-comment-icon e-pv-icon' });
            items.push({ type: 'Separator', align: 'Left' });
        }
        items.push({ template: opacityTemplate });
        items.push({
            prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_annotation_commentPanel', align: 'Right', click: (args: ClickEventArgs) => {
                this.pdfViewer.annotationModule.showCommentsPanel();
            }
        });
        items.push({
            prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'Right', click: (args: ClickEventArgs) => {
                this.pdfViewer.annotationModule.deleteAnnotation();
                this.propertyToolbar.destroy();
                this.toolbarCreated = false;
                this.createAnnotationToolbarForMobile();
                this.adjustMobileViewer();
            }
        });
        return items;
    }

    private createStampToolbarItemsForMobile(): any[] {
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: opacityTemplate });
        return items;
    }

    private createShapeToolbarItemsForMobile(): any[] {
        const colorTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const strokeTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        items.push({ prefixIcon: 'e-pv-shape-line-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_line', text: this.pdfViewer.localeObj.getConstant('Line Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-arrow-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_arrow', text: this.pdfViewer.localeObj.getConstant('Arrow Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-rectangle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_rectangle', text: this.pdfViewer.localeObj.getConstant('Rectangle Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-circle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_circle', text: this.pdfViewer.localeObj.getConstant('Circle Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-pentagon-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_pentagon', text: this.pdfViewer.localeObj.getConstant('Pentagon Shape'), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: colorTemplate });
        items.push({ template: strokeTemplate });
        items.push({ template: thicknessTemplate });
        items.push({ template: opacityTemplate });
        return items;
    }

    private createCalibrateToolbarItemsForMobile(): any[] {
        const colorTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        const strokeTemplate: string = this.pdfViewer.toolbarModule.annotationToolbarModule.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        const thicknessTemplate: string = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        const opacityTemplate: string = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        items.push({ prefixIcon: 'e-pv-calibrate-distance-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_distance', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-perimeter-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_perimeter', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-area-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_area', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-radius-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_radius', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-volume-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_volume', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: colorTemplate });
        items.push({ template: strokeTemplate });
        items.push({ template: thicknessTemplate });
        items.push({ template: opacityTemplate });
        return items;
    }

    private handleShapeTool(type: string): void {
        if (!isBlazor() && Browser.isDevice) {
            const selectedItems: any = document.querySelectorAll('.e-pv-select');
            for (let i: number = 0; i < selectedItems.length; i++) {
                if (selectedItems[parseInt(i.toString(), 10)].id !== type && selectedItems[parseInt(i.toString(), 10)].id !== this.pdfViewer.element.id + '_annotation') {
                    selectedItems[parseInt(i.toString(), 10)].classList.remove('e-pv-select');
                }
            }
        }
    }

    private createPropDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement, tooltipText: string): DropDownButton {
        const dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target, cssClass: 'e-caret-hide' });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        element.setAttribute('aria-label', tooltipText);
        return dropDownButton;
    }

    private textAlignmentToolbarItems(): any[] {
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-left-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_left_align', align: 'Left', value: 'Left', click: this.onClickTextAlignment.bind(this) });
        items.push({ prefixIcon: 'e-pv-center-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_center_align', align: 'Left', value: 'Center', click: this.onClickTextAlignment.bind(this) });
        items.push({ prefixIcon: 'e-pv-right-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_right_align', align: 'Left', value: 'Right', click: this.onClickTextAlignment.bind(this) });
        items.push({ prefixIcon: 'e-pv-justfiy-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_justify_align', align: 'Left', value: 'Justify', click: this.onClickTextAlignment.bind(this) });
        return items;
    }

    private afterAlignmentToolbarCreation(): void {
        this.alignLeftElement = this.primaryToolbar.addClassToolbarItem('_left_align', 'e-pv-left-align', this.pdfViewer.localeObj.getConstant('Align left'));
        this.alignRightElement = this.primaryToolbar.addClassToolbarItem('_right_align', 'e-pv-right-align', this.pdfViewer.localeObj.getConstant('Align right'));
        this.alignCenterElement = this.primaryToolbar.addClassToolbarItem('_center_align', 'e-pv-center-align', this.pdfViewer.localeObj.getConstant('Center'));
        this.alignJustifyElement = this.primaryToolbar.addClassToolbarItem('_justify_align', 'e-pv-justfiy-align', this.pdfViewer.localeObj.getConstant('Justify'));
    }

    private afterPropertiesToolbarCreation(): void {
        this.boldElement = this.primaryToolbar.addClassToolbarItem('_bold', 'e-pv-bold', this.pdfViewer.localeObj.getConstant('Bold'));
        this.italicElement = this.primaryToolbar.addClassToolbarItem('_italic', 'e-pv-italic', this.pdfViewer.localeObj.getConstant('Italic'));
        this.fontStyleStrikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikeout', 'e-pv-strikeout', this.pdfViewer.localeObj.getConstant('Strikethroughs'));
        this.fontStyleUnderlineItem = this.primaryToolbar.addClassToolbarItem('_underline_textinput', 'e-pv-underlinetext', this.pdfViewer.localeObj.getConstant('Underlines'));
    }

    private createDropDownListForSize(fontSelectElement: HTMLElement): void {
        // eslint-disable-next-line
        const proxy: any = this;
        const fontSize: string[] = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px', '96px'];
        if (!this.pdfViewer.enableRtl) {
            this.fontSize = new ComboBox({
                dataSource: fontSize,
                cssClass: 'e-pv-prop-dropdown',
                allowCustom: true,
                showClearButton: false,
                width: '80px',
                popupWidth: '100px'
            });
        } else {
            this.fontSize = new ComboBox({
                dataSource: fontSize,
                cssClass: 'e-pv-prop-dropdown-rtl',
                allowCustom: true,
                showClearButton: false,
                width: '80px',
                popupWidth: '100px',
                enableRtl: true
            });
        }
        this.fontSize.value = '16px';
        if (!isNullOrUndefined(fontSelectElement)) {
            this.fontSize.appendTo(fontSelectElement);
            const toolTipElement: HTMLElement = fontSelectElement.parentElement ? fontSelectElement.parentElement : fontSelectElement;
            this.primaryToolbar.createTooltip(toolTipElement, this.pdfViewer.localeObj.getConstant('Font size'));
            fontSelectElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Font size'));
        }
        this.fontSize.addEventListener('change', function (args: any): void {
            const isUserInteracted: boolean = args.isInteracted;
            proxy.onFontSizeChange(proxy, isUserInteracted);
        });
    }

    private createDropDownListForFamily(fontSelectElement: HTMLElement): void {
        const fontStyle: { [key: string]: Object }[] = [{ FontName: 'Helvetica' },
            { FontName: 'Courier' }, { FontName: 'Symbol' }, { FontName: 'Times New Roman' }];
        if (!this.pdfViewer.enableRtl) {
            this.fontFamily = new ComboBox({
                dataSource: fontStyle,
                query: new Query().select(['FontName']),
                fields: { text: 'FontName', value: 'FontName' },
                cssClass: 'e-pv-prop-dropdown',
                itemTemplate: initializeCSPTemplate(
                    function (data: any): string { return `<span style="font-family: ${data.FontName};">${data.FontName}</span>`; }
                ),
                allowCustom: true,
                showClearButton: false,
                width: '110px',
                popupWidth: '190px'
            });
        } else {
            this.fontFamily = new ComboBox({
                dataSource: fontStyle,
                query: new Query().select(['FontName']),
                fields: { text: 'FontName', value: 'FontName' },
                cssClass: 'e-pv-prop-dropdown-rtl',
                itemTemplate: initializeCSPTemplate(
                    function (data: any): string { return `<span style="font-family: ${data.FontName};">${data.FontName}</span>`; }
                ),
                allowCustom: true,
                showClearButton: false,
                width: '110px',
                popupWidth: '190px',
                enableRtl: true
            });
        }
        this.fontFamily.isStringTemplate = true;
        this.fontFamily.value = 'Helvetica';
        if (!isNullOrUndefined(fontSelectElement)) {
            this.fontFamily.appendTo(fontSelectElement);
            const toolTipElement: HTMLElement = fontSelectElement.parentElement ? fontSelectElement.parentElement : fontSelectElement;
            this.primaryToolbar.createTooltip(toolTipElement, this.pdfViewer.localeObj.getConstant('Font family'));
            fontSelectElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Font family'));
        }
        this.fontFamily.addEventListener('change', (): void => {
            this.onFontFamilyChange(this);
        });
    }

    private textPropertiesToolbarItems(): any[] {
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-bold-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_bold', align: 'Left', value: 'bold', click: this.onClickTextProperties.bind(this) });
        items.push({ prefixIcon: 'e-pv-italic-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_italic', align: 'Left', value: 'italic', click: this.onClickTextProperties.bind(this) });
        items.push({ prefixIcon: 'e-pv-strikeout-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_strikeout', align: 'Left', value: 'strikeout', click: this.onClickTextProperties.bind(this) });
        items.push({ prefixIcon: 'e-pv-underlinetext-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_underline_textinput', align: 'Left', value: 'underline', click: this.onClickTextProperties.bind(this) });
        return items;
    }

    private createShapeToolbarItems(): any[] {
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-shape-line-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_line', text: this.pdfViewer.localeObj.getConstant('Line Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-arrow-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_arrow', text: this.pdfViewer.localeObj.getConstant('Arrow Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-rectangle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_rectangle', text: this.pdfViewer.localeObj.getConstant('Rectangle Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-circle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_circle', text: this.pdfViewer.localeObj.getConstant('Circle Shape'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-shape-pentagon-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_pentagon', text: this.pdfViewer.localeObj.getConstant('Pentagon Shape'), align: 'Left' });
        return items;
    }

    private createCalibrateToolbarItems(): any[] {
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-calibrate-distance-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_distance', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-perimeter-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_perimeter', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-area-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_area', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-radius-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_radius', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-calibrate-volume-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_volume', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        return items;
    }

    private onShapeToolbarClicked = (args: ClickEventArgs): void => {
        const elementId: string = this.pdfViewer.element.id;
        const shapeAnnotationModule: ShapeAnnotation = this.pdfViewer.annotation.shapeAnnotationModule;
        if (Browser.isDevice || !this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewerBase.action === 'Polygon') {
                (this.pdfViewerBase.tool as PolygonDrawingTool).mouseUp((args as MouseEventArgs), true, true);
            }
        }
        if (!Browser.isDevice) {
            this.deselectAllItems();
            this.resetFreeTextAnnot();
        } else {
            const element: any = args.originalEvent.target;
            this.pdfViewer.toolbarModule.selectItem(element.parentElement);
            this.deselectAllItemsForMobile();
        }
        switch ((args.originalEvent.target as HTMLElement).id) {
        case elementId + '_shape_line':
        case elementId + '_shape_lineIcon':
            shapeAnnotationModule.setAnnotationType('Line');
            this.onShapeDrawSelection(true);
            this.updateColorInIcon(this.colorDropDownElement, shapeAnnotationModule.lineFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, shapeAnnotationModule.lineStrokeColor);
            this.handleShapeTool(elementId + '_shape_line');
            break;
        case elementId + '_shape_arrow':
        case elementId + '_shape_arrowIcon':
            shapeAnnotationModule.setAnnotationType('Arrow');
            this.onShapeDrawSelection(true);
            this.updateColorInIcon(this.colorDropDownElement, shapeAnnotationModule.arrowFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, shapeAnnotationModule.arrowStrokeColor);
            this.handleShapeTool(elementId + '_shape_arrow');
            break;
        case elementId + '_shape_rectangle':
        case elementId + '_shape_rectangleIcon':
            shapeAnnotationModule.setAnnotationType('Rectangle');
            this.onShapeDrawSelection(true);
            this.updateColorInIcon(this.colorDropDownElement, shapeAnnotationModule.rectangleFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, shapeAnnotationModule.rectangleStrokeColor);
            this.handleShapeTool(elementId + '_shape_rectangle');
            break;
        case elementId + '_shape_circle':
        case elementId + '_shape_circleIcon':
            shapeAnnotationModule.setAnnotationType('Circle');
            this.onShapeDrawSelection(true);
            this.updateColorInIcon(this.colorDropDownElement, shapeAnnotationModule.circleFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, shapeAnnotationModule.circleStrokeColor);
            this.handleShapeTool(elementId + '_shape_circle');
            break;
        case elementId + '_shape_pentagon':
        case elementId + '_shape_pentagonIcon':
            shapeAnnotationModule.setAnnotationType('Polygon');
            this.onShapeDrawSelection(true);
            this.updateColorInIcon(this.colorDropDownElement, shapeAnnotationModule.polygonFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, shapeAnnotationModule.polygonStrokeColor);
            this.handleShapeTool(elementId + '_shape_pentagon');
            break;
        }
        // this.pdfViewer.clearSelection();
    };

    private onCalibrateToolbarClicked(args: ClickEventArgs): void {
        const elementId: string = this.pdfViewer.element.id;
        const measureModule: MeasureAnnotation = this.pdfViewer.annotation.measureAnnotationModule;
        this.deselectAllItems();
        this.deselectAllItemsForMobile();
        this.resetFreeTextAnnot();
        if (Browser.isDevice && !isBlazor()) {
            const element: any = args.originalEvent.target;
            this.pdfViewer.toolbarModule.selectItem(element.parentElement);
        }
        switch ((args.originalEvent.target as HTMLElement).id) {
        case elementId + '_calibrate_distance':
        case elementId + '_calibrate_distanceIcon':
            measureModule.setAnnotationType('Distance');
            this.onShapeDrawSelection(false);
            this.updateColorInIcon(this.colorDropDownElement, measureModule.distanceFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, measureModule.distanceStrokeColor);
            this.handleShapeTool(elementId + '_calibrate_distance');
            break;
        case elementId + '_calibrate_perimeter':
        case elementId + '_calibrate_perimeterIcon':
            measureModule.setAnnotationType('Perimeter');
            this.onShapeDrawSelection(false);
            this.updateColorInIcon(this.colorDropDownElement, measureModule.perimeterFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, measureModule.perimeterStrokeColor);
            this.handleShapeTool(elementId + '_calibrate_perimeter');
            break;
        case elementId + '_calibrate_area':
        case elementId + '_calibrate_areaIcon':
            measureModule.setAnnotationType('Area');
            this.onShapeDrawSelection(false);
            this.updateColorInIcon(this.colorDropDownElement, measureModule.areaFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, measureModule.areaStrokeColor);
            this.handleShapeTool(elementId + '_calibrate_area');
            break;
        case elementId + '_calibrate_radius':
        case elementId + '_calibrate_radiusIcon':
            measureModule.setAnnotationType('Radius');
            this.onShapeDrawSelection(false);
            this.updateColorInIcon(this.colorDropDownElement, measureModule.radiusFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, measureModule.radiusStrokeColor);
            this.handleShapeTool(elementId + '_calibrate_radius');
            break;
        case elementId + '_calibrate_volume':
        case elementId + '_calibrate_volumeIcon':
            measureModule.setAnnotationType('Volume');
            this.onShapeDrawSelection(false);
            this.updateColorInIcon(this.colorDropDownElement, measureModule.volumeFillColor);
            this.updateColorInIcon(this.strokeDropDownElement, measureModule.volumeStrokeColor);
            this.handleShapeTool(elementId + '_calibrate_volume');
            break;
        }
    }

    private onShapeDrawSelection(isShape: boolean): void {
        if (!Browser.isDevice) {
            this.updateInteractionTools();
            this.enableAnnotationPropertiesTools(true);
            if (isShape) {
                this.shapeDropDown.toggle();
            } else {
                this.calibrateDropDown.toggle();
            }
        }
        this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
        this.pdfViewer.annotation.triggerSignatureUnselectEvent();
    }

    private afterCalibrateToolbarCreationForMobile(): void {
        this.primaryToolbar.addClassToolbarItem('_calibrate_distance', 'e-pv-calibrate-distance', this.pdfViewer.localeObj.getConstant('Calibrate Distance'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_perimeter', 'e-pv-calibrate-perimeter', this.pdfViewer.localeObj.getConstant('Calibrate Perimeter'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_area', 'e-pv-calibrate-area', this.pdfViewer.localeObj.getConstant('Calibrate Area'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_radius', 'e-pv-calibrate-radius', this.pdfViewer.localeObj.getConstant('Calibrate Radius'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_volume', 'e-pv-calibrate-volume', this.pdfViewer.localeObj.getConstant('Calibrate Volume'));
    }

    private afterShapeToolbarCreationForMobile(): void {
        this.primaryToolbar.addClassToolbarItem('_annotation_color', 'e-pv-annotation-color-container', this.pdfViewer.localeObj.getConstant('Change Color'));
        this.primaryToolbar.addClassToolbarItem('_annotation_stroke', 'e-pv-annotation-stroke-container', this.pdfViewer.localeObj.getConstant('Change Stroke Color'));
        this.primaryToolbar.addClassToolbarItem('_annotation_thickness', 'e-pv-annotation-thickness-container', this.pdfViewer.localeObj.getConstant('Chnage Border Thickness'));
        this.primaryToolbar.addClassToolbarItem('_annotation_opacity', 'e-annotation-opacity-container', this.pdfViewer.localeObj.getConstant('Change Opacity'));
        this.primaryToolbar.addClassToolbarItem('_shape_line', 'e-pv-shape-line', this.pdfViewer.localeObj.getConstant('Add line'));
        this.primaryToolbar.addClassToolbarItem('_shape_arrow', 'e-pv-shape-arrow', this.pdfViewer.localeObj.getConstant('Add arrow'));
        this.primaryToolbar.addClassToolbarItem('_shape_rectangle', 'e-pv-shape-rectangle', this.pdfViewer.localeObj.getConstant('Add rectangle'));
        this.primaryToolbar.addClassToolbarItem('_shape_circle', 'e-pv-shape-circle', this.pdfViewer.localeObj.getConstant('Add circle'));
        this.primaryToolbar.addClassToolbarItem('_shape_pentagon', 'e-pv-shape-pentagon', this.pdfViewer.localeObj.getConstant('Add polygon'));
    }

    private afterShapeToolbarCreation(): void {
        this.lineElement = this.primaryToolbar.addClassToolbarItem('_shape_line', 'e-pv-shape-line', this.pdfViewer.localeObj.getConstant('Add line'));
        this.arrowElement = this.primaryToolbar.addClassToolbarItem('_shape_arrow', 'e-pv-shape-arrow', this.pdfViewer.localeObj.getConstant('Add arrow'));
        this.rectangleElement = this.primaryToolbar.addClassToolbarItem('_shape_rectangle', 'e-pv-shape-rectangle', this.pdfViewer.localeObj.getConstant('Add rectangle'));
        this.circleElement = this.primaryToolbar.addClassToolbarItem('_shape_circle', 'e-pv-shape-circle', this.pdfViewer.localeObj.getConstant('Add circle'));
        this.polygonElement = this.primaryToolbar.addClassToolbarItem('_shape_pentagon', 'e-pv-shape-pentagon', this.pdfViewer.localeObj.getConstant('Add polygon'));
    }

    private afterCalibrateToolbarCreation(): void {
        this.calibrateDistance = this.primaryToolbar.addClassToolbarItem('_calibrate_distance', 'e-pv-calibrate-distance', this.pdfViewer.localeObj.getConstant('Calibrate Distance'));
        this.calibratePerimeter = this.primaryToolbar.addClassToolbarItem('_calibrate_perimeter', 'e-pv-calibrate-perimeter', this.pdfViewer.localeObj.getConstant('Calibrate Perimeter'));
        this.calibrateArea = this.primaryToolbar.addClassToolbarItem('_calibrate_area', 'e-pv-calibrate-area', this.pdfViewer.localeObj.getConstant('Calibrate Area'));
        this.calibrateRadius = this.primaryToolbar.addClassToolbarItem('_calibrate_radius', 'e-pv-calibrate-radius', this.pdfViewer.localeObj.getConstant('Calibrate Radius'));
        this.calibrateVolume = this.primaryToolbar.addClassToolbarItem('_calibrate_volume', 'e-pv-calibrate-volume', this.pdfViewer.localeObj.getConstant('Calibrate Volume'));
    }

    private afterMobileToolbarCreation(): void {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.shapesItem = this.primaryToolbar.addClassToolbarItem('_annotation_shapes', 'e-pv-annotation-shapes', this.pdfViewer.localeObj.getConstant('Add Shapes'));
        this.calibrateItem = this.primaryToolbar.addClassToolbarItem('_annotation_calibrate', 'e-pv-annotation-calibrate', this.pdfViewer.localeObj.getConstant('Calibrate'));
        this.freeTextEditItem = this.primaryToolbar.addClassToolbarItem('_annotation_freeTextEdit', 'e-pv-annotation-freeTextEdit', this.pdfViewer.localeObj.getConstant('Free Text'));
        this.commentItem = this.primaryToolbar.addClassToolbarItem('_comment', 'e-pv-comment', this.pdfViewer.localeObj.getConstant('Add Comments'));
        this.commentItem = this.primaryToolbar.addClassToolbarItem('_annotation_commentPanel', 'e-pv-annotation-comment-panel', this.pdfViewer.localeObj.getConstant('Comment Panel') + (isMac ? ' (⌘+⌥+0)' : ' (Ctrl+Alt+0)'));
        this.inkAnnotationItem = this.primaryToolbar.addClassToolbarItem('_annotation_ink', 'e-pv-annotation-ink', this.pdfViewer.localeObj.getConstant('Draw Ink'));
        this.selectAnnotationDeleteItem(false);
        this.enableCommentPanelTool(this.pdfViewer.enableCommentPanel);
    }

    private createColorPicker(idString: string): ColorPicker {
        let inputElement: HTMLElement;
        const existingInput: HTMLElement = document.getElementById(idString + '_target');
        if (existingInput) {
            inputElement = existingInput;
        } else {
            inputElement = createElement('input', { id: idString + '_target' });
        }
        document.body.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            value: '#000000', showButtons: false, modeSwitcher: false
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }

    private onColorPickerChange(args: any): void {
        let currentColor: any;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        } else {
            currentColor = args[0];
        }
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(currentColor);
            } else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                case 'Highlight':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor = currentColor;
                    break;
                case 'Underline':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor = currentColor;
                    break;
                case 'Strikethrough':
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor = currentColor;
                    break;
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (isBlazor()) {
                if (args[0] !== args[1]) {
                    this.pdfViewer.annotation.modifyFillColor(currentColor);
                }
            } else {
                if (args.currentValue.hex !== args.previousValue.hex) {
                    this.pdfViewer.annotation.modifyFillColor(currentColor);
                }
            }
        } else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.pdfViewer.annotation.shapeAnnotationModule.lineFillColor = currentColor;
                    break;
                case 'Arrow':
                    this.pdfViewer.annotation.shapeAnnotationModule.arrowFillColor = currentColor;
                    break;
                case 'Rectangle':
                    this.pdfViewer.annotation.shapeAnnotationModule.rectangleFillColor = currentColor;
                    break;
                case 'Circle':
                    this.pdfViewer.annotation.shapeAnnotationModule.circleFillColor = currentColor;
                    break;
                case 'Polygon':
                    this.pdfViewer.annotation.shapeAnnotationModule.polygonFillColor = currentColor;
                    break;
                }
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.fillColor = currentColor;
                if (this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.annotation.freeTextAnnotationModule.fillColor = currentColor;
                }
            }
        }
        if (isBlazor()) {
            this.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
            this.updateColorInIcon(this.colorDropDownElementInBlazor, currentColor);
        } else {
            this.updateColorInIcon(this.colorDropDownElement, currentColor);
            this.colorDropDown.toggle();
        }
    }

    private onStrokePickerChange(args: any): void {
        let currentColor: any;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        } else {
            currentColor = args[0];
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (isBlazor()) {
                if (args[0] !== args[1]) {
                    this.pdfViewer.annotation.modifyStrokeColor(currentColor);
                }
            } else {
                if (args.currentValue.hex !== args.previousValue.hex) {
                    this.pdfViewer.annotation.modifyStrokeColor(currentColor);
                }
            }
        } else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.pdfViewer.annotation.shapeAnnotationModule.lineStrokeColor = currentColor;
                    break;
                case 'Arrow':
                    this.pdfViewer.annotation.shapeAnnotationModule.arrowStrokeColor = currentColor;
                    break;
                case 'Rectangle':
                    this.pdfViewer.annotation.shapeAnnotationModule.rectangleStrokeColor = currentColor;
                    break;
                case 'Circle':
                    this.pdfViewer.annotation.shapeAnnotationModule.circleStrokeColor = currentColor;
                    break;
                case 'Polygon':
                    this.pdfViewer.annotation.shapeAnnotationModule.polygonStrokeColor = currentColor;
                    break;
                }
            }
            const annotationModule: Annotation = this.pdfViewer.annotation;
            if (annotationModule && annotationModule.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.strokeColor = currentColor;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.strokeColor = currentColor;
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                this.pdfViewer.annotation.freeTextAnnotationModule.borderColor = currentColor;
            }
        }
        if (isBlazor()) {
            this.strokeDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-stroke-container');
            this.updateColorInIcon(this.strokeDropDownElementInBlazor, currentColor);
        } else {
            this.updateColorInIcon(this.strokeDropDownElement, currentColor);
            this.strokeDropDown.toggle();
        }
    }

    /**
     * @param {HTMLElement} element - It describes about the element
     * @param {string} color - It describes about the color
     * @private
     * @returns {void}
     */
    public updateColorInIcon(element: HTMLElement, color: string): void {
        if (isBlazor()) {
            if (element) {
                (element.children[0] as HTMLElement).style.borderBottomColor = color;
            }
        } else {
            if (element) {
                if (element.childNodes[0] as HTMLElement) {
                    (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
                }
            }
        }
    }

    /**
     * @param {string} currentOption - It describes about the current option
     * @private
     * @returns {void}
     */
    public updateTextPropertySelection(currentOption: string): void {
        if (currentOption === 'bold') {
            document.getElementById(this.pdfViewer.element.id + '_bold').classList.toggle('textprop-option-active');
        } else if (currentOption === 'italic') {
            document.getElementById(this.pdfViewer.element.id + '_italic').classList.toggle('textprop-option-active');
        } else if (currentOption === 'underline') {
            document.getElementById(this.pdfViewer.element.id + '_underline_textinput').classList.toggle('textprop-option-active');
            document.getElementById(this.pdfViewer.element.id + '_strikeout').classList.remove('textprop-option-active');
        } else if (currentOption === 'strikeout') {
            document.getElementById(this.pdfViewer.element.id + '_strikeout').classList.toggle('textprop-option-active');
            document.getElementById(this.pdfViewer.element.id + '_underline_textinput').classList.remove('textprop-option-active');
        }
    }

    /**
     * @param {string} family - It describes about the family value
     * @private
     * @returns {void}
     */
    public updateFontFamilyInIcon(family: string): void {
        this.fontFamily.value = family;
    }

    /**
     * @param {string} align - It describes about the align
     * @private
     * @returns {void}
     */
    public updateTextAlignInIcon(align: string): void {
        let className: string = 'e-btn-icon e-pv-left-align-icon e-pv-icon';
        const leftAlign: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_left_align');
        const rightAlign: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_right_align');
        const centerAlign: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_center_align');
        const justifyAlign: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_justify_align');
        if (!isBlazor()) {
            leftAlign.classList.remove('textprop-option-active');
            rightAlign.classList.remove('textprop-option-active');
            centerAlign.classList.remove('textprop-option-active');
            justifyAlign.classList.remove('textprop-option-active');
        }
        if (align === 'Left') {
            leftAlign.classList.add('textprop-option-active');
        } else if (align === 'Right') {
            className = 'e-btn-icon e-pv-right-align-icon e-pv-icon';
            rightAlign.classList.add('textprop-option-active');
        } else if (align === 'Center') {
            className = 'e-btn-icon e-pv-center-align-icon e-pv-icon';
            centerAlign.classList.add('textprop-option-active');
        } else if (align === 'Justify') {
            className = 'e-btn-icon e-pv-justfiy-align-icon e-pv-icon';
            justifyAlign.classList.add('textprop-option-active');
        }
        document.getElementById(this.pdfViewer.element.id + '_annotation_textalign').children[0].className = className;
    }

    /**
     * @param {number} size - It describes about the size value
     * @private
     * @returns {void}
     */
    public updateFontSizeInIcon(size: number): void {
        if (isNullOrUndefined(this.fontSize) && this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.handleFontSizeUpdate(size);
        }
        else {
            this.fontSize.value = size + 'px';
        }
    }

    private updateOpacityIndicator(): void {
        this.opacityIndicator.textContent = parseInt(Math.round(this.opacitySlider.value as number).toString(), 10) + '%';
    }

    private updateThicknessIndicator(): void {
        this.thicknessIndicator.textContent = this.thicknessSlider.value + ' pt';
    }

    private createSlider(idString: string): HTMLElement {
        const outerContainer: HTMLElement = createElement('div', { className: 'e-pv-annotation-opacity-popup-container' });
        document.body.appendChild(outerContainer);
        const label: HTMLElement = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-opacity-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Opacity');
        const sliderElement: HTMLElement = createElement('div', { id: idString + '_slider' });
        this.opacitySlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-opacity-slider', max: 100, min: 0 });
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

    private createThicknessSlider(idString: string): HTMLElement {
        const outerContainer: HTMLElement = createElement('div', { className: 'e-pv-annotation-thickness-popup-container' });
        document.body.appendChild(outerContainer);
        const label: HTMLElement = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-thickness-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Line Thickness');
        const sliderElement: HTMLElement = createElement('div', { id: idString + '_slider' });
        this.thicknessSlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-thickness-slider', max: 12, min: 0 });
        this.thicknessIndicator = createElement('div', { id: idString + '_thickness_indicator', className: 'e-pv-annotation-thickness-indicator' });
        this.thicknessIndicator.textContent = '0 pt';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(this.thicknessIndicator);
        } else {
            outerContainer.appendChild(this.thicknessIndicator);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.enableRtl = true;
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(label);
        }
        this.thicknessSlider.element.parentElement.classList.add('e-pv-annotation-thickness-slider-container');
        return outerContainer;
    }

    private afterToolbarCreation(): void {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_annotation_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete') + (' (delete)'));
        this.freeTextEditItem = this.primaryToolbar.addClassToolbarItem('_annotation_freeTextEdit', 'e-pv-annotation-freeTextEdit', this.pdfViewer.localeObj.getConstant('Free Text'));
        this.inkAnnotationItem = this.primaryToolbar.addClassToolbarItem('_annotation_ink', 'e-pv-annotation-ink', this.pdfViewer.localeObj.getConstant('Draw Ink'));
        this.pdfViewerBase.getElement('_annotation_shapes').setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Add Shapes'));
        this.pdfViewerBase.getElement('_annotation_calibrate').setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Calibrate'));
        this.pdfViewerBase.getElement('_comment').setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Add Comments'));
        this.commentItem = this.primaryToolbar.addClassToolbarItem('_annotation_commentPanel', 'e-pv-annotation-comment-panel', this.pdfViewer.localeObj.getConstant('Comment Panel') + (isMac ? ' (⌘+⌥+0)' : ' (Ctrl+Alt+0)'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_annotation_close', 'e-pv-annotation-tools-close', null);
        this.pdfViewerBase.getElement('_annotation_close').setAttribute('aria-label', 'Close Annotation Toolbar');
        this.selectAnnotationDeleteItem(false);
        this.enableTextMarkupAnnotationPropertiesTools(false);
        this.enableCommentPanelTool(this.pdfViewer.enableCommentPanel);
    }

    private onToolbarClicked(args: ClickEventArgs): void {
        const annotation: any = this.pdfViewer.selectedItems.annotations[0];
        if ((args.originalEvent.target as HTMLElement).id) {
            this.pdfViewer.toolbarModule.updateStampItems();
        }
        const isKeyBoardEvent: boolean = args.originalEvent && (args.originalEvent as any).pointerType !== 'mouse' && (args.originalEvent as any).pointerType !== 'touch';
        this.pdfViewer.toolbarModule.deSelectCommentAnnotation();
        switch ((args.originalEvent.target as HTMLElement).id) {
        case this.pdfViewer.element.id + '_highlight':
        case this.pdfViewer.element.id + '_highlightIcon':
            this.pdfViewer.tool = '';
            if (!Browser.isDevice) {
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleHighlight();
            } else {
                if (!this.isMobileHighlightEnabled) {
                    this.pdfViewer.annotationModule.setAnnotationMode('Highlight');
                    this.primaryToolbar.selectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                    this.textMarkupForMobile(args);
                    this.isMobileHighlightEnabled = true;
                    this.isMobileUnderlineEnabled = false;
                    this.isMobileStrikethroughEnabled = false;
                }
                else {
                    this.deselectAllItemsForMobile();
                    this.pdfViewer.annotationModule.setAnnotationMode('None');
                }
            }
            this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
            this.pdfViewer.annotation.triggerSignatureUnselectEvent();
            break;
        case this.pdfViewer.element.id + '_underline':
        case this.pdfViewer.element.id + '_underlineIcon':
            this.pdfViewer.tool = '';
            if (!Browser.isDevice) {
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleUnderline();
            } else {
                if (!this.isMobileUnderlineEnabled) {
                    this.pdfViewer.annotationModule.setAnnotationMode('Underline');
                    this.primaryToolbar.selectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                    this.textMarkupForMobile(args);
                    this.isMobileUnderlineEnabled = true;
                    this.isMobileHighlightEnabled = false;
                    this.isMobileStrikethroughEnabled = false;
                }
                else {
                    this.deselectAllItemsForMobile();
                    this.pdfViewer.annotationModule.setAnnotationMode('None');
                }
            }
            this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
            this.pdfViewer.annotation.triggerSignatureUnselectEvent();
            break;
        case this.pdfViewer.element.id + '_strikethrough':
        case this.pdfViewer.element.id + '_strikethroughIcon':
            this.pdfViewer.tool = '';
            if (!Browser.isDevice) {
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleStrikethrough();
            } else {
                if (!this.isMobileStrikethroughEnabled) {
                    this.pdfViewer.annotationModule.setAnnotationMode('Strikethrough');
                    this.primaryToolbar.selectItem(this.strikethroughItem);
                    this.primaryToolbar.deSelectItem(this.highlightItem);
                    this.primaryToolbar.deSelectItem(this.underlineItem);
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                    this.textMarkupForMobile(args);
                    this.isMobileStrikethroughEnabled = true;
                    this.isMobileUnderlineEnabled = false;
                    this.isMobileHighlightEnabled = false;
                }
                else {
                    this.deselectAllItemsForMobile();
                    this.pdfViewer.annotationModule.setAnnotationMode('None');
                }
            }
            this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
            this.pdfViewer.annotation.triggerSignatureUnselectEvent();
            break;
        case this.pdfViewer.element.id + '_annotation_delete':
        case this.pdfViewer.element.id + '_annotation_deleteIcon':
            this.pdfViewer.annotationModule.deleteAnnotation();
            this.resetFreeTextAnnot();
            break;
        case this.pdfViewer.element.id + '_annotation_commentPanel':
        case this.pdfViewer.element.id + '_annotation_commentPanelIcon': {
            this.inkAnnotationSelected = false;
            const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (commentPanel.style.display === 'block') {
                this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
            } else {
                this.pdfViewer.annotationModule.showCommentsPanel();
                if (isKeyBoardEvent && !isNullOrUndefined(commentPanel.firstElementChild) &&
                        !isNullOrUndefined(commentPanel.firstElementChild.lastElementChild) &&
                        commentPanel.firstElementChild.lastElementChild instanceof HTMLButtonElement) {
                    commentPanel.firstElementChild.lastElementChild.focus();
                }
            }
            break;
        }
        case this.pdfViewer.element.id + '_annotation_close':
        case this.pdfViewer.element.id + '_annotation_closeIcon': {
            this.inkAnnotationSelected = false;
            const commentsPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentsPanel.style.display === 'block') {
                this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
            }
            this.showAnnotationToolbar(this.primaryToolbar.annotationItem);
            break;
        }
        case this.pdfViewer.element.id + '_annotation_freeTextEdit':
        case this.pdfViewer.element.id + '_annotation_freeTextEditIcon':
            if (!Browser.isDevice) {
                this.resetFreeTextAnnot();
                this.handleFreeTextEditor();
            } else {
                this.pdfViewer.annotationModule.setAnnotationMode('FreeText');
                this.FreeTextForMobile();
            }
            break;
        case this.pdfViewer.element.id + '_annotation_signature':
        case this.pdfViewer.element.id + '_annotation_signatureIcon':
            this.inkAnnotationSelected = false;
            this.updateSignatureCount();
            break;
        case this.pdfViewer.element.id + '_annotation_ink':
        case this.pdfViewer.element.id + '_annotation_inkIcon':
            if (annotation) {
                this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
                this.pdfViewer.annotation.triggerSignatureUnselectEvent();
            }
            this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
            if (this.pdfViewer.annotationModule.inkAnnotationModule) {
                const currentPageNumber: string = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
                if (currentPageNumber && currentPageNumber !== '') {
                    this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber, 10));
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
            }
            if (!this.inkAnnotationSelected) {
                this.deselectAllItems();
                this.deselectAllItemsForMobile();
                this.drawInkAnnotation();
            } else {
                this.inkAnnotationSelected = false;
            }
            break;
        case this.pdfViewer.element.id + '_annotation_shapesIcon':
        case this.pdfViewer.element.id + '_annotation_shapes':
            if (Browser.isDevice) {
                this.shapeToolMobile(args);
            }
            break;
        case this.pdfViewer.element.id + '_annotation_calibrateIcon':
        case this.pdfViewer.element.id + '_annotation_calibrate':
            if (Browser.isDevice) {
                this.calibrateToolMobile(args);
            }
            break;
        case this.pdfViewer.element.id + '_commentIcon':
        case this.pdfViewer.element.id + '_comment': {
            this.pdfViewerBase.isAddComment = true;
            this.pdfViewerBase.isCommentIconAdded = true;
            const commentsButton: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_comment');
            this.deselectAllItemsForMobile();
            commentsButton.classList.add('e-pv-select');
            this.pdfViewer.toolbarModule.addComments(args);
            break;
        }
        }
    }

    private addInkAnnotation(): void {
        this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
        if (this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: string = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber, 10));
                if (!isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                } else {
                    this.primaryToolbar.deSelectItem(this.InkAnnotationElement);
                    this.pdfViewerBase.focusViewerContainer();
                }
            }
        }
        if (!this.inkAnnotationSelected) {
            this.deselectAllItemsInBlazor();
            this.drawInkAnnotation();
        } else {
            this.inkAnnotationSelected = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public deselectInkAnnotation(): void {
        if (!isBlazor()) {
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
        } else {
            this.primaryToolbar.deSelectItem(this.InkAnnotationElement);
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private drawInkAnnotation(): void {
        this.inkAnnotationSelected = true;
        if (!isBlazor()) {
            this.primaryToolbar.selectItem(this.inkAnnotationItem);
        } else {
            this.primaryToolbar.selectItem(this.InkAnnotationElement);
        }
        this.enableSignaturePropertiesTools(true);
        this.pdfViewerBase.isToolbarInkClicked = true;
        this.pdfViewer.annotationModule.inkAnnotationModule.drawInk();
    }

    public resetFreeTextAnnot(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
            this.pdfViewer.annotation.freeTextAnnotationModule.isNewFreeTextAnnot = false;
            this.pdfViewer.annotation.freeTextAnnotationModule.isNewAddedAnnot = false;
            if (!Browser.isDevice) {
                if (this.freeTextEditItem && !isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                }
                else if (isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.FreeTextElement);
                }
                this.enableFreeTextAnnotationPropertiesTools(false);
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: string = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber, 10));
                if (!isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                } else {
                    this.primaryToolbar.deSelectItem(this.InkAnnotationElement);
                }
            }
        }
        this.inkAnnotationSelected = false;
    }

    private updateInkannotationItems(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule && this.inkAnnotationSelected) {
            const currentPageNumber: any = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber, 10));
                this.pdfViewerBase.isToolbarInkClicked = true;
                this.pdfViewer.tool = 'Ink';
                this.pdfViewer.clearSelection(currentPageNumber);
            }
        }
    }

    private showSignaturepanel(): void {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.pdfViewerBase.signatureModule.showSignatureDialog(true);
    }

    private handleFreeTextEditor(): void {
        const annotation: any = this.pdfViewer.selectedItems.annotations[0];
        this.enableFreeTextAnnotationPropertiesTools(true);
        if (annotation) {
            this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
            this.pdfViewer.fireSignatureUnselect(annotation.annotName, annotation.pageIndex, annotation);
        }
        this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.isStrikethroughEnabled = false;
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        const freeTextAnnotationModule: FreeTextAnnotation = this.pdfViewer.annotation.freeTextAnnotationModule;
        freeTextAnnotationModule.setAnnotationType('FreeText');
        freeTextAnnotationModule.isNewFreeTextAnnot = true;
        freeTextAnnotationModule.isNewAddedAnnot = true;
        this.updateInteractionTools();
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.primaryToolbar.selectItem(this.freeTextEditItem);
        this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.fillColor);
        this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.borderColor);
        this.updateColorInIcon(this.fontColorElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.fontColor);
        this.updateFontFamilyInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.fontFamily);
        this.updateFontSizeInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.fontSize);
        this.updateTextAlignInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.textAlign);
        this.updateFontFamily();
    }

    private updateFontFamily(): void {
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold) {
            this.updateFontFamilyIcon('_bold', true);
        } else {
            this.updateFontFamilyIcon('_bold', false);
        }
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic) {
            this.updateFontFamilyIcon('_italic', true);
        } else {
            this.updateFontFamilyIcon('_italic', false);
        }
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline) {
            this.updateFontFamilyIcon('_underline_textinput', true);
            this.updateFontFamilyIcon('_strikeout', false);
        } else {
            this.updateFontFamilyIcon('_underline_textinput', false);
        }
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough) {
            this.updateFontFamilyIcon('_strikeout', true);
            this.updateFontFamilyIcon('_underline_textinput', false);
        } else {
            this.updateFontFamilyIcon('_strikeout', false);
        }
    }

    private updateFontFamilyIcon(fontFamily: string, isActive: boolean): void {
        const fontFamilyElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + fontFamily);
        if (isActive) {
            fontFamilyElement.classList.add('textprop-option-active');
        } else {
            fontFamilyElement.classList.remove('textprop-option-active');
        }
    }

    /**
     * @param {HTMLElement} element - It describes about the element value
     * @param {boolean} isInitialLoading - It describes about the isInitialLoading boolean value
     * @private
     * @returns {void}
     */
    public showAnnotationToolbar(element?: HTMLElement, isInitialLoading?: boolean, isShow?: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!this.isToolbarHidden) {
                const annotationModule: any = this.pdfViewer.annotationModule;
                if (element) {
                    this.primaryToolbar.deSelectItem(element);
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.deSelectItem(this.primaryToolbar.annotationItem);
                    }
                }
                this.adjustViewer(false);
                if (annotationModule && annotationModule.textMarkupAnnotationModule &&
                    annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                    this.enablePropertiesTool(annotationModule);
                } else {
                    this.deselectAllItems();
                    this.deselectAllItemsForMobile();
                }
                this.toolbarElement.style.display = 'none';
                if (!isInitialLoading) {
                    this.pdfViewer.isAnnotationToolbarVisible = false;
                }
                if (this.pdfViewerBase.isPanMode) {
                    this.primaryToolbar.updateInteractionTools(false);
                } else {
                    this.primaryToolbar.updateInteractionTools(true);
                }
            } else {
                let toolBarInitialStatus: string;
                if (this.toolbarElement) {
                    toolBarInitialStatus = this.toolbarElement.style.display;
                    this.toolbarElement.style.display = 'block';
                }
                if (!isInitialLoading) {
                    this.pdfViewer.isAnnotationToolbarVisible = true;
                }
                if (element) {
                    this.primaryToolbar.selectItem(element);
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.selectItem(this.primaryToolbar.annotationItem);
                    }
                }
                if (toolBarInitialStatus === 'none') {
                    this.adjustViewer(true);
                }
            }
            if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
                this.pdfViewer.magnification.fitToPage();
            }
            this.enableAnnotationAddTools(true);
            this.isToolbarHidden = !this.isToolbarHidden;
        }
        else {
            const editIconId: string = this.pdfViewer.element.id + '_annotationIcon';
            const editIcon: HTMLElement = document.getElementById(editIconId);
            if (editIcon.parentElement.classList.contains('e-pv-select') && !isShow || (!editIcon.parentElement.classList.contains('e-pv-select') && isShow)) {
                this.createAnnotationToolbarForMobile(editIconId);
                this.pdfViewer.isAnnotationToolbarVisible = isShow;
            }
        }
    }

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
        this.enableTextMarkupAnnotationPropertiesTools(true);
        this.updateColorInIcon(this.colorDropDownElement, annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color);
        this.selectAnnotationDeleteItem(true);
    }

    /**
     * @private
     * @returns {void}
     */
    public applyAnnotationToolbarSettings(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('HighlightTool') !== -1) {
                this.showHighlightTool(true, 0, 0);
            } else {
                this.showHighlightTool(false, 0, 0);
            }
            if (annotationToolbarItems.indexOf('UnderlineTool') !== -1) {
                this.showUnderlineTool(true, 1, 1);
            } else {
                this.showUnderlineTool(false, 1, 1);
            }
            if (annotationToolbarItems.indexOf('StrikethroughTool') !== -1) {
                this.showStrikethroughTool(true, 2, 2);
            } else {
                this.showStrikethroughTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('ShapeTool') !== -1) {
                this.showShapeAnnotationTool(true, 4, 4);
            } else {
                this.showShapeAnnotationTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('CalibrateTool') !== -1) {
                this.showCalibrateAnnotationTool(true, 6, 6);
            } else {
                this.showCalibrateAnnotationTool(false, 6, 6);
            }
            if (annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true, 22, 22);
            } else {
                this.showColorEditTool(false, 22, 22);
            }
            if (annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true, 23, 23);
            } else {
                this.showStrokeColorEditTool(false, 23, 23);
            }
            if (annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true, 24, 24);
            } else {
                this.showThicknessEditTool(false, 24, 24);
            }
            if (annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true, 25, 25);
            } else {
                this.showOpacityEditTool(false, 25, 25);
            }
            if (annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true, 27, 27);
            } else {
                this.showAnnotationDeleteTool(false, 27, 27);
            }
            if (annotationToolbarItems.indexOf('StampAnnotationTool') !== -1) {
                this.showStampAnnotationTool(true, 10, 10);
            } else {
                this.showStampAnnotationTool(false, 10, 10);
            }
            if (annotationToolbarItems.indexOf('HandWrittenSignatureTool') !== -1) {
                this.showSignatureTool(true, 12, 12);
            } else {
                this.showSignatureTool(false, 12, 12);
            }
            if (annotationToolbarItems.indexOf('FreeTextAnnotationTool') !== -1) {
                this.showFreeTextAnnotationTool(true, 8, 8);
            } else {
                this.showFreeTextAnnotationTool(false, 8, 8);
            }
            if (annotationToolbarItems.indexOf('FontFamilyAnnotationTool') !== -1) {
                this.showFontFamilyAnnotationTool(true, 16, 16);
            } else {
                this.showFontFamilyAnnotationTool(false, 16, 16);
            }
            if (annotationToolbarItems.indexOf('FontSizeAnnotationTool') !== -1) {
                this.showFontSizeAnnotationTool(true, 17, 17);
            } else {
                this.showFontSizeAnnotationTool(false, 17, 17);
            }
            if (annotationToolbarItems.indexOf('FontStylesAnnotationTool') !== -1) {
                this.showFontStylesAnnotationTool(true, 20, 20);
            } else {
                this.showFontStylesAnnotationTool(false, 20, 20);
            }
            if (annotationToolbarItems.indexOf('FontAlignAnnotationTool') !== -1) {
                this.showFontAlignAnnotationTool(true, 19, 19);
            } else {
                this.showFontAlignAnnotationTool(false, 19, 19);
            }
            if (annotationToolbarItems.indexOf('FontColorAnnotationTool') !== -1) {
                this.showFontColorAnnotationTool(true, 18, 18);
            } else {
                this.showFontColorAnnotationTool(false, 18, 18);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 28, 28);
            } else {
                this.showCommentPanelTool(false, 28, 28);
            }
            this.showInkAnnotationTool();
            this.showSeparator();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applyMobileAnnotationToolbarSettings(): void {
        const annotationToolbarItems: any = this.pdfViewer.toolbarSettings.annotationToolbarItems;
        if (annotationToolbarItems) {
            if (annotationToolbarItems.indexOf('HighlightTool') !== -1) {
                this.showHighlightTool(true, 2, 2);
            } else {
                this.showHighlightTool(false, 2, 2);
            }
            if (annotationToolbarItems.indexOf('UnderlineTool') !== -1) {
                this.showUnderlineTool(true, 3, 3);
            } else {
                this.showUnderlineTool(false, 3, 3);
            }
            if (annotationToolbarItems.indexOf('StrikethroughTool') !== -1) {
                this.showStrikethroughTool(true, 4, 4);
            } else {
                this.showStrikethroughTool(false, 4, 4);
            }
            if (annotationToolbarItems.indexOf('ShapeTool') !== -1) {
                this.showShapeAnnotationTool(true, 6, 6);
            } else {
                this.showShapeAnnotationTool(false, 6, 6);
            }
            if (annotationToolbarItems.indexOf('CalibrateTool') !== -1) {
                this.showCalibrateAnnotationTool(true, 8, 8);
            } else {
                this.showCalibrateAnnotationTool(false, 8, 8);
            }
            const toolbarItems: any = this.pdfViewer.toolbarSettings.toolbarItems;
            if (toolbarItems && toolbarItems.indexOf('CommentTool') !== -1) {
                this.showStickyNoteToolInMobile(true);
            } else {
                this.showStickyNoteToolInMobile(false);
            }
            if (annotationToolbarItems.indexOf('StampAnnotationTool') !== -1) {
                this.showStampAnnotationTool(true, 12, 12);
            } else {
                this.showStampAnnotationTool(false, 12, 12);
            }
            if (annotationToolbarItems.indexOf('HandWrittenSignatureTool') !== -1) {
                this.showSignatureTool(true, 14, 14);
            } else {
                this.showSignatureTool(false, 14, 14);
            }
            if (annotationToolbarItems.indexOf('FreeTextAnnotationTool') !== -1) {
                this.showFreeTextAnnotationTool(true, 10, 10);
            } else {
                this.showFreeTextAnnotationTool(false, 10, 10);
            }
            if (annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true, 18, 18);
            } else {
                this.showCommentPanelTool(false, 18, 18);
            }
            if (annotationToolbarItems.indexOf('InkAnnotationTool') !== -1) {
                this.showInkTool(true, 16, 16);
            } else {
                this.showInkTool(false, 16, 16);
            }
            this.showSeparatorInMobile();
        }
    }

    private showStickyNoteToolInMobile(isShow: boolean): void {
        this.isCommentBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    }

    private showSeparatorInMobile(): void {
        if (!this.isCommentBtnVisible) {
            this.applyHideToToolbar(false, 1, 1);
        }
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)) {
            this.applyHideToToolbar(false, 5, 5);
        }
        if (!this.isShapeBtnVisible) {
            this.applyHideToToolbar(false, 7, 7);
        }
        if (!this.isCalibrateBtnVisible) {
            this.applyHideToToolbar(false, 9, 9);
        }
        if (!this.isFreeTextBtnVisible) {
            this.applyHideToToolbar(false, 11, 11);
        }
        if (!this.isStampBtnVisible) {
            this.applyHideToToolbar(false, 13, 13);
        }
        if (!this.isSignatureBtnVisible) {
            this.applyHideToToolbar(false, 15, 15);
        }
        if (!this.isInkBtnVisible) {
            this.applyHideToToolbar(false, 17, 17);
        }
    }

    private showInkAnnotationTool(): void {
        if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('InkAnnotationTool') !== -1) {
            this.showInkTool(true, 14, 14);
        } else {
            this.showInkTool(false, 14, 14);
        }
    }

    private showSeparator(): void {
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)) {
            this.applyHideToToolbar(false, 3, 3);
        }
        if (!this.isShapeBtnVisible) {
            this.applyHideToToolbar(false, 5, 5);
        }
        if (!this.isCalibrateBtnVisible) {
            this.applyHideToToolbar(false, 7, 7);
        }
        if (!this.isFreeTextBtnVisible) {
            this.applyHideToToolbar(false, 9, 9);
        }
        if (!this.isStampBtnVisible) {
            this.applyHideToToolbar(false, 11, 11);
        }
        if (!this.isSignatureBtnVisible) {
            this.applyHideToToolbar(false, 13, 13);
        }
        if (!this.isInkBtnVisible) {
            this.applyHideToToolbar(false, 15, 15);
        }
        if (!this.isFontFamilyToolVisible && !this.isFontSizeToolVisible && !this.isFontColorToolVisible &&
             !this.isFontAlignToolVisible && !this.isFontStylesToolVisible) {
            this.applyHideToToolbar(false, 21, 21);
        }
        if ((!this.isColorToolVisible && !this.isStrokeColorToolVisible && !this.isThicknessToolVisible &&
            !this.isOpacityToolVisible) || !this.isDeleteAnnotationToolVisible) {
            this.applyHideToToolbar(false, 26, 26);
        }
    }

    private showHighlightTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isHighlightBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showUnderlineTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isUnderlineBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showStrikethroughTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isStrikethroughBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showShapeAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isShapeBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showCalibrateAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isCalibrateBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showFreeTextAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFreeTextBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showStampAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isStampBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showSignatureTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isSignatureBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showInkTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isInkBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showFontFamilyAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFontFamilyToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showFontSizeAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFontSizeToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showFontAlignAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFontAlignToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showFontColorAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFontColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }
    private showFontStylesAnnotationTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isFontStylesToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showColorEditTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showStrokeColorEditTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isStrokeColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showThicknessEditTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isThicknessToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showOpacityEditTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isOpacityToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showAnnotationDeleteTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isDeleteAnnotationToolVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private showCommentPanelTool(isShow: boolean, startIndex: number, endIndex: number): void {
        this.isCommentPanelBtnVisible = isShow;
        this.applyHideToToolbar(isShow, startIndex, endIndex);
    }

    private applyHideToToolbar(show: boolean, startIndex: number, endIndex: number): void {
        const isHide: boolean = !show;
        for (let index: number = startIndex; index <= endIndex; index++) {
            let toolbar: Tool;
            const propertyToolbarElement: any = (this.propertyToolbar && this.propertyToolbar.element) ?
                this.propertyToolbar.element : null;
            const toolbarElement: any = (this.toolbar && this.toolbar.element) ? this.toolbar.element : null;
            if (toolbarElement && toolbarElement.children && toolbarElement.children.length > 0) {
                toolbar = this.toolbar;
            } else if (Browser.isDevice && propertyToolbarElement && propertyToolbarElement.children &&
                propertyToolbarElement.children.length > 0) {
                toolbar = this.propertyToolbar;
            }
            if (toolbar && toolbar.items[parseInt(index.toString(), 10)]) {
                const className: string = toolbar.items[parseInt(index.toString(), 10)].cssClass;
                if (className && className !== '') {
                    // Querying the toolbar item
                    const element: Element = toolbar.element.querySelector('.' + className);
                    if (element) {
                        this.toolbar.hideItem(element, isHide);
                    }
                } else {
                    toolbar.hideItem(index, isHide);
                }
            }
        }
    }

    /**
     * @param {boolean} isAdjust - It describes about the isAdjust boolean value
     * @private
     * @returns {void}
     */
    public adjustViewer(isAdjust: boolean): void {
        let splitterElement: HTMLElement;
        let toolbarContainer: HTMLElement;
        let annotationToolbarHeight: number;
        if (isBlazor()) {
            splitterElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            toolbarContainer = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            const annotationToolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-annotation-toolbar');
            annotationToolbarHeight = this.getToolbarHeight(annotationToolbarContainer);
        } else {
            splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
            toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
            annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        let toolbarHeight: number = this.getToolbarHeight(toolbarContainer);
        const sideBarToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
        const sideBarContentContainer: HTMLElement = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        const commentsContainer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelContainer;
        const commentPanelResizer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelResizer;
        let newToolbarHeight: string = '';
        if (isAdjust) {
            if (this.pdfViewer.enableToolbar) {
                if (!isNullOrUndefined(sideBarToolbar)) {
                    sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(sideBarContentContainer)) {
                    sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(splitterElement)) {
                    splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(commentsContainer)) {
                    commentsContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(commentPanelResizer)) {
                    commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                }
            } else {
                sideBarToolbar.style.top = (annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (annotationToolbarHeight) + 'px';
                splitterElement.style.top = (annotationToolbarHeight) + 'px';
                commentsContainer.style.top = (annotationToolbarHeight) + 'px';
                commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight + toolbarHeight)) + 'px';
            newToolbarHeight = this.getNavigationToolbarHeight(annotationToolbarHeight + toolbarHeight);
            if (!isNullOrUndefined(sideBarToolbar)) {
                sideBarToolbar.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(splitterElement)) {
                splitterElement.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(commentPanelResizer)) {
                commentPanelResizer.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(sideBarContentContainer)) {
                sideBarContentContainer.style.height = newToolbarHeight;
            }
        } else {
            if (this.pdfViewer.enableToolbar) {
                sideBarToolbar.style.top = toolbarHeight + 'px';
                sideBarContentContainer.style.top = toolbarHeight + 'px';
                splitterElement.style.top = toolbarHeight + 'px';
                commentsContainer.style.top = toolbarHeight + 'px';
                commentPanelResizer.style.top = toolbarHeight + 'px';
            } else {
                sideBarToolbar.style.top = 1 + 'px';
                sideBarToolbar.style.height = '100%';
                sideBarContentContainer.style.top = 1 + 'px';
                sideBarContentContainer.style.height = '100%';
                splitterElement.style.top = 1 + 'px';
                splitterElement.style.height = '100%';
                commentsContainer.style.top = 1 + 'px';
                commentsContainer.style.height = '100%';
                commentPanelResizer.style.top = 1 + 'px';
                commentPanelResizer.style.height = '100%';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            newToolbarHeight = this.getNavigationToolbarHeight(toolbarHeight);
            if (!isNullOrUndefined(sideBarToolbar)) {
                sideBarToolbar.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(splitterElement)) {
                splitterElement.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(commentPanelResizer)) {
                commentPanelResizer.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(sideBarContentContainer)) {
                sideBarContentContainer.style.height = newToolbarHeight;
            }
            if (this.pdfViewerBase.viewerContainer.style.height === '0px') {
                this.pdfViewerBase.viewerContainer.style.height = (parseInt(this.pdfViewer.element.style.height, 10) - parseInt(sideBarToolbar.style.top, 10)) + 'px';
            }
        }
    }

    private updateContentContainerHeight(isAdjust: boolean, isBlazor?: boolean): void {
        let annotationToolbarHeight: number;
        if (isBlazor) {
            const annotationToolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-annotation-toolbar');
            annotationToolbarHeight = this.getToolbarHeight(annotationToolbarContainer);
        } else {
            annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        const sideBarClientRect: ClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
        if (sideBarClientRect.height !== 0) {
            if (isAdjust) {
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height - annotationToolbarHeight + 'px';
            } else {
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height + annotationToolbarHeight + 'px';
            }
        }
    }

    private getToolbarHeight(element: HTMLElement): number {
        if (!isNullOrUndefined(element)) {
            let toolbarHeight: number = element.getBoundingClientRect().height;
            if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
                // getComputedStyle gets the value from style and toolbar border height is added to it.
                toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
            }
            return toolbarHeight;
        }
        return null;
    }

    private getNavigationToolbarHeight(toolbarHeight: number): string {
        const height: number = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    }

    private handleHighlight(): void {
        if (!this.isHighlightEnabled) {
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
            this.primaryToolbar.selectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor = null;
            this.setCurrentColorInPicker();
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
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
            this.primaryToolbar.selectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor = null;
            this.setCurrentColorInPicker();
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
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
            this.primaryToolbar.selectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor = null;
            this.setCurrentColorInPicker();
            this.updateColorInIcon(this.colorDropDownElement,
                                   this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
            this.isStrikethroughEnabled = true;
            this.isHighlightEnabled = false;
            this.isUnderlineEnabled = false;
        } else {
            this.deselectAllItems();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public deselectAllItemsInBlazor(): void {
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.showHideDropletDiv(true);
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
            this.primaryToolbar.deSelectItem(this.FreeTextElement);
            this.primaryToolbar.deSelectItem(this.InkAnnotationElement);
            this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateTextMarkupButtons', false, false, false);
        }
        this.resetFreeTextAnnot();
        this.clearTextMarkupMode();
        this.clearShapeMode();
        this.clearMeasureMode();
        this.pdfViewer.tool = '';
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.enableTextMarkupAnnotationPropertiesTools(false);
            this.enableFreeTextAnnotationPropertiesTools(false);
            this.updateColorInIcon(this.colorDropDownElement, '#000000');
            this.updateColorInIcon(this.strokeDropDownElement, '#000000');
            this.updateColorInIcon(this.fontColorElement, '#000000');
            this.selectAnnotationDeleteItem(false);
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public deselectAllItemsForMobile(): void {
        if (Browser.isDevice || !this.pdfViewer.enableDesktopMode) {
            const isBlazorPlatform: boolean = isBlazor();
            this.isMobileHighlightEnabled = false;
            this.isMobileUnderlineEnabled = false;
            this.isMobileStrikethroughEnabled = false;
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (!isBlazorPlatform) {
                this.primaryToolbar.deSelectItem(this.highlightItem);
                this.primaryToolbar.deSelectItem(this.underlineItem);
                this.primaryToolbar.deSelectItem(this.strikethroughItem);
                this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            }
            else {
                this.primaryToolbar.deSelectItem(this.highlightItem);
                this.primaryToolbar.deSelectItem(this.underlineItem);
                this.primaryToolbar.deSelectItem(this.strikethroughItem);
                this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            }
            this.resetFreeTextAnnot();
            this.clearTextMarkupMode();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.tool = '';
            this.selectAnnotationDeleteItem(false);
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot = false;
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public deselectAllItems(): void {
        const isBlazorPlatform: boolean = isBlazor();
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.showHideDropletDiv(true);
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (isBlazorPlatform) {
                this.primaryToolbar.deSelectItem(this.pdfViewer.toolbar.SelectToolElement);
                this.primaryToolbar.selectItem(this.pdfViewer.toolbar.PanElement);
                this.primaryToolbar.deSelectItem(this.HighlightElement);
                this.primaryToolbar.deSelectItem(this.UnderlineElement);
                this.primaryToolbar.deSelectItem(this.StrikethroughElement);
                this.primaryToolbar.deSelectItem(this.FreeTextElement);
                this.primaryToolbar.deSelectItem(this.InkAnnotationElement);
            } else {
                this.primaryToolbar.deSelectItem(this.highlightItem);
                this.primaryToolbar.deSelectItem(this.underlineItem);
                this.primaryToolbar.deSelectItem(this.strikethroughItem);
                this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            }
        }
        this.resetFreeTextAnnot();
        this.clearTextMarkupMode();
        this.clearShapeMode();
        this.clearMeasureMode();
        this.pdfViewer.tool = '';
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.enableTextMarkupAnnotationPropertiesTools(false);
            this.enableFreeTextAnnotationPropertiesTools(false);
            this.updateColorInIcon(this.colorDropDownElement, '#000000');
            this.updateColorInIcon(this.strokeDropDownElement, '#000000');
            this.updateColorInIcon(this.fontColorElement, '#000000');
            this.selectAnnotationDeleteItem(false);
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot = false;
        }
    }

    private updateInteractionTools(): void {
        if (this.pdfViewer.enableTextSelection) {
            this.pdfViewerBase.initiateTextSelectMode();
            if (!Browser.isDevice) {
                this.pdfViewer.toolbar.updateInteractionTools(true);
            }
        } else if (!Browser.isDevice) {
            this.pdfViewer.toolbar.updateInteractionTools(false);
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @param {boolean} deleteIconCicked - It describes about the delete icon clicked boolean value
     * @private
     * @returns {void}
     */
    public selectAnnotationDeleteItem(isEnable: boolean, deleteIconCicked?: boolean): void {
        if (!isBlazor() && !Browser.isDevice) {
            if (this.toolbar) {
                if (isEnable) {
                    const annotation: any = this.pdfViewer.annotationModule.findCurrentAnnotation();
                    if (annotation) {
                        if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                            if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                                this.enableItems(this.deleteItem.parentElement, isEnable);
                            } else {
                                this.enableItems(this.deleteItem.parentElement, false);
                            }
                        } else {
                            this.enableItems(this.deleteItem.parentElement, isEnable);
                        }
                    }
                } else {
                    this.enableItems(this.deleteItem.parentElement, isEnable);
                }
            }
        } else {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                if (isEnable) {
                    const annotation: any = this.pdfViewer.annotationModule.findCurrentAnnotation();
                    if (annotation) {
                        if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                            if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                                this.pdfViewerBase.blazorUIAdaptor.EnableDeleteOption(isEnable);
                            } else {
                                this.pdfViewerBase.blazorUIAdaptor.EnableDeleteOption(false);
                            }
                        } else if (this.pdfViewerBase.blazorUIAdaptor) {
                            this.pdfViewerBase.blazorUIAdaptor.EnableDeleteOption(isEnable);
                        }
                    }
                } else if (this.pdfViewerBase.blazorUIAdaptor) {
                    this.pdfViewerBase.blazorUIAdaptor.EnableDeleteOption(isEnable);
                }
                if (deleteIconCicked) {
                    this.pdfViewerBase.focusViewerContainer();
                }
            }
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableTextMarkupAnnotationPropertiesTools(isEnable: boolean): void {
        if (!Browser.isDevice) {
            if (!isBlazor()) {
                this.enableItems(this.colorDropDownElement.parentElement, isEnable);
                this.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.enableItems(this.strokeDropDownElement.parentElement, false);
                    this.enableItems(this.thicknessElement.parentElement, false);
                    this.enableItems(this.fontFamilyElement.parentElement, false);
                    this.enableItems(this.fontSizeElement.parentElement, false);
                    this.enableItems(this.fontColorElement.parentElement, false);
                    this.enableItems(this.textAlignElement.parentElement, false);
                    this.enableItems(this.textPropElement.parentElement, false);
                }
            } else {
                // this.pdfViewer._dotnetInstance.invokeMethodAsync('AnnotationSelect', 'TextMarkup');
                this.pdfViewerBase.blazorUIAdaptor.enableTextMarkupAnnotationPropertiesTools(isEnable);
            }
        }
    }

    private checkAnnotationPropertiesChange(): boolean {
        const annotation: any = this.pdfViewer.selectedItems.annotations[0];
        if (annotation && annotation.annotationSettings) {
            const isLock: boolean = annotation.annotationSettings.isLock;
            if (isLock) {
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('PropertyChange', annotation)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableAnnotationPropertiesTools(isEnable: boolean): void {
        if (!Browser.isDevice) {
            let isPropertiesChanges: boolean = this.checkAnnotationPropertiesChange();
            if (!isEnable) {
                isPropertiesChanges = true;
            }
            if (!isBlazor()) {
                if (isPropertiesChanges) {
                    if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line')) {
                        this.enableItems(this.colorDropDownElement.parentElement, false);
                    } else {
                        this.enableItems(this.colorDropDownElement.parentElement, isEnable);
                    }
                    this.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                    this.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                    this.enableItems(this.thicknessElement.parentElement, isEnable);
                    if (this.pdfViewer.enableShapeLabel) {
                        this.enableItems(this.fontFamilyElement.parentElement, isEnable);
                        this.enableItems(this.fontSizeElement.parentElement, isEnable);
                        this.enableItems(this.fontColorElement.parentElement, isEnable);
                    }
                    this.enableItems(this.textAlignElement.parentElement, false);
                    this.enableItems(this.textPropElement.parentElement, false);
                }
            } else {
                // this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableAnnotationPropertiesTools', isEnable, isPropertiesChanges);
                this.pdfViewerBase.blazorUIAdaptor.enableAnnotationPropertiesTool(isEnable, isPropertiesChanges);
            }
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableSignaturePropertiesTools(isEnable: boolean): void {
        if (!Browser.isDevice) {
            let isPropertiesChanges: boolean = this.checkAnnotationPropertiesChange();
            if (!isEnable) {
                isPropertiesChanges = true;
            }
            if (!isBlazor()) {
                if (isPropertiesChanges) {
                    this.enableItems(this.colorDropDownElement.parentElement, false);
                    this.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                    this.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                    this.enableItems(this.thicknessElement.parentElement, isEnable);
                    this.enableItems(this.textAlignElement.parentElement, false);
                    this.enableItems(this.textPropElement.parentElement, false);
                    this.enableItems(this.fontFamilyElement.parentElement, false);
                    this.enableItems(this.fontSizeElement.parentElement, false);
                    this.enableItems(this.fontColorElement.parentElement, false);
                    this.enableItems(this.textAlignElement.parentElement, false);
                }
            } else {
                //this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableSignaturePropertiesTools', isEnable, isPropertiesChanges);
                this.pdfViewerBase.blazorUIAdaptor.enableSignaturePropertiesTools(isEnable, isPropertiesChanges);
            }
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableStampAnnotationPropertiesTools(isEnable: boolean): void {
        let isPropertiesChanges: boolean = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.enableItems(this.colorDropDownElement.parentElement, false);
                this.enableItems(this.strokeDropDownElement.parentElement, false);
                this.enableItems(this.thicknessElement.parentElement, false);
                this.enableItems(this.fontFamilyElement.parentElement, false);
                this.enableItems(this.fontSizeElement.parentElement, false);
                this.enableItems(this.fontColorElement.parentElement, false);
                this.enableItems(this.textAlignElement.parentElement, false);
                this.enableItems(this.textPropElement.parentElement, false);
            }
        } else {
            // this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableStampAnnotationPropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableStampAnnotationPropertiesTools(isEnable, isPropertiesChanges);
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableFreeTextAnnotationPropertiesTools(isEnable: boolean): void {
        let isPropertiesChanges: boolean = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.enableItems(this.colorDropDownElement.parentElement, isEnable);
                this.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                this.enableItems(this.thicknessElement.parentElement, isEnable);
                this.enableItems(this.fontFamilyElement.parentElement, isEnable);
                this.enableItems(this.fontSizeElement.parentElement, isEnable);
                this.enableItems(this.fontColorElement.parentElement, isEnable);
                this.enableItems(this.textAlignElement.parentElement, isEnable);
                this.enableItems(this.textPropElement.parentElement, isEnable);
            }
        } else {
            //this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableFreeTextAnnotationPropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableFreeTextAnnotationPropertiesTools(isEnable, isPropertiesChanges);
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableAnnotationAddTools(isEnable: boolean): void {
        if (this.toolbar && !Browser.isDevice) {
            if (this.pdfViewer.enableTextMarkupAnnotation) {
                this.enableItems(this.highlightItem.parentElement, isEnable);
                this.enableItems(this.underlineItem.parentElement, isEnable);
                this.enableItems(this.strikethroughItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableShapeAnnotation) {
                this.enableItems(this.shapeElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableStampAnnotations) {
                this.toolbar.enableItems(this.stampElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableMeasureAnnotation && this.pdfViewerBase.isCalibrateAnnotationModule()) {
                this.enableItems(this.calibrateElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableFreeText) {
                this.enableItems(this.freeTextEditItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableHandwrittenSignature) {
                this.enableItems(this.handWrittenSignatureItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableInkAnnotation) {
                this.enableItems(this.inkAnnotationItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableCommentPanel) {
                this.enableCommentPanelTool(isEnable);
            }
        }
    }

    /**
     * @private
     * @returns {boolean} - boolean
     */
    public isAnnotationButtonsEnabled(): boolean {
        let isButtonsEnabled: boolean = false;
        if (this.isHighlightEnabled || this.isUnderlineEnabled || this.isStrikethroughEnabled) {
            isButtonsEnabled = true;
        }
        return isButtonsEnabled;
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public enableCommentPanelTool(isEnable: boolean): void {
        if (this.toolbar) {
            this.enableItems(this.commentItem.parentElement, isEnable);
        }
    }

    private updateToolbarItems(): void {
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.enableTextMarkupAddTools(true);
        } else {
            this.enableTextMarkupAddTools(false);
        }
        this.enableItems(this.shapeElement.parentElement, this.pdfViewer.enableShapeAnnotation);
        this.toolbar.enableItems(this.stampElement.parentElement, this.pdfViewer.enableStampAnnotations);
        this.enableItems(this.calibrateElement.parentElement, this.pdfViewer.enableMeasureAnnotation);
        this.enableItems(this.freeTextEditItem.parentElement, this.pdfViewer.enableFreeText);
        this.enableItems(this.handWrittenSignatureItem.parentElement, this.pdfViewer.enableHandwrittenSignature);
        this.enableItems(this.inkAnnotationItem.parentElement, this.pdfViewer.enableInkAnnotation);
        this.closeItem.setAttribute('tabindex', '0');
    }

    private enableTextMarkupAddTools(isEnable: boolean): void {
        this.enableItems(this.highlightItem.parentElement, isEnable);
        this.enableItems(this.underlineItem.parentElement, isEnable);
        this.enableItems(this.strikethroughItem.parentElement, isEnable);
    }

    /**
     * @private
     * @returns {void}
     */
    // for shapes added by drawing package
    public updateAnnnotationPropertyItems(): void {
        if (!isBlazor()) {
            if (this.pdfViewer.selectedItems.annotations.length === 1) {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill, 'fillColor'));
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor, 'strokeColor'));
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' && !this.pdfViewer.selectedItems.annotations[0].isLock) {
                    this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].fontColor, 'fontColor'));
                    this.pdfViewer.toolbar.annotationToolbarModule.
                        updateFontFamilyInIcon(this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    this.pdfViewer.toolbar.annotationToolbarModule.
                        updateFontSizeInIcon(this.pdfViewer.selectedItems.annotations[0].fontSize);
                    this.pdfViewer.toolbar.annotationToolbarModule.
                        updateTextAlignInIcon(this.pdfViewer.selectedItems.annotations[0].textAlign);
                }
            } else {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElement, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElement, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElement, '#000000');
            }
        } else {
            this.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
            this.strokeDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-stroke-container');
            this.fontColorElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-textcolor-container');
            if (this.pdfViewer.selectedItems.annotations.length === 1) {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill, 'fillColor'));
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor, 'strokeColor'));
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].fontColor, 'fontColor'));
                    //this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateFontFamilyInIcon', this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    this.pdfViewerBase.blazorUIAdaptor.updateFontFamilyInIcon(this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    // this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateFontSizeInIcon', this.pdfViewer.selectedItems.annotations[0].fontSize);
                    this.pdfViewerBase.blazorUIAdaptor.updateFontSizeInIcon(this.pdfViewer.selectedItems.annotations[0].fontSize);
                    //this.pdfViewer.toolbar.annotationtoolbar.updateTextAlignInIcon(this.pdfViewer.selectedItems.annotations[0].textAlign);
                }
            } else {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElementInBlazor, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElementInBlazor, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElementInBlazor, '#000000');
            }
        }
    }

    private getColorHexValue(colorString: string, type: string): string {
        if (colorString === '#ffffff00') {
            colorString = '#ffffff';
        }
        if (colorString.toLowerCase() === 'red') {
            colorString = '#FF0000';
        }
        if (colorString !== 'transparent') {
            if (!isBlazor()) {
                return this.colorPalette.getValue(colorString, 'hex');
            } else {
                return colorString;
            }
        } else {
            if (type === 'fontColor' || type === 'strokeColor') {
                return '#000000';
            } else {
                return '#ffffff';
            }
        }
    }

    private setColorInPicker(colorpick: ColorPicker, colorString: string): void {
        if (colorpick) {
            colorpick.setProperties({ 'value': colorString }, true);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public resetToolbar(): void {
        this.updateToolbarItems();
        if ((this.pdfViewer.isAnnotationToolbarOpen || this.pdfViewer.isAnnotationToolbarVisible) &&
        this.pdfViewer.enableAnnotationToolbar) {
            this.adjustViewer(false);
            this.toolbarElement.style.display = '';
            this.isToolbarHidden = false;
            this.adjustViewer(true);
            this.primaryToolbar.selectItem(this.primaryToolbar.annotationItem);
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
            }
            this.pdfViewer.isAnnotationToolbarVisible = true;
        } else {
            this.toolbarElement.style.display = 'none';
            this.isToolbarHidden = true;
            this.pdfViewer.isAnnotationToolbarVisible = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearTextMarkupMode(): void {
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            if (isBlazor()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            }
            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearShapeMode(): void {
        if (this.pdfViewerBase.isShapeAnnotationModule()) {
            this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode = '';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearMeasureMode(): void {
        if (this.pdfViewerBase.isCalibrateAnnotationModule()) {
            this.pdfViewer.annotation.measureAnnotationModule.currentAnnotationMode = '';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        this.deselectAllItems();
        this.deselectAllItemsForMobile();
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.destroyComponent();
        if (this.shapeDropDown) { this.shapeDropDown.destroy(); }
        if (this.calibrateDropDown) { this.calibrateDropDown.destroy(); }
        if (this.fontColorDropDown) { this.fontColorDropDown.destroy(); }
        if (this.textAlignDropDown) { this.textAlignDropDown.destroy(); }
        if (this.colorDropDown) { this.colorDropDown.destroy(); }
        if (this.strokeDropDown) { this.strokeDropDown.destroy(); }
        if (this.thicknessDropDown) { this.thicknessDropDown.destroy(); }
        if (this.opacityDropDown) { this.opacityDropDown.destroy(); }
        if (this.textPropertiesDropDown) { this.textPropertiesDropDown.destroy(); }
        if (this.toolbar) { this.toolbar.destroy(); }
        const stampImage: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_stampElement');
        if (stampImage) {
            stampImage.parentElement.removeChild(stampImage);
        }
    }

    private destroyComponent(): void {
        const componentElement: HTMLElement[] = [this.highlightItem, this.underlineItem, this.strikethroughItem,
            this.lineElement, this.arrowElement,
            this.rectangleElement, this.circleElement, this.polygonElement, this.calibrateDistance, this.calibrateArea,
            this.calibrateRadius,
            this.calibrateVolume, this.calibratePerimeter, this.freeTextEditItem, this.stampElement,
            this.handWrittenSignatureItem, this.inkAnnotationItem,
            this.fontFamilyElement, this.fontSizeElement, this.alignLeftElement, this.alignRightElement,
            this.alignCenterElement, this.alignJustifyElement,
            this.boldElement, this.italicElement, this.fontStyleStrikethroughItem, this.fontStyleUnderlineItem,
            this.deleteItem, this.commentItem,
            this.shapeDropDown ? this.shapeDropDown.activeElem[0] : null, this.calibrateDropDown ?
                this.calibrateDropDown.activeElem[0] : null, this.fontColorDropDown ? this.fontColorDropDown.activeElem[0] : null,
            this.textAlignDropDown ? this.textAlignDropDown.activeElem[0] : null,
            this.colorDropDown ? this.colorDropDown.activeElem[0] : null, this.strokeDropDown ?
                this.strokeDropDown.activeElem[0] : null, this.thicknessDropDown ? this.thicknessDropDown.activeElem[0] : null,
            this.opacityDropDown ? this.opacityDropDown.activeElem[0] : null, this.textPropertiesDropDown ?
                this.textPropertiesDropDown.activeElem[0] : null
        ];
        for (let i: number = 0; i < componentElement.length; i++) {
            if (componentElement[parseInt(i.toString(), 10)]) {
                this.destroyDependentComponent(componentElement[parseInt(i.toString(), 10)]);
            }
        }
    }

    private destroyDependentComponent(component: any): void {
        if (component.ej2_instances) {
            for (let i: number = component.ej2_instances.length - 1; i >= 0; i--) {
                component.ej2_instances[parseInt(i.toString(), 10)].destroy();
            }
        }
    }

    private getElementHeight(element: HTMLElement): number {
        try {
            return element.getBoundingClientRect().height;
        } catch (error) {
            return 0;
        }
    }

    private updateViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return this.getElementHeight(this.pdfViewer.element) - toolbarHeight;
    }

    private resetViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return viewerHeight + toolbarHeight;
    }

    /**
     * @private
     * @returns {void}
     */
    public afterAnnotationToolbarCreationInBlazor(): void {
        this.HighlightElement = document.getElementById(this.pdfViewer.element.id + '_highLight').children[0];
        this.UnderlineElement = document.getElementById(this.pdfViewer.element.id + '_underline').children[0];
        this.StrikethroughElement = document.getElementById(this.pdfViewer.element.id + '_strikethrough').children[0];
        this.InkAnnotationElement = document.getElementById(this.pdfViewer.element.id + '_annotation_ink').children[0];
        this.InkAnnotationElement.classList.add('e-pv-tbar-btn');
        this.FreeTextElement = document.getElementById(this.pdfViewer.element.id + '_annotation_freeTextEdit').children[0];
        this.HighlightElement = this.addClassToToolbarInBlazor(this.HighlightElement, 'e-pv-highlight', '_highLight');
        this.UnderlineElement = this.addClassToToolbarInBlazor(this.UnderlineElement, 'e-pv-underline', '_underline');
        this.StrikethroughElement = this.addClassToToolbarInBlazor(this.StrikethroughElement, 'e-pv-strikethrough', '_strikethrough');
    }

    private addClassToToolbarInBlazor(element: any, className: string, idString: string): void {
        element.classList.add(className);
        element.classList.add('e-pv-tbar-btn');
        if (element.childNodes.length > 0) {
            const spanElement: HTMLElement = element.childNodes[0] as HTMLElement;
            if (spanElement && spanElement.classList) {
                spanElement.id = this.pdfViewer.element.id + idString + 'Icon';
                spanElement.classList.remove('e-icons');
                spanElement.classList.remove('e-btn-icon');
                if (this.pdfViewer.enableRtl) {
                    spanElement.classList.add('e-right');
                }
            }
        }
        return element;
    }

    private handleHighlightInBlazor(): void {
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        } else if (!this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.HighlightElement);
        }
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        }
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        }
    }

    private handleUnderlineInBlazor(): void {
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        } else if (!this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.UnderlineElement);
        }
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        }
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        }
    }

    private handleStrikethroughInBlazor(): void {
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        } else if (!this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.StrikethroughElement);
        }
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        }
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        }
    }

    private AnnotationSliderOpened(): void {
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations.length > 0 &&
            this.pdfViewer.selectedItems.annotations[0]) {
            if (this.pdfViewer.selectedItems.annotations[0].wrapper && this.pdfViewer.selectedItems.annotations[0].wrapper.children[0]) {
                const opacity: number = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
                const thickness: number = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
                this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateAnnotationSlider', opacity, thickness);
            }
        }
    }

    private DropDownOpened(colorElement: any): void {
        if (colorElement && colorElement[0].element) {
            const colorElementBounds: any = colorElement[0].element.getBoundingClientRect();
            const sidebarElement: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
            const sideBarElementWidth: number = (sidebarElement) ? sidebarElement.getBoundingClientRect().width : 0;
            if (colorElementBounds.left > this.pdfViewerBase.viewerContainer.clientWidth + colorElementBounds.width + sideBarElementWidth) {
                colorElement[0].element.style.left = (colorElementBounds.left - (this.pdfViewerBase.viewerContainer.clientHeight / 2)) + 'px';
            }
        }
    }

    private enableItems(element: HTMLElement, isEnable: boolean): void {
        this.toolbar.enableItems(element, isEnable);
        if (element.firstElementChild) {
            element.firstElementChild.setAttribute('tabindex', isEnable ? '0' : '-1');
            element.firstElementChild.setAttribute('data-tabindex', isEnable ? '0' : '-1');
        }
    }
}
