import { SfPivotView } from '../pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';
import { IOlapFieldListOptions } from '../../src/base/olap/engine';
import { DataSourceSettingsModel } from '../../src/pivotview/model/datasourcesettings-model';
import { GridSettings } from '../../src/pivotview/model/gridsettings';
import { DisplayOption, GroupingBarSettings, HyperlinkSettings } from '../../src/pivotview/base/pivotview';
import { CellEditSettings } from '../../src/pivotview/base/pivotview';
import { IPageSettings } from '../../src/base/engine';

/**
 * Interface
 */
export interface BlazorPivotElement extends HTMLElement {
    blazor__instance: SfPivotView | SfPivotFieldList;
}

export interface IPivotOptions {
    enableRtl: boolean;
    locale: string;
    dataType: string;
    height: string | number;
    width: string | number;
    showFieldList: boolean;
    showGroupingBar: boolean;
    allowGrouping: boolean;
    showToolbar: boolean;
    allowDrillThrough: boolean;
    allowConditionalFormatting: boolean;
    enableVirtualization: boolean;
    allowCalculatedField: boolean;
    enableValueSorting: boolean;
    dataSourceSettings: DataSourceSettingsModel;
    displayOptions: DisplayOption;
    groupingBarsettings: GroupingBarSettings;
    gridSettings: GridSettings;
    pageSettings: IPageSettings;
    editSettings: CellEditSettings;
    hyperlinkSettings: HyperlinkSettings;
    fieldList: IOlapFieldListOptions;
    isEmptyData: boolean;
    renderGrid: boolean;
    isEnginePopulated: boolean;
    /* tslint:disable */
    internalGrid: any;
    /* tslint:enable */
    fieldListModule: BlazorPivotElement;
    pivotGridModule: BlazorPivotElement;
}

export interface TreeData {
    actualText?: string;
    caption?: string;
    expanded?: boolean;
    hasChildren?: boolean;
    htmlAttributes?: { [key: string]: Object };
    iconCss?: string;
    id?: string;
    index?: number;
    isSelected?: boolean;
    name?: string;
    pid?: string;
    tag?: string;
}

export interface ScrollPageInfo {
    columnCount?: number;
    rowCount?: number;
    colFirstLvl?: number;
    rowFirstLvl?: number;
    rowStartPos?: number;
    colStartPos?: number;
}