'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { fetcher } from '@/lib/fetcher';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '@radix-ui/react-select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import * as z from 'zod';
import { updatePump } from '../api/update-pump';
import { formatDate } from '@/lib/format';

const formSchema = z.object({
  pumpNumber: z.string().nullable(),
  flowRate: z.string().nullable()
});

export default function PumpSettingsForm() {
  const defaultValues = {
    pumpNumber: '1',
    flowRate: ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const {
    data: pump,
    error: pumpError,
    isLoading: pumpLoading
  } = useSWR('/api/pump-settings', fetcher);

  if (pumpError) {
    toast('Failed...', {
      description: 'Error occured while fetching pump data'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await updatePump({ ...values });

      const result = await response;

      if (!result.success) {
        toast('Request Failed', {
          duration: 4000,
          description: result.error || 'Terjadi kesalahan validasi'
        });
        return;
      }

      const formattedDate = formatDate(Date.now(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      toast('Request successfully', {
        duration: 5000,
        description: formattedDate
      });
    } catch (error) {
      if (error instanceof Error) {
        toast('Error failed to add record', {
          duration: 3000,
          description: error.message,
          action: {
            label: 'Close',
            onClick: () => null
          }
        });
      }
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Pump Calibration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 md:grid-cols-2'
          >
            <FormField
              control={form.control}
              name='pumpNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pump Number</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Choose Pump' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position='popper' className='h-32'>
                      {!pumpLoading &&
                        pump.data?.map((pump: any) => (
                          <SelectItem
                            typeof='number'
                            key={pump.id}
                            value={pump.id}
                          >
                            Pump Number {pump.pump_number}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='flowRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flow Rate /.sec</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter flow rate pump'
                      className='resize-none'
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-5 md:col-span-2'>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
