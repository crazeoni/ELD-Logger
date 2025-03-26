import React, { useRef, useEffect, useCallback } from "react";

const LogSheetCanvas = ({ logData, fuelStops, restStops, tripDistance, totalDriveHours }) => {
  const canvasRef = useRef(null);

  const drawLogEntries = useCallback((ctx, logData) => {
    console.log("🎨 Drawing logs:", logData);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    let prevX = null;
    let prevY = null;

    logData.forEach(({ start_hour, end_hour, status }) => {
      const startX = 100 + start_hour * 50;
      const endX = 100 + end_hour * 50;
      const statusY = getStatusY(status);

      console.log(`🖊️ Drawing from ${startX}px to ${endX}px at ${statusY}px`);

      ctx.beginPath();
      if (prevX !== null && prevY !== null) {
        ctx.moveTo(prevX, prevY);
      } else {
        ctx.moveTo(startX, statusY);
      }
      ctx.lineTo(startX, statusY);
      ctx.lineTo(endX, statusY);
      ctx.stroke();

      prevX = endX;
      prevY = statusY;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";

    const centerX = canvas.width / 2;
    const infoY = 25;

    ctx.fillText(`Trip Distance: ${tripDistance} miles`, centerX - 300, infoY);
    ctx.fillText(`Total Drive Hours: ${totalDriveHours} hours`, centerX + 300, infoY);
    ctx.fillText(`Fuel Stops: ${fuelStops}`, centerX - 300, infoY + 20);
    ctx.fillText(`Rest Stops: ${restStops}`, centerX + 300, infoY + 20);

    drawGrid(ctx);

    if (logData.length > 0) {
      drawLogEntries(ctx, logData);
    }
  }, [logData, drawLogEntries, fuelStops, restStops, tripDistance, totalDriveHours]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";

    const startX = 100;
    const startY = 120;
    const rowHeight = 50;
    const colWidth = 50;
    const numRows = 4;
    const numCols = 24;

    for (let i = 0; i <= numRows; i++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY + i * rowHeight);
      ctx.lineTo(startX + numCols * colWidth, startY + i * rowHeight);
      ctx.stroke();
    }

    for (let j = 0; j <= numCols; j++) {
      ctx.beginPath();
      ctx.moveTo(startX + j * colWidth, startY);
      ctx.lineTo(startX + j * colWidth, startY + numRows * rowHeight);
      ctx.stroke();

      ctx.fillText(j, startX + j * colWidth + 10, startY - 5);
    }

    // ✅ Properly Aligned & Split Labels
    ctx.fillText("Off Duty", 60, startY + rowHeight / 2);
    
    // ✅ Split "Sleeper Berth" into two lines
    ctx.fillText("Sleeper", 60, startY + 1.3 * rowHeight);
    ctx.fillText("Berth", 60, startY + 1.7 * rowHeight);

    ctx.fillText("Driving", 60, startY + 2.5 * rowHeight);
    
    // ✅ Split "On Duty (not driving)" into two lines
    ctx.fillText("On Duty", 85, startY + 3.3 * rowHeight);
    ctx.fillText("(not driving)", 85, startY + 3.7 * rowHeight);
  };

  const getStatusY = (status) => {
    const startY = 120;
    const rowHeight = 50;

    switch (status) {
      case "Off Duty":
        return startY + rowHeight * 0.5;
      case "Sleeper":
      case "Berth":
        return startY + rowHeight * 1.5;
      case "Driving":
        return startY + rowHeight * 2.5;
      case "On Duty":
      case "(not driving)":
        return startY + rowHeight * 3.5;
      default:
        return startY + rowHeight * 0.5;
    }
  };

  return <canvas ref={canvasRef} width={1350} height={400} style={{ border: "3px solid transparent", padding: "15px" }} />;
};

export default LogSheetCanvas;






