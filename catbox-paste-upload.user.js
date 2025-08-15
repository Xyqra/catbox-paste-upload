// ==UserScript==
// @name         Catbox Paste Upload (Image + Text)
// @namespace    https://xyqra.com/catbox-paste-upload.user.js
// @version      1.1
// @description  Paste images or text directly into Catbox's upload form without saving first.
// @author       you
// @match        https://catbox.moe/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForDropzone() {
        if (window.Dropzone && Dropzone.instances.length > 0) {
            initPasteSupport(Dropzone.instances[0]);
        } else {
            setTimeout(waitForDropzone, 200);
        }
    }

    function initPasteSupport(dropzoneInstance) {
        console.log("[Catbox Paste Upload] Dropzone found, enabling paste support.");

        document.addEventListener('paste', function (event) {
            if (!event.clipboardData) return;

            let items = event.clipboardData.items;
            let handled = false;

            // Check for image first
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    let file = item.getAsFile();
                    if (file) {
                        console.log("[Catbox Paste Upload] Pasted image detected, adding to Dropzone:", file.name);
                        dropzoneInstance.addFile(file);
                        handled = true;
                    }
                }
            }

            // If no image found, check for text
            if (!handled) {
                let text = event.clipboardData.getData('text/plain');
                if (text && text.trim().length > 0) {
                    console.log("[Catbox Paste Upload] Pasted text detected, converting to .txt and adding to Dropzone.");
                    let blob = new Blob([text], { type: 'text/plain' });
                    let file = new File([blob], "pasted_text.txt", { type: 'text/plain' });
                    dropzoneInstance.addFile(file);
                    handled = true;
                }
            }

            if (handled) {
                event.preventDefault();
            }
        });
    }

    waitForDropzone();
})();
