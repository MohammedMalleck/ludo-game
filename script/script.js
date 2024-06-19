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

function displayDialog(headingText,messageText,btnText){
  document.querySelector('.message-heading').textContent = headingText;
  document.querySelector('.message-text').textContent = messageText;
  document.querySelector('.message-btn').textContent = btnText;
  document.querySelector('dialog').showModal();
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
    displayDialog('Error','Select at least any 2 players to play the game','Okay');
    document.querySelector('dialog').classList.add('error');
  }else{
    saveAcivePlayersInfo();
    document.querySelector('.game-page').classList.add('show');
  };

});

document.querySelector('.message-btn').addEventListener('click',()=>{
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
      displayDialog('Error',error.message,'Okay');
      document.querySelector('dialog').classList.add('error');
    }
   });
});