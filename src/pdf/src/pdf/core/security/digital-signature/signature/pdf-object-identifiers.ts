/**
 * Provides internal NIST object identifiers (OIDs) for hash and signature algorithms.
 *
 * @private
 */
export class _NistObjectIdentifiers {
    /**
     * OID for the SHA-256 hash algorithm.
     *
     * @private
     */
    _secureHash256AlgorithmIdentifier: any = { id: '2.16.840.1.101.3.4.2.1' }; //eslint-disable-line
    /**
     * OID for the SHA-384 hash algorithm.
     *
     * @private
     */
    _secureHash384AlgorithmIdentifier: any = { id: '2.16.840.1.101.3.4.2.2' }; //eslint-disable-line
    /**
     * OID for the SHA-512 hash algorithm.
     *
     * @private
     */
    _secureHash512AlgorithmIdentifier: any = { id: '2.16.840.1.101.3.4.2.3' }; //eslint-disable-line
    /**
     * OID for RIPEMD-160 (race evaluation message digest).
     *
     * @private
     */
    _raceEvaluationMessageDigestAlgorithmIdentifier: any = { id: '1.3.36.3.2.1' }; //eslint-disable-line
    /**
     * OID for the SHA-256 signature algorithm identifier.
     *
     * @private
     */
    _digitalSignatureWithSecureHash256AlgorithmIdentifier: any = { id: '2.16.840.1.101.3.4.3.2' }; //eslint-disable-line

    /**
     * OID for the RIPEMD-160 with RSA (race evaluation with Ron cipher) algorithm identifier.
     *
     * @private
     */
    _ronCipherWithRaceEvaluationAlgorithmIdentifier: any = { id: '1.3.36.3.3.1.2' }; //eslint-disable-line
}

/**
 * OID for the RIPEMD-160 with RSA (race evaluation with Ron cipher) algorithm identifier.
 *
 * @private
 */
export class _PdfCryptographicObjectIdentifier {
    /**
     * OID for the MD5 message-digest.
     *
     * @private
     */
    _messageDigest5: any = { id: '1.2.840.113549.2.5' }; //eslint-disable-line
    /**
     * OID for SHA-1 with RSA encryption.
     *
     * @private
     */
    _secureHash1WithRonCipherEncryption: any = { id: '1.2.840.113549.1.1.5' }; //eslint-disable-line
    /**
     * OID for SHA-256 with RSA encryption.
     *
     * @private
     */
    _secureHash256WithRonCipherEncryption: any = { id: '1.2.840.113549.1.1.11' }; //eslint-disable-line
    /**
     * OID for SHA-384 with RSA encryption.
     *
     * @private
     */
    _secureHash384WithRonCipherEncryption: any = { id: '1.2.840.113549.1.1.12' }; //eslint-disable-line
    /**
     * OID for SHA-512 with RSA encryption.
     *
     * @private
     */
    _secureHash512WithRonCipherEncryption: any = { id: '1.2.840.113549.1.1.13' }; //eslint-disable-line
    /**
     * OID for MD2 with RSA encryption.
     *
     * @private
     */
    _messageDigest2WithRonCipherEncryption: any = { id: '1.2.840.113549.1.1.2' }; //eslint-disable-line
    /**
     * OID for RSA encryption (public key).
     *
     * @private
     */
    _raceEvaluationEncryption: any = { id: '1.2.840.113549.1.1.1' }; //eslint-disable-line
}
/**
 * Provides internal CMS/PKCS digital content and attribute OIDs used in signatures.
 *
 * @private
 */
export class _PdfDigitalIdentifiers {
    /**
     * OID for PKCS#7 Data content type.
     *
     * @private
     */
    _cryptographicData: string = '1.2.840.113549.1.7.1';
    /**
     * OID for PKCS#7 SignedData content type.
     *
     * @private
     */
    _cryptographicSignedData: string = '1.2.840.113549.1.7.2';
    /**
     * OID for RSA encryption (public key).
     *
     * @private
     */
    _rsaEncryption: string = '1.2.840.113549.1.1.1';
    /**
     * OID for DSA signature (public key algorithm).
     *
     * @private
     */
    _dsaSignature: string = '1.2.840.10040.4.1';
    /**
     * OID for EC public key (public key algorithm).
     *
     * @private
     */
    _ecPublicKey: string = '1.2.840.10045.2.1';
    /**
     * OID for the CMS ContentType attribute.
     *
     * @private
     */
    _contentType: string = '1.2.840.113549.1.9.3';
    /**
     * OID for the CMS MessageDigest attribute.
     *
     * @private
     */
    _messageDigest: string = '1.2.840.113549.1.9.4';
    /**
     * OID for the CMS SigningCertificate attribute.
     *
     * @private
     */
    _signingCertificate: string = '1.2.840.113549.1.9.16.2.47';
    /**
     * OID for the Adobe RevocationInfoArchival attribute.
     *
     * @private
     */
    _revocation: string = '1.2.840.113583.1.1.8';
}
