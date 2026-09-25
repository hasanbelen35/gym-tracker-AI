import React from "react";
import {AvatarProps} from '@/features/trainer/athlete-assignment/types'

export const Avatar: React.FC<AvatarProps> = ({ name, surname }) => (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-nav-border bg-(--background) text-xs font-black uppercase text-(--foreground)/70">
        {name?.[0]}{surname?.[0]}
    </span>
);