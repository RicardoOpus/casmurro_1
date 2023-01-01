/*
Mod version number to force system wide update
*/
var version = "3.0.3.3";
console.log("Version ", version);
var versionTrigger = "?=_" + version;
'use strict';
importScripts('sw-toolbox.js');
toolbox.precache([
    "index.html" + versionTrigger,
    "script.js" + versionTrigger,
    "global/css/global.css" + versionTrigger,
    "global/init.js" + versionTrigger,
    "components/navbar/navbar.html" + versionTrigger,
    "components/navbar/script.js" + versionTrigger,
    "components/newCharacter/page.html" + versionTrigger,
    "components/newCharacter/script.js" + versionTrigger,
    "icons/icon.png" + versionTrigger,
    "node_modules/jquery/dist/jquery.min.js" + versionTrigger,
    "assets/js/dixie.js" + versionTrigger,
    "global/dataManager.js" + versionTrigger,
    "pages/mundo/page.html" + versionTrigger,
    "pages/mundo/script.js" + versionTrigger,
    "pages/notas/page.html" + versionTrigger,
    "pages/notas/script.js" + versionTrigger,
    "pages/personagens/page.html" + versionTrigger,
    "pages/personagens/script.js" + versionTrigger,
    "pages/timeline/page.html" + versionTrigger,
    "pages/timeline/script.js" + versionTrigger
]);
toolbox.router.get('/*', toolbox.cacheFirst, {
    networkTimeoutSeconds: 5
});

