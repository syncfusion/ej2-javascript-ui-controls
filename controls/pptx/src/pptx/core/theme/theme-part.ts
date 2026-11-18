import { ThemeMatrixEditor, ThemeGradientMatrix } from './theme-matrix-editor';
import { OoxmlElement } from '../xml/dom';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { GradientFillError } from '../shapes/write-gradient-fill';
import { readGradientThemeStyles } from './gradient-theme-styles';
import { parseThemeFormatScheme } from './theme-render-model';
import { GradientThemeStyles } from './gradient-theme-styles';
/**
 * Loaded theme part (`a:theme` / `CT_OfficeStyleSheet`).
 */
import { ColorScheme } from './color-scheme';
import { ThemeFontScheme, ThemeFormatScheme } from './theme-render-model';
/**
 * Theme part handle used by {@link Presentation.theme}.
 *
 * @remarks
 * Colour scheme slots are readable. `fontScheme`, `fmtScheme`,
 * `objectDefaults`, extra/custom colour lists, `extLst`, and unknown children
 * remain in the package part bytes and are preserved on no-op save (TASK-1011
 * does not re-serialize the theme part). Explicit fixed-index matrix fill edits are package-bound and refresh read views.
 *
 * Relationship discovery: slide-master → theme (preferred), else a theme
 * relationship on the presentation main part when present.
 * Available through Presentation.theme; constructed unbound handles remain read-only.
 *
 * @public
 */
export class ThemePart {
    /**
     * Absolute OPC URI of the theme part (e.g. `/ppt/theme/theme1.xml`).
     */
    readonly partName: string;
    /**
     * Relationship Id on the source part that targeted this theme.
     */
    readonly relationshipId: string;
    /**
     * Absolute URI of the part that owns the theme relationship
     * (slide master or presentation).
     */
    readonly sourcePartName: string;
    /**
     * Optional `a:theme` `@name` (`CT_OfficeStyleSheet`).
     */
    readonly name: string | undefined;
    /**
     * Parsed `a:clrScheme` under `a:themeElements`.
     */
    readonly colorScheme: ColorScheme;
    /** Authored major/minor theme font collections. */
    readonly fontScheme: ThemeFontScheme;
    /** Authored fill, line, effect, and background format matrices. */
    private formatSchemeValue: ThemeFormatScheme;
    /** Complete sparse fill matrices for non-mutating gradient host resolution. @internal */
    private gradientStylesValue: GradientThemeStyles | undefined;
    /**
     * @internal
     * @param {*} init - The init value.
     * @param {string} init.partName - Theme part name.
     * @param {string} init.relationshipId - Relationship id.
     * @param {string} init.sourcePartName - Owning part name.
     * @param {string} [init.name] - Theme name.
     * @param {*} init.colorScheme - Parsed color scheme.
     * @param {*} init.fontScheme - Parsed font scheme.
     * @param {*} init.formatScheme - Parsed format scheme.
     * @param {GradientThemeStyles} init.gradientStyles - Optional complete sparse fill matrices.
     * @param {Function} init.createMatrixEditor - Internal lazy package writer factory.
     */
    constructor(init: {
        readonly partName: string;
        readonly relationshipId: string;
        readonly sourcePartName: string;
        readonly name: string | undefined;
        readonly colorScheme: ColorScheme;
        readonly fontScheme: ThemeFontScheme;
        readonly formatScheme: ThemeFormatScheme;
        readonly gradientStyles?: GradientThemeStyles;
        readonly createMatrixEditor?: (changed: (format: OoxmlElement) => void) => ThemeMatrixEditor;
    }) {
        this.partName = init.partName;
        this.relationshipId = init.relationshipId;
        this.sourcePartName = init.sourcePartName;
        this.name = init.name;
        this.colorScheme = init.colorScheme;
        this.fontScheme = init.fontScheme;
        this.formatSchemeValue = init.formatScheme;
        this.createMatrixEditor = init.createMatrixEditor;
        this.gradientStylesValue = init.gradientStyles;
    }
    private readonly createMatrixEditor: ((changed: (format: OoxmlElement) => void) => ThemeMatrixEditor) | undefined;
    private matrixEditor: ThemeMatrixEditor | undefined;
    private revisionValue: number = 0;
    private onMutate: (() => void) | undefined;
    /** Current authored format matrix view; refreshed after a shared matrix edit.
     *
     * @returns {ThemeFormatScheme} Current matrix read view.
     */
    get formatScheme(): ThemeFormatScheme { return this.formatSchemeValue; }
    /** Complete authored fill/background lists; never resolved RGB values.
     *
     * @returns {GradientThemeStyles | undefined} Complete authored source lists.
     */
    get gradientStyles(): GradientThemeStyles | undefined { return this.gradientStylesValue; }
    /** Monotonic successful theme-matrix mutation count for this loaded handle.
     *
     * @returns {number} Successful mutation count.
     */
    get revision(): number { return this.revisionValue; }
    /**
     * Replaces one existing shared theme matrix entry's fill; all referencing objects retain their idx values.
     *
     * @param {ThemeGradientMatrix} list - Exact fillStyleLst, bgFillStyleLst or lnStyleLst identity.
     * @param {number} index - Zero-based existing position, not the OOXML reference idx.
     * @param {GradientFillOptions} options - Authored gradient, retaining phClr and color transforms.
     * @returns {void} Nothing. Invalid/unbound targets throw without changing source or revision.
     */
    setMatrixGradientFill(list: ThemeGradientMatrix, index: number, options: GradientFillOptions): void {
        this.editor().set(list, index, options);
    }
    /**
     * Starts a selective stop session on an existing shared matrix gradient.
     *
     * @param {ThemeGradientMatrix} list - Exact matrix list identity.
     * @param {number} index - Zero-based existing gradient entry.
     * @returns {GradientStopEditor} Dispose when finished; replacement invalidates stale sessions.
     */
    editMatrixGradientFill(list: ThemeGradientMatrix, index: number): GradientStopEditor {
        return this.editor().edit(list, index);
    }
    /**
     * @param {Function} callback - Existing document mutation notification.
     * @returns {void} Nothing.
     * @internal
     */
    attachOnMutate(callback: () => void): void { this.onMutate = callback; }
    /** @returns {ThemeMatrixEditor} Lazily bound package writer, without parsing or rewriting on no-op saves. */
    private editor(): ThemeMatrixEditor {
        if (this.matrixEditor === undefined) {
            if (this.createMatrixEditor === undefined) { throw new GradientFillError(this.partName, 'theme.unbound'); }
            this.matrixEditor = this.createMatrixEditor((format: OoxmlElement): void => {
                this.formatSchemeValue = parseThemeFormatScheme(format);
                this.gradientStylesValue = readGradientThemeStyles(format, this.partName);
                this.revisionValue++;
                if (this.onMutate !== undefined) { this.onMutate(); }
            });
        }
        return this.matrixEditor;
    }
    /**
     * Convenience: direct colour for one scheme slot.
     *
     * @param {*} index - `ST_ColorSchemeIndex` token.
     * @returns {*} Authored {@link ColorValue} (not a resolved RGB view).
     */
    getSlot(index: Parameters<ColorScheme['getSlot']>[0]): ReturnType<ColorScheme['getSlot']> {
        return this.colorScheme.getSlot(index);
    }
}
