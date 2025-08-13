# Changelog

## [Unreleased]

## 30.2.5 (2025-08-13)

### Ribbon

#### Bug Fixes

`#I744491` - Now the script error raised in Ribbon on window resizing with minimal layout has been resolved.

## 30.1.39 (2025-07-08)

### Ribbon

#### Bug Fixes

`#I736914` - Now the issue with script error raised on window resizing, after the ribbon is destroyed has been resolved.

## 25.1.35 (2024-03-15)

### Ribbon

#### Features

- **Gallery item** - In addition to the existing built-in items, a new item, gallery, has been added to the Ribbon control. It allows users to perform specific actions by displaying a collection of related items, including icons, content, or images. Check out the demo [here](https://ej2.syncfusion.com/demos/#/material3/ribbon/gallery.html).

- **Contextual tabs** - The Ribbon control now supports addition of contextual tabs, allows users to display the ribbon tabs on demand based on their needs. Similar to the normal ribbon tabs, it supports adding all built-in and custom ribbon items to execute specific actions. Check out the demo [here](https://ej2.syncfusion.com/demos/#/material3/ribbon/contextual-tab.html).

- **KeyTips support** - The KeyTips feature enables users to quickly access the tabs or ribbon items by using defined unique key tips (up to 3 characters). To show the KeyTips, press Alt + Windows/Command keys, and close or traverse back by pressing the Esc key.  Check out the demo [here](https://ej2.syncfusion.com/demos/#/material3/ribbon/keytip.html).

## 24.1.41 (2023-12-18)

### Ribbon

#### Features

- Enhanced the popups UI with added label/header support for items displayed in overflow popups. Check out the demo [here](https://ej2.syncfusion.com/angular/demos/#/material3/ribbon/resize).

#### Bug Fixes

- `#F185735` - Issue with 'selected' property not updating properly when selecting an item from Ribbon GroupButton has been resolved.

## 23.2.7 (2023-12-05)

### Ribbon

#### Features

`#I512188` - Provided overflow popup open/close event support for the Ribbon overflow popup.

## 23.2.5 (2023-11-23)

### Ribbon

#### Bug Fixes

`#I516350` - Now the issue with overflow popup button when the items showing inside are in hidden state has been resolved.

## 23.1.44 (2023-11-07)

### Ribbon

#### Bug Fixes

`#I509963` - Now the issue with hide/disable method not working properly with the tab items that are not loaded in initial rendering has been resolved.

`#I510661` - Now the script issue raised with the createPopupOnClick property enabled in the dropdown item overflow popup has been resolved.

## 23.1.43 (2023-10-31)

### Ribbon

#### Features

`#I510343` - Provided custom HTML attributes support for the Ribbon items

## 23.1.38 (2023-09-26)

### Ribbon

#### Bug Fixes

`#I499031` - Now, the issue with overflow popup items are arranged in reversal order when being resized is resolved.

## 21.1.35 (2023-03-23)

### Ribbon

The Ribbon provides a structured and easy-to-use user interface for users to access different features and functions through series of tabs, improving user experience and efficiency.

**Key features**

- **Built-in items** - Several built-in support items, such as buttons, checkboxes, drop-down buttons, split buttons, combo boxes, and color pickers that can be customized and used to execute specific actions.

- **Modes** - Offers the classic mode that organizes items and groups in a traditional form, and simplified mode that organizes items and groups into a single row for improved usability and reduced clutter.

- **Tooltip** - Provide additional information when a user hovers over a ribbon item, improving user experience and increasing the usability of the application.

- **File menu** - A built-in menu that to add file related actions easily.

- **Templates** - Customize ribbon items and the help pane content using templates.