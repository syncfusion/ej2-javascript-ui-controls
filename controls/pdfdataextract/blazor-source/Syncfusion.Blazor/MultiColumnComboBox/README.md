# Syncfusion&reg; Blazor MultiColumn ComboBox Component

The Syncfusion&reg; [Blazor MultiColumn ComboBox Component](https://www.syncfusion.com/blazor-components/blazor-multicolumn-combobox?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) enables users to select values from a dropdown list displaying multiple columns of related data. It combines the functionality of a dropdown with tabular data presentation for compact, attribute-rich selections.

## Key Features

* **Multiple Column Display** – Present data across multiple columns within the dropdown
* **Data Binding** – Support for local, remote, and dynamic data binding
* **Filtering** – Built-in filtering with single and multi-column search capabilities
* **Virtualization** – Optimized rendering for large datasets
* **Column Templates** – Customize column content with data templates
* **Keyboard Navigation** – Full keyboard support for accessibility
* **Custom Templates** – Flexible item and header templates for custom layouts
* **Cascading** – Dependent dropdown functionality for related selections

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.MultiColumnComboBox
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.MultiColumnComboBox
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

2. Add the Multicolumn ComboBox component in a Razor page:

```razor
<SfMultiColumnComboBox TItem="string" TValue="string" Placeholder="Select any product"></SfMultiColumnComboBox>
```

### Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/multicolumn-combobox/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/multicolumn-combobox/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.DropDowns.SfMultiColumnComboBox.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-multicolumn-combobox?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/multicolumn-combobox/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

## Support

* [Syncfusion Support Portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget). 

* [Purchase a License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

* **Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

* **Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

* **Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-multicolumn-combobox-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET