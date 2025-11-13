import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Create floating spheres with gradient colors
    const spheres: THREE.Mesh[] = [];
    const sphereData: Array<{ mesh: THREE.Mesh; vx: number; vy: number; vz: number }> = [];

    const colors = [
      0x6b48e5, // Purple
      0x00d4ff, // Cyan
      0x9c27b0, // Magenta
      0x5c6bc0, // Indigo
      0x00bcd4, // Teal
    ];

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.IcosahedronGeometry(0.5 + Math.random() * 0.3, 4);
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.3,
        wireframe: false,
        shininess: 100,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      scene.add(sphere);
      spheres.push(sphere);
      sphereData.push({
        mesh: sphere,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        vz: (Math.random() - 0.5) * 0.01,
      });
    }

    // Add lighting
    const light1 = new THREE.PointLight(0x6b48e5, 1, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00d4ff, 1, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      sphereData.forEach((data) => {
        data.mesh.position.x += data.vx;
        data.mesh.position.y += data.vy;
        data.mesh.position.z += data.vz;

        data.mesh.rotation.x += 0.001;
        data.mesh.rotation.y += 0.002;

        // Bounce off boundaries
        if (Math.abs(data.mesh.position.x) > 6) data.vx *= -1;
        if (Math.abs(data.mesh.position.y) > 6) data.vy *= -1;
        if (Math.abs(data.mesh.position.z) > 6) data.vz *= -1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};
