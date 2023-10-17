import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Item } from '../data/model';
import { useSelectedItems } from '../store/useSelectedItems';
import { ItemImage } from './ItemImage';

interface IItemCardProps {
  item: Item;
  width: number;
  height: number;
  showIndicator?: boolean;
}
export const ItemCard: React.FC<IItemCardProps> = ({ item, width, height, showIndicator }) => {
  const ref = useRef<Animatable.View & View>(null);
  const { selectedItemIds, toggleSelection } = useSelectedItems();

  const isSelected = selectedItemIds.includes(item.id);
  const onPress = useCallback(() => {
    ref?.current?.pulse?.(800);
    toggleSelection(item.id);
  }, [ref]);
  return (
    <Animatable.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      ref={ref}>
      <ItemImage
        toggleSelection={onPress}
        imageUrl={item.image_uri}
        fallbackColor={item.color}
        width={width}
        height={height}
        isSelected={isSelected}
        showIndicator={showIndicator}
        itemName={item.name}
      />
    </Animatable.View>
  );
};
