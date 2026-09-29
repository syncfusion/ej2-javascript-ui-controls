/**
 * formatting/index.ts — Barrel for built-in formatting commands.
 */
// Internal infrastructure
export { toggleMarkCommand } from './toggle-mark';
export { setMarkCommand } from './set-mark';
export { removeMarkCommand } from './remove-mark';
// Public facades
export { toggleBoldCommand } from './toggle-bold';
export { toggleItalicCommand } from './toggle-italic';
export { toggleUnderlineCommand } from './toggle-underline';
export { toggleStrikethroughCommand } from './toggle-strikethrough';
export { toggleCodeMarkCommand } from './toggle-code-mark';
export { setLinkCommand } from './set-link';
export { unsetLinkCommand } from './unset-link';
export { toggleSuperscriptCommand } from './toggle-superscript';
export { toggleSubscriptCommand } from './toggle-subscript';
export { toUpperCaseCommand } from './upper-case';
export { toLowerCaseCommand } from './lower-case';
export { setColorCommand } from './set-color';
export { unsetColorCommand } from './unset-color';
export { setHighlightCommand } from './set-highlight';
export { unsetHighlightCommand } from './unset-highlight';
export { setFontSizeCommand } from './set-font-size';
export { unsetFontSizeCommand } from './unset-font-size';
export { setFontFamilyCommand } from './set-font-family';
export { unsetFontFamilyCommand } from './unset-font-family';
export { clearFormattingCommand } from './clear-formatting';
export { inputRuleMarkCommand } from './input-rule-mark';
