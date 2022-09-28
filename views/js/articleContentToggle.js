const clickTitle = document.querySelectorAll('.list-wrap table tbody tr');
const articleContent = document.querySelectorAll('.list-wrap table tbody tr:nth-child(2n)');

let titleIndex = 0;

function getIndex(selector){
    let elem = document.querySelector(selector);
    for(let i=0; i<elem.parentNode.childNodes.length; i++){
        if(elem.parentNode.childNodes[i] === elem){
            return i;
        }
    }
}

function showContent(elem){
    if(articleContent[getIndex(elem)-1].classList.contains('show')){
        articleContent[getIndex(elem)-1].style.display = "none";
        articleContent[getIndex(elem)-1].classList.remove("show");
    }else{
        articleContent[getIndex(elem)-1].style.display = "block";
        articleContent[getIndex(elem)-1].classList.add("show");
    }
}