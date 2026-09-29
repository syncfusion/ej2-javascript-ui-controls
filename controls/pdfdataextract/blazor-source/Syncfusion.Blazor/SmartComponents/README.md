# Syncfusion® Blazor Smart Components

AI-powered Blazor components for intelligent form data pasting and text autocompletion. Includes Smart Paste Button and Smart TextArea components for streamlined data entry.

## Supported components

This package includes the following components:

* [Blazor Smart Paste Button](https://www.syncfusion.com/blazor-components/blazor-smart-paste-button?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [Blazor Smart TextArea](https://www.syncfusion.com/blazor-components/blazor-smart-textarea?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

## Blazor Smart Paste Button component

The [Blazor Smart Paste Button component](https://www.syncfusion.com/blazor-components/blazor-smart-paste-button?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) is an AI-powered enhancement to the standard Syncfusion® Button component. It intelligently pastes clipboard data into form fields, automatically populating fields based on the clipboard content context.

**Key features:**

* **Intelligent Form Population**: Automatically fills form fields with clipboard data
* **Context Awareness**: Matches clipboard content to appropriate form fields
* **Field Annotation**: Support for custom field descriptions via `data-smartpaste-description`
* **AI-Powered Parsing**: Uses AI to understand and structure pasted content
* **Standard Button Features**: Inherits all Syncfusion Button component properties
* **Form Support**: Works with `<form>`, `<EditForm>`, and `<SfDataForm>`
* **Smart Field Detection**: Automatically detects form fields and labels

![Smart Paste Button](https://cdn.syncfusion.com/blazor/images/readme/smart-components/smartpaste-withannotations.gif)

**Use cases:**

* **Job Applications**: Copy resume/LinkedIn profiles → Auto-populate experience, skills, education
* **Bug Tracking**: Copy issue descriptions → Auto-populate title, priority, description, steps
* **Data Entry Forms**: Streamline manual data entry from external sources

### Annotating form fields

Override default field descriptions using the `data-smartpaste-description` attribute:

```html
<input data-smartpaste-description="The user's vehicle registration number, formatted as XYZ-123" />

<textarea data-smartpaste-description="The job description should start with JOB TITLE in all caps"></textarea>

<input type="checkbox" data-smartpaste-description="Check if product is suitable for children" />
```

**Documentation:**

* [Smart Paste Button Documentation](https://blazor.syncfusion.com/documentation/smart-paste-button/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.SmartComponents.SfSmartPasteButton.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

## Blazor Smart TextArea component

The [Blazor Smart TextArea](https://www.syncfusion.com/blazor-components/blazor-smart-textarea?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) is an AI-powered textarea component that provides sentence-level autocompletion suggestions based on context and user role, improving typing efficiency.

**Key features:**

* **AI Autocompletion**: Intelligent sentence-level suggestions based on context
* **User Role Context**: Customize suggestions based on user role
* **User Phrases**: Define predefined phrases for consistent responses
* **Device-Aware Display**: Inline suggestions on desktop, overlay on mobile
* **Tab-Key Acceptance**: Accept suggestions using the Tab key
* **Configurable Behavior**: Control suggestion display via `ShowSuggestionOnPopup`
* **Standard TextArea Features**: Inherits all Syncfusion TextArea properties

![Smart TextArea](https://cdn.syncfusion.com/blazor/images/readme/smart-components/smart-textarea.gif)

**Use cases:**

* **GitHub Issue Responses**: Quickly draft consistent, professional responses
* **Live Chat Support**: Generate common support messages efficiently
* **Professional Communications**: Autocomplete business emails and messages

### Customizing suggestions

Configure autocompletion using `UserRole` and `UserPhrases`:

```razor
@using Syncfusion.Blazor.SmartComponents

<SfSmartTextArea 
    @bind-Value="@text" 
    UserRole="@userRole" 
    UserPhrases="@userPhrases" />

@code {
    string? text;
    string userRole = "Customer service agent responding to inquiries";
    string[] userPhrases = new[]
    {
        "Thank you for contacting us.",
        "Please provide more details so we can assist you.",
        "You can find help in our documentation at [URL]."
    };
}
```

### Suggestion display modes

Use `ShowSuggestionOnPopup` to control suggestion display:

```razor
<!-- Always show as floating overlay -->
<SfSmartTextArea ShowSuggestionOnPopup="true" ... />

<!-- Always show inline in textarea -->
<SfSmartTextArea ShowSuggestionOnPopup="false" ... />

<!-- Default: overlay on touch devices, inline on desktop -->
<SfSmartTextArea ... />
```

**Behavior:**

| Mode | Behavior |
|------|----------|
| `true` | Suggestions display as floating overlay (tap/click to accept) |
| `false` | Suggestions display inline in textarea (Tab key to accept) |
| Not set | Touch devices: overlay; Desktop: inline |

**Documentation:**

* [Smart TextArea Documentation](https://blazor.syncfusion.com/documentation/smart-textarea/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.SmartComponents.SfSmartTextArea.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

## Best practices

### Managing suggested information

Avoid using specific details in user phrases that might be reused inappropriately. Instead of:

```csharp
// ❌ Risky: Version might be suggested for all file issues
"Bug report: File not found error occurred in version 2.3"
```

Use placeholders:

```csharp
// ✅ Better: Placeholder guides specific information
"Bug report: File not found error occurred in NEED_INFO"
```

This allows users to fill in specific details while preventing unintended suggestions.

## Configuration

### AI service setup

To use Smart Components, configure your AI services in `Program.cs`:

```csharp
string azureOpenAIKey = "AZURE_OPENAI_KEY";
string azureOpenAIEndpoint = "AZURE_OPENAI_ENDPOINT";
string azureOpenAIModel = "AZURE_OPENAI_MODEL";
AzureOpenAIClient azureOpenAIClient = new AzureOpenAIClient(
     new Uri(azureOpenAIEndpoint),
     new ApiKeyCredential(azureOpenAIKey)
);
IChatClient azureOpenAIChatClient = azureOpenAIClient.GetChatClient(azureOpenAIModel).AsIChatClient();
builder.Services.AddChatClient(azureOpenAIChatClient);
builder.Services.AddSyncfusionSmartComponents()
    .InjectOpenAIInference();
```

Replace the placeholders with your actual API credentials from your AI service provider.

## Add stylesheet and script references

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor` file.
* For **Blazor WebAssembly App**, add these to `wwwroot/index.html` file.

```html
<link href="_content/Syncfusion.Blazor.Themes/fluent2.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick start

Register the Syncfusion® Blazor services in the `Program.cs` file.

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

### Smart Paste Button

```razor
@using Syncfusion.Blazor.DataForm
@using System.ComponentModel.DataAnnotations
@using Syncfusion.Blazor.SmartComponents

<SfDataForm ID="MyForm"
            Model="@EventRegistrationModel">
    <FormValidator>
        <DataAnnotationsValidator></DataAnnotationsValidator>
    </FormValidator>
    <FormItems>
        <FormItem Field="@nameof(EventRegistration.Name)" ID="firstname"></FormItem>
        <FormItem Field="@nameof(EventRegistration.Email)" ID="email"></FormItem>
        <FormItem Field="@nameof(EventRegistration.Phone)" ID="phonenumber"></FormItem>
        <FormItem Field="@nameof(EventRegistration.Address)" ID="address"></FormItem>
    </FormItems>
    <FormButtons>
        <SfSmartPasteButton IsPrimary="true" Content="Smart Paste" IconCss="e-icons e-paste">
        </SfSmartPasteButton>
    </FormButtons>
</SfDataForm>

<br>
<h4 style="text-align:center;">Sample content</h4>
<div>
    Hi, my name is Jane Smith. You can reach me at example@domain.com or call me at +1-555-987-6543. I live at 789 Pine Avenue, Suite 12, Los Angeles, CA 90001.
</div>

@code {
    private EventRegistration EventRegistrationModel = new EventRegistration();

    public class EventRegistration
    {
        [Required(ErrorMessage = "Please enter your name.")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter your email address.")]
        [Display(Name = "Email ID")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter your mobile number.")]
        [Display(Name = "Phone Number")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Please enter your address.")]
        [Display(Name = "Address")]
        public string Address { get; set; }
    }
}
```

### Smart Text Area

```razor
<SfSmartTextArea UserRole="@userRole" UserPhrases="@userPhrases" Placeholder="Enter your queries here" @bind-Value="prompt" Width="75%" RowCount="5">
</SfSmartTextArea>

@code {
    private string? prompt;
    public string userRole = "Maintainer of an open-source project replying to GitHub issues";
    public string[] userPhrases = [
        "Thank you for contacting us.",
        "To investigate, We will need a reproducible example as a public Git repository.",
        "Could you please post a screenshot of NEED_INFO?",
        "This sounds like a usage question. This issue tracker is intended for bugs and feature proposals. Unfortunately, we don't have the capacity to answer general usage questions and would recommend StackOverflow for a faster response.",
        "We do not accept ZIP files as reproducible examples.",
        "Bug report: File not found error occurred in NEED_INFO"
    ];
}
```

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)
* [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smart-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET
