# Changelog

## [Unreleased]

## 17.1.38 (2019-03-29)

### In-place Editor

#### Bug Fixes

- Toolbar fails to render properly in `RichTextEditor` In-Place Editor when `afterOpen` is set, that issue has been fixed.
- Not able to hide the close icon issue has been fixed.

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

## 16.4.40-beta (2018-12-10)

### In-place Editor

The In-place Editor component is used to edit and update the input value dynamically to the server. It supports integrating many component types such as “DropDownList”,”DatePicker”,”AutoComplete”, etc.

- **Render mode** - Provides two types of rendering modes when editing the input, namely “Inline” and “Popup”.
- **Component integration** - Support to integrate components such as “DropDownList”, “DatePicker”,” AutoComplete”, etc. to the In-place Editor.
- **Data binding**  - Bind the In-place Editor component with an array of JSON objects or DataManager to save the edited data to the server.
- **Customization**  - Offers UI customization such as popup, buttons, and also denotes editable content state.
- **Template**  - Templates can be used to integrate custom controls to the In-place Editor.
- **Globalization**  - Provides right to left and localization support.