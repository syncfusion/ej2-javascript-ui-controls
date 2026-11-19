/** Stable base class for errors exposed by the PowerPoint Editor. */
export class PptxError<TCode extends string> extends Error {
    /** Stable machine-readable error code. */
    public readonly code: TCode;

    /**
     * Creates a typed editor error.
     *
     * @param {string} name - Public error class name.
     * @param {TCode} code - Stable machine-readable code.
     * @param {string} message - Localizable or diagnostic message.
     */
    protected constructor(name: string, code: TCode, message: string) {
        super(message);
        this.name = name;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
