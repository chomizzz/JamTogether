import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { DndContext, rectIntersection, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';

const Sheet = ({
	localKey,
	addLocalKey,
	removeLocalKey,
	keyExists,
	keyNote,
	selectedResolution,
	handlePlayNote,
}) => {

	const [activeDraggables, setActiveDraggables] = useState({});
	const gridRef = useRef(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			// Réduire la distance d'activation pour que le drag démarre plus rapidement
			activationConstraint: {
				distance: 2, // Démarre le drag après 2px de mouvement au lieu de la valeur par défaut plus élevée
				tolerance: 5, // Plus tolérant en cas de léger mouvement
			},
		})
	);
	const handleNoteClick = useCallback((e, note, mesureIndex, duration) => {
		const keyPosition = e.currentTarget.getAttribute('data-note');
		let time = duration + "n";
		if (!keyExists(keyPosition)) {
			addLocalKey(keyPosition, time);
			handlePlayNote(note);
			setActiveDraggables(prevState => ({
				...prevState,
				[keyPosition]: true,
			}));
		}
	}, [keyExists, addLocalKey, handlePlayNote]);

	const handleDraggableDoubleClick = useCallback((e, note, mesureIndex) => {
		e.stopPropagation(); // Empêche le double-clic de se propager au Droppable parent
		handleDeleteNote(e, note, mesureIndex);
	}, [keyExists, removeLocalKey]);

	const handleDeleteNote = useCallback((e, note, mesureIndex) => {
		e.preventDefault();
		const keyPosition = e.currentTarget.getAttribute('data-note');
		if (keyExists(keyPosition)) {
			removeLocalKey(keyPosition);
			setActiveDraggables((prevState) => {
				const newState = { ...prevState };
				delete newState[keyPosition];
				return newState;
			});
		}

	}, [keyExists, removeLocalKey]);

	const setDataNote = useCallback((positionIndex, mesureIndex, note) => {
		return mesureIndex * 32 + positionIndex + `-` + note;
	}, []);

	const handleDragEnd = useCallback((event) => {
		const { active, over } = event;

		if (!over) return;

		const oldId = active.id;
		const newId = over.id;

		if (oldId !== newId) {
			if (keyExists(oldId)) {
				removeLocalKey(oldId);
			}

			addLocalKey(newId, selectedResolution + "n"); // Ajoute la note avec la nouvelle clé

			setActiveDraggables(prevState => {
				const newState = { ...prevState };
				delete newState[oldId];
				newState[newId] = true;
				return newState;
			});
		}
	}, [keyExists, removeLocalKey, addLocalKey, selectedResolution]);

	// Optimisation 3: Créer une version allégée de Droppable pour les zones inactives
	const LightDroppable = useCallback(({ id, className, onClick, onContextMenu }) => {
		// Version simplifiée qui évite les calculs coûteux inutiles pour les zones vides
		return (
			<div
				id={id}
				data-note={id}
				className={className}
				onClick={onClick}
				onContextMenu={onContextMenu}
			>
			</div>
		);
	}, []);

	const positionStyles = useMemo(() => {
		const styles = {};
		[3, 7, 11, 15, 19, 23, 27].forEach(pos => {
			styles[pos] = "border-r-1 border-black";
		});
		return styles;
	}, []);


	return (
		<DndContext
			onDragEnd={handleDragEnd}
			sensors={sensors}
			modifiers={[restrictToWindowEdges]}
		>			<div className="w-full">
				<div className="flex flex-col-reverse bg-green-400 w-full" ref={gridRef}>

					{keyNote.map((note, noteIndex) => (
						<div key={note} className="flex flex-row h-3 w-full">
							{Array.from({ length: 4 }).map((_, mesureIndex) => (
								<div key={`measure-${note}-${mesureIndex}`} className="flex relative bg-gray-400 border-r-4 border-y border-black w-1/4">
									<div className="absolute top-0 left-0 right-0 flex">
										{Array.from({ length: 32 }).map((_, positionIndex) => {
											const cellId = setDataNote(positionIndex, mesureIndex, note);
											const borderStyle = positionStyles[positionIndex] || "";
											return (
												<div id={cellId} data-note={cellId} className="flex h-3 w-full">
													<Droppable key={cellId} id={cellId}
														data-note={cellId}
														className={`flex-1 h-3 w-full ${borderStyle}`}
														onClick={(e) => handleNoteClick(e, note, mesureIndex, selectedResolution)}
														onContextMenu={(e) => handleDeleteNote(e, note, mesureIndex)}>
														{activeDraggables[cellId] && (
															<Draggable key={cellId} id={cellId} data-note={cellId}
																className="flex h-3 w-full bg-purple-600 z-50" />
														)}
													</Droppable>
												</div>
											);
										})}
									</div>

								</div>))}
						</div>))
					}
				</div >
			</div >

		</DndContext >
	)
}
export default Sheet;
