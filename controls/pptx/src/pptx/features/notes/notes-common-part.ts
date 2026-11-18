/** Native notes/notes-master/handout-master source ownership; no ordinary-slide facade. */
import { PackagePartAccess } from '../../core/package/package-part-access';
import { PackagePart } from '../../core/package/package-model';
import { InvalidPackageError, PackageLimitError } from '../../core/security/errors';
import { parseXml, serializeXmlDocument, OoxmlElement } from '../../core/xml/index';
import { walkSlideShapeTree } from '../../core/shapes/walk';
import { Shape } from '../../core/shapes/shape';
import { bindShapeCollection, ShapeCollection } from '../../core/shapes/shape-collection';
import { addTextBoxToSlide, AddTextBoxOptions, ShapeBounds } from '../../core/shapes/add-text-box';
import { addShapeToSlide, AddShapeOptions } from '../../core/shapes/add-shape';
import { AutoShapeTypeValue } from '../../core/shapes/auto-shape-type';
import { removeShapeFromSlide } from '../../core/shapes/remove-shape';
import { addPictureToSlide, AddPictureOptions } from '../../core/pictures/add-picture';
import { Picture } from '../../core/pictures/picture';
import { removePictureFromSlide } from '../../core/pictures/remove-picture';
import { PictureMediaAccess, PictureMediaWriteAccess } from '../../core/pictures/media-access';
import { PackageRelationship } from '../../core/package/relationships';
import { SecurityLimits } from '../../core/security/limits';
import { DirectSlideBackground, readDirectBackground } from '../../core/presentation/background';
import { writeGradientBackground, writeSolidBackground, writeNoFillBackground, writeBackgroundReference,
    clearBackgroundOverride, editBackgroundGradient } from '../../core/presentation/write-background';
import { GradientFillOptions } from '../../core/shapes/gradient-fill-options';
import { GradientStopEditor } from '../../core/shapes/gradient-stop-editor';
import { ColorValue } from '../../core/theme/color-value';
import { officeRootNamespace } from '../../core/xml/office-dialect';
import { PML_NS } from '../../core/presentation/constants';
import { NotesError } from './errors';
/** Native common-slide family with direct authoring and immediate guarded part publication. @internal */
export class NotesCommonPart {
    /** Absolute source part identity; unrelated parts and relationships are never rewritten. */
    readonly partName: string;
    protected readonly access: PackagePartAccess;
    private readonly rootName: 'notes' | 'notesMaster' | 'handoutMaster';
    private readonly contentType: string;
    private readonly autoPersist: boolean;
    private root: OoxmlElement | undefined;
    private sourceXml: string | undefined;
    /** @param {string} partName - Actual source part.
     * @param {PackagePartAccess} access - Owning package access.
     * @param {string} rootName - Native notes/master root family.
     * @param {string} contentType - Required source MIME identity.
     * @param {boolean} autoPersist - Canonical shape/text writes publish immediately when explicitly enabled. */
    constructor(partName: string, access: PackagePartAccess, rootName: 'notes' | 'notesMaster' | 'handoutMaster',
                contentType: string, autoPersist: boolean = true) {
        this.partName = partName; this.access = access; this.rootName = rootName;
        this.contentType = contentType; this.autoPersist = autoPersist;
    }
    /** @returns {OoxmlElement} Native source root; advanced XML changes require flush. */
    getRoot(): OoxmlElement { return this.ensureParsed(); }
    /**
     * Shape handles under this part's `p:spTree`, with slide-equivalent create/remove.
     *
     * @remarks
     * Supports {@link ShapeCollection.addTextBox}, {@link ShapeCollection.addShape},
     * {@link ShapeCollection.addPicture}, {@link ShapeCollection.removePicture}, and
     * {@link ShapeCollection.remove}. New drawing element ids are allocated on this
     * part only and existing `cNvPr/@id` values are never renumbered. Picture insert
     * embeds a new `/ppt/media/` part and an Internal image relationship on this
     * notes part; it never writes `r:link` and never fetches. Placeholder shapes
     * (`p:ph`, including notes `body` and `sldImg`) cannot be removed.
     * With auto-persist, successful mutations publish this part immediately.
     * Citation: Transitional `pml.xsd` `CT_CommonSlideData` / `CT_NotesSlide`;
     * `docs/ooxml-mapping/notes.md`.
     * @throws {Error} When `shapesPerSlide` or `groupNestingDepth` is exceeded, or
     *   when picture write access is missing.
     * @returns {ShapeCollection} The result.
     */
    get shapes(): ShapeCollection {
        const root: OoxmlElement = this.ensureParsed();
        const media: PictureMediaAccess = this.pictureMediaAccess();
        const onMutate: () => void = (): void => {
            this.assertCurrent(root);
            if (this.autoPersist) {
                this.flush();
            }
        };
        return bindShapeCollection(() => walkSlideShapeTree(root, this.access.limits, this.partName, media, onMutate), {
            addTextBox: (options?: AddTextBoxOptions): Shape => {
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media?: PictureMediaAccess;
                    options?: AddTextBoxOptions;
                    onMutate?: () => void;
                } = {
                    root,
                    limits: this.access.limits,
                    partName: this.partName,
                    media,
                    onMutate
                };
                if (options !== undefined) {
                    args.options = options;
                }
                return addTextBoxToSlide(args);
            },
            addShape: (type: AutoShapeTypeValue, bounds: ShapeBounds, options?: AddShapeOptions): Shape => {
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media?: PictureMediaAccess;
                    type: AutoShapeTypeValue;
                    bounds: ShapeBounds;
                    options?: AddShapeOptions;
                    onMutate?: () => void;
                } = {
                    root,
                    limits: this.access.limits,
                    partName: this.partName,
                    media,
                    type,
                    bounds,
                    onMutate
                };
                if (options !== undefined) {
                    args.options = options;
                }
                return addShapeToSlide(args);
            },
            addPicture: (options: AddPictureOptions): Picture => {
                if (media.write === undefined) {
                    throw new InvalidPackageError('Picture insert requires package write access on the notes part',
                                                  { partName: this.partName });
                }
                return addPictureToSlide({
                    root,
                    limits: this.access.limits,
                    partName: this.partName,
                    media,
                    options,
                    onMutate
                });
            },
            removePicture: (picture: Picture): void => {
                if (media.write === undefined) {
                    throw new InvalidPackageError('Picture remove requires package write access on the notes part',
                                                  { partName: this.partName });
                }
                removePictureFromSlide({
                    root,
                    partName: this.partName,
                    media,
                    picture,
                    onMutate
                });
            },
            remove: (shape: Shape): void => {
                removeShapeFromSlide({
                    root,
                    partName: this.partName,
                    shape,
                    media,
                    onMutate
                });
            }
        });
    }
    /**
     * Live media access for this notes part, backed by {@link PackagePartAccess}.
     *
     * @returns {PictureMediaAccess} Read/write surface used by picture insert and remove.
     */
    private pictureMediaAccess(): PictureMediaAccess {
        const access: PackagePartAccess = this.access;
        const partName: string = this.partName;
        const write: PictureMediaWriteAccess = {
            getPart: (name: string) => access.getPart(name),
            setPart: (part: PackagePart) => {
                access.setPart(part);
            },
            setSlideRelationships: (rels: ReadonlyArray<PackageRelationship>) => {
                access.replaceRelationships(partName, rels);
            },
            ensureContentTypeDefault: (extension: string, contentType: string) => {
                access.ensureContentTypeDefault(extension, contentType);
            },
            ensureContentTypeOverride: (name: string, contentType: string) => {
                access.ensureContentTypeOverride(name, contentType);
            },
            deletePart: (name: string) => {
                access.deletePart(name);
            },
            removeContentTypeOverride: (name: string) => {
                access.removeContentTypeOverride(name);
            },
            iterateAllRelationships: () => access.iterateAllRelationships(),
            iterateParts: () => access.iterateParts(),
            partCount: () => access.partCount()
        };
        return {
            getSlideRelationships: () => access.getRelationships(partName),
            getPart: (name: string) => access.getPart(name),
            write
        };
    }
    /** @returns {DirectSlideBackground} Direct background; missing and theme references remain distinct from inherited appearance. */
    get background(): DirectSlideBackground { return readDirectBackground(this.ensureParsed(), undefined); }
    /** @param {GradientFillOptions} options - Authored positions/colors/geometry; scheme colors remain symbolic.
     * @returns {void} Writes only this native part's direct background after validation. */
    setGradientBackground(options: GradientFillOptions): void {
        const root: OoxmlElement = this.ensureParsed();
        if (writeGradientBackground(root, options, this.partName)) { this.flush(); }
    }
    /** @param {ColorValue} color - Direct color choice, never resolved RGB.
     * @returns {void} Replaces only this native background paint. */
    setSolidBackground(color: ColorValue): void {
        if (writeSolidBackground(this.ensureParsed(), color, this.partName)) { this.flush(); }
    }
    /** @returns {void} Authors explicit noFill; clearBackground restores missing/inherited state. */
    setNoFillBackground(): void { if (writeNoFillBackground(this.ensureParsed(), this.partName)) { this.flush(); } }
    /** @param {number} index - Authored unsigned theme background-matrix reference.
     * @param {ColorValue} color - Authored placeholder-color binding.
     * @returns {void} Replaces the local background choice without editing a shared theme. */
    setBackgroundReference(index: number, color: ColorValue): void {
        if (writeBackgroundReference(this.ensureParsed(), index, color, this.partName)) { this.flush(); }
    }
    /** @returns {void} Removes the direct background override only. */
    clearBackground(): void { if (clearBackgroundOverride(this.ensureParsed(), this.partName)) { this.flush(); } }
    /** @returns {GradientStopEditor} Bound selective editor for an existing direct gradient; dispose after use. */
    editGradientBackground(): GradientStopEditor {
        const root: OoxmlElement = this.ensureParsed();
        return editBackgroundGradient((): OoxmlElement => { this.assertCurrent(root); return root; }, this.partName,
                                      (): void => { this.assertCurrent(root); this.flush(); });
    }
    /**
     * Publishes advanced XML changes or canonical mutations to this part only.
     *
     * @remarks Invalid size/XML leaves package bytes unchanged and discards the cached tree.
     * Discard previously held shape/text handles after a rejected publication.
     * @returns {void} Writes one validated source part; no associations or shared parts change.
     */
    flush(): void {
        const root: OoxmlElement = this.root || this.ensureParsed(); this.assertCurrent(root);
        try {
            if (root.localName !== this.rootName || !officeRootNamespace(root.namespaceUri, PML_NS)) {
                throw new InvalidPackageError('Notes source root family cannot be changed during publication', { partName: this.partName });
            }
            const xml: string = serializeXmlDocument(root); const bytes: Uint8Array = new TextEncoder().encode(xml);
            if (bytes.byteLength > this.access.limits.singlePartUncompressedBytes) {
                throw new PackageLimitError('singlePartUncompressedBytes', { partName: this.partName, actual: bytes.byteLength });
            }
            parseXml(xml, { limits: this.access.limits, partName: this.partName });
            this.access.setPart({ name: this.partName, contentType: this.contentType, data: bytes }); this.sourceXml = xml;
        } catch (error) { this.root = undefined; this.sourceXml = undefined; throw error; }
    }
    /** @returns {OoxmlElement} Current native root, loaded under actual package limits. */
    protected ensureParsed(): OoxmlElement {
        const part: PackagePart | undefined = this.access.getPart(this.partName);
        if (!part || part.contentType !== this.contentType) {
            throw new InvalidPackageError('Notes source part is missing or has an incompatible content type', { partName: this.partName });
        }
        const xml: string = new TextDecoder('utf-8').decode(part.data);
        if (this.root && xml === this.sourceXml) { return this.root; }
        const root: OoxmlElement = parseXml(xml, { limits: this.access.limits, partName: this.partName });
        if (root.localName !== this.rootName || !officeRootNamespace(root.namespaceUri, PML_NS)) {
            throw new InvalidPackageError('Notes source root must be p:' + this.rootName + ' in the PresentationML namespace',
                                          { partName: this.partName });
        }
        this.root = root; this.sourceXml = xml; return root;
    }
    /** @param {OoxmlElement} root - Previously captured native source identity.
     * @returns {void} Rejects detached handles or externally replaced source before publication. */
    private assertCurrent(root: OoxmlElement): void {
        const part: PackagePart | undefined = this.access.getPart(this.partName);
        if (this.root !== root || !part || part.contentType !== this.contentType ||
            new TextDecoder('utf-8').decode(part.data) !== this.sourceXml) {
            throw new NotesError('Notes source handle is stale; reacquire the native part/shape', { partName: this.partName });
        }
    }
}
