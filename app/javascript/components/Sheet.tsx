import React, { useEffect, useState } from 'react';
import { closestCorners, DndContext } from '@dnd-kit/core';
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
	const [parent, setParent] = useState("droppable"); // Stocke la position actuelle du draggable

	function handleNoteClick(e, note, mesureIndex, duration) {

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


	}

	function handleDeleteNote(e, note, mesureIndex) {
		const keyPosition = e.currentTarget.getAttribute('data-note');
		if (keyExists(keyPosition)) {
			removeLocalKey(keyPosition);
			setActiveDraggables((prevState) => {
				const newState = { ...prevState };
				delete newState[keyPosition];
				return newState;
			});
		}

	}

	function setDataNote(positionIndex, mesureIndex, note) {
		return mesureIndex * 32 + positionIndex + `-` + note;
	}
	function mapPositionTo32Grid(positionIndex, selectedResolution) {
		const factor = 32 / selectedResolution;
		return Math.floor(positionIndex * factor);
	}


	const handleDragEnd = (event) => {
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
	};
	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className="w-full">
				<div className="flex flex-col-reverse bg-green-400 w-full">

					{keyNote.map((note, noteIndex) => (
						<div key={note} className="flex flex-row h-3 w-full">
							{Array.from({ length: 4 }).map((_, mesureIndex) => (
								<div key={`measure-${note}-${mesureIndex}`} className="flex relative bg-gray-400 border-r-4 border-y border-black w-1/4">
									<div className="absolute top-0 left-0 right-0 flex">
										{Array.from({ length: 32 }).map((_, positionIndex) => {
											const cellId = setDataNote(positionIndex, mesureIndex, note);
											return (
												<div id={cellId} data-note={cellId} className="flex h-3 w-full">
													<Droppable key={cellId} id={cellId}
														data-note={cellId}
														className={`flex-1 h-3 w-full ${[3, 7, 11, 15, 19, 23, 27].includes(positionIndex) ? "border-r-1 border-black" : ""}`}
														onClick={(e) => handleNoteClick(e, note, mesureIndex, selectedResolution)}
														onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)}>
														{activeDraggables[cellId] && (
															<Draggable key={cellId} id={cellId} data-note={cellId}
																className="flex h-3 w-full bg-purple-600 z-50"
																onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)} />
														)}													</Droppable>
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
