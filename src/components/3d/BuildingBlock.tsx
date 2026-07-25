import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DepartmentData } from '../../types/audit';
import { useAuditStore } from '../../store/useAuditStore';

interface BuildingBlockProps {
  department: DepartmentData;
}

export const BuildingBlock: React.FC<BuildingBlockProps> = ({ department }) => {
  const meshRef = useRef<THREE.Group>(null);
  const mainBoxRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const selectedDepartment = useAuditStore((state) => state.selectedDepartment);
  const hoveredDepartment = useAuditStore((state) => state.hoveredDepartment);
  const selectDepartment = useAuditStore((state) => state.selectDepartment);
  const setHoveredDepartment = useAuditStore((state) => state.setHoveredDepartment);

  const isSelected = selectedDepartment?.id === department.id;
  const isHovered = hoveredDepartment === department.id;

  const [w, h, d] = department.dimensions;
  const [posX, posY, posZ] = department.position;

  // Base Risk Colors
  const riskColor = useMemo(() => {
    switch (department.riskLevel) {
      case 'LOW':
        return { main: '#10B981', emissive: '#059669', wireframe: '#34D399', glow: '#059669' };
      case 'MEDIUM':
        return { main: '#F59E0B', emissive: '#D97706', wireframe: '#FBBF24', glow: '#D97706' };
      case 'HIGH':
        return { main: '#EF4444', emissive: '#DC2626', wireframe: '#F87171', glow: '#B91C1C' };
      case 'CRITICAL':
      default:
        return { main: '#991B1B', emissive: '#7F1D1D', wireframe: '#FCA5A5', glow: '#EF4444' };
    }
  }, [department.riskLevel]);

  // Active flags count
  const activeFlagsCount = useMemo(() => {
    return department.flags.filter((f) => f.status === 'UNVERIFIED').length;
  }, [department.flags]);

  // Floor horizontal lines for architectural Citadel aesthetic
  const floorLines = useMemo(() => {
    const lines = [];
    const numFloors = Math.floor(h * 1.5);
    const floorHeight = h / (numFloors + 1);
    for (let i = 1; i <= numFloors; i++) {
      lines.push(-h / 2 + i * floorHeight);
    }
    return lines;
  }, [h]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Hover Bobbing and subtle rotation
      if (isHovered || isSelected) {
        const hoverLift = Math.sin(time * 3) * 0.15 + (isSelected ? 0.3 : 0.1);
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          posY + hoverLift,
          0.1
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          Math.sin(time * 0.8) * 0.05,
          0.05
        );
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          posY,
          0.1
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          0,
          0.1
        );
      }

      // Critical Risk pulse & vertex distortion / scale pulse
      if (department.riskLevel === 'CRITICAL' && mainBoxRef.current) {
        const pulse = Math.sin(time * 6) * 0.04;
        mainBoxRef.current.scale.set(1 + pulse, 1 + Math.abs(pulse * 0.8), 1 + pulse);

        if (materialRef.current) {
          const emissiveIntensity = (Math.sin(time * 5) + 1) * 0.8 + 0.3;
          materialRef.current.emissiveIntensity = emissiveIntensity;
        }

        if (glowMaterialRef.current) {
          glowMaterialRef.current.opacity = (Math.sin(time * 5) + 1) * 0.25 + 0.1;
        }
      } else if (department.riskLevel === 'HIGH' && materialRef.current) {
        const emissiveIntensity = (Math.sin(time * 3) + 1) * 0.3 + 0.2;
        materialRef.current.emissiveIntensity = emissiveIntensity;
      } else if (materialRef.current) {
        const baseIntensity = isSelected ? 0.6 : isHovered ? 0.4 : 0.2;
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          materialRef.current.emissiveIntensity,
          baseIntensity,
          0.1
        );
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={[posX, posY, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        selectDepartment(department.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDepartment(department.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        setHoveredDepartment(null);
      }}
    >
      {/* Outer Selection Highlight Box */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w + 0.3, h + 0.3, d + 0.3]} />
          <meshBasicMaterial
            color={isSelected ? '#38BDF8' : riskColor.wireframe}
            wireframe
            transparent
            opacity={isSelected ? 0.8 : 0.4}
          />
        </mesh>
      )}

      {/* Critical Outer Glow Mesh */}
      {department.riskLevel === 'CRITICAL' && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w + 0.5, h + 0.5, d + 0.5]} />
          <meshBasicMaterial
            ref={glowMaterialRef}
            color={riskColor.glow}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Main Structural Building Geometry */}
      <mesh ref={mainBoxRef} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          ref={materialRef}
          color={riskColor.main}
          emissive={riskColor.emissive}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Structural Wireframe Overlay */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshBasicMaterial
          color={riskColor.wireframe}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Architectural Floor Lines */}
      {floorLines.map((yPos, idx) => (
        <mesh key={idx} position={[0, yPos, 0]}>
          <boxGeometry args={[w + 0.05, 0.04, d + 0.05]} />
          <meshStandardMaterial
            color="#E2E8F0"
            emissive="#94A3B8"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Roof Antenna / Beacon Tower */}
      <group position={[0, h / 2 + 0.5, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color={
              department.riskLevel === 'CRITICAL'
                ? '#EF4444'
                : department.riskLevel === 'HIGH'
                ? '#F59E0B'
                : '#10B981'
            }
          />
        </mesh>
      </group>

      {/* Ground Base Pad / Foundation */}
      <mesh position={[0, -h / 2 - 0.1, 0]}>
        <boxGeometry args={[w + 0.6, 0.2, d + 0.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 3D Floating HUD Badge over Building Block */}
      <Html
        position={[0, h / 2 + 1.2, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
      >
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none whitespace-nowrap select-none ${
            isSelected
              ? 'bg-slate-900/95 border-cyan-400 ring-2 ring-cyan-500/50 scale-110'
              : isHovered
              ? 'bg-slate-900/90 border-slate-600 scale-105'
              : 'bg-slate-950/80 border-slate-800/80'
          }`}
        >
          {/* Status Indicator Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              department.riskLevel === 'CRITICAL'
                ? 'bg-red-500 animate-ping'
                : department.riskLevel === 'HIGH'
                ? 'bg-red-400'
                : department.riskLevel === 'MEDIUM'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />

          <span className="text-xs font-mono font-semibold text-slate-200 tracking-wider">
            {department.code}
          </span>

          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
            {department.score}%
          </span>

          {activeFlagsCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                department.riskLevel === 'CRITICAL'
                  ? 'bg-red-950 text-red-300 border border-red-700/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-700/50'
              }`}
            >
              {activeFlagsCount} {activeFlagsCount === 1 ? 'FLAG' : 'FLAGS'}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
};
