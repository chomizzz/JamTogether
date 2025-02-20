import React, {useEffect, useState} from 'react';
import * as Tone from 'tone';

const Play = ({ room, userSlot, userInstrument }) => {
    const synth = new Tone.Synth().toDestination();

    useEffect(() => {
        Tone.start();

        return () => {
            Tone.Transport.stop();
        };
    }, []);

    const handlePlayNote = () => {
        synth.triggerAttackRelease("C4", "8n");
    };

    return (
        <div className={"text-white"}>
            <div>Ca fonctionne</div>
            <button onClick={handlePlayNote}>Play Note</button>
        </div>


    )

}
export default Play;
