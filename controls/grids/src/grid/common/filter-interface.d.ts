/**
 * Defines the excel filter interface.
 */
import { Component } from '@syncfusion/ej2-base';
import { DataManager, Deferred } from '@syncfusion/ej2-data';
import { DataStateChangeEventArgs } from '../base/interface';
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
    getColumnHeaderByUid?: Function;
    dataSource?: Object[] | DataManager;
    getForeignKeyColumns?: Function;
    isReact?: boolean;
    renderTemplates?: Function;
    allowSorting?: boolean;
}
/** @hidden */
export interface FilterStateObj {
    state: DataStateChangeEventArgs;
    deffered: Deferred;
}
