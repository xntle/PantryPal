import { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import getRecipeRecommendation from '../gemini/gemini'; 

function RecipeBox({ inventory }) {
  const [recipeContent, setRecipeContent] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (inventory.length > 0) {
        const recommendation = await getRecipeRecommendation(inventory.map(item => item.name));
        setRecipeContent(recommendation);
      } else {
        setRecipeContent('Add some items to your pantry to get a recipe recommendation!');
      }
    };

    fetchRecipe();
  }, [inventory]);

  // Function to format the recommendation text
  function formatText(text) {
    const segments = text.split(/(\*\*|\*)/g); // Split by ** and *
    const formattedSegments = [];

    let isBold = false;
    segments.forEach((segment, index) => {
      if (segment === '**') {
        isBold = !isBold;
      } else if (segment === '*') {
        formattedSegments.push(<br key={`br-${index}`} />);
      } else if (isBold) {
        formattedSegments.push(
          <strong key={`strong-${index}`}>{segment}</strong>
        );
      } else {
        formattedSegments.push(segment);
      }
    });

    return formattedSegments;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: '12px', bgcolor: '#2C2F33', color: '#ffffff' }}>
      <Typography variant="h6" sx={{ fontFamily: '"Helvetica", "Arial", sans-serif', color: '#ffffff' }} gutterBottom>
        👨‍🍳 Chef Kiss ✨
      </Typography>
      <Box sx={{ padding: 2, bgcolor: '#23272A', borderRadius: '8px', color: '#ffffff' }}>
        {recipeContent ? (
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
            {formatText(recipeContent)}
          </Typography>
        ) : (
          'Loading...'
        )}
      </Box>
    </Paper>
  );
}

export default RecipeBox;
