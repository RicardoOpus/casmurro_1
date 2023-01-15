console.log("Chamou Mundo!");
changeTabColor("mundo");


async function getWorldCards() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const result = await db.projects.get(idProject);
  console.log(result.data.world);
  result.data.world.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens">
          <div class="worldName" onclick="setProjectAtual()">
            <div class="contentListWorld">
              <p class="wordlTitle">${ ele.title }</p>
              <hr class="cardLineTop">
              <span> ${ ele.category } </span>
              <div class="worldCardDivider">
                <div>
                  <p class="it">${ ele.content }</p>
                </div>
                <div>
                  <img src="${ !ele.image_card ? 'assets/images/manuscript.jpeg' : ele.image_card }" class="worldListImage esse"> 
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      `
    );
    setContentOpacity();
    setImageOpacity();
  })
};

function setContentOpacity() {
  const content = document.querySelectorAll(".it");
  content.forEach( (cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add("worldContent")
    }
  })
}

function setImageOpacity() {
  const content = document.querySelectorAll(".worldListImage");
  content.forEach( (cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add("worldListImageOpacity")
    }
  })
}


getWorldCards();

