 varying vec3 vPosition;
 uniform float uTime; 
 varying vec3 vNormal;
 uniform  vec3 uColor;
void main(){
    vec3 normal=normalize(vNormal);
    if(!gl_FrontFacing){
        normal= normal*(-1.0);
    }
    float stripe=mod((vPosition.y-uTime*0.02)*20.0,1.0);
    stripe=pow(stripe,3.0);
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel=pow(fresnel,2.0);
    //falloff
    float falloff=smoothstep(0.8,0.0,fresnel);
    float holographic=fresnel*stripe;
    holographic+=fresnel*1.25;
    holographic*=falloff;
   
    gl_FragColor=vec4(uColor,holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}