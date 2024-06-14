window.addEventListener("DOMContentLoaded", () => {
    // セクションごとに表示するモデルの情報
    const modelUrls = [
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        sectionId: 'section1-test',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/cb0e9e06179648a51c9922f5df310fb4c6552a60/glb/bed3.1.glb',
        sectionId: 'section2-test',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        sectionId: 'section3-test',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
        sectionId: 'section4-test',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      }
    ];
  
    // 常に表示する追加モデルの情報
    const additionalModels = [
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
        position: { x: -3, y: 0, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        color: 0x808080,
        opacity: 0.8
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed4.glb',
        position: { x: -1.5, y: 0, z: -6 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        color: 0x808080,
        opacity: 0.8
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        position: { x: 1.5, y: 0, z: -6 },
        rotation: { x: 0, y: 0, z: 0 },
        color: 0x808080,
        opacity: 0.8
      },
      {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
        position: { x: 3, y: 0, z: -3 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        color: 0x808080,
        opacity: 0.8
      }
    ];
  
    let currentModelIndex = 0; // 現在表示しているモデルのインデックス
    let currentModel = null;   // 現在表示しているモデル
    let scene, camera, renderer, controls;
  
    function initScene() {
      // レンダラーを作成
      const canvasElement = document.querySelector('#myCanvas1');
      renderer = new THREE.WebGLRenderer({
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
      scene = new THREE.Scene();
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
      const fov = 45;
      camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 4);
  
      // コントロールを作成
      controls = new THREE.OrbitControls(camera, renderer.domElement);
  
      // 追加モデルの読み込み
      additionalModels.forEach(model => {
        loadAdditionalModel(model);
      });
  
      // スクロールイベントの追加
      window.addEventListener('scroll', onScroll);
      // 初期モデルの読み込み
      loadModel(modelUrls[currentModelIndex]);
    }
  
    // モデルを読み込み表示する関数
    function loadModel(modelData) {
      const loader = new THREE.GLTFLoader();
      // 現在のモデルをシーンから削除
      if (currentModel) {
        scene.remove(currentModel);
      }
      loader.load(
        modelData.url,
        function (glb) {
          currentModel = glb.scene;
          currentModel.scale.set(1, 1, 1);
          currentModel.position.set(modelData.position.x, modelData.position.y, modelData.position.z);
          currentModel.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
          scene.add(currentModel);
        },
        undefined,
        function (error) {
          console.log(error);
        }
      );
    }
  
    // 追加モデルを読み込み表示する関数
    function loadAdditionalModel(modelData) {
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelData.url,
        function (glb) {
          const model = glb.scene;
          // モデルの色と透明度を設定
          model.traverse(function (child) {
            if (child.isMesh) {
              child.material = new THREE.MeshBasicMaterial({
                color: modelData.color,
                transparent: true,
                opacity: modelData.opacity
              });
            }
          });
          model.scale.set(1, 1, 1);
          model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);
          model.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
          scene.add(model);
        },
        undefined,
        function (error) {
          console.log(error);
        }
      );
    }
  
    // スクロールイベントに基づいてモデルを切り替え、回転させる関数
    function onScroll() {
      const sections = document.querySelectorAll('.section');
      const scrollTop = window.scrollY;
  
      // 各セクションの位置と高さを取得し、表示するモデルを切り替える
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
  
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          if (currentModelIndex !== index) {
            currentModelIndex = index;
            loadModel(modelUrls[currentModelIndex]);
          }
        }
      });
  
      // モデルを回転させる
      if (currentModel) {
        currentModel.rotation.y = scrollTop * 0.001;
      }
    }
  
    // アニメーションループを作成して、レンダリングとコントロールの更新を行う関数
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
  
    // シーンの初期化とアニメーションの開始
    initScene();
    animate();
  });
  