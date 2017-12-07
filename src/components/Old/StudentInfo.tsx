import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import withStyles from 'material-ui/styles/withStyles';
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress
} from 'material-ui';
import {grey} from 'material-ui/colors';
import {ArrowBack, Edit, Save, Check, Delete} from 'material-ui-icons';
import StudentInfoField, {
  surname,
  name,
  patronymic,
  phone,
  passport,
  admisionYear,
  bdate,
  institute,
  speciality,
  room,
  notes
} from './StudentFields';

enum StudentInfoModes { EDIT, READ }

enum InputTypes { TEXT, DATE, MULTILINE }

const styles: any = theme => ({
  paper       : {
    padding: '10px 20px'
  },
  textField   : {
    color: grey[800]
  },
  input       : {
    margin: 0
  },
  multiline   : {
    paddingTop: 9
  },
  upperWrapper: {
    display   : 'flex',
    alignItems: 'center',
    height    : 70
    
  },
  wrapper     : {
    margin  : theme.spacing.unit,
    position: 'relative',
    height  : 60
  },
  loader      : {
    color   : grey[800],
    position: 'relative',
    top     : -64,
    left    : -2
  },
  saveButton  : {
    color   : grey[800],
    position: 'relative',
    top     : -2,
    left    : -1
  }
});

const _labels = {
  [surname]   : {label: 'Surname', mapping: 'surname'},
  [name]      : {label: 'Name', mapping: 'name'},
  [patronymic]: {label: 'Patronymic', mapping: 'patronymic'},
  
  [phone]   : {label: 'Phone', mapping: 'phone'},
  [passport]: {label: 'Passport', mapping: 'passport'},
  
  [admisionYear]: {label: 'Admision Year', mapping: 'admisionYear'},
  [bdate]       : {label: 'Birth Date', mapping: 'bdate'},
  
  [institute] : {label: 'Institute', mapping: 'speciality.institute.name'},
  [speciality]: {label: 'Speciality', mapping: 'speciality.name'},
  
  [room] : {label: 'Room', mapping: 'room'},
  [notes]: {label: 'Notes', mapping: 'notes'}
};

class StudentInfo extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {
      data   : props.data,
      mode   : StudentInfoModes.READ,
      isDirty: false,
      
      loading: false,
      success: false
    };
  }
  
  onEditClick = () => {
    this.setState({mode: StudentInfoModes.EDIT});
  };
  
  onSaveClick = () => {
    const {data, isDirty, loading} = this.state;
    if (!isDirty) {
      this.setState({mode: StudentInfoModes.READ});
      return;
    }
    const self = this;
    
    if (!loading) {
      this.setState({
                      success: false,
                      loading: true
                    });
      
      axios.put('http://localhost:8080/student/update', data)
        .then(function (response) {
          console.warn(response, 'post-response');
          
          setTimeout(() => {
            self.setState({
                            loading: false,
                            success: true
                          });
          }, 2000);
          setTimeout(() => {
            self.setState({
                            mode   : StudentInfoModes.READ,
                            success: false,
                            loading: true
                          });
          }, 3000);
        })
        .catch(function (error) {
          console.warn(error, 'post-error');
        });
    }
  };
  
  onDelete = () => {
    const {onBack} = this.props;
    const {data}   = this.state;
    
    axios.delete('http://localhost:8080/student/delete', {
      data: {id: data.id, name: data.name, surname: data.surname}
    })
      .then(function (response) {
        console.warn(response, 'delete-response');
      })
      .catch(function (error) {
        console.warn(error, 'delete-error');
      });
    
    setTimeout(() => onBack(), 1000);
  };
  
  onInput = (property, mapping) => event => {
    const {data} = this.state;
    
    this.setState(
      {
        data   : _.set(data, mapping, event.target.value),
        isDirty: true
      });
  };
  
  createField = (
    field: StudentInfoField,
    type: InputTypes = InputTypes.TEXT,
    mapping?: string
  ) => {
    const {mode, data} = this.state;
    const {classes}    = this.props;
    const map          = `${mapping || ''}${_labels[field].mapping}`;
    
    if (type === InputTypes.TEXT) {
      return (
        <TextField
          label={_labels[field].label}
          value={_.get(data, map, '')}
          margin="normal"
          fullWidth
          disabled={mode}
          inputClassName={classes.textField}
          onChange={this.onInput(field, map)}
          className={classes.input}
        />
      );
    }
    else if (type === InputTypes.DATE) {
      return (
        <TextField
          label={_labels[field].label}
          value={_.get(data, _labels[field].mapping, '')}
          margin="normal"
          fullWidth
          disabled={mode}
          inputClassName={classes.textField}
          onChange={/*this.onInput(field)*/ null}
          type="date"
          className={classes.input}
        />
      );
    }
    else if (type === InputTypes.MULTILINE) {
      return (
        <TextField
          label={_labels[field].label}
          value={_.get(data, map, '')}
          margin="normal"
          fullWidth
          disabled={mode}
          inputClassName={classes.textField}
          onChange={this.onInput(field, map)}
          multiline
          rows={9}
          rowsMax={9}
          className={classes.multiline}
        />
      );
    }
  };
  
  renderButtons = () => {
    const {classes}                = this.props;
    const {mode, success, loading} = this.state;
    
    if (mode === StudentInfoModes.EDIT) {
      return (
        <Grid item xs={1} className={classes.upperWrapper}>
          <div className={classes.wrapper}>
            <Button
              fab
              color="primary"
              onClick={this.onSaveClick}
              className={classes.saveButton}
            >
              {success ? <Check/> : <Save/>}
            </Button>
            {loading &&
            <CircularProgress size={68} className={classes.loader}/>}
          </div>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={4}>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Button color="contrast" aria-label="Edit"
                      onClick={this.onEditClick}>
                <Edit color={grey[800]}/>
                Edit info
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button color="contrast" aria-label="Delete"
                      onClick={this.onDelete}>
                <Delete color={grey[800]}/>
                Delete student
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };
  
  renderParents = () => {
    const {data} = this.state;
    
    if (data.parents.length === 0) {return null; }
    else {
      return (
        <Grid item xs={12}>
          <Paper className={this.props.classes.paper}>
            <Typography type="display1">
              {data.parents.length === 1 ? 'Parent' : 'Parents'}
            </Typography>
            {
              data.parents.map((info, index) => (
                <Grid
                  container
                  spacing={24}
                  justify="space-around"
                >
                  <Grid item xs={3}>
                    {this.createField(
                      surname,
                      InputTypes.TEXT,
                      `parents[${index}]`
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {this.createField(
                      name,
                      InputTypes.TEXT,
                      `parents[${index}]`
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {this.createField(
                      patronymic,
                      InputTypes.TEXT,
                      `parents[${index}]`
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {this.createField(
                      phone,
                      InputTypes.TEXT,
                      `parents[${index}]`
                    )}
                  </Grid>
                </Grid>
              ))
            }
          </Paper>
        </Grid>
      );
      
    }
    
  };
  
  render() {
    const {onBack}       = this.props;
    const {mode}         = this.state;
    const buttonFillSize = mode === StudentInfoModes.EDIT ? 7 : 5;
    
    return (
      <Grid container spacing={24}>
        <Grid item xs={3}>
          <Button color="contrast" aria-label="Back" onClick={onBack}>
            <ArrowBack color={grey[800]}/>
            Back to list of students
          </Button>
        </Grid>
        <Grid item xs={buttonFillSize}/>
        {this.renderButtons()}
        
        <Grid item xs={6}>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              {this.createField(surname)}
            </Grid>
            <Grid item xs={4}>
              {this.createField(name)}
            </Grid>
            <Grid item xs={4}>
              {this.createField(patronymic)}
            </Grid>
            
            <Grid item xs={4}>
              {this.createField(phone)}
            </Grid>
            <Grid item xs={8}>
              {this.createField(passport)}
            </Grid>
            
            <Grid item xs={4}>
              {this.createField(admisionYear)}
            </Grid>
            <Grid item xs={8}>
              {this.createField(bdate, InputTypes.DATE)}
            </Grid>
            
            <Grid item xs={4}>
              {this.createField(institute)}
            </Grid>
            <Grid item xs={8}>
              {this.createField(speciality)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              {this.createField(room)}
            </Grid>
            <Grid item xs={8}/>
            
            <Grid item xs={12}>
              {this.createField(notes, InputTypes.MULTILINE)}
            </Grid>
          </Grid>
        </Grid>
        
        {this.renderParents()}
        <Grid item xs={12}/>
      </Grid>
    );
  }
}

export default withStyles(styles)(StudentInfo);
