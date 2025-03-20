import React, { useEffect, useState } from 'react';

const PianoRoll = ({ handlePlayNote, keyNote }) => {
	return (

		<div className="flex flex-col-reverse justify-start items-start self-start">

			{keyNote.map((item) => {
				return (
					<div id={item} className={!item.includes("#") ? "bg-white border border-black w-10 h-3"
						: "bg-black border border-white w-10 h-3"}
						onClick={() => handlePlayNote(item)}>
					</div>
				)
			})}
		</div>

	)
}

export default PianoRoll
