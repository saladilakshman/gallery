import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  AppBar, Typography, useMediaQuery, Container, Stack, Autocomplete,
  TextField, ImageList, ImageListItem, Skeleton, Dialog, IconButton
} from "@mui/material";
import cam from './assets/funny-3d-illustration-cartoon-teenage-girl.jpg';
import axios from "axios";
import categories from "./categories";
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import { API_KEY } from './key';
function App() {
  const isMobile = useMediaQuery("(max-width:425px)");
  const [gallery, setGallery] = useState([]);
  const [query, setQuery] = useState('all');
  const [isload, setIsload] = useState(true);
  const [close, setClose] = useState(false);
  const [eventsrc, setEventsrc] = useState('');
  const [alt, setAlt] = useState(true);
  const datafetching = async (query) => {
    axios.get(`https://pixabay.com/api/?key=${API_KEY}&category=${query}&image_type=photo`)
      .then(res => {
        setGallery(res.data.hits)
        setIsload(false)
        setAlt(false)
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    datafetching(query)
  }, [query])
  const valueChange = (event, Val) => {
    setQuery(Val);
    setIsload(true)
  }
  const opendialog = (e) => {
    setClose(true)
    setEventsrc(e.target.src);
  }
  const closedialog = () => {
    setClose(false)
  }
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#DA4167' }}>
        <Typography variant={isMobile ? "h6" : 'h5'} textAlign="center">Photostock</Typography>
      </AppBar>
      <Container sx={{ marginBlockEnd: 3 }}>
        <Stack direction={isMobile ? 'column-reverse' : 'row'} justifyContent="center" alignItems="center" sx={{ bgcolor: '#' }}>
          <Typography variant={isMobile ? 'h5' : 'h3'} textAlign={isMobile ? 'center' : ''} color="#357266">Find your favourite Images here!</Typography>
          {alt ? <Skeleton variant="rectangular" sx={{ marginBlockStart: 3 }} height={300} width={isMobile ? '100%' : '50%'} /> : <LazyLoadImage src={cam} id="cam" alt="" style={{ width: isMobile ? '100%' : '50%', mixBlendMode: 'color-burn', boxSizing: 'border-box' }} />}
        </Stack>
        <Autocomplete
          options={categories}
          value={query}
          onChange={valueChange}
          renderInput={(params) => <TextField label="select category"{...params} />}
          sx={{ marginBlockStart: 2 }} />

        <ImageList variant="quilted" cols={isMobile ? 2 : 3} gap={8} sx={{ marginBlockStart: 5 }}>
          {gallery.map((item) => {
            const { id, largeImageURL } = item;
            return <>
              <ImageListItem key={id}>
                {isload ? <Skeleton variant="rectangular" sx={{ height: 300 }} /> :
                  <LazyLoadImage src={largeImageURL} alt="" loading="lazy" style={{ width: '100%' }} onClick={opendialog} />}
              </ImageListItem>
            </>
          })}
        </ImageList>
        <Dialog
          open={close}
          onClose={closedialog}
          sx={{ bgcolor: "#342E37" }}>
          <AppBar sx={{ bgcolor: '#342E37', boxShadow: 'none' }}>
            <Stack direction="row" justifyContent='flex-end' alignItems="center" gap={isMobile ? 0 : 2} sx={{ marginInlineEnd: isMobile ? 0 : 4 }}>
              <IconButton color="secondary" onClick={async () => {

                /*downlaoding the image using blob method*/
                await fetch(eventsrc)
                  .then((res) => res.blob()
                    .then((data) => {
                      const url = URL.createObjectURL(data);
                      const anchor = document.createElement('a');
                      anchor.href = url;
                      anchor.download = `image${Math.random().toFixed(2)}.jpeg`;
                      document.body.appendChild(anchor);
                      anchor.click();
                    }))
                  .catch(err => console.log(err))
              }
              }>
                <DownloadIcon />
              </IconButton>
              <IconButton color="success" onClick={async () => {
                /*sharing the image using web share API*/
                await fetch(eventsrc)
                  .then(res => res.blob()
                    .then(myblob => {
                      const file = new File([myblob], 'share.jpeg', { type: myblob.type });
                      const data = {
                        files: [file]
                      }
                      if (navigator.canShare && navigator.canShare(data)) {
                        try {
                          navigator.share(data);
                        }
                        catch {
                          console.log('unable to send file')
                        }
                      }
                    })
                    .catch(err => console.log(err)))
                  .catch(err => console.log(err.message))
              }}>
                <ShareIcon />
              </IconButton>
              <IconButton onClick={closedialog} color="warning">
                <CloseIcon />
              </IconButton>
            </Stack>
          </AppBar>
          <img src={eventsrc} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
        </Dialog>
      </Container>
    </>
  )
}

export default App
