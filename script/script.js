import  './home.js';
import  './game.js';

const gamePageEl = document.querySelector('.game-page');

gamePageEl.style.setProperty("--screen-width", window.innerWidth + "px");
window.addEventListener('resize', ()=> {
  if(!gamePageEl.classList.contains('show')){
    gamePageEl.style.setProperty("--screen-width", window.innerWidth + "px")
  }
});

//show the game page
// document.querySelector('.play-btn').addEventListener('click',()=>{
//   gamePageEl.classList.add('show');
// });