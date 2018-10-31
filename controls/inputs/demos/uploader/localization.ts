/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event, L10n, setCulture } from '@syncfusion/ej2-base';

L10n.load({
    'fr-CH': {
       'uploader' : {
        "invalidMinFileSize" : "La taille du fichier est trop petite",
        "invalidMaxFileSize" : "La taille du fichier dépasse 28 Mo",
        "invalidFileType" : "Le type de fichier n'est pas autorisé",
        "Browse"  : "Feuilleter", 
        "Clear" : "Clair", 
        "Upload" : "Télécharger",
        "dropFilesHint" : "ou Déposer des fichiers ici", 
        "uploadFailedMessage" : "Impossible d'importer le fichier", 
        "uploadSuccessMessage" : "Fichier téléchargé avec succès",
        "removedSuccessMessage": "Fichier supprimé avec succès",
        "removedFailedMessage": "Le fichier n'a pas pu être supprimé",
        "inProgress": "Téléchargement",
        "readyToUploadMessage": "Prêt à télécharger", 
        "remove": "Retirer", 
        "cancel": "Annuler",
        "delete": "Supprimer le fichier"
         }
     }
});

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    autoUpload: false,
    locale: 'fr-CH'
});
uploadObj.appendTo('#fileupload')



