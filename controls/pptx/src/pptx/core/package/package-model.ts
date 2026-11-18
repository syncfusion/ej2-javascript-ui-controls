/**
 * In-memory OPC package model for presentation packages.
 */
import { SecurityLimits } from '../security/limits';
import { ContentTypesModel } from './content-types';
import { PackageRelationship } from './relationships';
/** A single package part with content type and raw bytes. */
export interface PackagePart {
    /** Absolute OPC part URI (`/ppt/…`). */
    readonly name: string;
    /** Content type from `[Content_Types].xml` (Override or Default). */
    readonly contentType: string;
    /** Uncompressed part octets. */
    readonly data: Uint8Array;
}
/**
 * Mutable package held by {@link Presentation}.
 *
 * @remarks
 * Unknown parts remain opaque bytes. Relationship collections are preserved on
 * no-op save unless a higher layer mutates them.
 */
export interface OpcPackage {
    /** All parts except the synthetic content-types stream itself. */
    readonly parts: Map<string, PackagePart>;
    /** Parsed content-types model (re-serialized on save). */
    contentTypes: ContentTypesModel;
    /** Package-level relationships from `/_rels/.rels`. */
    packageRelationships: PackageRelationship[];
    /**
     * Part-level relationships keyed by the **source** part absolute URI
     * (not the `.rels` part name).
     */
    readonly partRelationships: Map<string, PackageRelationship[]>;
    /** Absolute URI of the presentation main part. */
    presentationPartName: string;
    /** Effective security limits used for this open. */
    readonly limits: SecurityLimits;
}
