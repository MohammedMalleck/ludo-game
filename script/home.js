class playGameEvent{
  #timeoutId;
  #selectionContent = document.querySelector(".players-selection-container");
  constructor(element){

    element.addEventListener('click',()=>{
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
      if(isTouchDevice){
        clearTimeout(this.#timeoutId);
        element.classList.add('expand');
        this.#timeoutId = setTimeout(()=>{
          this.#handlePlayGame(element);
        },450)
      }else{
        this.#handlePlayGame(element);
      }
    });
  }

  #handlePlayGame(playGameBtn){
    const playGameRect = playGameBtn.getBoundingClientRect();
    this.#selectionContent.classList.add("show");
    this.#selectionContent.style.setProperty("--t", playGameRect.top + "px");
    this.#selectionContent.style.setProperty("--r", window.innerWidth - playGameRect.right + "px");
    this.#selectionContent.style.setProperty("--b", window.innerHeight - playGameRect.bottom + "px");
    this.#selectionContent.style.setProperty("--l", playGameRect.left + "px");
    this.#selectionContent.style.setProperty("--br", '100vw');
    //cause reflow
    this.#selectionContent.clientWidth;
    //after reflow add transitions and expand the 
    //clip path
    this.#selectionContent.style.transition = "all .7s";  
    this.#selectionContent.style.setProperty("--t", "0px");
    this.#selectionContent.style.setProperty("--r", "0px");
    this.#selectionContent.style.setProperty("--b", "0px");
    this.#selectionContent.style.setProperty("--l", "0px");
    this.#selectionContent.style.setProperty("--br", "0px");
  }
}

new playGameEvent(document.querySelector('.play-game-btn'));


