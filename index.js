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
  
        textureLoader.load('/assets/img2.jpeg', (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          specificMesh.material = material;
  
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          renderer.render(scene, camera);
        });
  
        const gui = new dat.GUI();
  
        // Define function for changing the texture position on the specific mesh
// Define function for changing the texture position on the specific mesh
const changeTexturePosition = (x, y) => {
    if (specificMesh && specificMesh.geometry) {
      specificMesh.geometry.faceVertexUvs[0].forEach((uv) => {
        uv.forEach((coord) => {
          coord.x += x;
          coord.y += y;
        });
      });
  
      specificMesh.geometry.uvsNeedUpdate = true; // Notify Three.js that UVs have been updated
      renderer.render(scene, camera);
    }
  };
  
  
        // Define controls for texture position
        const texturepositionControls = {
          x: 0,
          y: 0,
        };
  
        const texturepositionFolder = gui.addFolder('Texture Position');
        texturepositionFolder.add(texturepositionControls, 'x', -1, 1).step(0.01).onChange(() => {
          changeTexturePosition(texturepositionControls.x, texturepositionControls.y);
        });
        texturepositionFolder.add(texturepositionControls, 'y', -1, 1).step(0.01).onChange(() => {
          changeTexturePosition(texturepositionControls.x, texturepositionControls.y);
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



  