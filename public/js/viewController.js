let camera, scene, renderer;
let mesh;
let flag = false;
const viewerAttachPoint = document.getElementById( 'viewer-attach-point' );

import('https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js')
  .then(init);

function init() {

    
    camera = new THREE.PerspectiveCamera( 70, 1, 1, 1000 );
    camera.position.z = 400;
    
    scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry( 200, 200, 200 );
    const material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#07b17e') } );
    
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    
    const lamp = new THREE.SpotLight(new THREE.Color('#ffffff'), 2, 1000, 1, 0.1, 2)
    lamp.position.set( 100, 200, 200 );
    scene.add( lamp );
    
    const lamp2 = new THREE.SpotLight(new THREE.Color('#ffffff'), 1, 1000, 1, 0.1, 2)
    lamp2.position.set( -100, 200, 200 );
    scene.add( lamp2 );
    
    const lamp3 = new THREE.SpotLight(new THREE.Color('#ffffff'), 0.5, 1000, 1, 0.1, 2)
    lamp3.position.set( 0, -200, 100 );
    scene.add( lamp3 );
    
    document.getElementById( 'colorpicker' ).oninput = updateColor;

    const squareDim = viewerAttachPoint.width; //Math.max(viewerAttachPoint.width, viewerAttachPoint.height);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( squareDim, squareDim );

    viewerAttachPoint.appendChild( renderer.domElement );
    new ResizeObserver(onParentResize).observe(viewerAttachPoint);

    animate();
}

function onParentResize( entries, observer ) {
    const rect = entries[0].contentRect;
    const squareDim = rect.width; //Math.max( rect.width, rect.height );
    observer.unobserve(viewerAttachPoint);
    renderer.setSize( squareDim, squareDim );
    observer.observe(viewerAttachPoint);
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    renderer.render( scene, camera );
}


function updateObject() {
    updateColor();
}

function updateColor() {
    const newColor = document.getElementById('colorpicker').value;
    mesh.material.color = new THREE.Color( newColor );
}