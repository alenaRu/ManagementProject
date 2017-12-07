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
import {ArrowBack, Save, Check, Add} from 'material-ui-icons';
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

const requiredFields = {name, surname, patronymic, phone, admisionYear, room};

class StudentInfo extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    const data = {
      [name]      : '',
      [surname]   : '',
      [patronymic]: '',
      
      [phone]   : '',
      [passport]: '',
      
      [admisionYear]: '',
      [bdate]       : '2017-01-01',
      
      [speciality]: {
        [name]     : 'Software engineering',
        [institute]: {
          [name]: 'ICIT'
        }
      },
      
      [room] : '',
      [notes]: '',
      
      'parents': []
    };
    
    this.state = {
      data   : data,
      isDirty: false,
      
      loading: false,
      success: false,
      invalidsArr: []
    };
  }
  
  getInvalids = () => {
    const {data} = this.state;
    const invalidsArr = [];
    
    _.forOwn(requiredFields, (field) => {
      if (data[field] === '') {
        console.log(true, `${field} ${data[field]}`);
        invalidsArr.push(field);
      }
    });
    console.log(invalidsArr, 'invalidsArr');
    
    return invalidsArr;
  }
  
  onSaveClick = () => {
    const {data, loading} = this.state;
    const invalidsArr = this.getInvalids();
    console.log(data, 'data to save');
    if (!loading && invalidsArr.length === 0) {
      this.setState({
                      success: false,
                      loading: true
                    });
      //
      
      // axios.post('http://localhost:8080/student/add', {
      //   data: {
      //     [name]      : data[name],
      //     [surname]   : data[surname],
      //     [patronymic]: data[patronymic],
      //
      //     [phone]   : data[phone],
      //     [passport]: data[passport],
      //
      //     [admisionYear]: data[admisionYear],
      //     [bdate]       : data[bdate],
      //
      //     [speciality]: {
      //       [name]     : data[speciality].name,
      //       [institute]: {
      //         [name]: data[speciality].institute.name
      //       }
      //     },
      //
      //     [room] : data[room],
      //     [notes]: data[notes],
      //
      //     'parents': data.parents
      //   }
      // })
      //   .then(function (response) {
      //     console.log(response, 'post-response');
      //   })
      //   .catch(function (error) {
      //     console.warn(error, 'post-error');
      //   });
      
      // setTimeout(() => this.setState({
      //                                  loading: false,
      //                                  success: true
      //                                }), 1000);
      //
      // setTimeout(() => this.props.onBack(), 2000);
    }
    else {
      this.setState({invalidsArr});
    }
  };
  
  onInput = (property, mapping) => event => {
    const {data, invalidsArr} = this.state;
    
    this.setState(
      {
        data   : _.set(data, mapping, event.target.value),
        isDirty: true,
        invalidsArr: invalidsArr.filter((item) => item !== property)
      });
  };
  
  addParent = () => {
    const {data} = this.state;
    
    const parent = {
      [name]      : '',
      [surname]   : '',
      [patronymic]: '',
      [phone]     : ''
    };
    
    data.parents.push(parent);
    
    this.setState({ data });
  };
  
  createField = (
    field: StudentInfoField,
    type: InputTypes = InputTypes.TEXT,
    mapping?: string
  ) => {
    const {data, invalidsArr} = this.state;
    const {classes}    = this.props;
    const map          = `${mapping || ''}${_labels[field].mapping}`;
    
    if (type === InputTypes.TEXT) {
      return (
        <TextField
          label={_labels[field].label}
          value={_.get(data, map, '')}
          margin="normal"
          fullWidth
          inputClassName={classes.textField}
          onChange={this.onInput(field, map)}
          className={classes.input}
          required={!mapping && requiredFields.hasOwnProperty(field)}
          error={!mapping && invalidsArr.indexOf(field) > -1}
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
          inputClassName={classes.textField}
          onChange={/*this.onInput(field)*/ null}
          type="date"
          className={classes.input}
          required={requiredFields.hasOwnProperty(field)}
          error={invalidsArr.indexOf(field) > -1}
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
          inputClassName={classes.textField}
          onChange={this.onInput(field, map)}
          multiline
          rows={9}
          rowsMax={9}
          className={classes.multiline}
          required={requiredFields.hasOwnProperty(field)}
          error={invalidsArr.indexOf(field) > -1}
        />
      );
    }
  };
  
  renderButtons = () => {
    const {classes}                         = this.props;
    const {success, loading, isDirty} = this.state;
    
    return (
      <Grid item xs={1} className={classes.upperWrapper}>
        <div className={classes.wrapper}>
          <Button
            fab
            color="primary"
            onClick={this.onSaveClick}
            className={classes.saveButton}
            disabled={!isDirty}
          >
            {success ? <Check/> : <Save/>}
          </Button>
          {loading &&
          <CircularProgress size={68} className={classes.loader}/>}
        </div>
      </Grid>
    );
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
    const {onBack, classes}                 = this.props;
    const {mode, isDirty, success, loading} = this.state;
    
    return (
      <Grid container spacing={24}>
        <Grid item xs={3}>
          <Button color="contrast" aria-label="Back" onClick={onBack}>
            <ArrowBack color={grey[800]}/>
            Back to list of students
          </Button>
        </Grid>
        <Grid item xs={7}/>
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
            <Grid item xs={4}/>
            <Grid item xs={4}>
              <Button color="primary" raised aria-label="Back" onClick={this.addParent}>
                <Add color={grey[800]}/>
                Add parent
              </Button>
            </Grid>
            <Grid item xs={8}/>
            
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
