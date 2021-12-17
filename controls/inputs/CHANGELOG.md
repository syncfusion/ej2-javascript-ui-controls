# Changelog

## [Unreleased]

## 19.4.38 (2021-12-17)

### Signature

The Signature control allows user to draw smooth signatures as vector outline of strokes using variable width Bézier curve interpolation. You can use your finger, pen, or mouse on a tablet, touchscreen, etc., to draw your own signature on this Signature control.

- **Customization** - Support various customization options like background color, background image, stroke color, stroke width, save with background, undo, redo, clear, readonly, and disabled.
- **Load** - Support to load the signature as base64.
- **Draw** - Support to draw the text with the different font family and font size.
- **Save** - Support to save the signature as image like PNG, JPEG, and SVG.

## 19.3.53 (2021-11-12)

### ColorPicker

#### Bug Fixes

- Overflow issue in ColorPicker has been resolved.

## 19.3.48 (2021-11-02)

### ColorPicker

#### Bug Fixes

- `createPopupOnClick` property scenario not handled properly in `ColorPicker` has been resolved.
- `I344127` - Issue with ColorPicker value not updated properly if opacity is set to false has been resolved.

## 19.3.44 (2021-10-05)

### NumericTextBox

#### Bug Fixes

- `#I319166` - Issue with "lazy modifier not working" has been resolved.

## 19.2.59 (2021-08-31)

### Uploader

#### Bug Fixes

- `#F165287` - Issue with "files are not uploaded in the sequential upload while retrying the failed duplicate files" has been resolved.

## 19.2.48 (2021-07-20)

### Range Slider

#### Bug Fixes

- `#I329800` - The issue with "The Range Slider tooltip is not closed during the document click" has been resolved.

## 19.2.46 (2021-07-06)

### ColorPicker

- Role Attribute error in ColorPicker has been fixed.

## 19.1.59 (2021-05-04)

### Range Slider

#### Bug Fixes

- `#I313394` - The issue with "The Range Slider handle position is moved to the wrong position after performing drag and drop using the range bar" has been fixed.

## 19.1.54 (2021-03-30)

### MaskedTextBox

#### New Features

- `#284609` - Now, the cursor will position based on the value present in the input element while focusing the component.

## 18.4.47 (2021-03-09)

### Form Validator

#### Bug Fixes

- `#315294` - Now, you can use the complex name attribute to add the validation rules.

## 18.4.44 (2021-02-23)

### TextBox

#### Bug Fixes

- Issue with "`e-mappinguid` attribute is added to textarea element while rendering the multiline textbox" has been resolved.

## 18.4.43 (2021-02-16)

### Uploader

#### Bug Fixes

- Issue with "dot present in the end of file name while rendering the preload files without type of file" has been resolved.

### TextBox

#### Bug Fixes

- `#313099` - Issue with "script error throws when disable the clear button dynamically" has been resolved.

### FormValidator

#### Bug Fixes

- `#F162275` - Issue with "validation message shows while setting required as false in the rules property" has been resolved.

## 18.4.32 (2020-12-29)

### ColorPicker

- `F160947` - Unwanted parent selector removed from the top level selector.

## 18.3.52 (2020-12-01)

### TextBox

#### Bug Fixes

- `#304117`,`#304560` - EJ1 and EJ2 controls theme compatibility issue resolved.

## 18.3.48 (2020-11-11)

### Uploader

#### Bug Fixes

- `#299628` - Issue with "cancelling the file uploading inside the uploading event doesn't work when set `showFileList` property value as false" has been resolved.

## 18.3.44 (2020-10-27)

### Range Slider

#### Bug Fixes

- `#294975` - Issue with Slider's handle staying large in size when clicking out of the screen has been fixed.

- `#296636` - Issue with "Tooltip with Slider is not working properly" has been fixed.

## 18.3.35 (2020-10-01)

### TextBox

#### Bug Fixes

- `#288139` - Issue with "the floating label not moved to top, when choose the value using `autofill` option in chrome browser" has been resolved.

## 18.2.58 (2020-09-15)

### ColorPicker

- Issue with `enableOpacity` has been fixed.

## 18.2.54 (2020-08-18)

### Range Slider

#### Bug Fixes

- `#277466` - In the mobile view, the scrolling issue when multiple sliders are rendered has been resolved

## 18.2.48 (2020-08-04)

### TextBox

#### Bug Fixes

`282905` - Now, Cross-Site Scripting issues will no longer occurs for placeholder property.

## 18.1.56 (2020-06-09)

### Uploader

#### Bug Fixes

- Issue with "form name is not updated based on name attribute in chunk upload" has been resolved.

## 18.1.55 (2020-06-02)

### Slider

#### Bug Fixes

- `#278460` Issue with slider refresh method has been resolved.

## 18.1.53 (2020-05-19)

### Slider

#### New Features

- Now, you can set the width of the slider component using `width` property.

## 18.1.52 (2020-05-13)

### Uploader

#### Bug Fixes

- Now, selected files persist properly when enabling enablePersistence property.

## 18.1.44 (2020-04-14)

### TextBox

#### Bug Fixes

- Issue with "destroy throws error in IE" has been resolved.

## 18.1.43 (2020-04-07)

### TextBox

#### Bug Fixes

- `#268311` - Issue with "typed value is not reset in the multiline textbox while destroying the control" has been resolved.

## 18.1.36-beta (2020-03-19)

### Slider

#### Bug Fixes

- `#259186` The issue with the Vertical Slider tooltip content that rotate `225` degrees has been resolved.

## 17.4.46 (2020-01-30)

### Slider

#### Bug Fixes

- The issue "z-index value get's updated on each value change" has been resolved.

### NumericTextBox

#### Bug Fixes

- Issue with "validation message not removed while clear the value using clear button" has been resolved.

### ColorPicker

- Provided `onModeSwitch` event after switching mode.

## 17.4.41 (2020-01-07)

### Slider

#### Bug Fixes

- `#259186` - Now, the tooltip is displayed correctly for the slider component while rendering it inside the dialog component.

## 17.3.29 (2019-11-26)

### Form Validator

#### Bug Fixes

- Now, validation works for newly added elements by calling the `refresh` method.

## 17.3.28 (2019-11-19)

### TextBox

#### New Features

- `#226069`, `#247330` - Now, you can add icons to textbox component using `addIcon` method.

#### Bug Fixes

- `#254393` - Issue with "while calling the `focusIn` method, focus is not removed in the textbox even press the tab key or mouse action" has been resolved.

### NumericTextBox

#### Bug Fixes

- `#254252` - Issue with "value not updated properly when set decimal value more than 7" has been resolved.

## 17.3.27 (2019-11-12)

### TextBox

#### New Features

- `#233835`, `#236707` - Now, you can adjust the width of textbox component using `width` property.

### Uploader

#### Bug Fixes

- `#252841` - Now, you can `drag and drop` the folders in `directory upload`.

### ColorPicker

#### Breaking Changes

- Opacity value is removed from `value` when `enableOpacity` property is set as false.

## 17.3.26 (2019-11-05)

### ColorPicker

#### Bug Fixes

- `F147566` - In Palette mode, Empty string color value shows the default color(green) instead of no color has been fixed.

### Uploader

#### New Features

- `#226384`, `#F147065` - Now, the file upload UI get changed for `synchronous upload`.

## 17.3.21 (2019-10-30)

### NumericTextBox

#### Bug Fixes

- `#251466` - Now, you can set width property in `em` unit.

## 17.3.16 (2019-10-09)

### TextBox

#### Bug Fixes

- Issue with `Material2 outline layout` has been resolved.

## 17.3.14 (2019-10-03)

### TextBox

#### New Features

- `#246351` - Provided autocomplete property for setting the autocomplete attribute to the textbox.

## 17.3.9-beta (2019-09-20)

### Slider

#### New Features

- `#234797` - Provided the color customization for each range of the slider track.

### MaskedTextBox

#### Bug Fixes

- Now, e-disabled class is removed from wrapper when dynamically enable the masked textbox from disabled state.

## 17.2.49 (2019-09-04)

### ColorPicker

#### Bug Fixes

- `#243637` - Opacity value is not working Edge browser.

## 17.2.47 (2019-08-27)

### NumericTextBox

#### Bug Fixes

- `#242949` - Resolved the cursor flickering issue on IE11 browser while focus the input by tab and mouse simultaneously.

## 17.2.46 (2019-08-22)

### Slider

#### Bug Fixes

- `I240495` - Ticks rendering issue in the vertical slider has been fixed.

## 17.2.41 (2019-08-14)

### NumericTextBox

#### Bug Fixes

- `#244336` - Now, the percentage textbox value never changed in read-only mode after `focusIn` and `focusOut`.

### Uploader

#### Bug Fixes

- `#F146285`, `244026` - Now, you can get the files in server-side when drag and drop the files in the synchronous upload.

## 17.2.40 (2019-08-06)

### MaskedTextBox

#### Bug Fixes

- `#243500` - Provided `readonly` property to control user interactions.

## 17.2.39 (2019-07-30)

### Uploader

#### Bug Fixes

- `#F145959`, `#242743` - Provided specific type for success event arguments in the `Uploader`.

## 17.2.36 (2019-07-24)

### Uploader

#### Bug Fixes

- `#F145967`, `#242158` - Resolved removing event restricted while the `args.cancel` is enabled.

- Now, provided `postRawFile` argument to the `remove` method for post either file/file name to the server.

## 17.2.35 (2019-07-17)

### Form Validator

#### Bug Fixes

- `#212351` - Now, localized text of form validator was included in ej2-locale package.

### Uploader

#### Bug Fixes

- `#145718` - Issue with `Material spinner appearance in Safari browser` has been resolved.

### MaskedTextBox

#### Bug Fixes

- `#F145575` - Now, existing `cssClass` removed when change the `cssClass` dynamically.

### TextBox

#### Bug Fixes

- `#240368` - Now, you can get the updated previous value in the `input event` argument.

- `#F145575` - Now, existing `cssClass` removed when change the `cssClass` dynamically.

## 17.2.34 (2019-07-11)

### NumericTextBox

#### Bug Fixes

- `#238077` - Now, numeric textbox model value post to the server instead of a formatted numeric string when submitting the form.

### TextBox

#### New Features

- `#226404`, `#F141814` - Provided `Material2 outline layout` for textbox.

- `#226950` - Provided `Material2 filled layout` for textbox.

#### Bug Fixes

- Now, changed the bottom padding of input to meet the Material theme standard.

- `#240368` - Now, you can get the updated previous value in the `input event` argument.

## 17.2.28-beta (2019-06-27)

### TextBox

#### New Features

- #228310, #233267 - Now, you can add additional html attribute to the element using  `htmlAttributes` property.

#### Bug Fixes

- #238248 - Issue with "throws error while reset the form" has been resolved.

- #235983 - Resolved the HTML5 standard issues in textbox control.

### NumericTextBox

#### New Features

- #228310, #233267 - Now, you can add additional html attribute to the element using  `htmlAttributes` property.

#### Bug Fixes

- #237600 - Now, validation message get removed while change the numeric value through spin buttons.

### MaskedTextBox

#### New Features

- #228310, #233267 - Now, you can add additional html attribute to the element using  `htmlAttributes` property.

## 17.1.50 (2019-06-04)

### Uploader

#### Bug Fixes

- No more script issue occurs, on rendering the preload files as empty.

## 17.1.49 (2019-05-29)

### TextBox

#### New Features

- #236816 - Provided method to `focusIn` and `focusOut`.

### NumericTextBox

#### New Features

- #236816 - Provided method to `focusIn` and `focusOut`.

### MaskedTextBox

#### New Features

- #236816 - Provided method to `focusIn` and `focusOut`.

#### Bug Fixes

- Now, MaskedTextBox renders properly after calling `refresh` method.

### Uploader

#### Bug Fixes

- #235532 - Now, you can remove the uploaded files, while using the uploader within form.

## 17.1.44 (2019-05-07)

### MaskedTextBox

#### Bug Fixes

- #230545 - Issue with inequality of Masked Textbox element value and argument value of input event while typing rapidly has been fixed.

- #F144247 - Issue with "typed character update on the next position while typing the same digit" has been fixed.

## 17.1.41 (2019-04-16)

### NumericTextBox

#### Bug Fixes

- #231530 - Now, `change` event trigger when click on clear button.

### TextBox

#### Bug Fixes

- #231530 - Issue with event argument has null value when click on clear button has been fixed.

## 17.1.40 (2019-04-09)

### Uploader

#### Bug Fixes

- In latest chrome browser, file list is not generated issue fixed.

### Form Validator

#### Bug Fixes

- When using multiple forms with same name fields, validation not occurs issue has been fixed.

## 17.1.38 (2019-03-29)

### Form Validator

#### Bug Fixes

- Resolved issue with same validation message displays for all fields when provide validation messages using data attribute.

### Uploader

#### Bug Fixes

- File name ellipsis issue in `edge` browser has been fixed.

### TextBox

#### Bug Fixes

- When textbox contains value initially, no more change event will trigger while focus followed by focus out.

## 17.1.32-beta (2019-03-13)

### MaskedTextBox

#### Bug Fixes

- Now, you can get the proper masked textbox value in the `change` event.

### TextBox

#### New Features

- Provided option to render `multiline textbox` (textarea).

#### Bug Fixes

- Now input event will trigger after clear the textbox value using clear icon.

### Uploader

#### Bug Fixes

- Issue with uploading the file within the form has been fixed.

- Issue with updating the uploader buttons text in firefox lower versions has been fixed.

### Slider

#### New Features

- Now only single tooltip will be displayed in range slider for resize and drag actions for better user interface.

## 16.4.55 (2019-02-27)

### TextBox

#### Bug Fixes

- Now, the validation works with complex names also.

### Uploader

#### Bug Fixes

- Resolved the issue with `Tab` key navigation in uploader file list.

### Slider

#### New Features

- Now, Range Slider in Material theme will support `showOn` property.
- Now, Single tooltip will be used to display values in Range Slider.

### FormValidator

#### Bug Fixes

- Now, the url validation works with all types of url.

## 16.4.54 (2019-02-19)

### TextBox

#### Bug Fixes

- Now, input event will trigger after clear the textbox value using clear icon.

- Now, the default value is set to the textbox while resetting the form.

### Slider

#### Bug Fixes

- Now, the initial value is setback to the `slider` on form `reset`.

### Uploader

#### Bug Fixes

- Uploader file list will be cleared while reset the form.

#### New Features

- Provided `cssClass` property to add custom CSS classes to an uploader.

### MaskedTextBox

#### Bug Fixes

- Issue with, “MaskedTextBox not restoring the initial value on form reset” has been fixed.

### NumericTextBox

#### Bug Fixes

- Issue with, “NumericTextBox not restoring the initial value on form reset” has been fixed.

## 16.4.53 (2019-02-13)

### ColorPicker

#### Bug Fixes

- Form reset issue is fixed.

## 16.4.52 (2019-02-05)

### MaskedTextBox

#### New Features

- Provided the "focus" and "blur" events for MaskedTextBox that will trigger when the control got focus or losses focus.

### NumericTextBox

#### New Features

- Provided the "focus" and "blur" events for NumericTextBox that will trigger when the control got focus or losses focus.

## 16.4.48 (2019-01-22)

### Uploader

#### New Features

- Provided template support for preloaded files also to customize its default file list structure.

#### Bug Fixes

- Provided option to hide generated promise error manually on ajax failed event.

## 16.4.47 (2019-01-16)

### TextBox

#### Bug Fixes

- The issue with `refresh` method of textbox has been fixed.

- Resolved the issue with placeholder property has 'null' value in Edge browser.

## 16.4.46 (2019-01-08)

### Uploader

#### New Features

- Provided option to customize file upload's status message (label) which is sent from server on success and failure events.

- Provided event which trigger before rendering each file item in a page that helps to customize its default UI structure.

- Provided event to denote all the selected files has processed to upload successfully or failed to server.

#### Bug Fixes

- Resolved the issue with updating file data in uploader element while drag-and-drop the files.

## 16.4.45 (2019-01-02)

### Common

#### Bug Fixes

- Fixed `CustomPlacement` typing issue.

## 16.4.40-beta (2018-12-10)

### Uploader

#### New Features

- Enabled sequential upload support to file upload component that upload the selected files one after the other to the server.

- New event provided "chunkUploading" which trigger on every chunk to be upload in file upload.

- Provided the option to get additional data back from a server to client on file upload.

### FormValidator

#### New Features

- **Localization** - Supports to localize error message for the "FormValidator" to different cultures.

## 16.3.33 (2018-11-20)

### FormValidator

#### Bug Fixes

- Form validator `email` and `min` validation issues has been fixed.

### TextBox

#### Bug Fixes

- The issue with receiving event arguments of TextBox events have been fixed.

## 16.3.29 (2018-10-31)

### MaskedTextBox

#### Bug Fixes

- Issue with using the space as "promptChar" in Masked TextBox has been fixed.

### NumericTextBox

#### Bug Fixes

- Issue with triggering unwanted “focusout” and “change” events has been fixed.

### Uploader

#### Bug Fixes

- Resolved the issue with triggering selected event on cancel the file selection.

## 16.3.27 (2018-10-23)

### TextBox

#### Bug Fixes

- The issue with updating `value` property on model binding has been fixed.

## 16.3.25 (2018-10-15)

### TextBox

#### Bug Fixes

- The issue with adding multiple classes in `cssClass` property has been fixed.

### MaskedTextBox

#### Bug Fixes

- Issue with entering the first character in masked text box when "floatLabelType" is set to "Never" has been fixed.

- Always last MaskedTextBox component get focus on initial page load in IE browser, issue has been fixed.

## 16.3.24 (2018-10-09)

### MaskedTextBox

#### Bug Fixes

- Issue with setting placeholder in IE browser when "floatLabelType" is set to "never" has been fixed.

## 16.3.22 (2018-09-25)

### FormValidator

#### Bug Fixes

- Form validator for number contain email domain name issue has been fixed.

### NumericTextBox

#### Bug Fixes

- Validation is not working properly for "NumericTextBox" in focus out, issue has been fixed

## 16.3.21 (2018-09-22)

### ColorPicker

#### Bug Fixes

- ColorPicker collision issue fixed.

## 16.3.17 (2018-09-12)

### Uploader

#### New Features

- Provided directory (folder) upload support that uploads all files of folder including sub-folder to server.

- Provided paste to upload support that helps to uploads any images to a server on pasting images from clipboard.

#### Bug Fixes

- The files with the wrong extension cannot be uploaded when filtering the files by all files in the file dialog.

- The `clearAll` method removes upload element’s value along with file list.

- Resolved the issue with uploading a file while disable the `showFileList` API.

- In synchronous upload, while removing a particular file from file list will clear all the files now since couldn't manipulate each file details in input file element.

- Resolved the issue with adding the additional form data in IE browser.

### TextBox

#### New Features

- Included TextBox component as JavaScript component with floating functionality.

#### Bug Fixes

- Resolved the issue with customizing the textbox background color with minimal CSS.

- Resolved the issue with the floating label when choose the value using `autofill` option in chrome browser.

## 16.2.48 (2018-08-14)

### NumericTextBox

#### Bug Fixes

- Issue with entering the text in numeric text box from Firefox browser has been fixed.
- Resolved the issue in numeric text box that did not allow editing the value while using decimal value as 0.

### MaskedTextBox

#### Bug Fixes

- Resolved the issue with masked text box change event is triggered multiple times while changing the value dynamically.

- Issue occurs while using chrome autofill functionality with masked text box component has been fixed.

## 16.2.47 (2018-08-07)

### MaskedTextBox

#### Bug Fixes

- Issue with setting the background color for masked text box has been fixed.

- Issue with adding name attribute in the input element while creating masked text box without name attribute has been resolved.

## 16.2.44 (2018-07-10)

### NumericTextBox

#### Bug Fixes

- Unable to set higher values for min, max, and value properties of numeric text box issue has been fixed.

## 16.2.41 (2018-06-25)

### Common

#### Breaking Changes

- The splitbuttons package is used by ColorPicker component, so the splitbuttons package is a dependency for the inputs package.

### Form-validator

#### New Features

- Provided option to validate the hidden element by using `validateHidden` attribute.

### MaskedTextBox

#### New Features

- Provided option to show/hide clear button to reset the value in MaskedTextBox

### NumericTextBox

#### New Features

- Provided option to show/hide clear button to reset the value in NumericTextBox.
- Prevented to type unwanted text and symbols in NumericTextBox.

### Slider

#### New Features

- Limits implemented to limit movement interval of min and max values to certain range.
- Drag interval implemented to interact with the range slider by dragging the range.
- Provided to support custom value arrays.
- Bootstrap theme tooltip appearance improved by enabling tooltip pointer.

#### Breaking Changes

- The following API namings are renamed.

| Existing API Name | New API Name    |
| :-------------:   |:-------------:  |
| readOnly          | readonly        |

### ColorPicker

Color picker is a user interface that is used to select and adjust color values.

- **Color specification**: Supports `Red Green Blue`, `Hue Saturation Value` and `Hex` codes.

- **Mode**: Supports `Picker` and `Palette` mode.

- **Inline**: Supports inline type rendering of color picker.

- **Custom palettes**: Allows you to customize palettes and supports multiple palette groups rendering.

- **Opacity**: Allows to set and change the `opacity` of the selected color.

- **Accessibility**: Built-in accessibility features to access color picker using the keyboard, screen readers, or other assistive technology devices.

### Uploader

#### New Features

- Added `chunked upload` support to upload large files asynchronously with `pause` and `resume` options.
- Support has been provided to resume automatically on failed chunk up to `maximum retry` options.
- Included option to handle `retry upload` through UI (User Interface).
- Support to `cancel the request` while uploading a file is added.

#### Bug Fixes

- Provided option to customize request header on trigger uploading and removing events.
- Provided option to add additional data in removing event.
- The issue with rendering Uploader component in internet explorer browser has been fixed.
- The issue with submitting single file upload's value has been fixed.

### TextBox

#### New Features

- The clear button can be enabled/disabled dynamically through `setClearButton` method.

#### Bug Fixes

- Theme compatibility issue resolved for CSS Input component.

## 16.1.45 (2018-05-23)

### Input

#### Bug Fixes

- Added `Focus` and `Blur` event arguments.

## 16.1.40 (2018-05-08)

### MaskedTextBox

#### Bug Fixes

- While copying a text and hold the “Ctrl + v” on the MaskedTextBox with number mask, value is not updating properly
  along with script error issue has been fixed.

## 16.1.38 (2018-05-02)

### NumericTextBox

#### Bug Fixes

- Now native events triggered properly in Angular NumericTextBox component.

## 16.1.37 (2018-04-24)

### NumericTextBox

#### New Features

- Provided clear button option in NumericTextBox.

#### Bug Fixes

- NumericTextBox is now aligned properly in inline element when `showSpinButton` property disabled.

## 16.1.35 (2018-04-17)

### MaskedTextBox

#### Bug Fixes

- While dynamically changing the MaskedTextBox value as null, value not updated properly issue is fixed.

## 16.1.28 (2018-03-09)

### NumericTextBox

#### Bug Fixes

- In NumericTextBox, unwanted “change” events has been prevented from triggering.

## 16.1.24 (2018-02-22)

### Uploader

    The Uploader component is useful to upload images, documents, and other files to server.
The component is extended version of HTML5 upload with multiple file selection, auto upload,
drag and drop, progress bar, preload files, and validation.

- The available key features are

- **Asynchronous Upload** - Allows you to upload the files with asynchronous way.

- **Drag and Drop** - The files can be dragged from file explorer, and dropping into the drop area.

- **Form Supports** - The selected or dropped files are received as a collection in a form action when the form is submitted.

- **File Validation** - Validate the files based on file's size and type.

- **Template** - Allows you to customize the default appearance of `Uploader`.

- **Accessibility** - provides built-in accessibility support which helps to access all the  `Uploader` features through keyboard, on-screen readers, or other assistive technology devices.

### TextBox

#### Bug Fixes

- Fixed the input alignment issue in the window 8.1 edge browser.

- Removed the additional spaces for error messages on the input.

### Slider

The Slider component allows the user to select a value or range of values in-between the min and max range, by dragging the handle over the slider bar.

There are three types of Slider:

- `Default` - Shows a default slider to select a single value.
- `MinRange` - Displays fill color from the start value to the current selected value.
- `Range` - Select a range of values.

The available key features are

- **Types**: Provided three types of Slider.

- **Orientation**: Displays the Slider in horizontal or vertical direction.

- **Buttons**: Provided built-in support to render the buttons in both edges of the Slider.

- **Tooltip**: Displays a tooltip to show the currently selected value.

- **Ticks**: Displays a scale with small and big ticks.

- **Format**: Customize the slider values into various format.

- **Accessibility**: Built-in compliance with the [`WAI-ARIA`](http://www.w3.org/WAI/PF/aria-practices/) specifications.

- **Keyboard Interaction**: The Slider can be intractable through the keyboard.

## 15.4.29-preview (2018-02-07)

### MaskedTextBox

#### Bug Fixes

- While set floatLabelType property as "Never", the placeholder not shown issue has been fixed

- While set floatLabelType property as "Auto", the value becomes "undefined" at two-way binding issue has been fixed

- While setting escape sequence in mask format, value is not updated properly issue has been fixed

- Cursor is not positioned properly while focusing the MaskedTextBox issue has been fixed

## 15.4.24-preview (2018-01-10)

### MaskedTextBox

#### Bug Fixes

- Value not maintained properly in the MaskedTextBox two-way binding

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling

## 15.4.21-preview (2017-12-08)

### FormValidator

#### Bug Fixes

- **IE11** - Recursive call on form reset.

### TextBox

#### Bug Fixes

- Height mismatch between input and input with icon issue has fixed.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2.

## 15.4.17-preview (2017-11-13)

### TextBox

TextBox is an input element that allows to get input from the user. It allows the user to edit or display the text value.

- **Groups** - Supports to group the icon element with the input

- **Floating Label** - Added option to float label always, float label on focus, and disable floating support in the input element.

- **Clear Button** - Provided option to show/hide clear button to reset the value in input element.

- **Validation States** - Provided option to indicate success, error, and warning states.

### NumericTextBox

NumericTextBox is used to get the number inputs from the user. The input values can be incremented or decremented by a predefined step value. The available key features are

- **Range Validation** - allows to set the minimum and maximum range of values in the NumericTextBox.

- **Number Formats** - supports the number display formatting with MSDN standard and custom number formats.

- **Precision Of Numbers** - allows to restrict the number precision when enters the value.

- **Keyboard Interaction** - allows users to interact with the NumericTextBox using the keyboard.

- **Accessibility** - provides built-in accessibility support which helps to access all the NumericTextBox component features through keyboard, on-screen readers or other assistive technology devices.

- **Internationalization** - library provides support for formatting and parsing number using the official Unicode CLDR JSON data.

- **Localization** - Supports to localize spin up and down buttons title for the tooltip to different cultures.

### MaskedTextBox

MaskedTextBox allows the user to enter the valid input only based on the provided mask. The available key features are

- **Custom Characters** - allows you to use your own characters as the mask elements.

- **Regular Expression** - can be used as a mask element for each character of the MaskedTextBox.

- **Accessibility** - provides built-in accessibility support which helps to access all the MaskedTextBox component features through keyboard, on-screen readers, or other assistive technology devices.
