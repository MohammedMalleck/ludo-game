import { displayDialog } from "./script.js";

export function gameJSCode(){
  const boxesCoordinatesData = new Map();
  //save the arrangments data of each box
  const boxArrangementDATA = new Map();
  const activePlayers = JSON.parse(localStorage.getItem('activePlayers'));
  let quitBtnClicked;
  let timeOutID;

  function renderRollsHTML(){
    document.querySelector('.ludo-container').innerHTML += activePlayers.map((activePlayer,index) => `
        <div data-roll-turn="${index + 1}" class="roll-container ${activePlayer.home}">
          <div class="user-picture">
            <img src="${activePlayer.image}" alt="">
          </div>
          <div class="user-name">${activePlayer.name}</div>
          <div class="numbers">1</div>
          <button class="roll-btn">Roll</button>
          <div data-digit-name="${activePlayer.home}" class="roll-digits"></div>
        </div> 
    `).join('\n');
  }

  function handlePlayersDefaultPosition(){
    document.querySelectorAll('.player').forEach((playerEl,index)=>{
      if(!playerEl.dataset.playerOut){
        const {top , left , width} = [...document.querySelectorAll('.player-container')].find((_,i) => i === index).getBoundingClientRect();
        playerEl.style.top = calculateCenter(top,width,playerEl.clientWidth) + 'px';
        playerEl.style.left = calculateCenter(left,width,playerEl.clientWidth) + 'px';
      }else{
        //if the player is freed from jail then dont move it back to jail
        //but the box it currently is in
        moveToCurrentBox(playerEl)
      };
    });
  };

  function setBoxesCoordinates(){
    const  playerWidth = document.querySelector('.player').clientWidth; 
    
    document.querySelectorAll('.box').forEach(box =>{
      const {homeBox,boxNum,startBox} = box.dataset;
      const {top ,left , width : boxWidth} = box.getBoundingClientRect();
      const centerTop = calculateCenter(top,boxWidth,playerWidth) + "px";
      const centerLeft = calculateCenter(left,boxWidth,playerWidth) + "px";
      addToCoordinatesData('boxes',`boxesTop${boxNum}`,`boxesLeft${boxNum}`,
      centerTop,centerLeft,startBox ? `startbox${startBox}` : undefined,boxNum,homeBox ? `homeBox${boxNum}`: undefined);
    });
  }

  function addToCoordinatesData(type,topKey,leftKey,topValue,leftValue,startBoxKey,startBoxValue,homeBoxKey){
    if(!boxesCoordinatesData.has(type)){
      boxesCoordinatesData.set(type , {coordinatesType : type});
    }

    const getTypeObj = boxesCoordinatesData.get(type);

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
    const playerElWidth = playerEl.clientWidth;
    //get the respective player in the header and its rect values
    //get the values to center the player with the respective player in the header
    const {top : scoreSvgTop,left : scoreSvgLeft,width : scoreSvgWidth} =  document.querySelector(`li.${home} > svg`).getBoundingClientRect();
    const scoreSvgCenterTop = calculateCenter(scoreSvgTop,scoreSvgWidth,playerElWidth);
    const scoreSvgCenterLeft = calculateCenter(scoreSvgLeft,scoreSvgWidth,playerElWidth);
    //set the css variables on the player responsible for the animation
    /*use parse straight instead of saving values in variables + using Number with replace*/
    playerEl.style.setProperty("--current-top", (parseFloat(top) - 50).toFixed(3) + "px");
    playerEl.style.setProperty("--current-left", (parseFloat(left) - 50).toFixed(3) + "px");
    playerEl.style.setProperty("--board-player-top", scoreSvgCenterTop  + "px");
    playerEl.style.setProperty("--board-player-left", scoreSvgCenterLeft + "px");
    playerEl.style.zIndex = '4';
    //add the class to enable animation
    playerEl.classList.add('done');
  }
  function calculateCenter(offsetValue,containerWidth,offsetElWidth){
    return (offsetValue + (containerWidth/2) - (offsetElWidth/2)).toFixed(3);
  }
  function findTheCurrentPlayer(){
    return [...document.querySelectorAll('.roll-digits')].map(rollDigitEl => {
      if(rollDigitEl.dataset.hasAValue){
       return {home : rollDigitEl.dataset.digitName , text : rollDigitEl.innerText};
      };
    }).filter(Boolean)[0];
  };
  function moveToFirstBox(playerEl){
    const home = playerEl.classList[1];
    const digitEl = document.querySelector(`[data-digit-name="${home}"]`);
    const boxNum =  boxesCoordinatesData.get('boxes')[`startbox${home}`];
    //safe the player current box number in player out attribute
    playerEl.setAttribute('data-player-out',boxNum);
    //remove the first value from the respective digit(which would be 6)
    digitEl.innerHTML = digitEl.innerText.slice(1);
    //check if the player would be auto-moved
    const freePlayers = [...document.querySelectorAll(`.player.${home}`)].filter(playerEl => playerEl.dataset.playerOut).length;
    const autoMove = freePlayers === 1 && digitEl.innerText.length === 1;
    //get the top and left value using the boxNum
    const top = boxesCoordinatesData.get('boxes')[`boxesTop${boxNum}`];
    const left = boxesCoordinatesData.get('boxes')[`boxesLeft${boxNum}`];
    //posiiton the player in the default position if its the first player in the 
    //respective first box
    const type = `boxArrangement${boxNum}`;
    if(autoMove){
      playerEl.style = `top:${top}; left:${left};`;
      movePlayer(playerEl,Number(digitEl.innerText),true);
    }else if(!boxArrangementDATA.has(type)){
      boxArrangementDATA.set(type,[playerEl]);
      playerEl.style = `top:${top}; left:${left};`;
    }else reArrange(playerEl,true,false);
  };

  function moveToCurrentBox(playerEl){
    const currentBoxNum = playerEl.dataset.playerOut;
    const currentBoxArrangementDATA =  boxArrangementDATA.get( `boxArrangement${currentBoxNum}`);
    const top = boxesCoordinatesData.get('boxes')[`boxesTop${currentBoxNum}`];
    const left = boxesCoordinatesData.get('boxes')[`boxesLeft${currentBoxNum}`];
    //during re sizing we only re-arrange those players whos resepctive 
    //arrangements array have more than 1 player
    if(currentBoxArrangementDATA.length > 1){
      reArrange(playerEl,false,document.querySelector(`[data-box-num="${currentBoxNum}"]`).dataset.strongHold);
    }else{
      playerEl.style.top = top;
      playerEl.style.left = left;
    }
  };

  function reArrange(playerEl,clicked,strongHold){
    const boxNum = playerEl.dataset.playerOut;
    const boxEl =  document.querySelector(`[data-box-num="${boxNum}"]`);
    const {top:boxTop,left:boxLeft , width : boxWidth} = boxEl.getBoundingClientRect();
    const borderValue = parseFloat(getComputedStyle(boxEl).getPropertyValue('border-width'));
    const strongHoldExtraValue = strongHold  ? borderValue : 0;
    const newWidth = (boxWidth / 3) - strongHoldExtraValue;
    //get the respective box arrangement key
    const type = `boxArrangement${boxNum}`;
    const boxArrangementPlayers = boxArrangementDATA.get(type);
    //push this player to the respective arrangements data 
    //only if it was clicked . when we invoke this function to re position players then we dont want
    //to re-add the players that are already present/have been removed
    clicked ? boxArrangementPlayers.push(playerEl) : '';
    boxArrangementPlayers.forEach((playerEl,index)=>{
      playerEl.style.width = newWidth  + 'px';
      playerEl.style.height = newWidth + 'px';
      playerEl.style.top = (boxTop + strongHoldExtraValue) + (newWidth * Math.floor(index/3)) + 'px';
      playerEl.style.left = (boxLeft +strongHoldExtraValue) + (newWidth * (index % 3)) + 'px';
    });
  };

  function movePlayer(playerEl,moveValue,autoMove){
    const boxNum = Number(playerEl.dataset.playerOut);
    let moved = 0;
    let intervalID;
    let newBoxNum;

    /*the player should be returned to its default size + should
    re-arrange the players in the previous box only if it is not being auto moved*/
    if(!autoMove){
      /*use remove attributes*/
      playerEl.style.removeProperty('width');
      playerEl.style.removeProperty('height');
      handlePlayersInPreviousBox(playerEl,boxNum) 
    };
    playerEl.dataset.playerOut = '';

    //get the players digit el
    const digitEl = document.querySelector(`[data-digit-name="${playerEl.classList[1]}"]`);
    const boxesObject = boxesCoordinatesData.get('boxes');

    intervalID = setInterval(()=>{
      //run interval until the player is moved 
      //to the appropriate box
      if(moved < moveValue){
        moved++;
        newBoxNum = boxNum + moved;
        playerEl.style.top = boxesObject[`boxesTop${newBoxNum}`];
        playerEl.style.left = boxesObject[`boxesLeft${newBoxNum}`];
      }else{
        clearInterval(intervalID);
        //once the player reaches its new box
        //modify its player out attribute
        playerEl.dataset.playerOut = newBoxNum;
        //remove the moved value from the player digit element 
        const moveToDEL = [...digitEl.innerText].indexOf(`${moveValue}`);
        digitEl.innerHTML = digitEl.innerText.slice(0,moveToDEL) + digitEl.innerText.slice(moveToDEL + 1);
        //decide the result of the move(ie : kill , stronghold or a normal move)
        moveResult(playerEl,newBoxNum);
      }
    },400);
  };

  function handlePlayersInPreviousBox(playerEl,boxNum){
    const isStrongHoldBox = document.querySelector(`[data-box-num="${boxNum}"]`).dataset.strongHold; 
    const previousBoxArrangementsArr = boxArrangementDATA.get(`boxArrangement${boxNum}`);
    const index = previousBoxArrangementsArr.indexOf(playerEl);
    previousBoxArrangementsArr.splice(index,1);
    const totalPlayers = previousBoxArrangementsArr.length;
    //if no player remains after moving this player
    //then delete the respective boxes arrangement data
    if(!totalPlayers){
      boxArrangementDATA.delete(`boxArrangement${boxNum}`);
      //if only one player remains then re-size it
    }else if(totalPlayers === 1){
      setTimeout(()=>{
        const playerEl = document.querySelector(`[data-player-out="${boxNum}"]`);
        playerEl.removeAttribute('style');
        playerEl.style.top = boxesCoordinatesData.get('boxes')[`boxesTop${boxNum}`];
        playerEl.style.left = boxesCoordinatesData.get('boxes')[`boxesLeft${boxNum}`];
      },600);
    //if more then one player remains + the last player
    //was not removed then re-arrange them 
    } else if(index !== totalPlayers) reArrange(playerEl,false,isStrongHoldBox);
  };

  function moveResult(playerEl,newBoxNum){
    const type = `boxArrangement${newBoxNum}`;
    const playerElHome = playerEl.classList[1];
    const freePlayers = [...document.querySelectorAll(`.player.${playerElHome}`)].filter(playerEl => playerEl.dataset.playerOut).length;
    const moves = [...document.querySelector(`[data-digit-name="${playerElHome}"]`).innerText];
    const newBoxEl = document.querySelector(`[data-box-num="${newBoxNum}"]`);
    const boxData = boxArrangementDATA.get(type);
    if(freePlayers === 1 && (moves.length && !moves.includes('6'))){
      movePlayer(playerEl,Number(moves[0]),true);
    }else if(!boxData){
      boxArrangementDATA.set(type,[playerEl]);
     }else{
        //if the new box already has one player with the same home
        //then make that box a strong hold box of the respecitve home with a value
        if(boxData.length === 1 && boxData[0].classList[1] === playerElHome){
          newBoxEl.setAttribute('data-strong-hold',playerElHome);
          newBoxEl.setAttribute('data-strong-hold-value','2');
          newBoxEl.setAttribute('strong-hold-content',`${playerElHome.replace(playerElHome.charAt(0),playerElHome.charAt(0).toUpperCase())} Strong Hold!`)
          reArrange(playerEl,true,true);
        };
     };
  };

  function handleMoveOptions(playerEl,playerHome){
    const movesArray = [...document.querySelector(`[data-digit-name="${playerHome}"]`).textContent];
    const lastDigit = Number(movesArray[movesArray.length - 1]);
    const moveOptionsEl = document.querySelector('.move-options-container');
    const top =playerEl.getBoundingClientRect().top - moveOptionsEl.clientHeight;
    const left = calculateCenter(parseFloat(playerEl.style.left),playerEl.clientWidth,moveOptionsEl.clientWidth);
  
    moveOptionsEl.style.top = `${top}px`;
    moveOptionsEl.style.left = `${left}px`;
    moveOptionsEl.classList.add('visible');
    moveOptionsEl.classList.add(`${playerHome}`);
    document.querySelector('.move-option:nth-child(2)').textContent = lastDigit;
  };


  renderRollsHTML();
  handlePlayersDefaultPosition();
  setBoxesCoordinates();
  document.querySelector('[data-roll-turn="1"]').classList.add('point');
  window.addEventListener('resize',()=>{
    clearTimeout(timeOutID);
    timeOutID = setTimeout(()=>{
      setBoxesCoordinates();
      handlePlayersDefaultPosition();
    },200);
  });

  document.querySelectorAll('.roll-btn').forEach(rollBtn => { new RollBtn(rollBtn) });

  document.querySelectorAll('.player').forEach(playerEl => {
    playerEl.addEventListener('click',()=>{
      const currentPlayer = findTheCurrentPlayer();
      if(currentPlayer){
        //hide move options if it is being displayed 
        document.querySelector('.move-options-container').classList.remove('visible');
        const home = playerEl.classList[1];
        //if the clicked player matches the current player & is in jail and has the value to be moved out 
        //then free it
        if(home === currentPlayer.home && !playerEl.dataset.playerOut && currentPlayer.text.length > 1){
          moveToFirstBox(playerEl);
          //if the user has clicked a matching free player with only one number to be moved then move it
        }else if(home === currentPlayer.home && playerEl.dataset.playerOut && currentPlayer.text.length === 1){
          movePlayer(playerEl,Number(currentPlayer.text),false);
        }else if(home === currentPlayer.home && playerEl.dataset.playerOut && currentPlayer.text.length > 1){
          playerEl.classList.add('move-options-player');
          handleMoveOptions(playerEl,currentPlayer.home);
        }else if(home !== currentPlayer.home ){
          //if the clicked player does not match the current player then point to the current player
          displayDialog('Note',`Its currently the turn of the ${currentPlayer.home} player`,'note');
        };
      };
    });
  });

  document.querySelectorAll('.player.done').forEach( playerEl => {
    playerEl.addEventListener('animationend',(e)=>{
      /*make sure the correct player is being removed*/
      const home = e.target.classList[1];
      const scoreTxtEl = document.querySelector(`li.${home} > div`);
      scoreTxtEl.innerHTML = ++scoreTxtEl.textContent;
      e.target.style.display = 'none';
    });
  });
  // display the default browser pop when the user 
  // refreshes the game page
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

  document.querySelectorAll('.move-option').forEach(moveEl => {
    moveEl.addEventListener('click',(e)=>{
      e.target.parentElement.parentElement.classList.remove('visible');
      movePlayer(document.querySelector('.move-options-player'),Number(e.target.textContent),false)
    });
  });
}