window.addEventListener("DOMContentLoaded", () => {
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
  
    let currentModelIndex = 0;
    let currentModel = null;
    let scene, camera, renderer, controls;
  
    // シーンの初期化
    function initScene() {
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
  
      scene = new THREE.Scene();
      renderer.setClearColor(0x000000, 0);
  
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      ambientLight.intensity = 2;
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.intensity = 3;
      directionalLight.position.set(0, 4, 8);
      scene.add(directionalLight);
  
      const fov = 45;
      camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 4);
  
      controls = new THREE.OrbitControls(camera, renderer.domElement);
  
      // 追加モデルをロード
      additionalModels.forEach(model => {
        loadAdditionalModel(model);
      });
  
      // スクロールイベントを設定
      window.addEventListener('scroll', onScroll);
      loadModel(modelUrls[currentModelIndex]);
    }
  
    // モデルをロード
    function loadModel(modelData) {
      const loader = new THREE.GLTFLoader();
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
  
    // 追加モデルをロード
    function loadAdditionalModel(modelData) {
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelData.url,
        function (glb) {
          const model = glb.scene;
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
  
    // スクロールイベントハンドラ
    function onScroll() {
      const sections = document.querySelectorAll('.section');
      const scrollTop = window.scrollY;
  
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
  
      if (scrollTop === 0 && currentModelIndex !== 0) {
        currentModelIndex = 0;
        loadModel(modelUrls[currentModelIndex]);
      }
  
      // 現在のモデルを回転
      if (currentModel) {
        currentModel.rotation.y += 0.01; // 回転速度を調整
      }
    }
  
    
  
    // アニメーションの実行
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
  
    initScene();
    animate();
  });
  