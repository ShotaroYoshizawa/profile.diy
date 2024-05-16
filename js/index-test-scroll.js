window.addEventListener('load', init);
function random(num) {
    return Math.random() * num * 2 - num;
};

// 慣性スクロールの値
let inertialScroll = 0;
// 慣性スクロールのパーセント値(0~100)
let inertialScrollPercent = 0;

let scene, camera, renderer;


function init() {
    

    render();
}

//慣性スクロールのためにスクロール値を取得する
function setScrollPercent() {
    inertialScroll +=
        ((document.documentElement.scrollTop || document.body.scrollTop) - inertialScroll) * 0.08;
    // 慣性スクロールでのパーセント
    inertialScrollPercent = (inertialScroll / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100).toFixed(2);

    // 検証用の通常のパーセント
    const scroll = ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight ||
            document.body.scrollHeight) -
            document.documentElement.clientHeight)) * 100;
    document.getElementById('percent').innerText = inertialScrollPercent;
    document.getElementById('scroll').innerText = Number(scroll).toFixed(2);
}

function render() {
    setScrollPercent();
    window.requestAnimationFrame(render);
}







//bed1 不使用
function init02() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas02');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87B8C0);

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1;
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1;
    directionalLight.position.set(0, 3, 6); //x,y,zの位置を指定
    scene.add(directionalLight);

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(6, 4, 4);

    // カメラコントローラーを作成
    const controls = new THREE.OrbitControls(camera, canvasElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/474f29e170742cc83fbff4a1c24dae2d529e8393/glb/bed.glb',
        function (glb) {
            model = glb.scene;
            //model.name = "model_castle";
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(glb.scene);
        },
        function (error) {
            console.log(error);
        }
    );

    tick02();

    // リアルタイムレンダリング
    function tick02() {
        controls.update();
        renderer.render(scene, camera);
        controls.enableDamping = true;
        requestAnimationFrame(tick02);
    }
}

//bed2 不使用
function init03() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas03');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87B8C0);

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1;
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1;
    directionalLight.position.set(0, 3, 6); //x,y,zの位置を指定
    scene.add(directionalLight);

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(-6, 4, -4);;

    // カメラコントローラーを作成
    const controls = new THREE.OrbitControls(camera, canvasElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/992ad4d65db338b456f93399ce465682e22a3e5c/glb/bed2.glb',
        function (glb) {
            model = glb.scene;
            //model.name = "model_castle";
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(glb.scene);
        },
        function (error) {
            console.log(error);
        }
    );

    tick03();

    // リアルタイムレンダリング
    function tick03() {
        controls.update();
        renderer.render(scene, camera);
        controls.enableDamping = true;
        requestAnimationFrame(tick03);
    }
}
