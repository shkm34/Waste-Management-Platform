import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

//custom hook to use auth context any component

export const useAuth = ()=>{
    const context = useContext(AuthContext)

    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}