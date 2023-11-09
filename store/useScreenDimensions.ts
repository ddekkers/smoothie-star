import { useCallback } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export const useScreenDimensions = () => {
  const { width, height } = useWindowDimensions();
  const getWidthPercent = useCallback(
    (percentage: number) => {
      return (width * percentage) / 100;
    },
    [width]
  );
  const getHeightPercent = useCallback(
    (percentage: number) => {
      return (height * percentage) / 100;
    },
    [width]
  );
  return {
    screenWidth: width,
    screenHeight: height,
    getWidthPercent,
    getHeightPercent,
  };
};
