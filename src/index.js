import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';


import "./style.css";



          var element = document.getElementById("left-button");
          element.setAttribute("hidden", "hidden");

          element = document.getElementById("right-button");
          element.setAttribute("hidden", "hidden");

          element = document.getElementById("movie-button");
          element.setAttribute("hidden", "hidden");

async function getBoardDetails(boardURL){
try {
  let res = await fetch(boardURL);
  var scenedata = await res.json();
  return scenedata;

} catch (error) {
  console.log(error);
  }
}






//    ##     ##    ###    #### ##    ##       ###    ########  ########  ##       ####  ######     ###    ######## ####  #######  ##    ##
//    ###   ###   ## ##    ##  ###   ##      ## ##   ##     ## ##     ## ##        ##  ##    ##   ## ##      ##     ##  ##     ## ###   ##
//    #### ####  ##   ##   ##  ####  ##     ##   ##  ##     ## ##     ## ##        ##  ##        ##   ##     ##     ##  ##     ## ####  ##
//    ## ### ## ##     ##  ##  ## ## ##    ##     ## ########  ########  ##        ##  ##       ##     ##    ##     ##  ##     ## ## ## ##
//    ##     ## #########  ##  ##  ####    ######### ##        ##        ##        ##  ##       #########    ##     ##  ##     ## ##  ####
//    ##     ## ##     ##  ##  ##   ###    ##     ## ##        ##        ##        ##  ##    ## ##     ##    ##     ##  ##     ## ##   ###
//    ##     ## ##     ## #### ##    ##    ##     ## ##        ##        ######## ####  ######  ##     ##    ##    ####  #######  ##    ##



async function main()
      {
          // The main app is in an async function to support the await magic to get info on the board
          // get info from the URL

          var theURL = new URL(window.location.toLocaleString());

          var boardID = '';
          var eventID = '';
          var eventLanguage = 'english';



          var haseventID = false;

          if (theURL.searchParams.has('eventID')) {
            eventID = theURL.searchParams.get('eventID');
            haseventID = true;
          }

          if (theURL.searchParams.has('boardID')) {
            boardID = theURL.searchParams.get('boardID');
          }

          if (theURL.searchParams.has('language')) {
            eventLanguage = theURL.searchParams.get('language');
          }

          // URL to get event data

          var dataURL = "https://h3pl1qfz1m.execute-api.us-east-1.amazonaws.com/prod/boardata?boardID="+boardID+"&eventID="+eventID+"&language="+eventLanguage;



          let eventData = await getBoardDetails(dataURL);   // now we have the json

          var eventLoad = eventData.event;;
          let eventInfo = JSON.parse(eventLoad.info);






          var imagedata = {"party": {"scale":"3","rotatex":"6","rotatey":"","rotatez":""},
                          "rideshare": {"scale":"2","rotatex":"6","rotatey":"6","rotatez":""},
                          "movie": {"scale":"","rotatex":"6","rotatey":"","rotatez":""},
                          "forsale": {"scale":"0.6","rotatex":"","rotatey":"","rotatez":""},
                          "speaker": {"scale":"","rotatex":"","rotatey":"","rotatez":""}
                          }


          if (ZapparThree.browserIncompatible()) {
            ZapparThree.browserIncompatibleUI();
            throw new Error('Unsupported browser');
          }



          const manager = new ZapparThree.LoadingManager();
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          const scene = new THREE.Scene();
          document.body.appendChild(renderer.domElement);

          renderer.setSize(window.innerWidth, window.innerHeight);
          window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
          });

          const camera = new ZapparThree.Camera();

          ZapparThree.permissionRequestUI().then((granted) => {
            if (granted) camera.start();
            else ZapparThree.permissionDeniedUI();
          });

          ZapparThree.glContextSet(renderer.getContext());

          scene.background = camera.backgroundTexture;

          // accent image
          const instantTracker = new ZapparThree.InstantWorldTracker();
          const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);

          // board image
          const boardTracker = new ZapparThree.InstantWorldTracker();
          const boardTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, boardTracker);


          scene.add(instantTrackerGroup);
          scene.add(boardTrackerGroup);


          const directionalLight = new THREE.DirectionalLight('white', 0.8);
          directionalLight.position.set(0, 5, 0);
          directionalLight.lookAt(0, 0, 0);
          instantTrackerGroup.add(directionalLight);
          boardTrackerGroup.add(directionalLight);


          // And then a little ambient light to brighten the model up a bit
          const ambientLight = new THREE.AmbientLight('white', 1);
          instantTrackerGroup.add(ambientLight);
          instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);

          boardTrackerGroup.add(ambientLight);
          boardTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);









              //    ###    ########     #### ##     ##    ###     ######   ########  ######
              //   ## ##   ##     ##     ##  ###   ###   ## ##   ##    ##  ##       ##    ##
              //  ##   ##  ##     ##     ##  #### ####  ##   ##  ##        ##       ##
              // ##     ## ########      ##  ## ### ## ##     ## ##   #### ######    ######
              // ######### ##   ##       ##  ##     ## ######### ##    ##  ##             ##
              // ##     ## ##    ##      ##  ##     ## ##     ## ##    ##  ##       ##    ##
              // ##     ## ##     ##    #### ##     ## ##     ##  ######   ########  ######



              var eventType = eventLoad["type"];
              var imageSelect = imagedata[eventType];
              var image = true;
              var model = '';


          switch(eventType){
            case "party":
              model = new URL('../assets/finalsolo.glb', import.meta.url).href;
              break;
            case "rideshare":
              model = new URL('../assets/finalvan.glb', import.meta.url).href;
              break;


            default:
              image = false;

          }



         const theBoard = new URL('../assets/board.glb', import.meta.url).href;

          const gltfLoader = new GLTFLoader(manager);


          gltfLoader.load(model, (gltf) => {
            var theScene = gltf.scene;

            // tweaks some of the images to fit the screen better
            if(imageSelect["rotatex"] !=""){
              theScene.rotation.x = Math.PI/imageSelect["rotatex"];

            }
            if(imageSelect["rotatey"] !=""){
              theScene.rotation.y = Math.PI/imageSelect["rotatey"];

            }

            if(imageSelect["rotatez"] !=""){
              theScene.rotation.z = Math.PI/imageSelect["rotatez"];

            }

          if(imageSelect["scale"] !=""){
              theScene.scale.multiplyScalar(imageSelect["scale"]);

            }

            theScene.position.x = -0.75;
            theScene.position.y = 1.2;

            instantTrackerGroup.add(theScene);

          }, undefined, () => {
            console.log('An error ocurred loading the GLTF model');
          });



            gltfLoader.load(theBoard, (gltf) => {
            var boardScene = gltf.scene;

            boardScene.position.y = -2.8;
            boardScene.rotation.y = -Math.PI/2;
            boardScene.scale.multiplyScalar(1.3);




              //  ######## #### ######## ##       ########
              //     ##     ##     ##    ##       ##
              //     ##     ##     ##    ##       ##
              //     ##     ##     ##    ##       ######
              //     ##     ##     ##    ##       ##
              //     ##     ##     ##    ##       ##
              //     ##    ####    ##    ######## ########



              var titleSize = makeitfit(eventLoad.title);


              const textMesh = new THREE.Group( );
              var fontLoader = new FontLoader( );             // see function createText( loadedFont )
              var theText = {"message":eventLoad.title,"size":titleSize,"height":2,"color":"red"};

              fontLoader.load('https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json', createTitle );
              textMesh.scale.set( 0.005, 0.005, 0.005 );
              textMesh.rotation.y = Math.PI/2;   // radiant
              textMesh.position.set( 0.3, 3.3, 0);
              textMesh.name="title";
              boardScene.add( textMesh );



              //    #### ##    ## ########  #######     ########  ##        #######   ######  ##    ##
              //     ##  ###   ## ##       ##     ##    ##     ## ##       ##     ## ##    ## ##   ##
              //     ##  ####  ## ##       ##     ##    ##     ## ##       ##     ## ##       ##  ##
              //     ##  ## ## ## ######   ##     ##    ########  ##       ##     ## ##       #####
              //     ##  ##  #### ##       ##     ##    ##     ## ##       ##     ## ##       ##  ##
              //     ##  ##   ### ##       ##     ##    ##     ## ##       ##     ## ##    ## ##   ##
              //    #### ##    ## ##        #######     ########  ########  #######   ######  ##    ##





              var theMessage = linemaker(eventInfo["description"],16);
              var textColor = "black";
              var textSize = 16;

              if (eventLoad["status"]=="closed"){theMessage = "THIS IS NO \nLONGER \nAVAILABLE"; textColor = "Red"; textSize = 24;}
              var bodyText = {"message":theMessage,"size":textSize,"height":2,"color":textColor};
              const bodyMesh = new THREE.Group( );
              var fontLoader2 = new FontLoader( );             // see function createText( loadedFont )
              fontLoader2.load('https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json', createBody );

              bodyMesh.scale.set( 0.005, 0.005, 0.005 );
              bodyMesh.rotation.y = Math.PI/2;   // radiant
              bodyMesh.position.set( .15, 2.9, .6);
              bodyMesh.name = "body";
              boardScene.add( bodyMesh );


              //    ######## #### ##     ## ######## ########     ###    ######## ########
              //       ##     ##  ###   ### ##       ##     ##   ## ##      ##    ##
              //       ##     ##  #### #### ##       ##     ##  ##   ##     ##    ##
              //       ##     ##  ## ### ## ######   ##     ## ##     ##    ##    ######
              //       ##     ##  ##     ## ##       ##     ## #########    ##    ##
              //       ##     ##  ##     ## ##       ##     ## ##     ##    ##    ##
              //       ##    #### ##     ## ######## ########  ##     ##    ##    ########


              if (eventLoad.eventstart != null){
                var eventMessage = eventLoad.eventdate + "\n  " + eventLoad.eventstart + " - " + eventLoad.eventend;}
              else {
                var eventMessage = eventLoad.eventdate
              }
              var eventTimeDate = {"message": eventMessage,"size":16,"height":2,"color":"gray"};
              const timeDateMesh = new THREE.Group( );
              fontLoader2 = new FontLoader( );             // see function createText( loadedFont )
              fontLoader2.load('https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json', createTimeDate );

              timeDateMesh.scale.set( 0.005, 0.005, 0.005 );
              timeDateMesh.rotation.y = Math.PI/2;   // radiant
              timeDateMesh.position.set( .3, 1.8, .6);
              timeDateMesh.name = "timedate";
              boardScene.add( timeDateMesh );



              // Try an image

              if (eventInfo.image != null){

                //displayImage = new URL(eventLoad["info"]["image"], import.meta.url).href;
                var displayImage = eventInfo.image;

                var imageloader = new THREE.TextureLoader();
                var texture = imageloader.load(displayImage);
                var imagegeometry = new THREE.PlaneGeometry(1, 1*.75);
                var imagematerial = new THREE.MeshBasicMaterial({map: texture});
                var imagemesh = new THREE.Mesh(imagegeometry, imagematerial);


                imagemesh.overdraw = true;

                // set the position of the image mesh in the x,y,z dimensions
                imagemesh.position.set( .15, 1.2, -.02);
                imagemesh.rotation.y = Math.PI/2;
                boardScene.add( imagemesh );




              }


//                   ########  ##     ## ######## ########  #######  ##    ##  ######
//                   ##     ## ##     ##    ##       ##    ##     ## ###   ## ##    ##
//                   ##     ## ##     ##    ##       ##    ##     ## ####  ## ##
//                   ########  ##     ##    ##       ##    ##     ## ## ## ##  ######
//                   ##     ## ##     ##    ##       ##    ##     ## ##  ####       ##
//                   ##     ## ##     ##    ##       ##    ##     ## ##   ### ##    ##
//                   ########   #######     ##       ##     #######  ##    ##  ######


                  // clear



// ----------------------
                  //  add to calendar
                  let leftClick = false;
                  const placeLeftButton = document.getElementById('left-button') || document.createElement('div');

                  if (eventLanguage != "english"){
                    var fieldNameElement = document.getElementById('left-button');
                    fieldNameElement.textContent = eventLoad["button2"];
                  }

                  if (eventType == "party" || eventType == "movie" || eventType == "tickets" || eventType == "event") {placeLeftButton.removeAttribute("hidden");}

                  placeLeftButton.addEventListener('click', () => {
                    leftClick = true;

                    window.open(eventLoad["calendarfile"]);
                  });

// ----------------------

                  // send SMS
                  let rightClick = false;
                  const placeRightButton = document.getElementById('right-button') || document.createElement('div');

                  if (eventLanguage != "english"){
                    var fieldNameElement = document.getElementById('right-button');
                    fieldNameElement.textContent = eventLoad["button3"];
                  }

                  if (eventType == "forsale" || eventType == "rideshare" || eventType == "tickets") {placeRightButton.removeAttribute("hidden");}

                  placeRightButton.addEventListener('click', () => {
                    var smsTarget = eventInfo["textmessage"];
                    var themessage = encodeURIComponent("I saw your add for "+eventLoad.title);
                    var openWindow = 'sms://'+smsTarget+'/&body='+themessage;
                    window.open(openWindow,'_blank');
                  });

// ----------------------

                  // movie button
                  let movieClick = false;
                  const placeMovieButton = document.getElementById('movie-button') || document.createElement('div');

                  if (eventLanguage != "english"){
                    var fieldNameElement = document.getElementById('movie-button');
                    fieldNameElement.textContent = eventLoad["button4"];
                  }

                  if (eventType == "movie") {placeMovieButton.removeAttribute("hidden");}

                  placeMovieButton.addEventListener('click', () => {

                    window.open(eventInfo["trailer"]);
                  });




                  //  ##     ## ######## ##       ########  ######## ########   ######
                  //  ##     ## ##       ##       ##     ## ##       ##     ## ##    ##
                  //  ##     ## ##       ##       ##     ## ##       ##     ## ##
                  //  ######### ######   ##       ########  ######   ########   ######
                  //  ##     ## ##       ##       ##        ##       ##   ##         ##
                  //  ##     ## ##       ##       ##        ##       ##    ##  ##    ##
                  //  ##     ## ######## ######## ##        ######## ##     ##  ######


                  function makeitfit(text){
                    var textFit = 24;

                    if (text.length > 14) {textFit = 18;}
                    if (text.length > 20) {textFit = 16;}
                    if (text.length > 24) {textFit = 14;}

                    return textFit;
                  }   // end of makeitfit

                  function linemaker(text, size){
                    var charsperline = '';
                    var newText = '';

                    if (size == 24) {charsperline = 14;}
                    if (size == 18) {charsperline = 20;}
                    if (size == 16) {charsperline = 23;}
                    if (size == 14) {charsperline = 26;}
                    if (size == 12) {charsperline = 29;}
                    if (size == 10) {charsperline = 36;}

                    var words = text.split(" ");
                    var letterCount = 0;
                    var i = 0;

                    for (i in words) {
                        if (letterCount + words[i].length > charsperline){
                            newText = newText + "\n"+ words[i] + " ";
                            letterCount = words[i].length + 1;
                        } else
                        {
                            newText = newText + words[i]+ " ";
                            letterCount = letterCount + words[i].length + 1;
                        }
                    }

                    return newText;

                  }  // end of linemaker



                      //  ######## ######## ##     ## ########    ########  ##     ## #### ##       ########  ######## ########   ######
                      //     ##    ##        ##   ##     ##       ##     ## ##     ##  ##  ##       ##     ## ##       ##     ## ##    ##
                      //     ##    ##         ## ##      ##       ##     ## ##     ##  ##  ##       ##     ## ##       ##     ## ##
                      //     ##    ######      ###       ##       ########  ##     ##  ##  ##       ##     ## ######   ########   ######
                      //     ##    ##         ## ##      ##       ##     ## ##     ##  ##  ##       ##     ## ##       ##   ##         ##
                      //     ##    ##        ##   ##     ##       ##     ## ##     ##  ##  ##       ##     ## ##       ##    ##  ##    ##
                      //     ##    ######## ##     ##    ##       ########   #######  #### ######## ########  ######## ##     ##  ######


                      function createTitle(loadedFont) {
                        const textMaterial = new THREE.MeshBasicMaterial( { color: theText.color } );
                        const textGeometry = new TextGeometry( theText.message, {
                          font: loadedFont,
                          size: theText.size,
                          height: theText.height,
                          bevelEnabled: false
                        });

                        textGeometry.center(); // otherwise position left side
                        const tMesh = new THREE.Mesh( textGeometry, textMaterial );
                        textMesh.add( tMesh );

                    }  // end createText

                    function createBody(loadedFont) {
                        var bodyTextMaterial = new THREE.MeshBasicMaterial( { color: bodyText.color } );
                        var bodyTextGeometry = new TextGeometry( bodyText.message, {
                          font: loadedFont,
                          size: bodyText.size,
                          height: bodyText.height,
                          bevelEnabled: false

                        });

                        const tbodyMesh = new THREE.Mesh( bodyTextGeometry, bodyTextMaterial );
                        bodyMesh.add( tbodyMesh );

                    }   // end createBody


                    function createTimeDate(loadedFont) {
                        var timeDateMaterial = new THREE.MeshBasicMaterial( { color: eventTimeDate.color } );
                        var timeDateGeometry = new TextGeometry( eventTimeDate.message, {
                          font: loadedFont,
                          size: eventTimeDate.size,
                          height: eventTimeDate.height,
                          bevelEnabled: false

                        });

                        const tTimeDateMesh = new THREE.Mesh( timeDateGeometry, timeDateMaterial );
                        timeDateMesh.add( tTimeDateMesh );

                    }   // end createText3


              boardTrackerGroup.add(boardScene);




            }, undefined, () => {
              console.log('An error ocurred loading the GLTF model');
            });  // end of










         function render() {

            //instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
            boardTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);


            // The Zappar camera must have updateFrame called every frame
            camera.updateFrame(renderer);

            // Draw the ThreeJS scene in the usual way, but using the Zappar camera
            renderer.render(scene, camera);

            // Call render() again next frame
            requestAnimationFrame(render);
          }

          // Start things off
          render();





}  // end of main()



//============================ TWO PATHS

    var theURL = new URL(window.location.toLocaleString());

main()
