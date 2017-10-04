// item parser

app.parseItem = {};

app.parseItem.start = function(id) {
    var item = app.itemHandler.getItem(id);
    if (item.type == "url") {
        if (((new Date) - item.cached) > (5 * 24 * 60 * 60 * 1000) || $.isEmptyObject(item.cache) || $.isEmptyObject(item.cache.meta)) {
            $.ajax({
                url: "https://api.urlmeta.org/?url=" + encodeURIComponent(item.url),
                dataType: "json"
            }).done(function(res){
                console.log(res);
                if (res.result.status == "OK") {
                    app.itemHandler.setItem(id, {
                        cache: res,
                        cached: Date.now()
                    });
                }
                else {
                    app.itemHandler.setItem(id, {
                        cache: { meta: {} },
                        cached: Date.now()
                    });
                }
                
                app.parseItem.display(id);
            }).fail(function(){
                app.itemHandler.setItem(id, {
                    cache: { meta: {} },
                    cached: Date.now()
                });
                app.parseItem.display(id);
            });
        }
        else {
            app.parseItem.display(id);
        }
    }
    else {
        app.parseItem.display(id);
    }
};

app.parseItem.display = function(id) {
    var item = app.itemHandler.getItem(id);
    
    if (item.type == "url") {
        var elements = {};
        var html = '<div class="card horizontal flex flex-column select-ok" data-id="' + id + '">\
                        <div class="flex">';
        
        if (item.cache.meta.favicon) {
            elements.icon = item.cache.meta.favicon;
            
            html += '<div class="card-image">\
                        <img src="' + elements.icon + '">\
                    </div>';
        }
        else {
            html += '<div class="card-image card-image-icon">\
                        <i class="material-icons">web</i>\
                    </div>';
        }
        
        if (item.cache.meta.title) {
            elements.title = item.cache.meta.title;
            if (elements.title.length > 100) {
                elements.title = elements.title.substr(0, 100) + "...";
            }
            
            html += '<div class="card-stacked">\
                        <div class="card-content">\
                            <p><strong class="order-title">' + elements.title + '</strong></p>';
        }
        else {
            elements.url = item.url;
            if (elements.url.length > 100) {
                elements.url = elements.url.substr(0, 100) + "...";
            }
            
            html += '<div class="card-stacked">\
                        <div class="card-content">\
                            <p><strong>' + elements.url + '</strong></p>';
        }
        
        if (item.cache.meta.description) {
            elements.description = item.cache.meta.description;
            if (elements.description.length > 150) {
                elements.description = elements.description.substr(0, 150) + "...";
            }
            
            html += '<p>' + elements.description + '</p>';
        }
        
        if (item.cache.meta.title) {
            html += '<p class="grey-text"><small><i>' + item.url + '</i></small></p>';
        }
        
        if (item.tags.length > 0) {
            html += '<br>';
            $.each(item.tags, function(){
                html += '<div class="chip">' + this + '</div>';
            });
        }
        
        html += '                   </div>\
                                </div>\
                            </div>\
                        <div class="card-action no-pad right-align" data-id="' + id + '">\
                            <a href="#!" class="waves-effect waves-light btn-flat indigo-text copy-btn">Copy</a>\
                            <a href="#!" class="waves-effect waves-light btn-flat indigo-text open-btn">Open</a>\
                            <a href="#!" class="waves-effect waves-light btn-flat indigo-text delete-btn">Delete</a>\
                        </div>\
                    </div>';
        
        $(".remembers-container .grid-wrapper").append(html);
    }
    else if (item.type == "code") {
        var html = '<div class="card select-ok indigo flex flex-column" data-id="' + id + '">\
                        <div class="card-content white-text">\
                            <span class="card-title"><i class="material-icons icon-small">code</i> <span class="order-title">' + item.title + '</span></span>\
                            <p>' + item.description + '</p>\
                            <br>';
        
        $.each(item.tags, function(){
            html += '<div class="chip">' + this + '</div>';
        });
        
        html += '   </div>\
                    <div class="card-action right-align" data-id="' + id + '">\
                        <a href="#!" class="waves-effect waves-light btn-flat white-text copy-btn">Copy</a>\
                        <a href="#!" class="waves-effect waves-light btn-flat white-text open-btn">Edit</a>\
                        <a href="#!" class="waves-effect waves-light btn-flat white-text delete-btn">Delete</a>\
                    </div>\
                </div>';
        
        $(".remembers-container .grid-wrapper").append(html);
    }
    
    $(window).trigger("app-displayed-item");
};