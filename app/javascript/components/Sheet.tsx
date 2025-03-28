import React, { useCallback, useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { DndContext, DragStartEvent } from '@dnd-kit/core';
import { Draggable } from './Draggable';
import { DraggableResizable } from './DraggableResizable';
//Composant qui permet de créer un grille pour y déposer des notes. Les élements sont déplacable pour cela on utilise dbd-kit : core, Pour optimiser au lieu de créer pleins de <Droppable> on recupère la position de la souris
//et on ajoute un <Draggable> la ou on relache le click. Il n'y a pas vraiment de déplacement mais une suppression d'un lieu et un ajout au nouvel endroit.
const Sheet = ({
	addLocalKey,
	removeLocalKey,
	keyExists,
	keyNote,
	selectedResolution,
	handlePlayNote,
	MAXRESOLUTION,
}) => {
	const [activeDroppables, setActiveDroppables] = useState({});
	const [draggedItem, setDraggedItem] = useState<string | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [resizedNotes, setResizedNotes] = useState<{ [key: string]: number }>({});
	const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });
	const handleNoteResize = useCallback((cellId: string, width: number) => {
		setResizedNotes(prev => ({
			...prev,
			[cellId]: width
		}));
	}, []);

	useEffect(() => {
		if (draggedItem) {
			const handleMouseMove = (e: MouseEvent) => {
				setMousePosition({
					x: e.clientX,
					y: e.clientY
				});
			};

			window.addEventListener('mousemove', handleMouseMove);
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
			};
		}
	}, [draggedItem]);

	const handleNoteClick = useCallback((e: React.MouseEvent<HTMLElement>, note: string, duration: number) => {
		const keyPosition = e.currentTarget.getAttribute('data-note');

		if (!keyPosition) return;

		let time = duration + "n";

		//Si elle n'existe pas alors on ajoute la note
		if (!keyExists(keyPosition)) {
			addLocalKey(keyPosition, time);
			handlePlayNote(note);
			setActiveDroppables(prevState => ({
				...prevState,
				[keyPosition]: true,
			}));
		}
	}, [keyExists, addLocalKey, handlePlayNote]);

	const handleDeleteNote = useCallback((e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		const keyPosition = e.currentTarget.getAttribute('data-note');

		if (!keyPosition) return;

		if (keyExists(keyPosition)) {
			removeLocalKey(keyPosition);
			setActiveDroppables((prevState) => {
				const newState = { ...prevState };
				delete newState[keyPosition];
				return newState;
			});
		}
	}, [keyExists, removeLocalKey]);

	//Crée l'identifiant de chaque div
	const setDataNote = useCallback((positionIndex: number, mesureIndex: number, note: string) => {
		return mesureIndex * MAXRESOLUTION + positionIndex + `-` + note;
	}, []);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		const { active } = event;
		setDraggedItem(String(active.id));
	}, []);


	const handleDragEnd = useCallback(() => {

		const oldId = draggedItem;
		setDraggedItem(null);

		if (!oldId) return;

		const elementsUnderPoint = document.elementsFromPoint(divPosition.x, divPosition.y);
		const targetElement = elementsUnderPoint.find(a => a.hasAttribute('data-note'));

		if (targetElement) {
			const newId = targetElement.getAttribute('data-note');
			if (!newId) return;

			if (oldId !== newId) {
				if (keyExists(oldId)) {
					removeLocalKey(oldId);
				}
				addLocalKey(newId, selectedResolution + "n");
				setActiveDroppables(prevState => {
					const newState = { ...prevState };
					delete newState[oldId];
					newState[newId] = true;
					return newState;
				});
			}
		}
	}, [draggedItem, keyExists, removeLocalKey, addLocalKey, selectedResolution, divPosition]);


	const positionStyles = useMemo(() => {
		const styles = {};

		const numberOfSections = 8;
		const sectionSize = MAXRESOLUTION / numberOfSections;

		// Applique un style de bordure à chaque fraction de la résolution
		for (let i = 1; i <= numberOfSections; i++) {
			const position = i * sectionSize;
			if (position < MAXRESOLUTION) {
				styles[position - 1] = "border-r-1 border-black";
			}
		}

		return styles;
	}, [MAXRESOLUTION]);

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="w-full">
				<div className="flex flex-col-reverse bg-green-400 w-full">
					{keyNote.map((note) => (
						<div key={note} className="flex flex-row h-3 w-full">
							{Array.from({ length: 4 }).map((_, mesureIndex) => (
								<div key={`measure-${note}-${mesureIndex}`} className="flex relative bg-gray-400 border-r-4 border-y border-black w-1/4">
									<div className="absolute top-0 left-0 right-0 flex">
										{Array.from({ length: MAXRESOLUTION }).map((_, positionIndex) => {
											const cellId = setDataNote(positionIndex, mesureIndex, note);
											const borderStyle = positionStyles[positionIndex] || "";
											//ici on ne crée pas de zone Droppable, on créé seulement un objet Draggable, permet d'alléger le composant
											return (
												<div
													key={cellId}
													id={cellId}
													data-note={cellId}
													className={`flex-1 h-3 w-full ${borderStyle} overflow-visible`}
													onClick={(e) => handleNoteClick(e, note, selectedResolution)}
													onContextMenu={(e) => handleDeleteNote(e)}
												>
													{activeDroppables[cellId] && (
														<Draggable
															key={cellId}
															id={cellId}
															data-note={cellId}
															className="block rounded-sm min-w-[20px] h-3 bg-purple-600 z-50 relative your-element"
															setPosition={setDivPosition}
														/>)}
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

