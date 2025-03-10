import React, { useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon, PlayIcon, PauseIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { start } from 'tone';

const Parameters = ({
	setSelectedResolution,
	selectedResolution,
	MAXRESOLUTION,
	startAndStopSequencer,
	sequencerActive,
	setBpm,
	bpm,
}) => {


	const option = (MAXRESOLUTION) => {
		const options = [];
		for (let i = MAXRESOLUTION; i >= 2; i /= 2) {
			options.push({ value: i, label: `1/${i}` });
		}
		return options
	}
	const handleBpm = (event) => {
		const newBpm = Number(event.target.value);
		setBpm(newBpm);  // Mise à jour du BPM
	};

	const options = option(MAXRESOLUTION);



	const handleChange = (event) => {
		const resolution = event.target.value;
		setSelectedResolution(resolution);
	};
	return (
		<div className="w-full flex bg-slate-400">
			<AdjustmentsHorizontalIcon className="flex h-5 w-5" />
			<select value={selectedResolution} onChange={handleChange}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<p>|</p>
			<MusicalNoteIcon className="flex h-5 w-5" />
			<input type="number" value={bpm} onChange={handleBpm}
				min="30"
				max="250"
				step="1" />
			<p>|</p>
			<button onClick={() => startAndStopSequencer()}>
				{!sequencerActive ? (
					<PlayIcon className="flex h-5 w-5" />
				) : (
					<PauseIcon className="flex h-5 w-5" />
				)}
			</button>
		</div >
	)

}
export default Parameters;
