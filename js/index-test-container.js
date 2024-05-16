window.addEventListener("DOMContentLoaded", init);

function init() {
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasElement,
    });

    // サイズ指定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 30;
    const fovRad = (fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
    let distance = (window.innerHeight / 2) / Math.tan(fovRad); // カメラ距離を求める

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
    camera.position.set(6, distance/1000*4, 4);

    // カメラコントローラーを作成
    const controls = new THREE.OrbitControls(camera, canvasElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // 3Dモデルの読み込み
    // 見出しを全部入れるコンテナ
    const titleContainer = new THREE.Object3D();
    titleContainer.position.set(0, 0, 0);
    scene.add(titleContainer);

    // home
    const homeloader = new THREE.GLTFLoader();
    let homemodel = null;
    homeloader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/2570309f0972b4c093c0b9f2c879edc4655a0037/glb/bed3.glb',
        function (glb) {
            homemodel = glb.scene;
            homemodel.scale.set(1, 1, 1);
            homemodel.position.set(0, -5, 0);
            titleContainer.add(glb.scene);
        },
        function (error) {
            console.log(error);
        }
    );


    let element = document.getElementsByClassName('aboutcontent');

    var showTiming = 200; // 要素を表示するタイミング
    var elemClientRect = element[0].getBoundingClientRect();
    var elemY = window.scrollY + elemClientRect.top;

    /*
    if (window.scrollY > elemY - window.innerHeight + showTiming) {
        
    }
*/

    // about
    const aboutloader = new THREE.GLTFLoader();
    let aboutmodel = null;
    aboutloader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/9611a53f9ba5fd109c182448b31a523c671c8e48/glb/bed.glb',
        function (glb) {
            aboutmodel = glb.scene;
            aboutmodel.scale.set(1, 1, 1);
            aboutmodel.position.set(0, -10, 0);
            titleContainer.add(glb.scene);
        },
        function (error) {
            console.log(error);
        }
    );

    // works
    const worksloader = new THREE.GLTFLoader();
    let worksmodel = null;
    worksloader.load(
        //3Dモデルファイルのパスを指定
        'https://rawcdn.githack.com/ShotaroYoshizawa/profile/9611a53f9ba5fd109c182448b31a523c671c8e48/glb/bed2.glb',
        function (glb) {
            worksmodel = glb.scene;
            worksmodel.scale.set(1, 1, 1);
            worksmodel.position.set(0, -15, 0);
            titleContainer.add(glb.scene);
        },
        function (error) {
            console.log(error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        // 回転
        homemodel.rotation.y += 0.01;
        aboutmodel.rotation.y += 0.01;
        worksmodel.rotation.y += 0.01;

        // スクロールに追従させる
        camera.position.y = 0.1 * window.scrollY / (document.body.clientHeight - window.innerHeight);
        renderer.render(scene, camera);
    }

    animate();
    tick();

    // リアルタイムレンダリング
    function tick() {
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}


function scroll_effect() {
    var element = document.getElementsByClassName('aboutcontent');
    if(!element) return;
   
    var showTiming = 200; // 要素を表示するタイミング

    for(var i = 0; i < element.length; i++) { 
        var elemClientRect = element[0].getBoundingClientRect();
        var elemY = window.scrollY + elemClientRect.top;
      if(scrollY > elemY - windowH + showTiming) {
        
        titleContainer.position.set(0, 5, 0);
    scene.add(titleContainer);


      }
    }
  }
