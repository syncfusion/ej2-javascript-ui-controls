/**
 * Clipboard Sanitizer - Security-focused HTML sanitization for paste operations
 *
 * Removes dangerous markup while preserving extension-specific tags and attributes.
 * Uses a security-focused blocklist (not a feature whitelist) to maintain extensibility.
 *
 * @hidden
 * @internal
 */
export class ClipboardSanitizer {
    /**
     * Security-focused blocklist of dangerous tags that pose execution risks.
     * All other tags are preserved to support extension-specific markup.
     */
    private readonly DANGEROUS_TAGS: string[] = [
        'script',      // Executable code
        'iframe',      // Sandboxed embedding / Frame injection
        'embed',       // Plugin execution / Flash/plugin injection
        'object',      // Plugin execution / Complex object injection
        'link',        // Stylesheet injection / Resource loading manipulation
        'meta',        // Metadata manipulation / Redirect injection
        'base',        // Base URL hijacking / Navigation manipulation
        'form',        // Form hijacking / CSRF attacks
        'input',       // Form element injection / Credential capture
        'button',      // Button hijacking / Click interception
        'textarea',    // Form field injection
        'select',      // Form field injection
        'option',      // Form option injection
        'datalist',    // Form data injection
        'keygen',      // Deprecated but dangerous
        'marquee',     // Deprecated but dangerous
        'isindex',     // Deprecated but dangerous
        'applet',      // Deprecated but dangerous
        'noindex',     // SEO manipulation
        'bgsound'     // Audio injection
    ];

    /**
     * Security-focused blocklist of dangerous attributes (event handlers, protocols).
     * These can execute code or trigger unwanted behaviors.
     */
    private readonly DANGEROUS_ATTRIBUTES: string[] = [
        // Event handlers (execution vectors)
        'onclick',
        'onload',
        'onerror',
        'onmouseover',
        'onmouseout',
        'onmouseenter',
        'onmouseleave',
        'onmousedown',
        'onmouseup',
        'onkeydown',
        'onkeyup',
        'onkeypress',
        'onchange',
        'onsubmit',
        'onfocus',
        'onblur',
        'ondblclick',
        'onwheel',
        'ontouchstart',
        'ontouchend',
        'ontouchmove',
        'oncontextmenu',
        'ondrag',
        'ondrop',
        'onpaste',
        'oncopy',
        'oncut',
        'ontransitionend',
        'onanimationend',
        'onanimationstart',
        'ontransitionstart',
        // Data URI / Protocol handlers
        'data',        // data: URIs in <object>
        'archive',     // Archive in <applet>
        'classid',     // Class ID in <object>
        'codebase',    // Code base in <object> / <applet>
        'code',        // Code in <applet>
        'manifest'    // Manifest in <html>
    ];

    /**
     * Patterns that detect dangerous attribute values (e.g., javascript: URIs).
     */
    private readonly DANGEROUS_PROTOCOLS: string[] = ['javascript:', 'data:', 'vbscript:'];

    /**
     * Sanitizes HTML by removing dangerous tags and attributes.
     * Preserves extension-specific tags and attributes for compatibility.
     *
     * @param {string} html - The HTML content to sanitize
     * @returns {string} Sanitized HTML safe for parsing
     * @hidden
     */
    public sanitizeHTML(html: string): string {
        if (!html || html.trim() === '') {
            return html;
        }

        // Parse HTML into DOM
        const temp: HTMLElement = document.createElement('div');
        temp.innerHTML = html;

        // Remove dangerous elements
        this.removeDangerousElements(temp);

        // Remove dangerous attributes from all elements
        this.removeDangerousAttributes(temp);

        // Remove dangerous attribute values (protocols)
        this.removeDangerousAttributeValues(temp);

        return temp.innerHTML;
    }

    /**
     * Removes elements that are known to be security threats.
     * Preserves content inside (unwraps) unless the tag itself is being removed.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {void}
     * @hidden
     */
    private removeDangerousElements(container: HTMLElement): void {
        // Collect all dangerous elements
        for (const tagName of this.DANGEROUS_TAGS) {
            const elements: HTMLCollectionOf<Element> = container.getElementsByTagName(tagName);

            // Process in reverse to avoid index issues
            for (let i: number = elements.length - 1; i >= 0; i--) {
                // eslint-disable-next-line security/detect-object-injection
                const element: Element = elements[i];

                // For <link>, <meta>, <base>, <form> — remove entirely (no content to preserve)
                if (['link', 'meta', 'base', 'form'].indexOf(tagName) > -1) {
                    element.parentNode?.removeChild(element);
                } else {
                    // For <script>, <iframe>, <embed>, <object> — remove and unwrap content
                    while (element.firstChild) {
                        element.parentNode?.insertBefore(element.firstChild, element);
                    }
                    element.parentNode?.removeChild(element);
                }
            }
        }
    }

    /**
     * Removes dangerous attributes from all elements in the container.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {void}
     * @hidden
     */
    private removeDangerousAttributes(container: HTMLElement): void {
        // Get all elements in the container (including container itself)
        const allElements: HTMLCollectionOf<Element> = container.getElementsByTagName('*');

        for (let i: number = 0; i < allElements.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const element: Element = allElements[i];

            // Remove each dangerous attribute
            for (const attrName of this.DANGEROUS_ATTRIBUTES) {
                if (element.hasAttribute(attrName)) {
                    element.removeAttribute(attrName);
                }
            }
        }
    }

    /**
     * Removes dangerous protocol values from attributes (e.g., javascript: URIs).
     * Checks href, src, and action attributes for dangerous protocols.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {void}
     * @hidden
     */
    private removeDangerousAttributeValues(container: HTMLElement): void {
        // Attributes that can contain dangerous protocols
        const protocolAttributes: string[] = ['href', 'src', 'action', 'data', 'srcset', 'poster'];

        const allElements: HTMLCollectionOf<Element> = container.getElementsByTagName('*');

        for (let i: number = 0; i < allElements.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const element: Element = allElements[i];

            for (const attrName of protocolAttributes) {
                if (element.hasAttribute(attrName)) {
                    const attrValue: string = element.getAttribute(attrName) || '';

                    // Check if attribute value contains dangerous protocol
                    const hasDangerousProtocol: boolean = this.DANGEROUS_PROTOCOLS.some((protocol: string) =>
                        attrValue.toLowerCase().startsWith(protocol)
                    );

                    if (hasDangerousProtocol) {
                        element.removeAttribute(attrName);
                    }
                }
            }
        }
    }

    /**
     * Removes Apple-specific line break elements used in clipboard data.
     * These are temporary formatting markers that should not persist in the document.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} The processed container
     * @hidden
     */
    public removeAppleInterchangeNewlines(container: HTMLElement): HTMLElement {
        const appleElements: NodeListOf<HTMLElement> = container.querySelectorAll('br.Apple-interchange-newline');

        for (let i: number = appleElements.length - 1; i >= 0; i--) {
            // eslint-disable-next-line security/detect-object-injection
            const element: HTMLElement = appleElements[i];
            element.parentNode?.removeChild(element);
        }

        return container;
    }

    /**
     * Removes comments from HTML.
     * Comments can contain sensitive information or exploits.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} The processed container
     * @hidden
     */
    public removeComments(container: HTMLElement): HTMLElement {
        const walker: TreeWalker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_COMMENT,
            null
        );

        const commentsToRemove: Node[] = [];
        let node: Node | null;

        // eslint-disable-next-line no-cond-assign
        while ((node = walker.nextNode())) {
            commentsToRemove.push(node);
        }

        // Remove collected comments
        for (const comment of commentsToRemove) {
            comment.parentNode?.removeChild(comment);
        }

        return container;
    }

    /**
     * Cleans up empty meta tags from HTML content.
     * Empty meta tags contribute to bloat without providing value.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} The processed container
     * @hidden
     */
    public removeEmptyMetaTags(container: HTMLElement): HTMLElement {
        const metaTags: NodeListOf<HTMLMetaElement> = container.querySelectorAll('meta');

        for (let i: number = metaTags.length - 1; i >= 0; i--) {
            // eslint-disable-next-line security/detect-object-injection
            const metaTag: HTMLMetaElement = metaTags[i];
            if (metaTag.textContent === '' && !metaTag.hasAttribute('name') && !metaTag.hasAttribute('property')) {
                metaTag.parentNode?.removeChild(metaTag);
            }
        }

        return container;
    }
}
