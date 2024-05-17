import { Grid, Button, Paper, Select, MenuItem, Box, FormControl, InputLabel } from '@material-ui/core';
import Awstests from './Awstests';
import Awsgraph from './Awsgraph';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

// const DemoPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(1),
//   ...theme.typography.body2,
//   fontSize: '18px',
//   fontFamily: 'Georgia',
//   fontWeight: 520
// }));

function Awscomp(props) {
  // const [labid, setLabid] = useState(1);
  // const [taskid, setTaskid] = useState(1);
  // const [questions, setQuestions] = useState(1);
  // const setQ = (q) => {
  //   setQuestions(q)
  // }
  useEffect(()=>{
      // setLabid(props.labid)
      // setTaskid(props.taskid)
  }, [])
  return (
    <div>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={5}>
            <Awstests
                taskid={props.taskid} 
                labid={props.labid} 
                gotoListMode={props.gotoListMode}
                setcreds={props.setcreds}
                creds={props.creds}
                // setQ={setQ}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Awsgraph />
          </Grid>
        </Grid>
    </div>
  );
}

export default Awscomp;


