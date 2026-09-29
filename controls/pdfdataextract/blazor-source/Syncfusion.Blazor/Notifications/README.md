# Syncfusion® Blazor Notification Components

A comprehensive suite of Blazor notification and placeholder components for displaying messages, toasts, and loading states. Includes Toast, Message, and Skeleton components.

## Supported Components

This package includes the following components:

* [Blazor Toast](https://www.syncfusion.com/blazor-components/blazor-toast?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Blazor Message](https://www.syncfusion.com/blazor-components/blazor-message?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Blazor Skeleton](https://www.syncfusion.com/blazor-components/blazor-skeleton?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## Blazor Toast Component

The [Blazor Toast Component](https://www.syncfusion.com/blazor-components/blazor-toast?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) is a small, nonblocking notification pop-up that displays messages to users with readable content.

**Key Features:**

* **Auto Dismissal**: Messages disappear automatically after a configurable timeout period
* **Positioning**: Display toasts at customizable positions (top, bottom, corners)
* **Animation Effects**: Built-in animation effects for toast appearance and disappearance
* **Multiple Toasts**: Display multiple toast notifications simultaneously
* **Custom Icons**: Support for custom icons and visual indicators
* **Templates**: Rich templates for custom toast content rendering
* **Keyboard Navigation**: Full keyboard support for accessibility
* **Action Buttons**: Include action buttons within toast notifications

![Blazor Toast](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-toast.png)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/toast/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/toast/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-toast?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/toast/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Notifications.SfToast.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## Blazor Message Component

The [Blazor Message Component](https://www.syncfusion.com/blazor-components/blazor-message?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) is a graphical UI for displaying messages with visual severity levels and contextual information.

**Key Features:**

* **Severity Levels**: Display messages with different severity types (success, error, warning, info)
* **Visual Icons**: Built-in icons for different severity levels
* **Closeable Messages**: Allow users to dismiss messages
* **Message Variants**: Support for different visual variants and styles
* **Custom Templates**: Rich templates for custom message content
* **Data Binding**: Bind to collections for dynamic message display
* **Responsive Design**: Adapt to different screen sizes
* **Accessibility**: Full keyboard navigation and ARIA support

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/message/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/message/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-message?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/message/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Notifications.SfMessage.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## Blazor Skeleton Component

The [Blazor Skeleton Component](https://www.syncfusion.com/blazor-components/blazor-skeleton?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) is a placeholder that animates a shimmer effect to indicate content is loading.

**Key Features:**

* **Shimmer Effect**: Animated loading state with shimmer animation
* **Multiple Shapes**: Support for various skeleton shapes (circle, rectangle, text)
* **Custom Count**: Render multiple skeleton placeholders
* **Responsive Layout**: Adapt to different screen sizes
* **Performance**: Lightweight placeholder for faster page loads
* **Custom Styling**: Customize appearance with CSS and themes
* **Template Support**: Create custom skeleton layouts
* **Accessibility**: Semantic HTML with proper ARIA labels

![Blazor Skeleton](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-skeleton.gif)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/skeleton/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/skeleton/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-skeleton?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/skeleton/defaultfunctionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Notifications.SfSkeleton.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget).

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Notifications
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Notifications
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

### Message

```razor
<SfMessage>Please read the comments carefully</SfMessage>
<style>
    .e-message {
        width: 300px;
    }
</style>
```

### Skeleton

```razor
<SfSkeleton Height="15px" Width="200px"></SfSkeleton><br/>
<SfSkeleton Height="15px" Width="100px"></SfSkeleton>
```

### Toast

```razor
<div class="col-lg-12 control-section toast-default-section">
    <SfToast ID="toast_default" @ref="ToastObj" Title="Adaptive Tiles Meeting" Content="@ToastContent" Timeout="5000" Icon="e-meeting">
        <ToastPosition X="@ToastPosition"></ToastPosition>
    </SfToast>
    <div class="col-lg-12 col-sm-12 col-md-12 center">
        <div id="toastBtnDefault" style="margin: auto; text-align: center">
            <button class="e-btn" @onclick="@ShowOnClick">Show Toasts</button>
            <button class="e-btn" @onclick="@HideOnClick">Hide All</button>
        </div>
    </div>
</div>

<style>
    #toast_default .e-meeting::before {
        content: "\e705";
        font-size: 17px;
    }

    .bootstrap4 #toast_default .e-meeting::before {
        content: "\e763";
        font-size: 20px;
    }
</style>

@code {
    private SfToast ToastObj;
    private string ToastPosition = "Right";
    private string ToastContent = "Conference Room 01 / Building 135 10:00 AM-10:30 AM";

    private async Task ShowOnClick()
    {
        await ToastObj.ShowAsync();
    }

    private async Task HideOnClick()
    {
        await ToastObj.HideAsync("All");
    }
}
```

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)
* [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-notifications-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
