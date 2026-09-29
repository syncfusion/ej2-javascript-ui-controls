# Syncfusion® Blazor Barcode Generator

Generate industry-standard 1D and 2D barcodes in Blazor applications. Lightweight, print and scan optimized component for Blazor Web App, Blazor Server, and Blazor WebAssembly.

## Key Features

* **1D & 2D Barcode Formats** – Code39, Code128, EAN, QR Code, DataMatrix, and more
* **Print & Scan Optimized** – High-quality output for reliable scanning and printing
* **Customizable Display** – Configure size, rotation, margins, and text options
* **Image Export** – Export barcodes as images for download or printing
* **Multiple Input Types** – Support for text, numbers, and encoded data
* **Theme Support** – Bootstrap, Material, Fabric, and custom themes
* **Responsive Design** – Adapts seamlessly to different screen sizes

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

![Blazor Barcode](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-barcode.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.BarcodeGenerator
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.BarcodeGenerator
```

## Add Stylesheet and Script References

* For **Blazor Web App / Blazor Server App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**, add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Barcode component in a Razor page:

```razor
@using Syncfusion.Blazor.BarcodeGenerator

<SfBarcode Value="0123456789"></SfBarcode>
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/barcode/getting-started-with-web-app)
- [Getting Started with WebAssembly App](https://blazor.syncfusion.com/documentation/barcode/getting-started)
- [API reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.BarcodeGenerator.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)
- [Feature overview](https://www.syncfusion.com/blazor-components/blazor-barcode?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)
- [Live demos](https://blazor.syncfusion.com/demos/barcodes/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

## Support

- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)
- [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/).

- [Purchase a license](https://www.syncfusion.com/sales/pricing)
- [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-barcode-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
