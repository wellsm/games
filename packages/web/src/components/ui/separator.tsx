import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

type Props = SeparatorPrimitive.Props & {
  text?: string;
};

function Separator({
  text,
  className,
  orientation = "horizontal",
  ...props
}: Props) {
  return (
    <SeparatorPrimitive
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      data-slot="separator"
      orientation={orientation}
      {...props}
    >
      <div className="relative flex w-full items-center justify-center">
        <span className="-top-2.5 absolute bg-background px-2 font-bold">
          {text}
        </span>
      </div>
    </SeparatorPrimitive>
  );
}

export { Separator };
