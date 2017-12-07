import * as React from 'react';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';
import {ShoppingCart} from 'material-ui-icons';
import {grey} from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import {Pages} from './App';
// import IconButton from 'material-ui/IconButton';
// import Menu from 'mdi-material-ui/Menu';
// import common from 'material-ui/colors/common';

const styles: any = theme => ({
  root   : {
    width   : '100%',
    height  : 75,
    top     : -75,
    position: 'absolute'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

class Header extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  
  renderButtons = () => {
    const {
            page, cart, user, onSignIn, onSignOut, onRegister, onCart, classes
          } = this.props;

    const emptyItem = (<Grid item lg={1} hidden={{mdDown: true}}
                             className={classes.button}/>);
    
    const cartButton = cart.length > 0 ? (
      <Button color="contrast" aria-label="Cart" onClick={onCart}>
        <ShoppingCart color={grey[800]}/>{cart.length}
      </Button>
    ) : emptyItem;
    
    const logoutButton = user ? (
      <Button aria-label="Sign out" onClick={onSignOut}>
        Sign out
      </Button>
    ) : null;
    
    const regButton = (
      <Button aria-label="Register" onClick={onRegister}>
        Register
      </Button>
    );
    
    const loginButton = (
      <Grid item sm={2} lg={1} hidden={{xsDown: true}}
            className={classes.button}>
        <Button aria-label="Register" onClick={onSignIn}>
          Sign In
        </Button>
      </Grid>
    );
    
    if (page === Pages.LOGIN) {
      return [cartButton, regButton];
    }
    else if (page === Pages.REGISTER) {
      return [cartButton, loginButton];
    }
    else {
      return user
        ? [cartButton, logoutButton]
        : [cartButton, loginButton, regButton]
    }
  }
  
  render() {
    const {classes, onLogo} = this.props;

    return (
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Grid container spacing={24} alignItems={'center'}>
            <Grid item xs={12} sm={6} lg={4}>
              <Typography type="display3" onClick={onLogo}>
                Play store
              </Typography>
            </Grid>
            <Grid item lg={5} hidden={{mdDown: true}}/>
            <Grid item sm={6} lg={3} hidden={{xsDown: true}}
                  className={classes.buttons}>
              {this.renderButtons()}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
  
};

export default withStyles(styles)(Header);
