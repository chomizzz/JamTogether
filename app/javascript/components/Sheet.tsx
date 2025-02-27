import React, { useEffect, useState } from 'react';

const Sheet = ({
	localKey,
	addLocalKey,
	removeLocalKey,
	keyNote,
	selectedResolution,
	handlePlayNote,
}) => {
	const handleNoteClick = (e, note, mesureIndex) => {
		const keyPosition = e.target.getAttribute('data-note');
		if (!localKey.includes(keyPosition)) {
			addLocalKey(keyPosition);
			document.getElementById(keyPosition)?.classList.add("bg-red-500");
			handlePlayNote(note);
		}


	}

	const handleDeleteNote = (e, note, mesureIndex) => {
		const keyPosition = e.target.getAttribute('data-note');
		if (localKey.includes(keyPosition)) {
			removeLocalKey(keyPosition);
			document.getElementById(keyPosition)?.classList.remove("bg-red-500");
		}

	}

	const setDataNote = (positionIndex, mesureIndex, note) => {
		const relativePosition = parseInt(positionIndex, 10).toString(2).padStart(5, '0');
		return `${mesureIndex}-${relativePosition}-${note}`;
	}
	const mapPositionTo32Grid = (positionIndex, selectedResolution) => {
		// Calcule l'index équivalent dans la grille de 32
		// Ex: pour selectedResolution=8, multiplier par 4 (32/8) pour correspondre
		const factor = 32 / selectedResolution;
		return Math.floor(positionIndex * factor);
	}

	return (
		<div className="flex flex-col-reverse bg-green-400 w-full">

			{keyNote.map((note, noteIndex) => (
				<div className="flex flex-row h-3 w-full">
					{Array.from({ length: 4 }).map((_, mesureIndex) => (
						<div key={`measure-${note}-${mesureIndex}`} className="flex relative bg-gray-400 border border-black w-1/4">
							<div className="absolute top-0 left-0 right-0 flex">
								{Array.from({ length: 32 }).map((_, positionIndex) => (
									<div
										id={setDataNote(positionIndex, mesureIndex, note)}
										className={`flex-1 h-3`}>
									</div>
								))}
							</div>
							<div className="absolute top-0 left-0 right-0 flex z-10">
								{Array.from({ length: selectedResolution }).map((_, positionIndex) => {
									const mappedIndex = mapPositionTo32Grid(positionIndex, selectedResolution);
									return (<div
										data-note={setDataNote(mappedIndex, mesureIndex, note)}
										className={`flex-1 h-3 border border-gray-300 hover:bg-purple-700 hover:opacity-20 z-10`}
										onClick={(e) => handleNoteClick(e, note, mesureIndex)}
										onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)}>
									</div>)

								})}
							</div>
						</div>))}
				</div>))
			}
		</div >

	)
}
export default Sheet;
