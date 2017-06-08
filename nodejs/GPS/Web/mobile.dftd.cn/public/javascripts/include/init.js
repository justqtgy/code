var hint = {};
$.getJSON("/config/hintMessage.json", function (result) { hint = result.message; });

function getHideString(str, url) {
    if (!str)
        return "";

    if (!url) {
        url = "'#'";
    }
    else {
        url = "'" + url + "' target=_blank";
    }

    if (str.length > 10) {
        return "<a href=" + url + " class='qq' title='" + str + "'>" + str.substring(0, 10) + "...</a>";
    }
    else
        return str;
}

function null2empty(str){
    if(!str){
        return "";
    }
    return str;
}