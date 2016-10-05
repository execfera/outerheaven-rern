// Outer Heaven - Chip Parse Code 1.0

// grab remote chiplist timestamp and compare with localstorage
// if timestamp doesn't match or cache doesn't exist, grab from remote
// get chip json data from localstorage, if doesn't exist then grab from remote server and store

var chipData = {};
var remoteChipTime;
var chipGet = $.Deferred();

var timeGet = $.get("https://api.myjson.com/bins/10uw9", function (data, textStatus, jqXHR) {
remoteChipTime = data.timestamp;
if (!(localStorage.getItem("cCacheTime"))) localStorage.setItem("cCacheTime", data.timestamp.toString()); 
});

timeGet.done(function() { 

if((localStorage.getItem("cDataCache")) && (parseInt(localStorage.getItem("cCacheTime"), 10) === remoteChipTime)) {
    chipData = JSON.parse(localStorage.getItem("cDataCache"));
	chipGet.resolve();
  } else {
	$.get("https://api.myjson.com/bins/1c6zx", function (data, textStatus, jqXHR) {
	chipData = data;
	localStorage.setItem("cDataCache", JSON.stringify(data));
	localStorage.setItem("cCacheTime", remoteChipTime.toString());
	}) .done(function(){ chipGet.resolve(); });
}

});

$(document).data("readyDeferred", $.Deferred()).ready(function() {
    $(document).data("readyDeferred").resolve();
});

$.when( $(document).data("readyDeferred"), chipGet ).done (function() {
  $('.c_post:contains("[chip="):not(:has("textarea"))').each(function () {
	$(this).html().replace(/\[chip=([^,\]]*)(,(i|s|f|a))?\]/g, function(match, p1, p2, p3) {
      if (!(p1 in chipData)) return match; else return chipTagReplace("chip",p1,p3);
	  });
  });
  $('.c_sig:contains("[chip="):not(:has("textarea"))').each(function () {
	$(this).html().replace(/\[chip=([^,\]]*)(,(i|s|f|a))?\]/g, function(match, p1, p2, p3) {
      if (!(p1 in chipData)) return match; else return chipTagReplace("sig",p1,p3);
	  });
  });
  chipTagFunction();
});

function chipTagReplace(area, name, parameter) {
	  switch(parameter) {
	    case "i":
		  return "<img src='" + chipData[name].chip_img + "'>";
		case "s":
		  return chipData[name].chip_summ;
		case "f":
		  return "<img src='" + chipData[name].chip_img + "'> " + "<span class='chip'><span class='chipclick'>" + name + "</span><span class='chipbody" + area + "'>" + chipData[name].chip_desc + "</span></span>";
		case "a":
		  if (!("chip_alias" in chipData[name])) return match; else return "<img src='" + chipData[name].chip_img + "'> " + "<span class='chip'><span class='chipclick'>" + chipData[name].chip_alias + "</span><span class='chipbody" + area + "'>" + chipData[name].chip_desc + "</span></span>";
		default: 
		  var elcolor; 
		  switch (chipData[name].chip_elem) {
				case "Fire": elcolor = "<font color=#d22700>" + name + "</font>"; break;
				case "Aqua": elcolor = "<font color=#6495ed>" + name + "</font>"; break;
				case "Elec": elcolor = "<font color=#dbcd00>" + name + "</font>"; break;
				case "Wood": elcolor = "<font color=#00c96b>" + name + "</font>"; break;
				default: elcolor = name; break;
		  }		
		  return "<img src='" + chipData[name].chip_img + "'> <strong>" + elcolor + "</strong>: " + chipData[name].chip_summ;
	}
}

function chipTagFunction () {
  $(".chipbody").hide();
  $(".chipbodypost").hide();
  $(".chipbodysig").hide();
  $(".chipclick").click(function(event) {
    $(this.nextSibling).toggle();
    event.stopPropagation();
  });
  $("body").click(function(event) {
  $(".chipbody").hide();
  $(".chipbodypost").hide();
  $(".chipbodysig").hide();
  });
  $(".chipbody,.chipbodypost,.chipbodysig").click(function(event) {
    event.stopPropagation();
	return false;
  });

  // No idea why Zetaboards spoilers fuck up like this but this fix is needed.
  $("div.spoiler_toggle").unbind( "click" );
  $("div.spoiler_toggle").click(function(event) {
    $(this.nextSibling).toggle();
    event.stopPropagation();
	//return false;
  });
}

function Preview(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    if ($('#c_post-preview').length || $('#c_post textarea').val() || $('#txt_quote').val()) {
        if (!$('#c_post-preview').length) {
            $('#c_post').prepend("<div id='c_post-preview'></div>");
        }
        
        var quote = $('#txt_quote'),
        prepend_quote = quote.length && quote.val() ? "[quote]" + quote.val() + "[\/quote]" : "",
        xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        
        xhr.open('POST', main_url + 'tasks/', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Accepts", "*/*");
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $('#c_post-preview').html(xhr.responseText);
				$('.c_post:contains("[chip="):not(:has("textarea"))').each(function () {
					$(this).html().replace(/\[chip=([^,\]]*)(,(i|s|f|a))?\]/g, function(match, p1, p2, p3) {
					if (!(p1 in chipData)) return match; else return chipTagReplace("chip",p1,p3);
					});
				});
                $('#c_post-preview div.spoiler_toggle').click(function () {
                    $(this).next().toggle();
                });
			chipTagFunction();
            }
        };
        
        xhr.send($.param({ task: 5, post: prepend_quote + $("#c_post textarea").val() }));
    }
}