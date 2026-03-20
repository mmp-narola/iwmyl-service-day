import { cn } from "../../../lib/utils";

const GreenLoader = ({ label = "Mowing your lawn...", className = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div
        className={cn(
          `w-12 h-12 border-4 border-green-600 border-dashed rounded-full animate-spin-slow`,
          className,
        )}
      ></div>
      <p className="text-green-700 text-sm font-medium"> {label}</p>
    </div>
  );
};

export default GreenLoader;
