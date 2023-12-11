
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

uniform vec3 u_hullData;
// TODO: create new varying v_normal
varying vec3 v_normal;
varying vec3 v_worldPos;
// TODO: (for specular) add new varying v_worldPos
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
varying float end_y;

void main() {
    v_texcoord = a_texcoord;

    v_normal = u_matrixInvTransM * a_normal;
    // Remember to apply the Inverse Transpose matrix, to transform the normals to their
    // correct world coordinates!
    vec2 xy1 = vec2(u_hullData.x,.005);
    vec2 xy2 = vec2(.005,u_hullData.z/2.0);
    vec2 xy3 = vec2(-.005,-u_hullData.z/2.0);
    vec2 xy4 = vec2(u_hullData.x,-.005);
    vec2 xy1_sample1 = vec2(xy1.x + u_Time*.01, xy1.y+u_Time*.01);
    vec2 xy2_sample1 = vec2(xy2.x + u_Time*.01, xy2.y+u_Time*.01);
    vec2 xy3_sample1 = vec2(xy3.x + u_Time*.01, xy3.y+u_Time*.01);
    vec2 xy4_sample1 = vec2(xy4.x + u_Time*.01, xy4.y+u_Time*.01);

    vec2 xy1_sample2 = vec2(xy1.x + u_Time*.02, xy1.y+u_Time*.02);
    vec2 xy2_sample2 = vec2(xy2.x + u_Time*.02, xy2.y+u_Time*.02);
    vec2 xy3_sample2 = vec2(xy3.x + u_Time*.02, xy3.y+u_Time*.02);
    vec2 xy4_sample2 = vec2(xy4.x + u_Time*.02, xy4.y+u_Time*.02);

    vec2 xy1_sample3 = vec2(xy1.x + u_Time*.03, xy1.y+u_Time*.03);
    vec2 xy2_sample3 = vec2(xy2.x + u_Time*.03, xy2.y+u_Time*.03);
    vec2 xy3_sample3 = vec2(xy3.x + u_Time*.03, xy3.y+u_Time*.03);
    vec2 xy4_sample3 = vec2(xy4.x + u_Time*.03, xy4.y+u_Time*.03);

    float xy1_noise =texture2D(u_noiseSmall, xy1_sample1.xy).r + 
                     texture2D(u_noiseMedium, xy1_sample2.xy).r + 
                     texture2D(u_noiseLarge, xy1_sample3.xy).r;
    float xy2_noise = texture2D(u_noiseSmall, xy2_sample1.xy).r +
                        texture2D(u_noiseMedium, xy2_sample2.xy).r +
                        texture2D(u_noiseLarge, xy2_sample3.xy).r;
    float xy3_noise = texture2D(u_noiseSmall, xy3_sample1.xy).r +
                        texture2D(u_noiseMedium, xy3_sample2.xy).r +
                        texture2D(u_noiseLarge, xy3_sample3.xy).r;
    float xy4_noise = texture2D(u_noiseSmall, xy4_sample1.xy).r +
                        texture2D(u_noiseMedium, xy4_sample2.xy).r +
                        texture2D(u_noiseLarge, xy4_sample3.xy).r;
    
    float y = (xy1_noise + xy2_noise + xy3_noise + xy4_noise)/4.0;
    float x_slope = xy1_noise - xy4_noise;
    float z_slope = (xy1_noise + xy2_noise - xy3_noise - xy4_noise)/2.0;

    float x_y = 1.25 * x_slope * a_position.x * .5;
    float z_y = 1.25 * z_slope * a_position.z * .5;

    vec3 waves = vec3(a_position.x,a_position.y + x_y + z_y + (y/2.) - .25,a_position.z);
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
uniform float u_shininess;
uniform vec3 u_tint;            // the tint color of this object
// TODO: create new uniform for light color
uniform vec3 u_lightColor;
// TODO: create new uniform for light direction
uniform vec3 u_lightDirection;
// TODO: create new varying v_normal (to accept interpolated output from the vertex shader)
varying vec3 v_normal;
uniform vec3 u_viewPos;
varying vec3 v_worldPos;
uniform vec3 u_hullData;
// TODO: (For specular) add v_worldPos varying
// TODO: (For specular) and v_viewPos uniform
// TODO: (For specular) shininess uniform
uniform sampler2D u_mainTex;

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
    //TODO: Add texture color sampling
    vec3 textureColor = texture2D(u_mainTex, v_texcoord).rgb;
    //TODO: Blend texture color with tint color for new baseColor
    vec3 baseColor = u_tint;

    vec3 result = textureColor * u_lightColor * (diffuse+ambient+specular); // for now this shader uses the tint color so you can see something
    gl_FragColor = vec4(result, 1);
}

#endif
