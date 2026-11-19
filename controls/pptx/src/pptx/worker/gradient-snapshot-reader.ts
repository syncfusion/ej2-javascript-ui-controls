import { GradientSlidePaintSnapshot, resolveGradientSlidePaint } from './gradient-slide-paint';
import { GradientHostPartBindings } from './gradient-host-bindings';
import { arrayAt } from '../core/util/es5-compat';
import { Presentation } from '../core/package/presentation';
import { PackagePartAccess } from '../core/package/package-part-access';
import { PackagePart } from '../core/package/package-model';
import { PackageRelationship } from '../core/package/relationships';
import { InvalidPackageError } from '../core/security/errors';
import { Slide } from '../core/slideimplementation/slide';
import { GradientPartSnapshot, readGradientPartSnapshot } from './gradient-transport';
/** Bounded library-owned source snapshots for the browser's main-thread fallback. @public */
export class GradientSnapshotReader {
    private document: Presentation | undefined;
    private readonly cache: Map<string, { readonly bytes: Uint8Array; readonly snapshot: GradientPartSnapshot }> = new Map();
    /**
     * @param {Presentation} document - Existing package owner; no package or XML model is duplicated.
     */
    constructor(document: Presentation) { this.document = document; }
    /**
     * Reads canonical presentation/theme or slide/layout/master source context.
     *
     * @param {number} index - Optional slide index; omission reads presentation/theme context.
     * @returns {ReadonlyArray<GradientPartSnapshot>} Complete authored sidecars, never resolved paint defaults.
     * @throws {InvalidPackageError} When disposed or the requested slide is unavailable.
     */
    public read(index?: number): ReadonlyArray<GradientPartSnapshot> {
        const document: Presentation | undefined = this.document;
        if (document === undefined) { throw new InvalidPackageError('Gradient snapshot reader is closed'); }
        const access: PackagePartAccess = document.packagePartAccess();
        const names: Set<string> = new Set([document.presentationPartName]);
        if (document.theme !== undefined) { names.add(document.theme.partName); }
        /**
         * @param {string} source - Existing relationship owner.
         * @param {ReadonlyArray<string>} kinds - Exact standard relationship suffixes to include.
         * @returns {string[]} Available internal targets, without requiring model layout getters.
         */
        const addTargets: (source: string, kinds: ReadonlyArray<string>) => string[] =
            (source: string, kinds: ReadonlyArray<string>): string[] => {
                const targets: string[] = [];
                access.getRelationships(source).forEach((relationship: PackageRelationship): void => {
                    if (relationship.targetMode === 'External' || relationship.targetPartName === undefined) { return; }
                    const type: string = relationship.type;
                    const prefix: string = type.indexOf('http://schemas.openxmlformats.org/officeDocument/2006/relationships/') === 0 ?
                        'http://schemas.openxmlformats.org/officeDocument/2006/relationships/' :
                        'http://purl.oclc.org/ooxml/officeDocument/relationships/';
                    if (type.indexOf(prefix) === 0 && kinds.indexOf(type.slice(prefix.length)) >= 0 &&
                        access.getPart(relationship.targetPartName) !== undefined) {
                        names.add(relationship.targetPartName); targets.push(relationship.targetPartName);
                    }
                });
                return targets;
            };
        if (index !== undefined) {
            const slide: Slide | undefined = arrayAt(document.slides, index);
            if (!Number.isInteger(index) || index < 0 || slide === undefined) {
                throw new InvalidPackageError('Gradient snapshot slide index is unavailable');
            }
            names.add(slide.partName);
            addTargets(slide.partName, ['slideLayout']).forEach((layout: string): void => {
                addTargets(layout, ['slideMaster']);
            });
        }
        Array.from(names).forEach((name: string): void => { addTargets(name, ['theme', 'themeOverride', 'tableStyles']); });
        const result: GradientPartSnapshot[] = [];
        names.forEach((name: string): void => {
            const part: PackagePart | undefined = access.getPart(name);
            if (part === undefined) { return; }
            let cached: { readonly bytes: Uint8Array; readonly snapshot: GradientPartSnapshot } | undefined = this.cache.get(name);
            if (cached === undefined || cached.bytes !== part.data) {
                cached = { bytes: part.data, snapshot: readGradientPartSnapshot(new TextDecoder('utf-8').decode(part.data), name, access.limits) };
            }
            this.cache.delete(name); this.cache.set(name, cached);
            if (this.cache.size > 4) {
                const oldest: string | undefined = this.cache.keys().next().value;
                if (oldest !== undefined) { this.cache.delete(oldest); }
            }
            const snapshot: GradientPartSnapshot = cached.snapshot;
            if (snapshot.hostBindings !== undefined || snapshot.records.length > 0 ||
                (snapshot.references !== undefined && snapshot.references.length > 0) ||
                (snapshot.characters !== undefined && snapshot.characters.length > 0) ||
                snapshot.textFills !== undefined || snapshot.textStyles !== undefined ||
                (snapshot.groupFills !== undefined && snapshot.groupFills.length > 0) ||
                (snapshot.tableFills !== undefined && snapshot.tableFills.length > 0) ||
                (snapshot.tableStyles !== undefined && snapshot.tableStyles.length > 0)) { result.push(snapshot); }
        });
        return result;
    }
    /**
     * Reads sources and effective paint atomically using actual internal relationship roles.
     *
     * @param {number} index - Existing slide index.
     * @returns {*} Separate authored source parts and effective clone-safe paint.
     * @throws {InvalidPackageError} When context is ambiguous,missing or disposed.
     */
    public readSlide(index: number): { readonly parts: ReadonlyArray<GradientPartSnapshot>; readonly paint: GradientSlidePaintSnapshot; } {
        const parts: ReadonlyArray<GradientPartSnapshot> = this.read(index);
        const document: Presentation | undefined = this.document;
        if (document === undefined) { throw new InvalidPackageError('Gradient snapshot reader is closed'); }
        const slide: Slide | undefined = arrayAt(document.slides, index);
        if (slide === undefined) { throw new InvalidPackageError('Gradient snapshot slide is unavailable'); }
        const access: PackagePartAccess = document.packagePartAccess();
        /**
         * @param {string} owner - Actual relationship owner.
         * @param {string} kind - Standard relationship suffix.
         * @returns {string | undefined} Unique available internal target.
         */
        const target: (owner: string | undefined, kind: string) => string | undefined =
            (owner: string | undefined, kind: string): string | undefined => {
                if (owner === undefined) { return undefined; }
                const matches: PackageRelationship[] = access.getRelationships(owner).filter((r: PackageRelationship): boolean =>
                    r.targetMode !== 'External' && r.targetPartName !== undefined && access.getPart(r.targetPartName) !== undefined &&
                    (r.type === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/' + kind ||
                    r.type === 'http://purl.oclc.org/ooxml/officeDocument/relationships/' + kind));
                if (matches.length > 1) { throw new InvalidPackageError('Ambiguous gradient relationship context'); }
                return matches.length ? matches[0].targetPartName : undefined;
            };
        /**
         * @param {string} name - Actual selected source name.
         * @returns {GradientHostPartBindings | undefined} Captured canonical source DTO.
         */
        const binding: (name: string | undefined) => GradientHostPartBindings | undefined =
            (name: string | undefined): GradientHostPartBindings | undefined => {
                const part: GradientPartSnapshot | undefined = parts.filter((p: GradientPartSnapshot): boolean => p.partName === name)[0];
                return part === undefined ? undefined : part.hostBindings;
            };
        const source: GradientHostPartBindings | undefined = binding(slide.partName);
        if (source === undefined) { throw new InvalidPackageError('Canonical gradient slide context is unavailable'); }
        const layout: string | undefined = target(slide.partName, 'slideLayout');
        const master: string | undefined = target(layout, 'slideMaster');
        const theme: string | undefined = target(master, 'theme') ||
            (document.theme === undefined ? undefined : document.theme.partName);
        const overrides: GradientHostPartBindings[] = [];
        [master, layout, slide.partName].forEach((owner: string | undefined): void => {
            const part: GradientHostPartBindings | undefined = binding(target(owner, 'themeOverride'));
            if (part !== undefined) { overrides.push(part); }
        });
        return { parts, paint: resolveGradientSlidePaint({ slide: source, layout: binding(layout), master: binding(master),
            theme: binding(theme), overrides,
            tableParts: parts.filter((part: GradientPartSnapshot): boolean =>
                [slide.partName, layout, master].indexOf(part.partName) >= 0 && part.tableFills !== undefined && part.tableFills.length > 0)
                .map((part: GradientPartSnapshot): import('./table-gradient-paint').TablePaintPart =>
                    ({ partName: part.partName, bindings: part.tableFills || [] })),
            tableStyles: parts.reduce((all: import('./table-fill-bindings').TableStyleFillSnapshot[], part: GradientPartSnapshot):
            import('./table-fill-bindings').TableStyleFillSnapshot[] => all.concat(part.tableStyles || []), []) }) };
    }
    /**
     * Releases source/package references.
     *
     * @returns {void} Nothing.
     */
    public close(): void { this.cache.clear(); this.document = undefined; }
}
