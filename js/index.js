const canvas = document.getElementById("canvas");
console.log(canvas);
canvas.setAttribute("height", canvas.offsetHeight);
canvas.setAttribute("width", canvas.offsetWidth);

// path for background
const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

const ListFigures = document.getElementById("ListFigures");
ListFigures.addEventListener("click", delFigure);

const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();

let figures = []; // future figure

// add for background
const cubeMap = new THREE.CubeTextureLoader()
  .setPath(`${assetPath}skybox1_`)
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
scene.background = cubeMap;

const camera = new THREE.PerspectiveCamera(
  45,
  canvas.offsetWidth / canvas.offsetHeight,
  0.1,
  1000
);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// texture
const tex = new THREE.TextureLoader().load(`${assetPath}bricks-diffuse3.png`);

const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: tex,
});

// orbit control
const controls = new THREE.OrbitControls(camera, canvas);

renderer.setClearColor(0x000000);
camera.position.set(0, 0, 70);
controls.update();
update();

document.getElementById("create").addEventListener("click", createFigure);
// create figure
function createFigure() {
  const select = document.getElementById("select");
  const scale = document.getElementById("scale");
  const param = select.value;
  let geometry;

  if (param === "cube") {
    geometry = new THREE.BoxGeometry();
  } else if (param === "sphere") {
    geometry = new THREE.SphereGeometry(1, 20, 20);
  } else {
    geometry = new THREE.CylinderGeometry(0.1, 1, 2, 4, 2);
  }

  geometry.scale(scale.value, scale.value, scale.value);

  var mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  setRandomPos(mesh);
  addToList(mesh);
}

function setRandomPos(mesh) {
  mesh.position.x = Math.floor(
    Math.random() * (Math.floor(5) - Math.ceil(-5 + 1)) + Math.ceil(-5)
  );
  mesh.position.y = Math.floor(
    Math.random() * (Math.floor(10) - Math.ceil(-10 + 1)) + Math.ceil(-10)
  );
  mesh.position.z = Math.floor(
    Math.random() * (Math.floor(20) - Math.ceil(-20 + 1)) + Math.ceil(-20)
  );
}

// ADD UUID
function addToList(mesh) {
  const btn = document.createElement("button");
  const span = document.createElement("span");
  const li = document.createElement("li");

  btn.dataset.uuid = mesh.uuid;
  btn.type = "button";
  btn.innerHTML = "Del";

  span.innerHTML = mesh.uuid;

  li.appendChild(span);
  li.appendChild(btn);
  ListFigures.appendChild(li);

  figures.push(mesh);
}

// Del figure
function delFigure({ target }) {
  if (target.type === "button") {
    figures.forEach((el) => {
      if (el.uuid === target.dataset.uuid) {
        scene.remove(el);
        target.parentNode.remove();
      }
      return el.uuid !== target.dataset.uuid;
    });
  }
}

function update() {
  requestAnimationFrame(update);
  figures.forEach((el) => (el.rotation.y += 0.01));
  controls.update();
  renderer.render(scene, camera);
}
