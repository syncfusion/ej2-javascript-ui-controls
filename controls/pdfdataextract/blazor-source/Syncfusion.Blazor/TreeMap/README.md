# Syncfusion&reg; Blazor TreeMap Component

The Syncfusion&reg; [Blazor TreeMap Component](https://www.syncfusion.com/blazor-components/blazor-treemap?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) visualizes hierarchical and flat data using nested rectangles with customizable colors, labels, and legends. Perfect for displaying complex data structures and hierarchies in modern Blazor applications.

## Key Features

* **Hierarchical & Flat Data Visualization** - Visualize hierarchical or flat datasets using nested, size‑proportional rectangles, enabling clear insight into relationships and distribution.
* **Advanced Color Mapping Options** - Apply range‑based, equal‑value, or desaturation color mapping to quickly distinguish values or categories.
* **Rich Labeling & Templates** - Display labels with trimming, wrapping, or hiding options, or use full HTML templates to provide richly styled node labels.
* **Legends & Interactive Tooltips** - Use default or interactive legends to interpret categories and ranges, and enable tooltips to reveal detailed node information on hover.
* **Drill‑Down Navigation** - Explore data hierarchies more deeply by drilling into parent nodes to reveal child content interactively.
* **Multiple Layout Algorithms** - Choose from several layout modes, including Squarified, Horizontal Slice‑and‑Dice, Vertical Slice‑and‑Dice, and Auto layouts to best represent your data.
* **Interactive Selection & Highlighting** - Highlight or select specific nodes on hover or click to focus user attention on key items.
* **Responsive & Mobile‑Friendly Design** - Automatically adapts to all screen sizes with optimized rendering across desktops, tablets, and mobile devices.
* **Export & Print Support** - Export TreeMaps as PNG, JPEG, or SVG, or print them directly for reporting and presentations.
* **Accessibility & RTL Support** - Includes ARIA accessibility, keyboard navigation, screen‑reader compatibility, and full right‑to‑left layout support.

## Supported Platforms

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

![Blazor TreeMap](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-treemap.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.TreeMap
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.TreeMap
```

## Add Script References

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Blazor TreeMap component in a Razor page:

```razor
<SfTreeMap DataSource="GrowthReport"
            WeightValuePath="GDP"
            TValue="Country">
    <TreeMapLeafItemSettings LabelPath="Name" Fill="lightgray"></TreeMapLeafItemSettings>
</SfTreeMap>

@code {
    public class Country
    {
        public string Name { get; set; }
        public double GDP { get; set; }
    }
    public List<Country> GrowthReport = new List<Country> {
        new Country  {Name="United States", GDP=17946 },
        new Country  {Name="China", GDP=10866 },
        new Country  {Name="Japan", GDP=4123 },
        new Country  {Name="Germany", GDP=3355 }
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/treemap/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Getting Started with Blazor WASM App](https://blazor.syncfusion.com/documentation/treemap/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-treemap?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/treemap/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.TreeMap.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget).

* [Purchase License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-treemap-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET