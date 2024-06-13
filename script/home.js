const content = document.querySelector(".players-selection-container");
const playGameBtn = document.querySelector('.play-game-btn');



class playGameEvent{
  #timeoutId;
  constructor(element){

    element.addEventListener('click',()=>{
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
      if(isTouchDevice){
        clearTimeout(this.#timeoutId);
        playGameBtn.classList.add('expand');
        this.#timeoutId = setTimeout(()=>{
          handlePlayGame();
        },450)
      }else{
        handlePlayGame();
      }
    });
  }
}

function handlePlayGame(){
  const playGameRect = playGameBtn.getBoundingClientRect();
  content.classList.add("show");
  content.style.setProperty("--t", playGameRect.top + "px");
  content.style.setProperty("--r", window.innerWidth - playGameRect.right + "px");
  content.style.setProperty("--b", window.innerHeight - playGameRect.bottom + "px");
  content.style.setProperty("--l", playGameRect.left + "px");
  content.style.setProperty("--br", '100vw');
  //cause reflow
  content.clientWidth;
  //after reflow add transitions and expand the 
  //clip path
  content.style.transition = "all .7s";  
  content.style.setProperty("--t", "0px");
  content.style.setProperty("--r", "0px");
  content.style.setProperty("--b", "0px");
  content.style.setProperty("--l", "0px");
  content.style.setProperty("--br", "0px");
}

new playGameEvent(playGameBtn);

document.querySelectorAll('.check-container').forEach(checkEl => {
  checkEl.addEventListener('click',()=>{
    checkEl.classList.add('check');
  });
});

