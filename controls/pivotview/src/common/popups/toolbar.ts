import { Toolbar as tool, ClickEventArgs, MenuItemModel, Menu } from '@syncfusion/ej2-navigations';
import { ItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { remove, createElement, formatUnit, getInstance, addClass, removeClass, select, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../../common/base/constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { SaveReportArgs, FetchReportArgs, LoadReportArgs, RemoveReportArgs, RenameReportArgs, ToolbarArgs, PivotActionInfo } from '../base/interface';
import { BeforeExportEventArgs } from '../base/interface';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import * as cls from '../../common/base/css-constant';
import { DisplayOption, PivotView } from '../../pivotview/base/pivotview';
import { ToolbarItems, ChartSeriesType, MultipleAxisMode } from '../base/enum';
import { Deferred } from '@syncfusion/ej2-data';
import { CheckBox, ChangeEventArgs as StateChange } from '@syncfusion/ej2-buttons';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ChartSettingsModel } from '../../pivotview/model/chartsettings-model';
import { OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ChartSettings } from '../../pivotview/model/chartsettings';
import { GridSettings } from '../../pivotview/model/gridsettings';

/**
 * Module for Toolbar
 */
/** @hidden */
export class Toolbar {
    /** @hidden */
    public action: string;
    /** @hidden */
    public toolbar: tool;
    /** @hidden */
    public isMultiAxisChange: boolean = false;

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
    private chartTypesDialog: Dialog;
    private newArgs: ClickEventArgs;
    private renameText: string;
    private showLableState: boolean;
    private chartLableState: boolean;

    constructor(parent: PivotView) {    /* eslint-disable-line */
        this.parent = parent;
        this.parent.toolbarModule = this;
        this.addEventListener();
    }

    /**
     * It returns the Module name.
     * @returns {string} - string
     * @hidden
     */
    public getModuleName(): string {
        return 'toolbar';
    }

    private createToolbar(): void {
        this.parent.isModified = false;
        this.renderDialog();
        if (select('#' + this.parent.element.id + 'pivot-toolbar', document) !== null) {
            remove(select('#' + this.parent.element.id + 'pivot-toolbar', document));
        }
        let element: HTMLElement = createElement(
            'div', {
            id: this.parent.element.id + 'pivot-toolbar',
            className: cls.GRID_TOOLBAR
        });
        if (this.parent.showFieldList && select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element)) {
            this.parent.element.insertBefore(
                element, select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element));
        } else if (this.parent.showGroupingBar &&
            select('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar', this.parent.element)) {
            this.parent.element.insertBefore(
                element, select('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar', this.parent.element));
        } else {
            this.parent.element.insertBefore(
                element, select('#' + this.parent.element.id + '_grid', this.parent.element));
        }
        this.toolbar = new tool({
            created: this.create.bind(this),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            items: this.getItems(),
            allowKeyboard: false,
            width: !this.parent.gridSettings.allowAutoResizing ? (this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2)) : 'auto'
        });
        this.toolbar.isStringTemplate = true;
        let viewStr: string = 'viewContainerRef';
        let registerTemp: string = 'registeredTemplate';
        /* eslint-disable */
        if ((this.parent as any)[viewStr]) {
            (this.toolbar as any)[registerTemp] = {};
            (this.toolbar as any)[viewStr] = (this.parent as any)[viewStr];
        }
        /* eslint-enable */
        if (this.parent.toolbarTemplate && typeof (this.parent.toolbarTemplate) === 'string') {
            this.toolbar.appendTo(this.parent.toolbarTemplate);
            this.parent.element.replaceChild(this.toolbar.element, this.parent.element.querySelector('.' + cls.GRID_TOOLBAR));
            this.toolbar.element.classList.add(cls.GRID_TOOLBAR);
        } else {
            this.toolbar.appendTo('#' + this.parent.element.id + 'pivot-toolbar');
            this.toolbar.width = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2);
        }
        if (this.parent.chart) {
            this.parent.chart.setProperties(
                { width: this.parent.grid ? this.parent.getGridWidthAsNumber().toString() : this.parent.getWidthAsNumber().toString() },
                true);
        }
        if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
        }
    }

    private fetchReports(): FetchReportArgs {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let reports: any = { reportName: [] };
        let tool: Toolbar = this;   /* eslint-disable-line */
        /* eslint-enable @typescript-eslint/no-explicit-any */
        this.parent.trigger(events.fetchReport, reports);
        return reports;
    }

    private fetchReportsArgs(): FetchReportArgs | Deferred {
        let callbackPromise: Deferred = new Deferred();
        let reports: FetchReportArgs = { reportName: [] };
        this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
            callbackPromise.resolve(observedArgs);
        });
        return callbackPromise;
    }

    /* eslint-disable */
    private getItems(): ItemModel[] {
        let toolbar: (ToolbarItems | ItemModel)[] = this.parent.toolbar.filter((v: ToolbarItems, i: number, a: ToolbarItems[]) => a.indexOf(v) === i);
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
                    let validTypes: boolean = (this.parent.displayOption.view === 'Table');
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'chart_menu"></ul>',
                        id: this.parent.element.id + 'chartmenu', cssClass: validTypes ? cls.MENU_DISABLE : ''

                    });
                    break;
                case 'MDX':
                    if (this.parent.dataType === 'olap') {
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
                default:
                    if (typeof (item) === 'object') {
                        items.push(item as ItemModel);
                    }
            }
        }
        if (this.parent.showFieldList && toolbar.indexOf('FieldList') === -1 && (select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element) as HTMLElement) &&
            (select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element) as HTMLElement).style.display === 'none') {
            (select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element) as HTMLElement).style.display = 'block';
        }
        let toolbarArgs: ToolbarArgs = { customToolbar: items };
        this.parent.trigger(events.toolbarRender, toolbarArgs);
        return items;
    }
    /* eslint-enable */

    private reportChange(args: ChangeEventArgs): void {
        this.parent.actionObj.actionName = events.reportChange;
        if (this.parent.actionBeginMethod()) {
            args.cancel = true;
            return;
        }
        try {
            this.dropArgs = args;
            if (this.parent.isModified && this.currentReport !== '') {
                this.createConfirmDialog(
                    this.parent.localeObj.getConstant('alert'),
                    this.parent.localeObj.getConstant('newReportConfirm'));
            } else {
                this.reportLoad(args);
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private reportLoad(args: ChangeEventArgs): void {
        if (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New') {
            let loadArgs: LoadReportArgs = {
                reportName: args.itemData.value as string
            };
            let actionInfo: PivotActionInfo = {
                reportName: args.itemData.value as string
            }
            this.parent.actionObj.actionInfo = actionInfo;
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
            this.parent.actionObj.actionName = this.parent.getActionCompleteName();
            let actionInfo: PivotActionInfo = {
                reportName: this.currentReport
            }
            this.parent.actionObj.actionInfo = actionInfo;
            this.parent.trigger(events.saveReport, saveArgs);
            if (this.parent.actionObj.actionName) {
                this.parent.actionCompleteMethod();
            }
            this.parent.isModified = false;
        } else if (this.currentReport === '' && (args.item.id === (this.parent.element.id + 'save') || args.item.id === (this.parent.element.id + 'saveas'))) {
            this.parent.pivotCommon.errorDialog.createErrorDialog(
                this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
            return;
        } else {
            this.dialogShow(args, 'saveAs');
        }
    }

    private mdxQueryDialog(args: ClickEventArgs): void {    /* eslint-disable-line */
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
        if (args) {
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
                }
            });
            (input as HTMLTextAreaElement).setSelectionRange(input.textContent.length, input.textContent.length);
            outerDiv.appendChild(label);
            outerDiv.appendChild(input);
            this.dialog.content = outerDiv;
            this.dialog.refresh();
            this.dialog.show();
        }
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
        let actionName: string = (args.item.id == this.parent.element.id + 'new') ? events.addNewReport : (args.item.id == this.parent.element.id + 'save') ? events.saveCurrentReport : (args.item.id == this.parent.element.id + 'saveas') ? events.saveAsCurrentReport
            : (args.item.id == this.parent.element.id + 'rename') ? events.renameCurrentReport : (args.item.id == this.parent.element.id + 'remove') ? events.removeCurrentReport : (args.item.id == this.parent.element.id + 'load') ? events.loadReports
                : (args.item.id == this.parent.element.id + 'formatting') ? events.openConditionalFormatting : (args.item.id == this.parent.element.id + 'numberFormatting') ? events.openNumberFormatting
                    : (args.item.id == this.parent.element.id + 'mdxQuery') ? events.MdxQuery : (args.item.id == this.parent.element.id + 'fieldlist') ? events.showFieldList : '';
        this.parent.actionObj.actionName = actionName;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        try {
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
                    this.newArgs = args;
                    if (this.parent.isModified && this.currentReport && this.currentReport !== '') {
                        this.createConfirmDialog(
                            this.parent.localeObj.getConstant('alert'),
                            this.parent.localeObj.getConstant('newReportConfirm'));
                    } else {
                        this.createNewReport(args);
                    }
                    break;
                case (this.parent.element.id + 'load'):
                    this.action = 'Load';
                    break;
                case (this.parent.element.id + 'fieldlist'):
                    if (this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.dialogRenderer) {
                        this.parent.pivotFieldListModule.dialogRenderer.onShowFieldList();
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
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private renderDialog(): void {
        if (select('#' + this.parent.element.id + 'report-dialog', document) !== null) {
            remove(select('#' + this.parent.element.id + 'report-dialog', document));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'report-dialog',
            className: cls.GRID_REPORT_DIALOG
        }));
        this.dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
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
            locale: this.parent.locale,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parent.element.id + 'report-dialog');
    }

    private renderMDXDialog(): void {
        if (select('#' + this.parent.element.id + 'mdx-dialog', document) !== null) {
            remove(select('#' + this.parent.element.id + 'mdx-dialog', document));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'mdx-dialog',
            className: cls.GRID_MDX_DIALOG
        }));
        this.mdxDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
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
            locale: this.parent.locale,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass
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
        if ((this.dialog.header === this.parent.localeObj.getConstant('save') ||
            this.dialog.header === this.parent.localeObj.getConstant('saveAs')) &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'Save';
            this.currentReport = reportInput.value;
            let isExist: boolean = false;
            /* eslint-disable */
            let _this: any = this;
            /* eslint-enable */
            let reports: FetchReportArgs = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
                for (let i: number = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === observedArgs.reportName[i]) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    _this.createConfirmDialog(
                        _this.parent.localeObj.getConstant('alert'),
                        _this.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                let saveArgs: SaveReportArgs = {
                    report: _this.parent.getPersistData(),
                    reportName: reportInput.value
                };
                let actionInfo: PivotActionInfo = {
                    reportName: reportInput.value
                }
                this.parent.actionObj.actionInfo = actionInfo;
                _this.parent.trigger(events.saveReport, saveArgs);
                _this.parent.isModified = false;
                _this.updateReportList();
                _this.dialog.hide();
            });
        } else if (this.dialog.header === this.parent.localeObj.getConstant('new') &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'New';
            this.currentReport = reportInput.value;
            let isExist: boolean = false;
            /* eslint-disable */
            let _this: any = this;
            /* eslint-enable */
            let reports: FetchReportArgs = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
                for (let i: number = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === reports.reportName[i]) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    _this.createConfirmDialog(
                        _this.parent.localeObj.getConstant('alert'),
                        _this.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                _this.parent.trigger(events.newReport);
                let saveArgs: SaveReportArgs = {
                    report: _this.parent.getPersistData(),
                    reportName: reportInput.value
                };
                let actionInfo: PivotActionInfo = {
                    reportName: reportInput.value
                }
                this.parent.actionObj.actionInfo = actionInfo;
                _this.parent.trigger(events.saveReport, saveArgs);
                _this.parent.isModified = false;
                _this.updateReportList();
                _this.dialog.hide();
            });
        } else if (this.dialog.header === this.parent.localeObj.getConstant('rename') && reportInput.value && reportInput.value !== '') {
            if (this.currentReport === reportInput.value) {
                this.dialog.hide();
                return;
            }
            this.action = 'Rename';
            let isExist: boolean = false;
            /* eslint-disable */
            let _this: any = this;
            /* eslint-enable */
            let reports: FetchReportArgs = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
                _this.renameText = reportInput.value;
                for (let i: number = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === observedArgs.reportName[i]) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    _this.createConfirmDialog(
                        _this.parent.localeObj.getConstant('alert'),
                        _this.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                let renameArgs: RenameReportArgs = {
                    reportName: _this.currentReport,
                    rename: reportInput.value
                };
                let actionInfo: PivotActionInfo = {
                    reportName: { oldName: _this.currentReport, newName: reportInput.value }
                }
                this.parent.actionObj.actionInfo = actionInfo;
                _this.parent.trigger(events.renameReport, renameArgs);
                _this.currentReport = reportInput.value;
                _this.updateReportList();
                _this.dialog.hide();
            });
        }
        this.parent.actionObj.actionName = this.parent.getActionCompleteName();
        if (this.parent.actionObj.actionName) {
            this.parent.actionCompleteMethod();
        }
    }

    private createNewReport(args?: ClickEventArgs): void {
        this.dialogShow(args);
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
            locale: this.parent.locale,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
            buttons: [
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('yes'), isPrimary: true,
                        cssClass: cls.OK_BUTTON_CLASS
                    },
                    click: this.okButtonClick.bind(this)
                },
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('no'),
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
            let actionInfo: PivotActionInfo = {
                reportName: this.currentReport
            }
            this.parent.actionObj.actionInfo = actionInfo;
            this.parent.trigger(events.removeReport, removeArgs);
            let reports: FetchReportArgs = this.fetchReports();
            if (reports.reportName && reports.reportName.length > 0) {
                let loadArgs: LoadReportArgs = {
                    reportName: reports.reportName[reports.reportName.length - 1]
                };
                this.parent.trigger(events.loadReport, loadArgs, (observedArgs: LoadReportArgs) => {
                    this.currentReport = observedArgs.reportName;
                    this.parent.isModified = false;
                });
                this.currentReport = reports.reportName[reports.reportName.length - 1];
            } else {
                this.currentReport = '';
                this.parent.isModified = false;
                this.action = '';
            }
            this.updateReportList();
            this.parent.actionObj.actionName = events.reportRemoved;
            if (this.parent.actionObj.actionName) {
                this.parent.actionCompleteMethod();
            }
        } else if (this.action === 'New' || (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New')) {
            if (this.currentReport && this.currentReport !== '' && this.parent.isModified) {
                let saveArgs: SaveReportArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                let actionInfo: PivotActionInfo = {
                    reportName: this.currentReport
                }
                this.parent.actionObj.actionInfo = actionInfo;
                this.parent.actionObj.actionName = events.reportSaved;
                if (this.parent.actionObj.actionName) {
                    this.parent.actionCompleteMethod();
                }
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                if (this.action === 'New') {
                    this.parent.actionObj.actionName = events.addNewReport;
                    this.createNewReport(this.newArgs);
                } else {
                    this.parent.actionObj.actionName = events.reportChange;
                    this.reportLoad(this.dropArgs);
                }
            } else if (this.action === 'New') {
                this.parent.trigger(events.newReport);
                let saveArgs: SaveReportArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                this.updateReportList();
                this.dialog.hide();
            }
        } else if (this.action === 'Save') {
            let saveArgs: SaveReportArgs = {
                report: this.parent.getPersistData(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
            this.updateReportList();
            this.dialog.hide();
        } else if (this.action === 'Rename') {
            let renameArgs: RenameReportArgs = {
                reportName: this.currentReport,
                rename: this.renameText,
                isReportExists: true
            };
            this.parent.trigger(events.renameReport, renameArgs);
            this.currentReport = this.renameText;
            this.parent.isModified = false;
            this.updateReportList();
            this.dialog.hide();
        }
        this.confirmPopUp.hide();
    }

    private cancelButtonClick(): void {
        if (this.action === 'New') {
            if (this.parent.isModified) {
                this.createNewReport(this.newArgs);
            } else {
                this.dialog.hide();
            }
        } else if (this.action === 'Save') {
            this.currentReport = this.reportList.value as string;
            this.dialog.hide();
        } else if (this.action === 'Rename') {
            this.dialog.hide();
        } else if (this.dropArgs && this.action !== 'Remove') {
            this.reportLoad(this.dropArgs);
        }
        this.confirmPopUp.hide();
    }
    /* eslint-disable-next-line */
    /**
     * @hidden
     */
    public createChartMenu(): void {
        if (select('#' + this.parent.element.id + 'chart_menu', document)) {
            let menuItems: MenuItemModel[] = [];
            let types: ChartSeriesType[] = this.getValidChartType();
            for (let i: number = 0; (i < types.length && i < 7); i++) {
                let type: ChartSeriesType = types[i];
                menuItems.push({
                    text: this.parent.localeObj.getConstant(type.toLowerCase()),
                    id: this.parent.element.id + '_' + type
                });
            }
            if (menuItems.length === 7) {
                menuItems.splice(6);
                menuItems.push({
                    text: this.parent.localeObj.getConstant('MoreOption'),
                    id: this.parent.element.id + '_' + 'ChartMoreOption'
                });
            }
            let toDisable: boolean = (menuItems.length <= 0 || this.parent.displayOption.view === 'Table');
            menuItems.push({
                separator: true
            });
            menuItems.push({
                text: this.parent.localeObj.getConstant('multipleAxes'),
                id: this.parent.element.id + '_' + 'multipleAxes'
            });
            menuItems.push({
                text: this.parent.localeObj.getConstant('showLegend'),
                id: this.parent.element.id + '_' + 'showLegend'
            });
            let menu: MenuItemModel[] = [{
                iconCss: cls.TOOLBAR_CHART + ' ' + cls.ICON,
                items: toDisable ? [] : menuItems
            }];
            if (this.chartMenu && !this.chartMenu.isDestroyed) {
                this.chartMenu.destroy();
            }
            this.chartMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this),
                    beforeOpen: this.whitespaceRemove.bind(this),
                    onClose: (args: OpenCloseMenuEventArgs) => {    /* eslint-disable-line */
                        this.focusToolBar();
                    },
                    beforeItemRender: this.multipleAxesCheckbox.bind(this)
                });
            this.chartMenu.isStringTemplate = true;
            this.chartMenu.appendTo('#' + this.parent.element.id + 'chart_menu');
        }
    }
    /* eslint-disable  */
    private create(): void {
        if (select('#' + this.parent.element.id + 'chart_menu', this.parent.element)) {
            this.createChartMenu();
        }
        if (select('#' + this.parent.element.id + 'export_menu', this.parent.element)) {
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
                    locale: this.parent.locale,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateExportMenu.bind(this),
                    onClose: (args: OpenCloseMenuEventArgs) => {
                        this.focusToolBar();
                    }
                });
            this.exportMenu.isStringTemplate = true;
            this.exportMenu.appendTo('#' + this.parent.element.id + 'export_menu');
        }
        if (select('#' + this.parent.element.id + 'subtotal_menu', this.parent.element)) {
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
                    locale: this.parent.locale,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateSubtotalSelection.bind(this),
                    onClose: (args: OpenCloseMenuEventArgs) => {
                        this.focusToolBar();
                    }
                });
            this.subTotalMenu.isStringTemplate = true;
            this.subTotalMenu.appendTo('#' + this.parent.element.id + 'subtotal_menu');
        }
        if (select('#' + this.parent.element.id + 'grandtotal_menu', this.parent.element)) {
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
                    {
                        separator: true
                    },
                    {
                        text: this.parent.localeObj.getConstant('grandTotalPosition'),
                        id: this.parent.element.id + 'grandtotalpositions',
                        iconCss: cls.PIVOT_DISABLE_ICON + ' ' + cls.ICON,
                        items: [
                            {
                                text: this.parent.localeObj.getConstant('top'),
                                id: this.parent.element.id + 'top-position',
                                iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                            },
                            {
                                text: this.parent.localeObj.getConstant('bottom'),
                                id: this.parent.element.id + 'bottom-position',
                                iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                            },
                        ]
                    }
                ]
            }];
            this.grandTotalMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateGrandtotalSelection.bind(this),
                    onClose: (args: OpenCloseMenuEventArgs) => {
                        this.focusToolBar();
                    }
                });
            this.grandTotalMenu.isStringTemplate = true;
            this.grandTotalMenu.appendTo('#' + this.parent.element.id + 'grandtotal_menu');
        }
        if (select('#' + this.parent.element.id + 'formatting_menu', this.parent.element)) {
            let menu: MenuItemModel[] = [{
                iconCss: cls.FORMATTING_MENU + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('numberFormatMenu'),
                        iconCss: cls.NUMBER_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'numberFormattingMenu'
                    },
                    {
                        text: this.parent.localeObj.getConstant('conditionalFormatingMenu'),
                        iconCss: cls.CONDITIONAL_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'conditionalFormattingMenu'
                    }
                ]
            }];
            this.formattingMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this)
                });
            this.formattingMenu.isStringTemplate = true;
            this.formattingMenu.appendTo('#' + this.parent.element.id + 'formatting_menu');
        }
        if (select('#' + this.parent.element.id + '_reportlist', this.parent.element)) {
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
                locale: this.parent.locale,
                cssClass: cls.REPORT_LIST_DROP + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                select: this.reportChange.bind(this),
                value: this.currentReport
            });
            this.reportList.isStringTemplate = true;
            this.reportList.appendTo('#' + this.parent.element.id + '_reportlist');
        }
        this.updateItemElements();
    }
    private updateItemElements(): void {
        let itemElements: HTMLElement[] = [].slice.call(this.toolbar.element.querySelectorAll('.e-toolbar-item'));
        for (let element of itemElements) {
            if (element.querySelector('button')) {
                element.querySelector('button').setAttribute('tabindex', '0');
            } else if (element.querySelector('.e-menu.e-menu-parent')) {
                element.querySelector('.e-menu.e-menu-parent').setAttribute('tabindex', '-1');
                if (element.querySelector('.e-menu-item.e-menu-caret-icon')) {
                    element.querySelector('.e-menu-item.e-menu-caret-icon').setAttribute('tabindex', '0');
                }
            }
        }
    }
    private whitespaceRemove(args: BeforeOpenCloseMenuEventArgs): void {
        args.element.style.padding = '0px';
        let separator: HTMLElement = args.element.querySelector('.e-separator');
        if (separator) {
            separator.style.margin = '0px';
        }
    }
    private multipleAxesCheckbox(args: MenuEventArgs): void {
        if (this.parent.element.id + '_' + 'multipleAxes' === args.element.id) {
            let inputCheckbox: HTMLElement = createElement('input', {
                id: this.parent.element.id + '_' + 'checkBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            let checkbox: CheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('multipleAxes'),
                cssClass: 'e-multipleAxes',
                checked: this.parent.chartSettings.enableMultipleAxis,
                change: (args: StateChange) => {
                    document.getElementById(this.parent.element.id + '_' + 'multipleAxes').click();
                },
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'checkBox');
            if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) &&
                !args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.add(cls.MENU_DISABLE);
                checkbox.disabled = true;
            } else if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) < 0) &&
                args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.remove(cls.MENU_DISABLE);
                checkbox.disabled = false;
            }
            let checkboxObj: HTMLElement = this.parent.element.querySelector('.e-checkbox-wrapper.e-multipleAxes');
            args.element.appendChild(checkboxObj);
        } else if (this.parent.element.id + '_' + 'showLegend' === args.element.id) {
            let inputCheckbox: HTMLElement = createElement('input', {
                id: this.parent.element.id + '_' + 'showLegendCheckBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            let checkbox: CheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('showLegend'),
                checked: this.getLableState(this.parent.chartSettings.chartSeries.type),
                cssClass: 'e-showLegend',
                change: (args: StateChange) => {
                    document.getElementById(this.parent.element.id + '_' + 'showLegend').click();
                },
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'showLegendCheckBox');
            let checkboxObj: HTMLElement = this.parent.element.querySelector('.e-checkbox-wrapper.e-showLegend');
            args.element.appendChild(checkboxObj);
        }
    }

    private getLableState(type: string): boolean {
        let chartSettings: ChartSettingsModel = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.showLableState = chartSettings.legendSettings.visible;
        } else {
            this.showLableState = ['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1 ?
                false : true;
        }
        return this.showLableState;
    }
    private getAllChartItems(): string[] {
        return ['Line', 'Column', 'Area', 'Bar', 'StackingColumn', 'StackingArea', 'StackingBar','StackingLine', 'StepLine', 'StepArea',
            'SplineArea', 'Scatter', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'StackingLine100','Bubble', 'Pareto',
            'Polar', 'Radar', 'Pie', 'Pyramid', 'Funnel', 'Doughnut'] as ChartSeriesType[];
    }
    private updateExportMenu(args: BeforeOpenCloseMenuEventArgs): void {
        let items: HTMLElement[] = [].slice.call(args.element.querySelectorAll('li'));
        if (this.parent.currentView === 'Table') {
            addClass(items.slice(3), cls.MENU_HIDE);
            removeClass(items.slice(1, 3), cls.MENU_HIDE);
        } else {
            addClass(items.slice(1, 3), cls.MENU_HIDE);
            removeClass(items.slice(3), cls.MENU_HIDE);
        }
    }
    private updateSubtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!select('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            select('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!select('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            select('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!select('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            select('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!select('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            select('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals) {
            select('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showSubTotals && !this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            select('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            select('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
        } else if (!this.parent.dataSourceSettings.showSubTotals || (!this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals)) {
            select('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
    }
    private updateGrandtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!(args.parentItem.id == this.parent.element.id + 'grandtotalpositions')) {
            if (!select('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
                select('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            }
            if (!select('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
                select('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            }
            if (!select('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
                select('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            }
            if (!select('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.contains(cls.PIVOT_DISABLE_ICON)) {
                select('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            }
            if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showGrandTotals && !this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (!this.parent.dataSourceSettings.showGrandTotals || (!this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals)) {
                select('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        }
        else {
            select('#' + this.parent.element.id + 'top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.grandTotalsPosition == 'Top') {
                select('#' + this.parent.element.id + 'top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
            select('#' + this.parent.element.id + 'bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.grandTotalsPosition == 'Bottom') {
                select('#' + this.parent.element.id + 'bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        }
    }
    /* eslint-enable max-len */
    private updateReportList(): void {
        let reports: FetchReportArgs;
        reports = this.fetchReports();
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
    /* eslint-disable  */
    private menuItemClick(args: ClickEventArgs): void {
        let exportArgs: BeforeExportEventArgs = {};
        let type: string;
        let actionName: string = (args.item.id == this.parent.element.id + 'grid') ? events.tableView : (args.item.id == this.parent.element.id + '_' + "Column") ? events.chartView : (args.item.id == this.parent.element.id + '_' + "Bar") ? events.chartView : (args.item.id == this.parent.element.id + '_' + "Line") ? events.chartView
            : (args.item.id == this.parent.element.id + '_' + "Area") ? events.chartView : (args.item.id == this.parent.element.id + '_' + "Scatter") ? events.chartView : (args.item.id == this.parent.element.id + '_' + "Polar") ? events.chartView : (args.item.id == this.parent.element.id + '_' + "ChartMoreOption") ? events.chartView
                : (args.item.id == this.parent.element.id + '_' + "multipleAxes") ? events.multipleAxis : (args.item.id == this.parent.element.id + '_' + "showLegend") ? events.showLegend : (args.item.id == this.parent.element.id + "pdf") ? events.pdfExport : (args.item.id == this.parent.element.id + "png") ? events.pngExport
                    : (args.item.id == this.parent.element.id + "excel") ? events.excelExport : (args.item.id == this.parent.element.id + "csv") ? events.csvExport : (args.item.id == this.parent.element.id + "jpeg") ? events.jpegExport : (args.item.id == this.parent.element.id + "svg") ? events.svgExport
                        : (args.item.id == this.parent.element.id + "notsubtotal") ? events.hideSubTotals : (args.item.id == this.parent.element.id + "subtotalrow") ? events.subTotalsRow : (args.item.id == this.parent.element.id + "subtotalcolumn") ? events.subTotalsColumn
                            : (args.item.id == this.parent.element.id + "subtotal") ? events.showSubTotals : (args.item.id == this.parent.element.id + "notgrandtotal") ? events.hideGrandTotals : (args.item.id == this.parent.element.id + "grandtotalrow") ? events.grandTotalsRow
                                : (args.item.id == this.parent.element.id + "grandtotalcolumn") ? events.grandTotalsColumn : (args.item.id == this.parent.element.id + "grandtotal") ? events.showGrandTotals
                                    : (args.item.id == this.parent.element.id + "numberFormattingMenu") ? events.numberFormattingMenu : (args.item.id == this.parent.element.id + "conditionalFormattingMenu") ? events.conditionalFormattingMenu : '';
        this.parent.actionObj.actionName = actionName;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        if (this.getAllChartItems().indexOf(args.item.id.split(this.parent.element.id + '_')[1]) > -1 ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'ChartMoreOption') ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'multipleAxes') ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'showLegend')) {
            type = args.item.id.split(this.parent.element.id + '_')[1];
        }
        try {
            switch (args.item.id) {
                case (this.parent.element.id + 'grid'):
                    if (this.parent.grid && this.parent.chart) {
                        this.parent.grid.element.style.display = '';
                        this.parent.chart.element.style.display = 'none';
                        if (this.parent.chartSettings.enableMultipleAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                            (this.parent.element.querySelector('.e-pivotchart') as HTMLElement).style.display = 'none';
                        }
                        this.parent.currentView = 'Table';
                        this.parent.setProperties({ displayOption: { primary: 'Table' } }, true);
                        if (this.parent.showGroupingBar && this.parent.groupingBarModule) {
                            (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = '';
                            (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = 'none';
                        }
                        let actionInfo: PivotActionInfo = {
                            toolbarInfo: { displayOption: this.parent.displayOption as DisplayOption, gridSettings: this.parent.gridSettings as GridSettings }
                        }
                        this.parent.actionObj.actionInfo = actionInfo;
                        this.parent.layoutRefresh();
                    }
                    break;
                case (this.parent.element.id + 'pdf'):
                    if (this.parent.currentView === 'Table') {
                        exportArgs = {
                            pdfExportProperties: { fileName: 'Export.pdf' },
                            pdfDoc: undefined,
                            isBlob: false,
                            isMultipleExport: false
                        };
                        this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                            this.parent.pdfExport(observedArgs.pdfExportProperties, observedArgs.isMultipleExport, observedArgs.pdfDoc, observedArgs.isBlob);
                        });
                    } else {
                        exportArgs = {
                            width: undefined,
                            height: undefined,
                            orientation: PdfPageOrientation.Landscape,
                            type: 'PDF',
                            fileName: 'result',
                        };
                        this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                            this.parent.chartExport(observedArgs.type, observedArgs.fileName, observedArgs.orientation, observedArgs.width, observedArgs.height);
                        });
                    }
                    break;
                case (this.parent.element.id + 'excel'):
                    exportArgs = {
                        excelExportProperties: { fileName: 'Export.xlsx' },
                        isBlob: undefined,
                        isMultipleExport: undefined,
                        workbook: undefined
                    };
                    this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                        this.parent.excelExport(observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob);
                    });
                    break;
                case (this.parent.element.id + 'csv'):
                    exportArgs = {
                        excelExportProperties: { fileName: 'Export.csv' },
                        isBlob: false,
                        isMultipleExport: false,
                        workbook: undefined
                    };
                    this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                        this.parent.csvExport(observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob);
                    });
                    break;
                case (this.parent.element.id + 'png'):
                    exportArgs = {
                        type: 'PNG',
                        width: undefined,
                        height: undefined,
                        fileName: 'result',
                        orientation: PdfPageOrientation.Landscape,
                    };
                    this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                        this.parent.chartExport(observedArgs.type, observedArgs.fileName, observedArgs.orientation, observedArgs.width, observedArgs.height);
                    });
                    break;
                case (this.parent.element.id + 'jpeg'):
                    exportArgs = {
                        type: 'JPEG',
                        fileName: 'result',
                        orientation: PdfPageOrientation.Landscape,
                        width: undefined,
                        height: undefined,
                    };
                    this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                        this.parent.chartExport(observedArgs.type, observedArgs.fileName, observedArgs.orientation, observedArgs.width, observedArgs.height);
                    });
                    break;
                case (this.parent.element.id + 'svg'):
                    exportArgs = {
                        width: undefined,
                        height: undefined,
                        type: 'SVG',
                        fileName: 'result',
                        orientation: PdfPageOrientation.Landscape,
                    };
                    this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                        this.parent.chartExport(observedArgs.type, observedArgs.fileName, observedArgs.orientation, observedArgs.width, observedArgs.height);
                    });
                    break;
                case (this.parent.element.id + 'notsubtotal'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showSubTotals: false, showColumnSubTotals: false, showRowSubTotals: false } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'subtotalrow'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showSubTotals: true, showColumnSubTotals: false, showRowSubTotals: true } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'subtotalcolumn'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showSubTotals: true, showColumnSubTotals: true, showRowSubTotals: false } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'subtotal'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showSubTotals: true, showColumnSubTotals: true, showRowSubTotals: true } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'notgrandtotal'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showGrandTotals: false, showColumnGrandTotals: false, showRowGrandTotals: false } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'grandtotalrow'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: false, showRowGrandTotals: true } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'grandtotalcolumn'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: true, showRowGrandTotals: false } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'grandtotal'):
                    this.parent.setProperties(
                        { dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: true, showRowGrandTotals: true } },
                        true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'top-position'):
                    this.parent.setProperties(
                        { dataSourceSettings: { grandTotalsPosition: 'Top' } }, true);
                    this.parent.refreshData();
                    break;
                case (this.parent.element.id + 'bottom-position'):
                    this.parent.setProperties(
                        { dataSourceSettings: { grandTotalsPosition: 'Bottom' } }, true);
                    this.parent.refreshData();
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
                case (this.parent.element.id + '_' + type):
                    if (args.item && args.item.text) {
                        if (type === 'ChartMoreOption') {
                            this.createChartTypeDialog();
                        } else if (type === 'multipleAxes') {
                            if (this.parent.chartSettings.enableScrollOnMultiAxis) {
                                this.isMultiAxisChange = true;
                            }
                            this.parent.chartSettings.enableMultipleAxis = !this.parent.chartSettings.enableMultipleAxis;
                            this.updateChartType(this.parent.chartSettings.chartSeries.type, true);
                        } else if (this.getAllChartItems().indexOf(type) > -1) {
                            this.updateChartType(type as ChartSeriesType, false);
                        } else if (type === 'showLegend') {
                            this.parent.chart.legendSettings.visible = !this.showLableState;
                            if (this.parent.chartSettings.legendSettings) {
                                this.parent.chartSettings.legendSettings.visible = !this.showLableState;
                            } else {
                                this.parent.setProperties({ chartSettings: { legendSettings: { visible: !this.showLableState } } }, true);
                            }
                            this.updateChartType(this.parent.chartSettings.chartSeries.type, true);
                        }
                    }
                    break;
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
        /* eslint-enable max-len */
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initToolbar, this.createToolbar, this);
    }

    private getValidChartType(): ChartSeriesType[] {
        let menuItems: ChartSeriesType[] = [];
        for (let i: number = 0; (i <= this.parent.chartTypes.length); i++) {
            let type: ChartSeriesType = this.parent.chartTypes[i];
            if ((this.getAllChartItems().indexOf(type) > -1) && (menuItems.indexOf(type) < 0)) {
                menuItems.push(type);
            }
        }
        return menuItems;
    }
    private createChartTypeDialog(): void {
        let chartDialog: HTMLElement = this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + '_ChartTypeDialog',
            className: cls.PIVOTCHART_TYPE_DIALOG
        }));
        this.chartTypesDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('chartTypeSettings'),
            content: this.getDialogContent(),
            isModal: true,
            beforeOpen: this.beforeOpen.bind(this),
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: () => { this.chartTypeDialogUpdate(); },
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true },
                },
                {
                    click: () => { this.removeDialog(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parent.element,
            cssClass: this.parent.cssClass,
            close: this.removeDialog.bind(this)
        });
        this.chartTypesDialog.isStringTemplate = true;
        this.chartTypesDialog.appendTo(chartDialog);
    }
    private removeDialog(): void {
        if (this.chartTypesDialog && !this.chartTypesDialog.isDestroyed) { this.chartTypesDialog.destroy(); }
        if (document.getElementById(this.parent.element.id + '_ChartTypeDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ChartTypeDialog'));
        }
    }
    private chartTypeDialogUpdate(): void {
        let chartType: ChartSeriesType = (getInstance(select('#' + this.parent.element.id + '_ChartTypeOption'), DropDownList) as DropDownList).value as ChartSeriesType;
        let checked: boolean = (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox).checked;
        let checkedShow: boolean = (getInstance(select('#' + this.parent.element.id + '_DialogShowLabel'), CheckBox) as CheckBox).checked;
        this.parent.chart.legendSettings.visible = checkedShow;
        if (this.chartLableState) {
            this.parent.chart.legendSettings.visible = checkedShow;
            if (this.parent.chartSettings.legendSettings) {
                this.parent.chartSettings.legendSettings.visible = checkedShow;
            } else {
                this.parent.setProperties({ chartSettings: { legendSettings: { visible: checkedShow } } }, true);
            }
        }
        this.updateChartType(chartType, false);
        this.parent.chartSettings.enableMultipleAxis = checked;
        this.parent.chartSettings.multipleAxisMode = (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).value as MultipleAxisMode;
        this.chartTypesDialog.close();
    }
    private updateChartType(type: ChartSeriesType, isMultiAxis: boolean): void {
        if (this.getAllChartItems().indexOf(type) > -1) {
            if (this.parent.chart) {
                this.parent.currentView = 'Chart';
                this.parent.setProperties({ displayOption: { primary: 'Chart' } }, true);
                if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis) {
                    (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.width = formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber()); /* eslint-disable-line */
                }
                this.parent.chart.setProperties({ width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber()) }, true);   /* eslint-disable-line */
                if (this.parent.chartSettings.chartSeries.type === type && !isMultiAxis) {
                    this.parent.chart.refresh();
                } else {
                    this.parent.chartSettings.chartSeries.type = type;
                }
                let actionInfo: PivotActionInfo = {
                    toolbarInfo: { displayOption: this.parent.displayOption as DisplayOption, chartSettings: this.parent.chartSettings as ChartSettings }
                }
                this.parent.actionObj.actionInfo = actionInfo;
            }
        }
    }
    private getDialogContent(): HTMLElement {
        let mainWrapper: HTMLElement = createElement('div', { className: 'e-chart-type-div-content' });
        let optionWrapperDiv: HTMLElement = createElement('div', { className: 'e-chart-type-option-container' });
        let axisModeWrapperDiv: HTMLElement = createElement('div', { className: 'e-multiple-axes-mode-container' });
        let optionTextDiv: HTMLElement = createElement('div', {
            className: 'e-chart-type-option-text', innerHTML: this.parent.localeObj.getConstant('ChartType')
        });
        let axisModeTextDiv: HTMLElement = createElement('div', {
            className: 'e-multiple-axes-mode-text', innerHTML: this.parent.localeObj.getConstant('multipleAxisMode')
        });
        let dropOptionDiv: HTMLElement = createElement('div', { id: this.parent.element.id + '_ChartTypeOption' });
        let dropModeOptionDiv: HTMLElement = createElement('div', { id: this.parent.element.id + '_AxisModeOption' });
        optionWrapperDiv.appendChild(optionTextDiv);
        optionWrapperDiv.appendChild(dropOptionDiv);
        let chartTypeDatasource: { [key: string]: Object }[] = [];
        let multipleAxisModeDatasource: { [key: string]: Object }[] = [
            { value: 'Stacked', text: this.parent.localeObj.getConstant('stacked') },
            { value: 'Single', text: this.parent.localeObj.getConstant('single') }];
        let chartType: ChartSeriesType[] = this.getValidChartType();
        for (let i: number = 0; i < chartType.length; i++) {
            chartTypeDatasource.push({ value: chartType[i], text: this.parent.localeObj.getConstant(chartType[i].toLowerCase()) });
        }
        let optionWrapper: DropDownList = new DropDownList({
            dataSource: chartTypeDatasource, enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: this.parent.chartSettings.chartSeries.type ? this.parent.chartSettings.chartSeries.type : this.getValidChartType()[0],
            width: '100%',
            change: this.changeDropDown.bind(this),
            cssClass: this.parent.cssClass
        });
        optionWrapper.isStringTemplate = true;
        optionWrapper.appendTo(dropOptionDiv);
        mainWrapper.appendChild(optionWrapperDiv);
        let checkboxWrap: HTMLInputElement = createElement('input', {
            id: this.parent.element.id + '_DialogMultipleAxis',
            attrs: { 'type': 'checkbox' }
        }) as HTMLInputElement;
        mainWrapper.appendChild(checkboxWrap);
        let labelCheckboxWrap: HTMLInputElement = createElement('input', {
            id: this.parent.element.id + '_DialogShowLabel',
            attrs: { 'type': 'checkbox' }
        }) as HTMLInputElement;
        mainWrapper.appendChild(labelCheckboxWrap);
        axisModeWrapperDiv.appendChild(axisModeTextDiv);
        axisModeWrapperDiv.appendChild(dropModeOptionDiv);
        mainWrapper.appendChild(axisModeWrapperDiv);
        let axisModeWrapper: DropDownList = new DropDownList({
            dataSource: multipleAxisModeDatasource, enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: this.parent.chartSettings.multipleAxisMode ? this.parent.chartSettings.multipleAxisMode : 'Stacked',
            width: '100%',
            enabled: this.parent.chartSettings.enableMultipleAxis,
            cssClass: this.parent.cssClass
        });
        axisModeWrapper.isStringTemplate = true;
        axisModeWrapper.appendTo(dropModeOptionDiv);
        return mainWrapper;
    }
    private changeDropDown(args: ChangeEventArgs): void {
        let chartSettings: ChartSettingsModel = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (!(chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined)) {
            let checked: boolean = ['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(args.value.toString()) > -1 ?
                false : true;
            (getInstance(select('#' + this.parent.element.id + '_DialogShowLabel'), CheckBox) as CheckBox).checked = checked;
        }
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(args.value.toString()) > -1) {
            (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox).disabled = true;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = false;
        } else {
            let multipleAxisCheckBox: CheckBox = (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox);
            multipleAxisCheckBox.disabled = false;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = multipleAxisCheckBox.checked;
        }
    }

    private beforeOpen(): void {
        let checkbox: CheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('multipleAxes'),
            cssClass: 'e-dialog-multiple-axis',
            checked: this.parent.chartSettings.enableMultipleAxis ? this.parent.chartSettings.enableMultipleAxis : false,
            change: (args: StateChange) => {
                (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = args.checked;
            },
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale
        });
        let checkbox1: CheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('showLegend'),
            checked: this.getLableState(this.parent.chartSettings.chartSeries.type),
            change: () => { this.chartLableState = true; },
            cssClass: 'e-dialog-show-legend',
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale
        });
        checkbox1.appendTo(select('#' + this.parent.element.id + '_DialogShowLabel', this.chartTypesDialog.element) as HTMLElement);
        checkbox.appendTo(select('#' + this.parent.element.id + '_DialogMultipleAxis', this.chartTypesDialog.element) as HTMLElement);
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) {
            checkbox.disabled = true;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = false;
        }
        let chartSettings: ChartSettingsModel = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.chartLableState = true;
        } else {
            this.chartLableState = false;
        }
    }
    /**
     * To refresh the toolbar 
     * @returns {void}
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
     * @returns {void}
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
        if (this.chartTypesDialog && !this.chartTypesDialog.isDestroyed) {
            this.chartTypesDialog.destroy();
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
        if (select('#' + this.parent.element.id + 'pivot-toolbar', document)) {
            remove(select('#' + this.parent.element.id + 'pivot-toolbar', document));
        }
    }

    private focusToolBar(): void {
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-focused'), 'e-focused');
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-selected'), 'e-selected');
        if (document.querySelector('.e-toolbar-items')) {
            addClass([document.querySelector('.e-toolbar-items')], 'e-focused');
        }
    }
}