### Syncfusion&reg; Blazor AI 

This package provides seamless AI integration capabilities for Blazor applications, supporting various AI services including OpenAI, Azure OpenAI, Ollama, and custom AI providers. It serves as the foundation for Syncfusion's AI-powered components like [Smart TextArea](https://blazor.syncfusion.com/documentation/smart-textarea/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ai-nuget) and [Smart Paste Button](https://blazor.syncfusion.com/documentation/smart-paste/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ai-nuget).

### System Requirements

* [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

### Key Features

* Multi-provider support (OpenAI, Azure OpenAI, Ollama)
* Easy-to-use extensibility for custom AI services
* Built-in security with antiforgery support
* Foundation for Smart UI components
* Async/await support for all operations

### Quick Start Guide

### Configuration Guide

To integrate AI capabilities in your Blazor application, configure the services in your `Program.cs`:

```csharp
// Example for OpenAI configuration
builder.Services.AddSingleton(new AIServiceCredentials
{
    ApiKey = "your-openai-key",
    DeploymentName = "gpt-4", // Model name (e.g., "gpt-4", "gpt-3.5-turbo")
    Endpoint = null // Must be null for OpenAI
});

// Example for Azure OpenAI configuration
builder.Services.AddSingleton(new AIServiceCredentials
{
    ApiKey = "your-azure-openai-key",
    DeploymentName = "your-deployment-name",
    Endpoint = new Uri("https://your-openai.azure.com/")
});

// Example for Ollama (local models) configuration
builder.Services.AddSingleton(new AIServiceCredentials
{
    DeploymentName = "llama2", // Model name (e.g., "llama2", "mistral", "codellama")
    Endpoint = new Uri("http://localhost:11434"),
    SelfHosted = true // Required for Ollama
});

// Register inference backend
builder.Services.AddSingleton<IChatInferenceService, SyncfusionAIService>();
```

### Usage Examples

Here's how to use the AI service in your Blazor components:

```csharp
@inject IChatInferenceService AIService

@code {
    private async Task GetAIResponse()
    {
        var response = await AIService.GenerateResponseAsync(new ChatParameters
        {
            Messages = new List<ChatMessage>
            {
                new ChatMessage(ChatRole.System, "You are a helpful assistant."),
                new ChatMessage(ChatRole.User, "Hello!")
            },
            Temperature = 0.7f,
            MaxTokens = 100
        });
        
        // Handle the response
    }
}
```

### Support and Feedback

* For queries, reach our [Syncfusion&reg; support team](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ai-nuget) or post the queries through the [community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ai-nuget). 
* Request new feature through [Syncfusion&reg; feedback portal](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-ai-nuget).

### License

This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of [Syncfusion's EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget). You can purchase a license [here](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) or start a free 30-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget).

### About Syncfusion&reg;

Founded in 2001 and headquartered in Research Triangle Park, N.C., Syncfusion&reg; has more than 29,000 customers and more than 1 million users, including large financial institutions, Fortune 500 companies, and global IT consultancies.
 
Today, we provide 1800+ components and frameworks for web ([Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [ASP.NET WebForms](https://www.syncfusion.com/jquery/aspnet-webforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), and [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)), mobile ([Xamarin](https://www.syncfusion.com/xamarin-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), and [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)), and desktop development ([WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget), [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) and [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)). We provide ready-to-deploy enterprise software for dashboards, reports, data integration, and big data processing. Many customers have saved millions in licensing fees by deploying our software.

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | Toll Free: 1-888-9 DOTNET

