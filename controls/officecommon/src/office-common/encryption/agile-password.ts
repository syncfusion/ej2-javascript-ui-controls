/*
 * Password key encryptor verifier and intermediate key ([MS-OFFCRYPTO] §2.3.4.13).
 *
 * @remarks
 * 1. Derive key with blockKey `BLOCK_KEY_VERIFIER_INPUT`; decrypt encryptedVerifierHashInput.
 * 2. Hash the decrypted verifier input; derive key with `BLOCK_KEY_VERIFIER_HASH`;
 *    decrypt encryptedVerifierHashValue; compare first hashSize bytes → else InvalidPasswordError.
 * 3. Derive key with `BLOCK_KEY_ENCRYPTED_KEY`; decrypt encryptedKeyValue → intermediate key
 *    (truncated to keyBits/8).
 *
 * Integrity HMAC failure uses the same InvalidPasswordError (fail-closed; do not
 * distinguish wrong password vs tampered package in the public message).
 *
 * @private
 */

import { InvalidPasswordError } from './errors';
import {
    BLOCK_KEY_ENCRYPTOR_KEY,
    BLOCK_KEY_VERIFIER_HASH,
    BLOCK_KEY_VERIFIER_INPUT
} from './agile-constants';
import { AgilePasswordKeyEncryptor } from './agile-encryption-info';
import {
    aesCbcDecrypt,
    deriveAgileIv,
    deriveAgileKey,
    encodePasswordUtf16Le,
    hashBytes,
    timingSafeEqual
} from './crypto-primitives';

/**
 * Verifies the password and returns the secret key used to decrypt EncryptedPackage
 * (decrypted encryptedKeyValue, truncated to keyBits/8).
 *
 * @param {string} password - The password.
 * @param {AgilePasswordKeyEncryptor} encryptor - The encryptor.
 * @returns {Uint8Array} The result.
 * @throws {InvalidPasswordError} When verifier hash does not match.
 */
export function unlockIntermediateKey(
    password: string,
    encryptor: AgilePasswordKeyEncryptor
): Uint8Array {
    const passwordBytes: Uint8Array = encodePasswordUtf16Le(password);
    const { hashAlgorithm, saltValue, spinCount, keyBits, blockSize, hashSize } = encryptor;

    // --- verifier hash input ---
    const keyVerifierInput: Uint8Array = deriveAgileKey(
        hashAlgorithm,
        saltValue,
        passwordBytes,
        spinCount,
        BLOCK_KEY_VERIFIER_INPUT,
        keyBits
    );
    const ivVerifierInput: Uint8Array = deriveAgileIv(hashAlgorithm, saltValue, undefined, blockSize);
    const verifierInputPadded: Uint8Array = aesCbcDecrypt(
        keyVerifierInput,
        ivVerifierInput,
        encryptor.encryptedVerifierHashInput
    );
    // §2.3.4.13: verifier input is saltSize random bytes (zero-padded to blockSize on encrypt).
    if (verifierInputPadded.byteLength < encryptor.saltSize) {
        throw new InvalidPasswordError();
    }
    const verifierInput: Uint8Array = verifierInputPadded.subarray(0, encryptor.saltSize);

    const verifierHashComputed: Uint8Array = hashBytes(hashAlgorithm, verifierInput);

    // --- verifier hash value ---
    const keyVerifierHash: Uint8Array = deriveAgileKey(
        hashAlgorithm,
        saltValue,
        passwordBytes,
        spinCount,
        BLOCK_KEY_VERIFIER_HASH,
        keyBits
    );
    const ivVerifierHash: Uint8Array = deriveAgileIv(hashAlgorithm, saltValue, undefined, blockSize);
    const verifierHashDecrypted: Uint8Array = aesCbcDecrypt(
        keyVerifierHash,
        ivVerifierHash,
        encryptor.encryptedVerifierHashValue
    );

    const expectedLen: number = Math.min(
        hashSize,
        verifierHashComputed.byteLength,
        verifierHashDecrypted.byteLength
    );
    if (expectedLen <= 0) {
        throw new InvalidPasswordError();
    }
    if (
        !timingSafeEqual(
            verifierHashComputed.subarray(0, expectedLen),
            verifierHashDecrypted.subarray(0, expectedLen)
        )
    ) {
        throw new InvalidPasswordError();
    }

    // --- encrypted key value → intermediate / secret key ---
    const keyEncryptedKey: Uint8Array = deriveAgileKey(
        hashAlgorithm,
        saltValue,
        passwordBytes,
        spinCount,
        BLOCK_KEY_ENCRYPTOR_KEY,
        keyBits
    );
    const ivEncryptedKey: Uint8Array = deriveAgileIv(hashAlgorithm, saltValue, undefined, blockSize);
    const decryptedKey: Uint8Array = aesCbcDecrypt(keyEncryptedKey, ivEncryptedKey, encryptor.encryptedKeyValue);

    const keyLen: number = keyBits / 8;
    if (decryptedKey.byteLength < keyLen) {
        throw new InvalidPasswordError();
    }
    return decryptedKey.subarray(0, keyLen);
}
