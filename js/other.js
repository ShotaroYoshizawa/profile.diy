window.addEventListener("DOMContentLoaded", () => {
  let currentModelIndex = 0;
  const models = [
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table2.glb',
    // Add more model URLs here if needed
  ];
  
  initCanvasWithModel('#myCanvas1', models[currentModelIndex]);

  document.getElementById('nextButton').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex + 1) % models.length;
    changeModel('#myCanvas1', models[currentModelIndex]);
  });

  document.getElementById('prevButton').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
    changeModel('#myCanvas1', models[currentModelIndex]);
  });
});

function changeModel(canvasSelector, modelUrl) {
  const canvasElement = document.querySelector(canvasSelector);
  const renderer = canvasElement.renderer;
  const scene = canvasElement.scene;
  const camera = canvasElement.camera;
  const controls = canvasElement.controls;
  let model = canvasElement.model;

  // Remove current model if exists
  if (model !== null) {
    scene.remove(model);
    model = null;
  }

  // Load new model
  const loader = new THREE.GLTFLoader();
  loader.load(
    modelUrl,
    function (glb) {
      model = glb.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(glb.scene);
      canvasElement.model = model; // Update the model reference
    },
    undefined,
    function (error) {
      console.log(error);
    }
  );
}

function initCanvasWithModel(canvasSelector, modelUrl) {
  const canvasElement = document.querySelector(canvasSelector);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasElement,
    alpha: true,
  });
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  ambientLight.intensity = 2;
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.intensity = 3;
  directionalLight.position.set(0, 4, 8);
  scene.add(directionalLight);

  const fov = 30;
  const fovRad = (fov / 2) * (Math.PI / 180);
  let distance = (window.innerHeight / 2) / Math.tan(fovRad);
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(4, 2, distance / 10000 * 8);
  camera.lookAt(scene.position);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  canvasElement.renderer = renderer;
  canvasElement.scene = scene;
  canvasElement.camera = camera;
  canvasElement.controls = controls;
  
  changeModel(canvasSelector, modelUrl);

  window.addEventListener('scroll', () => {
    const model = canvasElement.model;
    if (model) {
      const scrollPosition = window.scrollY;
      model.rotation.y = scrollPosition * 0.001;
    }
  });

  function tick() {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();
}


window.addEventListener("DOMContentLoaded", () => {
  initGridCanvas('#myCanvas0'); //グリッド背景
});

//グリッド背景
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

  //グリッド背景
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