import { Property, Complex, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IDataSet, IDataOptions, IFieldOptions, IFilter, ISort, ICalculatedFieldSettings } from '../../base/engine';
import { IDrillOptions, IValueSortSettings, IFormatSettings, IConditionalFormatSettings } from '../../base/engine';
import { SummaryTypes, Sorting, FilterType, Operators, Condition } from '../../base/types';
import { IStyle } from '../../base/engine';
import { FieldOptionsModel, FilterModel, SortModel, FormatSettingsModel } from './dataSource-model';
import { DrillOptionsModel, ValueSortSettingsModel, CalculatedFieldSettingsModel } from './dataSource-model';
import { DataManager } from '@syncfusion/ej2-data';
import { ConditionalFormatSettingsModel } from './dataSource-model';

/** 
 * Configures the fields in dataSource. 
 */
export class FieldOptions extends ChildProperty<FieldOptions> implements IFieldOptions {

    /**
     * It allows to set field name.
     */
    @Property()
    public name: string;

    /**
     * It allows to set field caption.
     */
    @Property()
    public caption: string;

    /**
     * It allows to set the summary type of the field. The available types are,
     * * `Sum`: The summary cells calculated by the sum of its cells. 
     * * `Count`: The summary cells calculated by the count of its cells.
     * * `Min`: The summary cells shows the value which is the minimum value of its cells. 
     * * `Max`: The summary cells shows the value which is the maximum value of its cells.
     * * `Percentage`: The summary cells displays in percentage format.
     * * `Avg`: The summary cells calculated by the average of its cells.
     * * `CalculatedField`: It should set to include calculated fields.
     * @default Sum
     */
    @Property('Sum')
    public type: SummaryTypes;

    /**
     * It allows to set the axis to render the field in it.
     */
    @Property()
    public axis: string;

    /**
     * It allows to display all the items of its field even any items haven't data in its row/column intersection in data source.
     * @default false
     */
    @Property(false)
    public showNoDataItems: boolean;
}

export class FieldListFieldOptions extends FieldOptions { }

/** 
 * Configures the style settings. 
 */
export class Style extends ChildProperty<Style> implements IStyle {
    /**
     * It allows to set the background color.
     */
    @Property()
    public backgroundColor: string;

    /**
     * It allows to set the color.
     */
    @Property()
    public color: string;

    /**
     * It allows to set the font family.
     */
    @Property()
    public fontFamily: string;

    /**
     * It allows to set the font size.
     */
    @Property()
    public fontSize: string;
}

/** 
 * Configures the filter settings. 
 */
export class Filter extends ChildProperty<Filter> implements IFilter {

    /**
     * It allows to set the field name.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the filter type.
     * @default Include
     */
    @Property('Include')
    public type: FilterType;

    /**
     * It allows to set the filter items.
     */
    @Property()
    public items: string[];

    /**
     * It allows to set the filter conditions to the field.
     * @default DoesNotEquals
     */
    @Property('DoesNotEquals')
    public condition: Operators;

    /**
     * It allows to set filter operand value for condition evaluation with single label.
     */
    @Property()
    public value1: string | Date;

    /**
     * It allows to set filter operand value for between condition evaluation.
     */
    @Property()
    public value2: string | Date;

    /**
     * It allows to set value field for evaluation using conditions and operands.
     */
    @Property()
    public measure: string;
}

/** 
 * Configures the conditional format settings.
 */
export class ConditionalFormatSettings extends ChildProperty<ConditionalFormatSettings> implements IConditionalFormatSettings {

    /**
     * It allows to set the field name to apply conditional format.
     */
    @Property()
    public measure: string;

    /**
     * It allows to set the label name to apply conditional format.
     */
    @Property()
    public label: string;

    /**
     * It allows to set the conditions to apply format.
     */
    @Property()
    public conditions: Condition;

    /**
     * It allows to set the value1 to apply format.
     */
    @Property()
    public value1: number;

    /**
     * It allows to set the value2 to apply format.
     */
    @Property()
    public value2: number;

    /**
     * It allows to set the style to apply.
     */
    @Property()
    public style: IStyle;
}

/**
 * Configures the sort settings. 
 */
export class Sort extends ChildProperty<Sort> implements ISort {

    /**
     * It allows to set the field name to sort.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.
     * @default Ascending
     */
    @Property('Ascending')
    public order: Sorting;
}

/** 
 * Configures the format settings of value fields. 
 */
export class FormatSettings extends ChildProperty<FormatSettings> implements NumberFormatOptions, DateFormatOptions, IFormatSettings {

    /**
     * It allows to set the field name to apply format settings.
     */
    @Property()
    public name: string;

    /**
     * It allows to specify minimum fraction digits in formatted value.
     */
    @Property()
    public minimumFractionDigits: number;

    /**
     * It allows to specify maximum fraction digits in formatted value.
     */
    @Property()
    public maximumFractionDigits: number;

    /**
     * It allows to specify minimum significant digits in formatted value.
     */
    @Property()
    public minimumSignificantDigits: number;

    /**
     * It allows to specify maximum significant digits in formatted value.
     */
    @Property()
    public maximumSignificantDigits: number;

    /**
     * It allows to specify whether to use grouping or not in formatted value,
     * @default true
     */
    @Property(true)
    public useGrouping: boolean;

    /**
     * It allows to specify the skeleton for perform formatting.
     */
    @Property()
    public skeleton: string;

    /**
     * It allows to specify the type of date formatting either date, dateTime or time.
     */
    @Property()
    public type: string;

    /**
     * It allows to specify the currency code to be used for formatting.
     */
    @Property()
    public currency: string;

    /**
     * It allows to specify minimum integer digits in formatted value.
     */
    @Property()
    public minimumIntegerDigits: number;

    /**
     * It allows to specify custom number format for formatting.
     */
    @Property()
    public format: string;
}

/** 
 * Configures the calculatedfields settings. 
 */
export class CalculatedFieldSettings extends ChildProperty<CalculatedFieldSettings> implements ICalculatedFieldSettings {

    /**
     * It allows to set the field name to sort.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the formula for calculated fields. 
     */
    @Property()
    public formula: string;
}

/** 
 * Configures drilled state of field members. 
 */
export class DrillOptions extends ChildProperty<DrillOptions> implements IDrillOptions {

    /**
     * It allows to set the field name whose members to be drilled.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the members to be drilled.
     */
    @Property()
    public items: string[];
}

/** 
 * Configures value sort settings. 
 */
export class ValueSortSettings extends ChildProperty<ValueSortSettings> implements IValueSortSettings {

    /**
     * It allows to set the members name to achieve value sorting based on this.
     */
    @Property()
    public headerText: string;

    /**
     * It allows to set the delimiters to separate the members.
     * @default '.'
     */
    @Property('.')
    public headerDelimiter: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.
     * @default None
     */
    @Property('None')
    public sortOrder: Sorting;

    /** @hidden */
    public columnIndex: number;
}

/** 
 * Configures the settings of dataSource. 
 */
export class DataSource extends ChildProperty<DataSource> implements IDataOptions {

    /**
     * It allows to set the data source.
     */
    @Property()
    public data: IDataSet[] | DataManager;

    /**
     * It allows to set the row fields.
     * @default []
     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public rows: FieldOptionsModel[];

    /**
     * It allows to set the column fields.
     * @default []
     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public columns: FieldOptionsModel[];

    /**
     * It allows to set the value fields.
     * @default []
     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public values: FieldOptionsModel[];

    /**
     * It allows to set the filter fields.
     * @default []
     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public filters: FieldOptionsModel[];

    /**
     * It allows to set the expanded state of headers.
     * @default false
     */
    @Property(false)
    public expandAll: boolean;

    /**
     * It allows to set the value fields in both column and row axis.
     * @default 'column'
     */
    @Property('column')
    public valueAxis: string;

    /**
     * It allows to set the settings of filtering operation.
     * @default []
     */
    @Collection<FilterModel[]>([], Filter)
    public filterSettings: FilterModel[];

    /**
     * It allows to set the settings of sorting operation.
     * @default []
     */
    @Collection<SortModel[]>([], Sort)
    public sortSettings: SortModel[];

    /**
     * It allows sorting operation UI.
     * @default true
     */
    @Property(true)
    public enableSorting: boolean;

    /**
     * It allows excel-like label filtering operation.
     * @default false
     */
    @Property(false)
    public allowLabelFilter: boolean;

    /**
     * It allows excel-like value filtering operation.
     * @default false
     */
    @Property(false)
    public allowValueFilter: boolean;
    /**
     * It allows to set the settings of number formatting.
     * @default []
     */
    @Property([])
    public formatSettings: FormatSettingsModel[];

    /**
     * It allows to set the drilled state for desired field members.
     * @default []
     */
    @Collection<DrillOptionsModel[]>([], DrillOptions)
    public drilledMembers: DrillOptionsModel[];

    /**
     * It allows to set the settings of value sorting operation.
     */
    @Complex<ValueSortSettingsModel>({}, ValueSortSettings)
    public valueSortSettings: ValueSortSettingsModel;

    /**
     * It allows to set the settings of calculated field operation.
     * @default []
     */
    @Collection<CalculatedFieldSettingsModel[]>([], CalculatedFieldSettings)
    public calculatedFieldSettings: CalculatedFieldSettingsModel[];

    /**
     * It allows to set the settings of Conditional Format operation.
     * @default []
     */
    @Collection<ConditionalFormatSettingsModel[]>([], ConditionalFormatSettings)
    public conditionalFormatSettings: ConditionalFormatSettingsModel[];
}
