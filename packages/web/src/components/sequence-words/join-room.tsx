import { WhichGame } from "@games/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { GridIcon, Login01Icon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useJoinRoom } from "@/services/game";
import { useSequenceWords } from "@/stores/sequence-words";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(2).max(20),
  room: z.string().min(6).max(6),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  code?: string;
};

export function JoinRoom({ code }: Props) {
  const { setMode } = useSequenceWords();
  const { mutateAsync: joinRoom } = useJoinRoom();

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      room: code,
    },
  });

  async function onSubmit(values: FormValues) {
    const room = await joinRoom({
      game: WhichGame.SequenceWords,
      ...values,
    });

    const me = room.players.find((p) => p.is_owner === false);

    if (!me) {
      return;
    }

    setMode("online");

    form.reset();

    navigate({ to: `/sequence-words/${room.code}`, replace: true });
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="relative" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Seu nome</FieldLabel>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HugeiconsIcon
                    className="text-foreground"
                    icon={User02Icon}
                    size={24}
                    strokeWidth={2}
                  />
                </div>
                <Input
                  {...field}
                  autoComplete="off"
                  className="pl-12"
                  minLength={2}
                  required
                />
              </div>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="room"
          render={({ field, fieldState }) => (
            <Field className="relative" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="room">Código da sala</FieldLabel>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HugeiconsIcon
                    className="text-foreground"
                    icon={GridIcon}
                    size={24}
                    strokeWidth={2}
                  />
                </div>
                <Input
                  {...field}
                  autoComplete="off"
                  className="pl-12"
                  minLength={6}
                  placeholder="#XYZ123"
                  required
                />
              </div>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        className="w-full"
        disabled={!form.formState.isValid}
        size="xl"
        type="submit"
      >
        <span>Entrar na Sala</span>
        <HugeiconsIcon icon={Login01Icon} size={24} strokeWidth={2} />
      </Button>
    </form>
  );
}
