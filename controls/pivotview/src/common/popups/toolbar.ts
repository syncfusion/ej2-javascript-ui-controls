import { Toolbar as tool, ClickEventArgs, MenuItemModel, Menu, ItemModel } from '@syncfusion/ej2-navigations';
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

    private parent: PivotView;
    private toolbar: tool;
    private dialog: Dialog;
    private reportList: DropDownList;
    private currentReport: string = '';
    private confirmPopUp: Dialog;
    private action: string;
    private exportMenu: Menu;
    private subTotalMenu: Menu;
    private grandTotalMenu: Menu;

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
        this.renderDialog();
        if (document.querySelector('#' + this.parent.element.id + 'pivot-toolbar') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'pivot-toolbar'));
        }
        this.parent.element.insertBefore(
            createElement(
                'div', {
                    id: this.parent.element.id + 'pivot-toolbar',
                    className: cls.GRID_TOOLBAR
                }),
            this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList'));

        this.toolbar = new tool({
            created: this.create.bind(this),
            enableRtl: this.parent.enableRtl,
            width: this.parent.width ? (Number(this.parent.width) - 2) : (Number(this.parent.element.offsetWidth) - 2),
            items: this.getItems()
        });
        this.toolbar.appendTo('#' + this.parent.element.id + 'pivot-toolbar');
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
                        click: this.gridClick.bind(this),
                    });
                    break;
                case 'Chart':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + '_chart"></ul>',
                        id: this.parent.element.id + 'chart'
                    });
                    break;
                case 'Export':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + '_menu"></ul>',
                        id: this.parent.element.id + 'export'
                    });
                    break;
                case 'SubTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + '_summary"></ul>',
                        id: this.parent.element.id + 'sub-total'
                    });
                    break;
                case 'GrandTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + '_grandtotal"></ul>',
                        id: this.parent.element.id + 'grand-total'
                    });
                    break;
                case 'ConditionalFormatting':
                    items.push({
                        prefixIcon: cls.GRID_FORMATTING + ' ' + cls.ICON, id: this.parent.element.id + 'formatting',
                        click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('toolbarFormatting')
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
        let toolbarArgs: ToolbarArgs = { customToolbar: items };
        this.parent.trigger(events.toolbarRender, toolbarArgs);
        return items;
    }
    /* tslint:enable */

    private reportChange(args: ChangeEventArgs): void {
        if (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New') {
            let loadArgs: LoadReportArgs = {
                reportName: args.itemData.value as string
            };
            this.parent.trigger(events.loadReport, loadArgs);
            this.currentReport = loadArgs.reportName;
        }
    }

    private saveReport(args: ClickEventArgs): void {
        if (this.currentReport && this.currentReport !== '' && args.item.id === (this.parent.element.id + 'save')) {
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
        } else {
            this.dialogShow(args);
        }
    }

    private dialogShow(args: ClickEventArgs): void {
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
            attrs: {
                'placeholder': this.parent.localeObj.getConstant('emptyReportName')
            },
        });
        outerDiv.appendChild(label);
        outerDiv.appendChild(input);
        this.dialog.content = outerDiv;
        this.dialog.refresh();
        this.dialog.show();
    }

    private renameReport(args: ClickEventArgs): void {
        this.parent.trigger(events.toolbarClick, args);
        if (this.currentReport && this.currentReport !== '') {
            this.dialogShow(args);
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
                this.createConfirmDialog(
                    this.parent.localeObj.getConstant('alert'),
                    this.parent.localeObj.getConstant('newReportConfirm'));
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
            allowDragging: false,
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
        this.dialog.appendTo('#' + this.parent.element.id + 'report-dialog');
    }

    private okBtnClick(): void {
        let reportInput: HTMLInputElement = this.dialog.element.querySelector('.' + cls.GRID_REPORT_INPUT) as HTMLInputElement;
        if (reportInput && reportInput.value === '') {
            reportInput.focus();
            return;
        }
        if ((this.dialog.header === this.parent.localeObj.getConstant('save') ||
            this.dialog.header === this.parent.localeObj.getConstant('saveAs')) &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'Save';
            this.currentReport = reportInput.value;
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: reportInput.value
            };
            this.parent.trigger(events.saveReport, saveArgs);
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
            allowDragging: false,
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
                        cssClass: cls.OK_BUTTON_CLASS + ' ' + cls.OUTLINE_CLASS
                    },
                    click: this.okButtonClick.bind(this)
                },
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel'), isPrimary: true,
                        cssClass: cls.CANCEL_BUTTON_CLASS
                    },
                    click: this.cancelButtonClick.bind(this)
                }
            ]
        });
        this.confirmPopUp.appendTo(errorDialog);
    }

    private okButtonClick(): void {
        if (this.action === 'New') {
            if (this.currentReport && this.currentReport !== '') {
                let saveArgs: SaveReportArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
            } else {
                this.dialogShow({ item: { tooltipText: this.parent.localeObj.getConstant('save') }} as ClickEventArgs);
            }
        } else if (this.action === 'Remove') {
            let removeArgs: RemoveReportArgs = {
                reportName: this.currentReport
            };
            this.parent.trigger(events.removeReport, removeArgs);
            this.currentReport = '';
            this.updateReportList();
        }
        this.confirmPopUp.hide();
    }

    private  cancelButtonClick(): void {
        if (this.action === 'New') {
            this.currentReport = '';
            this.reportList.value = '';
            this.reportList.text = '';
            this.reportList.refresh();
            this.parent.trigger(events.newReport);
        }
        this.confirmPopUp.hide();
    }
    /* tslint:disable */
    private create(): void {
        let toDisable: boolean = this.parent.displayOption.view === 'Table';
        let menuChartTypes: MenuItemModel[] = [
            {
                iconCss: cls.TOOLBAR_CHART + ' ' + cls.ICON,
                items: toDisable ? [] : [
                    {
                        text: this.parent.localeObj.getConstant('column'),
                        id: 'Column'
                    },
                    {
                        text: this.parent.localeObj.getConstant('bar'),
                        id: 'Bar'
                    },
                    {
                        text: this.parent.localeObj.getConstant('line'),
                        id: 'Line'
                    },
                    {
                        text: this.parent.localeObj.getConstant('area'),
                        id: 'Area'
                    },
                    {
                        text: this.parent.localeObj.getConstant('scatter'),
                        id: 'Scatter'
                    },
                    {
                        text: this.parent.localeObj.getConstant('polar'),
                        id: 'Polar'
                    }
                ]
            }
        ];
        new Menu(
            {
                items: menuChartTypes, cssClass: toDisable ? cls.MENU_DISABLE : '', enableRtl: this.parent.enableRtl,
                select: this.chartClick.bind(this)
            },
            '#' + this.parent.element.id + '_chart');
        let menuData: MenuItemModel[] = [
            {
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
                    }
                ]
            }
        ];
        this.exportMenu = new Menu(
            { items: menuData, enableRtl: this.parent.enableRtl, select: this.export.bind(this) },
            '#' + this.parent.element.id + '_menu');

        let menu: MenuItemModel[] = [
            {
                iconCss: cls.GRID_SUB_TOTAL + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('showSubTotals'),
                        id: this.parent.element.id + 'subtotal'
                    },
                    {
                        text: this.parent.localeObj.getConstant('doNotShowSubTotals'),
                        id: this.parent.element.id + 'notsubtotal'
                    },
                    {
                        text: this.parent.localeObj.getConstant('showSubTotalsRowsOnly'),
                        id: this.parent.element.id + 'subtotalrow'
                    },
                    {
                        text: this.parent.localeObj.getConstant('showSubTotalsColumnsOnly'),
                        id: this.parent.element.id + 'subtotalcolumn'
                    },
                ]
            }
        ];
        this.subTotalMenu = new Menu(
            { items: menu, enableRtl: this.parent.enableRtl, select: this.subTotalClick.bind(this) },
            '#' + this.parent.element.id + '_summary');

        let menuTotal: MenuItemModel[] = [
            {
                iconCss: cls.GRID_GRAND_TOTAL + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotals'),
                        id: this.parent.element.id + 'grandtotal'
                    },
                    {
                        text: this.parent.localeObj.getConstant('doNotShowGrandTotals'),
                        id: this.parent.element.id + 'notgrandtotal'
                    },
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotalsRowsOnly'),
                        id: this.parent.element.id + 'grandtotalrow'
                    },
                    {
                        text: this.parent.localeObj.getConstant('showGrandTotalsColumnsOnly'),
                        id: this.parent.element.id + 'grandtotalcolumn'
                    },
                ]
            }
        ];
        this.grandTotalMenu = new Menu(
            { items: menuTotal, enableRtl: this.parent.enableRtl, select: this.grandTotalClick.bind(this) },
            '#' + this.parent.element.id + '_grandtotal');

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
        this.reportList.appendTo('#' + this.parent.element.id + '_reportlist');
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
    }

    private grandTotalClick(args: ClickEventArgs): void {
        switch (args.item.id) {
            case (this.parent.element.id + 'notgrandtotal'):
                this.parent.dataSource.showGrandTotals = false;
                this.parent.dataSource.showColumnGrandTotals = false;
                this.parent.dataSource.showRowGrandTotals = false;
                break;
            case (this.parent.element.id + 'grandtotalrow'):
                this.parent.dataSource.showGrandTotals = true;
                this.parent.dataSource.showColumnGrandTotals = false;
                this.parent.dataSource.showRowGrandTotals = true;
                break;
            case (this.parent.element.id + 'grandtotalcolumn'):
                this.parent.dataSource.showGrandTotals = true;
                this.parent.dataSource.showColumnGrandTotals = true;
                this.parent.dataSource.showRowGrandTotals = false;
                break;
            case (this.parent.element.id + 'grandtotal'):
                this.parent.dataSource.showGrandTotals = true;
                this.parent.dataSource.showColumnGrandTotals = true;
                this.parent.dataSource.showRowGrandTotals = true;
                break;
        }
    }

    private subTotalClick(args: ClickEventArgs): void {
        switch (args.item.id) {
            case (this.parent.element.id + 'notsubtotal'):
                this.parent.dataSource.showSubTotals = false;
                this.parent.dataSource.showColumnSubTotals = false;
                this.parent.dataSource.showRowSubTotals = false;
                break;
            case (this.parent.element.id + 'subtotalrow'):
                this.parent.dataSource.showSubTotals = true;
                this.parent.dataSource.showColumnSubTotals = false;
                this.parent.dataSource.showRowSubTotals = true;
                break;
            case (this.parent.element.id + 'subtotalcolumn'):
                this.parent.dataSource.showSubTotals = true;
                this.parent.dataSource.showColumnSubTotals = true;
                this.parent.dataSource.showRowSubTotals = false;
                break;
            case (this.parent.element.id + 'subtotal'):
                this.parent.dataSource.showSubTotals = true;
                this.parent.dataSource.showColumnSubTotals = true;
                this.parent.dataSource.showRowSubTotals = true;
                break;
        }
    }

    private gridClick(args: ClickEventArgs): void {
        if (this.parent.grid && this.parent.chart) {
            this.parent.grid.element.style.display = '';
            this.parent.chart.element.style.display = 'none';
            this.parent.currentView = 'Table';
        }
    }

    private chartClick(args: ClickEventArgs): void {
        if (args.item && args.item.text) {
            this.parent.chartSettings.chartSeries.type = args.item.id as ChartSeriesType;
            if (this.parent.grid && this.parent.chart) {
                this.parent.grid.element.style.display = 'none';
                this.parent.chart.element.style.display = '';
                this.parent.currentView = 'Chart';
            }
        }
    }

    private export(args: ClickEventArgs): void {
        switch (args.item.id) {
            case (this.parent.element.id + 'pdf'):
                if (this.parent.pdfExportModule) {
                    this.parent.pdfExportModule.exportToPDF();
                } else {
                    this.parent.pdfExport();
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
        if (this.exportMenu && !this.exportMenu.isDestroyed) {
            this.exportMenu.destroy();
        }
        if (this.subTotalMenu && !this.subTotalMenu.isDestroyed) {
            this.subTotalMenu.destroy();
        }
        if (this.grandTotalMenu && !this.grandTotalMenu.isDestroyed) {
            this.grandTotalMenu.destroy();
        }
        if (this.reportList && !this.reportList.isDestroyed) {
            this.reportList.destroy();
        }
        if (this.toolbar && !this.toolbar.isDestroyed) {
            this.toolbar.destroy();
        }
    }
}