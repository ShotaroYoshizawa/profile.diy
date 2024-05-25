window.addEventListener("DOMContentLoaded", () => {
    initGridCanvas('#myCanvas0'); //グリッド背景
    initCanvasWithModel('#myCanvas1', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb');
    initCanvasWithModel('#myCanvas2', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/d6b142285eb354422b035b373a951065983810f4/glb/bed5.1.glb');
    initCanvasWithModel('#myCanvas3', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/cb0e9e06179648a51c9922f5df310fb4c6552a60/glb/bed3.1.glb');
    initCanvasWithModel('#myCanvas4', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed4.glb');
    initCanvasWithModel('#myCanvas5', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed.glb');
    initCanvasWithModel('#myCanvas6', 'https://rawcdn.githack.com/ShotaroYoshizawa/profile.diy/a341dc059db5a26075f94cca17a8726ae55d2c03/glb/bed2.glb');
});

function initCanvasWithModel(canvasSelector, modelUrl) {
    // レンダラーを作成
    const canvasElement = document.querySelector(canvasSelector);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
        alpha: true, // 透過を有効化
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0); // 背景色のアルファ値を透過指定

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1;
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1;
    directionalLight.position.set(0, 3, 6); // x, y, z の位置を指定
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

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        modelUrl,
        function (glb) {
            model = glb.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(glb.scene);
        },
        undefined,
        function (error) {
            console.log(error);
        }
    );

    // スクロールに連動してモデルを回転させる
    window.addEventListener('scroll', () => {
        if (model) {
            const scrollPosition = window.scrollY;
            model.rotation.y = scrollPosition * 0.001; // スクロール位置に基づいて回転
        }
    });

    function tick() {
        requestAnimationFrame(tick);
        controls.update();
        renderer.render(scene, camera);
    }
    tick();
}

//グリッド背景
function initGridCanvas(canvasSelector) {
    const canvasElement = document.querySelector(canvasSelector);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
        alpha: true,
    });

    function resizeRenderer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(40, 30, 40);
    camera.lookAt(0, 0, 0);

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