window.addEventListener("DOMContentLoaded", () => {
    initGridCanvas('#myCanvas0'); // グリッド背景
    initCanvasWithModels('#myCanvas1', [
        {
            modelUrl: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb',
            position: { x: 1, y: 10, z: -1 },
            rotationY: 0 * (Math.PI / 180), // y軸方向の角度
            circleColor: 0x00bfff // 水色の円
        },
        {
            modelUrl: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table1.glb',
            position: { x: -1, y: 10, z: -1 },
            rotationY: 0 * (Math.PI / 180),// y軸方向の角度
            circleColor: 0xff69b4 // ピンク色の円
        },
        {
            modelUrl: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb',
            position: { x: -1, y: 10, z: 1 },
            rotationY: 180 * (Math.PI / 180),// y軸方向の角度
            circleColor: 0x00bfff // 水色の円
        },
        {
            modelUrl: 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/6cc27c376f68a1a78d6f835c0544a7653f77293f/glb/table2.glb',
            position: { x: 1, y: 10, z: 1 },
            rotationY: 180 * (Math.PI / 180),// y軸方向の角度
            circleColor: 0xff69b4 // ピンク色の円
        }
    ]);
});


function initCanvasWithModels(canvasSelector, modelsConfig) {
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

    // 円を作成して追加
    const createCircle = (position, color) => {
        const circleRadius = 0.5; // 円の半径を1.5に設定
        const circleGeometry = new THREE.CircleGeometry(circleRadius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.rotation.x = -Math.PI / 2; // Z軸に垂直に設定
        circle.position.set(position.x, -0.3, position.z); // y座標を-0.3に固定
        circle.scale.set(0, 0, 0); // 初期スケールを0に設定
        scene.add(circle);
        return circle;
    };

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let models = [];

    const loadModel = (config, index) => {
        loader.load(
            config.modelUrl,
            function (glb) {
                const model = glb.scene;
                model.scale.set(1, 1, 1);
                model.position.set(config.position.x, config.position.y, config.position.z); // 初期位置を設定
                model.rotation.y = config.rotationY; // y軸方向の角度を設定
                scene.add(model);
                models.push(model);

                const circle = createCircle(config.position, config.circleColor);

                // gsapを使用してアニメーション
                gsap.to(model.position, { 
                    duration: 1, 
                    y: 0, 
                    ease: "power1.out",
                    onComplete: () => {
                        // 落下アニメーション終了後に円をアニメーション
                        gsap.to(circle.scale, { 
                            duration: 1,  // 広がるスピードを1秒に設定
                            x: 2, 
                            y: 2, 
                            ease: "power1.out",
                            onComplete: () => {
                                // 次のモデルを読み込む
                                if (index < modelsConfig.length - 1) {
                                    loadModel(modelsConfig[index + 1], index + 1);
                                }
                            }
                        });
                    }
                });
            },
            undefined,
            function (error) {
                console.log(error);
            }
        );
    };

    if (modelsConfig.length > 0) {
        loadModel(modelsConfig[0], 0);
    }

    function tick() {
        requestAnimationFrame(tick);
        controls.update();
        renderer.render(scene, camera);
    }
    tick();
}

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
