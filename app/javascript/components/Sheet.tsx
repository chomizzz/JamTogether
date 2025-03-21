import React, { useCallback, useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import { DndContext, rectIntersection, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
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
	const [draggedItem, setDraggedItem] = useState(null);
	const gridRef = useRef(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	// Utiliser useLayoutEffect pour s'assurer que la mise en page est synchronisée
	useLayoutEffect(() => {
		if (draggedItem) {
			const handleMouseMove = (e) => {
				setMousePosition({ x: e.clientX, y: e.clientY });
			};

			window.addEventListener('mousemove', handleMouseMove);
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
			};
		}
	}, [draggedItem]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 2,
				tolerance: 5,
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

	const handleDragStart = useCallback((event) => {
		const { active } = event;
		setDraggedItem(active.id);
	}, []);

	const handleDragEnd = useCallback((event) => {
		const { active, delta, over } = event;
		const oldId = draggedItem;
		setDraggedItem(null);

		if (!oldId) return;

		if (over) {
			const newId = over.id;
			if (oldId !== newId) {
				if (keyExists(oldId)) {
					removeLocalKey(oldId);
				}
				addLocalKey(newId, selectedResolution + "n");
				setActiveDraggables(prevState => {
					const newState = { ...prevState };
					delete newState[oldId];
					newState[newId] = true;
					return newState;
				});
			}
			return;
		}

		const elementsUnderPoint = document.elementsFromPoint(mousePosition.x, mousePosition.y);
		const targetElement = elementsUnderPoint.find(el => el.hasAttribute('data-note'));

		if (targetElement) {
			const newId = targetElement.getAttribute('data-note');
			if (oldId !== newId) {
				if (keyExists(oldId)) {
					removeLocalKey(oldId);
				}
				addLocalKey(newId, selectedResolution + "n");
				setActiveDraggables(prevState => {
					const newState = { ...prevState };
					delete newState[oldId];
					newState[newId] = true;
					return newState;
				});
			}
		}
	}, [draggedItem, keyExists, removeLocalKey, addLocalKey, selectedResolution, mousePosition]);

	const positionStyles = useMemo(() => {
		const styles = {};
		[3, 7, 11, 15, 19, 23, 27].forEach(pos => {
			styles[pos] = "border-r-1 border-black";
		});
		return styles;
	}, []);

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			sensors={sensors}
			collisionDetection={rectIntersection}
			modifiers={[restrictToWindowEdges]}
		>
			<div className="w-full">
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
												<div
													key={cellId}
													id={cellId}
													data-note={cellId}
													className={`flex-1 h-3 w-full ${borderStyle}`}
													onClick={(e) => handleNoteClick(e, note, mesureIndex, selectedResolution)}
													onContextMenu={(e) => handleDeleteNote(e, note, mesureIndex)}
												>
													{activeDraggables[cellId] && (
														<Draggable
															key={cellId}
															id={cellId}
															data-note={cellId}
															className="flex h-3 w-full bg-purple-600 z-50"
														/>
													)}
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</DndContext>
	);
};

export default Sheet;

