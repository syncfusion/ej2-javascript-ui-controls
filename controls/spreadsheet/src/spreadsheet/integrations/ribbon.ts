import { Ribbon as RibbonComponent, RibbonItemModel, ExpandCollapseEventArgs } from '../../ribbon/index';
import { Spreadsheet } from '../base/index';
import { ribbon, MenuSelectEventArgs, beforeRibbonCreate, removeDataValidation, clearViewer, initiateFilterUI } from '../common/index';
import { initiateDataValidation, invalidData, setUndoRedo, renderCFDlg, focus, freeze, toggleProtect } from '../common/index';
import { dialog, reapplyFilter, enableFileMenuItems, applyProtect, protectCellFormat, protectWorkbook } from '../common/index';
import { DialogBeforeOpenEventArgs, insertChart, chartDesignTab, unProtectWorkbook } from '../common/index';
import { IRenderer, destroyComponent, performUndoRedo, completeAction, applySort, hideRibbonTabs } from '../common/index';
import { enableToolbarItems, ribbonClick, paste, locale, initiateCustomSort, getFilteredColumn } from '../common/index';
import { tabSwitch, getUpdateUsingRaf, updateToggleItem, initiateHyperlink, editHyperlink, clearFilter } from '../common/index';
import { addRibbonTabs, addToolbarItems, hideFileMenuItems, addFileMenuItems, hideToolbarItems, enableRibbonTabs } from '../common/index';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, ClickEventArgs, Toolbar, Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ItemModel as TlbItemModel } from '@syncfusion/ej2-navigations';
import { SelectingEventArgs } from '@syncfusion/ej2-navigations';
import { ColorPicker, ColorPickerEventArgs, PaletteTileEventArgs } from '@syncfusion/ej2-inputs';
import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { extend, L10n, isNullOrUndefined, getComponent, closest, detach, selectAll, select, EventHandler } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { SheetModel, getCellIndexes, CellModel, getFormatFromType, getTypeFromFormat, setCell, RowModel } from '../../workbook/index';
import { DropDownButton, OpenCloseMenuEventArgs, SplitButton, ClickEventArgs as BtnClickEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { calculatePosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { applyNumberFormatting, getFormattedCellObject, getRangeIndexes, setMerge, unMerge } from '../../workbook/common/index';
import { activeCellChanged, textDecorationUpdate, BeforeCellFormatArgs, isNumber, MergeArgs, exportDialog } from '../../workbook/common/index';
import { SortOrder, NumberFormatType, SetCellFormatArgs, CFArgs, clearCFRule, NumberFormatArgs } from '../../workbook/common/index';
import { getCell, FontFamily, VerticalAlign, TextAlign, CellStyleModel, setCellFormat, selectionComplete } from '../../workbook/index';
import { Button } from '@syncfusion/ej2-buttons';
import { ColorPicker as RibbonColorPicker } from './color-picker';
import { Dialog } from '../services';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { insertDesignChart, removeDesignChart, isImported } from '../common/index';
import { refreshRibbonIcons, ChartTheme, beginAction, count, setCFRule, addFormatToCustomFormatDlg } from '../../workbook/common/index';
import { currencyFormat, findToolDlg } from '../../workbook/common/index';

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
    private bordersDdb: DropDownButton;
    private cfDdb: DropDownButton;
    private clearDdb: DropDownButton;
    private findDdb: Button;
    private border: string = '1px solid #000000';
    private fontNameIndex: number = 5;
    private numPopupWidth: number = 0;
    private pasteSplitBtn: SplitButton;
    private colorPicker: ColorPicker;
    private mergeSplitBtn: SplitButton;
    private preTabIdx: number = 1;
    private addChartDdb: DropDownButton;
    private cPickerEle: HTMLElement;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        new RibbonColorPicker(parent);
    }
    public getModuleName(): string {
        return 'ribbon';
    }
    private ribbonOperation(args?: { onPropertyChange: boolean, prop: string }): void {
        if (args && args.onPropertyChange) {
            this.onPropertyChanged(args.prop);
        } else {
            this.initialize();
        }
    }
    private initialize(onPropertyChange?: boolean): void {
        this.parent.notify(beforeRibbonCreate, {});
        if (this.parent.isMobileView()) {
            this.createMobileView();
        } else {
            const refEle: Element = onPropertyChange && (this.parent.element.querySelector('.e-formula-bar-panel') ||
                document.getElementById(this.parent.element.id + '_sheet_panel'));
            this.createRibbon(refEle);
        }
    }
    private getRibbonMenuItems(): MenuItemModel[] {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const id: string = this.parent.element.id;
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
                        { text: l10n.getConstant('CSV'), id: `${id}_Csv`, iconCss: 'e-csv e-icons' },
                        { text: l10n.getConstant('PDF'), id: `${id}_Pdf`, iconCss: 'e-pdf e-icons' }
                    ]
                }]
        }];
    }


    private getRibbonItems(): RibbonItemModel[] {
        const id: string = this.parent.element.id; const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const items: RibbonItemModel[] = [  {
            header: { text: l10n.getConstant('Home') },
            content: [
                { prefixIcon: 'e-undo-icon', tooltipText: `${l10n.getConstant('Undo')} (Ctrl+Z)`,
                    htmlAttributes: { 'aria-label': l10n.getConstant('Undo') }, id: id + '_undo', disabled: true },
                { prefixIcon: 'e-redo-icon', tooltipText: `${l10n.getConstant('Redo')} (Ctrl+Y)`,
                    htmlAttributes: { 'aria-label': l10n.getConstant('Redo') }, id: id + '_redo', disabled: true },
                { type: 'Separator', id: id + '_separator_1' },
                { prefixIcon: 'e-cut-icon', tooltipText: `${l10n.getConstant('Cut')} (Ctrl+X)`,
                    htmlAttributes: { 'aria-label': l10n.getConstant('Cut') }, id: id + '_cut'},
                { prefixIcon: 'e-copy-icon', tooltipText: `${l10n.getConstant('Copy')} (Ctrl+C)`,
                    htmlAttributes: { 'aria-label': l10n.getConstant('Copy') }, id: id + '_copy' },
                { tooltipText: `${l10n.getConstant('Paste')} (Ctrl+V)`, template: this.getPasteBtn(id, l10n), id: id + '_paste',
                    disabled: true }, { type: 'Separator', id: id + '_separator_2' },
                { template: this.getNumFormatDDB(id, l10n), tooltipText: l10n.getConstant('NumberFormat'), id: id + '_number_format' },
                { type: 'Separator', id: id + '_separator_3' },
                { template: this.getFontNameDDB(id), tooltipText: l10n.getConstant('Font'), id: id + '_font_name' },
                { type: 'Separator', id: id + '_separator_4' },
                { template: this.getFontSizeDDB(id), tooltipText: l10n.getConstant('FontSize'), id: id + '_font_size' },
                { type: 'Separator', id: id + '_separator_5' },
                { template: this.getBtn(id, 'bold', l10n.getConstant('Bold')), tooltipText: `${l10n.getConstant('Bold')} (Ctrl+B)`,
                    id: id + '_bold' },
                { template: this.getBtn(id, 'italic', l10n.getConstant('Italic')), tooltipText: `${l10n.getConstant('Italic')} (Ctrl+I)`,
                    id: id + '_italic' },
                { template: this.getBtn(id, 'line-through', l10n.getConstant('Strikethrough')),
                    tooltipText: `${l10n.getConstant('Strikethrough')} (Ctrl+5)`,
                    id: id + '_line-through' },
                { template: this.getBtn(id, 'underline', l10n.getConstant('Underline')), tooltipText: `${l10n.getConstant('Underline')} (Ctrl+U)`,
                    id: id + '_underline' },
                { template: document.getElementById(`${id}_font_color_picker`), tooltipText: l10n.getConstant('TextColor'),
                    id: id + '_font_color_picker' }, { type: 'Separator', id: id + '_separator_6' },
                { template: document.getElementById(`${id}_fill_color_picker`), tooltipText: l10n.getConstant('FillColor'),
                    id: id + '_fill_color_picker' },
                { template: this.getBordersDBB(id), tooltipText: l10n.getConstant('Borders'), id: id + '_borders' },
                { template: this.getMergeSplitBtn(id), tooltipText: l10n.getConstant('MergeCells'),
                    htmlAttributes: { 'aria-label': l10n.getConstant('MergeCells') }, id: id + '_merge_cells', disabled: true },
                { type: 'Separator', id: id + '_separator_7' },
                { template: this.getTextAlignDDB(id), tooltipText: l10n.getConstant('HorizontalAlignment'), id: id + '_text_align' },
                { template: this.getVerticalAlignDDB(id), tooltipText: l10n.getConstant('VerticalAlignment'), id: id + '_vertical_align' },
                { template: this.getBtn(id, 'wrap', l10n.getConstant('WrapText'), false), tooltipText: `${l10n.getConstant('WrapText')}`, id: id + '_wrap' }]
        },
        {
            header: { text: l10n.getConstant('Insert') }, content: [
                {
                    prefixIcon: 'e-hyperlink-icon', text: l10n.getConstant('Link'),
                    id: id + '_hyperlink', tooltipText: l10n.getConstant('Link'), click: (): void => { this.getHyperlinkDlg(); }
                },
                {
                    prefixIcon: 'e-image-icon', text: l10n.getConstant('Image'),
                    id: id + '_image', tooltipText: l10n.getConstant('Image'), click: (): void =>
                    { select('#' + id + '_imageUpload', this.parent.element).click(); }
                }]
        },
        {
            header: { text: l10n.getConstant('Formulas') }, content: [{
                prefixIcon: 'e-insert-function', tooltipText: l10n.getConstant('InsertFunction'), text: l10n.getConstant('InsertFunction'),
                id: id + '_insert_function'
            }]
        },
        {
            header: { text: l10n.getConstant('Data') }, content: [
                {
                    prefixIcon: 'e-protect-icon', text: l10n.getConstant('ProtectSheet'), id: id + '_protect',
                    tooltipText: l10n.getConstant('ProtectSheet')
                },
                {
                    prefixIcon: 'e-password-protect-icon', text: l10n.getConstant('ProtectWorkbook'), id: id + '_protectworkbook',
                    tooltipText: l10n.getConstant('ProtectWorkbook')
                },
                { type: 'Separator', id: id + '_separator_8' },
                {
                    template: this.datavalidationDDB(id), tooltipText: l10n.getConstant('DataValidation'),
                    id: id + '_datavalidation'
                }
            ]
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
                },
                { type: 'Separator', id: id + '_separator_13' },
                { prefixIcon: 'e-freeze-pane', text: l10n.getConstant('FreezePanes'), id: id + '_freezepanes', tooltipText:
                    l10n.getConstant('FreezePanes'), disabled: !this.parent.allowFreezePane },
                { prefixIcon: 'e-freeze-row', text: l10n.getConstant('FreezeRows'), id: id + '_freezerows', tooltipText:
                    l10n.getConstant('FreezeRows'), disabled: !this.parent.allowFreezePane },
                { prefixIcon: 'e-freeze-column', text: l10n.getConstant('FreezeColumns'), id: id + '_freezecolumns', tooltipText:
                    l10n.getConstant('FreezeColumns'), disabled: !this.parent.allowFreezePane }
            ]
        }];

        if (this.parent.allowConditionalFormat) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                { type: 'Separator', id: id + '_separator_10' },
                { template: this.getCFDBB(id), tooltipText: l10n.getConstant('ConditionalFormatting'), id: id + '_conditionalformatting' });
        }
        if (this.parent.allowChart) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Insert')).content.push(
                { type: 'Separator', id: id + '_separator_11' },
                {
                    template: this.getChartDDB(id, true), text: l10n.getConstant('Chart'),
                    tooltipText: l10n.getConstant('Chart'), id: id + '_chart'
                });
        }
        if (this.parent.allowCellFormatting) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                { type: 'Separator', id: id + '_separator_12' },
                { template: this.getClearDDB(id), tooltipText: l10n.getConstant('Clear'), id: id + '_clear' });
        }
        if (this.parent.allowSorting || this.parent.allowFiltering) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                { template: this.getSortFilterDDB(id), tooltipText: l10n.getConstant('SortAndFilter'), id: id + '_sorting' });
        }
        if (this.parent.allowFindAndReplace) {
            items.find((x: RibbonItemModel) => x.header && x.header.text === l10n.getConstant('Home')).content.push(
                {
                    template: this.getFindBtn(id), prefixIcon: 'e-tbar-search-icon tb-icons',
                    tooltipText: l10n.getConstant('FindReplaceTooltip'), id: id + '_find'
                });
        }
        return items;
    }

    private getPasteBtn(id: string, l10n: L10n): Element {
        const btn: HTMLElement = this.parent.element.appendChild(
            this.parent.createElement('button', { id: id + '_paste', attrs: { 'type': 'button' } }));
        this.pasteSplitBtn = new SplitButton(
            {
                iconCss: 'e-icons e-paste-icon',
                items: [
                    { text: l10n.getConstant('All'), id: 'All' },
                    { text: l10n.getConstant('Values'), id: 'Values' },
                    { text: l10n.getConstant('Formats'), id: 'Formats' }],
                createPopupOnClick: true,
                select: (args: MenuEventArgs) => {
                    this.pasteSplitBtn.element.setAttribute('aria-label', l10n.getConstant('Paste') + ' ' + args.item.text);
                    this.parent.notify(paste, { type: args.item.id, isAction: true, isInternal: true });
                },
                click: () => {
                    btn.setAttribute('aria-label', l10n.getConstant('Paste'));
                    this.parent.notify(paste, { isAction: true, isInternal: true });
                },
                beforeOpen: (args: MenuEventArgs) => {
                    args.element.setAttribute('aria-label', l10n.getConstant('Paste'));
                }
            });
        this.pasteSplitBtn.createElement = this.parent.createElement;
        this.pasteSplitBtn.appendTo(btn);
        return btn.parentElement;
    }

    private getHyperlinkDlg(): void {
        const indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        const row: RowModel = this.parent.sheets[this.parent.activeSheetIndex].rows[indexes[0]];
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

    private passwordProtectDlg(): void {
        if (this.parent.password.length > 0) {
            this.parent.notify(unProtectWorkbook, null);
        }
        else{
            if (document.getElementById(this.parent.element.id + '_protectworkbook').classList.contains('e-active')) {
                document.getElementById(this.parent.element.id + '_protectworkbook').classList.remove('e-active');
                if (this.parent.showSheetTabs) { this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled'); }
            } else {
                this.parent.notify(protectWorkbook, null);
            }
        }
    }

    private getLocaleText(str: string): string {
        let text: string; const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet['show' + str]) {
            text = l10n.getConstant('Hide' + str);
        } else {
            text = l10n.getConstant('Show' + str);
        }
        return text;
    }

    private getLocaleProtectText(str: string, setClass?: boolean): string {
        let text: string; const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected) {
            if (setClass) { this.parent.getMainContent().classList.remove('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Unprotect' + str);
        } else {
            if (setClass) { this.parent.getMainContent().classList.add('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant('Protect' + str);
        }
        return text;
    }

    private getLocaleProtectWorkbook(str: string, setClass?: boolean): string {
        let text: string; const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.isProtected) {
            if (setClass) { this.parent.getMainContent().classList.remove('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant(str);
        } else {
            if (setClass) { this.parent.getMainContent().classList.add('e-hide-' + str.toLowerCase()); }
            text = l10n.getConstant(str);
        }
        return text;
    }

    private insertDesignChart(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const tabIdx: number = this.ribbon.items.length - 1;
        const chartTabHeader: string = l10n.getConstant('ChartDesign');
        if (this.parent.allowChart && this.ribbon.items[tabIdx as number] && this.ribbon.items[tabIdx as number].header.text !==
            chartTabHeader) {
            this.preTabIdx = this.ribbon.selectedTab;
            const id: string = this.parent.element.id;
            const items: RibbonItemModel[] = [{
                header: { text: chartTabHeader },
                content: [
                    {
                        template: this.getAddChartEleDBB(id),
                        tooltipText: l10n.getConstant('AddChartElement'), id: id + 'add_chart_ element_chart'
                    },
                    { type: 'Separator' },
                    {
                        prefixIcon: 'e-switch-row-column-icon', text: l10n.getConstant('SwitchRowColumn'),
                        tooltipText: l10n.getConstant('SwitchRowColumn'),
                        id: id + 'switch_row_column_chart', click: (): void => {
                            this.parent.notify(chartDesignTab, { switchRowColumn: true, triggerEvent: true });
                        }
                    },
                    { type: 'Separator' },
                    { template: this.getChartThemeDDB(id), tooltipText: l10n.getConstant('ChartTheme'), id: id + '_chart_theme' },
                    { type: 'Separator'},
                    { template: this.getChartDDB(id, false), tooltipText: l10n.getConstant('ChartType'), id: id + '_chart_type' }

                ]
            }];
            this.addRibbonTabs({ items: items });
            this.ribbon.tabObj.select(this.ribbon.items.length);
        }
    }

    private removeDesignChart(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const tabIdx: number = this.ribbon.items.length - 1;
        if (this.ribbon.items[tabIdx as number] && this.ribbon.items[tabIdx as number].header.text ===
            l10n.getConstant('ChartDesign')) {
            this.ribbon.tabObj.select(this.preTabIdx + 1);
            this.parent.hideRibbonTabs([l10n.getConstant('ChartDesign')], true);
            if (document.getElementsByClassName('e-addchart-ddb').length > 0) {
                document.getElementsByClassName('e-addchart-ddb')[0].remove();
            }
            if (document.getElementsByClassName('e-chart-type-ddb').length > 0) {
                document.getElementsByClassName('e-chart-type-ddb')[0].remove();
            }
            if (document.getElementsByClassName('e-charttheme-ddb').length > 0) {
                document.getElementsByClassName('e-charttheme-ddb')[0].remove();
            }
            delete this.ribbon.items[tabIdx as number].content[0];
            this.ribbon.items.length = this.ribbon.items.length - 1;
        }
    }

    private createRibbon(refEle?: Element): void {
        const ribbonElement: HTMLElement = this.parent.createElement('div', { id: `${this.parent.element.id}_ribbon` });
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
        if (refEle) {
            this.parent.element.insertBefore(ribbonElement, refEle);
        } else {
            this.parent.element.appendChild(ribbonElement);
        }
        this.ribbon.appendTo(ribbonElement);
    }
    private tabSelecting(args: SelectingEventArgs): void {
        if (args.selectingIndex !== this.ribbon.selectedTab) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            if (this.ribbon.items[args.selectingIndex] && this.ribbon.items[args.selectingIndex].header.text ===
                l10n.getConstant('Insert')) {
                this.createChartDdb(document.getElementById(this.parent.element.id + '_chart-btn'), true);
            }
            if (this.ribbon.items[args.selectedIndex] && this.ribbon.items[args.selectedIndex].header.text ===
                l10n.getConstant('Insert')) {
                const ribbonContent: TlbItemModel[] = this.ribbon.items[args.selectedIndex].content;
                for (let i: number = ribbonContent.length - 1; i >= 0; i--) {
                    if (ribbonContent[i as number].id === this.parent.element.id + '_chart') {
                        const chartBtn: HTMLElement = ribbonContent[i as number].template as HTMLElement;
                        if (chartBtn && chartBtn.classList.contains('e-dropdown-btn')) {
                            this.destroyComponent(chartBtn, 'dropdown-btn');
                        }
                        break;
                    }
                }
            }
            this.refreshRibbonContent(args.selectingIndex);
            this.parent.notify(tabSwitch, { activeTab: args.selectingIndex });
        }
    }

    private beforeRenderHandler(args: MenuEventArgs): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (args.item.text === l10n.getConstant('Open') && (!this.parent.openUrl || !this.parent.allowOpen)) {
            args.element.classList.add('e-disabled');
        }
        if (args.item.text === l10n.getConstant('SaveAs') && (!this.parent.saveUrl || !this.parent.allowSave)) {
            args.element.classList.add('e-disabled');
        }
    }

    private getChartThemeDDB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const chartThemeBtn: HTMLElement = this.parent.createElement(
            'button', { id: id + '_chart_theme', attrs: { 'type': 'button' }, className: 'e-ss-ddb' });
        chartThemeBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text' }));
        let theme: ChartTheme = 'Material';
        const overlay: HTMLElement = this.parent.element.querySelector('.e-ss-overlay-active');
        if (overlay) {
            let chart: HTMLElement = overlay.querySelector('.e-chart');
            if (chart) {
                theme = (getComponent(chart, 'chart') as { theme: ChartTheme }).theme;
            } else {
                chart = overlay.querySelector('.e-accumulationchart');
                if (chart) {
                    theme = (getComponent(chart, 'accumulationchart') as { theme: ChartTheme }).theme;
                }
            }
        }
        const chartThemeDDB: DropDownButton = new DropDownButton({
            items: this.getChartThemeDdbItems(theme),
            content: l10n.getConstant(theme),
            createPopupOnClick: true,
            select: (args: MenuEventArgs): void => {
                this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
                if (!args.element || !args.element.querySelector('.e-selected-icon')) {
                    chartThemeDDB.content = args.item.text;
                    chartThemeDDB.dataBind();
                    this.parent.notify(chartDesignTab, { chartTheme: args.item.id, triggerEvent: true });
                    chartThemeDDB.setProperties({ items: this.getChartThemeDdbItems(args.item.id) }, true);
                }
            },
            cssClass: 'e-flat e-charttheme-ddb',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.tBarDdbBeforeOpen(
                    args.element, args.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Chart'));
            }
        });
        chartThemeDDB.createElement = this.parent.createElement;
        chartThemeDDB.appendTo(chartThemeBtn);
        return chartThemeBtn;
    }

    private getNumFormatDDB(id: string, l10n: L10n): Element {
        const numFormatBtn: HTMLElement = this.parent.createElement(
            'button', { id: id + '_number_format', attrs: { 'type': 'button' }, className: 'e-ss-ddb' });
        const numFormatText: HTMLElement = this.parent.createElement('span', { className: 'e-tbar-btn-text' });
        numFormatText.innerText = l10n.getConstant('General');
        numFormatBtn.appendChild(numFormatText);
        const customFormatData: string[] = ['General', '0', '0.00', '#,##0', '#,##0.00', '#,##0_);(#,##0)', '#,##0_);[Red](#,##0)',
            '#,##0.00_);(#,##0.00)', '#,##0.00_);[Red](#,##0.00)', currencyFormat.currency[4], currencyFormat.currency[2],
            currencyFormat.currency[3], currencyFormat.currency[5],'0%', '0.00%', '0.00E+00', '##0.0E+0', '# ?/?', '# ??/??', 'dd-MM-yy',
            'dd-MMM-yy', 'dd-MMM', 'MMM-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM', 'h:mm', 'h:mm:ss', 'dd-MM-yy h:mm', 'mm:ss', 'mm:ss.0', '@',
            '[h]:mm:ss', currencyFormat.accounting[1], '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)', currencyFormat.accounting[0],
            '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)'];
        this.numFormatDDB = new DropDownButton({
            items: this.getNumFormatDdbItems(id),
            createPopupOnClick: true,
            select: (args: MenuEventArgs): void => {
                const l10n: L10n = this.parent.serviceLocator.getService(locale);
                if (args.item.text === l10n.getConstant('Custom')) {
                    this.renderCustomFormatDialog(customFormatData);
                } else {
                    const type: NumberFormatType = args.item.id.split(this.parent.element.id + '_')[1] as NumberFormatType;
                    this.applyNumFormat(getFormatFromType(type), args.item.text);
                    const sheet: SheetModel = this.parent.getActiveSheet();
                    const cellIndex: number[] = getCellIndexes(sheet.activeCell);
                    this.refreshTextAlign(sheet, getCell(cellIndex[0], cellIndex[1], sheet, false, true), type, cellIndex);
                    this.numFormatDDB.element.setAttribute('aria-label', type);
                }
            },
            open: (args: OpenCloseMenuEventArgs): void => this.numDDBOpen(args),
            beforeItemRender: (args: MenuEventArgs): void => this.previewNumFormat(args),
            cssClass: 'e-flat e-numformat-ddb',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.tBarDdbBeforeOpen(
                    args.element, args.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('NumberFormat'));
            },
        });
        this.numFormatDDB.createElement = this.parent.createElement;
        this.numFormatDDB.appendTo(numFormatBtn);
        return numFormatBtn;
    }

    private getFontSizeDDB(id: string): Element {
        this.fontSizeDdb = new DropDownButton({
            cssClass: 'e-font-size-ddb',
            content: '11',
            createPopupOnClick: true,
            items: [{ text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '14' }, { text: '16' },
                { text: '18' }, { text: '20' }, { text: '22' }, { text: '24' }, { text: '26' }, { text: '28' }, { text: '36' },
                { text: '48' }, { text: '72' }],
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.tBarDdbBeforeOpen(
                    args.element, args.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('FontSize'));
                this.refreshSelected(this.fontSizeDdb, args.element, 'content', 'text');
            },
            select: (args: MenuEventArgs): void => {
                const eventArgs: SetCellFormatArgs = { style: { fontSize: `${args.item.text}pt` }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) { this.fontSizeDdb.content = eventArgs.style.fontSize.split('pt')[0]; this.fontSizeDdb.dataBind(); }
                this.fontSizeDdb.element.setAttribute('aria-label', args.item.text);
            }
        });
        this.fontSizeDdb.createElement = this.parent.createElement;
        this.fontSizeDdb.appendTo(
            this.parent.createElement('button', { id: id + '_font_size', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.fontSizeDdb.element;
    }

    private getChartDDB(id: string, isChart: boolean): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let chartBtn: HTMLElement;
        if (isChart) {
            chartBtn = this.parent.createElement('button', { id: id + '_chart-btn', attrs: { 'type': 'button' } });
            const chartBtnSpan: HTMLElement = this.parent.createElement('span', { id: id + '_chart' });
            chartBtnSpan.innerText = l10n.getConstant('Chart');
            chartBtn.appendChild(chartBtnSpan);
        } else {
            chartBtn = this.parent.createElement('button', { id: id + '_chart-type-btn', attrs: { 'type': 'button' } });
            const chartBtnSpan: HTMLElement = this.parent.createElement('span', { id: id + '_chart_type' });
            chartBtnSpan.innerText = l10n.getConstant('ChartType');
            chartBtn.appendChild(chartBtnSpan);
            this.createChartDdb(chartBtn, false);
        }
        return chartBtn;
    }

    private closeDropdownPopup(e: KeyboardEvent): void {
        if ((e.altKey && e.keyCode === 38) || e.keyCode === 27) {
            const dropdownObj: DropDownButton = this[1];
            if (dropdownObj) {
                dropdownObj.toggle();
                focus(dropdownObj.element);
            }
        }
    }

    private createChartDdb(chartBtn: HTMLElement, isChart: boolean): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const menuClass: string = isChart ? 'e-chart-menu' : 'e-chart-type-menu';
        const ul: HTMLElement = this.parent.createElement(
            'ul', { id: `${this.parent.element.id}${isChart ? '_chart_menu' : '_chart_type_menu'}` });
        let chartMenu: Menu;
        const chartDdb: DropDownButton = new DropDownButton({
            iconCss: `e-icons ${isChart ? 'e-chart-icon' : 'e-chart-type-icon'}`,
            cssClass: isChart ? 'e-chart-ddb' : 'e-chart-type-ddb',
            target: ul,
            createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                chartMenu = this.createChartMenu(ul, menuClass, l10n, chartDdb);
                this.tBarDdbBeforeOpen(
                    args.element, chartMenu.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Chart'));
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, chartDdb]);
            },
            open: (): void => focus(ul),
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.' + menuClass)) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                    chartMenu.destroy();
                }
            }
        });
        chartDdb.createElement = this.parent.createElement;
        chartDdb.appendTo(chartBtn);
    }

    private createChartMenu(ul: HTMLElement, cssClass: string, l10n: L10n, chartDdb: DropDownButton): Menu {
        const chartMenu: Menu = new Menu({
            cssClass: cssClass,
            items: [
                {
                    iconCss: 'e-icons e-column', text: l10n.getConstant('Column'),
                    items: [{ id: 'column_chart' }]
                },
                {
                    iconCss: 'e-icons e-bar', text: l10n.getConstant('Bar'),
                    items: [{ id: 'bar_chart' }]
                },
                {
                    iconCss: 'e-icons e-area', text: l10n.getConstant('Area'),
                    items: [{ id: 'area_chart' }]
                },
                {
                    iconCss: 'e-icons e-pie-doughnut', text: l10n.getConstant('PieAndDoughnut'),
                    items: [{ id: 'pie_doughnut_chart' }]
                },
                {
                    iconCss: 'e-icons e-line', text: l10n.getConstant('Line'),
                    items: [{ id: 'line_chart' }]
                },
                // {
                //     iconCss: 'e-icons e-radar', text: l10n.getConstant('Radar'),
                //     items: [{ id: 'radar_chart' }]
                // },
                {
                    iconCss: 'e-icons e-scatter', text: l10n.getConstant('Scatter'),
                    items: [{ id: 'scatter_chart' }]
                }
            ],
            orientation: 'Vertical',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                let wrapperCls: string;
                if (args.parentItem.text === l10n.getConstant('Column')) {
                    args.element.firstChild.appendChild(column);
                    wrapperCls = 'e-column-chart';
                } else if (args.parentItem.text === l10n.getConstant('Bar')) {
                    args.element.firstChild.appendChild(bar);
                    wrapperCls = 'e-bar-chart';
                } else if (args.parentItem.text === l10n.getConstant('Area')) {
                    args.element.firstChild.appendChild(area);
                    wrapperCls = 'e-area-chart';
                } else if (args.parentItem.text === l10n.getConstant('Line')) {
                    args.element.firstChild.appendChild(line);
                    wrapperCls = 'e-line-chart';
                } else if (args.parentItem.text === l10n.getConstant('PieAndDoughnut')) {
                    args.element.firstChild.appendChild(pie);
                    wrapperCls = 'e-pie-doughnut-chart';
                } else if (args.parentItem.text === l10n.getConstant('Radar')) {
                    args.element.firstChild.appendChild(radar);
                    wrapperCls = 'e-radar-chart';
                } else if (args.parentItem.text === l10n.getConstant('Scatter')) {
                    args.element.firstChild.appendChild(scatter);
                    wrapperCls = 'e-scatter-chart';
                }
                if (wrapperCls) {
                    args.element.parentElement.classList.add(wrapperCls);
                    EventHandler.add(args.element, 'keydown', this.menuIconKeyDown.bind(this, `${wrapperCls} .e-menu-icon`, 0));
                }
            },
            select: (args: MenuEventArgs): void => this.chartSelected(args, chartDdb),
            beforeItemRender: (args: MenuEventArgs): void => {
                if (!args.item.text) {
                    args.element.removeAttribute('tabindex');
                }
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && (args.event as KeyboardEvent).keyCode === 37) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(args.element, 'keydown', this.menuIconKeyDown);
                }
            }
        });
        const column: HTMLElement = this.parent.createElement('div', { id: 'column_main', className: 'e-column-main' });
        const column1Text: HTMLElement = this.parent.createElement('div', { id: 'column1_text', className: 'e-column1-text' });
        column1Text.innerText = l10n.getConstant('Column');
        const column1Cont: HTMLElement = this.parent.createElement('div', { id: 'column1_cont', className: 'e-column1-cont' });
        const column2Cont: HTMLElement = this.parent.createElement('div', { id: 'column2_cont', className: 'e-column2-cont' });
        column.appendChild(column1Text);
        column.appendChild(column1Cont);
        //column.appendChild(column2Text);
        //column.appendChild(column2Cont);
        let cultureText: string = l10n.getConstant('ClusteredColumn');
        const clusteredColumn: HTMLElement = this.parent.createElement(
            'span', { id: 'clusteredColumn', className: 'e-clusteredcolumn e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedColumn');
        const stackedColumn: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedColumn', className: 'e-stackedcolumn e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedColumn100');
        const stackedColumn100: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedColumn100', className: 'e-stackedcolumn100 e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        const clusteredColumn3D: HTMLElement = this.parent.createElement(
            'span', { id: 'clusteredColumn3D', className: 'e-clusteredColumn3D e-column-icon' });
        const stackedColumn3D: HTMLElement =
            this.parent.createElement('span', { id: 'stackedColumn3D', className: 'e-stackedColumn3D e-column-icon' });
        const stackedColumn1003D: HTMLElement =
            this.parent.createElement('span', { id: 'stackedColumn1003D', className: 'e-stackedColumn1003D e-column-icon' });
        column1Cont.appendChild(clusteredColumn); column1Cont.appendChild(stackedColumn); column1Cont.appendChild(stackedColumn100);
        column2Cont.appendChild(clusteredColumn3D); column2Cont.appendChild(stackedColumn3D); column2Cont.appendChild(stackedColumn1003D);
        const bar: HTMLElement = this.parent.createElement('div', { id: 'bar_main', className: 'e-bar-main' });
        const bar1Text: HTMLElement = this.parent.createElement('div', { id: 'bar1_text', className: 'e-bar1-text' });
        bar1Text.innerText = l10n.getConstant('Bar');
        const bar1Cont: HTMLElement = this.parent.createElement('div', { id: 'bar1_cont', className: 'e-bar1-cont' });
        const bar2Cont: HTMLElement = this.parent.createElement('div', { id: 'bar2_cont', className: 'e-bar2-cont' });
        bar.appendChild(bar1Text);
        bar.appendChild(bar1Cont);
        //bar.appendChild(bar2Text);
        //bar.appendChild(bar2Cont);
        cultureText = l10n.getConstant('ClusteredBar');
        const clusteredBar: HTMLElement = this.parent.createElement(
            'span', { id: 'clusteredBar', className: 'e-clusteredbar e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedBar');
        const stackedBar: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedBar', className: 'e-stackedbar e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedBar100');
        const stackedBar100: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedBar100', className: 'e-stackedbar100 e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        const clusteredBar3D: HTMLElement =
            this.parent.createElement('span', { id: 'clusteredBar3D', className: 'e-clusteredBar3D e-bar-icon' });
        const stackedBar3D: HTMLElement =
            this.parent.createElement('span', { id: 'stackedBar3D', className: 'e-stackedBar3D e-bar-icon' });
        const stackedBar1003D: HTMLElement =
            this.parent.createElement('span', { id: 'stackedBar1003D', className: 'e-stackedBar1003D e-bar-icon' });
        bar1Cont.appendChild(clusteredBar); bar1Cont.appendChild(stackedBar); bar1Cont.appendChild(stackedBar100);
        bar2Cont.appendChild(clusteredBar3D); bar2Cont.appendChild(stackedBar3D); bar2Cont.appendChild(stackedBar1003D);

        const area: HTMLElement =
            this.parent.createElement('div', { id: 'area_main', className: 'e-area-main' });
        const areaText: HTMLElement = this.parent.createElement('div', { id: 'area_text', className: 'e-area-text' });
        areaText.innerText = l10n.getConstant('Area');
        const areaCont: HTMLElement =
            this.parent.createElement('div', { id: 'area_cont', className: 'e-area-cont' });
        area.appendChild(areaText);
        area.appendChild(areaCont);
        cultureText = l10n.getConstant('Area');
        const defArea: HTMLElement = this.parent.createElement(
            'span', { id: 'area', className: 'e-area e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedArea');
        const stackedArea: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedArea', className: 'e-stackedarea e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedArea100');
        const stackedArea100: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedArea100', className: 'e-stackedarea100 e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        areaCont.appendChild(defArea); areaCont.appendChild(stackedArea); areaCont.appendChild(stackedArea100);

        const line: HTMLElement =
            this.parent.createElement('div', { id: 'line_main', className: 'e-line-main' });
        const lineText: HTMLElement = this.parent.createElement('div', { id: 'line_text', className: 'e-line-text' });
        lineText.innerText = l10n.getConstant('Line');
        const lineCont: HTMLElement = this.parent.createElement('div', { id: 'line_cont', className: 'e-line-cont' });
        const lineContMarker: HTMLElement = this.parent.createElement('div', { id: 'line_cont_marker', className: 'e-line-cont' });
        line.appendChild(lineText);
        line.appendChild(lineCont);
        line.appendChild(lineContMarker);
        cultureText = l10n.getConstant('Line');
        const defLine: HTMLElement = this.parent.createElement(
            'span', { id: 'line', className: 'e-line e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedLine');
        const stackedLine: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedLine', className: 'e-stackedline e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedLine100');
        const stackedLine100: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedLine100', className: 'e-stackedline100 e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('LineMarker');
        const defLineMarker: HTMLElement = this.parent.createElement(
            'span', { id: 'lineMarker', className: 'e-line-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedLineMarker');
        const stackedLineMarker: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedLineMarker', className: 'e-stackedline-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('StackedLine100Marker');
        const stackedLine100Marker: HTMLElement = this.parent.createElement(
            'span', { id: 'stackedLine100Marker', className: 'e-stackedline100-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        lineCont.appendChild(defLine); lineCont.appendChild(stackedLine); lineCont.appendChild(stackedLine100);
        lineContMarker.appendChild(defLineMarker); lineContMarker.appendChild(stackedLineMarker); lineContMarker.appendChild(stackedLine100Marker);
        const pie: HTMLElement = this.parent.createElement('div', { id: 'pie_main', className: 'e-pie-main' });
        const pieText: HTMLElement = this.parent.createElement('div', { id: 'pie_text', className: 'e-pie-text' });
        pieText.innerText = l10n.getConstant('Pie');
        const pieCont: HTMLElement = this.parent.createElement('div', { id: 'pie_cont', className: 'e-pie-cont' });
        pie.appendChild(pieText);
        pie.appendChild(pieCont);
        cultureText = l10n.getConstant('Pie');
        const defPie: HTMLElement = this.parent.createElement(
            'span', { id: 'pie', className: 'e-pie e-pie-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        cultureText = l10n.getConstant('Doughnut');
        const doughnut: HTMLElement = this.parent.createElement(
            'span', { id: 'doughnut', className: 'e-doughnut e-pie-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        pieCont.appendChild(defPie); pieCont.appendChild(doughnut);

        const radar: HTMLElement = this.parent.createElement('div', { id: 'radar_main', className: 'e-radar-main' });
        const radarText: HTMLElement = this.parent.createElement('div', { id: 'radar_text', className: 'e-radar-text' });
        radarText.innerText = l10n.getConstant('Radar');
        const radarCont: HTMLElement = this.parent.createElement('div', { id: 'radar_cont', className: 'e-radar-cont' });
        radar.appendChild(radarText);
        radar.appendChild(radarCont);
        const defradar: HTMLElement = this.parent.createElement(
            'span', { id: 'radar', className: 'e-radar e-radar-icon e-menu-icon e-icons', attrs: { tabindex: '-1' } });
        const radarMarkers: HTMLElement = this.parent.createElement(
            'span', { id: 'radar_markers', className: 'e-radar-markers e-radar-icon e-menu-icon e-icons', attrs: { tabindex: '-1' } });
        defradar.title = l10n.getConstant('BlueDataBar'); radarMarkers.title = l10n.getConstant('GreenDataBar');
        radarCont.appendChild(defradar); radarCont.appendChild(radarMarkers);

        const scatter: HTMLElement = this.parent.createElement('div', { id: 'scatter_main', className: 'e-scatter-main' });
        const scatterText: HTMLElement = this.parent.createElement('div', { id: 'scatter_text', className: 'e-scatter-text' });
        cultureText = l10n.getConstant('Scatter');
        scatterText.innerText = cultureText;
        const scatterCont: HTMLElement = this.parent.createElement('div', { id: 'scatter_cont', className: 'e-scatter-cont' });
        scatter.appendChild(scatterText);
        scatter.appendChild(scatterCont);
        const defscatter: HTMLElement = this.parent.createElement(
            'span', { id: 'scatter', className: 'e-scatter e-scatter-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
        scatterCont.appendChild(defscatter);
        chartMenu.createElement = this.parent.createElement;
        chartMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return chartMenu;
    }

    private getAddChartEleDBB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const ul: HTMLElement = this.parent.createElement('ul', { id: id + '_add_chart_menu' });
        let addChartMenu: Menu;
        this.addChartDdb = new DropDownButton({
            iconCss: 'e-icons e-addchart-icon',
            cssClass: 'e-addchart-ddb',
            target: ul,
            createPopupOnClick: true,
            close: (): void => focus(this.parent.element),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                addChartMenu = this.createAddChartMenu(ul, l10n);
                this.tBarDdbBeforeOpen(args.element, addChartMenu.items);
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, this.addChartDdb]);
            },
            open: (): void => focus(ul),
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.e-addchart-menu')) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                    addChartMenu.destroy();
                }
            }
        });
        this.addChartDdb.createElement = this.parent.createElement;
        const addChartBtn: HTMLElement = this.parent.createElement('button', { id: id + '_addchart', attrs: { 'type': 'button' } });
        const chartBtnText: HTMLElement = this.parent.createElement('span', { id: id + '_chart' });
        chartBtnText.innerText = l10n.getConstant('AddChartElement');
        addChartBtn.appendChild(chartBtnText);
        this.addChartDdb.appendTo(addChartBtn);
        return this.addChartDdb.element;
    }

    private createAddChartMenu(ul: HTMLElement, l10n: L10n): Menu {
        const addChartMenu: Menu = new Menu({
            cssClass: 'e-addchart-menu', title: l10n.getConstant('AddChartElement'),
            items: [{
                iconCss: 'e-icons e-axes', text: l10n.getConstant('Axes'),
                items: [{
                    iconCss: 'e-icons e-ph-axes', id: 'PHAxes',
                    text: l10n.getConstant('PrimaryHorizontal')
                },
                {
                    iconCss: 'e-icons e-pv-axes', id: 'PVAxes',
                    text: l10n.getConstant('PrimaryVertical')
                }]
            },
            {
                iconCss: 'e-icons e-axis-title', text: l10n.getConstant('AxisTitle'),
                items: [{
                    iconCss: 'e-icons e-ph-axistitle', id: 'PHAxisTitle',
                    text: l10n.getConstant('PrimaryHorizontal')
                },
                {
                    iconCss: 'e-icons e-pv-axistitle', id: 'PVAxisTitle',
                    text: l10n.getConstant('PrimaryVertical')
                }]
            },
            {
                iconCss: 'e-icons e-chart-title', text: l10n.getConstant('ChartTitle'),
                items: [{ iconCss: 'e-icons e-ct-none', id: 'ChartTitleNone', text: l10n.getConstant('None') },
                    { iconCss: 'e-icons e-ct-abovechart', id: 'ChartTitleAbove', text: l10n.getConstant('AboveChart') }
                // { iconCss: 'e-icons e-ct-farchart', id: 'chart_farchart', text: l10n.getConstant('AboveChart') },
                // { iconCss: 'e-icons e-ct-nearchart', id: 'chart_nearchart', text: l10n.getConstant('AboveChart') }
                ]
            },
            {
                iconCss: 'e-icons e-data-labels', id: this.parent.element.id + 'data-labels', text: l10n.getConstant('DataLabels'),
                items: [{ iconCss: 'e-icons e-dl-none', id: 'DLNone', text: l10n.getConstant('None') },
                    { iconCss: 'e-icons e-dl-center', id: 'DLCenter', text: l10n.getConstant('Center') },
                    { iconCss: 'e-icons e-dl-insideend', id: 'DLInsideend', text: l10n.getConstant('InsideEnd') },
                    { iconCss: 'e-icons e-dl-insidebase', id: 'DLInsidebase', text: l10n.getConstant('InsideBase') },
                    { iconCss: 'e-icons e-dl-outsideend', id: 'DLOutsideend', text: l10n.getConstant('OutsideEnd') }]
            },
            {
                iconCss: 'e-icons e-gridlines', text: l10n.getConstant('Gridlines'),
                items: [{
                    iconCss: 'e-icons e-gl-major-horizontal', id: 'GLMajorHorizontal',
                    text: l10n.getConstant('PrimaryMajorHorizontal')
                },
                {
                    iconCss: 'e-icons e-gl-major-vertical', id: 'GLMajorVertical',
                    text: l10n.getConstant('PrimaryMajorVertical')
                },
                {
                    iconCss: 'e-icons e-gl-minor-horizontal', id: 'GLMinorHorizontal',
                    text: l10n.getConstant('PrimaryMinorHorizontal')
                },
                {
                    iconCss: 'e-icons e-gl-minor-vertical', id: 'GLMinorVertical',
                    text: l10n.getConstant('PrimaryMinorVertical')
                }]
            },
            {
                iconCss: 'e-icons e-legends', text: l10n.getConstant('Legends'),
                items: [{ iconCss: 'e-icons e-legends-none', id: 'LegendNone', text: l10n.getConstant('None') },
                    { iconCss: 'e-icons e-legends-right', id: 'LegendsRight', text: l10n.getConstant('Right') },
                    { iconCss: 'e-icons e-legends-left', id: 'LegendsLeft', text: l10n.getConstant('Left') },
                    { iconCss: 'e-icons e-legends-bottom', id: 'LegendsBottom', text: l10n.getConstant('Bottom') },
                    { iconCss: 'e-icons e-legends-top', id: 'LegendsTop', text: l10n.getConstant('Top') }]
            }],
            orientation: 'Vertical',
            select: this.addChartEleSelected.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.id === this.parent.element.id + 'data-labels') {
                    const overlay: HTMLElement = this.parent.element.querySelector('.e-ss-overlay-active');
                    if (overlay) {
                        const chart: HTMLElement = overlay.querySelector('.e-chart');
                        if (chart) {
                            const chartObj: { series: { type: string }[] } = getComponent(chart, 'chart');
                            if (chartObj.series[0].type.includes('Line')) {
                                const updateTextNode: Function = (listIcon: HTMLElement, key: string): void => {
                                    if (listIcon) {
                                        const dlList: HTMLElement = listIcon.parentElement;
                                        dlList.innerHTML = '';
                                        dlList.appendChild(listIcon);
                                        dlList.appendChild(document.createTextNode(l10n.getConstant(key)));
                                    }
                                };
                                updateTextNode(args.element.querySelector('.e-dl-insideend'), 'Above');
                                updateTextNode(args.element.querySelector('.e-dl-insidebase'), 'Below');
                                const outsideIcon: HTMLElement = args.element.querySelector('.e-dl-outsideend');
                                if (outsideIcon) {
                                    outsideIcon.parentElement.style.display = 'none';
                                }
                            }
                        }
                    }
                }
            }
        });
        addChartMenu.createElement = this.parent.createElement;
        addChartMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return addChartMenu;
    }

    private getCFDBB(id: string): Element {
        const ul: HTMLElement = this.parent.createElement('ul', { id: id + '_cf_menu' });
        let cfMenu: Menu;
        this.cfDdb = new DropDownButton({
            iconCss: 'e-icons e-conditionalformatting-icon',
            cssClass: 'e-cf-ddb',
            target: ul,
            createPopupOnClick: true,
            close: (): void => focus(this.parent.element),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                cfMenu = this.createCFMenu(ul);
                this.tBarDdbBeforeOpen(
                    args.element, cfMenu.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('ConditionalFormatting'));
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, this.cfDdb]);
            },
            open: (): void => focus(ul),
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.e-cf-menu')) {
                    args.cancel = true;
                } else {
                    cfMenu.destroy();
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                }
            }
        });
        this.cfDdb.createElement = this.parent.createElement;
        this.cfDdb.appendTo(this.parent.createElement('button', { id: id + '_conditionalformatting', attrs: { 'type': 'button' } }));
        return this.cfDdb.element;
    }

    private createCFMenu(ul: HTMLElement): Menu {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const addIcons: Function = (icons: string[], category: string, appendTo: Element): void => {
            let content: string;
            icons.forEach((icon: string): void => {
                content = l10n.getConstant(icon + category);
                appendTo.appendChild(
                    this.parent.createElement('span', { id: icon + category, className: `e-${icon.toLowerCase()} e-cf-icon`,
                        attrs: { 'title': content, 'aria-label': content, tabindex: '-1' } }));
            });
        };
        const cfMenu: Menu = new Menu({
            cssClass: 'e-cf-menu',
            items: [{
                iconCss: 'e-icons e-hlcellrules', text: l10n.getConstant('HighlightCellsRules'),
                items: [{ iconCss: 'e-icons e-greaterthan', id: 'cf_greaterthan_dlg', text: l10n.getConstant('GreaterThan') + '...' },
                    { iconCss: 'e-icons e-lessthan', id: 'cf_lessthan_dlg', text: l10n.getConstant('LessThan') + '...' },
                    { iconCss: 'e-icons e-between', id: 'cf_between_dlg', text: l10n.getConstant('Between') + '...' },
                    { iconCss: 'e-icons e-equalto', id: 'cf_eqaulto_dlg', text: l10n.getConstant('CFEqualTo') + '...' },
                    { iconCss: 'e-icons e-textcontains', id: 'cf_textcontains_dlg', text: l10n.getConstant('TextThatContains') + '...' },
                    { iconCss: 'e-icons e-adateoccuring', id: 'cf_adateoccuring_dlg', text: l10n.getConstant('ADateOccuring') + '...' },
                    { iconCss: 'e-icons e-duplicate', id: 'cf_duplicatevalues_dlg', text: l10n.getConstant('DuplicateValues') + '...' }]
            },
            {
                iconCss: 'e-icons e-topbottomrules', text: l10n.getConstant('TopBottomRules'),
                items: [{ iconCss: 'e-icons e-top10items', id: 'cf_top10items_dlg', text: l10n.getConstant('Top10Items') + '...' },
                    { iconCss: 'e-icons e-top10', id: 'cf_top10_dlg', text: l10n.getConstant('Top10') + ' %...' },
                    { iconCss: 'e-icons e-bottom10items', id: 'cf_bottom10items_dlg', text: l10n.getConstant('Bottom10Items') + '...' },
                    { iconCss: 'e-icons e-bottom10', id: 'cf_bottom10_dlg', text: l10n.getConstant('Bottom10') + ' %...' },
                    { iconCss: 'e-icons e-aboveaverage', id: 'cf_aboveaverage_dlg', text: l10n.getConstant('AboveAverage') + '...' },
                    { iconCss: 'e-icons e-belowaverage', id: 'cf_belowaverage_dlg', text: l10n.getConstant('BelowAverage') + '...' }]
            },
            { iconCss: 'e-icons e-databars', text: l10n.getConstant('DataBars'), items: [{ id: 'db_icons1' }, { id: 'db_icons2' }] },
            { iconCss: 'e-icons e-colorscales', text: l10n.getConstant('ColorScales'), items: [{ id: 'cs_icons1' }, { id: 'cs_icons2' },
                { id: 'cs_icons3' }] },
            { iconCss: 'e-icons e-iconsets', text: l10n.getConstant('IconSets'), items: [{ id: 'is_icons' }] },
            {
                iconCss: 'e-icons e-clearrules', text: l10n.getConstant('ClearRules'),
                items: [{ id: 'cf_cr_cells', text: l10n.getConstant('SelectedCells') },
                    { id: 'cf_cr_sheet', text: l10n.getConstant('EntireSheet') }]
            }],
            orientation: 'Vertical',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.iconCss === 'e-icons e-databars') {
                    args.element.parentElement.classList.add('e-databars');
                    addIcons(['Blue', 'Green', 'Red'], 'DataBar', args.element.firstChild);
                    addIcons(['Orange', 'LightBlue', 'Purple'], 'DataBar', args.element.lastChild);
                    EventHandler.add(args.element, 'keydown', this.menuIconKeyDown.bind(this, 'e-cf-icon', 3));
                } else if (args.parentItem.iconCss === 'e-icons e-colorscales') {
                    args.element.parentElement.classList.add('e-colorscales');
                    addIcons(['GYR', 'RYG', 'GWR', 'RWG'], 'ColorScale', args.element.firstChild);
                    addIcons(['BWR', 'RWB', 'WR', 'RW'], 'ColorScale', args.element.querySelector('#cs_icons2'));
                    addIcons(['GW', 'WG', 'GY', 'YG'], 'ColorScale', args.element.lastChild);
                    EventHandler.add(args.element, 'keydown', this.menuIconKeyDown.bind(this, 'e-cf-icon', 4));
                } else if (args.parentItem.iconCss === 'e-icons e-iconsets') {
                    args.element.parentElement.classList.add('e-iconsets');
                    args.element.firstChild.appendChild(iconSetGroup);
                    EventHandler.add(args.element, 'keydown', this.menuIconKeyDown.bind(this, 'e-is-wrapper', 0));
                }
            },
            select: this.cfSelected.bind(this),
            beforeItemRender: (args: MenuEventArgs): void => {
                if (args.item.id.includes('db_icons') || args.item.id.includes('cs_icons') || args.item.id === 'is_icons') {
                    args.element.removeAttribute('tabindex');
                }
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                const cfIcons: boolean = ['e-icons e-databars', 'e-icons e-colorscales', 'e-icons e-iconsets'].indexOf(
                    args.parentItem.iconCss) > -1;
                args.cancel = args.event && (args.event as KeyboardEvent).keyCode === 37 && cfIcons;
                if (cfIcons && !args.cancel) {
                    EventHandler.remove(args.element, 'keydown', this.menuIconKeyDown);
                }
            }
        });
        cfMenu.createElement = this.parent.createElement;
        const iconSetGroup: HTMLElement = this.parent.createElement('div', { id: 'is', className: 'e-is' });
        const iconSets: { hdr?: string, cont?: { key: string, cls: string, count: number, id?: string }[] }[] =  [{ hdr: 'Directional' },
            { cont: [{ cls: '3arrows', key: 'ThreeArrowsColor', id: 'ThreeArrows', count: 3 }, { cls: '3arrowsgray', key: 'ThreeArrowsGray',
                count: 3 }, { cls: '3triangles', key: 'ThreeTriangles', count: 3 }, { cls: '4arrowsgray', key: 'FourArrowsGray', count: 4 },
            { cls: '4arrows', key: 'FourArrowsColor', id: 'FourArrows', count: 4 }, { cls: '5arrowsgray', key: 'FiveArrowsGray',
                count: 5 }, { cls: '5arrows', key: 'FiveArrowsColor', id: 'FiveArrows', count: 5 }] }, { hdr: 'Shapes' },
            { cont: [{ cls: '3trafficlights', key: 'ThreeTrafficLights1', count: 3 }, { cls: '3rafficlights2', key: 'ThreeTrafficLights2',
                count: 3 }, { cls: '3signs', key: 'ThreeSigns', count: 3 }, { cls: '4trafficlights', key: 'FourTrafficLights',
                count: 4 }, { cls: '4redtoblack', key: 'RedToBlack', id: 'FourRedToBlack', count: 4 }] }, { hdr: 'Indicators' },
            { cont: [{ cls: '3symbols', key: 'ThreeSymbols1', id: 'ThreeSymbols', count: 3 }, { cls: '3symbols2', key: 'ThreeSymbols2',
                count: 3 }, { cls: '3flags', key: 'ThreeFlags', count: 3 }] }, { hdr: 'Ratings' }, { cont: [{ cls: '3stars',
                key: 'ThreeStars', count: 3 }, { cls: '4rating', key: 'FourRatings', id: 'FourRating', count: 4 },
            { cls: '5quarters', key: 'FiveQuarters', count: 5 }, { cls: '5rating', key: 'FiveRatings', id: 'FiveRating', count: 5 },
            { cls: '5boxes', key: 'FiveBoxes', count: 5 }] } ];
        let iconSetEle: HTMLElement; let iconWrap: HTMLElement; let cultureText: string; let countIdx: number;
        iconSets.forEach((iconSet: { hdr?: string, cont?: { key: string, cls: string, count: number }[] }, index: number): void => {
            iconSetEle = this.parent.createElement('div', { id: `is${index + 1}`, className: `e-is${index + 1}` });
            if (iconSet.hdr) {
                iconSetEle.innerText = l10n.getConstant(iconSet.hdr);
            } else {
                iconSet.cont.forEach((icon: { key: string, cls: string, count: number, id?: string }): void => {
                    cultureText = l10n.getConstant(icon.key);
                    iconWrap = this.parent.createElement(
                        'div', { id: icon.id || icon.key, className: `e-${icon.cls} e-is-wrapper`,
                        attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' } });
                    for (countIdx = 0; countIdx < icon.count; countIdx++) {
                        iconWrap.appendChild(this.createElement('span', `e-${icon.cls}-${countIdx + 1} e-iconsetspan`));
                    }
                    iconSetEle.appendChild(iconWrap);
                });
            }
            iconSetGroup.appendChild(iconSetEle);
        });
        cfMenu.createElement = this.parent.createElement;
        cfMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return cfMenu;
    }

    private menuIconKeyDown(iconCls: string, rowWiseCount?: number, e?: KeyboardEvent): void {
        let index: number; let icons: HTMLElement[] = [];
        if (!e) {
            index = 0;
            icons = [].slice.call(document.querySelectorAll(`.${iconCls}`));
        } else if (e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 37) {
            e.preventDefault();
            icons = [].slice.call(document.querySelectorAll(`.${iconCls}`));
            index = icons.indexOf(e.target as HTMLElement);
            if (index === -1) {
                index = 0;
            } else if (e.keyCode === 39) {
                index++;
                if (index === icons.length) {
                    index = 0;
                }
            } else if (e.keyCode === 37) {
                index--;
                if (index === -1) {
                    index = icons.length - 1;
                }
            } else if (!iconCls.includes('e-menu-icon')) {
                let totalIcons: number = icons.length; let firstIndexes: number[]; let secIndexes: number[];
                if (!rowWiseCount) {
                    rowWiseCount = 2;
                    if (e.keyCode === 40) {
                        firstIndexes = [6, 11, 14, 19]; secIndexes = [5, 10, 13];
                    } else {
                        firstIndexes = [7, 12, 15]; secIndexes = [8, 13, 16];
                    }
                    totalIcons--;
                }
                if (e.keyCode === 40) {
                    if (index === totalIcons - 1) {
                        index = 0;
                    } else {
                        index += firstIndexes && firstIndexes.indexOf(index) > -1 ? 1 :
                            (secIndexes && secIndexes.indexOf(index) > -1 ? 3 : rowWiseCount);
                        if (firstIndexes) {
                            totalIcons++;
                        }
                        if (index >= totalIcons) {
                            index = (index - totalIcons) + 1;
                        }
                    }
                } else {
                    if (index === 0) {
                        index = totalIcons - 1;
                    } else {
                        index -= firstIndexes && firstIndexes.indexOf(index) > -1 ? 1 :
                            (secIndexes && secIndexes.indexOf(index) > -1 ? 3 : rowWiseCount);
                        if (index < 0) {
                            index = firstIndexes ? totalIcons : (totalIcons + index) - 1;
                        }
                    }
                }
            }
        }
        if (icons[index as number]) {
            focus(icons[index as number]);
        }
    }

    private createElement(tag: string, className: string ): HTMLElement {
        return this.parent.createElement(tag, { className: className });
    }

    private getBordersDBB(id: string): Element {
        const ul: HTMLElement = this.parent.createElement('ul', { id: id + '_borders_menu' });
        this.cPickerEle = this.parent.createElement('input', { id: `${id}_cell_border_color`, attrs: { 'type': 'color' } });
        this.parent.element.appendChild(this.cPickerEle);
        this.colorPicker = new ColorPicker({
            cssClass: 'e-border-colorpicker',
            mode: 'Palette',
            inline: true,
            beforeTileRender: (args: PaletteTileEventArgs): void => {
                args.element.tabIndex = -1;
            },
            change: (args: ColorPickerEventArgs): void => {
                const border: string[] = this.border.split(' '); border[2] = args.currentValue.hex;
                this.border = border.join(' ');
            }
        });
        this.colorPicker.createElement = this.parent.createElement;
        this.colorPicker.appendTo(this.cPickerEle);
        let bordersMenu: Menu;
        this.bordersDdb = new DropDownButton({
            iconCss: 'e-icons e-bottom-borders',
            cssClass: 'e-borders-ddb',
            target: ul,
            createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                bordersMenu = this.createBorderMenu(ul);
                this.tBarDdbBeforeOpen(
                    args.element, bordersMenu.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Borders'), 1);
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, this.bordersDdb]);
            },
            open: (): void => focus(ul),
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.e-borders-menu')) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                    bordersMenu.destroy();
                }
            },
            close: (): void => focus(this.bordersDdb.element)
        });
        this.bordersDdb.createElement = this.parent.createElement;
        this.bordersDdb.appendTo(this.parent.createElement('button', { id: id + '_borders', attrs: { 'type': 'button' } }));
        return this.bordersDdb.element;
    }

    private createBorderMenu(ul: HTMLElement): Menu {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const id: string = this.parent.element.id;
        const bordersMenu: Menu = new Menu({
            cssClass: 'e-borders-menu',
            items: [{ iconCss: 'e-icons e-top-borders', text: l10n.getConstant('TopBorders'), id:`${id}_border_topborders` }, {
                iconCss: 'e-icons e-left-borders',
                text: l10n.getConstant('LeftBorders'), id:`${id}_border_leftborders`
            }, { iconCss: 'e-icons e-right-borders', text: l10n.getConstant('RightBorders'), id:`${id}_border_rightborders` }, {
                iconCss: 'e-icons e-bottom-borders', text: l10n.getConstant('BottomBorders'), id:`${id}_border_bottomborders`
            }, {
                iconCss: 'e-icons e-all-borders', text:
                    l10n.getConstant('AllBorders'), id:`${id}_border_allborders`
            }, { iconCss: 'e-icons e-horizontal-borders', text: l10n.getConstant('HorizontalBorders'), id:`${id}_border_horizontalborders` }, {
                iconCss: 'e-icons e-vertical-borders', text: l10n.getConstant('VerticalBorders'), id:`${id}_border_verticalborders`
            }, {
                iconCss: 'e-icons e-outside-borders',
                text: l10n.getConstant('OutsideBorders'), id:`${id}_border_outsideborders`
            }, { iconCss: 'e-icons e-inside-borders', text: l10n.getConstant('InsideBorders'), id:`${id}_border_insideborders` },
            { iconCss: 'e-icons e-no-borders', text: l10n.getConstant('NoBorders'), id:`${id}_border_noborders` }, { separator: true }, {
                text:
                    l10n.getConstant('BorderColor'), items: [{ id: `${id}_border_colors` }], id:`${id}_border_bordercolor`
            }, {
                text: l10n.getConstant('BorderStyle'), items: [
                    { iconCss: 'e-icons e-selected-icon', id: `${id}_1px` }, { id: `${id}_2px` },
                    { id: `${id}_3px` }, { id: `${id}_dashed` },
                    { id: `${id}_dotted` }, { id: `${id}_double` }]
            }],
            orientation: 'Vertical',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.id === `${id}_border_bordercolor`) {
                    this.colorPicker.refresh();
                    const cPickerWrapper: HTMLElement = this.colorPicker.element.parentElement;
                    args.element.firstElementChild.appendChild(cPickerWrapper);
                    cPickerWrapper.style.display = 'inline-block';
                    args.element.parentElement.classList.add('e-border-color');
                    args.element.firstElementChild.removeAttribute('tabindex');
                } else {
                    args.element.classList.add('e-border-style');
                }
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && args.parentItem.id === `${id}_border_bordercolor`) {
                    if (!closest(args.event.target as Element, '.e-border-colorpicker') ||
                        closest(args.event.target as Element, '.e-apply') || closest(args.event.target as Element, '.e-cancel')) {
                        this.colorPicker = <ColorPicker>getComponent(this.cPickerEle, 'colorpicker');
                        if (this.colorPicker.mode === 'Picker') { this.colorPicker.mode = 'Palette'; this.colorPicker.dataBind(); }
                        const cPickerWrapper: HTMLElement = this.colorPicker.element.parentElement;
                        cPickerWrapper.style.display = '';
                        this.parent.element.appendChild(cPickerWrapper);
                    } else {
                        args.cancel = true;
                    }
                }
            },
            onOpen: (args: OpenCloseMenuEventArgs): void => {
                if (args.parentItem.id === `${id}_border_bordercolor`) {
                    args.element.parentElement.style.overflow = 'visible';
                    const colorPalatte: HTMLElement = args.element.querySelector('.e-color-palette .e-palette');
                    if (colorPalatte) {
                        focus(colorPalatte);
                    }
                }
            },
            onClose: (): void => focus(bordersMenu.element),
            select: (args: MenuEventArgs): void => {
                this.borderSelected(args, bordersMenu);
            },
        });
        bordersMenu.createElement = this.parent.createElement;
        bordersMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return bordersMenu;
    }

    private chartSelected(args: MenuEventArgs, chartDdb: DropDownButton): void {
        const isChart: boolean = !isNullOrUndefined(closest(args.element, '.e-chart-menu'));
        const eleId: string = args.element.id;
        if (('column_chart' + 'bar_chart' + 'area_chart' + 'pie_doughnut_chart' +
            'line_chart' + 'radar_chart' + 'scatter_chart').includes(eleId)) {
            if (args.item && (!args.item.items || !args.item.items.length)) { chartDdb.toggle(); }
            const id: string = (args.event.target as HTMLElement).id;
            this.parent.notify(insertChart, { action: eleId, id: id, isChart: isChart });
        }
    }

    private addChartEleSelected(args: MenuEventArgs): void {
        const eleId: string = args.element.id;
        this.parent.notify(chartDesignTab, { addChartEle: eleId, triggerEvent: true });
        if (args.item && (!args.item.items || !args.item.items.length)) { this.addChartDdb.toggle(); }
    }

    private cfSelected(args: MenuEventArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args.item.id.includes('_dlg')) {
            this.parent.notify(renderCFDlg, { action: args.item.text });
        } else if (args.item.id.includes('icons')) {
            const trgt: Element = args.event.target as Element;
            this.parent.notify(
                setCFRule, <CFArgs>{ cfModel: { type: trgt.id || trgt.parentElement.id, range: sheet.selectedRange }, isAction: true });
        } else if (args.item.id === 'cf_cr_cells') {
            this.parent.notify(clearCFRule, <CFArgs>{ range: sheet.selectedRange, isAction: true });
        } else if (args.item.id === 'cf_cr_sheet') {
            this.parent.conditionalFormat = null;
            this.parent.notify(clearCFRule, <CFArgs>{ isAction: true });
        }
        if (args.item && (!args.item.items || !args.item.items.length)) {
            this.cfDdb.toggle();
        }
    }

    private borderSelected(args: MenuEventArgs, bordersMenu: Menu): void {
        this.bordersDdb.element.setAttribute('aria-label', args.item.text);
        const id: string = this.parent.element.id;
        if (args.item.items.length || args.item.id === `${id}_border_colors`) { return; }
        if (!args.item.text) {
            const border: string[] = this.border.split(' ');
            const prevStyleId: string = border[1] === 'solid' ? `${id}_${border[0]}` : `${id}_${border[1]}`;
            if (prevStyleId === args.item.id) { return; }
            if (args.item.id === `${id}_1px` || args.item.id === `${id}_2px` || args.item.id === `${id}_3px`) {
                border[0] = args.item.id.split(`${id}_`)[1]; border[1] = 'solid';
            } else {
                border[1] = args.item.id.split(`${id}_`)[1];
                border[0] = border[1] === 'double' ? '3px' : '1px';
            }
            this.border = border.join(' ');
            (bordersMenu.items[12].items as MenuItemModel[]).forEach((item: MenuItemModel): void => {
                if (item.id === prevStyleId) { item.iconCss = null; }
                if (item.id === args.item.id) { item.iconCss = 'e-icons e-selected-icon'; }
            });
            bordersMenu.setProperties({ 'items': bordersMenu.items }, true);
            return;
        }
        this.bordersDdb.toggle();
        this.parent.showSpinner();
        switch (args.item.id) {
        case `${id}_border_topborders`:
            this.parent.notify(setCellFormat, { style: { borderTop: this.border }, onActionUpdate: true });
            break;
        case `${id}_border_leftborders`:
            this.parent.notify(setCellFormat, { style: { borderLeft: this.border }, onActionUpdate: true });
            break;
        case `${id}_border_rightborders`:
            this.parent.notify(setCellFormat, { style: { borderRight: this.border }, onActionUpdate: true });
            break;
        case `${id}_border_bottomborders`:
            this.parent.notify(setCellFormat, { style: { borderBottom: this.border }, onActionUpdate: true });
            break;
        case `${id}_border_allborders`:
            this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true });
            break;
        case `${id}_border_horizontalborders`:
            this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Horizontal' });
            break;
        case `${id}_border_verticalborders`:
            this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Vertical' });
            break;
        case `${id}_border_outsideborders`:
            this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Outer' });
            break;
        case `${id}_border_insideborders`:
            this.parent.notify(setCellFormat, { style: { border: this.border }, onActionUpdate: true, borderType: 'Inner' });
            break;
        case `${id}_border_noborders`:
            this.parent.notify(setCellFormat, { style: { border: '' }, onActionUpdate: true });
            break;
        }
        this.parent.hideSpinner();
    }

    private getFontNameDDB(id: string): Element {
        const fontNameBtn: HTMLElement = this.parent.createElement(
            'button', { id: id + '_font_name', attrs: { 'type': 'button' }, className: 'e-ss-ddb' });
        const fontBtnText: HTMLElement = this.parent.createElement('span', { className: 'e-tbar-btn-text' });
        fontBtnText.innerText = 'Calibri';
        fontNameBtn.appendChild(fontBtnText);
        this.fontNameDdb = new DropDownButton({
            cssClass: 'e-font-family',
            items: this.getFontFamilyItems(),
            createPopupOnClick: true,
            select: (args: MenuEventArgs): void => {
                const eventArgs: SetCellFormatArgs = { style: { fontFamily: args.item.text as FontFamily }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                fontNameBtn.setAttribute('aria-label', args.item.text);
                if (!eventArgs.cancel) { this.refreshFontNameSelection(eventArgs.style.fontFamily); }
            },
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void =>{
                this.tBarDdbBeforeOpen(
                    args.element, args.items, (this.parent.serviceLocator.getService(locale) as L10n).getConstant(('Font')));
            }
        });
        this.fontNameDdb.createElement = this.parent.createElement;
        this.fontNameDdb.appendTo(fontNameBtn);
        return fontNameBtn;
    }

    private getBtn(id: string, name: string, text: string, bindEvent: boolean = true): Element {
        const btnObj: Button = new Button({ iconCss: `e-icons e-${name}-icon`,cssClass:'e-flat',isToggle: true });
        btnObj.createElement = this.parent.createElement;
        btnObj.appendTo(this.parent.createElement('button', { id: `${id}_${name}`, attrs: { 'aria-label': text, 'type': 'button' } }));
        if (bindEvent) {
            btnObj.element.addEventListener('click', this.toggleBtnClicked.bind(this));
        }
        return btnObj.element;
    }
    private datavalidationDDB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let direction: SortOrder;
        this.datavalidationDdb = new DropDownButton({
            cssClass: 'e-datavalidation-ddb',
            iconCss: 'e-datavalidation-icon e-icons',
            content: l10n.getConstant('DataValidation'),
            items: [
                { text: l10n.getConstant('DataValidation') },
                { text: l10n.getConstant('HighlightInvalidData') },
                { text: l10n.getConstant('ClearHighlight') },
                { text: l10n.getConstant('ClearValidation') }],
            createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.datavalidationDdb, args.element, 'iconCss');
                args.element.setAttribute('aria-label', l10n.getConstant('DataValidation'));
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
                    this.parent.notify(removeDataValidation, { isAction: true });
                    break;
                default:
                    direction = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                    this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: direction } } });
                    break;
                }
                this.datavalidationDdb.element.setAttribute('aria-label', args.item.text);
            },
        });
        this.datavalidationDdb.createElement = this.parent.createElement;
        this.datavalidationDdb.appendTo(
            this.parent.createElement('button', { id: id + '_datavalidation', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.datavalidationDdb.element;
    }

    private getTextAlignDDB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.textAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-left-icon',
            items: [{ iconCss: 'e-icons e-left-icon' }, { iconCss: 'e-icons e-center-icon' }, { iconCss: 'e-icons e-right-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.textAlignDdb, args.element, 'iconCss');
                args.element.setAttribute('aria-label', l10n.getConstant('HorizontalAlignment'));
            },
            select: (args: MenuEventArgs): void => {
                const eventArgs: SetCellFormatArgs = {
                    style: { textAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as TextAlign }, onActionUpdate: true
                };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) {
                    this.textAlignDdb.iconCss = `e-icons e-${eventArgs.style.textAlign}-icon`; this.textAlignDdb.dataBind();
                }
                this.textAlignDdb.element.setAttribute(
                    'aria-label', (l10n.getConstant('HorizontalAlignment') + ' ' + l10n.getConstant('Align' + this.getAlignText(args))));
            }
        });
        this.textAlignDdb.createElement = this.parent.createElement;
        this.textAlignDdb.appendTo(
            this.parent.createElement('button', { id: id + '_text_align', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.textAlignDdb.element;
    }

    private getVerticalAlignDDB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.verticalAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-bottom-icon',
            items: [{ iconCss: 'e-icons e-top-icon' }, { iconCss: 'e-icons e-middle-icon' }, { iconCss: 'e-icons e-bottom-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                this.refreshSelected(this.verticalAlignDdb, args.element, 'iconCss');
                args.element.setAttribute('aria-label', l10n.getConstant('VerticalAlignment'));
            },
            select: (args: MenuEventArgs): void => {
                const eventArgs: SetCellFormatArgs = {
                    style: { verticalAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] as VerticalAlign }, onActionUpdate: true
                };
                this.parent.notify(setCellFormat, eventArgs);
                if (!eventArgs.cancel) {
                    this.verticalAlignDdb.iconCss = `e-icons e-${eventArgs.style.verticalAlign}-icon`; this.verticalAlignDdb.dataBind();
                }
                this.verticalAlignDdb.element.setAttribute(
                    'aria-label', (l10n.getConstant('VerticalAlignment') + ' ' + l10n.getConstant('Align' + this.getAlignText(args))));
            }
        });
        this.verticalAlignDdb.createElement = this.parent.createElement;
        this.verticalAlignDdb.appendTo(
            this.parent.createElement('button', { id: id + '_vertical_align', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.verticalAlignDdb.element;
    }

    private getMergeSplitBtn(id: string): Element {
        this.parent.element.appendChild(this.parent.createElement('button', { id: id + '_merge', attrs: { 'type': 'button' } }));
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.mergeSplitBtn = new SplitButton({
            cssClass: 'e-merge-ddb',
            iconCss: 'e-icons e-merge-icon',
            createPopupOnClick: true,
            items: [{ text: l10n.getConstant('MergeAll'), id: `${id}_merge_all` }, { text: l10n.getConstant('MergeHorizontally'), id:
                `${id}_merge_horizontally` }, { text: l10n.getConstant('MergeVertically'), id: `${id}_merge_vertically` },
            { separator: true, id: `${id}_merge_separator` }, { text: l10n.getConstant('Unmerge'), id: `${id}_unmerge` }],
            select: this.mergeSelectHandler.bind(this),
            click: (args: BtnClickEventArgs): void => {
                args.element.setAttribute('aria-label', l10n.getConstant('MergeCells'));
                if (args.element.classList.contains('e-active')) {
                    this.unMerge();
                } else {
                    this.merge(`${this.parent.element.id}_merge_all`);
                }
            },
            created: (): void => {
                this.mergeSplitBtn.element.title = l10n.getConstant('MergeCells');
                (this.mergeSplitBtn.element.nextElementSibling as HTMLButtonElement).title = l10n.getConstant('SelectMergeType');
            },
            beforeOpen: (args: MenuEventArgs) => args.element.setAttribute('aria-label', l10n.getConstant('MergeCells'))
        });
        this.mergeSplitBtn.createElement = this.parent.createElement;
        this.mergeSplitBtn.appendTo('#' + id + '_merge');
        return this.mergeSplitBtn.element.parentElement;
    }

    private mergeSelectHandler(args: MenuEventArgs): void {
        if (args.item.id === `${this.parent.element.id}_unmerge`) {
            this.unMerge();
        } else {
            this.merge(args.item.id);
        }
        this.mergeSplitBtn.element.setAttribute('aria-label', args.item.text);
    }

    private unMerge(args?: { range: string }): void {
        this.parent.showSpinner();
        const selectedRange: string = this.parent.getActiveSheet().selectedRange;
        this.parent.notify(setMerge, <MergeArgs>{ merge: false, range: args ? (args.range || selectedRange) : selectedRange,
            isAction: true, refreshRibbon: true, type: 'All' });
        this.toggleActiveState(false);
        this.parent.hideSpinner();
    }

    private merge(itemId: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const indexes: number[] = getRangeIndexes(sheet.selectedRange); let cell: CellModel;
        let isDataPresent: boolean;
        const isMergeAll: boolean = itemId.includes('merge_all');
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                if (i === indexes[0] && j === indexes[1] && isMergeAll) { continue; }
                if (i === indexes[0] && itemId.includes('merge_vertically')) { continue; }
                if (j === indexes[1] && itemId.includes('_merge_horizontally')) { continue; }
                cell = getCell(i, j, sheet) || {};
                if (cell.value || cell.formula) { isDataPresent = true; }
            }
        }
        if (!isDataPresent) {
            this.performMerge(itemId);
            if (isMergeAll) {
                this.toggleActiveState(true);
            }
            return;
        }
        const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
        dialogInst.show({
            height: 200, width: 400, isModal: true, showCloseIcon: true, cssClass: 'e-merge-alert-dlg',
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('MergeCellsAlert'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'MergeAlertDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                } else {
                    focus(this.parent.element);
                }
            },
            buttons: [{
                buttonModel: { content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true },
                click: (): void => {
                    dialogInst.hide();
                    this.performMerge(itemId);
                    if (isMergeAll) {
                        this.toggleActiveState(true);
                    }
                }
            }]
        });
    }

    private performMerge(itemId: string): void {
        const id: string = this.parent.element.id;
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
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let direction: SortOrder;
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
            createPopupOnClick: true,
            beforeItemRender: (args: MenuEventArgs): void => {
                const eventArgs: { [key: string]: boolean } = { isFiltered: false, isClearAll: true };
                this.parent.notify(getFilteredColumn, eventArgs);
                if (!this.parent.allowSorting && (args.item.text === l10n.getConstant('SortAscending') ||
                    args.item.text===l10n.getConstant('SortDescending') || args.item.text ===(l10n.getConstant('CustomSort') + '...'))) {
                    args.element.classList.add('e-disabled');
                }
                if (!this.parent.allowFiltering && args.item.text === (l10n.getConstant('Filter'))) {
                    args.element.classList.add('e-disabled');
                }
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
                args.element.setAttribute(
                    'aria-label', (this.parent.serviceLocator.getService(locale) as L10n).getConstant('SortAndFilter'));
            },
            select: (args: MenuEventArgs): void => {
                switch (args.item.text) {
                case l10n.getConstant('Filter'):
                    this.parent.notify(initiateFilterUI, {});
                    break;
                case l10n.getConstant('ClearAllFilter'):
                    this.parent.notify(clearFilter, { isAction: true });
                    break;
                case l10n.getConstant('ReapplyFilter'):
                    this.parent.notify(reapplyFilter, null);
                    break;
                case l10n.getConstant('CustomSort') + '...':
                    this.parent.notify(initiateCustomSort, null);
                    break;
                default:
                    direction = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                    this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: direction } } });
                    break;
                }
                this.sortingDdb.element.setAttribute('aria-label', args.item.text);
            },
        });
        this.sortingDdb.createElement = this.parent.createElement;
        this.sortingDdb.appendTo(
            this.parent.createElement('button', { id: id + '_sorting', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.sortingDdb.element;
    }

    private getFindBtn(id: string): HTMLElement {
        const findToolbtn: HTMLElement = this.parent.createElement(
            'button', { id: id + '_findbtn', attrs:
            { 'type': 'button', 'aria-label':
            (this.parent.serviceLocator.getService(locale) as L10n).getConstant('FindReplaceTooltip') } }) as HTMLElement;
        this.findDdb = new Button({ cssClass: 'e-spreadsheet-find-ddb e-flat', iconCss: 'e-icons e-search-icon' });
        this.findDdb.createElement = this.parent.createElement;
        this.findDdb.appendTo(findToolbtn);
        findToolbtn.onclick = (e: MouseEvent): void => {
            this.parent.notify(findToolDlg, { event: e });
        };
        return this.findDdb.element;
    }
    private getClearDDB(id: string): Element {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.clearDdb = new DropDownButton({
            cssClass: 'e-clear-ddb',
            iconCss: 'e-icons e-clear-icon',
            items: [
                { text: l10n.getConstant('ClearAll'), id: id + '_Clear All' },
                { text: l10n.getConstant('ClearFormats'), id: id + '_Clear Formats' },
                { text: l10n.getConstant('ClearContents'), id: id + '_Clear Contents' },
                { text: l10n.getConstant('ClearHyperlinks'), id: id + '_Clear Hyperlinks' }],
            createPopupOnClick: true,
            beforeOpen: (args: MenuEventArgs): void => {
                args.element.setAttribute('aria-label', (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Clear'));
            },
            select: (args: MenuEventArgs): void => {
                this.parent.notify(clearViewer, { options: { type: args.item.id.replace(id + '_', '') }, isAction: true });
                this.clearDdb.element.setAttribute('aria-label', args.item.text);
            },
        });
        this.clearDdb.createElement = this.parent.createElement;
        this.clearDdb.appendTo(
            this.parent.createElement('button', { id: id + '_clear', attrs: { 'type': 'button' }, className: 'e-ss-ddb' }));
        return this.clearDdb.element;
    }

    private ribbonCreated(): void {
        const text: string = this.parent.serviceLocator.getService<L10n>(locale).getConstant('CollapseToolbar');
        attributes(
            this.ribbon.element.querySelector('.e-drop-icon'), { 'role': 'button', 'tabindex': '-1', 'title': text, 'aria-label': text });
        if (this.ribbon.toolbarObj) {
            this.ribbon.toolbarObj.allowKeyboard = this.parent.enableKeyboardNavigation;
            this.ribbon.toolbarObj.dataBind();
        }
    }

    private alignItemRender(args: MenuEventArgs): void {
        args.element.title = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Align' + this.getAlignText(args));
    }
    private getAlignText(args: MenuEventArgs): string {
        const text: string = args.item.iconCss.split(' e-')[1].split('-icon')[0];
        return text[0].toUpperCase() + text.slice(1, text.length);
    }
    private toggleBtnClicked(e: MouseEvent | KeyboardEvent): void {
        const target: Element = closest(e.target as Element, '.e-btn');
        const parentId: string = this.parent.element.id; const id: string = target.id;
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
            value = activeModel[`${key}`];
            eventArgs = { style: activeModel, onActionUpdate: true };
            this.parent.notify(property, eventArgs);
            if (eventArgs.cancel) { target.classList.remove('e-active'); }
        } else {
            value = defaultModel[`${key}`];
            eventArgs = { style: defaultModel, onActionUpdate: true };
            this.parent.notify(property, eventArgs);
            if (eventArgs.cancel) { target.classList.add('e-active'); }
        }
        if (!eventArgs.cancel && value !== eventArgs.style[`${key}`]) {
            this.refreshToggleBtn(getCellIndexes(this.parent.getActiveSheet().activeCell));
        }
    }

    private getCellStyleValue(cssProp: string, indexes: number[]): string {
        const cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
        let value: string = this.parent.cellStyle[`${cssProp}`];
        if (cell && cell.style && cell.style[`${cssProp}`]) {
            value = cell.style[`${cssProp}`];
        }
        return value;
    }
    private refreshSelected(inst: DropDownButton, element: HTMLElement, key: string, itemKey: string = key): void {
        for (let i: number = 0; i < inst.items.length; i++) {
            if (inst.items[i as number][`${itemKey}`] === inst[`${key}`]) {
                element.children[i as number].classList.add('e-selected'); break;
            }
        }
    }
    private expandCollapseHandler(args: ExpandCollapseEventArgs): void {
        const target: HTMLElement = this.ribbon.element.querySelector('.e-drop-icon') as HTMLElement;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (args.expanded) {
            target.title = l10n.getConstant('CollapseToolbar');
            target.setAttribute('aria-label', l10n.getConstant('ExpandToolbar'));
        } else {
            target.title = l10n.getConstant('ExpandToolbar');
            target.setAttribute('aria-label', l10n.getConstant('CollapseToolbar'));
        }
        this.parent.setPanelSize();
    }

    private getChartThemeDdbItems(theme: string): ItemModel[] {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const items: ItemModel[] = [];
        const themes: string[] = ['Material', 'Fabric', 'Bootstrap', 'HighContrastLight', 'MaterialDark', 'FabricDark', 'HighContrast',
            'BootstrapDark', 'Bootstrap4', 'Bootstrap5Dark', 'Bootstrap5', 'TailwindDark', 'Tailwind', 'FluentDark', 'Fluent', 'Material3','Material3Dark'];
        themes.forEach((id: string): void => {
            items.push({ id: id, text: l10n.getConstant(id), iconCss: id === theme ? 'e-icons e-selected-icon' : '' });
        });
        return items;
    }

    private getNumFormatDdbItems(id: string): ItemModel[] {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        return [
            { id: id + '_General', text: l10n.getConstant('General') },
            { id: id + '_Number', text: l10n.getConstant('Number') },
            { id: id + '_Currency', text: l10n.getConstant('Currency') },
            { id: id + '_Accounting', text: l10n.getConstant('Accounting') },
            { id: id + '_ShortDate', text: l10n.getConstant('ShortDate') },
            { id: id + '_LongDate', text: l10n.getConstant('LongDate') },
            { id: id + '_Time', text: l10n.getConstant('Time') },
            { id: id + '_Percentage', text: l10n.getConstant('Percentage') },
            { id: id + '_Fraction', text: l10n.getConstant('Fraction') },
            { id: id + '_Scientific', text: l10n.getConstant('Scientific') },
            { id: id + '_Text', text: l10n.getConstant('Text') },
            { id: id + '_Custom', text: l10n.getConstant('Custom')}
        ];
    }
    private getFontFamilyItems(): ItemModel[] {
        return [{ text: 'Arial' }, { text: 'Arial Black' }, { text: 'Axettac Demo' }, { text: 'Batang' }, { text: 'Book Antiqua' },
            { text: 'Calibri', iconCss: 'e-icons e-selected-icon' }, { text: 'Comic Sans MS' }, { text: 'Courier' }, { text: 'Courier New' },
            { text: 'Din Condensed' }, { text: 'Georgia' }, { text: 'Helvetica' }, { text: 'Helvetica New' }, { text: 'Roboto' },
            { text: 'Tahoma' }, { text: 'Times New Roman' }, { text: 'Verdana' }];
    }

    private applyNumFormat(format: string, text: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const eventArgs: { format: string, range: string, cancel: boolean, requestType: string } = {
            format: format, range: sheet.selectedRange, cancel: false, requestType: 'NumberFormat'
        };
        const actionArgs: BeforeCellFormatArgs = {
            range: sheet.name + '!' + eventArgs.range, format: eventArgs.format, requestType: 'NumberFormat'
        };
        this.parent.trigger('beforeCellFormat', eventArgs);
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
        if (eventArgs.cancel) {
            return;
        }
        this.parent.notify(applyNumberFormatting, eventArgs);
        this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
        this.refreshNumFormatSelection(text);
        this.parent.notify(completeAction, { eventArgs: actionArgs, action: 'format' });
    }

    private renderCustomFormatDialog(formatData: string[]): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dummyDiv: HTMLElement = this.parent.createElement('div');
        const dialogCont: HTMLElement = this.parent.createElement('div', {className: 'e-custom-dialog'});
        const dialogBtn: HTMLElement = this.parent.createElement('button', { className: 'e-btn', attrs: { 'type': 'button' } });
        dialogBtn.innerText = l10n.getConstant('Apply');
        const sampleDiv: HTMLElement = this.parent.createElement('div', { className: 'e-custom-sample' });
        sampleDiv.innerText = l10n.getConstant('CustomFormatTypeList') + ':';
        const inputElem: HTMLElement = this.parent.createElement('input', {className: 'e-input e-dialog-input', attrs: { 'type': 'text', 'name': 'input', 'placeholder': l10n.getConstant('CustomFormatPlaceholder'), 'spellcheck': 'false' }});
        const listviewCont: HTMLElement = this.parent.createElement('div', {className: 'e-custom-listview'});
        const customFormatDialog: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const listview: ListView = new ListView({
            dataSource: formatData,
            select: (args: SelectEventArgs) => {
                (inputElem as HTMLInputElement).value = args.text;
                if (args.event && args.event.type === 'keydown' && args.item) {
                    (args.item as HTMLElement).focus();
                }
            }
        });
        dialogCont.appendChild(inputElem);
        dialogCont.appendChild(dialogBtn);
        dialogCont.appendChild(sampleDiv);
        dialogCont.appendChild(listviewCont);
        listview.appendTo(listviewCont);
        const addCustomNumFormat: (args: { format: string }) => void = (args: { format: string }): void => {
            if (formatData.indexOf(args.format) === -1) {
                formatData.push(args.format);
            }
        };
        this.parent.on(addFormatToCustomFormatDlg, addCustomNumFormat, this);
        dialogBtn.addEventListener('click', () => {
            const format: string = (inputElem as HTMLInputElement).value;
            this.applyNumFormat(format, l10n.getConstant('Custom'));
            listview.destroy();
            customFormatDialog.hide();
            addCustomNumFormat({ format: format });
        });
        customFormatDialog.show({
            header: l10n.getConstant('CustomFormat'),
            cssClass: 'e-custom-format-dlg',
            height: this.parent.cssClass.indexOf('e-bigger') > -1 ? 502 : 480,
            width: 440,
            isModal: true,
            showCloseIcon: true,
            content: dialogCont,
            footerTemplate: dummyDiv,
            beforeOpen: (): void => focus(this.parent.element)
        });
        const sheet: SheetModel = this.parent.getActiveSheet();
        const actCell: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(actCell[0], actCell[1], sheet);
        if (cell && cell.format) {
            listview.selectItem(cell.format as unknown as Element);
        }
    }

    private tBarDdbBeforeOpen(element: HTMLElement, items: MenuItemModel[], targetLabel?: string, separatorCount: number = 0): void {
        const viewportHeight: number = this.parent.viewport.height;
        let actualHeight: number = (parseInt(getComputedStyle(element.firstElementChild).height, 10) * (items.length - separatorCount)) +
            (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (separatorCount) {
            const separatorStyle: CSSStyleDeclaration = getComputedStyle(element.querySelector('.e-separator'));
            actualHeight += (separatorCount * (parseInt(separatorStyle.borderBottomWidth, 10) + (parseInt(
                separatorStyle.marginTop, 10) * 2)));
        }
        if (actualHeight > viewportHeight) {
            element.style.height = `${viewportHeight}px`; element.style.overflowY = 'auto';
        } else {
            if (element.style.height) { element.style.height = ''; element.style.overflowY = ''; }
        }
        element.setAttribute('aria-label', targetLabel);
    }

    private numDDBOpen(args: OpenCloseMenuEventArgs): void {
        this.numPopupWidth = 0;
        const elemList: NodeListOf<Element> = args.element.querySelectorAll('span.e-numformat-preview-text');
        for (let i: number = 0, len: number = elemList.length; i < len; i++) {
            if (this.numPopupWidth < (elemList[i as number] as HTMLElement).offsetWidth) {
                this.numPopupWidth = (elemList[i as number] as HTMLElement).offsetWidth;
            }
        }
        const popWidth: number = this.numPopupWidth + 160;
        (document.querySelector('.e-numformat-ddb.e-dropdown-popup') as HTMLElement).style.width = `${popWidth}px`;
    }

    private previewNumFormat(args: MenuEventArgs): void {
        if (args.item.id.includes('_Custom')) {
            return;
        }
        const numElem: HTMLElement = this.parent.createElement(
            'div', { className: 'e-numformat-text', styles: 'width:100%', innerHTML: args.element.innerHTML });
        args.element.innerHTML = '';
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cellIndex: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(cellIndex[0], cellIndex[1], sheet, false, true);
        if (!isNullOrUndefined(cell.value) || cell.value !== '') {
            const format: string = getFormatFromType(args.item.id.split(this.parent.element.id + '_')[1] as NumberFormatType);
            const eventArgs: NumberFormatArgs = { type: args.item.text, formattedText: '', value: cell.value, format: format,
                cell: { value: cell.value, format: format }, skipFormatCheck: isImported(this.parent) };
            this.parent.notify(getFormattedCellObject, eventArgs);
            const previewElem: HTMLElement = this.parent.createElement(
                'span', { className: 'e-numformat-preview-text', styles: 'float:right;' });
            previewElem.innerText = eventArgs.formattedText;
            numElem.appendChild(previewElem);
        }
        args.element.appendChild(numElem);
    }

    private refreshRibbonContent(activeTab: number): void {
        if (!this.ribbon) { return; }
        if (isNullOrUndefined(activeTab)) { activeTab = this.ribbon.selectedTab; }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        switch (this.ribbon.items[activeTab as number].header.text) {
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        const actCell: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const cell: CellModel = getCell(actCell[0], actCell[1], this.parent.getActiveSheet()) || {};
        let type: string = getTypeFromFormat(cell.format || 'General', true);
        if (this.numFormatDDB) {
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                type = 'General';
                this.refreshNumFormatSelection(type);
            } else {
                if (cell.format && type === 'General' && cell.format !== 'General') {
                    type = 'Custom';
                }
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
        this.refreshTextAlign(sheet, cell, type, indexes);
        if (this.verticalAlignDdb) {
            const value: string = `e-icons e-${this.getCellStyleValue('verticalAlign', indexes).toLowerCase()}-icon`;
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
            const indexes: number[] = getRangeIndexes(sheet.selectedRange);
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: [`${this.parent.element.id}_merge_cells`],
                enable: indexes[0] !== indexes[2] || indexes[1] !== indexes[3] ? true : false }]);
            this.toggleActiveState(false);
        }
    }

    private refreshTextAlign(sheet: SheetModel, cell: CellModel, type: string, indexes: number[]): void {
        if (this.textAlignDdb) {
            let style: string = this.getCellStyleValue('textAlign', indexes);
            if (sheet.isProtected && !sheet.protectSettings.formatCells) {

                this.textAlignDdb.iconCss = 'e-icons e-left-icon';
            } else {
                if (cell.value !== undefined && style === 'left' && (type === 'Accounting' || (isNumber(cell.value) && type !== 'Text'))) {
                    style = 'right';
                }
                const value: string = `e-icons e-${style.toLowerCase()}-icon`;
                if (value !== this.textAlignDdb.iconCss) {
                    this.textAlignDdb.iconCss = value; this.textAlignDdb.dataBind();
                }
            }
        }
    }

    private toggleActiveState(active: boolean): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        let btn: HTMLElement; const id: string = this.parent.element.id; let value: string;
        let isActive: boolean;
        const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
        const fontProps: string[] = ['fontWeight', 'fontStyle', 'textDecoration', 'textDecoration'];
        ['bold', 'italic', 'line-through', 'underline', 'wrap'].forEach((name: string, index: number): void => {
            btn = document.getElementById(`${id}_${name}`);
            if (btn) {
                if (sheet.isProtected && !sheet.protectSettings.formatCells) {
                    btn.classList.remove('e-active');
                } else if (name === 'wrap') {
                    isActive = cell && cell.wrap;
                } else {
                    value = this.getCellStyleValue(fontProps[index as number], indexes).toLowerCase();
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
        fontFamily = fontFamily.split('"').join('');
        this.fontNameDdb.element.firstElementChild.textContent = fontFamily;
        for (let i: number = 0; i < this.fontNameDdb.items.length; i++) {
            if (this.fontNameDdb.items[i as number].text === fontFamily) {
                this.fontNameDdb.items[i as number].iconCss = 'e-icons e-selected-icon';
                if (i !== this.fontNameIndex) {
                    this.fontNameDdb.items[this.fontNameIndex].iconCss = '';
                }
                this.fontNameDdb.setProperties({ 'items': this.fontNameDdb.items }, true);
                this.fontNameIndex = i;
                break;
            }
        }
        if (['Arial', 'Arial Black', 'Axettac Demo', 'Batang', 'Book Antiqua', 'Calibri', 'Comic Sans MS', 'Courier',
            'Courier New', 'Din Condensed', 'Georgia', 'Helvetica', 'Helvetica New', 'Roboto',
            'Tahoma', 'Times New Roman', 'Verdana'].indexOf(fontFamily) < 0) {
            this.fontNameDdb.items[this.fontNameIndex].iconCss = '';
        }
        this.fontNameDdb.element.setAttribute('aria-label', fontFamily);
    }

    private refreshNumFormatSelection(type: string): void {
        for (let i: number = 0; i < this.numFormatDDB.items.length; i++) {
            if (this.numFormatDDB.items[i as number].iconCss !== '') {
                this.numFormatDDB.items[i as number].iconCss = '';
            }
            if (this.numFormatDDB.items[i as number].text === type) {
                this.numFormatDDB.items[i as number].iconCss = 'e-icons e-selected-icon';
            }
        }
        this.numFormatDDB.element.firstElementChild.textContent = type;
        this.numFormatDDB.setProperties({ 'items': this.numFormatDDB.items }, true);
        this.numFormatDDB.element.setAttribute('aria-label', type);
    }

    private fileMenuItemSelect(args: MenuEventArgs): void {
        const selectArgs: MenuSelectEventArgs = <MenuSelectEventArgs>extend({ cancel: false }, args);
        this.parent.trigger('fileMenuItemSelect', selectArgs); const id: string = this.parent.element.id;
        let dialogInst: Dialog;
        if (!selectArgs.cancel) {
            switch (args.item.id) {
            case `${id}_Open`:
                select('#' + id + '_fileUpload', this.parent.element).click();
                focus(this.parent.element);
                break;
            case `${id}_Xlsx`:
            case `${id}_Xls`:
            case `${id}_Csv`:
            case `${id}_Pdf`:
                this.parent.notify(exportDialog, args);
                break;
            case `${id}_New`:
                dialogInst = (this.parent.serviceLocator.getService(dialog) as Dialog);
                dialogInst.show({
                    height: 200, width: 400, isModal: true, showCloseIcon: true,
                    content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DestroyAlert'),
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'DestroySheetDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        } else {
                            focus(this.parent.element);
                        }
                    },
                    buttons: [{
                        buttonModel: {
                            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true
                        },
                        click: (): void => {
                            dialogInst.hide();
                            this.parent.refresh(true);
                        }
                    }]
                });
                break;
            }
        }
    }

    private toolbarClicked(args: ClickEventArgs): void {
        if (args.item && !(args.item.id === 'spreadsheet_find')) {
            const parentId: string = this.parent.element.id;
            const sheet: SheetModel = this.parent.getActiveSheet();
            let evtHArgs: { isShow: boolean, sheetIdx: number, cancel: boolean };
            let evtglArgs: { isShow: boolean, sheetIdx: number, cancel: boolean };
            let indexes: number[];
            let selectCell: number[];
            switch (args.item.id) {
            case parentId + '_headers':
                evtHArgs = {
                    isShow: !sheet.showHeaders,
                    sheetIdx: this.parent.activeSheetIndex,
                    cancel: false
                };
                this.parent.notify(completeAction, { eventArgs: evtHArgs, action: 'headers' });
                if (evtHArgs.cancel) { return; }
                this.parent.setSheetPropertyOnMute(sheet, 'showHeaders', !sheet.showHeaders);
                (this.parent.serviceLocator.getService('sheet') as IRenderer).showHideHeaders();
                this.toggleRibbonItems({ props: 'Headers', activeTab: this.ribbon.selectedTab });
                break;
            case parentId + '_gridlines':
                evtglArgs = {
                    isShow: !sheet.showGridLines,
                    sheetIdx: this.parent.activeSheetIndex,
                    cancel: false
                };
                this.parent.notify(completeAction, { eventArgs: evtglArgs, action: 'gridLines' });
                if (evtglArgs.cancel) { return; }
                this.parent.setSheetPropertyOnMute(sheet, 'showGridLines', !sheet.showGridLines);
                this.toggleRibbonItems({ props: 'GridLines', activeTab: this.ribbon.selectedTab });
                break;
            case parentId + '_protect':
                this.parent.notify(toggleProtect, {});
                break;
            case parentId + '_undo':
                this.parent.notify(performUndoRedo, { isUndo: true });
                break;
            case parentId + '_redo':
                this.parent.notify(performUndoRedo, { isUndo: false });
                break;
            case parentId + '_freezepanes':
                indexes = getCellIndexes(sheet.topLeftCell);
                selectCell = sheet.frozenRows || sheet.frozenColumns ? indexes : getCellIndexes(sheet.activeCell);
                this.parent.notify(freeze, { row: selectCell[0] - indexes[0], column: selectCell[1] - indexes[1], triggerEvent: true });
                break;
            case parentId + '_freezerows':
                this.parent.notify(freeze, { row: sheet.frozenRows ? 0 : getCellIndexes(
                    sheet.activeCell)[0] - getCellIndexes(sheet.topLeftCell)[0], column: sheet.frozenColumns, triggerEvent: true });
                break;
            case parentId + '_freezecolumns':
                this.parent.notify(freeze, {  row: sheet.frozenRows, column: sheet.frozenColumns ? 0 : getCellIndexes(
                    sheet.activeCell)[1] - getCellIndexes(sheet.topLeftCell)[1], triggerEvent: true });
                break;
            case parentId + '_protectworkbook':
                if (this.parent.password.length > 0) {
                    this.parent.notify(unProtectWorkbook, null);
                } else {
                    if (this.parent.isProtected) {
                        this.parent.isProtected = false;
                        if (this.parent.showSheetTabs) {
                            this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
                            this.parent.element.querySelector('.e-add-sheet-tab').classList.remove('e-disabled');
                        }
                        this.toggleRibbonItems({ props: 'Protectworkbook', activeTab: this.ribbon.selectedTab });
                        this.parent.notify(completeAction, { action: 'protectWorkbook', eventArgs: { isProtected: false } });
                    }
                    else if (this.parent.element.querySelector('.e-add-sheet-tab').classList.contains('e-disabled')) {
                        this.toggleRibbonItems({ props: 'Protectworkbook', activeTab: this.ribbon.selectedTab });
                    }
                    else {
                        this.parent.notify(protectWorkbook, null);
                    }
                }
                break;
            }
            this.parent.notify(ribbonClick, args);
        }
    }

    private toggleRibbonItems(args: { props: 'Headers' | 'GridLines' | 'Protect' | 'Protectworkbook', activeTab?: number }): void {
        let text: string = '';
        const viewtabHeader: string = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('View');
        const datatabHeader: string = (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Data');
        if (this.ribbon.items[this.ribbon.selectedTab].header.text === viewtabHeader) {
            if (isNullOrUndefined(args.activeTab)) {
                for (let i: number = 0, len: number = this.ribbon.items.length; i < len; i++) {
                    if (this.ribbon.items[i as number].header.text === viewtabHeader) { args.activeTab = i; break; }
                }
            }
            const text: string = this.getLocaleText(args.props);
            if(args.props === 'GridLines') {
                (this.parent.serviceLocator.getService('sheet') as IRenderer).toggleGridlines();
            }
            const id: string = `${this.parent.element.id}_${args.props.toLowerCase()}`;
            const len: number = this.ribbon.items[args.activeTab].content.length;
            for (let i: number; i < len; i++) {
                if (this.ribbon.items[args.activeTab].content[i as number].type === 'Separator') {
                    continue;
                }
                if (this.ribbon.items[args.activeTab].content[i as number].id === id) {
                    this.ribbon.items[args.activeTab].content[i as number].text = text;
                    this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
                }
            }
            if (this.ribbon.items[this.ribbon.selectedTab].header.text === viewtabHeader && args.props !== 'Protect') {
                this.updateToggleText(args.props.toLowerCase(), text);
            }
        }
        if (this.ribbon.items[this.ribbon.selectedTab].header.text === datatabHeader) {
            if (isNullOrUndefined(args.activeTab)) {
                for (let i: number = 0, len: number = this.ribbon.items.length; i < len; i++) {
                    if (this.ribbon.items[i as number].header.text === datatabHeader) { args.activeTab = i; break; }
                }
            }
            const id: string = `${this.parent.element.id}_${args.props.toLowerCase()}`;
            if (id === this.parent.element.id + '_protect') {
                const len: number = this.ribbon.items[this.ribbon.selectedTab].content.length; let j: number;
                for (j = 0; j < len; j++) {
                    if (this.ribbon.items[this.ribbon.selectedTab].content[j as number].id === this.parent.element.id + '_protect') {
                        break;
                    }
                }
                text = this.getLocaleProtectText('Sheet', true);
            }
            else if (id === this.parent.element.id + '_protectworkbook') {
                const len: number = this.ribbon.items[this.ribbon.selectedTab].content.length; let j: number;
                for (j = 0; j < len; j++) {
                    if (this.ribbon.items[this.ribbon.selectedTab].content[j as number].id === this.parent.element.id + '_protectworkbook') {
                        break;
                    }
                }
                if (this.parent.isProtected || this.parent.password.length > 0) {
                    text = this.getLocaleProtectWorkbook('UnprotectWorkbook');
                }
                else if (!this.parent.isProtected) {
                    text = this.getLocaleProtectWorkbook('ProtectWorkbook');
                }
            }
            const len: number = this.ribbon.items[args.activeTab].content.length;
            for (let i: number; i < len; i++) {
                if (this.ribbon.items[args.activeTab].content[i as number].type === 'Separator') { continue; }
                if (this.ribbon.items[args.activeTab].content[i as number].id === id) {
                    this.ribbon.items[args.activeTab].content[i as number].text = text;
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

    private addRibbonTabs(args: { items: RibbonItemModel[], insertBefore?: string }): void {
        this.ribbon.addTabs(args.items, args.insertBefore);
        const nextTab: HTMLElement = <HTMLElement>select(
            '.e-ribbon .e-tab-header .e-toolbar-item:not(.e-menu-tab).e-hide', this.parent.element);
        if (nextTab) {
            this.parent.updateActiveBorder(selectAll(
                '.e-ribbon .e-tab-header .e-toolbar-item:not(.e-menu-tab)', this.parent.element)[this.ribbon.selectedTab]);
        }
    }

    private updateToggleText(item: string, text: string): void {
        const ele: HTMLElement = select(`#${this.parent.element.id}_${item} .e-tbar-btn-text`, this.ribbon.element);
        if (item === 'protect' || item === 'protectworkbook') {
            ele.parentElement.setAttribute('aria-label', text);
        } else {
            ele.parentElement.setAttribute('aria-label', ele.textContent);
        }
        getUpdateUsingRaf((): void => {
            if (ele) {
                ele.textContent = text;
            }
        });
        if (item === 'headers') {
            const findDlgEle: HTMLElement = this.parent.element.getElementsByClassName('e-findtool-dlg')[0] as HTMLElement;
            if (findDlgEle && findDlgEle.classList.contains('e-popup-open')) {
                this.parent.notify(findToolDlg, { refreshPosition: true, dialogEle: findDlgEle });
            }
        }
    }

    private refreshViewTabContent(activeTab: number): void {
        const id: string = this.parent.element.id; const sheet: SheetModel = this.parent.getActiveSheet();
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let tabItem: TlbItemModel;
        for (let i: number = 0; i < this.ribbon.items[activeTab as number].content.length; i++) {
            tabItem = this.ribbon.items[activeTab as number].content[i as number];
            if (tabItem.type === 'Separator') { continue; }
            if (tabItem.id === `${id}_headers`) {
                this.updateViewTabContent(activeTab, 'Headers', i);
            }
            if (tabItem.id === `${id}_gridlines`) {
                this.updateViewTabContent(activeTab, 'GridLines', i);
            }
            if (tabItem.id === (`${id}_freezepanes`)) {
                if (sheet.frozenRows || sheet.frozenColumns) {
                    if (tabItem.text === l10n.getConstant('FreezePanes')) {
                        this.updateToggleText('freezepanes', this.updateRibbonItemText('Unfreeze', 'Panes', i, activeTab));
                    }
                } else {
                    if (tabItem.text === l10n.getConstant('UnfreezePanes')) {
                        this.updateToggleText('freezepanes', this.updateRibbonItemText('Freeze', 'Panes', i, activeTab));
                    }
                }
            }
            if (tabItem.id === (`${id}_freezerows`)) {
                if (sheet.frozenRows) {
                    if (tabItem.text === l10n.getConstant('FreezeRows')) {
                        this.updateToggleText('freezerows', this.updateRibbonItemText('Unfreeze', 'Rows', i, activeTab));
                    }
                } else {
                    if (tabItem.text === l10n.getConstant('UnfreezeRows')) {
                        this.updateToggleText('freezerows', this.updateRibbonItemText('Freeze', 'Rows', i, activeTab));
                    }
                }
            }
            if (tabItem.id === (`${id}_freezecolumns`)) {
                if (sheet.frozenColumns) {
                    if (tabItem.text === l10n.getConstant('FreezeColumns')) {
                        this.updateToggleText('freezecolumns', this.updateRibbonItemText('Unfreeze', 'Columns', i, activeTab));
                    }
                } else {
                    if (tabItem.text === l10n.getConstant('UnfreezeColumns')) {
                        this.updateToggleText('freezecolumns', this.updateRibbonItemText('Freeze', 'Columns', i, activeTab));
                    }
                }
            }
        }
    }

    private updateViewTabContent(activeTab: number, item: string, idx: number): void {
        const sheet: SheetModel = this.parent.getActiveSheet(); const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (sheet['show' + item]) {
            if (this.ribbon.items[activeTab as number].content[idx as number].text === l10n.getConstant('Show' + item)) {
                this.updateToggleText(item.toLowerCase(), this.updateRibbonItemText('Hide', item, idx, activeTab));
            }
        } else {
            if (this.ribbon.items[activeTab as number].content[idx as number].text === l10n.getConstant('Hide' + item)) {
                this.updateToggleText(item.toLowerCase(), this.updateRibbonItemText('Show', item, idx, activeTab));
            }
        }
    }
    private updateRibbonItemText(showHideText: string, item: string, idx: number, activeTab: number): string {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const text: string = l10n.getConstant(showHideText + item);
        this.ribbon.items[activeTab as number].content[idx as number].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        return text;
    }

    private refreshDataTabContent(activeTab: number): void {
        const id: string = this.parent.element.id; let updated: boolean;
        for (let j: number = 0; j < this.ribbon.items[activeTab as number].content.length; j++) {
            if (this.ribbon.items[activeTab as number].content[j as number].type === 'Separator') { continue; }
            if (this.ribbon.items[activeTab as number].content[j as number].id === `${id}_protect`) {
                this.updateDataTabContent(activeTab, 'Sheet', j);
                if (updated) { break; } updated = true;
            }
            if (this.ribbon.items[activeTab as number].content[j as number].id === `${id}_protectworkbook`) {
                this.updateDataTabContent(activeTab, 'Workbook', j);
            }
        }
    }

    private updateDataTabContent(activeTab: number, item: string, idx: number): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (item === 'Sheet') {
            if (sheet.isProtected) {
                if (this.ribbon.items[activeTab as number].content[idx as number].text === l10n.getConstant('Protect' + item)) {
                    this.ribbon.items[activeTab as number].content[idx as number].cssClass = 'e-active';
                    this.updateProtectBtn('Unprotect', item, idx, activeTab);
                }
            } else {
                this.updateProtectBtn('Protect', item, idx, activeTab);
            }
        }
        else if (item === 'Workbook') {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            if (this.parent.isProtected) {
                if (this.ribbon.items[activeTab as number].content[idx as number].text === l10n.getConstant('Protect' + item)) {
                    this.updateToggleText('protectworkbook', this.updateRibbonItemText('Unprotect', item, idx, activeTab));
                }
            } else {
                if (this.ribbon.items[activeTab as number].content[idx as number].text === l10n.getConstant('Unprotect' + item)) {
                    this.updateToggleText('protectworkbook', this.updateRibbonItemText('Protect', item, idx, activeTab));
                }
            }
        }
    }
    private updateProtectBtn(protectText: string, item: string, idx: number, activeTab: number): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const text: string = l10n.getConstant(protectText + item);
        this.ribbon.items[activeTab as number].content[idx as number].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText('protect', text);
    }

    private updateProtectWorkbookBtn(protectText: string, item: string, idx: number, activeTab: number): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const text: string = l10n.getConstant(protectText);
        this.ribbon.items[activeTab as number].content[idx as number].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText('protectworkbook', text);
    }

    private addToolbarItems(args: { tab: string, items: ItemModel[], index: number }): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.ribbon.addToolbarItems(l10n.getConstant(args.tab), args.items, args.index);
    }

    private enableToolbarItems(args: { tab?: string, items?: number[] | string[], enable?: boolean }[]): void {
        args.forEach((arg: { tab?: string, items?: number[] | string[], enable: boolean }): void => {
            this.ribbon.enableItems(arg.tab || this.ribbon.items[this.ribbon.selectedTab].header.text, arg.items, arg.enable);
        });
    }

    private createMobileView(): void {
        const parentId: string = this.parent.element.id;
        const toobar: HTMLElement = this.parent.createElement('div', { className: 'e-header-toolbar' });
        const menu: HTMLUListElement = this.parent.createElement('ul') as HTMLUListElement;
        toobar.appendChild(menu);
        const toolbarObj: Toolbar = new Toolbar({
            items: [
                { prefixIcon: 'e-tick-icon', align: 'Left', id: parentId + 'focused_tick', cssClass: 'e-focused-tick' },
                { template: menu, align: 'Right', id: parentId + 'file_menu' }
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
                const menuObj: Menu = new Menu(
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
        const toolbarPanel: HTMLElement = this.parent.createElement('div', { className: 'e-toolbar-panel e-ribbon' });
        const toolbar: HTMLElement = this.parent.createElement('div');
        const ddb: HTMLButtonElement = this.parent.createElement('button', { attrs: { 'type': 'button' } }) as HTMLButtonElement;
        toolbarPanel.appendChild(toolbar); toolbarPanel.appendChild(ddb);
        toolbarPanel.style.display = 'block';
        this.parent.element.appendChild(toolbarPanel);
        const ddbObj: DropDownButton = new DropDownButton({
            cssClass: 'e-caret-hide',
            content: this.ribbon.items[0].header.text as string,
            items: [
                { text: this.ribbon.items[0].header.text as string },
                { text: this.ribbon.items[1].header.text as string },
                { text: this.ribbon.items[2].header.text as string },
                { text: this.ribbon.items[3].header.text as string }
            ],
            createPopupOnClick: true,
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
                const element: HTMLElement = args.element.parentElement;
                const clientRect: ClientRect = element.getBoundingClientRect();
                const offset: OffsetPosition = calculatePosition(ddbObj.element, 'right', 'bottom');
                element.style.left = `${offset.left - clientRect.width}px`;
                element.style.top = `${offset.top - clientRect.height}px`;
                for (let i: number = 0; i < ddbObj.items.length; i++) {
                    if (ddbObj.content === ddbObj.items[i as number].text) {
                        args.element.children[i as number].classList.add('e-selected');
                        break;
                    }
                }
            },
            close: (): void => focus(this.parent.element)
        });
        ddbObj.createElement = this.parent.createElement;
        ddbObj.appendTo(ddb);
        const toolbarObj: Toolbar = new Toolbar({
            width: `calc(100% - ${ddb.getBoundingClientRect().width}px)`,
            items: this.ribbon.items[0].content,
            clicked: this.toolbarClicked.bind(this)
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toolbar);
        toolbarPanel.style.display = '';
    }
    private fileMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale); let wrapper: HTMLElement;
        const contents: string[] = ['.xlsx', '.xls', '.csv', '.pdf'];
        if (args.parentItem.text === l10n.getConstant('SaveAs')) {
            [].slice.call(args.element.children).forEach((li: HTMLElement, index: number): void => {
                wrapper = this.parent.createElement('div', { innerHTML: li.innerHTML });
                li.innerHTML = '';
                const extension: HTMLElement = this.parent.createElement('span', { className: 'e-extension' });
                extension.innerText = contents[index as number];
                wrapper.appendChild(extension);
                li.appendChild(wrapper);
            });
        }
        this.parent.trigger('fileMenuBeforeOpen', args);
        args.element.setAttribute('aria-label', (this.parent.serviceLocator.getService(locale) as L10n).getConstant('File'));
    }
    private enableRibbonTabs(args: { tabs: string[], enable: boolean }): void {
        this.ribbon.enableTabs(args.tabs, args.enable);
    }
    private fileMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        this.parent.trigger('fileMenuBeforeClose', args);
        if (args.parentItem && args.event && (args.event as KeyboardEvent).keyCode === 37 &&
            args.parentItem.id === `${this.parent.element.id}_File`) {
            getUpdateUsingRaf((): void => {
                const tabItem: HTMLElement = this.ribbon.element.querySelector('.e-tab-header .e-toolbar-item .e-tab-wrap');
                if (tabItem) {
                    focus(tabItem);
                    const menuItem: HTMLElement = tabItem.querySelector('.e-menu-item.e-focused')
                    if (menuItem) {
                        menuItem.classList.remove('e-focused');
                    }
                }
            });
        }
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
        enableInsertBtnId: string[], findBtnId: string[], dataValidationBtnId: string[],
        imageBtnId: string[], chartBtnId: string[]
    }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if ((sheet.isProtected && sheet.protectSettings.formatCells) || !sheet.isProtected) {
            if (this.parent.allowCellFormatting) {
                this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.enableHomeBtnId, enable: true }]);
            } else {
                this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.enableHomeBtnId.slice(2, 14), enable: false }]);
            }
            if (!this.parent.allowWrap) {
                this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.enableHomeBtnId.slice(14, 15), enable: false }]);
            }
            if (!this.parent.allowNumberFormatting) {
                this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.enableHomeBtnId.slice(2, 3), enable: false }]);
            }
            this.parent.notify(setUndoRedo, null);

        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Home'), items: args.disableHomeBtnId, enable: false }]);
        }
        if ((sheet.isProtected && sheet.protectSettings.insertLink) || !sheet.isProtected) {
            if (!this.parent.allowHyperlink || (sheet.isProtected && sheet.protectSettings.insertLink)) {
                this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.enableInsertBtnId.slice(0, 1), enable: false }]);
            } else {
                this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.enableInsertBtnId, enable: true }]);
            }
        } else {
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.enableInsertBtnId, enable: false }]);
        }
        this.enableToolbarItems(
            [{ tab: l10n.getConstant('Home'), items: args.findBtnId, enable: !sheet.isProtected || sheet.protectSettings.selectCells ||
            sheet.protectSettings.selectUnLockedCells }]);
        const len: number = this.ribbon.items[this.ribbon.selectedTab].content.length; let i: number;
        for (i = 0; i < len; i++) {
            if (this.ribbon.items[this.ribbon.selectedTab].content[i as number].id === this.parent.element.id + '_protectworkbook') {
                break;
            }
        }
        if (sheet.isProtected) {
            if (this.parent.isProtected && this.parent.element.querySelector('#' + this.parent.element.id + '_protectworkbook') &&
                this.parent.element.querySelector('#' + this.parent.element.id + '_protectworkbook')
                    .querySelector('.e-tbar-btn-text').textContent === l10n.getConstant('UnprotectWorkbook')) {
                if (this.ribbon.items[this.ribbon.selectedTab].header.text === l10n.getConstant('Data')) {
                    this.ribbon.items[this.ribbon.selectedTab].content[i as number].text = l10n.getConstant('UnprotectWorkbook');
                }
            } else {
                if (this.ribbon.items[this.ribbon.selectedTab].header.text === l10n.getConstant('Data')) {
                    this.ribbon.items[this.ribbon.selectedTab].content[i as number].text = l10n.getConstant('ProtectWorkbook');
                }
            }
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.imageBtnId, enable: false }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Data'), items: args.dataValidationBtnId, enable: false }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Formulas'), items: args.enableFrmlaBtnId, enable: false }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.chartBtnId, enable: false }]);
        } else {
            if (this.parent.isProtected && this.parent.element.querySelector('#' + this.parent.element.id + '_protectworkbook') &&
                this.parent.element.querySelector('#' + this.parent.element.id + '_protectworkbook')
                    .querySelector('.e-tbar-btn-text').textContent === l10n.getConstant('UnprotectWorkbook')) {
                if (this.ribbon.items[this.ribbon.selectedTab].header.text === l10n.getConstant('Data')) {
                    this.ribbon.items[this.ribbon.selectedTab].content[i as number].text = l10n.getConstant('UnprotectWorkbook');
                }
            } else {
                if (this.ribbon.items[this.ribbon.selectedTab].header.text === l10n.getConstant('Data')) {
                    this.ribbon.items[this.ribbon.selectedTab].content[i as number].text = l10n.getConstant('ProtectWorkbook');
                }
            }
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.imageBtnId, enable: this.parent.allowImage }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Data'), items: args.dataValidationBtnId,
                enable: this.parent.allowDataValidation }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Formulas'), items: args.enableFrmlaBtnId, enable: true }]);
            this.enableToolbarItems([{ tab: l10n.getConstant('Insert'), items: args.chartBtnId, enable: this.parent.allowChart }]);
        }
    }
    private updateMergeItem(e: MouseEvent & TouchEvent): void {
        if (e.type === 'mousemove' || e.type === 'pointermove' || e.type === 'touchmove' ||
         (e.shiftKey && (e.type === 'mousedown' || e.type === 'touchend'))) {
            const indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            if ((indexes[1] !== indexes[3] || indexes[0] !== indexes[2]) && !this.parent.getActiveSheet().isProtected &&
                this.parent.allowMerge) {
                this.enableToolbarItems([{ tab: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Home'),
                    items: [`${this.parent.element.id}_merge_cells`], enable: true }]);
                this.toggleActiveState(false);
            }
        }
    }
    private onPropertyChanged(prop: string): void {
        const l10: L10n = this.parent.serviceLocator.getService(locale);
        const id: string = this.parent.element.id;
        switch (prop) {
        case 'allowFreezePane':
            this.ribbon.enableItems(
                l10.getConstant('View'), [`${id}_freezepanes`, `${id}_freezerows`, `${id}_freezecolumns`], this.parent.allowFreezePane);
            break;
        case 'showRibbon':
            if (this.parent.showRibbon) {
                this.initialize(true);
            } else if (this.ribbon) {
                this.destroy();
            }
            break;
        case 'allowImage':
            this.ribbon.enableItems(
                l10.getConstant('Insert'), [`${id}_image`], this.parent.allowImage);
            break;
        case 'allowChart':
            this.ribbon.enableItems(
                l10.getConstant('Insert'), [`${id}_chart`], this.parent.allowChart);
            if (!this.parent.allowChart) {
                this.removeDesignChart();
            }
            break;
        }
    }
    private addEventListener(): void {
        this.parent.on(ribbon, this.ribbonOperation, this);
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
        this.parent.on(refreshRibbonIcons, this.refreshRibbonContent, this);
        this.parent.on(insertDesignChart, this.insertDesignChart, this);
        this.parent.on(removeDesignChart, this.removeDesignChart, this);
        this.parent.on(unMerge, this.unMerge, this);
    }
    public destroy(): void {
        const parentElem: HTMLElement = this.parent.element;
        const ribbonEle: HTMLElement = this.ribbon ? this.ribbon.element : null;
        const cPickerEle: HTMLElement = this.cPickerEle;
        const id: string = parentElem.id;
        ['bold', 'italic', 'line-through', 'underline'].forEach((name: string): void => {
            destroyComponent(select('#' + `${id}_${name}`, parentElem), Button);
        });
        if (this.pasteSplitBtn) { this.pasteSplitBtn.destroy(); } this.pasteSplitBtn = null;
        if (this.mergeSplitBtn) { this.mergeSplitBtn.destroy(); } this.mergeSplitBtn = null;
        if (this.numFormatDDB) { this.numFormatDDB.destroy(); } this.numFormatDDB = null;
        if (this.fontSizeDdb) { this.fontSizeDdb.destroy(); } this.fontSizeDdb = null;
        if (this.fontNameDdb) { this.fontNameDdb.destroy(); } this.fontNameDdb = null;
        if (this.textAlignDdb) { this.textAlignDdb.destroy(); } this.textAlignDdb = null;
        if (this.verticalAlignDdb) { this.verticalAlignDdb.destroy(); } this.verticalAlignDdb = null;
        if (this.sortingDdb) { this.sortingDdb.destroy(); } this.sortingDdb = null;
        if (this.clearDdb) { this.clearDdb.destroy(); } this.clearDdb = null;
        if (this.colorPicker) { this.colorPicker.destroy(); } this.colorPicker = null;
        this.destroyComponent(`${id}_borders_menu`, 'menu');
        if (this.bordersDdb) { this.bordersDdb.destroy(); } this.bordersDdb = null;
        if (this.findDdb) { this.findDdb.destroy(); } this.findDdb = null;
        this.destroyComponent(id + '_chart_menu', 'menu'); this.destroyComponent(id + '_chart_type_menu', 'menu');
        this.destroyComponent(id + '_chart-btn', 'dropdown-btn'); this.destroyComponent(id + '_chart-type-btn', 'dropdown-btn');
        this.destroyComponent(`${id}_cf_menu`, 'menu');
        if (this.cfDdb) { this.cfDdb.destroy(); } this.cfDdb = null;
        this.detachPopupElement(id);
        this.parent.notify('destroyRibbonComponents', null);
        if (this.ribbon) { this.ribbon.destroy(); }
        if (ribbonEle) {
            detach(ribbonEle);
        }
        this.ribbon = null;
        if (cPickerEle) {
            detach(cPickerEle);
        }
        this.cPickerEle = null;
        if (this.datavalidationDdb) { this.datavalidationDdb.destroy(); } this.datavalidationDdb = null;
        this.removeEventListener();
    }
    private destroyComponent(id: string | HTMLElement, moduleName: string): void {
        const ele: HTMLElement = typeof id === 'string' ? document.getElementById(id) : id;
        if (ele) {
            if (moduleName !== 'menu' || ele.childElementCount) {
                const compObj: Menu = getComponent(ele, moduleName) as Menu;
                if (compObj) {
                    compObj.destroy();
                    if (moduleName === 'dropdown-btn') {
                        const popup: HTMLElement = document.getElementById(`${ele.id}-popup`);
                        if (popup) { detach(popup); }
                    }
                }
            }
            if (moduleName === 'menu') { detach(ele); }
        }
    }
    private detachPopupElement(id: string): void {
        ['_conditionalformatting', '_chart-type-btn', '_chart-btn', '_borders'].forEach((selector: string): void => {
            const ddbPopup: HTMLElement = document.getElementById(`${id}${selector}-popup`);
            if (ddbPopup) { detach(ddbPopup); }
        });
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbon, this.ribbonOperation);
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
            this.parent.off(refreshRibbonIcons, this.refreshRibbonContent);
            this.parent.off(insertDesignChart, this.insertDesignChart);
            this.parent.off(removeDesignChart, this.removeDesignChart);
            this.parent.off(unMerge, this.unMerge);
            this.parent.off(addFormatToCustomFormatDlg);
        }
    }
}
