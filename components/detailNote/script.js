changeTabColor("notas");

function updateSideBar() {
  $('.sideBar').empty();
  $('.sideBar').append(`
  <p class="extraInfosTab">Adicionar:</p>
  <button id="addLink" class="btnExtra ui-button ui-corner-all">Adicionar link externo</button>
  `);
}
updateSideBar();

async function deleteLink(position) {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  db.projects.where('id').equals(currentID).modify( (e) => {
    e.data.notes[positionInArray].links.splice(position, 1);
  });
  return pageChange('#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')
}

function createLinks(links) {
  const linksDiv = document.getElementById('links');
  links.forEach( (link, i) => {
    const anchor = document.createElement('a');

    anchor.innerHTML = `<p id="${i}"><span class="xlink" onclick="deleteLink(${i})">&times;</span><a href='${link.address}' target="_blank"> ${link.title}🡽<a/></p>`
    linksDiv.appendChild(anchor);
  });
}

async function restoreNoteCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (key === "image_card" && ele[key] !== '') {
          var cardbackgrond = document.getElementById("imageCardBackgournd");
          cardbackgrond.classList.add("imageCardBackgournd");
          cardbackgrond.children[0].style.backgroundImage =  `url(${ ele[key] })`;
          cardbackgrond.children[0].classList.add("cardImageDiv");
          result.setAttribute("src", ele[key]);
          result.classList.add("cardImage");
        } if (key === "links" && ele[key].length > 0) {
          return createLinks(ele[key])
        } if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("content")
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        await lastEditListModify('notes', currentCardID);
        const field = elem.id
        await db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.notes[positionInArray][field] = elem.value;
        });
        updateLastEdit(currentID);
      });
    }
  })
});

$( "#dialog-delete-note" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
      id: "btnOkdelNote",
			click: async function() {
        await deleteCard('notes');
        $( this ).dialog( "close" );
        loadpage('notas');
			}
		},
		{
			text: "Cancel",
      id: "btnTwoNotes",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});
// Link to open the dialog
$( "#deleteNoteCard" ).click(function( event ) {
	$( "#dialog-delete-note" ).dialog( "open" );
  $("#btnTwoNotes").focus();
	event.preventDefault();
});

document.getElementById("btnSaveWall").disabled = true;
document.getElementById("my-image").addEventListener('input', () => { 
  document.getElementById("btnSaveWall").disabled = false;
});

restoreNoteCard();
restoreCategories('notes');

async function saveImageToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    await new Promise((resolve) => {
      reader.onloadend = resolve;
    });
    const base64data = reader.result;
    return base64data;
  } catch (error) {
    console.error(error);
  }
}

async function getCoverFromFecth(url) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (response.status === 200) {
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      const coverUrl = doc.querySelector('meta[property="og:image"]').getAttribute('content');
      const img = await saveImageToBase64(coverUrl);
      return img;
    }
  } catch (error) {
    console.error(error);
  }
}

function isURLmusic(str) {
  return str.startsWith("https://music.youtube.com/") || str.startsWith("https://open.spotify.com/");
}

function isValideURL(str) {
  return str.startsWith("https://") || str.startsWith("https://");
}

async function saveLink() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  const title = document.getElementById('link_title').value;
  const address = document.getElementById('link_address').value;
  var modalLinks = document.getElementById("myModalLink-notes");
  const verifyUrl = isValideURL(address)
  if (!verifyUrl) {
    return alert("O endereço deve começar com 'https://' ou 'http://'")
  }
  const obj = { title, address};
  await db.projects.where('id').equals(currentID).modify( (e) => {
    e.data.notes[positionInArray].links.push(obj);
  });
  modalLinks.style.display = "none";
  const verifyURLmidia = isURLmusic(address)
  if (verifyURLmidia) {
    const imageCover = await getCoverFromFecth(address);
    if (imageCover) {
      await db.projects.where('id').equals(currentID).modify( (e) => {
        e.data.notes[positionInArray].image_card = imageCover;
      });
    }
  }
  document.getElementById('link_title').value = '';
  document.getElementById('link_address').value = '';
  return pageChange('#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')
}

function handleLinksModal() {
  var salverLinkBtn = document.querySelector("#addLink");
  var modalLinks = document.getElementById("myModalLink-notes");
  var span = document.getElementById("linksModal");
  salverLinkBtn.onclick = function () {
    modalLinks.style.display = "block";
  };
  span.onclick = function () {
    document.getElementById('link_title').value = '';
    document.getElementById('link_address').value = '';
    modalLinks.style.display = "none";
  };
}

tabInsideContent('content');
handleLinksModal();
