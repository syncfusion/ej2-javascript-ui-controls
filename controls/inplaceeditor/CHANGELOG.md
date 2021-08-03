# Changelog

## [Unreleased]

## 19.2.51 (2021-08-03)

### In-place Editor

#### Bug Fixes

- `#I335868` - The issue with "value is not being reset after form validation fails, and the cancel button is pressed" has been resolved.

- `#I335868` - In popup mode, pressing the close-icon on the In-place editor `numeric` type changes the value to -1 has been resolved.

## 19.2.46 (2021-07-06)

### In-place Editor

#### New Features

- `#I311906`, `#FB23798` - Provided the new event `endEdit` that triggers when the edit action is finished and begin to submit/cancel the current value.

#### Bug Fixes

- `#I330556` - Resolved the exception raised, when the large value is typed and starting to edit for the second time in In-Place Editor.

## 18.4.30 (2020-12-17)

### In-place Editor

#### Bug Fixes

`#292832` - The issue with Validation is not working when template has more then two input elements" has been resolved.

## 18.2.59 (2020-09-21)

### In-place Editor

#### Bug Fixes

`#289326` - The issue with "Script error is thrown when configuring more than two validation rules in the In-place editor" has been resolved.

## 18.2.57 (2020-09-08)

### In-place Editor

#### New Features

- `#288860` - Provided the new events `submitClick` and `cancelClick` that triggers when clicking the In-place editor submit and cancel buttons.

## 18.2.54 (2020-08-18)

### In-place Editor

#### New Features

- `#279315` - Provided new event `change` that triggers when the integrated component value has changed that render based on the `type` property in the In-place editor.

## 18.2.48 (2020-08-04)

### In-place Editor

#### Bug Fixes

- `#284643` - The issue with "Keyborad actions closes the editor and calls the save action" has been resolved.

## 18.2.45 (2020-07-14)

### In-place Editor

#### Bug Fixes

- `#F154491` - The issue with "`OnActionBegin` event triggers only during the second time, when configuring validation with Date mode in the In-place Editor" has been resolved.

- `#283160` - The issue with "validation occurs, when the `validationRules` API has not been configured in the In-place Editor" has been resolved.

## 18.2.44 (2020-07-07)

### In-place Editor

#### Bug Fixes

- `#273057` - Resolved the `EnableHtmlSanitizer` property is not working properly for In-place Editor value.

## 17.4.51 (2020-02-25)

### In-place Editor

#### Bug Fixes

- `#262774` - Resolved the focus not maintained issue when `type` is set to `DropDown` and enabling the `allowFiltering`.

## 17.4.50 (2020-02-18)

### In-place Editor

#### Bug Fixes

- `#255914` - Provided the `textOption` property and setting the value to `Always` will display field value on initial load when DropDown components are configured with the `fields` property.

## 17.4.46 (2020-01-30)

### In-place Editor

#### New Features

- `#258695` - Provided `cancel` argument in `beginEdit` event to prevent the open action of the editor.

## 17.4.43 (2020-01-14)

### In-place Editor

#### New Features

- `#255914` - Provided actual `text` field value display on initial load, when DropDown components are configured with the `fields` property.

## 17.4.40 (2019-12-24)

### In-place Editor

#### Bug Fixes

- `#254606` - Web accessibility related issues have been resolved.

## 17.3.29 (2019-11-26)

### In-place Editor

#### Bug Fixes

- `#253385` - The issue with displaying tooltip in the edit mode in the In-place Editor has been resolved.

## 17.3.16 (2019-10-09)

### In-place Editor

#### Bug Fixes

- `#247721` - The issue with rendering the MultiSelect type of In-place editor while configuring remote data source has been resolved.

## 17.3.9-beta (2019-09-20)

### In-place Editor

#### Bug Fixes

- `#F146947` - Resolved the argument issue that returns text field instead of value field in the action begin event when rendering the Combo Box within the In-place Editor.

- `#248388` - Resolved the issue with configuring `cssClass` property to customize the appearance of sub-components of the In-place Editor.

## 17.2.48-beta (2019-08-28)

### In-place Editor

#### Bug Fixes

- The display format specified for the sub components in `In-place Editor`, will now be considered when initial value is provided.

## 17.2.35 (2019-07-17)

### In-place Editor

#### New Features

- `#240715` - Provided new event `beginEdit` that triggers when change to editing mode and it helps to skip the focus from `In-place Editor` component.

## 17.2.28-beta (2019-06-27)

### In-place Editor

#### Bug Fixes

- `#237441` - Modified value not updated, when using `RichTextEditor` with `Markdown` mode issue has been resolved

## 17.1.48 (2019-05-21)

### In-place Editor

#### Bug Fixes

- `#235175` - Issue with modules injection in Angular production mode that issue has been resolved.

## 17.1.47 (2019-05-14)

### In-place Editor

#### Bug Fixes

- Toolbar fails to render properly in `RichTextEditor` In-Place Editor when `afterOpen` is set, that issue has been fixed.
- Not able to hide the close icon issue has been fixed.
- Change event doesn't trigger, when `RichTextEditor` blurs that issue has been fixed.

## 16.4.53 (2019-02-13)

### In-place Editor

#### Bug Fixes

- Console error is thrown while validating `RTE` editor value issue has been fixed.

## 16.4.48 (2019-01-22)

### In-place Editor

#### New Features

- Type `number` support provided for `primaryKey` API.

#### Bug Fixes

- Formatting not applied to calendar component issue fixed.
- Key returned instead of value while using `fieldSettings` with `dropDown` components issue has been fixed.

## 16.4.44 (2018-12-24)

### In-place Editor

#### Bug Fixes

- `space` key action issue is fixed with clicking save and cancel buttons.
- Value persistence issue with `multi-select` when doing cancel action after removing selected item.
- Double-Click issue in IOS device is fixed.
- `Invalid background value` warning thrown in `In-place Editor`, that issue has been fixed.

## 16.4.40-beta (2018-12-10)

### In-place Editor

The In-place Editor component is used to edit and update the input value dynamically to the server. It supports integrating many component types such as “DropDownList”,”DatePicker”,”AutoComplete”, etc.

- **Render mode** - Provides two types of rendering modes when editing the input, namely “Inline” and “Popup”.
- **Component integration** - Support to integrate components such as “DropDownList”, “DatePicker”,” AutoComplete”, etc. to the In-place Editor.
- **Data binding**  - Bind the In-place Editor component with an array of JSON objects or DataManager to save the edited data to the server.
- **Customization**  - Offers UI customization such as popup, buttons, and also denotes editable content state.
- **Template**  - Templates can be used to integrate custom controls to the In-place Editor.
- **Globalization**  - Provides right to left and localization support.
