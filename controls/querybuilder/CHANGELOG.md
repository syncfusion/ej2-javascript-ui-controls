# Changelog

## [Unreleased]

## 17.4.41 (2020-01-07)

### QueryBuilder

#### Bug Fixes

- Issue with 'setRulesFromSql' method is fixed.

## 17.4.39 (2019-12-17)

### QueryBuilder

#### New Features

- Provided `NOT` Condition support.
- Provided Template support for Time Picker.

#### Bug Fixes

- Tooltip is not destroyed while using destroy method.
- Predicate is not created for Date type when between operator is selected.

## 17.3.27 (2019-11-12)

### QueryBuilder

#### Bug Fixes

- Issue with changing 'number' type field is fixed.

## 17.3.26 (2019-11-05)

### QueryBuilder

#### New Features

- Provided Not Contains, Not Starts With and Not Ends With operator support.

## 17.3.21 (2019-10-30)

### QueryBuilder

#### Bug Fixes

- Value not updated properly while changing 'Between' operator.

## 17.3.19 (2019-10-22)

### QueryBuilder

#### Bug Fixes

- Value not updated properly while changing operator.

## 17.2.46 (2019-08-22)

### QueryBuilder

#### New Features

- Provided Null and Empty operator support.

## 17.2.36 (2019-07-24)

### QueryBuilder

#### Bug Fixes

- Date values are not properly filtered using DataManager.

## 17.2.35 (2019-07-17)

### QueryBuilder

#### Bug Fixes

- SQL Parsing issue when the rule contains 'Greater Than Or Equal', 'Less Than Or Equal' operator.
- Condition is not updated properly in the root while using 'setRules' method.

## 17.2.28-beta (2019-06-27)

### QueryBuilder

#### New Features

- Provided localization support for 'AND/OR' conditions.

## 17.1.50 (2019-06-04)

### QueryBuilder

#### Bug Fixes

- Selected value not maintained properly for radiobutton field.

## 17.1.49 (2019-05-29)

### QueryBuilder

#### Bug Fixes

- DataManager related issue resolved.

## 17.1.48 (2019-05-21)

### QueryBuilder

#### Bug Fixes

- Provided public method for get the rule by the rule Id.
- Date format issue in dd/mm/yyyy format.
- Selected value not maintained properly for radiobutton field.

## 17.1.47 (2019-05-14)

### QueryBuilder

#### New Features

- Provided `case sensitive` support.
- Provided default value option support for column fields.
- Provided groupBy support for columns.

#### Bug Fixes

- Updating conditions throws script error after using 'setRules' method.
- Rule with AND operator is not properly updated in ASP.NET MVC and Core.
- Multiselect datasource not properly updated for in and notin operators.
- Provided option for handling data source request on demand.

## 17.1.43 (2019-04-30)

### QueryBuilder

#### Bug Fixes

- Multiselect datasource not properly updated for in and notin operators.

## 17.1.42 (2019-04-23)

### QueryBuilder

#### Bug Fixes

- Rule with AND operator is not properly updated in ASP.NET MVC and Core.

## 17.1.40 (2019-04-09)

### QueryBuilder

#### Bug Fixes

- Updating conditions throws script error after using 'setRules' method.

## 17.1.38 (2019-03-29)

### QueryBuilder

#### Breaking Changes

- The following events are renamed.

| Existing Event Name| New Event Name |
|------|-------------|
|beforeConditionChange|beforeChange|
|beforeFieldChange|beforeChange|
|beforeOperatorChange|beforeChange|
|beforeValueChange|beforeChange|
|conditionChanged|change|
|fieldChanged|change|
|operatorChanged|change|
|valueChanged|change|
|groupDelete|change|
|groupInsert|change|
|ruleDelete|change|
|ruleInsert|change|

- Modified the return type of 'getFilteredRecords' method from object collection to promise.
- Renamed the 'RulesModel' class to 'RuleModel' and removed the 'RulesModel' class.

#### Bug Fixes

- Between Operator produces incorrect SQL is fixed.
- Issue with binding boolean values to radio button is fixed.
- Introduced new event 'RuleChange' which triggers once the current Rule is different from the older Rule.

## 17.1.32-beta (2019-03-13)

### QueryBuilder

#### Breaking Changes

- The following events are renamed.

| Existing Event Name| New Event Name |
|------|-------------|
|beforeConditionChange|beforeChange|
|beforeFieldChange|beforeChange|
|beforeOperatorChange|beforeChange|
|beforeValueChange|beforeChange|
|conditionChanged|change|
|fieldChanged|change|
|operatorChanged|change|
|valueChanged|change|
|groupDelete|change|
|groupInsert|change|
|ruleDelete|change|
|ruleInsert|change|

#### Bug Fixes

- Between Operator produces incorrect SQL is fixed.

## 16.4.54 (2019-02-19)

### QueryBuilder

#### Bug Fixes

- 'Add Group' option is not disabled while setting groupInsert as false is fixed.

## 16.4.52 (2019-02-05)

### QueryBuilder

#### New Features

- Provided `Summary view` support.

## 16.4.44 (2018-12-24)

### QueryBuilder

#### Bug Fixes

- Introduced validateFields method for validation.

## 16.4.40-beta (2018-12-10)

### QueryBuilder

The Query Builder component is a graphical user interface that allows users to create and edit filters. It outputs a structured JSON of filters which that can be easily parsed to create SQL. It is integrated with Data Manager to communicates with data sources and returns the desired result based on the provided filter. It supports data binding, templates, validation, and horizontal and vertical orientation.

- **Data binding**: It auto populates the data source and maps the data to the appropriate fields.

- **Template**: Supports templates and it is applicable for all input components.

- **Queries**: Queries supports JSON/SQL rules.
