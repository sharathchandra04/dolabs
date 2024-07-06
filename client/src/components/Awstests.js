import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tabs, TextField, Tab, OutlinedInput, InputAdornment, Button, Modal, Paper, Typography, 
  IconButton, Card, CardContent, Tooltip, Chip, FormControl, InputLabel } from '@material-ui/core';
import { Person, ArrowBackIos, Circle, GradingOutlined, FiberManualRecordOutlined, FileCopyOutlined, 
  Lightbulb, InfoOutlined, VpnKeyOutlined, CheckCircle, Cancel, ManageAccounts, Lock, Key, Psychology,
  Laptop } from '@mui/icons-material';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { TabContext, TabList, TabPanel } from '@mui/lab'

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
        if(specialWords && specialWords.includes(index)){
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

function Awstest({labid, taskid, gotoListMode, setcreds, creds, setQ}) {
  const classes = useStyles();

  const [taskData, setTaskData] = useState(null);
  const [qMap, setQmap] = useState({});
  const [result, setResult] = useState([0, 0]);
  const [buffer, setBuffer] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    field1: creds.field1 || '',
    field2: creds.field2 || '',
    field3: creds.field3 || '',
  });

  const handleOpen = () => {
    const userid = localStorage.getItem('userid');
    const fd = {
      field1: userid || '',
      field2: '',
      field3: ''
    }
    setFormData(fd)
    setcreds(fd)
    setOpen(true);
  };
  const handleClose = () => {setOpen(false);};
  
  const recordAnswers = (qid, event) => {
    const _qmap = {...qMap}
    console.log(event.target.value)
    _qmap[qid] = event.target.value
    setQmap(_qmap);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newformData = {}
      newformData.userid = formData.field1;
      localStorage.setItem('userid', formData.field1)
      newformData.access = formData.field2 || '';
      newformData.secret = formData.field3 || '';
      const response = await axios.post('http://localhost:5000/creds', newformData);
      console.log(response.data);
      setcreds(formData)
      handleClose();
    } catch (error) {
      if(error.response&&error.response.data&&error.response.data.message){
        window.alert('data already exists, thank you for updating it.')
        setcreds(formData)
        handleClose();
      } 
      console.error('Error:', error);
    }
  };
  const loadLab = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/data1?labid=${labid}&taskid=${taskid}`);
      console.log(response.data)
      if(response.data.length) {
        const task = 0
        setTaskData(response.data[task]);
        let total = response.data[task].total || 0
        setResult([0, total])
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
  const Test = () => {
    const taskid = taskData.taskid
    const labid = taskData.labid
    console.log('creds ---> ', creds)
    const data = {
      lab_id: labid,
      task_id: taskid,
      creds: creds,
      qmap: qMap
    };
    console.log('qMap --> ', qMap, data)
    setBuffer(true)
    axios.post('http://localhost:5000/check_task_aws', data)
      .then((response) => {
        setBuffer(false)
        const results = response.data.results
        const keys = Object.keys(results)
        const values = Object.values(results)
        const trueCount = values.filter(value => value === true).length;
        setResult([trueCount, result[1]])
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
  const handleConnect = (name) => {
    const data = {
      creds: creds,
      insname: name
    };
    axios.post('http://localhost:5000/connect', data)
    .then((response) => {
      console.log(response.data);
      if(response.data.id!=null){
        var link = document.createElement('a');
        const id = response.data.id;
        link.href = `https://us-east-1.console.aws.amazon.com/ec2-instance-connect/ssh?region=us-east-1&connType=standard&instanceId=${id}&osUser=ubuntu&sshPort=22#/`
        link.target = '_blank';
        link.textContent = 'Open link in new tab';
        link.click();
      } else{
        window.alert(`unable to connect please try from AWS Console, 
        please make sure that ec2 with the given name Exists`)  
      }
    })
    .catch((error) => {
      window.alert(`unable to connect please try from AWS Console, 
        please make sure that ec2 with the given name Exists`)
      console.error('Error:', error);
    });
  }
  return (
    <div style={{overflowY: "auto", height: '100vh', backgroundColor: '#d4ddfa' }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width:'35%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' }}
      >
        <Card className={classes.roundedCard}>
          <CardContent>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2} style={{backgroundColor:'white'}}>
              <Grid style={{}} item sm={12}>  
                <div style={{textAlign: 'center'}} id="modal-modal-title">
                  <b>
                    <span style={{align: 'center'}}>Enter Credentials</span>
                  </b>
                </div>
              </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>User Id</InputLabel>
                      <OutlinedInput
                        name="field1"
                        value={formData.field1}
                        onChange={handleChange}
                        required  
                        placeholder='user id'
                        startAdornment={<InputAdornment position="start">
                          <Person style={{ fontSize: 20 }} />
                        </InputAdornment>}
                        label="User Id"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} spacing={1} style={{}}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Access Key</InputLabel>
                      <OutlinedInput
                        value={formData.field2}
                        onChange={handleChange}
                        name="field2"  
                        placeholder='access key'
                        startAdornment={<InputAdornment position="start">
                          <Lock style={{ fontSize: 20 }} />
                        </InputAdornment>}
                        label="access key"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item spacing={1} sm={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Secret Key</InputLabel>
                      <OutlinedInput
                        value={formData.field3}
                        onChange={handleChange}
                        name="field3"
                        type="password"
                        placeholder='secret key'
                        startAdornment={<InputAdornment position="start">
                          <Key style={{ fontSize: 20 }} />
                        </InputAdornment>}
                        label="secret key"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{justifyContent:'center', align: 'center'}} spacing={1} xs={12}>
                    <Button style={{}} variant='contained' type="submit">Submit</Button>
                  </Grid>
            </Grid>
            </form> 
          </CardContent>
        </Card>
        
      </Modal>
      <Grid container  spacing={1}>
        <Grid style={{textAlign: 'right'}} item sm={4} spacing={1}>
          <div style={{ textAlign: 'left', padding: '5px', cursor: 'pointer' }}>
            <Chip onClick={()=>{gotoListMode()}} icon={<ArrowBackIos />} label="Go to Labs" color="primary" />
          </div>
        </Grid>
        <Grid item sm={4} spacing={1}>
        
        </Grid>
        <Grid item sm={3} spacing={1}>
          <div style={{ textAlign: 'right' }}>
            <IconButton onClick={handleOpen} style={{ cursor: 'pointer', color:'#4c9ef5' }}>
              <ManageAccounts onClick={handleOpen} style={{ fontSize: 30 }} />
            </IconButton>
          </div>
        </Grid>
        <Grid item sm={1} spacing={1}>
          <div style={{ textAlign: 'right' }}>
            <IconButton 
              style={{ cursor: 'pointer', color:'#4c9ef5' }} 
              onClick={()=>{ Test() }}
            >
              {buffer && (<CircularProgress size={24} />)}
              {!buffer && (<GradingOutlined style={{ fontSize: 30 }} />)}
            </IconButton>
          </div>
        </Grid>
      </Grid>
      {taskData !== null ? (
        <div style={{ padding: '16px', textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <b>{taskData.title}</b>&nbsp;&nbsp;&nbsp;&nbsp;<small style={{color: 'red'}}><span>{result[0]}<b>/</b>{result[1]} Tests passed</span></small>
          </Typography>
          <Typography gutterBottom style={{fontFamily:'Georgia', fontSize: '25px'}}>
            <DemoPaper variant="elevation">
              &nbsp;&nbsp;&nbsp;&nbsp;<DynamicText 
                                          dynamicContent={taskData.description} 
                                          specialWords={taskData.descriptionw}/>
            </DemoPaper>
          </Typography>
          {
          }
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
                        {( buffer && subtask.test) && (<CircularProgress size={20} />)}
                        {( buffer && !subtask.test) && (<Circle style={{ color: 'grey', fontSize: '15px' }}/>)}
                        {(!buffer && subtask.status === 0) ? <Circle style={{ color: 'grey', fontSize: '15px' }}/> : null}
                        {(!buffer && subtask.status === 1) ? <CheckCircle style={{ color: 'green', fontSize: 'large' }}/> : null}
                        {(!buffer && subtask.status === 2) ? <Cancel style={{ color: 'red', fontSize: 'large' }} /> : null}
                      </Grid>
                    </Grid>
                    <Typography style={{paddingBottom: '15px', fontSize:'14px'}} variant="body2" component="p">
                      {<DynamicText dynamicContent={subtask.description} specialWords={subtask.descriptionw}/>}
                    </Typography>
                    {
                      (subtask.connect)&&(
                        <Typography variant="body1" gutterBottom>
                          <b>Connect to EC2</b>&nbsp;:&nbsp;&nbsp;
                          {subtask.connect.map((ec2, index) => (
                            <Chip
                              color="primary" 
                              icon={<Laptop />}
                              key={index} 
                              label={`connect - ${ec2}`} 
                              onClick={()=>{handleConnect(ec2)}} 
                              className={classes.brightChip} 
                              variant="outlined" 
                            />
                          ))}
                        </Typography>
                      )
                    }
                    {
                      subtask.specifications && (
                      <Grid container spacing={1} 
                        style={{
                          backgroundColor: '#c7c6c3', 
                          borderRadius:'5px'
                        }}
                      >
                        <Grid container key={index}  spacing={1}>
                          {(subtask.specifications.length!==0) && <Grid style={{textAlign: 'center'}} item sm={12} spacing={1}>
                              <b style={{color:'maroon', textAlign: 'center'}}>Specifications</b>
                            </Grid>
                          }
                        </Grid>  
                        {subtask.specifications.map((item, index) => {
                            if (item.value) {
                              return (
                                <Grid container item sm={6} key={index}  spacing={1}>
                                  {
                                    item.key !== undefined ? (
                                      <Grid item sm={11} spacing={1} >
                                        <Paper 
                                          elevation={4} 
                                          style={{
                                            padding: 4,
                                            marginLeft: '20px',
                                            textAlign: 'center',
                                          }}
                                        >
                                          <span 
                                            variant="body1" 
                                            style={{fontWeight: 'lighter', fontFamily: 'monospace', color: 'black'}}>
                                              {item.key}
                                          </span>
                                          &nbsp;:&nbsp;
                                          <span
                                            style={{
                                              padding: 2,
                                              fontFamily: 'monospace',
                                              fontWeight: 'bolder',
                                              fontSize: '15px',
                                              color: 'maroon',
                                              overflowX: 'auto'
                                            }}
                                          >
                                            <b>&nbsp;&nbsp;{item.value}</b> &nbsp;&nbsp;&nbsp;
                                          </span>
                                        </Paper>
                                      </Grid>
                                    ):null
                                  }
                                  {
                                    item.key !== undefined ? (
                                      <Grid item sm={1} spacing={1}>
                                        <FileCopyOutlined 
                                          onClick={() => handleCopy(item.value)} 
                                          style={{
                                            backgroundColor: 'grey',
                                            padding:'3px',
                                            marginLeft: 'auto', 
                                            cursor:'pointer', 
                                            fontSize:'15px',
                                            borderRadius: '5px', 
                                            color:'white',
                                          }}
                                        />
                                      </Grid>
                                    ):null
                                  }
                                  {
                                    item.key === undefined ? (
                                      <Grid item sm={12} spacing={1}>
                                        <Paper elevation={4} style={{ padding: 2, marginLeft: '20px', backgroundColor: '#e6e4e1' }}>
                                          <Typography variant="body1">
                                            <small>&nbsp;&nbsp;{item.value}</small>
                                          </Typography>
                                        </Paper>
                                      </Grid>
                                    ):null
                                  }
                                </Grid>
                              )
                            } else {
                              return(
                                  <Grid container item key={index}  spacing={1}>
                                    <Grid item sm={12} spacing={1} style={{}}>
                                      <Paper elevation={4} style={{ padding: 2, backgroundColor: 'yellow' }}>
                                        <Typography variant="body1">
                                          <small>&nbsp;&nbsp;{item.key}</small>
                                        </Typography>
                                      </Paper>
                                    </Grid>
                                  </Grid>
                              )
                            }
                        })}
                      </Grid>)
                    }
                    {
                      (subtask.commands) && (
                      <Grid container spacing={1} 
                        style={{
                          backgroundColor: '#c7c6c3', 
                          borderRadius:'5px'
                        }}
                      >
                        <Grid container item  spacing={1}>
                          {(subtask.specifications.length!==0) && <Grid style={{textAlign: 'center'}} item sm={12} spacing={1}>
                              <b style={{color:'maroon', textAlign: 'center'}}>Type Commands in Terminal</b>
                            </Grid>
                          }
                        </Grid>  
                        {subtask.commands.map((command, index) => {
                            if (command.command) {
                              return (
                                <Grid container item sm={12} key={index}  spacing={1}>
                                      <Grid item sm={6} spacing={1} >
                                        <DemoPaper 
                                          elevation={4} 
                                          style={{
                                            padding: 0,
                                            marginLeft: '20px',
                                            textAlign: 'center',
                                          }}
                                        >
                                          <span 
                                            variant="body1" 
                                            style={{fontWeight: 'lighter', fontFamily: 'monospace', color: 'black'}}>
                                              {command.command}
                                          </span>
                                        </DemoPaper>
                                      </Grid>
                                      <Grid item sm={6} spacing={1} >
                                        <DemoPaper 
                                          elevation={4} 
                                          style={{
                                            padding: 0,
                                            marginLeft: '20px',
                                            textAlign: 'center',
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontFamily: 'monospace',
                                              fontWeight: 'bolder',
                                              fontSize: '15px',
                                              color: 'maroon',
                                              overflowX: 'auto'
                                            }}
                                          >
                                            <small>
                                              <b>&nbsp;&nbsp;{command.explanation}</b> &nbsp;&nbsp;&nbsp;
                                            </small>
                                          </span>
                                        </DemoPaper>
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

const QuestionComponent = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const handleChange = (event) => {
    setAnswer(event.target.value);
  };
  const handleSubmit = () => {
    onSubmit({ question, answer });
    setAnswer('');
  };
  return (
    <div>
      <div>{question}</div>
      <TextField
        variant="outlined"
        value={answer}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

const ParentComponent = ({questions}) => {
  const [answers, setAnswers] = useState({});
  const handleSubmit = (data) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [data.question]: data.answer,
    }));
  };
  return (
    <div>
      {Object.keys(questions).map((key) => (
        <QuestionComponent
          key={key}
          question={key}
          onSubmit={handleSubmit}
        />
      ))}
      <Button variant="contained" color="primary" onClick={() => console.log(answers)}>
        Submit All Answers
      </Button>
    </div>
  );
};

function Awstesttabs({labid, taskid, gotoListMode, setcreds, creds}) {
  const [value, setValue] = React.useState('1');
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [questions, setQuestions] = useState([]);
  const setQ = (q) => {
    setQuestions(q)
  }
  useEffect(()=> {
    console.log(labid, taskid)
  },[])
  return (
    <Box>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange} aria-label="">
            <Tab label="Tasks" value="1" />
            <Tab label="Solutions" value="2" />
            <Tab label="Blogs" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" style={{padding: '0px'}}>
          <Awstest
              taskid={taskid} 
              labid={labid}
              gotoListMode={gotoListMode}
              setcreds={setcreds}
              creds={creds}
              setQ={setQ}
          />
        </TabPanel>
        <TabPanel value="2" style={{padding: '0px', backgroundColor: 'lightblue'}}>
          {
            [1,2,3].map((task, index) => {
              return <Card key={index} className={classes.roundedCard}>
                <CardContent>
                  <Typography variant="subtitle1" style={{ fontSize: 'large', color:'#640D6B' }}>
                    <div style={{display:'flex'}}>
                      <span>
                        <b><u>{}.&nbsp;{}</u></b>  
                      </span>
                    </div>
                  </Typography>
                  <img src="" style={{}}/>
                </CardContent>
              </Card>
            })
          }
        </TabPanel>
        <TabPanel value="3" style={{padding: '0px'}}>
          <ParentComponent questions={questions}/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Awstesttabs;
// import React from 'react';



// export default DynamicText;
