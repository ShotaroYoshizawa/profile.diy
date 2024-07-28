// scroll用(表示非表示)
function scroll_effect() {
  var elements = document.getElementsByClassName('scroll-hidden');
  if (!elements) return;

  var scrollY = window.pageYOffset;
  var windowH = window.innerHeight;
  var midPoint = scrollY + windowH / 2;

  for (var i = 0; i < elements.length; i++) {
    var elemClientRect = elements[i].getBoundingClientRect();
    var elemTop = scrollY + elemClientRect.top;
    var elemBottom = scrollY + elemClientRect.bottom;

    // 要素のトップが画面の半分より上、またはボトムが画面の半分より下の場合
    if (elemTop < midPoint && elemBottom > midPoint) {
      elements[i].classList.add('is-visible');
      elements[i].classList.remove('is-hidden-above-half');
    } else {
      elements[i].classList.remove('is-visible');
      elements[i].classList.add('is-hidden-above-half');
    }
  }
}

window.addEventListener('scroll', scroll_effect); // スクロール時に実行


// スクロール用(スクロール&ロード)
function scrollEffect() {
  var elements = document.getElementsByClassName('load-scroll-hidden');
  if (!elements) return;

  var scrollY = window.pageYOffset;
  var windowH = window.innerHeight;
  var midPoint = scrollY + windowH / 2;

  for (var i = 0; i < elements.length; i++) {
    var elemClientRect = elements[i].getBoundingClientRect();
    var elemTop = scrollY + elemClientRect.top;
    var elemBottom = scrollY + elemClientRect.bottom;

    // 要素のトップが画面の半分より上、またはボトムが画面の半分より下の場合
    if (elemTop < midPoint && elemBottom > midPoint) {
      elements[i].classList.add('is-visible');
      elements[i].classList.remove('is-hidden-above-half');
    } else {
      elements[i].classList.remove('is-visible');
      elements[i].classList.add('is-hidden-above-half');
    }
  }
}

window.addEventListener('scroll', scrollEffect); // スクロール時に実行

// ロード用(スクロール&ロード)
function loadEffect() {
  var elements = document.getElementsByClassName('load-scroll-hidden');
  if (!elements) return; // 要素がない場合は終了

  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add('is-visible');
  }
}

setTimeout(loadEffect, 600); // 600ミリ秒経過後に実行

// 両方を組み合わせる
function initEffects() {
  loadEffect(); // ロード時に要素を表示
  scrollEffect(); // スクロール時に要素の表示/非表示を切り替え
}

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(initEffects, 600); // 600ミリ秒経過後に初期化
});

