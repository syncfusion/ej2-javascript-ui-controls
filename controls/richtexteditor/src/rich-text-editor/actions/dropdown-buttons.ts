import { addClass, isNullOrUndefined, removeClass, select, closest } from '@syncfusion/ej2-base';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { RenderType } from '../base/enum';
import { getIndex } from '../base/util';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { getDropDownValue, getFormattedFontSize, getTooltipText } from '../base/util';
import * as model from '../models/items';
import { IRichTextEditor, IRenderer, IDropDownModel, IDropDownItemModel, IDropDownRenderArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { dispatchEvent } from '../base/util';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class DropDownButtons {
    public formatDropDown: DropDownButton;
    public fontNameDropDown: DropDownButton;
    public fontSizeDropDown: DropDownButton;
    public alignDropDown: DropDownButton;
    public imageAlignDropDown: DropDownButton;
    public displayDropDown: DropDownButton;
    public tableRowsDropDown: DropDownButton;
    public tableColumnsDropDown: DropDownButton;
    public tableCellVerticalAlignDropDown: DropDownButton;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private initializeInstance(): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    }

    private beforeRender(args: MenuEventArgs): void {
        const item: IDropDownItemModel = args.item as IDropDownItemModel;
        if (item.cssClass) {
            addClass([args.element], item.cssClass);
        }
        if (item.command === 'Alignments' || item.subCommand === 'JustifyLeft'
            || item.subCommand === 'JustifyRight' || item.subCommand === 'JustifyCenter') {
            args.element.setAttribute('title', getTooltipText(item.subCommand.toLocaleLowerCase(), this.locator));
        }
    }

    private dropdownContent(width: string, type: string, content: string): string {
        return ('<span style="display: inline-flex;' + 'width:' + ((type === 'quick') ? 'auto' : width) + '" >' +
            '<span class="e-rte-dropdown-btn-text">' + content + '</span></span>');
    }

    /**
     * renderDropDowns method
     *
     * @param {IDropDownRenderArgs} args - specifies the arguments
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderDropDowns(args: IDropDownRenderArgs): void {
        this.initializeInstance();
        const type: string = args.containerType;
        const tbElement: HTMLElement = args.container;
        model.templateItems.forEach((item: string) => {
            let targetElement: Element = undefined;
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                case 'formats': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_Formats', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const formatItem: IDropDownItemModel[] = this.parent.format.types.slice();
                    formatItem.forEach((item: IDropDownItemModel): void => {
                        // eslint-disable-next-line
                        Object.defineProperties((item as object), {
                            command: { value: 'Formats', enumerable: true }, subCommand: { value: item.value, enumerable: true }
                        });
                    });
                    const formatContent: string = isNullOrUndefined(this.parent.format.default) ? formatItem[0].text :
                        this.parent.format.default;
                    this.formatDropDown = this.toolbarRenderer.renderDropDownButton({
                        iconCss: ((type === 'quick') ? 'e-formats e-icons' : ''),
                        content: this.dropdownContent(
                            this.parent.format.width,
                            type,
                            ((type === 'quick') ? '' : getDropDownValue(formatItem, formatContent, 'text', 'text'))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FORMATS_TB_BTN,
                        itemName: 'Formats', items: formatItem, element: targetElement
                    } as IDropDownModel);
                    break; }
                case 'fontname': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_FontName', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const fontItem: IDropDownItemModel[] = this.parent.fontFamily.items.slice();
                    fontItem.forEach((item: IDropDownItemModel): void => {
                        // eslint-disable-next-line
                        Object.defineProperties((item as object), {
                            command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontName', enumerable: true }
                        });
                    });
                    const fontNameContent: string = isNullOrUndefined(this.parent.fontFamily.default) ? fontItem[0].text :
                        this.parent.fontFamily.default;
                    this.fontNameDropDown = this.toolbarRenderer.renderDropDownButton({
                        iconCss: ((type === 'quick') ? 'e-font-name e-icons' : ''),
                        content: this.dropdownContent(
                            this.parent.fontFamily.width,
                            type,
                            ((type === 'quick') ? '' : getDropDownValue(fontItem, fontNameContent, 'text', 'text'))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FONT_NAME_TB_BTN,
                        itemName: 'FontName', items: fontItem, element: targetElement
                    } as IDropDownModel);
                    if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                        this.getEditNode().style.fontFamily = this.parent.fontFamily.default;
                    }
                    break; }
                case 'fontsize': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_FontSize', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const fontsize: IDropDownItemModel[] = this.parent.fontSize.items.slice();
                    fontsize.forEach((item: IDropDownItemModel): void => {
                        // eslint-disable-next-line
                        Object.defineProperties((item as object), {
                            command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontSize', enumerable: true }
                        });
                    });
                    const fontSizeContent: string = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[1].text :
                        this.parent.fontSize.default;
                    this.fontSizeDropDown = this.toolbarRenderer.renderDropDownButton({
                        content: this.dropdownContent(
                            this.parent.fontSize.width,
                            type,
                            getFormattedFontSize(getDropDownValue(
                                fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text'))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FONT_SIZE_TB_BTN,
                        itemName: 'FontSize', items: fontsize, element: targetElement
                    } as IDropDownModel);
                    if (!isNullOrUndefined(this.parent.fontSize.default)) {
                        this.getEditNode().style.fontSize = this.parent.fontSize.default;
                    }
                    break; }
                case 'alignments':
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_Alignments', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    this.alignDropDown = this.toolbarRenderer.renderDropDownButton({
                        iconCss: 'e-justify-left e-icons',
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS,
                        itemName: 'Alignments', items: model.alignmentItems, element: targetElement
                    } as IDropDownModel);
                    break;
                case 'align': this.imageAlignmentDropDown(type, tbElement, targetElement);
                    break;
                case 'display': this.imageDisplayDropDown(type, tbElement, targetElement);
                    break;
                case 'tablerows': this.rowDropDown(type, tbElement, targetElement);
                    break;
                case 'tablecolumns': this.columnDropDown(type, tbElement, targetElement);
                    break;
                case 'tablecell': this.cellDropDown(type, tbElement, targetElement);
                    break;
                case 'tablecellverticalalign': this.verticalAlignDropDown(type, tbElement, targetElement);
                    break;
                case 'styles': this.tableStylesDropDown(type, tbElement, targetElement); break;
                }
            }
        });
    }

    private getUpdateItems(items: IDropDownItemModel[], value: string): IDropDownItemModel[] {
        const dropDownItems: IDropDownItemModel[] = items.slice();
        dropDownItems.forEach((item: IDropDownItemModel): void => {
            // eslint-disable-next-line
            Object.defineProperties((item as object), {
                command: { value: (value === 'Format' ? 'Formats' : 'Font'), enumerable: true },
                subCommand: { value: (value === 'Format' ? item.value : value), enumerable: true }
            });
        });
        return dropDownItems;
    }

    // eslint-disable-next-line
    private onPropertyChanged(model: { [key: string]: Object }): void {
        const newProp: RichTextEditorModel = model.newProp;
        let type: string;
        let content: string;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'fontFamily':
                if (this.fontNameDropDown) {
                    for (const fontFamily of Object.keys(newProp.fontFamily)) {
                        switch (fontFamily) {
                        case 'default':
                        case 'width': {
                            const fontItems: IDropDownItemModel[] = this.fontNameDropDown.items;
                            type = !isNullOrUndefined(
                                closest(this.fontNameDropDown.element, '.' + classes.CLS_QUICK_TB)) ?
                                'quick' : 'toolbar';
                            const fontNameContent: string = isNullOrUndefined(this.parent.fontFamily.default) ? fontItems[0].text :
                                this.parent.fontFamily.default;
                            content = this.dropdownContent(
                                this.parent.fontFamily.width, type,
                                ((type === 'quick') ? '' : getDropDownValue(fontItems, fontNameContent, 'text', 'text')));
                            this.fontNameDropDown.setProperties({ content: content });
                            if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                                this.getEditNode().style.fontFamily = this.parent.fontFamily.default;
                            } else {
                                this.getEditNode().style.removeProperty('font-family');
                            }
                            break; }
                        case 'items':
                            this.fontNameDropDown.setProperties({
                                items: this.getUpdateItems(newProp.fontFamily.items, 'FontName')
                            });
                            break;
                        }
                    }
                }
                break;
            case 'fontSize':
                if (this.fontSizeDropDown) {
                    for (const fontSize of Object.keys(newProp.fontSize)) {
                        switch (fontSize) {
                        case 'default':
                        case 'width': {
                            const fontsize: IDropDownItemModel[] = this.fontSizeDropDown.items;
                            type = !isNullOrUndefined(
                                closest(this.fontSizeDropDown.element, '.' + classes.CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                            const fontSizeContent: string = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[1].text :
                                this.parent.fontSize.default;
                            content = this.dropdownContent(
                                this.parent.fontSize.width, type,
                                getFormattedFontSize(getDropDownValue(
                                    fontsize,
                                    fontSizeContent.replace(/\s/g, ''),
                                    'value',
                                    'text')));
                            this.fontSizeDropDown.setProperties({ content: content });
                            if (!isNullOrUndefined(this.parent.fontSize.default)) {
                                this.getEditNode().style.fontSize = this.parent.fontSize.default;
                            } else {
                                this.getEditNode().style.removeProperty('font-size');
                            }
                            break; }
                        case 'items':
                            this.fontSizeDropDown.setProperties({
                                items: this.getUpdateItems(newProp.fontSize.items, 'FontSize')
                            });
                            break;
                        }
                    }
                }
                break;
            case 'format':
                if (this.formatDropDown) {
                    for (const format of Object.keys(newProp.format)) {
                        switch (format) {
                        case 'default':
                        case 'width': {
                            const formatItems: IDropDownItemModel[] = this.formatDropDown.items;
                            type = !isNullOrUndefined(
                                closest(this.formatDropDown.element, '.' + classes.CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                            const formatContent: string = isNullOrUndefined(this.parent.format.default) ? formatItems[0].text :
                                this.parent.format.default;
                            content = this.dropdownContent(
                                this.parent.format.width, type,
                                ((type === 'quick') ? '' : getDropDownValue(formatItems, formatContent, 'text', 'text')));
                            this.formatDropDown.setProperties({ content: content });
                            break; }
                        case 'types':
                            this.formatDropDown.setProperties({
                                items: this.getUpdateItems(newProp.format.types, 'Format')
                            });
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    private getEditNode(): HTMLElement {
        return this.parent.contentModule.getEditPanel() as HTMLElement;
    }
    private rowDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableRows', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableRowsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-rows e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'TableRows',
            items: model.tableRowsItems,
            element: targetElement
        } as IDropDownModel);
    }
    private columnDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableColumns', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableColumnsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-columns e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'TableColumns',
            items: model.tableColumnsItems,
            element: targetElement
        } as IDropDownModel);
    }

    private cellDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableCell', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) { return; }
        this.tableRowsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-cell e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'TableCell',
            items: model.tableCellItems,
            element: targetElement
        } as IDropDownModel);
    }

    private verticalAlignDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableCellVerticalAlign', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableCellVerticalAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-cell-ver-align e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'TableCellVerticalAlign',
            items: model.TableCellVerticalAlignItems,
            element: targetElement
        } as IDropDownModel);
    }

    private imageDisplayDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Display', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.displayDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-display e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'Display',
            items: model.imageDisplayItems,
            element: targetElement
        } as IDropDownModel);
    }
    private imageAlignmentDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Align', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.imageAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-justify-left e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ICONS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'Align',
            items: model.imageAlignItems,
            element: targetElement
        } as IDropDownModel);
    }

    private tableStylesDropDown(type: string, tbElement: HTMLElement, targetElement: Element): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Styles', tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.imageAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-style e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ICONS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'Styles',
            items: this.parent.tableSettings.styles,
            element: targetElement
        } as IDropDownModel);
    }

    private removeDropDownClasses(target: HTMLElement): void {
        removeClass([target], [
            classes.CLS_DROPDOWN_BTN,
            classes.CLS_DROPDOWN_POPUP,
            classes.CLS_DROPDOWN_ICONS,
            classes.CLS_DROPDOWN_ITEMS
        ]);
    }

    /**
     * destroyDropDowns method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroyDropDowns(): void {
        if (this.formatDropDown) {
            this.removeDropDownClasses(this.formatDropDown.element);
            this.formatDropDown.destroy();
        }
        if (this.fontNameDropDown) {
            this.removeDropDownClasses(this.fontNameDropDown.element);
            this.fontNameDropDown.destroy();
        }
        if (this.fontSizeDropDown) {
            this.removeDropDownClasses(this.fontSizeDropDown.element);
            this.fontSizeDropDown.destroy();
        }
        if (this.alignDropDown) {
            this.removeDropDownClasses(this.alignDropDown.element);
            this.alignDropDown.destroy();
        }
        if (this.imageAlignDropDown) {
            this.removeDropDownClasses(this.imageAlignDropDown.element);
            this.imageAlignDropDown.destroy();
        }
        if (this.displayDropDown) {
            this.removeDropDownClasses(this.displayDropDown.element);
            this.displayDropDown.destroy();
        }
        if (this.tableRowsDropDown) {
            this.removeDropDownClasses(this.tableRowsDropDown.element);
            this.tableRowsDropDown.destroy();
        }
        if (this.tableColumnsDropDown) {
            this.removeDropDownClasses(this.tableColumnsDropDown.element);
            this.tableColumnsDropDown.destroy();
        }
        if (this.tableCellVerticalAlignDropDown) {
            this.removeDropDownClasses(this.tableCellVerticalAlignDropDown.element);
            this.tableCellVerticalAlignDropDown.destroy();
        }
    }

    // eslint-disable-next-line
    private setRtl(args: { [key: string]: Object }): void {
        if (this.formatDropDown) {
            this.formatDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.fontNameDropDown) {
            this.fontNameDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.fontSizeDropDown) {
            this.fontSizeDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.alignDropDown) {
            this.alignDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageAlignDropDown) {
            this.imageAlignDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.displayDropDown) {
            this.displayDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.beforeDropDownItemRender, this.beforeRender, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
    }

    private onIframeMouseDown(): void {
        dispatchEvent(document, 'mousedown');
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.beforeDropDownItemRender, this.beforeRender);
        this.parent.off(events.destroy, this.removeEventListener);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
    }

}