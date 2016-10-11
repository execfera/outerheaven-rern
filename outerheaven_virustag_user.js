// Outer Heaven - Virus Parse Code 1.0

function OpenVrWnd(srcname) {
	var found = false;
	var foundidx = 0;
	var foundkey = "";
	var foundentry1 = "";
	var foundentry2 = "";
	for (var key in virusData) {
		for (var i = 0; i <= 6; i++) { 
			if (virusData[key].virus[i].name === srcname) { 
				found = true; 
				foundkey = key;
				foundidx = i;
				break; 
			}
		}
	}
	if (found === true) {
	foundentry1 = "<strong>" + virusData[foundkey].virus[foundidx].name + "</strong> <a href='javascript:window.open(\"" 
	foundentry2 = "\", window.opener, false); window.close();'>(" + foundkey + ")</a><br><br>";
	if (virusData[foundkey].family_note !== "") foundentry2 += (virusData[foundkey].family_note + "<br><br>");
	foundentry2 += virusData[foundkey].virus[foundidx].desc;
	
	var oWindow = window.open("", "", "height=640,width=480"); 
	with (oWindow.document) {
		write("");
		write("");
		write("<title>Virus Info<\/title>");
		write("<\/head>");
		write("<body bgcolor=\"#ffffff\">");
		write(foundentry1);
		write(encodeURI(virusData[foundkey].family_url));
		write(foundentry2);
		write("<hr>");
		write("<input type='button' value='Close' onclick='window.close()'>");
		write("<\/body>");
		write("<\/html>");
		close(); 
		}
	}
	else alert("Virus entry not found.");
}

if(zb.admin() === false && zb.mod() === false) {
localStorage.removeItem('vDataCache1');
localStorage.removeItem('vCacheTime1');
localStorage.removeItem('vDataCache2');
localStorage.removeItem('vCacheTime2');
}

if(localStorage.getItem("vDataCache1") && localStorage.getItem("vDataCache2")) {
	var virusData1 = JSON.parse(localStorage.getItem("vDataCache1"));
	var virusData2 = JSON.parse(localStorage.getItem("vDataCache2"));
	var virusData = Object.assign(virusData1, virusData2);
}

$(document).ready(function() {
  $('.c_post:contains("[virus"):not(:has("textarea"))').each(function() {
    $(this).html($(this).html().replace(/\[virus]([^[]*)\[\/virus]/g, function(match, p1) {
		return "<span class='vr_tag'>" + p1 + "</span>";
	}));
  });
  if(localStorage.getItem("vDataCache1")){
		$(".vr_tag").css("cursor", "pointer");
		$(".vr_tag").css("font-weight", "bold");
		$(".vr_tag").click(function() {
			OpenVrWnd($(this).text());
		});
  }
});