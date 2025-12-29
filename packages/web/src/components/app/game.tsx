import { LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { Activity } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Icon, type IconName } from "./icon";

type Props = {
  title: string;
  description: string;
  slug: string;
  icon?: IconName;
  available?: boolean;
};

export function Game({
  title,
  description,
  icon,
  available = true,
  slug,
}: Props) {
  const navigate = useNavigate();

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-light shadow-lg shadow-primary/5 transition-all hover:shadow-primary/10",
        !available && "opacity-60"
      )}
    >
      {icon ? (
        <div className="relative flex h-40 items-center justify-center border-b bg-foreground/50">
          <div className="flex items-center justify-center rounded-full p-2">
            <Icon className="size-18" name={icon} />
          </div>

          <Activity mode={available ? "hidden" : "visible"}>
            <div className="absolute flex h-full w-full items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 font-bold text-foreground text-sm shadow-xl backdrop-blur-md">
                <HugeiconsIcon icon={LockIcon} />
                <span>Em desenvolvimento</span>
              </div>
            </div>
          </Activity>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-xl leading-tight tracking-tight">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between bg-background">
          <div>
            <Activity mode={available ? "hidden" : "visible"}>
              <Badge
                className="bg-slate-300 px-4 py-4 font-semibold text-base text-muted-foreground opacity-50"
                variant="secondary"
              >
                Em breve
              </Badge>
            </Activity>
          </div>
          <Button
            disabled={!available}
            onClick={() => navigate({ to: `/${slug}` })}
            size="lg"
          >
            Jogar
          </Button>
        </div>
      </div>
    </article>
  );
}
