$(document).ready(function(){
    $(".modal").modal();
    $(".chips").material_chip({
        placeholder: "Enter tags..."
    });
    
    app.settingsHandler.getSettings(function(){
        app.itemHandler.getItems();
    
        $("select").material_select();

        $("#search").on("keyup", function(){
            var filter = $(this).val();
            $(".remembers-container .card").each(function(){
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();
                } else {
                    $(this).show();
                }
            });
        });
    });
});

app.btn = {};

app.btn.open = function(){
    var item = app.itemHandler.getItem(parseInt($(this).parent().attr("data-id")));
    
    if (item.type == "url") {
        window.open(item.url, "_blank");
    }
    else if (item.type == "code") {
        window.open("editor.html#" + item.id, "_blank");
    }
};

app.btn.copy = function(){
    var item = app.itemHandler.getItem(parseInt($(this).parent().attr("data-id")));
    var text;
    
    if (item.type == "url") {
        text = item.url;
    }
    else if (item.type == "code") {
        text = item.code;
    }

    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
    
    $(".copy-btn").text("Copy");
    $(this).text("Copied!");
};

app.btn.delete = function(){
    if ($(this).attr("data-delete") == "1") {
        $(this).parent().parent().remove();
        app.itemHandler.setItem(parseInt($(this).parent().attr("data-id")), {
            delete: true
        });
    }
    else {
        $(this).attr("data-delete", "1").text("Sure?");
    }
};

$(window).on("app-displayed-item", function(){
    $(".open-btn").off("click").on("click", app.btn.open);
    $(".copy-btn").off("click").on("click", app.btn.copy);
    $(".delete-btn").off("click").on("click", app.btn.delete);
    $(".card-image img").off("error").on("error", function(){
        $(this).parent().addClass("card-image-icon").append("<i class='material-icons'>web</i>");
        $(this).remove();
    });
});

$("#add-url-btn").on("click", function(){
    app.itemHandler.addURL($("#add-url-input").val(), $("#add-url-tags").material_chip("data"), function(id){
        app.parseItem.start(id);
    });
});

$("#add-code-btn").on("click", function(){
    app.itemHandler.addCode($("#add-code-name").val(), $("#add-code-description").val(), $("#add-code-tags").material_chip("data"), function(id){
        app.parseItem.start(id);
        setTimeout(function(){
            window.open("editor.html#" + id, "_blank");
        }, 700);
    });
});

$(".export-json").on("click", function(){
    app.itemHandler.getItems(true, function(){
        var file = new Blob([JSON.stringify(app.items)], {
            type: "application/json",
            name: "remember.json"
        });

        saveAs(file, "remember.json");
    });
});

$(".import-json").on("click", function(){
    $(".import-json-file").click();
    $(".import-json-file").off("change").on("change", function(){
        var file = $(this)[0].files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            try {
                var json = JSON.parse(reader.result);
                console.log(json);
                app.items = app.items.concat(json);
                chrome.storage.local.set({
                    items: app.items
                });
                $(".remembers-container .grid-wrapper").html("");
                app.itemHandler.getItems();
            }
            catch (e) {
                Materialize.toast("Could not read file - it might be corrupted.", 4000);
                console.log(e);
            }
        };
    });
});

app.orderItems = function(){
    app.itemHandler.order();
};