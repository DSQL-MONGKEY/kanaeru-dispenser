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
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { addRecipe } from "../api/add-recipe";
import { mutate } from "swr";

const formSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters.'
   }),
   pump1: z.number().min(2, {
      message: 'Pump 1 must be at least 1 characters.'
   }),
   pump2: z.number().min(2, {
      message: 'Pump 2 must be at least 1 haracters.'
   }),
   pump3: z.number().min(2, {
      message: 'Pump 3 must be at least 1 characters.'
   })
})


export function RecipeSheetForm() {

   const defaultValues = {
      name: '',
      pump1: 40,
      pump2: 30,
      pump3: 30,
   };

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: defaultValues
   });

   async function onSubmit(values: z.infer<typeof formSchema>) {
      const response = await addRecipe({...values});

      const result = await response;

      if(!result.success) {
         return (
            toast('Request Failed', {
               duration: 4000,
               description: result.error || 'Terjadi kesalahan validasi'
            })
         );
      }
      const data = result.data;
      
      const formattedDate = formatDate(data.recipe.created_at,  {
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: false,
      });
      mutate('/api/recipes');

      toast('Request Successfully', {
         duration: 5000,
         description: formattedDate,
      })
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
               <p className='text-foreground opacity-50 text-sm px-4 my-3'>
                  Make sure the percentage of all pumps is 100% total
               </p>
               <SheetClose asChild>
                     <Button type="submit" className="mt-5 float-end mx-4">Create</Button>
               </SheetClose>
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
