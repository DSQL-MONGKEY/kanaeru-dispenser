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
import { addMixManual } from '../api/add-manual-recipe';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format';

type TMixManual = {
  name: string;
  total_ml: number;
  pump1: number;
  pump2: number;
  pump3: number;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  total_ml: z.number().min(1, {
    message: 'Total ml must be at least 1.'
  }),
  pump1: z.number().min(12, {
    message: 'Pump 1 must be at least 1 characters.'
  }),
  pump2: z.number().min(2, {
    message: 'Pump 2 must be at least 1 haracters.'
  }),
  pump3: z.number().min(2, {
    message: 'Pump 3 must be at least 1 characters.'
  })
});

export function MixManualSheetForm() {
  const defaultValues = {
    name: '',
    total_ml: 0,
    pump1: 40,
    pump2: 30,
    pump3: 30
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await addMixManual({ ...(values as TMixManual) });

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
            Create and mix the drink by yours...
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid flex-1 auto-rows-min gap-6 px-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='total_ml'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Volume</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter name'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pump1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pump Chamber 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter percentage number'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pump2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pump Chamber 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter percentage number'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pump3'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pump Chamber 3</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter percentage number'
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
