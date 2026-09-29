# Syncfusion&reg; Blazor Sankey Component

The Syncfusion&reg; [Blazor Sankey Component](https://www.syncfusion.com/blazor-components/blazor-sankey?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) visualizes complex data flows and relationships within Blazor applications. Ideal for displaying energy flows, financial transfers, process flows, and networked data with an intuitive, interactive interface.

## Key Features

* **Interactive Data‑Flow Visualization** - Clearly represent complex relationships, transfers, and flow quantities between stages using proportional node‑to‑node link widths.
* **Customizable Node & Link Styling** - Personalize node appearance (size, padding, labels, alignment) and link styling (color, opacity, gradients, source/target‑based coloring) to match any UI design.
* **Orientation Flexibility** - Choose between horizontal or vertical diagram layouts to best represent your process flow or screen layout.
* **Rich Interactivity: Tooltips & Legends** - Hover over nodes or links to reveal detailed flow information using tooltips, and use legends to help users interpret categories and values.
* **Responsive & Adaptive Design** - Automatically adapts to different screen sizes and devices with optimized layouts for desktop, tablet, and mobile.
* **Smooth Animations** - Enjoy fluid, polished visual transitions when nodes or links load or update, improving user engagement and clarity.
* **Touch & Mobile Support** - Full support for touch interactions, enabling smooth panning, selection, and exploration on mobile and tablet devices.
* **Data Binding & Integration** - Bind data from local collections or remote sources (Web APIs, JSON, etc.) and easily integrate the Sankey diagram within broader Blazor dashboards.
* **Export & Printing Options** - Export diagrams to PNG, JPEG, SVG, or PDF formats for reporting, sharing, or print outputs.
* **Themes & Accessibility** - Supports Material, Bootstrap, Fluent, Tailwind, and Fabric themes, along with ARIA accessibility, screen‑reader compatibility, keyboard navigation, and RTL layout support.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Sankey
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Sankey
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

2. Add the Blazor Sankey component in a Razor page:

```razor
<SfSankey Nodes=@Nodes Links=@Links>

</SfSankey>

@code {
    public List<SankeyDataNode> Nodes = new List<SankeyDataNode>();
    public List<SankeyDataLink> Links = new List<SankeyDataLink>();

    protected override void OnInitialized()
    {
        Nodes = new List<SankeyDataNode>()
        {
            new SankeyDataNode() { Id = "Coffee Production" },
            new SankeyDataNode() { Id = "Arabica" },
            new SankeyDataNode() { Id = "Robusta" },
            new SankeyDataNode() { Id = "Roasted Coffee" },
            new SankeyDataNode() { Id = "Instant Coffee" },
            new SankeyDataNode() { Id = "Green Coffee" },
            new SankeyDataNode() { Id = "North America" },
            new SankeyDataNode() { Id = "Europe" },
            new SankeyDataNode() { Id = "Asia Pacific" },
        };
        Links = new List<SankeyDataLink>()
        {
            new SankeyDataLink() { SourceId = "Coffee Production", TargetId = "Arabica", Value = 95 },
            new SankeyDataLink() { SourceId = "Coffee Production", TargetId = "Robusta", Value = 65 },
            new SankeyDataLink() { SourceId = "Arabica", TargetId = "Roasted Coffee", Value = 60 },
            new SankeyDataLink() { SourceId = "Arabica", TargetId = "Instant Coffee", Value = 20 },
            new SankeyDataLink() { SourceId = "Arabica", TargetId = "Green Coffee", Value = 15 },
            new SankeyDataLink() { SourceId = "Robusta", TargetId = "Roasted Coffee", Value = 30 },
            new SankeyDataLink() { SourceId = "Robusta", TargetId = "Instant Coffee", Value = 25 },
            new SankeyDataLink() { SourceId = "Robusta", TargetId = "Green Coffee", Value = 10 },
            new SankeyDataLink() { SourceId = "Roasted Coffee", TargetId = "North America", Value = 35 },
            new SankeyDataLink() { SourceId = "Roasted Coffee", TargetId = "Europe", Value = 30 },
            new SankeyDataLink() { SourceId = "Roasted Coffee", TargetId = "Asia Pacific", Value = 25 },
            new SankeyDataLink() { SourceId = "Instant Coffee", TargetId = "North America", Value = 15 },
            new SankeyDataLink() { SourceId = "Instant Coffee", TargetId = "Europe", Value = 15 },
            new SankeyDataLink() { SourceId = "Instant Coffee", TargetId = "Asia Pacific", Value = 15 },
            new SankeyDataLink() { SourceId = "Green Coffee", TargetId = "North America", Value = 10 },
            new SankeyDataLink() { SourceId = "Green Coffee", TargetId = "Europe", Value = 8 },
            new SankeyDataLink() { SourceId = "Green Coffee", TargetId = "Asia Pacific", Value = 7 },
        };
        base.OnInitialized();
    }
}
```

## Documentation

* [Getting Started with Blazor Sankey in Web App](https://blazor.syncfusion.com/documentation/sankey/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Getting Started with Blazor Sankey in WASM App](https://blazor.syncfusion.com/documentation/sankey/getting-started-wasm?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-sankey?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/sankey/default?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Sankey.html)

## Support

* [Support Portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget).

* [Purchase License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sankey-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET