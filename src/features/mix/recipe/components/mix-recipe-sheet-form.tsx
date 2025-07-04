'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconHandClick } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { addMixRecipe } from '../api/add-mix-recipe';

const formSchema = z.object({
  totalMl: z.number().min(1, {
    message: 'Total ml must be at least 1.'
  })
});

export function MixRecipeSheetForm() {
  const [recipeId, setRecipeId] = useState(0);
  const defaultValues = {
    totalMl: 0
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const { data, isLoading } = useSWR('/api/recipes', fetcher);
  let recipes = [];

  if (!isLoading) {
    recipes = data.data;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await addMixRecipe({ recipeId, ...values });

    const result = await response;

    if (!result.success) {
      toast('Request Failed', {
        duration: 4000,
        description: result.error || 'Terjadi kesalahan validasi'
      });
      return;
    }
    const data = result.data;

    const formattedDate = formatDate(data.mix_log.created_at, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });

    toast('Request Successfully', {
      duration: 5000,
      description: formattedDate
    });
  }

  useEffect(() => {}, [recipeId]);

  const handleClick = (id: any) => {
    setRecipeId(id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='default'>
          <IconHandClick />
          Create
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mix it now!</SheetTitle>
          <SheetDescription>
            Choose a recipe that you like it...
          </SheetDescription>
        </SheetHeader>
        <div className='grid grid-cols-1 justify-between gap-2 px-4 md:grid-cols-2'>
          {!isLoading &&
            recipes.map((r: any, i: number) => (
              <Button
                key={i}
                variant={'outline'}
                onClick={() => handleClick(r.id)}
                className={cn(
                  'border-2 bg-transparent duration-100 ease-in-out',
                  recipeId == r.id && 'bg-blue-500 text-white dark:bg-blue-500'
                )}
              >
                {r.name}
              </Button>
            ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid flex-1 auto-rows-min gap-6 px-4'>
              <FormField
                control={form.control}
                name='totalMl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter mililiter'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className='text-foreground my-3 px-4 text-sm opacity-50'>
              Make sure the percentage of all pumps is 100% total
            </p>
            <SheetClose asChild>
              <Button type='submit' className='float-end mx-4 mt-5'>
                Create
              </Button>
            </SheetClose>
          </form>
        </Form>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
