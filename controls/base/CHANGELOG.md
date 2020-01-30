# Changelog

## [Unreleased]

## 17.4.43 (2020-01-14)

### Common

#### Bug Fixes

- `#I254197`, `#I255889`, `#I257234`, `#I257859`, `#I258137`, `#I259025`, `#I260213`, `#I260331` - Resolved Compilation issue with Typescript Latest version.
- Resolved Server side `updateModel` method is called for each child property in `blazor`.

## 17.4.41 (2020-01-07)

### Common

#### Bug Fixes

- `#I256528` - Resolved `draggable` issue `out` event not triggered.
- `#F149410` - Resolved `drag and drop` function not working `firefox` browser version 60.8 .
- `#I258661` - Resolved `LoadCldr` is not working issue.
- `#I258471` - Improvement the `drag and drop` library performance .

## 17.2.49 (2019-09-04)

### Common

#### Bug Fixes

- Resolved `draggable` issue while setting `clone` as `false`.

## 17.2.47 (2019-08-27)

### Common

#### Bug Fixes

- `#I234975` - Resolved template Engine support is not working while passing double slash `(\\)`.
- `#I242062` - Resolved template Engine support is not working while using Special characters `(@)` in more than one occurrence.

## 17.2.46 (2019-08-22)

### Common

#### Bug Fixes

- Resolved template Engine support is not working while using Special characters `(@)` in `if` condition.

## 17.2.40 (2019-08-06)

### Common

#### Bug Fixes

- `#I240696` - Resolved drag issue for actual drag element for scrolled parent element.
- `#I237495` - Fixed template engine support is not working while passing an array of value within the object.

## 17.2.39 (2019-07-30)

### Common

#### Bug Fixes

- `#I242062` - Resolved Special characters `(@)` are not working for template Engine support.

## 17.1.49 (2019-05-29)

### Common

#### Bug Fixes

- Fixed `parseDate` method returns invalid value when parsing `mm/yyyy` date format.

## 17.1.48 (2019-05-21)

### Common

#### Bug Fixes

- Resolved Multiple space between class Names for template Engine support.

#### New Features

- Added the `httpRequest` argument to Ajax `beforeSend` event arguments.

## 17.1.43 (2019-04-30)

### Common

#### Bug Fixes

- #142628, #143613 - Fixed `template`  string evaluation malfunctions in `template` engine.
- #226430 - Resolved Drag not working in IE browser issue.

## 17.1.38 (2019-03-29)

### Common

#### New Features

- Provided the Bootstrap 4 support

## 17.1.32-beta (2019-03-13)

### Common

#### Bug Fixes

- #I234200 - Fixed `GetConstant` method does not return correct value when passing 0 as a value in localization.

#### New Features

- Provided support for evaluate script from Ajax request in Dom Library.

#### Breaking Changes

- ej2 icons has been split-up based on theme names and icons moved to separate npm package ej2-icons
- canvas and svg render base functionalities moved to [ej2-svg-base](https://www.npmjs.com/package/@syncfusion/ej2-svg-base) npm package

#### Bug Fixes

- Fixed draggable clone element position on scroll

## 17.1.1-beta (2019-01-29)

### Common

#### Bug Fixes

- Fixed `e-control` class removed after control refresh issue.

## 16.3.30 (2018-10-31)

### Common

#### Bug Fixes

- Fixed `exporting issue` while complex field value is null.

## 16.3.29 (2018-10-31)

### Common

#### New Features

- Upgraded TypeScript version to 3.0

## 16.3.24 (2018-10-09)

### Common

#### Bug Fixes

- Fixed wrong handler removed from observer on subscribing more than one handler for a property.

## 16.3.21 (2018-09-22)

### Common

#### Breaking Changes

- The individual `npm` package will no longer bundle dependent component's style and global `javascript` source. The online web tool [`CRG`](https://crg.syncfusion.com/) can be used to combine specific set of component and its dependent component global script and styles.

## 16.3.17 (2018-09-12)

### Common

#### Breaking Changes

- The individual `npm` package will no longer bundle dependent component's style and global `javascript` source. The online web tool [`CRG`](https://crg.syncfusion.com/) can be used to combine specific set of component and its dependent component global script and styles.

## 16.2.47 (2018-08-07)

### Common

#### Bug Fixes

- Fixed the First Day of week default index value to 0.

## 16.2.41 (2018-06-25)

### Common

#### New Features

- Provided support for First Day of the Week in Internationalization Library.

#### Bug Fixes

- Fixed the compilation issue in Angular Universal.
- Fixed object typing issue for typescript version 2.8.0.

#### New Features

- Provided public function [`getComponent`] for getting an instance of current component.
- Provided `N\A support` for an internationalization.

## 16.1.38 (2018-05-02)

### Common

#### Bug Fixes

- Fixed the date parser validation issue for invalid date input.
- Fixed the memory leak issue in the `setImmediate` method.

## 16.1.37 (2018-04-24)

### Common

#### Bug Fixes

- Fixed angular base performance issue.

## 16.1.35 (2018-04-17)

### Common

#### New Features

- **Template**-Provided `elseif` conditional statement for template rendering.

### Common

#### Bug Fixes

- Fixed the static currency format returned issue on `getNumberPattern` method.

## 16.1.33 (2018-04-03)

### Common

#### Bug Fixes

- Fixed Date Time Parser parsing issue on British Time Zone

## 16.1.32 (2018-03-29)

### Common

#### Bug Fixes

- Fixed C# number formatting issue.

#### New Features

- Generating page based unique id for components.

## 16.1.30 (2018-03-20)

### Common

#### Bug Fixes

- Fixed content security policy issue.

## 16.1.29 (2018-03-13)

### Common

#### Bug Fixes

- Fixed `rtl` issue in styles.

## 16.1.28 (2018-03-09)

### Common

#### Bug Fixes

- Fixed `statePersistence` issue in destroyed control destroy.

## 16.1.24 (2018-02-22)

### Common

#### New Features

- Essential JS 2 is now officially released and production ready.
- Angular Universal support added
- New High Contrast theme added
- A web based tool for Custom Resource Generator is released for JavaScript (ES5) users

#### Breaking Changes

- Tag prefix for Angular components is changed from `ej` to `ejs`. For example, `ej-grid` is changed to `ejs-grid`.
- **Touch**: Removed `doubleTap` event and added `tapCount` argument in tap event.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`)

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling

#### Bug Fixes

- Fixed Chinese culture time parsing issue in Date parser

## 15.4.21-preview (2017-12-08)

### Common

#### Bug Fixes

- Fixed enable persistence issue in angular

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.19-preview (2017-11-23)

### Common

#### Bug Fixes

- Fixed script error for invalid culture input in L10 library.

## 15.4.17-preview (2017-11-13)

### Common

Base library has the following list of libraries which are commonly used by all Essential JS 2 components

- Internationalization
- Localization
- Animation
- Drag and Drop
- Touch
- Keyboard
- Ripple Effect
- State Persistence
