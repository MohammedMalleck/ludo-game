const coordinatesArray = [
  {
    jailName : 'red-jail'
  },
  {
    jailName : 'blue-jail'
  },
  {
    jailName : 'green-jail'
  },
  {
    jailName : 'yellow-jail'
  }
];

function handlePlayersDefaultPosition(windowWidth){
  //set the co-ordinates of each jail container
  //use its class to find matching obeject,
  //and use its jailNum attr to determine its left top number(ie:left1,top1...);
  document.querySelectorAll('.player-container').forEach((playerContainerEl)=>{
  const rect = playerContainerEl.getBoundingClientRect();
  const {left,top} = rect;
  const {jailNum} = playerContainerEl.dataset;
  const jailName = playerContainerEl.classList[1] + '-jail';
  const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.jailName === jailName);
  const keyLeft = 'left' + `${jailNum}`;
  const keyTOP = 'top' + `${jailNum}`;
  coordinatesObject[`${keyLeft}`] =left; 
  coordinatesObject[`${keyTOP}`] = top; 
  });

  //poisiton  each player to the exact center of their respective jail.
  //to get the co-ordinates of their respecitve jail access the object using 
  //the players class name.
  //after this access the exact left and top values by using the playerNum attr
  //ie(if player class is  red and num attr  1 then you would access red-jail object and properties
  //top1,left1);
  document.querySelectorAll('.player').forEach((playerEl)=>{
  const playerName = playerEl.classList[1] + '-jail';
  const {playerNum} = playerEl.dataset;
  const coordinatesObject = coordinatesArray.find(coordinatesObj => coordinatesObj.jailName === playerName);

  playerEl.style.left = centerPlayer(coordinatesObject[`left${playerNum}`]);
  playerEl.style.top = centerPlayer(coordinatesObject[`top${playerNum}`]);
  });



  function centerPlayer(elementValue){
    const boxWidth = document.querySelector('.box').getBoundingClientRect().width;
    const playerWidth = document.querySelector('.player').getBoundingClientRect().width;
    return `${elementValue + ((boxWidth /2) - (playerWidth / 2))}px`
  }
};

window.addEventListener('DOMContentLoaded',()=>{
  handlePlayersDefaultPosition(window.innerWidth);
  window.addEventListener('resize',()=>{
    handlePlayersDefaultPosition(window.innerWidth);
  });
});