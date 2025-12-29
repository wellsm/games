import { type SequenceWordRules, WhichGame } from "@games/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useCreateRoom } from "@/services/game";
import { useSequenceWords } from "@/stores/sequence-words";

const formSchema = z.object({
  howManyWords: z.number().min(3).max(10),
  duration: z.number().min(30).max(300),
  name: z.string().min(2).max(20),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  game: WhichGame;
};

export function CreateRoom({ game }: Props) {
  const { setMe, setMode } = useSequenceWords();
  const { mutateAsync: createRoom } = useCreateRoom<SequenceWordRules>();

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      howManyWords: 5,
      duration: 30,
      name: "",
    },
  });

  async function onSubmit({ name, howManyWords, duration }: FormValues) {
    const room = await createRoom({
      game: WhichGame.SequenceWords,
      name,
      rules: { howManyWords, duration },
    });

    const me = room.players.shift();

    if (!me) {
      return;
    }

    setMode("online");
    setMe(me);

    form.reset();

    navigate({ to: `/${game}/${room.code}` });
  }

  return (
    <form
      className="space-y-6 px-2 py-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <section>
        <div className="flex flex-col gap-4 space-y-2">
          <FieldGroup>
            <Controller
              control={form.control}
              name="howManyWords"
              render={({ field, fieldState }) => (
                <Field
                  className="relative space-y-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="howManyWords">
                    Quantas Palavras
                    <span className="absolute right-0 text-primary">
                      {field.value}
                    </span>
                  </FieldLabel>
                  <Slider
                    defaultValue={[field.value]}
                    id="howManyWords"
                    max={10}
                    min={3}
                    onValueChange={(value) => field.onChange(value)}
                    step={1}
                  />
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
              name="duration"
              render={({ field, fieldState }) => (
                <Field
                  className="relative space-y-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="duration">
                    Duração do Turno
                    <span className="absolute right-0 text-primary">
                      {field.value}
                    </span>
                  </FieldLabel>
                  <Slider
                    defaultValue={[field.value]}
                    id="duration"
                    max={300}
                    min={30}
                    onValueChange={(value) => field.onChange(value)}
                    step={30}
                  />
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
              name="name"
              render={({ field, fieldState }) => (
                <Field
                  className="relative space-y-1"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="name">Seu nome</FieldLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    id="name"
                    minLength={2}
                    required
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </section>
      <Button
        className="w-full"
        disabled={!form.formState.isValid}
        size="xl"
        type="submit"
      >
        <span>Criar Sala</span>
        <HugeiconsIcon icon={PlayIcon} size={24} />
      </Button>
    </form>
  );
}
