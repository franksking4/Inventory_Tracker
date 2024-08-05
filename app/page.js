'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Typography, Modal, style, Stack, TextField, Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [itemName, setItemName] = useState("")
  const [search, setSearch] = useState("")

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      if (doc.id.toLowerCase().includes(search.toLowerCase())){
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      }
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const searchOpen = () => setOpenSearch(true)
  const searchClose = () => setOpenSearch(false)

  const infoOpen = () => setOpenInfo(true)
  const infoClose = () => setOpenInfo(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={0}
    >
      <IconButton
        color="inherit"
        aria-label="info"
        style={{ position: 'absolute', top: 16, right: 16 }}
        title="Info"
        onClick={() => {
          infoOpen()
        }}
      >
        <InfoIcon />
      </IconButton>
      <Stack width = "800px" height = "100px" overflow="auto">
        <Box
          width="800px"
          height="100px"
          bgcolor="#c0f599"
          direction = "row"
          spacing={1}
          display={"flex"}
          justifyContent="space-between"
          alignItems="center">
          <Modal open={open} onClose={handleClose}>
            <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={4} sx={{transform: 'translate(-50%,-50%)'}}>
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              />
              <IconButton title="Add" aria-label="add" color="success" onClick={() => {
                addItem(itemName.toLowerCase())
                setItemName("")
                handleClose()
              }}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>
        </Modal>
        <Modal open={openSearch} onclose={searchClose}>
          <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: 'translate(-50%,-50%)'}}>
            <Typography variant="h6">Search</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
              variant='outlined'
              fullWidth
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              />
              <IconButton color="success" aria-label="search" onClick={() => {
                searchClose()
                updateInventory()
              }}>
                <SearchIcon />
              </IconButton>
            </Stack>
          </Box>
        </Modal>
        <Modal open={openInfo} onclose={infoClose}>
          <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: 'translate(-50%,-50%)'}}>
            <Typography variant="h6">How To Use:</Typography>
            <Typography variant="p">Click on the plus icon to add an item to the pantry.</Typography>
            <Typography variant="p">Click on the search icon to search for pantry items that contain the given text.</Typography>
            <Typography variant="p">Click on the trash icon to remove one of a specific item.</Typography>
            <IconButton color="error" aria-label="close" onClick={infoClose} style={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon/></IconButton>
          </Box>
        </Modal>
        <IconButton title="Add Pantry Item" variant="contained" color="inherit" aria-label="add" size="large" fontSize="large" onClick={() => {
          handleOpen()
        }}>
          <AddIcon />
        </IconButton>
        <Typography variant = "h2" color = "#333">
          Pantry Tracker
        </Typography>
        <IconButton title="Search Pantry Items" color="inherit" aria-label="search" onClick={() => {
          searchOpen()
        }}>
          <SearchIcon />
        </IconButton>
        </Box>
      </Stack>
      <Box border='1px solid #333'>
        <Stack width = "800px" height = "500px" spacing={2} overflow="auto">
          {inventory.map(({name, quantity})=> (
              <Box 
              key={name} 
              width="100%"
              minHeight={"50px"}
              maxHeight={"50px"}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}>
                <Typography variant="h3" color = "#333" textAlign={"center"}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant="h3" color = "#333" textAlign={"center"}>{quantity}</Typography>
                <IconButton title="Remove" color="error" aria-label="delete" style={{ fontSize: 60 }} height="60" width="60" onClick={() => {removeItem(name)}}>
                  <DeleteIcon  />
                </IconButton>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
