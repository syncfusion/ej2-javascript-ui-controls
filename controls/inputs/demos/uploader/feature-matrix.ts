/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event, L10n, setCulture, createElement } from '@syncfusion/ej2-base';

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
     },
     "de": {
        "uploader": {
            "invalidMinFileSize" : "Bestandsgrootte is te klein! Upload bestanden met een minimumgrootte van 10 kB",
            "invalidMaxFileSize" : "Bestandsgrootte groter dan 28 MB",
            "invalidFileType" : "Bestandstype is niet toegestaan",
            "Browse"  : "Blader", 
            "Clear" : "Duidelijk", 
            "Upload" : "Uploaden",
            "dropFilesHint" : "of zet hier bestanden neer", 
            "uploadFailedMessage" : "Bestand kan niet worden geüpload", 
            "uploadSuccessMessage" : "bestand succesvol geüpload",
            "removedSuccessMessage": "Bestand met succes verwijderd",
            "removedFailedMessage": "Die Datei konnte nicht entfernt werden",
            "inProgress": "uploaden",
            "readyToUploadMessage": "Klaar om te uploaden", 
            "remove": "Verwijderen", 
            "cancel": "Annuleer",
            "delete": "Verwijder bestand",
            "abort": "Abbrechen",
            "pauseUpload": "Datei-Upload wurde angehalten",
            "pause": "Pausieren",
            "resume": "Fortsetzen",
            "retry": "Wiederholen",
            "fileUploadCancel": "Datei-Upload abgebrochen"
        }
    },
    "ar": {
        "uploader": {
            "invalidMinFileSize" : "جم الملف صغير جدا! الرجاء تحميل ملفات بحد أدنى 10 كيلوبايت",
            "invalidMaxFileSize" : "يتجاوز حجم الملف 28 ميغابايت",
            "invalidFileType" : "نوع الملف غير مسموح به",
            "Browse"  : "تصفح", 
            "Clear" : "واضح", 
            "Upload" : "تحميل",
            "dropFilesHint" : "أو إسقاط الملفات هنا", 
            "uploadFailedMessage" : "أخفق تحميل الملف", 
            "uploadSuccessMessage" : "تم رفع الملف بنجاح",
            "removedSuccessMessage": "تمت إزالة الملف بنجاح",
            "removedFailedMessage": "أغير قادر على إزالة الملف",
            "inProgress": "تحميل",
            "readyToUploadMessage": "جاهز للتحميل", 
            "remove": "إزالة", 
            "cancel": "إلغاء",
            "delete": "حذف ملف",
            "abort": "إحباط",
            "pauseUpload": "تم إيقاف تحميل الملف مؤقتًا",
            "pause": "وقفة",
            "resume": "استئنف",
            "retry": "إعادة المحاولة",
            "fileUploadCancel": "تم إلغاء تحميل الملف"
        }
    },
    "en": {
        "uploader": {
            "invalidMinFileSize" : "File size is too small! Please upload files with minimum 10 KB size",
            "invalidMaxFileSize" : "File size exceeds 28 MB",
            "invalidFileType" : "File type is not allowed",
            "Browse"  : "Browse...", 
            "Clear" : "Clear",
            "Upload" : "Upload",
            "dropFilesHint" : "Or drop files here", 
            "uploadFailedMessage" : "File failed to upload", 
            "uploadSuccessMessage" : "File uploaded successfully",
            "removedSuccessMessage": "File removed successfully",
            "removedFailedMessage": "Unable to remove file",
            "inProgress": "Uploading",
            "readyToUploadMessage": "Ready to upload", 
            "remove": "Remove", 
            "cancel": "Cancel",
            "delete": "Delete file",
            "abort": "Abort",
            "pauseUpload": "File upload paused",
            "pause": "Pause",
            "resume": "Resume",
            "retry": "Retry",
            "fileUploadCancel": "File upload cancelled"
        }
    },
    "zh": {
        "uploader": {
            "invalidMinFileSize" : "文件太小了！請上傳至少10 KB大小的文件",
            "invalidMaxFileSize" : "文件大小超過4 MB",
            "invalidFileType" : "文件類型是不允許的",
            "Browse"  : "瀏覽", 
            "Clear" : "明確", 
            "Upload" : "上傳",
            "dropFilesHint" : "或在這裡刪除文件", 
            "uploadFailedMessage" : "文件無法上傳", 
            "uploadSuccessMessage" : "文件上傳成功",
            "removedSuccessMessage": "文件已成功刪除",
            "removedFailedMessage": "无法删除文件",
            "inProgress": "上傳",
            "readyToUploadMessage": "準備上傳", 
            "remove": "去掉", 
            "cancel": "取消",
            "delete": "刪除文件",
            "abort": "退出",
            "pauseUpload": "文件上传已暂停",
            "pause": "暂停",
            "resume": "恢复",
            "retry": "重试",
            "fileUploadCancel": "文件上傳已取消"
        }
    }
});

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    change: onchange
});
uploadObj.appendTo('#fileupload');