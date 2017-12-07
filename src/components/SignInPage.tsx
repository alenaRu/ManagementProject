import * as React from 'react';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';
import {ArrowBack, Save, Check, Add} from 'material-ui-icons';
import {grey} from 'material-ui/colors';
import {Pages} from './App';

const styles = theme => ({
  root : {
    flexGrow: 1,
  },
  paper: {
  }
});

class SignInPage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    const {classes, goToPage} = this.props;
    const {}        = this.state;
    
    return (
      <Card className={classes.paper}>
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Button color="contrast" aria-label="Back" onClick={() => goToPage(Pages.ITEMLIST)}>
              <ArrowBack color={grey[800]}/>
              Back to app list
            </Button>
          </Grid>
        </Grid>
      </Card>
    
    );
  }
}

export default withStyles(styles)(SignInPage);
