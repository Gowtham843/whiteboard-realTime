"use client"

import { Renamemodal } from "@/components/modals/rename-modal";
import { useEffect, useState } from "react";

export const ModelProvider = () =>{
    const [isMounted, setisMounted] = useState(false);

    useEffect(()=>{
        setisMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }
    return(
        <>
        <Renamemodal/>
        </>
    )
}