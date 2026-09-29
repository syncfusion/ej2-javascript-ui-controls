# Syncfusion&reg; Blazor ProgressBar Component

The Syncfusion&reg; [Blazor ProgressBar Component](https://www.syncfusion.com/blazor-components/blazor-progressbar?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) indicates task progress with customizable visuals. It supports linear and circular progress modes, segments, ranges with custom colors, and animation for enhanced user feedback in Blazor applications.

## Key Features

* **Multiple Progress Types** - Display progress in linear, circular, and semi‑circular shapes, providing flexible visualization options that suit various UI layouts.
* **Determinate, Indeterminate & Buffer States** - Show known progress, unknown (indeterminate) progress, or dual‑layer buffer progress for scenarios where primary progress depends on secondary operations.
* **Segmented Progress** - Divide the bar into multiple segments using a single API—ideal for representing multi‑step processes or sequential task progress.
* **Custom Ranges & Multi‑Color Visualization** - Highlight specific ranges using solid or gradient colors to visually communicate thresholds, milestones, or status levels.
* **Smooth Animation Effects** - Enable animated transitions for progress updates, with adjustable animation behavior for an engaging user experience.
* **Track & Indicator Customization** - Adjust thickness, corner radius, and apply custom colors to both the track and progress indicator for complete styling control.
* **Labels & Custom Text Content** - Display percentage values or insert fully custom content—such as images, icons, or descriptive text—inside linear or circular progress bars.
* **Striped & Active Styles** - Apply striped visual styles or active animations for more dynamic visual feedback.
* **Responsive & Mobile‑Friendly** - Automatically adapts to various screen sizes with consistent rendering across desktops, tablets, and mobile devices.
* **Accessibility & ARIA Support** - Keyboard navigation, screen‑reader compatibility, and WAI‑ARIA compliance ensure an inclusive experience for all users.
* **Blazor Server & WebAssembly Support** - Fully supported in both Blazor Server and WASM applications.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

![Blazor ProgressBar](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-progress-bar.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.ProgressBar
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.ProgressBar
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

2. Add the ProgressBar component in a Razor page:

```razor
<SfProgressBar Value="50" Minimum="0" Maximum="100" TrackThickness="12" ProgressThickness="12">
</SfProgressBar>
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/progress-bar/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/progress-bar/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.ProgressBar.html)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-progressbar?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/progress-bar/linear?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

## Support

* [Support Portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget). 

* [Purchase a License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

* **Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

* **Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

* **Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-progress-bar-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET