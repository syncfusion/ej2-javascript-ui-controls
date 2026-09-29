# Syncfusion® Blazor Maps

Interactive map visualization component for Blazor applications. Render maps from GeoJSON data or map providers like OpenStreetMap, Google Maps, and Bing Maps with rich features.

![Blazor Map](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-map.png)

## Key Features

- **Multiple Map Providers**: Support for OpenStreetMap, Google Maps, Bing Maps, and custom GeoJSON data
- **Interactive Markers**: Add, customize, and interact with markers on the map
- **Bubble and Label Layers**: Visualize data with bubbles and text labels
- **Navigation Lines**: Draw routes and paths between locations
- **Legends and Tooltips**: Display information and legends for map data
- **Zooming and Panning**: Intuitive navigation with mouse wheel and touch gestures
- **Drill Down**: Interactive drill-down capabilities for regional data visualization
- **Layer Management**: Multiple layers with easy toggle and customization
- **Export**: Export maps as images (PNG, SVG, PDF)

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Maps
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Maps
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

2. Add the Maps component to your Razor page:

```razor
@using Syncfusion.Blazor.Maps

<SfMaps>
    <MapsLayers>
        <MapsLayer UrlTemplate="https://tile.openstreetmap.org/level/tileX/tileY.png">
            <MapsMarkerSettings>
                <MapsMarker Visible="true" Height="25" Width="15" DataSource="@MarkerData">
                </MapsMarker>
            </MapsMarkerSettings>
        </MapsLayer>
    </MapsLayers>
</SfMaps>

@code {
    public class MarkerData
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public List<MarkerData> MarkerData { get; set; } = new List<MarkerData>
    {
        new MarkerData { Latitude = 37.6872, Longitude = -122.3021 },
        new MarkerData { Latitude = 37.7749, Longitude = -122.4194 },
        new MarkerData { Latitude = 34.0522, Longitude = -118.2437 }
    };
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/maps/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/maps/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Maps.SfMaps.html)
- [Live Demos](https://blazor.syncfusion.com/demos/maps/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-map?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-maps-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET