/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple, L10n } from '@syncfusion/ej2-base';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

L10n.load({
    'de-DE': {
        'spreadsheet': {
            'Cut': 'Schneiden',
            'Copy': 'Kopieren',
            'Paste': 'Paste',
            'PasteSpecial': 'paste spezial',
            'All': 'Alles',
            'Values': 'Werte',
            'Formats': 'Formate',
            'Font': 'Schriftart',
            'FontSize': 'Schriftgröße',
            'Bold': 'Fett gedruckt',
            'Italic': 'Kursiv',
            'Underline': 'Unterstreichen',
            'Strikethrough': 'Durchgestrichen',
            'TextColor': 'Textfarbe',
            'FillColor': 'Füllfarbe',
            'HorizontalAlignment': 'Horizontale Ausrichtung',
            'AlignLeft': 'Linksbündig ausrichten',
            'AlignCenter': 'Center',
            'AlignRight': 'Rechtsbündig ausrichten',
            'VerticalAlignment': 'Vertikale Ausrichtung',
            'AlignTop': 'Oben ausrichten',
            'AlignMiddle': 'Mitte ausrichten',
            'AlignBottom': 'Unten ausrichten',
            'InsertFunction': 'Funktion einfügen',
            'Insert': 'Einfügen',
            'Delete': 'Löschen',
            'Rename': 'Umbenennen',
            'Hide': 'verbergen',
            'Unhide': 'Sichtbar machen',
            'NameBox': 'Namensfeld',
            'ShowHeaders': 'Kopfzeilen anzeigen',
            'HideHeaders': 'Header ausblenden',
            'ShowGridLines': 'Gitternetzlinien anzeigen',
            'HideGridLines': 'Gitternetzlinien ausblenden',
            'AddSheet': 'Blatt hinzufügen',
            'ListAllSheets': 'Alle Blätter auflisten',
            'FullScreen': 'Vollbild',
            'CollapseToolbar': 'Zusammenbruch symbolleiste',
            'ExpandToolbar': 'Erweitern Symbolleiste',
            'CollapseFormulaBar': 'Collapse Formelleiste',
            'ExpandFormulaBar': 'Expand Formelleiste',
            'File': 'Datei',
            'Home': 'Huis',
            'Formulas': 'Formeln',
            'View': 'Aussicht',
            'New': 'Neu',
            'Open': 'Öffnen',
            'SaveAs': 'Speichern als',
            'ExcelXlsx': 'Microsoft Excel',
            'ExcelXls': 'Microsoft Excel 97-2003',
            'CSV': 'Comma-separated values',
            'FormulaBar': 'Formelleiste',
            'Ok': 'OK',
            'Close': 'Schließen',
            'Cancel': 'Abbrechen',
            'Apply': 'Anwenden',
            'MoreColors': 'Mehr Farben',
            'StandardColors': 'Standard farben',
            'General': 'Allgemeines',
            'Number': 'Nummer',
            'Currency': 'Währung',
            'Accounting': 'Buchhaltung',
            'ShortDate': 'Kurzes Date',
            'LongDate': 'Langes Datum',
            'Time': 'Zeit',
            'Percentage': 'Prozentsatz',
            'Fraction': 'Fraktion',
            'Scientific': 'Wissenschaft',
            'Text': 'Text',
            'NumberFormat': 'Zahlenformat',
            'MobileFormulaBarPlaceHolder': 'Wert oder Formel eingeben',
            'PasteAlert': 'Sie können dies hier nicht einfügen, da der Kopierbereich und der Einfügebereich nicht dieselbe Größe haben. Bitte versuchen Sie es in einem anderen Bereich.',
            'DestroyAlert': 'Möchten Sie die aktuelle Arbeitsmappe wirklich löschen, ohne sie zu speichern, und eine neue Arbeitsmappe erstellen?',
            'SheetRenameInvalidAlert': 'Der Blattname enthält ein ungültiges Zeichen.',
            'SheetRenameEmptyAlert': 'Der Blattname darf nicht leer sein.',
            'SheetRenameAlreadyExistsAlert': 'Der Blattname ist bereits vorhanden. Bitte geben Sie einen anderen Namen ein.',
            'DeleteSheetAlert': 'Möchten Sie dieses Blatt wirklich löschen?',
            'DeleteSingleLastSheetAlert': 'Eine Arbeitsmappe muss mindestens ein sichtbares Arbeitsblatt enthalten.',
            'PickACategory': 'Wählen Sie eine Kategorie',
            'Description': 'Beschreibung',
            'UnsupportedFile': 'Nicht unterstützte Datei',
            'InvalidUrl': 'Ungültige URL',
            'SUM': 'Fügt eine Reihe von Zahlen und / oder Zellen hinzu.',
            'SUMIF': 'Fügt die Zellen basierend auf der angegebenen Bedingung hinzu.',
            'SUMIFS': 'Fügt die Zellen basierend auf den angegebenen Bedingungen hinzu.',
            'ABS': 'Gibt den Wert einer Zahl ohne Vorzeichen zurück.',
            'RAND': 'Gibt eine Zufallszahl zwischen 0 und 1 zurück.',
            'RANDBETWEEN': 'Gibt eine zufällige Ganzzahl basierend auf angegebenen Werten zurück.',
            'FLOOR': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors ab.',
            'CEILING': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors.',
            'PRODUCT': 'Multipliziert eine Reihe von Zahlen und / oder Zellen.',
            'AVERAGE': 'Berechnen Sie den Durchschnitt für die Reihe von Zahlen und / oder Zellen ohne Text.',
            'AVERAGEIF': 'Berechnet den Durchschnitt für die Zellen basierend auf der angegebenen Bedingung.',
            'AVERAGEIFS': 'Berechnet den Durchschnitt für die Zellen basierend auf den angegebenen Bedingungen.',
            'AVERAGEA': 'Berechnet den Durchschnitt für die Zellen, wobei WAHR als 1, text und FALSCH als 0 ausgewertet werden.',
            'COUNT': 'Zählt die Zellen, die numerische Werte in einem Bereich enthalten.',
            'COUNTIF': 'Zählt die Zellen basierend auf der angegebenen Bedingung.',
            'COUNTIFS': 'Zählt die Zellen basierend auf den angegebenen Bedingungen.',
            'COUNTA': 'Zählt die Zellen, die Werte in einem Bereich enthalten.',
            'MIN': 'Gibt die kleinste Anzahl der angegebenen Argumente zurück.',
            'MAX': 'Gibt die größte Anzahl der angegebenen Argumente zurück.',
            'DATE': 'Gibt das Datum basierend auf einem bestimmten Jahr, Monat und Tag zurück.',
            'DAY': 'Gibt den Tag ab dem angegebenen Datum zurück.',
            'DAYS': 'Gibt die Anzahl der Tage zwischen zwei Daten zurück.',
            'IF': 'Gibt einen Wert basierend auf dem angegebenen Ausdruck zurück.',
            'IFS': 'Gibt einen Wert zurück, der auf den angegebenen mehreren Ausdrücken basiert.',
            'AND': 'Gibt WAHR zurück, wenn alle Argumente WAHR sind, andernfalls wird FALSCH zurückgegeben.',
            'OR': 'Gibt WAHR zurück, wenn eines der Argumente WAHR ist, andernfalls wird FALSCH zurückgegeben.',
            'IFERROR': 'Gibt einen Wert zurück, wenn kein Fehler gefunden wurde. Andernfalls wird der angegebene Wert zurückgegeben.',
            'CHOOSE': 'Gibt einen Wert aus der Werteliste basierend auf der Indexnummer zurück.',
            'INDEX': 'Gibt einen Wert der Zelle in einem bestimmten Bereich basierend auf der Zeilen- und Spaltennummer zurück.',
            'FIND': 'Gibt die Position eines Strings innerhalb eines anderen Strings zurück, wobei die Groß- und Kleinschreibung beachtet wird.',
            'CONCATENATE': 'Kombiniert zwei oder mehr Zeichenfolgen.',
            'CONCAT': 'Verkettet eine Liste oder einen Bereich von Textzeichenfolgen.',
            'SUBTOTAL': 'Gibt die Zwischensumme für einen Bereich unter Verwendung der angegebenen Funktionsnummer zurück.',
            'RADIANS': 'Konvertiert Grad in Bogenmaß.',
            'MATCH': 'Gibt die relative Position eines angegebenen Wertes im angegebenen Bereich zurück.',
            'DefineNameExists': 'Dieser Name ist bereits vorhanden, versuchen Sie es mit einem anderen Namen.',
            'CircularReference': 'Wenn eine Formel auf einen oder mehrere Zirkelverweise verweist, kann dies zu einer falschen Berechnung führen.'
        }
    }
});

let sheet: SheetModel[] = [{
    rows: [{
        index: 0,
        cells: [{ index: 0, value: 'a1' },
        { index: 1, value: 'b1' },
        { index: 2, value: 'c1' },
        { index: 3, value: 'd1' },
        { index: 4, value: 'e1' }]
    },
    {
        index: 1,
        cells: [{ index: 0, value: 'a2' },
        { index: 1, value: 'b2' },
        { index: 2, value: 'c2' },
        { index: 3, value: 'd2' },
        { index: 4, value: 'e2' },]
    },
    {
        index: 2,
        cells: [{ index: 0, value: 'a3' },
        { index: 1, value: 'b3' },
        { index: 2, value: 'c3' },
        { index: 3, value: 'd3' },
        { index: 4, value: 'e3' },]
    },
    {
        index: 3,
        cells: [{ index: 0, value: 'a4' },
        { index: 1, value: 'b4' },
        { index: 2, value: 'c4' },
        { index: 3, value: 'd4' },
        { index: 4, value: 'e4' },]
    },
    {
        index: 4,
        cells: [{ index: 0, value: 'a5' },
        { index: 1, value: 'b5' },
        { index: 2, value: 'c5' },
        { index: 3, value: 'd5' },
        { index: 4, value: 'e5' },]
    },
    {
        index: 5,
        cells: [{ index: 0, value: 'a6' },
        { index: 1, value: 'b6' },
        { index: 2, value: 'c6' },
        { index: 3, value: 'd6' },
        { index: 4, value: 'e6' },]
    }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Open',
    saveUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Export',
    locale: 'de-DE'
});

spreadsheet.appendTo('#spreadsheet');