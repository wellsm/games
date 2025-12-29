import {
  HatGlassesIcon,
  type LucideIcon,
  type LucideProps,
  SignatureIcon,
} from "lucide-react";

export const ICONS = {
  signature: SignatureIcon,
  "hat-glasses": HatGlassesIcon,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type Props = LucideProps & {
  name: IconName;
};

export function Icon({ name, ...props }: Props) {
  const I = ICONS[name];
  return <I {...props} />;
}
