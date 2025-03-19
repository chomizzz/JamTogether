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
	const [parent, setParent] = useState("droppable");
	//const draggable = (
	//	<Draggable id="draggable">
	//		Go ahead, drag me.
	//	</Draggable>
	//);

	const handleDragEnd = (event) => {
		const { over } = event;
		if (over) {
			setParent(over.id); // Met à jour la position de l'élément
		}
	};
	return (
		<div className="w-full">
			<div className="flex flex-col-reverse bg-green-400 w-full">

				{keyNote.map((note, noteIndex) => (
					<div className="flex flex-row h-3 w-full">
						{Array.from({ length: 4 }).map((_, mesureIndex) => (
							<div key={`measure-${note}-${mesureIndex}`} className="flex relative bg-gray-400 border-r-4 border-y border-black w-1/4">
								<div className="absolute top-0 left-0 right-0 flex">
									{Array.from({ length: 32 }).map((_, positionIndex) => (

										<div
											id={setDataNote(positionIndex, mesureIndex, note)}
											className={`flex-1 h-3 ${[3, 7, 11, 15, 19, 23, 27].includes(positionIndex) ? "border-r-1 border-black" : ""}`}>
										</div>


									))}
								</div>

								<div className="absolute top-0 left-0 right-0 flex z-10">
									{Array.from({ length: selectedResolution }).map((_, positionIndex) => {
										const mappedIndex = mapPositionTo32Grid(positionIndex, selectedResolution);
										return (<div
											data-note={setDataNote(mappedIndex, mesureIndex, note)}
											className={`flex-1 h-3  hover:bg-purple-700 hover:opacity-20 z-10`}
											onClick={(e) => handleNoteClick(e, note, mesureIndex, selectedResolution)}
											onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)}>
										</div>)

									})}
								</div>
							</div>))}
					</div>))
				}
			</div >
		</div >
	)
}
export default Sheet;
