# Changelog

## [Unreleased]

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
