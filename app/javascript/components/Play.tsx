import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import Parameters from './Parameters';
import PianoRoll from './PianoRoll';
import Sheet from './Sheet';
const Play = ({ room, userSlot, userInstrument }) => {
    const synth = new Tone.Synth().toDestination();
    const [selectedResolution, setSelectedResolution] = useState(8);
    const keyNote = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"];
    const getNoteWidth = (noteDuration, resolution) => {
        return noteDuration / resolution;
    };



    useEffect(() => {
        Tone.start();

        return () => {
            Tone.Transport.stop();
        };
    }, []);

    const handlePlayNote = (note) => {
        synth.triggerAttackRelease(note, "8n");
    };

    const handleResolutionChange = (resolution) => {
        setSelectedResolution(Number(resolution));
    };

    return (
        <div className="flex-col">
            <Parameters onResolutionChange={handleResolutionChange} />
            <div className="flex-row flex">
                <PianoRoll handlePlayNote={handlePlayNote} keyNote={keyNote} />
                <Sheet keyNote={keyNote} selectedResolution={selectedResolution} handlePlayNote={handlePlayNote} />
            </div>

        </div>
    )
};
export default Play;
