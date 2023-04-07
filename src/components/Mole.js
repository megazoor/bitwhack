import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Cylinder } from '@react-three/drei';

const Mole = ({ mole, onClick }) => {
  const boxRef = useRef();
  const [miniCubes, setMiniCubes] = useState([]);
  const [showWireframe, setShowWireframe] = useState(true);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    onClick(mole);
    setShowWireframe(!showWireframe); 
    if (mole.active) {
      const cubes = [];
      for (let i = 0; i < 100; i++) {
        cubes.push({
          id: i,
          position: [
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
          ],
          velocity: [
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ],
        });
      }
      setMiniCubes(cubes);
    }
  };

  useFrame(() => {
    setMiniCubes((prevCubes) =>
      prevCubes.map((cube) => ({
        ...cube,
        position: [
          cube.position[0] + cube.velocity[0] * 0.01,
          cube.position[1] + cube.velocity[1] * 0.01,
          cube.position[2] + cube.velocity[2] * 0.01,
        ],
      }))
    );
  });
  const moleColor = mole.active
  ? mole.whacked
    ? mole.streak
      ? mole.color
      : 'red'
    : mole.color
  : 'gray';


  return (
    <group onClick={handleClick}>
      <Box
        ref={boxRef}
        args={[1, 1, 1]}
        position={[
          (mole.id % 4) * 2 - 2.5,
          Math.floor(mole.id / 4) * 2 - 2.5,
          0,
        ]}
      >
        <meshPhongMaterial color={moleColor} />
      </Box>
      {miniCubes.map((cube) => (
  <group key={cube.id}>
    <Cylinder
      args={[0.05, 0.05, 0.01, 32]}
      position={[
        (mole.id % 4) * 2 - 2.5 + cube.position[0] - 0.03, // Move right: -0.03 to -0.02
        Math.floor(mole.id / 4) * 2 - 2.5 + cube.position[1] - 0.03, // Move up: -0.04 to -0.03
        0 + cube.position[2] + 0.005,
      ]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {/* Gold color */}
      <meshPhongMaterial color="#AD8929" />
    </Cylinder>
   
  </group>
))}

    </group>
  );
};

export default Mole;
