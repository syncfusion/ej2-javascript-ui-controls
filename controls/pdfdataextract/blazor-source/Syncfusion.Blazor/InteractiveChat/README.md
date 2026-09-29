# Syncfusion® Blazor Interactive Chat Components

A comprehensive suite of Blazor components for building conversational AI interfaces and chat applications. Includes AI AssistView and Chat UI components for seamless AI service integration.

## Supported Components

This package includes the following components:

* [Blazor AI AssistView](https://www.syncfusion.com/blazor-components/blazor-ai-assistview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Blazor Chat UI](https://www.syncfusion.com/blazor-components/blazor-chat-ui?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

## Blazor AI AssistView Component

The [Blazor AI AssistView Component](https://www.syncfusion.com/blazor-components/blazor-ai-assistview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) is a versatile and modern UI tool designed to seamlessly integrate AI services into your web applications.

**Key Features:**

* **Prompt Input**: Enable users to send prompts and queries to AI services
* **AI Response Display**: Effortlessly display AI-generated responses in a user-friendly interface
* **Data Binding**: Bind to local data, API responses, and observable collections
* **Custom Templates**: Rich templates for rendering prompts and responses
* **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape) for accessibility
* **Theming and Styling**: Custom CSS, themes, and styling options for seamless integration
* **Accessibility**: Full keyboard navigation and ARIA support for screen readers

![Blazor AI AssistView](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-ai-assistview.png)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/ai-assistview/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/ai-assistview/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-ai-assistview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/ai-assistview/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.InteractiveChat.SfAIAssistView.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

## Blazor Chat UI Component

The [Blazor Chat UI Component](https://www.syncfusion.com/blazor-components/blazor-chat-ui?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) is a versatile and modern UI tool designed to seamlessly integrate AI services into your web applications.

**Key Features:**

* **Interactive Conversations**: Build responsive chat interfaces for user-AI interactions
* **Message Display**: Render user and AI messages with different visual styles
* **AI Response Rendering**: Display AI-generated responses in a user-friendly interface
* **Data Binding**: Support for arrays, API data, and observable collections
* **Custom Templates**: Rich templates for rendering messages and content
* **Keyboard Navigation**: Full keyboard support for accessibility
* **Theming and Styling**: Custom CSS, themes, and styling options for seamless integration

![Blazor Chat UI](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-chat-ui.png)

**Documentation:**

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/chat-ui/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/chat-ui/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-chat-ui?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/chat-ui/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.InteractiveChat.SfChatUI.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget).

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.InteractiveChat
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.InteractiveChat
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

### AI AssistView

```razor
<div class="aiassist-container" style="height: 350px; width: 650px;">
    <SfAIAssistView></SfAIAssistView>
</div>
```

### Chat UI

```razor
<div style="height: 400px; width: 400px;">
    <SfChatUI ID="chatUser" User="CurrentUserModel" Messages="ChatUserMessages"></SfChatUI>
</div>

@code {
    private static UserModel CurrentUserModel = new UserModel() { ID = "User1", User = "Albert" };
    private static UserModel MichaleUserModel = new UserModel() { ID = "User2", User = "Michale Suyama" };

    private List<ChatMessage> ChatUserMessages = new List<ChatMessage>()
    {
        new ChatMessage() { Text = "Want to get coffee tomorrow?", Author = CurrentUserModel },
        new ChatMessage() { Text = "Sure! What time?", Author = MichaleUserModel },
        new ChatMessage() { Text = "How about 10 AM?", Author = CurrentUserModel }
    };
}
```

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)
* [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-interactivechat-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
