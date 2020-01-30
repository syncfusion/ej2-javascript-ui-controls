# Changelog

## [Unreleased]

## 17.4.46 (2020-01-30)

### Dialog

#### New Features

- `#256585` - Provided the new event `destroyed` that triggers when the component of the dialog is destroyed.

#### Bug Fixes

- `#150796` -  The issue with the parent element that is scrolled after reaching the end of the modal dialog has been resolved.

## 17.3.29 (2019-11-26)

### Dialog

#### New Features

- `#253239` - Provided the `minHeight` property to set minimum height for the dialog without considering the target's height.

#### Bug Fixes

- `#253239` - The issue with content overflow in IE browser has been resolved in Dialog.

## 17.3.19 (2019-10-22)

### Dialog

#### Bug Fixes

- `#251762` - The issue with position property that accepts camel case alone has been resolved in Dialog.

## 17.3.16 (2019-10-09)

### Dialog

#### Bug Fixes

- `#240696`- Resolved the odd dragging behaviour on Dialog when scrolling the page.

- `#249144`- Resolved the issue with rendering templates when enabled the policy `"script-src self"` in  Dialog.

- `#249263`, `#249478`- The issue with dynamically updating the Dialog content using the function template has been resolved.

## 17.2.35 (2019-07-17)

### Dialog

#### Bug Fixes

- `#F145500`- Resolved the navigation issue while navigating through keyboard in modal dialog.

## 17.1.50 (2019-06-04)

### Dialog

#### Bug Fixes

- #144624 - Resolved the issue with resizing when rendering a grid inside a dialog.

## 17.1.47 (2019-05-14)

### Tooltip

#### New Features

- #234933 - Now the tooltip is showing while hovering the tooltip content element in hover mode.

## 17.1.40 (2019-04-09)

### Dialog

#### Bug Fixes

- The issue with preventing the dialog resize using `args.cancel` has been resolved.

## 17.1.38 (2019-03-29)

### Dialog

#### Bug Fixes

- Provided an additional `cssClass`, `zIndex`, `open` and `close` event properties to dialog utility.

- Enable/ Disable the dialog button issue in dynamic way has been fixed.

- Return type of Dialog Utility method has been changed from `DialogModal` to `Dialog` This changes doesn't lead to breaking changes in application level since these two classes are implicitly convertible.

## 16.4.47 (2019-01-16)

### Dialog

#### Bug Fixes

- Provided an additional argument in beforeOpen event to control the max-height of dialog.

## 16.4.45 (2019-01-02)

### Tooltip

#### Bug Fixes

- Added index position for tooltip content container to avoid misalignment while customize background.

## 16.4.44 (2018-12-24)

### Popup library

#### Bug Fixes

- The issue with collision while displays popup on scrollable viewport element has been resolved.

## 16.4.42 (2018-12-14)

### Dialog

#### Bug Fixes

- Introduced a new argument `isInteracted` by deprecating existing event argument `isInteraction` for unique naming convention.

## 16.4.40-beta (2018-12-10)

### Dialog

#### New Features

- Provided resizable support to the dialog for both modal dialog and modeless dialog (non-modal).

- Provided option to pass animation settings as an argument to utility methods of dialog.

## 16.3.32 (2018-11-13)

### Dialog

#### Bug Fixes

- Resolved the issue with max-height in dialog.

## 16.3.29 (2018-10-31)

### Dialog

#### New Features

- Provided support to set the dialog position value as combination of string and number.

### Tooltip

#### Bug Fixes

- Resolved Tooltip arrow alignment issue in compatibility CSS.

## 16.3.25 (2018-10-15)

### Dialog

#### Bug Fixes

- Resolved the issue with maximum z-index value calculation in dialog.

## 16.3.24 (2018-10-09)

### Dialog

#### New Features

- Provided option to specify the type of the dialog's buttons such as submit, reset.

## 16.3.21 (2018-09-22)

### Dialog

#### Bug Fixes

- Resolved the issue with modal dialog's overlay animation.

- Provided `getButtons` method to access the instances of dialog buttons directly.

## 16.3.17 (2018-09-12)

### Dialog

#### New Features

- Enabled draggable support for modal dialog also.

- Provided built-in utility functions to render the alert and confirm dialogs with minimal code.

#### Bug Fixes

- The z-index calculation issue while rendering the multiple dialogs with same target has been resolved.

## 16.2.41 (2018-06-25)

### Dialog

#### Bug Fixes

- Issue with click event on primary button has been fixed.
- The multiple Dialog with positioning issue resolved in Dialog components.
- Dialog's header and content can be updated dynamically without using `dataBind` method.

### Spinner

#### Bug Fixes

- Spinner memory leak problem has been fixed.

### Tooltip

#### Bug Fixes

- Tooltip positioning issue fixed while target placed right of the page.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

- Changed the Angular component directive, component name prefix with `ejs-[ComponentName]`.

### Dialog

#### Bug Fixes

- The issue with ng-properties were not working inside a Dialog has been fixed.

- Resolved the issue with accessing EJ2 component’s instances when rendering the EJ2 component inside the Dialog.

### Tooltip

#### Bug Fixes

- Line displayed in between tip and content of tooltip issue fixed by using `font-icons` for tooltip arrow element.

## 15.4.27-preview (2018-01-30)

### Dialog

#### Bug Fixes

- The issue with `Tab` key press on modal Dialog has been fixed.

- Fixed the issue with Dialog header positioning when its content has text node.

### Popup

#### Bug Fixes

- Fixed the issue with Popup positioning when its parent has `fixed` position.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts `(dist/global/index.d.ts)`.

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### Dialog

#### Bug Fixes

- Resolved the issue with applying localized texts for Dialog `close` button.

## 15.4.22-preview (2017-12-14)

### Dialog

#### Bug Fixes

- The issue with triggering `click` event multiple times when click on primary button using `Enter` key has fixed.

## 15.4.21-preview (2017-12-08)

### Dialog

#### Bug Fixes

- Header is no longer duplicate on refresh the Dialog; Also, the buttons are rendered properly when add or remove it dynamically.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.17-preview (2017-11-13)

### Tooltip

Tooltip component displays a pop-up containing an information or a message when you hover, click, focus, or touch an element. The information displayed in the Tooltip can include simple text, images, hyperlinks, or custom templates. In mobile devices, to display the Tooltip, you need to tap and hold the target elements.

- **Content** - Tooltip content can be assigned with static text, template or loaded dynamically via AJAX.

- **Position** - Tooltip can be displayed in 12 different positions.

- **Open Mode** - Supports 4 opening modes, `hover`, `click`, `focus`, and `custom`.

- **Animation** - Supports animation effects while showing/hiding the Tooltip.

- **Smart Positioning** - Tooltip can be moved along with the mouse pointer using the mouse trailing option.

### Dialog

Dialog is a window that displays information to the user, and used to get the user input. The available key features are

- **Modal** - The user should be working with Dialog before interacting with the parent application.

- **Modeless** - It allows to interact with parent application even the Dialog opened on the page.

- **Buttons** - Provided the built-in support to render the buttons at Dialog footer.

- **Templates** - Customizable Dialog header and footer through the template.

- **Draggable** - Supports to drag the Dialog within the page or container.

- **Positioning** - Provided support to position on built-in 9 places or any custom location.

- **Animation** - Provided built-in animation support on open & close the Dialog with customization.

- **Localization** - Supports to localize the default close icon title text to different cultures.

- **Accessibility** - Built-in compliance with the WAI-ARIA specifications.

- **Keyboard Interaction** - The Dialog can be intractable through keyboard.
