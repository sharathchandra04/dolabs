import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, IconButton, Card, CardContent, Tooltip, Chip, FormControl, 
  InputLabel, OutlinedInput, InputAdornment} from '@material-ui/core';
import { ArrowBackIos, Circle, GradingOutlined, FiberManualRecordOutlined, FileCopyOutlined, 
  Lightbulb, InfoOutlined, VpnKeyOutlined, CheckCircle, Cancel, Psychology
} from '@mui/icons-material';
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

function Dockercomp({labid, taskid, gotoListMode}) {
  const classes = useStyles();
  const [taskData, setTaskData] = useState(null);
  const [qMap, setQmap] = useState({});
  const [tMap, setTmap] = useState({});
  const [currtestid, setCurrtestid] = useState(null);

  const recordAnswers = (qid, event) => {
    const _qmap = {...qMap}
    console.log(event.target.value)
    _qmap[qid] = event.target.value
    setQmap(_qmap);
  };
  const loadLab = async () => {
    try {
      const response = await axios.get(`/getdockerlab?labid=${labid}&taskid=${taskid}`);
      console.log(response.data)
      if(response.data.length) {
        const task = 0
        setTaskData(response.data[task]);
        const d = response.data[task];
        const tmap = {}
        d.subtasks.forEach((s)=>{
          tmap[s.staskid] = 0
          // tmap[s.staskid] = false
          // if(s.test){
          // }
        })
        console.log(tmap)
        setTmap(tmap)
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
  const Test = (staskid) => {
    setCurrtestid(staskid)
    const taskid = taskData.taskid
    const labid = taskData.labid
    const data = {
      lab_id: labid,
      task_id: taskid,
      stask_id: staskid,
      qmap: qMap
    };
    axios.post('/check_task_docker', data)
      .then((response) => {
        const results = response.data.results
        setCurrtestid(null)
        const _tmap = {...tMap}
        if(results){
          _tmap[staskid] = 1
        } else {
          _tmap[staskid] = 2
        }
        setTmap(_tmap)
      })
      .catch((error) => {
        setCurrtestid(null)
        console.error('Error:', error);
      });
  }
  return (
    <div style={{overflowY: "auto", height: '100vh', backgroundColor: '#d4ddfa' }}>
      <Grid container  spacing={1}>
        <Grid style={{textAlign: 'right'}} item sm={4} spacing={1}>
          <div style={{ textAlign: 'left', padding: '5px', cursor: 'pointer' }}>
            <Chip onClick={()=>{gotoListMode()}} icon={<ArrowBackIos />} label="Go to Labs" color="primary" />
          </div>
        </Grid>
        <Grid item sm={4} spacing={1}>
          <div style={{ textAlign: 'left' }}>
          </div>
        </Grid>
        <Grid item sm={4} spacing={1}>
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
              if (subtask.display !== 'dont'){
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
                        {
                          !subtask.test?(<Circle style={{ color: 'grey', fontSize: '15px' }}/>):<>
                            {
                              subtask.staskid === currtestid?<CircularProgress size={20} />:<>
                                {(tMap[subtask.staskid] === 0) ? <Circle style={{ color: 'grey', fontSize: '15px' }}/> : null}
                                {(tMap[subtask.staskid] === 1) ? <CheckCircle style={{ color: 'green', fontSize: 'large' }}/> : null}
                                {(tMap[subtask.staskid] === 2) ? <Cancel style={{ color: 'red', fontSize: 'large' }} /> : null}
                              </>
                            }
                          </>
                        }
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid spacing={0} item sm={11}></Grid>
                      <Grid item sm={1} spacing={0}>
                        {(subtask.test) && (<Chip
                          label={'Test'}
                          style={{border: 'solid 1px black'}}
                          clickable
                          onClick={() => {Test(subtask.staskid)} }
                          variant="outlined"
                          color="primary"
                          size="small"
                        />)}
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
                          <Grid style={{textAlign: 'center', color:'maroon'}} item sm={12} spacing={1}>
                            <b>Execute Commands</b>
                          </Grid>
                        </Grid>  
                        {subtask.commands.map((item, index) => {
                            if (item.command) {
                              return (
                                <Grid container item key={index}  spacing={1}>
                                  <Grid item sm={12} spacing={1}>
                                    <Paper 
                                      elevation={2} 
                                      style={{ 
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold',
                                        padding: 2,
                                        color: 'maroon', 
                                        // textAlign: 'right',
                                        overflowX: 'auto'}}
                                    >
                                      <Typography variant="body1" style={{fontWeight: 'lighter',}}>
                                        &nbsp;&nbsp;{item.command} &nbsp;&nbsp;&nbsp;
                                        <FileCopyOutlined onClick={() => handleCopy(item.command)} style={{cursor:'pointer', padding: 0, fontSize:'15px', color:'#4c9ef5'}}/>
                                      </Typography>
                                      <Typography style={{color:'black'}} variant="body1">
                                        <small>&nbsp;&nbsp;&nbsp;&nbsp;{item.explanation}</small>
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
                    <div 
                      style={{
                        backgroundColor: '#c7c6c3', 
                        borderRadius:'5px',
                        margin: '-4px',
                        padding: '4px'
                      }}
                    >
                      <Grid container spacing={1}>
                       {(subtask.questions)&&(subtask.questions.length!==0) && <Grid style={{textAlign: 'center'}} item sm={12} spacing={1}>
                           <b style={{color:'maroon', textAlign: 'center'}}>Questions</b>
                         </Grid>
                       }
                      </Grid>
                    {(subtask.questions)&&(subtask.questions.map((question, index) => {
                      return <DemoPaper key={index} style={{padding: '5px', margin: '2px', marginTop: '0px'}}>
                        <Grid 
                          container
                          style={{paddingTop: '5px'}}
                        >
                          <Grid item sm={6} style={{}}>
                            <div  
                              style={{fontWeight: 'lighter', fontFamily: 'monospace', color: 'black'}}>
                                <small>{question.q}</small>
                            </div>
                          </Grid>
                          <Grid item sm={6} style={{}}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel>{question.label}</InputLabel>
                              <OutlinedInput
                                name="field1"
                                value={qMap[question.qid]}
                                onChange={(e) => {recordAnswers(question.qid, e)}}
                                required  
                                placeholder={question.label}
                                startAdornment={<InputAdornment position="start">
                                  <Psychology style={{ fontSize: 20 }} />
                                </InputAdornment>}
                                label={question.label}
                              />
                            </FormControl>
                            
                          </Grid>
                        </Grid>
                      </DemoPaper>
                    }))}
                    </div>
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
export default Dockercomp;