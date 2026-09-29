# Syncfusion® Blazor Card

The Syncfusion® [Blazor Card Component](https://www.syncfusion.com/blazor-components/blazor-card?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) is a container-based UI control for displaying organized content with structured layouts. Perfect for social media feeds, e-commerce galleries, dashboards, and other content-rich applications.

## Key Features

* **Flexible Container Layout** – Separate areas for header, content, image, and footer
* **Rich Header Support** – Title, subtitle, and optional image positioning
* **Template Support** – HTML, child content, and custom templates
* **Action Footer** – Built-in footer area for buttons and actions
* **Multiple Layouts** – Stacked, media, and action card variations
* **Theme Support** – Bootstrap, Material, Fabric, and custom themes
* **Responsive Design** – Adapts seamlessly to all screen sizes

## System requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly and Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

![Blazor Card](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-card.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Cards
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Cards
```

## Add stylesheet and script references

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

2. Add the Card component in a Razor page:

```razor
<SfCard>
	<CardHeader Title="Card title" SubTitle="Card subtitle" />
	<CardContent Content="This is the card body content." />
	<CardFooter>
		<button class="btn btn-primary">Action</button>
	</CardFooter>
</SfCard>
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/card/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/card/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Cards.SfCard.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/card/basic-card?theme=fluent2?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

## Support

- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [Support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

## License

This is a commercial product and requires a paid license for possession or use. See the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/pricing?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)
- [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-cards-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET