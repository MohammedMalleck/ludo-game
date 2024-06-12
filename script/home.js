const content = document.querySelector(".players-selection-container");
const playGameBtn = document.querySelector('.play-game-btn');
const playGameRect = playGameBtn.getBoundingClientRect();

playGameBtn.addEventListener('click',()=>{
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
});

document.querySelectorAll('.check-container').forEach(checkEl => {
  checkEl.addEventListener('click',()=>{
    checkEl.classList.add('check');
  });
});

