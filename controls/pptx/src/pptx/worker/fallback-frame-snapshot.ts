/** Clone-safe fallback metadata for content not drawn natively in Phase 1. */

import { PictureRenderSnapshot } from './picture-render-snapshot';

/** Unsupported frame families represented by a preview or labelled placeholder. */
export type FallbackFrameKind = 'chart' | 'diagram' | 'ole' | 'media' | 'unknown';

/** Authored relationship identity retained separately from resolved preview data. */
export interface FallbackFrameDirectSnapshot {
    /** Relationship id of the native unsupported payload, when authored. */
    readonly contentRelationshipId?: string;
}

/** Resolved internal payload identity; payload bytes remain owned by the package. */
export interface FallbackFrameResolvedSnapshot {
    /** Absolute OPC part name for the native payload, when the relationship is internal. */
    readonly contentPartName?: string;
    /**
     * Opaque id for requesting the chart part XML from the package session (charts only).
     * Present when the chart relationship resolves to an internal part; payload stays in the package.
     */
    readonly chartRequestId?: string;
}

/** Clone-safe unsupported-frame snapshot. */
export interface FallbackFrameRenderSnapshot {
    /** Stable unsupported family. */
    readonly kind: FallbackFrameKind;
    /** Authored accessibility description. */
    readonly description?: string;
    /** Authored accessibility title. */
    readonly title?: string;
    /** Direct payload identity before OPC resolution. */
    readonly direct: FallbackFrameDirectSnapshot;
    /** Resolved package identity kept separate from authored relationship data. */
    readonly resolved?: FallbackFrameResolvedSnapshot;
    /** File-owned preview picture, when present; external links remain metadata only. */
    readonly preview?: PictureRenderSnapshot;
}
