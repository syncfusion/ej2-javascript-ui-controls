# Changelog

## [Unreleased]

### ListView

#### Bug Fixes

- `#F168185` - The issue with "Sorting is not applied properly when entering different values in the text field of the ListView component" has been resolved.

## 19.2.55 (2021-08-11)

### ListView

#### Bug Fixes

- `#F167149` - The issue with "Multiple requests are made to the controller when using remote data source with template support in the ListView component" has been resolved.

## 19.2.49 (2021-07-27)

### Common

#### Bug Fixes

- Sortable helper element issue resolved in List Box.

### ListView

#### Bug Fixes

- `#I335874` - The issue with "The additional new element is added in the template element of the List components" has been resolved.

## 19.2.48 (2021-07-20)

### ListView

#### Bug Fixes

- `#F164730` - "While grouping is enabled, dynamic items are not added to the proper group field in the ListView component" issue has been resolved.
- `#I325424`, `#I329625` - The issue with "While enabling virtualization support, the ListView functional template is not working" has been resolved.
- `#F166229` - The issue with "The ListView select event is not triggered when selecting items using the space key" has been resolved.

## 19.2.47 (2021-07-13)

### Common

#### Bug Fixes

- Sortable drop event is not triggered while dropping to the "no record found" element.

## 19.1.65 (2021-05-25)

### Common

#### Bug Fixes

- Sortable helper element issue resolved.

## 19.1.56 (2021-04-13)

### ListView

#### Bug Fixes

- `#309268` - Template content of ListView is not updated when updating the props date using `useState` has been fixed.

## 19.1.54 (2021-03-30)

### ListView

#### Bug Fixes

- `#304129`,`#304247` - The issue "ActionBegin event does not trigger before/after switching to new views in the nested ListView" has been fixed.

- `#310143` - The script error with refreshItemHeight method in ListView component has been resolved.

## 18.3.53 (2020-12-08)

### ListView

#### Bug Fixes

- `#302538` - The issue with "The space key is not accepted in input text while using inside of Listview Template" has been fixed.

- `#305040` - `The template issue in ListView component when using AddItem method` has been resolved.

## 18.3.47 (2020-11-05)

### ListBase

#### New Features

- `#291708`- Provided string and integer array support for data source property in ListBase.

## 18.3.44 (2020-10-27)

### ListView

#### Bug Fixes

- `#293803` - Provided hover support for ListView Virtualization.

## 18.3.35 (2020-10-01)

### ListView

#### New Features

- Provided support for rendering JsRender template in the ListView component.

#### Bug Fixes

- `#288456` - The issue when `clicking the header of the ListView component` has been resolved.

## 18.2.48 (2020-08-04)

### Common

#### Bug Fixes

- Sortable helper element hide inside the sidebar issue resolved.

## 18.2.46 (2020-07-21)

### ListView

#### Bug Fixes

- The issue with `The closest undefined error throws in the IE 11 browser` has been resolved.

## 18.2.44 (2020-07-07)

### ListView

#### Bug Fixes

- Issue with `Remote data with Virtualization feature` has been fixed.

### ListView

#### Bug Fixes

- #276068 Issue with `Angular's ngTemplate with Virtualization being enabled` has been fixed.

### ListBase

#### Bug Fixes

- #276068 Issue with `grouping of list-item in header` has been fixed.

### ListView

#### Bug Fixes

- The issue with `enabling the virtualization support in ListView component that throws script error in IE 11 browser` has been resolved.

## 17.4.40 (2019-12-24)

### ListBox

#### Bug Fixes

- Provided 'beforeDrop' event.

## 17.3.27 (2019-11-12)

### ListBox

#### Bug Fixes

- Issue with Drag and Drop in Empty area of List Box has been fixed

## 17.3.21 (2019-10-30)

### ListBox

#### Bug Fixes

- Issue with Drag and Drop has been fixed

### ListView

#### Bug Fixes

- #251219 - The content security policy issue has been fixed.

## 17.3.16 (2019-10-09)

### ListView

#### Bug Fixes

- Issue of rendering a listview with new data in virtualization has been fixed.

## 17.1.47 (2019-05-14)

### ListView

#### New Features

- #230272 - Provided the support for adding new list view item without re-render the listview in virtualization mode.

## 17.1.43 (2019-04-30)

### ListView

#### Bug Fixes

- Issue with maintaining checked items in virtualization mode while checking the checkbox item directly has been fixed.

## 17.1.42 (2019-04-23)

### ListView

#### Bug Fixes

- Issue in enabling `virtualization` with empty data source has been fixed.

## 17.1.40 (2019-04-09)

### ListBase

#### Bug Fixes

- Issue with single level element generation with fields mapping has been fixed.

## 17.1.32-beta (2019-03-13)

### ListView

#### Bug Fixes

- Issue with duplicate entries on updating the data source while binding data using data manager has been fixed.

- Now it is possible to perform key interactions with input list items displayed using custom templates.

## 16.4.44 (2018-12-24)

### ListView

#### Bug Fixes

- Fixed multiple CSS class not added properly while using `template` property in `UI Virtualization`.

- Fixed height calculation in `UI Virtualization` with sample level border inclusion.

## 16.3.33 (2018-11-20)

### ListView

#### Bug Fixes

- Fixed focus out event not triggered properly while interact `ListView` with keyboard navigation keys.

## 16.3.30 (2018-11-01)

### ListView

#### New Features

- Included `refreshItemHeight` public API to recalculate list item height in `UI Virtualization`.

## 16.3.27 (2018-10-23)

### ListView

#### Bug Fixes

- Fixed issue with `imageUrl` property while using with `template` rendering.

## 16.3.25 (2018-10-15)

### ListView

#### Bug Fixes

- Fixed remove selection of list items with `undefined` input using `selectItem` public method.

- Fixed custom `cssClass` not removed properly while using `destroy` public method.

## 16.3.23 (2018-10-03)

### ListView

#### Bug Fixes

- Fixed issue with typings while using custom fields in removeItem

## 16.3.22 (2018-09-25)

### ListView

#### Bug Fixes

- Fixed `getSelectedItems` method returns `undefined` values for remote data.

## 16.3.21 (2018-09-22)

### ListView

#### Bug Fixes

- Fixed `selectMultipleItems` public method issue with empty `dataSource`.
- Fixed `removeMultipleItems` public method issue with custom `fields` mapping.

## 16.3.17 (2018-09-12)

### ListView

#### New Features

- Provided multi-line text support in combination with [Avatar](https://ej2.syncfusion.com/documentation/avatar/getting-started.html?lang=typescript) and [Badge](https://ej2.syncfusion.com/documentation/badge/getting-started.html?lang=typescript).

## 16.2.49 (2018-08-21)

### ListView

#### Bug Fixes

- Issue in `select` event arguments of `ListView` template rendering fixed.

## 16.2.46 (2018-07-30)

### ListView

#### Bug Fixes

- Fixed `select` event returns `undefined` arguments while loading with numeric `dataSource`.

## 16.2.41 (2018-06-25)

### ListView

#### New Features

- UI-Virtualization implemented to render only viewable list items in a view port on loading large number of data.

#### Breaking Changes

- The following API namings are renamed.

| Existing API Name | New API Name    |
| :-------------:   |:-------------:  |
| unCheckAllItem    | uncheckAllItems |
| unCheckItem       | uncheckItem     |
| checkAllItem      | checkAllItems   |

## 16.1.42 (2018-05-15)

### ListView

#### Bug Fixes

- Now `select` event will be triggered on `checkbox` interactions.

## 16.1.38 (2018-05-02)

### ListView

#### Bug Fixes

- Fixed `collapsible` icon alignment issue.

## 16.1.37 (2018-04-24)

### ListView

#### Bug Fixes

- Provided `checkbox` support for `NestedList`.

## 16.1.35 (2018-04-17)

### ListView

#### Bug Fixes

- The issue, 'The list items sorted in ascending order by default when the grouping is enabled', has been fixed.

## 16.1.34 (2018-04-10)

### ListView

#### Bug Fixes

- Provided option to `findItem` from given list element.

## 16.1.32 (2018-03-29)

### ListView

#### Bug Fixes

- The `addItem` public method without `FieldSettings` not properly working issue resolved.

## 16.1.28 (2018-03-09)

### Common

#### Bug Fixes

- `boolean` data is not supported in list generation issue has been fixed.

## 16.1.24 (2018-02-22)

### ListView

#### New Features

- The `checklist` feature implemented, which is used to select multiple items in ListView.

## 15.4.26-preview (2018-01-23)

### ListView

#### Bug Fixes

- Tab key is not focusing `ListView` properly issue has been fixed.

## 15.4.24-preview (2018-01-10)

### Common

#### Bug Fixes

- `data-value` not updated properly for array of string or number inputs bug fixed.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts `(dist/global/index.d.ts)`.

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### ListView

#### Bug Fixes

- `SelectItem` method is not working with option which only have text field.
- Complex `dataSource` binding support for ListView `fields`.

## 15.4.22-preview (2017-12-14)

### ListView

#### New Features

- Provided text binding support from complex `dataSource`.

#### Bug Fixes

- Empty `dataSource` not working properly on dynamic data issue fixed.
- `removeItem` method properly handled for dynamic `dataSource`.

## 15.4.20-preview (2017-12-01)

### ListView

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.17-preview (2017-11-13)

### ListView

ListView component represent data in interactive hierarchical structure interface across different layouts or views, which also has features of data-binding, template and grouping.

- **Data binding** - Supports data binding to display the list of items from the local or server-side data source.

- **Grouping** - Provides support to group the logically related items under a category.

- **Nested list** -  Displays a set of nested list items in different layout.

- **Customizing templates** - Allows you to customize the list item, header and category group header.

- **Accessibility** - Provides built-in accessibility support which helps to access all the ListView component features through the keyboard, on-screen readers, or other assistive technology devices.
