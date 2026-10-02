import React from 'react';
import { AssignedColumnProps } from '@/features/gym/trainer-assignment/types';

export const AssignedColumn: React.FC<AssignedColumnProps> = ({ members }) => {
    return (
        <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-green-50/40">

            {/* COLUMN HEADER */}
            <h3 className="font-bold text-lg mb-4 text-green-800 border-b border-green-200 pb-2">
                Onaylı Sporcular
            </h3>

            {/* COLUMN CONTENT */}
            <div className="flex flex-col gap-2">
                {members.length === 0 ? (
                    <p className="text-green-600/60 text-sm italic">Henüz onaylı sporcu yok.</p>
                ) : (
                    members.map((m) => (
                        <div
                            key={m.publicId}
                            className="px-4 py-3 border border-green-200 bg-white rounded-xl text-gray-700 font-medium shadow-sm"
                        >
                            {m.name} {m.surname}
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};