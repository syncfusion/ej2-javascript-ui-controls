# Changelog

## [Unreleased]

## 17.1.43 (2019-04-30)

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
