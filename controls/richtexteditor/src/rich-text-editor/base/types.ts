/**
 * Defines the Predefined AI Assitant Response Toolbar Items.
 *
 */
export type AssistantResponseToolbarItems = 'Copy' | 'Insert' | 'Regenerate' | '|';

/**
 * Defines the Predefined AI Assitant Prompt Toolbar Items.
 *
 */
export type AssistantPromptToolbarItems = 'Edit' | 'Copy' ;

/**
 * Defines the Predefined AI Assitant Header Toolbar Items.
 *
 */
export type AssitantHeaderToolbarItems = 'Close' | 'AIcommands' | 'Clear';

/**
 * Defines possible types of toolbars in AI Assistant component.
 *
 */
export type AssistantToolbarType = 'Response' | 'Prompt' | 'Header' | 'Footer';

/**
 * Defines the types of popups that can be opened in the editor.
 *
 */
export type EditorPopupType = 'EmojiPicker' | 'AIAssistant' | 'Menu' ;


// Private types

/**
 * @private
 */
export type IMenuRenderTargetType = 'Inline' | 'Toolbar' | 'Quick';
