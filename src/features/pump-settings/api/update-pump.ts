

type TPump = {
   pumpNumber: number;
   flowRate: number | null;
}

export const updatePump = async ({ pumpNumber, flowRate }:TPump  ) => {
   const response = await fetch(`/api/pump-settings/${pumpNumber}`, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         pumpNumber,
         flowRate,
      }),
   });
   const data = await response.json();

   return data;
}