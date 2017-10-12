var camera, scene, renderer;
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);
var car;
var speed = 1;
const clock = new THREE.Clock();


function createTable(x, y, z) {
    'use strict';

    var i;
    var table = new THREE.Object3D();

    addTableTop(table, 0, -10, 0);
    createTrack(table);

    for(i=0; i < 5; i++)
        addButter(table, (Math.random()*100)-50, 0.5, (Math.random()*100)-50);

    for(i=0; i < 3; i++)
        addOrange(table, (Math.random()*100)-50, 2, (Math.random()*100)-50);

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


function createTrack(obj) {
    'use strict';

    for (var angle = 0; angle < 2*Math.PI; angle += Math.PI / 20) {
        if (angle % (Math.PI / 10) == 0)
            addTorus(obj, 25*Math.cos(angle), 0.25, 25*Math.sin(angle));

        addTorus(obj, 40*Math.cos(angle), 0.25, 40*Math.sin(angle));
    }
}


function addTorus(obj, x, y, z) {
    'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0xF9D639 });
    var geometry = new THREE.TorusGeometry(1, 0.5, 100, 100);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);
    mesh.position.set(x, y, z);
    obj.add(mesh);
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


function addButter(obj, x, y ,z){
	'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0x3993F9 });
    var geometry = new THREE.CubeGeometry(3, 1, 2);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x,y,z);
    obj.add(mesh);
}


function addOrange(obj, x, y, z){
	'use strict';

	var geometry = new THREE.SphereGeometry(2, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xDE8520} );
	var sphere = new THREE.Mesh( geometry, material );

    sphere.position.set(x,y,z);
    obj.add(sphere);
}


function createCamera() {
    'use strict';

    var camera_height = 90;
    var camera_width = 160;
    var aspect_ratio = window.innerWidth / window.innerHeight;

    camera = new THREE.OrthographicCamera(-aspect_ratio * camera_height / 2,
        aspect_ratio * camera_height / 2, camera_height / 2,
        -camera_height / 2, -200, 500);

    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 0;
    camera.lookAt(scene.position);
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

    var camera_height = 90;
    var camera_width = 160;
    var aspect_ratio = window.innerWidth / window.innerHeight;

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

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onKeyDown(key) {
    'use strict';

    switch(key.keyCode) {
        case 65:
        case 97:
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
    createCamera();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}


function render() {
    'use strict';

    renderer.render(scene, camera);
}
