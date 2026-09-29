# Syncfusion&reg; Blazor Rich Text Editor

Feature-rich WYSIWYG HTML and Markdown editor for creating and formatting rich content in Blazor applications.

![Blazor RichTextEditor](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-rich-text-editor.png)

## Overview

The [Blazor Rich Text Editor](https://www.syncfusion.com/blazor-components/blazor-wysiwyg-rich-text-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget) is a powerful WYSIWYG editor for creating blogs, forum posts, notes, comments, messaging applications, and support tickets. It provides comprehensive formatting tools, supports both HTML and Markdown modes, and returns valid markup for seamless content integration.

## Key Features

- **Dual editing modes** - HTML and Markdown (MD) editing with mode switching
- **Rich formatting tools** - Text formatting, fonts, colors, alignment, and styles
- **Insert capabilities** - Images, links, tables, lists, code blocks, and media
- **Toolbar customization** - Configurable toolbar with custom tools and commands
- **Table support** - Create and edit tables with cell merging and formatting
- **Image management** - Upload, resize, and position images with drag-and-drop
- **Link insertion** - Insert hyperlinks and email links with validation
- **Paste cleanup** - Smart paste from Word and other sources with formatting cleanup
- **Undo/Redo** - Full undo and redo support with history management
- **Full-screen mode** - Distraction-free editing experience
- **Character and word count** - Track content length in real-time
- **Import/Export** - Import Word documents and export content
- **Responsive design** - Touch-friendly interface for mobile devices
- **Inline and iframe modes** - Flexible rendering options
- **Custom formatting** - Apply custom CSS classes and inline styles
- **Accessibility** - WCAG 2.2 compliant with keyboard shortcuts and screen reader support
- **RTL support** - Right-to-left language compatibility
- **Themes** - Multiple built-in themes and custom styling

## Supported Platforms

- Blazor Server (.NET 8.0 and later)
- Blazor WebAssembly (.NET 8.0 and later)
- Blazor Hybrid (.NET 8.0 and later)

See [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget) for detailed compatibility information.

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.RichTextEditor
```

### Package Manager

```powershell
Install-Package Syncfusion.Blazor.RichTextEditor
```

## Getting Started

### 1. Register Syncfusion&reg; Blazor Service

Add the Syncfusion&reg; Blazor service in your `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

### 2. Add Stylesheet and Script References

**For Blazor Web App or Blazor Server**, add the references in `Components/App.razor` or `App.razor`:
**For Blazor WebAssembly**, add the references in `wwwroot/index.html`:

```html
<head>
    <link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
    <script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
</head>
```

### 3. Add Rich Text Editor Component

Create a rich text editor:

```razor
@using Syncfusion.Blazor.RichTextEditor
<SfRichTextEditor Placeholder="Start Typing...">
    <RichTextEditorToolbarSettings Items="@tools" />
</SfRichTextEditor>
@code {
    private List<ToolbarItemModel> tools = new List<ToolbarItemModel>()
    {
        new ToolbarItemModel() { Command = ToolbarCommand.Bold },
        new ToolbarItemModel() { Command = ToolbarCommand.Italic },
        new ToolbarItemModel() { Command = ToolbarCommand.Underline },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.Formats },
        new ToolbarItemModel() { Command = ToolbarCommand.Alignments },
        new ToolbarItemModel() { Command = ToolbarCommand.OrderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.UnorderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.CreateLink },
        new ToolbarItemModel() { Command = ToolbarCommand.Image },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.Undo },
        new ToolbarItemModel() { Command = ToolbarCommand.Redo }
    };
}
```

### 4. Custom Toolbar Configuration

Configure toolbar with specific tools:

```razor
@using Syncfusion.Blazor.RichTextEditor

<SfRichTextEditor @bind-Value="@content">
    <RichTextEditorToolbarSettings Items="@tools" />
</SfRichTextEditor>

@code {
    private string content = "<p>Start typing...</p>";
    
    private List<ToolbarItemModel> tools = new List<ToolbarItemModel>()
    {
        new ToolbarItemModel() { Command = ToolbarCommand.Bold },
        new ToolbarItemModel() { Command = ToolbarCommand.Italic },
        new ToolbarItemModel() { Command = ToolbarCommand.Underline },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.Formats },
        new ToolbarItemModel() { Command = ToolbarCommand.Alignments },
        new ToolbarItemModel() { Command = ToolbarCommand.OrderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.UnorderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.CreateLink },
        new ToolbarItemModel() { Command = ToolbarCommand.Image },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.Undo },
        new ToolbarItemModel() { Command = ToolbarCommand.Redo }
    };
}
```

### 5. Markdown Mode

Enable Markdown editing:

```razor
@using Syncfusion.Blazor.RichTextEditor

<SfRichTextEditor EditorMode="EditorMode.Markdown" @bind-Value="@markdownContent">
    <RichTextEditorToolbarSettings Items="@markdownTools" />
</SfRichTextEditor>

@code {
    private string markdownContent = "# Hello Markdown\n\nThis is **bold** and this is *italic*.";
    
    private List<ToolbarItemModel> markdownTools = new List<ToolbarItemModel>()
    {
        new ToolbarItemModel() { Command = ToolbarCommand.Bold },
        new ToolbarItemModel() { Command = ToolbarCommand.Italic },
        new ToolbarItemModel() { Command = ToolbarCommand.StrikeThrough },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.Formats },
        new ToolbarItemModel() { Command = ToolbarCommand.OrderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.UnorderedList },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.CreateLink },
        new ToolbarItemModel() { Command = ToolbarCommand.Image }
    };
}
```

## Documentation

- [Getting Started - Web App](https://blazor.syncfusion.com/documentation/rich-text-editor/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [Getting Started - WebAssembly App](https://blazor.syncfusion.com/documentation/rich-text-editor/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-wysiwyg-rich-text-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.RichTextEditor.SfRichTextEditor.html)
- [Live Demos](https://blazor.syncfusion.com/demos/rich-text-editor/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/rich-text-editor?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)

## Support

- **Contact Support** - [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- **Community Forums** - [Blazor Forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- **Feature Requests** - [Feedback Portal](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)

## License

This is a commercial product and requires a paid license for use.

- Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)

## About Syncfusion&reg;

Syncfusion&reg; is a provider of enterprise software components and frameworks. We offer 1600+ components and frameworks for web ([Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [ASP.NET WebForms](https://www.syncfusion.com/jquery/aspnet-webforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), and [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)), mobile ([Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget) and [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)), and desktop development ([WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), [.NET MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget), and [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget)).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-richtexteditor-nuget) | 1-888-9-DOTNET