import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useAuditStore } from '../../store/useAuditStore';
import { BuildingBlock } from './BuildingBlock';

// Helper component inside Canvas to handle smooth camera moves on selection changes
const CameraController: React.FC = () => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const selectedDepartment = useAuditStore((state) => state.selectedDepartment);

  useEffect(() => {
    if (cameraControlsRef.current) {
      if (selectedDepartment) {
        const [x, y, z] = selectedDepartment.position;
        // Smoothly move camera target to the selected building block
        cameraControlsRef.current.setLookAt(
          x + 7,
          y + 6,
          z + 7,
          x,
          y,
          z,
          true
        );
      } else {
        // Default overview perspective camera lookAt
        cameraControlsRef.current.setLookAt(14, 14, 14, 0, 2, 0, true);
      }
    }
  }, [selectedDepartment]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below ground
      minDistance={5}
      maxDistance={40}
      smoothTime={0.8}
    />
  );
};

// Ground Citadel Plaza Base Structure
const CitadelPlaza: React.FC = () => {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Central Hexagonal Base Platform */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[9, 9.5, 0.4, 6]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Cybernetic Edge Ring */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.8, 9.2, 6]} />
        <meshBasicMaterial color="#0284C7" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Grid Floor */}
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={1}
        cellColor="#1E293B"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#0284C7"
        fadeDistance={30}
        fadeStrength={1.5}
      />

      {/* Central Citadel Emblem Emblem Pedestal */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.0, 2.2, 0.1, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.8, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Main Scene Component wrapping R3F Canvas
export const ComplianceCitadelScene: React.FC = () => {
  const departments = useAuditStore((state) => state.departments);
  const selectedDepartment = useAuditStore((state) => state.selectedDepartment);
  const selectDepartment = useAuditStore((state) => state.selectDepartment);

  // Identify point light positions for Critical / High risk departments
  const riskLights = departments.filter(
    (d) => d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH'
  );

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [14, 14, 14], fov: 45 }}
        onPointerDown={(e) => {
          // If clicking background canvas canvas mesh, deselect
          if (e.target === e.currentTarget) {
            selectDepartment(null);
          }
        }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 20, 50]} />

        {/* Ambient & General Lighting */}
        <ambientLight intensity={0.6} color="#E2E8F0" />
        <directionalLight
          position={[15, 25, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          color="#F8FAFC"
        />

        {/* Dynamic Point Lights near High Risk Wings */}
        {riskLights.map((dept) => (
          <pointLight
            key={dept.id}
            position={[dept.position[0], dept.position[1] + 1, dept.position[2]]}
            intensity={dept.riskLevel === 'CRITICAL' ? 8.0 : 4.0}
            distance={10}
            color={dept.riskLevel === 'CRITICAL' ? '#EF4444' : '#F59E0B'}
          />
        ))}

        {/* Fill Rim Light */}
        <pointLight position={[-15, 10, -15]} intensity={2.0} color="#38BDF8" />

        {/* Camera Controls & Transitions */}
        <CameraController />

        {/* Atmospheric Particles & Background Stars */}
        <Stars radius={40} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />

        {/* Ground Base Platform */}
        <CitadelPlaza />

        {/* Department 3D Building Blocks */}
        {departments.map((dept) => (
          <BuildingBlock key={dept.id} department={dept} />
        ))}
      </Canvas>
    </div>
  );
};
