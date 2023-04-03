import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const Mole = ({ mole, onClick }) => {
  const boxRef = useRef();
  const [miniCubes, setMiniCubes] = useState([]);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    onClick(mole.id, mole.active);
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
        ? 'red'
        : 'blue'
      : 'gray';
  
    return (
      <group onClick={handleClick}>
        <Box
          ref={boxRef}
          args={[1, 1, 1]}
          position={[
            (mole.id % 4) * 2 - 3,
            Math.floor(mole.id / 4) * 2 - 3,
            0,
          ]}
        >
          <meshStandardMaterial color={moleColor} />
        </Box>
        {miniCubes.map((cube) => (
          <Box
            key={cube.id}
            args={[0.1, 0.1, 0.1]}
            position={[
              (mole.id % 4) * 2 - 3 + cube.position[0],
              Math.floor(mole.id / 4) * 2 - 3 + cube.position[1],
              0 + cube.position[2],
            ]}
          >
            <meshStandardMaterial color={moleColor} />
          </Box>
        ))}
      </group>
    );
  };
  
  export default Mole;
  