import * as React from 'react';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root : {
    padding: 20,
  },
  item: {
    height: 240,
    borderRadius: 15,
    padding: 10,
  }
});

const mockData = (() => {
  const arr = [];
  
  for (let i = 0; i < 24; i++) arr.push(i + 1);
  
  return arr;
})();

class ItemList extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {data: mockData};
  }
  
  render() {
    const {classes, onItemClick} = this.props;
    const {data}        = this.state;
    
    return (
        <Grid container spacing={24} className={classes.root} justify={'space-around'}>
          {
            data.map((item, index) => {
              return (
                <Grid item xs={4} key={index} onClick={onItemClick}>
                  <Card className={classes.item}>
                    <Typography type="display3">
                      {item}
                    </Typography>
                  </Card>
                </Grid>
              );
            })
          }
          {/*<Grid item xs={2}/>*/}
          {/*<Grid item xs={8}>*/}
          
          {/*</Grid>*/}
          {/*<Grid item xs={2}/>*/}
          
          {/*<Grid item xs={1}/>*/}
          {/*<Grid item xs={10}>*/}
          
          {/*</Grid>*/}
          {/*<Grid item xs={1}/>*/}
        </Grid>
    );
  }
}

export default withStyles(styles)(ItemList);
