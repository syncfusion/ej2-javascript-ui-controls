# Changelog

## [Unreleased]

### DropDownButton

#### Bug Fixes

- createPopupOnClick scenario not handled properly in DropDownButton issue has been resolved.

## 19.2.55 (2021-08-11)

### DropDownButton

#### Bug Fixes

- `#I337016` - Input space not works in DropDownButton if the target is set as text input issue has been resolved.

## 18.4.41 (2021-02-02)

### SplitButton

#### Bug Fixes

- Issue with destroy has been fixed.

## 18.4.31 (2020-12-22)

### ProgressButton

#### Bug Fixes

- Issue with setting content property in begin event has been resolved.

## 18.4.30 (2020-12-17)

### SplitButton

#### New Features

- `#299063` - Provided support to remove the items in split button using item id.

## 18.3.40 (2020-10-13)

### SplitButton

#### Bug Fixes

- Warning message has been resolved.

## 18.1.43 (2020-04-07)

### SplitButton

#### Bug Fixes

- Keyboard navigation not working in `bootstrap4` has been resolved.

## 17.4.49 (2020-02-11)

### Button Group

#### Bug Fixes

- CSS validation issues has been resolved.

## 17.4.39 (2019-12-17)

### DropDownButton

#### New Features

- #253123 - Provided `addItems` `removeItems` methods and update items dynamically.

#### Bug Fixes

- #254048 - UI misalignment while changing the font-size issue fixed.

## 17.2.40 (2019-08-06)

### ProgressButton

#### Bug Fixes

- Issue with 'progressComplete' method is fixed.

## 17.2.39 (2019-07-30)

### SplitButton

#### Bug Fixes

- Provided support for 'OnOpen' and 'OnClose' events in Blazor.

## 17.1.50 (2019-06-04)

### ProgressButton

#### Bug Fixes

- Provided public method 'progressComplete' to complete the progress.

## 16.4.53 (2019-02-13)

### DropDownButton

#### Bug Fixes

- Proper ARIA standards followed.

## 16.4.46 (2019-01-08)

### DropDownButton

#### Bug Fixes

- Item text overflow issue fixed.

## 16.4.40-beta (2018-12-10)

### ProgressButton

#### Breaking Changes

- Type changes done for the following property.

Property Name | Old Type | New Type
-----|-----|-----
`animationSettings` | AnimationSettings | AnimationSettingsModel
`spinSettings` | SpinSettings | SpinSettingsModel

## 16.3.22 (2018-09-25)

### ProgressButton

#### Bug Fixes

- Content update while progress issue resolved.

## 16.3.17 (2018-09-12)

### ProgressButton

The progress button visualizes the progression of an operation to indicate the user that a process is happening in the background. The progress can be shown with graphics accompanied by a textual representation.

- **Types, Sizes, and Styles** - Provided with different types, sizes and predefined styles of progress button.

- **Icons and Spinner** - Supports icon, spinner and its positioning.

- **Animation** - Provided with predefined animation and progress indicator.

- **Events** - Supports event triggering at specified interval.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the ProgressButton component features through the keyboard, screen readers, or other assistive technology devices.

## 16.2.48 (2018-08-14)

### DropDownButton

#### Bug Fixes

- Popup z-index calculation inside bootstrap model dialog issue fixed.

## 16.2.44 (2018-07-10)

### DropDownButton

#### Bug Fixes

- Popup positioning under fixed parent issue fixed.

## 16.2.41 (2018-06-25)

### ButtonGroup

ButtonGroup is a graphical user interface that groups series of buttons horizontally or vertically.

- **Types, Sizes, and Styles** - Provided with different types, sizes and predefined styles of button.

- **Selection** - Supports single and multiple selection behaviors.

- **Orientation** - Supports horizontal and vertical orientations.

- **Nesting** - Supports nesting with drop-down and split button components.

- **Accessibility** - Built-in accessibility features to access all the button group using the keyboard, screen readers, or other assistive technology devices.

### SplitButton

#### Breaking Changes

- UI changes based on design guidelines

## 16.1.28 (2018-03-09)

### SplitButton

#### Bug Fixes

- Style compatibility issue fixed.

## 16.1.24 (2018-02-22)

### DropDownButton

DropDownButton component is used to toggle contextual overlays for displaying list of action items.

- **Sizes** - Provided with different sizes of DropDownButton.

- **Icons and Navigations** - Supports text and icon on the DropDownButton and Popup items. URL can be given to Popup items  that creates the anchor link to navigate to the URL provided.

- **Separator** - Supports Popup items grouping by using the Separator.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the DropDownButton component features through the keyboard, screen readers, or other assistive technology devices.

### SplitButton

SplitButton component has primary and secondary button. Primary button is used to select default action and secondary button is used to toggle contextual overlays for displaying list of action items.

- **Sizes** - Provided with different sizes of SplitButton.

- **Icons and Navigations** - Supports text and icon on the SplitButton and Popup items. URL can be given to Popup items  that creates the anchor link to navigate to the URL provided.

- **Separator** - Supports Popup items grouping by using the Separator.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the SplitButton component features through the keyboard, screen readers, or other assistive technology devices.