import { displayDialog } from "./script.js";

export function gameJSCode(){
  const coordinatesData = new Map();
  //save the arrangments data of each box
  const boxArrangementDATA = new Map();
  const activePlayers = JSON.parse(localStorage.getItem('activePlayers'));
  let quitBtnClicked;

  function renderRollsHTML(){
    document.querySelector('.ludo-container').innerHTML += activePlayers.map((activePlayer,index) => `
        <div data-roll-turn="${index + 1}" class="roll-container ${activePlayer.home}">
          <div class="user-picture">
            <img src="${activePlayer.image}" alt="">
          </div>
          <div class="user-name">${activePlayer.name}</div>
          <div class="numbers">1</div>
          <button class="roll-btn">Roll</button>
          <div data-home-name="${activePlayer.home}" class="roll-digits"></div>
        </div> 
    `).join('\n');
  }

  function handlePlayersDefaultPosition(){
    const playerElWidth = document.querySelector('.player').clientWidth;
    //set the co-ordinates of each jail container.
    //use its class to  create an object ie(for the class red you would create red-jails obj e.t.c),
    //and use its jailNum attr to determine its left top number(ie:left1,top1...);
    const jailEls = Array.from(document.querySelectorAll('.player-container'));

    jailEls.forEach(jailEl => {
      const {left,top,width : playerContainerWidth}  = jailEl.getBoundingClientRect();
      const centerTop = calculateCenter(top,playerContainerWidth,playerElWidth) + 'px';
      const centerLeft = calculateCenter(left,playerContainerWidth,playerElWidth) + 'px';
      const {jailNum} = jailEl.dataset;
      const jailCoordinateName = jailEl.classList[1] + '-jails';

      addToCoordinatesData(jailCoordinateName,`top${jailNum}`,`left${jailNum}`,centerTop,centerLeft,undefined);
    });

    //to get the co-ordinates of players respecitve jail access the object using 
    //the players class name.
    //after this access the exact left and top values by using the playerNum attr
    //ie(if player class is  red and num attr  1 then you would access red-jails object and properties
    //top1,left1);
    document.querySelectorAll('.player').forEach((playerEl)=>{
      if(!playerEl.dataset.playerOut){
        const playerName = playerEl.classList[1] + '-jails';
        const {playerNum} = playerEl.dataset;
        const coordinatesObject = coordinatesData.get(playerName);

        const left = coordinatesObject[`left${playerNum}`];
        const top = coordinatesObject[`top${playerNum}`];

        playerEl.style.left = left;
        playerEl.style.top = top;
      }else{
        //if the player is freed from jail then dont move it back to jail
        //but the box it currently is in
        moveToCurrentBox(playerEl)
      };
    });
  };

  function setBoxesCoordinates(){
    const  playerWidth = document.querySelector('.player').clientWidth; 

    const boxesEls = Array.from(document.querySelectorAll('.box'));
    
    boxesEls.forEach(box =>{
      const {homeBox,boxNum,startBox} = box.dataset;
      const {top ,left , width : boxWidth} = box.getBoundingClientRect();
      const centerTop = calculateCenter(top,boxWidth,playerWidth) + "px";
      const centerLeft = calculateCenter(left,boxWidth,playerWidth) + "px";
      addToCoordinatesData('boxes',`boxesTop${boxNum}`,`boxesLeft${boxNum}`,
      centerTop,centerLeft,startBox ? `startbox${startBox}` : undefined,boxNum,homeBox ? `homeBox${boxNum}`: undefined);
    });
  }

  function addToCoordinatesData(type,topKey,leftKey,topValue,leftValue,startBoxKey,startBoxValue,homeBoxKey){
    if(!coordinatesData.has(type)){
      coordinatesData.set(type , {coordinatesType : type});
    }

    const getTypeObj = coordinatesData.get(type);

    getTypeObj[`${topKey}`] = topValue;
    getTypeObj[`${leftKey}`] = leftValue;
    //if the box is a start box(ie : a box where the player moves after being released) of any of the homes
    //then give this object a startBox property(the key value pair would be for eg:- startboxgreen : 1)
    startBoxKey ? getTypeObj[`${startBoxKey}`] = startBoxValue : '';
    homeBoxKey ? getTypeObj[`${homeBoxKey}`] = true : '';
  }
  class RollBtn{
    #rollBtnEl;
    #intervalID;
    #digit;
    #freePlayers;
    //create a static variable that would be used to switch 
    //pointer class
    static _rollNum = 1;

    constructor(element){
      this.#rollBtnEl = element;

      this.#rollBtnEl.addEventListener('click',()=>{
        const rollContainerEl = this.#rollBtnEl.parentElement;
        if(rollContainerEl.classList.contains('point')){
          rollContainerEl.classList.remove('point');
          this.#handleRolling();
          this.#digit = Math.floor(Math.random() * 6) + 1;
          //access the number of free players of the respecitve class
          const home = rollContainerEl.classList[1];
          this.#freePlayers = [...document.querySelectorAll(`.player.${home}`)].filter(playerEl => playerEl.dataset.playerOut).length;
        };
      });
    }

    #handleRolling(){
      this.#intervalID = setInterval(()=>{
        const numberEl = this.#rollBtnEl.previousSibling.previousSibling;
        const number = numberEl.innerHTML < 6 ? Number(numberEl.innerHTML) + 1 : 1;
        numberEl.innerHTML = number;
      },250);

      setTimeout(()=>{
        clearInterval(this.#intervalID);
        this.#rollBtnEl.previousSibling.previousSibling.innerHTML = this.#digit;
        const rollDigitEl = this.#rollBtnEl.nextElementSibling;
        rollDigitEl.setAttribute('data-has-a-value',true);
        rollDigitEl.innerHTML += `<div>${this.#digit}</div>`;
        if(this.#digit === 6){
          //on re-adding point class remove setAttribute since its rolling again 
          rollDigitEl.removeAttribute('data-has-a-value');
          this.#rollBtnEl.parentElement.classList.add('point');
          //if the digit is not 6 and there is no free players of the respective home
          //as well as no other values other then this digit then it means the user 
          //has no player to move , hence hide the digits and move on to the next player
        }else if(!this.#freePlayers && rollDigitEl.innerText.length < 2){
          //on re-adding point class remove setAttribute since its rolling again 
          rollDigitEl.removeAttribute('data-has-a-value');
          rollDigitEl.innerHTML = '';
          const rollElNum =  RollBtn._rollNum < document.querySelectorAll('.roll-container').length ?  ++RollBtn._rollNum : RollBtn._rollNum = 1;
          document.querySelector(`[data-roll-turn="${rollElNum}"]`).classList.add('point');
        }
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

  function moveToBoard(playerEl){
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
    playerEl.style.zIndex = '4';
    //add the class to enable animation
    playerEl.classList.add('done');
  }
  function calculateCenter(offsetValue,containerWidth,playerWidth){
    return (offsetValue + (containerWidth/2) - (playerWidth/2)).toFixed(3);
  }
  function findTheCurrentPlayer(){
    return [...document.querySelectorAll('.roll-digits')].map(rollDigitEl => {
      if(rollDigitEl.dataset.hasAValue){
       return {home : rollDigitEl.dataset.homeName , text : rollDigitEl.innerText};
      };
    }).filter(Boolean)[0];
  };
  function moveToFirstBox(playerEl){
    const home = playerEl.classList[1];
    const digitEl = document.querySelector(`[data-home-name="${home}"]`);
    const boxNum = coordinatesData.get('boxes')[`startbox${home}`];
    //get the top and left value using the boxNum
    const top = coordinatesData.get('boxes')[`boxesTop${boxNum}`];
    const left = coordinatesData.get('boxes')[`boxesLeft${boxNum}`];
    playerEl.style = `top:${top}; left:${left};`;
    //safe the player current box number in player out attribute
    playerEl.setAttribute('data-player-out',boxNum);
    //remove the first value from the respective digit(which would be 6)
    digitEl.innerHTML = digitEl.innerText.slice(1);
    reArrange(playerEl,true);
  };

  function moveToCurrentBox(playerEl){
    const currentBoxNum = playerEl.dataset.playerOut;
    const top = coordinatesData.get('boxes')[`boxesTop${currentBoxNum}`];
    const left = coordinatesData.get('boxes')[`boxesLeft${currentBoxNum}`];
    playerEl.style.top = top;
    playerEl.style.left = left;
    reArrange(playerEl,false)
  };

  function reArrange(playerEl,clicked){
    const boxNum = playerEl.dataset.playerOut;
    const {top:boxTop,left:boxLeft , width : boxWidth} = document.querySelector(`[data-box-num="${boxNum}"]`).getBoundingClientRect();
    const newWidth = (boxWidth / 3);
    //get the respective box arrangement key
    const type = `boxArrangement${boxNum}`;
    //if the respective box has no arragment data for this player
    //then create one 
    if(!boxArrangementDATA.has(type)){
       boxArrangementDATA.set(type,[playerEl]);
    }else{
      const boxArrangementPlayers = boxArrangementDATA.get(type);
      //push this player to the respective arrangements data 
      //only if it was clicked . when we invoke this function to re position players then we dont want
      //to re-add the players that are already present
      clicked ? boxArrangementPlayers.push(playerEl) : '';
      //during re sizing we only re-position those players whos resepctive array have more than 1 player
      if(boxArrangementPlayers.length > 1){
        boxArrangementPlayers.forEach((playerEl,index)=>{
          playerEl.style.width = newWidth + 'px';
          playerEl.style.height = newWidth + 'px';
          playerEl.style.top = boxTop + (newWidth * Math.floor(index/3)) + 'px';
          playerEl.style.left = boxLeft + (newWidth * (index % 3)) + 'px';
        });
      }
    }
  };



  renderRollsHTML();
  handlePlayersDefaultPosition();
  setBoxesCoordinates();
  document.querySelector('[data-roll-turn="1"]').classList.add('point');

  window.addEventListener('resize',()=>{
    setBoxesCoordinates();
    handlePlayersDefaultPosition();
  });

  document.querySelectorAll('.roll-btn').forEach(rollBtn => { new RollBtn(rollBtn) });

  document.querySelectorAll('.player').forEach(playerEl => {
    playerEl.addEventListener('click',()=>{
      const currentPlayer = findTheCurrentPlayer();
      if(currentPlayer){
        const home = playerEl.classList[1];
        //if the clicked player matches the current player & is in jail and has the value to be moved out 
        //then free it
        if(home === currentPlayer.home && !playerEl.dataset.playerOut && currentPlayer.text.length > 1){
          moveToFirstBox(playerEl);
        }else if(home !== currentPlayer.home ){
          //if the clicked player does not match the current player then point to the current player
          displayDialog('Note',`Its currently the turn of the ${currentPlayer.home} player`,'note');
        };
      };
    });
  });

  document.querySelectorAll('.player.done').forEach( playerEl => {
    playerEl.addEventListener('animationend',()=>{
      const home = playerEl.classList[1];
      const scoreTxtEl = document.querySelector(`li.${home} > div`);
      scoreTxtEl.innerHTML = ++scoreTxtEl.textContent;
      playerEl.style.display = 'none';
    });
  });
  //display the default browser pop when the user 
  //refreshes the game page
  window.addEventListener('beforeunload',(event)=>{
    if(!quitBtnClicked){
      event.preventDefault();
    }
  });

  document.querySelector('.quit-game-btn').addEventListener('click',()=>{
    displayDialog('Note','Are you sure that you want to quit the game?','quit-game');
  });

  window.addEventListener('click',(e)=>{
    const clickedBtn = e.target.classList[1];
    if( clickedBtn  === 'play-again' || clickedBtn  === 'yes' ){
      quitBtnClicked = true;
      window.location.reload();
    }else if(clickedBtn  === 'no' ){
      document.querySelector('dialog').close();
    }
  });
}