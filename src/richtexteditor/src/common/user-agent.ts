/* eslint-disable @typescript-eslint/no-explicit-any */

type BrowserList = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Unknown';

type Platform = 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android' | 'Unknown';

/**
 * This class returns the browser platform details from the user agent string.
 */
export class CustomUserAgentData {
    private userAgent: string;
    private isTesting: boolean;
    constructor(userAgent: string, testing: boolean) {
        this.userAgent = userAgent;
        this.isTesting = testing;
    }

    /**
     *
     * To get the platform name from the user agent string.
     *
     * @hidden
     * @returns {Platform} - Returns the platform name.
     */
    public getPlatform(): Platform {
        if (!this.isTesting && (window.navigator as any).userAgentData) {
            return (window.navigator as any).userAgentData.platform;
        }
        if (/windows/i.test(this.userAgent)) {
            return 'Windows';
        }
        if (/macintosh|mac os/i.test(this.userAgent) && !(/iphone|ipad|ipod/i.test(this.userAgent))) {
            return 'macOS';
        }
        if (/linux/i.test(this.userAgent) && !(/android/i.test(this.userAgent))) {
            return 'Linux';
        }
        if (/iphone|ipad|ipod/i.test(this.userAgent)) {
            return 'iOS';
        }
        if (/android/i.test(this.userAgent)) {
            return 'Android';
        }
        return 'Unknown';
    }

    /**
     *
     * To get the platform name from the user agent string.
     *
     * @hidden
     * @returns {BrowserList} - Returns the platform name.
     */
    public getBrowser(): BrowserList {
        // At 11th February 2025 the userAgentData API is only available in chromium based browsers. Need to update the logic once the api is widely available.
        let brands: any[] = [];
        if (!this.isTesting && (window.navigator as any).userAgentData) {
            brands =  (window.navigator as any).userAgentData.brands;
            for (const brand of brands) {
                if (brand.brand === 'Google Chrome') {
                    return 'Chrome';
                } else if (brand.brand === 'Microsoft Edge') {
                    return 'Edge';
                }
            }
        }
        if (/chrome|chromium|crios/i.test(this.userAgent) && !/edg/i.test(this.userAgent)) {
            return 'Chrome';
        }
        if (/firefox|fxios/i.test(this.userAgent) && !/edg/i.test(this.userAgent)) {
            return 'Firefox';
        }
        if (/safari/i.test(this.userAgent) && !/chrome|chromium|crios/i.test(this.userAgent)) {
            return 'Safari';
        }
        if (/edg/i.test(this.userAgent)) {
            return 'Edge';
        }
        return 'Unknown';
    }

    /**
     * To check whether the browser is a mobile device.
     *
     * @hidden
     * @returns {boolean} - Returns true if the device is a mobile device.
     */
    public isMobileDevice(): boolean {
        if (!this.isTesting && (window.navigator as any).userAgentData && ((window.navigator as any).userAgentData as any).platform !== '') {
            return (window.navigator as any).userAgentData.mobile;
        }
        return /(iphone|ipod|ipad|android|blackberry|bb|playbook|windows phone|webos|opera mini|mobile)/i.test(this.userAgent);
    }

    /**
     * To check whether the browser is a mobile device.
     *
     * @hidden
     * @returns {boolean} - Returns true if the device is a mobile device.
     */
    public isSafari(): boolean {
        const platform: Platform = this.getPlatform();
        return this.getBrowser() === 'Safari' && (platform === 'macOS' || platform === 'iOS');
    }
}

