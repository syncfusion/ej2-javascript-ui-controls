/**
 * Canonical Word create-path styles when no `styles.xml` part exists.
 *
 * `docDefaults` remain the shipped structural default (TASK-8035/8038/8039).
 * Mandatory + create-path styles are deep-cloned from the built-in catalog
 * (`docs/specs/styles-builtin-definitions-catalog.md` §4) via the generic
 * resolver so dependencies land before dependents and the catalog is never
 * mutated.
 *
 * @private
 */
import { wmlAttr, wmlElement } from '../document/wml';
import { resolveStyleForTarget, StyleLookupSurface } from './builtin-resolver';
import { DocDefaults } from './doc-defaults';
import { DocxStyle, DocxStyleType } from './style';
import { OpenXmlElement } from '../../core/xml/model';
// ---------------------------------------------------------------------------
// docDefaults (unchanged structural create-path default)
// ---------------------------------------------------------------------------
/**
 * Build the structural `w:docDefaults` element matching the Word minimum.
 *
 * CT_DocDefaults sequence: `rPrDefault?`, `pPrDefault?`.
 * Run defaults beyond size (TASK-8039) from Word sample evidence.
 * `sz` / `szCs` use `ST_HpsMeasure` half-points (`24` = 12 pt) — TASK-8035.
 * Paragraph spacing under `pPrDefault` — TASK-8038.
 *
 * @returns {DocDefaults} The result.
 * @private
 */
export function buildDefaultDocDefaults(): DocDefaults {
    const rFonts: OpenXmlElement = wmlElement('rFonts', {
        attributes: [
            wmlAttr('asciiTheme', 'minorHAnsi'),
            wmlAttr('eastAsiaTheme', 'minorHAnsi'),
            wmlAttr('hAnsiTheme', 'minorHAnsi'),
            wmlAttr('cstheme', 'minorBidi')
        ]
    });
    const kern: OpenXmlElement = wmlElement('kern', { attributes: [wmlAttr('val', '2')] });
    const sz: OpenXmlElement = wmlElement('sz', { attributes: [wmlAttr('val', '24')] });
    const szCs: OpenXmlElement = wmlElement('szCs', { attributes: [wmlAttr('val', '24')] });
    const lang: OpenXmlElement = wmlElement('lang', {
        attributes: [
            wmlAttr('val', 'en-US'),
            wmlAttr('eastAsia', 'en-US'),
            wmlAttr('bidi', 'ar-SA')
        ]
    });
    const rPr: OpenXmlElement = wmlElement('rPr', { children: [rFonts, kern, sz, szCs, lang] });
    const rPrDefault: OpenXmlElement = wmlElement('rPrDefault', { children: [rPr] });
    const spacing: OpenXmlElement = wmlElement('spacing', {
        attributes: [wmlAttr('after', '160'), wmlAttr('line', '278'), wmlAttr('lineRule', 'auto')]
    });
    const pPr: OpenXmlElement = wmlElement('pPr', { children: [spacing] });
    const pPrDefault: OpenXmlElement = wmlElement('pPrDefault', { children: [pPr] });
    return new DocDefaults(rPrDefault, pPrDefault);
}
// ---------------------------------------------------------------------------
// Create-path seed set (spec §1.2 + TASK-8027 extras)
// ---------------------------------------------------------------------------
/**
 * Styles seeded on `WordDocument.create()` / missing `styles.xml` (spec §4).
 * Order is the resolve order: bases before dependents so the temporary
 * collection stays duplicate-free when the resolver walks `basedOn`.
 *
 * Emission order in the part may differ slightly (resolver may insert a
 * dependency before the requested id); Word does not require a fixed style
 * child order under `w:styles`.
 */
const CREATE_PATH_SEEDS: ReadonlyArray<{
    readonly styleId: string;
    readonly type: DocxStyleType;
}> = [
    { styleId: 'Normal', type: 'paragraph' },
    { styleId: 'DefaultParagraphFont', type: 'character' },
    { styleId: 'TableNormal', type: 'table' },
    { styleId: 'NoList', type: 'numbering' },
    { styleId: 'TableGrid', type: 'table' },
    { styleId: 'Hyperlink', type: 'character' }
];
/**
 * Mutable bag used only while seeding create-path styles through the
 * resolver (avoids constructing a full `StylesPart` and circular imports).
 */
class SeedStyleCollection implements StyleLookupSurface {
    private readonly byId: Map<string, DocxStyle> = new Map<string, DocxStyle>();
    private readonly ordered: DocxStyle[] = [];
    getStyle(styleId: string): DocxStyle | undefined {
        return this.byId.get(styleId);
    }
    findStyleByDisplayName(name: string): DocxStyle | undefined {
        const needle: string = name.trim().toLowerCase().replace(/\s+/g, '');
        if (needle.length === 0) {
            return undefined;
        }
        for (const style of this.ordered) {
            const styleName: string = style.name;
            if (styleName !== undefined && styleName.trim().toLowerCase().replace(/\s+/g, '') === needle) {
                return style;
            }
        }
        return undefined;
    }
    addStyle(style: DocxStyle): void {
        if (this.byId.has(style.styleId)) {
            return;
        }
        this.ordered.push(style);
        this.byId.set(style.styleId, style);
    }
    styles(): DocxStyle[] {
        return [...this.ordered];
    }
}
// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------
/**
 * Arguments for constructing a `StylesPart` with the canonical Word create-path
 * defaults. Returned by {@link buildDefaultStylesArgs} to avoid a circular
 * module dependency (`index.ts` ↔ `default-styles.ts`).
 *
 * @private
 */
export interface DefaultStylesArgs {
    readonly docDefaults: DocDefaults;
    readonly styles: DocxStyle[];
}
/**
 * Constructor args for a `StylesPart` pre-populated with catalog-complete
 * create-path styles (spec §4).
 *
 * Called when no `styles.xml` OPC part exists — `WordDocument.create()` and
 * scratch loads. Caller must pass `dirty = true` to `StylesPart`.
 *
 * Seeded style ids: `Normal`, `DefaultParagraphFont`, `TableNormal`, `NoList`,
 * `TableGrid`, `Hyperlink`. No optional built-ins.
 *
 * @returns {DefaultStylesArgs} The result.
 * @private
 */
export function buildDefaultStylesArgs(): DefaultStylesArgs {
    const collection: SeedStyleCollection = new SeedStyleCollection();
    for (const seed of CREATE_PATH_SEEDS) {
        resolveStyleForTarget(collection, seed.styleId, seed.type);
    }
    return {
        docDefaults: buildDefaultDocDefaults(),
        styles: collection.styles()
    };
}
