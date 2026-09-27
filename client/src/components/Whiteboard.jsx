import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";

// Collaborative whiteboard. Only stroke coordinates are sent over Socket.io,
// never a full canvas image, so it stays lightweight even with many users.
export default function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);
  const [tool, setTool] = useState("brush"); // brush | eraser
  const [color, setColor] = useState("#43E6A5");
  const [lineWidth, setLineWidth] = useState(3);

  const getContext = () => canvasRef.current.getContext("2d");

  const drawLine = (ctx, { startX, startY, endX, endY, color, lineWidth, tool }) => {
    ctx.strokeStyle = tool === "eraser" ? "#06110D" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 6 : lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      getContext().scale(ratio, ratio);
    };
    resize();

    socket.on("whiteboard-draw", (stroke) => drawLine(getContext(), stroke));
    socket.on("whiteboard-clear", () => {
      const ctx = getContext();
      ctx.fillStyle = "#06110D";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("whiteboard-draw");
      socket.off("whiteboard-clear");
    };
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const handleStart = (e) => {
    drawing.current = true;
    lastPoint.current = getPos(e);
  };

  const handleMove = (e) => {
    if (!drawing.current) return;
    const point = getPos(e);
    const stroke = {
      startX: lastPoint.current.x, startY: lastPoint.current.y,
      endX: point.x, endY: point.y,
      color, lineWidth, tool,
    };
    drawLine(getContext(), stroke);
    socket.emit("whiteboard-draw", { roomId, stroke });
    lastPoint.current = point;
  };

  const handleEnd = () => { drawing.current = false; };

  const clearBoard = () => {
    const ctx = getContext();
    ctx.fillStyle = "#06110D";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit("whiteboard-clear", { roomId });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", gap: 8, padding: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button className={tool === "brush" ? "btn-primary" : "btn-secondary"} onClick={() => setTool("brush")}>Brush</button>
        <button className={tool === "eraser" ? "btn-primary" : "btn-secondary"} onClick={() => setTool("eraser")}>Eraser</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="12" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <button className="btn-secondary" onClick={clearBoard}>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ flex: 1, width: "100%", background: "#06110D", borderRadius: 10, touchAction: "none" }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
}
