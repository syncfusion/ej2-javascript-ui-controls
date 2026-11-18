import { L10n } from '@syncfusion/ej2-base';
/** @private */
export interface ColumnValidation {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    customMsg?: string;
}
/** @private */
export interface ColumnDefinition {
    field?: string;
    headerText?: string;
    type?: 'string' | 'number' | 'date' | 'boolean';
    width?: string;
    format?: string;
    validation?: ColumnValidation;
    validationRules?: {
        [key: string]: any;
    };
    isPrimaryKey?: boolean;
    allowEditing?: boolean;
    expression?: string;
    customValidation?: any[];
    editType?: string;
    [key: string]: any;
}
/** @private */
export interface ColumnBuilderOptions {
    host: HTMLElement;
    columns?: ColumnDefinition[];
    l10n: L10n;
    locale?: string;
    onChange: (value: ColumnDefinition[]) => void;
    label?: string;
    isConditionData?: boolean;
    name?: string;
    fieldSuggestions?: string[];
    formSchema?: any;
    enableRtl?: boolean;
}
/** @private */
export declare class ColumnBuilder {
    private host;
    private columns;
    private l10n;
    private locale;
    private onChange;
    private rows;
    private nextId;
    private expandedId;
    private label;
    private isConditionData;
    private accordion;
    private accordionOpen;
    private controls;
    private destroyed;
    private fieldSuggestions;
    private formSchema;
    private name;
    private dataSourceKeys;
    private props;
    constructor(opts: ColumnBuilderOptions);
    /** @private */
    render(): void;
    /** @private */
    destroy(): void;
    private normalizeRows;
    private mapTypeToEditType;
    private getConstant;
    private extractDataSourceKeys;
    private createColumnEditor;
    private renderNumericRule;
    private renderDateRule;
    private resolveNumericValue;
    private resolveDateValue;
    private handleAddRow;
    private handleDeleteRow;
    private updateRow;
    private updateValidationRule;
    private handlePrimaryKey;
    private hasOtherPrimaryKey;
    private emitRows;
    private destroyControls;
}
