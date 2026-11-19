/** Read-only presentation section membership. */
export interface PresentationSection {
    /** Stable section identifier authored by PowerPoint. */
    readonly id: string | undefined;
    /** Section display name. */
    readonly name: string | undefined;
    /** Zero-based indexes into the presentation's current slide order. */
    readonly slideIndexes: ReadonlyArray<number>;
}
