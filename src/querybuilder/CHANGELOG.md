# Changelog

## [Unreleased]

### QueryBuilder

#### New Features

- Provided Dropdown Tree component support in Complex data binding.

## 19.2.59 (2021-08-31)

### QueryBuilder

#### Bug Fixes

- Improvements in Header Template support.

## 19.2.51 (2021-08-03)

### QueryBuilder

#### Bug Fixes

- `#I337055` - The issue with Tooltip not destroyed while applying reset after validation been fixed.

## 19.2.46 (2021-07-06)

### QueryBuilder

#### Bug Fixes

- `#I333679` - The issue with setRules method not works in header template has been fixed.

## 19.1.57 (2021-04-20)

### QueryBuilder

#### Bug Fixes

- `#F163698` - The issue with 'getRulesFromSql' method for date is fixed.

## 19.1.55 (2021-04-06)

### QueryBuilder

#### Bug Fixes

- `#317381` - The issue with predicate generation for date is fixed.

## 19.1.54 (2021-03-30)

### QueryBuilder

#### New Features

- Provided Complex data binding Support.
- Provided Header Template Support.
- Provided model support for fields, operators and values.

#### Bug Fixes

- `#F162988` - The issue when field has space is fixed.
- `#317355` - The issue with disable the condition option when that group has single

## 18.4.42 (2021-02-09)

### QueryBuilder

#### Bug Fixes

- Issue with angular template is fixed.

## 18.4.33 (2021-01-05)

### QueryBuilder

#### Bug Fixes

- Issue with template destroy is fixed.

## 18.4.32 (2020-12-29)

### QueryBuilder

#### Bug Fixes

- Issue with validation is fixed.

## 18.3.52 (2020-12-01)

### QueryBuilder

#### Bug Fixes

- Issue with Date Picker with null value is fixed.

## 18.3.51 (2020-11-24)

### QueryBuilder

#### Bug Fixes

- `#290596` - Validation working improperly with column template issue resolved.
- Issue with template destroy is fixed

## 18.3.50 (2020-11-17)

### QueryBuilder

#### Bug Fixes

- Issue with setting HTML element id start with number is fixed

## 18.3.42 (2020-10-20)

### QueryBuilder

#### Bug Fixes

- Issue with 'setRulesFromSql' method is fixed.
- Issue with changing value field width is fixed.

## 18.3.40 (2020-10-13)

### QueryBuilder

#### Bug Fixes

- Issue with 'getValues' method is fixed.

## 18.2.57 (2020-09-08)

### QueryBuilder

#### Bug Fixes

- Issue with 'setRulesFromSql' method is fixed.

## 18.2.55 (2020-08-25)

### QueryBuilder

#### Bug Fixes

- Issue with 'getColumn' method is fixed.
- Issue with persistence is fixed.

## 18.2.46 (2020-07-21)

### QueryBuilder

#### Bug Fixes

- Issue with 'boolean' type value is fixed.

## 18.2.45 (2020-07-14)

### QueryBuilder

#### Bug Fixes

- Issue with 'locale' is fixed.

## 18.2.44 (2020-07-07)

### QueryBuilder

#### New Features

- Provided `Rule Template` support.

#### Bug Fixes

- Issue with 'addGroups' method is fixed.

## 18.1.55 (2020-06-02)

### QueryBuilder

#### Bug Fixes

- Issue with 'setRulesFromSql' method is fixed.

## 18.1.53 (2020-05-19)

### QueryBuilder

#### Bug Fixes

- Issue with boolean value has been resolved.

## 18.1.48 (2020-05-05)

### QueryBuilder

#### Bug Fixes

- Issue with SQL parsing has been resolved.

## 18.1.45 (2020-04-21)

### QueryBuilder

#### Bug Fixes

- Issue with grouping after refreshing QueryBuilder has been resolved.

## 18.1.44 (2020-04-14)

### QueryBuilder

#### Bug Fixes

- Compatibility with EJ1 issues has been resolved.

## 18.1.43 (2020-04-07)

### QueryBuilder

#### New Features

- Provided `readonly` support.

## 18.1.36-beta (2020-03-19)

### QueryBuilder

#### Bug Fixes

- Improvements in Value Template support.

## 17.4.49 (2020-02-11)

### QueryBuilder

#### Bug Fixes

- CSS validation issues has been resolved.

## 17.4.47 (2020-02-05)

### QueryBuilder

#### Bug Fixes

- Issue with predicate generation for date type is fixed.

#### Breaking Changes

|Property Name|Previous Type|Current Type       |
|-------------|-------------|-------------------|
|format       |string       |string|FormatObject|

## 17.4.46 (2020-01-30)

### QueryBuilder

#### New Features

- Provided the support to disable the combinator if only one rule is present.

## 17.4.43 (2020-01-14)

### QueryBuilder

#### Bug Fixes

- Issue with predicate generation for between operator is fixed.

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
- Predicate is not created for Date type when between operator is fixed.

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
