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
    const [localKey, setLocalKey] = useState(new Array(128).fill(null));
    const [sequencerActive, setSequencerActive] = useState(false);
    const [bpm, setBpm] = useState(100);
    useEffect(() => {
        Tone.getTransport().bpm.value = bpm;
    }, [bpm]);
    const [sequencer, setSequencer] = useState(null);


    //On regarde si la valeur est présente dans le tableau des localKey 
    function keyExists(dataNote: string) {
        let valueSplit = dataNote.split("-");
        let index = valueSplit[0];
        let note = valueSplit[1];

        if (localKey[index] === null) {
            return false;
        } else if (Array.isArray(localKey[index])) {
            for (let i = 0; i < localKey[index].length; i++) {
                if (localKey[index][i].split("-")[0] === note) {
                    return true;
                }
            }
            return false;
        } else {
            if (localKey[index].split("-")[0] === note) {
                return true;
            } else {
                return false;
            }
        }
    }


    function addLocalKey(value: string, time: string) {
        let valueSplit = value.split("-");
        let index = valueSplit[0];
        let note = valueSplit[1];


        setLocalKey((prevLocalKey) => {
            const newArray = [...prevLocalKey];
            if (newArray[index] === null) {
                newArray[index] = [note + "-" + time];
            } else if (Array.isArray(newArray[index])) {
                newArray[index].push(note + "-" + time);
            }
            return newArray;
        });
    }

    function removeLocalKey(value) {
        let valueSplit = value.split("-");
        let index = valueSplit[0];

        if (localKey[index] !== null) {
            const updateLocalKey = [...localKey]
            updateLocalKey[index] = null;
            setLocalKey(updateLocalKey);
        }
    }

    // permet de monter tone puis de le démonter au moment de quitter la page
    useEffect(() => {
        Tone.start();

        return () => {
            Tone.getTransport().stop();
        };
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
            <div id="caca" className="flex w-full h-40">
                <div className="block min-w-[70px] bg-pink-700 your-element" />
            </div>

        </div>
    )
};
export default Play;
