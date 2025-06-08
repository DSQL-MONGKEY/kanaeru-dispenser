'use client';

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod";
import { IconHandClick } from "@tabler/icons-react"
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters.'
   }),
   total_ml: z.string().min(1, {
      message: 'Total ml must be at least 1.'
   }),
   pump1: z.string().min(1, {
      message: 'Pump 1 must be at least 1 characters.'
   }),
   pump2: z.string().min(2, {
      message: 'Pump 2 must be at least 2 characters.'
   }),
   pump3: z.string().min(2, {
      message: 'Pump 3 must be at least 2 characters.'
   })
})


export function MixManualSheetForm() {

   const defaultValues = {
      name: '',
      total_ml: '0',
      pump1: '40',
      pump2: '30',
      pump3: '30',
   };

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: defaultValues
   });

   async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
   }

   return (
      <Sheet>
         <SheetTrigger asChild>
         <Button variant="default">
            <IconHandClick/>
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
               <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
                           <Input placeholder='Enter name' {...field} />
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
                           <Input placeholder='Enter percentage number' {...field} />
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
                           <Input placeholder='Enter percentage number' {...field} />
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
                           <Input placeholder='Enter percentage number' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <p className='text-foreground opacity-50 text-sm px-4 my-3'>
                  Make sure the percentage of all pumps is 100% total
               </p>
               <Button type="submit" className="mt-5 float-end mx-4">Create</Button>
            </form>
         </Form>
         
         <SheetFooter>
            <SheetClose asChild>
               <Button variant="outline">Close</Button>
            </SheetClose>
         </SheetFooter>
         </SheetContent>
      </Sheet>
   )
}
