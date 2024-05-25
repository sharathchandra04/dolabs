import React, { useState, useEffect } from 'react';
import { Paper, Chip } from '@material-ui/core';
import {  } from '@mui/icons-material';
import { Grid } from '@material-ui/core';
import { styled } from '@mui/material/styles';

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  ...theme.typography.body2,
  fontSize: '18px',
  fontFamily: 'Georgia',
  fontWeight: 520
}));

function TaskUI({ setLabmode, labtype }) {
  const [labs, setLabs] = useState([
    {labid: 1, taskid: 1, tags:['linux']},
    {labid: 1, taskid: 2, tags:['linux']},
    {labid: 2, taskid: 1, tags:['linux']},
    {labid: 2, taskid: 2, tags:['linux']},
    {labid: 2, taskid: 3, tags:['linux']},
    {labid: 3, taskid: 1, tags:['linux']},
    {labid: 3, taskid: 2, tags:['linux']},
    {labid: 4, taskid: 1, tags:['aws', 'ec2', 'sg']},
    {labid: 4, taskid: 2, tags:['aws', 'ec2', 'sg']},
    {labid: 5, taskid: 1, tags:['docker']}
  ]);
  const selectLab = (l, t, i) => {
    if(labs[i].tags[0] === labtype){
      setLabmode(l, t)
    }else{
      window.alert('please change correct lab type')
    }
  }
  return (
    <div>
      <Grid container  spacing={1} style={{overflowY: "auto", padding: '25px', backgroundColor:'grey'}}>
        {labs.map((l, index) => {
          return <Grid item sm={2} spacing={1} style={{textAlign: 'right', cursor:'pointer'}} key={index}>
            <DemoPaper variant="elevation" onClick={() => {selectLab(l.labid, l.taskid, index)}}>  
              <Grid container item  sm={12} spacing={1} style={{}}>
                <Grid style={{textAlign: 'right', cursor:'pointer'}} item sm={6} spacing={1}>
                    <DemoPaper variant="elevation" style={{backgroundColor:'lightblue'}} onClick={() => {selectLab(l.labid, l.taskid, index)}}>
                        <div>
                            <b>Lab &nbsp;  : &nbsp;  {l.labid}&nbsp;&nbsp;</b>
                        </div>
                        <div>
                            <b>Task &nbsp; : &nbsp; {l.taskid}&nbsp;&nbsp;</b>
                        </div>
                    </DemoPaper>
                </Grid>
                <Grid style={{textAlign: 'right', cursor:'pointer'}} item sm={6} spacing={1}>
                  {
                    l.tags.map((tag, index)=>{
                      return <span>
                        <Chip key={index} label={tag}/>
                      </span> 
                    })
                  }
                </Grid>
              </Grid>
            </DemoPaper>
          </Grid>
        })}
      </Grid>
    </div>
  );
}
export default TaskUI;
