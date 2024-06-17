import  './home.js';
import { gameJSCode } from './game.js';

const gamePageEl = document.querySelector('.game-page');

gamePageEl.style.setProperty("--screen-width", window.innerWidth + "px");
window.addEventListener('resize', ()=> {
  if(!gamePageEl.classList.contains('show')){
    gamePageEl.style.setProperty("--screen-width", window.innerWidth + "px")
  }
});

//selection page code 
document.querySelectorAll('.check-container').forEach(checkEl => {
  checkEl.addEventListener('click',()=>{
    checkEl.classList.toggle('check');
  });
});

document.querySelector('.play-btn').addEventListener('click',()=>{
  const activePlayers = document.querySelectorAll('.check-container.check').length;
  const heading =  document.querySelector('.message-heading');
  const errorText = document.querySelector('.message-text');
  const okayBtn = document.querySelector('.message-btn');
  if(activePlayers < 2){
   heading.textContent = 'Error';
   errorText.textContent = 'Select at least any 2 players to play the game';
   okayBtn.textContent = 'Okay';
   document.querySelector('dialog').classList.add('error');
   document.querySelector('dialog').showModal();
  }else{
    saveAcivePlayersInfo();
    document.querySelector('.game-page').classList.add('show');
  };

});

document.querySelector('.message-btn').addEventListener('click',()=>{
  document.querySelector('dialog').close();
});

function saveAcivePlayersInfo(){
  const activePlayers = Array.from(document.querySelectorAll('.check-container.check')).map(activePlayer => {
    return {
        home : activePlayer.classList[1],
        name : activePlayer.nextElementSibling.value,
        image : './images/user-image.jpeg'
    };
  });

  localStorage.setItem('activePlayers',JSON.stringify(activePlayers));
  //after saving the acive players info  show the game page and run its js code 
  gameJSCode();
}