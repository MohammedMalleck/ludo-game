const coordinatesArray = [];

function handlePlayersDefaultPosition(){
  //set the co-ordinates of each jail container.
  //use its class to  create an object ie(for the class red you would create red-jails obj e.t.c),
  //and use its jailNum attr to determine its left top number(ie:left1,top1...);
  document.querySelectorAll('.player-container').forEach((playerContainerEl)=>{
    const {left,top}  = playerContainerEl.getBoundingClientRect();
    const {jailNum} = playerContainerEl.dataset;
    const jailCoordinateName = playerContainerEl.classList[1] + '-jails';
    const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.coordinatesName === jailCoordinateName);
    if(coordinatesObject){
      const keyLeft = 'left' + `${jailNum}`;
      const keyTOP = 'top' + `${jailNum}`;
      coordinatesObject[`${keyLeft}`] =left; 
      coordinatesObject[`${keyTOP}`] = top; 
    }else{
      coordinatesArray.push({'coordinatesName' : jailCoordinateName, 'top1' : top , 'left1' : left});
    }
  });


  //poisiton  each player to the exact center of their respective jail.
  //to get the co-ordinates of their respecitve jail access the object using 
  //the players class name.
  //after this access the exact left and top values by using the playerNum attr
  //ie(if player class is  red and num attr  1 then you would access red-jails object and properties
  //top1,left1);
  document.querySelectorAll('.player').forEach((playerEl)=>{
    const {width : playerWidth} = playerEl.getBoundingClientRect();
    const {width : playerContainerWidth } = document.querySelector('.player-container').getBoundingClientRect()
    const playerName = playerEl.classList[1] + '-jails';
    const {playerNum} = playerEl.dataset;
    const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.coordinatesName === playerName);

    const left = coordinatesObject[`left${playerNum}`];
    const top = coordinatesObject[`top${playerNum}`];

    playerEl.style.left = `${(left + ((playerContainerWidth/2) - (playerWidth/2))).toFixed(3)}px`
    playerEl.style.top = `${(top + ((playerContainerWidth/2) - (playerWidth/2))).toFixed(3)}px`;
  });
};

class RollBtn{
  #rollBtnEl;
  #intervalID;
  #digit;
  #timeoutID;

  constructor(element){
    this.#rollBtnEl = element;

    this.#rollBtnEl.addEventListener('click',()=>{
      const rollContainerEl = this.#rollBtnEl.parentElement;
      if(rollContainerEl.classList.contains('point')){
        rollContainerEl.classList.remove('point');
        this.#handleRolling();
        this.#digit = Math.floor(Math.random() * 6) + 1;
      };
    });
  }

  #handleRolling(){
    this.#intervalID = setInterval(()=>{
      const numberEl = this.#rollBtnEl.previousSibling.previousSibling;
      const number = numberEl.innerHTML < 6 ? Number(numberEl.innerHTML) + 1 : 1;
      numberEl.innerHTML = number;
    },250);

    this.#timeoutID = setTimeout(()=>{
      clearInterval(this.#intervalID);
      this.#intervalID = false;

      this.#rollBtnEl.previousSibling.previousSibling.innerHTML = this.#digit;

      clearTimeout(this.#timeoutID);
    },2000);
  }
}

//display confetti on scroring 6 or winning
function handleConfetti(){
  const confettiSpeed = window.innerWidth > 785 ? 500 : window.innerWidth > 590 ? 300 : 250;
  confetti({
    particleCount: 300,
    spread:confettiSpeed,
    origin: { y: 0 },
  });
}

function movePlayerToBoard(playerEl){
  //player color('yellow,red'e.t.c)
  const home = playerEl.classList[1];
  //get the players rect values
  const {top , left} = playerEl.style;
  const playerElTop = Number(top.replace('px',''));
  const playerElLeft = Number(left.replace('px',''));
  const playerElWidth = playerEl.clientWidth;
  const playerElHeight = playerEl.clientHeight;
  //get the respective player in the header and its rect values
  //get the values to center the player with the respective player in the header
  const {top : scoreSvgTop,left : scoreSvgLeft,width : scoreSvgWidth,height : scoreSvgHeight} =  document.querySelector(`li.${home} > svg`).getBoundingClientRect();
  const scoreSvgCenterTop = (scoreSvgTop + ((scoreSvgHeight/2) - (playerElHeight/2))).toFixed(3);
  const scoreSvgCenterLeft = (scoreSvgLeft + ((scoreSvgWidth/2) - (playerElWidth/2))).toFixed(3);
  //set the css variables on the player responsible for the animation
  playerEl.style.setProperty("--current-top", (playerElTop - 50).toFixed(3) + "px");
  playerEl.style.setProperty("--current-left", (playerElLeft - 50).toFixed(3) + "px");
  playerEl.style.setProperty("--board-player-top", scoreSvgCenterTop  + "px");
  playerEl.style.setProperty("--board-player-left", scoreSvgCenterLeft + "px");
  //add the class to enable animation
  playerEl.classList.add('done');
}

handlePlayersDefaultPosition();
document.querySelector('[data-roll-turn="1"]').classList.add('point');

window.addEventListener('resize',()=>{
  handlePlayersDefaultPosition();
});

document.querySelectorAll('.roll-btn').forEach(rollBtn => { new RollBtn(rollBtn) });

document.querySelectorAll('.player.done').forEach( playerEl => {
  playerEl.addEventListener('animationend',()=>{
    const home = playerEl.classList[1];
    const scoreTxtEl = document.querySelector(`li.${home} > div`);
    scoreTxtEl.innerHTML = ++scoreTxtEl.textContent;
    playerEl.style.display = 'none';
  });
});