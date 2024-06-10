const coordinatesArray = [];

function handlePlayersDefaultPosition(){
  //set the co-ordinates of each jail container.
  //use its class to  create an object,
  //and use its jailNum attr to determine its left top number(ie:left1,top1...);
  document.querySelectorAll('.player-container').forEach((playerContainerEl)=>{
    const {left,top}  = playerContainerEl.getBoundingClientRect();
    const {jailNum} = playerContainerEl.dataset;
    const jailName = playerContainerEl.classList[1] + '-jail';
    const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.jailName === jailName);
    if(coordinatesObject){
      const keyLeft = 'left' + `${jailNum}`;
      const keyTOP = 'top' + `${jailNum}`;
      coordinatesObject[`${keyLeft}`] =left; 
      coordinatesObject[`${keyTOP}`] = top; 
    }else{
      coordinatesArray.push({jailName , 'top1' : top , 'left1' : left});
    }
  });

  console.log(coordinatesArray)

  //poisiton  each player to the exact center of their respective jail.
  //to get the co-ordinates of their respecitve jail access the object using 
  //the players class name.
  //after this access the exact left and top values by using the playerNum attr
  //ie(if player class is  red and num attr  1 then you would access red-jail object and properties
  //top1,left1);
  document.querySelectorAll('.player').forEach((playerEl)=>{
    const {width : playerWidth} = playerEl.getBoundingClientRect();
    const {width : playerContainerWidth } = document.querySelector('.player-container').getBoundingClientRect()
    const playerName = playerEl.classList[1] + '-jail';
    const {playerNum} = playerEl.dataset;
    const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.jailName === playerName);

    const left = coordinatesObject[`left${playerNum}`];
    const top = coordinatesObject[`top${playerNum}`];

    playerEl.style.left = `${(left + ((playerContainerWidth/2) - (playerWidth/2)))}px`
    playerEl.style.top = `${(top + ((playerContainerWidth/2) - (playerWidth/2)))}px`;
  });
};

window.addEventListener('DOMContentLoaded',()=>{
  handlePlayersDefaultPosition();
  window.addEventListener('resize',()=>{
    handlePlayersDefaultPosition();
  });
});