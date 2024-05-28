// 일베쪽 adblock관련 코드 잠시 적어놓은겁니다.
// 삭제 후 사용해 주세요.

var scriptContent = `
(function() {

var prod_type = "prod";
var c2e_url = "https://app.c2ewallet.com/";
var memberSrl = '11529505665';

if (prod_type == "beta") {
	c2e_url = "https://app.c2eprotocol.com/";
}

function getIlbeSRL() {
	return memberSrl;
	
	/* 
    try {
    	return ws.onopen.toString().split("|")[1];
    } catch (e) {
    	console.error(e, "getIlbeSRL error");
    	return "no_srl";
    }
    */
}

function openWalletPopup() {
	const member_srl = getIlbeSRL();
    const url = \`\${c2e_url}/member_srl/\${member_srl}\`;

	window.open(
    	url,
    	"Chainwith",
    	"location=no,resizable=no,height=700,width=375,left=0,top=0"
	);
}

      function getButton() {
        const member_srl = getIlbeSRL();
        const element = document.createElement("div");

        element.innerHTML =
          '<img style="height:15px;width:15px" src="/img/wallet.png"/>';

        element.style.height = "15px";
        element.style.width = "15px";
        element.style.marginLeft = "5px";
        element.style.color = "";
        element.style.cusor = "pointer";

        const url = \`\${c2e_url}/member_srl/\${member_srl}\`;

        element.addEventListener("click", () =>
          window.open(
            url,
            "Chainwith",
            "location=no,resizable=no,height=700,width=375,left=0,top=0"
          )
        );

        return element;
      }


function makeWalletLink() {
	const member_srl = getIlbeSRL();
    const url = \`\${c2e_url}/member_srl/\${member_srl}\`;
    
    $('.wallet-open-link').css('cursor', 'pointer');
    
    $(document).on("click", ".wallet-open-link", function() {
		window.open(url, 'Chainwith', 'location=no,resizable=no,height=700,width=375,left=0,top=0');
	});
}

$(document).ready(function () {
	//document.getElementsByClassName("member-nick")[0].appendChild(getButton());

	makeWalletLink();
});
})
`;

var script = document.createElement('script');
script.textContent = scriptContent;
document.head.appendChild(script);
