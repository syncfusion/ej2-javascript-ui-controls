import { Property, Event, Component, EmitType, Internationalization, extend, isBlazor } from '@syncfusion/ej2-base';import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration, getInstance } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties } from '../../base/engine';import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs, AggregateEventArgs } from '../../common/base/interface';import { FieldDroppedEventArgs, FieldListRefreshedEventArgs } from '../../common/base/interface';import { Mode } from '../../common/base/enum';import { PivotCommon } from '../../common/base/pivot-common';import { CommonArgs, MemberFilteringEventArgs } from '../../common/base/interface';import { Render } from '../renderer/renderer';import { DialogRenderer } from '../renderer/dialog-renderer';import { TreeViewRenderer } from '../renderer/tree-renderer';import { AxisTableRenderer } from '../renderer/axis-table-renderer';import { AxisFieldRenderer } from '../renderer/axis-field-renderer';import { PivotButton } from '../../common/actions/pivot-button';import { PivotView } from '../../pivotview/base/pivotview';import { DataSourceSettingsModel, FieldOptionsModel } from '../../pivotview/model/datasourcesettings-model';import { DataSourceSettings } from '../../pivotview/model/datasourcesettings';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { PivotContextMenu } from '../../common/popups/context-menu';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { PivotUtil } from '../../base/util';import { OlapEngine, IOlapFieldListOptions, IOlapCustomProperties, IOlapField } from '../../base/olap/engine';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PivotFieldList
 */
export interface PivotFieldListModel extends ComponentModel{

    /**
     * It allows to feed raw data, dataSource and properties to customize the data source
     */
    dataSourceSettings?: DataSourceSettingsModel;

    /**
     * It allows to render Pivot Field List at fixed or popup mode.
     * The possible values are:
     * @default 'Popup'
     */
    renderMode?: Mode;

    /**
     * Specifies the `target` element where the Pivot Field List dialog should be displayed.
     * If the user set the specific `target` element for Pivot Field List, it will be positioned based on the `target`.
     * The targetID should works only when the Pivot Field List is in 'Dynamic' mode.
     * @default null
     */
    target?: HTMLElement | string;

    /**
     * Specifies the CSS class name to be added for Pivot Field List element.
     * User can add single or multiple CSS classes.
     * @default ''
     */
    cssClass?: string;

    /**
     * It allows to enable calculated field in Pivot Field List.
     * @default false
     */
    allowCalculatedField?: boolean;

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    showValuesButton?: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotfieldlist.
     * @default false
     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    maxNodeLimitInMemberEditor?: number;

    /**
     * If `loadOnDemandInMemberEditor` is set to false, 
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube 
     * while the member editor pop-up opens for the first time alone.
     * @default true    
     */
    loadOnDemandInMemberEditor?: boolean;

    /**
     * It allows to customize the spinner.
     * @default null
     */
    spinnerTemplate?: string;

    /**
     * This allows any customization of Pivot Field List properties before rendering.
     * @event
     * @blazorproperty 'OnLoad'
     */
    load?: EmitType<LoadEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * This event triggers before apply filtering.
     * @event
     */
    memberFiltering?: EmitType<MemberFilteringEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * This allows to change the cell value.
     * @event
     * @deprecated
     */
    aggregateCellInfo?: EmitType<AggregateEventArgs>;

    /**
     * Triggers when data source is populated in the Pivot Field List.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when data source is created in the Pivot Field List.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when data source is destroyed in the Pivot Field List.
     * @event
     */
    destroyed?: EmitType<Object>;

}