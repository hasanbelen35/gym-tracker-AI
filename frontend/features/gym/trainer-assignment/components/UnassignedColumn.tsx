import React from 'react';
import { UnassignedColumnProps } from '@/features/gym/trainer-assignment/types';


export const UnassignedColumn: React.FC<UnassignedColumnProps> = ({ members }) => {
    return (
        <div className="w-1/3 border p-4 rounded-xl shadow-sm bg-white">
            
            {/* COLUMN HEADER */}
            <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">
                Boştaki Sporcular
            </h3>
            
            {/* COLUMN CONTENT */}
            <div className="flex flex-col gap-2">
                {members.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Boşta sporcu bulunmuyor.</p>
                ) : (
                    members.map((m) => (
                        <div
                            key={m.publicId}
                            className="px-4 py-3 border rounded-xl text-gray-700 font-medium shadow-sm bg-gray-50/50"
                        >
                            {m.name} {m.surname}
                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
};