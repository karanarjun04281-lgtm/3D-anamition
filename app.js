// Complete 3D Soldier Animation - All in One File
let scene, camera, renderer, soldier;
let animationState = {
    isAnimating: false,
    cameraMode: 0,
    time: 0
};

function initScene() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, shadowMap: { enabled: true } });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);
    
    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x654321, 0.5);
    scene.add(hemiLight);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d5c2f,
        roughness: 0.8,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Target Range
    const targetGeometry = new THREE.BoxGeometry(2, 3, 0.2);
    const targetMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        roughness: 0.5,
        metalness: 0.3
    });
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(0, 1.5, -50);
    target.castShadow = true;
    target.receiveShadow = true;
    scene.add(target);
    
    // Create Soldier
    createSoldier();
    
    window.addEventListener('resize', onWindowResize);
    updateStatus('Scene initialized ✓');
    animate();
}

function createSoldier() {
    soldier = new THREE.Group();
    soldier.position.set(0, 0, 0);
    
    // Body (torso)
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3);
    const tacticalMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d5a3d,
        roughness: 0.7,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, tacticalMaterial);
    body.position.y = 1.2;
    body.castShadow = true;
    body.receiveShadow = true;
    soldier.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6f47,
        roughness: 0.5,
        metalness: 0.0
    });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = 2.2;
    head.castShadow = true;
    soldier.add(head);
    
    // Helmet
    const helmetGeometry = new THREE.SphereGeometry(0.28, 32, 32);
    const helmetMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.6,
        metalness: 0.3
    });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.y = 2.25;
    helmet.castShadow = true;
    soldier.add(helmet);
    
    // Left arm
    const armGeometry = new THREE.BoxGeometry(0.18, 0.8, 0.18);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d5c2f,
        roughness: 0.7
    });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 1.4, 0);
    leftArm.castShadow = true;
    soldier.add(leftArm);
    
    // Right arm (will hold rifle)
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 1.4, 0);
    rightArm.castShadow = true;
    soldier.add(rightArm);
    
    // Left leg
    const legGeometry = new THREE.BoxGeometry(0.22, 0.9, 0.22);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d2d2d,
        roughness: 0.8
    });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.3, 0);
    leftLeg.castShadow = true;
    soldier.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.3, 0);
    rightLeg.castShadow = true;
    soldier.add(rightLeg);
    
    // Boots
    const bootGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.35);
    const bootMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6,
        metalness: 0.2
    });
    const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    leftBoot.position.set(-0.15, -0.1, 0.05);
    leftBoot.castShadow = true;
    soldier.add(leftBoot);
    
    const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    rightBoot.position.set(0.15, -0.1, 0.05);
    rightBoot.castShadow = true;
    soldier.add(rightBoot);
    
    // Tactical Vest
    const vestGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.25);
    const vestMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7,
        metalness: 0.2
    });
    const vest = new THREE.Mesh(vestGeometry, vestMaterial);
    vest.position.y = 1.2;
    vest.position.z = -0.1;
    vest.castShadow = true;
    soldier.add(vest);
    
    // Rifle
    const rifle = new THREE.Group();
    
    // Barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16);
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.4,
        metalness: 0.8
    });
    const barrel = new THREE.Mesh(barrelGeometry, metalMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.3, 0.8, -0.2);
    barrel.castShadow = true;
    rifle.add(barrel);
    
    // Stock
    const stockGeometry = new THREE.BoxGeometry(0.12, 0.15, 0.5);
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c4a3a,
        roughness: 0.8,
        metalness: 0.0
    });
    const stock = new THREE.Mesh(stockGeometry, woodMaterial);
    stock.position.set(0.25, 0.6, 0.1);
    stock.castShadow = true;
    rifle.add(stock);
    
    // Magazine
    const magGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.08);
    const magazine = new THREE.Mesh(magGeometry, metalMaterial);
    magazine.position.set(0.32, 0.5, -0.1);
    magazine.castShadow = true;
    rifle.add(magazine);
    
    // Scope
    const scopeGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 16);
    const scope = new THREE.Mesh(scopeGeometry, metalMaterial);
    scope.rotation.z = Math.PI / 2;
    scope.position.set(0.28, 1.15, -0.2);
    scope.castShadow = true;
    rifle.add(scope);
    
    // Grip
    const gripGeometry = new THREE.BoxGeometry(0.08, 0.25, 0.12);
    const grip = new THREE.Mesh(gripGeometry, woodMaterial);
    grip.position.set(0.2, 0.55, -0.2);
    grip.castShadow = true;
    rifle.add(grip);
    
    rifle.position.set(0.4, 1.2, -0.3);
    rifle.rotation.z = -0.3;
    rifle.rotation.y = 0.2;
    
    soldier.add(rifle);
    soldier.rifle = rifle;
    
    scene.add(soldier);
    updateStatus('Soldier model created ✓');
}

function updateSoldierAnimation() {
    if (!soldier || !soldier.rifle) return;
    
    const time = animationState.time;
    
    if (animationState.isAnimating) {
        const aimProgress = Math.min((time - animationState.animStartTime) / 1.5, 1);
        
        if (aimProgress < 0.5) {
            soldier.rifle.rotation.z = -0.3 + aimProgress * 0.5;
            soldier.rifle.rotation.x = -0.2 * aimProgress;
            soldier.rotation.z = 0.1 * aimProgress;
        } else {
            soldier.rifle.rotation.z = -0.05;
            soldier.rifle.rotation.x = -0.1;
            soldier.rotation.z = 0.1;
            
            const breathe = Math.sin(time * 2) * 0.02;
            soldier.rifle.position.y += breathe;
        }
        
        soldier.position.x = Math.sin(time * 0.5) * 0.05;
        soldier.position.y = Math.cos(time * 0.3) * 0.02;
    } else {
        soldier.rifle.rotation.z = -0.3;
        soldier.rifle.rotation.x = 0;
        soldier.position.x = 0;
        soldier.position.y = 0;
        soldier.rotation.z = 0;
    }
}

const cameraPositions = [
    { position: { x: -8, y: 3, z: 8 }, lookAt: { x: 0, y: 1.2, z: 0 }, name: 'Establishing Shot' },
    { position: { x: 6, y: 2, z: 2 }, lookAt: { x: 0, y: 1.3, z: -20 }, name: 'Side Angle' },
    { position: { x: 2, y: 1.8, z: 0.5 }, lookAt: { x: 0.3, y: 1.3, z: -0.3 }, name: 'Close-up Aiming' },
    { position: { x: 1.5, y: 1.9, z: 1.5 }, lookAt: { x: 0, y: 1.2, z: -50 }, name: 'Over-shoulder' },
    { position: { x: -3, y: 0.8, z: 3 }, lookAt: { x: 0, y: 1.5, z: -30 }, name: 'Ground Level' }
];

function toggleCamera() {
    animationState.cameraMode = (animationState.cameraMode + 1) % cameraPositions.length;
    const cameraPos = cameraPositions[animationState.cameraMode];
    updateStatus(`📷 ${cameraPos.name}`);
}

function updateCameraPosition() {
    const cameraPos = cameraPositions[animationState.cameraMode];
    
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
    
    if (animationState.isAnimating) {
        const animTime = animationState.time - animationState.animStartTime;
        
        if (animTime < 1) {
            targetPos.x += Math.sin(animTime * Math.PI) * 0.5;
        } else if (animTime < 2) {
            const angle = (animTime - 1) * Math.PI * 0.5;
            targetPos.x += Math.cos(angle) * 0.3;
            targetPos.z += Math.sin(angle) * 0.3;
        }
    }
    
    camera.position.lerp(targetPos, 0.08);
    
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
    
    scene.fog.far = 200 + Math.sin(animationState.time) * 50;
}

function playAnimation() {
    if (!soldier) {
        updateStatus('Soldier not loaded yet');
        return;
    }
    
    animationState.isAnimating = true;
    animationState.animStartTime = animationState.time;
    updateStatus('▶ Animation playing...');
}

function fireShot() {
    if (!soldier || !soldier.rifle) {
        updateStatus('Soldier not ready');
        return;
    }
    
    playAnimation();
    
    setTimeout(() => {
        createMuzzleFlash();
        createRecoil();
        createSmoke();
        createBulletHole();
    }, 1500);
}

function createMuzzleFlash() {
    const flashGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 2
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    
    const rifleWorldPos = new THREE.Vector3();
    soldier.rifle.getWorldPosition(rifleWorldPos);
    flash.position.copy(rifleWorldPos);
    flash.position.x += 0.8;
    flash.position.z -= 0.2;
    flash.rotation.x = Math.PI / 2;
    
    scene.add(flash);
    
    setTimeout(() => scene.remove(flash), 100);
}

function createRecoil() {
    const originalPos = soldier.rifle.position.clone();
    const originalRot = soldier.rifle.rotation.clone();
    
    soldier.rifle.position.x -= 0.1;
    soldier.rifle.rotation.z += 0.15;
    
    setTimeout(() => {
        let progress = 0;
        const recoilInterval = setInterval(() => {
            progress += 0.05;
            if (progress >= 1) {
                soldier.rifle.position.copy(originalPos);
                soldier.rifle.rotation.copy(originalRot);
                clearInterval(recoilInterval);
            } else {
                soldier.rifle.position.lerp(originalPos, progress);
                soldier.rifle.rotation.x = originalRot.x + (soldier.rifle.rotation.x - originalRot.x) * (1 - progress);
                soldier.rifle.rotation.z = originalRot.z + (soldier.rifle.rotation.z - originalRot.z) * (1 - progress);
            }
        }, 16);
    }, 50);
}

function createSmoke() {
    const smokeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.6
    });
    
    const smokeParticles = [];
    for (let i = 0; i < 8; i++) {
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
        
        const rifleWorldPos = new THREE.Vector3();
        soldier.rifle.getWorldPosition(rifleWorldPos);
        smoke.position.copy(rifleWorldPos);
        smoke.position.x += 0.8 + Math.random() * 0.2;
        smoke.position.y += Math.random() * 0.1;
        
        const velocity = {
            x: (Math.random() - 0.5) * 3,
            y: Math.random() * 2 + 1,
            z: (Math.random() - 0.5) * 2
        };
        
        scene.add(smoke);
        smokeParticles.push({ mesh: smoke, velocity, life: 1 });
    }
    
    const smokeInterval = setInterval(() => {
        let anyAlive = false;
        smokeParticles.forEach(particle => {
            particle.life -= 0.05;
            if (particle.life <= 0) {
                scene.remove(particle.mesh);
            } else {
                particle.mesh.position.x += particle.velocity.x * 0.016;
                particle.mesh.position.y += particle.velocity.y * 0.016;
                particle.mesh.position.z += particle.velocity.z * 0.016;
                particle.mesh.scale.multiplyScalar(1.05);
                particle.mesh.material.opacity = particle.life * 0.6;
                anyAlive = true;
            }
        });
        
        if (!anyAlive) clearInterval(smokeInterval);
    }, 16);
}

function createBulletHole() {
    const impactGeometry = new THREE.CircleGeometry(0.15, 16);
    const impactMaterial = new THREE.MeshBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.8
    });
    const impact = new THREE.Mesh(impactGeometry, impactMaterial);
    impact.position.set(0, 1.5, -50.1);
    
    impact.position.x += (Math.random() - 0.5) * 0.8;
    impact.position.y += (Math.random() - 0.5) * 0.8;
    
    scene.add(impact);
    
    setTimeout(() => {
        impact.material.opacity *= 0.8;
    }, 1000);
}

function resetScene() {
    animationState.isAnimating = false;
    animationState.time = 0;
    animationState.animStartTime = 0;
    
    scene.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'CircleGeometry') {
            scene.remove(child);
        }
    });
    
    if (soldier) {
        soldier.position.set(0, 0, 0);
        soldier.rotation.set(0, 0, 0);
        if (soldier.rifle) {
            soldier.rifle.position.set(0.4, 1.2, -0.3);
            soldier.rifle.rotation.set(0, 0.2, -0.3);
        }
    }
    
    updateStatus('Scene reset ✓');
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function updateStatus(text) {
    document.getElementById('status').textContent = text;
}

function animate() {
    requestAnimationFrame(animate);
    
    animationState.time += 0.016;
    
    if (soldier) {
        updateSoldierAnimation();
    }
    
    updateCameraPosition();
    
    renderer.render(scene, camera);
}

window.addEventListener('load', () => {
    initScene();
});
