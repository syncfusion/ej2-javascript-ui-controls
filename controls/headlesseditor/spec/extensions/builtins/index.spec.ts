import * as builtins from '../../../src/extensions/builtins';
import * as rootExports from '../../../src';

describe('Built-in barrel exports', () => {
    it('exports underlineExtension', () => {
        expect(builtins.underlineExtension.name).toBeDefined();
    });

    it('exports strikethroughExtension', () => {
        expect(builtins.strikethroughExtension.name).toBeDefined();
    });

    it('exports inlineCodeExtension', () => {
        expect(builtins.inlineCodeExtension.name).toBeDefined();
    });

    it('exports linkExtension', () => {
        expect(builtins.linkExtension.name).toBeDefined();
    });

    it('exports superscriptExtension', () => {
        expect(builtins.superscriptExtension.name).toBeDefined();
    });

    it('exports subscriptExtension', () => {
        expect(builtins.subscriptExtension.name).toBeDefined();
    });

    it('exports toUpperCaseExtension', () => {
        expect(builtins.toUpperCaseExtension.name).toBeDefined();
    });

    it('exports toLowerCaseExtension', () => {
        expect(builtins.toLowerCaseExtension.name).toBeDefined();
    });

    it('exports fontColorExtension', () => {
        expect(builtins.fontColorExtension.name).toBeDefined();
    });

    it('exports backgroundColorExtension', () => {
        expect(builtins.backgroundColorExtension.name).toBeDefined();
    });

    it('exports codeBlockExtension', () => {
        expect(builtins.codeBlockExtension.name).toBeDefined();
    });

    it('exports clearFormattingExtension', () => {
        expect(builtins.clearFormattingExtension.name).toBeDefined();
    });

    it('exports blockquoteExtension', () => {
        expect(builtins.blockquoteExtension.name).toBeDefined();
    });

    it('exports calloutExtension', () => {
        expect(builtins.calloutExtension.name).toBeDefined();
    });

    it('exports horizontalRuleExtension', () => {
        expect(builtins.horizontalRuleExtension.name).toBeDefined();
    });

    it('exports fontSizeExtension', () => {
        expect(builtins.fontSizeExtension.name).toBeDefined();
    });

    it('exports fontFamilyExtension', () => {
        expect(builtins.fontFamilyExtension.name).toBeDefined();
    });

    it('exports textAlignExtension', () => {
        expect(builtins.textAlignExtension.name).toBeDefined();
    });

    it('exports indentOutdentExtension', () => {
        expect(builtins.indentOutdentExtension.name).toBeDefined();
    });

    it('exports tableExtension', () => {
        expect(builtins.tableExtension.name).toBeDefined();
    });

    it('exports imageExtension', () => {
        expect(builtins.imageExtension.name).toBeDefined();
    });

    it('exports collapsibleExtension', () => {
        expect(builtins.collapsibleExtension.name).toBeDefined();
    });

    it('exports placeholderExtension', () => {
        expect(builtins.placeholderExtension.name).toBeDefined();
    });

    it('exports hardBreakExtension', () => {
        expect(builtins.hardBreakExtension.name).toBeDefined();
    });
});

describe('Root barrel exports', () => {
    it('should expose HeadlessEditor and DefaultIdGenerator', () => {
        expect(rootExports.HeadlessEditor.name).toBe('HeadlessEditor');
        expect(rootExports.DefaultIdGenerator).toBeDefined();
    });
});
