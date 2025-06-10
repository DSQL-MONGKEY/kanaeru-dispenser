

type TRecipe = {
   name: string;
   pump1: number;
   pump2: number;
   pump3: number;
}

export const addRecipe = async ({ name, pump1, pump2, pump3 }:TRecipe  ) => {
   const response = await fetch(`/api/recipes`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name,
         composition: [
            {pump_number: 1, percentage: pump1},
            {pump_number: 2, percentage: pump2},
            {pump_number: 3, percentage: pump3},
         ],
      }),
   });
   const data = await response.json();

   return data;
}