import { useEffect, useRef } from "react";
import { useSocket } from "./SocketContext";

/**
 * Hook to listen to socket events with automatic cleanup
 * 
 * @param eventName - Name of the event to listen to
 * @param handler - Function to call when event is received
 */

export const useSocketEvent = (
    eventName: string,
    handler: (data: any) => void): void => {
    const socket = useSocket()
    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        // if no socket, do nothing
        if (!socket) {
            return
        }

        // wrapper function for handler
        const eventHandler = (data: any) => {
            handlerRef.current(data)
        }

        // register listener
        socket.on(eventName, eventHandler)

        // cleanup-remove listner on unmount
        return () => {
            socket.off(eventName, eventHandler)
        }
    }, [socket, eventName])
}