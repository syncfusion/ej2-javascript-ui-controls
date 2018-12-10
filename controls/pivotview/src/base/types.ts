/** 
 * Defines directions of Sorting. They are
 * * Ascending
 * * Descending 
 * * None
 */
export type Sorting =
    /**  Defines sort direction as Ascending */
    'Ascending' |
    /**  Defines sort direction as Descending */
    'Descending' |
    /**  Defines sort direction as None */
    'None';

/**
 * Defines the aggregate types. 
 */
export type SummaryTypes =
    /** Defines sum aggregate type */
    'Sum' |
    /** Defines product aggregate type */
    'Product' |
    /** Specifies count aggregate type */
    'Count' |
    /** Specifies distinct count aggregate type */
    'DistinctCount' |
    /** Specifies minimum aggregate type */
    'Min' |
    /** Specifies maximum aggregate type */
    'Max' |
    /** Specifies average aggregate type */
    'Avg' |
    /** Specifies index aggregate type */
    'Index' |
    /** Specifies percentage of grand totals of total aggregate type */
    'PercentageOfGrandTotal' |
    /** Specifies percentage of grand column total aggregate type */
    'PercentageOfColumnTotal' |
    /** Specifies percentage of grand row total aggregate type */
    'PercentageOfRowTotal' |
    /** Specifies percentage of grand parent row total aggregate type */
    'PercentageOfParentRowTotal' |
    /** Specifies percentage of grand parent column total aggregate type */
    'PercentageOfParentColumnTotal' |
    /** Specifies percentage of grand parent total aggregate type */
    'PercentageOfParentTotal' |
    /** Specifies running totals aggregate type */
    'RunningTotals' |
    /** Specifies standard deviation of population aggregate type */
    'PopulationStDev' |
    /** Specifies sample standard deviation aggregate type */
    'SampleStDev' |
    /** Specifies variance of population aggregate type */
    'PopulationVar' |
    /** Specifies sample variance aggregate type */
    'SampleVar' |
    /** Specifies difference from aggregate type */
    'DifferenceFrom' |
    /** Specifies % of difference from aggregate type */
    'PercentageOfDifferenceFrom' |
    /** Specifies 'CalculatedField' aggregate type for calculated fields */
    'CalculatedField';

/** 
 * Defines types of Filter
 * * Include - Specifies the filter type as include.
 * * Exclude - Specifies the filter type as exclude.
 * * Label - Specifies the filter type as label.
 * * Date - Specifies the filter type as date.
 * * Number - Specifies the filter type as number.
 * * Value - Specifies the filter type as value.
 */
export type FilterType =
    /**  Defines filter type as 'Include' for member filter */
    'Include' |
    /**  Defines filter type as 'Exclude' for member filter */
    'Exclude' |
    /**  Defines filter type as 'Label' for header filter */
    'Label' |
    /**  Defines filter type as 'Label' for date based filter */
    'Date' |
    /**  Defines filter type as 'Label' for number based filter */
    'Number' |
    /**  Defines filter type as 'Label' for value based filter */
    'Value';

export type Operators =
    'Equals' |
    'DoesNotEquals' |
    'BeginWith' |
    'DoesNotBeginWith' |
    'EndsWith' |
    'DoesNotEndsWith' |
    'Contains' |
    'DoesNotContains' |
    'GreaterThan' |
    'GreaterThanOrEqualTo' |
    'LessThan' |
    'LessThanOrEqualTo' |
    'Before' |
    'BeforeOrEqualTo' |
    'After' |
    'AfterOrEqualTo' |
    'Between' |
    'NotBetween';

export type LabelOperators =
    'Equals' |
    'DoesNotEquals' |
    'BeginWith' |
    'DoesNotBeginWith' |
    'EndsWith' |
    'DoesNotEndsWith' |
    'Contains' |
    'DoesNotContains' |
    'GreaterThan' |
    'GreaterThanOrEqualTo' |
    'LessThan' |
    'LessThanOrEqualTo' |
    'Between' |
    'NotBetween';

export type ValueOperators =
    'Equals' |
    'DoesNotEquals' |
    'GreaterThan' |
    'GreaterThanOrEqualTo' |
    'LessThan' |
    'LessThanOrEqualTo' |
    'Between' |
    'NotBetween';

export type DateOperators =
    'Equals' |
    'DoesNotEquals' |
    'Before' |
    'BeforeOrEqualTo' |
    'After' |
    'AfterOrEqualTo' |
    'Between' |
    'NotBetween';
export type Condition =
    'LessThan' |
    'GreaterThan' |
    'LessThanOrEqualTo' |
    'GreaterThanOrEqualTo' |
    'Equals' |
    'NotEquals' |
    'Between' |
    'NotBetween';