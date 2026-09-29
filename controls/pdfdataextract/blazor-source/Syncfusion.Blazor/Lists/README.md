# Syncfusion® Blazor ListView Component

A powerful [Blazor ListView component](https://www.syncfusion.com/blazor-components/blazor-listview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) for displaying data in a list-like interface with selection, hierarchical structure support, and interactive layouts. Supports multiple selection modes, virtual scrolling, templates, data binding, and more. Part of Syncfusion® UI component library for .NET 8+.

## Key Features

* **Multiple Selection**: Single and multi-select modes with checkbox support
* **Hierarchical Data**: Display nested data structures with parent-child relationships
* **Data Binding**: Support for arrays and remote data sources
* **Virtual Scrolling**: Efficient rendering for large datasets
* **Custom Templates**: Full template support for item customization
* **Interactive Layouts**: Multiple view layouts and grouping options
* **Keyboard Navigation**: Full keyboard accessibility support
* **Responsive Design**: Adapts to different screen sizes and devices

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly, and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Lists
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Lists
```

## Add stylesheet and script references

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Blazor ListView component to your Razor page:

```razor
@using Syncfusion.Blazor.Lists

<SfListView DataSource="@ListData">
    <ListViewFieldSettings TValue="ListItem" Id="Id" Text="Text"></ListViewFieldSettings>
</SfListView>

@code {
    private List<ListItem> ListData = new()
    {
        new ListItem { Id = "1", Text = "Item 1" },
        new ListItem { Id = "2", Text = "Item 2" },
        new ListItem { Id = "3", Text = "Item 3" }
    };

    public class ListItem
    {
        public string Id { get; set; }
        public string Text { get; set; }
    }
}
```

![Blazor ListView](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-listview.png)

## Blazor ListView Component

The [Blazor ListView Component](https://www.syncfusion.com/blazor-components/blazor-listview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) is a list-like interface that allows users to select one or multiple items and represents data in an interactive hierarchical structure across different layouts or views.

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/listview/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/listview/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-listview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/listview/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/listview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Lists.SfListView-1.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

## Support and Feedback

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)
* [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lists-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
