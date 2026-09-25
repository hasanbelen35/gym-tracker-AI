import { Member } from "@/types/types";
import { ComponentType } from "react";

export interface AvatarProps {
    name: string;
    surname: string;
};

export interface MemberCardProps {
    member: Member;
    step: string;
    onRequest: (publicId: string) => void;
    onCancel: (publicId: string) => void;
};


export interface Stage {
    step: string;
    title: string;
};
export interface PipelineStripProps {
    stages: Stage[];
};

export interface StageColumnProps {
    stage: {
        step: string;
        title: string;
        subtitle: string;
        emptyText: string;
        members: Member[];
        icon: ComponentType<{ className?: string }>;
    };
    loading: boolean;
    onRequest: (id: string) => void;
    onCancel: (id: string) => void;
};