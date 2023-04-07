import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

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
      for (let i = 0; i < 33; i++) {
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMiniCubes([]);
    }, 500);
    return () => clearTimeout(timeout);
  }, [miniCubes]);

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
        <Box
          key={cube.id}
          args={[0.05, 0.05, 0.05]}
          position={[
            (mole.id % 4) * 2 - 2.5 + cube.position[0],
            Math.floor(mole.id / 4) * 2 - 2.5 + cube.position[1],
            0 + cube.position[2],
          ]}
        >
          <meshPhongMaterial color="#AD8929" />
        </Box>
      ))}
    </group>
  );
};

export default Mole;
