import React, { useEffect, useState } from 'react';

const Sheet = ({
	localKey,
	setLocalKey,
	keyNote,
	selectedResolution,
	handlePlayNote,
}) => {
	const handleNoteClick = (e, note, mesureIndex) => {
		const keyPosition = e.target.getAttribute('data-note');
		if (!localKey.includes(keyPosition)) {
			setLocalKey((prevLocalKey) => [...prevLocalKey, keyPosition]);
			e.target.classList.add("bg-red-500");

			handlePlayNote(note);
		}


	}

	const handleDeleteNote = (e, note, mesureIndex) => {
		const keyPosition = e.target.getAttribute('data-note');
		if (localKey.includes(keyPosition)) {
			const updatedLocalKey = localKey.filter(item => item !== keyPosition);
			setLocalKey(updatedLocalKey);
			e.target.classList.remove("bg-red-500");
		}

	}

	const setDataNote = (positionIndex, mesureIndex, note) => {
		const relativePosition = parseInt(positionIndex, 10).toString(2);
		return `${mesureIndex}-${relativePosition}-${note}`;

	}

	return (
		<div className="flex flex-col-reverse bg-green-400 w-full">

			{keyNote.map((note, noteIndex) => (
				<div className="flex flex-row h-3 w-full">
					{Array.from({ length: 4 }).map((_, mesureIndex) => (
						<div className="flex bg-gray-400 border border-black w-1/4">
							{Array.from({ length: selectedResolution }).map((_, positionIndex) => (
								<div
									data-note={setDataNote(positionIndex, mesureIndex, note)}
									className={`flex-1 bg-gray-100 h-3 border text-xs border-gray-300 hover:bg-purple-700`}
									onClick={(e) => handleNoteClick(e, note, mesureIndex)}
									onDoubleClick={(e) => handleDeleteNote(e, note, mesureIndex)}>
								</div>
							))}
						</div>))}
				</div>))
			}
		</div >

	)
}
export default Sheet;
