/** Fixed-index authoring for an existing theme format matrix. */
import { OpcPackage, PackagePart } from '../package/package-model';
import { OoxmlElement, OoxmlText, parseXml, serializeXml } from '../xml/dom';
import { arrayAt } from '../util/es5-compat';
import { asMutable, findChild } from '../shapes/dom-utils';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { buildGradientFill, GradientFillError } from '../shapes/write-gradient-fill';
import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { replaceLineFill } from '../shapes/mutate-decoration-fill';
import { getGradientDrawingNamespace } from './read-gradient';
/** Actual list identity; index arguments are zero-based positions, not reference idx values. @public */
export type ThemeGradientMatrix = 'fillStyleLst' | 'bgFillStyleLst' | 'lnStyleLst';
/** Package-bound writer, created lazily on the first explicit edit. @internal */
export class ThemeMatrixEditor {
    private readonly root: OoxmlElement;
    private readonly format: OoxmlElement;
    private readonly ns: string;
    private current: PackagePart;
    private readonly pkg: OpcPackage;
    private readonly partName: string;
    private readonly changed: (format: OoxmlElement) => void;
    /**
     * @param {OpcPackage} pkg - Owning package.
     * @param {string} partName - Exact theme part.
     * @param {Function} changed - Publishes refreshed models and revision after a successful commit.
     */
    constructor(pkg: OpcPackage, partName: string, changed: (format: OoxmlElement) => void) {
        this.pkg = pkg; this.partName = partName; this.changed = changed;
        const part: PackagePart | undefined = pkg.parts.get(partName);
        if (part === undefined) { throw new GradientFillError(partName, 'theme.part'); }
        this.current = part;
        this.root = parseXml(new TextDecoder().decode(part.data), { limits: pkg.limits, partName });
        const ns: string | undefined = getGradientDrawingNamespace(this.root.namespaceUri);
        if (ns === undefined || this.root.namespaceUri !== ns || this.root.localName !== 'theme') {
            throw new GradientFillError(partName, 'theme.root');
        }
        this.ns = ns;
        const elements: OoxmlElement | undefined = findChild(this.root, ns, 'themeElements');
        const format: OoxmlElement | undefined = elements === undefined ? undefined : findChild(elements, ns, 'fmtScheme');
        if (format === undefined) { throw new GradientFillError(partName, 'theme.fmtScheme'); }
        this.format = format;
    }
    /**
     * @param {ThemeGradientMatrix} list - Existing matrix list.
     * @param {number} index - Zero-based entry position; never inserts or removes entries.
     * @param {GradientFillOptions} options - Validated authored gradient; phClr stays symbolic.
     * @returns {void} Nothing.
     */
    set(list: ThemeGradientMatrix, index: number, options: GradientFillOptions): void {
        const selected: { list: OoxmlElement; entry: OoxmlElement } = this.target(list, index);
        const fill: OoxmlElement = buildGradientFill(options, this.ns, this.partName);
        if (list === 'lnStyleLst') { replaceLineFill(selected.entry, this.ns, fill); }
        else {
            asMutable(selected.list).children = selected.list.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
                child === selected.entry ? fill : child);
        }
        this.publish();
    }
    /**
     * @param {ThemeGradientMatrix} list - Existing matrix list.
     * @param {number} index - Zero-based position containing a gradient.
     * @returns {GradientStopEditor} Selective stop session with existing stale-root safety.
     */
    edit(list: ThemeGradientMatrix, index: number): GradientStopEditor {
        this.target(list, index);
        return new GradientStopEditor((): OoxmlElement | undefined => {
            const entry: OoxmlElement = this.target(list, index).entry;
            return list === 'lnStyleLst' ? findChild(entry, this.ns, 'gradFill') :
                entry.localName === 'gradFill' ? entry : undefined;
        }, this.partName, (): void => this.publish());
    }
    /**
     * @param {ThemeGradientMatrix} name - Selected list identity.
     * @param {number} index - Zero-based existing entry.
     * @returns {object} Valid existing target; malformed/ambiguous lists are never repaired implicitly.
     */
    private target(name: ThemeGradientMatrix, index: number): { list: OoxmlElement; entry: OoxmlElement } {
        if (this.pkg.parts.get(this.partName) !== this.current ||
            ['fillStyleLst', 'bgFillStyleLst', 'lnStyleLst'].indexOf(name) < 0 ||
            !Number.isInteger(index) || index < 0) { throw new GradientFillError(this.partName, 'theme.matrix.target'); }
        const lists: OoxmlElement[] = [];
        this.format.children.forEach((child: OoxmlElement | OoxmlText): void => {
            if (child.kind === 'element' && child.namespaceUri === this.ns && child.localName === name) { lists.push(child); }
        });
        if (lists.length !== 1) { throw new GradientFillError(this.partName, 'theme.matrix.list'); }
        const list: OoxmlElement = arrayAt(lists, 0);
        const entries: OoxmlElement[] = [];
        const allowed: ReadonlyArray<string> = name === 'lnStyleLst' ? ['ln'] :
            ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
        list.children.forEach((child: OoxmlElement | OoxmlText): void => {
            if (child.kind !== 'element') {
                if (child.text.trim().length !== 0) { throw new GradientFillError(this.partName, 'theme.matrix.content'); }
            } else {
                if (child.namespaceUri !== this.ns || allowed.indexOf(child.localName) < 0) {
                    throw new GradientFillError(this.partName, 'theme.matrix.content');
                }
                entries.push(child);
            }
        });
        if (entries.length < 3 || index >= entries.length) { throw new GradientFillError(this.partName, 'theme.matrix.index'); }
        return { list, entry: arrayAt(entries, index) };
    }
    /** @returns {void} Writes only the owning theme and publishes its new read models. */
    private publish(): void {
        const part: PackagePart = { name: this.current.name, contentType: this.current.contentType,
            data: new TextEncoder().encode(serializeXml(this.root)) };
        this.pkg.parts.set(this.partName, part); this.current = part; this.changed(this.format);
    }
}
