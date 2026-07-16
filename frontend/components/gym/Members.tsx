"use client";
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllMembers } from "@/store/slices/gymSlice";

const Members = () => {
  const dispatch = useAppDispatch();
  const { members, membersLoading, membersError } = useAppSelector((state) => state.gym);

  useEffect(() => {
    if (!members || members.length === 0) {
      dispatch(fetchAllMembers());
    }
  }, [dispatch, members]);

  if (membersLoading) return <p>Yükleniyor...</p>;
  if (membersError) return <p className="text-red-500">{membersError}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Üyeler</h2>

      {(!members || members.length === 0) ? (
        <p className="text-gray-500">Kayıtlı üye bulunamadı.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Ad</th>
                <th className="px-4 py-3">Soyad</th>
                <th className="px-4 py-3">E-posta</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {members.map((member: any) => (
                <tr key={member.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.surname}</td>
                  <td className="px-4 py-3">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Members