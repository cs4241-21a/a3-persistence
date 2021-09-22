

/*

    CS 4731, E1 term 2020
    Project 2 - Simple wireframe viewer
    Matt Johannesen (mdjohannesen)

    parseData.js only contains the .ply file parsing method, called from main.js

 */

 
/**
 * Extracts geometry info from .ply file contents.
 * @param name {string} - The filename, used for error logs.
 * @param data {string} - Loaded file data, as text.
 * @returns {{bounds: number[], verts: [], tris: []}} - Description below.
 *
 *          bounds - 3D extents of current object
 *          verts - Array of all vertices in object.
 *          tris - Array of all triangles in object (with 3 vertex indices per triangle).
 */
function parseData(name, data) {

    /*** FLAG/DATA SETUP ***/

    let fileLines = data.split(/(\n)/);  // Array of all lines in file

    let vertCount = 0;  // Number of expected verts
    let faceCount = 0;  // Number of expected faces

    let verts = [];  // Array of verts described in file
    let tris = [];  // Array of verts described in file

    let bounds = null; // Bounds of object: [+x, -x, +y, -y, +z, -z]

    let pastHeader = false;  // Toggled when header end is reached

    /*** MAIN LOOP ***/

    for (let i = 0; i < fileLines.length; i++)
    {
        // Store reference to (formatted) current line text
        let text = fileLines[i].trim().toLowerCase();

        if (!pastHeader) {  // Don't bother checking header text if header is done

            if (i === 0) {  // Check for the "ply" line

                if (text !== "ply") {  // Exit if tag not found
                    console.error("Read failed (%s) - \"ply\" header line not found", name);
                    break;
                }

            } else if (vertCount === 0) { // Check for total vertex count

                // Grab vertex count if present
                if (text.startsWith("element vertex ")) {
                    vertCount = parseInt(text.slice(15));
                }

            } else if (faceCount === 0) { // Check for total vertex count

                // Grab face count if present
                if (text.startsWith("element face ")) {
                    faceCount = parseInt(text.slice(13));
                }

            } else {

                // Disable unnecessary checks for header fields
                pastHeader = (text.startsWith("end_header"));
            }
        }
        else
        {
            let nums = text.split(/ +/).map( str => str.trim() );

            if (nums.length === 3) { // Found vertex

                // Refine + push vertex positions
                nums = nums.map( num => parseFloat(num) );
                verts.push(nums);

                // Check bounds
                if (bounds === null) {
                    // Initialize bounds to first single point
                    bounds = [nums[0], nums[0], nums[1], nums[1], nums[2], nums[2]];
                } else {
                    // If bounds is started, fill in other values
                    bounds[0] = Math.max(bounds[0], nums[0]); // +x
                    bounds[1] = Math.min(bounds[1], nums[0]); // -x
                    bounds[2] = Math.max(bounds[2], nums[1]); // +y
                    bounds[3] = Math.min(bounds[3], nums[1]); // -y
                    bounds[4] = Math.max(bounds[4], nums[2]); // +z
                    bounds[5] = Math.min(bounds[5], nums[2]); // -z
                }

            } else if (nums.length === 4) { // Found triangle info

                // Remove first number (always 3)
                nums.shift();

                // Refine + push triangle info
                nums = nums.map( num => parseInt(num) );
                tris.push(nums);

            } else if (nums.length > 4) { // Discard non-triangle faces
                faceCount -= 1;
                console.log("(%s) Discarding face with %s vertices: [%s]", name, nums.shift(), nums.toString());
            }
        }

    }

    /*** ERROR HANDLERS ***/

    if (!pastHeader) {
        console.error("Read failed (%s) - End of header not found", name);
    }

    if (verts.length === 0) {
        console.error("Read failed (%s) - No verts found", name);
    }

    if (tris.length === 0) {
        console.error("Read failed (%s) - No faces found", name);
    }

    if (verts.length !== vertCount) {
        console.error("Read failed (%s) - Expected vert count doesn't match actual count", name);
    }

    if (tris.length !== faceCount) {
        console.error("Read failed (%s) - Expected face count doesn't match actual count", name);
    }
    
    /*** RETURN VALUES ***/

    return {
        verts,
        tris,
        bounds
    };
}