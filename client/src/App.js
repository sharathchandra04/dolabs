import './App.css';
// import Button from '@mui/material/Button';
import { Grid, Button, Paper, Select, MenuItem, Box, FormControl, InputLabel } from '@material-ui/core';

import TaskUI from './components/Tests';
import Labs from './components/Labs';
import Awscomp from './components/Awscomp';
// import {Labs, TaskUI, Awscomp} from './components';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  ...theme.typography.body2,
  fontSize: '18px',
  fontFamily: 'Georgia',
  fontWeight: 520
}));

function App() {
  const [labid, setLabid] = useState(1);
  const [taskid, setTaskid] = useState(1);
  const [labmode, setLabmode] = useState(false);
  const [labType, setLabType] = useState('aws');
  const [creds, setCreds] = useState({});
  // const [numTasks, setNumTasks] = useState(3);
  const setlabandtask = (labid, taskid) => {
    setLabid(labid)
    setTaskid(taskid)
    console.log('2. labid, taskid--> ', labid, taskid)
    setLabmode(true)
  }
  const gotoListMode = () => {
    setLabmode(false)
  }
  const selectLabType = (lt) => {
    console.log(lt.target.value)
    setLabType(lt.target.value)
  }
  const setcreds = (creds) => {
    // setLabmode(false)
    console.log('creds--> ', creds)
    setCreds(creds)
  }
  return (
    <div className="App">
      {(labmode)&&(labType==='linux')&&(<Grid container spacing={0}>
            <Grid item xs={12} sm={5}>
              <div style={{ height: '100vh', backgroundColor: '#d4ddfa' }}>
                <TaskUI taskid={taskid} labid={labid} gotoListMode={gotoListMode} />
              </div>
            </Grid>
            <Grid item xs={12} sm={7}>
              <div style={{ height: '100vh', backgroundColor: '#e0e0e0' }}>
                <iframe
                  title="Your iFrame"
                  src="http://localhost:8888"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </Grid>
          </Grid>
      )}
      {(labmode)&&(labType==='aws')&&(<Awscomp 
        taskid={taskid} 
        labid={labid} 
        gotoListMode={gotoListMode}
        setcreds={setcreds}
        creds={creds}
      />)}
      {(!labmode)&&(<div style={{backgroundColor:'grey', padding: '25px'}}>
        <Grid container>
          <Grid item xs={6} sm={1}>
            <DemoPaper variant="elevation">  
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Lab Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={labType}
                    label="Select Lab Type"
                    onChange={selectLabType}
                  >
                    {['linux', 'aws'].map((lt, index) => (
                      <MenuItem key={index} value={lt}>{lt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>       
            </DemoPaper>
          </Grid>
        </Grid>
      </div >
      )}
      {(!labmode)&&(<Labs setLabmode={setlabandtask}/>)}
    </div>
  );
}

export default App;


