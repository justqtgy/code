var hint = {};
$.getJSON("/content/hintMessage.json", function (result) { hint = result.message; });