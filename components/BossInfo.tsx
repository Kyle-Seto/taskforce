import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface BossInfoProps {
  name: string;
  subtitle: string; // New prop for the subtitle
  currentHp: number;
  maxHp: number;
  imageUrl: string;
}

export function BossInfo({ name, subtitle, currentHp, maxHp, imageUrl }: BossInfoProps) {
  const healthPercentage = (currentHp / maxHp) * 100;

  return (
    <div className="card overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-red-800 shadow-lg">
      <div className="relative h-80 sm:h-96 md:h-[28rem]">
        <Image
          src={imageUrl}
          alt={`Boss: ${name}`}
          layout="fill"
          objectFit="cover"
          className="opacity-80 transition-all duration-1000 hover:scale-105 hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h2 className="text-4xl font-bold text-red-500 drop-shadow-glow">{name}</h2>
          <p className="text-xl text-gray-300 mt-2">{subtitle}</p>
        </div>
      </div>
      <div className="card-content bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-lg font-semibold text-red-400">HP</span>
          <span className="text-lg font-bold text-red-300">{currentHp} / {maxHp}</span>
        </div>
        <Progress 
          value={healthPercentage} 
          className="h-7 bg-gray-700" 
        >
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-in-out"
            style={{ width: `${healthPercentage}%` }}
          />
        </Progress>
      </div>
    </div>
  );
}