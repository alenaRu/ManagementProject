import * as React from 'react';
import axios from 'axios';
import {withStyles} from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip';
import {grey} from 'material-ui/colors';
import {CircularProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';
import {Add} from 'material-ui-icons';

const styles: any = theme => ({
  root      : {
    width    : '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table     : {
    minWidth: 700
  },
  cell      : {
    maxWidth: 30
  },
  details   : {
    backgroundColor: grey[300]
  },
  detailsRow: {
    width: '100%'
  },
  textField : {
    marginLeft : theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width      : 200
  },
  button    : {
    backgroundColor: theme.palette.primary
  }
});

const columnData: any = [
  {id: 'name', label: 'Name', padding: 'default'},
  {id: 'surname', label: 'Surname', padding: 'default'},
  {id: 'bdate', label: 'Birth Date', padding: 'default'},
  {id: 'admisionYear', label: 'Admission Year', padding: 'checkbox'},
  {id: 'room', label: 'Room', padding: 'checkbox'}
];

class StudentTable extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      stData : /* serverData*/ [],
      data   : [],
      loading: true,
      
      pageNum   : 0,
      rowPerPage: 5,
      orderBy   : columnData[3].id,
      order     : 'asc'
    };
  }
  
  componentDidMount() {
    const {loading, orderBy, order} = this.state;
    const urlForStudents            = 'http://localhost:8080/student/all';
    
    if (loading) {
      axios.get(urlForStudents, {maxRedirects: 0, timeout: 3000})
        .then((response) => {
          console.warn(response, 'getAll-response');
          setTimeout(() => {
            this.setState(
              {
                data   : response.data,
                stData : response.data,
                loading: false
              });
            this.onChangeSort(null, orderBy, order);
          }, 1000);
        })
        .catch(er => console.warn(er, 'getAll-error'))
      ;
    }
  }
  
  componentWillReceiveProps(newProps) {
    const {data}   = this.state;
    const {filter} = newProps;
    
    if (filter) {
      const newData = data.filter((item) => {
        const value = item[filter.column].toString();
        
        return value.toLowerCase().includes(filter.value);
      });
      
      this.setState({
                      stData : newData,
                      pageNum: 0
                    });
    }
  }
  
  render() {
    const {classes, onStudentClick, onCreateStudent}             = this.props;
    const {loading, orderBy, order, stData, pageNum, rowPerPage} = this.state;
    
    if (loading) {
      return (<CircularProgress/> );
    }
    
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding={'default'}>
                <Button aria-label="Back" onClick={onCreateStudent}>
                  <Add color={grey[800]}/>
                  Add student
                </Button>
              </TableCell>
              <TablePagination
                count={stData.length}
                rowsPerPage={rowPerPage}
                page={pageNum}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
              />
            </TableRow>
            <TableRow>
              {columnData.map(column => {
                return (
                  <TableCell
                    key={column.id}
                    padding={column.padding}
                  >
                    <Tooltip
                      title={`Sort by ${column.label}`}
                      placement={'bottom-start'}
                      enterDelay={50}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={order}
                        onClick={this.createSortHandler(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {
              stData.slice(pageNum * rowPerPage, pageNum * rowPerPage + rowPerPage)
                .map((n, index) => {
                  return (
                    <TableRow key={index} hover
                              onClick={() => onStudentClick(n)}>
                      <TableCell className={classes.cell}
                                 padding="dense">{n.name}</TableCell>
                      <TableCell className={classes.cell}
                                 padding="dense">{n.surname}</TableCell>
                      <TableCell className={classes.cell}
                                 padding={'checkbox'}>{n.bdate}</TableCell>
                      <TableCell
                        className={classes.cell}>{n.admisionYear}</TableCell>
                      <TableCell className={classes.cell} padding={'checkbox'}>
                        {n.room}
                      </TableCell>
                    </TableRow>
                  );
                })}
          
          </TableBody>
        </Table>
      </Paper>
    );
  }
  
  onChangePage = (event: object, page: number): void => {
    const {orderBy, order} = this.state;
    this.setState({pageNum: page});
    
    this.onChangeSort(null, orderBy, order);
  };
  
  onChangeRowsPerPage = (event: any): void => {
    const {orderBy, order} = this.state;
    this.setState({rowPerPage: event.target.value});
    
    this.onChangeSort(null, orderBy, order);
  };
  
  createSortHandler = property => event => {
    this.onChangeSort(event, property);
  };
  
  onChangeSort = (event, property, defayltOrder?) => {
    const orderBy = property;
    let order     = defayltOrder || 'desc';
    
    if (this.state.orderBy === property && this.state.order === 'desc') {
      if (!defayltOrder) order = 'asc';
    }
    
    const stData =
            order === 'desc'
              ? this.state.stData.sort((
                                         a,
                                         b
                                       ) => {
                return a[property].toString().trim().localeCompare(b[property]);
              })
              : this.state.stData.sort((
                                         a,
                                         b
                                       ) => {
                return b[property].toString().trim().localeCompare(a[property]);
              });
    
    this.setState({stData, order, orderBy});
  };
}

export default withStyles(styles)(StudentTable);

/* tslint:disable */
// const serverData = [
//   {
//     'parents'     : [
//       {
//         'surname'   : 'Козаченко',
//         'name'      : 'Николай',
//         'patronymic': 'Федоров',
//         'phone'     : '1234567890345'
//       }, {
//         'surname'   : 'Козаченко',
//         'name'      : 'Анна',
//         'patronymic': 'Антоновна',
//         'phone'     : '6547648762347'
//       }
//     ],
//     'surname'     : 'Козаченко',
//     'name'        : 'Юрий',
//     'patronymic'  : 'Николаевич',
//     'passport'    : 'АО 256585',
//     'bdate'       : '1997-04-26',
//     'phone'       : '3214569578552',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2015,
//     'room'        : '615а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Абдуева',
//         'name'      : 'Мурза',
//         'patronymic': 'Ахматова',
//         'phone'     : '9273423779565'
//       }
//     ],
//     'surname'     : 'Абдуев',
//     'name'        : 'Максим',
//     'patronymic'  : 'Романов',
//     'passport'    : 'ВВ 459971',
//     'bdate'       : '1992-11-30',
//     'phone'       : '1762503787859',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2010,
//     'room'        : '917б',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Михайлов',
//         'name'      : 'Сергей',
//         'patronymic': 'Леонидович',
//         'phone'     : '1066014781829'
//       }
//     ],
//     'surname'     : 'Михайлова',
//     'name'        : 'Татьяна',
//     'patronymic'  : 'Сергеевна',
//     'passport'    : 'АВ 773125',
//     'bdate'       : '1997-02-13',
//     'phone'       : '4574499152993',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '809б',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Саргерос',
//         'name'      : 'Не',
//         'patronymic': 'Помню',
//         'phone'     : '2039475525890'
//       }
//     ],
//     'surname'     : 'Саргерос',
//     'name'        : 'Хой',
//     'patronymic'  : 'Неичь',
//     'passport'    : 'АО 161718',
//     'bdate'       : '1985-01-01',
//     'phone'       : '3587722882242',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2000,
//     'room'        : '717у',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Антиопа',
//         'name'      : 'Арес',
//         'patronymic': 'Никифорович',
//         'phone'     : '6619970275636'
//       }, {
//         'surname'   : 'Антиопа',
//         'name'      : 'Амана',
//         'patronymic': 'Харитоновна',
//         'phone'     : '2725632310083'
//       }
//     ],
//     'surname'     : 'Антиопа',
//     'name'        : 'Диана',
//     'patronymic'  : 'Аресовна',
//     'passport'    : 'СО 456585',
//     'bdate'       : '2000-05-05',
//     'phone'       : '7937130937654',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '106а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Антиопа',
//         'name'      : 'Арес',
//         'patronymic': 'Никифорович',
//         'phone'     : '6619970275636'
//       }, {
//         'surname'   : 'Антиопа',
//         'name'      : 'Амана',
//         'patronymic': 'Харитоновна',
//         'phone'     : '2725632310083'
//       }
//     ],
//     'surname'     : 'Антиопа',
//     'name'        : 'Марк',
//     'patronymic'  : 'Аресович',
//     'passport'    : 'ОО 967133',
//     'bdate'       : '2000-05-05',
//     'phone'       : '5798948864489',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '119а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Ольга ',
//         'patronymic': 'Максимовна',
//         'phone'     : '2011003274235'
//       }, {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Хо',
//         'patronymic': 'Цинь',
//         'phone'     : '1425476169809'
//       }
//     ],
//     'surname'     : 'Шаньтье',
//     'name'        : 'Брысь',
//     'patronymic'  : 'Хоевич',
//     'passport'    : 'ВВ 394025',
//     'bdate'       : '1998-12-24',
//     'phone'       : '3060928451680',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2015,
//     'room'        : '444а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Ольга ',
//         'patronymic': 'Максимовна',
//         'phone'     : '2011003274235'
//       }, {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Хо',
//         'patronymic': 'Цинь',
//         'phone'     : '1425476169809'
//       }
//     ],
//     'surname'     : 'Шаньтье',
//     'name'        : 'Кусь',
//     'patronymic'  : 'Хоевич',
//     'passport'    : 'АЕ 358879',
//     'bdate'       : '1999-12-24',
//     'phone'       : '6987894754423',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2016,
//     'room'        : '201а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Ольга ',
//         'patronymic': 'Максимовна',
//         'phone'     : '2011003274235'
//       }, {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Хо',
//         'patronymic': 'Цинь',
//         'phone'     : '1425476169809'
//       }
//     ],
//     'surname'     : 'Шаньтье',
//     'name'        : 'Лизь',
//     'patronymic'  : 'Хоевич',
//     'passport'    : 'АК 883155',
//     'bdate'       : '2000-12-24',
//     'phone'       : '5282769002959',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '201а',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Ольга ',
//         'patronymic': 'Максимовна',
//         'phone'     : '2011003274235'
//       }, {
//         'surname'   : 'Шаньтье',
//         'name'      : 'Хо',
//         'patronymic': 'Цинь',
//         'phone'     : '1425476169809'
//       }
//     ],
//     'surname'     : 'Шаньтье',
//     'name'        : 'Лабки',
//     'patronymic'  : 'Хоевна',
//     'passport'    : 'ВВ 457414',
//     'bdate'       : '2001-12-24',
//     'phone'       : '8015327046535',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '505у',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Малескин',
//         'name'      : 'Тралл',
//         'patronymic': 'Оркович',
//         'phone'     : '0696025999305'
//       }, {
//         'surname'   : 'Малескин',
//         'name'      : 'Серсея',
//         'patronymic': 'Игоревна',
//         'phone'     : '2962845114872'
//       }
//     ],
//     'surname'     : 'Малескин',
//     'name'        : 'Антон',
//     'patronymic'  : 'Траллович',
//     'passport'    : 'АТ 659912',
//     'bdate'       : '1990-09-17',
//     'phone'       : '5418036278144',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2002,
//     'room'        : '150у',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Файролл',
//         'name'      : 'Харитон',
//         'patronymic': 'Никифорович',
//         'phone'     : '1288485205624',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/12'
//             }, {
//               'href': 'http://localhost:8080/students/13'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Файрол',
//     'name'        : 'Николай',
//     'patronymic'  : 'Харитонов',
//     'passport'    : 'АВ 445566',
//     'bdate'       : '1976-04-24',
//     'phone'       : '2642119218413',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/2'
//           }, {
//             'href': 'http://localhost:8080/students/11'
//           }, {
//             'href': 'http://localhost:8080/students/12'
//           }, {
//             'href': 'http://localhost:8080/students/14'
//           }, {
//             'href': 'http://localhost:8080/students/15'
//           }, {
//             'href': 'http://localhost:8080/students/20'
//           }, {
//             'href': 'http://localhost:8080/students/21'
//           }
//         ]
//       }
//     },
//     'admisionYear': 1995,
//     'room'        : '176б',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/12'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/12'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Файролл',
//         'name'      : 'Харитон',
//         'patronymic': 'Никифорович',
//         'phone'     : '1288485205624',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/12'
//             }, {
//               'href': 'http://localhost:8080/students/13'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Файрол',
//     'name'        : 'Анастасия',
//     'patronymic'  : 'Харитонвна',
//     'passport'    : 'ВВ 736610',
//     'bdate'       : '1980-10-02',
//     'phone'       : '4538886517990',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/4'
//           }, {
//             'href': 'http://localhost:8080/students/5'
//           }, {
//             'href': 'http://localhost:8080/students/6'
//           }, {
//             'href': 'http://localhost:8080/students/10'
//           }, {
//             'href': 'http://localhost:8080/students/13'
//           }, {
//             'href': 'http://localhost:8080/students/18'
//           }, {
//             'href': 'http://localhost:8080/students/22'
//           }
//         ]
//       }
//     },
//     'admisionYear': 1999,
//     'room'        : '840б',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/13'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/13'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Поттер',
//         'name'      : 'Джинни',
//         'patronymic': 'Артуровна',
//         'phone'     : '2687101643785',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }, {
//         'surname'   : 'Поттер',
//         'name'      : 'Гарри',
//         'patronymic': 'Джеймсович',
//         'phone'     : '3589080020786',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Поттер',
//     'name'        : 'Сириус',
//     'patronymic'  : 'Гарриев',
//     'passport'    : 'УК 248625',
//     'bdate'       : '1996-05-11',
//     'phone'       : '8048524297731',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/2'
//           }, {
//             'href': 'http://localhost:8080/students/11'
//           }, {
//             'href': 'http://localhost:8080/students/12'
//           }, {
//             'href': 'http://localhost:8080/students/14'
//           }, {
//             'href': 'http://localhost:8080/students/15'
//           }, {
//             'href': 'http://localhost:8080/students/20'
//           }, {
//             'href': 'http://localhost:8080/students/21'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2015,
//     'room'        : '934а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/14'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/14'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Поттер',
//         'name'      : 'Джинни',
//         'patronymic': 'Артуровна',
//         'phone'     : '2687101643785',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }, {
//         'surname'   : 'Поттер',
//         'name'      : 'Гарри',
//         'patronymic': 'Джеймсович',
//         'phone'     : '3589080020786',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Поттер',
//     'name'        : 'Альбус',
//     'patronymic'  : 'Гарриев',
//     'passport'    : 'СС 978814',
//     'bdate'       : '1998-03-19',
//     'phone'       : '0020131935455',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/2'
//           }, {
//             'href': 'http://localhost:8080/students/11'
//           }, {
//             'href': 'http://localhost:8080/students/12'
//           }, {
//             'href': 'http://localhost:8080/students/14'
//           }, {
//             'href': 'http://localhost:8080/students/15'
//           }, {
//             'href': 'http://localhost:8080/students/20'
//           }, {
//             'href': 'http://localhost:8080/students/21'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2016,
//     'room'        : '934а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/15'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/15'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Поттер',
//         'name'      : 'Джинни',
//         'patronymic': 'Артуровна',
//         'phone'     : '2687101643785',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }, {
//         'surname'   : 'Поттер',
//         'name'      : 'Гарри',
//         'patronymic': 'Джеймсович',
//         'phone'     : '3589080020786',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/14'
//             }, {
//               'href': 'http://localhost:8080/students/16'
//             }, {
//               'href': 'http://localhost:8080/students/15'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Поттер',
//     'name'        : 'Лили',
//     'patronymic'  : 'ГАрриевна',
//     'passport'    : 'ОВ 162644',
//     'bdate'       : '1999-09-27',
//     'phone'       : '1806649221543',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/1'
//           }, {
//             'href': 'http://localhost:8080/students/3'
//           }, {
//             'href': 'http://localhost:8080/students/7'
//           }, {
//             'href': 'http://localhost:8080/students/8'
//           }, {
//             'href': 'http://localhost:8080/students/9'
//           }, {
//             'href': 'http://localhost:8080/students/16'
//           }, {
//             'href': 'http://localhost:8080/students/17'
//           }, {
//             'href': 'http://localhost:8080/students/19'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2018,
//     'room'        : '809а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/16'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/16'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Уизли',
//         'name'      : 'Рон',
//         'patronymic': 'Артурович',
//         'phone'     : '5709614421891',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/17'
//             }, {
//               'href': 'http://localhost:8080/students/20'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Уизли',
//     'name'        : 'Роза',
//     'patronymic'  : 'Роновна',
//     'passport'    : 'ВВ131723',
//     'bdate'       : '1999-06-12',
//     'phone'       : '4131071148397',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/1'
//           }, {
//             'href': 'http://localhost:8080/students/3'
//           }, {
//             'href': 'http://localhost:8080/students/7'
//           }, {
//             'href': 'http://localhost:8080/students/8'
//           }, {
//             'href': 'http://localhost:8080/students/9'
//           }, {
//             'href': 'http://localhost:8080/students/16'
//           }, {
//             'href': 'http://localhost:8080/students/17'
//           }, {
//             'href': 'http://localhost:8080/students/19'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2018,
//     'room'        : '809а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/17'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/17'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Грейнджер',
//         'name'      : 'Гермиона',
//         'patronymic': 'Уеонделовна',
//         'phone'     : '5124702678219',
//         '_links'    : {
//           'students': {
//             'href': 'http://localhost:8080/students/18'
//           }
//         }
//       }
//     ],
//     'surname'     : 'Грейнджер',
//     'name'        : 'Хьюго',
//     'patronymic'  : 'Гемионов',
//     'passport'    : 'АО 784496',
//     'bdate'       : '1998-12-18',
//     'phone'       : '9104972977660',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/4'
//           }, {
//             'href': 'http://localhost:8080/students/5'
//           }, {
//             'href': 'http://localhost:8080/students/6'
//           }, {
//             'href': 'http://localhost:8080/students/10'
//           }, {
//             'href': 'http://localhost:8080/students/13'
//           }, {
//             'href': 'http://localhost:8080/students/18'
//           }, {
//             'href': 'http://localhost:8080/students/22'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2017,
//     'room'        : '505у',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/18'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/18'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Делакур',
//         'name'      : 'Флёр',
//         'patronymic': 'Апполионна',
//         'phone'     : '7595367980294',
//         '_links'    : {
//           'students': {
//             'href': 'http://localhost:8080/students/19'
//           }
//         }
//       }
//     ],
//     'surname'     : 'Делакур',
//     'name'        : 'Мари',
//     'patronymic'  : 'Билловна',
//     'passport'    : 'ША 357268',
//     'bdate'       : '1995-07-01',
//     'phone'       : '6388267164563',
//     'speciality'  : {
//       'name'     : 'Software engineering',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/1'
//           }, {
//             'href': 'http://localhost:8080/students/3'
//           }, {
//             'href': 'http://localhost:8080/students/7'
//           }, {
//             'href': 'http://localhost:8080/students/8'
//           }, {
//             'href': 'http://localhost:8080/students/9'
//           }, {
//             'href': 'http://localhost:8080/students/16'
//           }, {
//             'href': 'http://localhost:8080/students/17'
//           }, {
//             'href': 'http://localhost:8080/students/19'
//           }
//         ]
//       }
//     },
//     'admisionYear': 2014,
//     'room'        : '629а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/19'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/19'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Уизли',
//         'name'      : 'Рон',
//         'patronymic': 'Артурович',
//         'phone'     : '5709614421891',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/17'
//             }, {
//               'href': 'http://localhost:8080/students/20'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : 'Уизли',
//     'name'        : 'Билл',
//     'patronymic'  : 'Артуров',
//     'passport'    : 'ША 178829',
//     'bdate'       : '1989-12-06',
//     'phone'       : '4299801274126',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       },
//       '_links'   : {
//         'students': [
//           {
//             'href': 'http://localhost:8080/students/2'
//           }, {
//             'href': 'http://localhost:8080/students/11'
//           }, {
//             'href': 'http://localhost:8080/students/12'
//           }, {
//             'href': 'http://localhost:8080/students/14'
//           }, {
//             'href': 'http://localhost:8080/students/15'
//           }, {
//             'href': 'http://localhost:8080/students/20'
//           }, {
//             'href': 'http://localhost:8080/students/21'
//           }
//         ]
//       }
//     },
//     'admisionYear': 1992,
//     'room'        : '408а',
//     'notes'       : '',
//     '_links'      : {
//       'self'   : {
//         'href': 'http://localhost:8080/students/20'
//       },
//       'student': {
//         'href': 'http://localhost:8080/students/20'
//       }
//     }
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Малескин',
//         'name'      : 'Тралл',
//         'patronymic': 'Оркович',
//         'phone'     : '0696025999305',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/11'
//             }, {
//               'href': 'http://localhost:8080/students/21'
//             }
//           ]
//         }
//       }, {
//         'surname'   : 'Малескин',
//         'name'      : 'Серсея',
//         'patronymic': 'Игоревна',
//         'phone'     : '2962845114872',
//         '_links'    : {
//           'students': [
//             {
//               'href': 'http://localhost:8080/students/11'
//             }, {
//               'href': 'http://localhost:8080/students/21'
//             }
//           ]
//         }
//       }
//     ],
//     'surname'     : ' Малескин',
//     'name'        : 'Евгений',
//     'patronymic'  : 'Кириллов',
//     'passport'    : 'КА 987868',
//     'bdate'       : '1989-12-31',
//     'phone'       : '2184550525942',
//     'speciality'  : {
//       'name'     : 'Computer Information Tecnology',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 1998,
//     'room'        : '745у',
//     'notes'       : ''
//   }, {
//     'parents'     : [
//       {
//         'surname'   : 'Михайлов',
//         'name'      : 'Сергей',
//         'patronymic': 'Леонидович',
//         'phone'     : '1066014781829'
//       }
//     ],
//     'surname'     : 'Михайлова',
//     'name'        : 'Ольга',
//     'patronymic'  : 'Маркова',
//     'passport'    : 'АВ 968611',
//     'bdate'       : '1994-02-16',
//     'phone'       : '3003488981064',
//     'speciality'  : {
//       'name'     : 'Computer Systems And Networks',
//       'institute': {
//         'name': 'ICIT'
//       }
//     },
//     'admisionYear': 2016,
//     'room'        : '749а',
//     'notes'       : ''
//   }
// ];
/* tslint:enable */
