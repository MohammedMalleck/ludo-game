import  './home.js';
import { gameJSCode } from './game.js';


function saveAcivePlayersInfo(){
  const activePlayers = Array.from(document.querySelectorAll('.check-container.check')).map(activePlayer => {
    const {imgUrl} = activePlayer.nextElementSibling.nextElementSibling.dataset;
    //make the first character capital(ie :- yellow would become Yellow)
    const defaultName = activePlayer.classList[1].replace(/^./,match => match.toUpperCase());
    return {
        home : activePlayer.classList[1],
        name : activePlayer.nextElementSibling.value === '' ? defaultName : activePlayer.nextElementSibling.value,
        image : imgUrl || './images/user-image.jpeg'
    };
  });

  localStorage.setItem('activePlayers',JSON.stringify(activePlayers));
  //after saving the acive players info  show the game page and run its js code 
  gameJSCode();
}

export function displayDialog(heading,note,type){
  const dialogEl = document.querySelector('dialog');
  const dialogBtnContainer = document.querySelector('.dialog-btn-container');
  document.querySelector('.dialog-heading').textContent = heading;
  document.querySelector('.dialog-note').textContent = note;

  //remove an note/quit-game class from 
  //dialog btn container before adding any class
  if(dialogBtnContainer.classList[1]){
    dialogBtnContainer.classList.remove(dialogBtnContainer.classList[1]);
  };

  dialogEl.showModal();
  /*add success or error depending upon the type of button being displayed*/
  dialogEl.className = type === 'play-again' ? 'success' : 'error';
  dialogBtnContainer.classList.add(type);
}

function getImgUrl(file){
  //read the file and return the url
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  return new Promise((resolve,reject) => {
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = () => {
      reject(new Error('An Unexpected Error has occured kindly refresh the page'))
    };
  });
}

document.querySelector('.game-page').style.setProperty("--screen-width", window.innerWidth + "px");
window.addEventListener('resize', ()=> {
  const gamePageEl = document.querySelector('.game-page');
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
  if(activePlayers < 2){
    displayDialog('Error','Select at least any 2 players to play the game','note');
  }else{
    saveAcivePlayersInfo();
    document.querySelector('.game-page').classList.add('show');
  };

});

document.querySelector('.dialog-btn.okay').addEventListener('click',()=>{
  document.querySelector('dialog').close();
});

//open the image uploader tab on clicking
//upload image btn 
document.querySelectorAll('.upload-image-btn').forEach(uploadImgBtn => {
  uploadImgBtn.addEventListener('click',()=>{
    uploadImgBtn.nextElementSibling.click();
  });
});

document.querySelectorAll('input[type="file"]').forEach(fileEl => {
  fileEl.addEventListener('change',async(e)=>{
    try{
      const imgUrl = await getImgUrl(e.target.files[0]);
      const uploadBtn = e.target.previousSibling.previousSibling;
      uploadBtn.setAttribute('data-img-url' , imgUrl);
      uploadBtn.textContent = 'Uploaded !';
      //make sure to reset the input el values else the change
      //event wont be triggerd on selecting the same file again
      e.target.value = '';
    }catch(error){
      displayDialog('Error',error.message,'note');
    }
   });
});