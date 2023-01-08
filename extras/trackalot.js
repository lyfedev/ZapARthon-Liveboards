

async function allcodes (){



  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();



    var targetImage = {}
     targetImage[0] = new URL('../assets/demo5r.zpt', import.meta.url).href;
     targetImage[1] = new URL('../assets/swine.zpt', import.meta.url).href;




// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded
const manager = new ZapparThree.LoadingManager();

// Setup ThreeJS in the usual way
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Setup a Zappar camera instead of one of ThreeJS's cameras
const camera = new ZapparThree.Camera();

// The Zappar library needs your WebGL context, so pass it
ZapparThree.glContextSet(renderer.getContext());

// Create a ThreeJS Scene and set its background to be the camera background texture
const scene = new THREE.Scene();
scene.background = camera.backgroundTexture;

// Request the necessary permission from the user
ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

// Set up our image tracker groups
// Pass our loading manager in to ensure the progress bar works correctly
var tracker = {}
tracker[0] = new ZapparThree.ImageTrackerLoader(manager).load(targetImage[0]);
tracker[1] = new ZapparThree.ImageTrackerLoader(manager).load(targetImage[1]);

var trackerGroup = {}

trackerGroup[0] = new ZapparThree.ImageAnchorGroup(camera, tracker[0]);
trackerGroup[1] = new ZapparThree.ImageAnchorGroup(camera, tracker[1]);
scene.add(trackerGroup[0]);
scene.add(trackerGroup[1]);



// Add some content


                const displayImage = new URL('../assets/green_touch.jpg', import.meta.url).href;
                var imageloader = new THREE.TextureLoader();
                var texture = imageloader.load(displayImage);
                var imagegeometry = new THREE.PlaneGeometry(1, 1*.75);
                var imagematerial = new THREE.MeshBasicMaterial({map: texture});
                var imagemesh = new THREE.Mesh(imagegeometry, imagematerial);
                imagemesh.overdraw = true;
                imagemesh.position.set( 0, 0, 0.5);
                imagemesh.name = "onesies";

trackerGroup[0].add(imagemesh);

   const displayImage2 = new URL('../assets/red_touch.jpg', import.meta.url).href;
                var imageloader2 = new THREE.TextureLoader();
                var texture2 = imageloader2.load(displayImage2);
                var imagegeometry2 = new THREE.PlaneGeometry(1, 1*.75);
                var imagematerial2 = new THREE.MeshBasicMaterial({map: texture2});
                var imagemesh2 = new THREE.Mesh(imagegeometry2, imagematerial2);
                imagemesh2.overdraw = true;
                imagemesh2.position.set( 0, 0, 0.5);
                imagemesh2.name = "twosies";

trackerGroup[1].add(imagemesh2);



/*
tracker[0].onVisible.bind(() => { scene.visible = true; });
tracker[0].onNotVisible.bind(() => { scene.visible = false; });
tracker[1].onVisible.bind(() => { scene.visible = true; });
tracker[1].onNotVisible.bind(() => { scene.visible = false; });
*/

function onMouseMove (event){

 mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

 // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( scene.children );
  //console.log(intersects[0].name);
  if(intersects && intersects[0]) {
    console.log(intersects[0].object.name);
    //console.log('GROUP IS ' + intersects[0].object.userData.parent.name)
  }

}

// Set up our render loop
function render() {
  /* raycaster.setFromCamera(mouse,camera);// calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    //console.log(intersects);  this tracks it off the image
  }

  for (var i = 0; i < intersects.length; i++) {

  console.log("bonnie");
  }

window.addEventListener('mousemove', onMouseMove, false);
*/

window.addEventListener('mousemove', onMouseMove, false);

// Here's the bbasic render loop implementation


  requestAnimationFrame(render);
  camera.updateFrame(renderer);

  renderer.render(scene, camera);
}

requestAnimationFrame(render);





}


