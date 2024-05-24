
//lode用
function load_effect() {
  var element = document.getElementsByClassName('load-fade');
  if (!element) return; // 要素がない場合は終了

  for (var i = 0; i < element.length; i++) {
    element[i].classList.add('is-show');
  }
}
setTimeout(load_effect, 600); // 600ミリ秒経過後に実行

//scroll用
function scroll_effect() {
  var element = document.getElementsByClassName('scroll-up');
  if (!element) return;

  var scrollY = window.pageYOffset;
  var windowH = window.innerHeight;
  var showTiming = 200; // 要素を表示するタイミング
  for (var i = 0; i < element.length; i++) {
    var elemClientRect = element[i].getBoundingClientRect();
    var elemY = scrollY + elemClientRect.top;
    if (scrollY > elemY - windowH + showTiming) {
      element[i].classList.add('is-show');
    }
  }
}
window.addEventListener('scroll', scroll_effect); // スクロール時に実行


// DIY画像の切り替え
var btn = document.getElementsByClassName('listItem');

// ボタンの個数分ループ
// 変数「i」に現在のループ回数が代入される
for (var i = btn.length - 1; i >= 0; i--) {
  btnAction(btn[i], i);
}

function btnAction(btnDOM, btnId) {
  // 各ボタンをイベントリスナーに登録
  btnDOM.addEventListener("click", function () {
    // activeクラスの追加と削除
    // thisは、クリックされたオブジェクト
    this.classList.toggle('act-pic');

    // クリックされていないボタンにactiveがついていたら外す
    for (var i = btn.length - 1; i >= 0; i--) {
      if (btnId !== i) {
        if (btn[i].classList.contains('act-pic')) {
          btn[i].classList.remove('act-pic');
        }
      }
    }
  })
}