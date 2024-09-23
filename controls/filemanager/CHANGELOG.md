# Changelog

## [Unreleased]

## 27.1.50 (2024-09-24)

### FileManager

#### Features

- The Backspace key navigation support is provided for File Manager to navigate to the previous path in File Manager. To navigate to the previous path programmatically, you can use the [traverseBackward](https://ej2.syncfusion.com/documentation/api/file-manager/#traversebackward) method.
- The File Manager supports for selecting files and folders in specific ranges through mouse drag as like File Explorer. This can be enabled through [enableRangeSelection](https://ej2.syncfusion.com/documentation/api/file-manager/#enablerangeselection) property.
- `#FB22674`- [SharePoint file service](https://github.com/SyncfusionExamples/sharepoint-aspcore-file-provider/tree/master) has been implemented to connect as backend with File Manager.

## 26.2.11 (2024-08-27)

### FileManager

#### Bug Fixes

- `#I620497` - Provided `menuClose` event support to prevent the context menu close action in File Manager component.
- `#I615927` - The issue with the drag and drop action in the navigation pane of the File Manager component has been resolved.

## 26.2.10 (2024-08-20)

### FileManager

#### Bug Fixes

- `#I620476` - Improved error handling and null value management in File Manager component file operations.

## 26.2.7 (2024-07-30)

### FileManager

#### Bug Fixes

- `#I608803` - The issue with renaming the tree item by directly right-clicking the item has been resolved.
- `#F189075` - The issue with rendering the File Manager component using flat data support based on the root folder ID has been resolved.
- `#I608802` - The issue with copy and paste a folder within File Manager component navigation pane has been resolved.
  
## 26.1.41 (2024-07-09)

### FileManager

#### Bug Fixes

- `#I603942` - Column hide issue in details view pane when utilizing the `hideAtMedia` property in File Manager component has been resolved.

## 26.1.40 (2024-07-02)

### FileManager

#### Bug Fixes

- `#I603473` - Resolved the issue where the context menu item in the File Manager component remained disabled after opening the context menu for the root folder in the navigation pane.

## 26.1.35 (2024-06-11)

### FileManager

#### Features

- `#FB10417` - Provided support for rendering flat data objects in FileManager component, removing the necessity for server requests and backend URL configuration. This enhancement also eliminating the need to define `ajaxSettings` while rendering the component.
- Now, we have provided [closeDialog](https://ej2.syncfusion.com/documentation/api/file-manager/#closeDialog) method in FileManager to programmatically close the
delete, rename, upload, create, details and other dialog popups.
- Introduced new event support for actions performed within the FileManager component. These new events significantly expand your ability to tailor and enhance your interactions within the File Manager, providing you with more control and flexibility. Below, you will find the corresponding event names and event argument details.

**Event Information**

Event Name | Argument Name | Properties | Description
 ---  | ---  | --- | ---
[beforeDelete](https://ej2.syncfusion.com/documentation/api/file-manager/#beforedelete) | DeleteEventArgs | path, itemData, cancel. | This event is triggered before the deletion of a file or folder occurs. It can be utilized to prevent the deletion of specific files or folders. Any actions, such as displaying a spinner for deletion, can be implemented here.
[delete](https://ej2.syncfusion.com/documentation/api/file-manager/#delete) | DeleteEventArgs | path, itemData, cancel. | This event is triggered after the file or folder is deleted successfully. The deleted file or folder details can be retrieved here. Additionally, custom elements' visibility can be managed here based on the application's use case.
[beforeFolderCreate](https://ej2.syncfusion.com/documentation/api/file-manager/#beforefoldercreate) | FolderCreateEventArgs | path, folderName, parentFolder, cancel. | This event is triggered before a folder is created. It allows for the restriction of folder creation based on the application's use case.
[folderCreate](https://ej2.syncfusion.com/documentation/api/file-manager/#foldercreate) | FolderCreateEventArgs | path, folderName, parentFolder, cancel. | This event is triggered when a folder is successfully created. It provides an opportunity to retrieve details about the newly created folder.
[search](https://ej2.syncfusion.com/documentation/api/file-manager/#search) | SearchEventArgs | showHiddenItems, caseSensitive, searchText, path, cancel, searchResults. | This event is triggered when a search action occurs in the search bar of the File Manager component. It triggers each character entered in the input during the search process.
[beforeRename](https://ej2.syncfusion.com/documentation/api/file-manager/#beforerename) | RenameEventArgs | path, itemData, newName, cancel. | This event is triggered when a file or folder is about to be renamed. It allows for the restriction of the rename action for specific folders or files by utilizing the cancel option.
[rename](https://ej2.syncfusion.com/documentation/api/file-manager/#rename) | RenameEventArgs | path, itemData, newName, cancel. | This event is triggered when a file or folder is successfully renamed. It provides an opportunity to fetch details about the renamed file.
[beforeMove](https://ej2.syncfusion.com/documentation/api/file-manager/#beforemove) | MoveEventArgs  | path, targetPath, targetData, itemData, isCopy, cancel. | This event is triggered when a file or folder begins to move from its current path through a copy/cut and paste action.
[move](https://ej2.syncfusion.com/documentation/api/file-manager/#move) | MoveEventArgs | path, targetPath, targetData, itemData, isCopy, cancel. | This event is triggered when a file or folder is pasted into the destination path.

#### Bug Fixes

- `#I594282` - Resolved the fileOpen event issue in the File Manager component.

## 25.2.6 (2024-05-28)

### FileManager

#### Bug Fixes

- `#I590909` - Resolved the file selection issue when enabling the virtualization support in the File Manager component.

## 25.2.3 (2024-05-08)

### FileManager

#### Breaking Changes

- The [`isPrimayKey`](https://ej2.syncfusion.com/documentation/api/file-manager/columnModel/#isprimarykey) property in the File Manager component `detailsViewSettings` has been marked as deprecated. It will continue to function as before, but it is recommended to avoid using it in new code as this usage is handled internally without declaring it in sample.

## 25.1.40 (2024-04-16)

### FileManager

#### Bug Fixes

- `#I574902` - The error dialog that appears when refreshing the File Manager component's SQL service has been resolved.

## 25.1.39 (2024-04-09)

### FileManager

#### Bug Fixes

- `#I574481` - The issue with context menu items not getting disabled when menu items contain spaces in the File Manager component has been resolved.
- `#I573974` - The console error while trying to persist the deleted file in the File Manager component has been resolved.
- `#I574902` - The error dialog that appears when refreshing the File Manager component's SQL service has been resolved.

## 25.1.38 (2024-04-02)

### FileManager

#### Bug Fixes

- `#I572635` - The problem where an extra plus icon appeared in the details view of the file manager component when in mobile mode has been resolved.

## 25.1.37 (2024-03-26)

### FileManager

#### Bug Fixes

- `#I561123` - The issue with being unable to sort the header columns using keyboard interaction has been resolved.

## 25.1.35 (2024-03-15)

### FileManager

#### Bug Fixes

- `#FB50961` - The issues related to XSS attacks with file or folder names in the File Manager details view template is fixed.

### FileManager

#### Features

- Provided support in FileManager component to perform download operations via Fetch API request. Now FileManager component, will allow users to perform download operations using either the default form submit method or the latest Fetch API request with a Boolean property `useFormPost` in the `BeforeDownloadEventargs`. The default value of `useFormPost` is set to `true`, directing the FileManager component to utilize the form submit method by default for download operations.

## 24.1.41 (2023-12-18)

### FileManager

#### Features

- `#FB44788` - Provided template support to customize toolbar items. In earlier versions, Toolbar item customization was limited to a predefined set of options. With this new feature, you can now define your own templates to completely customize the appearance and functionality of toolbar items.

## 19.2.56 (2021-08-17)

### FileManager

#### Bug Fixes

- `#I337431` - The issue with "`filterFiles` method in FileManager component" has been resolved.

## 19.2.48 (2021-07-20)

### FileManager

#### Bug Fixes

- `#F166908` - The issue with "When pressing Ctrl+A key, the scroll bar is moved to last item in FileManager detail view" has been resolved.

## 19.2.44 (2021-06-30)

### FileManager

#### Bug Fixes

- `#F160683` - The issue with "Error dialog shown while quickly clicking on the folders when enabling drag and drop support" has been resolved.

## 19.1.66 (2021-06-01)

### FileManager

#### Bug Fixes

- `#F165213` - The issue with "The Details view path column is not removed when refreshing the FileManager files" has been resolved.
- `#F160683` - The issue with "Error dialog shown while quickly clicking on the folders when enabling drag and drop support" has been resolved.

## 19.1.63 (2021-05-13)

### FileManager

#### Bug Fixes

- `#I323484` - Now, the warning dialog will be displayed while dropping the searched file into the same source location in the FileManager component.

## 19.1.58 (2021-04-27)

### FileManager

#### Bug Fixes

- `#I321258`, `#I320950` - The issue with "Error as occurred while sorting the path column at second time in FileManager component" has been fixed.
- `#I318476`, `#I320950` - Resolved the script error that occurred while dragging and dropping an item without selecting it in details view of the FileManager component.

## 18.4.41 (2021-02-02)

### FileManager

#### Bug Fixes

- `#305138` - The issue with "Incorrect message is displayed in delete dialog for FileManager Component" has been resolved.

## 18.3.42 (2020-10-20)

### FileManager

#### Bug Fixes

- `#288436` - The issue with "The error dialog appears when copy and paste the folder with the same name" has been resolved.

## 18.2.57 (2020-09-08)

### FileManager

#### Bug Fixes

- `#288598` - Now, the file details will be sent correctly to the server side while using the rootAliasName property.

## 18.2.56 (2020-09-01)

### FileManager

#### Bug Fixes

- Resolved the incorrect delete confirmation dialog content for file in details view of the FileManager component.

## 18.2.48 (2020-08-04)

### FileManager

#### Bug Fixes

- The issue with “The Toolbar is not updated while adding the sortOrder property value as none” is fixed now.

## 18.2.47 (2020-07-28)

### FileManager

#### Bug Fixes

- Resolved the issue with the incorrect delete confirmation dialog heading and content of the FileManager component.

## 18.2.44 (2020-07-07)

### FileManager

#### New Features

- Added the upload customization support for ASP.NET Core AmazonS3 File Provider.
- Added the upload customization support for Google Drive File Provider.
- Added the upload customization support for FTP File Provider.
- Added the upload customization support for Firebase Realtime Database File Provider.
- `#151112`, `#152443` - Added the access control support for SQL Server File Provider.
- `#260977`, `#263918` - Added the file provider support in ASP.NET MVC for Amazon S3(Simple Storage Service) bucket storage service.
- `#275878` - Provided an option to prevent default sorting of the files and folders in the FileManager component.
- Provided the support to display the FileManager's dialog at the user specified target.

## 18.1.56 (2020-06-09)

### FileManager

#### Bug Fixes

- The issue with "File name is not displayed in the access control error message" has been fixed.

## 18.1.55 (2020-06-02)

### FileManager

#### Bug Fixes

- The issue with "The toolbar is not updated when selecting the root folder in the FileManager component" has been resolved.

## 18.1.53 (2020-05-19)

### FileManager

#### Bug Fixes

- Resolved the script error thrown from the FileManager component when resizing the window.

## 18.1.46 (2020-04-28)

### FileManager

#### Bug Fixes

- The issue with `Unable to localize the error message in the access control actions` has been fixed.
- `#269976` - Now, The FileManager UI will be refreshed properly when resizing the browser window.

## 18.1.36-beta (2020-03-19)

### FileManager

#### Bug Fixes

- `#266091` - Now, the date modified column in the details view is globalized based on the locale value.
- `#266713` - The script error thrown while performing the GetImage operation in NodeJS File System Provider has been fixed.

#### New Features

- Added the File Provider support for IBM Cloud Object Storage.
- `#262023` - Added the upload customization support for ASP.NET Core Azure File Provider.
- `#151515` - Added the upload customization support for SQL Server File Provider.

## 17.4.51 (2020-02-25)

### FileManager

#### New Features

- `#263021` - Support has been provided to auto close the upload dialog after uploading all the selected files.

## 17.4.50 (2020-02-18)

### FileManager

#### Bug Fixes

- `#262675` - Provided the support to prevent the XSS attacks using the `enableHtmlSanitizer` property.
- The issue with the given `name` column's width that is not applied in details view has been resolved.

## 17.4.44 (2021-01-21)

### FileManager

#### Bug Fixes

- Resolved the script error when navigate any folder after changing the toolbar settings dynamically in the FileManager component.

## 17.4.43 (2020-01-14)

### FileManager

#### Bug Fixes

- `#149499` - The issue with date modified in ASP.NET Core Azure File System Provider has been fixed.
- `#256589` - The issue with `Directory traversal vulnerability` in NodeJS File System Provider has been fixed.

## 17.4.41 (2020-01-07)

### FileManager

#### Bug Fixes

- `#258121` - Resolved the CSS warnings in Firefox 71.0 version.

## 17.4.39 (2019-12-17)

### FileManager

#### Bug Fixes

- `#149500` - The issue with `incorrect popup name in popupBeforeOpen event` has been fixed.

#### New Features

- The new events `beforeDownload` and `beforeImageLoad` have been provided to customize the `download` and `getImage` file operations.
- The new ' rootAliasName ' property has been provided to display the custom root folder name.
- Added the filesystem provider support for File Transfer Protocol.

## 17.3.28 (2019-11-19)

### FileManager

#### Bug Fixes

- `#252873` - The issue with `file search on pressing the enter key` has been fixed.

## 17.3.27 (2019-11-12)

### FileManager

#### Bug Fixes

- `#148827` - New event `fileSelection` have been included to restrict the file selection in FileManager.

## 17.3.26 (2019-11-05)

### FileManager

#### Bug Fixes

- The issue `FileManager throws script error when navigate to the different folder after sorting the path column in details view` has been fixed.

#### New Features

- Support has been provided to include a custom message in `AccessRule` class using the message property.

#### Breaking Changes

- Now, in access control, the `FolderRule` and `FileRule` classes are combined into a single `AccessRule` class, where you can specify both folder and file rules by using the `IsFile` property.
- Now, the `Edit` and `EditContents` in access control are renamed as `Write` and `WriteContents`.

## 17.3.17 (2019-10-15)

### FileManager

#### Breaking Changes

- Now, the rename dialog shows or hides the file name extension based on the `showFileExtension` property value in the FileManager.

## 17.3.14 (2019-10-03)

### FileManager

#### Bug Fixes

- The issue with `the fileOpen event that was not triggered for folder navigation through navigation pane` has been fixed.

## 17.3.9-beta (2019-09-20)

### FileManager

#### Bug Fixes

- The issue `FileManager’s details view contains the unnecessary scrollbar and eclipsis in Chrome browser (version 76.0.3809.132)` has been fixed.

#### Breaking Changes

- Support has been provided in asp core platform for customizing the columns of FileManager's details view. We have also limited the `columns` attributes of the `detailsViewSettings` property instead of accessing the all attributes from the `Grid` sub component.

## 17.2.49 (2019-09-04)

### FileManager

#### Bug Fixes

- The issue `the FileManager throws script error when performing sorting in details view when the SortBy button is not present in toolbar` has been fixed.
- The issue `the FileManager throws script error when return null response from server for search operation` has been fixed.

#### New Features

- New events have been provided to customize the dialog in FileManager.
- New methods have been provided to select all files and clear the selection in current path of the FileManager.
- New methods have been provided to customize the context menu items in FileManager.

## 17.2.47 (2019-08-27)

### FileManager

#### New Features

- Methods have been provided to perform file operations such as create, upload, download, delete, rename, and open in FileManager.

## 17.2.41 (2019-08-14)

### FileManager

#### Bug Fixes

- The issue with the `FileManager that throws script error while accessing the shared folder in physical file provider` has been fixed.

#### New Features

- A method has been provided to customize the filtering support in FileManager.

## 17.2.40 (2019-08-06)

### FileManager

#### New Features

- The `ID` based support has been provided to the `selectedItems` property to manage the files with duplicate names.

## 17.2.36 (2019-07-24)

### FileManager

#### Bug Fixes

- Issue with `when the component is rendering and you are trying to resize the window the component throws script error` is fixed.

## 17.2.35 (2019-07-17)

### FileManager

#### Bug Fixes

- Issue with `empty folder icon alignment when persistence enabled` is fixed.

## 17.2.34 (2019-07-11)

### FileManager

#### New Features

- Provided the `id` based support for `path` property to manage the files in an efficient way on going with file system providers.

## 17.2.28-beta (2019-06-27)

### FileManager

#### New Features

- Added file system provider support for SQL server database, Microsoft Azure cloud storage, NodeJS framework, and Google Drive cloud storage.
- Provided access control support for physical file system provider.
- Provided cut, copy, and paste file operations support.
- Provided drag and drop support.
- Provided rename and replace support for uploading files.
- Provided options to upload specific types of files based on extensions.

## 17.1.48 (2019-05-21)

### FileManager

#### New Features

- `#144270` - Added support to use the JWT tokens with `beforeSend` event’s Ajax settings.

## 17.1.42 (2019-04-23)

### FileManager

#### New Features

- Added filesystem provider support for ASP.NET MVC 4 and 5 frameworks.

## 17.1.40 (2019-04-09)

### FileManager

#### Breaking Changes

- The `beforeFileLoad` event’s `module` argument values have been changed as follows:

|Argument Name|Old Value|New Value|
|----|----|----|
|module|navigationpane|NavigationPane|
|module|Grid|DetailsView|
|module|LargeIcon|LargeIconView|

## 17.1.32-beta (2019-03-13)

### FileManager

The `FileManager` is a graphical user interface component used to manage the file system. It enables the user to perform common file operations such as accessing, editing, uploading, downloading, and sorting files and folders. This component also allows easy navigation for browsing or selecting a file or folder from the file system.

- **Different Views** - Provides detailed and large icon views.
- **Context menu support** - Provides detailed and large icon views.
- **Custom toolbar support** - Customize the toolbar to provide only necessary features.
- **Multiple file selection** - Select multiple files simultaneously.
- **Accessibility** - Features built-in accessibility support that makes all features accessible through keyboard interaction, screen readers, or other assistive technology devices.
- **Localization** - Translate file names to any supported language.
