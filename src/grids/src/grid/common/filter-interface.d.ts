/**
 * Defines the excel filter interface.
 */
import { Component } from '@syncfusion/ej2-base';
import { DataManager, Deferred } from '@syncfusion/ej2-data';
import { DataStateChangeEventArgs } from '../base/interface';
import { LoadingIndicatorModel } from '../base/grid-model';
import { IndicatorType } from '../base';
/** @hidden */
export interface XLColumn {
    field?: string;
}
/** @hidden */
export interface XLFilterSettings {
    columns?: XLColumn[];
    enableInfiniteScrolling?: boolean;
    itemsCount?: number;
    loadingIndicator?: IndicatorType;
}
/** @hidden */
export interface XLSearchSettings {
    key?: string;
}
/** @hidden */
export interface IXLFilter extends Component<HTMLElement> {
    filterSettings?: XLFilterSettings;
    destroyTemplate?: Function;
    getQuery?: Function;
    searchSettings?: XLSearchSettings;
    getColumnByField?: Function;
    getColumnHeaderByUid?: Function;
    dataSource?: Object[] | DataManager;
    getForeignKeyColumns?: Function;
    renderTemplates?: Function;
    allowSorting?: boolean;
    cssClass?: string;
    loadingIndicator?: LoadingIndicatorModel;
    showMaskRow?: Function;
    enableHtmlSanitizer?: boolean;
}
/** @hidden */
export interface FilterStateObj {
    state: DataStateChangeEventArgs;
    deffered: Deferred;
}
