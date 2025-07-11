type TPump = {
  pumpNumber?: number | null;
  activeTime?: number | null;
};

export const testPump = async ({ pumpNumber, activeTime }: TPump) => {
  const response = await fetch(`/api/pump-settings/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pumpNumber,
      activeTime
    })
  });
  const data = await response.json();

  return data;
};
