# Syncfusion® Blazor Popup Components

A comprehensive suite of Blazor popup components for displaying modal and modeless dialogs, tooltips, and other overlay content. Includes Dialog and Tooltip components.

## Supported Components

This package includes the following components:

* [Blazor Dialog](https://www.syncfusion.com/blazor-components/blazor-modal-dialog?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Blazor Tooltip](https://www.syncfusion.com/blazor-components/blazor-tooltip?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

## Blazor Dialog Component

The [Blazor Dialog Component](https://www.syncfusion.com/blazor-components/blazor-modal-dialog?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) is a useful user interface for informing users about critical information, errors, warnings, and questions, as well as confirming decisions and collecting input.

**Key Features:**

* **Modal and Modeless**: Support for both modal dialogs (blocks interaction) and modeless dialogs (non-blocking)
* **Action Buttons**: Built-in OK, Cancel, and custom action buttons
* **Positioning**: Customizable dialog positioning on the screen
* **Dragging**: Drag dialogs to reposition them
* **Resizing**: Resize dialog windows dynamically
* **Animation**: Built-in animation effects for dialog open/close
* **Templates**: Support for header, content, and footer templates
* **Mobile Support**: Responsive dialog support for mobile devices
* **Accessibility**: Full keyboard navigation and ARIA support

![Blazor Dialog](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-dialog.png)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/dialog/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/dialog/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-modal-dialog?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/dialog/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Popups.SfDialog.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

## Blazor Tooltip Component

The [Blazor Tooltip Component](https://www.syncfusion.com/blazor-components/blazor-tooltip?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) is a pop-up that shows information or messages when users hover, click, focus, or touch an element.

**Key Features:**

* **Multiple Trigger Types**: Show on hover, click, focus, or touch events
* **Rich Content**: Support for text, images, hyperlinks, and custom templates
* **Positioning**: Flexible tooltip positioning (top, bottom, left, right)
* **Animation**: Built-in animation effects for tooltip appearance
* **Responsive**: Adapts positioning for different screen sizes
* **Offset Control**: Customize tooltip offset and spacing
* **Keyboard Navigation**: Full keyboard support for accessibility
* **Custom Styling**: CSS and theme customization options

![Blazor Tooltip](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-tooltip.png)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/tooltip/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/tooltip/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-tooltip?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/tooltip/default?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Popups.SfTooltip.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget).

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Popups
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Popups
```

## Add stylesheet and script references

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

### Dialog

```razor
<SfDialog Width="250px">
    <DialogTemplates>
        <Content> This is a Dialog with content </Content>
    </DialogTemplates>
</SfDialog>
```

### Tooltip

```razor
@using Syncfusion.Blazor.Popups
@using Syncfusion.Blazor.Buttons

<SfTooltip ID="Tooltip" Target="#btn" Content="@Content">
    <SfButton ID="btn" Content="Show Tooltip"></SfButton>
</SfTooltip>

@code
{
    string Content = "Lets go green & Save Earth !!";
}
```

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)
* [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-popups-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
