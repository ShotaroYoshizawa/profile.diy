window.addEventListener("DOMContentLoaded", init1);
window.addEventListener("DOMContentLoaded", init2);
window.addEventListener("DOMContentLoaded", init3);
window.addEventListener("DOMContentLoaded", init4);

const fov = 30;
const fovRad = (fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
let distance = (window.innerHeight / 2) / Math.tan(fovRad); // カメラ距離を求める

function init1() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas1');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 4, distance / 10000 * 4);
    camera.lookAt(scene.position);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/2570309f0972b4c093c0b9f2c879edc4655a0037/glb/bed3.glb',
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

    function animate() {
        requestAnimationFrame(animate);
        // 回転
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
    tick();

    // リアルタイムレンダリング
    function tick() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

function init2() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas2');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 4, distance / 10000 * 4);
    camera.lookAt(scene.position);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/14cbbd7f34f264d2175b2937b581d5439a6db528/glb/bed4.glb',
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

    function animate() {
        requestAnimationFrame(animate);
        // 回転
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
    tick();

    // リアルタイムレンダリング
    function tick() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

function init3() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas3');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 4, distance / 10000 * 4);
    camera.lookAt(scene.position);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/9611a53f9ba5fd109c182448b31a523c671c8e48/glb/bed.glb',
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

    function animate() {
        requestAnimationFrame(animate);
        // 回転
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
    tick();

    // リアルタイムレンダリング
    function tick() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}


function init4() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas4');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンを作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 4, distance / 10000 * 4);
    camera.lookAt(scene.position);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    let model = null;
    loader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/9611a53f9ba5fd109c182448b31a523c671c8e48/glb/bed2.glb',
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

    function animate() {
        requestAnimationFrame(animate);
        // 回転
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
    tick();

    // リアルタイムレンダリング
    function tick() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}