import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GrowthCurves() {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    const configs = [
      { amp: 0.6, freq: 1.4, yOff: -1.2, z: -1.5, opacity: 0.9 },
      { amp: 0.45, freq: 1.8, yOff: -1.0, z: -2.2, opacity: 0.55 },
      { amp: 0.35, freq: 2.2, yOff: -0.8, z: -3.0, opacity: 0.3 },
    ];

    return configs.map(({ amp, freq, yOff, z, opacity }) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        points.push(
          new THREE.Vector3(
            (t - 0.35) * 14,
            Math.sin(t * Math.PI * freq) * amp + t * 2.8 + yOff,
            z,
          ),
        );
      }
      return { curve: new THREE.CatmullRomCurve3(points), opacity };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.06;
    groupRef.current.position.y = Math.sin(t * 0.25) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0.5, 0, 0]}>
      {curves.map(({ curve, opacity }, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[curve, 100, 0.018, 6, false]} />
            <meshStandardMaterial
              color="#c8f542"
              emissive="#c8f542"
              emissiveIntensity={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Glow halo beneath primary curve */}
          {i === 0 && (
            <mesh>
              <tubeGeometry args={[curve, 100, 0.06, 6, false]} />
              <meshStandardMaterial
                color="#c8f542"
                emissive="#c8f542"
                emissiveIntensity={0.3}
                transparent
                opacity={0.06}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function HorizonGrid() {
  const ref = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = -4 + (state.clock.elapsedTime * 0.15) % 1;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[40, 60, '#c8f542', '#1a1a1f']}
      position={[0, -2.5, -4]}
      rotation={[0, 0, 0]}
    />
  );
}

function DataNodes() {
  const ref = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.3) * 12,
      y: Math.random() * 4 - 0.5,
      z: -1.5 - Math.random() * 3,
      size: 0.025 + Math.random() * 0.035,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, idx) => {
      const n = nodes[idx];
      child.position.y = n.y + Math.sin(state.clock.elapsedTime * n.speed + n.phase) * 0.15;
    });
  });

  return (
    <group ref={ref}>
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[n.size, 8, 8]} />
          <meshStandardMaterial
            color="#c8f542"
            emissive="#c8f542"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const nodeCount = 12;
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodePositions.push(
        new THREE.Vector3(
          (Math.random() - 0.3) * 10,
          Math.random() * 3,
          -2 - Math.random() * 2,
        ),
      );
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 4) {
          positions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#c8f542" transparent opacity={0.08} />
    </lineSegments>
  );
}

function AmbientDust() {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#c8f542" />
      <pointLight position={[4, -1, -2]} intensity={0.2} color="#a2d026" />

      <fog attach="fog" args={['#050508', 6, 18]} />

      <HorizonGrid />
      <GrowthCurves />
      <ConnectionLines />
      <DataNodes />
      <AmbientDust />
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="scene-3d">
      <div className="scene-3d__aurora" aria-hidden="true" />
      <Canvas
        camera={{ position: [0, 1.2, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
