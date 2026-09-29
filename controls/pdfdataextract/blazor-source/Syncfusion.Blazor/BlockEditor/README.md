# Syncfusion® Blazor BlockEditor

Modern block-based content editor for Blazor applications. Compose rich, structured documents with an intuitive drag-drop interface ideal for knowledge bases, documentation, note-taking, and content creation.

## Key Features

- **Block-Based Editing**: Intuitive block structure for organizing content
- **Rich Content Types**: Support for text, images, headings, lists, and more
- **Customizable Blocks**: Create custom block types for specific content needs
- **Mobile Support**: Responsive design optimized for mobile devices
- **Undo/Redo**: Complete undo/redo functionality for content editing
- **Export Options**: Export content as HTML, Markdown, or JSON

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

![Blazor BlockEditor](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-blockeditor.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.BlockEditor
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.BlockEditor
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

2. Add the BlockEditor component to your Razor page:

```razor
@using Syncfusion.Blazor.BlockEditor

<SfBlockEditor> </SfBlockEditor>

```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/blockeditor/getting-started-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/blockeditor/getting-started-wasm-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.BlockEditor.SfBlockEditor.html)
- [Live Demos](https://blazor.syncfusion.com/demos/block-editor/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-block-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-blockeditor-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET