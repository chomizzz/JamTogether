import React, { useEffect, useState } from 'react';

const Sheet = ({ keyNote, selectedResolution, handlePlayNote }) => {

	return (
		<div className="flex flex-col-reverse bg-green-400 w-full">

			{keyNote.map((note, noteIndex) => (
				<div className="flex flex-row h-3 w-full">
					{Array.from({ length: 4 }).map((_, mesureIndex) => (
						<div className="flex bg-gray-400 border border-black w-1/4">
							{Array.from({ length: selectedResolution }).map((_, positionIndex) => (
								<div className="flex-1 bg-gray-100 h-3 border text-xs border-black hover:bg-gray-900" onClick={() => handlePlayNote(note)}>{`${mesureIndex} - ${positionIndex}`}</div>
							))}
						</div>))}
				</div>))}
		</div>

	)
}
export default Sheet;
