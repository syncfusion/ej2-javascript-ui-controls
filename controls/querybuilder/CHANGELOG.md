# Changelog

## [Unreleased]

## 26.1.41 (2024-07-09)

### QueryBuilder

#### Bug Fixes

- `#I600597` - Issue with QueryBuilder validation message is not shown for date type column has been fixed.
- `#I600637` - Issue with QueryBuilder numeric text box validation message not shown while using template has been fixed.
- `#I604645` - Issue with Script error thrown in numeric textbox QueryBuilder while type special character like comma and dot has been fixed.

## 26.1.38 (2024-06-19)

### QueryBuilder

#### Bug Fixes

- Issue with condition not proper while getting sql from rules has been fixed.
- `#I594200` - Issue with "Template is not rendered properly when we use fieldMode as dropdowntree in the complex data binding query builder" has been fixed.

## 26.1.35 (2024-06-11)

### QueryBuilder

#### Bug Fixes

- `#I887637` - Issue with Script error thrown in QueryBuilder when `clicking` the button group component in header template has been fixed.

### QueryBuilder

#### New Features

- `Drag-and-drop support` - The Query Builder component now includes a drag-and-drop feature, allowing users to reposition rules or groups within the component effortlessly. This enhancement provides a more intuitive and flexible way to construct and modify queries.

- `Separate connector support` - The separate connector feature in the Query Builder component enables users to integrate standalone connectors between rules or groups within the same group. This allows for greater flexibility, as users can connect rules or groups using different connectors, enhancing the complexity and precision of query construction.

### QueryBuilder

#### Bug Fixes

- `#F553588` - Issue with `setRulesFromSql` method is not working while using a field name like `"Name = '|_fn { keyword ' kFinishedProduct '}_|'"` has been fixed.

### QueryBuilder

#### Bug Fixes

- `#I578463` - Issue with popups height is not updated properly in QueryBuilder sub field has been fixed.

### QueryBuilder

#### Bug Fixes

- `#I873568` - Issue with `getSqlFromRules` method not working properly in boolean fields when calling validateFields within the `ruleChange` event has been fixed.
- `#I873624` - Issue with `getSqlFromRules` method is not working while using a field name like `Http Response Header Name-Verify` has been fixed.

### QueryBuilder

#### Bug Fixes

- `#I568017` - Issue with QueryBuilder 'In' or 'Not in' Operator results in value field as empty list when using fieldMode as default mode has been fixed.

## 25.1.35 (2024-03-15)

### QueryBuilder

#### New Features

- Provided the support to get / set the Mongo Query from query builder.
- Provided the support to get / set the Parameter SQL and Named Parameter SQL from query builder.
- Provided the Clone support to query builder rules/ groups.
- Provided the Lock support to query builder rules/ groups.

### QueryBuilder

#### Bug Fixes

- `#I870175` - Issue with `getSqlFromRules` method is not return custom value when changing boolean type column value in default complex data binding. has been fixed.
- `#I556563` - Issue with QueryBuilder validation message position wrong issue while deleting the rule has been fixed.

## 24.2.8 (2024-02-27)

### QueryBuilder

#### Bug Fixes

- `#I534039` - Issue with `drop-down list popup` remains stick in the screen after close has been fixed.

## 24.2.5 (2024-02-13)

### QueryBuilder

#### Bug Fixes

- `#I545248` - Issue with QueryBuilder validation message removed when navigating away from the QueryBuilder control has been fixed.
- `#F186129` - Issue with tooltip rendering twice in the operator field while using validateFields method has been fixed.

## 24.1.46 (2024-01-17)

### QueryBuilder

#### Bug Fixes

- `#I867810` - Issue with Script error thrown in the header template while adding and deleting the conditions has been fixed.

## 24.1.46 (2024-01-17)

### QueryBuilder

#### Bug Fixes

- `#I534895` - Issue with `getValidRules` method of query builder returns improper rule for in operator has been fixed.

## 24.1.45 (2024-01-09)

### QueryBuilder

#### Bug Fixes

- `#I526596` - Issue with Dropdown tree item expand and selection related issue in query builder has been fixed.

## 24.1.44 (2024-01-03)

### QueryBuilder

#### Bug Fixes

- `#F185815` - Issue with dynamically changing readonly property has been fixed.

## 24.1.43 (2023-12-27)

### QueryBuilder

#### Bug Fixes

- `#F510127` - Issue with Query builder rule does not gets changed dynamically has been fixed.

## 24.1.41 (2023-12-18)

### QueryBuilder

#### Bug Fixes

- `#F511006` - Issue with Date rule format value not updated properly while using two rule in Query builder has been fixed.

## 23.2.7 (2023-12-05)

### QueryBuilder

#### Bug Fixes

- `#I510127` - Issue with Query builder rule does not changed dynamically has been fixed.

## 23.1.44 (2023-11-07)

### QueryBuilder

#### Bug Fixes

- `#I510127` - Issue with Query builder dynamically adding rule does not gets changed has been fixed.

## 23.1.41 (2023-10-17)

### QueryBuilder

#### Bug Fixes

- `#F184903` - Issue with `setRules` method of the Query builder not working for complex data binding has been fixed.

## 23.1.39 (2023-10-04)

### QueryBuilder

#### Bug Fixes

- `#I501292` - Issue with Query builder validation tooltip is not shows on second time has been fixed.
- `#I499489` - Issue with read only property not working in dropdowntree field of QueryBuilder has been fixed.

## 23.1.38 (2023-09-26)

### QueryBuilder

#### Bug Fixes

- `#I504588` - Issue with Query builder column template not render in Vue3 platform has been fixed.

## 23.1.36 (2023-09-15)

### QueryBuilder

#### Bug Fixes

- `#I493593` - Resolved the Script error thrown in `getRule` method of QueryBuilder while using change event.

## 22.2.9 (2023-08-15)

### QueryBuilder

#### Bug Fixes

- `#F183921` - Resolved the Script error thrown while changing Boolean value in dropdowntree fieldMode of QueryBuilder

## 22.2.8 (2023-08-08)

### QueryBuilder

#### Bug Fixes

- `#I469225` - Resolved the Custom operator not working properly in QueryBuilder While dynamically change locale property.

## 22.1.38 (2023-07-11)

### QueryBuilder

#### Bug Fixes

- `#I469225` - Resolved the Dropdown tree field selection related issue in the query builder.

## 22.1.37 (2023-07-04)

### QueryBuilder

#### Bug Fixes

- `#I44054` - Resolved the issue where importing SQL queries containing special characters.

## 22.1.34 (2023-06-21)

### QueryBuilder

#### Bug Fixes

- `#I460895` - Issue with Query builder template not render in Vue3 platform has been fixed.
- `#I448219` - Issue with Query builder validation not shown using `validateFields` method and scroll the page has been fixed.

## 20.4.51 (2023-02-21)

### QueryBuilder

#### Bug Fixes

- `#I430220` - Issue with Value template issue with complex data binding of query builder has been fixed.
- `#I428779` - Issue with Providing the single quotes in SQL string support to query builder has been fixed.

## 20.4.42 (2023-01-04)

### QueryBuilder

#### Bug Fixes

- `#F31632` -  Accessibility issue in Query Builder has been resolved.

## 20.4.40 (2022-12-28)

### QueryBuilder

#### Bug Fixes

- `#F178375` - Issue with Browser window get freezes when we set the Invalid SQL rule to query builder has been fixed.
- `#I423706` - Issue with Field Dropdown list popups get collapses when we use `validateFields` method in query builder has been fixed

## 20.4.38 (2022-12-21)

### QueryBuilder

#### Bug Fixes

- `#F420982` - Issue with `getValidRules` method of query builder returns empty group has been fixed.
- `#I404520` - Provided Localization support SQL query builder operators.
- `#F178375` - Issue with Browser window get freezes when we set the Invalid SQL rule to query builder has been fixed.
- `#I408324` - Issue with Script errors throwing in validating query builder fields while double click has been fixed.
- `#I408658` - Issue with Value getting removed while closing fields Dropdown without change the value when we set rule property of query builder has been fixed.

## 20.3.47 (2022-09-29)

### QueryBuilder

#### Bug Fixes

- `#I391922` - Issue with Show Buttons option in query builder has been fixed.
- `#I399576` - Issue with Custom operator not set properly when we set one field is a prefix of other field as number in query builder has been fixed.
- `#I375472` - Issue with Change event not trigger for changing field for default column to rule template column in query builder has been fixed.
- `#I394878` - Issue with Date type Between value not render properly while using `setRulesFromSql` method has been fixed

## 20.2.40 (2022-07-26)

### QueryBuilder

#### Bug Fixes

- `#I375472` - Issue with Rule template default rendered while add condition/group in query builder, if first column as rule template has been fixed.
- `#I388333` - Issue with Value template not destroy properly when we use complex data source in query builder has been fixed.

## 19.3.45 (2021-10-12)

### QueryBuilder

#### Bug Fixes

- `F169401`, `F169406` - Issue with SQL importing with boolean values has been fixed.
- `F168982` - Issue with placing Query Builder inside a form has been fixed.

## 19.3.44 (2021-10-05)

### QueryBuilder

#### New Features

- Provided Dropdown Tree component support in Complex data binding

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
