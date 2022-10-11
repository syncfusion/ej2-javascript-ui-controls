# Changelog

## [Unreleased]

## 20.3.47 (2022-09-29)

### Message `Preview`

The Message component has an option to display the messages with severity by differentiating icons and colors to denote the importance and context of the message to the end user. The following key features are available in the Message component.

- **Severity** - Provides an option to display the message with distinctive icons and colors based on the severity type. The available severity types such as **Normal**, **Success**, **Info**, **Warning**, and **Error**.

- **Variants** - Provides an option to display the message with predefined appearance variants. The available variants such as **Text**, **Outlined**, and **Filled**.

- **Visibility** - Provides an option to show or hide the message.

- **Template** - Provides an option to customize the content of the message.

### Skeleton `Preview`

The Skeleton is a placeholder that animates a shimmer effect to let users know that the page's content is currently loading. In other words, it simulates the layout of page content while loading the actual content.

- **Rendering** - The Skeleton component can be rendered as Circle, Square, Text, and Rectangle shapes.

- **Effects** - Supports wave, fade, and pulse shimmer effects.

## 20.1.61 (2022-06-21)

### Toast

#### Bug Fixes

- `F175544` - Now, the toast will render properly in the target container when the `target` API is set as an HTML element.

## 20.1.60 (2022-06-14)

### Toast

#### Bug Fixes

- `I382879` - Now, the close event will be triggered only once when the toast is closed by swiping on the mobile devices.

## 20.1.47 (2022-04-04)

### Toast

#### Bug Fixes

- `I367641` - Now, the icon in the toast with type `warning` that is displayed using the toast utility method works properly.

## 19.3.43 (2021-09-30)

### Toast

#### New Features

- `#I329725`, `#F164851` - Provided the support to show the toast in any place using the toast utility function.

## 19.1.54 (2021-03-30)

### Toast

#### Bug Fixes

- `308530` - The issue with "Toast elements are not destroyed properly when open and hide the toast" has been fixed.

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
