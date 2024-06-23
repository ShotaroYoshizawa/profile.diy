const models = [
  {
    id: 'section0',
    url: '',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    cameraOffset: { x: 0, y: 3, z: 10 }
  },
  {
    id: 'section1',
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
    position: { x: 0, y: 1, z: 5 },
    rotation: { x: 0, y: -45, z: 0 },
    cameraOffset: { x: 0, y: 2, z: 4 }
  },
  {
    id: 'section2',
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
    position: { x: -3, y: 1, z: 2 },
    rotation: { x: 0, y: 0, z: 0 },
    cameraOffset: { x: -3, y: 1.5, z: 0 }
  },
  {
    id: 'section3',
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/4b0f1f42dd3cfe8d0c92526fa64bea879ba943c4/glb/chair.glb',
    position: { x: -1.5, y: 1, z: -1 },
    rotation: { x: 0, y: 45, z: 0 },
    cameraOffset: { x: 0, y: 1, z: -2 }
  },
  {
    id: 'section4',
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
    position: { x: 1.5, y: 1, z: -1 },
    rotation: { x: 0, y: 0, z: 0 },
    cameraOffset: { x: 0, y: 2, z: -4 }
  },
  {
    id: 'section5',
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
    position: { x: 3, y: 1, z: 2 },
    rotation: { x: 0, y: 45, z: 0 },
    cameraOffset: { x: 4, y: 2, z: 0 }
  }
];

let scene, camera, renderer, controls, currentModels = [];
let activeModelIndex = -1;
let rotationRequestId;
let cameraTween;
const originalMaterials = []; // オリジナルのマテリアル情報を保存する配列

// 初期化関数
function init() {
  // レンダラーを作成
  const canvasElement = document.querySelector('#myCanvas1');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasElement,
    alpha: true,
  });
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // シーンを作成
  scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0);

  // 環境光源を作成
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);

  // 平行光源を作成
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(0, 4, 8);
  scene.add(directionalLight);

  // カメラを作成
  const fov = 45;
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 10);

  //グリッド背景
  const gridHelper = new THREE.GridHelper(50, 80, 0xdcdcdc, 0xdcdcdc);
  scene.add(gridHelper);

  // コントロールを作成
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // 全モデルの読み込み
  loadModels();

  // レンダリングループ
  function tick() {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  // スクロールイベントを設定
  window.addEventListener('scroll', onScroll);
}

function loadModels() {
  const loader = new THREE.GLTFLoader();
  models.forEach((modelData, index) => {
    loader.load(
      modelData.url,
      function (glb) {
        const model = glb.scene;
        model.scale.set(1, 1, 1);
        model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

        // 度数をラジアンに変換して回転を設定
        model.rotation.set(
          THREE.MathUtils.degToRad(modelData.rotation.x),
          THREE.MathUtils.degToRad(modelData.rotation.y),
          THREE.MathUtils.degToRad(modelData.rotation.z)
        );

        // オリジナルのマテリアル情報を保存
        const originalMaterial = {};
        model.traverse((child) => {
          if (child.isMesh) {
            originalMaterial[child.uuid] = child.material.clone();
          }
        });
        originalMaterials[index] = originalMaterial;

        scene.add(model);
        currentModels[index] = model;  // 正しいインデックスでモデルを保存
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  });
}

function onScroll() {
  const sections = document.querySelectorAll('.section');
  const scrollTop = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      const sectionId = section.id; // セクションのIDを取得
      const modelIndex = models.findIndex(model => model.id === sectionId); // セクションのIDとmodelsのIDを比較
      if (modelIndex !== -1) {
        switchCameraAndRotateModel(modelIndex);
      }
    }
  });
}

function switchCameraAndRotateModel(index) {
  if (index === activeModelIndex) return; // 同じセクションなら何もしない

  // 前のモデルの回転を停止
  cancelAnimationFrame(rotationRequestId);

  // すべてのモデルのマテリアルをリセットし、セクション対象外のモデルを半透明にする
  currentModels.forEach((model, i) => {
    if (i === index) {
      resetModelMaterial(model, i); // オリジナルのマテリアルにリセット
    } else {
      setModelMaterial(model); // 半透明のグレーに設定
    }
  });

  activeModelIndex = index;

  // カメラの位置を更新
  const modelData = models[index];
  const newCameraPosition = {
    x: modelData.position.x + modelData.cameraOffset.x,
    y: modelData.position.y + modelData.cameraOffset.y,
    z: modelData.position.z + modelData.cameraOffset.z,
  };

  // カメラの位置更新中にモデルの回転を停止しない
  if (cameraTween) cameraTween.kill();

  cameraTween = gsap.to(camera.position, {
    duration: 1,
    x: newCameraPosition.x,
    y: newCameraPosition.y,
    z: newCameraPosition.z,
    onUpdate: function () {
      camera.lookAt(modelData.position.x, modelData.position.y, modelData.position.z);
    },
    onComplete: function () {
      camera.lookAt(modelData.position.x, modelData.position.y, modelData.position.z);
    }
  });

  // カメラが常にモデルの設置座標を見るようにする
  gsap.to(controls.target, {
    duration: 1,
    x: modelData.position.x,
    y: modelData.position.y,
    z: modelData.position.z,
  });

  // モデルの回転を再開
  startModelRotation(index);
}

function startModelRotation(index) {
  const model = currentModels[index];
  const rotationSpeed = 0.01;

  function animateRotation() {
    if (index !== activeModelIndex) return;
    model.rotation.y += rotationSpeed;
    rotationRequestId = requestAnimationFrame(animateRotation);
  }

  animateRotation();
}

function setModelMaterial(model) {
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 0.5,
      });
    }
  });
}

function resetModelMaterial(model, index) {
  model.traverse((child) => {
    if (child.isMesh && originalMaterials[index][child.uuid]) {
      child.material = originalMaterials[index][child.uuid].clone();
    }
  });
}

// 初期化関数を実行
init();


// ボタンの表示を制御する関数
window.onscroll = function () {
  var scrollTopButton = document.getElementById("scrollTopButton");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopButton.style.display = "flex";
  } else {
    scrollTopButton.style.display = "none";
  }
};

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

// ページの一番上にスクロールする関数
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
