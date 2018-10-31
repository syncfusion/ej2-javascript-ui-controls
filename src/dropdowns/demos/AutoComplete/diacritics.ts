/**
 * AutoComplete Diacritics Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';

let data: string[] = ['Aeróbics', 'Aeróbics en Agua', 'Aerografía', 'Aeromodelaje', 'Águilas', 'Ajedrez', 'Ala Delta', 'Álbumes de Música', 'Alusivos', 'Análisis de Escritura a Mano'];

let listObj: AutoComplete = new AutoComplete({
    dataSource: data,
    placeholder: 'e.g: aero',
    ignoreAccent: true
});
listObj.appendTo('#list');