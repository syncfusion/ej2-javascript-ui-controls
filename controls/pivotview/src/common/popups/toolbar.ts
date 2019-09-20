import { Toolbar as tool, ClickEventArgs, MenuItemModel, Menu, ItemModel, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { remove, createElement } from '@syncfusion/ej2-base';
import * as events from '../../common/base/constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { SaveReportArgs, FetchReportArgs, LoadReportArgs, RemoveReportArgs, RenameReportArgs, ToolbarArgs } from '../base/interface';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import * as cls from '../../common/base/css-constant';
import { Common } from '../actions/common';
import { PivotView } from '../../pivotview/base/pivotview';
import { ToolbarItems, ChartSeriesType } from '../base/enum';
PivotView.Inject(Common);

/**
 * Module for Toolbar
 */
/** @hidden */
export class Toolbar {
    /** @hidden */
    public action: string;
    /** @hidden */
    public toolbar: tool;

    private parent: PivotView;
    private dialog: Dialog;
    private mdxDialog: Dialog;
    private reportList: DropDownList;
    private currentReport: string = '';
    private confirmPopUp: Dialog;
    private chartMenu: Menu;
    private exportMenu: Menu;
    private subTotalMenu: Menu;
    private grandTotalMenu: Menu;
    private formattingMenu: Menu;
    private dropArgs: ChangeEventArgs;

    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.toolbarModule = this;
        this.addEventListener();
    }

    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'toolbar';
    }

    private createToolbar(): void {
        this.parent.isModified = false;
        this.renderDialog();
        if (document.querySelector('#' + this.parent.element.id + 'pivot-toolbar') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'pivot-toolbar'));
        }
        let element: HTMLElement = createElement(
            'div', {
            id: this.parent.element.id + 'pivot-toolbar',
            className: cls.GRID_TOOLBAR
        });
        if (this.parent.showFieldList && this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList')) {
            this.parent.element.insertBefore(
                element, this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList'));
        } else if (this.parent.showGroupingBar &&
            this.parent.element.querySelector('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar')) {
            this.parent.element.insertBefore(
                element, this.parent.element.querySelector('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar'));
        } else {
            this.parent.element.insertBefore(
                element, this.parent.element.querySelector('#' + this.parent.element.id + '_grid'));
        }
        this.toolbar = new tool({
            created: this.create.bind(this),
            enableRtl: this.parent.enableRtl,
            items: this.getItems()
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo('#' + this.parent.element.id + 'pivot-toolbar');
        this.toolbar.width = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2);
        if (this.parent.chart) {
            this.parent.chart.width = this.parent.grid ? this.parent.getGridWidthAsNumber().toString() :
                this.parent.getWidthAsNumber().toString();
        }
    }

    private fetchReports(): FetchReportArgs {
        let reports: FetchReportArgs = { reportName: [] };
        this.parent.trigger(events.fetchReport, reports);
        return reports;
    }

    /* tslint:disable */
    private getItems(): ItemModel[] {
        let toolbar: string[] = this.parent.toolbar.filter((v: ToolbarItems, i: number, a: ToolbarItems[]) => a.indexOf(v) === i);
        let items: ItemModel[] = [];
        for (let item of toolbar) {
            switch (item) {
                case 'New':
                    items.push({
                        prefixIcon: cls.GRID_NEW + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('new'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'new'
                    });
                    break;
                case 'Save':
                    items.push({
                        prefixIcon: cls.GRID_SAVE + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('save'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'save'
                    });
                    break;
                case 'SaveAs':
                    items.push({
                        prefixIcon: cls.GRID_SAVEAS + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('saveAs'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'saveas'
                    });
                    break;
                case 'Rename':
                    items.push({
                        prefixIcon: cls.GRID_RENAME + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('rename'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'rename'
                    });
                    break;
                case 'Remove':
                    items.push({
                        prefixIcon: cls.GRID_REMOVE + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('deleteReport'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'remove'
                    });
                    break;
                case 'Load':
                    items.push({
                        template: '<div><input class=' + cls.GRID_LOAD + ' id=' + this.parent.element.id + '_reportlist></input></div>',
                        click: this.actionClick.bind(this),
                        id: this.parent.element.id + 'load'
                    });
                    break;
                case 'Grid':
                    let toDisable: boolean = this.parent.displayOption.view === 'Chart';
                    items.push({
                        prefixIcon: cls.TOOLBAR_GRID + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('grid'),
                        id: this.parent.element.id + 'grid', cssClass: toDisable ? cls.MENU_DISABLE : '',
                        click: this.menuItemClick.bind(this)
                    });
                    break;
                case 'Chart':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'chart_menu"></ul>',
                        id: this.parent.element.id + 'chartmenu'
                    });
                    break;
                case 'MDX':
                    if (this.parent.dataType == "olap") {
                        items.push({
                            prefixIcon: cls.GRID_MDX + ' ' + cls.ICON, id: this.parent.element.id + 'mdxQuery',
                            click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('mdxQuery')
                        });
                    }
                    break;
                case 'Export':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'export_menu"></ul>',
                        id: this.parent.element.id + 'exportmenu'
                    });
                    break;
                case 'SubTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'subtotal_menu"></ul>',
                        id: this.parent.element.id + 'subtotalmenu'
                    });
                    break;
                case 'GrandTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'grandtotal_menu"></ul>',
                        id: this.parent.element.id + 'grandtotalmenu'
                    });
                    break;
                case 'ConditionalFormatting':
                    items.push({
                        prefixIcon: cls.GRID_FORMATTING + ' ' + cls.ICON, id: this.parent.element.id + 'formatting',
                        click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('toolbarFormatting')
                    });
                    break;
                case 'NumberFormatting':
                    items.push({
                        prefixIcon: cls.FORMATTING_TOOLBAR + ' ' + cls.ICON, id: this.parent.element.id + 'numberFormatting',
                        click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('numberFormat')
                    });
                    break;
                case 'Formatting':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'formatting_menu"></ul>',
                        id: this.parent.element.id + 'formattingmenu'
                    });
                    break;
                case 'FieldList':
                    items.push({
                        prefixIcon: cls.TOOLBAR_FIELDLIST + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('fieldList'),
                        click: this.actionClick.bind(this), align: 'Right', id: this.parent.element.id + 'fieldlist'
                    });
                    if (this.parent.element.querySelector('.e-toggle-field-list')) {
                        (this.parent.element.querySelector('.e-toggle-field-list') as HTMLElement).style.display = 'none';
                    }
                    break;
            }
        }
        if (this.parent.showFieldList && toolbar.indexOf("FieldList") === -1 && (this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList') as HTMLElement).style.display === 'none') {
            (this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList') as HTMLElement).style.display = 'block';
        }
        let toolbarArgs: ToolbarArgs = { customToolbar: items };
        this.parent.trigger(events.toolbarRender, toolbarArgs);
        return items;
    }
    /* tslint:enable */

    private reportChange(args: ChangeEventArgs): void {
        this.dropArgs = args;
        if (this.parent.isModified && this.currentReport !== '') {
            this.createConfirmDialog(
                this.parent.localeObj.getConstant('alert'),
                this.parent.localeObj.getConstant('newReportConfirm'));
        } else {
            this.reportLoad(args);
        }
    }

    private reportLoad(args: ChangeEventArgs): void {
        if (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New') {
            let loadArgs: LoadReportArgs = {
                reportName: args.itemData.value as string
            };
            this.parent.trigger(events.loadReport, loadArgs, (observedArgs: LoadReportArgs) => {
                this.currentReport = observedArgs.reportName;
                this.parent.isModified = false;
            });
        }
    }

    private saveReport(args: ClickEventArgs): void {
        if (this.currentReport && this.currentReport !== '' && args.item.id === (this.parent.element.id + 'save')) {
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
        } else {
            this.dialogShow(args, 'saveAs');
        }
    }

    private mdxQueryDialog(args: ClickEventArgs): void {
        if (!(this.mdxDialog && !this.mdxDialog.isDestroyed)) {
            this.renderMDXDialog();
        }
        let outerDiv: HTMLElement = createElement('div', {
            className: cls.MDX_QUERY
        });
        let textarea: HTMLElement = createElement('textarea', {
            className: cls.MDX_QUERY_CONTENT,
            innerHTML: this.parent.olapEngineModule.getMDXQuery(this.parent.dataSourceSettings).trim(),
            attrs: { 'readonly': 'readonly' }
        });
        outerDiv.appendChild(textarea);
        this.mdxDialog.content = outerDiv;
        this.mdxDialog.show();
    }

    private dialogShow(args: ClickEventArgs, action?: string): void {
        this.dialog.header = args.item.tooltipText;
        let outerDiv: HTMLElement = createElement('div', {
            className: cls.GRID_REPORT_OUTER
        });
        let label: HTMLElement = createElement('div', {
            className: cls.GRID_REPORT_LABEL,
            innerHTML: this.parent.localeObj.getConstant('reportName')
        });
        let input: HTMLElement = createElement('input', {
            className: cls.GRID_REPORT_INPUT + ' ' + cls.INPUT,
            innerHTML: (action && action === 'rename' ? this.currentReport : ''),
            attrs: {
                'placeholder': this.parent.localeObj.getConstant('emptyReportName'),
                'value': (action && action === 'rename' ? this.currentReport : '')
            },
        });
        (input as HTMLTextAreaElement).setSelectionRange(input.textContent.length, input.textContent.length);
        outerDiv.appendChild(label);
        outerDiv.appendChild(input);
        this.dialog.content = outerDiv;
        this.dialog.refresh();
        this.dialog.show();
    }

    private renameReport(args: ClickEventArgs): void {
        this.parent.trigger(events.toolbarClick, args);
        if (this.currentReport && this.currentReport !== '') {
            this.dialogShow(args, 'rename');
        } else {
            this.parent.pivotCommon.errorDialog.createErrorDialog(
                this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
            return;
        }
    }

    private actionClick(args: ClickEventArgs): void {
        switch (args.item.id) {
            case (this.parent.element.id + 'save'):
            case (this.parent.element.id + 'saveas'):
                this.saveReport(args);
                break;
            case (this.parent.element.id + 'remove'):
                this.action = 'Remove';
                if (this.currentReport && this.currentReport !== '') {
                    this.createConfirmDialog(
                        this.parent.localeObj.getConstant('alert'),
                        this.parent.localeObj.getConstant('removeConfirm'));
                } else {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(
                        this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
                }
                return;
            case (this.parent.element.id + 'rename'):
                this.renameReport(args);
                break;
            case (this.parent.element.id + 'new'):
                this.action = 'New';
                if (this.parent.isModified) {
                    this.createConfirmDialog(
                        this.parent.localeObj.getConstant('alert'),
                        this.parent.localeObj.getConstant('newReportConfirm'));
                } else {
                    this.createNewReport();
                }
                break;
            case (this.parent.element.id + 'load'):
                this.action = 'Load';
                break;
            case (this.parent.element.id + 'fieldlist'):
                if (this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.dialogRenderer) {
                    this.parent.pivotFieldListModule.dialogRenderer.fieldListDialog.show();
                }
                break;
            case (this.parent.element.id + 'formatting'):
                if (this.parent.conditionalFormattingModule) {
                    this.parent.conditionalFormattingModule.showConditionalFormattingDialog();
                }
                break;
            case (this.parent.element.id + 'mdxQuery'):
                this.mdxQueryDialog(args);
                break;
            case (this.parent.element.id + 'numberFormatting'):
                if (this.parent.numberFormattingModule) {
                    this.parent.numberFormattingModule.showNumberFormattingDialog();
                }
                break;
        }
    }

    private renderDialog(): void {
        if (document.querySelector('#' + this.parent.element.id + 'report-dialog') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'report-dialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'report-dialog',
            className: cls.GRID_REPORT_DIALOG
        }));
        this.dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.okBtnClick.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'),
                        isPrimary: true
                    }
                },
                {
                    click: this.cancelBtnClick.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            isModal: true,
            visible: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parent.element.id + 'report-dialog');
    }

    private renderMDXDialog(): void {
        if (document.querySelector('#' + this.parent.element.id + 'mdx-dialog') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'mdx-dialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'mdx-dialog',
            className: cls.GRID_MDX_DIALOG
        }));
        this.mdxDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.copyMDXQuery.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('copy'),
                        isPrimary: true
                    }
                }
            ],
            header: this.parent.localeObj.getConstant('mdxQuery'),
            isModal: true,
            visible: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body
        });
        this.mdxDialog.isStringTemplate = true;
        this.mdxDialog.appendTo('#' + this.parent.element.id + 'mdx-dialog');
    }

    private copyMDXQuery(): void {
        let textArea: HTMLInputElement = this.mdxDialog.element.querySelector('.' + cls.MDX_QUERY_CONTENT);
        try {
            textArea.select();
            document.execCommand('copy');
        } catch (err) {
            window.alert('Oops, unable to copy');
        }
        return;
    }

    private okBtnClick(): void {
        let reportInput: HTMLInputElement = this.dialog.element.querySelector('.' + cls.GRID_REPORT_INPUT) as HTMLInputElement;
        if (reportInput && reportInput.value === '') {
            reportInput.focus();
            return;
        }
        let isNew: boolean = false;
        if ((this.dialog.header === this.parent.localeObj.getConstant('save') ||
            this.dialog.header === this.parent.localeObj.getConstant('saveAs')) &&
            reportInput.value && reportInput.value !== '') {
            if (this.action === 'New') {
                isNew = true;
            } else {
                this.action = 'Save';
            }
            this.currentReport = reportInput.value;
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: reportInput.value
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
        } else if (this.dialog.header === this.parent.localeObj.getConstant('rename') && reportInput.value && reportInput.value !== '') {
            this.action = 'Rename';
            let renameArgs: RenameReportArgs = {
                reportName: this.currentReport,
                rename: reportInput.value
            };
            this.parent.trigger(events.renameReport, renameArgs);
            this.currentReport = reportInput.value;
        }
        this.updateReportList();
        this.dialog.hide();
        if (isNew) {
            this.createNewReport();
        }
    }

    private createNewReport(): void {
        this.currentReport = '';
        this.reportList.value = '';
        this.reportList.text = '';
        this.reportList.refresh();
        this.parent.trigger(events.newReport);
        this.parent.isModified = false;
    }

    private cancelBtnClick(): void {
        this.dialog.hide();
    }

    private createConfirmDialog(title: string, description: string): void {
        if (document.getElementById(this.parent.element.id + '_ConfirmDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ConfirmDialog').parentElement);
        }
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_ConfirmDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.confirmPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'), isPrimary: true,
                        cssClass: cls.OK_BUTTON_CLASS
                    },
                    click: this.okButtonClick.bind(this)
                },
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel'),
                        cssClass: cls.CANCEL_BUTTON_CLASS
                    },
                    click: this.cancelButtonClick.bind(this)
                }
            ]
        });
        this.confirmPopUp.isStringTemplate = true;
        this.confirmPopUp.appendTo(errorDialog);
        this.confirmPopUp.element.querySelector('.e-dlg-header').innerHTML = title;
    }

    private okButtonClick(): void {
        if (this.action === 'Remove') {
            let removeArgs: RemoveReportArgs = {
                reportName: this.currentReport
            };
            this.parent.trigger(events.removeReport, removeArgs);
            this.currentReport = '';
            this.parent.isModified = false;
            this.action = '';
            this.updateReportList();
        } else if (this.action === 'New' || (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New')) {
            if (this.currentReport && this.currentReport !== '') {
                let saveArgs: SaveReportArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                if (this.action === 'New') {
                    this.createNewReport();
                } else {
                    this.reportLoad(this.dropArgs);
                }
            } else {
                this.dialogShow({ item: { tooltipText: this.parent.localeObj.getConstant('save') } } as ClickEventArgs);
            }
        }
        this.confirmPopUp.hide();
    }

    private cancelButtonClick(): void {
        if (this.action === 'New') {
            this.createNewReport();
        } else if (this.dropArgs && this.action !== 'Remove') {
            this.reportLoad(this.dropArgs);
        }
        this.confirmPopUp.hide();
    }
    /* tslint:disable */
    private create(): void {
        let toDisable: boolean = this.parent.displayOption.view === 'Table';
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'chart_menu')) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.TOOLBAR_CHART + ' ' + cls.ICON,
                items: toDisable ? [] : [
                    {
                        text: this.parent.localeObj.getConstant('column'),
                        id: this.parent.element.id + '_' + 'Column',
                    },
                    {
                        text: this.parent.localeObj.getConstant('bar'),
                        id: this.parent.element.id + '_' + 'Bar'
                    },
                    {
                        text: this.parent.localeObj.getConstant('line'),
                        id: this.parent.element.id + '_' + 'Line'
                    },
                    {
                        text: this.parent.localeObj.getConstant('area'),
                        id: this.parent.element.id + '_' + 'Area'
                    },
                    {
                        text: this.parent.localeObj.getConstant('scatter'),
                        id: this.parent.element.id + '_' + 'Scatter'
                    },
                    {
                        text: this.parent.localeObj.getConstant('polar'),
                        id: this.parent.element.id + '_' + 'Polar'
                    }
                ]
            }];
            this.chartMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    select: this.menuItemClick.bind(this)
                });
            this.chartMenu.isStringTemplate = true;
            this.chartMenu.appendTo('#' + this.parent.element.id + 'chart_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'export_menu')) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.GRID_EXPORT + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('pdf'),
                        iconCss: cls.GRID_PDF_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'pdf'
                    },
                    {
                        text: this.parent.localeObj.getConstant('excel'),
                        iconCss: cls.GRID_EXCEL_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'excel'
                    },
                    {
                        text: this.parent.localeObj.getConstant('csv'),
                        iconCss: cls.GRID_CSV_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'csv'
                    },
                    {
                        text: this.parent.localeObj.getConstant('png'),
                        iconCss: cls.GRID_PNG_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'png'
                    },
                    {
                        text: this.parent.localeObj.getConstant('jpeg'),
                        iconCss: cls.GRID_JPEG_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'jpeg'
                    },
                    {
                        text: this.parent.localeObj.getConstant('svg'),
                        iconCss: cls.GRID_SVG_EXPORT + ' ' + cls.ICON,
                        id: this.parent.element.id + 'svg'
                    }
                ]
            }];
            this.exportMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateExportMenu.bind(this)
                });
            this.exportMenu.isStringTemplate = true;
            this.exportMenu.appendTo('#' + this.parent.element.id + 'export_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'subtotal_menu')) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.GRID_SUB_TOTAL + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('showSubTotals'),
                        id: this.parent.element.id + 'subtotal',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('doNotShowSubTotals'),
                        id: this.parent.element.id + 'notsubtotal',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('showSubTotalsRowsOnly'),
                        id: this.parent.element.id + 'subtotalrow',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('showSubTotalsColumnsOnly'),
                        id: this.parent.element.id + 'subtotalcolumn',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                ]
            }];
            this.subTotalMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateSubtotalSelection.bind(this)
                });
            this.subTotalMenu.isStringTemplate = true;
            this.subTotalMenu.appendTo('#' + this.parent.element.id + 'subtotal_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'grandtotal_menu')) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.GRID_GRAND_TOTAL + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotals'),
                        id: this.parent.element.id + 'grandtotal',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('doNotShowGrandTotals'),
                        id: this.parent.element.id + 'notgrandtotal',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotalsRowsOnly'),
                        id: this.parent.element.id + 'grandtotalrow',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotalsColumnsOnly'),
                        id: this.parent.element.id + 'grandtotalcolumn',
                        iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                    },
                ]
            }];
            this.grandTotalMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateGrandtotalSelection.bind(this)
                });
            this.grandTotalMenu.isStringTemplate = true;
            this.grandTotalMenu.appendTo('#' + this.parent.element.id + 'grandtotal_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'formatting_menu')) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.FORMATTING_MENU + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('numberFormat'),
                        iconCss: cls.NUMBER_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'numberFormattingMenu'
                    },
                    {
                        text: this.parent.localeObj.getConstant('conditionalFormating'),
                        iconCss: cls.CONDITIONAL_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'conditionalFormattingMenu'
                    }
                ]
            }];
            this.formattingMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    select: this.menuItemClick.bind(this)
                });
            this.formattingMenu.isStringTemplate = true;
            this.formattingMenu.appendTo('#' + this.parent.element.id + 'formatting_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + '_reportlist')) {
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: this.parent.localeObj.getConstant('defaultReport')
            };
            this.currentReport = this.parent.localeObj.getConstant('defaultReport');
            this.parent.trigger(events.saveReport, saveArgs);
            let reports: FetchReportArgs = this.fetchReports();
            this.reportList = new DropDownList({
                dataSource: reports.reportName,
                width: '150px',
                popupHeight: '200px',
                placeholder: this.currentReport === '' ? this.parent.localeObj.getConstant('reportList') : '',
                enableRtl: this.parent.enableRtl,
                cssClass: cls.REPORT_LIST_DROP,
                select: this.reportChange.bind(this),
                value: this.currentReport
            });
            this.reportList.isStringTemplate = true;
            this.reportList.appendTo('#' + this.parent.element.id + '_reportlist');
        }
    }

    private updateExportMenu(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.parent.currentView == "Table") {
            args.element.querySelector('#' + this.parent.element.id + 'png').remove();
            args.element.querySelector('#' + this.parent.element.id + 'jpeg').remove();
            args.element.querySelector('#' + this.parent.element.id + 'svg').remove();
        }
        else {
            args.element.querySelector('#' + this.parent.element.id + 'excel').remove();
            args.element.querySelector('#' + this.parent.element.id + 'csv').remove();
        }
    }

    private updateSubtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showSubTotals && !this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (!this.parent.dataSourceSettings.showSubTotals || (!this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals)) {
            args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
    }

    private updateGrandtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showGrandTotals && !this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (!this.parent.dataSourceSettings.showGrandTotals || (!this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals)) {
            args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
    }

    private updateReportList(): void {
        let reports: FetchReportArgs = this.fetchReports();
        this.reportList.dataSource = reports.reportName;
        if (this.currentReport === '' && this.reportList.dataSource.length > 0) {
            this.reportList.value = this.reportList.dataSource[this.reportList.dataSource.length - 1];
            this.reportList.text = this.reportList.dataSource[this.reportList.dataSource.length - 1];
            this.currentReport = this.reportList.dataSource[this.reportList.dataSource.length - 1];
        } else {
            this.reportList.value = this.currentReport;
            this.reportList.text = this.currentReport;
        }
        this.reportList.refresh();
    }

    private menuItemClick(args: ClickEventArgs): void {
        switch (args.item.id) {
            case (this.parent.element.id + 'grid'):
                if (this.parent.grid && this.parent.chart) {
                    this.parent.grid.element.style.display = '';
                    this.parent.chart.element.style.display = 'none';
                    this.parent.currentView = 'Table';
                    if (this.parent.showGroupingBar) {
                        (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = "";
                        (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = "none";
                    }
                    this.parent.layoutRefresh();
                }
                break;
            case (this.parent.element.id + '_' + 'Column'):
            case (this.parent.element.id + '_' + 'Bar'):
            case (this.parent.element.id + '_' + 'Line'):
            case (this.parent.element.id + '_' + 'Area'):
            case (this.parent.element.id + '_' + 'Scatter'):
            case (this.parent.element.id + '_' + 'Polar'):
                if (args.item && args.item.text) {
                    this.parent.chartSettings.chartSeries.type = args.item.id.split('_')[args.item.id.split('_').length - 1] as ChartSeriesType;
                    if (this.parent.grid && this.parent.chart) {
                        this.parent.grid.element.style.display = 'none';
                        this.parent.chart.element.style.display = '';
                        this.parent.currentView = 'Chart';
                        if (this.parent.showGroupingBar) {
                            (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = "none";
                            (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = "";
                        }
                    }
                }
                break;
            case (this.parent.element.id + 'pdf'):
                if (this.parent.currentView == "Table") {
                    if (this.parent.pdfExportModule) {
                        this.parent.pdfExportModule.exportToPDF();
                    } else {
                        this.parent.pdfExport();
                    }
                }
                else {
                    this.parent.chartExport('PDF', 'result');
                }
                break;
            case (this.parent.element.id + 'excel'):
                if (this.parent.excelExportModule) {
                    this.parent.excelExportModule.exportToExcel('Excel');
                } else {
                    this.parent.excelExport();
                }
                break;
            case (this.parent.element.id + 'csv'):
                if (this.parent.excelExportModule) {
                    this.parent.excelExportModule.exportToExcel('csv');
                } else {
                    this.parent.csvExport();
                }
                break;
            case (this.parent.element.id + 'png'):
                this.parent.chartExport('PNG', 'result');
                break;
            case (this.parent.element.id + 'jpeg'):
                this.parent.chartExport('JPEG', 'result');
                break;
            case (this.parent.element.id + 'svg'):
                this.parent.chartExport('SVG', 'result');
                break;
            case (this.parent.element.id + 'notsubtotal'):
                this.parent.dataSourceSettings.showSubTotals = false;
                this.parent.dataSourceSettings.showColumnSubTotals = false;
                this.parent.dataSourceSettings.showRowSubTotals = false;
                break;
            case (this.parent.element.id + 'subtotalrow'):
                this.parent.dataSourceSettings.showSubTotals = true;
                this.parent.dataSourceSettings.showColumnSubTotals = false;
                this.parent.dataSourceSettings.showRowSubTotals = true;
                break;
            case (this.parent.element.id + 'subtotalcolumn'):
                this.parent.dataSourceSettings.showSubTotals = true;
                this.parent.dataSourceSettings.showColumnSubTotals = true;
                this.parent.dataSourceSettings.showRowSubTotals = false;
                break;
            case (this.parent.element.id + 'subtotal'):
                this.parent.dataSourceSettings.showSubTotals = true;
                this.parent.dataSourceSettings.showColumnSubTotals = true;
                this.parent.dataSourceSettings.showRowSubTotals = true;
                break;
            case (this.parent.element.id + 'notgrandtotal'):
                this.parent.dataSourceSettings.showGrandTotals = false;
                this.parent.dataSourceSettings.showColumnGrandTotals = false;
                this.parent.dataSourceSettings.showRowGrandTotals = false;
                break;
            case (this.parent.element.id + 'grandtotalrow'):
                this.parent.dataSourceSettings.showGrandTotals = true;
                this.parent.dataSourceSettings.showColumnGrandTotals = false;
                this.parent.dataSourceSettings.showRowGrandTotals = true;
                break;
            case (this.parent.element.id + 'grandtotalcolumn'):
                this.parent.dataSourceSettings.showGrandTotals = true;
                this.parent.dataSourceSettings.showColumnGrandTotals = true;
                this.parent.dataSourceSettings.showRowGrandTotals = false;
                break;
            case (this.parent.element.id + 'grandtotal'):
                this.parent.dataSourceSettings.showGrandTotals = true;
                this.parent.dataSourceSettings.showColumnGrandTotals = true;
                this.parent.dataSourceSettings.showRowGrandTotals = true;
                break;
            case (this.parent.element.id + 'numberFormattingMenu'):
                if (this.parent.numberFormattingModule) {
                    this.parent.numberFormattingModule.showNumberFormattingDialog();
                }
                break;
            case (this.parent.element.id + 'conditionalFormattingMenu'):
                if (this.parent.conditionalFormattingModule) {
                    this.parent.conditionalFormattingModule.showConditionalFormattingDialog();
                }
                break;
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initToolbar, this.createToolbar, this);
    }

    /**
     * To refresh the toolbar 
     * @return {void}
     * @hidden
     */
    public refreshToolbar(): void {
        this.createToolbar();
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initToolbar, this.createToolbar);
    }

    /**
     * To destroy the toolbar 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.confirmPopUp && !this.confirmPopUp.isDestroyed) {
            this.confirmPopUp.destroy();
        }
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        if (this.mdxDialog && !this.mdxDialog.isDestroyed) {
            this.mdxDialog.destroy();
        }
        if (this.chartMenu && !this.chartMenu.isDestroyed) {
            this.chartMenu.destroy();
        }
        if (this.exportMenu && !this.exportMenu.isDestroyed) {
            this.exportMenu.destroy();
        }
        if (this.subTotalMenu && !this.subTotalMenu.isDestroyed) {
            this.subTotalMenu.destroy();
        }
        if (this.grandTotalMenu && !this.grandTotalMenu.isDestroyed) {
            this.grandTotalMenu.destroy();
        }
        if (this.formattingMenu && !this.formattingMenu.isDestroyed) {
            this.formattingMenu.destroy();
        }
        if (this.reportList && !this.reportList.isDestroyed) {
            this.reportList.destroy();
        }
        if (this.toolbar && !this.toolbar.isDestroyed) {
            this.toolbar.destroy();
        }
    }
}