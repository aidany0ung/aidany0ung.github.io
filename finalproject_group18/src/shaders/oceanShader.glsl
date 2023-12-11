
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex
// TODO: Create new attribute a_normal
attribute vec3 a_normal; // the normal of each vertex

uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera

// inverse transpose to change normals into world space, this will make sure
// our normals are not stretched when the object is scaled.
uniform mat3 u_matrixInvTransM;
uniform float u_Time; // the time since the start of the program

// Add unifroms for noiseSmall, noiseMedium and noiseLarge 2D textures
uniform sampler2D u_noiseSmall;
uniform sampler2D u_noiseMedium;
uniform sampler2D u_noiseLarge;

uniform float u_k;
uniform float u_g;

// TODO: create new varying v_normal
varying vec3 v_normal;
varying vec3 v_worldPos;
// TODO: (for specular) add new varying v_worldPos
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
varying float end_y;

float getWaveHeight(vec2 point) {
    vec2 wave_sample1 = vec2(v_texcoord.x + u_Time*.01, v_texcoord.y+u_Time*.01);
    vec2 wave_sample2 = vec2(v_texcoord.x + u_Time*.02, v_texcoord.y+u_Time*.02);
    vec2 wave_sample3 = vec2(v_texcoord.x + u_Time*.03, v_texcoord.y+u_Time*.03);
    // get sum of noise values
    float noiseSum = texture2D(u_noiseSmall, wave_sample1.xy).r + 
                     texture2D(u_noiseMedium, wave_sample2.xy).r + 
                     texture2D(u_noiseLarge, wave_sample3.xy).r;
    return noiseSum / 1.5;
}

void main() {
    v_texcoord = a_texcoord;

    float h = 1.;
    float x1 = getWaveHeight(vec2(a_position.x + h, a_position.z+.05));
    float x2 = getWaveHeight(vec2(a_position.x - h, a_position.z-.05));
    float z1 = getWaveHeight(vec2(a_position.x+.05, a_position.z + h));
    float z2 = getWaveHeight(vec2(a_position.x-.05, a_position.z - h));
    vec3 dx = vec3(2.*h, x1-x2, 0.);
    vec3 dz = vec3(0., z1-z2, 2.*h);
    vec3 new_normal = normalize(cross(dz, dx));

    v_normal = u_matrixInvTransM * (new_normal+(a_normal*0.0));
    // Remember to apply the Inverse Transpose matrix, to transform the normals to their
    // correct world coordinates!
    
    end_y = getWaveHeight(a_position.xz);
    vec3 waves = vec3(a_position.x,end_y,a_position.z);
    vec3 worldPosition = (u_matrixM * vec4(waves,1)).xyz;
    v_worldPos = worldPosition;
    // TODO: (For specular) calculate world position

    // calculate new position
    gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4 (waves, 1);
}

#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings
uniform vec3 u_tint;            // the tint color of this object
// TODO: create new uniform for light color
uniform vec3 u_lightColor;
// TODO: create new uniform for light direction
uniform vec3 u_lightDirection;
// TODO: create new varying v_normal (to accept interpolated output from the vertex shader)
varying vec3 v_normal;
uniform vec3 u_viewPos;
varying vec3 v_worldPos;

uniform sampler2D u_mainTex;
uniform float u_g;
uniform float u_k;
varying vec2 v_texcoord;
varying float end_y;

void main(void){
    // TODO: normalize normal (not normalized because of interpolation over triangle)
    vec3 normal = normalize(v_normal);
    // TODO: normalize light direction (not normalized by default)
    vec3 lightDirection = normalize(u_lightDirection);
    // TODO: calculate diffuse term
    float diffuse = max(0.0,dot(normal,-lightDirection));
    float ambient = 0.3;
    vec3 V = normalize(u_viewPos - v_worldPos);
    vec3 H = normalize(V - lightDirection);
    float tempMax = max(0.0,dot(normal,H));
    float specular = pow(tempMax, 25.0);
    float b_value = 1./(1.+exp(-end_y+u_g)+ u_k - 2.2);
    vec3 color = vec3(0.0784, 0., 0.678) * (1.-b_value) + vec3(1., 1.,1.) * b_value;
    //TODO: Add texture color sampling
    vec3 textureColor = texture2D(u_mainTex, v_texcoord).rgb;
    //TODO: Blend texture color with tint color for new baseColor
    vec3 baseColor = color * textureColor * u_tint  * (diffuse+ambient+specular);

    //note that the lighting here doesn't actually work because we cannot calculate normals
    //looks real enough if we use height value for brightness though
    gl_FragColor = vec4(baseColor, 1);
}

#endif
