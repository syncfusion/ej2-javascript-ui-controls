import { addClass, isNullOrUndefined, removeClass, select, closest, L10n } from '@syncfusion/ej2-base';
import { DropDownButton, MenuEventArgs, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { RenderType } from '../base/enum';
import { getIndex } from '../base/util';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { getDropDownValue, getFormattedFontSize } from '../base/util';
import * as model from '../models/items';
import { IRichTextEditor, IDropDownRenderArgs, ICssClassArgs, IRenderer } from '../base/interface';
import { IDropDownModel, IDropDownItemModel, ISplitButtonModel, ICodeBlockLanguageModel, IListDropDownModel} from '../../common/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { CLS_CODEBLOCK_TB_BTN, CLS_CODEBLOCK_TB_BTN_ICON } from '../base/classes';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class DropDownButtons {
    public numberFormatListDropDown: DropDownButton;
    public bulletFormatListDropDown: DropDownButton;
    public formatDropDown: DropDownButton;
    public codeBlockSplitButton: SplitButton;
    public fontNameDropDown: DropDownButton;
    public fontSizeDropDown: DropDownButton;
    public alignDropDown: DropDownButton;
    public imageAlignDropDown: DropDownButton;
    public displayDropDown: DropDownButton;
    public tableRowsDropDown: DropDownButton;
    public tableColumnsDropDown: DropDownButton;
    public tableCellDropDown: DropDownButton;
    public tableCellVerticalAlignDropDown: DropDownButton;
    public tableBorderStyleDropDown: DropDownButton;
    /**
     *
     * @hidden
     * @private
     */
    public parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;
    private i10n: L10n;

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
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
    }

    private dropdownContent(width: string, type: string, content: string): string {
        return ('<span class="e-rte-dropdown-btn-text-wrapper" style="width:' + ((type === 'quick') ? 'auto' : width) + '" >' +
            '<span class="e-rte-dropdown-btn-text">' + content + '</span></span>');
    }

    /**
     * renderDropDowns method
     *
     * @param {IDropDownRenderArgs} args - specifies the arguments
     * @returns {void}
     * @hidden
     * @param {HTMLElement} targetEle - specifies the arugument
     * @deprecated
     */
    public renderDropDowns(args: IDropDownRenderArgs, targetEle?: HTMLElement): void {
        this.initializeInstance();
        const type: string = args.containerType;
        const tbElement: HTMLElement = args.container;
        model.templateItems.forEach((item: string) => {
            let targetElement: Element = undefined;
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                case 'numberformatlist': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_NumberFormatList', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const formatOLItem: IListDropDownModel[] = this.parent.numberFormatList.types.slice();
                    formatOLItem.forEach((item: IListDropDownModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'Lists', enumerable: true }, subCommand: { value: 'NumberFormatList', enumerable: true }
                        });
                    });
                    this.numberFormatListDropDown = this.toolbarRenderer.renderSplitButton({
                        cssClass: classes.CLS_NUMBERFORMATLIST_DROPDOWN + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN,
                        itemName: 'NumberFormatList', items: formatOLItem, element: targetElement,
                        iconCss: ('e-order-list' + ' ' + classes.CLS_ICONS)
                    } as IDropDownModel);
                    break;
                }
                case 'bulletformatlist': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_BulletFormatList', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const formatULItem: IListDropDownModel[] = this.parent.bulletFormatList.types.slice();
                    formatULItem.forEach((item: IListDropDownModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'Lists', enumerable: true }, subCommand: { value: 'BulletFormatList', enumerable: true }
                        });
                    });
                    this.bulletFormatListDropDown = this.toolbarRenderer.renderSplitButton({
                        cssClass: classes.CLS_BULLETFORMATLIST_DROPDOWN + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN,
                        itemName: 'BulletFormatList', items: formatULItem, element: targetElement,
                        iconCss: ('e-unorder-list' + ' ' + classes.CLS_ICONS)
                    } as IDropDownModel);
                    break;
                }
                case 'codeblock': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_codeBlock', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const codeBlockItems: ICodeBlockLanguageModel[] = (isNullOrUndefined(this.parent.codeBlockSettings.languages) ? [] :
                        this.parent.codeBlockSettings.languages).slice();
                    codeBlockItems.forEach((item: ICodeBlockLanguageModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'CodeBlock', enumerable: true },
                            subCommand: { value: 'CodeBlock', enumerable: true },
                            text: { value: item.label, enumerable: true },
                            value: { value: item.language, enumerable: true }
                        });
                    });
                    this.codeBlockSplitButton = this.toolbarRenderer.renderSplitButton({
                        cssClass: 'e-code-block' + ' ' + CLS_CODEBLOCK_TB_BTN + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + 'e-rte-dropdown',
                        itemName: 'CodeBlock', items: codeBlockItems, element: targetElement, iconCss: (CLS_CODEBLOCK_TB_BTN_ICON + ' e-icons')
                    } as ISplitButtonModel);
                    break;
                }
                case 'formats': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_Formats', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const formatItem: IDropDownItemModel[] = this.parent.format.types.slice();
                    formatItem.forEach((item: IDropDownItemModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'Formats', enumerable: true }, subCommand: { value: item.value, enumerable: true }
                        });
                    });
                    const formatContent: string = isNullOrUndefined(this.parent.format.default) ? formatItem[0].text :
                        this.parent.format.default;
                    this.formatDropDown = this.toolbarRenderer.renderDropDownButton({
                        content: this.dropdownContent(
                            this.parent.format.width,
                            type,
                            ((type === 'quick') ? '' : getDropDownValue(formatItem, formatContent, 'text', 'text'))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FORMATS_TB_BTN,
                        itemName: 'Formats', items: formatItem, element: targetElement
                    } as IDropDownModel);
                    break;
                }
                case 'fontname': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_FontName', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const fontItem: IDropDownItemModel[] = this.parent.fontFamily.items.slice();
                    fontItem.forEach((item: IDropDownItemModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontName', enumerable: true }
                        });
                    });
                    const fontNameContent: string = isNullOrUndefined(this.parent.fontFamily.default) ? fontItem.length === 0 ? '' : fontItem[0].text :
                        this.parent.fontFamily.default;
                    this.fontNameDropDown = this.toolbarRenderer.renderDropDownButton({
                        content: this.dropdownContent(
                            this.parent.fontFamily.width,
                            type,
                            ((fontItem.length === 0) ? this.i10n.getConstant('fontName') : (type === 'quick') ? '' : (getDropDownValue(fontItem, fontNameContent, 'text', 'text') === 'Default' ? this.i10n.getConstant('fontName') : getDropDownValue(fontItem, fontNameContent, 'text', 'text')))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FONT_NAME_TB_BTN,
                        itemName: 'FontName', items: fontItem, element: targetElement
                    } as IDropDownModel);
                    break;
                }
                case 'fontsize': {
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_FontSize', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    const fontsize: IDropDownItemModel[] = !isNullOrUndefined(this.fontSizeDropDown) &&
                            !isNullOrUndefined(this.fontSizeDropDown.items) && this.fontSizeDropDown.items.length > 0 ?
                        this.fontSizeDropDown.items : JSON.parse(JSON.stringify(this.parent.fontSize.items.slice()));
                    fontsize.forEach((item: IDropDownItemModel): void => {
                        Object.defineProperties((item as object), {
                            command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontSize', enumerable: true }
                        });
                    });
                    const fontSizeContent: string = isNullOrUndefined(this.parent.fontSize.default) ? fontsize.length === 0 ? '' : fontsize[0].text :
                        this.parent.fontSize.default;
                    const fontSizeDropDownContent: string = ((fontSizeContent === 'Default') ? getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'text', 'text') : getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text'));
                    this.fontSizeDropDown = this.toolbarRenderer.renderDropDownButton({
                        content: this.dropdownContent(
                            this.parent.fontSize.width,
                            type,
                            fontsize.length === 0 ? this.i10n.getConstant('fontSize') : (getFormattedFontSize((fontSizeDropDownContent === 'Default') ? this.i10n.getConstant('fontSize') : fontSizeDropDownContent))),
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_FONT_SIZE_TB_BTN,
                        itemName: 'FontSize', items: fontsize, element: targetElement
                    } as IDropDownModel);
                    break;
                }
                case 'alignments':
                    targetElement = select('#' + this.parent.getID() + '_' + type + '_Alignments', tbElement);
                    if (isNullOrUndefined(targetElement) || targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
                        return;
                    }
                    this.alignDropDown = this.toolbarRenderer.renderDropDownButton({
                        iconCss: 'e-justify-left e-icons',
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_ALIGN_TB_BTN,
                        itemName: 'Alignments', items: model.alignmentItems, element: targetElement
                    } as IDropDownModel);
                    break;
                case 'align':
                case 'videoalign':
                    this.renderAlignmentDropDown(type, tbElement, targetEle, item);
                    break;
                case 'display':
                case 'audiolayoutoption':
                case 'videolayoutoption':
                    this.renderDisplayDropDown(type, tbElement, targetEle, item);
                    break;
                case 'tablerows': this.rowDropDown(type, tbElement, targetElement, targetEle);
                    break;
                case 'tablecolumns': this.columnDropDown(type, tbElement, targetElement);
                    break;
                case 'tablecell': this.cellDropDown(type, tbElement, targetElement);
                    break;
                case 'tablecellverticalalign': this.verticalAlignDropDown(type, tbElement, targetElement);
                    break;
                case 'styles': this.tableStylesDropDown(type, tbElement, targetElement); break;
                case 'borderstyle': {
                    targetElement = tbElement;
                    let bdrStyle: string;
                    for (const item of model.borderStyleItems) {
                        if (targetEle.style.borderStyle === item.subCommand.toLowerCase()) {
                            bdrStyle = item.text;
                            break;
                        }
                    }
                    this.tableBorderStyleDropDown = this.toolbarRenderer.renderDropDownButton({
                        content: '<span class="e-rte-dropdown-btn-text-wrapper"><span class="e-rte-dropdown-btn-text">' + bdrStyle + '</span></span>',
                        cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_BORDER_STYLE_BTN,
                        itemName: 'BorderStyle', items: model.borderStyleItems, element: targetElement
                    } as IDropDownModel);
                    break;
                }
                }
            }
        });
        if (this.parent.inlineMode.enable) {
            this.setCssClass({ cssClass: this.parent.getCssClass() });
        }
    }

    private getUpdateItems(items: IDropDownItemModel[], value: string): IDropDownItemModel[] {
        const dropDownItems: IDropDownItemModel[] = items.slice();
        dropDownItems.forEach((item: IDropDownItemModel): void => {
            Object.defineProperties((item as object), {
                command: { value: (value === 'Format' ? 'Formats' : 'Font'), enumerable: true },
                subCommand: { value: (value === 'Format' ? item.value : value), enumerable: true }
            });
        });
        return dropDownItems;
    }

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
                                ((type === 'quick') ? '' : (getDropDownValue(fontItems, fontNameContent, 'text', 'text')) === 'Default' ? this.i10n.getConstant('fontName') : getDropDownValue(fontItems, fontNameContent, 'text', 'text')));
                            this.fontNameDropDown.setProperties({ content: content });
                            if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                                this.getEditNode().style.fontFamily = this.parent.fontFamily.default;
                            } else {
                                this.getEditNode().style.removeProperty('font-family');
                            }
                            break;
                        }
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
                            const fontSizeContent: string = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[0].text :
                                this.parent.fontSize.default;
                            const fontSizeDropDownContent: string = ((fontSizeContent === 'Default') ? getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'text', 'text') : getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text'));
                            content = this.dropdownContent(
                                this.parent.fontSize.width, type,
                                getFormattedFontSize((fontSizeDropDownContent === 'Default') ? this.i10n.getConstant('fontSize') : fontSizeDropDownContent));
                            this.fontSizeDropDown.setProperties({ content: content });
                            if (!isNullOrUndefined(this.parent.fontSize.default)) {
                                this.getEditNode().style.fontSize = this.parent.fontSize.default;
                            } else {
                                this.getEditNode().style.removeProperty('font-size');
                            }
                            break;
                        }
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
                            break;
                        }
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
    private rowDropDown(type: string, tbElement: HTMLElement, targetElement: Element, targetEle: HTMLElement): void {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableRows', tbElement);
        const rowItems: IDropDownItemModel[] = Array.from(model.tableRowsItems);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        if (targetEle.closest('th')) {
            rowItems.shift();
        }
        this.tableRowsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-rows e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: 'TableRows',
            items: rowItems,
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
        this.tableCellDropDown = this.toolbarRenderer.renderDropDownButton({
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

    private renderDisplayDropDown(type: string, tbElement: HTMLElement, targetElement: Element, item?: string): void {
        const targetEle: Element = targetElement;
        targetElement = select('#' + this.parent.getID() + '_' + type + (item === 'display' ? '_Display' : item === 'videolayoutoption' ? '_VideoLayoutOption' : '_AudioLayoutOption'), tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.displayDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: item === 'display' ? 'e-display e-icons' : item === 'videolayoutoption' ? 'e-video-display e-icons' : 'e-audio-display e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: item === 'display' ? 'Display' : item === 'videolayoutoption' ? 'VideoLayoutOption' : 'AudioLayoutOption',
            items: item === 'display' ? model.imageDisplayItems : item === 'videolayoutoption' ? model.videoLayoutOptionItems : model.audioLayoutOptionItems,
            element: targetElement,
            activeElement: targetEle
        } as IDropDownModel);
    }
    private renderAlignmentDropDown(type: string, tbElement: HTMLElement, targetElement: Element, item?: string): void {
        const targetEle: Element = targetElement;
        targetElement = select('#' + this.parent.getID() + '_' + type + (item === 'align' ? '_Align' : '_VideoAlign'), tbElement);
        if (targetElement.classList.contains(classes.CLS_DROPDOWN_BTN)) {
            return;
        }
        this.imageAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-justify-left e-icons',
            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ICONS + ' ' + classes.CLS_QUICK_DROPDOWN,
            itemName: item === 'align' ? 'Align' : 'VideoAlign',
            items: item === 'align' ? model.imageAlignItems : model.videoAlignItems,
            element: targetElement,
            activeElement: targetEle
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
            this.formatDropDown = null;
        }
        if (this.fontNameDropDown) {
            this.removeDropDownClasses(this.fontNameDropDown.element);
            this.fontNameDropDown.destroy();
            this.fontNameDropDown = null;
        }
        if (this.fontSizeDropDown) {
            this.removeDropDownClasses(this.fontSizeDropDown.element);
            this.fontSizeDropDown.destroy();
            this.fontSizeDropDown = null;
        }
        if (this.alignDropDown) {
            this.removeDropDownClasses(this.alignDropDown.element);
            this.alignDropDown.destroy();
            this.alignDropDown = null;
        }
        if (this.imageAlignDropDown) {
            this.removeDropDownClasses(this.imageAlignDropDown.element);
            this.imageAlignDropDown.destroy();
            this.imageAlignDropDown = null;
        }
        if (this.displayDropDown) {
            this.removeDropDownClasses(this.displayDropDown.element);
            this.displayDropDown.destroy();
            this.displayDropDown = null;
        }
        if (this.tableRowsDropDown) {
            this.removeDropDownClasses(this.tableRowsDropDown.element);
            this.tableRowsDropDown.destroy();
            this.tableRowsDropDown = null;
        }
        if (this.tableColumnsDropDown) {
            this.removeDropDownClasses(this.tableColumnsDropDown.element);
            this.tableColumnsDropDown.destroy();
            this.tableColumnsDropDown = null;
        }
        if (this.tableCellDropDown) {
            this.removeDropDownClasses(this.tableCellDropDown.element);
            this.tableCellDropDown.destroy();
            this.tableCellDropDown = null;
        }
        if (this.tableCellVerticalAlignDropDown) {
            this.removeDropDownClasses(this.tableCellVerticalAlignDropDown.element);
            this.tableCellVerticalAlignDropDown.destroy();
            this.tableCellVerticalAlignDropDown = null;
        }
        if (this.numberFormatListDropDown) {
            this.removeDropDownClasses(this.numberFormatListDropDown.element);
            this.numberFormatListDropDown.destroy();
            this.numberFormatListDropDown = null;
        }
        if (this.bulletFormatListDropDown) {
            this.removeDropDownClasses(this.bulletFormatListDropDown.element);
            this.bulletFormatListDropDown.destroy();
            this.bulletFormatListDropDown = null;
        }
        if (this.codeBlockSplitButton) {
            this.removeDropDownClasses(this.codeBlockSplitButton.element);
            this.codeBlockSplitButton.destroy();
            this.codeBlockSplitButton = null;
        }
        if (this.tableBorderStyleDropDown) {
            this.removeDropDownClasses(this.tableBorderStyleDropDown.element);
            this.tableBorderStyleDropDown.destroy();
            this.tableBorderStyleDropDown = null;
        }
        this.toolbarRenderer = null;
    }

    // Toggles the appropriate dropdown menu (number format or bullet format) based on the toolbar click event
    private showDropDown(e: { [key: string]: Object }): void {
        if (!isNullOrUndefined(this.numberFormatListDropDown) && (e.toolbarClick === 'NumberFormatList')) {
            this.numberFormatListDropDown.toggle();
        }
        else if (!isNullOrUndefined(this.bulletFormatListDropDown) && (e.toolbarClick === 'BulletFormaList')) {
            this.bulletFormatListDropDown.toggle();
        }
        else if (!isNullOrUndefined(this.codeBlockSplitButton) && (e.toolbarClick === 'CodeBlock')) {
            this.codeBlockSplitButton.toggle();
        }
    }

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
        if (this.numberFormatListDropDown) {
            this.numberFormatListDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.bulletFormatListDropDown) {
            this.bulletFormatListDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.tableBorderStyleDropDown) {
            this.tableBorderStyleDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private updateCss(dropDownObj: DropDownButton, e: ICssClassArgs): void {
        if (dropDownObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                dropDownObj.setProperties({ cssClass: (dropDownObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                dropDownObj.setProperties({ cssClass: (dropDownObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private setCssClass(e: ICssClassArgs): void {
        const dropDownObj: DropDownButton[] = [
            this.formatDropDown, this.fontNameDropDown, this.fontSizeDropDown, this.alignDropDown, this.imageAlignDropDown,
            this.displayDropDown, this.numberFormatListDropDown, this.bulletFormatListDropDown, this.tableRowsDropDown,
            this.tableColumnsDropDown, this.tableCellDropDown, this.tableCellVerticalAlignDropDown, this.tableBorderStyleDropDown
        ];
        for (let i: number = 0; i < dropDownObj.length; i++) {
            this.updateCss(dropDownObj[i as number], e);
        }
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.beforeDropDownItemRender, this.beforeRender, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.showDropDown, this.showDropDown, this);
    }

    private onIframeMouseDown(): void {
        const toolbarElement: HTMLElement = (this.parent.getToolbarElement() as HTMLElement);
        if (!isNullOrUndefined(toolbarElement)) {
            const dropdownBtnEle: NodeListOf<HTMLElement> = toolbarElement.querySelectorAll('.e-dropdown-btn[aria-expanded="true"]');
            if (dropdownBtnEle && dropdownBtnEle.length > 0) {
                this.closeOpenDropdowns();
            }
            if (toolbarElement.querySelector('.e-rte-dropdown.e-dropdown-btn.e-active')) {
                const targetEle: HTMLElement = toolbarElement.querySelector('.e-rte-dropdown.e-dropdown-btn.e-active');
                const hasFontColor: boolean = targetEle.classList.contains('e-rte-font-colorpicker');
                if (hasFontColor || targetEle.classList.contains('e-rte-background-colorpicker')) {
                    this.parent.notify(events.showColorPicker, {
                        toolbarClick: hasFontColor ?
                            'fontcolor' : 'backgroundcolor'
                    });
                }
            }
        }
    }

    private closeOpenDropdowns(): void {
        const dropdowns: DropDownButton[] = [
            this.formatDropDown,
            this.fontNameDropDown,
            this.fontSizeDropDown,
            this.alignDropDown,
            this.imageAlignDropDown,
            this.displayDropDown,
            this.numberFormatListDropDown,
            this.bulletFormatListDropDown,
            this.tableRowsDropDown,
            this.tableColumnsDropDown,
            this.tableCellDropDown,
            this.tableCellVerticalAlignDropDown,
            this.tableBorderStyleDropDown
        ];
        dropdowns.forEach((dropdown: DropDownButton) => {
            if (dropdown && dropdown.dropDown && dropdown.dropDown.element && dropdown.dropDown.element.classList.contains('e-popup-open')) {
                dropdown.toggle();
            }
        });
    }

    protected removeEventListener(): void {
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.beforeDropDownItemRender, this.beforeRender);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.showDropDown, this.showDropDown);
    }

    public destroy(): void {
        this.removeEventListener();
        this.destroyDropDowns();
    }
}
