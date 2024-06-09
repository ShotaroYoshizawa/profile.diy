const models = [
    {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        position: { x: -2, y: 0, z: 4 },
        rotation: { x: 0, y: 0, z: 0 },
        cameraOffset: { x: 0, y: 2, z: 5 }
    },
    {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
        position: { x: -4, y: 0, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        cameraOffset: { x: -5, y: 2, z: 0 }
    },
    {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
        position: { x: 0, y: 0, z: -1 },
        rotation: { x: 0, y: 90, z: 0 },
        cameraOffset: { x: 0, y: 2, z: -5 }
    },
    {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table2.glb',
        position: { x: 4, y: 0, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        cameraOffset: { x: 5, y: 2, z: 0 }
    },
    {
        url: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
        position: { x: 2, y: 0, z: 4 },
        rotation: { x: 0, y: 90, z: 0 },
        cameraOffset: { x: 0, y: 2, z: 5 }
    }
];

let scene, camera, renderer, controls, currentModels = [];
let activeModelIndex = -1;

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
    models.forEach(modelData => {
        loader.load(
            modelData.url,
            function (glb) {
                const model = glb.scene;
                model.scale.set(1, 1, 1);
                model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

                // 度数をラジアンに変換して回転を設定
                const radianRotation = {
                    x: THREE.MathUtils.degToRad(modelData.rotation.x),
                    y: THREE.MathUtils.degToRad(modelData.rotation.y),
                    z: THREE.MathUtils.degToRad(modelData.rotation.z)
                };
                model.rotation.set(radianRotation.x, radianRotation.y, radianRotation.z);

                scene.add(model);
                currentModels.push(model);
            },
            undefined,
            function (error) {
                console.log(error);
            }
        );
    });
}

function onScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            switchCamera(index);
        }
    });
}

function switchCamera(index) {
    if (index === activeModelIndex) return; // 同じセクションなら何もしない

    activeModelIndex = index;
    const modelData = models[index];
    const targetPosition = new THREE.Vector3(modelData.position.x, modelData.position.y, modelData.position.z);
    const cameraPosition = new THREE.Vector3(
        modelData.position.x + modelData.cameraOffset.x,
        modelData.position.y + modelData.cameraOffset.y,
        modelData.position.z + modelData.cameraOffset.z
    );

    // 先にカメラの視点をモデルの位置に切り替え
    camera.lookAt(targetPosition);
    controls.target.copy(targetPosition);

    // その後、カメラの位置をアニメーションで変更
    gsap.to(camera.position, {
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        duration: 1, // カメラ移動アニメーションの時間（秒）
        onUpdate: function () {
            camera.lookAt(targetPosition);
        }
    });
}

// 初期化関数を実行
init();
