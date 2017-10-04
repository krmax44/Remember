app.settingsHandler = {};

app.settingsHandler.getSettings = function(callback) {
    chrome.storage.local.get(app.defaultSettings, function(res){
        app.settings = res.settings;
        app.settingsHandler.listen();
        if (typeof(callback) == "function") {
            callback();
        }
    });
};

chrome.storage.onChanged.addListener(function(){
    app.settingsHandler.getSettings();
});

app.settingsHandler.getSetting = function(key) {
    return app.settings[key];
};

app.settingsHandler.setSetting = function(key, value) {
    app.settings[key] = value;
    chrome.storage.local.set({
        settings: app.settings
    });
    
    return app.settings[key];
};

app.settingsHandler.listen = function(){
    $(".setting").each(function(){
        console.log($(this).data("key"));
        $(this).val(app.settingsHandler.getSetting($(this).data("key")));
    }).off("change").on("change", function(){
        app.settingsHandler.setSetting($(this).attr("data-key"), $(this).val());
        if ($(this).attr("data-onchange")) {
            console.log("exec");
            app[$(this).attr("data-onchange")]();
        }
    });
};