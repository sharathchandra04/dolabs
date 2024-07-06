import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, IconButton, Card, CardContent, Tooltip, Chip } from '@material-ui/core';
import { ArrowBackIos, Circle, GradingOutlined, FiberManualRecordOutlined, FileCopyOutlined, 
  Lightbulb, InfoOutlined, VpnKeyOutlined, CheckCircle, Cancel  } from '@mui/icons-material';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  roundedCard: {
    borderRadius: 16,
    marginBottom: 16
  },
  brightChip: {
    backgroundColor: '#ffffff',
    color: 'darkblue',
    marginRight: '4px',
    marginBottom: '4px'

  },
}));

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  ...theme.typography.body2,
  fontSize: '18px',
  fontFamily: 'Georgia',
  fontWeight: 520
}));

const DynamicText = ({ dynamicContent, specialWords }) => {
  const content = dynamicContent || '';
  const words = content.split(' ');
  const handleCopy = (word) => {
    navigator.clipboard.writeText(word)
      .then(() => {
        console.log('Copied to clipboard:', word);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
  };
  const removespace = (word) => {
    return word.replace(/_/g, " ");
  };
  return (
    <span style={{}}>
      {words.map((word, index) => {
        if(specialWords.includes(index)){
          return <span key={index}><b>
            <Chip
              label={removespace(word)}
              clickable
              onClick={() => handleCopy(removespace(word))}
              deleteIcon={<IconButton onClick={() => handleCopy(removespace(word))}>
                <FileCopyOutlined onClick={() => handleCopy(removespace(word))} style={{fontSize:'15px', color:'#4c9ef5'}}/>
              </IconButton>}
              onDelete={() => {}}
              variant="outlined"
              size="small"
              style={{
                fontSize:'15px',
                color:'#4c9ef5',
                marginBottom: '5px'}}
            />&nbsp;</b>
          </span>
        } else {
          return (
            <span style={{}} key={index}>
              {word}{' '}
            </span>
          );
        }
      })}
    </span>
  );
};

function TaskUI({labid, taskid, gotoListMode}) {
  const classes = useStyles();

  // const [selectedTask, setSelectedTask] = useState(1);
  // const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState(null);
  // const [numTasks, setNumTasks] = useState(3);
  // const [labId, setLabId] = useState(1);
  const [buffer, setBuffer] = useState(false);

  // const changeLab = (id) => {
  //   setLabId(id)
  // }
  const loadLab = async () => {
    try {
      const response = await axios.get(`/data1?labid=${labid}&taskid=${taskid}`);
      console.log(response.data)
      if(response.data.length) {
        const task = 0
        setTaskData(response.data[task]);
        // setTasks(response.data)
        // setSelectedTask(task + 1);
        // setNumTasks(response.data.length)
      }

    } catch (error) {
      console.error('Error fetching task data:', error);
    }
  }
  useEffect(()=>{
    loadLab()
  }, [])
  const handleCopy = (word) => {
    navigator.clipboard.writeText(word)
      .then(() => {
        console.log('Copied to clipboard:', word);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
  };
  // const handleTaskChange = async (taskId) => {
  //   setSelectedTask(taskId);
  //   setTaskData(tasks[taskId-1]);
  // };
  // const clickLeft = (st) => {
  //   if(selectedTask>1){
  //     setSelectedTask(st-1)
  //     handleTaskChange(st-1)
  //   }
  // }
  // const clickRight = (st) => {
  //   console.log(st)
  //   if(selectedTask<numTasks){
  //     setSelectedTask(st+1)
  //     handleTaskChange(st+1)
  //   }
  // }
  const Test = () => {
    const taskid = taskData.taskid
    const labid = taskData.labid
    console.log(taskid, labid)
    const data = {
      lab_id: labid,
      task_id: taskid
    };
    setBuffer(true)
    axios.post('/check_task', data)
      .then((response) => {
        setBuffer(false)
        console.log('Response:', response.data);
        const results = response.data.results
        const keys = Object.keys(results)
        console.log(keys)
        const _taskData = taskData
        keys.forEach((key) => {

          _taskData["subtasks"][Number(key)-1].status = results[key]?1:2;
        })
        setTaskData(_taskData)
      })
      .catch((error) => {
        setBuffer(false)
        console.error('Error:', error);
      });
  }
  return (
    <div style={{overflowY: "auto", height: '100vh', backgroundColor: '#d4ddfa' }}>
      <Grid container  spacing={1}>
        <Grid style={{textAlign: 'right'}} item sm={4} spacing={1}>
          <div style={{ textAlign: 'left', padding: '5px', cursor: 'pointer' }}>
            {/* <Select value={labId} onChange={(e) => changeLab(e.target.value)}>
              {[1, 2, 3].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>Lab {index + 1}</MenuItem>
              ))}
            </Select> */}
            {/* <IconButton style={{ cursor: 'pointer', color:'#4c9ef5' }} onClick={()=>{ loadLab(labId) }}>
              <CachedOutlined style={{ fontSize: 30 }} />
            </IconButton> */}
            <Chip onClick={()=>{gotoListMode()}} icon={<ArrowBackIos />} label="Go to Labs" color="primary" />
          </div>
        </Grid>
        <Grid item sm={4} spacing={1}>
          <div style={{ textAlign: 'left' }}>
            {/* <IconButton style={{ cursor: 'pointer', color:'#4c9ef5' }} onClick={()=>{ clickLeft(selectedTask) }}>
              <ArrowLeft style={{ fontSize: 30 }} />
            </IconButton>
            <Select value={selectedTask} onChange={(e) => handleTaskChange(e.target.value)}>
              {[...Array(numTasks)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>Task {index + 1}</MenuItem>
              ))}
            </Select>
            <IconButton style={{ cursor: 'pointer', color:'#4c9ef5' }} onClick={()=>{ clickRight(selectedTask) }}>
              <ArrowRight style={{ fontSize: 30 }} />
            </IconButton> */}
            {/* <Button onClick={()=>{gotoListMode()}}>Go to Labs</Button> */}
            {/* <Chip icon={<ArrowBackIos />} label="Go to Labs" color="primary" /> */}
          </div>
        </Grid>
        <Grid item sm={4} spacing={1}>
          <div style={{ textAlign: 'right' }}>
            <IconButton style={{ cursor: 'pointer', color:'#4c9ef5' }} onClick={()=>{ Test() }}>
              {buffer && (<CircularProgress size={24} />)}
              {!buffer && (<GradingOutlined style={{ fontSize: 30 }} />)}
            </IconButton>
          </div>
        </Grid>
      </Grid>
      {taskData !== null ? (
        <div style={{ padding: '16px', textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <b>{taskData.title}</b>
          </Typography>
          <Typography gutterBottom style={{fontFamily:'Georgia', fontSize: '25px'}}>
            <DemoPaper variant="elevation">
              &nbsp;&nbsp;&nbsp;&nbsp;<DynamicText 
                                          dynamicContent={taskData.description} 
                                          specialWords={taskData.descriptionw}/>
            </DemoPaper>
          </Typography>
          {
            taskData.prerequisites.length>0 && (
              <Typography variant="body1" gutterBottom>
                <b>Prerequisites</b>&nbsp;:&nbsp;&nbsp;
                {taskData.prerequisites.map((prerequisite, index) => (
                  <Chip key={index} label={prerequisite} className={classes.brightChip} variant="outlined" />
                ))}
              </Typography>
            )
          }
            <br/>
            <h3><b>&nbsp;&nbsp;Execute the following Tasks</b>&nbsp;:&nbsp;&nbsp;</h3>
            {taskData.subtasks.map((subtask, index) => {
              if (subtask.display != 'dont'){
                return <div key={index}>
                <Card className={classes.roundedCard}>
                  <CardContent>
                    <Grid container spacing={0}>
                      <Grid item sm={8}>
                        <Typography variant="subtitle1" style={{ fontSize: 'large', color:'#640D6B' }}>
                          <div style={{display:'flex'}}>
                            <span>
                              <b><u>{subtask.staskid}.&nbsp;{subtask.title}</u></b>  
                            </span>
                            <div style={{ width: '10%'}}>
                              {subtask.test && (<FiberManualRecordOutlined style={{color: 'green', paddingTop:'3px', margin: '0px'}} />)}
                            </div>
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item sm={1}>
                        <Tooltip title="Info">
                          <IconButton>
                            <InfoOutlined style={{ fontSize: 'large', color:'#4c9ef5' }}/>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item sm={1}>
                        <Tooltip title="Solution">
                          <IconButton>
                            <VpnKeyOutlined style={{ fontSize: 'large', color:'#4c9ef5' }}/>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item sm={1}>
                        <Tooltip title="Hint">
                          <IconButton>
                            <Lightbulb style={{ fontSize: 'large', color:'#4c9ef5' }}/>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item sm={1} style={{paddingTop:'10px', paddingLeft:'10px'}}>
                        {( buffer && subtask.test) && (<CircularProgress size={20} />)}
                        {( buffer && !subtask.test) && (<Circle style={{ color: 'grey', fontSize: '15px' }}/>)}
                        {(!buffer && subtask.status === 0) ? <Circle style={{ color: 'grey', fontSize: '15px' }}/> : null}
                        {(!buffer && subtask.status === 1) ? <CheckCircle style={{ color: 'green', fontSize: 'large' }}/> : null}
                        {(!buffer && subtask.status === 2) ? <Cancel style={{ color: 'red', fontSize: 'large' }} /> : null}
                      </Grid>
                    </Grid>
                    <Typography style={{paddingBottom: '20px', fontSize:'17px'}} variant="body2" component="p">
                      {
                        subtask.tasks.map((task)=>{
                          return <div>
                              <DynamicText dynamicContent={task.task} specialWords={task.taskw}/>
                            </div>
                        })
                      }
                    </Typography>
                    {
                      subtask.commands && (
                      <Grid container spacing={1} style={{backgroundColor: '#c7c6c3', borderRadius:'5px'}}>
                        <Grid container key={index}  spacing={1}>
                          <Grid style={{textAlign: 'right'}} item sm={6} spacing={1}>
                            <b style={{color:'maroon', textAlign: 'center'}}>Command or Task</b>
                          </Grid>
                          <Grid item sm={6} spacing={1}>
                            <b style={{}}>&nbsp;&nbsp;Output Explanation</b>
                          </Grid>
                        </Grid>  
                        {subtask.commands.map((item, index) => {
                            if (item.command) {
                              return (
                                <Grid container item key={index}  spacing={1}>
                                  <Grid item sm={6} spacing={1}>
                                    <Paper 
                                      elevation={2} 
                                      style={{ 
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold',
                                        padding: 2,
                                        color: 'maroon', 
                                        textAlign: 'right',
                                        overflowX: 'auto'}}
                                    >
                                      <Typography variant="body1" style={{fontWeight: 'lighter',}}>
                                        {item.command} &nbsp;&nbsp;&nbsp;
                                        <FileCopyOutlined onClick={() => handleCopy(item.command)} style={{cursor:'pointer', padding: 0, fontSize:'15px', color:'#4c9ef5'}}/>
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item sm={6} spacing={1}>
                                    <Paper elevation={2} style={{ padding: 2 }}>
                                      <Typography variant="body1">
                                        <small>&nbsp;&nbsp;{item.explanation}</small>
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              )
                            } else {
                              return(
                                  <Grid container item key={index}  spacing={1}>
                                    <Grid item sm={12} spacing={1} style={{}}>
                                      <Paper elevation={2} style={{ padding: 2, backgroundColor: 'yellow' }}>
                                        <Typography variant="body1">
                                          <small>&nbsp;&nbsp;{item.explanation}</small>
                                        </Typography>
                                      </Paper>
                                    </Grid>
                                  </Grid>
                              )
                            }
                          })}
                      </Grid>)
                    }
                  </CardContent>
                </Card>
                </div>
              } else {
                return null
              }
            })}
        </div>
      ) : null}
    </div>
  );
}

export default TaskUI;



// import React from 'react';



// export default DynamicText;
