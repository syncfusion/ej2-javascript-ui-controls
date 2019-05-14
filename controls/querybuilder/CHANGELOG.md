# Changelog

## [Unreleased]

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
