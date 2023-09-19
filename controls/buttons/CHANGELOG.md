# Changelog

## [Unreleased]

### Checkbox

#### Bug Fixes

- `#I483250` - The issue with "CheckBox not working in IE 11" has been resolved.

### Switch

#### Bug Fixes

- `#I456259` - provided the `role` attribute support to `htmlAttributes` property of switch component.

### Checkbox

#### Bug Fixes

- `#I445000` - The issue with "Triggered the change event for the checkbox while changing the checked property value programmatically" has been resolved.
- `#I436942` - The issue with "Validation rule not display properly when we use Checkbox within form validator" has been resolved.

### Checkbox

#### Bug Fixes

- `#I443358` - The issue with "Intermediate state not working properly while Property change of Checkbox" has been resolved.
- `#I436942` - The issue with "Checkbox checked property is not updated properly at initial rendering" has been resolved.

### Chip

#### New Features

- `#I422263` - Provided the htmlAttributes support for the Chip component.

### RadioButton

#### Bug Fixes

- `#F40707` - Value change event triggered twice in Radio Button component has been fixed.

### Switch

#### Bug Fixes

- `#I427994` - Provided the `htmlAttributes` support to the switch component.

### Checkbox

#### Bug Fixes

- `#I427235` - The issue `cssClass` property not updated properly while string with a white space in the end of the property in checkbox has been fixed.

### Switch

#### Bug Fixes

- `#I382543` - The issue with "Checkbox value not update properly while using edit template of grid" has been resolved.

### Checkbox

#### Bug Fixes

- `#I399484` - The issue with aria-checked accessibility issue in angular checkbox has been fixed.

## 19.2.47 (2021-07-13)

### Checkbox

#### Bug Fixes

- Issue with checkbox icon on Mac OS has been resolved.

## 19.2.46 (2021-07-06)

### Chips

#### Bug Fixes

- Issue with `selectedChips` property is not maintained after deletion of Chip items has been resolved.

## 18.4.44 (2021-02-23)

### CheckBox

#### Bug Fixes

- Issue with destroy has been fixed.

## 18.4.41 (2021-02-02)

### CheckBox

#### Bug Fixes

- Issue with click event has been fixed.

## 18.4.33 (2021-01-05)

### CheckBox

#### Bug Fixes

- Issue with destroy has been fixed.

## 18.4.30 (2020-12-17)

### Chips

#### Bug Fixes

- `#293361` - The issue with "The Chip is not selected while setting the string values" has been resolved.

## 18.3.40 (2020-10-13)

### Button

#### Bug Fixes

- Warning message has been resolved.

## 18.2.58 (2020-09-15)

### CheckBox

#### Bug Fixes

- Issue with destroy method has been fixed.

## 18.2.44 (2020-07-07)

### Chips

#### Bug Fixes

- `#278394` - Issue with delete event has been fixed.

## 18.1.48 (2020-05-05)

### Chips

#### New Features

- `#152050` - Support for adding images to a chip using the `trailingIconUrl` and `leadingIconUrl` property has been included.

## 18.1.43 (2020-04-07)

### Radio Button

#### Bug Fixes

- Radio button not working properly when clicked inside splitter control has been resolved.

## 17.4.49 (2020-02-11)

### Button

#### Bug Fixes

- CSS validation issues has been resolved.

## 17.4.46 (2020-01-30)

### Chips

#### New Features

- `#256381` - Now, the `beforeClick` event triggers while clicking the chips.
- `#256381` - Now, the `selectedChips` property maintains the value field that is provided to the chip.

## 17.4.43 (2020-01-14)

### Button

#### Bug Fixes

- Disabled button not working properly has been resolved.

## 17.4.41 (2020-01-07)

### Chips

#### Bug Fixes

- `#256994` - The issue with aria-selected value maintenance in a single selection has been fixed.

## 17.4.39 (2019-12-17)

### Chips

#### Bug Fixes

- `#250583` - Now, the selected chips values are maintained after selecting and deselecting the chips.

## 17.3.16 (2019-10-09)

### CheckBox

### RadioButton

### Switch

#### Bug Fixes

- Adding common cssClass for wrapper.

## 17.2.35 (2019-07-17)

### Chips

#### Bug Fixes

- `#239111` - Issue with getting selected chip using `getSelectedChips` method in Edge browser has been fixed.

## 17.2.28-beta (2019-06-27)

### Chips

#### Breaking Changes

- Property selection enum type name changed from "selection" to "Selection".

## 17.1.50 (2019-06-04)

### Button

#### New Features

- Provided method to focusIn and click.

## 17.1.40 (2019-04-09)

### RadioButton

#### New Features

- Provided `getSelectedValue` method to find the value of selected radio button in a group.

## 17.1.1-beta (2019-01-29)

### Chips

The Chip control contains a small block of essential information that triggers an event on click action. It also contains the primary text, image, or both, and is mostly used in mails, contacts, or filter tags.

- `Input chip` - Basic chip with delete icon that represents a person or entity and enables  removal of chips from the chip list collection.
- `Choice chip` - Used to select a choice from the available options.
- `Filter chip` - Used to select multiple choices from the available options.
- `Action chip` - Used to trigger actions for primary content.

## 16.4.53 (2019-02-13)

### Button

#### Bug Fixes

- Flat button text is not visible in bootstrap theme issue is fixed.

## 16.4.40-beta (2018-12-10)

### Chips

The Chip control contains a small block of essential information that triggers an event on click action. It also contains the primary text, image, or both, and is mostly used in mails, contacts, or filter tags.

- `Input chip` - Basic chip with delete icon that represents a person or entity and enables  removal of chips from the chip list collection.
- `Choice chip` - Used to select a choice from the available options.
- `Filter chip` - Used to select multiple choices from the available options.
- `Action chip` - Used to trigger actions for primary content.

## 16.3.33 (2018-11-20)

### CheckBox

#### Bug Fixes

- Add multiple classes dynamically to `cssClass` property issue fixed.

## 16.2.49 (2018-08-21)

### Common

#### Bug Fixes

- Provided renderer support.

## 16.2.41 (2018-06-25)

### Button

#### Breaking Changes

- Default color changed for the flat button.

### RadioButton

#### Bug Fixes

- Wrapped text of a RadioButton label overlaps with next RadioButton label issue fixed.

### Switch

Switch is a graphical user interface element that allows you to toggle between checked and unchecked states.

- **Text** - Supports text.
- **Sizes** - Provided with different sizes of Switch.

## 16.1.28 (2018-03-09)

### CheckBox

#### Bug Fixes

- Style compatibility issue fixed.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

Pascal casing changes in Button Component.

Enum Name | Old Property Value | New Property Value
-----|-----|-----
`IconPosition` | left | Left
`IconPosition` | right | Right

Pascal casing changes in CheckBox Component.

Enum Name | Old Property Value | New Property Value
-----|-----|-----
`LabelPosition` | after | After
`LabelPosition` | before | Before

Pascal casing changes in RadioButton Component.

Enum Name | Old Property Value | New Property Value
-----|-----|-----
`RadioLabelPosition` | after | After
`RadioLabelPosition` | before | Before

## 15.4.30-preview (2018-02-14)

### CheckBox

#### Bug Fixes

- Label text responsive issue fixed.

## 15.4.27-preview (2018-01-30)

### CheckBox

#### Bug Fixes

- Wrapped text overlaps frame icon issue fixed.

## 15.4.26-preview (2018-01-23)

### CheckBox

#### Bug Fixes

- Theme compatibility issue resolved for CSS components.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (dist/global/index.d.ts).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

## 15.4.22-preview (2017-12-14)

### RadioButton

#### Bug Fixes

- RadioButton not working properly with ngModel issue fixed.

## 15.4.21-preview (2017-12-08)

### RadioButton

#### Bug Fixes

- Custom material theme issue fixed.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.17-preview (2017-11-13)

### Button

Button is a graphical user interface element that triggers an event on its click action.

- **Types** - Provided with different types of Button.

- **Predefined Styles** - Provided with predefined styles of Button.

- **Sizes** - Provided with different sizes of Button.

- **Icons** - Supports text and icon on the Button.

### CheckBox

CheckBox is a graphical user interface element that allows to select one or more options from the choices.

- **States** - Provided with different states of CheckBox.

- **Label** - Supports label and its positioning.

- **Sizes** - Provided with different sizes of CheckBox.

### RadioButton

RadioButton is a graphical user interface element that allows to select one option from the choices.

- **States** - Provided with different states of RadioButton.

- **Label** - Supports label and its positioning.

- **Sizes** - Provided with different sizes of RadioButton.
