# Changelog

## [Unreleased]

## 32.2.5 (2026-02-17)

### Chat UI

#### Bug Fixes

- Now the actual event argument parameters of the `AttachmentClickEventArgs` will be accessible now.

## 29.1.33 (2025-03-25)

### Chat UI

#### Bug Fixes

- `#I700931` - Now the issue with TextArea doesn't adjust the height dynamically when the text exceeds the current height has been resolved.

#### Features

- Now we have provided two methods `scrollToMessage` and `focusAsync` to enhance user experience:

- **scrollToMessage(string messageId)** – Scrolls to the specific message using its unique ID, allowing users to quickly navigate to the messages.
- **focus** – Sets focus on the input textarea, enabling seamless message typing without manual interaction.

### AI AssistView

#### Features

- Now we have provided steaming support in the AI AssistView which enables dynamic updates of the responses as chunks by using the existing method `addPromptResponse()` method with an additional argument `isFinal` to indicate the final response.

- Now we have provided a new event `stopRespondingClick` which triggers when the stop responding button is clicked.

## 27.1.48 (2024-09-18)

### AI AssistView

The AI AssistView is a versatile and modern UI tool designed to seamlessly integrate AI services into your web applications. It enables users to send prompts, execute commands through a feature-rich toolbar, and effortlessly display AI-generated responses in a user-friendly interface.

#### Key features

- **Built-in toolbars**: Predefined toolbar items like copy, edit, and like/dislike for easy interaction with prompts and responses.
- **Prompt suggestions**: Supports initial or on-demand prompt suggestions with a customizable header.
- **Header toolbar**: Allows adding toolbar items in the header with options for executing custom commands.
- **Custom views**: Extensive customization options for creating personalized views in addition to the built-in assist view.
- **Customization**: Allows customizing the default appearance, including prompts, responses, and more, to suit your needs.