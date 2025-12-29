import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const COLORS: Record<number, string> = {
  0: "bg-red-500",
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-yellow-500",
  4: "bg-purple-500",
  5: "bg-pink-500",
  6: "bg-indigo-500",
  7: "bg-teal-500",
  8: "bg-orange-500",
  9: "bg-cyan-500",
  10: "bg-emerald-500",
  11: "bg-rose-500",
  12: "bg-lime-500",
  13: "bg-sky-500",
  14: "bg-violet-500",
};

type Props = {
  index: number;
  name: string;
};

export function PlayerChip({ index, name }: Props) {
  return (
    <div className="group fade-in zoom-in flex animate-in items-center gap-x-2 rounded-full border border-gray-200 bg-surface-light py-1 pr-2 pl-4 shadow-sm transition-all duration-300 hover:border-primary/50 dark:border-[#3d2c52] dark:bg-surface-dark">
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full font-bold text-[10px] text-white",
          COLORS[index]
        )}
      >
        {name.at(0)}
      </div>
      <span className="cursor-pointer select-none font-medium text-gray-900 text-sm leading-normal dark:text-white">
        {name}
      </span>
      <Button size="icon" variant="ghost">
        <HugeiconsIcon icon={Cancel01Icon} />
      </Button>
    </div>
  );
}
