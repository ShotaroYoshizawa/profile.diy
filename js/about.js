window.addEventListener("DOMContentLoaded", () => {
  // セクションごとに切り替えるモデル
  const modelUrls = [
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/cb0e9e06179648a51c9922f5df310fb4c6552a60/glb/bed3.1.glb',
      sectionClass: 'section1',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -45, z: 0 }
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed4.glb',
      sectionClass: 'section2',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -45, z: 0 }
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
      sectionClass: 'section3',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -45, z: 0 }
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
      sectionClass: 'section4',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -45, z: 0 }
    }
  ];

  // 初期に表示して非表示にするモデル
  const initialModel = {
    url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: -45, z: 0 }
  };

  // 周りに表示するモデル
  const additionalModels = [
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
      position: { x: -3, y: 0, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed4.glb',
      position: { x: -1.5, y: 0, z: -6 },
      rotation: { x: 0, y: 90, z: 0 },
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
      position: { x: 1.5, y: 0, z: -6 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
      position: { x: 3, y: 0, z: -3 },
      rotation: { x: 0, y: 45, z: 0 },
    }
  ];

  let currentModelIndex = 0; // 現在のモデルのインデックス
  let currentModel = null; // 現在のモデルオブジェクト
  let scene, camera, renderer, controls; // シーン、カメラ、レンダラー、コントロール
  const loader = new THREE.GLTFLoader(); // GLTFLoaderのインスタンスを一度だけ生成

  function initScene() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas1');
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasElement,
      alpha: true // 透過を有効化
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    ambientLight.intensity = 2;
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.intensity = 3;
    directionalLight.position.set(0, 4, 8);
    scene.add(directionalLight);

    // カメラを作成
    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 4);

    // グリッド背景
    const gridHelper = new THREE.GridHelper(50, 40, 0xdcdcdc, 0xdcdcdc);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // 3Dモデルの読み込み
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 追加モデルを読み込み
    additionalModels.forEach(model => {
      loadAdditionalModel(model);
    });

    // ページ読み込み時のスクロール位置をチェックして初期モデルを読み込み
    if (window.scrollY === 0) {
      loadInitialModel();
    }
  }

  // 初期モデルを読み込む
  function loadInitialModel() {
    loadModel(initialModel, () => {
      setTimeout(() => {
        hideModelParts(currentModel, 75, 4, () => {
          setTimeout(() => {
            loadModelSequentially(modelUrls[0]);
          }, 300);
        });
      }, 700);
    });
  }

  // モデルを読み込む
  function loadModel(modelData, callback) {
    loader.load(
      modelData.url,
      function (glb) {
        if (currentModel) {
          scene.remove(currentModel);
        }
        currentModel = glb.scene;
        currentModel.scale.set(1, 1, 1);
        currentModel.position.set(modelData.position.x, modelData.position.y, modelData.position.z);
        currentModel.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
        scene.add(currentModel);

        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.visible = true;
          }
        });

        if (callback) callback();
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );
  }

  // モデルをパーツごとに順に読み込む
  function loadModelSequentially(modelData) {
    loader.load(
      modelData.url,
      function (glb) {
        if (currentModel) {
          scene.remove(currentModel);
        }
        currentModel = glb.scene;
        currentModel.scale.set(1, 1, 1);
        currentModel.position.set(modelData.position.x, modelData.position.y, modelData.position.z);
        currentModel.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
        scene.add(currentModel);

        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.visible = false;
          }
        });

        showModelParts(currentModel, 50, 2);
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );
  }

  // 追加モデルを読み込む
  function loadAdditionalModel(modelData) {
    loader.load(
      modelData.url,
      function (glb) {
        const additionalModel = glb.scene;
        additionalModel.traverse(function (child) {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.5;
            child.material.color.setHex('0x808080');
          }
        });
        additionalModel.scale.set(1, 1, 1);
        additionalModel.position.set(modelData.position.x, modelData.position.y, modelData.position.z);
        additionalModel.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
        scene.add(additionalModel);
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );
  }

  // モデルパーツを順に表示
  function showModelParts(model, interval, count) {
    let parts = [];
    model.traverse((child) => {
      if (child.isMesh) {
        parts.push(child);
      }
    });

    let batchCount = 0;
    for (let i = 0; i < parts.length; i += count) {
      setTimeout(() => {
        for (let j = i; j < i + count && j < parts.length; j++) {
          parts[j].visible = true;
        }
      }, batchCount * interval);
      batchCount++;
    }
  }

  // モデルパーツを順に非表示にしてコールバックを実行
  function hideModelParts(model, interval, count, callback) {
    let parts = [];
    model.traverse((child) => {
      if (child.isMesh) {
        parts.push(child);
      }
    });

    let batchCount = 0;
    for (let i = 0; i < parts.length; i += count) {
      setTimeout(() => {
        for (let j = i; j < i + count && j < parts.length; j++) {
          parts[j].visible = false;
        }
        if (i + count >= parts.length && callback) {
          callback();
        }
      }, batchCount * interval);
      batchCount++;
    }
  }

  // アニメーションループ
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  // 初期化関数を呼び出し、アニメーションを開始
  initScene();
  animate();

  // セクションの監視
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = modelUrls.findIndex(model => entry.target.classList.contains(model.sectionClass));
        if (index !== -1 && index !== currentModelIndex) {
          currentModelIndex = index;
          loadModel(modelUrls[currentModelIndex]);
        }
      }
    });
  }, { threshold: 0.5 });

  // 各セクションを監視対象として追加
  modelUrls.forEach(model => {
    const sections = document.getElementsByClassName(model.sectionClass);
    Array.from(sections).forEach(section => observer.observe(section));
  });

  // リサイズイベントに対応
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // スクロールイベントに応じてモデルを回転させる
  window.addEventListener('scroll', () => {
    if (currentModel) {
      const rotationSpeed = 0.001; // 回転速度の調整
      currentModel.rotation.y = modelUrls[0].rotation.y + rotationSpeed * window.scrollY;
    }
  });
});

// lode用
function load_effect() {
  var element = document.getElementsByClassName('load-fade');
  if (!element) return; // 要素がない場合は終了

  for (var i = 0; i < element.length; i++) {
    element[i].classList.add('is-show');
  }
}
setTimeout(load_effect, 600); // 600ミリ秒経過後に実行

// scroll用
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



//About　のスライド移行
const img = [
  "picture/tanbo/tanbo1.jpg",
  "picture/tanbo/tanbo2.jpg",
  "picture/tanbo/tanbo3.jpg",
  "picture/tanbo/tanbo4.jpg",
  "picture/tanbo/tanbo5.jpg",
  "picture/tanbo/tanbo6.jpg"
];

let count = 0;
const changePic = document.getElementById('changePic');

function picChange() {
  count = (count + 1) % img.length;
  
  // 画像のロード完了を待たずに切り替え
  changePic.src = img[count];

  setTimeout(picChange, 8000);
}

picChange();