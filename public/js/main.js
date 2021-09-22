
/*

    CS 4731, E1 term 2020
    Project 2 - Simple wireframe viewer
    Matt Johannesen (mdjohannesen)

    main.js contains:
      - main - Sets up program + starts render cycle
      - render - Performs transformations and draws triangles (with bounding box, if enabled)
      - refreshPoints - Sends all vertex data to the GPU after receiving it from parseData
      - moveEye - Repositions the camera so that the newly loaded model fits on screen
      - setColor - Changes the shaders' color parameter for consecutive draw calls
      - defaultObject - Generates the default plane object
      - toggleTranslation - Helper function for controlling object sliding behavior


    Added features:
     - Press SHIFT to show a color-coded (RGB-XYZ) bounding box for the current object
     - Instructions highlighted + color-coded when features are enabled or disabled
     - Not much of a feature, but a square object is drawn by default if nothing else is being viewed

 */

/**********************************
 * Global vars/constants
 **********************************/

/*** WEBGL ***/
let gl;  // WebGL instance
let program; // Shader interface

/*** GEOMETRY DATA ***/
let points = []; // Set of all vec4 points sent to GPU (incl. vertex duplicates)
let verts = []; // Set of all vertices in current object
let normals = []; // Set of all normal vectors of object faces
let scalar = 1.0; // Scales user input/animation - based on object bounds

/*** ANIMATION PARAMS ***/
let rotX = 0.0; // Current x-axis rotation
const rotateSpeed = -0.5;  // Amount of x-axis rotation to apply every frame
let trans = [0.0, 0.0, 0.0]; // Current translation
let transDelta = [0.005, 0.0, 0.0]; // Amounts that translation will increase by every frame
const pulseScale = 0.05; // Controls how far pulsing goes (regardless of object scale)
let pulseAlpha = 0.0; // 0.0 - 1.0 value controlling how far in or out the faces are
let pulseDir = 1.0; // 1.0 or -1.0, controls which way triangles are pulsing
let showBounds = false; // Should the bounding box be visible?
let isTurning = false; // Should rotation occur?
let isMoving = false; // Should translation occur?
let isPulsing = false; // Should pulsing occur?

/*** WINDOW PARAMS ***/
const up = vec3(0.0, 1.0, 0.0); // Upward vector
const fovY = 30;  // Field of view (in degrees) on y-axis
const aspectRatio = 1;  // Ratio of width to height
const nearClip = 0.1;  // Near clipping plane distance
const farClip = 500;  // Far clipping plane distance

/*** COLORS ***/
const clearColor = [0.0, 0.0, 0.0];  // RGB color to use when clearing background
const lineColor = [1.0, 1.0, 1.0];  // RGB color to use when drawing mesh
const red = [1.0, 0.0, 0.0]; // x-axis color
const green = [0.0, 1.0, 0.0]; // y-axis color
const blue = [0.0, 0.5, 1.0]; // z-axis color

/**
 * Setup method
 */
function main()
{

    /**********************************
     * WebGL/shader setup
     **********************************/

    // HTML canvas being drawn to
    const canvas = document.getElementById('webgl');

    // Run WebGL setup
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    if (!gl)
    {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    program = initShaders(gl);
    gl.useProgram(program);


    //Set up the viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Set clear color
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);


    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);


    /*** Apply default shape on startup ***/

    defaultObject();


    /***********************************************
     * File parsing + data storage setup
     * (File parser method located in parseData.js)
     **********************************************/

    const fileSelector = document.getElementById('file-selector');  // Button that allows files to be loaded

    // Set up file parser interaction
    fileSelector.addEventListener('change', (event) => {

        // Get reference to first (only) file
        const file = event.target.files[0];

        // Create new file reader object
        const reader = new FileReader();

        reader.addEventListener('error', () => {
            console.error("Error reading file: %s", file.name);
            defaultObject();
        });

        reader.addEventListener('abort', () => {
            console.error("Aborted while reading file: %s", file.name);
            defaultObject();
        });

        reader.addEventListener('load', (event) => {

            // Parse and store data for processing
            let parsed = parseData(file.name, event.target.result);

            // Re-generate mesh with vertex/triangle info
            refreshPoints(parsed.verts, parsed.tris, parsed.bounds);

        });

        // Forces file reader to output data as actual text
        reader.readAsText(file);
    });

    /******************
     * INPUT HANDLERS
     ******************/

    const xMove = document.getElementById('xMove');
    const yMove = document.getElementById('yMove');
    const zMove = document.getElementById('zMove');
    const spin = document.getElementById('spin');
    const pulse = document.getElementById('pulse');
    const box = document.getElementById('box');

    let keyPressed = null;

    // Begin key press behavior
    window.onkeydown = function(event) {

        if (false) {

            // Store the key that was pressed
            keyPressed = event.key;

            switch (keyPressed) {
                case 'x': // Slide in +x
                    toggleTranslation(0.005, 0.0, 0.0);
                    xMove.className = isMoving ? "red" : "";
                    yMove.className = "";
                    zMove.className = "";
                    break;
                case 'c': // Slide in -x
                    toggleTranslation(-0.005, 0.0, 0.0);
                    xMove.className = isMoving ? "red" : "";
                    yMove.className = "";
                    zMove.className = "";
                    break;
                case 'y': // Slide in +y
                    toggleTranslation(0.0, 0.005, 0.0);
                    xMove.className = "";
                    yMove.className = isMoving ? "green" : "";
                    zMove.className = "";
                    break;
                case 'u': // Slide in -y
                    toggleTranslation(0.0, -0.005, 0.0);
                    xMove.className = "";
                    yMove.className = isMoving ? "green" : "";
                    zMove.className = "";
                    break;
                case 'z': // Slide in +z
                    toggleTranslation(0.0, 0.0, 0.005);
                    xMove.className = "";
                    yMove.className = "";
                    zMove.className = isMoving ? "blue" : "";
                    break;
                case 'a': // Slide in -z
                    toggleTranslation(0.0, 0.0, -0.005);
                    xMove.className = "";
                    yMove.className = "";
                    zMove.className = isMoving ? "blue" : "";
                    break;
                case 'r': // Toggle rotation around x-axis
                    isTurning = !isTurning;
                    spin.classList.toggle("red");
                    break;
                case 'b': // Toggle pulsing
                    isPulsing = !isPulsing;
                    pulse.classList.toggle("purple");
                    break;
                case "Shift":
                    showBounds = !showBounds;
                    box.classList.toggle("purple");
                    break;
                default:
                    break;
            }
        }
    };

    // End key press behavior
    window.onkeyup = function(event) {

        if (event.key === keyPressed) {
            keyPressed = null;
        }
    };

    // Start off the animation
    render();

}

window.onload = main;


let id;

/**
 * Processes all transformation matrices and draws triangles/bounding box to screen.
 */
function render() {
    let rotMatrix = rotateX(rotX);
    let translateMatrix = translate(trans[0], trans[1], trans[2]);
    let ctMatrix = mult(translateMatrix, rotMatrix);

    // Increment rotation if rotation is toggled on
    if (isTurning) {
        rotX += rotateSpeed;
    }

    // Increment translation if movement is toggled on
    if (isMoving) {
        trans[0] += transDelta[0] * scalar;
        trans[1] += transDelta[1] * scalar;
        trans[2] += transDelta[2] * scalar;
    }

    // Apply Current Transform Matrix
    let ctMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    gl.uniformMatrix4fv(ctMatrixLoc, false, flatten(ctMatrix));

    // Ping-pong pulse scalar between 0.0 and 1.0
    if (isPulsing) {

        pulseAlpha += 0.03 * pulseDir;

        if (pulseAlpha <= 0.0) {

            pulseAlpha = 0.0;
            pulseDir = 1.0

        } else if (pulseAlpha >= 1.0) {

            pulseAlpha = 1.0;
            pulseDir = -1.0;
        }
    } else {

        pulseAlpha = 0.0;
        pulseDir = 1.0;
    }

    // Apply offset vector scalar
    let offsetScaleLoc = gl.getUniformLocation(program, "uOffsetScale");
    gl.uniform1f(offsetScaleLoc, pulseAlpha * pulseScale * scalar);

    // Clear before drawing
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Index shared by both loops
    let i = 0;

    // Get ready to load normal vectors
    let offsetLoc = gl.getUniformLocation(program, "uOffset");

    setColor(lineColor);

    // Draw all mesh triangles (i.e. each group of 3 points)
    for (; i < points.length - 24; i += 3) {

        // Apply triangle offset
        let norm = normals[Math.floor(i/3)];
        gl.uniform4f(offsetLoc, norm[0], norm[1], norm[2], 0.0);

        // Draw
        gl.drawArrays(gl.LINE_LOOP, i, 3); // Draw one triangle
    }

    // Draw the bounding box
    if (showBounds) {
        // Don't let bounds pulse
        gl.uniform4f(offsetLoc, 0.0, 0.0, 0.0, 0.0);

        // Left + right
        setColor(red);
        gl.drawArrays(gl.LINE_LOOP, i, 4);
        gl.drawArrays(gl.LINE_LOOP, i+=4, 4);

        // Top + bottom
        setColor(green);
        gl.drawArrays(gl.LINE_LOOP, i+=4, 4);
        gl.drawArrays(gl.LINE_LOOP, i+=4, 4);

        // Front + back
        setColor(blue);
        gl.drawArrays(gl.LINE_LOOP, i+=4, 4);
        gl.drawArrays(gl.LINE_LOOP, i+4, 4);

    }

    id = requestAnimationFrame(render);

}


/*********************
 * Helper methods
 ********************/

/*** SHADER DATA + COMPUTATION ***/

/**
 * Re-generates the contents of the points array and loads it into the vertex shader.
 * @param newVerts {[]} - Array of vertices (each as [x,y,z]) to process
 * @param newTris {[]} - Array of index values (in groups of three, as [a,b,c]) of vertices to draw triangles between
 * @param bounds {number[]} - 3D bounding box, formatted as [+x,-x,+y,-y,+z,-z]
 */
function refreshPoints(newVerts, newTris, bounds) {

    // Reset all transformations
    isMoving = false;
    isTurning = false;
    isPulsing = false;
    trans = [0.0, 0.0, 0.0];
    rotX = 0;

    // Move the camera
    moveEye(bounds);

    // Set new vertices
    verts = newVerts;

    // Remove old points/normals so tri() can load new ones
    points = [];
    normals = [];

    // Generate triangles by passing in verts[] index values
    for (let i = 0; i < newTris.length; i++) {
        tri( newTris[i][0], newTris[i][1], newTris[i][2] );
    }

    // Generate bounding box
    boundingBox(bounds);

    // Load points into array buffer
    let pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STREAM_DRAW);

    // Re-process point positions
    let aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

}

// Pre-compute the vertical half-FOV in radians
const radFovY = (Math.PI / 180) * fovY * 0.5;

// Pre-compute the horizontal half-FOV in radians
const radFovX = radFovY * aspectRatio;

/**
 * Position the "camera" so that the entire +z side of current object is visible.
 * @param bounds {number[]} - Extents of the object's bounding box
 */
function moveEye (bounds) {

    // Find optimal x/y position
    const centerX = (bounds[0] + bounds[1]) / 2;
    const centerY = (bounds[2] + bounds[3]) / 2;
    const centerZ = (bounds[4] + bounds[5]) / 2;

    // Leftmost/rightmost point on object
    const maxX = Math.abs(bounds[0] - centerX);

    // Highest/lowest point on object
    const maxY = Math.abs(bounds[2] - centerY);


    // Do some trigonometry to get the optimal viewing distance

    // Distance between camera and object's position
    let distance = bounds[4]; // Initialize to object's +z extent

    // Find the larger dimension
    if (maxX > maxY) {

        // Object is wider than it is tall
        distance += maxX / Math.tan(radFovX);
        scalar = maxX;

    } else {

        // Object is taller than it is wide
        distance += maxY / Math.tan(radFovY);
        scalar = maxY;
    }

    // Set new camera position (with extra padding around object)
    const eye = vec3(centerX, centerY, distance * 1.3);

    const at = vec3(centerX, centerY, centerZ);

    // Re-generate camera viewpoint matrix
    const viewMatrix = lookAt(eye, at, up);

    // Send new camera viewpoint matrix to vertex shader
    const viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));


    // Re-generate perspective projection matrix
    const fovProj = perspective(fovY, aspectRatio, nearClip, farClip * scalar);

    // Send projection matrix to vertex shader
    const projMatrix = gl.getUniformLocation(program, 'projMatrix');
    gl.uniformMatrix4fv(projMatrix, false, flatten(fovProj));


}


/**
 * Applies a color to the next set of drawn lines.
 * @param color {number[]} - Array containing normalized R, G, and B color values.
 */
function setColor (color) {

    // Send color to uniform color property
    let colorLoc = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(colorLoc, color[0], color[1], color[2], 1.0);

}

// Attributes for default object
const defaultVerts = [[-0.5,-0.5,0.0], [-0.5,0.5,0.0], [0.5,-0.5,0.0], [0.5,0.5,0.0]];
const defaultTris = [[0, 1, 2], [1, 2, 3]];
const defaultBounds = [0.5, -0.5, 0.5, -0.5, 0, 0];

/**
 * Displays a simple square object (called when no other object is displaying).
 */
function defaultObject () {

    // Send new geometry to shader + set camera
    refreshPoints(defaultVerts, defaultTris, defaultBounds);

}


/*** INPUT ***/

/**
 * Toggles translation, and sets the translation amount if enabled.
 * @param x {number} - Translation step in the x direction.
 * @param y {number} - Translation step in the y direction.
 * @param z {number} - Translation step in the z direction.
 */
function toggleTranslation(x, y, z) {

    if(transDelta[0] === x && transDelta[1] === y && transDelta[2] === z) {
        isMoving = false;
        transDelta = [0,0,0];
    } else {
        isMoving = true;
        transDelta = [x,y,z];
    }
}


