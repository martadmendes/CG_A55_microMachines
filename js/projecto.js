var camera, scene, renderer;
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);

function render() {
    'use strict';

    renderer.render(scene, camera);
}

function addTorus(obj, x, y, z) {
    'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var geometry = new THREE.TorusGeometry(1, 0.5, 100, 100);
    var mesh = new THREE.Mesh(geometry, material);

    rotateAroundWorldAxis(mesh, xAxis, Math.PI / 2);
    
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var geometry = new THREE.CubeGeometry(100, 20, 100);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function createTrack(obj) {
    'use strict';

    for (var angle = 0; angle < 2*Math.PI; angle += Math.PI / 20) {
        if (angle % (Math.PI / 10) == 0) {
            addTorus(obj, 25*Math.cos(angle), 0.25, 25*Math.sin(angle));
        }
        addTorus(obj, 40*Math.cos(angle), 0.25, 40*Math.sin(angle));
    }
}

function createTable(x, y, z) {
    'use strict';

    var table = new THREE.Object3D();

    createTrack(table);
    addTableTop(table, 0, -10, 0);

    scene.add(table);
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, -200, 500);

    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    createTable(0, 0, 0);
}

function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    rotWorldMatrix.multiply(object.matrix);

    object.matrix = rotWorldMatrix;

    object.rotation.setFromRotationMatrix(object.matrix);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    render();
}
