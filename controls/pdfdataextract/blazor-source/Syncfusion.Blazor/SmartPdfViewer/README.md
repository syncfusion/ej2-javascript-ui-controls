# Syncfusion&reg; Blazor SfSmartPdfViewer Component

This package contains the [Blazor Smart PDF Viewer](https://www.syncfusion.com/pdf-viewer-sdk/blazor-smart-pdf-viewer) for Blazor applications. The new Blazor Smart PDF Viewer is an advanced component in Syncfusion’s Blazor suite that integrates artificial intelligence to enhance document interaction. It builds upon the core capabilities of the traditional PDF Viewer by introducing intelligent features such as Document Summarization with Q&A, Smart Redact, and Smart Fill, enabling users to manage documents more efficiently and securely.

![Blazor SfSmartPdfViewer](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-smart-pdf-viewer.png)

## Key features

* **Smart Redaction** - Redacted sensitive information in PDF documents using AI-assistance.
* **Smart Fill** - Using AI to detect fields and populate them from clipboard or specified data, reducing manual input.
* **Document Summarization** - Provide the summary of the PDF document loaded into the viewer.
* **Custom AI Service** - Provide support to connect custom AI models in addition to the built‑in Azure OpenAI service.

## Configuration

### AI service setup

To use Smart Components, configure your AI services in `Program.cs`:

```csharp
string azureOpenAIKey = "AZURE_OPENAI_KEY";
string azureOpenAIEndpoint = "AZURE_OPENAI_ENDPOINT";
string azureOpenAIModel = "AZURE_OPENAI_MODEL";
AzureOpenAIClient azureOpenAIClient = new AzureOpenAIClient(new Uri(azureOpenAiEndpoint), new ApiKeyCredential(azureOpenAiKey));
IChatClient azureOpenAiChatClient = azureOpenAIClient.GetChatClient(azureOpenAiModel).AsIChatClient();
builder.Services.AddChatClient(azureOpenAiChatClient);

builder.Services.AddSingleton<IChatInferenceService, SyncfusionAIService>();
```

Replace the placeholders with your actual API credentials from your AI service provider.

## Add stylesheet and script references

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor` file.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.SfSmartPdfViewer/scripts/syncfusion-blazor-sfsmartpdfviewer.min.js" type="text/javascript"></script>
```

## Quick start

Register the Syncfusion® Blazor services in the `Program.cs` file.

```csharp
using Syncfusion.Blazor;

builder.Services.AddSignalR(o => { o.MaximumReceiveMessageSize = 102400000; });

builder.Services.AddMemoryCache();
// Add service to the container.
builder.Services.AddSyncfusionBlazor();
```

### Smart Paste Button

```razor
@using Syncfusion.Blazor.SmartPdfViewer

<SfSmartPdfViewer Height="100%" Width="100%" DocumentPath="https://cdn.syncfusion.com/content/pdf/http-succinctly.pdf">
</SfSmartPdfViewer>
```

## Documentation

* [Getting Started with Blazor SfSmartPdfViewer in Web App Server](https://help.syncfusion.com/document-processing/pdf/smart-pdf-viewer/blazor/getting-started/web-app)
* [API Reference](https://help.syncfusion.com/cr/blazor/syncfusion.blazor.smartpdfviewer.html)

## Help resources

* [Component Overview](https://help.syncfusion.com/document-processing/pdf/smart-pdf-viewer/blazor/overview)
* [Documentation](https://help.syncfusion.com/document-processing/pdf/smart-pdf-viewer/blazor/overview)
* [Live Demos](https://document.syncfusion.com/demos/pdf-viewer/blazor-server/smart-pdf-viewer/summarizer?theme=fluent)
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