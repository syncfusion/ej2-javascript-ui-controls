import '../../node_modules/es6-promise/dist/es6-promise';
import { L10n } from '@syncfusion/ej2-base';
import { FileManager } from '../../src/file-manager/base/file-manager';
import { NavigationPane, DetailsView } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';

FileManager.Inject(NavigationPane, DetailsView, Toolbar);

L10n.load({
    'de-DE': {
        'filemanager': {
            "NewFolder": "Neuer Ordner",
            "Upload": "Hochladen",
            "Delete": "Löschen",
            "Rename": "Umbenennen",
            "Download": "Herunterladen",
            "Cut": "Schnitt",
            "Copy": "Kopieren",
            "Paste": "Einfügen",
            "SortBy": "Sortiere nach",
            "Refresh": "Aktualisierung",
            "Selection": "Elemente ausgewählt",
            "View": "Aussicht",
            "Details": "Einzelheiten",
            "SelectAll": "Wählen Sie Alle",
            "Open": "Öffnen",
            "Tooltip-NewFolder": "Neuer Ordner",
            "Tooltip-Upload": "Hochladen",
            "Tooltip-Delete": "Löschen",
            "Tooltip-Rename": "Umbenennen",
            "Tooltip-Download": "Herunterladen",
            "Tooltip-Cut": "Schnitt",
            "Tooltip-Copy": "Kopieren",
            "Tooltip-Paste": "Einfügen",
            "Tooltip-SortBy": "Sortiere nach",
            "Tooltip-Refresh": "Aktualisierung",
            "Tooltip-Selection": "Auswahl löschen",
            "Tooltip-View": "Aussicht",
            "Tooltip-Details": "Einzelheiten",
            "Tooltip-SelectAll": "Wählen Sie Alle",
            "Name": "Name",
            "Size": "Größe",
            "DateModified": "Datum geändert",
            "DateCreated": "Datum erstellt",
            "Location": "Ort",
            "Type": "Art",
            "Ascending": "Aufsteigend",
            "Descending": "Absteigend",
            "View-LargeIcons": "Große Icons",
            "View-Details": "Einzelheiten",
            "Search": "Suche",
            "Button-Ok": "OK",
            "Button-Cancel": "Stornieren",
            "Button-Yes": "Ja",
            "Button-No": "Nein",
            "Header-NewFolder": "Ordner erstellen",
            "Content-NewFolder": "Geben Sie einen Namen für den neuen Ordner ein:",
            "Header-Rename": "Artikel umbenennen",
            "Content-Rename": "Geben Sie einen neuen Namen für den Artikel ein:",
            "Header-Rename-Confirmation": "Bestätigung umbenennen",
            "Content-Rename-Confirmation": "Wenn Sie die Dateinamenerweiterung ändern, wird die Datei möglicherweise instabil. Möchten Sie sie wirklich ändern?",
            "Header-Delete": "Datei löschen",
            "Content-Delete": "Möchten Sie diese Datei wirklich löschen?",
            "Header-Multiple-Delete": "Mehrere Dateien löschen",
            "Content-Multiple-Delete": "Möchten Sie diese {0} -Dateien wirklich löschen?",
            "Header-Details": "Datei Details",
            "Header-Multiple-Details": "Datei Details",
            "Header-Duplicate": "Datei existiert",
            "Content-Duplicate": "ist bereits vorhanden. Möchten Sie es wirklich ersetzen?",
            "Error": "Error",
            "Validation-Empty": "Dateiname darf nicht leer sein!",
            "Validation-Invalid": "Dateiname darf keines der folgenden Zeichen enthalten: \\ /: *? \" <> | ",
            "Folder-Empty": "Dieser Ordner ist leer",
            "File-Upload": "Dateien zum Hochladen hierher ziehen",
            "Search-Empty": "Keine Ergebnisse gefunden",
            "Search-Key": "Versuchen Sie es mit anderen Suchbegriffen"
        }
    }
})

let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: 'http://localhost:59302/api/FileManager/FileOperations',
        uploadUrl: 'http://localhost:59302/api/FileManager/Upload',
        downloadUrl: 'http://localhost:59302/api/FileManager/Download',
        getImageUrl: 'http://localhost:59302/api/FileManager/GetImage'
    },
    locale: 'de-DE'
});
feObj.appendTo('#file');