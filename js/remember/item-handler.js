// item handler

app.itemHandler = {};

app.itemHandler.getItems = function(doNotParse, callback) {
    chrome.storage.local.get("items", function(res){
        if ($.isEmptyObject(res)) {
            chrome.storage.local.set({
                items: []
            });
            return;
        }
        app.items = res.items;
        
        
        $.each(app.items, function(i){
            this.id = i;
            
            if (this.delete == true) {
                app.itemHandler.removeItem(i);
                $(".remembers-container .grid-wrapper").html("");
                app.itemHandler.getItems();
                return false;
            }
            
            if (doNotParse != true) {
                app.parseItem.start(i);
            }
        });
        
        if (typeof(callback) == "function") {
            callback();
        }
    });
};

chrome.storage.onChanged.addListener(function(){
    app.itemHandler.getItems(true);
});

app.itemHandler.getItem = function(id) {
    return app.items[id];
};

app.itemHandler.setItem = function(id, data) {
    var newItem = Object.assign(app.itemHandler.getItem(id), data);
    app.items[id] = newItem;
    chrome.storage.local.set({
        items: app.items
    });
    
    return newItem;
};

app.itemHandler.addURL = function(url, origTags, callback) {
    var tags = [];
    $.each(origTags, function(){
        tags.push(this.tag);
    });
    
    var id = app.items.length;
    var object = {
        type: "url",
        url: url,
        tags: tags,
        cached: 0,
        cache: {},
        id: id
    };
    
    app.items.push(object);
    
    if (typeof(callback) == "function") {
        callback(id);
    }
    
    chrome.storage.local.set({
        items: app.items
    });
};

app.itemHandler.addCode = function(title, description, origTags, callback) {
    var tags = [];
    $.each(origTags, function(){
        tags.push(this.tag);
    });
    
    var id = app.items.length;
    var object = {
        type: "code",
        title: title,
        description: description,
        tags: tags,
        language: "plain_text",
        code: "start editing!"
    };
    
    app.items.push(object);
    
    if (typeof(callback) == "function") {
        callback(id);
    }
    console.log(object);
    
    chrome.storage.local.set({
        items: app.items
    });
};

app.itemHandler.removeItem = function (id) {
    app.items.splice(id, 1);
    chrome.storage.local.set({
        items: app.items
    });
};

app.itemHandler.order = function() {
    var order = app.settingsHandler.getSetting("sort");
    
    if (order == "oldtonew") {
        tinysort(".grid-wrapper>.card", {
            order: "asc",
            data: "id"
        });
    }
    else if (order == "newtoold") {
        tinysort(".grid-wrapper>.card", {
            order: "desc",
            data: "id"
        });
    }
    else if (order == "atoz") {
        tinysort(".grid-wrapper>.card", {
            selector: ".order-title",
            order: "asc"
        });
    }
    else if (order == "ztoa") {
        tinysort(".grid-wrapper>.card", {
            selector: ".order-title",
            order: "desc"
        });
    }
};

$(window).on("app-displayed-item", app.itemHandler.order);