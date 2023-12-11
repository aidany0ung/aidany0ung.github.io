"use strict";
class BoatRenderer extends Renderer{

    customAddTextures(textures){
        this.noiseSmall = textures[0];
        this.noiseMedium = textures[1];
        this.noiseLarge = textures[2];
    }
    setUniformData(model, camera, shaderData){
        super.setUniformData(model, camera, shaderData);

        let timeLoc = gl.getUniformLocation(this.program, "u_Time");
        gl.uniform1f(timeLoc, shaderData.time);

        let noiseSmallLoc = gl.getUniformLocation(this.program, "u_noiseSmall");
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.noiseSmall);
        gl.uniform1i(noiseSmallLoc, 1);

        gl.activeTexture(gl.TEXTURE2);
        let noiseMediumLoc = gl.getUniformLocation(this.program, "u_noiseMedium");
        gl.bindTexture(gl.TEXTURE_2D, this.noiseMedium);
        gl.uniform1i(noiseMediumLoc, 2);

        gl.activeTexture(gl.TEXTURE3);
        let noiseLargeLoc = gl.getUniformLocation(this.program, "u_noiseLarge");
        gl.bindTexture(gl.TEXTURE_2D, this.noiseLarge);
        gl.uniform1i(noiseLargeLoc, 3);

        let hullDataLoc = gl.getUniformLocation(this.program, "u_hullData");
        gl.uniform3fv(hullDataLoc, [1.0, 1.0, 1.0]);
    }
}