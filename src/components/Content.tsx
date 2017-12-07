import * as React from 'react';
import Grid from 'material-ui/Grid';
import withStyles from 'material-ui/styles/withStyles';
import Sidebar from './Sidebar';
import ItemList from './ItemList';
import {Pages} from './App';
import SignInPage from './SignInPage';

const styles = theme => ({
  root : {
    flexGrow : 1,
    marginTop: 75
  },
  paper: {
    padding  : 16,
    textAlign: 'center',
    height   : 1300,
    color    : theme.palette.text.secondary
  }
});

class Content extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    const {classes, page, goToPage} = this.props;
    const {}                        = this.state;
    
    return (
      <Grid container spacing={0} className={classes.root}>
        {
          (_page => {
            if (_page === Pages.ITEMLIST) {
              return [
                (<Grid item xs={3}>
                  <Sidebar/>
                </Grid>),
                (<Grid item xs={9}>
                  <ItemList onItemClick={() => goToPage(Pages.ITEM)}/>
                </Grid>)
              ];
            }
            else if (_page === Pages.LOGIN) {
              return [
                (<Grid item xs={3}/>),
                (
                  <Grid item xs={6}>
                    <SignInPage
                      onBack={() => goToPage(Pages.ITEMLIST)}
                      onSubmit={() => goToPage(Pages.PROFILE)}
                    />
                  </Grid>
                ),
                (<Grid item xs={3}/>)
              ];
            }
            
          })(page)
        }
      
      </Grid>
    );
  }
}

export default withStyles(styles)(Content);
