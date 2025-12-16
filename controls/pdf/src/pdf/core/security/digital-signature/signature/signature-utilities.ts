import { _PdfRmdSigner } from './pdf-cipher-signer';
import { _ISigner } from './pdf-interfaces';
import { _NistObjectIdentifiers, _PdfCryptographicObjectIdentifier } from './pdf-object-identifiers';
export class _PdfSignerUtilities {
    private _algorithms: Map<string, string>;
    private _objectIdentifiers: Map<string, any>; //eslint-disable-line
    constructor() {
        this._algorithms = new Map<string, string>();
        this._objectIdentifiers = new Map<string, any>(); //eslint-disable-line
        this._initializeAlgorithmMappings();
        this._initializeObjectIdentifierMappings();
    }
    _initializeAlgorithmMappings(): void {
        const algorithmIdentifiers: _NistObjectIdentifiers = new _NistObjectIdentifiers();
        const identifiers: _PdfCryptographicObjectIdentifier = new _PdfCryptographicObjectIdentifier();
        this._algorithms.set('MD2WITHRSA', 'MD2withRSA');
        this._algorithms.set('MD2WITHRSAENCRYPTION', 'MD2withRSA');
        this._algorithms.set(identifiers._messageDigest2WithRonCipherEncryption.id, 'MD2withRSA');
        this._algorithms.set(identifiers._raceEvaluationEncryption.id, 'RSA');
        this._algorithms.set('SHA1WITHRSA', 'SHA-1withRSA');
        this._algorithms.set('SHA1WITHRSAENCRYPTION', 'SHA-1withRSA');
        this._algorithms.set(identifiers._secureHash1WithRonCipherEncryption.id, 'SHA-1withRSA');
        this._algorithms.set('SHA-1WITHRSA', 'SHA-1withRSA');
        this._algorithms.set('SHA256WITHRSA', 'SHA-256withRSA');
        this._algorithms.set('SHA256WITHRSAENCRYPTION', 'SHA-256withRSA');
        this._algorithms.set(identifiers._secureHash256WithRonCipherEncryption.id, 'SHA-256withRSA');
        this._algorithms.set('SHA-256WITHRSA', 'SHA-256withRSA');
        this._algorithms.set('SHA384WITHRSA', 'SHA-384withRSA');
        this._algorithms.set('SHA384WITHRSAENCRYPTION', 'SHA-384withRSA');
        this._algorithms.set(identifiers._secureHash384WithRonCipherEncryption.id, 'SHA-384withRSA');
        this._algorithms.set('SHA-384WITHRSA', 'SHA-384withRSA');
        this._algorithms.set('SHA512WITHRSA', 'SHA-512withRSA');
        this._algorithms.set('SHA-512WITHRSA', 'SHA-512withRSA');
        this._algorithms.set(identifiers._secureHash512WithRonCipherEncryption.id, 'SHA-512withRSA');
        this._algorithms.set('SHA1WITHRSAANDMGF1', 'SHA-1withRSAandMGF1');
        this._algorithms.set('SHA-1WITHRSAANDMGF1', 'SHA-1withRSAandMGF1');
        this._algorithms.set('SHA1WITHRSA/PSS', 'SHA-1withRSAandMGF1');
        this._algorithms.set('SHA-1WITHRSA/PSS', 'SHA-1withRSAandMGF1');
        this._algorithms.set('SHA256WITHRSAANDMGF1', 'SHA-256withRSAandMGF1');
        this._algorithms.set('SHA-256WITHRSAANDMGF1', 'SHA-256withRSAandMGF1');
        this._algorithms.set('SHA256WITHRSA/PSS', 'SHA-256withRSAandMGF1');
        this._algorithms.set('SHA-256WITHRSA/PSS', 'SHA-256withRSAandMGF1');
        this._algorithms.set('SHA384WITHRSAANDMGF1', 'SHA-384withRSAandMGF1');
        this._algorithms.set('SHA-384WITHRSAANDMGF1', 'SHA-384withRSAandMGF1');
        this._algorithms.set('SHA384WITHRSA/PSS', 'SHA-384withRSAandMGF1');
        this._algorithms.set('SHA-384WITHRSA/PSS', 'SHA-384withRSAandMGF1');
        this._algorithms.set('SHA512WITHRSAANDMGF1', 'SHA-512withRSAandMGF1');
        this._algorithms.set('SHA-512WITHRSAANDMGF1', 'SHA-512withRSAandMGF1');
        this._algorithms.set('SHA512WITHRSA/PSS', 'SHA-512withRSAandMGF1');
        this._algorithms.set('SHA-512WITHRSA/PSS', 'SHA-512withRSAandMGF1');
        this._algorithms.set('DSAWITHSHA256', 'SHA-256withDSA');
        this._algorithms.set('DSAWITHSHA-256', 'SHA-256withDSA');
        this._algorithms.set('SHA256/DSA', 'SHA-256withDSA');
        this._algorithms.set('SHA-256/DSA', 'SHA-256withDSA');
        this._algorithms.set('SHA256WITHDSA', 'SHA-256withDSA');
        this._algorithms.set('SHA-256WITHDSA', 'SHA-256withDSA');
        this._algorithms.set(algorithmIdentifiers._digitalSignatureWithSecureHash256AlgorithmIdentifier.id, 'SHA-256withDSA');
        this._algorithms.set('RIPEMD160WITHRSA', 'RIPEMD160withRSA');
        this._algorithms.set('RIPEMD160WITHRSAENCRYPTION', 'RIPEMD160withRSA');
        this._algorithms.set(algorithmIdentifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier.id, 'RIPEMD160withRSA');
    }
    _initializeObjectIdentifierMappings(): void {
        const algorithmIdentifiers: _NistObjectIdentifiers = new _NistObjectIdentifiers();
        const identifiers: _PdfCryptographicObjectIdentifier = new _PdfCryptographicObjectIdentifier();
        this._objectIdentifiers.set('SHA-1withRSA', identifiers._secureHash1WithRonCipherEncryption);
        this._objectIdentifiers.set('SHA-256withRSA', identifiers._secureHash1WithRonCipherEncryption);
        this._objectIdentifiers.set('SHA-384withRSA', identifiers._secureHash256WithRonCipherEncryption);
        this._objectIdentifiers.set('SHA-512withRSA', identifiers._secureHash512WithRonCipherEncryption);
        this._objectIdentifiers.set('RIPEMD160withRSA', algorithmIdentifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier.id);
    }
    _getSigner(algorithm: string): _ISigner {
        const lower: string = algorithm.toLowerCase();
        let mechanism: string = algorithm;
        let found: boolean = false;
        this._algorithms.forEach((value: string, key: string) => {
            if (!found && key.toLowerCase() === lower) {
                mechanism = value;
                found = true;
            }
        });
        if (mechanism === 'SHA-1withRSA') {
            return new _PdfRmdSigner('sha1');
        } else if (mechanism === 'SHA-256withRSA') {
            return new _PdfRmdSigner('sha256');
        } else if (mechanism === 'SHA-384withRSA') {
            return new _PdfRmdSigner('sha384');
        } else if (mechanism === 'SHA-512withRSA') {
            return new _PdfRmdSigner('sha512');
        } else if (mechanism === 'RIPEMD160withRSA') {
            return new _PdfRmdSigner('md5');
        } else {
            throw new Error(`Signer ${algorithm} not recognised.`);
        }
    }
}
