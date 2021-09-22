//
//  initShaders.js
//

const vshadertext = `
attribute vec4 aPosition;
uniform vec4 uOffset;
uniform float uOffsetScale;
uniform vec4 uColor;
uniform mat4 projMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
varying vec4 vColor;

void main() {

    // Apply projection matrix to vertex positions
    vec4 newPos = aPosition + (uOffset * uOffsetScale);
    gl_Position = projMatrix * viewMatrix * modelMatrix * newPos;

    // Set point size
    gl_PointSize = 7.0;

    // Pass color to fragment shader
    vColor = uColor;
}
`;

const fshadertext = `
precision mediump float;
varying vec4 vColor;
void main()
{
    // Apply color
    gl_FragColor = vColor;
}
`;


function initShaders( gl )
{
    let vshader = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vshader, vshadertext );
    gl.compileShader( vshader );
    if ( !gl.getShaderParameter(vshader, gl.COMPILE_STATUS) ) {
        let msg = "Vertex shader failed to compile.  The error log is:"
        + "<pre>" + gl.getShaderInfoLog( vshader ) + "</pre>";
        alert( msg );
        return -1;
    }

    let fshader = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fshader, fshadertext );
    gl.compileShader( fshader );
    if ( !gl.getShaderParameter(fshader, gl.COMPILE_STATUS) ) {
        let msg = "Fragment shader failed to compile.  The error log is:"
        + "<pre>" + gl.getShaderInfoLog( fshader ) + "</pre>";
        alert( msg );
        return -1;
    }

    let program = gl.createProgram();
    gl.attachShader( program, vshader );
    gl.attachShader( program, fshader );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        let msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}