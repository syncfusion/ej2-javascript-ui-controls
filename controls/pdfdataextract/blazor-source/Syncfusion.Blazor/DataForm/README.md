# Syncfusion® Blazor Data Form

Dynamic form component for Blazor applications with flexible layout, data binding, validation, and conditional logic for building interactive forms.

## Key features

- Dynamic form generation with flexible layouts
- Data binding and validation support
- Multiple input types and field configurations
- Conditional field visibility and logic
- Blazor Server and Blazor WebAssembly support (.NET 8+)

## System requirements

- .NET 8 or later
- Supported on Blazor Server and Blazor WebAssembly
- Full system requirements: https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing

## Install

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.DataForm
```

### NuGet (Visual Studio)

Search for `Syncfusion.Blazor.DataForm` in the NuGet Package Manager and install.

## Add stylesheet and script references

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`. For **Blazor WebAssembly**, add these to `wwwroot/index.html`:

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick start

1. Register the Syncfusion® Blazor service in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the DataForm component to your Razor page:

```razor
@using Syncfusion.Blazor.DataForm

<SfDataForm Model="Employee" />

@code {
    public class Employee
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
```

## Documentation

- [Getting started with Blazor Web App](https://blazor.syncfusion.com/documentation/data-form/getting-started-with-web-app?utm_source=nuget&utm_medium=listing)
- [Getting started with Blazor WebAssembly](https://blazor.syncfusion.com/documentation/data-form/getting-started?utm_source=nuget&utm_medium=listing)
- [API reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.DataForm.SfDataForm.html)
- [Live demos](https://blazor.syncfusion.com/demos/data-form/default-functionalities?utm_source=nuget&utm_medium=listing)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing)

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion® licensed software, including this component, is subject to the terms and conditions of [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
