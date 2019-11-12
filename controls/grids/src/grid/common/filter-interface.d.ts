/**
 * Defines the excel filter interface.
 */
import { Component } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
/** @hidden */
export interface XLColumn {
    field?: string;
}
/** @hidden */
export interface XLFilterSettings {
    columns?: XLColumn[];
}
/** @hidden */
export interface XLSearchSettings {
    key?: string;
}
/** @hidden */
export interface IXLFilter extends Component<HTMLElement> {
    filterSettings?: XLFilterSettings;
    isJsComponent?: boolean;
    destroyTemplate?: Function;
    getQuery?: Function;
    searchSettings?: XLSearchSettings;
    getColumnByField?: Function;
    dataSource?: Object[] | DataManager;
    getForeignKeyColumns?: Function;
}
