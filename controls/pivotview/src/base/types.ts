/**
 * Allows to apply sorting to the specified field either by ascending or descending or JSON order. The types are,
 * ```props
 * Ascending :- Allows to display the field members in ascending order.
 * Descending :- Allows to display the field members in descending order.
 * None :- It allows to display the field members based on JSON order.
 * ```
 */
export type Sorting =
    /**  Allows to display the field members in ascending order. */
    'Ascending' |
    /**  Allows to display the field members in descending order. */
    'Descending' |
    /**  It allows to display the field members based on JSON order. */
    'None';

/**
 * Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… The available types are,
 * ```props
 * Sum :- Allows to display the pivot table values with sum.
 * Product :- Allows to display the pivot table values with product.
 * Count :- Allows to display the pivot table values with count.
 * DistinctCount :- Allows to display the pivot table values with distinct count.
 * Min :- Allows to display the pivot table with minimum value.
 * Max :- Allows to display the pivot table with maximum value.
 * Avg :- Allows to display the pivot table values with average.
 * Median :- Allows to display the pivot table values with median.
 * Index :- Allows to display the pivot table values with index.
 * PopulationStDev :- Allows to display the pivot table values with population standard deviation.
 * SampleStDev :- Allows to display the pivot table values with sample standard deviation.
 * PopulationVar :- Allows to display the pivot table values with population variance.
 * SampleVar :- Allows to display the pivot table values with sample variance.
 * RunningTotals :- Allows to display the pivot table values with running totals.
 * DifferenceFrom :- Allows to display the pivot table values with difference from the value of the base item in the base field.
 * PercentageOfDifferenceFrom :- Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
 * PercentageOfGrandTotal :- Allows to display the pivot table values with percentage of grand total of all values.
 * PercentageOfColumnTotal :- Allows to display the pivot table values in each column with percentage of total values for the column.
 * PercentageOfRowTotal :- Allows to display the pivot table values in each row with percentage of total values for the row.
 * PercentageOfParentTotal :- Allows to display the pivot table values with percentage of total of all values based on selected field.
 * PercentageOfParentColumnTotal :- Allows to display the pivot table values with percentage of its parent total in each column.
 * PercentageOfParentRowTotal :- Allows to display the pivot table values with percentage of its parent total in each row.
 * CalculatedField :- Allows to display the pivot table with calculated field values. It allows user to create a new calculated field alone.
 * ```
 *
 * > It is applicable only for relational data source.
 */
export type SummaryTypes =
    /** Allows to display the pivot table values with sum. */
    'Sum' |
    /** Allows to display the pivot table values with product. */
    'Product' |
    /** Allows to display the pivot table values with count. */
    'Count' |
    /** Allows to display the pivot table values with distinct count. */
    'DistinctCount' |
    /** Allows to display the pivot table with median value. */
    'Median' |
    /** Allows to display the pivot table with minimum value. */
    'Min' |
    /** Allows to display the pivot table with maximum value. */
    'Max' |
    /** Allows to display the pivot table values with average. */
    'Avg' |
    /** Allows to display the pivot table values with index. */
    'Index' |
    /** Allows to display the pivot table values with percentage of grand total of all values. */
    'PercentageOfGrandTotal' |
    /** Allows to display the pivot table values in each column with percentage of total values for the column. */
    'PercentageOfColumnTotal' |
    /** Allows to display the pivot table values in each row with percentage of total values for the row. */
    'PercentageOfRowTotal' |
    /** Allows to display the pivot table values with percentage of its parent total in each row. */
    'PercentageOfParentRowTotal' |
    /** Allows to display the pivot table values with percentage of its parent total in each column. */
    'PercentageOfParentColumnTotal' |
    /** Allows to display the pivot table values with percentage of total of all values based on selected field. */
    'PercentageOfParentTotal' |
    /** Allows to display the pivot table values with running totals. */
    'RunningTotals' |
    /** Allows to display the pivot table values with population standard deviation. */
    'PopulationStDev' |
    /** Allows to display the pivot table values with sample standard deviation. */
    'SampleStDev' |
    /** Allows to display the pivot table values with population variance. */
    'PopulationVar' |
    /** Allows to display the pivot table values with sample variance. */
    'SampleVar' |
    /** Allows to display the pivot table values with difference from the value of the base item in the base field. */
    'DifferenceFrom' |
    /** Allows to display the pivot table values with percentage difference from the value of the base item in the base field. */
    'PercentageOfDifferenceFrom' |
    /** Allows to display the pivot table with calculated field values. It allows user to create a new calculated field alone. */
    'CalculatedField';

/**
 * Allows you to set the specific filter type to display the filter members in the pivot table. They are:
 * ```props
 * Include :- Specifies the filter type as include for member filter.
 * Exclude :- Specifies the filter type as exclude for member filter.
 * Label :- Specifies the filter type as label for header filter.
 * Date :- Specifies the filter type as date for date based filter.
 * Number :- Specifies the filter type as number for number based filter.
 * Value :- Specifies the filter type as value for value based filter.
 * ```
 */
export type FilterType =
    /**  Specifies the filter type as include for member filter. */
    'Include' |
    /**  Specifies the filter type as exclude for member filter. */
    'Exclude' |
    /**  Specifies the filter type as label for header filter. */
    'Label' |
    /**  Specifies the filter type as date for date based filter. */
    'Date' |
    /**  Specifies the filter type as number for number based filter. */
    'Number' |
    /**  Specifies the filter type as value for value based filter. */
    'Value';

/**
 * Defines the conditional operators for filtering settings. They are
 * ```props
 * Equals :- Display the pivot table that matches with the given text or value or date.
 * DoesNotEquals :- Display the pivot table that does not match with the given text or value or date.
 * BeginWith :- Display the pivot table that begins with text.
 * DoesNotBeginWith :- Display the pivot table that does not begins with text.
 * EndsWith :- Display the pivot table that ends with text.
 * DoesNotEndsWith :- Display the pivot table that does not ends with text.
 * Contains :- Display the pivot table that contains text.
 * DoesNotContains :- Display the pivot table that does not contain text.
 * GreaterThan :- Display the pivot table when the text or value is greater.
 * GreaterThanOrEqualTo :- Display the pivot table when the text or value is greater than or equal.
 * LessThan :- Display the pivot table when the text or value is lesser.
 * LessThanOrEqualTo :- Display the pivot table when the text or value is lesser than or equal.
 * Before :- Display the pivot table with preview all records from the given date.
 * BeforeOrEqualTo :- Display the pivot table with previous all records along with the given date.
 * After :- Display the pivot table with next all records to the given date.
 * AfterOrEqualTo :- Display the pivot table with next all records along with the given date.
 * Between :- Display the pivot table that records between the start and end text or value or date.
 * NotBetween :- Display the pivot table that does not record between the start and end text or value or date.
 * ```
 */
export type Operators =
    /** Display the pivot table that matches with the given text or value or date. */
    'Equals' |
    /** Display the pivot table that does not match with the given text or value or date. */
    'DoesNotEquals' |
    /** Display the pivot table that begins with text. */
    'BeginWith' |
    /** Display the pivot table that does not begins with text. */
    'DoesNotBeginWith' |
    /** Display the pivot table that ends with text. */
    'EndsWith' |
    /** Display the pivot table that does not ends with text. */
    'DoesNotEndsWith' |
    /** Display the pivot table that contains text. */
    'Contains' |
    /** Display the pivot table that does not contain text. */
    'DoesNotContains' |
    /** Display the pivot table when the text or value is greater. */
    'GreaterThan' |
    /** Display the pivot table when the text or value is greater than or equal. */
    'GreaterThanOrEqualTo' |
    /** Display the pivot table when the text or value is lesser. */
    'LessThan' |
    /** Display the pivot table when the text or value is lesser than or equal. */
    'LessThanOrEqualTo' |
    /** Display the pivot table with preview all records from the given date. */
    'Before' |
    /** Display the pivot table with previous all records along with the given date. */
    'BeforeOrEqualTo' |
    /** Display the pivot table with next all records to the given date. */
    'After' |
    /** Display the pivot table with next all records along with the given date. */
    'AfterOrEqualTo' |
    /** Display the pivot table that records between the start and end text or value or date. */
    'Between' |
    /** Display the pivot table that does not record between the start and end text or value or date. */
    'NotBetween';

/**
 * Defines the conditional operators for string type fields. They are
 * ```props
 * Equals :- Display the pivot table that matches with the given text.
 * DoesNotEquals :- Display the pivot table that does not match with the given text.
 * BeginWith :- Display the pivot table that begins with text.
 * DoesNotBeginWith :- Display the pivot table that does not begins with text.
 * EndsWith :- Display the pivot table that ends with text.
 * DoesNotEndsWith :- Display the pivot table that does not ends with text.
 * Contains :- Display the pivot table that contains text.
 * DoesNotContains :- Display the pivot table that does not contain text.
 * GreaterThan :- Display the pivot table when the text is greater.
 * GreaterThanOrEqualTo :- Display the pivot table when the text is greater than or equal.
 * LessThan :- Display the pivot table when the text is lesser.
 * LessThanOrEqualTo :- Display the pivot table when the text is lesser than or equal.
 * Between :- Display the pivot table that records between the start and end text.
 * NotBetween :- Display the pivot table that does not record between the start and end text.
 * ```
 */
export type LabelOperators =
    /** Display the pivot table that matches with the given text. */
    'Equals' |
    /** Display the pivot table that does not match with the given text. */
    'DoesNotEquals' |
    /** Display the pivot table that begins with text. */
    'BeginWith' |
    /** Display the pivot table that does not begins with text. */
    'DoesNotBeginWith' |
    /** Display the pivot table that ends with text. */
    'EndsWith' |
    /** Display the pivot table that does not ends with text. */
    'DoesNotEndsWith' |
    /** Display the pivot table that contains text. */
    'Contains' |
    /** Display the pivot table that does not contain text. */
    'DoesNotContains' |
    /** Display the pivot table when the text is greater. */
    'GreaterThan' |
    /** Display the pivot table when the text is greater than or equal. */
    'GreaterThanOrEqualTo' |
    /** Display the pivot table when the text is lesser. */
    'LessThan' |
    /** Display the pivot table when the text is lesser than or equal. */
    'LessThanOrEqualTo' |
    /** Display the pivot table that records between the start and end text. */
    'Between' |
    /** Display the pivot table that does not record between the start and end text. */
    'NotBetween';

/**
 * Defines the conditional operators for value type fields. They are
 * ```props
 * Equals :- Display the pivot table that matches with the given value.
 * DoesNotEquals :- Display the pivot table that does not match with the given value.
 * GreaterThan :- Display the pivot table when the text or value is greater.
 * GreaterThanOrEqualTo :- Display the pivot table when the text or value is greater than or equal.
 * LessThan :- Display the pivot table when the text or value is lesser.
 * LessThanOrEqualTo :- Display the pivot table when the text or value is lesser than or equal.
 * Between :- Display the pivot table that records between the start and end value.
 * NotBetween :- Display the pivot table that does not record between the start and end value.
 * ```
 */
export type ValueOperators =
    /** Display the pivot table that matches with the given value. */
    'Equals' |
    /** Display the pivot table that does not match with the given value. */
    'DoesNotEquals' |
    /** Display the pivot table when the text or value is greater. */
    'GreaterThan' |
    /** Display the pivot table when the text or value is greater than or equal. */
    'GreaterThanOrEqualTo' |
    /** Display the pivot table when the text or value is lesser. */
    'LessThan' |
    /** Display the pivot table when the text or value is lesser than or equal. */
    'LessThanOrEqualTo' |
    /** Display the pivot table that records between the start and end value. */
    'Between' |
    /** Display the pivot table that does not record between the start and end value. */
    'NotBetween';

/**
 * Defines the conditional operators for date type fields. They are
 * ```props
 * Equals :- Display the pivot table that matches with the given date.
 * DoesNotEquals :- Display the pivot table that does not match with the given date.
 * Before :- Display the pivot table with preview all records from the given date.
 * BeforeOrEqualTo :- Display the pivot table with previous all records along with the given date.
 * After :- Display the pivot table with next all records to the given date.
 * AfterOrEqualTo :- Display the pivot table with next all records along with the given date.
 * Between :- Display the pivot table that records between the start and end date.
 * NotBetween :- Display the pivot table that does not record between the start and end date.
 * ```
 */
export type DateOperators =
    /** Display the pivot table that matches with the given date. */
    'Equals' |
    /** Display the pivot table that does not match with the given date. */
    'DoesNotEquals' |
    /** Display the pivot table with preview all records from the given date. */
    'Before' |
    /** Display the pivot table with previous all records along with the given date. */
    'BeforeOrEqualTo' |
    /** Display the pivot table with next all records to the given date. */
    'After' |
    /** Display the pivot table with next all records along with the given date. */
    'AfterOrEqualTo' |
    /** Display the pivot table that records between the start and end date. */
    'Between' |
    /** Display the pivot table that does not record between the start and end date. */
    'NotBetween';

/**
 * Defines the conditional formatting operators. They are
 * ```props
 * Equals :- Display the pivot table that matches with the given value.
 * DoesNotEquals :- Display the pivot table that does not match with the given value.
 * GreaterThan :- Display the pivot table when the value is greater.
 * GreaterThanOrEqualTo :- Display the pivot table when the value is greater than or equal.
 * LessThan :- Display the pivot table when the value is lesser.
 * LessThanOrEqualTo :- Display the pivot table when the value is lesser than or equal.
 * Between :- Display the pivot table that records between the start and end value.
 * NotBetween :- Display the pivot table that does not record between the start and end value.
 * ```
 */
export type Condition =
    /** Display the pivot table when the value is lesser. */
    'LessThan' |
    /** Display the pivot table when the value is greater. */
    'GreaterThan' |
    /** Display the pivot table when the value is lesser than or equal. */
    'LessThanOrEqualTo' |
    /** Display the pivot table when the value is greater than or equal. */
    'GreaterThanOrEqualTo' |
    /** Display the pivot table that matches with the given value. */
    'Equals' |
    /** Display the pivot table that does not match with the given value. */
    'NotEquals' |
    /** Display the pivot table that records between the start and end value. */
    'Between' |
    /** Display the pivot table that does not record between the start and end value. */
    'NotBetween';

/**
 * Defines group of date field. They are:
 * ```props
 * Years :- Defines group field as 'Years' for date type field.
 * Quarters :- Defines group field as 'Quarters' for date type field.
 * QuarterYear :- Defines group field as 'Quarter Year' for date type field.
 * Months :- Defines group field as 'Months' for date type field.
 * Days :- Defines group field as 'Days' for date type field.
 * Hours :- Defines group field as 'Hours' for date type field.
 * Minutes :- Defines group field as 'Minutes' for date type field.
 * Seconds :- Defines group field as 'Seconds' for date type field.
 * ```
 */
export type DateGroup =
    /**  Defines group field as 'Years' for date type field. */
    'Years' |
    /**  Defines group field as 'Quarters' for date type field. */
    'Quarters' |
    /**  Defines group field as 'Quarter Year' for date type field. */
    'QuarterYear' |
    /**  Defines group field as 'Months' for date type field. */
    'Months' |
    /**  Defines group field as 'Days' for date type field. */
    'Days' |
    /**  Defines group field as 'Hours' for date type field. */
    'Hours' |
    /**  Defines group field as 'Minutes' for date type field. */
    'Minutes' |
    /**  Defines group field as 'Seconds' for date type field. */
    'Seconds';
/**
 * Defines the group types. They are:
 * ```props
 * Date :- Defines group type as 'Date' for date type field
 * Number :- Defines group type as 'Number' for numeric type field.
 * Custom :- Defines group type as 'Custom' for custom group field.
 * ```
 */
export type GroupType =
    /**  Defines group type as 'Date' for date type field. */
    'Date' |
    /**  Defines group type as 'Number' for numeric type field. */
    'Number' |
    /**  Defines group type as 'Custom' for custom group field. */
    'Custom';
/**
 * Allows to set the provider type to identify the given connection is either **Relational** or **SSAS** to render the pivot table and field list. The following options are:
 * ```props
 * Relational :- Allows to render the pivot table with JSON data collection either fetch at local or remote server.
 * SSAS :- Allows to render the pivot table with OLAP data fetch from OLAP cube.
 * ```
 */
export type ProviderType =
    /**  Allows to render the pivot table with JSON data collection either fetch at local or remote server. */
    'Relational' |
    /**  Allows to render the pivot table with OLAP data fetch from OLAP cube. */
    'SSAS';
/**
 * Allows to define the data source type. They are,
 * ```props
 * JSON :- Defines JSON type of data source.
 * CSV :- Defines CSV or string[][] type of data source.
 * ```
 */
export type DataSourceType =
    /** Defines JSON type of data source */
    'JSON' |
    /** Defines CSV or string[][] type of data source */
    'CSV';

/**
 * Allows to set the mode of rendering the pivot table. They are,
 * ```props
 * Local :- Defines the data source in client side and the aggregation done in the same.
 * Server :- Defines the data source in server side (WebAPI) and the aggregation done in the same. Only the rendering part alone done in client side.
 * ```
 */
export type RenderMode =
    /** Defines the data source in client side and the aggregation done in the same */
    'Local' |
    /** Defines the data source in server side (WebAPI) and the aggregation done in the same. Only the rendering part alone done in client side. */
    'Server';
