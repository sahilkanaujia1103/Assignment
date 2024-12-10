import * as THREE from 'three'
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import holgraphicVertexShader from "./shaders/holographic/vertex.glsl"
import holgraphicFragmentShader from "./shaders/holographic/fragment.glsl"


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 2, 9)
camera.lookAt(10,20,20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })

// materialColor
const materialParameters={}
materialParameters.color="#70ff9b"
gui.addColor(materialParameters,"color").onChange(()=>{
    material.uniforms.uColor.value.set(materialParameters.color)
})

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
    vertexShader:holgraphicVertexShader,
    fragmentShader:holgraphicFragmentShader,
    uniforms:{
        uTime:new THREE.Uniform(0),
        uColor:new THREE.Uniform(new THREE.Color(materialParameters.color))

    },
    transparent:true,
    side:THREE.DoubleSide,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    
})

/**
 * Objects
 */


// Suzanne
let suzanne = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) =>
    {
        suzanne = gltf.scene
        suzanne.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
            child.receiveShadow=true
            child.castShadow=true
        })
        suzanne.position.set(-500,0,0)
        scene.add(suzanne)
    }
)

const btn=document.querySelector("button")
const home=document.querySelector("#home")

// plane
const plane=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshStandardMaterial())

plane.rotateX(-Math.PI*0.5)
plane.position.y=-200
plane.receiveShadow=true
scene.add(plane)

btn.addEventListener("click",()=>{
    if(plane.receiveShadow){
        plane.receiveShadow=false
    }
    else{
        plane.receiveShadow=true
    }
})
home.addEventListener("click",()=>{
    if(suzanne){
        suzanne.position.set(0,0,0)
        plane.position.y=-2
    }
    home.style.opacity=0
    
})

//light
const directionLight=new THREE.DirectionalLight(0xffffff,1)
directionLight.position.y=2
directionLight.position.x=0
directionLight.position.z=0
directionLight.castShadow=true
scene.add(directionLight)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate objects
    if(suzanne)
    {
        // suzanne.rotation.x = - elapsedTime * 0.1
        suzanne.rotation.y = elapsedTime * 0.2
    }

    
    material.uniforms.uTime.value=elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()