/**
 * Spec for L10n
 */
import { L10n } from '../src/l10n';
import {setCulture} from '../src/internationalization';
L10n.load({
    'fr-BE': {
        'button': {
            'check': 'vérifié'
        },
        'grid': {
            column: 'colonne',
            row: 'colonne'
        }
    }
});



describe('L10n', () => {
    let button: L10n;
    beforeAll(() => {
        setCulture('fr-BE');
        button = new L10n('button', {
            check: 'change',
            unique: 'uniqueProperty'
        });
    });
    let result: string;
    it('check default object and controlname set properly', () => {
        result = button.getConstant('check');
        expect(result).toBe('vérifié');
    });
    it('Dynamically load locale change locale object works properly', () => {
        L10n.load({
            'en-US': {
                'button': {
                    'check': 'checked'
                },
                'grid': {
                    column: 'columns',
                    row: 'rows'
                }
            }
        });
        button.setLocale('en-US');
        result = button.getConstant('check');
        expect(result).toBe('checked');
    });
    it('check property value returned from default if property is not present in global locale', () => {
        expect(button.getConstant('unique')).toBe('uniqueProperty');
    });
    it('check new instance created will not be affected by previous instance process', () => {
        let grid: L10n = new L10n('grid', {
            column: 'column',
            row: 'rows'
        });
        result = grid.getConstant('column');
        expect(result).toBe('colonne');
    });
    it('check getconstant returns proper constant while calling using default object', () => {
        button.setLocale('en-US');
        result = button.getConstant('check');
        expect(result).toBe('checked');
    });
    it('check property value returned from default if property is not present in same culture in global locale', () => {
        expect(button.getConstant('unique')).toBe('uniqueProperty');
    });
    it('check default object is set while locale for control is not given in the global locale for "en-US" culture ', () => {
        let scroller: L10n = new L10n(
            'scroller', {
                scrollx: 'scrollableX'
            },
            'en-US'
        );
        expect(scroller.getConstant('scrollx')).toBe('scrollableX');
    });
    it('check control instance culture sets properly while default value of localization is changed', () => {
        L10n.load({
            'af': {
                'grid': {
                    column: 'kolom',
                    row: 'ry'
                }
            }
        });
        setCulture('af');
        let grid2: L10n = new L10n('grid', {
            'column': 'col',
            'rows': 'ro'
        });
        expect(grid2.getConstant('row')).toBe('ry');
    });
    it('check setting invalid culture returns the default locale string', () => {
        let grid2: L10n = new L10n('grid', {
            'column': 'col',
            'rows': 'ro'
        }, 'assd');
        expect(grid2.getConstant('rows')).toBe('ro');
    });
    it('check invalid locale name not to throws error', () => {
        expect(() => { button.setLocale('fd'); }).not.toThrow();
    });
    it('check valid locale name not to throws error', () => {
        expect(() => { button.setLocale('en-US'); }).not.toThrow();
    });
    it('check invalid property name returns empty string', () => {
        result = button.getConstant('checked');
        expect(result).toBe('');
    });
    afterAll(() => {
        setCulture('en-US');
    });
});