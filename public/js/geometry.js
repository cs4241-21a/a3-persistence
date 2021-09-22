
/*

    CS 4731, E1 term 2020
    Project 2 - Simple wireframe viewer
    Matt Johannesen (mdjohannesen)

    geometry.js contains:
      - tri - Generates a triangle using existing vertices
      - newellCross - Calculates the normal vector of a triangle using the Newell method
      - rect - Generates a rectangle panel for the bounding box
      - boundingBox - Generates the whole bounding box

 */


/**
 * Pushes copies of known vertices (labeled with index #s) to the points array.
 * @param a {number} - Index (in verts array) of first vertex.
 * @param b {number} - Index (in verts array) of second vertex.
 * @param c {number} - Index (in verts array) of third vertex.
 */
function tri (a, b, c) {

    const max = verts.length;
    if (a < 0 || a >= max || b < 0 || b >= max || c < 0 || c >= max) {
        console.error("Skipped triangle with verts out of range: (%d, %d, %d)", a, b, c);
        return;
    }

    // Push the normal vector three times so GPU doesn't get confused
    let norm = newellCross(verts[a], verts[b], verts[c]);
    normals.push(norm);

    // Push specified points to array
    points.push(vec4(verts[a][0], verts[a][1], verts[a][2]));
    points.push(vec4(verts[b][0], verts[b][1], verts[b][2]));
    points.push(vec4(verts[c][0], verts[c][1], verts[c][2]));
}


/**
 * Calculates the normal of a triangle via the Newell method.
 * @param a {number[]} First point on triangle (and common point).
 * @param b {number[]} Second point on triangle.
 * @param c {number[]} Third point on triangle.
 * @returns Normalized normal vector for the triangle.
 */
function newellCross (a, b, c) {

    // Matrix used for Newell cross product
    let mat = [a, b, c, a];

    // Resulting vector
    let norm = [0.0, 0.0, 0.0];

    for (let i = 0; i < 3; i++) {

        // x = sum of (y - y')(z + z')
        norm[0] += (mat[i][1] - mat[i+1][1]) * (mat[i][2] + mat[i+1][2]);

        // y = sum of (z - z')(x + x')
        norm[1] += (mat[i][2] - mat[i+1][2]) * (mat[i][0] + mat[i+1][0]);

        // z = sum of (x - x')(y + y')
        norm[2] += (mat[i][0] - mat[i+1][0]) * (mat[i][1] + mat[i+1][1]);
    }

    // Normalize and return final vector
    return normalize(norm);

}



/**
 * Pushes four points (a,b,c,d) to be drawn together as a rectangle.
 * @param a {number[]} - First corner vertex.
 * @param b {number[]} - Second corner vertex.
 * @param c {number[]} - Third corner vertex.
 * @param d {number[]} - Fourth corner vertex.
 */
function rect (a, b, c, d) {

    points.push(vec4(a[0], a[1], a[2]));
    points.push(vec4(b[0], b[1], b[2]));
    points.push(vec4(c[0], c[1], c[2]));
    points.push(vec4(d[0], d[1], d[2]));
}



/**
 * Generate a bounding box from the given bounds.
 * @param bounds {number[]} - 3D bounding box, formatted as [+x,-x,+y,-y,+z,-z]
 */
function boundingBox (bounds) {

    const width = Math.abs(bounds[0] - bounds[1]);
    const height = Math.abs(bounds[2] - bounds[3]);
    const depth = Math.abs(bounds[4] - bounds[5]);

    const d = 0.02 * Math.max(width, height, depth);
    const s = 0.04 * Math.max(width, height, depth);

    const posX = bounds[0] + s;
    const negX = bounds[1] - s;
    const posY = bounds[2] + s;
    const negY = bounds[3] - s;
    const posZ = bounds[4] + s;
    const negZ = bounds[5] - s;

    rect([posX+d, posY, posZ], [posX+d, posY, negZ],
        [posX+d, negY, negZ], [posX+d, negY, posZ]); // Right

    rect([negX-d, negY, negZ], [negX-d, negY, posZ],
        [negX-d, posY, posZ], [negX-d, posY, negZ]); // Left

    rect([posX, posY+d, posZ], [posX, posY+d, negZ],
        [negX, posY+d, negZ], [negX, posY+d, posZ]); // Top

    rect([negX, negY-d, negZ], [negX, negY-d, posZ],
        [posX, negY-d, posZ], [posX, negY-d, negZ]); // Bottom

    rect([posX, posY, posZ+d], [negX, posY, posZ+d],
        [negX, negY, posZ+d], [posX, negY, posZ+d]); // Front

    rect([negX, negY, negZ-d], [posX, negY, negZ-d],
        [posX, posY, negZ-d], [negX, posY, negZ-d]); // Back

}