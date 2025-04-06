import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ApartmentCard from './ApartmentCard';
import { Apartment } from '../types';

interface DraggableApartmentCardProps {
  apartment: Apartment;
  index: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const DraggableApartmentCard: React.FC<DraggableApartmentCardProps> = ({
  apartment,
  index,
  onClick,
  isSelected
}) => {
  return (
    <Draggable draggableId={`apartment-${apartment.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`h-full mb-6 transition-all ${
            isSelected ? "ring-2 ring-[#E9927E] rounded-lg" : ""
          } ${snapshot.isDragging ? "opacity-70 shadow-xl scale-95" : ""}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <ApartmentCard apartment={apartment} />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableApartmentCard;