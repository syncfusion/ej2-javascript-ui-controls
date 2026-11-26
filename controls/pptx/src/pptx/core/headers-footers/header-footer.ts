/**
 * One header, footer, date/time, or slide-number entry.
 *
 * @remarks
 * Visibility is `p:hf` on the layout, master, or notes master
 * (`CT_HeaderFooter`: `@sldNum`, `@hdr`, `@ftr`, `@dt`). The schema default is
 * `true`, but a missing `p:hf` on a part this library created means the entry
 * is hidden — PowerPoint does not show footer placeholders until the user
 * turns them on. An explicit attribute still wins.
 * Text lives on the matching placeholder (`p:ph/@type` `hdr` / `ftr` / `dt` /
 * `sldNum`). Date/time format is the `a:fld/@type` `datetimeN` token inside that
 * placeholder. Notes slides have no `p:hf` of their own (`CT_NotesSlide`);
 * visibility is read from and written to the related notes master.
 *
 * Citation: Transitional `pml.xsd` `CT_HeaderFooter` (~1204), `ST_PlaceholderType`
 * (~1213); `dml-main.xsd` `CT_TextField`.
 */
import { PresentationError } from '../errors';
import { DML_NS } from '../shapes/constants';
import { asMutable, findChild, getAttr } from '../shapes/dom-utils';
import { PML_NS } from '../presentation/constants';
import { PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { DateTimeFormatType, dateTimeFieldType, dateTimeFormatFromFieldType } from './date-time-format';

/**
 * Which part owns this header/footer set.
 *
 * `header` (`p:ph/@type="hdr"`) is valid only on a notes slide. Slide, layout,
 * and master parts have no header placeholder in the PowerPoint Header and
 * Footer model (`ST_PlaceholderType` `hdr` is the notes header).
 */
export type HeaderFooterScope = 'slide' | 'layout' | 'master' | 'notes';

/** 1-based slide number used when a slide-number field has no explicit text. */
export type SlideNumberSource = () => number;

/** Placeholder type token that carries this entry's text. */
export type HeaderFooterKind = 'hdr' | 'ftr' | 'dt' | 'sldNum';

/** `p:hf` attribute for this entry. */
const HF_ATTR: { readonly [key: string]: string } = {
    hdr: 'hdr',
    ftr: 'ftr',
    dt: 'dt',
    sldNum: 'sldNum'
};

/**
 * Live header, footer, date and time, or slide number.
 *
 * @public
 */
export class HeaderFooter {
    private readonly kind: HeaderFooterKind;
    private readonly root: OoxmlElement;
    private readonly limits: SecurityLimits;
    private readonly partName: string;
    /** Notes slides delegate `p:hf` to the notes master root. */
    private readonly visibilityRoot: OoxmlElement;
    private readonly onMutate: (() => void) | undefined;
    private readonly onVisibilityMutate: (() => void) | undefined;
    private readonly scope: HeaderFooterScope;
    private readonly slideNumber: SlideNumberSource | undefined;
    private readonly masterRoot: OoxmlElement | undefined;
    /** Set when `visible = false` removed the shape. Later text/format must not recreate it. */
    private hidden: boolean;

    /**
     * @internal
     * @param kind - Placeholder / hf role.
     * @param root - Slide, layout, master, or notes part root that owns the placeholder.
     * @param limits - Package security limits (text length).
     * @param partName - Part identity for errors.
     * @param visibilityRoot - Root that owns `p:hf` (notes master when `root` is a notes slide).
     * @param onMutate - Flush hook for the placeholder part.
     * @param onVisibilityMutate - Flush hook for the `p:hf` part when it differs.
     * @param scope - Part kind. Header text and visibility are notes-only.
     * @param slideNumber - 1-based slide index for an unassigned slide-number field.
     */
    constructor(kind: HeaderFooterKind, root: OoxmlElement, limits: SecurityLimits, partName: string,
                visibilityRoot: OoxmlElement, onMutate?: () => void, onVisibilityMutate?: () => void,
                scope: HeaderFooterScope = 'slide', slideNumber?: SlideNumberSource, masterRoot?: OoxmlElement) {
        this.kind = kind;
        this.root = root;
        this.limits = limits;
        this.partName = partName;
        this.visibilityRoot = visibilityRoot;
        this.onMutate = onMutate;
        this.onVisibilityMutate = onVisibilityMutate;
        this.scope = scope;
        this.slideNumber = slideNumber;
        this.masterRoot = masterRoot;
        this.hidden = false;
    }

    /**
     * Whether this entry is shown.
     *
     * @remarks
     * Reads `p:hf` on this part (notes master for a notes slide). An omitted
     * `p:hf` means hidden. An omitted attribute on an existing `p:hf` is the
     * schema default `true` (`CT_HeaderFooter`). Setting writes the attribute
     * explicitly (`1` or `0`) so a later read does not fall back to hidden.
     * Unknown `p:hf` children (`extLst`) are left in place.
     *
     * @throws {PresentationError} `model/invalid-argument` when this is the
     * header on a slide, layout, or master. Header exists only on notes.
     */
    get visible(): boolean {
        this.assertHeaderAllowed();
        if (this.hidden) {
            return false;
        }
        return findPlaceholderShape(this.root, this.kind) !== undefined;
    }

    set visible(value: boolean) {
        this.assertHeaderAllowed();
        this.hidden = !value;
        if (!value) {
            removePlaceholderShape(this.root, this.kind);
        }
        else if (findPlaceholderShape(this.root, this.kind) === undefined) {
            const shape: OoxmlElement = ensurePlaceholderShape(this.root, this.kind, this.masterRoot, this.scope);
            if (this.kind === 'sldNum') {
                const masterShape: OoxmlElement | undefined = this.masterRoot === undefined ? undefined : findPlaceholderShape(this.masterRoot, this.kind);
                const inherited: string = masterShape === undefined ? '' : collectText(masterShape);
                if (inherited !== '') {
                    writeInheritedSlideNumber(shape, inherited);
                }
                else if ((this.scope === 'slide' || this.scope === 'notes') && this.slideNumber !== undefined) {
                    writeSlideNumber(shape, this.defaultSlideNumberText());
                }
            }
            if (this.kind === 'dt') {
                this.format = DateTimeFormatType.DateTimeMdyy;
            }
        }
        if (this.onMutate !== undefined) {
            this.onMutate();
        }
    }

    /**
     * Direct placeholder text (fixed string, or the cached date/slide-number field text).
     *
     * @remarks
     * Concatenates `a:t` under the matching `p:ph` shape. Empty when the
     * placeholder or its text is absent — missing metadata is not an error.
     * A slide number with no direct text reads as the 1-based slide index
     * (`a:fld/@type="slidenum"`). Setting text writes that string on this part
     * only. A date whose format is not {@link DateTimeFormatType.None} ignores
     * assigned text and reports the formatted current date instead.
     *
     * @throws {PresentationError} `model/invalid-argument` when this is the
     * header on a slide, layout, or master.
     */
    get text(): string {
        this.assertHeaderAllowed();
        if (!this.visible) {
            return '';
        }
        if (this.kind === 'dt' && this.format !== DateTimeFormatType.None) {
            return formatDate(this.format, new Date());
        }
        const shape: OoxmlElement | undefined = findPlaceholderShape(this.root, this.kind);
        if (shape === undefined) {
            return this.kind === 'sldNum' ? this.defaultSlideNumberText() : '';
        }
        const authored: string = collectText(shape);
        if (authored === '' && this.kind === 'sldNum') {
            return this.defaultSlideNumberText();
        }
        return authored;
    }

    set text(value: string) {
        this.assertHeaderAllowed();
        if (!this.visible) {
            return;
        }
        const byteLength: number = new TextEncoder().encode(value).byteLength;
        if (byteLength > this.limits.textNodeLengthBytes) {
            throw new PackageLimitError('textNodeLengthBytes', {
                partName: this.partName,
                actual: byteLength
            });
        }
        const shape: OoxmlElement = ensurePlaceholderShape(this.root, this.kind, this.masterRoot, this.scope);
        if (this.kind === 'sldNum') {
            convertFieldToRun(shape);
            writeText(shape, value, false);
        }
        else if (this.kind === 'dt') {
            convertFieldToRun(shape);
            writeText(shape, value, false);
        }
        else {
            writeText(shape, value, false);
        }
        if (this.onMutate !== undefined) {
            this.onMutate();
        }
    }

    /**
     * Date and time format.
     *
     * @remarks
     * Meaningful for {@link HeadersFooters.dateAndTime}. Other entries report
     * {@link DateTimeFormatType.None}. A known `datetimeN` field maps to the
     * matching enum value; a fixed string (no field) is `None`. Setting a
     * format other than `None` ensures an `a:fld` with that `@type` and does
     * not replace cached text. The displayed value is the formatted current
     * date, not {@link HeaderFooter.text}. Setting `None` converts a date
     * field to a regular run so a fixed string can be stored. Turning a date
     * on with no format uses {@link DateTimeFormatType.DateTimeMdyy}
     * (M/d/yyyy), which is what PowerPoint shows for a date with no chosen pattern.
     */
    get format(): DateTimeFormatType {
        if (this.kind !== 'dt' || !this.visible) {
            return DateTimeFormatType.None;
        }
        const shape: OoxmlElement | undefined = findPlaceholderShape(this.root, this.kind);
        if (shape === undefined) {
            return DateTimeFormatType.None;
        }
        const field: OoxmlElement | undefined = findField(shape);
        if (field === undefined) {
            return DateTimeFormatType.None;
        }
        const parsed: DateTimeFormatType | undefined = dateTimeFormatFromFieldType(getAttr(field, '', 'type'));
        return parsed === undefined ? DateTimeFormatType.None : parsed;
    }

    set format(value: DateTimeFormatType) {
        if (this.kind !== 'dt' || !this.visible) {
            return;
        }
        const shape: OoxmlElement = ensurePlaceholderShape(this.root, this.kind, this.masterRoot, this.scope);
        const token: string | undefined = dateTimeFieldType(value);
        if (token === undefined) {
            clearPlaceholderText(shape);
        }
        else {
            ensureDateField(shape, token, formatDate(value, new Date()));
        }
        if (this.onMutate !== undefined) {
            this.onMutate();
        }
    }

    /**
     * Header is a notes-slide placeholder. Slide, layout, and master parts reject it.
     */
    private assertHeaderAllowed(): void {
        if (this.kind === 'hdr' && this.scope !== 'notes') {
            throw new PresentationError('model/invalid-argument',
                'Header is supported only on a notes slide.');
        }
    }

    /**
     * @returns 1-based slide index, or empty when this part is not a slide.
     */
    /**
     * Direct placeholder text, ignoring generated date and slide-number defaults.
     */
    private authoredText(): string {
        const shape: OoxmlElement | undefined = findPlaceholderShape(this.root, this.kind);
        return shape === undefined ? '' : collectText(shape);
    }

    private defaultSlideNumberText(): string {
        if (this.slideNumber === undefined) {
            return '';
        }
        return String(this.slideNumber());
    }
}

/**
 * Header, footer, date and time, and slide number for one slide part.
 *
 * @public
 */
export class HeadersFooters {
    /**
     * Header (`p:ph/@type="hdr"`, `p:hf/@hdr`). Used by notes.
     */
    readonly header: HeaderFooter;
    /**
     * Footer (`p:ph/@type="ftr"`, `p:hf/@ftr`).
     */
    readonly footer: HeaderFooter;
    /**
     * Date and time (`p:ph/@type="dt"`, `p:hf/@dt`).
     */
    readonly dateAndTime: HeaderFooter;
    /**
     * Slide number (`p:ph/@type="sldNum"`, `p:hf/@sldNum`).
     */
    readonly slideNumber: HeaderFooter;

    /**
     * @internal
     * @param root - Part that owns the placeholders.
     * @param limits - Package limits.
     * @param partName - Part identity.
     * @param visibilityRoot - Part that owns `p:hf`.
     * @param onMutate - Flush hook for `root`.
     * @param onVisibilityMutate - Flush hook for `visibilityRoot` when distinct.
     * @param scope - Part kind. Header is rejected unless this is `notes`.
     * @param slideNumber - 1-based index for a slide-number field with no text.
     */
    constructor(root: OoxmlElement, limits: SecurityLimits, partName: string, visibilityRoot?: OoxmlElement,
                onMutate?: () => void, onVisibilityMutate?: () => void, scope: HeaderFooterScope = 'slide',
                slideNumber?: SlideNumberSource, masterRoot?: OoxmlElement) {
        const flags: OoxmlElement = visibilityRoot === undefined ? root : visibilityRoot;
        this.header = new HeaderFooter('hdr', root, limits, partName, flags, onMutate, onVisibilityMutate, scope, slideNumber, masterRoot);
        this.footer = new HeaderFooter('ftr', root, limits, partName, flags, onMutate, onVisibilityMutate, scope, slideNumber, masterRoot);
        this.dateAndTime = new HeaderFooter('dt', root, limits, partName, flags, onMutate, onVisibilityMutate, scope, slideNumber, masterRoot);
        this.slideNumber = new HeaderFooter('sldNum', root, limits, partName, flags, onMutate, onVisibilityMutate, scope, slideNumber, masterRoot);
    }
}

/**
 * Ensures `p:hf` exists, inserted before `extLst` when that sibling is present.
 *
 * @param root - Slide-family root (`CT_Slide` has no `hf`; masters, layouts, and notes masters do).
 * @returns The `p:hf` element.
 */
function ensureHf(root: OoxmlElement): OoxmlElement {
    const existing: OoxmlElement | undefined = findChild(root, PML_NS, 'hf');
    if (existing !== undefined) {
        return existing;
    }
    const hf: OoxmlElement = element(PML_NS, 'hf', 'p', [], []);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(root).children;
    let insertAt: number = children.length;
    for (let i: number = 0; i < children.length; i++) {
        const child: OoxmlElement | OoxmlText = children[i];
        if (child.kind === 'element' && child.localName === 'extLst') {
            insertAt = i;
            break;
        }
    }
    children.splice(insertAt, 0, hf);
    return hf;
}

/**
 * Writes a boolean attribute explicitly. `true` is `1` so a missing `p:hf`
 * (hidden) and an enabled entry stay distinct after save.
 *
 * @param hf - `p:hf` element.
 * @param name - Attribute local name.
 * @param value - Desired visibility.
 */
function setBooleanAttr(hf: OoxmlElement, name: string, value: boolean): void {
    const written: string = value ? '1' : '0';
    const attrs: OoxmlAttribute[] = asMutable(hf).attributes as OoxmlAttribute[];
    for (let i: number = 0; i < attrs.length; i++) {
        if (attrs[i].localName === name && attrs[i].namespaceUri === '') {
            attrs[i] = { namespaceUri: '', localName: name, value: written };
            return;
        }
    }
    attrs.push({ namespaceUri: '', localName: name, value: written });
}

/**
 * @param root - Slide-family root.
 * @param type - `ST_PlaceholderType` token.
 * @returns The first `p:sp` whose `p:ph/@type` matches, document order.
 */
/**
 * Removes the placeholder so a hidden entry is not painted from the slide part.
 * Layout and master placeholders stay; only the part being edited is changed.
 *
 * @param root - Part root.
 * @param type - Placeholder type.
 */
/**
 * Marks the placeholder hidden. `p:hf` alone does not stop PowerPoint drawing a
 * slide-level copy; an empty transform keeps the text without painting it.
 * The shape and its text stay so a later show restores them.
 *
 * @param root - Part root.
 * @param type - Placeholder type.
 */
/**
 * Drops the placeholder from this part. PowerPoint draws a slide-level
 * placeholder even when `p:hf` says hidden, so absence is the hide.
 *
 * @param root - Part root.
 * @param type - Placeholder type.
 */
function removePlaceholderShape(root: OoxmlElement, type: string): void {
    const spTree: OoxmlElement | undefined = findSpTree(root);
    if (spTree === undefined) {
        return;
    }
    const shape: OoxmlElement | undefined = findShape(spTree, type);
    if (shape === undefined) {
        return;
    }
    const children: Array<OoxmlElement | OoxmlText> = asMutable(spTree).children;
    const index: number = children.indexOf(shape);
    if (index >= 0) {
        children.splice(index, 1);
    }
}

function hidePlaceholderShape(root: OoxmlElement, type: string): void {
    const shape: OoxmlElement | undefined = findPlaceholderShape(root, type);
    if (shape === undefined) {
        return;
    }
    const spPr: OoxmlElement | undefined = findChild(shape, PML_NS, 'spPr');
    if (spPr === undefined) {
        return;
    }
    const existing: OoxmlElement | undefined = findChild(spPr, DML_NS, 'xfrm');
    const xfrm: OoxmlElement = element(DML_NS, 'xfrm', 'a', [], [
        element(DML_NS, 'off', 'a', [attribute('x', '0'), attribute('y', '0')], []),
        element(DML_NS, 'ext', 'a', [attribute('cx', '0'), attribute('cy', '0')], [])
    ]);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(spPr).children;
    if (existing !== undefined) {
        children.splice(children.indexOf(existing), 1, xfrm);
    }
    else {
        children.unshift(xfrm);
    }
}

/**
 * Drops a zero transform written by {@link hidePlaceholderShape} so the
 * placeholder inherits layout geometry again.
 *
 * @param root - Part root.
 * @param type - Placeholder type.
 */
function showPlaceholderShape(root: OoxmlElement, type: string): void {
    const shape: OoxmlElement | undefined = findPlaceholderShape(root, type);
    if (shape === undefined) {
        return;
    }
    const spPr: OoxmlElement | undefined = findChild(shape, PML_NS, 'spPr');
    if (spPr === undefined) {
        return;
    }
    const xfrm: OoxmlElement | undefined = findChild(spPr, DML_NS, 'xfrm');
    if (xfrm === undefined) {
        return;
    }
    const ext: OoxmlElement | undefined = findChild(xfrm, DML_NS, 'ext');
    if (ext !== undefined && getAttr(ext, '', 'cx') === '0' && getAttr(ext, '', 'cy') === '0') {
        const children: Array<OoxmlElement | OoxmlText> = asMutable(spPr).children;
        children.splice(children.indexOf(xfrm), 1);
    }
}

function findPlaceholderShape(root: OoxmlElement, type: string): OoxmlElement | undefined {
    const spTree: OoxmlElement | undefined = findSpTree(root);
    if (spTree === undefined) {
        return undefined;
    }
    return findShape(spTree, type);
}

/**
 * @param parent - Element to walk (spTree or group).
 * @param type - Placeholder type.
 * @returns Matching shape, if any.
 */
function findShape(parent: OoxmlElement, type: string): OoxmlElement | undefined {
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = parent.children[i];
        if (child.kind !== 'element') {
            continue;
        }
        if (child.localName === 'sp' && placeholderType(child) === type) {
            return child;
        }
        if (child.localName === 'grpSp') {
            const nested: OoxmlElement | undefined = findShape(child, type);
            if (nested !== undefined) {
                return nested;
            }
        }
    }
    return undefined;
}

/**
 * @param shape - `p:sp`.
 * @returns Authored `p:ph/@type`, or `undefined` when the shape is not a placeholder.
 */
function placeholderType(shape: OoxmlElement): string | undefined {
    const nvSpPr: OoxmlElement | undefined = findChild(shape, PML_NS, 'nvSpPr');
    if (nvSpPr === undefined) {
        return undefined;
    }
    const nvPr: OoxmlElement | undefined = findChild(nvSpPr, PML_NS, 'nvPr');
    if (nvPr === undefined) {
        return undefined;
    }
    const ph: OoxmlElement | undefined = findChild(nvPr, PML_NS, 'ph');
    if (ph === undefined) {
        return undefined;
    }
    return getAttr(ph, '', 'type');
}

/**
 * @param root - Slide-family root.
 * @returns `p:cSld/p:spTree`.
 */
function findSpTree(root: OoxmlElement): OoxmlElement | undefined {
    const cSld: OoxmlElement | undefined = findChild(root, PML_NS, 'cSld');
    if (cSld === undefined) {
        return undefined;
    }
    return findChild(cSld, PML_NS, 'spTree');
}

/**
 * Appends a placeholder shape when the part has none for this type.
 *
 * @param root - Slide-family root.
 * @param type - `hdr` / `ftr` / `dt` / `sldNum`.
 * @returns Existing or newly appended `p:sp`.
 */
function ensurePlaceholderShape(root: OoxmlElement, type: HeaderFooterKind, masterRoot?: OoxmlElement,
    scope: HeaderFooterScope = 'slide'): OoxmlElement {
    const existing: OoxmlElement | undefined = findPlaceholderShape(root, type);
    if (existing !== undefined) {
        return existing;
    }
    const spTree: OoxmlElement | undefined = findSpTree(root);
    if (spTree === undefined) {
        throw new PackageLimitError('shapesPerSlide', { partName: '' });
    }
    const id: string = String(nextShapeId(spTree));
    const shape: OoxmlElement = buildPlaceholder(id, type, placeholderIndexFor(root, type, masterRoot, scope), scope);
    asMutable(spTree).children.push(shape);
    return shape;
}

/**
 * @param spTree - Shape tree.
 * @returns max(`cNvPr/@id`) + 1, at least 2. Existing ids are not renumbered.
 */
function nextShapeId(spTree: OoxmlElement): number {
    let max: number = 1;
    const visit = (parent: OoxmlElement): void => {
        for (let i: number = 0; i < parent.children.length; i++) {
            const child: OoxmlElement | OoxmlText = parent.children[i];
            if (child.kind !== 'element') {
                continue;
            }
            if (child.localName === 'cNvPr') {
                const raw: string | undefined = getAttr(child, '', 'id');
                const id: number = raw === undefined ? 0 : parseInt(raw, 10);
                if (id > max) {
                    max = id;
                }
            }
            visit(child);
        }
    };
    visit(spTree);
    return max + 1;
}

/**
 * Minimal `p:sp` for a header/footer placeholder.
 *
 * Citation: `pml.xsd` `CT_Shape` (`nvSpPr`, `spPr` required); `CT_Placeholder`
 * `@type`; `dml-main.xsd` `CT_TextBody` (`bodyPr` required, `p` minOccurs 1).
 * Geometry is omitted so the layout/master placeholder supplies it.
 *
 * @param id - New `cNvPr/@id`.
 * @param type - Placeholder type.
 * @returns A new shape element.
 */
function buildPlaceholder(id: string, type: HeaderFooterKind, index: string | undefined,
    scope: HeaderFooterScope = 'slide'): OoxmlElement {
    const cNvPr: OoxmlElement = element(PML_NS, 'cNvPr', 'p', [
        attribute('id', id),
        attribute('name', placeholderName(type))
    ], []);
    const cNvSpPr: OoxmlElement = element(PML_NS, 'cNvSpPr', 'p', [], [
        element(DML_NS, 'spLocks', 'a', [attribute('noGrp', '1')], [])
    ]);
    const phAttrs: OoxmlAttribute[] = [attribute('type', type)];
    const size: string | undefined = placeholderSize(type);
    if (size !== undefined) {
        phAttrs.push(attribute('sz', size));
    }
    if (index !== undefined) {
        phAttrs.push(attribute('idx', index));
    }
    const nvPr: OoxmlElement = element(PML_NS, 'nvPr', 'p', [], [
        element(PML_NS, 'ph', 'p', phAttrs, [])
    ]);
    const nvSpPr: OoxmlElement = element(PML_NS, 'nvSpPr', 'p', [], [cNvPr, cNvSpPr, nvPr]);
    const txBody: OoxmlElement = element(PML_NS, 'txBody', 'p', [], [
        element(DML_NS, 'bodyPr', 'a', [attribute('wrap', 'square')], []),
        element(DML_NS, 'lstStyle', 'a', [], []),
        element(DML_NS, 'p', 'a', [], [
            element(DML_NS, 'pPr', 'a', [attribute('defTabSz', '914400')], [])
        ])
    ]);
    const spPrChildren: Array<OoxmlElement | OoxmlText> = [];
    const box: NotesPlaceholderBox | undefined = undefined;
    if (box !== undefined) {
        spPrChildren.push(element(DML_NS, 'xfrm', 'a', [], [
            element(DML_NS, 'off', 'a', [attribute('x', box.x), attribute('y', box.y)], []),
            element(DML_NS, 'ext', 'a', [attribute('cx', box.cx), attribute('cy', box.cy)], [])
        ]));
        spPrChildren.push(element(DML_NS, 'prstGeom', 'a', [attribute('prst', 'rect')], [
            element(DML_NS, 'avLst', 'a', [], [])
        ]));
    }
    spPrChildren.push(element(DML_NS, 'ln', 'a', [], [
        element(DML_NS, 'headEnd', 'a', [attribute('type', 'none')], []),
        element(DML_NS, 'tailEnd', 'a', [attribute('type', 'none')], [])
    ]));
    const spPr: OoxmlElement = element(PML_NS, 'spPr', 'p', [], spPrChildren);
    return element(PML_NS, 'sp', 'p', [], [nvSpPr, spPr, txBody]);
}

/**
 * @param type - Placeholder type.
 * @returns Office-like `cNvPr/@name`.
 */
/**
 * `CT_Placeholder/@sz` Office writes for footer placeholders.
 * Date is `half`; footer and slide number are `quarter`. Notes header is `quarter`.
 *
 * @param type - Placeholder type.
 * @returns Size token.
 */
/**
 * EMU box for a notes header/footer when the notes slide has no notes master
 * to inherit from. Positions match the standard notes page: header and date
 * on the top row, footer and slide number on the bottom row.
 */
interface NotesPlaceholderBox {
    readonly x: string;
    readonly y: string;
    readonly cx: string;
    readonly cy: string;
}

/**
 * @param type - Notes placeholder type.
 * @returns Standard notes-page box, or `undefined` for a non-footer type.
 */
function notesPlaceholderBox(type: HeaderFooterKind): NotesPlaceholderBox | undefined {
    if (type === 'hdr') {
        return { x: '0', y: '0', cx: '2971800', cy: '458788' };
    }
    if (type === 'dt') {
        return { x: '3884613', y: '0', cx: '2971800', cy: '458788' };
    }
    if (type === 'ftr') {
        return { x: '0', y: '8685213', cx: '2971800', cy: '458787' };
    }
    if (type === 'sldNum') {
        return { x: '3884613', y: '8685213', cx: '2971800', cy: '458787' };
    }
    return undefined;
}

/**
 * Gives the slide image and notes body the standard notes-page boxes when this
 * notes slide has no notes master. Without that, both sit at the origin and
 * the body covers the header.
 *
 * @param root - Notes slide root.
 */
function placeNotesBody(root: OoxmlElement): void {
    placeIfMissing(root, 'sldImg', { x: '685800', y: '1143000', cx: '5486400', cy: '3086100' });
    placeIfMissing(root, 'body', { x: '685800', y: '4400550', cx: '5486400', cy: '3600450' });
}

/**
 * @param root - Notes slide root.
 * @param type - Existing placeholder type.
 * @param box - Notes-page box.
 */
function placeIfMissing(root: OoxmlElement, type: string, box: NotesPlaceholderBox): void {
    const shape: OoxmlElement | undefined = findPlaceholderShape(root, type);
    if (shape === undefined) {
        return;
    }
    const spPr: OoxmlElement | undefined = findChild(shape, PML_NS, 'spPr');
    if (spPr === undefined || findChild(spPr, DML_NS, 'xfrm') !== undefined) {
        return;
    }
    asMutable(spPr).children.unshift(element(DML_NS, 'xfrm', 'a', [], [
        element(DML_NS, 'off', 'a', [attribute('x', box.x), attribute('y', box.y)], []),
        element(DML_NS, 'ext', 'a', [attribute('cx', box.cx), attribute('cy', box.cy)], [])
    ]));
    asMutable(spPr).children.splice(1, 0, element(DML_NS, 'prstGeom', 'a', [attribute('prst', 'rect')], [
        element(DML_NS, 'avLst', 'a', [], [])
    ]));
}

function placeholderSize(type: HeaderFooterKind): string | undefined {
    if (type === 'dt') {
        return 'half';
    }
    return 'quarter';
}

/**
 * `CT_Placeholder/@idx` that matches the master footer placeholders in the
 * built-in slide layouts (`dt` 10, `ftr` 11, `sldNum` 12). Without this index
 * the slide shape does not inherit the master's position, and PowerPoint
 * stacks the text at the top-left. Notes header has no index.
 *
 * @param type - Placeholder type.
 * @returns Index token, or `undefined` for the notes header.
 */
/**
 * Index of the matching placeholder already in this part or its master.
 * A layout must use the master's index (often 2/3/4) or PowerPoint does not
 * inherit the footer geometry. A part with no such placeholder uses the
 * built-in slide indexes.
 *
 * @param root - Part being written.
 * @param type - Placeholder type.
 * @returns Index token, or `undefined` for the notes header.
 */
function placeholderIndexFor(root: OoxmlElement, type: HeaderFooterKind, masterRoot?: OoxmlElement,
    scope: HeaderFooterScope = 'slide'): string | undefined {
    const local: string | undefined = indexOf(findPlaceholderShape(root, type));
    if (local !== undefined) {
        return local;
    }
    const master: string | undefined = masterRoot === undefined ? undefined : indexOf(findPlaceholderShape(masterRoot, type));
    if (master !== undefined) {
        return master;
    }
    if (scope === 'notes') {
        return notesPlaceholderIndex(type);
    }
    return placeholderIndex(type);
}

/**
 * @param shape - Placeholder shape, if present.
 * @returns `p:ph/@idx`.
 */
function indexOf(shape: OoxmlElement | undefined): string | undefined {
    if (shape === undefined) {
        return undefined;
    }
    const nvSpPr: OoxmlElement | undefined = findChild(shape, PML_NS, 'nvSpPr');
    const nvPr: OoxmlElement | undefined = nvSpPr === undefined ? undefined : findChild(nvSpPr, PML_NS, 'nvPr');
    const ph: OoxmlElement | undefined = nvPr === undefined ? undefined : findChild(nvPr, PML_NS, 'ph');
    return ph === undefined ? undefined : getAttr(ph, '', 'idx');
}

/**
 * Notes-page indexes. Header has none. Date is 1, footer is 4, slide number is 5.
 *
 * @param type - Placeholder type.
 * @returns Index token, or `undefined` for the notes header.
 */
function notesPlaceholderIndex(type: HeaderFooterKind): string | undefined {
    if (type === 'hdr') {
        return '0';
    }
    if (type === 'dt') {
        return '1';
    }
    if (type === 'ftr') {
        return '4';
    }
    if (type === 'sldNum') {
        return '10';
    }
    return undefined;
}

function placeholderIndex(type: HeaderFooterKind): string | undefined {
    if (type === 'dt') {
        return '10';
    }
    if (type === 'ftr') {
        return '11';
    }
    if (type === 'sldNum') {
        return '12';
    }
    return undefined;
}

function placeholderName(type: HeaderFooterKind): string {
    if (type === 'hdr') {
        return 'Header Placeholder';
    }
    if (type === 'ftr') {
        return 'Footer Placeholder';
    }
    if (type === 'dt') {
        return 'Date Placeholder';
    }
    return 'Slide Number Placeholder';
}

/**
 * @param shape - Placeholder shape.
 * @returns Joined `a:t` character data.
 */
function collectText(shape: OoxmlElement): string {
    let out: string = '';
    const visit = (node: OoxmlElement): void => {
        if (node.namespaceUri === DML_NS && node.localName === 't') {
            for (let i: number = 0; i < node.children.length; i++) {
                const child: OoxmlElement | OoxmlText = node.children[i];
                if (child.kind === 'text') {
                    out += child.text;
                }
            }
            return;
        }
        for (let i: number = 0; i < node.children.length; i++) {
            const child: OoxmlElement | OoxmlText = node.children[i];
            if (child.kind === 'element') {
                visit(child);
            }
        }
    };
    visit(shape);
    return out;
}

/**
 * Writes `value` into the first `a:t` and clears any later text nodes.
 *
 * @param shape - Placeholder shape.
 * @param value - New text.
 * @param keepField - When true, a date field is kept (cached text only changes).
 */
function writeText(shape: OoxmlElement, value: string, keepField: boolean): void {
    const txBody: OoxmlElement | undefined = findChild(shape, PML_NS, 'txBody');
    if (txBody === undefined) {
        return;
    }
    const paragraph: OoxmlElement | undefined = findChild(txBody, DML_NS, 'p');
    if (paragraph === undefined) {
        return;
    }
    if (!keepField) {
        const field: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'fld');
        if (field !== undefined && getAttr(field, '', 'type') !== undefined &&
            (getAttr(field, '', 'type') as string).indexOf('datetime') === 0) {
            /* Fixed text assignment on a format date leaves the field; callers
             * who want a fixed string set format to None first. Slide-number
             * fields (`slidenum`) are preserved the same way. */
        }
    }
    const target: OoxmlElement = ensureTextCarrier(paragraph, keepField);
    const text: OoxmlElement = ensureTextElement(target);
    asMutable(text).children = [textNode(value)];
    clearLaterText(paragraph, text);
}

/**
 * @param paragraph - `a:p`.
 * @param keepField - Prefer the date field as the text carrier.
 * @returns `a:fld` or `a:r` that should hold the text.
 */
function ensureTextCarrier(paragraph: OoxmlElement, keepField: boolean): OoxmlElement {
    if (keepField) {
        const field: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'fld');
        if (field !== undefined) {
            return field;
        }
    }
    const field: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'fld');
    if (field !== undefined && !keepField && isDateOrSlideField(field) && getAttr(field, '', 'type') !== 'slidenum') {
        return field;
    }
    const run: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'r');
    if (run !== undefined) {
        return run;
    }
    if (field !== undefined) {
        return field;
    }
    const created: OoxmlElement = element(DML_NS, 'r', 'a', [], [
        element(DML_NS, 'rPr', 'a', [attribute('lang', 'en-US'), attribute('dirty', '0')], []),
        element(DML_NS, 't', 'a', [], [])
    ]);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    let insertAt: number = children.length;
    for (let i: number = 0; i < children.length; i++) {
        const child: OoxmlElement | OoxmlText = children[i];
        if (child.kind === 'element' && child.localName === 'endParaRPr') {
            insertAt = i;
            break;
        }
    }
    children.splice(insertAt, 0, created);
    return created;
}

/**
 * @param field - `a:fld`.
 * @returns True for datetime and slide-number fields.
 */
function isDateOrSlideField(field: OoxmlElement): boolean {
    const type: string | undefined = getAttr(field, '', 'type');
    return type !== undefined && (type.indexOf('datetime') === 0 || type === 'slidenum');
}

/**
 * @param carrier - `a:r` or `a:fld`.
 * @returns Its `a:t`, created when missing (`CT_TextField` allows an omitted `t`).
 */
function ensureTextElement(carrier: OoxmlElement): OoxmlElement {
    const existing: OoxmlElement | undefined = findChild(carrier, DML_NS, 't');
    if (existing !== undefined) {
        return existing;
    }
    const text: OoxmlElement = element(DML_NS, 't', 'a', [], []);
    asMutable(carrier).children.push(text);
    return text;
}

/**
 * Empties `a:t` nodes after the one just written so the visible string is `value`.
 *
 * @param paragraph - Paragraph that owns the carriers.
 * @param written - The `a:t` that holds the new value.
 */
function clearLaterText(paragraph: OoxmlElement, written: OoxmlElement): void {
    let seen: boolean = false;
    const visit = (node: OoxmlElement): void => {
        for (let i: number = 0; i < node.children.length; i++) {
            const child: OoxmlElement | OoxmlText = node.children[i];
            if (child.kind !== 'element') {
                continue;
            }
            if (child === written) {
                seen = true;
                continue;
            }
            if (seen && child.namespaceUri === DML_NS && child.localName === 't') {
                asMutable(child).children = [textNode('')];
            }
            visit(child);
        }
    };
    visit(paragraph);
}

/**
 * @param shape - Placeholder shape.
 * @returns First `a:fld`, if any.
 */
function findField(shape: OoxmlElement): OoxmlElement | undefined {
    const txBody: OoxmlElement | undefined = findChild(shape, PML_NS, 'txBody');
    if (txBody === undefined) {
        return undefined;
    }
    const paragraph: OoxmlElement | undefined = findChild(txBody, DML_NS, 'p');
    if (paragraph === undefined) {
        return undefined;
    }
    return findChild(paragraph, DML_NS, 'fld');
}

/**
 * Writes a slide number as `a:fld/@type="slidenum"` with the given cached text.
 * An assigned string stays on this slide only; other slides keep their own field.
 *
 * @param shape - Slide-number placeholder.
 * @param value - Cached display text.
 */
/**
 * Copies master slide-number text onto a layout as an untyped field.
 * PowerPoint's master view shows that cached text; `type="slidenum"` draws `<#>`.
 *
 * @param shape - Layout slide-number placeholder.
 * @param value - Text copied from the master placeholder.
 */
function writeInheritedSlideNumber(shape: OoxmlElement, value: string): void {
    const txBody: OoxmlElement = ensureTxBody(shape);
    const paragraph: OoxmlElement = ensureParagraph(txBody);
    const field: OoxmlElement = element(DML_NS, 'fld', 'a', [
        attribute('id', newGuid()),
        attribute('type', '')
    ], [
        element(DML_NS, 'rPr', 'a', [], []),
        element(DML_NS, 't', 'a', [], [textNode(value)])
    ]);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    children.splice(0, 0, element(DML_NS, 'pPr', 'a', [], []));
    children.splice(1, 0, field);
}

function writeSlideNumber(shape: OoxmlElement, value: string): void {
    const txBody: OoxmlElement = ensureTxBody(shape);
    const paragraph: OoxmlElement = ensureParagraph(txBody);
    const existing: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'fld');
    if (existing !== undefined && getAttr(existing, '', 'type') === 'slidenum') {
        const text: OoxmlElement = ensureTextElement(existing);
        asMutable(text).children = [textNode(value)];
        return;
    }
    const run: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'r');
    const field: OoxmlElement = element(DML_NS, 'fld', 'a', [
        attribute('id', newGuid()),
        attribute('type', 'slidenum')
    ], [
        element(DML_NS, 'rPr', 'a', [attribute('lang', 'en-US'), attribute('smtClean', '0')], []),
        element(DML_NS, 't', 'a', [], [textNode(value)])
    ]);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    if (run !== undefined) {
        children.splice(children.indexOf(run), 1, field);
    }
    else if (existing !== undefined) {
        children.splice(children.indexOf(existing), 1, field);
    }
    else {
        let insertAt: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = children[i];
            if (child.kind === 'element' && child.localName === 'endParaRPr') {
                insertAt = i;
                break;
            }
        }
        children.splice(insertAt, 0, field);
    }
}

/**
 * Ensures a date `a:fld` with the given `@type` and formatted display text.
 *
 * @param shape - Date placeholder.
 * @param token - `datetimeN`.
 * @param display - Formatted current date written as the cached `a:t`.
 */
function ensureDateField(shape: OoxmlElement, token: string, display: string): void {
    const txBody: OoxmlElement = ensureTxBody(shape);
    const paragraph: OoxmlElement = ensureParagraph(txBody);
    const existing: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'fld');
    if (existing !== undefined) {
        setAttr(existing, 'type', token);
        if (getAttr(existing, '', 'id') === undefined) {
            setAttr(existing, 'id', newGuid());
        }
        const text: OoxmlElement = ensureTextElement(existing);
        asMutable(text).children = [textNode(display)];
        return;
    }
    const run: OoxmlElement | undefined = findChild(paragraph, DML_NS, 'r');
    const rPr: OoxmlElement | undefined = run === undefined ? undefined : findChild(run, DML_NS, 'rPr');
    const fieldChildren: Array<OoxmlElement | OoxmlText> = [];
    if (rPr !== undefined) {
        fieldChildren.push(rPr);
    }
    else {
        fieldChildren.push(element(DML_NS, 'rPr', 'a', [attribute('lang', 'en-US'), attribute('smtClean', '0')], []));
    }
    fieldChildren.push(element(DML_NS, 't', 'a', [], [textNode(display)]));

    const field: OoxmlElement = element(DML_NS, 'fld', 'a', [
        attribute('id', newGuid()),
        attribute('type', token)
    ], fieldChildren);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    if (run !== undefined) {
        const index: number = children.indexOf(run);
        children.splice(index, 1, field);
    }
    else {
        const first: OoxmlElement | OoxmlText | undefined = children[0];
        const afterPPr: number = first !== undefined && first.kind === 'element' && first.localName === 'pPr' ? 1 : 0;
        children.splice(afterPPr, 0, field);
    }
}

/**
 * Replaces a date `a:fld` with an `a:r` carrying the same cached text.
 *
 * @param shape - Date placeholder.
 */
/**
 * Drops date field and run text so PowerPoint shows the empty Date box.
 *
 * @param shape - Date placeholder.
 */
function clearPlaceholderText(shape: OoxmlElement): void {
    const txBody: OoxmlElement | undefined = findChild(shape, PML_NS, 'txBody');
    const paragraph: OoxmlElement | undefined = txBody === undefined ? undefined : findChild(txBody, DML_NS, 'p');
    if (paragraph === undefined) {
        return;
    }
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    for (let i: number = children.length - 1; i >= 0; i--) {
        const child: OoxmlElement | OoxmlText = children[i];
        if (child.kind === 'element' && (child.localName === 'fld' || child.localName === 'r')) {
            children.splice(i, 1);
        }
    }
}

function convertFieldToRun(shape: OoxmlElement): void {
    const field: OoxmlElement | undefined = findField(shape);
    if (field === undefined || !isDateOrSlideField(field)) {
        return;
    }
    const txBody: OoxmlElement | undefined = findChild(shape, PML_NS, 'txBody');
    if (txBody === undefined) {
        return;
    }
    const paragraph: OoxmlElement | undefined = findChild(txBody, DML_NS, 'p');
    if (paragraph === undefined) {
        return;
    }
    const rPr: OoxmlElement | undefined = findChild(field, DML_NS, 'rPr');
    const runChildren: Array<OoxmlElement | OoxmlText> = [];
    if (rPr !== undefined) {
        runChildren.push(rPr);
    }
    runChildren.push(element(DML_NS, 't', 'a', [], [textNode(textOf(field))]));

    const run: OoxmlElement = element(DML_NS, 'r', 'a', [], runChildren);
    const children: Array<OoxmlElement | OoxmlText> = asMutable(paragraph).children;
    const index: number = children.indexOf(field);
    if (index >= 0) {
        children.splice(index, 1, run);
    }
}

/**
 * @param shape - Placeholder shape.
 * @returns `p:txBody`, created when the loaded shape has none.
 */
function ensureTxBody(shape: OoxmlElement): OoxmlElement {
    const existing: OoxmlElement | undefined = findChild(shape, PML_NS, 'txBody');
    if (existing !== undefined) {
        return existing;
    }
    const txBody: OoxmlElement = element(PML_NS, 'txBody', 'p', [], [
        element(DML_NS, 'bodyPr', 'a', [], []),
        element(DML_NS, 'p', 'a', [], [])
    ]);
    asMutable(shape).children.push(txBody);
    return txBody;
}

/**
 * @param txBody - Text body.
 * @returns First `a:p`, created when absent (`CT_TextBody` requires one).
 */
function ensureParagraph(txBody: OoxmlElement): OoxmlElement {
    const existing: OoxmlElement | undefined = findChild(txBody, DML_NS, 'p');
    if (existing !== undefined) {
        return existing;
    }
    const paragraph: OoxmlElement = element(DML_NS, 'p', 'a', [], []);
    asMutable(txBody).children.push(paragraph);
    return paragraph;
}

/**
 * @param carrier - Element that may contain `a:t`.
 * @returns Direct `a:t` text.
 */
function textOf(carrier: OoxmlElement): string {
    const text: OoxmlElement | undefined = findChild(carrier, DML_NS, 't');
    if (text === undefined) {
        return '';
    }
    let out: string = '';
    for (let i: number = 0; i < text.children.length; i++) {
        const child: OoxmlElement | OoxmlText = text.children[i];
        if (child.kind === 'text') {
            out += child.text;
        }
    }
    return out;
}

/**
 * @param el - Element to update.
 * @param name - Un-namespaced attribute.
 * @param value - New value.
 */
function setAttr(el: OoxmlElement, name: string, value: string): void {
    const attrs: OoxmlAttribute[] = asMutable(el).attributes as OoxmlAttribute[];
    for (let i: number = 0; i < attrs.length; i++) {
        if (attrs[i].localName === name && attrs[i].namespaceUri === '') {
            attrs[i] = { namespaceUri: '', localName: name, value };
            return;
        }
    }
    attrs.push({ namespaceUri: '', localName: name, value });
}

/**
 * @returns A braced GUID for `a:fld/@id` (`ST_Guid`).
 */
function newGuid(): string {
    const bytes: Uint8Array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues !== undefined) {
        crypto.getRandomValues(bytes);
    }
    else {
        for (let i: number = 0; i < bytes.length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex: string[] = [];
    for (let i: number = 0; i < bytes.length; i++) {
        hex.push((bytes[i] + 0x100).toString(16).substring(1));
    }
    return '{' + hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' +
        hex.slice(6, 8).join('') + '-' + hex.slice(8, 10).join('') + '-' + hex.slice(10).join('') + '}';
}

/**
 * @param namespaceUri - Element namespace.
 * @param localName - Local name.
 * @param prefixHint - Serialization prefix.
 * @param attributes - Attributes.
 * @param children - Children.
 * @returns An element node.
 */
function element(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
                 children: ReadonlyArray<OoxmlElement | OoxmlText>): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefixHint,
        attributes: attributes.slice(),
        children: children.slice()
    };
}

/**
 * @param localName - Attribute name.
 * @param value - Attribute value.
 * @returns An un-namespaced attribute.
 */
/**
 * @param value - Character data. Empty string is still a text node — `undefined` breaks serialization.
 * @returns A text node.
 */
function textNode(value: string): OoxmlText {
    return { kind: 'text', text: value };
}

function attribute(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}

const WEEKDAYS: ReadonlyArray<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS: ReadonlyArray<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT: ReadonlyArray<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * en-US rendering of a PowerPoint Header and Footer date format.
 * Used both as the API value and as the cached `a:t` PowerPoint shows before refresh.
 *
 * @param format - Dialog format other than `None`.
 * @param date - Clock value.
 * @returns Display string.
 */
function formatDate(format: DateTimeFormatType, date: Date): string {
    const weekday: string = WEEKDAYS[date.getDay()];
    const month: string = MONTHS[date.getMonth()];
    const monthShort: string = MONTHS_SHORT[date.getMonth()];
    const day: number = date.getDate();
    const year: number = date.getFullYear();
    const yy: string = String(year).slice(-2);
    const hour24: number = date.getHours();
    const minute: string = pad2(date.getMinutes());
    const second: string = pad2(date.getSeconds());
    const hour12: number = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const ampm: string = hour24 < 12 ? 'AM' : 'PM';
    const monthNumber: string = String(date.getMonth() + 1);
    const dayText: string = String(day);
    if (format === DateTimeFormatType.DateTimeddddMMMMddyyyy) {
        return weekday + ', ' + month + ' ' + dayText + ', ' + String(year);
    }
    if (format === DateTimeFormatType.DateTimedMMMMyyyy) {
        return dayText + ' ' + month + ' ' + String(year);
    }
    if (format === DateTimeFormatType.DateTimedMMMyy) {
        return dayText + '-' + monthShort + '-' + yy;
    }
    if (format === DateTimeFormatType.DateTimeHmm) {
        return String(hour24) + ':' + minute;
    }
    if (format === DateTimeFormatType.DateTimehmmAMPM) {
        return String(hour12) + ':' + minute + ' ' + ampm;
    }
    if (format === DateTimeFormatType.DateTimeHmmss) {
        return String(hour24) + ':' + minute + ':' + second;
    }
    if (format === DateTimeFormatType.DateTimehmmssAMPM) {
        return String(hour12) + ':' + minute + ':' + second + ' ' + ampm;
    }
    if (format === DateTimeFormatType.DateTimeMdyy) {
        return monthNumber + '/' + dayText + '/' + String(year);
    }
    if (format === DateTimeFormatType.DateTimeMMddyyhmmAMPM) {
        return monthNumber + '/' + dayText + '/' + String(year) + ' ' + String(hour12) + ':' + minute + ' ' + ampm;
    }
    if (format === DateTimeFormatType.DateTimeMMddyyhmmssAMPM) {
        return monthNumber + '/' + dayText + '/' + String(year) + ' ' + String(hour12) + ':' + minute + ':' + second + ' ' + ampm;
    }
    if (format === DateTimeFormatType.DateTimeMMMMdyyyy) {
        return month + ' ' + dayText + ', ' + String(year);
    }
    if (format === DateTimeFormatType.DateTimeMMMMyy) {
        return month + ' ' + yy;
    }
    if (format === DateTimeFormatType.DateTimeMMMyy) {
        return monthShort + '-' + yy;
    }
    return '';
}

/**
 * @param value - Number to pad.
 * @returns Two-digit string.
 */
function pad2(value: number): string {
    return value < 10 ? '0' + String(value) : String(value);
}
