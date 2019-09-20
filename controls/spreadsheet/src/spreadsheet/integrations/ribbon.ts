import { Ribbon as RibbonComponent, RibbonItemModel, ExpandCollapseEventArgs } from '../../ribbon/index';
import { Spreadsheet } from '../base/index';
import { ribbon, MenuSelectArgs, selectionComplete, beforeRibbonCreate, dialog, IRenderer, destroyComponent } from '../common/index';
import { enableRibbonItems, ribbonClick, paste, locale, refreshSheetTabs } from '../common/index';
import { tabSwitch, getUpdateUsingRaf, enableToolbar } from '../common/index';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, ClickEventArgs, Toolbar, Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { SelectingEventArgs } from '@syncfusion/ej2-navigations';
import { extend, L10n, isNullOrUndefined, getComponent, closest, detach } from '@syncfusion/ej2-base';
import { SheetModel, getCellIndexes, CellModel, getFormatFromType, getTypeFromFormat } from '../../workbook/index';
import { DropDownButton, OpenCloseMenuEventArgs, SplitButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { calculatePosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { applyNumberFormatting, getFormattedCellObject, activeCellChanged, textDecorationUpdate } from '../../workbook/common/index';
import { sheetsDestroyed } from '../../workbook/common/index';
import { NumberFormatType, getCell, FontFamily, VerticalAlign, TextAlign, CellStyleModel, setCellFormat } from '../../workbook/index';
import { Button } from '@syncfusion/ej2-buttons';
import { ColorPicker } from './color-picker';
import { Dialog } from '../services';

/**
 * Represents Ribbon for Spreadsheet.
 */
export class Ribbon {
    private parent: Spreadsheet;
    private ribbon: RibbonComponent;
    private numFormatDDB: DropDownButton;
    private fontSizeDdb: DropDownButton;
    private fontNameDdb: DropDownButton;
    private textAlignDdb: DropDownButton;
    private verticalAlignDdb: DropDownButton;
    private fontNameIndex: number = 5;
    private numPopupWidth: number = 0;
    private activeTab: number = 1;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        new ColorPicker(parent);
    }
    public getModuleName(): string {
        return 'ribbon';
    }
    private initRibbon(args: { uiUpdate?: boolean }): void {
        if (!this.parent.showRibbon && this.ribbon) {
            this.destroy(); return;
        }
        this.parent.notify(beforeRibbonCreate, {});
        if (this.parent.isMobileView()) {
            this.createMobileView();
        } else {
            this.createRibbon(args);
        }
    }
    private getRibbonItems(): RibbonItemModel[] {
        let text: string; let id: string = this.parent.element.id;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let items: RibbonItemModel[] = [
            {
                type: 'Menu',
                menuItems: [
                    {
                        text: this.parent.isMobileView() ? '' : l10n.getConstant('File'),
                        iconCss: this.parent.isMobileView() ? 'e-icons e-file-menu-icon' : null,
                        items: [
                            { text: l10n.getConstant('New'), id: 'New', iconCss: 'e-new e-icons' },
                            { text: l10n.getConstant('Open'), id: 'Open', iconCss: 'e-open e-icons' },
                            {
                                text: l10n.getConstant('SaveAs'),
                                iconCss: 'e-save e-icons',
                                items: [
                                    { text: l10n.getConstant('ExcelXlsx'), id: 'Xlsx', iconCss: 'e-xlsx e-icons' },
                                    { text: l10n.getConstant('ExcelXls'), id: 'Xls', iconCss: 'e-xls e-icons' },
                                    { text: l10n.getConstant('CSV'), id: 'Csv', iconCss: 'e-csv e-icons' }
                                ]
                            }]
                    }]
            },
            {
                header: { text: l10n.getConstant('Home') },
                content: [
                    { prefixIcon: 'e-cut-icon', tooltipText: `${l10n.getConstant('Cut')} (Ctrl+X)`, id: id + '_cut' },
                    { prefixIcon: 'e-copy-icon', tooltipText: `${l10n.getConstant('Copy')} (Ctrl+C)`, id: id + '_copy' },
                    { tooltipText: `${l10n.getConstant('Paste')} (Ctrl+V)`, template: this.getPasteBtn() },
                    { type: 'Separator' },
                    { template: this.parent.createElement('button', { id: id + '_number_format' }),
                        tooltipText: l10n.getConstant('NumberFormat') }, { type: 'Separator' },
                    { template: this.parent.createElement('button', { id: id + '_font_name' }),
                        tooltipText: l10n.getConstant('Font') }, { type: 'Separator' },
                    { template: this.parent.createElement('button', { id: id + '_font_size' }),
                        tooltipText: l10n.getConstant('FontSize') }, { type: 'Separator' },
                    { template: this.parent.createElement('button', { id: id + '_bold' }),
                        tooltipText: `${l10n.getConstant('Bold')} (Ctrl+B)` },
                    { template: this.parent.createElement('button', { id: id + '_italic' }),
                        tooltipText: `${l10n.getConstant('Italic')} (Ctrl+I)` },
                    { template: this.parent.createElement('button', { id: id + '_line-through' }),
                        tooltipText: `${l10n.getConstant('Strikethrough')} (Ctrl+5)` },
                    { template: this.parent.createElement('button', { id: id + '_underline' }),
                        tooltipText: `${l10n.getConstant('Underline')} (Ctrl+U)` },
                    { template: document.getElementById(`${id}_font_color_picker`), tooltipText: l10n.getConstant('TextColor') },
                    { type: 'Separator' },
                    { template: document.getElementById(`${id}_fill_color_picker`), tooltipText: l10n.getConstant('FillColor') },
                    { type: 'Separator' }, { template: this.parent.createElement('button', { id: id + '_text_align' }),
                        tooltipText: l10n.getConstant('HorizontalAlignment') },
                    { template: this.parent.createElement('button', { id: id + '_vertical_align' }),
                        tooltipText: l10n.getConstant('VerticalAlignment') }]
            },
            {
                header: { text: l10n.getConstant('Formulas') },
                content: [ { prefixIcon: 'e-insert-function', text: l10n.getConstant('InsertFunction'), id: id + '_insert_function' }]
            },
            {
                header: { text: 'View' },
                content: [
                    { prefixIcon: 'e-hide-headers', text: this.getLocaleText(l10n, 'Headers'), id: id + '_headers'}, { type: 'Separator' },
                    { prefixIcon: 'e-hide-gridlines', text: this.getLocaleText(l10n, 'GridLines'), id: id + '_gridlines' }]
            }];
        return items;
    }

    private getPasteBtn(): Element {
        let btn: HTMLElement = this.parent.element.appendChild(
            this.parent.createElement('button', { id: this.parent.element.id + '_paste' }));
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let pasteSplitBtn: SplitButton = new SplitButton(
            {
                iconCss: 'e-icons e-paste-icon',
                items: [
                    { text: l10n.getConstant('All'), id: 'All' },
                    { text: l10n.getConstant('Values'), id: 'Values' },
                    { text: l10n.getConstant('Formats'), id: 'Formats' }],
                select: (args: MenuEventArgs) => {
                    this.parent.notify(paste, { type: args.item.id });
                },
                click: () => {
                    this.parent.notify(paste, null);
                },
                close: () => { this.parent.element.focus(); }
            });
        pasteSplitBtn.createElement = this.parent.createElement;
        pasteSplitBtn.appendTo(btn);
        return btn.parentElement;
    }

    private getLocaleText(l10n: L10n, str: string, setClass?: boolean): string {
        let text: string;
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet['show' + str]) {
            if (setClass) { this.parent.getMainContent().classList.remove('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Hide' + str);
        } else {
            if (setClass) { this.parent.getMainContent().classList.add('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Show' + str);
        }
        return text;
    }
    private createRibbon(args: { uiUpdate?: boolean }): void {
        let ribbonElement: HTMLElement = this.parent.createElement('div');
        this.ribbon = new RibbonComponent({
            items: this.getRibbonItems(),
            fileItemSelect: this.fileItemSelect.bind(this),
            beforeOpen: this.fileMenuBeforeOpen.bind(this),
            beforeClose: this.fileMenuBeforeClose.bind(this),
            clicked: this.toolbarClicked.bind(this),
            created: this.ribbonCreated.bind(this),
            selecting: this.tabSelecting.bind(this),
            expandCollapse: this.expandCollapseHandler.bind(this)
        });
        this.ribbon.createElement = this.parent.createElement;
        if (args && args.uiUpdate) {
            let refEle: Element = this.parent.element.querySelector('.e-formula-bar-panel') ||
                document.getElementById(this.parent.element.id + '_sheet_panel');
            this.parent.element.insertBefore(ribbonElement, refEle);
        } else {
            this.parent.element.appendChild(ribbonElement);
        }
        this.ribbon.appendTo(ribbonElement);
    }
    private tabSelecting(args: SelectingEventArgs): void {
        if (args.selectingIndex && args.selectingIndex !== this.activeTab) {
            this.activeTab = args.selectingIndex;
            this.refreshRibbonContent();
            this.parent.notify(tabSwitch, { idx: args.selectingIndex });
        }
    }
    private ribbonCreated(): void {
        let id: string = this.parent.element.id; let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let numFormatBtn: HTMLElement = document.getElementById(id + '_number_format');
        numFormatBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'General' }));
        this.numFormatDDB = new DropDownButton({
            items: this.getNumFormatDdbItems(l10n, id),
            content: '',
            select: (args: MenuEventArgs): void => this.numDDBSelect(args),
            open: (args: OpenCloseMenuEventArgs): void => this.numDDBOpen(args),
            beforeItemRender: (args: MenuEventArgs): void => this.previewNumFormat(args),
            close: (): void => this.parent.element.focus(),
            cssClass: 'e-flat e-numformat-ddb',
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.numFormatDDB.createElement = this.parent.createElement;
        this.numFormatDDB.appendTo(numFormatBtn);
        if (this.parent.enableClipboard) { this.enableRibbonItems({ id: id + '_paste', isEnable: false }); }
        this.fontSizeDdb = new DropDownButton({
            cssClass: 'e-font-size-ddb',
            content: '11',
            items: [{ text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '14' }, { text: '16' },
            { text: '18' }, { text: '20' }, { text: '22' }, { text: '24' }, { text: '26' }, { text: '28' }, { text: '36' },
            { text: '48' }, { text: '72' }],
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.tBarDdbBeforeOpen(args);
                this.refreshSelected(this.fontSizeDdb, args.element, 'content', 'text');
            },
            select: (args: MenuEventArgs): void => {
                this.fontSizeDdb.content = args.item.text;
                this.fontSizeDdb.dataBind();
                this.parent.notify(setCellFormat, { style: { fontSize: `${args.item.text}pt` }, onActionUpdate: true });
            },
            close: (): void => this.parent.element.focus()
        });
        this.fontSizeDdb.createElement = this.parent.createElement;
        this.fontSizeDdb.appendTo('#' + id + '_font_size');
        let fontNameBtn: HTMLElement = document.getElementById(id + '_font_name');
        fontNameBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'Calibri' }));
        this.fontNameDdb = new DropDownButton({
            cssClass: 'e-font-family',
            items: this.getFontFamilyItems(),
            select: (args: MenuEventArgs): void => {
                this.refreshFontNameSelection(args.item.text);
                this.parent.notify(setCellFormat, { style: { fontFamily: args.item.text as FontFamily }, onActionUpdate: true });
            },
            close: (): void => this.parent.element.focus(),
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.fontNameDdb.createElement = this.parent.createElement;
        this.fontNameDdb.appendTo(fontNameBtn);
        this.textAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-left-icon',
            items: [{ iconCss: 'e-icons e-left-icon' }, { iconCss: 'e-icons e-center-icon' }, { iconCss: 'e-icons e-right-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.textAlignDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                this.textAlignDdb.iconCss = args.item.iconCss; this.textAlignDdb.dataBind();
                this.parent.notify(setCellFormat, {
                    style: { textAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as TextAlign }, onActionUpdate: true
                });
            },
            close: (): void => this.parent.element.focus()
        });
        this.textAlignDdb.createElement = this.parent.createElement;
        this.textAlignDdb.appendTo('#' + id + '_text_align');
        this.verticalAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-bottom-icon',
            items: [{ iconCss: 'e-icons e-top-icon' }, { iconCss: 'e-icons e-middle-icon' }, { iconCss: 'e-icons e-bottom-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.verticalAlignDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                this.verticalAlignDdb.iconCss = args.item.iconCss; this.verticalAlignDdb.dataBind();
                this.parent.notify(setCellFormat, {
                    style: { verticalAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as VerticalAlign }, onActionUpdate: true
                });
            },
            close: (): void => this.parent.element.focus()
        });
        this.verticalAlignDdb.createElement = this.parent.createElement;
        this.verticalAlignDdb.appendTo('#' + id + '_vertical_align');
        let btn: HTMLElement;
        ['bold', 'italic', 'line-through', 'underline'].forEach((name: string): void => {
            let btnObj: Button = new Button({ iconCss: `e-icons e-${name}-icon`, isToggle: true });
            btnObj.createElement = this.parent.createElement;
            btn = document.getElementById(`${id}_${name}`); btnObj.appendTo(btn);
            btnObj.element.addEventListener('click', this.toggleBtnClicked.bind(this));
        });
        (this.ribbon.element.querySelector('.e-drop-icon') as HTMLElement).title = l10n.getConstant('CollapseToolbar');
    }
    private alignItemRender(args: MenuEventArgs): void {
        let text: string = args.item.iconCss.split(' e-')[1].split('-icon')[0];
        text = text[0].toUpperCase() + text.slice(1, text.length);
        args.element.title = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Align' + text);
    }
    private toggleBtnClicked(e: MouseEvent | KeyboardEvent): void {
        let target: Element = closest(e.target as Element, '.e-btn');
        let parentId: string = this.parent.element.id; let id: string = target.id;
        let property: string = setCellFormat;
        let defaultModel: CellStyleModel; let activeModel: CellStyleModel;
        switch (id) {
            case `${parentId}_bold`:
                defaultModel = { fontWeight: 'normal' }; activeModel = { fontWeight: 'bold' };
                break;
            case `${parentId}_italic`:
                defaultModel = { fontStyle: 'normal' }; activeModel = { fontStyle: 'italic' };
                break;
            case `${parentId}_line-through`:
                property = textDecorationUpdate; defaultModel = { textDecoration: 'line-through' }; activeModel = defaultModel;
                break;
            case `${parentId}_underline`:
                property = textDecorationUpdate; defaultModel = { textDecoration: 'underline' }; activeModel = defaultModel;
                break;
        }
        if (target.classList.contains('e-active')) {
            this.parent.notify(property, {
                style: activeModel, onActionUpdate: true
            });
        } else {
            this.parent.notify(property, {
                style: defaultModel, onActionUpdate: true
            });
        }
        this.parent.element.focus();
    }
    private getCellStyleValue(cssProp: string, indexes: number[]): string {
        let cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
        let value: string = this.parent.cellStyle[cssProp];
        if (cell && cell.style && cell.style[cssProp]) {
            value = cell.style[cssProp];
        }
        return value;
    }
    private refreshSelected(inst: DropDownButton, element: HTMLElement, key: string, itemKey: string = key): void {
        for (let i: number = 0; i < inst.items.length; i++) {
            if (inst.items[i][itemKey] === inst[key]) {
                element.children[i].classList.add('e-selected'); break;
            }
        }
    }
    private expandCollapseHandler(args: ExpandCollapseEventArgs): void {
        let target: HTMLElement = this.ribbon.element.querySelector('.e-drop-icon') as HTMLElement;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (args.expanded) {
            target.title = l10n.getConstant('CollapseToolbar');
        } else {
            target.title = l10n.getConstant('ExpandToolbar');
        }
        this.parent.setPanelSize();
    }
    private getNumFormatDdbItems(l10n: L10n, id: string): ItemModel[] {
        return [
            { id: id + 'item1', text: l10n.getConstant(NumberFormatType.General) },
            { id: id + 'item2', text: l10n.getConstant(NumberFormatType.Number) },
            { id: id + 'item3', text: l10n.getConstant(NumberFormatType.Currency) },
            { id: id + 'item4', text: l10n.getConstant(NumberFormatType.Accounting) },
            { id: id + 'item5', text: l10n.getConstant(NumberFormatType.ShortDate) },
            { id: id + 'item6', text: l10n.getConstant(NumberFormatType.LongDate) },
            { id: id + 'item7', text: l10n.getConstant(NumberFormatType.Time) },
            { id: id + 'item8', text: l10n.getConstant(NumberFormatType.Percentage) },
            { id: id + 'item9', text: l10n.getConstant(NumberFormatType.Fraction) },
            { id: id + 'item10', text: l10n.getConstant(NumberFormatType.Scientific) },
            { id: id + 'item11', text: l10n.getConstant(NumberFormatType.Text) }
        ];
    }
    private getFontFamilyItems(): ItemModel[] {
        return [{ text: 'Arial' }, { text: 'Arial Black' }, { text: 'Axettac Demo' }, { text: 'Batang' }, { text: 'Book Antiqua' },
        { text: 'Calibri', iconCss: 'e-icons e-selected-icon' }, { text: 'Courier' }, { text: 'Courier New' },
        { text: 'Din Condensed' }, { text: 'Georgia' }, { text: 'Helvetica' }, { text: 'Helvetica New' }, { text: 'Roboto' },
        { text: 'Tahoma' }, { text: 'Times New Roman' }, { text: 'Verdana' }];
    }

    private enableToolbar(args: { enable: boolean }): void {
        this.ribbon.enableItems(args.enable);
    }

    private numDDBSelect(args: MenuEventArgs): void {
        this.parent.notify(applyNumberFormatting, {
            format: getFormatFromType(args.item.text),
            range: this.parent.getActiveSheet().selectedRange
        });
        this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
        this.refreshNumFormatSelection(args.item.text);
    }

    private tBarDdbBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        let viewportHeight: number = this.parent.viewport.height;
        let actualHeight: number = (parseInt(getComputedStyle(args.element.firstElementChild).height, 10) * args.items.length) +
            (parseInt(getComputedStyle(args.element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            args.element.style.height = `${viewportHeight}px`; args.element.style.overflowY = 'auto';
        }
    }

    private numDDBOpen(args: OpenCloseMenuEventArgs): void {
        this.numPopupWidth = 0;
        let elemList: NodeListOf<Element> = args.element.querySelectorAll('span.e-numformat-preview-text');
        for (let i: number = 0, len: number = elemList.length; i < len; i++) {
            if (this.numPopupWidth < (elemList[i] as HTMLElement).offsetWidth) {
                this.numPopupWidth = (elemList[i] as HTMLElement).offsetWidth;
            }
        }
        let popWidth: number = this.numPopupWidth + 160;
        (document.querySelector('.e-numformat-ddb.e-dropdown-popup') as HTMLElement).style.width = `${popWidth}px`;
    }

    private previewNumFormat(args: MenuEventArgs): void {
        let cellIndex: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let cell: CellModel = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet());
        let eventArgs: { [key: string]: string | number | boolean } = {
            type: args.item.text,
            formattedText: '',
            value: cell && cell.value ? cell.value : '',
            format: getFormatFromType(args.item.text),
            sheetIndex: this.parent.activeSheetTab,
            onLoad: true
        };
        let numElem: HTMLElement = this.parent.createElement('div', {
            className: 'e-numformat-text',
            styles: 'width:100%',
            innerHTML: args.element.innerHTML
        });
        args.element.innerHTML = '';
        this.parent.notify(getFormattedCellObject, eventArgs);
        let previewElem: HTMLElement = this.parent.createElement('span', {
            className: 'e-numformat-preview-text',
            styles: 'float:right;',
            innerHTML: eventArgs.formattedText.toString()
        });
        numElem.appendChild(previewElem);
        args.element.appendChild(numElem);
    }

    private refreshRibbonContent(): void {
        switch (this.activeTab) {
            case 1: this.refreshFirstTabContent(getCellIndexes(this.parent.getActiveSheet().activeCell));
                break;
            case 2:
                // Second tab functionality comes here
                break;
            case 3: this.refreshThirdTabContent();
                break;
        }
    }

    private refreshFirstTabContent(indexes: number[]): void {
        if (!isNullOrUndefined(document.getElementById(this.parent.element.id + '_number_format'))) {
            this.numFormatDDB = getComponent(document.getElementById(this.parent.element.id + '_number_format'), DropDownButton);
        }
        let actCell: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let cell: CellModel = getCell(actCell[0], actCell[1], this.parent.getActiveSheet(), true);
        cell = cell ? cell : {};
        let type: string = getTypeFromFormat(cell.format ? cell.format : NumberFormatType.General);
        if (this.numFormatDDB) {
            this.refreshNumFormatSelection(l10n.getConstant(type));
        }
        if (this.fontNameDdb) {
            this.refreshFontNameSelection(this.getCellStyleValue('fontFamily', indexes));
        }
        if (this.fontSizeDdb) {
            let value: string = this.getCellStyleValue('fontSize', indexes).split('pt')[0];
            if (value !== this.fontSizeDdb.content) {
                this.fontSizeDdb.content = value; this.fontSizeDdb.dataBind();
            }
        }
        if (this.textAlignDdb) {
            let value: string = `e-icons e-${this.getCellStyleValue('textAlign', indexes).toLowerCase()}-icon`;
            if (value !== this.textAlignDdb.iconCss) {
                this.textAlignDdb.iconCss = value; this.textAlignDdb.dataBind();
            }
        }
        if (this.verticalAlignDdb) {
            let value: string = `e-icons e-${this.getCellStyleValue('verticalAlign', indexes).toLowerCase()}-icon`;
            if (value !== this.verticalAlignDdb.iconCss) {
                this.verticalAlignDdb.iconCss = value; this.verticalAlignDdb.dataBind();
            }
        }
        let btn: HTMLElement; let id: string = this.parent.element.id; let value: string;
        let fontProps: string[] = ['fontWeight', 'fontStyle', 'textDecoration', 'textDecoration'];
        ['bold', 'italic', 'line-through', 'underline'].forEach((name: string, index: number): void => {
            btn = document.getElementById(`${id}_${name}`);
            if (btn) {
                value = this.getCellStyleValue(fontProps[index], indexes).toLowerCase();
                if (value.indexOf(name) > -1) {
                    btn.classList.add('e-active');
                } else {
                    if (btn.classList.contains('e-active')) { btn.classList.remove('e-active'); }
                }
            }
        });
    }
    private refreshFontNameSelection(fontFamily: string): void {
        if (fontFamily !== this.fontNameDdb.items[this.fontNameIndex].text) {
            this.fontNameDdb.element.firstElementChild.textContent = fontFamily;
            for (let i: number = 0; i < this.fontNameDdb.items.length; i++) {
                if (this.fontNameDdb.items[i].text === fontFamily) {
                    this.fontNameDdb.items[i].iconCss = 'e-icons e-selected-icon';
                    this.fontNameDdb.items[this.fontNameIndex].iconCss = '';
                    this.fontNameDdb.setProperties({ 'items': this.fontNameDdb.items }, true);
                    this.fontNameIndex = i;
                    break;
                }
            }
        }
    }

    private refreshNumFormatSelection(type: string): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        for (let i: number = 0; i < this.numFormatDDB.items.length; i++) {
            if (this.numFormatDDB.items[i].iconCss !== '') {
                this.numFormatDDB.items[i].iconCss = '';
            }
            if (this.numFormatDDB.items[i].text === type) {
                this.numFormatDDB.items[i].iconCss = 'e-icons e-selected-icon';
            }
        }
        this.numFormatDDB.element.firstElementChild.textContent = type;
        this.numFormatDDB.setProperties({ 'items': this.numFormatDDB.items }, true);
    }

    private fileItemSelect(args: MenuEventArgs): void {
        let selectArgs: MenuSelectArgs = <MenuSelectArgs>extend({ cancel: false }, args);
        this.parent.trigger('fileItemSelect', selectArgs);
        if (!selectArgs.cancel) {
            switch (args.item.id) {
                case 'Open':
                    (this.parent.element.querySelector('#' + this.parent.element.id + '_fileUpload') as HTMLElement).click();
                    break;
                case 'Xlsx':
                case 'Xls':
                case 'Csv':
                    this.parent.save({ saveType: args.item.id });
                    break;
                case 'New':
                    let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                    dialogInst.show({
                        height: 200, width: 400, isModal: true, showCloseIcon: true,
                        content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DestroyAlert'),
                        beforeOpen: (): void => this.parent.element.focus(),
                        buttons: [{
                            buttonModel: {
                                content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true
                            },
                            click: (): void => {
                                this.parent.sheets.length = 0; this.parent.createSheet(); dialogInst.hide();
                                this.parent.activeSheetTab = this.parent.sheets.length;
                                this.parent.setProperties({ 'activeSheetTab': this.parent.sheets.length }, true);
                                this.parent.notify(refreshSheetTabs, {});
                                this.parent.notify(sheetsDestroyed, {});
                                this.parent.renderModule.refreshSheet();
                            }
                        }]
                    });
                    break;
            }
        }
    }
    private toolbarClicked(args: ClickEventArgs): void {
        let parentId: string = this.parent.element.id; let text: string;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let sheet: SheetModel = this.parent.getActiveSheet();
        switch (args.item.id) {
            case parentId + '_headers':
                sheet.showHeaders = !sheet.showHeaders;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                (this.parent.serviceLocator.getService('sheet') as IRenderer).showHideHeaders();
                text = this.getLocaleText(l10n, 'Headers', false);
                args.item.text = text;
                this.ribbon.items[3].content[0].text = text;
                this.updateToggleText('headers', text);
                this.parent.element.focus();
                break;
            case parentId + '_gridlines':
                sheet.showGridLines = !sheet.showGridLines;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                text = this.getLocaleText(l10n, 'GridLines', true);
                args.item.text = text;
                this.ribbon.items[3].content[2].text = text;
                this.updateToggleText('gridlines', text);
                this.parent.element.focus();
                break;
        }
        this.parent.notify(ribbonClick, args);
    }

    private updateToggleText(item: string, text: string): void {
        getUpdateUsingRaf((): void => {
            this.ribbon.element.querySelector(`#${this.parent.element.id}_${item} .e-tbar-btn-text`).textContent = text;
        });
    }

    private refreshThirdTabContent(): void {
        let text: string; let idx: number; let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale); let itemPos: number[] = [0, 2];
        ['Headers', 'GridLines'].forEach((item: string, index: number): void => {
            idx = itemPos[index];
            if (sheet['show' + item]) {
                if (this.ribbon.items[3].content[idx].text === l10n.getConstant('Show' + item)) {
                    this.updateShowHideBtn('Hide', item, idx);
                }
            } else {
                if (this.ribbon.items[3].content[idx].text === l10n.getConstant('Hide' + item)) {
                    this.updateShowHideBtn('Show', item, idx);
                }
            }
        });
    }

    private updateShowHideBtn(showHideText: string, item: string, idx: number): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let text: string = l10n.getConstant(showHideText + item);
        this.ribbon.items[3].content[idx].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText(item.toLowerCase(), text);
    }

    private enableRibbonItems(args: { id: string, isEnable: boolean }): void {
        let ele: Element = document.getElementById(args.id);
        if (ele) {
            this.ribbon.enableItems(args.isEnable, <HTMLElement>closest(ele, '.e-toolbar-item'));
        }
    }

    private createMobileView(): void {
        let parentId: string = this.parent.element.id;
        let toobar: HTMLElement = this.parent.createElement('div', { className: 'e-header-toolbar' });
        let menu: HTMLUListElement = this.parent.createElement('ul') as HTMLUListElement;
        toobar.appendChild(menu);
        let toolbarObj: Toolbar = new Toolbar({
            items: [
                { prefixIcon: 'e-tick-icon', align: 'Left', id: parentId + 'focused_tick', cssClass: 'e-focused-tick' },
                { template: menu, align: 'Right', id: parentId + 'file_menu' },
            ],
            clicked: (args: ClickEventArgs): void => {
                switch (args.item.id) {
                    case parentId + 'focused_tick':
                        this.parent.element.classList.remove('e-mobile-focused');
                        this.parent.renderModule.setSheetPanelSize();
                        break;
                }
            },
            created: (): void => {
                let menuObj: Menu = new Menu(
                    {
                        cssClass: 'e-mobile e-file-menu',
                        enableRtl: true,
                        showItemOnClick: true,
                        items: this.ribbon.items[0].menuItems,
                        select: this.fileItemSelect.bind(this),
                        beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                            args.element.parentElement.classList.remove('e-rtl');
                            this.fileMenuBeforeOpen(args);
                        },
                        beforeClose: this.fileMenuBeforeClose.bind(this)
                    });
                menuObj.createElement = this.parent.createElement;
                menuObj.appendTo(menu);
            }
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toobar);
        this.parent.element.insertBefore(toobar, this.parent.element.firstElementChild);
        this.renderMobileToolbar();
    }
    private renderMobileToolbar(): void {
        let toolbarPanel: HTMLElement = this.parent.createElement('div', { className: 'e-toolbar-panel e-ribbon' });
        let toolbar: HTMLElement = this.parent.createElement('div');
        let ddb: HTMLButtonElement = this.parent.createElement('button') as HTMLButtonElement;
        toolbarPanel.appendChild(toolbar); toolbarPanel.appendChild(ddb);
        toolbarPanel.style.display = 'block';
        this.parent.element.appendChild(toolbarPanel);
        let ddbObj: DropDownButton = new DropDownButton({
            cssClass: 'e-caret-hide',
            content: this.ribbon.items[1].header.text as string,
            items: [
                { text: this.ribbon.items[1].header.text as string },
                { text: this.ribbon.items[2].header.text as string },
                { text: this.ribbon.items[3].header.text as string }
            ],
            select: (args: MenuEventArgs): void => {
                if (args.item.text !== ddbObj.content) {
                    toolbarObj.element.style.display = 'none';
                    ddbObj.content = args.item.text;
                    ddbObj.dataBind();
                    toolbarObj.items = this.ribbon.items[(ddbObj.items as MenuItemModel[]).indexOf(args.item) + 1].content;
                    toolbarObj.width = `calc(100% - ${ddb.getBoundingClientRect().width}px)`;
                    toolbarObj.element.style.display = '';
                    toolbarObj.dataBind();
                    toolbarObj.items[0].text = args.item.text;
                    toolbarObj.dataBind();
                }
            },
            open: (args: OpenCloseMenuEventArgs): void => {
                let element: HTMLElement = args.element.parentElement;
                let clientRect: ClientRect = element.getBoundingClientRect();
                let offset: OffsetPosition = calculatePosition(ddbObj.element, 'right', 'bottom');
                element.style.left = `${offset.left - clientRect.width}px`;
                element.style.top = `${offset.top - clientRect.height}px`;
                for (let i: number = 0; i < ddbObj.items.length; i++) {
                    if (ddbObj.content === ddbObj.items[i].text) {
                        args.element.children[i].classList.add('e-selected');
                        break;
                    }
                }
            },
            close: (): void => this.parent.element.focus()
        });
        ddbObj.createElement = this.parent.createElement;
        ddbObj.appendTo(ddb);
        let toolbarObj: Toolbar = new Toolbar({
            width: `calc(100% - ${ddb.getBoundingClientRect().width}px)`,
            items: this.ribbon.items[1].content,
            clicked: this.toolbarClicked.bind(this)
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toolbar);
        toolbarPanel.style.display = '';
    }
    private fileMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale); let wrapper: HTMLElement;
        let contents: string[] = ['.xlsx', '.xls', '.csv'];
        if (args.parentItem.text === l10n.getConstant('SaveAs')) {
            [].slice.call(args.element.children).forEach((li: HTMLElement, index: number): void => {
                wrapper = this.parent.createElement('div', { innerHTML: li.innerHTML });
                li.innerHTML = '';
                wrapper.appendChild(this.parent.createElement('span', { className: 'e-extension', innerHTML: contents[index] }));
                li.appendChild(wrapper);
            });
        }
        this.parent.trigger('fileMenuBeforeOpen', args);
    }
    private fileMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        this.parent.trigger('fileMenuBeforeClose', args);
    }

    private addEventListener(): void {
        this.parent.on(ribbon, this.initRibbon, this);
        this.parent.on(enableRibbonItems, this.enableRibbonItems, this);
        this.parent.on(activeCellChanged, this.refreshRibbonContent, this);
        this.parent.on(enableToolbar, this.enableToolbar, this);
    }
    public destroy(): void {
        let parentElem: HTMLElement = this.parent.element;
        let ribbonEle: HTMLElement = this.ribbon.element;
        let id: string = parentElem.id;
        destroyComponent(parentElem.querySelector('#' + id + '_paste'), SplitButton);
        destroyComponent(parentElem.querySelector('#' + id + '_number_format'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_size'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_name'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_text_align'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_vertical_align'), DropDownButton);
        ['bold', 'italic', 'line-through', 'underline'].forEach((name: string): void => {
            destroyComponent(parentElem.querySelector('#' + `${id}_${name}`), Button);
        });
        this.ribbon.destroy();
        if (ribbonEle) { detach(ribbonEle); } this.ribbon = null;
        this.removeEventListener();
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbon, this.initRibbon);
            this.parent.off(enableRibbonItems, this.enableRibbonItems);
            this.parent.off(activeCellChanged, this.refreshRibbonContent);
            this.parent.on(enableToolbar, this.enableToolbar, this);
        }
    }
}