// scene.js
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
  camera.position.set(0, 2, 5);
  camera.lookAt(2, 2, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xbfe3dd);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2; 
  controls.maxDistance = 40; 
  controls.dampingFactor = 0.05; 



  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 5);
  scene.add(hemiLight);

  // Createing loader for fbx
  const loader = new THREE.FBXLoader();
  let model;

  loader.load(
    "/assets/man.fbx",
    (fbx) => {
      model = fbx;
      model.scale.set(0.02, 0.02, 0.02);
      model.position.set(0, -2, 0);
      scene.add(model);

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
