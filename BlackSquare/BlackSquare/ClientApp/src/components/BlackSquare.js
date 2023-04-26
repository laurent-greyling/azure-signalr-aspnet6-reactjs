import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

function Square() {
    const [connection, setConnection] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const [id, setId] = useState(null);
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("/move", {
                negotiateVersion: 2,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("SignalR connection established.");

                    connection.on("move", (x, y) => {
                        console.log("Received new position:", x, y);
                        setPosition({ x, y });
                    });
                })
                .catch((err) => console.error(err));
        }
    }, [connection, id]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.fillRect(position.x, position.y, 50, 50);
    }, [position]);

    const handleMouseMove = (event) => {
        if (moving && connection) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            setPosition({ x, y });

            console.log("Sending new position:", x, y);
            connection.send("move", x, y, id);
        }
    };

    const handleMouseDown = () => {
        setMoving(true);
    };

    const handleMouseUp = () => {
        setMoving(false);
    };

    const handleIdChange = (event) => {
        setId(event.target.value);
    };

    return (
        <div>
            <input type="text" value={id} onChange={handleIdChange} />
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
}

export default Square;
