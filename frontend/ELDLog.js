import React, { useRef } from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

const ELDLog = () => {
  const stageRef = useRef(null); // Reference to the canvas stage

  // Function to export the log sheet as a PDF
  const generateELDPDF = () => {
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    // Title
    doc.fontSize(20).text("Driver's Daily Log", 100, 50);

    // Draw log sheet box
    doc.rect(50, 100, 500, 300).stroke();

    // Example: Adding a sample line for driving logs
    doc.moveTo(60, 150).lineTo(300, 150).stroke();

    // Finish and open PDF in a new tab
    doc.end();
    stream.on("finish", function () {
      const url = stream.toBlobURL("application/pdf");
      window.open(url);
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mt-4">ELD Log Sheet</h2>

      {/* Interactive Canvas Log */}
      <Stage ref={stageRef} width={800} height={400}>
        <Layer>
          <Text text="Driver's Daily Log" x={20} y={20} fontSize={20} />
          <Rect x={20} y={50} width={760} height={300} stroke="black" />
          <Line points={[30, 100, 300, 100]} stroke="blue" strokeWidth={2} />
        </Layer>
      </Stage>

      {/* Button to Export PDF */}
      <button
        onClick={generateELDPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Export to PDF
      </button>
    </div>
  );
};

export default ELDLog;
