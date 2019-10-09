import { extend, isNullOrUndefined } from './util';
import { defaultCulture } from './internationalization';
/**
 * L10n modules provides localized text for different culture.
 * ```typescript
 * import {setCulture} from '@syncfusion/ts-base-library';
 * //load global locale object common for all components.
 * L10n.load({
 *    'fr-BE': {
 *       'button': {
 *            'check': 'vérifié'
 *        }
 *    }
 * });
 * //set globale default locale culture.
 * setCulture('fr-BE');
 * let instance: L10n = new L10n('button', {
 *    check: 'checked'
 * });
 * //Get locale text for current property.
 * instance.getConstant('check');
 * //Change locale culture in a component.
 * instance.setLocale('en-US');
 * ```
 */

export class L10n {
    private static locale: Object = {};
    private controlName: string;
    private localeStrings: Object;
    private currentLocale: Object;
    /**
     * Constructor 
     */
    constructor(controlName: string, localeStrings: Object, locale?: string, ) {
        this.controlName = controlName;
        this.localeStrings = localeStrings;
        this.setLocale(locale || defaultCulture);
    }

    /**
     * Sets the locale text
     * @param {string} locale 
     * @returns {void}
     */

    public setLocale(locale: string): void {
        let intLocale: Object = this.intGetControlConstant(L10n.locale, locale);
        this.currentLocale = intLocale || this.localeStrings;
    }
    /**
     * Sets the global locale for all components.
     * @param {Object} localeObject - specifies the localeObject to be set as global locale.
     */
    public static load(localeObject: Object): void {
        this.locale = extend(this.locale, localeObject, {}, true);
    }
    /**
     * Returns current locale text for the property based on the culture name and control name.
     * @param {string} propertyName - specifies the property for which localize text to be returned.
     * @return string
     */
    public getConstant(prop: string): string {
        // Removed conditional operator because this method does not return correct value when passing 0 as value in localization
        if (!isNullOrUndefined(this.currentLocale[prop])) {
            return this.currentLocale[prop];
        } else {
            return this.localeStrings[prop] || '';
        }
    }

    /**
     * Returns the control constant object for current object and the locale specified.
     * @param {Object} curObject 
     * @param {string} locale 
     * @returns {Object}
     */

    private intGetControlConstant(curObject: Object, locale: string): Object {
        if ((curObject)[locale]) {
            return (curObject)[locale][this.controlName];
        }
        return null;
    }
}