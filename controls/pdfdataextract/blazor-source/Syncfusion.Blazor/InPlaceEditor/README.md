# Syncfusion&reg; Blazor In-place Editor Component

The [Blazor In-place Editor Component](https://www.syncfusion.com/blazor-components/blazor-in-place-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) enables inline or popup editing of values directly within the page context. It supports multiple input types and integrates seamlessly with Blazor Server and Blazor WebAssembly applications.

## Key Features

- **Multiple Input Types**: Built-in support for TextBox, Dropdown List, DatePicker, Rich Text Editor etc..
- **Dual Edit Modes**: Inline editing or popup mode
- **Customizable UI**: Flexible styling and template support
- **Event Handling**: Comprehensive event APIs for integration workflows
- **Two-way Binding**: Seamless Blazor component integration
- **Keyboard Support**: Full keyboard navigation and accessibility

## System Requirements

- .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget).

![Blazor In-place Editor](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-in-place-editor.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.InPlaceEditor
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.InPlaceEditor
```

## Add Stylesheet and Script References

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the In-place Editor component in a Razor page:

```razor
@using Syncfusion.Blazor.InPlaceEditor

<SfInPlaceEditor @bind-Value="@EditorValue" Mode="RenderMode.Inline" />

@code {
    public string EditorValue { get; set; } = "Click to edit";
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/in-place-editor/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/in-place-editor/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.InPlaceEditor.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/in-place-editor/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-in-place-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

## Support

- [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion&reg; licensed software is subject to the terms and conditions of the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget).

- [Purchase a License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)
- [Start a free 30-Day Trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-inplaceeditor-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET