type TMixRecipe = {
  recipeId: number;
  totalMl: number;
};

export const addMixLogs = async ({ totalMl, recipeId }: TMixRecipe) => {
  const response = await fetch(`/api/mix-logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipe_id: recipeId,
      total_ml: totalMl
    })
  });
  const data = await response.json();

  return data;
};
