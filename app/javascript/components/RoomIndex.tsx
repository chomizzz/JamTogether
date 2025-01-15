import PropTypes from 'prop-types';
import React, { useState } from 'react';

const RoomIndex = ({ room, roomId, roomPath, joinRoomPath, userAdmin , userAdminPseudo}) => {

    return (
        <table className="table-auto w-full border-separate border-4 border-slate-500">
            <thead>
            <tr>
                <th id="ici" className="border border-slate-600 border-2">Leader</th>
                <th className="border border-slate-600 border-2">Room Name</th>
                <th className="border border-slate-600 border-2">Style</th>
                <th className="border border-slate-600 border-2">Max Player</th>
                <th className="border border-slate-600 border-2">Action</th>
            </tr>
            </thead>
            <tbody className="text-center text-white">
                <tr key={room.id}> {/* Ajouter une clé unique ici pour chaque ligne */}
                    <td className="border border-slate-600 border-2">
                        {userAdminPseudo}
                    </td>
                    <td className="border border-slate-600 border-2">
                        {room.name}
                    </td>
                    <td className="border border-slate-600 border-2">
                        {room.style}
                    </td>
                    <td className="border border-slate-600 border-2">
                        {room.maxPlayer}
                    </td>
                    <td className="flex border border-slate-600 border-2 justify-around">
                        <div>
                            <div>
                                <a href={roomPath}
                                    className="flex rounded my-1 px-2 py-0.5 bg-blue-300 text-black hover:bg-blue-50">
                                    Spectate
                                </a>
                            </div>
                            <div>
                                <a href={joinRoomPath}
                                    className="flex rounded my-1 px-2 py-0.5 bg-gray-700 text-black hover:bg-gray-500">
                                    Join
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};



export default RoomIndex;
