# Syncfusion&reg; Blazor Ribbon Component

The Syncfusion&reg; [Blazor Ribbon Component](https://www.syncfusion.com/blazor-components/blazor-ribbon?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) provides a Microsoft Office-style ribbon interface for organizing and presenting application commands. It delivers a structured, intuitive UI with customizable tabs, groups, and buttons for improved user experience and efficient command access in Blazor applications.

## Key Features

* **Customizable Tabs and Groups** – Organize commands into logical tabs and groups
* **Rich Button Types** – Regular buttons, split buttons, and dropdown menus
* **Icons and Labels** – Support for icons and custom labels on ribbon items
* **Responsive Design** – Adapts to different screen sizes and orientations
* **Keyboard Navigation** – Full keyboard support for accessibility
* **Template Support** – Custom templates for ribbon items and content
* **Command Binding** – Easy binding to application commands and events

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

![Blazor Ribbon](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-ribbon.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Ribbon
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Ribbon
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

2. Add the Ribbon component in a Razor page:

```razor
<SfRibbon>
    <RibbonTabs>
        <RibbonTab HeaderText="Home"></RibbonTab>
    </RibbonTabs>
</SfRibbon>
```

### Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/ribbon/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/ribbon/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Ribbon.html)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-ribbon?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/ribbon/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

## Support

* [Support Portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [Community Forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget). 

* [Purchase a License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

* **Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

* **Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

* **Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ribbon-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET