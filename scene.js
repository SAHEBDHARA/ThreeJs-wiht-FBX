// scene.js
// import { RoomEnvironment } from 'https://unpkg.com/three@0.122.0/examples/jsm/environments/RoomEnvironment.js';

const init = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 40);

  camera.lookAt(2, 2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xbfe3ed);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  // const environment = new RoomEnvironment(renderer);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 10;
  controls.maxDistance = 60;
  controls.dampingFactor = 0.05;
  controls.target.set( 0, 0.35, 0 );
  controls.update();


  const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(light);


  // adding texture 


  // Createing loader for fbx
  const loader = new THREE.FBXLoader();
  let model;

  loader.load(
    "/assets/P3_Typ1 (1).fbx",
    (fbx) => {
      model = fbx;
      model.position.set(0, -10, 0);
      scene.add(model);

      
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/assets/wood.jpg'); 

  const material = new THREE.MeshBasicMaterial({ map: texture });

  model.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });

      const gui = new dat.GUI();
      const guiValues = {
        zoom: 0,
        lightIntensity: 5,
      };
      const modelSettings = {
        positionX: 0,
        positionY: -10,
        positionZ: 0,
       
      };
      gui.add(modelSettings, 'positionX', -10, 10).onChange((value) => {
        model.position.x = value;
      });
      gui.add(modelSettings, 'positionY', -20, 0).onChange((value) => {
        model.position.y = value;
      });
      gui.add(modelSettings, 'positionZ', -10, 10).onChange((value) => {
        model.position.z = value;
      });
      gui.add(guiValues, 'zoom', 0, 100).name('Zoom').onChange(function(value) {
        camera.position.z = value; // Adjust camera zoom
      });
      
      gui.add(guiValues, 'lightIntensity', 0, 10).name('Light Intensity').onChange(function(value) {
        // Adjust light intensity
        hemiLight.intensity = value;
      });

      const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the model:", error);
    }
  );

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onWindowResize);
};

init();


