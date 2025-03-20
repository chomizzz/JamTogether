import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import Parameters from './Parameters';
import PianoRoll from './PianoRoll';
import Sheet from './Sheet';

const MAXRESOLUTION = 32;

const Play = ({ room, userSlot, userInstrument }) => {
    const synth = new Tone.PolySynth().toDestination();
    const [selectedResolution, setSelectedResolution] = useState(8);
    const keyNote = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"];
    const getNoteWidth = (noteDuration, resolution) => {
        return noteDuration / resolution;
    };
    const [localKey, setLocalKey] = useState(new Array(128).fill(null));
    const [valueInserted, setValueInserted] = useState(false); // État pour savoir si une valeur a été insérée
    const [sequencerActive, setSequencerActive] = useState(false);
    const [bpm, setBpm] = useState(100);
    useEffect(() => {
        Tone.getTransport().bpm.value = bpm;
    }, [bpm]);
    const [sequencer, setSequencer] = useState(null);



    function keyExists(dataNote) {
        let valueSplit = dataNote.split("-");
        let index = valueSplit[0];
        let note = valueSplit[1];

        if (localKey[index] === null) {
            console.log(false);
            return false;
        } else if (Array.isArray(localKey[index])) {
            for (let i = 0; i < localKey[index].length; i++) {
                if (localKey[index][i].split("-")[0] === note) {
                    console.log(true);
                    return true;
                }
            }
            console.log(false);
            return false;
        } else {
            if (localKey[index].split("-")[0] === note) {
                console.log(true);
                return true;
            } else {
                console.log(false);
                return false;
            }
        }
    }


    function addLocalKey(value, time) {
        let valueSplit = value.split("-");
        let index = valueSplit[0];
        let note = valueSplit[1];


        setLocalKey((prevLocalKey) => {
            const newArray = [...prevLocalKey];
            let valueWasInserted = false;

            if (newArray[index] === null) {
                newArray[index] = [note + "-" + time];
                valueWasInserted = true;
            } else if (Array.isArray(newArray[index])) {
                newArray[index].push(note + "-" + time);
                valueWasInserted = true;
            } else {
                valueWasInserted = false;
            }

            return newArray;
        });
        console.log(localKey);
    }

    function removeLocalKey(value) {
        let valueSplit = value.split("-");
        let index = valueSplit[0];

        if (localKey[index] !== null) {
            const updateLocalKey = [...localKey]
            updateLocalKey[index] = null;
            setLocalKey(updateLocalKey);
            return true;
        } else {
            return false
        }
    }
    // permet de monter tone puis de le démonter au moment de quitter la page
    useEffect(() => {
        Tone.start();

        return () => {
            Tone.getTransport().stop();
        };
    }, []);

    function colorNote(note) {
        const element = document.getElementById(note)
        element?.classList.add("highlight");
        setTimeout(() => {
            element?.classList.remove("highlight");
        }, 250);

    }

    function handlePlayNote(note) {
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
