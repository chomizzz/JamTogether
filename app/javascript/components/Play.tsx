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
    const [localKey, setLocalKey] = useState([]);

    const addLocalKey = (value) => {

    }

    useEffect(() => {
        Tone.start();

        return () => {
            Tone.Transport.stop();
        };
    }, []);

    const handlePlayNote = (note) => {
        synth.triggerAttackRelease(note, "8n");
        console.log(localKey);
    };

    const handleResolutionChange = (resolution) => {
        setSelectedResolution(Number(resolution));
    };

    const sequencer = () => {

    };

    const startAndStopSequencer = () => {

    };

    return (
        <div className="flex-col">
            <Parameters
                onResolutionChange={handleResolutionChange}
                startAndStopSequencer={startAndStopSequencer}
            />
            <div className="flex-row flex">
                <PianoRoll handlePlayNote={handlePlayNote} keyNote={keyNote} />
                <Sheet
                    localKey={localKey}
                    setLocalKey={setLocalKey}
                    keyNote={keyNote}
                    selectedResolution={selectedResolution}
                    handlePlayNote={handlePlayNote}
                />
            </div>

        </div>
    )
};
export default Play;
