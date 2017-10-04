var warned = false;

$(document).keydown(function (e) {
    if ((e.key == 's' || e.key == 'S') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (warned == false) {
            Materialize.toast("No need for Ctrl+S - it's saved everytime you make a change.", 2000)
            warned = true;
        }
        return false;
    }
    return true;
});

var editor;

$(document).ready(function(){
    app.itemHandler.getItems(true, function(){
        var language = "plain_text", hash, saving;
        if (window.location.hash && window.location.hash != "#!") {
            hash = window.location.hash.substring(1);
            if (!app.itemHandler.getItem(hash) || app.itemHandler.getItem(hash).type != "code") {
                $("#editor").html("could not find your snippet...");
            }
            else {
                language = app.itemHandler.getItem(hash).language;
                $("#editor").text(app.itemHandler.getItem(hash).code);
                console.log(app.itemHandler.getItem(hash).code);
                saving = true;
            }
        }
        
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/github");
        editor.getSession().setMode("ace/mode/" + language);
        editor.getSession().on("change", function(){
            if (saving) {
                var t = app.itemHandler.setItem(hash, {
                    code: editor.getValue()
                });
            }
        });
        
        $(".modal").modal();
        $("select").val(language).material_select();

        $("#language").on("change", function(){
            editor.getSession().setMode("ace/mode/" + $(this).val());
            app.itemHandler.setItem(hash, {
                language: $(this).val()
            });
        });
    });
});