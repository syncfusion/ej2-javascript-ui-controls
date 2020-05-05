import { Ribbon as RibbonComponent, RibbonItemModel, ExpandCollapseEventArgs } from '../../ribbon/index';
import { Spreadsheet } from '../base/index';
import { ribbon, MenuSelectEventArgs, selectionComplete, beforeRibbonCreate, removeDataValidation } from '../common/index';
import { initiateDataValidation, invalidData, setUndoRedo, blankWorkbook } from '../common/index';
import { dialog, reapplyFilter, enableFileMenuItems, applyProtect, protectCellFormat } from '../common/index';
import { findHandler, refreshSheetTabs } from '../common/index';
import { IRenderer, destroyComponent, performUndoRedo, beginAction, completeAction, applySort, hideRibbonTabs } from '../common/index';
import { enableToolbarItems, ribbonClick, paste, locale, initiateCustomSort, getFilteredColumn } from '../common/index';
import { tabSwitch, getUpdateUsingRaf, updateToggleItem, initiateHyperlink, editHyperlink } from '../common/index';
import { addRibbonTabs, addToolbarItems, hideFileMenuItems, addFileMenuItems, hideToolbarItems, enableRibbonTabs } from '../common/index';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, ClickEventArgs, Toolbar, Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ItemModel as TlbItemModel } from '@syncfusion/ej2-navigations';
import { SelectingEventArgs } from '@syncfusion/ej2-navigations';
import { ColorPicker, ColorPickerEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';
import { extend, L10n, isNullOrUndefined, getComponent, closest, detach, selectAll, select, EventHandler } from '@syncfusion/ej2-base';
import { SheetModel, getCellIndexes, CellModel, getFormatFromType, getTypeFromFormat, setCell, RowModel } from '../../workbook/index';
import { DropDownButton, OpenCloseMenuEventArgs, SplitButton, ClickEventArgs as BtnClickEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { calculatePosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { applyNumberFormatting, getFormattedCellObject, getRangeIndexes, SaveType, setMerge, MergeArgs } from '../../workbook/common/index';
import { activeCellChanged, textDecorationUpdate, BeforeCellFormatArgs, isNumber } from '../../workbook/common/index';
import { SortOrder, NumberFormatType, SetCellFormatArgs, sheetsDestroyed } from '../../workbook/common/index';
import { getCell, FontFamily, VerticalAlign, TextAlign, CellStyleModel, setCellFormat } from '../../workbook/index';
import { Button } from '@syncfusion/ej2-buttons';
import { ColorPicker as RibbonColorPicker } from './color-picker';
import { Dialog } from '../services';
import { Dialog as FindDialog } from '@syncfusion/ej2-popups';
import { findDlg } from '../common/index';


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
    private sortingDdb: DropDownButton;
    private datavalidationDdb: DropDownButton;
    private borderSplitBtn: SplitButton;
    private bordersMenu: Menu;
    private findDdb: Button;
    private findDialog: FindDialog;
    private border: string = '1px solid #000000';
    private fontNameIndex: number = 5;
    private numPopupWidth: number = 0;
    private pasteSplitBtn: SplitButton;
    private colorPicker: ColorPicker;
    private mergeSplitBtn: SplitButton;
    private findValue: string = '';
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        new RibbonColorPicker(parent);
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
    private getRibbonMenuItems(): MenuItemModel[] {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let id: string = this.parent.element.id;
        return [{
            text: this.parent.isMobileView() ? '' : l10n.getConstant('File'),
            iconCss: this.parent.isMobileView() ? 'e-icons e-file-menu-icon' : null, id: `${id}_File`,
            items: [
                { text: l10n.getConstant('New'), id: `${id}_New`, iconCss: 'e-new e-icons' },
                { text: l10n.getConstant('Open'), id: `${id}_Open`, iconCss: 'e-open e-icons' },
                {
                    text: l10n.getConstant('SaveAs'), iconCss: 'e-save e-icons', id: `${id}_Save_As`,
                    items: [
                        { text: l10n.getConstant('ExcelXlsx'), id: `${id}_Xlsx`, iconCss: 'e-xlsx e-icons' },
                        { text: l10n.getConstant('ExcelXls'), id: `${id}_Xls`, iconCss: 'e-xls e-icons' },
                        { text: l10n.getConstant('CSV'), id: `${id}_Csv`, iconCss: 'e-csv e-icons' }
                    ]
                }]
        }];
    }
    private getRibbonItems(): RibbonItemModel[] {
        let id: string = this.parent.element.id; let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let items: RibbonItemModel[] = [  {
                header: { text: l10n.getConstant('Home') },
                content: [
                    { prefixIcon: 'e-undo-icon', tooltipText: `${l10n.getConstant('Undo')} (Ctrl+Z)`, id: id + '_undo', disabled: true },
                    { prefixIcon: 'e-redo-icon', tooltipText: `${l10n.getConstant('Redo')} (Ctrl+Y)`, id: id + '_redo', disabled: true },
                    { type: 'Separator', id: id + '_separator_1' },
                    { prefixIcon: 'e-cut-icon', tooltipText: `${l10n.getConstant('Cut')} (Ctrl+X)`, id: id + '_cut' },
                    { prefixIcon: 'e-copy-icon', tooltipText: `${l10n.getConstant('Copy')} (Ctrl+C)`, id: id + '_copy' },
                    { tooltipText: `${l10n.getConstant('Paste')} (Ctrl+V)`, template: this.getPasteBtn(id), id: id + '_paste',
                         disabled: true
                    }, { type: 'Separator', id: id + '_separator_2' },
                    { template: this.getNumFormatDDB(id), tooltipText: l10n.getConstant('NumberFormat'), id: id + '_number_format' },
                    { type: 'Separator', id: id + '_separator_3' },
                    { template: this.getFontNameDDB(id), tooltipText: l10n.getConstant('Font'), id: id + '_font_name' },
                    { type: 'Separator', id: id + '_separator_4' },
                    { template: this.getFontSizeDDB(id), tooltipText: l10n.getConstant('FontSize'), id: id + '_font_size' },
                    { type: 'Separator', id: id + '_separator_5' },
                    { template: this.getBtn(id, 'bold'), tooltipText: `${l10n.getConstant('Bold')} (Ctrl+B)`, id: id + '_bold' },
                    { template: this.getBtn(id, 'italic'), tooltipText: `${l10n.getConstant('Italic')} (Ctrl+I)`, id: id + '_italic' },
                    { template: this.getBtn(id, 'line-through'), tooltipText: `${l10n.getConstant('Strikethrough')} (Ctrl+5)`,
                        id: id + '_line-through' },
                    { template: this.getBtn(id, 'underline'), tooltipText: `${l10n.getConstant('Underline')} (Ctrl+U)`,
                        id: id + '_underline' },
                    { template: document.getElementById(`${id}_font_color_picker`), tooltipText: l10n.getConstant('TextColor'),
                        id: id + '_font_color_picker' }, { type: 'Separator', id: id + '_separator_6' },
                    { template: document.getElementById(`${id}_fill_color_picker`), tooltipText: l10n.getConstant('FillColor'),
                        id: id + '_fill_color_picker' },
                    { template: this.getBordersDBB(id), id: id + '_borders' }, {
                    template: this.getMergeSplitBtn(id), tooltipText: l10n.getConstant('MergeCells'), id: id + '_merge_cells',
                    disabled: true }, { type: 'Separator', id: id + '_separator_7' },
                    { template: this.getTextAlignDDB(id), tooltipText: l10n.getConstant('HorizontalAlignment'), id:
                        id + '_text_align' }, { template: this.getVerticalAlignDDB(id), tooltipText:
                        l10n.getConstant('VerticalAlignment'), id: id + '_vertical_align' },
                    { template: this.getBtn(id, 'wrap', false), tooltipText: `${l10n.getConstant('WrapText')}`, id: id + '_wrap' }]
            },
            {
                header: { text: l10n.getConstant('Insert') }, content: [{
                    prefixIcon: 'e-hyperlink-icon', text: l10n.getConstant('Link'),
                    id: id + '_hyperlink', tooltipText: l10n.getConstant('Link'), click: (): void => { this.getHyperlinkDlg(); }
                }]
            },
            {
                header: { text: l10n.getConstant('Formulas') }, content: [{
                    prefixIcon: 'e-insert-function', tooltipText: l10n.getConstant('InsertFunction'),
                    text: l10n.getConstant('InsertFunction'), id: id + '_insert_function'
                }]
            },
            {
                header: { text: l10n.getConstant('Data') }, content: [
                    {
                        prefixIcon: 'e-protect-icon', text: l10n.getConstant('ProtectSheet'), id: id + '_protect',
                        tooltipText: l10n.getConstant('ProtectSheet')
                    }, { type: 'Separator', id: id + '_separator_8' },
                    {
                        template: this.datavalidationDDB(id), tooltipText: l10n.getConstant('DataValidation'),
                        id: id + '_datavalidation'
                    }]
            },
            {
                header: { text: l10n.getConstant('View') }, content: [
                    {
                        prefixIcon: 'e-hide-headers', text: this.getLocaleText('Headers'), id: id + '_headers',
                        tooltipText: this.getLocaleText('Headers')
                    }, { type: 'Separator', id: id + '_separator_9' },
                    {
                        prefixIcon: 'e-hide-gridlines', text: this.getLocaleText('GridLines'), id: id + '_gridlines',
                        tooltipText: this.getLocaleText('GridLines')
                    }]
            }];
        if (this.parent.allowSorting || this.parent.allowFiltering) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                { type: 'Separator', id: id + '_separator_10' },
                { template: this.getSortFilterDDB(id), tooltipText: l10n.getConstant('SortAndFilter'), id: id + '_sorting' });
        }
        if (this.parent.allowFindAndReplace) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                {
                    template: this.getFindDDb(id), prefixIcon: 'e-tbar-search-icon tb-icons',
                    tooltipText: l10n.getConstant('FindReplaceTooltip'), id: id + '_find'
                });
        }
        return items;
    }

    private getPasteBtn(id: string): Element {
        let btn: HTMLElement = this.parent.element.appendChild(
            this.parent.createElement('button', { id: id + '_paste' }));
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.pasteSplitBtn = new SplitButton(
            {
                iconCss: 'e-icons e-paste-icon',
                items: [
                    { text: l10n.getConstant('All'), id: 'All' },
                    { text: l10n.getConstant('Values'), id: 'Values' },
                    { text: l10n.getConstant('Formats'), id: 'Formats' }],
                select: (args: MenuEventArgs) => {
                    this.parent.notify(paste, { type: args.item.id, isAction: true });
                },
                click: () => {
                    this.parent.notify(paste, { isAction: true });
                },
                close: () => { this.parent.element.focus(); }
            });
        this.pasteSplitBtn.createElement = this.parent.createElement;
        this.pasteSplitBtn.appendTo(btn);
        return btn.parentElement;
    }

    private getHyperlinkDlg(): void {
        let indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        let row: RowModel = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]];
        let cell: CellModel;
        if (!isNullOrUndefined(row)) {
            cell = row.cells[indexes[1]];
        }
        if (isNullOrUndefined(cell)) {
            setCell(indexes[0], indexes[1], this.parent.getActiveSheet(), cell, false);
        }
        if (cell && cell.hyperlink) {
            this.parent.notify(editHyperlink, null);
        } else {
            this.parent.notify(initiateHyperlink, null);
        }
    }

    private getLocaleText(str: string, setClass?: boolean): string {
        let text: string; let l10n: L10n = this.parent.serviceLocator.getService(locale);
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

    private getLocaleProtectText(str: string, setClass?: boolean): string {
        let text: string; let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected) {
            if (setClass) { this.parent.getMainContent().classList.remove('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Unprotect' + str);
        } else {
            if (setClass) { this.parent.getMainContent().classList.add('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Protect' + str);
        }
        return text;
    }

    private createRibbon(args: { uiUpdate?: boolean }): void {
        let ribbonElement: HTMLElement = this.parent.createElement('div', { id: `${this.parent.element.id}_ribbon` });
        this.ribbon = new RibbonComponent({
            selectedTab: 0,
            menuItems: this.getRibbonMenuItems(),
            items: this.getRibbonItems(),
            fileMenuItemSelect: this.fileMenuItemSelect.bind(this),
            beforeOpen: this.fileMenuBeforeOpen.bind(this),
            beforeClose: this.fileMenuBeforeClose.bind(this),
            clicked: this.toolbarClicked.bind(this),
            created: this.ribbonCreated.bind(this),
            selecting: this.tabSelecting.bind(this),
            expandCollapse: this.expandCollapseHandler.bind(this),
            beforeFileMenuItemRender: this.beforeRenderHandler.bind(this)
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
        if (args.selectingIndex !== this.ribbon.selectedTab) {
            this.refreshRibbonContent(args.selectingIndex);
            this.parent.notify(tabSwitch, { activeTab: args.selectingIndex });
        }
    }

    private beforeRenderHandler(args: MenuEventArgs): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (args.item.text === l10n.getConstant('Open') && (!this.parent.openUrl || !this.parent.allowOpen)) {
            args.element.classList.add('e-disabled');
        }
        if (args.item.text === l10n.getConstant('SaveAs') && (!this.parent.saveUrl || !this.parent.allowSave)) {
            args.element.classList.add('e-disabled');
        }
    }

    private getNumFormatDDB(id: string): Element {
        let numFormatBtn: HTMLElement = this.parent.createElement('button', { id: id + '_number_format' });
        numFormatBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'General' }));
        this.numFormatDDB = new DropDownButton({
            items: this.getNumFormatDdbItems(id),
            content: '',
            select: (args: MenuEventArgs): void => this.numDDBSelect(args),
            open: (args: OpenCloseMenuEventArgs): void => this.numDDBOpen(args),
            beforeItemRender: (args: MenuEventArgs): void => this.previewNumFormat(args),
            close: (): void => this.parent.element.focus(),
            cssClass: 'e-flat e-numformat-ddb',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => this.tBarDdbBeforeOpen(args.element, args.items)
        });
        this.numFormatDDB.createElement = this.parent.createElement;
        this.numFormatDDB.appendTo(numFormatBtn);
        return numFormatBtn;
    }

    private getFontSizeDDB(id: string): Element {
        this.fontSizeDdb = new DropDownButton({
            cssClass: 'e-font-size-ddb',
            content: '11',
            items: [{ text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '14' }, { text: '16' },
            { text: '18' }, { text: '20' }, { text: '22' }, { text: '24' }, { text: '26' }, { text: '28' }, { text: '36' },
            { text: '48' }, { text: '72' }],
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.tBarDdbBeforeOpen(args.element, args.items);
                this.refreshSelected(this.fontSizeDdb, args.element, 'content', 'text');
            },
            select: (args: MenuEventArgs): void => {
                let eventArgs: SetCellFormatArgs = { style: { fontSize: `${args.item.text}pt` }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) { this.fontSizeDdb.content = eventArgs.style.fontSize.split('pt')[0]; this.fontSizeDdb.dataBind(); }
            },
            close: (): void => this.parent.element.focus()
        });
        this.fontSizeDdb.createElement = this.parent.createElement;
        this.fontSizeDdb.appendTo(this.parent.createElement('button', { id: id + '_font_size' }));
        return this.fontSizeDdb.element;
    }

    private getBordersDBB(id: string): Element {
        let cPickerWrapper: HTMLElement; let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.bordersMenu = new Menu({
            cssClass: 'e-borders-menu',
            items: [{ iconCss: 'e-icons e-top-borders', text: l10n.getConstant('TopBorders'), id: `${id}-top-border` }, {
                iconCss: 'e-icons e-left-borders', text: l10n.getConstant('LeftBorders'), id: `${id}-left-border`
            }, { iconCss: 'e-icons e-right-borders', text: l10n.getConstant('RightBorders'), id: `${id}-right-border` }, {
                iconCss: 'e-icons e-bottom-borders', text: l10n.getConstant('BottomBorders'), id: `${id}-bottom-border`
            }, { iconCss: 'e-icons e-all-borders', text: l10n.getConstant('AllBorders'), id: `${id}-all-border`
            }, { iconCss: 'e-icons e-horizontal-borders', text: l10n.getConstant('HorizontalBorders'), id: `${id}-horizontal-border` }, {
                iconCss: 'e-icons e-vertical-borders', text: l10n.getConstant('VerticalBorders'), id: `${id}-vertical-border`
            }, { iconCss: 'e-icons e-outside-borders', text: l10n.getConstant('OutsideBorders'), id: `${id}-outside-border`
            }, { iconCss: 'e-icons e-inside-borders', text: l10n.getConstant('InsideBorders'), id: `${id}-inside-border` },
            { iconCss: 'e-icons e-no-borders', text: l10n.getConstant('NoBorders'), id: `${id}-no-border` }, { separator: true,
            id: 'border_separator' }, { text: l10n.getConstant('BorderColor'), id: `${id}_border_color`, items:
            [{ id: `${id}_border_colors` }] }, { text: l10n.getConstant('BorderStyle'), id: `${id}-border-style`, items: [
                { iconCss: 'e-icons e-selected-icon', id: `${id}_style_1px` }, { id: `${id}_style_2px` },
                { id: `${id}_style_3px` }, { id: `${id}_style_dashed` }, { id: `${id}_style_dotted` }, { id: `${id}_style_double` }]
            }],
            orientation: 'Vertical',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.text === 'Border Color') {
                    cPickerWrapper = this.colorPicker.element.parentElement;
                    args.element.firstElementChild.appendChild(cPickerWrapper);
                    cPickerWrapper.style.display = 'inline-block';
                    args.element.parentElement.classList.add('e-border-color');
                } else {
                    args.element.classList.add('e-border-style');
                }
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.text === 'Border Color') {
                    let trgt: Element = args.event.target as Element;
                    if (closest(trgt, `#${id}_borders_menu`) || closest(trgt, '.e-palette') || closest(trgt, '.e-apply') || closest(
                        trgt, '.e-cancel') || (args.event && args.event.type !== 'mouseover' && !closest(trgt, '.e-borders-menu'))) {
                        if (this.colorPicker.showButtons) { this.colorPicker.showButtons = false; this.colorPicker.refresh(); }
                        cPickerWrapper.style.display = ''; this.parent.element.appendChild(cPickerWrapper); return;
                    }
                    args.cancel = true;
                }
            },
            onOpen: (args: OpenCloseMenuEventArgs): void => {
                if (args.parentItem.text === 'Border Color') { args.element.parentElement.style.overflow = 'visible'; }
            },
            select: this.borderSelected.bind(this)
        });
        this.bordersMenu.createElement = this.parent.createElement;
        let ul: HTMLElement = this.parent.element.appendChild(this.parent.createElement('ul', {
            id: id + '_borders_menu', styles: 'display: none;'
        }));
        this.bordersMenu.appendTo(ul);
        ul.classList.add('e-ul');
        let cPickerEle: HTMLElement = this.parent.createElement('input', { id: `${id}_cell_border_color`, attrs: { 'type': 'color' } });
        this.parent.element.appendChild(cPickerEle);
        this.colorPicker = new ColorPicker({
            cssClass: 'e-border-colorpicker',
            mode: 'Palette',
            showButtons: false,
            inline: true,
            enableOpacity: false,
            change: (args: ColorPickerEventArgs): void => {
                let border: string[] = this.border.split(' '); border[2] = args.currentValue.hex;
                this.border = border.join(' ');
            },
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                getUpdateUsingRaf((): void => {
                    this.colorPicker.showButtons = args.mode === 'Picker' ? true : false; this.colorPicker.dataBind();
                });
            },
            created: (): void => { cPickerWrapper = this.colorPicker.element.parentElement; }
        });
        this.colorPicker.createElement = this.parent.createElement;
        this.colorPicker.appendTo(cPickerEle);
        let borderEle: HTMLElement = this.parent.element.appendChild(this.parent.createElement('button', { id: id + '_border_options',
            attrs: { 'title': l10n.getConstant('Borders') } }));
        this.borderSplitBtn = new SplitButton({
            iconCss: 'e-icons e-all-borders',
            cssClass: 'e-borders-ddb',
            target: this.bordersMenu.element.parentElement,
            created: (): void => {
                this.bordersMenu.element.style.display = '';
                (<HTMLElement>select('.e-dropdown-btn', borderEle.parentElement)).title = l10n.getConstant('SelectBorderOption');
            },
            click: (): void => this.setBorder(this.borderSplitBtn.iconCss),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => this.tBarDdbBeforeOpen(
                <HTMLElement>args.element.firstElementChild, this.bordersMenu.items, 1),
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.e-borders-menu')) { args.cancel = true; }
            },
            close: (): void => this.parent.element.focus()
        });
        this.borderSplitBtn.createElement = this.parent.createElement;
        this.borderSplitBtn.appendTo(borderEle);
        return this.borderSplitBtn.element.parentElement;
    }

    private borderSelected(args: MenuEventArgs): void {
        if (args.item.items.length || args.item.id === `${this.parent.element.id}_border_colors`) { return; }
        if (args.item.id.includes('_style')) {
            let id: string = this.parent.element.id;
            let border: string[] = this.border.split(' ');
            let prevStyleId: string = border[1] === 'solid' ? `${id}_style_${border[0]}` : `${id}_style_${border[1]}`;
            if (prevStyleId === args.item.id) { return; }
            if (args.item.id === `${id}_style_1px` || args.item.id === `${id}_style_2px` || args.item.id === `${id}_style_3px`) {
                border[0] = args.item.id.split(`${id}_style_`)[1]; border[1] = 'solid';
            } else {
                border[1] = args.item.id.split(`${id}_style_`)[1];
                border[0] = border[1] === 'double' ? '3px' : '1px';
            }
            this.border = border.join(' ');
            (this.bordersMenu.items[12].items as MenuItemModel[]).forEach((item: MenuItemModel): void => {
                if (item.id === prevStyleId) { item.iconCss = null; }
                if (item.id === args.item.id) { item.iconCss = 'e-icons e-selected-icon'; }
            });
            this.bordersMenu.setProperties({ 'items': this.bordersMenu.items }, true);
            return;
        }
        this.borderSplitBtn.toggle();
        this.setBorder(args.item.iconCss);
    }

    private setBorder(iconCss: string): void {
        this.parent.showSpinner();
        this.borderSplitBtn.iconCss = iconCss; this.borderSplitBtn.dataBind();
        switch (iconCss) {
            case 'e-icons e-top-borders':
                this.parent.notify(setCellFormat, { style: { borderTop: this.border }, onActionUpdate: true });
                break;
            case 'e-icons e-left-borders':
                this.parent.notify(setCellFormat, { style: { borderLeft: this.border }, onActionUpdate: true });
                break;
            case 'e-icons e-right-borders':
                this.parent.notify(setCellFormat, { style: { borderRight: this.border }, onActionUpdate: true });
                break;
            case 'e-icons e-bottom-borders':
                this.parent.notify(setCellFormat, { style: { borderBottom: this.border }, onActionUpdate: true });
                break;
            case 'e-icons e-all-borders':
                this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true });
                break;
            case 'e-icons e-horizontal-borders':
                this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Horizontal' });
                break;
            case 'e-icons e-vertical-borders':
                this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Vertical' });
                break;
            case 'e-icons e-outside-borders':
                this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Outer' });
                break;
            case 'e-icons e-inside-borders':
                this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Inner' });
                break;
            case 'e-icons e-no-borders':
                this.parent.notify(setCellFormat, { style: { border: '' }, onActionUpdate: true });
                break;
        }
        this.parent.hideSpinner();
    }

    private getFontNameDDB(id: string): Element {
        let fontNameBtn: HTMLElement = this.parent.createElement('button', { id: id + '_font_name' });
        fontNameBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'Calibri' }));
        this.fontNameDdb = new DropDownButton({
            cssClass: 'e-font-family',
            items: this.getFontFamilyItems(),
            select: (args: MenuEventArgs): void => {
                let eventArgs: SetCellFormatArgs = { style: { fontFamily: args.item.text as FontFamily }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) { this.refreshFontNameSelection(eventArgs.style.fontFamily); }
            },
            close: (): void => this.parent.element.focus(),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => this.tBarDdbBeforeOpen(args.element, args.items)
        });
        this.fontNameDdb.createElement = this.parent.createElement;
        this.fontNameDdb.appendTo(fontNameBtn);
        return fontNameBtn;
    }

    private getBtn(id: string, name: string, bindEvent: boolean = true): Element {
        let btnObj: Button = new Button({ iconCss: `e-icons e-${name}-icon`, isToggle: true });
        btnObj.createElement = this.parent.createElement;
        btnObj.appendTo(this.parent.createElement('button', { id: `${id}_${name}` }));
        if (bindEvent) {
            btnObj.element.addEventListener('click', this.toggleBtnClicked.bind(this));
        }
        return btnObj.element;
    }

    private datavalidationDDB(id: string): Element {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.datavalidationDdb = new DropDownButton({
            cssClass: 'e-datavalidation-ddb',
            iconCss: 'e-datavalidation-icon e-icons',
            items: [
                { text: l10n.getConstant('DataValidation') },
                { text: l10n.getConstant('HighlightInvalidData') },
                { text: l10n.getConstant('ClearHighlight') },
                { text: l10n.getConstant('ClearValidation') }],
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.datavalidationDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                switch (args.item.text) {
                    case l10n.getConstant('DataValidation'):
                        this.parent.notify(initiateDataValidation, null);
                        break;
                    case l10n.getConstant('HighlightInvalidData'):
                        this.parent.notify(invalidData, { isRemoveHighlight: false });
                        break;
                    case l10n.getConstant('ClearHighlight'):
                        this.parent.notify(invalidData, { isRemoveHighlight: true });
                        break;
                    case l10n.getConstant('ClearValidation'):
                        this.parent.notify(removeDataValidation, null);
                        break;
                    default:
                        let direction: SortOrder = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                        this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: direction } } });
                        break;
                }
            },
            close: (): void => this.parent.element.focus()
        });
        this.datavalidationDdb.createElement = this.parent.createElement;
        this.datavalidationDdb.appendTo(this.parent.createElement('button', { id: id + '_datavalidation' }));
        return this.datavalidationDdb.element;
    }

    private getTextAlignDDB(id: string): Element {
        this.textAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-left-icon',
            items: [{ iconCss: 'e-icons e-left-icon' }, { iconCss: 'e-icons e-center-icon' }, { iconCss: 'e-icons e-right-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.textAlignDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                let eventArgs: SetCellFormatArgs = {
                    style: { textAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as TextAlign }, onActionUpdate: true
                };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) {
                    this.textAlignDdb.iconCss = `e-icons e-${eventArgs.style.textAlign}-icon`; this.textAlignDdb.dataBind();
                }
            },
            close: (): void => this.parent.element.focus()
        });
        this.textAlignDdb.createElement = this.parent.createElement;
        this.textAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_text_align' }));
        return this.textAlignDdb.element;
    }

    private getVerticalAlignDDB(id: string): Element {
        this.verticalAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-bottom-icon',
            items: [{ iconCss: 'e-icons e-top-icon' }, { iconCss: 'e-icons e-middle-icon' }, { iconCss: 'e-icons e-bottom-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.verticalAlignDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                let eventArgs: SetCellFormatArgs = {
                    style: { verticalAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as VerticalAlign }, onActionUpdate: true
                };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) {
                    this.verticalAlignDdb.iconCss = `e-icons e-${eventArgs.style.verticalAlign}-icon`; this.verticalAlignDdb.dataBind();
                }
            },
            close: (): void => this.parent.element.focus()
        });
        this.verticalAlignDdb.createElement = this.parent.createElement;
        this.verticalAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_vertical_align' }));
        return this.verticalAlignDdb.element;
    }

    private getMergeSplitBtn(id: string): Element {
        this.parent.element.appendChild(this.parent.createElement('button', { id: id + '_merge' }));
        let l10n: L10n = this.parent.serviceLocator.getService(locale); let isActive: boolean; let activeCell: string;
        this.mergeSplitBtn = new SplitButton({
            cssClass: 'e-merge-ddb',
            iconCss: 'e-icons e-merge-icon',
            items: [{ text: l10n.getConstant('MergeAll'), id: `${id}_merge_all` }, { text: l10n.getConstant('MergeHorizontally'), id:
                `${id}_merge_horizontally` }, { text: l10n.getConstant('MergeVertically'), id: `${id}_merge_vertically` },
                { separator: true, id: `${id}_merge_separator` }, { text: l10n.getConstant('Unmerge'), id: `${id}_unmerge` }],
            select: (args: MenuEventArgs): void => {
                isActive = false; args.item.id === `${this.parent.element.id}_unmerge` ? this.unMerge() : this.merge(args.item.id);
            },
            beforeOpen: (): void => {
                isActive = this.mergeSplitBtn.element.classList.contains('e-active');
                activeCell = this.parent.getActiveSheet().activeCell;
            },
            close: (): void => {
                if (isActive && activeCell === this.parent.getActiveSheet().activeCell) {
                    this.mergeSplitBtn.element.classList.add('e-active');
                }
                activeCell = null;
                this.parent.element.focus();
            },
            click: (args: BtnClickEventArgs): void => {
                isActive = false;
                if (args.element.classList.contains('e-active')) {
                    this.toggleActiveState(false); this.unMerge();
                } else {
                    this.toggleActiveState(true); this.merge(`${this.parent.element.id}_merge_all`);
                }
            },
            created: (): void => {
                this.mergeSplitBtn.element.title = l10n.getConstant('MergeCells');
                (this.mergeSplitBtn.element.nextElementSibling as HTMLButtonElement).title = l10n.getConstant('SelectMergeType');
            }
        });
        this.mergeSplitBtn.createElement = this.parent.createElement;
        this.mergeSplitBtn.appendTo('#' + id + '_merge');
        return this.mergeSplitBtn.element.parentElement;
    }

    private unMerge(): void {
        this.parent.showSpinner();
        this.parent.notify(setMerge, <MergeArgs>{ merge: false, range: this.parent.getActiveSheet().selectedRange,
            isAction: true, refreshRibbon: true, type: 'All' });
        this.parent.hideSpinner();
    }

    private merge(itemId: string): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getRangeIndexes(sheet.selectedRange); let cell: CellModel;
        let isDataPresent: boolean;
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                if (i === indexes[0] && j === indexes[1] && itemId.includes('merge_all')) { continue; }
                if (i === indexes[0] && itemId.includes('merge_vertically')) { continue; }
                if (j === indexes[1] && itemId.includes('_merge_horizontally')) { continue; }
                cell = getCell(i, j, sheet) || {};
                if (cell.value || cell.formula) { isDataPresent = true; }
            }
        }
        if (!isDataPresent) { this.performMerge(itemId); return; }
        let dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
        dialogInst.show({
            target: this.parent.element, height: 200, width: 400, isModal: true, showCloseIcon: true,
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('MergeCellsAlert'),
            beforeOpen: (): void => this.parent.element.focus(),
            buttons: [{
                buttonModel: { content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true },
                click: (): void => { dialogInst.hide(); this.performMerge(itemId); }
            }]
        });
    }

    private performMerge(itemId: string): void {
        let id: string = this.parent.element.id;
        this.parent.showSpinner();
        switch (itemId) {
            case `${id}_merge_all`:
                this.parent.notify(setMerge, <MergeArgs>{ merge: true, range: this.parent.getActiveSheet().selectedRange,
                    type: 'All', isAction: true, refreshRibbon: true });
                break;
            case `${id}_merge_horizontally`:
                this.parent.notify(setMerge, <MergeArgs>{ merge: true, range: this.parent.getActiveSheet().selectedRange,
                    type: 'Horizontally', isAction: true });
                break;
            case `${id}_merge_vertically`:
                this.parent.notify(setMerge, <MergeArgs>{ merge: true, range: this.parent.getActiveSheet().selectedRange,
                    type: 'Vertically', isAction: true });
                break;
        }
        this.parent.hideSpinner();
    }

    private getSortFilterDDB(id: string): Element {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.sortingDdb = new DropDownButton({
            cssClass: 'e-sort-filter-ddb',
            iconCss: 'e-icons e-sort-filter-icon',
            items: [
                { text: l10n.getConstant('SortAscending'), iconCss: 'e-icons e-sort-asc' },
                { text: l10n.getConstant('SortDescending'), iconCss: 'e-icons e-sort-desc' },
                { text: l10n.getConstant('CustomSort') + '...', iconCss: 'e-icons e-sort-custom' },
                { separator: true },
                { text: l10n.getConstant('Filter'), iconCss: 'e-icons e-filter-apply', id: id + '_applyfilter' },
                { text: l10n.getConstant('ClearAllFilter'), iconCss: 'e-icons e-filter-clear', id: id + '_clearfilter' },
                { text: l10n.getConstant('ReapplyFilter'), iconCss: 'e-icons e-filter-reapply', id: id + '_reapplyfilter' }],
            beforeItemRender: (args: MenuEventArgs): void => {
                let eventArgs: { [key: string]: boolean } = { isFiltered: false, isClearAll: true };
                this.parent.notify(getFilteredColumn, eventArgs);
                if (args.item.id === id + '_clearfilter' || args.item.id === id + '_reapplyfilter') {
                    if (!eventArgs.isFiltered) {
                        args.element.classList.add('e-disabled');
                    } else {
                        args.element.classList.remove('e-disabled');
                    }
                }
            },
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.sortingDdb, args.element, 'iconCss');
            },
            select: (args: MenuEventArgs): void => {
                switch (args.item.text) {
                    case l10n.getConstant('Filter'):
                        this.parent.applyFilter();
                        break;
                    case l10n.getConstant('ClearAllFilter'):
                        this.parent.clearFilter();
                        break;
                    case l10n.getConstant('ReapplyFilter'):
                        this.parent.notify(reapplyFilter, null);
                        break;
                    case l10n.getConstant('CustomSort') + '...':
                        this.parent.notify(initiateCustomSort, null);
                        break;
                    default:
                        let direction: SortOrder = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                        this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: direction } } });
                        break;
                }
            },
            close: (): void => this.parent.element.focus()
        });
        this.sortingDdb.createElement = this.parent.createElement;
        this.sortingDdb.appendTo(this.parent.createElement('button', { id: id + '_sorting' }));
        return this.sortingDdb.element;
    }

    private getFindDDb(id: string): HTMLElement {
        let findToolbtn: HTMLElement = this.parent.createElement('button', { id: id + '_findbtn' }) as HTMLElement;
        this.findDdb = new Button({
            cssClass: 'e-spreadsheet-find-ddb e-caret-hide',
            iconCss: 'e-icons e-search-icon'
        });
        this.findDdb.createElement = this.parent.createElement;
        this.findDdb.appendTo(findToolbtn);
        findToolbtn.onclick = (): void => {
            this.findToolDlg();
        };
        return this.findDdb.element;
    }
    private findToolDlg(): void {
        let countArgs: { [key: string]: string };
        if (isNullOrUndefined(this.parent.element.querySelector('.e-findtool-dlg'))) {
            let toolbarObj: Toolbar;
            let findTextElement: HTMLElement = this.parent.createElement('div', { className: 'e-input-group'});
            let findTextInput: HTMLElement = this.parent.createElement('input', {
                className: 'e-input e-text-findNext-short', attrs: { 'type': 'Text' , value: this.findValue },
            });
            findTextInput.setAttribute('placeholder', 'FindValue');
            let findSpan: HTMLElement = this.parent.createElement('span', { className: 'e-input-group-icon'});
            findTextInput.onkeyup = (): void => {
                countArgs = { countOpt: 'count', findCount: '' };
                this.parent.notify(findHandler, { countArgs: countArgs });
                findSpan.textContent = countArgs.findCount;
                let totalCount: string[] = countArgs.findCount.split('of');
                let element: HTMLInputElement = document.querySelector('.e-text-findNext-short') as HTMLInputElement;
                let value: string = element.value;
                let nextElement: HTMLElement = document.querySelector('.e-findRib-next') as HTMLElement;
                let prevElement: HTMLElement = document.querySelector('.e-findRib-prev') as HTMLElement;
                if (isNullOrUndefined(value) || (value === '') || (totalCount[1] === '0')) {
                    toolbarObj.enableItems(nextElement, false); toolbarObj.enableItems(prevElement, false);
                } else if (!isNullOrUndefined(value) || (totalCount[1] !== '0')) {
                    toolbarObj.enableItems(nextElement, true); toolbarObj.enableItems(prevElement, true);
                }
            };
            findTextInput.onkeydown = (e: KeyboardEvent): void => {
                countArgs = { countOpt: 'count', findCount: '' };
                this.parent.notify(findHandler, { countArgs: countArgs });
                let count: string = countArgs.findCount;
                this.findOnKeyDown(e, count);
            };
            findTextElement.appendChild(findTextInput);
            findTextElement.appendChild(findSpan);
            let toolItemModel: TlbItemModel[] = [
                { type: 'Input', template: findTextElement },
                {
                    prefixIcon: 'e-icons e-prev-icon', tooltipText: 'Find Previous', type: 'Button', cssClass: 'e-findRib-prev',
                    disabled: true
                },
                { prefixIcon: 'e-icons e-next-icon', tooltipText: 'Find Next', type: 'Button', cssClass: 'e-findRib-next', disabled: true },
                { type: 'Separator' },
                { prefixIcon: 'e-icons e-option-icon', tooltipText: 'More Options', type: 'Button', cssClass: 'e-findRib-more' },
                { prefixIcon: 'e-icons e-close', tooltipText: 'Close', type: 'Button', cssClass: 'e-findRib-close' }
            ];
            toolbarObj = new Toolbar({
                clicked: (args: ClickEventArgs): void => {
                    if (args.item.cssClass === 'e-findRib-next') {
                        let buttonArg: object = { findOption: 'next' };
                        this.parent.notify(findHandler, buttonArg);
                    } else if (args.item.cssClass === 'e-findRib-prev') {
                        let buttonArg: object = { findOption: 'prev' };
                        this.parent.notify(findHandler, buttonArg);
                    } else if (args.item.cssClass === 'e-findRib-more') {
                        this.parent.notify(findDlg, null);
                        this.findDialog.hide();
                    }
                }, width: 'auto', height: 'auto', items: toolItemModel, cssClass: 'e-find-toolObj'
            });
            let toolbarElement: HTMLElement = this.parent.createElement('div', { className: 'e-find-toolbar' });
            let dialogDiv: HTMLElement = this.parent.createElement('div', { className: 'e-dlg-div' });
            this.findDialog = new FindDialog({
                isModal: false, showCloseIcon: false, cssClass: 'e-findtool-dlg', content: toolbarElement, visible: false,
                allowDragging: true, target: this.parent.element.querySelector('.e-main-panel') as HTMLElement,
                beforeOpen: (): void => {
                    EventHandler.add(document, 'click', this.closeDialog, this);
                },
                open: (): void => {
                    this.textFocus(toolbarObj.element);
                },
                beforeClose: (): void => {
                    this.findValue = (this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement).value;
                    toolbarObj.destroy();
                    let element: HTMLElement = document.querySelector('.e-find-toolbar');
                    EventHandler.remove(element, 'focus', this.textFocus);
                    EventHandler.remove(document, 'click', this.closeDialog);
                    this.parent.element.focus();
                },
                created: (): void => {
                    toolbarObj.createElement = this.parent.createElement;
                    toolbarObj.appendTo(toolbarElement);
                    this.findDialog.width = getComputedStyle(document.querySelector('.e-findtool-dlg')).width;
                    let calculate: ClientRect = this.parent.element.querySelector('.e-main-panel').getBoundingClientRect();
                    let dialogWidth: number | string = this.findDialog.width;
                    let rightValue: number = calculate.width - parseInt(dialogWidth.toString(), 10) - 14; /** 14- width of scroll bar */
                    /** 31- height of sheetHeader */
                    let topValue: number = this.parent.sheets[this.parent.activeSheetIndex].showHeaders ? 31 : 0;
                    this.findDialog.position = { X: rightValue, Y: topValue };
                    this.findDialog.dataBind(); this.findDialog.show();
                },
            });
            this.findDialog.createElement = this.parent.createElement;
            this.findDialog.appendTo(dialogDiv);
        } else {
            if (!isNullOrUndefined(this.parent.element.querySelector('.e-findtool-dlg'))) {
                this.findDialog.hide();
                detach(this.parent.element.querySelector('.e-findtool-dlg'));
                this.findDialog = null;
                this.parent.element.focus();
            }
        }
    }
    private findOnKeyDown(e: KeyboardEvent, count: string): void {
        if ((document.querySelector('.e-text-findNext-short') as HTMLInputElement).value) {
            let totalCount: string[] = count.split('of');
            if (totalCount[1] !== '0') {
            if (e.shiftKey) {
                if (e.keyCode === 13) {
                    let buttonArgs: object = { findOption: 'prev' };
                    this.parent.notify(findHandler, buttonArgs);
                }
            } else if (e.keyCode === 13) {
                let buttonArg: object = { findOption: 'next' };
                this.parent.notify(findHandler, buttonArg);
            }
        }
    }
    }
    private closeDialog(e: MouseEvent & TouchEvent): void {
        if ((closest(e.target as Element, '.e-findRib-close')) || (!closest(e.target as Element, '.e-spreadsheet'))) {
            if (!isNullOrUndefined(this.findDialog)) {
                this.findDialog.hide();
                detach(this.parent.element.querySelector('.e-findtool-dlg'));
                this.findDialog = null;
            }
        }
    }
    private textFocus(element: HTMLElement): void {
        element = document.querySelector('.e-find-toolbar');
        element.addEventListener('focus', (): void => {
            let elements: HTMLInputElement = document.querySelector('.e-text-findNext-short');
            elements.focus();
            elements.classList.add('e-input-focus');
            (elements).setSelectionRange(0, elements.value.length);
        });
    }
    private ribbonCreated(): void {
        (this.ribbon.element.querySelector('.e-drop-icon') as HTMLElement).title
            = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('CollapseToolbar');
    }

    private alignItemRender(args: MenuEventArgs): void {
        let text: string = args.item.iconCss.split(' e-')[1].split('-icon')[0];
        text = text[0].toUpperCase() + text.slice(1, text.length);
        args.element.title = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Align' + text);
    }
    private toggleBtnClicked(e: MouseEvent | KeyboardEvent): void {
        let target: Element = closest(e.target as Element, '.e-btn');
        let parentId: string = this.parent.element.id; let id: string = target.id;
        let property: string = setCellFormat; let value: string;
        let defaultModel: CellStyleModel; let activeModel: CellStyleModel; let eventArgs: SetCellFormatArgs; let key: string;
        switch (id) {
            case `${parentId}_bold`:
                defaultModel = { fontWeight: 'normal' }; activeModel = { fontWeight: 'bold' }; key = 'fontWeight';
                break;
            case `${parentId}_italic`:
                defaultModel = { fontStyle: 'normal' }; activeModel = { fontStyle: 'italic' }; key = 'fontStyle';
                break;
            case `${parentId}_line-through`:
                property = textDecorationUpdate; defaultModel = { textDecoration: 'line-through' }; activeModel = defaultModel;
                key = 'textDecoration';
                break;
            case `${parentId}_underline`:
                property = textDecorationUpdate; defaultModel = { textDecoration: 'underline' }; activeModel = defaultModel;
                key = 'textDecoration';
                break;
        }
        if (target.classList.contains('e-active')) {
            value = activeModel[key];
            eventArgs = { style: activeModel, onActionUpdate: true };
            this.parent.notify(property, eventArgs);
            if (eventArgs.cancel) { target.classList.remove('e-active'); }
        } else {
            value = defaultModel[key];
            eventArgs = { style: defaultModel, onActionUpdate: true };
            this.parent.notify(property, eventArgs);
            if (eventArgs.cancel) { target.classList.add('e-active'); }
        }
        if (!eventArgs.cancel && value !== eventArgs.style[key]) {
            this.refreshToggleBtn(getCellIndexes(this.parent.getActiveSheet().activeCell));
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
    private getNumFormatDdbItems(id: string): ItemModel[] {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        return [
            { id: id + 'item1', text: l10n.getConstant('General') },
            { id: id + 'item2', text: l10n.getConstant('Number') },
            { id: id + 'item3', text: l10n.getConstant('Currency') },
            { id: id + 'item4', text: l10n.getConstant('Accounting') },
            { id: id + 'item5', text: l10n.getConstant('ShortDate') },
            { id: id + 'item6', text: l10n.getConstant('LongDate') },
            { id: id + 'item7', text: l10n.getConstant('Time') },
            { id: id + 'item8', text: l10n.getConstant('Percentage') },
            { id: id + 'item9', text: l10n.getConstant('Fraction') },
            { id: id + 'item10', text: l10n.getConstant('Scientific') },
            { id: id + 'item11', text: l10n.getConstant('Text') }
        ];
    }
    private getFontFamilyItems(): ItemModel[] {
        return [{ text: 'Arial' }, { text: 'Arial Black' }, { text: 'Axettac Demo' }, { text: 'Batang' }, { text: 'Book Antiqua' },
        { text: 'Calibri', iconCss: 'e-icons e-selected-icon' }, { text: 'Courier' }, { text: 'Courier New' },
        { text: 'Din Condensed' }, { text: 'Georgia' }, { text: 'Helvetica' }, { text: 'Helvetica New' }, { text: 'Roboto' },
        { text: 'Tahoma' }, { text: 'Times New Roman' }, { text: 'Verdana' }];
    }

    private numDDBSelect(args: MenuEventArgs): void {
        let eventArgs: { format: string, range: string, cancel: boolean, requestType: string } = {
            format: getFormatFromType(args.item.text as NumberFormatType),
            range: this.parent.getActiveSheet().selectedRange, cancel: false, requestType: 'NumberFormat'
        };
        let actionArgs: BeforeCellFormatArgs = {
            range: this.parent.getActiveSheet().name + '!' + eventArgs.range,
            format: <string>eventArgs.format, requestType: 'NumberFormat'
        };
        this.parent.trigger('beforeCellFormat', eventArgs);
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
        if (eventArgs.cancel) {
            return;
        }
        this.parent.notify(applyNumberFormatting, eventArgs);
        this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
        this.refreshNumFormatSelection(args.item.text);
        this.parent.notify(completeAction, { eventArgs: actionArgs, action: 'format' });
    }

    private tBarDdbBeforeOpen(element: HTMLElement, items: MenuItemModel[], separatorCount: number = 0): void {
        let viewportHeight: number = this.parent.viewport.height;
        let actualHeight: number = (parseInt(getComputedStyle(element.firstElementChild).height, 10) * (items.length - separatorCount)) +
            (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (separatorCount) {
            let separatorStyle: CSSStyleDeclaration = getComputedStyle(element.querySelector('.e-separator'));
            actualHeight += (separatorCount * (parseInt(separatorStyle.borderBottomWidth, 10) + (parseInt(
                separatorStyle.marginTop, 10) * 2)));
        }
        if (actualHeight > viewportHeight) {
            element.style.height = `${viewportHeight}px`; element.style.overflowY = 'auto';
        } else {
            if (element.style.height) { element.style.height = ''; element.style.overflowY = ''; }
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
            format: getFormatFromType(args.item.text as NumberFormatType),
            sheetIndex: this.parent.activeSheetIndex,
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

    private refreshRibbonContent(activeTab: number): void {
        if (!this.ribbon) { return; }
        if (isNullOrUndefined(activeTab)) { activeTab = this.ribbon.selectedTab; }
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let sheet: SheetModel = this.parent.getActiveSheet();
        switch (this.ribbon.items[activeTab].header.text) {
            case l10n.getConstant('Home'):
                this.refreshHomeTabContent(getCellIndexes(sheet.activeCell));
                break;
            case l10n.getConstant('Insert'):
                // Second tab functionality comes here
                break;
            case l10n.getConstant('Formulas'):
                // Third tab functionality comes here
                break;
            case l10n.getConstant('Data'):
                this.refreshDataTabContent(activeTab);
                break;
            case l10n.getConstant('View'):
                this.refreshViewTabContent(activeTab);
                break;
        }
    }

    private refreshHomeTabContent(indexes: number[]): void {
        if (!isNullOrUndefined(document.getElementById(this.parent.element.id + '_number_format'))) {
            this.numFormatDDB = getComponent(document.getElementById(this.parent.element.id + '_number_format'), DropDownButton);
        }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let actCell: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let cell: CellModel = getCell(actCell[0], actCell[1], this.parent.getActiveSheet()) || {};
        let type: string = getTypeFromFormat(cell.format ? cell.format : 'General');
        if (this.numFormatDDB) {
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                type = 'General';
                this.refreshNumFormatSelection(type);
            } else {
                this.refreshNumFormatSelection(l10n.getConstant(type));
            }
        }
        if (this.fontNameDdb) {
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                this.refreshFontNameSelection('Calibri');
            } else {
                this.refreshFontNameSelection(this.getCellStyleValue('fontFamily', indexes));
            }
        }
        if (this.fontSizeDdb) {
            let value: string = this.getCellStyleValue('fontSize', indexes);
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                this.fontSizeDdb.content = '11';
            } else {
                value = value.includes('pt') ? value.split('pt')[0] : '11';
                if (value !== this.fontSizeDdb.content) {
                    this.fontSizeDdb.content = value; this.fontSizeDdb.dataBind();
                }
            }
        }
        if (this.textAlignDdb) {
            let style: string = this.getCellStyleValue('textAlign', indexes);
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {

                this.textAlignDdb.iconCss = 'e-icons e-left-icon';
            } else {
                if (cell.value !== undefined && style === 'left' && (type === 'Accounting' || isNumber(cell.value))) {
                    style = 'right';
                }
                let value: string = `e-icons e-${style.toLowerCase()}-icon`;
                if (value !== this.textAlignDdb.iconCss) {
                    this.textAlignDdb.iconCss = value; this.textAlignDdb.dataBind();
                }
            }
        }
        if (this.verticalAlignDdb) {
            let value: string = `e-icons e-${this.getCellStyleValue('verticalAlign', indexes).toLowerCase()}-icon`;
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                this.verticalAlignDdb.iconCss = 'e-icons e-bottom-icon';
            } else {
                if (value !== this.verticalAlignDdb.iconCss) {
                    this.verticalAlignDdb.iconCss = value; this.verticalAlignDdb.dataBind();
                }
            }
        }
        this.refreshToggleBtn(indexes);
        if (!sheet.isProtected && (cell.rowSpan > 1 || cell.colSpan > 1)) {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: [`${this.parent.element.id}_merge_cells`],
            enable: true }]);
            this.toggleActiveState(true);
        } else {
            let indexes: number[] = getRangeIndexes(sheet.selectedRange);
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: [`${this.parent.element.id}_merge_cells`],
            enable: indexes[0] !== indexes[2] || indexes[1] !== indexes[3] ? true : false }]);
            this.toggleActiveState(false);
        }
    }

    private toggleActiveState(active: boolean): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.getActiveSheet().isProtected) {
            if (active) {
                this.mergeSplitBtn.element.classList.add('e-active');
                (this.mergeSplitBtn.element as HTMLButtonElement).title = l10n.getConstant('UnmergeCells');
            } else {
                if (this.mergeSplitBtn.element.classList.contains('e-active')) { this.mergeSplitBtn.element.classList.remove('e-active'); }
                (this.mergeSplitBtn.element as HTMLButtonElement).title = l10n.getConstant('MergeCells');
            }
        }
    }

    private refreshToggleBtn(indexes: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let btn: HTMLElement; let id: string = this.parent.element.id; let value: string;
        let isActive: boolean;
        let cell: CellModel = getCell(indexes[0], indexes[1], sheet);
        let fontProps: string[] = ['fontWeight', 'fontStyle', 'textDecoration', 'textDecoration'];
        ['bold', 'italic', 'line-through', 'underline', 'wrap'].forEach((name: string, index: number): void => {
            btn = document.getElementById(`${id}_${name}`);
            if (btn) {
                if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                    btn.classList.remove('e-active');
                } else if (name === 'wrap') {
                    isActive = cell && cell.wrap;
                } else {
                    value = this.getCellStyleValue(fontProps[index], indexes).toLowerCase();
                    isActive = value.indexOf(name) > -1;
                }
                if (isActive) {
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

    private fileMenuItemSelect(args: MenuEventArgs): void {
        let selectArgs: MenuSelectEventArgs = <MenuSelectEventArgs>extend({ cancel: false }, args);
        this.parent.trigger('fileMenuItemSelect', selectArgs); let id: string = this.parent.element.id;
        if (!selectArgs.cancel) {
            switch (args.item.id) {
                case `${id}_Open`:
                    (this.parent.element.querySelector('#' + id + '_fileUpload') as HTMLElement).click();
                    break;
                case `${id}_Xlsx`:
                case `${id}_Xls`:
                case `${id}_Csv`:
                    this.parent.save({ saveType: <SaveType>args.item.id.split(`${id}_`)[1] });
                    break;
                case `${id}_New`:
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
                                dialogInst.hide();
                                this.blankWorkbook();
                            }
                        }]
                    });
                    break;
            }
        }
    }
    private toolbarClicked(args: ClickEventArgs): void {
        if (!(args.item.id === 'spreadsheet_find')) {
            let parentId: string = this.parent.element.id;
            let sheet: SheetModel = this.parent.getActiveSheet();
            switch (args.item.id) {
                case parentId + '_headers':
                    let evtHArgs: { isShow: boolean, sheetIdx: number, cancel: boolean } = {
                        isShow: !sheet.showHeaders,
                        sheetIdx: this.parent.activeSheetIndex,
                        cancel: false
                    };
                    this.parent.notify(completeAction, { eventArgs: evtHArgs, action: 'headers' });
                    if (evtHArgs.cancel) { return; }
                    sheet.showHeaders = !sheet.showHeaders;
                    (this.parent.serviceLocator.getService('sheet') as IRenderer).showHideHeaders();
                    this.toggleRibbonItems({ props: 'Headers', activeTab: this.ribbon.selectedTab });
                    this.parent.element.focus();
                    break;
                case parentId + '_gridlines':
                    let evtglArgs: { isShow: boolean, sheetIdx: number, cancel: boolean } = {
                        isShow: !sheet.showGridLines,
                        sheetIdx: this.parent.activeSheetIndex,
                        cancel: false
                    };
                    this.parent.notify(completeAction, { eventArgs: evtglArgs, action: 'gridLines' });
                    if (evtglArgs.cancel) { return; }
                    sheet.showGridLines = !sheet.showGridLines;
                    this.toggleRibbonItems({ props: 'GridLines', activeTab: this.ribbon.selectedTab });
                    this.parent.element.focus();
                    break;
                case parentId + '_protect':
                    sheet.isProtected = !sheet.isProtected;
                    this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                    let isActive: boolean = false;
                    sheet.isProtected ? isActive = false : isActive = true;
                    this.parent.notify(applyProtect, { isActive: isActive, id: parentId + '_protect' });
                    break;
                case parentId + '_undo':
                    this.parent.notify(performUndoRedo, { isUndo: true });
                    break;
                case parentId + '_redo':
                    this.parent.notify(performUndoRedo, { isUndo: false });
                    break;
            }
            this.parent.notify(ribbonClick, args);
        }
    }

    private toggleRibbonItems(args: { props: 'Headers' | 'GridLines' | 'Protect', activeTab?: number }): void {
        let viewtabHeader: string = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('View');
        let datatabHeader: string = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Data');
        if (this.ribbon.items[this.ribbon.selectedTab].header.text === viewtabHeader) {
            if (isNullOrUndefined(args.activeTab)) {
                for (let i: number = 0, len: number = this.ribbon.items.length; i < len; i++) {
                    if (this.ribbon.items[i].header.text === viewtabHeader) { args.activeTab = i; break; }
                }
            }
            let text: string = this.getLocaleText(args.props, true);
            let id: string = `${this.parent.element.id}_${args.props.toLowerCase()}`;
            let len: number = this.ribbon.items[args.activeTab].content.length;
            for (let i: number; i < len; i++) {
                if (this.ribbon.items[args.activeTab].content[i].type === 'Separator') {
                    continue;
                }
                if (this.ribbon.items[args.activeTab].content[i].id === id) {
                    this.ribbon.items[args.activeTab].content[i].text = text;
                    this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
                }
            }
            if (this.ribbon.items[this.ribbon.selectedTab].header.text === viewtabHeader) {
                this.updateToggleText(args.props.toLowerCase(), text);
            }
        }
        if (this.ribbon.items[this.ribbon.selectedTab].header.text === datatabHeader) {
            if (isNullOrUndefined(args.activeTab)) {
                for (let i: number = 0, len: number = this.ribbon.items.length; i < len; i++) {
                    if (this.ribbon.items[i].header.text === datatabHeader) { args.activeTab = i; break; }
                }
            }
            let text: string = this.getLocaleProtectText('Sheet', true);
            let id: string = `${this.parent.element.id}_${args.props.toLowerCase()}`;
            let len: number = this.ribbon.items[args.activeTab].content.length;
            for (let i: number; i < len; i++) {
                if (this.ribbon.items[args.activeTab].content[i].type === 'Separator') { continue; }
                if (this.ribbon.items[args.activeTab].content[i].id === id) {
                    this.ribbon.items[args.activeTab].content[i].text = text;
                    this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
                }
            }
            if (this.ribbon.items[this.ribbon.selectedTab].header.text === datatabHeader) {
                this.updateToggleText(args.props.toLowerCase(), text);
            }
        }
    }

    private enableFileMenuItems(args: { items: string[], enable: boolean, isUniqueId: boolean }): void {
        this.ribbon.enableMenuItems(args.items, args.enable, args.isUniqueId);
    }

    private hideRibbonTabs(args: { tabs: string[], hide: boolean }): void {
        this.ribbon.hideTabs(args.tabs, args.hide);
    }

    private addRibbonTabs(args: { items: RibbonItemModel[], insertBefore: string }): void {
        this.ribbon.addTabs(args.items, args.insertBefore);
        let nextTab: HTMLElement = <HTMLElement>select(
            '.e-ribbon .e-tab-header .e-toolbar-item:not(.e-menu-tab).e-hide', this.parent.element);
        if (nextTab) {
            this.parent.updateActiveBorder(selectAll(
                '.e-ribbon .e-tab-header .e-toolbar-item:not(.e-menu-tab)', this.parent.element)[this.ribbon.selectedTab]);
        }
    }

    private updateToggleText(item: string, text: string): void {
        getUpdateUsingRaf((): void => {
            this.ribbon.element.querySelector(`#${this.parent.element.id}_${item} .e-tbar-btn-text`).textContent = text;
        });
    }

    private refreshViewTabContent(activeTab: number): void {
        let id: string = this.parent.element.id; let updated: boolean;
        for (let i: number = 0; i < this.ribbon.items[activeTab].content.length; i++) {
            if (this.ribbon.items[activeTab].content[i].type === 'Separator') { continue; }
            if (this.ribbon.items[activeTab].content[i].id === `${id}_headers`) {
                this.updateViewTabContent(activeTab, 'Headers', i);
                if (updated) { break; } updated = true;
            }
            if (this.ribbon.items[activeTab].content[i].id === `${id}_gridlines`) {
                this.updateViewTabContent(activeTab, 'GridLines', i);
                if (updated) { break; } updated = true;
            }
        }
    }

    private updateViewTabContent(activeTab: number, item: string, idx: number): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (sheet['show' + item]) {
            if (this.ribbon.items[activeTab].content[idx].text === l10n.getConstant('Show' + item)) {
                this.updateShowHideBtn('Hide', item, idx, activeTab);
            }
        } else {
            if (this.ribbon.items[activeTab].content[idx].text === l10n.getConstant('Hide' + item)) {
                this.updateShowHideBtn('Show', item, idx, activeTab);
            }
        }
    }
    private updateShowHideBtn(showHideText: string, item: string, idx: number, activeTab: number): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let text: string = l10n.getConstant(showHideText + item);
        this.ribbon.items[activeTab].content[idx].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText(item.toLowerCase(), text);
    }

    private refreshDataTabContent(activeTab: number): void {
        let id: string = this.parent.element.id; let updated: boolean;
        for (let j: number = 0; j < this.ribbon.items[activeTab].content.length; j++) {
            if (this.ribbon.items[activeTab].content[j].type === 'Separator') { continue; }
            if (this.ribbon.items[activeTab].content[j].id === `${id}_protect`) {
                this.updateDataTabContent(activeTab, 'Sheet', j);
                if (updated) { break; } updated = true;
            }
        }
    }

    private updateDataTabContent(activeTab: number, item: string, idx: number): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (sheet.isProtected) {
            if (this.ribbon.items[activeTab].content[idx].text === l10n.getConstant('Protect' + item)) {
                this.ribbon.items[activeTab].content[idx].cssClass = 'e-active';
                this.updateProtectBtn('Unprotect', item, idx, activeTab);
            }
        } else {
            this.updateProtectBtn('Protect', item, idx, activeTab);
        }
    }
    private updateProtectBtn(protectText: string, item: string, idx: number, activeTab: number): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let text: string = l10n.getConstant(protectText + item);
        this.ribbon.items[activeTab].content[idx].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText('protect', text);
    }

    private addToolbarItems(args: { tab: string, items: ItemModel[], index: number }): void {
        this.ribbon.addToolbarItems(args.tab, args.items, args.index);
    }

    private enableToolbarItems(args: { tab?: string, items?: number[] | string[], enable?: boolean }[]): void {
        args.forEach((arg: { tab?: string, items?: number[] | string[], enable: boolean }): void => {
            this.ribbon.enableItems(arg.tab || this.ribbon.items[this.ribbon.selectedTab].header.text, arg.items, arg.enable);
        });
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
                        items: this.getRibbonMenuItems(),
                        select: this.fileMenuItemSelect.bind(this),
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
            content: this.ribbon.items[0].header.text as string,
            items: [
                { text: this.ribbon.items[0].header.text as string },
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
            items: this.ribbon.items[0].content,
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
    private enableRibbonTabs(args: { tabs: string[], enable: boolean }): void {
        this.ribbon.enableTabs(args.tabs, args.enable);
    }
    private fileMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        this.parent.trigger('fileMenuBeforeClose', args);
    }
    private hideFileMenuItems(args: { items: string[], hide: boolean, isUniqueId: boolean }): void {
        this.ribbon.hideMenuItems(args.items, args.hide, args.isUniqueId);
    }
    private addFileMenuItems(args: { items: MenuItemModel[], text: string, insertAfter: boolean, isUniqueId: boolean }): void {
        this.ribbon.addMenuItems(args.items, args.text, args.insertAfter, args.isUniqueId);
    }
    private hideToolbarItems(args: { tab: string, indexes: number[], hide: boolean }): void {
        this.ribbon.hideToolbarItems(args.tab, args.indexes, args.hide);
    }
    private protectSheetHandler(args?: {
        disableHomeBtnId: string[], enableHomeBtnId: string[], enableFrmlaBtnId: string[],
        enableInsertBtnId: string[], findBtnId: string[], dataValidationBtnId: string[]
    }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if ((sheet.isProtected && sheet.protectSettings.formatCells) || !sheet.isProtected) {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.enableHomeBtnId, enable: true }]);
            this.parent.notify(setUndoRedo, null);

        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.disableHomeBtnId, enable: false }]);
        }
        if ((sheet.isProtected && sheet.protectSettings.insertLink) || !sheet.isProtected) {
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.enableInsertBtnId, enable: true }]);
        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.enableInsertBtnId, enable: false }]);
        }
        if ((sheet.isProtected && sheet.protectSettings.selectCells) || !sheet.isProtected) {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.findBtnId, enable: true }]);
        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.findBtnId, enable: false }]);
        }
        if (sheet.isProtected) {
            this.enableToolbarItems([{ tab: l10n.getConstant('Data'), items: args.dataValidationBtnId, enable: false }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Formulas'), items: args.enableFrmlaBtnId, enable: false }]);
        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Data'), items: args.dataValidationBtnId, enable: true }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Formulas'), items: args.enableFrmlaBtnId, enable: true }]);
        }
    }
    private updateMergeItem(e: MouseEvent & TouchEvent): void {
        if (e.type === 'mousemove' || e.type === 'pointermove' || (e.shiftKey && e.type === 'mousedown') ||
            (e.target && closest(e.target as Element, '.e-header-cell'))) {
            let indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            if ((indexes[1] !== indexes[3] || indexes[0] !== indexes[2]) && !this.parent.getActiveSheet().isProtected) {
                this.enableToolbarItems([{ tab: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Home'),
                    items: [`${this.parent.element.id}_merge_cells`], enable: true }]);
                this.toggleActiveState(false);
            }
        }
    }

    private blankWorkbook(): void {
        this.parent.sheets.length = 0; this.parent.sheetNameCount = 1;
        this.parent.notify(sheetsDestroyed, {}); this.parent.createSheet();
        this.parent.activeSheetIndex = this.parent.sheets.length - 1;
        this.parent.notify(refreshSheetTabs, {});
        this.parent.renderModule.refreshSheet();
    }
    private addEventListener(): void {
        this.parent.on(ribbon, this.initRibbon, this);
        this.parent.on(enableToolbarItems, this.enableToolbarItems, this);
        this.parent.on(activeCellChanged, this.refreshRibbonContent, this);
        this.parent.on(updateToggleItem, this.toggleRibbonItems, this);
        this.parent.on(enableFileMenuItems, this.enableFileMenuItems, this);
        this.parent.on(hideRibbonTabs, this.hideRibbonTabs, this);
        this.parent.on(addRibbonTabs, this.addRibbonTabs, this);
        this.parent.on(addToolbarItems, this.addToolbarItems, this);
        this.parent.on(hideFileMenuItems, this.hideFileMenuItems, this);
        this.parent.on(addFileMenuItems, this.addFileMenuItems, this);
        this.parent.on(hideToolbarItems, this.hideToolbarItems, this);
        this.parent.on(enableRibbonTabs, this.enableRibbonTabs, this);
        this.parent.on(protectCellFormat, this.protectSheetHandler, this);
        this.parent.on(selectionComplete, this.updateMergeItem, this);
        this.parent.on(blankWorkbook, this.blankWorkbook, this);
    }
    public destroy(): void {
        let parentElem: HTMLElement = this.parent.element;
        let ribbonEle: HTMLElement = this.ribbon.element;
        let id: string = parentElem.id;
        ['bold', 'italic', 'line-through', 'underline'].forEach((name: string): void => {
            destroyComponent(parentElem.querySelector('#' + `${id}_${name}`), Button);
        });
        this.pasteSplitBtn.destroy(); this.pasteSplitBtn = null;
        this.mergeSplitBtn.destroy(); this.mergeSplitBtn = null;
        this.numFormatDDB.destroy(); this.numFormatDDB = null;
        this.fontSizeDdb.destroy(); this.fontSizeDdb = null;
        this.fontNameDdb.destroy(); this.fontNameDdb = null;
        this.textAlignDdb.destroy(); this.textAlignDdb = null;
        this.verticalAlignDdb.destroy(); this.verticalAlignDdb = null;
        this.sortingDdb.destroy(); this.sortingDdb = null;
        this.colorPicker.destroy(); this.colorPicker = null;
        this.bordersMenu.destroy(); this.bordersMenu = null;
        this.borderSplitBtn.destroy(); this.borderSplitBtn = null;
        this.findDdb.destroy(); this.findDdb = null;
        this.parent.notify('destroyRibbonComponents', null);
        this.ribbon.destroy();
        if (ribbonEle) { detach(ribbonEle); } this.ribbon = null;
        this.removeEventListener();
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbon, this.initRibbon);
            this.parent.off(enableToolbarItems, this.enableToolbarItems);
            this.parent.off(activeCellChanged, this.refreshRibbonContent);
            this.parent.off(updateToggleItem, this.toggleRibbonItems);
            this.parent.off(enableFileMenuItems, this.enableFileMenuItems);
            this.parent.off(hideRibbonTabs, this.hideRibbonTabs);
            this.parent.off(addRibbonTabs, this.addRibbonTabs);
            this.parent.off(addToolbarItems, this.addToolbarItems);
            this.parent.off(hideFileMenuItems, this.hideFileMenuItems);
            this.parent.off(addFileMenuItems, this.addFileMenuItems);
            this.parent.off(hideToolbarItems, this.hideToolbarItems);
            this.parent.off(enableRibbonTabs, this.enableRibbonTabs);
            this.parent.off(protectCellFormat, this.protectSheetHandler);
            this.parent.off(selectionComplete, this.updateMergeItem);
            this.parent.off(blankWorkbook, this.blankWorkbook);
        }
    }
}