/**
 * Provides mappings between encryption algorithm object identifiers (OIDs)
 * and their corresponding algorithm names.
 *
 * @private
 */
export class _PdfEncryptionAlgorithms {
    /**
     * Stores the mappings between encryption algorithm OIDs and algorithm names.
     *
     * @private
     */
    private readonly _algorithmNames: Map<string, string>;
    /**
     * Initializes a new instance of the _PdfEncryptionAlgorithms class and loads
     * the supported encryption algorithm mappings.
     *
     * @private
     */
    constructor() {
        this._algorithmNames = new Map<string, string>([
            ['1.2.840.113549.1.1.1', 'RSA'],
            ['1.2.840.10040.4.1', 'DSA'],
            ['1.2.840.113549.1.1.2', 'RSA'],
            ['1.2.840.113549.1.1.4', 'RSA'],
            ['1.2.840.113549.1.1.5', 'RSA'],
            ['1.2.840.113549.1.1.14', 'RSA'],
            ['1.2.840.113549.1.1.11', 'RSA'],
            ['1.2.840.113549.1.1.12', 'RSA'],
            ['1.2.840.113549.1.1.13', 'RSA'],
            ['1.2.840.10040.4.3', 'DSA'],
            ['2.16.840.1.101.3.4.3.1', 'DSA'],
            ['2.16.840.1.101.3.4.3.2', 'DSA'],
            ['1.3.14.3.2.29', 'RSA'],
            ['1.3.36.3.3.1.2', 'RSA'],
            ['1.3.36.3.3.1.3', 'RSA'],
            ['1.3.36.3.3.1.4', 'RSA'],
            ['1.2.643.2.2.19', 'ECGOST3410'],
            ['1.2.840.113549.1.1.10', 'RSAandMGF1'],
            ['1.2.840.10045.2.1', 'ECDSA'],
            ['1.2.840.10045.4.1', 'ECDSA'],
            ['1.2.840.10045.4.3.1', 'ECDSA'],
            ['1.2.840.10045.4.3.2', 'ECDSA'],
            ['1.2.840.10045.4.3.3', 'ECDSA'],
            ['1.2.840.10045.4.3.4', 'ECDSA']
        ]);
    }
    /**
     * Gets the algorithm name corresponding to the specified object identifier (OID).
     *
     * @param {string} oid The object identifier of the encryption algorithm.
     * @returns {string} The algorithm name associated with the OID; otherwise, the original OID if no mapping is found.
     * @private
     */
    _getAlgorithm(oid: string): string {
        return this._algorithmNames.get(oid) ? this._algorithmNames.get(oid) : oid;
    }
}
