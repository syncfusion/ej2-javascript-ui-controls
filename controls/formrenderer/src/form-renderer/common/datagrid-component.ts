import {
    Grid,
    Edit,
    Toolbar,
    Page,
    Resize,
    Sort,
    Filter,
    ActionEventArgs,
    GridColumnModel
} from '@syncfusion/ej2-grids';
import { GridExpressions } from './expressions/grid-expressions';
import { CustomValidationEngine } from './custom-validation-engine';

/**
 * @private
 */
export interface GridColumn {
    field: string;
    headerText?: string;
    type?: 'string' | 'number' | 'boolean' | 'date' | 'datetime';
    isPrimaryKey?: boolean;
    width?: number | string;
    format?: string;
    editType?: string;
    allowEditing?: boolean;
    expression?: string;
    validationRules?: any;
    customValidation?: { expression: string }[];
}

/**
 * @private
 */
export interface GridComponentSchema {
    id?: string;
    columns?: GridColumn[];
    dataSource?: Record<string, any>[];
    height?: string | number;
    width?: string | number;
    locale?: string;
    cssClass?: string;
    pageSize?: number;
    allowPaging?: boolean;
    allowAdding?: boolean;
    allowEditing?: boolean;
    allowDeleting?: boolean;
    allowFiltering?: boolean;
}

/**
 * @private
 */
export interface DataGridRef {
    getGridData: () => Record<string, any>[];
    gridRef: { current: Grid | null };
}

/**
 * @private
 * Constructor options for `DataGridComponent`.
 */
export interface DataGridComponentOptions extends GridComponentSchema {
    isPreviewMode?: boolean;
    onDataChange?: (data: Record<string, any>[]) => void;
    enableRtl?: boolean;
    target?: HTMLElement;
    ref?: any;
}

/**
 * @private
 *
 * `DataGridComponent` is the Category C native reimplementation of
 * `Common/DataGridComponent.tsx` using the EJ2 `Grid` (with `Edit`,
 * `Toolbar`, `Page`, `Resize`, `Sort`, `Filter` inject modules).
 *
 * Reproduces:
 *  - internal current-data state seeded from `dataSource`;
 *  - calculated/expression columns (disable `allowEditing`, recompute on
 *    sibling field change via edit `change` params, update UI value by
 *    column type);
 *  - per-column custom validation merged into `validationRules`
 *    (required + custom validator via `CustomValidationEngine`);
 *  - dynamic toolbar (`Add`/`Edit`/`Delete` conditional + always
 *    `Update`/`Cancel`);
 *  - `actionComplete` → sync state + `onDataChange` callback;
 *  - `getGridData()` equivalent;
 *  - column mapping (`field, headerText, type, isPrimaryKey, width,
 *    format (date default 'MM/dd/yyyy'), editType, allowEditing`);
 *  - `filterSettings.mode='Immediate'`.
 */
export class DataGridComponent {
    private id?: string;
    private columns: GridColumn[];
    private dataSource: Record<string, any>[];
    private height: string | number;
    private width: string | number;
    private locale: string | undefined;
    private cssClass: string | undefined;
    private pageSize: number;
    private allowPaging: boolean;
    private allowAdding: boolean;
    private allowEditing: boolean;
    private allowDeleting: boolean;
    private allowFiltering: boolean;
    private onDataChange: ((data: Record<string, any>[]) => void) | undefined;
    private isPreviewMode: boolean | undefined;
    private enableRtl: boolean | undefined;
    private ref: Function;

    private currentData: Record<string, any>[];
    private grid: Grid | null = null;
    private gridExpressions: GridExpressions;
    private validationEngine: CustomValidationEngine;
    private wrapper: HTMLDivElement | null = null;

    constructor(options: DataGridComponentOptions) {
        this.id = options.id;
        this.columns = options.columns || [];
        this.dataSource = Array.isArray(options.dataSource) ? options.dataSource : [];
        this.height = options.height != null ? options.height : '200px';
        this.width = options.width != null ? options.width : '100%';
        this.locale = options.locale;
        this.cssClass = options.cssClass;
        this.pageSize = options.pageSize != null ? options.pageSize : 6;
        this.allowPaging = options.allowPaging !== false;
        this.allowAdding = options.allowAdding !== false;
        this.allowEditing = options.allowEditing !== false;
        this.allowDeleting = options.allowDeleting !== false;
        this.allowFiltering = options.allowFiltering === true;
        this.onDataChange = options.onDataChange;
        this.isPreviewMode = options.isPreviewMode;
        this.enableRtl = options.enableRtl;
        this.ref = options.ref;

        this.currentData = Array.isArray(this.dataSource) ? this.dataSource : [];
        this.gridExpressions = new GridExpressions();
        this.validationEngine = new CustomValidationEngine();
    }

    private get calculatedColumns(): GridColumn[] {
        return this.gridExpressions.extractCalculatedColumns(this.columns);
    }

    private get hasExpressions(): boolean {
        return this.calculatedColumns.length > 0;
    }

    /**
     * Map React custom validation to a Syncfusion-style custom validator
     * closure. Mirrors `mapCustomValidationToSyncfusion`.
     */
    private mapCustomValidationToSyncfusion = (col: GridColumn): ((value: any) => boolean) | undefined => {
        if (!col.customValidation || col.customValidation.length === 0) {
            return undefined;
        }
        return (value: any): boolean => {
            const formObj: any = this.grid && (this.grid as any).editModule ? (this.grid as any).editModule.formObj : null;
            if (!formObj) { return true; }

            const rowContext: Record<string, any> = {};
            (this.columns || []).forEach((gridCol: GridColumn) => {
                const input: any = formObj.getInputElement(gridCol.field);
                if (input) {
                    const v: any = input.value;
                    rowContext[gridCol.field] = gridCol.type === 'number' ? parseInt(v, 10) : v;
                }
            });

            for (const rule of col.customValidation!) {
                if (!rule.expression) { continue; }
                const fieldValue: any = col.type === 'number' ? parseInt(value.value, 10) : value.value;
                const result: any = this.validationEngine.validate(rule.expression, fieldValue, rowContext as any);
                return result === true;
            }
            return true;
        };
    };

    /**
     * Create edit params attaching a `change` callback for non-calculated
     * columns that have calc dependents. Mirrors `createEditParams`.
     */
    private createEditParams = (col: GridColumn): any => {
        if (!this.hasExpressions) { return undefined; }
        const calculatedCols: GridColumn[] = this.calculatedColumns;
        const hasDependents: boolean = calculatedCols.some((calcCol: GridColumn) => {
            if (!calcCol.expression) { return false; }
            return calcCol.expression.indexOf(`{${col.field}}`) !== -1;
        });
        if (!hasDependents) { return undefined; }

        return {
            params: {
                change: () => {
                    if (!this.grid || !this.grid.element) { return; }
                    const form: HTMLFormElement | null = this.grid.element.querySelector('form');
                    if (!form || !(form as any).ej2_instances || !(form as any).ej2_instances[0]) { return; }
                    const formInstance: any = (form as any).ej2_instances[0];

                    calculatedCols.forEach((calcCol: GridColumn) => {
                        const input: any = formInstance.getInputElement(calcCol.field);
                        if (!input) { return; }
                        try {
                            const rowValues: Record<string, any> = {};
                            this.columns.forEach((c: GridColumn) => {
                                const fieldInput: any = formInstance.getInputElement(c.field);
                                if (fieldInput) {
                                    rowValues[c.field] = fieldInput.value;
                                }
                            });
                            const result: Record<string, any> = this.gridExpressions.evaluateRowExpressions(rowValues, this.columns);
                            const calculatedValue: any = result[calcCol.field];
                            if (calculatedValue !== undefined && calculatedValue !== null) {
                                if (calcCol.type === 'boolean') {
                                    input.checked = !!calculatedValue;
                                } else if (calcCol.type === 'number') {
                                    const wrapper: HTMLElement | null = input.closest('.e-control-wrapper');
                                    const numericInput: any = wrapper ? wrapper.querySelector('input.e-control:not([type="hidden"])') : null;
                                    if (numericInput && numericInput.ej2_instances && numericInput.ej2_instances[0]) {
                                        numericInput.ej2_instances[0].value = calculatedValue;
                                    } else {
                                        input.value = calculatedValue;
                                    }
                                } else if (calcCol.type === 'date') {
                                    input.ej2_instances[0].value = new Date(calculatedValue);
                                } else {
                                    input.value = calculatedValue;
                                }
                            }
                        } catch {
                        }
                    });
                }
            }
        };
    };

    /**
     * Sync the working data on `actionComplete`. Mirrors `handleActionComplete`.
     */
    private handleActionComplete = (args: ActionEventArgs): void => {
        if (!this.grid) { return; }
        const eventType: any = args.requestType;
        switch (eventType) {
            case 'save':
            case 'delete':
            case 'add': {
                if (this.grid.dataSource) {
                    const updatedData: Record<string, any>[] = Array.isArray(this.grid.dataSource as any)
                        ? (this.grid.dataSource as any)
                        : [];
                    this.currentData = updatedData;
                    if (this.onDataChange) { this.onDataChange(updatedData); }
                }
                break;
            }
            default:
                break;
        }
    };

    /**
     * Build the dynamic toolbar array. Mirrors `buildToolbar`.
     */
    private buildToolbar(): any[] {
        const items: any[] = [];
        if (this.allowAdding) { items.push('Add'); }
        if (this.allowEditing) { items.push('Edit'); }
        if (this.allowDeleting) { items.push('Delete'); }
        items.push('Update', 'Cancel');
        return items;
    }

    /**
     * Map a GridColumn to the EJ2 Grid column model, merging standard + custom
     * validation rules and disabling editing on expression / no-edit columns.
     */
    private mapColumn(col: GridColumn): GridColumnModel {
        const validationRules: any = col.validationRules ? { ...col.validationRules } : {};
        const customValidator: ((value: any) => boolean) | undefined = this.mapCustomValidationToSyncfusion(col);
        if (customValidator) {
            const errorMessage: string = col.customValidation && col.customValidation[0] && col.customValidation[0].expression
                ? ((this.validationEngine as any).parseExpression
                    ? (this.validationEngine as any).parseExpression(col.customValidation[0].expression).errorMessage
                    : 'Validation failed') || 'Validation failed'
                : 'Validation failed';
            validationRules.required = [true, errorMessage];
            validationRules.custom = [customValidator, errorMessage];
        }
        return {
            field: col.field,
            headerText: col.headerText,
            type: col.type || 'string',
            isPrimaryKey: col.isPrimaryKey || false,
            width: col.width,
            format: col.type === 'date' ? (col.format || 'MM/dd/yyyy') : col.format,
            editType: col.editType,
            allowEditing: col.allowEditing !== false && !col.expression,
            validationRules: validationRules,
            edit: this.createEditParams(col) as any
        } as GridColumnModel;
    }

    /**
     * Build the grid element, instantiate `Grid`, inject services and append
     * to the target/created container. Returns the wrapper element.
     */
    public render(targetOrHost?: HTMLElement): HTMLElement {
        // Normalize initial currentData with expression evaluation
        const normalized: Record<string, any>[] = Array.isArray(this.dataSource) ? this.dataSource : [];
        if (this.hasExpressions && normalized.length > 0) {
            this.currentData = normalized.map((row: Record<string, any>) => {
                const result: Record<string, any> = this.gridExpressions.evaluateRowExpressions(row, this.columns);
                return { ...row, ...result };
            });
        } else {
            this.currentData = normalized;
        }

        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.className = 'datagrid-wrapper';
        wrapper.style.width = typeof this.width === 'string' ? this.width : `${this.width}px`;
        wrapper.style.height = 'auto';

        const gridHost: HTMLDivElement = document.createElement('div');
        gridHost.className = 'datagrid-grid';
        wrapper.appendChild(gridHost);

        if (this.id) { gridHost.id = this.id; }

        const grid: Grid = new Grid({
            dataSource: this.currentData,
            allowPaging: this.allowPaging,
            filterSettings: { mode: 'Immediate' } as any,
            pageSettings: { pageSize: this.pageSize } as any,
            editSettings: {
                allowEditing: this.allowEditing,
                allowAdding: this.allowAdding,
                allowDeleting: this.allowDeleting,
                mode: 'Normal'
            } as any,
            enableRtl: this.enableRtl,
            locale: this.locale || 'en-US',
            cssClass: this.cssClass,
            toolbar: this.buildToolbar(),
            actionComplete: this.handleActionComplete,
            height: typeof this.height === 'string' ? this.height : `${this.height}px`,
            width: typeof this.width === 'string' ? this.width : `${this.width}px`,
            allowSorting: true,
            allowFiltering: this.allowFiltering,
            allowSelection: true,
            columns: (this.columns || []).map((c: GridColumn) => this.mapColumn(c))
        });
        grid.appendTo(gridHost);
        this.ref(grid);

        // Inject the required modules into the Grid prototype (executed once
        // at module load — see the static `Grid.Inject(...)` call at the
        // bottom of this file).
        this.grid = grid;

        if (targetOrHost) { targetOrHost.appendChild(wrapper); }
        this.wrapper = wrapper;
        return wrapper;
    }

    /**
     * @private
     */
    public getRef(): DataGridRef {
        return {
            getGridData: () => this.currentData,
            gridRef: { current: this.grid }
        };
    }

    /**
     * Equivalent of `getGridData()`.
     */
    public getGridData(): Record<string, any>[] {
        return this.currentData;
    }

    /**
     * Recompute expression-bearing rows from fresh `dataSource` (mirrors the
     * useEffect on `[dataSource, hasExpressions, columns, ...]`).
     */
    public setDataSource(dataSource: Record<string, any>[]): void {
        if (!this.grid) { return; }
        const normalized: Record<string, any>[] = Array.isArray(dataSource) ? dataSource : [];
        if (this.hasExpressions && normalized.length > 0) {
            this.currentData = normalized.map((row: Record<string, any>) => {
                const r: Record<string, any> = this.gridExpressions.evaluateRowExpressions(row, this.columns);
                return { ...row, ...r };
            });
        } else {
            this.currentData = normalized;
        }
        this.grid.dataSource = this.currentData as any;
        if ((this.grid as any).refreshBatchData) {
            (this.grid as any).setProperties({ dataSource: this.currentData }, true);
        } else {
            (this.grid as any).dataSource = this.currentData;
        }
        if ((this.grid as any).refresh) { (this.grid as any).refresh(); }
    }

    /**
     * Re-detect columns; refresh the grid (mirrors the useEffect on columns).
     */
    public setColumns(columns: GridColumn[]): void {
        if (!this.grid) { return; }
        if (!columns || columns.length === 0) {
            (this.grid as any).columns = [];
        } else if ((this.grid as any).columns.length === 0 && columns && columns.length === 1) {
            (this.grid as any).columns = columns as GridColumnModel[];
        }
        this.columns = columns;
        if ((this.grid as any).refresh && !this.isPreviewMode) {
            if (this.dataSource && Array.isArray(this.dataSource) && this.dataSource.length > 0 && !this.hasExpressions) {
                (this.grid as any).dataSource = this.dataSource;
            }
            (this.grid as any).refresh();
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.grid) {
            try { this.grid.destroy(); } catch (e) { /* ignore */ }
            this.grid = null;
        }
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
        this.wrapper = null;
        this.gridExpressions = null as any;
        this.validationEngine = null as any;
        this.currentData = [];
        this.columns = [];
        this.dataSource = [];
    }
}

export default DataGridComponent;

Grid.Inject(Edit, Toolbar, Page, Resize, Sort, Filter);
