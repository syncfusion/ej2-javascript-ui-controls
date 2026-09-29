# OpenSpec Specifications Index

This directory contains all OpenSpec specifications for the @syncfusion/ej2-interactive-chat component library.

## 📋 Specification Organization

Specifications are organized into three categories:

1. **Foundation Specs** - System-wide architecture and patterns
2. **Shared Feature Specs** - Features used across multiple components
3. **Component-Specific Feature Specs** - Features unique to individual components

---

## 🏗️ Foundation Specifications

These specs describe the overall system architecture, tech stack, and cross-cutting patterns that apply to all components.

| Spec | Description | Path |
|------|-------------|------|
| **Overview** | System purpose, package structure, dependencies, testing strategy | [`overview/spec.md`](overview/spec.md) |
| **Architecture** | Inheritance hierarchy, decorators, lifecycle, module system, security | [`architecture/spec.md`](architecture/spec.md) |

---

## 🔄 Shared Feature Specifications

These specs describe features and patterns shared across multiple components via base classes (InterActiveChatBase, AIAssistBase).

| Spec | Description | Applies To | Path |
|------|-------------|------------|------|
| **Component Lifecycle** | preRender, render, postRender, destroy, getPersistData lifecycle hooks | All components | [`shared-componentLifecycle/spec.md`](shared-componentLifecycle/spec.md) |
| **Toolbar System** | ToolbarItem, ToolbarSettings, alignment, types, events, templates | All components | [`shared-toolbarSystem/spec.md`](shared-toolbarSystem/spec.md) |
| **Property Change Notification** | INotifyPropertyChanged, onPropertyChanged pattern, reactive updates | All components | [`shared-propertyChangeNotification/spec.md`](shared-propertyChangeNotification/spec.md) |
| **Event System** | @Event() decorator, EmitType, BaseEventArgs, trigger(), handlers, cancellation | All components | [`shared-eventSystem/spec.md`](shared-eventSystem/spec.md) |
| **Template Support** | String/function templates, compile(), context data, framework support (React/Angular/Vue) | All components | [`shared-templateSupport/spec.md`](shared-templateSupport/spec.md) |
| **Accessibility (WCAG 2.1 AA)** | ARIA labels/roles, keyboard navigation, focus management, screen reader support | All components | [`shared-accessibility/spec.md`](shared-accessibility/spec.md) |

---

## 💬 ChatUI Component Specifications

ChatUI provides a general-purpose chat interface with messages, user management, mentions, and file attachments.

| Spec | Description | Path |
|------|-------------|------|
| **Messages** | Message collection, structure, status, replies, alignment, avatars, sanitization | [`chatui-messages/spec.md`](chatui-messages/spec.md) |
| **User Management** | User model, avatar display (image/initials), status indicators, user selection | [`chatui-userManagement/spec.md`](chatui-userManagement/spec.md) |
| **Scroll Behavior** | Auto-scroll to latest, scroll lock, scroll position restoration, smooth scrolling | [`chatui-scrollBehavior/spec.md`](chatui-scrollBehavior/spec.md) |
| **Time Formatting** | Timestamp display, date separators, time breaks, locale-aware formatting | [`chatui-timeFormatting/spec.md`](chatui-timeFormatting/spec.md) |
| **Typing Indicator** | Show/hide typing status, multiple users typing, animations, state management | [`chatui-typingIndicator/spec.md`](chatui-typingIndicator/spec.md) |
| **Mentions** | @mention functionality, user dropdown, formatting, storage in messages | [`chatui-mentions/spec.md`](chatui-mentions/spec.md) |
| **File Attachments** | Uploader integration, formats (Base64/Blob), events, upload configuration | [`chatui-fileAttachments/spec.md`](chatui-fileAttachments/spec.md) |
| **Header Configuration** | Custom header, title/subtitle display, toolbar integration, customization | [`chatui-headerConfiguration/spec.md`](chatui-headerConfiguration/spec.md) |
| **Empty State** | Empty chat display, custom empty state template, placeholder messaging | [`chatui-emptyState/spec.md`](chatui-emptyState/spec.md) |
| **Message Send Event** | messageSend event, cancellable, user/message context, pre/post send hooks | [`chatui-messageSendEvent/spec.md`](chatui-messageSendEvent/spec.md) |

---

## 🤖 AIAssistView Component Specifications

AIAssistView provides a full-featured AI assistant with prompts, streaming responses, suggestions, and advanced input options.

| Spec | Description | Path |
|------|-------------|------|
| **Attachments** | File attachment collection, upload events, attachment display, removal | [`aiassistview-attachments/spec.md`](aiassistview-attachments/spec.md) |
| **Custom Views** | AssistView class, multi-view system, view switching, custom templates, AssistViewType | [`aiassistview-customViews/spec.md`](aiassistview-customViews/spec.md) |
| **Footer Toolbar** | Footer toolbar configuration, alignment, items, events, customization | [`aiassistview-footerToolbar/spec.md`](aiassistview-footerToolbar/spec.md) |
| **Header Toolbar** | Header toolbar configuration, alignment, items, events, customization | [`aiassistview-headerToolbar/spec.md`](aiassistview-headerToolbar/spec.md) |
| **Markdown Rendering** | MarkdownConverter integration, code highlighting, streaming markdown, HTML sanitization | [`aiassistview-markdownRendering/spec.md`](aiassistview-markdownRendering/spec.md) |
| **Prompts** | Prompt collection, suggestions, prompt toolbar, prompt-response pairing, storage | [`aiassistview-prompts/spec.md`](aiassistview-prompts/spec.md) |
| **Prompt Request Event** | promptRequest event, server integration, response population, cancellation | [`aiassistview-promptRequestEvent/spec.md`](aiassistview-promptRequestEvent/spec.md) |
| **Prompt Toolbar** | Per-prompt toolbar, items, events, prompt context, action execution | [`aiassistview-promptToolbar/spec.md`](aiassistview-promptToolbar/spec.md) |
| **Response Helpfulness** | isResponseHelpful tracking, like/dislike buttons, feedback collection, analytics | [`aiassistview-responseHelpfulness/spec.md`](aiassistview-responseHelpfulness/spec.md) |
| **Response Toolbar** | Per-response toolbar, items, events, response context, copy/share actions | [`aiassistview-responseToolbar/spec.md`](aiassistview-responseToolbar/spec.md) |
| **Speech-to-Text** | Voice input, language support, interim results, button/tooltip customization, error handling | [`aiassistview-speechToText/spec.md`](aiassistview-speechToText/spec.md) |
| **Text-to-Speech** | Voice output, SpeechSynthesis integration, language/pitch/rate/volume configuration, audio toolbar button | [`aiassistview-textToSpeech/spec.md`](aiassistview-textToSpeech/spec.md) |
| **Thinking Blocks** | AI reasoning visualization, collapsible stages, timeline rendering, context tracking, accessibility | [`aiassistview-thinkingBlocks/spec.md`](aiassistview-thinkingBlocks/spec.md) |
| **Tool UI Custom Rendering** | ToolBlock registration, custom handler functions, props forwarding, container management, error handling | [`aiassistview-toolUI/spec.md`](aiassistview-toolUI/spec.md) |
| **Streaming Responses** | enableStreaming, incremental rendering, stop streaming, markdown streaming, performance | [`aiassistview-streaming/spec.md`](aiassistview-streaming/spec.md) |
| **Suggestions** | promptSuggestions array, suggestion display, click handling, templates, empty state | [`aiassistview-suggestions/spec.md`](aiassistview-suggestions/spec.md) |

---

## ✨ InlineAIAssist Component Specifications

InlineAIAssist provides lightweight contextual AI assistance with inline or popup response modes.

| Spec | Description | Path |
|------|-------------|------|
| **Command System** | CommandItem class, slash commands, command popup, itemSelect event, placeholders | [`inlineAiAssist-commandSystem/spec.md`](inlineAiAssist-commandSystem/spec.md) |
| **Inline Toolbar** | InlineToolbarSettings, positioning modes (inline/bottom), itemClick event, customization | [`inlineAiAssist-inlineToolbar/spec.md`](inlineAiAssist-inlineToolbar/spec.md) |
| **Popup Configuration** | target, relateTo, popupWidth/popupHeight, collision detection, z-index, positioning | [`inlineAiAssist-popupConfiguration/spec.md`](inlineAiAssist-popupConfiguration/spec.md) |
| **Prompt Request Event** | InlinePromptRequestEventArgs, token resolution ({selection}, {before}, {after}), AI integration | [`inlineAiAssist-promptRequestEvent/spec.md`](inlineAiAssist-promptRequestEvent/spec.md) |
| **Prompts Collection** | PromptResponse model, prompts array, CRUD operations, persistence, iteration | [`inlineAiAssist-promptsCollection/spec.md`](inlineAiAssist-promptsCollection/spec.md) |
| **Response Items** | ResponseItem class, replace/insert/copy actions, response toolbar, action execution | [`inlineAiAssist-responseItems/spec.md`](inlineAiAssist-responseItems/spec.md) |
| **Response Mode** | Inline vs Popup modes, mode switching, popup customization, response actions | [`inlineAiAssist-responseMode/spec.md`](inlineAiAssist-responseMode/spec.md) |
| **Target Integration** | Target element integration (textarea/contentEditable), caret positioning, content insertion | [`inlineAiAssist-targetIntegration/spec.md`](inlineAiAssist-targetIntegration/spec.md) |

---

## 📊 Specification Statistics

- **Total Specs**: 42 (100% coverage achieved)
  - Foundation: 2 (overview, architecture)
  - Shared: 6 (componentLifecycle, toolbarSystem, propertyChangeNotification, eventSystem, templateSupport, accessibility)
  - ChatUI: 10 (messages, userManagement, scrollBehavior, timeFormatting, typingIndicator, mentions, fileAttachments, headerConfiguration, emptyState, messageSendEvent)
  - AIAssistView: 16 (attachments, customViews, footerToolbar, headerToolbar, markdownRendering, prompts, promptRequestEvent, promptToolbar, responseHelpfulness, responseToolbar, speechToText, textToSpeech, thinkingBlocks, toolUI, streaming, suggestions)
  - InlineAIAssist: 8 (commandSystem, inlineToolbar, popupConfiguration, promptRequestEvent, promptsCollection, responseItems, responseMode, targetIntegration)
- **Generated**: March 23, 2026 (initial), April 7, 2026 (textToSpeech added), August 10, 2026 (thinkingBlocks and generativeUI added)
- **Source Files Analyzed**: 13 TypeScript files, 8 model definition files
- **Average Spec Size**: 3,000+ lines (comprehensive documentation with 8-10 requirements, 7-10 scenarios per spec)

---

## 🔍 How to Use This Index

### By Component
- **Working on ChatUI?** Read: Overview → Architecture → Messages → File Attachments → Mentions + Toolbar System + Property Change Notification
- **Working on AIAssistView?** Read: Overview → Architecture → Prompts → Streaming → Speech-to-Text + Toolbar System + Property Change Notification
- **Working on InlineAIAssist?** Read: Overview → Architecture → Response Mode + Toolbar System + Property Change Notification

### By Feature Area
- **Adding a property?** Read: Architecture (decorators) + Property Change Notification
- **Adding a toolbar?** Read: Toolbar System
- **Working with messages?** Read: ChatUI Messages
- **Implementing streaming?** Read: AIAssistView Streaming
- **File uploads?** Read: ChatUI File Attachments (or AIAssistView Prompts for attachments)

### By Task Type
- **New component?** Read: Overview → Architecture + relevant shared specs
- **Bug fix?** Identify affected component → read component-specific spec + relevant shared specs
- **Security review?** Read: Architecture (XSS prevention section) + all specs mentioning sanitization
- **Test coverage?** Each spec includes testable scenarios in Given/When/Then format

---

## 🛠️ Maintenance

### Adding New Specs
1. Follow naming convention: `{domain}-{featureName}/spec.md`
2. Use spec template with: Purpose, Requirements (SHALL/MUST), Scenarios (Given/When/Then), Technical Notes
3. Update this README index
4. Update `openspec/config.yaml` with new component or feature

### Updating Existing Specs
- Preserve requirement numbering and scenario structure
- Add `MODIFIED` marker if using delta documentation (not applicable for generated baseline specs)
- Update "Generated" date in spec header if regenerated

---

## 📖 Related Documentation

- **OpenSpec Workflow**: [`../WORKFLOW.md`](../WORKFLOW.md) - How to use specs in development
- **Quick Start**: [`../QUICKSTART.md`](../QUICKSTART.md) - 10-minute intro to OpenSpec
- **Config**: [`../config.yaml`](../config.yaml) - Component inventory and metadata
- **Project Context**: [`../project.md`](../project.md) - Complete API reference (auto-generated)

---

## 🎯 Specification Coverage — 100% COMPLETE ✅

### 40 Documented Features (All Components)

**Foundation (2)**
- ✅ System overview, package structure, dependencies
- ✅ Architecture, decorators, lifecycle, module system

**ChatUI (10)**
- ✅ Message management and display
- ✅ User management (avatars, status, selection)
- ✅ Scroll behavior (auto-scroll, scroll lock, smooth scrolling)
- ✅ Time formatting (timestamps, date separators, locale)
- ✅ Typing indicators (multi-user, animations)
- ✅ @mention functionality (dropdown, formatting)
- ✅ File attachments (upload, formats, events)
- ✅ Header configuration (title, subtitle, toolbar)
- ✅ Empty chat state (placeholder, custom templates)
- ✅ Message send event (cancellable, pre/post hooks)

**AIAssistView (16)**
- ✅ Attachments (collection, upload, display)
- ✅ Custom views (AssistView class, multi-view, templates)
- ✅ Footer toolbar (configuration, items, events)
- ✅ Header toolbar (configuration, items, events)
- ✅ Markdown rendering (MarkdownConverter, syntax highlighting)
- ✅ Prompts (collection, suggestions, toolbar)
- ✅ Prompt request event (server integration, response population)
- ✅ Prompt toolbar (per-prompt items, context, actions)
- ✅ Response helpfulness (tracking, like/dislike, feedback)
- ✅ Response toolbar (per-response items, context, actions)
- ✅ Speech-to-text input (voice, language support, interim results)
- ✅ Text-to-speech output (SpeechSynthesis, lang/pitch/rate/volume, audio button)
- ✅ Thinking blocks (stage visualization, timeline, context tracking, editable context)
- ✅ Tool UI custom rendering (handler registration, props forwarding, container management)
- ✅ Streaming responses (incremental rendering, markdown, stop)
- ✅ Suggestions (array, display, click, templates)

**InlineAIAssist (8)**
- ✅ Command system (slash commands, popup, selection)
- ✅ Inline toolbar (positioning modes, items, events)
- ✅ Popup configuration (target, relateTo, positioning, z-index)
- ✅ Prompt request event (token resolution, AI integration)
- ✅ Prompts collection (CRUD, persistence, iteration)
- ✅ Response items (replace/insert/copy, toolbar, actions)
- ✅ Response mode (inline vs popup, switching, customization)
- ✅ Target integration (textarea, contentEditable, caret management)

**Shared Features (6)**
- ✅ Component lifecycle (preRender → render → postRender → destroy)
- ✅ Toolbar system (ToolbarItem, ToolbarSettings, alignment, events)
- ✅ Property change notification (reactive updates, INotifyPropertyChanged)
- ✅ Event system (@Event decorator, EmitType, trigger(), handlers)
- ✅ Template support (string/function templates, compile(), context)
- ✅ Accessibility (WCAG 2.1 AA, ARIA, keyboard navigation, focus)  

---

**Note**: This is a living document. As the codebase evolves, specs should be updated to reflect actual implementation. Use the `openspec verify` command to check for spec drift.
