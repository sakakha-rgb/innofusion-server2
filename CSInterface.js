/**
 * CSInterface - Adobe CEP Communication Layer
 * Version 11.0 (for Premiere Pro 2021+)
 */

function CSInterface() {
    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
}

CSInterface.prototype.evalScript = function(script, callback) {
    if (callback === null || callback === undefined) {
        callback = function(result) {};
    }
    window.__adobe_cep__.evalScript(script, callback);
};

CSInterface.prototype.getSystemPath = function(pathType) {
    var path = window.__adobe_cep__.getSystemPath(pathType);
    return decodeURI(path);
};

CSInterface.prototype.openURLInDefaultBrowser = function(url) {
    window.__adobe_cep__.openURLInDefaultBrowser(url);
};

CSInterface.prototype.getHostEnvironment = function() {
    return JSON.parse(window.__adobe_cep__.getHostEnvironment());
};

// System Path Types
var SystemPath = {
    USER_DATA: "userData",
    COMMON_FILES: "commonFiles",
    MY_DOCUMENTS: "myDocuments",
    APPLICATION: "application",
    EXTENSION: "extension",
    HOST_APPLICATION: "hostApplication"
};

// Event types
var CSEvent = function(type, scope, appId, extensionId, data) {
    this.type = type;
    this.scope = scope;
    this.appId = appId;
    this.extensionId = extensionId;
    this.data = data;
};

CSInterface.prototype.dispatchEvent = function(event) {
    window.__adobe_cep__.dispatchEvent(event);
};

CSInterface.prototype.addEventListener = function(type, listener, obj) {
    window.__adobe_cep__.addEventListener(type, listener, obj);
};

CSInterface.prototype.removeEventListener = function(type, listener, obj) {
    window.__adobe_cep__.removeEventListener(type, listener, obj);
};

// Make it global
window.CSInterface = CSInterface;
window.SystemPath = SystemPath;
window.CSEvent = CSEvent;