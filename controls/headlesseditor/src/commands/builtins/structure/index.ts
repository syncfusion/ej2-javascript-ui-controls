/**
 * structure/index.ts — Barrel for built-in structural commands.
 */

// Internal infrastructure
export { toggleBlockStructureCommand } from './toggle-block-structure';
export { duplicateNodeCommand } from './duplicate-node';
export { wrapNodeCommand } from './wrap-node';
export { unwrapNodeCommand } from './unwrap-node';
export { transformNodeCommand } from './transform-node';
export { clearNodesCommand, normalizeBlocksToParagraph } from './clear-nodes';
// Public facades
export { setHeadingCommand } from './set-heading';
export { setParagraphCommand } from './set-paragraph';
export { toggleBlockquoteCommand } from './toggle-blockquote';
export { toggleCalloutCommand } from './toggle-callout';
export { setCodeBlockCommand } from './set-code-block';
export { setHorizontalRuleCommand } from './set-horizontal-rule';
export { setTextAlignCommand, unsetTextAlignCommand } from './text-align';
export { indentCommand } from './indent';
export { outdentCommand } from './outdent';
export { inputRuleWrapCommand } from './input-rule-wrap';
export { inputRuleTransformCommand } from './input-rule-transform';
export { inputRuleInsertCommand } from './input-rule-insert';
export { collapseCommand } from './collapse';
export { expandCommand } from './expand';
export { toggleCollapsibleCommand } from './toggle-collapsible';
export { splitBlockCommand } from './split-block';
