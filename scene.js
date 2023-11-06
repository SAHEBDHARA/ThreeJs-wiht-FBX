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
  camera.lookAt(0, -10, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xc2c2c2);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; 
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0.35, 0);
  controls.update();

  const ambientLight = new THREE.AmbientLight(0xffffff, 6);
  scene.add(ambientLight);

  const loader = new THREE.FBXLoader();
  let model;
  



  loader.load(
    "/assets/P3_Typ1 (1).fbx",
    (fbx) => {
      model = fbx;
      const specificMesh = model.children[0];
      const textureLoader = new THREE.TextureLoader();


      textureLoader.load("/assets/img2.jpeg", (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        specificMesh.material = material;
        texture.repeat.set(1.5 , 1.8);
        texture.offset.set(1.04, 1.3);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.wrapS = THREE.ClampToEdgeWrapping;
      // texture.wrapT = THREE.ClampToEdgeWrapping;



        // let zoomLevel = 1;
        // const updateTextureZoom = () => {
        //   texture.repeat.set(zoomLevel, zoomLevel);
        //   renderer.render(scene, camera);
        // };
        // window.addEventListener("wheel", (event) => {
        //   if (event.deltaY > 0) {
        //     zoomLevel += 0.1; // You can adjust the zoom increment
        //   } else {
        //     zoomLevel -= 0.1; // You can adjust the zoom increment
        //   }
        //   updateTextureZoom();
        // });
        // updateTextureZoom(); 
  




        renderer.render(scene, camera);
      });

      const gui = new dat.GUI();

      // Define function for model position
      const changeModelPosition = (x, y, z) => {
        model.position.set(x, y, z);
        renderer.render(scene, camera);
      };

      // Define controls for model position
      const positionControls = {
        x: 0,
        y: -10,
        z: 0,
      };

      // Change the label to be more descriptive
      const positionFolder = gui.addFolder("Model Position");
      positionFolder.add(positionControls, "x", -50, 50).onChange(() => {
        changeModelPosition(
          positionControls.x,
          positionControls.y,
          positionControls.z
        );
      });
    

     

      model.position.set(0, -10, 0);
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry.isBufferGeometry) {
            child.geometry.computeVertexNormals();
          } else {
            const bufferGeometry = new THREE.BufferGeometry().fromGeometry(
              child.geometry
            );
            bufferGeometry.computeVertexNormals();
            child.geometry = bufferGeometry;
          }
        }
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
