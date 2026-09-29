import { _PdfRsaAlgorithm, _PdfRsaCoreAlgorithm } from "../../src/pdf/core/security/digital-signature/signature/algorithm-handler";
import { _getBigInt } from "../../src/pdf/core/utils";
import * as utils  from "../../src/pdf/core/utils";
describe('Algorithm-handler file behavior test scripts', () => {
    it('getters return value check', () => {
        const algorithm: any = new _PdfRsaAlgorithm();
        const name = algorithm._getAlgorithmName();
        algorithm._rsaCoreEngine._isEncryption = false;
        algorithm._rsaCoreEngine._bitSize = 2;
        const outputBlock = algorithm._getOutputBlock();
        expect(name).toEqual('RSA');
        expect(outputBlock).toBe(0);
    });
    it('processBlock throws when engine not initialized', () => {
        // Arrange
        const algorithm: any = new _PdfRsaAlgorithm();
        const inputBytes: Uint8Array = new Uint8Array([1, 2, 3]);
        // Act / Assert
        try {
            algorithm._processBlock(inputBytes, 0, inputBytes.length)
        } catch (error) {
            expect(error.message).toBe('RSA engine not initialized.');
        }
    });
    it('input/output block sizes in non encryption mode', () => {
        // Arrange
        const algorithm: any = new _PdfRsaAlgorithm();
        algorithm._rsaCoreEngine._isEncryption = false;
        algorithm._rsaCoreEngine._bitSize = 16;
        // Act
        const inputBlock: number = algorithm._getInputBlock();
        const outputBlock: number = algorithm._getOutputBlock();
        // Assert
        expect(inputBlock).toBe(2);
        expect(outputBlock).toBe(1);
    });
    it('_initialize sets bitSize and encryption flag from parameter (lines 78-81)', () => {
        const algorithm: any = new _PdfRsaAlgorithm();
        const fakeParam: any = { modulus: { _bitLength: () => 123 } };
        algorithm._initialize(true, fakeParam);
        expect(algorithm._rsaCoreEngine._bitSize).toBe(123);
        expect(algorithm._rsaCoreEngine._isEncryption).toBeTruthy();
        expect(algorithm._key).toBe(fakeParam);
    });
    it('_getInputBlockSize and _getOutputBlockSize in encryption mode (lines 58,62)', () => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._isEncryption = true;
        core._bitSize = 16;
        expect(core._getInputBlockSize()).toBe((16 - 1) >>> 3);
        expect(core._getOutputBlockSize()).toBe((16 + 7) >>> 3);
    });
    it('_convertOutput pads output in encryption mode when shorter than block (line 191)', () => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const toBigInt = _getBigInt();
        core._isEncryption = true;
        core._bitSize = 16; // output block should be 2 bytes
        const out = core._convertOutput(toBigInt('1'));
        expect(out.length).toBe((16 + 7) >>> 3);
        // small bigint (1) should be right-padded into block: [0,1]
        expect(Array.from(out)).toEqual([0, 1]);
    });
    it('processBlock uses blinding when private key with publicExponent exists', () => {
        const toBigInt = _getBigInt();
        const algorithm: any = new _PdfRsaAlgorithm();
        algorithm._key = {
            _isPrivate: true,
            publicExponent: { _toBigInt: () => toBigInt('3') },
            modulus: { _toBigInt: () => toBigInt('11') }
        };
        spyOn(algorithm._rsaCoreEngine, '_convertInput').and.returnValue(toBigInt('4'));
        spyOn(utils, '_createRandomInRange').and.returnValue(toBigInt('2'));
        spyOn(utils, '_modPow').and.returnValue(toBigInt('7'));
        spyOn(algorithm._rsaCoreEngine, '_processBlock').and.returnValue(toBigInt('8'));
        spyOn(utils, '_modInverse').and.returnValue(toBigInt('6'));
        spyOn(algorithm._rsaCoreEngine, '_convertOutput').and.returnValue(new Uint8Array([4]));
        const output = algorithm._processBlock(new Uint8Array([1, 2, 3]), 0, 3);
        expect(utils._createRandomInRange).toHaveBeenCalledWith(toBigInt('1'), toBigInt('11') - toBigInt('1'));
        expect(utils._modPow).toHaveBeenCalledWith(toBigInt('2'), toBigInt('3'), toBigInt('11'));
        expect(algorithm._rsaCoreEngine._processBlock).toHaveBeenCalledWith(toBigInt('6'));
        expect(utils._modInverse).toHaveBeenCalledWith(toBigInt('2'), toBigInt('11'));
        expect(algorithm._rsaCoreEngine._convertOutput).toHaveBeenCalledWith(toBigInt('4'));
        expect(Array.from(output)).toEqual([4]);
    });
    it('processBlock delegates to core when no blinding (else path lines 190-192)', () => {
        const toBigInt = _getBigInt();
        const algorithm: any = new _PdfRsaAlgorithm();
        algorithm._key = { _isPrivate: false, modulus: { _toBigInt: () => toBigInt('11') } };
        const inputBigInt = toBigInt('4');
        const processedBigInt = toBigInt('7');
        spyOn(algorithm._rsaCoreEngine, '_convertInput').and.returnValue(inputBigInt);
        spyOn(algorithm._rsaCoreEngine, '_processBlock').and.returnValue(processedBigInt);
        spyOn(algorithm._rsaCoreEngine, '_convertOutput').and.returnValue(new Uint8Array([9]));
        const output = algorithm._processBlock(new Uint8Array([1, 2, 3]), 0, 3);
        expect(algorithm._rsaCoreEngine._convertInput).toHaveBeenCalled();
        expect(algorithm._rsaCoreEngine._processBlock).toHaveBeenCalledWith(inputBigInt);
        expect(algorithm._rsaCoreEngine._convertOutput).toHaveBeenCalledWith(processedBigInt);
        expect(Array.from(output)).toEqual([9]);
    });
    it('_initialize should calculate bit size from modulus length when certification verification is enabled', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([1, 2, 3, 4]),
            _exponent: new Uint8Array([1])
        };
        core._initialize(false, key);
        expect(core._bitSize).toBe(25);
    });
    it('_initialize should not use certification verification path when flag is false', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _enableCertificationVerification: false,
            _modulus: new Uint8Array([1, 2, 3, 4])
        };
        core._initialize(false, key);
        expect(core._bitSize).toBe(0);
    });
    it('_initialize should handle all zero modulus bytes', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0, 0, 0]),
            _exponent: new Uint8Array([1])
        };
        expect((): void => {
            core._initialize(false, key);
        }).not.toThrow();
        expect(core._bitSize).toBe(0);
    });
    it('_initialize should set bit size to zero when modulus contains only zeros', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0, 0]),
            _exponent: new Uint8Array([1])
        };
        core._initialize(false, key);
        expect(core._bitSize).toBe(0);
    });
    it('_initialize should calculate bit length from first non zero byte', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0, 0x80]),
            _exponent: new Uint8Array([1])
        };
        core._initialize(false, key);
        expect(core._bitSize).toBe(8);
    });
    it('_initialize should preserve existing modulus object', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const modulus: any = {
            _bitLength(): number {
                return 77;
            }
        };
        const key: any = {
            modulus,
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([1])
        };
        core._initialize(false, key);
        expect(key.modulus).toBe(modulus);
    });
    it('_initialize should not create exponent wrapper when _exponent is absent', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const exponent: any = {
            marker: true
        };
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([1]),
            exponent
        };
        core._initialize(false, key);
        expect(key.exponent).toBe(exponent);
    });
    it('_initialize should set bit size to zero when key is undefined', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._bitSize = 100;
        core._initialize(false, undefined as any);
        expect(core._bitSize).toBe(0);
    });
    it('_initialize should use modulus _bitLength when modulus object exposes _bitLength method', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const modulus: any = {
            _bitLength(): number {
                return 123;
            },
            _toBigInt(): any {
                return 123;
            }
        };
        const key: any = {
            modulus: modulus
        };
        core._initialize(false, key);
        expect(core._bitSize).toBe(123);
        expect(typeof key.modulus._bitLength).toBe('function');
        expect(key.modulus).toBe(modulus);
        expect(core._bitSize).not.toBe(0);
    });
    it('_getModulusByteLength should use modulus when _modulus is absent', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._key = {
            modulus: new Uint8Array([1, 2, 3, 4]),
            _modulus: undefined
        };
        expect(core._getModulusByteLength()).toBe(4);
    });
    it('_convertInput should throw when signature length differs from modulus length', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._key = {
            _isPrivate: false,
            _modulus: new Uint8Array([1, 2, 3, 4]),
            modulus: {
                _toBigInt(): bigint {
                    return toBigInt(999);
                }
            }
        };
        expect((): void => {
            core._convertInput(
                new Uint8Array([1, 2]),
                0,
                2
            );
        }).toThrowError(
            'Signature length (2) does not match modulus length (4). Wrong issuer public key.'
        );
    });
    it('_convertInput should throw exact signature length message', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._key = {
            _isPrivate: false,
            _modulus: new Uint8Array([1, 2, 3]),
            modulus: {
                _toBigInt(): bigint {
                    return toBigInt(10);
                }
            }
        };
        expect((): void => {
            core._convertInput(
                new Uint8Array([1, 2]),
                0,
                2
            );
        }).toThrowError(
            'Signature length (2) does not match modulus length (3). Wrong issuer public key.'
        );
    });
    it('_convertInput should use _modulus when modulus is undefined', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        spyOn(core, '_getModulusByteLength').and.returnValue(1);
        core._key = {
            _isPrivate: false,
            _modulus: {
                _toBigInt(): any {
                    return toBigInt(1000);
                }
            }
        };
        const result: any = core._convertInput(
            new Uint8Array([1]),
            0,
            1
        );
        expect(result).toBe(toBigInt(1));
    });
    it('_convertInput should invoke modulus _toBigInt when function is present', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        let called: boolean = false;
        core._key = {
            _isPrivate: false,
            _modulus: new Uint8Array([1]),
            modulus: {
                _toBigInt(): bigint {
                    called = true;
                    return toBigInt(100);
                }
            }
        };
        spyOn(core, '_getModulusByteLength').and.returnValue(1);
        core._convertInput(
            new Uint8Array([1]),
            0,
            1
        );
        expect(called).toBe(true);
    });
    it('_convertInput should throw when input equals modulus', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._key = {
            _isPrivate: false,
            _modulus: new Uint8Array([1]),
            modulus: {
                _toBigInt(): bigint {
                    return toBigInt(5);
                }
            }
        };
        spyOn(core, '_getModulusByteLength').and.returnValue(1);
        expect((): void => {
            core._convertInput(
                new Uint8Array([5]),
                0,
                1
            );
        }).toThrowError('Input data is larger than modulus.');
    });
    const toBigInt = _getBigInt();
    it('_convertInput should throw when private input equals modulus', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._key = {
            _isPrivate: true,
            modulus: toBigInt(5)
        };
        spyOn(core, '_getInputBlockSize').and.returnValue(10);
        expect((): void => {
            core._convertInput(
                new Uint8Array([5]),
                0,
                1
            );
        }).toThrowError('Input data is larger than modulus.');
    });
    it('_convertOutput should not pad when output length equals block size', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        core._isEncryption = true;
        core._bitSize = 16;
        const output: Uint8Array = core._convertOutput(toBigInt(256));
        expect(output.length).toBe(2);
        expect(Array.from(output)).toEqual([1, 0]);
    });
    it('_processBlock should not enter CRT path when key is not private', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        let crtCalled: boolean = false;
        core._key = {
            _isPrivate: false,
            p: { _toBigInt: (): any => { crtCalled = true; return bigInt('11'); } },
            q: { _toBigInt: (): any => bigInt('13') },
            exponent: { _toBigInt: (): any => bigInt('3') },
            modulus: { _toBigInt: (): any => bigInt('17') }
        };
        core._processBlock(bigInt('5'));
        expect(crtCalled).toBe(false);
    });
    it('_processBlock should execute CRT path correctly', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            _isPrivate: true,
            p: { _toBigInt: (): any => bigInt('11') },
            q: { _toBigInt: (): any => bigInt('13') },
            dP: { _toBigInt: (): any => bigInt('3') },
            dQ: { _toBigInt: (): any => bigInt('3') },
            inverse: { _toBigInt: (): any => bigInt('6') }
        };
        const result: any = core._processBlock(bigInt('7'));
        expect(result).toBeDefined();
    });
    it('_processBlock should normalize negative CRT intermediate value', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            _isPrivate: true,
            p: { _toBigInt: (): any => bigInt('11') },
            q: { _toBigInt: (): any => bigInt('13') },
            dP: { _toBigInt: (): any => bigInt('1') },
            dQ: { _toBigInt: (): any => bigInt('1') },
            inverse: { _toBigInt: (): any => bigInt('6') }
        };
        const result: any = core._processBlock(bigInt('10'));
        expect(result >= bigInt('0')).toBe(true);
    });
    it('_processBlock CRT result should be positive and non-zero', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            _isPrivate: true,
            p: { _toBigInt: (): any => bigInt('11') },
            q: { _toBigInt: (): any => bigInt('13') },
            dP: { _toBigInt: (): any => bigInt('3') },
            dQ: { _toBigInt: (): any => bigInt('5') },
            inverse: { _toBigInt: (): any => bigInt('6') }
        };
        const result: any = core._processBlock(bigInt('7'));
        expect(result > bigInt('0')).toBe(true);
    });
    it('_processBlock should use modulus and exponent Uint8Array branch', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            modulus: new Uint8Array([17]),
            exponent: new Uint8Array([3])
        };
        const result: any = core._processBlock(bigInt('5'));
        expect(result).toBeDefined();
    });
    it('_processBlock should use certification verification modulus and exponent bytes', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([17]),
            _exponent: new Uint8Array([3])
        };
        const result: any = core._processBlock(bigInt('5'));
        expect(result).toBeDefined();
    });
    it('_processBlock should use modulus and exponent Uint8Array branch', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        core._key = {
            modulus: new Uint8Array([17]),
            exponent: new Uint8Array([3])
        };
        const result: any = core._processBlock(bigInt('5'));
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
    });
    it('_processBlock should not enter certification verification branch when flag is false', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        const exponentObject: any = {
            _toBigInt(): any {
                return bigInt('3');
            }
        };
        const modulusObject: any = {
            _toBigInt(): any {
                return bigInt('17');
            }
        };
        core._key = {
            _enableCertificationVerification: false,
            _modulus: new Uint8Array([17]),
            _exponent: new Uint8Array([3]),
            modulus: modulusObject,
            exponent: exponentObject
        };
        const result: any = core._processBlock(bigInt('5'));
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
    });
    it('_processBlock should use regular modulus and exponent when certification verification is disabled', (): void => {
        const core: any = new _PdfRsaCoreAlgorithm();
        const bigInt = _getBigInt();
        let modulusCalled: boolean = false;
        let exponentCalled: boolean = false;
        core._key = {
            _enableCertificationVerification: false,
            _modulus: new Uint8Array([17]),
            _exponent: new Uint8Array([3]),
            modulus: {
                _toBigInt(): any {
                    modulusCalled = true;
                    return bigInt('17');
                }
            },
            exponent: {
                _toBigInt(): any {
                    exponentCalled = true;
                    return bigInt('3');
                }
            }
        };
        core._processBlock(bigInt('5'));
        expect(modulusCalled).toBe(true);
        expect(exponentCalled).toBe(true);
    });
});
describe('_convertInput error branches', () => {
    let rsa: any;
    let bytes: Uint8Array;
    let toBigInt: any
    beforeEach(() => {
        bytes = new Uint8Array(32);
        toBigInt = _getBigInt()
        rsa = {
            _key: {
                modulus: toBigInt('1000')
            },
            _getInputBlockSize: jasmine.createSpy(),
            _convertInput: _PdfRsaCoreAlgorithm.prototype._convertInput
        };
    });
});
