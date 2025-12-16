import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
export interface _ICipherBlock {
    _getAlgorithmName(): string;
    _getInputBlock(): number;
    _getOutputBlock(): number;
    _initialize(isEncryption: boolean, parameter: _PdfCipherParameter): void;
    _processBlock(bytes: Uint8Array, offset: number, length: number): Uint8Array;
}
export interface _ICipherParam {
    _equals(other: any): boolean; // eslint-disable-line
    _getHashCode(): number;
}
export interface _ISigner {
    readonly _algorithmName: string;
    _initialize(forSigning: boolean, parameters: _ICipherParam): void;
    _blockUpdate(bytes: Uint8Array, offset: number, length: number): void;
    _generateSignature(): Uint8Array | null;
    _reset(): void;
}
