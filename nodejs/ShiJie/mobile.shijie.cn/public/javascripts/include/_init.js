var hint = {};
$.getJSON("/config/hintMessage.json", function(result) { hint = result.message; });