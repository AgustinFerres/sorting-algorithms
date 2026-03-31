import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { algorithms } from '../algorithms';
import { AlgorithmSidebar } from './AlgorithmSidebar';
import { AlgorithmDetail, AlgorithmDetailHandle } from './AlgorithmDetail';

const generateRandomArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1);

const VisualizerWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

export const Visualizer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(100);
  const [initialArray, setInitialArray] = useState<number[]>(() => generateRandomArray(50));

  const detailRef = useRef<AlgorithmDetailHandle | null>(null);

  const handleAlgoSelect = useCallback(
    (index: number) => {
      detailRef.current?.reset();
      setSelectedIndex(index);
      setInitialArray(generateRandomArray(arraySize));
    },
    [arraySize]
  );

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
    setInitialArray(generateRandomArray(size));
    detailRef.current?.reset();
  }, []);

  return (
    <VisualizerWrapper>
      <AlgorithmSidebar
        algorithms={algorithms}
        selectedIndex={selectedIndex}
        onSelect={handleAlgoSelect}
      />
      <AlgorithmDetail
        ref={detailRef}
        algorithm={algorithms[selectedIndex]}
        initialArray={initialArray}
        speed={speed}
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        onSpeedChange={setSpeed}
      />
    </VisualizerWrapper>
  );
};
