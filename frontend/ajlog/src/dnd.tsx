// https://docs.dndkit.com/presets/sortable

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';


export function Dnd() {
    const [items, setItems] = useState([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetch('http://localhost:8080/scrum_teams/order/')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error("Fetching data failed", error));
    }, []);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map(item => <SortableItem key={item.id} id={item.id} name={item.name} />)}
            </SortableContext>
        </DndContext>
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                items = arrayMove(items, oldIndex, newIndex);
                const orders = [];
                items.forEach((item, index) => {
                    orders.push({
                        scrum_team_id: item.id,
                        order: index,
                    });
                });
                fetch('http://localhost:8080/scrum_teams/order/',
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orders),
                    })
                    .then(response => response.json())
                    .catch(error => console.error("Fetching data failed", error));
                return items;
            });
        }
    }
}


export function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            #{props.id}, {props.name}
        </div>
    );
}
