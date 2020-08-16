const textarea = document.querySelector('#textarea');
const saveBtn = document.querySelector('#save');

let data = JSON.parse(localStorage.getItem('data'))
if(data == null){
    storage()
    textarea.value = JSON.parse(localStorage.getItem('data')).blockQueryStringList
}else{
    textarea.value = JSON.parse(localStorage.getItem('data')).blockQueryStringList
}

saveBtn.onclick = function(){
    console.log(textarea.value)
    if(!textarea.value){
        storage()
        textarea.value = JSON.parse(localStorage.getItem('data')).blockQueryStringList
    }else{
         localStorage.setItem('data',JSON.stringify({blockQueryStringList: textarea.value}))
    }
    location.reload();
};

function storage(){
    localStorage.setItem('data',JSON.stringify({blockQueryStringList: 'callback\njsonp\njavascript'}))
}