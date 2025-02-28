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
    const [localKey, setLocalKey] = useState(new Array(128).fill(null));
    const [valueInserted, setValueInserted] = useState(false); // État pour savoir si une valeur a été insérée
    const [sequencerActive, setSequencerActive] = useState(false);
    let BPM = 60;
    let index = 0;
    let intervalId


    const keyExists = (dataNote) => {
        let valueSplit = dataNote.split("-");
        let index = parseInt(valueSplit[1], 2);

        if (localKey[index] === null) {
            console.log(false);
            return false;
        } else if (Array.isArray(localKey[index])) {
            for (let i = 0; i < localKey[index].length; i++) {
                if (localKey[index][i] === valueSplit[2]) {
                    console.log(true);
                    return true;
                }
            }
            console.log(false);
            return false;
        } else {
            if (localKey[index] === valueSplit[2]) {
                console.log(true);
                return true;
            } else {
                console.log(false);
                return false;
            }
        }
    }


    const addLocalKey = (value) => {
        let valueSplit = value.split("-");
        let index = parseInt(valueSplit[1], 2);


        setLocalKey((prevLocalKey) => {
            const newArray = [...prevLocalKey];
            let valueWasInserted = false;

            console.log(newArray[index]);
            console.log(valueSplit[2]);

            switch (parseInt(valueSplit[0], 10)) {
                case 0:
                    if (newArray[index] !== valueSplit[2]) {
                        if (Array.isArray(newArray[index])) {
                            newArray[index].push(valueSplit[2]);
                        } else if (newArray[index] !== null) {
                            newArray[index] = [newArray[index], valueSplit[2]];
                        } else {
                            // Si l'index est null, on remplace par la seule valeur
                            newArray[index] = [valueSplit[2]];
                        }
                    }
                    break;
                case 1:
                    if (newArray[31 + index] !== valueSplit[2]) {
                        if (Array.isArray(newArray[31 + index])) {
                            newArray[31 + index].push(valueSplit[2]);
                        } else {
                            newArray[31 + index] = [newArray[31 + index], valueSplit[2]];
                        }
                    }
                    break;
                case 2:
                    if (newArray[63 + index] !== valueSplit[2]) {
                        if (Array.isArray(newArray[63 + index])) {
                            newArray[63 + index].push(valueSplit[2]);
                        } else {
                            newArray[63 + index] = [newArray[63 + index], valueSplit[2]];
                        }
                    }
                    break;
                case 3:
                    if (newArray[95 + index] !== valueSplit[2]) {
                        if (Array.isArray(newArray[95 + index])) {
                            newArray[95 + index].push(valueSplit[2]);
                        } else {
                            newArray[95 + index] = [newArray[95 + index], valueSplit[2]];
                        }
                    }
                    break;
                default:
                    break;
            }
            return newArray;
        });
        console.log(localKey);
    }

    const removeLocalKey = (value) => {
        const valueSplit = value.split("-");
        const index = parseInt(valueSplit[1], 2);
        if (localKey[index] !== null) {
            const updateLocalKey = [...localKey]
            updateLocalKey[index] = null;
            setLocalKey(updateLocalKey);
            return true;
        } else {
            return false
        }
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

    const sequencer = (playOrStop) => {
        if (playOrStop) {
            intervalId = setInterval(readHash, 300); // 300 ms pour chaque pulsation
            console.log("Séquenceur démarré");
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                console.log("Séquenceur arrêté");
            }
        }
    };


    function readHash() {
        handlePlayNote(localKey[index]); // Joue la note correspondante
        index++;
        if (index >= localKey.length) {
            index = 0; // Si on arrive à la fin du tableau, on recommence depuis le début
        }
    }
    const startAndStopSequencer = () => {
        setSequencerActive(!sequencerActive);
        sequencer(sequencerActive);
    };

    return (
        <div className="flex-col">
            <Parameters
                onResolutionChange={handleResolutionChange}
                MAXRESOLUTION={MAXRESOLUTION}
                startAndStopSequencer={startAndStopSequencer}
                sequencerActive={sequencerActive}
            />
            <div className="flex-row flex">
                <PianoRoll handlePlayNote={handlePlayNote} keyNote={keyNote} />
                <Sheet
                    localKey={localKey}
                    addLocalKey={addLocalKey}
                    removeLocalKey={removeLocalKey}
                    keyExists={keyExists}
                    keyNote={keyNote}
                    selectedResolution={selectedResolution}
                    handlePlayNote={handlePlayNote}
                />
            </div>

        </div>
    )
};
export default Play;
