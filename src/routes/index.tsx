import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData<FruitOptions>(formQueryOptions),
  component: Index,
});

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  fruit: z.enum(['apple', 'banana', 'orange', 'blueberry'], {
    errorMap: () => ({ message: 'Please select a fruit' }),
  }),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function Index() {
  const [displayValues, setDisplayValues] = useState<FormValues | null>(null);
  const { data } = useSuspenseQuery<FruitOptions>(formQueryOptions);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      await delay(1500);
      return values;
    },
    onSuccess: (values) => {
      setDisplayValues(values);
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      fruit: 'apple',
      comment: '',
    },
    resolver: zodResolver(schema),
  });

  return (
    <div className="grid grid-cols-2 gap-10 p-10">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(mutate)} className="space-y-6">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
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
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
      <div>{isPending ? 'submitting...' : JSON.stringify(displayValues)}</div>
    </div>
  );
}
