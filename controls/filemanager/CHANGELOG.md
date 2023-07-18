# Changelog

## [Unreleased]

## 22.1.39 (2023-07-18)

### File Manager

#### Bug fixes

- `#I472742` - The exception that occurred when using the File Manager download button multiple times in the Amazon File Provider has been resolved.

## 22.1.38 (2023-07-11)

### File Manager

#### Bug fixes

- `#I473871` - The issue with renaming folders or files in the Navigation Pane of the File Manager component has been resolved.

## 22.1.34 (2023-06-21)

### File Manager

#### Features

- Provided the `ShowItemCheckBoxes` property to control the visibility of checkboxes.

## 21.2.5 (2023-05-16)

### File Manager

#### Bug fixes

- `#I458668` - The issue, replace dialog shows when uploading the same file to different directories in File Manager with the SQL File Provider has been resolved.
- `#I464322` - The issue with `fileOpen` event in the File Manager component has been resolved.

## 21.2.3 (2023-05-03)

### File Manager

#### Bug fixes

- `#I439193` - The data disappears in the DetailsView when dynamically setting columns in the File Manager component has been resolved.
- `#I458884` - The issue with the `fileSelect` event in the File Manager component details view has been resolved.

## 21.1.41 (2023-04-18)

### File Manager

#### Bug fixes

- `#I445512` - The issue with the `fileSelection` and `fileSelect` events argument in the File Manager component large icon view has been resolved.

## 21.1.37 (2023-03-29)

### File Manager

#### Bug fixes

- `#I442564` - The issue with `fileOpen` event in File Manager component has been resolved.

## 21.1.35 (2023-03-23)

### File Manager

#### New Features

- Provided the folder (directory) upload support for Physical File Provider.
- Provided the folder (directory) upload support for Azure File Provider.
- Provided the folder (directory) upload support for NodeJS File System Provider.
- Provided the folder (directory) upload support for Amazon S3 File Provider.

## 19.2.56 (2021-08-17)

### File Manager

#### Bug Fixes

- `#I337431` - The issue with "`filterFiles` method in file manager component" has been resolved.

## 19.2.48 (2021-07-20)

### File Manager

#### Bug Fixes

- `#F166908` - The issue with "When pressing Ctrl+A key, the scroll bar is moved to last item in File Manager detail view" has been resolved.

## 19.2.44 (2021-06-30)

### File Manager

#### Bug Fixes

- `#F160683` - The issue with "Error dialog shown while quickly clicking on the folders when enabling drag and drop support" has been resolved.

## 19.1.66 (2021-06-01)

### File Manager

#### Bug Fixes

- `#F165213` - The issue with "The Details view path column is not removed when refreshing the File Manager files" has been resolved.
- `#F160683` - The issue with "Error dialog shown while quickly clicking on the folders when enabling drag and drop support" has been resolved.

## 19.1.63 (2021-05-13)

### File Manager

#### Bug Fixes

- `#I323484` - Now, the warning dialog will be displayed while dropping the searched file into the same source location in the File Manager component.

## 19.1.58 (2021-04-27)

### File Manager

#### Bug Fixes

- `#I321258`, `#I320950` - The issue with "Error as occurred while sorting the path column at second time in File Manager component" has been fixed.
- `#I318476`, `#I320950` - Resolved the script error that occurred while dragging and dropping an item without selecting it in details view of the File Manager component.

## 18.4.41 (2021-02-02)

### File Manager

#### Bug Fixes

- `#305138` - The issue with "Incorrect message is displayed in delete dialog for File Manager Component" has been resolved.

## 18.3.42 (2020-10-20)

### File Manager

#### Bug Fixes

- `#288436` - The issue with "The error dialog appears when copy and paste the folder with the same name" has been resolved.

## 18.2.57 (2020-09-08)

### File Manager

#### Bug Fixes

- `#288598` - Now, the file details will be sent correctly to the server side while using the rootAliasName property.

## 18.2.56 (2020-09-01)

### File Manager

#### Bug Fixes

- Resolved the incorrect delete confirmation dialog content for file in details view of the File Manager component.

## 18.2.48 (2020-08-04)

### File Manager

#### Bug Fixes

- The issue with “The Toolbar is not updated while adding the sortOrder property value as none” is fixed now.

## 18.2.47 (2020-07-28)

### File Manager

#### Bug Fixes

- Resolved the issue with the incorrect delete confirmation dialog heading and content of the File Manager component.

## 18.2.44 (2020-07-07)

### File Manager

#### New Features

- Added the upload customization support for ASP.NET Core AmazonS3 File Provider.
- Added the upload customization support for Google Drive File Provider.
- Added the upload customization support for FTP File Provider.
- Added the upload customization support for Firebase Realtime Database File Provider.
- `#151112`, `#152443` - Added the access control support for SQL Server File Provider.
- `#260977`, `#263918` - Added the file provider support in ASP.NET MVC for Amazon S3(Simple Storage Service) bucket storage service.
- `#275878` - Provided an option to prevent default sorting of the files and folders in the File Manager component.
- Provided the support to display the File Manager's dialog at the user specified target.

## 18.1.56 (2020-06-09)

### File Manager

#### Bug Fixes

- The issue with "File name is not displayed in the access control error message" has been fixed.

## 18.1.55 (2020-06-02)

### File Manager

#### Bug Fixes

- The issue with "The toolbar is not updated when selecting the root folder in the File Manager component" has been resolved.

## 18.1.53 (2020-05-19)

### File Manager

#### Bug Fixes

- Resolved the script error thrown from the File Manager component when resizing the window.

## 18.1.46 (2020-04-28)

### File Manager

#### Bug Fixes

- The issue with `Unable to localize the error message in the access control actions` has been fixed.
- `#269976` - Now, The File Manager UI will be refreshed properly when resizing the browser window.

## 18.1.36-beta (2020-03-19)

### File Manager

#### Bug Fixes

- `#266091` - Now, the date modified column in the details view is globalized based on the locale value.
- `#266713` - The script error thrown while performing the GetImage operation in NodeJS File System Provider has been fixed.

#### New Features

- Added the File Provider support for IBM Cloud Object Storage.
- `#262023` - Added the upload customization support for ASP.NET Core Azure File Provider.
- `#151515` - Added the upload customization support for SQL Server File Provider.

## 17.4.51 (2020-02-25)

### File Manager

#### New Features

- `#263021` - Support has been provided to auto close the upload dialog after uploading all the selected files.

## 17.4.50 (2020-02-18)

### File Manager

#### Bug Fixes

- `#262675` - Provided the support to prevent the XSS attacks using the `enableHtmlSanitizer` property.
- The issue with the given `name` column's width that is not applied in details view has been resolved.

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
