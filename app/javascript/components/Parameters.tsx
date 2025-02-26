import React, { useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
const Parameters = ({ onResolutionChange }) => {
	const [selectedResolution, setSelectedResolution] = useState("");

	const options = [
		{ value: "8", label: "1/8" },
		{ value: "16", label: "1/16" },
		{ value: "32", label: "1/32" }
	];

	const handleChange = (event) => {
		const resolution = event.target.value;
		setSelectedResolution(resolution);
		onResolutionChange(resolution);
	};
	return (
		<div className="w-full flex-raw flex bg-slate-400">
			<AdjustmentsHorizontalIcon className="flex h-5 w-5" />
			<select value={selectedResolution} onChange={handleChange}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)

}
export default Parameters;
