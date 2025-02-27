import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import Parameters from './Parameters';
import PianoRoll from './PianoRoll';
import Sheet from './Sheet';

const MAXRESOLUTION = 32;

const Play = ({ room, userSlot, userInstrument }) => {
    const synth = new Tone.Synth().toDestination();
    const [selectedResolution, setSelectedResolution] = useState(8);
    const keyNote = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"];
    const getNoteWidth = (noteDuration, resolution) => {
        return noteDuration / resolution;
    };
    const [localKey, setLocalKey] = useState(new Array(128));


    const addLocalKey = (value) => {
        //setLocalKey((prevLocalKey) => [...prevLocalKey, value]);
        const test = value.split("-");
        const index = parseInt(test[1], 2);
        setLocalKey((prevLocalKey) => {
            const newArray = [...prevLocalKey];
            switch (parseInt(test[0], 10)) {
                case 0:
                    // Insérer la note à l'index calculé (test[2] représente la note)
                    newArray[index] = test[2];
                    break;
                case 1:
                    newArray[31 + index] = test[2];  // Insérer à un index décalé
                    break;
                case 2:
                    newArray[63 + index] = test[2];  // Insérer à un autre index décalé
                    break;
                case 3:
                    newArray[95 + index] = test[2];  // Insérer à un autre index décalé
                    break;
                default:
                    break;
            }
            console.log(newArray);
            return newArray; // Retourner le tableau mis à jour
        });
    }

    const removeLocalKey = (value) => {
        const updatedLocalKey = localKey.filter(item => item !== value);
        setLocalKey(updatedLocalKey);
    }

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

    const sequencer = () => {

    };

    const startAndStopSequencer = () => {
        return 1;
    };

    return (
        <div className="flex-col">
            <Parameters
                onResolutionChange={handleResolutionChange}
                MAXRESOLUTION={MAXRESOLUTION}
                startAndStopSequencer={startAndStopSequencer}
            />
            <div className="flex-row flex">
                <PianoRoll handlePlayNote={handlePlayNote} keyNote={keyNote} />
                <Sheet
                    localKey={localKey}
                    addLocalKey={addLocalKey}
                    removeLocalKey={removeLocalKey}
                    keyNote={keyNote}
                    selectedResolution={selectedResolution}
                    handlePlayNote={handlePlayNote}
                />
            </div>

        </div>
    )
};
export default Play;
