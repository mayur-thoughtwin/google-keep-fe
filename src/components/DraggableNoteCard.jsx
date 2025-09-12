import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import NoteCard from './NoteCard';

const DraggableNoteCard = ({ note, onEdit, onPin, onArchive, onDelete, onColorChange, onLabelAdd, onMove, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { id: note.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'note',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove?.(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease',
      }}
    >
      <NoteCard
        note={note}
        onEdit={onEdit}
        onPin={onPin}
        onArchive={onArchive}
        onDelete={onDelete}
        onColorChange={onColorChange}
        onLabelAdd={onLabelAdd}
      />
    </div>
  );
};

export default DraggableNoteCard;
