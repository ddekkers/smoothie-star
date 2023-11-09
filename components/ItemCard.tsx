import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { Item } from '../data/model';
import { useSelectedItems } from '../store/useSelectedItems';
import { ItemImage } from './ItemImage';
import { ImmutableArray } from '@hookstate/core';

interface IItemCardProps {
  item: Item;
  width: number;
  height: number;
  showIndicator?: boolean;
  selectedItemIds: ImmutableArray<string>;
  onSelect: (id: string) => void
}
export const ItemCard: React.FC<IItemCardProps> = ({ item, width, height, selectedItemIds, onSelect }) => {
  const isSelected = selectedItemIds?.includes(item.id);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
       <ItemImage
        onSelect={() => onSelect(item.id)}
        imageUrl={item.image_uri}
        width={width || 0}
        height={height || 0}
        isSelected={isSelected}
        itemName={item.name}
        fallbackColor={item.color}
      />
    </View>
  );
};
