import * as React from 'react';
import './../assets/scss/App.scss';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import {lightGreen, yellow, red} from 'material-ui/colors';
import {MuiThemeProvider} from 'material-ui';
import Header from './Header';
import Content from './Content';

const theme = createMuiTheme({
                               palette: {
                                 primary  : lightGreen,
                                 secondary: yellow,
                                 error    : red
                               }
                             });

export enum Pages {
  LOGIN    = 'LOGIN',
  REGISTER = 'REGISTER ',
  ITEMLIST = 'ITEMLIST',
  ITEM     = 'ITEM',
  PROFILE  = 'PROFILE',
  CART     = 'CART',
  ADMIN    = '  ADMIN'
}

export default class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    this.state = {
      page: Pages.ITEMLIST,
      cart: [1, 2],
      user: null
    };
  }
  
  goToPage = (page: Pages) => {
    console.warn(`On Page: ${page}`);
    this.setState({page});
  };
  
  render() {
    const {page, cart, user} = this.state;
    
    return (
      <div className="app">
        <MuiThemeProvider theme={theme}>
          <Header
            page={page}
            cart={cart}
            user={user}
            onSignIn={() => this.goToPage(Pages.LOGIN)}
            onSignOut={() => {}}
            onRegister={() => this.goToPage(Pages.REGISTER)}
            onCart={() => this.goToPage(Pages.CART)}
            onLogo={() => this.goToPage(Pages.ITEMLIST)}
          />
          <Content page={page} goToPage={this.goToPage}/>
        </MuiThemeProvider>
      </div>
    );
  }
}

