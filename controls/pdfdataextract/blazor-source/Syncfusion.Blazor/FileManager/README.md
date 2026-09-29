# Syncfusion® Blazor File Manager

Powerful file system explorer component for Blazor applications. Manage files and folders with drag-drop, multi-selection, upload, download, and intuitive context menus all built-in.

![Blazor File Manager](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-filemanager.png)

## Key Features

- **File Operations**: Create, rename, delete, copy, move, and download files and folders
- **Drag and Drop**: Drag files/folders to reorder or move between locations
- **Multi-Selection**: Select multiple files at once with checkbox or Ctrl+Click
- **File Upload**: Built-in upload functionality with progress tracking
- **Context Menu**: Right-click menus for quick file operations
- **Search**: Search files and folders with real-time filtering
- **Breadcrumb Navigation**: Easy navigation with breadcrumb trail
- **Sorting and Filtering**: Sort by name, date, size; filter by file type
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.FileManager
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.FileManager
```

## Add Stylesheet and Script References

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`. For **Blazor WebAssembly**, add these to `wwwroot/index.html`:

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor service in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the File Manager component to your Razor page:

```razor
@using Syncfusion.Blazor.FileManager

<SfFileManager TValue="FileManagerDirectoryContent">
    <FileManagerAjaxSettings Url="https://ej2services.syncfusion.com/production/web-services/api/FileManager/FileOperations"
                             DownloadUrl="https://ej2services.syncfusion.com/production/web-services/api/FileManager/Download"
                             UploadUrl="https://ej2services.syncfusion.com/production/web-services/api/FileManager/Upload"
                             GetImageUrl="https://ej2services.syncfusion.com/production/web-services/api/FileManager/GetImage">
    </FileManagerAjaxSettings>
</SfFileManager>
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/file-manager/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/file-manager/getting-started-with-wasm-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.FileManager.SfFileManager-1.html)
- [Live Demos](https://blazor.syncfusion.com/demos/file-manager/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-file-manager?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-filemanager-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET