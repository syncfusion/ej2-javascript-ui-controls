# Changelog

## [Unreleased]

## 17.4.40 (2019-12-24)

### Toast

#### Bug Fixes

- `#254606` - Web accessibility related issues have been resolved.

## 17.4.39 (2019-12-17)

### Toast

#### Bug Fixes

`#F149339`, `#256583` - The issue with passing empty string value to cssClass API has been fixed.

## 17.3.27 (2019-11-12)

### Toast

#### New Features

- `252807` - Provided the support to access the 'dynamic toast model properties passed in the show method', as arguments in the `beforeOpen`, `open` and `close` events.

## 17.2.48-beta (2019-08-28)

### Toast

#### Bug Fixes

- `#242279` - The DOM selector processing has been prevented in the `title` property. The Toast component now accepts only string and HTML string in the `title` property.

## 16.3.31 (2018-11-07)

### Toast

#### Bug Fixes

- Resolved the issue "window is not define" on registering component as plugin in Toast component.

## 16.2.45 (2018-07-17)

### Toast

#### New Features

- Provided support for `Swipe` action on Toast in devices.

#### Bug Fixes

- The issue with Toast title ellipsis has been fixed.

## 16.2.41 (2018-06-25)

### Badge

Badge can be used to alert users about new or unread messages, notifications, and additional information
to the content. This can be used in conjunction with lists to represent each list’s timeline such as `new`, `old`, and `preview`.

- **Types** - Provided 8 different types of Badges.

- **Predefined Colours** - Provided 8 predefined situational colours of Badges.

- **Position** - Supports 3 different positions, such as `default`, `top` and `bottom`.

### Toast

The toast is a small container, in which user can show a single or multiple informative lines with actions.

- **Position**: Enables to position the toast anywhere on the screen. It has a predefined set of positions and custom inputs for position based on the target.

- **Autohide and TimeOut**: Toast can be expired based on the timeOut property; it hides toast automatically when reaches specific time without user interaction.

- **Multi Toast**: Toasts can support to display multiple toasts with various time delay.

- **Progress Bar**: Supports to visually indicate time lapse when the toast expires.

- **Action Buttons**: Supports to add buttons in the toast for archiving any actions within the toast.

- **Template**: User customized element can be defined for the toast using the template property.
