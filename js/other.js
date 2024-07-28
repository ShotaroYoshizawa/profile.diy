window.addEventListener("DOMContentLoaded", () => {
  const models = [
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table2.glb',
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
    // 他のモデルURLをここに追加
  ];
  let currentIndex = 0;
  let model = null;

  initGridCanvas('#myCanvas0'); // グリッド背景
  initCanvasWithModel('#myCanvas1', models[currentIndex]);

  document.getElementById('prevModelButton').addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : models.length - 1;
    initCanvasWithModel('#myCanvas1', models[currentIndex]);
  });

  document.getElementById('nextModelButton').addEventListener('click', () => {
    currentIndex = (currentIndex < models.length - 1) ? currentIndex + 1 : 0;
    initCanvasWithModel('#myCanvas1', models[currentIndex]);
  });

  function initCanvasWithModel(canvasSelector, modelUrl) {
    // レンダラーを作成
    const canvasElement = document.querySelector(canvasSelector);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasElement,
      alpha: true, // 透過を有効化
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0); // 背景色のアルファ値を透過指定

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    ambientLight.intensity = 2;
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.intensity = 3;
    directionalLight.position.set(0, 4, 8); // x, y, z の位置を指定
    scene.add(directionalLight);

    // カメラを作成
    const fov = 30;
    const fovRad = (fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
    let distance = (window.innerHeight / 2) / Math.tan(fovRad); // カメラ距離を求める
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 2, distance / 10000 * 8);
    camera.lookAt(scene.position);

    // コントロールを作成
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    loader.load(
      modelUrl,
      function (glb) {
        if (model) {
          scene.remove(model);
        }
        model = glb.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.002; // 常時回転
      }
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
});

// グリッド背景
function initGridCanvas(canvasSelector) {
  // レンダラーを作成
  const canvasElement = document.querySelector(canvasSelector);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasElement,
    alpha: true, // 透過を有効化
  });

  // サイズ指定
  function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // シーンを作成
  const scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(40, 30, 40);
  camera.lookAt(0, 0, 0);

  // グリッド背景
  const gridHelper = new THREE.GridHelper(200, 40, 0xdcdcdc, 0xdcdcdc);
  scene.add(gridHelper);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    resizeRenderer();
  });

  resizeRenderer();
  animate();
}



//lode用
function load_effect() {
  var element = document.getElementsByClassName('load-fade');
  if (!element) return; // 要素がない場合は終了

  for (var i = 0; i < element.length; i++) {
    element[i].classList.add('is-show');
  }
}
setTimeout(load_effect, 600); // 600ミリ秒経過後に実行
// ↑↑↑

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
// ↑↑↑

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
// ↑↑↑

// ロード用(スクロール&ロード)
function loadEffect() {
  var elements = document.getElementsByClassName('load-scroll-hidden');
  if (!elements) return; // 要素がない場合は終了

  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add('is-visible');
  }
}

setTimeout(loadEffect, 600); // 600ミリ秒経過後に実行
// ↑↑↑

// 両方を組み合わせる
function initEffects() {
  loadEffect(); // ロード時に要素を表示
  scrollEffect(); // スクロール時に要素の表示/非表示を切り替え
}

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(initEffects, 600); // 600ミリ秒経過後に初期化
});
// ↑↑↑


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


// ボタンの表示を制御する関数
window.onscroll = function () {
  var scrollTopButton = document.getElementById("scrollTopButton");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopButton.style.display = "flex";
  } else {
    scrollTopButton.style.display = "none";
  }
};

// ページの一番上にスクロールする関数
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}