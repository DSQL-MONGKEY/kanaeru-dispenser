

type TMixManual = {
   name: string;
   total_ml: number;
   pump1: number;
   pump2: number;
   pump3: number;
}

export const addMixManual = async ({ name, total_ml, pump1, pump2, pump3 }:TMixManual  ) => {
   const response = await fetch(`/api/mix/manual`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name,
         total_ml,
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