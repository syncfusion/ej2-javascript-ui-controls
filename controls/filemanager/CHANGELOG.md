# Changelog

## [Unreleased]

## 17.4.44 (2021-01-21)

### File Manager

#### Bug Fixes

- Resolved the script error when navigate any folder after changing the toolbar settings dynamically in the file manager component. 

## 17.4.43 (2020-01-14)

### File Manager

#### Bug Fixes

- `#149499` - The issue with date modified in ASP.NET Core Azure File System Provider has been fixed.
- `#256589` - The issue with `Directory traversal vulnerability` in NodeJS File System Provider has been fixed.

## 17.4.41 (2020-01-07)

### File Manager

#### Bug Fixes

- `#258121` - Resolved the CSS warnings in Firefox 71.0 version.

## 17.4.39 (2019-12-17)

### File Manager

#### Bug Fixes

- `#149500` - The issue with `incorrect popup name in popupBeforeOpen event` has been fixed.

#### New Features

- The new events `beforeDownload` and `beforeImageLoad` have been provided to customize the `download` and `getImage` file operations.
- The new ' rootAliasName ' property has been provided to display the custom root folder name.
- Added the filesystem provider support for File Transfer Protocol.

## 17.3.28 (2019-11-19)

### File Manager

#### Bug Fixes

- `#252873` - The issue with `file search on pressing the enter key` has been fixed.

## 17.3.27 (2019-11-12)

### File Manager

#### Bug Fixes

- `#148827` - New event `fileSelection` have been included to restrict the file selection in file manager.

## 17.3.26 (2019-11-05)

### File Manager

#### Bug Fixes

- The issue `file manager throws script error when navigate to the different folder after sorting the path column in details view` has been fixed.

#### New Features

- Support has been provided to include a custom message in `AccessRule` class using the message property.

#### Breaking Changes

- Now, in access control, the `FolderRule` and `FileRule` classes are combined into a single `AccessRule` class, where you can specify both folder and file rules by using the `IsFile` property.
- Now, the `Edit` and `EditContents` in access control are renamed as `Write` and `WriteContents`.

## 17.3.17 (2019-10-15)

### File Manager

#### Breaking Changes

- Now, the rename dialog shows or hides the file name extension based on the `showFileExtension` property value in the file manager.

## 17.3.14 (2019-10-03)

### File Manager

#### Bug Fixes

- The issue with `the fileOpen event that was not triggered for folder navigation through navigation pane` has been fixed.

## 17.3.9-beta (2019-09-20)

### File Manager

#### Bug Fixes

- The issue `file manager’s details view contains the unnecessary scrollbar and eclipsis in Chrome browser (version 76.0.3809.132)` has been fixed.

#### Breaking Changes

- Support has been provided in asp core platform for customizing the columns of file manager's details view. We have also limited the `columns` attributes of the `detailsViewSettings` property instead of accessing the all attributes from the `Grid` sub component.

## 17.2.49 (2019-09-04)

### File Manager

#### Bug Fixes

- The issue `the file manager throws script error when performing sorting in details view when the SortBy button is not present in toolbar` has been fixed.
- The issue `the file manager throws script error when return null response from server for search operation` has been fixed.

#### New Features

- New events have been provided to customize the dialog in file manager.
- New methods have been provided to select all files and clear the selection in current path of the file manager.
- New methods have been provided to customize the context menu items in file manager.

## 17.2.47 (2019-08-27)

### File Manager

#### New Features

- Methods have been provided to perform file operations such as create, upload, download, delete, rename, and open in file manager.

## 17.2.41 (2019-08-14)

### File Manager

#### Bug Fixes

- The issue with the `file manager that throws script error while accessing the shared folder in physical file provider` has been fixed.

#### New Features

- A method has been provided to customize the filtering support in file manager.

## 17.2.40 (2019-08-06)

### File Manager

#### New Features

- The `ID` based support has been provided to the `selectedItems` property to manage the files with duplicate names.

## 17.2.36 (2019-07-24)

### File Manager

#### Bug Fixes

- Issue with `when the component is rendering and you are trying to resize the window the component throws script error` is fixed.

## 17.2.35 (2019-07-17)

### File Manager

#### Bug Fixes

- Issue with `empty folder icon alignment when persistence enabled` is fixed.

## 17.2.34 (2019-07-11)

### File Manager

#### New Features

- Provided the `id` based support for `path` property to manage the files in an efficient way on going with file system providers.

## 17.2.28-beta (2019-06-27)

### File Manager

#### New Features

- Added file system provider support for SQL server database, Microsoft Azure cloud storage, NodeJS framework, and Google Drive cloud storage.
- Provided access control support for physical file system provider.
- Provided cut, copy, and paste file operations support.
- Provided drag and drop support.
- Provided rename and replace support for uploading files.
- Provided options to upload specific types of files based on extensions.

## 17.1.48 (2019-05-21)

### File Manager

#### New Features

- `#144270` - Added support to use the JWT tokens with `beforeSend` event’s Ajax settings.

## 17.1.42 (2019-04-23)

### File Manager

#### New Features

- Added filesystem provider support for ASP.NET MVC 4 and 5 frameworks.

## 17.1.40 (2019-04-09)

### File Manager

#### Breaking Changes

- The `beforeFileLoad` event’s `module` argument values have been changed as follows:

|Argument Name|Old Value|New Value|
|----|----|----|
|module|navigationpane|NavigationPane|
|module|Grid|DetailsView|
|module|LargeIcon|LargeIconView|

## 17.1.32-beta (2019-03-13)

### File Manager

The `File Manager` is a graphical user interface component used to manage the file system. It enables the user to perform common file operations such as accessing, editing, uploading, downloading, and sorting files and folders. This component also allows easy navigation for browsing or selecting a file or folder from the file system.

- **Different Views** - Provides detailed and large icon views.
- **Context menu support** - Provides detailed and large icon views.
- **Custom toolbar support** - Customize the toolbar to provide only necessary features.
- **Multiple file selection** - Select multiple files simultaneously.
- **Accessibility** - Features built-in accessibility support that makes all features accessible through keyboard interaction, screen readers, or other assistive technology devices.
- **Localization** - Translate file names to any supported language.
