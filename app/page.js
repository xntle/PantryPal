'use client'

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Container, Paper, Grid } from '@mui/material';
import { collection, deleteDoc, query, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import RecipeBox from './RecipeBox'; 

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const updateInventory = async () => {
    const inventoryCollection = query(collection(firestore, 'inventory'));
    const snapshot = await getDocs(inventoryCollection);
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  const handleItemAction = async (item, imageFile, action) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (action === 'remove') {
        if (count === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { count: count - 1 }, { merge: true });
        }
      } else {
        await setDoc(docRef, { count: count + 1 }, { merge: true });
      }
    } else if (action === 'add') {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `images/${item}-${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await setDoc(docRef, { count: 1, imageUrl });
    }

    updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setItemImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ bgcolor: '#23272A', minHeight: '100vh', padding: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontFamily: '"Helvetica", "Arial", sans-serif', color: '#ffffff' }} gutterBottom>
          Pantry Pal AI
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontFamily: '"Helvetica", "Arial", sans-serif', color: '#99AAB5' }} gutterBottom>
          Hi! Add any items to get started! :-)
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: '12px', bgcolor: '#2C2F33' }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Helvetica", "Arial", sans-serif', color: '#ffffff' }}>
                Add Item
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{ bgcolor: '#7289DA', color: '#ffffff', borderRadius: '12px', mt: 2, fontFamily: '"Helvetica", "Arial", sans-serif' }}
              >
                Add New Item
              </Button>
            </Paper>

            <RecipeBox inventory={inventory} />

            <Modal open={open} onClose={handleClose}>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                width={400}
                bgcolor="#2C2F33"
                borderRadius="12px"
                boxShadow={24}
                p={4}
                sx={{ transform: 'translate(-50%, -50%)' }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Helvetica", "Arial", sans-serif', color: '#ffffff' }}>
                  Add Item
                </Typography>
                <Stack width="100%" direction="column" spacing={2}>
                  <TextField
                    label="Item Name"
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    sx={{
                      fontFamily: '"Helvetica", "Arial", sans-serif',
                      bgcolor: '#23272A',
                      borderRadius: '8px',
                      color: '#ffffff',
                      input: { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#7289DA',
                        },
                        '&:hover fieldset': {
                          borderColor: '#99AAB5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7289DA',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleItemAction(itemName, itemImage, 'add');
                      handleClose();
                    }}
                    sx={{ bgcolor: '#7289DA', color: '#ffffff', borderRadius: '12px', fontFamily: '"Helvetica", "Arial", sans-serif' }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', bgcolor: '#2C2F33' }}>
              <Box
                width="100%"
                bgcolor="#23272A"
                color="#ffffff"
                py={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ borderRadius: '8px' }}
              >
                <Typography variant="h5" sx={{ fontFamily: '"Helvetica", "Arial", sans-serif', color: '#ffffff' }}>
                  Inventory Items
                </Typography>
              </Box>
              <Stack direction="column" spacing={2} mt={2}>
                {inventory.map(({ name, count, imageUrl }) => (
                  <Paper
                    key={name}
                    elevation={1}
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: '8px',
                      bgcolor: '#2C2F33',
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginRight: '16px',
                          }}
                        />
                      )}
                      <Typography variant="h6" color="#ffffff" sx={{ fontFamily: '"Helvetica", "Arial", sans-serif' }}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="#99AAB5" sx={{ fontFamily: '"Helvetica", "Arial", sans-serif' }}>
                      Quantity: {count}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        onClick={() => handleItemAction(name, null, 'add')}
                        sx={{ bgcolor: '#7289DA', color: '#ffffff', borderRadius: '12px', fontFamily: '"Helvetica", "Arial", sans-serif' }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleItemAction(name, null, 'remove')}
                        sx={{ bgcolor: '#7289DA', color: '#ffffff', borderRadius: '12px', fontFamily: '"Helvetica", "Arial", sans-serif' }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
