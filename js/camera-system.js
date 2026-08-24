// Camera System - Multiple camera angles and movements
const cameraPositions = [
    // Wide establishing shot
    {
        position: { x: -8, y: 3, z: 8 },
        lookAt: { x: 0, y: 1.2, z: 0 },
        name: 'Establishing Shot'
    },
    // Side angle medium
    {
        position: { x: 6, y: 2, z: 2 },
        lookAt: { x: 0, y: 1.3, z: -20 },
        name: 'Side Angle'
    },
    // Close-up aiming view
    {
        position: { x: 2, y: 1.8, z: 0.5 },
        lookAt: { x: 0.3, y: 1.3, z: -0.3 },
        name: 'Close-up Aiming'
    },
    // Over-shoulder shot
    {
        position: { x: 1.5, y: 1.9, z: 1.5 },
        lookAt: { x: 0, y: 1.2, z: -50 },
        name: 'Over-shoulder'
    },
    // Tactical view from ground
    {
        position: { x: -3, y: 0.8, z: 3 },
        lookAt: { x: 0, y: 1.5, z: -30 },
        name: 'Ground Level'
    }
];

function toggleCamera() {
    animationState.cameraMode = (animationState.cameraMode + 1) % cameraPositions.length;
    const cameraPos = cameraPositions[animationState.cameraMode];
    updateStatus(`📷 ${cameraPos.name}`);
}

function updateCameraPosition() {
    const cameraPos = cameraPositions[animationState.cameraMode];
    
    // Smooth camera movement
    const targetPos = new THREE.Vector3(
        cameraPos.position.x,
        cameraPos.position.y,
        cameraPos.position.z
    );
    
    const targetLook = new THREE.Vector3(
        cameraPos.lookAt.x,
        cameraPos.lookAt.y,
        cameraPos.lookAt.z
    );
    
    // Add cinematic camera movement during animation
    if (animationState.isAnimating) {
        const animTime = animationState.time - animationState.animStartTime;
        
        if (animTime < 1) {
            // Slow pan during aiming
            targetPos.x += Math.sin(animTime * Math.PI) * 0.5;
        } else if (animTime < 2) {
            // Slight orbit around soldier
            const angle = (animTime - 1) * Math.PI * 0.5;
            targetPos.x += Math.cos(angle) * 0.3;
            targetPos.z += Math.sin(angle) * 0.3;
        }
    }
    
    // Lerp camera position for smooth motion
    camera.position.lerp(targetPos, 0.08);
    
    // Look at target with slight smoothing
    const lookDirection = new THREE.Vector3();
    lookDirection.subVectors(targetLook, camera.position).normalize();
    
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    currentLook.lerp(lookDirection, 0.06);
    
    camera.lookAt(
        camera.position.x + currentLook.x * 10,
        camera.position.y + currentLook.y * 10,
        camera.position.z + currentLook.z * 10
    );
    
    // Depth of field simulation via fog
    scene.fog.far = 200 + Math.sin(animationState.time) * 50;
}

// Auto-camera system during animation
function cinematicCameraTransition() {
    if (!animationState.isAnimating) return;
    
    const animTime = animationState.time - animationState.animStartTime;
    
    // Progress through camera positions
    let cameraIndex = 0;
    if (animTime > 0.5) cameraIndex = 1;
    if (animTime > 1.2) cameraIndex = 2;
    
    // Smooth transition between camera angles
    const targetCam = cameraPositions[cameraIndex];
    const transitionSpeed = 0.02;
    
    camera.position.lerp(
        new THREE.Vector3(
            targetCam.position.x,
            targetCam.position.y,
            targetCam.position.z
        ),
        transitionSpeed
    );
}

// Add some atmospheric effects
function addCinematicEffects() {
    // Volumetric lighting (simulated)
    const rayGeometry = new THREE.BoxGeometry(200, 200, 200);
    const rayMaterial = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 0.05,
        transparent: true,
        opacity: 0.1
    });
    const rays = new THREE.Mesh(rayGeometry, rayMaterial);
    rays.position.z = -80;
    scene.add(rays);
}

// Initialize cinematic effects
window.addEventListener('load', () => {
    setTimeout(addCinematicEffects, 1000);
});
