 varying vec3 vPosition; 
 varying vec3 vNormal;
 uniform float uTime;
 float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.0);
    float glitchTime=uTime-modelPosition.y;
    float glitchStrength=sin(glitchTime)+sin(glitchTime*3.45)+sin(glitchTime*8.76);
    glitchStrength/=3.0;
      glitchStrength=smoothstep(0.3,1.0,glitchStrength);
    glitchStrength*=0.25;
    glitchStrength*=0.0;
  
    modelPosition.x+=( random2d(modelPosition.xz+uTime)-0.5)*glitchStrength;
     modelPosition.z+=( random2d(modelPosition.zx+uTime)-0.5)*glitchStrength;
    gl_Position=projectionMatrix*viewMatrix*modelPosition;
    vPosition=modelPosition.xyz;
    vec4 modelNormal=modelMatrix*vec4(normal,0.0);
     vNormal=modelNormal.xyz;
    }