import { GradientGeometryPatch, patchGradientGeometry } from './gradient-geometry';
import { serializeXml, OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { asMutable, findChild, getAttr } from './dom-utils';
import { ColorValue } from '../theme/color-value';
import { AuthoredGradientStop, AuthoredGradientFill } from '../theme/gradient-types';
import { GradientDialect, parseGradientPercentage, serializeGradientPercentage, serializeGradientAngle, parseGradientAngle } from '../theme/gradient-values';
import { readAuthoredGradient } from '../theme/read-gradient';
import { GradientColorOperation, GradientStopOptions } from './gradient-fill-options';
import { buildGradientFill, GradientFillError } from './write-gradient-fill';
import { arrayAt } from '../util/es5-compat';
/** Snapshot of one authored stop with an edit-session-only identity. @public */
export interface GradientEditableStop extends AuthoredGradientStop {
    /** Stable within this session, never written to document XML. */
    readonly id: string;
}
interface StopRecord { readonly id: string; readonly node: OoxmlElement; }
const COLORS: ReadonlyArray<string> = ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'];
/**
 * Selective editor for one existing direct gradient stop list.
 *
 * @remarks Acquire through a shape or background host. Replacement/reset makes the
 * session stale. Move edits position in place without sorting. Add requires an
 * explicit authored color and position; no implicit sampling or RGB flattening.
 * @public
 */
export class GradientStopEditor {
    private readonly locate: () => OoxmlElement | undefined;
    private readonly gradient: OoxmlElement;
    private readonly list: OoxmlElement;
    private readonly partName: string | undefined;
    private readonly onMutate: () => void;
    private readonly dialect: GradientDialect;
    private records: Map<OoxmlElement, StopRecord> = new Map<OoxmlElement, StopRecord>();
    private sequence: number = 0;
    private disposed: boolean = false;
    /**
     * Binds an internal host adapter; consumers acquire sessions from hosts.
     *
     * @internal
     * @param {Function} locate - Current direct gradient lookup.
     * @param {string | undefined} partName - Owning package part.
     * @param {Function} onMutate - Existing host callback.
     */
    constructor(locate: () => OoxmlElement | undefined, partName: string | undefined, onMutate: () => void) {
        this.locate = locate; this.partName = partName; this.onMutate = onMutate;
        const gradient: OoxmlElement | undefined = locate();
        if (gradient === undefined || readAuthoredGradient(gradient, partName) === undefined) {
            throw new GradientFillError(partName, 'fill.stops.session');
        }
        const list: OoxmlElement | undefined = findChild(gradient, gradient.namespaceUri, 'gsLst');
        if (list === undefined) { throw new GradientFillError(partName, 'fill.stops.list'); }
        this.gradient = gradient; this.list = list;
        this.dialect = gradient.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
        this.live();
    }
    /**
     * Snapshot of authored values in document order, including invalid/missing fields.
     *
     * @returns {ReadonlyArray<GradientEditableStop>} Clone-safe values and session IDs.
     * @throws Stale or disposed session.
     */
    get stops(): ReadonlyArray<GradientEditableStop> {
        const records: StopRecord[] = this.live();
        const authored: AuthoredGradientFill | undefined = readAuthoredGradient(this.gradient, this.partName);
        if (authored === undefined || authored.stops === undefined) { throw new GradientFillError(this.partName, 'fill.stops.list'); }
        return authored.stops.map((stop: AuthoredGradientStop, index: number): GradientEditableStop =>
            ({ ...stop, id: arrayAt(records, index).id }));
    }
    /** @returns {AuthoredGradientFill} Fresh authored gradient snapshot without mutable XML handles or resolved defaults. */
    get fill(): AuthoredGradientFill {
        this.live();
        const fill: AuthoredGradientFill | undefined = readAuthoredGradient(this.gradient, this.partName);
        if (!fill) { throw new GradientFillError(this.partName, 'fill.session'); } return fill;
    }
    /**
     * Selectively edits geometry without replacing stops, transforms or unrelated source metadata.
     *
     * @param {GradientGeometryPatch} patch - Omitted fields preserve source; null removes only the explicit authored field.
     * @returns {void} One host notification after complete validation, none for a semantic source no-op.
     * @throws Invalid, ambiguous, disposed or stale geometry; no partial source mutation.
     */
    setGeometry(patch: GradientGeometryPatch): void {
        this.live(); const candidate: OoxmlElement = patchGradientGeometry(this.gradient, patch, this.partName);
        if (serializeXml(candidate) === serializeXml(this.gradient)) { return; }
        asMutable(this.gradient).attributes = candidate.attributes;
        asMutable(this.gradient).children = candidate.children.slice(); this.onMutate();
    }
    /**
     * Changes only an existing linear angle, preserving all stop/unknown/geometry metadata.
     *
     * @param {number} angle - Clockwise degrees in [0,360).
     * @returns {void} One host mutation notification, none for a semantic no-op.
     * @throws Invalid angle, non-linear or stale gradient; no partial source mutation.
     */
    setLinearAngle(angle: number): void {
        this.live(); let token: string;
        try {
            if (typeof angle !== 'number') { throw new RangeError(); } token = serializeGradientAngle(angle);
        } catch (error) { throw new GradientFillError(this.partName, 'fill.shade.angle'); }
        const line: OoxmlElement | undefined = findChild(this.gradient, this.gradient.namespaceUri, 'lin');
        if (!line || findChild(this.gradient, this.gradient.namespaceUri, 'path')) {
            throw new GradientFillError(this.partName, 'fill.shade.linear');
        }
        const old: string | undefined = getAttr(line, '', 'ang');
        const parsed: ReturnType<typeof parseGradientAngle> = parseGradientAngle(old);
        if (old === token || (parsed.kind === 'value' && parsed.value === angle)) { return; }
        let present: boolean = false;
        const attributes: OoxmlAttribute[] = line.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => {
            if (attribute.namespaceUri !== '' || attribute.localName !== 'ang') { return attribute; }
            present = true; return { ...attribute, value: token };
        });
        if (!present) { attributes.push({ namespaceUri: '', localName: 'ang', value: token }); }
        asMutable(line).attributes = attributes; this.onMutate();
    }
    /**
     * Changes only pos; existing XML order, colors and transforms stay intact.
     *
     * @param {string} id - Live session identity.
     * @param {number} position - Normalized ratio in [0,1].
     * @returns {void} Mutates only when the authored value changes.
     * @throws Invalid identity/value or stale session.
     */
    moveStop(id: string, position: number): void {
        const record: StopRecord = this.require(id); let token: string;
        try {
            if (typeof position !== 'number') { throw new RangeError(); }
            token = serializeGradientPercentage(position, this.dialect, 'stop');
        } catch (error) { throw new GradientFillError(this.partName, 'fill.stops.position'); }
        const old: string | undefined = getAttr(record.node, '', 'pos');
        const parsed: ReturnType<typeof parseGradientPercentage> = parseGradientPercentage(old, this.dialect, 'stop');
        if (old === token || (parsed.kind === 'value' && parsed.value === position)) { return; }
        let present: boolean = false;
        const attributes: OoxmlAttribute[] = record.node.attributes.map((attr: OoxmlAttribute): OoxmlAttribute => {
            if (attr.namespaceUri !== '' || attr.localName !== 'pos') { return attr; }
            present = true; return { ...attr, value: token };
        });
        if (!present) { attributes.push({ namespaceUri: '', localName: 'pos', value: token }); }
        asMutable(record.node).attributes = attributes; this.onMutate();
    }
    /**
     * Adds an explicitly colored stop, appending by default or before a live ID.
     *
     * @param {GradientStopOptions} options - Complete new stop; position/color required.
     * @param {string} beforeId - Optional insertion target; equal positions are not deduplicated.
     * @returns {string} New stable session identity.
     * @throws Invalid input, insertion target or fewer than two resulting stops.
     */
    addStop(options: GradientStopOptions, beforeId?: string): string {
        const records: StopRecord[] = this.live();
        if (records.length < 1) { throw new GradientFillError(this.partName, 'fill.stops.minimum'); }
        const before: StopRecord | undefined = beforeId === undefined ? undefined : this.require(beforeId);
        const stop: OoxmlElement = this.validatedStop(options);
        const children: Array<OoxmlElement | OoxmlText> = this.list.children.slice();
        const at: number = before === undefined ? children.length : children.indexOf(before.node);
        children.splice(at, 0, stop);
        const record: StopRecord = { id: this.nextId(), node: stop };
        asMutable(this.list).children = children; this.records.set(stop, record); this.onMutate();
        return record.id;
    }
    /**
     * Removes one named stop subtree, including its unknown contents.
     *
     * @param {string} id - Live session identity.
     * @returns {void} Mutates when at least two stops remain.
     * @throws Invalid identity, stale session or two-stop boundary.
     */
    removeStop(id: string): void {
        const record: StopRecord = this.require(id);
        if (this.records.size <= 2) { throw new GradientFillError(this.partName, 'fill.stops.minimum'); }
        const children: Array<OoxmlElement | OoxmlText> = this.list.children.filter(
            (node: OoxmlElement | OoxmlText): boolean => node !== record.node);
        asMutable(this.list).children = children; this.records.delete(record.node); this.onMutate();
    }
    /**
     * Replaces the color choice, retaining existing transform/unknown children by default.
     *
     * @remarks Supplying transforms intentionally replaces all children of the old color choice.
     * Old color-choice attributes are intentionally replaced; other stop markup stays intact.
     * @param {string} id - Live session identity.
     * @param {ColorValue} color - Validated authored choice, retaining theme references.
     * @param {ReadonlyArray<GradientColorOperation>} transforms - Optional complete transform replacement; [] clears.
     * @returns {void} Commits after validation.
     * @throws Invalid input, identity or stale session.
     */
    setStopColor(id: string, color: ColorValue, transforms?: ReadonlyArray<GradientColorOperation>): void {
        const record: StopRecord = this.require(id);
        const stop: OoxmlElement = this.validatedStop({ position: 0, color, transforms });
        const replacement: OoxmlElement | undefined = this.color(stop);
        if (replacement === undefined) { throw new GradientFillError(this.partName, 'fill.stops.color'); }
        const old: OoxmlElement | undefined = this.color(record.node);
        const selected: OoxmlElement = transforms === undefined && old !== undefined ?
            { ...replacement, children: old.children, namespaceDeclarations: old.namespaceDeclarations } : replacement;
        const children: Array<OoxmlElement | OoxmlText> = record.node.children.filter((node: OoxmlElement | OoxmlText): boolean =>
            !(node.kind === 'element' && node.namespaceUri === this.gradient.namespaceUri && COLORS.indexOf(node.localName) >= 0));
        children.unshift(selected); asMutable(record.node).children = children; this.onMutate();
    }
    /**
     * Sets absolute stop opacity without replacing unrelated color transforms or source metadata.
     *
     * @param {string} id - Live stop identity in this editor session.
     * @param {number} opacity - Normalized opacity in [0,1]; UI transparency is 1 minus opacity.
     * @returns {void} Replaces only known alpha/alphaMod/alphaOff operations with one alpha operation.
     * @throws Invalid value, missing color, replaced/disposed session or unknown stop; no partial mutation.
     */
    setStopOpacity(id: string, opacity: number): void {
        const record: StopRecord = this.require(id);
        const choices: number = record.node.children.filter((node: OoxmlElement | OoxmlText): boolean =>
            node.kind === 'element' && node.namespaceUri === this.gradient.namespaceUri && COLORS.indexOf(node.localName) >= 0).length;
        if (choices !== 1) { throw new GradientFillError(this.partName, 'fill.stops.color'); }
        const snapshot: GradientEditableStop | undefined = this.stops.find((stop: GradientEditableStop): boolean => stop.id === id);
        const old: OoxmlElement | undefined = this.color(record.node);
        if (!snapshot || !snapshot.color || !old) { throw new GradientFillError(this.partName, 'fill.stops.color'); }
        const staged: OoxmlElement = this.validatedStop({ position: 0, color: snapshot.color,
            transforms: [{ kind: 'alpha', value: opacity }] });
        const color: OoxmlElement | undefined = this.color(staged);
        const alpha: OoxmlElement | undefined = color && findChild(color, this.gradient.namespaceUri, 'alpha');
        const token: string | undefined = alpha && getAttr(alpha, '', 'val');
        if (!alpha || token === undefined) { throw new GradientFillError(this.partName, 'fill.stops.opacity'); }
        const family: OoxmlElement[] = [];
        old.children.forEach((node: OoxmlElement | OoxmlText): void => {
            if (isAlphaOperation(node, this.gradient.namespaceUri)) { family.push(node); }
        });
        const first: OoxmlElement | undefined = family.length ? arrayAt(family, 0) : undefined;
        if (first && family.length === 1 && first.localName === 'alpha') {
            const raw: string | undefined = getAttr(first, '', 'val');
            const parsed: ReturnType<typeof parseGradientPercentage> = parseGradientPercentage(raw, this.dialect, 'stop');
            if (raw === token || (parsed.kind === 'value' && parsed.value === opacity)) { return; }
        }
        let hasValue: boolean = false;
        const attributes: OoxmlAttribute[] = first ? first.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => {
            if (attribute.namespaceUri !== '' || attribute.localName !== 'val') { return attribute; }
            hasValue = true; return { ...attribute, value: token };
        }) : [];
        if (!hasValue) { attributes.push({ namespaceUri: '', localName: 'val', value: token }); }
        const replacement: OoxmlElement = first ? { ...first, localName: 'alpha', attributes } : alpha;
        const children: Array<OoxmlElement | OoxmlText> = []; let inserted: boolean = false;
        old.children.forEach((node: OoxmlElement | OoxmlText): void => {
            if (isAlphaOperation(node, this.gradient.namespaceUri)) {
                if (!inserted) { children.push(replacement); inserted = true; }
            } else { children.push(node); }
        });
        if (!inserted) { children.push(replacement); }
        asMutable(old).children = children; this.onMutate();
    }
    /**
     * Releases session identities. Does not mutate XML or invoke callbacks.
     *
     * @returns {void} Session becomes unusable.
     */
    dispose(): void { this.disposed = true; this.records.clear(); }
    /**
     * @returns {StopRecord[]} Live records; synchronizes other sessions in linear time.
     */
    private live(): StopRecord[] {
        if (this.disposed || this.locate() !== this.gradient ||
            findChild(this.gradient, this.gradient.namespaceUri, 'gsLst') !== this.list) {
            throw new GradientFillError(this.partName, 'fill.stops.session');
        }
        const next: Map<OoxmlElement, StopRecord> = new Map<OoxmlElement, StopRecord>(); const records: StopRecord[] = [];
        this.list.children.forEach((node: OoxmlElement | OoxmlText): void => {
            if (node.kind !== 'element' || node.namespaceUri !== this.gradient.namespaceUri || node.localName !== 'gs') { return; }
            const record: StopRecord = this.records.get(node) || { id: this.nextId(), node };
            next.set(node, record); records.push(record);
        });
        this.records = next; return records;
    }
    /**
     * @param {string} id - Requested live identity.
     * @returns {StopRecord} Named live record.
     */
    private require(id: string): StopRecord {
        const records: StopRecord[] = this.live();
        const record: StopRecord | undefined = records.find((entry: StopRecord): boolean => entry.id === id);
        if (record === undefined) { throw new GradientFillError(this.partName, 'fill.stops.identity'); }
        return record;
    }
    /**
     * @returns {string} Monotonic, session-local identity.
     */
    private nextId(): string { this.sequence++; return 'stop-' + this.sequence; }
    /**
     * @param {GradientStopOptions} options - Complete stop input.
     * @returns {OoxmlElement} Detached stop validated through the shared authoring boundary.
     */
    private validatedStop(options: GradientStopOptions): OoxmlElement {
        const fill: OoxmlElement = buildGradientFill({ stops: [options, options] }, this.gradient.namespaceUri, this.partName);
        const list: OoxmlElement | undefined = findChild(fill, this.gradient.namespaceUri, 'gsLst');
        const stop: OoxmlElement | undefined = list === undefined ? undefined : findChild(list, this.gradient.namespaceUri, 'gs');
        if (stop === undefined) { throw new GradientFillError(this.partName, 'fill.stops.input'); }
        return stop;
    }
    /**
     * @param {OoxmlElement} stop - Direct stop node.
     * @returns {OoxmlElement | undefined} First recognized direct color choice.
     */
    private color(stop: OoxmlElement): OoxmlElement | undefined {
        for (let i: number = 0; i < stop.children.length; i++) {
            const node: OoxmlElement | OoxmlText = arrayAt(stop.children, i);
            if (node.kind === 'element' && node.namespaceUri === this.gradient.namespaceUri && COLORS.indexOf(node.localName) >= 0) { return node; }
        }
        return undefined;
    }
}

/**
 * @param {OoxmlElement | OoxmlText} node - Direct color child, including foreign opaque operations.
 * @param {string} ns - Owning DrawingML dialect.
 * @returns {boolean} Whether this is one of the three known alpha operations, never a foreign lookalike.
 */
function isAlphaOperation(node: OoxmlElement | OoxmlText, ns: string): node is OoxmlElement {
    return node.kind === 'element' && node.namespaceUri === ns &&
        (node.localName === 'alpha' || node.localName === 'alphaMod' || node.localName === 'alphaOff');
}
