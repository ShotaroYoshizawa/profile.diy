window.addEventListener("DOMContentLoaded", () => {
  initCanvasWithModels('#myCanvas1', 
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
    'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/cb0e9e06179648a51c9922f5df310fb4c6552a60/glb/bed3.1.glb'
  );
});

function initCanvasWithModels(canvasSelector, modelUrl1, modelUrl2) {
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
  camera.position.set(6, 3, distance / 10000 * 4);
  camera.lookAt(scene.position);

  // コントロールを作成
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  let model1 = null;
  let model2 = null;

  // 3Dモデルの読み込み
  const loader = new THREE.GLTFLoader();
  loader.load(
      modelUrl1,
      function (glb) {
          model1 = glb.scene;
          model1.scale.set(1, 1, 1);
          model1.position.set(0, 0, 0);
          scene.add(model1);

          // モデルの構造をコンソールに出力
          console.log('Model1 Structure:', model1);

          // パーツを順番に表示（最初はすべて表示）
          model1.traverse((child) => {
              if (child.isMesh) {
                  child.visible = true;
              }
          });

          // 1秒後にパーツを順番に消す処理を開始
          setTimeout(() => {
              let parts1 = [];
              model1.traverse((child) => {
                  if (child.isMesh) {
                      parts1.push(child);
                  }
              });

              let index1 = 0;
              function hideNextParts() {
                  // 消すパーツの数を指定
                  const partsToHideAtOnce = 2; 
                  for (let i = 0; i < partsToHideAtOnce && index1 < parts1.length; i++, index1++) {
                      parts1[index1].visible = false;
                  }

                  if (index1 < parts1.length) {
                      setTimeout(hideNextParts, 100); // 0.1秒ごとに消す
                  } else {
                      // すべて消した後に2つ目のモデルを順に表示
                      showModel2();
                  }
              }

              hideNextParts();
          }, 1000); // 1秒後に開始
      },
      undefined,
      function (error) {
          console.log(error);
      }
  );

  loader.load(
      modelUrl2,
      function (glb) {
          model2 = glb.scene;
          model2.scale.set(1, 1, 1);
          model2.position.set(0, 0, 0);
          scene.add(model2);

          // モデルの構造をコンソールに出力
          console.log('Model2 Structure:', model2);

          // パーツを初期状態で非表示
          model2.traverse((child) => {
              if (child.isMesh) {
                  child.visible = false;
              }
          });
      },
      undefined,
      function (error) {
          console.log(error);
      }
  );

  function showModel2() {
      let parts2 = [];
      model2.traverse((child) => {
          if (child.isMesh) {
              parts2.push(child);
          }
      });

      let index2 = 0;
      function showNextParts() {
          // 表示するパーツの数を指定
          const partsToShowAtOnce = 2; 
          for (let i = 0; i < partsToShowAtOnce && index2 < parts2.length; i++, index2++) {
              parts2[index2].visible = true;
          }

          if (index2 < parts2.length) {
              setTimeout(showNextParts, 100); // 0.1秒ごとに表示
          }
      }

      showNextParts();
  }

  // ボタンのクリックイベント
  const hidePartsButton = document.getElementById('hidePartsButton');
  hidePartsButton.addEventListener('click', () => {
      if (!model2) {
          return;
      }

      let parts2 = [];
      model2.traverse((child) => {
          if (child.isMesh) {
              parts2.push(child);
          }
      });

      let index2 = 0;
      function hideNextParts() {
          // 消すパーツの数を指定
          const partsToHideAtOnce = 2;
          for (let i = 0; i < partsToHideAtOnce && index2 < parts2.length; i++, index2++) {
              parts2[index2].visible = false;
          }

          if (index2 < parts2.length) {
              setTimeout(hideNextParts, 100); // 0.1秒ごとに消す
          }
      }

      hideNextParts();
  });

  function tick() {
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
  }
  tick();
}

