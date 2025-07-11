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
import { formatDate } from '@/lib/format';
import { testPump } from '../api/pump-testing';

const formSchema = z.object({
  pumpNumber: z.number().nullable(),
  activeTime: z.number().nullable()
});

export default function PumpSettingsTestForm() {
  const defaultValues = {
    pumpNumber: 1,
    activeTime: 0
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
      const response = await testPump({ ...values });

      const result = await response;

      if (!result.success) {
        toast('Action Failed', {
          duration: 4000,
          description: result.error || 'Something went wrong'
        });
        return;
      }
      const { calibration } = result.data;

      const formattedDate = formatDate(Date.now(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      toast('Request successfully', {
        duration: 5000,
        description: `Pump ${calibration?.pump_number} on testing ${formattedDate}`
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
          Pump Testing
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
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={Number(field.value)}
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
              name='activeTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration .sec</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter pump testing duration'
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
              Test
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
