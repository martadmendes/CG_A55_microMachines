var camera, ortho_camera, static_camera, car_camera;
var scene, renderer;
var car;
var torus_array, butter_array, orange_array;
var butter_num = 5;
var orange_num = 3;
var speed = 1;
var camera_height = 100;
var camera_width = 160;
const clock = new THREE.Clock();


function createTable(x, y, z) {
    'use strict';

    var i;
    var table = new THREE.Object3D();
    torus_array = new Array(0);
    butter_array = new Array(0);
    orange_array = new Array(0);

    addTableTop(table, 0, -10, 0);
    createTrack();

    for(i=0; i < butter_num; i++)
        addButter((Math.random()*97)-48.5, 0.5, (Math.random()*98)-49);

    for(i=0; i < orange_num; i++)
        addOrange((Math.random()*98)-49, 2, (Math.random()*98)-49);

    scene.add(table);
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}


function addTableTop(obj, x, y, z) {
    'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0x737070 });
    var geometry = new THREE.CubeGeometry(100, 20, 100);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createTrack() {
    'use strict';

    for (var angle = 0; angle < 2*Math.PI; angle += Math.PI / 20) {
        if (angle % (Math.PI / 10) == 0)
            addTorus(25*Math.cos(angle), 0.25, 25*Math.sin(angle));

        addTorus(40*Math.cos(angle), 0.25, 40*Math.sin(angle));
    }
}


function addTorus(x, y, z) {
    'use strict';

    var torus = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0xF9D639 });
    var geometry = new THREE.TorusGeometry(1, 0.5, 100, 100);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);
    torus.add(mesh);
    torus.position.set(x, y, z);
    scene.add(torus);
    torus_array.push(torus);
}


function createCar(x, y, z) {
    'use strict';

    car = new THREE.Object3D();
    //car.add(new THREE.AxisHelper(10));
    car.userData = {direction: new THREE.Vector3(0, 0, 0),
                    speed: 0,
                    stopping: false};

    addCar(car, 0, 2.5, 0);
    addWheels(car, -2.5, 0, -1.75-0.5); //-2.5 - 0.5 pq e qd o carro acaba mais largura do toru
    addWheels(car, -2.5, 0, 1.75+0.5);
    addWheels(car, 2.5, 0, -1.75-0.5);
    addWheels(car, 2.5, 0, 1.75+0.5);
    createCarCamera();

    car.position.x = x;
    car.position.y = y;
    car.position.z = z;
    scene.add(car);
}


function addCar(obj, x, y, z) {
  'use strict';

  var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  var geometry = new THREE.CubeGeometry(5, 4, 3.5);
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  obj.add(mesh);
}


function addWheels(obj, x , y , z){
	'use strict';

	var material = new THREE.MeshBasicMaterial({ color: 0x6600ff });
	var geometry = new THREE.TorusGeometry(1, 0.4, 100, 100);
	var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x,y,z);
	obj.add(mesh);
}


function addButter(x, y ,z){
	'use strict';

    var butter = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0x3993F9 });
    var geometry = new THREE.CubeGeometry(3, 1, 2);
    var mesh = new THREE.Mesh(geometry, material);

    butter.position.set(x,y,z);
    butter.add(mesh);
    scene.add(butter);
    butter_array.push(butter);
}


function addOrange(x, y, z){
	'use strict';

    var orange = new THREE.Object3D();
	var geometry = new THREE.SphereGeometry(2, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xDE8520} );
	var sphere = new THREE.Mesh( geometry, material );

    sphere.position.set(x,y,z);
    orange.add(sphere);
    scene.add(orange);
    orange_array.push(orange);
}


function createOrthoCamera() {
    'use strict';

    var aspect_ratio = window.innerWidth / window.innerHeight;
    var near = 1;
    var far = 500;
    var left, right, bottom, top;

    if (aspect_ratio < 1) {
        left = -camera_width / 2;
        right = camera_width / 2;
        bottom = -camera_width / (2*aspect_ratio);
        top = camera_width / (2*aspect_ratio);
    } else {
        left = -aspect_ratio * camera_height / 2;
        right = aspect_ratio * camera_height / 2;
        bottom = - camera_height / 2;
        top = camera_height / 2;
    }

    var tmp_camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

    tmp_camera.position.x = 0;
    tmp_camera.position.y = 10;
    tmp_camera.position.z = 0;
    tmp_camera.lookAt(scene.position);
    return tmp_camera;
}

function createStaticCamera() {
    'use strict';

    var aspect_ratio = window.innerWidth / window.innerHeight;
    var fov = 90;
    var near = 1;
    var far = 1000;

    var tmp_camera = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);
    tmp_camera.position.x = 0;
    tmp_camera.position.y = 70;
    tmp_camera.position.z = 100;
    tmp_camera.lookAt(scene.position);
    return tmp_camera;
}

function createCarCamera() {
    'use strict';
    
    var aspect_ratio = window.innerWidth / window.innerHeight;
    var fov = 90;
    var near = 1;
    var far = 100;

    car_camera = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);
    car_camera.position.x = -10;
    car_camera.position.y = 10;
    car_camera.position. z = 0;
    car_camera.lookAt(car.position);
    car.add(car_camera);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    createTable(0, 0, 0);
    createCar(0, 0, 0);
}


function animate() {
    'use strict';

    const acceleration   = 0.5;
    const delta = clock.getDelta();
    animateCar(acceleration, delta);

    render();
    requestAnimationFrame(animate);
}


function animateCar(acceleration, delta) {
    'use strict';

    if(car.userData.direction.x !== 0) {
        newSpeed(acceleration, delta);
        getNewPosition(car);
    }
}


function getNewPosition() {
    'use strict';

    var speed = car.userData.speed;
    car.translateX(car.userData.direction.getComponent(0) * speed);
    car.translateZ(car.userData.direction.getComponent(2) * speed);
}


function newSpeed(acceleration, delta) {
    'use strict';

    var vel_max = 0.5;

    if (!car.userData.stopping && car.userData.speed < vel_max) {
        var new_speed = car.userData.speed + acceleration * delta;
        if (new_speed > vel_max)
            car.userData.speed = vel_max;
        else
            car.userData.speed = new_speed;

    } else if (car.userData.stopping && car.userData.speed > 0) {
        var new_speed = car.userData.speed - acceleration * delta;
        if (new_speed < 0) {
            car.userData.speed = 0;
            car.userData.direction.setX(0);
        } else
            car.userData.speed = new_speed;
    }
}


function onResize() {
    'use strict';

    var aspect_ratio = window.innerWidth / window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (camera === ortho_camera) {
        if (aspect_ratio >= 1) {
            camera.left   = -aspect_ratio * camera_height / 2;
            camera.right  =  aspect_ratio * camera_height / 2;
            camera.bottom = -camera_height / 2;
            camera.top    =  camera_height / 2;
        } else {
            camera.left   = -camera_width / 2;
            camera.right  =  camera_width / 2;
            camera.bottom = -camera_width / (2 * aspect_ratio);
            camera.top    =  camera_width / (2 * aspect_ratio);
        }
    } else {
        camera.aspect = renderer.getSize().width / renderer.getSize().height;
    }
    
    camera.updateProjectionMatrix();
}


function onKeyDown(key) {
    'use strict';

    switch(key.keyCode) {
    case 49: // 1
        camera = ortho_camera;
        onResize();
        break;
    case 50: // 2
        camera = static_camera;
        onResize();
        break;
    case 51: // 3
        camera = car_camera;
        onResize();
        break;
    case 65: // A
    case 97: // a
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 37: //left
        car.rotateY(Math.PI/25);
        break;

    case 39: //right
        car.rotateY(-Math.PI/25);
        break;

    case 38: //up
        if (car.userData.direction.x === -1 && car.userData.speed !== 0) {
            car.userData.stopping = true;
        } else if (car.userData.speed === 0) {
            car.userData.stopping = false;
            car.userData.direction.setX(1);
        } else {
            car.userData.stopping = false;
        }
        break;

    case 40: //down
        if (car.userData.direction.x === 1 && car.userData.speed !== 0) {
            car.userData.stopping = true;
        } else if (car.userData.speed === 0) {
            car.userData.stopping = false;
            car.userData.direction.setX(-1);
        } else {
            car.userData.stopping = false;
        }
        break;
    }
}


function onKeyUp (key){
    'use strict';
    switch (key.keyCode) {

    case 38: // up
        if (car.userData.direction.x === 1 && !car.userData.stopping) {
            car.userData.stopping = true;
        }
        break;

    case 40: // down
        if (car.userData.direction.x === -1 && !car.userData.stopping) {
            car.userData.stopping = true;
        }
        break;
    }
}


function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    ortho_camera = createOrthoCamera();
    static_camera = createStaticCamera();
    camera = ortho_camera;

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}


function render() {
    'use strict';

    renderer.render(scene, camera);
}
