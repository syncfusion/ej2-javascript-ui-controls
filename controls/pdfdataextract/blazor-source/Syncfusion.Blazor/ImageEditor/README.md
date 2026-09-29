# Syncfusion® Blazor ImageEditor

Full-featured image editing component for Blazor applications. Crop, rotate, flip, straighten, apply filters, frames, image redaction and annotate images with shapes and freehand drawings with an intuitive user interface.

![Blazor ImageEditor](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-image-editor.png)

## Key Features

- Image cropping, rotating, flipping, and straightening
- Zooming and panning with mouse wheel support
- Built-in filters (blur, brightness, saturation, hue, etc.)
- Annotation tools (rectangles, ellipses, lines, arrow, path, text and image)
- Freehand drawing and brush customization
- Predefined frames (mat, bevel, line, hook and inset)
- Image resize (both aspect and non-aspect ratios)
- Image redaction (blur and pixelate redactions)
- Undo and redo functionality
- File restriction (file extension and file size)
- Export images to multiple formats
- Touch gesture support for both mobile and desktop devices
- Keyboard shortcuts and accessibility support

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.ImageEditor
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.ImageEditor
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

2. Add the ImageEditor component to your Razor page:

```razor
@using Syncfusion.Blazor.ImageEditor 

<SfImageEditor @ref="ImageEditor" Toolbar="customToolbarItem" Height="400">
    <ImageEditorEvents Created="OpenAsync"></ImageEditorEvents>
</SfImageEditor> 

@code { 
    SfImageEditor ImageEditor; 
    private List<ImageEditorToolbarItemModel> customToolbarItem = new List<ImageEditorToolbarItemModel>() { }; 

    private async void OpenAsync() 
    { 
        // Load default image
        await ImageEditor.OpenAsync("sample.jpg"); 
    } 
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/image-editor/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/image-editor/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.ImageEditor.SfImageEditor.html)
- [Live Demos](https://blazor.syncfusion.com/demos/image-editor/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-image-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-image-editor-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
