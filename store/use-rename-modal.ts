import { create } from "zustand";

const defaultValues={
    id:"",
    title:""
};

interface IRenameModal{
    isOpen:boolean;
    initalValues:typeof defaultValues;
    onOpen:(id:string,title:string)=>void;
    onClose:()=>void;
}

export const UseRenameModal=create<IRenameModal>((set)=>({
    isOpen:false,
    onOpen:(id,title)=>set({
        isOpen:true,
        initalValues:{id,title},
    }),
    onClose:()=>set({
        isOpen:false,
        initalValues:defaultValues
    }),
    initalValues:defaultValues
}));