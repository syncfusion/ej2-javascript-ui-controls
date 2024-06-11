import { Toolbar as tool, ClickEventArgs, MenuItemModel, Menu } from '@syncfusion/ej2-navigations';
import { ItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { remove, createElement, formatUnit, getInstance, addClass, removeClass, select, SanitizeHtmlHelper, setValue } from '@syncfusion/ej2-base';
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
import { ChartSettingsModel } from '../../pivotview/model/chartsettings-model';
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
    /** @hidden */
    public isReportChange: boolean = false;

    private parent: PivotView;
    private currentReport: string = '';
    private dropArgs: ChangeEventArgs;
    private newArgs: ClickEventArgs;
    private renameText: string;
    private showLableState: boolean;
    private chartLableState: boolean;

    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.toolbarModule = this;
        this.addEventListener();
    }

    /**
     * It returns the Module name.
     *
     * @returns {string} - string
     * @hidden
     */
    public getModuleName(): string {
        return 'toolbar';
    }

    private createToolbar(): void {
        this.parent.isModified = false;
        this.renderDialog();
        if (select('#' + this.parent.element.id + 'pivot-toolbar', this.parent.element) !== null) {
            remove(select('#' + this.parent.element.id + 'pivot-toolbar', this.parent.element));
        }
        const element: HTMLElement = createElement( 'div', {
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            items: this.getItems(),
            allowKeyboard: false,
            cssClass: this.parent.cssClass,
            width: !this.parent.gridSettings.allowAutoResizing ? (this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2)) : 'auto'
        });
        this.toolbar.isStringTemplate = true;
        const viewStr: string = 'viewContainerRef';
        const registerTemp: string = 'registeredTemplate';
        const registeredTemplate: Object = {};
        if ((this.parent)[viewStr as keyof PivotView]) {
            setValue(registerTemp, registeredTemplate, this.toolbar);
            (this.toolbar)[viewStr as keyof Object] = (this.parent)[viewStr as keyof PivotView];
        }
        if (this.parent.toolbarTemplate && typeof (this.parent.toolbarTemplate) === 'string') {
            this.toolbar.appendTo(this.parent.toolbarTemplate);
            this.parent.element.replaceChild(this.toolbar.element, this.parent.element.querySelector('.' + cls.GRID_TOOLBAR));
            this.toolbar.element.classList.add(cls.GRID_TOOLBAR);
        } else {
            this.toolbar.appendTo('#' + this.parent.element.id + 'pivot-toolbar');
        }
        this.toolbar.width = this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber();
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
        const reports: { [key: string]: Object } = { reportName: [] };
        this.parent.trigger(events.fetchReport, reports);
        return reports;
    }

    private fetchReportsArgs(): FetchReportArgs | Deferred {
        const callbackPromise: Deferred = new Deferred();
        const reports: FetchReportArgs = { reportName: [] };
        this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
            callbackPromise.resolve(observedArgs);
        });
        return callbackPromise;
    }

    private getItems(): ItemModel[] {
        const toolbar: ToolbarItems[] = (this.parent.toolbar as ToolbarItems[]).filter(
            (v: ToolbarItems, i: number, a: ToolbarItems[]) => a.indexOf(v) === i);
        const items: ItemModel[] = [];
        for (const item of toolbar) {
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
                {
                    const toDisable: boolean = this.parent.displayOption.view === 'Chart';
                    items.push({
                        prefixIcon: cls.TOOLBAR_GRID + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('grid'),
                        id: this.parent.element.id + 'grid', cssClass: (toDisable ? cls.MENU_DISABLE : '') + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                        click: this.menuItemClick.bind(this)
                    });
                }
                break;
            case 'Chart':
                {
                    const validTypes: boolean = (this.parent.displayOption.view === 'Table');
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'chart_menu"></ul>',
                        id: this.parent.element.id + 'chartmenu', cssClass: (validTypes ? cls.MENU_DISABLE : '') + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '')
                    });
                }
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
        const toolbarArgs: ToolbarArgs = { customToolbar: items };
        this.parent.trigger(events.toolbarRender, toolbarArgs);
        return items;
    }

    private reportChange(args: ChangeEventArgs): void {
        this.parent.actionObj.actionName = events.reportChange;
        this.isReportChange = true;
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
            const loadArgs: LoadReportArgs = {
                reportName: args.itemData.value as string
            };
            const actionInfo: PivotActionInfo = {
                reportName: args.itemData.value as string
            };
            this.parent.actionObj.actionInfo = actionInfo;
            this.parent.trigger(events.loadReport, loadArgs, (observedArgs: LoadReportArgs) => {
                this.currentReport = observedArgs.reportName;
                this.parent.isModified = false;
            });
        }
    }

    private saveReport(args: ClickEventArgs): void {
        if (this.currentReport && this.currentReport !== '' && args.item.id === (this.parent.element.id + 'save')) {
            const saveArgs: SaveReportArgs = {
                report: this.getCurrentReport(),
                reportName: this.currentReport
            };
            this.parent.actionObj.actionName = this.parent.getActionCompleteName();
            const actionInfo: PivotActionInfo = {
                reportName: this.currentReport
            };
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

    private mdxQueryDialog(): void {
        if (!select('#' + this.parent.element.id + 'mdx-dialog', document)) {
            this.renderMDXDialog();
        }
        const mdxDialog: Dialog = getInstance(select('#' + this.parent.element.id + 'mdx-dialog', document), Dialog) as Dialog;
        const outerDiv: HTMLElement = createElement('div', {
            className: cls.MDX_QUERY
        });
        const textarea: HTMLElement = createElement('textarea', {
            className: cls.MDX_QUERY_CONTENT,
            attrs: { 'readonly': 'readonly', 'aria-label': this.parent.localeObj.getConstant('mdxQuery') }
        });
        textarea.innerText = this.parent.olapEngineModule.getMDXQuery(this.parent.dataSourceSettings).trim();
        outerDiv.appendChild(textarea);
        mdxDialog.content = outerDiv;
        mdxDialog.show();
    }

    private dialogShow(args: ClickEventArgs, action?: string): void {
        if (args) {
            const dialog: Dialog = getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog;
            dialog.header = args.item.tooltipText;
            const outerDiv: HTMLElement = createElement('div', {
                className: cls.GRID_REPORT_OUTER
            });
            const label: HTMLElement = createElement('div', {
                className: cls.GRID_REPORT_LABEL
            });
            label.innerText = this.parent.localeObj.getConstant('reportName');
            const input: HTMLElement = createElement('input', {
                className: cls.GRID_REPORT_INPUT + ' ' + cls.INPUT,
                attrs: {
                    'placeholder': this.parent.localeObj.getConstant('emptyReportName'),
                    'value': (action && action === 'rename' ? this.currentReport : '')
                }
            });
            input.innerText = (action && action === 'rename' ? this.currentReport : '');
            (input as HTMLTextAreaElement).setSelectionRange(input.textContent.length, input.textContent.length);
            outerDiv.appendChild(label);
            outerDiv.appendChild(input);
            dialog.content = outerDiv;
            dialog.refresh();
            dialog.show();
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
        const actionName: string = (args.item.id === this.parent.element.id + 'new') ? events.addNewReport : (args.item.id === this.parent.element.id + 'save') ? events.saveCurrentReport : (args.item.id === this.parent.element.id + 'saveas') ? events.saveAsCurrentReport
            : (args.item.id === this.parent.element.id + 'rename') ? events.renameCurrentReport : (args.item.id === this.parent.element.id + 'remove') ? events.removeCurrentReport : (args.item.id === this.parent.element.id + 'load') ? events.loadReports
                : (args.item.id === this.parent.element.id + 'formatting') ? events.openConditionalFormatting : (args.item.id === this.parent.element.id + 'numberFormatting') ? events.openNumberFormatting
                    : (args.item.id === this.parent.element.id + 'mdxQuery') ? events.MdxQuery : (args.item.id === this.parent.element.id + 'fieldlist') ? events.showFieldList : '';
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
                this.mdxQueryDialog();
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
        if (select('#' + this.parent.element.id + 'report-dialog', this.parent.element) !== null) {
            remove(select('#' + this.parent.element.id + 'report-dialog', this.parent.element));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'report-dialog',
            className: cls.GRID_REPORT_DIALOG
        }));
        const dialog: Dialog = new Dialog({
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
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass
        });
        dialog.isStringTemplate = true;
        dialog.appendTo('#' + this.parent.element.id + 'report-dialog');
    }

    private renderMDXDialog(): void {
        if (select('#' + this.parent.element.id + 'mdx-dialog', this.parent.element) !== null) {
            remove(select('#' + this.parent.element.id + 'mdx-dialog', this.parent.element));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'mdx-dialog',
            className: cls.GRID_MDX_DIALOG
        }));
        const mdxDialog: Dialog = new Dialog({
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
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass
        });
        mdxDialog.isStringTemplate = true;
        mdxDialog.appendTo('#' + this.parent.element.id + 'mdx-dialog');
    }

    private copyMDXQuery(): void {
        const mdxDialog: Dialog = getInstance(select('#' + this.parent.element.id + 'mdx-dialog', document), Dialog) as Dialog;
        const textArea: HTMLInputElement = mdxDialog.element.querySelector('.' + cls.MDX_QUERY_CONTENT);
        try {
            textArea.select();
            document.execCommand('copy');
        } catch (err) {
            window.alert('Oops, unable to copy');
        }
        return;
    }

    private okBtnClick(): void {
        const dialog: Dialog = getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog;
        const reportInput: HTMLInputElement = dialog.element.querySelector('.' + cls.GRID_REPORT_INPUT) as HTMLInputElement;
        if (reportInput && reportInput.value === '') {
            reportInput.focus();
            return;
        }
        if (!this.parent.localeObj) {
            this.parent = getInstance(select('#' + this.parent.element.id, document) as HTMLElement, PivotView) as PivotView;
        }
        if ((dialog.header === this.parent.localeObj.getConstant('save') ||
            dialog.header === this.parent.localeObj.getConstant('saveAs')) &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'Save';
            this.currentReport = reportInput.value;
            let isExist: boolean = false;
            const _this: Toolbar = this as Toolbar;
            const reports: FetchReportArgs = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
                for (let i: number = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === observedArgs.reportName[i as number]) {
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
                const saveArgs: SaveReportArgs = {
                    report: _this.getCurrentReport(),
                    reportName: reportInput.value
                };
                const actionInfo: PivotActionInfo = {
                    reportName: reportInput.value
                };
                this.parent.actionObj.actionInfo = actionInfo;
                _this.parent.trigger(events.saveReport, saveArgs);
                _this.parent.isModified = false;
                _this.updateReportList();
                (getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog).hide();
            });
        } else if (dialog.header === this.parent.localeObj.getConstant('new') &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'New';
            this.currentReport = reportInput.value;
            let isExist: boolean = false;
            const _this: Toolbar = this as Toolbar;
            const reports: FetchReportArgs = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, (observedArgs: FetchReportArgs) => {
                for (let i: number = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === reports.reportName[i as number]) {
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
                const saveArgs: SaveReportArgs = {
                    report: _this.getCurrentReport(),
                    reportName: reportInput.value
                };
                const actionInfo: PivotActionInfo = {
                    reportName: reportInput.value
                };
                this.parent.actionObj.actionInfo = actionInfo;
                _this.parent.trigger(events.saveReport, saveArgs);
                _this.parent.isModified = false;
                _this.updateReportList();
                (getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog).hide();
            });
        } else if (dialog.header === this.parent.localeObj.getConstant('rename') && reportInput.value && reportInput.value !== '') {
            if (this.currentReport === reportInput.value) {
                dialog.hide();
                return;
            }
            this.action = 'Rename';
            let isExist: boolean = false;
            this.renameText = reportInput.value;
            const reports: FetchReportArgs = this.fetchReports();
            for (let i: number = 0; i < reports.reportName.length; i++) {
                if (reportInput.value === reports.reportName[i as number]) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) {
                this.createConfirmDialog(
                    this.parent.localeObj.getConstant('alert'),
                    this.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                    this.parent.localeObj.getConstant('replaceConfirmAfter'));
                return;
            }
            const renameArgs: RenameReportArgs = {
                reportName: this.currentReport,
                rename: reportInput.value
            };
            const actionInfo: PivotActionInfo = {
                reportName: { oldName: this.currentReport, newName: reportInput.value }
            };
            this.parent.actionObj.actionInfo = actionInfo;
            this.parent.trigger(events.renameReport, renameArgs);
            this.currentReport = reportInput.value;
            this.updateReportList();
            dialog.hide();
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
        const dialog: Dialog = getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog;
        dialog.hide();
    }

    private createConfirmDialog(title: string, description: string): void {
        if (document.getElementById(this.parent.element.id + '_ConfirmDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ConfirmDialog').parentElement);
        }
        const errorDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_ConfirmDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        const confirmPopUp: Dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('yes'), isPrimary: true,
                        cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '')
                    },
                    click: this.okButtonClick.bind(this)
                },
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('no'),
                        cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '')
                    },
                    click: this.cancelButtonClick.bind(this)
                }
            ]
        });
        confirmPopUp.isStringTemplate = true;
        confirmPopUp.appendTo(errorDialog);
        (confirmPopUp.element.querySelector('.e-dlg-header') as HTMLElement).innerText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(title) : title;
    }

    private okButtonClick(): void {
        const dialog: Dialog = getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog;
        if (this.action === 'Remove') {
            const removeArgs: RemoveReportArgs = {
                reportName: this.currentReport
            };
            const actionInfo: PivotActionInfo = {
                reportName: this.currentReport
            };
            this.parent.actionObj.actionInfo = actionInfo;
            this.parent.trigger(events.removeReport, removeArgs);
            const reports: FetchReportArgs = this.fetchReports();
            if (reports.reportName && reports.reportName.length > 0) {
                const loadArgs: LoadReportArgs = {
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
                const saveArgs: SaveReportArgs = {
                    report: this.getCurrentReport(),
                    reportName: this.currentReport
                };
                const actionInfo: PivotActionInfo = {
                    reportName: this.currentReport
                };
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
                const saveArgs: SaveReportArgs = {
                    report: this.getCurrentReport(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                this.updateReportList();
                dialog.hide();
            }
        } else if (this.action === 'Save') {
            const saveArgs: SaveReportArgs = {
                report: this.getCurrentReport(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
            this.updateReportList();
            dialog.hide();
        } else if (this.action === 'Rename') {
            const renameArgs: RenameReportArgs = {
                reportName: this.currentReport,
                rename: this.renameText,
                isReportExists: true
            };
            this.parent.trigger(events.renameReport, renameArgs);
            this.currentReport = this.renameText;
            this.parent.isModified = false;
            this.updateReportList();
            dialog.hide();
        }
        const confirmPopUp: Dialog = getInstance(select('#' + this.parent.element.id + '_ConfirmDialog', document), Dialog) as Dialog;
        confirmPopUp.hide();
    }

    private cancelButtonClick(): void {
        const dialog: Dialog = getInstance(select('#' + this.parent.element.id + 'report-dialog', document), Dialog) as Dialog;
        if (this.action === 'New') {
            if (this.parent.isModified) {
                this.createNewReport(this.newArgs);
            } else {
                dialog.hide();
            }
        } else if (this.action === 'Save') {
            if (select('#' + this.parent.element.id + '_reportlist', this.parent.element)) {
                const reportList: DropDownList = getInstance(select('#' + this.parent.element.id + '_reportlist', this.parent.element), DropDownList) as DropDownList;
                this.currentReport = reportList.value as string;
            }
            dialog.hide();
        } else if (this.action === 'Rename') {
            dialog.hide();
        } else if (this.dropArgs && this.action !== 'Remove') {
            this.reportLoad(this.dropArgs);
        }
        const confirmPopUp: Dialog = getInstance(select('#' + this.parent.element.id + '_ConfirmDialog', document), Dialog) as Dialog;
        confirmPopUp.hide();
    }
    /**
     *
     * @returns {void}
     * @hidden
     */
    public createChartMenu(): void {
        if (select('#' + this.parent.element.id + 'chart_menu', this.parent.element)) {
            const menuItems: MenuItemModel[] = [];
            const types: ChartSeriesType[] = this.getValidChartType();
            for (let i: number = 0; (i < types.length && i < 7); i++) {
                const type: ChartSeriesType = types[i as number];
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
            const toDisable: boolean = (menuItems.length <= 0 || this.parent.displayOption.view === 'Table');
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
            const menu: MenuItemModel[] = [{
                iconCss: cls.TOOLBAR_CHART + ' ' + cls.ICON,
                items: toDisable ? [] : menuItems
            }];
            let chartMenu: Menu = select('#' + this.parent.element.id + 'chart_menu', this.parent.element) ?
                getInstance(select('#' + this.parent.element.id + 'chart_menu', this.parent.element), Menu) as Menu : null;
            if (chartMenu && !chartMenu.isDestroyed) {
                chartMenu.destroy();
                chartMenu = null;
            }
            chartMenu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this),
                    beforeOpen: this.whitespaceRemove.bind(this),
                    onClose: () => {
                        this.focusToolBar();
                    },
                    beforeItemRender: this.multipleAxesCheckbox.bind(this)
                });
            chartMenu.isStringTemplate = true;
            chartMenu.appendTo('#' + this.parent.element.id + 'chart_menu');
        }
    }
    private create(): void {
        if (select('#' + this.parent.element.id + 'chart_menu', this.parent.element)) {
            this.createChartMenu();
        }
        if (select('#' + this.parent.element.id + 'export_menu', this.parent.element)) {
            const menu: MenuItemModel[] = [{
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
            const exportMenu: Menu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateExportMenu.bind(this),
                    onClose: () => {
                        this.focusToolBar();
                    }
                });
            exportMenu.isStringTemplate = true;
            exportMenu.appendTo('#' + this.parent.element.id + 'export_menu');
        }
        if (select('#' + this.parent.element.id + 'subtotal_menu', this.parent.element)) {
            const menu: MenuItemModel[] = [{
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
                    {
                        separator: true
                    },
                    {
                        text: this.parent.localeObj.getConstant('subTotalPosition'),
                        id: this.parent.element.id + 'subtotalpositions',
                        iconCss: cls.PIVOT_DISABLE_ICON + ' ' + cls.ICON,
                        items: [
                            {
                                text: this.parent.localeObj.getConstant('auto'),
                                id: this.parent.element.id + 'sub-none-position',
                                iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                            },
                            {
                                text: this.parent.localeObj.getConstant('top'),
                                id: this.parent.element.id + 'sub-top-position',
                                iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                            },
                            {
                                text: this.parent.localeObj.getConstant('bottom'),
                                id: this.parent.element.id + 'sub-bottom-position',
                                iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                            }
                        ]
                    }
                ]
            }];
            const subTotalMenu: Menu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateSubtotalSelection.bind(this),
                    onClose: () => {
                        this.focusToolBar();
                    }
                });
            subTotalMenu.isStringTemplate = true;
            subTotalMenu.appendTo('#' + this.parent.element.id + 'subtotal_menu');
        }
        if (select('#' + this.parent.element.id + 'grandtotal_menu', this.parent.element)) {
            const menu: MenuItemModel[] = [{
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
                            }
                        ]
                    }
                ]
            }];
            const grandTotalMenu: Menu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this), beforeOpen: this.updateGrandtotalSelection.bind(this),
                    onClose: () => {
                        this.focusToolBar();
                    }
                });
            grandTotalMenu.isStringTemplate = true;
            grandTotalMenu.appendTo('#' + this.parent.element.id + 'grandtotal_menu');
        }
        if (select('#' + this.parent.element.id + 'formatting_menu', this.parent.element)) {
            const menu: MenuItemModel[] = [{
                iconCss: cls.FORMATTING_MENU + ' ' + cls.ICON,
                items: [
                    {
                        text: this.parent.localeObj.getConstant('numberFormatMenu'),
                        iconCss: cls.NUMBER_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'numberFormattingMenu'
                    },
                    {
                        text: this.parent.localeObj.getConstant('conditionalFormattingMenu'),
                        iconCss: cls.CONDITIONAL_FORMATTING_MENU + ' ' + cls.ICON,
                        id: this.parent.element.id + 'conditionalFormattingMenu'
                    }
                ]
            }];
            const formattingMenu: Menu = new Menu(
                {
                    items: menu, enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    cssClass: cls.TOOLBAR_MENU + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    select: this.menuItemClick.bind(this)
                });
            formattingMenu.isStringTemplate = true;
            formattingMenu.appendTo('#' + this.parent.element.id + 'formatting_menu');
        }
        const saveArgs: SaveReportArgs = {
            report: this.parent.getPersistData(),
            reportName: this.parent.localeObj.getConstant('defaultReport')
        };
        this.currentReport = this.parent.localeObj.getConstant('defaultReport');
        this.parent.trigger(events.saveReport, saveArgs);
        if (select('#' + this.parent.element.id + '_reportlist', this.parent.element)) {
            const reports: FetchReportArgs = this.fetchReports();
            const reportList: DropDownList = new DropDownList({
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
            reportList.isStringTemplate = true;
            reportList.appendTo('#' + this.parent.element.id + '_reportlist');
        }
        this.updateItemElements();
    }
    private getCurrentReport(): string {
        let reportStr: string = this.parent.getPersistData();
        if (this.parent.dataSourceSettings.type === 'CSV' && this.parent.dataSourceSettings.mode !== 'Server') {
            const reportSettings: PivotView = JSON.parse(reportStr);
            (reportSettings.dataSourceSettings.dataSource as string[][]).splice(0, 0, this.parent.engineModule.fields);
            reportStr = JSON.stringify(reportSettings);
        }
        return reportStr;
    }
    private updateItemElements(): void {
        const itemElements: HTMLElement[] = [].slice.call(this.toolbar.element.querySelectorAll('.e-toolbar-item'));
        for (const element of itemElements) {
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
        const separator: HTMLElement = args.element.querySelector('.e-separator');
        if (separator) {
            separator.style.margin = '0px';
        }
    }
    private multipleAxesCheckbox(args: MenuEventArgs): void {
        if (this.parent.element.id + '_' + 'multipleAxes' === args.element.id) {
            const inputCheckbox: HTMLElement = createElement('input', {
                id: this.parent.element.id + '_' + 'checkBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            const checkbox: CheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('multipleAxes'),
                cssClass: 'e-multipleAxes' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                checked: this.parent.chartSettings.enableMultipleAxis,
                change: () => {
                    document.getElementById(this.parent.element.id + '_' + 'multipleAxes').click();
                },
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'checkBox');
            if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Pareto'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) &&
                !args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.add(cls.MENU_DISABLE);
                checkbox.disabled = true;
            } else if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Pareto'].indexOf(this.parent.chartSettings.chartSeries.type) < 0) &&
                args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.remove(cls.MENU_DISABLE);
                checkbox.disabled = false;
            }
            const checkboxObj: HTMLElement = this.parent.element.querySelector('.' + cls.CHECKBOX_CONTAINER + '.e-multipleAxes');
            args.element.appendChild(checkboxObj);
        } else if (this.parent.element.id + '_' + 'showLegend' === args.element.id) {
            const inputCheckbox: HTMLElement = createElement('input', {
                id: this.parent.element.id + '_' + 'showLegendCheckBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            const checkbox: CheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('showLegend'),
                checked: this.getLableState(),
                cssClass: 'e-showLegend' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                change: () => {
                    document.getElementById(this.parent.element.id + '_' + 'showLegend').click();
                },
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'showLegendCheckBox');
            const checkboxObj: HTMLElement = this.parent.element.querySelector('.' + cls.CHECKBOX_CONTAINER + '.e-showLegend');
            args.element.appendChild(checkboxObj);
        }
    }

    private getLableState(): boolean {
        const chartSettings: ChartSettingsModel = JSON.parse(this.parent.getChartSettings()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.showLableState = chartSettings.legendSettings.visible;
        } else {
            this.showLableState = true;
        }
        return this.showLableState;
    }
    private getAllChartItems(): string[] {
        return ['Line', 'Column', 'Area', 'Bar', 'StackingColumn', 'StackingArea', 'StackingBar', 'StackingLine', 'StepLine', 'StepArea',
            'SplineArea', 'Scatter', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'StackingLine100', 'Bubble', 'Pareto',
            'Polar', 'Radar', 'Pie', 'Pyramid', 'Funnel', 'Doughnut'] as ChartSeriesType[];
    }
    private updateExportMenu(args: BeforeOpenCloseMenuEventArgs): void {
        const items: HTMLElement[] = [].slice.call(args.element.querySelectorAll('li'));
        if (this.parent.currentView === 'Table') {
            addClass(items.slice(3), cls.MENU_HIDE);
            removeClass(items.slice(1, 3), cls.MENU_HIDE);
        } else {
            addClass(items.slice(1, 3), cls.MENU_HIDE);
            removeClass(items.slice(3), cls.MENU_HIDE);
        }
    }
    private updateSubtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!(args.parentItem.id === this.parent.element.id + 'subtotalpositions')) {
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
            if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals &&
                !this.parent.dataSourceSettings.showColumnSubTotals) {
                select('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showSubTotals && !this.parent.dataSourceSettings.showRowSubTotals &&
                this.parent.dataSourceSettings.showColumnSubTotals) {
                select('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals &&
                this.parent.dataSourceSettings.showColumnSubTotals) {
                select('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (!this.parent.dataSourceSettings.showSubTotals || (!this.parent.dataSourceSettings.showRowSubTotals &&
                !this.parent.dataSourceSettings.showColumnSubTotals)) {
                select('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        } else {
            select('#' + this.parent.element.id + 'sub-none-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.subTotalsPosition === 'Auto') {
                select('#' + this.parent.element.id + 'sub-none-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
            select('#' + this.parent.element.id + 'sub-top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.subTotalsPosition === 'Top') {
                select('#' + this.parent.element.id + 'sub-top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
            select('#' + this.parent.element.id + 'sub-bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.subTotalsPosition === 'Bottom') {
                select('#' + this.parent.element.id + 'sub-bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        }
    }
    private updateGrandtotalSelection(args: BeforeOpenCloseMenuEventArgs): void {
        if (!(args.parentItem.id === this.parent.element.id + 'grandtotalpositions')) {
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
            if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals &&
                !this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showGrandTotals && !this.parent.dataSourceSettings.showRowGrandTotals &&
                this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals &&
                this.parent.dataSourceSettings.showColumnGrandTotals) {
                select('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            } else if (!this.parent.dataSourceSettings.showGrandTotals || (!this.parent.dataSourceSettings.showRowGrandTotals &&
                !this.parent.dataSourceSettings.showColumnGrandTotals)) {
                select('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        }
        else {
            select('#' + this.parent.element.id + 'top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.grandTotalsPosition === 'Top') {
                select('#' + this.parent.element.id + 'top-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
            select('#' + this.parent.element.id + 'bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.add(cls.PIVOT_DISABLE_ICON);
            if (this.parent.dataSourceSettings.grandTotalsPosition === 'Bottom') {
                select('#' + this.parent.element.id + 'bottom-position' + ' .' + cls.PIVOT_SELECT_ICON, args.element).classList.remove(cls.PIVOT_DISABLE_ICON);
            }
        }
    }
    private updateReportList(): void {
        if (select('#' + this.parent.element.id + '_reportlist', this.parent.element)) {
            const reports: FetchReportArgs = this.fetchReports();
            const reportList: DropDownList = getInstance(select('#' + this.parent.element.id + '_reportlist', this.parent.element), DropDownList) as DropDownList;
            reportList.dataSource = reports.reportName;
            if (this.currentReport === '' && reportList.dataSource.length > 0) {
                reportList.value = reportList.dataSource[reportList.dataSource.length - 1];
                reportList.text = reportList.dataSource[reportList.dataSource.length - 1];
                this.currentReport = reportList.dataSource[reportList.dataSource.length - 1];
            } else {
                reportList.value = this.currentReport;
                reportList.text = this.currentReport;
            }
            reportList.refresh();
        }
    }
    private menuItemClick(args: ClickEventArgs): void {
        let exportArgs: BeforeExportEventArgs = {};
        let type: string;
        const actionName: string = (args.item.id === this.parent.element.id + 'grid') ? events.tableView : (args.item.id === this.parent.element.id + '_' + 'Column') ? events.chartView : (args.item.id === this.parent.element.id + '_' + 'Bar') ? events.chartView : (args.item.id === this.parent.element.id + '_' + 'Line') ? events.chartView
            : (args.item.id === this.parent.element.id + '_' + 'Area') ? events.chartView : (args.item.id === this.parent.element.id + '_' + 'Scatter') ? events.chartView : (args.item.id === this.parent.element.id + '_' + 'Polar') ? events.chartView : (args.item.id === this.parent.element.id + '_' + 'ChartMoreOption') ? events.chartView
                : (args.item.id === this.parent.element.id + '_' + 'multipleAxes') ? events.multipleAxis : (args.item.id === this.parent.element.id + '_' + 'showLegend') ? events.showLegend : (args.item.id === this.parent.element.id + 'pdf') ? events.pdfExport : (args.item.id === this.parent.element.id + 'png') ? events.pngExport
                    : (args.item.id === this.parent.element.id + 'excel') ? events.excelExport : (args.item.id === this.parent.element.id + 'csv') ? events.csvExport : (args.item.id === this.parent.element.id + 'jpeg') ? events.jpegExport : (args.item.id === this.parent.element.id + 'svg') ? events.svgExport
                        : (args.item.id === this.parent.element.id + 'notsubtotal') ? events.hideSubTotals : (args.item.id === this.parent.element.id + 'subtotalrow') ? events.subTotalsRow : (args.item.id === this.parent.element.id + 'subtotalcolumn') ? events.subTotalsColumn
                            : (args.item.id === this.parent.element.id + 'subtotal') ? events.showSubTotals : (args.item.id === this.parent.element.id + 'notgrandtotal') ? events.hideGrandTotals : (args.item.id === this.parent.element.id + 'grandtotalrow') ? events.grandTotalsRow
                                : (args.item.id === this.parent.element.id + 'grandtotalcolumn') ? events.grandTotalsColumn : (args.item.id === this.parent.element.id + 'grandtotal') ? events.showGrandTotals
                                    : (args.item.id === this.parent.element.id + 'numberFormattingMenu') ? events.numberFormattingMenu : (args.item.id === this.parent.element.id + 'conditionalFormattingMenu') ? events.conditionalFormattingMenu : '';
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
                    const actionInfo: PivotActionInfo = {
                        toolbarInfo: {
                            displayOption: this.parent.displayOption as DisplayOption,
                            gridSettings: this.parent.gridSettings as GridSettings
                        }
                    };
                    this.parent.actionObj.actionInfo = actionInfo;
                    this.parent.layoutRefresh();
                }
                break;
            case (this.parent.element.id + 'pdf'):
                if (this.parent.currentView === 'Table') {
                    this.parent.pdfExport({ fileName: 'Export.pdf' }, false, undefined, false);
                } else {
                    this.parent.chartExport('PDF', { fileName: 'result' }, undefined, null, undefined);
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
                    this.parent.excelExport(
                        observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob
                    );
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
                    if (this.parent.dataSourceSettings.mode === 'Server') {
                        this.parent.getEngine(
                            'onCsvExport', null, null, null, null, null, null, null, null, observedArgs.excelExportProperties
                        );
                    } else {
                        this.parent.csvExport(
                            observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob
                        );
                    }
                });
                break;
            case (this.parent.element.id + 'png'):
                this.parent.chartExport('PNG', { fileName: 'result' }, undefined, null, undefined);
                break;
            case (this.parent.element.id + 'jpeg'):
                this.parent.chartExport('JPEG', { fileName: 'result' }, undefined, null, undefined);
                break;
            case (this.parent.element.id + 'svg'):
                this.parent.chartExport('SVG', { fileName: 'result' }, undefined, null, undefined);
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
            case (this.parent.element.id + 'sub-top-position'):
                this.parent.setProperties(
                    { dataSourceSettings: { subTotalsPosition: 'Top' } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'sub-bottom-position'):
                this.parent.setProperties(
                    { dataSourceSettings: { subTotalsPosition: 'Bottom' } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'sub-none-position'):
                this.parent.setProperties(
                    { dataSourceSettings: { subTotalsPosition: 'Auto' } }, true);
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
    }
    /**
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initToolbar, this.createToolbar, this);
    }

    private getValidChartType(): ChartSeriesType[] {
        const menuItems: ChartSeriesType[] = [];
        for (let i: number = 0; (i <= this.parent.chartTypes.length); i++) {
            const type: ChartSeriesType = this.parent.chartTypes[i as number];
            if ((this.getAllChartItems().indexOf(type) > -1) && (menuItems.indexOf(type) < 0)) {
                menuItems.push(type);
            }
        }
        return menuItems;
    }
    private createChartTypeDialog(): void {
        const chartDialog: HTMLElement = this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + '_ChartTypeDialog',
            className: cls.PIVOTCHART_TYPE_DIALOG
        }));
        const chartTypesDialog: Dialog = new Dialog({
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: () => { this.chartTypeDialogUpdate(); },
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => { this.removeDialog(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parent.element,
            cssClass: this.parent.cssClass,
            close: this.removeDialog.bind(this)
        });
        chartTypesDialog.isStringTemplate = true;
        chartTypesDialog.appendTo(chartDialog);
    }
    private removeDialog(): void {
        const chartTypesDialog: Dialog = select('#' + this.parent.element.id + '_ChartTypeDialog', this.parent.element) ?
            getInstance(select('#' + this.parent.element.id + '_ChartTypeDialog', this.parent.element), Dialog) as Dialog : null;
        if (chartTypesDialog && !chartTypesDialog.isDestroyed) { chartTypesDialog.destroy(); }
        if (document.getElementById(this.parent.element.id + '_ChartTypeDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ChartTypeDialog'));
        }
    }
    private chartTypeDialogUpdate(): void {
        const chartType: ChartSeriesType = (getInstance(select('#' + this.parent.element.id + '_ChartTypeOption'), DropDownList) as DropDownList).value as ChartSeriesType;
        const checked: boolean = (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox).checked;
        const checkedShow: boolean = (getInstance(select('#' + this.parent.element.id + '_DialogShowLabel'), CheckBox) as CheckBox).checked;
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
        const chartTypesDialog: Dialog = select('#' + this.parent.element.id + '_ChartTypeDialog', document) ?
            getInstance(select('#' + this.parent.element.id + '_ChartTypeDialog', document), Dialog) as Dialog : null;
        chartTypesDialog.close();
    }
    private updateChartType(type: ChartSeriesType, isMultiAxis: boolean): void {
        if (this.getAllChartItems().indexOf(type) > -1) {
            if (this.parent.chart) {
                this.parent.currentView = 'Chart';
                this.parent.setProperties({ displayOption: { primary: 'Chart' } }, true);
                if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis) {
                    (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.width = formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber());
                }
                this.parent.chart.setProperties({
                    width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                }, true);
                if (this.parent.chartSettings.chartSeries.type === type && !isMultiAxis) {
                    this.parent.chart.refresh();
                } else {
                    this.parent.chartSettings.chartSeries.type = type;
                }
                const actionInfo: PivotActionInfo = {
                    toolbarInfo: {
                        displayOption: this.parent.displayOption as DisplayOption,
                        chartSettings: this.parent.chartSettings as ChartSettings
                    }
                };
                this.parent.actionObj.actionInfo = actionInfo;
            }
        }
    }
    private getDialogContent(): HTMLElement {
        const mainWrapper: HTMLElement = createElement('div', { className: 'e-chart-type-div-content' });
        const optionWrapperDiv: HTMLElement = createElement('div', { className: 'e-chart-type-option-container' });
        const axisModeWrapperDiv: HTMLElement = createElement('div', { className: 'e-multiple-axes-mode-container' });
        const optionTextDiv: HTMLElement = createElement('div', {
            className: 'e-chart-type-option-text'
        });
        optionTextDiv.innerText = this.parent.localeObj.getConstant('ChartType');
        const axisModeTextDiv: HTMLElement = createElement('div', {
            className: 'e-multiple-axes-mode-text'
        });
        axisModeTextDiv.innerText = this.parent.localeObj.getConstant('multipleAxisMode');
        const dropOptionDiv: HTMLElement = createElement('div', { id: this.parent.element.id + '_ChartTypeOption' });
        const dropModeOptionDiv: HTMLElement = createElement('div', { id: this.parent.element.id + '_AxisModeOption' });
        optionWrapperDiv.appendChild(optionTextDiv);
        optionWrapperDiv.appendChild(dropOptionDiv);
        const chartTypeDatasource: { [key: string]: Object }[] = [];
        const multipleAxisModeDatasource: { [key: string]: Object }[] = [
            { value: 'Stacked', text: this.parent.localeObj.getConstant('stacked') },
            { value: 'Single', text: this.parent.localeObj.getConstant('single') },
            { value: 'Combined', text: this.parent.localeObj.getConstant('combined') }];
        const chartType: ChartSeriesType[] = this.getValidChartType();
        for (let i: number = 0; i < chartType.length; i++) {
            chartTypeDatasource.push({
                value: chartType[i as number], text: this.parent.localeObj.getConstant(chartType[i as number].toLowerCase())
            });
        }
        const optionWrapper: DropDownList = new DropDownList({
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
        const checkboxWrap: HTMLInputElement = createElement('input', {
            id: this.parent.element.id + '_DialogMultipleAxis',
            attrs: { 'type': 'checkbox' }
        }) as HTMLInputElement;
        mainWrapper.appendChild(checkboxWrap);
        const labelCheckboxWrap: HTMLInputElement = createElement('input', {
            id: this.parent.element.id + '_DialogShowLabel',
            attrs: { 'type': 'checkbox' }
        }) as HTMLInputElement;
        mainWrapper.appendChild(labelCheckboxWrap);
        axisModeWrapperDiv.appendChild(axisModeTextDiv);
        axisModeWrapperDiv.appendChild(dropModeOptionDiv);
        mainWrapper.appendChild(axisModeWrapperDiv);
        const axisModeWrapper: DropDownList = new DropDownList({
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
        const chartSettings: ChartSettingsModel = JSON.parse(this.parent.getChartSettings()).chartSettings;
        if (!(chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined)) {
            (getInstance(select('#' + this.parent.element.id + '_DialogShowLabel'), CheckBox) as CheckBox).checked = true;
        }
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Pareto'].indexOf(args.value.toString()) > -1) {
            (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox).disabled = true;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = false;
        } else {
            const multipleAxisCheckBox: CheckBox = (getInstance(select('#' + this.parent.element.id + '_DialogMultipleAxis'), CheckBox) as CheckBox);
            multipleAxisCheckBox.disabled = false;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = multipleAxisCheckBox.checked;
        }
    }

    private beforeOpen(): void {
        const checkbox: CheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('multipleAxes'),
            cssClass: 'e-dialog-multiple-axis' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            checked: this.parent.chartSettings.enableMultipleAxis ? this.parent.chartSettings.enableMultipleAxis : false,
            change: (args: StateChange) => {
                (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = args.checked;
            },
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        const checkbox1: CheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('showLegend'),
            checked: this.getLableState(),
            change: () => { this.chartLableState = true; },
            cssClass: 'e-dialog-show-legend' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        const chartTypesDialog: Dialog = select('#' + this.parent.element.id + '_ChartTypeDialog', document) ?
            getInstance(select('#' + this.parent.element.id + '_ChartTypeDialog', document), Dialog) as Dialog : null;
        checkbox1.appendTo(select('#' + this.parent.element.id + '_DialogShowLabel', chartTypesDialog.element) as HTMLElement);
        checkbox.appendTo(select('#' + this.parent.element.id + '_DialogMultipleAxis', chartTypesDialog.element) as HTMLElement);
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Pareto'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) {
            checkbox.disabled = true;
            (getInstance(select('#' + this.parent.element.id + '_AxisModeOption'), DropDownList) as DropDownList).enabled = false;
        }
        const chartSettings: ChartSettingsModel = JSON.parse(this.parent.getChartSettings()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.chartLableState = true;
        } else {
            this.chartLableState = false;
        }
    }
    /**
     * To refresh the toolbar
     *
     * @returns {void}
     * @hidden
     */
    public refreshToolbar(): void {
        this.createToolbar();
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initToolbar, this.createToolbar);
    }

    /**
     * To destroy the toolbar
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        let element: HTMLElement = select('#' + this.parent.element.id + '_ConfirmDialog', document);
        let confirmPopUp: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (confirmPopUp && !confirmPopUp.isDestroyed) {
            confirmPopUp.destroy();
            confirmPopUp = null;
        }
        element = select('#' + this.parent.element.id + 'report-dialog', document);
        let dialog: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (dialog && !dialog.isDestroyed) {
            dialog.destroy();
            dialog = null;
        }
        element = select('#' + this.parent.element.id + 'mdx-dialog', document);
        let mdxDialog: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (mdxDialog && !mdxDialog.isDestroyed) {
            mdxDialog.destroy();
            mdxDialog = null;
        }
        element = select('#' + this.parent.element.id + 'chart_menu', document);
        let chartMenu: Menu = element ? getInstance(element, Menu) as Menu : null;
        if (chartMenu && !chartMenu.isDestroyed) {
            chartMenu.destroy();
            chartMenu = null;
        }
        element = select('#' + this.parent.element.id + '_ChartTypeDialog', document);
        let chartTypesDialog: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (chartTypesDialog && !chartTypesDialog.isDestroyed) {
            chartTypesDialog.destroy();
            chartTypesDialog = null;
        }
        element = select('#' + this.parent.element.id + 'export_menu', document);
        let exportMenu: Menu = element ? getInstance(element, Menu) as Menu : null;
        if (exportMenu && !exportMenu.isDestroyed) {
            exportMenu.destroy();
            exportMenu = null;
        }
        element = select('#' + this.parent.element.id + 'subtotal_menu', document);
        let subTotalMenu: Menu = element ? getInstance(element, Menu) as Menu : null;
        if (subTotalMenu && !subTotalMenu.isDestroyed) {
            subTotalMenu.destroy();
            subTotalMenu = null;
        }
        element = select('#' + this.parent.element.id + 'grandtotal_menu', document);
        let grandTotalMenu: Menu = element ? getInstance(element, Menu) as Menu : null;
        if (grandTotalMenu && !grandTotalMenu.isDestroyed) {
            grandTotalMenu.destroy();
            grandTotalMenu = null;
        }
        element = select('#' + this.parent.element.id + 'formatting_menu', document);
        let formattingMenu: Menu = element ? getInstance(element, Menu) as Menu : null;
        if (formattingMenu && !formattingMenu.isDestroyed) {
            formattingMenu.destroy();
            formattingMenu = null;
        }
        element = select('#' + this.parent.element.id + '_reportlist', document);
        let reportList: DropDownList = element ? getInstance(element, DropDownList) as DropDownList : null;
        if (reportList && !reportList.isDestroyed) {
            reportList.destroy();
            reportList = null;
        }
        if (this.toolbar && !this.toolbar.isDestroyed) {
            this.toolbar.destroy();
            this.toolbar = null;
        }
        element = select('#' + this.parent.element.id + 'pivot-toolbar', document);
        if (element) {
            remove(element);
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
