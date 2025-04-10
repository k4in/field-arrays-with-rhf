import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { z } from 'zod';
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { delay } from '@/lib/utils/delay';
import { fruitOptions, type FruitOptions } from '@/config/constants/select-options';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/shadcn/form';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Textarea } from '@/components/shadcn/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';

const formQueryOptions = queryOptions<FruitOptions>({
  queryKey: ['form'],
  queryFn: async () => {
    await delay(1111);
    return fruitOptions;
  },
});

export const Route = createFileRoute('/')({
  //@ts-expect-error CLEAN!! queryClient type is not recognized in the context
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData<FruitOptions>(formQueryOptions),
  component: Index,
});

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  fruit: z.string().min(1, 'Fruit is required'),
  vegetables: z
    .array(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('vegetable'),
          vegetableName: z.string().min(1),
          color: z.string().min(1),
          length: z.coerce.number().min(0.1).optional(),
        }),
        z.object({
          type: z.literal('fruit'),
          fruitName: z.string().min(1),
          amount: z.coerce.number().min(1),
        }),
      ])
    )
    .min(1, 'At least one vegetable fruit or vegetable must be defined'),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function VegetableRow({ index, isPending }: { index: number; isPending: boolean }) {
  return (
    <>
      <FormField
        // control={methods.control}
        name={`vegetables.${index}.vegetableName`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input type="text" {...field} disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // control={methods.control}
        name={`vegetables.${index}.color`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="text" {...field} disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // control={methods.control}
        name={`vegetables.${index}.length`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" step={0.1} min={0} {...field} disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function FruitRow({ index, isPending }: { index: number; isPending: boolean }) {
  return (
    <>
      <FormField
        // control={methods.control}
        name={`vegetables.${index}.fruitName`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input type="text" {...field} disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // control={methods.control}
        name={`vegetables.${index}.amount`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" step={0.1} min={0} {...field} disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div />
    </>
  );
}

function Index() {
  const [displayValues, setDisplayValues] = useState<FormValues | null>(null);
  const { data } = useSuspenseQuery<FruitOptions>(formQueryOptions);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      await delay(1500);
      return data;
    },
    onSuccess: (data) => {
      setDisplayValues(data);
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      fruit: 'banana',
      vegetables: [
        { type: 'vegetable', vegetableName: 'Zucchini', color: 'green', length: 15 },
        { type: 'vegetable', vegetableName: 'Pumpkin', color: 'yellow', length: 25 },
        { type: 'fruit', fruitName: 'Dragonfruit', amount: 8 },
        { type: 'vegetable', vegetableName: 'Broccoli', color: 'green', length: 17 },
        { type: 'fruit', fruitName: 'Apple', amount: 3 },
        { type: 'vegetable', vegetableName: 'Carrot', color: 'orange', length: 11 },
      ],
      comment: '',
    },
    resolver: zodResolver(schema),
  });

  const fieldArray = useFieldArray({ control: methods.control, name: 'vegetables' });

  return (
    <div className="grid grid-cols-2 gap-10 p-10">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit((data) => mutate(data))} className="space-y-6">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} type="text" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="fruit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select fruit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.map((fruitOption) => {
                      return (
                        <SelectItem key={fruitOption.value} value={fruitOption.value}>
                          {fruitOption.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_36px_36px_36px] items-start gap-2">
              <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Vegetable Name
              </div>
              <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Color
              </div>
              <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Size (in cm)
              </div>
            </div>
            {fieldArray.fields.map((field, index) => {
              return (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_36px_36px_36px] items-start gap-2">
                  {'type' in field && field.type === 'fruit' ? (
                    <FruitRow index={index} isPending={isPending} />
                  ) : (
                    <VegetableRow index={index} isPending={isPending} />
                  )}
                  {index > 0 ? (
                    <Button
                      type="button"
                      variant={'secondary'}
                      size="icon"
                      onClick={() => fieldArray.move(index, index - 1)}
                      disabled={isPending}
                    >
                      <ArrowBigUp />
                    </Button>
                  ) : (
                    <div />
                  )}
                  {index < fieldArray.fields.length - 1 ? (
                    <Button
                      type="button"
                      variant={'secondary'}
                      size="icon"
                      onClick={() => fieldArray.move(index, index + 1)}
                      disabled={isPending}
                    >
                      <ArrowBigDown />
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    type="button"
                    variant={'destructive'}
                    size="icon"
                    onClick={() => fieldArray.remove(index)}
                    disabled={isPending}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                fieldArray.append({ type: 'vegetable', vegetableName: '', color: '', length: undefined });
              }}
            >
              Add Vegetable
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                fieldArray.append({ type: 'fruit', fruitName: '', amount: 0 });
              }}
            >
              Add Fruit
            </Button>
          </div>
        </form>
      </Form>
      <div>{isPending ? 'submitting...' : JSON.stringify(displayValues)}</div>
    </div>
  );
}
