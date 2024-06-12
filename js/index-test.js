const models = [
    {
        id: 'section1',
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/d6b142285eb354422b035b373a951065983810f4/glb/bed5.1.glb',
        position: { x: -2, y: 0, z: 4 },
        rotation: { x: 0, y: 0, z: 0 },
        cameraOffset: { x: 0, y: 2, z: 5 }
    },
    {
        id: 'section2',
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/cb0e9e06179648a51c9922f5df310fb4c6552a60/glb/bed3.1.glb',
        position: { x: -4, y: 0, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        cameraOffset: { x: -5, y: 2, z: 0 }
    },
    {
        id: 'section3',
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed4.glb',
        position: { x: 0, y: 0, z: -1 },
        rotation: { x: 0, y: 90, z: 0 },
        cameraOffset: { x: 0, y: 2, z: -5 }
    },
    {
        id: 'section4',
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        position: { x: 4, y: 0, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        cameraOffset: { x: 5, y: 2, z: 0 }
    },
    {
        id: 'section5',
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
        position: { x: 2, y: 0, z: 4 },
        rotation: { x: 0, y: 90, z: 0 },
        cameraOffset: { x: 0, y: 2, z: 5 }
    }
];

let scene, camera, renderer, controls, currentModels = [];
let activeModelIndex = -1;
let rotationRequestId;
let cameraTween;

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
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
    directionalLight.position.set(0, 4, 8);
    scene.add(directionalLight);

    // カメラを作成
    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

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

                scene.add(model);
                currentModels[index] = model;  // 正しいインデックスでモデルを保存
                console.log(`Model loaded: ${modelData.id}`);
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

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            switchCameraAndRotateModel(index);
        }
    });
}

function switchCameraAndRotateModel(index) {
    if (index === activeModelIndex) return; // 同じセクションなら何もしない

    console.log(`Switching to section: ${models[index].id}`);

    // 前のモデルの回転を停止
    cancelAnimationFrame(rotationRequestId);

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

    console.log(`Starting rotation for model: ${models[index].id}`);

    function animateRotation() {
        if (index !== activeModelIndex) return;
        model.rotation.y += rotationSpeed;
        rotationRequestId = requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 初期化関数を実行
init();
