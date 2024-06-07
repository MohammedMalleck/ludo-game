class DiceHandle{
  #diceEl;
  #diceContainer;
  #clicked;

  constructor(element){
    this.#diceEl = element;
    this.#diceContainer = element.parentElement;
    this.#diceEl.addEventListener('click',()=>{
      if(this.#diceContainer.classList.contains('active') && !this.#clicked){
        this.#clicked = true;
        const random =  Math.floor(Math.random() * 6) + 1;
        this.#rollDice(random)
      };
    });
  };
  
  #rollDice(number){   
    this.#diceEl.style.animation = 'rolling 3s'; 
    setTimeout(()=>{
      this.#handleAnimationEnd(number);
    },3.2 * 1000)
  };

  #handleAnimationEnd(number){
    this.#diceEl.style.animation = 'none'; 
    switch(number){
      case 1: 
        this.#diceEl.style.transform = 'rotateX(0deg) rotateY(0deg)';
        break;
      case 2: 
        this.#diceEl.style.transform = 'rotateX(0deg) rotateY(-90deg)';
        break;   
      case 3: 
        this.#diceEl.style.transform = 'rotateX(-180deg) rotateY(0deg)';
        break;   
      case 4:
        this.#diceEl.style.transform = 'rotateX(0deg) rotateY(90deg)';
        break;   
      case 5: 
        this.#diceEl.style.transform = 'rotateX(90deg) rotateY(0deg)';
        break;   
      case 6:
        this.#diceEl.style.transform = 'rotateX(-90deg) rotateY(0deg)';
        break;
    }
    setTimeout(()=>{
      this.#clicked = false;
      this.#diceContainer.classList.remove('active');
    },1500);
  };
    
};

document.querySelectorAll('.dice').forEach(diceEl => {
  new DiceHandle(diceEl);
});