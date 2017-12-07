import * as React from 'react';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import withStyles from 'material-ui/styles/withStyles';

const styles = theme => ({
  root : {
    flexGrow : 1,
  },
  paper: {
    height: 500,
    padding  : 16,
    textAlign: 'center',
    color    : theme.palette.text.secondary,
    borderRadius: '0 0 15px 0',
  }
});

class SideBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    const {classes} = this.props;
    const {} = this.state;
    
    return (
      <Card className={classes.paper}>
        <Grid container spacing={24} className={classes.root} direction={'column'}>
          {/*<Grid item xs={2}/>*/}
          {/*<Grid item xs={8}>*/}
          
          {/*</Grid>*/}
          {/*<Grid item xs={2}/>*/}
          
          {/*<Grid item xs={1}/>*/}
          {/*<Grid item xs={10}>*/}
          
          {/*</Grid>*/}
          {/*<Grid item xs={1}/>*/}
        </Grid>
      </Card>
      
    );
  }
}

export default withStyles(styles)(SideBar);
