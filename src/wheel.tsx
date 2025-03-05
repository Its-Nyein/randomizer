import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { capitalize } from './utils';

const colors = [
  '#CC4629',
  '#CC9A29',
  '#B2CC29',
  '#5ECC29',
  '#29CC46',
  '#29CC99',
  '#2985CC',
  '#293FCC',
  '#4629CC',
  '#9929CC',
  '#CC2981',
  '#CC2929',
  '#CC5929',
  '#CC9529',
  '#B2CC29',
  '#66CC29',
  '#29CC5F',
  '#29CC91',
  '#298ECC',
  '#4A29CC',
  '#8429CC',
  '#CC298F',
  '#CC294F',
];

interface Props {
  participants: string[];
}

export const Wheel: React.FC<Props> = ({ participants }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDirection, setSpinDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [showPopup, setShowPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numSectors = participants.length;

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel();
    }
  }, [participants, rotation]);

  const darkenColor = (color: string, amount: number): string => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / numSectors;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);
    ctx.rotate(-rotation * (Math.PI / 180));

    // Draw sectors
    for (let i = 0; i < numSectors; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      const color = darkenColor(colors[i % colors.length], 30);
      ctx.fillStyle = color;
      ctx.fill();

      // Add radial lines (dividers)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
      ctx.strokeStyle = '#ffffff'; // Change the color of the dividers
      ctx.lineWidth = 2; // Adjust the thickness
      ctx.stroke();

      // Draw the name in the sector
      ctx.save();
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = '18px Karla';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.fillText(capitalize(participants[i]) || '', radius * 0.5, 0);
      ctx.restore();
    }

    ctx.rotate(rotation * (Math.PI / 180)); // Reset rotation
    ctx.translate(-radius, -radius);

    // Draw the static indicator
    const indicatorLength = 30; // Adjust the length of the indicator
    const indicatorWidth = 20;  // Adjust the width of the indicator

    ctx.save();

    // Keep the position unchanged but refine the triangle shape
    ctx.translate(canvas.width, canvas.height / 2); // Keeping the original position (middle-right of the wheel)

    // Draw the triangle indicator
    ctx.beginPath();
    ctx.moveTo(0, -indicatorWidth / 2); // Right point of the triangle (base)
    ctx.lineTo(-indicatorLength, 0); // Left point of the triangle (tip)
    ctx.lineTo(0, indicatorWidth / 2); // Right point of the triangle (base)
    ctx.closePath();

    // Styling the indicator with improved design
    ctx.fillStyle = '#FF5733'; // Set the fill color to a bright shade for visibility
    ctx.fill();

    // Optional: Add shadow to make the indicator stand out more
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;

    ctx.restore();

  };

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Set the number of full rotations and calculate final rotation
    const numFullRotations = Math.random() * 5 + 5; // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;
    const easing = (t: number) => {
      // Ease-out cubic
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / spinDuration, 1);
      const easeT = easing(t);
      const currentRotation =
        rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation) *
          easeT;

      setRotation(currentRotation);

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalRotation: number) => {
    const sliceAngle = 360 / numSectors;
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    const winningSector = Math.floor(normalizedRotation / sliceAngle);

    setPopupWinner(participants[winningSector]);
    setShowPopup(true);
  };

  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === 'clockwise' ? 'counterclockwise' : 'clockwise',
    );
  };

  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-full border-2 border-[#01b4e4]"
      />
      <button
        onClick={startSpin}
        disabled={participants.length === 0 || spinning}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full flex items-center justify-center"
      >
        Spin
      </button>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={changeSpinDirection}
          disabled={participants.length === 0 || spinning}
          className="px-6 py-3 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          {capitalize(spinDirection)}
        </button>
      </div>
      {showPopup && popupWinner && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-green-700 p-6 rounded-lg shadow-lg text-center z-10 animate-pop-in">
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <h3 className="text-xl">{capitalize(popupWinner)}</h3>
        </div>
      )}
    </div>
  );
};
