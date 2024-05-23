//About　のスライド移行

const img = ["picture/tanbo/tanbo1.jpg",
    "picture/tanbo/tanbo2.jpg",
    "picture/tanbo/tanbo3.jpg",
    "picture/tanbo/tanbo4.jpg",
    "picture/tanbo/tanbo5.jpg",
    "picture/tanbo/tanbo6.jpg"];
let count = -1;
picChange();
function picChange() {
    count++;
    if (count == img.length) count = 0;
    //画像選択
    changePic.src = img[count];
    //秒数の指定
    setTimeout("picChange()", 8000);
}

//lode用
function load_effect() {
    var element = document.getElementsByClassName('load-fade');
    if(!element) return; // 要素がない場合は終了
    
    for(var i = 0; i < element.length; i++) { 
      element[i].classList.add('is-show');
    }
  }
  setTimeout(load_effect, 600); // 600ミリ秒経過後に実行
  
  //scroll用
  function scroll_effect() {
    var element = document.getElementsByClassName('scroll-up');
    if(!element) return;
                        
    var scrollY = window.pageYOffset;
    var windowH = window.innerHeight;
    var showTiming = 200; // 要素を表示するタイミング
    for(var i = 0; i < element.length; i++) { 
      var elemClientRect = element[i].getBoundingClientRect(); 
      var elemY = scrollY + elemClientRect.top; 
      if(scrollY > elemY - windowH + showTiming) {
        element[i].classList.add('is-show');
      }
    }
  }
  window.addEventListener('scroll', scroll_effect); // スクロール時に実行