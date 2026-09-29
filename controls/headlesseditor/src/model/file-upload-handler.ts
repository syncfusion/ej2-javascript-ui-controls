/**
 * Generic file upload handler contract.
 *
 * Product-implemented interface for uploading files.
 * Adapts product-specific configuration (saveUrl, auth, etc.)
 * into a generic upload interface.
 *
 * Responsibility: HTTP transport ONLY. No document knowledge.
 *
 * Examples:
 * - RTE: POST to imageSettings.saveUrl with form-data
 * - BlockEditor: S3.putObject with bucket/key
 * - Custom: Azure Blob Storage with SAS token
 */

/**
 * Product-implemented interface for uploading files.
 *
 * **Responsibility:**
 * The handler is responsible for HTTP transport, validation, and error handling.
 * The framework (FileHandler) owns upload state lifecycle.
 *
 * **The handler must:**
 * 1. Validate HTTP response status (throw if !response.ok)
 * 2. Parse and validate response schema
 * 3. Validate that result.url is a non-empty string
 * 4. Throw on any error (including validation errors)
 * 5. Call onProgress() during transfer for UI feedback
 * 6. Respect AbortSignal for cancellation
 *
 * **The framework will:**
 * 1. Determine terminal state from Promise: resolve → completed, reject → failed
 * 2. Handle AbortError specially: treated as cancelled state
 * 3. Validate FileUploadResult contract and reject if invalid
 * 4. Write upload state (progress, completed, failed, cancelled) directly to registry
 * 5. Notify UI via UploadStateRegistry subscriptions
 */
export interface FileUploadHandler {
    /**
     * Upload a file and return hosted URL.
     *
     * @param request - File + signal + progress callback
     * @returns Promise<FileUploadResult> with validated hosted URL
     * @throws Error if HTTP fails, validation fails, or network error occurs
     *
     * @example
     * ```ts
     * {
     *   async upload({ file, signal, onProgress }) {
     *     const formData = new FormData();
     *     formData.append('file', file);
     *
     *     const response = await fetch(imageSettings.saveUrl, {
     *       method: 'POST',
     *       body: formData,
     *       headers: imageSettings.headers,
     *       signal,
     *     });
     *
     *     // ✅ Validate HTTP response
     *     if (!response.ok) {
     *       throw new Error(`Upload failed: ${response.statusText}`);
     *     }
     *
     *     const data = await response.json();
     *
     *     // ✅ Validate response schema
     *     if (!data.url || typeof data.url !== 'string') {
     *       throw new Error('Server did not return valid url');
     *     }
     *
     *     return {
     *       url: data.url,
     *       width: data.width,
     *       height: data.height,
     *     };
     *   }
     * }
     * ```
     */
    upload(request: FileUploadRequest): Promise<FileUploadResult>;

    /**
     * Optional: Cancel an in-flight upload.
     * Called when the user/extension cancels the upload.
     * Handler should abort any pending network operations.
     *
     * @param uploadId - The upload ID to cancel.
     */
    cancel?(uploadId: string): void;
}

/**
 * Request parameters for file upload.
 *
 * The product handler receives this object and must:
 * 1. Validate HTTP response status before treating as success
 * 2. Validate response schema and return valid FileUploadResult
 * 3. Throw on any error (HTTP, validation, network, etc.)
 * 4. Call onProgress() during transfer for UI feedback
 * 5. Respect the AbortSignal for cancellation
 *
 * The framework (FileHandler) determines terminal state from:
 * - Promise resolve → success (result must be valid)
 * - Promise reject → failure
 * - AbortSignal abort → cancellation
 */
export interface FileUploadRequest {
    /** Unique upload identifier (UUID). Stable for this upload lifecycle. */
    id: string;

    /** The file being uploaded. */
    file: File;

    /** AbortSignal for cancellation support. */
    signal?: AbortSignal;

    /** Progress callback for real-time UI feedback. Called during transfer. */
    onProgress?: (progress: FileUploadProgress) => void;
}

/**
 * Result of a successful file upload.
 *
 * **Important Contract:**
 * The handler MUST validate the HTTP response and server schema before
 * returning this object. The framework will reject the upload if:
 * - `url` is missing, null, empty string, or not a string
 * - Promise rejects for any reason (including validation errors)
 *
 * Examples of correct handler validation:
 * - Check response.ok before parsing JSON
 * - Check that data.url exists and is non-empty
 * - Throw new Error() if validation fails (reject the Promise)
 */
export interface FileUploadResult {
    /** Hosted URL to embed in document. REQUIRED: non-empty string. */
    url: string;

    /** Optional: Canonical filename on server. */
    fileName?: string;

    /** Optional: Server-confirmed MIME type. */
    mimeType?: string;

    /** Optional: Server-side file size in bytes. */
    size?: number;

    /** Optional: Image width (for image files). */
    width?: number;

    /** Optional: Image height (for image files). */
    height?: number;

    /** Optional: Any other metadata needed by extensions. */
    [key: string]: unknown;
}

/**
 * Progress information during file upload.
 */
export interface FileUploadProgress {
    /** Bytes transferred so far. */
    loaded: number;

    /** Total bytes (undefined if server doesn't provide). */
    total?: number;

    /** Computed percentage (0–100) if total is available. */
    percentage?: number;
}
