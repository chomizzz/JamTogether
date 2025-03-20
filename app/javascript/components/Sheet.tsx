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


	function handleNoteClick(e, note, mesureIndex, duration) {

		const keyPosition = e.target.getAttribute('data-note');
		let time = duration + "n";
		if (!keyExists(keyPosition)) {
			addLocalKey(keyPosition, time);
			document.getElementById(keyPosition)?.classList.add("bg-red-500");
			handlePlayNote(note);
		}


	}

	function handleDeleteNote(e, note, mesureIndex) {
		const keyPosition = e.target.getAttribute('data-note');
		if (keyExists(keyPosition)) {
			removeLocalKey(keyPosition);
			document.getElementById(keyPosition)?.classList.remove("bg-red-500");
		}

	}

	function setDataNote(positionIndex, mesureIndex, note) {
		return mesureIndex * 32 + positionIndex + `-` + note;
	}
	function mapPositionTo32Grid(positionIndex, selectedResolution) {
		const factor = 32 / selectedResolution;
		return Math.floor(positionIndex * factor);
	}

	const [parent, setParent] = useState("droppable"); // Stocke la position actuelle du draggable

	const handleDragEnd = (event) => {
		const { over } = event;
		if (over) {
			setParent(over.id); // Met à jour la position de l'élément
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
												<Droppable key={cellId} id={cellId}
													className={`flex-1 h-3 z-10 ${[3, 7, 11, 15, 19, 23, 27].includes(positionIndex) ? "border-r-1 border-black" : ""}`}
													onClick={(e) => handleNoteClick(e, note, mesureIndex, selectedResolution)}
													onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)}>
													{parent === cellId && <Draggable id="draggable" className="flex h-3 w-full bg-purple-600"></Draggable>}
												</Droppable>

											);
										})}
									</div>

								</div>))}
						</div>))
					}
				</div >
			</div >
			<div className="flex h-3">{parent === "droppable" && <Draggable id="draggable" className="flex h-3 w-full bg-purple-600">🎵</Draggable>}</div>

		</DndContext >
	)
}
export default Sheet;
