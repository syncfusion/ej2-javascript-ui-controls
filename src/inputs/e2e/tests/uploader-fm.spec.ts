
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";

const path = require('path');
var absoluteDocPath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Uploader.docx');
var absoluteDocPathS = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Study.docx');
var mp3FilePath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Demo.mp3');
var absoluteImagePath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Life.jpg');
if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1100, 800);
}

describe('Uploader Feature Matrix - ', function () {
    it('AutoUpload with rtl', function() {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_default');
        element(By.id('rtl')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_rtl');
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_rtl_files');
    });
    it('Set AutoUpload false dynamically', function() {
        element(By.id('checkAutoUpload')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_change_autoUpload');
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(1000);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_rtl_files2');
    });
    it('Disable multiple upload', function () {
        element(By.id('multiple')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(9000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_singleUpload");
    });
    it('Enable multiple upload', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(5000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_multipleUpload");        
    });
    it('Rtl with disable the uploader', function() {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('rtl')).click();
        browser.sleep(500);
        element(By.id('enabledUpload')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_rtl_disabled');
    });
    it('Disable and enable the upload', function() {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('checkAutoUpload')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(500);
        browser.sleep(2000);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_enabled');
        element(By.className('enabled')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.className('fm_upload')), 'upload_fm_disabled');
    });
    it('Enable chunk upload', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('chunk')).sendKeys('10240');
        element(By.id('dummy')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(800);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_chunk_start");
        element(By.className('e-file-pause-btn')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_chunk_pause");
        element(By.className('e-file-play-btn')).click();
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_chunk_play");
        element(By.className('e-file-abort-btn')).click();
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_chunk_abort");
        element(By.className('e-file-reload-btn')).click();
        browser.sleep(7000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_chunk_restarted");       
    });
    it('Change browse button texts', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('checkAutoUpload')).click();
        browser.sleep(500);
        element(By.id('browse')).sendKeys('Choose files...');
        element(By.id('dummy')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_browse_btn");        
    });
    it('Change action buttons texts', function () {
        element(By.id('uploadBtn')).sendKeys('Upload All');
        element(By.id('clear')).sendKeys('Clear All');
        element(By.id('dummy')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(800);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_upload-&-clear_btns");        
    });
    it('Min file validation', function () {
        element(By.id('minfileSize')).sendKeys('15000');
        element(By.id('dummy')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(800);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_minFileSize");        
    });
    it('Max file validation', function () {
        element(By.id('maxfileSize')).sendKeys('3000000');
        element(By.id('dummy')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(mp3FilePath);
        browser.sleep(800);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_maxFileSize");        
    });
    it('Localization testing', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('checkAutoUpload')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(1000);
        let locale: string[] = ['en-US', 'fr-CH', 'de', 'ar', 'zh'];
        for( let i = 0 ; i < locale.length; i++ ) {
            element(By.id('locale')).sendKeys(locale[i]);
            browser.sleep(1000);
            browser.actions().mouseMove(element(By.className('e-file-remove-btn'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(By.className('fm_upload')), "upload_fm_" + locale[i] + "_culture");
        }
    });
    it('Allowed extensions testing', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('allowExtensions')).sendKeys('.docx');
        element(By.id('dummy')).click();
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_denied_extension");
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_allowed_extension");
    });
    it('Upload and upload All method testing', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('checkAutoUpload')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(1000);
        element(By.id('upload')).sendKeys('1');
        browser.sleep(500);
        element(By.id('uploadfile')).click();
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_upload_specific");   
        browser.sleep(500);
        element(By.id('upload')).sendKeys('');
        browser.sleep(500);
        element(By.id('uploadfile')).click();
        browser.sleep(9000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_upload_all");       
    });
    it('Clear All and destroy methods testing', function () {
        element(By.id('cancelAll')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_clear_all");   
        browser.sleep(500);
        element(By.id('destroy')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_destroy");       
    });
    it('Pause, Resume and Retry methods testing', function () {
        browser.load('/demos/uploader/feature-matrix.html');
        browser.sleep(500);
        element(By.id('chunk')).sendKeys('10240');
        element(By.id('dummy')).click();
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(800);
        element(By.id('pauseFile')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_pause_method");
        element(By.id('resumeFile')).click();
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_play_method");
        element(By.id('cancelFile')).click();
        browser.sleep(3000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_cancel_method");
        element(By.id('retryFile')).click();
        browser.sleep(7000);
        browser.compareScreen(element(By.className('fm_upload')), "upload_fm_retry_method");       
    });
});

describe('Uploader Feature Tour - ', function () {
    it('preload files', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/uploader/preload-files/');
        browser.sleep(1500);
        browser.compareScreen(element(By.className('e-upload')), 'upload_ft_preload');
        browser.actions().click(element(By.className('e-file-delete-btn'))).perform().then(function(){
            browser.sleep(3000);
            browser.compareScreen(element(By.className('e-upload')), 'upload_ft_preload_removed');
        });
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(1000);
        browser.compareScreen(element(By.className('e-upload')), 'upload_ft_preload_add_file');
        element(By.className('e-file-upload-btn')).click();
        browser.sleep(3000);
        browser.compareScreen(element(By.className('e-upload')), 'upload_ft_preload_uploaded');
        element(By.className('e-file-clear-btn')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.className('e-upload')), 'upload_ft_preload_cleared');
    });
});
