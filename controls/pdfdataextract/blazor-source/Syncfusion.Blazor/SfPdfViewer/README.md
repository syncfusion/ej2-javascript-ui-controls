# Syncfusion&reg; Blazor SfPdfViewer Component

This package contains the [Blazor PDF Viewer (NextGen) Component](https://www.syncfusion.com/pdf-viewer-sdk/blazor-pdf-viewer?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) for Blazor applications. The new Blazor PDF Viewer (NextGen) component allows users to view, edit, print, and download PDF files without the web service dependency in Blazor applications. It is designed to be fast and responsive, and comes with the same feature set as the [previous PDF Viewer](https://www.nuget.org/packages/Syncfusion.Blazor.PdfViewerServer.Windows). It is easy to use and can be integrated into both Blazor Server and WASM applications with minimal effort.

![Blazor SfPdfViewer](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-pdf-viewer.png)

## Key features

* **View PDF Document** - Open and display both the normal and the protected PDF files with AES and RC4 encryption.
* **Annotations** - Annotate with text markup, shapes, stamps, ink, and sticky notes.
* **Form Fields** - Form filling and form designing can be done.
* **Signature** - Hand-written and digital signatures are allowed.
* **Toolbar** - Built-in-toolbar and custom toolbars to perform user interaction of PDF Viewer functionalities.
* **Navigation** - Easy navigation with the help of bookmarks, thumbnails, hyperlinks, and table of contents.
* **Magnification** - Fit to page, fit to width, and automatic (fits to the visible area).
* **Search** - Search a text easily across the PDF document.	
* **Core Interactions** - Allows scrolling, zooming, panning, selection, and page navigation.
* **Print** - Print the entire document or a specific page directly from the browser.
* **Download** - Download the complete document currently loaded in the PDF Viewer.
* **Globalization** - Provides inherent support to localize the UI.

## Add stylesheet and script references

* For **Blazor Web App / Blazor Server App**, add these to `Components/App.razor` or `App.razor` file.
* For **Blazor WebAssembly App**, add these to `wwwroot/index.html` file.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.SfPdfViewer/scripts/syncfusion-blazor-sfpdfviewer.min.js" type="text/javascript"></script>
```

## Quick start
1. Register the Syncfusion® services in the `Program.cs` file.

- **Blazor Server (Program.cs)**

```csharp
using Syncfusion.Blazor;

builder.Services.AddSignalR(o => { o.MaximumReceiveMessageSize = 102400000; });

builder.Services.AddMemoryCache();
//Add Syncfusion Blazor service to the container.
builder.Services.AddSyncfusionBlazor();
```

- **Blazor WebAssembly (Program.cs in the client project)**

```csharp
using Syncfusion.Blazor;

builder.Services.AddMemoryCache();
//Add Syncfusion Blazor service to the container
builder.Services.AddSyncfusionBlazor();
```

2. Add Blazor PdfViewer component to your Razor page.

```razor
@page "/"
@using Syncfusion.Blazor.SfPdfViewer

<SfPdfViewer2 DocumentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
              Height="100%"
              Width="100%">
</SfPdfViewer2>
```

## Documentation

* [Getting Started with Blazor SfPdfViewer in Web App](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/blazor/getting-started/web-app)
* [Getting Started with Blazor SfPdfViewer in WebAssembly App](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/blazor/getting-started/web-assembly-application)
* [Getting Started with Blazor SfPdfViewer in Server App](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/blazor/getting-started/server-side-application)

## Help resources

* [Component Overview](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/blazor/overview)
* [Documentation](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/blazor/overview)
* [Live Demos](https://document.syncfusion.com/demos/pdf-viewer/blazor-server/pdf-viewer/default-functionalities?theme=fluent)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/pdf-viewer?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget)

## Support and feedbacks

* For queries, reach our [Syncfusion&reg; support team](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) or post the queries through the [community forums](https://www.syncfusion.com/forums/pdf-viewer-sdk?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget). 
* Request new feature through [Syncfusion&reg; feedback portal](https://www.syncfusion.com/feedback/pdf-viewer-sdk?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget).

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion&reg; licensed software, including this component, is subject to the terms and conditions of [Syncfusion's EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget). You can purchase a license [here](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) or start a free 30-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget).

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [Xamarin](https://www.syncfusion.com/xamarin-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pdf-viewer-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET