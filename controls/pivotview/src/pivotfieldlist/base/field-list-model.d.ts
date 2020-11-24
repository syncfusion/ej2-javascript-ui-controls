import { Property, Event, Component, EmitType, Internationalization, extend, isBlazor } from '@syncfusion/ej2-base';import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration, getInstance } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties, IDrilledItem } from '../../base/engine';import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';import { AggregateEventArgs, CalculatedFieldCreateEventArgs, AggregateMenuOpenEventArgs } from '../../common/base/interface';import { FieldDroppedEventArgs, FieldListRefreshedEventArgs, FieldDropEventArgs } from '../../common/base/interface';import { FieldDragStartEventArgs, FieldRemoveEventArgs } from '../../common/base/interface';import { CommonArgs, MemberFilteringEventArgs, MemberEditorOpenEventArgs } from '../../common/base/interface';import { Mode, AggregateTypes } from '../../common/base/enum';import { PivotCommon } from '../../common/base/pivot-common';import { Render } from '../renderer/renderer';import { DialogRenderer } from '../renderer/dialog-renderer';import { TreeViewRenderer } from '../renderer/tree-renderer';import { AxisTableRenderer } from '../renderer/axis-table-renderer';import { AxisFieldRenderer } from '../renderer/axis-field-renderer';import { PivotButton } from '../../common/actions/pivot-button';import { PivotView } from '../../pivotview/base/pivotview';import { DataSourceSettingsModel, FieldOptionsModel } from '../../pivotview/model/datasourcesettings-model';import { DataSourceSettings } from '../../pivotview/model/datasourcesettings';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { PivotContextMenu } from '../../common/popups/context-menu';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { PivotUtil } from '../../base/util';import { OlapEngine, IOlapFieldListOptions, IOlapCustomProperties, IOlapField } from '../../base/olap/engine';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PivotFieldList
 */
export interface PivotFieldListModel extends ComponentModel{

    /**
     * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
     * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
     * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
     * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization. 
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicale only for OLAP data source.**
     * * `dataSource`: Allows you to set the data source to the pivot report either as JSON data collection or from remote data server using DataManager to the render the pivot that and field list. **Note: It is applicable only for relational data source.**
     * * `rows`: Allows specific fields associated with field information that needs to be displayed in row axis of pivot table.
     * * `columns`: Allows specific fields associated with field information that needs to be displayed in column axis of pivot table.
     * * `values`: Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table.
     * * `filters`: Allows to filter the values in other axis based on the collection of filter fields in pivot table.
     * * `excludeFields`: Allows you to restrict the specific field(s) from displaying it in the field list UI. 
     * You may also be unable to render the pivot table with this field(s) by doing so. **Note: It is applicable only for relational data source.**
     * * `expandAll`: Allows you to either expand or collapse all the headers that are displayed in the pivot table. 
     * By default, all the headers are collapsed in the pivot table. **Note: It is applicable only for Relational data.**
     * * `valueAxis`: Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
     * * `filterSettings`: Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
     * * `sortSettings`: Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table. 
     * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
     * * `enableSorting`: Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
     * * `formatSettings`: Allows specific fields used to display the values with specific format that used to be displayed in the pivot table. 
     * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
     * * `drilledMembers`: Allows specific fields to with specify the headers that used to be either expanded or collapsed in the pivot table.
     * * `valueSortSettings`: Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
     * * `calculatedFieldSettings`: Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * * `allowMemberFilter`: Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
     * * `allowLabelFilter`: Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
     * * `allowValueFilter`: Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
     * * `showSubTotals`: Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
     * * `showRowSubTotals`: Allows to show or hide sub-totals in row axis of the pivot table.
     * * `showColumnSubTotals`: Allows to show or hide sub-totals in column axis of the pivot table.
     * * `showGrandTotals`: Allows to show or hide grand totals in both rows and columns axis of the pivot table.
     * * `showRowGrandTotals`: Allows to show or hide grand totals in row axis of the pivot table.
     * * `showColumnGrandTotals`: Allows to show or hide grand totals in column axis of the pivot table.
     * * `showHeaderWhenEmpty`: Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data. 
     * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
     * * `alwaysShowValueHeader`: Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
     * * `conditionalFormatSettings`: Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
     * * `emptyCellsTextContent`: Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
     * * `groupSettings`: Allows specific fields to group their data on the basis of their type. 
     * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc. 
     * You can perform custom group to the string type fields that used to displayed in the pivot table.
     * * `authentication`: Allows you to set the credential information to access the specified SSAS cube. Note: It is applicable only for OLAP data source.
     */
    dataSourceSettings?: DataSourceSettingsModel;

    /**
     * Allows to show field list either in static or popup mode. The available modes are:
     * * `Popup`: To display the field list icon in pivot table UI to invoke the built-in dialog. 
     * It hepls to display over the pivot table UI without affecting any form of UI shrink within a web page.
     * * `Fixed`: To display the field list in a static position within a web page.
     * @default 'Popup'
     */
    renderMode?: Mode;

    /**
     * Allows you to set the specific target element to the fieldlist dialog. 
     * This helps the field list dialog to display the appropriate position on its target element.  
     * > To use thsi option, set the property `renderMode` to be **Popup**.
     * @default null
     */
    target?: HTMLElement | string;

    /**
     * Allows you to add the CSS class name to the field list element. 
     * Use this class name, you can customize the field list easily at your end.
     * @default ''
     */
    cssClass?: string;

    /**
     * Allows the built-in calculated field dialog to be displayed in the component. 
     * You can view the calculated field dialog by clicking the "Calculated Field" button in the field list UI. 
     * This dialog will helps you to create a new calculated field in the pivot table, based on available fields from the bound data source or using simple formula with basic arithmetic operators at runtime.
     * @default false
     */
    allowCalculatedField?: boolean;

    /**
     * Allows you to create a pivot button with "Values" as a caption used to display in the field list UI. 
     * It helps you to plot the value fields to either column or row axis during runtime.
     * > The showValuesButton property is enabled by default for the OLAP data source. 
     * And the pivot button can be displayed with "Measures" as a caption used to display in the field list UI.
     * @default false
     */
    showValuesButton?: boolean;

    /**
     * Allows the pivot table component to be updated only on demand, meaning, 
     * you can perform a variety of operations such as drag-and-drop fields between row, column, value and filter axes, 
     * apply sorting and filtering inside the Field List, resulting the field list UI would be updated on its own, but not the pivot table.
     * On clicking the “Apply” button in the Field List, the pivot table will updates the last modified report. 
     * This helps to improve the performance of the pivot table component rendering.
     * @default false
     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * Allows you to set the limit for displaying members while loading large data in the member filter dialog. 
     * Based on this limit, initial loading will be completed quickly without any performance constraint.
     * A message with remaining member count, that are not currently shown in the member filter dialog UI, will be displayed in the member editor.
     * > This property is not applicable to user-defined hierarchies in the OLAP data source.
     * @default 1000    
     */
    maxNodeLimitInMemberEditor?: number;

    /**
     * Allows to load members inside the member filter dialog on-demand. 
     * The first level members will be loaded from the OLAP cube to display the member editor by default. 
     * As a result, the member editor will be opened quickly, without any performance constraints.
     * You can use either of the following actions to load  your next level members. The actions are: 
     * * By clicking on the respective member's expander button. By doing so, only the child members of the respective member will be loaded. 
     * * Choose the level from the drop-down button. By doing so, all the members up to the level chosen will be loaded from the cube.
     * 
     * Also, searching members will only be considered for the level members that are loaded.
     * > This property is applicable only for OLAP data source.
     * @default true    
     */
    loadOnDemandInMemberEditor?: boolean;

    /**
     * Allows the appearance of the loading indicator to be customized with either an HTML string or the element’s ID, 
     * that can be used to displayed with custom formats in the field list UI.
     * @default null
     */
    spinnerTemplate?: string;

    /**
     * Allows you to show a menu with built-in aggregate options displayed in the pivot button's dropdown icon of fieldList UI. 
     * These aggregate options help to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… easily at runtime. 
     * The available aggregate options are:
     * * `Sum`: Allows to display the pivot table values with sum.
     * * `Product`: Allows to display the pivot table values with product.
     * * `Count`: Allows to display the pivot table values with count.
     * * `DistinctCount`: Allows to display the pivot table values with distinct count.
     * * `Min`: Allows to display the pivot table with minimum value.
     * * `Max`: Allows to display the pivot table with maximum value.
     * * `Avg`: Allows to display the pivot table values with average.
     * * `Index`: Allows to display the pivot table values with index.
     * * `PopulationStDev`: Allows to display the pivot table values with population standard deviation.
     * * `SampleStDev`: Allows to display the pivot table values with sample standard deviation.
     * * `PopulationVar`: Allows to display the pivot table values with population variance.
     * * `SampleVar`: Allows to display the pivot table values with sample variance.
     * * `RunningTotals`: Allows to display the pivot table values with running totals.
     * * `DifferenceFrom`: Allows to display the pivot table values with difference from the value of the base item in the base field.
     * * `PercentageOfDifferenceFrom`: Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
     * * `PercentageOfGrandTotal`: Allows to display the pivot table values with percentage of grand total of all values.
     * * `PercentageOfColumnTotal`: Allows to display the pivot table values in each column with percentage of total values for the column.
     * * `PercentageOfRowTotal`: Allows to display the pivot table values in each row with percentage of total values for the row.
     * * `PercentageOfParentTotal`: Allows to display the pivot table values with percentage of total of all values based on selected field.
     * * `PercentageOfParentColumnTotal`: Allows to display the pivot table values with percentage of its parent total in each column.
     * * `PercentageOfParentRowTotal`: Allows to display the pivot table values with percentage of its parent total in each row.
     * 
     * > It is applicable ony for Relational data.
     * @default ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar',
     * 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
     * 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom',
     * 'PercentageOfParentTotal']
     */
    /* tslint:disable-next-line:max-line-length */
    aggregateTypes?: AggregateTypes[];

    /**
     * It allows any customization of Pivot Field List properties on initial rendering.
     * Based on the changes, the pivot field list will be redered.
     * @event
     * @blazorproperty 'OnLoad'
     */
    load?: EmitType<LoadEventArgs>;

    /**
     * It triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * It triggers before the filtering applied.
     * @event
     */
    memberFiltering?: EmitType<MemberFilteringEventArgs>;

    /**
     * It triggers after the pivot engine populated and allows to customize the pivot datasource settings.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * It trigger when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * It triggers before a field drops into any axis.
     * @event
     * @blazorproperty 'fieldDrop'
     */
    fieldDrop?: EmitType<FieldDropEventArgs>;

    /**
     * It trigger when a field drag (move) starts.
     * @event
     * @blazorproperty 'FieldDragStart'
     */
    fieldDragStart?: EmitType<FieldDragStartEventArgs>;

    /**
     * It allows to change the each cell value during engine populating.
     * @event
     * @deprecated
     */
    aggregateCellInfo?: EmitType<AggregateEventArgs>;

    /**
     * It triggers before member editor dialog opens.
     * @event
     * @blazorproperty 'MemberEditorOpen'
     */
    memberEditorOpen?: EmitType<MemberEditorOpenEventArgs>;

    /**
     * It triggers before a calculated field created/edited during runtime.
     * @event
     * @blazorproperty 'CalculatedFieldCreate'
     */
    calculatedFieldCreate?: EmitType<CalculatedFieldCreateEventArgs>;

    /**
     * It triggers before aggregate type context menu opens.
     * @event
     * @blazorproperty 'AggregateMenuOpen'
     */
    aggregateMenuOpen?: EmitType<AggregateMenuOpenEventArgs>;

    /**
     * It triggers before removing the field from any axis during runtime.
     * @event
     * @blazorproperty 'FieldRemove'
     */
    fieldRemove?: EmitType<FieldRemoveEventArgs>;

    /**
     * It trigger when the Pivot Field List rendered.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * It trigger when the Pivot Field List component is created..
     * @event
     */
    created?: EmitType<Object>;

    /**
     * It trigger when the Pivot Field List component getting destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

}