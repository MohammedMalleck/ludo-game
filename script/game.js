const coordinatesArray = [];

function handlePlayersDefaultPosition(){
  const playerElWidth = document.querySelector('.player').clientWidth;
  //set the co-ordinates of each jail container.
  //use its class to  create an object ie(for the class red you would create red-jails obj e.t.c),
  //and use its jailNum attr to determine its left top number(ie:left1,top1...);
  const jailsCoordinates = Array.from(document.querySelectorAll('.player-container')).reduce((acc,playerContainerEl)=>{
    const {left,top,width : playerContainerWidth}  = playerContainerEl.getBoundingClientRect();
    const centerTop = calculateCenter(top,playerContainerWidth,playerElWidth) + 'px';
    const centerLeft = calculateCenter(left,playerContainerWidth,playerElWidth) + 'px';

    const {jailNum} = playerContainerEl.dataset;
    const jailCoordinateName = playerContainerEl.classList[1] + '-jails';
    const coordinatesObject = acc.find(coordinatesObj => coordinatesObj.coordinatesName === jailCoordinateName);
    //the object exists already then add new values of the respective jail
    //if not then add the respective jail object with first values
    if(coordinatesObject){
      coordinatesObject[`left${jailNum}`] = centerLeft ; 
      coordinatesObject[`top${jailNum}`] = centerTop ; 
    }else{
      acc.push({'coordinatesName' : jailCoordinateName, 'top1' : centerTop , 'left1' : centerLeft});
    }
    return acc;
  },[]);

  //add the jails coordinates objects in coordinatesArray
  coordinatesArray.push(...jailsCoordinates);


  //to get the co-ordinates of players respecitve jail access the object using 
  //the players class name.
  //after this access the exact left and top values by using the playerNum attr
  //ie(if player class is  red and num attr  1 then you would access red-jails object and properties
  //top1,left1);
  document.querySelectorAll('.player').forEach((playerEl)=>{
    const playerName = playerEl.classList[1] + '-jails';
    const {playerNum} = playerEl.dataset;
    const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.coordinatesName === playerName);

    const left = coordinatesObject[`left${playerNum}`];
    const top = coordinatesObject[`top${playerNum}`];

    playerEl.style.left = left;
    playerEl.style.top = top;
  });
};

function setBoxesCoordinates(){
  const  playerWidth = document.querySelector('.player').clientWidth; 

  const boxesCoordinates = Array.from(document.querySelectorAll('.box')).reduce((acc,box) =>{
    const {top ,left , width : boxWidth} = box.getBoundingClientRect();
    const centerTop = calculateCenter(top,boxWidth,playerWidth) + "px";
    const centerLeft = calculateCenter(left,boxWidth,playerWidth) + "px";
    const {homeBox,boxNum} = box.dataset;
    const homeBoxesObj = acc.find(coordinatesObj => coordinatesObj.coordinatesName === 'homeBoxes');
    const boxesObj = acc.find(coordinatesObj => coordinatesObj.coordinatesName === 'boxes');
    //if the box is a home box add the 
    //coordinates of the box in the home box object
    //if it exists and vice versa.
    if(homeBox && homeBoxesObj){ 
      homeBoxesObj[`boxTop${boxNum}`] = centerTop;
      homeBoxesObj[`boxLeft${boxNum}`] = centerLeft;
      homeBoxesObj[`boxEl${boxNum}`] = box;
      homeBoxesObj[`boxHomeName${boxNum}`]  = box.classList[1];
    }else if(homeBox){
      acc.push({coordinatesName : 'homeBoxes' , 'boxTop1' :centerTop , 'boxLeft1' : centerLeft , 'boxEl1'  : box, 'boxHomeName1': box.classList[1]});
    }else if(boxesObj){
      boxesObj[`boxTop${boxNum}`] =centerTop;
      boxesObj[`boxLeft${boxNum}`] = centerLeft;
      boxesObj[`boxEl${boxNum}`] = box;
    }else{
      acc.push({coordinatesName : 'boxes' , 'boxTop1' :centerTop , 'boxLeft1' : centerLeft , 'boxEl1' : box});   
    }

    return acc;
  },[]);
  //add both objects in the coordinates array
  coordinatesArray.push(...boxesCoordinates);
}
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
  //get the respective player in the header and its rect values
  //get the values to center the player with the respective player in the header
  const {top : scoreSvgTop,left : scoreSvgLeft,width : scoreSvgWidth} =  document.querySelector(`li.${home} > svg`).getBoundingClientRect();
  const scoreSvgCenterTop = calculateCenter(scoreSvgTop,scoreSvgWidth,playerElWidth);
  const scoreSvgCenterLeft = calculateCenter(scoreSvgLeft,scoreSvgWidth,playerElWidth);
  //set the css variables on the player responsible for the animation
  playerEl.style.setProperty("--current-top", (playerElTop - 50).toFixed(3) + "px");
  playerEl.style.setProperty("--current-left", (playerElLeft - 50).toFixed(3) + "px");
  playerEl.style.setProperty("--board-player-top", scoreSvgCenterTop  + "px");
  playerEl.style.setProperty("--board-player-left", scoreSvgCenterLeft + "px");
  //add the class to enable animation
  playerEl.classList.add('done');
}
function calculateCenter(offsetValue,containerWidth,playerWidth){
  return (offsetValue + (containerWidth/2) - (playerWidth/2)).toFixed(3);
}

handlePlayersDefaultPosition();
setBoxesCoordinates();
document.querySelector('[data-roll-turn="1"]').classList.add('point');

window.addEventListener('resize',()=>{
  //empty the coordinates array before adding new data
  coordinatesArray.splice(0,coordinatesArray.length)
  handlePlayersDefaultPosition();
  setBoxesCoordinates();
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