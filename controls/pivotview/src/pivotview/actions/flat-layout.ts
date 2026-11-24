import { CustomSummaryType, AggregateRowModel, AggregateColumnModel, ColumnModel } from '@syncfusion/ej2-grids';
import { getValue, remove, addClass, removeClass, Internationalization } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { PivotView } from '../base/pivotview';
import { PivotViewModel } from '../base/pivotview-model';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { FlatRecord, FlatValue, FlatActionInfo, PivotActionBeginEventArgs } from '../../common/base/interface';
import { GridLayout } from '../../common/base/enum';
import { FlatRecordStore } from '../flat/flat-data';
import { Render } from '../renderer/render';
import { DataSourceSettingsModel } from '../../model/datasourcesettings-model';
import { IDataSet } from '../../base/engine';
import { FlatQuery } from '../flat/flat-query';
import { FlatSummaries } from '../flat/flat-summary';
import { FlatGrid } from '../flat/flat-grid';
import { FlatFields } from '../flat/flat-fields';
import { FlatOutput } from '../flat/flat-output';
import { cloneFlat, validateFlatSettings, flatPinsFit, pruneFlatSettings } from '../../common/base/flat-util';
import * as events from '../../common/base/constant';

/** Optional raw-record layout coordinator. @hidden */
export class FlatLayout {
    /** Whether the committed raw-record view owns the current Grid. @hidden */
    public active: boolean = false;
    /** Committed visible physical columns in display order. @hidden */
    public columns: ColumnModel[] = [];
    /** Validated record store for the current source generation. @hidden */
    public store: FlatRecordStore;
    /** Committed matching record ordinals and independent query state. @hidden */
    public query: FlatQuery;
    /** Cached totals for the complete committed query result. @hidden */
    public summaries: FlatSummaries;
    /** Native Grid adapter owned by this layout coordinator. @hidden */
    public gridAdapter: FlatGrid;
    /** Detached export and print job owner for this layout. @hidden */
    public output: FlatOutput;
    private fields: FlatFields;
    private parent: PivotView;
    private committed: FlatSettingsModel;
    private committedSource: DataSourceSettingsModel;
    private previousLayout: GridLayout = 'Compact';
    private action: string;
    private info: FlatActionInfo;
    private destroyed: boolean = false;
    private generation: number = 0;
    private candidateSettings: FlatSettingsModel;
    private candidateSource: DataSourceSettingsModel;
    private committedStore: FlatRecordStore;
    private committedReference: object;
    private committedColumns: ColumnModel[] = [];
    private renderError: Error;
    private recoveryError: Error;
    private sourceReference: object;
    private committedQuery: FlatQuery;
    private committedSummaries: FlatSummaries;
    private sourceSchema: string;
    private committedSchema: string;
    private committedLocale: string;

    /**
     * Rendering generation used to ignore obsolete Grid callbacks.
     *
     * @returns {number} Current generation.
     * @hidden
     */
    public get renderGeneration(): number { return this.generation; }

    /**
     * Projects the committed matching records only when a complete result is requested.
     *
     * @returns {FlatRecord[]} Detached visible records.
     * @hidden
     */
    public get records(): FlatRecord[] { return this.project(); }

    /**
     * Captures the last committed output without reading a pending candidate.
     *
     * @returns {object} Detached columns, records, summaries and configuration.
     * @hidden
     */
    public outputSnapshot(): { settings: FlatSettingsModel; columns: ColumnModel[];
        records: FlatRecord[]; values: { [field: string]: FlatValue }; } {
        if (this.destroyed || !this.committed || !this.committedStore || !this.committedQuery) {
            throw new Error('Flat output requires a committed record view.');
        }
        return { settings: cloneFlat(this.committed), columns: cloneFlat(this.committedColumns),
            records: this.committedStore.project(this.committedColumns.map((column: ColumnModel) => column.field),
                                                 this.committedQuery.ordinals), values: cloneFlat(this.committedSummaries.values) };
    }

    /**
     * Projects a record window without allocating a second complete data source.
     *
     * @param {number} skip - Match offset.
     * @param {number} take - Window size.
     * @returns {FlatRecord[]} Detached visible record window.
     * @hidden
     */
    public project(skip: number = 0, take: number = this.query ? this.query.ordinals.length : 0): FlatRecord[] {
        return this.store && this.store.length && this.query ? this.store.project(this.columns.map((column: ColumnModel) => column.field),
                                                                                  this.query.ordinals.slice(skip, skip + take)) : [];
    }

    /**
     * Creates the optional coordinator.
     *
     * @param {PivotView} parent - Owning PivotView.
     * @private
     */
    constructor(parent: PivotView) {
        this.parent = parent; this.gridAdapter = new FlatGrid(parent); this.output = new FlatOutput(parent);
        this.fields = new FlatFields(parent);
    }

    /**
     * Opens the separate chooser under the existing FieldList injection policy.
     *
     * @returns {void}
     * @hidden
     */
    public openFields(): void {
        if (this.parent.showFieldList && this.parent.fieldListModule) { this.fields.open(); }
    }

    /**
     * Returns the injection member name.
     *
     * @returns {string} Module name.
     * @hidden
     */
    public getModuleName(): string { return 'flatLayout'; }

    private snapshot(): FlatSettingsModel {
        return cloneFlat(this.parent.flatSettings);
    }

    /**
     * Enters Flat without invoking pivot aggregation.
     *
     * @param {boolean} initial - Whether this is the initial component render.
     * @returns {boolean} Whether the candidate rendered successfully.
     * @hidden
     */
    public enter(initial: boolean = false): boolean {
        const parent: PivotView = this.parent;
        if (this.destroyed || parent.isDestroyed) { return false; }
        const generation: number = ++this.generation;
        let before: FlatSettingsModel = this.committed;
        let rendering: boolean = false;
        try {
            before = before || this.snapshot();
            const current: FlatSettingsModel = this.snapshot();
            const info: FlatActionInfo = { previous: cloneFlat(before, true), current: cloneFlat(current, true) };
            if (!initial && this.action) {
                const args: PivotActionBeginEventArgs = { actionName: this.action || events.layoutChange, cancel: false,
                    dataSourceSettings: parent.dataSourceSettings, flatInfo: info };
                parent.trigger(events.actionBegin, args);
                if (generation !== this.generation || this.destroyed) { return false; }
                if (args.cancel) {
                    const restoreView: boolean = this.action === events.flatFiltering ||
                        this.action === events.flatFieldsChange && this.gridAdapter.columnActionPending;
                    this.restore(before);
                    if (this.active && restoreView) { this.gridAdapter.render(false); }
                    else { this.generation = generation - 1; }
                    return false;
                }
            }
            if (parent.dataSourceSettings.providerType === 'SSAS' || parent.dataSourceSettings.mode === 'Server') {
                throw new Error('Flat layout requires a complete relational record source.');
            }
            let source: object[] | DataManager = parent.dataSourceSettings.dataSource as object[] | DataManager;
            if (source instanceof DataManager) {
                if (source.dataSource.url) {
                    throw new Error('Flat layout requires a complete relational record source.');
                }
                source = source.dataSource.json;
            }
            if (!Array.isArray(source)) { throw new Error('Flat layout requires a complete relational record source.'); }
            const original: object[] = source as object[];
            const schema: string = JSON.stringify([parent.dataSourceSettings.type, parent.dataSourceSettings.excludeFields]);
            const store: FlatRecordStore = this.sourceReference === source && this.sourceSchema === schema && this.store ? this.store :
                new FlatRecordStore(original, parent.dataSourceSettings.excludeFields || [], parent.dataSourceSettings.type === 'CSV');
            let columns: ColumnModel[] = parent.flatSettings.columns;
            if (columns === undefined) {
                const selected: string[] = [];
                columns = [];
                ['rows', 'columns', 'values', 'filters'].forEach((axis: string) => {
                    getValue(axis, parent.dataSourceSettings).forEach((field: { name: string; caption?: string }) => {
                        if (store.fields.indexOf(field.name) !== -1 && selected.indexOf(field.name) === -1) {
                            selected.push(field.name);
                            const format: { name?: string; format?: string } = parent.dataSourceSettings.formatSettings
                                .filter((entry: { name?: string }) => entry.name === field.name)[0];
                            columns.push({ field: field.name, headerText: field.caption || field.name,
                                format: format && format.format });
                        }
                    });
                });
            }
            const names: string[] = [];
            columns.forEach((column: ColumnModel) => {
                if (!column.field || names.indexOf(column.field) !== -1 ||
                    column.field.split('.').some((part: string) => ['__proto__', 'prototype', 'constructor'].indexOf(part) !== -1)) {
                    throw new Error('Flat layout settings contain an invalid value.');
                }
                names.push(column.field);
            });
            const valid: ColumnModel[] = columns.filter((column: ColumnModel) =>
                original.length === 0 || store.fields.indexOf(column.field) !== -1);
            const visible: ColumnModel[] = valid.filter((column: ColumnModel) => column.visible !== false);
            const querySettings: FlatSettingsModel = cloneFlat(parent.flatSettings);
            querySettings.columns = original.length > 0 && store !== this.committedStore ? columns : valid;
            const pruned: boolean = original.length > 0 && store !== this.committedStore && pruneFlatSettings(querySettings, store.fields);
            if (valid.length !== columns.length || pruned) {
                parent.actionFailureMethod(new Error('Flat layout ignored an unavailable or unsupported field.'));
            }
            validateFlatSettings(querySettings);
            const pins: (settings: FlatSettingsModel) => string = (settings: FlatSettingsModel) =>
                JSON.stringify([settings.frozenColumns, (settings.columns || []).map((column: ColumnModel) =>
                    [column.field, column.visible, column.width, column.freeze, column.isFrozen])]);
            if (!flatPinsFit(querySettings, this.gridAdapter.viewportWidth()) && (!this.active || pins(querySettings) !== pins(before))) {
                throw new Error(parent.localeObj.getConstant('flatPinningUnavailable'));
            }
            const query: FlatQuery = new FlatQuery(store, querySettings, parent.locale);
            const reuseSummaries: boolean = this.committedQuery && this.queryConfigurationEqual(current, before) &&
                this.sourceReference === source && this.committedLocale === parent.locale;
            const summaries: FlatSummaries = reuseSummaries ? this.committedSummaries :
                new FlatSummaries(store, query, querySettings, parent, parent.element.ownerDocument.defaultView);
            if (generation !== this.generation || this.destroyed) { return false; }
            if (this.action === events.flatFieldsChange) { this.fields.destroy(); }
            this.columns = visible;
            this.store = store;
            this.query = query;
            this.summaries = summaries;
            this.sourceReference = source;
            this.sourceSchema = schema;
            parent.setProperties({ flatSettings: querySettings }, true);
            info.current = cloneFlat(this.snapshot(), true);
            this.active = true;
            this.action = initial ? undefined : this.action;
            this.info = initial ? undefined : info;
            this.candidateSettings = this.snapshot();
            this.candidateSource = Object.assign({}, getValue('properties', parent.dataSourceSettings));
            this.renderError = undefined;
            if (parent.virtualscrollModule) { parent.virtualscrollModule.suspend(); }
            rendering = true;
            this.render();
            return true;
        } catch (error) {
            if (this.generation !== generation) { return false; }
            if (before) { this.restore(before); }
            else { parent.setProperties({ gridSettings: { layout: this.previousLayout } }, true); }
            this.store = this.committedStore;
            this.sourceReference = this.committedReference;
            this.sourceSchema = this.committedSchema;
            this.columns = this.committedColumns;
            this.query = this.committedQuery;
            this.summaries = this.committedSummaries;
            if (this.active && this.committed) {
                if (rendering) { this.gridAdapter.render(false); }
                else { this.generation = generation - 1; }
            }
            parent.actionFailureMethod(error instanceof Error ? error : new Error('Flat layout settings contain an invalid value.'));
            return false;
        }
    }

    private restore(settings: FlatSettingsModel): void {
        this.parent.setProperties({ flatSettings: settings, gridSettings: { layout: this.active ? 'Flat' : this.previousLayout } }, true);
        if (this.committedSource) { this.parent.setProperties({ dataSourceSettings: this.committedSource }, true); }
        this.action = undefined;
        this.info = undefined;
        this.candidateSettings = undefined;
        this.candidateSource = undefined;
    }

    /**
     * Coalesces initial-rendering property changes into one transaction.
     *
     * @param {PivotViewModel} newProp - Candidate properties.
     * @param {PivotViewModel} oldProp - Previous properties.
     * @returns {boolean} Whether Flat handled the batch.
     * @hidden
     */
    public update(newProp: PivotViewModel, oldProp: PivotViewModel): boolean {
        if (this.parent.gridSettings.layout === 'Flat') {
            if (newProp.dataSourceSettings) { this.parent.engineModule.pivotValues = undefined; }
            if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).some((key: string) =>
                ['dataSource', 'excludeFields', 'type'].indexOf(key) !== -1)) {
                this.fields.sourceChanged();
                this.sourceReference = undefined;
            }
            const shared: string[] = ['width', 'height', 'locale', 'enableRtl', 'cssClass', 'enableHtmlSanitizer',
                'toolbar', 'showToolbar', 'showFieldList'];
            const sharedChanged: boolean = this.active && Object.keys(newProp).some((name: string) => shared.indexOf(name) !== -1);
            if (sharedChanged) {
                this.fields.destroy();
                if (this.parent.toolbarModule) { this.parent.toolbarModule.resetFlatToolbar(); }
                this.generation++;
                this.parent.localeObj.setLocale(this.parent.locale);
                this.parent.globalize = new Internationalization(this.parent.locale);
                if (this.parent.enableRtl) { addClass([this.parent.element], 'e-rtl'); }
                else { removeClass([this.parent.element], 'e-rtl'); }
            }
            if (this.active && !newProp.flatSettings && !newProp.dataSourceSettings &&
                !(newProp.gridSettings && newProp.gridSettings.layout)) {
                if (sharedChanged) {
                    if (newProp.locale) { this.enter(true); }
                    else { this.render(); }
                }
                return true;
            }
            if (!this.active) {
                this.previousLayout = oldProp.gridSettings && oldProp.gridSettings.layout || 'Compact';
            }
            const changed: string[] = newProp.flatSettings ? Object.keys(newProp.flatSettings) : [];
            this.action = newProp.gridSettings && newProp.gridSettings.layout ? events.layoutChange :
                changed.indexOf('columns') !== -1 ? events.flatFieldsChange :
                    changed.some((name: string) => ['filterSettings', 'advancedFilterSettings', 'searchSettings'].indexOf(name) !== -1)
                        ? events.flatFiltering : changed.indexOf('sortSettings') !== -1 ? events.flatSorting :
                            changed.some((name: string) => ['aggregates', 'totalsPosition'].indexOf(name) !== -1)
                                ? events.flatTotalsChange : undefined;
            if ([events.flatFiltering, events.flatSorting].indexOf(this.action) !== -1) {
                this.parent.setProperties({ flatSettings: { pageSettings: { currentPage: 1 } } }, true);
            }
            this.enter();
            if (sharedChanged && this.active && this.parent.gridSettings.layout === 'Flat') {
                this.parent.notify(events.initToolbar, {});
            }
            return true;
        }
        if (this.active) {
            const args: PivotActionBeginEventArgs = { actionName: events.layoutChange, cancel: false,
                flatInfo: { previous: cloneFlat(this.committed, true), current: cloneFlat(this.snapshot(), true) } };
            this.parent.trigger(events.actionBegin, args);
            if (args.cancel) { this.parent.setProperties({ gridSettings: { layout: 'Flat' } }, true); return true; }
            this.generation++;
            this.active = false;
            this.previousLayout = this.parent.gridSettings.layout;
            this.clearGrid();
            this.parent.isTabular = this.previousLayout === 'Tabular';
            this.parent.actionObj.actionName = events.layoutChange;
            this.parent.actionObj.actionInfo = { flatInfo: args.flatInfo };
            this.parent.notify(events.initialLoad, {});
            this.parent.notify(events.initToolbar, {});
            return true;
        }
        return false;
    }

    private queryConfigurationEqual(left: FlatSettingsModel, right: FlatSettingsModel): boolean {
        const fields: (settings: FlatSettingsModel) => string = (settings: FlatSettingsModel) =>
            JSON.stringify((settings.columns || []).map((column: ColumnModel) =>
                [column.field, column.visible !== false, column.allowSearching !== false]));
        if (fields(left) !== fields(right)) { return false; }
        const keys: string[] = ['sortSettings', 'filterSettings', 'searchSettings', 'advancedFilterSettings',
            'aggregates', 'totalsPosition'];
        if (JSON.stringify(keys.map((key: string) => getValue(key, left))) !==
            JSON.stringify(keys.map((key: string) => getValue(key, right)))) { return false; }
        const handlers: (settings: FlatSettingsModel) => (string | CustomSummaryType)[][] =
            (settings: FlatSettingsModel) => (settings.aggregates || [])
                .map((row: AggregateRowModel) => (row.columns || []).map((column: AggregateColumnModel) => column.customAggregate));
        const previousRows: (string | CustomSummaryType)[][] = handlers(left);
        const currentRows: (string | CustomSummaryType)[][] = handlers(right);
        if (previousRows.length !== currentRows.length) { return false; }
        const rows: IterableIterator<(string | CustomSummaryType)[]> = currentRows.values();
        return previousRows.every((row: (string | CustomSummaryType)[]) => {
            const current: (string | CustomSummaryType)[] = rows.next().value;
            if (row.length !== current.length) { return false; }
            const callbacks: IterableIterator<string | CustomSummaryType> = current.values();
            return row.every((handler: string | CustomSummaryType) => handler === callbacks.next().value);
        });
    }

    /**
     * Dispatches into the existing Render owner.
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        if (!this.active || this.destroyed) { return; }
        if (this.parent.displayOption.view !== 'Table' && !this.parent.engineModule.pivotValues) {
            this.parent.engineModule.pivotValues = [];
            const source: object[] | DataManager = this.parent.dataSourceSettings.dataSource as object[] | DataManager;
            if (source instanceof DataManager) { this.parent.engineModule.data = source.dataSource.json as IDataSet[]; }
            this.parent.initEngine();
            return;
        }
        addClass([this.parent.element], 'e-pivot-flat');
        this.parent.renderModule = this.parent.renderModule || new Render(this.parent);
        this.parent.renderModule.render();
        if (this.parent.displayOption.view !== 'Table' && this.parent.pivotChartModule) {
            this.parent.pivotChartModule.loadChart(this.parent, this.parent.chartSettings);
        }
        if (this.parent.grid) {
            this.parent.grid.element.style.display = this.parent.displayOption.view === 'Chart' ? 'none' : '';
        }
        this.updateChartCaption();
        if (this.parent.pivotChartModule && this.parent.chart) { this.parent.pivotChartModule.updateView(); }
    }

    private updateChartCaption(): void {
        let caption: HTMLElement = this.parent.element.querySelector('.e-pivot-flat-chart-caption') as HTMLElement;
        const chart: Element = this.parent.element.querySelector('#' + this.parent.element.id + '_chart');
        if (!this.active || this.parent.displayOption.view !== 'Both' || !chart) {
            if (caption) { remove(caption); }
            return;
        }
        if (!caption) {
            caption = this.parent.createElement('div', { className: 'e-pivot-flat-chart-caption', attrs: { role: 'note' } });
        }
        caption.textContent = this.parent.localeObj.getConstant('flatChartCaption');
        caption.hidden = this.parent.showToolbar && this.parent.currentView !== 'Chart';
        chart.parentNode.insertBefore(caption, chart);
    }

    /**
     * Publishes completion for the committed rendering generation.
     *
     * @returns {void}
     * @hidden
     */
    public dataBound(): void {
        if (this.destroyed || !this.active) { return; }
        if (this.renderError) {
            const error: Error = this.renderError;
            this.renderError = undefined;
            this.action = undefined;
            this.info = undefined;
            this.generation++;
            Promise.resolve().then(() => {
                if (this.destroyed) { return; }
                if (this.committed) {
                    this.restore(this.committed);
                    this.store = this.committedStore;
                    this.sourceReference = this.committedReference;
                    this.sourceSchema = this.committedSchema;
                    this.columns = this.committedColumns;
                    this.query = this.committedQuery;
                    this.summaries = this.committedSummaries;
                    this.recoveryError = error;
                    this.render();
                } else {
                    this.active = false;
                    this.clearGrid();
                    this.parent.setProperties({ gridSettings: { layout: this.previousLayout } }, true);
                    this.parent.actionFailureMethod(error);
                    this.parent.notify(events.initialLoad, {});
                }
            });
            return;
        }
        if (this.recoveryError) {
            const error: Error = this.recoveryError;
            this.recoveryError = undefined;
            this.parent.actionFailureMethod(error);
            return;
        }
        if (this.candidateSettings) {
            this.committed = this.candidateSettings;
            this.committedSource = this.candidateSource;
            this.committedStore = this.store;
            this.committedReference = this.sourceReference;
            this.committedSchema = this.sourceSchema;
            this.committedLocale = this.parent.locale;
            this.committedColumns = this.columns;
            this.committedQuery = this.query;
            this.committedSummaries = this.summaries;
            this.candidateSettings = undefined;
            this.candidateSource = undefined;
        }
        const generation: number = this.generation;
        const action: string = this.action;
        const info: FlatActionInfo = this.info;
        this.action = undefined;
        this.info = undefined;
        this.parent.hideWaitingPopup();
        this.parent.notify(events.initToolbar, {});
        this.parent.trigger(events.dataBound);
        if (action && !this.destroyed && generation === this.generation) {
            let complete: string;
            switch (action) {
            case events.layoutChange:
                complete = events.layoutChanged;
                break;
            case events.flatFieldsChange:
                complete = events.flatFieldsChanged;
                break;
            case events.flatFiltering:
                complete = events.flatFiltered;
                break;
            case events.flatSorting:
                complete = events.flatSorted;
                break;
            case events.flatTotalsChange:
                complete = events.flatTotalsChanged;
                break;
            }
            this.parent.trigger(events.actionComplete, { actionName: complete, actionInfo: { flatInfo: info } });
        }
    }

    /**
     * Retains the first raw rendering failure for atomic recovery at Grid dataBound.
     *
     * @param {Error} error - Host cell-rendering failure.
     * @returns {void}
     * @hidden
     */
    public failRender(error: Error): void { this.renderError = this.renderError || error; }

    private clearGrid(): void {
        this.fields.destroy();
        this.updateChartCaption();
        if (this.parent.toolbarModule) { this.parent.toolbarModule.resetFlatToolbar(); }
        this.gridAdapter.destroy();
        const empty: Element = this.parent.element.querySelector('.e-pivot-flat-empty');
        if (empty) { remove(empty); }
        if (this.parent.grid && !this.parent.grid.isDestroyed) {
            const element: HTMLElement = this.parent.grid.element;
            this.parent.grid.destroy();
            if (element.parentElement) { remove(element); }
            this.parent.grid = undefined;
        }
        removeClass([this.parent.element], 'e-pivot-flat');
    }

    /**
     * Releases Flat state before parent-owned Grid teardown.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.output.destroy();
        this.generation++;
        this.active = false;
        this.updateChartCaption();
        this.columns = [];
        this.committed = undefined;
        this.committedSource = undefined;
        this.candidateSettings = undefined;
        this.candidateSource = undefined;
        this.committedStore = undefined;
        this.committedReference = undefined;
        this.committedColumns = [];
        this.store = undefined;
        this.query = undefined;
        this.summaries = undefined;
        this.committedQuery = undefined;
        this.committedSummaries = undefined;
        this.sourceReference = undefined;
        this.sourceSchema = undefined; this.committedSchema = undefined;
        this.committedLocale = undefined;
        this.info = undefined;
        this.fields.destroy();
        this.gridAdapter.destroy();
        removeClass([this.parent.element], 'e-pivot-flat');
    }
}
