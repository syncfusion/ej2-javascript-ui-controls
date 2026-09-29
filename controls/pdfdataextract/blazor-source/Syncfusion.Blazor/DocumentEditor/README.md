# Syncfusion&reg; Blazor Word Processor Component

This package contains the [Blazor Word Processor](https://www.syncfusion.com/blazor-components/blazor-word-processor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) for Blazor application. The Blazor Word Processor is a feature rich UI component with editing capabilities like Microsoft Word. Also known as the document editor, it is used to create, edit, view, and print Word documents. It provides all the common word processing features: editing text, formatting contents, resizing images and tables, finding and replacing text, bookmarks, tables of contents, printing, and importing and exporting Word documents.

![Blazor Word Processor](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-word-processor.png)

## Add stylesheet and script references

* For **Blazor Web App / Blazor Server App**, add these to `Components/App.razor` or `App.razor` file.
* For **Blazor WebAssembly App**, add these to `wwwroot/index.html` file.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.WordProcessor/scripts/syncfusion-blazor-documenteditor.min.js" type="text/javascript"></script>
</head>
```

## Quick start
1. Register the Syncfusion® services in the `Program.cs` file.

- **Blazor Server (Program.cs)**

```csharp
using Syncfusion.Blazor;

builder.Services.AddServerSideBlazor().AddHubOptions(o => { o.MaximumReceiveMessageSize = 102400000; });
// Add Syncfusion Blazor service to the container.
builder.Services.AddSyncfusionBlazor();
```

- **Blazor WebAssembly (Program.cs in the client project)**

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add Blazor Word Processor component to your Razor page.

```razor
@page "/"
@using Syncfusion.Blazor.DocumentEditor

<SfDocumentEditorContainer EnableToolbar=true></SfDocumentEditorContainer>
```

## Documentation

* [Getting Started with Blazor Word Processor in Web App](https://help.syncfusion.com/document-processing/word/word-processor/blazor/getting-started/web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)
* [Getting Started with Blazor Word Processor in Server App](https://blazor.syncfusion.com/documentation/document-editor/getting-started/server-side-application?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)
* [Getting Started with Blazor Word Processor in WebAssembly App](https://blazor.syncfusion.com/documentation/document-editor/getting-started/client-side-application?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)

## Help resources

* [Component Overview](https://www.syncfusion.com/docx-editor-sdk/blazor-docx-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)
* [Documentation](https://help.syncfusion.com/document-processing/word/word-processor/blazor/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)
* [Live Demos](https://document.syncfusion.com/demos/docx-editor/blazor-server/document-editor/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/word-processor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)

## Support and feedbacks

* For queries, reach our [Syncfusion&reg; support team](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) or post the queries through the [community forums](https://www.syncfusion.com/forums/docx-editor-sdk?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget). 
* Request new feature through [Syncfusion&reg; feedback portal](https://www.syncfusion.com/feedback/docx-editor-sdk?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget).

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion&reg; licensed software, including this component, is subject to the terms and conditions of [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget). You can purchase a license [here]( https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) or start a free 30-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget).

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [Xamarin](https://www.syncfusion.com/xamarin-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-word-processor-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET