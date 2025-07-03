type TPump = {
  pumpNumber: string | null;
  flowRate: string | null;
};

export const updatePump = async ({ pumpNumber, flowRate }: TPump) => {
  const castedPumpNumber = pumpNumber ? Number(pumpNumber) : null;
  const castedFlowRate = flowRate ? Number(flowRate) : null;

  const response = await fetch(`/api/pump-settings/${pumpNumber}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      castedPumpNumber,
      castedFlowRate
    })
  });
  const data = await response.json();

  return data;
};
