# Syncfusion® Blazor Diagram

Fast and powerful diagram visualization and creation library for Blazor applications. Create flowcharts, organizational charts, mind maps, UML diagrams, and more with interactive canvas and extensive customization.

![Blazor Diagram](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-diagram.png)

## Key Features

- **Diagram Types**: Flowcharts, organizational charts, mind maps, UML diagrams, network diagrams
- **Rich Shapes**: Built-in and custom shapes with templates
- **Connectors**: Multiple connector types (straight, orthogonal, bezier) with customizable endpoints
- **Editing**: Drag, resize, rotate, and delete objects seamlessly
- **Layout Algorithms**: Automatic arrangement (hierarchical, radial, organizational)
- **Serialization**: Save and load diagrams in JSON format
- **Export**: Export diagrams as image (PNG, SVG, PDF)
- **Interactive Features**: Zoom, pan, selection, undo/redo, properties panel
- **Mobile Support**: Touch-friendly interactions and responsive design

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Diagram
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Diagram
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

2. Add the Diagram component to your Razor page:

```razor
@using Syncfusion.Blazor.Diagram

<SfDiagramComponent Height="600px" Nodes="@NodeCollection" Connectors="@ConnectorCollection">
</SfDiagramComponent>

@code {
    
    public DiagramObjectCollection<Node> NodeCollection = new DiagramObjectCollection<Node>();

    public DiagramObjectCollection<Connector> ConnectorCollection = new DiagramObjectCollection<Connector>();

    protected override void OnInitialized()
    {
        // Create nodes
        Node node1 = new Node() { Id = "node1", OffsetX = 250, OffsetY = 50, Width = 100, Height = 100, Shape = new FlowShape() { Type = FlowShapeType.Process }, Annotations = new DiagramObjectCollection<ShapeAnnotation>() { new ShapeAnnotation { Content = "Start" } } };
        Node node2 = new Node() { Id = "node2", OffsetX = 250, OffsetY = 250, Width = 100, Height = 100, Shape = new FlowShape() { Type = FlowShapeType.Decision }, Annotations = new DiagramObjectCollection<ShapeAnnotation>() { new ShapeAnnotation { Content = "Decision" } } };

        NodeCollection.Add(node1);
        NodeCollection.Add(node2);

        // Create connector
        Connector connector = new Connector() { SourceID = "node1", TargetID = "node2", Type = ConnectorSegmentType.Orthogonal };
        ConnectorCollection.Add(connector);
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/diagram/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/diagram-component/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Diagram.SfDiagramComponent.html)
- [Live Demos](https://blazor.syncfusion.com/demos/diagramcomponent/flowchart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-diagram?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-diagram-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET