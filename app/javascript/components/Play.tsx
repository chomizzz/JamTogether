import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import Parameters from './Parameters';
import PianoRoll from './PianoRoll';
import Sheet from './Sheet';
import Draggable from './Draggable';

const MAXRESOLUTION = 32;

const Play = ({ room, userSlot, userInstrument }) => {
    const synth = new Tone.PolySynth().toDestination();
    const [selectedResolution, setSelectedResolution] = useState(8);
    const keyNote = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"];
    const [localKey, setLocalKey] = useState(new Array(128).fill(null));
    const [sequencerActive, setSequencerActive] = useState(false);
    const [bpm, setBpm] = useState(100);
    // Référence pour accéder à la dernière valeur de localKey
    const localKeyRef = useRef(localKey);

    // Mettre à jour la référence quand localKey change
    useEffect(() => {
        localKeyRef.current = localKey;
    }, [localKey]);

    useEffect(() => {
        Tone.getTransport().bpm.value = bpm;
    }, [bpm]);
    const [sequencer, setSequencer] = useState(null);


    //On regarde si la valeur est présente dans le tableau des localKey 
    const keyExists = useCallback((dataNote: string) => {
        const valueSplit = dataNote.split("-");
        const index = valueSplit[0];
        const note = valueSplit[1];
        const currentLocalKey = localKeyRef.current;

        if (currentLocalKey[index] === null) {
            return false;
        } else if (Array.isArray(currentLocalKey[index])) {
            for (let i = 0; i < currentLocalKey[index].length; i++) {
                if (currentLocalKey[index][i].split("-")[0] === note) {
                    return true;
                }
            }
            return false;
        } else {
            return currentLocalKey[index].split("-")[0] === note;
        }
    }, []);


    const addLocalKey = useCallback((value: string, time: number) => {
        const valueSplit = value.split("-");
        const index = valueSplit[0];
        const note = valueSplit[1];

        setLocalKey((prevLocalKey) => {
            const newArray = [...prevLocalKey];
            if (newArray[index] === null) {
                newArray[index] = [note + "-" + time];
            } else if (Array.isArray(newArray[index])) {
                newArray[index] = [...newArray[index], note + "-" + time];
            } else {
                newArray[index] = [newArray[index], note + "-" + time];
            }
            return newArray;
        });
    }, []);

    const removeLocalKey = useCallback((value: string) => {
        const valueSplit = value.split("-");
        const index = valueSplit[0];

        setLocalKey((prevLocalKey) => {
            if (prevLocalKey[index] !== null) {
                const updateLocalKey = [...prevLocalKey];
                updateLocalKey[index] = null;
                return updateLocalKey;
            }
            return prevLocalKey;
        });
    }, []);

    // permet de monter tone puis de le démonter au moment de quitter la page
    useEffect(() => {
        Tone.start();

        return () => {
            Tone.getTransport().stop();
        };
    }, []);

    const ajustTime = useCallback((closestSize: number, id: string) => {

    }, []);

    // Color la note jouée dans le pianoRoll
    function colorNote(note: string) {
        const element = document.getElementById(note)
        element?.classList.add("highlight");
        setTimeout(() => {
            element?.classList.remove("highlight");
        }, 250);

    }

    function handlePlayNote(note: string) {
        synth.triggerAttackRelease(note, "16n");
        colorNote(note);
    };

    function startAndStopSequencer() {
        // Inverse l'état
        const newState = !sequencerActive;

        if (newState) {
            // Démarrer le séquenceur
            console.log("Séquenceur démarré");
            Tone.start().then(() => {
                const seq = new Tone.Sequence((time, step) => {
                    if (Array.isArray(localKey[step]) && localKey[step] !== null) {
                        localKey[step].forEach(item => {
                            if (item != null) {
                                let noteTime = item.split("-");
                                synth.triggerAttackRelease(noteTime[0], noteTime[1], time);
                                colorNote(noteTime[0]);
                            }
                        });
                    }
                }, [...Array(localKey.length).keys()], "16n");

                // Stocker la référence dans une variable d'état
                setSequencer(seq);

                seq.start(0);
                Tone.getTransport().start();
            });
        } else {
            // Arrêter le séquenceur
            Tone.getTransport().stop();
            sequencer?.stop();
            console.log("Séquenceur arrêté");
        }

        // Mettre à jour l'état après avoir effectué l'action
        setSequencerActive(newState);
    };

    return (
        <div className="flex-col">
            <Parameters
                setSelectedResolution={setSelectedResolution}
                selectedResolution={selectedResolution}
                MAXRESOLUTION={MAXRESOLUTION}
                startAndStopSequencer={startAndStopSequencer}
                sequencerActive={sequencerActive}
                setBpm={setBpm}
                bpm={bpm}
            />
            <div className="flex-row flex">
                <PianoRoll handlePlayNote={handlePlayNote} keyNote={keyNote} />
                <Sheet
                    addLocalKey={addLocalKey}
                    removeLocalKey={removeLocalKey}
                    keyExists={keyExists}
                    keyNote={keyNote}
                    selectedResolution={selectedResolution}
                    handlePlayNote={handlePlayNote}
                    MAXRESOLUTION={MAXRESOLUTION}
                />
            </div>
        </div>
    )
};
export default Play;

