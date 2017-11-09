/* Global Variables */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });
var room = undefined;
var room_x;
var room_z;

var selected = false;
var selectedItem = undefined;
var Items = new Array();
var mouseVector = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var colliderDistance = 0.4;
var plane;
var pos;


/* Setup Functions  */

/**
 * setup Renderer, Scene, Camera, Plane, Skybox, Directional Light, Room
 */
function setUp(){

	/* Renderer and Screen Setup */
	//shadows enabled.
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.shadowMapCullFace = THREE.CullFaceNone;


	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//Camera setup
	cameraDefault();

  //Plane setup
	/*
  var plane_texture = new THREE.ImageUtils.loadTexture('textures/green-grass-texture.jpg');
	plane_texture.wrapS = plane_texture.wrapT = THREE.RepeatWrapping;
	plane_texture.offset.set( 0, 0 );
	plane_texture.repeat.set( 10, 10 );

	var plane_material = new THREE.MeshBasicMaterial({map: plane_texture, side: THREE.DoubleSide});
	var plane_geometry = new THREE.PlaneGeometry( 10, 10);
	plane = new THREE.Mesh( plane_geometry, plane_material );
	plane.castShadow = false;
  plane.receiveShadow = true;
	plane.position.y = 0;
	plane.rotation.x = Math.PI / 2;
	scene.add( plane );
	*/

	//setup skybox
	setupSkybox('SkyBox02b000');

	//Ambient Light
  var ambient = new THREE.AmbientLight( 0xffffff, 0.3);
  scene.add( ambient );

	//Directional Light
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set(3, 6, -2);
	directionalLight.target = scene;
	//directionalLight.shadowBias = 0.0001;
	directionalLight.castShadow = true;            // default false
	//Set up shadow properties for the light
	directionalLight.shadow.mapSize.width = 4096;
	directionalLight.shadow.mapSize.height = 4096;
	directionalLight.shadow.camera.near = 0.5;       // default
	directionalLight.shadow.camera.far = 500      // default
  scene.add( directionalLight );

}

/**
 * move Camera to default position and rotation
 */
function cameraDefault(){
	camera.position.set(0,6 ,2);
	camera.lookAt(scene.position);

	// SETUP ORBIT CONTROL OF THE CAMERA
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;

	scene.add(camera);
}

/**
 * Setup skybox
 */
function setupSkybox(prefix){
	var url_prefix = 'skybox/' + prefix;
	var urls = [url_prefix + "4.jpg",
							url_prefix + "2.jpg",
							url_prefix + "5.jpg",
							url_prefix + "6.jpg",
							url_prefix + "3.jpg",
							url_prefix + "1.jpg"];

	var skybox_texture = THREE.ImageUtils.loadTextureCube(urls);
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = skybox_texture;
	var skybox_material = new THREE.ShaderMaterial({
		fragmentShader    : shader.fragmentShader,
		vertexShader  : shader.vertexShader,
		uniforms  : shader.uniforms,
		side:THREE.BackSide
	});

	// build the skybox Mesh
	var skybox    = new THREE.Mesh( new THREE.CubeGeometry( 100000 ,100000, 100000), skybox_material );
	skybox.position.y = -50;
	// add it to the scene
	scene.add( skybox );
}

function importOBJ(name){


	var loader = new THREE.OBJLoader();

	// load a resource
	loader.load(
		// resource URL
		'models/cube.obj',
		// called when resource is loaded
		function ( object ) {

			scene.add( object );

		},
		// called when loading is in progresses
		function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened' );

		}
	);

}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

setUp();

render();

importOBJ("cube.obj");
