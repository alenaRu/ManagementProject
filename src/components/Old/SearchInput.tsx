import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import {grey} from 'material-ui/colors';
import {FormControl} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Select from 'material-ui/Select';
import {FormHelperText, MenuItem} from 'material-ui';
import Grid from 'material-ui/Grid';

const styles: any = theme => ({
  container         : {
    display : 'flex',
    flexWrap: 'wrap'
  },
  formControl       : {
    margin: theme.spacing.unit
  },
  inputLabelFocused : {
    color: grey[800]
  },
  inputInkbar       : {
    '&:after': {
      backgroundColor: grey[800]
    }
  },
  textFieldRoot     : {
    padding    : 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  textFieldInput    : {
    borderRadius: 4,
    background  : theme.palette.common.white,
    border      : '1px solid #ced4da',
    fontSize    : 16,
    padding     : '10px 12px',
    width       : 'calc(100% - 24px)',
    transition  : theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus'   : {
      borderColor: '#80bdff',
      boxShadow  : '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  textFieldFormLabel: {
    fontSize: 18
  }
});

class SearchInput extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      byProperty: 'admisionYear'
    }
  }
  
  createSearchHandler = (property) => event => {
    this.setState({searchValue: event.target.value})
    this.props.onSearch(event.target.value.toLowerCase(), property);
  };
  
  onChangeProperty = event => {
    const {searchValue} = this.state;
    this.setState({byProperty: event.target.value});
    
    this.props.onSearch(searchValue, event.target.value);
  };
  
  render() {
    const {classes} = this.props;
    const {searchValue, byProperty} = this.state;
    
    return (
      <Grid container spacing={24} alignItems={'flex-end'}>
        <Grid item xs={8}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel
              FormControlClasses={{
                focused: classes.inputLabelFocused
              }}
              htmlFor="custom-color-input"
            
            >
              Search
            </InputLabel>
            <Input
              classes={{
                inkbar: classes.inputInkbar
              }}
              id="custom-color-input"
              onInput={this.createSearchHandler(byProperty)}
              value={searchValue}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl} fullWidth>
            <Select
              value={byProperty}
              onChange={this.onChangeProperty}
              displayEmpty
              name="FilterBy"
              className={classes.selectEmpty}
            >
              <MenuItem value="name"> Name </MenuItem>
              <MenuItem value="surname"> Surname </MenuItem>
              <MenuItem value="bdate"> Birth Date </MenuItem>
              <MenuItem value="admisionYear" > Admission Year </MenuItem>
              <MenuItem value="room"> Room </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(SearchInput);
